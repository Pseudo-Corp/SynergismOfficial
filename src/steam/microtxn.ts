import { requirePurchaseAuthentication } from '../purchases/PurchaseAuth'
import { Alert, Notification } from '../UpdateHTML'
import { createDeferredPromise } from '../Utility'
import type { MicroTxnAuthorizationResponse } from './steam'
import { getSteamId, onMicroTxnAuthorizationResponse } from './steam'

// https://partner.steamgames.com/doc/features/microtransactions/implementation#5
export async function submitSteamMicroTxn (fd: FormData): Promise<boolean> {
  if (!await requirePurchaseAuthentication()) {
    return false
  }

  const steamId = await getSteamId()

  if (!steamId) {
    await Alert('Steam is not initialized, I cannot create a transaction')
    return false
  }

  // oxlint-disable-next-line synergism-rules/no-relative-fetch
  const initTxnResponse = await fetch(`/api/v2/steam/init-txn?steamId=${steamId}`, {
    method: 'POST',
    body: fd
  })

  if (!initTxnResponse.ok) {
    const { error } = await initTxnResponse.json() as { error: string }
    Notification(error)
    return false
  }

  const { orderId } = await initTxnResponse.json() as { orderId: string; transId: string }

  const p = createDeferredPromise<MicroTxnAuthorizationResponse>()
  onMicroTxnAuthorizationResponse((txnResponse) => p.resolve(txnResponse))

  const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 15 * 60 * 1000))

  let txnResponse: MicroTxnAuthorizationResponse
  try {
    txnResponse = await Promise.race([p.promise, timeout])
  } catch {
    Notification('Steam did not respond in time. Please try again.')
    return false
  }

  if (txnResponse.order_id.toString() !== orderId) {
    return false
  }

  if (!txnResponse.authorized) {
    Notification('Transaction was not authorized.')
    return false
  }

  // oxlint-disable-next-line synergism-rules/no-relative-fetch
  const finalizeResponse = await fetch('/api/v2/steam/finalize-txn', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ orderId })
  })

  if (!finalizeResponse.ok) {
    const { error } = await finalizeResponse.json() as { error: string }
    Notification(error)
    return false
  }

  return true
}
