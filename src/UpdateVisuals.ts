import Decimal from 'break_infinity.js';
import { Globals as G } from './Variables';
import { player, format, formatTimeShort } from './Synergism';
import { CalcECC } from './Challenges';
import { calculateSigmoidExponential, calculateMaxRunes, calculateRuneExpToLevel, calculateSummationLinear, calculateRecycleMultiplier, calculateCorruptionPoints, CalcCorruptionStuff, calculateAutomaticObtainium, calculateTimeAcceleration } from './Calculate';
import { displayRuneInformation } from './Runes';
import { showSacrifice } from './Ants';
import { sumContents } from './Utility';
import { getShopCosts } from './Shop';

export const visualUpdateBuildings = () => {
    if (G['currentTab'] !== "buildings") {
        console.log("buildings update happened not in buildings")
        return;
    }
    
    //When you're in Building --> Coin, update these.
    if (G['buildingSubTab'] === "coin") {
        // For the display of Coin Buildings
        const upper = ['produceFirst', 'produceSecond', 'produceThird', 'produceFourth', 'produceFifth'] as const;
        const names = [null, 'Workers', 'Investments', 'Printers', 'Coin Mints', 'Alchemies']

        // Placeholder is of form "produce+upper[i]", which feeds info place in the form of window function
        let percentage = new Decimal()

        let totalProductionDivisor = new Decimal(G['produceTotal']);
        if (totalProductionDivisor.equals(0)) {
            totalProductionDivisor = new Decimal(1);
        }

        for (let i = 1; i <= 5; i++) {
            const place = G[upper[i - 1]];
            document.getElementById("buildtext" + (2 * i - 1)).textContent = names[i] + ": " + format(player[G['ordinals'][i - 1] + 'OwnedCoin'], 0, true) + " [+" + format(player[G['ordinals'][i - 1] + 'GeneratedCoin']) + "]"
            document.getElementById("buycoin" + i).textContent = "Cost: " + format(player[G['ordinals'][i - 1] + 'CostCoin']) + " coins."
            percentage = percentage.fromMantissaExponent(place.mantissa / totalProductionDivisor.mantissa, place.exponent - totalProductionDivisor.exponent).times(100)
            document.getElementById("buildtext" + (2 * i)).textContent = "Coins/Sec: " + format((place.dividedBy(G['taxdivisor'])).times(40), 2) + " [" + format(percentage, 3) + "%]"
        }

        document.getElementById("buildtext11").textContent = "Accelerators: " + format(player.acceleratorBought, 0, true) + " [+" + format(G['freeAccelerator'], 0, true) + "]"
        document.getElementById("buildtext12").textContent = "Acceleration Power: " + ((G['acceleratorPower'] - 1) * (100)).toPrecision(4) + "% || Acceleration Multiplier: " + format(G['acceleratorEffect'], 2) + "x"
        document.getElementById("buildtext13").textContent = "Multipliers: " + format(player.multiplierBought, 0, true) + " [+" + format(G['freeMultiplier'], 0, true) + "]"
        document.getElementById("buildtext14").textContent = "Multiplier Power: " + G['multiplierPower'].toPrecision(4) + "x || Multiplier: " + format(G['multiplierEffect'], 2) + "x"
        document.getElementById("buildtext15").textContent = "Accelerator Boost: " + format(player.acceleratorBoostBought, 0, true) + " [+" + format(G['freeAcceleratorBoost'], 0, false) + "]"
        document.getElementById("buildtext16").textContent = "Reset Diamonds and Prestige Upgrades, but add " + (G['tuSevenMulti'] * (1 + player.researches[16] / 50) * (1 + CalcECC('transcend', player.challengecompletions[2]) / 100)).toPrecision(4) + "% Acceleration Power and 5 free Accelerators."
        document.getElementById("buyaccelerator").textContent = "Cost: " + format(player.acceleratorCost) + " coins."
        document.getElementById("buymultiplier").textContent = "Cost: " + format(player.multiplierCost) + " coins."
        document.getElementById("buyacceleratorboost").textContent = "Cost: " + format(player.acceleratorBoostCost) + " Diamonds."

        // update the tax text
        let warning = "";
        if (player.reincarnationCount > 0.5) {
            warning = `Your tax also caps your Coin gain at ${format(Decimal.pow(10, G['maxexponent'] - Decimal.log(G['taxdivisorcheck'], 10)))}/s.`
        }
        document.getElementById("taxinfo").textContent =
            `Due to your excessive wealth, coin production is divided by ${format(G['taxdivisor'], 2)} to pay taxes! ${warning}`
    }

    if (G['buildingSubTab'] === "diamond") {
        // For the display of Diamond Buildings
        const upper = ['produceFirstDiamonds', 'produceSecondDiamonds', 'produceThirdDiamonds', 'produceFourthDiamonds', 'produceFifthDiamonds'] as const;
        const names = [null, 'Refineries', 'Coal Plants', 'Coal Rigs', 'Pickaxes', 'Pandoras Boxes']
        const perSecNames = [null, "Crystal/sec", "Ref./sec", "Plants/sec", "Rigs/sec", "Pickaxes/sec"]

        document.getElementById("prestigeshardinfo").textContent = "You have " + format(player.prestigeShards, 2) + " Crystals, multiplying Coin production by " + format(G['prestigeMultiplier'], 2) + "x."

        for (let i = 1; i <= 5; i++) {
            const place = G[upper[i-1]];

            document.getElementById("prestigetext" + (2 * i - 1)).textContent = names[i] + ": " + format(player[G['ordinals'][i - 1] + 'OwnedDiamonds'], 0, true) + " [+" + format(player[G['ordinals'][i - 1] + 'GeneratedDiamonds'], 2) + "]"
            document.getElementById("prestigetext" + (2 * i)).textContent = perSecNames[i] + ": " + format((place).times(40), 2)
            document.getElementById("buydiamond" + i).textContent = "Cost: " + format(player[G['ordinals'][i - 1] + 'CostDiamonds'], 2) + " Diamonds"
        }

        if (player.resettoggle1 === 1 || player.resettoggle1 === 0) {
            const p = Decimal.pow(10, Decimal.log(G['prestigePointGain'].add(1), 10) - Decimal.log(player.prestigePoints.sub(1), 10))
            document.getElementById("autoprestige").textContent = "Prestige when your Diamonds can increase by a factor " + format(Decimal.pow(10, player.prestigeamount)) + " [Toggle number above]. Current Multiplier: " + format(p) + "."
        }
        if (player.resettoggle1 === 2) {
            document.getElementById("autoprestige").textContent = "Prestige when the autotimer is at least " + (player.prestigeamount) + " real-life seconds. [Toggle number above]. Current timer: " + format(G['autoResetTimers'].prestige, 1) + "s."
        }
    }

    if (G['buildingSubTab'] === "mythos") {
        // For the display of Mythos Buildings
        const upper = ['produceFirstMythos', 'produceSecondMythos', 'produceThirdMythos', 'produceFourthMythos', 'produceFifthMythos'] as const;
        const names = [null, 'Augments', 'Enchantments', 'Wizards', 'Oracles', 'Grandmasters']
        const perSecNames = [null, "Shards/sec", "Augments/sec", "Enchantments/sec", "Wizards/sec", "Oracles/sec"]

        document.getElementById("transcendshardinfo").textContent = "You have " + format(player.transcendShards, 2) + " Mythos Shards, providing " + format(G['totalMultiplierBoost'], 0, true) + " Multiplier Power boosts."

        for (let i = 1; i <= 5; i++) {
            const place = G[upper[i-1]];

            document.getElementById("transcendtext" + (2 * i - 1)).textContent = names[i] + ": " + format(player[G['ordinals'][i - 1] + 'OwnedMythos'], 0, true) + " [+" + format(player[G['ordinals'][i - 1] + 'GeneratedMythos'], 2) + "]"
            document.getElementById("transcendtext" + (2 * i)).textContent = perSecNames[i] + ": " + format((place).times(40), 2)
            document.getElementById("buymythos" + i).textContent = "Cost: " + format(player[G['ordinals'][i - 1] + 'CostMythos'], 2) + " Mythos"
        }

        if (player.resettoggle2 === 1 || player.resettoggle2 === 0) {
            document.getElementById("autotranscend").textContent = "Prestige when your Mythos can increase by a factor " + format(Decimal.pow(10, player.transcendamount)) + " [Toggle number above]. Current Multiplier: " + format(Decimal.pow(10, Decimal.log(G['transcendPointGain'].add(1), 10) - Decimal.log(player.transcendPoints.add(1), 10)), 2) + "."
        }
        if (player.resettoggle2 === 2) {
            document.getElementById("autotranscend").textContent = "Transcend when the autotimer is at least " + (player.transcendamount) + " real-life seconds. [Toggle number above]. Current timer: " + format(G['autoResetTimers'].transcension, 1) + "s."
        }
    }

    if (G['buildingSubTab'] === "particle") {

        // For the display of Particle Buildings
        const upper = ['FirstParticles', 'SecondParticles', 'ThirdParticles', 'FourthParticles', 'FifthParticles'] as const;
        const names = ['Protons', 'Elements', 'Pulsars', 'Quasars', 'Galactic Nuclei'];
        const perSecNames = ["Atoms/sec", "Protons/sec", "Elements/sec", "Pulsars/sec", "Quasars/sec"]

        for (let i = 1; i <= 5; i++) {
            const place = G[`produce${upper[i-1]}` as const];

            document.getElementById(`reincarnationtext${i}`).textContent = 
                `${names[i-1]}: ${format(player[`${G['ordinals'][i - 1]}OwnedParticles`], 0, true)} [+${format(player[`${G['ordinals'][i - 1]}GeneratedParticles`], 2)}]`;
            document.getElementById(`reincarnationtext${i+5}`).textContent = 
                `${perSecNames[i-1]}: ${format((place).times(40), 2)}`;
            document.getElementById(`buyparticles${i}`).textContent = 
                `Cost: ${format(player[`${G['ordinals'][i - 1]}CostParticles`], 2)} Particles`;
        }

        document.getElementById("reincarnationshardinfo").textContent = "You have " + format(player.reincarnationShards, 2) + " Atoms, providing " + G['buildingPower'].toPrecision(4) + " Building Power. Multiplier to Coin Production: " + format(G['reincarnationMultiplier'])
        document.getElementById("reincarnationCrystalInfo").textContent = "Thanks to Research 2x14, you also multiply Crystal production by " + format(Decimal.pow(G['reincarnationMultiplier'], 1 / 50), 3, false)
        document.getElementById("reincarnationMythosInfo").textContent = "Thanks to Research 2x15, you also multiply Mythos Shard production by " + format(Decimal.pow(G['reincarnationMultiplier'], 1 / 250), 3, false)

        if (player.resettoggle3 === 1 || player.resettoggle3 === 0) {
            document.getElementById("autoreincarnate").textContent = "Reincarnate when your Particles can increase by a factor " + format(Decimal.pow(10, player.reincarnationamount)) + " [Toggle number above]. Current Multiplier: " + format(Decimal.pow(10, Decimal.log(G['reincarnationPointGain'].add(1), 10) - Decimal.log(player.reincarnationPoints.add(1), 10)), 2) + "."
        }
        if (player.resettoggle3 === 2) {
            document.getElementById("autoreincarnate").textContent = "Reincarnate when the autotimer is at least " + (player.reincarnationamount) + " real-life seconds. [Toggle number above]. Current timer: " + format(G['autoResetTimers'].reincarnation, 1) + "s."
        }
    }

    if (G['buildingSubTab'] === "tesseract") {
        const names = [null, 'Dot', 'Vector', 'Three-Space', 'Bent Time', 'Hilbert Space']
        const perSecNames = [null, '+Constant/sec', 'Dot/sec', 'Vector/sec', 'Three-Space/sec', 'Bent Time/sec']
        for (let i = 1; i <= 5; i++) {
            document.getElementById("ascendText" + i).textContent = names[i] + ": " + format(player['ascendBuilding' + i]['owned'], 0, true) + " [+" + format(player['ascendBuilding' + i]['generated'], 2) + "]"
            document.getElementById("ascendText" + (5 + i)).textContent = 
                perSecNames[i] + ": " + format(((G['ascendBuildingProduction'] as { [key: string]: Decimal })[G['ordinals'][i - 1]]), 2)
            document.getElementById("buyTesseracts" + i).textContent = "Cost: " + format(player['ascendBuilding' + i]['cost'], 0) + " Tesseracts"
        }

        document.getElementById("tesseractInfo").textContent = "You have " + format(player.wowTesseracts) + " Wow! Tesseracts. Gain more by beating Challenge 10 on each Ascension."
        document.getElementById("ascendShardInfo").textContent = "You have a mathematical constant of " + format(player.ascendShards, 2) + ". Taxes are divided by " + format(Math.pow(Decimal.log(player.ascendShards.add(1), 10) + 1, 1 + .2 / 60 * player.challengecompletions[10] * player.upgrades[125] + 0.1 * player.platonicUpgrades[5] + 0.2 * player.platonicUpgrades[10] + 0.5 * player.platonicUpgrades[15] + (G['platonicBonusMultiplier'][5] - 1)), 4, true) + "."
        document.getElementById("autotessbuyeramount").textContent = "Auto buyer will save at least " + format(player.tesseractAutoBuyerAmount) + " tesseracts. [Enter number above]."
    }
}

