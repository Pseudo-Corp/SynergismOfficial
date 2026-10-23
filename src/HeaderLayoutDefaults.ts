import type { HeaderLayout } from './types/Synergism'

export const loadoutPageModuleIds = ['ambrosiaLoadoutPageHeader'] as const

export type LoadoutPageModuleId = typeof loadoutPageModuleIds[number]

const loadoutModuleIds = ['ambrosiaLoadoutsHeader', ...loadoutPageModuleIds] as const

const statModuleIds = [
  'ascCubeStats',
  'ascTessStats',
  'ascHyperStats',
  'ascPlatonicStats',
  'ascHepteractStats',
  'ascTimeTakenStats',
  'ascC10CompletionsStats',
  'ascTimeFactorStats',
  'ascAscensionTimeFactorStats',
  'ascSingularityCountStats',
  'ascSingTimeTakenStats',
  'ascSingChallengeTimeTakenStats',
  'happyHourBellHeader',
  'lotusHeader',
  'dailyCodeHeader',
  'addCodeHeader',
  'timeCodeHeader',
  'corruptionLevelHeader',
  ...loadoutModuleIds
] as const

const currencyModuleIds = [
  'coinHeader',
  'diamondHeader',
  'offeringHeader',
  'quarkHeader',
  'mythosHeader',
  'mythosShardHeader',
  'particlesHeader',
  'obtainiumHeader',
  'goldenQuarkHeader',
  'octeractHeader',
  'achievementPointsHeader',
  'quarkBonusHeader'
] as const

export const rainbowAmbrosiaModuleIds = [
  'ambrosiaHeader',
  'redAmbrosiaHeader',
  'purpleAmbrosiaHeader',
  'purpleHoneyHeader',
  'blueberryHeader'
] as const

export type RainbowAmbrosiaModuleId = typeof rainbowAmbrosiaModuleIds[number]

const ambrosiaModuleIds = [...rainbowAmbrosiaModuleIds, 'rainbowAmbrosiaHeader'] as const

const resetButtonModuleIds = [
  'prestigebtn',
  'transcendbtn',
  'reincarnatebtn',
  'challengebtn',
  'reincarnatechallengebtn',
  'ascendChallengeBtn',
  'ascendbtn',
  'singularitybtn'
] as const

const challengeProgressModuleIds = [
  'transcensionChallengeProgress',
  'reincarnationChallengeProgress',
  'ascensionChallengeProgress'
] as const

export const headerRegionIds = ['ascensionStats', 'headerGrid'] as const

export type HeaderRegionId = typeof headerRegionIds[number]

export const headerModuleIds = [
  ...statModuleIds,
  ...currencyModuleIds,
  ...ambrosiaModuleIds,
  ...resetButtonModuleIds,
  ...challengeProgressModuleIds
]

export type HeaderModuleId = typeof headerModuleIds[number]

export const headerModuleSizes = ['S', 'M', 'L', 'XL', 'Tall'] as const

export type HeaderModuleSize = typeof headerModuleSizes[number]

export const HEADER_STACK_CAPACITY = 2
const HEADER_CURRENCY_COLUMNS = 4
const HEADER_MOBILE_GRID_COLUMNS = 2

export const HEADER_BUTTON_GROUP_CAPACITY = {
  desktop: 4,
  mobile: Math.ceil(resetButtonModuleIds.length / HEADER_MOBILE_GRID_COLUMNS)
} as const

const HEADER_BUTTON_MODULE_COUNT = Math.ceil(resetButtonModuleIds.length / HEADER_BUTTON_GROUP_CAPACITY.desktop)

export const HEADER_GRID_COLUMNS = {
  desktop: HEADER_CURRENCY_COLUMNS + HEADER_BUTTON_MODULE_COUNT,
  mobile: HEADER_MOBILE_GRID_COLUMNS
} as const

export const isHeaderButton = (id: HeaderModuleId) => (resetButtonModuleIds as readonly HeaderModuleId[]).includes(id)

export const isHeaderProgress = (id: HeaderModuleId) =>
  (challengeProgressModuleIds as readonly HeaderModuleId[]).includes(id)

export const isHeaderLoadout = (id: HeaderModuleId) => (loadoutModuleIds as readonly HeaderModuleId[]).includes(id)

export const isHeaderGridRegion = (region: HeaderRegionId) => region === 'headerGrid'

