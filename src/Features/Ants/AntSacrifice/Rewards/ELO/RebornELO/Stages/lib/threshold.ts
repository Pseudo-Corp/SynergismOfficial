import { player } from '../../../../../../../../Synergism'

export const calculateRebornELOThresholds = (elo?: number) => {
  const rebornELO = elo ?? player.ants.rebornELO
  let thresholds = 0

  thresholds += Math.floor(Math.min(100, rebornELO / 100))
  thresholds += Math.floor(Math.min(100, Math.max(0, (rebornELO - 10_000) / 1000)))
  thresholds += Math.floor(Math.min(100, Math.max(0, (rebornELO - 110_000) / 3000)))
  thresholds += Math.floor(Math.min(700, Math.max(0, (rebornELO - 410_000) / 20000)))
  thresholds += Math.floor(Math.max(0, (rebornELO - 14_410_000) / 100000))
  return thresholds
}

export const thresholdModifiers = () => {
  const thresholds = calculateRebornELOThresholds()
  return {
    rebornSpeedMult: Math.pow(0.98, thresholds),
    antSacrificeObtainiumMult: Math.pow(1.05, thresholds),
    antSacrificeOfferingMult: Math.pow(1.05, thresholds),
    antSacrificeTalismanFragmentMult: Math.pow(1.2, thresholds)
  }
}
