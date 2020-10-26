function getResearchCost(index, buyAmount, linGrowth) {
    buyAmount = buyAmount || 1
    buyAmount = Math.min(researchMaxLevels[index] - player.researches[index], buyAmount)
    let metaData = calculateSummationNonLinear(player.researches[index], researchBaseCosts[index], player.researchPoints, linGrowth, buyAmount)
    return [metaData[0], metaData[1]]
}

function buyResearch(index, auto, linGrowth) {
    auto = auto || false
    linGrowth = linGrowth || 0
    if (player.autoResearchToggle && player.autoResearch > 0.5 && !auto) {
        let p = player.autoResearch
        if (player.researches[p] === researchMaxLevels[p]) {
            document.getElementById("res" + player.autoResearch).style.backgroundColor = "green"
        } else if (player.researches[p] > 0.5) {
            document.getElementById("res" + player.autoResearch).style.backgroundColor = "purple"
        } else {
            document.getElementById("res" + player.autoResearch).style.backgroundColor = "black"
        }
    }

    if (!auto && player.autoResearchToggle && player.shopUpgrades.obtainiumAutoLevel > 0.5 && player.cubeUpgrades[9] === 0) {
        player.autoResearch = index;
        document.getElementById("res" + index).style.backgroundColor = "orange"
    }

    let buyamount = (maxbuyresearch || auto) ? 1e5 : 1;
    let metaData = getResearchCost(index, buyamount, linGrowth)
    if ((auto || !player.autoResearchToggle) && isResearchUnlocked(index) && !isResearchMaxed(index) && player.researchPoints >= metaData[1]) {
        player.researchPoints -= metaData[1]
        player.researches[index] = metaData[0];
        researchfiller2 = "Level: " + player.researches[index] + "/" + (researchMaxLevels[index])
        researchDescriptions(index, auto, linGrowth)

        if (index === 47 && player.unlocks.rrow1 === false) {
            player.unlocks.rrow1 = true;
            revealStuff()
        }
        if (index === 48 && player.unlocks.rrow2 === false) {
            player.unlocks.rrow2 = true;
            revealStuff()
        }
        if (index === 49 && player.unlocks.rrow3 === false) {
            player.unlocks.rrow3 = true;
            revealStuff()
        }
        if (index === 50 && player.unlocks.rrow4 === false) {
            player.unlocks.rrow4 = true;
            revealStuff()
        }
    }

    if (0 < index && isResearchUnlocked(index)) {
        if (player.researches[index] === (researchMaxLevels[index])) {
            document.getElementById("res" + index).style.backgroundColor = "green"
        }
    }
    if (auto && player.cubeUpgrades[9] === 1) {
        player.autoResearch = researchOrderByCost[player.roombaResearchIndex]
        if (isResearchMaxed(player.autoResearch)) {
            player.roombaResearchIndex += 1;
        }
        while (!isResearchUnlocked(player.autoResearch) && player.autoResearch < 200 && player.autoResearch >= 1) {
            player.roombaResearchIndex += 1;
            player.autoResearch = researchOrderByCost[player.roombaResearchIndex]
        }
        if (isResearchUnlocked(player.autoResearch)) {
            let doc = document.getElementById("res" + researchOrderByCost[player.roombaResearchIndex])
            if (doc)
                doc.style.backgroundColor = "orange"
        }
    }
    calculateRuneLevels();
    calculateAnts();
}

/**
 * Calculates the max research index for the research roomba
 */
function maxRoombaResearchIndex(p = player) {
    let base = p.ascensionCount > 0 ? 140 : 125; // 125 researches pre-A + 15 from A
    let c11 = p.challengecompletions[11] > 0 ? 15 : 0;
    let c12 = p.challengecompletions[12] > 0 ? 15 : 0;
    let c13 = p.challengecompletions[13] > 0 ? 15 : 0;
    let c14 = p.challengecompletions[14] > 0 ? 15 : 0;
    return base + c11 + c12 + c13 + c14;
}

