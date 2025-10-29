import i18next from 'i18next'
import { DOMCacheGetOrSet } from '../../../../../Cache/DOM'

export const autoAntSacrificeEnabledHTML = (autoSacrificeEnabled: boolean): void => {
  const elm = DOMCacheGetOrSet('toggleAutoSacrificeAnt')
  if (autoSacrificeEnabled) {
    elm.classList.add('enabledAntToggle')
    elm.classList.remove('disabledAntToggle')
    elm.textContent = i18next.t('ants.autoSacrificeOn')
  } else {
    elm.classList.add('disabledAntToggle')
    elm.classList.remove('enabledAntToggle')
    elm.textContent = i18next.t('ants.autoSacrificeOff')
  }
}
