import Decimal from 'break_infinity.js'
import { z } from 'zod'
import { QuarkHandler } from '../Quark'

const decimalSchema = z.custom<Decimal>((value) => {
  try {
    new Decimal(value)
    return true
  } catch {
    return false
  }
}).transform((decimalSource) => new Decimal(decimalSource))

export const playerSchema = z.object({
  firstPlayed: z.string().date().optional().default(() => new Date().toISOString()),
  worlds: z.object({ worlds: z.number() }).transform((obj) => {
    return new QuarkHandler({ quarks: obj.worlds })
  }),
  coins: decimalSchema,
  coinsThisPrestige: decimalSchema,
  coinsThisTranscension: decimalSchema,
  coinsThisReincarnation: decimalSchema,
  coinsTotal: decimalSchema,

  firstOwnedCoin: z.number(),
  firstGeneratedCoin: decimalSchema,
  firstCostCoin: decimalSchema,
  firstProduceCoin: z.number(),

  secondOwnedCoin: z.number(),
  secondGeneratedCoin: decimalSchema,
  secondCostCoin: decimalSchema,
  secondProduceCoin: z.number(),

  thirdOwnedCoin: z.number(),
  thirdGeneratedCoin: decimalSchema,
  thirdCostCoin: decimalSchema,
  thirdProduceCoin: z.number(),

  fourthOwnedCoin: z.number(),
  fourthGeneratedCoin: decimalSchema,
  fourthCostCoin: decimalSchema,
  fourthProduceCoin: z.number(),

  fifthOwnedCoin: z.number(),
  fifthGeneratedCoin: decimalSchema,
  fifthCostCoin: decimalSchema,
  fifthProduceCoin: z.number(),

  firstOwnedDiamonds: z.number(),
  firstGeneratedDiamonds: decimalSchema,
  firstCostDiamonds: decimalSchema,
  firstProduceDiamonds: z.number(),

  secondOwnedDiamonds: z.number(),
  secondGeneratedDiamonds: decimalSchema,
  secondCostDiamonds: decimalSchema,
  secondProduceDiamonds: z.number(),

  thirdOwnedDiamonds: z.number(),
  thirdGeneratedDiamonds: decimalSchema,
  thirdCostDiamonds: decimalSchema,
  thirdProduceDiamonds: z.number(),

  fourthOwnedDiamonds: z.number(),
  fourthGeneratedDiamonds: decimalSchema,
  fourthCostDiamonds: decimalSchema,
  fourthProduceDiamonds: z.number(),

  fifthOwnedDiamonds: z.number(),
  fifthGeneratedDiamonds: decimalSchema,
  fifthCostDiamonds: decimalSchema,
  fifthProduceDiamonds: z.number(),

  firstOwnedMythos: z.number(),
  firstGeneratedMythos: decimalSchema,
  firstCostMythos: decimalSchema,
  firstProduceMythos: z.number(),

  secondOwnedMythos: z.number(),
  secondGeneratedMythos: decimalSchema,
  secondCostMythos: decimalSchema,
  secondProduceMythos: z.number(),

  thirdOwnedMythos: z.number(),
  thirdGeneratedMythos: decimalSchema,
  thirdCostMythos: decimalSchema,
  thirdProduceMythos: z.number(),

  fourthOwnedMythos: z.number(),
  fourthGeneratedMythos: decimalSchema,
  fourthCostMythos: decimalSchema,
  fourthProduceMythos: z.number(),

  fifthOwnedMythos: z.number(),
  fifthGeneratedMythos: decimalSchema,
  fifthCostMythos: decimalSchema,
  fifthProduceMythos: z.number(),

  firstOwnedParticles: z.number(),
  firstGeneratedParticles: decimalSchema,
  firstCostParticles: decimalSchema,
  firstProduceParticles: z.number(),

  secondOwnedParticles: z.number(),
  secondGeneratedParticles: decimalSchema,
  secondCostParticles: decimalSchema,
  secondProduceParticles: z.number(),

  thirdOwnedParticles: z.number(),
  thirdGeneratedParticles: decimalSchema,
  thirdCostParticles: decimalSchema,
  thirdProduceParticles: z.number(),

  fourthOwnedParticles: z.number(),
  fourthGeneratedParticles: decimalSchema,
  fourthCostParticles: decimalSchema,
  fourthProduceParticles: z.number(),

  fifthOwnedParticles: z.number(),
  fifthGeneratedParticles: decimalSchema,
  fifthCostParticles: decimalSchema,
  fifthProduceParticles: z.number(),

  firstOwnedAnts: z.number(),
  firstGeneratedAnts: decimalSchema,
  firstCostAnts: decimalSchema,
  firstProduceAnts: z.number(),

  secondOwnedAnts: z.number(),
  secondGeneratedAnts: decimalSchema,
  secondCostAnts: decimalSchema,
  secondProduceAnts: z.number(),

  thirdOwnedAnts: z.number(),
  thirdGeneratedAnts: decimalSchema,
  thirdCostAnts: decimalSchema,
  thirdProduceAnts: z.number(),

  fourthOwnedAnts: z.number(),
  fourthGeneratedAnts: decimalSchema,
  fourthCostAnts: decimalSchema,
  fourthProduceAnts: z.number(),

  fifthOwnedAnts: z.number(),
  fifthGeneratedAnts: decimalSchema,
  fifthCostAnts: decimalSchema,
  fifthProduceAnts: z.number(),

  sixthOwnedAnts: z.number(),
  sixthGeneratedAnts: decimalSchema,
  sixthCostAnts: decimalSchema,
  sixthProduceAnts: z.number(),

  seventhOwnedAnts: z.number(),
  seventhGeneratedAnts: decimalSchema,
  seventhCostAnts: decimalSchema,
  seventhProduceAnts: z.number(),

  eighthOwnedAnts: z.number(),
  eighthGeneratedAnts: decimalSchema,
  eighthCostAnts: decimalSchema,
  eighthProduceAnts: z.number(),
})
