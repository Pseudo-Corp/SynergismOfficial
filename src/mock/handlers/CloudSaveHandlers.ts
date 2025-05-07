import { delay, http, type HttpHandler, HttpResponse } from 'msw'

interface Save {
  id: number
  name: string
  uploadedAt: string
  save: string
}

function isAscii (buffer: ArrayBuffer) {
  const uint8Array = new Uint8Array(buffer)
  for (let i = 0; i < uint8Array.length; i++) {
    if (uint8Array[i] > 127) {
      return false
    }
  }

  return true
}

const saves: Save[] = []

export const cloudSaveHandlers: HttpHandler[] = [
  http.get('/saves/retrieve/metadata', async () => {
    await delay(500)

    return HttpResponse.json(saves.map((s) => {
      const { save, ...rest } = s
      return rest
    }))
  }),
  http.get('/saves/retrieve/all', async () => {
    await delay(1000)
    return HttpResponse.json(saves)
  }),
  http.post('/saves/upload', async ({ request }) => {
    await delay(1000)

    const fd = await request.formData()
    const file = fd.get('file')
    const name = fd.get('name')

    if (!(file instanceof File) || typeof name !== 'string') {
      return new HttpResponse(null, { status: 400 })
    }

    const text = await file.arrayBuffer()

    if (!isAscii(text)) {
      return new Response(null, { status: 400 })
    }

    const base64 = await file.text()
    const decoded = atob(base64)
    const stream = new Blob([decoded]).stream().pipeThrough(new CompressionStream('gzip'))

    const compressedData = await new Response(stream).bytes()
    const encoded = btoa(String.fromCharCode(...compressedData))

    saves.push({ id: saves.length, name, uploadedAt: new Date().toString(), save: encoded })

    return new Response('Ok!', { status: 200 })
  }),
  http.get('/saves/transfer', async () => {
    await delay(1000)

    return new Response('Ok!', { status: 200 })
  }),
  http.delete('/saves/delete', async ({ request }) => {
    await delay(1000)

    const { name } = await request.json() as { name: string }
    const save = saves.find((save) => save.name === name)

    if (save) {
      saves.splice(saves.indexOf(save), 1)
    }

    return new Response(null, { status: 204 })
  })
]
