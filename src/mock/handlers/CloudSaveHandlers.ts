import { delay, http, type HttpHandler, HttpResponse } from 'msw'
import { getSubMetadata } from '../../Login'

interface Save {
  id: number
  name: string
  uploadedAt: string
  save: string
  type: 'sub' | 'perm'
}

const maxSavesByTier = [1, 2, 4, 7, 10]

function isAscii (buffer: ArrayBuffer) {
  const uint8Array = new Uint8Array(buffer)
  for (let i = 0; i < uint8Array.length; i++) {
    if (uint8Array[i] > 127) {
      return false
    }
  }

  return true
}

function sqliteNow () {
  return new Date().toISOString().replace('T', ' ').slice(0, 19)
}

const saves: Save[] = []
let nextId = 1

export const cloudSaveHandlers: HttpHandler[] = [
  http.get('https://synergism.cc/saves/retrieve/metadata', async () => {
    await delay(500)

    return HttpResponse.json(saves.map((s) => {
      const { save: _, ...rest } = s
      return rest
    }))
  }),
  http.get('https://synergism.cc/saves/retrieve/all', async () => {
    await delay(1000)

    return HttpResponse.json(saves)
  }),
  http.post('https://synergism.cc/saves/upload', async ({ request }) => {
    await delay(1000)

    const fd = await request.formData()
    const file = fd.get('file')
    const name = fd.get('name')

    if (!(file instanceof File) || typeof name !== 'string' || name.length > 255) {
      const message = typeof name === 'string' && name.length > 255
        ? 'Name is too long (max: 255 characters)'
        : null

      return new HttpResponse(message, { status: 400 })
    }

    const tier = getSubMetadata()?.tier ?? 0
    const maxSaves = maxSavesByTier[tier] ?? 1
    const subSaveCount = saves.filter((s) => s.type === 'sub').length

    const existing = saves.find((s) => s.name === name)

    if (!existing && subSaveCount >= maxSaves) {
      const plural = maxSaves === 1 ? '' : 's'
      const ad = tier === 4
        ? '.'
        : tier === 0
        ? ', subscribe to increase the limit!'
        : ', upgrade your subscription to unlock more save slots!'

      return new HttpResponse(
        `You can only upload ${maxSaves} save${plural}${ad} You have ${subSaveCount} save(s).`,
        { status: 400 }
      )
    }

    const text = await file.arrayBuffer()

    if (!isAscii(text)) {
      return new HttpResponse(null, { status: 400 })
    }

    const base64 = await file.text()
    const decoded = atob(base64)
    const stream = new Blob([decoded]).stream().pipeThrough(new CompressionStream('gzip'))

    const compressedData = await new Response(stream).bytes()
    const encoded = btoa(String.fromCharCode(...compressedData))

    if (existing) {
      existing.save = encoded
    } else {
      saves.push({ id: nextId++, name, uploadedAt: sqliteNow(), save: encoded, type: 'sub' })
    }

    return new HttpResponse('Ok!', { status: 200 })
  }),
  http.get('https://synergism.cc/saves/transfer', async () => {
    await delay(1000)

    return new HttpResponse('Ok!', { status: 200 })
  }),
  http.delete('https://synergism.cc/saves/delete', async ({ request }) => {
    await delay(1000)

    const { name } = await request.json() as { name: string }
    const save = saves.find((s) => s.name === name)

    if (save) {
      saves.splice(saves.indexOf(save), 1)
    }

    return new HttpResponse(null, { status: 204 })
  })
]
