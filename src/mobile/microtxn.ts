import { Platform, ProductType, store, type Transaction } from 'capacitor-plugin-cdv-purchase'
import i18next from 'i18next'
import { platform } from '../Config'
import { CartTab, coinProducts } from '../purchases/CartTab'
import { updatePseudoCoins } from '../purchases/UpgradesSubtab'
import { Alert, Notification } from '../UpdateHTML'
import { memoize } from '../Utility'

const APPLE_BUNDLE_ID = 'cc.pseudocorp.synergism'

const toAppStoreProductId = (lookupKey: string) => `${APPLE_BUNDLE_ID}.${lookupKey.replaceAll('-', '_')}`

const initStore = memoize(async (): Promise<void> => {
  await CartTab.fetchProducts()

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
})

async function onTransactionApproved (transaction: Transaction): Promise<void> {
  if (transaction.platform !== Platform.APPLE_APPSTORE) {
    return
  }

  await transaction.finish()
  updatePseudoCoins().catch(console.error)
  Notification(i18next.t('mobile.purchases.success'))
}

async function getAppleUuid (): Promise<string | null> {
  const response = await fetch('https://synergism.cc/api/v1/apple/uuid', { credentials: 'include' })
  if (!response.ok) return null
  const { uuid } = await response.json() as { uuid: string }
  return uuid
}

export async function orderProduct (lookupKey: string): Promise<void> {
  if (platform !== 'mobile') return
  await initStore()
  const product = store.get(toAppStoreProductId(lookupKey), Platform.APPLE_APPSTORE)

  if (!product) {
    await Alert(i18next.t('mobile.purchases.productUnavailable'))
    return
  }

  const offer = product.getOffer()
  if (!offer) {
    await Alert(i18next.t('mobile.purchases.productUnavailable'))
    return
  }

  const applicationUsername = await getAppleUuid()
  if (!applicationUsername) {
    Notification(i18next.t('mobile.purchases.orderFailed', { error: 'Not signed in' }))
    return
  }

  const result = await store.order(offer, { applicationUsername })
  if (result && 'code' in result) {
    Notification(i18next.t('mobile.purchases.orderFailed', { error: result.message }))
  }
}

export const initMobilePurchases = () => {
  initStore().catch((e) => console.error('Failed to initialize mobile purchases', e))
}
