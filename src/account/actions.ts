import i18next from 'i18next'
import { DOMCacheGetOrSet } from '../Cache/DOM'
import { handleLogin } from '../Login'
import { Notification } from '../UpdateHTML'
import { getProofProvider, type ProofProvider } from './proof'

export type AccountActionId = 'login' | 'register' | 'forgotPassword' | 'resendVerification' | 'changePassword'

interface AccountField {
  name: string
  type: 'email' | 'password'
  label: string
  autocomplete: string
}

interface AccountAction {
  path: string
  proof: boolean
  fields: AccountField[]
  title: string
  submit: string
  onSuccess: 'message' | 'login' | 'register'
}

interface AccountActionResponse {
  message?: string
  error?: string
  details?: string
}

interface AccountFormOptions {
  email?: string
  onCancel?: () => void
}

const emailField: AccountField = {
  name: 'email',
  type: 'email',
  label: 'account.fields.email',
  autocomplete: 'email'
}

const confirmPasswordField: AccountField = {
  name: 'confirm-password',
  type: 'password',
  label: 'account.fields.confirmPassword',
  autocomplete: 'new-password'
}

const accountActions: Record<AccountActionId, AccountAction> = {
  login: {
    path: '/signin',
    proof: true,
    fields: [
      emailField,
      { name: 'password', type: 'password', label: 'account.fields.password', autocomplete: 'current-password' }
    ],
    title: 'account.actions.login',
    submit: 'account.forms.login',
    onSuccess: 'login'
  },
  register: {
    path: '/register',
    proof: true,
    fields: [
      emailField,
      { name: 'password', type: 'password', label: 'account.fields.password', autocomplete: 'new-password' },
      confirmPasswordField
    ],
    title: 'account.actions.register',
    submit: 'account.forms.register',
    onSuccess: 'register'
  },
  forgotPassword: {
    path: '/forgot-password',
    proof: true,
    fields: [emailField],
    title: 'account.actions.forgotPassword',
    submit: 'account.forms.sendResetPasswordEmail',
    onSuccess: 'message'
  },
  resendVerification: {
    path: '/email/verify/resend',
    proof: true,
    fields: [emailField],
    title: 'account.actions.resendVerification',
    submit: 'account.forms.sendVerificationEmail',
    onSuccess: 'message'
  },
  changePassword: {
    path: '/email/change-password',
    proof: false,
    fields: [
      { name: 'password', type: 'password', label: 'account.fields.currentPassword', autocomplete: 'current-password' },
      { name: 'new-password', type: 'password', label: 'account.fields.newPassword', autocomplete: 'new-password' },
      confirmPasswordField
    ],
    title: 'account.actions.changePassword',
    submit: 'account.forms.changePassword',
    onSuccess: 'message'
  }
}

const setStatus = (form: HTMLFormElement, state: 'success' | 'error', text: string) => {
  const status = form.querySelector<HTMLElement>('.accountFormStatus')!
  status.dataset.state = state
  status.textContent = text
}

const submitAccountForm = async (action: AccountAction, form: HTMLFormElement) => {
  if (form.dataset.submitting === 'true') return
  form.dataset.submitting = 'true'

  const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]')!
  const spinner = document.createElement('span')
  spinner.classList.add('authSubmitSpinner', 'spinner')
  spinner.setAttribute('aria-hidden', 'true')
  submitButton.disabled = true
  submitButton.setAttribute('aria-busy', 'true')
  submitButton.appendChild(spinner)
  form.querySelector<HTMLElement>('.accountFormStatus')!.textContent = ''

  const proofSlot = form.querySelector<HTMLElement>('.accountProof')!
  let provider: ProofProvider | undefined

  try {
    provider = await getProofProvider()

    const body = new URLSearchParams()
    for (const [key, value] of new FormData(form)) {
      body.set(key, `${value}`)
    }

    let url = `https://synergism.cc${action.path}`

    if (action.proof) {
      for (const [key, value] of Object.entries(await provider.get(proofSlot))) {
        body.set(key, value)
      }

      url = `${url}/${provider.platform}`
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json'
      },
      body: body.toString(),
      credentials: 'include'
    })

    const result = await response.json() as AccountActionResponse

    if (!response.ok) {
      setStatus(form, 'error', result.details ? `${result.error}\n${result.details}` : `${result.error}`)
      return
    }

    if (action.onSuccess === 'message') {
      form.reset()
      setStatus(form, 'success', `${result.message}`)
      return
    }

    if (action.onSuccess === 'register') {
      await provider.linkAccount?.()
    }

    await handleLogin()
    Notification(`${result.message}`)
  } catch (error) {
    setStatus(form, 'error', i18next.t('account.forms.requestFailed', { error: (error as Error).message }))
  } finally {
    if (action.proof) {
      provider?.reset?.(proofSlot)
    }

    delete form.dataset.submitting
    submitButton.disabled = false
    submitButton.removeAttribute('aria-busy')
    spinner.remove()
  }
}

export const createAccountForm = (id: AccountActionId, { email, onCancel }: AccountFormOptions = {}) => {
  const action = accountActions[id]
  const form = document.createElement('form')
  form.className = 'accountForm'

  const fields = action.fields.map((field) =>
    `<label>${
      i18next.t(field.label)
    }<input name="${field.name}" type="${field.type}" autocomplete="${field.autocomplete}" required></label>`
  ).join('')
  const cancelButton = onCancel ? `<button type="button">${i18next.t('general.Cancel')}</button>` : ''

  form.innerHTML = `<div class="accountFormTitle">${i18next.t(action.title)}</div>${fields}`
    + '<div class="accountProof"></div><p class="accountFormStatus" role="status"></p>'
    + `<div class="accountFormButtons">${cancelButton}<button type="submit">${i18next.t(action.submit)}</button></div>`

  const emailInput = form.elements.namedItem('email')
  if (email && emailInput instanceof HTMLInputElement) {
    emailInput.defaultValue = email
  }

  if (action.proof) {
    getProofProvider()
      .then((provider) => provider.mount?.(form.querySelector<HTMLElement>('.accountProof')!))
      .catch(console.error)
  }

  if (onCancel) {
    form.querySelector('button[type="button"]')!.addEventListener('click', onCancel)
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    submitAccountForm(action, form).catch(console.error)
  })

  return form
}

export const renderAccountActions = (ids: readonly AccountActionId[], email?: string) => {
  const panel = DOMCacheGetOrSet('accountActionPanel')
  const closePanel = () => panel.replaceChildren()

  closePanel()
  DOMCacheGetOrSet('accountActions').replaceChildren(...ids.map((id) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = i18next.t(accountActions[id].title)
    button.addEventListener('click', () => {
      panel.replaceChildren(createAccountForm(id, { email, onCancel: closePanel }))
      panel.querySelector<HTMLElement>('input')?.focus()
    })
    return button
  }))
}
