import { player, format } from './Synergism';
import { Alert, Confirm, revealStuff } from './UpdateHTML';
import { calculatePowderConversion, calculateTimeAcceleration } from './Calculate';
import type { Player } from './types/Synergism';
import { DOMCacheGetOrSet } from './Cache/DOM';

/**
 * Standardization of metadata contained for each shop upgrade.
 */
export enum shopUpgradeTypes {
    CONSUMABLE = 'consume',
    UPGRADE = 'upgrade'
}

type shopResetTier = 'Reincarnation' | 'Ascension' | 'Singularity' | 'SingularityVol2'

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
        maxLevel: 999999,
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
        maxLevel: 999999,
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
        description: 'Gain +4% more offerings from all sources!'
    },
    offeringAuto: {
        tier: 'Reincarnation',
        price: 150,
        priceIncrease: 10,
        maxLevel: 100,
        type: shopUpgradeTypes.UPGRADE,
        refundable: true,
        refundMinimumLevel: 1,
        description: 'Automatically pour Offerings into a rune. 1st level unlocks feature, and each level increases Offering gain by 2%. Every second, 2^(Level) levels worth of offerings are spent.'
    },
    obtainiumEX: {
        tier: 'Reincarnation',
        price: 150,
        priceIncrease: 10,
        maxLevel: 100,
        type: shopUpgradeTypes.UPGRADE,
        refundable: true,
        refundMinimumLevel: 0,
        description: 'Gain +4% more obtainium from all sources!'
    },
    obtainiumAuto: {
        tier: 'Reincarnation',
        price: 150,
        priceIncrease: 10,
        maxLevel: 100,
        type: shopUpgradeTypes.UPGRADE,
        refundable: true,
        refundMinimumLevel: 1,
        description: 'Automatically pour Obtainium into a research. 1st level unlocks feature, and each level increases Obtainium gain by 2%. Every reincarnation, dump all Obtainium into research until maxed.'
    },
    instantChallenge: {
        tier: 'Reincarnation',
        price: 300,
        priceIncrease: 99999,
        maxLevel: 1,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'T and R challenges don\'t cause resets if retry is enabled and gain up to 10 completions per tick. Additionally, instantly gain T challenge completions up to highest completed when exiting R challenges.'
    },
    antSpeed: {
        tier: 'Reincarnation',
        price: 200,
        priceIncrease: 25,
        maxLevel: 100,
        type: shopUpgradeTypes.UPGRADE,
        refundable: true,
        refundMinimumLevel: 0,
        description: 'Each level gives a 1.125x speed multiplier to all Ant tiers\' production! (Uncorruptable!) Short and simple.'
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
        description: 'Wow! Cubes is giving you a deal: Buy this totally fair Season Pass and gain +1.5% cubes and tesseracts per level when you ascend!'
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
        description: 'The extended cut: This fifth forgotten tome gives you an additional 20 Million exponent reduction on the Challenge 10 requirement per level. Past 60 completions of challenge 9 or 10, this will also reduce the scaling factor by 1% per level.'
    },
    cubeToQuark: {
        tier: 'Ascension',
        price: 2000,
        priceIncrease: 99999,
        maxLevel: 1,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'Are your quark gains from Cubes wimpy? Well, buy this for +50% quarks from opening Wow! Cubes, forever!'
    },
    tesseractToQuark: {
        tier: 'Ascension',
        price: 3500,
        priceIncrease: 99999,
        maxLevel: 1,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'Are your quark gains from Tesseracts wimpy? Well, buy this for +50% quarks from opening Wow! Tesseracts, forever!'
    },
    hypercubeToQuark: {
        tier: 'Ascension',
        price: 5000,
        priceIncrease: 99999,
        maxLevel: 1,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'Are your quark gains from Hypercubes wimpy? Well, buy this for +50% quarks from opening Wow! Hypercubes, forever!'
    },
    seasonPass2: {
        tier: 'Ascension',
        price: 2500,
        priceIncrease: 250,
        maxLevel: 100,
        type: shopUpgradeTypes.UPGRADE,
        refundable: true,
        refundMinimumLevel: 0,
        description: 'Five times the price gouge, twice the fun! +1% Wow! Hypercubes and Platonic Cubes per level.'
    },
    seasonPass3: {
        tier: 'Ascension',
        price: 5000,
        priceIncrease: 500,
        maxLevel: 100,
        type: shopUpgradeTypes.UPGRADE,
        refundable: true,
        refundMinimumLevel: 0,
        description: 'Okay, now this is just ridiculous. +1% Wow! Hepteracts and Octeracts per level!'
    },
    chronometer: {
        tier: 'Ascension',
        price: 2000,
        priceIncrease: 500,
        maxLevel: 100,
        type: shopUpgradeTypes.UPGRADE,
        refundable: true,
        refundMinimumLevel: 0,
        description: 'You know, those ascensions are kinda slow. Why don\'t I give you a +1% speedup to the timer per level?'
    },
    infiniteAscent: {
        tier: 'Ascension',
        price: 50000,
        priceIncrease: 9999999,
        maxLevel: 1,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'Okay, for an exorbitant amount, you can obtain the 6th rune, which gives +35% Quarks and +125% all cube types when maxed!'
    },
    calculator: {
        tier: 'Ascension',
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
        description: 'Okay, fine. Here\'s another +0.5% Ascension Speed per level, stacks multiplicatively with the first upgrade!'
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
        description: 'This is even more insane than the last one, but you\'ll buy it anyway. +0.5% ALL Cubes per level.'
    },
    seasonPassZ: {
        tier: 'Singularity',
        price: 250,
        priceIncrease: 250,
        maxLevel: 999,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'This one is arguably very good. Gain +1% ALL Cubes per level, per singularity!'
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
    cubeToQuarkAll: {
        tier: 'SingularityVol2',
        price: 2222222,
        priceIncrease: 0,
        maxLevel: 100,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'First up on the menu, why not gain +0.2% Quarks from cube opening per level?'
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
        description: 'Gain +0.1% Ascension Speed per level per singularity. It needs a lot of fuel to power up.'
    },
    offeringEX2: {
        tier: 'SingularityVol2',
        price: 10000,
        priceIncrease: 10000,
        maxLevel: 999,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'Gain +1% Offerings per level per singularity. Putting the Singularity Debuff industry out of business.'
    },
    obtainiumEX2: {
        tier: 'SingularityVol2',
        price: 10000,
        priceIncrease: 10000,
        maxLevel: 999,
        type: shopUpgradeTypes.UPGRADE,
        refundable: false,
        refundMinimumLevel: 0,
        description: 'Gain +1% Obtainium per level per singularity!!!'
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
        description: 'One would be advised not to touch this. +0.05% Octeracts per level, whatever those are...'
    }
}

