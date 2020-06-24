function calculateObtainium(){
    obtainiumGain = 1;
        if (player.upgrades[69] > 0.5) {
            obtainiumGain *= Math.min(10, Decimal.pow(Decimal.log(reincarnationPointGain.add(10), 10), 0.5))
        }
        if (player.upgrades[70] > 0.5) {
            obtainiumGain *= Math.pow(Math.min(19 + 0.6 * player.shopUpgrades.obtainiumTimerLevel, 1 + 2 * player.reincarnationcounter / 400),2)
        }
        if (player.upgrades[72] > 0.5) {
            obtainiumGain *= Math.min(50, (1 + 2 * player.challengecompletions.six + 2 * player.challengecompletions.seven + 2 * player.challengecompletions.eight + 2 * player.challengecompletions.nine + 2 * player.challengecompletions.ten))
        }
        if (player.upgrades[74] > 0.5) {
            obtainiumGain *= (1 + 4 * Math.min(1, Math.pow(player.maxofferings / 100000, 0.5)))
        }
        obtainiumGain *= (1 + player.researches[65]/50)
        obtainiumGain *= (1 + player.researches[76]/100)
        obtainiumGain *= (1 + player.researches[81]/200)
        obtainiumGain *= (1 + player.shopUpgrades.obtainiumAutoLevel/50)
        obtainiumGain *= (1 + player.shopUpgrades.cashGrabLevel/100)
        obtainiumGain *= (1 + rune5level/150 * effectiveLevelMult * (1 + player.researches[84]/1000)) * Math.pow(2, rune5level/300 * effectiveLevelMult * (1 + player.researches[84]/1000))
        obtainiumGain *= (1 + 0.01 * player.achievements[84] + 0.03 * player.achievements[91] + 0.05 * player.achievements[98] + 0.07 * player.achievements[105] + 0.09 * player.achievements[112] + 0.11 * player.achievements[119] + 0.13 * player.achievements[126] + 0.15 * player.achievements[133] + 0.17 * player.achievements[140] + 0.19 * player.achievements[147])
        obtainiumGain *= (1 + 9 * (1 - Math.pow(2, -(player.antUpgrades[10] + bonusant10)/125)))
        if (player.achievements[53] > 0.5){
            obtainiumGain *= (1 + 1/2000 * (runeSum))
        }
        if (player.achievements[128]){obtainiumGain *= 1.5};
        if (player.achievements[129]){obtainiumGain *= 1.25};
        
        if (player.achievements[51] > 0.5){obtainiumGain += 4}
        obtainiumGain *= Math.min(1 + 3 * player.upgrades[70], Math.pow(player.reincarnationcounter/30, 2));

        player.obtainiumpersecond = obtainiumGain/(Math.min(player.reincarnationcounter, 3600 + 120 * player.shopUpgrades.obtainiumTimerLevel) + 1)
        player.maxobtainiumpersecond = Math.max(player.maxobtainiumpersecond, player.obtainiumpersecond);
}

function calculateTalismanEffects(){
    let positiveBonus = 0;
    if(player.achievements[135] == 1){positiveBonus += 0.05}
    if(player.achievements[136] == 1){positiveBonus += 0.05}
    positiveBonus += player.researches[106]/100
    positiveBonus += player.researches[107]/100

    for(var i=1; i <= 5; i++){
        if(player.talismanOne[i] == (1)){talisman1Effect[i] = (talismanPositiveModifier[player.talismanRarity[1]] + positiveBonus) * player.talismanLevels[1]}
        else{talisman1Effect[i] = talismanNegativeModifier[player.talismanRarity[1]] * player.talismanLevels[1] * (-1)}
        
        if(player.talismanTwo[i] == (1)){talisman2Effect[i] = (talismanPositiveModifier[player.talismanRarity[2]] + positiveBonus) * player.talismanLevels[2]}
        else{talisman2Effect[i] = talismanNegativeModifier[player.talismanRarity[2]] * player.talismanLevels[2] * (-1)}
        
        if(player.talismanThree[i] == (1)){talisman3Effect[i] = (talismanPositiveModifier[player.talismanRarity[3]] + positiveBonus) * player.talismanLevels[3]}
        else{talisman3Effect[i] = talismanNegativeModifier[player.talismanRarity[3]] * player.talismanLevels[3] * (-1)}
        
        if(player.talismanFour[i] == (1)){talisman4Effect[i] = (talismanPositiveModifier[player.talismanRarity[4]] + positiveBonus) * player.talismanLevels[4]}
        else{talisman4Effect[i] = talismanNegativeModifier[player.talismanRarity[4]] * player.talismanLevels[4] * (-1)}
        
        if(player.talismanFive[i] == (1)){talisman5Effect[i] = (talismanPositiveModifier[player.talismanRarity[5]] + positiveBonus) * player.talismanLevels[5]}
        else{talisman5Effect[i] = talismanNegativeModifier[player.talismanRarity[5]] * player.talismanLevels[5] * (-1)}
        
        if(player.talismanSix[i] == (1)){talisman6Effect[i] = (talismanPositiveModifier[player.talismanRarity[6]] + positiveBonus) * player.talismanLevels[6]}
        else{talisman6Effect[i] = talismanNegativeModifier[player.talismanRarity[6]] * player.talismanLevels[6] * (-1)}
        
        if(player.talismanSeven[i] == (1)){talisman7Effect[i] = (talismanPositiveModifier[player.talismanRarity[7]] + positiveBonus) * player.talismanLevels[7]}
        else{talisman7Effect[i] = talismanNegativeModifier[player.talismanRarity[7]] * player.talismanLevels[7] * (-1)}
        
        console.log(player.talismanOne[i])
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
    displayruneinformation(i,false)
    if(player.autoSacrifice == i){document.getElementById("rune"+i).style.backgroundColor = "orange"}
    runeSum += window['rune'+i+'level']
    }


}