function isResearchUnlocked(index) {
    // https://stackoverflow.com/questions/20477177/creating-an-array-of-cumulative-sum-in-javascript
    const cumuSum = (sum => value => sum += value)(0);
    let indices = [3 * 25, 5, 20, 10, 15, 15, 15, 15, 15, 15].map(cumuSum);
    let chievos = [50, 124, 127, 134, 141, 183, 197, 204, 211, 218];
    for (let i = 0; i < indices.length; i++) {
        if (i === 3 && (index === 121 || index === 124 || index === 150)) {
            return player.achievements[chievos[i]] > 0;
        }
        if (index <= indices[i]) {
            return player.achievements[chievos[i]] > 0;
        }
    }
    return false;
}

function isResearchMaxed(index) {
    return researchMaxLevels[index] <= player.researches[index]
}


let resdesc;
resdesc = [null,
    "[1x1] Increase the number of free Accelerators gained by 20% from all sources.",
    "[1x2] Increase the number of free Multipliers gained by 20% from all sources.",
    "[1x3] Increase the number of free Accelerator Boosts gained by 20% from all sources.",
    "[1x4] Increase most rune effects by 10%. (Excludes any recycle chance bonus)",
    "[1x5] Multiply the production of all crystal producers by 1e4.",
    "[1x6] Gain +5% free accelerators per level.",
    "[1x7] Gain +4% free accelerators per level.",
    "[1x8] Gain +3% free accelerators per level.",
    "[1x9] Gain +2% free accelerators per level.",
    "[1x10] Gain +2% free accelerators per level.",
    "[1x11] Gain +5% free multipliers per level.",
    "[1x12] Gain +4% free multipliers per level.",
    "[1x13] Gain +2.5% free multipliers per level.",
    "[1x14] Gain +1.5% free multipliers per level.",
    "[1x15] Gain +0.5% free multipliers per level.",
    "[1x16] Gain +5% free accelerator boosts per level.",
    "[1x17] Gain +5% free accelerator boosts per level.",
    "[1x18] Gain +2 free accelerator per accelerator boost.",
    "[1x19] Gain +2 free accelerator per accelerator boost.",
    "[1x20] Gain +3 free accelerator per accelerator boost!",
    "[1x21] Most rune effects are increased by 1% per level. (Excludes any recycle chance bonus)",
    "[1x22] Each Offering used increases Rune EXP by 0.6 per level.",
    "[1x23] Each Offering used increases Rune EXP by another 0.3 per level!",
    "[1x24] Prestige and Transcensions base Offering is increased by 0.2 per level.",
    "[1x25] Reincarnations base Offering is increased by 0.6 per level.",
    "[2x1] Multiply all crystal producer production by 150% per level (multiplicative).",
    "[2x2] Multiply all crystal producer production by 150% per level (multiplicative).",
    "[2x3] Coin Exponent is increased by 0.08 per level.",
    "[2x4] Coin Exponent is increased by another 0.08 per level.",
    "[2x5] Coin Exponent is increased by ANOTHER 0.04 per level.",
    "[2x6] Want to bake cookies instead? You can go offline for 2 additional hours per level (base 24hr).",
    "[2x7] Want to bake a lot of cookies instead? Extend the offline maximum timer by another 2 hours per level!",
    "[2x8] Gain +11% more multiplier boosts from Mythos Shards per level.",
    "[2x9] Gain another +11% more multiplier boosts from Mythos Shards per level.",
    "[2x10] Gain ANOTHER +11% more multiplier boosts from Mythos Shards per level.",
    "[2x11] Building power scales 5% faster per level.",
    "[2x12] Building power scales 2.5% faster per level.",
    "[2x13] Building power scales 2.5% faster per level.",
    "[2x14] Building power affects crystal production at a reduced rate.",
    "[2x15] Building power affects mythos shard production at a reduced rate.",
    "[2x16] Start Reincarnations with automatic A.Boosts unlocked. Note: this research doesn't affect earning achievements.",
    "[2x17] Start Reincarnations with automatic Generators unlocked.",
    "[2x18] Start Reincarnations with automatic C.Upgrades unlocked.",
    "[2x19] Start Reincarnations with automatic D.Upgrades unlocked.",
    "[2x20] Start Reincarnations with automatic Diamond production unlocked.",
    "[2x21] Unlock the ability to automatically Reincarnate!",
    "[2x22] Unlock Reincarnation upgrades 1-5. [Upgrades cost between 1 and 1,000 Particles]",
    "[2x23] Unlock Reincarnation upgrades 6-10. [Upgrades cost between 100,000 and 1e22 Particles]",
    "[2x24] Unlock Reincarnation upgrades 11-15. [Upgrades cost between 1e30 and 1e60 Particles]",
    "[2x25] Unlock Reincarnation upgrades 16-20. [You might want to wait until challenge 8 is doable!]",
    "[3x1] Taxation scales 5.0% slower per level. [Up to -50%]",
    "[3x2] Taxation scales 2.5% slower per level. [Up to -75%]",
    "[3x3] Taxation scales 1.25% slower per level. [Up to -87.5%]",
    "[3x4] Taxation scales 0.625% slower per level. [Up to -93.75%]",
    "[3x5] Taxation scales 0.3125% slower per level. [Up to -96.875%]",
    "[3x6] Building Cost Scale is delayed by 0.5% per level.",
    "[3x7] Building Cost Scale is delayed by 0.5% per level.",
    "[3x8] Building Cost Scale is delayed by 0.5% per level.",
    "[3x9] Building Cost Scale is delayed by 0.5% per level.",
    "[3x10] Building Cost Scale is delayed by 0.5% per level.",
    "[3x11] Gain +50% of your best obtainium per second AUTOMATICALLY!",
    "[3x12] Gain an additional +10% of your best obtainium per second automatically.",
    "[3x13] If your Reincarnation lasts at least 2 seconds you gain +1 obtainium per level.",
    "[3x14] If your Reincarnation lasts at least 5 seconds you gain +2 obtainium per level.",
    "[3x15] Increase the rate of gaining obtainium through reincarnations by 20% per level.",
    "[3x16] Increase the maximum number of [No Multipliers] completions by 5 per level.",
    "[3x17] Increase the maximum number of [No Accelerators] completions by 5 per level.",
    "[3x18] Increase the maximum number of [No Shards] completions by 5 per level.",
    "[3x19] Increase the maximum number of [Cost+] completions by 5 per level.",
    "[3x20] Increase the maximum number of [Reduced Diamonds] completions by 5 per level.",
    "[3x21] Automatically gain completions for Challenge 1, even without running it!",
    "[3x22] Automatically gain completions for Challenge 2, even without running it!",
    "[3x23] Automatically gain completions for Challenge 3, even without running it!",
    "[3x24] Automatically gain completions for Challenge 4, even without running it!",
    "[3x25] Automatically gain completions for Challenge 5, even without running it!",
    "[4x1] Welcome to the land of expensive researches. Here's +10% obtainium per level to help you out!",
    "[4x2] Increase the level cap of Thrift rune by 10 per level, and +2% exp for that rune in particular.",
    "[4x3] Increase the level cap of Speed rune by 10 per level, and +2% exp for that rune in particular.",
    "[4x4] Increase the level cap of Prism rune by 10 per level, and +2% exp for that rune in particular.",
    "[4x5] Increase the level cap of Duplication rune by 10 per level, and +2% exp for that rune in particular.",
    "[4x6] You thought the previous researches are expensive? You're going to need this! [+10% Obtainium/level]",
    "[4x7] Permanently UNLOCK the Rune of Superior Intellect! [+%Ob / +Ant Speed / +Base Offerings.]",
    "[4x8] Taking forever to level up that SI Rune? Here's +5% SI Rune EXP per level.",
    "[4x9] Does the new rune kinda suck? Power it up! +0.5% level effectiveness for SI rune per level!",
    "[4x10] Gain +0.01% more offerings per level per challenge completion!",
    "[4x11] Yeah, going back to basics. +5% Accelerators/Level.",
    "[4x12] 0/5 Multipliers SUCK: +5% Multipliers/Level.",
    "[4x13] -1/5 A.Boosts SUCK: +5% Accelerator Boosts/Level.",
    "[4x14] -5/5 MULTIPLIERS STILL SUCK: +20% Multiplier Boosts/Level",
    "[4x15] Runes don't suck at all, but why not make them even BETTER? +1% Rune Effect/level!",
    "[4x16] A simple +5% Rune EXP for all runes!",
    "[4x17] Another simple +5% Rune EXP for all runes!",
    "[4x18] +1 Accelerator Boost per 20 Summative Rune Levels, per level.",
    "[4x19] +20 Multiplier per 8 Summative Rune Levels, per level.",
    "[4x20] Gain +4 base Offerings from Reincarnations by purchasing this. Math Nerds will love this!",
    "[4x21] Ants slow? Add +0.0002 to ant efficiency increase per ant purchased per level.",
    "[4x22] Add +4 level to the first six upgradable ants per level!",
    "[4x23] Add +4 level to the next five upgradable ants per level!",
    "[4x24] Is the Quark Shop too hot to resist? Get +1 Quark per hour from Exporting for each level (Up to +75)!",
    "[4x25] Alright, Platonic is off his rocker. I don't expect you to get this but this will give +1 MORE Quark per hour from Exporting (Up to +100)!",
    "[5x1] Alright, you're past the big wall. How about adding +.001 to Inceptus Ant efficiency per level?",
    "[5x2] Gain +1 bonus level to ALL ants per level! A rainbow attack!",
    "[5x3] Pray to Ant God for +5% sacrifice rewards per level!",
    "[5x4] You're beginning to feel like an ant god (ant god): +5% sacrifice reward per level!",
    "[5x5] Buy this and be able to run the first five challenges infinitely! (Note that requirements scale a LOT faster after 75)",
    "[5x6] Engrave your talismans with obtainium to get +0.03 Rune Levels per talisman level per level.",
    "[5x7] Refine your talismans with the powder of Obtainium to get +0.03 Rune Levels per talisman level per level again.",
    "[5x8] A simple trick makes your base ant ELO increase by 25 per level!",
    "[5x9] A more convoluted trick makes your base ant ELO increase by 25 per level again!",
    "[5x10] Gain +1% more ELO from ant sources per level because why not?",
    "[5x11] Gotta go fast [+10 max Speed Rune Level per level, +1% EXP to that rune]",
    "[5x12] Double Trouble [+10 max Duplication Rune level per level, +1% EXP to that rune]",
    "[5x13] Newton's Delight [+10 max Prism Rune Level per level, +1% EXP to that rune]",
    "[5x14] Five-Finger discounts [+10 max Thrift Rune Level per level, +1% EXP to that rune]",
    "[5x15] Scientific Breakthrough [+10 max SI Rune Level per level +1% EXP to that rune]",
    "[5x16] Talismans have +0.015 Rune levels per talisman level per level. Levelception!",
    "[5x17] Talismans have another +0.015 Rune levels per talisman level per level!",
    "[5x18] For 'neutral' talisman effects, increase by +0.06 per level!",
    "[5x19] Gain +0.25% Wow! Cubes per level upon Ascension.",
    "[5x20] Gain another +0.25% Wow! per level upon Ascension.",
    "[5x21] Bend time to your will, making all ticks 2% faster each level.",
    "[5x22] Adds +2% ant sacrifice reward per level.",
    "[5x23] Adds +40 base ant ELO per level.",
    "[5x24] Unlock the automator for Ant Sacrifice! [Good luck buying this.]",
    "[5x25] Good luck, buddy. [+1 Export Quark/hour]",
    "[6x1] 6 rows? That can't be... You've angered ant god (+1% Accelerators / level)",
    "[6x2] Ant God gets angrier (+1% Accelerator Boosts / level)",
    "[6x3] Ant God cannot believe your bravery (+1% Multipliers / level)",
    "[6x4] Add +1 extra level to Crystal upgrade caps multiplied by Level * Log4(Common Fragments + 1)",
    "[6x5] Unlock automation for Fortifying talismans! Activates every 2 real life seconds.",
    "[6x6] Turn some Ant Disciples against Ant God, giving +0.5% Rune Effectiveness per level.",
    "[6x7] Recruit a couple other ants towards your side as well, giving +2 free ant levels per level.",
    "[6x8] Using some coalesced Obtainium, you can make Ant Sacrifice 3% better per level.",
    "[6x9 lol] The funny number. Gain a +0.69% bonus to blessing level per level.",
    "[6x10] Unlock automation for Enhancing talismans! Activates every 2 real life seconds.",
    "[6x11] It may be time to look back. Makes all ticks 1.5% faster each level.",
    "[6x12] Paying off Wow! Industries, they'll sponsor +1% cubes per level towards your Ascension bank.",
    "[6x13] When you open Wow! Cubes you will get +0.1% tributes per level!",
    "[6x14] Make all Tesseract buildings produce 2% faster per level.",
    "[6x15] The first of a Tetralogy, this tome reduces the base requirements of Challenge 10 by dividing it by 1e100M! A must-read!",
    "[6x16] The Ant God has infiltrated your mind. Run away from your conscience! (+0.8% Accelerators / level)",
    "[6x17] Run... RUN FASTER from your nightmares! (+0.8% Accelerator Boosts / level)",
    "[6x18] Your resilience somehow gives you +0.8% Multipliers / level!",
    "[6x19] Your obtainium gain is increased by 3 * Log4(Uncommon Fragments + 1) * level%! Why is this? I don't know.",
    "[6x20] Your knowledge from the ant war will help you automatically gain Mortuus Est Ant levels.",
    "[6x21] Feed your Disciples pure Obtainium to make your runes +0.4% more effective per level.",
    "[6x22] Feed your ants their own crumbs to make them Log(Crumbs + 10)x faster!",
    "[6x23] Increase your base Ant ELO by 2.5% per level!",
    "[6x24] You will gain +0.03% more Offerings per level per level in the Midas Talisman!",
    "[6x25] Auto Challenge. Enough said. (Lets you automatically run and complete challenges!)",
    "[7x1] A new row, old upgrade. Makes all ticks 1.2% faster each level.",
    "[7x2] Wow! Industries sponsors another +0.9% cubes per level towards your Ascension bank!",
    "[7x3] Hey, I totally didn't steal this idea. You gain 12 tributes of Wow! Cube tier for every Tesseract opened.",
    "[7x4] Make all Tesseract buildings produce 3% faster per level. Hey, isn't that more than the last research tier?",
    "[7x5] Tome 2 of 4: How to win over the Ant universe. Another e100M Divider to Challenge 10 Base Requirement on purchase.",
    "[7x6] What, again? Alright. +0.6% Accelerators / level.",
    "[7x7] Gas, gas, gas. +0.6% Accelerator Boosts / level.",
    "[7x8] Dupe DUPE DUPE. +0.6% Multipliers / level.",
    "[7x9] Somehow, I can't explain why, you reduce your taxes by 2% multiplicative, based on 3/5 * log10(Rare Fragments)!",
    "[7x10] Want a permanent blessing boost? I know you do. A permanent +25% effect to all blessings.",
    "[7x11] SIGMA KAPPA: +0.3% Rune Effectiveness each level!",
    "[7x12] More exponentiation! +0.0001% more inceptus power per level!",
    "[7x13] Ant God's wanting blood: +2% Ant Sacrifice rewards / level",
    "[7x14] Spirit power still sucks, so add +8% power per level!",
    "[7x15] Gain 2x the Spirit buffs in challenges!",
    "[7x16] < T I M E >: +0.9% faster ticks / level ",
    "[7x17] Because of sponsorships, Wow! Industries is raising cubes gained in Ascension by 0.8% per level.",
    "[7x18] Gain +0.08% tributes from cubes per level. You know, you should expect it at this point.",
    "[7x19] +4% faster Tesseract Buildings / level. It's GROWING.",
    "[7x20] Tome 3 of 4: How to totally ROCK challenge 10. e100m divisor!",
    "[7x21] You should know how this goes. +0.4% Accelerator Boosts / level",
    "[7x22] Accelerator Boosts += 0.004 * Accelerator Boosts",
    "[7x23] A lot of a small +0.4% Multipliers per level",
    "[7x24] Epic Fragments boost Blessing power by 10% * Log10(Epic Shards + 1)",
    "[7x25] Automatically buy Constant Upgrades, if they are affordable! They also no longer subtract from your constant.",
    "[8x1] Row 8 baby! +0.2% Rune Effectiveness / level.",
    "[8x2] +Log10(Crumbs)% to ant production per level. Pretty cool buff ain't it?",
    "[8x3] +666 Base ELO per level! Spooky number of the devil.",
    "[8x4] +0.04% more offerings per level per midas level!",
    "[8x5] +1 Export Quark per hour, yet again.",
    "[8x6] +0.6% faster ticks / level because why not? You're already the speed of light.",
    "[8x7] +0.7% cubes in ascension bank / level, from dividends in Wow! Stock.",
    "[8x8] When you open a Hypercube, you also open 100 Tesseracts! (This works with 7x3, if you were curious.)",
    "[8x9] +5% faster Tesseract Buildings / level. ASCENDED.",
    "[8x10] Tome 4 of 4: You need to prepare for your ascent. e100m divisor!",
    "[8x11] Something something +0.2% Accelerators pretty cool!",
    "[8x12] Something somewhere, +0.2% Accelerator Boosts!",
    "[8x13] You are DUPLICATED. +0.2% Multipliers/level",
    "[8x14] Legendary Fragments increase Spirit power by +15% multiplied by Log10(Legendary Fragments + 1)",
    "[8x15] Unlock Automations for all 5 of the Tesseract buildings.",
    "[8x16] +0.1% Rune Effectiveness / level. Does this even do anything at this point?",
    "[8x17] Each purchased level of Mortuus Est also increases Ascension Cube reward by +0.03%",
    "[8x18] +1% Ant Sacrifice Reward per level. Singularity HYPE.",
    "[8x19] Increases both Spirit AND Blessing power by 2% per level.",
    "[8x20] Gain +1 export Quark per level, and increases the max timer to redeem quarks by 12.5 hours each!",
    "[8x21] +0.3% faster ticks / level, because you just can't wait to become the singularity.",
    "[8x22] +0.6% cubes in Ascension Bank / level. No one knows how. Bank error perhaps.",
    "[8x23] +0.06% tributes from cubes / level!. Wow! Cubes really has a lot of manufacturing errors in your favor.",
    "[8x24] +10% faster Tesseract Buildings / level. THE ARISEN. WITH THE PRAISE OF THE SINGULARITY.",
    "[8x25] Gain the power of a thousand suns! +0.01% Accelerators, A. Boosts, Multipliers, Offerings, and +0.004% Cubes, +0.04 Max Rune level, + Floor(level/400) max Talisman Level, +Floor(level/200) free ants."
];

