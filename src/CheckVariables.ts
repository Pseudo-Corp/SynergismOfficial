import { player, format, resetCheck, isTesting, blankSave} from './Synergism';
import { Player } from './types/Synergism';
import Decimal from 'break_infinity.js';
import { calculateMaxRunes, calculateTimeAcceleration } from './Calculate';
import { buyResearch } from './Research';
import { c15RewardUpdate } from './Statistics';
import { LegacyShopUpgrades } from './types/LegacySynergism';
import { padArray } from './Utility';

/**
 * Given player data, it checks, on load if variables are undefined
 * or set incorrectly, and corrects it. This should be where all new
 * variable declarations for `player` should go!
 * @param data 
 */
export const checkVariablesOnLoad = (data: Player) => {
    if (player.currentChallenge.transcension === undefined) {
        player.currentChallenge = {
            transcension: 0,
            reincarnation: 0,
            ascension: 0,
        }
    }

    // backwards compatibility for v1.0101 (and possibly older) saves
    if (!Array.isArray(data.challengecompletions)) {
        player.challengecompletions = Object.values(data.challengecompletions);
        padArray(player.challengecompletions, 0, blankSave.challengecompletions.length);
    }

    // backwards compatibility for v1.0101 (and possibly older) saves
    if (!Array.isArray(data.highestchallengecompletions)) {
        // if highestchallengecompletions is every added onto, this will need to be padded.
        player.highestchallengecompletions = Object.values(data.highestchallengecompletions);
    }

    if (data.wowCubes === undefined) {
        player.wowCubes = 0;
        player.wowTesseracts = 0;
        player.wowHypercubes = 0;
        player.cubeUpgrades = [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
    if (data.shoptoggles.reincarnate === undefined) {
        player.shoptoggles.reincarnate = true
    }
    if (data.ascendBuilding1 === undefined) {
        player.ascendBuilding1 = {
            cost: 1,
            owned: 0,
            generated: new Decimal("0"),
            multiplier: 0.01
        }
        player.ascendBuilding2 = {
            cost: 10,
            owned: 0,
            generated: new Decimal("0"),
            multiplier: 0.01
        }
        player.ascendBuilding3 = {
            cost: 100,
            owned: 0,
            generated: new Decimal("0"),
            multiplier: 0.01
        }
        player.ascendBuilding4 = {
            cost: 1000,
            owned: 0,
            generated: new Decimal("0"),
            multiplier: 0.01
        }
        player.ascendBuilding5 = {
            cost: 10000,
            owned: 0,
            generated: new Decimal("0"),
            multiplier: 0.01
        }
    }
    if (data.tesseractbuyamount === undefined) {
        player.tesseractbuyamount = 1
    }
    if (data.tesseractBlessings === undefined) {
        player.tesseractBlessings = {
            accelerator: 0,
            multiplier: 0,
            offering: 0,
            runeExp: 0,
            obtainium: 0,
            antSpeed: 0,
            antSacrifice: 0,
            antELO: 0,
            talismanBonus: 0,
            globalSpeed: 0
        }
        player.hypercubeBlessings = {
            accelerator: 0,
            multiplier: 0,
            offering: 0,
            runeExp: 0,
            obtainium: 0,
            antSpeed: 0,
            antSacrifice: 0,
            antELO: 0,
            talismanBonus: 0,
            globalSpeed: 0
        }
    }
    if (data.prototypeCorruptions === undefined) {
        player.prototypeCorruptions = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        player.usedCorruptions = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
    if (data.constantUpgrades === undefined) {
        player.ascendShards = new Decimal("0")
        player.constantUpgrades = [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
    if (data.roombaResearchIndex === undefined) {
        player.roombaResearchIndex = 0;
    }
    if (data.history === undefined) {
        player.history = { ants: [], ascend: [], reset: [] };
        player.historyCountMax = 10;
    }
    if (data.autoChallengeRunning === undefined) {
        player.autoChallengeRunning = false
        player.autoChallengeIndex = 1
        player.autoChallengeToggles = [false, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false]
        player.autoChallengeStartExponent = 10
        player.autoChallengeTimer = {
            start: 10,
            exit: 2,
            enter: 2
        }
    }
    if (data.autoAscend === undefined) {
        player.autoAscend = false;
        player.autoAscendMode = "c10Completions";
        player.autoAscendThreshold = 1;
    }
    if (data.runeBlessingLevels === undefined) {
        player.runeBlessingLevels = [0, 0, 0, 0, 0, 0];
        player.runeSpiritLevels = [0, 0, 0, 0, 0, 0];
        player.runeBlessingBuyAmount = 0;
        player.runeSpiritBuyAmount = 0;
    }

    if (player.researches[180] > 1) {
        player.researches[180] = 1;
    }

    if (data.autoTesseracts === undefined) {
        player.autoTesseracts = [false, false, false, false, false, false]
    }

    if (player.prototypeCorruptions[0] === null || player.prototypeCorruptions[0] === undefined) {
        player.usedCorruptions = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        player.prototypeCorruptions = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
    if (player.corruptionLoadouts === undefined) {
        player.corruptionLoadouts = {
            1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        };
        player.corruptionShowStats = true
    }

    for (let i = 0; i <= 4; i++) {
        if (player.runelevels[i] > calculateMaxRunes(i + 1)) {
            player.runelevels[i] = 0
        }
    }

    if (data.shopUpgrades?.challengeExtension === undefined) {
        player.shopUpgrades.challengeExtension = 0;
        player.shopUpgrades.challengeTome = 0;
        player.shopUpgrades.seasonPass = 0;
        player.shopUpgrades.cubeToQuark = 0;
        player.shopUpgrades.tesseractToQuark = 0;
        player.shopUpgrades.hypercubeToQuark = 0;
    }
    if (data.cubeUpgrades === undefined || data.cubeUpgrades[19] === 0 || player.cubeUpgrades[19] === 0) {
        for (let i = 121; i <= 125; i++) {
            player.upgrades[i] = 0
        }
    }

    // assign the save's toggles to the player toggles
    // will overwrite player.toggles keys that exist on both objects,
    // but new keys will default to the values on the player object
    Object.assign(player.toggles, data.toggles);
    
    if (data.ascensionCount === 0) {
        player.toggles[31] = true;
        player.toggles[32] = true;
    }

    if (data.dayCheck === undefined) {
        player.dayCheck = null;
        player.dayTimer = 0;
        player.cubeQuarkDaily = 0;
        player.tesseractQuarkDaily = 0;
        player.hypercubeQuarkDaily = 0;
        player.cubeOpenedDaily = 0;
        player.tesseractOpenedDaily = 0;
        player.hypercubeOpenedDaily = 0;
    }
    if (data.loadedOct4Hotfix === undefined || player.loadedOct4Hotfix === false) {
        player.loadedOct4Hotfix = true;
        // Only process refund if the save's researches array is already updated to v2
        if (player.researches.length > 200) {
            player.researchPoints += player.researches[200] * 1e56;
            player.researches[200] = 0;
            buyResearch(200, true, 0.01);
            console.log('Refunded 8x25, and gave you ' + format(player.researches[200]) + ' levels of new cost 8x25. Sorry!')
            player.researchPoints += player.researches[195] * 1e60;
            player.worlds += 250 * player.researches[195]
            player.researches[195] = 0;
            console.log('Refunded 8x20 and gave 250 quarks for each level you had prior to loading up the game.')
            player.wowCubes += player.cubeUpgrades[50] * 5e10
            player.cubeUpgrades[50] = 0
            console.log('Refunded w5x10. Enjoy!')
        }
    }

    if (player.ascStatToggles === undefined || data.ascStatToggles === undefined) {
        player.ascStatToggles = {
            1: false,
            2: false,
            3: false,
            4: false
        };
    }
    if (player.ascStatToggles[4] === undefined || !('ascStatToggles' in data) || data.ascStatToggles[4] === undefined) {
        player.ascStatToggles[4] = false;
    }

    if (player.usedCorruptions[0] > 0 ||
        (Array.isArray(data.usedCorruptions) && data.usedCorruptions[0] > 0)) {
        player.prototypeCorruptions[0] = 0
        player.usedCorruptions[0] = 0
    }
    if (player.antSacrificeTimerReal === undefined) {
        player.antSacrificeTimerReal = player.antSacrificeTimer / calculateTimeAcceleration();
    }
    if (player.subtabNumber === undefined || data.subtabNumber === undefined) {
        player.subtabNumber = 0;
    }
    if (data.wowPlatonicCubes === undefined) {
        player.wowPlatonicCubes = 0;
        player.wowAbyssals = 0;
    }
    if (data.platonicBlessings === undefined) {
        const ascCount = player.ascensionCount
        if (player.currentChallenge.ascension !== 0 && player.currentChallenge.ascension !== 15) {
            resetCheck('ascensionChallenge', false, true);
        }
        if (player.currentChallenge.ascension === 15) {
            resetCheck('ascensionChallenge', false, true);
            player.challenge15Exponent = 0;
            c15RewardUpdate();
        }
        player.ascensionCount = ascCount
        player.challengecompletions[15] = 0;
        player.highestchallengecompletions[15] = 0;
        player.platonicBlessings = {
            cubes: 0,
            tesseracts: 0,
            hypercubes: 0,
            platonics: 0,
            hypercubeBonus: 0,
            taxes: 0,
            scoreBonus: 0,
            globalSpeed: 0,
        }
        player.platonicUpgrades = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        player.challenge15Exponent = 0
        player.loadedNov13Vers = false;
    }
    if (player.researches.includes(null)) { // Makes sure any nulls in the research array are fixed
        for (let i = 0; i < 200; i++) {
            player.researches[i + 1] = player.researches[i + 1] || 0;
        }
    }
    if (data.loadedDec16Vers === false || data.loadedDec16Vers === undefined){
        if (player.currentChallenge.ascension === 15) {
            resetCheck('ascensionChallenge', false, true);
            player.challenge15Exponent = 0;
            c15RewardUpdate();
        }
        player.challenge15Exponent = 0;
        c15RewardUpdate();
        player.loadedDec16Vers = true;
    }

    // in old versions of the game (pre 2.5.0), the import function will only work
    // if this variable = "YES!". Don't ask Platonic why.
    if (typeof data.exporttest === 'string') {
        player.exporttest = !isTesting;
    }

    const shop = data.shopUpgrades as LegacyShopUpgrades | Player['shopUpgrades'];
    if (shop && 'offeringTimerLevel' in shop && typeof shop.offeringTimerLevel !== 'undefined') {
        player.shopUpgrades = {
            offeringPotion: shop.offeringPotion,
            obtainiumPotion: shop.obtainiumPotion,
            offeringEX: 0,
            offeringAuto: 0,
            obtainiumEX: 0,
            obtainiumAuto: Number(shop.obtainiumAutoLevel),
            instantChallenge: Number(shop.instantChallengeBought),
            antSpeed: 0,
            cashGrab: 0,
            shopTalisman: Number(shop.talismanBought),
            seasonPass: 0,
            challengeExtension: shop.challengeExtension,
            challengeTome: 0, // This was shop.challenge10Tomes
            cubeToQuark: Number(shop.cubeToQuarkBought),
            tesseractToQuark: Number(shop.tesseractToQuarkBought),
            hypercubeToQuark: Number(shop.hypercubeToQuarkBought),
        }

        const initialQuarks = player.worlds;

        player.worlds += 150 * shop.offeringTimerLevel + 25/2 * (shop.offeringTimerLevel - 1) * (shop.offeringTimerLevel);
        player.worlds += 150 * shop.obtainiumTimerLevel + 25/2 * (shop.obtainiumTimerLevel - 1) * (shop.obtainiumTimerLevel);
        player.worlds += 150 * shop.offeringAutoLevel + 25/2 * (shop.offeringAutoLevel - 1) * (shop.offeringAutoLevel);
        player.worlds += 150 * shop.obtainiumAutoLevel + 25/2 * (shop.obtainiumAutoLevel - 1) * (shop.obtainiumAutoLevel);
        player.worlds += 100 * shop.cashGrabLevel + 100/2 * (shop.cashGrabLevel - 1) * (shop.cashGrabLevel);
        player.worlds += 200 * shop.antSpeedLevel + 80/2 * (shop.antSpeedLevel - 1) * (shop.antSpeedLevel);
        player.worlds += typeof shop.seasonPass === 'number' 
            ? 500 * shop.seasonPass + 250/2 * (shop.seasonPass - 1) * shop.seasonPass
            : 500 * shop.seasonPassLevel + 250/2 * (shop.seasonPassLevel - 1) * shop.seasonPassLevel;

        console.log('Because of the v2.5.0 update, you have been refunded ' + format(player.worlds - initialQuarks) + ' Quarks! If this appears wrong let Platonic know :)')
    }
}