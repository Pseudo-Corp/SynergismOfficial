import Decimal from 'break_infinity.js'
import { defaultAntMasteries } from '../AntMasteries/player/default'
import { defaultAntProducers } from '../AntProducers/player/default'
import { defaultAntSacrificeCount, defaultCurrentSacrificeId } from '../AntSacrifice/player/default'
import { defaultAntImmortalELO } from '../AntSacrifice/Rewards/ELO/ImmortalELO/player/default'
import {
  defaultAntRebornELO,
  defaultHighestRebornELODaily,
  defaultHighestRebornELOEver,
  defaultQuarksGainedFromAnts
} from '../AntSacrifice/Rewards/ELO/RebornELO/player/default'
import { defaultAntUpgrades } from '../AntUpgrades/player/default'
import { defaultCrumbs, defaultHighestCrumbsEver, defaultHighestCrumbsThisSacrifice } from '../Crumbs/player/default'
import type { PlayerAnts } from '../structs/structs'

export const defaultPlayerAnts: PlayerAnts = {
  producers: { ...defaultAntProducers },
  masteries: { ...defaultAntMasteries },
  upgrades: { ...defaultAntUpgrades },
  crumbs: Decimal.fromString(defaultCrumbs),
  highestCrumbsThisSacrifice: Decimal.fromString(defaultHighestCrumbsThisSacrifice),
  highestCrumbsEver: Decimal.fromString(defaultHighestCrumbsEver),
  immortalELO: defaultAntImmortalELO,
  rebornELO: defaultAntRebornELO,
  highestRebornELODaily: [...defaultHighestRebornELODaily],
  highestRebornELOEver: [...defaultHighestRebornELOEver],
  quarksGainedFromAnts: defaultQuarksGainedFromAnts,
  antSacrificeCount: defaultAntSacrificeCount,
  currentSacrificeId: defaultCurrentSacrificeId
}
