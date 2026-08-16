import { Capacitor } from '@capacitor/core'
import { ErrorCode, Platform, ProductType, store, type Transaction } from 'capacitor-plugin-cdv-purchase'
import i18next from 'i18next'
import { bus } from '../events/bus'
import { CartTab, coinProducts, subscriptionProducts } from '../purchases/CartTab'
import { updatePseudoCoins } from '../purchases/UpgradesSubtab'
import { Alert, Notification } from '../UpdateHTML'
import { consumePendingMobilePurchase, showMobilePurchaseAuthModal } from './purchase-auth'

const BUNDLE_ID = 'cc.pseudocorp.synergism'

let orderInProgress = false
let storeInitialization: Promise<void> | undefined
let storeInitializeCalled = false

const storePlatform = Capacitor.getPlatform() === 'android'
  ? Platform.GOOGLE_PLAY
  : Platform.APPLE_APPSTORE

const toStoreProductId = (lookupKey: string) => {
  const isSubscription = subscriptionProducts.some((p) => p.id === lookupKey)
  const formattedKey = lookupKey.replaceAll('-', '_')

  if (isSubscription && storePlatform === Platform.GOOGLE_PLAY) {
    return `sub.${formattedKey}`
  }

  const prefix = isSubscription ? `${BUNDLE_ID}.sub` : BUNDLE_ID
  return `${prefix}.${formattedKey}`
}

const anyProductLoaded = () =>
  [...coinProducts, ...subscriptionProducts]
    .some((product) => store.get(toStoreProductId(product.id), storePlatform))

const initializeStore = async (): Promise<void> => {
  if (storeInitializeCalled) {
    store.minTimeBetweenUpdates = 0
    await store.update()

    if (!anyProductLoaded()) {
      throw new Error('Store update failed: no products available')
    }

    return
  }

  storeInitializeCalled = true

  const consumables = coinProducts.map((product) => ({
    type: ProductType.CONSUMABLE,
    id: toStoreProductId(product.id),
    platform: storePlatform
  }))

  const subscriptions = subscriptionProducts.map((product) => ({
    type: ProductType.PAID_SUBSCRIPTION,
    id: toStoreProductId(product.id),
    platform: storePlatform
  }))

  store.register([...consumables, ...subscriptions])

  store.when()
    .approved((transaction) => {
      onTransactionApproved(transaction).catch((e) => {
        console.error('Failed to finalize transaction', e)
        Notification(i18next.t('mobile.purchases.verifyFailed', { error: `${e}` }))
      })
    })

  const errors = await store.initialize([storePlatform])
  if (errors.length > 0) {
    const details = errors
      .map((e) => `${ErrorCode[e.code]}(${e.code})${e.productId ? ` [${e.productId}]` : ''}: ${e.message}`)
      .join(' | ')
    console.error(`CdvPurchase init errors: ${details}`)

    if (!anyProductLoaded()) {
      throw new Error(details)
    }
  }
}

export const initMobilePurchases = async (): Promise<void> => {
  await CartTab.fetchProducts()

  const initialization = storeInitialization ??= initializeStore()

  try {
    await initialization
  } catch (e) {
    if (storeInitialization === initialization) {
      storeInitialization = undefined
    }
    throw e
  }
}

async function onTransactionApproved (transaction: Transaction): Promise<void> {
  if (transaction.platform !== storePlatform) {
    return
  }

  await transaction.finish()

  if (!orderInProgress) {
    return
  }

  orderInProgress = false

  updatePseudoCoins().catch(console.error)

  const isSubscription = transaction.products.some((p) =>
    subscriptionProducts.some((sub) => toStoreProductId(sub.id) === p.id)
  )

  if (isSubscription) {
    const { getSubMetadata, handleLogin } = await import('../Login')
    const { exponentialSubscriptionCheck } = await import('../purchases/SubscriptionsSubtab')
    const previousSubscription = getSubMetadata()
    await handleLogin()
    exponentialSubscriptionCheck(previousSubscription)
  }

  Notification(
    i18next.t(isSubscription ? 'mobile.purchases.subscriptionSuccess' : 'mobile.purchases.success')
  )
}

async function getStoreUuid (): Promise<string | null | undefined> {
  const response = await fetch('https://synergism.cc/api/v1/mobile/uuid', { credentials: 'include' })

  if (response.status === 401 || response.status === 403) return null

  if (!response.ok) return undefined

  const { uuid } = await response.json() as { uuid: string }
  return uuid
}

export async function orderProduct (lookupKey: string): Promise<void> {
  if (PLATFORM !== 'mobile') return

  try {
    await initMobilePurchases()
  } catch (e) {
    console.error('Failed to initialize mobile purchases', e)
    Notification(i18next.t('mobile.purchases.orderFailed', { error: `${e}` }))
    return
  }

  const product = store.get(toStoreProductId(lookupKey), storePlatform)

  if (!product) {
    await Alert(i18next.t('mobile.purchases.productUnavailable'))
    return
  }

  const offer = product.getOffer()
  if (!offer) {
    await Alert(i18next.t('mobile.purchases.productUnavailable'))
    return
  }

  const applicationUsername = await getStoreUuid()

  if (applicationUsername === null) {
    showMobilePurchaseAuthModal(lookupKey)
    return
  }

  if (applicationUsername === undefined) {
    Notification(i18next.t('mobile.purchases.orderFailed', { error: i18next.t('mobile.purchases.accountUnavailable') }))
    return
  }

  // Apple's adapter reads from store.applicationUsername (global); Google's
  // adapter reads from additionalData.applicationUsername. Set both so the
  // user identifier reaches whichever store is active.
  store.applicationUsername = applicationUsername
  orderInProgress = true
  const result = await store.order(offer, {
    applicationUsername,
    googlePlay: {
      accountId: applicationUsername
    }
  })
  if (result) {
    orderInProgress = false
    Notification(i18next.t('mobile.purchases.orderFailed', { error: result.message }))
  }
}

export async function resumePendingMobilePurchase (): Promise<void> {
  if (PLATFORM !== 'mobile') return

  const pendingLookupKey = consumePendingMobilePurchase()
  if (pendingLookupKey === null) return

  await orderProduct(pendingLookupKey)
}

if (PLATFORM === 'mobile') {
  bus.addEventListener('subscription:order', (event) => {
    orderProduct(event.detail.lookupKey).catch((e) => {
      console.error('Failed to order subscription', e)
      Notification(i18next.t('mobile.purchases.orderFailed', { error: `${e}` }))
    })
  })

  bus.addEventListener('subscription:manage', () => {
    store.manageSubscriptions(storePlatform)
  })
}
