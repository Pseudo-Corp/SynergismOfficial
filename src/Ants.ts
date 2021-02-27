import { player, format, clearInt, interval } from './Synergism';
import { calculateSigmoidExponential, calculateSigmoid, calculateAnts, calculateRuneLevels, calculateMaxRunes, calculateAntSacrificeELO, calculateAntSacrificeRewards } from './Calculate';
import { Globals as G } from './Variables';

import Decimal, { DecimalSource } from 'break_infinity.js';
import { achievementaward } from './Achievements';
import { Confirm, revealStuff } from './UpdateHTML';
import { redeemShards } from './Runes';
import { updateTalismanInventory } from './Talismans';
import { buyResearch } from './Research';
import { resetAnts } from './Reset';
import type { ResetHistoryEntryAntSacrifice } from './History';
import { Synergism } from './Events';

const antdesc: Record<string, string> = {
    antdesc1: "Gain a worker ant for your everyday life. Gathers Galactic Crumbs. Essential!",
    antdesc2: "Gain a breeder ant that produces worker ants automatically!",
    antdesc3: "Gain a meta-breeder ant that produces breeder ants automatically!",
    antdesc4: "Gain a mega-breeder ant that produces meta-breeder ants automatically!",
    antdesc5: "Gain a Queen ant that produces mega-breeder ants automatically!",
    antdesc6: "Gain a Lord Royal ant that produces Queen ants automatically!",
    antdesc7: "Gain an ALMIGHTY ANT that produces Lord Royal ants automatically!",
    antdesc8: "Gain a DISCIPLE OF ANT GOD that produces ALMIGHTY ANTS automatically!"
}

const antspecies: Record<string, string> = {
    antspecies1: "Inceptus Formicidae",
    antspecies2: "Fortunae Formicidae",
    antspecies3: "Tributum Formicidae",
    antspecies4: "Celeritas Formicidae",
    antspecies5: "Multa Formicidae",
    antspecies6: "Sacrificium Formicidae",
    antspecies7: "Hic Formicidae",
    antspecies8: "Experientia Formicidae",
    antspecies9: "Praemoenio Formicidae",
    antspecies10: "Scientia Formicidae",
    antspecies11: "Phylacterium Formicidae",
    antspecies12: "Mortuus Est Formicidae"
}

const antupgdesc: Record<string, string> = {
    antupgdesc1: "Promotes romance and unity within the colony. [+12% Ant Speed / level]",
    antupgdesc2: "Sweetens crumbs to increase their value [Each level increases Crumb --> Coin Conversion efficiency, up to ^50,000,000]",
    antupgdesc3: "Swarms the Taxman into submission [Up to -99% taxes!]",
    antupgdesc4: "Scares you into running faster [up to x20]",
    antupgdesc5: "Imitates your body through magic shape-shifting powers [up to x40]",
    antupgdesc6: "Tries to please Ant God... but fails [Additional Offerings!]",
    antupgdesc7: "Helps you build a few things here and there [+3% Building Cost Delay / level, Cap 9,999,999%]",
    antupgdesc8: "Knows how to salt and pepper food [Up to 1,000x Rune EXP!]",
    antupgdesc9: "Can make your message to Ant God a little more clear [+1 all Rune Levels / level, Cap 10 Million]",
    antupgdesc10: "Has big brain energy [Additional Obtainium!]",
    antupgdesc11: "A valuable offering to the Ant God [Gain up to 3x Sacrifice Rewards!]",
    antupgdesc12: "Betray Ant God increasing the fragility of your dimension [Unlocks ant talisman, Up to 2x faster timers on most things]"
}

export const calculateCrumbToCoinExp = () => {
    const exponent = player.currentChallenge.ascension !== 15
        ? 100000 + calculateSigmoidExponential(49900000, (player.antUpgrades[2-1] + G['bonusant2']) / 5000 * 500 / 499)
        : 1/10000 * (100000 + calculateSigmoidExponential(49900000, (player.antUpgrades[2-1] + G['bonusant2']) / 5000 * 500 / 499));
    
    return exponent
}

