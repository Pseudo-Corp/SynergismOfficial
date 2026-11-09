import {
  additiveAntELOMultStatsSum,
  antELOStatsSum,
  effectiveAntELOStatsProduct
} from '../../../../../../../Statistics'

export const calculateBaseAntELO = () => antELOStatsSum()
export const minimumELOMult = 0.01

export const calculateELOMult = () => Math.max(minimumELOMult, additiveAntELOMultStatsSum())

export const calculateEffectiveAntELO = () => Math.floor(effectiveAntELOStatsProduct())
