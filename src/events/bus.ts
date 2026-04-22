import type { StorageRetrieveEvent } from './storage-events'

interface GameEvents {
  'storage:save': SynEvent<{ key: string; value: string }>
  'storage:get': StorageRetrieveEvent
}

type TypedBus = Omit<EventTarget, 'addEventListener' | 'removeEventListener' | 'dispatchEvent'> & {
  dispatchEvent(event: GameEvents[keyof GameEvents]): boolean
  addEventListener<K extends keyof GameEvents>(
    type: K,
    listener: (this: EventTarget, event: GameEvents[K]) => void,
    options?: AddEventListenerOptions | boolean
  ): void
  removeEventListener<K extends keyof GameEvents>(
    type: K,
    listener: (this: EventTarget, event: GameEvents[K]) => void,
    options?: EventListenerOptions | boolean
  ): void
}

export const bus = new EventTarget() as TypedBus

export class SynEvent<T> extends CustomEvent<T> {
  constructor (type: string, details?: T) {
    super(type, { detail: details })
  }
}
