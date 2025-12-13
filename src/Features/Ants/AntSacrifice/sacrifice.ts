import i18next from 'i18next'
import { awardAchievementGroup, awardUngroupedAchievement } from '../../../Achievements'
import { resetHistoryAdd, type ResetHistoryEntryAntSacrifice } from '../../../History'
import { AntSacrificeTiers } from '../../../Reset'
import { player } from '../../../Synergism'
import { updateTalismanInventory } from '../../../Talismans'
import { Confirm } from '../../../UpdateHTML'
import { resetAnts } from '../player/reset'
import { hasEnoughCrumbsForSacrifice, sacrificeOffCooldown } from './constants'
import { antSacrificeRewards } from './Rewards/calculate-rewards'
import { calculateBaseAntELO, calculateEffectiveAntELO } from './Rewards/ELO/AntELO/lib/calculate'

export const confirmAntSacrifice = async (auto = false): Promise<void> => {
  const cooldownCheck = sacrificeOffCooldown(player.antSacrificeTimerReal)
  const crumbCheck = hasEnoughCrumbsForSacrifice(player.ants.crumbsThisSacrifice)
  if (!cooldownCheck || !crumbCheck) {
    return
  }

  let confirm = true
  if (!auto && player.toggles[32]) {
    confirm = await Confirm(i18next.t('ants.autoReset'))
  }
  if (confirm) {
    sacrificeAnts()
  }
}

export const sacrificeAnts = () => {
  const antSacrificePointsBefore = player.ants.immortalELO

  const sacRewards = antSacrificeRewards()
  player.ants.immortalELO += sacRewards.immortalELO
  player.offerings = player.offerings.add(sacRewards.offerings)

  if (player.currentChallenge.ascension !== 14) {
    player.obtainium = player.obtainium.add(sacRewards.obtainium)
  }

  const baseELO = calculateBaseAntELO()
  const effectiveELO = calculateEffectiveAntELO()
  const crumbsPerSecond = player.antSacrificeTimer > 0
    ? player.ants.crumbs.div(player.antSacrificeTimer)
    : 0

  const historyEntry: ResetHistoryEntryAntSacrifice = {
    date: Date.now(),
    seconds: player.antSacrificeTimer,
    kind: 'antsacrifice',
    offerings: sacRewards.offerings,
    obtainium: sacRewards.obtainium,
    antSacrificePointsBefore,
    antSacrificePointsAfter: player.ants.immortalELO,
    baseELO: baseELO,
    effectiveELO: effectiveELO,
    crumbs: player.ants.crumbs.toString(),
    crumbsPerSecond: crumbsPerSecond.toString()
  }

  if (player.challengecompletions[9] > 0) {
    player.talismanShards = player.talismanShards.add(sacRewards.talismanCraftItems.shard)
    player.commonFragments = player.commonFragments.add(sacRewards.talismanCraftItems.commonFragment)
    player.uncommonFragments = player.uncommonFragments.add(sacRewards.talismanCraftItems.uncommonFragment)
    player.rareFragments = player.rareFragments.add(sacRewards.talismanCraftItems.rareFragment)
    player.epicFragments = player.epicFragments.add(sacRewards.talismanCraftItems.epicFragment)
    player.legendaryFragments = player.legendaryFragments.add(sacRewards.talismanCraftItems.legendaryFragment)
    player.mythicalFragments = player.mythicalFragments.add(sacRewards.talismanCraftItems.mythicalFragment)
  }
  awardAchievementGroup('sacMult')
  // Now we're safe to reset the ants.
  resetAnts(AntSacrificeTiers.sacrifice)
  updateTalismanInventory()
  resetHistoryAdd('ants', historyEntry)

  if (player.mythicalFragments.gte(1e11) && player.currentChallenge.ascension === 14) {
    awardUngroupedAchievement('seeingRedNoBlue')
  }
}
