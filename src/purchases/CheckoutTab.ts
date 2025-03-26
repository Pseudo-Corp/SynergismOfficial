import { loadScript } from '@paypal/paypal-js'
import { prod } from '../Config'
import { changeSubTab, Tabs } from '../Tabs'
import { Alert, Notification } from '../UpdateHTML'
import { memoize } from '../Utility'
import { products, subscriptionProducts } from './CartTab'
import { addToCart, clearCart, getPrice, getProductsInCart, getQuantity, removeFromCart } from './CartUtil'
import { updatePseudoCoins } from './UpgradesSubtab'

const tab = document.querySelector<HTMLElement>('#pseudoCoins > #cartContainer')!
const form = tab.querySelector('div.cartList')!

const checkout = form.querySelector('button#checkout')
const closeCart = form.querySelector('button#closeCart')
const radioTOSAgree = form.querySelector<HTMLInputElement>('section > input[type="radio"]')!
const totalCost = form.querySelector('p#totalCost')
const itemList = form.querySelector('#itemList')!

let tosAgreed = false
const formatter = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

export const initializeCheckoutTab = memoize(() => {
  closeCart?.addEventListener('click', () => {
    changeSubTab(Tabs.Purchase, { page: 0 })
  })

  radioTOSAgree.addEventListener('click', () => {
    tosAgreed = !tosAgreed
    radioTOSAgree.checked = tosAgreed
  })

  itemList.insertAdjacentHTML(
    'afterend',
    products.map((product) => (`
      <div key="${product.id}">
      <input
          hidden
          name="${product.id}"
          value="${getQuantity(product.id)}"
          type="number"
        />
      </div>
    `)).join('')
  )

  checkout?.addEventListener('click', (e) => {
    if (!tosAgreed) {
      e.preventDefault()
      Notification('You must accept the terms of service first!')
      return
    }

    const fd = new FormData()

    for (const product of getProductsInCart()) {
      fd.set(product.id, `${product.quantity}`)
    }

    fd.set('tosAgree', tosAgreed ? 'on' : 'off')

    checkout.setAttribute('disabled', '')

    const url = !prod
      ? 'https://synergism.cc/stripe/test/create-checkout-session'
      : 'https://synergism.cc/stripe/create-checkout-session'

    fetch(url, {
      method: 'POST',
      body: fd
    }).then((response) => response.json())
      .then((json: { redirect: string; error: string }) => {
        if (json.redirect) {
          window.location.href = json.redirect
        } else {
          Notification(json.error)
        }
      })
      .finally(() => {
        checkout.removeAttribute('disabled')
      })
  })

  initializePayPal('#checkout-paypal')
})

function addItem (e: MouseEvent) {
  e.preventDefault()

  const key = (e.target as HTMLButtonElement).closest('div[key]')?.getAttribute('key')

  if (key == null || !products.some((product) => product.id === key)) {
    Alert('Stop fucking touching the html! We do server-side validation!')
    return
  } else if (subscriptionProducts.some((product) => getQuantity(product.id) !== 0)) {
    Alert('You can only subscribe to 1 subscription tier!')
    return
  }

  addToCart(key)
  updateItemList()
  updateTotalPriceInCart()
}

function removeItem (e: MouseEvent) {
  e.preventDefault()

  const key = (e.target as HTMLButtonElement).closest('div[key]')?.getAttribute('key')

  if (key == null || !products.some((product) => product.id === key)) {
    Alert('Stop fucking touching the html! We do server-side validation!')
    return
  }

  removeFromCart(key)
  updateItemList()
  updateTotalPriceInCart()
}

function updateItemList () {
  itemList.querySelectorAll<HTMLButtonElement>('.cartListElementContainer > button').forEach((button) => {
    button.removeEventListener('click', button.id === 'add' ? addItem : removeItem)
  })

  itemList.innerHTML = getProductsInCart().map((product) => (`
    <div class="cartListElementContainer" key="${product.id}">
      <img src="Pictures/Default/BackedQuark.png" width="32px" height="32px" alt="Backed Quark" />
      <span class="cartListElement">${product.name}</span>
      <span style="color:cyan">
        ${product.quantity > 0 ? `x${product.quantity}` : ''}
      </span>
      <button id="add" ${product.subscription ? 'disabled' : ''}>+</button>
      <button id="sub">-</button>
    </div>
  `)).join('')

  itemList.querySelectorAll<HTMLButtonElement>('.cartListElementContainer > button').forEach((button) => {
    button.addEventListener('click', button.id === 'add' ? addItem : removeItem)
  })
}

