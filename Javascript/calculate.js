function sumObject(obj) {
    let sum = 0;
    for (let el in obj) {
        sum += obj[el]
    }
    return (sum)
}

// Returns the sum of all contents in an array
function sumContents(array) {
    let sum = 0;
    for (let i = 0; i < array.length; ++i) {
        sum += array[i];
    }
    return sum;
}

// Returns the product of all contents in an array
function productContents(array) {
    let product = 1;
    for (let i = 0; i < array.length; ++i) {
        product *= array[i];
    }
    return product;
}

function calculateTotalCoinOwned() {
    totalCoinOwned = player.firstOwnedCoin + player.secondOwnedCoin + player.thirdOwnedCoin + player.fourthOwnedCoin + player.fifthOwnedCoin;
}

function calculateTotalAcceleratorBoost() {
    let b = 0
    if (player.upgrades[26] > 0.5) {
        b += 1;
    }
    if (player.upgrades[31] > 0.5) {
        b += Math.floor(totalCoinOwned / 2000) * 100 / 100
    }
    if (player.achievements[7] > 0.5) {
        b += Math.floor(player.firstOwnedCoin / 2000)
    }
    if (player.achievements[14] > 0.5) {
        b += Math.floor(player.secondOwnedCoin / 2000)
    }
    if (player.achievements[21] > 0.5) {
        b += Math.floor(player.thirdOwnedCoin / 2000)
    }
    if (player.achievements[28] > 0.5) {
        b += Math.floor(player.fourthOwnedCoin / 2000)
    }
    if (player.achievements[35] > 0.5) {
        b += Math.floor(player.fifthOwnedCoin / 2000)
    }

    b += player.researches[93] * Math.floor(1 / 20 * (rune1level + rune2level + rune3level + rune4level + rune5level))
    b += Math.floor((0.01 + rune1level) * effectiveLevelMult / 50);
    b *= (1 + 1 / 5 * player.researches[3])
    b *= (1 + 1 / 20 * player.researches[16] + 1 / 20 * player.researches[17])
    b *= (1 + 1 / 20 * player.researches[88])
    b *= calculateSigmoidExponential(20, (player.antUpgrades[4] + bonusant4) / 1000 * 20 / 19)
    b *= (1 + 1 / 100 * player.researches[127])
    b *= (1 + 0.8 / 100 * player.researches[142])
    b *= (1 + 0.6 / 100 * player.researches[157])
    b *= (1 + 0.4 / 100 * player.researches[172])
    b *= (1 + 0.2 / 100 * player.researches[187])
    b *= (1 + 0.01 / 100 * player.researches[200])
    b *= (1 + 0.01 / 100 * player.cubeUpgrades[50])
    if (player.upgrades[73] > 0.5 && player.currentChallenge.reincarnation !== 0) {
        b *= 2
    }
    b = Math.floor(b)
    freeAcceleratorBoost = b;

    totalAcceleratorBoost = Math.floor(player.acceleratorBoostBought + freeAcceleratorBoost) * 100 / 100;
}


function calculateAcceleratorMultiplier() {
    acceleratorMultiplier = 1;
    acceleratorMultiplier *= (1 + player.achievements[60] / 100)
    acceleratorMultiplier *= (1 + player.achievements[61] / 100)
    acceleratorMultiplier *= (1 + player.achievements[62] / 100)
    acceleratorMultiplier *= (1 + 1 / 5 * player.researches[1])
    acceleratorMultiplier *= (1 + 1 / 20 * player.researches[6] + 1 / 25 * player.researches[7] + 1 / 40 * player.researches[8] + 3 / 200 * player.researches[9] + 1 / 200 * player.researches[10]);
    acceleratorMultiplier *= (1 + 1 / 20 * player.researches[86])
    acceleratorMultiplier *= (1 + 1 / 100 * player.researches[126])
    acceleratorMultiplier *= (1 + 0.8 / 100 * player.researches[141])
    acceleratorMultiplier *= (1 + 0.6 / 100 * player.researches[156])
    acceleratorMultiplier *= (1 + 0.4 / 100 * player.researches[171])
    acceleratorMultiplier *= (1 + 0.2 / 100 * player.researches[186])
    acceleratorMultiplier *= (1 + 0.01 / 100 * player.researches[200])
    acceleratorMultiplier *= (1 + 0.01 / 100 * player.cubeUpgrades[50])
    acceleratorMultiplier *= Math.pow(1.01, player.upgrades[21] + player.upgrades[22] + player.upgrades[23] + player.upgrades[24] + player.upgrades[25])
    if ((player.currentChallenge.transcension !== 0 || player.currentChallenge.reincarnation !== 0) && player.upgrades[50] > 0.5) {
        acceleratorMultiplier *= 1.25
    }
    acceleratorMultiplier *= maladaptiveMultiplier[player.usedCorruptions[2]]
}

function calculateRecycleMultiplier() {
    // Factors where recycle bonus comes from
    let recycleFactors = sumContents([
        0.05 * player.achievements[80],
        0.05 * player.achievements[87],
        0.05 * player.achievements[94],
        0.05 * player.achievements[101],
        0.05 * player.achievements[108],
        0.05 * player.achievements[115],
        0.075 * player.achievements[122],
        0.075 * player.achievements[129],
        0.05 * player.upgrades[61],
        0.25 * Math.min(1, rune4level / 1000),
        0.005 * player.cubeUpgrades[2]
    ]);

    return 1 / (1 - recycleFactors);
}

