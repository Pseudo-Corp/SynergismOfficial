import Capacitor
import Foundation

/**
 * A native WebSocket bridge backed by `URLSessionWebSocketTask`.
 *
 * The WKWebView's own `WebSocket` performs its handshake against the WebView cookie store, which does not reliably
 * receive the HttpOnly auth cookie that `CapacitorHttp` writes into the native `HTTPCookieStorage.shared`. By running
 * the socket through a `URLSession` configured with `HTTPCookieStorage.shared`, the handshake automatically carries the
 * same cookies as `CapacitorHttp` requests, so authenticated connections (e.g. /consumables/connect) succeed on iOS.
 *
 * Events are emitted via `notifyListeners` and demultiplexed on the JS side by `connectionId`:
 *   - "open"    { connectionId }
 *   - "message" { connectionId, data }
 *   - "close"   { connectionId, code, reason }
 *   - "error"   { connectionId, message }
 */
@objc(NativeWebSocketPlugin)
public class NativeWebSocketPlugin: CAPPlugin, CAPBridgedPlugin, URLSessionWebSocketDelegate {
    public let identifier = "NativeWebSocketPlugin"
    public let jsName = "NativeWebSocket"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "connect", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "send", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "close", returnType: CAPPluginReturnPromise)
    ]

    private var session: URLSession!
    private let lock = NSLock()
    private var tasks: [String: URLSessionWebSocketTask] = [:]

    override public func load() {
        let config = URLSessionConfiguration.default
        // Share the cookie jar CapacitorHttp writes to, so the handshake sends the auth cookie (incl. HttpOnly).
        config.httpCookieStorage = HTTPCookieStorage.shared
        config.httpShouldSetCookies = true
        config.httpCookieAcceptPolicy = .always
        session = URLSession(configuration: config, delegate: self, delegateQueue: nil)
    }

    @objc func connect(_ call: CAPPluginCall) {
        guard let urlString = call.getString("url"), let url = URL(string: urlString) else {
            call.reject("Must provide a valid url")
            return
        }
        guard let id = call.getString("connectionId") else {
            call.reject("Must provide a connectionId")
            return
        }

        let task = session.webSocketTask(with: URLRequest(url: url))
        task.taskDescription = id

        lock.lock()
        tasks[id] = task
        lock.unlock()

        receive(id: id, task: task)
        task.resume()
        call.resolve()
    }

    @objc func send(_ call: CAPPluginCall) {
        guard let id = call.getString("connectionId"), let message = call.getString("data") else {
            call.reject("Must provide connectionId and data")
            return
        }

        guard let task = getTask(id) else {
            call.reject("No open connection for id \(id)")
            return
        }

        task.send(.string(message)) { [weak self] error in
            if let error = error {
                self?.notifyListeners("error", data: ["connectionId": id, "message": error.localizedDescription])
            }
        }
        call.resolve()
    }

    @objc func close(_ call: CAPPluginCall) {
        guard let id = call.getString("connectionId") else {
            call.reject("Must provide a connectionId")
            return
        }

        if let task = removeTask(id) {
            task.cancel(with: .goingAway, reason: nil)
        }
        call.resolve()
    }

    // MARK: - Internals

    private func getTask(_ id: String) -> URLSessionWebSocketTask? {
        lock.lock()
        defer { lock.unlock() }
        return tasks[id]
    }

    @discardableResult
    private func removeTask(_ id: String) -> URLSessionWebSocketTask? {
        lock.lock()
        defer { lock.unlock() }
        return tasks.removeValue(forKey: id)
    }

    private func receive(id: String, task: URLSessionWebSocketTask) {
        task.receive { [weak self] result in
            guard let self = self else { return }
            switch result {
            case .failure:
                // The didClose / didComplete delegate callbacks report the terminal state; stop the receive loop.
                return
            case .success(let message):
                switch message {
                case .string(let text):
                    self.notifyListeners("message", data: ["connectionId": id, "data": text])
                case .data(let data):
                    self.notifyListeners(
                        "message",
                        data: ["connectionId": id, "data": data.base64EncodedString(), "binary": true]
                    )
                @unknown default:
                    break
                }

                // Keep listening while the connection is still tracked.
                if self.getTask(id) != nil {
                    self.receive(id: id, task: task)
                }
            }
        }
    }

    // MARK: - URLSessionWebSocketDelegate

    public func urlSession(
        _ session: URLSession,
        webSocketTask: URLSessionWebSocketTask,
        didOpenWithProtocol protocol: String?
    ) {
        guard let id = webSocketTask.taskDescription else { return }
        notifyListeners("open", data: ["connectionId": id])
    }

    public func urlSession(
        _ session: URLSession,
        webSocketTask: URLSessionWebSocketTask,
        didCloseWith closeCode: URLSessionWebSocketTask.CloseCode,
        reason: Data?
    ) {
        guard let id = webSocketTask.taskDescription else { return }
        removeTask(id)
        let reasonString = reason.flatMap { String(data: $0, encoding: .utf8) } ?? ""
        notifyListeners("close", data: ["connectionId": id, "code": closeCode.rawValue, "reason": reasonString])
    }

    // Handshake failures (e.g. auth rejected before a 101 upgrade) surface here without a close frame.
    public func urlSession(_ session: URLSession, task: URLSessionTask, didCompleteWithError error: Error?) {
        guard let id = task.taskDescription else { return }
        let wasTracked = removeTask(id) != nil

        if let error = error {
            notifyListeners("error", data: ["connectionId": id, "message": error.localizedDescription])
        }

        // If didCloseWith already fired it removed the task; only emit a synthetic close when no close frame arrived.
        if wasTracked {
            notifyListeners(
                "close",
                data: ["connectionId": id, "code": error != nil ? 1006 : 1000, "reason": error?.localizedDescription ?? ""]
            )
        }
    }
}
