import type { HeaderLayout } from './types/Synergism'

const loadoutModuleIds = ['corruptionLoadoutsHeader', 'ambrosiaLoadoutsHeader'] as const

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
  'blueberryHeader'
] as const

export type RainbowAmbrosiaModuleId = typeof rainbowAmbrosiaModuleIds[number]

const ambrosiaModuleIds = [...rainbowAmbrosiaModuleIds, 'rainbowAmbrosiaHeader'] as const

const resetButtonModuleIds = [
  'prestigebtn',
  'transcendbtn',
  'reincarnatebtn',
  'acceleratorboostbtn',
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

export const headerModuleSizes = ['S', 'M', 'L'] as const

export type HeaderModuleSize = typeof headerModuleSizes[number]

export const HEADER_STACK_CAPACITY = 2
export const HEADER_BUTTON_GROUP_CAPACITY = 4
const HEADER_BUTTON_MODULE_COUNT = Math.ceil(resetButtonModuleIds.length / HEADER_BUTTON_GROUP_CAPACITY)
const HEADER_CURRENCY_COLUMNS = 4

export const HEADER_GRID_COLUMNS = {
  desktop: HEADER_CURRENCY_COLUMNS + HEADER_BUTTON_MODULE_COUNT,
  mobile: 2
} as const

export const isHeaderButton = (id: HeaderModuleId) => (resetButtonModuleIds as readonly HeaderModuleId[]).includes(id)

export const isHeaderProgress = (id: HeaderModuleId) =>
  (challengeProgressModuleIds as readonly HeaderModuleId[]).includes(id)

export const isHeaderLoadout = (id: HeaderModuleId) => (loadoutModuleIds as readonly HeaderModuleId[]).includes(id)

export const isHeaderGridRegion = (region: HeaderRegionId) => region === 'headerGrid'

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
      'corruptionLoadoutsHeader',
      'ambrosiaLoadoutsHeader',
      'goldenQuarkHeader',
      'octeractHeader',
      'achievementPointsHeader',
      'quarkBonusHeader',
      ...ambrosiaModuleIds
    ],
    rainbowAmbrosia: 'ambrosiaHeader',
    loadoutIcons: {
      corruptionLoadoutsHeader: {},
      ambrosiaLoadoutsHeader: {}
    }
  }

  const buttonSlots: HeaderModuleId[][] = []
  for (const [index, id] of resetButtonModuleIds.entries()) {
    ;(buttonSlots[Math.floor(index / HEADER_BUTTON_GROUP_CAPACITY)] ??= []).push(id)
    layout.positions[id] = index % HEADER_BUTTON_GROUP_CAPACITY
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
