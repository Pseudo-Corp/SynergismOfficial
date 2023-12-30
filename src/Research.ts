import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { calculateAnts, calculateRuneLevels, calculateSummationNonLinear } from './Calculate'
import type { IMultiBuy } from './Cubes'
import { calculateSingularityDebuff } from './singularity'
import { format, player } from './Synergism'
import { revealStuff, updateChallengeDisplay } from './UpdateHTML'
import { updateClassList } from './Utility'
import { Globals as G } from './Variables'

const getResearchCost = (index: number, buyAmount = 1, linGrowth = 0): IMultiBuy => {
  buyAmount = Math.min(G.researchMaxLevels[index] - player.researches[index], buyAmount)
  const metaData = calculateSummationNonLinear(
    player.researches[index],
    G.researchBaseCosts[index] * calculateSingularityDebuff('Researches'),
    player.researchPoints,
    linGrowth,
    buyAmount
  )
  return metaData
}

export const updateAutoResearch = (index: number, auto: boolean) => {
  /* If Cube Upgrade 9 (1x9) is purchased, then automation behaves differently.
     If not purchased, then clicking on a research icon while auto toggled will update research for you.*/
  if (autoResearchEnabled() && auto && player.autoResearchMode === 'cheapest') {
    player.autoResearch = G.researchOrderByCost[player.roombaResearchIndex]

    // Checks if this is maxed. If so we proceed to the next research.
    if (isResearchMaxed(player.autoResearch)) {
      DOMCacheGetOrSet(`res${player.autoResearch || 1}`).classList.remove('researchRoomba')
      player.roombaResearchIndex = Math.min(
        G.researchOrderByCost.length - 1,
        player.roombaResearchIndex + 1
      )
    }

    // Checks against researches invalid or not unlocked.
    while (!isResearchUnlocked(player.autoResearch) && player.autoResearch < 200 && player.autoResearch >= 76) {
      player.roombaResearchIndex += 1
      player.autoResearch = G.researchOrderByCost[player.roombaResearchIndex]
    }

    // Researches that are unlocked work
    if (isResearchUnlocked(player.autoResearch)) {
      const idx = Math.max(G.researchOrderByCost[player.roombaResearchIndex], 1)
      const doc = DOMCacheGetOrSet(`res${idx}`)
      if (player.researches[player.autoResearch] < G.researchMaxLevels[player.autoResearch]) {
        doc.classList.add('researchRoomba')
      }
    }

    return
  } else if (!auto && (!autoResearchEnabled() || player.autoResearchMode === 'manual')) {
    /* We remove the old research HTML from the 'roomba' class and make the new index our 'roomba'
           class. We then update the index and consequently the coloring of the background based
           on what level (if any) the research has. This functionality is useless after
           Cube Upgrade 9 (1x9) has been purchased. */
    DOMCacheGetOrSet(`res${player.autoResearch || 1}`).classList.remove('researchRoomba')
    DOMCacheGetOrSet(`res${index}`).classList.add('researchRoomba')
    player.autoResearch = index

    // Research is maxed
    if (player.researches[index] >= G.researchMaxLevels[index]) {
      updateClassList(`res${player.autoResearch}`, ['researchMaxed'], ['researchPurchased', 'researchUnpurchased'])
    } else if (player.researches[index] >= 1) {
      // Research purchased above level 0 but not maxed
      updateClassList(`res${player.autoResearch}`, ['researchPurchased'], ['researchUnpurchased', 'researchMaxed'])
    } else {
      // Research has not been purchased yet
      updateClassList(`res${player.autoResearch}`, ['researchUnpurchased'], ['researchPurchased', 'researchMaxed'])
    }

    return
  } else {
    return
  } // There might be code needed here. I don't quite know yet. -Platonic
}

/**
 * Should the user have access to autoResearch
 * @returns boolean
 */
export const autoResearchEnabled = (): boolean => {
  return (player.cubeUpgrades[9] === 1 || player.highestSingularityCount > 10)
}
/**
 * Attempts to buy the research of the index selected. This is hopefully an improvement over buyResearch. Fuck
 * @param index
 * @param auto
 * @param linGrowth
 * @returns
 */
export const buyResearch = (index: number, auto = false, linGrowth = 0, hover = false): boolean => {
  // Get our costs, and determine if anything is purchasable.
  const buyAmount = (player.researchBuyMaxToggle || auto || hover) ? 1e5 : 1
  const metaData = getResearchCost(index, buyAmount, linGrowth) /* Destructuring FTW! */
  const canBuy = player.researchPoints >= metaData.cost

  if (canBuy && isResearchUnlocked(index) && !isResearchMaxed(index)) {
    player.researches[index] = metaData.levelCanBuy
    player.researchPoints -= metaData.cost
    // Quick check after upgrading for max. This is to update any automation regardless of auto state
    if (isResearchMaxed(index)) {
      DOMCacheGetOrSet(`res${player.autoResearch || 1}`).classList.remove('researchRoomba')
    }

    // Update the progress description
    G.researchfiller2 = `Level: ${player.researches[index]}/${G.researchMaxLevels[index]}`
    researchDescriptions(index, auto, linGrowth)

    // Handle special cases: Researches 47-50 (2x21-2x25)
    // I love the ||= operator -Platonic
    player.unlocks.rrow1 ||= true
    player.unlocks.rrow2 ||= true
    player.unlocks.rrow3 ||= true
    player.unlocks.rrow4 ||= true
    if (index >= 47 && index <= 50) {
      revealStuff()
    }
    if ((index >= 66 && index <= 70) || index === 105) {
      updateChallengeDisplay()
    }

    // Update ants and runes.
    calculateRuneLevels()
    calculateAnts()
  }

  // Update HTML for auto stuff if auto research is ever toggled.
  if (player.autoResearchToggle) {
    updateAutoResearch(index, auto)
  }

  // Note to anyone reading this code: I forget why this needs to return a Boolean.
  // -Platonic
  return canBuy
}

