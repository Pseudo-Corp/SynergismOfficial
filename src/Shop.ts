import { player, format } from './Synergism';
import { Alert, Confirm, Prompt, revealStuff } from './UpdateHTML';
import { calculatePowderConversion, calculateSummationNonLinear, calculateTimeAcceleration } from './Calculate';
import type { Player } from './types/Synergism';
import type { IMultiBuy } from './Cubes';
import { DOMCacheGetOrSet } from './Cache/DOM';

/**
 * Standardization of metadata contained for each shop upgrade.
 */
export enum shopUpgradeTypes {
    CONSUMABLE = 'consume',
    UPGRADE = 'upgrade'
}

type shopResetTier = 'Reincarnation' | 'Ascension' | 'Singularity' | 'SingularityVol2' | 'SingularityVol3' | 'SingularityVol4'

export interface IShopData {
    price: number
    priceIncrease: number
    maxLevel: number
    type: shopUpgradeTypes
    refundable: boolean
    refundMinimumLevel: number
    description: string
    tier: shopResetTier
}

export const shopData: Record<keyof Player['shopUpgrades'], IShopData> = {
    offeringPotion: {
        price: 100,
        priceIncrease: 0,
        maxLevel: 999999999,
        type: shopUpgradeTypes.CONSUMABLE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'Instantly gain 2 real life hours of Offerings, based on your all time best Offerings/sec and speed acceleration!',
        tier: 'Reincarnation'
    },
    obtainiumPotion: {
        tier: 'Reincarnation',
        price: 100,
        priceIncrease: 0,
        maxLevel: 999999999,
        type: shopUpgradeTypes.CONSUMABLE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'Instantly gain 2 real life hours of Obtainium, based on your all time best Obtainium/sec and speed acceleration!'
    },
    offeringEX: {
        tier: 'Reincarnation',
        price: 150,
        priceIncrease: 10,
        maxLevel: 100,
        type: shopUpgradeTypes.UPGRADE,
        refundable: true,
        refundMinimumLevel: 0,
        description: 'Gain +4% more Offerings from all sources!'
    },
    offeringAuto: {
        tier: 'Reincarnation',
        price: 150,
        priceIncrease: 10,
        maxLevel: 100,
        type: shopUpgradeTypes.UPGRADE,
        refundable: true,
        refundMinimumLevel: 1,
        description: 'Automatically pour Offerings into a rune. 1st level unlocks feature, and each level increases Offering gain by 2%. Every second, 2^(Level) levels worth of Offerings are spent.'
    },
    obtainiumEX: {
        tier: 'Reincarnation',
        price: 150,
        priceIncrease: 10,
        maxLevel: 100,
        type: shopUpgradeTypes.UPGRADE,
        refundable: true,
        refundMinimumLevel: 0,
        description: 'Gain +4% more Obtainium from all sources!'
    },
    obtainiumAuto: {
        tier: 'Reincarnation',
        price: 150,
        priceIncrease: 10,
        maxLevel: 100,
        type: shopUpgradeTypes.UPGRADE,
        refundable: true,
        refundMinimumLevel: 1,
        description: 'Automatically pour Obtainium into a research. 1st level unlocks feature, and each level increases Obtainium gain by 2%. Every Reincarnation, dump all Obtainium into research until maxed.'
    },
    instantChallenge: {
        tier: 'Reincarnation',
        price: 300,
        priceIncrease: 99999,
        maxLevel: 1,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'T and R Challenges don\'t cause resets if retry is enabled and gain up to 10 completions per tick. Additionally, instantly gain T Challenge completions up to highest completed when exiting R Challenges.'
    },
    antSpeed: {
        tier: 'Reincarnation',
        price: 200,
        priceIncrease: 25,
        maxLevel: 100,
        type: shopUpgradeTypes.UPGRADE,
        refundable: true,
        refundMinimumLevel: 0,
        description: 'Each level gives a 1.2x speed multiplier to all Ant tiers\' production! (Uncorruptable!) Short and simple.'
    },
    cashGrab: {
        tier: 'Reincarnation',
        price: 100,
        priceIncrease: 40,
        maxLevel: 100,
        type: shopUpgradeTypes.UPGRADE,
        refundable: true,
        refundMinimumLevel: 0,
        description: 'This is a cash grab but it gives a couple cool stats. +1% production per level to Offerings and Obtainium.'
    },
    shopTalisman: {
        tier: 'Reincarnation',
        price: 1500,
        priceIncrease: 99999,
        maxLevel: 1,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'Permanently unlock a Shop talisman!'
    },
    seasonPass: {
        tier: 'Ascension',
        price: 500,
        priceIncrease: 75,
        maxLevel: 100,
        type: shopUpgradeTypes.UPGRADE,
        refundable: true,
        refundMinimumLevel: 0,
        description: 'Wow! Cubes is giving you a deal: Buy this totally fair Season Pass and gain +2.25% Cubes and Tesseracts per level when you Ascend!'
    },
    challengeExtension: {
        tier: 'Ascension',
        price: 500,
        priceIncrease: 250,
        maxLevel: 5,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'Using some amazing trick, you manage to increase your Reincarnation Challenge cap by 2 for each level!'
    },
    challengeTome: {
        tier: 'Ascension',
        price: 500,
        priceIncrease: 250,
        maxLevel: 15,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'The extended cut: This fifth forgotten tome gives you an additional 20 Million exponent reduction on the Challenge 10 requirement per level. Past 60 completions of Challenge 9 or 10, this will also reduce the scaling factor by 1% per level.'
    },
    cubeToQuark: {
        tier: 'Ascension',
        price: 2000,
        priceIncrease: 99999,
        maxLevel: 1,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'Are your Quark gains from Cubes wimpy? Well, buy this for +50% Quarks from opening Wow! Cubes, forever!'
    },
    tesseractToQuark: {
        tier: 'Ascension',
        price: 3500,
        priceIncrease: 99999,
        maxLevel: 1,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'Are your Quark gains from Tesseracts wimpy? Well, buy this for +50% Quarks from opening Wow! Tesseracts, forever!'
    },
    hypercubeToQuark: {
        tier: 'Ascension',
        price: 5000,
        priceIncrease: 99999,
        maxLevel: 1,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'Are your Quark gains from Hypercubes wimpy? Well, buy this for +50% Quarks from opening Wow! Hypercubes, forever!'
    },
    seasonPass2: {
        tier: 'Ascension',
        price: 2500,
        priceIncrease: 250,
        maxLevel: 100,
        type: shopUpgradeTypes.UPGRADE,
        refundable: true,
        refundMinimumLevel: 0,
        description: 'Five times the price gouge, twice the fun! +1.5% Wow! Hypercubes and Platonic Cubes per level.'
    },
    seasonPass3: {
        tier: 'Ascension',
        price: 5000,
        priceIncrease: 500,
        maxLevel: 100,
        type: shopUpgradeTypes.UPGRADE,
        refundable: true,
        refundMinimumLevel: 0,
        description: 'Okay, now this is just ridiculous. +1.5% Wow! Hepteracts and Octeracts per level!'
    },
    chronometer: {
        tier: 'Ascension',
        price: 2000,
        priceIncrease: 500,
        maxLevel: 100,
        type: shopUpgradeTypes.UPGRADE,
        refundable: true,
        refundMinimumLevel: 0,
        description: 'You know, those Ascensions are kinda slow. Why don\'t I give you a +1.2% speedup to the timer per level?'
    },
    infiniteAscent: {
        tier: 'Ascension',
        price: 50000,
        priceIncrease: 9999999,
        maxLevel: 1,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'Okay, for an exorbitant amount, you can obtain the 6th rune, which gives +35% Quarks and +125% all Cube types when maxed!'
    },
    calculator: {
        tier: 'Reincarnation',
        price: 1000,
        priceIncrease: 500,
        maxLevel: 5,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 1,
        description: 'The PL-AT can do addition in the blink of an eye. Not much else though. +14% Quarks from using code \'add\' per level, the first level provides the answer and the final level does it automatically!'
    },
    calculator2: {
        tier: 'Ascension',
        price: 3000,
        priceIncrease: 1000,
        maxLevel: 12,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'The PL-AT X has improved memory capacity, allowing you to store 2 additional uses to code \'add\' per level. Final level makes \'add\' give 25% more Quarks!'
    },
    calculator3: {
        tier: 'Ascension',
        price: 10000,
        priceIncrease: 2000,
        maxLevel: 10,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'The PL-AT Ω is infused with some Unobtainium, which is epic! But furthermore, it reduces the variance of Quarks by code \'add\' by 10% per level, which makes you more likely to get the maximum multiplier. It also has the ability to give +60 seconds to Ascension Timer per level using that code.'
    },
    calculator4: {
        tier: 'Singularity',
        price: 1e7,
        priceIncrease: 1e6,
        maxLevel: 10,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'The PL-AT δ runs at 4,096Hz, which is a huge improvement over previous models. Add attempts refill 2% faster per level! Final level adds 8 additional capacity!'
    },
    calculator5: {
        tier: 'SingularityVol2',
        price: 1e8,
        priceIncrease: 1e8,
        maxLevel: 100,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'The PL-AT Γ model somehow performs more \'powerful\' computations, whatever that means. +6 seconds of GQ Export timer per level. +1 capacity every 10 levels, with 6 more at final level!'
    },
    calculator6: {
        tier: 'SingularityVol3',
        price: 1e11,
        priceIncrease: 2e10,
        maxLevel: 100,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'The PL-AT _ model was made by Derpsmith, before he was banished from the industry forever. Gain 1 second of Octeract per usage per level. Final level grants 24 additional capacity!'
    },
    constantEX: {
        tier: 'Ascension',
        price: 100000,
        priceIncrease: 899999,
        maxLevel: 2,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'The merchant has one last trick up its sleeve: It can augment your second constant upgrade to be marginally better, but it\'ll cost an arm and a leg! Instead of the cap being 10% (or 11% with achievements) it will be raised by 1% per level.'
    },
    powderEX: {
        tier: 'Ascension',
        price: 1000,
        priceIncrease: 750,
        maxLevel: 50,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'Platonic himself gives you 2% better conversion rate on Overflux Orbs to Powder per level. This activates when Orbs expire.'
    },
    chronometer2: {
        tier: 'Ascension',
        price: 5000,
        priceIncrease: 1500,
        maxLevel: 100,
        type: shopUpgradeTypes.UPGRADE,
        refundable: true,
        refundMinimumLevel: 0,
        description: 'Okay, fine. Here\'s another +0.6% Ascension Speed per level, stacks multiplicatively with the first upgrade!'
    },
    chronometer3: {
        tier: 'Singularity',
        price: 250,
        priceIncrease: 250,
        maxLevel: 999,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'OKAY. FINE. Here\'s yet ANOTHER +1.5% Ascension Speed per level, stacking multiplicatively like always.'
    },
    seasonPassY: {
        tier: 'Ascension',
        price: 10000,
        priceIncrease: 1500,
        maxLevel: 100,
        type: shopUpgradeTypes.UPGRADE,
        refundable: true,
        refundMinimumLevel: 0,
        description: 'This is even more insane than the last one, but you\'ll buy it anyway. +0.75% ALL Cubes per level.'
    },
    seasonPassZ: {
        tier: 'Singularity',
        price: 250,
        priceIncrease: 250,
        maxLevel: 999,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'This one is arguably very good. Gain +1% ALL Cubes per level, per Singularity!'
    },
    challengeTome2: {
        tier: 'Singularity',
        price: 1000000,
        priceIncrease: 1000000,
        maxLevel: 5,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'You find the final pages of the lost tome. It functionally acts the same as the rest of the pages, but you can have up to five more!'
    },
    instantChallenge2: {
        tier: 'Singularity',
        price: 20000000,
        priceIncrease: 0,
        maxLevel: 1,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'Completing an Ascension Challenge doesn\'t cause a reset (if retry is enabled) and you gain 1 more completion per tick per Singularity.'
    },
    cubeToQuarkAll: {
        tier: 'SingularityVol2',
        price: 2222222,
        priceIncrease: 0,
        maxLevel: 100,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'First up on the menu, why not gain +0.2% Quarks from Cube opening per level?'
    },
    cashGrab2: {
        tier: 'SingularityVol2',
        price: 5000,
        priceIncrease: 5000,
        maxLevel: 999,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'This isn\'t even as good as the original. +0.5% Offerings and Obtainium per level.'
    },
    chronometerZ: {
        tier: 'SingularityVol2',
        price: 12500,
        priceIncrease: 12500,
        maxLevel: 999,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'Gain +0.1% Ascension Speed per level per Singularity. It needs a lot of fuel to power up.'
    },
    offeringEX2: {
        tier: 'SingularityVol2',
        price: 10000,
        priceIncrease: 10000,
        maxLevel: 999,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'Gain +1% Offerings per level per Singularity. Putting the Singularity Debuff industry out of business.'
    },
    obtainiumEX2: {
        tier: 'SingularityVol2',
        price: 10000,
        priceIncrease: 10000,
        maxLevel: 999,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'Gain +1% Obtainium per level per Singularity!!!'
    },
    powderAuto: {
        tier: 'SingularityVol2',
        price: 5e6,
        priceIncrease: 0,
        maxLevel: 100,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'Your grandparents had to wait a full day for powder, but not you! Per level gain +1% of orbs to powder based on the conversion rate.'
    },
    seasonPassLost: {
        tier: 'SingularityVol2',
        price: 1000000,
        priceIncrease: 25000,
        maxLevel: 999,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'One would be advised not to touch this. +0.1% Octeracts per level, whatever those are...'
    },
    challenge15Auto: {
        tier: 'SingularityVol3',
        price: 5e11,
        priceIncrease: 0,
        maxLevel: 1,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'Your grandparents had to bend dimensions to gain Challenge 15 score, but not you! Updates Challenge 15 Exponent every tick while in challenge 15!'
    },
    extraWarp: {
        tier: 'SingularityVol3',
        price: 1.25e11,
        priceIncrease: 0,
        maxLevel: 1,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: '"Hey dude, get in this portal I built up last night in my shed!" said the Quack Merchant'
    },
    autoWarp: {
        tier: 'SingularityVol3',
        price: 5e11,
        priceIncrease: 0,
        maxLevel: 1,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'With the power of Quacks Warp machine will now be able to go into overdrive'
    },
    improveQuarkHept: {
        tier: 'Ascension',
        price: 2e5 - 1,
        priceIncrease: 0,
        maxLevel: 1,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'Did you know that after 1,000 Quark Hepteracts, their effect is raised to ^0.5? The Seal disapproves. Gain +2% to the diminishing return exponent.'
    },
    improveQuarkHept2: {
        tier: 'Singularity',
        price: 2e7 - 1,
        priceIncrease: 0,
        maxLevel: 1,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'After 1,024,000 Quark Hepts, their effect is raised to ^0.25!!! Nonsense. Gain +2% to all Quark Hept DRs.'
    },
    improveQuarkHept3: {
        tier: 'SingularityVol2',
        price: 2e9 - 1,
        priceIncrease: 0,
        maxLevel: 1,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'After ~100 million Quark Hepts, their effect is raised to ^0.16! Absolute rubbish. Gain +2% to all Quark Hept DRs, yet again.'
    },
    improveQuarkHept4: {
        tier: 'SingularityVol3',
        price: 2e11 - 1,
        priceIncrease: 0,
        maxLevel: 1,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'And when they\'ve given you their all, some stagger and fall after all it\'s not easy...'
    },
    shopImprovedDaily: {
        tier: 'Ascension',
        price: 5000,
        priceIncrease: 2500,
        maxLevel: 20,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'Hey you. Yeah, you! Quarks make seal merchant happy. Get +5% more of them from code \'daily\' per level.'
    },
    shopImprovedDaily2: {
        tier: 'Singularity',
        price: 500000,
        priceIncrease: 500000,
        maxLevel: 10,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'Gain 1 additional free Singularity Upgrade and 20% more Golden Quarks per use of \'daily\' per level!'
    },
    shopImprovedDaily3: {
        tier: 'SingularityVol2',
        price: 5000000,
        priceIncrease: 12500000,
        maxLevel: 15,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'Gain 1 additional free Singularity Upgrade and 15% more Golden Quarks per use of \'daily\' per level!'
    },
    shopImprovedDaily4: {
        tier: 'SingularityVol3',
        price: 5e9,
        priceIncrease: 5e9,
        maxLevel: 25,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'Gain 1 additional free Singularity Upgrade and 100% more Golden Quarks per use of \'daily\' per level!'
    },
    offeringEX3: {
        tier: 'SingularityVol3',
        price: 1,
        priceIncrease: 5e12,
        maxLevel: 1000,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'Gain 2% more Offerings per level, multiplicative! (Multiplier is 1.02^level)'
    },
    obtainiumEX3: {
        tier: 'SingularityVol3',
        price: 1,
        priceIncrease: 5e12,
        maxLevel: 1000,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'Gain 2% more Obtainium per level, multiplicative! (Multiplier is 1.02^level)'
    },
    improveQuarkHept5: {
        tier: 'SingularityVol4',
        price: 1,
        priceIncrease: 1e14,
        maxLevel: 100,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'This is 1/50 as effective as a normal improver. Why? Because of balancing...'
    },
    chronometerInfinity: {
        tier: 'SingularityVol4',
        price: 1,
        priceIncrease: 5e12,
        maxLevel: 1000,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'Gain +1% Ascension Speed per level, multiplicative! (Multiplier is 1.01^level)'
    },
    seasonPassInfinity: {
        tier: 'SingularityVol4',
        price: 1,
        priceIncrease: 5e12,
        maxLevel: 1000,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'Gain +2% more cubes per level, multiplicative! (Multiplier is 1.02^level)'
    }
}

