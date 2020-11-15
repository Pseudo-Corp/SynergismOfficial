var talismanResourceObtainiumCosts = [1e13, 1e14, 1e16, 1e18, 1e20, 1e22, 1e24]
var talismanResourceOfferingCosts = [0, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9]

var talismanResourceCosts = {
    shard: {
        obtainium: 1e13,
        offerings: 1e2,
        name: "Talisman Shard"
    },
    commonFragment: {
        obtainium: 1e14,
        offerings: 1e4,
        name: "Common Fragment"
    },
    uncommonFragment: {
        obtainium: 1e16,
        offerings: 1e5,
        name: "Uncommon Fragment"
    },
    rareFragment: {
        obtainium: 1e18,
        offerings: 1e6,
        name: "Rare Fragment"
    },
    epicFragment: {
        obtainium: 1e20,
        offerings: 1e7,
        name: "Epic Fragment"
    },
    legendaryFragment: {
        obtainium: 1e22,
        offerings: 1e8,
        name: "Legendary Fragment"
    },
    mythicalFragment: {
        obtainium: 1e24,
        offerings: 1e9,
        name: "Mythical Fragment"
    },
}

function getTalismanResourceInfo(type, percentage) {
    percentage = percentage || player.buyTalismanShardPercent;
    let obtainiumCost = talismanResourceCosts[type].obtainium;
    let offeringCost = talismanResourceCosts[type].offerings;

    let maxBuyObtainium = Math.max(1, Math.floor(player.researchPoints / obtainiumCost));
    let maxBuyOffering = Math.max(1, Math.floor(player.runeshards / (offeringCost)));
    let amountToBuy = Math.max(1, Math.floor(percentage / 100 * Math.min(maxBuyObtainium, maxBuyOffering)));
    let canBuy = (obtainiumCost <= player.researchPoints && offeringCost <= player.runeshards) ? true : false;
    return {
        canBuy: canBuy, //Boolean, if false will not buy any fragments
        buyAmount: amountToBuy, //Integer, will buy as specified above.
        obtainiumCost: obtainiumCost * amountToBuy, //Integer, cost in obtainium to buy (buyAmount) resource
        offeringCost: offeringCost * amountToBuy //Integer, cost in offerings to buy (buyAmount) resource
    };
};

function updateTalismanCostDisplay(type, percentage) {
    percentage = percentage || player.buyTalismanShardPercent;
    let el = document.getElementById("talismanFragmentCost");
    let talismanCostInfo = getTalismanResourceInfo(type, percentage);
    let TalismanName = talismanResourceCosts[type].name;

    el.textContent = "Cost to buy " + format(talismanCostInfo.buyAmount) + " " + TalismanName + (talismanCostInfo.buyAmount>1?"s":"") + ": " + format(talismanCostInfo.obtainiumCost) + " Obtainium and " + format(talismanCostInfo.offeringCost) + " offerings."
}

function toggleTalismanBuy(i) {
    i = i || player.buyTalismanShardPercent
    document.getElementById("talismanTen").style.backgroundColor = "#171717"
    document.getElementById("talismanTwentyFive").style.backgroundColor = "#171717"
    document.getElementById("talismanFifty").style.backgroundColor = "#171717"
    document.getElementById("talismanHundred").style.backgroundColor = "#171717"
    player.buyTalismanShardPercent = i
    let x = "Ten"
    if (i === 10) {
        x = "Ten"
    }
    if (i === 25) {
        x = "TwentyFive"
    }
    if (i === 50) {
        x = "Fifty"
    }
    if (i === 100) {
        x = "Hundred"
    }

    document.getElementById("talisman" + x).style.backgroundColor = "green"

}

function updateTalismanInventory() {
    document.getElementById("talismanShardInventory").textContent = format(player.talismanShards);
    document.getElementById("commonFragmentInventory").textContent = format(player.commonFragments);
    document.getElementById("uncommonFragmentInventory").textContent = format(player.uncommonFragments);
    document.getElementById("rareFragmentInventory").textContent = format(player.rareFragments);
    document.getElementById("epicFragmentInventory").textContent = format(player.epicFragments);
    document.getElementById("legendaryFragmentInventory").textContent = format(player.legendaryFragments);
    document.getElementById("mythicalFragmentInventory").textContent = format(player.mythicalFragments);
}

