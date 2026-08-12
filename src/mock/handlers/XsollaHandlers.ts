import { bypass, http, type HttpHandler } from 'msw'

const sandboxRoutes = [
  'https://synergism.cc/xsolla/create-token',
  'https://synergism.cc/xsolla/subscription/upgrade',
  'https://synergism.cc/xsolla/subscription/downgrade'
]

export const xsollaHandlers: HttpHandler[] = sandboxRoutes.map((route) =>
  http.post(route, async ({ request }) => {
    const headers = new Headers(request.headers)
    headers.set('x-sandbox', 'true')

    return fetch(bypass(request, {
      headers
    }))
  })
)
