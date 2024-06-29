import i18next from 'i18next'
import localforage from 'localforage'
import { DOMCacheGetOrSet } from '../Cache/DOM'
import { player } from '../Synergism'
import { Alert } from '../UpdateHTML'
import { saveLock } from './Load'
import { playerJsonSchema } from './PlayerJsonSchema'

export const saveSynergy = async (button?: boolean): Promise<boolean> => {
  player.offlinetick = Date.now()
  player.loaded1009 = true
  player.loaded1009hotfix1 = true

  const p = playerJsonSchema.parse(player)
  const save = btoa(JSON.stringify(p))

  const success = await saveLock.acquire<boolean>('save', async (done) => {
    if (save !== null) {
      const saveBlob = new Blob([save], { type: 'text/plain' })

      localStorage.setItem('Synergysave2', save)
      await localforage.setItem<Blob>('Synergysave2', saveBlob)
      done(null, true)
    } else {
      await Alert(i18next.t('testing.errorSaving'))
      done(null, false)
      return
    }
  })

  if (button) {
    const el = DOMCacheGetOrSet('saveinfo')
    el.textContent = i18next.t('testing.gameSaved')
    setTimeout(() => (el.textContent = ''), 4000)
  }

  return success
}
