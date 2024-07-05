import { MersenneTwister } from 'fast-mersenne-twister'
import { player } from './Synergism'

export const seededRandom = () => MersenneTwister(player.seed++).random()

/**
 * Generates a random number (inclusive) between {@param min} and {@param max}.
 * @param min min
 * @param max max
 */
export const seededBetween = (min: number, max: number) => Math.floor(seededRandom() * (max - min + 1) + min)
