import { bypass, delay, http, HttpResponse } from 'msw'
import { setupWorker } from 'msw/browser'
import { getSubMetadata, setSubMetadata } from '../Login'
import { cloudSaveHandlers } from './handlers/CloudSaveHandlers'
import { messageHandlers } from './handlers/MessageHandlers'
import { paymentHandlers } from './handlers/PaymentHandlers'
import { subscriptionHandlers } from './handlers/SubscriptionHandlers'
import { xsollaHandlers } from './handlers/XsollaHandlers'
import { createConsumeHandlers } from './websocket'

interface PseudoCoinUpgrade {
  upgradeId: number
  maxLevel: number
  name: string
  description: string
  internalName: string
  level: number
  cost: number
}

interface PlayerPseudoCoinUpgrade {
  upgradeId: number
  level: number
  internalName: string
}

interface PseudoCoinUpgradeResponse {
  upgrades: PseudoCoinUpgrade[]
  playerUpgrades: PlayerPseudoCoinUpgrade[]
}

interface ConsumableListItem {
  id: number
  name: string
  description: string
  internalName: string
  cost: number
  length: string | null
}

let pseudoCoinBalance = 999_999
let pseudoCoinUpgrades: PseudoCoinUpgrade[] = []

const playerUpgrades: PlayerPseudoCoinUpgrade[] = [
  {
    upgradeId: 15,
    level: 2,
    internalName: 'ADD_CODE_CAP_BUFF'
  }
]

const consumables: ConsumableListItem[] = [
  {
    id: 1,
    name: 'Happy Hour Bell',
    description:
      'When you activate a consumable, trigger an event for 60 minutes, giving all players:\\n- Quark bonus: 25% + 2.5% * (active - 1)\\n- Cube, Obtainium, Offering bonuses: 50% + 5% * (active - 1)\\n- Ambrosia Luck Multiplier: 10% + 1% * (active - 1)\\n- Blueberry Generation Speed: 10% + 1% * (active - 1)\\n\\nIf you activate this consumable, you will receive 12 hours of Offline Time, in the form of tips. Each tip can be redeemed in the Events tab for 1 minute of Offline Time!',
    internalName: 'HAPPY_HOUR_BELL',
    cost: 500,
    length: null
  },
  {
    id: 2,
    name: 'Small Global Timeskip',
    description:
      'Adds 6 hours of REAL-LIFE time to your Prestige, Transcension, Reincarnation and Ant Sacrifice timers. Applies immediately!',
    internalName: 'SMALL_GLOBAL_TIMESKIP',
    cost: 100,
    length: '360'
  },
  {
    id: 3,
    name: 'Large Global Timeskip',
    description:
      'Adds 12 hours of REAL-LIFE time to your Prestige, Transcension, Reincarnation and Ant Sacrifice timers! Applies immediately!',
    internalName: 'LARGE_GLOBAL_TIMESKIP',
    cost: 200,
    length: '720'
  },
  {
    id: 4,
    name: 'Jumbo Global Timeskip',
    description:
      'Adds 24 hours of REAL LIFE time to your Prestige, Transcension, Reincarnation and Ant Sacrifice timers. Applies Immediately!',
    internalName: 'JUMBO_GLOBAL_TIMESKIP',
    cost: 300,
    length: '1440'
  },
  {
    id: 5,
    name: 'Small Ascension Timeskip',
    description: 'Adds 6 hours of REAL LIFE time to your Ascension Timer. Applies immediately!',
    internalName: 'SMALL_ASCENSION_TIMESKIP',
    cost: 100,
    length: '360'
  },
  {
    id: 6,
    name: 'Large Ascension Timeskip',
    description: 'Adds 12 hours of REAL LIFE time to your Ascension Timers. Applies immediately!',
    internalName: 'LARGE_ASCENSION_TIMESKIP',
    cost: 200,
    length: '720'
  },
  {
    id: 7,
    name: 'Jumbo Ascension Timeskip',
    description: 'Adds 24 hours of REAL LIFE time to your Ascension Timers. Applies Immediately!',
    internalName: 'JUMBO_ASCENSION_TIMESKIP',
    cost: 300,
    length: '1440'
  },
  {
    id: 8,
    name: 'Small Ambrosia Timeskip',
    description: 'Gain six hours worth of Ambrosia and Red Ambrosia Bar Points! Applies immediately!',
    internalName: 'SMALL_AMBROSIA_TIMESKIP',
    cost: 150,
    length: '360'
  },
  {
    id: 9,
    name: 'Large Ambrosia Timeskip',
    description: 'Gain 12 hours worth of Ambrosia and Red Ambrosia Bar Points! Applies immediately!\t',
    internalName: 'LARGE_AMBROSIA_TIMESKIP',
    cost: 300,
    length: '720'
  },
  {
    id: 10,
    name: 'Jumbo Ambrosia Timeskip',
    description: 'Gain 24 hours worth of Ambrosia and Red Ambrosia Bar Points! Applies immediately!\t',
    internalName: 'JUMBO_AMBROSIA_TIMESKIP',
    cost: 400,
    length: '1440'
  },
  {
    id: 11,
    name: 'Lotus of Rejuvenation',
    description:
      'Grants +1 Lotus, which you can use in the Anthill to instantly gain Reborn ELO for the next five Ant Sacrifices.',
    internalName: 'LOTUS_SINGLE',
    cost: 20,
    length: '1'
  },
  {
    id: 12,
    name: 'dozen Loti of Rejuvenation',
    description: 'Grants +12 Loti, for the price of 11.',
    internalName: 'LOTUS_DOZEN',
    cost: 220,
    length: '12'
  },
  {
    id: 13,
    name: 'Loti of Rejuvenation bouquet (50)',
    description: 'Grants +50 Loti, for the price of 40. What a steal!',
    internalName: 'LOTUS_BUNDLE',
    cost: 800,
    length: '50'
  }
]

