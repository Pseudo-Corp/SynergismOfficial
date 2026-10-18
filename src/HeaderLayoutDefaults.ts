import type { HeaderLayout } from './types/Synergism'

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
  'lotusHeader'
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
  'goldenQuarkHeader'
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

export const headerRegionIds = ['ascensionStats', 'currenciesContainer', 'resetsButtons', 'challengeProgress'] as const

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

const headerGridRegions = ['currenciesContainer', 'resetsButtons', 'challengeProgress'] as const

export const HEADER_GRID_COLUMNS = { desktop: 4, mobile: 2 } as const

export const HEADER_STACK_CAPACITY = 2
export const HEADER_BUTTON_GROUP_CAPACITY = 4
export const HEADER_BUTTON_MODULE_COUNT = Math.ceil(resetButtonModuleIds.length / HEADER_BUTTON_GROUP_CAPACITY)
export const HEADER_BUTTON_GRID_COLUMNS = {
  desktop: HEADER_BUTTON_MODULE_COUNT,
  mobile: HEADER_GRID_COLUMNS.mobile
} as const
export const HEADER_PROGRESS_MODULE_COUNT = challengeProgressModuleIds.length
export const HEADER_PROGRESS_GRID_COLUMNS = {
  desktop: HEADER_PROGRESS_MODULE_COUNT,
  mobile: HEADER_GRID_COLUMNS.mobile
} as const

export const isHeaderButton = (id: HeaderModuleId) => (resetButtonModuleIds as readonly HeaderModuleId[]).includes(id)

export const isHeaderProgress = (id: HeaderModuleId) =>
  (challengeProgressModuleIds as readonly HeaderModuleId[]).includes(id)

export const isHeaderGridRegion = (region: HeaderRegionId) =>
  (headerGridRegions as readonly HeaderRegionId[]).includes(region)

export const freeButtonPosition = (positions: HeaderLayout['positions'], slot: HeaderModuleId[]) => {
  let position = 0
  while (slot.some((id) => positions[id] === position)) {
    position++
  }
  return position
}

export const createDefaultHeaderLayout = () => {
  const layout: HeaderLayout = {
    regions: {
      ascensionStats: statModuleIds.map((id) => [id]),
      currenciesContainer: [...currencyModuleIds, ...ambrosiaModuleIds].map((id) => [id]),
      resetsButtons: [],
      challengeProgress: challengeProgressModuleIds.map((id) => [id])
    },
    sizes: {},
    positions: {},
    hidden: ['happyHourBellHeader', 'lotusHeader', 'goldenQuarkHeader', ...ambrosiaModuleIds],
    rainbowAmbrosia: 'ambrosiaHeader'
  }

  for (const [index, id] of resetButtonModuleIds.entries()) {
    ;(layout.regions.resetsButtons[Math.floor(index / HEADER_BUTTON_GROUP_CAPACITY)] ??= []).push(id)
    layout.positions[id] = index % HEADER_BUTTON_GROUP_CAPACITY
  }

  return layout
}
