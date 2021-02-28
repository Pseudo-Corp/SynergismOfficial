import { player, clearInt, interval, format } from './Synergism';
import { calculateOfferings, CalcCorruptionStuff, calculateCubeBlessings, calculateRuneLevels, calculateAnts, calculateObtainium, calculateTalismanEffects, calculateAntSacrificeELO } from './Calculate';
import { resetofferings } from './Runes';
import { updateTalismanInventory, updateTalismanAppearance } from './Talismans';
import { calculateTesseractBlessings } from './Tesseracts';
import { revealStuff } from './UpdateHTML';
import { upgradeupdate } from './Upgrades';
import { Globals as G } from './Variables';
import Decimal from 'break_infinity.js';
import { getElementById } from './Utility';
import { ascensionAchievementCheck } from './Achievements';
import { buyResearch } from './Research';
import { calculateHypercubeBlessings } from './Hypercubes';
import type {
    ResetHistoryEntryPrestige,
    ResetHistoryEntryTranscend,
    ResetHistoryEntryReincarnate,
    ResetHistoryEntryAscend,
} from './History';
import { challengeRequirement } from './Challenges';
import { Synergism } from './Events';
import { resetNames } from './types/Synergism';
import { updateClassList } from './Utility';

let repeatreset: ReturnType<typeof setTimeout>;

export const resetrepeat = (input: resetNames) => {
    clearInt(repeatreset);
    repeatreset = interval(() => resetdetails(input), 50)
}

