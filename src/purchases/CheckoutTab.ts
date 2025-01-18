import { prod } from '../Config'
import { changeSubTab, Tabs } from '../Tabs'
import { Alert, Notification } from '../UpdateHTML'
import { memoize } from '../Utility'
import { products, subscriptionProducts } from './CartTab'
import { addToCart, getPrice, getProductsInCart, getQuantity, removeFromCart } from './CartUtil'

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

  checkout?.addEventListener('click', () => {
    if (!tosAgreed) {
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
