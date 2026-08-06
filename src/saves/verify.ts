import LZString from 'lz-string'
import { playerUpdateVarSchema } from './PlayerUpdateVarSchema'

declare global {
  interface Window {
    verifySave?: (input: string) => boolean
  }
}

const verifySave = (input: string) => {
  const decompressed = LZString.decompressFromBase64(input)

  try {
    return playerUpdateVarSchema.safeParse(
      decompressed ? JSON.parse(decompressed) : JSON.parse(atob(input))
    ).success
  } catch {
    return false
  }
}

Object.defineProperty(window, 'verifySave', { value: verifySave })