export const resetdetails = (input: resetNames) => {
    document.getElementById('resetofferings1').style.display = "block"

    const transcensionChallenge = player.currentChallenge.transcension;
    const reincarnationChallenge = player.currentChallenge.reincarnation;

    const offering = calculateOfferings(input);
    const offeringImage = getElementById<HTMLImageElement>("resetofferings1");
    const offeringText = document.getElementById("resetofferings2");
    const currencyImage1 = getElementById<HTMLImageElement>("resetcurrency1");
    const resetObtainiumImage = document.getElementById("resetobtainium");
    const resetObtainiumText = document.getElementById("resetobtainium2");
    const resetInfo = document.getElementById('resetinfo');
    const resetCurrencyGain = document.getElementById("resetcurrency2");

    (input == "reincarnation") ? 
        (resetObtainiumImage.style.display = "block", resetObtainiumText.textContent = format(Math.floor(G['obtainiumGain']))):
        (resetObtainiumImage.style.display = "none", resetObtainiumText.textContent = "");

    (input == "ascensionChallenge" || input == "ascension")?
        offeringImage.style.display = offeringText.style.display = "none":
        offeringImage.style.display = offeringText.style.display = "block";

    switch(input){
        case "prestige":
            if(currencyImage1.src !== "Pictures/Diamond.png"){
                currencyImage1.src = "Pictures/Diamond.png"
            }
            currencyImage1.style.display = "block"
            resetCurrencyGain.textContent = "+" + format(G['prestigePointGain']);
            resetInfo.textContent = "Coins, Coin Producers, Coin Upgrades, and Crystals are reset, but in return you gain diamonds and a few offerings. Required: " + format(player.coinsThisPrestige) + "/1e16 Coins || TIME SPENT: " + format(player.prestigecounter) + " seconds.";
            resetInfo.style.color = "turquoise";
            break;
        case "transcension":
            if(currencyImage1.src !== "Pictures/Mythos.png"){
                currencyImage1.src = "Pictures/Mythos.png"
            }
            currencyImage1.style.display = "block"
            resetCurrencyGain.textContent = "+" + format(G['transcendPointGain']);
            resetInfo.textContent = "Reset all Coin and Diamond Upgrades/Features, Crystal Upgrades & Producers, for Mythos/Offerings. Required: " + format(player.coinsThisTranscension) + "/1e100 Coins || TIME SPENT: " + format(player.transcendcounter) + " seconds.";
            resetInfo.style.color = "orchid";
            break;
        case "reincarnation":
            if(currencyImage1.src !== "Pictures/Particle.png"){
                currencyImage1.src = "Pictures/Particle.png"
            }
            currencyImage1.style.display = "block"
            resetCurrencyGain.textContent = "+" + format(G['reincarnationPointGain']);
            resetInfo.textContent = "Reset ALL previous reset tiers, but gain Particles, Obtainium and Offerings! Required: " + format(player.transcendShards) + "/1e300 Mythos Shards || TIME SPENT: " + format(player.reincarnationcounter) + " seconds.";
            resetInfo.style.color = "limegreen";
            break;
        case "acceleratorBoost":
            if(currencyImage1.src !== "Pictures/Diamond.png") {
                currencyImage1.src = "Pictures/Diamond.png"
            }
            currencyImage1.style.display = "block"
            resetCurrencyGain.textContent = "-" + format(player.acceleratorBoostCost);
            resetInfo.textContent = "Reset Coin Producers/Upgrades, Crystals and Diamonds in order to increase the power of your Accelerators. Required: " + format(player.prestigePoints) + "/" + format(player.acceleratorBoostCost) + " Diamonds.";
            resetInfo.style.color = "cyan";
            break;
        case "transcensionChallenge":
            currencyImage1.style.display = "none"
            resetCurrencyGain.textContent = "";

            (transcensionChallenge !== 0)?
            (resetInfo.style.color = "aquamarine", resetInfo.textContent = "Are you tired of being in your challenge or stuck? Click to leave challenge " + transcensionChallenge + ". Progress: " + format(player.coinsThisTranscension) + "/" + format(challengeRequirement(transcensionChallenge, player.challengecompletions[transcensionChallenge])) + " Coins. TIME SPENT: " + format(player.transcendcounter) + " seconds."):
            (resetInfo.style.color = "crimson", resetInfo.textContent = "You're not in a Transcension Challenge right now. Get in one before you can leave it, duh!");
            break;
        case "reincarnationChallenge":
            currencyImage1.style.display = "none"
            resetCurrencyGain.textContent = "";

            if (reincarnationChallenge !== 0) {
                const goal = reincarnationChallenge >= 9 ? "coins" : "transcendShards";
                const goaldesc = reincarnationChallenge >= 9 ? " Coins" : " Mythos Shards";

                resetInfo.style.color = "silver";
                resetInfo.textContent = "Are you done or tired of being in your challenge? Click to leave challenge " + reincarnationChallenge + ". Progress: " + format(player[goal]) + "/" + format(challengeRequirement(reincarnationChallenge, player.challengecompletions[reincarnationChallenge], reincarnationChallenge)) + goaldesc + ". TIME SPENT: " + format(player.reincarnationcounter) + " Seconds.";
            } else {
                resetInfo.style.color = "crimson";
                resetInfo.textContent = "You're not in a Reincarnation Challenge right now. How could you leave what you are not in?";
            }
            break;
        case "ascensionChallenge":
            currencyImage1.style.display = "none"
            resetCurrencyGain.textContent = "";
            resetInfo.textContent = "Click this if you're in an Ascension Challenge and want to leave. You get it already!";
            resetInfo.style.color = "gold";
            break;
        case "ascension":
            currencyImage1.style.display = "none"
            resetCurrencyGain.textContent = "";
            resetInfo.textContent = "Ascend. 10x1 is required! +" + format(CalcCorruptionStuff()[4], 0, true) + " Wow! Cubes for doing it! Time: " + format(player.ascensionCounter, 0, false) + " Seconds.";
            resetInfo.style.color = "gold";
            break;
    }
    document.getElementById("resetofferings2").textContent = "+" + format(offering)
}

export const updateAutoReset = (i: number) => {
    if (i === 1) {
        const t = +getElementById<HTMLInputElement>("prestigeamount").value;
        if (t >= 0) {
            player.prestigeamount = t;
        } else {
            player.prestigeamount = 0;
        }
    } else if (i === 2) {
        const u = +getElementById<HTMLInputElement>("transcendamount").value;
        if (u >= 0) {
            player.transcendamount = u;
        } else {
            player.transcendamount = 0;
        }
    } else if (i === 3) {
        const v = +getElementById<HTMLInputElement>("reincarnationamount").value
        if (v >= 0) {
            player.reincarnationamount = v;
        } else {
            player.reincarnationamount = 0;
        }
    } else if (i === 4) {
        let v = parseFloat(getElementById<HTMLInputElement>("ascensionAmount").value);
        v = Math.floor(v)
        if (v >= 1) {
            player.autoAscendThreshold = v
        } else {
            player.autoAscendThreshold = 1;
        }
    } else if (i === 5) {
        const v = parseFloat(getElementById<HTMLInputElement>("autoAntSacrificeAmount").value);
        player.autoAntSacTimer = Math.max(0, v);
    }
}

