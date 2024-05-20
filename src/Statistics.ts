import Decimal from 'break_infinity.js'
import { DOMCacheGetOrSet } from './Cache/DOM'
import {
  calculateAllCubeMultiplier,
  calculateAmbrosiaQuarkMult,
  calculateAscensionSpeedMultiplier,
  calculateCashGrabQuarkBonus,
  calculateCubeMultiplier,
  calculateEffectiveIALevel,
  calculateEventBuff,
  calculateGoldenQuarkMultiplier,
  calculateHepteractMultiplier,
  calculateHypercubeMultiplier,
  calculateOcteractMultiplier,
  calculateOfferings,
  calculatePlatonicMultiplier,
  calculatePowderConversion,
  calculateQuarkMultFromPowder,
  calculateQuarkMultiplier,
  calculateSigmoid,
  calculateSigmoidExponential,
  calculateSingularityQuarkMilestoneMultiplier,
  calculateTesseractMultiplier,
  calculateTimeAcceleration,
  calculateTotalOcteractQuarkBonus
} from './Calculate'
import { challenge15ScoreMultiplier } from './Challenges'
import { BuffType } from './Event'
import { hepteractEffective } from './Hepteracts'
import {
  addCodeAvailableUses,
  addCodeBonuses,
  addCodeInterval,
  addCodeMaxUses,
  addCodeTimeToNextUse
} from './ImportExport'
import { format, formatTimeShort, player } from './Synergism'
import type { GlobalVariables } from './types/Synergism'
import { Globals as G } from './Variables'

const associated = new Map<string, string>([
  ['kMisc', 'miscStats'],
  ['kFreeAccel', 'acceleratorStats'],
  ['kFreeMult', 'multiplierStats'],
  ['kOfferingMult', 'offeringMultiplierStats'],
  ['kGlobalCubeMult', 'globalCubeMultiplierStats'],
  ['kQuarkMult', 'globalQuarkMultiplierStats'],
  ['kGSpeedMult', 'globalSpeedMultiplierStats'],
  ['kCubeMult', 'cubeMultiplierStats'],
  ['kTessMult', 'tesseractMultiplierStats'],
  ['kHypercubeMult', 'hypercubeMultiplierStats'],
  ['kPlatMult', 'platonicMultiplierStats'],
  ['kHeptMult', 'hepteractMultiplierStats'],
  ['kOrbPowderMult', 'powderMultiplierStats'],
  ['kOctMult', 'octeractMultiplierStats'],
  ['kASCMult', 'ascensionSpeedMultiplierStats'],
  ['kGQMult', 'goldenQuarkMultiplierStats'],
  ['kAddStats', 'addCodeStats'],
  ['kAmbrosiaLuck', 'ambrosiaLuckStats'],
  ['kAmbrosiaGenMult', 'ambrosiaGenerationStats']
])

export const displayStats = (btn: HTMLElement) => {
  for (const e of Array.from(btn.parentElement!.children) as HTMLElement[]) {
    const statsEl = DOMCacheGetOrSet(associated.get(e.id)!)
    if (e.id !== btn.id) {
      e.style.backgroundColor = ''
      statsEl.style.display = 'none'
      statsEl.classList.remove('activeStats')
    } else {
      e.style.backgroundColor = 'crimson'
      statsEl.style.display = 'block'
      statsEl.classList.add('activeStats')
    }
  }
}

export const loadStatisticsUpdate = () => {
  const activeStats = document.getElementsByClassName(
    'activeStats'
  ) as HTMLCollectionOf<HTMLElement>
  for (let i = 0; i < activeStats.length; i++) {
    switch (activeStats[i].id) {
      case 'miscStats':
        loadStatisticsMiscellaneous()
        break
      case 'acceleratorStats':
        loadStatisticsAccelerator()
        break
      case 'multiplierStats':
        loadStatisticsMultiplier()
        break
      case 'offeringMultiplierStats':
        loadStatisticsOfferingMultipliers()
        break
      case 'globalQuarkMultiplierStats':
        loadQuarkMultiplier()
        break
      case 'globalSpeedMultiplierStats':
        loadGlobalSpeedMultiplier()
        break
      case 'powderMultiplierStats':
        loadPowderMultiplier()
        break
      case 'ascensionSpeedMultiplierStats':
        loadStatisticsAscensionSpeedMultipliers()
        break
      case 'goldenQuarkMultiplierStats':
        loadStatisticsGoldenQuarkMultipliers()
        break
      case 'addCodeStats':
        loadAddCodeModifiersAndEffects()
        break
      case 'ambrosiaLuckStats':
        loadStatisticsAmbrosiaLuck()
        break
      case 'ambrosiaGenerationStats':
        loadStatisticsAmbrosiaGeneration()
        break
      default:
        loadStatisticsCubeMultipliers()
        break
    }
  }
}

export const loadStatisticsMiscellaneous = () => {
  DOMCacheGetOrSet('sMisc1').textContent = format(
    player.prestigeCount,
    0,
    true
  )
  DOMCacheGetOrSet('sMisc2').textContent = `${
    format(
      1000 * player.fastestprestige
    )
  }ms`
  DOMCacheGetOrSet('sMisc3').textContent = format(player.maxofferings)
  DOMCacheGetOrSet('sMisc4').textContent = format(G.runeSum)
  DOMCacheGetOrSet('sMisc5').textContent = format(
    player.transcendCount,
    0,
    true
  )
  DOMCacheGetOrSet('sMisc6').textContent = `${
    format(
      1000 * player.fastesttranscend
    )
  }ms`
  DOMCacheGetOrSet('sMisc7').textContent = format(
    player.reincarnationCount,
    0,
    true
  )
  DOMCacheGetOrSet('sMisc8').textContent = `${
    format(
      1000 * player.fastestreincarnate
    )
  }ms`
  DOMCacheGetOrSet('sMisc9').textContent = format(player.maxobtainium)
  DOMCacheGetOrSet('sMisc10').textContent = format(
    player.maxobtainiumpersecond,
    2,
    true
  )
  DOMCacheGetOrSet('sMisc11').textContent = format(
    player.obtainiumpersecond,
    2,
    true
  )
  DOMCacheGetOrSet('sMisc12').textContent = format(
    player.ascensionCount,
    0,
    true
  )
  DOMCacheGetOrSet('sMisc13').textContent = format(
    player.quarksThisSingularity,
    0,
    true
  )
  DOMCacheGetOrSet('sMisc14').textContent = format(
    player.totalQuarksEver + player.quarksThisSingularity,
    0,
    true
  )
  DOMCacheGetOrSet('sMisc15').textContent = `${
    formatTimeShort(
      player.quarkstimer
    )
  } / ${formatTimeShort(90000 + 18000 * player.researches[195])}`
  DOMCacheGetOrSet('sMisc16').textContent = synergismStage(0)
}