/**
 * Calculates the max research index for the research roomba
 */
export const maxRoombaResearchIndex = (p = player) => {
  const base = p.ascensionCount > 0 ? 140 : 125 // 125 researches pre-A + 15 from A
  const c11 = p.challengecompletions[11] > 0 ? 15 : 0
  const c12 = p.challengecompletions[12] > 0 ? 15 : 0
  const c13 = p.challengecompletions[13] > 0 ? 15 : 0
  const c14 = p.challengecompletions[14] > 0 ? 15 : 0
  return base + c11 + c12 + c13 + c14
}

export const isResearchUnlocked = (index: number) => {
  // https://stackoverflow.com/questions/20477177/creating-an-array-of-cumulative-sum-in-javascript
  const cumuSum = ((sum) => (value: number) => sum += value)(0)
  const indices = [3 * 25, 5, 20, 10, 15, 15, 15, 15, 15, 15].map(cumuSum)
  const chievos = [50, 124, 127, 134, 141, 183, 197, 204, 211, 218]
  for (let i = 0; i < indices.length; i++) {
    if (i === 3 && (index === 121 || index === 124 || index === 150)) {
      return player.achievements[chievos[i]] > 0
    }
    if (index <= indices[i]) {
      return player.achievements[chievos[i]] > 0
    }
  }
  return false
}

const isResearchMaxed = (index: number) => G.researchMaxLevels[index] <= player.researches[index]

export const researchDescriptions = (i: number, auto = false, linGrowth = 0) => {
  const buyAmount = (player.researchBuyMaxToggle || auto) ? 100000 : 1
  const y = i18next.t(`researches.descriptions.${i}`)
  const p = `res${i}`

  if (player.toggles[38] && player.singularityCount > 0) {
    buyResearch(i, false, i === 200 ? 0.01 : 0, true)
  }

  const metaData = getResearchCost(i, buyAmount, linGrowth)
  let z = i18next.t('researches.cost', {
    x: format(metaData.cost, 0, false),
    y: format(metaData.levelCanBuy - player.researches[i], 0, true)
  })

  if (player.researches[i] === (G.researchMaxLevels[i])) {
    DOMCacheGetOrSet('researchcost').style.color = 'Gold'
    DOMCacheGetOrSet('researchinfo3').style.color = 'plum'
    updateClassList(p, ['researchMaxed'], ['researchAvailable', 'researchPurchased', 'researchPurchasedAvailable'])
    z += i18next.t('researches.maxed')
  } else {
    DOMCacheGetOrSet('researchcost').style.color = 'limegreen'
    DOMCacheGetOrSet('researchinfo3').style.color = 'white'
    if (player.researches[i] > 0) {
      updateClassList(p, ['researchPurchased', 'researchPurchasedAvailable'], [
        'researchAvailable',
        'researchMaxed',
        'researchUnpurchased'
      ])
    } else {
      updateClassList(p, ['researchAvailable'], ['researchPurchased', 'researchMaxed', 'researchUnpurchased'])
    }
  }

  if (player.researchPoints < metaData.cost && player.researches[i] < (G.researchMaxLevels[i])) {
    DOMCacheGetOrSet('researchcost').style.color = 'var(--crimson-text-color)'
    updateClassList(p, [], ['researchMaxed', 'researchAvailable', 'researchPurchasedAvailable'])
  }

  DOMCacheGetOrSet('researchinfo2').textContent = y
  DOMCacheGetOrSet('researchcost').textContent = z
  DOMCacheGetOrSet('researchinfo3').textContent = i18next.t('researches.level', {
    x: player.researches[i],
    y: G.researchMaxLevels[i]
  })
}

export const updateResearchBG = (j: number) => {
  if (player.researches[j] > G.researchMaxLevels[j]) {
    player.researchPoints += (player.researches[j] - G.researchMaxLevels[j]) * G.researchBaseCosts[j]
    player.researches[j] = G.researchMaxLevels[j]
  }

  const k = `res${j}`
  if (player.researches[j] > 0.5 && player.researches[j] < G.researchMaxLevels[j]) {
    updateClassList(k, ['researchPurchased'], ['researchUnpurchased', 'researchMaxed'])
  } else if (player.researches[j] > 0.5 && player.researches[j] >= G.researchMaxLevels[j]) {
    updateClassList(k, ['researchMaxed'], ['researchUnpurchased', 'researchPurchased'])
  } else {
    updateClassList(k, ['researchUnpurchased'], ['researchPurchased', 'researchMaxed'])
  }
}
