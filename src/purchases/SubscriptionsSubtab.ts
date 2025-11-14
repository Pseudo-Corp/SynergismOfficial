import { type FUNDING_SOURCE, loadScript } from '@paypal/paypal-js'
import { prod } from '../Config'
import { getSubMetadata, type SubscriptionMetadata, type SubscriptionProvider } from '../Login'
import { Alert, Confirm, Notification } from '../UpdateHTML'
import { memoize } from '../Utility'
import { type SubscriptionProduct, subscriptionProducts } from './CartTab'
import { addToCart, getQuantity } from './CartUtil'

const subscriptionsContainer = document.querySelector<HTMLElement>('#pseudoCoins > #subscriptionsContainer')!
const subscriptionSectionHolder = subscriptionsContainer.querySelector<HTMLElement>('#sub-section-holder')!
const manageSubscriptionHolder = subscriptionsContainer.querySelector<HTMLElement>('#manage-subscription-holder')!

type Actions = 'manage' | 'upgrade' | 'downgrade' | 'cancel'
type RouteLinks = Record<Actions, string>

const prodRouteLinks: Record<'stripe' | 'paypal', RouteLinks> = {
  stripe: {
    manage: 'https://synergism.cc/stripe/manage-subscription',
    upgrade: 'https://synergism.cc/stripe/subscription/upgrade',
    downgrade: 'https://synergism.cc/stripe/subscription/downgrade',
    cancel: 'https://synergism.cc/stripe/subscription/cancel'
  },
  paypal: {
    manage: 'https://www.paypal.com/myaccount/autopay/',
    upgrade: 'https://synergism.cc/paypal/subscriptions/revise',
    downgrade: 'https://synergism.cc/paypal/subscriptions/revise',
    cancel: 'https://synergism.cc/paypal/subscriptions/cancel'
  }
}

const devRouteLinks: Record<'stripe' | 'paypal', RouteLinks> = {
  stripe: {
    manage: 'https://synergism.cc/stripe/test/manage-subscription',
    upgrade: 'https://synergism.cc/stripe/test/subscription/upgrade',
    downgrade: 'https://synergism.cc/stripe/test/subscription/downgrade',
    cancel: 'https://synergism.cc/stripe/test/subscription/cancel'
  },
  paypal: {
    manage: 'https://www.paypal.com/myaccount/autopay/',
    upgrade: 'https://synergism.cc/paypal/subscriptions/revise',
    downgrade: 'https://synergism.cc/paypal/subscriptions/revise',
    cancel: 'https://synergism.cc/paypal/subscriptions/cancel'
  }
}

const formatter = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

async function changeSubscription (
  sub: Exclude<SubscriptionMetadata, null>,
  productId: string,
  type: 'upgrade' | 'downgrade'
) {
  const newSub = subscriptionProducts.find((v) => v.id === productId)!
  const { price: newSubPrice, name: newSubName } = newSub

  const oldSub = subscriptionProducts.find((v) => v.tier === sub.tier)!
  const oldSubPrice = oldSub.price

  if (sub.provider === 'patreon') {
    return Alert(
      'Please visit our Patreon page to manage your subscription. (You actually should not be seeing this at all, funny enough)'
    )
  }

  const confirm = (type === 'downgrade')
    ? await Confirm(
      `You are downgrading to ${newSubName}, which costs ${
        formatter.format(newSubPrice / 100)
      } per month. Downgrading takes effect immediately! Proceed?`
    )
    : await Confirm(
      `You are upgrading to ${newSubName}, which costs ${
        formatter.format(newSubPrice / 100)
      } per month (an increase of ${formatter.format((newSubPrice - oldSubPrice) / 100)} per month). Proceed?`
    )

  if (!confirm) {
    return
  }

  const link = prod ? prodRouteLinks[sub.provider][type] : devRouteLinks[sub.provider][type]
  const url = new URL(link)
  url.searchParams.set('product', productId)

  const response = await fetch(url, {
    method: 'POST'
  })

  if (response.ok) {
    // When we make a request to paypal, paypal sends a link that the user
    // must be redirected to in order to manually approve the change.
    const { link } = await response.json() as { link: string }
    location.href = link

    return
  }

  const { error } = await response.json() as { error: string }
  Notification(error)
}

async function manageSubscription (provider: SubscriptionProvider) {
  if (provider === 'patreon') {
    return Alert('You should not see this alert! Let Platonic know immediately.')
  }

  const link = prod ? prodRouteLinks[provider].manage : devRouteLinks[provider].manage

  location.href = link
}

