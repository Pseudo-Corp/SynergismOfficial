/// <reference types="@types/cloudflare-turnstile" />

import i18next from 'i18next'
import { z } from 'zod'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { calculateOffline } from './Calculate'
import { updateGlobalsIsEvent } from './Event'
import { importSynergism } from './ImportExport'
import { QuarkHandler, setQuarkBonus } from './Quark'
import { format, player } from './Synergism'
import { Alert, Notification } from './UpdateHTML'
import { assert } from './Utility'

export type PseudoCoinConsumableNames = 'HAPPY_HOUR_BELL'

// Consts for Patreon Supporter Roles.
const TRANSCENDED_BALLER = '756419583941804072'
const REINCARNATED_BALLER = '758859750070026241'
const ASCENDED_BALLER = '758861068188647444'
const OMEGA_BALLER = '832099983389097995'
const BOOSTER = '677272036820910098'

// Const for Event Roles.
const THANKSGIVING_2023 = '1177364773986386021'
const THANKSGIVING_2024 = '1311161342987603979'
const CONDUCTOR_2023 = '1178131525049520138'
const CONDUCTOR_2024 = '1311164406209450064'
const EIGHT_LEAF = '983484264865730560'
const TEN_LEAF = '1045560188574380042'
const SMITH_INCARNATE = '1045560846169935922'
const SMITH_GOD = '1045562390995009606'
const GOLDEN_SMITH_GOD = '1178125584061173800'
const DIAMOND_SMITH_MESSIAH = '1311165096378105906'

let ws: WebSocket | undefined
let loggedIn = false
let tips = 0

export const isLoggedIn = () => loggedIn
export const getTips = () => tips
export const setTips = (newTips: number) => tips = newTips

export const activeConsumables: Record<PseudoCoinConsumableNames, number> = {
  HAPPY_HOUR_BELL: 0
}

export const allConsumableTimes: Record<PseudoCoinConsumableNames, Array<number>> = {
  HAPPY_HOUR_BELL: []
}

const messageSchema = z.preprocess(
  (data, ctx) => {
    if (typeof data === 'string') {
      try {
        return JSON.parse(data)
      } catch {}
    }

    ctx.addIssue({ code: 'custom', message: 'Invalid message received.' })
  },
  z.union([
    /** Received after the user connects to the websocket */
    z.object({ type: z.literal('join') }),
    z.object({ type: z.literal('error'), message: z.string() }),
    /** Received after a consumable is redeemed (broadcasted to everyone) */
    z.object({ type: z.literal('consumed'), consumable: z.string(), startedAt: z.number().int() }),
    /** Received after a consumable ends (broadcasted to everyone) */
    z.object({ type: z.literal('consumable-ended'), consumable: z.string(), endedAt: z.number().int() }),
    /** Information about currently active consumables */
    z.object({
      type: z.literal('info'),
      active: z.object({
        name: z.string(),
        internalName: z.string(),
        amount: z.number().int(),
        endsAt: z.number().int()
      }).array(),
      tips: z.number().int().nonnegative()
    }),
    z.object({
      type: z.literal('info-all'),
      active: z.object({
        name: z.string(),
        internalName: z.string(),
        endsAt: z.number().int()
      }).array(),
      tips: z.number().int().nonnegative()
    }),
    /** Received after the *user* successfully redeems a consumable. */
    z.object({ type: z.literal('thanks') }),
    /** Received when a user is tipped */
    z.object({ type: z.literal('tips'), tips: z.number().int() }),
    /** Received when a user reconnects, if there are unclaimed tips */
    z.object({ type: z.literal('tip-backlog'), tips: z.number().int() }),
    z.object({ type: z.literal('applied-tip'), amount: z.number(), remaining: z.number() })
  ])
)

/**
 * @see https://discord.com/developers/docs/resources/user#user-object
 */