function buyTalismanResources(type, percentage) {
    percentage = percentage || player.buyTalismanShardPercent;
    let talismanResourcesData = getTalismanResourceInfo(type, percentage)

    if (talismanResourcesData.canBuy) {
        if (type === 'shard') {
            player.talismanShards += talismanResourcesData.buyAmount
        } else {
            player[type + 's'] += talismanResourcesData.buyAmount
        }
        if (type === 'mythicalFragment' && player.mythicalFragments >= 1e25 && player.achievements[239] < 1) {
            achievementaward(239)
        }

        player.researchPoints -= talismanResourcesData.obtainiumCost;
        player.runeshards -= talismanResourcesData.offeringCost;
    }
    updateTalismanCostDisplay(type, percentage)
    updateTalismanInventory()
}


function showTalismanEffect(i) {
    let ord = [null, "One", "Two", "Three", "Four", "Five", "Six", "Seven"]
    document.getElementById("talismanlevelup").style.display = "none"
    document.getElementById("talismanEffect").style.display = "block"
    document.getElementById("talismanrespec").style.display = "none"
    let a = document.getElementById("talismanSummary")
    let b = document.getElementById("talismanBonus")
    let c = document.getElementById("talismanRune1Effect")
    let d = document.getElementById("talismanRune2Effect")
    let e = document.getElementById("talismanRune3Effect")
    let f = document.getElementById("talismanRune4Effect")
    let g = document.getElementById("talismanRune5Effect")
    let h = document.getElementById("talismanMythicEffect")

    let index = player.talismanRarity[i]
    let modifiers = [null, "+", "+", "+", "+", "+"]
    let num = talismanPositiveModifier[index];
    let talismanRarityMult = [null, num, num, num, num, num]

    for (let j = 1; j <= 5; j++) {
        if (player["talisman" + ord[i]][j] < 0) {
            modifiers[j] = "-";
            talismanRarityMult[j] = talismanNegativeModifier[index]
        }
    }

    switch (i) {
        case 1:
            a.textContent = "=-=-=-= Exemption Talisman Effects =-=-=-=";
            b.textContent = "Taxes -" + format(10 * (player.talismanRarity[1] - 1)) + "%"
            c.textContent = "Bonus Speed Rune Levels: " + format(talisman1Effect[1], 2, true)
            d.textContent = "Bonus Duplication Rune Levels: " + format(talisman1Effect[2], 2, true)
            e.textContent = "Bonus Prism Rune Levels: " + format(talisman1Effect[3], 2, true)
            f.textContent = "Bonus Thrift Rune Levels: " + format(talisman1Effect[4], 2, true)
            g.textContent = "Bonus SI Rune Levels: " + format(talisman1Effect[5], 2, true)
            h.textContent = "Mythic Effect: +400 Duplication Rune Levels!"
            break;
        case 2:
            a.textContent = "=-=-=-= Chronos Talisman Effects =-=-=-=";
            b.textContent = "Gain +" + format(10 * (player.talismanRarity[2] - 1)) + "% Global Speed Acceleration."
            c.textContent = "Bonus Speed Rune Levels: " + format(talisman2Effect[1], 2, true)
            d.textContent = "Bonus Duplication Rune Levels: " + format(talisman2Effect[2], 2, true)
            e.textContent = "Bonus Prism Rune Levels: " + format(talisman2Effect[3], 2, true)
            f.textContent = "Bonus Thrift Rune Levels: " + format(talisman2Effect[4], 2, true)
            g.textContent = "Bonus SI Rune Levels: " + format(talisman2Effect[5], 2, true)
            h.textContent = "Mythic Effect: +400 Speed Rune Levels!"
            break;
        case 3:
            a.textContent = "=-=-=-= Midas Talisman Effects =-=-=-=";
            b.textContent = "Rune Blessing bonuses +" + format(10 * (player.talismanRarity[3] - 1)) + "%"
            c.textContent = "Bonus Speed Rune Levels: " + format(talisman3Effect[1], 2, true)
            d.textContent = "Bonus Duplication Rune Levels: " + format(talisman3Effect[2], 2, true)
            e.textContent = "Bonus Prism Rune Levels: " + format(talisman3Effect[3], 2, true)
            f.textContent = "Bonus Thrift Rune Levels: " + format(talisman3Effect[4], 2, true)
            g.textContent = "Bonus SI Rune Levels: " + format(talisman3Effect[5], 2, true)
            h.textContent = "Mythic Effect: +400 Thrift Rune Levels!"
            break;
        case 4:
            a.textContent = "=-=-=-= Metaphysics Talisman Effects =-=-=-=";
            b.textContent = "Talismans' Bonus Rune Levels +" + format(0.05 * (player.talismanRarity[4] - 1), 2) + " per level"
            c.textContent = "Bonus Speed Rune Levels: " + format(talisman4Effect[1], 2, true)
            d.textContent = "Bonus Duplication Rune Levels: " + format(talisman4Effect[2], 2, true)
            e.textContent = "Bonus Prism Rune Levels: " + format(talisman4Effect[3], 2, true)
            f.textContent = "Bonus Thrift Rune Levels: " + format(talisman4Effect[4], 2, true)
            g.textContent = "Bonus SI Rune Levels: " + format(talisman4Effect[5], 2, true)
            h.textContent = "Mythic Effect: +400 Prism Rune Levels!"
            break;
        case 5:
            a.textContent = "=-=-=-= Polymath Talisman Effects =-=-=-=";
            b.textContent = "Rune Spirit Bonuses +" + format(1 * (player.talismanRarity[5] - 1)) + "%"
            c.textContent = "Bonus Speed Rune Levels: " + format(talisman5Effect[1], 2, true)
            d.textContent = "Bonus Duplication Rune Levels: " + format(talisman5Effect[2], 2, true)
            e.textContent = "Bonus Prism Rune Levels: " + format(talisman5Effect[3], 2, true)
            f.textContent = "Bonus Thrift Rune Levels: " + format(talisman5Effect[4], 2, true)
            g.textContent = "Bonus SI Rune Levels: " + format(talisman5Effect[5], 2, true)
            h.textContent = "Mythic Effect: +400 SI Rune Levels!"
            break;
        case 6:
            a.textContent = "=-=-=-= Mortuus Est Talisman Effects =-=-=-=";
            b.textContent = "Bonus Ant Levels: +" + format(2 * (player.talismanRarity[6] - 1))
            c.textContent = "Bonus Speed Rune Levels: " + format(talisman6Effect[1], 2, true)
            d.textContent = "Bonus Duplication Rune Levels: " + format(talisman6Effect[2], 2, true)
            e.textContent = "Bonus Prism Rune Levels: " + format(talisman6Effect[3], 2, true)
            f.textContent = "Bonus Thrift Rune Levels: " + format(talisman6Effect[4], 2, true)
            g.textContent = "Bonus SI Rune Levels: " + format(talisman6Effect[5], 2, true)
            h.textContent = "Mythic Effect: Gain ant speed based on your total rune level!"
            break;
        case 7:
            a.textContent = "=-=-=-= Plastic Talisman Effects =-=-=-=";
            b.textContent = "Gain 1x normal production"
            c.textContent = "Bonus Speed Rune Levels: " + format(talisman7Effect[1], 2, true)
            d.textContent = "Bonus Duplication Rune Levels: " + format(talisman7Effect[2], 2, true)
            e.textContent = "Bonus Prism Rune Levels: " + format(talisman7Effect[3], 2, true)
            f.textContent = "Bonus Thrift Rune Levels: " + format(talisman7Effect[4], 2, true)
            g.textContent = "Bonus SI Rune Levels: " + format(talisman7Effect[5], 2, true)
            h.textContent = "Mythic Effect: +2 Quarks per Hour on Export!"
            break;
    }
    if (player.talismanRarity[i] !== 6) {
        h.textContent = "Get Max Enhance for a Mythical bonus effect!"
    }
}

