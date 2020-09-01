function checkVariablesOnLoad(data) {
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
        player.prototypeCorruptions = [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        player.usedCorruptions = [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
    if (data.constantUpgrades === undefined) {
        player.ascendShards = new Decimal("0")
        player.constantUpgrades = [null, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
    if (data.roombaResearchIndex === undefined) {
        player.roombaResearchIndex = 0;
    }
    if (data.history === undefined) {
        player.history = {};
        player.cubesThisAscension = {
            "challenges": 0,
            "reincarnation": 0,
            "ascension": 0,
            "maxCubesPerSec": 0,
            "maxAllTime": 0,
            "cpsOnC10Comp": 0,
            "tesseracts": 0,
            "hypercubes": 0
        };
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
}