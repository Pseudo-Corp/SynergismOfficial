import { Client, type Presence } from 'discord-rpc'
import { ipcMain } from 'electron'
import Store from 'electron-store'

export type PresenceOptions = Omit<Presence, 'instance' | 'buttons'>

const clientId = '1289263890445631581'
const startTimestamp = new Date()
const retryDelayMs = 15e3

const store = new Store<{ discordRpcEnabled: boolean }>({
  defaults: {
    discordRpcEnabled: true
  }
})

let rpc: Client | null = null
let retryTimeout: ReturnType<typeof setTimeout> | null = null
let activityInterval: ReturnType<typeof setInterval> | null = null
let options: PresenceOptions | undefined
let activityPending = false
let isReady = false

async function setActivity () {
  if (!options || !activityPending || !isReady || !rpc) return

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

    activityPending = false
  } catch (error) {
    console.error('[Discord RPC] Failed to set activity:', error)
  }
}

function stopActivity () {
  if (activityInterval) {
    clearInterval(activityInterval)
    activityInterval = null
  }

  isReady = false
}

async function connect () {
  retryTimeout = null

  const client = new Client({ transport: 'ipc' })
  rpc = client

  client.on('error', (error) => {
    console.error('[Discord RPC] Error:', error)
  })

  client.once('disconnected', () => {
    if (rpc !== client) return

    console.log('[Discord RPC] Disconnected, retrying...')
    stopActivity()
    rpc = null
    retryTimeout = setTimeout(connect, retryDelayMs)
  })

  try {
    await client.login({ clientId })
  } catch {
    if (rpc === client) {
      rpc = null
      retryTimeout = setTimeout(connect, retryDelayMs)
    }
    client.destroy().catch(() => {})
    return
  }

  if (rpc !== client) {
    client.destroy().catch(() => {})
    return
  }

  console.log('[Discord RPC] Connected successfully')
  isReady = true
  activityPending = true
  setActivity()

  // activity can only be set every 15 seconds
  activityInterval = setInterval(() => {
    setActivity()
  }, 15e3)
}

async function disconnect () {
  if (retryTimeout) {
    clearTimeout(retryTimeout)
    retryTimeout = null
  }

  const client = rpc
  const wasReady = isReady
  rpc = null
  stopActivity()

  if (client) {
    if (wasReady) {
      await client.clearActivity().catch((err) => console.error('[Discord RPC] Failed to clear activity:', err))
    }
    await client.destroy().catch((err) => console.error('[Discord RPC] Error destroying client:', err))
  }
}

{
  ipcMain.handle('discord:setRichPresence', (_, presence: PresenceOptions) => {
    options = presence
    activityPending = true

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
      if (!rpc && !retryTimeout) {
        connect()
      }
    } else {
      disconnect()
    }
  })
}

export function startDiscordRpc () {
  if (store.get('discordRpcEnabled')) {
    connect()
  }
}
