import { isLoggedIn } from '../Login'
import { player } from '../Synergism'
import { changeSubTab, Tabs } from '../Tabs'
import { Alert } from '../UpdateHTML'
import { createDeferredPromise, type DeferredPromise, memoize } from '../Utility'
import { setEmptyProductMap } from './CartUtil'
import { clearCheckoutTab, toggleCheckoutTab } from './CheckoutTab'
import { clearProductPage, initializeProductPage } from './ProductSubtab'
import { clearUpgradeSubtab, toggleUpgradeSubtab } from './UpgradesSubtab'

export type Product = {
  name: string
  id: number
  price: number
  coins: number
}

const cartSubTabs = {
  Coins: 0,
  Upgrades: 1,
  Checkout: 2
} as const

const tab = document.getElementById('pseudoCoins')!

function* yieldQuerySelectorAll (selector: string) {
  const elements = tab.querySelectorAll(selector)

  for (let i = 0; i < elements.length; i++) {
    yield [i, elements.item(i)] as const
  }
}

class CartTab {
  static #productsFetch: DeferredPromise<undefined> | undefined
  static #products: Product[] = []

  constructor () {
    this.#updateSubtabs()
  }

  static fetchProducts () {
    if (CartTab.#productsFetch) {
      return CartTab.#productsFetch.promise
    }

    CartTab.#productsFetch = createDeferredPromise()

    // TODO: move this fetch to the products page.
    fetch('https://synergism.cc/stripe/products')
      .then((response) => response.json() as Promise<Product[]>)
      .then((products) => {
        CartTab.#products.push(...products)
        setEmptyProductMap(products)
        CartTab.#productsFetch?.resolve(undefined)
      }, CartTab.#productsFetch.reject)

    return CartTab.#productsFetch.promise
  }

  static applySubtabListeners () {
    for (const [index, element] of yieldQuerySelectorAll('.subtabSwitcher button')) {
      element.addEventListener('click', () => {
        if (isLoggedIn()) {
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
        element.classList.add('buttonActive')
      } else {
        element.classList.remove('buttonActive')
      }
    }

    clearProductPage()
    clearUpgradeSubtab()
    clearCheckoutTab()

    switch (player.subtabNumber) {
      case cartSubTabs.Coins:
        CartTab.fetchProducts().then(() => initializeProductPage(CartTab.#products))
        break
      case cartSubTabs.Upgrades:
        toggleUpgradeSubtab()
        break
      case cartSubTabs.Checkout:
        CartTab.fetchProducts().then(() => toggleCheckoutTab(CartTab.#products))
        break
    }
  }
}

const onInit = memoize(() => {
  CartTab.fetchProducts()
  CartTab.applySubtabListeners()

  // Switch to the upgrades tab if not logged in
  if (!isLoggedIn()) {
    changeSubTab(Tabs.Purchase, { step: 1 })
  }
})

export const initializeCart = () => {
  onInit()

  new CartTab()
}
