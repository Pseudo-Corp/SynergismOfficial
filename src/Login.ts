/// <reference types="@types/cloudflare-turnstile" />

import DOMPurify from 'dompurify'
import i18next from 'i18next'
import { z } from 'zod'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { calculateAmbrosiaGenerationSpeed, calculateOffline, calculateRedAmbrosiaGenerationSpeed } from './Calculate'
import { updateGlobalsIsEvent } from './Event'
import { addTimers, automaticTools } from './Helper'
import { exportData, importSynergism, saveFilename } from './ImportExport'
import { updatePseudoCoins } from './purchases/UpgradesSubtab'
import { QuarkHandler, refreshQuarkBonus, setQuarkBonus } from './Quark'
import { updatePrestigeCount, updateReincarnationCount, updateTranscensionCount } from './Reset'
import { format, player, saveSynergy } from './Synergism'
import { Alert, Notification } from './UpdateHTML'
import { assert, btoa } from './Utility'

export type PseudoCoinConsumableNames = 'HAPPY_HOUR_BELL'

type PseudoCoinTimeskipNames =
  | 'SMALL_GLOBAL_TIMESKIP'
  | 'LARGE_GLOBAL_TIMESKIP'
  | 'JUMBO_GLOBAL_TIMESKIP'
  | 'SMALL_ASCENSION_TIMESKIP'
  | 'LARGE_ASCENSION_TIMESKIP'
  | 'JUMBO_ASCENSION_TIMESKIP'
  | 'SMALL_AMBROSIA_TIMESKIP'
  | 'LARGE_AMBROSIA_TIMESKIP'
  | 'JUMBO_AMBROSIA_TIMESKIP'

interface Consumable {
  /** array of unix timestamps for when each individual consumable ends */
  ends: number[]
  amount: number
  displayName: string
}

interface Save {
  id: number
  name: string
  uploadedAt: string
  save: string
  actionButtons?: {
    download: HTMLButtonElement
    load: HTMLButtonElement
    delete: HTMLButtonElement
  }
}

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
let subscription: SubscriptionMetadata = null

const cloudSaves: Save[] = []

export const getTips = () => tips
export const setTips = (newTips: number) => tips = newTips
export const getSubMetadata = () => subscription