export const updateTesseractAutoBuyAmount = () => {
    let v = parseFloat(getElementById<HTMLInputElement>("tesseractAmount").value);
    v = Math.floor(v)
    if (v >= 0) {
        player.tesseractAutoBuyerAmount = v
    } else {
        player.tesseractAutoBuyerAmount = 0;
    }
}

const resetAddHistoryEntry = (input: resetNames, from = 'unknown') => {
    const offeringsGiven = calculateOfferings(input);
    const isChallenge = ["enterChallenge", "leaveChallenge"].includes(from);

    if (input === "prestige") {
        const historyEntry: ResetHistoryEntryPrestige = {
            seconds: player.prestigecounter,
            date: Date.now(),
            offerings: offeringsGiven,
            kind: "prestige",
            diamonds: G['prestigePointGain'].toString(),
        }

        Synergism.emit('historyAdd', 'reset', historyEntry);
    } else if (input === "transcension" || input === "transcensionChallenge") {
        // Heuristics: transcend entries are not added when entering or leaving a challenge,
        // unless a meaningful gain in particles was made. This prevents spam when using the challenge automator.
        const historyEntry: ResetHistoryEntryTranscend = {
            seconds: player.transcendcounter,
            date: Date.now(),
            offerings: offeringsGiven,
            kind: "transcend",
            mythos: G['transcendPointGain'].toString(),
        }

        Synergism.emit('historyAdd', 'reset', historyEntry);
    } else if (input === "reincarnation" || input === "reincarnationChallenge") {
        // Heuristics: reincarnate entries are not added when entering or leaving a challenge,
        // unless a meaningful gain in particles was made. This prevents spam when using the challenge automator.
        if (!isChallenge || G['reincarnationPointGain'].gte(player.reincarnationPoints.div(10))) {
            const historyEntry: ResetHistoryEntryReincarnate = {
                seconds: player.reincarnationcounter,
                date: Date.now(),
                offerings: offeringsGiven,
                kind: "reincarnate",
                particles: G['reincarnationPointGain'].toString(),
                obtainium: G['obtainiumGain'],
            }

            Synergism.emit('historyAdd', 'reset', historyEntry);
        }
    } else if (input === "ascension" || input === "ascensionChallenge") {
        // Ascension entries will only be logged if C10 was completed.
        if (player.challengecompletions[10] > 0) {
            const corruptionMetaData = CalcCorruptionStuff();
            const historyEntry: ResetHistoryEntryAscend = {
                seconds: player.ascensionCounter,
                date: Date.now(),
                c10Completions: player.challengecompletions[10],
                usedCorruptions: player.usedCorruptions.slice(0), // shallow copy,
                corruptionScore: corruptionMetaData[3],
                wowCubes: corruptionMetaData[4],
                wowTesseracts: corruptionMetaData[5],
                wowHypercubes: corruptionMetaData[6],
                wowPlatonicCubes: corruptionMetaData[7],
                kind: "ascend",
            }

            // If we are _leaving_ an ascension challenge, log that too.
            if (from !== "enterChallenge" && player.currentChallenge.ascension !== 0) {
                historyEntry.currentChallenge = player.currentChallenge.ascension;
            }

            Synergism.emit('historyAdd', 'ascend', historyEntry);
        }
    }
};

