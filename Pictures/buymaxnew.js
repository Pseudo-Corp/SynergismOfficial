function getCost(originalCost, buyingTo, type, num, r) {
    // It's 0 indexed by mistake so you have to subtract 1 somewhere.
    --buyingTo;

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
        cost = cost.times(Decimal.pow(buyingToDec.factorial(), 3)).dividedBy(Decimal.pow(new Decimal().factorial(fr), 3));
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
    if (player.currentChallenge === "four" && (type === "Coin" || type === "Diamonds")) {
        // you would not fucking believe how long it took me to figure this out
        // (100*costofcurrent + 10000)^n = (((100+buyingTo)!/100!)*100^buyingTo)^n
        cost = cost.times(Decimal.pow(new Decimal(buyingTo + 100).factorial().dividedBy(new Decimal(100).factorial()).times(Decimal.pow(100, buyingTo)), 1.25 + 1 / 4 * player.challengecompletions.four));
        if (buyingTo >= (1000 - (10 * player.challengecompletions.four))) {
            // and I changed this to be a summation of all the previous buys 1.25 to the sum from 1 to buyingTo
            cost = cost.times(Decimal.pow(1.25, (buyingTo * (buyingTo + 1) / 2)));
        }
    }
    fr = Math.floor(r * 1000 * player.challengecompletions.eight);
    if (player.currentChallengeRein === "eight" && (type === "Coin" || type === "Diamonds" || type === "Mythos") && buyingTo >= (1000 * player.challengecompletions.eight * r)) {

        let sumBuys = (buyingTo - (1000 * player.challengecompletions.eight * r)) * ((buyingTo - (1000 * player.challengecompletions.eight * r) + 1) / 2);
        let negBuys = (fr - (1000 * player.challengecompletions.eight * r)) * ((fr - (1000 * player.challengecompletions.eight * r) + 1) / 2);

        cost = cost.times(Decimal.pow(2, sumBuys - negBuys));

        // divided by same amount buying to - fr times
        cost = cost.dividedBy(Decimal.pow((1 + 1 / 2 * player.challengecompletions.eight), buyingTo - fr));
    }

    return cost;
}

function buyMax(pos, type, num, originalCost, autobuyer = false) {
    autobuyer = autobuyer || false;
    originalCost = new Decimal(originalCost);
    let tag = "";
    let r = 1;
    r += 1 / 400 * rune4level * effectiveLevelMult;
    r += 1 / 200 * (player.researches[56] + player.researches[57] + player.researches[58] + player.researches[59] + player.researches[60]);
    r += 1 / 200 * player.challengecompletions.four;
    r += 3 / 100 * (player.antUpgrades[7] + bonusant7);

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