function showTalismanPrices(i) {
    document.getElementById("talismanEffect").style.display = "none"
    document.getElementById("talismanlevelup").style.display = "block"
    document.getElementById("talismanrespec").style.display = "none"
    let a = document.getElementById("talismanShardCost")
    let b = document.getElementById("talismanCommonFragmentCost")
    let c = document.getElementById("talismanUncommonFragmentCost")
    let d = document.getElementById("talismanRareFragmentCost")
    let e = document.getElementById("talismanEpicFragmentCost")
    let f = document.getElementById("talismanLegendaryFragmentCost")
    let g = document.getElementById("talismanMythicalFragmentCost")

    document.getElementById("talismanLevelUpSummary").textContent = "-=-=- Resources Required to Level Up -=-=-"
    document.getElementById("talismanLevelUpSummary").style.color = "silver"

    let m = talismanLevelCostMultiplier[i]
    if (player.talismanLevels[i] >= 120) {
        m *= (player.talismanLevels[i] - 90) / 30
    }
    if (player.talismanLevels[i] >= 150) {
        m *= (player.talismanLevels[i] - 120) / 30
    }
    if (player.talismanLevels[i] >= 180) {
        m *= (player.talismanLevels[i] - 170) / 10
    }
    a.textContent = format(m * Math.max(0, Math.floor(1 + 1 / 8 * Math.pow(player.talismanLevels[i], 3))));
    b.textContent = format(m * Math.max(0, Math.floor(1 + 1 / 32 * Math.pow(player.talismanLevels[i] - 30, 3))));
    c.textContent = format(m * Math.max(0, Math.floor(1 + 1 / 384 * Math.pow(player.talismanLevels[i] - 60, 3))));
    d.textContent = format(m * Math.max(0, Math.floor(1 + 1 / 500 * Math.pow(player.talismanLevels[i] - 90, 3))));
    e.textContent = format(m * Math.max(0, Math.floor(1 + 1 / 375 * Math.pow(player.talismanLevels[i] - 120, 3))));
    f.textContent = format(m * Math.max(0, Math.floor(1 + 1 / 192 * Math.pow(player.talismanLevels[i] - 150, 3))));
    g.textContent = format(m * Math.max(0, Math.floor(1 + 1 / 1280 * Math.pow(player.talismanLevels[i] - 150, 3))));
}

