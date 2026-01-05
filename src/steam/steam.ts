import type { CallbackReturns } from 'steamworks.js/callbacks'
import type { callback } from 'steamworks.js/client'

export type MicroTxnAuthorizationResponse = CallbackReturns[callback.SteamCallback.MicroTxnAuthorizationResponse]

interface Steam {
  getSteamId: () => Promise<string | null>
  getUsername: () => Promise<string | null>
  getCurrentGameLanguage: () => Promise<string | null>
  setRichPresence: (key: string, value?: string) => Promise<void>
  getSessionTicket: () => Promise<string>
  onMicroTxnAuthorizationResponse: (callback: (response: MicroTxnAuthorizationResponse) => void) => void
}

declare global {
  interface Window {
    steam?: Steam
  }
}

export const getSteamId = (): Promise<string | null> => window.steam?.getSteamId() ?? Promise.resolve(null)

export const getUsername = (): Promise<string | null> => window.steam?.getUsername() ?? Promise.resolve(null)

export const getCurrentGameLanguage: Steam['getCurrentGameLanguage'] = () =>
  window.steam?.getCurrentGameLanguage() ?? Promise.resolve(null)

export const setRichPresenceSteam: Steam['setRichPresence'] = (...args) =>
  window.steam?.setRichPresence(...args) ?? Promise.resolve()

export const getSessionTicket = () => window.steam?.getSessionTicket() ?? Promise.resolve(null)

export const onMicroTxnAuthorizationResponse: Steam['onMicroTxnAuthorizationResponse'] = (callback) =>
  window.steam?.onMicroTxnAuthorizationResponse(callback)
