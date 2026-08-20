import { showPurchaseAuthModal } from '../purchases/PurchaseAuth'

const PENDING_PURCHASE_KEY = 'synergism.pendingMobilePurchase'
const PENDING_PURCHASE_TTL_MS = 30 * 60 * 1000

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

export const showMobilePurchaseAuthModal = async (lookupKey: string) => {
  setPendingMobilePurchase(lookupKey)

  if (!await showPurchaseAuthModal()) {
    localStorage.removeItem(PENDING_PURCHASE_KEY)
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
