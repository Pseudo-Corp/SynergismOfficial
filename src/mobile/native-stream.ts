import { registerPlugin } from '@capacitor/core'
import type { PluginListenerHandle } from '@capacitor/core'

/**
 * Bridge to a native HTTP plugin that streams response bodies. CapacitorHttp resolves only once the whole body has
 * arrived, so `response.body` on mobile never streams. Requests carry the cookies from the same native cookie store.
 */
interface NativeStreamEvent {
  requestId: string
  status?: number
  headers?: Record<string, string>
  data?: string
  message?: string
}

interface NativeStreamPlugin {
  request(options: {
    requestId: string
    url: string
    method: string
    headers: Record<string, string>
    body?: string
  }): Promise<void>
  cancel(options: { requestId: string }): Promise<void>
  addListener(
    eventName: 'response' | 'data' | 'end' | 'error',
    listenerFunc: (event: NativeStreamEvent) => void
  ): Promise<PluginListenerHandle>
}

const NativeStream = registerPlugin<NativeStreamPlugin>('NativeStream')

interface NativeStreamInit {
  method?: string
  headers?: HeadersInit
  body?: string
  signal?: AbortSignal
}

/**
 * `fetch` whose `response.body` is fed chunk by chunk from the native plugin. Resolves once the status and headers
 * arrive; aborting `signal` cancels the native request.
 */
export function nativeStreamFetch (url: string, init: NativeStreamInit = {}): Promise<Response> {
  const { signal } = init

  if (signal?.aborted) {
    return Promise.reject(signal.reason)
  }

  const requestId = crypto.randomUUID()

  return new Promise((resolve, reject) => {
    let controller!: ReadableStreamDefaultController<Uint8Array>
    let responded = false
    let finished = false

    const finish = () => {
      finished = true
      signal?.removeEventListener('abort', onAbort)
      for (const handle of handles) {
        void handle.then((h) => h.remove()).catch(() => {})
      }
    }

    const fail = (error: unknown) => {
      if (finished) return
      finish()

      if (responded) {
        controller.error(error)
      } else {
        reject(error)
      }
    }

    const onAbort = () => {
      void NativeStream.cancel({ requestId }).catch(() => {})
      fail(signal!.reason)
    }

    const body = new ReadableStream<Uint8Array>({
      start (c) {
        controller = c
      },
      cancel () {
        finish()
        void NativeStream.cancel({ requestId }).catch(() => {})
      }
    })

    const handles = [
      NativeStream.addListener('response', (event) => {
        if (event.requestId !== requestId || finished) return
        responded = true
        resolve(new Response(body, { status: event.status, headers: event.headers }))
      }),
      NativeStream.addListener('data', (event) => {
        if (event.requestId !== requestId || finished) return
        controller.enqueue(Uint8Array.from(atob(event.data!), (char) => char.charCodeAt(0)))
      }),
      NativeStream.addListener('end', (event) => {
        if (event.requestId !== requestId || finished) return
        finish()
        controller.close()
      }),
      NativeStream.addListener('error', (event) => {
        if (event.requestId !== requestId) return
        fail(new TypeError(event.message))
      })
    ]

    signal?.addEventListener('abort', onAbort)

    // Listeners must be registered natively before the request starts, or its first events are dropped.
    Promise.all(handles)
      .then(() =>
        NativeStream.request({
          requestId,
          url,
          method: init.method ?? 'GET',
          headers: Object.fromEntries(new Headers(init.headers)),
          body: init.body
        })
      )
      .catch((e) => fail(new TypeError(`${e}`)))
  })
}
