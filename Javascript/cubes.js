function openCube(value,max){
max = max || false
let num = 0;
let toSpend = Math.min(player.wowCubes, value)
if(max){toSpend = player.wowCubes}

player.wowCubes -= toSpend

let toSpendModulo = toSpend % 20
let toSpendDiv20 = Math.floor(toSpend / 20)

let upgrade13 = 0;

if(toSpendDiv20 > 0 && player.cubeUpgrades[13] == 1){toSpendModulo += toSpendDiv20}
if(toSpendDiv20 > 0 && player.cubeUpgrades[23] == 1){toSpendModulo += toSpendDiv20}
if(toSpendDiv20 > 0 && player.cubeUpgrades[33] == 1){toSpendModulo += toSpendDiv20}

toSpendDiv20 += 100/100 * Math.floor(toSpendModulo/20);
toSpendModulo = toSpendModulo % 20;


//If you're opening more than 20 cubes, it will consume all cubes until remainder mod 20, giving expected values.
    player.cubeBlessings.accelerator += 4 * toSpendDiv20 * (1 + player.cubeUpgrades[30]);
    player.cubeBlessings.multiplier += 4 * toSpendDiv20 * (1 + player.cubeUpgrades[30]);
    player.cubeBlessings.offering += 2 * toSpendDiv20 * (1 + player.cubeUpgrades[30]);
    player.cubeBlessings.runeExp += 2 * toSpendDiv20 * (1 + player.cubeUpgrades[30]);
    player.cubeBlessings.obtainium += 2 * toSpendDiv20 * (1 + player.cubeUpgrades[30]);
    player.cubeBlessings.antSpeed += 2 * toSpendDiv20 * (1 + player.cubeUpgrades[30]);
    player.cubeBlessings.antSacrifice += toSpendDiv20 * (1 + player.cubeUpgrades[30]);
    player.cubeBlessings.antELO += toSpendDiv20 * (1 + player.cubeUpgrades[30]);
    player.cubeBlessings.talismanBonus += toSpendDiv20 * (1 + player.cubeUpgrades[30]);
    player.cubeBlessings.globalSpeed += toSpendDiv20 * (1 + player.cubeUpgrades[30]);
//Then, the remaining cubes will be opened, simulating the probability [RNG Element]
    for (var i = 1; i <= toSpendModulo; i++){
        num = 100 * Math.random();
        if(num >= 95){player.cubeBlessings.globalSpeed += 1 * (1 + player.cubeUpgrades[30])}
        else if(num >= 90){player.cubeBlessings.talismanBonus += 1 * (1 + player.cubeUpgrades[30])}
        else if(num >= 85){player.cubeBlessings.antELO += 1 * (1 + player.cubeUpgrades[30])}
        else if(num >= 80){player.cubeBlessings.antSacrifice += 1 * (1 + player.cubeUpgrades[30])}
        else if(num >= 70){player.cubeBlessings.antSpeed += 1 * (1 + player.cubeUpgrades[30])}
        else if(num >= 60){player.cubeBlessings.obtainium += 1 * (1 + player.cubeUpgrades[30])}
        else if(num >= 50){player.cubeBlessings.runeExp += 1 * (1 + player.cubeUpgrades[30])}
        else if(num >= 40){player.cubeBlessings.offering += 1 * (1 + player.cubeUpgrades[30])}
        else if(num >= 20){player.cubeBlessings.multiplier += 1 * (1 + player.cubeUpgrades[30])}
        else{player.cubeBlessings.accelerator += 1 * (1 + player.cubeUpgrades[30])}
    }
    calculateCubeBlessings();
}       

