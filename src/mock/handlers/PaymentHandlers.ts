import { bypass, http, type HttpHandler, HttpResponse } from 'msw'

export const paymentHandlers: HttpHandler[] = [
  http.get(/https:\/\/synergism.cc\/stripe\/products/, ({ request }) => {
    return fetch(bypass(request))
  }),
  http.post('https://synergism.cc/paypal/orders/create', () => {
    return HttpResponse.json({ error: 'You did not agree to the TOS.' })
  })
]
