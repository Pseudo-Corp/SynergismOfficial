import i18next from 'i18next'
import { DOMCacheGetOrSet } from '../../../../../Cache/DOM'

export const autobuyAntProducerHTML = (enabled: boolean): void => {
  const el = DOMCacheGetOrSet('toggleAutobuyAntProducer')
  if (enabled) {
    el.classList.add('enabledAntToggle')
    el.classList.remove('disabledAntToggle')
    el.textContent = i18next.t('ants.autobuy.producer.on')
  } else {
    el.classList.add('disabledAntToggle')
    el.classList.remove('enabledAntToggle')
    el.textContent = i18next.t('ants.autobuy.producer.off')
  }
}
