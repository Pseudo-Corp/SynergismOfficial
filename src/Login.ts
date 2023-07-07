import { DOMCacheGetOrSet } from './Cache/DOM'
import { QuarkHandler } from './Quark'
import { player } from './Synergism'

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

  if (location.hostname !== 'synergism.cc') {
    // TODO: better error, make link clickable, etc.
    subtabElement.textContent = 'Login is not available here, go to https://synergism.cc instead!'
  } else if (document.cookie.length) {
    const response = await fetch('/api/v1/users/me')
    const { globalBonus, member, personalBonus } = await response.json() as SynergismUserAPIResponse

    player.worlds = new QuarkHandler({
      quarks: Number(player.worlds),
      bonus: globalBonus + personalBonus
    })

    DOMCacheGetOrSet('currentBonus').textContent =
      `Generous patrons give you a bonus of ${globalBonus}% more Quarks! ` +
      `You also receive an extra ${personalBonus}% bonus for being a Patreon and/or boosting the Discord server!`

    subtabElement.innerHTML = `Khafra got bored and didn't bother to add an account page! Here is your account info: ${member}`
  } else {
    // User is not logged in
    subtabElement.innerHTML = `
      <img id="discord-logo" alt="discord logo" label="discord logo" src="Pictures/discord-mark-blue.png" loading="lazy">
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
