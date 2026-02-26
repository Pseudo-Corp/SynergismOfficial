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
  },
  // Steam Cloud Storage
  /** @param {string} name */
  cloudFileExists: (name) => ipcRenderer.invoke('steam:cloudFileExists', name),
  /** @param {string} name */
  cloudReadFile: (name) => ipcRenderer.invoke('steam:cloudReadFile', name),
  /**
   * @param {string} name
   * @param {string} content
   */
  cloudWriteFile: (name, content) => ipcRenderer.invoke('steam:cloudWriteFile', name, content),
  /** @param {string} name */
  cloudDeleteFile: (name) => ipcRenderer.invoke('steam:cloudDeleteFile', name),

  // Steam Achievements
  /** @param {string} achievementId */
  unlockAchievement: (achievementId) => ipcRenderer.invoke('steam:unlockAchievement', achievementId),
  /** @param {string} achievementId */
  getAchievement: (achievementId) => ipcRenderer.invoke('steam:getAchievement', achievementId)
})

contextBridge.exposeInMainWorld('discord', {
  /**
   * @param {import('./lib/discord').PresenceOptions} options
   */
  setRichPresence: (options) => ipcRenderer.invoke('discord:setRichPresence', options),
  /** @returns {Promise<boolean>} */
  getEnabled: () => ipcRenderer.invoke('discord:getEnabled'),
  /** @param {boolean} enabled */
  setEnabled: (enabled) => ipcRenderer.invoke('discord:setEnabled', enabled)
})