// Returns the amount of exp given per offering by a rune
function calculateRuneExpGiven(runeIndex, all) {
    all = all || false
    // recycleMult accounted for all recycle chance, but inversed so it's a multiplier instead
    let recycleMultiplier = calculateRecycleMultiplier();

    // Rune multiplier that is summed instead of added
    let allRuneExpAdditiveMultiplier = sumContents([
        // Base amount multiplied per offering
        1,
        // +1 if C1 completion
        Math.min(1, player.highestchallengecompletions[1]),
        // +0.10 per C1 completion
        1 / 10 * player.highestchallengecompletions[1],
        // Research 5x2
        0.6 * player.researches[22],
        // Research 5x3
        0.3 * player.researches[23],
        // Particle Upgrade 1x1
        2 * player.upgrades[61],
        // Particle upgrade 3x1
        player.upgrades[71] * player.runelevels[runeIndex] / 25
    ]);

    if (all) {
        allRuneExpAdditiveMultiplier = sumContents([
            //Challenge 3 completions
            1 / 20 * player.highestchallengecompletions[3],
            //Reincarnation 3x1
            1 * player.upgrades[66]
        ])
    }

    // Rune multiplier that gets applied to all runes
    let allRuneExpMultiplier = productContents([
        // Research 4x16
        1 + (player.researches[91] / 20),
        // Research 4x17
        1 + (player.researches[92] / 20),
        // Ant 8
        calculateSigmoidExponential(999, 1 / 10000 * Math.pow(player.antUpgrades[8] + bonusant8, 1.1)),
        // Cube Bonus
        cubeBonusMultiplier[4],
        // Cube Upgrade Bonus
        (1 + player.ascensionCounter / 1000 * player.cubeUpgrades[32]),
        // Corruption Divisor
        1 / droughtMultiplier[player.usedCorruptions[11]],
        // Constant Upgrade Multiplier
        1 + 1 / 10 * player.constantUpgrades[8]
    ]);

    // Rune multiplier that gets applied to specific runes
    let runeExpMultiplier = [
        productContents([
            1 + (player.researches[78] / 50), 1 + (player.researches[111] / 100), 1 + (player.challengecompletions[7] / 10)
        ]),
        productContents([
            1 + (player.researches[80] / 50), 1 + (player.researches[112] / 100), 1 + (player.challengecompletions[7] / 10)
        ]),
        productContents([
            1 + (player.researches[79] / 50), 1 + (player.researches[113] / 100), 1 + (player.challengecompletions[8] / 5)
        ]),
        productContents([
            1 + (player.researches[77] / 50), 1 + (player.researches[114] / 100), 1 + (player.challengecompletions[6] / 10)
        ]),
        productContents([
            1 + (player.researches[83] / 20), 1 + (player.researches[115] / 100), 1 + (player.challengecompletions[9] / 5)
        ])
    ];

    return productContents([
        allRuneExpAdditiveMultiplier,
        allRuneExpMultiplier,
        recycleMultiplier,
        runeExpMultiplier[runeIndex]
    ]);
}

// Returns the amount of exp required to level a rune
function calculateRuneExpToLevel(runeIndex) {
    let runelevel = player.runelevels[runeIndex];

    let runeExpRequiredMultiplier = [
        1,
        1,
        1,
        1,
        1
    ];

    // Rune exp required to level multipliers
    let allRuneExpRequiredMultiplier = productContents([
        Math.pow(runelevel / 5, 3),
        ((4 * runelevel / 5) + 100) / 500,
        Math.max(1, (runelevel / 3 - 166.66) / 30),
        Math.max(1, (runelevel / 3 - 333.33) / 25),
        Math.max(1, (runelevel / 3 - 500) / 30),
        Math.max(1, Math.pow(1.03, runelevel / 10 - 200))
    ]);
    let expToLevel = productContents([
        runeexpbase[runeIndex],
        allRuneExpRequiredMultiplier,
        runeExpRequiredMultiplier[runeIndex]
    ]);

    return expToLevel;

}

function calculateMaxRunes(i) {
    let max = 2500;

    let increaseMaxLevel = [
        null,
        25 * (player.researches[78] + player.researches[111] + 2 * player.cubeUpgrades[16] + 2 * player.cubeUpgrades[37]) + 8 * player.constantUpgrades[7] + 200 * player.challengecompletions[11] + 500 * player.challengecompletions[14] + 2 * player.researches[200] + 2 * player.cubeUpgrades[50],
        25 * (player.researches[80] + player.researches[112] + 2 * player.cubeUpgrades[16] + 2 * player.cubeUpgrades[37]) + 8 * player.constantUpgrades[7] + 200 * player.challengecompletions[11] + 500 * player.challengecompletions[14] + 2 * player.researches[200] + 2 * player.cubeUpgrades[50],
        25 * (player.researches[79] + player.researches[113] + 2 * player.cubeUpgrades[16] + 2 * player.cubeUpgrades[37]) + 8 * player.constantUpgrades[7] + 200 * player.challengecompletions[11] + 500 * player.challengecompletions[14] + 2 * player.researches[200] + 2 * player.cubeUpgrades[50],
        25 * (player.researches[77] + player.researches[114] + 2 * player.cubeUpgrades[16] + 2 * player.cubeUpgrades[37]) + 8 * player.constantUpgrades[7] + 200 * player.challengecompletions[11] + 500 * player.challengecompletions[14] + 2 * player.researches[200] + 2 * player.cubeUpgrades[50],
        25 * (player.researches[115] + 2 * player.cubeUpgrades[16] + 2 * player.cubeUpgrades[37]) + 8 * player.constantUpgrades[7] + 200 * player.challengecompletions[11] + 500 * player.challengecompletions[14] + 2 * player.researches[200] + 2 * player.cubeUpgrades[50]
    ]

    max += increaseMaxLevel[i]
    return (max)
}