const cubeUpgradeName = [null,
function(){return "Wow! I want more Cubes."},
function(){return "Wow! I want passive Offering gain too."},
function(){return "Wow! I want better passive Obtainium"},
function(){return "Wow! I want to keep mythos building autobuyers."},
function(){return "Wow! I want to keep mythos upgrade autobuyer."},
function(){return "Wow! I want to keep auto mythos gain."},
function(){return "Wow! I want the first two particle building automators."},
function(){return "Wow! I want the next two particle building automators."},
function(){return "Wow! I want the last particle building automator."},
function(){return "Wow! I want to improve automatic research tools."},
function(){return "Wow! I want more cubes 2."},
function(){return "Wow! I want building power to be useful 1."},
function(){return "Wow! I want opened cubes to give more blessings 1."},
function(){return "Wow! I want Iris blessing bonuses to scale better 1."},
function(){return "Wow! I want Ares blessing bonuses to scale better 1."},
function(){return "Wow! I want more rune levels 1."},
function(){return "Wow! I want just a little bit more crystal power."},
function(){return "Wow! I want to accelerate time!"},
function(){return "Wow! I want to unlock a couple more coin upgrades."},
function(){return "Wow! I want to improve automatic rune tools."},
function(){return "Wow! I want more cubes 3."},
function(){return "Wow! I wish Corruptions boosted by ants(?)"},
function(){return "Wow! I want opened cubes to give more blessings 2."},
function(){return "Wow! I want Plutus blessing bonuses to scale better 1"},
function(){return "Wow! I want Moloch blessing bonuses to scale better 1"},
function(){return "Wow! I want to start Ascensions with rune levels."},
function(){return "Wow! I want to start Ascensions with one of each reincarnation building."},
function(){return "Wow! I want finally render Reincarnating obsolete."},
function(){return "Wow! I want to increase maximum Reincarnation Challenge completions."},
function(){return "Wow! I want to gain +1 blessing per wow cube opened..."},
function(){return "Wow! I want more cubes 4."},
function(){return "Wow! I want runes to be easier to level up over time."},
function(){return "Wow! I want opened cubes to give more blessings 3."},
function(){return "Wow! I want Chronus blessing bonuses to scale better 1"},
function(){return "Wow! I want Aphrodite blessing bonuses to scale better 1"},
function(){return "Wow! I want building power to be useful 2."},
function(){return "Wow! I want more rune levels 2."},
function(){return "Wow! I want more cubes in challenges during corruption."},
function(){return "Wow! I want more cubes in challenges during ascension challenge."},
function(){return "Wow! I want to automatically open cubes faster 1."},
function(){return "Wow! I want more cubes 5."},
function(){return "Wow! I want to keep Research 3x15 and 1x16."},
function(){return "Wow! I want to keep Research 2x16."},
function(){return "Wow! I want Midas Blessing bonus to scale better 1."},
function(){return "Wow! I want Hermes Blessing bonus to scale better 1."},
function(){return "Wow! I want reincarnations to start with a few extra seconds."},
function(){return "Wow! I want even MORE obtainium!"},
function(){return "Wow! I want to start ascension with an ant."},
function(){return "Wow! I want to start ascension with a challenge 6-8 completion."},
function(){return "Wow! I want to automate Ascensions you stupid developer"}]

const cubeBaseCost = [null,
    500, 500, 500, 1000, 1000, 1500, 500, 1000, 1500, 2500,
    5000, 3000, 10000, 4000, 4000, 1e4, 4000, 1e4, 50000, 7500,
    5e4, 3e4, 3e4, 4e4, 4e4, 1e4, 1e5, 177777, 1e5, 5e5,
    5e5, 3e5, 3e5, 4e5, 4e5, 2e5, 5e5, 1e6, 1e6, 5e6,
    5e6, 1e6, 1e6, 4e6, 4e6, 5e5, 2e6, 2e7, 3e7, 5e7] 

const cubeMaxLevel = [null,
    2, 10, 5, 1, 1, 1, 1, 1, 1, 1,
    3, 5, 1, 10, 10, 10, 5, 1, 1, 1,
    4, 10, 1, 10, 10, 10, 1, 1, 5, 1,
    5, 1, 1, 10, 10, 5, 10, 3, 3, 1,
    6, 50, 50, 10, 10, 20, 20, 1, 1, 1]

