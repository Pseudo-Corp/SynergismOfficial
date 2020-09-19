function resettimers() {
    player.prestigecounter += 0.05;
    player.transcendcounter += 0.05;
    player.reincarnationcounter += 0.05;
}

function displayRuneInformation(i, updatelevelup) {
    updatelevelup = (updatelevelup === null || updatelevelup === undefined) ? true : updatelevelup;

    let m = effectiveLevelMult
    let SILevelMult = (1 + player.researches[84] / 200)
    let amountPerOffering = calculateRuneExpGiven(i - 1, false, player.runelevels[i - 1]);
    if (player.upgrades[78] === 1) {
        document.getElementById("toggleofferingbuy").textContent = "Toggle amount used by sacrifice, multiplied by 1000 due to a Reincarnation Upgrade.";
    }


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
            document.getElementById("runeshowlevelup").textContent = "+0.125% building cost growth delay per level, +0.065% offering recycle chance per level [MAX: 25%], 2^((1000 - Level)/1100) Tax growth multiplier AFTER level 400"
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
        let offerings = calculateOfferingsToLevelXTimes(i - 1, player.runelevels[i - 1], 1)[0]
        document.getElementById("runeDisplayInfo").textContent = `+${format(amountPerOffering)} EXP per offering. ${format(offerings)} Offerings to level up.`
    }

}


function resetofferings(i) {
    player.runeshards += calculateOfferings(i)
}

function redeemShards(runeIndexPlusOne, auto = false, autoMult = 1, cubeUpgraded = 0) {

    // if automated && 2x10 cube upgrade bought, this will be >0.
    // runeIndex, the rune being added to
    let runeIndex = runeIndexPlusOne - 1;

    if (player.upgrades[78] === 1) {
        autoMult *= 1000
    }

    // Whether or not a rune is unlocked array
    let unlockedRune = [
        true,
        player.achievements[38] > 0.5,
        player.achievements[44] > 0.5,
        player.achievements[102] > 0.5,
        player.researches[82] > 0.5
    ];

    let recycleMultiplier = calculateRecycleMultiplier();

    // amount of offerings being spent, if offerings is less than amount set to be bought then set amount to current offerings
    let amount = Math.min(player.runeshards, player.offeringbuyamount * (1 + 999 * player.upgrades[78]));
    if (player.offeringbuyamount === 1000) {
        amount = player.runeshards
    }

    // if autobuyer is enabled then set the amount to the proper autobuyer amount based on the shop upgrade level, or current offerings if it's less than that
    if (auto) {
        amount = Math.min(player.runeshards, 50 * Math.pow(2, player.shopUpgrades.offeringAutoLevel) * autoMult)
    }
    if (auto && cubeUpgraded > 0) {
        amount = cubeUpgraded
    }
    if (player.runeshards >= 1 && player.runelevels[runeIndex] < calculateMaxRunes(runeIndex + 1) && unlockedRune[runeIndex]) {
        // Removes the offerings from the player
        player.runeshards -= amount;
        // Adds the exp given by the amount of offerings
        player.runeexp[runeIndex] += amount * calculateRuneExpGiven(runeIndex);
        // foreach rune update it's value
        for (let runeToUpdate = 0; runeToUpdate < 5; ++runeToUpdate) {
            if (unlockedRune[runeToUpdate]) {
                if (runeToUpdate !== runeIndex) {
                    player.runeexp[runeToUpdate] += amount * calculateRuneExpGiven(runeToUpdate, true)
                }
                while (player.runeexp[runeToUpdate] >= calculateRuneExpToLevel(runeToUpdate) && player.runelevels[runeToUpdate] < calculateMaxRunes(runeToUpdate + 1)) {
                    player.runelevels[runeToUpdate] += 1;
                }
            }
        }

        displayRuneInformation(runeIndexPlusOne);
    }
    calculateRuneLevels();
    if (player.runeshards < 0) {
        player.runeshards = 0
    }
}

function calculateOfferingsToLevelXTimes(runeIndex, runeLevel, levels) {
    let exp = calculateRuneExpToLevel(runeIndex, runeLevel) - player.runeexp[runeIndex]
    let arr = []
    let levelsAdded = 0
    while (levelsAdded < levels) {
        let expPerOff = calculateRuneExpGiven(runeIndex, false, runeLevel + levelsAdded)
        let amount = Math.ceil(exp / expPerOff)
        arr.push(amount)
        levelsAdded += 1
        exp = calculateRuneExpToLevel(runeIndex, runeLevel + levelsAdded)
            - calculateRuneExpToLevel(runeIndex, runeLevel + levelsAdded - 1)
    }
    return arr;
}
