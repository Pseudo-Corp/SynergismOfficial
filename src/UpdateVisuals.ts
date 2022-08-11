import Decimal from 'break_infinity.js';
import { Globals as G } from './Variables';
import { player, format, formatTimeShort } from './Synergism';
import { version } from './Config';
import { CalcECC } from './Challenges';
import { calculateSigmoidExponential, calculateMaxRunes, calculateRuneExpToLevel, calculateSummationLinear, calculateRecycleMultiplier, calculateCorruptionPoints, CalcCorruptionStuff, calculateAutomaticObtainium, calculateTimeAcceleration, calcAscensionCount, calculateCubeQuarkMultiplier, calculateSummationNonLinear, calculateTotalOcteractCubeBonus, calculateTotalOcteractQuarkBonus, octeractGainPerSecond } from './Calculate';
import { displayRuneInformation } from './Runes';
import { showSacrifice } from './Ants';
import { sumContents } from './Utility';
import { getShopCosts, shopData, shopUpgradeTypes } from './Shop';
import { quarkHandler } from './Quark';
import type { Player, ZeroToFour } from './types/Synergism';
import type { hepteractTypes } from './Hepteracts';
import { hepteractTypeList } from './Hepteracts';
import { DOMCacheGetOrSet } from './Cache/DOM';
import type { IMultiBuy } from './Cubes';
import { calculateMaxTalismanLevel } from './Talismans';
import { getGoldenQuarkCost } from './singularity';
import { loadStatisticsUpdate } from './Statistics';

