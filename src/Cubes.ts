import { player, format } from "./Synergism"
import { calculateCubeBlessings, calculateSummationNonLinear } from "./Calculate"
import { upgradeupdate } from "./Upgrades"
import { revealStuff } from "./UpdateHTML"
import { Globals as G } from "./Variables"
import { DOMCacheGetOrSet } from './Cache/DOM';

const cubeUpgradeName = [
    "Wow! I want more Cubes.",
    "Wow! I want passive Offering gain too.",
    "Wow! I want better passive Obtainium",
    "Wow! I want to keep mythos building autobuyers.",
    "Wow! I want to keep mythos upgrade autobuyer.",
    "Wow! I want to keep auto mythos gain.",
    "Wow! I want the particle building automators.",
    "Wow! I want to automate Particle Upgrades.",
    "Wow! I want to automate researches better dangit.",
    "Wow! This is pretty good but expensive.",
    "Wow! I want more cubes 2.",
    "Wow! I want building power to be useful 1.",
    "Wow! I want opened cubes to give more tributes 1.",
    "Wow! I want Iris Tribute bonuses to scale better 1.",
    "Wow! I want Ares Tribute bonuses to scale better 1.",
    "Wow! I want more rune levels 1.",
    "Wow! I want just a little bit more crystal power.",
    "Wow! I want to accelerate time!",
    "Wow! I want to unlock a couple more coin upgrades.",
    "Wow! I want to improve automatic rune tools.",
    "Wow! I want more cubes 3.",
    "Wow! I wish my Artemis was a little better 1",
    "Wow! I want opened cubes to give more tributes 2.",
    "Wow! I want Plutus Tribute bonuses to scale better 1",
    "Wow! I want Moloch Tribute bonuses to scale better 1",
    "Wow! I want to start Ascensions with rune levels.",
    "Wow! I want to start Ascensions with one of each reincarnation building.",
    "Wow! I want to finally render Reincarnating obsolete.",
    "Wow! I want to increase maximum Reincarnation Challenge completions.",
    "Wow! I want to arbitrarily increase my cube and tesseract gain.",
    "Wow! I want more cubes 4.",
    "Wow! I want runes to be easier to level up over time.",
    "Wow! I want opened cubes to give more tributes 3.",
    "Wow! I want Chronos Tribute bonuses to scale better 1",
    "Wow! I want Aphrodite Tribute bonuses to scale better 1",
    "Wow! I want building power to be useful 2.",
    "Wow! I want more rune levels 2.",
    "Wow! I want more tesseracts while corrupted!",
    "Wow! I want more score from challenge 10 completions.",
    "Wow! I want Athena Tribute bonuses to scale better 1.",
    "Wow! I want more cubes 5.",
    "Wow! I want some Uncorruptable Obtainium.",
    "Wow! I want even more Uncorruptable Obtainium!",
    "Wow! I want Midas Tribute bonus to scale better 1.",
    "Wow! I want Hermes Tribute bonus to scale better 1.",
    "Wow! I want even MORE offerings!",
    "Wow! I want even MORE obtainium!",
    "Wow! I want to start ascension with an ant.",
    "Wow! I want to start ascension with a challenge 6-8 completion.",
    "Wow! I want to be enlightened by the power of a thousand suns."
]

const cubeBaseCost = [
    200, 200, 200, 500, 500, 500, 500, 500, 2000, 40000,
    5000, 1000, 10000, 20000, 40000, 10000, 4000, 1e4, 50000, 12500,
    5e4, 3e4, 3e4, 4e4, 2e5, 4e5, 1e5, 177777, 1e5, 1e6,
    5e5, 3e5, 2e6, 4e6, 2e6, 4e6, 1e6, 2e7, 5e7, 1e7,
    5e6, 1e7, 1e8, 4e7, 2e7, 4e7, 5e7, 1e8, 5e8, 1e8
];

export const cubeMaxLevel = [
    3, 10, 5, 1, 1, 1, 1, 1, 1, 1,
    3, 10, 1, 10, 10, 10, 5, 1, 1, 1,
    2, 10, 1, 10, 10, 10, 1, 1, 5, 1,
    2, 1, 1, 10, 10, 10, 10, 1, 1, 10,
    2, 10, 10, 10, 10, 20, 20, 1, 1, 100000
];