//Names of shop upgrades || Top row indicates potions, and all other upgrades are labeled in order.
//If you are adding more upgrades please make sure the order of labelled upgrades is correct!
type ShopUpgradeNames = 'offeringPotion' | 'obtainiumPotion' |
                        'offeringEX' | 'offeringAuto' | 'offeringEX2' | 'obtainiumEX' | 'obtainiumAuto' | 'obtainiumEX2' | 'instantChallenge' | 'instantChallenge2' |
                        'antSpeed' | 'cashGrab' | 'cashGrab2' | 'shopTalisman' | 'seasonPass' | 'challengeExtension' | 'challengeTome' | 'challengeTome2' |
                        'cubeToQuark' | 'tesseractToQuark' | 'cubeToQuarkAll' | 'hypercubeToQuark' | 'seasonPass2' | 'seasonPass3' | 'seasonPassY' | 'seasonPassZ' |
                        'seasonPassLost' | 'chronometer' | 'chronometer2'| 'chronometer3'| 'chronometerZ' | 'infiniteAscent' | 'calculator' | 'calculator2' |
                        'calculator3' | 'constantEX' | 'powderEX' | 'powderAuto' | 'challenge15Auto' | 'extraWarp' | 'autoWarp' | //And Golden Quarks
                        'improveQuarkHept' | 'improveQuarkHept2' | 'improveQuarkHept3' | 'improveQuarkHept4' | 'shopImprovedDaily' |
                        'shopImprovedDaily2' | 'shopImprovedDaily3' | 'shopImprovedDaily4' | 'calculator4' | 'calculator5' | 'calculator6' |
                        'offeringEX3' | 'obtainiumEX3' | 'improveQuarkHept5' | 'seasonPassInfinity' | 'chronometerInfinity'

