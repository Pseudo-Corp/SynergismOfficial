import { SignInWithApple } from '@capacitor-community/apple-sign-in'
import { Capacitor } from '@capacitor/core'
import { SocialLogin } from '@capgo/capacitor-social-login'
import i18next from 'i18next'
import { platform } from '../Config'
import { Alert } from '../UpdateHTML'
import { displayHTMLError, memoize } from '../Utility'

const APPLE_BUNDLE_ID = 'cc.pseudocorp.synergism'
const GOOGLE_WEB_CLIENT_ID = '537222501218-jopk0evh8tobope5snl8ihjdm3t785el.apps.googleusercontent.com'

const useGoogle = Capacitor.getPlatform() === 'android'

const initSocialLogin = memoize(() =>
  SocialLogin.initialize({
    google: { webClientId: GOOGLE_WEB_CLIENT_ID, mode: 'online' }
  })
)

type SignInResult = { identityToken: string } | { error: string } | null

async function signInWithApple (): Promise<SignInResult> {
  try {
    const result = await SignInWithApple.authorize({
      clientId: APPLE_BUNDLE_ID,
      redirectURI: 'https://synergism.cc/login/direct/apple',
      scopes: 'email name'
    })

    if (!result.response.identityToken) {
      return { error: 'Apple returned no identityToken' }
    }

    return { identityToken: result.response.identityToken }
  } catch (e) {
    console.error('[auth] Sign in with Apple failed', e)
    return { error: `Apple sign-in threw: ${(e as Error).message}` }
  }
}

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

const APPLE_LOGO_SVG =
  '<svg viewBox="0 0 14 17" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="14" height="17"><path fill="currentColor" d="M11.624 9.04c-.018-1.844 1.506-2.73 1.575-2.774-.858-1.253-2.194-1.424-2.669-1.444-1.136-.115-2.217.67-2.793.67-.575 0-1.465-.654-2.408-.636-1.24.018-2.384.72-3.022 1.827-1.288 2.232-.33 5.535.924 7.347.615.887 1.347 1.884 2.307 1.847.927-.037 1.278-.6 2.398-.6s1.435.6 2.414.58c.996-.018 1.626-.903 2.234-1.793.704-1.03.994-2.03 1.012-2.082-.022-.01-1.943-.746-1.972-2.942zM9.81 3.625c.509-.618.853-1.478.759-2.333-.734.03-1.624.489-2.152 1.106-.473.546-.887 1.422-.775 2.26.82.064 1.659-.416 2.168-1.033z"/></svg>'

const GOOGLE_LOGO_SVG =
  '<svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="18" height="18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.04l3.007-2.333z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>'

const applyAppleButtonStyles = (btn: HTMLInputElement | HTMLButtonElement, label: string) => {
  btn.classList.add('apple-sign-in-btn')
  btn.style.background = '#000'
  btn.style.color = '#fff'
  btn.style.border = '1px solid #000'
  btn.style.borderRadius = '6px'
  btn.style.padding = '10px 16px'
  btn.style.fontWeight = '600'
  btn.style.cursor = 'pointer'
  btn.style.display = 'inline-flex'
  btn.style.alignItems = 'center'
  btn.style.justifyContent = 'center'
  btn.style.gap = '8px'
  btn.style.width = '100%'
  btn.style.marginTop = '6px'

  if (btn instanceof HTMLInputElement) {
    btn.value = label
  } else {
    btn.innerHTML = `${APPLE_LOGO_SVG}<span></span>`
    btn.querySelector('span')!.textContent = label
  }
}

const applyGoogleButtonStyles = (btn: HTMLInputElement | HTMLButtonElement, label: string) => {
  btn.classList.add('google-sign-in-btn')
  btn.style.background = '#fff'
  btn.style.color = '#1f1f1f'
  btn.style.border = '1px solid #747775'
  btn.style.borderRadius = '6px'
  btn.style.padding = '10px 16px'
  btn.style.fontWeight = '500'
  btn.style.cursor = 'pointer'
  btn.style.display = 'inline-flex'
  btn.style.alignItems = 'center'
  btn.style.justifyContent = 'center'
  btn.style.gap = '8px'
  btn.style.width = '100%'
  btn.style.marginTop = '6px'

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
  if (platform !== 'mobile') return

  const actionAttr = useGoogle ? 'data-google-action' : 'data-apple-action'
  const applyStyles = useGoogle ? applyGoogleButtonStyles : applyAppleButtonStyles
  const signIn = useGoogle ? signInWithGoogle : signInWithApple
  const labelSignIn = useGoogle ? 'Sign in with Google' : 'Sign in with Apple'
  const labelSignUp = useGoogle ? 'Sign up with Google' : 'Sign up with Apple'

  for (const form of document.querySelectorAll<HTMLFormElement>(`form[${actionAttr}]`)) {
    const action = form.getAttribute(actionAttr) ?? ''
    const label = action.endsWith('/register') ? labelSignUp : labelSignIn
    replaceSubmitWithProviderButton(form, applyStyles, label)

    form.addEventListener('submit', async (ev) => {
      ev.preventDefault()

      if (form.dataset.submitting) return
      form.dataset.submitting = 'true'

      try {
        const response = await signIn()
        if (!response || 'error' in response) {
          const detail = response?.error ?? 'returned null'
          console.error('[auth] sign-in failed:', detail)
          await Alert(`${i18next.t('mobile.auth.signInFailed')}\n\n${detail}`)
          return
        }

        if (!action) return

        const body = new URLSearchParams()
        for (const [key, value] of new FormData(form)) {
          body.set(key, `${value}`)
        }
        body.set('identityToken', response.identityToken)

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
