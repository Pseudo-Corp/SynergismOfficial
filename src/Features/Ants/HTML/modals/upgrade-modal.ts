import i18next from 'i18next'
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
  const introHTML = `<span class="titleTextFont" style="color: lightgray">${upgradeData.intro()}</span>`

  const freeLevels = computeFreeAntUpgradeLevels()
  const levelHTML = `<span class="crimsonText">${
    i18next.t('ants.level', { x: format(player.ants.upgrades[antUpgrade], 0, true), y: format(freeLevels, 0, true) })
  }</span>`

  let challengeHTML = ''
  if (player.currentChallenge.ascension === 11) {
    challengeHTML = `<br><span style="color: orange">${i18next.t('ants.challenge11Modifier')}</span>`
  }

  let extinctionHTML = ''
  if (player.corruptions.used.extinction > 0) {
    extinctionHTML = `<br><span style="color: #00DDFF">${
      i18next.t('ants.corruptionDivisor', {
        x: format(player.corruptions.used.extinction, 0, true),
        y: format(player.corruptions.used.corruptionEffects('extinction'), 0, true)
      })
    }</span>`
  }
  const effectiveLevelHTML = `<span><b>${
    i18next.t('ants.effectiveLevel', { level: format(calculateTrueAntLevel(antUpgrade), 2, true) })
  }</b></span>`

  const descriptionHTML = `<span>${upgradeData.description()}</span>`

  const effectHTML = `<span style="color: gold">${upgradeData.effectDescription()}</span>`

  let costHTML: string
  const maxBuy = getMaxPurchasableAntUpgrades(antUpgrade, player.ants.crumbs)
  if (player.antMax && maxBuy > player.ants.upgrades[antUpgrade]) {
    const cost = getCostMaxAntUpgrades(antUpgrade)
    costHTML = i18next.t('ants.costMaxLevels', {
      x: format(maxBuy - player.ants.upgrades[antUpgrade], 0, true),
      y: format(cost, 2, true)
    })
  } else {
    const cost = getCostNextAntUpgrade(antUpgrade)
    costHTML = i18next.t('ants.costSingleLevel', { x: format(cost, 2, true) })
  }

  return `${nameHTML}<br>${introHTML}<br><br>${levelHTML}${challengeHTML}${extinctionHTML}<br>${effectiveLevelHTML}<br><br>${descriptionHTML}<br>${effectHTML}<br><br>${costHTML}`
}
