import { Client, type Presence } from 'discord-rpc'
import { ipcMain } from 'electron'
import Store from 'electron-store'

export type PresenceOptions = Omit<Presence, 'instance' | 'buttons'>

const clientId = '1289263890445631581'
const startTimestamp = new Date()

const store = new Store<{ discordRpcEnabled: boolean }>({
  defaults: {
    discordRpcEnabled: false
  }
})

let rpc: Client | null = null
let activityInterval: ReturnType<typeof setInterval> | null = null
let options: PresenceOptions | undefined
let isReady = false

async function setActivity () {
  if (!options || !isReady || !rpc) return

  try {
    await rpc.setActivity({
      startTimestamp,
      ...options,
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
  }
}

function createClient (): Client {
  const client = new Client({ transport: 'ipc' })

  client.on('error', (error) => {
    console.error('[Discord RPC] Error:', error)
  })

  client.once('ready', () => {
    console.log('[Discord RPC] Connected successfully')
    isReady = true
    setActivity()

    // activity can only be set every 15 seconds
    activityInterval = setInterval(() => {
      setActivity()
    }, 15e3)
  })

  return client
}

async function connectWithRetry (maxRetries = 3, delayMs = 5000): Promise<void> {
  if (!rpc) return

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

async function disconnect () {
  if (activityInterval) {
    clearInterval(activityInterval)
    activityInterval = null
  }

  if (rpc) {
    if (isReady) {
      await rpc.clearActivity().catch((err) => console.error('[Discord RPC] Failed to clear activity:', err))
    }
    await rpc.destroy().catch((err) => console.error('[Discord RPC] Error destroying client:', err))
    rpc = null
  }

  isReady = false
}

// biome-ignore lint/complexity/noUselessLoneBlockStatements: organization
{
  ipcMain.handle('discord:setRichPresence', (_, presence: PresenceOptions) => {
    options = presence

    if (isReady) {
      setActivity().catch((err) => console.error('[Discord RPC] Failed to set activity:', err))
    }
  })

  ipcMain.handle('discord:getEnabled', () => {
    return store.get('discordRpcEnabled')
  })

  ipcMain.handle('discord:setEnabled', (_, enabled: boolean) => {
    store.set('discordRpcEnabled', enabled)

    if (enabled) {
      if (!rpc) {
        rpc = createClient()
        connectWithRetry()
      }
    } else {
      disconnect()
    }
  })
}

// Start connection if enabled
if (store.get('discordRpcEnabled')) {
  rpc = createClient()
  connectWithRetry()
}
