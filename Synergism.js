const intervalHold = [];
const interval = new Proxy(setInterval, {
    apply(target, thisArg, args) {
        const set = target.apply(thisArg, args);
        intervalHold.push(set);
        return set;
    }
});

const clearInt = new Proxy(clearInterval, {
    apply(target, thisArg, args) {
        const id = args[0];
        intervalHold.splice(intervalHold.indexOf(id), 1); // remove from intervalHold array
        return target.apply(thisArg, args);
    }
});

const player = {
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

    upgrades: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, //Coin Upgrades, Ignore First.
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,    //Prestige Upgrades
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,	   //Transcend Upgrades
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,	   //Reincarnation Upgrades
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,	   //Automation Upgrades
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,   //Generator Upgrades
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Post Ascension Upgrades


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

    resourceGenerators: {
        diamonds: false,
        mythos: false,
    },

    keepUpgrades: {
        coinUpgrades: false,
        prestigeUpgrades: false,
        crystalUpgrades: false,
        transcendUpgrades: false,
        autobuyers: false,
        generators: false
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
    obtainiumlocktoggle: false,
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
    achievements: [0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0],

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
    offeringlocktoggle: false,
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
    fastestAscend: 999999999999,

    resettoggle1: 1,
    resettoggle2: 1,
    resettoggle3: 1,

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
        Array.from(Array(26), (_, i) => [i + 1, false])
    ),

    loaded1009: true,
    loaded1009hotfix1: true,
    loaded10091: true,
    loaded1010: true,
    loaded10101: true,

    shopUpgrades: {
        offeringPotion: 1,
        obtainiumPotion: 1,
        offeringTimerLevel: 0,
        obtainiumTimerLevel: 0,
        offeringAutoLevel: 0,
        obtainiumAutoLevel: 0,
        instantChallengeBought: false,
        cashGrabLevel: 0,
        antSpeedLevel: 0,
        talismanBought: false,
        challengeExtension: 0,
        challenge10Tomes: 0,
        seasonPassLevel: 0,
        cubeToQuarkBought: false,
        tesseractToQuarkBought: false,
        hypercubeToQuarkBought: false
    },
    autoSacrificeToggle: false,
    autoResearchToggle: false,
    autoResearch: 0,
    autoSacrifice: 0,
    sacrificeTimer: 0,
    quarkstimer: 90000,

    antPoints: new Decimal("1"),
    antUpgrades: [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    antSacrificePoints: 0,
    antSacrificeTimer: 900,
    antSacrificeTimerReal: 900,

    talismanLevels: [null, 0, 0, 0, 0, 0, 0, 0],
    talismanRarity: [null, 1, 1, 1, 1, 1, 1, 1],
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
    ascendShards: new Decimal("0"),
    autoAscend: false,
    autoAscendMode: "c10Completions",
    autoAscendThreshold: 1,
    roombaResearchIndex: 0,
    cubesThisAscension: {
        "challenges": 0,
        "reincarnation": 0,
        "ascension": 0,
        "maxCubesPerSec": 0,
        "maxAllTime": 0,
        "cpsOnC10Comp": 0,
        "tesseracts": 0,
        "hypercubes": 0
    },
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
    history: {},
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
    brokenfile1: false,
    exporttest: "YES!",
    kongregatetest: "NO!",

    dayCheck: 0,
    dayTimer: 0,
    cubeOpenedDaily: 0,
    cubeQuarkDaily: 0,
    tesseractOpenedDaily: 0,
    tesseractQuarkDaily: 0,
    hypercubeOpenedDaily: 0,
    hypercubeQuarkDaily: 0,
    loadedOct4Hotfix: false,
    version: '2.0.8~beta2'
}

const blank_save = Object.assign({}, player);
blank_save.codes = new Map(Array.from(Array(26), (_, i) => [i + 1, false]));

/**
 * stringify a map so it can be re-made when importing
 * @param {Map} m map to stringify
 */
const toStringMap = m => Array.from(m);

function saveSynergy(button) {
    player.offlinetick = Date.now();
    player.loaded1009 = true;
    player.loaded1009hotfix1 = true;

    // shallow hold, doesn't modify OG object nor is affected by modifications to OG
    const p = Object.assign({}, player);
    p.codes = toStringMap(p.codes);

    localStorage.setItem("Synergysave2", btoa(JSON.stringify(p)));

    if (button) {
        let el = document.getElementById("saveinfo");
        el.textContent = "Game saved successfully!"
        setTimeout(function () {
            el.textContent = '';
        }, 4000);
    }
}

function loadSynergy() {
    const save = localStorage.getItem("Synergysave2");
    const data = save ? JSON.parse(atob(save)) : null;

    if (data) {
        function isDecimal(o) {
            if (!(o instanceof Object)) {
                return false;
            }
            return Object.keys(o).length === 2 && Object.keys(o).every(function (v) {
                return ['mantissa', 'exponent'].indexOf(v) > -1
            });
        }

        const hasOwnProperty = {}.hasOwnProperty;

        const oldCodesUsed = Array.from(
            24, // old codes only went up to 24
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

        if (player.researches[76] === undefined) {
            player.codes.set(13, false);
            player.researches.push(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
            player.achievements.push(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
            player.maxofferings = player.runeshards;
            player.maxobtainium = player.researchPoints;
            player.researchPoints += 51200 * player.researches[50];
            player.researches[50] = 0;
            player.offeringlocktoggle = false;
            player.obtainiumlocktoggle = false;
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
            player.shopUpgrades = {
                offeringPotion: 1,
                obtainiumPotion: 1,
                offeringTimerLevel: 0,
                obtainiumTimerLevel: 0,
                offeringAutoLevel: 0,
                obtainiumAutoLevel: 0,
                instantChallengeBought: false,
                cashGrabLevel: 0
            };
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

        if (data.achievements[169] === undefined || player.achievements[169] === undefined || data.shopUpgrades.antSpeedLevel === undefined || player.shopUpgrades.antSpeedLevel === undefined || data.loaded1010 === undefined || data.loaded1010 === false) {
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


            player.shopUpgrades.antSpeedLevel = 0;
            player.shopUpgrades.talismanBought = false;

            player.antUpgrades = [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

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

            player.talismanLevels = [null, 0, 0, 0, 0, 0, 0, 0];
            player.talismanRarity = [null, 1, 1, 1, 1, 1, 1, 1];

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

            let refundThese = [0, 31, 32, 61, 62, 63, 64, 76, 77, 78, 79, 80,
                81, 98, 104, 105, 106, 107, 108,
                109, 110, 111, 112, 113, 114, 115, 116,
                117, 118, 119, 120, 121, 122, 123, 125];
            let refundReward = [0, 2, 20, 5, 10, 80, 5e3, 1e7, 1e7, 2e7, 3e7, 4e7,
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

        if (player.firstOwnedAnts < 1 && player.firstCostAnts.greaterThanOrEqualTo("1e1200")) {
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
            player.cubesThisAscension.challenges = 0;
            player.cubesThisAscension.reincarnation = 0;
            player.cubesThisAscension.ascension = 0;
            player.cubesThisAscension.maxCubesPerSec = 0;
            player.cubesThisAscension.maxAllTime = 0;
            player.cubesThisAscension.cpsOnC10Comp = 0;
            player.cubesThisAscension.tesseracts = 0;
            player.cubesThisAscension.hypercubes = 0;
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
            player.history = {};
        }
        if (data.historyShowPerSecond === undefined || player.historyShowPerSecond === undefined) {
            player.historyShowPerSecond = false;
            player.historyCountMax = 10;
        }
        if (player.currentChallenge.transcension === undefined) {
            player.currentChallenge = {
                transcension: 0,
                reincarnation: 0,
                ascension: 0,
            }
            let challengeCompletionArray = [0, player.challengecompletions.one, player.challengecompletions.two, player.challengecompletions.three, player.challengecompletions.four, player.challengecompletions.five, player.challengecompletions.six, player.challengecompletions.seven, player.challengecompletions.eight, player.challengecompletions.nine, player.challengecompletions.ten, 0, 0, 0, 0, 0]
            let highestChallengeCompletionArray = [0, player.highestchallengecompletions.one, player.highestchallengecompletions.two, player.highestchallengecompletions.three, player.highestchallengecompletions.four, player.highestchallengecompletions.five, player.highestchallengecompletions.six, player.highestchallengecompletions.seven, player.highestchallengecompletions.eight, player.highestchallengecompletions.nine, player.highestchallengecompletions.ten, 0, 0, 0, 0, 0]
            player.challengecompletions = []
            player.highestchallengecompletions = []
            for (let i = 0; i <= 15; i++) {
                player.challengecompletions.push(challengeCompletionArray[i])
                player.highestchallengecompletions.push(highestChallengeCompletionArray[i])
            }
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

        if (player.dayCheck !== 0) {
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
        document.getElementById("saveStringInput").value = player.saveString

        player.wowCubes = player.wowCubes || 0;
        if (!player.cubesThisAscension.maxAllTime) // Initializes the value if it doesn't exist
            player.cubesThisAscension.maxAllTime = 0
        if (!player.cubesThisAscension.cpsOnC10Comp)
            player.cubesThisAscension.cpsOnC10Comp = 0
        if (!player.cubesThisAscension.tesseracts)
            player.cubesThisAscension.tesseracts = 0
        if (!player.cubesThisAscension.hypercubes)
            player.cubesThisAscension.hypercubes = 0

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
        runescreen = "runes";
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
                let e = q[j] + d
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

        testArray = []
        for (let i = 0; i < researchBaseCosts.length; i++) {
            testArray.push(researchBaseCosts[i]);
        }
        researchOrderByCost = sortWithIndeces(testArray)
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
        if (player.shoptoggles.generator === false) {
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
        document.getElementById("exitTimerValue").textContent = format(player.autoChallengeTimer.exit, 2, true) + "s"
        document.getElementById("enterTimerValue").textContent = format(player.autoChallengeTimer.enter, 2, true) + "s"


        let m = 1;
        m *= effectiveLevelMult

        /* document.getElementById("runeshowpower1").textContent = "Speed Rune Bonus: " + "+" + format(Math.floor(rune1level * m)) + " Accelerators, +" + (rune1level/2  * m).toPrecision(2) +"% Accelerators, +" + format(Math.floor(rune1level/10 * m)) + " Accelerator Boosts."
if (player.achievements[38] == 1)document.getElementById("runeshowpower2").textContent = "Duplication Rune Bonus: " + "+" + Math.floor(rune2level * m / 10) * Math.floor(10 + rune2level * m /10) / 2 + " +" + m *rune2level/2 +"% Multipliers, -" + (100 * (1 - Math.pow(10, - rune2level/500))).toPrecision(4)  + "% Tax Growth.";
if (player.achievements[44] == 1)document.getElementById("runeshowpower3").textContent = "Prism Rune Bonus: " + "All Crystal Producer production multiplied by " + format(Decimal.pow(rune3level * m, 2).times(Decimal.pow(2, rune3level * m - 8).add(1))) + ", gain +" + format(Math.floor(rune3level/10 * m)) + " free crystal levels.";
if (player.achievements[102] == 1)document.getElementById("runeshowpower4").textContent = "Thrift Rune Bonus: " + "Delay all producer cost increases by " + (rune4level/4 * m).toPrecision(3) + "% buildings. Increase offering recycling chance: " + rune4level/8 + "%."; */

        CSSAscend();
        CSSRuneBlessings();
        corruptionStatsUpdate();
        for (let i = 0; i < 4; i++) {
            corruptionLoadoutTableUpdate(i);
        }
        showCorruptionStatsLoadouts()

        for (let j = 1; j <= 5; j++) {
            let ouch = document.getElementById("tesseractAutoToggle" + j);
            (player.autoTesseracts[j]) ?
                (ouch.textContent = "Auto [ON]", ouch.style.border = "2px solid green") :
                (ouch.textContent = "Auto [OFF]", ouch.style.border = "2px solid red");
        }

        document.getElementById("buyRuneBlessingToggleValue").textContent = format(player.runeBlessingBuyAmount, 0, true);
        document.getElementById("buyRuneSpiritToggleValue").textContent = format(player.runeSpiritBuyAmount, 0, true);

        document.getElementById("researchrunebonus").textContent = "Thanks to researches, your effective levels are increased by " + (100 * effectiveLevelMult - 100).toPrecision(4) + "%";

        document.getElementById("talismanlevelup").style.display = "none"
        document.getElementById("talismanrespec").style.display = "none"
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
        for (let id of Object.keys(player.ascStatToggles)) {
            toggleAscStatPerSecond(id); // toggle each stat twice to make sure the displays are correct and match what they used to be
            toggleAscStatPerSecond(id);
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


        if (player.autoResearchToggle) {
            document.getElementById("toggleautoresearch").textContent = "Automatic: ON"
        }
        if (!player.autoResearchToggle) {
            document.getElementById("toggleautoresearch").textContent = "Automatic: OFF"
        }
        if (player.autoSacrificeToggle) {
            document.getElementById("toggleautosacrifice").textContent = "Automatic: ON"
        }
        if (!player.autoSacrificeToggle) {
            document.getElementById("toggleautosacrifice").textContent = "Automatic: OFF"
        }

        if (!player.autoAscend) {
            document.getElementById("ascensionAutoEnable").textContent = "Auto Ascend [OFF]";
            document.getElementById("ascensionAutoEnable").style.border = "2px solid red"
        }

        for (let i = 1; i <= 2; i++) {
            toggleAntMaxBuy()
            toggleAntAutoSacrifice()
        }


        document.getElementById("historyTogglePerSecondButton").textContent = "Per second: " + (player.historyShowPerSecond ? "ON" : "OFF");
        document.getElementById("historyTogglePerSecondButton").style.borderColor = (player.historyShowPerSecond ? "green" : "red");

        if (!player.autoAscend) {
            document.getElementById("ascensionAutoEnable").textContent = "Auto Ascend [OFF]";
            document.getElementById("ascensionAutoEnable").style.border = "2px solid red"
        }


        for (let i = 1; i <= 2; i++) {
            toggleAntMaxBuy()
            toggleAntAutoSacrifice()
        }

        player.autoResearch = Math.min(200, player.autoResearch)
        player.autoSacrifice = Math.min(5, player.autoSacrifice)


        if (player.autoResearchToggle && player.autoResearch > 0.5) {
            document.getElementById("res" + player.autoResearch).style.backgroundColor = "orange"
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
    }
    updateAchievementBG();

    let d = new Date()
    let h = d.getHours()
    let m = d.getMinutes()
    let s = d.getSeconds()
    player.dayTimer = (60 * 60 * 24 - (s + 60 * m + 60 * 60 * h))
}

/**
 * This function displays the numbers such as 1,234 or 1.00e1234 or 1.00e1.234M.
 * @param {Decimal | number} input number/Decimal to be formatted
 * @param {number} accuracy
 * how many decimal points that are to be displayed (Values <10 if !long, <1000 if long).
 * only works up to 305 (308 - 3), however it only worked up to ~14 due to rounding errors regardless
 * @param {*} long dictates whether or not a given number displays as scientific at 1,000,000. This auto defaults to short if input >= 1e13
 */
function format(input, accuracy = 0, long = false) {
    let power;
    let mantissa;
    if (input instanceof Decimal) {
        // Gets power and mantissa if input is of type decimal
        power = input.e;
        mantissa = input.mantissa;
    } else if (typeof input === "number" && input !== 0) {
        // Gets power and mantissa if input is of type number and isnt 0
        power = Math.floor(Math.log10(Math.abs(input)));
        mantissa = input / Math.pow(10, power);
    } else {
        // If it isn't one of those two it isn't formattable, return 0
        return "0";
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
        return "0";
    } else if (power < 6 || (long && power < 13)) {
        // If the power is less than 6 or format long and less than 13 use standard formatting (123,456,789)
        // Gets the standard representation of the number, safe as power is guaranteed to be > -12 and < 13
        let standard = mantissa * Math.pow(10, power);
        // Rounds up if the number experiences a rounding error
        if (standard - Math.floor(standard) > 0.9999999) {
            standard = Math.ceil(standard);
        }
        // If the power is less than 1 or format long and less than 3 apply toFixed(accuracy) to get decimal places
        if ((power < 1 || (long && power < 3)) && accuracy > 0) {
            standard = standard.toFixed(accuracy);
        } else {
            // If it doesn't fit those criteria drop the decimal places
            standard = Math.floor(standard);
        }
        // Turn the number to string
        const standardString = standard.toString();
        // Split it on the decimal place
        const [front, back] = standardString.split('.');
        // Apply a number group 3 comma regex to the front
        const frontFormatted = 'BigInt' in window
            ? BigInt(front).toLocaleString('en-US')
            : front.replace(/(\d)(?=(\d{3})+$)/g, "$1,");
        // if the back is undefined that means there are no decimals to display, return just the front
        if (back === undefined) {
            return frontFormatted;
        } else {
            // Else return the front.back
            return frontFormatted + "." + back;
        }
    } else if (power < 1e6) {
        // If the power is less than 1e6 then apply standard scientific notation
        // Makes mantissa be rounded down to 2 decimal places
        const mantissaLook = (Math.floor(mantissa * 100) / 100).toFixed(2);
        // Makes the power group 3 with commas
        const powerLook = 'BigInt' in window
            ? BigInt(power).toLocaleString('en-US')
            : power.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,");
        // returns format (1.23e456,789)
        return mantissaLook + "e" + powerLook;
    } else if (power >= 1e6) {
        // if the power is greater than 1e6 apply notation scientific notation
        // Makes mantissa be rounded down to 2 decimal places
        let mantissaLook = Math.floor(mantissa * 100) / 100;
        // Makes mantissa be to 2 decimal places
        mantissaLook = mantissaLook.toFixed(2);
        mantissaLook = mantissaLook.toString();
        // Drops the power down to 4 digits total but never greater than 1000 in increments that equate to notations, (1234000 -> 1.234) ( 12340000 -> 12.34) (123400000 -> 123.4) (1234000000 -> 1.234)
        let powerDigits = Math.ceil(Math.log10(power));
        let powerFront = ((powerDigits - 1) % 3) + 1;
        let powerLook = power / Math.pow(10, powerDigits - powerFront);
        if (powerLook === 1000) {
            powerLook = 1;
            powerFront = 1;
        }
        powerLook = powerLook.toFixed(4 - powerFront);
        powerLook = powerLook.toString();
        // Return relevant notations alongside the "look" power based on what the power actually is
        if (power < 1e9) {
            return mantissaLook + "e" + powerLook + "M";
        }
        if (power < 1e12) {
            return mantissaLook + "e" + powerLook + "B";
        }
        if (power < 1e15) {
            return mantissaLook + "e" + powerLook + "T";
        }
        if (power < 1e18) {
            return mantissaLook + "e" + powerLook + "Qa";
        }
        if (power < 1e21) {
            return mantissaLook + "e" + powerLook + "Qi";
        }
        if (power < 1e24) {
            return mantissaLook + "e" + powerLook + "Sx";
        }
        if (power < 1e27) {
            return mantissaLook + "e" + powerLook + "Sp";
        }
        if (power < 1e30) {
            return mantissaLook + "e" + powerLook + "Oc";
        }
        if (power < 1e33) {
            return mantissaLook + "e" + powerLook + "No";
        }
        if (power < 1e36) {
            return mantissaLook + "e" + powerLook + "Dc";
        }
        // If it doesn't fit a notation then default to mantissa e power
        return mantissa + "e" + power;
    } else {
        // Failsafe
        return "undefined";
    }
}

function formatTimeShort(seconds, msMaxSeconds) {
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

function updateCubesPerSec() {
    let c = player.cubesThisAscension.challenges, r = player.cubesThisAscension.reincarnation,
        a = player.cubesThisAscension.ascension;
    if (player.challengecompletions[10] > 0) {
        if (player.challengecompletions[10] === 1)
            player.cubesThisAscension.cpsOnC10Comp = (c + r + a) / player.ascensionCounter;
        player.cubesThisAscension.maxCubesPerSec = Math.max(player.cubesThisAscension.maxCubesPerSec, (c + r + a) / player.ascensionCounter)
        player.cubesThisAscension.maxAllTime = Math.max(player.cubesThisAscension.maxAllTime, player.cubesThisAscension.maxCubesPerSec)
    }

}

// Update calculations for Accelerator/Multiplier as well as just Production modifiers in general [Lines 600-897]

function updateAllTick() {
    let a = 0;
    totalAccelerator = player.acceleratorBought;

    costDivisor = 1;

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
    freeUpgradeAccelerator = a;
    a += totalAcceleratorBoost * (4 + 2 * player.researches[18] + 2 * player.researches[19] + 3 * player.researches[20] + cubeBonusMultiplier[1]);
    if (player.unlocks.prestige === true) {
        a += Math.floor(Math.pow(rune1level * effectiveLevelMult / 4, 1.25));
        a *= (1 + rune1level * 1 / 400 * effectiveLevelMult);
    }
    calculateAcceleratorMultiplier();
    a *= acceleratorMultiplier
    a = Math.pow(a, Math.min(1, (1 + player.platonicUpgrades[6] / 10) * maladaptivePower[player.usedCorruptions[2]] / (1 + Math.abs(player.usedCorruptions[1] - player.usedCorruptions[2]))))
    a = Math.floor(a)

    freeAccelerator = a;
    totalAccelerator += freeAccelerator;

    tuSevenMulti = 1;


    if (player.upgrades[46] > 0.5) {
        tuSevenMulti = 1.05;
    }

    acceleratorPower = Math.pow(1.1 + tuSevenMulti * (totalAcceleratorBoost / 100) * (1 + CalcECC('transcend', player.challengecompletions[2]) / 20), 1 + 0.04 * CalcECC('reincarnation', player.challengecompletions[7]));
    acceleratorPower += 1 / 200 * Math.floor(CalcECC('transcend', player.challengecompletions[2]) / 2) * 100 / 100
    for (let i = 1; i <= 5; i++) {
        if (player.achievements[7 * i - 4] > 0) {
            acceleratorPower += 0.0005 * i
        }
    }

    //No MA and Sadistic will always overwrite Transcend challenges starting in v2.0.0
    if (player.currentChallenge.reincarnation !== 7 && player.currentChallenge.reincarnation !== 10) {
        if (player.currentChallenge.transcension === 1) {
            acceleratorPower *= 25 / (50 + player.challengecompletions[1]);
            acceleratorPower += 0.55
            acceleratorPower = Math.max(1, acceleratorPower)
        }
        if (player.currentChallenge.transcension === 2) {
            acceleratorPower = 1;
        }
        if (player.currentChallenge.transcension === 3) {
            acceleratorPower = 1.05 + 2 * tuSevenMulti * (totalAcceleratorBoost / 300) * (1 + CalcECC('transcend', player.challengecompletions[2]) / 20);
        }
    }
    if (player.currentChallenge.reincarnation === 7) {
        acceleratorPower = 1;
    }
    if (player.currentChallenge.reincarnation === 10) {
        acceleratorPower = 1;
    }

    if (player.currentChallenge.transcension !== 1) {
        acceleratorEffect = Decimal.pow(acceleratorPower, totalAccelerator);
    }

    if (player.currentChallenge.transcension === 1) {
        acceleratorEffect = Decimal.pow(acceleratorPower, totalAccelerator + totalMultiplier);
    }
    acceleratorEffectDisplay = acceleratorPower * 100 - 100
    if (player.currentChallenge.reincarnation === 10) {
        acceleratorEffect = 1;
    }
    generatorPower = new Decimal(1);
    if (player.upgrades[11] > 0.5 && player.currentChallenge.reincarnation !== 7) {
        generatorPower = Decimal.pow(1.02, totalAccelerator)
    }

}

function updateAllMultiplier() {
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
        a += totalAcceleratorBoost
    }
    if (player.upgrades[49] > 0) {
        a += Math.min(50, Math.floor(Decimal.log(player.transcendPoints.add(1), 1e10)));
    }
    if (player.upgrades[68] > 0) {
        a += Math.min(2500, Math.floor(Decimal.log(taxdivisor, 10) * 1 / 1000))
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
    a += 20 * player.researches[94] * Math.floor((rune1level + rune2level + rune3level + rune4level + rune5level) / 8)

    freeUpgradeMultiplier = a

    if (player.achievements[38] > 0.5) {
        a += Math.floor(Math.floor(rune2level / 10 * effectiveLevelMult) * Math.floor(1 + rune2level / 10 * effectiveLevelMult) / 2) * 100 / 100
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
    a *= (1 + rune2level / 400 * effectiveLevelMult)
    a *= (1 + 1 / 20 * player.researches[87])
    a *= (1 + 1 / 100 * player.researches[128])
    a *= (1 + 0.8 / 100 * player.researches[143])
    a *= (1 + 0.6 / 100 * player.researches[158])
    a *= (1 + 0.4 / 100 * player.researches[173])
    a *= (1 + 0.2 / 100 * player.researches[188])
    a *= (1 + 0.01 / 100 * player.researches[200])
    a *= (1 + 0.01 / 100 * player.cubeUpgrades[50])
    a *= calculateSigmoidExponential(39, (player.antUpgrades[5] + bonusant5) / 1000 * 40 / 39)
    a *= cubeBonusMultiplier[2]
    if ((player.currentChallenge.transcension !== 0 || player.currentChallenge.reincarnation !== 0) && player.upgrades[50] > 0.5) {
        a *= 1.25
    }
    a = Math.pow(a, Math.min(1, (1 + player.platonicUpgrades[6] / 10) * divisivenessPower[player.usedCorruptions[1]] / (1 + Math.abs(player.usedCorruptions[1] - player.usedCorruptions[2]))))
    a = Math.floor(a)
    freeMultiplier = a;
    totalMultiplier = freeMultiplier + player.multiplierBought;

    challengeOneLog = 3;

    let b = 0;
    let c = 0;
    b += Decimal.log(player.transcendShards.add(1), 3);
    b *= (1 + 11 * player.researches[33] / 100)
    b *= (1 + 11 * player.researches[34] / 100)
    b *= (1 + 11 * player.researches[35] / 100)
    b *= (1 + player.researches[89] / 5)
    b *= (1 + 10 * effectiveRuneBlessingPower[2])

    c += Math.floor((0.1 * b * CalcECC('transcend', player.challengecompletions[1])))

    c += (CalcECC('transcend', player.challengecompletions[1]) * 10);
    freeMultiplierBoost = c;
    totalMultiplierBoost = Math.pow(Math.floor(b) + c, 1 + CalcECC('reincarnation', player.challengecompletions[7]) * 0.04);

    let c7 = 1
    if (player.challengecompletions[7] > 0.5) {
        c7 = 1.25
    }

    multiplierPower = 2 + 0.005 * totalMultiplierBoost * c7

    //No MA and Sadistic will always override Transcend Challenges starting in v2.0.0
    if (player.currentChallenge.reincarnation !== 7 && player.currentChallenge.reincarnation !== 10) {
        if (player.currentChallenge.transcension === 1) {
            multiplierPower = 1;
        }
        if (player.currentChallenge.transcension === 2) {
            multiplierPower = (1.25 + 0.0012 * (b + c) * c7)
        }
    }

    if (player.currentChallenge.reincarnation === 7) {
        multiplierPower = 1;
    }
    if (player.currentChallenge.reincarnation === 10) {
        multiplierPower = 1;
    }

    multiplierEffect = Decimal.pow(multiplierPower, totalMultiplier);
}


function multipliers() {
    let s = new Decimal(1);
    let c = new Decimal(1);
    let crystalExponent = 1 / 3
    crystalExponent += Math.min(10 + 0.05 * player.researches[129] * Math.log(player.commonFragments + 1) / Math.log(4) + 20 * calculateCorruptionPoints() / 400 * effectiveRuneSpiritPower[3], 0.05 * player.crystalUpgrades[3])
    crystalExponent += 0.04 * CalcECC('transcend', player.challengecompletions[3])
    crystalExponent += 0.08 * player.researches[28]
    crystalExponent += 0.08 * player.researches[29]
    crystalExponent += 0.04 * player.researches[30]
    crystalExponent += 8 * player.cubeUpgrades[17]
    prestigeMultiplier = Decimal.pow(player.prestigeShards, crystalExponent).add(1);

    let c7 = 1;
    if (player.currentChallenge.reincarnation === 7) {
        c7 = 0.05
    }
    if (player.currentChallenge.reincarnation === 8) {
        c7 = 0
    }
    buildingPower = 1 + (1 - Math.pow(2, -1 / 160)) * c7 * Decimal.log(player.reincarnationShards.add(1), 10) * (1 + 1 / 20 * player.researches[36] + 1 / 40 * player.researches[37] + 1 / 40 * player.researches[38]) + (c7 + 0.2) * 0.25 / 1.2 * CalcECC('reincarnation', player.challengecompletions[8])
    buildingPower = Math.pow(buildingPower, 1 + player.cubeUpgrades[12] * 0.09)
    buildingPower = Math.pow(buildingPower, 1 + player.cubeUpgrades[36] * 0.05)
    reincarnationMultiplier = Decimal.pow(buildingPower, totalCoinOwned);

    antMultiplier = Decimal.pow(Decimal.max(1, player.antPoints), 100000 + calculateSigmoidExponential(49900000, (player.antUpgrades[2] + bonusant2) / 5000 * 500 / 499));

    s = s.times(multiplierEffect);
    s = s.times(acceleratorEffect);
    s = s.times(prestigeMultiplier);
    s = s.times(reincarnationMultiplier);
    s = s.times(antMultiplier)
    let first6CoinUp = new Decimal(totalCoinOwned + 1).times(Decimal.min(1e30, Decimal.pow(1.008, totalCoinOwned)));

    if (player.upgrades[6] > 0.5) {
        s = s.times(first6CoinUp);
    }
    if (player.upgrades[12] > 0.5) {
        s = s.times(Decimal.min(1e4, Decimal.pow(1.01, player.prestigeCount)));
    }
    if (player.upgrades[20] > 0.5) {
        s = s.times(Math.pow(totalCoinOwned / 4 + 1, 10));
    }
    if (player.upgrades[41] > 0.5) {
        s = s.times(Decimal.min(1e30, Decimal.pow(player.transcendPoints.add(1), 1 / 2)));
    }
    if (player.upgrades[43] > 0.5) {
        s = s.times(Decimal.min(1e30, Decimal.pow(1.01, player.transcendCount)));
    }
    if (player.upgrades[48] > 0.5) {
        s = s.times(Decimal.pow((totalMultiplier * totalAccelerator / 1000 + 1), 8));
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
    lol = Decimal.pow(c, 1 + 0.025 * player.upgrades[123])
    if (player.currentChallenge.ascension === 15 && player.platonicUpgrades[5] > 0) {
        lol = Decimal.pow(lol, 1.1)
    }
    if (player.currentChallenge.ascension === 15 && player.platonicUpgrades[14] > 0) {
        lol = Decimal.pow(lol, 1 + 1 / 11 * player.usedCorruptions[9] * Decimal.log(player.coins.add(1), 10) / (1e7 + Decimal.log(player.coins.add(1), 10)))
    }
    globalCoinMultiplier = c;
    globalCoinMultiplier = Decimal.pow(globalCoinMultiplier, financialcollapsePower[player.usedCorruptions[9]])

    coinOneMulti = new Decimal(1);
    if (player.upgrades[1] > 0.5) {
        coinOneMulti = coinOneMulti.times(first6CoinUp);
    }
    if (player.upgrades[10] > 0.5) {
        coinOneMulti = coinOneMulti.times(Decimal.pow(2, Math.min(50, player.secondOwnedCoin / 15)));
    }
    if (player.upgrades[56] > 0.5) {
        coinOneMulti = coinOneMulti.times("1e5000")
    }

    coinTwoMulti = new Decimal(1);
    if (player.upgrades[2] > 0.5) {
        coinTwoMulti = coinTwoMulti.times(first6CoinUp);
    }
    if (player.upgrades[13] > 0.5) {
        coinTwoMulti = coinTwoMulti.times(Decimal.min(1e50, Decimal.pow(player.firstGeneratedMythos.add(player.firstOwnedMythos).add(1), 4 / 3).times(1e10)));
    }
    if (player.upgrades[19] > 0.5) {
        coinTwoMulti = coinTwoMulti.times(Decimal.min(1e200, player.transcendPoints.times(1e30).add(1)));
    }
    if (player.upgrades[57] > 0.5) {
        coinTwoMulti = coinTwoMulti.times("1e7500")
    }

    coinThreeMulti = new Decimal(1);
    if (player.upgrades[3] > 0.5) {
        coinThreeMulti = coinThreeMulti.times(first6CoinUp);
    }
    if (player.upgrades[18] > 0.5) {
        coinThreeMulti = coinThreeMulti.times(Decimal.min(1e125, player.transcendShards.add(1)));
    }
    if (player.upgrades[58] > 0.5) {
        coinThreeMulti = coinThreeMulti.times("1e15000")
    }

    coinFourMulti = new Decimal(1);
    if (player.upgrades[4] > 0.5) {
        coinFourMulti = coinFourMulti.times(first6CoinUp);
    }
    if (player.upgrades[17] > 0.5) {
        coinFourMulti = coinFourMulti.times(1e100);
    }
    if (player.upgrades[59] > 0.5) {
        coinFourMulti = coinFourMulti.times("1e25000")
    }

    coinFiveMulti = new Decimal(1);
    if (player.upgrades[5] > 0.5) {
        coinFiveMulti = coinFiveMulti.times(first6CoinUp);
    }
    if (player.upgrades[60] > 0.5) {
        coinFiveMulti = coinFiveMulti.times("1e35000")
    }

    globalCrystalMultiplier = new Decimal(1)
    if (player.achievements[36] > 0.5) {
        globalCrystalMultiplier = globalCrystalMultiplier.times(2)
    }
    if (player.achievements[37] > 0.5 && player.prestigePoints.greaterThanOrEqualTo(10)) {
        globalCrystalMultiplier = globalCrystalMultiplier.times(Decimal.log(player.prestigePoints.add(1), 10))
    }
    if (player.achievements[43] > 0.5) {
        globalCrystalMultiplier = globalCrystalMultiplier.times(Decimal.pow(rune3level / 2 * effectiveLevelMult, 2).times(Decimal.pow(2, rune3level * effectiveLevelMult / 2 - 8)).add(1))
    }
    if (player.upgrades[36] > 0.5) {
        globalCrystalMultiplier = globalCrystalMultiplier.times(Decimal.min("1e5000", Decimal.pow(player.prestigePoints, 1 / 500)))
    }
    if (player.upgrades[63] > 0.5) {
        globalCrystalMultiplier = globalCrystalMultiplier.times(Decimal.min("1e6000", Decimal.pow(player.reincarnationPoints.add(1), 6)))
    }
    if (player.researches[39] > 0.5) {
        globalCrystalMultiplier = globalCrystalMultiplier.times(Decimal.pow(reincarnationMultiplier, 1 / 50))
    }

    globalCrystalMultiplier = globalCrystalMultiplier.times(Decimal.min(Decimal.pow(10, 50 + 2 * player.crystalUpgrades[0]), Decimal.pow(1.05, player.achievementPoints * player.crystalUpgrades[0])))
    globalCrystalMultiplier = globalCrystalMultiplier.times(Decimal.min(Decimal.pow(10, 100 + 5 * player.crystalUpgrades[1]), Decimal.pow(Decimal.log(player.coins.add(1), 10), player.crystalUpgrades[1] / 3)))
    globalCrystalMultiplier = globalCrystalMultiplier.times(Decimal.pow(1 + Math.min(0.12 + 0.88 * player.upgrades[122] + 0.001 * player.researches[129] * Math.log(player.commonFragments + 1) / Math.log(4), 0.001 * player.crystalUpgrades[2]), player.firstOwnedDiamonds + player.secondOwnedDiamonds + player.thirdOwnedDiamonds + player.fourthOwnedDiamonds + player.fifthOwnedDiamonds))
    globalCrystalMultiplier = globalCrystalMultiplier.times(Decimal.pow(1.01, (player.challengecompletions[1] + player.challengecompletions[2] + player.challengecompletions[3] + player.challengecompletions[4] + player.challengecompletions[5]) * player.crystalUpgrades[4]))
    globalCrystalMultiplier = globalCrystalMultiplier.times(Decimal.pow(10, CalcECC('transcend', player.challengecompletions[5])))
    globalCrystalMultiplier = globalCrystalMultiplier.times(Decimal.pow(1e4, player.researches[5] * (1 + 1 / 2 * CalcECC('ascension', player.challengecompletions[14]))))
    globalCrystalMultiplier = globalCrystalMultiplier.times(Decimal.pow(2.5, player.researches[26]))
    globalCrystalMultiplier = globalCrystalMultiplier.times(Decimal.pow(2.5, player.researches[27]))


    globalMythosMultiplier = new Decimal(1)

    if (player.upgrades[37] > 0.5) {
        globalMythosMultiplier = globalMythosMultiplier.times(Decimal.pow(Decimal.log(player.prestigePoints.add(10), 10), 2))
    }
    if (player.upgrades[42] > 0.5) {
        globalMythosMultiplier = globalMythosMultiplier.times(Decimal.min(1e50, Decimal.pow(player.prestigePoints.add(1), 1 / 50).dividedBy(2.5).add(1)));
    }
    if (player.upgrades[47] > 0.5) {
        globalMythosMultiplier = globalMythosMultiplier.times(Math.pow(1.05, player.achievementPoints)).times(player.achievementPoints + 1)
    }
    if (player.upgrades[51] > 0.5) {
        globalMythosMultiplier = globalMythosMultiplier.times(Decimal.pow(totalAcceleratorBoost, 2))
    }
    if (player.upgrades[52] > 0.5) {
        globalMythosMultiplier = globalMythosMultiplier.times(Decimal.pow(globalMythosMultiplier, 0.025))
    }
    if (player.upgrades[64] > 0.5) {
        globalMythosMultiplier = globalMythosMultiplier.times(Decimal.pow(player.reincarnationPoints.add(1), 2))
    }
    if (player.researches[40] > 0.5) {
        globalMythosMultiplier = globalMythosMultiplier.times(Decimal.pow(reincarnationMultiplier, 1 / 250))
    }
    grandmasterMultiplier = new Decimal(1);
    totalMythosOwned = player.firstOwnedMythos + player.secondOwnedMythos + player.thirdOwnedMythos + player.fourthOwnedMythos + player.fifthOwnedMythos;

    mythosBuildingPower = 1 + (CalcECC('transcend', player.challengecompletions[3]) / 200);
    challengeThreeMultiplier = Decimal.pow(mythosBuildingPower, totalMythosOwned);

    grandmasterMultiplier = grandmasterMultiplier.times(challengeThreeMultiplier);

    mythosupgrade13 = new Decimal(1);
    mythosupgrade14 = new Decimal(1);
    mythosupgrade15 = new Decimal(1);
    if (player.upgrades[53] === 1) {
        mythosupgrade13 = mythosupgrade13.times(Decimal.min("1e1250", Decimal.pow(acceleratorEffect, 1 / 125)))
    }
    if (player.upgrades[54] === 1) {
        mythosupgrade14 = mythosupgrade14.times(Decimal.min("1e2000", Decimal.pow(multiplierEffect, 1 / 180)))
    }
    if (player.upgrades[55] === 1) {
        mythosupgrade15 = mythosupgrade15.times(Decimal.pow("1e1000", Math.min(1000, buildingPower - 1)))
    }

    globalAntMult = new Decimal(1);
    globalAntMult = globalAntMult.times(1 + 1 / 2500 * Math.pow(rune5level * effectiveLevelMult * (1 + player.researches[84] / 200 * (1 + 1 * effectiveRuneSpiritPower[5] * calculateCorruptionPoints() / 400)), 2))
    if (player.upgrades[76] === 1) {
        globalAntMult = globalAntMult.times(5)
    }
    globalAntMult = globalAntMult.times(Decimal.pow(1 + player.upgrades[77] / 250 + player.researches[96] / 5000, player.firstOwnedAnts + player.secondOwnedAnts + player.thirdOwnedAnts + player.fourthOwnedAnts + player.fifthOwnedAnts + player.sixthOwnedAnts + player.seventhOwnedAnts + player.eighthOwnedAnts))
    globalAntMult = globalAntMult.times(1 + player.upgrades[78] * 0.005 * Math.pow(Math.log(player.maxofferings + 1) / Math.log(10), 2))
    globalAntMult = globalAntMult.times(Math.pow(1.5, player.shopUpgrades.antSpeedLevel));
    globalAntMult = globalAntMult.times(Decimal.pow(1.11 + player.researches[101] / 1000 + player.researches[162] / 10000, player.antUpgrades[1] + bonusant1));
    globalAntMult = globalAntMult.times(antSacrificePointsToMultiplier(player.antSacrificePoints))
    globalAntMult = globalAntMult.times(Decimal.pow(Math.max(1, player.researchPoints), effectiveRuneBlessingPower[5]))
    globalAntMult = globalAntMult.times(Math.pow(1 + runeSum / 100, talisman6Power))
    globalAntMult = globalAntMult.times(Math.pow(1.1, CalcECC('reincarnation', player.challengecompletions[9])))
    globalAntMult = globalAntMult.times(cubeBonusMultiplier[6])
    if (player.achievements[169] === 1) {
        globalAntMult = globalAntMult.times(Decimal.log(player.antPoints.add(10), 10))
    }
    if (player.achievements[171] === 1) {
        globalAntMult = globalAntMult.times(1.16666)
    }
    if (player.achievements[172] === 1) {
        globalAntMult = globalAntMult.times(1 + 2 * (1 - Math.pow(2, -Math.min(1, player.reincarnationcounter / 7200))))
    }
    if (player.upgrades[39] === 1) {
        globalAntMult = globalAntMult.times(1.60)
    }
    globalAntMult = globalAntMult.times(Decimal.pow(1 + 0.1 * Decimal.log(player.ascendShards.add(1), 10), player.constantUpgrades[5]))
    globalAntMult = globalAntMult.times(Decimal.pow(1e5, CalcECC('ascension', player.challengecompletions[11])))
    if (player.researches[147] > 0) {
        globalAntMult = globalAntMult.times(Decimal.log(player.antPoints.add(10), 10))
    }
    if (player.researches[177] > 0) {
        globalAntMult = globalAntMult.times(Decimal.pow(Decimal.log(player.antPoints.add(10), 10), player.researches[177]))
    }

    if (player.currentChallenge.ascension === 12) {
        globalAntMult = Decimal.pow(globalAntMult, 0.5)
    }
    if (player.currentChallenge.ascension === 13) {
        globalAntMult = Decimal.pow(globalAntMult, 0.23)
    }
    if (player.currentChallenge.ascension === 14) {
        globalAntMult = Decimal.pow(globalAntMult, 0.2)
    }

    globalAntMult = Decimal.pow(globalAntMult, 1 - 0.9 / 90 * sumContents(player.usedCorruptions))
    globalAntMult = Decimal.pow(globalAntMult, extinctionMultiplier[player.usedCorruptions[7]])

    if (player.platonicUpgrades[12] > 0) {
        globalAntMult = globalAntMult.times(Decimal.pow(1 + 1 / 20 * player.platonicUpgrades[12], sumContents(player.highestchallengecompletions)))
    }
    if (player.currentChallenge.ascension === 15 && player.platonicUpgrades[10] > 0) {
        globalAntMult = Decimal.pow(globalAntMult, 1.25)
    }

    globalConstantMult = new Decimal("1")
    globalConstantMult = globalConstantMult.times(Decimal.pow(1.05, player.constantUpgrades[1]))
    globalConstantMult = globalConstantMult.times(Decimal.pow(1 + 0.001 * Math.min(100, player.constantUpgrades[2]), player.ascendBuilding1.owned + player.ascendBuilding2.owned + player.ascendBuilding3.owned + player.ascendBuilding4.owned + player.ascendBuilding5.owned))
    globalConstantMult = globalConstantMult.times(1 + 2 / 100 * player.researches[139])
    globalConstantMult = globalConstantMult.times(1 + 3 / 100 * player.researches[154])
    globalConstantMult = globalConstantMult.times(1 + 4 / 100 * player.researches[169])
    globalConstantMult = globalConstantMult.times(1 + 5 / 100 * player.researches[184])
    globalConstantMult = globalConstantMult.times(1 + 10 / 100 * player.researches[199])
    if (player.platonicUpgrades[5] > 0) {
        globalConstantMult = globalConstantMult.times(2)
    }
    if (player.platonicUpgrades[10] > 0) {
        globalConstantMult = globalConstantMult.times(10)
    }
    if (player.platonicUpgrades[15] > 0) {
        globalConstantMult = globalConstantMult.times(1e5)
    }

}


// Function that adds to resources each tick. [Lines 928 - 989]

function resourceGain(dt, fast) {
    fast = fast || false

    calculateTotalCoinOwned();
    calculateTotalAcceleratorBoost();

    updateAllTick();
    updateAllMultiplier();
    multipliers();
    calculatetax(fast);
    if (produceTotal.greaterThanOrEqualTo(0.001)) {
        let addcoin = new Decimal.min(produceTotal.dividedBy(taxdivisor), Decimal.pow(10, maxexponent - Decimal.log(taxdivisorcheck, 10)))
        player.coins = player.coins.add(addcoin.times(dt / 0.025));
        player.coinsThisPrestige = player.coinsThisPrestige.add(addcoin.times(dt / 0.025));
        player.coinsThisTranscension = player.coinsThisTranscension.add(addcoin.times(dt / 0.025));
        player.coinsThisReincarnation = player.coinsThisReincarnation.add(addcoin.times(dt / 0.025));
        player.coinsTotal = player.coinsTotal.add(addcoin.times(dt / 0.025))
    }

    resetCurrency();
    if (player.upgrades[93] === 1 && player.coinsThisPrestige.greaterThanOrEqualTo(1e16)) {
        player.prestigePoints = player.prestigePoints.add(Decimal.floor(prestigePointGain.dividedBy(4000).times(dt / 0.025)))
    }
    if (player.upgrades[100] === 1 && player.coinsThisTranscension.greaterThanOrEqualTo(1e100)) {
        player.transcendPoints = player.transcendPoints.add(Decimal.floor(transcendPointGain.dividedBy(4000).times(dt / 0.025)))
    }
    if (player.cubeUpgrades[28] > 0 && player.transcendShards.greaterThanOrEqualTo(1e300)) {
        player.reincarnationPoints = player.reincarnationPoints.add(Decimal.floor(reincarnationPointGain.dividedBy(4000).times(dt / 0.025)))
    }
    produceFirstDiamonds = player.firstGeneratedDiamonds.add(player.firstOwnedDiamonds).times(player.firstProduceDiamonds).times(globalCrystalMultiplier)
    produceSecondDiamonds = player.secondGeneratedDiamonds.add(player.secondOwnedDiamonds).times(player.secondProduceDiamonds).times(globalCrystalMultiplier)
    produceThirdDiamonds = player.thirdGeneratedDiamonds.add(player.thirdOwnedDiamonds).times(player.thirdProduceDiamonds).times(globalCrystalMultiplier)
    produceFourthDiamonds = player.fourthGeneratedDiamonds.add(player.fourthOwnedDiamonds).times(player.fourthProduceDiamonds).times(globalCrystalMultiplier)
    produceFifthDiamonds = player.fifthGeneratedDiamonds.add(player.fifthOwnedDiamonds).times(player.fifthProduceDiamonds).times(globalCrystalMultiplier)

    player.fourthGeneratedDiamonds = player.fourthGeneratedDiamonds.add(produceFifthDiamonds.times(dt / 0.025))
    player.thirdGeneratedDiamonds = player.thirdGeneratedDiamonds.add(produceFourthDiamonds.times(dt / 0.025))
    player.secondGeneratedDiamonds = player.secondGeneratedDiamonds.add(produceThirdDiamonds.times(dt / 0.025))
    player.firstGeneratedDiamonds = player.firstGeneratedDiamonds.add(produceSecondDiamonds.times(dt / 0.025))
    produceDiamonds = produceFirstDiamonds;

    if (player.currentChallenge.transcension !== 3 && player.currentChallenge.reincarnation !== 10) {
        player.prestigeShards = player.prestigeShards.add(produceDiamonds.times(dt / 0.025))
    }

    produceFifthMythos = player.fifthGeneratedMythos.add(player.fifthOwnedMythos).times(player.fifthProduceMythos).times(globalMythosMultiplier).times(grandmasterMultiplier).times(mythosupgrade15)
    produceFourthMythos = player.fourthGeneratedMythos.add(player.fourthOwnedMythos).times(player.fourthProduceMythos).times(globalMythosMultiplier)
    produceThirdMythos = player.thirdGeneratedMythos.add(player.thirdOwnedMythos).times(player.thirdProduceMythos).times(globalMythosMultiplier).times(mythosupgrade14)
    produceSecondMythos = player.secondGeneratedMythos.add(player.secondOwnedMythos).times(player.secondProduceMythos).times(globalMythosMultiplier)
    produceFirstMythos = player.firstGeneratedMythos.add(player.firstOwnedMythos).times(player.firstProduceMythos).times(globalMythosMultiplier).times(mythosupgrade13)
    player.fourthGeneratedMythos = player.fourthGeneratedMythos.add(produceFifthMythos.times(dt / 0.025));
    player.thirdGeneratedMythos = player.thirdGeneratedMythos.add(produceFourthMythos.times(dt / 0.025));
    player.secondGeneratedMythos = player.secondGeneratedMythos.add(produceThirdMythos.times(dt / 0.025));
    player.firstGeneratedMythos = player.firstGeneratedMythos.add(produceSecondMythos.times(dt / 0.025));


    produceMythos = new Decimal("0");
    produceMythos = (player.firstGeneratedMythos.add(player.firstOwnedMythos)).times(player.firstProduceMythos).times(globalMythosMultiplier).times(mythosupgrade13);
    producePerSecondMythos = produceMythos.times(40);

    let pm = new Decimal('1');
    if (player.upgrades[67] > 0.5) {
        pm = pm.times(Decimal.pow(1.03, player.firstOwnedParticles + player.secondOwnedParticles + player.thirdOwnedParticles + player.fourthOwnedParticles + player.fifthOwnedParticles))
    }
    produceFifthParticles = player.fifthGeneratedParticles.add(player.fifthOwnedParticles).times(player.fifthProduceParticles)
    produceFourthParticles = player.fourthGeneratedParticles.add(player.fourthOwnedParticles).times(player.fourthProduceParticles)
    produceThirdParticles = player.thirdGeneratedParticles.add(player.thirdOwnedParticles).times(player.thirdProduceParticles)
    produceSecondParticles = player.secondGeneratedParticles.add(player.secondOwnedParticles).times(player.secondProduceParticles)
    produceFirstParticles = player.firstGeneratedParticles.add(player.firstOwnedParticles).times(player.firstProduceParticles).times(pm)
    player.fourthGeneratedParticles = player.fourthGeneratedParticles.add(produceFifthParticles.times(dt / 0.025));
    player.thirdGeneratedParticles = player.thirdGeneratedParticles.add(produceFourthParticles.times(dt / 0.025));
    player.secondGeneratedParticles = player.secondGeneratedParticles.add(produceThirdParticles.times(dt / 0.025));
    player.firstGeneratedParticles = player.firstGeneratedParticles.add(produceSecondParticles.times(dt / 0.025));

    produceParticles = new Decimal("0");
    produceParticles = (player.firstGeneratedParticles.add(player.firstOwnedParticles)).times(player.firstProduceParticles).times(pm);
    producePerSecondParticles = produceParticles.times(40);

    if (player.currentChallenge.transcension !== 3 && player.currentChallenge.reincarnation !== 10) {
        player.transcendShards = player.transcendShards.add(produceMythos.times(dt / 0.025));
    }
    if (player.currentChallenge.reincarnation !== 10) {
        player.reincarnationShards = player.reincarnationShards.add(produceParticles.times(dt / 0.025))
    }

    antEightProduce = player.eighthGeneratedAnts.add(player.eighthOwnedAnts).times(player.eighthProduceAnts).times(globalAntMult)
    antSevenProduce = player.seventhGeneratedAnts.add(player.seventhOwnedAnts).times(player.seventhProduceAnts).times(globalAntMult)
    antSixProduce = player.sixthGeneratedAnts.add(player.sixthOwnedAnts).times(player.sixthProduceAnts).times(globalAntMult)
    antFiveProduce = player.fifthGeneratedAnts.add(player.fifthOwnedAnts).times(player.fifthProduceAnts).times(globalAntMult)
    antFourProduce = player.fourthGeneratedAnts.add(player.fourthOwnedAnts).times(player.fourthProduceAnts).times(globalAntMult)
    antThreeProduce = player.thirdGeneratedAnts.add(player.thirdOwnedAnts).times(player.thirdProduceAnts).times(globalAntMult)
    antTwoProduce = player.secondGeneratedAnts.add(player.secondOwnedAnts).times(player.secondProduceAnts).times(globalAntMult)
    antOneProduce = player.firstGeneratedAnts.add(player.firstOwnedAnts).times(player.firstProduceAnts).times(globalAntMult)
    player.seventhGeneratedAnts = player.seventhGeneratedAnts.add(antEightProduce.times(dt / 1))
    player.sixthGeneratedAnts = player.sixthGeneratedAnts.add(antSevenProduce.times(dt / 1))
    player.fifthGeneratedAnts = player.fifthGeneratedAnts.add(antSixProduce.times(dt / 1))
    player.fourthGeneratedAnts = player.fourthGeneratedAnts.add(antFiveProduce.times(dt / 1))
    player.thirdGeneratedAnts = player.thirdGeneratedAnts.add(antFourProduce.times(dt / 1))
    player.secondGeneratedAnts = player.secondGeneratedAnts.add(antThreeProduce.times(dt / 1))
    player.firstGeneratedAnts = player.firstGeneratedAnts.add(antTwoProduce.times(dt / 1))

    player.antPoints = player.antPoints.add(antOneProduce.times(dt / 1))

    for (let i = 1; i <= 5; i++) {
        ascendBuildingProduction[ordinals[5 - i]] = (player['ascendBuilding' + (6 - i)]['generated']).add(player['ascendBuilding' + (6 - i)]['owned']).times(player['ascendBuilding' + i]['multiplier']).times(globalConstantMult)

        if (i !== 5) {
            player['ascendBuilding' + (5 - i)]['generated'] = player['ascendBuilding' + (5 - i)]['generated'].add(ascendBuildingProduction[ordinals[5 - i]].times(dt))
        }
    }

    player.ascendShards = player.ascendShards.add(ascendBuildingProduction.first.times(dt))

    if (player.ascensionCount > 0) {
        ascensionAchievementCheck(2)
    }

    if (player.researches[71] > 0.5 && player.challengecompletions[1] < (Math.min(player.highestchallengecompletions[1], 25 + 5 * player.researches[66] + 925 * player.researches[105])) && player.coins.greaterThanOrEqualTo(Decimal.pow(10, 1.25 * challengeBaseRequirements.one * Math.pow(1 + player.challengecompletions[1], 2)))) {
        player.challengecompletions[1] += 1;
        challengeDisplay(1, false, true);
        challengeachievementcheck('one', true)
    }
    if (player.researches[72] > 0.5 && player.challengecompletions[2] < (Math.min(player.highestchallengecompletions[2], 25 + 5 * player.researches[67] + 925 * player.researches[105])) && player.coins.greaterThanOrEqualTo(Decimal.pow(10, 1.6 * challengeBaseRequirements.two * Math.pow(1 + player.challengecompletions[2], 2)))) {
        player.challengecompletions[2] += 1
        challengeDisplay(2, false, true)
        challengeachievementcheck('two', true)
    }
    if (player.researches[73] > 0.5 && player.challengecompletions[3] < (Math.min(player.highestchallengecompletions[3], 25 + 5 * player.researches[68] + 925 * player.researches[105])) && player.coins.greaterThanOrEqualTo(Decimal.pow(10, 1.7 * challengeBaseRequirements.three * Math.pow(1 + player.challengecompletions[3], 2)))) {
        player.challengecompletions[3] += 1
        challengeDisplay(3, false, true)
        challengeachievementcheck('three', true)
    }
    if (player.researches[74] > 0.5 && player.challengecompletions[4] < (Math.min(player.highestchallengecompletions[4], 25 + 5 * player.researches[69] + 925 * player.researches[105])) && player.coins.greaterThanOrEqualTo(Decimal.pow(10, 1.45 * challengeBaseRequirements.four * Math.pow(1 + player.challengecompletions[4], 2)))) {
        player.challengecompletions[4] += 1
        challengeDisplay(4, false, true)
        challengeachievementcheck('four', true)
    }
    if (player.researches[75] > 0.5 && player.challengecompletions[5] < (Math.min(player.highestchallengecompletions[5], 25 + 5 * player.researches[70] + 925 * player.researches[105])) && player.coins.greaterThanOrEqualTo(Decimal.pow(10, 2 * challengeBaseRequirements.five * Math.pow(1 + player.challengecompletions[5], 2)))) {
        player.challengecompletions[5] += 1
        challengeDisplay(5, false, true)
        challengeachievementcheck('five', true)
    }

    if (player.coins.greaterThanOrEqualTo(1000) && player.unlocks.coinone === false) {
        player.unlocks.coinone = true;
        revealStuff();
    }
    if (player.coins.greaterThanOrEqualTo(20000) && player.unlocks.cointwo === false) {
        player.unlocks.cointwo = true;
        revealStuff();
    }
    if (player.coins.greaterThanOrEqualTo(100000) && player.unlocks.cointhree === false) {
        player.unlocks.cointhree = true;
        revealStuff();
    }
    if (player.coins.greaterThanOrEqualTo(8e6) && player.unlocks.coinfour === false) {
        player.unlocks.coinfour = true;
        revealStuff();
    }
    if (!fast) {
        htmlInserts();
    }
    if (player.antPoints.greaterThanOrEqualTo(3) && player.achievements[169] === 0) {
        achievementaward(169)
    }
    if (player.antPoints.greaterThanOrEqualTo(1e5) && player.achievements[170] === 0) {
        achievementaward(170)
    }
    if (player.antPoints.greaterThanOrEqualTo(666666666) && player.achievements[171] === 0) {
        achievementaward(171)
    }
    if (player.antPoints.greaterThanOrEqualTo(1e20) && player.achievements[172] === 0) {
        achievementaward(172)
    }
    if (player.antPoints.greaterThanOrEqualTo(1e40) && player.achievements[173] === 0) {
        achievementaward(173)
    }
    if (player.antPoints.greaterThanOrEqualTo("1e500") && player.achievements[174] === 0) {
        achievementaward(174)
    }
    if (player.antPoints.greaterThanOrEqualTo("1e2500") && player.achievements[175] === 0) {
        achievementaward(175)
    }

    let chal = player.currentChallenge.transcension;
    let reinchal = player.currentChallenge.reincarnation;
    let ascendchal = player.currentChallenge.ascension;
    if (chal !== 0) {
        if (player.coinsThisTranscension.greaterThanOrEqualTo(challengeRequirement(chal, player.challengecompletions[chal], chal))) {
            resetCheck('challenge', false);
            autoChallengeTimerIncrement = 0;
        }
    }
    if (reinchal < 9 && reinchal !== 0) {
        if (player.transcendShards.greaterThanOrEqualTo(challengeRequirement(reinchal, player.challengecompletions[reinchal], reinchal))) {
            resetCheck('reincarnationchallenge', false)
            autoChallengeTimerIncrement = 0;
            if (player.challengecompletions[reinchal] >= (25 + 5 * player.cubeUpgrades[29] + 2 * player.shopUpgrades.challengeExtension)) {
                player.autoChallengeIndex += 1
            }
        }
    }
    if (reinchal >= 9) {
        if (player.coins.greaterThanOrEqualTo(challengeRequirement(reinchal, player.challengecompletions[reinchal], reinchal))) {
            resetCheck('reincarnationchallenge', false)
            autoChallengeTimerIncrement = 0;
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
        if (player.coins.greaterThanOrEqualTo(challengeRequirement(ascendchal, player.challengecompletions[ascendchal], ascendchal))) {
            resetCheck('ascensionChallenge', false)
        }
    }

}

//===================================================================
// Reset Functions. Functions that track reset currency, and then the reset tools proper. [Lines 1248 - 1326]

function resetCurrency() {
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
    prestigePow *= deflationMultiplier[player.usedCorruptions[6]]
    //Prestige Point Formulae
    prestigePointGain = Decimal.floor(Decimal.pow(player.coinsThisPrestige.dividedBy(1e12), prestigePow));
    if (player.upgrades[16] > 0.5 && player.currentChallenge.transcension !== 5 && player.currentChallenge.reincarnation !== 10) {
        prestigePointGain = prestigePointGain.times(Decimal.pow(acceleratorEffect, 1 / 3 * deflationMultiplier[player.usedCorruptions[9]]));
    }

    //Transcend Point Formulae
    transcendPointGain = Decimal.floor(Decimal.pow(player.coinsThisTranscension.dividedBy(1e100), transcendPow));
    if (player.upgrades[44] > 0.5 && player.currentChallenge.transcension !== 5 && player.currentChallenge.reincarnation !== 10) {
        transcendPointGain = transcendPointGain.times(Decimal.min(1e6, Decimal.pow(1.01, player.transcendCount)));
    }

    //Reincarnation Point Formulae
    reincarnationPointGain = Decimal.floor(Decimal.pow(player.transcendShards.dividedBy(1e300), 0.01));
    if (player.currentChallenge.reincarnation !== 0) {
        reincarnationPointGain = Decimal.pow(reincarnationPointGain, 0.01)
    }
    if (player.achievements[50] === 1) {
        reincarnationPointGain = reincarnationPointGain.times(2)
    }
    if (player.upgrades[65] > 0.5) {
        reincarnationPointGain = reincarnationPointGain.times(5)
    }
    if (player.currentChallenge.ascension === 12) {
        reincarnationPointGain = new Decimal("0")
    }
}

function resetCheck(i, manual, leaving) {
    manual = (manual === null || manual === undefined) ? true : manual;
    leaving = (leaving === null || leaving === undefined) ? false : leaving;
    if (i === 'prestige') {
        if (player.coinsThisPrestige.greaterThanOrEqualTo(1e16) || prestigePointGain.greaterThanOrEqualTo(100)) {
            if (manual) {
                resetConfirmation('prestige');
            } else {
                resetachievementcheck(1);
                reset(1);
            }
        } else {
        }
    }
    if (i === 'transcend') {
        if ((player.coinsThisTranscension.greaterThanOrEqualTo(1e100) || transcendPointGain.greaterThanOrEqualTo(0.5)) && player.currentChallenge.transcension === 0) {
            if (manual) {
                resetConfirmation('transcend');
            }
            if (!manual) {
                resetachievementcheck(2);
                reset(2);
            }
        }
    }
    if (i === 'challenge') {
        let q = player.currentChallenge.transcension;
        let x = q + 65
        if (player.currentChallenge.transcension !== 0) {
            let reqCheck = (comp) => {
                return player.coinsThisTranscension.greaterThanOrEqualTo(challengeRequirement(q, comp, q))
            }
            let maxCompletions = 25 + 5 * player.researches[x] + 925 * player.researches[105];
            if (reqCheck(player.challengecompletions[q]) && player.challengecompletions[q] < maxCompletions) {
                let maxInc = player.shopUpgrades.instantChallengeBought && player.currentChallenge.ascension !== 13 ? 10 : 1; // TODO: Implement the shop upgrade levels here
                let counter = 0;
                let comp = player.challengecompletions[q];
                while (counter < maxInc) {
                    if (reqCheck(comp) && comp < maxCompletions) {
                        comp++;
                    }
                    counter++;
                }
                player.challengecompletions[q] = comp;
                let y = x - 65
                challengeDisplay(y, true)
            }
            if (player.challengecompletions[q] > player.highestchallengecompletions[q]) {
                while (player.challengecompletions[q] > player.highestchallengecompletions[q]) {
                    player.highestchallengecompletions[q] += 1;
                    let y = x - 65;
                    challengeDisplay(y, true)
                    highestChallengeRewards(q, player.highestchallengecompletions[q])
                    updateCubesPerSec()
                    calculateCubeBlessings();
                }

            }

            challengeachievementcheck(q);
            if (!player.shopUpgrades.instantChallengeBought || leaving) {
                reset(2, false, "leaveChallenge");
                player.transcendCount -= 1;
            }

        }
        if (!player.retrychallenges || manual || player.challengecompletions[q] >= (25 + 5 * player.researches[x] + 925 * player.researches[105])) {
            player.currentChallenge.transcension = 0;
            updateChallengeDisplay();
        }
    }

    if (i === "reincarnate") {
        if (reincarnationPointGain > 0.5 && player.currentChallenge.transcension === 0 && player.currentChallenge.reincarnation === 0) {
            if (manual) {
                resetConfirmation('reincarnate');
            }
            if (!manual) {
                resetachievementcheck(3);
                reset(3);
            }
        }
    }
    if (i === "reincarnationchallenge" && player.currentChallenge.reincarnation !== 0) {
        let q = player.currentChallenge.reincarnation;
        let s = player.currentChallenge.transcension;
        if (player.currentChallenge.transcension !== 0) {
            player.currentChallenge.transcension = 0
        }
        let reqCheck = (comp) => {
            if (q <= 8) {
                return player.transcendShards.greaterThanOrEqualTo(challengeRequirement(q, comp, q))
            } else { // challenges 9 and 10
                return player.coins.greaterThanOrEqualTo(challengeRequirement(q, comp, q))
            }
        }
        let maxCompletions = 25 + 5 * player.cubeUpgrades[29] + 2 * player.shopUpgrades.challengeExtension + 5 * player.platonicUpgrades[5] + 5 * player.platonicUpgrades[10] + 10 * player.platonicUpgrades[15];
        if (reqCheck(player.challengecompletions[q]) && player.challengecompletions[q] < maxCompletions) {
            let maxInc = player.shopUpgrades.instantChallengeBought && player.currentChallenge.ascension !== 13 ? 10 : 1; // TODO: Implement the shop upgrade levels here
            let counter = 0;
            let comp = player.challengecompletions[q];
            while (counter < maxInc) {
                if (reqCheck(comp) && comp < maxCompletions) {
                    comp++;
                }
                counter++;
            }
            player.challengecompletions[q] = comp;
            challengeDisplay(q, true)
        }
        if (!player.shopUpgrades.instantChallengeBought || leaving) { // TODO: Implement the upgrade levels here
            reset(3, false, "leaveChallenge");
            player.reincarnationCount -= 1;
        }
        challengeachievementcheck(q);
        if (player.challengecompletions[q] > player.highestchallengecompletions[q]) {
            while (player.challengecompletions[q] > player.highestchallengecompletions[q]) {
                player.highestchallengecompletions[q] += 1;
                highestChallengeRewards(q, player.highestchallengecompletions[q])
                updateCubesPerSec()
                calculateHypercubeBlessings();
                calculateTesseractBlessings();
                calculateCubeBlessings();
            }
        }
        if (!player.retrychallenges || manual || player.challengecompletions[q] > 24 + 5 * player.cubeUpgrades[29] + 2 * player.shopUpgrades.challengeExtension + 5 * player.platonicUpgrades[5] + 5 * player.platonicUpgrades[10] + 10 * player.platonicUpgrades[15]) {
            reset(3, false, "leaveChallenge");
            player.currentChallenge.reincarnation = 0;
            if (player.shopUpgrades.instantChallengeBought) {
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
            conf = confirm('Are you absolutely sure that you want to exit the Ascension Challenge? You will need to clear challenge 10 again before you can attempt the challenge again!')
        }
        if (!conf) {
            return;
        }
        let a = player.currentChallenge.ascension;
        let r = player.currentChallenge.reincarnation;
        let t = player.currentChallenge.transcension;

        if (player.challengecompletions[10] >= 50 && a === 11 && player.usedCorruptions[7] >= 5 && player.achievements[247] < 1) {
            achievementaward(247)
        }

        let maxCompletions = a < 15 ? 30 + 3 * player.platonicUpgrades[5] + 3 * player.platonicUpgrades[10] + 4 * player.platonicUpgrades[15] : 1;
        if (a !== 0 && a < 15) {
            if (player.challengecompletions[10] >= challengeRequirement(a, player.challengecompletions[a], a) && player.challengecompletions[a] < maxCompletions) {
                player.challengecompletions[a] += 1;
            }
        }
        if (a === 15) {
            if (player.coins.greaterThanOrEqualTo(challengeRequirement(a, player.challengecompletions[a], a)) && player.challengecompletions[a] < maxCompletions) {
                player.challengecompletions[a] += 1;
            }
        }
        if (r !== 0) {
            player.currentChallenge.reincarnation = 0;
        }
        if (t !== 0) {
            player.currentChallenge.transcension = 0;
        }
        challengeDisplay(a, true)
        reset(4)

        if (player.challengecompletions[a] > player.highestchallengecompletions[a]) {
            player.highestchallengecompletions[a] += 1;
            player.wowHypercubes += 1;
        }

        if (!player.retrychallenges || manual || player.challengecompletions[a] >= maxCompletions) {
            player.currentChallenge.ascension = 0;
        }
        updateChallengeDisplay();
        challengeachievementcheck(a, true)
    }
}

function resetConfirmation(i) {
    if (i === 'prestige') {
        if (player.toggles[28] === true) {
            let r = confirm("Prestige will reset coin upgrades, coin producers AND crystals. The first prestige unlocks new features. Would you like to prestige? [Toggle this message in settings.]")
            if (r === true) {
                resetachievementcheck(1);
                reset(1);
            }
        } else {
            resetachievementcheck(1);
            reset(1);
        }
    }
    if (i === 'transcend') {
        if (player.toggles[29] === true) {
            let z = confirm("Transcends will reset coin and prestige upgrades, coin producers, crystal producers AND diamonds. The first transcension unlocks new features. Would you like to prestige? [Toggle this message in settings.]")
            if (z === true) {
                resetachievementcheck(2);
                reset(2);
            }
        } else {
            resetachievementcheck(2);
            reset(2);
        }
    }
    if (i === 'reincarnate') {
        if (player.currentChallenge.ascension !== 12) {
            if (player.toggles[30] === true) {
                let z = confirm("Reincarnating will reset EVERYTHING but in return you will get extraordinarily powerful Particles, and unlock some very strong upgrades and some new features. would you like to Reincarnate? [Disable this message in settings]")
                if (z === true) {
                    resetachievementcheck(3);
                    reset(3);
                }
            } else {
                resetachievementcheck(3);
                reset(3);
            }
        }
    }
    if (i === 'ascend') {
        let z = !player.toggles[31] || confirm("Ascending will reset all buildings, rune levels [NOT CAP!], talismans, most researches, and the anthill feature for Cubes of Power. Continue? [It is strongly advised you get R5x24 first.]")
        if (z) {
            reset(4);
        }
    }
}

function updateAll() {
    uFourteenMulti = new Decimal(1);
    uFifteenMulti = new Decimal(1);

    if (player.upgrades[14] > 0.5) {
        uFourteenMulti = Decimal.pow(1.15, freeAccelerator)
    }
    if (player.upgrades[15] > 0.5) {
        uFifteenMulti = Decimal.pow(1.15, freeAccelerator)
    }

    if (player.researches[200] >= 1e5 && player.achievements[250] < 1) {
        achievementaward(250)
    }
    if (player.cubeUpgrades[50] >= 1e5 && player.achievements[251] < 1) {
        achievementaward(251)
    }

//Autobuy "Building" Tab

    if (player.toggles[1] === true && player.upgrades[81] === 1 && player.coins.greaterThanOrEqualTo(player.firstCostCoin)) {
        buyMax('first', 'Coin', 1, 100, true)
    }
    if (player.toggles[2] === true && player.upgrades[82] === 1 && player.coins.greaterThanOrEqualTo(player.secondCostCoin)) {
        buyMax('second', 'Coin', 2, 2e3, true)
    }
    if (player.toggles[3] === true && player.upgrades[83] === 1 && player.coins.greaterThanOrEqualTo(player.thirdCostCoin)) {
        buyMax('third', 'Coin', 3, 4e4, true)
    }
    if (player.toggles[4] === true && player.upgrades[84] === 1 && player.coins.greaterThanOrEqualTo(player.fourthCostCoin)) {
        buyMax('fourth', 'Coin', 4, 8e5, true)
    }
    if (player.toggles[5] === true && player.upgrades[85] === 1 && player.coins.greaterThanOrEqualTo(player.fifthCostCoin)) {
        buyMax('fifth', 'Coin', 5, 1.6e7, true)
    }
    if (player.toggles[6] === true && player.upgrades[86] === 1 && player.coins.greaterThanOrEqualTo(player.acceleratorCost)) {
        buyAccelerator(true);
    }
    if (player.toggles[7] === true && player.upgrades[87] === 1 && player.coins.greaterThanOrEqualTo(player.multiplierCost)) {
        buyMultiplier(true);
    }
    if (player.toggles[8] === true && player.upgrades[88] === 1 && player.prestigePoints.greaterThanOrEqualTo(player.acceleratorBoostCost)) {
        boostAccelerator(true);
    }

//Autobuy "Prestige" Tab

    if (player.toggles[10] === true && player.achievements[78] === 1 && player.prestigePoints.greaterThanOrEqualTo(player.firstCostDiamonds)) {
        buyMax('first', 'Diamonds', 1, 1e2, true)
    }
    if (player.toggles[11] === true && player.achievements[85] === 1 && player.prestigePoints.greaterThanOrEqualTo(player.secondCostDiamonds)) {
        buyMax('second', 'Diamonds', 3, 1e5, true)
    }
    if (player.toggles[12] === true && player.achievements[92] === 1 && player.prestigePoints.greaterThanOrEqualTo(player.thirdCostDiamonds)) {
        buyMax('third', 'Diamonds', 6, 1e15, true)
    }
    if (player.toggles[13] === true && player.achievements[99] === 1 && player.prestigePoints.greaterThanOrEqualTo(player.fourthCostDiamonds)) {
        buyMax('fourth', 'Diamonds', 10, 1e40, true)
    }
    if (player.toggles[14] === true && player.achievements[106] === 1 && player.prestigePoints.greaterThanOrEqualTo(player.fifthCostDiamonds)) {
        buyMax('fifth', 'Diamonds', 15, 1e100, true)
    }


    if (player.resettoggle1 === 1 || player.resettoggle1 === 0) {
        if (player.toggles[15] === true && player.achievements[43] === 1 && prestigePointGain.greaterThanOrEqualTo(player.prestigePoints.times(Decimal.pow(10, player.prestigeamount))) && player.coinsThisPrestige.greaterThanOrEqualTo(1e16)) {
            resetachievementcheck(1);
            reset(1, true)
        }
    }
    if (player.resettoggle1 === 2) {
        let time = Math.max(0.25, player.prestigeamount);
        if (player.toggles[15] === true && player.achievements[43] === 1 && player.prestigecounter >= time && player.coinsThisPrestige.greaterThanOrEqualTo(1e16)) {
            resetachievementcheck(1);
            reset(1, true);
        }
    }
    let c = 0;
    c += Math.floor(rune3level / 16 * effectiveLevelMult) * 100 / 100
    if (player.upgrades[73] > 0.5 && player.currentChallenge.reincarnation !== 0) {
        c += 10
    }
    if (player.achievements[79] > 0.5 && player.prestigeShards.greaterThanOrEqualTo(Decimal.pow(10, (crystalUpgradesCost[0] + crystalUpgradeCostIncrement[0] * Math.floor(Math.pow(player.crystalUpgrades[0] - 0.5 - c, 2) / 2))))) {
        buyCrystalUpgrades(1, true)
    }
    if (player.achievements[86] > 0.5 && player.prestigeShards.greaterThanOrEqualTo(Decimal.pow(10, (crystalUpgradesCost[1] + crystalUpgradeCostIncrement[1] * Math.floor(Math.pow(player.crystalUpgrades[1] - 0.5 - c, 2) / 2))))) {
        buyCrystalUpgrades(2, true)
    }
    if (player.achievements[93] > 0.5 && player.prestigeShards.greaterThanOrEqualTo(Decimal.pow(10, (crystalUpgradesCost[2] + crystalUpgradeCostIncrement[2] * Math.floor(Math.pow(player.crystalUpgrades[2] - 0.5 - c, 2) / 2))))) {
        buyCrystalUpgrades(3, true)
    }
    if (player.achievements[100] > 0.5 && player.prestigeShards.greaterThanOrEqualTo(Decimal.pow(10, (crystalUpgradesCost[3] + crystalUpgradeCostIncrement[3] * Math.floor(Math.pow(player.crystalUpgrades[3] - 0.5 - c, 2) / 2))))) {
        buyCrystalUpgrades(4, true)
    }
    if (player.achievements[107] > 0.5 && player.prestigeShards.greaterThanOrEqualTo(Decimal.pow(10, (crystalUpgradesCost[4] + crystalUpgradeCostIncrement[4] * Math.floor(Math.pow(player.crystalUpgrades[4] - 0.5 - c, 2) / 2))))) {
        buyCrystalUpgrades(5, true)
    }

//Autobuy "Transcension" Tab

    if (player.toggles[16] === true && player.upgrades[94] === 1 && player.transcendPoints.greaterThanOrEqualTo(player.firstCostMythos)) {
        buyMax('first', 'Mythos', 1, 1, true)
    }
    if (player.toggles[17] === true && player.upgrades[95] === 1 && player.transcendPoints.greaterThanOrEqualTo(player.secondCostMythos)) {
        buyMax('second', 'Mythos', 3, 1e2, true)
    }
    if (player.toggles[18] === true && player.upgrades[96] === 1 && player.transcendPoints.greaterThanOrEqualTo(player.thirdCostMythos)) {
        buyMax('third', 'Mythos', 6, 1e4, true)
    }
    if (player.toggles[19] === true && player.upgrades[97] === 1 && player.transcendPoints.greaterThanOrEqualTo(player.fourthCostMythos)) {
        buyMax('fourth', 'Mythos', 10, 1e8, true)
    }
    if (player.toggles[20] === true && player.upgrades[98] === 1 && player.transcendPoints.greaterThanOrEqualTo(player.fifthCostMythos)) {
        buyMax('fifth', 'Mythos', 15, 1e16, true)
    }

    if (player.resettoggle2 === 1 || player.resettoggle2 === 0) {
        if (player.toggles[21] === true && player.upgrades[89] === 1 && transcendPointGain.greaterThanOrEqualTo(player.transcendPoints.times(Decimal.pow(10, player.transcendamount))) && player.coinsThisTranscension.greaterThanOrEqualTo(1e100) && player.currentChallenge.transcension === 0) {
            resetachievementcheck(2);
            reset(2, true);
        }
    }
    if (player.resettoggle2 === 2) {
        let time = Math.max(0.25, player.transcendamount);
        if (player.toggles[21] === true && player.upgrades[89] === 1 && player.transcendcounter >= time && player.coinsThisTranscension.greaterThanOrEqualTo(1e100) && player.currentChallenge.transcension === 0) {
            resetachievementcheck(2);
            reset(2, true);
        }
    }


//Autobuy "Reincarnation" Tab

    if (player.toggles[22] === true && player.reincarnationPoints.greaterThanOrEqualTo(player.firstCostParticles)) {
        buyParticleBuilding('first', 1, true)
    }
    if (player.toggles[23] === true && player.reincarnationPoints.greaterThanOrEqualTo(player.secondCostParticles)) {
        buyParticleBuilding('second', 1e2, true)
    }
    if (player.toggles[24] === true && player.reincarnationPoints.greaterThanOrEqualTo(player.thirdCostParticles)) {
        buyParticleBuilding('third', 1e4, true)
    }
    if (player.toggles[25] === true && player.reincarnationPoints.greaterThanOrEqualTo(player.fourthCostParticles)) {
        buyParticleBuilding('fourth', 1e8, true)
    }
    if (player.toggles[26] === true && player.reincarnationPoints.greaterThanOrEqualTo(player.fifthCostParticles)) {
        buyParticleBuilding('fifth', 1e16, true)
    }
    if (player.currentChallenge.ascension !== 12) {
        if (player.resettoggle3 === 2) {
            let time = Math.max(0.25, player.reincarnationamount);
            if (player.toggles[27] === true && player.researches[46] > 0.5 && player.transcendShards.greaterThanOrEqualTo("1e300") && player.reincarnationcounter >= time && player.currentChallenge.transcension === 0 && player.currentChallenge.reincarnation === 0) {
                resetachievementcheck(3);
                reset(3, true);
            }
        }
        if (player.resettoggle3 === 1 || player.resettoggle3 === 0) {
            if (player.toggles[27] === true && player.researches[46] > 0.5 && reincarnationPointGain.greaterThanOrEqualTo(player.reincarnationPoints.times(Decimal.pow(10, player.reincarnationamount))) && player.transcendShards.greaterThanOrEqualTo(1e300) && player.currentChallenge.transcension === 0 && player.currentChallenge.reincarnation === 0) {
                resetachievementcheck(3);
                reset(3, true)
            }
        }
    }

//Autobuy "ascension" tab
    if (player.researches[175] > 0) {
        for (let i = 1; i <= 10; i++) {
            if (player.ascendShards.greaterThanOrEqualTo(getConstUpgradeMetadata(i))) {
                buyConstantUpgrades(i, true);
            }
        }
    }

    if (player.researches[190] > 0) {
        if (player.wowTesseracts >= 10000 * Math.pow(1 + player.ascendBuilding5.owned, 3) && player.autoTesseracts[5]) {
            buyTesseractBuilding(10000, 5)
        }
        if (player.wowTesseracts >= 1000 * Math.pow(1 + player.ascendBuilding4.owned, 3) && player.autoTesseracts[4]) {
            buyTesseractBuilding(1000, 4)
        }
        if (player.wowTesseracts >= 100 * Math.pow(1 + player.ascendBuilding3.owned, 3) && player.autoTesseracts[3]) {
            buyTesseractBuilding(100, 3)
        }
        if (player.wowTesseracts >= 10 * Math.pow(1 + player.ascendBuilding2.owned, 3) && player.autoTesseracts[2]) {
            buyTesseractBuilding(10, 2)
        }
        if (player.wowTesseracts >= 1 * Math.pow(1 + player.ascendBuilding1.owned, 3) && player.autoTesseracts[1]) {
            buyTesseractBuilding(1, 1)
        }
    }


//Generation


    if (player.upgrades[101] > 0.5) {
        player.fourthGeneratedCoin = player.fourthGeneratedCoin.add((player.fifthGeneratedCoin.add(player.fifthOwnedCoin)).times(uFifteenMulti).times(generatorPower));
    }
    if (player.upgrades[102] > 0.5) {
        player.thirdGeneratedCoin = player.thirdGeneratedCoin.add((player.fourthGeneratedCoin.add(player.fourthOwnedCoin)).times(uFourteenMulti).times(generatorPower));
    }
    if (player.upgrades[103] > 0.5) {
        player.secondGeneratedCoin = player.secondGeneratedCoin.add((player.thirdGeneratedCoin.add(player.thirdOwnedCoin)).times(generatorPower));
    }
    if (player.upgrades[104] > 0.5) {
        player.firstGeneratedCoin = player.firstGeneratedCoin.add((player.secondGeneratedCoin.add(player.secondOwnedCoin)).times(generatorPower));
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

    effectiveLevelMult = 1;
    effectiveLevelMult *= (1 + player.researches[4] / 10 * (1 + 1 / 2 * CalcECC('ascension', player.challengecompletions[14]))) //Research 1x4
    effectiveLevelMult *= (1 + player.researches[21] / 100) //Research 2x6
    effectiveLevelMult *= (1 + player.researches[90] / 100) //Research 4x15
    effectiveLevelMult *= (1 + player.researches[131] / 200) //Research 6x6
    effectiveLevelMult *= (1 + player.researches[161] / 200 * 3 / 5) //Research 7x11
    effectiveLevelMult *= (1 + player.researches[176] / 200 * 2 / 5) //Research 8x1
    effectiveLevelMult *= (1 + player.researches[191] / 200 * 1 / 5) //Research 8x16
    effectiveLevelMult *= (1 + player.researches[146] / 200 * 4 / 5) //Research 6x21
    effectiveLevelMult *= (1 + 0.01 * Math.log(player.talismanShards + 1) / Math.log(4) * Math.min(1, player.constantUpgrades[9]))

    optimalOfferingTimer = 600 + 30 * player.researches[85] + 0.4 * rune5level + 120 * player.shopUpgrades.offeringTimerLevel
    optimalObtainiumTimer = 3600 + 120 * player.shopUpgrades.obtainiumTimerLevel
    autoBuyAnts()

    let timer = player.autoAntSacrificeMode === 2 ? player.antSacrificeTimerReal : player.antSacrificeTimer;
    if (timer >= player.autoAntSacTimer && player.researches[124] === 1 && player.autoAntSacrifice && player.antPoints.greaterThanOrEqualTo("1e40")) {
        sacrificeAnts(true)
    }


    if (player.autoAscend) {
        if (player.autoAscendMode === "c10Completions" && player.challengecompletions[10] >= Math.max(1, player.autoAscendThreshold)) {
            reset(4, true)
        }
    }
    let metaData = ''
    if (player.researches[175] > 0) {
        for (let i = 1; i <= 10; i++) {
            metaData = getConstUpgradeMetadata(i)
            if (player.ascendShards.greaterThanOrEqualTo(metaData[1])) {
                buyConstantUpgrades(i, true);
            }
        }
    }

    let reductionValue = getReductionValue();
    if (reductionValue !== prevReductionValue) {
        prevReductionValue = reductionValue;
        let resources = ["Coin", "Diamonds", "Mythos"];
        let scalings = [
            function (value) {
                return value;
            },
            function (value) {
                return value * (value + 1) / 2;
            },
            function (value) {
                return value * (value + 1) / 2;
            },
        ];
        let originalCosts = [
            [100, 2e3, 4e4, 8e5, 1.6e7],
            [1e2, 1e5, 1e15, 1e40, 1e100],
            [1, 1e2, 1e4, 1e8, 1e16],
        ];

        for (let res = 0; res < resources.length; ++res) {
            let resource = resources[res];
            for (let ord = 0; ord < 5; ++ord) {
                let num = ordinals[ord];
                player[num + "Cost" + resource] = getCost(originalCosts[res][ord], player[num + "Owned" + resource] + 1, resource, scalings[res](ord + 1), reductionValue);
            }
        }

        for (let i = 0; i <= 4; i++) {
            let particleOriginalCost = [1, 1e2, 1e4, 1e8, 1e16]
            let array = ['first', 'second', 'third', 'fourth', 'fifth']
            let buyTo = player[array[i] + 'OwnedParticles'] + 1
            player[array[i] + 'CostParticles'] = new Decimal(Decimal.pow(2, buyTo - 1).times(Decimal.pow(1.001, Math.max(0, (buyTo - 325000)) * Math.max(0, (buyTo - 325000) + 1) / 2))).times(particleOriginalCost[i])
        }
    }
}

function constantIntervals() {
    interval(saveSynergy, 5000);
    interval(autoUpgrades, 200);
    interval(buttoncolorchange, 200)
    interval(updateAll, 100)
    interval(buildingAchievementCheck, 200)

    if (!timeWarp) {
        document.getElementById("preload").style.display = "none";
        document.getElementById("offlineprogressbar").style.display = "none"
    }
}

let lastUpdate = 0;

//gameInterval = 0;

function createTimer() {
    lastUpdate = Date.now();
    interval(tick, 50);
}


function tick() {

    if (!timeWarp) {
        let now = Date.now();
        let dt = Math.max(0, Math.min(36000, (now - lastUpdate) / 1000));

        dailyResetCheck();
        let timeMult = calculateTimeAcceleration();
        lastUpdate = now;

        player.quarkstimer += dt
        if (player.quarkstimer >= (90000 + 45000 * player.researches[195])) {
            player.quarkstimer = (90000 + 45000 * player.researches[195])
        }
        if (player.researches[61] > 0) {
            player.obtainiumtimer += (dt * timeMult);
        }
        if (player.researches[61] > 0) {
            document.getElementById("automaticobtainium").textContent = "Thanks to researches you automatically gain " + format(calculateAutomaticObtainium(), 3, true) + " Obtainium per real life second."
        }

        const onExportQuarks = (Math.floor(player.quarkstimer / 3600) * (1 + player.researches[99] + player.researches[100] + talisman7Quarks + player.researches[125] + player.researches[180] + player.researches[195]));
        const maxExportQuarks = ((25 * (1 + player.researches[195] / 2)) * (1 + player.researches[99] + player.researches[100] + talisman7Quarks + player.researches[125] + player.researches[180] + player.researches[195]));

        document.getElementById("quarktimerdisplay").textContent = format((3600 - (player.quarkstimer % 3600.00001)), 2) + "s until +" + (1 + player.researches[99] + player.researches[100] + talisman7Quarks + player.researches[125] + player.researches[180] + player.researches[195]) + " export Quark"
        document.getElementById("quarktimeramount").textContent = "Quarks on export: "
            + onExportQuarks
            + " [Max "
            + format(maxExportQuarks)
            + "]"

        if (onExportQuarks === maxExportQuarks) {
            const settingsTab = document.getElementById('settingstab');
            settingsTab.style.backgroundColor = 'orange';
            settingsTab.style.border = '1px solid gold';
            settingsTab.setAttribute('full', 1);
        }

        if (player.shopUpgrades.offeringAutoLevel > 0.5 && player.autoSacrificeToggle) {
            player.sacrificeTimer += (dt * timeMult)
            if (player.sacrificeTimer >= 1) {
                if (player.cubeUpgrades[20] === 0) {
                    let rune = player.autoSacrifice;
                    redeemShards(rune, true, 0);
                    player.sacrificeTimer -= 1;
                }
                if (player.cubeUpgrades[20] === 1 && player.runeshards >= 5) {
                    let unmaxed = 0;
                    for (let i = 1; i <= 5; i++) {
                        if (player.runelevels[i - 1] < calculateMaxRunes(i))
                            unmaxed++;
                    }
                    if (unmaxed > 0) {
                        let baseAmount = Math.floor(player.runeshards / unmaxed);
                        for (let i = 1; i <= 5; i++) {
                            redeemShards(i, true, baseAmount);
                        }
                        player.sacrificeTimer = player.sacrificeTimer % 1;
                    }
                }
            }
        }

        if (player.achievements[173] === 1) {
            player.antSacrificeTimer += (dt * timeMult)
            player.antSacrificeTimerReal += dt;
            document.getElementById("antSacrificeTimer").textContent = formatTimeShort(player.antSacrificeTimer);
            showSacrifice();
        }
        calculateObtainium();
        if (player.researches[61] === 1) {
            player.researchPoints += calculateAutomaticObtainium() * dt
            if (player.autoResearch > 0 && player.autoResearchToggle && player.autoResearch <= maxRoombaResearchIndex(player)) {
                // buyResearch() probably shouldn't even be called if player.autoResearch exceeds the highest unlocked research
                let counter = 0;
                let maxCount = 1 + player.challengecompletions[14];
                while (counter < maxCount) {
                    if (player.autoResearch) {
                        linGrowth = (player.autoResearch === 200) ? 0.01 : 0;
                        buyResearch(player.autoResearch, true, linGrowth)
                    }
                    counter++;
                }
            }
        }

        if (player.highestchallengecompletions[3] > 0) {
            autoOfferingCounter += dt
            if (autoOfferingCounter > 2) {
                player.runeshards += Math.floor(autoOfferingCounter / 2)
            }
            autoOfferingCounter = autoOfferingCounter % 2
        }

        if (player.cubeUpgrades[2] > 0) {
            autoOfferingCounter2 += dt
            if (autoOfferingCounter2 > (1 / player.cubeUpgrades[2])) {
                player.runeshards += Math.floor(autoOfferingCounter2 * player.cubeUpgrades[2])
            }
            autoOfferingCounter2 = autoOfferingCounter2 % (1 / player.cubeUpgrades[2])
        }

        if (player.researches[130] > 0 || player.researches[135] > 0) {
            autoTalismanTimer += dt
            if (autoTalismanTimer >= 2) {
                autoTalismanTimer = autoTalismanTimer % 2;
                if (player.researches[135] > 0) {
                    if (player.achievements[119] > 0) {
                        buyTalismanEnhance(1, true)
                    }
                    if (player.achievements[126] > 0) {
                        buyTalismanEnhance(2, true)
                    }
                    if (player.achievements[133] > 0) {
                        buyTalismanEnhance(3, true)
                    }
                    if (player.achievements[140] > 0) {
                        buyTalismanEnhance(4, true)
                    }
                    if (player.achievements[147] > 0) {
                        buyTalismanEnhance(5, true)
                    }
                    if (player.antUpgrades[12] > 0 || player.ascensionCount > 0) {
                        buyTalismanEnhance(6, true)
                    }
                    if (player.shopUpgrades.talismanBought) {
                        buyTalismanEnhance(7, true)
                    }
                }
                if (player.researches[130] > 0) {
                    if (player.achievements[119] > 0) {
                        buyTalismanLevels(1, true)
                    }
                    if (player.achievements[126] > 0) {
                        buyTalismanLevels(2, true)
                    }
                    if (player.achievements[133] > 0) {
                        buyTalismanLevels(3, true)
                    }
                    if (player.achievements[140] > 0) {
                        buyTalismanLevels(4, true)
                    }
                    if (player.achievements[147] > 0) {
                        buyTalismanLevels(5, true)
                    }
                    if (player.antUpgrades[12] > 0 || player.ascensionCount > 0) {
                        buyTalismanLevels(6, true)
                    }
                    if (player.shopUpgrades.talismanBought) {
                        buyTalismanLevels(7, true)
                    }
                }
            }
        }

        runChallengeSweep(dt);

        if (dt > 5) {
            while (dt > 5) {
                player.prestigecounter += 5 * timeMult;
                player.transcendcounter += 5 * timeMult;
                player.reincarnationcounter += 5 * timeMult;
                player.ascensionCounter += 5
                resourceGain(5 * timeMult);
                updateAll();
                dt -= 5
            }
            player.prestigecounter += (dt * timeMult);
            player.transcendcounter += (dt * timeMult);
            player.reincarnationcounter += (dt * timeMult);
            player.ascensionCounter += dt
            resourceGain(dt * timeMult);
            updateAll();
            player.offlinetick = Date.now()
        } else if (dt <= 5) {
            resourceGain(dt * timeMult);
            player.prestigecounter += (dt * timeMult);
            player.transcendcounter += (dt * timeMult);
            player.reincarnationcounter += (dt * timeMult);
            player.ascensionCounter += dt
        }
    }

    calculateOfferings(3)
}


window['addEventListener' in window ? 'addEventListener' : 'attachEvents']('beforeunload', function () {
    if (typeof updatetimer === 'function') {
        updatetimer();
    }
});

document['addEventListener' in document ? 'addEventListener' : 'attachEvent']('keydown', function (event) {

    if (document.activeElement.localName === 'input') {
        // https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation
        // finally fixes the bug where hotkeys would be activated when typing in an input field
        event.stopPropagation();
        return;
    }
    // activeElement is the focused element on page
    // if the autoprestige input is focused, hotkeys shouldn't work
    // fixes https://github.com/Pseudo-Corp/Synergism-Issue-Tracker/issues/2
    if (
        document.querySelector('#prestigeamount') === document.activeElement ||
        document.querySelector('#transcendamount') === document.activeElement ||
        document.querySelector('#reincarnationamount') === document.activeElement ||
        document.querySelector("#startAutoChallengeTimerInput") === document.activeElement ||
        document.querySelector("#exitAutoChallengeTimerInput") === document.activeElement ||
        document.querySelector("#enterAutoChallengeTimerInput") === document.activeElement
    ) {
        // https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation
        // finally fixes the bug where hotkeys would be activated when typing in an input field
        event.stopPropagation();
        return;
    }

    let type = ""
    let pos = ""
    let num = 0

    cost = [null, 1, 100, 1e4, 1e8, 1e16]
    if (buildingSubTab === "coin") {
        cost = [null, 100, 2000, 4e4, 8e5, 1.6e7];
        type = "Coin"
    }
    if (buildingSubTab === "diamond") {
        cost = [null, 100, 1e5, 1e15, 1e40, 1e100];
        type = "Diamonds"
    }
    if (buildingSubTab === "mythos") {
        type = "Mythos"
    }

    let key = event.key.toUpperCase()
    switch (key) {
        case "1":
            pos = 'first';
            num = 1;
            if (currentTab === "buildings") {
                buildingSubTab === "particle" ? buyParticleBuilding(pos, cost[1]) : buyMax(pos, type, num, cost[1], false)
            }
            if (currentTab === "runes") {
                if (runescreen === "runes") {
                    redeemShards(1)
                }
                if (runescreen === "blessings") {
                    buyRuneBonusLevels(1, 1)
                }
                if (runescreen === "spirits") {
                    buyRuneBonusLevels(2, 1)
                }
            }
            if (currentTab === "challenges") {
                toggleChallenges(1)
                challengeDisplay(1);
            }
            break;

        case "2":
            pos = 'second';
            buildingSubTab === "coin" ? num = 2 : num = 3
            if (currentTab === "buildings") {
                buildingSubTab === "particle" ? buyParticleBuilding(pos, cost[2]) : buyMax(pos, type, num, cost[2], false)
            }
            if (currentTab === "runes") {
                if (runescreen === "runes") {
                    redeemShards(2)
                }
                if (runescreen === "blessings") {
                    buyRuneBonusLevels(1, 2)
                }
                if (runescreen === "spirits") {
                    buyRuneBonusLevels(2, 2)
                }
            }
            if (currentTab === "challenges") {
                toggleChallenges(2)
                challengeDisplay(2);
            }
            break;
        case "3":
            pos = 'third';
            buildingSubTab === "coin" ? num = 3 : num = 6
            if (currentTab === "buildings") {
                buildingSubTab === "particle" ? buyParticleBuilding(pos, cost[3]) : buyMax(pos, type, num, cost[3], false)
            }
            if (currentTab === "runes") {
                if (runescreen === "runes") {
                    redeemShards(3)
                }
                if (runescreen === "blessings") {
                    buyRuneBonusLevels(1, 3)
                }
                if (runescreen === "spirits") {
                    buyRuneBonusLevels(2, 3)
                }
            }
            if (currentTab === "challenges") {
                toggleChallenges(3)
                challengeDisplay(3);
            }
            break;
        case "4":
            pos = 'fourth';
            buildingSubTab === "coin" ? num = 4 : num = 10
            if (currentTab === "buildings") {
                buildingSubTab === "particle" ? buyParticleBuilding(pos, cost[4]) : buyMax(pos, type, num, cost[4], false)
            }
            if (currentTab === "runes") {
                if (runescreen === "runes") {
                    redeemShards(4)
                }
                if (runescreen === "blessings") {
                    buyRuneBonusLevels(1, 4)
                }
                if (runescreen === "spirits") {
                    buyRuneBonusLevels(2, 4)
                }
            }
            if (currentTab === "challenges") {
                toggleChallenges(4)
                challengeDisplay(4);
            }
            break;
        case "5":
            pos = 'fifth';
            buildingSubTab === "coin" ? num = 5 : num = 15
            if (currentTab === "buildings") {
                buildingSubTab === "particle" ? buyParticleBuilding(pos, cost[5]) : buyMax(pos, type, num, cost[5], false)
            }
            if (currentTab === "runes") {
                if (runescreen === "runes") {
                    redeemShards(5)
                }
                if (runescreen === "blessings") {
                    buyRuneBonusLevels(1, 5)
                }
                if (runescreen === "spirits") {
                    buyRuneBonusLevels(2, 5)
                }
            }
            if (currentTab === "challenges") {
                toggleChallenges(5)
                challengeDisplay(5);
            }
            break;
        case "6":
            if (currentTab === "buildings" && buildingSubTab === "diamond") {
                buyCrystalUpgrades(1)
            }
            if (currentTab === "challenges" && player.reincarnationCount > 0) {
                toggleChallenges(6)
                challengeDisplay(6);
            }
            break;
        case "7":
            if (currentTab === "buildings" && buildingSubTab === "diamond") {
                buyCrystalUpgrades(2)
            }
            if (currentTab === "challenges" && player.achievements[113] === 1) {
                toggleChallenges(7)
                challengeDisplay(7);
            }
            break;
        case "8":
            if (currentTab === "buildings" && buildingSubTab === "diamond") {
                buyCrystalUpgrades(3)
            }
            if (currentTab === "challenges" && player.achievements[120] === 1) {
                toggleChallenges(8)
                challengeDisplay(8);
            }
            break;
        case "9":
            if (currentTab === "buildings" && buildingSubTab === "diamond") {
                buyCrystalUpgrades(4)
            }
            if (currentTab === "challenges" && player.achievements[127] === 1) {
                toggleChallenges(9)
                challengeDisplay(9);
            }
            break;
        case "0":
            if (currentTab === "buildings" && buildingSubTab === "diamond") {
                buyCrystalUpgrades(5)
            }
            if (currentTab === "challenges" && player.achievements[134] === 1) {
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
                resetCheck('reincarnationchallenge', null, true)
            }
            if (player.currentChallenge.transcension !== 0) {
                resetCheck('challenge', null, true)
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

window['addEventListener' in window ? 'addEventListener' : 'attachEvent']('load', function () {
    if(location.href.includes('kong')) {
        // kongregate
        const script = document.createElement('script');
        script.setAttribute('src', 'https://cdn1.kongregate.com/javascripts/kongregate_api.js');
        document.head.appendChild(script);
    }

    const ver = document.getElementById('versionnumber');
    ver && (ver.textContent = `You're playing on v${player.version} - The Great Reimagining [Last Update: 02:35 PM UTC-5 Nov 7]`);
    document.title = 'Synergism v' + player.version;

    const dec = LZString.decompressFromBase64(localStorage.getItem('Synergysave2'));
    const isLZString = dec !== '';

    if (isLZString) {
        localStorage.clear();
        localStorage.setItem('Synergysave2', btoa(dec));
        alert('Transferred save to new format successfully!');
    }

    setTimeout(function () {
        loadSynergy();
        saveSynergy();
        toggleauto();
        revealStuff();
        hideStuff();
        htmlInserts();
        // thanks Kewne
        createTimer();
        constantIntervals();
    }, 0);
});