const cubeUpgradeDescriptions = [
    "[1x1] You got it! +14% cubes from Ascending per level.",
    "[1x2] Plutus grants you +1 Offering per second, no matter what, per level. Also a +0.5% Recycling chance!",
    "[1x3] Athena grants you +10% more Obtainium, and +80% Auto Obtainium per level.",
    "[1x4] You keep those 5 useful automation upgrades in the upgrades tab!",
    "[1x5] You keep the mythos upgrade automation upgrade in the upgrades tab!",
    "[1x6] You keep the automatic mythos gain upgrade in the upgrades tab!",
    "[1x7] Automatically buy each Particle Building whenever possible.",
    "[1x8] Automatically buy Particle Upgrades.",
    "[1x9] The research automator in shop now automatically buys cheapest when enabled. It's like a roomba kinda!",
    "[1x10] Unlock some tools to automate Ascensions or whatever. Kinda expensive but cool.",
    "[2x1] You got it again! +7% cubes from Ascending per level.",
    "[2x2] Raise building power to the power of (1 + level * 0.09).",
    "[2x3] For each 20 cubes opened at once, you get 1 additional tribute at random.",
    "[2x4] Iris shines her light on you. The effect power is now increased by +0.01 (+0.005 if >1000 tributes) per level.",
    "[2x5] Ares teaches you the art of war. The effect power is now increased by +0.01 (+0.0033 if >1000 tributes) per level.",
    "[2x6] You got it buster! +20 ALL max rune levels per level.",
    "[2x7] Yep. +5 Exponent per level to crystals.",
    "[2x8] Quantum tunnelling ftw. +20% global game speed.",
    "[2x9] Unlocks new coin upgrades ranging from start of ascend to post c10 and beyond.",
    "[2x10] The rune automator in shop now spends all offerings automatically, 'splitting' them into each of the 5 runes equally.",
    "[3x1] You got it once more! +7% cubes from Ascending per level.",
    "[3x2] The exponent of the bonus of Artemis is increased by 0.05 per level.",
    "[3x3] For each 20 cubes opened at once, you get 1 additional tribute at random.",
    "[3x4] Plutus teaches you the Art of the Deal. The effect power is now increased by +0.01 (+0.0033 if >1000 tributes) per level.",
    "[3x5] Moloch lends you a hand in communicating with Ant God. The effect power is now increased by +0.01 (+0.0033 if >1000 tributes) per level.",
    "[3x6] Start ascensions with 3 additional rune levels [Does not decrease EXP requirement] per level.",
    "[3x7] Upon an ascension, you will start with 1 of each reincarnation building to speed up Ascensions.",
    "[3x8] Well, I think you got it? Gain +1% of particles on Reincarnation per second.",
    "[3x9] Add +4 to Reincarnation Challenge cap per level. Completions after 25 scale faster in requirement!",
    "[3x10] You now get +25% Cubes and Tesseracts forever!",
    "[4x1] You again? +7% cubes from Ascending per level.",
    "[4x2] Gain +0.1% Rune EXP per second you have spent in an Ascension. This has no cap!",
    "[4x3] For each 20 cubes opened at once, you get yet another additional tribute at random.",
    "[4x4] Chronos overclocks the universe for your personal benefit. (Rewards the same as others)",
    "[4x5] Aphrodite increases the fertility of your coins. (Rewards the same as others)",
    "[4x6] Raise building power to (1 + 0.05 * Level) once more.",
    "[4x7] Adds +20 to ALL rune caps again per level.",
    "[4x8] Gain +0.5% more tesseracts on ascension for each additional level in a corruption you enable.",
    "[4x9] Instead of the multiplier being 1.03^(C10 completions), it is now 1.035^(C10 completions)!",
    "[4x10] Athena is very smart (Rewards the same as others).",
    "[5x1] Yeah yeah yeah, +7% cubes from Ascending per level. Isn't it enough?",
    "[5x2] You now gain +4% Obtainium per level, which is not dependent on corruptions!",
    "[5x3] Gain another +3% corruption-independent Obtainium per level.",
    "[5x4] Blah blah blah Midas works harder (same rewards as before)",
    "[5x5] Blah blah blah Hermes works harder (same rewards as before)",
    "[5x6] Gain +5% more offerings per level!",
    "[5x7] Gain +10% more obtainium per level!",
    "[5x8] When you ascend, start with 1 worker ant (this is a lot better than it sounds!)",
    "[5x9] When you ascend, gain 1 of each challenge 6-8 completion.",
    "[5x10] What doesn't this boost? +0.01% Accelerators, Multipliers, Accelerator Boosts, +0.02% Obtainium, +0.02% Offerings, +0.04 Max Rune Levels, +1 Effective ELO, +0.0004 Talisman bonuses per level, 0.00066% Tax reduction per level."
]

