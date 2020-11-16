function visualUpdateBuildings() {
    if (currentTab !== "buildings") {
        console.log("buildings update happened not in buildings")
        return

    }
//When you're in Building --> Coin, update these.
    if (buildingSubTab === "coin") {
        // For the display of Coin Buildings
        let upper = [null, 'First', 'Second', 'Third', 'Fourth', 'Fifth']
        let names = [null, 'Workers', 'Investments', 'Printers', 'Coin Mints', 'Alchemies']

        // Placeholder is of form "produce+upper[i]", which feeds info place in the form of window function
        let placeholder = ''
        let place = ''

        let totalProductionDivisor = new Decimal(produceTotal);
        if (totalProductionDivisor.equals(0)) {
            totalProductionDivisor = new Decimal(1);
        }

        for (let i = 1; i <= 5; i++) {
            placeholder = "produce" + upper[i]
            place = window[placeholder]
            document.getElementById("buildtext" + (2 * i - 1)).textContent = names[i] + ": " + format(player[ordinals[i - 1] + 'OwnedCoin'], 0, true) + " [+" + format(player[ordinals[i - 1] + 'GeneratedCoin']) + "]"
            document.getElementById("buycoin" + i).textContent = "Cost: " + format(player[ordinals[i - 1] + 'CostCoin']) + " coins."
            document.getElementById("buildtext" + (2 * i)).textContent = "Coins/Sec: " + format((place.dividedBy(taxdivisor)).times(40), 2) + " [" + format(place.dividedBy(totalProductionDivisor).times(100), 3) + "%]"
        }

        document.getElementById("buildtext11").textContent = "Accelerators: " + format(player.acceleratorBought, 0, true) + " [+" + format(freeAccelerator, 0, true) + "]"
        document.getElementById("buildtext12").textContent = "Acceleration Power: " + ((acceleratorPower - 1) * (100)).toPrecision(4) + "% || Acceleration Multiplier: " + format(acceleratorEffect, 2) + "x"
        document.getElementById("buildtext13").textContent = "Multipliers: " + format(player.multiplierBought, 0, true) + " [+" + format(freeMultiplier, 0, true) + "]"
        document.getElementById("buildtext14").textContent = "Multiplier Power: " + multiplierPower.toPrecision(4) + "x || Multiplier: " + format(multiplierEffect, 2) + "x"
        document.getElementById("buildtext15").textContent = "Accelerator Boost: " + format(player.acceleratorBoostBought, 0, true) + " [+" + format(freeAcceleratorBoost, 0, false) + "]"
        document.getElementById("buildtext16").textContent = "Reset Diamonds and Prestige Upgrades, but add " + (tuSevenMulti * (1 + player.researches[16] / 50) * (1 + CalcECC('transcend', player.challengecompletions[2]) / 100)).toPrecision(4) + "% Acceleration Power and 5 free Accelerators."
        document.getElementById("buyaccelerator").textContent = "Cost: " + format(player.acceleratorCost) + " coins."
        document.getElementById("buymultiplier").textContent = "Cost: " + format(player.multiplierCost) + " coins."
        document.getElementById("buyacceleratorboost").textContent = "Cost: " + format(player.acceleratorBoostCost) + " Diamonds."

        // update the tax text
        let warning = "";
        if (player.reincarnationCount > 0.5) {
            warning = `Your tax also caps your Coin gain at ${format(Decimal.pow(10, maxexponent - Decimal.log(taxdivisorcheck, 10)))}/s.`
        }
        document.getElementById("taxinfo").textContent =
            `Due to your excessive wealth, coin production is divided by ${format(taxdivisor, 2)} to pay taxes! ${warning}`
    }

    if (buildingSubTab === "diamond") {
        // For the display of Diamond Buildings
        let upper = [null, 'FirstDiamonds', 'SecondDiamonds', 'ThirdDiamonds', 'FourthDiamonds', 'FifthDiamonds']
        let names = [null, 'Refineries', 'Coal Plants', 'Coal Rigs', 'Pickaxes', 'Pandoras Boxes']
        let perSecNames = [null, "Crystal/sec", "Ref./sec", "Plants/sec", "Rigs/sec", "Pickaxes/sec"]

        // Placeholder is of form "produce+upper[i]", which feeds info place in the form of window function
        let placeholder = ''
        let place = ''

        document.getElementById("prestigeshardinfo").textContent = "You have " + format(player.prestigeShards, 2) + " Crystals, multiplying Coin production by " + format(prestigeMultiplier, 2) + "x."

        for (let i = 1; i <= 5; i++) {
            placeholder = "produce" + upper[i];
            place = window[placeholder];

            document.getElementById("prestigetext" + (2 * i - 1)).textContent = names[i] + ": " + format(player[ordinals[i - 1] + 'OwnedDiamonds'], 0, true) + " [+" + format(player[ordinals[i - 1] + 'GeneratedDiamonds'], 2) + "]"
            document.getElementById("prestigetext" + (2 * i)).textContent = perSecNames[i] + ": " + format((place).times(40), 2)
            document.getElementById("buydiamond" + i).textContent = "Cost: " + format(player[ordinals[i - 1] + 'CostDiamonds'], 2) + " Diamonds"
        }

        if (player.resettoggle1 === 1 || player.resettoggle1 === 0) {
            let p = new Decimal.pow(10, Decimal.log(prestigePointGain.add(1), 10) - Decimal.log(player.prestigePoints.sub(1), 10))
            document.getElementById("autoprestige").textContent = "Prestige when your Diamonds can increase by a factor " + format(Decimal.pow(10, player.prestigeamount)) + " [Toggle number above]. Current Multiplier: " + format(p) + "."
        }
        if (player.resettoggle1 === 2) {
            document.getElementById("autoprestige").textContent = "Prestige when the autotimer is at least " + (player.prestigeamount) + " real-life seconds. [Toggle number above]. Current timer: " + format(autoResetTimers.prestige, 1) + "s."
        }
    }

    if (buildingSubTab === "mythos") {
        // For the display of Mythos Buildings
        let upper = [null, 'FirstMythos', 'SecondMythos', 'ThirdMythos', 'FourthMythos', 'FifthMythos']
        let names = [null, 'Augments', 'Enchantments', 'Wizards', 'Oracles', 'Grandmasters']
        let perSecNames = [null, "Shards/sec", "Augments/sec", "Enchantments/sec", "Wizards/sec", "Oracles/sec"]

        // Placeholder is of form "produce+upper[i]", which feeds info place in the form of window function
        let placeholder = ''
        let place = ''

        document.getElementById("transcendshardinfo").textContent = "You have " + format(player.transcendShards, 2) + " Mythos Shards, providing " + format(totalMultiplierBoost, 0, true) + " Multiplier Power boosts."

        for (let i = 1; i <= 5; i++) {
            placeholder = "produce" + upper[i];
            place = window[placeholder];

            document.getElementById("transcendtext" + (2 * i - 1)).textContent = names[i] + ": " + format(player[ordinals[i - 1] + 'OwnedMythos'], 0, true) + " [+" + format(player[ordinals[i - 1] + 'GeneratedMythos'], 2) + "]"
            document.getElementById("transcendtext" + (2 * i)).textContent = perSecNames[i] + ": " + format((place).times(40), 2)
            document.getElementById("buymythos" + i).textContent = "Cost: " + format(player[ordinals[i - 1] + 'CostMythos'], 2) + " Mythos"
        }

        if (player.resettoggle2 === 1 || player.resettoggle2 === 0) {
            document.getElementById("autotranscend").textContent = "Prestige when your Mythos can increase by a factor " + format(Decimal.pow(10, player.transcendamount)) + " [Toggle number above]. Current Multiplier: " + format(Decimal.pow(10, Decimal.log(transcendPointGain.add(1), 10) - Decimal.log(player.transcendPoints.add(1), 10), 2)) + "."
        }
        if (player.resettoggle2 === 2) {
            document.getElementById("autotranscend").textContent = "Transcend when the autotimer is at least " + (player.transcendamount) + " real-life seconds. [Toggle number above]. Current timer: " + format(autoResetTimers.transcension, 1) + "s."
        }
    }

    if (buildingSubTab === "particle") {

        // For the display of Particle Buildings
        let upper = [null, 'FirstParticles', 'SecondParticles', 'ThirdParticles', 'FourthParticles', 'FifthParticles']
        let names = [null, 'Protons', 'Elements', 'Pulsars', 'Quasars', 'Galactic Nuclei']
        let perSecNames = [null, "Atoms/sec", "Protons/sec", "Elements/sec", "Pulsars/sec", "Quasars/sec"]

        // Placeholder is of form "produce+upper[i]", which feeds info place in the form of window function
        let placeholder = ''
        let place = ''

        for (let i = 1; i <= 5; i++) {
            placeholder = "produce" + upper[i];
            place = window[placeholder];

            document.getElementById("reincarnationtext" + (i)).textContent = names[i] + ": " + format(player[ordinals[i - 1] + 'OwnedParticles'], 0, true) + " [+" + format(player[ordinals[i - 1] + 'GeneratedParticles'], 2) + "]"
            document.getElementById("reincarnationtext" + (5 + i)).textContent = perSecNames[i] + ": " + format((place).times(40), 2)
            document.getElementById("buyparticles" + i).textContent = "Cost: " + format(player[ordinals[i - 1] + 'CostParticles'], 2) + " Particles"
        }

        document.getElementById("reincarnationshardinfo").textContent = "You have " + format(player.reincarnationShards, 2) + " Atoms, providing " + buildingPower.toPrecision(4) + " Building Power. Multiplier to Coin Production: " + format(reincarnationMultiplier)
        document.getElementById("reincarnationCrystalInfo").textContent = "Thanks to Research 2x14, you also multiply Crystal production by " + format(Decimal.pow(reincarnationMultiplier, 1 / 50), 3, false)
        document.getElementById("reincarnationMythosInfo").textContent = "Thanks to Research 2x15, you also multiply Mythos Shard production by " + format(Decimal.pow(reincarnationMultiplier, 1 / 250), 3, false)

        if (player.resettoggle3 === 1 || player.resettoggle3 === 0) {
            document.getElementById("autoreincarnate").textContent = "Reincarnate when your Particles can increase by a factor " + format(Decimal.pow(10, player.reincarnationamount)) + " [Toggle number above]. Current Multiplier: " + format(Decimal.pow(10, Decimal.log(reincarnationPointGain.add(1), 10) - Decimal.log(player.reincarnationPoints.add(1), 10), 2)) + "."
        }
        if (player.resettoggle3 === 2) {
            document.getElementById("autoreincarnate").textContent = "Reincarnate when the autotimer is at least " + (player.reincarnationamount) + " real-life seconds. [Toggle number above]. Current timer: " + format(autoResetTimers.reincarnation, 1) + "s."
        }
    }

    if (buildingSubTab === "tesseract") {
        let names = [null, 'Dot', 'Vector', 'Three-Space', 'Bent Time', 'Hilbert Space']
        let perSecNames = [null, '+Constant/sec', 'Dot/sec', 'Vector/sec', 'Three-Space/sec', 'Bent Time/sec']
        for (let i = 1; i <= 5; i++) {
            document.getElementById("ascendText" + i).textContent = names[i] + ": " + format(player['ascendBuilding' + i]['owned'], 0, true) + " [+" + format(player['ascendBuilding' + i]['generated'], 2) + "]"
            document.getElementById("ascendText" + (5 + i)).textContent = perSecNames[i] + ": " + format((ascendBuildingProduction[ordinals[i - 1]]), 2)
            document.getElementById("buyTesseracts" + i).textContent = "Cost: " + format(player['ascendBuilding' + i]['cost'], 0) + " Tesseracts"
        }

        document.getElementById("tesseractInfo").textContent = "You have " + format(player.wowTesseracts) + " Wow! Tesseracts. Gain more by beating Challenge 10 on each Ascension."
        document.getElementById("ascendShardInfo").textContent = "You have a mathematical constant of " + format(player.ascendShards, 2) + ". Taxes are divided by " + format(Math.pow(Decimal.log(player.ascendShards.add(1), 10) + 1, 1 + .2 / 60 * player.challengecompletions[10] * player.upgrades[125] + 0.1 * player.platonicUpgrades[5] + 0.2 * player.platonicUpgrades[10] + 0.5 * player.platonicUpgrades[15] + (platonicBonusMultiplier[5] - 1)), 4, true) + "."
    }
}