export const toggleCheckoutTab = () => {
  initializeCheckoutTab()

  updateTotalPriceInCart()
  updateItemList()

  tab.style.display = 'flex'
}

export const clearCheckoutTab = () => {
  tab.style.display = 'none'

  itemList.querySelectorAll<HTMLButtonElement>('.cartListElementContainer > button').forEach((button) => {
    button.removeEventListener('click', button.id === 'add' ? addItem : removeItem)
  })
}

const updateTotalPriceInCart = () => {
  totalCost!.textContent = `${formatter.format(getPrice() / 100)} USD`
}

async function initializePayPal (selector: string | HTMLElement) {
  try {
    const paypal = await loadScript({
      clientId: 'AS1HYTVcH3Kqt7IVgx7DkjgG8lPMZ5kyPWamSBNEowJ-AJPpANNTJKkB_mF0C4NmQxFuWQ9azGbqH2Gr',
      disableFunding: ['paylater', 'credit', 'card', 'venmo']
    })

    paypal?.Buttons?.({
      style: {
        shape: 'rect',
        layout: 'vertical',
        color: 'gold',
        label: 'paypal'
      },

      async createOrder () {
        const fd = new FormData()

        for (const product of getProductsInCart()) {
          if (product.quantity > 0 && product.subscription) {
            throw new TypeError('skipping')
          }

          fd.set(product.id, `${product.quantity}`)
        }

        fd.set('tosAgree', tosAgreed ? 'on' : 'off')
        const url = 'https://synergism.cc/paypal/orders/create'

        const response = await fetch(url, {
          method: 'POST',
          body: fd
        })

        const orderData = await response.json()

        if (orderData.id) {
          return orderData.id
        }

        const errorDetail = orderData?.details?.[0]
        const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
          : JSON.stringify(orderData)

        throw new Error(errorMessage)
      },

      async onApprove (data, actions) {
        const url = `https://synergism.cc/paypal/orders/${data.orderID}/capture`

        const response = await fetch(url, { method: 'POST' })
        const orderData = await response.json()
        const errorDetail = orderData?.details?.[0]

        console.log(orderData)

        if (errorDetail?.issue === 'INSTRUMENT_DECLINED') {
          // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
          // https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
          return actions.restart()
        } else if (errorDetail) {
          // (2) Other non-recoverable errors -> Show a failure message
          throw new Error(
            `${errorDetail.description} (${orderData.debug_id})`
          )
        } else if (!orderData.purchase_units) {
          throw new Error(JSON.stringify(orderData))
        } else {
          // (3) Successful transaction -> Show confirmation or thank you message
          // Or go to another URL:  actions.redirect('thank_you.html');
          const transaction = orderData?.purchase_units?.[0]?.payments
            ?.captures?.[0]
            || orderData?.purchase_units?.[0]?.payments
              ?.authorizations?.[0]

          Notification(
            `Transaction ${transaction.status}: ${transaction.id}. Please give us a few minutes to process it.`
          )

          clearCart()
          updateItemList()
          updateTotalPriceInCart()

          exponentialPseudoCoinBalanceCheck()
        }
      },

      onError (error) {
        Notification('An error with PayPal happened. More info in console.')
        console.log(error)
      }
    }).render(selector)
  } catch (e) {
    console.error(e)
  }
}

const sleep = (delay: number) => new Promise((r) => setTimeout(r, delay))

async function exponentialPseudoCoinBalanceCheck () {
  const delays = [0, 30_000, 60_000, 120_000, 180_000, 240_000, 300_000]
  const lastCoinAmount = 0

  for (const delay of delays) {
    await sleep(delay)
    const coins = await updatePseudoCoins()

    if (lastCoinAmount !== coins) {
      break
    }
  }
}
