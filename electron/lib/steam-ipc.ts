import { ipcMain } from 'electron'
import log from 'electron-log/main.js'
import steamworks from 'steamworks.js'

log.initialize()

const STEAM_APP_ID = 3552310

let steamClient: ReturnType<typeof steamworks.init> | null = null

export function initializeSteam (): boolean {
  try {
    steamClient = steamworks.init(STEAM_APP_ID)
    return true
  } catch (error) {
    log.error('Failed to initialize Steam:', error)
    return false
  }
}

// biome-ignore lint/complexity/noUselessLoneBlockStatements: organization
{
  ipcMain.handle('steam:getSteamId', () => {
    if (!steamClient) return null
    return steamClient.localplayer.getSteamId().steamId64.toString()
  })

  ipcMain.handle('steam:getUsername', () => {
    if (!steamClient) return null
    return steamClient.localplayer.getName()
  })

  ipcMain.handle('steam:setRichPresence', (_, key: string, value?: string) => {
    steamClient?.localplayer.setRichPresence(key, value)
  })

  ipcMain.handle('steam:getSessionTicket', async () => {
    if (!steamClient) return null

    const ticket = await steamClient.auth.getAuthTicketForWebApi('synergism-backend', 60 * 3)
    return ticket.getBytes().toString('hex')
  })
}

export function enableSteamOverlay () {
  steamworks.electronEnableSteamOverlay()
}