const antUpgradeTexts = [
    () => "ALL Ants work at " + format(Decimal.pow(1.12 + 1 / 1000 * player.researches[101], player.antUpgrades[1-1] + G['bonusant1']), 2) + "x speed.",
    () => "Crumb --> Coin exponent is ^" + format(calculateCrumbToCoinExp()),
    () => "Tax growth is multiplied by " + format(0.005 + 0.995 * Math.pow(0.99, player.antUpgrades[3-1] + G['bonusant3']), 4),
    () => "Accelerator Boosts +" + format(100 * (calculateSigmoidExponential(20, (player.antUpgrades[4-1] + G['bonusant4']) / 1000 * 20 / 19) - 1), 3) + "%",
    () => "Multipliers +" + format(100 * (calculateSigmoidExponential(40, (player.antUpgrades[5-1] + G['bonusant5']) / 1000 * 40 / 39) - 1), 3) + "%",
    () => "Offerings x" + format(1 + Math.pow((player.antUpgrades[6-1] + G['bonusant6']) / 50, 0.75), 4),
    () => "Building Costs scale " + format(Math.min(9999999,3 * player.antUpgrades[7-1] + 3 * G['bonusant7']),0,true) + "% slower!",
    () => "Rune EXP is multiplied by " + format(calculateSigmoidExponential(999, 1 / 10000 * Math.pow(player.antUpgrades[8-1] + G['bonusant8'], 1.1)), 3) + "!",
    () => "Each rune has +" + format(1 * Math.min(1e7, (player.antUpgrades[9-1] + G['bonusant9'])),0,true) + " effective levels.",
    () => "Obtainium x" + format(1 + 2 * Math.pow((player.antUpgrades[10-1] + G['bonusant10']) / 50, 0.75), 4),
    () => "Sacrificing is " + format(1 + 2 * (1 - Math.pow(2, -(player.antUpgrades[11-1] + G['bonusant11']) / 125)), 4) + "x as effective",
    () => "Global timer is sped up by a factor of " + format(calculateSigmoid(2, player.antUpgrades[12-1] + G['bonusant12'], 69), 4)
]

let repeatAnt: ReturnType<typeof setTimeout> = null;

export const antRepeat = (i: number) => {
    clearInt(repeatAnt);
    repeatAnt = interval(() => updateAntDescription(i), 50);
}

export const updateAntDescription = (i: number) => {
    const el = document.getElementById("anttierdescription")
    const la = document.getElementById("antprice")
    const ti = document.getElementById("antquantity")
    const me = document.getElementById("generateant")

    let priceType = "Galactic Crumbs"
    let tier = ""
    el.textContent = antdesc["antdesc" + i]

    switch (i) {
        case 1:
            priceType = "Particles";
            tier = "first";
            me.textContent = "Generates " + format(G['antOneProduce'], 5) + " Crumbs/sec";
            break;
        case 2:
            tier = "second";
            me.textContent = "Generates " + format(G['antTwoProduce'], 5) + " Workers/sec";
            break;
        case 3:
            tier = "third";
            me.textContent = "Generates " + format(G['antThreeProduce'], 5) + " Breeders/sec";
            break;
        case 4:
            tier = "fourth";
            me.textContent = "Generates " + format(G['antFourProduce'], 5) + " MetaBreeders/sec";
            break;
        case 5:
            tier = "fifth";
            me.textContent = "Generates " + format(G['antFiveProduce'], 5) + " MegaBreeders/sec";
            break;
        case 6:
            tier = "sixth";
            me.textContent = "Generates " + format(G['antSixProduce'], 5) + " Queens/sec";
            break;
        case 7:
            tier = "seventh";
            me.textContent = "Generates " + format(G['antSevenProduce'], 5) + " Royals/sec";
            break;
        case 8:
            tier = "eighth";
            me.textContent = "Generates " + format(G['antEightProduce'], 5) + " ALMIGHTIES/sec";
            break;
    }
    la.textContent = "Cost: " + format(player[tier + "CostAnts"]) + " " + priceType
    ti.textContent = "Owned: " + format(player[tier + "OwnedAnts"]) + " [+" + format(player[tier + "GeneratedAnts"], 2) + "]"
}

