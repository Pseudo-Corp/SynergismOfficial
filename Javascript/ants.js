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
    case 1: priceType = "Particles"; tier = "first"; me.textContent = "Generates " + format(antOneProduce,4) + " Crumbs/sec"; break;
    case 2: tier = "second"; me.textContent = "Generates " + format(antTwoProduce,4) + " Workers/sec"; break;
    case 3: tier = "third"; me.textContent = "Generates " + format(antThreeProduce,4) + " Breeders/sec"; break;
    case 4: tier = "fourth"; me.textContent = "Generates " + format(antFourProduce,4) + " MetaBreeders/sec"; break;
    case 5: tier = "fifth"; me.textContent = "Generates " + format(antFiveProduce,4) + " MegaBreeders/sec"; break;
    case 6: tier = "sixth"; me.textContent = "Generates " + format(antSixProduce,4) + " Queens/sec"; break;
    case 7: tier = "seventh"; me.textContent = "Generates " + format(antSevenProduce,4) + " Royals/sec"; break;
    case 8: tier = "eighth"; me.textContent = "Generates " + format(antEightProduce,4) + " ALMIGHTIES/sec"; break;
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
    console.log(player[tier + "CostAnts"])
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
    ti.textContent = "Cost: " + format(Decimal.pow(10, antUpgradeCostIncreases[i] * player.antUpgrades[i]).times(antUpgradeBaseCost[i])) + " Galactic Crumbs"
    me.textContent = "CURRENT EFFECT: " + antUpgradeTexts[i]()
}

function buyAntUpgrade(i,auto) {
    if(player.antPoints.greaterThanOrEqualTo(Decimal.pow(10, antUpgradeCostIncreases[i] * player.antUpgrades[i]).times(antUpgradeBaseCost[i]))){
        player.antPoints = player.antPoints.sub(Decimal.pow(10, antUpgradeCostIncreases[i] * player.antUpgrades[i]).times(antUpgradeBaseCost[i]));
        player.antUpgrades[i]++
        calculateAnts();
        calculateRuneLevels();
        calculateAntSacrificeELO();
        

        if(!auto){antUpgradeDescription(i)}
        if(player.antUpgrades[12] == 1 && i == 12){revealStuff()}
    }
    else{}
}


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
    mult *= (1 + 1/100 * player.researches[122])
    mult *= (1 + 1/10 * player.upgrades[79])
    mult *= (1 + 0.09 * player.upgrades[40])

    let timeMultiplier = Math.min(1, Math.pow(player.antSacrificeTimer / 900, 2)) * Math.max(1, Math.pow(player.antSacrificeTimer/900, 0.75))
    document.getElementById("antSacrificeSummary").style.display = "block"

    document.getElementById("antELO").childNodes[0].textContent = "Your Ant ELO is "
    document.getElementById("ELO").textContent = format(antELO,3,false)

    document.getElementById("antSacrificeMultiplier").childNodes[0].textContent = "Ant Multiplier x" + format(Math.pow(1 + player.antSacrificePoints/5000, 2),3,false) + " --> "
    document.getElementById("SacrificeMultiplier").textContent = "x" + format(Math.pow(1 + (player.antSacrificePoints + antELO * timeMultiplier * mult)/5000, 2),3,false)

    document.getElementById("SacrificeTimeMultiplier").textContent = format(timeMultiplier,3,false) + "x"
    document.getElementById("antSacrificeOffering").textContent = "+" + format(player.offeringpersecond * 60 * antELO/400 * timeMultiplier * mult)
    document.getElementById("antSacrificeObtainium").textContent = "+" + format(player.obtainiumpersecond * 60 * antELO/250 * timeMultiplier * mult)
    if (player.challengecompletions.nine > 0.5){
            document.getElementById("antSacrificeTalismanShard").textContent = "+" + format(Math.floor(mult * timeMultiplier * Math.pow(1/4 * (Math.max(0, antELO - 500)), 2))) + " [>500 ELO]"
            document.getElementById("antSacrificeCommonFragment").textContent = "+" + format(Math.floor(mult * timeMultiplier * Math.pow(1/9 * (Math.max(0,antELO - 750)), 1.83))) + " [>750 ELO]"
            document.getElementById("antSacrificeUncommonFragment").textContent = "+" + format(Math.floor(mult * timeMultiplier * Math.pow(1/16 * (Math.max(0,antELO - 1000)), 1.66))) + " [>1,000 ELO]"
            document.getElementById("antSacrificeRareFragment").textContent = "+" + format(Math.floor(mult * timeMultiplier * Math.pow(1/25 * (Math.max(0,antELO - 1500)), 1.50))) + " [>1,500 ELO]"
            document.getElementById("antSacrificeEpicFragment").textContent = "+" + format(Math.floor(mult * timeMultiplier * Math.pow(1/36 * (Math.max(0,antELO - 2000)), 1.33))) + " [>2,000 ELO]"
            document.getElementById("antSacrificeLegendaryFragment").textContent = "+" + format(Math.floor(mult * timeMultiplier * Math.pow(1/49 * (Math.max(0,antELO - 3000)), 1.16))) + " [>3,000 ELO]"
            document.getElementById("antSacrificeMythicalFragment").textContent = "+" + format(Math.floor(mult * timeMultiplier * Math.pow(1/64 * (Math.max(0,antELO - 5000)), 1))) + " [>5,000 ELO]"

    }

}

