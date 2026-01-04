import cookie from 'cookie'
import { app, BrowserWindow, session } from 'electron'
import mimeTypes from 'mime-types'
import fs from 'node:fs'
import path from 'node:path'
import { enableSteamOverlay, initializeSteam } from './lib/steam-ipc.ts'
import './lib/discord.ts' // Discord RPC

app.commandLine.appendSwitch('disable-http-cache')

let mainWindow: BrowserWindow | null = null

initializeSteam()

function createWindow (): void {
  mainWindow = new BrowserWindow({
    maximizable: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(app.getAppPath(), 'electron', 'preload.js')
    },
    icon: path.join(app.getAppPath(), 'dist', 'favicon.ico'),
    title: 'Synergism',
    autoHideMenuBar: true
  })

  if (mainWindow.maximizable) {
    mainWindow.maximize()
  }

  mainWindow.loadURL('https://synergism.cc/', { extraHeaders: 'pragma: no-cache\n' })

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(async () => {
  const distPath = path.join(app.getAppPath(), 'dist')

  // Intercept requests to synergism.cc and serve local files
  session.defaultSession.protocol.handle('https', async (request) => {
    const url = new URL(request.url)

    if (url.hostname === 'synergism.cc') {
      let filePath = url.pathname === '/' ? 'index.html' : url.pathname.replace(/^\//, '')
      filePath = path.join(distPath, filePath)

      try {
        const data = fs.readFileSync(filePath)
        const ext = path.extname(filePath)

        return new Response(data, {
          headers: { 'Content-Type': mimeTypes.contentType(ext) || 'application/octet-stream' }
        })
      } catch {
      }
    }

    // Pass through to network - attach cookies from Electron's cookie jar
    const cookies = await session.defaultSession.cookies.get({ url: request.url })
    const cookieHeader = cookies.reduce((prev, curr) => {
      prev[curr.name] = curr.value
      return prev
    }, {} as Record<string, string>)

    const headers = new Headers(request.headers)
    if (cookies.length > 0) {
      headers.set('Cookie', cookie.stringifyCookie(cookieHeader))
    }

    const response = await fetch(request.url, {
      method: request.method,
      headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.clone().body,
      redirect: 'manual', // Handle redirects manually to preserve cookies
      // @ts-expect-error Who needs types when you have ts-expect-error?
      duplex: 'half'
    })

    // Manually apply Set-Cookie headers to Chrome's cookie jar
    const setCookieHeaders = response.headers.getSetCookie()
    for (const cookieValue of setCookieHeaders) {
      const c = cookie.parseSetCookie(cookieValue)
      // https://stackoverflow.com/a/39136448
      // Cookies require an expirationDate to be persistent, for some reason
      const expires = c.maxAge
        ? Date.now() + (c.maxAge * 1000)
        : c.expires?.getTime()

      await session.defaultSession.cookies.set({
        url: request.url,
        domain: c.domain,
        expirationDate: expires,
        httpOnly: c.httpOnly,
        name: c.name,
        path: c.path,
        sameSite: c.sameSite === true
          ? 'strict'
          : c.sameSite === 'none' || c.sameSite === false
          ? 'no_restriction'
          : c.sameSite,
        secure: c.secure,
        value: c.value
      })
    }

    return response
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

enableSteamOverlay()
