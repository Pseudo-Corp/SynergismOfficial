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
    b += Math.floor((0.01 + rune1level) * effectiveLevelMult / 20);
    b *= (1 + 1 / 5 * player.researches[3] * (1 + 1 / 2 * CalcECC('ascension', player.challengecompletions[14])))
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
    b *= challenge15Rewards.acceleratorBoost
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
    acceleratorMultiplier *= (1 + 1 / 5 * player.researches[1] * (1 + 1 / 2 * CalcECC('ascension', player.challengecompletions[14])))
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
        0.25 * Math.min(1, rune4level / 400),
        0.005 * player.cubeUpgrades[2]
    ]);

    return 1 / (1 - recycleFactors);
}

// Returns the amount of exp given per offering by a rune
function calculateRuneExpGiven(runeIndex, all = false, runeLevel = player.runelevels[runeIndex], returnFactors = false) {
    // recycleMult accounted for all recycle chance, but inversed so it's a multiplier instead
    let recycleMultiplier = calculateRecycleMultiplier();

    // Rune multiplier that is summed instead of added
    let allRuneExpAdditiveMultiplier = sumContents([
        // Base amount multiplied per offering
        1,
        // +1 if C1 completion
        Math.min(1, player.highestchallengecompletions[1]),
        // +0.10 per C1 completion
        0.4 / 10 * player.highestchallengecompletions[1],
        // Research 5x2
        0.6 * player.researches[22],
        // Research 5x3
        0.3 * player.researches[23],
        // Particle Upgrade 1x1
        2 * player.upgrades[61],
        // Particle upgrade 3x1
        player.upgrades[71] * runeLevel / 25
    ]);

    if (all) {
        allRuneExpAdditiveMultiplier = sumContents([
            //Challenge 3 completions
            1 / 100 * player.highestchallengecompletions[3],
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
        1 / Math.pow(droughtMultiplier[player.usedCorruptions[8]], 1 - 2 / 3 * player.platonicUpgrades[13]),
        // Constant Upgrade Multiplier
        1 + 1 / 10 * player.constantUpgrades[8],
        // Challenge 15 reward multiplier
        challenge15Rewards.runeExp
    ]);

    // Rune multiplier that gets applied to specific runes
    let runeExpMultiplier = [
        productContents([
            1 + (player.researches[78] / 50), 1 + (player.researches[111] / 100), 1 + (CalcECC('reincarnation', player.challengecompletions[7]) / 10)
        ]),
        productContents([
            1 + (player.researches[80] / 50), 1 + (player.researches[112] / 100), 1 + (CalcECC('reincarnation', player.challengecompletions[7]) / 10)
        ]),
        productContents([
            1 + (player.researches[79] / 50), 1 + (player.researches[113] / 100), 1 + (CalcECC('reincarnation', player.challengecompletions[8]) / 5)
        ]),
        productContents([
            1 + (player.researches[77] / 50), 1 + (player.researches[114] / 100), 1 + (CalcECC('reincarnation', player.challengecompletions[6]) / 10)
        ]),
        productContents([
            1 + (player.researches[83] / 20), 1 + (player.researches[115] / 100), 1 + (CalcECC('reincarnation', player.challengecompletions[9]) / 5)
        ])
    ];

    let fact = [
        allRuneExpAdditiveMultiplier,
        allRuneExpMultiplier,
        recycleMultiplier,
        runeExpMultiplier[runeIndex]
    ]
    if (returnFactors) {
        return fact
    } else {
        return productContents(fact);
    }
}

function lookupTableGen(runeLevel) {
    // Rune exp required to level multipliers
    let allRuneExpRequiredMultiplier = productContents([
        Math.pow(runeLevel / 2, 3),
        ((3.5 * runeLevel) + 100) / 500,
        Math.max(1, (runeLevel - 200) / 9),
        Math.max(1, (runeLevel - 400) / 12),
        Math.max(1, (runeLevel - 600) / 15),
        Math.max(1, Math.pow(1.03, (runeLevel - 800) / 4))
    ]);
    return allRuneExpRequiredMultiplier
}

let lookupTableRuneExp = function () {
    let lookup = {};
    for (let runeLevel = 0; runeLevel <= 20000; ++runeLevel) {
        lookup[runeLevel] = lookupTableGen(runeLevel);
    }
    return lookup;
}();

// Returns the amount of exp required to level a rune
function calculateRuneExpToLevel(runeIndex, runeLevel = player.runelevels[runeIndex]) {
    return lookupTableRuneExp[runeLevel] * runeexpbase[runeIndex];
}

function calculateMaxRunes(i) {
    let max = 1000;

    let increaseAll = 10 * (2 * player.cubeUpgrades[16] + 2 * player.cubeUpgrades[37])
        + 3 * player.constantUpgrades[7] + 80 * CalcECC('ascension', player.challengecompletions[11])
        + 200 * CalcECC('ascension', player.challengecompletions[14])
        + Math.floor(0.04 * player.researches[200] + 0.04 * player.cubeUpgrades[50])
    let increaseMaxLevel = [
        null,
        10 * (player.researches[78] + player.researches[111]) + increaseAll,
        10 * (player.researches[80] + player.researches[112]) + increaseAll,
        10 * (player.researches[79] + player.researches[113]) + increaseAll,
        10 * (player.researches[77] + player.researches[114]) + increaseAll,
        10 * player.researches[115] + increaseAll
    ]

    max += increaseMaxLevel[i]
    return max
}

function calculateOfferings(i, calcMult = true, statistic = false) {
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
        a += 1 / 200 * rune5level * effectiveLevelMult * (1 + player.researches[85] / 200)
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
        b += 1 / 200 * rune5level * effectiveLevelMult * (1 + player.researches[85] / 200)
        b *= (1 + Math.pow(Decimal.log(player.transcendShards.add(1), 10), 1 / 2) / 5);
        b *= (1 + CalcECC('reincarnation', player.challengecompletions[8]) / 25)
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
        c += 1 / 200 * rune5level * effectiveLevelMult * (1 + player.researches[85] / 200)
        c *= (1 + Math.pow(Decimal.log(player.prestigeShards.add(1), 10), 1 / 2) / 5);
        c *= (1 + CalcECC('reincarnation', player.challengecompletions[6]) / 50)
        c *= Math.min(Math.pow(player.prestigecounter / 10, 2), 1)
        if (player.prestigeCount >= 5) {
            c *= Math.max(1, player.prestigecounter / 10)
        }
    }
    q = a + b + c

    let arr = []
    arr.push(1 + 10 * player.achievements[33] / 100) // Alchemy Achievement 5
    arr.push(1 + 15 * player.achievements[34] / 100) // Alchemy Achievement 6
    arr.push(1 + 25 * player.achievements[35] / 100) // Alchemy Achievement 7
    arr.push(1 + 20 * player.upgrades[38] / 100) // Diamond Upgrade 4x3
    arr.push(1 + player.upgrades[75] * 2 * Math.min(1, Math.pow(player.maxobtainium / 30000000, 0.5))) // Particle Upgrade 3x5
    arr.push(1 + 1 / 50 * player.shopUpgrades.offeringAutoLevel); // Auto Offering Shop
    arr.push(1 + 1 / 400 * Math.pow(player.shopUpgrades.offeringTimerLevel, 2)) // Offering EX Shop
    arr.push(1 + 1 / 100 * player.shopUpgrades.cashGrabLevel) // Cash Grab
    arr.push(1 + 1 / 10000 * sumContents(player.challengecompletions) * player.researches[85]) //Research 4x10
    arr.push(1 + Math.pow((player.antUpgrades[6] + bonusant6), .66)) // Ant Upgrade:
    arr.push(cubeBonusMultiplier[3]) // Brutus
    arr.push(1 + 0.02 * player.constantUpgrades[3]) // Constant Upgrade 3
    arr.push(1 + 0.0003 * player.talismanLevels[3] * player.researches[149] + 0.0004 * player.talismanLevels[3] * player.researches[179]) //Research 6x24,8x4
    arr.push(1 + 0.12 * CalcECC('ascension', player.challengecompletions[12])) // Challenge 12
    arr.push(1 + 0.01 / 100 * player.researches[200]) // Research 8x25
    arr.push(1 + Math.min(1, player.ascensionCount / 1e6) * player.achievements[187]) //Ascension Count Achievement
    arr.push(1 + .6 * player.achievements[250] + 1 * player.achievements[251]) //Sun&Moon Achievements
    arr.push(1 + 0.05 * player.cubeUpgrades[46]) // Cube Upgrade 5x6
    arr.push(1 + 0.02 / 100 * player.cubeUpgrades[50]) // Cube Upgrade 5x10
    arr.push(1 + player.platonicUpgrades[5]) //Platonic ALPHA
    arr.push(1 + 2.5 * player.platonicUpgrades[10]) //Platonic BETA
    arr.push(1 + 5 * player.platonicUpgrades[15]) //Platonic OMEGA
    arr.push(challenge15Rewards.offering) //C15 Reward

    if (calcMult) {
        q *= productContents(arr)
    } else if (!calcMult) {
        return arr;
    }

    if (statistic) {
        return productContents(arr)
    }

    q = Math.floor(q) * 100 / 100

    let persecond = 0;
    if (i === 1) {
        persecond = q / (1 + player.prestigecounter)
    }
    if (i === 2) {
        persecond = q / (1 + player.transcendcounter)
    }
    if (i === 3) {
        persecond = q / (1 + player.reincarnationcounter)
    }
    if (persecond > player.offeringpersecond) {
        player.offeringpersecond = persecond
    }
    return (q);

}