export const visualUpdateUpgrades = () => {
    if (G['currentTab'] !== "upgrades")
        return

}

export const visualUpdateAchievements = () => {
    if (G['currentTab'] !== "achievements")
        return

}

export const visualUpdateRunes = () => {
    if (G['currentTab'] !== "runes")
        return
    if (G['runescreen'] === "runes") { //Placeholder and place work similarly to buildings, except for the specific Talismans.

        const talismans = [
            'rune1Talisman',
            'rune2Talisman',
            'rune3Talisman',
            'rune4Talisman',
            'rune5Talisman'
        ] as const;

        document.getElementById("offeringCount").textContent = "You have " + format(player.runeshards, 0, true) + " Offerings."

        for (let i = 1; i <= 5; i++) { //First one updates level, second one updates TNL, third updates orange bonus levels
            const place = G[talismans[i-1]];

            document.getElementById('rune' + i + 'level').childNodes[0].textContent = "Level: " + format(player.runelevels[i - 1]) + "/" + format(calculateMaxRunes(i))
            document.getElementById('rune' + i + 'exp').textContent = "+1 in " + format(calculateRuneExpToLevel(i - 1) - player.runeexp[i - 1], 2) + " EXP"
            document.getElementById('bonusrune' + i).textContent = " [Bonus: " + format(7 * player.constantUpgrades[7] + Math.min(1e7, player.antUpgrades[9-1] + G['bonusant9']) + place) + "]"

            displayRuneInformation(i, false)
        }

        document.getElementById("offeringExperienceValue").textContent = "Gain " + format((1 + Math.min(player.highestchallengecompletions[1], 1) + 1 / 25 * player.highestchallengecompletions[1] + 0.6 * player.researches[22] + 0.3 * player.researches[23] + 3 / 25 * player.upgrades[66] + 2 * player.upgrades[61]) * calculateRecycleMultiplier(), 2, true) + "* EXP per offering sacrificed."
        document.getElementById("offeringRecycleInfo").textContent = "You have " + format((5 * player.achievements[80] + 5 * player.achievements[87] + 5 * player.achievements[94] + 5 * player.achievements[101] + 5 * player.achievements[108] + 5 * player.achievements[115] + 7.5 * player.achievements[122] + 7.5 * player.achievements[129] + 5 * player.upgrades[61] + Math.min(25, G['rune4level'] / 16) + 0.5 * player.cubeUpgrades[2]), 2, true) + "% chance of recycling your offerings. This multiplies EXP gain by " + format(calculateRecycleMultiplier(), 2, true) + "!"
    }

    if (G['runescreen'] === "talismans") {
        for (let i = 1; i <= 7; i++) {
            document.getElementById('talisman' + i + 'level').textContent = "Level " + player.talismanLevels[i-1] + "/" + (30 * player.talismanRarity[i-1] + 6 * CalcECC('ascension', player.challengecompletions[13]) + Math.floor(player.researches[200] / 400))
        }
    }

    if (G['runescreen'] === "blessings") {
        const blessingMultiplierArray = [0, 8, 10, 6.66, 2, 1]
        let t = 0;
        for (let i = 1; i <= 5; i++) {
            document.getElementById(`runeBlessingLevel${i}Value`).textContent = format(player.runeBlessingLevels[i], 0, true)
            document.getElementById(`runeBlessingPower${i}Value1`).textContent = format(G['runeBlessings'][i])
            const levelsPurchasable = calculateSummationLinear(player.runeBlessingLevels[i], G['blessingBaseCost'], player.runeshards, player.runeBlessingBuyAmount)[0] - player.runeBlessingLevels[i]
            levelsPurchasable > 0
                ? document.getElementById(`runeBlessingPurchase${i}`).classList.add("runeButtonsAvailable")
                : document.getElementById(`runeBlessingPurchase${i}`).classList.remove("runeButtonsAvailable")
            document.getElementById(`runeBlessingPurchaseAmount${i}`).textContent = format(Math.max(1, levelsPurchasable))
            document.getElementById(`runeBlessingPurchaseCost${i}`).textContent = format(Math.max(G['blessingBaseCost'] * (1 + player.runeBlessingLevels[i]), calculateSummationLinear(player.runeBlessingLevels[i], G['blessingBaseCost'], player.runeshards, player.runeBlessingBuyAmount)[1]))
            if (i === 5) {
                t = 1
            }
            document.getElementById(`runeBlessingPower${i}Value2`).textContent = format(1 - t + blessingMultiplierArray[i] * G['effectiveRuneBlessingPower'][i], 4, true)
        }
    }

    if (G['runescreen'] === "spirits") {
        const spiritMultiplierArray = [0, 1, 1, 20, 1, 100]
        const subtract = [0, 0, 0, 1, 0, 0]
        for (let i = 1; i <= 5; i++) {
            spiritMultiplierArray[i] *= (calculateCorruptionPoints() / 400)
            document.getElementById(`runeSpiritLevel${i}Value`).textContent = format(player.runeSpiritLevels[i], 0, true)
            document.getElementById(`runeSpiritPower${i}Value1`).textContent = format(G['runeSpirits'][i])
            const levelsPurchasable = calculateSummationLinear(player.runeSpiritLevels[i], G['spiritBaseCost'], player.runeshards, player.runeSpiritBuyAmount)[0] - player.runeSpiritLevels[i]
            levelsPurchasable > 0
                ? document.getElementById(`runeSpiritPurchase${i}`).classList.add("runeButtonsAvailable")
                : document.getElementById(`runeSpiritPurchase${i}`).classList.remove("runeButtonsAvailable")
            document.getElementById(`runeSpiritPurchaseAmount${i}`).textContent = format(Math.max(1, levelsPurchasable))
            document.getElementById(`runeSpiritPurchaseCost${i}`).textContent = format(Math.max(G['spiritBaseCost'] * (1 + player.runeSpiritLevels[i]), calculateSummationLinear(player.runeSpiritLevels[i], G['spiritBaseCost'], player.runeshards, player.runeSpiritBuyAmount)[1]))
            document.getElementById(`runeSpiritPower${i}Value2`).textContent = format(1 - subtract[i] + spiritMultiplierArray[i] * G['effectiveRuneSpiritPower'][i], 4, true)
        }
    }
}

