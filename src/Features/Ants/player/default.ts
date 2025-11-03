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
import { defaultCrumbs, defaultCrumbsThisSacrifice, defaultCrumbsEverMade } from '../Crumbs/player/default'
import type { PlayerAnts } from '../structs/structs'
import {
  defaultAlwaysSacrificeMaxRebornELO,
  defaultAutobuyAntMasterySetting,
  defaultAutobuyAntProducerSetting,
  defaultAutobuyAntUpgradeSetting,
  defaultAutoSacrificeEnabled,
  defaultAutoSacrificeSetting,
  defaultAutoSacrificeThreshold,
  defaultMaxAntProducerBuySetting,
  defaultMaxAntUpgradeBuySetting
} from '../toggles/player/default'

export const defaultPlayerAnts: PlayerAnts = {
  producers: { ...defaultAntProducers },
  masteries: { ...defaultAntMasteries },
  upgrades: { ...defaultAntUpgrades },
  crumbs: Decimal.fromDecimal(defaultCrumbs),
  crumbsThisSacrifice: Decimal.fromDecimal(defaultCrumbsThisSacrifice),
  crumbsEverMade: Decimal.fromDecimal(defaultCrumbsEverMade),
  immortalELO: defaultAntImmortalELO,
  rebornELO: defaultAntRebornELO,
  highestRebornELODaily: [...defaultHighestRebornELODaily],
  highestRebornELOEver: [...defaultHighestRebornELOEver],
  quarksGainedFromAnts: defaultQuarksGainedFromAnts,
  antSacrificeCount: defaultAntSacrificeCount,
  currentSacrificeId: defaultCurrentSacrificeId,
  toggles: {
    autobuyProducers: defaultAutobuyAntProducerSetting,
    autobuyMasteries: defaultAutobuyAntMasterySetting,
    autobuyUpgrades: defaultAutobuyAntUpgradeSetting,
    maxBuyProducers: defaultMaxAntProducerBuySetting,
    maxBuyUpgrades: defaultMaxAntUpgradeBuySetting,
    autoSacrificeEnabled: defaultAutoSacrificeEnabled,
    autoSacrificeThreshold: defaultAutoSacrificeThreshold,
    autoSacrificeMode: defaultAutoSacrificeSetting,
    alwaysSacrificeMaxRebornELO: defaultAlwaysSacrificeMaxRebornELO
  }
}