async function cancelSubscription (provider: SubscriptionProvider) {
  if (provider === 'patreon') {
    return Alert('You should not see this alert! Let Platonic know immediately.')
  }

  const confirm = await Confirm(
    'Are you sure you want to cancel your subscription? You will keep the associated perks until your current Subscription expires.'
  )

  if (!confirm) {
    return
  }

  const link = prod ? prodRouteLinks[provider].cancel : devRouteLinks[provider].cancel
  const url = new URL(link)

  const response = await fetch(url, {
    method: 'POST'
  })

  if (!response.ok) {
    const { error } = await response.json() as { error: string }
    Notification(error)
    return
  }

  updateSubscriptionPage()
  return Alert(
    'Your subscription has been cancelled. You will keep your perks until the end of the current billing period.'
  )
}

function manageSubClickHandler (this: HTMLButtonElement) {
  const provider = this.getAttribute('data-provider') as SubscriptionProvider
  if (this.classList.contains('subscriptionCancel')) {
    cancelSubscription(provider)
    return
  } else if (this.classList.contains('subscriptionWebsite')) {
    manageSubscription(provider)
    return
  }
}

function clickHandler (this: HTMLButtonElement) {
  const productId = this.getAttribute('data-id')
  const productName = this.getAttribute('data-name')

  if (productId === null || !subscriptionProducts.some((product) => product.id === productId)) {
    Alert('Sorry, but the product does not exist or is not in the subscriptions catalogue! Did you edit the HTML?')
    return
  } else if (subscriptionProducts.some((product) => getQuantity(product.id) !== 0)) {
    Alert('You can only subscribe to 1 subscription tier!')
    return
  }

  const sub = getSubMetadata()
  if (sub?.tier) {
    if (this.hasAttribute('data-downgrade')) {
      changeSubscription(sub, productId, 'downgrade')
      return
    } else if (this.hasAttribute('data-upgrade')) {
      changeSubscription(sub, productId, 'upgrade')
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

const subscriptionTierGradients = [
  'transcendedBallerGradient gradientText',
  'reincarnatedBallerGradient gradientText',
  'ascendedBallerGradient gradientText',
  'rainbowText'
]

export const createSubscriptionTierName = (product: SubscriptionProduct) => {
  return `<span class="${subscriptionTierGradients[product.tier - 1]}">${product.name}</span>`
}

export const noSubscriptionButton = (product: SubscriptionProduct) => {
  return `<div class="checkout-paypal" data-id="${product.id}"></div>
  <button data-id="${product.id}" data-name="${product.name}" class="pseudoCoinButton">
    ${formatter.format(product.price / 100)} USD / mo
  </button>`
}

export const downgradeButton = (product: SubscriptionProduct) => {
  return `<button data-id="${product.id}" data-name="${product.name}" data-downgrade class="pseudoCoinButton" style="background-color: maroon">
    Downgrade
    </button>`
}

export const currentSubscriptionBox = () => {
  return `<button data-name="current-subscription" class="pseudoCoinButton" style="background-color: #b59410">
    You are here!
  </button>`
}

export const paypalCancelButton = (product: SubscriptionProduct) => {
  return `<button data-id="${product.id}" data-name="${product.name}" data-cancel class="pseudoCoinButton" style="background-color: maroon">
      Cancel
    </button>`
}

export const upgradeButton = (product: SubscriptionProduct, currentSubTier: number) => {
  const currentPrice = subscriptionProducts.find((v) => v.tier === currentSubTier)?.price ?? 0
  return `<button data-id="${product.id}" data-name="${product.name}" data-upgrade class="pseudoCoinButton" style="background-color: green">
    ↑ (+${formatter.format((product.price - currentPrice) / 100)} USD / mo)
  </button>`
}

export const createIndividualSubscriptionHTML = (product: SubscriptionProduct, currentSubTier: number) => {
  const sub = getSubMetadata()
  const notSubbed = sub === null
  const patreonSub = sub?.provider === 'patreon'
  const nameHTML = createSubscriptionTierName(product)

  if (product.tier < currentSubTier) {
    const downgradeBtn = patreonSub
      ? '' // No downgrade button for Patreon subs
      : downgradeButton(product)
    return `
      <section class="subscriptionContainer" key="${product.id}">
        <div>
          <img class="pseudoCoinSubImage" alt="${product.name}" src="./Pictures/${product.id}.png" />
          <p class="pseudoCoinText">
          ${nameHTML}
          </p>
          <p class="pseudoSubscriptionText">${product.description}</p>
          ${constructFeatureList(product)}
        </div>
        ${downgradeBtn}
      </section>`
  } else if (product.tier === currentSubTier) {
    const currentSub = currentSubscriptionBox()
    return `
      <section class="subscriptionContainer" key="${product.id}">
        <div>
          <img class="pseudoCoinSubImage" alt="${product.name}" src="./Pictures/${product.id}.png" />
          <p class="pseudoCoinText">
          ${nameHTML}
          </p>
          <p class="pseudoSubscriptionText">${product.description}</p>
          ${constructFeatureList(product)}
        </div>
        ${currentSub}
      </section>
    `
  } else if (product.tier > currentSubTier) {
    const noSubscription = notSubbed
      ? noSubscriptionButton(product)
      : ''

    const upgradeBtn = notSubbed || patreonSub
      ? ''
      : upgradeButton(product, currentSubTier)

    return `
      <section class="subscriptionContainer" key="${product.id}">
        <div>
          <img class="pseudoCoinSubImage" alt="${product.name}" src="./Pictures/${product.id}.png" />
          <p class="pseudoCoinText">
          ${nameHTML}
          </p>
          <p class="pseudoSubscriptionText">${product.description}</p>
          ${constructFeatureList(product)}
        </div>
        ${noSubscription}
        ${upgradeBtn}
      </section>
    `
  }
}

const manageSubscriptionButtonVisibility = (sub: SubscriptionMetadata) => {
  const patreonManageForm = manageSubscriptionHolder.querySelector<HTMLElement>('#manage-patreon-sub')!
  const stripeManageForm = manageSubscriptionHolder.querySelector<HTMLElement>('#manage-stripe-sub')!
  const paypalManageForm = manageSubscriptionHolder.querySelector<HTMLElement>('#manage-paypal-sub')!

  const subscriptionCancelButtons = manageSubscriptionHolder.querySelectorAll<HTMLElement>('.subscriptionCancel')

  patreonManageForm.style.display = sub === null || sub.provider === 'patreon' ? 'flex' : 'none'
  stripeManageForm.style.display = sub === null || sub.provider === 'stripe' ? 'flex' : 'none'
  paypalManageForm.style.display = sub === null || sub.provider === 'paypal' ? 'flex' : 'none'

  subscriptionCancelButtons.forEach((btn) => btn.style.display = sub === null ? 'none' : 'block')
}

export const initializeSubscriptionPage = memoize(() => {
  const sub = getSubMetadata()
  manageSubscriptionButtonVisibility(sub)

  const tier = getSubMetadata()?.tier ?? 0
  subscriptionSectionHolder.innerHTML = subscriptionProducts.map((product) =>
    createIndividualSubscriptionHTML(product, tier)
  ).join('')

  subscriptionSectionHolder!.style.display = 'grid'

  document.querySelectorAll<HTMLButtonElement>('.subscriptionContainer > button[data-id]').forEach(
    (element) => {
      element.addEventListener('click', clickHandler)
    }
  )

  document.querySelectorAll<HTMLButtonElement>('.subscriptionCancel, .subscriptionWebsite').forEach(
    (element) => {
      element.addEventListener('click', manageSubClickHandler)
    }
  )

  initializePayPal_Subscription()
})

// TODO: When I buy a subscription, cancel or change it, the page should update
// its HTML without a full refresh, but without having to re-initialize the whole page
export const updateSubscriptionPage = () => {
  const sub = getSubMetadata()
  manageSubscriptionButtonVisibility(sub)
  subscriptionSectionHolder.innerHTML = ''

  const tier = sub?.tier ?? 0

  subscriptionSectionHolder.innerHTML = subscriptionProducts.map((product) =>
    createIndividualSubscriptionHTML(product, tier)
  ).join('')

  document.querySelectorAll<HTMLButtonElement>('.subscriptionContainer > button[data-id]').forEach(
    (element) => {
      element.addEventListener('click', clickHandler)
    }
  )
  initializePayPal_Subscription()
}

/**
 * https://stackoverflow.com/a/69024269
 */
export const initializePayPal_Subscription = async () => {
  const paypal = await loadScript({
    clientId: 'AS1HYTVcH3Kqt7IVgx7DkjgG8lPMZ5kyPWamSBNEowJ-AJPpANNTJKkB_mF0C4NmQxFuWQ9azGbqH2Gr',
    disableFunding: ['paylater', 'credit', 'card'] satisfies FUNDING_SOURCE[],
    enableFunding: ['venmo'] satisfies FUNDING_SOURCE[],
    dataNamespace: 'paypal_subscription',
    vault: true,
    intent: 'subscription'
  })

  const checkoutButtons = Array.from<HTMLElement>(
    document.querySelectorAll('.subscriptionContainer > div.checkout-paypal')
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
