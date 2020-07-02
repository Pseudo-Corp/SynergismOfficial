var antdesc1 = "Gain a worker ant for your everyday life. Gathers Galactic Crumbs. Essential!"
var antdesc2 = "Gain a breeder ant which can producer worker ants automatically!"
var antdesc3 = "Gain a meta-breeder ant which can produce breeder ants automatically!"
var antdesc4 = "Gain a mega-breeder ant which can produce meta-breeder ants automatically!"
var antdesc5 = "Gain a Queen ant which can produce mega-breeder ants automatically!"
var antdesc6 = "Gain a Lord Royal ant which can produce Queen ants automatically!"
var antdesc7 = "Gain an ALMIGHTY ANT which can produce Lord Royal ants automatically!"
var antdesc8 = "Gain a DISCIPLE OF ANT GOD which can produce ALMIGHTY ANTS automatically!"

var antspecies1 = "Inceptus Formicidae"
var antspecies2 = "Fortunae Formicidae"
var antspecies3 = "Tributum Formicidae"
var antspecies4 = "Celeritas Formicidae"
var antspecies5 = "Multa Formicidae"
var antspecies6 = "Sacrificium Formicidae"
var antspecies7 = "Hic Formicidae"
var antspecies8 = "Experientia Formicidae"
var antspecies9 = "Praemoenio Formicidae"
var antspecies10 = "Scientia Formicidae"
var antspecies11 = "Phylacterium Formicidae"
var antspecies12 = "Mortuus Est Formicidae"

var antupgdesc1 = "Promotes romance and unity within the colony. [+11% Ant Speed / level]"
var antupgdesc2 = "Sweetens crumbs to increase their value [Each level increases Crumb --> Coin Conversion efficiency, up to ^1,000,000]"
var antupgdesc3 = "Swarms the Taxman into submission [Up to -99% taxes!]"
var antupgdesc4 = "Scares you into running faster [+2% Accelerator Boosts / level]"
var antupgdesc5 = "Imitates your body through magic shape-shifting powers [+4% Multipliers / level]"
var antupgdesc6 = "Tries to please Ant God... but fails [Gain up to 5x Offerings!]"
var antupgdesc7 = "Helps you build a few things here and there [+3% Building Cost Delay / level]"
var antupgdesc8 = "Knows how to salt and pepper food [+1% Rune EXP / level]"
var antupgdesc9 = "Can make your message to Ant God a little more clear [+1 all Rune Levels / level]"
var antupgdesc10 = "Has big brain energy [Gain up to 10x Obtainium!]"
var antupgdesc11 = "A valuable offering to the Ant God [Gain up to 3x Sacrifice Rewards!]"
var antupgdesc12 = "Sacrifices itself to allow you to equip [Unlocks the Ant Talisman!]"

const antUpgradeTexts = [null,
function(){return "ALL Ants work at " + format(Math.pow(1.11 + 1/1000 * player.researches[101], player.antUpgrades[1] + bonusant1),2) + "x speed."},
function(){return "Crumb --> Coin exponent is ^" + format(100000 + 900000 * (1 - Math.pow(2, -(player.antUpgrades[2] + bonusant2)/125)))},
function(){return "Tax growth is multiplied by " + format(0.01 + Math.pow(0.98, player.antUpgrades[3] + bonusant3 + 0.497),4)},
function(){return "Accelerator Boosts +" + format(2 * player.antUpgrades[4] + 2 * bonusant4) + "%"},
function(){return "Multipliers +" + format(4 * player.antUpgrades[5] + 4 * bonusant5) + "%"},
function(){return "Offerings x" + format(calculateSigmoid(5,(player.antUpgrades[6] + bonusant6),125),4)},
function(){return "Building Costs scale " + format(3 * player.antUpgrades[7] + 3 * bonusant7) + "% slower!"},
function(){return "Rune EXP is multiplied by " + format(Math.pow(1.01, player.antUpgrades[8] + bonusant8),2) +"!"},
function(){return "Each rune has +" + format(player.antUpgrades[9] + bonusant9) + " effective levels."},
function(){return "Obtainium x" + format(calculateSigmoid(10, (player.antUpgrades[10] + bonusant10),125),4)},
function(){return "Sacrificing is " + format(1 + 2 * (1 - Math.pow(2, -(player.antUpgrades[11] + bonusant11)/125)),4) + "x as effective"},
function(){return "Unlocks the talisman!"}]