function calculateOfferings(i) {
    let q = 0;
    let a = 0;
    let b = 0;
    let c = 0;

    if (i === 3) {
        a += 3
        if (player.achievements[52] > 0.5) {
            a += (25 * Math.min(player.reincarnationcounter / 1800, 1))
        }
        if (player.upgrades[62] > 0.5) {
            a += 1 / 50 * (sumContents(player.challengecompletions))
        }
        a += 0.6 * player.researches[25]
        if (player.researches[95] === 1) {
            a += 4
        }
        a += 1 / 500 * rune5level * effectiveLevelMult * (1 + player.researches[85] / 200)
        a *= (1 + Math.pow(Decimal.log(player.reincarnationShards.add(1), 10), 2 / 3) / 4);
        a *= Math.min(Math.pow(player.reincarnationcounter / 10, 2), 1)
        if (player.reincarnationcounter >= 5) {
            a *= Math.max(1, player.reincarnationcounter / 10)
        }

    }
    if (i >= 2) {
        b += 2
        if (player.reincarnationCount > 0) {
            b += 2
        }
        if (player.achievements[44] > 0.5) {
            b += (15 * Math.min(player.transcendcounter / 1800, 1))
        }
        if (player.challengecompletions[2] > 0) {
            b += 1;
        }
        b += 0.2 * player.researches[24]
        b += 1 / 500 * rune5level * effectiveLevelMult * (1 + player.researches[85] / 200)
        b *= (1 + Math.pow(Decimal.log(player.transcendShards.add(1), 10), 1 / 2) / 5);
        b *= (1 + player.challengecompletions[8] / 25)
        b *= Math.min(Math.pow(player.transcendcounter / 10, 2), 1)
        if (player.transcendCount >= 5) {
            b *= Math.max(1, player.transcendcounter / 10)
        }
    }
    if (i >= 1) {
        c += 1
        if (player.transcendCount > 0 || player.reincarnationCount > 0) {
            c += 1
        }
        if (player.reincarnationCount > 0) {
            c += 2
        }
        if (player.achievements[37] > 0.5) {
            c += (15 * Math.min(player.prestigecounter / 1800, 1))
        }
        if (player.challengecompletions[2] > 0) {
            c += 1;
        }
        c += 0.2 * player.researches[24]
        c += 1 / 500 * rune5level * effectiveLevelMult * (1 + player.researches[85] / 200)
        c *= (1 + Math.pow(Decimal.log(player.prestigeShards.add(1), 10), 1 / 2) / 5);
        c *= (1 + player.challengecompletions[6] / 50)
        c *= Math.min(Math.pow(player.prestigecounter / 10, 2), 1)
        if (player.prestigeCount >= 5) {
            c *= Math.max(1, player.prestigecounter / 10)
        }
    }
    q = a + b + c


    if (player.achievements[33] > 0.5) {
        q *= 1.10
    }
    if (player.achievements[34] > 0.5) {
        q *= 1.15
    }
    if (player.achievements[35] > 0.5) {
        q *= 1.25
    }
    if (player.upgrades[38] === 1) {
        q *= 1.2
    }
    if (player.upgrades[75] > 0.5) {
        q *= (1 + 2 * Math.min(1, Math.pow(player.maxobtainium / 30000000, 0.5)))
    }
    q *= (1 + 1 / 50 * player.shopUpgrades.offeringAutoLevel);
    q *= (1 + 1 / 100 * player.shopUpgrades.cashGrabLevel);
    q *= (1 + 1 / 10000 * sumContents(player.challengecompletions) * player.researches[85])
    q *= (1 + Math.pow((player.antUpgrades[6] + bonusant6 / 50), 2 / 3))
    q *= cubeBonusMultiplier[3]
    q *= (1 + 0.0001 * player.constantUpgrades[3] * Decimal.log(player.ascendShards.add(1), 10))
    q *= (1 + 0.0003 * player.talismanLevels[3] * player.researches[149])
    q *= (1 + 0.12 * player.challengecompletions[12])
    q *= (1 + 0.1 / 100 * player.researches[200])
    q *= (1 + 0.1 / 100 * player.cubeUpgrades[50])
    q = Math.floor(q) * 100 / 100

    let persecond = 0;
    if (i === 1) {
        persecond = q / (1 + player.prestigecounter)
    }
    if (i === 2) {
        persecond = q / (1 + player.transcendcounter)
    }
    if (i === 4) {
        persecond = q / (1 + player.reincarnationcounter)
    }
    if (persecond > player.offeringpersecond) {
        player.offeringpersecond = persecond
    }
    return (q);

}

function calculateObtainium() {
    obtainiumGain = 1;
    if (player.upgrades[69] > 0) {
        obtainiumGain *= Math.min(10, Decimal.pow(Decimal.log(reincarnationPointGain.add(10), 10), 0.5))
    }
    if (player.upgrades[72] > 0) {
        obtainiumGain *= Math.min(50, (1 + 2 * player.challengecompletions[6] + 2 * player.challengecompletions[7] + 2 * player.challengecompletions[8] + 2 * player.challengecompletions[9] + 2 * player.challengecompletions[10]))
    }
    if (player.upgrades[74] > 0) {
        obtainiumGain *= (1 + 4 * Math.min(1, Math.pow(player.maxofferings / 100000, 0.5)))
    }
    obtainiumGain *= (1 + player.researches[65] / 5)
    obtainiumGain *= (1 + player.researches[76] / 10)
    obtainiumGain *= (1 + player.researches[81] / 10)
    obtainiumGain *= (1 + player.shopUpgrades.obtainiumAutoLevel / 50)
    obtainiumGain *= (1 + player.shopUpgrades.cashGrabLevel / 100)
    obtainiumGain *= (1 + rune5level / 500 * effectiveLevelMult * (1 + player.researches[84] / 200))
    obtainiumGain *= (1 + 0.01 * player.achievements[84] + 0.03 * player.achievements[91] + 0.05 * player.achievements[98] + 0.07 * player.achievements[105] + 0.09 * player.achievements[112] + 0.11 * player.achievements[119] + 0.13 * player.achievements[126] + 0.15 * player.achievements[133] + 0.17 * player.achievements[140] + 0.19 * player.achievements[147])
    obtainiumGain *= (1 + 2 * Math.pow((player.antUpgrades[10] + bonusant10) / 50, 2 / 3))
    obtainiumGain *= cubeBonusMultiplier[5]
    obtainiumGain *= (1 + 0.0004 * player.constantUpgrades[4] * Decimal.log(player.ascendShards.add(1), 10))
    obtainiumGain *= (1 + player.cubeUpgrades[47])
    obtainiumGain *= (1 + 0.5 * player.challengecompletions[12])
    obtainiumGain *= (1 + calculateCorruptionPoints() / 400 * effectiveRuneSpiritPower[4])
    obtainiumGain *= (1 + 0.03 * Math.log(player.uncommonFragments + 1) / Math.log(4) * player.researches[144])
    obtainiumGain *= (1 + 0.1 / 100 * player.cubeUpgrades[50])
    if (player.achievements[53] > 0) {
        obtainiumGain *= (1 + 1 / 2000 * (runeSum))
    }
    if (player.achievements[128]) {
        obtainiumGain *= 1.5
    }
    if (player.achievements[129]) {
        obtainiumGain *= 1.25
    }

    if (player.achievements[51] > 0) {
        obtainiumGain += 4
    }
    if (player.reincarnationcounter >= 2) {
        obtainiumGain += 1 * player.researches[63]
    }
    if (player.reincarnationcounter >= 5) {
        obtainiumGain += 2 * player.researches[64]
    }
    obtainiumGain *= Math.min(1, Math.pow(player.reincarnationcounter / 10, 2));
    if (player.reincarnationCount >= 5) {
        obtainiumGain *= Math.max(1, player.reincarnationcounter / 10)
    }
    obtainiumGain *= Math.pow(Decimal.log(player.transcendShards.add(1), 10) / 300, 2)
    obtainiumGain = Math.pow(obtainiumGain, illiteracyPower[player.usedCorruptions[5]])
    if (player.currentChallenge.ascension === 14) {
        obtainiumGain = 0
    }
    player.obtainiumpersecond = obtainiumGain / (0.1 + player.reincarnationcounter)
    player.maxobtainiumpersecond = Math.max(player.maxobtainiumpersecond, player.obtainiumpersecond);
}

