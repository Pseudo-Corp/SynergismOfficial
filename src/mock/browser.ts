import { http, HttpResponse } from 'msw'
import { setupWorker } from 'msw/browser'
import { consumeHandlers } from './websocket'

const GETHandlers = [
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
  ...consumeHandlers
)
