import type { PresenceOptions } from '../../electron/lib/discord'

interface Discord {
  setRichPresence: (options: PresenceOptions) => Promise<void>
}

declare global {
  interface Window {
    discord?: Discord
  }
}

export const setRichPresenceDiscord: Discord['setRichPresence'] = (options) => {
  return window.discord?.setRichPresence(options) ?? Promise.resolve()
}