export const reset = (input: resetNames, fast = false, from = 'unknown') => {
    // Handle adding history entries before actually resetting data, to ensure optimal accuracy.
    resetAddHistoryEntry(input, from);

    resetofferings(input)
    resetUpgrades(1);
    player.coins = new Decimal("102");
    player.coinsThisPrestige = new Decimal("100");
    player.firstOwnedCoin = 0;
    player.firstGeneratedCoin = new Decimal("0");
    player.firstCostCoin = new Decimal("100");
    player.secondOwnedCoin = 0;
    player.secondGeneratedCoin = new Decimal("0");
    player.secondCostCoin = new Decimal("2e3");
    player.thirdOwnedCoin = 0;
    player.thirdGeneratedCoin = new Decimal("0");
    player.thirdCostCoin = new Decimal("4e4");
    player.fourthOwnedCoin = 0;
    player.fourthGeneratedCoin = new Decimal("0");
    player.fourthCostCoin = new Decimal("8e5");
    player.fifthOwnedCoin = 0;
    player.fifthGeneratedCoin = new Decimal("0");
    player.fifthCostCoin = new Decimal("1.6e7");
    player.firstGeneratedDiamonds = new Decimal("0");
    player.secondGeneratedDiamonds = new Decimal("0");
    player.thirdGeneratedDiamonds = new Decimal("0");
    player.fourthGeneratedDiamonds = new Decimal("0");
    player.fifthGeneratedDiamonds = new Decimal("0");
    player.multiplierCost = new Decimal("1e5");
    player.multiplierBought = 0;
    player.acceleratorCost = new Decimal("500");
    player.acceleratorBought = 0;

    player.prestigeCount += 1;

    player.prestigePoints = player.prestigePoints.add(G['prestigePointGain']);
    player.prestigeShards = new Decimal("0");
    player.prestigenoaccelerator = true;
    player.prestigenomultiplier = true;
    player.prestigenocoinupgrades = true;

    player.unlocks.prestige = true;

    if (player.prestigecounter < player.fastestprestige) {
        player.fastestprestige = player.prestigecounter;
    }

    G['prestigePointGain'] = new Decimal('0');

    player.prestigecounter = 0;
    G['autoResetTimers'].prestige = 0;

    const types = ['transcension', 'transcensionChallenge', 'reincarnation', 'reincarnationChallenge', 'ascension', 'ascensionChallenge'];
    if (types.includes(input)) {
        resetUpgrades(2);
        player.coinsThisTranscension = new Decimal("100");
        player.firstOwnedDiamonds = 0;
        player.firstCostDiamonds = new Decimal("100");
        player.secondOwnedDiamonds = 0;
        player.secondCostDiamonds = new Decimal("1e5");
        player.thirdOwnedDiamonds = 0;
        player.thirdCostDiamonds = new Decimal("1e15");
        player.fourthOwnedDiamonds = 0;
        player.fourthCostDiamonds = new Decimal("1e40");
        player.fifthOwnedDiamonds = 0;
        player.fifthCostDiamonds = new Decimal("1e100");
        player.firstGeneratedMythos = new Decimal("0");
        player.secondGeneratedMythos = new Decimal("0");
        player.thirdGeneratedMythos = new Decimal("0");
        player.fourthGeneratedMythos = new Decimal("0");
        player.fifthGeneratedMythos = new Decimal("0");
        player.acceleratorBoostBought = 0;
        player.acceleratorBoostCost = new Decimal("1e3");

        player.transcendCount += 1;

        player.prestigePoints = new Decimal("0");
        player.transcendPoints = player.transcendPoints.add(G['transcendPointGain']);
        player.transcendShards = new Decimal("0");
        player.transcendnocoinupgrades = true;
        player.transcendnocoinorprestigeupgrades = true;
        player.transcendnoaccelerator = true;
        player.transcendnomultiplier = true;

        G['transcendPointGain'] = new Decimal('0')

        if (player.achievements[78] > 0.5) {
            player.firstOwnedDiamonds += 1
        }
        if (player.achievements[85] > 0.5) {
            player.secondOwnedDiamonds += 1
        }
        if (player.achievements[92] > 0.5) {
            player.thirdOwnedDiamonds += 1
        }
        if (player.achievements[99] > 0.5) {
            player.fourthOwnedDiamonds += 1
        }
        if (player.achievements[106] > 0.5) {
            player.fifthOwnedDiamonds += 1
        }

        if (player.achievements[4] > 0.5) {
            player.upgrades[81] = 1
        }
        if (player.achievements[11] > 0.5) {
            player.upgrades[82] = 1
        }
        if (player.achievements[18] > 0.5) {
            player.upgrades[83] = 1
        }
        if (player.achievements[25] > 0.5) {
            player.upgrades[84] = 1
        }
        if (player.achievements[32] > 0.5) {
            player.upgrades[85] = 1
        }
        if (player.achievements[80] > 0.5) {
            player.upgrades[87] = 1
        }

        if (player.transcendcounter < player.fastesttranscend && player.currentChallenge.transcension === 0) {
            player.fastesttranscend = player.transcendcounter;
        }

        player.transcendcounter = 0;
        G['autoResetTimers'].transcension = 0;
    }


    if (input === 'reincarnation' || input === 'reincarnationChallenge' || input === 'ascension' || input === 'ascensionChallenge') {
        // Fail safe if for some reason ascension achievement isn't awarded. hacky solution but am too tired to fix right now
        if (player.ascensionCount > 0 && player.achievements[183] < 1) {
            ascensionAchievementCheck(1);
        }

        player.researchPoints += Math.floor(G['obtainiumGain']);

        const opscheck = G['obtainiumGain'] / (1 + player.reincarnationcounter)
        if (opscheck > player.obtainiumpersecond) {
            player.obtainiumpersecond = opscheck
        }
        player.currentChallenge.transcension = 0;
        resetUpgrades(3);
        player.coinsThisReincarnation = new Decimal("100");
        player.firstOwnedMythos = 0;
        player.firstCostMythos = new Decimal("1");
        player.secondOwnedMythos = 0;
        player.secondCostMythos = new Decimal("1e2");
        player.thirdOwnedMythos = 0;
        player.thirdCostMythos = new Decimal("1e4");
        player.fourthOwnedMythos = 0;
        player.fourthCostMythos = new Decimal("1e8");
        player.fifthOwnedMythos = 0;
        player.fifthCostMythos = new Decimal("1e16");
        player.firstGeneratedParticles = new Decimal("0");
        player.secondGeneratedParticles = new Decimal("0");
        player.thirdGeneratedParticles = new Decimal("0");
        player.fourthGeneratedParticles = new Decimal("0");
        player.fifthGeneratedParticles = new Decimal("0");

        player.reincarnationCount += 1;

        player.transcendPoints = new Decimal("0");
        player.reincarnationPoints = player.reincarnationPoints.add(G['reincarnationPointGain']);
        if (player.usedCorruptions[6] > 10 && player.platonicUpgrades[11] > 0) {
            player.prestigePoints = player.prestigePoints.add(G['reincarnationPointGain'])
        }
        player.reincarnationShards = new Decimal("0");
        player.challengecompletions[1] = 0;
        player.challengecompletions[2] = 0;
        player.challengecompletions[3] = 0;
        player.challengecompletions[4] = 0;
        player.challengecompletions[5] = 0;

        G['reincarnationPointGain'] = new Decimal('0');

        if (player.shopUpgrades.instantChallenge > 0 && player.currentChallenge.reincarnation === 0) {
            player.challengecompletions[1] = player.highestchallengecompletions[1]
            player.challengecompletions[2] = player.highestchallengecompletions[2]
            player.challengecompletions[3] = player.highestchallengecompletions[3]
            player.challengecompletions[4] = player.highestchallengecompletions[4]
            player.challengecompletions[5] = player.highestchallengecompletions[5]

        }

        player.reincarnatenocoinupgrades = true;
        player.reincarnatenocoinorprestigeupgrades = true;
        player.reincarnatenocoinprestigeortranscendupgrades = true;
        player.reincarnatenocoinprestigetranscendorgeneratorupgrades = true;
        player.reincarnatenoaccelerator = true;
        player.reincarnatenomultiplier = true;

        if (player.reincarnationcounter < player.fastestreincarnate && player.currentChallenge.reincarnation === 0) {
            player.fastestreincarnate = player.reincarnationcounter;
        }

        calculateCubeBlessings();
        player.reincarnationcounter = 0;
        G['autoResetTimers'].reincarnation = 0;

        if (player.autoResearchToggle && player.autoResearch > 0.5) {
            const linGrowth = (player.autoResearch === 200) ? 0.01 : 0;
            buyResearch(player.autoResearch, true, linGrowth)
        }

        calculateRuneLevels();
        calculateAnts();
    }

    if (input === 'ascension' || input === 'ascensionChallenge') {
        const metaData = CalcCorruptionStuff()
        ascensionAchievementCheck(3, metaData[3])
        // reset auto challenges
        player.currentChallenge.transcension = 0;
        player.currentChallenge.reincarnation = 0;
        player.autoChallengeIndex = 1;
        G['autoChallengeTimerIncrement'] = 0;
        //reset rest
        resetResearches();
        resetAnts();
        resetTalismans();
        player.reincarnationPoints = new Decimal("0");
        player.reincarnationShards = new Decimal("0");
        player.obtainiumpersecond = 0;
        player.maxobtainiumpersecond = 0;
        player.offeringpersecond = 0;
        player.antSacrificePoints = 0;
        player.antSacrificeTimer = 0;
        player.antSacrificeTimerReal = 0;
        player.antUpgrades[12-1] = 0;
        for (let j = 61; j <= 80; j++) {
            player.upgrades[j] = 0;
        }
        for (let j = 94; j <= 100; j++) {
            player.upgrades[j] = 0;
        }
        player.firstOwnedParticles = 0;
        player.secondOwnedParticles = 0;
        player.thirdOwnedParticles = 0;
        player.fourthOwnedParticles = 0;
        player.fifthOwnedParticles = 0;
        player.firstCostParticles = new Decimal("1");
        player.secondCostParticles = new Decimal("100");
        player.thirdCostParticles = new Decimal("1e4");
        player.fourthCostParticles = new Decimal("1e8");
        player.fifthCostParticles = new Decimal("1e16");
        player.runeexp = [0, 0, 0, 0, 0];
        player.runelevels = [0, 0, 0, 0, 0];
        player.runeshards = 0;
        player.crystalUpgrades = [0, 0, 0, 0, 0, 0, 0, 0];

        player.runelevels[0] = 3 * player.cubeUpgrades[26];
        player.runelevels[1] = 3 * player.cubeUpgrades[26];
        player.runelevels[2] = 3 * player.cubeUpgrades[26];
        player.runelevels[3] = 3 * player.cubeUpgrades[26];
        player.runelevels[4] = 3 * player.cubeUpgrades[26];

        if (player.cubeUpgrades[27] === 1) {
            player.firstOwnedParticles = 1;
            player.secondOwnedParticles = 1;
            player.thirdOwnedParticles = 1;
            player.fourthOwnedParticles = 1;
            player.fifthOwnedParticles = 1;
        }

        if (player.cubeUpgrades[48] > 0) {
            player.firstOwnedAnts += 1
        }
        if (player.challengecompletions[10] > 0) {
            let ascCount = 1
            if (player.ascensionCounter >= 10) {
                if (player.achievements[188] > 0) {
                    ascCount += 99
                }
                ascCount *= 1 + (Math.min(24 * 3600, player.ascensionCounter) / 10 - 1 ) * 0.2 * (player.achievements[189] + player.achievements[202] + player.achievements[209] + player.achievements[216] + player.achievements[223])
            }
            if (player.achievements[187] > 0 && metaData[3] > 1e8) {
                ascCount *= (Math.log(metaData[3]) / Math.log(10) - 1)
            }
            ascCount *= G['challenge15Rewards'].ascensions
            ascCount = Math.floor(ascCount)
            player.ascensionCount += ascCount;
            player.wowCubes += metaData[4]; //Metadata is defined up in the top of the (i > 3.5) case
            player.wowTesseracts += metaData[5];
            player.wowHypercubes += metaData[6];
            player.wowPlatonicCubes += metaData[7];
        }

        for (let j = 1; j <= 10; j++) {
            player.challengecompletions[j] = 0;
            player.highestchallengecompletions[j] = 0;
        }

        player.challengecompletions[6] = player.highestchallengecompletions[6] = player.cubeUpgrades[49]
        player.challengecompletions[7] = player.highestchallengecompletions[7] = player.cubeUpgrades[49]
        player.challengecompletions[8] = player.highestchallengecompletions[8] = player.cubeUpgrades[49]

        document.getElementById(`res${player.autoResearch || 1}`).classList.remove("researchRoomba");
        player.roombaResearchIndex = 0;
        player.autoResearch = 1;

        for (let j = 1; j <= (200); j++) {
            const k = `res${j}`;
            if (player.researches[j] > 0.5 && player.researches[j] < G['researchMaxLevels'][j]) {
                updateClassList(k, ["researchPurchased"], ["researchAvailable", "researchMaxed", "researchPurchasedAvailable", "researchUnpurchased"])
            } else if (player.researches[j] > 0.5 && player.researches[j] >= G['researchMaxLevels'][j]) {
                updateClassList(k, ["researchMaxed"], ["researchAvailable", "researchPurchased", "researchPurchasedAvailable", "researchUnpurchased"])
            } else {
                updateClassList(k, ["researchUnpurchased"], ["researchAvailable", "researchPurchased", "researchPurchasedAvailable", "researchMaxed"])
            }
        }

        calculateAnts();
        calculateRuneLevels();
        calculateAntSacrificeELO();
        calculateTalismanEffects();
        calculateObtainium();
        ascensionAchievementCheck(1);
        
        player.ascensionCounter = 0;

        updateTalismanInventory();
        updateTalismanAppearance(1);
        updateTalismanAppearance(2);
        updateTalismanAppearance(3);
        updateTalismanAppearance(4);
        updateTalismanAppearance(5);
        updateTalismanAppearance(6);
        updateTalismanAppearance(7);
        calculateCubeBlessings();
        calculateTesseractBlessings();
        calculateHypercubeBlessings();

        if (player.cubeUpgrades[4] === 1) {
            player.upgrades[94] = 1;
            player.upgrades[95] = 1;
            player.upgrades[96] = 1;
            player.upgrades[97] = 1;
            player.upgrades[98] = 1;
        }
        if (player.cubeUpgrades[5] === 1) {
            player.upgrades[99] = 1;
        }
        if (player.cubeUpgrades[6] === 1) {
            player.upgrades[100] = 1
        }

        for (let j = 61; j <= 80; j++) {
            document.getElementById("upg" + j).style.backgroundColor = "black"
        }
        for (let j = 94; j <= 100; j++) {
            if (player.upgrades[j] === 0) {
                document.getElementById("upg" + j).style.backgroundColor = "black"
            }
        }
        player.usedCorruptions = Array.from(player.prototypeCorruptions)
    }

    //Always unlocks
    player.unlocks.prestige = true
    
    if (input == "transcension" || input == "transcensionChallenge") {
        player.unlocks.transcend = true
    }
    if (input == "reincarnation" || input == "reincarnationChallenge") {
        player.unlocks.reincarnate = true
    }
    if (!fast) {
        revealStuff();
    }
}

