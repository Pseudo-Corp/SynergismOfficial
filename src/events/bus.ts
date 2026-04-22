interface GameEvents {
  'my:placeholder:event:khafra:remove:this': CustomEvent
}

type TypedBus = Omit<EventTarget, 'addEventListener' | 'removeEventListener'> & {
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
