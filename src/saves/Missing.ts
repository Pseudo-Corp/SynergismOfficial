import Decimal from 'break_infinity.js'
import { WowCubes, WowHypercubes, WowTesseracts } from '../CubeExperimental'
import { blankSave } from '../Synergism'
import type { Player, SaveSupplier } from '../types/Synergism'

function createTestMap<K extends keyof Player> (entries: [K, () => Player[K]][]): SaveSupplier<K> {
  return new Map(entries)
}

const missing = new Set<keyof Player>([
  'currentChallenge',
  'shopUpgrades',
  'ascStatToggles',
  'promoCodeTiming',
  'cubeUpgrades',
  'tesseractbuyamount',
  'tesseractBlessings',
  'hypercubeBlessings',
  'prototypeCorruptions',
  'usedCorruptions',
  'constantUpgrades',
  'ascendShards', // TODO: does this work?
  'roombaResearchIndex',
  'history',
  'autoChallengeRunning',
  'autoChallengeIndex',
  'autoChallengeToggles',
  'autoChallengeStartExponent',
  'autoChallengeTimer',
  'autoAscend',
  'autoAscendMode',
  'autoAscendThreshold',
  'runeBlessingLevels',
  'runeSpiritLevels',
  'runeBlessingBuyAmount',
  'runeSpiritBuyAmount',
  'autoBuyFragment',
  'saveOfferingToggle',
  'autoTesseracts',
  'autoOpenCubes',
  'openCubes'
])

const missingWithDefaults = createTestMap([
  ['wowCubes', () => new WowCubes()],
  ['wowTesseracts', () => new WowTesseracts(0)],
  ['wowHypercubes', () => new WowHypercubes(0)],
  ['ascendBuilding1', () => ({ ...blankSave.ascendBuilding1, generated: new Decimal('0') })],
  ['ascendBuilding2', () => ({ ...blankSave.ascendBuilding2, generated: new Decimal('0') })],
  ['ascendBuilding3', () => ({ ...blankSave.ascendBuilding3, generated: new Decimal('0') })],
  ['ascendBuilding4', () => ({ ...blankSave.ascendBuilding4, generated: new Decimal('0') })],
  ['ascendBuilding5', () => ({ ...blankSave.ascendBuilding5, generated: new Decimal('0') })]
])

export function apply (player: unknown) {
}