function visualUpdateUpgrades() {
    if (currentTab !== "upgrades")
        return

}

function visualUpdateAchievements() {
    if (currentTab !== "achievements")
        return

}

function visualUpdateRunes() {
    if (currentTab !== "runes")
        return
    if (runescreen === "runes") { //Placeholder and place work similarly to buildings, except for the specific Talismans.
        let placeholder = ''
        let place = ''

        document.getElementById("runeshards").textContent = "You have " + format(player.runeshards, 0, true) + " Offerings."

        for (let i = 1; i <= 5; i++) { //First one updates level, second one updates TNL, third updates orange bonus levels
            placeholder = 'rune' + i + "Talisman"
            place = window[placeholder]

            document.getElementById('rune' + i + 'level').childNodes[0].textContent = "Level: " + format(player.runelevels[i - 1]) + "/" + format(calculateMaxRunes(i))
            document.getElementById('rune' + i + 'exp').textContent = "+1 in " + format(calculateRuneExpToLevel(i - 1) - player.runeexp[i - 1], 2) + " EXP"
            document.getElementById('bonusrune' + i).textContent = " [Bonus: " + format(7 * player.constantUpgrades[7] + Math.min(1e7, player.antUpgrades[9] + bonusant9) + place) + "]"

            displayRuneInformation(i, false)
        }

        document.getElementById("runedetails").textContent = "Gain " + format((1 + Math.min(player.highestchallengecompletions[1], 1) + 1 / 25 * player.highestchallengecompletions[1] + 0.6 * player.researches[22] + 0.3 * player.researches[23] + 3 / 25 * player.upgrades[66] + 2 * player.upgrades[61]) * calculateRecycleMultiplier(), 2, true) + "* EXP per offering sacrificed."
        document.getElementById("runerecycle").textContent = "You have " + format((5 * player.achievements[80] + 5 * player.achievements[87] + 5 * player.achievements[94] + 5 * player.achievements[101] + 5 * player.achievements[108] + 5 * player.achievements[115] + 7.5 * player.achievements[122] + 7.5 * player.achievements[129] + 5 * player.upgrades[61] + Math.min(25, rune4level / 16) + 0.5 * player.cubeUpgrades[2]), 2, true) + "% chance of recycling your offerings. This multiplies EXP gain by " + format(calculateRecycleMultiplier(), 2, true) + "!"

    }

    if (runescreen === "talismans") {
        for (let i = 1; i <= 7; i++) {
            document.getElementById('talisman' + i + 'level').textContent = "Level " + player.talismanLevels[i] + "/" + (30 * player.talismanRarity[i] + 6 * CalcECC('ascension', player.challengecompletions[13]) + Math.floor(player.researches[200] / 400))
        }
    }

    if (runescreen === "blessings") {
        let blessingMultiplierArray = [0, 8, 10, 6.66, 2, 1]
        let t = 0;
        for (let i = 1; i <= 5; i++) {
            document.getElementById('runeBlessingLevel' + i + 'Value').textContent = format(player.runeBlessingLevels[i], 0, true)
            document.getElementById('runeBlessingPower' + i + 'Value1').textContent = format(runeBlessings[i])
            document.getElementById('runeBlessingPurchaseAmount' + i).textContent = format(Math.max(1, calculateSummationLinear(player.runeBlessingLevels[i], blessingBaseCost, player.runeshards, player.runeBlessingBuyAmount)[0] - player.runeBlessingLevels[i]))
            document.getElementById('runeBlessingPurchaseCost' + i).textContent = format(Math.max(blessingBaseCost * (1 + player.runeBlessingLevels[i]), calculateSummationLinear(player.runeBlessingLevels[i], blessingBaseCost, player.runeshards, player.runeBlessingBuyAmount)[1]))
            if (i === 5) {
                t = 1
            }
            document.getElementById('runeBlessingPower' + i + 'Value2').textContent = format(1 - t + blessingMultiplierArray[i] * effectiveRuneBlessingPower[i], 4, true)
        }
    }

    if (runescreen === "spirits") {
        let spiritMultiplierArray = [0, 1, 1, 20, 1, 100]
        let subtract = [0, 0, 0, 1, 0, 0]
        for (let i = 1; i <= 5; i++) {
            spiritMultiplierArray[i] *= (calculateCorruptionPoints() / 400)
            document.getElementById('runeSpiritLevel' + i + 'Value').textContent = format(player.runeSpiritLevels[i], 0, true)
            document.getElementById('runeSpiritPower' + i + 'Value1').textContent = format(runeSpirits[i])
            document.getElementById('runeSpiritPurchaseAmount' + i).textContent = format(Math.max(1, calculateSummationLinear(player.runeSpiritLevels[i], spiritBaseCost, player.runeshards, player.runeSpiritBuyAmount)[0] - player.runeSpiritLevels[i]))
            document.getElementById('runeSpiritPurchaseCost' + i).textContent = format(Math.max(spiritBaseCost * (1 + player.runeSpiritLevels[i]), calculateSummationLinear(player.runeSpiritLevels[i], spiritBaseCost, player.runeshards, player.runeSpiritBuyAmount)[1]))
            document.getElementById('runeSpiritPower' + i + 'Value2').textContent = format(1 - subtract[i] + spiritMultiplierArray[i] * effectiveRuneSpiritPower[i], 4, true)
        }
    }
}