export const isHeaderModuleId = (id: unknown): id is HeaderModuleId =>
  typeof id === 'string' && (headerModuleIds as readonly string[]).includes(id)

const isHeaderSolo = (id: HeaderModuleId) => isHeaderProgress(id) || isHeaderLoadout(id)

export const isHeaderSizeAllowed = (
  id: HeaderModuleId,
  size: HeaderModuleSize,
  key: keyof typeof HEADER_BUTTON_GROUP_CAPACITY
) => {
  switch (size) {
    case 'S':
      return !isHeaderButton(id)
    case 'XL':
      return key === 'desktop' && isHeaderSolo(id)
    case 'Tall':
      return isHeaderProgress(id)
    default:
      return true
  }
}

const chunkSlot = (ids: HeaderModuleId[], capacity: number) =>
  Array.from({ length: Math.ceil(ids.length / capacity) }, (_, i) => ids.slice(i * capacity, (i + 1) * capacity))

export const splitHeaderSlot = (slot: HeaderModuleId[], key: keyof typeof HEADER_BUTTON_GROUP_CAPACITY) => {
  if (slot.length <= 1) {
    return [slot]
  }

  return [
    ...chunkSlot(slot.filter(isHeaderButton), HEADER_BUTTON_GROUP_CAPACITY[key]),
    ...chunkSlot(slot.filter((id) => !isHeaderButton(id) && !isHeaderSolo(id)), HEADER_STACK_CAPACITY),
    ...slot.filter(isHeaderSolo).map((id) => [id])
  ]
}

export const freeButtonPosition = (positions: HeaderLayout['positions'], slot: HeaderModuleId[]) => {
  let position = 0
  while (slot.some((id) => positions[id] === position)) {
    position++
  }
  return position
}

export const createDefaultHeaderLayout = (key: 'desktop' | 'mobile') => {
  const layout: HeaderLayout = {
    regions: {
      ascensionStats: statModuleIds.map((id) => [id]),
      headerGrid: []
    },
    sizes: {},
    positions: {},
    hidden: [
      'happyHourBellHeader',
      'lotusHeader',
      'dailyCodeHeader',
      'addCodeHeader',
      'timeCodeHeader',
      'corruptionLevelHeader',
      'ambrosiaLoadoutsHeader',
      ...loadoutPageModuleIds,
      'goldenQuarkHeader',
      'octeractHeader',
      'achievementPointsHeader',
      'quarkBonusHeader',
      ...ambrosiaModuleIds
    ],
    rainbowAmbrosia: 'ambrosiaHeader',
    octeractPerSecond: false,
    loadoutPages: {
      ambrosiaLoadoutPageHeader: 0
    },
    loadoutIcons: {
      ambrosiaLoadoutsHeader: {}
    }
  }

  const buttonSlots: HeaderModuleId[][] = []
  for (const [index, id] of resetButtonModuleIds.entries()) {
    ;(buttonSlots[Math.floor(index / HEADER_BUTTON_GROUP_CAPACITY[key])] ??= []).push(id)
    layout.positions[id] = index % HEADER_BUTTON_GROUP_CAPACITY[key]
  }
  const currencySlots = [...currencyModuleIds, ...ambrosiaModuleIds].map((id) => [id])
  const progressSlots = challengeProgressModuleIds.map((id) => [id])
  const grid = layout.regions.headerGrid

  if (key === 'mobile') {
    grid.push(...buttonSlots)
    while (grid.length % HEADER_GRID_COLUMNS.mobile !== 0) {
      grid.push([])
    }
    grid.push(...currencySlots, ...progressSlots)
    return layout
  }

  for (const id of challengeProgressModuleIds) {
    layout.sizes[id] = 'Tall'
  }

  const resetSlots = [...buttonSlots, ...progressSlots]
  const rows = Math.max(
    Math.ceil(currencySlots.length / HEADER_CURRENCY_COLUMNS),
    Math.ceil(resetSlots.length / HEADER_BUTTON_MODULE_COUNT)
  )
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < HEADER_CURRENCY_COLUMNS; column++) {
      grid.push(currencySlots[row * HEADER_CURRENCY_COLUMNS + column] ?? [])
    }
    for (let column = 0; column < HEADER_BUTTON_MODULE_COUNT; column++) {
      grid.push(resetSlots[row * HEADER_BUTTON_MODULE_COUNT + column] ?? [])
    }
  }

  return layout
}
