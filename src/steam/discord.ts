import type { Presence } from 'discord-rpc'

type PresenceOptions = Omit<Presence, 'instance' | 'buttons'>

interface Discord {
  setRichPresence: (options: PresenceOptions) => Promise<void>
  getEnabled: () => Promise<boolean>
  setEnabled: (enabled: boolean) => Promise<void>
}

declare global {
  interface Window {
    discord?: Discord
  }
}

export const setRichPresenceDiscord: Discord['setRichPresence'] = (options) => {
  return window.discord?.setRichPresence(options) ?? Promise.resolve()
}

export const getDiscordRpcEnabled: Discord['getEnabled'] = () => {
  return window.discord?.getEnabled() ?? Promise.resolve(true)
}

export const setDiscordRpcEnabled: Discord['setEnabled'] = (enabled) => {
  return window.discord?.setEnabled(enabled) ?? Promise.resolve()
}