function calculateAutomaticObtainium() {
    let timeMult = calculateTimeAcceleration();
    return 0.05 * (10 * player.researches[61] + 2 * player.researches[62]) * player.maxobtainiumpersecond * timeMult * (1 + 4 * player.cubeUpgrades[3] / 5);
}

function calculateTalismanEffects() {
    let positiveBonus = 0;
    let negativeBonus = 0;
    if (player.achievements[135] === 1) {
        positiveBonus += 0.05
    }
    if (player.achievements[136] === 1) {
        positiveBonus += 0.05
    }
    positiveBonus += 0.05 * (player.talismanRarity[4] - 1)
    positiveBonus += 3 * player.researches[106] / 100
    positiveBonus += 3 * player.researches[107] / 100
    positiveBonus += 3 * player.researches[116] / 200
    positiveBonus += 3 * player.researches[117] / 200
    positiveBonus += (cubeBonusMultiplier[9] - 1)
    positiveBonus += 0.001 * player.cubeUpgrades[50]
    negativeBonus += 3 * player.researches[118] / 50
    negativeBonus += 0.001 * player.cubeUpgrades[50]
    for (let i = 1; i <= 5; i++) {
        if (player.talismanOne[i] === (1)) {
            talisman1Effect[i] = (talismanPositiveModifier[player.talismanRarity[1]] + positiveBonus) * player.talismanLevels[1]
        } else {
            talisman1Effect[i] = (talismanNegativeModifier[player.talismanRarity[1]] - negativeBonus) * player.talismanLevels[1] * (-1)
        }

        if (player.talismanTwo[i] === (1)) {
            talisman2Effect[i] = (talismanPositiveModifier[player.talismanRarity[2]] + positiveBonus) * player.talismanLevels[2]
        } else {
            talisman2Effect[i] = (talismanNegativeModifier[player.talismanRarity[2]] - negativeBonus) * player.talismanLevels[2] * (-1)
        }

        if (player.talismanThree[i] === (1)) {
            talisman3Effect[i] = (talismanPositiveModifier[player.talismanRarity[3]] + positiveBonus) * player.talismanLevels[3]
        } else {
            talisman3Effect[i] = (talismanNegativeModifier[player.talismanRarity[3]] - negativeBonus) * player.talismanLevels[3] * (-1)
        }

        if (player.talismanFour[i] === (1)) {
            talisman4Effect[i] = (talismanPositiveModifier[player.talismanRarity[4]] + positiveBonus) * player.talismanLevels[4]
        } else {
            talisman4Effect[i] = (talismanNegativeModifier[player.talismanRarity[4]] - negativeBonus) * player.talismanLevels[4] * (-1)
        }

        if (player.talismanFive[i] === (1)) {
            talisman5Effect[i] = (talismanPositiveModifier[player.talismanRarity[5]] + positiveBonus) * player.talismanLevels[5]
        } else {
            talisman5Effect[i] = (talismanNegativeModifier[player.talismanRarity[5]] - negativeBonus) * player.talismanLevels[5] * (-1)
        }

        if (player.talismanSix[i] === (1)) {
            talisman6Effect[i] = (talismanPositiveModifier[player.talismanRarity[6]] + positiveBonus) * player.talismanLevels[6]
        } else {
            talisman6Effect[i] = (talismanNegativeModifier[player.talismanRarity[6]] - negativeBonus) * player.talismanLevels[6] * (-1)
        }

        if (player.talismanSeven[i] === (1)) {
            talisman7Effect[i] = (talismanPositiveModifier[player.talismanRarity[7]] + positiveBonus) * player.talismanLevels[7]
        } else {
            talisman7Effect[i] = (talismanNegativeModifier[player.talismanRarity[7]] - negativeBonus) * player.talismanLevels[7] * (-1)
        }

    }
    rune1Talisman = 0;
    rune2Talisman = 0;
    rune3Talisman = 0;
    rune4Talisman = 0;
    rune5Talisman = 0;
    for (let i = 1; i <= 7; i++) {
        rune1Talisman += window["talisman" + i + "Effect"][1]
        rune2Talisman += window["talisman" + i + "Effect"][2]
        rune3Talisman += window["talisman" + i + "Effect"][3]
        rune4Talisman += window["talisman" + i + "Effect"][4]
        rune5Talisman += window["talisman" + i + "Effect"][5]
    }
    talisman6Power = 0;
    talisman7Quarks = 0;
    if (player.talismanRarity[1] === 6) {
        rune2Talisman += 1000;
    }
    if (player.talismanRarity[2] === 6) {
        rune1Talisman += 1000;
    }
    if (player.talismanRarity[3] === 6) {
        rune4Talisman += 1000;
    }
    if (player.talismanRarity[4] === 6) {
        rune3Talisman += 1000;
    }
    if (player.talismanRarity[5] === 6) {
        rune5Talisman += 1000;
    }
    if (player.talismanRarity[6] === 6) {
        talisman6Power = 2.5;
    }
    if (player.talismanRarity[7] === 6) {
        talisman7Quarks = 2;
    }
}

