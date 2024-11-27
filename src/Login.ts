import i18next from 'i18next'
import localforage from 'localforage'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { importSynergism } from './ImportExport'
import { QuarkHandler, setQuarkBonus } from './Quark'
import { format, player } from './Synergism'
import { Alert } from './UpdateHTML'

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

  const logoutElement = document.getElementById('logoutButton')
  if (logoutElement !== null) {
    logoutElement.addEventListener('click', logout, { once: true })
    document.getElementById('accountSubTab')?.appendChild(logoutElement)
  }

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

  if (location.hostname !== 'synergism.cc') {
    // TODO: better error, make link clickable, etc.
    subtabElement.textContent = 'Login is not available here, go to https://synergism.cc instead!'
  } else if (member !== null) {
    currentBonus.textContent +=
      ` You also receive an extra ${personalBonus}% bonus for being a Patreon member and/or boosting the Discord server! Multiplicative with global bonus!`

    let user: string | null

    if (type === 'discord') {
      user = member.nick ?? member.user?.username ?? member.user?.global_name ?? null
    } else {
      user = member.user.username
    }

    const boosted = type === 'discord' ? Boolean(member?.premium_since) || member?.roles.includes(BOOSTER) : false
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
      <span style="color: #ffcc00">Thanksgiving 2023</span> [+0.2%] - ${member.roles.includes(THANKSGIVING_2023) ? checkMark(0.2) : exMark}
      <span style="color: #ffcc00">Thanksgiving 2024</span> [+0.3%] - ${member.roles.includes(THANKSGIVING_2024) ? checkMark(0.3) : exMark}
      <span style="color: #ffcc00">Conductor 2023</span> [+0.3%] - ${member.roles.includes(CONDUCTOR_2023) ? checkMark(0.3) : exMark}
      <span style="color: #ffcc00">Conductor 2024</span> [+0.4%] - ${member.roles.includes(CONDUCTOR_2024) ? checkMark(0.4) : exMark}
      <span style="color: #ffcc00">Eight Leaf</span> [+0.3%] - ${member.roles.includes(EIGHT_LEAF) ? checkMark(0.3) : exMark}
      <span style="color: #ffcc00">Ten Leaf</span> [+0.4%] - ${member.roles.includes(TEN_LEAF) ? checkMark(0.4) : exMark}
      <span style="color: #ffcc00">Smith Incarnate</span> [+0.6%] - ${member.roles.includes(SMITH_INCARNATE) ? checkMark(0.6) : exMark}
      <span style="color: #ffcc00">Smith God</span> [+0.7%] - ${member.roles.includes(SMITH_GOD) ? checkMark(0.7) : exMark}
      <span style="color: #ffcc00">Golden Smith God</span> [+0.8%] - ${member.roles.includes(GOLDEN_SMITH_GOD) ? checkMark(0.8) : exMark}
      <span style="color: #ffcc00">Diamond Smith Messiah</span> [+1%] - ${member.roles.includes(DIAMOND_SMITH_MESSIAH) ? checkMark(1.2) : exMark}

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
        'https://discord.com/oauth2/authorize?client_id=1289303422939562128&response_type=code&redirect_uri=https%3A%2F%2Fsynergism.cc%2Fdiscord%2Foauth%2F&scope=identify+guilds+guilds.members.read'
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