const resetUpgrades = (i: number) => {
    if (i > 2.5) {
        for (let i = 41; i < 61; i++) {
            if (i !== 46) {
                player.upgrades[i] = 0;
            }
        }

        if (player.researches[41] === 0) {
            player.upgrades[46] = 0;
        }

        if (player.researches[41] < 0.5) {
            player.upgrades[88] = 0;
        }
        if (player.achievements[50] === 0) {
            player.upgrades[89] = 0;
        }
        if (player.researches[42] < 0.5) {
            player.upgrades[90] = 0;
        }
        if (player.researches[43] < 0.5) {
            player.upgrades[91] = 0;
        }
        if (player.researches[44] < 0.5) {
            player.upgrades[92] = 0;
        }
        if (player.researches[45] < 0.5) {
            player.upgrades[93] = 0;
        }

        player.upgrades[116] = 0;
        player.upgrades[117] = 0;
        player.upgrades[118] = 0;
        player.upgrades[119] = 0;
        player.upgrades[120] = 0;
    }

    for (let j = 1; j <= 20; j++) {
        player.upgrades[j] = 0;
    }

    // both indices go up by 5, so we can put them together!
    for (let j = 121, k = 106; j <= 125; j++, k++) {
        player.upgrades[j] = 0;
        player.upgrades[k] = 0;
    }

    if (i > 1.5) {
        if (player.achievements[4] < 0.5) {
            player.upgrades[81] = 0;
        }
        if (player.achievements[11] < 0.5) {
            player.upgrades[82] = 0;
        }
        if (player.achievements[18] < 0.5) {
            player.upgrades[83] = 0;
        }
        if (player.achievements[25] < 0.5) {
            player.upgrades[84] = 0;
        }
        if (player.achievements[32] < 0.5) {
            player.upgrades[85] = 0;
        }
        if (player.achievements[87] < 0.5) {
            player.upgrades[86] = 0;
        }
        if (player.achievements[80] < 0.5) {
            player.upgrades[87] = 0;
        }


        player.upgrades[101] = 0;
        player.upgrades[102] = 0;
        player.upgrades[103] = 0;
        player.upgrades[104] = 0;
        player.upgrades[105] = 0;


    }

    if (i > 1.5) {
        for (let k = 21; k < 41; k++) {
            player.upgrades[k] = 0;
        }

        player.upgrades[111] = 0;
        player.upgrades[112] = 0;
        player.upgrades[113] = 0;
        player.upgrades[114] = 0;
        player.upgrades[115] = 0;
    }

    if (i > 1.5) {
        player.crystalUpgrades = [0, 0, 0, 0, 0, 0, 0, 0]
        player.crystalUpgradesCost = [7, 15, 20, 40, 100, 200, 500, 1000]

        let m = 0;
        m += Math.floor(G['rune3level'] * G['effectiveLevelMult'] / 16) * 100 / 100
        if (player.upgrades[73] > 0.5 && player.currentChallenge.reincarnation !== 0) {
            m += 10
        }
        player.crystalUpgrades = [m, m, m, m, m, m, m, m]
    }

    for (let x = 1; x <= 125; x++) {
        upgradeupdate(x, true)
    }
    if (player.achievements[87] > 0.5) {
        player.upgrades[86] = 1
    }
}