export const getShopCosts = (input: ShopUpgradeNames) => {

    if (shopData[input].type === shopUpgradeTypes.CONSUMABLE || shopData[input].maxLevel === 1){
        return shopData[input].price
    } else {
        const priceIncreaseMult = player.shopUpgrades[input]
        return shopData[input].price + shopData[input].priceIncrease * priceIncreaseMult
    }
}

export const shopDescriptions = (input: ShopUpgradeNames) => {
    const rofl = DOMCacheGetOrSet('quarkdescription')!;
    const lol = DOMCacheGetOrSet('quarkeffect')!;
    const refundable = DOMCacheGetOrSet('quarkRefundable')!;

    rofl.textContent = shopData[input].description;

    shopData[input].refundable ?
        refundable.textContent = 'This item is refundable! Will be set to level ' + shopData[input].refundMinimumLevel + ' when refunded.':
        refundable.textContent = 'This item CANNOT be refunded! Take caution.'

    switch (input) {
        case 'offeringPotion':
            lol.textContent = 'Gain ' + format((7200 * player.offeringpersecond * calculateTimeAcceleration() * +player.singularityUpgrades.potionBuff.getEffect().bonus), 0, true) + ' Offerings.'
            break;
        case 'obtainiumPotion':
            lol.textContent = 'Gain ' + format((7200 * player.maxobtainiumpersecond * calculateTimeAcceleration() * +player.singularityUpgrades.potionBuff.getEffect().bonus), 0, true) + ' Obtainium.';
            break;
        case 'offeringEX':
            lol.textContent = 'CURRENT Effect: You will gain ' + format(4 * player.shopUpgrades.offeringEX,2,true) + '% more Offerings!'
            break;
        case 'offeringAuto':
            lol.textContent = 'CURRENT Effect: Per 10 seconds, pour ' + format(Math.pow(2, 1 + player.shopUpgrades.offeringAuto)) + ' Offerings. +' + format(2 * player.shopUpgrades.offeringAuto, 2) + '% Offerings.'
            break;
        case 'obtainiumEX':
            lol.textContent = 'CURRENT Effect: You will gain ' + format(4 * player.shopUpgrades.obtainiumEX,2,true) + '% more Obtainium!'
            break;
        case 'obtainiumAuto':
            lol.textContent = 'CURRENT Effect: Try to upgrade research each reincarnation, and gain ' + format(player.shopUpgrades.obtainiumAuto * 2, 2) + '% more Obtainium.'
            break;
        case 'instantChallenge':
            lol.textContent = 'CURRENT Effect: Even in a premium shop it\'s kinda obvious, right?'
            break;
        case 'antSpeed':
            lol.textContent = 'CURRENT Effect: All Ants\' Speed x' + format(Math.pow(1.2, player.shopUpgrades.antSpeed), 2)
            break;
        case 'cashGrab':
            lol.textContent = 'CURRENT Effect: You will gain ' + format(player.shopUpgrades.cashGrab, 2) + '% more Obtainium and Offerings!'
            break;
        case 'shopTalisman':
            lol.textContent = 'CURRENT Effect: Even in a premium shop it\'s kinda obvious, right?'
            break;
        case 'seasonPass':
            lol.textContent = 'CURRENT Effect: Ascensions give ' + format(2.25 * player.shopUpgrades.seasonPass) + '% more Wow! Cubes and Tesseracts.'
            break;
        case 'challengeExtension':
            lol.textContent = 'CURRENT Effect: Reincarnation Challenges may be completed an additional ' + format(2*player.shopUpgrades.challengeExtension) + ' times.'
            break;
        case 'challengeTome':
            lol.textContent = 'CURRENT Effect: Challenge 10 Exponent Requirement reduced by ' + format(20*player.shopUpgrades.challengeTome) + ' Million. Past 60 completions of C9 or C10 the scaling multiplier is [completions * ' + format(1 - (player.shopUpgrades.challengeTome + player.shopUpgrades.challengeTome2) / 100, 2, true) + ']'
            break;
        case 'cubeToQuark':
            lol.textContent = 'CURRENT Effect: Even in a premium shop it\'s kinda obvious, right?'
            break;
        case 'tesseractToQuark':
            lol.textContent = 'CURRENT Effect: Even in a premium shop it\'s kinda obvious, right?'
            break;
        case 'hypercubeToQuark':
            lol.textContent = 'CURRENT Effect: Even in a premium shop it\'s kinda obvious, right?'
            break;
        case 'seasonPass2':
            lol.textContent = 'CURRENT Effect: Ascensions give ' + format(1.5 * player.shopUpgrades.seasonPass2) + '% more Hypercubes and Platonic Cubes.'
            break;
        case 'seasonPass3':
            lol.textContent = 'CURRENT Effect: Ascensions give ' + format(1.5 * player.shopUpgrades.seasonPass3) + '% more Hepteracts and Octeracts.'
            break;
        case 'chronometer':
            lol.textContent = 'CURRENT Effect: Ascension timer runs ' + format(1.2 * player.shopUpgrades.chronometer) + '% faster.'
            break;
        case 'infiniteAscent':
            lol.textContent = 'CURRENT Effect: Idk, depends if you bought it or not.'
            break;
        case 'calculator':
            lol.textContent = 'CURRENT Effect: Code \'add\' provides ' + format(14 * player.shopUpgrades.calculator) + '% more Quarks. AutoAnswer: ' + (player.shopUpgrades.calculator > 0) + ', AutoFill: ' + (player.shopUpgrades.calculator == 5);
            break;
        case 'calculator2':
            lol.textContent = 'CURRENT Effect: Code \'add\' has ' + format(2 * player.shopUpgrades.calculator2) + ' more capacity. \'add\' uses generate ' + format((player.shopUpgrades.calculator2 === shopData['calculator2'].maxLevel) ? 25: 0) + '% more Quarks.';
            break;
        case 'calculator3':
            lol.textContent = 'CURRENT Effect: Code \'add\' variance -' + format(10 * player.shopUpgrades.calculator3) + '%, Each use gives ' + format(60 * player.shopUpgrades.calculator3) + ' seconds to Ascension Timer.';
            break;
        case 'calculator4':
            lol.textContent = `CURRENT Effect: Code add refills ${format(2 * player.shopUpgrades.calculator4)}% faster. Capacity +${player.shopUpgrades.calculator4 == 10 ? 8 : 0}`
            break;
        case 'calculator5':
            lol.textContent = `CURRENT Effect: Code add adds ${format(6 * player.shopUpgrades.calculator5)}s to GQ export timer. Capacity +${Math.floor(player.shopUpgrades.calculator5 / 10) + (player.shopUpgrades.calculator4 === 100 ? 6 : 0)}`
            break;
        case 'calculator6':
            lol.textContent = `CURRENT Effect: Code add generates ${format(player.shopUpgrades.calculator6)}s of Octeracts. Capacity +${player.shopUpgrades.calculator6 === 100 ? 24 : 0}`
            break;
        case 'constantEX':
            lol.textContent = 'CURRENT Effect: +' + format(0.01 * player.shopUpgrades.constantEX, 2, true) + ' effect on Constant Upgrade 2';
            break;
        case 'powderEX':
            lol.textContent = 'CURRENT Effect: +' + format(2 * player.shopUpgrades.powderEX) + '% Overflux Powder gained when Overflux Orbs expire.'
            break;
        case 'chronometer2':
            lol.textContent = `CURRENT Effect: +${format(0.6 * player.shopUpgrades.chronometer2, 1)}% faster Ascensions!`
            break;
        case 'chronometer3':
            lol.textContent = `CURRENT Effect: +${format(1.5 * player.shopUpgrades.chronometer3, 1)}% faster Ascensions! FOREVER!`
            break;
        case 'seasonPassY':
            lol.textContent = `CURRENT Effect: +${format(0.75 * player.shopUpgrades.seasonPassY, 1)}% more Cubes on Ascension.`
            break;
        case 'seasonPassZ':
            lol.textContent = `CURRENT Effect: +${format(1 * player.shopUpgrades.seasonPassZ * player.singularityCount, 0, true)}% more Cubes on Ascension.`
            break;
        case 'challengeTome2':
            lol.textContent = `CURRENT Effect: Challenge 10 Exponent Requirement reduced by ${20 * player.shopUpgrades.challengeTome2} Million. Past 60 completions of C9 or C10 the scaling multiplier is [completions * ${format(1 - (player.shopUpgrades.challengeTome + player.shopUpgrades.challengeTome2) / 100, 2, true)}]`
            break;
        case 'instantChallenge2':
            lol.textContent = `CURRENT Effect: +${format(player.shopUpgrades.instantChallenge2 * player.singularityCount, 0)} Challenges per tick`
            break;
        case 'cashGrab2':
            lol.textContent = `CURRENT Effect: Offering, Obtainium +${format(0.5 * player.shopUpgrades.cashGrab2, 1)}%!`;
            break;
        case 'cubeToQuarkAll':
            lol.textContent = `CURRENT Effect: Opening any cube gives +${format(0.2 * player.shopUpgrades.cubeToQuarkAll, 2)}% Quarks!`;
            break;
        case 'chronometerZ':
            lol.textContent = `CURRENT Effect: Ascension Speed +${format(0.1 * player.singularityCount * player.shopUpgrades.chronometerZ, 2)}%!`;
            break;
        case 'offeringEX2':
            lol.textContent = `CURRENT Effect: Offerings +${format(1 * player.singularityCount * player.shopUpgrades.offeringEX2, 2)}%!`;
            break;
        case 'obtainiumEX2':
            lol.textContent = `CURRENT Effect: Obtainium +${format(1 * player.singularityCount * player.shopUpgrades.obtainiumEX2, 2)}%!`;
            break;
        case 'powderAuto':
            lol.textContent = `CURRENT Effect: Every ${format(100 / (Math.max(1, player.shopUpgrades.powderAuto) * calculatePowderConversion().mult), 0, true)} purchased orbs grants 1 powder.`
            break;
        case 'seasonPassLost':
            lol.textContent = `CURRENT Effect: +${format(0.1 * player.shopUpgrades.seasonPassLost, 2)}% of those Eight-Dimensional Thingies.`;
            break;
        case 'challenge15Auto':
            lol.textContent = `CURRENT Effect: Challenge 15 Exponent is ${player.shopUpgrades.challenge15Auto ? '' : 'NOT'} automatically gained!`;
            break;
        case 'extraWarp':
            lol.textContent = `CURRENT Effect: You can warp ${player.shopUpgrades.extraWarp} extra times.`;
            break;
        case 'autoWarp':
            lol.textContent = `CURRENT Effect: Warp machine ${player.shopUpgrades.autoWarp ? 'can now' : 'can\'t'} go into overdrive${player.shopUpgrades.autoWarp ? '' : ', yet'}.`;
            break;
        case 'improveQuarkHept':
            lol.textContent = `CURRENT Effect: Quark Hepteract DR +${player.shopUpgrades.improveQuarkHept/50}`;
            break;
        case 'improveQuarkHept2':
            lol.textContent = `CURRENT Effect: Quark Hepteract DR +${player.shopUpgrades.improveQuarkHept2/50}`;
            break;
        case 'improveQuarkHept3':
            lol.textContent = `CURRENT Effect: Quark Hepteract DR +${player.shopUpgrades.improveQuarkHept3/50}`;
            break;
        case 'improveQuarkHept4':
            lol.textContent = `CURRENT Effect: Quark Hepteract DR +${player.shopUpgrades.improveQuarkHept4/50}`;
            break;
        case 'shopImprovedDaily':
            lol.textContent = `CURRENT Effect: + ${player.shopUpgrades.shopImprovedDaily * 5}% more quarks from daily.`;
            break;
        case 'shopImprovedDaily2':
            lol.textContent = `CURRENT Effect: + ${player.shopUpgrades.shopImprovedDaily2 * 20}% more golden quarks and ${player.shopUpgrades.shopImprovedDaily2} additional free singularity upgrades from daily.`;
            break;
        case 'shopImprovedDaily3':
            lol.textContent = `CURRENT Effect: + ${player.shopUpgrades.shopImprovedDaily3 * 15}% more golden quarks and ${player.shopUpgrades.shopImprovedDaily3} additional free singularity upgrades from daily.`;
            break;
        case 'shopImprovedDaily4':
            lol.textContent = `CURRENT Effect: + ${player.shopUpgrades.shopImprovedDaily4 * 100}% more golden quarks and ${player.shopUpgrades.shopImprovedDaily4} additional free singularity upgrades from daily.`;
            break;
        case 'offeringEX3':
            lol.textContent = `CURRENT Effect: Offering gain is multiplied by ${format(Math.pow(1.02, player.shopUpgrades.offeringEX3), 2, true)}.`
            break;
        case 'obtainiumEX3':
            lol.textContent = `CURRENT Effect: Offering gain is multiplied by ${format(Math.pow(1.02, player.shopUpgrades.obtainiumEX3), 2, true)}.`
            break;
        case 'improveQuarkHept5':
            lol.textContent = `CURRENT Effect: Quark Hepteract DR +${player.shopUpgrades.improveQuarkHept5/2500}`;
            break;
        case 'seasonPassInfinity':
            lol.textContent = `CURRENT Effect: All Dimensional Cubes are multiplied by ${format(Math.pow(1.02, player.shopUpgrades.seasonPassInfinity), 2, true)}`
            break;
        case 'chronometerInfinity':
            lol.textContent = `CURRENT Effect: Ascension Speed is multiplied by ${format(Math.pow(1.01, player.shopUpgrades.chronometerInfinity), 2, true)}`
    }

}

