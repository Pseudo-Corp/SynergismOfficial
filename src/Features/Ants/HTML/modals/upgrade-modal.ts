import i18next from 'i18next'
import { challenge15CorruptionEffect } from '../../../../Corruptions'
import { AntSacrificeTiers } from '../../../../Reset'
import { format, player } from '../../../../Synergism'
import { antUpgradeData } from '../../AntUpgrades/data/data'
import { computeFreeAntUpgradeLevels } from '../../AntUpgrades/lib/free-levels'
import {
  getCostMaxAntUpgrades,
  getCostNextAntUpgrade,
  getMaxPurchasableAntUpgrades
} from '../../AntUpgrades/lib/get-cost'
import { calculateTrueAntLevel } from '../../AntUpgrades/lib/total-levels'
import type { AntUpgrades } from '../../AntUpgrades/structs/structs'

export const antUpgradeHTML = (antUpgrade: AntUpgrades) => {
  const upgradeData = antUpgradeData[antUpgrade]
  const nameHTML = `<span style="font-size: 1.2em;" class="titleTextFont">${upgradeData.name()}</span>`
  const introHTML = `<i><span class="titleTextFont" style="color: var(--lightgray-color)">${upgradeData.intro()}</span></i>`

  const freeLevels = computeFreeAntUpgradeLevels()
  const levelHTML = `<span class="crimsonText">${
    i18next.t('ants.level', { x: format(player.ants.upgrades[antUpgrade], 0, true), y: format(freeLevels, 2, true) })
  }</span>`

  let challengeHTML = ''
  if (player.currentChallenge.ascension === 11) {
    challengeHTML = `<br><span style="color: var(--orange-color)">${i18next.t('ants.challenge11Modifier')}</span>`
  }

  let extinctionHTML = ''
  if (player.currentChallenge.ascension === 15 && !upgradeData.exemptFromCorruption) {
    extinctionHTML = `<br><span style="color: var(--hex-00ddff-color)">${
      i18next.t('ants.corruptionDivisor', {
        y: format(challenge15CorruptionEffect('extinction'), 2, true)
      })
    }</span>`
  }

  let exemptHTML = ''
  if (upgradeData.exemptFromCorruption) {
    exemptHTML = `<br><span style="color: var(--hex-00ddff-color)">${i18next.t('ants.upgrades.ignoreCorruption')}</span>`
  }
  const effectiveLevelHTML = `<span><b>${
    i18next.t('ants.effectiveLevel', { level: format(calculateTrueAntLevel(antUpgrade), 2, true) })
  }</b></span>`

  const descriptionHTML = `<span>${upgradeData.description()}</span>`

  const effectHTML = `<span style="color: var(--gold-color)">${upgradeData.effectDescription()}</span>`

  let costHTML: string
  const maxBuy = getMaxPurchasableAntUpgrades(antUpgrade, player.ants.crumbs)
  if (player.ants.toggles.maxBuyUpgrades && maxBuy > player.ants.upgrades[antUpgrade]) {
    const cost = getCostMaxAntUpgrades(antUpgrade)
    costHTML = i18next.t('ants.costMaxLevels', {
      x: format(maxBuy - player.ants.upgrades[antUpgrade], 0, true, false),
      y: format(cost, 2, true, false)
    })
  } else {
    const cost = getCostNextAntUpgrade(antUpgrade)
    costHTML = i18next.t('ants.costSingleLevel', { x: format(cost, 2, true) })
  }

  let autoHTML: string
  if (upgradeData.autobuy()) {
    autoHTML = `<span style="color: var(--lightgreen-color)">${i18next.t('ants.upgrades.automationUnlocked')}</span>`
  } else {
    autoHTML = `<span style="color: var(--gray-color)">${upgradeData.lockedAutoDescription()}</span>`
  }

  let resetHTML: string
  if (upgradeData.minimumResetTier === AntSacrificeTiers.sacrifice) {
    resetHTML = `<span style="color: var(--crimson-color)">${i18next.t('ants.upgrades.sacrificeReset')}</span>`
  } else if (upgradeData.minimumResetTier === AntSacrificeTiers.ascension) {
    resetHTML = `<span style="color: var(--orange-color)">${i18next.t('ants.upgrades.ascensionReset')}</span>`
  } else {
    resetHTML = `<span style="color: var(--lightgoldenrodyellow-color)">${i18next.t('ants.upgrades.singularityReset')}</span>`
  }

  return `${nameHTML}<br>${introHTML}<br><br>
  ${levelHTML}${challengeHTML}${extinctionHTML}${exemptHTML}<br>${effectiveLevelHTML}<br><br>
  ${descriptionHTML}<br>${effectHTML}<br>${autoHTML}<br><br>
  ${resetHTML}<br>${costHTML}`
}
