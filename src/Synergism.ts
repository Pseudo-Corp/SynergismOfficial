import Decimal from 'break_infinity.js';
import LZString from 'lz-string';

import { isDecimal, getElementById, sortWithIndeces, sumContents } from './Utility';
import { blankGlobals, Globals as G } from './Variables';
import { CalcECC, getChallengeConditions, challengeDisplay, highestChallengeRewards, challengeRequirement, runChallengeSweep, getMaxChallenges } from './Challenges';

import type { Player } from './types/Synergism';
import { upgradeupdate, getConstUpgradeMetadata, buyConstantUpgrades } from './Upgrades';
import { updateResearchBG, maxRoombaResearchIndex, buyResearch } from './Research';
import { updateChallengeDisplay, revealStuff, showCorruptionStatsLoadouts, CSSAscend, CSSRuneBlessings, updateAchievementBG, updateChallengeLevel, buttoncolorchange, htmlInserts, hideStuff, changeTabColor, Confirm, Alert } from './UpdateHTML';
import { calculateHypercubeBlessings } from './Hypercubes';
import { calculateTesseractBlessings } from './Tesseracts';
import { calculateCubeBlessings, calculateObtainium, calculateAnts, calculateRuneLevels, calculateOffline, calculateSigmoidExponential, calculateCorruptionPoints, calculateTotalCoinOwned, calculateTotalAcceleratorBoost, dailyResetCheck, calculateOfferings, calculateAcceleratorMultiplier, calculateTimeAcceleration } from './Calculate';
import { updateTalismanAppearance, toggleTalismanBuy, updateTalismanInventory, buyTalismanEnhance, buyTalismanLevels } from './Talismans';
import { toggleAscStatPerSecond, toggleAntMaxBuy, toggleAntAutoSacrifice, toggleChallenges, keyboardTabChange, toggleauto } from './Toggles';
import { c15RewardUpdate } from './Statistics';
import { resetHistoryRenderAllTables } from './History';
import { calculatePlatonicBlessings } from './PlatonicCubes';
import { antSacrificePointsToMultiplier, autoBuyAnts, sacrificeAnts, calculateCrumbToCoinExp } from './Ants';
import { calculatetax } from './Tax';
import { ascensionAchievementCheck, challengeachievementcheck, achievementaward, resetachievementcheck, buildingAchievementCheck } from './Achievements';
import { reset } from './Reset';
import { buyMax, buyAccelerator, buyMultiplier, boostAccelerator, buyCrystalUpgrades, buyParticleBuilding, getReductionValue, getCost, buyRuneBonusLevels, buyTesseractBuilding, getTesseractCost } from './Buy';
import { autoUpgrades } from './Automation';
import { redeemShards } from './Runes';
import { updateCubeUpgradeBG } from './Cubes';
import { corruptionLoadoutTableUpdate, corruptionButtonsAdd, corruptionLoadoutTableCreate } from './Corruptions';
import { generateEventHandlers } from './EventListeners';
import * as Plugins from './Plugins/Plugins';
import { addTimers, automaticTools } from './Helper';
//import { LegacyShopUpgrades } from './types/LegacySynergism';

import './Logger';
import { checkVariablesOnLoad } from './CheckVariables';

/**
 * Whether or not the current version is a testing version or a main version.
 * This should be detected when importing a file.
 */
export const isTesting = true;

export const intervalHold = new Set<ReturnType<typeof setInterval>>();
export const interval = new Proxy(setInterval, {
    apply(target, thisArg, args) {
        const set = target.apply(thisArg, args);
        intervalHold.add(set);
        return set;
    }
});

export const clearInt = new Proxy(clearInterval, {
    apply(target, thisArg, args) {
        const id = args[0] as ReturnType<typeof setInterval>;
        if (intervalHold.has(id))
            intervalHold.delete(id);

        return target.apply(thisArg, args);
    }
});

