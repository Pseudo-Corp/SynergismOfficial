import { CapacitorUpdater } from '@capgo/capacitor-updater'
import i18next from 'i18next'
import { DOMCacheGetOrSet } from '../Cache/DOM'
import { flushSaveStorage } from '../saves/SaveStorage'
import { saveSynergy } from '../Synergism'
import { Confirm } from '../UpdateHTML'

const checkForUpdates = async () => {
  const button = DOMCacheGetOrSet('checkMobileUpdates') as HTMLButtonElement
  const status = DOMCacheGetOrSet('mobileUpdateStatus')
  if (button.disabled) return

  button.disabled = true
  status.textContent = i18next.t('mobile.updates.checking')

  try {
    // Older native versions reject even when the server reports no update.
    const latest = await CapacitorUpdater.getLatest().catch((error: unknown) => {
      const message = error instanceof Error
        ? error.message
        : (error as { message?: string } | null)?.message
      if (message === 'no_new_version_available' || message === 'No new version available') {
        return { version: '', kind: 'up_to_date' as const }
      }
      throw error
    })

    if (latest.kind === 'up_to_date' || latest.error === 'no_new_version_available') {
      status.textContent = i18next.t('mobile.updates.upToDate')
      return
    }
    if (latest.breaking) {
      status.textContent = i18next.t('mobile.updates.storeUpdateRequired')
      return
    }
    if (latest.kind === 'blocked') {
      status.textContent = i18next.t('mobile.updates.unavailable')
      return
    }
    if (latest.error || latest.kind === 'failed' || !latest.version) {
      throw new Error('Update check returned an invalid response')
    }

    const { bundle: current } = await CapacitorUpdater.current()
    if (latest.version === current.version) {
      status.textContent = i18next.t('mobile.updates.upToDate')
      return
    }
    if (!latest.url) {
      throw new Error('Update check did not return a download URL')
    }

    status.textContent = i18next.t('mobile.updates.available', { version: latest.version })
    if (!await Confirm(i18next.t('mobile.updates.confirm', { version: latest.version }))) return

    status.textContent = i18next.t('mobile.updates.downloading')
    // Reuse a completed background download when one is already available.
    const { bundles } = await CapacitorUpdater.list()
    const bundle = bundles.find((candidate) =>
      candidate.version === latest.version && (candidate.status === 'pending' || candidate.status === 'success')
    ) ?? await CapacitorUpdater.download({
      url: latest.url,
      version: latest.version,
      checksum: latest.checksum,
      sessionKey: latest.sessionKey,
      manifest: latest.manifest
    })

    status.textContent = i18next.t('mobile.updates.installing')
    // Applying a bundle reloads the app, so persist the latest progress first.
    if (!saveSynergy()) {
      status.textContent = i18next.t('mobile.updates.saveFailed')
      return
    }
    await flushSaveStorage()
    await CapacitorUpdater.set({ id: bundle.id })
  } catch (error) {
    console.error('Failed to check for or apply a mobile update', error)
    status.textContent = i18next.t('mobile.updates.failed')
  } finally {
    button.disabled = false
  }
}

export const initLiveUpdates = async () => {
  if (PLATFORM !== 'mobile') return

  DOMCacheGetOrSet('mobileUpdates').hidden = false
  DOMCacheGetOrSet('checkMobileUpdates').addEventListener('click', checkForUpdates)
  await CapacitorUpdater.notifyAppReady()
}