const getAntCost = (originalCost: Decimal, buyTo: number, index: number) => {
    --buyTo

    //Determine how much the cost is for buyTo
    const cost = originalCost
        .times(Decimal.pow(G['antCostGrowth'][index-1], buyTo))
        .add(1 * buyTo);

    return cost;
}

const getAntUpgradeCost = (originalCost: Decimal, buyTo: number, index: number) => {
    --buyTo

    const cost = originalCost.times(Decimal.pow(G['antUpgradeCostIncreases'][index-1], buyTo));
    return cost;
}

type Pos = 'first' | 'second' | 'third' | 'fourth' | 'fifth' | 'sixth' | 'seventh' | 'eighth'

//Note to self: REWRITE THIS SHIT Kevin :3
export const buyAntProducers = (pos: Pos, originalCost: DecimalSource, index: number) => {
    const sacrificeMult = antSacrificePointsToMultiplier(player.antSacrificePoints);
    //This is a fucking cool function. This will buymax ants cus why not

    //Things we need: the position of producers, the costvalues, and input var i
    originalCost = new Decimal(originalCost)
    //Initiate type of resource used
    const tag = index === 1 ? 'reincarnationPoints' : 'antPoints';
    const key = `${pos}OwnedAnts` as const;

    let buyTo = player[key] + 1;
    let cashToBuy = getAntCost(originalCost, buyTo, index);
    while (player[tag].gte(cashToBuy)) {
        // Multiply by 4 until the desired amount. Iterate from there
        buyTo = buyTo * 4;
        cashToBuy = getAntCost(originalCost, buyTo, index);
    }
    let stepdown = Math.floor(buyTo / 8);
    while (stepdown !== 0) {
        if (getAntCost(originalCost, buyTo - stepdown, index).lte(player[tag])) {
            stepdown = Math.floor(stepdown / 2);
        } else {
            buyTo = buyTo - stepdown;
        }
    }

    if (!player.antMax) {
        if (1 + player[key] < buyTo) {
            buyTo = player[key] + 1;
        }
    }
    // go down by 7 steps below the last one able to be bought and spend the cost of 25 up to the one that you started with and stop if coin goes below requirement
    let buyFrom = Math.max(buyTo - 7, player[key] + 1);
    let thisCost = getAntCost(originalCost, buyFrom, index);
    while (buyFrom <= buyTo && player[tag].gte(getAntCost(originalCost, buyFrom, index))) {
        player[tag] = player[tag].sub(thisCost);
        player[key] = buyFrom;
        buyFrom = buyFrom + 1;
        thisCost = getAntCost(originalCost, buyFrom, index);
        player[`${pos}CostAnts` as const] = thisCost;
    }
    if (player.reincarnationPoints.lt(0)) {
        player.reincarnationPoints = new Decimal("0")
    }
    if (player.antPoints.lt(0)) {
        player.antPoints = new Decimal("0")
    }
    calculateAntSacrificeELO();

    const achRequirements = [2, 6, 20, 100, 500, 6666, 77777];
    for (let j = 0; j < achRequirements.length; j++) {
        if (sacrificeMult > achRequirements[j] && player[G['ordinals'][j + 1] + "OwnedAnts"] > 0 && player.achievements[176 + j] === 0) {
            achievementaward(176 + j)
        }
    }

    if(player.firstOwnedAnts > 6.9e7){
        player.firstOwnedAnts = 6.9e7
    }
}

