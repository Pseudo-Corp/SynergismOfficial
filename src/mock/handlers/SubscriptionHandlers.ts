interface Subscription {
  provider: 'stripe' | 'patreon' | 'paypal'
  tier: 1 | 2 | 3 | 4
}

export const paypalSubscriptionActive: Subscription = {
  provider: 'paypal',
  tier: 3
}

export const patreonSubscriptionActive: Subscription = {
  provider: 'patreon',
  tier: 2
}

export const stripeSubscriptionActive: Subscription = {
  provider: 'stripe',
  tier: 3
}

// Add handlers here
