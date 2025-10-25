import { calculateAntSacrificeMultiplier } from '../../../../Calculate'
import { offeringObtainiumTimeModifiers } from '../../../../Statistics'
import { player } from '../../../../Synergism'
import type { AntSacrificeRewards } from '../structs/structs'
import { calculateEffectiveAntELO } from './ELO/AntELO/lib/calculate'
import { calculateImmortalELOGain } from './ELO/ImmortalELO/lib/calculate'
import { thresholdModifiers } from './ELO/RebornELO/Stages/lib/threshold'
import { calculateAntSacrificeObtainium } from './Obtainium/calculate-obtainium'
import { calculateAntSacrificeOffering } from './Offerings/calculate-offerings'
import { calculateAntSacrificeTalismanItem } from './TalismanCraftItems/calculate-talisman-items'

export const antSacrificeRewards = (): AntSacrificeRewards => {
  const effectiveELO = calculateEffectiveAntELO()

  const antSacrificeRewardMult = calculateAntSacrificeMultiplier()
  const timeMultiplier = offeringObtainiumTimeModifiers(player.antSacrificeTimer, true).reduce(
    (a, b) => a * b.stat(),
    1
  )
  const rewardMultiplier = antSacrificeRewardMult.times(timeMultiplier)

  const stageMultipliers = thresholdModifiers()

  return {
    immortalELO: calculateImmortalELOGain(),
    offerings: calculateAntSacrificeOffering(stageMultipliers.antSacrificeOfferingMult),
    obtainium: calculateAntSacrificeObtainium(stageMultipliers.antSacrificeObtainiumMult),
    talismanCraftItems: {
      shard: calculateAntSacrificeTalismanItem(
        'shard',
        effectiveELO,
        rewardMultiplier,
        stageMultipliers.antSacrificeTalismanFragmentMult
      ),
      commonFragment: calculateAntSacrificeTalismanItem(
        'commonFragment',
        effectiveELO,
        rewardMultiplier,
        stageMultipliers.antSacrificeTalismanFragmentMult
      ),
      uncommonFragment: calculateAntSacrificeTalismanItem(
        'uncommonFragment',
        effectiveELO,
        rewardMultiplier,
        stageMultipliers.antSacrificeTalismanFragmentMult
      ),
      rareFragment: calculateAntSacrificeTalismanItem(
        'rareFragment',
        effectiveELO,
        rewardMultiplier,
        stageMultipliers.antSacrificeTalismanFragmentMult
      ),
      epicFragment: calculateAntSacrificeTalismanItem(
        'epicFragment',
        effectiveELO,
        rewardMultiplier,
        stageMultipliers.antSacrificeTalismanFragmentMult
      ),
      legendaryFragment: calculateAntSacrificeTalismanItem(
        'legendaryFragment',
        effectiveELO,
        rewardMultiplier,
        stageMultipliers.antSacrificeTalismanFragmentMult
      ),
      mythicalFragment: calculateAntSacrificeTalismanItem(
        'mythicalFragment',
        effectiveELO,
        rewardMultiplier,
        stageMultipliers.antSacrificeTalismanFragmentMult
      )
    }
  }
}
