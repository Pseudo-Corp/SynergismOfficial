import { additiveAntELOMultStats, antELOStats, calculateTotalStat } from '../../../../../../../Statistics'

export const calculateBaseAntELO = () => calculateTotalStat(antELOStats)
export const minimumELOMult = 0.01

export const calculateELOMult = () => Math.max(minimumELOMult, calculateTotalStat(additiveAntELOMultStats))

export const calculateEffectiveAntELO = () => {
  const baseELO = calculateBaseAntELO()
  const mult = calculateELOMult()
  return Math.floor(baseELO * mult)
}
