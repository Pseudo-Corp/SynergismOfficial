import i18next from 'i18next'
import { getAchievementReward } from '../../../../Achievements'
import { format, player } from '../../../../Synergism'
import { antMasteryData } from '../../AntMasteries/data/data'
import { calculateSelfSpeedFromMastery } from '../../AntMasteries/lib/ant-speed'
import { getMaxAntMasteryLevel } from '../../AntMasteries/lib/max-level'
import { antProducerData } from '../../AntProducers/data/data'
import type { AntProducers } from '../../structs/structs'

export const antMasteryHTML = (ant: AntProducers): string => {
  const nameColor = `color-mix(in srgb, ${antProducerData[ant].color} 60%, lime 40%)`
  const nameHTML = `<span style="font-size: 1.2em; color: ${nameColor}" class="titleTextFont">${
    i18next.t(`ants.mastery.${ant}.name`)
  }</span>`
  const flavorHTML = `<i><span style="color: lightgray" class="titleTextFont">${
    i18next.t(`ants.mastery.${ant}.flavor`)
  }</span></i>`

  const level = player.ants.masteries[ant].mastery
  const maxLevel = getMaxAntMasteryLevel()
  const selfBaseMult = antMasteryData[ant].selfSpeedMultipliers[level]
  const selfPowerBase = level * antMasteryData[ant].selfPowerIncrement + 0.01 * Math.min(1, level)
  const selfTotalMult = calculateSelfSpeedFromMastery(ant)

  const levelHTML = `<span>${
    i18next.t('ants.mastery.level', { x: format(level, 0, true), y: format(maxLevel, 0, true) })
  }</span>`
  const multHTML = `<span>${i18next.t(`ants.mastery.${ant}.effect`, { x: format(selfTotalMult, 2, false) })}</span>`

  let effectHTML = ''
  if (level >= maxLevel) {
    effectHTML = `<span>${
      i18next.t('ants.mastery.maxedSelfAnt', {
        x: format(selfBaseMult, 2, false)
      })
    }</span>`
    effectHTML += `<br><span>${
      i18next.t(`ants.mastery.${ant}.maxedSelfPer`, {
        x: format(1 + selfPowerBase, 3, true)
      })
    }</span>`

    return `${nameHTML}<br>${flavorHTML}<br><br>${levelHTML}<br>${effectHTML}<br>${multHTML}`
  } else {
    const selfBaseMultNextLevel = antMasteryData[ant].selfSpeedMultipliers[level + 1]
    const selfPowerBaseNextLevel = (level + 1) * antMasteryData[ant].selfPowerIncrement + 0.01 * Math.min(1, level + 1)
    effectHTML = `<span>${
      i18next.t('ants.mastery.notMaxedSelfAnt', {
        x: format(selfBaseMult, 2, false),
        y: format(selfBaseMultNextLevel, 2, false)
      })
    }</span>`
    effectHTML += `<br><span>${
      i18next.t(`ants.mastery.${ant}.notMaxedSelfPer`, {
        x: format(1 + selfPowerBase, 3, true),
        y: format(1 + selfPowerBaseNextLevel, 3, true)
      })
    }</span>`

    const autoBuyer = +getAchievementReward('antAutobuyers') - 1
    let autoBuyerHTML = ''
    if (autoBuyer >= ant && player.ants.masteries[ant].mastery < player.ants.masteries[ant].highestMastery) {
      autoBuyerHTML = `<span style="color:lime">${i18next.t('ants.mastery.alreadyPurchased')}</span><br>`
    }

    const reqELO = antMasteryData[ant].totalELORequirements[level]
    const reqELOHTML = `<span>${
      i18next.t('ants.mastery.eloRequirement', {
        x: format(reqELO, 0, true),
        y: format(player.ants.rebornELO, 0, true)
      })
    }</span>`

    const reqParticleCost = antMasteryData[ant].particleCosts[level]
    const reqParticleCostHTML = `<span>${
      i18next.t('ants.mastery.particleCost', {
        x: format(reqParticleCost, 0, true, undefined, undefined, true)
      })
    }</span>`

    return `${nameHTML}<br>${flavorHTML}<br><br>${levelHTML}<br>${effectHTML}<br>${multHTML}<br><br>${autoBuyerHTML}${reqELOHTML}<br>${reqParticleCostHTML}`
  }
}