function calculateRuneLevels() {
    calculateTalismanEffects();
    if (player.currentChallenge.reincarnation !== 9) {
        rune1level = Math.max(1, player.runelevels[0] + (player.antUpgrades[9] + bonusant9) * 3 + (rune1Talisman) + 17 * player.constantUpgrades[7])
        rune2level = Math.max(1, player.runelevels[1] + (player.antUpgrades[9] + bonusant9) * 3 + (rune2Talisman) + 17 * player.constantUpgrades[7])
        rune3level = Math.max(1, player.runelevels[2] + (player.antUpgrades[9] + bonusant9) * 3 + (rune3Talisman) + 17 * player.constantUpgrades[7])
        rune4level = Math.max(1, player.runelevels[3] + (player.antUpgrades[9] + bonusant9) * 3 + (rune4Talisman) + 17 * player.constantUpgrades[7])
        rune5level = Math.max(1, player.runelevels[4] + (player.antUpgrades[9] + bonusant9) * 3 + (rune5Talisman) + 17 * player.constantUpgrades[7])
    }

    runeSum = 0;
    for (let i = 1; i <= 5; i++) {
        displayRuneInformation(i, false)
        if (player.autoSacrifice === i) {
            document.getElementById("rune" + i).style.backgroundColor = "orange"
        }
        runeSum += window['rune' + i + 'level']
    }
    calculateRuneBonuses();
}

function calculateRuneBonuses() {
    blessingMultiplier = 1
    spiritMultiplier = 1

    blessingMultiplier *= (1 + 6.9 * player.researches[134] / 100)
    blessingMultiplier *= (1 + player.talismanRarity[3] / 10)
    blessingMultiplier *= (1 + 0.10 * Math.log(player.epicFragments + 1) / Math.log(10))
    blessingMultiplier *= (1 + player.researches[194] / 100)
    spiritMultiplier *= (1 + 8 * player.researches[164] / 100)
    if (player.researches[165] > 0 && player.currentChallenge.ascension !== 0) {
        spiritMultiplier *= 32
    }
    spiritMultiplier *= (1 + 0.15 * Math.log(player.legendaryFragments + 1) / Math.log(10))
    spiritMultiplier *= (1 + 2 * player.researches[194] / 100)

    for (let i = 1; i <= 5; i++) {
        runeBlessings[i] = blessingMultiplier * player.runelevels[i - 1] * player.runeBlessingLevels[i]
        runeSpirits[i] = spiritMultiplier * player.runelevels[i - 1] * player.runeSpiritLevels[i]
    }

    for (let i = 1; i <= 5; i++) {
        effectiveRuneBlessingPower[i] = (Math.pow(runeBlessings[i], 1 / 5)) / 400
        effectiveRuneSpiritPower[i] = (Math.pow(runeSpirits[i], 1 / 5)) / 400
    }
}

function calculateAnts() {

    let talismanBonus = 0;
    talismanBonus += 2 * (player.talismanRarity[6] - 1);
    talismanBonus += player.challengecompletions[9];
    talismanBonus += 2 * player.constantUpgrades[6];
    talismanBonus += 15 * player.challengecompletions[11];
    talismanBonus += Math.floor(1 / 40 * player.researches[200]);
    let c11 = 0;
    let c11bonus = 0;
    if (player.currentChallenge.ascension === 11) {
        c11 = 999
    }
    if (player.currentChallenge.ascension === 11) {
        c11bonus = Math.floor((15 * player.challengecompletions[8] + 15 * player.challengecompletions[9]) * (1 - player.challengecompletions[11] / 10));
    }
    bonusant1 = Math.min(player.antUpgrades[1] + c11, 4 * player.researches[97] + talismanBonus + player.researches[102] + 2 * player.researches[132] + c11bonus)
    bonusant2 = Math.min(player.antUpgrades[2] + c11, 4 * player.researches[97] + talismanBonus + player.researches[102] + 2 * player.researches[132] + c11bonus)
    bonusant3 = Math.min(player.antUpgrades[3] + c11, 4 * player.researches[97] + talismanBonus + player.researches[102] + 2 * player.researches[132] + c11bonus)
    bonusant4 = Math.min(player.antUpgrades[4] + c11, 4 * player.researches[97] + talismanBonus + player.researches[102] + 2 * player.researches[132] + c11bonus)
    bonusant5 = Math.min(player.antUpgrades[5] + c11, 4 * player.researches[97] + talismanBonus + player.researches[102] + 2 * player.researches[132] + c11bonus)
    bonusant6 = Math.min(player.antUpgrades[6] + c11, 4 * player.researches[97] + talismanBonus + player.researches[102] + 2 * player.researches[132] + c11bonus)
    bonusant7 = Math.min(player.antUpgrades[7] + c11, 4 * player.researches[98] + talismanBonus + player.researches[102] + 2 * player.researches[132] + c11bonus)
    bonusant8 = Math.min(player.antUpgrades[8] + c11, 4 * player.researches[98] + talismanBonus + player.researches[102] + 2 * player.researches[132] + c11bonus)
    bonusant9 = Math.min(player.antUpgrades[9] + c11, 4 * player.researches[98] + talismanBonus + player.researches[102] + 2 * player.researches[132] + c11bonus)
    bonusant10 = Math.min(player.antUpgrades[10] + c11, 4 * player.researches[98] + talismanBonus + player.researches[102] + 2 * player.researches[132] + c11bonus)
    bonusant11 = Math.min(player.antUpgrades[11] + c11, 4 * player.researches[98] + talismanBonus + player.researches[102] + 2 * player.researches[132] + c11bonus)
    bonusant12 = Math.min(player.antUpgrades[12] + c11, 4 * player.researches[98] + talismanBonus + player.researches[102] + 2 * player.researches[132] + c11bonus)

}

