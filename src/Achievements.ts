import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { CalcCorruptionStuff, calculateTimeAcceleration } from './Calculate'
import { Synergism } from './Events'
import { format, player } from './Synergism'
import { Alert, Notification, revealStuff } from './UpdateHTML'
import { sumContents } from './Utility'
import { Globals as G } from './Variables'

// dprint-ignore
export const achievementpointvalues = [
  0,
  1, 2, 4, 6, 8, 9, 10,
  1, 2, 4, 6, 8, 9, 10,
  1, 2, 4, 6, 8, 9, 10,
  1, 2, 4, 6, 8, 9, 10,
  1, 2, 4, 6, 8, 9, 10,
  1, 2, 4, 6, 8, 9, 10,
  1, 2, 4, 6, 8, 9, 10,
  1, 2, 4, 6, 8, 9, 10,
  2, 8, 10, 2, 8, 10, 10,
  2, 8, 10, 10, 10, 10, 10,
  2, 4, 6, 8, 10, 10, 10,
  1, 2, 4, 6, 8, 9, 10,
  1, 2, 4, 6, 8, 9, 10,
  1, 2, 4, 6, 8, 9, 10,
  1, 2, 4, 6, 8, 9, 10,
  1, 2, 4, 6, 8, 9, 10,
  1, 2, 4, 6, 8, 9, 10,
  1, 2, 4, 6, 8, 9, 10,
  1, 2, 4, 6, 8, 9, 10,
  1, 2, 4, 6, 8, 9, 10,
  1, 2, 4, 6, 8, 9, 10,
  1, 2, 4, 6, 8, 9, 10,
  1, 2, 4, 6, 8, 9, 10,
  1, 2, 4, 6, 8, 9, 10,
  10, 10, 10, 10, 10, 10, 10,
  10, 10, 10, 10, 10, 10, 10,
  20, 20, 20, 40, 60, 60, 100,
  20, 20, 40, 40, 60, 60, 100,
  20, 20, 40, 40, 60, 60, 100,
  20, 40, 40, 40, 60, 60, 100,
  40, 40, 40, 60, 60, 100, 100,
  40, 40, 60, 60, 100, 100, 100,
  20, 40, 40, 60, 60, 100, 100,
  40, 60, 100, 60, 100, 100, 40,
  40, 40, 40, 40, 40, 40, 40,
  40, 40, 40, 40, 100, 100, 0,
  50, 75, 75, 75, 100, 100, 150,
  50, 75, 75, 75, 100, 100, 150,
  50, 75, 75, 75, 100, 100, 150,
  10, 10, 20, 20, 30, 40, 50
]

export const totalachievementpoints = achievementpointvalues.reduce((a, b) => a + b, 0)

