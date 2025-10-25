import type Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { DOMCacheGetOrSet } from '../../../../Cache/DOM'
import { calculateAntSacrificeMultiplier } from '../../../../Calculate'
import { offeringObtainiumTimeModifiers } from '../../../../Statistics'
import { format, player } from '../../../../Synergism'
import { antSacrificeRewards } from '../../AntSacrifice/Rewards/calculate-rewards'
import { calculateBaseAntELO, calculateEffectiveAntELO } from '../../AntSacrifice/Rewards/ELO/AntELO/lib/calculate'
import { calculateAntSpeedMultFromELO } from '../../AntSacrifice/Rewards/ELO/RebornELO/lib/ant-speed'
import { calculateAvailableRebornELO } from '../../AntSacrifice/Rewards/ELO/RebornELO/lib/calculate'
import {
  calculateRebornELOThresholds,
  thresholdModifiers
} from '../../AntSacrifice/Rewards/ELO/RebornELO/Stages/lib/threshold'
import { talismanItemRequiredELO } from '../../AntSacrifice/Rewards/TalismanCraftItems/constants'

export const showSacrifice = () => {
  const sacRewards = antSacrificeRewards()

  const baseELO = calculateBaseAntELO()
  const effectiveELO = calculateEffectiveAntELO(baseELO)

  const timeMultiplier = offeringObtainiumTimeModifiers(player.antSacrificeTimer, true).reduce(
    (a, b) => a * b.stat(),
    1
  )
  DOMCacheGetOrSet('ELO').innerHTML = i18next.t('ants.yourAntELO', {
    x: format(effectiveELO, 2, true)
  })

  DOMCacheGetOrSet('crumbCountAgain').textContent = i18next.t(
    'ants.galacticCrumbCountThisSacrifice',
    {
      x: format(player.ants.highestCrumbsThisSacrifice, 2, true, undefined, undefined, true)
    }
  )

  DOMCacheGetOrSet('sacrificeUpgradeMultiplier').innerHTML = i18next.t('ants.altarRewardMultiplier', {
    x: format(calculateAntSacrificeMultiplier(), 3, true)
  })

  DOMCacheGetOrSet('sacrificeTimeMultiplier').innerHTML = i18next.t('ants.altarTimeMultiplier', {
    x: format(timeMultiplier, 3, true)
  })

  DOMCacheGetOrSet('immortalELO').innerHTML = i18next.t('ants.immortalELO', {
    x: format(player.ants.immortalELO, 0, true)
  })
  DOMCacheGetOrSet('activatedImmortalELO').innerHTML = i18next.t('ants.activatedImmortalELO', {
    x: format(player.ants.rebornELO, 2, true),
    y: format(calculateAvailableRebornELO(), 2, true)
  })

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

  DOMCacheGetOrSet('antSacrificeOffering').textContent = `+${format(sacRewards.offerings)}`
  DOMCacheGetOrSet('antSacrificeObtainium').textContent = `+${format(sacRewards.obtainium)}`

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
        element.textContent = i18next.t('ants.elo', { x: format(reward) })
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
