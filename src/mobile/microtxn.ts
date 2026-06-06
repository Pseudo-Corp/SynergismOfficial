import { Capacitor } from '@capacitor/core'
import { Platform, ProductType, store, type Transaction } from 'capacitor-plugin-cdv-purchase'
import i18next from 'i18next'
import { bus } from '../events/bus'
import { CartTab, coinProducts, subscriptionProducts } from '../purchases/CartTab'
import { updatePseudoCoins } from '../purchases/UpgradesSubtab'
import { Alert, Notification } from '../UpdateHTML'
import { memoize } from '../Utility'

const BUNDLE_ID = 'cc.pseudocorp.synergism'

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

const initStore = memoize(async (): Promise<void> => {
  await CartTab.fetchProducts()

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
    console.error('CdvPurchase init errors', errors)
  }
})

async function onTransactionApproved (transaction: Transaction): Promise<void> {
  if (transaction.platform !== storePlatform) {
    return
  }

  await transaction.finish()

  const isSubscription = transaction.products.some((p) =>
    subscriptionProducts.some((sub) => toStoreProductId(sub.id) === p.id)
  )

  if (isSubscription) {
    Notification(i18next.t('mobile.purchases.subscriptionSuccess'))
    return
  }

  updatePseudoCoins().catch(console.error)
  Notification(i18next.t('mobile.purchases.success'))
}

async function getStoreUuid (): Promise<string | null> {
  const response = await fetch('https://synergism.cc/api/v1/mobile/uuid', { credentials: 'include' })
  if (!response.ok) return null
  const { uuid } = await response.json() as { uuid: string }
  return uuid
}

export async function orderProduct (lookupKey: string): Promise<void> {
  if (PLATFORM !== 'mobile') return
  await initStore()
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
  if (!applicationUsername) {
    Notification(i18next.t('mobile.purchases.orderFailed', { error: 'Not signed in' }))
    return
  }

  // Apple's adapter reads from store.applicationUsername (global); Google's
  // adapter reads from additionalData.applicationUsername. Set both so the
  // user identifier reaches whichever store is active.
  store.applicationUsername = applicationUsername
  const result = await store.order(offer, {
    applicationUsername,
    googlePlay: {
      accountId: applicationUsername
    }
  })
  if (result && 'code' in result) {
    Notification(i18next.t('mobile.purchases.orderFailed', { error: result.message }))
  }
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

export const initMobilePurchases = () => {
  initStore().catch((e) => console.error('Failed to initialize mobile purchases', e))
}