export const areward = (i: number): string => {
  // May 22, 2021: Allow achievement bonus values display directly in the description
  // Using areward as const object did not allow ${player object}

  // Effective score is 3rd index
  const corr = CalcCorruptionStuff()

  const extra: Record<number, string | Record<string, string>> = {
    118: format(
      Math.pow(
        0.9925,
        player.challengecompletions[6] + player.challengecompletions[7] + player.challengecompletions[8]
          + player.challengecompletions[9] + player.challengecompletions[10]
      ),
      4
    ),
    169: format(Decimal.log(player.antPoints.add(10), 10), 2),
    174: format(0.4 * Decimal.log(player.antPoints.add(1), 10), 2),
    187: {
      x: format(Math.max(1, Math.log10(corr[3] + 1) - 7), 2),
      y: format(Math.min(100, player.ascensionCount / 10000), 2)
    },
    188: format(Math.min(100, player.ascensionCount / 50000), 2),
    189: format(Math.min(200, player.ascensionCount / 2.5e6), 2),
    193: format(Decimal.log(player.ascendShards.add(1), 10) / 4, 2),
    195: format(Math.min(25000, Decimal.log(player.ascendShards.add(1), 10) / 4), 2),
    196: format(Math.min(2000, Decimal.log(player.ascendShards.add(1), 10) / 50), 2),
    202: format(Math.min(200, player.ascensionCount / 5e6), 2),
    216: format(Math.min(200, player.ascensionCount / 1e7), 2),
    223: format(Math.min(200, player.ascensionCount / 13370000), 2),
    240: format(Math.min(1.5, 1 + Math.max(2, Math.log10(calculateTimeAcceleration().mult)) / 20), 2),
    254: format(Math.min(15, Math.log10(corr[3] + 1) * 0.6), 2, true),
    255: format(Math.min(15, Math.log10(corr[3] + 1) * 0.6), 2, true),
    256: format(Math.min(15, Math.log10(corr[3] + 1) * 0.6), 2, true),
    257: format(Math.min(15, Math.log10(corr[3] + 1) * 0.6), 2, true),
    258: format(Math.min(15, Math.log10(corr[3] + 1) * 0.6), 2, true),
    262: format(Math.min(10, Math.log10(player.ascensionCount + 1)), 2),
    263: format(Math.min(10, Math.log10(player.ascensionCount + 1)), 2),
    264: format(Math.min(40, player.ascensionCount / 2e11), 2),
    265: format(Math.min(20, player.ascensionCount / 8e12), 2),
    266: format(Math.min(10, player.ascensionCount / 1e14), 2),
    267: format(Math.min(100, Decimal.log(player.ascendShards.add(1), 10) / 1000), 2),
    270: format(Math.min(100, Decimal.log(player.ascendShards.add(1), 10) / 10000), 2),
    271: format(Math.max(0, Math.min(1, (Decimal.log(player.ascendShards.add(1), 10) - 1e5) / 9e5)), 2, true)
  }

  // dprint-ignore
  const descs: number[] = [
    3, 4, 5, 6, 7, 10, 11, 12, 13, 14, 17, 18, 19,
    20, 21, 24, 25, 26, 27, 28, 31, 32, 33, 34, 35,
    36, 37, 38, 43, 44, 45, 46, 47, 50, 51, 52, 53,
    57, 58, 59, 60, 61, 62, 71, 72, 73, 74, 75, 76,
    77, 78, 79, 80, 82, 84, 85, 86, 87, 89, 91, 92,
    93, 94, 96, 98, 99, 100, 101, 102, 103, 105, 106,
    107, 108, 110, 112, 115, 117, 119, 122, 124, 126,
    127, 128, 129, 131, 132, 133, 134, 135, 136, 137,
    140, 141, 147, 171, 172, 173, 176, 177, 178, 179,
    180, 181, 182, 197, 198, 199, 200, 201, 204, 205,
    206, 207, 208, 209, 211, 212, 213, 214, 215, 218,
    219, 220, 221, 222, 250, 251, 253, 259, 260, 261
  ]

  if (descs.includes(i) || i in extra) {
    const obj = extra[i]
    const map = typeof obj === 'object' ? obj : { x: obj }

    return i18next.t(`achievements.rewards.${i}`, map)
  }

  return ''
}

export const achievementAlerts = async (num: number) => {
  if (player.highestSingularityCount === 0) {
    if (num === 36 || num === 38 || num === 255) {
      return Alert(i18next.t(`achievements.alerts.${num}`))
    }
  }
}
// ${format(Decimal.log(player.ascendShards.add(1), 10) / 1000, 2)} (log(constant)/1000)%!

// TODO: clean this up
export const resetachievementcheck = (i: number) => {
  if (i === 1) {
    if (player.prestigenoaccelerator) {
      achievementaward(60)
    }
    if (player.prestigenomultiplier) {
      achievementaward(57)
    }
    if (player.prestigenocoinupgrades) {
      achievementaward(64)
    }
    if (G.prestigePointGain.gte(1)) {
      achievementaward(36)
    }
    if (G.prestigePointGain.gte(1e6)) {
      achievementaward(37)
    }
    if (G.prestigePointGain.gte(1e100)) {
      achievementaward(38)
    }
    if (G.prestigePointGain.gte('1e1000')) {
      achievementaward(39)
    }
    if (G.prestigePointGain.gte('1e10000')) {
      achievementaward(40)
    }
    if (G.prestigePointGain.gte('1e77777')) {
      achievementaward(41)
    }
    if (G.prestigePointGain.gte('1e250000')) {
      achievementaward(42)
    }
  }
  if (i === 2) {
    if (player.transcendnoaccelerator) {
      achievementaward(61)
    }
    if (player.transcendnomultiplier) {
      achievementaward(58)
    }
    if (player.transcendnocoinupgrades) {
      achievementaward(65)
    }
    if (player.transcendnocoinorprestigeupgrades) {
      achievementaward(66)
    }
    if (G.transcendPointGain.gte(1)) {
      achievementaward(43)
    }
    if (G.transcendPointGain.gte(1e6)) {
      achievementaward(44)
    }
    if (G.transcendPointGain.gte(1e50)) {
      achievementaward(45)
    }
    if (G.transcendPointGain.gte(1e308)) {
      achievementaward(46)
    }
    if (G.transcendPointGain.gte('1e1500')) {
      achievementaward(47)
    }
    if (G.transcendPointGain.gte('1e25000')) {
      achievementaward(48)
    }
    if (G.transcendPointGain.gte('1e100000')) {
      achievementaward(49)
    }
  }
  if (i === 3) {
    if (player.reincarnatenoaccelerator) {
      achievementaward(62)
    }
    if (player.reincarnatenomultiplier) {
      achievementaward(59)
    }
    if (player.reincarnatenocoinupgrades) {
      achievementaward(67)
    }
    if (player.reincarnatenocoinorprestigeupgrades) {
      achievementaward(68)
    }
    if (player.reincarnatenocoinprestigeortranscendupgrades) {
      achievementaward(69)
    }
    if (player.reincarnatenocoinprestigetranscendorgeneratorupgrades) {
      achievementaward(70)
    }
    if (G.reincarnationPointGain.gte(1)) {
      achievementaward(50)
    }
    if (G.reincarnationPointGain.gte(1e5)) {
      achievementaward(51)
    }
    if (G.reincarnationPointGain.gte(1e30)) {
      achievementaward(52)
    }
    if (G.reincarnationPointGain.gte(1e200)) {
      achievementaward(53)
    }
    if (G.reincarnationPointGain.gte('1e1500')) {
      achievementaward(54)
    }
    if (G.reincarnationPointGain.gte('1e5000')) {
      achievementaward(55)
    }
    if (G.reincarnationPointGain.gte('1e7777')) {
      achievementaward(56)
    }
  }
}