//strentax 07/21 Add function to convert code-name display to end-user friendly display of shop upgrades
export const friendlyShopName = (input: ShopUpgradeNames) => {

    const names: Record<ShopUpgradeNames, string> = {
        offeringPotion: 'Offering Potion',
        obtainiumPotion: 'Obtainium Potion',
        offeringEX: 'Offering EX',
        offeringAuto: 'Offering Auto',
        obtainiumEX: 'Obtainium EX',
        obtainiumAuto: 'Obtainium Auto',
        instantChallenge: 'Instant Challenge Completions',
        antSpeed: 'Ant Speed',
        cashGrab: 'Cash Grab',
        shopTalisman: 'the Plastic talisman',
        seasonPass: 'Season Pass',
        challengeExtension: 'Reincarnation Challenge EX',
        challengeTome: 'Challenge 10 Requirement Reduce',
        cubeToQuark: 'Cube Quarks +50%',
        tesseractToQuark: 'Tesseract Quarks +50%',
        hypercubeToQuark: 'Hypercube Quarks +50%',
        seasonPass2: 'Season Pass 2',
        seasonPass3: 'Season Pass 3',
        chronometer: 'Chronometer 1',
        infiniteAscent: 'Infinite Ascent',
        calculator: 'PL-AT calculator',
        calculator2: 'PL-AT X calculator',
        calculator3: 'PL-AT Ω calculator',
        calculator4: 'PL-AT δ calculator',
        calculator5: 'PL-AT Γ calculator',
        calculator6: 'QUAAA-T calculator',
        constantEX: 'Constant EX',
        powderEX: 'Powder EX',
        chronometer2: 'Chronometer 2',
        chronometer3: 'Chronometer 3',
        seasonPassY: 'Season Pass Y',
        seasonPassZ: 'Season Pass Z',
        challengeTome2: 'Challenge 10 Requirement Reduction 2',
        instantChallenge2: 'Instant Challenge Completions 2',
        cubeToQuarkAll: 'Quark Gain Cube Improvement 2',
        cashGrab2: 'Cash Grab 2',
        chronometerZ: 'Chronometer Z',
        obtainiumEX2: 'Obtainium EX 2',
        offeringEX2: 'Offering EX 2',
        powderAuto: 'Automated Powder',
        seasonPassLost: 'Season Pass LOST',
        challenge15Auto: 'Challenge 15 Automation',
        extraWarp: 'Extra Warp',
        autoWarp: 'a quack powered Warps?',
        improveQuarkHept: 'Quark Hepteract 1',
        improveQuarkHept2: 'Quark Hepteract 2',
        improveQuarkHept3: 'Quark Hepteract 3',
        improveQuarkHept4: 'Quack Hepteract 4',
        shopImprovedDaily: 'Improved Daily Code 1',
        shopImprovedDaily2: 'Improved Daily Code 2',
        shopImprovedDaily3: 'Improved Daily Code 3',
        shopImprovedDaily4: 'Improved Daily Code 4',
        offeringEX3: 'The final Offering Upgrade',
        obtainiumEX3: 'The final Obtainium Upgrade',
        improveQuarkHept5: 'The final Quark Hepteract Improver',
        chronometerInfinity: 'The final Chronometer',
        seasonPassInfinity: 'The final Season pass'
    }

    return names[input];

}

