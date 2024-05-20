import type { DecimalSource } from 'break_infinity.js'
import Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { antSacrificePointsToMultiplier } from './Ants'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { applyCorruptions } from './Corruptions'
import { Synergism } from './Events'
import { format, formatTimeShort, player } from './Synergism'
import { IconSets } from './Themes'
import { Notification } from './UpdateHTML'
import { Globals as G } from './Variables'

// The categories are the different tables & storages for each type.
export type Category = 'ants' | 'reset' | 'ascend' | 'singularity'
// The kinds are the different contents.
export type Kind = 'antsacrifice' | 'prestige' | 'transcend' | 'reincarnate' | 'ascend' | 'singularity'

// Common to every kind
interface ResetHistoryEntryBase {
  date: number
  seconds: number
  kind: Kind
}

export type ResetHistoryEntryAntSacrifice = ResetHistoryEntryBase & {
  antSacrificePointsAfter: number
  antSacrificePointsBefore: number
  baseELO: number
  crumbs: string
  crumbsPerSecond: string
  effectiveELO: number
  obtainium: number
  offerings: number
  kind: 'antsacrifice'
}

export type ResetHistoryEntryPrestige = ResetHistoryEntryBase & {
  offerings: number
  diamonds: string
  kind: 'prestige'
}
export type ResetHistoryEntryTranscend = ResetHistoryEntryBase & {
  offerings: number
  mythos: string
  kind: 'transcend'
}
export type ResetHistoryEntryReincarnate = ResetHistoryEntryBase & {
  offerings: number
  particles: string
  obtainium: number
  kind: 'reincarnate'
}

export type ResetHistoryEntryAscend = ResetHistoryEntryBase & {
  c10Completions: number
  usedCorruptions: number[]
  corruptionScore: number
  wowCubes: number
  wowTesseracts: number
  wowHypercubes: number
  wowPlatonicCubes: number
  wowHepteracts: number
  currentChallenge?: number
  kind: 'ascend'
}

export interface ResetHistoryEntrySingularity extends ResetHistoryEntryBase {
  singularityCount: number
  quarks: number
  goldenQuarks: number
  wowTribs: number
  tessTribs: number
  hyperTribs: number
  platTribs: number
  octeracts: number
  c15Score: number
  quarkHept: number
  kind: 'singularity'
}

// The set of common fields (in practice this is equal to the Base).
export type ResetHistoryEntryUnion =
  | ResetHistoryEntryAntSacrifice
  | ResetHistoryEntryPrestige
  | ResetHistoryEntryTranscend
  | ResetHistoryEntryReincarnate
  | ResetHistoryEntryAscend
  | ResetHistoryEntrySingularity

// The intersection of all of these types is invalid ("never") because of the conflicting `kind` field declarations.
// Luckily, we can filter the more specific `kind` fields and still end up with a valid type declaration by using
// the `kind` field from the base.
// Fun fact: This exact field name also happens to be the example in the TypeScript documentation.
type RemoveKindField<T> = {
  [K in keyof T as Exclude<K, 'kind'>]: T[K]
}

// The intersection of all possible fields we can possibly find in a history row. We'll keep the kind field from the
// base, which is a simple string.
type ResetHistoryEntryIntersect =
  & ResetHistoryEntryBase
  & Partial<RemoveKindField<ResetHistoryEntryAntSacrifice>>
  & Partial<RemoveKindField<ResetHistoryEntryPrestige>>
  & Partial<RemoveKindField<ResetHistoryEntryTranscend>>
  & Partial<RemoveKindField<ResetHistoryEntryReincarnate>>
  & Partial<RemoveKindField<ResetHistoryEntryAscend>>
  & Partial<RemoveKindField<ResetHistoryEntrySingularity>>

// The subset of keys that we'll directly print out using generic code.
export type ResetHistoryGainType = keyof Pick<
  ResetHistoryEntryIntersect,
  | 'offerings'
  | 'obtainium'
  | 'particles'
  | 'diamonds'
  | 'mythos'
  | 'wowCubes'
  | 'wowTesseracts'
  | 'wowHypercubes'
  | 'wowPlatonicCubes'
  | 'wowHepteracts'
  | 'singularityCount'
  | 'quarks'
  | 'goldenQuarks'
  | 'wowTribs'
  | 'tessTribs'
  | 'hyperTribs'
  | 'platTribs'
  | 'octeracts'
  | 'c15Score'
  | 'quarkHept'
