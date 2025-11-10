import { getAchievementReward } from '../../../../../../../Achievements'
import { CalcECC } from '../../../../../../../Challenges'
import { getLevelReward } from '../../../../../../../Levels'
import { player } from '../../../../../../../Synergism'
import { getAntUpgradeEffect } from '../../../../../AntUpgrades/lib/upgrade-effects'
import { AntUpgrades } from '../../../../../AntUpgrades/structs/structs'
import { AntProducers } from '../../../../../structs/structs'

export const calculateBaseAntELO = () => {
  let ELO = 0
  ELO += player.ants.producers[AntProducers.Workers].purchased
  ELO += 666 * player.researches[178]
  ELO += +getAchievementReward('antELOAdditive')
  ELO += 25 * player.researches[108]
  ELO += 25 * player.researches[109]
  ELO += 40 * player.researches[123]
  ELO += 100 * CalcECC('reincarnation', player.challengecompletions[10])
  ELO += getLevelReward('ants')
  ELO += 4 * player.shopUpgrades.antSpeed
  ELO += getAntUpgradeEffect(AntUpgrades.AntSacrifice).elo

  if (player.upgrades[80] > 0) {
    ELO += 10 * Math.min(50, player.ants.antSacrificeCount)
    ELO += 5 * Math.min(50, Math.max(player.ants.antSacrificeCount - 50, 0))
    ELO += Math.min(250, Math.max(0, player.ants.antSacrificeCount - 100))
  }

  return ELO
}

export const calculateELOMult = () => {
  let baseMult = 1
  if (player.ants.producers[AntProducers.Queens].purchased > 0) {
    baseMult += 0.01
  }
  if (player.ants.producers[AntProducers.LordRoyals].purchased > 0) {
    baseMult += 0.01
  }
  if (player.ants.producers[AntProducers.Almighties].purchased > 0) {
    baseMult += 0.01
  }
  if (player.ants.producers[AntProducers.Disciples].purchased > 0) {
    baseMult += 0.02
  }
  if (player.ants.producers[AntProducers.HolySpirit].purchased > 0) {
    baseMult += 0.02
  }
  baseMult += 1 / 200 * player.platonicUpgrades[12] * player.corruptions.used.extinction
  baseMult += +getAchievementReward('antELOAdditiveMultiplier')
  return baseMult
}

export const calculateEffectiveAntELO = (base?: number) => {
  const baseELO = base ?? calculateBaseAntELO()
  const mult = calculateELOMult()
  return baseELO * mult
}
