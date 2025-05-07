import { http, HttpResponse } from 'msw'
import { setupWorker } from 'msw/browser'
import { cloudSaveHandlers } from './handlers/CloudSaveHandlers'
import { messageHandlers } from './handlers/MessageHandlers'
import { consumeHandlers } from './websocket'

const GETHandlers = [
  http.get('https://synergism.cc/api/v1/quark-bonus', () => {
    return HttpResponse.json({
      bonus: 105.3
    })
  }),
  http.get('https://synergism.cc/stripe/coins', () => {
    return HttpResponse.json({
      coins: 49001
    })
  }),
  http.get('https://synergism.cc/consumables/list', () => {
    return HttpResponse.json([
      {
        name: 'Happy Hour Bell',
        description:
          'When you activate a consumable, trigger an event for 60 minutes, giving all players:\\n- Quark bonus: 25% + 2.5% * (active - 1)\\n- Cube, Obtainium, Offering bonuses: 50% + 5% * (active - 1)\\n- Ambrosia Luck Multiplier: 10% + 1% * (active - 1)\\n- Blueberry Generation Speed: 10% + 1% * (active - 1)\\n\\nIf you activate this consumable, you will receive 12 hours of Offline Time, in the form of tips. Each tip can be redeemed in the Events tab for 1 minute of Offline Time!',
        internalName: 'HAPPY_HOUR_BELL',
        cost: 500,
        length: '+1 hour'
      },
      {
        name: 'Small Global Timeskip',
        description: 'Skip 6 hours Gloablly',
        internalName: 'SMALL_GLOBAL_TIMESKIP',
        cost: 100,
        length: '360'
      },
      {
        name: 'Large Global Timeskip',
        description: 'Skip 12 hours Gloablly',
        internalName: 'LARGE_GLOBAL_TIMESKIP',
        cost: 200,
        length: '720'
      },
      {
        name: 'Jumbo Global Timeskip',
        description: 'Skip 24 hours Gloablly',
        internalName: 'JUMBO_GLOBAL_TIMESKIP',
        cost: 300,
        length: '1440'
      },
      {
        name: 'Small Ascension Timeskip',
        description: 'Skip 6 hours Ascension',
        internalName: 'SMALL_ASCENSION_TIMESKIP',
        cost: 100,
        length: '360'
      },
      {
        name: 'Large Ascension Timeskip',
        description: 'Skip 12 hours Ascension',
        internalName: 'LARGE_ASCENSION_TIMESKIP',
        cost: 200,
        length: '720'
      },
      {
        name: 'Jumbo Ascension Timeskip',
        description: 'Skip 24 hours Ascension',
        internalName: 'JUMBO_ASCENSION_TIMESKIP',
        cost: 300,
        length: '1440'
      },
      {
        name: 'Small Ambrosia Timeskip',
        description: 'Skip 6 hours Ambrosia',
        internalName: 'SMALL_AMBROSIA_TIMESKIP',
        cost: 150,
        length: '360'
      },
      {
        name: 'Large Ambrosia Timeskip',
        description: 'Skip 12 hours Ambrosia',
        internalName: 'LARGE_AMBROSIA_TIMESKIP',
        cost: 300,
        length: '720'
      },
      {
        name: 'Jumbo Ambrosia Timeskip',
        description: 'Skip 24 hours Ambrosia',
        internalName: 'JUMBO_AMBROSIA_TIMESKIP',
        cost: 400,
        length: '1440'
      }
    ])
  }),
  http.get('https://synergism.cc/stripe/upgrades', () => {
    return HttpResponse.json({
      coins: 49000,
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
        }
      ],
      playerUpgrades: [],
      tier: 0
    })
  }),
  http.get('https://synergism.cc/stripe/test/upgrades', () => {
    return HttpResponse.json({
      coins: 49000,
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
          description: 'Rceeive +5% Ambrosia Generation Speed per level',
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
        }
      ],
      playerUpgrades: [],
      tier: 0
    })
  })
]

const PUTHandlers = [
  http.put('https://synergism.cc/stripe/buy-upgrade/:id', async ({ params }) => {
    const { id } = params

    // TODO: Mock buying beyond level 1
    return HttpResponse.json({
      upgradeId: Number(id),
      level: 1
    })
  })
]

export const worker = setupWorker(
  http.get('https://synergism.cc/api/v1/users/me', () => {
    return HttpResponse.json({
      personalBonus: 0,
      globalBonus: 100,
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
        quarkBonus: 0
      },
      subscriptionTier: 0
    })
  }),
  ...GETHandlers,
  ...PUTHandlers,
  ...consumeHandlers,
  ...cloudSaveHandlers,
  ...messageHandlers
)
