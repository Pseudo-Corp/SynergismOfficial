import { loadScript } from '@paypal/paypal-js'
import i18next from 'i18next'
import { prod } from '../Config'
import { Alert, Confirm, Notification } from '../UpdateHTML'
import { memoize } from '../Utility'
import { type SubscriptionProduct, subscriptionProducts, upgradeResponse } from './CartTab'
import { addToCart, getQuantity } from './CartUtil'

const subscriptionsContainer = document.querySelector<HTMLElement>('#pseudoCoins > #subscriptionsContainer')!
const subscriptionSectionHolder = subscriptionsContainer.querySelector<HTMLElement>('#sub-section-holder')!

const formatter = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

const tierCosts = [0, 300, 600, 1000, 2000]

async function changeSubscription (productId: string, type: 'upgrade' | 'downgrade') {
  const tier = upgradeResponse.tier
  const existingCosts = tierCosts[tier] ?? 0
  const newSub = subscriptionProducts.find((v) => v.id === productId)
  const newSubPrice = newSub!.price
  const newSubName = newSub!.name
  const confirm = (type === 'downgrade')
    ? await Confirm(
      `You are downgrading to ${newSubName}, which costs ${
        formatter.format((existingCosts - newSubPrice) / 100)
      } less per month. New cost: ${
        formatter.format(newSubPrice / 100)
      } per month. Downgrading takes effect immediately!`
    )
    : await Confirm(
      `You are upgrading to ${newSubName}, which costs ${
        formatter.format((newSubPrice - existingCosts) / 100)
      } more per month. New cost: ${formatter.format(newSubPrice / 100)} per month`
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

  if (upgradeResponse.tier !== 0) {
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

const constructDescriptions = ({ description, quarkBonus }: SubscriptionProduct) => {
  const [firstLine, secondLine] = description.split(' and ')
  // capitalize the first letter of the second line
  const secondLineCap = secondLine.charAt(0).toUpperCase() + secondLine.slice(1)

  return `
    <span style="color: gold">${firstLine}</span>
    <br>
    <span style="color: cyan">${secondLineCap}</span>
    <br>
    <span style="color: magenta">${i18next.t('pseudoCoins.globalQuarkBonus', { percent: quarkBonus })}</span>
  `
}

export const createIndividualSubscriptionHTML = (product: SubscriptionProduct, existingCosts: number) => {
  if (product.price < existingCosts) {
    return `
      <section class="subscriptionContainer" key="${product.id}">
      <div>
          <img class="pseudoCoinSubImage" alt="${product.name}" src="./Pictures/${product.id}.png" />
          <p class="pseudoCoinText">
          ${product.name.split(' - ').join('<br>')}
          </p>
          <p class="pseudoSubscriptionText">
          ${constructDescriptions(product)}
          </p>
          <button data-id="${product.id}" data-name="${product.name}" data-downgrade class="pseudoCoinButton" style="background-color: maroon">
            Downgrade!
          </button>
          <div class="checkout-paypal" data-id="${product.id}"></div>
      </div>
      </section>
    `
  } else if (product.price === existingCosts) {
    return `
      <section class="subscriptionContainer" key="${product.id}">
      <div>
          <img class="pseudoCoinSubImage" alt="${product.name}" src="./Pictures/${product.id}.png" />
          <p class="pseudoCoinText">
          ${product.name.split(' - ').join('<br>')}
          </p>
          <p class="pseudoSubscriptionText">
          ${constructDescriptions(product)}
          </p>
          <button data-id="${product.id}" data-name="${product.name}" class="pseudoCoinButton" style="background-color: #b59410">
            You are here!
          </button>
          <div class="checkout-paypal" data-id="${product.id}"></div>
      </div>
      </section>
    `
  } else {
    return `
      <section class="subscriptionContainer" key="${product.id}">
      <div>
          <img class="pseudoCoinSubImage" alt="${product.name}" src="./Pictures/${product.id}.png" />
          <p class="pseudoCoinText">
          ${product.name.split(' - ').join('<br>')}
          </p>
          <p class="pseudoSubscriptionText">
          ${constructDescriptions(product)}
          </p>
          <button data-id="${product.id}" data-name="${product.name}" data-upgrade class="pseudoCoinButton">
            Upgrade for ${formatter.format((product.price - existingCosts) / 100)} USD / mo
          </button>
          <div class="checkout-paypal" data-id="${product.id}"></div>
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

  const tier = upgradeResponse.tier
  const existingCosts = tierCosts[tier] ?? 0

  subscriptionSectionHolder.innerHTML = subscriptionProducts.map((product) =>
    createIndividualSubscriptionHTML(product, existingCosts)
  ).join('')

  subscriptionSectionHolder!.style.display = 'grid'

  document.querySelectorAll<HTMLButtonElement>('.subscriptionContainer > div > button[data-id]').forEach(
    (element) => {
      element.addEventListener('click', clickHandler)
    }
  )
  ;(async () => {
    const paypal = await loadScript({
      clientId: 'AS1HYTVcH3Kqt7IVgx7DkjgG8lPMZ5kyPWamSBNEowJ-AJPpANNTJKkB_mF0C4NmQxFuWQ9azGbqH2Gr',
      disableFunding: ['venmo', 'paylater', 'credit', 'card'],
      vault: true,
      intent: 'subscription'
    })

    document.querySelectorAll<HTMLElement>('.subscriptionContainer > div > div[data-id]').forEach(
      (element) => {
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
    )
  })()
})

export const clearSubscriptionPage = () => {
  subscriptionsContainer.style.display = 'none'
}

export const toggleSubscriptionPage = () => {
  initializeSubscriptionPage()
  subscriptionsContainer.style.display = 'flex'
}
