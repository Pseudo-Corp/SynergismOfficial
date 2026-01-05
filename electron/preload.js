// @ts-check
// Yes, it has to be CommonJS

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('steam', {
  getSteamId: () => ipcRenderer.invoke('steam:getSteamId'),
  getUsername: () => ipcRenderer.invoke('steam:getUsername'),
  getCurrentGameLanguage: () => ipcRenderer.invoke('steam:getCurrentGameLanguage'),
  /**
   * @param {string} key
   * @param {string} [value]
   */
  setRichPresence: (key, value) => ipcRenderer.invoke('steam:setRichPresence', key, value),
  getSessionTicket: () => ipcRenderer.invoke('steam:getSessionTicket'),
  /**
   * @param {(response: import('steamworks.js/callbacks').CallbackReturns[
   *  import('steamworks.js/client').callback.SteamCallback.MicroTxnAuthorizationResponse
   * ]) => void} callback
   */
  onMicroTxnAuthorizationResponse: (callback) => {
    ipcRenderer.once('steam:microTxnAuthorizationResponse', (_, response) => callback(response))
  }
})

contextBridge.exposeInMainWorld('discord', {
  /**
   * @param {import('./lib/discord').PresenceOptions} options
   */
  setRichPresence: (options) => ipcRenderer.invoke('discord:setRichPresence', options)
})
