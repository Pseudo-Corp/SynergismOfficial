function getReductionValue() {
    let reduction = 1;
    reduction += 1 / 400 * rune4level * effectiveLevelMult;
    reduction += 1 / 200 * (player.researches[56] + player.researches[57] + player.researches[58] + player.researches[59] + player.researches[60]);
    reduction += 1 / 200 * player.challengecompletions[4];
    reduction += 3 / 100 * (player.antUpgrades[7] + bonusant7);
    return reduction;
}

function getCostAccelerator(buyingTo) {
    --buyingTo;

    let originalCost = 500;
    let cost = new Decimal(originalCost);

    cost = cost.times(Decimal.pow(4 / costDivisor, buyingTo));

    if (buyingTo > (125 + 5 * player.challengecompletions[4])) {
        let num = buyingTo - 125 - 5 * player.challengecompletions[4];
        let factorialBit = new Decimal(num).factorial();
        let multBit = Decimal.pow(4, num);
        cost = cost.times(multBit.times(factorialBit));
    }

    if (buyingTo > (2000 + 5 * player.challengecompletions[4])) {
        let sumNum = buyingTo - 2000 - 5 * player.challengecompletions[4];
        let sumBit = sumNum * (sumNum + 1) / 2
        cost = cost.times(Decimal.pow(2, sumBit));
    }

    if (player.currentChallenge.transcension === 4) {
        let sumBit = buyingTo * (buyingTo + 1) / 2;
        cost = cost.times(Decimal.pow(10, sumBit));
    }

    if (player.currentChallenge.reincarnation === 8) {
        let sumBit = buyingTo * (buyingTo + 1) / 2;
        cost = cost.times(Decimal.pow(1e50, sumBit));
    }
    return cost;
}

function buyAccelerator(autobuyer) {
    // Start buying at the current amount bought + 1
    let buyTo = player.acceleratorBought + 1;
    let cashToBuy = getCostAccelerator(buyTo);
    while (player.coins.greaterThanOrEqualTo(cashToBuy)) {
        // then multiply by 4 until it reaches just above the amount needed
        buyTo = buyTo * 4;
        cashToBuy = getCostAccelerator(buyTo);
    }
    let stepdown = Math.floor(buyTo / 8);
    while (stepdown !== 0) {

        // if step down would push it below out of expense range then divide step down by 2
        if (getCostAccelerator(buyTo - stepdown).lessThanOrEqualTo(player.coins)) {
            stepdown = Math.floor(stepdown / 2);
        } else {
            buyTo = buyTo - stepdown;
        }
    }

    if (!autobuyer && player.coinbuyamount !== "max") {
        if (player.acceleratorBought + player.coinbuyamount < buyTo) {
            buyTo = player.acceleratorBought + player.coinbuyamount;
        }
    }

    let buyFrom = Math.max(buyTo - 7, player.acceleratorBought + 1);
    let thisCost = getCostAccelerator(buyFrom);
    while (buyFrom <= buyTo && player.coins.greaterThanOrEqualTo(thisCost)) {
        player.coins = player.coins.sub(thisCost);
        player.acceleratorBought = buyFrom;
        buyFrom = buyFrom + 1;
        thisCost = getCostAccelerator(buyFrom);
        player.acceleratorCost = thisCost;
    }

    player.prestigenoaccelerator = false;
    player.transcendnoaccelerator = false;
    player.reincarnatenoaccelerator = false;
    updateAllTick();
    if (player.acceleratorBought >= 5 && player.achievements[148] === 0) {
        achievementaward(148)
    }
    if (player.acceleratorBought >= 25 && player.achievements[149] === 0) {
        achievementaward(149)
    }
    if (player.acceleratorBought >= 100 && player.achievements[150] === 0) {
        achievementaward(150)
    }
    if (player.acceleratorBought >= 666 && player.achievements[151] === 0) {
        achievementaward(151)
    }
    if (player.acceleratorBought >= 2000 && player.achievements[152] === 0) {
        achievementaward(152)
    }
    if (player.acceleratorBought >= 12500 && player.achievements[153] === 0) {
        achievementaward(153)
    }
    if (player.acceleratorBought >= 100000 && player.achievements[154] === 0) {
        achievementaward(154)
    }
}