const getCubeCost = (i: number, linGrowth = 0) => {
    let amountToBuy = G['buyMaxCubeUpgrades'] ? 1e5: 1;
    amountToBuy = Math.min(cubeMaxLevel[i-1] - player.cubeUpgrades[i], amountToBuy)
    const metaData = calculateSummationNonLinear(player.cubeUpgrades[i], cubeBaseCost[i-1] * (1 + player.singularityCount), Number(player.wowCubes), linGrowth, amountToBuy)
    return([metaData[0],metaData[1]]) //metaData[0] is the levelup amount, metaData[1] is the total cube cost
}

export const cubeUpgradeDesc = (i: number, linGrowth = 0) => {
    const metaData = getCubeCost(i,linGrowth)
    const a = DOMCacheGetOrSet("cubeUpgradeName")
    const b = DOMCacheGetOrSet("cubeUpgradeDescription")
    const c = DOMCacheGetOrSet("cubeUpgradeCost")
    const d = DOMCacheGetOrSet("cubeUpgradeLevel")

    a.textContent = cubeUpgradeName[i - 1];
    b.textContent = cubeUpgradeDescriptions[i - 1];
    c.textContent = "Cost: " + format(metaData[1], 0, true) + " Wow! Cubes [+" + format(metaData[0]-player.cubeUpgrades[i],0,true) + " Levels]";
    c.style.color = "green"
    d.textContent = "Level: " + format(player.cubeUpgrades[i], 0, true) + "/" + format(cubeMaxLevel[i-1], 0, true);
    d.style.color = "white"

    if (Number(player.wowCubes) < cubeBaseCost[i-1]) {
        c.style.color = "crimson"
    }
    if (player.cubeUpgrades[i] === cubeMaxLevel[i-1]) {
        c.style.color = "gold";
        d.style.color = "plum"
    }
}

export const updateCubeUpgradeBG = (i: number) => {
    const a = DOMCacheGetOrSet("cubeUpg" + i)
    if (player.cubeUpgrades[i] > cubeMaxLevel[i-1]) {
        console.log("Refunded " + (player.cubeUpgrades[i] - cubeMaxLevel[i-1]) + " levels of Cube Upgrade " + i + ", adding " + (player.cubeUpgrades[i] - cubeMaxLevel[i-1]) * cubeBaseCost[i-1] + " Wow! Cubes to balance.")
        player.wowCubes.add((player.cubeUpgrades[i] - cubeMaxLevel[i-1]) * cubeBaseCost[i-1]);
        player.cubeUpgrades[i] = cubeMaxLevel[i-1]
    }
    if (player.cubeUpgrades[i] === 0) {
        a.style.backgroundColor = "black"
    }
    if (player.cubeUpgrades[i] > 0 && player.cubeUpgrades[i] < cubeMaxLevel[i-1]) {
        a.style.backgroundColor = "purple"
    }
    if (player.cubeUpgrades[i] === cubeMaxLevel[i-1]) {
        a.style.backgroundColor = "green"
    }

}

export const buyCubeUpgrades = (i: number, linGrowth = 0) => {
    const metaData = getCubeCost(i,linGrowth);
    if(Number(player.wowCubes) >= metaData[1] && player.cubeUpgrades[i] < cubeMaxLevel[i-1]){
        player.wowCubes.sub(100 / 100 * metaData[1]);
        player.cubeUpgrades[i] = metaData[0];
    }

    if(i === 4 && player.cubeUpgrades[4] > 0){
        for(let j = 94; j <= 98; j++){
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

    cubeUpgradeDesc(i, linGrowth);
    updateCubeUpgradeBG(i);
    revealStuff();
    calculateCubeBlessings();
}