interface RawUser {
  id: string
  username: string
  discriminator: string
  global_name?: string | null
  avatar: string | null
  bot?: boolean
  system?: boolean
  mfa_enabled?: boolean
  banner?: string | null
  accent_color?: number | null
  locale?: string
  flags?: number
  premium_type?: number
  public_flags?: number
}

/**
 * @see https://discord.com/developers/docs/resources/guild#guild-member-object
 */
interface RawMember {
  user?: RawUser
  nick?: string | null
  avatar?: string | null
  roles: string[]
  joined_at: string | null
  premium_since?: string | null
  deaf: boolean
  mute: boolean
  flags: number
  pending?: boolean
  permissions?: string
  communication_disabled_until?: string | null
}

interface SynergismUserAPIResponse {
  personalBonus: number
  globalBonus: number
  accountType: string
}

interface SynergismDiscordUserAPIResponse extends SynergismUserAPIResponse {
  member: RawMember | null
  accountType: 'discord'
}

interface SynergismPatreonUserAPIResponse extends SynergismUserAPIResponse {
  member: {
    user: {
      username: string | null
    }
    roles: string[]
  }
  accountType: 'patreon'
}

interface SynergismNotLoggedInResponse extends SynergismUserAPIResponse {
  member: null
  accountType: 'none'
}

type CloudSave = null | { save: string }

