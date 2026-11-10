import LZString from 'lz-string'
import { parseSave } from './Migrations'

declare global {
  interface Window {
    verifySave?: (input: string) => boolean
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

Object.defineProperty(window, 'verifySave', { value: verifySave })