export const visualUpdateBuildings = () => {
    if (G['currentTab'] !== 'buildings') {
        return;
    }

    //When you're in Building --> Coin, update these.
    if (G['buildingSubTab'] === 'coin') {
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

            DOMCacheGetOrSet('buildtext' + (2 * i - 1)).textContent = names[i] + ': ' + format(player[`${ith}OwnedCoin` as const], 0, true) + ' [+' + format(player[`${ith}GeneratedCoin` as const]) + ']'
            DOMCacheGetOrSet('buycoin' + i).textContent = 'Cost: ' + format(player[`${ith}CostCoin` as const]) + ' coins.'
            percentage = percentage.fromMantissaExponent(place.mantissa / totalProductionDivisor.mantissa, place.exponent - totalProductionDivisor.exponent).times(100)
            DOMCacheGetOrSet('buildtext' + (2 * i)).textContent = 'Coins/Sec: ' + format((place.dividedBy(G['taxdivisor'])).times(40), 2) + ' [' + format(percentage, 3) + '%]'
        }

        DOMCacheGetOrSet('buildtext11').textContent = 'Accelerators: ' + format(player.acceleratorBought, 0, true) + ' [+' + format(G['freeAccelerator'], 0, true) + ']'
        DOMCacheGetOrSet('buildtext12').textContent = 'Acceleration Power: ' + format((G['acceleratorPower'] - 1) * 100, 2) + '% || Acceleration Multiplier: ' + format(G['acceleratorEffect'], 2) + 'x'
        DOMCacheGetOrSet('buildtext13').textContent = 'Multipliers: ' + format(player.multiplierBought, 0, true) + ' [+' + format(G['freeMultiplier'], 0, true) + ']'
        DOMCacheGetOrSet('buildtext14').textContent = 'Multiplier Power: ' + format(G['multiplierPower'], 2) + 'x || Multiplier: ' + format(G['multiplierEffect'], 2) + 'x'
        DOMCacheGetOrSet('buildtext15').textContent = 'Accelerator Boost: ' + format(player.acceleratorBoostBought, 0, true) + ' [+' + format(G['freeAcceleratorBoost'], 0, false) + ']'
        DOMCacheGetOrSet('buildtext16').textContent = 'Reset Diamonds and Prestige Upgrades, but add ' + format(G['tuSevenMulti'] * (1 + player.researches[16] / 50) * (1 + CalcECC('transcend', player.challengecompletions[2]) / 100), 2) + '% Acceleration Power and 5 free Accelerators.'
        DOMCacheGetOrSet('buyaccelerator').textContent = 'Cost: ' + format(player.acceleratorCost) + ' coins.'
        DOMCacheGetOrSet('buymultiplier').textContent = 'Cost: ' + format(player.multiplierCost) + ' coins.'
        DOMCacheGetOrSet('buyacceleratorboost').textContent = 'Cost: ' + format(player.acceleratorBoostCost) + ' Diamonds.'

        // update the tax text
        let warning = '';
        if (player.reincarnationCount > 0.5) {
            warning = `Your tax also caps your Coin gain at ${format(Decimal.pow(10, G['maxexponent'] - Decimal.log(G['taxdivisorcheck'], 10)))}/s.`
        }
        DOMCacheGetOrSet('taxinfo').textContent =
            `Due to your excessive wealth, coin production is divided by ${format(G['taxdivisor'], 2)} to pay taxes! ${warning}`
    }

    if (G['buildingSubTab'] === 'diamond') {
        // For the display of Diamond Buildings
        const upper = ['produceFirstDiamonds', 'produceSecondDiamonds', 'produceThirdDiamonds', 'produceFourthDiamonds', 'produceFifthDiamonds'] as const;
        const names = [null, 'Refineries', 'Coal Plants', 'Coal Rigs', 'Pickaxes', 'Pandoras Boxes']
        const perSecNames = [null, 'Crystal/sec', 'Ref./sec', 'Plants/sec', 'Rigs/sec', 'Pickaxes/sec']

        DOMCacheGetOrSet('prestigeshardinfo').textContent = 'You have ' + format(player.prestigeShards, 2) + ' Crystals, multiplying Coin production by ' + format(G['prestigeMultiplier'], 2) + 'x.'

        for (let i = 1; i <= 5; i++) {
            const place = G[upper[i-1]];
            const ith = G['ordinals'][i - 1 as ZeroToFour];

            DOMCacheGetOrSet('prestigetext' + (2 * i - 1)).textContent = names[i] + ': ' + format(player[`${ith}OwnedDiamonds` as const], 0, true) + ' [+' + format(player[`${ith}GeneratedDiamonds` as const], 2) + ']'
            DOMCacheGetOrSet('prestigetext' + (2 * i)).textContent = perSecNames[i] + ': ' + format((place).times(40), 2)
            DOMCacheGetOrSet('buydiamond' + i).textContent = 'Cost: ' + format(player[`${ith}CostDiamonds` as const], 2) + ' Diamonds'
        }

        if (player.resettoggle1 === 1 || player.resettoggle1 === 0) {
            const p = Decimal.pow(10, Decimal.log(G['prestigePointGain'].add(1), 10) - Decimal.log(player.prestigePoints.sub(1), 10))
            DOMCacheGetOrSet('autoprestige').textContent = 'Prestige when your Diamonds can increase by a factor ' + format(Decimal.pow(10, player.prestigeamount)) + ' [Toggle number above]. Current Multiplier: ' + format(p) + '.'
        }
        if (player.resettoggle1 === 2) {
            DOMCacheGetOrSet('autoprestige').textContent = 'Prestige when the autotimer is at least ' + (player.prestigeamount) + ' real-life seconds. [Toggle number above]. Current timer: ' + format(G['autoResetTimers'].prestige, 1) + 's.'
        }
    }

    if (G['buildingSubTab'] === 'mythos') {
        // For the display of Mythos Buildings
        const upper = ['produceFirstMythos', 'produceSecondMythos', 'produceThirdMythos', 'produceFourthMythos', 'produceFifthMythos'] as const;
        const names = [null, 'Augments', 'Enchantments', 'Wizards', 'Oracles', 'Grandmasters']
        const perSecNames = [null, 'Shards/sec', 'Augments/sec', 'Enchantments/sec', 'Wizards/sec', 'Oracles/sec']

        DOMCacheGetOrSet('transcendshardinfo').textContent = 'You have ' + format(player.transcendShards, 2) + ' Mythos Shards, providing ' + format(G['totalMultiplierBoost'], 0, true) + ' Multiplier Power boosts.'

        for (let i = 1; i <= 5; i++) {
            const place = G[upper[i-1]];
            const ith = G['ordinals'][i - 1 as ZeroToFour];

            DOMCacheGetOrSet('transcendtext' + (2 * i - 1)).textContent = names[i] + ': ' + format(player[`${ith}OwnedMythos` as const], 0, true) + ' [+' + format(player[`${ith}GeneratedMythos` as const], 2) + ']'
            DOMCacheGetOrSet('transcendtext' + (2 * i)).textContent = perSecNames[i] + ': ' + format((place).times(40), 2)
            DOMCacheGetOrSet('buymythos' + i).textContent = 'Cost: ' + format(player[`${ith}CostMythos` as const], 2) + ' Mythos'
        }

        if (player.resettoggle2 === 1 || player.resettoggle2 === 0) {
            DOMCacheGetOrSet('autotranscend').textContent = 'Prestige when your Mythos can increase by a factor ' + format(Decimal.pow(10, player.transcendamount)) + ' [Toggle number above]. Current Multiplier: ' + format(Decimal.pow(10, Decimal.log(G['transcendPointGain'].add(1), 10) - Decimal.log(player.transcendPoints.add(1), 10)), 2) + '.'
        }
        if (player.resettoggle2 === 2) {
            DOMCacheGetOrSet('autotranscend').textContent = 'Transcend when the autotimer is at least ' + (player.transcendamount) + ' real-life seconds. [Toggle number above]. Current timer: ' + format(G['autoResetTimers'].transcension, 1) + 's.'
        }
    }

    if (G['buildingSubTab'] === 'particle') {

        // For the display of Particle Buildings
        const upper = ['FirstParticles', 'SecondParticles', 'ThirdParticles', 'FourthParticles', 'FifthParticles'] as const;
        const names = ['Protons', 'Elements', 'Pulsars', 'Quasars', 'Galactic Nuclei'];
        const perSecNames = ['Atoms/sec', 'Protons/sec', 'Elements/sec', 'Pulsars/sec', 'Quasars/sec']

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

        DOMCacheGetOrSet('reincarnationshardinfo').textContent = 'You have ' + format(player.reincarnationShards, 2) + ' Atoms, providing ' + format(G['buildingPower'], 4) + ' Building Power. Multiplier to Coin Production: ' + format(G['reincarnationMultiplier'])
        DOMCacheGetOrSet('reincarnationCrystalInfo').textContent = 'Thanks to Research 2x14, you also multiply Crystal production by ' + format(Decimal.pow(G['reincarnationMultiplier'], 1 / 50), 3, false)
        DOMCacheGetOrSet('reincarnationMythosInfo').textContent = 'Thanks to Research 2x15, you also multiply Mythos Shard production by ' + format(Decimal.pow(G['reincarnationMultiplier'], 1 / 250), 3, false)

        if (player.resettoggle3 === 1 || player.resettoggle3 === 0) {
            DOMCacheGetOrSet('autoreincarnate').textContent = 'Reincarnate when your Particles can increase by a factor ' + format(Decimal.pow(10, player.reincarnationamount)) + ' [Toggle number above]. Current Multiplier: ' + format(Decimal.pow(10, Decimal.log(G['reincarnationPointGain'].add(1), 10) - Decimal.log(player.reincarnationPoints.add(1), 10)), 2) + '.'
        }
        if (player.resettoggle3 === 2) {
            DOMCacheGetOrSet('autoreincarnate').textContent = 'Reincarnate when the autotimer is at least ' + (player.reincarnationamount) + ' real-life seconds. [Toggle number above]. Current timer: ' + format(G['autoResetTimers'].reincarnation, 1) + 's.'
        }
    }

    if (G['buildingSubTab'] === 'tesseract') {
        const names = [null, 'Dot', 'Vector', 'Three-Space', 'Bent Time', 'Hilbert Space']
        const perSecNames = [null, '+Constant/sec', 'Dot/sec', 'Vector/sec', 'Three-Space/sec', 'Bent Time/sec']
        for (let i = 1; i <= 5; i++) {
            const ascendBuildingI = `ascendBuilding${i as 1|2|3|4|5}` as const;
            DOMCacheGetOrSet('ascendText' + i).textContent = names[i] + ': ' + format(player[ascendBuildingI]['owned'], 0, true) + ' [+' + format(player[ascendBuildingI]['generated'], 2) + ']'
            DOMCacheGetOrSet('ascendText' + (5 + i)).textContent =
                perSecNames[i] + ': ' + format(((G['ascendBuildingProduction'] as { [key: string]: Decimal })[G['ordinals'][i - 1]]), 2)
            DOMCacheGetOrSet('buyTesseracts' + i).textContent = 'Cost: ' + format(player[ascendBuildingI]['cost'], 0) + ' Tesseracts'
        }

        DOMCacheGetOrSet('tesseractInfo').textContent = 'You have ' + format(player.wowTesseracts) + ' Wow! Tesseracts. Gain more by beating Challenge 10 on each Ascension.'
        DOMCacheGetOrSet('ascendShardInfo').textContent = 'You have a mathematical constant of ' + format(player.ascendShards, 2) + '. Taxes are divided by ' + format(Math.pow(Decimal.log(player.ascendShards.add(1), 10) + 1, 1 + .2 / 60 * player.challengecompletions[10] * player.upgrades[125] + 0.1 * player.platonicUpgrades[5] + 0.2 * player.platonicUpgrades[10] + (G['platonicBonusMultiplier'][5] - 1)), 4, true) + '.'

        if (player.resettoggle4 === 1 || player.resettoggle4 === 0) {
            DOMCacheGetOrSet('autotessbuyeramount').textContent = 'Auto buyer will save at least ' + format(player.tesseractAutoBuyerAmount) + ' tesseracts. [Enter number above].'
        }
        if (player.resettoggle4 === 2) {
            DOMCacheGetOrSet('autotessbuyeramount').textContent = 'On Ascension, Auto buyer will save at least ' + format(Math.min(100, player.tesseractAutoBuyerAmount)) + '% of your current amount of tesseracts. [Enter number above].'
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const visualUpdateUpgrades = () => {}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const visualUpdateAchievements = () => {}

export const visualUpdateRunes = () => {
    if (G['currentTab'] !== 'runes') {
        return
    }
    if (G['runescreen'] === 'runes') { //Placeholder and place work similarly to buildings, except for the specific Talismans.

        const talismans = [
            'rune1Talisman',
            'rune2Talisman',
            'rune3Talisman',
            'rune4Talisman',
            'rune5Talisman'
        ] as const;

        DOMCacheGetOrSet('offeringCount').textContent = `You have ${format(player.runeshards, 0, true)} Offerings.`

        for (let i = 1; i <= 7; i++) { //First one updates level, second one updates TNL, third updates orange bonus levels
            let place = G[talismans[i-1]];
            if (i > 5) {
                place = 0;
            }
            const runeLevel = player.runelevels[i - 1]
            const maxLevel = calculateMaxRunes(i)
            DOMCacheGetOrSet(`rune${i}level`).childNodes[0].textContent = 'Level: ' + format(runeLevel) + '/' + format(maxLevel)
            if (runeLevel < maxLevel) {
                DOMCacheGetOrSet(`rune${i}exp`).textContent = `+1 in ${format(calculateRuneExpToLevel(i - 1) - player.runeexp[i - 1], 2)} EXP`
            } else {
                DOMCacheGetOrSet(`rune${i}exp`).textContent = 'Maxed Level!'
            }
            if (i <= 5) {
                DOMCacheGetOrSet(`bonusrune${i}`).textContent = ` [Bonus: ${format(7 * player.constantUpgrades[7] + Math.min(1e7, player.antUpgrades[8]! + G['bonusant9']) + place)}]`
            } else {
                DOMCacheGetOrSet(`bonusrune${i}`).textContent = '[Bonus: Nope!]'
            }
            displayRuneInformation(i, false)
        }

        const calculateRecycle = calculateRecycleMultiplier();
        const allRuneExpAdditiveMultiplier = sumContents([
            // Base amount multiplied per offering
            1 * calculateRecycle,
            // +1 if C1 completion
            Math.min(1, player.highestchallengecompletions[1]),
            // +0.10 per C1 completion
            0.4 / 10 * player.highestchallengecompletions[1],
            // Research 5x2
            0.6 * player.researches[22],
            // Research 5x3
            0.3 * player.researches[23],
            // Particle Upgrade 1x1
            2 * player.upgrades[61]
        ]);
        DOMCacheGetOrSet('offeringExperienceValue').textContent = `Gain ${format(allRuneExpAdditiveMultiplier, 2, true)}x EXP per offering sacrificed.`
        DOMCacheGetOrSet('offeringRecycleInfo').textContent = `You have ${format((1 - 1 / calculateRecycle) * 100, 2, true)}% chance of recycling your offerings. This multiplies EXP gain by ${format(calculateRecycle, 2, true)}!`
    }

    if (G['runescreen'] === 'talismans') {
        for (let i = 0; i < 7; i++) {
            const maxTalismanLevel = calculateMaxTalismanLevel(i);
            DOMCacheGetOrSet(`talisman${i + 1}level`).textContent = (player.ascensionCount > 0 ? '' : 'Level ') + format(player.talismanLevels[i]) + '/' + format(maxTalismanLevel)
        }
    }

    if (G['runescreen'] === 'blessings') {
        const blessingMultiplierArray = [0, 8, 10, 6.66, 2, 1]
        let t = 0;
        for (let i = 1; i <= 5; i++) {
            DOMCacheGetOrSet(`runeBlessingLevel${i}Value`).textContent = format(player.runeBlessingLevels[i])
            DOMCacheGetOrSet(`runeBlessingPower${i}Value1`).textContent = format(G['runeBlessings'][i])
            const levelsPurchasable = calculateSummationLinear(player.runeBlessingLevels[i], G['blessingBaseCost'], player.runeshards, player.runeBlessingBuyAmount)[0] - player.runeBlessingLevels[i]
            levelsPurchasable > 0
                ? DOMCacheGetOrSet(`runeBlessingPurchase${i}`).classList.add('runeButtonsAvailable')
                : DOMCacheGetOrSet(`runeBlessingPurchase${i}`).classList.remove('runeButtonsAvailable')
            DOMCacheGetOrSet(`runeBlessingPurchaseAmount${i}`).textContent = format(Math.max(1, levelsPurchasable))
            DOMCacheGetOrSet(`runeBlessingPurchaseCost${i}`).textContent = format(Math.max(G['blessingBaseCost'] * (1 + player.runeBlessingLevels[i]), calculateSummationLinear(player.runeBlessingLevels[i], G['blessingBaseCost'], player.runeshards, player.runeBlessingBuyAmount)[1]))
            if (i === 5) {
                t = 1
            }
            DOMCacheGetOrSet(`runeBlessingPower${i}Value2`).textContent = format(1 - t + blessingMultiplierArray[i] * G['effectiveRuneBlessingPower'][i], 4, true)
        }
    }

    if (G['runescreen'] === 'spirits') {
        const spiritMultiplierArray = [0, 1, 1, 20, 1, 100]
        const subtract = [0, 0, 0, 1, 0, 0]
        for (let i = 1; i <= 5; i++) {
            spiritMultiplierArray[i] *= (calculateCorruptionPoints() / 400)
            DOMCacheGetOrSet(`runeSpiritLevel${i}Value`).textContent = format(player.runeSpiritLevels[i])
            DOMCacheGetOrSet(`runeSpiritPower${i}Value1`).textContent = format(G['runeSpirits'][i])
            const levelsPurchasable = calculateSummationLinear(player.runeSpiritLevels[i], G['spiritBaseCost'], player.runeshards, player.runeSpiritBuyAmount)[0] - player.runeSpiritLevels[i]
            levelsPurchasable > 0
                ? DOMCacheGetOrSet(`runeSpiritPurchase${i}`).classList.add('runeButtonsAvailable')
                : DOMCacheGetOrSet(`runeSpiritPurchase${i}`).classList.remove('runeButtonsAvailable')
            DOMCacheGetOrSet(`runeSpiritPurchaseAmount${i}`).textContent = format(Math.max(1, levelsPurchasable))
            DOMCacheGetOrSet(`runeSpiritPurchaseCost${i}`).textContent = format(Math.max(G['spiritBaseCost'] * (1 + player.runeSpiritLevels[i]), calculateSummationLinear(player.runeSpiritLevels[i], G['spiritBaseCost'], player.runeshards, player.runeSpiritBuyAmount)[1]))
            DOMCacheGetOrSet(`runeSpiritPower${i}Value2`).textContent = format(1 - subtract[i] + spiritMultiplierArray[i] * G['effectiveRuneSpiritPower'][i], 4, true)
        }
    }
}

export const visualUpdateChallenges = () => {
    if (G['currentTab'] !== 'challenges') {
        return
    }
    if (player.researches[150] > 0) {
        DOMCacheGetOrSet('autoIncrementerAmount').textContent = format(G['autoChallengeTimerIncrement'], 2) + 's'
    }
}

export const visualUpdateResearch = () => {
    if (G['currentTab'] !== 'researches') {
        return
    }

    if (player.researches[61] > 0) {
        DOMCacheGetOrSet('automaticobtainium').textContent = 'Thanks to researches you automatically gain ' + format(calculateAutomaticObtainium() * calculateTimeAcceleration(), 3, true) + ' Obtainium per real life second.'
    }
}

export const visualUpdateAnts = () => {
    if (G['currentTab'] !== 'ants') {
        return
    }
    DOMCacheGetOrSet('crumbcount').textContent = 'You have ' + format(player.antPoints, 2) + ' Galactic Crumbs [' + format(G['antOneProduce'], 2) + '/s], providing a ' + format(Decimal.pow(Decimal.max(1, player.antPoints), 100000 + calculateSigmoidExponential(49900000, (player.antUpgrades[1]! + G['bonusant2']) / 5000 * 500 / 499))) + 'x Coin Multiplier.'
    const mode = player.autoAntSacrificeMode === 2 ? 'Real-time' : 'In-game time';
    const timer = player.autoAntSacrificeMode === 2 ? player.antSacrificeTimerReal : player.antSacrificeTimer;
    DOMCacheGetOrSet('autoAntSacrifice').textContent = `Sacrifice when the timer is at least ${player.autoAntSacTimer} seconds (${mode}), Currently: ${format(timer, 2)}`
    if (player.achievements[173] === 1) {
        DOMCacheGetOrSet('antSacrificeTimer').textContent = formatTimeShort(player.antSacrificeTimer);
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
    if (G['currentTab'] !== 'cubes') {
        return
    }
    DOMCacheGetOrSet('cubeToQuarkTimerValue').textContent = format(Math.floor(player.dayTimer / 3600), 0) + ' Hours ' + format(Math.floor(player.dayTimer / 60 % 60), 0) + ' Mins ' + format(Math.floor(player.dayTimer % 60), 0) + ' Secs '

    const cubeMult = (player.shopUpgrades.cubeToQuark) ? 1.5 : 1;
    const tesseractMult = (player.shopUpgrades.tesseractToQuark) ? 1.5 : 1;
    const hypercubeMult = (player.shopUpgrades.hypercubeToQuark) ? 1.5 : 1;
    const platonicMult = 1.5;

    const toNextQuark: cubeNames = {
        cube: Number(player.wowCubes.checkCubesToNextQuark(5, cubeMult, player.cubeQuarkDaily, player.cubeOpenedDaily)),
        tesseract: Number(player.wowTesseracts.checkCubesToNextQuark(7, tesseractMult, player.tesseractQuarkDaily, player.tesseractOpenedDaily)),
        hypercube: Number(player.wowHypercubes.checkCubesToNextQuark(10, hypercubeMult, player.hypercubeQuarkDaily, player.hypercubeOpenedDaily)),
        platonicCube: Number(player.wowPlatonicCubes.checkCubesToNextQuark(15, platonicMult, player.platonicCubeQuarkDaily, player.platonicCubeOpenedDaily))
    }

    const names = Object.keys(toNextQuark) as (keyof cubeNames)[]
    for (const name of names) {
        DOMCacheGetOrSet(`${name}QuarksTodayValue`).textContent = format(player[`${name}QuarkDaily` as const]);
        DOMCacheGetOrSet(`${name}QuarksOpenTodayValue`).textContent = format(player[`${name}OpenedDaily` as const]);
        DOMCacheGetOrSet(`${name}QuarksOpenRequirementValue`).textContent = format(Math.max(1, toNextQuark[name]))

        // Change color of requirement text if 1 or less required :D
        DOMCacheGetOrSet(`${name}QuarksOpenRequirement`).style.color = (Math.max(1, toNextQuark[name]) === 1)? 'gold': 'white'
        if (DOMCacheGetOrSet(`${name}QuarksOpenRequirementValue`).style.color !== 'gold') {
            DOMCacheGetOrSet(`${name}QuarksOpenRequirementValue`).style.color === 'gold'
        }
    }

    let accuracy;
    switch (player.subtabNumber) {
        case 0: {
            if (player.autoOpenCubes) {
                DOMCacheGetOrSet('openCubes').textContent = `Auto Open ${format(player.openCubes, 0)}%`;
            }
            DOMCacheGetOrSet('cubeQuantity').textContent = format(player.wowCubes, 0, true)
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
            DOMCacheGetOrSet('cubeBlessingTotalAmount').textContent = format(sumContents(cubeArray.slice(1) as number[]), 0, true);
            break;
        }
        case 1: {
            if (player.autoOpenTesseracts) {
                DOMCacheGetOrSet('openTesseracts').textContent = `Auto Open ${format(player.openTesseracts, 0)}%`;
            }
            DOMCacheGetOrSet('tesseractQuantity').textContent = format(player.wowTesseracts, 0, true)
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
            DOMCacheGetOrSet('tesseractBlessingTotalAmount').textContent = format(sumContents(tesseractArray.slice(1) as number[]), 0, true);
            break;
        }
        case 2: {
            if (player.autoOpenHypercubes) {
                DOMCacheGetOrSet('openHypercubes').textContent = `Auto Open ${format(player.openHypercubes, 0)}%`;
            }
            DOMCacheGetOrSet('hypercubeQuantity').textContent = format(player.wowHypercubes, 0, true)
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
            DOMCacheGetOrSet('hypercubeBlessingTotalAmount').textContent = format(sumContents(hypercubeArray.slice(1) as number[]), 0, true);
            break;
        }
        case 3: {
            if (player.autoOpenPlatonicsCubes) {
                DOMCacheGetOrSet('openPlatonicCube').textContent = `Auto Open ${format(player.openPlatonicsCubes, 0)}%`;
            }
            DOMCacheGetOrSet('platonicQuantity').textContent = format(player.wowPlatonicCubes, 0, true)
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
            DOMCacheGetOrSet('platonicBlessingTotalAmount').textContent = format(sumContents(platonicArray), 0, true);
            break;
        }
        case 4:
            DOMCacheGetOrSet('cubeAmount2').textContent = `You have ${format(player.wowCubes, 0, true)} Wow! Cubes =)`
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
    const text = type + 'ProgressBarText';
    const bar = type + 'ProgressBar';
    const textEl = DOMCacheGetOrSet(text);
    const barEl = DOMCacheGetOrSet(bar);
    const unlocked = player.hepteractCrafts[type].UNLOCKED;

    if (!unlocked) {
        textEl.textContent = 'LOCKED';
        barEl.style.width = '100%';
        barEl.style.backgroundColor = 'red';
    } else {
        const balance = player.hepteractCrafts[type].BAL;
        const cap = player.hepteractCrafts[type].CAP;
        const barWidth = Math.round((balance / cap) * 100);

        let barColor = '';
        if (barWidth < 34) {
            barColor = 'red';
        } else if (barWidth >= 34 && barWidth < 68) {
            barColor = '#cca300';
        } else {
            barColor = 'green';
        }

        textEl.textContent = format(balance) + ' / ' + format(cap);
        barEl.style.width = barWidth + '%';
        barEl.style.backgroundColor = barColor;
    }
}

export const visualUpdateCorruptions = () => {
    if (G['currentTab'] !== 'traits') {
        return
    }

    const metaData = CalcCorruptionStuff();
    const ascCount = calcAscensionCount();
    DOMCacheGetOrSet('autoAscendText').textContent = player.autoAscendMode === 'c10Completions' ? ' you\'ve completed Sadistic Challenge I a total of ' : ' the timer is at least ';
    DOMCacheGetOrSet('autoAscendMetric').textContent = format(player.autoAscendThreshold);
    DOMCacheGetOrSet('autoAscendText2').textContent = player.autoAscendMode === 'c10Completions' ? ' times, Currently ' : ' seconds (Real-time), Currently ';
    DOMCacheGetOrSet('autoAscendMetric2').textContent = player.autoAscendMode === 'c10Completions' ? String(player.challengecompletions[10]) : format(player.ascensionCounterRealReal);
    DOMCacheGetOrSet('corruptionBankValue').textContent = format(metaData[0]);
    DOMCacheGetOrSet('corruptionScoreValue').textContent = format(metaData[1], 0, true);
    DOMCacheGetOrSet('corruptionMultiplierValue').textContent = format(metaData[2], 1, true);
    DOMCacheGetOrSet('corruptionBonusMultiplierValue').textContent = format(metaData[9], 2, true);
    DOMCacheGetOrSet('corruptionTotalScore').textContent = format(metaData[3], 0, true);
    DOMCacheGetOrSet('corruptionCubesValue').textContent = format(metaData[4], 0, true);
    DOMCacheGetOrSet('corruptionTesseractsValue').textContent = format(metaData[5]);
    DOMCacheGetOrSet('corruptionHypercubesValue').textContent = format(metaData[6]);
    DOMCacheGetOrSet('corruptionPlatonicCubesValue').textContent = format(metaData[7]);
    DOMCacheGetOrSet('corruptionHepteractsValue').textContent = format(metaData[8]);
    DOMCacheGetOrSet('corruptionAntExponentValue').textContent = format((1 - 0.9 / 90 * sumContents(player.usedCorruptions)) * G['extinctionMultiplier'][player.usedCorruptions[7]], 3);
    DOMCacheGetOrSet('corruptionSpiritBonusValue').textContent = format(calculateCorruptionPoints()/400,2,true);
    DOMCacheGetOrSet('corruptionAscensionCount').style.display = ascCount > 1 ? 'block' : 'none';

    if (ascCount > 1) {
        DOMCacheGetOrSet('corruptionAscensionCountValue').textContent = format(calcAscensionCount());
    }
}

export const visualUpdateSettings = () => {
    if (G['currentTab'] !== 'settings') {
        return
    }

    if (player.subtabNumber === 0) {
        DOMCacheGetOrSet('saveString').textContent =
            `Currently: ${player.saveString.replace('$VERSION$', 'v' + version)}`;

        const quarkData = quarkHandler();
        const onExportQuarks = quarkData.gain
        const maxExportQuarks = quarkData.capacity

        let goldenQuarkMultiplier = 1
        goldenQuarkMultiplier *= 1 + player.worlds.BONUS / 100
        goldenQuarkMultiplier *= (player.highestSingularityCount >= 100 ? 1 + player.highestSingularityCount / 50 : 1)

        DOMCacheGetOrSet('quarktimerdisplay').textContent = format((3600 / (quarkData.perHour) - (player.quarkstimer % (3600.00001 / (quarkData.perHour)))), 2) + 's until +' + player.worlds.toString(1) + ' export Quark'
        DOMCacheGetOrSet('quarktimeramount').textContent =
            `Quarks on export: ${player.worlds.toString(onExportQuarks)} [Max ${player.worlds.toString(maxExportQuarks)}]`;

        DOMCacheGetOrSet('goldenQuarkTimerDisplay').textContent = format(3600 / Math.max(1, +player.singularityUpgrades.goldenQuarks3.getEffect().bonus) - (player.goldenQuarksTimer % (3600.00001 / Math.max(1,+player.singularityUpgrades.goldenQuarks3.getEffect().bonus)))) + 's until +' + format(goldenQuarkMultiplier, 2, true) + ' export Golden Quark'
        DOMCacheGetOrSet('goldenQuarkTimerAmount').textContent =
            `Golden Quarks on export: ${format(Math.floor(player.goldenQuarksTimer * +player.singularityUpgrades.goldenQuarks3.getEffect().bonus/ 3600) * goldenQuarkMultiplier, 2)} [Max ${format(Math.floor(168 * +player.singularityUpgrades.goldenQuarks3.getEffect().bonus * goldenQuarkMultiplier))}]`
    }
    if (player.subtabNumber === 2) {
        loadStatisticsUpdate();
    }
}

export const visualUpdateSingularity = () => {
    if (G['currentTab'] !== 'singularity') {
        return
    }
    if (player.subtabNumber === 0) {
        DOMCacheGetOrSet('goldenQuarkamount').textContent = 'You have ' + format(player.goldenQuarks, 0, true) + ' Golden Quarks!'
    }
}

export const visualUpdateOcteracts = () => {
    if (G['currentTab'] !== 'singularity') {
        return
    }
    DOMCacheGetOrSet('singOcts').textContent = format(player.wowOcteracts, 2, true, true, true)

    const perSecond = octeractGainPerSecond();

    DOMCacheGetOrSet('secondsPerOcteract').style.display = perSecond < 1 ? 'block' : 'none';
    DOMCacheGetOrSet('sPO').textContent = format(1 / perSecond, 2, true);
    DOMCacheGetOrSet('octeractPerSeconds').style.display = perSecond >= 1 ? 'block' : 'none';
    DOMCacheGetOrSet('oPS').textContent = format(perSecond, 2, true);

    const cTOCB = (calculateTotalOcteractCubeBonus() - 1) * 100;
    const cTOQB = (calculateTotalOcteractQuarkBonus() - 1) * 100;
    DOMCacheGetOrSet('totalOcts').textContent = `${format(player.totalWowOcteracts, 2, true, true, true)}`
    DOMCacheGetOrSet('totalOcteractCubeBonus').style.display = cTOCB >= 0.001 ? 'block' : 'none';
    DOMCacheGetOrSet('totalOcteractQuarkBonus').style.display = cTOQB >= 0.001 ? 'block' : 'none';
    DOMCacheGetOrSet('octCubeBonus').textContent = `+${format(cTOCB, 3, true)}%`
    DOMCacheGetOrSet('octQuarkBonus').textContent = `+${format(cTOQB, 3, true)}%`
}

export const visualUpdateShop = () => {
    if (G['currentTab'] !== 'shop') {
        return
    }
    DOMCacheGetOrSet('quarkamount').textContent = 'You have ' + format(player.worlds, 0, true) + ' Quarks!'
    DOMCacheGetOrSet('offeringpotionowned').textContent = 'Own: ' + format(player.shopUpgrades.offeringPotion)
    DOMCacheGetOrSet('obtainiumpotionowned').textContent = 'Own: ' + format(player.shopUpgrades.obtainiumPotion)

    // Create Keys with the correct type
    const keys = Object.keys(player.shopUpgrades) as (keyof Player['shopUpgrades'])[];
    for (const key of keys) {
        // Create a copy of shopItem instead of accessing many times
        const shopItem = shopData[key]

        if (shopItem.type === shopUpgradeTypes.CONSUMABLE) {
            const maxBuyablePotions = Math.min(Math.floor(Number(player.worlds)/getShopCosts(key)),shopData[key].maxLevel-player.shopUpgrades[key]);
            const el = DOMCacheGetOrSet(`buy${key.toLowerCase()}`);
            switch (player.shopBuyMaxToggle) {
                case false:
                    el.textContent = 'BUY: 100 Quarks Each';
                    break;
                case 'TEN':
                    el.textContent = `+${Math.min(10,maxBuyablePotions)} for ${format(getShopCosts(key)*Math.min(10,maxBuyablePotions),0,true)} Quarks`;
                    break;
                default:
                    el.textContent = `+${maxBuyablePotions} for ${format(getShopCosts(key)*maxBuyablePotions)} Quarks`;
            }
        }
        // Ignore all consumables, to be handled above, since they're different.
        if (shopItem.type === shopUpgradeTypes.UPGRADE) {
            // Case: If max level is 1, then it can be considered a boolean "bought" or "not bought" item
            if (shopItem.maxLevel === 1) {
                DOMCacheGetOrSet(`${key}Level`).textContent = player.shopUpgrades[key] >= shopItem.maxLevel ? 'Bought!' : 'Not Bought!';
            } else {
                // Case: max level greater than 1, treat it as a fraction out of max level
                DOMCacheGetOrSet(`${key}Level`).textContent = (player.singularityCount > 0 || player.ascensionCount > 0 ? '' : 'Level ') + format(player.shopUpgrades[key]) + '/' + format(shopItem.maxLevel);
            }
            // Handles Button - max level needs no price indicator, otherwise it's necessary

            const buyMaxAmount = shopData[key].maxLevel - player.shopUpgrades[key];
            let buyData:IMultiBuy;

            switch (player.shopBuyMaxToggle) {
                case false:
                    DOMCacheGetOrSet(`${key}Button`).textContent = player.shopUpgrades[key] >= shopItem.maxLevel ? 'Maxed!' : `Upgrade for ${format(getShopCosts(key))}  Quarks`;
                    break;
                case 'TEN':
                    buyData = calculateSummationNonLinear(player.shopUpgrades[key], shopData[key].price, +player.worlds, shopData[key].priceIncrease / shopData[key].price, Math.min(10,buyMaxAmount));
                    DOMCacheGetOrSet(`${key}Button`).textContent = player.shopUpgrades[key] >= shopItem.maxLevel ? 'Maxed!' : `+ ${format(buyData.levelCanBuy - player.shopUpgrades[key], 0, true)} for ${format(buyData.cost)} Quarks`;
                    break;
                default:
                    buyData = calculateSummationNonLinear(player.shopUpgrades[key], shopData[key].price, +player.worlds, shopData[key].priceIncrease / shopData[key].price, buyMaxAmount);
                    DOMCacheGetOrSet(`${key}Button`).textContent = player.shopUpgrades[key] >= shopItem.maxLevel ? 'Maxed!' : `+ ${format(buyData.levelCanBuy - player.shopUpgrades[key], 0, true)} for ${format(buyData.cost)} Quarks`;
            }

            const shopUnlock1 = document.getElementsByClassName('chal8Shop') as HTMLCollectionOf<HTMLElement>;
            const shopUnlock2 = document.getElementsByClassName('chal9Shop') as HTMLCollectionOf<HTMLElement>;
            const shopUnlock3 = document.getElementsByClassName('ascendunlockShop') as HTMLCollectionOf<HTMLElement>;
            const shopUnlock4 = document.getElementsByClassName('chal11Shop') as HTMLCollectionOf<HTMLElement>;
            const shopUnlock5 = document.getElementsByClassName('chal12Shop') as HTMLCollectionOf<HTMLElement>;
            const shopUnlock6 = document.getElementsByClassName('chal13Shop') as HTMLCollectionOf<HTMLElement>;
            const shopUnlock7 = document.getElementsByClassName('chal14Shop') as HTMLCollectionOf<HTMLElement>;
            const shopUnlock8 = document.getElementsByClassName('hepteractsShop') as HTMLCollectionOf<HTMLElement>;
            const singularityShopItems = document.getElementsByClassName('singularityShopUnlock') as HTMLCollectionOf<HTMLElement>;
            const singularityShopItems2 = document.getElementsByClassName('singularityShopUnlock2') as HTMLCollectionOf<HTMLElement>;
            const singularityShopItems3 = document.getElementsByClassName('singularityShopUnlock3') as HTMLCollectionOf<HTMLElement>;

            if (player.shopHideToggle && player.shopUpgrades[key] >= shopItem.maxLevel && !shopData[key].refundable) {
                if (player.singularityCount >= 20) {
                    shopData.offeringAuto.refundable = false;
                    shopData.offeringEX.refundable = false;
                    shopData.obtainiumAuto.refundable = false;
                    shopData.obtainiumEX.refundable = false;
                    shopData.antSpeed.refundable = false;
                    shopData.cashGrab.refundable = false;
                } else {
                    shopData.offeringAuto.refundable = true;
                    shopData.offeringEX.refundable = true;
                    shopData.obtainiumAuto.refundable = true;
                    shopData.obtainiumEX.refundable = true;
                    shopData.antSpeed.refundable = true;
                    shopData.cashGrab.refundable = true;
                }
                DOMCacheGetOrSet(`${key}Hide`).style.display = 'none';
            } else if (player.shopHideToggle && (player.shopUpgrades[key] < shopItem.maxLevel || shopData[key].refundable)) {
                DOMCacheGetOrSet(`${key}Hide`).style.display = 'block'; //This checks if you have something you are not supposed to have or supposed to.
                for (const i of Array.from(shopUnlock1)) {
                    if (i.style.display === 'block' && player.achievements[127] != 1) {
                        i.style.display = 'none';
                    }
                }
                for (const i of Array.from(shopUnlock2)) {
                    if (i.style.display === 'block' && player.achievements[134] != 1) {
                        i.style.display = 'none';
                    }
                }
                for (const i of Array.from(shopUnlock3)) {
                    if (i.style.display === 'block' && player.ascensionCount === 0) {
                        i.style.display = 'none';
                    }
                }
                for (const i of Array.from(shopUnlock4)) {
                    if (i.style.display === 'block' && player.challengecompletions[11] === 0) {
                        i.style.display = 'none';
                    }
                }
                for (const i of Array.from(shopUnlock5)) {
                    if (i.style.display === 'block' && player.challengecompletions[12] === 0) {
                        i.style.display = 'none';
                    }
                }
                for (const i of Array.from(shopUnlock6)) {
                    if (i.style.display === 'block' && player.challengecompletions[13] === 0) {
                        i.style.display = 'none';
                    }
                }
                for (const i of Array.from(shopUnlock7)) {
                    if (i.style.display === 'block' && player.challengecompletions[14] === 0) {
                        i.style.display = 'none';
                    }
                }
                for (const i of Array.from(shopUnlock8)) {
                    if (i.style.display === 'block' && player.challenge15Exponent < 1e15) {
                        i.style.display = 'none';
                    }
                }
                for (const i of Array.from(singularityShopItems)) {
                    if (i.style.display === 'block' && !player.singularityUpgrades.wowPass.getEffect().bonus) {
                        i.style.display = 'none';
                    }
                }
                for (const i of Array.from(singularityShopItems2)) {
                    if (i.style.display === 'block' && !player.singularityUpgrades.wowPass2.getEffect().bonus) {
                        i.style.display = 'none';
                    }
                }
                for (const i of Array.from(singularityShopItems3)) {
                    if (i.style.display === 'block' && !player.singularityUpgrades.wowPass3.getEffect().bonus) {
                        i.style.display = 'none';
                    }
                }
            } else if (!player.shopHideToggle) {
                DOMCacheGetOrSet('instantChallengeHide').style.display = 'block';
                DOMCacheGetOrSet('calculatorHide').style.display = 'block';
                if (shopData.offeringAuto.refundable === false) {
                    DOMCacheGetOrSet('offeringAutoHide').style.display = 'block';
                    DOMCacheGetOrSet('offeringEXHide').style.display = 'block';
                    DOMCacheGetOrSet('obtainiumAutoHide').style.display = 'block';
                    DOMCacheGetOrSet('obtainiumEXHide').style.display = 'block';
                    DOMCacheGetOrSet('antSpeedHide').style.display = 'block';
                    DOMCacheGetOrSet('cashGrabHide').style.display = 'block';
                }
                for (const i of Array.from(shopUnlock1)) {
                    i.style.display = player.achievements[127] === 1 ? 'block' : 'none';
                }
                for (const i of Array.from(shopUnlock2)) {
                    i.style.display = player.achievements[134] === 1 ? 'block' : 'none';
                }
                for (const i of Array.from(shopUnlock3)) {
                    i.style.display = player.ascensionCount > 0 ? 'block' : 'none';
                }
                for (const i of Array.from(shopUnlock4)) {
                    i.style.display = player.challengecompletions[11] > 0 ? 'block' : 'none';
                }
                for (const i of Array.from(shopUnlock5)) {
                    i.style.display = player.challengecompletions[12] > 0 ? 'block' : 'none';
                }
                for (const i of Array.from(shopUnlock6)) {
                    i.style.display = player.challengecompletions[13] > 0 ? 'block' : 'none';
                }
                for (const i of Array.from(shopUnlock7)) {
                    i.style.display = player.challengecompletions[14] > 0 ? 'block' : 'none';
                }
                for (const i of Array.from(shopUnlock8)) {
                    i.style.display = player.challenge15Exponent >= 1e15 ? 'block' : 'none';
                }
                for (const i of Array.from(singularityShopItems)) {
                    i.style.display = player.singularityUpgrades.wowPass.getEffect().bonus ? 'block' : 'none';
                }
                for (const i of Array.from(singularityShopItems2)) {
                    i.style.display = player.singularityUpgrades.wowPass2.getEffect().bonus ? 'block' : 'none';
                }
                for (const i of Array.from(singularityShopItems3)) {
                    i.style.display = player.singularityUpgrades.wowPass3.getEffect().bonus ? 'block' : 'none';
                }
            }
        }
    }

    DOMCacheGetOrSet('buySingularityQuarksAmount').textContent = `${player.goldenQuarks < 1000 ? 'Owned: ' : ''}${format(player.goldenQuarks)}`
    DOMCacheGetOrSet('buySingularityQuarksButton').textContent = `Buy! ${format(getGoldenQuarkCost().cost)} Quarks Each`
}