export async function handleLogin () {
  const subtabElement = document.querySelector('#accountSubTab > div.scrollbarX')!
  const currentBonus = DOMCacheGetOrSet('currentBonus')

  const logoutElement = document.getElementById('logoutButton')
  if (logoutElement !== null) {
    logoutElement.addEventListener('click', logout, { once: true })
    document.getElementById('accountSubTab')?.appendChild(logoutElement)
  }

  const response = await fetch('https://synergism.cc/api/v1/users/me').catch(
    () => new Response(JSON.stringify({ member: null, globalBonus: 0, personalBonus: 0 }), { status: 401 })
  )

  if (!response.ok) {
    currentBonus.textContent =
      `Oh no! I couldn't fetch the bonus... Please send this to Khafra in the Discord: ${await response.text()}.`
    return
  }

  const { globalBonus, member, personalBonus, accountType } = await response.json() as
    | SynergismDiscordUserAPIResponse
    | SynergismPatreonUserAPIResponse
    | SynergismNotLoggedInResponse

  setQuarkBonus(100 * (1 + globalBonus / 100) * (1 + personalBonus / 100) - 100)
  player.worlds = new QuarkHandler(Number(player.worlds))
  loggedIn = accountType !== 'none' && response.ok

  currentBonus.textContent = `Generous patrons give you a bonus of ${globalBonus}% more Quarks!`

  if (location.hostname !== 'synergism.cc') {
    // TODO: better error, make link clickable, etc.
    subtabElement.textContent = 'Login is not available here, go to https://synergism.cc instead!'
  } else if (accountType === 'discord' || accountType === 'patreon') {
    if (member === null) {
      subtabElement.innerHTML = `You are logged in, but your profile couldn't be retrieved from Discord or Patreon.`
      return
    }

    currentBonus.textContent +=
      ` You also receive an extra ${personalBonus}% bonus for being a Patreon member and/or boosting the Discord server! Multiplicative with global bonus!`

    let user: string | null

    if (accountType === 'discord') {
      user = member.nick ?? member.user?.username ?? member.user?.global_name ?? null
    } else {
      user = member.user.username
    }

    const boosted = accountType === 'discord' && (Boolean(member?.premium_since) || member?.roles.includes(BOOSTER))
    const hasTier1 = member.roles.includes(TRANSCENDED_BALLER) ?? false
    const hasTier2 = member.roles.includes(REINCARNATED_BALLER) ?? false
    const hasTier3 = member.roles.includes(ASCENDED_BALLER) ?? false
    const hasTier4 = member.roles.includes(OMEGA_BALLER) ?? false

    const checkMark = (n: number) => {
      return `<span style="color: lime">[✔] {+${n}%}</span>`
    }

    const exMark = '<span style="color: crimson">[✖] {+0%}</span>'

    subtabElement.innerHTML = `
      ${user ? `Hello, ${user}` : 'Hello'}!\n
      Your personal Quark bonus is ${format(personalBonus, 2, true)}%, computed by the following:
      Donator Bonuses (Multiplicative with other bonuses):
      <span style="color: orchid">Transcended Baller</span> [+2%] - ${hasTier1 ? checkMark(2) : exMark}
      <span style="color: green">Reincarnated Baller</span> [+3%] - ${hasTier2 ? checkMark(3) : exMark}
      <span style="color: orange">ASCENDED Baller</span> [+4%] - ${hasTier3 ? checkMark(4) : exMark}
      <span style="color: lightgoldenrodyellow">OMEGA Baller</span> [+5%] - ${hasTier4 ? checkMark(5) : exMark}
      <span style="color: #f47fff">Discord Server Booster</span> [+1%] - ${boosted ? checkMark(1) : exMark}

      Event Bonuses:
      <span style="color: #ffcc00">Thanksgiving 2023</span> [+0.2%] - ${
      member.roles.includes(THANKSGIVING_2023) ? checkMark(0.2) : exMark
    }
      <span style="color: #ffcc00">Thanksgiving 2024</span> [+0.3%] - ${
      member.roles.includes(THANKSGIVING_2024) ? checkMark(0.3) : exMark
    }
      <span style="color: #ffcc00">Conductor 2023</span> [+0.3%] - ${
      member.roles.includes(CONDUCTOR_2023) ? checkMark(0.3) : exMark
    }
      <span style="color: #ffcc00">Conductor 2024</span> [+0.4%] - ${
      member.roles.includes(CONDUCTOR_2024) ? checkMark(0.4) : exMark
    }
      <span style="color: #ffcc00">Eight Leaf</span> [+0.3%] - ${
      member.roles.includes(EIGHT_LEAF) ? checkMark(0.3) : exMark
    }
      <span style="color: #ffcc00">Ten Leaf</span> [+0.4%] - ${
      member.roles.includes(TEN_LEAF) ? checkMark(0.4) : exMark
    }
      <span style="color: #ffcc00">Smith Incarnate</span> [+0.6%] - ${
      member.roles.includes(SMITH_INCARNATE) ? checkMark(0.6) : exMark
    }
      <span style="color: #ffcc00">Smith God</span> [+0.7%] - ${
      member.roles.includes(SMITH_GOD) ? checkMark(0.7) : exMark
    }
      <span style="color: #ffcc00">Golden Smith God</span> [+0.8%] - ${
      member.roles.includes(GOLDEN_SMITH_GOD) ? checkMark(0.8) : exMark
    }
      <span style="color: #ffcc00">Diamond Smith Messiah</span> [+1%] - ${
      member.roles.includes(DIAMOND_SMITH_MESSIAH) ? checkMark(1.2) : exMark
    }

      And Finally...
      <span style="color: lime"> Being <span style="color: lightgoldenrodyellow"> YOURSELF! </span></span> [+1%] - ${
      checkMark(1)
    }

      The current maximum is 16%, by being a Discord server booster and an OMEGA Baller on Patreon!

      More will be incorporated both for general accounts and supporters of the game shortly.
      Become a supporter of development via the link below, and get special bonuses,
      while also improving the Global Bonus for all to enjoy!
      <a href="https://www.patreon.com/synergism" target="_blank" rel="noopener noreferrer nofollow">
      <span style="color: lightgoldenrodyellow">--> PATREON <--</span>
      </a>
    `.trim()

    const cloudSaveElement = document.createElement('button')
    const loadCloudSaveElement = document.createElement('button')

    if (personalBonus > 1) {
      cloudSaveElement.addEventListener('click', saveToCloud)
      cloudSaveElement.style.cssText = 'border: 2px solid #5865F2; height: 25px; width: 150px;'
      cloudSaveElement.textContent = 'Save to Cloud ☁'

      loadCloudSaveElement.addEventListener('click', getCloudSave)
      loadCloudSaveElement.style.cssText = 'border: 2px solid #5865F2; height: 25px; width: 150px;'
      loadCloudSaveElement.textContent = 'Load from Cloud ☽'
    }

    const cloudSaveParent = document.createElement('div')
    cloudSaveParent.style.cssText =
      'display: flex; flex-direction: row; justify-content: space-evenly; padding: 5px; width: 45%; margin: 0 auto;'

    cloudSaveParent.appendChild(cloudSaveElement)
    cloudSaveParent.appendChild(loadCloudSaveElement)

    subtabElement.appendChild(cloudSaveParent)
  } else if (accountType === 'none') {
    // User is not logged in
    subtabElement.querySelector('#open-register')?.addEventListener('click', () => {
      subtabElement.querySelector<HTMLElement>('#register')?.style.setProperty('display', 'flex')
      subtabElement.querySelector<HTMLElement>('#login')?.style.setProperty('display', 'none')
      subtabElement.querySelector<HTMLElement>('#forgotpassword')?.style.setProperty('display', 'none')
      renderCaptcha()
    })

    subtabElement.querySelector('#open-signin')?.addEventListener('click', () => {
      subtabElement.querySelector<HTMLElement>('#register')?.style.setProperty('display', 'none')
      subtabElement.querySelector<HTMLElement>('#login')?.style.setProperty('display', 'flex')
      subtabElement.querySelector<HTMLElement>('#forgotpassword')?.style.setProperty('display', 'none')
      renderCaptcha()
    })

    subtabElement.querySelector('#open-forgotpassword')?.addEventListener('click', () => {
      subtabElement.querySelector<HTMLElement>('#register')?.style.setProperty('display', 'none')
      subtabElement.querySelector<HTMLElement>('#login')?.style.setProperty('display', 'none')
      subtabElement.querySelector<HTMLElement>('#forgotpassword')?.style.setProperty('display', 'flex')
      renderCaptcha()
    })
  }

  if (loggedIn) {
    handleWebSocket()
  }
}