function calculateAntSacrificeELO() {
    antELO = 0;
    effectiveELO = 0;
    let antUpgradeSum = player.antUpgrades.reduce(function (a, b) {
        return a + b
    }, 0);
    if (player.antPoints.greaterThanOrEqualTo("1e40")) {
        antELO += Decimal.log(player.antPoints, 10);
        antELO += 1 / 2 * antUpgradeSum;
        antELO += 1 / 10 * player.firstOwnedAnts
        antELO += 1 / 5 * player.secondOwnedAnts
        antELO += 1 / 3 * player.thirdOwnedAnts
        antELO += 1 / 2 * player.fourthOwnedAnts
        antELO += player.fifthOwnedAnts
        antELO += 2 * player.sixthOwnedAnts
        antELO += 4 * player.seventhOwnedAnts
        antELO += 8 * player.eighthOwnedAnts
        antELO += 666 * player.researches[178]

        if (player.achievements[180] === 1) {
            antELO *= 1.01
        }
        if (player.achievements[181] === 1) {
            antELO *= 1.03 / 1.01
        }
        if (player.achievements[182] === 1) {
            antELO *= 1.06 / 1.03
        }
        antELO *= (1 + player.researches[110] / 100)
        antELO *= (1 + 2.5 * player.researches[148] / 100)

        if (player.achievements[176] === 1) {
            antELO += 25
        }
        if (player.achievements[177] === 1) {
            antELO += 50
        }
        if (player.achievements[178] === 1) {
            antELO += 75
        }
        if (player.achievements[179] === 1) {
            antELO += 100
        }
        antELO += 25 * player.researches[108]
        antELO += 25 * player.researches[109]
        antELO += 40 * player.researches[123]
        antELO += 100 * player.challengecompletions[10]
        antELO += 75 * player.upgrades[80]
        antELO = 1 / 10 * Math.floor(10 * antELO)

        effectiveELO += 0.5 * Math.min(3500, antELO)
        effectiveELO += 0.1 * Math.min(4000, antELO)
        effectiveELO += 0.1 * Math.min(6000, antELO)
        effectiveELO += 0.1 * Math.min(10000, antELO)
        effectiveELO += 0.2 * antELO
        effectiveELO += (cubeBonusMultiplier[8] - 1)
        effectiveELO += 3 * player.cubeUpgrades[50]


    }
}

function calculateAntSacrificeMultipliers() {
    timeMultiplier = Math.min(1, Math.pow(player.antSacrificeTimer / 10, 2))
    if (player.achievements[177] === 0) {
        timeMultiplier *= Math.min(1000, Math.max(1, player.antSacrificeTimer / 10))
    }
    if (player.achievements[177] > 0) {
        timeMultiplier *= Math.max(1, player.antSacrificeTimer / 10)
    }

    upgradeMultiplier = 1;
    upgradeMultiplier *= (1 + 2 * (1 - Math.pow(2, -(player.antUpgrades[11] + bonusant11) / 125)));
    upgradeMultiplier *= (1 + player.researches[103] / 20);
    upgradeMultiplier *= (1 + player.researches[104] / 20);
    if (player.achievements[132] === 1) {
        upgradeMultiplier *= 1.25
    }
    if (player.achievements[137] === 1) {
        upgradeMultiplier *= 1.25
    }
    upgradeMultiplier *= (1 + 6.66 * effectiveRuneBlessingPower[3]);
    upgradeMultiplier *= (1 + 1 / 50 * player.challengecompletions[10]);
    upgradeMultiplier *= (1 + 1 / 50 * player.researches[122]);
    upgradeMultiplier *= (1 + 3 / 100 * player.researches[133]);
    upgradeMultiplier *= (1 + 2 / 100 * player.researches[163]);
    upgradeMultiplier *= (1 + 1 / 100 * player.researches[193]);
    upgradeMultiplier *= (1 + 1 / 10 * player.upgrades[79]);
    upgradeMultiplier *= (1 + 0.09 * player.upgrades[40]);
    upgradeMultiplier *= cubeBonusMultiplier[7];
}

function calculateAntSacrificeRewards() {
    calculateAntSacrificeELO();
    calculateAntSacrificeMultipliers();
    let rewardsMult = timeMultiplier * upgradeMultiplier;
    let rewards = {};

    rewards.antSacrificePoints = effectiveELO * rewardsMult / 90;
    rewards.offerings = player.offeringpersecond * 0.15 * effectiveELO * rewardsMult / 180;
    rewards.obtainium = player.maxobtainiumpersecond * 0.24 * effectiveELO * rewardsMult / 180;
    rewards.talismanShards = (antELO > 500) ?
        Math.max(1, Math.floor(rewardsMult / 180 * Math.pow(1 / 4 * (Math.max(0, effectiveELO - 500)), 2))) :
        0;
    rewards.commonFragments = (antELO > 750) ?
        Math.max(1, Math.floor(rewardsMult / 90 * Math.pow(1 / 9 * (Math.max(0, effectiveELO - 750)), 1.83))) :
        0;
    rewards.uncommonFragments = (antELO > 1000) ?
        Math.max(1, Math.floor(rewardsMult / 150 * Math.pow(1 / 16 * (Math.max(0, effectiveELO - 1000)), 1.66))) :
        0;
    rewards.rareFragments = (antELO > 1500) ?
        Math.max(1, Math.floor(rewardsMult / 180 * Math.pow(1 / 25 * (Math.max(0, effectiveELO - 1500)), 1.50))) :
        0;
    rewards.epicFragments = (antELO > 2000) ?
        Math.max(1, Math.floor(rewardsMult / 210 * Math.pow(1 / 36 * (Math.max(0, effectiveELO - 2000)), 1.33))) :
        0;
    rewards.legendaryFragments = (antELO > 3000) ?
        Math.max(1, Math.floor(rewardsMult / 240 * Math.pow(1 / 49 * (Math.max(0, effectiveELO - 3000)), 1.16))) :
        0;
    rewards.mythicalFragments = (antELO > 5000) ?
        Math.max(1, Math.floor(rewardsMult / 270 * Math.pow(1 / 64 * (Math.max(0, effectiveELO - 4150)), 1))) :
        0;

    return rewards;
}