>

// A formatter that allows formatting a string. The string should be in a form parsable by break_infinity.js.
const formatDecimalSource = (numOrStr: DecimalSource) => {
  return format(typeof numOrStr === 'string' ? new Decimal(numOrStr) : numOrStr)
}

// A formatter that, if given a number, allows the data to be divided by the amount of seconds spent.
const conditionalFormatPerSecond = (numOrStr: DecimalSource, data: ResetHistoryEntryBase) => {
  // Strings (decimals) are currently not supported.
  if (typeof numOrStr === 'string') {
    return formatDecimalSource(numOrStr)
  }

  if (typeof numOrStr === 'number' && player.historyShowPerSecond && data.seconds !== 0) {
    if (numOrStr === 0) { // work around format(0, 3) return 0 instead of 0.000, for consistency
      return '0.000/s'
    }
    // Use "long" display for smaller numbers, but once it exceeds 1000, use the "short" display.
    // This'll keep decimals intact until 1000 instead of 10 without creating unwieldy numbers between e6-e13.
    return `${format(numOrStr / data.seconds, 3, numOrStr < 1000)}/s`
  }
  return format(numOrStr)
}

// Metadata and formatting tools for simple table cells (gains).
const historyGains: Record<
  ResetHistoryGainType,
  {
    img: string
    imgTitle: string
    formatter?: (str: DecimalSource, data: ResetHistoryEntryUnion) => string
    onlyif?: (data: ResetHistoryEntryUnion) => boolean
  }
> = {
  offerings: {
    img: 'Offering.png',
    formatter: formatDecimalSource,
    imgTitle: 'Offerings'
  },
  obtainium: {
    img: 'Obtainium.png',
    formatter: formatDecimalSource,
    imgTitle: 'Obtainium'
  },
  particles: {
    img: 'Particle.png',
    formatter: formatDecimalSource,
    imgTitle: 'Particles'
  },
  diamonds: {
    img: 'Diamond.png',
    formatter: formatDecimalSource,
    imgTitle: 'Diamonds'
  },
  mythos: {
    img: 'Mythos.png',
    formatter: formatDecimalSource,
    imgTitle: 'Mythos'
  },
  wowTesseracts: {
    img: 'TinyWow4.png',
    formatter: conditionalFormatPerSecond,
    imgTitle: 'Wow! Tesseracts'
  },
  wowHypercubes: {
    img: 'TinyWow5.png',
    formatter: conditionalFormatPerSecond,
    imgTitle: 'Wow! Hypercubes',
    onlyif: () => player.challengecompletions[13] > 0
  },
  wowCubes: {
    img: 'TinyWow3.png',
    formatter: conditionalFormatPerSecond,
    imgTitle: 'Wow! Cubes'
  },
  wowPlatonicCubes: {
    img: 'TinyWow6.png',
    formatter: conditionalFormatPerSecond,
    imgTitle: 'Platonic Cubes',
    onlyif: () => player.challengecompletions[14] > 0
  },
  wowHepteracts: {
    img: 'TinyWow7.png',
    formatter: conditionalFormatPerSecond,
    imgTitle: 'Hepteracts',
    onlyif: () => player.achievements[255] > 0
  },
  singularityCount: {
    img: 'TinyS.png',
    formatter: formatDecimalSource,
    imgTitle: 'Singularity Count',
    onlyif: () => player.highestSingularityCount > 0
  },
  quarks: {
    img: 'Quark.png',
    formatter: formatDecimalSource,
    imgTitle: 'Quarks',
    onlyif: () => player.highestSingularityCount > 0
  },
  goldenQuarks: {
    img: 'GoldenQuark.png',
    formatter: formatDecimalSource,
    imgTitle: 'Golden Quarks',
    onlyif: () => player.highestSingularityCount > 0
  },
  wowTribs: {
    img: 'TinyWow3.png',
    formatter: formatDecimalSource,
    imgTitle: 'Cube Tributes',
    onlyif: () => player.highestSingularityCount > 0
  },
  tessTribs: {
    img: 'TinyWow4.png',
    formatter: formatDecimalSource,
    imgTitle: 'Tesseract Gifts',
    onlyif: () => player.highestSingularityCount > 0
  },
  hyperTribs: {
    img: 'TinyWow5.png',
    formatter: formatDecimalSource,
    imgTitle: 'Hypercube Bendictions',
    onlyif: () => player.highestSingularityCount > 0
  },
  platTribs: {
    img: 'TinyWow6.png',
    formatter: formatDecimalSource,
    imgTitle: 'Platonics Opened',
    onlyif: () => player.highestSingularityCount > 0
  },
  octeracts: {
    img: 'TinyWow8.png',
    formatter: formatDecimalSource,
    imgTitle: 'Octeracts',
    onlyif: () => (player.singularityUpgrades.octeractUnlock.getEffect().bonus as number) > 0
  },
  c15Score: {
    img: 'TinyChallenge15.png',
    formatter: formatDecimalSource,
    imgTitle: 'C15 score',
    onlyif: () => player.singularityCount > 0
  },
  quarkHept: {
    img: 'TinyQuarkHept.png',
    formatter: formatDecimalSource,
    imgTitle: 'Quark Hept',
    onlyif: () => player.singularityCount > 0
  }
}

