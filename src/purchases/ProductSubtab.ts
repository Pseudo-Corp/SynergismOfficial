import { format } from '../Synergism'
import { Alert, Notification } from '../UpdateHTML'
import { memoize } from '../Utility'
import { coinProducts } from './CartTab'
import { addToCart } from './CartUtil'

const productContainer = document.querySelector<HTMLElement>('#pseudoCoins > #productContainer')

const formatter = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

const clickHandler = (e: HTMLElementEventMap['click']) => {
  const productId = (e.target as HTMLButtonElement).getAttribute('data-id')
  const productName = (e.target as HTMLButtonElement).getAttribute('data-name')

  if (productId === null || !coinProducts.some((product) => product.id === productId)) {
    Alert('Stop fucking touching the html! We do server-side validation!')
    return
  }

  addToCart(productId)
  Notification(`Added ${productName} to the cart!`)
}

export const initializeProductPage = memoize(() => {
  productContainer!.innerHTML = coinProducts.map((product) => (`
    <section class="pseudoCoinContainer" key="${product.id}">
      <div>
        <img class="pseudoCoinImage" alt="${product.name}" src="./Pictures/${product.id}.png" />
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

export const toggleProductPage = () => {
  initializeProductPage()
  productContainer!.style.display = 'grid'
}