//Names of shop upgrades || Top row indicates potions, and all other upgrades are labeled in order.
//If you are adding more upgrades please make sure the order of labelled upgrades is correct!
type ShopUpgradeNames = 'offeringPotion' | 'obtainiumPotion' |
                        'offeringEX' | 'offeringAuto' | 'obtainiumEX' | 'obtainiumAuto' | 'instantChallenge' |
                        'antSpeed' | 'cashGrab' | 'shopTalisman' | 'seasonPass' | 'challengeExtension' |
                        'challengeTome' | 'challengeTome2' | 'cubeToQuark' | 'tesseractToQuark' | 'hypercubeToQuark' |
                        'seasonPass2' | 'seasonPass3' | 'seasonPassY' | 'seasonPassZ' | 'chronometer' |
                        'chronometer2'| 'chronometer3'| 'infiniteAscent' | 'calculator' |
                        'calculator2' | 'calculator3' | 'constantEX' | 'powderEX' | 'cashGrab2' | 'cubeToQuarkAll' |
                        'seasonPassLost' | 'chronometerZ' | 'powderAuto' | 'offeringEX2' | 'obtainiumEX2'

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
            lol.textContent = 'CURRENT Effect: All Ants\' Speed x' + format(Math.pow(1.125, player.shopUpgrades.antSpeed), 2)
            break;
        case 'cashGrab':
            lol.textContent = 'CURRENT Effect: You will gain ' + format(player.shopUpgrades.cashGrab, 2) + '% more Obtainium and Offerings!'
            break;
        case 'shopTalisman':
            lol.textContent = 'CURRENT Effect: Even in a premium shop it\'s kinda obvious, right?'
            break;
        case 'seasonPass':
            lol.textContent = 'CURRENT Effect: Ascensions give ' + format(3 / 2 * player.shopUpgrades.seasonPass) + '% more Wow! Cubes and Tesseracts.'
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
            lol.textContent = 'CURRENT Effect: Ascensions give ' + format(player.shopUpgrades.seasonPass2) + '% more Hypercubes and Platonic Cubes.'
            break;
        case 'seasonPass3':
            lol.textContent = 'CURRENT Effect: Ascensions give ' + format(player.shopUpgrades.seasonPass3) + '% more Hepteracts and Octarets.'
            break;
        case 'chronometer':
            lol.textContent = 'CURRENT Effect: Ascension timer runs ' + format(player.shopUpgrades.chronometer) + '% faster.'
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
        case 'constantEX':
            lol.textContent = 'CURRENT Effect: +' + format(0.01 * player.shopUpgrades.constantEX, 2, true) + ' effect on Constant Upgrade 2';
            break;
        case 'powderEX':
            lol.textContent = 'CURRENT Effect: +' + format(2 * player.shopUpgrades.powderEX) + '% Overflux Powder gained when Overflux Orbs expire.'
            break;
        case 'chronometer2':
            lol.textContent = `CURRENT Effect: +${format(0.5 * player.shopUpgrades.chronometer2, 1)}% faster ascensions!`
            break;
        case 'chronometer3':
            lol.textContent = `CURRENT Effect: +${format(1.5 * player.shopUpgrades.chronometer3, 1)}% faster ascensions! FOREVER!`
            break;
        case 'seasonPassY':
            lol.textContent = `CURRENT Effect: +${format(0.5 * player.shopUpgrades.seasonPassY, 1)}% more cubes on ascension.`
            break;
        case 'seasonPassZ':
            lol.textContent = `CURRENT Effect: +${format(1 * player.shopUpgrades.seasonPassZ * player.singularityCount, 0, true)}% more cubes on ascension.`
            break;
        case 'challengeTome2':
            lol.textContent = `CURRENT Effect: Challenge 10 Exponent Requirement reduced by ${20 * player.shopUpgrades.challengeTome2} Million. Past 60 completions of C9 or C10 the scaling multiplier is [completions * ${format(1 - (player.shopUpgrades.challengeTome + player.shopUpgrades.challengeTome2) / 100, 2, true)}]`
            break;
        case 'cashGrab2':
            lol.textContent = `CURRENT Effect: Offering, Obtainium +${format(0.5 * player.shopUpgrades.cashGrab2, 1)}%!`;
            break;
        case 'cubeToQuarkAll':
            lol.textContent = `CURRENT Effect: Opening any cube gives +${format(0.2 * player.shopUpgrades.cubeToQuarkAll, 2)}% quarks!`;
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
            lol.textContent = `CURRENT Effect: +${format(0.05 * player.shopUpgrades.seasonPassLost, 2)}% of those Eight-Dimensional Thingies.`
    }

}

