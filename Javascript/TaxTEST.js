function calculatetax(fast) {
    fast = fast || false
    let a = new Decimal(0);
    let c = 0;
    let e = 1;
    let f = 1;
    let compareC = 0;
    produceFirst = (player.firstGeneratedCoin.add(player.firstOwnedCoin)).times(globalCoinMultiplier).times(coinOneMulti).times(player.firstProduceCoin);
    produceSecond = (player.secondGeneratedCoin.add(player.secondOwnedCoin)).times(globalCoinMultiplier).times(coinTwoMulti).times(player.secondProduceCoin);
    produceThird = (player.thirdGeneratedCoin.add(player.thirdOwnedCoin)).times(globalCoinMultiplier).times(coinThreeMulti).times(player.thirdProduceCoin);
    produceFourth = (player.fourthGeneratedCoin.add(player.fourthOwnedCoin)).times(globalCoinMultiplier).times(coinFourMulti).times(player.fourthProduceCoin);
    produceFifth = (player.fifthGeneratedCoin.add(player.fifthOwnedCoin)).times(globalCoinMultiplier).times(coinFiveMulti).times(player.fifthProduceCoin);
    produceTotal = produceFirst.add(produceSecond).add(produceThird).add(produceFourth).add(produceFifth);

    if (produceFirst.lessThanOrEqualTo(.0001)) {
        produceFirst = new Decimal(0)
    }
    if (produceSecond.lessThanOrEqualTo(.0001)) {
        produceSecond = new Decimal(0)
    }
    if (produceThird.lessThanOrEqualTo(.0001)) {
        produceThird = new Decimal(0)
    }
    if (produceFourth.lessThanOrEqualTo(.0001)) {
        produceFourth = new Decimal(0)
    }
    if (produceFifth.lessThanOrEqualTo(.0001)) {
        produceFifth = new Decimal(0)
    }

    producePerSecond = produceTotal.times(40);

    if (player.currentChallenge.reincarnation === 6) {
        e = 3 * Math.pow((1 + player.challengecompletions[6] / 25), 2)
    }
    if (player.currentChallenge.reincarnation === 9) {
        e = 0.005
    }
    //im doing this to spite xander, basically changes w5x9 to not impact tax scaling in c13 || Sean#7236
    if (player.currentChallenge.ascension === 13) {
        e *= 100 * (1 + 1 / 2 * player.challengecompletions[13])
        e *= Math.pow(1.2, Math.max(0, sumContents(player.challengecompletions) - player.challengecompletions[11] - player.challengecompletions[12] - player.challengecompletions[14] - player.challengecompletions[15] - 9 - 3 * player.cubeUpgrades[49]))
    }
    if (player.challengecompletions[6] > 0) {
        f /= 1.075
    }
    let exponent = 1;
    exponent *= e;
    exponent *= (1 - 1 / 20 * player.researches[51] - 1 / 40 * player.researches[52] - 1 / 80 * player.researches[53] - 1 / 160 * player.researches[54] - 1 / 320 * player.researches[55])
    exponent *= (1 - 0.05 / 1800 * (player.achievements[45] + player.achievements[46] + 2 * player.achievements[47]) * Math.min(player.prestigecounter, 1800))
    exponent *= Math.pow(0.965, player.challengecompletions[6])
    exponent *= (0.001 + .999 * (Math.pow(6, -(rune2level * effectiveLevelMult) / 2500)))
    exponent *= (0.01 + .99 * (Math.pow(4, Math.min(0, (1000 - rune4level) / 2750))))
    exponent *= (1 - 0.04 * player.achievements[82] - 0.04 * player.achievements[89] - 0.04 * player.achievements[96] - 0.04 * player.achievements[103] - 0.04 * player.achievements[110] - 0.0566 * player.achievements[117] - 0.0566 * player.achievements[124] - 0.0566 * player.achievements[131])
    exponent *= f;
    exponent *= Math.pow(0.9925, player.achievements[118] * (player.challengecompletions[6] + player.challengecompletions[7] + player.challengecompletions[8] + player.challengecompletions[9] + player.challengecompletions[10]));
    exponent *= (0.01 + Math.pow(0.98, player.antUpgrades[3] + bonusant3 + .497))
    exponent *= 1 / (1 + Decimal.log(player.ascendShards.add(1), 10))
    exponent *= (1 - 0.10 * (player.talismanRarity[1] - 1))
    exponent *= Math.pow(0.98, 3 / 5 * Math.log(1 + player.rareFragments) / Math.log(10))
    maxexponent = Math.floor(275 / (Decimal.log(1.01, 10) * exponent)) - 1
    a = Math.min(maxexponent, Math.floor(Decimal.log(produceTotal.add(1), 10)));

    if (a >= 1) {
        c = Math.pow(a, 2) / 550
    }


    compareC = Math.pow(maxexponent, 2) / 550


    taxdivisor = Decimal.pow(1.01, (c) * (exponent))
    taxdivisorcheck = Decimal.pow(1.01, (compareC) * (exponent))
    let warning = "";
    if (player.reincarnationCount > 0.5) {
        warning = "Your tax also caps your Coin gain at " + format(Decimal.pow(10, maxexponent - Decimal.log(taxdivisorcheck, 10))) + "/s."
    }
    document.getElementById("taxinfo").textContent = "Due to your excessive wealth, coin production is divided by " + format(taxdivisor, 2) + " to pay taxes! " + warning
}

// Note that, for E < 1000 the tax is just 0, so we leave a 1.00 multiplier. For 1000 < E < 500,000 we denote tax as a dynamic progression from 1.01 to 5.00.

//If E > 500,000 we always want tax to be 5.

