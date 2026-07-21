import i18next from 'i18next'
import { DOMCacheGetOrSet } from '../Cache/DOM'

const loadingTranslationKeys = {
  pseudoCoinBalance: 'pseudoCoins.balances.loadingPseudoCoins',
  lotusBalance: 'pseudoCoins.balances.loadingLotus'
} as const

type BalanceElementId = keyof typeof loadingTranslationKeys

const setBalanceLoading = (id: BalanceElementId) => {
  const balance = DOMCacheGetOrSet(id)
  const translationKey = loadingTranslationKeys[id]

  balance.textContent = ''
  balance.classList.add('spinner')
  balance.setAttribute('aria-busy', 'true')
  balance.setAttribute('i18n-aria-label', translationKey)
  balance.setAttribute('aria-label', i18next.t(translationKey))
}

const setBalance = (id: BalanceElementId, amount: number) => {
  const balance = DOMCacheGetOrSet(id)

  balance.textContent = Intl.NumberFormat().format(amount)
  balance.classList.remove('spinner')
  balance.setAttribute('aria-busy', 'false')
  balance.removeAttribute('i18n-aria-label')
  balance.removeAttribute('aria-label')
}

export const setPseudoCoinBalanceLoading = () => setBalanceLoading('pseudoCoinBalance')
export const setPseudoCoinBalance = (amount: number) => setBalance('pseudoCoinBalance', amount)
export const setLotusBalanceLoading = () => setBalanceLoading('lotusBalance')
export const setLotusBalance = (amount: number) => setBalance('lotusBalance', amount)
