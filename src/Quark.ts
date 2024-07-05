import { calculateCubeQuarkMultiplier, calculateQuarkMultiplier } from './Calculate'
import { format, player } from './Synergism'

export const quarkHandler = () => {
  let maxTime = 90000 // In Seconds
  if (player.researches[195] > 0) {
    maxTime += 18000 * player.researches[195] // Research 8x20
  }

  // Part 2: Calculate quark gain per hour
  let baseQuarkPerHour = 5

  const quarkResearches = [99, 100, 125, 180, 195]
  for (const el of quarkResearches) {
    baseQuarkPerHour += player.researches[el]
  }

  baseQuarkPerHour *= +player.octeractUpgrades.octeractExportQuarks.getEffect().bonus

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

export const setQuarkBonus = (newBonus: number) => bonus = newBonus
export const getQuarkBonus = () => bonus

export class QuarkHandler {
  /** Quark amount */
  private QUARKS = 0

  constructor (quarks: number) {
    this.QUARKS = quarks
  }

  /*** Calculates the number of quarks to give with the current bonus. */
  applyBonus (amount: number) {
    const nonPatreon = calculateQuarkMultiplier()
    return amount * (1 + (getQuarkBonus() / 100)) * nonPatreon
  }

  /** Subtracts quarks, as the name suggests. */
  add (amount: number, useBonus = true) {
    this.QUARKS += useBonus ? this.applyBonus(amount) : amount
    player.quarksThisSingularity += useBonus ? this.applyBonus(amount) : amount
    return this
  }

  /** Add quarks, as suggested by the function's name. */
  sub (amount: number) {
    this.QUARKS -= amount
    if (this.QUARKS < 0) {
      this.QUARKS = 0
    }

    return this
  }

  public toString (val: number): string {
    return format(Math.floor(this.applyBonus(val)), 0, true)
  }

  /**
   * Resets the amount of quarks saved but keeps the bonus amount.
   */
  public reset () {
    this.QUARKS = 0
  }

  [Symbol.toPrimitive] = (t: string) => t === 'number' ? this.QUARKS : null
}
