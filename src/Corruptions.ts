import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { format, player } from './Synergism'
import { IconSets } from './Themes'
import { toggleCorruptionLevel } from './Toggles'
import { Alert, Prompt } from './UpdateHTML'
import { getElementById, productContents, sumContents, validateNonnegativeInteger } from './Utility'
import { Globals as G } from './Variables'

//export const corruptions = ['viscosity', 'drought', 'deflation', 'extinction', 'illiteracy', 'recession', 'dilation', 'hyperchallenge'] as const
//export type Corruptions = typeof corruptions[number]

export type Corruptions = {
  viscosity: number,
  drought: number,
  deflation: number,
  extinction: number,
  illiteracy: number,
  recession: number,
  dilation: number,
  hyperchallenge: number
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
  #bonusLevels = 0

  constructor (p: Partial<Corruptions>) {
    Object.assign(this.#levels, p)
    this.clipCorruptionLevels()
    this.#totalScoreMult = this.#calcTotalScoreMult()
    this.#bonusLevels = this.#calcBonusLevels()
  }

  public clipCorruptionLevels() {
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

  public multInterpolation(level: number) {
    const scoreMultLength = this.#corruptionScoreMults.length
    if (level < scoreMultLength - 1) {
      const portionBelowLevel = level - Math.floor(level)
      const portionAboveLevel = Math.ceil(level) - level
      return portionBelowLevel * this.#corruptionScoreMults[Math.floor(level)] + 
              portionAboveLevel * this.#corruptionScoreMults[Math.ceil(level)]
    }
    else {
      return this.#corruptionScoreMults[scoreMultLength - 1] * 
              Math.pow(1.2, level - scoreMultLength + 1)
    }
  }

  #viscosityEffect() {
    const base = G['viscosityPower'][this.#levels['viscosity']]
    const multiplier = 1 + player.platonicUpgrades[6]
    return Math.min(base * multiplier, 1)
  }

  #droughtEffect() {
    return G['droughtMultiplier'][this.#levels['drought']]
  }

  #deflationEffect() {
    return G['deflationMultiplier'][this.#levels['deflation']]
  }

  #extinctionEffect() {
    return G['extinctionMultiplier'][this.#levels['extinction']]
  }

  #illiteracyEffect() {
    return G['illiteracyPower'][this.#levels['illiteracy']]
  }

  #recessionEffect() {
    return G['recessionPower'][this.#levels['recession']]
  }

  #dilationEffect() {
    return G['dilationMultiplier'][this.#levels['dilation']]
  }

  #hyperchallengeEffect() {
    return G['hyperchallengeMultiplier'][this.#levels['hyperchallenge']]
  }

  corruptionEffects(corr: keyof Corruptions) {
    switch(corr) {
      case 'deflation': {
        return this.#viscosityEffect()
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

  get totalLevels() {
    return sumContents(Object.values(this.#levels))
  }

  #calcBonusLevels() {
    let bonusLevel = (player.singularityUpgrades.corruptionFifteen.level > 0) ? 1 : 0
    bonusLevel += +player.singularityChallenges.oneChallengeCap.rewards.freeCorruptionLevel
    return bonusLevel
  }

  public scoreMult(corruption: keyof Corruptions) {
    if (corruption !== 'viscosity') {
      return this.multInterpolation(this.#levels[corruption] + this.#bonusLevels)
    }
    else {
      // player.platonicUpgrades[17] is the 17th platonic upgrade, known usually as P4x2, makes
      // Exponent 3 + 0.04 * level if the corr is viscosity and it is set at least level 10.
      const power = (player.platonicUpgrades[17] > 0 && this.#levels['viscosity'] >= 10) ?
      3 + 0.04 * player.platonicUpgrades[17] :
      1
      return Math.pow(this.multInterpolation(this.#levels[corruption] + this.#bonusLevels), power)
     }
  }

  #calcTotalScoreMult() {
    return productContents(Object.keys(this.#levels).map((key) => {
      const corrKey = key as keyof Corruptions 
      return this.scoreMult(corrKey)
    }))
  }

  getLevel(corr: keyof Corruptions) {
    return this.#levels[corr]
  }

  getLoadout() {
    return this.#levels
  }

  getBonusLevel() {
    return this.#bonusLevels
  }

  setLevel(corr: keyof Corruptions, newLevel: number) {
    const oldScore = this.scoreMult(corr)
    this.#levels[corr] = newLevel
    const newScore = this.scoreMult(corr)

    this.#totalScoreMult *= newScore / oldScore
  }

  resetCorruptions() {
    for (const corr in this.#levels) {
      const corrKey = corr as keyof Corruptions
    }
  }

  incrementDecrementLevel(corr: keyof Corruptions, val: number) {
    const level = this.getLevel(corr)
    const minLevel = 0
    const maxLevel = maxCorruptionLevel()

    let newLevel = Math.max(minLevel, Math.min(maxLevel, level + val))
    this.setLevel(corr, newLevel)
  }


  getTotalScore() {
    return this.#totalScoreMult
  }

}

export type SavedCorruption = {
  name: string
  loadout: CorruptionLoadout 
}

export class CorruptionSaves {
  saves: Array<SavedCorruption> = []
  constructor (corrSaveData: Record<string, Partial<Corruptions>>) {
    for (const saveKey of Object.keys(corrSaveData).slice(0,8)) {
      this.saves.push({name: saveKey, loadout: new CorruptionLoadout(corrSaveData[saveKey])})
    }
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
  if (player.singularityUpgrades.platonicTau.getEffect().bonus) {
    max = Math.max(13, max)
  }

  if (player.singularityUpgrades.corruptionFourteen.getEffect().bonus) {
    max += 1
  }
  max += +player.octeractUpgrades.octeractCorruption.getEffect().bonus

  return max
}

const corrIcons: Record<keyof Corruptions, string> = {
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
    spiritContribution: '',
    image: `Pictures/${IconSets[player.iconSet][0]}/CorruptExit.png`
  } satisfies Record<string, string>

  if (corr !== 'exit') {
    text = {
      name: i18next.t(`corruptions.names.${corr}`),
      description: i18next.t(`corruptions.descriptions.${corr}`),
      current: i18next.t(`corruptions.currentLevel.${corr}`, {level: player.corruptions.used.getLevel(corr), effect: player.corruptions.used.corruptionEffects(corr)}),
      planned: i18next.t(`corruptions.prototypeLevel.${corr}`, {level: player.corruptions.prototype.getLevel(corr), effect: player.corruptions.prototype.corruptionEffects(corr)}),
      multiplier: i18next.t(`corruptions.scoreMultiplier`, {curr: player.corruptions.used.scoreMult(corr), next: player.corruptions.prototype.scoreMult(corr)}),
      spiritContribution: i18next.t(`corruptions.spiritEffect`, {curr: 1, next: 1}),
      image: `Pictures/${IconSets[player.iconSet][0]}${corrIcons[corr]}`
    }
  }

  DOMCacheGetOrSet('corruptionName').textContent = text.name
  DOMCacheGetOrSet('corruptionDescription').textContent = text.description
  DOMCacheGetOrSet('corruptionLevelCurrent').textContent = text.current
  DOMCacheGetOrSet('corruptionLevelPlanned').textContent = text.planned
  DOMCacheGetOrSet('corruptionMultiplierContribution').textContent = text.multiplier
  DOMCacheGetOrSet('corruptionSpiritContribution').textContent = text.spiritContribution
  DOMCacheGetOrSet('corruptionSelectedPic').setAttribute('src', text.image)

  if (corr !== 'exit') {
    DOMCacheGetOrSet(`corrCurrent${corr}`).textContent = format(player.corruptions.used.getLevel(corr))
    DOMCacheGetOrSet(`corrNext${corr}`).textContent = format(player.corruptions.prototype.getLevel(corr))
  }
}

export const corruptionStatsUpdate = () => {

  for (const corr in player.corruptions.used) {
    const corrKey = corr as keyof Corruptions
    // https://discord.com/channels/677271830838640680/706329553639047241/841749032841379901
    const a = DOMCacheGetOrSet(`corrCurrent${corrKey}`)
    const b = DOMCacheGetOrSet(`corrNext${corrKey}`)
    a.textContent = format(player.corruptions.used.getLevel(corrKey))
    b.textContent = format(player.corruptions.prototype.getLevel(corrKey))
  }
  
}

export const corruptionButtonsAdd = () => {
  const rows = document.getElementsByClassName('corruptionStatRow')
  const keys = Object.keys(player.corruptions.used.getLoadout())

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const key = keys[i] as keyof Corruptions

    // Delete rows that already exist
    for (let i = row.children.length - 1; i >= 1; i--) {
      row.children[i].remove()
    }

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
    span.textContent = `${player.corruptions.prototype.getLevel(key)}`
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
  const corrCount = 8
  const table = getElementById<HTMLTableElement>('corruptionLoadoutTable')

  // Delete rows that already exist
  for (let i = table.rows.length - 1; i >= 1; i--) {
    table.deleteRow(i)
  }

  for (let i = 0; i < Object.keys(player.corruptionLoadouts).length + 1; i++) {
    const row = table.insertRow()
    for (let j = 0; j <= corrCount; j++) {
      const cell = row.insertCell()
      cell.className = `test${j}`
      if (j === 0) { // First column
        if (i === 0) { // First row
          cell.textContent = i18next.t('corruptions.loadoutTable.next')
          cell.addEventListener('click', () => void corruptionLoadoutGetExport())
          cell.classList.add('corrLoadoutName')
          cell.title = i18next.t('corruptions.loadoutTable.firstRowTitle')
        } else {
          // Custom loadout names are loaded later, via updateCorruptionLoadoutNames()
          cell.title = i18next.t('corruptions.loadoutTable.otherRowTitle', { value: i })
        }
      } else if (j <= corrCount) {
        if (i === 0) { // Next Ascension Corruption values
          cell.textContent = player.prototypeCorruptions[j + 1].toString()
        } else { // Loadout Corruption values
          cell.textContent = player.corruptionLoadouts[i][j + 1].toString()
        }
      }
    }
    if (i === 0) {
      // First line is special : "Import" and "Zero" buttons
      let cell = row.insertCell()
      let btn: HTMLButtonElement = document.createElement('button')
      btn.className = 'corrImport'
      btn.textContent = i18next.t('corruptions.loadoutTable.import')
      btn.addEventListener('click', () => void importCorruptionsPrompt())
      cell.appendChild(btn)
      cell.title = i18next.t('corruptions.importLoadoutInTextFormat')

      cell = row.insertCell()
      btn = document.createElement('button')
      btn.className = 'corrLoad'
      btn.textContent = i18next.t('corruptions.loadoutTable.zero')
      btn.addEventListener('click', () => corruptionLoadoutSaveLoad(false, i))
      cell.appendChild(btn)
      cell.title = i18next.t('corruptions.loadoutTable.zeroTitle')
    } else {
      let cell = row.insertCell()
      let btn = document.createElement('button')
      btn.className = 'corrSave'
      btn.textContent = i18next.t('corruptions.loadoutTable.save')
      btn.addEventListener('click', () => corruptionLoadoutSaveLoad(true, i))
      cell.appendChild(btn)
      cell.title = i18next.t('corruptions.loadoutTable.saveTitle')

      cell = row.insertCell()
      btn = document.createElement('button')
      btn.className = 'corrLoad'
      btn.textContent = i18next.t('corruptions.loadoutTable.load')
      btn.addEventListener('click', () => corruptionLoadoutSaveLoad(false, i))
      cell.appendChild(btn)
    }
  }
}

export const corruptionLoadoutTableUpdate = (updateRow = 0) => {
  const row = getElementById<HTMLTableElement>('corruptionLoadoutTable').rows[updateRow + 1].cells
  for (let i = 1; i < row.length; i++) {
    if (i > 8) {
      break
    }
    row[i].textContent =
      ((updateRow === 0) ? player.prototypeCorruptions[i + 1] : player.corruptionLoadouts[updateRow][i + 1]).toString()
  }
}

export const corruptionLoadoutSaveLoad = (save = true, loadout = 1) => {
  if (save) {
    player.corruptionLoadouts[loadout] = Array.from(player.prototypeCorruptions)
    corruptionLoadoutTableUpdate(loadout)
  } else {
    if (loadout === 0) {
      player.prototypeCorruptions = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    } else {
      player.prototypeCorruptions = Array.from(player.corruptionLoadouts[loadout])
    }
    corruptionLoadoutTableUpdate()
    corruptionStatsUpdate()
  }
}

export const applyCorruptions = (corruptions: string) => {
  if (corruptions.includes('/') && corruptions.split('/').length === 13) {
    // Converts the '/' separated string into a number[]
    const newCorruptions = corruptions.split('/').map((corr) => Number(corr))

    for (const value of newCorruptions) {
      if (
        !Number.isInteger(value)
        || Number.isNaN(value)
        || value < 0
        || value > maxCorruptionLevel()
      ) {
        return false
      }
    }

    player.prototypeCorruptions = newCorruptions
    corruptionLoadoutTableUpdate()
    corruptionStatsUpdate()
    return true
  }

  return false
}

async function importCorruptionsPrompt () {
  const input = await Prompt(i18next.t('corruptions.importCorruptionsPrompt.import'))

  if (!applyCorruptions(`0/0/${input}/0/0/0`)) {
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
    player.corruptionLoadoutNames[loadout] = renamePrompt
    updateCorruptionLoadoutNames()
    if (renamePrompt === 'crazy') {
      return Alert(i18next.t('corruptions.loadoutPrompt.errors.crazyJoke'))
    }
  }
}

export const updateCorruptionLoadoutNames = () => {
  const rows = getElementById<HTMLTableElement>('corruptionLoadoutTable').rows
  for (let i = 0; i < Object.keys(player.corruptionLoadouts).length; i++) {
    const cells = rows[i + 2].cells // start changes on 2nd row
    if (cells[0].textContent!.length === 0) { // first time setup
      cells[0].addEventListener('click', () => void corruptionLoadoutGetNewName(i)) // get name function handles -1 for array
      cells[0].classList.add('corrLoadoutName')
    }
    cells[0].textContent = `${player.corruptionLoadoutNames[i]}:`
  }
}

const corruptionLoadoutGetExport = async () => {
  const str = player.prototypeCorruptions.slice(2, 10).join('/')
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

  if (player.challengecompletions[11] > 0 || player.singularityUpgrades.platonicTau.getEffect().bonus) {
    for (let i = 0; i < c11Unlocks.length; i++) {
      c11Unlocks[i].style.display = 'flex'
    }
  }
  if (player.challengecompletions[12] > 0 || player.singularityUpgrades.platonicTau.getEffect().bonus) {
    for (let i = 0; i < c12Unlocks.length; i++) {
      c12Unlocks[i].style.display = 'flex'
    }
  }
  if (player.challengecompletions[13] > 0 || player.singularityUpgrades.platonicTau.getEffect().bonus) {
    for (let i = 0; i < c13Unlocks.length; i++) {
      c13Unlocks[i].style.display = 'flex'
    }
  }
  if (player.challengecompletions[14] > 0 || player.singularityUpgrades.platonicTau.getEffect().bonus) {
    for (let i = 0; i < c14Unlocks.length; i++) {
      c14Unlocks[i].style.display = 'flex'
    }
  }
}

export function corrChallengeMinimum (index: number): number {
  switch (index) {
    case 2:
      return 11
    case 3:
      return 14
    case 4:
      return 14
    case 5:
      return 13
    case 6:
      return 12
    case 7:
      return 12
    case 8:
      return 11
    case 9:
      return 13
    default:
      return 0
  }
}