function getCostMultiplier(buyingTo) {
    --buyingTo;

    let originalCost = 1e5;
    let cost = new Decimal(originalCost);
    cost = cost.times(Decimal.pow(10, buyingTo / costDivisor));

    if (buyingTo > (75 + 2 * player.challengecompletions[4])) {
        let num = buyingTo - 75 - 2 * player.challengecompletions[4];
        let factorialBit = new Decimal(num).factorial();
        let powBit = Decimal.pow(10, num);
        cost = cost.times(factorialBit.times(powBit));
    }
    if (buyingTo > (2000 + 2 * player.challengecompletions[4])) {
        let sumNum = buyingTo - 2000 - 2 * player.challengecompletions[4];
        let sumBit = sumNum * (sumNum + 1) / 2;
        cost = cost.times(Decimal.pow(2, sumBit));
    }
    if (player.currentChallenge.transcension === 4) {
        let sumBit = buyingTo * (buyingTo + 1) / 2;
        cost = cost.times(Decimal.pow(10, sumBit));
    }
    if (player.currentChallenge.reincarnation === 8) {
        let sumBit = buyingTo * (buyingTo + 1) / 2;
        cost = cost.times(Decimal.pow(1e50, sumBit));
    }
    return cost;
}

function buyMultiplier(autobuyer) {
    // Start buying at the current amount bought + 1
    let buyTo = player.multiplierBought + 1;
    let cashToBuy = getCostMultiplier(buyTo);
    while (player.coins.greaterThanOrEqualTo(cashToBuy)) {
        // then multiply by 4 until it reaches just above the amount needed
        buyTo = buyTo * 4;
        cashToBuy = getCostMultiplier(buyTo);
    }
    let stepdown = Math.floor(buyTo / 8);
    while (stepdown !== 0) {

        // if step down would push it below out of expense range then divide step down by 2
        if (getCostMultiplier(buyTo - stepdown).lessThanOrEqualTo(player.coins)) {
            stepdown = Math.floor(stepdown / 2);
        } else {
            buyTo = buyTo - stepdown;
        }
    }

    if (!autobuyer && player.coinbuyamount !== "max") {
        if (player.multiplierBought + player.coinbuyamount < buyTo) {
            console.log(player.coinbuyamount + player.multiplierBought);
            buyTo = player.multiplierBought + player.coinbuyamount;
        }
    }

    let buyFrom = Math.max(buyTo - 7, player.multiplierBought + 1);
    let thisCost = getCostMultiplier(buyFrom);
    while (buyFrom <= buyTo && player.coins.greaterThanOrEqualTo(thisCost)) {
        player.coins = player.coins.sub(thisCost);
        player.multiplierBought = buyFrom;
        buyFrom = buyFrom + 1;
        thisCost = getCostMultiplier(buyFrom);
        player.multiplierCost = thisCost;
    }

    player.prestigenomultiplier = false;
    player.transcendnomultiplier = false;
    player.reincarnatenomultiplier = false;
    updateAllMultiplier();
    if (player.multiplierBought >= 2 && player.achievements[155] === 0) {
        achievementaward(155)
    }
    if (player.multiplierBought >= 20 && player.achievements[156] === 0) {
        achievementaward(156)
    }
    if (player.multiplierBought >= 100 && player.achievements[157] === 0) {
        achievementaward(157)
    }
    if (player.multiplierBought >= 500 && player.achievements[158] === 0) {
        achievementaward(158)
    }
    if (player.multiplierBought >= 2000 && player.achievements[159] === 0) {
        achievementaward(159)
    }
    if (player.multiplierBought >= 12500 && player.achievements[160] === 0) {
        achievementaward(160)
    }
    if (player.multiplierBought >= 100000 && player.achievements[161] === 0) {
        achievementaward(161)
    }

}

