import { DOMCacheGetOrSet } from "./Cache/DOM"

export type iconSize = 32 | 64
export interface SpriteSheetEntry {
    // x and y here are such that (0,0) corresponds to top left image
    // (1,0) is the next image to the right, etc
    x: number,
    y: number,
    elementName: string
}

export interface SpriteSheet {
    name: string,
    icons: SpriteSheetEntry[]
    iconSize: iconSize // All icons in the sheet must be the same size.
}

// Add more sprite sheets here as implemented
// ASSUMES THESE SHEETS EXIST ON ALL ICONSETS.
export const spriteSheets: SpriteSheet[] = [
    {
        name: 'WowPasses',
        icons: [
            { x: 0, y: 0, elementName: 'seasonPass' },
            { x: 1, y: 0, elementName: 'seasonPass2' },
            { x: 2, y: 0, elementName: 'seasonPass3' },
            { x: 3, y: 0, elementName: 'seasonPassY' },
            { x: 4, y: 0, elementName: 'seasonPassZ' },
            { x: 5, y: 0, elementName: 'seasonPassLost' },
            { x: 6, y: 0, elementName: 'seasonPassInfinity' },
        ],
        iconSize: 64
    }
]

export const updateIconsFromSprites = (folderUsed: String) => {
    for (const sheet of spriteSheets) {
        for (const icon of sheet.icons) {
            const element = DOMCacheGetOrSet(icon.elementName)
            element.style.backgroundImage = `url('Pictures/${folderUsed}/Sprite Sheets/${sheet.name}.png')`
            const backgroundX = -icon.x * sheet.iconSize
            const backgroundY = -icon.y * sheet.iconSize
            element.style.backgroundPosition = `${backgroundX}px ${backgroundY}px`
            element.style.width = `${sheet.iconSize}px`
            element.style.height = `${sheet.iconSize}px`
        }
    }
}