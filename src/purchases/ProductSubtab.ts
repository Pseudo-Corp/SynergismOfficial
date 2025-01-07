import { format } from '../Synergism'
import { Alert, Notification } from '../UpdateHTML'
import { memoize } from '../Utility'
import type { Product } from './CartTab'
import { addToCart } from './CartUtil'

const productContainer = document.querySelector<HTMLElement>('#pseudoCoins > #productContainer')

const formatter = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

const clickHandler = (e: HTMLElementEventMap['click']) => {
  const productId = Number((e.target as HTMLButtonElement).getAttribute('data-id'))
  const productName = (e.target as HTMLButtonElement).getAttribute('data-name')

  if (Number.isNaN(productId) || !Number.isSafeInteger(productId)) {
    Alert('Stop fucking touching the html! We do server-side validation!')
    return
  }

  addToCart(productId)
  Notification(`Added ${productName} to the cart!`)
}

export const initializeProductPage = memoize((products: Product[]) => {
  productContainer!.innerHTML = products.map((product) => (`
    <section class="pseudoCoinContainer" key="${product.id}">
      <div>
        <img class="pseudoCoinImage" alt="${product.name}" src="./Pictures/${product.name}.png" />
        <p class="pseudoCoinText">
          ${product.name} [${format(product.coins)} PseudoCoins]
        </p>
        <button data-id="${product.id}" data-name="${product.name}" class="pseudoCoinButton">
          ${formatter.format(product.price / 100)} USD
        </button>
      </div>
    </section>
  `)).join('')

  productContainer!.style.display = 'grid'

  document.querySelectorAll<HTMLButtonElement>('.pseudoCoinContainer > div > button[data-id]').forEach((element) => {
    element.addEventListener('click', clickHandler)
  })
})

export const clearProductPage = () => {
  productContainer!.style.display = 'none'
}

export const toggleProductPage = (products: Product[]) => {
  initializeProductPage(products)
  productContainer!.style.display = 'grid'
}
