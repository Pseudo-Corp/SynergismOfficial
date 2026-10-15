package cc.pseudocorp.synergism.stream;

import android.util.Base64;
import android.webkit.CookieManager;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.IOException;
import java.io.InputStream;
import java.util.Iterator;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.ResponseBody;

/**
 * Native HTTP bridge that hands the response body to JS as it arrives.
 * CapacitorHttp reads the whole body before resolving, so a long-lived stream
 * shows nothing until it ends. Like the WebSocket plugin, this copies
 * CapacitorHttp's WebKit cookies (including HttpOnly) into the request.
 */
@CapacitorPlugin(name = "NativeStream")
public class NativeStreamPlugin extends Plugin {

    // OkHttp's 10 s default would cut a stream off between heartbeats; 60 s matches URLSession's default on iOS.
    private final OkHttpClient client = new OkHttpClient.Builder().readTimeout(60, TimeUnit.SECONDS).build();
    private final ConcurrentHashMap<String, Call> calls = new ConcurrentHashMap<>();

    @PluginMethod
    public void request(PluginCall call) {
        String url = call.getString("url");
        String requestId = call.getString("requestId");
        if (url == null || !(url.startsWith("http://") || url.startsWith("https://"))) {
            call.reject("Must provide a valid http(s) url");
            return;
        }
        if (requestId == null || requestId.isEmpty()) {
            call.reject("Must provide a requestId");
            return;
        }
        if (calls.containsKey(requestId)) {
            call.reject("A request already exists for id " + requestId);
            return;
        }

        String method = call.getString("method", "GET");
        JSObject headers = call.getObject("headers", new JSObject());
        String body = call.getString("body");

        Request.Builder request = new Request.Builder().url(url);
        Iterator<String> names = headers.keys();
        while (names.hasNext()) {
            String name = names.next();
            request.header(name, headers.getString(name));
        }

        String cookies = CookieManager.getInstance().getCookie(url);
        if (cookies != null && !cookies.isEmpty()) {
            request.header("Cookie", cookies);
        }

        if (method.equals("GET") || method.equals("HEAD")) {
            request.method(method, null);
        } else {
            MediaType contentType = MediaType.parse(headers.getString("content-type", "text/plain;charset=UTF-8"));
            request.method(method, RequestBody.create(body == null ? "" : body, contentType));
        }

        Call httpCall = client.newCall(request.build());
        calls.put(requestId, httpCall);
        httpCall.enqueue(callback(requestId));
        call.resolve();
    }

    @PluginMethod
    public void cancel(PluginCall call) {
        String requestId = call.getString("requestId");
        if (requestId == null) {
            call.reject("Must provide a requestId");
            return;
        }

        Call httpCall = calls.remove(requestId);
        if (httpCall != null) {
            httpCall.cancel();
        }
        call.resolve();
    }

    @Override
    protected void handleOnDestroy() {
        for (Call httpCall : calls.values()) {
            httpCall.cancel();
        }
        calls.clear();
        client.dispatcher().executorService().shutdown();
        client.connectionPool().evictAll();
    }

    private Callback callback(String requestId) {
        return new Callback() {
            @Override
            public void onFailure(Call httpCall, IOException error) {
                fail(requestId, httpCall, error);
            }

            @Override
            public void onResponse(Call httpCall, Response response) {
                try (ResponseBody body = response.body()) {
                    JSObject headers = new JSObject();
                    for (String name : response.headers().names()) {
                        headers.put(name, String.join(", ", response.headers(name)));
                    }

                    JSObject event = event(requestId);
                    event.put("status", response.code());
                    event.put("headers", headers);
                    notifyListeners("response", event);

                    InputStream stream = body.byteStream();
                    byte[] buffer = new byte[8192];
                    int read;
                    while ((read = stream.read(buffer)) != -1) {
                        JSObject chunk = event(requestId);
                        chunk.put("data", Base64.encodeToString(buffer, 0, read, Base64.NO_WRAP));
                        notifyListeners("data", chunk);
                    }

                    if (calls.remove(requestId, httpCall)) {
                        notifyListeners("end", event(requestId));
                    }
                } catch (IOException error) {
                    fail(requestId, httpCall, error);
                }
            }
        };
    }

    private void fail(String requestId, Call httpCall, IOException error) {
        if (!calls.remove(requestId, httpCall)) return;
        JSObject event = event(requestId);
        event.put("message", error.getLocalizedMessage() == null ? "" : error.getLocalizedMessage());
        notifyListeners("error", event);
    }

    private JSObject event(String requestId) {
        JSObject event = new JSObject();
        event.put("requestId", requestId);
        return event;
    }
}
