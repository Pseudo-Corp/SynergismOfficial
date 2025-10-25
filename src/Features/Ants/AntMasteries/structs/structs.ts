import type Decimal from 'break_infinity.js'

export interface AntMasteryData {
  totalELORequirements: number[]
  particleCosts: Decimal[]
  selfSpeedMultipliers: Decimal[]
  // Ant Speed Multiplier = (1 + selfPowerIncrement)^purchased
  selfPowerIncrement: number
}

export interface PlayerAntMasteries {
  mastery: number
  highestMastery: number
}
