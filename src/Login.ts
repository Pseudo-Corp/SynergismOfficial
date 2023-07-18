import { DOMCacheGetOrSet } from './Cache/DOM'
import { QuarkHandler } from './Quark'
import { player } from './Synergism'

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
  member: RawMember | null
}

export async function handleLogin () {
  const subtabElement = document.querySelector('#accountSubTab > div.scrollbarX')!
  const currentBonus = DOMCacheGetOrSet('currentBonus')

  const response = await fetch('https://synergism.cc/api/v1/users/me')

  if (!response.ok) {
    currentBonus.textContent = `Oh no! I couldn't fetch the bonus... Please send this to Khafra in the Discord: ${await response.text()}.`
    return
  }

  const { globalBonus, member, personalBonus } = await response.json() as SynergismUserAPIResponse

  player.worlds = new QuarkHandler({
    quarks: Number(player.worlds),
    bonus: 100 * (1 + globalBonus/100) * (1 + personalBonus/100) - 100 // Multiplicative
  })

  currentBonus.textContent = `Generous patrons give you a bonus of ${globalBonus}% more Quarks!`

  if (location.hostname !== 'synergism.cc') {
    // TODO: better error, make link clickable, etc.
    subtabElement.textContent = 'Login is not available here, go to https://synergism.cc instead!'
  } else if (document.cookie.length) {
    currentBonus.textContent +=
      ` You also receive an extra ${personalBonus}% bonus for being a Patreon member and/or boosting the Discord server! Multiplicative with global bonus!`

    const user = member?.user?.username ?? 'player'
    const boosted = Boolean(member?.premium_since)
    const hasTier1 = member?.roles.includes(TRANSCENDED_BALLER) ?? false
    const hasTier2 = member?.roles.includes(REINCARNATED_BALLER) ?? false
    const hasTier3 = member?.roles.includes(ASCENDED_BALLER) ?? false
    const hasTier4 = member?.roles.includes(OMEGA_BALLER) ?? false

    const checkMark = (n: number) => {
      return `<span style="color: lime">[✔] {+${n}%}</span>`
    }

    const exMark = '<span style="color: crimson">[✖] {+0%}</span>'

    subtabElement.innerHTML = `Hello, ${user}!\n
                               Your personal Quark bonus is ${personalBonus}%, computed by the following:
                               <span style="color: orchid">Transcended Baller</span> [+2%] - ${hasTier1 ? checkMark(2) : exMark}
                               <span style="color: green">Reincarnated Baller</span> [+3%] - ${hasTier2 ? checkMark(3) : exMark}
                               <span style="color: orange">ASCENDED Baller</span> [+4%] - ${hasTier3 ? checkMark(4) : exMark}
                               <span style="color: lightgoldenrodyellow">OMEGA Baller</span> [+5%] - ${hasTier4 ? checkMark(5) : exMark}
                               <span style="color: #f47fff">Discord Server Booster</span> [+1%] - ${boosted ? checkMark(1) : exMark}
                               And Finally...
                               <span style="color: lime"> Being <span style="color: lightgoldenrodyellow"> YOURSELF! </span></span> [+1%] - ${checkMark(1)}

                               The current maximum is 16%, by being a Discord server booster and an OMEGA Baller on Patreon!
                              
                               More will be incorporated both for general accounts and supporters of the game shortly.
                               Become a supporter of development via the link below, and get special bonuses,
                               while also improving the Global Bonus for all to enjoy!
                               <a href="https://www.patreon.com/synergism" target="_blank" rel="noopener noreferrer nofollow">
                               <span style="color: lightgoldenrodyellow">--> PATREON <--</span>
                               </a>
                               `
  } else {
    // User is not logged in
    subtabElement.innerHTML = `
      <img id="discord-logo" alt="Discord Logo" src="Pictures/discord-mark-blue.png" loading="lazy">
      <br>
      <form action="https://discord.com/oauth2/authorize">
        <input type="hidden" name="response_type" value="code" />
        <input type="hidden" name="client_id" value="1124509674536972329" />
        <input type="hidden" name="scope" value="guilds guilds.members.read identify" />
        <input type="hidden" name="redirect_uri" value="https://synergism.cc/discord/oauth/" />
        <input type="hidden" name="prompt" value="consent" />
        <input type="submit" value="Login" style="border: 2px solid #5865F2; height: 20px; width: 250px;" />
      </form>
    `
  }
}
