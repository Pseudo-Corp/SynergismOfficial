function openCube(value, max) {
    max = max || false
    let toSpend = max ? player.wowCubes : Math.min(player.wowCubes, value)

    if (value === 1 && player.cubeBlessings.accelerator >= 2e11 && player.achievements[246] < 1) {
        achievementaward(246)
    }
    player.wowCubes -= toSpend
    player.cubeOpenedDaily += toSpend

    if(player.cubeQuarkDaily < 25 + 75 * player.shopUpgrades.cubeToQuarkBought){
        while(player.cubeOpenedDaily >= 10 * Math.pow(1 + player.cubeQuarkDaily, 4) && player.cubeQuarkDaily < 25 + 75 * player.shopUpgrades.cubeToQuarkBought){
            player.cubeQuarkDaily += 1;
            player.worlds += 1;
        }
    }

    toSpend *= (1 + player.researches[138] / 1000)
    toSpend *= (1 + 0.8 * player.researches[168] / 1000)
    toSpend *= (1 + 0.6 * player.researches[198] / 1000)

    toSpend = Math.floor(toSpend)
    let toSpendModulo = toSpend % 20
    let toSpendDiv20 = Math.floor(toSpend / 20)
    let blessings = {
        accelerator:   {weight: 4, pdf: (x) => 0 <= x && x <= 20},
        multiplier:    {weight: 4, pdf: (x) => 20 < x && x <= 40},
        offering:      {weight: 2, pdf: (x) => 40 < x && x <= 50},
        runeExp:       {weight: 2, pdf: (x) => 50 < x && x <= 60},
        obtainium:     {weight: 2, pdf: (x) => 60 < x && x <= 70},
        antSpeed:      {weight: 2, pdf: (x) => 70 < x && x <= 80},
        antSacrifice:  {weight: 1, pdf: (x) => 80 < x && x <= 85},
        antELO:        {weight: 1, pdf: (x) => 85 < x && x <= 90},
        talismanBonus: {weight: 1, pdf: (x) => 90 < x && x <= 95},
        globalSpeed:   {weight: 1, pdf: (x) => 95 < x && x <= 100}
    }

    if (toSpendDiv20 > 0 && player.cubeUpgrades[13] === 1) {
        toSpendModulo += toSpendDiv20
    }
    if (toSpendDiv20 > 0 && player.cubeUpgrades[23] === 1) {
        toSpendModulo += toSpendDiv20
    }
    if (toSpendDiv20 > 0 && player.cubeUpgrades[33] === 1) {
        toSpendModulo += toSpendDiv20
    }


    toSpendDiv20 += 100 / 100 * Math.floor(toSpendModulo / 20);
    toSpendModulo = toSpendModulo % 20;

//If you're opening more than 20 cubes, it will consume all cubes until remainder mod 20, giving expected values.
    for (let key of Object.keys(player.cubeBlessings)) {
        player.cubeBlessings[key] += blessings[key].weight * toSpendDiv20 * (1 + Math.floor(CalcECC('ascension', player.challengecompletions[12])));
    }

//Then, the remaining cubes will be opened, simulating the probability [RNG Element]
    for (let i = 0; i < toSpendModulo; i++) {
        let num = 100 * Math.random();
        for (let key of Object.keys(player.cubeBlessings)) {
            if (blessings[key].pdf(num))
                player.cubeBlessings[key] += (1 + Math.floor(CalcECC('ascension', player.challengecompletions[12])));
        }
    }
    calculateCubeBlessings();
}

