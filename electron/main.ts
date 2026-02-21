import { app, BrowserWindow, net, session } from 'electron'
import mimeTypes from 'mime-types'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { enableSteamOverlay, initializeSteam } from './lib/steam-ipc.ts'
import './lib/discord.ts' // Discord RPC

if (process.platform === 'darwin') {
  app.commandLine.appendSwitch('enable-gpu-rasterization')
  app.commandLine.appendSwitch('enable-zero-copy')
  app.commandLine.appendSwitch('disable-software-rasterizer')

  app.commandLine.appendSwitch('js-flags', '--max-old-space-size=4096')

  app.commandLine.appendSwitch('disable-renderer-backgrounding')
  app.commandLine.appendSwitch('disable-background-timer-throttling')
}

let mainWindow: BrowserWindow | null = null

function createWindow (): void {
  mainWindow = new BrowserWindow({
    maximizable: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(app.getAppPath(), 'electron', 'preload.js'),
      enableWebSQL: false,
      backgroundThrottling: false
    },
    icon: path.join(app.getAppPath(), 'dist', 'favicon.ico'),
    title: 'Synergism',
    autoHideMenuBar: true
  })

  if (mainWindow.maximizable) {
    mainWindow.maximize()
  }

  mainWindow.loadURL('https://synergism.cc/')

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.webContents.on('will-navigate', (event, u) => {
    const url = new URL(u)

    if (url.hostname === 'synergism.cc' && url.pathname === '/login') {
      event.preventDefault()

      const loginWindow = new BrowserWindow({
        parent: mainWindow!,
        width: 500,
        height: 700,
        autoHideMenuBar: true,
        title: 'Login',
        webPreferences: {
          partition: 'login'
        }
      })

      loginWindow.loadURL(u)

      loginWindow.webContents.on('will-redirect', (_ev, navUrl) => {
        const parsed = new URL(navUrl)
        if (parsed.hostname === 'synergism.cc' && !parsed.pathname.startsWith('/login')) {
          // Copy cookies from the login session to the main session
          const loginSession = loginWindow.webContents.session
          loginSession.cookies.get({ domain: 'synergism.cc' }).then(async (cookies) => {
            for (const cookie of cookies) {
              await session.defaultSession.cookies.set({
                url: 'https://synergism.cc',
                name: cookie.name,
                value: cookie.value,
                path: cookie.path,
                secure: cookie.secure,
                httpOnly: cookie.httpOnly,
                sameSite: cookie.sameSite,
                expirationDate: cookie.expirationDate
              })
            }

            loginWindow.close()
            mainWindow?.webContents.reload()
          })
        }
      })
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(async () => {
  const distPath = path.join(app.getAppPath(), 'dist')

  session.defaultSession.protocol.handle('https', async (request) => {
    const url = new URL(request.url)

    if (url.hostname === 'synergism.cc') {
      let filePath = url.pathname === '/' ? 'index.html' : url.pathname.replace(/^\//, '')
      filePath = path.join(distPath, filePath)

      try {
        const data = await fsp.readFile(filePath)
        const ext = path.extname(filePath)

        return new Response(data, {
          headers: {
            'Content-Type': mimeTypes.contentType(ext) || 'application/octet-stream'
          }
        })
      } catch {
      }
    }

    return net.fetch(request, { bypassCustomProtocolHandlers: true })
  })

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

initializeSteam()
enableSteamOverlay()
