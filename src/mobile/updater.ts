import { CapacitorUpdater } from '@capgo/capacitor-updater'

export const initLiveUpdates = async () => {
  await CapacitorUpdater.notifyAppReady()
}
