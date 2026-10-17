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
  'obtainiumHeader'
] as const

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
  ...resetButtonModuleIds,
  ...challengeProgressModuleIds
]

export type HeaderModuleId = typeof headerModuleIds[number]

export const headerModuleSizes = ['S', 'M', 'L'] as const

export type HeaderModuleSize = typeof headerModuleSizes[number]

export const headerGridRegion: HeaderRegionId = 'currenciesContainer'

export const HEADER_GRID_COLUMNS = { desktop: 4, mobile: 2 } as const

export const HEADER_STACK_CAPACITY = 2
export const HEADER_BUTTON_GROUP_CAPACITY = 4

export const isHeaderButton = (id: HeaderModuleId) => (resetButtonModuleIds as readonly HeaderModuleId[]).includes(id)

export const createDefaultHeaderLayout = () => {
  const layout: HeaderLayout = {
    regions: {
      ascensionStats: statModuleIds.map((id) => [id]),
      currenciesContainer: currencyModuleIds.map((id) => [id]),
      resetsButtons: resetButtonModuleIds.map((id) => [id]),
      challengeProgress: []
    },
    sizes: {},
    hidden: ['happyHourBellHeader', 'lotusHeader']
  }

  for (const [index, id] of challengeProgressModuleIds.entries()) {
    layout.sizes[id] = 'S'
    ;(layout.regions.challengeProgress[Math.floor(index / HEADER_STACK_CAPACITY)] ??= []).push(id)
  }

  return layout
}