var repeatAnt
function antRepeat(i){
    clearInterval(repeatAnt);
    repeatAnt = setInterval(updateAntDescription, 50, i)
}
function updateAntDescription(i) {
    let el = document.getElementById("anttierdescription")
    let la = document.getElementById("antprice")
    let ti = document.getElementById("antquantity")
    let me = document.getElementById("generateant")

    let priceType = "Galactic Crumbs"
    let tier = ""
    let content1 = window["antdesc" + i]
    el.textContent = content1

    switch(i){
    case 1: priceType = "Particles"; tier = "first"; me.textContent = "Generates " + format(antOneProduce,3) + " Crumbs/sec"; break;
    case 2: tier = "second"; me.textContent = "Generates " + format(antTwoProduce,3) + " Workers/sec"; break;
    case 3: tier = "third"; me.textContent = "Generates " + format(antThreeProduce,3) + " Breeders/sec"; break;
    case 4: tier = "fourth"; me.textContent = "Generates " + format(antFourProduce,3) + " MetaBreeders/sec"; break;
    case 5: tier = "fifth"; me.textContent = "Generates " + format(antFiveProduce,3) + " MegaBreeders/sec"; break;
    case 6: tier = "sixth"; me.textContent = "Generates " + format(antSixProduce,3) + " Queens/sec"; break;
    case 7: tier = "seventh"; me.textContent = "Generates " + format(antSevenProduce,3) + " Royals/sec"; break;
    case 8: tier = "eighth"; me.textContent = "Generates " + format(antEightProduce,3) + " ALMIGHTIES/sec"; break;
    }
    la.textContent = "Cost: " + format(player[tier + "CostAnts"]) + " " + priceType
    ti.textContent = "Owned: " + format(player[tier + "OwnedAnts"]) + " [+" + format(player[tier + "GeneratedAnts"],2) + "]"
}

function buyAnts(i) {
let sacrificeMult = Math.pow(1 + player.antSacrificePoints/5000,2)
let type = "ant"
let tier = ""
if (i == 1){type = "reincarnation";}

switch(i){
    case 1: tier = "first"; break;
    case 2: tier = "second"; break;
    case 3: tier = "third"; break;
    case 4: tier = "fourth"; break;
    case 5: tier = "fifth"; break;
    case 6: tier = "sixth"; break;
    case 7: tier = "seventh"; break;
    case 8: tier = "eighth"; break;
}
let amountBuy = 1;
while(player[type + "Points"].greaterThanOrEqualTo(player[tier + "CostAnts"]) && ticker < amountBuy){
    player[type + "Points"] = player[type + "Points"].sub(player[tier + "CostAnts"]);
    player[tier + "CostAnts"] = player[tier + "CostAnts"].times(antCostGrowth[i]);
    player[tier + "OwnedAnts"]++
    ticker++
}
ticker = 0;
calculateAntSacrificeELO();

if(sacrificeMult > 2 && player.secondOwnedAnts > 0 && player.achievements[176] == 0){achievementaward(176)}
if(sacrificeMult > 6 && player.thirdOwnedAnts > 0 && player.achievements[177] == 0){achievementaward(177)}
if(sacrificeMult > 20 && player.fourthOwnedAnts > 0 && player.achievements[178] == 0){achievementaward(178)}
if(sacrificeMult > 100 && player.fifthOwnedAnts > 0 && player.achievements[179] == 0){achievementaward(179)}
if(sacrificeMult > 500 && player.sixthOwnedAnts > 0 && player.achievements[180] == 0){achievementaward(180)}
if(sacrificeMult > 6666 && player.seventhOwnedAnts > 0 && player.achievements[181] == 0){achievementaward(181)}
if(sacrificeMult > 77777 && player.eighthOwnedAnts > 0 && player.achievements[182] == 0){achievementaward(182)}



}


function getAntCost(originalCost, buyTo, type, index){
    --buyTo

    //Determine how much the cost is for buyTo
    let cost = originalCost.times(Decimal.pow(antCostGrowth[index], buyTo));
    cost.add(1 * buyTo)

    return cost;


}


