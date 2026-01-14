/// <reference types="@types/cloudflare-turnstile" />

import DOMPurify from 'dompurify'
import i18next from 'i18next'
import { z } from 'zod'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { calculateAmbrosiaGenerationSpeed, calculateOffline, calculateRedAmbrosiaGenerationSpeed } from './Calculate'
import { updateGlobalsIsEvent } from './Event'
import { addTimers, automaticTools } from './Helper'
import { exportData, importSynergism, saveFilename } from './ImportExport'
import { updateLotusDisplay } from './purchases/ConsumablesTab'
import { updatePseudoCoins } from './purchases/UpgradesSubtab'
import { QuarkHandler, setPersonalQuarkBonus } from './Quark'
import { updatePrestigeCount, updateReincarnationCount, updateTranscensionCount } from './Reset'
import { format, player, saveSynergy } from './Synergism'
import { Alert, Notification } from './UpdateHTML'
import { assert, btoa, isomorphicDecode } from './Utility'

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
const THANKSGIVING_2025 = '1443340983012954332'
const CONDUCTOR_2023 = '1178131525049520138'
const CONDUCTOR_2024 = '1311164406209450064'
const CONDUCTOR_2025 = '1444405599600115875'
const EIGHT_LEAF = '983484264865730560'
const TEN_LEAF = '1045560188574380042'
const SMITH_INCARNATE = '1045560846169935922'
const SMITH_GOD = '1045562390995009606'
const GOLDEN_SMITH_GOD = '1178125584061173800'
const DIAMOND_SMITH_MESSIAH = '1311165096378105906'
const MYTHOS_SMITH = '1443012119455994046'

let ws: WebSocket | undefined
let loggedIn = false
let tips = 0
let ownedLotus = 0
let usedLotus = 0
let subscription: SubscriptionMetadata = null
let lotusTimeExpiresAt: number | undefined = undefined

const cloudSaves: Save[] = []

export const isLoggedIn = () => loggedIn

export const getTips = () => tips
export const setTips = (newTips: number) => tips = newTips

export const getOwnedLotus = () => ownedLotus
export const getUsedLotus = () => usedLotus
export const getLotusTimeExpiresAt = () => lotusTimeExpiresAt

