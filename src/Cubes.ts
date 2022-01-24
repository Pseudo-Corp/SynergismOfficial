import { player, format } from "./Synergism"
import { calculateCubeBlessings, calculateCubicSumData, calculateSummationNonLinear } from "./Calculate"
import { upgradeupdate } from "./Upgrades"
import { revealStuff } from "./UpdateHTML"
import { Globals as G } from "./Variables"
import { DOMCacheGetOrSet } from './Cache/DOM';
import { updateResearchBG } from "./Research"

export interface IMultiBuy {
    levelCanBuy: number
    cost: number
}

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
    "Wow! I want to be enlightened by the power of a thousand suns.",
    "Wow! A pile of Chocolate Chip Cookies.",
    "Wow! A pile of Sugar Cookies.",
    "Wow! A pile of Butter Cookies.",
    "Wow! A pile of Vanilla Wafers.",
    "Wow! A pile of White Chocolate Cookies.",
    "Wow! A bag of Snickerdoodles.",
    "Wow! A bag of Macarons.",
    "Wow! A bag of Gingerbread Cookies.",
    "Wow! A bag of Lemon Cookies.",
    "Wow! A bag of Ginger Snaps.",
    "Wow! A tin of Whoopie Pies.",
    "Wow! A tin of Toffee Bars.",
    "Wow! A tin of Brownie Cookies.",
    "Wow! A tin of Fortune Cookies.",
    "Wow! A tin of Biscotti.",
    "Wow! A box of Mother's Favorite Cookies.",
    "Wow! A box of Metaphysical Brownies.",
    "Wow! A box of Not Cookies.",
    "Wow! A box of Cookies Beyond This World.",
    "Wow! A box of Perfect Cookies."
]

const cubeAutomationIndices = [4, 5, 6, 7, 8, 9, 10, // row 1 
                           20,                   // row 2
                           26, 27,               // row 3
                           48, 49]               // row 5

const researchAutomationIndices = [41, 42, 43, 44, 45, 46, 47, 48, 49, 50, // row 2
                                   61, 71, 72, 73, 74, 75, // row 3
                                   124,                    // row 5
                                   130, 135, 145, 150,     // row 6
                                   175,                    // row 7
                                   190]                    // row 8

const cubeBaseCost = [
    200, 200, 200, 500, 500, 500, 500, 500, 2000, 40000,
    5000, 1000, 10000, 20000, 40000, 10000, 4000, 1e4, 50000, 12500,
    5e4, 3e4, 3e4, 4e4, 2e5, 4e5, 1e5, 177777, 1e5, 1e6,
    5e5, 3e5, 2e6, 4e6, 2e6, 4e6, 1e6, 2e7, 5e7, 1e7,
    5e6, 1e7, 1e8, 4e7, 2e7, 4e7, 5e7, 1e8, 5e8, 1e8,
    1, 1e4, 1e8, 1e12, 1e16, 10, 1e5, 1e9, 1e13, 1e17,
    1e2, 1e6, 1e10, 1e14, 1e18, 1e20, 1e30, 1e40, 1e50, 1e60
];

export const cubeMaxLevel = [
    3, 10, 5, 1, 1, 1, 1, 1, 1, 1,
    3, 10, 1, 10, 10, 10, 5, 1, 1, 1,
    2, 10, 1, 10, 10, 10, 1, 1, 5, 1,
    2, 1, 1, 10, 10, 10, 10, 1, 1, 10,
    2, 10, 10, 10, 10, 20, 20, 1, 1, 100000,
    1, 900, 100, 900, 900, 20, 1, 1, 400, 10000,
    900, 1, 1, 1, 1, 1, 1, 1000, 1, 975
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
    "[5x10] What doesn't this boost? +0.01% Accelerators, Multipliers, Accelerator Boosts, +0.02% Obtainium, +0.02% Offerings, +0.04 Max Rune Levels, +1 Effective ELO, +0.0004 Talisman bonuses per level, 0.00066% Tax reduction per level.",
    "[Cx1] Wow! Bakery is open!!! Immediately unlock all automations in the cube tab, and researches as well.",
    "[Cx2] These sugar cookies sure boost your blood sugar. Gain +1% global speed per level.",
    "[Cx3] What a hearty snack. Gain +0.1% Quarks per level.",
    "[Cx4] Pretty dry, but they suffice. Increase offering gain by 1% per level.",
    "[Cx5] An inventive take on the original chip cookie. Increase obtainium gain by 1% per level.",
    "[Cx6] These are a little more exotic. Gain +1 more raw score from Challenge 1 completions per level.",
    "[Cx7] Yum yum! Now we're talking... or maybe not. Increase the cap of Cube Upgrades 1x1, 2x1, 3x1, 4x1, 5x1 by 1.",
    "[Cx8] A bit festive! If there is an event, All Cube gain is multiplied by 1.25.",
    "[Cx9] Quite sour for a cookie. But it increases your ascension speed by 0.25% per level, so who is to complain?",
    "[Cx10] Wow! Bakery had extra ginger from their christmas sale. Reduce the cost of buying Golden Quarks by 1 Quark per level.",
    "[Cx11] Edible but prone to mistakes. Adds five whole milliseconds to the tolerance of code 'time'.",
    "[Cx12] Platonic loves toffee. Triple Obtainium and Offering gain in Challenge 15.",
    "[Cx13] Brownie Cookies, the best of both worlds. Increase Regular Cube Gain by 1% based on owned Hepteracts (+3% per OOM).",
    "[Cx14] Some say the ant god itself penned these fortunes. When you gain a statue from Platonic Cubes, you gain two instead.",
    "[Cx15] That's amore, but is quite a crumbful! Increase ant efficiency by 0.4%. (Roughly every 200 ants purchased doubles crumb production!)",
    "[Cx16] You just wish you could have one more cookie baked by her. Gain 2x all cubes until you purchase OMEGA.",
    "[Cx17] What the hell are in these??? Anyway, Metaphysics Talisman level cap is increased by 1,337.",
    "[Cx18] What the heck! These aren't even cookies. +0.02% Quarks per level purchased of this upgrade. +30% more at level 1,000!",
    "[Cx19] Cookies that you'll never remember again. +12% Golden Quarks this singularity.",
    "[Cx20] The pinnacle of baking. Nothing you'll eat will taste better than this. Gain +4% more cubes on ascension if you have challenge 10 completions capped."
]

