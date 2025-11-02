import { loadScript } from '@paypal/paypal-js'
import { prod } from '../Config'
import { getSubMetadata } from '../Login'
import { Alert, Confirm, Notification } from '../UpdateHTML'
import { memoize } from '../Utility'
import { type SubscriptionProduct, subscriptionProducts } from './CartTab'
import { addToCart, getQuantity } from './CartUtil'

const subscriptionsContainer = document.querySelector<HTMLElement>('#pseudoCoins > #subscriptionsContainer')!
const subscriptionSectionHolder = subscriptionsContainer.querySelector<HTMLElement>('#sub-section-holder')!

const formatter = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

async function changeSubscription (productId: string, type: 'upgrade' | 'downgrade') {
  const newSub = subscriptionProducts.find((v) => v.id === productId)
  const newSubPrice = newSub!.price
  const newSubName = newSub!.name
  const confirm = (type === 'downgrade')
    ? await Confirm(
      `You are downgrading to ${newSubName}, which costs ${
        formatter.format(newSubPrice / 100)
      } per month. Downgrading takes effect immediately!`
    )
    : await Confirm(
      `You are upgrading to ${newSubName}, which costs ${formatter.format(newSubPrice / 100)} per month`
    )

  if (!confirm) {
    return
  }

  const link = !prod
    ? `https://synergism.cc/stripe/test/subscription/${type}`
    : `https://synergism.cc/stripe/subscription/${type}`
  const url = new URL(link)
  url.searchParams.set('key', productId)

  const response = await fetch(url, {
    method: 'POST'
  })
  console.log(response, response.text())
  return Alert(`You are now subscribed to ${newSubName}!`)
}

function clickHandler (this: HTMLButtonElement, e: HTMLElementEventMap['click']) {
  const productId = (e.target as HTMLButtonElement).getAttribute('data-id')
  const productName = (e.target as HTMLButtonElement).getAttribute('data-name')

  if (productId === null || !subscriptionProducts.some((product) => product.id === productId)) {
    Alert('Stop fucking touching the html! We do server-side validation!')
    return
  } else if (subscriptionProducts.some((product) => getQuantity(product.id) !== 0)) {
    Alert('You can only subscribe to 1 subscription tier!')
    return
  }

  const sub = getSubMetadata()

  if (sub?.tier) {
    if (this.hasAttribute('data-downgrade')) {
      changeSubscription(productId, 'downgrade')
      return
    } else if (this.hasAttribute('data-upgrade')) {
      changeSubscription(productId, 'upgrade')
      return
    }
  }

  addToCart(productId)
  Notification(`Added ${productName} to the cart!`)
}

const colors = ['gold', 'cyan', 'magenta', 'red']

const constructFeatureList = ({ features }: SubscriptionProduct) => {
  const ul = document.createElement('ul')
  ul.style.textAlign = 'left'
  ul.style.marginTop = '0'

  for (let i = 0; i < features.length; i++) {
    const feature = features[i]
    const color = colors[i] ?? 'blue'

    const li = document.createElement('li')
    li.style.color = color
    li.textContent = `${feature}`

    ul.appendChild(li)
  }

  return ul.outerHTML
}

