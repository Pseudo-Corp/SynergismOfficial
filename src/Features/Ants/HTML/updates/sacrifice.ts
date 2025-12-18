import type Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { getAchievementReward } from '../../../../Achievements'
import { DOMCacheGetOrSet } from '../../../../Cache/DOM'
import { getLotusTimeExpiresAt, getOwnedLotus } from '../../../../Login'
import { format, player } from '../../../../Synergism'
import { timeRemainingMinutes, toOrdinal } from '../../../../Utility'
import { antSacrificeRewards } from '../../AntSacrifice/Rewards/calculate-rewards'
import { calculateEffectiveAntELO } from '../../AntSacrifice/Rewards/ELO/AntELO/lib/calculate'
import { calculateAntSpeedMultFromELO } from '../../AntSacrifice/Rewards/ELO/RebornELO/lib/ant-speed'
import {
  calculateAvailableRebornELO,
  calculateSecondsToMaxRebornELO,
  rebornELOCreationSpeedMult
} from '../../AntSacrifice/Rewards/ELO/RebornELO/lib/calculate'
import {
  calculateRebornELOThresholds,
  calculateStageRebornSpeedMult,
  thresholdModifiers
} from '../../AntSacrifice/Rewards/ELO/RebornELO/Stages/lib/threshold'
import { talismanItemRequiredELO } from '../../AntSacrifice/Rewards/TalismanCraftItems/constants'

export const showLockedSacrifice = () => {
  const crumbs = player.ants.crumbsThisSacrifice
  DOMCacheGetOrSet('sacrificeLockedText').innerHTML = i18next.t('ants.altar.locked.crumbsMade', {
    x: format(crumbs, 2, true, undefined, undefined, true)
  })
}

