import { player, format } from './Synergism';
import { calculateRuneExpGiven, calculateCorruptionPoints, calculateOfferings, calculateMaxRunes, calculateRuneExpToLevel, calculateRuneLevels, calculateEffectiveIALevel } from './Calculate';
import { Globals as G } from './Variables';

import Decimal from 'break_infinity.js';
import { resetNames } from './types/Synergism';
import { DOMCacheGetOrSet } from './Cache/DOM';

export const displayRuneInformation = (i: number, updatelevelup = true) => {
    const m = G['effectiveLevelMult']
    const SILevelMult = (1 + player.researches[84] / 200 * (1 + 1 * G['effectiveRuneSpiritPower'][5] * calculateCorruptionPoints()/400))
    const amountPerOffering = calculateRuneExpGiven(i - 1, false, player.runelevels[i - 1]);


    if (i === 1) {
        if (updatelevelup) {
            DOMCacheGetOrSet("runeshowlevelup").textContent = "+(Level/4)^1.25 Accelerator, +0.25% Accelerators per level. +1 Accelerator Boost every 20 levels!"
        }
        DOMCacheGetOrSet("runeshowpower1").textContent = "Speed Rune Bonus: " + "+" + format(Math.floor(Math.pow(G['rune1level'] * m / 4, 1.25))) + " Accelerators, +" + format((G['rune1level'] / 4 * m), 2, true) + "% Accelerators, +" + format(Math.floor(G['rune1level'] / 20 * m)) + " Accelerator Boosts."
    }
    if (i === 2) {
        if (updatelevelup) {
            DOMCacheGetOrSet("runeshowlevelup").textContent = "+(Level/10) Multipliers every 10th level, +0.25% Multipliers per level. Tax growth is delayed more for each level!"
        }
        DOMCacheGetOrSet("runeshowpower2").textContent = "Duplication Rune Bonus: " + "+" + format(Math.floor(G['rune2level'] * m / 10) * Math.floor(1 + G['rune2level'] * m / 10) / 2) + " Multipliers, +" + format(m * G['rune2level'] / 4, 1, true) + "% Multipliers, -" + (99.9 * (1 - Math.pow(6, -(G['rune2level'] * m) / 1000))).toPrecision(4) + "% Tax Growth."
    }
    if (i === 3) {
        if (updatelevelup) {
            DOMCacheGetOrSet("runeshowlevelup").textContent = "~(1 + (Level/2)^2 * 2^(Level/2) / 256)x Crystal Production. +1 free level for each Crystal upgrade per 16 levels!"
        }
        DOMCacheGetOrSet("runeshowpower3").textContent = "Prism Rune Bonus: " + "All Crystal Producer production multiplied by " + format(Decimal.pow(G['rune3level'] * m / 2, 2).times(Decimal.pow(2, G['rune3level'] * m / 2 - 8)).add(1), 3) + ", gain +" + format(Math.floor(G['rune3level'] / 16 * m)) + " free crystal levels."
    }
    if (i === 4) {
        if (updatelevelup) {
            DOMCacheGetOrSet("runeshowlevelup").textContent = "+0.125% building cost growth delay per level, +0.0625% offering recycle chance per level [MAX: 25%], 2^((1000 - Level)/1100) Tax growth multiplier AFTER level 400"
        }
        DOMCacheGetOrSet("runeshowpower4").textContent = "Thrift Rune Bonus: " + "Delay all producer cost increases by " + (G['rune4level'] / 8 * m).toPrecision(3) + "%. Offering recycle chance: +" + Math.min(25, G['rune4level'] / 16) + "%. -" + (99 * (1 - Math.pow(4, Math.min(0, (400 - G['rune4level']) / 1100)))).toPrecision(4) + "% Tax Growth"
    }
    if (i === 5) {
        if (updatelevelup) {
            DOMCacheGetOrSet("runeshowlevelup").textContent = "~(1 + level/200)x Obtainium, (1 + Level^2/2500)x Ant Hatch Speed, +0.005 base offerings for each tier per level"
        }
        DOMCacheGetOrSet("runeshowpower5").textContent = "S. Intellect Rune Bonus: " + "Obtainium gain x" + format((1 + G['rune5level'] / 200 * m * SILevelMult), 2, true) + ". Ant Speed: x" + format(1 + Math.pow(G['rune5level'] * m * SILevelMult, 2) / 2500) + ". Base Offerings: +" + format((G['rune5level'] * m * SILevelMult * 0.005), 3, true)
    }
    if (i === 6) {
        if (updatelevelup) {
            DOMCacheGetOrSet("runeshowlevelup").textContent = "+0.2% Quarks, +1% all cube types per level! Start with +10% Quarks."
        }
        DOMCacheGetOrSet("runeshowpower6").textContent = "IA Rune Bonus: " + " Quark Gain +" + format(10 + 15/75 * calculateEffectiveIALevel(), 1, true) + "%, Ascensions give +" + format(1 * calculateEffectiveIALevel(), 0, true) + "% more of all cube types."
    }

    if (i === 7) {
        if (updatelevelup) {
            DOMCacheGetOrSet("runeshowlevelup").textContent = "I wonder what happens if you feed it " + format(1e256 * (1 + player.singularityCount)) + " Rune EXP."
        }
        DOMCacheGetOrSet("runeshowpower7").textContent = "You cannot grasp the true form of Ant God's treasure."
    }

    if (updatelevelup) {
        const arr = calculateOfferingsToLevelXTimes(i - 1, player.runelevels[i - 1], player.offeringbuyamount);
        let offerings = 0;
        let j = 0;
        while (offerings < player.runeshards && j < arr.length) {
            offerings += arr[j]
            j++;
        }
        const check = player.offeringbuyamount === j && offerings <= player.runeshards
        const s = player.offeringbuyamount === 1 ? "once" : `${check ? j : Math.max(j - 1, 0)} times`
        DOMCacheGetOrSet("runeDisplayInfo").textContent = `+${format(amountPerOffering)} EXP per offering. ${format(offerings)} Offerings to level up ${s}.`
    }

}

