import { platform } from '../Config'
import { rewardVideo } from '../mobile/ads'
import { format } from '../Synergism'
import { Alert, Notification } from '../UpdateHTML'
import { memoize } from '../Utility'
import { coinProducts } from './CartTab'
import { addToCart, calculateGrossPrice } from './CartUtil'

const productContainer = document.querySelector<HTMLElement>('#pseudoCoins > #productContainer')

const formatter = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

const clickHandler = async (e: HTMLElementEventMap['click']) => {
  const productId = (e.target as HTMLButtonElement).getAttribute('data-id')
  const productName = (e.target as HTMLButtonElement).getAttribute('data-name')

  if (productId === null || !coinProducts.some((product) => product.id === productId)) {
    Alert('Stop fucking touching the html! We do server-side validation!')
    return
  }

  if (platform === 'mobile') {
    const { orderProduct } = await import('../mobile/microtxn')
    await orderProduct(productId)
    return
  }

  addToCart(productId)
  Notification(`Added ${productName} to the cart!`)
}

const initializeProductPage = memoize(() => {

  let advertSection = ''
  if (platform === 'mobile') {
    advertSection = `<section class="pseudoCoinAdvert">
    <div>
      <img class="pseudoCoinImage alt="Advert for PseudoCoins" src="./Pictures/AdvertCoins.png />
      <p class="pseudoCoinText">
        Watch an advert for 5 free PseudoCoins!
      </p>
      <button data-id="advert" data-name="rewarded advertisement" class="pseudoCoinButton">
        WATCH AD
      </button>
    </div>
    </section>`
  }

  productContainer!.innerHTML = coinProducts.map((product) => (`
    <section class="pseudoCoinContainer" key="${product.id}">
      <div>
        <img class="pseudoCoinImage" alt="${product.name}" src="./Pictures/${product.id}.png" />
        <p class="pseudoCoinText">
          ${product.name} [${format(product.coins)} PseudoCoins]
        </p>
        <button data-id="${product.id}" data-name="${product.name}" class="pseudoCoinButton">
          ${formatter.format(calculateGrossPrice(product.price / 100))} USD
        </button>
      </div>
    </section>
  `)).join('') + advertSection

  productContainer!.style.display = 'grid'

  document.querySelectorAll<HTMLButtonElement>('.pseudoCoinContainer > div > button[data-id]').forEach((element) => {
    element.addEventListener('click', clickHandler)
  })

  if (platform === 'mobile') {
    document.querySelector<HTMLButtonElement>('.pseudoCoinAdvert > div > button[data-id="advert"]')!.addEventListener('click', rewardVideo)
  }

})

export const clearProductPage = () => {
  productContainer!.style.display = 'none'
}

export const toggleProductPage = () => {
  initializeProductPage()
  productContainer!.style.display = 'grid'
}