function calculateAnts() {

    let talismanBonus = 0;
    if(player.antUpgrades[12] > 0){talismanBonus += 2}
    talismanBonus += player.challengecompletions.nine
    bonusant1 = Math.min(player.antUpgrades[1], player.researches[97] + talismanBonus + player.researches[102])
    bonusant2 =  Math.min(player.antUpgrades[2], player.researches[97] + talismanBonus + player.researches[102])
    bonusant3 =  Math.min(player.antUpgrades[3], player.researches[97] + talismanBonus + player.researches[102])
    bonusant4 = Math.min(player.antUpgrades[4], player.researches[97] + talismanBonus + player.researches[102])
    bonusant5 = Math.min(player.antUpgrades[5], player.researches[97] + talismanBonus + player.researches[102])
    bonusant6 = Math.min(player.antUpgrades[6], player.researches[97] + talismanBonus + player.researches[102])
    bonusant7 = Math.min(player.antUpgrades[7], player.researches[98] + talismanBonus + player.researches[102])
    bonusant8 =  Math.min(player.antUpgrades[8], player.researches[98] + talismanBonus + player.researches[102])
    bonusant9 = Math.min(player.antUpgrades[9], player.researches[98] + talismanBonus + player.researches[102])
    bonusant10 =  Math.min(player.antUpgrades[10], player.researches[98] + talismanBonus + player.researches[102])
    bonusant11 = Math.min(player.antUpgrades[11], player.researches[98] + talismanBonus + player.researches[102])
    bonusant12 = Math.min(player.antUpgrades[12], player.researches[98] + talismanBonus + player.researches[102])
}

function calculateAntSacrificeELO(){
    antELO = 0;
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
        antELO += 5 * player.researches[108]
        antELO += 5 * player.researches[109]
        antELO += 10 * player.researches[123]
        antELO += 100 * player.challengecompletions.ten
        antELO += 75 * player.upgrades[80]
        antELO = 1/10 * Math.floor(10 * antELO)
    }
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
    var timeadd = Math.min(28800 * 3, Math.max(forceTime, (updatedtime - player.offlinetick) / 1000)) * divineBlessing1;
    console.log(timeadd)
    timeadd *= (1 + player.researches[121]/50)
    document.getElementById("offlineTimer").textContent = "You have " + format(timeadd,2) + " seconds of Offline Progress!";
    let simulatedTicks = 800;
    let tickValue = timeadd/800;
    let progressBarWidth = 0;
    if(timeadd < 1000){simulatedTicks = Math.min(1, Math.floor(timeadd/1.25)); tickValue = Math.min(1.25,timeadd);};
    let maxSimulatedTicks = simulatedTicks
    console.log("You were offline for " + format(timeadd) + " seconds!");
    console.log("The game simulated " + format(simulatedTicks) + " ticks while you were away! :)");
    player.quarkstimer += timeadd/(divineBlessing1 * (1 + player.researches[121]/50));
    if (player.researches[61] > 0.5) {
		player.obtainiumtimer += timeadd
		resetCurrency();
		var u = 1;
		u *= (1 + player.researches[76]/100);
		    if(player.upgrades[69] > 0.5){u *= Math.min(3,Decimal.pow(Decimal.log(reincarnationPointGain.add(11), 10), 0.5))};

		player.researchPoints += Math.floor((1 + player.researches[64]) * u * player.obtainiumtimer / (60 - player.researches[62] - player.researches[63]));
		var a = player.obtainiumtimer % (60 - player.researches[62] - player.researches[63]);
		player.obtainiumtimer = a;
    }
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
                redeemshards(rune,true,Math.floor(player.sacrificeTimer/10));
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