const purchaseConsumable = (internalName: string) => {
  const consumable = consumables.find((item) => item.internalName === internalName)

  if (!consumable || consumable.cost > pseudoCoinBalance) {
    return false
  }

  pseudoCoinBalance -= consumable.cost
  return true
}

const GETHandlers = [
  http.get('https://synergism.cc/api/v1/quark-bonus', async () => {
    await delay(Math.random() * (2000 - 100) + 100)

    return HttpResponse.json({
      bonus: 150
    })
  }),
  http.get('https://synergism.cc/stripe/coins', () => {
    return HttpResponse.json({
      coins: pseudoCoinBalance
    })
  }),
  http.get('https://synergism.cc/consumables/list', () => {
    return HttpResponse.json(consumables)
  }),
  http.get('https://synergism.cc/stripe/upgrades', () => {
    const response: PseudoCoinUpgradeResponse = {
      upgrades: [
        {
          upgradeId: 1,
          maxLevel: 1,
          name: 'Instant Unlock',
          description: 'Instantly unlocks the Plastic Talisman in the shop! (Applies to all savefiles)',
          internalName: 'INSTANT_UNLOCK_1',
          level: 1,
          cost: 400
        },
        {
          upgradeId: 2,
          maxLevel: 1,
          name: 'Instant Unlock',
          description: 'Instantly unlock the Infinite Ascent rune in the shop! (Applies to all savefiles)',
          internalName: 'INSTANT_UNLOCK_2',
          level: 1,
          cost: 600
        },
        {
          upgradeId: 3,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +6% Cubes per level',
          internalName: 'CUBE_BUFF',
          level: 1,
          cost: 100
        },
        {
          upgradeId: 3,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +6% Cubes per level',
          internalName: 'CUBE_BUFF',
          level: 2,
          cost: 150
        },
        {
          upgradeId: 3,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +6% Cubes per level',
          internalName: 'CUBE_BUFF',
          level: 3,
          cost: 200
        },
        {
          upgradeId: 3,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +6% Cubes per level',
          internalName: 'CUBE_BUFF',
          level: 4,
          cost: 250
        },
        {
          upgradeId: 3,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +6% Cubes per level',
          internalName: 'CUBE_BUFF',
          level: 5,
          cost: 300
        },
        {
          upgradeId: 4,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +20 Ambrosia Luck per level',
          internalName: 'AMBROSIA_LUCK_BUFF',
          level: 1,
          cost: 100
        },
        {
          upgradeId: 4,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +20 Ambrosia Luck per level',
          internalName: 'AMBROSIA_LUCK_BUFF',
          level: 2,
          cost: 150
        },
        {
          upgradeId: 4,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +20 Ambrosia Luck per level',
          internalName: 'AMBROSIA_LUCK_BUFF',
          level: 3,
          cost: 200
        },
        {
          upgradeId: 4,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +20 Ambrosia Luck per level',
          internalName: 'AMBROSIA_LUCK_BUFF',
          level: 4,
          cost: 250
        },
        {
          upgradeId: 4,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +20 Ambrosia Luck per level',
          internalName: 'AMBROSIA_LUCK_BUFF',
          level: 5,
          cost: 300
        },
        {
          upgradeId: 5,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +5% Ambrosia Generation Speed per level',
          internalName: 'AMBROSIA_GENERATION_BUFF',
          level: 1,
          cost: 100
        },
        {
          upgradeId: 5,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +5% Ambrosia Generation Speed per level',
          internalName: 'AMBROSIA_GENERATION_BUFF',
          level: 2,
          cost: 150
        },
        {
          upgradeId: 5,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +5% Ambrosia Generation Speed per level',
          internalName: 'AMBROSIA_GENERATION_BUFF',
          level: 3,
          cost: 200
        },
        {
          upgradeId: 5,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +5% Ambrosia Generation Speed per level',
          internalName: 'AMBROSIA_GENERATION_BUFF',
          level: 4,
          cost: 250
        },
        {
          upgradeId: 5,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +5% Ambrosia Generation Speed per level',
          internalName: 'AMBROSIA_GENERATION_BUFF',
          level: 5,
          cost: 300
        },
        {
          upgradeId: 8,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +4% Golden Quarks per level',
          internalName: 'GOLDEN_QUARK_BUFF',
          level: 1,
          cost: 100
        },
        {
          upgradeId: 8,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +4% Golden Quarks per level',
          internalName: 'GOLDEN_QUARK_BUFF',
          level: 2,
          cost: 150
        },
        {
          upgradeId: 8,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +4% Golden Quarks per level',
          internalName: 'GOLDEN_QUARK_BUFF',
          level: 3,
          cost: 200
        },
        {
          upgradeId: 8,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +4% Golden Quarks per level',
          internalName: 'GOLDEN_QUARK_BUFF',
          level: 4,
          cost: 250
        },
        {
          upgradeId: 8,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +4% Golden Quarks per level',
          internalName: 'GOLDEN_QUARK_BUFF',
          level: 5,
          cost: 300
        },
        {
          upgradeId: 9,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +2% more Free Upgrades from promocodes per level',
          internalName: 'FREE_UPGRADE_PROMOCODE_BUFF',
          level: 1,
          cost: 100
        },
        {
          upgradeId: 9,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +2% more Free Upgrades from promocodes per level',
          internalName: 'FREE_UPGRADE_PROMOCODE_BUFF',
          level: 2,
          cost: 150
        },
        {
          upgradeId: 9,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +2% more Free Upgrades from promocodes per level',
          internalName: 'FREE_UPGRADE_PROMOCODE_BUFF',
          level: 3,
          cost: 200
        },
        {
          upgradeId: 9,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +2% more Free Upgrades from promocodes per level',
          internalName: 'FREE_UPGRADE_PROMOCODE_BUFF',
          level: 4,
          cost: 250
        },
        {
          upgradeId: 9,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +2% more Free Upgrades from promocodes per level',
          internalName: 'FREE_UPGRADE_PROMOCODE_BUFF',
          level: 5,
          cost: 300
        },
        {
          upgradeId: 10,
          maxLevel: 8,
          name: 'QOL',
          description: 'Each purchase adds +1 Corruption Loadout slot!',
          internalName: 'CORRUPTION_LOADOUT_SLOT_QOL',
          level: 8,
          cost: 125
        },
        {
          upgradeId: 10,
          maxLevel: 8,
          name: 'QOL',
          description: 'Each purchase adds +1 Corruption Loadout slot!',
          internalName: 'CORRUPTION_LOADOUT_SLOT_QOL',
          level: 7,
          cost: 125
        },
        {
          upgradeId: 10,
          maxLevel: 8,
          name: 'QOL',
          description: 'Each purchase adds +1 Corruption Loadout slot!',
          internalName: 'CORRUPTION_LOADOUT_SLOT_QOL',
          level: 6,
          cost: 125
        },
        {
          upgradeId: 10,
          maxLevel: 8,
          name: 'QOL',
          description: 'Each purchase adds +1 Corruption Loadout slot!',
          internalName: 'CORRUPTION_LOADOUT_SLOT_QOL',
          level: 5,
          cost: 125
        },
        {
          upgradeId: 10,
          maxLevel: 8,
          name: 'QOL',
          description: 'Each purchase adds +1 Corruption Loadout slot!',
          internalName: 'CORRUPTION_LOADOUT_SLOT_QOL',
          level: 4,
          cost: 125
        },
        {
          upgradeId: 10,
          maxLevel: 8,
          name: 'QOL',
          description: 'Each purchase adds +1 Corruption Loadout slot!',
          internalName: 'CORRUPTION_LOADOUT_SLOT_QOL',
          level: 3,
          cost: 125
        },
        {
          upgradeId: 10,
          maxLevel: 8,
          name: 'QOL',
          description: 'Each purchase adds +1 Corruption Loadout slot!',
          internalName: 'CORRUPTION_LOADOUT_SLOT_QOL',
          level: 2,
          cost: 125
        },
        {
          upgradeId: 10,
          maxLevel: 8,
          name: 'QOL',
          description: 'Each purchase adds +1 Corruption Loadout slot!',
          internalName: 'CORRUPTION_LOADOUT_SLOT_QOL',
          level: 1,
          cost: 125
        },
        {
          upgradeId: 11,
          maxLevel: 8,
          name: 'QOL',
          description: 'Each purchase adds +1 Ambrosia Loadout slot!',
          internalName: 'AMBROSIA_LOADOUT_SLOT_QOL',
          level: 8,
          cost: 125
        },
        {
          upgradeId: 11,
          maxLevel: 8,
          name: 'QOL',
          description: 'Each purchase adds +1 Ambrosia Loadout slot!',
          internalName: 'AMBROSIA_LOADOUT_SLOT_QOL',
          level: 7,
          cost: 125
        },
        {
          upgradeId: 11,
          maxLevel: 8,
          name: 'QOL',
          description: 'Each purchase adds +1 Ambrosia Loadout slot!',
          internalName: 'AMBROSIA_LOADOUT_SLOT_QOL',
          level: 6,
          cost: 125
        },
        {
          upgradeId: 11,
          maxLevel: 8,
          name: 'QOL',
          description: 'Each purchase adds +1 Ambrosia Loadout slot!',
          internalName: 'AMBROSIA_LOADOUT_SLOT_QOL',
          level: 5,
          cost: 125
        },
        {
          upgradeId: 11,
          maxLevel: 8,
          name: 'QOL',
          description: 'Each purchase adds +1 Ambrosia Loadout slot!',
          internalName: 'AMBROSIA_LOADOUT_SLOT_QOL',
          level: 4,
          cost: 125
        },
        {
          upgradeId: 11,
          maxLevel: 8,
          name: 'QOL',
          description: 'Each purchase adds +1 Ambrosia Loadout slot!',
          internalName: 'AMBROSIA_LOADOUT_SLOT_QOL',
          level: 3,
          cost: 125
        },
        {
          upgradeId: 11,
          maxLevel: 8,
          name: 'QOL',
          description: 'Each purchase adds +1 Ambrosia Loadout slot!',
          internalName: 'AMBROSIA_LOADOUT_SLOT_QOL',
          level: 2,
          cost: 125
        },
        {
          upgradeId: 11,
          maxLevel: 8,
          name: 'QOL',
          description: 'Each purchase adds +1 Ambrosia Loadout slot!',
          internalName: 'AMBROSIA_LOADOUT_SLOT_QOL',
          level: 1,
          cost: 125
        },
        {
          upgradeId: 12,
          maxLevel: 1,
          name: 'QOL',
          description: 'Auto-Potion No Longer Spends Potions When Consumed!',
          internalName: 'AUTO_POTION_FREE_POTIONS_QOL',
          level: 1,
          cost: 500
        },
        {
          upgradeId: 13,
          maxLevel: 2,
          name: 'QOL',
          description: 'Increase the Offline Timer Cap by 100% per level!',
          internalName: 'OFFLINE_TIMER_CAP_BUFF',
          level: 1,
          cost: 400
        },
        {
          upgradeId: 13,
          maxLevel: 2,
          name: 'QOL',
          description: 'Increase the Offline Timer Cap by 100% per level!',
          internalName: 'OFFLINE_TIMER_CAP_BUFF',
          level: 2,
          cost: 600
        },
        {
          upgradeId: 15,
          maxLevel: 2,
          name: 'QOL',
          description: 'Increase "add" Code Cap by 100% per level!',
          internalName: 'ADD_CODE_CAP_BUFF',
          level: 1,
          cost: 400
        },
        {
          upgradeId: 15,
          maxLevel: 2,
          name: 'QOL',
          description: 'Increase "add" Code Cap by 100% per level!',
          internalName: 'ADD_CODE_CAP_BUFF',
          level: 2,
          cost: 600
        },
        {
          upgradeId: 16,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +6 Base Offerings per level, affected by all multipliers!',
          internalName: 'BASE_OFFERING_BUFF',
          level: 1,
          cost: 100
        },
        {
          upgradeId: 16,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +6 Base Offerings per level, affected by all multipliers!',
          internalName: 'BASE_OFFERING_BUFF',
          level: 2,
          cost: 150
        },
        {
          upgradeId: 16,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +6 Base Offerings per level, affected by all multipliers!',
          internalName: 'BASE_OFFERING_BUFF',
          level: 3,
          cost: 200
        },
        {
          upgradeId: 16,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +6 Base Offerings per level, affected by all multipliers!',
          internalName: 'BASE_OFFERING_BUFF',
          level: 4,
          cost: 250
        },
        {
          upgradeId: 16,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +6 Base Offerings per level, affected by all multipliers!',
          internalName: 'BASE_OFFERING_BUFF',
          level: 5,
          cost: 300
        },
        {
          upgradeId: 17,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +3 Base Obtainium per level, affected by all multipliers!',
          internalName: 'BASE_OBTAINIUM_BUFF',
          level: 1,
          cost: 100
        },
        {
          upgradeId: 17,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +3 Base Obtainium per level, affected by all multipliers!',
          internalName: 'BASE_OBTAINIUM_BUFF',
          level: 2,
          cost: 150
        },
        {
          upgradeId: 17,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +3 Base Obtainium per level, affected by all multipliers!',
          internalName: 'BASE_OBTAINIUM_BUFF',
          level: 3,
          cost: 200
        },
        {
          upgradeId: 17,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +3 Base Obtainium per level, affected by all multipliers!',
          internalName: 'BASE_OBTAINIUM_BUFF',
          level: 4,
          cost: 250
        },
        {
          upgradeId: 17,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +3 Base Obtainium per level, affected by all multipliers!',
          internalName: 'BASE_OBTAINIUM_BUFF',
          level: 5,
          cost: 300
        },
        {
          upgradeId: 18,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +20 Red Ambrosia Luck per level',
          internalName: 'RED_LUCK_BUFF',
          level: 1,
          cost: 100
        },
        {
          upgradeId: 18,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +20 Red Ambrosia Luck per level',
          internalName: 'RED_LUCK_BUFF',
          level: 2,
          cost: 150
        },
        {
          upgradeId: 18,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +20 Red Ambrosia Luck per level',
          internalName: 'RED_LUCK_BUFF',
          level: 3,
          cost: 200
        },
        {
          upgradeId: 18,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +20 Red Ambrosia Luck per level',
          internalName: 'RED_LUCK_BUFF',
          level: 4,
          cost: 250
        },
        {
          upgradeId: 18,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +20 Red Ambrosia Luck per level',
          internalName: 'RED_LUCK_BUFF',
          level: 5,
          cost: 300
        },
        {
          upgradeId: 19,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +5% more Red Ambrosia Bar Points per level',
          internalName: 'RED_GENERATION_BUFF',
          level: 5,
          cost: 300
        },
        {
          upgradeId: 19,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +5% more Red Ambrosia Bar Points per level',
          internalName: 'RED_GENERATION_BUFF',
          level: 4,
          cost: 250
        },
        {
          upgradeId: 19,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +5% more Red Ambrosia Bar Points per level',
          internalName: 'RED_GENERATION_BUFF',
          level: 3,
          cost: 200
        },
        {
          upgradeId: 19,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +5% more Red Ambrosia Bar Points per level',
          internalName: 'RED_GENERATION_BUFF',
          level: 2,
          cost: 150
        },
        {
          upgradeId: 19,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +5% more Red Ambrosia Bar Points per level',
          internalName: 'RED_GENERATION_BUFF',
          level: 1,
          cost: 100
        },
        {
          upgradeId: 20,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +5 more Purple Honey Luck per level',
          internalName: 'PURPLE_LUCK_BUFF',
          level: 1,
          cost: 100
        },
        {
          upgradeId: 20,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +5 more Purple Honey Luck per level',
          internalName: 'PURPLE_LUCK_BUFF',
          level: 2,
          cost: 150
        },
        {
          upgradeId: 20,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +5 more Purple Honey Luck per level',
          internalName: 'PURPLE_LUCK_BUFF',
          level: 3,
          cost: 200
        },
        {
          upgradeId: 20,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +5 more Purple Honey Luck per level',
          internalName: 'PURPLE_LUCK_BUFF',
          level: 4,
          cost: 250
        },
        {
          upgradeId: 20,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +5 more Purple Honey Luck per level',
          internalName: 'PURPLE_LUCK_BUFF',
          level: 5,
          cost: 300
        },
        {
          upgradeId: 21,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +0.04 base Purple Honey per extraction, per level',
          internalName: 'PURPLE_HONEY_BUFF',
          level: 1,
          cost: 100
        },
        {
          upgradeId: 21,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +0.04 base Purple Honey per extraction, per level',
          internalName: 'PURPLE_HONEY_BUFF',
          level: 2,
          cost: 150
        },
        {
          upgradeId: 21,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +0.04 base Purple Honey per extraction, per level',
          internalName: 'PURPLE_HONEY_BUFF',
          level: 3,
          cost: 200
        },
        {
          upgradeId: 21,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +0.04 base Purple Honey per extraction, per level',
          internalName: 'PURPLE_HONEY_BUFF',
          level: 4,
          cost: 250
        },
        {
          upgradeId: 21,
          maxLevel: 5,
          name: 'Multi-Level',
          description: 'Receive +0.04 base Purple Honey per extraction, per level',
          internalName: 'PURPLE_HONEY_BUFF',
          level: 5,
          cost: 300
        },
        {
          upgradeId: 22,
          maxLevel: 5,
          name: 'Multi-Level',
          description:
            'Increase Ambrosia Bar Point capacity in the Chroma Encabulator by 250,000,000 per level! 250,000 per level for Red Bar Point capacity.',
          internalName: 'PURPLE_REACTOR_CAPACITY_BUFF',
          level: 1,
          cost: 100
        },
        {
          upgradeId: 22,
          maxLevel: 5,
          name: 'Multi-Level',
          description:
            'Increase Ambrosia Bar Point capacity in the Chroma Encabulator by 250,000,000 per level! 250,000 per level for Red Bar Point capacity.',
          internalName: 'PURPLE_REACTOR_CAPACITY_BUFF',
          level: 2,
          cost: 150
        },
        {
          upgradeId: 22,
          maxLevel: 5,
          name: 'Multi-Level',
          description:
            'Increase Ambrosia Bar Point capacity in the Chroma Encabulator by 250,000,000 per level! 250,000 per level for Red Bar Point capacity.',
          internalName: 'PURPLE_REACTOR_CAPACITY_BUFF',
          level: 3,
          cost: 200
        },
        {
          upgradeId: 22,
          maxLevel: 5,
          name: 'Multi-Level',
          description:
            'Increase Ambrosia Bar Point capacity in the Chroma Encabulator by 250,000,000 per level! 250,000 per level for Red Bar Point capacity.',
          internalName: 'PURPLE_REACTOR_CAPACITY_BUFF',
          level: 4,
          cost: 250
        },
        {
          upgradeId: 22,
          maxLevel: 5,
          name: 'Multi-Level',
          description:
            'Increase Ambrosia Bar Point capacity in the Chroma Encabulator by 250,000,000 per level! 250,000 per level for Red Bar Point capacity.',
          internalName: 'PURPLE_REACTOR_CAPACITY_BUFF',
          level: 5,
          cost: 300
        }
      ],
      playerUpgrades
    }

    pseudoCoinUpgrades = response.upgrades

    return HttpResponse.json(response)
  }),
  http.get('https://synergism.cc/stripe/products', ({ request }) => {
    return fetch(bypass(request))
  }),
  http.get('https://synergism.cc/events/get', ({ request }) => {
    return fetch(bypass(request))
  }),
  http.get('/favicon.ico', ({ request }) => {
    return fetch(bypass(request))
  })
]