const getCubeCost = (i: number, linGrowth = 0, cubic = false): IMultiBuy => {
    const maxLevel = getCubeMax(i)
    let amountToBuy = G['buyMaxCubeUpgrades'] ? 1e5: 1;
    const cubeUpgrade = player.cubeUpgrades[i]!;
    amountToBuy = Math.min(maxLevel - cubeUpgrade, amountToBuy)
    const singularityMultiplier = (i <= 50) ? (1 + player.singularityCount): 1;

    let metaData:IMultiBuy

    if (cubic) {
        // TODO: Fix this inconsistency later.
        amountToBuy = G['buyMaxCubeUpgrades'] ? maxLevel: Math.min(maxLevel, cubeUpgrade + 1)
        metaData = calculateCubicSumData(cubeUpgrade, cubeBaseCost[i-1],
                                         Number(player.wowCubes), amountToBuy)
    }
    else
        metaData = calculateSummationNonLinear(cubeUpgrade,
                                              cubeBaseCost[i-1] * singularityMultiplier,
                                               Number(player.wowCubes), linGrowth, amountToBuy)

    return metaData
}

const getCubeMax = (i: number) => {
    let baseValue = cubeMaxLevel[i-1];

    if (player.cubeUpgrades[57] > 0 && i < 50 && i % 10 === 1) {
        baseValue += 1;
    }

    return baseValue
}

export const cubeUpgradeDesc = (i: number, linGrowth = 0, cubic = false) => {
    const metaData = getCubeCost(i, linGrowth, cubic)
    const a = DOMCacheGetOrSet("cubeUpgradeName")
    const b = DOMCacheGetOrSet("cubeUpgradeDescription")
    const c = DOMCacheGetOrSet("cubeUpgradeCost")
    const d = DOMCacheGetOrSet("cubeUpgradeLevel")
    const maxLevel = getCubeMax(i);

    a.textContent = cubeUpgradeName[i - 1];
    b.textContent = cubeUpgradeDescriptions[i - 1];
    c.textContent = "Cost: " + format(metaData.cost, 0, true) + " Wow! Cubes [+" + format(metaData.levelCanBuy-player.cubeUpgrades[i]!,0,true) + " Levels]";
    c.style.color = "green"
    d.textContent = "Level: " + format(player.cubeUpgrades[i], 0, true) + "/" + format(maxLevel, 0, true);
    d.style.color = "white"

    // This conditional is true only in the case where you can buy zero levels.
    if (Number(player.wowCubes) < metaData.cost) {
        c.style.color = "crimson"
    }
    if (player.cubeUpgrades[i] === maxLevel) {
        c.style.color = "gold"
        c.textContent = "Cost: 0 Wow! Cubes. This upgrade is maxxed! wow"
        d.style.color = "plum"
    }
}

export const updateCubeUpgradeBG = (i: number) => {
    const a = DOMCacheGetOrSet("cubeUpg" + i)
    const maxCubeLevel = getCubeMax(i);
    const cubeUpgrade = player.cubeUpgrades[i]!;
    if (cubeUpgrade > maxCubeLevel) {
        console.log("Refunded " + (cubeUpgrade - cubeMaxLevel[i-1]) + " levels of Cube Upgrade " + i + ", adding " + (cubeUpgrade - cubeMaxLevel[i-1]) * cubeBaseCost[i-1] + " Wow! Cubes to balance.")
        player.wowCubes.add((cubeUpgrade - maxCubeLevel) * cubeBaseCost[i-1]);
        player.cubeUpgrades[i] = maxCubeLevel;
    }
    if (player.cubeUpgrades[i] === 0) {
        a.style.backgroundColor = "black"
    }
    if (cubeUpgrade > 0 && cubeUpgrade < maxCubeLevel) {
        a.style.backgroundColor = "purple"
    }
    if (player.cubeUpgrades[i] === maxCubeLevel) {
        a.style.backgroundColor = "green"
    }

}

function awardAutosCookieUpgrade() {
    for (const i of cubeAutomationIndices) {
        const maxLevel = getCubeMax(i)
        player.cubeUpgrades[i] = maxLevel;
        updateCubeUpgradeBG(i);
    }

    calculateCubeBlessings();

    for (const i of researchAutomationIndices) {
        player.researches[i] = G['researchMaxLevels'][i];
        updateResearchBG(i);
    }
}

export const buyCubeUpgrades = (i: number, linGrowth = 0, cubic = false) => {
    const metaData = getCubeCost(i,linGrowth, cubic);
    const maxLevel = getCubeMax(i)
    if(Number(player.wowCubes) >= metaData.cost && player.cubeUpgrades[i]! < maxLevel){
        player.wowCubes.sub(100 / 100 * metaData.cost);
        player.cubeUpgrades[i] = metaData.levelCanBuy;
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

    if(i === 51 && player.cubeUpgrades[51] > 0) {
        awardAutosCookieUpgrade();
    }

    cubeUpgradeDesc(i, linGrowth, cubic);
    updateCubeUpgradeBG(i);
    revealStuff();
    calculateCubeBlessings();
}
