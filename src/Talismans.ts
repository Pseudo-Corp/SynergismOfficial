import { player, format } from './Synergism';
import { Globals as G } from './Variables';
import { CalcECC } from './Challenges';
import { calculateRuneLevels } from './Calculate';
import { achievementaward } from './Achievements';

const talismanResourceCosts = {
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

const getTalismanResourceInfo = (type: keyof typeof talismanResourceCosts, percentage = player.buyTalismanShardPercent) => {
    const obtainiumCost = talismanResourceCosts[type].obtainium;
    const offeringCost = talismanResourceCosts[type].offerings;

    const maxBuyObtainium = Math.max(1, Math.floor(player.researchPoints / obtainiumCost));
    const maxBuyOffering = Math.max(1, Math.floor(player.runeshards / (offeringCost)));
    const amountToBuy = Math.max(1, Math.floor(percentage / 100 * Math.min(maxBuyObtainium, maxBuyOffering)));
    const canBuy = (obtainiumCost <= player.researchPoints && offeringCost <= player.runeshards) ? true : false;
    return {
        canBuy: canBuy, //Boolean, if false will not buy any fragments
        buyAmount: amountToBuy, //Integer, will buy as specified above.
        obtainiumCost: obtainiumCost * amountToBuy, //Integer, cost in obtainium to buy (buyAmount) resource
        offeringCost: offeringCost * amountToBuy //Integer, cost in offerings to buy (buyAmount) resource
    };
};

export const updateTalismanCostDisplay = (type: keyof typeof talismanResourceCosts, percentage = player.buyTalismanShardPercent) => {
    const el = document.getElementById("talismanFragmentCost");
    const talismanCostInfo = getTalismanResourceInfo(type, percentage);
    const TalismanName = talismanResourceCosts[type].name;

    el.textContent = "Cost to buy " + format(talismanCostInfo.buyAmount) + " " + TalismanName + (talismanCostInfo.buyAmount>1?"s":"") + ": " + format(talismanCostInfo.obtainiumCost) + " Obtainium and " + format(talismanCostInfo.offeringCost) + " offerings."
}

export const toggleTalismanBuy = (i = player.buyTalismanShardPercent) => {
    document.getElementById("talismanTen").style.backgroundColor = "#171717"
    document.getElementById("talismanTwentyFive").style.backgroundColor = "#171717"
    document.getElementById("talismanFifty").style.backgroundColor = "#171717"
    document.getElementById("talismanHundred").style.backgroundColor = "#171717"
    player.buyTalismanShardPercent = i
    let x = "Ten";
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

export const updateTalismanInventory = () => {
    document.getElementById("talismanShardInventory").textContent = format(player.talismanShards);
    document.getElementById("commonFragmentInventory").textContent = format(player.commonFragments);
    document.getElementById("uncommonFragmentInventory").textContent = format(player.uncommonFragments);
    document.getElementById("rareFragmentInventory").textContent = format(player.rareFragments);
    document.getElementById("epicFragmentInventory").textContent = format(player.epicFragments);
    document.getElementById("legendaryFragmentInventory").textContent = format(player.legendaryFragments);
    document.getElementById("mythicalFragmentInventory").textContent = format(player.mythicalFragments);
}

export const buyTalismanResources = (type: keyof typeof talismanResourceCosts, percentage = player.buyTalismanShardPercent) => {
    const talismanResourcesData = getTalismanResourceInfo(type, percentage)

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

        // When dealing with high values, calculations can be very slightly off due to floating point precision
        // and result in buying slightly (usually 1) more than the player can actually afford.
        // This results in negative obtainium or offerings with further calcs somehow resulting in NaN/undefined.
        // Instead of trying to work around floating point limits, just make sure nothing breaks as a result.
        // The calculation being done overall is similar to the following calculation:
        // 2.9992198253874083e47 - (Math.floor(2.9992198253874083e47 / 1e20) * 1e20)
        // which, for most values, returns 0, but values like this example will return a negative number instead.
        if (player.researchPoints < 0) {
            player.researchPoints = 0;
        }
        if (player.runeshards < 0) {
            player.runeshards = 0;
        }
    }
    updateTalismanCostDisplay(type, percentage)
    updateTalismanInventory()
}

export const showTalismanEffect = (i: number) => {
    document.getElementById("talismanlevelup").style.display = "none"
    document.getElementById("talismanEffect").style.display = "block"
    document.getElementById("talismanrespec").style.display = "none"
    const a = document.getElementById("talismanSummary")
    const b = document.getElementById("talismanBonus")
    const c = document.getElementById("talismanRune1Effect")
    const d = document.getElementById("talismanRune2Effect")
    const e = document.getElementById("talismanRune3Effect")
    const f = document.getElementById("talismanRune4Effect")
    const g = document.getElementById("talismanRune5Effect")
    const h = document.getElementById("talismanMythicEffect")

    switch (i) {
        case 1:
            a.textContent = "=-=-=-= Exemption Talisman Effects =-=-=-=";
            b.textContent = "Taxes -" + format(10 * (player.talismanRarity[1-1] - 1)) + "%"
            c.textContent = "Bonus Speed Rune Levels: " + format(G['talisman1Effect'][1], 2, true)
            d.textContent = "Bonus Duplication Rune Levels: " + format(G['talisman1Effect'][2], 2, true)
            e.textContent = "Bonus Prism Rune Levels: " + format(G['talisman1Effect'][3], 2, true)
            f.textContent = "Bonus Thrift Rune Levels: " + format(G['talisman1Effect'][4], 2, true)
            g.textContent = "Bonus SI Rune Levels: " + format(G['talisman1Effect'][5], 2, true)
            h.textContent = "Mythic Effect: +400 Duplication Rune Levels!"
            break;
        case 2:
            a.textContent = "=-=-=-= Chronos Talisman Effects =-=-=-=";
            b.textContent = "Gain +" + format(10 * (player.talismanRarity[2-1] - 1)) + "% Global Speed Acceleration."
            c.textContent = "Bonus Speed Rune Levels: " + format(G['talisman2Effect'][1], 2, true)
            d.textContent = "Bonus Duplication Rune Levels: " + format(G['talisman2Effect'][2], 2, true)
            e.textContent = "Bonus Prism Rune Levels: " + format(G['talisman2Effect'][3], 2, true)
            f.textContent = "Bonus Thrift Rune Levels: " + format(G['talisman2Effect'][4], 2, true)
            g.textContent = "Bonus SI Rune Levels: " + format(G['talisman2Effect'][5], 2, true)
            h.textContent = "Mythic Effect: +400 Speed Rune Levels!"
            break;
        case 3:
            a.textContent = "=-=-=-= Midas Talisman Effects =-=-=-=";
            b.textContent = "Rune Blessing bonuses +" + format(10 * (player.talismanRarity[3-1] - 1)) + "%"
            c.textContent = "Bonus Speed Rune Levels: " + format(G['talisman3Effect'][1], 2, true)
            d.textContent = "Bonus Duplication Rune Levels: " + format(G['talisman3Effect'][2], 2, true)
            e.textContent = "Bonus Prism Rune Levels: " + format(G['talisman3Effect'][3], 2, true)
            f.textContent = "Bonus Thrift Rune Levels: " + format(G['talisman3Effect'][4], 2, true)
            g.textContent = "Bonus SI Rune Levels: " + format(G['talisman3Effect'][5], 2, true)
            h.textContent = "Mythic Effect: +400 Thrift Rune Levels!"
            break;
        case 4:
            a.textContent = "=-=-=-= Metaphysics Talisman Effects =-=-=-=";
            b.textContent = "Talismans' Bonus Rune Levels +" + format(0.05 * (player.talismanRarity[4-1] - 1), 2) + " per level"
            c.textContent = "Bonus Speed Rune Levels: " + format(G['talisman4Effect'][1], 2, true)
            d.textContent = "Bonus Duplication Rune Levels: " + format(G['talisman4Effect'][2], 2, true)
            e.textContent = "Bonus Prism Rune Levels: " + format(G['talisman4Effect'][3], 2, true)
            f.textContent = "Bonus Thrift Rune Levels: " + format(G['talisman4Effect'][4], 2, true)
            g.textContent = "Bonus SI Rune Levels: " + format(G['talisman4Effect'][5], 2, true)
            h.textContent = "Mythic Effect: +400 Prism Rune Levels!"
            break;
        case 5:
            a.textContent = "=-=-=-= Polymath Talisman Effects =-=-=-=";
            b.textContent = "Rune Spirit Bonuses +" + format(1 * (player.talismanRarity[5-1] - 1)) + "%"
            c.textContent = "Bonus Speed Rune Levels: " + format(G['talisman5Effect'][1], 2, true)
            d.textContent = "Bonus Duplication Rune Levels: " + format(G['talisman5Effect'][2], 2, true)
            e.textContent = "Bonus Prism Rune Levels: " + format(G['talisman5Effect'][3], 2, true)
            f.textContent = "Bonus Thrift Rune Levels: " + format(G['talisman5Effect'][4], 2, true)
            g.textContent = "Bonus SI Rune Levels: " + format(G['talisman5Effect'][5], 2, true)
            h.textContent = "Mythic Effect: +400 SI Rune Levels!"
            break;
        case 6:
            a.textContent = "=-=-=-= Mortuus Est Talisman Effects =-=-=-=";
            b.textContent = "Bonus Ant Levels: +" + format(2 * (player.talismanRarity[6-1] - 1))
            c.textContent = "Bonus Speed Rune Levels: " + format(G['talisman6Effect'][1], 2, true)
            d.textContent = "Bonus Duplication Rune Levels: " + format(G['talisman6Effect'][2], 2, true)
            e.textContent = "Bonus Prism Rune Levels: " + format(G['talisman6Effect'][3], 2, true)
            f.textContent = "Bonus Thrift Rune Levels: " + format(G['talisman6Effect'][4], 2, true)
            g.textContent = "Bonus SI Rune Levels: " + format(G['talisman6Effect'][5], 2, true)
            h.textContent = "Mythic Effect: Gain ant speed based on your total rune level!"
            break;
        case 7:
            a.textContent = "=-=-=-= Plastic Talisman Effects =-=-=-=";
            b.textContent = "Gain 1x normal production"
            c.textContent = "Bonus Speed Rune Levels: " + format(G['talisman7Effect'][1], 2, true)
            d.textContent = "Bonus Duplication Rune Levels: " + format(G['talisman7Effect'][2], 2, true)
            e.textContent = "Bonus Prism Rune Levels: " + format(G['talisman7Effect'][3], 2, true)
            f.textContent = "Bonus Thrift Rune Levels: " + format(G['talisman7Effect'][4], 2, true)
            g.textContent = "Bonus SI Rune Levels: " + format(G['talisman7Effect'][5], 2, true)
            h.textContent = "Mythic Effect: +2 Quarks per Hour on Export!"
            break;
    }
    if (player.talismanRarity[i-1] !== 6) {
        h.textContent = "Get Max Enhance for a Mythical bonus effect!"
    }
}

export const showTalismanPrices = (i: number) => {
    document.getElementById("talismanEffect").style.display = "none"
    document.getElementById("talismanlevelup").style.display = "block"
    document.getElementById("talismanrespec").style.display = "none"
    const a = document.getElementById("talismanShardCost")
    const b = document.getElementById("talismanCommonFragmentCost")
    const c = document.getElementById("talismanUncommonFragmentCost")
    const d = document.getElementById("talismanRareFragmentCost")
    const e = document.getElementById("talismanEpicFragmentCost")
    const f = document.getElementById("talismanLegendaryFragmentCost")
    const g = document.getElementById("talismanMythicalFragmentCost")

    document.getElementById("talismanLevelUpSummary").textContent = "-=-=- Resources Required to Level Up -=-=-"
    document.getElementById("talismanLevelUpSummary").style.color = "silver"

    let m = G['talismanLevelCostMultiplier'][i]
    if (player.talismanLevels[i-1] >= 120) {
        m *= (player.talismanLevels[i-1] - 90) / 30
    }
    if (player.talismanLevels[i-1] >= 150) {
        m *= (player.talismanLevels[i-1] - 120) / 30
    }
    if (player.talismanLevels[i-1] >= 180) {
        m *= (player.talismanLevels[i-1] - 170) / 10
    }
    a.textContent = format(m * Math.max(0, Math.floor(1 + 1 / 8 * Math.pow(player.talismanLevels[i-1], 3))));
    b.textContent = format(m * Math.max(0, Math.floor(1 + 1 / 32 * Math.pow(player.talismanLevels[i-1] - 30, 3))));
    c.textContent = format(m * Math.max(0, Math.floor(1 + 1 / 384 * Math.pow(player.talismanLevels[i-1] - 60, 3))));
    d.textContent = format(m * Math.max(0, Math.floor(1 + 1 / 500 * Math.pow(player.talismanLevels[i-1] - 90, 3))));
    e.textContent = format(m * Math.max(0, Math.floor(1 + 1 / 375 * Math.pow(player.talismanLevels[i-1] - 120, 3))));
    f.textContent = format(m * Math.max(0, Math.floor(1 + 1 / 192 * Math.pow(player.talismanLevels[i-1] - 150, 3))));
    g.textContent = format(m * Math.max(0, Math.floor(1 + 1 / 1280 * Math.pow(player.talismanLevels[i-1] - 150, 3))));
}

export const showEnhanceTalismanPrices = (i: number) => {
    document.getElementById("talismanEffect").style.display = "none"
    document.getElementById("talismanlevelup").style.display = "block"
    document.getElementById("talismanrespec").style.display = "none"
    const a = document.getElementById("talismanShardCost")
    const b = document.getElementById("talismanCommonFragmentCost")
    const c = document.getElementById("talismanUncommonFragmentCost")
    const d = document.getElementById("talismanRareFragmentCost")
    const e = document.getElementById("talismanEpicFragmentCost")
    const f = document.getElementById("talismanLegendaryFragmentCost")
    const g = document.getElementById("talismanMythicalFragmentCost")

    document.getElementById("talismanLevelUpSummary").textContent = "=-=-= Resources Required to ENHANCE =-=-="
    document.getElementById("talismanLevelUpSummary").style.color = "gold"

    const array = [G['commonTalismanEnhanceCost'], G['uncommonTalismanEnchanceCost'], G['rareTalismanEnchanceCost'], G['epicTalismanEnhanceCost'], G['legendaryTalismanEnchanceCost'], G['mythicalTalismanEnchanceCost']]
    const index = player.talismanRarity[i-1];
    const costArray = array[index-1];
    const m = G['talismanLevelCostMultiplier'][i]
    a.textContent = format(m * costArray[1]);
    b.textContent = format(m * costArray[2]);
    c.textContent = format(m * costArray[3]);
    d.textContent = format(m * costArray[4]);
    e.textContent = format(m * costArray[5]);
    f.textContent = format(m * costArray[6]);
    g.textContent = format(m * costArray[7]);
}

export const showRespecInformation = (i: number) => {
    G['talismanRespec'] = i;
    const num = ["One", "Two", "Three", "Four", "Five", "Six", "Seven"]
    document.getElementById("talismanEffect").style.display = "none"
    document.getElementById("talismanlevelup").style.display = "none"
    document.getElementById("talismanrespec").style.display = "block"

    const runeName = ["Speed Rune", "Duplication Rune", "Prism Rune", "Thrift Rune", "SI Rune"]
    const runeModifier = ["Positive", "Positive", "Positive", "Positive"]
    if (i <= 7) {
        for (let k = 1; k <= 5; k++) {
            G['mirrorTalismanStats'][k] = player["talisman" + num[i-1]][k];
        }
        document.getElementById("confirmTalismanRespec").textContent = "Confirm [-100,000 Offerings]"
    }
    if (i === 8) {
        for (let k = 1; k <= 5; k++) {
            G['mirrorTalismanStats'][k] = 1;
        }
        document.getElementById("confirmTalismanRespec").textContent = "Confirm ALL [-400,000 Offerings]"
    }
    for (let j = 1; j <= 5; j++) {
        if (G['mirrorTalismanStats'][j] === 1) {
            document.getElementById("talismanRespecButton" + j).style.border = "2px solid limegreen";
            runeModifier[j-1] = "Positive"
        } else if (G['mirrorTalismanStats'][j] === -1) {
            document.getElementById("talismanRespecButton" + j).style.border = "2px solid crimson";
            runeModifier[j-1] = "Negative"
        }
        document.getElementById("talismanRespecButton" + j).textContent = runeName[j-1] + ": " + runeModifier[j-1]
    }

    document.getElementById("confirmTalismanRespec").style.display = "none"
}

export const changeTalismanModifier = (i: number) => {
    const runeName = [null, "Speed Rune", "Duplication Rune", "Prism Rune", "Thrift Rune", "SI Rune"];
    const el = document.getElementById("talismanRespecButton" + i);
    if (G['mirrorTalismanStats'][i] === 1) {
        G['mirrorTalismanStats'][i] = (-1);
        el.textContent = runeName[i] + ": Negative";
        el.style.border = "2px solid crimson";
    } else {
        G['mirrorTalismanStats'][i] = (1);
        el.textContent = runeName[i] + ": Positive";
        el.style.border = "2px solid limegreen";
    }

    const checkSum = G['mirrorTalismanStats'].reduce(function (a, b) {
        return a + b;
    }, 0);

    if (checkSum === 1) {
        document.getElementById("confirmTalismanRespec").style.display = "block";
    } else {
        document.getElementById("confirmTalismanRespec").style.display = "none";
    }

}

export const respecTalismanConfirm = (i: number) => {
    const num = [null, "One", "Two", "Three", "Four", "Five", "Six", "Seven"]
    if (player.runeshards >= 100000 && i <= 7) {
        for (let j = 1; j <= 5; j++) {
            player["talisman" + num[i]][j] = G['mirrorTalismanStats'][j];
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
                player["talisman" + num[j]][k] = G['mirrorTalismanStats'][k];
            }
        }
        document.getElementById("confirmTalismanRespec").style.display = "none";
    }

    calculateRuneLevels();
}