//strentax 07/21 Add function to convert code-name display to end-user friendly display of shop upgrades
export const friendlyShopName = (input: ShopUpgradeNames) => {

    const names: Record<ShopUpgradeNames, string> = {
        offeringPotion: 'an offering potion',
        obtainiumPotion: 'an obtainium potion',
        offeringEX: 'Offering EX',
        offeringAuto: 'Offering Auto',
        obtainiumEX: 'Obtainium EX',
        obtainiumAuto: 'Obtainium Auto',
        instantChallenge: 'Instant Challenge Completions',
        antSpeed: 'Ant Speed',
        cashGrab: 'Cash Grab',
        shopTalisman: 'the Plastic talisman',
        seasonPass: 'a Season Pass',
        challengeExtension: 'a Reincarnation Challenge cap increase',
        challengeTome: 'a Challenge 10 requirement reduction',
        cubeToQuark: 'a 50% improvement to quark gain from Cube opening',
        tesseractToQuark: 'a 50% improvement to quark gain from Tesseract opening',
        hypercubeToQuark: 'a 50% improvement to quark gain from Hypercube opening',
        seasonPass2: 'a Season Pass 2',
        seasonPass3: 'a Season Pass 3',
        chronometer: 'a 1% ascension speedup',
        infiniteAscent: 'the Infinite Ascent rune',
        calculator: 'a PL-AT calculator',
        calculator2: 'a PL-AT X calculator',
        calculator3: 'a PL-AT Ω calculator',
        constantEX: 'Constant EX',
        powderEX: 'Powder EX',
        chronometer2: 'a 0.5% ascension speedup',
        chronometer3: 'a permanent 1.5% ascension speedup',
        seasonPassY: 'a Season Pass Y',
        seasonPassZ: 'a Permanent Season Pass Z',
        challengeTome2: 'a Permanent Challenge 10 requirement reduction',
        cubeToQuarkAll: 'an overpriced improvement to your quark gain',
        cashGrab2: 'an overpriced cash grab',
        chronometerZ: 'an overpriced chronometer',
        obtainiumEX2: 'an overpriced obtainium extender',
        offeringEX2: 'an overpriced offering extender',
        powderAuto: 'an overpriced powder automation',
        seasonPassLost: 'an overpriced, mysterious relic of the hyperreals'
    }

    return names[input];

}