export const createIndividualSubscriptionHTML = (product: SubscriptionProduct, currentSubTier: number) => {
  const sub = getSubMetadata()
  const isPayPal = sub?.provider === 'paypal'
  const isStripe = sub?.provider === 'stripe'

  if (product.tier < currentSubTier) {
    const stripeDowngradeButton = isStripe || sub === null
      ? `<button data-id="${product.id}" data-name="${product.name}" data-downgrade class="pseudoCoinButton" style="background-color: maroon">
          Downgrade!
        </button>`
      : ''

    return `
      <section class="subscriptionContainer" key="${product.id}">
        <div>
          <img class="pseudoCoinSubImage" alt="${product.name}" src="./Pictures/${product.id}.png" />
          <p class="pseudoCoinText">
          ${product.name.split(' - ').join('<br>')}
          </p>
          <p class="pseudoSubscriptionText">${product.description}</p>
          ${constructFeatureList(product)}
          ${stripeDowngradeButton}
        </div>
      </section>
    `
  } else if (product.tier === currentSubTier) {
    const stripeYouAreHereButton = isStripe
      ? `<button data-id="${product.id}" data-name="${product.name}" class="pseudoCoinButton" style="background-color: #b59410">
          You are here!
        </button>`
      : ''

    return `
      <section class="subscriptionContainer" key="${product.id}">
        <div>
          <img class="pseudoCoinSubImage" alt="${product.name}" src="./Pictures/${product.id}.png" />
          <p class="pseudoCoinText">
          ${product.name.split(' - ').join('<br>')}
          </p>
          <p class="pseudoSubscriptionText">${product.description}</p>
          ${constructFeatureList(product)}
          ${stripeYouAreHereButton}
        </div>
      </section>
    `
  } else {
    const stripeUpgradeButton = isStripe || sub === null
      ? `<button data-id="${product.id}" data-name="${product.name}" data-upgrade class="pseudoCoinButton">
          Upgrade for ${formatter.format(product.price / 100)} USD / mo
        </button>`
      : ''

    const paypalButton = isPayPal || sub === null ? `<div class="checkout-paypal" data-id="${product.id}"></div>` : ''

    return `
      <section class="subscriptionContainer" key="${product.id}">
        <div>
          <img class="pseudoCoinSubImage" alt="${product.name}" src="./Pictures/${product.id}.png" />
          <p class="pseudoCoinText">
          ${product.name.split(' - ').join('<br>')}
          </p>
          <p class="pseudoSubscriptionText">${product.description}</p>
          ${constructFeatureList(product)}
          ${stripeUpgradeButton}
          ${paypalButton}
        </div>
      </section>
    `
  }
}

export const initializeSubscriptionPage = memoize(() => {
  // Manage subscription button
  {
    const form = document.createElement('form')
    form.action = !prod
      ? 'https://synergism.cc/stripe/test/manage-subscription'
      : 'https://synergism.cc/stripe/manage-subscription'

    const submit = document.createElement('input')
    submit.type = 'submit'
    submit.value = 'Manage Subscription'
    form.appendChild(submit)

    subscriptionsContainer.prepend(form)
  }

  const tier = getSubMetadata()?.tier ?? 0

  subscriptionSectionHolder.innerHTML = subscriptionProducts.map((product) =>
    createIndividualSubscriptionHTML(product, tier)
  ).join('')

  subscriptionSectionHolder!.style.display = 'grid'

  document.querySelectorAll<HTMLButtonElement>('.subscriptionContainer > div > button[data-id]').forEach(
    (element) => {
      element.addEventListener('click', clickHandler)
    }
  )

  initializePayPal_Subscription()
})

/**
 * https://stackoverflow.com/a/69024269
 */
export const initializePayPal_Subscription = async () => {
  const paypal = await loadScript({
    clientId: 'AS1HYTVcH3Kqt7IVgx7DkjgG8lPMZ5kyPWamSBNEowJ-AJPpANNTJKkB_mF0C4NmQxFuWQ9azGbqH2Gr',
    disableFunding: ['venmo', 'paylater', 'credit', 'card'],
    dataNamespace: 'paypal_subscription',
    vault: true,
    intent: 'subscription'
  })

  const checkoutButtons = Array.from<HTMLElement>(
    document.querySelectorAll('.subscriptionContainer > div > div.checkout-paypal')
  )

  for (const element of checkoutButtons) {
    element.innerHTML = ''
    const id = element.getAttribute('data-id')!

    paypal?.Buttons?.({
      style: {
        shape: 'rect',
        layout: 'vertical',
        color: 'gold',
        label: 'paypal'
      },

      async createSubscription () {
        const response = await fetch(`https://synergism.cc/paypal/subscriptions/create?product=${id}`, {
          method: 'POST'
        })

        const json = await response.json()
        return json.id
      },

      async onApprove (data) {
        console.log('subscription approved', data)

        Alert(
          'Please give us a few minutes to process your subscription (PayPal is slow). You will have to refresh the page to receive the bonuses! Thank you for supporting Synergism!'
        )
      },

      onError (error) {
        Notification('An error with PayPal happened. More info in console.')
        console.log(error)
      }
    }).render(element)
  }
}

export const clearSubscriptionPage = () => {
  subscriptionsContainer.style.display = 'none'
}

export const toggleSubscriptionPage = () => {
  initializeSubscriptionPage()
  subscriptionsContainer.style.display = 'flex'
}
