import Decimal from 'break_infinity.js';
import { Globals as G } from './Variables';
import { player, format, formatTimeShort } from './Synergism';
import { version } from './Config';
import { CalcECC } from './Challenges';
import { calculateSigmoidExponential, calculateMaxRunes, calculateRuneExpToLevel, calculateSummationLinear, calculateRecycleMultiplier, calculateCorruptionPoints, CalcCorruptionStuff, calculateAutomaticObtainium, calculateTimeAcceleration, calcAscensionCount, calculateCubeQuarkMultiplier, calculateSummationNonLinear } from './Calculate';
import { displayRuneInformation } from './Runes';
import { showSacrifice } from './Ants';
import { sumContents } from './Utility';
import { getShopCosts, shopData, shopUpgradeTypes } from './Shop';
import { quarkHandler } from './Quark';
import type { Player, ZeroToFour } from './types/Synergism';
import { hepteractTypeList, hepteractTypes } from './Hepteracts';
import { DOMCacheGetOrSet } from './Cache/DOM';
import { IMultiBuy } from './Cubes';
import { calculateMaxTalismanLevel } from './Talismans';
import { getGoldenQuarkCost } from './singularity';

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
            const ith = G['ordinals'][i - 1 as ZeroToFour];

            DOMCacheGetOrSet("buildtext" + (2 * i - 1)).textContent = names[i] + ": " + format(player[`${ith}OwnedCoin` as const], 0, true) + " [+" + format(player[`${ith}GeneratedCoin` as const]) + "]"
            DOMCacheGetOrSet("buycoin" + i).textContent = "Cost: " + format(player[`${ith}CostCoin` as const]) + " coins."
            percentage = percentage.fromMantissaExponent(place.mantissa / totalProductionDivisor.mantissa, place.exponent - totalProductionDivisor.exponent).times(100)
            DOMCacheGetOrSet("buildtext" + (2 * i)).textContent = "Coins/Sec: " + format((place.dividedBy(G['taxdivisor'])).times(40), 2) + " [" + format(percentage, 3) + "%]"
        }

        DOMCacheGetOrSet("buildtext11").textContent = "Accelerators: " + format(player.acceleratorBought, 0, true) + " [+" + format(G['freeAccelerator'], 0, true) + "]"
        DOMCacheGetOrSet("buildtext12").textContent = "Acceleration Power: " + ((G['acceleratorPower'] - 1) * (100)).toPrecision(4) + "% || Acceleration Multiplier: " + format(G['acceleratorEffect'], 2) + "x"
        DOMCacheGetOrSet("buildtext13").textContent = "Multipliers: " + format(player.multiplierBought, 0, true) + " [+" + format(G['freeMultiplier'], 0, true) + "]"
        DOMCacheGetOrSet("buildtext14").textContent = "Multiplier Power: " + G['multiplierPower'].toPrecision(4) + "x || Multiplier: " + format(G['multiplierEffect'], 2) + "x"
        DOMCacheGetOrSet("buildtext15").textContent = "Accelerator Boost: " + format(player.acceleratorBoostBought, 0, true) + " [+" + format(G['freeAcceleratorBoost'], 0, false) + "]"
        DOMCacheGetOrSet("buildtext16").textContent = "Reset Diamonds and Prestige Upgrades, but add " + (G['tuSevenMulti'] * (1 + player.researches[16] / 50) * (1 + CalcECC('transcend', player.challengecompletions[2]) / 100)).toPrecision(4) + "% Acceleration Power and 5 free Accelerators."
        DOMCacheGetOrSet("buyaccelerator").textContent = "Cost: " + format(player.acceleratorCost) + " coins."
        DOMCacheGetOrSet("buymultiplier").textContent = "Cost: " + format(player.multiplierCost) + " coins."
        DOMCacheGetOrSet("buyacceleratorboost").textContent = "Cost: " + format(player.acceleratorBoostCost) + " Diamonds."

        // update the tax text
        let warning = "";
        if (player.reincarnationCount > 0.5) {
            warning = `Your tax also caps your Coin gain at ${format(Decimal.pow(10, G['maxexponent'] - Decimal.log(G['taxdivisorcheck'], 10)))}/s.`
        }
        DOMCacheGetOrSet("taxinfo").textContent =
            `Due to your excessive wealth, coin production is divided by ${format(G['taxdivisor'], 2)} to pay taxes! ${warning}`
    }

    if (G['buildingSubTab'] === "diamond") {
        // For the display of Diamond Buildings
        const upper = ['produceFirstDiamonds', 'produceSecondDiamonds', 'produceThirdDiamonds', 'produceFourthDiamonds', 'produceFifthDiamonds'] as const;
        const names = [null, 'Refineries', 'Coal Plants', 'Coal Rigs', 'Pickaxes', 'Pandoras Boxes']
        const perSecNames = [null, "Crystal/sec", "Ref./sec", "Plants/sec", "Rigs/sec", "Pickaxes/sec"]

        DOMCacheGetOrSet("prestigeshardinfo").textContent = "You have " + format(player.prestigeShards, 2) + " Crystals, multiplying Coin production by " + format(G['prestigeMultiplier'], 2) + "x."

        for (let i = 1; i <= 5; i++) {
            const place = G[upper[i-1]];
            const ith = G['ordinals'][i - 1 as ZeroToFour];

            DOMCacheGetOrSet("prestigetext" + (2 * i - 1)).textContent = names[i] + ": " + format(player[`${ith}OwnedDiamonds` as const], 0, true) + " [+" + format(player[`${ith}GeneratedDiamonds` as const], 2) + "]"
            DOMCacheGetOrSet("prestigetext" + (2 * i)).textContent = perSecNames[i] + ": " + format((place).times(40), 2)
            DOMCacheGetOrSet("buydiamond" + i).textContent = "Cost: " + format(player[`${ith}CostDiamonds` as const], 2) + " Diamonds"
        }

        if (player.resettoggle1 === 1 || player.resettoggle1 === 0) {
            const p = Decimal.pow(10, Decimal.log(G['prestigePointGain'].add(1), 10) - Decimal.log(player.prestigePoints.sub(1), 10))
            DOMCacheGetOrSet("autoprestige").textContent = "Prestige when your Diamonds can increase by a factor " + format(Decimal.pow(10, player.prestigeamount)) + " [Toggle number above]. Current Multiplier: " + format(p) + "."
        }
        if (player.resettoggle1 === 2) {
            DOMCacheGetOrSet("autoprestige").textContent = "Prestige when the autotimer is at least " + (player.prestigeamount) + " real-life seconds. [Toggle number above]. Current timer: " + format(G['autoResetTimers'].prestige, 1) + "s."
        }
    }

    if (G['buildingSubTab'] === "mythos") {
        // For the display of Mythos Buildings
        const upper = ['produceFirstMythos', 'produceSecondMythos', 'produceThirdMythos', 'produceFourthMythos', 'produceFifthMythos'] as const;
        const names = [null, 'Augments', 'Enchantments', 'Wizards', 'Oracles', 'Grandmasters']
        const perSecNames = [null, "Shards/sec", "Augments/sec", "Enchantments/sec", "Wizards/sec", "Oracles/sec"]

        DOMCacheGetOrSet("transcendshardinfo").textContent = "You have " + format(player.transcendShards, 2) + " Mythos Shards, providing " + format(G['totalMultiplierBoost'], 0, true) + " Multiplier Power boosts."

        for (let i = 1; i <= 5; i++) {
            const place = G[upper[i-1]];
            const ith = G['ordinals'][i - 1 as ZeroToFour];

            DOMCacheGetOrSet("transcendtext" + (2 * i - 1)).textContent = names[i] + ": " + format(player[`${ith}OwnedMythos` as const], 0, true) + " [+" + format(player[`${ith}GeneratedMythos` as const], 2) + "]"
            DOMCacheGetOrSet("transcendtext" + (2 * i)).textContent = perSecNames[i] + ": " + format((place).times(40), 2)
            DOMCacheGetOrSet("buymythos" + i).textContent = "Cost: " + format(player[`${ith}CostMythos` as const], 2) + " Mythos"
        }

        if (player.resettoggle2 === 1 || player.resettoggle2 === 0) {
            DOMCacheGetOrSet("autotranscend").textContent = "Prestige when your Mythos can increase by a factor " + format(Decimal.pow(10, player.transcendamount)) + " [Toggle number above]. Current Multiplier: " + format(Decimal.pow(10, Decimal.log(G['transcendPointGain'].add(1), 10) - Decimal.log(player.transcendPoints.add(1), 10)), 2) + "."
        }
        if (player.resettoggle2 === 2) {
            DOMCacheGetOrSet("autotranscend").textContent = "Transcend when the autotimer is at least " + (player.transcendamount) + " real-life seconds. [Toggle number above]. Current timer: " + format(G['autoResetTimers'].transcension, 1) + "s."
        }
    }

    if (G['buildingSubTab'] === "particle") {

        // For the display of Particle Buildings
        const upper = ['FirstParticles', 'SecondParticles', 'ThirdParticles', 'FourthParticles', 'FifthParticles'] as const;
        const names = ['Protons', 'Elements', 'Pulsars', 'Quasars', 'Galactic Nuclei'];
        const perSecNames = ["Atoms/sec", "Protons/sec", "Elements/sec", "Pulsars/sec", "Quasars/sec"]

        for (let i = 1; i <= 5; i++) {
            const ith = G['ordinals'][i - 1 as ZeroToFour];
            const place = G[`produce${upper[i-1]}` as const];

            DOMCacheGetOrSet(`reincarnationtext${i}`).textContent = 
                `${names[i-1]}: ${format(player[`${ith}OwnedParticles` as const], 0, true)} [+${format(player[`${ith}GeneratedParticles` as const], 2)}]`;
            DOMCacheGetOrSet(`reincarnationtext${i+5}`).textContent = 
                `${perSecNames[i-1]}: ${format((place).times(40), 2)}`;
            DOMCacheGetOrSet(`buyparticles${i}`).textContent = 
                `Cost: ${format(player[`${ith}CostParticles` as const], 2)} Particles`;
        }

        DOMCacheGetOrSet("reincarnationshardinfo").textContent = "You have " + format(player.reincarnationShards, 2) + " Atoms, providing " + G['buildingPower'].toPrecision(4) + " Building Power. Multiplier to Coin Production: " + format(G['reincarnationMultiplier'])
        DOMCacheGetOrSet("reincarnationCrystalInfo").textContent = "Thanks to Research 2x14, you also multiply Crystal production by " + format(Decimal.pow(G['reincarnationMultiplier'], 1 / 50), 3, false)
        DOMCacheGetOrSet("reincarnationMythosInfo").textContent = "Thanks to Research 2x15, you also multiply Mythos Shard production by " + format(Decimal.pow(G['reincarnationMultiplier'], 1 / 250), 3, false)

        if (player.resettoggle3 === 1 || player.resettoggle3 === 0) {
            DOMCacheGetOrSet("autoreincarnate").textContent = "Reincarnate when your Particles can increase by a factor " + format(Decimal.pow(10, player.reincarnationamount)) + " [Toggle number above]. Current Multiplier: " + format(Decimal.pow(10, Decimal.log(G['reincarnationPointGain'].add(1), 10) - Decimal.log(player.reincarnationPoints.add(1), 10)), 2) + "."
        }
        if (player.resettoggle3 === 2) {
            DOMCacheGetOrSet("autoreincarnate").textContent = "Reincarnate when the autotimer is at least " + (player.reincarnationamount) + " real-life seconds. [Toggle number above]. Current timer: " + format(G['autoResetTimers'].reincarnation, 1) + "s."
        }
    }

    if (G['buildingSubTab'] === "tesseract") {
        const names = [null, 'Dot', 'Vector', 'Three-Space', 'Bent Time', 'Hilbert Space']
        const perSecNames = [null, '+Constant/sec', 'Dot/sec', 'Vector/sec', 'Three-Space/sec', 'Bent Time/sec']
        for (let i = 1; i <= 5; i++) {
            const ascendBuildingI = `ascendBuilding${i as 1|2|3|4|5}` as const;
            DOMCacheGetOrSet("ascendText" + i).textContent = names[i] + ": " + format(player[ascendBuildingI]['owned'], 0, true) + " [+" + format(player[ascendBuildingI]['generated'], 2) + "]"
            DOMCacheGetOrSet("ascendText" + (5 + i)).textContent = 
                perSecNames[i] + ": " + format(((G['ascendBuildingProduction'] as { [key: string]: Decimal })[G['ordinals'][i - 1]]), 2)
            DOMCacheGetOrSet("buyTesseracts" + i).textContent = "Cost: " + format(player[ascendBuildingI]['cost'], 0) + " Tesseracts"
        }

        DOMCacheGetOrSet("tesseractInfo").textContent = "You have " + format(player.wowTesseracts) + " Wow! Tesseracts. Gain more by beating Challenge 10 on each Ascension."
        DOMCacheGetOrSet("ascendShardInfo").textContent = "You have a mathematical constant of " + format(player.ascendShards, 2) + ". Taxes are divided by " + format(Math.pow(Decimal.log(player.ascendShards.add(1), 10) + 1, 1 + .2 / 60 * player.challengecompletions[10] * player.upgrades[125] + 0.1 * player.platonicUpgrades[5] + 0.2 * player.platonicUpgrades[10] + (G['platonicBonusMultiplier'][5] - 1)), 4, true) + "."
        DOMCacheGetOrSet("autotessbuyeramount").textContent = "Auto buyer will save at least " + format(player.tesseractAutoBuyerAmount) + " tesseracts. [Enter number above]."
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const visualUpdateUpgrades = () => {}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const visualUpdateAchievements = () => {}

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

        DOMCacheGetOrSet("offeringCount").textContent = "You have " + format(player.runeshards, 0, true) + " Offerings."

        for (let i = 1; i <= 7; i++) { //First one updates level, second one updates TNL, third updates orange bonus levels
            let place = G[talismans[i-1]];
            if (i > 5) place = 0;
            const runeLevel = player.runelevels[i - 1]
            const maxLevel = calculateMaxRunes(i)
            DOMCacheGetOrSet('rune' + i + 'level').childNodes[0].textContent = "Level: " + format(runeLevel) + "/" + format(maxLevel)
            DOMCacheGetOrSet('rune' + i + 'exp').textContent = (runeLevel < maxLevel ? "+1 in " + format(calculateRuneExpToLevel(i - 1) - player.runeexp[i - 1], 2) + " EXP" : "Max level!")
            if (i <= 5) DOMCacheGetOrSet('bonusrune' + i).textContent = " [Bonus: " + format(7 * player.constantUpgrades[7] + Math.min(1e7, player.antUpgrades[8]! + G['bonusant9']) + place) + "]"
            else DOMCacheGetOrSet('bonusrune' + i).textContent = "[Bonus: Nope!]"
            DOMCacheGetOrSet('rune' + i + 'level').childNodes[0].textContent = "Level: " + format(player.runelevels[i - 1]) + "/" + format(calculateMaxRunes(i))
            DOMCacheGetOrSet('rune' + i + 'exp').textContent = "+1 in " + format(calculateRuneExpToLevel(i - 1) - player.runeexp[i - 1], 2) + " EXP"
            if (i <= 5) DOMCacheGetOrSet('bonusrune' + i).textContent = " [Bonus: " + format(7 * player.constantUpgrades[7] + Math.min(1e7, player.antUpgrades[8]! + G['bonusant9']) + place) + "]"
            else DOMCacheGetOrSet('bonusrune' + i).textContent = "[Bonus: Nope!]"
            displayRuneInformation(i, false)
        }

        DOMCacheGetOrSet("offeringExperienceValue").textContent = "Gain " + format((1 + Math.min(player.highestchallengecompletions[1], 1) + 1 / 25 * player.highestchallengecompletions[1] + 0.6 * player.researches[22] + 0.3 * player.researches[23] + 3 / 25 * player.upgrades[66] + 2 * player.upgrades[61]) * calculateRecycleMultiplier(), 2, true) + "* EXP per offering sacrificed."
        DOMCacheGetOrSet("offeringRecycleInfo").textContent = "You have " + format((5 * player.achievements[80] + 5 * player.achievements[87] + 5 * player.achievements[94] + 5 * player.achievements[101] + 5 * player.achievements[108] + 5 * player.achievements[115] + 7.5 * player.achievements[122] + 7.5 * player.achievements[129] + 5 * player.upgrades[61] + Math.min(25, G['rune4level'] / 16) + 0.5 * player.cubeUpgrades[2]), 2, true) + "% chance of recycling your offerings. This multiplies EXP gain by " + format(calculateRecycleMultiplier(), 2, true) + "!"
    }

    if (G['runescreen'] === "talismans") {
        for (let i = 0; i < 7; i++) {
            const maxTalismanLevel = calculateMaxTalismanLevel(i);
            DOMCacheGetOrSet('talisman' + (i+1) + 'level').textContent = "Level " + format(player.talismanLevels[i], 0, true) + "/" + format(maxTalismanLevel, 0, true)
        }
    }

    if (G['runescreen'] === "blessings") {
        const blessingMultiplierArray = [0, 8, 10, 6.66, 2, 1]
        let t = 0;
        for (let i = 1; i <= 5; i++) {
            DOMCacheGetOrSet(`runeBlessingLevel${i}Value`).textContent = format(player.runeBlessingLevels[i], 0, true)
            DOMCacheGetOrSet(`runeBlessingPower${i}Value1`).textContent = format(G['runeBlessings'][i])
            const levelsPurchasable = calculateSummationLinear(player.runeBlessingLevels[i], G['blessingBaseCost'], player.runeshards, player.runeBlessingBuyAmount)[0] - player.runeBlessingLevels[i]
            levelsPurchasable > 0
                ? DOMCacheGetOrSet(`runeBlessingPurchase${i}`).classList.add("runeButtonsAvailable")
                : DOMCacheGetOrSet(`runeBlessingPurchase${i}`).classList.remove("runeButtonsAvailable")
            DOMCacheGetOrSet(`runeBlessingPurchaseAmount${i}`).textContent = format(Math.max(1, levelsPurchasable))
            DOMCacheGetOrSet(`runeBlessingPurchaseCost${i}`).textContent = format(Math.max(G['blessingBaseCost'] * (1 + player.runeBlessingLevels[i]), calculateSummationLinear(player.runeBlessingLevels[i], G['blessingBaseCost'], player.runeshards, player.runeBlessingBuyAmount)[1]))
            if (i === 5) {
                t = 1
            }
            DOMCacheGetOrSet(`runeBlessingPower${i}Value2`).textContent = format(1 - t + blessingMultiplierArray[i] * G['effectiveRuneBlessingPower'][i], 4, true)
        }
    }

    if (G['runescreen'] === "spirits") {
        const spiritMultiplierArray = [0, 1, 1, 20, 1, 100]
        const subtract = [0, 0, 0, 1, 0, 0]
        for (let i = 1; i <= 5; i++) {
            spiritMultiplierArray[i] *= (calculateCorruptionPoints() / 400)
            DOMCacheGetOrSet(`runeSpiritLevel${i}Value`).textContent = format(player.runeSpiritLevels[i], 0, true)
            DOMCacheGetOrSet(`runeSpiritPower${i}Value1`).textContent = format(G['runeSpirits'][i])
            const levelsPurchasable = calculateSummationLinear(player.runeSpiritLevels[i], G['spiritBaseCost'], player.runeshards, player.runeSpiritBuyAmount)[0] - player.runeSpiritLevels[i]
            levelsPurchasable > 0
                ? DOMCacheGetOrSet(`runeSpiritPurchase${i}`).classList.add("runeButtonsAvailable")
                : DOMCacheGetOrSet(`runeSpiritPurchase${i}`).classList.remove("runeButtonsAvailable")
            DOMCacheGetOrSet(`runeSpiritPurchaseAmount${i}`).textContent = format(Math.max(1, levelsPurchasable))
            DOMCacheGetOrSet(`runeSpiritPurchaseCost${i}`).textContent = format(Math.max(G['spiritBaseCost'] * (1 + player.runeSpiritLevels[i]), calculateSummationLinear(player.runeSpiritLevels[i], G['spiritBaseCost'], player.runeshards, player.runeSpiritBuyAmount)[1]))
            DOMCacheGetOrSet(`runeSpiritPower${i}Value2`).textContent = format(1 - subtract[i] + spiritMultiplierArray[i] * G['effectiveRuneSpiritPower'][i], 4, true)
        }
    }
}

