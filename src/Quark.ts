import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { calculateCubeQuarkMultiplier, calculateQuarkMultiplier } from './Calculate'
import { getOcteractUpgradeEffect } from './Octeracts'
import { checkServerDate } from './PollGuard'
import { format, player } from './Synergism'

const quarkResearches = [99, 100, 125, 180, 195]

export const quarkHandler = () => {
  let maxTime = 90000 // In Seconds
  if (player.researches[195] > 0) {
    maxTime += 18000 * player.researches[195] // Research 8x20
  }

  // Part 2: Calculate quark gain per hour
  let baseQuarkPerHour = 5

  for (const el of quarkResearches) {
    baseQuarkPerHour += player.researches[el]
  }

  baseQuarkPerHour *= getOcteractUpgradeEffect('octeractExportQuarks', 'exportQuarkMult')

  const quarkPerHour = baseQuarkPerHour

  // Part 3: Calculates capacity of quarks on export
  const capacity = Math.floor(quarkPerHour * maxTime / 3600)

  // Part 4: Calculate how many quarks are to be gained.
  const quarkGain = Math.floor(player.quarkstimer * quarkPerHour / 3600)

  // Part 5 [June 9, 2021]: Calculate bonus awarded to cube quarks.
  const cubeMult = calculateCubeQuarkMultiplier()
  // Return maxTime, quarkPerHour, capacity and quarkGain as object
  return {
    maxTime,
    perHour: quarkPerHour,
    capacity,
    gain: quarkGain,
    cubeMult
  }
}

let bonus = 0
let personalQuarkBonus = 0
let globalQuarkBonus = 0

const recalculateBonus = () => {
  bonus = 100 * (1 + globalQuarkBonus / 100) * (1 + personalQuarkBonus / 100) - 100
}

const updateQuarkUI = (personalBonus: number, globalBonus: number) => {
  const currentBonus = DOMCacheGetOrSet('currentBonus')
  if (personalBonus > 0) {
    currentBonus.innerHTML = i18next.t('settings.quarkBonusExtended', {
      globalBonus,
      personalBonusMult: format(1 + personalBonus / 100, 3, true),
      totalBonus: format(bonus, 2, true)
    })
  } else {
    currentBonus.innerHTML = i18next.t('settings.quarkBonusSimple', { globalBonus })
  }
}

export const getQuarkBonus = () => bonus

export const getGlobalBonus = () => globalQuarkBonus
export const getPersonalBonus = () => personalQuarkBonus

export const setPersonalQuarkBonus = (personalBonus: number) => {
  personalQuarkBonus = personalBonus
  recalculateBonus()

  updateQuarkUI(personalBonus, globalQuarkBonus)
}

export const setGlobalQuarkBonus = (globalBonus: number) => {
  globalQuarkBonus = globalBonus
  recalculateBonus()

  updateQuarkUI(personalQuarkBonus, globalBonus)
}

export class QuarkHandler {
  /*** Calculates the number of quarks to give with the current bonus. */
  applyBonus (amount: number) {
    return amount * calculateQuarkMultiplier()
  }

  /** Subtracts quarks, as the name suggests. */
  add (amount: number, useBonus: boolean, addToQuarksThisSingularity: boolean) {
    player.worlds += useBonus ? this.applyBonus(amount) : amount
    if (addToQuarksThisSingularity) {
      player.quarksThisSingularity += useBonus ? this.applyBonus(amount) : amount
    }
    return this
  }

  /** Add quarks, as suggested by the function's name. */
  sub (amount: number) {
    player.worlds -= amount
    if (player.worlds < 0) {
      this.set(0)
    }

    return this
  }

  set (value: number) {
    player.worlds = value
  }

  public toString (val: number): string {
    return format(Math.floor(this.applyBonus(val)), 0, true)
  }
}

export const worlds = new QuarkHandler()

export const refreshQuarkBonus = async () => {
  const response = await fetch('https://synergism.cc/api/v1/quark-bonus')

  checkServerDate(response)

  // eslint-disable-next-line no-shadow
  const { bonus } = await response.json() as { bonus: number }

  setGlobalQuarkBonus(bonus)
}
