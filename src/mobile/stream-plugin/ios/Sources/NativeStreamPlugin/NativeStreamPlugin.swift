import Capacitor
import Foundation

/**
 * A native HTTP bridge that hands the response body to JS as it arrives.
 *
 * CapacitorHttp resolves only once the whole body has downloaded, so a long-lived stream shows nothing until it ends.
 * This runs requests through a delegate-based `URLSession` that forwards each chunk instead. Like the WebSocket plugin,
 * the session uses `HTTPCookieStorage.shared`, so requests carry the same cookies (incl. HttpOnly) as CapacitorHttp.
 *
 * Events are emitted via `notifyListeners` and demultiplexed on the JS side by `requestId`:
 *   - "response" { requestId, status, headers }
 *   - "data"     { requestId, data } (base64)
 *   - "end"      { requestId }
 *   - "error"    { requestId, message }
 */
@objc(NativeStreamPlugin)
public class NativeStreamPlugin: CAPPlugin, CAPBridgedPlugin, URLSessionDataDelegate {
    public let identifier = "NativeStreamPlugin"
    public let jsName = "NativeStream"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "request", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "cancel", returnType: CAPPluginReturnPromise)
    ]

    private var session: URLSession!
    private let lock = NSLock()
    private var tasks: [String: URLSessionDataTask] = [:]

    override public func load() {
        let config = URLSessionConfiguration.default
        config.httpCookieStorage = HTTPCookieStorage.shared
        config.httpShouldSetCookies = true
        config.httpCookieAcceptPolicy = .always
        session = URLSession(configuration: config, delegate: self, delegateQueue: nil)
    }

    @objc func request(_ call: CAPPluginCall) {
        guard let urlString = call.getString("url"), let url = URL(string: urlString),
              url.scheme == "http" || url.scheme == "https" else {
            call.reject("Must provide a valid http(s) url")
            return
        }
        guard let id = call.getString("requestId") else {
            call.reject("Must provide a requestId")
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = call.getString("method") ?? "GET"
        for (name, value) in call.getObject("headers") ?? [:] {
            if let value = value as? String {
                request.setValue(value, forHTTPHeaderField: name)
            }
        }
        request.httpBody = call.getString("body")?.data(using: .utf8)

        lock.lock()
        guard tasks[id] == nil else {
            lock.unlock()
            call.reject("A request already exists for id \(id)")
            return
        }
        let task = session.dataTask(with: request)
        task.taskDescription = id
        tasks[id] = task
        lock.unlock()

        task.resume()
        call.resolve()
    }

    @objc func cancel(_ call: CAPPluginCall) {
        guard let id = call.getString("requestId") else {
            call.reject("Must provide a requestId")
            return
        }

        removeTask(id)?.cancel()
        call.resolve()
    }

    // MARK: - Internals

    @discardableResult
    private func removeTask(_ id: String) -> URLSessionDataTask? {
        lock.lock()
        defer { lock.unlock() }
        return tasks.removeValue(forKey: id)
    }

    // MARK: - URLSessionDataDelegate

    public func urlSession(
        _ session: URLSession,
        dataTask: URLSessionDataTask,
        didReceive response: URLResponse,
        completionHandler: @escaping (URLSession.ResponseDisposition) -> Void
    ) {
        if let id = dataTask.taskDescription, let response = response as? HTTPURLResponse {
            var headers: [String: String] = [:]
            for (name, value) in response.allHeaderFields {
                if let name = name as? String, let value = value as? String {
                    headers[name] = value
                }
            }
            notifyListeners("response", data: ["requestId": id, "status": response.statusCode, "headers": headers])
        }
        completionHandler(.allow)
    }

    public func urlSession(_ session: URLSession, dataTask: URLSessionDataTask, didReceive data: Data) {
        guard let id = dataTask.taskDescription else { return }
        notifyListeners("data", data: ["requestId": id, "data": data.base64EncodedString()])
    }

    public func urlSession(_ session: URLSession, task: URLSessionTask, didCompleteWithError error: Error?) {
        // A cancelled task was already removed by cancel(), so JS hears nothing more about it.
        guard let id = task.taskDescription, removeTask(id) != nil else { return }

        if let error = error {
            notifyListeners("error", data: ["requestId": id, "message": error.localizedDescription])
        } else {
            notifyListeners("end", data: ["requestId": id])
        }
    }
}