function calculateObtainium(calcMult = true) {
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
    obtainiumGain *= (1 + rune5level / 200 * effectiveLevelMult * (1 + player.researches[84] / 200 * (1 + 1 * effectiveRuneSpiritPower[5] * calculateCorruptionPoints() / 400)))
    obtainiumGain *= (1 + 0.01 * player.achievements[84] + 0.03 * player.achievements[91] + 0.05 * player.achievements[98] + 0.07 * player.achievements[105] + 0.09 * player.achievements[112] + 0.11 * player.achievements[119] + 0.13 * player.achievements[126] + 0.15 * player.achievements[133] + 0.17 * player.achievements[140] + 0.19 * player.achievements[147])
    obtainiumGain *= (1 + 2 * Math.pow((player.antUpgrades[10] + bonusant10) / 50, 2 / 3))
    obtainiumGain *= (1 + player.achievements[188] * Math.min(2, player.ascensionCount / 5e6))
    obtainiumGain *= (1 + 0.6 * player.achievements[250] + 1 * player.achievements[251])
    obtainiumGain *= cubeBonusMultiplier[5]
    obtainiumGain *= (1 + 0.04 * player.constantUpgrades[4])
    obtainiumGain *= (1 + 0.1 * player.cubeUpgrades[47])
    obtainiumGain *= (1 + 0.1 * player.cubeUpgrades[3])
    obtainiumGain *= (1 + 0.5 * CalcECC('ascension', player.challengecompletions[12]))
    obtainiumGain *= (1 + calculateCorruptionPoints() / 400 * effectiveRuneSpiritPower[4])
    obtainiumGain *= (1 + 0.03 * Math.log(player.uncommonFragments + 1) / Math.log(4) * player.researches[144])
    obtainiumGain *= (1 + 0.02 / 100 * player.cubeUpgrades[50])
    if (player.achievements[53] > 0) {
        obtainiumGain *= (1 + 1 / 800 * (runeSum))
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
    obtainiumGain *= (1 + 1 / 200 * Math.pow(player.shopUpgrades.obtainiumTimerLevel, 2))
    if (player.reincarnationCount >= 5) {
        obtainiumGain *= Math.max(1, player.reincarnationcounter / 10)
    }
    obtainiumGain *= Math.pow(Decimal.log(player.transcendShards.add(1), 10) / 300, 2)
    obtainiumGain = Math.pow(obtainiumGain, Math.min(1, illiteracyPower[player.usedCorruptions[5]] * (1 + 9 / 50 * player.platonicUpgrades[9] * Math.min(50, Math.log(player.researchPoints + 10) / Math.log(10)))))
    obtainiumGain *= (1 + 4 / 100 * player.cubeUpgrades[42])
    obtainiumGain *= (1 + 3 / 100 * player.cubeUpgrades[43])
    obtainiumGain *= (1 + player.platonicUpgrades[5])
    obtainiumGain *= (1 + 1.5 * player.platonicUpgrades[9])
    obtainiumGain *= (1 + 2.5 * player.platonicUpgrades[10])
    obtainiumGain *= (1 + 5 * player.platonicUpgrades[15])
    obtainiumGain *= challenge15Rewards.obtainium
    if (player.currentChallenge.ascension === 15) {
        obtainiumGain += 1;
    }
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
        positiveBonus += 0.02
    }
    if (player.achievements[136] === 1) {
        positiveBonus += 0.02
    }
    positiveBonus += 0.02 * (player.talismanRarity[4] - 1)
    positiveBonus += 1.2 * player.researches[106] / 100
    positiveBonus += 1.2 * player.researches[107] / 100
    positiveBonus += 1.2 * player.researches[116] / 200
    positiveBonus += 1.2 * player.researches[117] / 200
    positiveBonus += (cubeBonusMultiplier[9] - 1)
    positiveBonus += 0.0004 * player.cubeUpgrades[50]
    negativeBonus += 0.06 * player.researches[118]
    negativeBonus += 0.0004 * player.cubeUpgrades[50]
    for (let i = 1; i <= 5; i++) {
        if (player.talismanOne[i] === (1)) {
            talisman1Effect[i] = (talismanPositiveModifier[player.talismanRarity[1]] + positiveBonus) * player.talismanLevels[1] * challenge15Rewards.talismanBonus
        } else {
            talisman1Effect[i] = (talismanNegativeModifier[player.talismanRarity[1]] - negativeBonus) * player.talismanLevels[1] * (-1) * challenge15Rewards.talismanBonus
        }

        if (player.talismanTwo[i] === (1)) {
            talisman2Effect[i] = (talismanPositiveModifier[player.talismanRarity[2]] + positiveBonus) * player.talismanLevels[2] * challenge15Rewards.talismanBonus
        } else {
            talisman2Effect[i] = (talismanNegativeModifier[player.talismanRarity[2]] - negativeBonus) * player.talismanLevels[2] * (-1) * challenge15Rewards.talismanBonus
        }

        if (player.talismanThree[i] === (1)) {
            talisman3Effect[i] = (talismanPositiveModifier[player.talismanRarity[3]] + positiveBonus) * player.talismanLevels[3] * challenge15Rewards.talismanBonus
        } else {
            talisman3Effect[i] = (talismanNegativeModifier[player.talismanRarity[3]] - negativeBonus) * player.talismanLevels[3] * (-1) * challenge15Rewards.talismanBonus
        }

        if (player.talismanFour[i] === (1)) {
            talisman4Effect[i] = (talismanPositiveModifier[player.talismanRarity[4]] + positiveBonus) * player.talismanLevels[4] * challenge15Rewards.talismanBonus
        } else {
            talisman4Effect[i] = (talismanNegativeModifier[player.talismanRarity[4]] - negativeBonus) * player.talismanLevels[4] * (-1) * challenge15Rewards.talismanBonus
        }

        if (player.talismanFive[i] === (1)) {
            talisman5Effect[i] = (talismanPositiveModifier[player.talismanRarity[5]] + positiveBonus) * player.talismanLevels[5] * challenge15Rewards.talismanBonus
        } else {
            talisman5Effect[i] = (talismanNegativeModifier[player.talismanRarity[5]] - negativeBonus) * player.talismanLevels[5] * (-1) * challenge15Rewards.talismanBonus
        }

        if (player.talismanSix[i] === (1)) {
            talisman6Effect[i] = (talismanPositiveModifier[player.talismanRarity[6]] + positiveBonus) * player.talismanLevels[6] * challenge15Rewards.talismanBonus
        } else {
            talisman6Effect[i] = (talismanNegativeModifier[player.talismanRarity[6]] - negativeBonus) * player.talismanLevels[6] * (-1) * challenge15Rewards.talismanBonus
        }

        if (player.talismanSeven[i] === (1)) {
            talisman7Effect[i] = (talismanPositiveModifier[player.talismanRarity[7]] + positiveBonus) * player.talismanLevels[7] * challenge15Rewards.talismanBonus
        } else {
            talisman7Effect[i] = (talismanNegativeModifier[player.talismanRarity[7]] - negativeBonus) * player.talismanLevels[7] * (-1) * challenge15Rewards.talismanBonus
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
        rune2Talisman += 400;
    }
    if (player.talismanRarity[2] === 6) {
        rune1Talisman += 400;
    }
    if (player.talismanRarity[3] === 6) {
        rune4Talisman += 400;
    }
    if (player.talismanRarity[4] === 6) {
        rune3Talisman += 400;
    }
    if (player.talismanRarity[5] === 6) {
        rune5Talisman += 400;
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
        rune1level = Math.max(1, player.runelevels[0] + Math.min(1e7, (player.antUpgrades[9] + bonusant9)) * 1 + (rune1Talisman) + 7 * player.constantUpgrades[7])
        rune2level = Math.max(1, player.runelevels[1] + Math.min(1e7, (player.antUpgrades[9] + bonusant9)) * 1 + (rune2Talisman) + 7 * player.constantUpgrades[7])
        rune3level = Math.max(1, player.runelevels[2] + Math.min(1e7, (player.antUpgrades[9] + bonusant9)) * 1 + (rune3Talisman) + 7 * player.constantUpgrades[7])
        rune4level = Math.max(1, player.runelevels[3] + Math.min(1e7, (player.antUpgrades[9] + bonusant9)) * 1 + (rune4Talisman) + 7 * player.constantUpgrades[7])
        rune5level = Math.max(1, player.runelevels[4] + Math.min(1e7, (player.antUpgrades[9] + bonusant9)) * 1 + (rune5Talisman) + 7 * player.constantUpgrades[7])
    }

    runeSum = 0;
    for (let i = 1; i <= 5; i++) {
        runeSum += window['rune' + i + 'level']
    }
    calculateRuneBonuses();
}

function calculateRuneBonuses() {
    blessingMultiplier = 1
    spiritMultiplier = 1

    blessingMultiplier *= (1 + 6.9 * player.researches[134] / 100)
    blessingMultiplier *= (1 + player.talismanRarity[3] / 10)
    blessingMultiplier *= (1 + 0.10 * Math.log(player.epicFragments + 1) / Math.log(10) * player.researches[174])
    blessingMultiplier *= (1 + player.researches[194] / 100)
    if (player.researches[160] > 0) {
        blessingMultiplier *= Math.pow(1.25, 8)
    }
    spiritMultiplier *= (1 + 8 * player.researches[164] / 100)
    if (player.researches[165] > 0 && player.currentChallenge.ascension !== 0) {
        spiritMultiplier *= Math.pow(2, 8)
    }
    spiritMultiplier *= (1 + 0.15 * Math.log(player.legendaryFragments + 1) / Math.log(10))
    spiritMultiplier *= (1 + 2 * player.researches[194] / 100)

    for (let i = 1; i <= 5; i++) {
        runeBlessings[i] = blessingMultiplier * player.runelevels[i - 1] * player.runeBlessingLevels[i]
        runeSpirits[i] = spiritMultiplier * player.runelevels[i - 1] * player.runeSpiritLevels[i]
    }

    for (let i = 1; i <= 5; i++) {
        if (runeBlessings[i] <= 1e30) {
            effectiveRuneBlessingPower[i] = (Math.pow(runeBlessings[i], 1 / 8)) / 75 * challenge15Rewards.blessingBonus
        } else if (runeBlessings[i] > 1e30) {
            effectiveRuneBlessingPower[i] = Math.pow(10, 5 / 2) * (Math.pow(runeBlessings[i], 1 / 24)) / 75 * challenge15Rewards.blessingBonus
        }
        ;
        if (runeSpirits[i] <= 1e25) {
            effectiveRuneSpiritPower[i] = (Math.pow(runeSpirits[i], 1 / 8)) / 75 * challenge15Rewards.spiritBonus
        } else if (runeSpirits[i] > 1e25) {
            effectiveRuneSpiritPower[i] = Math.pow(10, 25 / 12) * (Math.pow(runeSpirits[i], 1 / 24)) / 75 * challenge15Rewards.spiritBonus
        }
        ;
    }
}

function calculateAnts() {

    let bonusLevels = 0;
    bonusLevels += 2 * (player.talismanRarity[6] - 1);
    bonusLevels += CalcECC('reincarnation', player.challengecompletions[9]);
    bonusLevels += 2 * player.constantUpgrades[6];
    bonusLevels += 12 * CalcECC('ascension', player.challengecompletions[11]);
    bonusLevels += Math.floor(1 / 200 * player.researches[200]);
    bonusLevels *= challenge15Rewards.bonusAntLevel
    let c11 = 0;
    let c11bonus = 0;
    if (player.currentChallenge.ascension === 11) {
        c11 = 999
    }
    if (player.currentChallenge.ascension === 11) {
        c11bonus = Math.floor((4 * player.challengecompletions[8] + 23 * player.challengecompletions[9]) * Math.max(0, (1 - player.challengecompletions[11] / 10)));
    }
    bonusant1 = Math.min(player.antUpgrades[1] + c11, 4 * player.researches[97] + bonusLevels + player.researches[102] + 2 * player.researches[132] + c11bonus)
    bonusant2 = Math.min(player.antUpgrades[2] + c11, 4 * player.researches[97] + bonusLevels + player.researches[102] + 2 * player.researches[132] + c11bonus)
    bonusant3 = Math.min(player.antUpgrades[3] + c11, 4 * player.researches[97] + bonusLevels + player.researches[102] + 2 * player.researches[132] + c11bonus)
    bonusant4 = Math.min(player.antUpgrades[4] + c11, 4 * player.researches[97] + bonusLevels + player.researches[102] + 2 * player.researches[132] + c11bonus)
    bonusant5 = Math.min(player.antUpgrades[5] + c11, 4 * player.researches[97] + bonusLevels + player.researches[102] + 2 * player.researches[132] + c11bonus)
    bonusant6 = Math.min(player.antUpgrades[6] + c11, 4 * player.researches[97] + bonusLevels + player.researches[102] + 2 * player.researches[132] + c11bonus)
    bonusant7 = Math.min(player.antUpgrades[7] + c11, 4 * player.researches[98] + bonusLevels + player.researches[102] + 2 * player.researches[132] + c11bonus)
    bonusant8 = Math.min(player.antUpgrades[8] + c11, 4 * player.researches[98] + bonusLevels + player.researches[102] + 2 * player.researches[132] + c11bonus)
    bonusant9 = Math.min(player.antUpgrades[9] + c11, 4 * player.researches[98] + bonusLevels + player.researches[102] + 2 * player.researches[132] + c11bonus)
    bonusant10 = Math.min(player.antUpgrades[10] + c11, 4 * player.researches[98] + bonusLevels + player.researches[102] + 2 * player.researches[132] + c11bonus)
    bonusant11 = Math.min(player.antUpgrades[11] + c11, 4 * player.researches[98] + bonusLevels + player.researches[102] + 2 * player.researches[132] + c11bonus)
    bonusant12 = Math.min(player.antUpgrades[12] + c11, 4 * player.researches[98] + bonusLevels + player.researches[102] + 2 * player.researches[132] + c11bonus)

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
        antELO += 100 * CalcECC('reincarnation', player.challengecompletions[10])
        antELO += 75 * player.upgrades[80]
        antELO = 1 / 10 * Math.floor(10 * antELO)

        effectiveELO += 0.5 * Math.min(3500, antELO)
        effectiveELO += 0.1 * Math.min(4000, antELO)
        effectiveELO += 0.1 * Math.min(6000, antELO)
        effectiveELO += 0.1 * Math.min(10000, antELO)
        effectiveELO += 0.2 * antELO
        effectiveELO += (cubeBonusMultiplier[8] - 1)
        effectiveELO += 1 * player.cubeUpgrades[50]
        effectiveELO *= (1 + 0.03 * player.upgrades[124])


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
    upgradeMultiplier *= (1 + 1 / 50 * CalcECC('reincarnation', player.challengecompletions[10]));
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

    rewards.antSacrificePoints = effectiveELO * rewardsMult / 85;
    rewards.offerings = player.offeringpersecond * 0.15 * effectiveELO * rewardsMult / 180;
    rewards.obtainium = player.maxobtainiumpersecond * 0.24 * effectiveELO * rewardsMult / 180;
    rewards.talismanShards = (antELO > 500) ?
        Math.max(1, Math.floor(rewardsMult / 210 * Math.pow(1 / 4 * (Math.max(0, effectiveELO - 500)), 2))) :
        0;
    rewards.commonFragments = (antELO > 750) ?
        Math.max(1, Math.floor(rewardsMult / 110 * Math.pow(1 / 9 * (Math.max(0, effectiveELO - 750)), 1.83))) :
        0;
    rewards.uncommonFragments = (antELO > 1000) ?
        Math.max(1, Math.floor(rewardsMult / 170 * Math.pow(1 / 16 * (Math.max(0, effectiveELO - 1000)), 1.66))) :
        0;
    rewards.rareFragments = (antELO > 1500) ?
        Math.max(1, Math.floor(rewardsMult / 200 * Math.pow(1 / 25 * (Math.max(0, effectiveELO - 1500)), 1.50))) :
        0;
    rewards.epicFragments = (antELO > 2000) ?
        Math.max(1, Math.floor(rewardsMult / 200 * Math.pow(1 / 36 * (Math.max(0, effectiveELO - 2000)), 1.33))) :
        0;
    rewards.legendaryFragments = (antELO > 3000) ?
        Math.max(1, Math.floor(rewardsMult / 230 * Math.pow(1 / 49 * (Math.max(0, effectiveELO - 3000)), 1.16))) :
        0;
    rewards.mythicalFragments = (antELO > 5000) ?
        Math.max(1, Math.floor(rewardsMult / 220 * Math.pow(1 / 64 * (Math.max(0, effectiveELO - 4150)), 1))) :
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
    forceTime = forceTime || 0;
    timeWarp = true;

    //Variable Declarations i guess
    let maximumTimer = 86400 + 7200 * player.researches[31] + 7200 + player.researches[32];
    const updatedTime = Date.now();
    let timeAdd = Math.min(maximumTimer, Math.max(forceTime, (updatedTime - player.offlinetick) / 1000))
    document.getElementById("offlineTimer").textContent = "You have " + format(timeAdd, 0) + " real-life seconds of Offline Progress!";
    let simulatedTicks = (timeAdd > 1000) ? 200 : 1 + Math.floor(timeAdd / 5);
    let tickValue = (timeAdd > 1000) ? timeAdd / 200 : Math.min(5, timeAdd);
    let timeMultiplier = 1;
    let maxSimulatedTicks = simulatedTicks;
    let progressBarWidth = 0;
    let automaticObtainium = 0;

    //Some one-time tick things that are relatively important
    toggleTalismanBuy(player.buyTalismanShardPercent);
    updateTalismanInventory();
    player.quarkstimer += timeAdd
    player.quarkstimer = Math.min(90000 + 45000 * player.researches[195], player.quarkstimer)
    player.ascensionCounter += timeAdd
    player.runeshards += timeAdd * (1 / 2 * Math.min(1, player.highestchallengecompletions[2]) + player.cubeUpgrades[2])
    document.getElementById('preload').style.display = (forceTime > 0) ? 'none' : 'block';
    document.getElementById("offlineprogressbar").style.display = "block";
    player.offlinetick = (player.offlinetick < 1.5e12) ? (Date.now()) : player.offlinetick;
    let runOffline = interval(runSimulator, 0)

    //The cool shit that forces the repetitive loops
    function runSimulator() {
        timeMultiplier = calculateTimeAcceleration();
        calculateObtainium();
        //Reset Stuff lmao!
        player.prestigecounter += tickValue * timeMultiplier;
        player.transcendcounter += tickValue * timeMultiplier;
        player.reincarnationcounter += tickValue * timeMultiplier;
        //Credit Resources
        resourceGain(tickValue * timeMultiplier)
        //Auto Obtainium Stuff
        if (player.researches[61] > 0 && player.currentChallenge.ascension !== 14) {
            calculateObtainium();
            automaticObtainium = calculateAutomaticObtainium();
            player.researchPoints += tickValue * automaticObtainium;
        }
        //Auto Ant Sacrifice Stuff
        if (player.achievements[173] > 0) {
            player.antSacrificeTimer += tickValue * timeMultiplier;
            player.antSacrificeTimerReal += tickValue;
        }
        //Auto Rune Sacrifice Stuff
        if (player.shopUpgrades.offeringAutoLevel > 0 && player.autoSacrificeToggle) {
            player.sacrificeTimer += tickValue;
            if (player.sacrificeTimer >= 1) {
                let rune = player.autoSacrifice;
                redeemShards(rune, true);
                player.sacrificeTimer = player.sacrificeTimer % 1;
            }
        }
        //Otherwise, Update All every simulated tick
        updateAll(true)
        //Misc functions
        simulatedTicks -= 1;
        progressBarWidth = 750 * (1 - simulatedTicks / maxSimulatedTicks);
        document.getElementById("offlineprogressdone").style.width = progressBarWidth + "px";
        if (simulatedTicks < 1) {
            clearInt(runOffline);
            timeWarp = false;
            document.getElementById("offlineprogressbar").style.display = "none";
            document.getElementById("preload").style.display = "none";
        }
    }

    player.offlinetick = updatedTime
    if (!player.loadedNov13Vers) {
        if (player.challengecompletions[14] > 0 || player.highestchallengecompletions[14] > 0) {
            let ascCount = player.ascensionCount;
            reset(4);
            player.ascensionCount = (ascCount + 1)
        }
        player.loadedNov13Vers = true
    }
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
    // The visual updates are handled in visualUpdateCubes()
    let cubeArray = [null, player.cubeBlessings.accelerator, player.cubeBlessings.multiplier, player.cubeBlessings.offering, player.cubeBlessings.runeExp, player.cubeBlessings.obtainium, player.cubeBlessings.antSpeed, player.cubeBlessings.antSacrifice, player.cubeBlessings.antELO, player.cubeBlessings.talismanBonus, player.cubeBlessings.globalSpeed]
    let powerBonus = [null, player.cubeUpgrades[45] / 100, player.cubeUpgrades[35] / 100, player.cubeUpgrades[24] / 100, player.cubeUpgrades[14] / 100, player.cubeUpgrades[40] / 100, player.cubeUpgrades[22] / 40, player.cubeUpgrades[15] / 100, player.cubeUpgrades[25] / 100, player.cubeUpgrades[44] / 100, player.cubeUpgrades[34] / 100]

    for (let i = 1; i <= 10; i++) {
        let power = 1;
        let mult = 1;
        if (cubeArray[i] >= 1000) {
            power = blessingDRPower[i];
            mult *= Math.pow(1000, (1 - blessingDRPower[i]) * (1 + powerBonus[i]));
        }
        if (i === 6) {
            power = 2.25;
            mult = 1;
        }

        cubeBonusMultiplier[i] = 1 + mult * blessingbase[i] * Math.pow(cubeArray[i], power * (1 + powerBonus[i])) * tesseractBonusMultiplier[i];
    }
    calculateRuneLevels();
    calculateAntSacrificeELO();
    calculateObtainium();

}

function calculateCubeMultiplier(calcMult = true) {
    let arr = [];
    arr.push(Math.pow(Math.min(1, player.ascensionCounter / 10), 2) * (1 + (1 / 4 * player.achievements[204] + 1 / 4 * player.achievements[211] + 1 / 2 * player.achievements[218]) * Math.max(0, player.ascensionCounter / 10 - 1)))
    arr.push(1 + 3 / 100 * player.shopUpgrades.seasonPassLevel)
    arr.push(1 + player.researches[119] / 400);
    arr.push(1 + player.researches[120] / 400);
    arr.push(1 + 14 * player.cubeUpgrades[1] / 100);
    arr.push(1 + 7 * player.cubeUpgrades[11] / 100);
    arr.push(1 + 7 * player.cubeUpgrades[21] / 100);
    arr.push(1 + 7 * player.cubeUpgrades[31] / 100);
    arr.push(1 + 7 * player.cubeUpgrades[41] / 100);
    arr.push(1 + player.researches[137] / 100);
    arr.push(1 + 0.9 * player.researches[152] / 100);
    arr.push(1 + 0.8 * player.researches[167] / 100);
    arr.push(1 + 0.7 * player.researches[182] / 100);
    arr.push(1 + 0.6 * player.researches[197] / 100);
    arr.push(1 + player.achievements[189] * Math.min(0.25, player.ascensionCount / 2.5e8));
    arr.push(1 + 0.03 / 100 * player.researches[192] * player.antUpgrades[12]);
    arr.push(1 + calculateCorruptionPoints() / 400 * effectiveRuneSpiritPower[2]);
    arr.push(1 + 0.004 / 100 * player.researches[200]);
    arr.push(1 + 0.01 * Decimal.log(player.ascendShards.add(1), 4) * Math.min(1, player.constantUpgrades[10]));
    arr.push(1 + 0.25 * player.cubeUpgrades[30])
    arr.push(1 + player.achievements[193] * Decimal.log(player.ascendShards.add(1), 10) / 400);
    arr.push(1 + player.achievements[195] * Decimal.log(player.ascendShards.add(1), 10) / 400);
    arr.push(1 + 4 / 100 * (player.achievements[198] + player.achievements[199] + player.achievements[200]) + 3 / 100 * player.achievements[201])
    arr.push(1 + player.achievements[240] * Math.max(0.1, 1 / 20 * Math.log(calculateTimeAcceleration() + 0.01) / Math.log(10)))
    arr.push(1 + 6 / 100 * player.achievements[250] + 10 / 100 * player.achievements[251])
    arr.push(platonicBonusMultiplier[0])
    arr.push(challenge15Rewards.cube)
    // statistics include everything up to this point
    if (calcMult) {
        return productContents(arr);
    } else {
        return arr;
    }
}

function calculateTimeAcceleration() {
    let timeMult = 1;
    timeMult *= (1 + 1 / 300 * Math.log(player.maxobtainium + 1) / Math.log(10) * player.upgrades[70]) //Particle upgrade 2x5
    timeMult *= (1 + player.researches[121] / 50); // research 5x21
    timeMult *= (1 + 0.015 * player.researches[136]) // research 6x11
    timeMult *= (1 + 0.012 * player.researches[151]) // research 7x1
    timeMult *= (1 + 0.009 * player.researches[166]) // research 7x16
    timeMult *= (1 + 0.006 * player.researches[181]) // research 8x6
    timeMult *= (1 + 0.003 * player.researches[196]) // research 8x21
    timeMult *= (1 + 8 * effectiveRuneBlessingPower[1]); // speed blessing
    timeMult *= (1 + calculateCorruptionPoints() / 400 * effectiveRuneSpiritPower[1]) // speed SPIRIT
    timeMult *= cubeBonusMultiplier[10]; // Chronos cube blessing
    timeMult *= 1 + player.cubeUpgrades[18] / 5; // cube upgrade 2x8
    timeMult *= calculateSigmoid(2, player.antUpgrades[12] + bonusant12, 69) // ant 12
    timeMult *= (1 + 0.10 * (player.talismanRarity[2] - 1)) // Chronos Talisman bonus
    timeMult *= challenge15Rewards.globalSpeed // Challenge 15 reward
    timeMult *= lazinessMultiplier[player.usedCorruptions[3]]

    if (player.currentChallenge.ascension === 15 && player.platonicUpgrades[15] > 0) {
        timeMult *= 1000
    }
    if (timeMult > 100) {
        timeMult = 10 * Math.sqrt(timeMult)
    }
    if (timeMult < 1) {
        timeMult = Math.pow(timeMult, 1 - player.platonicUpgrades[7] / 20)
    }
    timeMult *= platonicBonusMultiplier[7]
    if (player.usedCorruptions[3] >= 6 && player.achievements[241] < 1) {
        achievementaward(241)
    }
    if (timeMult > 3600 && player.achievements[242] < 1) {
        achievementaward(242)
    }
    return (timeMult)
}

function calculateCorruptionPoints() {
    let basePoints = 400;

    for (let i = 1; i <= 9; i++) {
        basePoints += 16 * Math.pow(player.usedCorruptions[i], 2)
    }

    return (basePoints)
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

//If you want to sum from a baseline level baseLevel to some level where the cost per level is base * (1 + level * diffPerLevel), this finds out how many total levels you can buy.
function calculateSummationNonLinear(baseLevel, baseCost, resourceAvailable, diffPerLevel, buyAmount) {
    let c = diffPerLevel / 2
    resourceAvailable = resourceAvailable || 0
    let alreadySpent = baseCost * (c * Math.pow(baseLevel, 2) + baseLevel * (1 - c))
    resourceAvailable += alreadySpent
    let v = resourceAvailable / baseCost
    let buyToLevel = 0
    if (c > 0) {
        buyToLevel = Math.max(0, Math.floor((c - 1) / (2 * c) + Math.pow(Math.pow(1 - c, 2) + 4 * c * v, 1 / 2) / (2 * c)))
    }
    if (c == 0) {
        buyToLevel = Math.floor(v)
    }
    buyToLevel = Math.min(buyToLevel, buyAmount + baseLevel)
    let totalCost = baseCost * (c * Math.pow(buyToLevel, 2) + buyToLevel * (1 - c)) - alreadySpent
    if (buyToLevel == baseLevel) {
        totalCost = baseCost * (1 + 2 * c * baseLevel)
    }
    return [buyToLevel, totalCost]
}


//Banked Cubes, Score, Cube Gain, Tesseract Gain, Hypercube Gain
function CalcCorruptionStuff() {
    let corruptionArrayMultiplier = [1, 2, 2.75, 3.5, 4.25, 5, 5.75, 6.5, 7, 7.5, 8, 9]
    let corruptionLevelSum = sumContents(player.usedCorruptions)
    let cubeBank = 0;
    let challengeModifier = 1;
    let corruptionMultiplier = 1;
    let bankMultiplier = 1;
    let effectiveScore = 1;
    let speed = calculateTimeAcceleration()
    for (let i = 1; i <= 10; i++) {
        challengeModifier = (i >= 6) ? 2 : 1;
        cubeBank += challengeModifier * player.highestchallengecompletions[i]
    }

    let baseScore = 0;
    let challengeScoreArrays1 = [0, 8, 10, 12, 15, 20, 60, 80, 120, 180, 300];
    let challengeScoreArrays2 = [0, 10, 12, 15, 20, 30, 80, 120, 180, 300, 450];
    let challengeScoreArrays3 = [0, 20, 30, 50, 100, 200, 250, 300, 400, 500, 750];

    for (let i = 1; i <= 10; i++) {
        baseScore += challengeScoreArrays1[i] * player.highestchallengecompletions[i]
        if (i <= 5 && player.highestchallengecompletions[i] >= 75) {
            baseScore += challengeScoreArrays2[i] * (player.highestchallengecompletions[i] - 75)
            if (player.highestchallengecompletions[i] >= 750) {
                baseScore += challengeScoreArrays3[i] * (player.highestchallengecompletions[i] - 750)
            }
        }
        if (i <= 10 && i > 5 && player.highestchallengecompletions[i] >= 25) {
            baseScore += challengeScoreArrays2[i] * (player.highestchallengecompletions[i] - 25)
            if (player.highestchallengecompletions[i] >= 60) {
                baseScore += challengeScoreArrays3[i] * (player.highestchallengecompletions[i] - 60)
            }
        }
    }
    baseScore *= Math.pow(1.03 + 0.005 * player.cubeUpgrades[39] + 0.0025 * (player.platonicUpgrades[5] + player.platonicUpgrades[10] + player.platonicUpgrades[15]), player.highestchallengecompletions[10]);
    for (let i = 1; i <= 10; i++) {
        corruptionMultiplier *= corruptionArrayMultiplier[player.usedCorruptions[i]]
    }

    effectiveScore = baseScore * corruptionMultiplier * challenge15Rewards.score * platonicBonusMultiplier[6]

    bankMultiplier = Math.pow(effectiveScore / 3000, 1 / 4.1);
    let cubeGain = cubeBank * bankMultiplier;
    cubeGain *= calculateCubeMultiplier();
    cubeGain *= (1 + 0.0001 * corruptionLevelSum * player.platonicUpgrades[1])
    if (effectiveScore > 5e12 && player.platonicUpgrades[10] > 0) {
        cubeGain *= 2;
    }
    if (effectiveScore > 25e12 && player.platonicUpgrades[15] > 0) {
        cubeGain *= 2.25
    }

    let tesseractGain = 1;
    tesseractGain *= Math.pow(1 + Math.max(0, (effectiveScore - 1e5)) / 1e4, .35);
    tesseractGain *= (1 + 0.01 * Decimal.log(player.ascendShards.add(1), 4) * Math.min(1, player.constantUpgrades[10]));
    if (effectiveScore >= 100000) {
        tesseractGain += 2
    }
    tesseractGain *= (1 + 0.25 * player.cubeUpgrades[30])
    tesseractGain *= (1 + 1 / 200 * player.cubeUpgrades[38] * sumContents(player.usedCorruptions))
    tesseractGain *= (1 + player.achievements[195] * Decimal.log(player.ascendShards.add(1), 10) / 400)
    tesseractGain *= Math.pow(Math.min(1, player.ascensionCounter / 10), 2) * (1 + (1 / 4 * player.achievements[204] + 1 / 4 * player.achievements[211] + 1 / 2 * player.achievements[218]) * Math.max(0, player.ascensionCounter / 10 - 1))
    tesseractGain *= (1 + 0.0002 * corruptionLevelSum * player.platonicUpgrades[2])
    if (effectiveScore > 7.5e12 && player.platonicUpgrades[10] > 0) {
        tesseractGain *= 2
    }
    if (effectiveScore > 50e12 && player.platonicUpgrades[15] > 0) {
        tesseractGain *= 2.25
    }
    tesseractGain *= platonicBonusMultiplier[1]
    tesseractGain *= challenge15Rewards.tesseract
    tesseractGain *= (1 + player.achievements[202] * Math.min(0.25, player.ascensionCount / 5e8))
    tesseractGain *= (1 + 4 / 100 * (player.achievements[205] + player.achievements[206] + player.achievements[207]) + 3 / 100 * player.achievements[208])
    tesseractGain *= (1 + player.achievements[240] * Math.max(0.1, 1 / 20 * Math.log(speed + 0.01) / Math.log(10)))
    tesseractGain *= (1 + 6 / 100 * player.achievements[250] + 10 / 100 * player.achievements[251])

    let hypercubeGain = (effectiveScore >= 1e9) ? 1 : 0;
    hypercubeGain *= Math.pow(1 + Math.max(0, (effectiveScore - 1e9)) / 1e8, .5);
    hypercubeGain *= Math.pow(Math.min(1, player.ascensionCounter / 10), 2) * (1 + (1 / 4 * player.achievements[204] + 1 / 4 * player.achievements[211] + 1 / 2 * player.achievements[218]) * Math.max(0, player.ascensionCounter / 10 - 1))
    hypercubeGain *= (1 + 0.0003 * corruptionLevelSum * player.platonicUpgrades[3])
    if (effectiveScore > 10e12 && player.platonicUpgrades[10] > 0) {
        hypercubeGain *= 2
    }
    if (effectiveScore > 100e12 && player.platonicUpgrades[15] > 0) {
        hypercubeGain *= 2.25
    }
    hypercubeGain *= platonicBonusMultiplier[2]
    hypercubeGain *= challenge15Rewards.hypercube
    hypercubeGain *= (1 + player.achievements[216] * Math.min(0.25, player.ascensionCount / 1e9))
    hypercubeGain *= (1 + 4 / 100 * (player.achievements[212] + player.achievements[213] + player.achievements[214]) + 3 / 100 * player.achievements[215])
    hypercubeGain *= (1 + player.achievements[240] * Math.max(0.1, 1 / 20 * Math.log(speed + 0.01) / Math.log(10)))
    hypercubeGain *= (1 + 6 / 100 * player.achievements[250] + 10 / 100 * player.achievements[251])

    let platonicGain = (effectiveScore >= 1.337e12) ? 1 : 0;
    platonicGain *= Math.pow(1 + Math.max(0, effectiveScore - 1.337e12) / 1.337e11, .75)
    platonicGain *= Math.pow(Math.min(1, player.ascensionCounter / 10), 2) * (1 + (1 / 4 * player.achievements[204] + 1 / 4 * player.achievements[211] + 1 / 2 * player.achievements[218]) * Math.max(0, player.ascensionCounter / 10 - 1))
    if (effectiveScore > 2.5e12) {
        platonicGain *= (1 + player.platonicUpgrades[4] / 100)
    }
    if (effectiveScore > 20e12 && player.platonicUpgrades[10] > 0) {
        platonicGain *= 2
    }
    if (effectiveScore > 250e12 && player.platonicUpgrades[15] > 0) {
        platonicGain *= 2.25
    }
    platonicGain *= platonicBonusMultiplier[3]
    platonicGain *= challenge15Rewards.platonic
    platonicGain *= (1 + player.achievements[223] * Math.min(0.25, player.ascensionCount / 1.337e9))
    platonicGain *= (1 + 4 / 100 * (player.achievements[219] + player.achievements[220] + player.achievements[221]) + 3 / 100 * player.achievements[222])
    platonicGain *= (1 + player.achievements[196] * 1 / 5000 * Decimal.log(player.ascendShards.add(1), 10))
    platonicGain *= (1 + player.achievements[240] * Math.max(0.1, 1 / 20 * Math.log(speed + 0.01) / Math.log(10)))
    platonicGain *= (1 + 6 / 100 * player.achievements[250] + 10 / 100 * player.achievements[251])

    return [cubeBank, Math.floor(baseScore), corruptionMultiplier, Math.floor(effectiveScore), Math.floor(cubeGain), Math.floor(tesseractGain), Math.floor(hypercubeGain), Math.floor(platonicGain)]
}

function dailyResetCheck() {
    if (player.dayCheck === 0) {
        player.dayCheck = new Date();
        console.log('date successfully calibrated!')
    }

    let d = new Date()
    let h = d.getHours()
    let m = d.getMinutes()
    let s = d.getSeconds()
    player.dayTimer = (60 * 60 * 24) - (60 * 60 * h) - (60 * m) - s
    if (d.getDate() !== player.dayCheck.getDate() || d.getMonth() !== player.dayCheck.getMonth() || d.getFullYear() !== player.dayCheck.getFullYear()) {
        player.dayCheck = new Date();
        player.cubeQuarkDaily = 0;
        player.tesseractQuarkDaily = 0;
        player.hypercubeQuarkDaily = 0;
        player.cubeOpenedDaily = 0;
        player.tesseractOpenedDaily = 0;
        player.hypercubeOpenedDaily = 0;

        document.getElementById('cubeQuarksOpenRequirement').style.display = "block"
        if (player.challengecompletions[11] > 0) {
            document.getElementById('tesseractQuarksOpenRequirement').style.display = "block"
        }
        if (player.challengecompletions[13] > 0) {
            document.getElementById('hypercubeQuarksOpenRequirement').style.display = "block"
        }

    }

}
