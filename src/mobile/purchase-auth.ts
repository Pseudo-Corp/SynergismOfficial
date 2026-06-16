import i18next from 'i18next'
import { DOMCacheGetOrSet } from '../Cache/DOM'
import { changeSubTab, Tabs } from '../Tabs'
import { CloseModal, Modal } from '../UpdateHTML'

const PENDING_PURCHASE_KEY = 'synergism.pendingMobilePurchase'
const PENDING_PURCHASE_TTL_MS = 30 * 60 * 1000

type AccountForm = 'register' | 'login'

interface PendingMobilePurchase {
  lookupKey: string
  createdAt: number
}

const setPendingMobilePurchase = (lookupKey: string) => {
  const pendingPurchase: PendingMobilePurchase = {
    lookupKey,
    createdAt: Date.now()
  }

  localStorage.setItem(PENDING_PURCHASE_KEY, JSON.stringify(pendingPurchase))
}

const showAccountForm = (form: AccountForm) => {
  const register = DOMCacheGetOrSet('register')
  const login = DOMCacheGetOrSet('login')
  const forgotPassword = DOMCacheGetOrSet('forgotpassword')

  register.style.display = form === 'register' ? 'flex' : 'none'
  login.style.display = form === 'login' ? 'flex' : 'none'
  forgotPassword.style.display = 'none'

  const visibleForm = form === 'register' ? register : login
  visibleForm.querySelector<HTMLElement>('button, input')?.focus()
}

const continueToAccount = (lookupKey: string, form: AccountForm) => {
  setPendingMobilePurchase(lookupKey)
  changeSubTab(Tabs.Settings, { page: 8 })
  showAccountForm(form)
}

const purchaseAuthModalHTML = () => `
  <div class="purchaseAuthModal">
    <div class="resetModalTitle">${i18next.t('mobile.purchases.signInRequiredTitle')}</div>
    <p>${i18next.t('mobile.purchases.signInRequiredBody')}</p>
    <div class="modalButtonRow">
      <button class="modalBtnBuy" data-modal-action="register">${i18next.t('mobile.purchases.createAccount')}</button>
      <button class="modalBtnBuy" data-modal-action="login">${i18next.t('mobile.purchases.login')}</button>
      <button class="modalBtnBuy" data-modal-action="cancel">${i18next.t('general.Cancel')}</button>
    </div>
  </div>
`

export const showMobilePurchaseAuthModal = (lookupKey: string) => {
  Modal(
    purchaseAuthModalHTML,
    window.innerWidth / 2,
    window.innerHeight / 2,
    { borderColor: 'gold' },
    1000,
    {
      buttonClick: (button) => {
        const action = button.dataset.modalAction

        if (action === 'register' || action === 'login') {
          continueToAccount(lookupKey, action)
          return
        }

        CloseModal()
      }
    }
  )
}

export const consumePendingMobilePurchase = () => {
  const rawPendingPurchase = localStorage.getItem(PENDING_PURCHASE_KEY)

  if (rawPendingPurchase === null) {
    return null
  }

  localStorage.removeItem(PENDING_PURCHASE_KEY)

  try {
    const pendingPurchase = JSON.parse(rawPendingPurchase) as Partial<PendingMobilePurchase>
    if (typeof pendingPurchase.lookupKey !== 'string' || typeof pendingPurchase.createdAt !== 'number') {
      return null
    }

    const isExpired = Date.now() - pendingPurchase.createdAt > PENDING_PURCHASE_TTL_MS

    return isExpired ? null : pendingPurchase.lookupKey
  } catch {
    return null
  }
}