export const buyAntUpgrade = (originalCost: DecimalSource, auto: boolean, index: number) => {
    if (player.currentChallenge.ascension !== 11) {
        originalCost = new Decimal(originalCost);
        let buyTo = 1 + player.antUpgrades[index-1];
        let cashToBuy = getAntUpgradeCost(originalCost, buyTo, index);
        while (player.antPoints.gte(cashToBuy)) {
            // Multiply by 4 until the desired amount. Iterate from there
            buyTo = buyTo * 4;
            cashToBuy = getAntUpgradeCost(originalCost, buyTo, index);
        }
        let stepdown = Math.floor(buyTo / 8);
        while (stepdown !== 0) {
            if (getAntUpgradeCost(originalCost, buyTo - stepdown, index).lte(player.antPoints)) {
                stepdown = Math.floor(stepdown / 2);
            } else {
                buyTo = buyTo - stepdown;
            }
        }
        if (!player.antMax) {
            if (player.antUpgrades[index-1] + 1 < buyTo) {
                buyTo = 1 + player.antUpgrades[index-1]
            }
        }
        // go down by 7 steps below the last one able to be bought and spend the cost of 25 up to the one that you started with and stop if coin goes below requirement
        let buyFrom = Math.max(buyTo - 7, 1 + player.antUpgrades[index-1]);
        let thisCost = getAntUpgradeCost(originalCost, buyFrom, index);
        while (buyFrom <= buyTo && player.antPoints.gte(thisCost)) {
            player.antPoints = player.antPoints.sub(thisCost);
            player.antUpgrades[index-1] = buyFrom;
            buyFrom = buyFrom + 1;
            thisCost = getAntUpgradeCost(originalCost, buyFrom, index);
        }
        calculateAnts();
        calculateRuneLevels();
        calculateAntSacrificeELO();
        if (!auto) {
            antUpgradeDescription(index)
        }
        if (player.antUpgrades[12-1] === 1 && index === 12) {
            revealStuff()
        }
    }
}

export const antUpgradeDescription = (i: number) => {
    const el = document.getElementById("antspecies")
    const al = document.getElementById("antlevelbonus");
    const la = document.getElementById("antupgradedescription")
    const ti = document.getElementById("antupgradecost")
    const me = document.getElementById("antupgradeeffect")

    const content1 = antspecies["antspecies" + i];
    const content2 = antupgdesc["antupgdesc" + i];
    const bonuslevel = G["bonusant" + i];

    const c11 = player.currentChallenge.ascension === 11 ? 999 : 0;

    el.childNodes[0].textContent = content1 + " Level " + format(player.antUpgrades[i-1])
    al.textContent = " [+" + format(Math.min(player.antUpgrades[i-1] + c11, bonuslevel)) + "]"
    la.textContent = content2
    ti.textContent = "Cost: " + format(Decimal.pow(G['antUpgradeCostIncreases'][i-1], player.antUpgrades[i-1] * G['extinctionMultiplier'][player.usedCorruptions[10]]).times(G['antUpgradeBaseCost'][i-1])) + " Galactic Crumbs"
    me.textContent = "CURRENT EFFECT: " + antUpgradeTexts[i - 1]()
}

//function buyAntUpgrade(i,auto) {
//    if(player.antPoints.gte(Decimal.pow(10, G['antUpgradeCostIncreases'][i] * player.antUpgrades[i-1]).times(G['antUpgradeBaseCost'][i]))){
//        player.antPoints = player.antPoints.sub(Decimal.pow(10, G['antUpgradeCostIncreases'][i] * player.antUpgrades[i-1]).times(G['antUpgradeBaseCost'][i]));
//        player.antUpgrades[i-1]++
//        calculateAnts();
//        calculateRuneLevels();
//        calculateAntSacrificeELO();


//        if(!auto){antUpgradeDescription(i)}
//        if(player.antUpgrades[12-1] == 1 && i == 12){revealStuff()}
//    }
//    else{}
//}