function researchDescriptions(i, auto, linGrowth) {
    auto = auto || false
    linGrowth = linGrowth || 0
    let buyAmount = (maxbuyresearch || auto) ? 100000 : 1;
    let y = resdesc[i]
    let z = ""
    let p = "res" + i
    let metaData = getResearchCost(i, buyAmount, linGrowth);
    z = " Cost: " + (format(metaData[1], 0, false)) + " Obtainium [+" + format(metaData[0] - player.researches[i], 0, true) + " Levels]"
    if (player.researches[i] === (researchMaxLevels[i])) {
        document.getElementById("researchcost").style.color = "Gold"
        document.getElementById("researchinfo3").style.color = "plum"
        z = z + " || MAXED!"
    } else {
        document.getElementById("researchcost").style.color = "limegreen"
        document.getElementById("researchinfo3").style.color = "white"
    }

    if (player.researchPoints < researchBaseCosts[i] && player.researches[i] < (researchMaxLevels[i])) {
        document.getElementById("researchcost").style.color = "crimson"
    }

    if (!auto && !player.autoResearchToggle) {
        if (player.researches[i] > 0.5 && player.researches[i] < (researchMaxLevels[i])) {
            document.getElementById(p).style.backgroundColor = "purple"
        }
    }
    if (player.researches[i] > 0.5 && player.researches[i] >= (researchMaxLevels[i])) {
        document.getElementById(p).style.backgroundColor = "green"
    }

    document.getElementById("researchinfo2").textContent = y
    document.getElementById("researchcost").textContent = z
    document.getElementById("researchinfo3").textContent = "Level " + player.researches[i] + "/" + (researchMaxLevels[i])
}

function updateResearchBG(j) {

    if (player.researches[j] > researchMaxLevels[j]) {
        player.researchPoints += (player.researches[j] - researchMaxLevels[j]) * researchBaseCosts[j]
        player.researches[j] = researchMaxLevels[j]
    }

    let k = "res" + j
    if (player.researches[j] > 0.5 && player.researches[j] < researchMaxLevels[j]) {
        document.getElementById(k).style.backgroundColor = "purple"
    } else if (player.researches[j] > 0.5 && player.researches[j] >= researchMaxLevels[j]) {
        document.getElementById(k).style.backgroundColor = "green"
    } else {
        document.getElementById(k).style.backgroundColor = "black"
    }
}