export const buyShopUpgrades = async (input: ShopUpgradeNames) => {
    const shopItem = shopData[input];

    if (player.shopUpgrades[input] >= shopItem.maxLevel) {
        return player.shopConfirmationToggle
            ? Alert(`You can't purchase ${friendlyShopName(input)} because you are already at the maximum ${shopItem.type === shopUpgradeTypes.UPGRADE ? 'level' : 'capacity'}!`)
            : null;
    } else if (Number(player.worlds) < getShopCosts(input)) {
        return player.shopConfirmationToggle
            ? Alert(`You can't purchase ${friendlyShopName(input)} because you don't have enough Quarks!`)
            : null;
    }

    // Actually lock for HTML exploit
    if (!isShopUpgradeUnlocked(input)) {
        return Alert(`You do not have the right to purchase ${friendlyShopName(input)}!`);
    }

    let buyData:IMultiBuy;
    const maxBuyAmount = shopItem.maxLevel - player.shopUpgrades[input];
    let buyAmount;
    let buyCost;
    switch (player.shopBuyMaxToggle) {
        case false:
            buyAmount = 1;
            buyCost = getShopCosts(input);
            break;
        case 'TEN':
            buyData = calculateSummationNonLinear(player.shopUpgrades[input], shopItem.price, +player.worlds, shopItem.priceIncrease / shopItem.price, Math.min(10,maxBuyAmount))
            buyAmount = buyData.levelCanBuy - player.shopUpgrades[input];
            buyCost = buyData.cost;
            break;
        default:
            buyData = calculateSummationNonLinear(player.shopUpgrades[input], shopItem.price, +player.worlds, shopItem.priceIncrease / shopItem.price, maxBuyAmount)
            buyAmount = buyData.levelCanBuy - player.shopUpgrades[input];
            buyCost = buyData.cost;
    }

    const singular = shopItem.maxLevel === 1;
    const merch = buyAmount.toLocaleString() + (shopItem.type === shopUpgradeTypes.UPGRADE ? ' level' : ' vial') + (buyAmount === 1 ? '' : 's');
    const noRefunds = shopItem.refundable ? '' : '\n\n\u26A0\uFE0F !! No Refunds !! \u26A0\uFE0F';
    const maxPots = shopItem.type === shopUpgradeTypes.CONSUMABLE ? '\n\nType -1 in Buy: ANY to buy equal amounts of both Potions.' : '';

    if (player.shopBuyMaxToggle === 'ANY' && !singular) {
        const buyInput = await Prompt(`You can afford to purchase up to ${merch} of ${friendlyShopName(input)} for ${buyCost.toLocaleString()} Quarks. How many would you like to buy?${maxPots + noRefunds}`);
        let buyAny;
        if (Number(buyInput) === -1 && shopItem.type === shopUpgradeTypes.CONSUMABLE) {
            const other = input === 'offeringPotion' ? 'obtainiumPotion' : 'offeringPotion';
            const toSpend = Math.max(+player.worlds / 2, +player.worlds - buyCost);
            const otherPot:IMultiBuy = calculateSummationNonLinear(player.shopUpgrades[other], shopData[other].price, toSpend, shopData[other].priceIncrease / shopData[other].price, shopData[other].maxLevel-player.shopUpgrades[other]);
            player.worlds.sub(otherPot.cost);
            player.shopUpgrades[other] = otherPot.levelCanBuy;
            buyAny = buyAmount;
        } else {
            buyAny = Math.floor(Number(buyInput));
            if (buyAny === 0) {
                return;
            } else if (Number.isNaN(buyAny) || !Number.isFinite(buyAny) || buyAny < 0) {
                return Alert('Amount must be a finite, positive integer.');
            }
        }
        const anyData:IMultiBuy = calculateSummationNonLinear(player.shopUpgrades[input], shopItem.price, +player.worlds, shopItem.priceIncrease / shopItem.price, Math.min(buyAny, buyAmount))
        player.worlds.sub(anyData.cost);
        player.shopUpgrades[input] = anyData.levelCanBuy;
        revealStuff();
        return;
    }

    let p = true;
    if (player.shopConfirmationToggle || (!shopItem.refundable && player.shopBuyMaxToggle !== false)) {
        p = await Confirm(`You are about to ${singular ? 'unlock' : `purchase ${merch} of`} ${friendlyShopName(input)} for ${buyCost.toLocaleString()} Quarks. Press 'OK' to finalize purchase.${maxPots + noRefunds}`);
    }
    if (p) {
        player.worlds.sub(buyCost);
        player.shopUpgrades[input] += buyAmount;
        revealStuff();
    }
}