export const antSacrificePointsToMultiplier = (points: number) => {
    let multiplier = Math.pow(1 + points / 5000, 2)
    multiplier *= (1 + 0.2 * Math.log(1 + points) / Math.log(10))
    if (player.achievements[174] > 0) {
        multiplier *= (1 + 0.4 * Math.log(1 + points) / Math.log(10))
    }
    return multiplier;
}

export const showSacrifice = () => {
    const sacRewards = calculateAntSacrificeRewards();
    document.getElementById("antSacrificeSummary").style.display = "block"

    document.getElementById("antELO").childNodes[0].textContent = "Your Ant ELO is "
    document.getElementById("ELO").textContent = format(G['antELO'], 2,)
    document.getElementById("effectiveELO").textContent = "[" + format(G['effectiveELO'], 2, false) + " effective]"

    document.getElementById("antSacrificeMultiplier").childNodes[0].textContent = "Ant Multiplier x" + format(antSacrificePointsToMultiplier(player.antSacrificePoints), 3, false) + " --> "
    document.getElementById("SacrificeMultiplier").textContent = "x" + format(antSacrificePointsToMultiplier(player.antSacrificePoints + sacRewards.antSacrificePoints), 3, false)

    document.getElementById("SacrificeUpgradeMultiplier").textContent = format(G['upgradeMultiplier'], 3, true) + "x"
    document.getElementById("SacrificeTimeMultiplier").textContent = format(G['timeMultiplier'], 3, true) + "x"
    document.getElementById("antSacrificeOffering").textContent = "+" + format(sacRewards.offerings)
    document.getElementById("antSacrificeObtainium").textContent = "+" + format(sacRewards.obtainium)
    if (player.challengecompletions[9] > 0) {
        document.getElementById("antSacrificeTalismanShard").textContent = "+" + format(sacRewards.talismanShards) + " [>500 ELO]"
        document.getElementById("antSacrificeCommonFragment").textContent = "+" + format(sacRewards.commonFragments) + " [>750 ELO]"
        document.getElementById("antSacrificeUncommonFragment").textContent = "+" + format(sacRewards.uncommonFragments) + " [>1,000 ELO]"
        document.getElementById("antSacrificeRareFragment").textContent = "+" + format(sacRewards.rareFragments) + " [>1,500 ELO]"
        document.getElementById("antSacrificeEpicFragment").textContent = "+" + format(sacRewards.epicFragments) + " [>2,000 ELO]"
        document.getElementById("antSacrificeLegendaryFragment").textContent = "+" + format(sacRewards.legendaryFragments) + " [>3,000 ELO]"
        document.getElementById("antSacrificeMythicalFragment").textContent = "+" + format(sacRewards.mythicalFragments) + " [>5,000 ELO]"
    }
}