function getCost(originalCost, buyingTo, type, num, r) {
    // It's 0 indexed by mistake so you have to subtract 1 somewhere.
    --buyingTo;
    originalCost = new Decimal(originalCost);
    // Prevents multiple recreations of this variable because .factorial() is the only one that doesn't create a clone (?)
    let buyingToDec = new Decimal(buyingTo);
    // Accounts for the multiplies by 1.25^num buyingTo times
    let cost = originalCost.times(Decimal.pow(Math.pow(1.25, num), buyingTo));

    // Accounts for the add 1s
    cost = cost.add(1 * buyingTo);

    // floored r value gets used a lot in removing calculations
    let fr = Math.floor(r * 1000);
    if (buyingTo >= r * 1000) {

        // Accounts for all multiplications of itself up to buyingTo, while neglecting all multiplications of itself up to r*1000
        cost = cost.times(buyingToDec.factorial().dividedBy((new Decimal(fr).factorial())));

        // Accounts for all divisions of itself buyingTo times, while neglecting all divisions up to r*1000 times
        cost = cost.dividedBy(Decimal.pow(1000, buyingTo - fr));

        // Accounts for all multiplications of 1 + num/2, while neglecting all divisions up to r*1000 times
        cost = cost.times(Decimal.pow(1 + num / 2, buyingTo - fr));
    }

    fr = Math.floor(r * 5000);
    if (buyingTo >= r * 5000) {
        cost = cost.times(buyingToDec.factorial().dividedBy(new Decimal(fr).factorial()));
        cost = cost.times(Decimal.pow(10, buyingTo - fr));
        cost = cost.times(Decimal.pow(10 + num * 10, buyingTo - fr));
    }

    fr = Math.floor(r * 20000);
    if (buyingTo >= r * 20000) {
        // To truncate this expression I used Decimal.pow(Decimal.factorial(buyingTo), 3) which suprisingly (to me anyways) does actually work
        // So it takes all numbers up to buyingTo and pow3's them, then divides by all numbers up to r*20000 pow3'd
        cost = cost.times(Decimal.pow(buyingToDec.factorial(), 3)).dividedBy(Decimal.pow(new Decimal(fr).factorial(), 3));
        cost = cost.times(Decimal.pow(100000, buyingTo - fr));
        cost = cost.times(Decimal.pow(100 + num * 100, buyingTo - fr));
    }

    fr = Math.floor(r * 250000);
    if (buyingTo >= r * 250000) {
        //1.03^x*1.03^y = 1.03^(x+y), we'll abuse this for this section of the algorithm
        // 1.03^(x+y-((number of terms)250000*r))
        // up to 250003 case
        // assume r = 1 for this case
        // (1.03^250000-250000)(1.03^250001-250000)(1.03^250002-250000)(1.03^250003) = (1.03^0*1.03^1*1.03^2*1.03^3)
        // so in reality we just need to take buyingTo - fr and sum the power up to it
        // (1.03^(sum from 0 to buyingTo - fr)) is the multiplier
        // so (1.03^( (buyingTo-fr)(buyingTo-fr+1)/2 )
        // god damn that was hard to make an algo for
        cost = cost.times(Decimal.pow(1.03, (buyingTo - fr) * ((buyingTo - fr + 1) / 2)));
    }
    if ((player.currentChallenge.transcension === 4) && (type === "Coin" || type === "Diamonds")) {
        // you would not fucking believe how long it took me to figure this out
        // (100*costofcurrent + 10000)^n = (((100+buyingTo)!/100!)*100^buyingTo)^n
        cost = cost.times(Decimal.pow(new Decimal(buyingTo + 100).factorial().dividedBy(new Decimal(100).factorial()).times(Decimal.pow(100, buyingTo)), 1.25 + 1 / 4 * player.challengecompletions[4]));
        if (buyingTo >= (1000 - (10 * player.challengecompletions[4]))) {
            // and I changed this to be a summation of all the previous buys 1.25 to the sum from 1 to buyingTo
            cost = cost.times(Decimal.pow(1.25, (buyingTo * (buyingTo + 1) / 2)));
        }
    }
    if ((player.currentChallenge.reincarnation === 10) && (type === "Coin" || type === "Diamonds")) {
        // you would not fucking believe how long it took me to figure this out
        // (100*costofcurrent + 10000)^n = (((100+buyingTo)!/100!)*100^buyingTo)^n
        cost = cost.times(Decimal.pow(new Decimal(buyingTo + 100).factorial().dividedBy(new Decimal(100).factorial()).times(Decimal.pow(100, buyingTo)), 1.25 + 1 / 4 * player.challengecompletions[4]));
        if (buyingTo >= (r * 25000)) {
            // and I changed this to be a summation of all the previous buys 1.25 to the sum from 1 to buyingTo
            cost = cost.times(Decimal.pow(1.25, (buyingTo * (buyingTo + 1) / 2)));
        }
    }
    fr = Math.floor(r * 1000 * player.challengecompletions[8]);
    if (player.currentChallenge.reincarnation === 8 && (type === "Coin" || type === "Diamonds" || type === "Mythos") && buyingTo >= (1000 * player.challengecompletions[8] * r)) {

        const sumBuys = (buyingTo - (1000 * player.challengecompletions[8] * r)) * ((buyingTo - (1000 * player.challengecompletions[8] * r) + 1) / 2);
        const negBuys = (fr - (1000 * player.challengecompletions[8] * r)) * ((fr - (1000 * player.challengecompletions[8] * r) + 1) / 2);

        cost = cost.times(Decimal.pow(2, sumBuys - negBuys));

        // divided by same amount buying to - fr times
        cost = cost.dividedBy(Decimal.pow((1 + 1 / 2 * player.challengecompletions[8]), buyingTo - fr));
    }

    return cost;
}