const cubeUpgradeName = [null,
    () => "Wow! I want more Cubes.",
    () => "Wow! I want passive Offering gain too.",
    () => "Wow! I want better passive Obtainium",
    () => "Wow! I want to keep mythos building autobuyers.",
    () => "Wow! I want to keep mythos upgrade autobuyer.",
    () => "Wow! I want to keep auto mythos gain.",
    () => "Wow! I want the particle building automators.",
    () => "Wow! I want to automate Particle Upgrades.",
    () => "Wow! I want to automate researches better dangit.",
    () => "Wow! This is pretty good but expensive.",
    () => "Wow! I want more cubes 2.",
    () => "Wow! I want building power to be useful 1.",
    () => "Wow! I want opened cubes to give more blessings 1.",
    () => "Wow! I want Iris blessing bonuses to scale better 1.",
    () => "Wow! I want Ares blessing bonuses to scale better 1.",
    () => "Wow! I want more rune levels 1.",
    () => "Wow! I want just a little bit more crystal power.",
    () => "Wow! I want to accelerate time!",
    () => "Wow! I want to unlock a couple more coin upgrades.",
    () => "Wow! I want to improve automatic rune tools.",
    () => "Wow! I want more cubes 3.",
    () => "Wow! I wish my Artemis was a little better 1",
    () => "Wow! I want opened cubes to give more blessings 2.",
    () => "Wow! I want Plutus blessing bonuses to scale better 1",
    () => "Wow! I want Moloch blessing bonuses to scale better 1",
    () => "Wow! I want to start Ascensions with rune levels.",
    () => "Wow! I want to start Ascensions with one of each reincarnation building.",
    () => "Wow! I want to finally render Reincarnating obsolete.",
    () => "Wow! I want to increase maximum Reincarnation Challenge completions.",
    () => "Wow! I want to arbitrarily increase my cube and tesseract gain.",
    () => "Wow! I want more cubes 4.",
    () => "Wow! I want runes to be easier to level up over time.",
    () => "Wow! I want opened cubes to give more blessings 3.",
    () => "Wow! I want Chronus blessing bonuses to scale better 1",
    () => "Wow! I want Aphrodite blessing bonuses to scale better 1",
    () => "Wow! I want building power to be useful 2.",
    () => "Wow! I want more rune levels 2.",
    () => "Wow! I want more tesseracts while corrupted!",
    () => "Wow! I want more score from challenge 10 completions.",
    () => "Wow! I want Athena blessing bonuses to scale better 1.",
    () => "Wow! I want more cubes 5.",
    () => "Wow! I want some Uncorruptable Obtainium.",
    () => "Wow! I want even more Uncorruptable Obtainium!",
    () => "Wow! I want Midas Blessing bonus to scale better 1.",
    () => "Wow! I want Hermes Blessing bonus to scale better 1.",
    () => "Wow! I want even MORE offerings!",
    () => "Wow! I want even MORE obtainium!",
    () => "Wow! I want to start ascension with an ant.",
    () => "Wow! I want to start ascension with a challenge 6-8 completion.",
    () => "Wow! I want to be enlightened by the power of a thousand suns."
]

const cubeBaseCost = [null,
    200, 200, 200, 500, 500, 500, 500, 500, 2000, 40000,
    5000, 1000, 10000, 4000, 4000, 1e4, 4000, 1e4, 50000, 7500,
    5e4, 3e4, 3e4, 4e4, 4e4, 1e4, 1e5, 177777, 1e5, 1e6,
    5e5, 3e5, 2e6, 4e6, 4e6, 1e7, 1e6, 2e7, 5e7, 1e7,
    5e6, 1e7, 1e8, 4e7, 4e7, 5e7, 5e7, 1e8, 5e8, 5e10]

const cubeMaxLevel = [null,
    2, 10, 5, 1, 1, 1, 1, 1, 1, 1,
    2, 5, 1, 10, 10, 10, 5, 1, 1, 1,
    2, 10, 1, 10, 10, 10, 1, 1, 5, 1,
    2, 1, 1, 10, 10, 10, 10, 1, 1, 10,
    2, 10, 10, 10, 10, 20, 20, 1, 1, 100000]


