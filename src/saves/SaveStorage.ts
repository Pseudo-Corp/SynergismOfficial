const SAVE_STORAGE_KEY = 'Synergysave2'
const MOBILE_SAVE_WRITE_INTERVAL = 60_000

interface PendingSave {
  generation: number
  value: string
}

let mobileSaveStorageReady = false
let mobileSaveStorageInitialization: Promise<void> | null = null
let pendingSave: PendingSave | null = null
let latestSaveGeneration = 0
let lastPersistedSaveGeneration = 0
let lastMobileSaveWrite = 0
let saveWriteTail = Promise.resolve()
let activeSaveWrite: Promise<void> | null = null

const initializeMobileSaveStorage = async (): Promise<void> => {
  const { Preferences } = await import('@capacitor/preferences')
  const { value: nativeSave } = await Preferences.get({ key: SAVE_STORAGE_KEY })
  lastMobileSaveWrite = nativeSave === null ? 0 : Date.now()
  mobileSaveStorageReady = true
}

export const initializeSaveStorage = (): Promise<void> => {
  if (PLATFORM !== 'mobile' || mobileSaveStorageReady) {
    return Promise.resolve()
  }

  if (mobileSaveStorageInitialization === null) {
    mobileSaveStorageInitialization = initializeMobileSaveStorage()
      .catch((error: unknown) => {
        mobileSaveStorageInitialization = null
        throw error
      })
  }

  return mobileSaveStorageInitialization
}

const startPendingSaveWrite = (): Promise<void> => {
  if (PLATFORM !== 'mobile' || pendingSave === null) {
    return activeSaveWrite ?? Promise.resolve()
  }

  const save = pendingSave
  pendingSave = null

  const write = saveWriteTail.then(async () => {
    const { Preferences } = await import('@capacitor/preferences')
    await Preferences.set({ key: SAVE_STORAGE_KEY, value: save.value })
  })

  const trackedWrite = write.then(
    () => {
      lastMobileSaveWrite = Date.now()
      lastPersistedSaveGeneration = Math.max(lastPersistedSaveGeneration, save.generation)
      if (activeSaveWrite === trackedWrite) {
        activeSaveWrite = null
      }
    },
    (error: unknown) => {
      lastMobileSaveWrite = 0

      // Keep a failed write for the next autosave/lifecycle flush, unless a newer
      // snapshot has already superseded it.
      if (latestSaveGeneration === save.generation && pendingSave === null) {
        pendingSave = save
      }

      if (activeSaveWrite === trackedWrite) {
        activeSaveWrite = null
      }

      throw error
    }
  )

  activeSaveWrite = trackedWrite
  saveWriteTail = trackedWrite.catch(() => {})
  return trackedWrite
}

export const queueSave = (value: string): boolean => {
  if (PLATFORM !== 'mobile') {
    localStorage.setItem(SAVE_STORAGE_KEY, value)
    return true
  }

  if (!mobileSaveStorageReady) {
    return false
  }

  pendingSave = {
    generation: ++latestSaveGeneration,
    value
  }

  if (activeSaveWrite === null && Date.now() - lastMobileSaveWrite >= MOBILE_SAVE_WRITE_INTERVAL) {
    void startPendingSaveWrite().catch(console.error)
  }

  return true
}

export const flushSaveStorage = async (): Promise<void> => {
  if (PLATFORM !== 'mobile') {
    return
  }

  if (!mobileSaveStorageReady) {
    throw new Error('Mobile save storage has not been initialized.')
  }

  const targetGeneration = latestSaveGeneration
  const write = pendingSave === null ? activeSaveWrite : startPendingSaveWrite()

  if (write !== null) {
    await write
  }

  if (lastPersistedSaveGeneration < targetGeneration && pendingSave !== null) {
    await startPendingSaveWrite()
  }
}

export const persistSave = async (value: string): Promise<void> => {
  if (!queueSave(value)) {
    throw new Error('Mobile save storage has not been initialized.')
  }

  await flushSaveStorage()
}

export const getStoredSave = async (): Promise<string | null> => {
  if (PLATFORM !== 'mobile') {
    return localStorage.getItem(SAVE_STORAGE_KEY)
  }

  if (!mobileSaveStorageReady) {
    throw new Error('Mobile save storage has not been initialized.')
  }

  await flushSaveStorage()
  const { Preferences } = await import('@capacitor/preferences')
  const { value } = await Preferences.get({ key: SAVE_STORAGE_KEY })
  return value
}

if (PLATFORM === 'mobile') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && mobileSaveStorageReady) {
      void flushSaveStorage().catch(console.error)
    }
  })

  window.addEventListener('pagehide', () => {
    if (mobileSaveStorageReady) {
      void flushSaveStorage().catch(console.error)
    }
  })
}
