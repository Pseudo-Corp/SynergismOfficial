import { MersenneTwister } from 'fast-mersenne-twister'
import { player } from './Synergism'

export const seededRandom = (index: SeedValues) => MersenneTwister(player.seed[index]++).random()

/**
 * Generates a random number (inclusive) between {@param min} and {@param max}.
 * @param min min
 * @param max max
 */
export const seededBetween = (index: SeedValues, min: number, max: number) =>
  Math.floor(seededRandom(index) * (max - min + 1) + min)

export const Seed = {
  PromoCodes: 0,
  Ambrosia: 1
} as const

export type SeedValues = typeof Seed[keyof typeof Seed]
