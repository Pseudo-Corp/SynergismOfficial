import { bypass, delay, http, HttpResponse, passthrough } from 'msw'
import { setupWorker } from 'msw/browser'
import * as z from 'zod'
import { getSubMetadata, setSubMetadata } from '../Login'
import { cloudSaveHandlers } from './handlers/CloudSaveHandlers'
import { messageHandlers } from './handlers/MessageHandlers'
import { paymentHandlers } from './handlers/PaymentHandlers'
import { subscriptionHandlers } from './handlers/SubscriptionHandlers'
import { xsollaHandlers } from './handlers/XsollaHandlers'
import { messages } from './util/messages'
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

const timeSkipPurchases = new Map<string, string>()

const buySchema = z.object({
  consumable: z.enum([
    'SMALL_GLOBAL_TIMESKIP',
    'LARGE_GLOBAL_TIMESKIP',
    'JUMBO_GLOBAL_TIMESKIP',
    'SMALL_ASCENSION_TIMESKIP',
    'LARGE_ASCENSION_TIMESKIP',
    'JUMBO_ASCENSION_TIMESKIP',
    'SMALL_AMBROSIA_TIMESKIP',
    'LARGE_AMBROSIA_TIMESKIP',
    'JUMBO_AMBROSIA_TIMESKIP'
  ]),
  id: z.uuid()
})

const GETHandlers = [
  http.get('https://synergism.cc/api/v1/quark-bonus', async () => {
    await delay(Math.random() * (2000 - 100) + 100)

    return HttpResponse.json({
      bonus: 150
    })
  }),
  http.get('https://synergism.cc/stripe/coins', async () => {
    await delay(1000)
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

const POSTHandlers = [
  http.post('https://synergism.cc/consumables/buy', async ({ request }) => {
    let body: unknown

    try {
      body = await request.json()
    } catch {
      return HttpResponse.text('Invalid JSON', { status: 400 })
    }

    const purchase = buySchema.safeParse(body)

    if (!purchase.success) {
      return HttpResponse.text('Invalid purchase', { status: 400 })
    }

    const { consumable, id } = purchase.data
    const instanceId = `${consumable}-buy-${id}`

    if (!timeSkipPurchases.has(instanceId)) {
      const { name, length } = consumables.find(({ internalName }) => internalName === consumable)!

      timeSkipPurchases.set(
        instanceId,
        purchaseConsumable(consumable)
          ? messages.timeSkip(consumable, id, Number(length))
          : messages.warn(`${name} wasn't purchased!`)
      )
    }

    const encoder = new TextEncoder()

    return new HttpResponse(
      new ReadableStream({
        async start (controller) {
          controller.enqueue(encoder.encode(`${messages.warn('Activating now, it may take a minute!')}\n`))
          await delay(2500)
          controller.enqueue(encoder.encode(`${timeSkipPurchases.get(instanceId)}\n`))
          controller.close()
        }
      }),
      { headers: { 'Content-Type': 'application/x-ndjson' } }
    )
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
  ...POSTHandlers,
  ...createConsumeHandlers(purchaseConsumable),
  ...cloudSaveHandlers,
  ...messageHandlers,
  ...paymentHandlers,
  ...subscriptionHandlers,
  ...xsollaHandlers
)
