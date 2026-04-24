/// <reference types="cordova-plugin-purchase" />

import i18next from 'i18next'
import { platform } from '../Config'
import { CartTab, coinProducts } from '../purchases/CartTab'
import { updatePseudoCoins } from '../purchases/UpgradesSubtab'
import { Alert, Notification } from '../UpdateHTML'
import { memoize } from '../Utility'

const APPLE_BUNDLE_ID = 'cc.pseudocorp.synergism'

type Store = typeof CdvPurchase.store

const toAppStoreProductId = (lookupKey: string) => `${APPLE_BUNDLE_ID}.${lookupKey.replaceAll('-', '_')}`

const initStore = memoize(async (): Promise<Store> => {
  await waitForDeviceReady()
  await CartTab.fetchProducts()

  const { store, ProductType, Platform } = CdvPurchase

  const products = coinProducts.map((product) => ({
    type: ProductType.CONSUMABLE,
    id: toAppStoreProductId(product.id),
    platform: Platform.APPLE_APPSTORE
  }))

  store.register(products)

  store.when()
    .approved((transaction) => {
      onTransactionApproved(transaction).catch((e) => {
        console.error('Failed to finalize Apple transaction', e)
        Notification(i18next.t('mobile.purchases.verifyFailed', { error: `${e}` }))
      })
    })

  const errors = await store.initialize([Platform.APPLE_APPSTORE])
  if (errors.length > 0) {
    console.error('CdvPurchase init errors', errors)
  }

  return store
})

function waitForDeviceReady () {
  return new Promise<void>((resolve) => {
    if (typeof window !== 'undefined' && 'CdvPurchase' in window) {
      resolve()
      return
    }
    document.addEventListener('deviceready', () => resolve(), { once: true })
  })
}

function appStoreIdToLookupKey (appStoreId: string): string | null {
  const product = coinProducts.find((p) => toAppStoreProductId(p.id) === appStoreId)
  return product?.id ?? null
}

async function onTransactionApproved (transaction: CdvPurchase.Transaction): Promise<void> {
  if (transaction.platform !== CdvPurchase.Platform.APPLE_APPSTORE) {
    return
  }

  const appleTxn = transaction as CdvPurchase.AppleAppStore.SKTransaction
  const jws = appleTxn.jwsRepresentation
  const productId = appleTxn.products[0]?.id

  if (!jws || !productId) {
    console.error('Apple transaction missing jwsRepresentation or productId', appleTxn)
    return
  }

  const lookupKey = appStoreIdToLookupKey(productId)
  if (!lookupKey) {
    console.error(`No Stripe lookup key maps to ${productId}`)
    return
  }

  const response = await fetch('https://synergism.cc/api/v1/apple/verify-transaction', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      lookupKey,
      signedTransaction: jws
    })
  })

  if (!response.ok) {
    const { error } = await response.json().catch(() => ({ error: `HTTP ${response.status}` })) as { error: string }
    Notification(i18next.t('mobile.purchases.verifyFailed', { error }))
    return
  }

  await transaction.finish()
  updatePseudoCoins().catch(console.error)
  Notification(i18next.t('mobile.purchases.success'))
}

export async function orderProduct (lookupKey: string): Promise<void> {
  if (platform !== 'mobile') return
  const store = await initStore()
  const product = store.get(toAppStoreProductId(lookupKey), CdvPurchase.Platform.APPLE_APPSTORE)

  if (!product) {
    await Alert(i18next.t('mobile.purchases.productUnavailable'))
    return
  }

  const offer = product.getOffer()
  if (!offer) {
    await Alert(i18next.t('mobile.purchases.productUnavailable'))
    return
  }

  const result = await store.order(offer)
  if (result && 'code' in result) {
    Notification(i18next.t('mobile.purchases.orderFailed', { error: result.message }))
  }
}

export const initMobilePurchases = () => {
  initStore().catch((e) => console.error('Failed to initialize mobile purchases', e))
}
