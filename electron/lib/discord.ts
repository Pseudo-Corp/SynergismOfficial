import { Client, type Presence } from 'discord-rpc'
import { ipcMain } from 'electron'

export type PresenceOptions = Omit<Presence, 'instance' | 'buttons'>

const clientId = '1289263890445631581'

const rpc = new Client({ transport: 'ipc' })
const startTimestamp = new Date()

let options: PresenceOptions | undefined

// biome-ignore lint/complexity/noUselessLoneBlockStatements: organization
{
  ipcMain.handle('discord:setRichPresence', (_, presence: PresenceOptions) => {
    options = presence
  })
}

async function setActivity () {
  if (!options) return

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
}

rpc.once('ready', () => {
  setActivity()

  // activity can only be set every 15 seconds
  setInterval(() => {
    setActivity()
  }, 15e3)
})

rpc.login({ clientId })
