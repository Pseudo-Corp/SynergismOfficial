import { http, type HttpHandler, HttpResponse } from 'msw'
import { getSubMetadata, setSubMetadata, type SubscriptionProvider } from '../../Login'
import { subscriptionProducts } from '../../purchases/CartTab'

const externallyManagedSubscriptions: Partial<Record<SubscriptionProvider, string>> = {
  patreon: 'Cancel your membership from patreon.com to end this subscription.',
  apple: 'Cancel this subscription from the App Store, under Settings > Subscriptions.',
  google: 'Cancel this subscription from Google Play, under Payments & subscriptions.'
}

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

    const end = new Date()
    end.setMonth(end.getMonth() + 1)

    setSubMetadata({
      provider: 'paypal',
      tier,
      endDate: end.toISOString()
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

    const end = new Date()
    end.setMonth(end.getMonth() + 1)

    setSubMetadata({
      provider: 'paypal',
      tier: newTier,
      endDate: end.toISOString()
    })

    return HttpResponse.json({
      link: 'https://paypal.com/link/for/user/to/approve/change'
    })
  }),

  http.post('https://synergism.cc/api/v1/subscriptions/cancel', async ({ request }) => {
    const currentSub = getSubMetadata()

    if (currentSub === null) {
      return HttpResponse.json({ error: 'Subscribe before cancelling your subscription!' }, { status: 400 })
    }

    const provider = new URL(request.url).searchParams.get('provider')

    if (provider !== null && provider !== currentSub.provider) {
      return HttpResponse.json({ error: `You're not subscribed with ${provider}!` }, { status: 400 })
    }

    const externalMessage = externallyManagedSubscriptions[currentSub.provider]

    if (externalMessage !== undefined) {
      return HttpResponse.json({ error: externalMessage }, { status: 400 })
    }

    setSubMetadata(null)

    return new HttpResponse(null, { status: 204 })
  })
]
