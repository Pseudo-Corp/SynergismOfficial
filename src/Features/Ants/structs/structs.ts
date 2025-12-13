import type Decimal from 'break_infinity.js'
import type { PlayerAntMasteries } from '../AntMasteries/structs/structs'
import type { PlayerAntProducers } from '../AntProducers/structs/structs'
import type { AntUpgrades } from '../AntUpgrades/structs/structs'
import type { AutoSacrificeModes } from '../toggles/structs/sacrifice'

export enum AntProducers {
  'Workers' = 0,
  'Breeders' = 1,
  'MetaBreeders' = 2,
  'MegaBreeders' = 3,
  'Queens' = 4,
  'LordRoyals' = 5,
  'Almighties' = 6,
  'Disciples' = 7,
  'HolySpirit' = 8
}

export const LAST_ANT_PRODUCER = AntProducers.HolySpirit

export interface PlayerAnts {
  producers: Record<AntProducers, PlayerAntProducers>
  masteries: Record<AntProducers, PlayerAntMasteries>
  upgrades: Record<AntUpgrades, number>
  crumbs: Decimal
  crumbsThisSacrifice: Decimal
  crumbsEverMade: Decimal
  immortalELO: number
  rebornELO: number
  highestRebornELODaily: Array<{ elo: number; sacrificeId: number }>
  highestRebornELOEver: Array<{ elo: number; sacrificeId: number }>
  quarksGainedFromAnts: number
  antSacrificeCount: number
  currentSacrificeId: number
  toggles: {
    autobuyProducers: boolean
    autobuyMasteries: boolean
    autobuyUpgrades: boolean
    maxBuyProducers: boolean
    maxBuyUpgrades: boolean
    autoSacrificeEnabled: boolean
    autoSacrificeThreshold: number
    autoSacrificeMode: AutoSacrificeModes
    alwaysSacrificeMaxRebornELO: boolean
    onlySacrificeMaxRebornELO: boolean
  }
}
