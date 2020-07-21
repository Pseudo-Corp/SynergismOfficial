// Returns the sum of all contents in an array
function sumContents(array) {
	let sum = 0;
	for (let i = 0; i < array.length; ++i)
	{
		sum += array[i];
	}
	return sum;
}

// Returns the product of all contents in an array
function productContents(array) {
	let product = 1;
	for (let i = 0; i < array.length; ++i)
	{
		product *= array[i];
	}
	return product;
}

function calculateTotalCoinOwned() {
	totalCoinOwned = player.firstOwnedCoin + player.secondOwnedCoin + player.thirdOwnedCoin + player.fourthOwnedCoin + player.fifthOwnedCoin;
}

function calculateTotalAcceleratorBoost() {
	let b = 0
	if (player.upgrades[26] > 0.5) {b += 1;}
	if (player.upgrades[31] > 0.5) {b += Math.floor(totalCoinOwned/2000) * 100/100}
	if (player.achievements[7] > 0.5){b += Math.floor(player.firstOwnedCoin/2000)}
	if (player.achievements[14] > 0.5){b += Math.floor(player.secondOwnedCoin/2000)}
	if (player.achievements[21] > 0.5){b += Math.floor(player.thirdOwnedCoin/2000)}
	if (player.achievements[28] > 0.5){b += Math.floor(player.fourthOwnedCoin/2000)}
	if (player.achievements[35] > 0.5){b += Math.floor(player.fifthOwnedCoin/2000)}

	b += player.researches[93] * Math.floor(1/20 * (rune1level + rune2level + rune3level + rune4level + rune5level))
	b += Math.floor((0.01 + rune1level) * effectiveLevelMult / 10);
	b *= (1 + 1/5 * player.researches[3])
	b *= (1 + 1/20 * player.researches[16] + 1/20 * player.researches[17])
	b *= (1 + 1/20 * player.researches[88])
	b *= (1 + 1/50 * (player.antUpgrades[4] + bonusant4))
	if (player.upgrades[73] > 0.5 && player.currentChallengeRein !== "") {b *= 2}
	b = Math.floor(b)
	freeAcceleratorBoost = b;

	totalAcceleratorBoost = Math.floor(player.acceleratorBoostBought + freeAcceleratorBoost) * 100/100;
}


function calculateAcceleratorMultiplier(){
    acceleratorMultiplier = 1;
    acceleratorMultiplier *=(1 + player.achievements[60]/100)
	acceleratorMultiplier *=(1 + player.achievements[61]/100)
	acceleratorMultiplier *=(1 + player.achievements[62]/100)
	acceleratorMultiplier *=(1 + 1/5 * player.researches[1])
	acceleratorMultiplier *=(1 + 1/20 * player.researches[6] + 1/25 * player.researches[7] + 1/40 * player.researches[8] + 3/200 * player.researches[9] + 1/200 * player.researches[10]);
	acceleratorMultiplier *=(1 + 1/20 * player.researches[86])
	acceleratorMultiplier *= Math.pow(1.01, player.upgrades[21] + player.upgrades[22] + player.upgrades[23] + player.upgrades[24] + player.upgrades[25])
	if ((player.currentChallenge !== "" || player.currentChallengeRein !== "") && player.upgrades[50] > 0.5) {acceleratorMultiplier *= 1.25}
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
        0.25 * Math.min(1, rune4level / 200),
        0.005 * player.cubeUpgrades[2]
	]);

	return 1/(1 - recycleFactors);
}