export const visualUpdateChallenges = () => {
    if (G['currentTab'] !== "challenges")
        return
    if (player.researches[150] > 0) {
        document.getElementById("autoIncrementerAmount").textContent = format(G['autoChallengeTimerIncrement'], 2) + "s"
    }
}

export const visualUpdateResearch = () => {
    if (G['currentTab'] !== "researches")
        return

    if (player.researches[61] > 0) {
        document.getElementById("automaticobtainium").textContent = "Thanks to researches you automatically gain " + format(calculateAutomaticObtainium() * calculateTimeAcceleration(), 3, true) + " Obtainium per real life second."
    }
}

export const visualUpdateAnts = () => {
    if (G['currentTab'] !== "ants")
        return
    document.getElementById("crumbcount").textContent = "You have " + format(player.antPoints, 2) + " Galactic Crumbs [" + format(G['antOneProduce'], 2) + "/s], providing a " + format(Decimal.pow(Decimal.max(1, player.antPoints), 100000 + calculateSigmoidExponential(49900000, (player.antUpgrades[2-1] + G['bonusant2']) / 5000 * 500 / 499))) + "x Coin Multiplier."
    const mode = player.autoAntSacrificeMode === 2 ? "Real-time" : "In-game time";
    const timer = player.autoAntSacrificeMode === 2 ? player.antSacrificeTimerReal : player.antSacrificeTimer;
    document.getElementById("autoAntSacrifice").textContent = `Sacrifice when the timer is at least ${player.autoAntSacTimer} seconds (${mode}), Currently: ${format(timer)}`
    if (player.achievements[173] === 1) {
        document.getElementById("antSacrificeTimer").textContent = formatTimeShort(player.antSacrificeTimer);
        showSacrifice();
    }
}