function buyMax(pos, type, num, originalCost, autobuyer = false) {
    autobuyer = autobuyer || false;
    let tag = "";
    const r = getReductionValue();

    if (type === 'Diamonds') {
        tag = "prestigePoints";
    }
    if (type === 'Mythos') {
        tag = "transcendPoints";
    }
    if (type === 'Particles') {
        tag = "reincarnationPoints";
    }
    if (type === "Coin") {
        tag = "coins";
    }

    // Start buying at the current amount bought + 1
    let buyTo = player[pos + 'Owned' + type] + 1;
    let cashToBuy = getCost(originalCost, buyTo, type, num, r);
    while (player[tag].greaterThanOrEqualTo(cashToBuy)) {
        // then multiply by 4 until it reaches just above the amount needed
        buyTo = buyTo * 4;
        cashToBuy = getCost(originalCost, buyTo, type, num, r);
    }
    let stepdown = Math.floor(buyTo / 8);
    while (stepdown !== 0) {

        // if step down would push it below out of expense range then divide step down by 2
        if (getCost(originalCost, buyTo - stepdown, type, num, r).lessThanOrEqualTo(player[tag])) {
            stepdown = Math.floor(stepdown / 2);
        } else {
            buyTo = buyTo - stepdown;
        }
    }
    // go down by 7 steps below the last one able to be bought and spend the cost of 25 up to the one that you started with and stop if coin goes below requirement
    let buyFrom = Math.max(buyTo - 7, player[pos + 'Owned' + type] + 1);
    let thisCost = getCost(originalCost, buyFrom, type, num, r);
    while (buyFrom < buyTo && player[tag].greaterThanOrEqualTo(getCost(originalCost, buyFrom, type, num, r))) {
        player[tag] = player[tag].sub(thisCost);
        player[pos + 'Owned' + type] = buyFrom;
        buyFrom = buyFrom + 1;
        thisCost = getCost(originalCost, buyFrom, type, num, r);
        player[pos + 'Cost' + type] = thisCost;
    }
}