function showEnhanceTalismanPrices(i) {
    document.getElementById("talismanEffect").style.display = "none"
    document.getElementById("talismanlevelup").style.display = "block"
    document.getElementById("talismanrespec").style.display = "none"
    let a = document.getElementById("talismanShardCost")
    let b = document.getElementById("talismanCommonFragmentCost")
    let c = document.getElementById("talismanUncommonFragmentCost")
    let d = document.getElementById("talismanRareFragmentCost")
    let e = document.getElementById("talismanEpicFragmentCost")
    let f = document.getElementById("talismanLegendaryFragmentCost")
    let g = document.getElementById("talismanMythicalFragmentCost")

    document.getElementById("talismanLevelUpSummary").textContent = "=-=-= Resources Required to ENHANCE =-=-="
    document.getElementById("talismanLevelUpSummary").style.color = "gold"

    let array = [null, commonTalismanEnhanceCost, uncommonTalismanEnchanceCost, rareTalismanEnchanceCost, epicTalismanEnhanceCost, legendaryTalismanEnchanceCost, mythicalTalismanEnchanceCost]
    let index = player.talismanRarity[i];
    let costArray = array[index];
    let m = talismanLevelCostMultiplier[i]
    a.textContent = format(m * costArray[1]);
    b.textContent = format(m * costArray[2]);
    c.textContent = format(m * costArray[3]);
    d.textContent = format(m * costArray[4]);
    e.textContent = format(m * costArray[5]);
    f.textContent = format(m * costArray[6]);
    g.textContent = format(m * costArray[7]);
}

function showRespecInformation(i) {
    talismanRespec = i
    let num = [null, "One", "Two", "Three", "Four", "Five", "Six", "Seven"]
    document.getElementById("talismanEffect").style.display = "none"
    document.getElementById("talismanlevelup").style.display = "none"
    document.getElementById("talismanrespec").style.display = "block"

    let runeName = [null, "Speed Rune", "Duplication Rune", "Prism Rune", "Thrift Rune", "SI Rune"]
    let runeModifier = [null, "Positive", "Positive", "Positive", "Positive"]
    if (i <= 7) {
        for (let k = 1; k <= 5; k++) {
            mirrorTalismanStats[k] = player["talisman" + num[i]][k];
        }
        document.getElementById("confirmTalismanRespec").textContent = "Confirm [-100,000 Offerings]"
    }
    if (i === 8) {
        for (let k = 1; k <= 5; k++) {
            mirrorTalismanStats[k] = 1;
        }
        document.getElementById("confirmTalismanRespec").textContent = "Confirm ALL [-400,000 Offerings]"
    }
    for (let j = 1; j <= 5; j++) {
        if (mirrorTalismanStats[j] === 1) {
            document.getElementById("talismanRespecButton" + j).style.border = "2px solid limegreen";
            runeModifier[j] = "Positive"
        }
        if (mirrorTalismanStats[j] === -1) {
            document.getElementById("talismanRespecButton" + j).style.border = "2px solid crimson";
            runeModifier[j] = "Negative"
        }
        document.getElementById("talismanRespecButton" + j).textContent = runeName[j] + ": " + runeModifier[j]
    }

    document.getElementById("confirmTalismanRespec").style.display = "none"
}