function initiateTimeWarp(time) {
    if (!timeWarp) {
        player.worlds -= 0;
        calculateOffline(time);
    }
}

function calculateOffline(forceTime) {
    forceTime = forceTime || 0
    toggleTalismanBuy(player.buyTalismanShardPercent);
    updateTalismanInventory();
    calculateObtainium();
    calculateAnts();
    calculateRuneLevels();
    if (forceTime === 0) {
        document.getElementById("preload").style.display = "block"
    }
    document.getElementById("offlineprogressbar").style.display = "block"
    timeWarp = true
    if (player.offlinetick < 1.5e12) {
        player.offlinetick = Date.now()
    }
    const updatedtime = Date.now();
    let timeadd = Math.min(28800 * 3 + 7200 * player.researches[31] + 7200 * player.researches[32], Math.max(forceTime, (updatedtime - player.offlinetick) / 1000));
    timeadd *= calculateTimeAcceleration();
    document.getElementById("offlineTimer").textContent = "You have " + format(timeadd, 2) + " seconds of Offline Progress!";
    let simulatedTicks = 800;
    let tickValue = timeadd / 800;
    let progressBarWidth = 0;
    if (timeadd < 1000) {
        simulatedTicks = Math.min(1, Math.floor(timeadd / 1.25));
        tickValue = Math.min(1.25, timeadd);
    }
    let maxSimulatedTicks = simulatedTicks;
    player.quarkstimer += timeadd / calculateTimeAcceleration();
    player.ascensionCounter += timeadd / calculateTimeAcceleration();
    if (player.cubeUpgrades[2] > 0) {
        player.runeshards += Math.floor(player.cubeUpgrades[2] * timeadd / calculateTimeAcceleration())
    }
    if (player.researches[61] > 0) {
        player.researchPoints += timeadd * calculateAutomaticObtainium()
    }
    if (player.achievements[173] === 1) {
        player.antSacrificeTimer += timeadd;
    }


    if (player.quarkstimer >= 90000) {
        player.quarkstimer = 90000
    }

    let runOffline = setInterval(runSimulator, 0)

    function runSimulator() {
        player.prestigecounter += tickValue;
        player.transcendcounter += tickValue;
        player.reincarnationcounter += tickValue;
        resourceGain(tickValue, true);
        calculateObtainium();
        if (simulatedTicks % 2 === 0) {
            updateAll(true);
        }

        if (player.shopUpgrades.offeringAutoLevel > 0.5 && player.autoSacrificeToggle) {
            player.sacrificeTimer += tickValue
            if (player.sacrificeTimer >= 10) {
                let rune = player.autoSacrifice;
                redeemShards(rune, true, Math.floor(player.sacrificeTimer / 10));
                player.sacrificeTimer = player.sacrificeTimer % 10;
            }
        }
        simulatedTicks -= 1;
        progressBarWidth = 750 * (1 - simulatedTicks / maxSimulatedTicks)
        document.getElementById("offlineprogressdone").style.width = progressBarWidth + "px"
        if (simulatedTicks < 1) {
            clearInterval(runOffline);
            timeWarp = false;
            document.getElementById("offlineprogressbar").style.display = "none";
            document.getElementById("preload").style.display = "none";
        }
    }

    player.offlinetick = updatedtime
    saveSynergy();
    updateTalismanInventory();
    calculateObtainium();
    calculateAnts();
    calculateRuneLevels();
}

function calculateSigmoid(constant, factor, divisor) {
    return (1 + (constant - 1) * (1 - Math.pow(2, -(factor) / (divisor))));
}

function calculateSigmoidExponential(constant, coefficient) {
    return (1 + (constant - 1) * (1 - Math.exp(-coefficient)))
}

function calculateCubeBlessings() {

    document.getElementById("cubeQuantity").textContent = format(player.wowCubes, 0, true)

    let cubeArray = [null, player.cubeBlessings.accelerator, player.cubeBlessings.multiplier, player.cubeBlessings.offering, player.cubeBlessings.runeExp, player.cubeBlessings.obtainium, player.cubeBlessings.antSpeed, player.cubeBlessings.antSacrifice, player.cubeBlessings.antELO, player.cubeBlessings.talismanBonus, player.cubeBlessings.globalSpeed]
    let powerBonus = [null, player.cubeUpgrades[45] / 100, player.cubeUpgrades[35] / 100, player.cubeUpgrades[24] / 100, player.cubeUpgrades[14] / 100, 0, 0, player.cubeUpgrades[15] / 100, player.cubeUpgrades[25] / 100, player.cubeUpgrades[44] / 100, player.cubeUpgrades[34] / 100]

    let accuracy = [null, 2, 2, 2, 2, 2, 2, 2, 1, 4, 3]
    for (let i = 1; i <= 10; i++) {
        let power = 1;
        let mult = 1;
        let augmentAccuracy = 0;
        if (cubeArray[i] >= 1000) {
            power = blessingDRPower[i];
            mult *= Math.pow(1000, (1 - blessingDRPower[i]) * (1 + powerBonus[i]));
            augmentAccuracy += 2;
        }
        if (i === 6) {
            power = 2.25;
            mult = 1;
            augmentAccuracy = 0;
        }

        cubeBonusMultiplier[i] = 1 + mult * blessingbase[i] * Math.pow(cubeArray[i], power * (1 + powerBonus[i])) * tesseractBonusMultiplier[i];

        document.getElementById("cubeBlessing" + i + "Amount").textContent = "x" + format(cubeArray[i], 0, true)
        document.getElementById("cubeBlessing" + i + "Effect").textContent = "+" + format(100 * (cubeBonusMultiplier[i] - 1), accuracy[i] + augmentAccuracy, true) + "%"
        if (i === 1) {
            document.getElementById("cubeBlessing1Effect").textContent = "+" + format(cubeBonusMultiplier[1] - 1, accuracy[1] + augmentAccuracy, true)
        }
        if (i === 8) {
            document.getElementById("cubeBlessing8Effect").textContent = "+" + format(cubeBonusMultiplier[8] - 1, accuracy[8] + augmentAccuracy, true)
        }
        if (i === 9) {
            document.getElementById("cubeBlessing9Effect").textContent = "+" + format(cubeBonusMultiplier[9] - 1, accuracy[9] + augmentAccuracy, true)
        }
    }

    calculateRuneLevels();
    calculateAntSacrificeELO();
    calculateObtainium();

}