// Order in which to display the above
const historyGainsOrder: ResetHistoryGainType[] = [
  'offerings',
  'obtainium',
  'particles',
  'diamonds',
  'mythos',
  'wowCubes',
  'wowTesseracts',
  'wowHypercubes',
  'wowPlatonicCubes',
  'wowHepteracts',
  'singularityCount',
  'quarks',
  'goldenQuarks',
  'wowTribs',
  'tessTribs',
  'hyperTribs',
  'platTribs',
  'octeracts',
  'c15Score',
  'quarkHept'
]

// The various kinds and their associated images.
const historyKinds: Record<Kind, { img: string }> = {
  antsacrifice: { img: 'SacrificeNoBorder.png' },
  prestige: { img: 'TinyP.png' },
  transcend: { img: 'TinyT.png' },
  reincarnate: { img: 'TinyR.png' },
  ascend: { img: 'TinyA.png' },
  singularity: { img: 'TinyS.png' }
}

// List of categories and the IDs of the associated table in the DOM.
const resetHistoryTableMapping: Record<Category, string> = {
  ants: 'historyAntsTable',
  reset: 'historyResetTable',
  ascend: 'historyAscendTable',
  singularity: 'historySingularityTable'
}

// Images associated with the various corruptions.
const resetHistoryCorruptionImages = [
  'CorruptViscocity.png',
  'CorruptSpatialDilation.png',
  'CorruptHyperchallenged.png',
  'CorruptScientificIlliteracy.png',
  'CorruptDeflation.png',
  'CorruptExtinction.png',
  'CorruptDrought.png',
  'CorruptFinancialCollapse.png'
]

const resetHistoryCorruptionTitles = [
  'Viscosity [Accelerators and Multipliers]',
  'Spacial Dilation [Time]',
  'Hyperchallenged [Challenge Requirements]',
  'Scientific Illiteracy [Obtainium]',
  'Market Deflation [Diamonds]',
  'Extinction [Ants]',
  'Drought [Offering EXP]',
  'Financial Recession [Coins]'
]

// A formatting aid that removes the mantissa from a formatted string. Converts "2.5e1000" to "e1000".
const extractStringExponent = (str: string) => {
  let m: RegExpMatchArray | null
  return (m = /e\+?(.+)/.exec(str)) !== null ? `e${m[1]}` : str
}

// Add an entry to the history. This can be called via the event system.
const resetHistoryAdd = (category: Category, data: ResetHistoryEntryUnion) => {
  while (player.history[category].length > (G.historyCountMax - 1)) {
    player.history[category].shift()
  }

  player.history[category].push(data)
  resetHistoryPushNewRow(category, data)
}

Synergism.on('historyAdd', resetHistoryAdd)