export const visualUpdateChallenges = () => {
    if (G['currentTab'] !== "challenges")
        return
    if (player.researches[150] > 0) {
        DOMCacheGetOrSet("autoIncrementerAmount").textContent = format(G['autoChallengeTimerIncrement'], 2) + "s"
    }
}

export const visualUpdateResearch = () => {
    if (G['currentTab'] !== "researches")
        return

    if (player.researches[61] > 0) {
        DOMCacheGetOrSet("automaticobtainium").textContent = "Thanks to researches you automatically gain " + format(calculateAutomaticObtainium() * calculateTimeAcceleration(), 3, true) + " Obtainium per real life second."
    }
}

export const visualUpdateAnts = () => {
    if (G['currentTab'] !== "ants")
        return
    DOMCacheGetOrSet("crumbcount").textContent = "You have " + format(player.antPoints, 2) + " Galactic Crumbs [" + format(G['antOneProduce'], 2) + "/s], providing a " + format(Decimal.pow(Decimal.max(1, player.antPoints), 100000 + calculateSigmoidExponential(49900000, (player.antUpgrades[1]! + G['bonusant2']) / 5000 * 500 / 499))) + "x Coin Multiplier."
    const mode = player.autoAntSacrificeMode === 2 ? "Real-time" : "In-game time";
    const timer = player.autoAntSacrificeMode === 2 ? player.antSacrificeTimerReal : player.antSacrificeTimer;
    DOMCacheGetOrSet("autoAntSacrifice").textContent = `Sacrifice when the timer is at least ${player.autoAntSacTimer} seconds (${mode}), Currently: ${format(timer)}`
    if (player.achievements[173] === 1) {
        DOMCacheGetOrSet("antSacrificeTimer").textContent = formatTimeShort(player.antSacrificeTimer);
        showSacrifice();
    }
}

