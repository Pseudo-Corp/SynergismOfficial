import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { z } from 'zod'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { getOcteractUpgradeEffect } from './Octeracts'
import { PCoinUpgradeEffects } from './PseudoCoinUpgrades'
import { getRuneEffects } from './Runes'
import { getGQUpgradeEffect } from './singularity'
import { format, player } from './Synergism'
import { getTalismanEffects } from './Talismans'
import { IconSets } from './Themes'
import { toggleCorruptionLevel } from './Toggles'
import { Alert, Notification, Prompt } from './UpdateHTML'
import { getElementById, productContents, sumContents, validateNonnegativeInteger } from './Utility'
import { Globals as G } from './Variables'

export enum CorruptionIndices {
  'viscosity' = 0,
  'dilation' = 1,
  'hyperchallenge' = 2,
  'illiteracy' = 3,
  'deflation' = 4,
  'extinction' = 5,
  'drought' = 6,
  'recession' = 7
}

export const convertInputToCorruption = (array: number[]): Corruptions => {
  return {
    viscosity: array[CorruptionIndices.viscosity],
    drought: array[CorruptionIndices.drought],
    deflation: array[CorruptionIndices.deflation],
    extinction: array[CorruptionIndices.extinction],
    illiteracy: array[CorruptionIndices.illiteracy],
    recession: array[CorruptionIndices.recession],
    dilation: array[CorruptionIndices.dilation],
    hyperchallenge: array[CorruptionIndices.hyperchallenge]
  }
}

export const corruptionsSchema = z.object({
  viscosity: z.number().default(0),
  drought: z.number().default(0),
  deflation: z.number().default(0),
  extinction: z.number().default(0),
  illiteracy: z.number().default(0),
  recession: z.number().default(0),
  dilation: z.number().default(0),
  hyperchallenge: z.number().default(0)
})

export type Corruptions = {
  viscosity: number
  drought: number
  deflation: number
  extinction: number
  illiteracy: number
  recession: number
  dilation: number
  hyperchallenge: number
}

export const c15Corruptions: Corruptions = {
  viscosity: 11,
  drought: 11,
  deflation: 11,
  extinction: 11,
  illiteracy: 11,
  recession: 11,
  dilation: 11,
  hyperchallenge: 11
}

