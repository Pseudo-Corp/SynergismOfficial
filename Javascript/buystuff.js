function getReductionValue() {
	let reduction = 1;
	reduction += 1/400 * rune4level * effectiveLevelMult;
	reduction += 1/200 * (player.researches[56] + player.researches[57] + player.researches[58] + player.researches[59] + player.researches[60]);
	reduction += 1/200 * player.challengecompletions.four;
	reduction += 3/100 * (player.antUpgrades[7] + bonusant7);
	return reduction;
}

function getCostAccelerator(buyingTo) {
	--buyingTo;

	let originalCost = 500;
	let cost = new Decimal(originalCost);

	cost = cost.times(Decimal.pow(4 / costDivisor, buyingTo));

	if (buyingTo > (125 + 5 * player.challengecompletions.four))
	{
		let num = buyingTo - 125 - 5 * player.challengecompletions.four;
		let factorialBit = new Decimal(num).factorial();
		let multBit = Decimal.pow(4, num);
		cost = cost.times(multBit.times(factorialBit));
	}

	if (buyingTo > (2000 + 5 * player.challengecompletions.four))
	{
		let sumNum = buyingTo - 2000 - 5 * player.challengecompletions.four;
		let sumBit = sumNum * (sumNum + 1) / 2
		cost = cost.times(Decimal.pow(2, sumBit));
	}

	if (player.currentChallenge === "four")
	{
		let sumBit = buyingTo * (buyingTo + 1) / 2;
		cost = cost.times(Decimal.pow(10, sumBit));
	}

	if (player.currentChallengeRein === "eight")
	{
		let sumBit = buyingTo * (buyingTo + 1) / 2;
		cost = cost.times(Decimal.pow(1e50, sumBit));
	}
	return cost;
}

