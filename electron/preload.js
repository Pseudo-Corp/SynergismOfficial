// @ts-check
// Yes, it has to be CommonJS

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('steam', {
  getSteamId: () => ipcRenderer.invoke('steam:getSteamId'),
  getUsername: () => ipcRenderer.invoke('steam:getUsername'),
  /**
   * @param {string} key
   * @param {string} [value]
   */
  setRichPresence: (key, value) => ipcRenderer.invoke('steam:setRichPresence', key, value),
  getSessionTicket: () => ipcRenderer.invoke('steam:getSessionTicket')
})

contextBridge.exposeInMainWorld('discord', {
  /**
   * @param {import('./lib/discord').PresenceOptions} options
   */
  setRichPresence: (options) => ipcRenderer.invoke('discord:setRichPresence', options)
})