// Returns the amount of exp given per offering by a rune
function calculateRuneExpGiven(runeIndex) {
	// recycleMult accounted for all recycle chance, but inversed so it's a multiplier instead
	let recycleMultiplier = calculateRecycleMultiplier();

	// Rune multiplier that is summed instead of added
	let allRuneExpAdditiveMultiplier = Math.floor(sumContents([
		// Base amount multiplied per offering
		25,
		// Research 5x2
		3 * player.researches[22],
		// Research 5x3
		2 * player.researches[23],
		// Particle Upgrade 1x1
		5 * player.upgrades[61],
		// Particle upgrade 3x1
		player.upgrades[71] * player.runelevels[runeIndex]
	]));

	// Rune multiplier that gets applied to all runes
	let allRuneExpMultiplier = productContents([
		// Research 4x16
		1 + (player.researches[91] / 20),
		// Research 4x17
		1 + (player.researches[92] / 20),
		// Ant 8
        Math.pow(1.01, player.antUpgrades[8] + bonusant8),
        // Cube Bonus
        cubeBonusMultiplier[4],
        // Cube Upgrade Bonus
        (1 + player.ascensionCounter/1000 * player.cubeUpgrades[32]),
        // Corruption Divisor
        1 / droughtMultiplier[player.usedCorruptions[11]]
	]);

	// Rune multiplier that gets applied to specific runes
	let runeExpMultiplier = [
		productContents([
			1 + (player.researches[78] / 50), 1 + (player.researches[111]/100)
		]),
		productContents([
			1 + (player.researches[80] / 50), 1 + (player.researches[112]/100)
		]),
		productContents([
			1 + (player.researches[79] / 50), 1 + (player.researches[113]/100)
		]),
		productContents([
			1 + (player.researches[77] / 50), 1 + (player.researches[114]/100)
		]),
		productContents([
			1 + (player.researches[83] / 20), 1 + (player.researches[115]/100)
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
		1 - (0.02 * player.challengecompletions.seven),
		1 - (0.02 * player.challengecompletions.seven),
		1,
		1 - (0.02 * player.challengecompletions.six),
		1
	];

	// Rune exp required to level multipliers
	let allRuneExpRequiredMultiplier = productContents([
			Math.pow(runelevel, 3),
			((4 * runelevel) + 100) / 500,
			Math.max(1, (runelevel - 500)/25),
			Math.max(1, (runelevel - 600)/30),
			Math.max(1, (runelevel - 700)/25),
			Math.max(1, Math.pow(1.03, runelevel - 750))
	]);
	let expToLevel = productContents([
		runeexpbase[runeIndex],
		allRuneExpRequiredMultiplier,
		runeExpRequiredMultiplier[runeIndex]
	]);

	return expToLevel;

}

function calculateMaxRunes(i){
    let max = 500;

    let increaseMaxLevel = [
        null,
        5 *(player.researches[78] + player.researches[111] + 2 * player.cubeUpgrades[16] + 2 * player.cubeUpgrades[37]),
		5 *(player.researches[80] + player.researches[112] + 2 * player.cubeUpgrades[16] + 2 * player.cubeUpgrades[37]),
		5 *(player.researches[79] + player.researches[113] + 2 * player.cubeUpgrades[16] + 2 * player.cubeUpgrades[37]),
		5 *(player.researches[77] + player.researches[114] + 2 * player.cubeUpgrades[16] + 2 * player.cubeUpgrades[37]),
		5 *(player.researches[115] + 2 * player.cubeUpgrades[16] + 2 * player.cubeUpgrades[37])
    ]

    max += increaseMaxLevel[i]
    return(max)
}

function calculateOfferings(i){
    let q = 0;
    var a = 0;
    var b = 0;
    var c = 0;

    if (i == 4 || i == 6) {
        a += 15
        if (player.achievements[52] > 0.5) {
            a += (25 * Math.min(player.reincarnationcounter/1800, 1))
        }
        if (player.upgrades[62] > 0.5) {
            a += 1 / 5 * (player.challengecompletions.one + player.challengecompletions.two + player.challengecompletions.three + player.challengecompletions.four + player.challengecompletions.five + player.challengecompletions.six + player.challengecompletions.seven + player.challengecompletions.eight)
        }
        a += 3 * player.researches[25]
        if (player.researches[95] == 1){
            a += 40
        }
        a *= Math.pow(player.reincarnationcounter / 600 * Math.pow(Math.min(optimalOfferingTimer/400, player.reincarnationcounter / 400), 1), 0.7)

    }
    if (i >= 2 && i !== 5) {
        b += 3
        if (player.reincarnationCount > 0) {
            b += 7
        }
        if (player.achievements[44] > 0.5) {
            b += (15 * Math.min(player.transcendcounter/1800, 1))
        }
        b += 1 * player.researches[24]
        b *= Math.pow(player.transcendcounter / 540 * Math.pow(Math.min(optimalOfferingTimer/480, player.transcendcounter / 480), 1), 0.6)

    }
    if (i >= 1) {
        c += 1
        if (player.transcendCount > 0 || player.reincarnationCount > 0) {
            c += 2
        }
        if (player.reincarnationCount > 0) {
            c += 2
        }
        if (player.achievements[37] > 0.5) {
            c += (15 * Math.min(player.prestigecounter/1800, 1))
        }
        c += 1 * player.researches[24]
        c *= Math.pow(player.prestigecounter / 480 * Math.pow(Math.min(optimalOfferingTimer/600, player.prestigecounter / 600), 1), 0.5)
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
    if (player.upgrades[38] == 1){q *= 1.2}
    if (player.upgrades[75] > 0.5) {
        q *= (1 + 2 * Math.min(1, Math.pow(player.maxobtainium / 30000000, 0.5)))
    }
    q *= (1 + 1/50 * player.shopUpgrades.offeringAutoLevel);
    q *= (1 + 1/100 * player.shopUpgrades.cashGrabLevel);
    q *= (1 + 4 * (1 - Math.pow(2, -(player.antUpgrades[6] + bonusant6)/125)))
    q *= cubeBonusMultiplier[3]
    q = Math.floor(q) * 100 / 100

    let persecond = 0;
    if(i === 1){
        persecond = q/(1 + player.prestigecounter)
    }
    if(i === 2){
        persecond = q/(1 + player.transcendcounter)
    }
    if(i === 4){
        persecond = q/(1 + player.reincarnationcounter)
    }
    if(persecond > player.offeringpersecond){player.offeringpersecond = persecond}
    return(q);

}

function calculateObtainium(){
    obtainiumGain = 1;
        if (player.upgrades[69] > 0) {
            obtainiumGain *= Math.min(10, Decimal.pow(Decimal.log(reincarnationPointGain.add(10), 10), 0.5))
        }
        if (player.upgrades[70] > 0) {
            obtainiumGain *= Math.pow(Math.min(19 + 0.6 * player.shopUpgrades.obtainiumTimerLevel, 1 + 2 * player.reincarnationcounter / 400),2)
        }
        if (player.upgrades[72] > 0) {
            obtainiumGain *= Math.min(50, (1 + 2 * player.challengecompletions.six + 2 * player.challengecompletions.seven + 2 * player.challengecompletions.eight + 2 * player.challengecompletions.nine + 2 * player.challengecompletions.ten))
        }
        if (player.upgrades[74] > 0) {
            obtainiumGain *= (1 + 4 * Math.min(1, Math.pow(player.maxofferings / 100000, 0.5)))
        }
        obtainiumGain *= (1 + player.researches[65]/5)
        obtainiumGain *= (1 + player.researches[76]/10)
        obtainiumGain *= (1 + player.researches[81]/10)
        obtainiumGain *= (1 + player.shopUpgrades.obtainiumAutoLevel/50)
        obtainiumGain *= (1 + player.shopUpgrades.cashGrabLevel/100)
        obtainiumGain *= (1 + rune5level/150 * effectiveLevelMult * (1 + player.researches[84]/200)) * Math.pow(2, rune5level/300 * effectiveLevelMult * (1 + player.researches[84]/200))
        obtainiumGain *= (1 + 0.01 * player.achievements[84] + 0.03 * player.achievements[91] + 0.05 * player.achievements[98] + 0.07 * player.achievements[105] + 0.09 * player.achievements[112] + 0.11 * player.achievements[119] + 0.13 * player.achievements[126] + 0.15 * player.achievements[133] + 0.17 * player.achievements[140] + 0.19 * player.achievements[147])
        obtainiumGain *= (1 + 9 * (1 - Math.pow(2, -(player.antUpgrades[10] + bonusant10)/125)))
        obtainiumGain *= cubeBonusMultiplier[5]
        obtainiumGain *= (1 + player.cubeUpgrades[47])
        if (player.achievements[53] > 0){
            obtainiumGain *= (1 + 1/2000 * (runeSum))
        }
        if (player.achievements[128]){obtainiumGain *= 1.5};
        if (player.achievements[129]){obtainiumGain *= 1.25};

        if (player.achievements[51] > 0){obtainiumGain += 4}
        if (player.reincarnationcounter >= 30){obtainiumGain += 1 * player.researches[63]}
        if (player.reincarnationcounter >= 60){obtainiumGain += 2 * player.researches[64]}
        obtainiumGain *= Math.min(1 + 3 * player.upgrades[70], Math.pow(player.reincarnationcounter/30, 2));

        obtainiumGain = Math.pow(obtainiumGain, illiteracyPower[player.usedCorruptions[5]])

        player.obtainiumpersecond = obtainiumGain/(Math.min(player.reincarnationcounter, 3600 + 120 * player.shopUpgrades.obtainiumTimerLevel) + 1)
        player.maxobtainiumpersecond = Math.max(player.maxobtainiumpersecond, player.obtainiumpersecond);
}

function calculateAutomaticObtainium() {
    let timeMult = calculateTimeAcceleration();
    return 0.05 * (player.researches[61] + player.researches[62]) * player.maxobtainiumpersecond * timeMult * (1 + 4 * player.cubeUpgrades[3] / 5);
}

function calculateTalismanEffects(){
    let positiveBonus = 0;
    let negativeBonus = 0;
    if(player.achievements[135] == 1){positiveBonus += 0.05}
    if(player.achievements[136] == 1){positiveBonus += 0.05}
    positiveBonus += player.researches[106]/100
    positiveBonus += player.researches[107]/100
    positiveBonus += player.researches[116]/200
    positiveBonus += player.researches[117]/200
    positiveBonus += (cubeBonusMultiplier[9] - 1)
    negativeBonus += player.researches[118]/50
    for(var i=1; i <= 5; i++){
        if(player.talismanOne[i] == (1)){talisman1Effect[i] = (talismanPositiveModifier[player.talismanRarity[1]] + positiveBonus) * player.talismanLevels[1]}
        else{talisman1Effect[i] = (talismanNegativeModifier[player.talismanRarity[1]] - negativeBonus) * player.talismanLevels[1] * (-1)}

        if(player.talismanTwo[i] == (1)){talisman2Effect[i] = (talismanPositiveModifier[player.talismanRarity[2]] + positiveBonus) * player.talismanLevels[2]}
        else{talisman2Effect[i] = (talismanNegativeModifier[player.talismanRarity[2]] - negativeBonus) * player.talismanLevels[2] * (-1)}

        if(player.talismanThree[i] == (1)){talisman3Effect[i] = (talismanPositiveModifier[player.talismanRarity[3]] + positiveBonus) * player.talismanLevels[3]}
        else{talisman3Effect[i] = (talismanNegativeModifier[player.talismanRarity[3]] - negativeBonus) * player.talismanLevels[3] * (-1)}

        if(player.talismanFour[i] == (1)){talisman4Effect[i] = (talismanPositiveModifier[player.talismanRarity[4]] + positiveBonus) * player.talismanLevels[4]}
        else{talisman4Effect[i] = (talismanNegativeModifier[player.talismanRarity[4]] - negativeBonus) * player.talismanLevels[4] * (-1)}

        if(player.talismanFive[i] == (1)){talisman5Effect[i] = (talismanPositiveModifier[player.talismanRarity[5]] + positiveBonus) * player.talismanLevels[5]}
        else{talisman5Effect[i] = (talismanNegativeModifier[player.talismanRarity[5]] - negativeBonus) * player.talismanLevels[5] * (-1)}

        if(player.talismanSix[i] == (1)){talisman6Effect[i] = (talismanPositiveModifier[player.talismanRarity[6]] + positiveBonus) * player.talismanLevels[6]}
        else{talisman6Effect[i] = (talismanNegativeModifier[player.talismanRarity[6]] - negativeBonus) * player.talismanLevels[6] * (-1)}

        if(player.talismanSeven[i] == (1)){talisman7Effect[i] = (talismanPositiveModifier[player.talismanRarity[7]] + positiveBonus) * player.talismanLevels[7]}
        else{talisman7Effect[i] = (talismanNegativeModifier[player.talismanRarity[7]] - negativeBonus) * player.talismanLevels[7] * (-1)}

    }
    rune1Talisman = 0;
    rune2Talisman = 0;
    rune3Talisman = 0;
    rune4Talisman = 0;
    rune5Talisman = 0;
    for(var i = 1; i <= 7; i++){
    rune1Talisman += window["talisman" + i + "Effect"][1]
    rune2Talisman += window["talisman" + i + "Effect"][2]
    rune3Talisman += window["talisman" + i + "Effect"][3]
    rune4Talisman += window["talisman" + i + "Effect"][4]
    rune5Talisman += window["talisman" + i + "Effect"][5]
    }
talisman6Power = 0;
talisman7Quarks = 0;
    if(player.talismanRarity[1] == 6){rune2Talisman += 125;}
    if(player.talismanRarity[2] == 6){rune1Talisman += 125;}
    if(player.talismanRarity[3] == 6){rune4Talisman += 125;}
    if(player.talismanRarity[4] == 6){rune3Talisman += 125;}
    if(player.talismanRarity[5] == 6){rune5Talisman += 125;}
    if(player.talismanRarity[6] == 6){talisman6Power = 2;}
    if(player.talismanRarity[7] == 6){talisman7Quarks = 2;}
}

function calculateRuneLevels() {
    calculateTalismanEffects();
    if (player.currentChallengeRein !== "nine"){
		rune1level = Math.max(1, player.runelevels[0] + (player.antUpgrades[9] + bonusant9) + (rune1Talisman))
		rune2level = Math.max(1, player.runelevels[1] + (player.antUpgrades[9] + bonusant9) + (rune2Talisman))
		rune3level = Math.max(1, player.runelevels[2] + (player.antUpgrades[9] + bonusant9) + (rune3Talisman))
		rune4level = Math.max(1, player.runelevels[3] + (player.antUpgrades[9] + bonusant9) + (rune4Talisman))
		rune5level = Math.max(1, player.runelevels[4] + (player.antUpgrades[9] + bonusant9) + (rune5Talisman))
    }

    for (var i = 1; i <= 5; i++){
        window["divineBlessing"+i] = 1;
        document.getElementById("divineblessing"+i).textContent = "";
        document.getElementById("rune"+i).style.backgroundColor = "black";
        if(player.autoSacrifice == i){document.getElementById("rune"+i).style.backgroundColor = "orange"}}


    divineBlessing5 = 0;
    if (rune1level >= 1250){
        document.getElementById("rune1").style.backgroundColor = "red";
        divineBlessing1 = (1 + (rune1level - 1250)/500);
        document.getElementById("divineblessing1").textContent = " In-Game timers speed x" + format(divineBlessing1,3);}
    if (rune2level >= 1500){
        document.getElementById("rune2").style.backgroundColor = "red";
        divineBlessing2 = (1 + (rune2level-1500)/100);
        document.getElementById("divineblessing2").textContent = " Multiplier Boost Effect x" + format(divineBlessing2,3);}
    if (rune3level >= 1000){
        document.getElementById("rune3").style.backgroundColor = "red";
        divineBlessing3 = (1 + (rune3level-1000)/400);
        document.getElementById("divineblessing3").textContent = " Ant Sacrifice Multiplier x" + format(divineBlessing3,3);}
    if (rune4level >= 1500){
        document.getElementById("rune4").style.backgroundColor = "red";
        divineBlessing4 = (1 + (rune4level-1500)/1000);
        document.getElementById("divineblessing4").textContent = " Accelerator Boost Cost Delay x" + format(divineBlessing4,3)}
    if (rune5level >= 1000){
        document.getElementById("rune5").style.backgroundColor = "red";
        divineBlessing5 = (calculateSigmoid(2,(rune5level-1000),600) - 1);
        document.getElementById("divineblessing5").textContent = " Ant Speed Mult. x" + format(Math.pow(player.researchPoints,divineBlessing5),2) + " [Based on Obtainium]"
    }
    runeSum = 0;
    for (var i=1; i<=5; i++){
    displayRuneInformation(i,false)
    if(player.autoSacrifice == i){document.getElementById("rune"+i).style.backgroundColor = "orange"}
    runeSum += window['rune'+i+'level']
    }


}

function calculateAnts() {

    let talismanBonus = 0;
    if(player.antUpgrades[12] > 0){talismanBonus += 2}
    talismanBonus += player.challengecompletions.nine
    bonusant1 = Math.min(player.antUpgrades[1], 4 * player.researches[97] + talismanBonus + player.researches[102])
    bonusant2 =  Math.min(player.antUpgrades[2], 4 * player.researches[97] + talismanBonus + player.researches[102])
    bonusant3 =  Math.min(player.antUpgrades[3], 4 * player.researches[97] + talismanBonus + player.researches[102])
    bonusant4 = Math.min(player.antUpgrades[4], 4 * player.researches[97] + talismanBonus + player.researches[102])
    bonusant5 = Math.min(player.antUpgrades[5], 4 * player.researches[97] + talismanBonus + player.researches[102])
    bonusant6 = Math.min(player.antUpgrades[6], 4 * player.researches[97] + talismanBonus + player.researches[102])
    bonusant7 = Math.min(player.antUpgrades[7], 4 * player.researches[98] + talismanBonus + player.researches[102])
    bonusant8 =  Math.min(player.antUpgrades[8], 4 * player.researches[98] + talismanBonus + player.researches[102])
    bonusant9 = Math.min(player.antUpgrades[9], 4 * player.researches[98] + talismanBonus + player.researches[102])
    bonusant10 =  Math.min(player.antUpgrades[10], 4 * player.researches[98] + talismanBonus + player.researches[102])
    bonusant11 = Math.min(player.antUpgrades[11], 4 * player.researches[98] + talismanBonus + player.researches[102])
    bonusant12 = Math.min(player.antUpgrades[12], 4 * player.researches[98] + talismanBonus + player.researches[102])
}

function calculateAntSacrificeELO(){
    antELO = 0;
    effectiveELO = 0;
    let antUpgradeSum = player.antUpgrades.reduce(function(a, b) {return a + b}, 0);
    if(player.antPoints.greaterThanOrEqualTo("1e40")){
        antELO += Decimal.log(player.antPoints, 10);
        antELO += 1/2 * antUpgradeSum;
        antELO += 1/10 * player.firstOwnedAnts
        antELO += 1/5 * player.secondOwnedAnts
        antELO += 1/3 * player.thirdOwnedAnts
        antELO += 1/2 * player.fourthOwnedAnts
        antELO += player.fifthOwnedAnts
        antELO += 2 * player.sixthOwnedAnts
        antELO += 4 * player.seventhOwnedAnts
        antELO += 8 * player.eighthOwnedAnts
        if(player.achievements[180] == 1){antELO *= 1.01}
        if(player.achievements[181] == 1){antELO *= 1.03/1.01}
        if(player.achievements[182] == 1){antELO *= 1.06/1.03}
        antELO *= (1 + player.researches[110]/100)

        if(player.achievements[176] == 1){antELO += 25}
        if(player.achievements[177] == 1){antELO += 50}
        if(player.achievements[178] == 1){antELO += 75}
        if(player.achievements[179] == 1){antELO += 100}
        antELO += 25 * player.researches[108]
        antELO += 25 * player.researches[109]
        antELO += 40 * player.researches[123]
        antELO += 100 * player.challengecompletions.ten
        antELO += 75 * player.upgrades[80]
        antELO = 1/10 * Math.floor(10 * antELO)

        effectiveELO += 0.5 * Math.min(3500, antELO)
        effectiveELO += 0.1 * Math.min(4000, antELO)
        effectiveELO += 0.1 * Math.min(6000, antELO)
        effectiveELO += 0.1 * Math.min(10000, antELO)
        effectiveELO += 0.2 * antELO
        effectiveELO += (cubeBonusMultiplier[8] - 1)


    }
}

function calculateAntSacrificeMultipliers() {
    timeMultiplier = Math.min(1, Math.pow(player.antSacrificeTimer / 900, 2)) * Math.max(1, Math.pow(player.antSacrificeTimer/900, 0.92));

    upgradeMultiplier = 1;
    upgradeMultiplier *= (1 + 2 * (1 - Math.pow(2, -(player.antUpgrades[11] + bonusant11)/125)));
    upgradeMultiplier *= (1 + player.researches[103]/20);
    upgradeMultiplier *= (1 + player.researches[104]/20);
    if(player.achievements[132] == 1){upgradeMultiplier *= 1.25};
    if(player.achievements[137] == 1){upgradeMultiplier *= 1.25};
    upgradeMultiplier *= divineBlessing3;
    upgradeMultiplier *= (1 + 1/50 * player.challengecompletions.ten);
    upgradeMultiplier *= (1 + 1/50 * player.researches[122]);
    upgradeMultiplier *= (1 + 1/10 * player.upgrades[79]);
    upgradeMultiplier *= (1 + 0.09 * player.upgrades[40]);
    upgradeMultiplier *= cubeBonusMultiplier[7];
}

function calculateAntSacrificeRewards() {
    calculateAntSacrificeELO();
    calculateAntSacrificeMultipliers();
    let rewardsMult = timeMultiplier * upgradeMultiplier;
    let rewards = {};

    rewards.antSacrificePoints = effectiveELO * rewardsMult;
    rewards.offerings = player.offeringpersecond * 0.15 * effectiveELO * rewardsMult;
    rewards.obtainium = player.maxobtainiumpersecond * 0.24 * effectiveELO * rewardsMult;
    rewards.talismanShards = (antELO > 500) ?
        Math.floor(rewardsMult * Math.pow(1/4 * (Math.max(0, effectiveELO - 500)), 2)) :
        0;
    rewards.commonFragments = (antELO > 750) ?
        Math.floor(rewardsMult * Math.pow(1/9 * (Math.max(0,effectiveELO - 750)), 1.83)) :
        0;
    rewards.uncommonFragments = (antELO > 1000) ?
        Math.floor(rewardsMult * Math.pow(1/16 * (Math.max(0,effectiveELO - 1000)), 1.66)) :
        0;
    rewards.rareFragments = (antELO > 1500) ?
        Math.floor(rewardsMult * Math.pow(1/25 * (Math.max(0,effectiveELO - 1500)), 1.50)) :
        0;
    rewards.epicFragments = (antELO > 2000) ?
        Math.floor(rewardsMult * Math.pow(1/36 * (Math.max(0,effectiveELO - 2000)), 1.33)) :
        0;
    rewards.legendaryFragments = (antELO > 3000) ?
        Math.floor(rewardsMult * Math.pow(1/49 * (Math.max(0,effectiveELO - 3000)), 1.16)) :
        0;
    rewards.mythicalFragments = (antELO > 5000) ?
        Math.floor(rewardsMult * Math.pow(1/64 * (Math.max(0,effectiveELO - 4150)), 1)) :
        0;

    return rewards;
}

function initiateTimeWarp(time){
    if(!timeWarp){
        player.worlds -= 0;
        calculateOffline(time);
    }
}

function calculateOffline(forceTime){
    forceTime = forceTime || 0
toggleTalismanBuy(player.buyTalismanShardPercent);
updateTalismanInventory();
calculateObtainium();
calculateAnts();
calculateRuneLevels();
if (forceTime == 0){document.getElementById("preload").style.display = "block"}
document.getElementById("offlineprogressbar").style.display = "block"
timeWarp = true
if (player.offlinetick < 1.5e12) {player.offlinetick = Date.now()}
    var updatedtime = Date.now()
    var timeadd = Math.min(28800 * 3 + 7200 * player.researches[31] + 7200 * player.researches[32], Math.max(forceTime, (updatedtime - player.offlinetick) / 1000));
    timeadd *= calculateTimeAcceleration();
    document.getElementById("offlineTimer").textContent = "You have " + format(timeadd,2) + " seconds of Offline Progress!";
    let simulatedTicks = 800;
    let tickValue = timeadd/800;
    let progressBarWidth = 0;
    if(timeadd < 1000){simulatedTicks = Math.min(1, Math.floor(timeadd/1.25)); tickValue = Math.min(1.25,timeadd);};
    let maxSimulatedTicks = simulatedTicks;
    player.quarkstimer += timeadd / calculateTimeAcceleration();
    player.ascensionCounter += timeadd / calculateTimeAcceleration();
    if (player.cubeUpgrades[2] > 0) { player.runeshards += Math.floor(player.cubeUpgrades[2] * timeadd / calculateTimeAcceleration()) }
    if (player.researches[61] > 0){player.researchPoints += timeadd * calculateAutomaticObtainium()}
    if (player.achievements[173] == 1){
        player.antSacrificeTimer += timeadd;
    }


    if(player.quarkstimer >= 90000){player.quarkstimer = 90000}

    let runOffline = setInterval(runSimulator, 0)
    function runSimulator(){
        player.prestigecounter += tickValue;
        player.transcendcounter += tickValue;
        player.reincarnationcounter += tickValue;
        resourceGain(tickValue,true);
        calculateObtainium();
        if(simulatedTicks % 2 == 0){
        updateAll(true);
        }

        if (player.shopUpgrades.offeringAutoLevel > 0.5 && player.autoSacrificeToggle){
            player.sacrificeTimer += tickValue
            if (player.sacrificeTimer >= 10){
                let rune = player.autoSacrifice;
                redeemShards(rune,true,Math.floor(player.sacrificeTimer/10));
                player.sacrificeTimer = player.sacrificeTimer % 10;
            }
        }
        simulatedTicks -= 1;
        progressBarWidth = 750 * (1 - simulatedTicks / maxSimulatedTicks)
        document.getElementById("offlineprogressdone").style.width = progressBarWidth + "px"
        if(simulatedTicks < 1){clearInterval(runOffline); timeWarp = false;
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
return (1 + (constant - 1) * (1 - Math.pow(2, -(factor)/(divisor))));
}

function calculateCubeBlessings(){

    document.getElementById("cubeQuantity").textContent = format(player.wowCubes,0,true)

    let cubeArray = [null, player.cubeBlessings.accelerator, player.cubeBlessings.multiplier, player.cubeBlessings.offering, player.cubeBlessings.runeExp, player.cubeBlessings.obtainium, player.cubeBlessings.antSpeed, player.cubeBlessings.antSacrifice, player.cubeBlessings.antELO, player.cubeBlessings.talismanBonus, player.cubeBlessings.globalSpeed]
    let powerBonus = [null, player.cubeUpgrades[45]/100, player.cubeUpgrades[35]/100, player.cubeUpgrades[24]/100,player.cubeUpgrades[14]/100, 0, 0, player.cubeUpgrades[15]/100, player.cubeUpgrades[25]/100, player.cubeUpgrades[44]/100, player.cubeUpgrades[34]/100]

    let accuracy = [null,2,2,2,2,2,2,2,1,4,3]
    for(var i = 1; i <= 10; i++){
    let power = 1;
    let mult = 1;
    let augmentAccuracy = 0;
    if(cubeArray[i] >= 1000){power = blessingDRPower[i]; mult *= Math.pow(1000, (1 - blessingDRPower[i]) * (1 + powerBonus[i])); augmentAccuracy += 2;}
    if(i == 6){power = 2.25; mult = 1; augmentAccuracy = 0;}

    cubeBonusMultiplier[i] = 1 + mult * blessingbase[i] * Math.pow(cubeArray[i], power * (1 + powerBonus[i]));

    document.getElementById("blessing"+i+"Amount").textContent = "x"+format(cubeArray[i],0,true)
    document.getElementById("blessing"+i+"Effect").textContent = "+"+format(100*(cubeBonusMultiplier[i] - 1),accuracy[i] + augmentAccuracy,true) + "%"
    if(i == 1){document.getElementById("blessing1Effect").textContent = "+"+format(cubeBonusMultiplier[1] - 1,accuracy[1] + augmentAccuracy,true)}
    if(i == 8){document.getElementById("blessing8Effect").textContent = "+"+format(cubeBonusMultiplier[8] - 1,accuracy[8] + augmentAccuracy,true)}
    if(i == 9){document.getElementById("blessing9Effect").textContent = "+"+format(cubeBonusMultiplier[9] - 1,accuracy[9] + augmentAccuracy,true)}
    }

    calculateRuneLevels();
    calculateAntSacrificeELO();
    calculateObtainium();

}

function calculateCubeMultiplier() {
    mult = 1;
    mult *= (1 + player.researches[119]/400);
    mult *= (1 + player.researches[120]/400);
    mult *= (1 + player.cubeUpgrades[1]/10);
    mult *= (1 + player.cubeUpgrades[11]/10);
    mult *= (1 + player.cubeUpgrades[21]/10);
    mult *= (1 + player.cubeUpgrades[31]/10);
    mult *= (1 + player.cubeUpgrades[41]/10);

    var timeThresholds = [0, 30, 60, 120, 600, 1800, 7200, 28800, 86400, 86400*7]
    for(var i = 1; i <= 9; i++){
        if(player.ascensionCounter < timeThresholds[i]){mult *= 1.1}
    }
    return(mult)
}

function calculateTimeAcceleration() {
    let timeMult = 1;
    timeMult *= (1 + player.researches[121]/50); // research 5x21
    timeMult *= divineBlessing1; // speed blessing
    timeMult *= cubeBonusMultiplier[10]; // Chronos cube blessing
    timeMult *= 1 + 0.1 * player.cubeUpgrades[18] / 25; // cube upgrade 2x8
    timeMult *= calculateSigmoid(2, player.antUpgrades[12] + bonusant12, 69) // ant 12
    timeMult *= lazinessMultiplier[player.usedCorruptions[3]]

    return(timeMult)
}

function calculateCorruptionPoints(){
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

multiplyPoints += 1/100 * corruptionMultiplyPointArray[player.usedCorruptions[4]]
multiplyPoints += 1/100 * corruptionMultiplyPointArray[player.usedCorruptions[5]]
multiplyPoints += 1/100 * corruptionMultiplyPointArray[player.usedCorruptions[10]]

let totalPoints = basePoints * multiplyPoints
if(totalPoints === 39600){totalPoints += 400}
return(totalPoints)
}