export const resetofferings = (input: resetNames) => {
    player.runeshards += calculateOfferings(input);
}

export const redeemShards = (runeIndexPlusOne: number, auto = false, cubeUpgraded = 0) => {
    // if automated && 2x10 cube upgrade bought, this will be >0.
    // runeIndex, the rune being added to
    const runeIndex = runeIndexPlusOne - 1;

    // Whether or not a rune is unlocked array
    const unlockedRune = [
        true,
        player.achievements[38] > 0.5,
        player.achievements[44] > 0.5,
        player.achievements[102] > 0.5,
        player.researches[82] > 0.5,
        player.shopUpgrades.infiniteAscent,
        player.platonicUpgrades[20] > 0,
    ];

    let levelsToAdd = player.offeringbuyamount
    if (auto) {
        levelsToAdd = Math.pow(2, player.shopUpgrades.offeringAuto);
    }
    if (auto && cubeUpgraded > 0) {
        levelsToAdd = Math.min(1e4, calculateMaxRunes(runeIndex + 1)) // limit to max 10k levels per call so the execution doesn't take too long if things get stuck
    }
    let levelsAdded = 0
    if (player.runeshards > 0 && player.runelevels[runeIndex] < calculateMaxRunes(runeIndex + 1) && unlockedRune[runeIndex]) {
        let all = 0
        const maxLevel = calculateMaxRunes(runeIndex + 1)
        const amountArr = calculateOfferingsToLevelXTimes(runeIndex, player.runelevels[runeIndex], levelsToAdd)
        let toSpendTotal = Math.min(player.runeshards, amountArr.reduce((x, y) => x + y, 0))
        if (cubeUpgraded > 0) {
            toSpendTotal = Math.min(player.runeshards, cubeUpgraded)
        }
        const fact = calculateRuneExpGiven(runeIndex, false, player.runelevels[runeIndex], true)
        const a = player.upgrades[71] / 25
        const add = fact[0] - a * player.runelevels[runeIndex]
        const mult = fact.slice(1, fact.length).reduce((x, y) => x * y, 1)
        while (toSpendTotal > 0 && levelsAdded < levelsToAdd && player.runelevels[runeIndex] < maxLevel) {
            const exp = calculateRuneExpToLevel(runeIndex, player.runelevels[runeIndex]) - player.runeexp[runeIndex]
            const expPerOff = (add + a * player.runelevels[runeIndex]) * mult;
            let toSpend = Math.min(toSpendTotal, Math.ceil(exp / expPerOff))
            if (toSpend === undefined || isNaN(toSpend)) {
                toSpend = toSpendTotal
            }
            toSpendTotal -= toSpend
            player.runeshards -= toSpend
            player.runeexp[runeIndex] += toSpend * expPerOff
            all += toSpend
            while (player.runeexp[runeIndex] >= calculateRuneExpToLevel(runeIndex) && player.runelevels[runeIndex] < maxLevel) {
                player.runelevels[runeIndex] += 1;
                levelsAdded++;
            }
        }
        for (let runeToUpdate = 0; runeToUpdate < 5; ++runeToUpdate) {
            if (unlockedRune[runeToUpdate]) {
                if (runeToUpdate !== runeIndex) {
                    player.runeexp[runeToUpdate] += all * calculateRuneExpGiven(runeToUpdate, true)
                }
                while (player.runeexp[runeToUpdate] >= calculateRuneExpToLevel(runeToUpdate) && player.runelevels[runeToUpdate] < calculateMaxRunes(runeToUpdate + 1)) {
                    player.runelevels[runeToUpdate] += 1;
                }
            }
        }
        displayRuneInformation(runeIndexPlusOne);
    }
    calculateRuneLevels();
    if (player.runeshards < 0 || player.runeshards === undefined) {
        player.runeshards = 0
    }
}

export const calculateOfferingsToLevelXTimes = (runeIndex: number, runeLevel: number, levels: number) => {
    let exp = calculateRuneExpToLevel(runeIndex, runeLevel) - player.runeexp[runeIndex]
    const maxLevel = calculateMaxRunes(runeIndex + 1)
    const arr = []
    let sum = 0
    const off = player.runeshards
    let levelsAdded = 0
    const fact = calculateRuneExpGiven(runeIndex, false, runeLevel, true);
    const a = player.upgrades[71] / 25
    const add = fact[0] - a * runeLevel
    const mult = fact.slice(1, fact.length).reduce((x, y) => x * y, 1)
    while (levelsAdded < levels && runeLevel + levelsAdded < maxLevel && sum < off) {
        const expPerOff = (add + a * (runeLevel + levelsAdded)) * mult
        const amount = Math.ceil(exp / expPerOff)
        sum += amount
        arr.push(amount)
        levelsAdded += 1
        exp = calculateRuneExpToLevel(runeIndex, runeLevel + levelsAdded)
            - calculateRuneExpToLevel(runeIndex, runeLevel + levelsAdded - 1)
    }
    return arr;
}