const cubeUpgradeDescriptions = [null,
function(){return "You got it! +1 cube from challenges, +10% cubes from Ascending."},
function(){return "Plutus grants you +1 Offering per second, no matter what, per level. Also a +0.5% Recycling chance!"},
function(){return "Athena grants you +20% more Obtainium, and +80% Auto Obtainium per level."},
function(){return "You keep those 5 useful automation upgrades in the upgrade tab!"},
function(){return "You keep the mythos upgrade automation upgrade in the upgrade tab!"},
function(){return "You keep the automatic mythos gain upgrade in the upgrad tab!"},
function(){return "Automatically buy Protons and Elements whenever possible."},
function(){return "Automatically buy Pulsars and Quasars whenever possible."},
function(){return "Automatically buy Galactic Nuclei whenever possible."},
function(){return "The research automator in shop now automatically buys cheapest when enabled. It's like a roomba kinda!"},
function(){return "You got it again! +1 cube from challenges, +10% cubes from Ascending."},
function(){return "Raise building power to the power of (1 + level * 0.2)."},
function(){return "For each 20 cubes opened at once, you get 1 additional blessing at random."},
function(){return "Iris shines her light on you. The effect power is now increased by +0.01 (+0.005 if >1000 blessings) per level."},
function(){return "Ares teaches you the art of war. The effect power is now increased by +0.01 (+0.0033 if >1000 blessings) per level."},
function(){return "You got it buster! +10 ALL max rune levels per level."},
function(){return "Yep. +5 Exponent per level to crystals."},
function(){return "Quantum tunnelling ftw. +20% global game speed."},
function(){return "Unlocks new coin upgrades ranging from start of ascend to post c10 and beyond. [NOT IMPLEMENTED YET]"},
function(){return "The rune automator in shop now spends all offerings automatically, 'splitting' them into each of the 5 runes equally."},
function(){return "You got it once more! +1 cube from challenges, +10% cubes from Ascending."},
function(){return "Lol Platonic is bad and hasn't made this yet"},
function(){return "For each 20 cubes opened at once, you get 1 additional blessing at random."},
function(){return "Plutus teaches you the Art of the Deal. The effect power is now increased by +0.01 (+0.0033 if >1000 blessings) per level."},
function(){return "Moloch lends you a hand in communicating with Ant God. The effect power is now increased by +0.01 (+0.0033 if >1000 blessings) per level."},
function(){return "Start ascensions with 3 additional rune levels [Does not decrease EXP requirement] per level."},
function(){return "Upon an ascension, you will start with 1 of each reincarnation building to speed up Ascensions."},
function(){return "Well, I think you got it? Gain +1% of particles on Reincarnation per second."},
function(){return "Add +1 to Reincarnation Challenge cap per level."},
function(){return "Whenever you open a cube, Aphrodite grazes it with a secondary blessing."},
function(){return "You again? +1 cube from challenges, +10% cubes from Ascending."},
function(){return "Gain +0.1% Rune EXP per second you have spent in an Ascension. This has no cap!"},
function(){return "For each 20 cubes opened at once, you get yet another additional blessing at random."},
function(){return "Chronus overclocks the universe for your personal benefit. (Rewards the same as others)"},
function(){return "Aphrodite increases the fertility of your coins. (Rewards the same as others)"},
function(){return "Raise building power to (1 + 0.2 * Level) once more."},
function(){return "Adds +10 to ALL rune caps again per level."},
function(){return "If you get at least 5,000 Ascend Points, then you will gain +1 cube in challenge per level."},
function(){return "If you are in a challenge, then you will gain +1 cube in lower challenges per level."},
function(){return "If you have purchased the shop upgrade to automatically open cubes, it will now open 200 at a time instead of 20."},
function(){return "Yeah yeah yeah, +1 cube from challenges, +10% cubes from Ascending."},
function(){return "Keep 2% of the levels per level."},
function(){return "Keep 2% of the levels per level."},
function(){return "Blah blah blah Midas works harder (same rewards as before)"},
function(){return "Blah blah blah Hermes works harder (same rewards as before)"},
function(){return "All reincarnations start out with 3 additional seconds per level."},
function(){return "Gain +10% more obtainium per level!"},
function(){return "When you ascend, start with 1 worker ant (this is a lot better than it sounds!)"},
function(){return "When you ascend, gain 1 of each challenge 6-8 completion, with +15 cubes to compensate."},
function(){return "Unlocks the tool which lets you auto ascend."}]

