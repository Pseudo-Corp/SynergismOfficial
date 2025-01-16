import { prod } from '../Config'
import { isLoggedIn } from '../Login'
import { player } from '../Synergism'
import { changeSubTab, Tabs } from '../Tabs'
import { Alert } from '../UpdateHTML'
import { createDeferredPromise, type DeferredPromise, memoize } from '../Utility'
import { setEmptyProductMap } from './CartUtil'
import { clearCheckoutTab, toggleCheckoutTab } from './CheckoutTab'
import { clearMerchSubtab, toggleMerchSubtab } from './MerchTab'
import { clearProductPage, toggleProductPage } from './ProductSubtab'
import { clearSubscriptionPage, toggleSubscriptionPage } from './SubscriptionsSubtab'
import { clearUpgradeSubtab, toggleUpgradeSubtab, type UpgradesResponse } from './UpgradesSubtab'

export type Product = {
  name: string
  id: string
  price: number
  coins: number
  subscription: boolean
  description: string
}

export const products: Product[] = []
export let coinProducts: Product[] = []
export let subscriptionProducts: Product[] = []
export let upgradeResponse: UpgradesResponse

const cartSubTabs = {
  Coins: 0,
  Subscriptions: 1,
  Upgrades: 2,
  Checkout: 3,
  Merch: 4
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
        coinProducts = products.filter((product) => !product.subscription)
        subscriptionProducts = products.filter((product) => product.subscription)

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
        if (isLoggedIn() || !prod) {
          changeSubTab(Tabs.Purchase, { page: index })
        } else {
          Alert('Note: you must be logged in to view this tab!')
        }
      })
    }
  }

  #updateSubtabs () {
    for (const [index, element] of yieldQuerySelectorAll('.subtabSwitcher button')) {
      if (player.subtabNumber === index) {
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

    switch (player.subtabNumber) {
      case cartSubTabs.Coins:
        CartTab.fetchProducts().then(() => {
          if (player.subtabNumber === cartSubTabs.Coins) {
            toggleProductPage()
          }
        })
        break
      case cartSubTabs.Subscriptions:
        CartTab.fetchProducts().then(() => {
          if (player.subtabNumber === cartSubTabs.Subscriptions) {
            toggleSubscriptionPage()
          }
        })
        break
      case cartSubTabs.Upgrades:
        CartTab.fetchUpgrades().then(() => {
          if (player.subtabNumber === cartSubTabs.Upgrades) {
            toggleUpgradeSubtab()
          }
        })
        break
      case cartSubTabs.Checkout:
        CartTab.fetchProducts().then(() => {
          if (player.subtabNumber === cartSubTabs.Checkout) {
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

  // Switch to the upgrades tab if not logged in
  if (!isLoggedIn() || !prod) {
    changeSubTab(Tabs.Purchase, { step: 1 })
  }
})

export const initializeCart = () => {
  onInit()

  new CartTab()
}
