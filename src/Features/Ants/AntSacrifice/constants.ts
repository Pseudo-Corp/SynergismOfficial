import type Decimal from 'break_infinity.js'

export const MINIMUM_CRUMBS_FOR_SACRIFICE = 1e70

export const hasEnoughCrumbsForSacrifice = (crumbs: Decimal): boolean => {
  return crumbs.gte(MINIMUM_CRUMBS_FOR_SACRIFICE)
}