export const getSubMetadata = () => subscription
// For testing purposes only
export const setSubMetadata = (newSub: SubscriptionMetadata) => {
  subscription = newSub
}

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
      name: z.string()
    }),
    /** Information about all currently active consumables, received when the connection opens. */
    z.object({
      type: z.literal('info-all'),
      active: z.object({
        name: z.string(),
        internalName: z.string(),
        endsAt: z.number().int()
      }).array(),
      tips: z.number().int().nonnegative(),
      inventory: z.object({
        type: z.literal('LOTUS'),
        amount: z.number().int().gte(0),
        used: z.number().int().gte(0)
      }).array()
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

    /** Received when a player *buys* a Lotus Package */
    z.object({
      type: z.literal('lotus'),
      consumableName: z.string(),
      amount: z.number().int()
    }),

    /** Received when a player *consumes* a Lotus */
    z.object({
      type: z.literal('applied-lotus'),
      remaining: z.number(),
      lifetimePurchased: z.number()
    }),

    z.object({ type: z.literal('lotus-ended') }),

    z.object({
      type: z.literal('lotus-active'),
      remainingMs: z.number()
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

export type SubscriptionProvider = 'paypal' | 'stripe' | 'patreon'

export type SubscriptionMetadata = {
  provider: SubscriptionProvider
  tier: number
} | null

interface SynergismUserAPIResponse<T extends keyof AccountMetadata> {
  personalBonus: number
  member: AccountMetadata[T]
  accountType: T
  bonus: BonusTypes
  error?: unknown
  subscription: SubscriptionMetadata
  linkedAccounts: string[]
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

  const logoutElement = document.getElementById('logoutButton')
  if (logoutElement !== null) {
    logoutElement.addEventListener('click', logout, { once: true })
    document.getElementById('accountSubTab')?.appendChild(logoutElement)
  }

  const response = await fetch('https://synergism.cc/api/v1/users/me', { credentials: 'same-origin' }).catch(
    () =>
      new Response(
        JSON.stringify(
          {
            member: null,
            personalBonus: 0,
            accountType: 'none',
            bonus: { quarks: 0 },
            subscription: null,
            linkedAccounts: []
          } satisfies SynergismUserAPIResponse<'none'>
        ),
        { status: 401 }
      )
  )

  const account = await response.json() as SynergismUserAPIResponse<keyof AccountMetadata>
  const { personalBonus, subscription: sub, linkedAccounts } = account

  setPersonalQuarkBonus(personalBonus)
  player.worlds = new QuarkHandler(Number(player.worlds))

  loggedIn = hasAccount(account)
  subscription = sub

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
      const hasTier1 = sub?.tier === 1 || (discord && account.member.roles?.includes(TRANSCENDED_BALLER))
      const hasTier2 = sub?.tier === 2 || (discord && account.member.roles?.includes(REINCARNATED_BALLER))
      const hasTier3 = sub?.tier === 3 || (discord && account.member.roles?.includes(ASCENDED_BALLER))
      const hasTier4 = sub?.tier === 4 || (discord && account.member.roles?.includes(OMEGA_BALLER))

      const checkMark = '<span style="color: lime">[✔]</span>'
      const exMark = '<span style="color: crimson">[✖]</span>'

      const createLineHTML = (i18nKey: string, value: number, statusCheck: boolean, nameClasses: string[]) => {
        const classesForName = ['bonus-line-name', ...nameClasses].join(' ')
        const style = nameClasses.length > 0 ? '' : 'color: gold'
        return `<div class="personal-bonus-line">
          <span class="${classesForName}" style="${style}">${i18next.t(`account.bonuses.${i18nKey}`)}</span>
          <span class="bonus-line-right">
            <span class="bonus-line-value">+${value}%</span>
            <span class="bonus-line-status">${statusCheck ? checkMark : exMark}</span>
          </span>
        </div>`
      }

      subtabElement.innerHTML = `
      ${user ? i18next.t('account.helloUser', { username: user }) : i18next.t('account.helloNoUser')}
      ${i18next.t('account.personalQuarkBonus', { percent: format(personalBonus, 2, true) })}

      ${i18next.t('account.subscriptionBonuses')}
      ${
        createLineHTML('transcendedBaller', 2, hasTier1, ['gradientText', 'transcendedBallerGradient'])
        + createLineHTML('reincarnatedBaller', 3, hasTier2, ['gradientText', 'reincarnatedBallerGradient'])
        + createLineHTML('ascendedBaller', 4, hasTier3, ['gradientText', 'ascendedBallerGradient'])
        + createLineHTML('omegaBaller', 5, hasTier4, ['rainbowText'])
        + createLineHTML('serverBooster', 1, boosted, ['gradientText', 'lotusGradient'])
      }
      <div class="event-bonuses-header" id="eventBonusesHeader">
        <span class="chevron" id="eventBonusesChevron">▼</span>
        <span>${i18next.t('account.eventBonuses')}:</span>
      </div>
      <div class="event-bonuses-content" id="eventBonusesContent">
      ${
        i18next.t('account.eventBonusMulti')
        + (discord ? '' : `<br>${i18next.t('account.eventBonusLink')}`)
      }     
      ${
        createLineHTML('thanksgiving2023', 0.2, discord && account.member.roles?.includes(THANKSGIVING_2023), [])
        + createLineHTML('thanksgiving2024', 0.3, discord && account.member.roles?.includes(THANKSGIVING_2024), [])
        + createLineHTML('thanksgiving2025', 0.4, discord && account.member.roles?.includes(THANKSGIVING_2025), [])
        + createLineHTML('conductor2023', 0.3, discord && account.member.roles?.includes(CONDUCTOR_2023), [])
        + createLineHTML('conductor2024', 0.4, discord && account.member.roles?.includes(CONDUCTOR_2024), [])
        + createLineHTML('conductor2025', 0.5, discord && account.member.roles?.includes(CONDUCTOR_2025), [])
        + createLineHTML('eightLeaf', 0.3, discord && account.member.roles?.includes(EIGHT_LEAF), [])
        + createLineHTML('tenLeaf', 0.4, discord && account.member.roles?.includes(TEN_LEAF), [])
        + createLineHTML('smithIncarnate', 0.6, discord && account.member.roles?.includes(SMITH_INCARNATE), [])
        + createLineHTML('smithGod', 0.7, discord && account.member.roles?.includes(SMITH_GOD), [])
        + createLineHTML('goldenSmithGod', 0.8, discord && account.member.roles?.includes(GOLDEN_SMITH_GOD), [])
        + createLineHTML('diamondSmithMessiah', 1, discord && account.member.roles?.includes(DIAMOND_SMITH_MESSIAH), [])
        + createLineHTML('mythosSmith', 1.1, discord && account.member.roles?.includes(MYTHOS_SMITH), [])
      }
      </div>
      ${i18next.t('account.lastButNotLeast')}
      ${createLineHTML('yourself', 1, true, ['rainbowText'])}
    `.trim()

      const allPlatforms = ['discord', 'patreon']
      const unlinkedPlatforms = allPlatforms.filter((platform) => !linkedAccounts.includes(platform))

      if (unlinkedPlatforms.length > 0) {
        const linkAccountsSection = document.createElement('div')

        const buttonContainer = document.createElement('div')
        buttonContainer.style.display = 'flex'
        buttonContainer.style.flexWrap = 'wrap'
        buttonContainer.style.gap = '10px'
        buttonContainer.style.marginTop = '10px'
        buttonContainer.style.justifyContent = 'center'

        const platformConfig = {
          discord: {
            label: 'Link Discord',
            color: '#5865F2',
            logo:
              `<svg width="20" height="20" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-right: 8px;">
                <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="white"/>
              </svg>`
          },
          patreon: {
            label: 'Link Patreon',
            color: '#FF424D',
            logo:
              `<svg width="20" height="20" viewBox="0 0 436 476" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-right: 8px;">
                <path d="M436 143.371C436 64.203 373.797 2 294.629 2C215.461 2 153.258 64.203 153.258 143.371C153.258 222.539 215.461 284.742 294.629 284.742C373.797 284.742 436 222.539 436 143.371ZM0 474H74.8139V2H0V474Z" fill="white"/>
              </svg>`
          }
        }

        for (const platform of unlinkedPlatforms) {
          const config = platformConfig[platform as keyof typeof platformConfig]
          const button = document.createElement('button')
          button.innerHTML = `${config.logo}${config.label}`
          button.style.padding = '10px 20px'
          button.style.cursor = 'pointer'
          button.style.backgroundColor = config.color
          button.style.color = 'white'
          button.style.border = 'none'
          button.style.borderRadius = '5px'
          button.style.fontSize = '14px'
          button.style.fontWeight = 'bold'
          button.style.display = 'flex'
          button.style.alignItems = 'center'
          button.style.transition = 'opacity 0.2s'
          button.addEventListener('mouseenter', () => {
            button.style.opacity = '0.85'
          })
          button.addEventListener('mouseleave', () => {
            button.style.opacity = '1'
          })
          button.addEventListener('click', () => {
            window.open(`https://synergism.cc/login?with=${platform}&link=true`, '_blank')
          })
          buttonContainer.appendChild(button)
        }

        linkAccountsSection.appendChild(buttonContainer)
        subtabElement.appendChild(linkAccountsSection)
      }

      // Add event listener for event bonuses dropdown toggle
      const eventBonusesHeader = DOMCacheGetOrSet('eventBonusesHeader')
      const eventBonusesContent = DOMCacheGetOrSet('eventBonusesContent')
      const eventBonusesChevron = DOMCacheGetOrSet('eventBonusesChevron')

      eventBonusesContent.style.display = 'none'
      eventBonusesChevron.style.transform = 'rotate(-90deg)'

      eventBonusesHeader.style.cursor = 'pointer'
      eventBonusesHeader.addEventListener('click', () => {
        const isCollapsed = eventBonusesContent.style.display === 'none'
        eventBonusesContent.style.display = isCollapsed ? 'block' : 'none'
        eventBonusesChevron.style.transform = isCollapsed ? 'rotate(0deg)' : 'rotate(-90deg)'
      })
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

function resetWebSocket () {
  for (const key of Object.keys(allDurableConsumables)) {
    allDurableConsumables[key as PseudoCoinConsumableNames] = {
      amount: 0,
      ends: [],
      displayName: ''
    }
  }

  lotusTimeExpiresAt = undefined
  setFavicon('./favicon.ico')
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
      resetWebSocket()
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
      resetWebSocket()
    } else if (data.type === 'consumed') {
      const consumable = allDurableConsumables[data.consumable as PseudoCoinConsumableNames]
      consumable.ends.push(data.startedAt + 3600 * 1000)
      consumable.amount++

      const article = /^[AEIOU]/i.test(data.displayName) ? 'an' : 'a'
      Notification(`Someone redeemed ${article} ${data.displayName}!`)
      setFavicon('./Pictures/favicon-notification.ico')
    } else if (data.type === 'consumable-ended') {
      // Because of the invariant that the timestamps are sorted, we can just remove the first element
      const consumable = allDurableConsumables[data.consumable as PseudoCoinConsumableNames]
      consumable.ends.shift()
      consumable.amount--

      const article = /^[AEIOU]/i.test(data.name) ? 'An' : 'A'
      Notification(`${article} ${data.name} ended!`)

      if (consumable.amount === 0) {
        setFavicon('./favicon.ico')
      }
    } else if (data.type === 'join') {
      Notification('Connection was established!')
    } else if (data.type === 'info-all') {
      resetWebSocket() // So that we can get an accurate count each time
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

        setFavicon('./Pictures/favicon-notification.ico')
      }

      tips = data.tips

      const lotusInventory = data.inventory.find((item) => item.type === 'LOTUS')

      if (lotusInventory) {
        ownedLotus = lotusInventory.amount
        usedLotus = lotusInventory.used
        updateLotusDisplay()
      }
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
    } else if (data.type === 'lotus') {
      buyLotusNotification(data.amount)
      ownedLotus += data.amount
      updateLotusDisplay()

      setTimeout(() => updatePseudoCoins(), 4000)
    } else if (data.type === 'applied-lotus') {
      ownedLotus -= 1
      usedLotus = data.lifetimePurchased
      lotusTimeExpiresAt = Date.now() + data.remaining

      updateLotusDisplay()
    } else if (data.type === 'lotus-ended') {
      lotusTimeExpiresAt = undefined

      updateLotusDisplay()
    } else if (data.type === 'lotus-active') {
      lotusTimeExpiresAt = Date.now() + data.remainingMs
      updateLotusDisplay()

      Notification(i18next.t('pseudoCoins.lotus.lotusActive'))
    } else {
      const assertNever = (_x: never) => {
        throw new Error()
      }

      assertNever(data)
    }

    updateGlobalsIsEvent()
  })
}

export function sendToWebsocket (message: string) {
  if (!isLoggedIn()) return

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

const buyLotusNotification = (amount: number) => {
  if (amount === 1) {
    Notification('You have successfully purchased a lotus. Enjoy!')
  } else {
    Notification(`You have successfully purchased ${amount} loti. Enjoy!`)
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
          const final = btoa(isomorphicDecode(jsonBytes))

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
        response.text().then((error) => Notification(error || i18next.t('settings.cloud.uploadFailed')))

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

function setFavicon (path: string) {
  const favicon = document.querySelector<HTMLLinkElement>('link[rel~=icon]')
  favicon?.setAttribute('href', path)
}
