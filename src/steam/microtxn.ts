import { Alert, Notification } from '../UpdateHTML'
import type { MicroTxnAuthorizationResponse, SteamGetUserInfoResponse } from './steam'
import { getCurrentGameLanguage, getSteamId, onMicroTxnAuthorizationResponse } from './steam'

// https://partner.steamgames.com/doc/features/microtransactions/implementation#5
export async function submitSteamMicroTxn (fd: FormData): Promise<boolean> {
  const [steamId, currentGameLanguage] = await Promise.all([getSteamId(), getCurrentGameLanguage()])

  if (!steamId || !currentGameLanguage) {
    await Alert('Steam is not initialized, I cannot create a transaction')
    return false
  }

  const response = await fetch('/api/v1/steam/get-user-info', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      steamId,
      currentGameLanguage
    })
  })

  if (!response.ok) {
    const { error } = await response.json()
    Notification(error)
    return false
  }

  const { status } = await response.json() as SteamGetUserInfoResponse

  if (status === 'Locked') {
    await Alert('Your Steam account is locked. You cannot make purchases.')
    return false
  }

  const initTxnResponse = await fetch('/api/v1/steam/init-txn', {
    method: 'POST',
    body: fd
  })

  if (!initTxnResponse.ok) {
    const { error } = await initTxnResponse.json() as { error: string }
    Notification(error)
    return false
  }

  const { orderId } = await initTxnResponse.json() as { orderId: string; transId: string }

  const p = Promise.withResolvers<MicroTxnAuthorizationResponse>()
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

  const finalizeResponse = await fetch('/api/v1/steam/finalize-txn', {
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