function buyAntProducers(pos,type,originalCost,index){
    let sacrificeMult = Math.pow(1 + player.antSacrificePoints/5000,2)
    //This is a fucking cool function. This will buymax ants cus why not

    //Things we need: the position of producers, the costvalues, and input var i
    originalCost = new Decimal(originalCost)
    let tag = ""

    //Initiate type of resource used
    if(index == 1){tag = "reincarnationPoints"}
    else{tag = "antPoints"}

    var buyTo = player[pos + "Owned" + type] + 1;
    var cashToBuy = getAntCost(originalCost, buyTo, type, index);
    while (player[tag].greaterThanOrEqualTo(cashToBuy)){
        // Multiply by 4 until the desired amount. Iterate from there
        buyTo = buyTo * 4;
        cashToBuy = getAntCost(originalCost, buyTo, type, index);
    }
    var stepdown = Math.floor(buyTo / 8);
    while (stepdown !== 0){
        if (getAntCost(originalCost, buyTo - stepdown, type, index).lessThanOrEqualTo(player[tag])){
        stepdown = Math.floor(stepdown/2);
        }
        else{
        buyTo = buyTo - stepdown;
        }
    }

    if (!player.antMax){
        if (1 + player[pos + "Owned" + type] < buyTo){
            buyTo = player[pos + "Owned" + type] + 1;
        }
    }
    // go down by 7 steps below the last one able to be bought and spend the cost of 25 up to the one that you started with and stop if coin goes below requirement
	var buyFrom = Math.max(buyTo - 7, player[pos + 'Owned' + type] + 1);
	var thisCost = getAntCost(originalCost, buyFrom, type, index);
	while (buyFrom <= buyTo  && player[tag].greaterThanOrEqualTo(getAntCost(originalCost, buyFrom, type, index)))
	{
			player[tag] = player[tag].sub(thisCost);
			player[pos + 'Owned' + type] = buyFrom;
			buyFrom = buyFrom + 1;
			thisCost = getAntCost(originalCost, buyFrom, type, index);
			player[pos + 'Cost' + type] = thisCost;
    }
    if(player.reincarnationPoints.lessThan(0)){player.reincarnationPoints = new Decimal("0")}
    if(player.antPoints.lessThan(0)){player.antPoints = new Decimal("0")}
    calculateAntSacrificeELO();

    if(sacrificeMult > 2 && player.secondOwnedAnts > 0 && player.achievements[176] == 0){achievementaward(176)}
    if(sacrificeMult > 6 && player.thirdOwnedAnts > 0 && player.achievements[177] == 0){achievementaward(177)}
    if(sacrificeMult > 20 && player.fourthOwnedAnts > 0 && player.achievements[178] == 0){achievementaward(178)}
    if(sacrificeMult > 100 && player.fifthOwnedAnts > 0 && player.achievements[179] == 0){achievementaward(179)}
    if(sacrificeMult > 500 && player.sixthOwnedAnts > 0 && player.achievements[180] == 0){achievementaward(180)}
    if(sacrificeMult > 6666 && player.seventhOwnedAnts > 0 && player.achievements[181] == 0){achievementaward(181)}
    if(sacrificeMult > 77777 && player.eighthOwnedAnts > 0 && player.achievements[182] == 0){achievementaward(182)}
}

function getAntUpgradeCost(originalCost, buyTo, index) {
    --buyTo
    
    let cost = originalCost.times(Decimal.pow(antUpgradeCostIncreases[index], buyTo))
    return cost;


}

function buyAntUpgrade(originalCost,auto,index){
    originalCost = new Decimal(originalCost);
    var buyTo = 1 + player.antUpgrades[index];
    var cashToBuy = getAntUpgradeCost(originalCost, buyTo, index);
    while (player.antPoints.greaterThanOrEqualTo(cashToBuy)){
        // Multiply by 4 until the desired amount. Iterate from there
        buyTo = buyTo * 4;
        cashToBuy = getAntUpgradeCost(originalCost, buyTo, index);
    }
    var stepdown = Math.floor(buyTo / 8);
    while (stepdown !== 0){
        if (getAntUpgradeCost(originalCost, buyTo - stepdown, index).lessThanOrEqualTo(player.antPoints)){
        stepdown = Math.floor(stepdown/2);
        }
        else{
        buyTo = buyTo - stepdown;
        }
    }
    if(!player.antMax){
        if(player.antUpgrades[index] + 1 < buyTo){
            buyTo = 1 + player.antUpgrades[index]
        }
    }
    // go down by 7 steps below the last one able to be bought and spend the cost of 25 up to the one that you started with and stop if coin goes below requirement
	var buyFrom = Math.max(buyTo - 7, 1 + player.antUpgrades[index]);
	var thisCost = getAntUpgradeCost(originalCost, buyFrom, index);
	while (buyFrom <= buyTo  && player.antPoints.greaterThanOrEqualTo(thisCost))
	{
			player.antPoints = player.antPoints.sub(thisCost);
			player.antUpgrades[index] = buyFrom;
            buyFrom = buyFrom + 1;
			thisCost = getAntUpgradeCost(originalCost, buyFrom, index);
    }
    calculateAnts();
    calculateRuneLevels();
    calculateAntSacrificeELO();
    if (!auto){antUpgradeDescription(index)}
    if(player.antUpgrades[12] == 1 && index == 12){revealStuff()}

}