export const autoBuyConsumable = (input: ShopUpgradeNames) => {
    const maxBuyablePotions = Math.floor(Math.min(Number(player.worlds) / 100, Math.min(shopData[input].maxLevel - player.shopUpgrades[input], Math.pow(player.highestSingularityCount, 2) * 100)));

    if (shopData[input].maxLevel <= player.shopUpgrades[input]) {
        return;
    }
    if (maxBuyablePotions <= 0) {
        return;
    }

    player.worlds.sub(100 * maxBuyablePotions);
    player.shopUpgrades[input] += maxBuyablePotions;
}

export const useConsumable = async (input: ShopUpgradeNames, automatic = false, used = 1, spend = true) => {

    const p = (player.shopConfirmationToggle && !automatic)
        ? await Confirm('Would you like to use some of this potion?')
        : true;

    if (p) {
        const multiplier = +player.singularityUpgrades.potionBuff.getEffect().bonus *
                           +player.singularityUpgrades.potionBuff2.getEffect().bonus *
                           +player.singularityUpgrades.potionBuff3.getEffect().bonus *
                           +player.octeractUpgrades.octeractAutoPotionEfficiency.getEffect().bonus *
                           used;

        if (input === 'offeringPotion') {
            if (player.shopUpgrades.offeringPotion >= used || !spend) {
                player.shopUpgrades.offeringPotion -= (spend ? used: 0);
                player.runeshards += Math.floor(7200 * player.offeringpersecond * calculateTimeAcceleration() * multiplier)
                player.runeshards = Math.min(1e300, player.runeshards)
            }
        } else if (input === 'obtainiumPotion') {
            if (player.shopUpgrades.obtainiumPotion >= used || !spend) {
                player.shopUpgrades.obtainiumPotion -= (spend? used: 0);
                player.researchPoints += Math.floor(7200 * player.maxobtainiumpersecond * calculateTimeAcceleration() * multiplier)
                player.researchPoints = Math.min(1e300, player.researchPoints)
            }
        }
    }
}