export const buyShopUpgrades = async (input: ShopUpgradeNames) => {
    let p = true;
    const maxLevel = player.shopUpgrades[input] === shopData[input].maxLevel;
    const canAfford = Number(player.worlds) >= getShopCosts(input);

    if (player.shopConfirmationToggle || !shopData[input].refundable) {
        if (maxLevel) {
            await Alert('You can\'t purchase ' + friendlyShopName(input) + ' because you already have the max level!')
        } else if (!canAfford) {
            await Alert('You can\'t purchase ' + friendlyShopName(input) + ' because you don\'t have enough Quarks!')
        } else {
            let noRefunds = '';
            if (!shopData[input].refundable) {
                noRefunds = ' REMINDER: No refunds!'
            }
            p = await Confirm('Are you sure you\'d like to purchase ' + friendlyShopName(input) + ' for ' + format(getShopCosts(input)) + ' Quarks? Press \'OK\' to finalize purchase.' + noRefunds);
        }
    }

    if (p) {
        if (player.shopBuyMaxToggle) {
            //Can't use canAfford and maxLevel here because player's quarks change and shop levels change during loop
            while (Number(player.worlds) >= getShopCosts(input) && player.shopUpgrades[input] < shopData[input].maxLevel) {
                player.worlds.sub(getShopCosts(input));
                player.shopUpgrades[input] += 1
            }
        } else {
            if (canAfford && !maxLevel) {
                player.worlds.sub(getShopCosts(input));
                player.shopUpgrades[input] += 1
            }
        }
    }
    revealStuff();
}

export const useConsumable = async (input: ShopUpgradeNames) => {
    const p = player.shopConfirmationToggle
        ? await Confirm('Would you like to use some of this potion?')
        : true;

    if (p) {
        const multiplier = +player.singularityUpgrades.potionBuff.getEffect().bonus;
        if (input === 'offeringPotion') {
            if (player.shopUpgrades.offeringPotion > 0) {
                player.shopUpgrades.offeringPotion -= 1;
                player.runeshards += Math.floor(7200 * player.offeringpersecond * calculateTimeAcceleration() * multiplier)
                player.runeshards = Math.min(1e300, player.runeshards)
            }
        } else if (input === 'obtainiumPotion') {
            if (player.shopUpgrades.obtainiumPotion > 0) {
                player.shopUpgrades.obtainiumPotion -= 1;
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
        player.worlds.sub(15);

        for (const shopItem in shopData){
            const key = shopItem as keyof typeof shopData;
            if (shopData[key].refundable && player.shopUpgrades[key] > shopData[key].refundMinimumLevel){

                if (shopData[key].tier === 'Reincarnation' && player.singularityCount >= 20) {
                    continue;
                }
                // Determines how many quarks one would not be refunded, based on minimum refund level
                const doNotRefund = shopData[key].price * shopData[key].refundMinimumLevel +
                                shopData[key].priceIncrease * (shopData[key].refundMinimumLevel) * (shopData[key].refundMinimumLevel - 1) / 2;

                //Refunds Quarks based on the shop level and price vals
                player.worlds.add(
                    shopData[key].price * player.shopUpgrades[key] +
                    shopData[key].priceIncrease * (player.shopUpgrades[key]) * (player.shopUpgrades[key] - 1) / 2
                    - doNotRefund,
                    false
                );

                player.shopUpgrades[key] = shopData[key].refundMinimumLevel;
            }
        }
        player.quarksThisSingularity = singularityQuarks;
    }
    /*if (p && player.worlds >= 15) {
        player.worlds -= 15;
        Object.keys(shopData).forEach(function)
        revealStuff();
    }*/
}

export const getQuarkInvestment = (upgrade: ShopUpgradeNames) => {
    if (!(upgrade in shopData) || !(upgrade in player.shopUpgrades)) {
        return 0;
    }

    const val = shopData[upgrade].price * player.shopUpgrades[upgrade] +
                shopData[upgrade].priceIncrease * (player.shopUpgrades[upgrade] - 1) * (player.shopUpgrades[upgrade]) / 2

    return val;
}