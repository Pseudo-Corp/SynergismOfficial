function resettimers() {
    player.prestigecounter += 0.05;
    player.transcendcounter += 0.05;
    player.reincarnationcounter += 0.05;
}

function displayRuneInformation(i, updatelevelup) {
    updatelevelup = (updatelevelup === null || updatelevelup === undefined) ? true : updatelevelup;

    let m = effectiveLevelMult
    let SILevelMult = (1 + player.researches[84] / 200)
    let amountPerOffering = calculateRuneExpGiven(i - 1);
    if (player.upgrades[78] === 1) document.getElementById("toggleofferingbuy").innerHTML = "Toggle amount used by sacrifice, multiplied by 1000<br>due to a Reincarnation Upgrade.";


    if (i === 1) {
        if (updatelevelup) {
            document.getElementById("runeshowlevelup").textContent = "+(Level/10)^1.25 Accelerator, +0.1% Accelerators per level. +1 Accelerator Boost every 50 levels!"
        }
        document.getElementById("runeshowpower1").childNodes[0].textContent = "Speed Rune Bonus: " + "+" + format(Math.floor(Math.pow(rune1level * m / 10, 1.25))) + " Accelerators, +" + format((rune1level / 10 * m), 2, true) + "% Accelerators, +" + format(Math.floor(rune1level / 50 * m)) + " Accelerator Boosts."
    }
    if (i === 2) {
        if (updatelevelup) {
            document.getElementById("runeshowlevelup").textContent = "+(Level/25) Multipliers every 25th level, +0.1% Multipliers per level. Tax growth is delayed more for each level!"
        }
        document.getElementById("runeshowpower2").childNodes[0].textContent = "Duplication Rune Bonus: " + "+" + format(Math.floor(rune2level * m / 25) * Math.floor(1 + rune2level * m / 25) / 2) + " Multipliers, +" + format(m * rune2level / 10, 1, true) + "% Multipliers, -" + (99.9 * (1 - Math.pow(6, -(rune2level * m) / 2500))).toPrecision(4) + "% Tax Growth."
    }
    if (i === 3) {
        if (updatelevelup) {
            document.getElementById("runeshowlevelup").textContent = "~(1 + (Level/5)^2 * 2^(Level/5) / 256)x Crystal Production. +1 free level for each Crystal upgrade per 40 levels!"
        }
        document.getElementById("runeshowpower3").childNodes[0].textContent = "Prism Rune Bonus: " + "All Crystal Producer production multiplied by " + format(Decimal.pow(rune3level * m / 5, 2).times(Decimal.pow(2, rune3level * m / 5 - 8)).add(1), 3) + ", gain +" + format(Math.floor(rune3level / 40 * m)) + " free crystal levels."
    }
    if (i === 4) {
        if (updatelevelup) {
            document.getElementById("runeshowlevelup").textContent = "+0.05% building cost growth delay per level, +0.025% offering recycle chance per level [MAX: 25%], 2^((1000 - Level)/2750) Tax growth multiplier AFTER level 1000"
        }
        document.getElementById("runeshowpower4").childNodes[0].textContent = "Thrift Rune Bonus: " + "Delay all producer cost increases by " + (rune4level / 20 * m).toPrecision(3) + "%. Offering recycle chance: +" + Math.min(25, rune4level / 40) + "%. -" + (99 * (1 - Math.pow(4, Math.min(0, (1000 - rune4level) / 2750)))).toPrecision(4) + "% Tax Growth"
    }
    if (i === 5) {
        if (updatelevelup) {
            document.getElementById("runeshowlevelup").textContent = "~(1 + level/500)x Obtainium, (1 + Level^2/20000)x Ant Hatch Speed, +0.002 base offerings for each tier per level"
        }
        document.getElementById("runeshowpower5").childNodes[0].textContent = "S. Intellect Rune Bonus: " + "Obtainium gain x" + format((1 + rune5level / 500 * m * SILevelMult), 2, true) + ". Ant Speed: x" + format(1 + Math.pow(rune5level * m * SILevelMult, 2) / 20000) + ". Base Offerings: +" + format((rune5level * m * SILevelMult * 0.002), 3, true)
    }
    if (updatelevelup) document.getElementById("runedisplayexp").textContent = "+" + format(amountPerOffering) + " EXP per offering."


}


function resetofferings(i) {
    player.runeshards += calculateOfferings(i)
}

function redeemShards(runeIndexPlusOne, auto, autoMult, cubeUpgraded) {

    // if automated && 2x10 cube upgrade bought, this will be >0.
    cubeUpgraded = cubeUpgraded || 0;
    // runeIndex, the rune being added to
    let runeIndex = runeIndexPlusOne - 1;

    auto = auto || false;
    autoMult = autoMult || 1;
    if (player.upgrades[78] === 1) {
        autoMult *= 1000
    }

    // How much a runes max level is increased by
    let increaseMaxLevel = [
        25 * (player.researches[78] + player.researches[111] + 2 * player.cubeUpgrades[16] + 2 * player.cubeUpgrades[37]) + 8 * player.constantUpgrades[7] + 200 * player.challengecompletions[11] + 500 * player.challengecompletions[14] + 2 * player.researches[200] + 2 * player.cubeUpgrades[50],
        25 * (player.researches[80] + player.researches[112] + 2 * player.cubeUpgrades[16] + 2 * player.cubeUpgrades[37]) + 8 * player.constantUpgrades[7] + 200 * player.challengecompletions[11] + 500 * player.challengecompletions[14] + 2 * player.researches[200] + 2 * player.cubeUpgrades[50],
        25 * (player.researches[79] + player.researches[113] + 2 * player.cubeUpgrades[16] + 2 * player.cubeUpgrades[37]) + 8 * player.constantUpgrades[7] + 200 * player.challengecompletions[11] + 500 * player.challengecompletions[14] + 2 * player.researches[200] + 2 * player.cubeUpgrades[50],
        25 * (player.researches[77] + player.researches[114] + 2 * player.cubeUpgrades[16] + 2 * player.cubeUpgrades[37]) + 8 * player.constantUpgrades[7] + 200 * player.challengecompletions[11] + 500 * player.challengecompletions[14] + 2 * player.researches[200] + 2 * player.cubeUpgrades[50],
        25 * (player.researches[115] + 2 * player.cubeUpgrades[16] + 2 * player.cubeUpgrades[37]) + 8 * player.constantUpgrades[7] + 200 * player.challengecompletions[11] + 500 * player.challengecompletions[14] + 2 * player.researches[200] + 2 * player.cubeUpgrades[50]
    ];

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
    if (player.offeringbuyamount > 100) {
        amount = player.runeshards
    }

    // if autobuyer is enabled then set the amount to the proper autobuyer amount based on the shop upgrade level, or current offerings if it's less than that
    if (auto) {
        amount = Math.min(player.runeshards, 50 * Math.pow(2, player.shopUpgrades.offeringAutoLevel) * autoMult)
    }
    if (auto && cubeUpgraded > 0) {
        amount = cubeUpgraded
    }
    if (player.runeshards >= 1 && player.runelevels[runeIndex] < (2500 + increaseMaxLevel[runeIndex]) && unlockedRune[runeIndex]) {
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
                while (player.runeexp[runeToUpdate] >= calculateRuneExpToLevel(runeToUpdate) && player.runelevels[runeToUpdate] < (2500 + increaseMaxLevel[runeToUpdate])) {
                    player.runelevels[runeToUpdate] += 1;
                }
            }
        }

        displayRuneInformation(runeIndexPlusOne);
    }
    calculateRuneLevels();
}