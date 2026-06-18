import { AppAttest } from '@capgo/capacitor-app-attest'
import { Capacitor } from '@capacitor/core'
import { SocialLogin } from '@capgo/capacitor-social-login'
import i18next from 'i18next'
import { Alert } from '../UpdateHTML'
import { displayHTMLError, memoize } from '../Utility'

const GOOGLE_WEB_CLIENT_ID = '537222501218-jopk0evh8tobope5snl8ihjdm3t785el.apps.googleusercontent.com'
const ATTEST_CHALLENGE_URL = 'https://synergism.cc/login-api/attest-challenge'

const useGoogle = Capacitor.getPlatform() === 'android'

const initSocialLogin = memoize(() =>
  SocialLogin.initialize({
    google: { webClientId: GOOGLE_WEB_CLIENT_ID, mode: 'online' }
  })
)

type SignInResult = { identityToken: string } | { error: string } | null

async function signInWithGoogle (): Promise<SignInResult> {
  try {
    await initSocialLogin()
    const res = await SocialLogin.login({
      provider: 'google',
      options: {}
    })

    if (res.result.responseType !== 'online') {
      return { error: `Unexpected responseType: ${res.result.responseType}` }
    }

    if (!res.result.idToken) {
      return { error: 'Google returned no idToken' }
    }

    return { identityToken: res.result.idToken }
  } catch (e) {
    console.error('[auth] Sign in with Google failed', e)
    return { error: `Google sign-in threw: ${(e as Error).message}` }
  }
}

type AttestResult = { keyId: string; challenge: string; attestation: string } | { error: string }

async function attestDevice (): Promise<AttestResult> {
  try {
    const res = await fetch(ATTEST_CHALLENGE_URL, { method: 'POST', credentials: 'include' })
    if (!res.ok) {
      return { error: `Challenge request failed: ${res.status}` }
    }

    const { challenge } = await res.json() as { challenge: string }

    const { keyId } = await AppAttest.prepare()
    const { token } = await AppAttest.createAttestation({ keyId, challenge })

    return { keyId, challenge, attestation: token }
  } catch (e) {
    console.error('[auth] App Attest failed', e)
    return { error: `App Attest threw: ${(e as Error).message}` }
  }
}

const GOOGLE_LOGO_SVG =
  '<svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="18" height="18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.04l3.007-2.333z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>'

const applyGoogleButtonStyles = (btn: HTMLInputElement | HTMLButtonElement, label: string) => {
  btn.classList.add('google-sign-in-btn')
  btn.style.background = '#fff'
  btn.style.color = '#1f1f1f'
  btn.style.border = '1px solid #747775'
  btn.style.borderRadius = '6px'
  btn.style.padding = '10px 16px'
  btn.style.fontWeight = '500'
  btn.style.cursor = 'pointer'
  btn.style.display = 'flex'
  btn.style.alignItems = 'center'
  btn.style.justifyContent = 'center'
  btn.style.gap = '8px'
  btn.style.boxSizing = 'border-box'
  btn.style.width = '100%'
  btn.style.margin = '6px 0 0'

  if (btn instanceof HTMLInputElement) {
    btn.value = label
  } else {
    btn.innerHTML = `${GOOGLE_LOGO_SVG}<span></span>`
    btn.querySelector('span')!.textContent = label
  }
}

const replaceSubmitWithProviderButton = (
  form: HTMLFormElement,
  applyStyles: (btn: HTMLButtonElement, label: string) => void,
  label: string
) => {
  const existingSubmit = form.querySelector<HTMLInputElement | HTMLButtonElement>(
    'input[type="submit"], button[type="submit"]'
  )

  const button = document.createElement('button')
  button.type = 'submit'
  applyStyles(button, label)

  if (existingSubmit) {
    existingSubmit.replaceWith(button)
  } else {
    form.appendChild(button)
  }

  const turnstile = form.querySelector<HTMLElement>('.turnstile')
  if (turnstile) turnstile.style.display = 'none'
}

export const bindMobileFormHandlers = memoize(() => {
  if (PLATFORM !== 'mobile') return

  const actionAttr = useGoogle ? 'data-google-action' : 'data-apple-action'

  for (const form of document.querySelectorAll<HTMLFormElement>(`form[${actionAttr}]`)) {
    const action = form.getAttribute(actionAttr) ?? ''

    if (useGoogle) {
      const label = action.endsWith('/register') ? 'Sign up with Google' : 'Sign in with Google'
      replaceSubmitWithProviderButton(form, applyGoogleButtonStyles, label)
    } else {
      const turnstile = form.querySelector<HTMLElement>('.turnstile')
      if (turnstile) turnstile.style.display = 'none'
    }

    form.addEventListener('submit', async (ev) => {
      ev.preventDefault()

      if (form.dataset.submitting) return
      form.dataset.submitting = 'true'

      try {
        const body = new URLSearchParams()
        for (const [key, value] of new FormData(form)) {
          body.set(key, `${value}`)
        }

        if (useGoogle) {
          const response = await signInWithGoogle()
          if (!response || 'error' in response) {
            const detail = response?.error ?? 'returned null'
            console.error('[auth] sign-in failed:', detail)
            await Alert(`${i18next.t('mobile.auth.signInFailed')}\n\n${detail}`)
            return
          }
          body.set('identityToken', response.identityToken)
        } else {
          const attest = await attestDevice()
          if ('error' in attest) {
            console.error('[auth] attestation failed:', attest.error)
            await Alert(`${i18next.t('mobile.auth.verificationFailed')}\n\n${attest.error}`)
            return
          }
          body.set('keyId', attest.keyId)
          body.set('challenge', attest.challenge)
          body.set('attestation', attest.attestation)
        }

        if (!action) return

        const res = await fetch(action, {
          method: form.method.toUpperCase(),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body,
          credentials: 'include'
        })

        if (res.redirected || res.ok) {
          location.reload()
        } else {
          await displayHTMLError(res)
        }
      } finally {
        delete form.dataset.submitting
      }
    })
  }
})
