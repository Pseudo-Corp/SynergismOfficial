import { SignInWithApple, type SignInWithAppleResponse } from '@capacitor-community/apple-sign-in'
import i18next from 'i18next'
import { platform } from '../Config'
import { Alert } from '../UpdateHTML'
import { displayHTMLError, memoize } from '../Utility'

const APPLE_BUNDLE_ID = 'cc.pseudocorp.synergism'

export async function signInWithApple (): Promise<SignInWithAppleResponse['response'] | null> {
  try {
    const result = await SignInWithApple.authorize({
      clientId: APPLE_BUNDLE_ID,
      redirectURI: 'https://synergism.cc/login/direct/apple',
      scopes: 'email name'
    })
    return result.response
  } catch (e) {
    console.error('Sign in with Apple failed', e)
    return null
  }
}

const APPLE_LOGO_SVG =
  '<svg viewBox="0 0 14 17" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="14" height="17"><path fill="currentColor" d="M11.624 9.04c-.018-1.844 1.506-2.73 1.575-2.774-.858-1.253-2.194-1.424-2.669-1.444-1.136-.115-2.217.67-2.793.67-.575 0-1.465-.654-2.408-.636-1.24.018-2.384.72-3.022 1.827-1.288 2.232-.33 5.535.924 7.347.615.887 1.347 1.884 2.307 1.847.927-.037 1.278-.6 2.398-.6s1.435.6 2.414.58c.996-.018 1.626-.903 2.234-1.793.704-1.03.994-2.03 1.012-2.082-.022-.01-1.943-.746-1.972-2.942zM9.81 3.625c.509-.618.853-1.478.759-2.333-.734.03-1.624.489-2.152 1.106-.473.546-.887 1.422-.775 2.26.82.064 1.659-.416 2.168-1.033z"/></svg>'

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

const replaceSubmitWithAppleButton = (form: HTMLFormElement) => {
  const existingSubmit = form.querySelector<HTMLInputElement | HTMLButtonElement>(
    'input[type="submit"], button[type="submit"]'
  )
  const action = form.getAttribute('data-apple-action') ?? ''
  const label = action.endsWith('/register') ? 'Sign up with Apple' : 'Sign in with Apple'

  const button = document.createElement('button')
  button.type = 'submit'
  applyAppleButtonStyles(button, label)

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

  for (const form of document.querySelectorAll<HTMLFormElement>('form[data-apple-action]')) {
    replaceSubmitWithAppleButton(form)

    form.addEventListener('submit', async (ev) => {
      ev.preventDefault()

      if (form.dataset.submitting) return
      form.dataset.submitting = 'true'

      try {
        const response = await signInWithApple()
        if (!response?.identityToken) {
          await Alert(i18next.t('mobile.auth.signInFailed'))
          return
        }

        const action = form.getAttribute('data-apple-action')
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
        form.dataset.submitting = undefined
      }
    })
  }
})