function calculateCubeMultiplier() {
    mult = 1;
    mult *= (1 + player.researches[119] / 400);
    mult *= (1 + player.researches[120] / 400);
    mult *= (1 + player.cubeUpgrades[1] / 10);
    mult *= (1 + player.cubeUpgrades[11] / 10);
    mult *= (1 + player.cubeUpgrades[21] / 10);
    mult *= (1 + player.cubeUpgrades[31] / 10);
    mult *= (1 + player.cubeUpgrades[41] / 10);
    mult *= (1 + player.researches[137] / 100)
    mult *= (1 + 0.9 * player.researches[152] / 100)
    mult *= (1 + 0.8 * player.researches[167] / 100)
    mult *= (1 + 0.7 * player.researches[182] / 100)
    mult *= (1 + 0.6 * player.researches[187] / 100)
    mult *= (1 + 0.03 / 100 * player.researches[192] * player.antUpgrades[12])
    mult *= (1 + calculateCorruptionPoints() / 400 * effectiveRuneSpiritPower[2])
    mult *= (1 + 0.1 / 100 * player.researches[200])

    const timeThresholds = [0, 30, 60, 120, 600, 1800, 7200, 28800, 86400, 86400 * 7];
    for (let i = 1; i <= 9; i++) {
        if (player.ascensionCounter < timeThresholds[i]) {
            mult *= 1.1
        }
    }
    mult *= (1 + 0.01 * Decimal.log(player.ascendShards.add(1), 4) * Math.min(1, player.constantUpgrades[10]))
    return (mult)
}

function calculateTimeAcceleration() {
    let timeMult = 1;
    timeMult *= (1 + player.researches[121] / 50); // research 5x21
    timeMult *= (1 + 0.015 * player.researches[136]) // research 6x11
    timeMult *= (1 + 0.012 * player.researches[151]) // research 7x1
    timeMult *= (1 + 0.009 * player.researches[166]) // research 7x16
    timeMult *= (1 + 0.006 * player.researches[151]) // research 8x6
    timeMult *= (1 + 0.003 * player.researches[166]) // research 8x21
    timeMult *= (1 + 5 * effectiveRuneBlessingPower[1]); // speed blessing
    timeMult *= (1 + calculateCorruptionPoints() / 400 * effectiveRuneSpiritPower[1]) // speed SPIRIT
    timeMult *= cubeBonusMultiplier[10]; // Chronos cube blessing
    timeMult *= 1 + player.cubeUpgrades[18] / 5; // cube upgrade 2x8
    timeMult *= calculateSigmoid(2, player.antUpgrades[12] + bonusant12, 69) // ant 12
    timeMult *= (1 + 0.10 * (player.talismanRarity[2] - 1)) // Chronos Talisman bonus
    timeMult *= lazinessMultiplier[player.usedCorruptions[3]]

    if (timeMult > 100) {
        timeMult = 10 * Math.sqrt(timeMult)
    }
    timeMult *= indevSpeed
    return (timeMult)
}

function calculateCorruptionPoints() {
    let basePoints = 400;
    let multiplyPoints = 1;

    basePoints += corruptionAddPointArray[player.usedCorruptions[1]]
    basePoints += corruptionAddPointArray[player.usedCorruptions[2]]
    basePoints += 2 * corruptionAddPointArray[player.usedCorruptions[3]]
    basePoints += 2 * corruptionAddPointArray[player.usedCorruptions[6]]
    basePoints += 400 * player.usedCorruptions[7]
    basePoints += 400 * player.usedCorruptions[8]
    basePoints += corruptionAddPointArray[player.usedCorruptions[9]]
    basePoints += 1 * corruptionAddPointArray[player.usedCorruptions[11]]
    basePoints += 4 * corruptionAddPointArray[player.usedCorruptions[12]]

    multiplyPoints += 1 / 100 * corruptionMultiplyPointArray[player.usedCorruptions[4]]
    multiplyPoints += 1 / 100 * corruptionMultiplyPointArray[player.usedCorruptions[5]]
    multiplyPoints += 1 / 100 * corruptionMultiplyPointArray[player.usedCorruptions[10]]

    let totalPoints = basePoints * multiplyPoints
    if (totalPoints === 39600) {
        totalPoints += 400
    }
    return (totalPoints)
}

//by https://stackoverflow.com/questions/3730510/javascript-sort-array-and-return-an-array-of-indicies-that-indicates-the-positi
//slightly modified by Platonic
function sortWithIndeces(toSort) {
    let duplicateArray = [] //Prevents changing the original array that is to be sorted
    for (let i = 0; i < toSort.length; i++) {
        duplicateArray[i] = toSort[i]
    }
    for (let i = 0; i < duplicateArray.length; i++) {
        duplicateArray[i] = [duplicateArray[i], i];
    }
    duplicateArray.sort(function (left, right) {
        return left[0] < right[0] ? -1 : 1;
    });
    duplicateArray.sortIndices = [];
    for (let j = 0; j < duplicateArray.length; j++) {
        duplicateArray.sortIndices.push(duplicateArray[j][1]);
        duplicateArray[j] = duplicateArray[j][0];
    }
    return duplicateArray.sortIndices;
}

//If you want to sum from a baseline level i to the maximum buyable level n, what would the cost be and how many levels would you get?
function calculateSummationLinear(baseLevel, baseCost, resourceAvailable, differenceCap) {
    differenceCap = differenceCap || 1e9
    let subtractCost;
    subtractCost = baseCost * baseLevel * (1 + baseLevel) / 2;

    let buyToLevel;
    buyToLevel = Math.min(baseLevel + differenceCap, Math.floor(-1 / 2 + Math.sqrt(1 / 4 + 2 * (resourceAvailable + subtractCost) / baseCost)));

    let realCost;
    realCost = (baseCost * buyToLevel * (1 + buyToLevel) / 2) - subtractCost;

    return [buyToLevel, realCost]
}