function changeTalismanModifier(i) {
    let runeName = [null, "Speed Rune", "Duplication Rune", "Prism Rune", "Thrift Rune", "SI Rune"];
    let el = document.getElementById("talismanRespecButton" + i);
    if (mirrorTalismanStats[i] === 1) {
        mirrorTalismanStats[i] = (-1);
        el.textContent = runeName[i] + ": Negative";
        el.style.border = "2px solid crimson";
    } else {
        mirrorTalismanStats[i] = (1);
        el.textContent = runeName[i] + ": Positive";
        el.style.border = "2px solid limegreen";
    }

    let checkSum = mirrorTalismanStats.reduce(function (a, b) {
        return a + b;
    }, 0);

    if (checkSum === 1) {
        document.getElementById("confirmTalismanRespec").style.display = "block";
    } else {
        document.getElementById("confirmTalismanRespec").style.display = "none";
    }

}

function respecTalismanConfirm(i) {
    let num = [null, "One", "Two", "Three", "Four", "Five", "Six", "Seven"]
    if (player.runeshards >= 100000 && i <= 7) {
        for (let j = 1; j <= 5; j++) {
            player["talisman" + num[i]][j] = mirrorTalismanStats[j];
        }
        player.runeshards -= 100000;
        document.getElementById("confirmTalismanRespec").style.display = "none";
        document.getElementById("talismanrespec").style.display = "none";
        document.getElementById("talismanEffect").style.display = "block";
        showTalismanEffect(i);
    } else if (player.runeshards >= 400000 && i === 8) {
        player.runeshards -= 400000
        for (let j = 1; j <= 7; j++) {
            for (let k = 1; k <= 5; k++) {
                player["talisman" + num[j]][k] = mirrorTalismanStats[k];
            }
        }
        document.getElementById("confirmTalismanRespec").style.display = "none";
    } else {
    }
    calculateRuneLevels();
}

function respecTalismanCancel(i) {
    document.getElementById("talismanrespec").style.display = "none"
    if (i <= 7) {
        document.getElementById("talismanEffect").style.display = "block";
        showTalismanEffect(i);
    }
}

function updateTalismanAppearance(i) {
    let id = ""
    let el = document.getElementById("talisman" + i)
    let la = document.getElementById("talisman" + i + "level")
    if (i === 2) {
        id = "MultiplierAcceleratorTalisman"
    }

    let rarity = player.talismanRarity[i];
    if (rarity === 1) {
        el.style.border = "4px solid white";
        la.style.color = "white"
    }
    if (rarity === 2) {
        el.style.border = "4px solid limegreen";
        la.style.color = "limegreen"
    }
    if (rarity === 3) {
        el.style.border = "4px solid lightblue";
        la.style.color = "lightblue"
    }
    if (rarity === 4) {
        el.style.border = "4px solid plum";
        la.style.color = "plum"
    }
    if (rarity === 5) {
        el.style.border = "4px solid orange";
        la.style.color = "orange"
    }
    if (rarity === 6) {
        el.style.border = "4px solid crimson";
        la.style.color = "crimson"
    }
}