const PUTHandlers = [
  http.put('https://synergism.cc/stripe/buy-upgrade/:id', ({ params }) => {
    const upgradeId = Number(params.id)
    const playerUpgrade = playerUpgrades.find((upgrade) => upgrade.upgradeId === upgradeId)
    const currentLevel = playerUpgrade?.level ?? 0
    const nextUpgrade = pseudoCoinUpgrades.find((upgrade) =>
      upgrade.upgradeId === upgradeId
      && upgrade.level === currentLevel + 1
      && upgrade.cost <= pseudoCoinBalance
    )

    if (!nextUpgrade) {
      return HttpResponse.json(
        { error: 'Upgrade not found or you cannot afford it.' },
        { status: 400 }
      )
    }

    pseudoCoinBalance -= nextUpgrade.cost

    if (playerUpgrade) {
      playerUpgrade.level = nextUpgrade.level
    } else {
      playerUpgrades.push({
        upgradeId,
        level: nextUpgrade.level,
        internalName: nextUpgrade.internalName
      })
    }

    return HttpResponse.json({
      upgradeId,
      level: nextUpgrade.level
    })
  })
]

const seedEndDate = new Date()
seedEndDate.setMonth(seedEndDate.getMonth() + 1)

setSubMetadata({
  provider: 'stripe',
  tier: 3,
  endDate: seedEndDate.toISOString()
})

