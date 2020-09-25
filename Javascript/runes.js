function resettimers() {
    player.prestigecounter += 0.05;
    player.transcendcounter += 0.05;
    player.reincarnationcounter += 0.05;
}

function displayRuneInformation(i, updatelevelup) {
    updatelevelup = (updatelevelup === null || updatelevelup === undefined) ? true : updatelevelup;

    let m = effectiveLevelMult
    let SILevelMult = (1 + player.researches[84] / 200 * (1 + 1 * effectiveRuneSpiritPower[5] * calculateCorruptionPoints()/400))
    let amountPerOffering = calculateRuneExpGiven(i - 1, false, player.runelevels[i - 1]);


    if (i === 1) {
        if (updatelevelup) {
            document.getElementById("runeshowlevelup").textContent = "+(Level/4)^1.25 Accelerator, +0.25% Accelerators per level. +1 Accelerator Boost every 20 levels!"
        }
        document.getElementById("runeshowpower1").childNodes[0].textContent = "Speed Rune Bonus: " + "+" + format(Math.floor(Math.pow(rune1level * m / 4, 1.25))) + " Accelerators, +" + format((rune1level / 4 * m), 2, true) + "% Accelerators, +" + format(Math.floor(rune1level / 20 * m)) + " Accelerator Boosts."
    }
    if (i === 2) {
        if (updatelevelup) {
            document.getElementById("runeshowlevelup").textContent = "+(Level/10) Multipliers every 10th level, +0.25% Multipliers per level. Tax growth is delayed more for each level!"
        }
        document.getElementById("runeshowpower2").childNodes[0].textContent = "Duplication Rune Bonus: " + "+" + format(Math.floor(rune2level * m / 10) * Math.floor(1 + rune2level * m / 10) / 2) + " Multipliers, +" + format(m * rune2level / 4, 1, true) + "% Multipliers, -" + (99.9 * (1 - Math.pow(6, -(rune2level * m) / 1000))).toPrecision(4) + "% Tax Growth."
    }
    if (i === 3) {
        if (updatelevelup) {
            document.getElementById("runeshowlevelup").textContent = "~(1 + (Level/2)^2 * 2^(Level/2) / 256)x Crystal Production. +1 free level for each Crystal upgrade per 16 levels!"
        }
        document.getElementById("runeshowpower3").childNodes[0].textContent = "Prism Rune Bonus: " + "All Crystal Producer production multiplied by " + format(Decimal.pow(rune3level * m / 2, 2).times(Decimal.pow(2, rune3level * m / 2 - 8)).add(1), 3) + ", gain +" + format(Math.floor(rune3level / 16 * m)) + " free crystal levels."
    }
    if (i === 4) {
        if (updatelevelup) {
            document.getElementById("runeshowlevelup").textContent = "+0.125% building cost growth delay per level, +0.0625% offering recycle chance per level [MAX: 25%], 2^((1000 - Level)/1100) Tax growth multiplier AFTER level 400"
        }
        document.getElementById("runeshowpower4").childNodes[0].textContent = "Thrift Rune Bonus: " + "Delay all producer cost increases by " + (rune4level / 8 * m).toPrecision(3) + "%. Offering recycle chance: +" + Math.min(25, rune4level / 16) + "%. -" + (99 * (1 - Math.pow(4, Math.min(0, (400 - rune4level) / 1100)))).toPrecision(4) + "% Tax Growth"
    }
    if (i === 5) {
        if (updatelevelup) {
            document.getElementById("runeshowlevelup").textContent = "~(1 + level/200)x Obtainium, (1 + Level^2/2500)x Ant Hatch Speed, +0.005 base offerings for each tier per level"
        }
        document.getElementById("runeshowpower5").childNodes[0].textContent = "S. Intellect Rune Bonus: " + "Obtainium gain x" + format((1 + rune5level / 200 * m * SILevelMult), 2, true) + ". Ant Speed: x" + format(1 + Math.pow(rune5level * m * SILevelMult, 2) / 2500) + ". Base Offerings: +" + format((rune5level * m * SILevelMult * 0.005), 3, true)
    }
    if (updatelevelup) {
        let arr = calculateOfferingsToLevelXTimes(i - 1, player.runelevels[i - 1], player.offeringbuyamount);
        let offerings = 0;
        let j = 0;
        while (offerings < player.runeshards && j < arr.length) {
            offerings += arr[j]
            j++;
        }
        let check = player.offeringbuyamount === j && offerings <= player.runeshards
        let s = player.offeringbuyamount === 1 ? "once" : `${check ? j : Math.max(j - 1, 0)} times`
        document.getElementById("runeDisplayInfo").textContent = `+${format(amountPerOffering)} EXP per offering. ${format(offerings)} Offerings to level up ${s}.`
    }

}


