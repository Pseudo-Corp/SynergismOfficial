import i18next from 'i18next'
import { createAccountForm } from '../account/actions'
import { DOMCacheGetOrSet } from '../Cache/DOM'
import { isLoggedIn } from '../Login'
import { CloseModal, Modal } from '../UpdateHTML'
import { createDeferredPromise } from '../Utility'

type AccountForm = 'register' | 'login'

interface ActivePurchaseAuthentication {
  showingForm: boolean
  promise: Promise<boolean>
  resolve: (authenticated: boolean) => void
}

let activePurchaseAuthentication: ActivePurchaseAuthentication | null = null

const choiceModalHTML = () => {
  const title = i18next.t('pseudoCoins.purchaseAuth.signInRequiredTitle')
  const body = i18next.t('pseudoCoins.purchaseAuth.signInRequiredBody')
  const createAccount = i18next.t('pseudoCoins.purchaseAuth.createAccount')
  const login = i18next.t('pseudoCoins.purchaseAuth.login')
  const cancel = i18next.t('general.Cancel')

  return `
    <div class="purchaseAuthModal">
      <div class="resetModalTitle">${title}</div>
      <p>${body}</p>
      <div class="modalButtonRow">
        <button type="button" class="modalBtnBuy" data-modal-action="register">${createAccount}</button>
        <button type="button" class="modalBtnBuy" data-modal-action="login">${login}</button>
        <button type="button" class="modalBtnBuy" data-modal-action="cancel">${cancel}</button>
      </div>
    </div>
  `
}

export const finishPurchaseAuthentication = (authenticated: boolean, closeModal = true) => {
  const request = activePurchaseAuthentication
  if (request === null) return

  activePurchaseAuthentication = null

  if (closeModal) {
    CloseModal()
  }
  request.resolve(authenticated)
}

const showForm = (form: AccountForm) => {
  const request = activePurchaseAuthentication
  if (request === null) return

  request.showingForm = true

  const formNode = createAccountForm(form)

  const container = document.createElement('div')
  container.className = 'purchaseAuthModal'

  const buttonRow = document.createElement('div')
  buttonRow.className = 'modalButtonRow'
  const backButton = document.createElement('button')
  backButton.type = 'button'
  backButton.className = 'modalBtnBuy'
  backButton.dataset.modalAction = 'back'
  backButton.textContent = i18next.t('general.Back')
  buttonRow.appendChild(backButton)

  container.append(formNode, buttonRow)
  DOMCacheGetOrSet('modalContent').replaceChildren(container)

  formNode.querySelector<HTMLElement>('input, button')?.focus()
}

const showChoice = () => {
  const request = activePurchaseAuthentication
  if (request === null) return

  request.showingForm = false
  DOMCacheGetOrSet('modalContent').innerHTML = choiceModalHTML()
}

export const showPurchaseAuthModal = (): Promise<boolean> => {
  if (activePurchaseAuthentication !== null) {
    return Promise.resolve(false)
  }

  const { promise, resolve } = createDeferredPromise<boolean>()
  const request: ActivePurchaseAuthentication = { showingForm: false, promise, resolve }
  activePurchaseAuthentication = request

  const modalContent = DOMCacheGetOrSet('modalContent')
  const html = () => request.showingForm ? modalContent.innerHTML : choiceModalHTML()

  Modal(
    html,
    window.innerWidth / 2,
    window.innerHeight / 2,
    { borderColor: 'gold' },
    1000,
    {
      buttonClick: (button) => {
        const action = button.dataset.modalAction

        if (action === 'register' || action === 'login') {
          showForm(action)
        } else if (action === 'back') {
          showChoice()
        } else if (action === 'cancel') {
          CloseModal()
        }
      },
      backdropClick: CloseModal,
      centered: true,
      onClose: () => finishPurchaseAuthentication(false, false)
    }
  )

  return promise
}

export const requirePurchaseAuthentication = () => {
  return isLoggedIn() ? Promise.resolve(true) : showPurchaseAuthModal()
}
