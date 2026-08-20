import i18next from 'i18next'
import { DOMCacheGetOrSet } from '../Cache/DOM'
import { isLoggedIn, renderCaptcha } from '../Login'
import { CloseModal, Modal } from '../UpdateHTML'
import { createDeferredPromise } from '../Utility'

type AccountForm = 'register' | 'login'

interface ActivePurchaseAuthentication {
  formNode?: HTMLElement
  promise: Promise<boolean>
  resolve: (authenticated: boolean) => void
  restoreForm?: () => void
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

  if (authenticated) {
    // handleLogin has replaced the signed-out account page, so the old form
    // should be discarded rather than restored into the signed-in page.
    request.formNode?.remove()
  } else {
    request.restoreForm?.()
  }

  if (closeModal) {
    CloseModal()
  }
  request.resolve(authenticated)
}

const showForm = (form: AccountForm) => {
  const request = activePurchaseAuthentication
  if (request === null) return

  const formNode = DOMCacheGetOrSet(form)
  const parent = formNode.parentElement!
  const nextSibling = formNode.nextSibling
  const previousDisplay = formNode.style.display

  request.formNode = formNode
  request.restoreForm = () => {
    formNode.style.display = previousDisplay

    if (nextSibling?.parentNode === parent) {
      parent.insertBefore(formNode, nextSibling)
    } else {
      parent.appendChild(formNode)
    }

    request.formNode = undefined
    request.restoreForm = undefined
  }

  formNode.style.display = 'flex'

  const container = document.createElement('div')
  container.className = 'purchaseAuthModal'

  const title = document.createElement('div')
  title.className = 'resetModalTitle'
  title.textContent = i18next.t(
    form === 'register' ? 'pseudoCoins.purchaseAuth.createAccount' : 'pseudoCoins.purchaseAuth.login'
  )

  const buttonRow = document.createElement('div')
  buttonRow.className = 'modalButtonRow'
  const backButton = document.createElement('button')
  backButton.type = 'button'
  backButton.className = 'modalBtnBuy'
  backButton.dataset.modalAction = 'back'
  backButton.textContent = i18next.t('general.Back')
  buttonRow.appendChild(backButton)

  container.append(title, formNode, buttonRow)
  DOMCacheGetOrSet('modalContent').replaceChildren(container)

  renderCaptcha()
  formNode.querySelector<HTMLElement>('input, button')?.focus()
}

const showChoice = () => {
  const request = activePurchaseAuthentication
  if (request === null) return

  request.restoreForm?.()
  DOMCacheGetOrSet('modalContent').innerHTML = choiceModalHTML()
}

export const showPurchaseAuthModal = (): Promise<boolean> => {
  if (activePurchaseAuthentication !== null) {
    return Promise.resolve(false)
  }

  const { promise, resolve } = createDeferredPromise<boolean>()
  const request: ActivePurchaseAuthentication = { promise, resolve }
  activePurchaseAuthentication = request

  const modalContent = DOMCacheGetOrSet('modalContent')
  const html = () => request.formNode === undefined ? choiceModalHTML() : modalContent.innerHTML

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
