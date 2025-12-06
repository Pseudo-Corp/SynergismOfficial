import { additiveAntELOMultStats, antELOStats } from '../../../../../../../Statistics'

export const calculateBaseAntELO = () => {
  return antELOStats.reduce((a, b) => a + b.stat(), 0)
}

export const calculateELOMult = () => {
  return additiveAntELOMultStats.reduce((a, b) => a + b.stat(), 0)
}

export const calculateEffectiveAntELO = () => {
  const baseELO = calculateBaseAntELO()
  const mult = calculateELOMult()
  return Math.floor(baseELO * mult)
}
