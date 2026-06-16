import i18next from 'i18next'
import { DOMCacheGetOrSet } from '../Cache/DOM'
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

const choiceModalHTML = () => `
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
  const modalContent = DOMCacheGetOrSet('modalContent')

  let restoreForm: (() => void) | null = null
  const html = () => (restoreForm === null ? choiceModalHTML() : modalContent.innerHTML)

  const showForm = (form: AccountForm) => {
    setPendingMobilePurchase(lookupKey)

    const formNode = DOMCacheGetOrSet(form)
    const parent = formNode.parentElement!
    const nextSibling = formNode.nextSibling
    const previousDisplay = formNode.style.display

    restoreForm = () => {
      formNode.style.display = previousDisplay
      parent.insertBefore(formNode, nextSibling)
      restoreForm = null
    }

    formNode.style.display = 'flex'

    const container = document.createElement('div')
    container.className = 'purchaseAuthModal'

    const title = document.createElement('div')
    title.className = 'resetModalTitle'
    title.textContent = i18next.t(
      form === 'register' ? 'mobile.purchases.createAccount' : 'mobile.purchases.login'
    )

    const buttonRow = document.createElement('div')
    buttonRow.className = 'modalButtonRow'
    const backButton = document.createElement('button')
    backButton.className = 'modalBtnBuy'
    backButton.dataset.modalAction = 'back'
    backButton.textContent = i18next.t('general.Back')
    buttonRow.appendChild(backButton)

    container.append(title, formNode, buttonRow)
    modalContent.replaceChildren(container)
  }

  const showChoice = () => {
    restoreForm?.()
    modalContent.replaceChildren()
  }

  const closeAuthModal = () => {
    restoreForm?.()
    CloseModal()
  }

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
        } else {
          closeAuthModal()
        }
      }
    }
  )

  const modal = DOMCacheGetOrSet('modal')
  /* eslint-disable-next-line unicorn/prefer-add-event-listener */
  modal.onclick = (event) => {
    if (event.target === modal) {
      closeAuthModal()
    }
  }
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
