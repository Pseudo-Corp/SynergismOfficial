import i18next from 'i18next'
import { DOMCacheGetOrSet } from '../../../../Cache/DOM'

const COLLAPSE_LABEL = 'pseudoCoins.lotus.collapseSection'
const EXPAND_LABEL = 'pseudoCoins.lotus.expandSection'

export const toggleLotusSection = (): void => {
  const section = DOMCacheGetOrSet('lotusCorner')
  const details = DOMCacheGetOrSet('lotusDetails')
  const summary = DOMCacheGetOrSet('lotusCollapsedSummary')
  const toggle = DOMCacheGetOrSet('toggleLotusSection')
  const collapsed = section.classList.toggle('lotusCollapsed')
  const label = collapsed ? EXPAND_LABEL : COLLAPSE_LABEL

  toggle.setAttribute('aria-expanded', String(!collapsed))
  toggle.setAttribute('aria-label', i18next.t(label))
  toggle.setAttribute('i18n-aria-label', label)
  details.setAttribute('aria-hidden', String(collapsed))
  details.toggleAttribute('inert', collapsed)
  summary.setAttribute('aria-hidden', String(!collapsed))
}