export const respecTalismanCancel = (i: number) => {
    document.getElementById("talismanrespec").style.display = "none"
    if (i <= 7) {
        document.getElementById("talismanEffect").style.display = "block";
        showTalismanEffect(i);
    }
}

export const updateTalismanAppearance = (i: number) => {
    const el = document.getElementById("talisman" + i)
    const la = document.getElementById("talisman" + i + "level")

    const rarity = player.talismanRarity[i-1];
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

// Attempt to buy a fixed number of levels (number varies based on
// ascension). Returns true if any levels were bought, false otherwise.
export const buyTalismanLevels = (i: number, auto = false): boolean => {
    let max = 1;
    if (player.ascensionCount > 0) {
        max = 30
    }
    let hasPurchased = false;
    for (let j = 1; j <= max; j++) {
        let checkSum = 0;
        let priceMult = G['talismanLevelCostMultiplier'][i]
        if (player.talismanLevels[i-1] >= 120) {
            priceMult *= (player.talismanLevels[i-1] - 90) / 30
        }
        if (player.talismanLevels[i-1] >= 150) {
            priceMult *= (player.talismanLevels[i-1] - 120) / 30
        }
        if (player.talismanLevels[i-1] >= 180) {
            priceMult *= (player.talismanLevels[i-1] - 170) / 10
        }

        if (player.talismanLevels[i-1] < (player.talismanRarity[i-1] * 30 + 6 * CalcECC('ascension', player.challengecompletions[13]) + Math.floor(player.researches[200] / 400))) {
            if (player.talismanShards >= priceMult * Math.max(0, Math.floor(1 + 1 / 8 * Math.pow(player.talismanLevels[i-1], 3)))) {
                checkSum++
            }
            if (player.commonFragments >= priceMult * Math.max(0, Math.floor(1 + 1 / 32 * Math.pow(player.talismanLevels[i-1] - 30, 3)))) {
                checkSum++
            }
            if (player.uncommonFragments >= priceMult * Math.max(0, Math.floor(1 + 1 / 384 * Math.pow(player.talismanLevels[i-1] - 60, 3)))) {
                checkSum++
            }
            if (player.rareFragments >= priceMult * Math.max(0, Math.floor(1 + 1 / 500 * Math.pow(player.talismanLevels[i-1] - 90, 3)))) {
                checkSum++
            }
            if (player.epicFragments >= priceMult * Math.max(0, Math.floor(1 + 1 / 375 * Math.pow(player.talismanLevels[i-1] - 120, 3)))) {
                checkSum++
            }
            if (player.legendaryFragments >= priceMult * Math.max(0, Math.floor(1 + 1 / 192 * Math.pow(player.talismanLevels[i-1] - 150, 3)))) {
                checkSum++
            }
            if (player.mythicalFragments >= priceMult * Math.max(0, Math.floor(1 + 1 / 1280 * Math.pow(player.talismanLevels[i-1] - 150, 3)))) {
                checkSum++
            }
        }

        if (checkSum === 7) {
            player.talismanShards -= priceMult * Math.max(0, Math.floor(1 + 1 / 8 * Math.pow(player.talismanLevels[i-1], 3)))
            player.commonFragments -= priceMult * Math.max(0, Math.floor(1 + 1 / 32 * Math.pow(player.talismanLevels[i-1] - 30, 3)))
            player.uncommonFragments -= priceMult * Math.max(0, Math.floor(1 + 1 / 384 * Math.pow(player.talismanLevels[i-1] - 60, 3)))
            player.rareFragments -= priceMult * Math.max(0, Math.floor(1 + 1 / 500 * Math.pow(player.talismanLevels[i-1] - 90, 3)))
            player.epicFragments -= priceMult * Math.max(0, Math.floor(1 + 1 / 375 * Math.pow(player.talismanLevels[i-1] - 120, 3)))
            player.legendaryFragments -= priceMult * Math.max(0, Math.floor(1 + 1 / 192 * Math.pow(player.talismanLevels[i-1] - 150, 3)))
            player.mythicalFragments -= priceMult * Math.max(0, Math.floor(1 + 1 / 1280 * Math.pow(player.talismanLevels[i-1] - 150, 3)))
            player.talismanLevels[i-1] += 1;
            hasPurchased = true;
        } else {
            break;
        }
    }

    if (!auto && hasPurchased) {
        showTalismanPrices(i);
        // When adding game state recalculations, update the talisman autobuyer in tack() as well
        updateTalismanInventory();
        calculateRuneLevels();
    }

    return hasPurchased;
}

export const buyTalismanEnhance = (i: number, auto = false): boolean => {
    let checkSum = 0;
    if (player.talismanRarity[i-1] < 6) {
        const priceMult = G['talismanLevelCostMultiplier'][i];
        const array = [G['commonTalismanEnhanceCost'], G['uncommonTalismanEnchanceCost'], G['rareTalismanEnchanceCost'], G['epicTalismanEnhanceCost'], G['legendaryTalismanEnchanceCost'], G['mythicalTalismanEnchanceCost']];
        const index = player.talismanRarity[i-1] - 1;
        const costArray = array[index];
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
            player.talismanRarity[i-1] += 1

            // Appearance always needs updating if bought
            updateTalismanAppearance(i);
            if (!auto) {
                showEnhanceTalismanPrices(i);
                // When adding game state recalculations, update the talisman autobuyer in tack() as well
                updateTalismanInventory();
                calculateRuneLevels();
            }

            return true;
        }
    }
    return false;
}