interface cubeNames {
    cube: number
    tesseract: number
    hypercube: number
    platonicCube: number
}

export const visualUpdateCubes = () => {
    if (G['currentTab'] !== "cubes")
        return
    DOMCacheGetOrSet("cubeToQuarkTimerValue").textContent = format(Math.floor(player.dayTimer / 3600), 0) + " Hours " + format(Math.floor(player.dayTimer / 60 % 60), 0) + " Mins " + format(Math.floor(player.dayTimer % 60), 0) + " Secs "

    const cubeMult = (player.shopUpgrades.cubeToQuark) ? 1.5 : 1;
    const tesseractMult = (player.shopUpgrades.tesseractToQuark) ? 1.5 : 1;
    const hypercubeMult = (player.shopUpgrades.hypercubeToQuark) ? 1.5 : 1;
    const platonicMult = 1.5;

    const toNextQuark: cubeNames = {
        cube: Number(player.wowCubes.checkCubesToNextQuark(5, cubeMult, player.cubeQuarkDaily, player.cubeOpenedDaily)),
        tesseract: Number(player.wowTesseracts.checkCubesToNextQuark(7, tesseractMult, player.tesseractQuarkDaily, player.tesseractOpenedDaily)),
        hypercube: Number(player.wowHypercubes.checkCubesToNextQuark(10, hypercubeMult, player.hypercubeQuarkDaily, player.hypercubeOpenedDaily)),
        platonicCube: Number(player.wowPlatonicCubes.checkCubesToNextQuark(15, platonicMult, player.platonicCubeQuarkDaily, player.platonicCubeOpenedDaily)),
    }

    const names = Object.keys(toNextQuark) as (keyof cubeNames)[]
    for (const name of names) {
        DOMCacheGetOrSet(`${name}QuarksTodayValue`).textContent = format(player[`${name}QuarkDaily` as const]);
        DOMCacheGetOrSet(`${name}QuarksOpenTodayValue`).textContent = format(player[`${name}OpenedDaily` as const]);
        DOMCacheGetOrSet(`${name}QuarksOpenRequirementValue`).textContent = format(Math.max(1, toNextQuark[name]))
        
        // Change color of requirement text if 1 or less required :D
        DOMCacheGetOrSet(`${name}QuarksOpenRequirement`).style.color = (Math.max(1, toNextQuark[name]) === 1)? 'gold': 'white'
        if (DOMCacheGetOrSet(`${name}QuarksOpenRequirementValue`).style.color !== 'gold')
            DOMCacheGetOrSet(`${name}QuarksOpenRequirementValue`).style.color === 'gold'
    }
    
    let accuracy;
    switch (player.subtabNumber) {
        case 0: {
            DOMCacheGetOrSet("cubeQuantity").textContent = format(player.wowCubes, 0, true)
            const cubeArray = [null, player.cubeBlessings.accelerator, player.cubeBlessings.multiplier, player.cubeBlessings.offering, player.cubeBlessings.runeExp, player.cubeBlessings.obtainium, player.cubeBlessings.antSpeed, player.cubeBlessings.antSacrifice, player.cubeBlessings.antELO, player.cubeBlessings.talismanBonus, player.cubeBlessings.globalSpeed]

            accuracy = [null, 2, 2, 2, 2, 2, 2, 2, 1, 4, 3]
            for (let i = 1; i <= 10; i++) {
                let augmentAccuracy = 0;
                if (cubeArray[i]! >= 1000 && i !== 6) {
                    augmentAccuracy += 2;
                }
                DOMCacheGetOrSet(`cubeBlessing${i}Amount`).textContent = `x${format(cubeArray[i], 0, true)}`
                DOMCacheGetOrSet(`cubeBlessing${i}Effect`).textContent = `+${format(100 * (G['cubeBonusMultiplier'][i]! - 1), accuracy[i]! + augmentAccuracy, true)}%`
                if (i === 1 || i === 8 || i === 9) {
                    DOMCacheGetOrSet(`cubeBlessing${i}Effect`).textContent = `+${format(G['cubeBonusMultiplier'][i] - 1, accuracy[i]! + augmentAccuracy, true)}`
                }
            }
            DOMCacheGetOrSet("cubeBlessingTotalAmount").textContent = format(sumContents(cubeArray.slice(1) as number[]), 0, true);
            break;
        }
        case 1: {
            DOMCacheGetOrSet("tesseractQuantity").textContent = format(player.wowTesseracts, 0, true)
            const tesseractArray = [null, player.tesseractBlessings.accelerator, player.tesseractBlessings.multiplier, player.tesseractBlessings.offering, player.tesseractBlessings.runeExp, player.tesseractBlessings.obtainium, player.tesseractBlessings.antSpeed, player.tesseractBlessings.antSacrifice, player.tesseractBlessings.antELO, player.tesseractBlessings.talismanBonus, player.tesseractBlessings.globalSpeed]
            accuracy = [null, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
            for (let i = 1; i <= 10; i++) {
                let augmentAccuracy = 0;
                if (tesseractArray[i]! >= 1000 && i !== 6) {
                    augmentAccuracy += 2;
                }
                DOMCacheGetOrSet(`tesseractBlessing${i}Amount`).textContent = `x${format(tesseractArray[i], 0, true)}`
                DOMCacheGetOrSet(`tesseractBlessing${i}Effect`).textContent = `+${format(100 * (G['tesseractBonusMultiplier'][i]! - 1), accuracy[i]! + augmentAccuracy, true)}%`
            }
            DOMCacheGetOrSet("tesseractBlessingTotalAmount").textContent = format(sumContents(tesseractArray.slice(1) as number[]), 0, true);
            break;
        }
        case 2: {
            DOMCacheGetOrSet("hypercubeQuantity").textContent = format(player.wowHypercubes, 0, true)
            const hypercubeArray = [null, player.hypercubeBlessings.accelerator, player.hypercubeBlessings.multiplier, player.hypercubeBlessings.offering, player.hypercubeBlessings.runeExp, player.hypercubeBlessings.obtainium, player.hypercubeBlessings.antSpeed, player.hypercubeBlessings.antSacrifice, player.hypercubeBlessings.antELO, player.hypercubeBlessings.talismanBonus, player.hypercubeBlessings.globalSpeed]
            accuracy = [null, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
            for (let i = 1; i <= 10; i++) {
                let augmentAccuracy = 0;
                if (hypercubeArray[i]! >= 1000) {
                    augmentAccuracy += 2;
                }
                DOMCacheGetOrSet(`hypercubeBlessing${i}Amount`).textContent = `x${format(hypercubeArray[i], 0, true)}`
                DOMCacheGetOrSet(`hypercubeBlessing${i}Effect`).textContent = `+${format(100 * (G['hypercubeBonusMultiplier'][i]! - 1), accuracy[i]! + augmentAccuracy, true)}%`
            }
            DOMCacheGetOrSet("hypercubeBlessingTotalAmount").textContent = format(sumContents(hypercubeArray.slice(1) as number[]), 0, true);
            break;
        }
        case 3: {
            DOMCacheGetOrSet("platonicQuantity").textContent = format(player.wowPlatonicCubes, 0, true)
            const platonicArray = [player.platonicBlessings.cubes, player.platonicBlessings.tesseracts, player.platonicBlessings.hypercubes, player.platonicBlessings.platonics, player.platonicBlessings.hypercubeBonus, player.platonicBlessings.taxes, player.platonicBlessings.scoreBonus, player.platonicBlessings.globalSpeed]
            const DRThreshold = [4e6, 4e6, 4e6, 8e4, 1e4, 1e4, 1e4, 1e4]
            accuracy = [5, 5, 5, 5, 2, 3, 3, 2]
            for (let i = 0; i < platonicArray.length; i++) {
                let augmentAccuracy = 0;
                if (platonicArray[i] >= DRThreshold[i]) {
                    augmentAccuracy += 1;
                }
                DOMCacheGetOrSet(`platonicBlessing${i + 1}Amount`).textContent = `x${format(platonicArray[i], 0, true)}`
                DOMCacheGetOrSet(`platonicBlessing${i + 1}Effect`).textContent = `+${format(100 * (G['platonicBonusMultiplier'][i] - 1), accuracy[i] + augmentAccuracy, true)}%`
            }
            DOMCacheGetOrSet("platonicBlessingTotalAmount").textContent = format(sumContents(platonicArray), 0, true);
            break;
        }
        case 4:
            DOMCacheGetOrSet("cubeAmount2").textContent = `You have ${format(player.wowCubes, 0, true)} Wow! Cubes =)`
            break;
        case 5:
            break;
        case 6:
            DOMCacheGetOrSet('hepteractQuantity').textContent = format(player.wowAbyssals, 0, true)

            //Update the grid
            hepteractTypeList.forEach((type) => {
                UpdateHeptGridValues(type);
            });

            //orbs
            DOMCacheGetOrSet('heptGridOrbBalance').textContent = format(player.overfluxOrbs)
            DOMCacheGetOrSet('heptGridOrbEffect').textContent = format(100 * (-1 + calculateCubeQuarkMultiplier()), 2, true) + '%'

            //powder
            DOMCacheGetOrSet('heptGridPowderBalance').textContent = format(player.overfluxPowder)
            DOMCacheGetOrSet('heptGridPowderWarps').textContent = format(player.dailyPowderResetUses)
            break;
        default:
            // console.log(`player.subtabNumber (${player.subtabNumber}) was outside of the allowed range (${subTabsInMainTab(8).subTabList.length}) for the cube tab`);
            break;
    }
}

const UpdateHeptGridValues = (type: hepteractTypes) => {
    const text = type + 'ProgressBarText'
    const bar = type + 'ProgressBar'
    const textEl = document.getElementById(text)!
    const barEl = document.getElementById(bar)!
    const balance = player.hepteractCrafts[type].BAL
    const cap = player.hepteractCrafts[type].CAP
    const barWidth = Math.round((balance / cap) * 100)

    let barColor = "";
    if (barWidth < 34) {
        barColor = "red";
    } else if (barWidth >= 34 && barWidth < 68) {
        barColor = "#cca300";
    } else {
        barColor = "green";
    }

    textEl.textContent = format(balance) + " / " + format(cap)
    barEl.style.width = barWidth + '%'
    barEl.style.backgroundColor = barColor
}

export const visualUpdateCorruptions = () => {
    if (G['currentTab'] !== "traits")
        return

    DOMCacheGetOrSet("autoAscendMetric").textContent = format(player.autoAscendThreshold, 0, true)
    const metaData = CalcCorruptionStuff();
    const ascCount = calcAscensionCount();

    DOMCacheGetOrSet("corruptionBankValue").textContent = format(metaData[0]);
    DOMCacheGetOrSet("corruptionScoreValue").textContent = format(metaData[1], 0, true);
    DOMCacheGetOrSet("corruptionMultiplierValue").textContent = format(metaData[2], 1, true);
    DOMCacheGetOrSet("corruptionTotalScore").textContent = format(metaData[3], 0, true);
    DOMCacheGetOrSet("corruptionCubesValue").textContent = format(metaData[4], 0, true);
    DOMCacheGetOrSet("corruptionTesseractsValue").textContent = format(metaData[5]);
    DOMCacheGetOrSet("corruptionHypercubesValue").textContent = format(metaData[6]);
    DOMCacheGetOrSet("corruptionPlatonicCubesValue").textContent = format(metaData[7]);
    DOMCacheGetOrSet("corruptionHepteractsValue").textContent = format(metaData[8]);
    DOMCacheGetOrSet("corruptionAntExponentValue").textContent = format((1 - 0.9 / 90 * sumContents(player.usedCorruptions)) * G['extinctionMultiplier'][player.usedCorruptions[7]], 3);
    DOMCacheGetOrSet("corruptionSpiritBonusValue").textContent = format(calculateCorruptionPoints()/400,2,true);
    DOMCacheGetOrSet("corruptionAscensionCount").style.display = ascCount > 1 ? 'block' : 'none';

    if (ascCount > 1) {
        DOMCacheGetOrSet("corruptionAscensionCountValue").textContent = format(calcAscensionCount());
    }
}

export const visualUpdateSettings = () => {
    if (G['currentTab'] !== "settings")
        return
    //I was unable to clean this up in a way that didn't somehow make it less clean, sorry.
    DOMCacheGetOrSet("prestigeCountStatistic").childNodes[1].textContent = format(player.prestigeCount, 0, true)
    DOMCacheGetOrSet("transcensionCountStatistic").childNodes[1].textContent = format(player.transcendCount, 0, true)
    DOMCacheGetOrSet("reincarnationCountStatistic").childNodes[1].textContent = format(player.reincarnationCount, 0, true)
    DOMCacheGetOrSet("fastestPrestigeStatistic").childNodes[1].textContent = format(1000 * player.fastestprestige) + "ms"
    DOMCacheGetOrSet("fastestTranscensionStatistic").childNodes[1].textContent = format(1000 * player.fastesttranscend) + "ms"
    DOMCacheGetOrSet("fastestReincarnationStatistic").childNodes[1].textContent = format(1000 * player.fastestreincarnate) + "ms"
    DOMCacheGetOrSet("mostOfferingStatistic").childNodes[1].textContent = format(player.maxofferings)
    DOMCacheGetOrSet("mostObtainiumStatistic").childNodes[1].textContent = format(player.maxobtainium)
    DOMCacheGetOrSet("mostObtainiumPerSecondStatistic").childNodes[1].textContent = format(player.maxobtainiumpersecond, 2, true)
    DOMCacheGetOrSet("runeSumStatistic").childNodes[1].textContent = format(G['runeSum'])
    DOMCacheGetOrSet("obtainiumPerSecondStatistic").childNodes[1].textContent = format(player.obtainiumpersecond, 2, true)
    DOMCacheGetOrSet("ascensionCountStatistic").childNodes[1].textContent = format(player.ascensionCount, 0, true)

    DOMCacheGetOrSet("saveString").textContent =
        `Currently: ${player.saveString.replace("$VERSION$", "v" + version)}`;

    const quarkData = quarkHandler();
    const onExportQuarks = quarkData.gain
    const maxExportQuarks = quarkData.capacity
    const patreonLOL = 1 + player.worlds.BONUS/100
    DOMCacheGetOrSet("quarktimerdisplay").textContent = format((3600 / (quarkData.perHour) - (player.quarkstimer % (3600.00001 / (quarkData.perHour)))), 2) + "s until +" + format(patreonLOL, 2, true) + " export Quark"
    DOMCacheGetOrSet("quarktimeramount").textContent = 
        `Quarks on export: ${format(Math.floor(onExportQuarks * patreonLOL))} [Max ${format(Math.floor(maxExportQuarks * patreonLOL))}]`;

    DOMCacheGetOrSet("goldenQuarkTimerDisplay").textContent = format(3600 - (player.quarkstimer % 3600.00001)) + "s until +" + format(patreonLOL, 2, true) + " export Golden Quark"
    DOMCacheGetOrSet("goldenQuarkTimerAmount").textContent = 
        `Golden Quarks on export: ${format(Math.floor(player.quarkstimer / 3600))} [Max ${format(Math.floor(quarkData.maxTime / 3600))}]`

}

export const visualUpdateShop = () => {
    if (G['currentTab'] !== "shop")
        return
    DOMCacheGetOrSet("quarkamount").textContent = "You have " + format(player.worlds) + " Quarks!"
    DOMCacheGetOrSet("offeringpotionowned").textContent = "Own: " + format(player.shopUpgrades.offeringPotion)
    DOMCacheGetOrSet("obtainiumpotionowned").textContent = "Own: " + format(player.shopUpgrades.obtainiumPotion)

    // Create Keys with the correct type
    const keys = Object.keys(player.shopUpgrades) as (keyof Player['shopUpgrades'])[];
    for (const key of keys) {
        // Create a copy of shopItem instead of accessing many times
        const shopItem = shopData[key]
        
        // Ignore all consumables, to be handled above, since they're different.
        if (shopItem.type === shopUpgradeTypes.UPGRADE) {
            // Case: If max level is 1, then it can be considered a boolean "bought" or "not bought" item
            if (shopItem.maxLevel === 1) {
                player.shopUpgrades[key] === shopItem.maxLevel ?
                    DOMCacheGetOrSet(`${key}Level`).textContent = "Bought!":
                    DOMCacheGetOrSet(`${key}Level`).textContent = "Not Bought!"
            }
            // Case: max level greater than 1, treat it as a fraction out of max level
            else
                DOMCacheGetOrSet(`${key}Level`).textContent = "Level " + format(player.shopUpgrades[key]) + "/" + format(shopItem.maxLevel);
            // Handles Button - max level needs no price indicator, otherwise it's necessary

            const buyAmount = G['shopBuyMax']? Math.max(shopData[key].maxLevel - player.shopUpgrades[key], 1): 1;
            const metaData:IMultiBuy = calculateSummationNonLinear(player.shopUpgrades[key], shopData[key].price, +player.worlds, shopData[key].priceIncrease / shopData[key].price, buyAmount)
            
            if (!G['shopBuyMax']) {
                player.shopUpgrades[key] === shopItem.maxLevel ?
                    DOMCacheGetOrSet(`${key}Button`).textContent = "Maxed!": 
                    DOMCacheGetOrSet(`${key}Button`).textContent = "Upgrade for " + format(getShopCosts(key)) + " Quarks";
            }
            
            else {
                player.shopUpgrades[key] === shopItem.maxLevel ?
                    DOMCacheGetOrSet(`${key}Button`).textContent = "Maxed!": 
                    DOMCacheGetOrSet(`${key}Button`).textContent = "Upgrade +"+format(metaData.levelCanBuy - player.shopUpgrades[key],0,true)+ " for " + format(metaData.cost,0,true) + " Quarks";
            }
        }
    }

    DOMCacheGetOrSet("buySingularityQuarksAmount").textContent = `Owned: ${format(player.goldenQuarks)}`
    DOMCacheGetOrSet("buySingularityQuarksButton").textContent = `Buy! ${format(getGoldenQuarkCost().cost)} Quarks Each`
}
