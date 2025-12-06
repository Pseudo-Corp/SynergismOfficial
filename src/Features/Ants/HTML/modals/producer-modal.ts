import i18next from 'i18next'
import { calculateActualAntSpeedMult } from '../../../../Calculate'
import { format, player } from '../../../../Synergism'
import { antProducerData } from '../../AntProducers/data/data'
import { calculateBaseAntsToBeGenerated } from '../../AntProducers/lib/calculate-production'
import { getCostMaxAnts, getCostNextAnt, getMaxPurchasableAnts } from '../../AntProducers/lib/get-cost'
import type { AntProducers } from '../../structs/structs'

export const antProducerHTML = (ant: AntProducers) => {
  let nameText = i18next.t(`ants.producers.${ant}.name`)
  if (player.ants.masteries[ant].mastery > 0) {
    nameText += ` <span style="color:green">[★${player.ants.masteries[ant].mastery}]</span>`
  }
  const nameHTML = `<span style="font-size: 1.2em; color: ${
    antProducerData[ant].color
  }" class="titleTextFont">${nameText}</span>`
  const flavorHTML = `<i><span class="titleTextFont" style="color: lightgray">${
    i18next.t(`ants.producers.${ant}.flavor`)
  }</span></i>`

  const producerCountHTML = `<span>${
    i18next.t('ants.producerCount', {
      x: format(player.ants.producers[ant].purchased, 0, true),
      y: format(player.ants.producers[ant].generated, 2)
    })
  }</span>`

  const antSpeedMult = calculateActualAntSpeedMult()
  const antsToBeGenerated = calculateBaseAntsToBeGenerated(ant, antSpeedMult)
  const generationHTML = `<span>${
    i18next.t(`ants.producers.${ant}.generates`, {
      x: format(antsToBeGenerated, 5, true)
    })
  }</span>`

  let costHTML: string
  const maxBuy = getMaxPurchasableAnts(ant, player.ants.crumbs)
  if (player.ants.toggles.maxBuyProducers && maxBuy > player.ants.producers[ant].purchased) {
    const cost = getCostMaxAnts(ant)
    costHTML = i18next.t('ants.costMaxLevels', {
      x: format(maxBuy - player.ants.producers[ant].purchased, 0, true),
      y: format(cost, 2, true)
    })
  } else {
    const cost = getCostNextAnt(ant)
    costHTML = i18next.t('ants.costSingleLevel', { x: format(cost, 2, true) })
  }

  if (antProducerData[ant].additionalTexts.length > 0) {
    let additionalTextHTML = ''
    for (const texts of antProducerData[ant].additionalTexts) {
      if (texts.displayCondition()) {
        additionalTextHTML += `<br>${texts.text()}`
      }
    }
    return `${nameHTML}<br>${flavorHTML}<br><br>${producerCountHTML}<br>${generationHTML}<br>${additionalTextHTML}<br><br>${costHTML}`
  }

  return `${nameHTML}<br>${flavorHTML}<br><br>${producerCountHTML}<br>${generationHTML}<br><br>${costHTML}`
}
