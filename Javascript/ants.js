let antdesc = {
    antdesc1: "Gain a worker ant for your everyday life. Gathers Galactic Crumbs. Essential!",
    antdesc2: "Gain a breeder ant that produces worker ants automatically!",
    antdesc3: "Gain a meta-breeder ant that produces breeder ants automatically!",
    antdesc4: "Gain a mega-breeder ant that produces meta-breeder ants automatically!",
    antdesc5: "Gain a Queen ant that produces mega-breeder ants automatically!",
    antdesc6: "Gain a Lord Royal ant that produces Queen ants automatically!",
    antdesc7: "Gain an ALMIGHTY ANT that produces Lord Royal ants automatically!",
    antdesc8: "Gain a DISCIPLE OF ANT GOD that produces ALMIGHTY ANTS automatically!"
}

let antspecies = {
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

let antupgdesc = {
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

const antUpgradeTexts = [null,
    () => "ALL Ants work at " + format(Decimal.pow(1.12 + 1 / 1000 * player.researches[101], player.antUpgrades[1] + bonusant1), 2) + "x speed.",
    () => "Crumb --> Coin exponent is ^" + format(100000 + calculateSigmoidExponential(49900000, (player.antUpgrades[2] + bonusant2) / 5000 * 500 / 499)),
    () => "Tax growth is multiplied by " + format(0.005 + 0.995 * Math.pow(0.99, player.antUpgrades[3] + bonusant3), 4),
    () => "Accelerator Boosts +" + format(100 * (calculateSigmoidExponential(20, (player.antUpgrades[4] + bonusant4) / 1000 * 20 / 19) - 1), 3) + "%",
    () => "Multipliers +" + format(100 * (calculateSigmoidExponential(40, (player.antUpgrades[5] + bonusant5) / 1000 * 40 / 39) - 1), 3) + "%",
    () => "Offerings x" + format(1 + Math.pow((player.antUpgrades[6] + bonusant6) / 50, 0.75), 4),
    () => "Building Costs scale " + format(Math.min(9999999,3 * player.antUpgrades[7] + 3 * bonusant7),0,true) + "% slower!",
    () => "Rune EXP is multiplied by " + format(calculateSigmoidExponential(999, 1 / 10000 * Math.pow(player.antUpgrades[8] + bonusant8, 1.1)), 3) + "!",
    () => "Each rune has +" + format(1 * Math.min(1e7, (player.antUpgrades[9] + bonusant9)),0,true) + " effective levels.",
    () => "Obtainium x" + format(1 + 2 * Math.pow((player.antUpgrades[10] + bonusant10) / 50, 0.75), 4),
    () => "Sacrificing is " + format(1 + 2 * (1 - Math.pow(2, -(player.antUpgrades[11] + bonusant11) / 125)), 4) + "x as effective",
    () => "Global timer is sped up by a factor of " + format(calculateSigmoid(2, player.antUpgrades[12] + bonusant12, 69), 4)
]


var repeatAnt

function antRepeat(i) {
    clearInt(repeatAnt);
    repeatAnt = interval(updateAntDescription, 50, i)
}

function updateAntDescription(i) {
    let el = document.getElementById("anttierdescription")
    let la = document.getElementById("antprice")
    let ti = document.getElementById("antquantity")
    let me = document.getElementById("generateant")

    let priceType = "Galactic Crumbs"
    let tier = ""
    el.textContent = antdesc["antdesc" + i]

    switch (i) {
        case 1:
            priceType = "Particles";
            tier = "first";
            me.textContent = "Generates " + format(antOneProduce, 5) + " Crumbs/sec";
            break;
        case 2:
            tier = "second";
            me.textContent = "Generates " + format(antTwoProduce, 5) + " Workers/sec";
            break;
        case 3:
            tier = "third";
            me.textContent = "Generates " + format(antThreeProduce, 5) + " Breeders/sec";
            break;
        case 4:
            tier = "fourth";
            me.textContent = "Generates " + format(antFourProduce, 5) + " MetaBreeders/sec";
            break;
        case 5:
            tier = "fifth";
            me.textContent = "Generates " + format(antFiveProduce, 5) + " MegaBreeders/sec";
            break;
        case 6:
            tier = "sixth";
            me.textContent = "Generates " + format(antSixProduce, 5) + " Queens/sec";
            break;
        case 7:
            tier = "seventh";
            me.textContent = "Generates " + format(antSevenProduce, 5) + " Royals/sec";
            break;
        case 8:
            tier = "eighth";
            me.textContent = "Generates " + format(antEightProduce, 5) + " ALMIGHTIES/sec";
            break;
    }
    la.textContent = "Cost: " + format(player[tier + "CostAnts"]) + " " + priceType
    ti.textContent = "Owned: " + format(player[tier + "OwnedAnts"]) + " [+" + format(player[tier + "GeneratedAnts"], 2) + "]"
}

function buyAnts(i) {
    let sacrificeMult = antSacrificePointsToMultiplier(player.antSacrificePoints);
    let type = "ant"
    if (i === 1) {
        type = "reincarnation";
    }
    let tier = ordinals[i - 1] // i is 1-based, ordinals is 0-based
    let amountBuy = 1;
    while (player[type + "Points"].greaterThanOrEqualTo(player[tier + "CostAnts"]) && ticker < amountBuy) {
        player[type + "Points"] = player[type + "Points"].sub(player[tier + "CostAnts"]);
        player[tier + "CostAnts"] = player[tier + "CostAnts"].times(antCostGrowth[i]);
        player[tier + "OwnedAnts"]++
        ticker++
    }
    ticker = 0;
    calculateAntSacrificeELO();

    let achRequirements = [2, 6, 20, 100, 500, 6666, 77777]
    for (let j = 0; j < 7; j++) {
        if (sacrificeMult > achRequirements[j] && player[ordinals[j + 1] + "OwnedAnts"] > 0 && player.achievements[176 + j] === 0) {
            achievementaward(176 + j)
        }
    }
}


function getAntCost(originalCost, buyTo, type, index) {
    --buyTo

    //Determine how much the cost is for buyTo
    let cost = originalCost.times(Decimal.pow(antCostGrowth[index], buyTo));
    cost.add(1 * buyTo)

    return cost;


}

//Note to self: REWRITE THIS SHIT PLATONIC
function buyAntProducers(pos, type, originalCost, index) {
    let sacrificeMult = antSacrificePointsToMultiplier(player.antSacrificePoints);
    //This is a fucking cool function. This will buymax ants cus why not

    //Things we need: the position of producers, the costvalues, and input var i
    originalCost = new Decimal(originalCost)
    let tag = ""

    //Initiate type of resource used
    if (index === 1) {
        tag = "reincarnationPoints"
    } else {
        tag = "antPoints"
    }

    let buyTo = player[pos + "Owned" + type] + 1;
    let cashToBuy = getAntCost(originalCost, buyTo, type, index);
    while (player[tag].greaterThanOrEqualTo(cashToBuy)) {
        // Multiply by 4 until the desired amount. Iterate from there
        buyTo = buyTo * 4;
        cashToBuy = getAntCost(originalCost, buyTo, type, index);
    }
    let stepdown = Math.floor(buyTo / 8);
    while (stepdown !== 0) {
        if (getAntCost(originalCost, buyTo - stepdown, type, index).lessThanOrEqualTo(player[tag])) {
            stepdown = Math.floor(stepdown / 2);
        } else {
            buyTo = buyTo - stepdown;
        }
    }

    if (!player.antMax) {
        if (1 + player[pos + "Owned" + type] < buyTo) {
            buyTo = player[pos + "Owned" + type] + 1;
        }
    }
    // go down by 7 steps below the last one able to be bought and spend the cost of 25 up to the one that you started with and stop if coin goes below requirement
    let buyFrom = Math.max(buyTo - 7, player[pos + 'Owned' + type] + 1);
    let thisCost = getAntCost(originalCost, buyFrom, type, index);
    while (buyFrom <= buyTo && player[tag].greaterThanOrEqualTo(getAntCost(originalCost, buyFrom, type, index))) {
        player[tag] = player[tag].sub(thisCost);
        player[pos + 'Owned' + type] = buyFrom;
        buyFrom = buyFrom + 1;
        thisCost = getAntCost(originalCost, buyFrom, type, index);
        player[pos + 'Cost' + type] = thisCost;
    }
    if (player.reincarnationPoints.lessThan(0)) {
        player.reincarnationPoints = new Decimal("0")
    }
    if (player.antPoints.lessThan(0)) {
        player.antPoints = new Decimal("0")
    }
    calculateAntSacrificeELO();

    let achRequirements = [2, 6, 20, 100, 500, 6666, 77777]
    for (let j = 0; j < 7; j++) {
        if (sacrificeMult > achRequirements[j] && player[ordinals[j + 1] + "OwnedAnts"] > 0 && player.achievements[176 + j] === 0) {
            achievementaward(176 + j)
        }
    }

    if(player.firstOwnedAnts > 6.9e7){
        player.firstOwnedAnts = 6.9e7
    }
}

function getAntUpgradeCost(originalCost, buyTo, index) {
    --buyTo

    let cost = originalCost.times(Decimal.pow(antUpgradeCostIncreases[index], buyTo))
    return cost;


}

function buyAntUpgrade(originalCost, auto, index) {
    if (player.currentChallenge.ascension !== 11) {
        originalCost = new Decimal(originalCost);
        let buyTo = 1 + player.antUpgrades[index];
        let cashToBuy = getAntUpgradeCost(originalCost, buyTo, index);
        while (player.antPoints.greaterThanOrEqualTo(cashToBuy)) {
            // Multiply by 4 until the desired amount. Iterate from there
            buyTo = buyTo * 4;
            cashToBuy = getAntUpgradeCost(originalCost, buyTo, index);
        }
        let stepdown = Math.floor(buyTo / 8);
        while (stepdown !== 0) {
            if (getAntUpgradeCost(originalCost, buyTo - stepdown, index).lessThanOrEqualTo(player.antPoints)) {
                stepdown = Math.floor(stepdown / 2);
            } else {
                buyTo = buyTo - stepdown;
            }
        }
        if (!player.antMax) {
            if (player.antUpgrades[index] + 1 < buyTo) {
                buyTo = 1 + player.antUpgrades[index]
            }
        }
        // go down by 7 steps below the last one able to be bought and spend the cost of 25 up to the one that you started with and stop if coin goes below requirement
        let buyFrom = Math.max(buyTo - 7, 1 + player.antUpgrades[index]);
        let thisCost = getAntUpgradeCost(originalCost, buyFrom, index);
        while (buyFrom <= buyTo && player.antPoints.greaterThanOrEqualTo(thisCost)) {
            player.antPoints = player.antPoints.sub(thisCost);
            player.antUpgrades[index] = buyFrom;
            buyFrom = buyFrom + 1;
            thisCost = getAntUpgradeCost(originalCost, buyFrom, index);
        }
        calculateAnts();
        calculateRuneLevels();
        calculateAntSacrificeELO();
        if (!auto) {
            antUpgradeDescription(index)
        }
        if (player.antUpgrades[12] === 1 && index === 12) {
            revealStuff()
        }
    }
}


function antUpgradeDescription(i) {
    let el = document.getElementById("antspecies")
    let la = document.getElementById("antupgradedescription")
    let ti = document.getElementById("antupgradecost")
    let me = document.getElementById("antupgradeeffect")

    let content1 = antspecies["antspecies" + i];
    let content2 = antupgdesc["antupgdesc" + i];
    let bonuslevel = window["bonusant" + i];

    let c11 = 0;
    if (player.currentChallenge.ascension === 11) {
        c11 = 999
    }
    document.getElementById("antspecies").childNodes[0].textContent = content1 + " Level " + format(player.antUpgrades[i])
    document.getElementById("antlevelbonus").textContent = " [+" + format(Math.min(player.antUpgrades[i] + c11, bonuslevel)) + "]"
    la.textContent = content2
    ti.textContent = "Cost: " + format(Decimal.pow(antUpgradeCostIncreases[i], player.antUpgrades[i] * extinctionMultiplier[player.usedCorruptions[10]]).times(antUpgradeBaseCost[i])) + " Galactic Crumbs"
    me.textContent = "CURRENT EFFECT: " + antUpgradeTexts[i]()
}

//function buyAntUpgrade(i,auto) {
//    if(player.antPoints.greaterThanOrEqualTo(Decimal.pow(10, antUpgradeCostIncreases[i] * player.antUpgrades[i]).times(antUpgradeBaseCost[i]))){
//        player.antPoints = player.antPoints.sub(Decimal.pow(10, antUpgradeCostIncreases[i] * player.antUpgrades[i]).times(antUpgradeBaseCost[i]));
//        player.antUpgrades[i]++
//        calculateAnts();
//        calculateRuneLevels();
//        calculateAntSacrificeELO();


//        if(!auto){antUpgradeDescription(i)}
//        if(player.antUpgrades[12] == 1 && i == 12){revealStuff()}
//    }
//    else{}
//}

function antSacrificePointsToMultiplier(points) {
    let multiplier = Math.pow(1 + points / 5000, 2)
    multiplier *= (1 + 0.2 * Math.log(1 + points) / Math.log(10))
    if (player.achievements[174] > 0) {
        multiplier *= (1 + 0.4 * Math.log(1 + points) / Math.log(10))
    }
    return multiplier;
}

function showSacrifice() {
    let sacRewards = calculateAntSacrificeRewards();
    document.getElementById("antSacrificeSummary").style.display = "block"

    document.getElementById("antELO").childNodes[0].textContent = "Your Ant ELO is "
    document.getElementById("ELO").textContent = format(antELO, 2,)
    document.getElementById("effectiveELO").textContent = "[" + format(effectiveELO, 2, false) + " effective]"

    document.getElementById("antSacrificeMultiplier").childNodes[0].textContent = "Ant Multiplier x" + format(antSacrificePointsToMultiplier(player.antSacrificePoints), 3, false) + " --> "
    document.getElementById("SacrificeMultiplier").textContent = "x" + format(antSacrificePointsToMultiplier(player.antSacrificePoints + sacRewards.antSacrificePoints), 3, false)

    document.getElementById("SacrificeUpgradeMultiplier").textContent = format(upgradeMultiplier, 3, true) + "x"
    document.getElementById("SacrificeTimeMultiplier").textContent = format(timeMultiplier, 3, true) + "x"
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

function sacrificeAnts(auto) {
    let historyEntry = {};

    auto = auto || false
    let p = true

    if (player.antPoints.greaterThanOrEqualTo("1e40")) {
        if (!auto && player.antSacrificePoints < 100 && player.toggles[32]) {
            p = confirm("This resets your Crumbs, Ants and Ant Upgrades in exchange for some multiplier and resources. Continue?")
        }
        if (p) {
            historyEntry.antSacrificePointsBefore = player.antSacrificePoints;

            let sacRewards = calculateAntSacrificeRewards();
            player.antSacrificePoints += sacRewards.antSacrificePoints;
            player.runeshards += sacRewards.offerings;
            player.researchPoints += sacRewards.obtainium;

            historyEntry.seconds = player.antSacrificeTimer;
            historyEntry.offerings = sacRewards.offerings;
            historyEntry.obtainium = sacRewards.obtainium;
            historyEntry.antSacrificePointsAfter = player.antSacrificePoints;
            historyEntry.baseELO = antELO;
            historyEntry.effectiveELO = effectiveELO;
            historyEntry.crumbs = player.antPoints;
            historyEntry.crumbsPerSecond = antOneProduce;

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
            if (player.shopUpgrades.offeringAutoLevel > 0.5 && player.autoSacrificeToggle) {
                // Since ants boost rune EXP, we need to auto-spend offerings NOW, before reset, if cube-tier auto-spend is enabled.
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
                let linGrowth = (player.autoResearch === 200) ? 0.01 : 0;
                buyResearch(player.autoResearch, true, linGrowth)
            }
            calculateAntSacrificeELO();

            resetHistoryAdd("ants", "antsacrifice", historyEntry);
        }
    }

    if (player.mythicalFragments >= 1e11 && player.currentChallenge.ascension === 14 && player.achievements[248] < 1) {
        achievementaward(248)
    }
}

function autoBuyAnts() {
    const canAffordUpgrade = (x, m) => player.antPoints.greaterThanOrEqualTo(getAntUpgradeCost(new Decimal(antUpgradeBaseCost[x]), player.antUpgrades[x] + 1, x).times(m))
    let ach = [176, 176, 177, 178, 178, 179, 180, 180, 181, 182, 182, 145];
    let cost = ["100", "100", "1000", "1000", "1e5", "1e6", "1e8", "1e11", "1e15", "1e20", "1e40", "1e100"];
    if (player.currentChallenge.ascension !== 11) {
        for (let i = 1; i <= ach.length; i++) {
            let check = i === 12 ? player.researches[ach[i - 1]] : player.achievements[ach[i - 1]];
            if (check && canAffordUpgrade(i, 2)) {
                buyAntUpgrade(cost[i - 1], true, i);
            }
        }
    }

    ach = [173, 176, 177, 178, 179, 180, 181, 182];
    cost = ["1e800", "3", "100", "10000", "1e12", "1e36", "1e100", "1e300"];
    for (let i = 1; i <= ach.length; i++) {
        let res = i === 1 ? player.reincarnationPoints : player.antPoints;
        let m = i === 1 ? 1 : 2; // no multiplier on the first ant cost because it costs particles
        if (player.achievements[ach[i - 1]] && res.greaterThanOrEqualTo(player[ordinals[i - 1] + "CostAnts"].times(m))) {
            buyAntProducers(ordinals[i - 1], "Ants", cost[i - 1], i);
        }
    }
}

