import i18next from 'i18next'
import { DOMCacheGetOrSet } from '../../../../../Cache/DOM'

export const autoAntSacrificeEnabledHTML = (autoSacrificeEnabled: boolean): void => {
  const elm = DOMCacheGetOrSet('toggleAutoSacrificeAnt')
  elm.textContent = autoSacrificeEnabled
    ? i18next.t('ants.autoSacrificeOn')
    : i18next.t('ants.autoSacrificeOff')
}
