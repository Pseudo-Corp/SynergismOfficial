import i18next from 'i18next'
import localforage from 'localforage'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { importSynergism } from './ImportExport'
import { QuarkHandler, setQuarkBonus } from './Quark'
import { player } from './Synergism'
import { Alert } from './UpdateHTML'

// Consts for Patreon Supporter Roles.
const TRANSCENDED_BALLER = '756419583941804072'
const REINCARNATED_BALLER = '758859750070026241'
const ASCENDED_BALLER = '758861068188647444'
const OMEGA_BALLER = '832099983389097995'

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
  type: string
}

interface SynergismDiscordUserAPIResponse extends SynergismUserAPIResponse {
  member: RawMember | null
  type: 'discord'
}

interface SynergismPatreonUserAPIResponse extends SynergismUserAPIResponse {
  member: {
    user: {
      username: string | null
    }
    roles: string[]
  }
  type: 'patreon'
}

type CloudSave = null | { save: string }

export async function handleLogin () {
  const subtabElement = document.querySelector('#accountSubTab > div.scrollbarX')!
  const currentBonus = DOMCacheGetOrSet('currentBonus')

  const response = await fetch('https://synergism.cc/api/v1/users/me')

  if (!response.ok) {
    currentBonus.textContent =
      `Oh no! I couldn't fetch the bonus... Please send this to Khafra in the Discord: ${await response.text()}.`
    return
  }

  const { globalBonus, member, personalBonus, type } = await response.json() as
    | SynergismDiscordUserAPIResponse
    | SynergismPatreonUserAPIResponse

  setQuarkBonus(100 * (1 + globalBonus / 100) * (1 + personalBonus / 100) - 100)
  player.worlds = new QuarkHandler(Number(player.worlds))

  currentBonus.textContent = `Generous patrons give you a bonus of ${globalBonus}% more Quarks!`

  const cookies = parseDocumentCookie()

  if (cookies.id || cookies.patreonId) {
    Alert('You may need to login to your account again for bonuses to apply! Thank you!')
  }

  if (cookies.id) document.cookie = 'id=;Max-Age=0'
  if (cookies.patreonId) document.cookie = 'patreonId=;Max-Age=0'

  if (location.hostname !== 'synergism.cc') {
    // TODO: better error, make link clickable, etc.
    subtabElement.textContent = 'Login is not available here, go to https://synergism.cc instead!'
  } else if (cookies.token) {
    if (!member) {
      console.log(response, globalBonus, member, personalBonus, document.cookie)
      Alert('Your individual bonuses were not applied. Try refreshing the page!')
      return
    }

    currentBonus.textContent +=
      ` You also receive an extra ${personalBonus}% bonus for being a Patreon member and/or boosting the Discord server! Multiplicative with global bonus!`

    let user: string | null

    if (type === 'discord') {
      user = member?.nick ?? member?.user?.username ?? member?.user?.global_name ?? null
    } else {
      user = member?.user.username
    }

    const boosted = type === 'discord' ? Boolean(member?.premium_since) : false
    const hasTier1 = member?.roles.includes(TRANSCENDED_BALLER) ?? false
    const hasTier2 = member?.roles.includes(REINCARNATED_BALLER) ?? false
    const hasTier3 = member?.roles.includes(ASCENDED_BALLER) ?? false
    const hasTier4 = member?.roles.includes(OMEGA_BALLER) ?? false

    const checkMark = (n: number) => {
      return `<span style="color: lime">[✔] {+${n}%}</span>`
    }

    const exMark = '<span style="color: crimson">[✖] {+0%}</span>'

    subtabElement.innerHTML = `
      ${user ? `Hello, ${user}` : 'Hello'}!\n
      Your personal Quark bonus is ${personalBonus}%, computed by the following:
      <span style="color: orchid">Transcended Baller</span> [+2%] - ${hasTier1 ? checkMark(2) : exMark}
      <span style="color: green">Reincarnated Baller</span> [+3%] - ${hasTier2 ? checkMark(3) : exMark}
      <span style="color: orange">ASCENDED Baller</span> [+4%] - ${hasTier3 ? checkMark(4) : exMark}
      <span style="color: lightgoldenrodyellow">OMEGA Baller</span> [+5%] - ${hasTier4 ? checkMark(5) : exMark}
      <span style="color: #f47fff">Discord Server Booster</span> [+1%] - ${boosted ? checkMark(1) : exMark}
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

    const logoutElement = document.createElement('button')
    const cloudSaveElement = document.createElement('button')
    const loadCloudSaveElement = document.createElement('button')

    logoutElement.addEventListener('click', logout, { once: true })
    logoutElement.style.cssText = 'border: 2px solid #5865F2; height: 25px; width: 150px;'
    logoutElement.textContent = 'Log Out'

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

    subtabElement.appendChild(logoutElement)
    subtabElement.appendChild(cloudSaveParent)
  } else {
    // User is not logged in
    subtabElement.innerHTML = `
      <img id="discord-logo" alt="Discord Logo" src="Pictures/discord-mark-blue.png" loading="lazy" />
      <button value="discord" style="border: 2px solid #5865F2; height: 20px; width: 250px;">Login with Discord</button>

      <img id="patreon-logo" alt="Discord Logo" src="Pictures/patreon-logo.png" loading="lazy" />
      <button value="patreon" style="border: 2px solid #ff5900; height: 20px; width: 250px;">Login with Patreon</button>
    `

    subtabElement.querySelector('button[value="discord"]')?.addEventListener('click', () => {
      location.assign(
        'https://discord.com/oauth2/authorize?response_type=code&client_id=1124509674536972329&scope=guilds+guilds.members.read+identify&redirect_uri=https%3A%2F%2Fsynergism.cc%2Fdiscord%2Foauth%2F&prompt=consent'
      )
    })

    subtabElement.querySelector('button[value="patreon"]')?.addEventListener('click', () => {
      location.assign(
        'https://www.patreon.com/oauth2/authorize?response_type=code&client_id=mARrL2U1X5TUvl6YoFbfIEmsouJ0eCuETeEbkG1-Wmm5eNko6gzWgOUCuyejpTpA&redirect_uri=https%3A%2F%2Fsynergism.cc%2Fpatreon%2Foauth%2F&scope=identity%20campaigns%20identity.memberships'
      )
    })
  }
}

async function logout () {
  await fetch('https://synergism.cc/api/v1/users/logout')
  await Alert(i18next.t('account.logout'))

  location.reload()
}

async function saveToCloud () {
  const save = (await localforage.getItem<Blob>('Synergysave2')
    .then((b) => b?.text())
    .catch(() => null)) ?? localStorage.getItem('Synergysave2')

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

  await importSynergism(save?.save ?? null)
}

function parseDocumentCookie () {
  return document.cookie.split(';').reduce((obj, item) => {
    if (!item.includes('=')) return obj

    const split = item.split('=')
    obj[split[0].trim()] = split[1].trim()
    return obj
  }, {} as Record<string, string>)
}
