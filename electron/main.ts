import { app, BrowserWindow, ipcMain, net, session, shell } from 'electron'
import Store from 'electron-store'
import windowStateKeeper from 'electron-window-state'
import mimeTypes from 'mime-types'
import { randomBytes, timingSafeEqual } from 'node:crypto'
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

const settingsStore = new Store<{ zoomFactor: number }>({
  name: 'settings',
  defaults: { zoomFactor: 1 }
})

let mainWindow: BrowserWindow | null = null

/**
 * Pending nonce for the external auth flow. Generated whenever the app opens a
 * login URL in the system browser; the backend echoes it back in the
 * synergism:// callback so we can reject deep links this app did not initiate.
 */
let pendingAuthState: { value: string; expiresAt: number } | null = null

const AUTH_STATE_TTL_MS = 15 * 60 * 1000

/** Start a new external auth flow: store a fresh nonce and add it to the login URL. */
function withAuthState (url: URL): string {
  const state = randomBytes(32).toString('base64url')
  pendingAuthState = { value: state, expiresAt: Date.now() + AUTH_STATE_TTL_MS }
  url.searchParams.set('state', state)
  return url.toString()
}

/**
 * Validate the state echoed in a synergism:// callback against the pending
 * nonce.
 */
function consumeAuthState (provided: string | null): boolean {
  if (provided === null || pendingAuthState === null) {
    return false
  }

  const { value, expiresAt } = pendingAuthState
  if (Date.now() > expiresAt) {
    pendingAuthState = null
    return false
  }

  const providedBuf = Buffer.from(provided)
  const expectedBuf = Buffer.from(value)
  const matches = providedBuf.length === expectedBuf.length && timingSafeEqual(providedBuf, expectedBuf)

  if (matches) {
    pendingAuthState = null
  }

  return matches
}

/**
 * Handle a `synergism://` protocol callback URL.
 * Expected format: synergism://login-callback?token=<session_token>&state=<nonce>
 *
 * The state must match the nonce generated when this app opened the external
 * auth flow. Callbacks without a valid state are rejected: any website or app
 * can forge a synergism:// link, so an unvalidated token would let an attacker
 * fix this client into a session they control.
 */
async function handleProtocolUrl (raw: string): Promise<void> {
  try {
    const url = new URL(raw)

    if (url.hostname === 'link-callback') {
      if (!consumeAuthState(url.searchParams.get('state'))) return
      mainWindow?.webContents.send('auth:changed')
      return
    }

    if (url.hostname !== 'login-callback') return

    if (!consumeAuthState(url.searchParams.get('state'))) return

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

    mainWindow?.webContents.send('auth:changed')
  } catch {
    // Malformed URL — ignore silently
  }
}

function createWindow (): void {
  const windowState = windowStateKeeper({
    defaultWidth: 1920,
    defaultHeight: 1080
  })

  mainWindow = new BrowserWindow({
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
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

  windowState.manage(mainWindow)

  if (windowState.isMaximized === undefined) {
    mainWindow.maximize()
  }

  mainWindow.loadURL('https://synergism.cc/')

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow?.webContents.setZoomFactor(settingsStore.get('zoomFactor'))
  })

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
        shell.openExternal(withAuthState(url))
      }
    } catch {
      event.preventDefault()
    }
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    try {
      const parsed = new URL(url)
      if (parsed.hostname === 'synergism.cc' && parsed.pathname.startsWith('/login')) {
        shell.openExternal(withAuthState(parsed))
        return { action: 'deny' }
      }
    } catch {
    }

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

// Window control IPC handlers
ipcMain.handle('window:setSize', (_, width: number, height: number) => {
  if (!mainWindow) return
  if (mainWindow.isMaximized()) mainWindow.unmaximize()
  mainWindow.setSize(width, height)
  mainWindow.center()
})

ipcMain.handle('window:getSize', () => {
  if (!mainWindow) return null
  const [width, height] = mainWindow.getSize()
  return { width, height }
})

ipcMain.handle('window:setZoomFactor', (_, factor: number) => {
  if (!mainWindow) return
  mainWindow.webContents.setZoomFactor(factor)
  settingsStore.set('zoomFactor', factor)
})

ipcMain.handle('window:getZoomFactor', () => {
  return settingsStore.get('zoomFactor')
})

ipcMain.handle('auth:clearCookie', async () => {
  await session.defaultSession.cookies.remove('https://synergism.cc', 'token')
})
