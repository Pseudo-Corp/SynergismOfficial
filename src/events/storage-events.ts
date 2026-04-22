import { platform } from '../Config'
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

export const initMobileStorage = async () => {
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

if (platform === 'mobile') {
  bus.addEventListener('storage:save', (event) => {
    localStorage.setItem(event.detail.key, event.detail.value)
    import('@capacitor/preferences').then(({ Preferences }) => {
      Preferences.set({ key: event.detail.key, value: event.detail.value })
    })
  })
} else {
  bus.addEventListener('storage:save', (event) => {
    localStorage.setItem(event.detail.key, event.detail.value)
  })
}
