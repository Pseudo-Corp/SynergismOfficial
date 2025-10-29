import i18next from 'i18next'
import { DOMCacheGetOrSet } from '../../../../../Cache/DOM'

export const autobuyAntMasteryHTML = (enabled: boolean): void => {
  const el = DOMCacheGetOrSet('toggleAutobuyAntMastery')
  if (enabled) {
    el.classList.add('enabledAntToggle')
    el.classList.remove('disabledAntToggle')
    el.textContent = i18next.t('ants.autobuy.mastery.on')
  } else {
    el.classList.add('disabledAntToggle')
    el.classList.remove('enabledAntToggle')
    el.textContent = i18next.t('ants.autobuy.mastery.off')
  }
}
