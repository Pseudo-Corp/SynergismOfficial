import type Decimal from 'break_infinity.js'

export const MINIMUM_CRUMBS_FOR_SACRIFICE = 1e40
export const MINIMUM_SECONDS_DELAY_BETWEEN_SACRIFICES = 0.05

export const hasEnoughCrumbsForSacrifice = (crumbs: Decimal): boolean => {
  return crumbs.gte(MINIMUM_CRUMBS_FOR_SACRIFICE)
}

export const sacrificeOffCooldown = (time: number): boolean => {
  return time >= MINIMUM_SECONDS_DELAY_BETWEEN_SACRIFICES
}
