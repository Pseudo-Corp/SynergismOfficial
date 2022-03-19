import { player, format, resetCheck, blankSave} from './Synergism';
import { testing } from './Config';
import { Player } from './types/Synergism';
import Decimal from 'break_infinity.js';
import { calculateMaxRunes, calculateTimeAcceleration } from './Calculate';
import { buyResearch } from './Research';
import { c15RewardUpdate } from './Statistics';
import { LegacyShopUpgrades } from './types/LegacySynergism';
import { padArray } from './Utility';
import { AbyssHepteract, AcceleratorBoostHepteract, AcceleratorHepteract, ChallengeHepteract, ChronosHepteract, createHepteract, HyperrealismHepteract, MultiplierHepteract, QuarkHepteract } from './Hepteracts';
import { WowCubes, WowHypercubes, WowPlatonicCubes, WowTesseracts } from './CubeExperimental';
import { Alert } from './UpdateHTML';
import { getQuarkInvestment, shopData} from './Shop';

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

    data.shopUpgrades ??= { ...blankSave.shopUpgrades };
    data.ascStatToggles ??= { ...blankSave.ascStatToggles };

    if (typeof data.promoCodeTiming === 'object') {
        for (const key of Object.keys(data.promoCodeTiming)) {
            const k = key as keyof typeof data.promoCodeTiming;
            player.promoCodeTiming[k] = data.promoCodeTiming[k];
        }
    } else {
        player.promoCodeTiming.time = Date.now() - (60 * 1000 * 15);
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
        player.wowCubes = new WowCubes();
        player.wowTesseracts = new WowTesseracts(0);
        player.wowHypercubes = new WowHypercubes(0);
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

    if (data.autoTesseracts === undefined) {
        player.autoTesseracts = [false, false, false, false, false, false]
    }

    if (player.prototypeCorruptions[0] === null || player.prototypeCorruptions[0] === undefined) {
        player.usedCorruptions = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        player.prototypeCorruptions = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }

    if (player.corruptionLoadouts === undefined) {
        player.corruptionLoadouts = { ...blankSave.corruptionLoadouts };
        player.corruptionShowStats = true
    } else if (Object.keys(player.corruptionLoadouts).length !== Object.keys(blankSave.corruptionLoadouts).length) {
        for (const key of Object.keys(blankSave.corruptionLoadouts)) {
            if (player.corruptionLoadouts[Number(key)]) continue;
            player.corruptionLoadouts[Number(key)] = blankSave.corruptionLoadouts[Number(key)];
        }
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
            player.worlds.add(250 * player.researches[195]);
            player.researches[195] = 0;
            console.log('Refunded 8x20 and gave 250 quarks for each level you had prior to loading up the game.')
            player.wowCubes.add(player.cubeUpgrades[50] * 5e10);
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
        player.wowPlatonicCubes = new WowPlatonicCubes(0);
        player.wowAbyssals = 0;
    }
    if (data.platonicBlessings === undefined) {
        const ascCount = player.ascensionCount
        if (player.currentChallenge.ascension !== 0 && player.currentChallenge.ascension !== 15) {
            void resetCheck('ascensionChallenge', false, true);
        }
        if (player.currentChallenge.ascension === 15) {
            void resetCheck('ascensionChallenge', false, true);
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
            void resetCheck('ascensionChallenge', false, true);
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
        player.exporttest = !testing;
    } else {
        player.exporttest = data.exporttest;
    }

    const shop = data.shopUpgrades as LegacyShopUpgrades | Player['shopUpgrades'];
    if (shop && 'offeringTimerLevel' in shop) {
        player.shopUpgrades = {
            offeringPotion: shop.offeringPotion,
            obtainiumPotion: shop.obtainiumPotion,
            offeringEX: 0,
            offeringAuto: Math.min(1, Number(shop.offeringAutoLevel)),
            obtainiumEX: 0,
            obtainiumAuto: Math.min(1, Number(shop.obtainiumAutoLevel)), //Number(shop.obtainiumAutoLevel),
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
            seasonPass2: 0,
            seasonPass3: 0,
            chronometer: 0,
            infiniteAscent: 0,
            calculator: 0,
            calculator2: 0,
            calculator3: 0,
            constantEX: 0,
            powderEX: 0,
            chronometer2: 0,
            chronometer3: 0,
            seasonPassY: 0,
            seasonPassZ: 0,
            challengeTome2: 0,
        }

        const initialQuarks = Number(player.worlds);

        player.worlds.add(150 * shop.offeringTimerLevel + 25/2 * (shop.offeringTimerLevel - 1) * shop.offeringTimerLevel, false);
        player.worlds.add(150 * shop.obtainiumTimerLevel + 25/2 * (shop.obtainiumTimerLevel - 1) * shop.obtainiumTimerLevel, false);
        player.worlds.add(150 * shop.offeringAutoLevel + 25/2 * (shop.offeringAutoLevel - 1) * shop.offeringAutoLevel - 150 * Math.min(1, shop.offeringAutoLevel), false);
        player.worlds.add(150 * shop.obtainiumAutoLevel + 25/2 * (shop.obtainiumAutoLevel - 1) * shop.obtainiumAutoLevel - 150 * Math.min(1, shop.obtainiumAutoLevel), false);
        player.worlds.add(100 * shop.cashGrabLevel + 100/2 * (shop.cashGrabLevel - 1) * shop.cashGrabLevel, false);
        player.worlds.add(200 * shop.antSpeedLevel + 80/2 * (shop.antSpeedLevel - 1) * shop.antSpeedLevel, false);
        player.worlds.add(500 * shop.challenge10Tomes + 250/2 * (shop.challenge10Tomes - 1) * (shop.challenge10Tomes), false);
        player.worlds.add(
            typeof shop.seasonPass === 'number' 
                ? 500 * shop.seasonPass + 250/2 * (shop.seasonPass - 1) * shop.seasonPass
                : 500 * shop.seasonPassLevel + 250/2 * (shop.seasonPassLevel - 1) * shop.seasonPassLevel,
            false
        );

        console.log('Because of the v2.5.0 update, you have been refunded ' + format(+player.worlds - +initialQuarks) + ' Quarks! If this appears wrong let Platonic know :)')
    }

    if (player.shopUpgrades.seasonPass2 === undefined) {
        player.shopUpgrades.seasonPass2 = 0;
        player.shopUpgrades.seasonPass3 = 0;
        player.shopUpgrades.chronometer = 0;
        player.shopUpgrades.infiniteAscent = 0;
    }

    if (player.runeexp[5] === undefined) {
        player.runeexp[5] = player.runeexp[6] = 0;
        player.runelevels[5] = player.runelevels[6] = 0;
    }

    // resets all hepteract values on the player object
    player.hepteractCrafts = {
        chronos: ChronosHepteract,
        hyperrealism: HyperrealismHepteract,
        quark: QuarkHepteract,
        challenge: ChallengeHepteract,
        abyss: AbyssHepteract,
        accelerator: AcceleratorHepteract,
        acceleratorBoost: AcceleratorBoostHepteract,
        multiplier: MultiplierHepteract
    }

    // if the player has hepteracts, we need to overwrite the player values
    // with the ones the save has.
    if (data.hepteractCrafts !== undefined) {
        for (const item in blankSave.hepteractCrafts) {
            const k = item as keyof Player['hepteractCrafts'];
            // if more crafts are added, some keys might not exist in the save
            if (data.hepteractCrafts[k])
                player.hepteractCrafts[k] = createHepteract(data.hepteractCrafts[k]);
        }
    }

    if (data.platonicCubeOpenedDaily === undefined) {
        player.platonicCubeOpenedDaily = 0;
        player.platonicCubeQuarkDaily = 0;
    }

    if (data.shopUpgrades.calculator === undefined) {
        player.shopUpgrades.calculator = 0;
        player.shopUpgrades.calculator2 = 0;
        player.shopUpgrades.calculator3 = 0;
        player.shopUpgrades.constantEX = 0;
    }

    while (player.achievements[280] === undefined) {
        player.achievements.push(0)
    }
    
    if (data.overfluxOrbs === undefined) {
        player.overfluxOrbs = 0;
    } 
    if (data.overfluxPowder === undefined) {
        player.overfluxPowder = 0;
        player.shopUpgrades.powderEX = 0;
        player.dailyPowderResetUses = 1;
    }

    if (data.ascStatToggles[5] === undefined) {
        player.ascStatToggles[5] = false;
    }

    while (player.platonicUpgrades[20] === undefined) {
        player.platonicUpgrades.push(0)
    }

    if (data.loadedV253 === undefined) {
        player.loadedV253 = true;
        player.worlds.add(10000 * player.shopUpgrades.calculator + 10000 / 2 * (player.shopUpgrades.calculator - 1) * (player.shopUpgrades.calculator), false);
        player.worlds.add(10000 * player.shopUpgrades.calculator2 + 5000 / 2 * (player.shopUpgrades.calculator2 - 1) * (player.shopUpgrades.calculator2), false);
        player.worlds.add(25000 * player.shopUpgrades.calculator3 + 25000 / 2 * (player.shopUpgrades.calculator3 - 1) * (player.shopUpgrades.calculator3), false);
        player.shopUpgrades.calculator = 0;
        player.shopUpgrades.calculator2 = 0;
        player.shopUpgrades.calculator3 = 0;
        player.wowAbyssals += 1e8 * player.platonicUpgrades[16] // Refund based off of abyss hepteracts spent
        void Alert('June 28, 2021: V2.5.3. You have been refunded quarks from calculators if you purchased them. They are no longer refundable so be wary!')
    }

    if (data.loadedV255 === undefined) {
        player.loadedV255 = true;
        player.worlds.add(1000 * player.shopUpgrades.powderEX + 1000 / 2 * (player.shopUpgrades.powderEX - 1) * (player.shopUpgrades.powderEX), false);
        player.shopUpgrades.powderEX = 0;
        void Alert('July 2, 2021: V2.5.5. You have been refunded quarks from Powder EX upgrade, if you purchased levels. Your T1 ants were also reset and base cost set to 1e700 particles. Powder EX is no longer refundable, though, so be careful!')
        player.firstCostAnts = new Decimal('1e700')
        player.firstOwnedAnts = 0;
    }

    if (data.autoResearchMode === undefined) {
        player.autoResearchMode = 'manual';
    }

    if (data.singularityCount === undefined) {
        player.singularityCount = 0;
        player.goldenQuarks = 0;

        player.quarksThisSingularity = 0
        player.quarksThisSingularity += +player.worlds
        const keys = Object.keys(player.shopUpgrades) as (keyof Player['shopUpgrades'])[]
        for (const key of keys) {
            player.quarksThisSingularity += getQuarkInvestment(key)
        }
    }

    // Update (read: check) for undefined shop upgrades. Also checks above max level.
    const shopKeys = Object.keys(blankSave['shopUpgrades']) as (keyof Player['shopUpgrades'])[];
    for (const shopUpgrade of shopKeys) {
        if (player.shopUpgrades[shopUpgrade] === undefined) {
            player.shopUpgrades[shopUpgrade] = 0;
        }
        if (player.shopUpgrades[shopUpgrade] > shopData[shopUpgrade].maxLevel) {
            player.shopUpgrades[shopUpgrade] = shopData[shopUpgrade].maxLevel
        }
    }

    if (data.dailyCodeUsed === undefined) {
        player.dailyCodeUsed = false;
    }
}
