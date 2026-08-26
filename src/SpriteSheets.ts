import { DOMCacheGetOrSet } from './Cache/DOM'

export type iconSize = 32 | 56 | 64

export interface SpriteSheet {
  name: string
  elementNames: (string | null)[]
  iconSize: iconSize // All icons in the sheet must be the same size.
  rows: number
  columns: number
  aliases?: Array<{
    elementName: string
    iconIndex: number
    displaySize: number
  }>
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
    columns: 7,
    aliases: [{ elementName: 'shopFamilyRowIcon-seasonPass', iconIndex: 0, displaySize: 24 }]
  },
  {
    name: 'DiceOfAsmodeus',
    elementNames: [
      'shopRedLuck1',
      'shopRedLuck2',
      'shopRedLuck3',
      'shopRedLuck4'
    ],
    iconSize: 64,
    rows: 1,
    columns: 4,
    aliases: [{ elementName: 'shopFamilyRowIcon-shopRedLuck1', iconIndex: 0, displaySize: 24 }]
  },
  {
    name: 'PLATCalculators',
    elementNames: [
      'calculator',
      'calculator2',
      'calculator3',
      'calculator4',
      'calculator5',
      'calculator6',
      'calculator7'
    ],
    iconSize: 64,
    rows: 1,
    columns: 7,
    aliases: [{ elementName: 'shopFamilyRowIcon-calculator', iconIndex: 0, displaySize: 24 }]
  },
  {
    name: 'Hepteracts',
    elementNames: [
      'chronosHepteractImage',
      'hyperrealismHepteractImage',
      'quarkHepteractImage',
      'challengeHepteractImage',
      'abyssHepteractImage',
      'acceleratorHepteractImage',
      'acceleratorBoostHepteractImage',
      'multiplierHepteractImage',
      'hepteractToQuarkImage',
      'overfluxPowderImage'
    ],
    iconSize: 56,
    rows: 3,
    columns: 4,
    aliases: [
      { elementName: 'eventBuffPowderConversionIcon', iconIndex: 9, displaySize: 32 },
      { elementName: 'consumableBuffPowderConversionIcon', iconIndex: 9, displaySize: 32 }
    ]
  },
  {
    name: 'Octeracts',
    elementNames: [
      null,
      null,
      'octeractStarterImage',
      'octeractGainImage',
      'octeractGain2Image',
      'octeractAscensionsOcteractGainImage',
      'octeractOneMindImproverImage',
      'octeractFastForwardImage',
      'octeractSingUpgradeCapImage',
      'octeractGQCostReduceImage',
      'octeractQuarkGainImage',
      'octeractQuarkGain2Image',
      'octeractImprovedQuarkHeptImage',
      'octeractExportQuarksImage',
      'octeractImprovedDaily3Image',
      'octeractImprovedDaily2Image',
      'octeractImprovedDailyImage',
      'octeractImprovedFreeImage',
      'octeractImprovedFree2Image',
      'octeractImprovedFree3Image',
      'octeractImprovedFree4Image',
      null,
      'octeractAscensions2Image',
      'octeractAscensionsImage',
      'octeractImprovedGlobalSpeedImage',
      'octeractImprovedAscensionSpeedImage',
      'octeractImprovedAscensionSpeed2Image',
      null,
      null,
      null,
      'octeractCorruptionImage',
      'octeractBonusTokens1Image',
      'octeractBonusTokens2Image',
      'octeractBonusTokens3Image',
      'octeractBonusTokens4Image',
      null,
      'octeractObtainium1Image',
      'octeractOfferings1Image',
      'octeractAutoPotionSpeedImage',
      'octeractAutoPotionEfficiencyImage',
      null,
      null,
      null,
      null,
      'octeractInfiniteShopUpgradesImage',
      'octeractTalismanLevelCap1Image',
      'octeractTalismanLevelCap2Image',
      'octeractTalismanLevelCap3Image',
      'octeractTalismanLevelCap4Image',
      null,
      null,
      'octeractBlueberriesImage',
      'octeractAmbrosiaLuck2Image',
      'octeractAmbrosiaLuck3Image',
      'octeractAmbrosiaLuckImage',
      'octeractAmbrosiaLuck4Image',
      null,
      null,
      null,
      'octeractAmbrosiaGeneration2Image',
      'octeractAmbrosiaGeneration3Image',
      'octeractAmbrosiaGenerationImage',
      'octeractAmbrosiaGeneration4Image'
    ],
    iconSize: 32,
    rows: 9,
    columns: 7
  },
  {
    name: 'QuarkEnrichedCubes',
    elementNames: [
      'cubeToQuark',
      'tesseractToQuark',
      'hypercubeToQuark',
      'cubeToQuarkAll'
    ],
    iconSize: 64,
    rows: 1,
    columns: 4,
    aliases: [{ elementName: 'shopFamilyRowIcon-cubeToQuark', iconIndex: 0, displaySize: 24 }]
  }
]

export const registerSpriteAlias = (sourceElementName: string, elementName: string, displaySize: number) => {
  for (const sheet of spriteSheets) {
    const iconIndex = sheet.elementNames.indexOf(sourceElementName)
    if (iconIndex !== -1) {
      sheet.aliases ??= []
      sheet.aliases.push({ elementName, iconIndex, displaySize })
      return
    }
  }
}

const updateIconFromSprite = (
  sheet: SpriteSheet,
  folderUsed: string,
  elementName: string,
  iconIndex: number,
  displaySize: number = sheet.iconSize
) => {
  const element = DOMCacheGetOrSet(elementName)
  element.style.backgroundImage = `url('Pictures/${folderUsed}/Sprite Sheets/${sheet.name}.png')`
  element.style.backgroundPosition = `${-(iconIndex % sheet.columns) * displaySize}px ${
    -Math.floor(iconIndex / sheet.columns) * displaySize
  }px`
  element.style.backgroundSize = `${sheet.columns * displaySize}px ${sheet.rows * displaySize}px`
  element.style.backgroundRepeat = 'no-repeat'
  element.style.width = `${displaySize}px`
  element.style.height = `${displaySize}px`
}

export const updateIconsFromSprites = (folderUsed: string) => {
  for (const sheet of spriteSheets) {
    for (const [iconIndex, elementName] of sheet.elementNames.entries()) {
      if (elementName === null) {
        continue
      }

      /* Why backgroundImage? If we use .src, the image is the entire sheet,
             Condensed into something of size iconSize * iconSize.
             In index.html, each of these elements has src img_transparent, so
             we need to use the sprite as the background image, using only
             the relevant portion of the sheet
            */
      updateIconFromSprite(sheet, folderUsed, elementName, iconIndex)
    }

    for (const alias of sheet.aliases ?? []) {
      updateIconFromSprite(sheet, folderUsed, alias.elementName, alias.iconIndex, alias.displaySize)
    }
  }
}
