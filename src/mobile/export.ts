import { Clipboard } from '@capacitor/clipboard'
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'

const safeFileName = (fileName: string) => {
  const sanitized = Array.from(
    fileName,
    (character) => character.charCodeAt(0) < 32 || '<>:"/\\|?*'.includes(character) ? '_' : character
  ).join('')
  return sanitized && sanitized !== '.' && sanitized !== '..' ? sanitized : 'Synergism-save.txt'
}

export const exportMobileData = async (text: string, fileName: string, toClipboard: boolean) => {
  if (toClipboard) {
    await Clipboard.write({ string: text })
    return true
  }

  const { uri } = await Filesystem.writeFile({
    path: safeFileName(fileName),
    data: text,
    directory: Directory.Cache,
    encoding: Encoding.UTF8
  })

  try {
    await Share.share({ files: [uri] })
    return true
  } catch (error) {
    if (error instanceof Error && error.message === 'Share canceled') {
      return false
    }

    throw error
  }
}