export const loadStatisticsAccelerator = () => {
  DOMCacheGetOrSet('sA1').textContent = `+${
    format(
      G.freeUpgradeAccelerator,
      0,
      false
    )
  }`
  DOMCacheGetOrSet('sA2').textContent = `+${
    format(
      G.totalAcceleratorBoost
        * (4
          + 2 * player.researches[18]
          + 2 * player.researches[19]
          + 3 * player.researches[20]
          + G.cubeBonusMultiplier[1]),
      0,
      false
    )
  }`
  DOMCacheGetOrSet('sA3').textContent = `+${
    format(
      Math.floor(Math.pow((G.rune1level * G.effectiveLevelMult) / 10, 1.1)),
      0,
      true
    )
  }`
  DOMCacheGetOrSet('sA4').textContent = `x${
    format(
      1 + ((G.rune1level * 1) / 200) * G.effectiveLevelMult,
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sA5').textContent = `x${
    format(
      Math.pow(
        1.01,
        player.upgrades[21]
          + player.upgrades[22]
          + player.upgrades[23]
          + player.upgrades[24]
          + player.upgrades[25]
      ),
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sA6').textContent = `x${
    format(
      Math.pow(
        1.01,
        player.achievements[60]
          + player.achievements[61]
          + player.achievements[62]
      ),
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sA7').textContent = `x${
    format(
      1 + (1 / 5) * player.researches[1],
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sA8').textContent = `x${
    format(
      1
        + (1 / 20) * player.researches[6]
        + (1 / 25) * player.researches[7]
        + (1 / 40) * player.researches[8]
        + (3 / 200) * player.researches[9]
        + (1 / 200) * player.researches[10],
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sA9').textContent = `x${
    format(
      1 + (1 / 20) * player.researches[86],
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sA10').textContent = `x${
    format(
      (player.currentChallenge.transcension !== 0
          || player.currentChallenge.reincarnation !== 0)
        && player.upgrades[50] > 0.5
        ? 1.25
        : 1,
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sA11').textContent = `^${
    format(
      Math.min(
        1,
        (1 + player.platonicUpgrades[6] / 30)
          * G.viscosityPower[player.usedCorruptions[2]]
      ),
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sA12').textContent = format(G.freeAccelerator, 0, true)
}

export const loadStatisticsMultiplier = () => {
  DOMCacheGetOrSet('sM1').textContent = `+${
    format(
      G.freeUpgradeMultiplier,
      0,
      true
    )
  }`
  DOMCacheGetOrSet('sM2').textContent = `+${
    format(
      (Math.floor(
        (Math.floor((G.rune2level / 10) * G.effectiveLevelMult)
          * Math.floor(10 + (G.rune2level / 10) * G.effectiveLevelMult))
          / 2
      )
        * 100)
        / 100,
      0,
      true
    )
  }`
  DOMCacheGetOrSet('sM3').textContent = `x${
    format(
      1 + (G.rune2level / 200) * G.effectiveLevelMult,
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sM4').textContent = `x${
    format(
      Math.pow(
        1.01,
        player.upgrades[21]
          + player.upgrades[22]
          + player.upgrades[23]
          + player.upgrades[24]
          + player.upgrades[25]
      )
        * (1 + (player.upgrades[34] * 3) / 100)
        * (1 + player.upgrades[34] * (2 / 103)),
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sM5').textContent = `x${
    format(
      Math.pow(
        1.01,
        player.achievements[57]
          + player.achievements[58]
          + player.achievements[59]
      ),
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sM6').textContent = `x${
    format(
      1 + (1 / 5) * player.researches[2],
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sM7').textContent = `x${
    format(
      1
        + (1 / 20) * player.researches[11]
        + (1 / 25) * player.researches[12]
        + (1 / 40) * player.researches[13]
        + (3 / 200) * player.researches[14]
        + (1 / 200) * player.researches[15],
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sM8').textContent = `x${
    format(
      1 + (1 / 20) * player.researches[87],
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sM9').textContent = `x${
    format(
      calculateSigmoidExponential(
        40,
        (((player.antUpgrades[4]! + G.bonusant5) / 1000) * 40) / 39
      ),
      2,
      true
    )
  }`
  DOMCacheGetOrSet('sM10').textContent = `x${
    format(
      G.cubeBonusMultiplier[2],
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sM11').textContent = `x${
    format(
      (player.currentChallenge.transcension !== 0
          || player.currentChallenge.reincarnation !== 0)
        && player.upgrades[50] > 0.5
        ? 1.25
        : 1,
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sM12').textContent = `^${
    format(
      Math.min(
        1,
        (1 + player.platonicUpgrades[6] / 30)
          * G.viscosityPower[player.usedCorruptions[2]]
      ),
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sM13').textContent = format(G.freeMultiplier, 3, true)
}
export const loadQuarkMultiplier = () => {
  DOMCacheGetOrSet('sGQM1').textContent = `x${format(1, 3, true)}` // Base
  DOMCacheGetOrSet('sGQM2').textContent = `+${
    format(
      player.achievementPoints / 25000,
      3,
      true
    )
  }` // AP
  DOMCacheGetOrSet('sGQM3').textContent = `+${
    format(
      player.achievements[250] > 0 ? 0.1 : 0,
      3,
      true
    )
  }` // Max r8x25
  DOMCacheGetOrSet('sGQM4').textContent = `+${
    format(
      player.achievements[251] > 0 ? 0.1 : 0,
      3,
      true
    )
  }` // Max w5x10
  DOMCacheGetOrSet('sGQM5').textContent = `+${
    format(
      player.platonicUpgrades[5] > 0 ? 0.2 : 0,
      3,
      true
    )
  }` // ALPHA
  DOMCacheGetOrSet('sGQM6').textContent = `+${
    format(
      player.platonicUpgrades[10] > 0 ? 0.25 : 0,
      3,
      true
    )
  }` // BETA
  DOMCacheGetOrSet('sGQM7').textContent = `+${
    format(
      player.platonicUpgrades[15] > 0 ? 0.3 : 0,
      3,
      true
    )
  }` // OMEGA
  DOMCacheGetOrSet('sGQM8').textContent = `+${
    format(
      G.challenge15Rewards.quarks - 1,
      3,
      true
    )
  }` // Challenge 15 Reward
  DOMCacheGetOrSet('sGQM9').textContent = `x${
    format(
      player.worlds.applyBonus(1 / calculateQuarkMultiplier()),
      3,
      true
    )
  }` // Patreon Bonus
  DOMCacheGetOrSet('sGQM10').textContent = `x${
    format(
      G.isEvent
        ? 1
          + calculateEventBuff(BuffType.Quark)
          + calculateEventBuff(BuffType.OneMind)
        : 1,
      3,
      true
    )
  }` // Event
  DOMCacheGetOrSet('sGQM11').textContent = `x${
    format(
      1.1 + (0.15 / 75) * calculateEffectiveIALevel(),
      3,
      true
    )
  }` // IA Rune
  DOMCacheGetOrSet('sGQM12').textContent = `x${
    format(
      player.challenge15Exponent >= 1e15
        ? 1 + (5 / 10000) * hepteractEffective('quark')
        : 1,
      3,
      true
    )
  }` // Quark Hepteract
  DOMCacheGetOrSet('sGQM13').textContent = `x${
    format(
      calculateQuarkMultFromPowder(),
      3,
      true
    )
  }` // Powder
  DOMCacheGetOrSet('sGQM14').textContent = `x${
    format(
      1 + player.achievements[266] * Math.min(0.1, player.ascensionCount / 1e16),
      3,
      true
    )
  }` // Achievement 266 [Max: 10% at 1Qa Ascensions]
  DOMCacheGetOrSet('sGQM15').textContent = `x${
    format(
      1 + player.singularityCount / 10,
      3,
      true
    )
  }` // Singularity
  DOMCacheGetOrSet('sGQM16').textContent = `x${
    format(
      calculateSingularityQuarkMilestoneMultiplier(),
      3,
      true
    )
  }` // Singularity Milestones
  DOMCacheGetOrSet('sGQM17').textContent = `x${
    format(
      1 + (0.1 * player.cubeUpgrades[53]) / 100,
      3,
      true
    )
  }` // Cube Upgrade 6x3 (Cx3)
  DOMCacheGetOrSet('sGQM18').textContent = `x${
    format(
      1
        + (1 / 10000) * player.cubeUpgrades[68]
        + 0.05 * Math.floor(player.cubeUpgrades[68] / 1000),
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sGQM19').textContent = `x${
    format(
      1
        + 0.02 * player.singularityUpgrades.intermediatePack.level // 1.02
        + 0.04 * player.singularityUpgrades.advancedPack.level // 1.06
        + 0.06 * player.singularityUpgrades.expertPack.level // 1.12
        + 0.08 * player.singularityUpgrades.masterPack.level // 1.20
        + 0.1 * player.singularityUpgrades.divinePack.level,
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sGQM20').textContent = `x${
    format(
      1 + 0.25 * +player.octeractUpgrades.octeractStarter.getEffect().bonus,
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sGQM21').textContent = `x${
    format(
      +player.octeractUpgrades.octeractQuarkGain.getEffect().bonus,
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sGQM22').textContent = `x${
    format(
      calculateTotalOcteractQuarkBonus(),
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sGQM23').textContent = `x${
    format(
      1 + +player.singularityUpgrades.singQuarkImprover1.getEffect().bonus,
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sGQM24').textContent = `x${
    format(
      1
        + (1 / 10000)
          * Math.floor(player.octeractUpgrades.octeractQuarkGain.level / 199)
          * player.octeractUpgrades.octeractQuarkGain2.level
          * Math.floor(
            1 + Math.log10(Math.max(1, player.hepteractCrafts.quark.BAL))
          ),
      3,
      true
    )
  }`
  DOMCacheGetOrSet('sGQM25').textContent = `x${
    format(
      calculateAmbrosiaQuarkMult(),
      2,
      true
    )
  }`
  DOMCacheGetOrSet('sGQM26').textContent = `x${
    format(
      +player.blueberryUpgrades.ambrosiaTutorial.bonus.quarks,
      2,
      true
    )
  }`
  DOMCacheGetOrSet('sGQM27').textContent = `x${
    format(
      +player.blueberryUpgrades.ambrosiaQuarks1.bonus.quarks,
      2,
      true
    )
  }`
  DOMCacheGetOrSet('sGQM28').textContent = `x${
    format(
      +player.blueberryUpgrades.ambrosiaCubeQuark1.bonus.quarks,
      2,
      true
    )
  }`
  DOMCacheGetOrSet('sGQM29').textContent = `x${
    format(
      +player.blueberryUpgrades.ambrosiaLuckQuark1.bonus.quarks,
      2,
      true
    )
  }`
  DOMCacheGetOrSet('sGQM30').textContent = `x${
    format(
      +player.blueberryUpgrades.ambrosiaQuarks2.bonus.quarks,
      2,
      true
    )
  }`
  DOMCacheGetOrSet('sGQM31').textContent = `x${format(calculateCashGrabQuarkBonus(), 3, true)}`
  DOMCacheGetOrSet('sGQMT').textContent = `x${
    format(
      player.worlds.applyBonus(1),
      3,
      true
    )
  }`
}

export const loadGlobalSpeedMultiplier = () => {
  const globalSpeedStats = calculateTimeAcceleration()

  const preDRlist = globalSpeedStats.preList
  for (let i = 0; i < preDRlist.length; i++) {
    DOMCacheGetOrSet(`sGSMa${i + 1}`).textContent = `x${
      format(
        preDRlist[i],
        3,
        true
      )
    }`
  }

  const drList = globalSpeedStats.drList
  for (let i = 0; i < drList.length; i++) {
    DOMCacheGetOrSet(`sGSMb${i + 1}`).textContent = `x${
      format(
        drList[i],
        3,
        true
      )
    }`
  }

  const postDRlist = globalSpeedStats.postList
  for (let i = 0; i < postDRlist.length; i++) {
    DOMCacheGetOrSet(`sGSMc${i + 1}`).textContent = `x${
      format(
        postDRlist[i],
        3,
        true
      )
    }`
  }

  DOMCacheGetOrSet('sGSMT').textContent = format(globalSpeedStats.mult, 3)
}

export const loadStatisticsCubeMultipliers = () => {
  const arr0 = calculateAllCubeMultiplier().list
  const map0: Record<number, { acc: number; desc: string }> = {
    1: { acc: 2, desc: 'Ascension Time Multiplier:' },
    2: { acc: 2, desc: 'Sun and Moon Achievements:' },
    3: { acc: 2, desc: 'Speed Achievement:' },
    4: { acc: 2, desc: 'Challenge 15 All Cube Bonus:' },
    5: { acc: 2, desc: 'Rune 6 - Infinite Ascent:' },
    6: { acc: 2, desc: 'Platonic Beta:' },
    7: { acc: 2, desc: 'Platonic Omega:' },
    8: { acc: 2, desc: 'Overflux Powder:' },
    9: { acc: 2, desc: 'Event:' },
    10: { acc: 2, desc: 'Singularity Factor:' },
    11: { acc: 2, desc: 'Wow Pass Y' },
    12: { acc: 2, desc: 'Starter Pack:' },
    13: { acc: 2, desc: 'Cube Flame [GQ]:' },
    14: { acc: 2, desc: 'Cube Blaze [GQ]:' },
    15: { acc: 2, desc: 'Cube Inferno [GQ]:' },
    16: { acc: 2, desc: 'Wow Pass Z:' },
    17: { acc: 2, desc: 'Cookie Upgrade 16:' },
    18: { acc: 2, desc: 'Cookie Upgrade 8:' },
    19: { acc: 2, desc: 'Total Octeract Bonus:' },
    20: { acc: 2, desc: 'No Singularity Upgrades Challenge:' },
    21: { acc: 2, desc: 'Citadel [GQ]' },
    22: { acc: 2, desc: 'Citadel 2 [GQ]' },
    23: { acc: 4, desc: 'Platonic DELTA' },
    24: { acc: 2, desc: 'Wow Pass ∞' },
    25: { acc: 2, desc: 'Unspent Ambrosia Bonus' },
    26: { acc: 2, desc: 'Module- Tutorial' },
    27: { acc: 2, desc: 'Module- Cubes 1' },
    28: { acc: 2, desc: 'Module- Luck-Cube 1' },
    29: { acc: 2, desc: 'Module- Quark-Cube 1' },
    30: { acc: 2, desc: 'Module- Cubes 2' },
    31: { acc: 2, desc: 'Module- Hyperflux' },
    32: { acc: 2, desc: '20 Ascensions X20 Bonus [EXALT ONLY]'},
    33: { acc: 2, desc: 'Cash Grab ULTIMATE'},
    34: { acc: 2, desc: 'Shop EX ULTIMATE'},
  }
  for (let i = 0; i < arr0.length; i++) {
    const statGCMi = DOMCacheGetOrSet(`statGCM${i + 1}`)
    statGCMi.childNodes[0].textContent = map0[i + 1].desc
    DOMCacheGetOrSet(`sGCM${i + 1}`).textContent = `x${
      format(
        arr0[i],
        map0[i + 1].acc,
        true
      )
    }`
  }

  DOMCacheGetOrSet('sGCMT').textContent = `x${
    format(
      calculateAllCubeMultiplier().mult,
      3
    )
  }`

  const arr = calculateCubeMultiplier().list
  const map: Record<number, { acc: number; desc: string }> = {
    1: { acc: 2, desc: 'Ascension Score Multiplier:' },
    2: { acc: 2, desc: 'Global Cube Multiplier:' },
    3: { acc: 2, desc: 'Season Pass 1:' },
    4: { acc: 2, desc: 'Researches (Except 8x25):' },
    5: { acc: 2, desc: 'Research 8x25:' },
    6: { acc: 2, desc: 'Cube Upgrades:' },
    7: { acc: 2, desc: 'Constant Upgrade 10:' },
    8: { acc: 2, desc: 'Achievement 189 Bonus:' },
    9: { acc: 2, desc: 'Achievement 193 Bonus:' },
    10: { acc: 2, desc: 'Achievement 195 Bonus:' },
    11: { acc: 2, desc: 'Achievement 198-201 Bonus:' },
    12: { acc: 2, desc: 'Achievement 254 Bonus:' },
    13: { acc: 2, desc: 'Spirit Power:' },
    14: { acc: 2, desc: 'Platonic Cubes:' },
    15: { acc: 2, desc: 'Platonic 1x1:' },
    16: { acc: 2, desc: 'Cookie Upgrade 13:' }
  }
  for (let i = 0; i < arr.length; i++) {
    const statCMi = DOMCacheGetOrSet(`statCM${i + 1}`)
    statCMi.childNodes[0].textContent = map[i + 1].desc
    DOMCacheGetOrSet(`sCM${i + 1}`).textContent = `x${
      format(
        arr[i],
        map[i + 1].acc,
        true
      )
    }`
  }
  // PLAT
  DOMCacheGetOrSet('sCMT').textContent = `x${
    format(
      calculateCubeMultiplier().mult,
      3
    )
  }`

  const arr2 = calculateTesseractMultiplier().list
  const map2: Record<number, { acc: number; desc: string }> = {
    1: { acc: 2, desc: 'Ascension Score Multiplier:' },
    2: { acc: 2, desc: 'Global Cube Multiplier:' },
    3: { acc: 2, desc: 'Season Pass 1:' },
    4: { acc: 2, desc: 'Constant Upgrade 10:' },
    5: { acc: 2, desc: 'Cube Upgrade 3x10:' },
    6: { acc: 2, desc: 'Cube Upgrade 4x8:' },
    7: { acc: 2, desc: 'Achievement 195 Bonus:' },
    8: { acc: 2, desc: 'Achievement 202 Bonus:' },
    9: { acc: 2, desc: 'Achievement 205-208 Bonus:' },
    10: { acc: 2, desc: 'Achievement 255 Bonus:' },
    11: { acc: 2, desc: 'Platonic Cubes:' },
    12: { acc: 2, desc: 'Platonic 1x2:' }
  }
  for (let i = 0; i < arr2.length; i++) {
    const statTeMi = DOMCacheGetOrSet(`statTeM${i + 1}`)
    statTeMi.childNodes[0].textContent = map2[i + 1].desc
    DOMCacheGetOrSet(`sTeM${i + 1}`).textContent = `x${
      format(
        arr2[i],
        map2[i + 1].acc,
        true
      )
    }`
  }

  DOMCacheGetOrSet('sTeMT').textContent = `x${
    format(
      calculateTesseractMultiplier().mult,
      3
    )
  }`

  const arr3 = calculateHypercubeMultiplier().list
  const map3: Record<number, { acc: number; desc: string }> = {
    1: { acc: 2, desc: 'Ascension Score Multiplier:' },
    2: { acc: 2, desc: 'Global Cube Multiplier:' },
    3: { acc: 2, desc: 'Season Pass 2:' },
    4: { acc: 2, desc: 'Achievement 212-215 Bonus:' },
    5: { acc: 2, desc: 'Achievement 216 Bonus:' },
    6: { acc: 2, desc: 'Achievement 253 Bonus:' },
    7: { acc: 2, desc: 'Achievement 256 Bonus:' },
    8: { acc: 2, desc: 'Achievement 265 Bonus:' },
    9: { acc: 2, desc: 'Platonic Cubes:' },
    10: { acc: 2, desc: 'Platonic 1x3:' },
    11: { acc: 2, desc: 'Hyperreal Hepteract Bonus:' }
  }
  for (let i = 0; i < arr3.length; i++) {
    const statHyMi = DOMCacheGetOrSet(`statHyM${i + 1}`)
    statHyMi.childNodes[0].textContent = map3[i + 1].desc
    DOMCacheGetOrSet(`sHyM${i + 1}`).textContent = `x${
      format(
        arr3[i],
        map3[i + 1].acc,
        true
      )
    }`
  }

  DOMCacheGetOrSet('sHyMT').textContent = `x${
    format(
      calculateHypercubeMultiplier().mult,
      3
    )
  }`

  const arr4 = calculatePlatonicMultiplier().list
  const map4: Record<number, { acc: number; desc: string }> = {
    1: { acc: 2, desc: 'Ascension Score Multiplier:' },
    2: { acc: 2, desc: 'Global Cube Multiplier:' },
    3: { acc: 2, desc: 'Season Pass 2:' },
    4: { acc: 2, desc: 'Achievement 196 Bonus:' },
    5: { acc: 2, desc: 'Achievement 219-222 Bonus:' },
    6: { acc: 2, desc: 'Achievement 223 Bonus:' },
    7: { acc: 2, desc: 'Achievement 257 Bonus:' },
    8: { acc: 2, desc: 'Platonic Cubes:' },
    9: { acc: 2, desc: 'Platonic 1x4:' }
  }
  for (let i = 0; i < arr4.length; i++) {
    const statPlMi = DOMCacheGetOrSet(`statPlM${i + 1}`)
    statPlMi.childNodes[0].textContent = map4[i + 1].desc
    DOMCacheGetOrSet(`sPlM${i + 1}`).textContent = `x${
      format(
        arr4[i],
        map4[i + 1].acc,
        true
      )
    }`
  }

  DOMCacheGetOrSet('sPlMT').textContent = `x${
    format(
      calculatePlatonicMultiplier().mult,
      3
    )
  }`

  const arr5 = calculateHepteractMultiplier().list
  const map5: Record<number, { acc: number; desc: string }> = {
    1: { acc: 2, desc: 'Ascension Score Multiplier:' },
    2: { acc: 2, desc: 'Global Cube Multiplier:' },
    3: { acc: 2, desc: 'Season Pass 3:' },
    4: { acc: 2, desc: 'Achievement 258 Bonus:' },
    5: { acc: 2, desc: 'Achievement 264 Bonus:' },
    6: { acc: 2, desc: 'Achievement 265 Bonus:' },
    7: { acc: 2, desc: 'Achievement 270 Bonus:' }
  }
  for (let i = 0; i < arr5.length; i++) {
    const statHeMi = DOMCacheGetOrSet(`statHeM${i + 1}`)
    statHeMi.childNodes[0].textContent = map5[i + 1].desc
    DOMCacheGetOrSet(`sHeM${i + 1}`).textContent = `x${
      format(
        arr5[i],
        map5[i + 1].acc,
        true
      )
    }`
  }

  DOMCacheGetOrSet('sHeMT').textContent = `x${
    format(
      calculateHepteractMultiplier().mult,
      3
    )
  }`

  const octMults = calculateOcteractMultiplier()
  const ascensionSpeedDesc = player.singularityUpgrades.oneMind.getEffect()
      .bonus
    ? 'One Mind Multiplier'
    : 'Ascension Speed Multiplier'
  const map6: Record<number, { acc: number; desc: string }> = {
    1: { acc: 2, desc: 'Ascension Score Multiplier:' },
    2: { acc: 2, desc: 'Season Pass 3:' },
    3: { acc: 2, desc: 'Season Pass Y:' },
    4: { acc: 2, desc: 'Season Pass Z:' },
    5: { acc: 2, desc: 'Season Pass Lost:' },
    6: { acc: 2, desc: 'Cookie Upgrade 20:' },
    7: { acc: 2, desc: 'Divine Pack:' },
    8: { acc: 2, desc: 'Cube Flame:' },
    9: { acc: 2, desc: 'Cube Blaze:' },
    10: { acc: 2, desc: 'Cube Inferno:' },
    11: { acc: 2, desc: 'Octeract Absinthe' },
    12: { acc: 2, desc: 'Pieces of Eight' },
    13: { acc: 2, desc: 'Obelisk Shaped Like an Octagon' },
    14: { acc: 2, desc: 'Octahedral Synthesis' },
    15: { acc: 2, desc: 'Eighth Wonder of the World' },
    16: { acc: 2, desc: 'Platonic is a fat sellout' },
    17: { acc: 2, desc: 'Octeracts for Dummies' },
    18: { acc: 2, desc: 'Octeract Cogenesis' },
    19: { acc: 2, desc: 'Octeract Trigenesis' },
    20: { acc: 2, desc: 'Singularity Factor' },
    21: { acc: 2, desc: 'Digital Octeract Accumulator' },
    22: { acc: 2, desc: 'Event Buff' },
    23: { acc: 2, desc: 'Platonic DELTA' },
    24: { acc: 2, desc: 'No Singularity Upgrades Challenge' },
    25: { acc: 2, desc: 'Wow Pass ∞' },
    26: { acc: 2, desc: 'Unspent Ambrosia Bonus' },
    27: { acc: 2, desc: 'Module- Tutorial' },
    28: { acc: 2, desc: 'Module- Cubes 1' },
    29: { acc: 2, desc: 'Module- Luck-Cube 1' },
    30: { acc: 2, desc: 'Module- Quark-Cube 1' },
    31: { acc: 2, desc: 'Module- Cubes 2' },
    32: { acc: 2, desc: 'Cash Grab ULTIMATE'},
    33: { acc: 2, desc: 'Shop EX ULTIMATE'},
    34: { acc: 2, desc: ascensionSpeedDesc }
  }
  for (let i = 0; i < octMults.list.length; i++) {
    const statOcMi = DOMCacheGetOrSet(`statOcM${i + 1}`)
    statOcMi.childNodes[0].textContent = map6[i + 1].desc
    DOMCacheGetOrSet(`sOcM${i + 1}`).textContent = `x${
      format(
        octMults.list[i],
        map6[i + 1].acc,
        true
      )
    }`
  }

  DOMCacheGetOrSet('sOcMT').textContent = `x${format(octMults.mult, 3)}`
}

export const loadStatisticsOfferingMultipliers = () => {
  const arr = calculateOfferings('prestige', false)
  const map: Record<number, { acc: number; desc: string }> = {
    1: { acc: 3, desc: 'Alchemy Achievement 5:' },
    2: { acc: 3, desc: 'Alchemy Achievement 6:' },
    3: { acc: 3, desc: 'Alchemy Achievement 7:' },
    4: { acc: 3, desc: 'Diamond Upgrade 4x3:' },
    5: { acc: 3, desc: 'Particle Upgrade 3x5:' },
    6: { acc: 3, desc: 'Auto Offering Shop Upgrade:' },
    7: { acc: 3, desc: 'Offering EX Shop Upgrade:' },
    8: { acc: 3, desc: 'Cash Grab Shop Upgrade:' },
    9: { acc: 3, desc: 'Research 4x10:' },
    10: { acc: 3, desc: 'Sacrificium Formicidae:' },
    11: { acc: 3, desc: 'Plutus Cube Tribute:' },
    12: { acc: 3, desc: 'Constant Upgrade 3:' },
    13: { acc: 3, desc: 'Research 6x24,8x4:' },
    14: { acc: 3, desc: 'Challenge 12:' },
    15: { acc: 3, desc: 'Research 8x25:' },
    16: { acc: 3, desc: 'Ascension Count Achievement:' },
    17: { acc: 3, desc: 'Sun and Moon Achievements:' },
    18: { acc: 3, desc: 'Cube Upgrade 5x6:' },
    19: { acc: 3, desc: 'Cube Upgrade 5x10:' },
    20: { acc: 3, desc: 'Platonic ALPHA:' },
    21: { acc: 3, desc: 'Platonic BETA:' },
    22: { acc: 3, desc: 'Platonic OMEGA:' },
    23: { acc: 3, desc: 'Challenge 15:' },
    24: { acc: 3, desc: 'Starter Pack:' },
    25: { acc: 3, desc: 'Offering Charge [GQ]:' },
    26: { acc: 3, desc: 'Offering Storm [GQ]:' },
    27: { acc: 3, desc: 'Offering Tempest [GQ]:' },
    28: { acc: 3, desc: 'Citadel [GQ]' },
    29: { acc: 3, desc: 'Citadel 2 [GQ]' },
    30: { acc: 3, desc: 'Cube Upgrade Cx4:' },
    31: { acc: 3, desc: 'Offering Electrolosis [OC]:' },
    32: { acc: 3, desc: 'RNG-based Offering Booster:' },
    33: { acc: 3, desc: '20 Ascensions X20 [EXALT ONLY]' },
    34: { acc: 3, desc: 'Shop EX ULTIMATE' },
    35: { acc: 3, desc: 'Event:' }
  }
  for (let i = 0; i < arr.length; i++) {
    const statOffi = DOMCacheGetOrSet(`statOff${i + 1}`)
    statOffi.childNodes[0].textContent = map[i + 1].desc
    DOMCacheGetOrSet(`sOff${i + 1}`).textContent = `x${
      format(
        arr[i],
        map[i + 1].acc,
        true
      )
    }`
  }
  DOMCacheGetOrSet('sOffT').textContent = `x${
    format(
      calculateOfferings('prestige', true, true),
      3
    )
  }`
}

export const loadPowderMultiplier = () => {
  const arr0 = calculatePowderConversion().list
  const map0: Record<number, { acc: number; desc: string }> = {
    1: { acc: 2, desc: 'Base:' },
    2: { acc: 2, desc: 'Challenge 15 Bonus:' },
    3: { acc: 2, desc: 'Powder EX:' },
    4: { acc: 2, desc: 'Achievement 256:' },
    5: { acc: 2, desc: 'Achievement 257:' },
    6: { acc: 2, desc: 'Platonic Upgrade 16 [4x1]:' },
    7: { acc: 2, desc: 'Event:' }
  }
  for (let i = 0; i < arr0.length; i++) {
    const statGCMi = DOMCacheGetOrSet(`statPoM${i + 1}`)
    statGCMi.childNodes[0].textContent = map0[i + 1].desc
    DOMCacheGetOrSet(`sPoM${i + 1}`).textContent = `x${
      format(
        arr0[i],
        map0[i + 1].acc,
        true
      )
    }`
  }

  DOMCacheGetOrSet('sPoMT').textContent = `x${
    format(
      calculatePowderConversion().mult,
      3
    )
  }`
}

export const loadStatisticsAscensionSpeedMultipliers = () => {
  const arr = calculateAscensionSpeedMultiplier()
  const map7: Record<number, { acc: number; desc: string }> = {
    1: { acc: 2, desc: 'Chronometer:' },
    2: { acc: 2, desc: 'Chronometer 2:' },
    3: { acc: 2, desc: 'Chronometer 3:' },
    4: { acc: 2, desc: 'Chronos Hepteract:' },
    5: { acc: 2, desc: 'Achievement 262 Bonus:' },
    6: { acc: 2, desc: 'Achievement 263 Bonus:' },
    7: { acc: 2, desc: 'Platonic Omega:' },
    8: { acc: 2, desc: 'Challenge 15 Reward:' },
    9: { acc: 2, desc: 'Cookie Upgrade 9:' },
    10: { acc: 2, desc: 'Intermediate Pack:' },
    11: { acc: 2, desc: 'Chronometer Z:' },
    12: { acc: 2, desc: 'Abstract Photokinetics:' },
    13: { acc: 2, desc: 'Abstract Exokinetics:' },
    14: { acc: 2, desc: 'Event:' },
    15: { acc: 2, desc: 'Ascension Speedup 2 [GQ]:' },
    16: { acc: 2, desc: 'Chronometer INF:' },
    17: { acc: 2, desc: 'Limited Ascensions Penalty:' },
    18: { acc: 2, desc: 'Limited Ascensions Reward:' },
    19: { acc: 2, desc: 'Ascension Speedup [GQ]:' },
    20: { acc: 2, desc: 'Singularity Penalty:' }
  }
  for (let i = 0; i < arr.list.length; i++) {
    const statASMi = DOMCacheGetOrSet(`statASM${i + 1}`)
    statASMi.childNodes[0].textContent = map7[i + 1].desc
    DOMCacheGetOrSet(`sASM${i + 1}`).textContent = `x${
      format(
        arr.list[i],
        map7[i + 1].acc,
        true
      )
    }`
  }

  DOMCacheGetOrSet('sASMT').textContent = `x${format(arr.mult, 3)}`
}

export const loadStatisticsGoldenQuarkMultipliers = () => {
  const arr = calculateGoldenQuarkMultiplier()
  const map: Record<number, { acc: number; desc: string }> = {
    1: { acc: 2, desc: 'Challenge 15 Exponent:' },
    2: { acc: 2, desc: 'Patreon Bonus:' },
    3: { acc: 2, desc: 'Golden Quarks I:' },
    4: { acc: 2, desc: 'Cookie Upgrade 19:' },
    5: { acc: 2, desc: 'No Singularity Upgrades:' },
    6: { acc: 2, desc: 'Event:' },
    7: { acc: 2, desc: 'Singularity Fast Forwards:' },
    8: { acc: 2, desc: 'Golden Revolution II:' },
    9: { acc: 2, desc: 'Immaculate Alchemy:' },
    10: { acc: 2, desc: 'Total Quarks Coefficient:' }
  }
  for (let i = 0; i < arr.list.length; i++) {
    const statGQMi = DOMCacheGetOrSet(`statGQMS${i + 1}`)
    statGQMi.childNodes[0].textContent = map[i + 1].desc
    DOMCacheGetOrSet(`sGQMS${i + 1}`).textContent = `x${
      format(
        arr.list[i],
        map[i + 1].acc,
        true
      )
    }`
  }

  DOMCacheGetOrSet('sGQMST').textContent = `x${format(arr.mult, 3)}`
}

export const loadAddCodeModifiersAndEffects = () => {
  const intervalStats = addCodeInterval()
  const capacityStats = addCodeMaxUses()
  const availableCount = addCodeAvailableUses()
  const timeToNext = addCodeTimeToNextUse()

  // Add interval stats
  const intervalMap: Record<number, { acc: number; desc: string }> = {
    1: { acc: 0, desc: 'Base:' },
    2: { acc: 2, desc: 'PL-AT δ calculator:' },
    3: { acc: 2, desc: 'PL-AT Σ sing perk:' },
    4: { acc: 2, desc: 'Ascension of Ant God:' },
    5: { acc: 2, desc: 'Singularity factor:' }
  }
  intervalStats.list[0] /= 1000 // is originally in milliseconds, but players will expect it in seconds.

  for (let i = 0; i < intervalStats.list.length; i++) {
    const statAddIntervalI = DOMCacheGetOrSet(`stat+time${i + 1}`)
    statAddIntervalI.childNodes[0].textContent = intervalMap[i + 1].desc
    if (i === 0) {
      DOMCacheGetOrSet(`s+time${i + 1}`).textContent = `${
        format(
          intervalStats.list[i],
          intervalMap[i + 1].acc,
          true
        )
      } sec`
    } else {
      DOMCacheGetOrSet(`s+time${i + 1}`).textContent = `x${
        format(
          intervalStats.list[i],
          intervalMap[i + 1].acc,
          true
        )
      }`
    }
  }

  DOMCacheGetOrSet('s+timeT').textContent = `${
    format(
      intervalStats.time / 1000,
      1
    )
  } sec`
  if (availableCount !== capacityStats.total) {
    DOMCacheGetOrSet('s+next').textContent = `+1 in ${
      format(
        timeToNext,
        1
      )
    } sec` // is already in sec.
  } else {
    DOMCacheGetOrSet('s+next').textContent = ''
  }

  // Add capacity stats
  const capacityMap: Record<number, { acc: number; desc: string }> = {
    1: { acc: 0, desc: 'Base:' },
    2: { acc: 0, desc: 'PL-AT X:' },
    3: { acc: 0, desc: 'PL-AT δ:' },
    4: { acc: 0, desc: 'PL-AT Γ:' },
    5: { acc: 0, desc: 'PL-AT _:' },
    6: { acc: 0, desc: 'PL-AT ΩΩ' },
    7: { acc: 3, desc: 'Singularity factor:' }
  }

  for (let i = 0; i < capacityStats.list.length; i++) {
    const statAddIntervalI = DOMCacheGetOrSet(`stat+cap${i + 1}`)
    statAddIntervalI.childNodes[0].textContent = capacityMap[i + 1].desc
    const prefix = i === 0 ? '' : i === 5 ? 'x' : '+'
    DOMCacheGetOrSet(`s+cap${i + 1}`).textContent = `${prefix}${
      format(
        capacityStats.list[i],
        capacityMap[i + 1].acc,
        true
      )
    }`
  }

  DOMCacheGetOrSet('s+capT').textContent = `${
    format(
      availableCount,
      0
    )
  } / ${format(capacityStats.total, 0)}`

  // TODO:  we also want to report on the effects of each add.
  const addEffectStats = addCodeBonuses()

  // Quark Bonus Rate; the bonus is typically applied when actually given to the player, rather than calculated before.
  const qbr = player.worlds.applyBonus(1)

  DOMCacheGetOrSet('stat+eff1').childNodes[0].textContent = 'Quarks: '
  if (Math.abs(addEffectStats.maxQuarks - addEffectStats.minQuarks) >= 0.5) {
    // b/c floating-point errors
    DOMCacheGetOrSet('s+eff1').textContent = `+${
      format(
        qbr * addEffectStats.minQuarks,
        3
      )
    } ~ ${format(qbr * addEffectStats.maxQuarks, 3)}`
  } else {
    DOMCacheGetOrSet('s+eff1').textContent = `+${
      format(
        qbr * addEffectStats.quarks,
        3
      )
    }`
  }

  DOMCacheGetOrSet('stat+eff2').childNodes[0].textContent = 'PL-AT X - bonus ascension time: '
  DOMCacheGetOrSet('s+eff2').textContent = `+${
    format(
      addEffectStats.ascensionTimer,
      2
    )
  } sec`

  DOMCacheGetOrSet('stat+eff3').childNodes[0].textContent = 'PL-AT Γ - bonus GQ export time: '
  DOMCacheGetOrSet('s+eff3').textContent = `+${
    format(
      addEffectStats.gqTimer,
      2
    )
  } sec` // does it need a / 1000?

  DOMCacheGetOrSet('stat+eff4').childNodes[0].textContent = 'PL-AT _ - bonus octeract time: '
  DOMCacheGetOrSet('s+eff4').textContent = `+${
    format(
      addEffectStats.octeractTime,
      2
    )
  } sec` // does it need a / 1000?
  // Might be worth converting to raw octeracts awarded.  I don't have the calculator needed to test it, though.
}

export const loadStatisticsAmbrosiaLuck = () => {
  const arr = player.caches.ambrosiaLuck.flatten()
  const map: Record<number, { acc: number; desc: string }> = {
    1: { acc: 0, desc: 'Base Value'},
    2: { acc: 0, desc: 'Irish Ants Singularity Perk' },
    3: { acc: 1, desc: 'Shop Upgrade Bonus' },
    4: { acc: 0, desc: 'Singularity Ambrosia Luck Upgrades' },
    5: { acc: 0, desc: 'Octeract Ambrosia Luck Upgrades' },
    6: { acc: 0, desc: 'Ambrosia Luck Module I' },
    7: { acc: 1, desc: 'Ambrosia Luck Module II' },
    8: { acc: 2, desc: 'Ambrosia Cube-Luck Hybrid Module I' },
    9: { acc: 2, desc: 'Ambrosia Quark-Luck Hybrid Module I' },
    10: { acc: 0, desc: 'Perk: One Hundred Thirty One!' },
    11: { acc: 0, desc: 'Perk: Two Hundred Sixty Nine!' },
    12: { acc: 0, desc: 'Shop: Octeract-Based Ambrosia Luck' },
    13: { acc: 0, desc: 'No Ambrosia Upgrades EXALT'},
  }
  for (let i = 0; i < arr.length - 1; i++) {
    const statALuckMi = DOMCacheGetOrSet(`statALuckM${i + 1}`)
    statALuckMi.childNodes[0].textContent = map[i + 1].desc
    DOMCacheGetOrSet(`sALuckM${i + 1}`).textContent = `+${
      format(
        arr[i],
        map[i + 1].acc,
        true
      )
    }`
  }

  DOMCacheGetOrSet('sALuckMult').textContent = `x${
    format(
      player.caches.ambrosiaLuckAdditiveMult.totalVal,
      3,
      true
    )
  }`

  const totalVal = Math.floor(
    arr[arr.length - 1] * player.caches.ambrosiaLuckAdditiveMult.totalVal
  )
  DOMCacheGetOrSet('sALuckMT').innerHTML = `&#9752 ${format(totalVal, 0)}`
}

export const loadStatisticsAmbrosiaGeneration = () => {
  const arr = player.caches.ambrosiaGeneration.flatten()
  const map: Record<number, { acc: number; desc: string }> = {
    1: { acc: 4, desc: 'Visited Ambrosia Subtab' },
    2: { acc: 4, desc: 'Number of Blueberries' },
    3: { acc: 4, desc: 'Shop Upgrade Bonus' },
    4: { acc: 4, desc: 'Singularity Ambrosia Generation Upgrades' },
    5: { acc: 4, desc: 'Octeract Ambrosia Generation Upgrades' },
    6: { acc: 4, desc: 'Patreon Bonus' },
    7: { acc: 4, desc: 'One Ascension Challenge EXALT'},
    8: { acc: 4, desc: 'No Ambrosia Upgrades EXALT' },
    9: { acc: 4, desc: 'Cash-Grab ULTIMATE'},
    10: { acc: 4, desc: 'Event Bonus'}
  }
  for (let i = 0; i < arr.length - 1; i++) {
    const statAGenMi = DOMCacheGetOrSet(`statAGenM${i + 1}`)
    statAGenMi.childNodes[0].textContent = map[i + 1].desc
    DOMCacheGetOrSet(`sAGenM${i + 1}`).textContent = `x${
      format(
        arr[i],
        map[i + 1].acc,
        true
      )
    }`
  }

  const totalVal = arr[arr.length - 1]
  DOMCacheGetOrSet('sAGenMT').textContent = `${format(totalVal, 3, true)}`
}

export const c15RewardUpdate = () => {
  // dprint-ignore
  const exponentRequirements = [
    750, 1.5e3, 3e3, 5e3, 7.5e3, 7.5e3, 1e4, 1e4, 2e4, 4e4, 6e4, 1e5, 1e5, 2e5,
    5e5, 1e6, 3e6, 1e7, 3e7, 1e8, 5e8, 2e9, 1e10, 1e11, 1e15, 2e15, 4e15, 7e15,
    1e16, 2e16, 3.33e16, 3.33e16, 3.33e16, 2e17, 1.5e18,
  ];
  type Key = keyof GlobalVariables['challenge15Rewards']
  const keys = Object.keys(G.challenge15Rewards) as Key[]
  const e = player.challenge15Exponent

  for (const obj in G.challenge15Rewards) {
    G.challenge15Rewards[obj as Key] = 1
  }
  G.challenge15Rewards.freeOrbs = 0

  if (e >= exponentRequirements[0]) {
    // All Cube Types 1 [750]
    G.challenge15Rewards[keys[0]] = 1 + ((1 / 50) * Math.log(e / 175)) / Math.log(2)
  }
  if (e >= exponentRequirements[1]) {
    // Ascension Count [1500]
    G.challenge15Rewards[keys[1]] = 1 + ((1 / 20) * Math.log(e / 375)) / Math.log(2)
  }
  if (e >= exponentRequirements[2]) {
    // Coin Exponent [3000]
    G.challenge15Rewards[keys[2]] = 1 + ((1 / 150) * Math.log(e / 750)) / Math.log(2)
  }
  if (e >= exponentRequirements[3]) {
    // Taxes [5000]
    G.challenge15Rewards[keys[3]] = Math.pow(
      0.98,
      Math.log(e / 1.25e3) / Math.log(2)
    )
  }
  if (e >= exponentRequirements[4]) {
    // Obtainium [7500]
    G.challenge15Rewards[keys[4]] = 1 + (1 / 5) * Math.pow(e / 7.5e3, 0.75)
  }
  if (e >= exponentRequirements[5]) {
    // Offerings [7500]
    G.challenge15Rewards[keys[5]] = 1 + (1 / 5) * Math.pow(e / 7.5e3, 0.75)
  }
  if (e >= exponentRequirements[6]) {
    // Accelerator Boost (Uncorruptable) [10000]
    G.challenge15Rewards[keys[6]] = 1 + ((1 / 20) * Math.log(e / 2.5e3)) / Math.log(2)
  }
  if (e >= exponentRequirements[7]) {
    // Multiplier Boost (Uncorruptable) [10000]
    G.challenge15Rewards[keys[7]] = 1 + ((1 / 20) * Math.log(e / 2.5e3)) / Math.log(2)
  }
  if (e >= exponentRequirements[8]) {
    // Rune EXP [20000]
    G.challenge15Rewards[keys[8]] = 1 + Math.pow(e / 2e4, 1.5)
  }
  if (e >= exponentRequirements[9]) {
    // Rune Effectiveness [40000]
    G.challenge15Rewards[keys[9]] = 1 + ((1 / 33) * Math.log(e / 1e4)) / Math.log(2)
  }
  if (e >= exponentRequirements[10]) {
    // All Cube Types II [60000]
    G.challenge15Rewards[keys[10]] = 1 + ((1 / 100) * Math.log(e / 1.5e4)) / Math.log(2)
  }
  if (e >= exponentRequirements[11]) {
    // Chal 1-5 Scaling [100000]
    G.challenge15Rewards[keys[11]] = Math.pow(
      0.98,
      Math.log(e / 2.5e4) / Math.log(2)
    )
  }
  if (e >= exponentRequirements[12]) {
    // Chal 6-10 Scaling [100000]
    G.challenge15Rewards[keys[12]] = Math.pow(
      0.98,
      Math.log(e / 2.5e4) / Math.log(2)
    )
  }
  if (e >= exponentRequirements[13]) {
    // Ant Speed [200k]
    G.challenge15Rewards[keys[13]] = Math.pow(
      1 + Math.log(e / 2e5) / Math.log(2),
      4
    )
  }
  if (e >= exponentRequirements[14]) {
    // Ant Bonus Levels [500k]
    G.challenge15Rewards[keys[14]] = 1 + ((1 / 20) * Math.log(e / 1.5e5)) / Math.log(2)
  }
  if (e >= exponentRequirements[15]) {
    // All Cube Types III [1m]
    G.challenge15Rewards[keys[15]] = 1 + ((1 / 150) * Math.log(e / 2.5e5)) / Math.log(2)
  }
  if (e >= exponentRequirements[16]) {
    // Talisman Effectiveness [3m]
    G.challenge15Rewards[keys[16]] = 1 + ((1 / 20) * Math.log(e / 7.5e5)) / Math.log(2)
  }
  if (e >= exponentRequirements[17]) {
    // Global Speed [10m]
    G.challenge15Rewards[keys[17]] = 1 + ((1 / 20) * Math.log(e / 2.5e6)) / Math.log(2)
  }
  if (e >= exponentRequirements[18]) {
    // Blessing Effectiveness [30m]
    G.challenge15Rewards[keys[18]] = 1 + (1 / 5) * Math.pow(e / 3e7, 1 / 4)
  }
  if (e >= exponentRequirements[19]) {
    // Tesseract Building Speed [100m]
    G.challenge15Rewards[keys[19]] = 1 + (1 / 5) * Math.pow(e / 1e8, 2 / 3)
  }
  if (e >= exponentRequirements[20]) {
    // All Cube Types IV [500m]
    G.challenge15Rewards[keys[20]] = 1 + ((1 / 200) * Math.log(e / 1.25e8)) / Math.log(2)
  }
  if (e >= exponentRequirements[21]) {
    // Spirit Effectiveness [2b]
    G.challenge15Rewards[keys[21]] = 1 + (1 / 5) * Math.pow(e / 2e9, 1 / 4)
  }
  if (e >= exponentRequirements[22]) {
    // Ascension Score [10b]
    G.challenge15Rewards[keys[22]] = 1 + (1 / 4) * Math.pow(e / 1e10, 1 / 4)
    if (e >= 1e20) {
      G.challenge15Rewards[keys[22]] = 1 + (1 / 4) * Math.pow(e / 1e10, 1 / 8) * Math.pow(1e10, 1 / 8)
    }
  }
  if (e >= exponentRequirements[23]) {
    // Quark Gain [100b]
    G.challenge15Rewards[keys[23]] = 1 + ((1 / 100) * Math.log((e * 32) / 1e11)) / Math.log(2)
  }
  if (e >= exponentRequirements[24]) {
    // Unlock Hepteract gain [1Qa]
    G.challenge15Rewards[keys[24]] = 2
  }
  if (e >= exponentRequirements[25]) {
    // Unlock Challenge hepteract [2Qa]
    void player.hepteractCrafts.challenge.unlock('the Hepteract of Challenge')
  }
  if (e >= exponentRequirements[26]) {
    // All Cube Types V [4Qa]
    G.challenge15Rewards[keys[25]] = 1 + (1 / 300) * Math.log2(e / (4e15 / 1024))
  }
  if (e >= exponentRequirements[27]) {
    // Powder Gain [7Qa]
    G.challenge15Rewards[keys[26]] = 1 + (1 / 50) * Math.log2(e / (7e15 / 32))
  }
  if (e >= exponentRequirements[28]) {
    // Unlock Abyss Hepteract [10Qa]
    void player.hepteractCrafts.abyss.unlock('the Hepteract of the Abyss')
  }
  if (e >= exponentRequirements[29]) {
    // Constant Upgrade 2 [20Qa]
    G.challenge15Rewards[keys[27]] = calculateSigmoid(1.05, e, 1e18)
  }
  if (e >= exponentRequirements[30]) {
    // Unlock ACCELERATOR HEPT [33.33Qa]
    void player.hepteractCrafts.accelerator.unlock(
      'the Hepteract of Way Too Many Accelerators'
    )
  }
  if (e >= exponentRequirements[31]) {
    // Unlock ACCELERATOR BOOST HEPT [33.33Qa]
    void player.hepteractCrafts.acceleratorBoost.unlock(
      'the Hepteract of Way Too Many Accelerator Boosts'
    )
  }
  if (e >= exponentRequirements[32]) {
    // Unlock MULTIPLIER Hept [33.33Qa]
    void player.hepteractCrafts.multiplier.unlock(
      'the Hepteract of Way Too Many Multipliers'
    )
  }
  if (e >= exponentRequirements[33]) {
    // FREE Daily Orbs
    G.challenge15Rewards.freeOrbs = Math.floor(200 * Math.pow(e / 2e17, 0.5))
  }
  if (e >= exponentRequirements[34]) {
    // Ascension Speed
    G.challenge15Rewards.ascensionSpeed = 1 + 5 / 100 + (2 * Math.log2(e / 1.5e18)) / 100
  }

  updateDisplayC15Rewards()
}

const updateDisplayC15Rewards = () => {
  DOMCacheGetOrSet('c15Reward0Num').textContent = format(
    player.challenge15Exponent,
    3,
    true
  )
  DOMCacheGetOrSet('c15RequiredExponentNum').textContent = format(
    Decimal.pow(10, player.challenge15Exponent / challenge15ScoreMultiplier()),
    0,
    true
  )
  // dprint-ignore
  const exponentRequirements = [
    750, 1.5e3, 3e3, 5e3, 7.5e3, 7.5e3, 1e4, 1e4, 2e4, 4e4, 6e4, 1e5, 1e5, 2e5,
    5e5, 1e6, 3e6, 1e7, 3e7, 1e8, 5e8, 2e9, 1e10, 1e11, 1e15, 2e15, 4e15, 7e15,
    1e16, 2e16, 3.33e16, 3.33e16, 3.33e16, 2e17, 1.5e18,
  ];
  const isNum: Record<number, boolean> = {
    // Shit solution to a shit problem -Platonic
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
    9: true,
    10: true,
    11: true,
    12: true,
    13: true,
    14: true,
    15: true,
    16: true,
    17: true,
    18: true,
    19: true,
    20: true,
    21: true,
    22: true,
    23: true,
    24: false,
    25: false,
    26: true,
    27: true,
    28: false,
    29: true,
    30: false,
    31: false,
    32: false,
    33: true,
    34: true
  }
  const values = Object.values(G.challenge15Rewards)
  let keepExponent: string | number = 'None'
  let skip = 0
  for (let i = 0; i < exponentRequirements.length; i++) {
    if (
      keepExponent === 'None'
      && player.challenge15Exponent < exponentRequirements[i]
    ) {
      keepExponent = exponentRequirements[i]
    }
    if (player.challenge15Exponent >= exponentRequirements[i]) {
      DOMCacheGetOrSet(`c15Reward${i + 1}Num`).textContent = isNum[i]
        ? format(100 * values[i - skip] - 100, 2, true)
        : 'Unlocked!'

      if (!isNum[i] && i !== 24) {
        // TODO: This sucks -Platonic
        skip += 1
      }

      if (i === 33) {
        DOMCacheGetOrSet('c15Reward34Num').textContent = format(
          values[i - skip],
          0,
          true
        )
      }
    }

    DOMCacheGetOrSet(`c15Reward${i + 1}`).style.display = player.challenge15Exponent >= exponentRequirements[i]
      ? 'block'
      : 'none'
    DOMCacheGetOrSet('c15RewardList').textContent = typeof keepExponent === 'string'
      ? 'You have unlocked all reward types from Challenge 15!'
      : `Next reward type requires ${
        format(
          keepExponent,
          0,
          true
        )
      } exponent.`
  }
}

interface Stage {
  stage: number
  tier: number
  name: string
  unlocked: boolean
  reset: boolean
}

export const gameStages = (): Stage[] => {
  const stages: Stage[] = [
    { stage: 0, tier: 1, name: 'start', unlocked: true, reset: true },
    {
      stage: 1,
      tier: 1,
      name: 'start-prestige',
      unlocked: player.unlocks.prestige,
      reset: player.unlocks.prestige
    },
    {
      stage: 2,
      tier: 2,
      name: 'prestige-transcend',
      unlocked: player.unlocks.transcend,
      reset: player.unlocks.transcend
    },
    {
      stage: 3,
      tier: 3,
      name: 'transcend-reincarnate',
      unlocked: player.unlocks.reincarnate,
      reset: player.unlocks.reincarnate
    },
    {
      stage: 4,
      tier: 4,
      name: 'reincarnate-ant',
      unlocked: player.firstOwnedAnts !== 0,
      reset: player.unlocks.reincarnate
    },
    {
      stage: 5,
      tier: 4,
      name: 'ant-sacrifice',
      unlocked: player.achievements[173] === 1,
      reset: player.unlocks.reincarnate
    },
    {
      stage: 6,
      tier: 4,
      name: 'sacrifice-ascension',
      unlocked: player.achievements[183] === 1,
      reset: player.unlocks.reincarnate
    },
    {
      stage: 7,
      tier: 5,
      name: 'ascension-challenge10',
      unlocked: player.ascensionCount > 1,
      reset: player.achievements[183] === 1
    },
    {
      stage: 8,
      tier: 5,
      name: 'challenge10-challenge11',
      unlocked: player.achievements[197] === 1,
      reset: player.achievements[183] === 1
    },
    {
      stage: 9,
      tier: 5,
      name: 'challenge11-challenge12',
      unlocked: player.achievements[204] === 1,
      reset: player.achievements[183] === 1
    },
    {
      stage: 10,
      tier: 5,
      name: 'challenge12-challenge13',
      unlocked: player.achievements[211] === 1,
      reset: player.achievements[183] === 1
    },
    {
      stage: 11,
      tier: 5,
      name: 'challenge13-challenge14',
      unlocked: player.achievements[218] === 1,
      reset: player.achievements[183] === 1
    },
    {
      stage: 12,
      tier: 5,
      name: 'challenge14-w5x10max',
      unlocked: player.cubeUpgrades[50] >= 100000,
      reset: player.achievements[183] === 1
    },
    {
      stage: 13,
      tier: 5,
      name: 'w5x10max-alpha',
      unlocked: player.platonicUpgrades[5] > 0,
      reset: player.achievements[183] === 1
    },
    {
      stage: 14,
      tier: 5,
      name: 'alpha-p2x1x10',
      unlocked: player.platonicUpgrades[6] >= 10,
      reset: player.achievements[183] === 1
    },
    {
      stage: 15,
      tier: 5,
      name: 'p2x1x10-p3x1',
      unlocked: player.platonicUpgrades[11] > 0,
      reset: player.achievements[183] === 1
    },
    {
      stage: 16,
      tier: 5,
      name: 'p3x1-beta',
      unlocked: player.platonicUpgrades[10] > 0,
      reset: player.achievements[183] === 1
    },
    {
      stage: 17,
      tier: 5,
      name: 'beta-1e15-expo',
      unlocked: player.challenge15Exponent >= 1e15,
      reset: player.achievements[183] === 1
    },
    {
      stage: 18,
      tier: 5,
      name: '1e15-expo-omega',
      unlocked: player.platonicUpgrades[15] > 0,
      reset: player.achievements[183] === 1
    },
    {
      stage: 19,
      tier: 5,
      name: 'omega-singularity',
      unlocked: player.singularityCount > 0 && player.runelevels[6] > 0,
      reset: player.achievements[183] === 1
    },
    {
      stage: 20,
      tier: 6,
      name: 'singularity-exalt1x1',
      unlocked: player.singularityChallenges.noSingularityUpgrades.completions > 0,
      reset: player.highestSingularityCount > 0
    },
    {
      stage: 21,
      tier: 6,
      name: 'exalt1x1-onemind',
      unlocked: player.singularityUpgrades.oneMind.level > 0,
      reset: player.highestSingularityCount > 0
    },
    {
      stage: 22,
      tier: 6,
      name: 'onemind-end',
      unlocked: player.singularityUpgrades.offeringAutomatic.level > 0,
      reset: player.highestSingularityCount > 0
    },
    {
      stage: 23,
      tier: 6,
      name: 'end-pen',
      unlocked: player.singularityUpgrades.ultimatePen.level > 0,
      reset: player.highestSingularityCount > 0
    },
    {
      stage: 24,
      tier: 6,
      name: 'pen',
      unlocked: false,
      reset: player.highestSingularityCount > 0
    }
  ]
  return stages
}

// Calculate which progress in the game you are playing
// The progress displayed is based on Progression Chat and Questions
// This will be used to determine the behavior of the profile of the autopilot function in the future
export const synergismStage = (
  skipTier = player.singularityCount > 0 ? 5 : 0
): string => {
  const stages = gameStages()
  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i]
    if (skipTier < stage.tier && (!stage.reset || !stage.unlocked)) {
      return stage.name
    }
  }
  const stagesZero = stages[0]
  return stagesZero.name
}
