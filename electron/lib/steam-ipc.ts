import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import { SteamworksSDK } from 'steamworks-ffi-node'

const STEAM_APP_ID = 3552310

let steamClient: SteamworksSDK | null = null

export function initializeSteam (): boolean {
  try {
    const sdk = SteamworksSDK.getInstance()

    if (app.isPackaged) {
      sdk.setSdkPath(path.join(process.resourcesPath, 'steamworks_sdk'))
    }

    if (!sdk.init({ appId: STEAM_APP_ID })) {
      return false
    }

    steamClient = sdk
    setInterval(() => sdk.runCallbacks(), 1000 / 30)

    // Register callback for MicroTxnAuthorizationResponse_t
    // https://partner.steamgames.com/doc/features/microtransactions/implementation#5
    sdk.user.onMicroTxnAuthorizationResponse((response) => {
      console.info('MicroTxnAuthorizationResponse received:', response)
      BrowserWindow.getAllWindows()[0]?.webContents.send('steam:microTxnAuthorizationResponse', response)
    })

    return true
  } catch (error) {
    console.error('Failed to initialize Steam:', error)
    return false
  }
}

{
  ipcMain.handle('steam:getSteamId', () => {
    if (!steamClient) return null
    return steamClient.getStatus().steamId
  })

  ipcMain.handle('steam:getUsername', () => {
    if (!steamClient) return null
    return steamClient.friends.getPersonaName()
  })

  ipcMain.handle('steam:getCurrentGameLanguage', () => {
    return steamClient?.apps.getCurrentGameLanguage() ?? null
  })

  ipcMain.handle('steam:setRichPresence', (_, key: string, value?: string) => {
    steamClient?.richPresence.setRichPresence(key, value ?? null)
  })

  ipcMain.handle('steam:getSessionTicket', async () => {
    if (!steamClient) return null

    const ticket = await steamClient.user.getAuthTicketForWebApi({ genericString: 'synergism-backend' })
    if (!ticket.success) {
      throw new Error('Failed to get Steam auth ticket for web API')
    }

    return ticket.ticketData.toString('hex')
  })

  // Steam Cloud Storage
  const isCloudEnabled = () =>
    steamClient?.cloud.isCloudEnabledForAccount() && steamClient?.cloud.isCloudEnabledForApp()

  ipcMain.handle('steam:cloudFileExists', (_, name: string) => {
    if (!steamClient || !isCloudEnabled()) return false
    return steamClient.cloud.fileExists(name)
  })

  ipcMain.handle('steam:cloudReadFile', (_, name: string) => {
    if (!steamClient || !isCloudEnabled()) return null
    try {
      const result = steamClient.cloud.fileRead(name)
      return result.success && result.data ? result.data.toString('utf8') : null
    } catch (error) {
      console.error('Failed to read Steam Cloud file:', error)
      return null
    }
  })

  ipcMain.handle('steam:cloudWriteFile', (_, name: string, content: string) => {
    if (!steamClient || !isCloudEnabled()) return false
    try {
      return steamClient.cloud.fileWrite(name, Buffer.from(content, 'utf8'))
    } catch (error) {
      console.error('Failed to write Steam Cloud file:', error)
      return false
    }
  })

  ipcMain.handle('steam:cloudDeleteFile', (_, name: string) => {
    if (!steamClient || !isCloudEnabled()) return false
    try {
      return steamClient.cloud.fileDelete(name)
    } catch (error) {
      console.error('Failed to delete Steam Cloud file:', error)
      return false
    }
  })

  ipcMain.handle('steam:unlockAchievement', async (_, achievementId: string) => {
    if (!steamClient) return false
    try {
      return await steamClient.achievements.unlockAchievement(achievementId)
    } catch (error) {
      console.error('Failed to unlock achievement:', error)
      return false
    }
  })

  ipcMain.handle('steam:getAchievement', async (_, achievementId: string) => {
    if (!steamClient) return false
    try {
      return await steamClient.achievements.isAchievementUnlocked(achievementId)
    } catch (error) {
      console.error('Failed to get achievement status:', error)
      return null
    }
  })
}

export function enableSteamOverlay () {
  // The library's mirror window caps the game at 30 fps and stutters, so only macOS uses it.
  // https://github.com/ArtyProf/steamworks-ffi-node/issues/64
  // https://github.com/ArtyProf/steamworks-ffi-node/issues/57
  if (process.platform === 'darwin') {
    app.on('browser-window-created', (_, window) => {
      steamClient?.addElectronSteamOverlay(window)
    })
    return
  }

  // Steam hooks the graphics device in the game's own process, so Chromium's GPU process has to run there.
  // https://partner.steamgames.com/doc/features/overlay#requirements
  // https://github.com/ArtyProf/steamworks-ffi-node/issues/57
  app.commandLine.appendSwitch('in-process-gpu')
  // The overlay needs full-frame redraws, otherwise text behind it flickers.
  // https://partner.steamgames.com/doc/features/overlay#FAQ
  app.commandLine.appendSwitch('ui-disable-partial-swap')

  app.on('browser-window-created', (_, window) => {
    const repaintInterval = setInterval(() => {
      if (window.isDestroyed()) {
        clearInterval(repaintInterval)
      } else if (window.isVisible() && !window.isMinimized()) {
        window.webContents.invalidate()
      }
    }, 1000 / 60)
  })
}