export const resetShopUpgrades = async (ignoreBoolean = false) => {
    let p = false
    if (!ignoreBoolean) {
        p = player.shopConfirmationToggle
            ? await Confirm('This will fully refund most of your permanent upgrades for an upfront cost of 15 Quarks. Would you like to do this?')
            : true;
    }

    if (p || ignoreBoolean) {
        const singularityQuarks = player.quarksThisSingularity;
        let refunds = false;
        for (const shopItem in shopData){
            const key = shopItem as keyof typeof shopData;
            const item = shopData[key];
            if (item.refundable && player.shopUpgrades[key] > item.refundMinimumLevel){
                refunds = true;
                // Determines how many quarks one would not be refunded, based on minimum refund level
                const doNotRefund = item.price * item.refundMinimumLevel +
                                item.priceIncrease * (item.refundMinimumLevel) * (item.refundMinimumLevel - 1) / 2;

                //Refunds Quarks based on the shop level and price vals
                player.worlds.add(
                    item.price * player.shopUpgrades[key] +
                    item.priceIncrease * (player.shopUpgrades[key]) * (player.shopUpgrades[key] - 1) / 2
                    - doNotRefund,
                    false
                );

                player.shopUpgrades[key] = item.refundMinimumLevel;
            }
        }
        if (refunds) {
            player.worlds.sub(15);
        } else if (!ignoreBoolean && player.shopConfirmationToggle) {
            void Alert('Nothing to Refund!');
        }
        player.quarksThisSingularity = singularityQuarks;
    }
}

export const getQuarkInvestment = (upgrade: ShopUpgradeNames) => {
    if (!(upgrade in shopData) || !(upgrade in player.shopUpgrades)) {
        return 0;
    }

    const val = shopData[upgrade].price * player.shopUpgrades[upgrade] +
                shopData[upgrade].priceIncrease * (player.shopUpgrades[upgrade] - 1) * (player.shopUpgrades[upgrade]) / 2

    return val;
}

