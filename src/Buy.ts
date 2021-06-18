import { player, updateAllTick, updateAllMultiplier, format } from './Synergism';
import { CalcECC } from './Challenges';
import Decimal, { DecimalSource } from 'break_infinity.js';
import { achievementaward } from './Achievements';
import { smallestInc } from './Utility';
import { upgradeupdate, crystalupgradedescriptions} from './Upgrades';
import { reset } from './Reset';
import { calculateSummationLinear, calculateCorruptionPoints, calculateRuneBonuses } from './Calculate';
import { Globals as G } from './Variables';

export const getReductionValue = () => {
    let reduction = 1;
    reduction += (G['rune4level'] * G['effectiveLevelMult']) / 160;
    reduction += (player.researches[56] + player.researches[57] + player.researches[58] + player.researches[59] + player.researches[60]) / 200;
    reduction += CalcECC('transcend', player.challengecompletions[4]) / 200;
    reduction += Math.min(99999.9, (3 * (player.antUpgrades[7-1] + G['bonusant7'])) / 100);
    return reduction;
}

const getCostAccelerator = (buyingTo: number) => {
    --buyingTo;

    const originalCost = 500;
    let cost = new Decimal(originalCost);

    cost = cost.times(Decimal.pow(4 / G['costDivisor'], buyingTo));

    if (buyingTo > (125 + 5 * CalcECC('transcend', player.challengecompletions[4]))) {
        const num = buyingTo - 125 - 5 * CalcECC('transcend', player.challengecompletions[4]);
        const factorialBit = new Decimal(num).factorial();
        const multBit = Decimal.pow(4, num);
        cost = cost.times(multBit.times(factorialBit));
    }

    if (buyingTo > (2000 + 5 * CalcECC('transcend', player.challengecompletions[4]))) {
        const sumNum = buyingTo - 2000 - 5 * CalcECC('transcend', player.challengecompletions[4]);
        const sumBit = sumNum * (sumNum + 1) / 2
        cost = cost.times(Decimal.pow(2, sumBit));
    }

    if (player.currentChallenge.transcension === 4) {
        const sumBit = buyingTo * (buyingTo + 1) / 2;
        cost = cost.times(Decimal.pow(10, sumBit));
    }

    if (player.currentChallenge.reincarnation === 8) {
        const sumBit = buyingTo * (buyingTo + 1) / 2;
        cost = cost.times(Decimal.pow(1e50, sumBit));
    }
    return cost;
}