function sacrificeAnts(){
    let p = true
    let timeMultiplier = Math.min(1, Math.pow(player.antSacrificeTimer / 900, 2)) * Math.max(1, Math.pow(player.antSacrificeTimer/900, 0.75))
    let mult = 1; 
    mult *= (1 + 2 * (1 - Math.pow(2, -(player.antUpgrades[11] + bonusant11)/125)));
    mult *= (1 + player.researches[103]/50)
    mult *= (1 + player.researches[104]/50)
    if(player.achievements[132] == 1){mult *= 1.25}
    if(player.achievements[137] == 1){mult *= 1.25}
    mult *= divineBlessing3
    mult *= (1 + 1/50 * player.challengecompletions.ten)
    mult *= (1 + 1/100 * player.researches[122])
    mult *= (1 + 1/10 * player.upgrades[79])
    mult *= (1 + 0.09 * player.upgrades[40])

    if (player.antPoints.greaterThanOrEqualTo("1e40")){
    p = confirm("This resets your Crumbs, Ants and Ant Upgrades in exchange for some multiplier and resources. Continue?")
    if (p){
        calculateAntSacrificeELO();
        player.antSacrificePoints += (antELO * timeMultiplier * mult)
        player.runeshards += (player.offeringpersecond * 0.15 * antELO * timeMultiplier * mult);
        player.researchPoints += (player.obtainiumpersecond * 0.24 * antELO * timeMultiplier * mult);

        if(player.challengecompletions.nine > 0.5){
            if(antELO > 500){player.talismanShards += Math.floor((timeMultiplier * mult * Math.pow(1/4 * (antELO - 500),2)))}
            if(antELO > 750){player.commonFragments += Math.floor((timeMultiplier * mult * Math.pow(1/9 * (antELO - 750),1.83)))}
            if(antELO > 1000){player.uncommonFragments += Math.floor((timeMultiplier * mult * Math.pow(1/16 * (antELO - 1000),1.66)))}
            if(antELO > 1500){player.rareFragments += Math.floor((timeMultiplier * mult * Math.pow(1/25 * (antELO - 1500),1.5)))}
            if(antELO > 2000){player.epicFragments += Math.floor((timeMultiplier * mult * Math.pow(1/36 * (antELO - 2000),1.33)))}
            if(antELO > 3000){player.legendaryFragments += Math.floor((timeMultiplier * mult * Math.pow(1/49 * (antELO - 3000),1.16)))}
            if(antELO > 5000){player.mythicalFragments += Math.floor((timeMultiplier * mult * Math.pow(1/64 * (antELO - 5000),1)))}
        }
        resetAnts();
        player.antSacrificeTimer = 0;
        updateTalismanInventory();
    }
    }
}