interface Steam {
  getSteamId: () => Promise<string | null>
  getUsername: () => Promise<string | null>
  setRichPresence: (key: string, value?: string) => Promise<void>
  getSessionTicket: () => Promise<string>
}

declare global {
  interface Window {
    steam?: Steam
  }
}

export const getSteamId = (): Promise<string | null> => {
  return window.steam?.getSteamId() ?? Promise.resolve(null)
}

export const getUsername = (): Promise<string | null> => {
  return window.steam?.getUsername() ?? Promise.resolve(null)
}

export const setRichPresenceSteam: Steam['setRichPresence'] = (...args) => {
  return window.steam?.setRichPresence(...args) ?? Promise.resolve()
}

export const getSessionTicket = () => window.steam?.getSessionTicket()