function buyProducer(pos, type, num, autobuyer) {
    let amounttype;
    let buythisamount = 0;
    let r = 1;
    let tag = "";
    r += 1 / 2000 * rune4level * effectiveLevelMult
    r += 1 / 200 * (player.researches[56] + player.researches[57] + player.researches[58] + player.researches[59] + player.researches[60])
    r += 1 / 200 * player.challengecompletions[4]
    r += 3 / 100 * player.antUpgrades[7] + 3 / 100 * bonusant7
    if (type === 'Diamonds') {
        tag = "prestigePoints";
        amounttype = "crystal";
    }
    if (type === 'Mythos') {
        tag = "transcendPoints";
        amounttype = "mythos"
    }
    if (type === 'Particles') {
        tag = "reincarnationPoints";
        amounttype = "particle"
    }
    if (type === "Coin") {
        tag = "coins";
        amounttype = "coin"
    }
    if (autobuyer) {
        buythisamount = 500
    }
    if (!autobuyer) {
        buythisamount = player[amounttype + 'buyamount']
    }
    while (player[tag].greaterThanOrEqualTo(player[pos + 'Cost' + type]) && ticker < buythisamount) {
        player[tag] = player[tag].sub(player[pos + 'Cost' + type]);
        player[pos + 'Owned' + type] += 1;
        player[pos + 'Cost' + type] = player[pos + 'Cost' + type].times(Decimal.pow(1.25, num));
        player[pos + 'Cost' + type] = player[pos + 'Cost' + type].add(1);
        if (player[pos + 'Owned' + type] >= (1000 * r)) {
            player[pos + 'Cost' + type] = player[pos + 'Cost' + type].times(player[pos + 'Owned' + type]).dividedBy(1000).times(1 + num / 2);
        }
        if (player[pos + 'Owned' + type] >= (5000 * r)) {
            player[pos + 'Cost' + type] = player[pos + 'Cost' + type].times(player[pos + 'Owned' + type]).times(10).times(10 + num * 10);
        }
        if (player[pos + 'Owned' + type] >= (20000 * r)) {
            player[pos + 'Cost' + type] = player[pos + 'Cost' + type].times(Decimal.pow(player[pos + 'Owned' + type], 3)).times(100000).times(100 + num * 100)
        }
        if (player[pos + 'Owned' + type] >= (250000 * r)) {
            player[pos + 'Cost' + type] = player[pos + 'Cost' + type].times(Decimal.pow(1.03, player[pos + 'Owned' + type] - 250000 * r))
        }
        if (player.currentChallenge.transcension === 4 && (type === "Coin" || type === "Diamonds")) {
            player[pos + 'Cost' + type] = player[pos + 'Cost' + type].times(Math.pow(100 * player[pos + 'Owned' + type] + 10000, 1.25 + 1 / 4 * player.challengecompletions[4]));
            if (player[pos + 'Owned' + type] >= 1000 - (10 * player.challengecompletions[4])) {
                player[pos + 'Cost' + type] = player[pos + 'Cost' + type].times(Decimal.pow(1.25, player[pos + 'Owned' + type]));
            }
        }
        if (player.currentChallenge.reincarnation === 8 && (type === "Coin" || type === "Diamonds" || type === "Mythos") && player[pos + 'Owned' + type] >= (1000 * player.challengecompletions[8] * r)) {
            player[pos + 'Cost' + type] = player[pos + 'Cost' + type].times(Decimal.pow(2, (player[pos + 'Owned' + type] - (1000 * player.challengecompletions[8] * r)) / (1 + 1 / 2 * player.challengecompletions[8])));
        }
        ticker += 1;
    }
    ticker = 0;
}