export const worker = setupWorker(
  http.get('https://synergism.cc/api/v1/users/me', () => {
    return HttpResponse.json({
      globalBonus: 50,
      member: {
        user: {
          id: '267774648622645249',
          username: 'pseudocoins',
          discriminator: '0',
          global_name: 'Khafra',
          avatar: 'c92c2b04fd74e6aff685f3c84945d8f2',
          accent_color: 0,
          flags: 0,
          public_flags: 0
        },
        nick: 'Khafra',
        avatar: null,
        roles: [
          '707117274494140416',
          '733152623062024192',
          '1335745588485951618',
          '825469569349976164',
          '742762410762567720',
          '804028186949189674',
          '705549222908395601',
          '858524372432060436',
          '677272331793465365',
          '997845444367503451'
        ],
        joined_at: '2020-05-04T02:44:37.633000+00:00',
        premium_since: null,
        deaf: false,
        mute: false,
        flags: 0,
        pending: false,
        communication_disabled_until: null
      },
      accountType: 'discord',
      bonus: {
        quark: 0
      },
      subscription: getSubMetadata(),
      linkedAccounts: ['email']
    })
  }),
  ...GETHandlers,
  ...PUTHandlers,
  ...createConsumeHandlers(purchaseConsumable),
  ...cloudSaveHandlers,
  ...messageHandlers,
  ...paymentHandlers,
  ...subscriptionHandlers,
  ...xsollaHandlers
)