function antUpgradeDescription(i) {
    let el = document.getElementById("antspecies")
    let la = document.getElementById("antupgradedescription")
    let ti = document.getElementById("antupgradecost")
    let me = document.getElementById("antupgradeeffect")

    let content1 = window["antspecies" + i];
    let content2 = window["antupgdesc" + i];
    let bonuslevel = window["bonusant" + i];
    document.getElementById("antspecies").childNodes[0].textContent = content1 + " Level " + format(player.antUpgrades[i])
    document.getElementById("antlevelbonus").textContent = " [+" + format(Math.min(player.antUpgrades[i],bonuslevel)) +"]"
    la.textContent = content2
    ti.textContent = "Cost: " + format(Decimal.pow(antUpgradeCostIncreases[i], player.antUpgrades[i]).times(antUpgradeBaseCost[i])) + " Galactic Crumbs"
    me.textContent = "CURRENT EFFECT: " + antUpgradeTexts[i]()
}

//function buyAntUpgrade(i,auto) {
//    if(player.antPoints.greaterThanOrEqualTo(Decimal.pow(10, antUpgradeCostIncreases[i] * player.antUpgrades[i]).times(antUpgradeBaseCost[i]))){
//        player.antPoints = player.antPoints.sub(Decimal.pow(10, antUpgradeCostIncreases[i] * player.antUpgrades[i]).times(antUpgradeBaseCost[i]));
//        player.antUpgrades[i]++
//        calculateAnts();
//        calculateRuneLevels();
//        calculateAntSacrificeELO();
        

//        if(!auto){antUpgradeDescription(i)}
//        if(player.antUpgrades[12] == 1 && i == 12){revealStuff()}
//    }
//    else{}
//}


function showSacrifice(){
    calculateAntSacrificeELO();
    let mult = 1; 
    mult *= (1 + 2 * (1 - Math.pow(2, -(player.antUpgrades[11] + bonusant11)/125)))
    mult *= (1 + player.researches[103]/50)
    mult *= (1 + player.researches[104]/50)
    if(player.achievements[132] == 1){mult *= 1.25}
    if(player.achievements[137] == 1){mult *= 1.25}
    mult *= divineBlessing3
    mult *= (1 + 1/50 * player.challengecompletions.ten)
    mult *= (1 + 1/200 * player.researches[122])
    mult *= (1 + 1/10 * player.upgrades[79])
    mult *= (1 + 0.09 * player.upgrades[40])

    let timeMultiplier = Math.min(1, Math.pow(player.antSacrificeTimer / 900, 2)) * Math.max(1, Math.pow(player.antSacrificeTimer/900, 0.92))
    document.getElementById("antSacrificeSummary").style.display = "block"

    document.getElementById("antELO").childNodes[0].textContent = "Your Ant ELO is "
    document.getElementById("ELO").textContent = format(antELO,2,)
    if(antELO >= 3500){document.getElementById("effectiveELO").textContent = "[" + format(effectiveELO,2,false) + " effective]"}

    document.getElementById("antSacrificeMultiplier").childNodes[0].textContent = "Ant Multiplier x" + format(Math.pow(1 + player.antSacrificePoints/5000, 2),3,false) + " --> "
    document.getElementById("SacrificeMultiplier").textContent = "x" + format(Math.pow(1 + (player.antSacrificePoints + effectiveELO * timeMultiplier * mult)/5000, 2),3,false)

    document.getElementById("SacrificeUpgradeMultiplier").textContent = format(mult,3,true) + "x"
    document.getElementById("SacrificeTimeMultiplier").textContent = format(timeMultiplier,3,true) + "x"
    document.getElementById("antSacrificeOffering").textContent = "+" + format(player.offeringpersecond * 60 * effectiveELO/400 * timeMultiplier * mult)
    document.getElementById("antSacrificeObtainium").textContent = "+" + format(player.maxobtainiumpersecond * 60 * effectiveELO/250 * timeMultiplier * mult)
    if (player.challengecompletions.nine > 0.5){
            document.getElementById("antSacrificeTalismanShard").textContent = "+" + format(Math.floor(mult * timeMultiplier * Math.pow(1/4 * (Math.max(0, effectiveELO - 500)), 2))) + " [>500 ELO]"
            document.getElementById("antSacrificeCommonFragment").textContent = "+" + format(Math.floor(mult * timeMultiplier * Math.pow(1/9 * (Math.max(0,effectiveELO - 750)), 1.83))) + " [>750 ELO]"
            document.getElementById("antSacrificeUncommonFragment").textContent = "+" + format(Math.floor(mult * timeMultiplier * Math.pow(1/16 * (Math.max(0,effectiveELO - 1000)), 1.66))) + " [>1,000 ELO]"
            document.getElementById("antSacrificeRareFragment").textContent = "+" + format(Math.floor(mult * timeMultiplier * Math.pow(1/25 * (Math.max(0,effectiveELO - 1500)), 1.50))) + " [>1,500 ELO]"
            document.getElementById("antSacrificeEpicFragment").textContent = "+" + format(Math.floor(mult * timeMultiplier * Math.pow(1/36 * (Math.max(0,effectiveELO - 2000)), 1.33))) + " [>2,000 ELO]"
            document.getElementById("antSacrificeLegendaryFragment").textContent = "+" + format(Math.floor(mult * timeMultiplier * Math.pow(1/49 * (Math.max(0,effectiveELO - 3000)), 1.16))) + " [>3,000 ELO]"
            document.getElementById("antSacrificeMythicalFragment").textContent = "+" + format(Math.floor(mult * timeMultiplier * Math.pow(1/64 * (Math.max(0,effectiveELO - 4150)), 1))) + " [>5,000 ELO]"

    }

}