function buyResearch(index, auto) {
    auto = auto || false
    let c14 = 0;
    let spiritBonus = 0;
    if (index <= 5) {
        c14 += player.challengecompletions[14]
    }
    if (index === 84) {
        spiritBonus += Math.ceil(20 * calculateCorruptionPoints() / 400 * effectiveRuneSpiritPower[5])
    }

    if (player.autoResearchToggle && player.autoResearch > 0.5 && !auto) {
        let p = player.autoResearch
        if (player.researches[p] === researchMaxLevels[p]) {
            document.getElementById("res" + player.autoResearch).style.backgroundColor = "green"
        } else if (player.researches[p] > 0.5) {
            document.getElementById("res" + player.autoResearch).style.backgroundColor = "purple"
        } else {
            document.getElementById("res" + player.autoResearch).style.backgroundColor = "black"
        }
    }
    if (!auto && player.autoResearchToggle && player.shopUpgrades.obtainiumAutoLevel > 0.5 && player.cubeUpgrades[9] === 0) {
        player.autoResearch = index;
        document.getElementById("res" + index).style.backgroundColor = "orange"
    }

    let buyamount = 1;
    let i = 1;
    if (maxbuyresearch || auto) {
        buyamount = 1000
    }
    if (auto || !player.autoResearchToggle) {
        while (player.researches[index] < (researchMaxLevels[index] + c14 + spiritBonus) && player.researchPoints >= (researchBaseCosts[index]) && buyamount >= i) {
            player.researchPoints -= researchBaseCosts[index]
            player.researches[index] += 1;
            researchfiller2 = "Level: " + player.researches[index] + "/" + (researchMaxLevels[index] + c14 + spiritBonus)
            researchdescriptions(index, auto)

            if (index === 47 && player.unlocks.rrow1 === false) {
                player.unlocks.rrow1 = true;
                revealStuff()
            }
            if (index === 48 && player.unlocks.rrow2 === false) {
                player.unlocks.rrow2 = true;
                revealStuff()
            }
            if (index === 49 && player.unlocks.rrow3 === false) {
                player.unlocks.rrow3 = true;
                revealStuff()
            }
            if (index === 50 && player.unlocks.rrow4 === false) {
                player.unlocks.rrow4 = true;
                revealStuff()
            }
            i++
        }
        if (i > 1) {
            revealStuff()
        }
    }

    if (index > 0 && index <= 155) {
        if (player.researches[index] === (researchMaxLevels[index] + c14 + spiritBonus)) {
            document.getElementById("res" + index).style.backgroundColor = "green"
        }
    }
    if (auto && player.cubeUpgrades[9] === 1) {
        player.autoResearch = researchOrderByCost[player.roombaResearchIndex]
        if (player.researches[player.autoResearch] >= (researchMaxLevels[player.autoResearch] + c14 + spiritBonus)) {
            player.roombaResearchIndex += 1;
        }
        if (player.roombaResearchIndex <= 155) {
            document.getElementById("res" + researchOrderByCost[player.roombaResearchIndex]).style.backgroundColor = "orange"
        }
    }
    calculateRuneLevels();
    calculateAnts();
}

function buyUpgrades(type, pos, state) {
    let addendum = ""
    if (type === "prestige" || type === "transcend" || type === "reincarnation") {
        addendum = "Point"
    }
    if (player[type + addendum + 's'].greaterThanOrEqualTo(Decimal.pow(10, upgradeCosts[pos])) && player.upgrades[pos] === 0) {
        player[type + addendum + 's'] = player[type + addendum + 's'].sub(Decimal.pow(10, upgradeCosts[pos]))
        player.upgrades[pos] = 1;
        upgradeupdate(pos, state)
    }

    if (type === "transcend") {
        player.reincarnatenocoinprestigeortranscendupgrades = false;
        player.reincarnatenocoinprestigetranscendorgeneratorupgrades = false;
    }
    if (type === "prestige") {
        player.transcendnocoinorprestigeupgrades = false;
        player.reincarnatenocoinorprestigeupgrades = false;
        player.reincarnatenocoinprestigeortranscendupgrades = false;
        player.reincarnatenocoinprestigetranscendorgeneratorupgrades = false;
    }
    if (type === "coin") {
        player.prestigenocoinupgrades = false;
        player.transcendnocoinupgrades = false;
        player.transcendnocoinorprestigeupgrades = false;
        player.reincarnatenocoinupgrades = false;
        player.reincarnatenocoinorprestigeupgrades = false;
        player.reincarnatenocoinprestigeortranscendupgrades = false;
        player.reincarnatenocoinprestigetranscendorgeneratorupgrades = false;
    }

}