export const allDurableConsumables: Record<PseudoCoinConsumableNames, Consumable> = {
  HAPPY_HOUR_BELL: {
    amount: 0,
    ends: [],
    displayName: ''
  }
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
    z.object({
      type: z.literal('consumed'),
      consumable: z.string(),
      displayName: z.string(),
      startedAt: z.number().int()
    }),
    /** Received after a consumable ends (broadcasted to everyone) */
    z.object({
      type: z.literal('consumable-ended'),
      consumable: z.string(),
      name: z.string(),
      endedAt: z.number().int()
    }),
    /** Information about all currently active consumables, received when the connection opens. */
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
    z.object({ type: z.literal('applied-tip'), amount: z.number(), remaining: z.number() }),

    /** Received when a timeSkip is used */
    z.object({
      type: z.literal('time-skip'),
      consumableName: z.string(),
      id: z.string().uuid(),
      amount: z.number().int()
    }),

    /** A warning - should *NOT* disconnect from the WebSocket */
    z.object({ type: z.literal('warn'), message: z.string() })
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

interface PatreonUser {
  data: {
    attributes: {
      email: string
      full_name?: string | null | undefined
    }
    id: string
  }
}

interface AccountMetadata {
  discord: RawMember
  patreon: PatreonUser
  email: { email: string; verified: boolean }
  none: null
}

interface BonusTypes {
  quarks: number
}

type SubscriptionMetadata = {
  provider: 'paypal' | 'stripe' | 'patreon'
  tier: number
} | null

interface SynergismUserAPIResponse<T extends keyof AccountMetadata> {
  personalBonus: number
  globalBonus: number
  member: AccountMetadata[T]
  accountType: T
  bonus: BonusTypes
  subscriptionTier: number
  subscription: SubscriptionMetadata
  error?: unknown
}

const isDiscordAccount = (
  account: SynergismUserAPIResponse<keyof AccountMetadata>
): account is SynergismUserAPIResponse<'discord'> => account.accountType === 'discord'
const isPatreonAccount = (
  account: SynergismUserAPIResponse<keyof AccountMetadata>
): account is SynergismUserAPIResponse<'patreon'> => account.accountType === 'patreon'
const isEmailAccount = (
  account: SynergismUserAPIResponse<keyof AccountMetadata>
): account is SynergismUserAPIResponse<'email'> => account.accountType === 'email'
const hasAccount = (
  account: SynergismUserAPIResponse<keyof AccountMetadata>
): account is SynergismUserAPIResponse<'discord' | 'patreon' | 'email'> => account.accountType !== 'none'

export async function handleLogin () {
  const subtabElement = document.querySelector('#accountSubTab div#left.scrollbarX')!
  const currentBonus = DOMCacheGetOrSet('currentBonus')

  const logoutElement = document.getElementById('logoutButton')
  if (logoutElement !== null) {
    logoutElement.addEventListener('click', logout, { once: true })
    document.getElementById('accountSubTab')?.appendChild(logoutElement)
  }

  const response = await fetch('https://synergism.cc/api/v1/users/me', { credentials: 'include' }).catch(
    () =>
      new Response(
        JSON.stringify(
          {
            member: null,
            globalBonus: 0,
            personalBonus: 0,
            accountType: 'none',
            bonus: { quarks: 0 },
            subscriptionTier: 0,
            subscription: null
          } satisfies SynergismUserAPIResponse<'none'>
        ),
        { status: 401 }
      )
  )

  const account = await response.json() as SynergismUserAPIResponse<keyof AccountMetadata>
  const { globalBonus, personalBonus, subscription: sub } = account

  setQuarkBonus(personalBonus, globalBonus)
  setInterval(() => refreshQuarkBonus(), 1000 * 60 * 15)
  player.worlds = new QuarkHandler(Number(player.worlds))
  loggedIn = hasAccount(account)
  subscription = sub

  currentBonus.textContent = i18next.t('settings.quarkBonusSimple', { globalBonus })

  // biome-ignore lint/suspicious/noConfusingLabels: it's not confusing or suspicious
  generateSubtab: {
    if (location.hostname !== 'synergism.cc') {
      subtabElement.innerHTML =
        'Login is not available here, go to <a href="https://synergism.cc">https://synergism.cc</a> instead!'
    } else if (hasAccount(account)) {
      if (Object.keys(account.member).length === 0) {
        subtabElement.innerHTML = `You are logged in, but your profile couldn't be retrieved from Discord or Patreon.`
        break generateSubtab
      }

      if (account.error) {
        subtabElement.innerHTML =
          `You are logged in, but retrieving your profile yielded the following error: ${account.error}`
        break generateSubtab
      }

      currentBonus.textContent = i18next.t('settings.quarkBonusExtended', { globalBonus, personalBonus })

      let user: string | null = null
      const discord = isDiscordAccount(account)

      if (discord) {
        user = account.member.nick ?? account.member.user?.username ?? account.member.user?.global_name ?? null
      } else if (isEmailAccount(account)) {
        user = account.member.email
      } else if (isPatreonAccount(account)) {
        user = account.member?.data?.attributes?.email ?? null
      }

      if (user !== null) {
        user = DOMPurify.sanitize(user)
      }

      const boosted = discord && (Boolean(account.member?.premium_since) || account.member?.roles.includes(BOOSTER))
      // It is possible for someone to have the roles through the Patreon integration with Discord, yet not have their
      // patreon linked to their Synergism (Discord/email) account.
      const hasTier1 = subscription?.tier === 1 || (discord && account.member.roles?.includes(TRANSCENDED_BALLER))
      const hasTier2 = subscription?.tier === 2 || (discord && account.member.roles?.includes(REINCARNATED_BALLER))
      const hasTier3 = subscription?.tier === 3 || (discord && account.member.roles?.includes(ASCENDED_BALLER))
      const hasTier4 = subscription?.tier === 4 || (discord && account.member.roles?.includes(OMEGA_BALLER))

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
        discord && account.member.roles?.includes(THANKSGIVING_2023) ? checkMark(0.2) : exMark
      }
      <span style="color: #ffcc00">Thanksgiving 2024</span> [+0.3%] - ${
        discord && account.member.roles?.includes(THANKSGIVING_2024) ? checkMark(0.3) : exMark
      }
      <span style="color: #ffcc00">Conductor 2023</span> [+0.3%] - ${
        discord && account.member.roles?.includes(CONDUCTOR_2023) ? checkMark(0.3) : exMark
      }
      <span style="color: #ffcc00">Conductor 2024</span> [+0.4%] - ${
        discord && account.member.roles?.includes(CONDUCTOR_2024) ? checkMark(0.4) : exMark
      }
      <span style="color: #ffcc00">Eight Leaf</span> [+0.3%] - ${
        discord && account.member.roles?.includes(EIGHT_LEAF) ? checkMark(0.3) : exMark
      }
      <span style="color: #ffcc00">Ten Leaf</span> [+0.4%] - ${
        discord && account.member.roles?.includes(TEN_LEAF) ? checkMark(0.4) : exMark
      }
      <span style="color: #ffcc00">Smith Incarnate</span> [+0.6%] - ${
        discord && account.member.roles?.includes(SMITH_INCARNATE) ? checkMark(0.6) : exMark
      }
      <span style="color: #ffcc00">Smith God</span> [+0.7%] - ${
        discord && account.member.roles?.includes(SMITH_GOD) ? checkMark(0.7) : exMark
      }
      <span style="color: #ffcc00">Golden Smith God</span> [+0.8%] - ${
        discord && account.member.roles?.includes(GOLDEN_SMITH_GOD) ? checkMark(0.8) : exMark
      }
      <span style="color: #ffcc00">Diamond Smith Messiah</span> [+1%] - ${
        discord && account.member.roles?.includes(DIAMOND_SMITH_MESSIAH) ? checkMark(1.2) : exMark
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
    } else if (!hasAccount(account)) {
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
    } else {
      assert(false, `unknown account type ${account.accountType}`)
    }
  }

  if (loggedIn) {
    handleWebSocket()
    handleCloudSaves()
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
  for (const key of Object.keys(allDurableConsumables)) {
    allDurableConsumables[key as PseudoCoinConsumableNames] = {
      amount: 0,
      ends: [],
      displayName: ''
    }
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
  })

  ws.addEventListener('message', (ev) => {
    const data = messageSchema.parse(ev.data)

    if (data.type === 'warn') {
      Notification(data.message, 5_000)
    } else if (data.type === 'error') {
      Notification(data.message, 5_000)
      resetConsumables()
    } else if (data.type === 'consumed') {
      const consumable = allDurableConsumables[data.consumable as PseudoCoinConsumableNames]
      consumable.ends.push(data.startedAt + 3600 * 1000)
      consumable.amount++

      const article = /^[AEIOU]/i.test(data.displayName) ? 'an' : 'a'
      Notification(`Someone redeemed ${article} ${data.displayName}!`)
    } else if (data.type === 'consumable-ended') {
      // Because of the invariant that the timestamps are sorted, we can just remove the first element
      const consumable = allDurableConsumables[data.consumable as PseudoCoinConsumableNames]
      consumable.ends.shift()
      consumable.amount--

      const article = /^[AEIOU]/i.test(data.name) ? 'An' : 'A'
      Notification(`${article} ${data.name} ended!`)
    } else if (data.type === 'join') {
      Notification('Connection was established!')
    } else if (data.type === 'info-all') {
      resetConsumables() // So that we can get an accurate count each time
      if (data.active.length !== 0) {
        let message = 'The following consumables are active:\n'

        for (const { internalName, endsAt, name } of data.active) {
          const consumable = allDurableConsumables[internalName as PseudoCoinConsumableNames]
          consumable.ends.push(endsAt)
          consumable.amount++
          consumable.displayName = name
        }
        // Are these already in order? I assume so but just to be sure
        for (const item of Object.values(allDurableConsumables)) {
          item.ends.sort((a, b) => a - b)
        }

        for (const { amount, displayName } of Object.values(allDurableConsumables)) {
          message += `${displayName} (x${amount})`
        }

        Notification(message)
      }

      tips = data.tips
    } else if (data.type === 'thanks') {
      Alert(i18next.t('pseudoCoins.consumables.thanks'))
      updatePseudoCoins()
    } else if (data.type === 'tip-backlog' || data.type === 'tips') {
      tips += data.tips

      Notification(i18next.t('pseudoCoins.consumables.tipReceived', { offlineTime: data.tips }))
    } else if (data.type === 'applied-tip') {
      tips = data.remaining
      calculateOffline(data.amount * 60, true)
      DOMCacheGetOrSet('exitOffline').style.visibility = 'unset'
    } else if (data.type === 'time-skip') {
      const timeSkipName = data.consumableName as PseudoCoinTimeskipNames
      const minutes = data.amount

      // Do the thing with the timeSkip
      activateTimeSkip(timeSkipName, minutes)
      saveSynergy()

      sendToWebsocket(JSON.stringify({
        type: 'confirm',
        id: data.id,
        consumableId: data.consumableName
      }))

      setTimeout(() => updatePseudoCoins(), 4000)
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

const hasCaptcha = new WeakSet<HTMLElement>()

export function renderCaptcha () {
  const captchaElements = Array.from<HTMLElement>(document.querySelectorAll('.turnstile'))
  const visible = captchaElements.find((el) => el.offsetParent !== null)

  if (visible && !hasCaptcha.has(visible)) {
    // biome-ignore lint/correctness/noUndeclaredVariables: declared in types as a global
    turnstile.render(visible, {
      sitekey: visible.getAttribute('data-sitekey')!,
      'error-callback' () {},
      retry: 'never'
    })

    hasCaptcha.add(visible)
  }
}

const createFastForward = (name: PseudoCoinTimeskipNames, minutes: number) => {
  const seconds = minutes * 60
  // Only display relevant fast forward stats based on which one was purchased.
  const fastForwardStat = document.getElementsByClassName('fastForwardStat') as HTMLCollectionOf<HTMLElement>
  for (let i = 0; i < fastForwardStat.length; i++) {
    const element = fastForwardStat[i]
    if (
      (element.classList.contains('globalSkip') && name.includes('GLOBAL'))
      || (element.classList.contains('ascensionSkip') && name.includes('ASCENSION'))
      || (element.classList.contains('ambrosiaSkip') && name.includes('AMBROSIA'))
    ) {
      element.classList.add('fastForwardVisible')
    } else {
      element.classList.remove('fastForwardVisible')
    }
  }

  if (name.includes('GLOBAL')) {
    const beforeStats = {
      prestigeTime: player.prestigecounter,
      prestigeCount: player.prestigeCount,
      transcensionTime: player.transcendcounter,
      transcensionCount: player.transcendCount,
      reincarnationTime: player.reincarnationcounter,
      reincarnationCount: player.reincarnationCount
    }

    // Timer Things
    addTimers('prestige', seconds)
    addTimers('transcension', seconds)
    addTimers('reincarnation', seconds)
    automaticTools('antSacrifice', seconds)
    updatePrestigeCount(seconds / Math.max(0.25, player.fastestprestige))
    updateTranscensionCount(seconds / Math.max(0.25, player.fastesttranscend))
    updateReincarnationCount(seconds / Math.max(0.25, player.fastestreincarnate))

    // Add Obt/Off, why not?
    automaticTools('addObtainium', seconds)
    automaticTools('addOfferings', seconds)

    const addedStats = {
      prestigeTime: player.prestigecounter - beforeStats.prestigeTime,
      prestigeCount: player.prestigeCount - beforeStats.prestigeCount,
      transcensionTime: player.transcendcounter - beforeStats.transcensionTime,
      transcensionCount: player.transcendCount - beforeStats.transcensionCount,
      reincarnationTime: player.reincarnationcounter - beforeStats.reincarnationTime,
      reincarnationCount: player.reincarnationCount - beforeStats.reincarnationCount,
      antTimer: seconds
    }

    DOMCacheGetOrSet('fastForwardTimer').innerHTML = i18next.t('fastForward.global', {
      time: format(seconds, 0, true)
    })
    DOMCacheGetOrSet('fastForwardPrestigeCount').innerHTML = i18next.t('offlineProgress.prestigeCount', {
      value: Math.floor(addedStats.prestigeCount)
    })
    DOMCacheGetOrSet('fastForwardPrestigeTimer').innerHTML = i18next.t('offlineProgress.currentPrestigeTimer', {
      value: format(addedStats.prestigeTime, 2, true)
    })
    DOMCacheGetOrSet('fastForwardTranscensionCount').innerHTML = i18next.t('offlineProgress.transcensionCount', {
      value: Math.floor(addedStats.transcensionCount)
    })
    DOMCacheGetOrSet('fastForwardTranscensionTimer').innerHTML = i18next.t(
      'offlineProgress.currentTranscensionCounter',
      {
        value: format(addedStats.transcensionTime, 2, true)
      }
    )
    DOMCacheGetOrSet('fastForwardReincarnationCount').innerHTML = i18next.t('offlineProgress.reincarnationCount', {
      value: Math.floor(addedStats.reincarnationCount)
    })
    DOMCacheGetOrSet('fastForwardReincarnationTimer').innerHTML = i18next.t(
      'offlineProgress.currentReincarnationTimer',
      {
        value: format(addedStats.reincarnationTime, 2, true)
      }
    )
    DOMCacheGetOrSet('fastForwardAntTimer').innerHTML = i18next.t('offlineProgress.ingameAntSacTimer', {
      value: format(addedStats.antTimer, 0, true)
    })
  }

  if (name.includes('ASCENSION')) {
    const beforeStats = {
      ascensionTime: player.ascensionCounter
    }

    // Timer Things
    addTimers('ascension', seconds)

    const addedStats = {
      ascensionTime: player.ascensionCounter - beforeStats.ascensionTime
    }

    DOMCacheGetOrSet('fastForwardTimer').innerHTML = i18next.t('fastForward.ascension', {
      time: format(seconds, 0, true)
    })
    DOMCacheGetOrSet('fastForwardAscensionTimer').innerHTML = i18next.t('offlineProgress.currentAscensionTimer', {
      value: format(addedStats.ascensionTime, 2, true)
    })
  }

  if (name.includes('AMBROSIA')) {
    const beforeStats = {
      redAmbrosia: player.lifetimeRedAmbrosia,
      ambrosia: player.lifetimeAmbrosia
    }

    // Timer Things
    addTimers('ambrosia', seconds)
    addTimers('redAmbrosia', seconds)

    const addedStats = {
      redAmbrosia: player.lifetimeRedAmbrosia - beforeStats.redAmbrosia,
      ambrosia: player.lifetimeAmbrosia - beforeStats.ambrosia,
      ambrosiaBarFill: calculateAmbrosiaGenerationSpeed() * seconds,
      redBarFill: calculateRedAmbrosiaGenerationSpeed() * seconds
    }

    DOMCacheGetOrSet('fastForwardTimer').innerHTML = i18next.t('fastForward.ambrosia', {
      time: format(seconds, 0, true)
    })
    DOMCacheGetOrSet('fastForwardAmbrosiaCount').innerHTML = i18next.t('offlineProgress.ambrosia', {
      value: format(addedStats.ambrosia, 0, true),
      value2: format(addedStats.ambrosiaBarFill, 0, true)
    })
    DOMCacheGetOrSet('fastForwardRedAmbrosiaCount').innerHTML = i18next.t('offlineProgress.redAmbrosia', {
      value: format(addedStats.redAmbrosia, 0, true),
      value2: format(addedStats.redBarFill, 0, true)
    })
  }

  DOMCacheGetOrSet('fastForwardContainer').style.display = 'flex'
}

export const exitFastForward = () => {
  DOMCacheGetOrSet('fastForwardContainer').style.display = 'none'
}

const activateTimeSkip = (name: PseudoCoinTimeskipNames, minutes: number) => {
  createFastForward(name, minutes)
  // TODO for Platonic: i18n this shit
  switch (name) {
    case 'SMALL_GLOBAL_TIMESKIP':
      Notification('You have activated a small global timeskip! Enjoy!')
      break
    case 'LARGE_GLOBAL_TIMESKIP':
      Notification('You have activated a large global timeskip! Enjoy!')
      break
    case 'JUMBO_GLOBAL_TIMESKIP':
      Notification('You have activated a JUMBO global timeskip! Enjoy!')
      break
    case 'SMALL_ASCENSION_TIMESKIP':
      Notification('You have activated a small ascension timeskip! Enjoy!')
      break
    case 'LARGE_ASCENSION_TIMESKIP':
      Notification('You have activated a large ascension timeskip! Enjoy!')
      break
    case 'JUMBO_ASCENSION_TIMESKIP':
      Notification('You have activated a JUMBO ascension timeskip! Enjoy!')
      break
    case 'SMALL_AMBROSIA_TIMESKIP':
      Notification('You have activated a small ambrosia timeskip! Enjoy!')
      break
    case 'LARGE_AMBROSIA_TIMESKIP':
      Notification('You have activated a large ambrosia timeskip! Enjoy!')
      break
    case 'JUMBO_AMBROSIA_TIMESKIP':
      Notification('You have activated a JUMBO ambrosia timeskip! Enjoy!')
      break
  }
}

function handleCloudSaves () {
  const subtabElement = document.querySelector('#accountSubTab div#right.scrollbarX')!
  const table = subtabElement.querySelector('#table > #dataGrid')!

  const uploadButton = subtabElement.querySelector<HTMLButtonElement>('button#upload')
  const transferButton = subtabElement.querySelector<HTMLButtonElement>('button#transfer')

  function populateTable () {
    fetch('/saves/retrieve/all')
      .then((response) => response.json())
      .then(($saves: Save[]) => {
        cloudSaves.length = 0
        cloudSaves.push(...$saves)

        const existingRows = table.querySelectorAll('.grid-row')
        existingRows.forEach((row) => row.remove())

        const content = table.querySelector('.details-content')
        content?.remove()

        if (cloudSaves.length === 0) {
          const emptyDiv = document.createElement('div')
          emptyDiv.className = 'grid-row empty-state'
          emptyDiv.style.gridColumn = '1 / -1'
          emptyDiv.textContent = i18next.t('account.noSaves')
          table.appendChild(emptyDiv)
          return
        }

        cloudSaves.forEach((save, index) => {
          const { id, name, uploadedAt } = save
          const rowDiv = document.createElement('div')
          rowDiv.className = 'grid-row'
          rowDiv.style.display = 'contents'

          const idCell = document.createElement('div')
          idCell.className = 'grid-cell id-cell'
          idCell.textContent = `#${id}`

          const nameCell = document.createElement('div')
          nameCell.className = 'grid-cell name-cell'
          nameCell.textContent = name.length > 60 ? `${name.slice(0, 60)}...` : name

          const dateCell = document.createElement('div')
          dateCell.className = 'grid-cell date-cell'
          dateCell.textContent = new Date(uploadedAt).toLocaleString()

          rowDiv.appendChild(idCell)
          rowDiv.appendChild(nameCell)
          rowDiv.appendChild(dateCell)

          if (index % 2 === 0) {
            idCell.classList.add('alt-row')
            nameCell.classList.add('alt-row')
            dateCell.classList.add('alt-row')
          }

          // Create the expandable details row
          const detailsRow = document.createElement('div')
          detailsRow.className = 'grid-details-row'
          detailsRow.style.display = 'none'
          detailsRow.style.gridColumn = '1 / -1'

          const detailsContent = document.createElement('div')
          detailsContent.className = 'details-content'

          const actionsDiv = document.createElement('div')
          actionsDiv.className = 'details-actions'

          const downloadBtn = document.createElement('button')
          downloadBtn.className = 'btn-download'
          downloadBtn.setAttribute('data-id', id.toString())
          downloadBtn.textContent = i18next.t('account.download')

          const loadBtn = document.createElement('button')
          loadBtn.className = 'btn-load'
          loadBtn.setAttribute('data-id', id.toString())
          loadBtn.textContent = i18next.t('account.loadSave')

          const deleteBtn = document.createElement('button')
          deleteBtn.className = 'btn-delete'
          deleteBtn.setAttribute('data-id', id.toString())
          deleteBtn.textContent = i18next.t('account.delete')

          actionsDiv.appendChild(downloadBtn)
          actionsDiv.appendChild(loadBtn)
          actionsDiv.appendChild(deleteBtn)
          detailsContent.appendChild(actionsDiv)
          detailsRow.appendChild(detailsContent)

          save.actionButtons = {
            download: downloadBtn,
            load: loadBtn,
            delete: deleteBtn
          }

          rowDiv.addEventListener('click', () => {
            const isVisible = detailsRow.style.display !== 'none'

            const allDetailsRows = table.querySelectorAll<HTMLElement>('.grid-details-row')
            allDetailsRows.forEach((row) => {
              if (row !== detailsRow) {
                row.style.display = 'none'
              }
            })

            detailsRow.style.display = isVisible ? 'none' : 'block'
          })

          detailsContent.addEventListener('click', (e) => {
            e.stopPropagation()

            const target = e.target as HTMLElement
            const saveId = Number(target.getAttribute('data-id'))

            if (target.classList.contains('btn-download')) {
              handleDownload(saveId)
            } else if (target.classList.contains('btn-load')) {
              handleLoadSave(saveId)
            } else if (target.classList.contains('btn-delete')) {
              handleDeleteSave(saveId)
            }
          })

          table.appendChild(rowDiv)
          table.appendChild(detailsRow)
        })

        async function decodeSave (save: string) {
          const decoded = atob(save)
          const bytes = new Uint8Array(decoded.length)
          for (let i = 0; i < decoded.length; i++) {
            bytes[i] = decoded.charCodeAt(i)
          }

          const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))
          const textBody = await new Response(stream).text()
          const encoder = new TextEncoder()
          const jsonBytes = encoder.encode(textBody)
          const final = btoa(String.fromCharCode(...jsonBytes))

          return final
        }

        async function handleDownload (saveId: number) {
          const save = cloudSaves.find((save) => saveId === save.id)

          if (!save) {
            Alert(i18next.t('account.noSaveFound'))
            return
          }

          const decoded = await decodeSave(save.save)

          if (decoded === null) {
            Alert('Please send this to Khafra')
            return
          }

          await exportData(decoded, save.name)
          Alert(i18next.t('account.downloadComplete'))
        }

        async function handleLoadSave (saveId: number) {
          const save = cloudSaves.find((save) => saveId === save.id)

          if (!save) {
            Alert(i18next.t('account.noSaveFound'))
            return
          }

          const decoded = await decodeSave(save.save)
          importSynergism(decoded)
        }

        async function handleDeleteSave (saveId: number) {
          const save = cloudSaves.find((save) => saveId === save.id)

          if (!save) {
            Alert(i18next.t('account.noSaveFound'))
            return
          }

          // Disable the action buttons during deletion
          if (save.actionButtons) {
            save.actionButtons.download.disabled = true
            save.actionButtons.load.disabled = true
            save.actionButtons.delete.disabled = true
            save.actionButtons.delete.textContent = 'Deleting...'
          }

          const response = await fetch('/saves/delete', {
            method: 'DELETE',
            body: JSON.stringify({ name: save.name })
          })

          if (response.ok) {
            Alert(i18next.t('account.deletedSave', { name: save.name }))
          } else {
            console.log(response)
            Alert(i18next.t('account.notDeleted'))

            if (save.actionButtons) {
              save.actionButtons.download.disabled = false
              save.actionButtons.load.disabled = false
              save.actionButtons.delete.disabled = false
              save.actionButtons.delete.textContent = i18next.t('account.delete')
            }
          }

          populateTable()
        }
      })
  }

  populateTable()

  // Handle uploading savefiles
  uploadButton?.addEventListener('click', () => {
    uploadButton.disabled = true
    const originalText = uploadButton.textContent
    uploadButton.innerHTML = '<span class="spinner"></span> Uploading...'

    const name = saveFilename()
    const save = localStorage.getItem('Synergysave2')
    assert(save !== null, 'no save')

    const fd = new FormData()
    fd.set('file', new File([save], name))
    fd.set('name', name)

    fetch('/saves/upload', {
      method: 'POST',
      body: fd
    }).then((response) => {
      if (!response.ok) {
        throw new TypeError(`Received status ${response.status}`)
      }

      uploadButton.textContent = i18next.t('settings.cloud.uploadSuccess')
      populateTable()
    }).catch((e) => {
      console.error(e)
      uploadButton.textContent = i18next.t('settings.cloud.uploadFailed')
    }).finally(() => {
      setTimeout(() => {
        uploadButton.disabled = false
        uploadButton.textContent = originalText
      }, 5000)
    })
  })

  transferButton?.addEventListener('click', () => {
    transferButton.disabled = true
    const originalText = transferButton.textContent
    transferButton.innerHTML = '<span class="spinner"></span> Transferring...'

    fetch('/saves/transfer').then((response) => {
      if (!response.ok) {
        throw new TypeError(`Received status ${response.status}`)
      }

      transferButton.textContent = i18next.t('settings.cloud.transferSuccess')
      populateTable()
    }).catch((e) => {
      console.error(e)
      transferButton.textContent = i18next.t('settings.cloud.transferFailed')
    }).finally(() => {
      setTimeout(() => {
        transferButton.disabled = false
        transferButton.textContent = originalText
      }, 5000)
    })
  })
}
