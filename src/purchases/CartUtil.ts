import type { Product } from './CartTab'

/** A map of all products in the cart. */
const cartMap = new Map<string, { quantity: number; price: number; rest: Omit<Product, 'price' | 'id'> }>()

/** Total number of items in the cart */
let inCart = 0

export const decrementInCart = () => {
  inCart = Math.max(0, inCart - 1)
  updateInCartCount()
}

export const incrementInCart = () => {
  inCart++
  updateInCartCount()
}

export const getInCartTotal = () => inCart

const updateInCartCount = () => {
  const counter = document.getElementById('notification-count')!

  if (inCart === 0) {
    counter.style.display = 'none'
  } else {
    counter.style.display = 'unset'
  }

  counter.textContent = `${inCart}`
}

export const setEmptyProductMap = (products: Product[]) => {
  for (const { id, price, ...rest } of products) {
    cartMap.set(id, { quantity: 0, price, rest })
  }
}

export const addToCart = (id: string) => {
  const itemInCart = cartMap.get(id)!
  itemInCart.quantity++
  inCart++

  updateInCartCount()
}

export const removeFromCart = (id: string) => {
  const itemInCart = cartMap.get(id)!
  itemInCart.quantity--
  inCart--

  updateInCartCount()
}

/**
 * Returns the price of everything in the cart.
 */
export const getPrice = () => {
  let totalPrice = 0

  for (const { price, quantity } of cartMap.values()) {
    if (quantity > 0) {
      totalPrice += price * quantity
    }
  }

  return totalPrice
}

export const getQuantity = (id: string) => {
  return cartMap.get(id)!.quantity
}

export const getProductsInCart = () => {
  const temp: (Product & { quantity: number })[] = []

  for (const [id, { quantity, price, rest }] of cartMap) {
    if (quantity > 0) {
      temp.push({ id, quantity, price, ...rest })
    }
  }

  return temp
}