export const player: Player = {
    worlds: 0,
    coins: new Decimal("1e2"),
    coinsThisPrestige: new Decimal("1e2"),
    coinsThisTranscension: new Decimal("1e2"),
    coinsThisReincarnation: new Decimal("1e2"),
    coinsTotal: new Decimal("100"),

    firstOwnedCoin: 0,
    firstGeneratedCoin: new Decimal("0"),
    firstCostCoin: new Decimal("100"),
    firstProduceCoin: 0.25,

    secondOwnedCoin: 0,
    secondGeneratedCoin: new Decimal("0"),
    secondCostCoin: new Decimal("2e3"),
    secondProduceCoin: 2.5,

    thirdOwnedCoin: 0,
    thirdGeneratedCoin: new Decimal("0"),
    thirdCostCoin: new Decimal("4e4"),
    thirdProduceCoin: 25,

    fourthOwnedCoin: 0,
    fourthGeneratedCoin: new Decimal("0"),
    fourthCostCoin: new Decimal("8e5"),
    fourthProduceCoin: 250,

    fifthOwnedCoin: 0,
    fifthGeneratedCoin: new Decimal("0"),
    fifthCostCoin: new Decimal("16e6"),
    fifthProduceCoin: 2500,

    firstOwnedDiamonds: 0,
    firstGeneratedDiamonds: new Decimal("0"),
    firstCostDiamonds: new Decimal("100"),
    firstProduceDiamonds: 0.05,

    secondOwnedDiamonds: 0,
    secondGeneratedDiamonds: new Decimal("0"),
    secondCostDiamonds: new Decimal("1e5"),
    secondProduceDiamonds: 0.0005,

    thirdOwnedDiamonds: 0,
    thirdGeneratedDiamonds: new Decimal("0"),
    thirdCostDiamonds: new Decimal("1e15"),
    thirdProduceDiamonds: 0.00005,

    fourthOwnedDiamonds: 0,
    fourthGeneratedDiamonds: new Decimal("0"),
    fourthCostDiamonds: new Decimal("1e40"),
    fourthProduceDiamonds: 0.000005,

    fifthOwnedDiamonds: 0,
    fifthGeneratedDiamonds: new Decimal("0"),
    fifthCostDiamonds: new Decimal("1e100"),
    fifthProduceDiamonds: 0.000005,

    firstOwnedMythos: 0,
    firstGeneratedMythos: new Decimal("0"),
    firstCostMythos: new Decimal("1"),
    firstProduceMythos: 1,

    secondOwnedMythos: 0,
    secondGeneratedMythos: new Decimal("0"),
    secondCostMythos: new Decimal("100"),
    secondProduceMythos: 0.01,

    thirdOwnedMythos: 0,
    thirdGeneratedMythos: new Decimal("0"),
    thirdCostMythos: new Decimal("1e4"),
    thirdProduceMythos: 0.001,

    fourthOwnedMythos: 0,
    fourthGeneratedMythos: new Decimal("0"),
    fourthCostMythos: new Decimal("1e8"),
    fourthProduceMythos: 0.0002,

    fifthOwnedMythos: 0,
    fifthGeneratedMythos: new Decimal("0"),
    fifthCostMythos: new Decimal("1e16"),
    fifthProduceMythos: 0.00004,

    firstOwnedParticles: 0,
    firstGeneratedParticles: new Decimal("0"),
    firstCostParticles: new Decimal("1"),
    firstProduceParticles: .25,

    secondOwnedParticles: 0,
    secondGeneratedParticles: new Decimal("0"),
    secondCostParticles: new Decimal("100"),
    secondProduceParticles: .20,

    thirdOwnedParticles: 0,
    thirdGeneratedParticles: new Decimal("0"),
    thirdCostParticles: new Decimal("1e4"),
    thirdProduceParticles: .15,

    fourthOwnedParticles: 0,
    fourthGeneratedParticles: new Decimal("0"),
    fourthCostParticles: new Decimal("1e8"),
    fourthProduceParticles: .10,

    fifthOwnedParticles: 0,
    fifthGeneratedParticles: new Decimal("0"),
    fifthCostParticles: new Decimal("1e16"),
    fifthProduceParticles: .5,

    firstOwnedAnts: 0,
    firstGeneratedAnts: new Decimal("0"),
    firstCostAnts: new Decimal("1e800"),
    firstProduceAnts: .0001,

    secondOwnedAnts: 0,
    secondGeneratedAnts: new Decimal("0"),
    secondCostAnts: new Decimal("3"),
    secondProduceAnts: .00005,

    thirdOwnedAnts: 0,
    thirdGeneratedAnts: new Decimal("0"),
    thirdCostAnts: new Decimal("100"),
    thirdProduceAnts: .00002,

    fourthOwnedAnts: 0,
    fourthGeneratedAnts: new Decimal("0"),
    fourthCostAnts: new Decimal("1e4"),
    fourthProduceAnts: .00001,

    fifthOwnedAnts: 0,
    fifthGeneratedAnts: new Decimal("0"),
    fifthCostAnts: new Decimal("1e12"),
    fifthProduceAnts: .000005,

    sixthOwnedAnts: 0,
    sixthGeneratedAnts: new Decimal("0"),
    sixthCostAnts: new Decimal("1e36"),
    sixthProduceAnts: .000002,

    seventhOwnedAnts: 0,
    seventhGeneratedAnts: new Decimal("0"),
    seventhCostAnts: new Decimal("1e100"),
    seventhProduceAnts: .000001,

    eighthOwnedAnts: 0,
    eighthGeneratedAnts: new Decimal("0"),
    eighthCostAnts: new Decimal("1e300"),
    eighthProduceAnts: .00000001,

    ascendBuilding1: {
        cost: 1,
        owned: 0,
        generated: new Decimal("0"),
        multiplier: 0.01
    },
    ascendBuilding2: {
        cost: 10,
        owned: 0,
        generated: new Decimal("0"),
        multiplier: 0.01
    },
    ascendBuilding3: {
        cost: 100,
        owned: 0,
        generated: new Decimal("0"),
        multiplier: 0.01
    },
    ascendBuilding4: {
        cost: 1000,
        owned: 0,
        generated: new Decimal("0"),
        multiplier: 0.01
    },
    ascendBuilding5: {
        cost: 10000,
        owned: 0,
        generated: new Decimal("0"),
        multiplier: 0.01
    },

    multiplierCost: new Decimal("1e5"),
    multiplierBought: 0,

    acceleratorCost: new Decimal("500"),
    acceleratorBought: 0,

    acceleratorBoostBought: 0,
    acceleratorBoostCost: new Decimal("1e3"),

    upgrades: Array(141).fill(0),

    prestigeCount: 0,
    transcendCount: 0,
    reincarnationCount: 0,

    prestigePoints: new Decimal("0"),
    transcendPoints: new Decimal("0"),
    reincarnationPoints: new Decimal("0"),

    prestigeShards: new Decimal("0"),
    transcendShards: new Decimal("0"),
    reincarnationShards: new Decimal("0"),

    toggles: {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
        9: false,
        10: false,
        11: false,
        12: false,
        13: false,
        14: false,
        15: false,
        16: false,
        17: false,
        18: false,
        19: false,
        20: false,
        21: false,
        22: false,
        23: false,
        24: false,
        25: false,
        26: false,
        27: false,
        28: true,
        29: true,
        30: true,
        31: true,
        32: true,
        33: false,
    },

    challengecompletions: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    highestchallengecompletions: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    challenge15Exponent: 0,
    highestChallenge15Exponent: 0,

    retrychallenges: false,
    currentChallenge: {
        transcension: 0,
        reincarnation: 0,
        ascension: 0,
    },
    researchPoints: 0,
    obtainiumtimer: 0,
    obtainiumpersecond: 0,
    maxobtainiumpersecond: 0,
    maxobtainium: 0,
    // Ignore the first index. The other 25 are shaped in a 5x5 grid similar to the production appearance
    researches: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

    unlocks: {
        coinone: false,
        cointwo: false,
        cointhree: false,
        coinfour: false,
        prestige: false,
        generation: false,
        transcend: false,
        reincarnate: false,
        rrow1: false,
        rrow2: false,
        rrow3: false,
        rrow4: false
    },
    achievements: Array(253).fill(0),

    achievementPoints: 0,

    prestigenomultiplier: true,
    prestigenoaccelerator: true,
    transcendnomultiplier: true,
    transcendnoaccelerator: true,
    reincarnatenomultiplier: true,
    reincarnatenoaccelerator: true,
    prestigenocoinupgrades: true,
    transcendnocoinupgrades: true,
    transcendnocoinorprestigeupgrades: true,
    reincarnatenocoinupgrades: true,
    reincarnatenocoinorprestigeupgrades: true,
    reincarnatenocoinprestigeortranscendupgrades: true,
    reincarnatenocoinprestigetranscendorgeneratorupgrades: true,

    crystalUpgrades: [0, 0, 0, 0, 0, 0, 0, 0],
    crystalUpgradesCost: [7, 15, 20, 40, 100, 200, 500, 1000],

    runelevels: [1, 1, 1, 1, 1],
    runeexp: [0, 0, 0, 0, 0,],
    runeshards: 0,
    maxofferings: 0,
    offeringpersecond: 0,

    prestigecounter: 0,
    transcendcounter: 0,
    reincarnationcounter: 0,
    offlinetick: 0,

    prestigeamount: 0,
    transcendamount: 0,
    reincarnationamount: 0,

    fastestprestige: 9999999999,
    fastesttranscend: 99999999999,
    fastestreincarnate: 999999999999,

    resettoggle1: 1,
    resettoggle2: 1,
    resettoggle3: 1,

    tesseractAutoBuyerToggle: 0,
    tesseractAutoBuyerAmount: 0,

    coinbuyamount: 1,
    crystalbuyamount: 1,
    mythosbuyamount: 1,
    particlebuyamount: 1,
    offeringbuyamount: 1,
    tesseractbuyamount: 1,


    shoptoggles: {
        coin: true,
        prestige: true,
        transcend: true,
        generators: true,
        reincarnate: true,
    },
    tabnumber: 1,
    subtabNumber: 0,

    // create a Map with keys defaulting to false
    codes: new Map(
        Array.from({ length: 30 }, (_, i) => [i + 1, false])
    ),

    loaded1009: true,
    loaded1009hotfix1: true,
    loaded10091: true,
    loaded1010: true,
    loaded10101: true,

    shopUpgrades: {
        offeringPotion: 1,
        obtainiumPotion: 1,
        offeringEX: 0,
        offeringAuto: 0,
        obtainiumEX: 0,
        obtainiumAuto: 0,
        instantChallenge: 0,
        antSpeed: 0,
        cashGrab: 0,
        shopTalisman: 0,
        seasonPass: 0,
        challengeExtension: 0,
        challengeTome: 0,
        cubeToQuark: 0,
        tesseractToQuark: 0,
        hypercubeToQuark: 0,
    },
    autoSacrificeToggle: false,
    autoFortifyToggle: false,
    autoEnhanceToggle: false,
    autoResearchToggle: false,
    autoResearch: 0,
    autoSacrifice: 0,
    sacrificeTimer: 0,
    quarkstimer: 90000,

    antPoints: new Decimal("1"),
    antUpgrades: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    antSacrificePoints: 0,
    antSacrificeTimer: 900,
    antSacrificeTimerReal: 900,

    talismanLevels: [0, 0, 0, 0, 0, 0, 0],
    talismanRarity: [1, 1, 1, 1, 1, 1, 1],
    talismanOne: [null, -1, 1, 1, 1, -1],
    talismanTwo: [null, 1, 1, -1, -1, 1],
    talismanThree: [null, 1, -1, 1, 1, -1],
    talismanFour: [null, -1, -1, 1, 1, 1],
    talismanFive: [null, 1, 1, -1, -1, 1],
    talismanSix: [null, 1, 1, 1, -1, -1],
    talismanSeven: [null, -1, 1, -1, 1, 1],
    talismanShards: 0,
    commonFragments: 0,
    uncommonFragments: 0,
    rareFragments: 0,
    epicFragments: 0,
    legendaryFragments: 0,
    mythicalFragments: 0,

    buyTalismanShardPercent: 10,

    autoAntSacrifice: false,
    autoAntSacTimer: 900,
    autoAntSacrificeMode: 0,
    antMax: false,

    ascensionCount: 0,
    ascensionCounter: 0,
    cubeUpgrades: [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    platonicUpgrades: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    wowCubes: 0,
    wowTesseracts: 0,
    wowHypercubes: 0,
    wowPlatonicCubes: 0,
    wowAbyssals: 0,
    cubeBlessings: {
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
    },
    tesseractBlessings: {
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
    },
    hypercubeBlessings: {
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
    },
    platonicBlessings: {
        cubes: 0,
        tesseracts: 0,
        hypercubes: 0,
        platonics: 0,
        hypercubeBonus: 0,
        taxes: 0,
        scoreBonus: 0,
        globalSpeed: 0,

    },
    ascendShards: new Decimal("0"),
    autoAscend: false,
    autoAscendMode: "c10Completions",
    autoAscendThreshold: 1,
    roombaResearchIndex: 0,
    ascStatToggles: { // false here means show per second
        1: false,
        2: false,
        3: false,
        4: false
    },

    prototypeCorruptions: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    usedCorruptions: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    corruptionLoadouts: {
        1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    corruptionShowStats: true,

    constantUpgrades: [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    history: { ants: [], ascend: [], reset: [] },
    historyCountMax: 10,
    historyShowPerSecond: false,

    autoChallengeRunning: false,
    autoChallengeIndex: 1,
    autoChallengeToggles: [false, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false],
    autoChallengeStartExponent: 10,
    autoChallengeTimer: {
        start: 10,
        exit: 2,
        enter: 2
    },

    runeBlessingLevels: [0, 0, 0, 0, 0, 0],
    runeSpiritLevels: [0, 0, 0, 0, 0, 0],
    runeBlessingBuyAmount: 0,
    runeSpiritBuyAmount: 0,

    autoTesseracts: [false, false, false, false, false, false],

    saveString: "Synergism-$VERSION$-$TIME$.txt",
    exporttest: false,

    dayCheck: null,
    dayTimer: 0,
    cubeOpenedDaily: 0,
    cubeQuarkDaily: 0,
    tesseractOpenedDaily: 0,
    tesseractQuarkDaily: 0,
    hypercubeOpenedDaily: 0,
    hypercubeQuarkDaily: 0,
    loadedOct4Hotfix: false,
    loadedNov13Vers: true,
    loadedDec16Vers: true,
    version: '2.5.0~alpha-1',
    rngCode: 0
}

export const blankSave = Object.assign({}, player, {
    codes: new Map(Array.from({ length: 31 }, (_, i) => [i + 1, false]))
});

export const saveSynergy = (button?: boolean): void => {
    player.offlinetick = Date.now();
    player.loaded1009 = true;
    player.loaded1009hotfix1 = true;

    // shallow hold, doesn't modify OG object nor is affected by modifications to OG
    const p = Object.assign({}, player, { 
        codes: Array.from(player.codes)
    });

    localStorage.setItem('Synergysave2', btoa(JSON.stringify(p)));

    if (button) {
        const el = document.getElementById('saveinfo');
        el.textContent = 'Game saved successfully!';
        setTimeout(() => el.textContent = '', 4000);
    }
}

export const loadSynergy = (): void => {
    const save = localStorage.getItem("Synergysave2");
    const data = save ? JSON.parse(atob(save)) : null;

    if (isTesting) {
        Object.defineProperty(window, 'player', {
            value: player
        });
    }

    Object.assign(G, { ...blankGlobals });

    if (data) {
        const hasOwnProperty = {}.hasOwnProperty;

        const oldCodesUsed = Array.from(
            { length: 24 }, // old codes only went up to 24
            (_, i) => 'offerpromo' + (i + 1) + 'used'
        );

        // size before loading
        const size = player.codes.size;

        const oldPromoKeys = Object.keys(data).filter(k => k.includes('offerpromo'));
        if (oldPromoKeys.length > 0) {
            oldPromoKeys.forEach(k => {
                const value = data[k];
                const num = +k.replace(/[^\d]/g, '');
                player.codes.set(num, Boolean(value));
            });
        }

        Object.keys(data).forEach(function (prop) {
            if (!hasOwnProperty.call(player, prop)) {
                return;
            }

            if (isDecimal(player[prop])) {
                return (player[prop] = new Decimal(data[prop]));
            } else if (prop === 'codes') {
                return (player.codes = new Map(data[prop]));
            } else if (oldCodesUsed.includes(prop)) {
                return;
            } else if (Array.isArray(data[prop])) {
                // in old savefiles, some arrays may be 1-based instead of 0-based (newer)
                // so if the lengths of the savefile key is greater than that of the player obj
                // it means a key was removed; likely a 1-based index where array[0] was null
                // so we can get rid of it entirely.
                if (player[prop].length < data[prop].length) {
                    return player[prop] = data[prop].slice(data[prop].length - player[prop].length);
                }
            }

            return (player[prop] = data[prop]);
        });
        if (data.offerpromo24used !== undefined) {
            player.codes.set(25, false)
        }

        // sets all non-existent codes to default value false
        if (player.codes.size < size) {
            for (let i = player.codes.size + 1; i <= size; i++) {
                if (!player.codes.has(i)) {
                    player.codes.set(i, false);
                }
            }
        }

        // sets all non-existent codes to default value false
        if (player.codes.size < size) {
            for (let i = player.codes.size + 1; i <= size; i++) {
                if (!player.codes.has(i)) {
                    player.codes.set(i, false);
                }
            }
        }

        if(!('rngCode' in data)) {
            player.rngCode = 0;
        }

        if (data.loaded1009 === undefined || !data.loaded1009) {
            player.loaded1009 = false;
        }
        if (data.loaded1009hotfix1 === undefined || !data.loaded1009hotfix1) {
            player.loaded1009hotfix1 = false;
        }
        if (data.loaded10091 === undefined) {
            player.loaded10091 = false;
        }
        if (data.loaded1010 === undefined) {
            player.loaded1010 = false;
        }
        if (data.loaded10101 === undefined) {
            player.loaded10101 = false;
        }

        //Fix dumb shop stuff
        //First, if shop isn't even defined we just define it as so
        if(data.shopUpgrades === undefined){
            player.shopUpgrades = Object.assign({}, blankSave.shopUpgrades);
        }

        if (player.researches[76] === undefined) {
            player.codes.set(13, false);
            player.researches.push(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
            player.achievements.push(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
            player.maxofferings = player.runeshards;
            player.maxobtainium = player.researchPoints;
            player.researchPoints += 51200 * player.researches[50];
            player.researches[50] = 0;
        }

        player.maxofferings = player.maxofferings || 0;
        player.maxobtainium = player.maxobtainium || 0;
        player.runeshards = player.runeshards || 0;
        player.researchPoints = player.researchPoints || 0;

        if (!data.loaded1009 || data.loaded1009hotfix1 === null || data.shopUpgrades.offeringPotion === undefined) {
            player.firstOwnedParticles = 0;
            player.secondOwnedParticles = 0;
            player.thirdOwnedParticles = 0;
            player.fourthOwnedParticles = 0;
            player.fifthOwnedParticles = 0;
            player.firstCostParticles = new Decimal("1");
            player.secondCostParticles = new Decimal("1e2");
            player.thirdCostParticles = new Decimal("1e4");
            player.fourthCostParticles = new Decimal("1e8");
            player.fifthCostParticles = new Decimal("1e16");
            player.autoSacrificeToggle = false;
            player.autoResearchToggle = false;
            player.autoResearch = 0;
            player.autoSacrifice = 0;
            player.sacrificeTimer = 0;
            player.loaded1009 = true;
            player.codes.set(18, false);
        }
        if (!data.loaded1009hotfix1) {
            player.loaded1009hotfix1 = true;
            player.codes.set(19, true);
            player.firstOwnedParticles = 0;
            player.secondOwnedParticles = 0;
            player.thirdOwnedParticles = 0;
            player.fourthOwnedParticles = 0;
            player.fifthOwnedParticles = 0;
            player.firstCostParticles = new Decimal("1");
            player.secondCostParticles = new Decimal("1e2");
            player.thirdCostParticles = new Decimal("1e4");
            player.fourthCostParticles = new Decimal("1e8");
            player.fifthCostParticles = new Decimal("1e16");
        }
        if (data.loaded10091 === undefined || !data.loaded10091 || player.researches[86] > 100 || player.researches[87] > 100 || player.researches[88] > 100 || player.researches[89] > 100 || player.researches[90] > 10) {
            player.loaded10091 = true;
            player.researchPoints += 7.5e8 * player.researches[82];
            player.researchPoints += 2e8 * player.researches[83];
            player.researchPoints += 4.5e9 * player.researches[84];
            player.researchPoints += 2.5e7 * player.researches[86];
            player.researchPoints += 7.5e7 * player.researches[87];
            player.researchPoints += 3e8 * player.researches[88];
            player.researchPoints += 1e9 * player.researches[89];
            player.researchPoints += 2.5e7 * player.researches[90];
            player.researchPoints += 1e8 * player.researches[91];
            player.researchPoints += 2e9 * player.researches[92];
            player.researchPoints += 9e9 * player.researches[93];
            player.researchPoints += 7.25e10 * player.researches[94];
            player.researches[86] = 0;
            player.researches[87] = 0;
            player.researches[88] = 0;
            player.researches[89] = 0;
            player.researches[90] = 0;
            player.researches[91] = 0;
            player.researches[92] = 0;
        }

        //const shop = data.shopUpgrades as LegacyShopUpgrades & Player['shopUpgrades'];
        if (
            data.achievements[169] === undefined || 
            player.achievements[169] === undefined || 
        //    (shop.antSpeed === undefined && shop.antSpeedLevel === undefined) || 
        //    (shop.antSpeed === undefined && typeof shop.antSpeedLevel === 'undefined') || 
            data.loaded1010 === undefined || 
            data.loaded1010 === false
        ) {
            player.loaded1010 = true;
            player.codes.set(21, false);

            player.firstOwnedAnts = 0;
            player.firstGeneratedAnts = new Decimal("0");
            player.firstCostAnts = new Decimal("1e800");
            player.firstProduceAnts = .0001;

            player.secondOwnedAnts = 0;
            player.secondGeneratedAnts = new Decimal("0");
            player.secondCostAnts = new Decimal("3");
            player.secondProduceAnts = .00005;

            player.thirdOwnedAnts = 0;
            player.thirdGeneratedAnts = new Decimal("0");
            player.thirdCostAnts = new Decimal("100");
            player.thirdProduceAnts = .00002;

            player.fourthOwnedAnts = 0;
            player.fourthGeneratedAnts = new Decimal("0");
            player.fourthCostAnts = new Decimal("1e4");
            player.fourthProduceAnts = .00001;

            player.fifthOwnedAnts = 0;
            player.fifthGeneratedAnts = new Decimal("0");
            player.fifthCostAnts = new Decimal("1e12");
            player.fifthProduceAnts = .000005;

            player.sixthOwnedAnts = 0;
            player.sixthGeneratedAnts = new Decimal("0");
            player.sixthCostAnts = new Decimal("1e36");
            player.sixthProduceAnts = .000002;

            player.seventhOwnedAnts = 0;
            player.seventhGeneratedAnts = new Decimal("0");
            player.seventhCostAnts = new Decimal("1e100");
            player.seventhProduceAnts = .000001;

            player.eighthOwnedAnts = 0;
            player.eighthGeneratedAnts = new Decimal("0");
            player.eighthCostAnts = new Decimal("1e300");
            player.eighthProduceAnts = .00000001;

            player.achievements.push(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
            player.antPoints = new Decimal("1");

            player.upgrades[38] = 0;
            player.upgrades[39] = 0;
            player.upgrades[40] = 0;

            player.upgrades[76] = 0;
            player.upgrades[77] = 0;
            player.upgrades[78] = 0;
            player.upgrades[79] = 0;
            player.upgrades[80] = 0;


        //    player.shopUpgrades.antSpeed = 0;
        //    player.shopUpgrades.shopTalisman = 0;

            player.antUpgrades = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

            player.unlocks.rrow4 = false;
            player.researchPoints += 3e7 * player.researches[50];
            player.researchPoints += 2e9 * player.researches[96];
            player.researchPoints += 5e9 * player.researches[97];
            player.researchPoints += 3e10 * player.researches[98];
            player.researches[50] = 0;
            player.researches[96] = 0;
            player.researches[97] = 0;
            player.researches[98] = 0;
            player.researches.push(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)

            player.talismanLevels = [0, 0, 0, 0, 0, 0, 0];
            player.talismanRarity = [1, 1, 1, 1, 1, 1, 1];

            player.talismanShards = 0;
            player.commonFragments = 0;
            player.uncommonFragments = 0;
            player.rareFragments = 0;
            player.epicFragments = 0;
            player.legendaryFragments = 0;
            player.mythicalFragments = 0;
            player.buyTalismanShardPercent = 10;

            player.talismanOne = [null, -1, 1, 1, 1, -1];
            player.talismanTwo = [null, 1, 1, -1, -1, 1];
            player.talismanThree = [null, 1, -1, 1, 1, -1];
            player.talismanFour = [null, -1, -1, 1, 1, 1];
            player.talismanFive = [null, 1, 1, -1, -1, 1];
            player.talismanSix = [null, 1, 1, 1, -1, -1];
            player.talismanSeven = [null, -1, 1, -1, 1, 1];

            player.antSacrificePoints = 0;
            player.antSacrificeTimer = 0;

            player.obtainiumpersecond = 0;
            player.maxobtainiumpersecond = 0;

        }

        if (data.loaded10101 === undefined || data.loaded10101 === false) {
            player.loaded10101 = true;

            const refundThese = [0, 31, 32, 61, 62, 63, 64, 76, 77, 78, 79, 80,
                81, 98, 104, 105, 106, 107, 108,
                109, 110, 111, 112, 113, 114, 115, 116,
                117, 118, 119, 120, 121, 122, 123, 125];
            const refundReward = [0, 2, 20, 5, 10, 80, 5e3, 1e7, 1e7, 2e7, 3e7, 4e7,
                2e8, 3e10, 1e11, 1e12, 2e11, 1e12, 2e10,
                2e11, 1e12, 2e13, 5e13, 1e14, 2e14, 5e14, 1e15,
                2e15, 1e16, 1e15, 1e16, 1e14, 1e15, 1e15, 1e20];
            for (let i = 1; i < refundThese.length; i++) {
                player.researchPoints += player.researches[refundThese[i]] * refundReward[i]
                player.researches[refundThese[i]] = 0;
            }
            player.autoAntSacrifice = false;
            player.antMax = false;
        }

        if (player.firstOwnedAnts < 1 && player.firstCostAnts.gte("1e1200")) {
            player.firstCostAnts = new Decimal("1e800");
            player.firstOwnedAnts = 0;
        }

        checkVariablesOnLoad(data)
        if (data.ascensionCount === undefined || player.ascensionCount === 0) {
            player.ascensionCount = 0;
            if (player.ascensionCounter === undefined || (player.ascensionCounter === 0 && player.prestigeCount > 0)) {
                player.ascensionCounter = 86400 * 90;
            }
            player.cubeUpgrades = [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            player.wowCubes = 0;
            player.wowTesseracts = 0;
            player.wowHypercubes = 0;
            player.cubeBlessings = {
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
        if (data.autoAntSacTimer === undefined) {
            player.autoAntSacTimer = 900;
        }
        if (data.autoAntSacrificeMode === undefined) {
            player.autoAntSacrificeMode = 0;
        }

        if (player.cubeUpgrades[7] === 0 && player.toggles[22]) {
            for (let i = 22; i <= 26; i++) {
                player.toggles[i] = false
            }
        }

        if (player.transcendCount < 0) {
            player.transcendCount = 0
        }
        if (player.reincarnationCount < 0) {
            player.reincarnationCount = 0;
        }
        if (player.runeshards < 0) {
            player.runeshards = 0;
        }
        if (player.researchPoints < 0) {
            player.researchPoints = 0;
        }

        if (player.resettoggle1 === 0) {
            player.resettoggle1 = 1;
            player.resettoggle2 = 1;
            player.resettoggle3 = 1;
        }
        if (player.tesseractAutoBuyerToggle === 0) {
            player.tesseractAutoBuyerToggle = 1;
        }
        if (player.reincarnationCount < 0.5 && player.unlocks.rrow4 === true) {
            player.unlocks = {
                coinone: false,
                cointwo: false,
                cointhree: false,
                coinfour: false,
                prestige: false,
                generation: false,
                transcend: false,
                reincarnate: false,
                rrow1: false,
                rrow2: false,
                rrow3: false,
                rrow4: false
            }
        }

        if (data.history === undefined || player.history === undefined) {
            player.history = { ants: [], ascend: [], reset: [] };
        }
        if (data.historyShowPerSecond === undefined || player.historyShowPerSecond === undefined) {
            player.historyShowPerSecond = false;
            player.historyCountMax = 10;
        }

        if (!Number.isInteger(player.ascendBuilding1.cost)) {
            player.ascendBuilding1.cost = 1;
            player.ascendBuilding1.owned = 0;
            player.ascendBuilding2.cost = 10;
            player.ascendBuilding2.owned = 0;
            player.ascendBuilding3.cost = 100;
            player.ascendBuilding3.owned = 0;
            player.ascendBuilding4.cost = 1000;
            player.ascendBuilding4.owned = 0;
            player.ascendBuilding5.cost = 10000;
            player.ascendBuilding5.owned = 0;
        }

        if (!player.dayCheck) {
            player.dayCheck = new Date(player.dayCheck)
        }

        for (let i = 1; i <= 5; i++) {
            player['ascendBuilding' + i].generated = new Decimal(player['ascendBuilding' + i].generated)
        }

        while (player.achievements[252] === undefined) {
            player.achievements.push(0)
        }
        while (player.researches[200] === undefined) {
            player.researches.push(0)
        }
        while (player.upgrades[140] === undefined) {
            player.upgrades.push(0)
        }


        if (player.saveString === undefined || player.saveString === "" || player.saveString === "Synergism-v1011Test.txt") {
            player.saveString = "Synergism-$VERSION$-$TIME$.txt"
        }
        getElementById<HTMLInputElement>("saveStringInput").value = player.saveString

        player.wowCubes = player.wowCubes || 0;

        for (let j = 1; j < 126; j++) {
            upgradeupdate(j);
        }

        for (let j = 1; j <= (200); j++) {
            updateResearchBG(j);
        }
        for (let j = 1; j <= 50; j++) {
            updateCubeUpgradeBG(j);
        }

        player.subtabNumber = 0;
        G['runescreen'] = "runes";
        document.getElementById("toggleRuneSubTab1").style.backgroundColor = 'crimson'
        document.getElementById("toggleRuneSubTab1").style.border = '2px solid gold'


        const q = ['coin', 'crystal', 'mythos', 'particle', 'offering', 'tesseract'];
        if (player.coinbuyamount !== 1 && player.coinbuyamount !== 10 && player.coinbuyamount !== 100 && player.coinbuyamount !== 1000) {
            player.coinbuyamount = 1;
        }
        if (player.crystalbuyamount !== 1 && player.crystalbuyamount !== 10 && player.crystalbuyamount !== 100 && player.crystalbuyamount !== 1000) {
            player.crystalbuyamount = 1;
        }
        if (player.mythosbuyamount !== 1 && player.mythosbuyamount !== 10 && player.mythosbuyamount !== 100 && player.mythosbuyamount !== 1000) {
            player.mythosbuyamount = 1;
        }
        if (player.particlebuyamount !== 1 && player.particlebuyamount !== 10 && player.particlebuyamount !== 100 && player.particlebuyamount !== 1000) {
            player.particlebuyamount = 1;
        }
        if (player.offeringbuyamount !== 1 && player.offeringbuyamount !== 10 && player.offeringbuyamount !== 100 && player.offeringbuyamount !== 1000) {
            player.offeringbuyamount = 1;
        }
        if (player.tesseractbuyamount !== 1 && player.tesseractbuyamount !== 10 && player.tesseractbuyamount !== 100 && player.tesseractbuyamount !== 1000) {
            player.tesseractbuyamount = 1;
        }
        for (let j = 0; j <= 5; j++) {
            for (let k = 0; k < 4; k++) {
                let d;
                if (k === 0) {
                    d = 'one';
                }
                if (k === 1) {
                    d = 'ten'
                }
                if (k === 2) {
                    d = 'hundred'
                }
                if (k === 3) {
                    d = 'thousand'
                }
                const e = q[j] + d;
                document.getElementById(e).style.backgroundColor = "#000000"
            }
            let c;
            if (player[q[j] + 'buyamount'] === 1) {
                c = 'one'
            }
            if (player[q[j] + 'buyamount'] === 10) {
                c = 'ten'
            }
            if (player[q[j] + 'buyamount'] === 100) {
                c = 'hundred'
            }
            if (player[q[j] + 'buyamount'] === 1000) {
                c = 'thousand'
            }

            const b = q[j] + c;
            document.getElementById(b).style.backgroundColor = "green"

        }

        const testArray = []
        //Creates a copy of research costs array
        for (let i = 0; i < G['researchBaseCosts'].length; i++) {
            testArray.push(G['researchBaseCosts'][i]);
        }
        //Sorts the above array, and returns the index order of sorted array
        G['researchOrderByCost'] = sortWithIndeces(testArray)
        player.roombaResearchIndex = 0;


        if (player.shoptoggles.coin === false) {
            document.getElementById("shoptogglecoin").textContent = "Auto: OFF"
        }
        if (player.shoptoggles.prestige === false) {
            document.getElementById("shoptoggleprestige").textContent = "Auto: OFF"
        }
        if (player.shoptoggles.transcend === false) {
            document.getElementById("shoptoggletranscend").textContent = "Auto: OFF"
        }
        if (player.shoptoggles.generators === false) {
            document.getElementById("shoptogglegenerator").textContent = "Auto: OFF"
        }
        if (!player.shoptoggles.reincarnate) {
            document.getElementById('particleAutoUpgrade').textContent = "Auto: OFF"
        }

        getChallengeConditions();
        updateChallengeDisplay();
        revealStuff();
        toggleauto();

        document.getElementById("startTimerValue").textContent = format(player.autoChallengeTimer.start, 2, true) + "s"
        getElementById<HTMLInputElement>("startAutoChallengeTimerInput").value = player.autoChallengeTimer.start + '';
        document.getElementById("exitTimerValue").textContent = format(player.autoChallengeTimer.exit, 2, true) + "s"
        getElementById<HTMLInputElement>("exitAutoChallengeTimerInput").value = player.autoChallengeTimer.exit + '';
        document.getElementById("enterTimerValue").textContent = format(player.autoChallengeTimer.enter, 2, true) + "s"
        getElementById<HTMLInputElement>("enterAutoChallengeTimerInput").value = player.autoChallengeTimer.enter + '';

        /* document.getElementById("runeshowpower1").textContent = "Speed Rune Bonus: " + "+" + format(Math.floor(G['rune1level'] * m)) + " Accelerators, +" + (G['rune1level']/2  * m).toPrecision(2) +"% Accelerators, +" + format(Math.floor(G['rune1level']/10 * m)) + " Accelerator Boosts."
if (player.achievements[38] == 1)document.getElementById("runeshowpower2").textContent = "Duplication Rune Bonus: " + "+" + Math.floor(G['rune2level'] * m / 10) * Math.floor(10 + G['rune2level'] * m /10) / 2 + " +" + m *G['rune2level']/2 +"% Multipliers, -" + (100 * (1 - Math.pow(10, - G['rune2level']/500))).toPrecision(4)  + "% Tax Growth.";
if (player.achievements[44] == 1)document.getElementById("runeshowpower3").textContent = "Prism Rune Bonus: " + "All Crystal Producer production multiplied by " + format(Decimal.pow(G['rune3level'] * m, 2).times(Decimal.pow(2, G['rune3level'] * m - 8).add(1))) + ", gain +" + format(Math.floor(G['rune3level']/10 * m)) + " free crystal levels.";
if (player.achievements[102] == 1)document.getElementById("runeshowpower4").textContent = "Thrift Rune Bonus: " + "Delay all producer cost increases by " + (G['rune4level']/4 * m).toPrecision(3) + "% buildings. Increase offering recycling chance: " + G['rune4level']/8 + "%."; */

        for (let i = 0; i < 4; i++) {
            corruptionLoadoutTableUpdate(i);
        }
        showCorruptionStatsLoadouts()

        for (let j = 1; j <= 5; j++) {
            const ouch = document.getElementById("tesseractAutoToggle" + j);
            (player.autoTesseracts[j]) ?
                (ouch.textContent = "Auto [ON]", ouch.style.border = "2px solid green") :
                (ouch.textContent = "Auto [OFF]", ouch.style.border = "2px solid red");
        }

        document.getElementById("buyRuneBlessingToggleValue").textContent = format(player.runeBlessingBuyAmount, 0, true);
        document.getElementById("buyRuneSpiritToggleValue").textContent = format(player.runeSpiritBuyAmount, 0, true);

        document.getElementById("researchrunebonus").textContent = "Thanks to researches, your effective levels are increased by " + (100 * G['effectiveLevelMult'] - 100).toPrecision(4) + "%";

        document.getElementById("talismanlevelup").style.display = "none"
        document.getElementById("talismanrespec").style.display = "none"
        calculatePlatonicBlessings();
        calculateHypercubeBlessings();
        calculateTesseractBlessings();
        calculateCubeBlessings();
        updateTalismanAppearance(1);
        updateTalismanAppearance(2);
        updateTalismanAppearance(3);
        updateTalismanAppearance(4);
        updateTalismanAppearance(5);
        updateTalismanAppearance(6);
        updateTalismanAppearance(7);
        for (const id in player.ascStatToggles) {
            toggleAscStatPerSecond(+id); // toggle each stat twice to make sure the displays are correct and match what they used to be
            toggleAscStatPerSecond(+id);
        }


        if (player.resettoggle1 === 1) {
            document.getElementById("prestigeautotoggle").textContent = "Mode: AMOUNT"
        }
        if (player.resettoggle2 === 1) {
            document.getElementById("transcendautotoggle").textContent = "Mode: AMOUNT"
        }
        if (player.resettoggle3 === 1) {
            document.getElementById("reincarnateautotoggle").textContent = "Mode: AMOUNT"
        }

        if (player.resettoggle1 === 2) {
            document.getElementById("prestigeautotoggle").textContent = "Mode: TIME"
        }
        if (player.resettoggle2 === 2) {
            document.getElementById("transcendautotoggle").textContent = "Mode: TIME"
        }
        if (player.resettoggle3 === 2) {
            document.getElementById("reincarnateautotoggle").textContent = "Mode: TIME"
        }

        if (player.tesseractAutoBuyerToggle === 1) {
            document.getElementById("tesseractautobuytoggle").textContent = "Auto Buy: ON"
            document.getElementById("tesseractautobuytoggle").style.border = "2px solid green"
        }
        if (player.tesseractAutoBuyerToggle === 2) {
            document.getElementById("tesseractautobuytoggle").textContent = "Auto Buy: OFF"
            document.getElementById("tesseractautobuytoggle").style.border = "2px solid red"
        }

        if (player.autoResearchToggle) {
            document.getElementById("toggleautoresearch").textContent = "Automatic: ON"
        }
        if (!player.autoResearchToggle) {
            document.getElementById("toggleautoresearch").textContent = "Automatic: OFF"
        }
        if (player.autoSacrificeToggle == true) {
            document.getElementById("toggleautosacrifice").textContent = "Auto Rune: ON"
            document.getElementById("toggleautosacrifice").style.border = "2px solid green"
        }
        if (player.autoSacrificeToggle == false) {
            document.getElementById("toggleautosacrifice").textContent = "Auto Rune: OFF"
            document.getElementById("toggleautosacrifice").style.border = "2px solid red"
        }
        if (player.autoFortifyToggle == true) {
            document.getElementById("toggleautofortify").textContent = "Auto Fortify: ON"
            document.getElementById("toggleautofortify").style.border = "2px solid green"
        }
        if (player.autoFortifyToggle == false) {
            document.getElementById("toggleautofortify").textContent = "Auto Fortify: OFF"
            document.getElementById("toggleautofortify").style.border = "2px solid red"
        }
        if (player.autoEnhanceToggle == true) {
            document.getElementById("toggleautoenhance").textContent = "Auto Enhance: ON"
            document.getElementById("toggleautoenhance").style.border = "2px solid green"
        }
        if (player.autoEnhanceToggle == false) {
            document.getElementById("toggleautoenhance").textContent = "Auto Enhance: OFF"
            document.getElementById("toggleautoenhance").style.border = "2px solid red"
        }
        if (!player.autoAscend) {
            document.getElementById("ascensionAutoEnable").textContent = "Auto Ascend [OFF]";
            document.getElementById("ascensionAutoEnable").style.border = "2px solid red"
        }

        for (let i = 1; i <= 2; i++) {
            toggleAntMaxBuy();
            toggleAntAutoSacrifice(0);
            toggleAntAutoSacrifice(1);
        }

        document.getElementById("historyTogglePerSecondButton").textContent = "Per second: " + (player.historyShowPerSecond ? "ON" : "OFF");
        document.getElementById("historyTogglePerSecondButton").style.borderColor = (player.historyShowPerSecond ? "green" : "red");

        if (!player.autoAscend) {
            document.getElementById("ascensionAutoEnable").textContent = "Auto Ascend [OFF]";
            document.getElementById("ascensionAutoEnable").style.border = "2px solid red"
        }

        player.autoResearch = Math.min(200, player.autoResearch)
        player.autoSacrifice = Math.min(5, player.autoSacrifice)


        if (player.researches[61] === 0) {
            document.getElementById('automaticobtainium').textContent = "[LOCKED - Buy Research 3x11]"
        }

        if (player.autoSacrificeToggle && player.autoSacrifice > 0.5) {
            document.getElementById("rune" + player.autoSacrifice).style.backgroundColor = "orange"
        }

        calculateOffline();
        toggleTalismanBuy(player.buyTalismanShardPercent);
        updateTalismanInventory();
        calculateObtainium();
        calculateAnts();
        calculateRuneLevels();
        resetHistoryRenderAllTables();
        c15RewardUpdate();
    }
    CSSAscend();
    CSSRuneBlessings();
    updateAchievementBG();

    const d = new Date()
    const h = d.getHours()
    const m = d.getMinutes()
    const s = d.getSeconds()
    player.dayTimer = (60 * 60 * 24 - (s + 60 * m + 60 * 60 * h))
}

/**
 * This function displays the numbers such as 1,234 or 1.00e1234 or 1.00e1.234M.
 * @param {Decimal | number} input number/Decimal to be formatted
 * @param accuracy
 * how many decimal points that are to be displayed (Values <10 if !long, <1000 if long).
 * only works up to 305 (308 - 3), however it only worked up to ~14 due to rounding errors regardless
 * @param long dictates whether or not a given number displays as scientific at 1,000,000. This auto defaults to short if input >= 1e13
 */
export const format = (input: Decimal | number, accuracy = 0, long = false): string => {
    if (!(input instanceof Decimal) && typeof input !== 'number' || isNaN(input as any)) {
        return '0 [und.]';
    }

    let power;
    let mantissa;
    if (isDecimal(input)) {
        // Gets power and mantissa if input is of type decimal
        power = input.e;
        mantissa = input.mantissa;
    } else if (typeof input === 'number') {
        if (input === 0) {
            return '0';
        }

        // Gets power and mantissa if input is of type number and isn't 0
        power = Math.floor(Math.log10(Math.abs(input)));
        mantissa = input / Math.pow(10, power);
    }

    // This prevents numbers from jittering between two different powers by rounding errors
    if (mantissa > 9.9999999) {
        mantissa = 1;
        ++power;
    }

    if (mantissa < 1 && mantissa > 0.9999999) {
        mantissa = 1;
    }

    // If the power is less than 12 it's effectively 0
    if (power < -12) {
        return '0';
    } else if (power < 6 || (long && power < 13)) {
        // If the power is less than 6 or format long and less than 13 use standard formatting (123,456,789)
        // Gets the standard representation of the number, safe as power is guaranteed to be > -12 and < 13
        let standard = mantissa * Math.pow(10, power);
        let standardString;
        // Rounds up if the number experiences a rounding error
        if (standard - Math.floor(standard) > 0.9999999) {
            standard = Math.ceil(standard);
        }
        // If the power is less than 1 or format long and less than 3 apply toFixed(accuracy) to get decimal places
        if ((power < 1 || (long && power < 3)) && accuracy > 0) {
            standardString = standard.toFixed(accuracy);
        } else {
            // If it doesn't fit those criteria drop the decimal places
            standard = Math.floor(standard);
            standardString = standard.toString();
        }

        // Split it on the decimal place
        const [front, back] = standardString.split('.');
        // Apply a number group 3 comma regex to the front
        const frontFormatted = typeof BigInt === 'function'
            ? BigInt(front).toLocaleString() // TODO: use Intl to force en-US
            : front.replace(/(\d)(?=(\d{3})+$)/g, '$1,');

        // if the back is undefined that means there are no decimals to display, return just the front
        return !back 
            ? frontFormatted
            : `${frontFormatted}.${back}`;
    } else if (power < 1e6) {
        // If the power is less than 1e6 then apply standard scientific notation
        // Makes mantissa be rounded down to 2 decimal places
        const mantissaLook = (Math.floor(mantissa * 100) / 100).toFixed(2);
        // Makes the power group 3 with commas
        const powerLook = typeof BigInt === 'function'
            ? BigInt(power).toLocaleString()
            : power.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,");
        // returns format (1.23e456,789)
        return `${mantissaLook}e${powerLook}`;
    } else if (power >= 1e6) {
        // if the power is greater than 1e6 apply notation scientific notation
        // Makes mantissa be rounded down to 2 decimal places
        let mantissaLook = (Math.floor(mantissa * 100) / 100).toFixed(2);
        if (isTesting){
            mantissaLook = ""
        }
        // Drops the power down to 4 digits total but never greater than 1000 in increments that equate to notations, (1234000 -> 1.234) ( 12340000 -> 12.34) (123400000 -> 123.4) (1234000000 -> 1.234)
        const powerDigits = Math.ceil(Math.log10(power));
        let powerFront = ((powerDigits - 1) % 3) + 1;
        let powerLook = power / Math.pow(10, powerDigits - powerFront);
        if (powerLook === 1000) {
            powerLook = 1;
            powerFront = 1;
        }

        const powerLookF = powerLook.toFixed(4 - powerFront);
        // Return relevant notations alongside the "look" power based on what the power actually is
        if (power < 1e9) {
            return `${mantissaLook}e${powerLookF}M`;
        }
        if (power < 1e12) {
            return `${mantissaLook}e${powerLookF}B`;
        }
        if (power < 1e15) {
            return `${mantissaLook}e${powerLookF}T`;
        }
        if (power < 1e18) {
            return `${mantissaLook}e${powerLookF}Qa`;
        }
        if (power < 1e21) {
            return `${mantissaLook}e${powerLookF}Qi`;
        }
        if (power < 1e24) {
            return `${mantissaLook}e${powerLookF}Sx`;
        }
        if (power < 1e27) {
            return `${mantissaLook}e${powerLookF}Sp`;
        }
        if (power < 1e30) {
            return `${mantissaLook}e${powerLookF}Oc`;
        }
        if (power < 1e33) {
            return `${mantissaLook}e${powerLookF}No`;
        }
        if (power < 1e36) {
            return `${mantissaLook}e${powerLookF}Dc`;
        }
        if (power < 1e39) {
            return `${mantissaLook}e${powerLookF}UDc`;
        }
        if (power < 1e42) {
            return `${mantissaLook}e${powerLookF}DDc`;
        }
        if (power < 1e45) {
            return `${mantissaLook}e${powerLookF}TDc`;
        }
        if (power < 1e48) {
            return `${mantissaLook}e${powerLookF}QaDc`;
        }
        if (power < 1e51) {
            return `${mantissaLook}e${powerLookF}QaDc`;
        }
        // If it doesn't fit a notation then default to mantissa e power
        return `${mantissa}e${power}`;
    } else {
        return `0 [und.]`;
    }
}

export const formatTimeShort = (seconds: number, msMaxSeconds?: number): string => {
    return ((seconds >= 86400)
        ? format(Math.floor(seconds / 86400)) + "d"
        : '') +
        ((seconds >= 3600)
            ? format(Math.floor(seconds / 3600) % 24) + "h"
            : '') +
        ((seconds >= 60)
            ? format(Math.floor(seconds / 60) % 60) + "m"
            : '') +
        format(Math.floor(seconds) % 60) +
        ((msMaxSeconds && seconds < msMaxSeconds)
            ? "." + (Math.floor((seconds % 1) * 1000).toString().padStart(3, '0'))
            : '') + "s";
}

export const updateAllTick = (): void => {
    let a = 0;
    
    G['totalAccelerator'] = player.acceleratorBought;
    G['costDivisor'] = 1;

    if (player.upgrades[8] !== 0) {
        a += Math.floor(player.multiplierBought / 7);
    }
    if (player.upgrades[21] !== 0) {
        a += 5;
    }
    if (player.upgrades[22] !== 0) {
        a += 4;
    }
    if (player.upgrades[23] !== 0) {
        a += 3;
    }
    if (player.upgrades[24] !== 0) {
        a += 2;
    }
    if (player.upgrades[25] !== 0) {
        a += 1;
    }
    if (player.upgrades[27] !== 0) {
        a += Math.min(250, Math.floor(Decimal.log(player.coins.add(1), 1e3))) + Math.min(1750, Math.max(0, Math.floor(Decimal.log(player.coins.add(1), 1e15)) - 50));
    }
    if (player.upgrades[29] !== 0) {
        a += Math.floor(Math.min(2000, (player.firstOwnedCoin + player.secondOwnedCoin + player.thirdOwnedCoin + player.fourthOwnedCoin + player.fifthOwnedCoin) / 80))
    }
    if (player.upgrades[32] !== 0) {
        a += Math.min(500, Math.floor(Decimal.log(player.prestigePoints.add(1), 1e25)));
    }
    if (player.upgrades[45] !== 0) {
        a += Math.min(2500, Math.floor(Decimal.log(player.transcendShards.add(1), 10)));
    }
    if (player.achievements[5] !== 0) {
        a += Math.floor(player.firstOwnedCoin / 500)
    }
    if (player.achievements[12] !== 0) {
        a += Math.floor(player.secondOwnedCoin / 500)
    }
    if (player.achievements[19] !== 0) {
        a += Math.floor(player.thirdOwnedCoin / 500)
    }
    if (player.achievements[26] !== 0) {
        a += Math.floor(player.fourthOwnedCoin / 500)
    }
    if (player.achievements[33] !== 0) {
        a += Math.floor(player.fifthOwnedCoin / 500)
    }
    if (player.achievements[60] !== 0) {
        a += 2
    }
    if (player.achievements[61] !== 0) {
        a += 2
    }
    if (player.achievements[62] !== 0) {
        a += 2
    }

    a += 5 * CalcECC('transcend', player.challengecompletions[2])
    G['freeUpgradeAccelerator'] = a;
    a += G['totalAcceleratorBoost'] * (4 + 2 * player.researches[18] + 2 * player.researches[19] + 3 * player.researches[20] + G['cubeBonusMultiplier'][1]);
    if (player.unlocks.prestige === true) {
        a += Math.floor(Math.pow(G['rune1level'] * G['effectiveLevelMult'] / 4, 1.25));
        a *= (1 + G['rune1level'] * 1 / 400 * G['effectiveLevelMult']);
    }
    
    calculateAcceleratorMultiplier();
    a *= G['acceleratorMultiplier']
    a = Math.pow(a, Math.min(1, (1 + player.platonicUpgrades[6] / 30) * G['maladaptivePower'][player.usedCorruptions[2]] / (1 + Math.abs(player.usedCorruptions[1] - player.usedCorruptions[2]))))
    a *= G['challenge15Rewards'].accelerator
    a = Math.floor(a)

    G['freeAccelerator'] = a;
    G['totalAccelerator'] += G['freeAccelerator'];

    G['tuSevenMulti'] = 1;


    if (player.upgrades[46] > 0.5) {
        G['tuSevenMulti'] = 1.05;
    }

    G['acceleratorPower'] = Math.pow(
        1.1 + G['tuSevenMulti'] * 
        (G['totalAcceleratorBoost'] / 100) 
        * (1 + CalcECC('transcend', player.challengecompletions[2]) / 20), 
        1 + 0.04 * CalcECC('reincarnation', player.challengecompletions[7])
    );
    G['acceleratorPower'] += 1 / 200 * Math.floor(CalcECC('transcend', player.challengecompletions[2]) / 2) * 100 / 100
    for (let i = 1; i <= 5; i++) {
        if (player.achievements[7 * i - 4] > 0) {
            G['acceleratorPower'] += 0.0005 * i
        }
    }

    //No MA and Sadistic will always overwrite Transcend challenges starting in v2.0.0
    if (player.currentChallenge.reincarnation !== 7 && player.currentChallenge.reincarnation !== 10) {
        if (player.currentChallenge.transcension === 1) {
            G['acceleratorPower'] *= 25 / (50 + player.challengecompletions[1]);
            G['acceleratorPower'] += 0.55
            G['acceleratorPower'] = Math.max(1, G['acceleratorPower'])
        }
        if (player.currentChallenge.transcension === 2) {
            G['acceleratorPower'] = 1;
        }
        if (player.currentChallenge.transcension === 3) {
            G['acceleratorPower'] = 
                1.05 + 
                2 * G['tuSevenMulti'] * 
                (G['totalAcceleratorBoost'] / 300) * 
                (1 + CalcECC('transcend', player.challengecompletions[2]) / 20
            );
        }
    }
    if (player.currentChallenge.reincarnation === 7) {
        G['acceleratorPower'] = 1;
    }
    if (player.currentChallenge.reincarnation === 10) {
        G['acceleratorPower'] = 1;
    }

    if (player.currentChallenge.transcension !== 1) {
        G['acceleratorEffect'] = Decimal.pow(G['acceleratorPower'], G['totalAccelerator']);
    }

    if (player.currentChallenge.transcension === 1) {
        G['acceleratorEffect'] = Decimal.pow(G['acceleratorPower'], G['totalAccelerator'] + G['totalMultiplier']);
    }
    G['acceleratorEffectDisplay'] = new Decimal(G['acceleratorPower'] * 100 - 100);
    if (player.currentChallenge.reincarnation === 10) {
        G['acceleratorEffect'] = new Decimal(1);
    }
    G['generatorPower'] = new Decimal(1);
    if (player.upgrades[11] > 0.5 && player.currentChallenge.reincarnation !== 7) {
        G['generatorPower'] = Decimal.pow(1.02, G['totalAccelerator'])
    }

}

export const updateAllMultiplier = (): void => {
    let a = 0;

    if (player.upgrades[7] > 0) {
        a += Math.min(4, 1 + Math.floor(Decimal.log(player.fifthOwnedCoin + 1, 10)));
    }
    if (player.upgrades[9] > 0) {
        a += Math.floor(player.acceleratorBought / 10);
    }
    if (player.upgrades[21] > 0) {
        a += 1;
    }
    if (player.upgrades[22] > 0) {
        a += 1;
    }
    if (player.upgrades[23] > 0) {
        a += 1;
    }
    if (player.upgrades[24] > 0) {
        a += 1;
    }
    if (player.upgrades[25] > 0) {
        a += 1;
    }
    if (player.upgrades[28] > 0) {
        a += Math.min(1000, Math.floor((player.firstOwnedCoin + player.secondOwnedCoin + player.thirdOwnedCoin + player.fourthOwnedCoin + player.fifthOwnedCoin) / 160))
    }
    if (player.upgrades[30] > 0) {
        a += Math.min(75, Math.floor(Decimal.log(player.coins.add(1), 1e10))) + Math.min(925, Math.floor(Decimal.log(player.coins.add(1), 1e30)));
    }
    if (player.upgrades[33] > 0) {
        a += G['totalAcceleratorBoost']
    }
    if (player.upgrades[49] > 0) {
        a += Math.min(50, Math.floor(Decimal.log(player.transcendPoints.add(1), 1e10)));
    }
    if (player.upgrades[68] > 0) {
        a += Math.min(2500, Math.floor(Decimal.log(G['taxdivisor'], 10) * 1 / 1000))
    }
    if (player.challengecompletions[1] > 0) {
        a += 1
    }
    if (player.achievements[6] > 0.5) {
        a += Math.floor(player.firstOwnedCoin / 1000)
    }
    if (player.achievements[13] > 0.5) {
        a += Math.floor(player.secondOwnedCoin / 1000)
    }
    if (player.achievements[20] > 0.5) {
        a += Math.floor(player.thirdOwnedCoin / 1000)
    }
    if (player.achievements[27] > 0.5) {
        a += Math.floor(player.fourthOwnedCoin / 1000)
    }
    if (player.achievements[34] > 0.5) {
        a += Math.floor(player.fifthOwnedCoin / 1000)
    }
    if (player.achievements[57] > 0.5) {
        a += 1
    }
    if (player.achievements[58] > 0.5) {
        a += 1
    }
    if (player.achievements[59] > 0.5) {
        a += 1
    }
    a += 20 * player.researches[94] * Math.floor(
        (G['rune1level'] + G['rune2level'] + G['rune3level'] + G['rune4level'] + G['rune5level']) / 8
    );

    G['freeUpgradeMultiplier'] = a

    if (player.achievements[38] > 0.5) {
        a += Math.floor(Math.floor(
            G['rune2level'] / 10 * G['effectiveLevelMult']) * 
            Math.floor(1 + G['rune2level'] / 10 * G['effectiveLevelMult']) / 2
        ) * 100 / 100;
    }

    a *= (1 + player.achievements[57] / 100)
    a *= (1 + player.achievements[58] / 100)
    a *= (1 + player.achievements[59] / 100)
    a *= Math.pow(1.01, player.upgrades[21] + player.upgrades[22] + player.upgrades[23] + player.upgrades[24] + player.upgrades[25])
    if (player.upgrades[34] > 0.5) {
        a *= 1.03 * 100 / 100
    }
    if (player.upgrades[35] > 0.5) {
        a *= 1.05 / 1.03 * 100 / 100
    }
    a *= (1 + 1 / 5 * player.researches[2] * (1 + 1 / 2 * CalcECC('ascension', player.challengecompletions[14])))
    a *= (1 + 1 / 20 * player.researches[11] + 1 / 25 * player.researches[12] + 1 / 40 * player.researches[13] + 3 / 200 * player.researches[14] + 1 / 200 * player.researches[15])
    a *= (1 + G['rune2level'] / 400 * G['effectiveLevelMult'])
    a *= (1 + 1 / 20 * player.researches[87])
    a *= (1 + 1 / 100 * player.researches[128])
    a *= (1 + 0.8 / 100 * player.researches[143])
    a *= (1 + 0.6 / 100 * player.researches[158])
    a *= (1 + 0.4 / 100 * player.researches[173])
    a *= (1 + 0.2 / 100 * player.researches[188])
    a *= (1 + 0.01 / 100 * player.researches[200])
    a *= (1 + 0.01 / 100 * player.cubeUpgrades[50])
    a *= calculateSigmoidExponential(40, (player.antUpgrades[5-1] + G['bonusant5']) / 1000 * 40 / 39)
    a *= G['cubeBonusMultiplier'][2]
    if ((player.currentChallenge.transcension !== 0 || player.currentChallenge.reincarnation !== 0) && player.upgrades[50] > 0.5) {
        a *= 1.25
    }
    a = Math.pow(a, Math.min(1, (1 + player.platonicUpgrades[6] / 30) * G['divisivenessPower'][player.usedCorruptions[1]] / (1 + Math.abs(player.usedCorruptions[1] - player.usedCorruptions[2]))))
    a *= G['challenge15Rewards'].multiplier
    a = Math.floor(a)
    G['freeMultiplier'] = a;
    G['totalMultiplier'] = G['freeMultiplier'] + player.multiplierBought;

    G['challengeOneLog'] = 3;

    let b = 0;
    let c = 0;
    b += Decimal.log(player.transcendShards.add(1), 3);
    b *= (1 + 11 * player.researches[33] / 100)
    b *= (1 + 11 * player.researches[34] / 100)
    b *= (1 + 11 * player.researches[35] / 100)
    b *= (1 + player.researches[89] / 5)
    b *= (1 + 10 * G['effectiveRuneBlessingPower'][2])

    c += Math.floor((0.1 * b * CalcECC('transcend', player.challengecompletions[1])))
    c += (CalcECC('transcend', player.challengecompletions[1]) * 10);
    G['freeMultiplierBoost'] = c;
    G['totalMultiplierBoost'] = Math.pow(Math.floor(b) + c, 1 + CalcECC('reincarnation', player.challengecompletions[7]) * 0.04);

    let c7 = 1
    if (player.challengecompletions[7] > 0.5) {
        c7 = 1.25
    }

    G['multiplierPower'] = 2 + 0.005 * G['totalMultiplierBoost'] * c7

    //No MA and Sadistic will always override Transcend Challenges starting in v2.0.0
    if (player.currentChallenge.reincarnation !== 7 && player.currentChallenge.reincarnation !== 10) {
        if (player.currentChallenge.transcension === 1) {
            G['multiplierPower'] = 1;
        }
        if (player.currentChallenge.transcension === 2) {
            G['multiplierPower'] = (1.25 + 0.0012 * (b + c) * c7)
        }
    }

    if (player.currentChallenge.reincarnation === 7) {
        G['multiplierPower'] = 1;
    }
    if (player.currentChallenge.reincarnation === 10) {
        G['multiplierPower'] = 1;
    }

    G['multiplierEffect'] = Decimal.pow(G['multiplierPower'], G['totalMultiplier']);
}

export const multipliers = (): void => {
    let s = new Decimal(1);
    let c = new Decimal(1);
    let crystalExponent = 1 / 3
    crystalExponent += Math.min(10 + 0.05 * player.researches[129] * Math.log(player.commonFragments + 1) / Math.log(4) + 20 * calculateCorruptionPoints() / 400 * G['effectiveRuneSpiritPower'][3], 0.05 * player.crystalUpgrades[3])
    crystalExponent += 0.04 * CalcECC('transcend', player.challengecompletions[3])
    crystalExponent += 0.08 * player.researches[28]
    crystalExponent += 0.08 * player.researches[29]
    crystalExponent += 0.04 * player.researches[30]
    crystalExponent += 8 * player.cubeUpgrades[17]
    G['prestigeMultiplier'] = Decimal.pow(player.prestigeShards, crystalExponent).add(1);

    let c7 = 1;
    if (player.currentChallenge.reincarnation === 7) {
        c7 = 0.05
    }
    if (player.currentChallenge.reincarnation === 8) {
        c7 = 0
    }

    G['buildingPower'] = 
        1 + (1 - Math.pow(2, -1 / 160)) * c7 * Decimal.log(
            player.reincarnationShards.add(1), 10) * 
            (1 + 1 / 20 * player.researches[36] + 
            1 / 40 * player.researches[37] + 1 / 40 * 
            player.researches[38]) + 
            (c7 + 0.2) * 0.25 / 1.2 * 
            CalcECC('reincarnation', player.challengecompletions[8]
        );

    G['buildingPower'] = Math.pow(G['buildingPower'], 1 + player.cubeUpgrades[12] * 0.09)
    G['buildingPower'] = Math.pow(G['buildingPower'], 1 + player.cubeUpgrades[36] * 0.05)
    G['reincarnationMultiplier'] = Decimal.pow(G['buildingPower'], G['totalCoinOwned']);

    G['antMultiplier'] = Decimal.pow(Decimal.max(1, player.antPoints), calculateCrumbToCoinExp());

    s = s.times(G['multiplierEffect']);
    s = s.times(G['acceleratorEffect']);
    s = s.times(G['prestigeMultiplier']);
    s = s.times(G['reincarnationMultiplier']);
    s = s.times(G['antMultiplier'])
    // PLAT - check
    const first6CoinUp = new Decimal(G['totalCoinOwned'] + 1).times(Decimal.min(1e30, Decimal.pow(1.008, G['totalCoinOwned'])));

    if (player.upgrades[6] > 0.5) {
        s = s.times(first6CoinUp);
    }
    if (player.upgrades[12] > 0.5) {
        s = s.times(Decimal.min(1e4, Decimal.pow(1.01, player.prestigeCount)));
    }
    if (player.upgrades[20] > 0.5) {
        // PLAT - check
        s = s.times(Math.pow(G['totalCoinOwned'] / 4 + 1, 10));
    }
    if (player.upgrades[41] > 0.5) {
        s = s.times(Decimal.min(1e30, Decimal.pow(player.transcendPoints.add(1), 1 / 2)));
    }
    if (player.upgrades[43] > 0.5) {
        s = s.times(Decimal.min(1e30, Decimal.pow(1.01, player.transcendCount)));
    }
    if (player.upgrades[48] > 0.5) {
        s = s.times(Decimal.pow((G['totalMultiplier'] * G['totalAccelerator'] / 1000 + 1), 8));
    }
    if (player.currentChallenge.reincarnation === 6) {
        s = s.dividedBy(1e250)
    }
    if (player.currentChallenge.reincarnation === 7) {
        s = s.dividedBy("1e1250")
    }
    if (player.currentChallenge.reincarnation === 9) {
        s = s.dividedBy("1e2000000")
    }
    if (player.currentChallenge.reincarnation === 10) {
        s = s.dividedBy("1e12500000")
    }
    c = Decimal.pow(s, 1 + 0.001 * player.researches[17]);
    let lol = Decimal.pow(c, 1 + 0.025 * player.upgrades[123])
    if (player.currentChallenge.ascension === 15 && player.platonicUpgrades[5] > 0) {
        lol = Decimal.pow(lol, 1.1)
    }
    if (player.currentChallenge.ascension === 15 && player.platonicUpgrades[14] > 0) {
        lol = Decimal.pow(lol, 1 + 1 / 20 * player.usedCorruptions[9] * Decimal.log(player.coins.add(1), 10) / (1e7 + Decimal.log(player.coins.add(1), 10)))
    }
    lol = Decimal.pow(lol, G['challenge15Rewards'].coinExponent)
    G['globalCoinMultiplier'] = lol;
    G['globalCoinMultiplier'] = Decimal.pow(G['globalCoinMultiplier'], G['financialcollapsePower'][player.usedCorruptions[9]])

    G['coinOneMulti'] = new Decimal(1);
    if (player.upgrades[1] > 0.5) {
        G['coinOneMulti'] = G['coinOneMulti'].times(first6CoinUp);
    }
    if (player.upgrades[10] > 0.5) {
        G['coinOneMulti'] = G['coinOneMulti'].times(Decimal.pow(2, Math.min(50, player.secondOwnedCoin / 15)));
    }
    if (player.upgrades[56] > 0.5) {
        G['coinOneMulti'] = G['coinOneMulti'].times("1e5000")
    }

    G['coinTwoMulti'] = new Decimal(1);
    if (player.upgrades[2] > 0.5) {
        G['coinTwoMulti'] = G['coinTwoMulti'].times(first6CoinUp);
    }
    if (player.upgrades[13] > 0.5) {
        G['coinTwoMulti'] = G['coinTwoMulti'].times(Decimal.min(1e50, Decimal.pow(player.firstGeneratedMythos.add(player.firstOwnedMythos).add(1), 4 / 3).times(1e10)));
    }
    if (player.upgrades[19] > 0.5) {
        G['coinTwoMulti'] = G['coinTwoMulti'].times(Decimal.min(1e200, player.transcendPoints.times(1e30).add(1)));
    }
    if (player.upgrades[57] > 0.5) {
        G['coinTwoMulti'] = G['coinTwoMulti'].times("1e7500")
    }

    G['coinThreeMulti'] = new Decimal(1);
    if (player.upgrades[3] > 0.5) {
        G['coinThreeMulti'] = G['coinThreeMulti'].times(first6CoinUp);
    }
    if (player.upgrades[18] > 0.5) {
        G['coinThreeMulti'] = G['coinThreeMulti'].times(Decimal.min(1e125, player.transcendShards.add(1)));
    }
    if (player.upgrades[58] > 0.5) {
        G['coinThreeMulti'] = G['coinThreeMulti'].times("1e15000")
    }

    G['coinFourMulti'] = new Decimal(1);
    if (player.upgrades[4] > 0.5) {
        G['coinFourMulti'] = G['coinFourMulti'].times(first6CoinUp);
    }
    if (player.upgrades[17] > 0.5) {
        G['coinFourMulti'] = G['coinFourMulti'].times(1e100);
    }
    if (player.upgrades[59] > 0.5) {
        G['coinFourMulti'] = G['coinFourMulti'].times("1e25000")
    }

    G['coinFiveMulti'] = new Decimal(1);
    if (player.upgrades[5] > 0.5) {
        G['coinFiveMulti'] = G['coinFiveMulti'].times(first6CoinUp);
    }
    if (player.upgrades[60] > 0.5) {
        G['coinFiveMulti'] = G['coinFiveMulti'].times("1e35000")
    }

    G['globalCrystalMultiplier'] = new Decimal(1)
    if (player.achievements[36] > 0.5) {
        G['globalCrystalMultiplier'] = G['globalCrystalMultiplier'].times(2)
    }
    if (player.achievements[37] > 0.5 && player.prestigePoints.gte(10)) {
        G['globalCrystalMultiplier'] = G['globalCrystalMultiplier'].times(Decimal.log(player.prestigePoints.add(1), 10))
    }
    if (player.achievements[43] > 0.5) {
        G['globalCrystalMultiplier'] = G['globalCrystalMultiplier']
            .times(Decimal.pow(G['rune3level'] / 2 * G['effectiveLevelMult'], 2)
            .times(Decimal.pow(2, G['rune3level'] * G['effectiveLevelMult'] / 2 - 8))
            .add(1));
    }
    if (player.upgrades[36] > 0.5) {
        G['globalCrystalMultiplier'] = G['globalCrystalMultiplier'].times(Decimal.min("1e5000", Decimal.pow(player.prestigePoints, 1 / 500)))
    }
    if (player.upgrades[63] > 0.5) {
        G['globalCrystalMultiplier'] = G['globalCrystalMultiplier'].times(Decimal.min("1e6000", Decimal.pow(player.reincarnationPoints.add(1), 6)))
    }
    if (player.researches[39] > 0.5) {
        G['globalCrystalMultiplier'] = G['globalCrystalMultiplier'].times(Decimal.pow(G['reincarnationMultiplier'], 1 / 50))
    }

    G['globalCrystalMultiplier'] = G['globalCrystalMultiplier'].times(Decimal.min(Decimal.pow(10, 50 + 2 * player.crystalUpgrades[0]), Decimal.pow(1.05, player.achievementPoints * player.crystalUpgrades[0])))
    G['globalCrystalMultiplier'] = G['globalCrystalMultiplier'].times(Decimal.min(Decimal.pow(10, 100 + 5 * player.crystalUpgrades[1]), Decimal.pow(Decimal.log(player.coins.add(1), 10), player.crystalUpgrades[1] / 3)))
    G['globalCrystalMultiplier'] = G['globalCrystalMultiplier'].times(Decimal.pow(1 + Math.min(0.12 + 0.88 * player.upgrades[122] + 0.001 * player.researches[129] * Math.log(player.commonFragments + 1) / Math.log(4), 0.001 * player.crystalUpgrades[2]), player.firstOwnedDiamonds + player.secondOwnedDiamonds + player.thirdOwnedDiamonds + player.fourthOwnedDiamonds + player.fifthOwnedDiamonds))
    G['globalCrystalMultiplier'] = G['globalCrystalMultiplier'].times(Decimal.pow(1.01, (player.challengecompletions[1] + player.challengecompletions[2] + player.challengecompletions[3] + player.challengecompletions[4] + player.challengecompletions[5]) * player.crystalUpgrades[4]))
    G['globalCrystalMultiplier'] = G['globalCrystalMultiplier'].times(Decimal.pow(10, CalcECC('transcend', player.challengecompletions[5])))
    G['globalCrystalMultiplier'] = G['globalCrystalMultiplier'].times(Decimal.pow(1e4, player.researches[5] * (1 + 1 / 2 * CalcECC('ascension', player.challengecompletions[14]))))
    G['globalCrystalMultiplier'] = G['globalCrystalMultiplier'].times(Decimal.pow(2.5, player.researches[26]))
    G['globalCrystalMultiplier'] = G['globalCrystalMultiplier'].times(Decimal.pow(2.5, player.researches[27]))

    G['globalMythosMultiplier'] = new Decimal(1)

    if (player.upgrades[37] > 0.5) {
        G['globalMythosMultiplier'] = G['globalMythosMultiplier'].times(Decimal.pow(Decimal.log(player.prestigePoints.add(10), 10), 2))
    }
    if (player.upgrades[42] > 0.5) {
        G['globalMythosMultiplier'] = G['globalMythosMultiplier'].times(Decimal.min(1e50, Decimal.pow(player.prestigePoints.add(1), 1 / 50).dividedBy(2.5).add(1)));
    }
    if (player.upgrades[47] > 0.5) {
        G['globalMythosMultiplier'] = G['globalMythosMultiplier'].times(Math.pow(1.05, player.achievementPoints)).times(player.achievementPoints + 1)
    }
    if (player.upgrades[51] > 0.5) {
        G['globalMythosMultiplier'] = G['globalMythosMultiplier'].times(Decimal.pow(G['totalAcceleratorBoost'], 2))
    }
    if (player.upgrades[52] > 0.5) {
        G['globalMythosMultiplier'] = G['globalMythosMultiplier'].times(Decimal.pow(G['globalMythosMultiplier'], 0.025))
    }
    if (player.upgrades[64] > 0.5) {
        G['globalMythosMultiplier'] = G['globalMythosMultiplier'].times(Decimal.pow(player.reincarnationPoints.add(1), 2))
    }
    if (player.researches[40] > 0.5) {
        G['globalMythosMultiplier'] = G['globalMythosMultiplier'].times(Decimal.pow(G['reincarnationMultiplier'], 1 / 250))
    }
    G['grandmasterMultiplier'] = new Decimal(1);
    G['totalMythosOwned'] = player.firstOwnedMythos + player.secondOwnedMythos + player.thirdOwnedMythos + player.fourthOwnedMythos + player.fifthOwnedMythos;

    G['mythosBuildingPower'] = 1 + (CalcECC('transcend', player.challengecompletions[3]) / 200);
    G['challengeThreeMultiplier'] = Decimal.pow(G['mythosBuildingPower'], G['totalMythosOwned']);

    G['grandmasterMultiplier'] = G['grandmasterMultiplier'].times(G['challengeThreeMultiplier']);

    G['mythosupgrade13'] = new Decimal(1);
    G['mythosupgrade14'] = new Decimal(1);
    G['mythosupgrade15'] = new Decimal(1);
    if (player.upgrades[53] === 1) {
        G['mythosupgrade13'] = G['mythosupgrade13'].times(Decimal.min("1e1250", Decimal.pow(G['acceleratorEffect'], 1 / 125)))
    }
    if (player.upgrades[54] === 1) {
        G['mythosupgrade14'] = G['mythosupgrade14'].times(Decimal.min("1e2000", Decimal.pow(G['multiplierEffect'], 1 / 180)))
    }
    if (player.upgrades[55] === 1) {
        G['mythosupgrade15'] = G['mythosupgrade15'].times(Decimal.pow("1e1000", Math.min(1000, G['buildingPower'] - 1)))
    }

    G['globalAntMult'] = new Decimal(1);
    G['globalAntMult'] = G['globalAntMult'].times(1 + 1 / 2500 * Math.pow(G['rune5level'] * G['effectiveLevelMult'] * (1 + player.researches[84] / 200 * (1 + 1 * G['effectiveRuneSpiritPower'][5] * calculateCorruptionPoints() / 400)), 2))
    if (player.upgrades[76] === 1) {
        G['globalAntMult'] = G['globalAntMult'].times(5)
    }
    G['globalAntMult'] = G['globalAntMult'].times(Decimal.pow(1 + player.upgrades[77] / 250 + player.researches[96] / 5000, player.firstOwnedAnts + player.secondOwnedAnts + player.thirdOwnedAnts + player.fourthOwnedAnts + player.fifthOwnedAnts + player.sixthOwnedAnts + player.seventhOwnedAnts + player.eighthOwnedAnts))
    G['globalAntMult'] = G['globalAntMult'].times(1 + player.upgrades[78] * 0.005 * Math.pow(Math.log(player.maxofferings + 1) / Math.log(10), 2))
    G['globalAntMult'] = G['globalAntMult'].times(Math.pow(1.125, player.shopUpgrades.antSpeed));
    G['globalAntMult'] = G['globalAntMult'].times(Decimal.pow(1.11 + player.researches[101] / 1000 + player.researches[162] / 10000, player.antUpgrades[1-1] + G['bonusant1']));
    G['globalAntMult'] = G['globalAntMult'].times(antSacrificePointsToMultiplier(player.antSacrificePoints))
    G['globalAntMult'] = G['globalAntMult'].times(Decimal.pow(Math.max(1, player.researchPoints), G['effectiveRuneBlessingPower'][5]))
    G['globalAntMult'] = G['globalAntMult'].times(Math.pow(1 + G['runeSum'] / 100, G['talisman6Power']))
    G['globalAntMult'] = G['globalAntMult'].times(Math.pow(1.1, CalcECC('reincarnation', player.challengecompletions[9])))
    G['globalAntMult'] = G['globalAntMult'].times(G['cubeBonusMultiplier'][6])
    if (player.achievements[169] === 1) {
        G['globalAntMult'] = G['globalAntMult'].times(Decimal.log(player.antPoints.add(10), 10))
    }
    if (player.achievements[171] === 1) {
        G['globalAntMult'] = G['globalAntMult'].times(1.16666)
    }
    if (player.achievements[172] === 1) {
        G['globalAntMult'] = G['globalAntMult'].times(1 + 2 * (1 - Math.pow(2, -Math.min(1, player.reincarnationcounter / 7200))))
    }
    if (player.upgrades[39] === 1) {
        G['globalAntMult'] = G['globalAntMult'].times(1.60)
    }
    G['globalAntMult'] = G['globalAntMult'].times(Decimal.pow(1 + 0.1 * Decimal.log(player.ascendShards.add(1), 10), player.constantUpgrades[5]))
    G['globalAntMult'] = G['globalAntMult'].times(Decimal.pow(1e5, CalcECC('ascension', player.challengecompletions[11])))
    if (player.researches[147] > 0) {
        G['globalAntMult'] = G['globalAntMult'].times(Decimal.log(player.antPoints.add(10), 10))
    }
    if (player.researches[177] > 0) {
        G['globalAntMult'] = G['globalAntMult'].times(Decimal.pow(Decimal.log(player.antPoints.add(10), 10), player.researches[177]))
    }

    if (player.currentChallenge.ascension === 12) {
        G['globalAntMult'] = Decimal.pow(G['globalAntMult'], 0.5)
    }
    if (player.currentChallenge.ascension === 13) {
        G['globalAntMult'] = Decimal.pow(G['globalAntMult'], 0.23)
    }
    if (player.currentChallenge.ascension === 14) {
        G['globalAntMult'] = Decimal.pow(G['globalAntMult'], 0.2)
    }

    G['globalAntMult'] = Decimal.pow(G['globalAntMult'], 1 - 0.9 / 90 * Math.min(99, sumContents(player.usedCorruptions)))
    G['globalAntMult'] = Decimal.pow(G['globalAntMult'], G['extinctionMultiplier'][player.usedCorruptions[7]])
    G['globalAntMult'] = G['globalAntMult'].times(G['challenge15Rewards'].antSpeed)

    if (player.platonicUpgrades[12] > 0) {
        G['globalAntMult'] = G['globalAntMult'].times(Decimal.pow(1 + 1 / 100 * player.platonicUpgrades[12], sumContents(player.highestchallengecompletions)))
    }
    if (player.currentChallenge.ascension === 15 && player.platonicUpgrades[10] > 0) {
        G['globalAntMult'] = Decimal.pow(G['globalAntMult'], 1.25)
    }

    G['globalConstantMult'] = new Decimal("1")
    G['globalConstantMult'] = G['globalConstantMult'].times(Decimal.pow(1.05, player.constantUpgrades[1]))
    G['globalConstantMult'] = G['globalConstantMult'].times(Decimal.pow(1 + 0.001 * Math.min(100, player.constantUpgrades[2]), player.ascendBuilding1.owned + player.ascendBuilding2.owned + player.ascendBuilding3.owned + player.ascendBuilding4.owned + player.ascendBuilding5.owned))
    G['globalConstantMult'] = G['globalConstantMult'].times(1 + 2 / 100 * player.researches[139])
    G['globalConstantMult'] = G['globalConstantMult'].times(1 + 3 / 100 * player.researches[154])
    G['globalConstantMult'] = G['globalConstantMult'].times(1 + 4 / 100 * player.researches[169])
    G['globalConstantMult'] = G['globalConstantMult'].times(1 + 5 / 100 * player.researches[184])
    G['globalConstantMult'] = G['globalConstantMult'].times(1 + 10 / 100 * player.researches[199])
    G['globalConstantMult'] = G['globalConstantMult'].times(G['challenge15Rewards'].constantBonus)
    if (player.platonicUpgrades[5] > 0) {
        G['globalConstantMult'] = G['globalConstantMult'].times(2)
    }
    if (player.platonicUpgrades[10] > 0) {
        G['globalConstantMult'] = G['globalConstantMult'].times(10)
    }
    if (player.platonicUpgrades[15] > 0) {
        G['globalConstantMult'] = G['globalConstantMult'].times(1e5)
    }
}

export const resourceGain = (dt: number): void => {

    calculateTotalCoinOwned();
    calculateTotalAcceleratorBoost();

    updateAllTick();
    updateAllMultiplier();
    multipliers();
    calculatetax();
    if (G['produceTotal'].gte(0.001)) {
        const addcoin = Decimal.min(G['produceTotal'].dividedBy(G['taxdivisor']), Decimal.pow(10, G['maxexponent'] - Decimal.log(G['taxdivisorcheck'], 10)))
        player.coins = player.coins.add(addcoin.times(dt / 0.025));
        player.coinsThisPrestige = player.coinsThisPrestige.add(addcoin.times(dt / 0.025));
        player.coinsThisTranscension = player.coinsThisTranscension.add(addcoin.times(dt / 0.025));
        player.coinsThisReincarnation = player.coinsThisReincarnation.add(addcoin.times(dt / 0.025));
        player.coinsTotal = player.coinsTotal.add(addcoin.times(dt / 0.025))
    }

    resetCurrency();
    if (player.upgrades[93] === 1 && player.coinsThisPrestige.gte(1e16)) {
        player.prestigePoints = player.prestigePoints.add(Decimal.floor(G['prestigePointGain'].dividedBy(4000).times(dt / 0.025)))
    }
    if (player.upgrades[100] === 1 && player.coinsThisTranscension.gte(1e100)) {
        player.transcendPoints = player.transcendPoints.add(Decimal.floor(G['transcendPointGain'].dividedBy(4000).times(dt / 0.025)))
    }
    if (player.cubeUpgrades[28] > 0 && player.transcendShards.gte(1e300)) {
        player.reincarnationPoints = player.reincarnationPoints.add(Decimal.floor(G['reincarnationPointGain'].dividedBy(4000).times(dt / 0.025)))
    }
    G['produceFirstDiamonds'] = player.firstGeneratedDiamonds.add(player.firstOwnedDiamonds).times(player.firstProduceDiamonds).times(G['globalCrystalMultiplier'])
    G['produceSecondDiamonds'] = player.secondGeneratedDiamonds.add(player.secondOwnedDiamonds).times(player.secondProduceDiamonds).times(G['globalCrystalMultiplier'])
    G['produceThirdDiamonds'] = player.thirdGeneratedDiamonds.add(player.thirdOwnedDiamonds).times(player.thirdProduceDiamonds).times(G['globalCrystalMultiplier'])
    G['produceFourthDiamonds'] = player.fourthGeneratedDiamonds.add(player.fourthOwnedDiamonds).times(player.fourthProduceDiamonds).times(G['globalCrystalMultiplier'])
    G['produceFifthDiamonds'] = player.fifthGeneratedDiamonds.add(player.fifthOwnedDiamonds).times(player.fifthProduceDiamonds).times(G['globalCrystalMultiplier'])

    player.fourthGeneratedDiamonds = player.fourthGeneratedDiamonds.add(G['produceFifthDiamonds'].times(dt / 0.025))
    player.thirdGeneratedDiamonds = player.thirdGeneratedDiamonds.add(G['produceFourthDiamonds'].times(dt / 0.025))
    player.secondGeneratedDiamonds = player.secondGeneratedDiamonds.add(G['produceThirdDiamonds'].times(dt / 0.025))
    player.firstGeneratedDiamonds = player.firstGeneratedDiamonds.add(G['produceSecondDiamonds'].times(dt / 0.025))
    G['produceDiamonds'] = G['produceFirstDiamonds'];

    if (player.currentChallenge.transcension !== 3 && player.currentChallenge.reincarnation !== 10) {
        player.prestigeShards = player.prestigeShards.add(G['produceDiamonds'].times(dt / 0.025))
    }

    G['produceFifthMythos'] = player.fifthGeneratedMythos.add(player.fifthOwnedMythos).times(player.fifthProduceMythos).times(G['globalMythosMultiplier']).times(G['grandmasterMultiplier']).times(G['mythosupgrade15'])
    G['produceFourthMythos'] = player.fourthGeneratedMythos.add(player.fourthOwnedMythos).times(player.fourthProduceMythos).times(G['globalMythosMultiplier'])
    G['produceThirdMythos'] = player.thirdGeneratedMythos.add(player.thirdOwnedMythos).times(player.thirdProduceMythos).times(G['globalMythosMultiplier']).times(G['mythosupgrade14'])
    G['produceSecondMythos'] = player.secondGeneratedMythos.add(player.secondOwnedMythos).times(player.secondProduceMythos).times(G['globalMythosMultiplier'])
    G['produceFirstMythos'] = player.firstGeneratedMythos.add(player.firstOwnedMythos).times(player.firstProduceMythos).times(G['globalMythosMultiplier']).times(G['mythosupgrade13'])
    player.fourthGeneratedMythos = player.fourthGeneratedMythos.add(G['produceFifthMythos'].times(dt / 0.025));
    player.thirdGeneratedMythos = player.thirdGeneratedMythos.add(G['produceFourthMythos'].times(dt / 0.025));
    player.secondGeneratedMythos = player.secondGeneratedMythos.add(G['produceThirdMythos'].times(dt / 0.025));
    player.firstGeneratedMythos = player.firstGeneratedMythos.add(G['produceSecondMythos'].times(dt / 0.025));


    G['produceMythos'] = new Decimal("0");
    G['produceMythos'] = (player.firstGeneratedMythos.add(player.firstOwnedMythos)).times(player.firstProduceMythos).times(G['globalMythosMultiplier']).times(G['mythosupgrade13']);
    G['producePerSecondMythos'] = G['produceMythos'].times(40);

    let pm = new Decimal('1');
    if (player.upgrades[67] > 0.5) {
        pm = pm.times(Decimal.pow(1.03, player.firstOwnedParticles + player.secondOwnedParticles + player.thirdOwnedParticles + player.fourthOwnedParticles + player.fifthOwnedParticles))
    }
    G['produceFifthParticles'] = player.fifthGeneratedParticles.add(player.fifthOwnedParticles).times(player.fifthProduceParticles)
    G['produceFourthParticles'] = player.fourthGeneratedParticles.add(player.fourthOwnedParticles).times(player.fourthProduceParticles)
    G['produceThirdParticles'] = player.thirdGeneratedParticles.add(player.thirdOwnedParticles).times(player.thirdProduceParticles)
    G['produceSecondParticles'] = player.secondGeneratedParticles.add(player.secondOwnedParticles).times(player.secondProduceParticles)
    G['produceFirstParticles'] = player.firstGeneratedParticles.add(player.firstOwnedParticles).times(player.firstProduceParticles).times(pm)
    player.fourthGeneratedParticles = player.fourthGeneratedParticles.add(G['produceFifthParticles'].times(dt / 0.025));
    player.thirdGeneratedParticles = player.thirdGeneratedParticles.add(G['produceFourthParticles'].times(dt / 0.025));
    player.secondGeneratedParticles = player.secondGeneratedParticles.add(G['produceThirdParticles'].times(dt / 0.025));
    player.firstGeneratedParticles = player.firstGeneratedParticles.add(G['produceSecondParticles'].times(dt / 0.025));

    G['produceParticles'] = new Decimal("0");
    G['produceParticles'] = (player.firstGeneratedParticles.add(player.firstOwnedParticles)).times(player.firstProduceParticles).times(pm);
    G['producePerSecondParticles'] = G['produceParticles'].times(40);

    if (player.currentChallenge.transcension !== 3 && player.currentChallenge.reincarnation !== 10) {
        player.transcendShards = player.transcendShards.add(G['produceMythos'].times(dt / 0.025));
    }
    if (player.currentChallenge.reincarnation !== 10) {
        player.reincarnationShards = player.reincarnationShards.add(G['produceParticles'].times(dt / 0.025))
    }

    G['antEightProduce'] = player.eighthGeneratedAnts.add(player.eighthOwnedAnts).times(player.eighthProduceAnts).times(G['globalAntMult'])
    G['antSevenProduce'] = player.seventhGeneratedAnts.add(player.seventhOwnedAnts).times(player.seventhProduceAnts).times(G['globalAntMult'])
    G['antSixProduce'] = player.sixthGeneratedAnts.add(player.sixthOwnedAnts).times(player.sixthProduceAnts).times(G['globalAntMult'])
    G['antFiveProduce'] = player.fifthGeneratedAnts.add(player.fifthOwnedAnts).times(player.fifthProduceAnts).times(G['globalAntMult'])
    G['antFourProduce'] = player.fourthGeneratedAnts.add(player.fourthOwnedAnts).times(player.fourthProduceAnts).times(G['globalAntMult'])
    G['antThreeProduce'] = player.thirdGeneratedAnts.add(player.thirdOwnedAnts).times(player.thirdProduceAnts).times(G['globalAntMult'])
    G['antTwoProduce'] = player.secondGeneratedAnts.add(player.secondOwnedAnts).times(player.secondProduceAnts).times(G['globalAntMult'])
    G['antOneProduce'] = player.firstGeneratedAnts.add(player.firstOwnedAnts).times(player.firstProduceAnts).times(G['globalAntMult'])
    player.seventhGeneratedAnts = player.seventhGeneratedAnts.add(G['antEightProduce'].times(dt / 1))
    player.sixthGeneratedAnts = player.sixthGeneratedAnts.add(G['antSevenProduce'].times(dt / 1))
    player.fifthGeneratedAnts = player.fifthGeneratedAnts.add(G['antSixProduce'].times(dt / 1))
    player.fourthGeneratedAnts = player.fourthGeneratedAnts.add(G['antFiveProduce'].times(dt / 1))
    player.thirdGeneratedAnts = player.thirdGeneratedAnts.add(G['antFourProduce'].times(dt / 1))
    player.secondGeneratedAnts = player.secondGeneratedAnts.add(G['antThreeProduce'].times(dt / 1))
    player.firstGeneratedAnts = player.firstGeneratedAnts.add(G['antTwoProduce'].times(dt / 1))

    player.antPoints = player.antPoints.add(G['antOneProduce'].times(dt / 1))

    for (let i = 1; i <= 5; i++) {
        G['ascendBuildingProduction'][G['ordinals'][5 - i] as keyof typeof G['ascendBuildingProduction']] = (player['ascendBuilding' + (6 - i)]['generated']).add(player['ascendBuilding' + (6 - i)]['owned']).times(player['ascendBuilding' + i]['multiplier']).times(G['globalConstantMult'])

        if (i !== 5) {
            player['ascendBuilding' + (5 - i)]['generated'] = player['ascendBuilding' + (5 - i)]['generated']
                .add(G['ascendBuildingProduction'][G['ordinals'][5 - i] as keyof typeof G['ascendBuildingProduction']].times(dt))
        }
    }

    player.ascendShards = player.ascendShards.add(G['ascendBuildingProduction'].first.times(dt))

    if (player.ascensionCount > 0) {
        ascensionAchievementCheck(2)
    }

    if (player.researches[71] > 0.5 && player.challengecompletions[1] < (Math.min(player.highestchallengecompletions[1], 25 + 5 * player.researches[66] + 925 * player.researches[105])) && player.coins.gte(Decimal.pow(10, 1.25 * G['challengeBaseRequirements'][0] * Math.pow(1 + player.challengecompletions[1], 2)))) {
        player.challengecompletions[1] += 1;
        challengeDisplay(1, false);
        challengeachievementcheck(1, true)
        updateChallengeLevel(1)
    }
    if (player.researches[72] > 0.5 && player.challengecompletions[2] < (Math.min(player.highestchallengecompletions[2], 25 + 5 * player.researches[67] + 925 * player.researches[105])) && player.coins.gte(Decimal.pow(10, 1.6 * G['challengeBaseRequirements'][1] * Math.pow(1 + player.challengecompletions[2], 2)))) {
        player.challengecompletions[2] += 1
        challengeDisplay(2, false)
        challengeachievementcheck(2, true)
        updateChallengeLevel(2)
    }
    if (player.researches[73] > 0.5 && player.challengecompletions[3] < (Math.min(player.highestchallengecompletions[3], 25 + 5 * player.researches[68] + 925 * player.researches[105])) && player.coins.gte(Decimal.pow(10, 1.7 * G['challengeBaseRequirements'][2] * Math.pow(1 + player.challengecompletions[3], 2)))) {
        player.challengecompletions[3] += 1
        challengeDisplay(3, false)
        challengeachievementcheck(3, true)
        updateChallengeLevel(3)
    }
    if (player.researches[74] > 0.5 && player.challengecompletions[4] < (Math.min(player.highestchallengecompletions[4], 25 + 5 * player.researches[69] + 925 * player.researches[105])) && player.coins.gte(Decimal.pow(10, 1.45 * G['challengeBaseRequirements'][3] * Math.pow(1 + player.challengecompletions[4], 2)))) {
        player.challengecompletions[4] += 1
        challengeDisplay(4, false)
        challengeachievementcheck(4, true)
        updateChallengeLevel(4)
    }
    if (player.researches[75] > 0.5 && player.challengecompletions[5] < (Math.min(player.highestchallengecompletions[5], 25 + 5 * player.researches[70] + 925 * player.researches[105])) && player.coins.gte(Decimal.pow(10, 2 * G['challengeBaseRequirements'][4] * Math.pow(1 + player.challengecompletions[5], 2)))) {
        player.challengecompletions[5] += 1
        challengeDisplay(5, false)
        challengeachievementcheck(5, true)
        updateChallengeLevel(5)
    }

    if (player.coins.gte(1000) && player.unlocks.coinone === false) {
        player.unlocks.coinone = true;
        revealStuff();
    }
    if (player.coins.gte(20000) && player.unlocks.cointwo === false) {
        player.unlocks.cointwo = true;
        revealStuff();
    }
    if (player.coins.gte(100000) && player.unlocks.cointhree === false) {
        player.unlocks.cointhree = true;
        revealStuff();
    }
    if (player.coins.gte(8e6) && player.unlocks.coinfour === false) {
        player.unlocks.coinfour = true;
        revealStuff();
    }
    if (player.antPoints.gte(3) && player.achievements[169] === 0) {
        achievementaward(169)
    }
    if (player.antPoints.gte(1e5) && player.achievements[170] === 0) {
        achievementaward(170)
    }
    if (player.antPoints.gte(666666666) && player.achievements[171] === 0) {
        achievementaward(171)
    }
    if (player.antPoints.gte(1e20) && player.achievements[172] === 0) {
        achievementaward(172)
    }
    if (player.antPoints.gte(1e40) && player.achievements[173] === 0) {
        achievementaward(173)
    }
    if (player.antPoints.gte("1e500") && player.achievements[174] === 0) {
        achievementaward(174)
    }
    if (player.antPoints.gte("1e2500") && player.achievements[175] === 0) {
        achievementaward(175)
    }

    const chal = player.currentChallenge.transcension;
    const reinchal = player.currentChallenge.reincarnation;
    const ascendchal = player.currentChallenge.ascension;
    if (chal !== 0) {
        if (player.coinsThisTranscension.gte(challengeRequirement(chal, player.challengecompletions[chal], chal))) { 
            resetCheck('challenge', false);
            G['autoChallengeTimerIncrement'] = 0;
        }
    }
    if (reinchal < 9 && reinchal !== 0) {
        if (player.transcendShards.gte(challengeRequirement(reinchal, player.challengecompletions[reinchal], reinchal))) {
            resetCheck('reincarnationchallenge', false)
            G['autoChallengeTimerIncrement'] = 0;
            if (player.challengecompletions[reinchal] >= (25 + 5 * player.cubeUpgrades[29] + 2 * player.shopUpgrades.challengeExtension)) {
                player.autoChallengeIndex += 1
            }
        }
    }
    if (reinchal >= 9) {
        if (player.coins.gte(challengeRequirement(reinchal, player.challengecompletions[reinchal], reinchal))) {
            resetCheck('reincarnationchallenge', false)
            G['autoChallengeTimerIncrement'] = 0;
            if (player.challengecompletions[reinchal] >= (25 + 5 * player.cubeUpgrades[29] + 2 * player.shopUpgrades.challengeExtension)) {
                player.autoChallengeIndex += 1
                if (player.autoChallengeIndex > 10) {
                    player.autoChallengeIndex = 1
                }
            }
        }
    }
    if (ascendchal !== 0 && ascendchal < 15) {
        if (player.challengecompletions[10] >= challengeRequirement(ascendchal, player.challengecompletions[ascendchal], ascendchal)) {
            resetCheck('ascensionChallenge', false)
            challengeachievementcheck(ascendchal, true)
        }
    }
    if (ascendchal === 15) {
        if (player.coins.gte(challengeRequirement(ascendchal, player.challengecompletions[ascendchal], ascendchal))) {
            resetCheck('ascensionChallenge', false)
        }
    }
}

export const resetCurrency = (): void => {
    let prestigePow = 0.5 + CalcECC('transcend', player.challengecompletions[5]) / 100
    let transcendPow = 0.03

    // Calculates the conversion exponent for resets (Challenges 5 and 10 reduce the exponent accordingly).
    if (player.currentChallenge.transcension === 5) {
        prestigePow = 0.01 / (1 + player.challengecompletions[5]);
        transcendPow = 0.001;
    }
    if (player.currentChallenge.reincarnation === 10) {
        prestigePow = (1e-4) / (1 + player.challengecompletions[10]);
        transcendPow = 0.001;
    }
    prestigePow *= G['deflationMultiplier'][player.usedCorruptions[6]]
    //Prestige Point Formulae
    G['prestigePointGain'] = Decimal.floor(Decimal.pow(player.coinsThisPrestige.dividedBy(1e12), prestigePow));
    if (player.upgrades[16] > 0.5 && player.currentChallenge.transcension !== 5 && player.currentChallenge.reincarnation !== 10) {
        G['prestigePointGain'] = G['prestigePointGain'].times(Decimal.min(Decimal.pow(10, 1e33), Decimal.pow(G['acceleratorEffect'], 1 / 3 * G['deflationMultiplier'][player.usedCorruptions[6]])));
    }

    //Transcend Point Formulae
    G['transcendPointGain'] = Decimal.floor(Decimal.pow(player.coinsThisTranscension.dividedBy(1e100), transcendPow));
    if (player.upgrades[44] > 0.5 && player.currentChallenge.transcension !== 5 && player.currentChallenge.reincarnation !== 10) {
        G['transcendPointGain'] = G['transcendPointGain'].times(Decimal.min(1e6, Decimal.pow(1.01, player.transcendCount)));
    }

    //Reincarnation Point Formulae
    G['reincarnationPointGain'] = Decimal.floor(Decimal.pow(player.transcendShards.dividedBy(1e300), 0.01));
    if (player.currentChallenge.reincarnation !== 0) {
        G['reincarnationPointGain'] = Decimal.pow(G['reincarnationPointGain'], 0.01)
    }
    if (player.achievements[50] === 1) {
        G['reincarnationPointGain'] = G['reincarnationPointGain'].times(2)
    }
    if (player.upgrades[65] > 0.5) {
        G['reincarnationPointGain'] = G['reincarnationPointGain'].times(5)
    }
    if (player.currentChallenge.ascension === 12) {
        G['reincarnationPointGain'] = new Decimal("0")
    }
}

export const resetCheck = async (i: string, manual = true, leaving = false): Promise<void> => {
    if (i === 'prestige') {
        if (player.coinsThisPrestige.gte(1e16) || G['prestigePointGain'].gte(100)) {
            if (manual) {
                resetConfirmation('prestige');
            } else {
                resetachievementcheck(1);
                reset("prestige");
            }
        }
    }
    if (i === 'transcend') {
        if ((player.coinsThisTranscension.gte(1e100) || G['transcendPointGain'].gte(0.5)) && player.currentChallenge.transcension === 0) {
            if (manual) {
                resetConfirmation('transcend');
            }
            if (!manual) {
                resetachievementcheck(2);
                reset("transcension");
            }
        }
    }
    if (i === 'challenge') {
        const q = player.currentChallenge.transcension;
        const maxCompletions = getMaxChallenges(q);
        if (player.currentChallenge.transcension !== 0) {
            const reqCheck = (comp: number) => player.coinsThisTranscension.gte(challengeRequirement(q, comp, q));

            if (reqCheck(player.challengecompletions[q]) && player.challengecompletions[q] < maxCompletions) {
                const maxInc = player.shopUpgrades.instantChallenge > 0 && player.currentChallenge.ascension !== 13 ? 10 : 1; // TODO: Implement the shop upgrade levels here
                let counter = 0;
                let comp = player.challengecompletions[q];
                while (counter < maxInc) {
                    if (reqCheck(comp) && comp < maxCompletions) {
                        comp++;
                    }
                    counter++;
                }
                player.challengecompletions[q] = comp;
                challengeDisplay(q, false)
                updateChallengeLevel(q)
            }
            if (player.challengecompletions[q] > player.highestchallengecompletions[q]) {
                while (player.challengecompletions[q] > player.highestchallengecompletions[q]) {
                    player.highestchallengecompletions[q] += 1;
                    challengeDisplay(q, false)
                    updateChallengeLevel(q)
                    highestChallengeRewards(q, player.highestchallengecompletions[q])
                    calculateCubeBlessings();
                }

            }

            challengeachievementcheck(q);
            if (player.shopUpgrades.instantChallenge === 0 || leaving) {
                reset("transcensionChallenge", false, "leaveChallenge");
                player.transcendCount -= 1;
            }

        }
        if (!player.retrychallenges || manual || player.challengecompletions[q] >= (maxCompletions)) {
            player.currentChallenge.transcension = 0;
            updateChallengeDisplay();
        }
    }

    if (i === "reincarnate") {
        if (G['reincarnationPointGain'].gt(0.5) && player.currentChallenge.transcension === 0 && player.currentChallenge.reincarnation === 0) {
            if (manual) {
                resetConfirmation('reincarnate');
            }
            if (!manual) {
                resetachievementcheck(3);
                reset("reincarnation");
            }
        }
    }
    if (i === "reincarnationchallenge" && player.currentChallenge.reincarnation !== 0) {
        const q = player.currentChallenge.reincarnation;
        const maxCompletions = getMaxChallenges(q);
        if (player.currentChallenge.transcension !== 0) {
            player.currentChallenge.transcension = 0
        }
        const reqCheck = (comp: number) => {
            if (q <= 8) {
                return player.transcendShards.gte(challengeRequirement(q, comp, q))
            } else { // challenges 9 and 10
                return player.coins.gte(challengeRequirement(q, comp, q))
            }
        }
        if (reqCheck(player.challengecompletions[q]) && player.challengecompletions[q] < maxCompletions) {
            const maxInc = player.shopUpgrades.instantChallenge > 0 && player.currentChallenge.ascension !== 13 ? 10 : 1; // TODO: Implement the shop upgrade levels here
            let counter = 0;
            let comp = player.challengecompletions[q];
            while (counter < maxInc) {
                if (reqCheck(comp) && comp < maxCompletions) {
                    comp++;
                }
                counter++;
            }
            player.challengecompletions[q] = comp;
            challengeDisplay(q, true);
            updateChallengeLevel(q);
        }
        if (player.shopUpgrades.instantChallenge === 0 || leaving) { // TODO: Implement the upgrade levels here
            reset("reincarnationChallenge", false, "leaveChallenge");
            player.reincarnationCount -= 1;
        }
        challengeachievementcheck(q);
        if (player.challengecompletions[q] > player.highestchallengecompletions[q]) {
            while (player.challengecompletions[q] > player.highestchallengecompletions[q]) {
                player.highestchallengecompletions[q] += 1;
                highestChallengeRewards(q, player.highestchallengecompletions[q])
                calculateHypercubeBlessings();
                calculateTesseractBlessings();
                calculateCubeBlessings();
            }
        }
        if (!player.retrychallenges || manual || player.challengecompletions[q] > 24 + 5 * player.cubeUpgrades[29] + 2 * player.shopUpgrades.challengeExtension + 5 * player.platonicUpgrades[5] + 5 * player.platonicUpgrades[10] + 10 * player.platonicUpgrades[15]) {
            reset("reincarnationChallenge", false, "leaveChallenge");
            player.currentChallenge.reincarnation = 0;
            if (player.shopUpgrades.instantChallenge > 0) {
                for (let i = 1; i <= 5; i++) {
                    player.challengecompletions[i] = player.highestchallengecompletions[i];
                }
            }
            updateChallengeDisplay();
            calculateRuneLevels();
            calculateAnts();
        }
    }

    if (i === "ascend") {
        if (player.challengecompletions[10] > 0) {
            if (manual) {
                resetConfirmation('ascend');
            }
        }
    }

    if (i === "ascensionChallenge" && player.currentChallenge.ascension !== 0) {
        let conf = true
        if (manual) {
            conf = await Confirm('Are you absolutely sure that you want to exit the Ascension Challenge? You will need to clear challenge 10 again before you can attempt the challenge again!')
        }
        if (!conf) {
            return;
        }
        const a = player.currentChallenge.ascension;
        const r = player.currentChallenge.reincarnation;
        const t = player.currentChallenge.transcension;

        if (player.challengecompletions[10] >= 50 && a === 11 && player.usedCorruptions[7] >= 5 && player.achievements[247] < 1) {
            achievementaward(247)
        }

        const maxCompletions = getMaxChallenges(a)
        if (a !== 0 && a < 15) {
            if (player.challengecompletions[10] >= challengeRequirement(a, player.challengecompletions[a], a) && player.challengecompletions[a] < maxCompletions) {
                player.challengecompletions[a] += 1;
            }
        }
        if (a === 15) {
            if (player.coins.gte(challengeRequirement(a, player.challengecompletions[a], a)) && player.challengecompletions[a] < maxCompletions) {
                player.challengecompletions[a] += 1;
            } else {
                if (player.coins.gte(Decimal.pow(10, player.challenge15Exponent))) {
                    player.challenge15Exponent = Decimal.log(player.coins.add(1), 10);
                    c15RewardUpdate();
                }
            }
        }
        if (r !== 0) {
            // bandaid
            if (typeof player.currentChallenge === 'string') {
                player.currentChallenge = { ...blankSave.currentChallenge };
            }
        }
        if (t !== 0) {
            player.currentChallenge.transcension = 0;
        }
        challengeDisplay(a, true)
        reset("ascensionChallenge")

        if (player.challengecompletions[a] > player.highestchallengecompletions[a]) {
            player.highestchallengecompletions[a] += 1;
            player.wowHypercubes += 1;
        }

        if (!player.retrychallenges || manual || player.challengecompletions[a] >= maxCompletions || a === 15) {
            player.currentChallenge.ascension = 0;
        }
        updateChallengeDisplay();
        challengeachievementcheck(a, true)
    }
}

export const resetConfirmation = async (i: string): Promise<void> => {
    if (i === 'prestige') {
        if (player.toggles[28] === true) {
            const r = await Confirm("Prestige will reset coin upgrades, coin producers AND crystals. The first prestige unlocks new features. Would you like to prestige? [Toggle this message in settings.]")
            if (r === true) {
                resetachievementcheck(1);
                reset("prestige");
            }
        } else {
            resetachievementcheck(1);
            reset("prestige");
        }
    }
    if (i === 'transcend') {
        if (player.toggles[29] === true) {
            const z = await Confirm("Transcends will reset coin and prestige upgrades, coin producers, crystal producers AND diamonds. The first transcension unlocks new features. Would you like to prestige? [Toggle this message in settings.]")
            if (z === true) {
                resetachievementcheck(2);
                reset("transcension");
            }
        } else {
            resetachievementcheck(2);
            reset("transcension");
        }
    }
    if (i === 'reincarnate') {
        if (player.currentChallenge.ascension !== 12) {
            if (player.toggles[30] === true) {
                const z = await Confirm("Reincarnating will reset EVERYTHING but in return you will get extraordinarily powerful Particles, and unlock some very strong upgrades and some new features. would you like to Reincarnate? [Disable this message in settings]")
                if (z === true) {
                    resetachievementcheck(3);
                    reset("reincarnation");
                }
            } else {
                resetachievementcheck(3);
                reset("reincarnation");
            }
        }
    }
    if (i === 'ascend') {
        const z = !player.toggles[31] || 
                  await Confirm("Ascending will reset all buildings, rune levels [NOT CAP!], talismans, most researches, and the anthill feature for Cubes of Power. Continue? [It is strongly advised you get R5x24 first.]")
        if (z) {
            reset("ascension");
        }
    }
}

export const updateAll = (): void => {
    G['uFourteenMulti'] = new Decimal(1);
    G['uFifteenMulti'] = new Decimal(1);

    if (player.upgrades[14] > 0.5) {
        G['uFourteenMulti'] = Decimal.pow(1.15, G['freeAccelerator'])
    }
    if (player.upgrades[15] > 0.5) {
        G['uFifteenMulti'] = Decimal.pow(1.15, G['freeAccelerator'])
    }

    if (player.researches[200] >= 1e5 && player.achievements[250] < 1) {
        achievementaward(250)
    }
    if (player.cubeUpgrades[50] >= 1e5 && player.achievements[251] < 1) {
        achievementaward(251)
    }

//Autobuy "Building" Tab

    if (player.toggles[1] === true && player.upgrades[81] === 1 && player.coins.gte(player.firstCostCoin)) {
        buyMax('first', 'Coin', 1, 100)
    }
    if (player.toggles[2] === true && player.upgrades[82] === 1 && player.coins.gte(player.secondCostCoin)) {
        buyMax('second', 'Coin', 2, 2e3)
    }
    if (player.toggles[3] === true && player.upgrades[83] === 1 && player.coins.gte(player.thirdCostCoin)) {
        buyMax('third', 'Coin', 3, 4e4)
    }
    if (player.toggles[4] === true && player.upgrades[84] === 1 && player.coins.gte(player.fourthCostCoin)) {
        buyMax('fourth', 'Coin', 4, 8e5)
    }
    if (player.toggles[5] === true && player.upgrades[85] === 1 && player.coins.gte(player.fifthCostCoin)) {
        buyMax('fifth', 'Coin', 5, 1.6e7)
    }
    if (player.toggles[6] === true && player.upgrades[86] === 1 && player.coins.gte(player.acceleratorCost)) {
        buyAccelerator(true);
    }
    if (player.toggles[7] === true && player.upgrades[87] === 1 && player.coins.gte(player.multiplierCost)) {
        buyMultiplier(true);
    }
    if (player.toggles[8] === true && player.upgrades[88] === 1 && player.prestigePoints.gte(player.acceleratorBoostCost)) {
        boostAccelerator(true);
    }

//Autobuy "Prestige" Tab

    if (player.toggles[10] === true && player.achievements[78] === 1 && player.prestigePoints.gte(player.firstCostDiamonds)) {
        buyMax('first', 'Diamonds', 1, 1e2)
    }
    if (player.toggles[11] === true && player.achievements[85] === 1 && player.prestigePoints.gte(player.secondCostDiamonds)) {
        buyMax('second', 'Diamonds', 3, 1e5)
    }
    if (player.toggles[12] === true && player.achievements[92] === 1 && player.prestigePoints.gte(player.thirdCostDiamonds)) {
        buyMax('third', 'Diamonds', 6, 1e15)
    }
    if (player.toggles[13] === true && player.achievements[99] === 1 && player.prestigePoints.gte(player.fourthCostDiamonds)) {
        buyMax('fourth', 'Diamonds', 10, 1e40)
    }
    if (player.toggles[14] === true && player.achievements[106] === 1 && player.prestigePoints.gte(player.fifthCostDiamonds)) {
        buyMax('fifth', 'Diamonds', 15, 1e100)
    }

    let c = 0;
    c += Math.floor(G['rune3level'] / 16 * G['effectiveLevelMult']) * 100 / 100
    if (player.upgrades[73] > 0.5 && player.currentChallenge.reincarnation !== 0) {
        c += 10
    }
    if (player.achievements[79] > 0.5 && player.prestigeShards.gte(Decimal.pow(10, (G['crystalUpgradesCost'][0] + G['crystalUpgradeCostIncrement'][0] * Math.floor(Math.pow(player.crystalUpgrades[0] - 0.5 - c, 2) / 2))))) {
        buyCrystalUpgrades(1, true)
    }
    if (player.achievements[86] > 0.5 && player.prestigeShards.gte(Decimal.pow(10, (G['crystalUpgradesCost'][1] + G['crystalUpgradeCostIncrement'][1] * Math.floor(Math.pow(player.crystalUpgrades[1] - 0.5 - c, 2) / 2))))) {
        buyCrystalUpgrades(2, true)
    }
    if (player.achievements[93] > 0.5 && player.prestigeShards.gte(Decimal.pow(10, (G['crystalUpgradesCost'][2] + G['crystalUpgradeCostIncrement'][2] * Math.floor(Math.pow(player.crystalUpgrades[2] - 0.5 - c, 2) / 2))))) {
        buyCrystalUpgrades(3, true)
    }
    if (player.achievements[100] > 0.5 && player.prestigeShards.gte(Decimal.pow(10, (G['crystalUpgradesCost'][3] + G['crystalUpgradeCostIncrement'][3] * Math.floor(Math.pow(player.crystalUpgrades[3] - 0.5 - c, 2) / 2))))) {
        buyCrystalUpgrades(4, true)
    }
    if (player.achievements[107] > 0.5 && player.prestigeShards.gte(Decimal.pow(10, (G['crystalUpgradesCost'][4] + G['crystalUpgradeCostIncrement'][4] * Math.floor(Math.pow(player.crystalUpgrades[4] - 0.5 - c, 2) / 2))))) {
        buyCrystalUpgrades(5, true)
    }

//Autobuy "Transcension" Tab

    if (player.toggles[16] === true && player.upgrades[94] === 1 && player.transcendPoints.gte(player.firstCostMythos)) {
        buyMax('first', 'Mythos', 1, 1)
    }
    if (player.toggles[17] === true && player.upgrades[95] === 1 && player.transcendPoints.gte(player.secondCostMythos)) {
        buyMax('second', 'Mythos', 3, 1e2)
    }
    if (player.toggles[18] === true && player.upgrades[96] === 1 && player.transcendPoints.gte(player.thirdCostMythos)) {
        buyMax('third', 'Mythos', 6, 1e4)
    }
    if (player.toggles[19] === true && player.upgrades[97] === 1 && player.transcendPoints.gte(player.fourthCostMythos)) {
        buyMax('fourth', 'Mythos', 10, 1e8)
    }
    if (player.toggles[20] === true && player.upgrades[98] === 1 && player.transcendPoints.gte(player.fifthCostMythos)) {
        buyMax('fifth', 'Mythos', 15, 1e16)
    }

//Autobuy "Reincarnation" Tab

    if (player.toggles[22] === true && player.reincarnationPoints.gte(player.firstCostParticles)) {
        buyParticleBuilding('first', 1, true)
    }
    if (player.toggles[23] === true && player.reincarnationPoints.gte(player.secondCostParticles)) {
        buyParticleBuilding('second', 1e2, true)
    }
    if (player.toggles[24] === true && player.reincarnationPoints.gte(player.thirdCostParticles)) {
        buyParticleBuilding('third', 1e4, true)
    }
    if (player.toggles[25] === true && player.reincarnationPoints.gte(player.fourthCostParticles)) {
        buyParticleBuilding('fourth', 1e8, true)
    }
    if (player.toggles[26] === true && player.reincarnationPoints.gte(player.fifthCostParticles)) {
        buyParticleBuilding('fifth', 1e16, true)
    }

//Autobuy "ascension" tab
    if (player.researches[175] > 0) {
        for (let i = 1; i <= 10; i++) {
            if (player.ascendShards.gte(getConstUpgradeMetadata(i).pop())) {
                buyConstantUpgrades(i, true);
            }
        }
    }

//Loops through all buildings which have AutoBuy turned 'on' and purchases the cheapest available building that player can afford
    if ((player.researches[190] > 0) && (player.tesseractAutoBuyerToggle == 1)) {
        const cheapestTesseractBuilding = { cost:0, intCost:0, index:0, intCostArray: [1,10,100,1000,10000] };
        for (let i = 0; i < cheapestTesseractBuilding.intCostArray.length; i++){
            if ((player.wowTesseracts >= cheapestTesseractBuilding.intCostArray[i] * Math.pow(1 + player['ascendBuilding' + (i+1)]['owned'], 3) + player.tesseractAutoBuyerAmount) && player.autoTesseracts[i+1]) {
                if ((getTesseractCost(cheapestTesseractBuilding.intCostArray[i], i+1)[1] < cheapestTesseractBuilding.cost) || (cheapestTesseractBuilding.cost == 0)){
                    cheapestTesseractBuilding.cost = getTesseractCost(cheapestTesseractBuilding.intCostArray[i], i+1)[1];
                    cheapestTesseractBuilding.intCost = cheapestTesseractBuilding.intCostArray[i];
                    cheapestTesseractBuilding.index = i+1;
                }
            }
        }
        if (cheapestTesseractBuilding.index > 0){
            buyTesseractBuilding(cheapestTesseractBuilding.intCost, cheapestTesseractBuilding.index);
        }
    }


//Generation


    if (player.upgrades[101] > 0.5) {
        player.fourthGeneratedCoin = player.fourthGeneratedCoin.add((player.fifthGeneratedCoin.add(player.fifthOwnedCoin)).times(G['uFifteenMulti']).times(G['generatorPower']));
    }
    if (player.upgrades[102] > 0.5) {
        player.thirdGeneratedCoin = player.thirdGeneratedCoin.add((player.fourthGeneratedCoin.add(player.fourthOwnedCoin)).times(G['uFourteenMulti']).times(G['generatorPower']));
    }
    if (player.upgrades[103] > 0.5) {
        player.secondGeneratedCoin = player.secondGeneratedCoin.add((player.thirdGeneratedCoin.add(player.thirdOwnedCoin)).times(G['generatorPower']));
    }
    if (player.upgrades[104] > 0.5) {
        player.firstGeneratedCoin = player.firstGeneratedCoin.add((player.secondGeneratedCoin.add(player.secondOwnedCoin)).times(G['generatorPower']));
    }
    if (player.upgrades[105] > 0.5) {
        player.fifthGeneratedCoin = player.fifthGeneratedCoin.add(player.firstOwnedCoin);
    }
    let p = 1;
    p += 1 / 100 * (player.achievements[71] + player.achievements[72] + player.achievements[73] + player.achievements[74] + player.achievements[75] + player.achievements[76] + player.achievements[77])

    let a = 0;
    if (player.upgrades[106] > 0.5) {
        a += 0.10
    }
    if (player.upgrades[107] > 0.5) {
        a += 0.15
    }
    if (player.upgrades[108] > 0.5) {
        a += 0.25
    }
    if (player.upgrades[109] > 0.5) {
        a += 0.25
    }
    if (player.upgrades[110] > 0.5) {
        a += 0.25
    }
    a *= p

    let b = 0;
    if (player.upgrades[111] > 0.5) {
        b += 0.08
    }
    if (player.upgrades[112] > 0.5) {
        b += 0.08
    }
    if (player.upgrades[113] > 0.5) {
        b += 0.08
    }
    if (player.upgrades[114] > 0.5) {
        b += 0.08
    }
    if (player.upgrades[115] > 0.5) {
        b += 0.08
    }
    b *= p

    c = 0;
    if (player.upgrades[116] > 0.5) {
        c += 0.05
    }
    if (player.upgrades[117] > 0.5) {
        c += 0.05
    }
    if (player.upgrades[118] > 0.5) {
        c += 0.05
    }
    if (player.upgrades[119] > 0.5) {
        c += 0.05
    }
    if (player.upgrades[120] > 0.5) {
        c += 0.05
    }
    c *= p

    if (a !== 0) {
        player.fifthGeneratedCoin = player.fifthGeneratedCoin.add(Decimal.pow(player.firstGeneratedDiamonds.add(player.firstOwnedDiamonds).add(1), a))
    }
    if (b !== 0) {
        player.fifthGeneratedDiamonds = player.fifthGeneratedDiamonds.add(Decimal.pow(player.firstGeneratedMythos.add(player.firstOwnedMythos).add(1), b))
    }
    if (c !== 0) {
        player.fifthGeneratedMythos = player.fifthGeneratedMythos.add(Decimal.pow(player.firstGeneratedParticles.add(player.firstOwnedParticles).add(1), c))
    }

    if (player.runeshards > player.maxofferings) {
        player.maxofferings = player.runeshards;
    }
    if (player.researchPoints > player.maxobtainium) {
        player.maxobtainium = player.researchPoints;
    }

    G['effectiveLevelMult'] = 1;
    G['effectiveLevelMult'] *= (1 + player.researches[4] / 10 * (1 + 1 / 2 * CalcECC('ascension', player.challengecompletions[14]))) //Research 1x4
    G['effectiveLevelMult'] *= (1 + player.researches[21] / 100) //Research 2x6
    G['effectiveLevelMult'] *= (1 + player.researches[90] / 100) //Research 4x15
    G['effectiveLevelMult'] *= (1 + player.researches[131] / 200) //Research 6x6
    G['effectiveLevelMult'] *= (1 + player.researches[161] / 200 * 3 / 5) //Research 7x11
    G['effectiveLevelMult'] *= (1 + player.researches[176] / 200 * 2 / 5) //Research 8x1
    G['effectiveLevelMult'] *= (1 + player.researches[191] / 200 * 1 / 5) //Research 8x16
    G['effectiveLevelMult'] *= (1 + player.researches[146] / 200 * 4 / 5) //Research 6x21
    G['effectiveLevelMult'] *= (1 + 0.01 * Math.log(player.talismanShards + 1) / Math.log(4) * Math.min(1, player.constantUpgrades[9]))
    G['effectiveLevelMult'] *= G['challenge15Rewards'].runeBonus

    G['optimalOfferingTimer'] = 600 + 30 * player.researches[85] + 0.4 * G['rune5level'] + 120 * player.shopUpgrades.offeringEX;
    G['optimalObtainiumTimer'] = 3600 + 120 * player.shopUpgrades.obtainiumEX;
    autoBuyAnts()

    if (player.autoAscend) {
        if (player.autoAscendMode === "c10Completions" && player.challengecompletions[10] >= Math.max(1, player.autoAscendThreshold)) {
            reset("ascension", true)
        }
    }
    let metaData = null;
    if (player.researches[175] > 0) {
        for (let i = 1; i <= 10; i++) {
            metaData = getConstUpgradeMetadata(i)
            if (player.ascendShards.gte(metaData[1])) {
                buyConstantUpgrades(i, true);
            }
        }
    }

    const reductionValue = getReductionValue();
    if (reductionValue !== G['prevReductionValue']) {
        G['prevReductionValue'] = reductionValue;
        const resources = ["Coin", "Diamonds", "Mythos"];
        const scalings = [
            (value: number) => value,
            (value: number) => value * (value + 1) / 2,
            (value: number) => value * (value + 1) / 2
        ];
        const originalCosts = [
            [100, 2e3, 4e4, 8e5, 1.6e7],
            [1e2, 1e5, 1e15, 1e40, 1e100],
            [1, 1e2, 1e4, 1e8, 1e16],
        ];

        for (let res = 0; res < resources.length; ++res) {
            const resource = resources[res];
            for (let ord = 0; ord < 5; ++ord) {
                const num = G['ordinals'][ord];
                player[num + "Cost" + resource] = getCost(originalCosts[res][ord], player[num + "Owned" + resource] + 1, resource, scalings[res](ord + 1), reductionValue);
            }
        }

        for (let i = 0; i <= 4; i++) {
            const particleOriginalCost = [1, 1e2, 1e4, 1e8, 1e16]
            const array = ['first', 'second', 'third', 'fourth', 'fifth']
            const buyTo = player[array[i] + 'OwnedParticles'] + 1
            player[array[i] + 'CostParticles'] = new Decimal(Decimal.pow(2, buyTo - 1).times(Decimal.pow(1.001, Math.max(0, (buyTo - 325000)) * Math.max(0, (buyTo - 325000) + 1) / 2))).times(particleOriginalCost[i])
        }
    }
}

export const constantIntervals = (): void => {
    interval(saveSynergy, 5000);
    interval(autoUpgrades, 200);
    interval(buttoncolorchange, 200)
    interval(htmlInserts, 16)
    interval(updateAll, 100)
    interval(buildingAchievementCheck, 200)

    if (!G['timeWarp']) {
        document.getElementById("preload").style.display = "none";
        document.getElementById("offlineprogressbar").style.display = "none"
    }
}

let lastUpdate = 0;

export const createTimer = (): void => {
    lastUpdate = performance.now();
    interval(tick, 5);
}

const dt = 5;
const filterStrength = 20;
let deltaMean = 0;

const tick = () => {
    const now = performance.now();
    let delta = now - lastUpdate;
    // compute pseudo-average delta cf. https://stackoverflow.com/a/5111475/343834
    deltaMean += (delta - deltaMean) / filterStrength;
    let dtEffective;
    while (delta > 5) {
        // tack will compute dtEffective milliseconds of game time
        dtEffective = dt;
        // If the mean lag (deltaMean) is more than a whole frame (16ms), compensate by computing deltaMean - dt ms, up to 1 hour
        dtEffective += deltaMean > 16 ? Math.min(3600 * 1000, deltaMean - dt) : 0;
        // compute at max delta ms to avoid negative delta
        dtEffective = Math.min(delta, dtEffective);
        // run tack and record timings
        tack(dtEffective / 1000);
        lastUpdate += dtEffective;
        delta -= dtEffective;
    }
}

function tack(dt: number) {
    if (!G['timeWarp']) {
        dailyResetCheck();
        //Adds Resources (coins, ants, etc)
        const timeMult = calculateTimeAcceleration();
        resourceGain(dt * timeMult)
        //Adds time (in milliseconds) to all reset functions, and quarks timer.
        addTimers("prestige", dt)
        addTimers("transcension", dt)
        addTimers("reincarnation", dt)
        addTimers("ascension", dt)
        addTimers("quarks", dt)

        //Triggers automatic rune sacrifice (adds milliseconds to payload timer)
        if (player.shopUpgrades.offeringAuto > 0.5 && player.autoSacrificeToggle) {
            automaticTools("runeSacrifice", dt)
        }

        //Triggers automatic ant sacrifice (adds milliseonds to payload timers)
        if (player.achievements[173] === 1) {
            automaticTools("antSacrifice", dt);
        }

      /*Triggers automatic obtainium gain if research [2x11] is unlocked,
        Otherwise it just calculates obtainium multiplier values. */
        if (player.researches[61] === 1) {
            automaticTools("addObtainium", dt)
        }
        else {
            calculateObtainium();
        }

        //Automatically tries and buys researches lol
        if (player.autoResearchToggle && player.autoResearch <= maxRoombaResearchIndex(player)) {
                // buyResearch() probably shouldn't even be called if player.autoResearch exceeds the highest unlocked research
                let counter = 0;
                const maxCount = 1 + player.challengecompletions[14];
                while (counter < maxCount) {
                    if (player.autoResearch > 0) {
                        const linGrowth = (player.autoResearch === 200) ? 0.01 : 0;
                        if (!buyResearch(player.autoResearch, true, linGrowth)) {
                            break;
                        }
                    }
                    else {
                        break;
                    }
                    counter++;
                }
            }
        }

        // Adds an offering every 2 seconds
        if (player.highestchallengecompletions[3] > 0) {
            automaticTools("addOfferings", dt/2)
        }

        // Adds an offering every 1/(cube upgrade 1x2) seconds. It shares a timer with the one above.
        if (player.cubeUpgrades[2] > 0) {
            automaticTools("addOfferings", dt * player.cubeUpgrades[2])
        }

        if (player.researches[130] > 0 || player.researches[135] > 0) {
            const talismansUnlocked = [
                player.achievements[119] > 0,
                player.achievements[126] > 0,
                player.achievements[133] > 0,
                player.achievements[140] > 0,
                player.achievements[147] > 0,
                player.antUpgrades[12-1] > 0 || player.ascensionCount > 0,
                player.shopUpgrades.shopTalisman > 0,
            ];
            let upgradedTalisman = false;

            // First, we need to enhance all of the talismans. Then, we can fortify all of the talismans.
            // If we were to do this in one loop, the players resources would be drained on individual expensive levels
            // of early talismans before buying important enhances for the later ones. This results in drastically
            // reduced overall gains when talisman resources are scarce.
            if (player.autoEnhanceToggle) {
                for (let i = 0; i < talismansUnlocked.length; ++i) {
                    if (talismansUnlocked[i]) {
                        // TODO: Remove + 1 here when talismans are fully zero-indexed
                        upgradedTalisman = buyTalismanEnhance(i + 1, true) || upgradedTalisman;
                    }
                }
            }

            if (player.autoFortifyToggle) {
                for (let i = 0; i < talismansUnlocked.length; ++i) {
                    if (talismansUnlocked[i]) {
                        // TODO: Remove + 1 here when talismans are fully zero-indexed
                        upgradedTalisman = buyTalismanLevels(i + 1, true) || upgradedTalisman;
                    }
                }
            }

            // Recalculate talisman-related upgrades and display on success
            if (upgradedTalisman) {
                updateTalismanInventory();
                calculateRuneLevels();
            }
        }

        runChallengeSweep(dt);

        //Check for automatic resets
        //Auto Prestige. === 1 indicates amount, === 2 indicates time.
        if (player.resettoggle1 === 1 || player.resettoggle1 === 0) {
            if (player.toggles[15] === true && player.achievements[43] === 1 && G['prestigePointGain'].gte(player.prestigePoints.times(Decimal.pow(10, player.prestigeamount))) && player.coinsThisPrestige.gte(1e16)) {
                resetachievementcheck(1);
                reset("prestige", true)
            }
        }
        if (player.resettoggle1 === 2) {
            G['autoResetTimers'].prestige += dt;
            const time = Math.max(0.01, player.prestigeamount);
            if (player.toggles[15] === true && player.achievements[43] === 1 && G['autoResetTimers'].prestige >= time && player.coinsThisPrestige.gte(1e16)) {
                resetachievementcheck(1);
                reset("prestige", true);
            }
        }

        if (player.resettoggle2 === 1 || player.resettoggle2 === 0) {
            if (player.toggles[21] === true && player.upgrades[89] === 1 && G['transcendPointGain'].gte(player.transcendPoints.times(Decimal.pow(10, player.transcendamount))) && player.coinsThisTranscension.gte(1e100) && player.currentChallenge.transcension === 0) {
                resetachievementcheck(2);
                reset("transcension", true);
            }
        }
        if (player.resettoggle2 === 2) {
            G['autoResetTimers'].transcension += dt
            const time = Math.max(0.01, player.transcendamount);
            if (player.toggles[21] === true && player.upgrades[89] === 1 && G['autoResetTimers'].transcension >= time && player.coinsThisTranscension.gte(1e100) && player.currentChallenge.transcension === 0) {
                resetachievementcheck(2);
                reset("transcension", true);
            }
        }

        if (player.currentChallenge.ascension !== 12) {
            G['autoResetTimers'].reincarnation += dt;
            if (player.resettoggle3 === 2) {
                const time = Math.max(0.01, player.reincarnationamount);
                if (player.toggles[27] === true && player.researches[46] > 0.5 && player.transcendShards.gte("1e300") && G['autoResetTimers'].reincarnation >= time && player.currentChallenge.transcension === 0 && player.currentChallenge.reincarnation === 0) {
                    resetachievementcheck(3);
                    reset("reincarnation", true);
                }
            }
            if (player.resettoggle3 === 1 || player.resettoggle3 === 0) {
                if (player.toggles[27] === true && player.researches[46] > 0.5 && G['reincarnationPointGain'].gte(player.reincarnationPoints.times(Decimal.pow(10, player.reincarnationamount))) && player.transcendShards.gte(1e300) && player.currentChallenge.transcension === 0 && player.currentChallenge.reincarnation === 0) {
                    resetachievementcheck(3);
                    reset("reincarnation", true)
                }
            }
        }
        calculateOfferings("reincarnation")
    }

const loadPlugins = async () => {
    for (const obj of Object.keys(Plugins)) {
        document.getElementById(`pluginSubTab${Object.keys(Plugins).indexOf(obj) + 1}`)
            .addEventListener('click', () => Plugins[obj as keyof typeof Plugins].main())
    }
}

document.addEventListener('keydown', (event) => {
    if (document.activeElement && document.activeElement.localName === 'input') {
        // https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation
        // finally fixes the bug where hotkeys would be activated when typing in an input field
        event.stopPropagation();
        return;
    }

    let type = "";
    let num = 0;

    let cost = [null, 1, 100, 1e4, 1e8, 1e16]
    if (G['buildingSubTab'] === "coin") {
        cost = [null, 100, 2000, 4e4, 8e5, 1.6e7];
        type = "Coin"
    }
    if (G['buildingSubTab'] === "diamond") {
        cost = [null, 100, 1e5, 1e15, 1e40, 1e100];
        type = "Diamonds"
    }
    if (G['buildingSubTab'] === "mythos") {
        type = "Mythos"
    }

    const key = event.key.toUpperCase();
    switch (key) {
        case "1":
            num = 1;
            if (G['currentTab'] === "buildings") {
                G['buildingSubTab'] === "particle" ? buyParticleBuilding('first', cost[1]) : buyMax('first', type, num, cost[1])
            }
            if (G['currentTab'] === "runes") {
                if (G['runescreen'] === "runes") {
                    redeemShards(1)
                }
                if (G['runescreen'] === "blessings") {
                    buyRuneBonusLevels('Blessings', 1)
                }
                if (G['runescreen'] === "spirits") {
                    buyRuneBonusLevels('Spirits', 1)
                }
            }
            if (G['currentTab'] === "challenges") {
                toggleChallenges(1)
                challengeDisplay(1);
            }
            break;

        case "2":
            G['buildingSubTab'] === "coin" ? num = 2 : num = 3
            if (G['currentTab'] === "buildings") {
                G['buildingSubTab'] === "particle" ? buyParticleBuilding('second', cost[2]) : buyMax('second', type, num, cost[2])
            }
            if (G['currentTab'] === "runes") {
                if (G['runescreen'] === "runes") {
                    redeemShards(2)
                }
                if (G['runescreen'] === "blessings") {
                    buyRuneBonusLevels('Blessings', 2)
                }
                if (G['runescreen'] === "spirits") {
                    buyRuneBonusLevels('Spirits', 2)
                }
            }
            if (G['currentTab'] === "challenges") {
                toggleChallenges(2)
                challengeDisplay(2);
            }
            break;
        case "3":
            G['buildingSubTab'] === "coin" ? num = 3 : num = 6
            if (G['currentTab'] === "buildings") {
                G['buildingSubTab'] === "particle" ? buyParticleBuilding('third', cost[3]) : buyMax('third', type, num, cost[3])
            }
            if (G['currentTab'] === "runes") {
                if (G['runescreen'] === "runes") {
                    redeemShards(3)
                }
                if (G['runescreen'] === "blessings") {
                    buyRuneBonusLevels('Blessings', 3)
                }
                if (G['runescreen'] === "spirits") {
                    buyRuneBonusLevels('Spirits', 3)
                }
            }
            if (G['currentTab'] === "challenges") {
                toggleChallenges(3)
                challengeDisplay(3);
            }
            break;
        case "4":
            G['buildingSubTab'] === "coin" ? num = 4 : num = 10
            if (G['currentTab'] === "buildings") {
                G['buildingSubTab'] === "particle" ? buyParticleBuilding('fourth', cost[4]) : buyMax('fourth', type, num, cost[4])
            }
            if (G['currentTab'] === "runes") {
                if (G['runescreen'] === "runes") {
                    redeemShards(4)
                }
                if (G['runescreen'] === "blessings") {
                    buyRuneBonusLevels('Blessings', 4)
                }
                if (G['runescreen'] === "spirits") {
                    buyRuneBonusLevels('Spirits', 4)
                }
            }
            if (G['currentTab'] === "challenges") {
                toggleChallenges(4)
                challengeDisplay(4);
            }
            break;
        case "5":
            G['buildingSubTab'] === "coin" ? num = 5 : num = 15
            if (G['currentTab'] === "buildings") {
                G['buildingSubTab'] === "particle" ? buyParticleBuilding('fifth', cost[5]) : buyMax('fifth', type, num, cost[5])
            }
            if (G['currentTab'] === "runes") {
                if (G['runescreen'] === "runes") {
                    redeemShards(5)
                }
                if (G['runescreen'] === "blessings") {
                    buyRuneBonusLevels('Blessings', 5)
                }
                if (G['runescreen'] === "spirits") {
                    buyRuneBonusLevels('Spirits', 5)
                }
            }
            if (G['currentTab'] === "challenges") {
                toggleChallenges(5)
                challengeDisplay(5);
            }
            break;
        case "6":
            if (G['currentTab'] === "buildings" && G['buildingSubTab'] === "diamond") {
                buyCrystalUpgrades(1)
            }
            if (G['currentTab'] === "challenges" && player.reincarnationCount > 0) {
                toggleChallenges(6)
                challengeDisplay(6);
            }
            break;
        case "7":
            if (G['currentTab'] === "buildings" && G['buildingSubTab'] === "diamond") {
                buyCrystalUpgrades(2)
            }
            if (G['currentTab'] === "challenges" && player.achievements[113] === 1) {
                toggleChallenges(7)
                challengeDisplay(7);
            }
            break;
        case "8":
            if (G['currentTab'] === "buildings" && G['buildingSubTab'] === "diamond") {
                buyCrystalUpgrades(3)
            }
            if (G['currentTab'] === "challenges" && player.achievements[120] === 1) {
                toggleChallenges(8)
                challengeDisplay(8);
            }
            break;
        case "9":
            if (G['currentTab'] === "buildings" && G['buildingSubTab'] === "diamond") {
                buyCrystalUpgrades(4)
            }
            if (G['currentTab'] === "challenges" && player.achievements[127] === 1) {
                toggleChallenges(9)
                challengeDisplay(9);
            }
            break;
        case "0":
            if (G['currentTab'] === "buildings" && G['buildingSubTab'] === "diamond") {
                buyCrystalUpgrades(5)
            }
            if (G['currentTab'] === "challenges" && player.achievements[134] === 1) {
                toggleChallenges(10)
                challengeDisplay(10);
            }
            break;
        case "A":
            buyAccelerator();
            break;
        case "B":
            boostAccelerator();
            break;
        case "E":
            if (player.currentChallenge.reincarnation !== 0) {
                resetCheck('reincarnationchallenge', undefined, true)
            }
            if (player.currentChallenge.transcension !== 0) {
                resetCheck('challenge', undefined, true)
            }
            break;
        case "M":
            buyMultiplier();
            break;
        case "P":
            resetCheck('prestige');
            break;
        case "R":
            resetCheck('reincarnate');
            break;
        case "S":
            sacrificeAnts();
            break;
        case "T":
            resetCheck('transcend');
            break;
        case "ARROWLEFT":
            event.preventDefault();
            keyboardTabChange(-1);
            break;
        case "ARROWRIGHT":
            event.preventDefault();
            keyboardTabChange(1);
            break;
        case "ARROWUP":
            event.preventDefault();
            keyboardTabChange(-1, false);
            break;
        case "ARROWDOWN":
            event.preventDefault();
            keyboardTabChange(1, false);
            break;
    }

});

window.addEventListener('load', async () => {
    if (location.href.includes('kong')) {
        // kongregate
        const script = document.createElement('script');
        script.setAttribute('src', 'https://cdn1.kongregate.com/javascripts/kongregate_api.js');
        document.head.appendChild(script);
    }

    const ver = document.getElementById('versionnumber');
    ver && (ver.textContent = `You're Testing v${player.version} - Seal of the Merchant [Last Update: 6:15PM UTC-8 08-Feb-2021]. Savefiles cannot be used in live!`);
    document.title = 'Synergism v' + player.version;

    const dec = LZString.decompressFromBase64(localStorage.getItem('Synergysave2'));
    const isLZString = dec !== '';

    if (isLZString) {
        localStorage.clear();
        localStorage.setItem('Synergysave2', btoa(dec));
        await Alert('Transferred save to new format successfully!');
    }

    corruptionButtonsAdd();
    corruptionLoadoutTableCreate();

    setTimeout(() => {
        generateEventHandlers();
        loadSynergy();
        saveSynergy();
        toggleauto();
        revealStuff();
        hideStuff();
        htmlInserts();
        createTimer();
        constantIntervals();
        loadPlugins();
        changeTabColor();
    }, 0);
});