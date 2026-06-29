import { KeepAwake } from '@capgo/capacitor-keep-awake'

export const initKeepAwake = async (): Promise<void> => {
  if (PLATFORM !== 'mobile') return

  const { isSupported } = await KeepAwake.isSupported()
  if (!isSupported) return

  await KeepAwake.keepAwake()
}