const queue: string[] = []

/**
 * Delays before attempting to re-establish the connection after the socket closes.
 * The delay is reset after a successful connection.
 */
const exponentialBackoff = [5000, 15000, 30000, 60000]
let tries = 0

function resetConsumables () {
  for (const key in activeConsumables) {
    activeConsumables[key as PseudoCoinConsumableNames] = 0
    allConsumableTimes[key as PseudoCoinConsumableNames].length = 0 // Specifically for info-all
  }
}

function handleWebSocket () {
  assert(!ws || ws.readyState === WebSocket.CLOSED, 'WebSocket has been set and is not closed')

  ws = new WebSocket('wss://synergism.cc/consumables/connect')

  ws.addEventListener('close', () => {
    const delay = exponentialBackoff[++tries]

    if (delay !== undefined) {
      setTimeout(() => handleWebSocket(), delay)
    } else {
      Notification(
        'Could not re-establish your connection. Consumables and events related to Consumables will not work.'
      )
      resetConsumables()
    }
  })

  ws.addEventListener('open', () => {
    tries = 0

    for (const message of queue) {
      ws?.send(message)
    }

    queue.length = 0
    sendToWebsocket(JSON.stringify({ type: 'info-all' }))
  })

  ws.addEventListener('message', (ev) => {
    const data = messageSchema.parse(ev.data)
    console.log(data)

    if (data.type === 'error') {
      Notification(data.message, 5_000)
      resetConsumables()
    } else if (data.type === 'consumed') {
      activeConsumables[data.consumable as PseudoCoinConsumableNames]++
      allConsumableTimes[data.consumable as PseudoCoinConsumableNames].push(data.startedAt + 3600 * 1000)
      Notification(`Someone redeemed a(n) ${data.consumable}!`)
    } else if (data.type === 'consumable-ended') {
      activeConsumables[data.consumable as PseudoCoinConsumableNames]--
      // Because of the invariant that the timestamps are sorted, we can just remove the first element
      allConsumableTimes[data.consumable as PseudoCoinConsumableNames].shift()
      Notification(`A(n) ${data.consumable} ended!`)
    } else if (data.type === 'join') {
      Notification('Connection was established!')
    } else if (data.type === 'info') {
      if (data.active.length !== 0) {
        let message = 'The following consumables are active:\n'
        let ends = 0

        for (const { amount, internalName, name, endsAt } of data.active) {
          activeConsumables[internalName as PseudoCoinConsumableNames] = amount
          message += `${name} (x${amount})`
          ends = Math.max(ends, endsAt)
        }

        Notification(message)
      }

      tips = data.tips
    } else if (data.type === 'info-all') { // new, needs to be checked
      resetConsumables() // So that we can get an accurate count each time
      if (data.active.length !== 0) {
        let message = 'The following consumables are active:\n'

        for (const { internalName, endsAt } of data.active) {
          activeConsumables[internalName as PseudoCoinConsumableNames]++
          allConsumableTimes[internalName as PseudoCoinConsumableNames].push(endsAt)
        }
        // Are these already in order? I assume so but just to be sure
        allConsumableTimes.HAPPY_HOUR_BELL.sort((a, b) => a - b)
        message += `Happy Hour Bell (x${activeConsumables.HAPPY_HOUR_BELL})`

        Notification(message)
      }

      tips = data.tips
    } else if (data.type === 'thanks') {
      Alert(i18next.t('pseudoCoins.consumables.thanks'))
    } else if (data.type === 'tip-backlog' || data.type === 'tips') {
      tips += data.tips

      Notification(i18next.t('pseudoCoins.consumables.tipReceived', { offlineTime: data.tips }))
    } else if (data.type === 'applied-tip') {
      tips = data.remaining
      calculateOffline(data.amount * 60)
      DOMCacheGetOrSet('exitOffline').style.visibility = 'unset'
    }

    updateGlobalsIsEvent()
  })
}

