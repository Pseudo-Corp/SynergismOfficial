import { app, BrowserWindow, net, session, shell } from 'electron'
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

// Single instance lock — on Windows/Linux, custom protocol URLs launch a new
// instance. We grab the lock so the second instance can forward the URL to us.
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
}

app.setAsDefaultProtocolClient('synergism')

let mainWindow: BrowserWindow | null = null

/**
 * Handle a `synergism://` protocol callback URL.
 * Expected format: synergism://login-callback?token=<session_token>
 */
async function handleProtocolUrl (raw: string): Promise<void> {
  try {
    const url = new URL(raw)

    if (url.hostname === 'link-callback') {
      mainWindow?.webContents.reload()
      return
    }

    if (url.hostname !== 'login-callback') return

    const token = url.searchParams.get('token')
    if (!token) return

    await session.defaultSession.cookies.set({
      url: 'https://synergism.cc',
      name: 'token',
      value: token,
      path: '/',
      secure: true,
      httpOnly: true,
      sameSite: 'lax',
      expirationDate: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60
    })

    mainWindow?.webContents.reload()
  } catch {
    // Malformed URL — ignore silently
  }
}

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

  // Intercept all in-page navigations (location.href = '...', <a> clicks, etc.)
  // External URLs and login/OAuth URLs open in the system browser.
  mainWindow.webContents.on('will-navigate', (event, u) => {
    try {
      const url = new URL(u)
      if (url.hostname !== 'synergism.cc') {
        event.preventDefault()
        shell.openExternal(u)
      } else if (url.pathname.startsWith('/login')) {
        // OAuth login flows should go through the system browser so the
        // backend can redirect back via synergism:// protocol.
        event.preventDefault()
        shell.openExternal(u)
      }
    } catch {
      event.preventDefault()
    }
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Windows/Linux: when a second instance is launched (e.g. from a protocol URL),
// the existing instance receives the argv here.
app.on('second-instance', (_event, argv) => {
  const protocolUrl = argv.find((arg) => arg.startsWith('synergism://'))
  if (protocolUrl) {
    handleProtocolUrl(protocolUrl)
  }

  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

// macOS: protocol URLs are delivered via this event
app.on('open-url', (event, url) => {
  event.preventDefault()
  handleProtocolUrl(url)
})

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

if (initializeSteam()) {
  enableSteamOverlay()
}