// Add a row to the table, shifting out old ones as required.
const resetHistoryPushNewRow = (category: Category, data: ResetHistoryEntryUnion) => {
  const row = resetHistoryRenderRow(category, data)
  const table = DOMCacheGetOrSet(resetHistoryTableMapping[category])
  const tbody = table.querySelector('tbody')!
  tbody.insertBefore(row, tbody.childNodes[0])
  while (tbody.childNodes.length > G.historyCountMax) {
    tbody.removeChild(tbody.lastChild!)
  }

  if (category === 'ascend') {
    const loadCorruptionsButtons = Array.from(row.getElementsByClassName('ascendHistoryLoadCorruptions'))
    for (const btn of loadCorruptionsButtons) {
      btn.addEventListener('click', (e) => clickHandlerForLoadCorruptionsButton(e.target as HTMLElement))
    }
  }
}

// Render a table row.
const resetHistoryRenderRow = (
  _category: Category,
  data: ResetHistoryEntryUnion
) => {
  let colsUsed = 1
  const row = document.createElement('tr')
  let rowContentHtml = ''

  const kindMeta = historyKinds[data.kind]

  const localDate = new Date(data.date).toLocaleString()
  rowContentHtml += `<td class="history-seconds" title="${localDate}"><img alt="${data.kind}" src="Pictures/${
    IconSets[player.iconSet][0]
  }/${kindMeta.img}">${formatTimeShort(data.seconds, 60)}</td>`

  // Carefully loop through everything we need to print in the right order, and add it to the gains array if present.
  const gains: string[] = []
  const dataIntersection = data as ResetHistoryEntryIntersect
  historyGainsOrder.forEach((listable) => {
    if (Object.prototype.hasOwnProperty.call(data, listable)) {
      const gainInfo = historyGains[listable]
      if (gainInfo.onlyif && !gainInfo.onlyif(data)) {
        return
      }
      const formatter = gainInfo.formatter ?? (() => {/* If no formatter is specified, don't display. */})
      const str = `<img alt="${gainInfo.imgTitle}" src="Pictures/${
        IconSets[player.iconSet][0]
      }/${gainInfo.img}" title="${gainInfo.imgTitle}">${formatter(dataIntersection[listable]!, data)}`

      gains.push(str)
    }
  })

  // Kind-dependent rendering goes here. TypeScript will automatically cast to the appropriate structure based on
  // the kind check.
  const extra: string[] = []
  if (data.kind === 'antsacrifice') {
    const oldMulti = antSacrificePointsToMultiplier(data.antSacrificePointsBefore)
    const newMulti = antSacrificePointsToMultiplier(data.antSacrificePointsAfter)
    const diff = newMulti - oldMulti
    extra.push(
      `<span title="Ant Multiplier: ${format(oldMulti, 3, false)}--&gt;${
        format(newMulti, 3, false)
      }"><img src="Pictures/${IconSets[player.iconSet][0]}/Multiplier.png" alt="Ant Multiplier">+${
        format(diff, 3, false)
      }</span>`,
      `<span title="+${formatDecimalSource(data.crumbsPerSecond)} crumbs/s"><img src="Pictures/${
        IconSets[player.iconSet][0]
      }/TinyCrumbs.png" alt="Crumbs">${extractStringExponent(formatDecimalSource(data.crumbs))}</span>`,
      `<span title="${format(data.baseELO)} base"><img src="Pictures/${
        IconSets[player.iconSet][0]
      }/TinyELO.png" alt="ELO">${format(data.effectiveELO)}</span>`
    )
  } else if (data.kind === 'ascend') {
    extra.push(
      `<img alt="C10" src="Pictures/${
        IconSets[player.iconSet][0]
      }/TinyChallenge10.png" title="Challenge 10 completions">${data.c10Completions}`
    )

    const corruptions = resetHistoryFormatCorruptions(data)

    extra.push(corruptions[0])
    extra.push(corruptions[1])
    extra.push(corruptions[2])
  }

  // This rendering is done this way so that all rows should have the same number of columns, which makes rows
  // equal size and prevents bad rendering. We do 2 of these so that the history doesn't shift when
  // hypercubes or platcubes get added as players unlock them.
  // The 6 and 4 numbers are arbitrary but should never be less than the actual amount of columns that can be
  // realistically displayed; you can increase them if more gains are added.

  // Render the gains plus the gains filler
  colsUsed += gains.length
  rowContentHtml += gains.reduce((acc, value) => {
    return `${acc}<td class="history-gain">${value}</td>`
  }, '')
  rowContentHtml += `<td class="history-filler" colspan="${7 - colsUsed}"></td>`

  // Render the other stuff
  rowContentHtml += extra.reduce((acc, value) => {
    return `${acc}<td class="history-extra">${value}</td>`
  }, '')
  rowContentHtml += `<td class="history-filler" colspan="${4 - extra.length}"></td>`

  row.innerHTML = rowContentHtml
  return row
}