export const resetAnts = () => {
    player.firstOwnedAnts = 0;
    if (player.cubeUpgrades[48] > 0) {
        player.firstOwnedAnts = 1
    }

    player.secondOwnedAnts = 0;
    player.thirdOwnedAnts = 0;
    player.fourthOwnedAnts = 0;
    player.fifthOwnedAnts = 0;
    player.sixthOwnedAnts = 0;
    player.seventhOwnedAnts = 0;
    player.eighthOwnedAnts = 0;

    player.firstGeneratedAnts = new Decimal("0");
    player.secondGeneratedAnts = new Decimal("0");
    player.thirdGeneratedAnts = new Decimal("0");
    player.fourthGeneratedAnts = new Decimal("0");
    player.fifthGeneratedAnts = new Decimal("0");
    player.sixthGeneratedAnts = new Decimal("0");
    player.seventhGeneratedAnts = new Decimal("0");
    player.eighthGeneratedAnts = new Decimal("0");

    player.firstCostAnts = new Decimal("1e800");
    player.secondCostAnts = new Decimal("3");
    player.thirdCostAnts = new Decimal("100");
    player.fourthCostAnts = new Decimal("1e4");
    player.fifthCostAnts = new Decimal("1e12");
    player.sixthCostAnts = new Decimal("1e36");
    player.seventhCostAnts = new Decimal("1e100");
    player.eighthCostAnts = new Decimal("1e300");

    const ant12 = player.antUpgrades[12-1];
    player.antUpgrades = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ant12];
    player.antPoints = new Decimal("1");

    if (player.currentChallenge.ascension === 12) {
        player.antPoints = new Decimal("7")
    }

    calculateAnts();
    calculateRuneLevels();
}

