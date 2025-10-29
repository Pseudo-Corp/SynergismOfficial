import i18next from 'i18next'
import { DOMCacheGetOrSet } from '../../../../../Cache/DOM'

export const maxBuyUpgradeHTML = (enabled: boolean): void => {
  const el = DOMCacheGetOrSet('toggleBuyAntUpgradesMax')
  if (enabled) {
    el.classList.add('maxPurchaseAnt')
    el.classList.remove('singlePurchaseAnt')
    el.textContent = i18next.t('ants.maxBuy.upgrade.on')
  } else {
    el.classList.add('singlePurchaseAnt')
    el.classList.remove('maxPurchaseAnt')
    el.textContent = i18next.t('ants.maxBuy.upgrade.off')
  }
}
