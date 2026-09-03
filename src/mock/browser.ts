import { bypass, delay, http, HttpResponse, passthrough } from 'msw'
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

let consumables: ConsumableListItem[] = []

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
  http.get('https://synergism.cc/consumables/list', async ({ request }) => {
    const response = await fetch(bypass(request))
    consumables = await response.clone().json()
    return response
  }),
  http.get('https://synergism.cc/stripe/upgrades', async ({ request }) => {
    const serverResponse = await fetch(bypass(request))
    const json = await serverResponse.json()

    pseudoCoinUpgrades = json.upgrades

    return HttpResponse.json({
      ...json,
      playerUpgrades
    })
  }),
  http.get('https://synergism.cc/stripe/products', () => passthrough()),
  http.get('https://synergism.cc/events/get', () => passthrough()),
  http.get('/favicon.ico', () => passthrough())
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
