import { Client, type Presence } from 'discord-rpc'
import { ipcMain } from 'electron'

export type PresenceOptions = Omit<Presence, 'instance' | 'buttons'>

const clientId = '1289263890445631581'

const rpc = new Client({ transport: 'ipc' })
const startTimestamp = new Date()

let options: PresenceOptions | undefined
let isReady = false

// Add error handling for debugging connection issues
rpc.on('error', (error) => {
  console.error('[Discord RPC] Error:', error)
})

// biome-ignore lint/complexity/noUselessLoneBlockStatements: organization
{
  ipcMain.handle('discord:setRichPresence', (_, presence: PresenceOptions) => {
    options = presence

    // If already ready, set activity immediately
    if (isReady) {
      setActivity().catch((err) => console.error('[Discord RPC] Failed to set activity:', err))
    }
  })
}

async function setActivity () {
  if (!options || !isReady) return

  try {
    await rpc.setActivity({
      startTimestamp,
      ...options,
      // largeImageKey: 'snek_large',
      // largeImageText: 'This is large image text',
      // smallImageKey: 'snek_small',
      // smallImageText: 'This is small image text',
      instance: false,
      buttons: [
        {
          label: 'Play Synergism!',
          url: 'https://synergism.cc'
        }
      ]
    })

    options = undefined
  } catch (error) {
    console.error('[Discord RPC] Failed to set activity:', error)
    // Keep options so we can retry on next interval
  }
}

rpc.once('ready', () => {
  console.log('[Discord RPC] Connected successfully')
  isReady = true
  setActivity()

  // activity can only be set every 15 seconds
  setInterval(() => {
    setActivity()
  }, 15e3)
})

// Connect with retry logic, especially important for macOS
async function connectWithRetry (maxRetries = 3, delayMs = 5000): Promise<void> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await rpc.login({ clientId })
      console.log('[Discord RPC] Login successful')
      return
    } catch (error) {
      console.error(`[Discord RPC] Connection attempt ${attempt}/${maxRetries} failed:`, error)

      if (attempt < maxRetries) {
        console.log(`[Discord RPC] Retrying in ${delayMs / 1000} seconds...`)
        await new Promise((resolve) => setTimeout(resolve, delayMs))
      }
    }
  }

  console.error('[Discord RPC] Failed to connect after all retries.')
  console.error('[Discord RPC] Make sure Discord is running before launching the app.')
}

// Start connection
connectWithRetry()