export const showSacrifice = () => {
  const sacRewards = antSacrificeRewards()

  const effectiveELO = calculateEffectiveAntELO()

  DOMCacheGetOrSet('ELO').innerHTML = i18next.t('ants.yourAntELO', {
    x: format(effectiveELO, 2, true)
  })

  DOMCacheGetOrSet('immortalELO').innerHTML = i18next.t('ants.immortalELO', {
    x: format(player.ants.immortalELO, 0, true)
  })
  DOMCacheGetOrSet('activatedImmortalELO').innerHTML = i18next.t('ants.activatedImmortalELO', {
    x: format(player.ants.rebornELO, 2, true),
    y: format(calculateAvailableRebornELO(), 2, true)
  })

  const rebornELOPerSecond = DOMCacheGetOrSet('rebornELOPerSecond')
  const rebornELOTimeRemaining = DOMCacheGetOrSet('rebornELOTimeRemaining')

  const time = Date.now()
  // Lotus is active.
  const lotusTimeExpiresAt = getLotusTimeExpiresAt()
  const lotusActive = lotusTimeExpiresAt !== undefined && time < lotusTimeExpiresAt
  if (lotusActive) {
    rebornELOPerSecond.innerHTML = i18next.t('ants.rebornELOPerSecondWithLotus')
    rebornELOTimeRemaining.innerHTML = '<br>' // Break imitates "no text" in this case
  } else {
    rebornELOPerSecond.innerHTML = i18next.t('ants.rebornELOPerSecond', {
      x: format(rebornELOCreationSpeedMult(), 2, true)
    })
    rebornELOTimeRemaining.innerHTML = i18next.t('ants.rebornELOTimeToMax', {
      x: format(calculateSecondsToMaxRebornELO(), 0, true)
    })
  }

  DOMCacheGetOrSet('ELOStage').innerHTML = i18next.t('ants.eloStage', {
    x: format(calculateRebornELOThresholds(), 0, true)
  })

  DOMCacheGetOrSet('immortalELOAntSpeed').innerHTML = i18next.t('ants.immortalELOAntSpeed', {
    x: format(calculateAntSpeedMultFromELO(), 2, true)
  })

  const thresholdMods = thresholdModifiers()

  DOMCacheGetOrSet('immortalELOOfferings').innerHTML = i18next.t('ants.rebornOfferingMult', {
    x: format(thresholdMods.antSacrificeOfferingMult, 2, false)
  })
  DOMCacheGetOrSet('immortalELOObtainium').innerHTML = i18next.t('ants.rebornObtainiumMult', {
    x: format(thresholdMods.antSacrificeObtainiumMult, 2, false)
  })
  DOMCacheGetOrSet('immortalELOTalismanFragments').innerHTML = i18next.t('ants.rebornTalismanShardMult', {
    x: format(thresholdMods.antSacrificeTalismanFragmentMult, 2, false)
  })

  DOMCacheGetOrSet('immortalELOCreationSpeed').innerHTML = i18next.t('ants.rebornELOGainSpeed', {
    x: format(thresholdMods.rebornSpeedMult, 3, true)
  })

  if (player.ants.immortalELO < effectiveELO) {
    DOMCacheGetOrSet('immortalELOGain').innerHTML = i18next.t('ants.immortalELOGain', {
      x: format(sacRewards.immortalELO, 0, true)
    })
  } else {
    DOMCacheGetOrSet('immortalELOGain').innerHTML = i18next.t('ants.immortalELOUntilGain', {
      x: format(player.ants.immortalELO - effectiveELO, 0, true)
    })
  }

  DOMCacheGetOrSet('eloStageDetail2').innerHTML = i18next.t('ants.stageInfo2', {
    percentage: format((1 - calculateStageRebornSpeedMult()) * 100, 3, true)
  })

  DOMCacheGetOrSet('antSacrificeOffering').textContent = `+${format(sacRewards.offerings)}`
  DOMCacheGetOrSet('antSacrificeObtainium').textContent = `+${format(sacRewards.obtainium)}`

  DOMCacheGetOrSet('lotusStatus').innerHTML = i18next.t('pseudoCoins.lotus.status', {
    time: timeRemainingMinutes(getLotusTimeExpiresAt())
  })
  DOMCacheGetOrSet('lotusOwnedAnt').innerHTML = i18next.t('pseudoCoins.lotus.owned', {
    x: format(getOwnedLotus(), 0, true)
  })

  if (player.challengecompletions[9] > 0) {
    // Helper function to update reward display and styling
    const updateRewardDisplay = (
      elementId: string,
      reward: Decimal,
      requirement: number,
      parentElementClass?: string
    ) => {
      const element = DOMCacheGetOrSet(elementId)
      const parentElement = parentElementClass ? element.closest(`.${parentElementClass}`) : element.parentElement

      if (effectiveELO >= requirement) {
        // Unlocked: show reward amount, remove locked styling
        element.textContent = i18next.t('ants.itemReward', { x: format(reward) })
        parentElement?.classList.remove('antSacrificeRewardLocked')
        const img = parentElement?.querySelector('img')
        img?.classList.remove('antSacrificeRewardImageLocked')
      } else {
        // Locked: show ELO requirement, add locked styling
        element.textContent = i18next.t('ants.eloRequirement', { x: format(requirement, 0, true) })
        parentElement?.classList.add('antSacrificeRewardLocked')
        const img = parentElement?.querySelector('img')
        img?.classList.add('antSacrificeRewardImageLocked')
      }
    }

    updateRewardDisplay(
      'antSacrificeTalismanShard',
      sacRewards.talismanCraftItems.shard,
      talismanItemRequiredELO.shard,
      'antSacrificeRewardColumn'
    )
    updateRewardDisplay(
      'antSacrificeCommonFragment',
      sacRewards.talismanCraftItems.commonFragment,
      talismanItemRequiredELO.commonFragment,
      'antSacrificeRewardColumn'
    )
    updateRewardDisplay(
      'antSacrificeUncommonFragment',
      sacRewards.talismanCraftItems.uncommonFragment,
      talismanItemRequiredELO.uncommonFragment,
      'antSacrificeRewardColumn'
    )
    updateRewardDisplay(
      'antSacrificeRareFragment',
      sacRewards.talismanCraftItems.rareFragment,
      talismanItemRequiredELO.rareFragment,
      'antSacrificeRewardColumn'
    )
    updateRewardDisplay(
      'antSacrificeEpicFragment',
      sacRewards.talismanCraftItems.epicFragment,
      talismanItemRequiredELO.epicFragment,
      'antSacrificeRewardColumn'
    )
    updateRewardDisplay(
      'antSacrificeLegendaryFragment',
      sacRewards.talismanCraftItems.legendaryFragment,
      talismanItemRequiredELO.legendaryFragment,
      'antSacrificeRewardColumn'
    )
    updateRewardDisplay(
      'antSacrificeMythicalFragment',
      sacRewards.talismanCraftItems.mythicalFragment,
      talismanItemRequiredELO.mythicalFragment,
      'antSacrificeRewardColumn'
    )
  }
}

export const sacrificeCountHTML = (sacrificeCount: number): void => {
  const numAnthills = toOrdinal(sacrificeCount + 1)
  DOMCacheGetOrSet('antSacrificeNumber').innerHTML = i18next.t('ants.currentAnthill', { ord: numAnthills })

  if (!getAchievementReward('autoAntSacrifice')) {
    DOMCacheGetOrSet('anthillsRemainingForAutoSac').innerHTML = i18next.t(
      'ants.altar.autoSacrificeLocked.anthillsUntilAutoSac',
      {
        x: format(50 - sacrificeCount, 0, true)
      }
    )
  }
}
