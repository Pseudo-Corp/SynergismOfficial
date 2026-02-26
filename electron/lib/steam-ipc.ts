import { BrowserWindow, ipcMain } from 'electron'
import steamworks from 'steamworks.js'

const STEAM_APP_ID = 3552310

let steamClient: ReturnType<typeof steamworks.init> | null = null

export function initializeSteam (): boolean {
  try {
    steamClient = steamworks.init(STEAM_APP_ID)

    // Register callback for MicroTxnAuthorizationResponse_t
    // https://partner.steamgames.com/doc/features/microtransactions/implementation#5
    steamClient.callback.register(
      steamworks.SteamCallback.MicroTxnAuthorizationResponse,
      (response) => {
        console.info('MicroTxnAuthorizationResponse received:', response)
        BrowserWindow.getAllWindows()[0]?.webContents.send('steam:microTxnAuthorizationResponse', response)
      }
    )

    return true
  } catch (error) {
    console.error('Failed to initialize Steam:', error)
    return false
  }
}

{
  ipcMain.handle('steam:getSteamId', () => {
    if (!steamClient) return null
    return steamClient.localplayer.getSteamId().steamId64.toString()
  })

  ipcMain.handle('steam:getUsername', () => {
    if (!steamClient) return null
    return steamClient.localplayer.getName()
  })

  ipcMain.handle('steam:getCurrentGameLanguage', () => {
    return steamClient?.apps.currentGameLanguage() ?? null
  })

  ipcMain.handle('steam:setRichPresence', (_, key: string, value?: string) => {
    steamClient?.localplayer.setRichPresence(key, value)
  })

  ipcMain.handle('steam:getSessionTicket', async () => {
    if (!steamClient) return null

    const ticket = await steamClient.auth.getAuthTicketForWebApi('synergism-backend', 60 * 3)
    return ticket.getBytes().toString('hex')
  })

  // Steam Cloud Storage
  const isCloudEnabled = () => steamClient?.cloud.isEnabledForAccount() && steamClient?.cloud.isEnabledForApp()

  ipcMain.handle('steam:cloudFileExists', (_, name: string) => {
    if (!steamClient || !isCloudEnabled()) return false
    return steamClient.cloud.fileExists(name)
  })

  ipcMain.handle('steam:cloudReadFile', (_, name: string) => {
    if (!steamClient || !isCloudEnabled()) return null
    try {
      return steamClient.cloud.readFile(name)
    } catch (error) {
      console.error('Failed to read Steam Cloud file:', error)
      return null
    }
  })

  ipcMain.handle('steam:cloudWriteFile', (_, name: string, content: string) => {
    if (!steamClient || !isCloudEnabled()) return false
    try {
      return steamClient.cloud.writeFile(name, content)
    } catch (error) {
      console.error('Failed to write Steam Cloud file:', error)
      return false
    }
  })

  ipcMain.handle('steam:cloudDeleteFile', (_, name: string) => {
    if (!steamClient || !isCloudEnabled()) return false
    try {
      return steamClient.cloud.deleteFile(name)
    } catch (error) {
      console.error('Failed to delete Steam Cloud file:', error)
      return false
    }
  })

  ipcMain.handle('steam:unlockAchievement', (_, achievementId: string) => {
    if (!steamClient) return false
    try {
      return steamClient.achievement.activate(achievementId)
    } catch (error) {
      console.error('Failed to unlock achievement:', error)
      return false
    }
  })

  ipcMain.handle('steam:getAchievement', (_, achievementId: string) => {
    if (!steamClient) return false
    try {
      return steamClient.achievement.isActivated(achievementId)
    } catch (error) {
      console.error('Failed to get achievement status:', error)
      return null
    }
  })
}

export function enableSteamOverlay () {
  steamworks.electronEnableSteamOverlay()
}