const cubeUpgradeDescriptions = [null,
    () => "You got it! +10% cubes from Ascending per level.",
    () => "Plutus grants you +1 Offering per second, no matter what, per level. Also a +0.5% Recycling chance!",
    () => "Athena grants you +20% more Obtainium, and +80% Auto Obtainium per level.",
    () => "You keep those 5 useful automation upgrades in the upgrades tab!",
    () => "You keep the mythos upgrade automation upgrade in the upgrades tab!",
    () => "You keep the automatic mythos gain upgrade in the upgrades tab!",
    () => "Automatically buy each Particle Building whenever possible.",
    () => "Automatically buy Particle Upgrades.",
    () => "The research automator in shop now automatically buys cheapest when enabled. It's like a roomba kinda!",
    () => "Unlock some tools to automate Ascensions or whatever. Kinda expensive but cool.",
    () => "You got it again! +10% cubes from Ascending per level.",
    () => "Raise building power to the power of (1 + level * 0.2).",
    () => "For each 20 cubes opened at once, you get 1 additional blessing at random.",
    () => "Iris shines her light on you. The effect power is now increased by +0.01 (+0.005 if >1000 blessings) per level.",
    () => "Ares teaches you the art of war. The effect power is now increased by +0.01 (+0.0033 if >1000 blessings) per level.",
    () => "You got it buster! +20 ALL max rune levels per level.",
    () => "Yep. +5 Exponent per level to crystals.",
    () => "Quantum tunnelling ftw. +20% global game speed.",
    () => "Unlocks new coin upgrades ranging from start of ascend to post c10 and beyond.",
    () => "The rune automator in shop now spends all offerings automatically, 'splitting' them into each of the 5 runes equally.",
    () => "You got it once more! +10% cubes from Ascending per level.",
    () => "The exponent of the bonus of Artemis is increased by 0.05 per level.",
    () => "For each 20 cubes opened at once, you get 1 additional blessing at random.",
    () => "Plutus teaches you the Art of the Deal. The effect power is now increased by +0.01 (+0.0033 if >1000 blessings) per level.",
    () => "Moloch lends you a hand in communicating with Ant God. The effect power is now increased by +0.01 (+0.0033 if >1000 blessings) per level.",
    () => "Start ascensions with 3 additional rune levels [Does not decrease EXP requirement] per level.",
    () => "Upon an ascension, you will start with 1 of each reincarnation building to speed up Ascensions.",
    () => "Well, I think you got it? Gain +1% of particles on Reincarnation per second.",
    () => "Add +5 to Reincarnation Challenge cap per level. Completions after 25 scale faster in requirement!",
    () => "You now get +25% Cubes and Tesseracts forever!",
    () => "You again? +10% cubes from Ascending per level.",
    () => "Gain +0.1% Rune EXP per second you have spent in an Ascension. This has no cap!",
    () => "For each 20 cubes opened at once, you get yet another additional blessing at random.",
    () => "Chronus overclocks the universe for your personal benefit. (Rewards the same as others)",
    () => "Aphrodite increases the fertility of your coins. (Rewards the same as others)",
    () => "Raise building power to (1 + 0.05 * Level) once more.",
    () => "Adds +20 to ALL rune caps again per level.",
    () => "Gain +0.5% more tesseracts on ascension for each additional level in a corruption you enable.",
    () => "Instead of the multiplier being 1.03^(C10 completions), it is now 1.035^(C10 completions)!",
    () => "Athena is very smart (Rewards the same as others).",
    () => "Yeah yeah yeah, +10% cubes from Ascending per level. Isn't it enough?",
    () => "You now gain +4% Obtainium per level, which is not dependent on corruptions!",
    () => "Gain another +3% corruption-independent Obtainium per level.",
    () => "Blah blah blah Midas works harder (same rewards as before)",
    () => "Blah blah blah Hermes works harder (same rewards as before)",
    () => "Gain +5% more offerings per level!",
    () => "Gain +10% more obtainium per level!",
    () => "When you ascend, start with 1 worker ant (this is a lot better than it sounds!)",
    () => "When you ascend, gain 1 of each challenge 6-8 completion.",
    () => "What doesn't this boost? +0.01% Accelerators, Multipliers, Accelerator Boosts, +0.02% Obtainium, +0.02% Offerings, +0.1 Max Rune Levels, +1 Effective ELO, +0.001 Talisman bonuses per level."
]

