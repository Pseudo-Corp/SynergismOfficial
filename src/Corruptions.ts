import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { getOcteractUpgradeEffect } from './Octeracts'
import { PCoinUpgradeEffects } from './PseudoCoinUpgrades'
import { getRuneEffects } from './Runes'
import { getGQUpgradeEffect } from './singularity'
import { getSingularityChallengeEffect } from './SingularityChallenges'
import { format, player } from './Synergism'
import { getTalismanEffects } from './Talismans'
import { IconSets } from './Themes'
import { Alert, MEDIUM_MODAL_UPDATE_TICK, Modal, Notification, Prompt } from './UpdateHTML'
import { assert, getElementById, isMobile, validateNonnegativeInteger } from './Utility'
import { Globals as G } from './Variables'

enum CorruptionIndices {
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

export type CorruptionTier = 0 | 1 | 2 | 3 | 4

type ActiveCorruptionTier = Exclude<CorruptionTier, 0>

export type CorruptionTierState = {
  tier: CorruptionTier
  level: number
}

export type CorruptionPreset = CorruptionTierState & {
  name: string
}

export type CorruptionCubeType = 'cubes' | 'tesseracts' | 'hypercubes' | 'platonics' | 'hepteracts' | 'octeracts'

type CorruptionTierData = {
  unlockChallenge: number
  levelCap: number
  anchorLevel: number
  anchorIntensity: number
  anchorScore: number
  scoreExponent: number
}

type CorruptionCubeUnlock = {
  tier: CorruptionTier
  level: number
  requiresChallenge15: boolean
}

const BASE_CORRUPTION_PRESET_COUNT = 8
const MAX_CORRUPTION_PRESET_COUNT = 16

export const getUnlockedCorruptionPresetCount = () => {
  const presetCount = BASE_CORRUPTION_PRESET_COUNT + PCoinUpgradeEffects.CORRUPTION_LOADOUT_SLOT_QOL
  assert(presetCount <= MAX_CORRUPTION_PRESET_COUNT, 'Corruption preset count exceeds the supported maximum.')
  return presetCount
}

export const isCorruptionPresetUnlocked = (presetNum: number) => {
  return Number.isInteger(presetNum) && presetNum >= 0 && presetNum < getUnlockedCorruptionPresetCount()
}

export const createDefaultCorruptionPresets = (): CorruptionPreset[] => {
  return Array.from({ length: MAX_CORRUPTION_PRESET_COUNT }, (_, index) => ({
    name: `Preset ${index + 1}`,
    tier: 0,
    level: 0
  }))
}

export const c15CorruptionState: CorruptionTierState = { tier: 4, level: 100 }

export const corruptionTierList: CorruptionTier[] = [0, 1, 2, 3, 4]

const corruptionTiers: Record<ActiveCorruptionTier, CorruptionTierData> = {
  1: { unlockChallenge: 11, levelCap: 20, anchorLevel: 20, anchorIntensity: 5, anchorScore: 49, scoreExponent: 2 },
  2: { unlockChallenge: 12, levelCap: 40, anchorLevel: 40, anchorIntensity: 7, anchorScore: 5220, scoreExponent: 2.75 },
  3: { unlockChallenge: 13, levelCap: 75, anchorLevel: 70, anchorIntensity: 9, anchorScore: 1e6, scoreExponent: 3.5 },
  4: {
    unlockChallenge: 14,
    levelCap: Number.POSITIVE_INFINITY,
    anchorLevel: 100,
    anchorIntensity: 11,
    anchorScore: 3.06e8,
    scoreExponent: 4.25
  }
}

export const corruptionUnlockTier: Record<keyof Corruptions, ActiveCorruptionTier> = {
  viscosity: 1,
  drought: 1,
  deflation: 2,
  extinction: 2,
  illiteracy: 3,
  recession: 3,
  dilation: 4,
  hyperchallenge: 4
}

export const corruptionKeys = Object.keys(corruptionUnlockTier) as Array<keyof Corruptions>

const corruptionCubeUnlocks: Record<CorruptionCubeType, CorruptionCubeUnlock> = {
  cubes: { tier: 0, level: 0, requiresChallenge15: false },
  tesseracts: { tier: 0, level: 0, requiresChallenge15: false },
  hypercubes: { tier: 3, level: 0, requiresChallenge15: false },
  platonics: { tier: 4, level: 0, requiresChallenge15: false },
  hepteracts: { tier: 4, level: 100, requiresChallenge15: true },
  octeracts: { tier: 4, level: 150, requiresChallenge15: false }
}

const levelsPerIntensityPastFinalAnchor = 25
const goldenRatio = (1 + Math.sqrt(5)) / 2

const corruptionIntensityEffects: Record<keyof Corruptions, (intensity: number) => number> = {
  viscosity: (e) => e >= 15.6 ? 0 : Math.pow(1 - e / 15.6, 4 / 3),
  drought: (e) => 0 - 10 * e * e,
  deflation: (e) => e >= 15 ? 0 : Math.pow(10, -0.2 * e * e),
  extinction: (e) => 1 + e * e / (e + 2.5),
  illiteracy: (e) => Math.pow(2, -e / 5),
  recession: (e) => Math.pow(0.81, e),
  dilation: (e) => Math.max(1e-300, Math.pow(10, -0.2 * e * e)),
  hyperchallenge: (e) => (1 + Math.pow(goldenRatio, e)) / 2
}

const previousCorruptionTier = (tier: ActiveCorruptionTier) => (tier - 1) as ActiveCorruptionTier

const adjustCorruptionEffect = (corr: keyof Corruptions, base: number) => {
  switch (corr) {
    case 'viscosity':
      return Math.min(base * (1 + player.platonicUpgrades[6] / 30), 1)
    case 'drought':
      return player.platonicUpgrades[13] > 0 ? base * 0.5 : base
    case 'illiteracy': {
      const multiplier = player.obtainium.gte(G.dOne)
        ? 1 + (1 / 100) * player.platonicUpgrades[9] * Math.min(100, Decimal.log10(player.obtainium))
        : 1
      return Math.min(base * multiplier, 1)
    }
    case 'hyperchallenge':
      return Math.max(1, base / (1 + 2 / 5 * player.platonicUpgrades[8]))
    default:
      return base
  }
}

export const isCorruptionTierUnlocked = (tier: CorruptionTier) => {
  return tier === 0
    || player.challengecompletions[corruptionTiers[tier].unlockChallenge] > 0
    || getGQUpgradeEffect('platonicTau', 'unlocked')
}

export const corruptionLevelCap = (tier: CorruptionTier) => {
  return tier === 0 ? 0 : corruptionTiers[tier].levelCap
}

export const normalizeCorruptionTierState = (state: CorruptionTierState): CorruptionTierState => {
  let tier = state.tier
  while (!isCorruptionTierUnlocked(tier)) {
    tier = (tier - 1) as CorruptionTier
  }

  const level = tier !== 0 && validateNonnegativeInteger(state.level)
    ? Math.min(Math.max(0, state.level), corruptionLevelCap(tier))
    : 0

  return { tier, level }
}

export const compareCorruptionTierStates = (a: CorruptionTierState, b: CorruptionTierState) => {
  return a.tier === b.tier ? a.level - b.level : a.tier - b.tier
}

export const isCorruptionTierStateAtLeast = (state: CorruptionTierState, tier: CorruptionTier, level: number) => {
  return state.tier > tier || (state.tier === tier && state.level >= level)
}

export const corruptionTierFreeLevels = (tier: ActiveCorruptionTier) => {
  let freeLevels = 2 * getGQUpgradeEffect('corruptionFifteen', 'freeCorruptionLevel')
  freeLevels += 3 * getSingularityChallengeEffect('oneChallengeCap', 'freeCorruptionLevel')
  freeLevels += 20 * getTalismanEffects('cookieGrandma').freeCorruptionLevel
  freeLevels += getRuneEffects('finiteDescent', 'corruptionFreeLevels') / 0.15
  freeLevels += getGQUpgradeEffect('corruptionFourteen', 'unlocked') ? 1 : 0
  freeLevels += getOcteractUpgradeEffect('octeractCorruption', 'corruptionLevelCapIncrease')
  freeLevels += player.platonicUpgrades[5] > 0 ? 1 : 0
  freeLevels += player.platonicUpgrades[10] > 0 ? 1 : 0
  freeLevels += getGQUpgradeEffect('advancedPack', 'corruptionScoreIncrease') > 0 ? 0.5 * tier : 0
  freeLevels += getSingularityChallengeEffect('oneChallengeCap', 'corrScoreIncrease') * tier
  freeLevels += 0.5 * tier * player.cubeUpgrades[74]
  return freeLevels
}

export const corruptionFreeLevels = (state: CorruptionTierState) => {
  return state.tier === 0 ? 0 : corruptionTierFreeLevels(state.tier)
}

export const effectiveCorruptionLevel = (state: CorruptionTierState) => {
  return state.level + corruptionFreeLevels(state)
}

export const corruptionIntensity = (state: CorruptionTierState, corr: keyof Corruptions): number => {
  const unlockTier = corruptionUnlockTier[corr]
  if (state.tier === 0 || state.tier < unlockTier) {
    return 0
  }

  const tierData = corruptionTiers[state.tier]
  if (state.level > tierData.anchorLevel && !Number.isFinite(tierData.levelCap)) {
    return tierData.anchorIntensity + (state.level - tierData.anchorLevel) / levelsPerIntensityPastFinalAnchor
  }

  if (state.tier === unlockTier) {
    return tierData.anchorIntensity * state.level / tierData.anchorLevel
  }

  const previousTier = previousCorruptionTier(state.tier)
  const start = corruptionIntensity({ tier: previousTier, level: corruptionTiers[previousTier].levelCap }, corr)
  return start + (tierData.anchorIntensity - start) * state.level / tierData.anchorLevel
}

export const corruptionTierEffect = (state: CorruptionTierState, corr: keyof Corruptions) => {
  return adjustCorruptionEffect(corr, corruptionIntensityEffects[corr](corruptionIntensity(state, corr)))
}

const baseCorruptionTierScore = (tier: ActiveCorruptionTier, level: number): number => {
  const tierData = corruptionTiers[tier]
  let floor = 1
  if (tier !== 1) {
    const previousTier = previousCorruptionTier(tier)
    floor = baseCorruptionTierScore(previousTier, corruptionTiers[previousTier].levelCap)
  }
  return floor + (tierData.anchorScore - floor) * Math.pow(level / tierData.anchorLevel, tierData.scoreExponent)
}

export const corruptionTierScoreMultiplier = (state: CorruptionTierState) => {
  if (state.tier === 0) {
    return 1
  }

  const score = baseCorruptionTierScore(state.tier, effectiveCorruptionLevel(state))
  return state.tier === 4 ? Math.pow(score, 1 + 0.0175 * player.platonicUpgrades[17]) : score
}

export const corruptionCubeScoreMultiplier = (state: CorruptionTierState) => {
  if (state.tier !== 4) {
    return 1
  }

  const level = effectiveCorruptionLevel(state)
  const growth = Math.min(2500, Math.pow(1.12, Math.max(0, level - 150)))
  const dip = 1 - 0.35 * Math.max(0, 1 - Math.abs(level - 150) / 50)
  return growth * dip
}

export const corruptionTierSpiritMultiplier = (state: CorruptionTierState) => {
  if (state.tier === 0) {
    return 1
  }

  const effectiveState = { tier: state.tier, level: effectiveCorruptionLevel(state) }
  return 1
    + 0.04 * corruptionKeys.reduce((sum, corr) => sum + Math.pow(corruptionIntensity(effectiveState, corr), 2), 0)
}

export const corruptionTotalLevels = (state: CorruptionTierState) => {
  return state.tier * state.level / 4
}

export const isCorruptionCubeUnlocked = (state: CorruptionTierState, cube: CorruptionCubeType) => {
  const unlock = corruptionCubeUnlocks[cube]
  if (state.tier < unlock.tier) {
    return false
  }

  if (unlock.level > 0 && effectiveCorruptionLevel(state) < unlock.level) {
    return false
  }

  return !unlock.requiresChallenge15 || G.challenge15Rewards.hepteractsUnlocked.value > 0
}

export const setNextCorruptions = (state: CorruptionTierState) => {
  player.corruptions.next = normalizeCorruptionTierState(state)
  corruptionStatsUpdate()
  corruptionPresetTableUpdate()
}

export const setNextCorruptionTier = (tier: CorruptionTier) => {
  setNextCorruptions({ tier, level: player.corruptions.next.level })
}

export const setNextCorruptionLevel = (level: number) => {
  setNextCorruptions({ tier: player.corruptions.next.tier, level: Math.floor(level) })
}

export const changeNextCorruptionLevel = (delta: number) => {
  setNextCorruptionLevel(Math.max(0, player.corruptions.next.level + delta))
}

export const maxNextCorruptionLevel = () => {
  const cap = corruptionLevelCap(player.corruptions.next.tier)
  if (Number.isFinite(cap)) {
    setNextCorruptionLevel(cap)
  }
}

export const resetNextCorruptions = () => {
  setNextCorruptions({ tier: 0, level: 0 })
}

export const cleanseCorruptions = () => {
  if (player.currentChallenge.ascension === 15) {
    void Notification(i18next.t('corruptions.resetCorruptionsError'))
    return
  }

  player.corruptions.used = { tier: 0, level: 0 }
  resetNextCorruptions()
  corruptionDisplay('exit')
  DOMCacheGetOrSet('corruptionCleanseConfirm').style.visibility = 'hidden'
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

const corruptionDisplayDetails = (corr: keyof Corruptions | 'exit') => {
  if (corr === 'exit') {
    return {
      name: i18next.t('corruptions.exitCorruption.name'),
      description: i18next.t('corruptions.exitCorruption.description'),
      current: i18next.t('corruptions.exitCorruption.current'),
      planned: i18next.t('corruptions.exitCorruption.planned'),
      note: i18next.t('corruptions.exitCorruption.multiplier'),
      freeLevels: '',
      image: `Pictures/${IconSets[player.iconSet][0]}/CorruptExit.png`
    }
  }

  return {
    name: i18next.t(`corruptions.names.${corr}`),
    description: i18next.t(`corruptions.descriptions.${corr}`),
    current: i18next.t(`corruptions.currentLevel.${corr}`, {
      intensity: format(corruptionIntensity(player.corruptions.used, corr), 2, true),
      effect: format(corruptionTierEffect(player.corruptions.used, corr), 3, true)
    }),
    planned: i18next.t(`corruptions.prototypeLevel.${corr}`, {
      intensity: format(corruptionIntensity(player.corruptions.next, corr), 2, true),
      effect: format(corruptionTierEffect(player.corruptions.next, corr), 3, true)
    }),
    note: '',
    freeLevels: i18next.t('corruptions.freeLevels', {
      curr: format(corruptionFreeLevels(player.corruptions.used), 2, true)
    }),
    image: `Pictures/${IconSets[player.iconSet][0]}${corrIcons[corr]}`
  }
}

const corruptionDetailsModalHTML = (corr: keyof Corruptions | 'exit') => {
  const text = corruptionDisplayDetails(corr)

  return `<div class="corruptionDetailsModal" data-modal-preserve="children">
    <div class="corruptionDetailsModalTitle" data-modal-preserve="children">
      <img src="${text.image}" alt="" class="corruptionImg" data-modal-preserve="children">
      <span>${text.name}</span>
    </div>
    <div class="corruptionDetailsModalDescription">${text.description}</div>
    <div class="corruptionDetailsModalCurrent">${text.current}</div>
    <div class="corruptionDetailsModalPlanned">${text.planned}</div>
    ${text.freeLevels ? `<div class="corruptionDetailsModalFree">${text.freeLevels}</div>` : ''}
    ${text.note ? `<div class="corruptionDetailsModalMultiplier">${text.note}</div>` : ''}
  </div>`
}

export const corruptionDisplay = (corr: keyof Corruptions | 'exit') => {
  if (DOMCacheGetOrSet('corruptionDetails').style.visibility !== 'visible') {
    DOMCacheGetOrSet('corruptionDetails').style.visibility = 'visible'
  }
  if (DOMCacheGetOrSet('corruptionSelectedPic').style.visibility !== 'visible') {
    DOMCacheGetOrSet('corruptionSelectedPic').style.visibility = 'visible'
  }

  const text = corruptionDisplayDetails(corr)

  DOMCacheGetOrSet('corruptionName').textContent = text.name
  DOMCacheGetOrSet('corruptionDescription').innerHTML = text.description
  DOMCacheGetOrSet('corruptionLevelCurrent').textContent = text.current
  DOMCacheGetOrSet('corruptionLevelPlanned').textContent = text.planned
  DOMCacheGetOrSet('corruptionMultiplierContribution').textContent = text.note
  DOMCacheGetOrSet('corruptionFreeLevels').textContent = text.freeLevels
  DOMCacheGetOrSet('corruptionSelectedPic').setAttribute('src', text.image)
}

export const openCorruptionDetailsModal = (
  corr: keyof Corruptions | 'exit',
  event: MouseEvent,
  targetElement: HTMLElement
) => {
  corruptionDisplay(corr)
  Modal(
    () => corruptionDetailsModalHTML(corr),
    event.clientX,
    event.clientY,
    { borderColor: 'var(--crimson-text-color)' },
    MEDIUM_MODAL_UPDATE_TICK,
    targetElement
  )
}

export const corruptionStatsUpdate = () => {
  for (const tier of corruptionTierList) {
    DOMCacheGetOrSet(`corruptionTier${tier}`).classList.toggle('selected', tier === player.corruptions.next.tier)
  }

  DOMCacheGetOrSet('corruptionTierCurrent').textContent = i18next.t('corruptions.tiers.current', {
    tier: player.corruptions.used.tier,
    level: format(player.corruptions.used.level)
  })
  DOMCacheGetOrSet('corruptionTierNext').textContent = i18next.t('corruptions.tiers.next', {
    tier: player.corruptions.next.tier,
    level: format(player.corruptions.next.level)
  })

  const levelInput = getElementById<HTMLInputElement>('corruptionLevelInput')
  levelInput.value = `${player.corruptions.next.level}`
  levelInput.disabled = player.corruptions.next.tier === 0
  DOMCacheGetOrSet('corruptionLevelMax').style.display = Number.isFinite(
      corruptionLevelCap(player.corruptions.next.tier)
    )
    ? ''
    : 'none'

  for (const corr of corruptionKeys) {
    DOMCacheGetOrSet(`corrCurrent${corr}`).textContent = format(
      corruptionIntensity(player.corruptions.used, corr),
      2,
      true
    )
    DOMCacheGetOrSet(`corrNext${corr}`).textContent = format(
      corruptionIntensity(player.corruptions.next, corr),
      2,
      true
    )
  }
}

export const corruptionButtonsAdd = () => {
  const tierSelect = DOMCacheGetOrSet('corruptionTierSelect')
  tierSelect.replaceChildren()

  for (const tier of corruptionTierList) {
    const btn = document.createElement('button')
    btn.id = `corruptionTier${tier}`
    btn.className = 'corrTierBtn'
    btn.textContent = i18next.t('corruptions.tiers.button', { tier })
    btn.addEventListener('click', () => setNextCorruptionTier(tier))
    tierSelect.appendChild(btn)
  }

  const rows = document.getElementsByClassName('corruptionStatRow') as HTMLCollectionOf<HTMLElement>

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const key = corruptionKeys[i]
    row.replaceChildren()

    const icon = document.createElement('img')
    icon.className = 'corruptionImg'
    icon.src = `Pictures/${IconSets[player.iconSet][0]}${corrIcons[key]}`
    icon.loading = 'lazy'
    icon.title = i18next.t(`corruptions.names.${key}`)
    row.appendChild(icon)

    const p = document.createElement('p')
    p.className = 'corrDesc'
    p.appendChild(document.createTextNode(i18next.t('corruptions.current')))

    let span = document.createElement('span')
    span.id = `corrCurrent${key}`
    p.appendChild(span)

    p.appendChild(document.createTextNode(i18next.t('corruptions.next')))

    span = document.createElement('span')
    span.id = `corrNext${key}`
    p.appendChild(span)
    row.appendChild(p)

    row.addEventListener('click', (event) => {
      if (isMobile) {
        openCorruptionDetailsModal(key, event, row)
        return
      }

      corruptionDisplay(key)
    })
  }

  corruptionStatsUpdate()
}

export const corruptionPresetTableCreate = () => {
  const table = getElementById<HTMLTableElement>('corruptionLoadoutTable')

  for (let i = table.rows.length - 1; i >= 1; i--) {
    table.deleteRow(i)
  }

  const nextRow = table.insertRow()
  const nextCell = nextRow.insertCell()
  nextCell.className = 'testTitle'
  nextCell.textContent = i18next.t('corruptions.loadoutTable.next')
  nextRow.insertCell()
  nextRow.insertCell()

  const zeroCell = nextRow.insertCell()
  zeroCell.colSpan = 2
  const zeroBtn = document.createElement('button')
  zeroBtn.className = 'corrLoad'
  zeroBtn.textContent = i18next.t('corruptions.loadoutTable.zero')
  zeroBtn.addEventListener('click', () => resetNextCorruptions())
  zeroCell.appendChild(zeroBtn)
  zeroCell.title = i18next.t('corruptions.loadoutTable.zeroTitle')

  for (let i = 0; i < getUnlockedCorruptionPresetCount(); i++) {
    const row = table.insertRow()

    const titleCell = row.insertCell()
    titleCell.className = 'testTitle corrLoadoutName'
    titleCell.title = i18next.t('corruptions.loadoutTable.otherRowTitle', { value: i + 1 })
    titleCell.addEventListener('click', () => void corruptionPresetGetNewName(i))

    row.insertCell()
    row.insertCell()

    let cell = row.insertCell()
    let btn = document.createElement('button')
    btn.className = 'corrSave'
    btn.textContent = i18next.t('corruptions.loadoutTable.save')
    btn.addEventListener('click', () => saveCorruptionPreset(i))
    cell.appendChild(btn)
    cell.title = i18next.t('corruptions.loadoutTable.saveTitle')

    cell = row.insertCell()
    btn = document.createElement('button')
    btn.className = 'corrLoad'
    btn.textContent = i18next.t('corruptions.loadoutTable.load')
    btn.addEventListener('click', () => loadCorruptionPreset(i))
    cell.appendChild(btn)
  }

  corruptionPresetTableUpdate()
}

export const corruptionPresetTableUpdate = () => {
  const rows = getElementById<HTMLTableElement>('corruptionLoadoutTable').rows
  if (rows.length < 2) {
    return
  }

  rows[1].cells[1].textContent = `${player.corruptions.next.tier}`
  rows[1].cells[2].textContent = format(player.corruptions.next.level)

  for (let i = 0; i < getUnlockedCorruptionPresetCount() && i + 2 < rows.length; i++) {
    const cells = rows[i + 2].cells
    cells[0].textContent = `${player.corruptions.presets[i].name}:`
    cells[1].textContent = `${player.corruptions.presets[i].tier}`
    cells[2].textContent = format(player.corruptions.presets[i].level)
  }
}

const saveCorruptionPreset = (presetNum: number) => {
  if (!isCorruptionPresetUnlocked(presetNum)) {
    return
  }

  player.corruptions.presets[presetNum] = {
    name: player.corruptions.presets[presetNum].name,
    tier: player.corruptions.next.tier,
    level: player.corruptions.next.level
  }
  corruptionPresetTableUpdate()
}

export const loadCorruptionPreset = (presetNum: number) => {
  if (!isCorruptionPresetUnlocked(presetNum)) {
    return
  }

  setNextCorruptions(player.corruptions.presets[presetNum])
}

async function corruptionPresetGetNewName (presetNum: number) {
  if (!isCorruptionPresetUnlocked(presetNum)) {
    return
  }

  const maxChars = 9
  // eslint-disable-next-line no-control-regex
  const regex = /^[\x00-\xFF]*$/
  const renamePrompt = await Prompt(
    i18next.t('corruptions.corruptionLoadoutName.loadoutPrompt', { loadNum: presetNum + 1, maxChars })
  )

  if (!renamePrompt) {
    return Alert(i18next.t('corruptions.corruptionLoadoutName.errors.noName'))
  } else if (renamePrompt.length > maxChars) {
    return Alert(i18next.t('corruptions.corruptionLoadoutName.errors.exceedsCharacterLimit'))
  } else if (!regex.test(renamePrompt)) {
    return Alert(i18next.t('corruptions.corruptionLoadoutName.errors.regexError'))
  } else {
    player.corruptions.presets[presetNum].name = renamePrompt
    corruptionPresetTableUpdate()
    if (renamePrompt === 'crazy') {
      return Alert(i18next.t('corruptions.corruptionLoadoutName.errors.crazyJoke'))
    }
  }
}

export const corruptionCleanseConfirm = () => {
  const corrupt = DOMCacheGetOrSet('corruptionCleanseConfirm')
  corrupt.style.visibility = 'visible'
  setTimeout(() => corrupt.style.visibility = 'hidden', 10000)
}

export const revealCorruptions = () => {
  const rows = document.getElementsByClassName('corruptionStatRow') as HTMLCollectionOf<HTMLElement>
  for (let i = 0; i < rows.length; i++) {
    rows[i].style.display = isCorruptionTierUnlocked(corruptionUnlockTier[corruptionKeys[i]]) ? 'flex' : 'none'
  }

  for (const tier of corruptionTierList) {
    DOMCacheGetOrSet(`corruptionTier${tier}`).style.display = isCorruptionTierUnlocked(tier) ? '' : 'none'
  }
}