export class CorruptionLoadout {
  #totalScoreMult = 1
  #corruptionScoreMults = [1, 3, 4, 5, 6, 7, 7.75, 8.5, 9.25, 10, 10.75, 11.5, 12.25, 13, 16, 20, 25, 33, 35]
  #levels: Corruptions = {
    viscosity: 0,
    drought: 0,
    deflation: 0,
    extinction: 0,
    illiteracy: 0,
    recession: 0,
    dilation: 0,
    hyperchallenge: 0
  }

  constructor (p: Corruptions) {
    Object.entries(p).forEach(([key, value]) => {
      this.#levels[key as keyof Corruptions] = value
    })
  }

  public setCorruptionLevels (corruptions: Partial<Corruptions>) {
    Object.assign(this.#levels, corruptions)
    this.clipCorruptionLevels()
    this.#totalScoreMult = this.#calcTotalScoreMult()
  }

  public setCorruptionLevelsWithChallengeRequirement (corruptions: Partial<Corruptions>) {
    Object.assign(this.#levels, corruptions)
    for (const corr in this.#levels) {
      const corrKey = corr as keyof Corruptions
      if (
        player.challengecompletions[corrChallengeMinimum(corrKey)] === 0
        && !getGQUpgradeEffect('platonicTau')
      ) {
        this.setLevel(corrKey, 0)
      }
    }
    this.clipCorruptionLevels()
    this.#totalScoreMult = this.#calcTotalScoreMult()
  }

  public clipCorruptionLevels () {
    const minLevel = 0
    const maxLevel = maxCorruptionLevel()

    for (const [corr, level] of Object.entries(this.#levels)) {
      const corruption = corr as keyof Corruptions

      // Standard Validation
      if (!validateNonnegativeInteger(level)) {
        this.#levels[corruption] = 0
      }

      this.#levels[corruption] = Math.max(minLevel, this.#levels[corruption])
      this.#levels[corruption] = Math.min(maxLevel, this.#levels[corruption])
    }
  }

  public calculateIndividualRawMultiplier (corr: keyof Corruptions) {
    let bonusVal = getGQUpgradeEffect('advancedPack')
      ? 0.33
      : 0
    bonusVal += +player.singularityChallenges.oneChallengeCap.rewards.corrScoreIncrease
    bonusVal += 0.3 * player.cubeUpgrades[74]

    let bonusMult = 1
    if (this.#levels[corr] >= 14 && getGQUpgradeEffect('masterPack')) {
      bonusMult *= 1.1
    }

    // player.platonicUpgrades[17] is the 17th platonic upgrade, known usually as P4x2, makes
    // Exponent 3 + 0.04 * level if the corr is viscosity and it is set at least level 10.
    const viscosityPower = (player.platonicUpgrades[17] > 0 && this.#levels.viscosity >= 10 && corr === 'viscosity')
      ? 3 + 0.04 * player.platonicUpgrades[17]
      : 1

    const totalLevel = this.#levels[corr] + this.bonusLevels
    const scoreMultLength = this.#corruptionScoreMults.length

    if (totalLevel < scoreMultLength - 1) {
      const portionAboveLevel = Math.ceil(totalLevel) - totalLevel
      return Math.pow(
        this.#corruptionScoreMults[Math.floor(totalLevel)] + bonusVal
          + portionAboveLevel
            * (this.#corruptionScoreMults[Math.ceil(totalLevel)] - this.#corruptionScoreMults[Math.floor(totalLevel)]),
        viscosityPower
      ) * bonusMult
    } else {
      return Math.pow(
        (this.#corruptionScoreMults[scoreMultLength - 1] + bonusVal)
          * Math.pow(1.2, totalLevel - scoreMultLength + 1),
        viscosityPower
      ) * bonusMult
    }
  }

  #viscosityEffect () {
    const base = G.viscosityPower[this.#levels.viscosity]
    const multiplier = 1 + player.platonicUpgrades[6] / 30
    return Math.min(base * multiplier, 1)
  }

  #droughtEffect () {
    let baseSalvageReduction = G.droughtSalvage[this.#levels.drought]
    if (player.platonicUpgrades[13] > 0) {
      baseSalvageReduction *= 0.5
    }
    return baseSalvageReduction
  }

  #deflationEffect () {
    return G.deflationMultiplier[this.#levels.deflation]
  }

  #extinctionEffect () {
    return G.extinctionDivisor[this.#levels.extinction]
  }

  #illiteracyEffect () {
    const base = G.illiteracyPower[this.#levels.illiteracy]
    const multiplier = (player.obtainium.gte(1))
      ? 1 + (1 / 100) * player.platonicUpgrades[9] * Math.min(100, Decimal.log10(player.obtainium))
      : 1
    return Math.min(base * multiplier, 1)
  }

  #recessionEffect () {
    return G.recessionPower[this.#levels.recession]
  }

  #dilationEffect () {
    return G.dilationMultiplier[this.#levels.dilation]
  }

  #hyperchallengeEffect () {
    const baseEffect = G.hyperchallengeMultiplier[this.#levels.hyperchallenge]
    let divisor = 1
    divisor *= 1 + 2 / 5 * player.platonicUpgrades[8]
    return Math.max(1, baseEffect / divisor)
  }

  corruptionEffects (corr: keyof Corruptions) {
    switch (corr) {
      case 'deflation': {
        return this.#deflationEffect()
      }
      case 'dilation': {
        return this.#dilationEffect()
      }
      case 'drought': {
        return this.#droughtEffect()
      }
      case 'extinction': {
        return this.#extinctionEffect()
      }
      case 'hyperchallenge': {
        return this.#hyperchallengeEffect()
      }
      case 'illiteracy': {
        return this.#illiteracyEffect()
      }
      case 'recession': {
        return this.#recessionEffect()
      }
      case 'viscosity': {
        return this.#viscosityEffect()
      }
    }
  }

  get totalLevels () {
    return sumContents(Object.values(this.#levels))
  }

  get bonusLevels () {
    let bonusLevel = getGQUpgradeEffect('corruptionFifteen')
    bonusLevel += +player.singularityChallenges.oneChallengeCap.rewards.freeCorruptionLevel
    bonusLevel += getTalismanEffects('cookieGrandma').freeCorruptionLevel
    bonusLevel += getRuneEffects('finiteDescent').corruptionFreeLevels
    return bonusLevel
  }

  public scoreMult (corruption: keyof Corruptions) {
    return this.calculateIndividualRawMultiplier(corruption)
  }

  get totalCorruptionDifficultyScore () {
    let basePoints = 400
    Object.keys(this.#levels).forEach((key) => {
      basePoints += 16 * Math.pow(this.getTotalLevel(key as keyof Corruptions), 2)
    })
    return basePoints
  }

  get totalCorruptionDifficultyMultiplier () {
    return this.totalCorruptionDifficultyScore / 400
  }

  #calcTotalScoreMult () {
    return productContents(
      Object.keys(this.#levels).map((key) => {
        const corrKey = key as keyof Corruptions
        return this.scoreMult(corrKey)
      })
    )
  }

  getLevel (corr: keyof Corruptions) {
    return this.#levels[corr]
  }

  get loadout () {
    return this.#levels
  }

  getTotalLevel (corr: keyof Corruptions) {
    return this.#levels[corr] + this.bonusLevels
  }

  setLevel (corr: keyof Corruptions, newLevel: number) {
    this.#levels[corr] = newLevel
    this.updateCorruptionScoreMult()
  }

  resetCorruptions () {
    if (player.currentChallenge.ascension !== 15 && player.campaigns.currentCampaign === undefined) {
      for (const corr in this.#levels) {
        const corrKey = corr as keyof Corruptions
        this.setLevel(corrKey, 0)
        corruptionDisplay(corrKey)
      }
      this.#totalScoreMult = this.#calcTotalScoreMult()
      corruptionLoadoutTableUpdate(true, 0)
      corruptionDisplay(G.corruptionTrigger)
      DOMCacheGetOrSet('corruptionCleanseConfirm').style.visibility = 'hidden'
    } else {
      Notification(i18next.t('corruptions.resetCorruptionsError'))
    }
  }

  incrementDecrementLevel (corr: keyof Corruptions, val: number) {
    const level = this.getLevel(corr)
    const minLevel = 0
    const maxLevel = maxCorruptionLevel()

    const newLevel = Math.max(minLevel, Math.min(maxLevel, level + val))
    this.setLevel(corr, newLevel)
  }

  get totalCorruptionAscensionMultiplier () {
    if (this.#totalScoreMult === 1) {
      this.#totalScoreMult = this.#calcTotalScoreMult()
    }

    return this.#totalScoreMult
  }

  updateCorruptionScoreMult () {
    this.#totalScoreMult = this.#calcTotalScoreMult()
    return this.#totalScoreMult
  }

  get deflation () {
    return this.#levels.deflation
  }

  get extinction () {
    return this.#levels.extinction
  }

  get recession () {
    return this.#levels.recession
  }

  get viscosity () {
    return this.#levels.viscosity
  }

  get illiteracy () {
    return this.#levels.illiteracy
  }

  get drought () {
    return this.#levels.drought
  }

  get hyperchallenge () {
    return this.#levels.hyperchallenge
  }

  get dilation () {
    return this.#levels.dilation
  }
}

export type SavedCorruption = {
  name: string
  loadout: CorruptionLoadout
}

export class CorruptionSaves {
  #saves: Array<SavedCorruption>
  constructor (corrSaveData: Record<string, Corruptions>) {
    this.#saves = []
    for (const saveKey of Object.keys(corrSaveData).slice(0, 16)) {
      this.#saves.push({ name: saveKey, loadout: new CorruptionLoadout(corrSaveData[saveKey]) })
    }
  }

  addSave (loadoutName: string, loadoutValues: Corruptions) {
    this.#saves.push({ name: loadoutName, loadout: new CorruptionLoadout(loadoutValues) })
  }

  delSave () {
    this.#saves.pop()
  }

  get saves (): Array<SavedCorruption> {
    return this.#saves
  }

  get corrSaveData (): Record<string, Corruptions> {
    return Object.fromEntries(this.#saves.map((save) => [save.name, save.loadout.loadout]))
  }
}

export const maxCorruptionLevel = () => {
  let max = 0

  if (player.challengecompletions[11] > 0) {
    max += 5
  }
  if (player.challengecompletions[12] > 0) {
    max += 2
  }
  if (player.challengecompletions[13] > 0) {
    max += 2
  }
  if (player.challengecompletions[14] > 0) {
    max += 2
  }
  if (player.platonicUpgrades[5] > 0) {
    max += 1
  }
  if (player.platonicUpgrades[10] > 0) {
    max += 1
  }

  // Overrides everything above.
  if (getGQUpgradeEffect('platonicTau')) {
    max = Math.max(13, max)
  }

  if (getGQUpgradeEffect('corruptionFourteen')) {
    max += 1
  }
  max += getOcteractUpgradeEffect('octeractCorruption')

  return max
}

export const corrIcons: Record<keyof Corruptions, string> = {
  viscosity: '/CorruptViscosity.png',
  drought: '/CorruptDrought.png',
  deflation: '/CorruptDeflation.png',
  extinction: '/CorruptExtinction.png',
  illiteracy: '/CorruptIlliteracy.png',
  recession: '/CorruptRecession.png',
  dilation: '/CorruptDilation.png',
  hyperchallenge: '/CorruptHyperchallenge.png'
}

export const corruptionDisplay = (corr: keyof Corruptions | 'exit') => {
  if (DOMCacheGetOrSet('corruptionDetails').style.visibility !== 'visible') {
    DOMCacheGetOrSet('corruptionDetails').style.visibility = 'visible'
  }
  if (DOMCacheGetOrSet('corruptionSelectedPic').style.visibility !== 'visible') {
    DOMCacheGetOrSet('corruptionSelectedPic').style.visibility = 'visible'
  }

  let text = {
    name: i18next.t('corruptions.exitCorruption.name'),
    description: i18next.t('corruptions.exitCorruption.description'),
    current: i18next.t('corruptions.exitCorruption.current'),
    planned: i18next.t('corruptions.exitCorruption.planned'),
    multiplier: i18next.t('corruptions.exitCorruption.multiplier'),
    difficulty: '',
    freeLevels: '',
    image: `Pictures/${IconSets[player.iconSet][0]}/CorruptExit.png`
  } satisfies Record<string, string>

  if (corr !== 'exit') {
    text = {
      name: i18next.t(`corruptions.names.${corr}`),
      description: i18next.t(`corruptions.descriptions.${corr}`),
      current: i18next.t(`corruptions.currentLevel.${corr}`, {
        level: player.corruptions.used.getLevel(corr),
        effect: format(player.corruptions.used.corruptionEffects(corr), 3, true)
      }),
      planned: i18next.t(`corruptions.prototypeLevel.${corr}`, {
        level: player.corruptions.next.getLevel(corr),
        effect: format(player.corruptions.next.corruptionEffects(corr), 3, true)
      }),
      multiplier: i18next.t('corruptions.scoreMultiplier', {
        curr: format(player.corruptions.used.scoreMult(corr), 2, true),
        next: format(player.corruptions.next.scoreMult(corr), 2, true)
      }),
      difficulty: i18next.t('corruptions.difficultyEffect', {
        curr: format(16 * Math.pow(player.corruptions.used.getTotalLevel(corr), 2), 0, false),
        next: format(16 * Math.pow(player.corruptions.next.getTotalLevel(corr), 2), 0, false)
      }),
      freeLevels: i18next.t('corruptions.freeLevels', {
        curr: format(player.corruptions.used.bonusLevels, 2, true)
      }),
      image: `Pictures/${IconSets[player.iconSet][0]}${corrIcons[corr]}`
    }
    DOMCacheGetOrSet(`corrCurrent${corr}`).textContent = format(player.corruptions.used.getLevel(corr))
    DOMCacheGetOrSet(`corrNext${corr}`).textContent = format(player.corruptions.next.getLevel(corr))
  }

  DOMCacheGetOrSet('corruptionName').textContent = text.name
  DOMCacheGetOrSet('corruptionDescription').innerHTML = text.description
  DOMCacheGetOrSet('corruptionLevelCurrent').textContent = text.current
  DOMCacheGetOrSet('corruptionLevelPlanned').textContent = text.planned
  DOMCacheGetOrSet('corruptionMultiplierContribution').textContent = text.multiplier
  DOMCacheGetOrSet('corruptionDifficultyContribution').textContent = text.difficulty
  DOMCacheGetOrSet('corruptionFreeLevels').textContent = text.freeLevels
  DOMCacheGetOrSet('corruptionSelectedPic').setAttribute('src', text.image)
}

export const corruptionStatsUpdate = () => {
  for (const corr in player.corruptions.used.loadout) {
    const corrKey = corr as keyof Corruptions
    // https://discord.com/channels/677271830838640680/706329553639047241/841749032841379901
    const a = DOMCacheGetOrSet(`corrCurrent${corrKey}`)
    const b = DOMCacheGetOrSet(`corrNext${corrKey}`)
    a.textContent = format(player.corruptions.used.getLevel(corrKey))
    b.textContent = format(player.corruptions.next.getLevel(corrKey))
  }
}

export const corruptionButtonsAdd = () => {
  const rows = document.getElementsByClassName('corruptionStatRow')
  const keys = Object.keys(c15Corruptions)

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const key = keys[i] as keyof Corruptions
    // Delete rows that already exist
    for (let i = row.children.length - 1; i >= 1; i--) {
      row.children[i].remove()
    }

    const icon = document.createElement('img')
    icon.className = 'corruptionImg'
    icon.src = `Pictures/${IconSets[player.iconSet][0]}${corrIcons[key]}`
    icon.addEventListener('click', () => corruptionDisplay(key))
    icon.loading = 'lazy'
    icon.title = `${i18next.t(`corruptions.names.${key}`)}`
    row.appendChild(icon)

    const p = document.createElement('p')
    p.className = 'corrDesc'
    let text = document.createTextNode(i18next.t('corruptions.current'))
    p.appendChild(text)
    let span = document.createElement('span')
    span.id = `corrCurrent${key}`
    span.textContent = `${player.corruptions.used.getLevel(key)}`
    p.appendChild(span)

    text = document.createTextNode(i18next.t('corruptions.next'))
    p.appendChild(text)

    span = document.createElement('span')
    span.id = `corrNext${key}`
    span.textContent = `${player.corruptions.next.getLevel(key)}`
    p.appendChild(span)
    row.appendChild(p)

    let btn: HTMLButtonElement
    btn = document.createElement('button')
    btn.className = 'corrBtn corruptionMax'
    btn.textContent = `+${i18next.t('corruptions.max')}`
    btn.addEventListener('click', () => toggleCorruptionLevel(key, 99))
    row.appendChild(btn)

    btn = document.createElement('button')
    btn.className = 'corrBtn corruptionUp'
    btn.textContent = '+1'
    btn.addEventListener('click', () => toggleCorruptionLevel(key, 1))
    row.appendChild(btn)

    btn = document.createElement('button')
    btn.className = 'corrBtn corruptionDown'
    btn.textContent = '-1'
    btn.addEventListener('click', () => toggleCorruptionLevel(key, -1))
    row.appendChild(btn)

    btn = document.createElement('button')
    btn.className = 'corrBtn corruptionReset'
    btn.textContent = `-${i18next.t('corruptions.max')}`
    btn.addEventListener('click', () => toggleCorruptionLevel(key, -99))
    row.appendChild(btn)
    row.addEventListener('click', () => corruptionDisplay(key))
  }
}

export const corruptionLoadoutTableCreate = () => {
  const table = getElementById<HTMLTableElement>('corruptionLoadoutTable')

  const corrNext = player.corruptions.next.loadout
  const corrSaves = player.corruptions.saves.saves

  // Delete rows that already exist
  for (let i = table.rows.length - 1; i >= 1; i--) {
    table.deleteRow(i)
  }

  // Create the 'next' row
  const nextRow = table.insertRow()

  // Use the default name 'next'
  const nextCell = nextRow.insertCell()
  nextCell.className = `test${'Title'}`
  nextCell.textContent = i18next.t('corruptions.loadoutTable.next')
  nextCell.addEventListener('click', () => void corruptionLoadoutGetExport())
  nextCell.classList.add('corrLoadoutName')
  nextCell.title = i18next.t('corruptions.loadoutTable.firstRowTitle')

  // Insert Prototype Corrs
  for (const corr in corrNext) {
    const corrKey = corr as keyof Corruptions
    const cell = nextRow.insertCell()
    cell.className = `test${corrKey}`
    cell.textContent = corrNext[corrKey].toString()
  }

  // Import and Zero buttons
  // First line is special : "Import" and "Zero" buttons
  const importCell = nextRow.insertCell()
  const importBtn: HTMLButtonElement = document.createElement('button')
  importBtn.className = 'corrImport'
  importBtn.textContent = i18next.t('corruptions.loadoutTable.import')
  importBtn.addEventListener('click', () => void importCorruptionsPrompt())
  importCell.appendChild(importBtn)
  importCell.title = i18next.t('corruptions.importLoadoutInTextFormat')

  const zeroCell = nextRow.insertCell()
  const zeroBtn = document.createElement('button')
  zeroBtn.className = 'corrLoad'
  zeroBtn.textContent = i18next.t('corruptions.loadoutTable.zero')
  zeroBtn.addEventListener('click', () => player.corruptions.next.resetCorruptions())
  zeroCell.appendChild(zeroBtn)
  zeroCell.title = i18next.t('corruptions.loadoutTable.zeroTitle')

  // Do the rest of the thing
  const allowedRows = 8 + PCoinUpgradeEffects.CORRUPTION_LOADOUT_SLOT_QOL
  for (let i = 0; i < Math.min(corrSaves.length, allowedRows); i++) {
    const corrSave = corrSaves[i]
    const corrLoadout = corrSave.loadout.loadout

    const row = table.insertRow()
    // Title Cell
    const titleCell = row.insertCell()
    titleCell.className = `test${'Title'}`
    titleCell.title = i18next.t('corruptions.loadoutTable.otherRowTitle', { value: i + 1 })
    for (const corr in corrLoadout) {
      const corrKey = corr as keyof Corruptions
      const cell = row.insertCell()
      cell.className = `test${corrKey}`
      cell.textContent = corrLoadout[corrKey].toString()
    }

    let cell = row.insertCell()
    let btn = document.createElement('button')
    btn.className = 'corrSave'
    btn.textContent = i18next.t('corruptions.loadoutTable.save')
    btn.addEventListener('click', () => corruptionSaveLoadout(i))
    cell.appendChild(btn)
    cell.title = i18next.t('corruptions.loadoutTable.saveTitle')

    cell = row.insertCell()
    btn = document.createElement('button')
    btn.className = 'corrLoad'
    btn.textContent = i18next.t('corruptions.loadoutTable.load')
    btn.addEventListener('click', () => corruptionLoadLoadout(i))
    cell.appendChild(btn)
  }
}

export const corruptionLoadoutTableUpdate = (updateNext = false, updateRow = 0) => {
  const row = getElementById<HTMLTableElement>('corruptionLoadoutTable').rows[updateRow + 1].cells
  if (updateNext) {
    const corrNext = player.corruptions.next.loadout
    let index = 0
    for (const corr in corrNext) {
      const corrKey = corr as keyof Corruptions
      row[index + 1].textContent = corrNext[corrKey].toString()
      index += 1
    }
  } else {
    const corrSaves = player.corruptions.saves.saves[updateRow - 1]?.loadout.loadout
    let index = 0
    for (const corr in corrSaves) {
      const corrKey = corr as keyof Corruptions
      row[index + 1].textContent = corrSaves[corrKey].toString()
      index += 1
    }
  }
}

export const corruptionSaveLoadout = (loadoutNum: number) => {
  const buildToSave = player.corruptions.next.loadout
  player.corruptions.saves.saves[loadoutNum].loadout.setCorruptionLevelsWithChallengeRequirement(buildToSave)
  corruptionLoadoutTableUpdate(false, loadoutNum + 1)
}

export const corruptionLoadLoadout = (loadoutNum: number) => {
  const buildToLoad = player.corruptions.saves.saves[loadoutNum].loadout.loadout
  player.corruptions.next.setCorruptionLevelsWithChallengeRequirement(buildToLoad)
  corruptionLoadoutTableUpdate(true)
  corruptionStatsUpdate()
}

export const applyCorruptions = (corruptions: string) => {
  let corr: Corruptions
  if (!corruptions) {
    return false
  }

  if (corruptions.includes('/') && corruptions.split('/').length === 8) {
    // Supports legacy format
    corr = convertInputToCorruption(corruptions.split('/').map(Number))
  } else {
    const corrJSON = JSON.parse(corruptions)
    corr = corruptionsSchema.parse(corrJSON)
  }

  if (corr) {
    player.corruptions.next.setCorruptionLevelsWithChallengeRequirement(corr)
    corruptionLoadoutTableUpdate(true, 0)
    corruptionStatsUpdate()
    return true
  }
  return false
}

async function importCorruptionsPrompt () {
  const input = await Prompt(i18next.t('corruptions.importCorruptionsPrompt.import'))

  if (input === null || !applyCorruptions(input)) {
    void Alert(i18next.t('corruptions.importCorruptionsPrompt.importError'))
  }
}

async function corruptionLoadoutGetNewName (loadout = 0) {
  const maxChars = 9
  // biome-ignore lint/suspicious/noControlCharactersInRegex: I use control characters in my regex for fun!
  const regex = /^[\x00-\xFF]*$/
  const renamePrompt = await Prompt(
    i18next.t('corruptions.corruptionLoadoutName.loadoutPrompt', { loadNum: loadout + 1, maxChars })
  )

  if (!renamePrompt) {
    return Alert(i18next.t('corruptions.corruptionLoadoutName.errors.noName'))
  } else if (renamePrompt.length > maxChars) {
    return Alert(i18next.t('corruptions.corruptionLoadoutName.errors.exceedsCharacterLimit'))
  } else if (!regex.test(renamePrompt)) {
    return Alert(i18next.t('corruptions.corruptionLoadoutName.errors.regexError'))
  } else {
    player.corruptions.saves.saves[loadout].name = renamePrompt
    updateCorruptionLoadoutNames()
    if (renamePrompt === 'crazy') {
      return Alert(i18next.t('corruptions.loadoutPrompt.errors.crazyJoke'))
    }
  }
}

// let hasUpdatedCorruptionLoadoutNames = false

export const updateCorruptionLoadoutNames = () => {
  const rows = getElementById<HTMLTableElement>('corruptionLoadoutTable').rows
  const totalSlots = 8 + PCoinUpgradeEffects.CORRUPTION_LOADOUT_SLOT_QOL
  for (let i = 0; i < totalSlots; i++) {
    const cells = rows[i + 2].cells // start changes on 2nd row
    if (cells[0].textContent!.length === 0) { // first time setup
      cells[0].addEventListener('click', () => void corruptionLoadoutGetNewName(i)) // get name function handles -1 for array
      cells[0].classList.add('corrLoadoutName')
    }
    cells[0].textContent = `${player.corruptions.saves.saves[i]?.name}:`
  }
}

const corruptionLoadoutGetExport = async () => {
  const str = JSON.stringify(player.corruptions.next.loadout)
  if ('clipboard' in navigator) {
    await navigator.clipboard.writeText(str)
      .catch((e: Error) => Alert(i18next.t('corruptions.loadoutExport.saveErrorNavigator', { message: e.message })))
  } else {
    void Alert(i18next.t('corruptions.loadoutExport.saveErrorNavigator', { message: str }))
  }
}

export const corruptionCleanseConfirm = () => {
  const corrupt = DOMCacheGetOrSet('corruptionCleanseConfirm')
  corrupt.style.visibility = 'visible'
  setTimeout(() => corrupt.style.visibility = 'hidden', 10000)
}

export const revealCorruptions = () => {
  const corruptions = document.getElementsByClassName('corruptionStatRow') as HTMLCollectionOf<HTMLElement>
  for (let i = 0; i < corruptions.length; i++) {
    corruptions[i].style.display = 'none'
  }

  const c11Unlocks = document.getElementsByClassName('chal11Corruption') as HTMLCollectionOf<HTMLElement>
  const c12Unlocks = document.getElementsByClassName('chal12Corruption') as HTMLCollectionOf<HTMLElement>
  const c13Unlocks = document.getElementsByClassName('chal13Corruption') as HTMLCollectionOf<HTMLElement>
  const c14Unlocks = document.getElementsByClassName('chal14Corruption') as HTMLCollectionOf<HTMLElement>

  if (player.challengecompletions[11] > 0 || getGQUpgradeEffect('platonicTau')) {
    for (let i = 0; i < c11Unlocks.length; i++) {
      c11Unlocks[i].style.display = 'flex'
    }
  }
  if (player.challengecompletions[12] > 0 || getGQUpgradeEffect('platonicTau')) {
    for (let i = 0; i < c12Unlocks.length; i++) {
      c12Unlocks[i].style.display = 'flex'
    }
  }
  if (player.challengecompletions[13] > 0 || getGQUpgradeEffect('platonicTau')) {
    for (let i = 0; i < c13Unlocks.length; i++) {
      c13Unlocks[i].style.display = 'flex'
    }
  }
  if (player.challengecompletions[14] > 0 || getGQUpgradeEffect('platonicTau')) {
    for (let i = 0; i < c14Unlocks.length; i++) {
      c14Unlocks[i].style.display = 'flex'
    }
  }
}

export function corrChallengeMinimum (corr: keyof Corruptions): number {
  switch (corr) {
    case 'viscosity':
      return 11
    case 'dilation':
      return 14
    case 'hyperchallenge':
      return 14
    case 'illiteracy':
      return 13
    case 'deflation':
      return 12
    case 'extinction':
      return 12
    case 'drought':
      return 11
    case 'recession':
      return 13
    default:
      return 0
  }
}

export const updateUndefinedLoadouts = () => {
  // Sanity checks that you have 16 loadouts and 16 loadout names in the Player object
  // The monetization update adds more loadouts, so this is to ensure that the player object is up to date
  // And because the validation schema does not take into account length of object
  const maxLoadoutCount = 16 // Update if more loadouts are added
  const currLoadoutCount = Object.keys(player.corruptions.saves.saves).length
  if (currLoadoutCount < maxLoadoutCount) {
    for (let i = currLoadoutCount + 1; i <= maxLoadoutCount; i++) {
      player.corruptions.saves.addSave(`Loadout ${i}`, corruptionsSchema.parse({}))
    }
  }
}