function calculateCrystalBuy(i) {
    let u = i - 1;
    let exponent = Decimal.log(player.prestigeShards.add(1), 10);

    let toBuy = Math.floor(Math.pow(Math.max(0, 2 * (exponent - crystalUpgradesCost[u]) / crystalUpgradeCostIncrement[u] + 1 / 4), 1 / 2) + 1 / 2)
    return (toBuy)

}

function buyCrystalUpgrades(i, auto) {
    auto = auto || false
    const u = i - 1;

    let c = 0;
    c += Math.floor(rune3level / 40 * (1 + player.researches[5] / 10) * (1 + player.researches[21] / 800) * (1 + player.researches[90] / 100)) * 100 / 100
    if (player.upgrades[73] > 0.5 && player.currentChallenge.reincarnation !== 0) {
        c += 10
    }

    let toBuy = calculateCrystalBuy(i);

    if (toBuy + c > player.crystalUpgrades[u]) {
        player.crystalUpgrades[u] = 100 / 100 * (toBuy + c)
        if (toBuy > 0) {
            player.prestigeShards = player.prestigeShards.sub(Decimal.pow(10, crystalUpgradesCost[u] + crystalUpgradeCostIncrement[u] * (1 / 2 * Math.pow(toBuy - 1 / 2, 2) - 1 / 8)))
            if (!auto) {
                crystalupgradedescriptions(i)
            }
        }
    }
}

function boostAccelerator(automated) {
    let buyamount = 1;
    if (player.upgrades[46] === 1) {
        buyamount = player.coinbuyamount;
        if (automated === true) {
            buyamount = 9999
        }
    }
    while (player.prestigePoints.greaterThanOrEqualTo(player.acceleratorBoostCost) && ticker < buyamount) {
        if (player.prestigePoints.greaterThanOrEqualTo(player.acceleratorBoostCost)) {
            player.acceleratorBoostBought += 1;
            player.acceleratorBoostCost = player.acceleratorBoostCost.times(1e10).times(Decimal.pow(10, player.acceleratorBoostBought));
            if (player.acceleratorBoostBought > (1000 * (1 + 2 * effectiveRuneBlessingPower[4]))) {
                player.acceleratorBoostCost = player.acceleratorBoostCost.times(Decimal.pow(10, Math.pow(player.acceleratorBoostBought - (1000 * (1 + 2 * effectiveRuneBlessingPower[4])), 2) / (1 + 2 * effectiveRuneBlessingPower[4])))
            }
            player.transcendnoaccelerator = false;
            player.reincarnatenoaccelerator = false;
            if (player.upgrades[46] < 0.5) {
                for (let j = 21; j < 41; j++) {
                    player.upgrades[j] = 0;
                }
                reset(1);
                player.prestigePoints = new Decimal(0);
            }
        }
        ticker++
    }
    ticker = 0;
    if (player.acceleratorBoostBought >= 2 && player.achievements[162] === 0) {
        achievementaward(162)
    }
    if (player.acceleratorBoostBought >= 10 && player.achievements[163] === 0) {
        achievementaward(163)
    }
    if (player.acceleratorBoostBought >= 50 && player.achievements[164] === 0) {
        achievementaward(164)
    }
    if (player.acceleratorBoostBought >= 200 && player.achievements[165] === 0) {
        achievementaward(165)
    }
    if (player.acceleratorBoostBought >= 1000 && player.achievements[166] === 0) {
        achievementaward(166)
    }
    if (player.acceleratorBoostBought >= 5000 && player.achievements[167] === 0) {
        achievementaward(167)
    }
    if (player.acceleratorBoostBought >= 15000 && player.achievements[168] === 0) {
        achievementaward(168)
    }


}

