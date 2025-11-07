import { http, HttpHandler, HttpResponse } from 'msw'
import { subscriptionProducts } from '../../purchases/CartTab'
import { updateSubscriptionPage } from '../../purchases/SubscriptionsSubtab'

interface Subscription {
  provider: 'stripe' | 'patreon' | 'paypal'
  tier: 1 | 2 | 3 | 4
}

export let mockSubscription: Subscription | null = null

function getSubscriptionTier(productId: string): number | null {
  const product = subscriptionProducts.find((p) => p.id === productId)
  return product?.tier ?? null
}

export const subscriptionHandlers: HttpHandler[] = [
  http.post('https://synergism.cc/paypal/subscriptions/create', async ({ request }) => {
    try {
      const url = new URL(request.url)
      const productId = url.searchParams.get('product')
      if (!productId) {
        return HttpResponse.json({ error: 'Product ID is required' }, { status: 400 })
      }
      const tier = getSubscriptionTier(productId)
      if (tier === null) {
        return HttpResponse.json({ error: 'Invalid product ID' }, { status: 400 })
      }
      if (mockSubscription !== null) {
        return HttpResponse.json({ error: 'User already has an active subscription' }, { status: 409 })
      }

      mockSubscription = {
        provider: 'paypal',
        tier: tier as 1 | 2 | 3 | 4
      }

      // TODO: This should really be done somewhere in the frontend
      updateSubscriptionPage()
      return HttpResponse.json({}, { status: 204 })
    } catch (error) {
      console.error('Error creating subscription:', error)
      return HttpResponse.json({ error: 'Failed to create subscription' }, { status: 500 })
    }
  }),

  // Revise subscription
  http.post('https://synergism.cc/paypal/subscriptions/revise', async ({ request }) => {
    try {
      // Extract product ID from URL query parameter (?product=...)
      const url = new URL(request.url)
      const productId = url.searchParams.get('key')

      if (!productId) {
        return HttpResponse.json({ error: 'Product ID is required' }, { status: 400 })
      }

      const newTier = getSubscriptionTier(productId)
      if (newTier === null) {
        return HttpResponse.json({ error: 'Invalid product ID or tier' }, { status: 400 })
      }

      if (mockSubscription === null) {
        return HttpResponse.json({ error: 'No active subscription found' }, { status: 404 })
      }

      mockSubscription = {
        provider: 'paypal',
        tier: newTier as 1 | 2 | 3 | 4,
      }

      return HttpResponse.json({ success: true, mockSubscription }, { status: 204 })
    } catch (error) {
      console.error('Error revising subscription:', error)
      return HttpResponse.json({ error: 'Failed to revise subscription' }, { status: 500 })
    }
  }),

  http.post('https://synergism.cc/paypal/subscriptions/cancel', async () => {
    try {
      if (mockSubscription === null) {
        return HttpResponse.json({ error: 'No active subscription found' }, { status: 404 })
      }

      mockSubscription = null

      return HttpResponse.json({}, { status: 204 })
    } catch (error) {
      console.error('Error cancelling subscription:', error)
      return HttpResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 })
    }
  }),
]