function visualUpdateChallenges() {
    if (currentTab !== "challenges")
        return
    if (player.researches[150] > 0) {
        document.getElementById("autoIncrementerAmount").textContent = format(autoChallengeTimerIncrement, 2) + "s"
    }
}

function visualUpdateResearch() {
    if (currentTab !== "researches")
        return

    if (player.researches[61] > 0) {
        document.getElementById("automaticobtainium").textContent = "Thanks to researches you automatically gain " + format(calculateAutomaticObtainium(), 3, true) + " Obtainium per real life second."
    }
}

function visualUpdateAnts() {
    if (currentTab !== "ants")
        return
    document.getElementById("crumbcount").textContent = "You have " + format(player.antPoints, 2) + " Galactic Crumbs [" + format(antOneProduce, 2) + "/s], providing a " + format(Decimal.pow(Decimal.max(1, player.antPoints), 100000 + calculateSigmoidExponential(49900000, (player.antUpgrades[2] + bonusant2) / 5000 * 500 / 499))) + "x Coin Multiplier."
    let mode = player.autoAntSacrificeMode === 2 ? "Real-time" : "In-game time";
    let timer = player.autoAntSacrificeMode === 2 ? player.antSacrificeTimerReal : player.antSacrificeTimer;
    document.getElementById("autoAntSacrifice").textContent = `Sacrifice when the timer is at least ${player.autoAntSacTimer} seconds (${mode}), Currently: ${format(timer)}`
    if (player.achievements[173] === 1) {
        document.getElementById("antSacrificeTimer").textContent = formatTimeShort(player.antSacrificeTimer);
        showSacrifice();
    }
}