/**
 * Array of [index, bar to get achievement if greater than, achievement number]
 */
// dprint-ignore
const challengeCompletionsBar: [number, number, number][] = [
  [1, 0.5, 78], [1, 2.5, 79], [1, 4.5, 80], [1, 9.5, 81], [1, 19.5, 82], [1, 49.5, 83], [1, 74.5, 84],
  [2, 0.5, 85], [2, 2.5, 86], [2, 4.5, 87], [2, 9.5, 88], [2, 19.5, 89], [2, 49.5, 90], [2, 74.5, 91],
  [3, 0.5, 92], [3, 2.5, 93], [3, 4.5, 94], [3, 9.5, 95], [3, 19.5, 96], [3, 49.5, 97], [3, 74.5, 98],
  [4, 0.5, 99], [4, 2.5, 100], [4, 4.5, 101], [4, 9.5, 102], [4, 19.5, 103], [4, 49.5, 104], [4, 74.5, 105],
  [5, 0.5, 106], [5, 2.5, 107], [5, 4.5, 108], [5, 9.5, 109], [5, 19.5, 110], [5, 49.5, 111], [5, 74.5, 112],
  [6, 0.5, 113], [6, 1.5, 114], [6, 2.5, 115], [6, 4.5, 116], [6, 9.5, 117], [6, 14.5, 118], [6, 24.5, 119],
  [7, 0.5, 120], [7, 1.5, 121], [7, 2.5, 122], [7, 4.5, 123], [7, 9.5, 124], [7, 14.5, 125], [7, 24.5, 126],
  [8, 0.5, 127], [8, 1.5, 128], [8, 2.5, 129], [8, 4.5, 130], [8, 9.5, 131], [8, 19.5, 132], [8, 24.5, 133],
  [9, 0.5, 134], [9, 1.5, 135], [9, 2.5, 136], [9, 4.5, 137], [9, 9.5, 138], [9, 19.5, 139], [9, 24.5, 140],
  [10, 0.5, 141], [10, 1.5, 142], [10, 2.5, 143], [10, 4.5, 144], [10, 9.5, 145], [10, 19.5, 146], [10, 24.5, 147],
  [15, 0.5, 252]
]

const challengeCompletionsNotAuto: Record<number, [string, number]> = {
  1: ['1e1000', 75],
  2: ['1e1000', 76],
  3: ['1e99999', 77],
  5: ['1e120000', 63]
}

