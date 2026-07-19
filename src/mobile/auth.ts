import { Capacitor } from '@capacitor/core'
import { AppAttest } from '@capgo/capacitor-app-attest'
import i18next from 'i18next'
import { handleLogin } from '../Login'
import { Alert } from '../UpdateHTML'
import { displayHTMLError } from '../Utility'

const ATTEST_CHALLENGE_URL = 'https://synergism.cc/login-api/attest-challenge'

type CaptchaPlatform = 'apple' | 'google'
type AttestResult =
  | { platform: 'apple'; keyId: string; challenge: string; attestation: string }
  | { platform: 'google'; challenge: string; integrityToken: string }
  | { error: string }

async function attestDevice (platform: CaptchaPlatform): Promise<AttestResult> {
  try {
    const challengeURL = new URL(ATTEST_CHALLENGE_URL)
    challengeURL.searchParams.set('platform', platform)
    const res = await fetch(challengeURL.toString(), { method: 'POST', credentials: 'include' })
    if (!res.ok) {
      return { error: `Challenge request failed: ${res.status}` }
    }

    const { challenge } = await res.json() as { challenge: string }

    const { keyId } = await AppAttest.prepare()
    const { token } = await AppAttest.createAttestation({ keyId, challenge })

    return platform === 'google'
      ? { platform, challenge, integrityToken: token }
      : { platform, keyId, challenge, attestation: token }
  } catch (e) {
    console.error('[auth] Device attestation failed', e)
    return { error: `Device attestation threw: ${(e as Error).message}` }
  }
}

const boundForms = new WeakSet<HTMLFormElement>()

export const bindMobileFormHandlers = () => {
  if (PLATFORM !== 'mobile') return

  const captchaPlatform: CaptchaPlatform = Capacitor.getPlatform() === 'android' ? 'google' : 'apple'

  for (const form of document.querySelectorAll<HTMLFormElement>('form[data-apple-action]')) {
    if (boundForms.has(form)) continue
    boundForms.add(form)

    const appleAction = form.dataset.appleAction ?? ''
    const action = captchaPlatform === 'google' ? appleAction.replace(/\/apple$/, '/google') : appleAction

    const turnstile = form.querySelector<HTMLElement>('.turnstile')
    if (turnstile) turnstile.style.display = 'none'

    form.addEventListener('submit', async (ev) => {
      ev.preventDefault()

      if (form.dataset.submitting) return
      form.dataset.submitting = 'true'

      try {
        const body = new URLSearchParams()
        for (const [key, value] of new FormData(form)) {
          body.set(key, `${value}`)
        }

        const attest = await attestDevice(captchaPlatform)
        if ('error' in attest) {
          console.error('[auth] attestation failed:', attest.error)
          await Alert(`${i18next.t('mobile.auth.verificationFailed')}\n\n${attest.error}`)
          return
        }

        body.set('challenge', attest.challenge)
        if (attest.platform === 'google') {
          body.set('integrityToken', attest.integrityToken)
        } else {
          body.set('keyId', attest.keyId)
          body.set('attestation', attest.attestation)
        }

        if (!action) return

        const res = await fetch(action, {
          method: form.method.toUpperCase(),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body.toString(),
          credentials: 'include'
        })

        if (res.redirected || res.ok) {
          await handleLogin()
        } else {
          await displayHTMLError(res)
        }
      } finally {
        delete form.dataset.submitting
      }
    })
  }
}