function visualUpdateCubes() {
    if (currentTab !== "cubes")
        return
    document.getElementById("cubeToQuarkTimerValue").textContent = format(Math.floor(player.dayTimer / 3600), 0) + " Hours " + format(Math.floor(player.dayTimer / 60 % 60), 0) + " Mins " + format(Math.floor(player.dayTimer % 60), 0) + " Secs "

    let prefixes = ['cube', 'tesseract', 'hypercube']
    let power = [4, 3, 2]
    let multipliers = [10, 10, 5]
    for (var i = 0; i <= 2; i++) {
        document.getElementById(prefixes[i] + 'QuarksTodayValue').textContent = format(player[prefixes[i] + 'QuarkDaily']) + "/" + format(25 + 75 * player.shopUpgrades[prefixes[i] + 'ToQuarkBought']);
        document.getElementById(prefixes[i] + 'QuarksOpenTodayValue').textContent = format(player[prefixes[i] + 'OpenedDaily'], 0, true);
        document.getElementById(prefixes[i] + 'QuarksOpenRequirementValue').textContent = format(Math.max(0, multipliers[i] * Math.pow(Math.min(25 + 75 * player.shopUpgrades[prefixes[i] + 'ToQuarkBought'], 1 + player[prefixes[i] + 'QuarkDaily']), power[i]) - player[prefixes[i] + 'OpenedDaily']), 0, true)
    }

    let accuracy;
    switch (player.subtabNumber) {
        case 0:
            document.getElementById("cubeQuantity").textContent = format(player.wowCubes, 0, true)
            let cubeArray = [null, player.cubeBlessings.accelerator, player.cubeBlessings.multiplier, player.cubeBlessings.offering, player.cubeBlessings.runeExp, player.cubeBlessings.obtainium, player.cubeBlessings.antSpeed, player.cubeBlessings.antSacrifice, player.cubeBlessings.antELO, player.cubeBlessings.talismanBonus, player.cubeBlessings.globalSpeed]

            accuracy = [null, 2, 2, 2, 2, 2, 2, 2, 1, 4, 3]
            for (let i = 1; i <= 10; i++) {
                let augmentAccuracy = 0;
                if (cubeArray[i] >= 1000 && i !== 6) {
                    augmentAccuracy += 2;
                }
                document.getElementById(`cubeBlessing${i}Amount`).textContent = `x${format(cubeArray[i], 0, true)}`
                document.getElementById(`cubeBlessing${i}Effect`).textContent = `+${format(100 * (cubeBonusMultiplier[i] - 1), accuracy[i] + augmentAccuracy, true)}%`
                if (i === 1 || i === 8 || i === 9) {
                    document.getElementById(`cubeBlessing${i}Effect`).textContent = `+${format(cubeBonusMultiplier[i] - 1, accuracy[i] + augmentAccuracy, true)}`
                }
            }
            document.getElementById("cubeBlessingTotalAmount").textContent = format(sumContents(cubeArray), 0, true);
            break;
        case 1:
            document.getElementById("tesseractQuantity").textContent = format(player.wowTesseracts, 0, true)
            let tesseractArray = [null, player.tesseractBlessings.accelerator, player.tesseractBlessings.multiplier, player.tesseractBlessings.offering, player.tesseractBlessings.runeExp, player.tesseractBlessings.obtainium, player.tesseractBlessings.antSpeed, player.tesseractBlessings.antSacrifice, player.tesseractBlessings.antELO, player.tesseractBlessings.talismanBonus, player.tesseractBlessings.globalSpeed]
            accuracy = [null, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
            for (let i = 1; i <= 10; i++) {
                let augmentAccuracy = 0;
                if (tesseractArray[i] >= 1000 && i !== 6) {
                    augmentAccuracy += 2;
                }
                document.getElementById(`tesseractBlessing${i}Amount`).textContent = `x${format(tesseractArray[i], 0, true)}`
                document.getElementById(`tesseractBlessing${i}Effect`).textContent = `+${format(100 * (tesseractBonusMultiplier[i] - 1), accuracy[i] + augmentAccuracy, true)}%`
            }
            document.getElementById("tesseractBlessingTotalAmount").textContent = format(sumContents(tesseractArray), 0, true);
            break;
        case 2:
            document.getElementById("hypercubeQuantity").textContent = format(player.wowHypercubes, 0, true)
            let hypercubeArray = [null, player.hypercubeBlessings.accelerator, player.hypercubeBlessings.multiplier, player.hypercubeBlessings.offering, player.hypercubeBlessings.runeExp, player.hypercubeBlessings.obtainium, player.hypercubeBlessings.antSpeed, player.hypercubeBlessings.antSacrifice, player.hypercubeBlessings.antELO, player.hypercubeBlessings.talismanBonus, player.hypercubeBlessings.globalSpeed]
            accuracy = [null, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
            for (let i = 1; i <= 10; i++) {
                let augmentAccuracy = 0;
                if (hypercubeArray[i] >= 1000) {
                    augmentAccuracy += 2;
                }
                document.getElementById(`hypercubeBlessing${i}Amount`).textContent = `x${format(hypercubeArray[i], 0, true)}`
                document.getElementById(`hypercubeBlessing${i}Effect`).textContent = `+${format(100 * (hypercubeBonusMultiplier[i] - 1), accuracy[i] + augmentAccuracy, true)}%`
            }
            document.getElementById("hypercubeBlessingTotalAmount").textContent = format(sumContents(hypercubeArray), 0, true);
            break;
        case 3:
            document.getElementById("platonicQuantity").textContent = format(player.wowPlatonicCubes, 0, true)
            let platonicArray = [player.platonicBlessings.cubes, player.platonicBlessings.tesseracts, player.platonicBlessings.hypercubes, player.platonicBlessings.platonics, player.platonicBlessings.hypercubeBonus, player.platonicBlessings.taxes, player.platonicBlessings.scoreBonus, player.platonicBlessings.globalSpeed]
            let DRThreshold = [4e6, 4e6, 4e6, 8e4, 1e4, 1e4, 1e4, 1e4]
            accuracy = [5, 5, 5, 5, 2, 3, 3, 2]
            for (let i = 0; i < platonicArray.length; i++) {
                let augmentAccuracy = 0;
                if (platonicArray[i] >= DRThreshold[i]) {
                    augmentAccuracy += 1;
                }
                document.getElementById(`platonicBlessing${i + 1}Amount`).textContent = `x${format(platonicArray[i], 0, true)}`
                document.getElementById(`platonicBlessing${i + 1}Effect`).textContent = `+${format(100 * (platonicBonusMultiplier[i] - 1), accuracy[i] + augmentAccuracy, true)}%`
            }
            document.getElementById("platonicBlessingTotalAmount").textContent = format(sumContents(platonicArray), 0, true);
            break;
        case 4:
            document.getElementById("cubeAmount2").textContent = `You have ${format(player.wowCubes, 0, true)} Wow! Cubes =)`
            break;
        case 5:
            break;
        default:
            // console.log(`player.subtabNumber (${player.subtabNumber}) was outside of the allowed range (${subTabsInMainTab(8).subTabList.length}) for the cube tab`);
            break;
    }
}

function visualUpdateCorruptions() {
    if (currentTab !== "traits")
        return

    document.getElementById("autoAscendMetric").textContent = format(player.autoAscendThreshold, 0, true)
    let metaData = CalcCorruptionStuff();

    document.getElementById("corruptionBankValue").textContent = format(metaData[0])
    document.getElementById("corruptionScoreValue").textContent = format(metaData[1], 0, true)
    document.getElementById("corruptionMultiplierValue").textContent = format(metaData[2], 1, true)
    document.getElementById("corruptionTotalScore").textContent = format(metaData[3], 0, true)
    document.getElementById("corruptionCubesValue").textContent = format(metaData[4], 0, true)
    document.getElementById("corruptionTesseractsValue").textContent = format(metaData[5])
    document.getElementById("corruptionHypercubesValue").textContent = format(metaData[6])
    document.getElementById("corruptionPlatonicCubesValue").textContent = format(metaData[7])
    document.getElementById("corruptionAntExponentValue").textContent = format((1 - 0.9 / 90 * sumContents(player.usedCorruptions)) * extinctionMultiplier[player.usedCorruptions[7]], 3)
    document.getElementById("corruptionSpiritBonusValue").textContent = format(calculateCorruptionPoints()/400,2,true)
}

function visualUpdateSettings() {
    if (currentTab !== "settings")
        return
    //I was unable to clean this up in a way that didn't somehow make it less clean, sorry.
    document.getElementById("temporarystats1").textContent = "Prestige count: " + format(player.prestigeCount, 0, true)
    document.getElementById("temporarystats2").textContent = "Transcend count: " + format(player.transcendCount, 0, true)
    document.getElementById("temporarystats3").textContent = "Reincarnation count: " + format(player.reincarnationCount, 0, true)
    document.getElementById("temporarystats4").textContent = "Fastest Prestige: " + format(1000 * player.fastestprestige) + "ms"
    document.getElementById("temporarystats5").textContent = "Fastest Transcend: " + format(1000 * player.fastesttranscend) + "ms"
    document.getElementById("temporarystats6").textContent = "Fastest Reincarnation: " + format(1000 * player.fastestreincarnate) + "ms"
    document.getElementById("temporarystats7").textContent = "Most Offerings saved at once: " + format(player.maxofferings)
    document.getElementById("temporarystats8").textContent = "Most Obtainium saved at once: " + format(player.maxobtainium)
    document.getElementById("temporarystats9").textContent = "Best Obtainium/sec: " + format(player.maxobtainiumpersecond, 2, true)
    document.getElementById("temporarystats10").textContent = "Summative Rune Levels: " + format(runeSum)
    document.getElementById("temporarystats11").textContent = "Current Obtainium/sec " + format(player.obtainiumpersecond, 2, true)
    document.getElementById("temporarystats12").textContent = "Ascension Count: " + format(player.ascensionCount, 0, true)

    document.getElementById("saveString").textContent =
        `Currently: ${player.saveString.replace("$VERSION$", "v" + player.version)}`;

    const onExportQuarks = (Math.floor(player.quarkstimer / 3600) * (1 + player.researches[99] + player.researches[100] + talisman7Quarks + player.researches[125] + player.researches[180] + player.researches[195]));
    const maxExportQuarks = ((25 * (1 + player.researches[195] / 2)) * (1 + player.researches[99] + player.researches[100] + talisman7Quarks + player.researches[125] + player.researches[180] + player.researches[195]));

    document.getElementById("quarktimerdisplay").textContent = format((3600 - (player.quarkstimer % 3600.00001)), 2) + "s until +" + (1 + player.researches[99] + player.researches[100] + talisman7Quarks + player.researches[125] + player.researches[180] + player.researches[195]) + " export Quark"
    document.getElementById("quarktimeramount").textContent = "Quarks on export: "
        + onExportQuarks
        + " [Max "
        + format(maxExportQuarks)
        + "]"

    if (onExportQuarks === maxExportQuarks) {
        const settingsTab = document.getElementById('settingstab');
        settingsTab.style.backgroundColor = 'orange';
        settingsTab.style.border = '1px solid gold';
        settingsTab.setAttribute('full', 1);
    }
}

function visualUpdateShop() {
    if (currentTab !== "shop")
        return
    document.getElementById("quarkamount").textContent = "You have " + format(player.worlds) + " Quarks!"
    document.getElementById("offeringpotionowned").textContent = "Own: " + format(player.shopUpgrades.offeringPotion)
    document.getElementById("obtainiumpotionowned").textContent = "Own: " + format(player.shopUpgrades.obtainiumPotion)
    document.getElementById("offeringtimerlevel").textContent = "Level: " + player.shopUpgrades.offeringTimerLevel + "/15"
    document.getElementById("obtainiumtimerlevel").textContent = "Level: " + player.shopUpgrades.obtainiumTimerLevel + "/15"
    document.getElementById("offeringautolevel").textContent = "Level: " + player.shopUpgrades.offeringAutoLevel + "/15"
    document.getElementById("obtainiumautolevel").textContent = "Level: " + player.shopUpgrades.obtainiumAutoLevel + "/15"
    document.getElementById("instantchallenge").textContent = player.shopUpgrades.instantChallengeBought ? "Bought" : "Not Bought"
    document.getElementById("antspeed").textContent = "Level: " + player.shopUpgrades.antSpeedLevel + "/10"
    document.getElementById("cashgrab").textContent = "Level: " + player.shopUpgrades.cashGrabLevel + "/10"
    document.getElementById("shoptalisman").textContent = player.shopUpgrades.talismanBought ? "Bought" : "Not Bought"
    document.getElementById("challengeUpgradeLevel").textContent = "Level: " + player.shopUpgrades.challengeExtension + "/5"
    document.getElementById("challenge10TomeLevel").textContent = "Level: " + player.shopUpgrades.challenge10Tomes + "/15"
    document.getElementById("seasonPassLevel").textContent = "Level: " + player.shopUpgrades.seasonPassLevel + "/15"
    document.getElementById("cubeToQuark").textContent = player.shopUpgrades.cubeToQuarkBought ? "Bought" : "Not Bought"
    document.getElementById("tesseractToQuark").textContent = player.shopUpgrades.tesseractToQuarkBought ? "Bought" : "Not Bought"
    document.getElementById("hypercubeToQuark").textContent = player.shopUpgrades.hypercubeToQuarkBought ? "Bought" : "Not Bought"

    player.shopUpgrades.offeringTimerLevel === 15 ?
        document.getElementById("offeringtimerbutton").textContent = "Maxed!" :
        document.getElementById("offeringtimerbutton").textContent = "Upgrade for " + (shopBaseCosts.offerTimer + 25 * player.shopUpgrades.offeringTimerLevel) + " Quarks";

    player.shopUpgrades.offeringAutoLevel === 15 ?
        document.getElementById("offeringautobutton").textContent = "Maxed!" :
        document.getElementById("offeringautobutton").textContent = "Upgrade for " + (shopBaseCosts.offerAuto + 25 * player.shopUpgrades.offeringAutoLevel) + " Quarks"

    player.shopUpgrades.obtainiumTimerLevel === 15 ?
        document.getElementById("obtainiumtimerbutton").textContent = "Maxed!" :
        document.getElementById("obtainiumtimerbutton").textContent = "Upgrade for " + (shopBaseCosts.obtainiumTimer + 25 * player.shopUpgrades.obtainiumTimerLevel) + " Quarks"

    player.shopUpgrades.obtainiumAutoLevel === 15 ?
        document.getElementById("obtainiumautobutton").textContent = "Maxed!" :
        document.getElementById("obtainiumautobutton").textContent = "Upgrade for " + (shopBaseCosts.obtainiumAuto + 25 * player.shopUpgrades.obtainiumAutoLevel) + " Quarks";

    player.shopUpgrades.instantChallengeBought ?
        (document.getElementById("instantchallengebutton").textContent = "Bought!") :
        document.getElementById("instantchallengebutton").textContent = "Buy for " + (shopBaseCosts.instantChallenge) + " Quarks";

    player.shopUpgrades.antSpeedLevel === 10 ?
        document.getElementById("antspeedbutton").textContent = "Maxed!" :
        document.getElementById("antspeedbutton").textContent = "Upgrade for " + (shopBaseCosts.antSpeed + 80 * player.shopUpgrades.antSpeedLevel) + " Quarks";

    player.shopUpgrades.cashGrabLevel === 10 ?
        document.getElementById("cashgrabbutton").textContent = "Maxed!" :
        document.getElementById("cashgrabbutton").textContent = "Upgrade for " + (shopBaseCosts.cashGrab + 100 * player.shopUpgrades.cashGrabLevel) + " Quarks";

    player.shopUpgrades.talismanBought ?
        (document.getElementById("shoptalismanbutton").textContent = "Bought!") :
        document.getElementById("shoptalismanbutton").textContent = "Buy for 1500 Quarks";

    player.shopUpgrades.challengeExtension === 5 ?
        document.getElementById("challengeUpgradeButton").textContent = "Maxed!" :
        document.getElementById("challengeUpgradeButton").textContent = "Buy for " + (shopBaseCosts.challengeExtension + 250 * player.shopUpgrades.challengeExtension) + " Quarks";

    player.shopUpgrades.challenge10Tomes === 15 ?
        document.getElementById("challenge10TomeButton").textContent = "Maxed!" :
        document.getElementById("challenge10TomeButton").textContent = "Buy for " + (shopBaseCosts.challenge10Upgrade + 250 * player.shopUpgrades.challenge10Tomes) + " Quarks";

    player.shopUpgrades.seasonPassLevel === 15 ?
        document.getElementById("seasonPassButton").textContent = "Maxed!" :
        document.getElementById("seasonPassButton").textContent = "Buy for " + (shopBaseCosts.seasonPass + 250 * player.shopUpgrades.seasonPassLevel) + " Quarks";

    player.shopUpgrades.cubeToQuarkBought ?
        (document.getElementById("cubeToQuarkButton").textContent = "Maxed!") :
        document.getElementById("cubeToQuarkButton").textContent = "Buy for " + (shopBaseCosts.cubeToQuark) + " Quarks";

    player.shopUpgrades.tesseractToQuarkBought ?
        (document.getElementById("tesseractToQuarkButton").textContent = "Maxed!") :
        document.getElementById("tesseractToQuarkButton").textContent = "Buy for " + (shopBaseCosts.tesseractToQuark) + " Quarks";

    player.shopUpgrades.hypercubeToQuarkBought ?
        (document.getElementById("hypercubeToQuarkButton").textContent = "Maxed!") :
        document.getElementById("hypercubeToQuarkButton").textContent = "Buy for " + (shopBaseCosts.hypercubeToQuark) + " Quarks";
}