export const challengeachievementcheck = (i: number, auto?: boolean) => {
  const generatorcheck = sumContents(player.upgrades.slice(101, 106))

  for (const [, bar, ach] of challengeCompletionsBar.filter(([o]) => o === i)) {
    if (player.challengecompletions[i] > bar && player.achievements[ach] < 1) {
      achievementaward(ach)
    }
  }

  // Challenges 1, 2, 3 check for not buying generators and getting X coins
  // Challenge 5 check for not buying Acc/Acc Boosts and getting 1.00e120,000 coins
  if ([1, 2, 3, 5].includes(i) && !auto) {
    const [gte, ach] = challengeCompletionsNotAuto[i]
    if (i === 5) {
      if (
        player.coinsThisTranscension.gte(gte) && player.acceleratorBought === 0 && player.acceleratorBoostBought === 0
      ) {
        achievementaward(ach)
      }
    } else if (player.coinsThisTranscension.gte(gte) && generatorcheck === 0) {
      achievementaward(ach)
    }
  }

  if (i >= 11 && i <= 14) {
    const challengeArray = [0, 1, 2, 3, 5, 10, 20, 30]
    for (let j = 1; j <= 7; j++) {
      if (player.challengecompletions[i] >= challengeArray[j] && player.achievements[119 + 7 * i + j] < 1) {
        achievementaward(119 + 7 * i + j)
      }
    }
  }

  if (
    player.challengecompletions[10] >= 50 && i === 11 && player.usedCorruptions[7] >= 5 && player.achievements[247] < 1
  ) {
    achievementaward(247)
  }
}

// \) \{\n\s+achievementaward\(\d+\)\n\s+\}

/**
 * Requirements for each building achievement
 * @type {(() => boolean)[]}
 */
const buildAchievementReq: (() => boolean)[] = [
  () => (player.firstOwnedCoin >= 1 && player.achievements[1] < 0.5),
  () => (player.firstOwnedCoin >= 10 && player.achievements[2] < 0.5),
  () => (player.firstOwnedCoin >= 100 && player.achievements[3] < 0.5),
  () => (player.firstOwnedCoin >= 1000 && player.achievements[4] < 0.5),
  () => (player.firstOwnedCoin >= 5000 && player.achievements[5] < 0.5),
  () => (player.firstOwnedCoin >= 10000 && player.achievements[6] < 0.5),
  () => (player.firstOwnedCoin >= 20000 && player.achievements[7] < 0.5),
  () => (player.secondOwnedCoin >= 1 && player.achievements[8] < 0.5),
  () => (player.secondOwnedCoin >= 10 && player.achievements[9] < 0.5),
  () => (player.secondOwnedCoin >= 100 && player.achievements[10] < 0.5),
  () => (player.secondOwnedCoin >= 1000 && player.achievements[11] < 0.5),
  () => (player.secondOwnedCoin >= 5000 && player.achievements[12] < 0.5),
  () => (player.secondOwnedCoin >= 10000 && player.achievements[13] < 0.5),
  () => (player.secondOwnedCoin >= 20000 && player.achievements[14] < 0.5),
  () => (player.thirdOwnedCoin >= 1 && player.achievements[15] < 0.5),
  () => (player.thirdOwnedCoin >= 10 && player.achievements[16] < 0.5),
  () => (player.thirdOwnedCoin >= 100 && player.achievements[17] < 0.5),
  () => (player.thirdOwnedCoin >= 1000 && player.achievements[18] < 0.5),
  () => (player.thirdOwnedCoin >= 5000 && player.achievements[19] < 0.5),
  () => (player.thirdOwnedCoin >= 10000 && player.achievements[20] < 0.5),
  () => (player.thirdOwnedCoin >= 20000 && player.achievements[21] < 0.5),
  () => (player.fourthOwnedCoin >= 1 && player.achievements[22] < 0.5),
  () => (player.fourthOwnedCoin >= 10 && player.achievements[23] < 0.5),
  () => (player.fourthOwnedCoin >= 100 && player.achievements[24] < 0.5),
  () => (player.fourthOwnedCoin >= 1000 && player.achievements[25] < 0.5),
  () => (player.fourthOwnedCoin >= 5000 && player.achievements[26] < 0.5),
  () => (player.fourthOwnedCoin >= 10000 && player.achievements[27] < 0.5),
  () => (player.fourthOwnedCoin >= 20000 && player.achievements[28] < 0.5),
  () => (player.fifthOwnedCoin >= 1 && player.achievements[29] < 0.5),
  () => (player.fifthOwnedCoin >= 10 && player.achievements[30] < 0.5),
  () => (player.fifthOwnedCoin >= 66 && player.achievements[31] < 0.5),
  () => (player.fifthOwnedCoin >= 666 && player.achievements[32] < 0.5),
  () => (player.fifthOwnedCoin >= 6666 && player.achievements[33] < 0.5),
  () => (player.fifthOwnedCoin >= 17777 && player.achievements[34] < 0.5),
  () => (player.fifthOwnedCoin >= 42777 && player.achievements[35] < 0.5)
]

