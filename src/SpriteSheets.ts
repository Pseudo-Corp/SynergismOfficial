import { DOMCacheGetOrSet } from './Cache/DOM'

export type iconSize = 32 | 64

export interface SpriteSheet {
  name: string
  elementNames: string[]
  iconSize: iconSize // All icons in the sheet must be the same size.
  rows: number
  columns: number
}

// When you make new icons (or are converting old ones) make sure to add to this list
export const spriteSheets: SpriteSheet[] = [
  {
    name: 'WowPasses',
    elementNames: [
      'seasonPass',
      'seasonPass2',
      'seasonPass3',
      'seasonPassY',
      'seasonPassZ',
      'seasonPassLost',
      'seasonPassInfinity'
    ],
    iconSize: 64,
    rows: 1,
    columns: 7
  }
]

export const updateIconsFromSprites = (folderUsed: string) => {
  for (const sheet of spriteSheets) {
    let currRow = 0
    let currCol = 0
    for (const elementName of sheet.elementNames) {
      const element = DOMCacheGetOrSet(elementName)
      /* Why backgroundImage? If we use .src, the image is the entire sheet,
             Condensed into something of size iconSize * iconSize.
             In index.html, each of these elements has src img_transparent, so
             we need to use the sprite as the background image, using only
             the relevant portion of the sheet
            */
      element.style.backgroundImage = `url('Pictures/${folderUsed}/Sprite Sheets/${sheet.name}.png')`
      const backgroundX = -currCol * sheet.iconSize
      const backgroundY = -currRow * sheet.iconSize
      element.style.backgroundPosition = `${backgroundX}px ${backgroundY}px`
      element.style.width = `${sheet.iconSize}px`
      element.style.height = `${sheet.iconSize}px`

      // This structure means images are laid out top left to bottom right order
      currCol++
      if (currCol >= sheet.columns) {
        currCol = 0
        currRow++
      }
    }
  }
}
