import { DOMCacheGetOrSet } from './Cache/DOM'
import { resolveImgSrc } from './Themes'

export type iconSize = 32 | 48 | 56 | 64

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
    name: 'BuildingsAndUpgrades',
    elementNames: [
      'coin1',
      'coin2',
      'coin3',
      'coin4',
      'coin5',
      'accelerator',
      'multiplier',
      'acceleratorboost',
      null,
      null,
      'diamond1',
      'diamond2',
      'diamond3',
      'diamond4',
      'diamond5',
      'buycrystalupgrade1',
      'buycrystalupgrade2',
      'buycrystalupgrade3',
      'buycrystalupgrade4',
      'buycrystalupgrade5',
      'mythos1',
      'mythos2',
      'mythos3',
      'mythos4',
      'mythos5',
      'buyConstantUpgrade1',
      'buyConstantUpgrade2',
      'buyConstantUpgrade3',
      'buyConstantUpgrade4',
      'buyConstantUpgrade5',
      'particles1',
      'particles2',
      'particles3',
      'particles4',
      'particles5',
      'buyConstantUpgrade6',
      'buyConstantUpgrade7',
      'buyConstantUpgrade8',
      'buyConstantUpgrade9',
      'buyConstantUpgrade10',
      'tesseracts1',
      'tesseracts2',
      'tesseracts3',
      'tesseracts4',
      'tesseracts5',
      null,
      null,
      null,
      null,
      null
    ],
    iconSize: 32,
    rows: 5,
    columns: 10
  },
  {
    name: 'AntsAndMasteries',
    elementNames: [
      'antTier1Image',
      'antTier2Image',
      'antTier3Image',
      'antTier4Image',
      'antTier5Image',
      'antTier6Image',
      'antTier7Image',
      'antTier8Image',
      'antTier9Image',
      'antMastery1Image',
      'antMastery2Image',
      'antMastery3Image',
      'antMastery4Image',
      'antMastery5Image',
      'antMastery6Image',
      'antMastery7Image',
      'antMastery8Image',
      'antMastery9Image'
    ],
    iconSize: 32,
    rows: 2,
    columns: 9
  },
  {
    name: 'AntUpgrades',
    elementNames: [
      'antUpgrade1Image',
      'antUpgrade2Image',
      'antUpgrade3Image',
      'antUpgrade4Image',
      'antUpgrade5Image',
      'antUpgrade6Image',
      'antUpgrade10Image',
      'antUpgrade12Image',
      'antUpgrade13Image',
      'antUpgrade7Image',
      'antUpgrade8Image',
      'antUpgrade9Image',
      'antUpgrade11Image',
      'antUpgrade14Image',
      'antUpgrade15Image',
      'antUpgrade16Image'
    ],
    iconSize: 56,
    rows: 2,
    columns: 8
  },
  {
    name: 'Challenges',
    elementNames: [
      'challenge1',
      'challenge2',
      'challenge3',
      'challenge4',
      'challenge5',
      'challenge6',
      'challenge7',
      'challenge8',
      'challenge9',
      'challenge10',
      'challenge11',
      'challenge12',
      'challenge13',
      'challenge14',
      'challenge15',
      'noSingularityUpgrades',
      'oneChallengeCap',
      'limitedAscensions',
      'noQuarkUpgrades',
      'noOcteracts',
      'noAmbrosiaUpgrades',
      'limitedTime',
      'sadisticPrequel',
      'taxmanLastStand',
      null
    ],
    iconSize: 64,
    rows: 5,
    columns: 5
  },
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
      'shopRedLuck3'
    ],
    iconSize: 64,
    rows: 1,
    columns: 3,
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
  },
  {
    name: 'CampaignTokens',
    elementNames: [
      'campaignTokenRewardIcon-sum',
      'campaignTokenRewardIcon-tutorial',
      'campaignTokenRewardIcon-cube',
      'campaignTokenRewardIcon-obtainium',
      'campaignTokenRewardIcon-offering',
      'campaignTokenRewardIcon-ascensionScore',
      'campaignTokenRewardIcon-timeThreshold',
      'campaignTokenRewardIcon-quark',
      'campaignTokenRewardIcon-tax',
      'campaignTokenRewardIcon-c15',
      'campaignTokenRewardIcon-rune6',
      'campaignTokenRewardIcon-goldenQuark',
      'campaignTokenRewardIcon-octeract',
      'campaignTokenRewardIcon-ambrosiaLuck',
      'campaignTokenRewardIcon-blueberrySpeed'
    ],
    iconSize: 48,
    rows: 1,
    columns: 15
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
  const requestedSrc = `Pictures/${folderUsed}/Sprite Sheets/${sheet.name}.png`
  const resolvedSrc = resolveImgSrc(requestedSrc)
  element.style.backgroundImage = `url('${resolvedSrc}')`
  element.style.backgroundPosition = `${-(iconIndex % sheet.columns) * displaySize}px ${
    -Math.floor(iconIndex / sheet.columns) * displaySize
  }px`
  element.style.backgroundSize = `${sheet.columns * displaySize}px ${sheet.rows * displaySize}px`
  element.style.backgroundRepeat = 'no-repeat'
  element.style.width = `${displaySize}px`
  element.style.height = `${displaySize}px`

  if (folderUsed === 'Default' || resolvedSrc !== requestedSrc) {
    return
  }

  const probe = new Image()
  probe.addEventListener('error', () => {
    updateIconsFromSprites('Default')
  }, { once: true })
  probe.src = requestedSrc
}

export const updateIconsFromSprites = (folderUsed: string) => {
  for (const sheet of spriteSheets) {
    for (const [iconIndex, elementName] of sheet.elementNames.entries()) {
      if (elementName === null) {
        continue
      }

      updateIconFromSprite(sheet, folderUsed, elementName, iconIndex)
    }

    for (const alias of sheet.aliases ?? []) {
      updateIconFromSprite(sheet, folderUsed, alias.elementName, alias.iconIndex, alias.displaySize)
    }
  }
}
