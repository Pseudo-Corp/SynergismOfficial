import { bus } from './bus'

export class StorageRetrieveEvent<R = string> extends CustomEvent<{ key: string }> {
  value: R | null = null

  constructor (key: string) {
    super('storage:get', { detail: { key } })
  }
}

export const storageGetItem = (key: string) => {
  const event = new StorageRetrieveEvent(key)
  bus.dispatchEvent(event)
  return event.value
}

export const storageSetItem = (key: string, value: string) => {
  bus.dispatchEvent(new CustomEvent('storage:save', { detail: { key, value } }))
}

export const storageRemoveItem = (key: string) => {
  bus.dispatchEvent(new CustomEvent('storage:remove', { detail: { key } }))
}

export const initMobileStorage = async () => {
  if (PLATFORM !== 'mobile') {
    return
  }

  const { Preferences } = await import('@capacitor/preferences')
  const { keys } = await Preferences.keys()
  await Promise.all(keys.map(async (key: string) => {
    const { value } = await Preferences.get({ key })
    if (value !== null) localStorage.setItem(key, value)
  }))
}

bus.addEventListener('storage:get', (event) => {
  event.value = localStorage.getItem(event.detail.key)
})

const PREFERENCES_SYNC_INTERVAL = 60_000

const pendingPreferences = new Map<string, string | null>()
const lastPreferencesWrite = new Map<string, number>()
let preferencesFlushTail = Promise.resolve()

const flushPreferences = (): Promise<void> => {
  if (pendingPreferences.size === 0) {
    return preferencesFlushTail
  }

  const entries = [...pendingPreferences]
  pendingPreferences.clear()

  const flush = preferencesFlushTail.then(async () => {
    const { Preferences } = await import('@capacitor/preferences')
    const now = Date.now()

    await Promise.all(entries.map(async ([key, value]) => {
      if (value === null) {
        await Preferences.remove({ key })
        lastPreferencesWrite.delete(key)
      } else {
        await Preferences.set({ key, value })
        lastPreferencesWrite.set(key, now)
      }
    }))
  })

  preferencesFlushTail = flush.catch(() => {})
  return flush
}

if (PLATFORM === 'mobile') {
  bus.addEventListener('storage:save', (event) => {
    const { key, value } = event.detail
    localStorage.setItem(key, value)
    pendingPreferences.set(key, value)

    if (Date.now() - (lastPreferencesWrite.get(key) ?? 0) >= PREFERENCES_SYNC_INTERVAL) {
      flushPreferences().catch(console.error)
    }
  })

  bus.addEventListener('storage:remove', (event) => {
    const { key } = event.detail
    localStorage.removeItem(key)
    pendingPreferences.set(key, null)
    flushPreferences().catch(console.error)
  })

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flushPreferences().catch(console.error)
    }
  })

  window.addEventListener('pagehide', () => {
    flushPreferences().catch(console.error)
  })
} else {
  bus.addEventListener('storage:save', (event) => {
    localStorage.setItem(event.detail.key, event.detail.value)
  })

  bus.addEventListener('storage:remove', (event) => {
    localStorage.removeItem(event.detail.key)
  })
}