export function sendToWebsocket (message: string) {
  if (ws?.readyState !== WebSocket.OPEN) {
    queue.push(message)
    return
  }

  ws.send(message)
}

async function logout () {
  await fetch('https://synergism.cc/api/v1/users/logout')
  await Alert(i18next.t('account.logout'))

  location.reload()
}

async function saveToCloud () {
  const save = localStorage.getItem('Synergysave2')

  if (typeof save !== 'string') {
    console.log('Yeah, no save here.')
    return
  }

  const body = new FormData()
  body.set('savefile', new File([save], 'file.txt'), 'file.txt')

  const response = await fetch('https://synergism.cc/api/v1/saves/upload', {
    method: 'POST',
    body
  })

  if (!response.ok) {
    await Alert(`Received an error: ${await response.text()}`)
    return
  }
}

async function getCloudSave () {
  const response = await fetch('https://synergism.cc/api/v1/saves/get')
  const save = await response.json() as CloudSave

  if (save !== null) {
    importSynergism(save.save)
  }
}

const hasCaptcha = new WeakSet<HTMLElement>()

export function renderCaptcha () {
  const captchaElements = Array.from<HTMLElement>(document.querySelectorAll('.turnstile'))
  const visible = captchaElements.find((el) => el.offsetParent !== null)

  if (visible && !hasCaptcha.has(visible)) {
    turnstile.render(visible, {
      sitekey: visible.getAttribute('data-sitekey')!,
      'error-callback' () {},
      retry: 'never'
    })

    hasCaptcha.add(visible)
  }
}