function getCubeBuyAmount(i) {

    let amountToBuy = 0;
    if (buyMaxCubeUpgrades) {
        amountToBuy = 100 / 100 * Math.floor(player.wowCubes / cubeBaseCost[i])
    }
    if (!buyMaxCubeUpgrades) {
        amountToBuy = Math.min(1, Math.floor(player.wowCubes / cubeBaseCost[i]))
    }
    amountToBuy = Math.min(amountToBuy, cubeMaxLevel[i] - player.cubeUpgrades[i]);
    return (amountToBuy)
}

function getCubeUpgradeTotalCost(i) {
    let amountToBuy = getCubeBuyAmount(i);
    let cost = 100 / 100 * amountToBuy * cubeBaseCost[i]
    return (cost)
}

function cubeUpgradeDesc(i) {
    let a = document.getElementById("cubeUpgradeName")
    let b = document.getElementById("cubeUpgradeDescription")
    let c = document.getElementById("cubeUpgradeCost")
    let d = document.getElementById("cubeUpgradeLevel")

    a.textContent = cubeUpgradeName[i]();
    b.textContent = cubeUpgradeDescriptions[i]();
    c.textContent = "Cost: " + format(cubeBaseCost[i], 0, true) + " Wow! Cubes";
    c.style.color = "green"
    d.textContent = "Level: " + format(player.cubeUpgrades[i], 0, true) + "/" + format(cubeMaxLevel[i], 0, true);
    d.style.color = "white"

    if (player.wowCubes < cubeBaseCost[i]) {
        c.style.color = "crimson"
    }
    if (player.cubeUpgrades[i] === cubeMaxLevel[i]) {
        c.style.color = "gold";
        d.style.color = "plum"
    }

    if (buyMaxCubeUpgrades && player.wowCubes >= cubeBaseCost[i] && player.cubeUpgrades[i] !== cubeMaxLevel[i]) {
        c.textContent = "Cost: " + format(getCubeUpgradeTotalCost(i), 0, true) + " Wow Cubes! [+" + format(getCubeBuyAmount(i), 0, true) + " Levels]"
    }
}


function updateCubeUpgradeBG(i) {
    let a = document.getElementById("cubeUpg" + i)
    if (player.cubeUpgrades[i] > cubeMaxLevel[i]) {
        console.log("Refunded " + (player.cubeUpgrades[i] - cubeMaxLevel[i]) + " levels of Cube Upgrade " + i + ", adding " + (player.cubeUpgrades[i] - cubeMaxLevel[i]) * cubeBaseCost[i] + " Wow! Cubes to balance.")
        player.wowCubes += (player.cubeUpgrades[i] - cubeMaxLevel[i]) * cubeBaseCost[i]
        player.cubeUpgrades[i] = cubeMaxLevel[i]
    }
    if (player.cubeUpgrades[i] === 0) {
        a.style.backgroundColor = "black"
    }
    if (player.cubeUpgrades[i] > 0 && player.cubeUpgrades[i] < cubeMaxLevel[i]) {
        a.style.backgroundColor = "purple"
    }
    if (player.cubeUpgrades[i] === cubeMaxLevel[i]) {
        a.style.backgroundColor = "green"
    }

}

function buyCubeUpgrades(i) {
    let cost = getCubeUpgradeTotalCost(i);
    let amountToBuy = getCubeBuyAmount(i);
    player.cubeUpgrades[i] += amountToBuy;
    player.wowCubes -= 100 / 100 * (amountToBuy * cubeBaseCost[i]);

    if(i === 4 && player.cubeUpgrades[4] > 0){
        for(var j = 94; j <= 98; j++){
            player.upgrades[j] = 1;
            upgradeupdate(j, true)
        }
    }
    if(i === 5 && player.cubeUpgrades[5] > 0){
        player.upgrades[99] = 1
        upgradeupdate(99, true)
    }
    if(i === 6 && player.cubeUpgrades[6] > 0){
        player.upgrades[100] = 1
        upgradeupdate(100, true)
    }

    cubeUpgradeDesc(i);
    updateCubeUpgradeBG(i);
    revealStuff();
    calculateCubeBlessings();
}