export const isShopUpgradeUnlocked = (upgrade: ShopUpgradeNames):boolean => {
    switch (upgrade) {
        case 'offeringPotion':
            return true
        case 'obtainiumPotion':
            return true
        case 'offeringEX':
            return player.reincarnationCount > 0 || player.highestSingularityCount > 0
        case 'offeringAuto':
            return player.reincarnationCount > 0 || player.highestSingularityCount > 0
        case 'obtainiumEX':
            return player.reincarnationCount > 0 || player.highestSingularityCount > 0
        case 'obtainiumAuto':
            return player.reincarnationCount > 0 || player.highestSingularityCount > 0
        case 'instantChallenge':
            return player.reincarnationCount > 0 || player.highestSingularityCount > 0
        case 'antSpeed':
            return player.highestchallengecompletions[8] > 0 || player.ascensionCount > 0 || player.highestSingularityCount > 0
        case 'cashGrab':
            return player.highestchallengecompletions[8] > 0 || player.ascensionCount > 0 || player.highestSingularityCount > 0
        case 'shopTalisman':
            return player.highestchallengecompletions[9] > 0 || player.ascensionCount > 0 || player.highestSingularityCount > 0
        case 'seasonPass':
            return player.ascensionCount > 0 || player.highestSingularityCount > 0
        case 'challengeExtension':
            return player.ascensionCount > 0 || player.highestSingularityCount > 0
        case 'challengeTome':
            return player.ascensionCount > 0 || player.highestSingularityCount > 0
        case 'cubeToQuark':
            return player.ascensionCount > 0 || player.highestSingularityCount > 0
        case 'tesseractToQuark':
            return player.highestchallengecompletions[11] > 0 || player.highestSingularityCount > 0
        case 'hypercubeToQuark':
            return player.highestchallengecompletions[13] > 0 || player.highestSingularityCount > 0
        case 'seasonPass2':
            return player.highestchallengecompletions[14] > 0 || player.highestSingularityCount > 0
        case 'seasonPass3':
            return player.highestchallengecompletions[14] > 0 || player.highestSingularityCount > 0
        case 'chronometer':
            return player.highestchallengecompletions[12] > 0 || player.highestSingularityCount > 0
        case 'infiniteAscent':
            return player.highestchallengecompletions[14] > 0 || player.highestSingularityCount > 0
        case 'calculator':
            return player.ascensionCount > 0 || player.highestSingularityCount > 0
        case 'calculator2':
            return player.highestchallengecompletions[11] > 0 || player.highestSingularityCount > 0
        case 'calculator3':
            return player.highestchallengecompletions[13] > 0 || player.highestSingularityCount > 0
        case 'calculator4':
            return Boolean(player.singularityUpgrades.wowPass.getEffect().bonus)
        case 'calculator5':
            return Boolean(player.singularityUpgrades.wowPass2.getEffect().bonus)
        case 'calculator6':
            return Boolean(player.singularityUpgrades.wowPass3.getEffect().bonus)
        case 'constantEX':
            return player.highestchallengecompletions[14] > 0 || player.highestSingularityCount > 0
        case 'powderEX':
            return player.challenge15Exponent >= 1e15 || player.highestSingularityCount > 0
        case 'chronometer2':
            return player.challenge15Exponent >= 1e15 || player.highestSingularityCount > 0
        case 'chronometer3':
            return Boolean(player.singularityUpgrades.wowPass.getEffect().bonus)
        case 'seasonPassY':
            return player.challenge15Exponent >= 1e15 || player.highestSingularityCount > 0
        case 'seasonPassZ':
            return Boolean(player.singularityUpgrades.wowPass.getEffect().bonus)
        case 'challengeTome2':
            return Boolean(player.singularityUpgrades.wowPass.getEffect().bonus)
        case 'instantChallenge2':
            return Boolean(player.singularityUpgrades.wowPass.getEffect().bonus)
        case 'cashGrab2':
            return Boolean(player.singularityUpgrades.wowPass2.getEffect().bonus)
        case 'cubeToQuarkAll':
            return Boolean(player.singularityUpgrades.wowPass2.getEffect().bonus)
        case 'chronometerZ':
            return Boolean(player.singularityUpgrades.wowPass2.getEffect().bonus)
        case 'offeringEX2':
            return Boolean(player.singularityUpgrades.wowPass2.getEffect().bonus)
        case 'obtainiumEX2':
            return Boolean(player.singularityUpgrades.wowPass2.getEffect().bonus)
        case 'powderAuto':
            return Boolean(player.singularityUpgrades.wowPass2.getEffect().bonus)
        case 'seasonPassLost':
            return Boolean(player.singularityUpgrades.wowPass2.getEffect().bonus)
        case 'challenge15Auto':
            return Boolean(player.singularityUpgrades.wowPass3.getEffect().bonus)
        case 'extraWarp':
            return Boolean(player.singularityUpgrades.wowPass3.getEffect().bonus)
        case 'autoWarp':
            return Boolean(player.singularityUpgrades.wowPass3.getEffect().bonus)
        case 'improveQuarkHept':
            return player.challenge15Exponent >= 1e15 || player.highestSingularityCount > 0
        case 'improveQuarkHept2':
            return Boolean(player.singularityUpgrades.wowPass.getEffect().bonus)
        case 'improveQuarkHept3':
            return Boolean(player.singularityUpgrades.wowPass2.getEffect().bonus)
        case 'improveQuarkHept4':
            return Boolean(player.singularityUpgrades.wowPass3.getEffect().bonus)
        case 'shopImprovedDaily':
            return player.highestchallengecompletions[14] > 0 || player.highestSingularityCount > 0
        case 'shopImprovedDaily2':
            return Boolean(player.singularityUpgrades.wowPass.getEffect().bonus)
        case 'shopImprovedDaily3':
            return Boolean(player.singularityUpgrades.wowPass2.getEffect().bonus)
        case 'shopImprovedDaily4':
            return Boolean(player.singularityUpgrades.wowPass3.getEffect().bonus)
        case 'offeringEX3':
            return Boolean(player.singularityUpgrades.wowPass4.getEffect().bonus)
        case 'obtainiumEX3':
            return Boolean(player.singularityUpgrades.wowPass4.getEffect().bonus)
        case 'improveQuarkHept5':
            return Boolean(player.singularityUpgrades.wowPass4.getEffect().bonus)
        case 'chronometerInfinity':
            return Boolean(player.singularityUpgrades.wowPass4.getEffect().bonus)
        case 'seasonPassInfinity':
            return Boolean(player.singularityUpgrades.wowPass4.getEffect().bonus)
    }
}