export const visualUpdateCubes = () => {
    if (G['currentTab'] !== "cubes")
        return
    document.getElementById("cubeToQuarkTimerValue").textContent = format(Math.floor(player.dayTimer / 3600), 0) + " Hours " + format(Math.floor(player.dayTimer / 60 % 60), 0) + " Mins " + format(Math.floor(player.dayTimer % 60), 0) + " Secs "

    const prefixes = ['cube', 'tesseract', 'hypercube'] as const;
    const power = [4, 3, 2]
    const multipliers = [10, 10, 5]
    for (let i = 0; i <= 2; i++) {
        document.getElementById(prefixes[i] + 'QuarksTodayValue').textContent = format(player[prefixes[i] + 'QuarkDaily']) + "/" + format(25 + 75 * player.shopUpgrades[`${prefixes[i]}ToQuark` as const]);
        document.getElementById(prefixes[i] + 'QuarksOpenTodayValue').textContent = format(player[prefixes[i] + 'OpenedDaily'], 0, true);
        document.getElementById(prefixes[i] + 'QuarksOpenRequirementValue').textContent = format(Math.max(0, multipliers[i] * Math.pow(
            Math.min(25 + 75 * +player.shopUpgrades[`${prefixes[i]}ToQuark` as const], 
            1 + player[prefixes[i] + 'QuarkDaily']), power[i]) - player[prefixes[i] + 'OpenedDaily']
        ), 0, true);
    }

    let accuracy;
    switch (player.subtabNumber) {
        case 0: {
            document.getElementById("cubeQuantity").textContent = format(player.wowCubes, 0, true)
            const cubeArray = [null, player.cubeBlessings.accelerator, player.cubeBlessings.multiplier, player.cubeBlessings.offering, player.cubeBlessings.runeExp, player.cubeBlessings.obtainium, player.cubeBlessings.antSpeed, player.cubeBlessings.antSacrifice, player.cubeBlessings.antELO, player.cubeBlessings.talismanBonus, player.cubeBlessings.globalSpeed]

            accuracy = [null, 2, 2, 2, 2, 2, 2, 2, 1, 4, 3]
            for (let i = 1; i <= 10; i++) {
                let augmentAccuracy = 0;
                if (cubeArray[i] >= 1000 && i !== 6) {
                    augmentAccuracy += 2;
                }
                document.getElementById(`cubeBlessing${i}Amount`).textContent = `x${format(cubeArray[i], 0, true)}`
                document.getElementById(`cubeBlessing${i}Effect`).textContent = `+${format(100 * (G['cubeBonusMultiplier'][i] - 1), accuracy[i] + augmentAccuracy, true)}%`
                if (i === 1 || i === 8 || i === 9) {
                    document.getElementById(`cubeBlessing${i}Effect`).textContent = `+${format(G['cubeBonusMultiplier'][i] - 1, accuracy[i] + augmentAccuracy, true)}`
                }
            }
            document.getElementById("cubeBlessingTotalAmount").textContent = format(sumContents(cubeArray), 0, true);
            break;
        }
        case 1: {
            document.getElementById("tesseractQuantity").textContent = format(player.wowTesseracts, 0, true)
            const tesseractArray = [null, player.tesseractBlessings.accelerator, player.tesseractBlessings.multiplier, player.tesseractBlessings.offering, player.tesseractBlessings.runeExp, player.tesseractBlessings.obtainium, player.tesseractBlessings.antSpeed, player.tesseractBlessings.antSacrifice, player.tesseractBlessings.antELO, player.tesseractBlessings.talismanBonus, player.tesseractBlessings.globalSpeed]
            accuracy = [null, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
            for (let i = 1; i <= 10; i++) {
                let augmentAccuracy = 0;
                if (tesseractArray[i] >= 1000 && i !== 6) {
                    augmentAccuracy += 2;
                }
                document.getElementById(`tesseractBlessing${i}Amount`).textContent = `x${format(tesseractArray[i], 0, true)}`
                document.getElementById(`tesseractBlessing${i}Effect`).textContent = `+${format(100 * (G['tesseractBonusMultiplier'][i] - 1), accuracy[i] + augmentAccuracy, true)}%`
            }
            document.getElementById("tesseractBlessingTotalAmount").textContent = format(sumContents(tesseractArray), 0, true);
            break;
        }
        case 2: {
            document.getElementById("hypercubeQuantity").textContent = format(player.wowHypercubes, 0, true)
            const hypercubeArray = [null, player.hypercubeBlessings.accelerator, player.hypercubeBlessings.multiplier, player.hypercubeBlessings.offering, player.hypercubeBlessings.runeExp, player.hypercubeBlessings.obtainium, player.hypercubeBlessings.antSpeed, player.hypercubeBlessings.antSacrifice, player.hypercubeBlessings.antELO, player.hypercubeBlessings.talismanBonus, player.hypercubeBlessings.globalSpeed]
            accuracy = [null, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
            for (let i = 1; i <= 10; i++) {
                let augmentAccuracy = 0;
                if (hypercubeArray[i] >= 1000) {
                    augmentAccuracy += 2;
                }
                document.getElementById(`hypercubeBlessing${i}Amount`).textContent = `x${format(hypercubeArray[i], 0, true)}`
                document.getElementById(`hypercubeBlessing${i}Effect`).textContent = `+${format(100 * (G['hypercubeBonusMultiplier'][i] - 1), accuracy[i] + augmentAccuracy, true)}%`
            }
            document.getElementById("hypercubeBlessingTotalAmount").textContent = format(sumContents(hypercubeArray), 0, true);
            break;
        }
        case 3: {
            document.getElementById("platonicQuantity").textContent = format(player.wowPlatonicCubes, 0, true)
            const platonicArray = [player.platonicBlessings.cubes, player.platonicBlessings.tesseracts, player.platonicBlessings.hypercubes, player.platonicBlessings.platonics, player.platonicBlessings.hypercubeBonus, player.platonicBlessings.taxes, player.platonicBlessings.scoreBonus, player.platonicBlessings.globalSpeed]
            const DRThreshold = [4e6, 4e6, 4e6, 8e4, 1e4, 1e4, 1e4, 1e4]
            accuracy = [5, 5, 5, 5, 2, 3, 3, 2]
            for (let i = 0; i < platonicArray.length; i++) {
                let augmentAccuracy = 0;
                if (platonicArray[i] >= DRThreshold[i]) {
                    augmentAccuracy += 1;
                }
                document.getElementById(`platonicBlessing${i + 1}Amount`).textContent = `x${format(platonicArray[i], 0, true)}`
                document.getElementById(`platonicBlessing${i + 1}Effect`).textContent = `+${format(100 * (G['platonicBonusMultiplier'][i] - 1), accuracy[i] + augmentAccuracy, true)}%`
            }
            document.getElementById("platonicBlessingTotalAmount").textContent = format(sumContents(platonicArray), 0, true);
            break;
        }
        case 4:
            document.getElementById("cubeAmount2").textContent = `You have ${format(player.wowCubes, 0, true)} Wow! Cubes =)`
            break;
        case 5:
            break;
        default:
            // console.log(`player.subtabNumber (${player.subtabNumber}) was outside of the allowed range (${subTabsInMainTab(8).subTabList.length}) for the cube tab`);
            break;
    }
}

export const visualUpdateCorruptions = () => {
    if (G['currentTab'] !== "traits")
        return

    document.getElementById("autoAscendMetric").textContent = format(player.autoAscendThreshold, 0, true)
    const metaData = CalcCorruptionStuff();

    document.getElementById("corruptionBankValue").textContent = format(metaData[0])
    document.getElementById("corruptionScoreValue").textContent = format(metaData[1], 0, true)
    document.getElementById("corruptionMultiplierValue").textContent = format(metaData[2], 1, true)
    document.getElementById("corruptionTotalScore").textContent = format(metaData[3], 0, true)
    document.getElementById("corruptionCubesValue").textContent = format(metaData[4], 0, true)
    document.getElementById("corruptionTesseractsValue").textContent = format(metaData[5])
    document.getElementById("corruptionHypercubesValue").textContent = format(metaData[6])
    document.getElementById("corruptionPlatonicCubesValue").textContent = format(metaData[7])
    document.getElementById("corruptionAntExponentValue").textContent = format((1 - 0.9 / 90 * sumContents(player.usedCorruptions)) * G['extinctionMultiplier'][player.usedCorruptions[7]], 3)
    document.getElementById("corruptionSpiritBonusValue").textContent = format(calculateCorruptionPoints()/400,2,true)
}

export const visualUpdateSettings = () => {
    if (G['currentTab'] !== "settings")
        return
    //I was unable to clean this up in a way that didn't somehow make it less clean, sorry.
    document.getElementById("prestigeCountStatistic").childNodes[1].textContent = format(player.prestigeCount, 0, true)
    document.getElementById("transcensionCountStatistic").childNodes[1].textContent = format(player.transcendCount, 0, true)
    document.getElementById("reincarnationCountStatistic").childNodes[1].textContent = format(player.reincarnationCount, 0, true)
    document.getElementById("fastestPrestigeStatistic").childNodes[1].textContent = format(1000 * player.fastestprestige) + "ms"
    document.getElementById("fastestTranscensionStatistic").childNodes[1].textContent = format(1000 * player.fastesttranscend) + "ms"
    document.getElementById("fastestReincarnationStatistic").childNodes[1].textContent = format(1000 * player.fastestreincarnate) + "ms"
    document.getElementById("mostOfferingStatistic").childNodes[1].textContent = format(player.maxofferings)
    document.getElementById("mostObtainiumStatistic").childNodes[1].textContent = format(player.maxobtainium)
    document.getElementById("mostObtainiumPerSecondStatistic").childNodes[1].textContent = format(player.maxobtainiumpersecond, 2, true)
    document.getElementById("runeSumStatistic").childNodes[1].textContent = format(G['runeSum'])
    document.getElementById("obtainiumPerSecondStatistic").childNodes[1].textContent = format(player.obtainiumpersecond, 2, true)
    document.getElementById("ascensionCountStatistic").childNodes[1].textContent = format(player.ascensionCount, 0, true)

    document.getElementById("saveString").textContent =
        `Currently: ${player.saveString.replace("$VERSION$", "v" + player.version)}`;

    const onExportQuarks = (Math.floor(player.quarkstimer / 3600) * (1 + player.researches[99] + player.researches[100] + G['talisman7Quarks'] + player.researches[125] + player.researches[180] + player.researches[195]));
    const maxExportQuarks = ((25 * (1 + player.researches[195] / 2)) * (1 + player.researches[99] + player.researches[100] + G['talisman7Quarks'] + player.researches[125] + player.researches[180] + player.researches[195]));

    document.getElementById("quarktimerdisplay").textContent = format((3600 - (player.quarkstimer % 3600.00001)), 2) + "s until +" + (1 + player.researches[99] + player.researches[100] + G['talisman7Quarks'] + player.researches[125] + player.researches[180] + player.researches[195]) + " export Quark"
    document.getElementById("quarktimeramount").textContent = "Quarks on export: "
        + onExportQuarks
        + " [Max "
        + format(maxExportQuarks)
        + "]"

    if (onExportQuarks === maxExportQuarks) {
        const settingsTab = document.getElementById('settingstab');
        settingsTab.style.backgroundColor = 'orange';
        settingsTab.style.border = '1px solid gold';
        settingsTab.setAttribute('full', '1');
    }
}

export const visualUpdateShop = () => {
    if (G['currentTab'] !== "shop")
        return
    document.getElementById("quarkamount").textContent = "You have " + format(player.worlds) + " Quarks!"
    document.getElementById("offeringpotionowned").textContent = "Own: " + format(player.shopUpgrades.offeringPotion)
    document.getElementById("obtainiumpotionowned").textContent = "Own: " + format(player.shopUpgrades.obtainiumPotion)
    document.getElementById("offeringtimerlevel").textContent = "Level: " + player.shopUpgrades.offeringEX + "/100"
    document.getElementById("obtainiumtimerlevel").textContent = "Level: " + player.shopUpgrades.obtainiumEX + "/100"
    document.getElementById("offeringautolevel").textContent = "Level: " + player.shopUpgrades.offeringAuto + "/100"
    document.getElementById("obtainiumautolevel").textContent = "Level: " + player.shopUpgrades.obtainiumAuto + "/100"
    document.getElementById("instantchallenge").textContent = player.shopUpgrades.instantChallenge > 0 ? "Bought" : "Not Bought"
    document.getElementById("antspeed").textContent = "Level: " + player.shopUpgrades.antSpeed + "/100"
    document.getElementById("cashgrab").textContent = "Level: " + player.shopUpgrades.cashGrab + "/100"
    document.getElementById("shoptalisman").textContent = player.shopUpgrades.shopTalisman > 0 ? "Bought" : "Not Bought"
    document.getElementById("challengeUpgradeLevel").textContent = "Level: " + player.shopUpgrades.challengeExtension + "/5"
    document.getElementById("challenge10TomeLevel").textContent = "Level: " + player.shopUpgrades.challengeTome + "/15"
    document.getElementById("seasonPassLevel").textContent = "Level: " + player.shopUpgrades.seasonPass + "/100"
    document.getElementById("cubeToQuark").textContent = player.shopUpgrades.cubeToQuark ? "Bought" : "Not Bought"
    document.getElementById("tesseractToQuark").textContent = player.shopUpgrades.tesseractToQuark ? "Bought" : "Not Bought"
    document.getElementById("hypercubeToQuark").textContent = player.shopUpgrades.hypercubeToQuark ? "Bought" : "Not Bought"

    player.shopUpgrades.offeringEX === 100 ?
        document.getElementById("offeringtimerbutton").textContent = "Maxed!" :
        document.getElementById("offeringtimerbutton").textContent = "Upgrade for " + format(getShopCosts('offeringEX')) + " Quarks";

    player.shopUpgrades.offeringAuto === 100 ?
        document.getElementById("offeringautobutton").textContent = "Maxed!" :
        document.getElementById("offeringautobutton").textContent = "Upgrade for " + format(getShopCosts('offeringAuto')) + " Quarks"

    player.shopUpgrades.obtainiumEX === 100 ?
        document.getElementById("obtainiumtimerbutton").textContent = "Maxed!" :
        document.getElementById("obtainiumtimerbutton").textContent = "Upgrade for " + format(getShopCosts('obtainiumEX')) + " Quarks"

    player.shopUpgrades.obtainiumAuto === 100 ?
        document.getElementById("obtainiumautobutton").textContent = "Maxed!" :
        document.getElementById("obtainiumautobutton").textContent = "Upgrade for " + format(getShopCosts('obtainiumAuto')) + " Quarks";

    player.shopUpgrades.instantChallenge > 0 ?
        (document.getElementById("instantchallengebutton").textContent = "Bought!") :
        document.getElementById("instantchallengebutton").textContent = "Buy for " + format(getShopCosts('instantChallenge')) + " Quarks";

    player.shopUpgrades.antSpeed === 100 ?
        document.getElementById("antspeedbutton").textContent = "Maxed!" :
        document.getElementById("antspeedbutton").textContent = "Upgrade for " + format(getShopCosts('antSpeed')) + " Quarks";

    player.shopUpgrades.cashGrab === 100 ?
        document.getElementById("cashgrabbutton").textContent = "Maxed!" :
        document.getElementById("cashgrabbutton").textContent = "Upgrade for " + format(getShopCosts('cashGrab')) + " Quarks";

    player.shopUpgrades.shopTalisman > 0 ?
        (document.getElementById("shoptalismanbutton").textContent = "Bought!") :
        document.getElementById("shoptalismanbutton").textContent = "Buy for " + format(getShopCosts('shopTalisman')) + " Quarks";

    player.shopUpgrades.challengeExtension === 5 ?
        document.getElementById("challengeUpgradeButton").textContent = "Maxed!" :
        document.getElementById("challengeUpgradeButton").textContent = "Buy for " + format(getShopCosts('challengeExtension')) + " Quarks";

    player.shopUpgrades.challengeTome === 15 ?
        document.getElementById("challenge10TomeButton").textContent = "Maxed!" :
        document.getElementById("challenge10TomeButton").textContent = "Buy for " + format(getShopCosts('challengeTome')) + " Quarks";

    player.shopUpgrades.seasonPass === 100 ?
        document.getElementById("seasonPassButton").textContent = "Maxed!" :
        document.getElementById("seasonPassButton").textContent = "Buy for " + format(getShopCosts('seasonPass')) + " Quarks";

    player.shopUpgrades.cubeToQuark > 0 ?
        (document.getElementById("cubeToQuarkButton").textContent = "Maxed!") :
        document.getElementById("cubeToQuarkButton").textContent = "Buy for " + format(getShopCosts('cubeToQuark')) + " Quarks";

    player.shopUpgrades.tesseractToQuark > 0 ?
        (document.getElementById("tesseractToQuarkButton").textContent = "Maxed!") :
        document.getElementById("tesseractToQuarkButton").textContent = "Buy for " + format(getShopCosts('tesseractToQuark')) + " Quarks";

    player.shopUpgrades.hypercubeToQuark > 0 ?
        (document.getElementById("hypercubeToQuarkButton").textContent = "Maxed!") :
        document.getElementById("hypercubeToQuarkButton").textContent = "Buy for " + format(getShopCosts('hypercubeToQuark')) + " Quarks";
}