function sacrificeAnts(auto){
    auto = auto || false
    let p = true
    let timeMultiplier = Math.min(1, Math.pow(player.antSacrificeTimer / 900, 2)) * Math.max(1, Math.pow(player.antSacrificeTimer/900, 0.92))
    let mult = 1; 
    mult *= (1 + 2 * (1 - Math.pow(2, -(player.antUpgrades[11] + bonusant11)/125)));
    mult *= (1 + player.researches[103]/50)
    mult *= (1 + player.researches[104]/50)
    if(player.achievements[132] == 1){mult *= 1.25}
    if(player.achievements[137] == 1){mult *= 1.25}
    mult *= divineBlessing3
    mult *= (1 + 1/50 * player.challengecompletions.ten)
    mult *= (1 + 1/200 * player.researches[122])
    mult *= (1 + 1/10 * player.upgrades[79])
    mult *= (1 + 0.09 * player.upgrades[40])

    if (player.antPoints.greaterThanOrEqualTo("1e40")){
    if (!auto && player.antSacrificePoints < 100){p = confirm("This resets your Crumbs, Ants and Ant Upgrades in exchange for some multiplier and resources. Continue?")}
    if (p){
        calculateAntSacrificeELO();
        player.antSacrificePoints += (effectiveELO * timeMultiplier * mult)
        player.runeshards += (player.offeringpersecond * 0.15 * effectiveELO * timeMultiplier * mult);
        player.researchPoints += (player.maxobtainiumpersecond * 0.24 * effectiveELO * timeMultiplier * mult);

        if(player.challengecompletions.nine > 0.5){
            if(antELO > 500){player.talismanShards += Math.floor((timeMultiplier * mult * Math.pow(1/4 * (effectiveELO - 500),2)))}
            if(antELO > 750){player.commonFragments += Math.floor((timeMultiplier * mult * Math.pow(1/9 * (effectiveELO - 750),1.83)))}
            if(antELO > 1000){player.uncommonFragments += Math.floor((timeMultiplier * mult * Math.pow(1/16 * (effectiveELO - 1000),1.66)))}
            if(antELO > 1500){player.rareFragments += Math.floor((timeMultiplier * mult * Math.pow(1/25 * (effectiveELO - 1500),1.5)))}
            if(antELO > 2000){player.epicFragments += Math.floor((timeMultiplier * mult * Math.pow(1/36 * (effectiveELO - 2000),1.33)))}
            if(antELO > 3000){player.legendaryFragments += Math.floor((timeMultiplier * mult * Math.pow(1/49 * (effectiveELO - 3000),1.16)))}
            if(antELO > 5000){player.mythicalFragments += Math.floor((timeMultiplier * mult * Math.pow(1/64 * (effectiveELO - 4150),1)))}
        }
        resetAnts();
        player.antSacrificeTimer = 0;
        updateTalismanInventory();
        if(player.autoResearch > 0 && player.autoResearchToggle){buyResearch(player.autoResearch,true)}
        calculateAntSacrificeELO();
    }
    }
}