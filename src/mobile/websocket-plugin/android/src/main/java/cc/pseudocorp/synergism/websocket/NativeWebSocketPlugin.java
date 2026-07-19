package cc.pseudocorp.synergism.websocket;

import android.webkit.CookieManager;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.concurrent.ConcurrentHashMap;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;
import okio.ByteString;

/**
 * Native WebSocket bridge that copies CapacitorHttp's WebKit cookies into the
 * opening handshake. CookieManager#getCookie includes HttpOnly cookies because
 * this code runs natively rather than in JavaScript.
 */
@CapacitorPlugin(name = "NativeWebSocket")
public class NativeWebSocketPlugin extends Plugin {

    private final OkHttpClient client = new OkHttpClient();
    private final ConcurrentHashMap<String, WebSocket> sockets = new ConcurrentHashMap<>();

    @PluginMethod
    public void connect(PluginCall call) {
        String url = call.getString("url");
        String connectionId = call.getString("connectionId");
        if (url == null || !(url.startsWith("ws://") || url.startsWith("wss://"))) {
            call.reject("Must provide a valid WebSocket url");
            return;
        }
        if (connectionId == null || connectionId.isEmpty()) {
            call.reject("Must provide a connectionId");
            return;
        }
        if (sockets.containsKey(connectionId)) {
            call.reject("A connection already exists for id " + connectionId);
            return;
        }

        Request.Builder request = new Request.Builder().url(url);
        String cookieUrl = url.startsWith("wss://")
            ? "https://" + url.substring("wss://".length())
            : "http://" + url.substring("ws://".length());
        String cookies = CookieManager.getInstance().getCookie(cookieUrl);
        if (cookies != null && !cookies.isEmpty()) {
            request.header("Cookie", cookies);
        }

        WebSocket socket = client.newWebSocket(request.build(), listener(connectionId));
        sockets.put(connectionId, socket);
        call.resolve();
    }

    @PluginMethod
    public void send(PluginCall call) {
        String connectionId = call.getString("connectionId");
        String data = call.getString("data");
        if (connectionId == null || data == null) {
            call.reject("Must provide connectionId and data");
            return;
        }

        WebSocket socket = sockets.get(connectionId);
        if (socket == null || !socket.send(data)) {
            call.reject("No open connection for id " + connectionId);
            return;
        }
        call.resolve();
    }

    @PluginMethod
    public void close(PluginCall call) {
        String connectionId = call.getString("connectionId");
        if (connectionId == null) {
            call.reject("Must provide a connectionId");
            return;
        }

        WebSocket socket = sockets.get(connectionId);
        if (socket != null) {
            socket.close(1000, "");
        }
        call.resolve();
    }

    @Override
    protected void handleOnDestroy() {
        for (WebSocket socket : sockets.values()) {
            socket.cancel();
        }
        sockets.clear();
        client.dispatcher().executorService().shutdown();
        client.connectionPool().evictAll();
    }

    private WebSocketListener listener(String connectionId) {
        return new WebSocketListener() {
            @Override
            public void onOpen(WebSocket webSocket, Response response) {
                notifyEvent("open", connectionId, null);
            }

            @Override
            public void onMessage(WebSocket webSocket, String text) {
                JSObject event = event(connectionId);
                event.put("data", text);
                notifyListeners("message", event);
            }

            @Override
            public void onMessage(WebSocket webSocket, ByteString bytes) {
                JSObject event = event(connectionId);
                event.put("data", bytes.base64());
                event.put("binary", true);
                notifyListeners("message", event);
            }

            @Override
            public void onClosing(WebSocket webSocket, int code, String reason) {
                webSocket.close(code, reason);
            }

            @Override
            public void onClosed(WebSocket webSocket, int code, String reason) {
                if (!sockets.remove(connectionId, webSocket)) return;
                JSObject event = event(connectionId);
                event.put("code", code);
                event.put("reason", reason);
                notifyListeners("close", event);
            }

            @Override
            public void onFailure(WebSocket webSocket, Throwable error, Response response) {
                if (!sockets.remove(connectionId, webSocket)) return;
                notifyEvent("error", connectionId, error.getLocalizedMessage());
                JSObject event = event(connectionId);
                event.put("code", 1006);
                event.put("reason", error.getLocalizedMessage() == null ? "" : error.getLocalizedMessage());
                notifyListeners("close", event);
            }
        };
    }

    private void notifyEvent(String name, String connectionId, String message) {
        JSObject event = event(connectionId);
        if (message != null) event.put("message", message);
        notifyListeners(name, event);
    }

    private JSObject event(String connectionId) {
        JSObject event = new JSObject();
        event.put("connectionId", connectionId);
        return event;
    }
}
