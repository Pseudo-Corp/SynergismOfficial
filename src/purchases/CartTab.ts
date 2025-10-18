import { prod } from '../Config'
import { changeSubTab, getActiveSubTab, Tabs } from '../Tabs'
import { createDeferredPromise, type DeferredPromise, memoize } from '../Utility'
import { setEmptyProductMap } from './CartUtil'
import { clearCheckoutTab, toggleCheckoutTab } from './CheckoutTab'
import { clearConsumablesTab, toggleConsumablesTab } from './ConsumablesTab'
import { clearMerchSubtab, toggleMerchSubtab } from './MerchTab'
import { clearProductPage, toggleProductPage } from './ProductSubtab'
import { clearSubscriptionPage, toggleSubscriptionPage } from './SubscriptionsSubtab'
import { clearUpgradeSubtab, toggleUpgradeSubtab, type UpgradesResponse } from './UpgradesSubtab'

interface BaseProduct {
  name: string
  id: string
  price: number
  coins: number
  description: string
}

export interface SubscriptionProduct extends BaseProduct {
  subscription: true
  quarkBonus: number
}

export interface RegularProduct extends BaseProduct {
  subscription: false
}

export type Product = SubscriptionProduct | RegularProduct

export const products: Product[] = []
export let coinProducts: RegularProduct[] = []
export let subscriptionProducts: SubscriptionProduct[] = []
export let upgradeResponse: UpgradesResponse

const cartSubTabs = {
  Coins: 0,
  Subscriptions: 1,
  Upgrades: 2,
  Consumables: 3,
  Checkout: 4,
  Merch: 5
} as const

const tab = document.getElementById('pseudoCoins')!

function* yieldQuerySelectorAll (selector: string) {
  const elements = tab.querySelectorAll(selector)

  for (let i = 0; i < elements.length; i++) {
    yield [i, elements.item(i)] as const
  }
}

export class CartTab {
  static #productsFetch: DeferredPromise<undefined> | undefined
  static #upgradesFetch: DeferredPromise<UpgradesResponse> | undefined

  constructor () {
    this.#updateSubtabs()
  }

  static fetchProducts () {
    if (CartTab.#productsFetch) {
      return CartTab.#productsFetch.promise
    }

    CartTab.#productsFetch = createDeferredPromise()

    const url = !prod ? 'https://synergism.cc/stripe/test/products' : 'https://synergism.cc/stripe/products'

    // TODO: move this fetch to the products page.
    fetch(url)
      .then((response) => response.json())
      .then((productsList: Product[]) => {
        products.push(...productsList)
        setEmptyProductMap(productsList)
        coinProducts = products.filter((product): product is RegularProduct => !product.subscription)
        subscriptionProducts = products.filter((product): product is SubscriptionProduct => product.subscription)

        // The Subscriptions do not naturally sort themselves by price
        subscriptionProducts.sort((a, b) => a.price - b.price)
        CartTab.#productsFetch?.resolve(undefined)
      }, CartTab.#productsFetch.reject)

    return CartTab.#productsFetch.promise
  }

  static fetchUpgrades () {
    if (CartTab.#upgradesFetch) {
      return CartTab.#upgradesFetch.promise
    }

    CartTab.#upgradesFetch = createDeferredPromise()

    const url = !prod ? 'https://synergism.cc/stripe/test/upgrades' : 'https://synergism.cc/stripe/upgrades'

    // TODO: move this fetch to the products page.
    fetch(url)
      .then((response) => response.json())
      .then((upgrades: UpgradesResponse) => {
        CartTab.#upgradesFetch!.resolve(upgrades)
        upgradeResponse = upgrades
      }, CartTab.#upgradesFetch.reject)

    return CartTab.#upgradesFetch.promise
  }

  static applySubtabListeners () {
    for (const [index, element] of yieldQuerySelectorAll('.subtabSwitcher button')) {
      element.addEventListener('click', () => {
        changeSubTab(Tabs.Purchase, { page: index })
      })
    }
  }

  #updateSubtabs () {
    for (const [index, element] of yieldQuerySelectorAll('.subtabSwitcher button')) {
      if (getActiveSubTab() === index) {
        element.classList.add('active-subtab')
      } else {
        element.classList.remove('active-subtab')
      }
    }

    clearProductPage()
    clearSubscriptionPage()
    clearUpgradeSubtab()
    clearCheckoutTab()
    clearMerchSubtab()
    clearConsumablesTab()

    switch (getActiveSubTab()) {
      case cartSubTabs.Coins:
        CartTab.fetchProducts().then(() => {
          if (getActiveSubTab() === cartSubTabs.Coins) {
            toggleProductPage()
          }
        })
        break
      case cartSubTabs.Subscriptions:
        CartTab.fetchProducts().then(() => {
          if (getActiveSubTab() === cartSubTabs.Subscriptions) {
            toggleSubscriptionPage()
          }
        })
        break
      case cartSubTabs.Upgrades:
        CartTab.fetchUpgrades().then(() => {
          if (getActiveSubTab() === cartSubTabs.Upgrades) {
            toggleUpgradeSubtab()
          }
        })
        break
      case cartSubTabs.Consumables:
        toggleConsumablesTab()
        break
      case cartSubTabs.Checkout:
        CartTab.fetchProducts().then(() => {
          if (getActiveSubTab() === cartSubTabs.Checkout) {
            toggleCheckoutTab()
          }
        })
        break
      case cartSubTabs.Merch:
        toggleMerchSubtab()
        break
    }
  }
}

const onInit = memoize(() => {
  CartTab.fetchProducts()
  CartTab.applySubtabListeners()
})

export const initializeCart = () => {
  onInit()

  new CartTab()
}