const resetResearches = () => {
    player.researchPoints = 0;
    //Array listing all the research indexes deserving of removal
    const destroy = [
        6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 21, 22, 23, 24, 25,
        26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
        51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 62, 63, 64, 65, 66, 67, 68, 69, 70,
        76, 81, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 96, 97, 98,
        101, 102, 103, 104, 106, 107, 108, 109, 110, 116, 117, 118, 121, 122, 123,
        126, 127, 128, 129, 131, 132, 133, 134, 136, 137, 138, 139, 141, 142, 143, 144, 146, 147, 148, 149,
        151, 152, 153, 154, 156, 157, 158, 159, 161, 162, 163, 164, 166, 167, 168, 169, 171, 172, 173, 174,
        176, 177, 178, 179, 181, 182, 183, 184, 186, 187, 188, 189, 191, 192, 193, 194, 196, 197, 198, 199
    ];

    for (const item of destroy) {
        player.researches[item] = 0;
    }
}

const resetTalismans = () => {
    player.talismanLevels = [0, 0, 0, 0, 0, 0, 0];
    player.talismanRarity = [1, 1, 1, 1, 1, 1, 1];

    player.talismanShards = 0;
    player.commonFragments = 0;
    player.uncommonFragments = 0;
    player.rareFragments = 0;
    player.epicFragments = 0;
    player.legendaryFragments = 0;
    player.mythicalFragments = 0;
}
