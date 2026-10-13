/// <reference types="@types/cloudflare-turnstile" />

import i18next from 'i18next'
import { displayHTMLError } from '../Utility'

export interface ProofProvider {
  platform: string
  mount?: (slot: HTMLElement) => void
  get: (slot: HTMLElement) => Promise<Record<string, string>>
  reset?: (slot: HTMLElement) => void
  linkAccount?: () => Promise<void>
}

const TURNSTILE_SITEKEY = DEV || TESTING ? '1x00000000000000000000AA' : '0x4AAAAAAA4kwOTMEdx48IMm'

let turnstileScript: Promise<void> | null = null

const loadTurnstileScript = () => {
  turnstileScript ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.defer = true
    script.addEventListener('load', () => resolve())
    script.addEventListener('error', () => {
      turnstileScript = null
      script.remove()
      reject(new Error('Failed to load the Turnstile script'))
    })
    document.head.appendChild(script)
  })

  return turnstileScript
}

const turnstileProof: ProofProvider = {
  platform: 'turnstile',
  mount (slot) {
    loadTurnstileScript()
      .then(() => {
        turnstile.render(slot, {
          sitekey: TURNSTILE_SITEKEY,
          'error-callback' () {},
          retry: 'never'
        })
      })
      .catch(console.error)
  },
  async get (slot) {
    const token = typeof turnstile === 'undefined' ? undefined : turnstile.getResponse(slot)

    if (!token) {
      throw new Error(i18next.t('account.forms.completeCaptcha'))
    }

    return { 'cf-turnstile-response': token }
  },
  reset (slot) {
    if (typeof turnstile !== 'undefined') {
      turnstile.reset(slot)
    }
  }
}

const getSteamProof = async () => {
  const { getSessionTicket } = await import('../steam/steam')
  const sessionTicket = await getSessionTicket()

  if (!sessionTicket) {
    throw new Error(i18next.t('account.steam.failedToVerify'))
  }

  return { sessionTicket }
}

const steamProof: ProofProvider = {
  platform: 'steam',
  get: getSteamProof,
  async linkAccount () {
    const response = await fetch('https://synergism.cc/login/link-direct/steam', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(await getSteamProof())
    })

    if (!response.redirected && !response.ok) {
      await displayHTMLError(response)
    }
  }
}

export const getProofProvider = async (): Promise<ProofProvider> => {
  if (PLATFORM === 'steam') {
    return steamProof
  } else if (PLATFORM === 'mobile') {
    const { mobileProof } = await import('../mobile/auth')
    return mobileProof
  }

  return turnstileProof
}