function buyAccelerator(autobuyer) {
	// Start buying at the current amount bought + 1
	var buyTo =  player.acceleratorBought + 1;
	var cashToBuy = getCostAccelerator(buyTo);
	while (player.coins.greaterThanOrEqualTo(cashToBuy))
	{
		// then multiply by 4 until it reaches just above the amount needed
		buyTo = buyTo * 4;
		cashToBuy = getCostAccelerator(buyTo);
	}
	var stepdown = Math.floor(buyTo / 8);
	while (stepdown !== 0)
	{
	 
		// if step down would push it below out of expense range then divide step down by 2
		if (getCostAccelerator(buyTo - stepdown).lessThanOrEqualTo(player.coins))
		{
			stepdown = Math.floor(stepdown/2);
		}
		else
		{
			buyTo = buyTo - stepdown;
		}
	}

	if (!autobuyer && player.coinbuyamount !== "max")
	{
		if (player.acceleratorBought + player.coinbuyamount < buyTo)
		{
			buyTo = player.acceleratorBought + player.coinbuyamount;
		}
	}

	let buyFrom = Math.max(buyTo - 7, player.acceleratorBought + 1);
	let thisCost = getCostAccelerator(buyFrom);
	while (buyFrom <= buyTo && player.coins.greaterThanOrEqualTo(thisCost))
	{
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
    if (player.acceleratorBought >= 5 && player.achievements[148] == 0){achievementaward(148)} 
    if (player.acceleratorBought >= 25 && player.achievements[149] == 0){achievementaward(149)} 
    if (player.acceleratorBought >= 100 && player.achievements[150] == 0){achievementaward(150)} 
    if (player.acceleratorBought >= 666 && player.achievements[151] == 0){achievementaward(151)} 
    if (player.acceleratorBought >= 2000 && player.achievements[152] == 0){achievementaward(152)} 
    if (player.acceleratorBought >= 12500 && player.achievements[153] == 0){achievementaward(153)} 
    if (player.acceleratorBought >= 100000 && player.achievements[154] == 0){achievementaward(154)} 
}

function getCostMultiplier(buyingTo)
{
	--buyingTo;
	
	let originalCost = 1e5;
	let cost = new Decimal(originalCost);
	cost = cost.times(Decimal.pow(10, buyingTo / costDivisor));

	if (buyingTo > (75 + 2 * player.challengecompletions.four))
	{
		let num = buyingTo - 75 - 2 * player.challengecompletions.four;
		let factorialBit = new Decimal(num).factorial();
		let powBit = Decimal.pow(10, num);
		cost = cost.times(factorialBit.times(powBit));
	}
	if (buyingTo > (2000 + 2 * player.challengecompletions.four))
	{
		let sumNum = buyingTo - 2000 - 2 * player.challengecompletions.four;
		let sumBit = sumNum * (sumNum + 1) / 2;
		cost = cost.times(Decimal.pow(2, sumBit));
	}
	if (player.currentChallenge === "four")
	{
		let sumBit = buyingTo * (buyingTo + 1) / 2;
		cost = cost.times(Decimal.pow(10, sumBit));
	}
	if (player.currentChallengeRein === "eight")
	{
		let sumBit = buyingTo * (buyingTo + 1) / 2;
		cost = cost.times(Decimal.pow(1e50, sumBit));
	}
	return cost;
}

function buyMultiplier(autobuyer){
	// Start buying at the current amount bought + 1
	var buyTo =  player.multiplierBought + 1;
	var cashToBuy = getCostMultiplier(buyTo);
	while (player.coins.greaterThanOrEqualTo(cashToBuy))
	{
		// then multiply by 4 until it reaches just above the amount needed
		buyTo = buyTo * 4;
		cashToBuy = getCostMultiplier(buyTo);
	}
	var stepdown = Math.floor(buyTo / 8);
	while (stepdown !== 0)
	{
	 
		// if step down would push it below out of expense range then divide step down by 2
		if (getCostMultiplier(buyTo - stepdown).lessThanOrEqualTo(player.coins))
		{
			stepdown = Math.floor(stepdown/2);
		}
		else
		{
			buyTo = buyTo - stepdown;
		}
	}

	if (!autobuyer && player.coinbuyamount !== "max")
	{
		if (player.multiplierBought + player.coinbuyamount < buyTo)
		{
			console.log(player.coinbuyamount + player.multiplierBought);
			buyTo = player.multiplierBought + player.coinbuyamount;
		}
	}

	let buyFrom = Math.max(buyTo - 7, player.multiplierBought + 1);
	let thisCost = getCostMultiplier(buyFrom);
	while (buyFrom <= buyTo && player.coins.greaterThanOrEqualTo(thisCost))
	{
		player.coins = player.coins.sub(thisCost);
		player.multiplierBought = buyFrom;
		buyFrom = buyFrom + 1;
		thisCost = getCostMultiplier(buyFrom);
		player.multiplierCost = thisCost;
	}
    updateAllMultiplier();
    if (player.multiplierBought >= 2 && player.achievements[155] == 0){achievementaward(155)}
    if (player.multiplierBought >= 20 && player.achievements[156] == 0){achievementaward(156)}
    if (player.multiplierBought >= 100 && player.achievements[157] == 0){achievementaward(157)}
    if (player.multiplierBought >= 500 && player.achievements[158] == 0){achievementaward(158)}
    if (player.multiplierBought >= 2000 && player.achievements[159] == 0){achievementaward(159)}
    if (player.multiplierBought >= 12500 && player.achievements[160] == 0){achievementaward(160)}
    if (player.multiplierBought >= 100000 && player.achievements[161] == 0){achievementaward(161)}

	}

	function getCost(originalCost, buyingTo, type, num, r)
	{
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
		var fr = Math.floor(r * 1000);
		if (buyingTo >= r * 1000)
		{
			
			// Accounts for all multiplications of itself up to buyingTo, while neglecting all multiplications of itself up to r*1000
			cost = cost.times(buyingToDec.factorial().dividedBy((new Decimal(fr).factorial())));
	
			// Accounts for all divisions of itself buyingTo times, while neglecting all divisions up to r*1000 times
			cost = cost.dividedBy(Decimal.pow(1000, buyingTo - fr));
	
			// Accounts for all multiplications of 1 + num/2, while neglecting all divisions up to r*1000 times
			cost = cost.times(Decimal.pow(1 + num/2, buyingTo - fr));
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
		if ((player.currentChallenge == "four") && (type == "Coin" || type == "Diamonds")) {
			// you would not fucking believe how long it took me to figure this out
			// (100*costofcurrent + 10000)^n = (((100+buyingTo)!/100!)*100^buyingTo)^n
			cost = cost.times(Decimal.pow(new Decimal(buyingTo + 100).factorial().dividedBy(new Decimal(100).factorial()).times(Decimal.pow(100, buyingTo)), 1.25 + 1/4 * player.challengecompletions.four));
			if (buyingTo >= (1000 - (10 * player.challengecompletions.four))) {
				// and I changed this to be a summation of all the previous buys 1.25 to the sum from 1 to buyingTo 
				cost = cost.times(Decimal.pow(1.25, (buyingTo * (buyingTo + 1) / 2)));
			}
		}
		if ((player.currentChallengeRein == "ten") && (type == "Coin" || type == "Diamonds")) {
			// you would not fucking believe how long it took me to figure this out
			// (100*costofcurrent + 10000)^n = (((100+buyingTo)!/100!)*100^buyingTo)^n
			cost = cost.times(Decimal.pow(new Decimal(buyingTo + 100).factorial().dividedBy(new Decimal(100).factorial()).times(Decimal.pow(100, buyingTo)), 1.25 + 1/4 * player.challengecompletions.four));
			if (buyingTo >= (r * 25000)) {
				// and I changed this to be a summation of all the previous buys 1.25 to the sum from 1 to buyingTo 
				cost = cost.times(Decimal.pow(1.25, (buyingTo * (buyingTo + 1) / 2)));
			}
		}
		fr = Math.floor(r * 1000 * player.challengecompletions.eight);
		  if (player.currentChallengeRein == "eight" && (type == "Coin" || type == "Diamonds" || type == "Mythos") && buyingTo >= (1000 * player.challengecompletions.eight * r)){
			  
			var sumBuys = (buyingTo - (1000 * player.challengecompletions.eight * r)) * ((buyingTo - (1000 * player.challengecompletions.eight * r) + 1) / 2);
			var negBuys = (fr       - (1000 * player.challengecompletions.eight * r)) * ((fr       - (1000 * player.challengecompletions.eight * r) + 1) / 2);
			
			cost = cost.times(Decimal.pow(2, sumBuys - negBuys));
	
			// divided by same amount buying to - fr times
			cost = cost.dividedBy(Decimal.pow((1 + 1/2 * player.challengecompletions.eight), buyingTo - fr));
		}
	
		return cost;
	}
	
	function buyMax(pos, type, num, originalCost, autobuyer = false)
	{
		autobuyer = autobuyer || false;
		var tag = "";
		var r = getReductionValue();
	
		if (type == 'Diamonds'){tag = "prestigePoints";}
		if (type == 'Mythos'){tag = "transcendPoints";}
		if (type == 'Particles') {tag = "reincarnationPoints";}
		if (type == "Coin") {tag = "coins";}
	
		// Start buying at the current amount bought + 1
		var buyTo =  player[pos + 'Owned' + type] + 1;
		var cashToBuy = getCost(originalCost, buyTo, type, num, r);
		while (player[tag].greaterThanOrEqualTo(cashToBuy))
		{
			// then multiply by 4 until it reaches just above the amount needed
			buyTo = buyTo * 4;
			cashToBuy = getCost(originalCost, buyTo, type, num, r);
		}
		var stepdown = Math.floor(buyTo / 8);
		while (stepdown !== 0)
		{
		 
			// if step down would push it below out of expense range then divide step down by 2
			if (getCost(originalCost, buyTo - stepdown, type, num, r).lessThanOrEqualTo(player[tag]))
			{
				stepdown = Math.floor(stepdown/2);
			}
			else
			{
				buyTo = buyTo - stepdown;
			}
		}
		// go down by 7 steps below the last one able to be bought and spend the cost of 25 up to the one that you started with and stop if coin goes below requirement
		var buyFrom = Math.max(buyTo - 7, player[pos + 'Owned' + type] + 1);
		var thisCost = getCost(originalCost, buyFrom, type, num, r);
		while (buyFrom < buyTo  && player[tag].greaterThanOrEqualTo(getCost(originalCost, buyFrom, type, num, r)))
		{
			player[tag] = player[tag].sub(thisCost);
			player[pos + 'Owned' + type] = buyFrom;
			buyFrom = buyFrom + 1;
			thisCost = getCost(originalCost, buyFrom, type, num, r);
			player[pos + 'Cost' + type] = thisCost;
		}
	}	
	

function buyProducer(pos,type,num,autobuyer) {
	let buythisamount = 0;
    var r = 1;
    var tag = ""
	r += 1/400 * rune4level * effectiveLevelMult
	r += 1/200 * (player.researches[56] + player.researches[57] + player.researches[58] + player.researches[59] + player.researches[60])
	r += 1/200 * player.challengecompletions.four
	r += 3/100 * player.antUpgrades[7] + 3/100 * bonusant7
	if (type == 'Diamonds'){tag = "prestigePoints"; var amounttype = "crystal"}
	if (type == 'Mythos'){tag = "transcendPoints"; var amounttype = "mythos"}
	if (type == 'Particles') {tag = "reincarnationPoints"; var amounttype = "particle"}
	if (type == "Coin") {tag = "coins"; var amounttype = "coin"}
	if (autobuyer){buythisamount = 500}
	if (!autobuyer){buythisamount = player[amounttype + 'buyamount']}
		while(player[tag].greaterThanOrEqualTo(player[pos + 'Cost' + type]) && ticker < buythisamount) {
			player[tag] = player[tag].sub(player[pos + 'Cost' + type]);
			player[pos + 'Owned' + type] += 1;
			player[pos + 'Cost' + type] = player[pos + 'Cost' + type].times(Decimal.pow(1.25, num));
			player[pos + 'Cost' + type] = player[pos + 'Cost' + type].add(1);
			if (player[pos + 'Owned' + type] >= (1000 * r)){
			player[pos + 'Cost' + type] = player[pos + 'Cost' + type].times(player[pos + 'Owned' + type]).dividedBy(1000).times(1 + num/2);
			}
			if (player[pos + 'Owned' + type] >= (5000 * r)){
			player[pos + 'Cost' + type] = player[pos + 'Cost' + type].times(player[pos + 'Owned' + type]).times(10).times(10 + num * 10);
			 }  
			if (player[pos + 'Owned' + type] >= (20000 * r)){
			player[pos + 'Cost' + type] = player[pos + 'Cost' + type].times(Decimal.pow(player[pos + 'Owned' + type], 3)).times(100000).times(100 + num * 100)  
			 }
			if (player[pos + 'Owned' + type] >= (250000 * r)){
				player[pos + 'Cost' + type] = player[pos + 'Cost' + type].times(Decimal.pow(1.03, player[pos + 'Owned' + type] - 250000 * r))  
			}
			if (player.currentChallenge == "four" && (type == "Coin" || type == "Diamonds")) {
				 player[pos + 'Cost' + type] = player[pos + 'Cost' + type].times(Math.pow(100 * player[pos + 'Owned' + type] + 10000, 1.25 + 1/4 * player.challengecompletions.four));
				 if (player[pos + 'Owned' + type] >= 1000 - (10 * player.challengecompletions.four)) {
					player[pos + 'Cost' + type] = player[pos + 'Cost' + type].times(Decimal.pow(1.25, player[pos + 'Owned' + type]));
				 }
                 }
            if (player.currentChallengeRein == "eight" && (type == "Coin" || type == "Diamonds" || type == "Mythos") && player[pos + 'Owned' + type] >= (1000 * player.challengecompletions.eight * r)){
                player[pos + 'Cost' + type] = player[pos + 'Cost' + type].times(Decimal.pow(2, (player[pos + 'Owned' + type] - (1000 * player.challengecompletions.eight * r))/(1 + 1/2 * player.challengecompletions.eight)));
            }
				 ticker += 1;
			 }
			 ticker = 0;
	}

function buyResearch(index,auto) {
	auto = auto || false
	if (player.autoResearchToggle && player.autoResearch > 0.5 && !auto){
		let p = player.autoResearch
		if (player.researches[p] == researchMaxLevels[p]){document.getElementById("res" + player.autoResearch).style.backgroundColor = "green"}
		else if (player.researches[p] > 0.5) {document.getElementById("res" + player.autoResearch).style.backgroundColor = "purple"}
		else {document.getElementById("res" + player.autoResearch).style.backgroundColor = "black"}
	}
	if (!auto && player.autoResearchToggle && player.shopUpgrades.obtainiumAutoLevel > 0.5){player.autoResearch = index; document.getElementById("res" + index).style.backgroundColor = "orange"}

    let buyamount = 1;
    let i = 1;
	if (maxbuyresearch || auto){buyamount = 1000}
		if (auto || !player.autoResearchToggle){
		while(player.researches[index] < researchMaxLevels[index] && player.researchPoints >= (researchBaseCosts[index]) && buyamount >= i) {
			player.researchPoints -= researchBaseCosts[index]
			player.researches[index] += 1;
			researchfiller2 = "Level: " + player.researches[index] + "/" + researchMaxLevels[index]
			researchdescriptions(index,auto)

			if (index == 47 && player.unlocks.rrow1 == false) {player.unlocks.rrow1 = true; revealStuff()}
			if (index == 48 && player.unlocks.rrow2 == false) {player.unlocks.rrow2 = true; revealStuff()}
			if (index == 49 && player.unlocks.rrow3 == false) {player.unlocks.rrow3 = true; revealStuff()}
			if (index == 50 && player.unlocks.rrow4 == false) {player.unlocks.rrow4 = true; revealStuff()}
			i++
		}
		if (i > 1){revealStuff()}
	}
	calculateRuneLevels();
	calculateAnts();
}

function buyUpgrades(type, pos, state) {
		var addendum = ""
		if (type == "prestige" || type == "transcend" || type == "reincarnation") {
			addendum = "Point"
		} 		
		if (player[type + addendum + 's'].greaterThanOrEqualTo(Decimal.pow(10, upgradeCosts[pos])) && player.upgrades[pos] < 0.5) {
			player[type + addendum + 's'] = player[type + addendum + 's'].sub(Decimal.pow(10, upgradeCosts[pos]))
			player.upgrades[pos] = 1;
			upgradeupdate(pos, state)
		}

		if (type == "transcend") {
			player.reincarnatenocoinprestigeortranscendupgrades = false;
			player.reincarnatenocoinprestigetranscendorgeneratorupgrades = false;
		}
		if (type == "prestige") {
			player.transcendnocoinorprestigeupgrades = false;
			player.reincarnatenocoinorprestigeupgrades = false;
			player.reincarnatenocoinprestigeortranscendupgrades = false;
			player.reincarnatenocoinprestigetranscendorgeneratorupgrades = false;
		}
		if (type == "coin") {
			player.prestigenocoinupgrades = false;
			player.transcendnocoinupgrades = false;
			player.transcendnocoinorprestigeupgrades = false;
			player.reincarnatenocoinupgrades = false;
			player.reincarnatenocoinorprestigeupgrades = false;
			player.reincarnatenocoinprestigeortranscendupgrades = false;
			player.reincarnatenocoinprestigetranscendorgeneratorupgrades = false;
		}

	}
	
function buyCrystalUpgrades(i) {
	var u = i - 1
	var c = 0
	c += Math.floor(rune3level/10 * (1 + player.researches[5] /10) * (1 + player.researches[21]/800)) * 100/100
	if (player.upgrades[73] > 0.5 && player.currentChallengeRein !== "") {c += 10}
	if (player.prestigeShards.greaterThanOrEqualTo(Decimal.pow(10, (crystalUpgradesCost[u] + crystalUpgradeCostIncrement[u] * Math.floor(Math.pow(player.crystalUpgrades[u] + 0.5 - c, 2) /2))))) {
		player.prestigeShards = player.prestigeShards.sub(Decimal.pow(10, (crystalUpgradesCost[u] + crystalUpgradeCostIncrement[u] * Math.floor(Math.pow(player.crystalUpgrades[u] + 0.5 -c, 2)/2))));
		player.crystalUpgrades[u] += 1;

	}
	crystalupgradedescriptions(i)
}	
function boostAccelerator(automated) {
	var buyamount = 1;
	if (player.upgrades[46] == 1) {
	buyamount = player.coinbuyamount;
	if (automated == true) {buyamount = 9999};
	}
		while(player.prestigePoints.greaterThanOrEqualTo(player.acceleratorBoostCost) && ticker < buyamount) {
				if (player.prestigePoints.greaterThanOrEqualTo(player.acceleratorBoostCost)) {
					player.acceleratorBoostBought += 1;
					player.acceleratorBoostCost = player.acceleratorBoostCost.times(1e10).times(Decimal.pow(10, player.acceleratorBoostBought));
					if (player.acceleratorBoostBought > (1000 * divineBlessing4)) {player.acceleratorBoostCost = player.acceleratorBoostCost.times(Decimal.pow(10, Math.pow(player.acceleratorBoostBought - (1000 * divineBlessing4), 2) / divineBlessing4))}
					player.transcendnoaccelerator = false;
					player.reincarnatenoaccelerator = false;
					if (player.upgrades[46] < 0.5) {
						var j
						for (j = 21; j < 41; j++) {
							player.upgrades[j] = 0;
						}
						reset(1);
						player.prestigePoints = new Decimal(0);
					}
				}
				ticker++
			}
                ticker = 0;
    if (player.acceleratorBoostBought >= 2 && player.achievements[162] == 0){achievementaward(162)}
    if (player.acceleratorBoostBought >= 10 && player.achievements[163] == 0){achievementaward(163)}
    if (player.acceleratorBoostBought >= 50 && player.achievements[164] == 0){achievementaward(164)}
    if (player.acceleratorBoostBought >= 200 && player.achievements[165] == 0){achievementaward(165)}
    if (player.acceleratorBoostBought >= 1000 && player.achievements[166] == 0){achievementaward(166)}
    if (player.acceleratorBoostBought >= 5000 && player.achievements[167] == 0){achievementaward(167)}
    if (player.acceleratorBoostBought >= 15000 && player.achievements[168] == 0){achievementaward(168)}


	}


	function buyParticleBuilding(i){
		let pos = i
		let counter = 0;
		while(player[pos + 'CostParticles'].lessThanOrEqualTo(player.reincarnationPoints) && counter < player.particlebuyamount){
			player.reincarnationPoints = player.reincarnationPoints.sub(player[pos + 'CostParticles']);
			player[pos + 'CostParticles'] = player[pos + 'CostParticles'].times(2);
			player[pos + 'OwnedParticles'] += 1;
			counter++;
		}
	}