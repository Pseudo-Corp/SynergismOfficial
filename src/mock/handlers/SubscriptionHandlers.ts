import { http, type HttpHandler, HttpResponse } from 'msw'
import { getSubMetadata, setSubMetadata } from '../../Login'
import { subscriptionProducts } from '../../purchases/CartTab'

function getSubscriptionTier (productId: string): number | null {
  const product = subscriptionProducts.find((p) => p.id === productId)
  return product?.tier ?? null
}

export const subscriptionHandlers: HttpHandler[] = [
  http.post('https://synergism.cc/paypal/subscriptions/create', async ({ request }) => {
    const url = new URL(request.url)
    const productId = url.searchParams.get('product')
    if (!productId) {
      return HttpResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }
    const tier = getSubscriptionTier(productId)
    if (tier === null) {
      return HttpResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    const currentSub = getSubMetadata()

    if (currentSub !== null) {
      return HttpResponse.json({ error: 'User already has an active subscription' }, { status: 409 })
    }

    setSubMetadata({
      provider: 'paypal',
      tier
    })

    return HttpResponse.json({ id: 'paypal-id' })
  }),

  // Revise subscription
  http.post('https://synergism.cc/paypal/subscriptions/revise', async ({ request }) => {
    // Extract product ID from URL query parameter (?product=...)
    const url = new URL(request.url)
    const productId = url.searchParams.get('product')

    if (!productId) {
      return HttpResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const newTier = getSubscriptionTier(productId)
    if (newTier === null) {
      return HttpResponse.json({ error: 'Invalid product ID or tier' }, { status: 400 })
    }

    const currentSub = getSubMetadata()

    if (currentSub === null) {
      return HttpResponse.json({ error: 'No active subscription found' }, { status: 404 })
    }

    setSubMetadata({
      provider: 'paypal',
      tier: newTier
    })

    return HttpResponse.json({
      link: 'https://paypal.com/link/for/user/to/approve/change'
    })
  }),

  http.post('https://synergism.cc/paypal/subscriptions/cancel', async () => {
    const currentSub = getSubMetadata()

    if (currentSub === null) {
      return HttpResponse.json({ error: 'No active subscription found' }, { status: 404 })
    }

    setSubMetadata(null)

    return new HttpResponse(null, { status: 204 })
  })
]