function getCubeBuyAmount(i){
    let amountToBuy = 0;
    if (buyMaxCubeUpgrades){amountToBuy = 100/100 * Math.floor(player.wowCubes / cubeBaseCost[i])};
    if (!buyMaxCubeUpgrades){amountToBuy = Math.min(1, Math.floor(player.wowCubes/ cubeBaseCost[i]))};
    amountToBuy = Math.min(amountToBuy,  cubeMaxLevel[i] - player.cubeUpgrades[i]);
    return(amountToBuy)
}
function getCubeUpgradeTotalCost(i){
    let amountToBuy = getCubeBuyAmount(i);
    let cost = 100/100 * amountToBuy * cubeBaseCost[i]
    return(cost)
}

function cubeUpgradeDesc(i){
    let a = document.getElementById("cubeUpgradeName")
    let b = document.getElementById("cubeUpgradeDescription")
    let c = document.getElementById("cubeUpgradeCost")
    let d = document.getElementById("cubeUpgradeLevel")

    a.textContent = cubeUpgradeName[i]();
    b.textContent = cubeUpgradeDescriptions[i]();
    c.textContent = "Cost: " + format(cubeBaseCost[i],0,true) + " Wow! Cubes"; c.style.color = "green"
    d.textContent = "Level: " + player.cubeUpgrades[i] + "/" + cubeMaxLevel[i]; d.style.color = "white"

    if(player.wowCubes < cubeBaseCost[i]){c.style.color = "crimson"}
    if(player.cubeUpgrades[i] === cubeMaxLevel[i]){c.style.color = "gold"; d.style.color = "plum"}

    if(buyMaxCubeUpgrades && player.wowCubes >= cubeBaseCost[i] && player.cubeUpgrades[i] !== cubeMaxLevel[i]){c.textContent = "Cost: " + format(getCubeUpgradeTotalCost(i),0,true) + " Wow Cubes! [+" + format(getCubeBuyAmount(i),0,true) + " Levels]"}
}



function updateCubeUpgradeBG(i){
    let a = document.getElementById("cubeUpg"+i)
    if(player.cubeUpgrades[i] > cubeMaxLevel[i]){
        console.log("Refunded " + (player.cubeUpgrades[i] - cubeMaxLevel[i]) + " levels of Cube Upgrade " + i + ", adding " + (player.cubeUpgrades[i] - cubeMaxLevel[i]) * cubeBaseCost[i] + " Wow! Cubes to balance.")
        player.wowCubes += (player.cubeUpgrades[i] - cubeMaxLevel[i]) * cubeBaseCost[i]
        player.cubeUpgrades[i] = cubeMaxLevel[i]
    }
    if(player.cubeUpgrades[i] === 0){a.style.backgroundColor = "black"}
    if(player.cubeUpgrades[i] > 0 && player.cubeUpgrades[i] < cubeMaxLevel[i]){a.style.backgroundColor = "purple"}
    if(player.cubeUpgrades[i] === cubeMaxLevel[i]){a.style.backgroundColor = "green"}

}

function buyCubeUpgrades(i){
    let cost = getCubeUpgradeTotalCost(i);
    let amountToBuy = getCubeBuyAmount(i);
    player.cubeUpgrades[i] += amountToBuy;
    player.wowCubes -= 100/100 * (amountToBuy * cubeBaseCost[i]); 

    cubeUpgradeDesc(i);
    updateCubeUpgradeBG(i);
    revealStuff();
    calculateCubeBlessings();
}