function buyTalismanLevels(i, auto) {
    auto = auto || false
    let max = 1;
    if (player.ascensionCount > 0) {
        max = 30
    }
    for (let j = 1; j <= max; j++) {
        let checkSum = 0;
        let priceMult = talismanLevelCostMultiplier[i]
        if (player.talismanLevels[i] >= 120) {
            priceMult *= (player.talismanLevels[i] - 90) / 30
        }
        if (player.talismanLevels[i] >= 150) {
            priceMult *= (player.talismanLevels[i] - 120) / 30
        }
        if (player.talismanLevels[i] >= 180) {
            priceMult *= (player.talismanLevels[i] - 170) / 10
        }

        if (player.talismanLevels[i] < (player.talismanRarity[i] * 30 + 6 * CalcECC('ascension', player.challengecompletions[13]) + Math.floor(player.researches[200] / 400))) {
            if (player.talismanShards >= priceMult * Math.max(0, Math.floor(1 + 1 / 8 * Math.pow(player.talismanLevels[i], 3)))) {
                checkSum++
            }
            if (player.commonFragments >= priceMult * Math.max(0, Math.floor(1 + 1 / 32 * Math.pow(player.talismanLevels[i] - 30, 3)))) {
                checkSum++
            }
            if (player.uncommonFragments >= priceMult * Math.max(0, Math.floor(1 + 1 / 384 * Math.pow(player.talismanLevels[i] - 60, 3)))) {
                checkSum++
            }
            if (player.rareFragments >= priceMult * Math.max(0, Math.floor(1 + 1 / 500 * Math.pow(player.talismanLevels[i] - 90, 3)))) {
                checkSum++
            }
            if (player.epicFragments >= priceMult * Math.max(0, Math.floor(1 + 1 / 375 * Math.pow(player.talismanLevels[i] - 120, 3)))) {
                checkSum++
            }
            if (player.legendaryFragments >= priceMult * Math.max(0, Math.floor(1 + 1 / 192 * Math.pow(player.talismanLevels[i] - 150, 3)))) {
                checkSum++
            }
            if (player.mythicalFragments >= priceMult * Math.max(0, Math.floor(1 + 1 / 1280 * Math.pow(player.talismanLevels[i] - 150, 3)))) {
                checkSum++
            }
        }

        if (checkSum === 7) {
            player.talismanShards -= priceMult * Math.max(0, Math.floor(1 + 1 / 8 * Math.pow(player.talismanLevels[i], 3)))
            player.commonFragments -= priceMult * Math.max(0, Math.floor(1 + 1 / 32 * Math.pow(player.talismanLevels[i] - 30, 3)))
            player.uncommonFragments -= priceMult * Math.max(0, Math.floor(1 + 1 / 384 * Math.pow(player.talismanLevels[i] - 60, 3)))
            player.rareFragments -= priceMult * Math.max(0, Math.floor(1 + 1 / 500 * Math.pow(player.talismanLevels[i] - 90, 3)))
            player.epicFragments -= priceMult * Math.max(0, Math.floor(1 + 1 / 375 * Math.pow(player.talismanLevels[i] - 120, 3)))
            player.legendaryFragments -= priceMult * Math.max(0, Math.floor(1 + 1 / 192 * Math.pow(player.talismanLevels[i] - 150, 3)))
            player.mythicalFragments -= priceMult * Math.max(0, Math.floor(1 + 1 / 1280 * Math.pow(player.talismanLevels[i] - 150, 3)))
            player.talismanLevels[i] += 1;

        }

        if (checkSum !== 7) {
            break
        }
    }
    updateTalismanInventory();
    if (!auto) {
        showTalismanPrices(i);
    }
    calculateRuneLevels();
}

function buyTalismanEnhance(i, auto) {
    auto = auto || false
    let checkSum = 0;
    if (player.talismanRarity[i] < 6) {
        let priceMult = talismanLevelCostMultiplier[i];
        let array = [null, commonTalismanEnhanceCost, uncommonTalismanEnchanceCost, rareTalismanEnchanceCost, epicTalismanEnhanceCost, legendaryTalismanEnchanceCost, mythicalTalismanEnchanceCost];
        let index = player.talismanRarity[i];
        let costArray = array[index];
        if (player.commonFragments >= priceMult * costArray[2]) {
            checkSum++
        }
        if (player.uncommonFragments >= priceMult * costArray[3]) {
            checkSum++
        }
        if (player.rareFragments >= priceMult * costArray[4]) {
            checkSum++
        }
        if (player.epicFragments >= priceMult * costArray[5]) {
            checkSum++
        }
        if (player.legendaryFragments >= priceMult * costArray[6]) {
            checkSum++
        }
        if (player.mythicalFragments >= priceMult * costArray[7]) {
            checkSum++
        }


        if (checkSum === 6) {
            player.commonFragments -= (priceMult * costArray[2])
            player.uncommonFragments -= (priceMult * costArray[3])
            player.rareFragments -= (priceMult * costArray[4])
            player.epicFragments -= (priceMult * costArray[5])
            player.legendaryFragments -= (priceMult * costArray[6])
            player.mythicalFragments -= (priceMult * costArray[7])
            player.talismanRarity[i] += 1
        }

        updateTalismanAppearance(i);
        updateTalismanInventory();
        if (!auto) {
            showEnhanceTalismanPrices(i);
        }
        calculateRuneLevels();
    }
}