// Render a category into a given table.
const resetHistoryRenderFullTable = (categoryToRender: Category, targetTable: HTMLElement) => {
  const tbody = targetTable.querySelector('tbody')!
  tbody.innerHTML = ''

  if (player.history[categoryToRender].length > 0) {
    for (let i = player.history[categoryToRender].length - 1; i >= 0; --i) {
      const row = resetHistoryRenderRow(categoryToRender, player.history[categoryToRender][i])
      tbody.appendChild(row)
    }
  }

  if (categoryToRender === 'ascend') {
    const loadCorruptionsButtons = Array.from(document.getElementsByClassName('ascendHistoryLoadCorruptions'))
    for (const btn of loadCorruptionsButtons) {
      btn.addEventListener('click', (e) => clickHandlerForLoadCorruptionsButton(e.target as HTMLElement))
    }
  }
}

function clickHandlerForLoadCorruptionsButton (btn: HTMLElement) {
  const corruptions = btn.getAttribute('data-corr')
  if (corruptions) {
    applyCorruptions(corruptions)
    void Notification(i18next.t('corruptions.loadoutApplied'), 5000)
  }
}

// Render every category into their associated table.
export const resetHistoryRenderAllTables = () => {
  ;(Object.keys(resetHistoryTableMapping) as Category[]).forEach(
    (key) => resetHistoryRenderFullTable(key, DOMCacheGetOrSet(resetHistoryTableMapping[key]))
  )
}

// Toggle the "per second" display for the ascension table.
export const resetHistoryTogglePerSecond = () => {
  player.historyShowPerSecond = !player.historyShowPerSecond
  resetHistoryRenderAllTables()
  const button = DOMCacheGetOrSet('historyTogglePerSecondButton')
  if (player.historyShowPerSecond) {
    button.textContent = i18next.t('history.perSecondOn')
  } else {
    button.textContent = i18next.t('history.perSecondOff')
  }
  button.style.borderColor = player.historyShowPerSecond ? 'green' : 'red'
}

// Helper function to format the corruption display in the ascension table.
const resetHistoryFormatCorruptions = (data: ResetHistoryEntryAscend): [string, string, string] => {
  let score = `Score: ${format(data.corruptionScore, 0, false)}`
  let corruptions = ''
  let loadout = ''
  let corrs = 0
  for (let i = 0; i < resetHistoryCorruptionImages.length; ++i) {
    const corruptionIdx = i + 2
    if (corruptionIdx in data.usedCorruptions && data.usedCorruptions[corruptionIdx] !== 0) {
      corruptions += `<img alt="${corrs > 0 ? '/' : ''}" src="Pictures/${IconSets[player.iconSet][0]}/${
        resetHistoryCorruptionImages[i]
      }" title="${resetHistoryCorruptionTitles[i]}">${data.usedCorruptions[corruptionIdx]}`
    } else {
      corruptions += `<span>${corrs > 0 ? '/0' : '0'}</span>`
    }
    corrs++
  }
  if (corruptions) {
    loadout += `<button class="corrLoad ascendHistoryLoadCorruptions" data-corr="${
      data.usedCorruptions.join('/')
    }">Load</button>`
  }
  if (data.currentChallenge !== undefined) {
    score += ` / C${data.currentChallenge}`
  }

  return [score, corruptions, loadout]
}