export const sacrificeAnts = async (auto = false) => {
    let p = true

    if (player.antPoints.gte("1e40")) {
        if (!auto && player.antSacrificePoints < 100 && player.toggles[32]) {
            p = await Confirm("This resets your Crumbs, Ants and Ant Upgrades in exchange for some multiplier and resources. Continue?")
        }
        if (p) {
            const antSacrificePointsBefore = player.antSacrificePoints;

            const sacRewards = calculateAntSacrificeRewards();
            player.antSacrificePoints += sacRewards.antSacrificePoints;
            player.runeshards += sacRewards.offerings;
            player.researchPoints += sacRewards.obtainium;

            const historyEntry: ResetHistoryEntryAntSacrifice = {
                date: Date.now(),
                seconds: player.antSacrificeTimer,
                kind: 'antsacrifice',
                offerings: sacRewards.offerings,
                obtainium: sacRewards.obtainium,
                antSacrificePointsBefore: antSacrificePointsBefore,
                antSacrificePointsAfter: player.antSacrificePoints,
                baseELO: G['antELO'],
                effectiveELO: G['effectiveELO'],
                crumbs: player.antPoints.toString(),
                crumbsPerSecond: G['antOneProduce'].toString(),
            };

            if (player.challengecompletions[9] > 0) {
                player.talismanShards += sacRewards.talismanShards;
                player.commonFragments += sacRewards.commonFragments;
                player.uncommonFragments += sacRewards.uncommonFragments;
                player.rareFragments += sacRewards.rareFragments;
                player.epicFragments += sacRewards.epicFragments;
                player.legendaryFragments += sacRewards.legendaryFragments;
                player.mythicalFragments += sacRewards.mythicalFragments;
            }

            // Refer to analogous code in Syngergism.js, function tick().
            if (player.shopUpgrades.offeringAuto > 0.5 && player.autoSacrificeToggle) {
                // Since ants boost rune EXP, we need to auto-spend offerings NOW, before reset, if cube-tier auto-spend is enabled.
                if (player.cubeUpgrades[20] === 1 && player.runeshards >= 5) {
                    let unmaxed = 0;
                    for (let i = 1; i <= 5; i++) {
                        if (player.runelevels[i - 1] < calculateMaxRunes(i))
                            unmaxed++;
                    }
                    if (unmaxed > 0) {
                        const baseAmount = Math.floor(player.runeshards / unmaxed);
                        for (let i = 1; i <= 5; i++) {
                            redeemShards(i, true, baseAmount);
                        }
                        player.sacrificeTimer = 0;
                    }
                }
                // Other cases don't perform a spend-all and are thus safely handled by the standard tick() function.
            }

            // Now we're safe to reset the ants.
            resetAnts();
            player.antSacrificeTimer = 0;
            player.antSacrificeTimerReal = 0;
            updateTalismanInventory();
            if (player.autoResearch > 0 && player.autoResearchToggle) {
                const linGrowth = (player.autoResearch === 200) ? 0.01 : 0;
                buyResearch(player.autoResearch, true, linGrowth)
            }
            calculateAntSacrificeELO();

            Synergism.emit('historyAdd', 'ants', historyEntry);
        }
    }

    if (player.mythicalFragments >= 1e11 && player.currentChallenge.ascension === 14 && player.achievements[248] < 1) {
        achievementaward(248)
    }
}

export const autoBuyAnts = () => {
    const canAffordUpgrade = (x: number, m: DecimalSource) => player.antPoints.gte(getAntUpgradeCost(new Decimal(G['antUpgradeBaseCost'][x-1]), player.antUpgrades[x-1] + 1, x).times(m))
    const ach = [176, 176, 177, 178, 178, 179, 180, 180, 181, 182, 182, 145];
    const cost = ["100", "100", "1000", "1000", "1e5", "1e6", "1e8", "1e11", "1e15", "1e20", "1e40", "1e100"];
    if (player.currentChallenge.ascension !== 11) {
        for (let i = 1; i <= ach.length; i++) {
            const check = i === 12 ? player.researches[ach[i - 1]] : player.achievements[ach[i - 1]];
            if (check && canAffordUpgrade(i, 2)) {
                buyAntUpgrade(cost[i - 1], true, i);
            }
        }
    }

    const _ach = [173, 176, 177, 178, 179, 180, 181, 182];
    const _cost = ["1e800", "3", "100", "10000", "1e12", "1e36", "1e100", "1e300"];
    for (let i = 1; i <= _ach.length; i++) {
        const res = i === 1 ? player.reincarnationPoints : player.antPoints;
        const m = i === 1 ? 1 : 2; // no multiplier on the first ant cost because it costs particles
        if (player.achievements[_ach[i - 1]] && res.gte(player[G['ordinals'][i - 1] + "CostAnts"].times(m))) {
            buyAntProducers(
                G['ordinals'][i - 1] as Parameters<typeof buyAntProducers>[0], 
                _cost[i - 1], i
            );
        }
    }
}