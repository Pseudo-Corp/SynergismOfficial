import type { CallbackReturns } from 'steamworks.js/callbacks'
import type { callback } from 'steamworks.js/client'

export type MicroTxnAuthorizationResponse = CallbackReturns[callback.SteamCallback.MicroTxnAuthorizationResponse]

export interface SteamGetUserInfoResponse {
  country: string
  currency: string
  state: string
  status: 'Locked' | 'Active' | 'Trusted'
}

interface Steam {
  getSteamId: () => Promise<string | null>
  getUsername: () => Promise<string | null>
  getCurrentGameLanguage: () => Promise<string | null>
  setRichPresence: (key: string, value?: string) => Promise<void>
  getSessionTicket: () => Promise<string>
  onMicroTxnAuthorizationResponse: (callback: (response: MicroTxnAuthorizationResponse) => void) => void
  // Steam Cloud Storage
  cloudFileExists: (name: string) => Promise<boolean>
  cloudReadFile: (name: string) => Promise<string | null>
  cloudWriteFile: (name: string, content: string) => Promise<boolean>
  cloudDeleteFile: (name: string) => Promise<boolean>
  // Steam Achievements
  unlockAchievement: (achievementId: string) => Promise<void>
  getAchievement: (achievementId: string) => Promise<boolean>
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

// Steam Cloud Storage
export const cloudFileExists: Steam['cloudFileExists'] = (name) =>
  window.steam?.cloudFileExists(name) ?? Promise.resolve(false)

export const cloudReadFile: Steam['cloudReadFile'] = (name) =>
  window.steam?.cloudReadFile(name) ?? Promise.resolve(null)

export const cloudWriteFile: Steam['cloudWriteFile'] = (name, content) =>
  window.steam?.cloudWriteFile(name, content) ?? Promise.resolve(false)

export const cloudDeleteFile: Steam['cloudDeleteFile'] = (name) =>
  window.steam?.cloudDeleteFile(name) ?? Promise.resolve(false)

// Steam Achievements
export const unlockAchievement: Steam['unlockAchievement'] = (achievementId) =>
  window.steam?.unlockAchievement(achievementId) ?? Promise.resolve()

export const getAchievement: Steam['getAchievement'] = (achievementId) =>
  window.steam?.getAchievement(achievementId) ?? Promise.resolve(false)