function getParticleCost(originalCost, buyTo) {
    --buyTo;
    originalCost = new Decimal(originalCost)
    let cost = originalCost.times(Decimal.pow(2, buyTo));

    if (buyTo > 325000) {
        cost = cost.times(Decimal.pow(1.001, (buyTo - 325000) * ((buyTo - 325000 + 1) / 2)));
    }
    return (cost)
}

function buyParticleBuilding(pos, originalCost, autobuyer) {
    autobuyer = autobuyer || false
    let buyTo = player[pos + 'OwnedParticles'] + 1;
    let cashToBuy = getParticleCost(originalCost, buyTo);
    while (player.reincarnationPoints.greaterThanOrEqualTo(cashToBuy)) {
        // then multiply by 4 until it reaches just above the amount needed
        buyTo = buyTo * 4;
        cashToBuy = getParticleCost(originalCost, buyTo);
    }
    let stepdown = Math.floor(buyTo / 8);
    while (stepdown !== 0) {

        // if step down would push it below out of expense range then divide step down by 2
        if (getParticleCost(originalCost, buyTo - stepdown).lessThanOrEqualTo(player.reincarnationPoints)) {
            stepdown = Math.floor(stepdown / 2);
        } else {
            buyTo = buyTo - stepdown;
        }
    }

    if (!autobuyer) {
        if (player.particlebuyamount + player[pos + 'OwnedParticles'] < buyTo) {
            buyTo = player[pos + 'OwnedParticles'] + player.particlebuyamount + 1;
        }
    }

    // go down by 7 steps below the last one able to be bought and spend the cost of 25 up to the one that you started with and stop if coin goes below requirement
    let buyFrom = Math.max(buyTo - 7, player[pos + 'OwnedParticles'] + 1);
    let thisCost = getParticleCost(originalCost, buyFrom);
    while (buyFrom < buyTo && player.reincarnationPoints.greaterThanOrEqualTo(getParticleCost(originalCost, buyFrom))) {
        player.reincarnationPoints = player.reincarnationPoints.sub(thisCost);
        player[pos + 'OwnedParticles'] = buyFrom;
        buyFrom = buyFrom + 1;
        thisCost = getParticleCost(originalCost, buyFrom);
        player[pos + 'CostParticles'] = thisCost;
    }
}


function getTesseractCost(intCost, index) {
    let buyFrom = player['ascendBuilding' + index]['owned']
    let subCost = intCost * Math.pow(buyFrom * (buyFrom + 1) / 2, 2)

    buyTo = Math.floor(-1 / 2 + 1 / 2 * Math.pow(1 + 8 * Math.pow((player.wowTesseracts + subCost) / intCost, 1 / 2), 1 / 2))
    buyTo = Math.min(buyTo, player.tesseractbuyamount + player['ascendBuilding' + index]['owned'])
    let actualCost = intCost * Math.pow(buyTo * (buyTo + 1) / 2, 2) - subCost
    return [buyTo, actualCost]
}

function buyTesseractBuilding(intCost, index) {
    let buyTo = getTesseractCost(intCost, index)[0]
    let actualCost = getTesseractCost(intCost, index)[1]

    player['ascendBuilding' + index]['owned'] = buyTo;
    player.wowTesseracts -= actualCost;
    player['ascendBuilding' + index]['cost'] = intCost * Math.pow(1 + player['ascendBuilding' + index]['owned'], 3)
}

function buyRuneBonusLevels(type, index) { //type 1 for Blessings, type 2 for Spirits
    let baseCost
    let baseLevels
    let levelCap
    (type === 2) ?
        (baseCost = 1e20, baseLevels = player.runeSpiritLevels[index], levelCap = player.runeSpiritBuyAmount) :
        (baseCost = 1e7, baseLevels = player.runeBlessingLevels[index], levelCap = player.runeBlessingBuyAmount);

    let metadata = calculateSummationLinear(baseLevels, baseCost, player.runeshards, levelCap); //metadata[0] is the level, metadata[1] is the cost
    (type === 2) ?
        player.runeSpiritLevels[index] = metadata[0] :
        player.runeBlessingLevels[index] = metadata[0];

    player.runeshards -= metadata[1];
}