export const buildingAchievementCheck = () => {
  for (const req of buildAchievementReq) {
    if (req()) {
      const idx = buildAchievementReq.indexOf(req) + 1
      achievementaward(idx)
    }
  }
}

export const ascensionAchievementCheck = (i: number, score = 0) => {
  if (i === 1) {
    // dprint-ignore
    const ascendCountArray = [
      0, 1, 2, 10, 100, 1000, 14142, 141421, 1414213, // Column 1
      1e7, 1e8, 2e9, 4e10, 8e11, 1.6e13, 1e14 // Column 2
    ]

    for (let j = 1; j <= 7; j++) {
      if (player.ascensionCount >= ascendCountArray[j] && player.achievements[182 + j] < 1) {
        achievementaward(182 + j)
      }
      if (player.ascensionCount >= ascendCountArray[j + 8] && player.achievements[259 + j] < 1) {
        achievementaward(259 + j)
      }
    }
    if (player.ascensionCount >= ascendCountArray[8] && player.achievements[240] < 1) {
      achievementaward(240)
    }
  }
  if (i === 2) {
    // dprint-ignore
    const constantArray = [
      0, 3.14, 1e6, 4.32e10, 6.9e21, 1.509e33, 1e66, '1.8e308', // Column 1
      '1e1000', '1e5000', '1e15000', '1e50000', '1e100000', '1e300000', '1e1000000' // Column 2
    ]

    for (let j = 1; j <= 7; j++) {
      if (player.ascendShards.gte(constantArray[j]) && player.achievements[189 + j] < 1) {
        achievementaward(189 + j)
      }
      if (player.ascendShards.gte(constantArray[j + 7]) && player.achievements[266 + j] < 1) {
        achievementaward(266 + j)
      }
    }
  }
  if (i === 3) {
    // dprint-ignore
    const scoreArray = [
      0, 1e5, 1e6, 1e7, 1e8, 1e9, 5e9, 2.5e10, // Column 1
      1e12, 1e14, 1e17, 2e18, 4e19, 1e21, 1e23 // Column 2
    ]
    for (let j = 1; j <= 7; j++) {
      if (score >= scoreArray[j] && player.achievements[224 + j] < 1) {
        achievementaward(224 + j)
      }

      if (score >= scoreArray[7 + j] && player.achievements[252 + j] < 1) {
        achievementaward(252 + j)
      }
    }
  }
}

export const getAchievementQuarks = (i: number) => {
  let multiplier = 1
  if (i >= 183) {
    multiplier = 5
  }
  if (i >= 253) {
    multiplier = 40
  }

  const globalQuarkMultiplier = player.worlds.applyBonus(1)
  let actualMultiplier = multiplier * globalQuarkMultiplier
  if (actualMultiplier > 100) {
    actualMultiplier = Math.pow(100, 0.6) * Math.pow(actualMultiplier, 0.4)
  }

  return Math.floor(achievementpointvalues[i] * actualMultiplier)
}

export const achievementdescriptions = (i: number) => {
  const y = i18next.t(`achievements.descriptions.${i}`, { number: `${i}` })
  const z = player.achievements[i] > 0.5 ? i18next.t('achievements.completed') : ''
  const k = areward(i)

  DOMCacheGetOrSet('achievementdescription').textContent = y + z
  DOMCacheGetOrSet('achievementreward').textContent = i18next.t('achievements.rewardGainMessage', {
    x: achievementpointvalues[i],
    y: format(getAchievementQuarks(i), 0, true),
    z: k
  })

  if (player.achievements[i] > 0.5) {
    DOMCacheGetOrSet('achievementdescription').style.color = 'gold'
  } else {
    DOMCacheGetOrSet('achievementdescription').style.color = 'white'
  }
}

export const achievementaward = (num: number) => {
  if (player.achievements[num] < 1) {
    if (player.toggles[34]) {
      const description = i18next.t(`achievements.descriptions.${num}`, { number: `${num}` })
      void Notification(i18next.t('achievements.notification', { m: description }))
    }

    void achievementAlerts(num)
    player.achievementPoints += achievementpointvalues[num]
    player.worlds.add(getAchievementQuarks(num), false)

    DOMCacheGetOrSet('achievementprogress').textContent = i18next.t('achievements.totalPoints', {
      x: format(player.achievementPoints),
      y: format(totalachievementpoints),
      z: (100 * player.achievementPoints / totalachievementpoints).toPrecision(4)
    })

    player.achievements[num] = 1
    revealStuff()
  }

  DOMCacheGetOrSet(`ach${num}`).style.backgroundColor = 'Green'
  Synergism.emit('achievement', num)
}
