import LZString from 'lz-string'
import * as z from 'zod'
import { parseSave } from './Migrations'
import { playerSchema } from './PlayerSchema'

declare global {
  interface Window {
    verifySave?: (input: string) => boolean
    playerJSONSchema?: () => unknown
  }
}

const verifySave = (input: string) => {
  const decompressed = LZString.decompressFromBase64(input)

  try {
    return parseSave(
      decompressed ? JSON.parse(decompressed) : JSON.parse(atob(input))
    ).success
  } catch {
    return false
  }
}

const playerJSONSchema = () => ({ ...z.toJSONSchema(playerSchema, { io: 'input', unrepresentable: 'any' }) })

Object.defineProperty(window, 'verifySave', { value: verifySave })
Object.defineProperty(window, 'playerJSONSchema', { value: playerJSONSchema })