function resetofferings(i) {
    player.runeshards += calculateOfferings(i)
}

function redeemShards(runeIndexPlusOne, auto = false, cubeUpgraded = 0) {
    // if automated && 2x10 cube upgrade bought, this will be >0.
    // runeIndex, the rune being added to
    let runeIndex = runeIndexPlusOne - 1;

    // Whether or not a rune is unlocked array
    let unlockedRune = [
        true,
        player.achievements[38] > 0.5,
        player.achievements[44] > 0.5,
        player.achievements[102] > 0.5,
        player.researches[82] > 0.5
    ];

    let levelsToAdd = player.offeringbuyamount
    if (auto) {
        levelsToAdd = Math.pow(2, player.shopUpgrades.offeringAutoLevel)
    }
    if (auto && cubeUpgraded > 0) {
        levelsToAdd = Math.min(1e4, calculateMaxRunes(runeIndex + 1)) // limit to max 10k levels per call so the execution doesn't take too long if things get stuck
    }
    let levelsAdded = 0
    if (player.runeshards > 0 && player.runelevels[runeIndex] < calculateMaxRunes(runeIndex + 1) && unlockedRune[runeIndex]) {
        let all = 0
        let maxLevel = calculateMaxRunes(runeIndex + 1)
        let amountArr = calculateOfferingsToLevelXTimes(runeIndex, player.runelevels[runeIndex], levelsToAdd)
        let toSpendTotal = Math.min(player.runeshards, amountArr.reduce((x, y) => x + y, 0))
        if (cubeUpgraded > 0) {
            toSpendTotal = Math.min(player.runeshards, cubeUpgraded)
        }
        let fact = calculateRuneExpGiven(runeIndex, false, player.runelevels[runeIndex], true)
        let a = player.upgrades[71] / 25
        let add = fact[0] - a * player.runelevels[runeIndex]
        let mult = fact.slice(1, fact.length).reduce((x, y) => x * y, 1)
        while (toSpendTotal > 0 && levelsAdded < levelsToAdd && player.runelevels[runeIndex] < maxLevel) {
            let exp = calculateRuneExpToLevel(runeIndex, player.runelevels[runeIndex]) - player.runeexp[runeIndex]
            let expPerOff = (add + a * player.runelevels[runeIndex]) * mult;
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

//if this function is not used anywhere else outside of runes.js then it can be deleted as it is no longer called within runes.js
function calculateOfferingsToLevelXTimes(runeIndex, runeLevel, levels) {
    let exp = calculateRuneExpToLevel(runeIndex, runeLevel) - player.runeexp[runeIndex]
    let maxLevel = calculateMaxRunes(runeIndex + 1)
    let arr = []
    let sum = 0
    let off = player.runeshards
    let levelsAdded = 0
    let fact = calculateRuneExpGiven(runeIndex, false, runeLevel, true)
    let a = player.upgrades[71] / 25
    let add = fact[0] - a * runeLevel
    let mult = fact.slice(1, fact.length).reduce((x, y) => x * y, 1)
    while (levelsAdded < levels && runeLevel + levelsAdded < maxLevel && sum < off) {
        let expPerOff = (add + a * (runeLevel + levelsAdded)) * mult
        let amount = Math.ceil(exp / expPerOff)
        sum += amount
        arr.push(amount)
        levelsAdded += 1
        exp = calculateRuneExpToLevel(runeIndex, runeLevel + levelsAdded)
            - calculateRuneExpToLevel(runeIndex, runeLevel + levelsAdded - 1)
    }
    return arr;
}