export const buyAccelerator = (autobuyer?: boolean) => {
    // Start buying at the current amount bought + 1
    let buyTo = player.acceleratorBought + 1;
    if (player.acceleratorBought >= 1e15 || player.coins.gte(Decimal.pow(10, 1e30))){
        player.acceleratorBought = 1e15;
        player.acceleratorCost = Decimal.pow(10, 1e30);
        return;
    }

    let cashToBuy = getCostAccelerator(buyTo);
    while (player.coins.gte(cashToBuy)) {
        // then multiply by 4 until it reaches just above the amount needed
        buyTo = buyTo * 4;
        cashToBuy = getCostAccelerator(buyTo);
    }
    let stepdown = Math.floor(buyTo / 8);
    while (stepdown !== 0) {

        // if step down would push it below out of expense range then divide step down by 2
        if (getCostAccelerator(buyTo - stepdown).lte(player.coins)) {
            stepdown = Math.floor(stepdown / 2);
        } else {
            buyTo = buyTo - stepdown;
        }
    }

    if (!autobuyer && (player.coinbuyamount as number | string) !== "max") {
        if (player.acceleratorBought + player.coinbuyamount < buyTo) {
            buyTo = player.acceleratorBought + player.coinbuyamount;
        }
    }

    let buyFrom = Math.max(buyTo - 7, player.acceleratorBought + 1);
    let thisCost = getCostAccelerator(buyFrom);
    while (buyFrom <= buyTo && player.coins.gte(thisCost)) {
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

const getCostMultiplier = (buyingTo: number) => {
    --buyingTo;

    const originalCost = 1e5;
    let cost = new Decimal(originalCost);
    cost = cost.times(Decimal.pow(10, buyingTo / G['costDivisor']));

    if (buyingTo > (75 + 2 * CalcECC('transcend', player.challengecompletions[4]))) {
        const num = buyingTo - 75 - 2 * CalcECC('transcend', player.challengecompletions[4]);
        const factorialBit = new Decimal(num).factorial();
        const powBit = Decimal.pow(10, num);
        cost = cost.times(factorialBit.times(powBit));
    }

    if (buyingTo > (2000 + 2 * CalcECC('transcend', player.challengecompletions[4]))) {
        const sumNum = buyingTo - 2000 - 2 * CalcECC('transcend', player.challengecompletions[4]);
        const sumBit = sumNum * (sumNum + 1) / 2;
        cost = cost.times(Decimal.pow(2, sumBit));
    }
    if (player.currentChallenge.transcension === 4) {
        const sumBit = buyingTo * (buyingTo + 1) / 2;
        cost = cost.times(Decimal.pow(10, sumBit));
    }
    if (player.currentChallenge.reincarnation === 8) {
        const sumBit = buyingTo * (buyingTo + 1) / 2;
        cost = cost.times(Decimal.pow(1e50, sumBit));
    }
    return cost;
}

export const buyMultiplier = (autobuyer?: boolean) => {
    // Start buying at the current amount bought + 1
    let buyTo = player.multiplierBought + 1;
    if (player.multiplierBought >= 1e15 || player.coins.gte(Decimal.pow(10, 1e30))){
        player.multiplierBought = 1e15;
        player.multiplierCost = Decimal.pow(10, 1e30);
        return;
    }
    let cashToBuy = getCostMultiplier(buyTo);
    while (player.coins.gte(cashToBuy)) {
        // then multiply by 4 until it reaches just above the amount needed
        buyTo = buyTo * 4;
        cashToBuy = getCostMultiplier(buyTo);
    }
    let stepdown = Math.floor(buyTo / 8);
    while (stepdown !== 0) {

        // if step down would push it below out of expense range then divide step down by 2
        if (getCostMultiplier(buyTo - stepdown).lte(player.coins)) {
            stepdown = Math.floor(stepdown / 2);
        } else {
            buyTo = buyTo - stepdown;
        }
    }

    if (!autobuyer && (player.coinbuyamount as number | string) !== "max") {
        if (player.multiplierBought + player.coinbuyamount < buyTo) {
            buyTo = player.multiplierBought + player.coinbuyamount;
        }
    }

    let buyFrom = Math.max(buyTo - 7, player.multiplierBought + 1);
    let thisCost = getCostMultiplier(buyFrom);
    while (buyFrom <= buyTo && player.coins.gte(thisCost)) {
        player.coins = player.coins.sub(thisCost);
        player.multiplierBought = buyFrom;
        if (buyFrom >= 1e15){
            player.multiplierBought = 1e15;
            return;
        }
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

/*
// Uses same as Decimal prototype but does so without creating new objects
Decimal.prototype.factorial = function () {
  // Using Stirling's Approximation.
  // https://en.wikipedia.org/wiki/Stirling%27s_approximation#Versions_suitable_for_calculators
  var n = this.toNumber() + 1;
  return Decimal.pow(n / Math.E * Math.sqrt(n * Math.sinh(1 / n) + 1 / (810 * Math.pow(n, 6))), n).mul(Math.sqrt(2 * Math.PI / n));
};
*/

const mantissaFactorialPartExtra = Math.log10(2 * Math.PI);
const exponentFactorialPartExtra = Math.log10(Math.E);

const factorialByExponent = (fact: number) => {
    if (++fact === 0) {
        return 0;
    }
    return ((Math.log10(fact * Math.sqrt(fact * Math.sinh(1 / fact) + 1 / (810 * Math.pow(fact, 6)))) - exponentFactorialPartExtra) * fact) + ((mantissaFactorialPartExtra - Math.log10(fact)) / 2);
}

const fact100exponent = Math.log10(9.3326215443944152681699238856267e+157);

// system of equations
// 16 digits of precision
// log10(1.25)xn = log10(x)+16
// see: https://www.wolframalpha.com/input/?i=log10%28x%29%2B16+%3D+log10%281.25%29x
// xn ~= 188.582
// x ~= 188.582/n
const precision16_loss_addition_of_ones = 188.582;
const known_log10s = function () {
    // needed logs
    const needed = [1.03, 1.25];
    const nums = [1, 2, 3, 4, 5, 6, 10, 15];
    for (const num of nums) {
        needed.push(100 + (100 * num));
        needed.push(10 + (10 * num));
    }

    // Gets all possible challenge 8 completion amounts
    const chalcompletions = 1000;
    for (let i = 0; i < chalcompletions; ++i) {
        needed.push(1 + (i / 2));
    }

    // constructing all logs
    const obj: Record<number, number> = {};
    for (const need of needed) {
        if (obj[need] === undefined) {
            obj[need] = Math.log10(need);
        }
    }
    return obj;
}();

export const getCost = (originalCost: DecimalSource, buyingTo: number, type: string, num: number, r: number) => {
    // It's 0 indexed by mistake so you have to subtract 1 somewhere.
    --buyingTo;
    // Accounts for the multiplies by 1.25^num buyingTo times
    const cost = new Decimal(originalCost);
    let mlog10125 = num * buyingTo;
    // Accounts for the add 1s
    if (buyingTo < precision16_loss_addition_of_ones / num) {
        cost.mantissa += buyingTo / Math.pow(10, cost.exponent);
    }
    let fastFactMultBuyTo = 0;
    // floored r value gets used a lot in removing calculations
    let fr = Math.floor(r * 1000);
    if (buyingTo >= r * 1000) {
        // This code is such a mess at this point, just know that this is equivalent to what it was before
        ++fastFactMultBuyTo;
        cost.exponent -= factorialByExponent(fr);
        cost.exponent += (-3 + Math.log10(1 + (num / 2))) * (buyingTo - fr);
    }

    fr = Math.floor(r * 5000);
    if (buyingTo >= r * 5000) {
        // This code is such a mess at this point, just know that this is equivalent to what it was before
        ++fastFactMultBuyTo;
        cost.exponent -= factorialByExponent(fr);
        cost.exponent += ((known_log10s[10 + num * 10] + 1) * (buyingTo - fr - 1)) + 1;
    }

    fr = Math.floor(r * 20000);
    if (buyingTo >= r * 20000) {
        // This code is such a mess at this point, just know that this is equivalent to what it was before
        fastFactMultBuyTo += 3;
        cost.exponent -= factorialByExponent(fr) * 3;
        cost.exponent += (known_log10s[100 + (100 * num)] + 5) * (buyingTo - fr);
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
        cost.exponent += Math.log10(1.03) * (buyingTo - fr) * ((buyingTo - fr + 1) / 2);
    }
    // Applies the factorials from earlier without computing them 5 times
    cost.exponent += factorialByExponent(buyingTo) * fastFactMultBuyTo;
    let fastFactMultBuyTo100 = 0;
    if ((player.currentChallenge.transcension === 4) && (type === "Coin" || type === "Diamonds")) {
        // you would not fucking believe how long it took me to figure this out
        // (100*costofcurrent + 10000)^n = (((100+buyingTo)!/100!)*100^buyingTo)^n
        ++fastFactMultBuyTo100;
        if (buyingTo >= (1000 - (10 * player.challengecompletions[4]))) {
            // and I changed this to be a summation of all the previous buys 1.25 to the sum from 1 to buyingTo
            mlog10125 += (buyingTo * (buyingTo + 1) / 2);
        }
    }
    if ((player.currentChallenge.reincarnation === 10) && (type === "Coin" || type === "Diamonds")) {
        // you would not fucking believe how long it took me to figure this out
        // (100*costofcurrent + 10000)^n = (((100+buyingTo)!/100!)*100^buyingTo)^n
        ++fastFactMultBuyTo100;
        if (buyingTo >= (r * 25000)) {
            // and I changed this to be a summation of all the previous buys 1.25 to the sum from 1 to buyingTo
            mlog10125 += (buyingTo * (buyingTo + 1) / 2);
        }
    }
    // Applies the factorial w/ formula from earlier n times to avoid multiple computations
    cost.exponent += fastFactMultBuyTo100 * ((factorialByExponent(buyingTo + 100) - fact100exponent + (2 * buyingTo)) * (1.25 + (player.challengecompletions[4] / 4)));
    // Applies all the Math.log10(1.25)s from earlier n times to avoid multiple computations
    // log10(1.25)
    cost.exponent += known_log10s[1.25] * mlog10125;
    fr = Math.floor(r * 1000 * player.challengecompletions[8]);
    if (player.currentChallenge.reincarnation === 8 && (type === "Coin" || type === "Diamonds" || type === "Mythos") && buyingTo >= (1000 * player.challengecompletions[8] * r)) {
        cost.exponent += ((known_log10s[2] * ((buyingTo - fr + 1) / 2)) - known_log10s[1 + (player.challengecompletions[8] / 2)]) * (buyingTo - fr);
    }

    const extra = cost.exponent - Math.floor(cost.exponent);
    cost.exponent = Math.floor(cost.exponent);
    cost.mantissa *= Math.pow(10, extra);
    cost.normalize();
    return cost;
}

export const buyMax = (pos: string, type: string, num: number, originalCost: DecimalSource) => {
    const BUYMAX = (Math.pow(10, 99) - 1);
    const COINMAX = 1e99;
    const r = getReductionValue();

    let tag = '';
    switch (type) {
        case 'Diamonds': tag = 'prestigePoints'; break;
        case 'Mythos': tag = 'transcendPoints'; break;
        case 'Particles': tag = 'reincarnationPoints'; break;
        case 'Coin': tag = 'coins'; break;
    }

    // Start buying at the current amount bought + 1
    const buyStart = player[pos + 'Owned' + type];
    // Degenerate Case: return the maximum if applicable
    if (buyStart >= BUYMAX) {
        player[pos + 'Owned' + type] = BUYMAX;
        return;
    }
    // Degenerate Case: return maximum if coins is too large
    if (player[tag].gte(Decimal.pow(10, COINMAX))) {
        player[pos + 'Owned' + type] = BUYMAX;
        return;
    }

    let buyInc = 1;
    let cashToBuy = getCost(originalCost, buyStart + buyInc, type, num, r);
    while (player[tag].gte(cashToBuy)) {
        // then multiply by 4 until it reaches just above the amount needed
        buyInc = buyInc * 4;
        cashToBuy = getCost(originalCost, buyStart + buyInc, type, num, r);
    }
    let stepdown = Math.floor(buyInc / 8);
    while (stepdown !== 0) {
        // if step down would push it below out of expense range then divide step down by 2
        if (getCost(originalCost, buyStart + buyInc - stepdown, type, num, r).lte(player[tag])) {
            stepdown = Math.floor(stepdown / 2);
        } else {
            buyInc = buyInc - Math.max(smallestInc(buyInc), stepdown);
        }
    }
    // go down by 7 steps below the last one able to be bought and spend the cost of 25 up to the one that you started with and stop if coin goes below requirement
    let buyFrom = Math.max(buyStart + buyInc - 7, player[pos + 'Owned' + type] + 1);
    let thisCost = getCost(originalCost, buyFrom, type, num, r);
    while (buyFrom < buyStart + buyInc && player[tag].gte(thisCost)) {
        player[tag] = player[tag].sub(thisCost);
        player[pos + 'Owned' + type] = buyFrom;
        buyFrom = buyFrom + smallestInc(buyFrom);
        thisCost = getCost(originalCost, buyFrom, type, num, r);
        player[pos + 'Cost' + type] = thisCost;
    }
}

const buyProducerTypes = {
    Diamonds: ['prestigePoints', 'crystal'],
    Mythos: ['transcendPoints', 'mythos'],
    Particles: ['reincarnationPoints', 'particle'],
    Coin: ['coins', 'coin']
} as const;

export const buyProducer = (pos: string, type: keyof typeof buyProducerTypes, num: number, autobuyer?: boolean) => {
    const [tag, amounttype] = buyProducerTypes[type];
    const buythisamount = autobuyer ? 500 : player[`${amounttype}buyamount`];
    let r = 1;
    r += (G['rune4level'] * G['effectiveLevelMult']) / 160;
    r += (player.researches[56] + player.researches[57] + player.researches[58] + player.researches[59] + player.researches[60]) / 200;
    r += CalcECC('transcend', player.challengecompletions[4]) / 200
    r += (3 * (G['bonusant7'] + player.antUpgrades[7-1])) / 100;
    
    while (player[tag].gte(player[pos + 'Cost' + type]) && G['ticker'] < buythisamount) {
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
            player[pos + 'Cost' + type] = player[pos + 'Cost' + type].times(Decimal.pow(2, (player[pos + 'Owned' + type] - (1000 * player.challengecompletions[8] * r)) / (1 + (player.challengecompletions[8] / 2))));
        }
        G['ticker'] += 1;
    }
    G['ticker'] = 0;
}

type Upgrade = 'prestige' | 'transcend' | 'reincarnation' | 'coin';

export const buyUpgrades = (type: Upgrade, pos: number, state?: boolean) => {
    let addendum = ""
    if (type === "prestige" || type === "transcend" || type === "reincarnation") {
        addendum = "Point"
    }
    if (player[type + addendum + 's'].gte(Decimal.pow(10, G['upgradeCosts'][pos])) && player.upgrades[pos] === 0) {
        player[type + addendum + 's'] = player[type + addendum + 's'].sub(Decimal.pow(10, G['upgradeCosts'][pos]))
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

export const calculateCrystalBuy = (i: number) => {
    const u = i - 1;
    const exponent = Decimal.log(player.prestigeShards.add(1), 10);

    const toBuy = Math.floor(Math.pow(Math.max(0, 2 * (exponent - G['crystalUpgradesCost'][u]) / G['crystalUpgradeCostIncrement'][u] + 1 / 4), 1 / 2) + 1 / 2)
    return toBuy;
}

export const buyCrystalUpgrades = (i: number, auto = false) => {
    const u = i - 1;

    let c = 0;
    c += Math.floor(G['rune3level'] / 16 * G['effectiveLevelMult']) * 100 / 100
    if (player.upgrades[73] > 0.5 && player.currentChallenge.reincarnation !== 0) {
        c += 10
    }

    const toBuy = calculateCrystalBuy(i);

    if (toBuy + c > player.crystalUpgrades[u]) {
        player.crystalUpgrades[u] = 100 / 100 * (toBuy + c)
        if (toBuy > 0) {
            player.prestigeShards = player.prestigeShards.sub(Decimal.pow(10, G['crystalUpgradesCost'][u] + G['crystalUpgradeCostIncrement'][u] * (1 / 2 * Math.pow(toBuy - 1 / 2, 2) - 1 / 8)))
            if (!auto) {
                crystalupgradedescriptions(i)
            }
        }
    }
}

export const boostAccelerator = (automated?: boolean) => {
    let buyamount = 1;
    if (player.upgrades[46] === 1) {
        buyamount = automated ? 9999 : player.coinbuyamount;
    }

    if (player.upgrades[46] < 1) {
        while (player.prestigePoints.gte(player.acceleratorBoostCost) && G['ticker'] < buyamount) {
            if (player.prestigePoints.gte(player.acceleratorBoostCost)) {
                player.acceleratorBoostBought += 1;
                player.acceleratorBoostCost = player.acceleratorBoostCost.times(1e10).times(Decimal.pow(10, player.acceleratorBoostBought));
                if (player.acceleratorBoostBought > (1000 * (1 + 2 * G['effectiveRuneBlessingPower'][4]))) {
                    player.acceleratorBoostCost = player.acceleratorBoostCost.times(Decimal.pow(10, Math.pow(player.acceleratorBoostBought - (1000 * (1 + 2 * G['effectiveRuneBlessingPower'][4])), 2) / (1 + 2 * G['effectiveRuneBlessingPower'][4])))
                }
                player.transcendnoaccelerator = false;
                player.reincarnatenoaccelerator = false;
                if (player.upgrades[46] < 0.5) {
                    for (let j = 21; j < 41; j++) {
                        player.upgrades[j] = 0;
                    }
                    reset("prestige");
                    player.prestigePoints = new Decimal(0);
                }
            }
        }
    } else {
        const buyStart = player.acceleratorBoostBought;
        let buyInc = 1;
        let cost = getAcceleratorBoostCost(buyStart + buyInc);
        while (player.prestigePoints.gte(cost)) {
            buyInc *= 4;
            cost = getAcceleratorBoostCost(buyStart + buyInc);
        }
        let stepdown = Math.floor(buyInc / 8)
        while (stepdown !== 0) {
            // if step down would push it below out of expense range then divide step down by 2
            if (getAcceleratorBoostCost(buyStart + buyInc - stepdown).lte(player.prestigePoints)) {
                stepdown = Math.floor(stepdown / 2);
            } else {
                buyInc = buyInc - Math.max(smallestInc(buyInc),stepdown);
            }
        }
        // go down by 7 steps below the last one able to be bought and spend the cost of 25 up to the one that you started with and stop if coin goes below requirement
        let buyFrom = Math.max(buyStart + buyInc - 7, player.acceleratorBoostBought + 1);
        let thisCost = getAcceleratorBoostCost(player.acceleratorBoostBought);
        while (buyFrom < buyStart + buyInc && player.prestigePoints.gte(getAcceleratorBoostCost(buyFrom))) {
            player.prestigePoints = player.prestigePoints.sub(thisCost);
            player.acceleratorBoostBought = buyFrom;
            buyFrom = buyFrom + smallestInc(buyInc);
            thisCost = getAcceleratorBoostCost(buyFrom);
            player.acceleratorBoostCost = thisCost;

            player.transcendnoaccelerator = false;
            player.reincarnatenoaccelerator = false;
        }
    }

    G['ticker'] = 0;
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

const getAcceleratorBoostCost = (level = 1) => {
    // formula starts at 0 but buying starts at 1
    level--;
    const base = new Decimal(1e3)
    const eff = 1 + 2 * G['effectiveRuneBlessingPower'][4]
    const linSum = (n: number) => n * (n + 1) / 2
    const sqrSum = (n: number) => n * (n + 1) * (2 * n + 1) / 6
    if (level > 1000 * eff) {
        return base.times(Decimal.pow(10, 10 * level
            + linSum(level) // each level increases the exponent by 1 more each time
            + sqrSum(level - 1000 * eff) / eff)) // after cost delay is passed each level increases the cost by the square each time
    } else {
        return base.times(Decimal.pow(10, 10 * level + linSum(level)))
    }
}

const getParticleCost = (originalCost: DecimalSource, buyTo: number) => {
    --buyTo;
    originalCost = new Decimal(originalCost)
    let cost = originalCost.times(Decimal.pow(2, buyTo));

    const DR = (player.currentChallenge.ascension !== 15)? 325000: 1000;

    if (buyTo > DR) {
        cost = cost.times(Decimal.pow(1.001, (buyTo - DR) * ((buyTo - DR + 1) / 2)));
    }
    return (cost)
}

export const buyParticleBuilding = (
    pos: 'first' | 'second' | 'third' | 'fourth' | 'fifth', 
    originalCost: DecimalSource, 
    autobuyer = false
) => {
    const key = `${pos}OwnedParticles` as const;
    let buyTo = player[key] + 1;
    let cashToBuy = getParticleCost(originalCost, buyTo);
    while (player.reincarnationPoints.gte(cashToBuy)) {
        // then multiply by 4 until it reaches just above the amount needed
        buyTo = buyTo * 4;
        cashToBuy = getParticleCost(originalCost, buyTo);
    }
    let stepdown = Math.floor(buyTo / 8);
    while (stepdown !== 0) {

        // if step down would push it below out of expense range then divide step down by 2
        if (getParticleCost(originalCost, buyTo - stepdown).lte(player.reincarnationPoints)) {
            stepdown = Math.floor(stepdown / 2);
        } else {
            buyTo = buyTo - stepdown;
        }
    }

    if (!autobuyer) {
        if (player.particlebuyamount + player[key] < buyTo) {
            buyTo = player[key] + player.particlebuyamount + 1;
        }
    }

    // go down by 7 steps below the last one able to be bought and spend the cost of 25 up to the one that you started with and stop if coin goes below requirement
    let buyFrom = Math.max(buyTo - 7, player[key] + 1);
    let thisCost = getParticleCost(originalCost, buyFrom);
    while (buyFrom < buyTo && player.reincarnationPoints.gte(getParticleCost(originalCost, buyFrom))) {
        player.reincarnationPoints = player.reincarnationPoints.sub(thisCost);
        player[key] = buyFrom;
        buyFrom = buyFrom + 1;
        thisCost = getParticleCost(originalCost, buyFrom);
        player[`${pos}CostParticles` as const] = thisCost;
    }
}

export const getTesseractCost = (intCost: number, index: number, accelerate = false): [number, number] => {
    const buyFrom = player['ascendBuilding' + index]['owned']
    const subCost = intCost * Math.pow(buyFrom * (buyFrom + 1) / 2, 2)

    const buyTo = Math.floor(-1 / 2 + 1 / 2 * Math.pow(1 + 8 * Math.pow((Number(player.wowTesseracts) + subCost) / intCost, 1 / 2), 1 / 2))
    let actualBuy = Math.min(buyTo, player.tesseractbuyamount + player['ascendBuilding' + index]['owned'])
    if (accelerate) {
        actualBuy += 0.05 * (buyTo - actualBuy)
        actualBuy = Math.floor(actualBuy)
    }
    const actualCost = intCost * Math.pow(actualBuy * (actualBuy + 1) / 2, 2) - subCost
    return [actualBuy, actualCost];
}

export const buyTesseractBuilding = (intCost: number, index: number, accelerate = false) => {
    // Destructuring FTW!
    const [buyTo, actualCost] = getTesseractCost(intCost, index, accelerate)

    player['ascendBuilding' + index]['owned'] = buyTo;
    player.wowTesseracts.sub(actualCost);
    player['ascendBuilding' + index]['cost'] = intCost * Math.pow(1 + player['ascendBuilding' + index]['owned'], 3)
}

export const buyRuneBonusLevels = (type: 'Blessings' | 'Spirits', index: number) => {
    let baseCost
    let baseLevels
    let levelCap
    (type === 'Spirits') ?
        (baseCost = G['spiritBaseCost'], baseLevels = player.runeSpiritLevels[index], levelCap = player.runeSpiritBuyAmount) :
        (baseCost = G['blessingBaseCost'], baseLevels = player.runeBlessingLevels[index], levelCap = player.runeBlessingBuyAmount);

    const [level, cost] = calculateSummationLinear(baseLevels, baseCost, player.runeshards, levelCap);
    (type === 'Spirits') ?
        player.runeSpiritLevels[index] = level :
        player.runeBlessingLevels[index] = level;

    player.runeshards -= cost;

    if (index === 1) {
        const requirementArray = [0, 1e5, 1e8, 1e11]
        for (let i = 1; i <= 3; i++) {
            if (player.runeBlessingLevels[1] >= requirementArray[i] && player.achievements[231 + i] < 1) {
                achievementaward(231 + i)
            }
            if (player.runeSpiritLevels[1] >= 10 * requirementArray[i] && player.achievements[234 + i] < 1) {
                achievementaward(234 + i)
            }
        }
        if (player.runeBlessingLevels[1] >= 1e22 && player.achievements[245] < 1) {
            achievementaward(245)
        }
    }

    calculateRuneBonuses()

    if (type === 'Blessings') {
        const blessingMultiplierArray = [0, 8, 10, 6.66, 2, 1]
        const t = (index === 5) ? 1 : 0;
        document.getElementById('runeBlessingPower' + index + 'Value1').textContent = format(G['runeBlessings'][index])
        document.getElementById('runeBlessingPower' + index + 'Value2').textContent = format(1 - t + blessingMultiplierArray[index] * G['effectiveRuneBlessingPower'][index], 4, true)
    }
    if (type === 'Spirits') {
        const spiritMultiplierArray = [0, 1, 1, 20, 1, 100]
        spiritMultiplierArray[index] *= (calculateCorruptionPoints() / 400)
        const t = (index === 3) ? 1 : 0;
        document.getElementById('runeSpiritPower' + index + 'Value1').textContent = format(G['runeSpirits'][index])
        document.getElementById('runeSpiritPower' + index + 'Value2').textContent = format(1 - t + spiritMultiplierArray[index] * G['effectiveRuneSpiritPower'][index], 4, true)
    }
}
