import { player } from './Synergism'
import { sumContents } from './Utility'
import { Globals as G } from './Variables'

import Decimal from 'break_infinity.js'
import { achievementaward } from './Achievements'
import { CalcECC } from './Challenges'

export const calculatetax = () => {
  let exp = 1
  let compareB = new Decimal(0)
  let compareC = new Decimal(0)
  G.produceFirst = (player.firstGeneratedCoin.add(player.firstOwnedCoin)).times(G.globalCoinMultiplier).times(
    G.coinOneMulti
  )
    .times(player.firstProduceCoin)
  G.produceSecond = (player.secondGeneratedCoin.add(player.secondOwnedCoin)).times(G.globalCoinMultiplier).times(
    G.coinTwoMulti
  )
    .times(player.secondProduceCoin)
  G.produceThird = (player.thirdGeneratedCoin.add(player.thirdOwnedCoin)).times(G.globalCoinMultiplier).times(
    G.coinThreeMulti
  )
    .times(player.thirdProduceCoin)
  G.produceFourth = (player.fourthGeneratedCoin.add(player.fourthOwnedCoin)).times(G.globalCoinMultiplier).times(
    G.coinFourMulti
  )
    .times(player.fourthProduceCoin)
  G.produceFifth = (player.fifthGeneratedCoin.add(player.fifthOwnedCoin)).times(G.globalCoinMultiplier).times(
    G.coinFiveMulti
  )
    .times(player.fifthProduceCoin)
  G.produceTotal = G.produceFirst.add(G.produceSecond).add(G.produceThird).add(G.produceFourth)
    .add(G.produceFifth)

  if (G.produceFirst.lte(.0001)) {
    G.produceFirst = new Decimal(0)
  }
  if (G.produceSecond.lte(.0001)) {
    G.produceSecond = new Decimal(0)
  }
  if (G.produceThird.lte(.0001)) {
    G.produceThird = new Decimal(0)
  }
  if (G.produceFourth.lte(.0001)) {
    G.produceFourth = new Decimal(0)
  }
  if (G.produceFifth.lte(.0001)) {
    G.produceFifth = new Decimal(0)
  }

  G.producePerSecond = G.produceTotal.times(40)

  if (player.currentChallenge.reincarnation === 6) {
    exp = 3 * Math.pow(1 + player.challengecompletions[6] / 25, 2)
  }
  if (player.currentChallenge.reincarnation === 9) {
    exp = 0.005
  }
  if (player.currentChallenge.ascension === 15) {
    exp = 0.000005
  }
  // im doing this to spite xander, basically changes w5x9 to not impact tax scaling in c13 || Sean#7236
  const c13effcompletions = Math.max(
    0,
    sumContents(player.challengecompletions) - player.challengecompletions[11] - player.challengecompletions[12]
      - player.challengecompletions[13] - player.challengecompletions[14] - player.challengecompletions[15]
      - 3 * player.cubeUpgrades[49] - ((player.singularityCount >= 15) ? 4 : 0)
      - ((player.singularityCount >= 20) ? 1 : 0)
  )
  if (player.currentChallenge.ascension === 13) {
    exp *= 700 * (1 + 1 / 6 * player.challengecompletions[13])
    exp *= Math.pow(1.05, c13effcompletions)
  }
  if (player.challengecompletions[6] > 0) {
    exp /= 1.075
  }
  let exponent = 1
  exponent *= exp
  exponent *= 1 - 1 / 20 * player.researches[51] - 1 / 40 * player.researches[52] - 1 / 80 * player.researches[53]
    - 1 / 160 * player.researches[54] - 1 / 320 * player.researches[55]
  exponent *= 1
    - 0.05 / 1800 * (player.achievements[45] + player.achievements[46] + 2 * player.achievements[47])
      * Math.min(player.prestigecounter, 1800)
  exponent *= Math.pow(0.965, CalcECC('reincarnation', player.challengecompletions[6]))
  exponent *= 0.001 + .999 * (Math.pow(6, -(G.rune2level * G.effectiveLevelMult) / 1000))
  exponent *= 0.01 + .99 * (Math.pow(4, Math.min(0, (400 - G.rune4level) / 1100)))
  exponent *= 1 - 0.04 * player.achievements[82] - 0.04 * player.achievements[89] - 0.04 * player.achievements[96]
    - 0.04 * player.achievements[103] - 0.04 * player.achievements[110] - 0.0566 * player.achievements[117]
    - 0.0566 * player.achievements[124] - 0.0566 * player.achievements[131]
  exponent *= Math.pow(
    0.9925,
    player.achievements[118]
      * (player.challengecompletions[6] + player.challengecompletions[7] + player.challengecompletions[8]
        + player.challengecompletions[9] + player.challengecompletions[10])
  )
  exponent *= 0.005 + 0.995 * Math.pow(0.99, player.antUpgrades[2]! + G.bonusant3)
  exponent *= 1
    / Math.pow(
      1 + Decimal.log(player.ascendShards.add(1), 10),
      1 + .2 / 60 * player.challengecompletions[10] * player.upgrades[125] + 0.1 * player.platonicUpgrades[5]
        + 0.2 * player.platonicUpgrades[10] + (G.platonicBonusMultiplier[5] - 1)
    )
  exponent *= 1 - 0.10 * (player.talismanRarity[1 - 1] - 1)
  exponent *= Math.pow(0.98, 3 / 5 * Math.log(1 + player.rareFragments) / Math.log(10) * player.researches[159])
  exponent *= Math.pow(0.966, CalcECC('ascension', player.challengecompletions[13]))
  exponent *= 1 - 0.666 * player.researches[200] / 100000
  exponent *= 1 - 0.666 * player.cubeUpgrades[50] / 100000
  exponent *= G.challenge15Rewards.taxes
  if (player.upgrades[121] > 0) {
    exponent *= 0.5
  }
  // Cap the calculation overflow bug || httpsnet
  if (exponent < 1e-300) {
    exponent = 1e-300
  }
  G.maxexponent = Math.floor(275 / (Decimal.log(1.01, 10) * exponent)) - 1
  const a2 = Math.min(G.maxexponent, Math.floor(Decimal.log(G.produceTotal.add(1), 10)))

  if (player.currentChallenge.ascension === 13 && G.maxexponent <= 99999 && player.achievements[249] < 1) {
    // i don't think it makes sense to give the achievement as soon as the challenge is opened
    // as soon as the challenge is opened you don't have enough tax reducers to have max exponent above 100000
    // so for the achievement description to make sense i think it should require at least 1 challenge completion || Dorijanko
    if (c13effcompletions >= 1) {
      achievementaward(249)
    }
  }

  if (a2 >= 1) {
    compareB = Decimal.pow(a2, 2).div(550)
  }

  compareC = Decimal.pow(G.maxexponent, 2).div(550)

  G.taxdivisor = Decimal.pow(1.01, Decimal.mul(compareB, exponent))
  G.taxdivisorcheck = Decimal.pow(1.01, Decimal.mul(compareC, exponent))
}
