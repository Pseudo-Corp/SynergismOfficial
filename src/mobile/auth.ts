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

export const bindMobileFormHandlers = memoize(() => {
  if (platform !== 'mobile') return

  for (const form of document.querySelectorAll<HTMLFormElement>('form[data-apple-action]')) {
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
