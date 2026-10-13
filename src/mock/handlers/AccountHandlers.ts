import { delay, http, type HttpHandler, HttpResponse } from 'msw'
import { getSubMetadata } from '../../Login'

interface MockAccount {
  password: string
  verified: boolean
  discord: boolean
}

const accounts = new Map<string, MockAccount>([
  ['discord@synergism.cc', { password: 'password', verified: true, discord: true }],
  ['unverified@synergism.cc', { password: 'password', verified: false, discord: false }]
])

const captchaPlatforms = new Set(['turnstile', 'apple', 'google', 'steam'])
const pendingPasswordResets = new Set<string>()

let session: string | null = 'discord@synergism.cc'
let steamLinkedTo: string | null = null

const field = (form: FormData, name: string) => `${form.get(name) ?? ''}`

const error = (message: string, status: number, details?: string) =>
  HttpResponse.json({ error: message, details }, { status })

const captchaError = (platform: unknown) =>
  error(
    'Captcha was not verified. If this keeps happening, please send the technical details below to Synergism support.',
    400,
    `Unknown captcha platform "${platform}".`
  )

export const accountHandlers: HttpHandler[] = [
  http.get('https://synergism.cc/api/v1/users/me', () => {
    if (session === null) {
      return HttpResponse.json({
        globalBonus: 50,
        member: null,
        accountType: 'none',
        bonus: { quark: 0 },
        subscription: null,
        linkedAccounts: []
      })
    }

    const account = accounts.get(session)!
    const linkedAccounts = steamLinkedTo === session ? ['email', 'steam'] : ['email']

    if (account.discord) {
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
        linkedAccounts
      })
    }

    if (steamLinkedTo === session) {
      return HttpResponse.json({
        globalBonus: 50,
        member: { avatar: '', profileURL: 'https://steamcommunity.com/', username: 'Steam User' },
        accountType: 'steam',
        bonus: { quark: 1 },
        subscription: getSubMetadata(),
        linkedAccounts
      })
    }

    return HttpResponse.json({
      globalBonus: 50,
      member: { email: session, verified: account.verified },
      accountType: 'email',
      bonus: { quark: account.verified ? 1 : 0 },
      subscription: getSubMetadata(),
      linkedAccounts
    })
  }),
  http.get('https://synergism.cc/api/v1/users/logout', () => {
    session = null
    return HttpResponse.json({ message: 'Logged out!' })
  }),
  http.post('https://synergism.cc/signin/:platform', async ({ request, params }) => {
    await delay(500)

    if (!captchaPlatforms.has(`${params.platform}`)) {
      return captchaError(params.platform)
    }

    const form = await request.formData()
    const email = field(form, 'email').toLowerCase()
    const account = accounts.get(email)

    if (account === undefined) {
      return error('Account was not found.', 500)
    } else if (account.password !== field(form, 'password')) {
      return error('Incorrect password.', 400)
    }

    session = email
    return HttpResponse.json({ message: 'You are now logged in.' })
  }),
  http.post('https://synergism.cc/register/:platform', async ({ request, params }) => {
    await delay(500)

    const form = await request.formData()
    const email = field(form, 'email').toLowerCase()
    const password = field(form, 'password')

    if (password.length < 8) {
      return error('Minimum password length is 8.', 400)
    } else if (password !== field(form, 'confirm-password')) {
      return error('Password confirmation does not match.', 400)
    } else if (!captchaPlatforms.has(`${params.platform}`)) {
      return captchaError(params.platform)
    } else if (params.platform === 'steam' && steamLinkedTo !== null) {
      return error('A Synergism account is already linked to this Steam account. Please login instead.', 400)
    } else if (accounts.has(email)) {
      return error('An account with that email already exists.', 400)
    }

    accounts.set(email, { password, verified: false, discord: false })
    session = email

    return HttpResponse.json({
      message: 'A verification email has been sent, please verify your account! '
        + 'You will not receive the quark bonus until your email is verified. 😉'
    })
  }),
  http.post('https://synergism.cc/forgot-password/:platform', async ({ request, params }) => {
    await delay(500)

    if (!captchaPlatforms.has(`${params.platform}`)) {
      return captchaError(params.platform)
    }

    const email = field(await request.formData(), 'email').toLowerCase()

    if (accounts.has(email)) {
      if (pendingPasswordResets.has(email)) {
        return error(
          'A password reset email was sent to this address within the last hour. Please check your inbox and spam folder. You can request another reset after the existing link is used or expires.',
          429
        )
      }

      pendingPasswordResets.add(email)
    }

    return HttpResponse.json({ message: 'Sent a password reset form to your email if the account exists.' })
  }),
  http.post('https://synergism.cc/email/verify/resend/:platform', async ({ request, params }) => {
    await delay(500)

    if (!captchaPlatforms.has(`${params.platform}`)) {
      return captchaError(params.platform)
    }

    const email = field(await request.formData(), 'email').toLowerCase()

    if (accounts.get(email)?.verified) {
      return error('This email address is already verified.', 409)
    }

    return HttpResponse.json({
      message: 'Sent a new verification link to your email if the account exists. The link expires in 24 hours.'
    })
  }),
  http.post('https://synergism.cc/email/change-password', async ({ request }) => {
    await delay(500)

    if (session === null) {
      return error('You are not logged in.', 401)
    }

    const form = await request.formData()
    const newPassword = field(form, 'new-password')
    const account = accounts.get(session)!

    if (newPassword.length < 8) {
      return error('Minimum password length is 8.', 400)
    } else if (newPassword !== field(form, 'confirm-password')) {
      return error('Password confirmation does not match.', 400)
    } else if (account.password !== field(form, 'password')) {
      return error('Incorrect password.', 400)
    }

    account.password = newPassword
    return HttpResponse.json({ message: 'Your password has been changed.' })
  }),
  http.post('https://synergism.cc/login/link-direct/steam', () => {
    if (session === null) {
      return error('You are not logged in', 401)
    } else if (steamLinkedTo === session) {
      return error('You already have a steam account linked!', 400)
    } else if (steamLinkedTo !== null) {
      return error(
        'This steam account is already linked to another Synergism account and cannot be transferred.',
        400
      )
    }

    steamLinkedTo = session
    return new HttpResponse(null, { status: 200 })
  })
]
