import { registerPlugin } from '@capacitor/core'
import type { PluginListenerHandle } from '@capacitor/core'

/**
 * Bridge to a native WebSocket plugin whose handshake reads from the same native cookie store as CapacitorHttp and
 * therefore carries the HttpOnly auth cookie the WebView `WebSocket` cannot reliably access.
 */
interface NativeWebSocketEvent {
  connectionId: string
  data?: string
  code?: number
  reason?: string
  message?: string
}

interface NativeWebSocketPlugin {
  connect(options: { url: string; connectionId: string }): Promise<void>
  send(options: { connectionId: string; data: string }): Promise<void>
  close(options: { connectionId: string }): Promise<void>
  addListener(
    eventName: 'open' | 'message' | 'close' | 'error',
    listenerFunc: (event: NativeWebSocketEvent) => void
  ): Promise<PluginListenerHandle>
}

const NativeWebSocket = registerPlugin<NativeWebSocketPlugin>('NativeWebSocket')

/**
 * Adapter exposing the subset of the `WebSocket` interface that `Login.ts` relies on (`readyState`, `addEventListener`
 * for open/message/close/error, `send`, `close`), backed by the native plugin. Instances are demultiplexed by a unique
 * `connectionId` so multiple sockets (e.g. across reconnects) don't cross wires.
 */
class NativeWebSocketAdapter extends EventTarget {
  static readonly CONNECTING = 0
  static readonly OPEN = 1
  static readonly CLOSING = 2
  static readonly CLOSED = 3

  readonly CONNECTING = 0
  readonly OPEN = 1
  readonly CLOSING = 2
  readonly CLOSED = 3

  readyState = 0

  private readonly id = `consumables-${Date.now()}-${Math.random().toString(36).slice(2)}`
  private handles: Promise<PluginListenerHandle>[] = []

  constructor (url: string) {
    super()
    void this.setup(url)
  }

  private async setup (url: string) {
    this.handles = [
      NativeWebSocket.addListener('open', (event) => {
        if (event.connectionId !== this.id) return
        this.readyState = this.OPEN
        this.dispatchEvent(new Event('open'))
      }),
      NativeWebSocket.addListener('message', (event) => {
        if (event.connectionId !== this.id) return
        this.dispatchEvent(new MessageEvent('message', { data: event.data }))
      }),
      NativeWebSocket.addListener('close', (event) => {
        if (event.connectionId !== this.id) return
        this.readyState = this.CLOSED
        void this.cleanup()
        this.dispatchEvent(
          new CloseEvent('close', {
            code: event.code ?? 1006,
            reason: event.reason ?? '',
            wasClean: event.code === 1000
          })
        )
      }),
      NativeWebSocket.addListener('error', (event) => {
        if (event.connectionId !== this.id) return
        this.dispatchEvent(new Event('error'))
      })
    ]

    try {
      await NativeWebSocket.connect({ url, connectionId: this.id })
    } catch (e) {
      this.readyState = this.CLOSED
      this.dispatchEvent(new Event('error'))
      void this.cleanup()
      this.dispatchEvent(new CloseEvent('close', { code: 1006, reason: `${e}`, wasClean: false }))
    }
  }

  send (data: string) {
    void NativeWebSocket.send({ connectionId: this.id, data }).catch(() => {})
  }

  close () {
    this.readyState = this.CLOSING
    void NativeWebSocket.close({ connectionId: this.id }).catch(() => {})
  }

  private async cleanup () {
    const handles = this.handles
    this.handles = []
    for (const handle of handles) {
      // eslint-disable-next-line no-await-in-loop
      await handle.then((h) => h.remove()).catch(() => {})
    }
  }
}

export function createNativeWebSocket (url: string): WebSocket {
  return new NativeWebSocketAdapter(url) as unknown as WebSocket
}
