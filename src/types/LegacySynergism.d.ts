import type { Player } from './Synergism';

/**
 * Shop before v2.5.0
 */
export interface LegacyShopUpgrades {
    offeringPotion: number
    obtainiumPotion: number
    offeringTimerLevel: number
    obtainiumTimerLevel: number
    offeringAutoLevel: number
    obtainiumAutoLevel: number
    instantChallengeBought: boolean
    cashGrabLevel: number
    antSpeedLevel: number
    talismanBought: boolean
    challengeExtension: number
    challenge10Tomes: number
    // this is fucking old
    challengeTome?: number
    // in v1.0101 this is correct
    seasonPass: number
    // in v2.1.2 this is correct
    seasonPassLevel: number
    cubeToQuarkBought: boolean
    tesseractToQuarkBought: boolean
    hypercubeToQuarkBought: boolean
}

export type PlayerSave = { [P in keyof Player]?: Player[P] | null; } & Record<string, unknown>;