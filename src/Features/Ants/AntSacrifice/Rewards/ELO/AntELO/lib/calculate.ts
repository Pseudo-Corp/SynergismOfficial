import { additiveAntELOMultStats, antELOStats, calculateTotalStat } from '../../../../../../../Statistics'

export const calculateBaseAntELO = () => calculateTotalStat(antELOStats)
export const calculateELOMult = () => calculateTotalStat(additiveAntELOMultStats)

export const calculateEffectiveAntELO = () => {
  const baseELO = calculateBaseAntELO()
  const mult = calculateELOMult()
  return Math.floor(baseELO * mult)
}
