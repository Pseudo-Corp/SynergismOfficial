function revealStuff() {

    let example = document.getElementsByClassName("coinunlock1");
    for (let i = 0; i < example.length; i++) {
        player.unlocks.coinone ? example[i].style.display = "block" : example[i].style.display = "none"
    }

    let example2 = document.getElementsByClassName("coinunlock2");
    for (let i = 0; i < example2.length; i++) {
        player.unlocks.cointwo ? example2[i].style.display = "block" : example2[i].style.display = "none"
    }

    let example3 = document.getElementsByClassName("coinunlock3");
    for (let i = 0; i < example3.length; i++) {
        player.unlocks.cointhree ? example3[i].style.display = "block" : example3[i].style.display = "none"
    }

    let example4 = document.getElementsByClassName("coinunlock4");
    for (let i = 0; i < example4.length; i++) {
        player.unlocks.coinfour ? example4[i].style.display = "block" : example4[i].style.display = "none"
    }

    let example5 = document.getElementsByClassName("prestigeunlock");
    for (let i = 0; i < example5.length; i++) {
        player.unlocks.prestige ? example5[i].style.display = "block" : example5[i].style.display = "none"
    }

    let example6 = document.getElementsByClassName("generationunlock");
    for (let i = 0; i < example6.length; i++) {
        player.unlocks.generation ? example6[i].style.display = "block" : example6[i].style.display = "none"
    }

    let example7 = document.getElementsByClassName("transcendunlock");
    for (let i = 0; i < example7.length; i++) {
        player.unlocks.transcend ? example7[i].style.display = "block" : example7[i].style.display = "none"
    }

    let example8 = document.getElementsByClassName("reincarnationunlock");
    for (let i = 0; i < example8.length; i++) {
        player.unlocks.reincarnate ? example8[i].style.display = "block" : example8[i].style.display = "none"
    }

    let example9 = document.getElementsByClassName("auto");
    for (let i = 0; i < example9.length; i++) {
        example9[i].style.display = "none"
    }

    let example10 = document.getElementsByClassName("reinrow1");
    for (let i = 0; i < example10.length; i++) {
        player.researches[47] === 1 ? example10[i].style.display = "block" : example10[i].style.display = "none"
    }

    let example11 = document.getElementsByClassName("reinrow2");
    for (let i = 0; i < example11.length; i++) {
        player.researches[48] === 1 ? example11[i].style.display = "block" : example11[i].style.display = "none"
    }

    let example12 = document.getElementsByClassName("reinrow3");
    for (let i = 0; i < example12.length; i++) {
        player.researches[49] === 1 ? example12[i].style.display = "block" : example12[i].style.display = "none"
    }

    let example13 = document.getElementsByClassName("reinrow4");
    for (let i = 0; i < example13.length; i++) {
        player.researches[50] === 1 ? example13[i].style.display = "block" : example13[i].style.display = "none"
    }

    let example14 = document.getElementsByClassName("chal6");
    for (let i = 0; i < example14.length; i++) {
        player.achievements[113] === 1 ? example14[i].style.display = "block" : example14[i].style.display = "none"
    }

    let example15 = document.getElementsByClassName("chal7");
    for (let i = 0; i < example15.length; i++) {
        player.achievements[120] === 1 ? example15[i].style.display = "block" : example15[i].style.display = "none"
    }

    let example16 = document.getElementsByClassName("chal7x10");
    for (let i = 0; i < example16.length; i++) {
        player.achievements[124] === 1 ? example16[i].style.display = "block" : example16[i].style.display = "none"
    }

    let example17 = document.getElementsByClassName("chal8");
    for (let i = 0; i < example17.length; i++) {
        player.achievements[127] === 1 ? example17[i].style.display = "block" : example17[i].style.display = "none"
    }

    let example18 = document.getElementsByClassName("chal9");
    for (let i = 0; i < example18.length; i++) {
        player.achievements[134] === 1 ? example18[i].style.display = "block" : example18[i].style.display = "none"
    }

    let example19 = document.getElementsByClassName("chal9x1");
    for (let i = 0; i < example19.length; i++) {
        player.highestchallengecompletions[9] > 0 ? example19[i].style.display = "block" : example19[i].style.display = "none"
    }

    let example20 = document.getElementsByClassName("chal10");
    for (let i = 0; i < example20.length; i++) {
        player.achievements[141] === 1 ? example20[i].style.display = "block" : example20[i].style.display = "none"
    }

    let example21 = document.getElementsByClassName("ascendunlock");
    for (let i = 0; i < example21.length; i++) {
        player.ascensionCount > 0 ? example21[i].style.display = "block" : example21[i].style.display = "none"
    }

    let example22 = document.getElementsByClassName("chal11");
    for (let i = 0; i < example22.length; i++) {
        player.challengecompletions[11] > 0 ? example22[i].style.display = "block" : example22[i].style.display = "none"
    }

    let example23 = document.getElementsByClassName("chal12");
    for (let i = 0; i < example23.length; i++) {
        player.challengecompletions[12] > 0 ? example23[i].style.display = "block" : example23[i].style.display = "none"
    }

    let example24 = document.getElementsByClassName("chal13");
    for (let i = 0; i < example24.length; i++) {
        player.challengecompletions[13] > 0 ? example24[i].style.display = "block" : example24[i].style.display = "none"
    }

    let example25 = document.getElementsByClassName("chal14");
    for (let i = 0; i < example25.length; i++) {
        player.challengecompletions[14] > 0 ? example25[i].style.display = "block" : example25[i].style.display = "none"
    }

    let example26 = document.getElementsByClassName("ascendunlockib");
    for (let i = 0; i < example26.length; i++) {
        example26[i].style.display = player.ascensionCount > 0 ? "inline-block" : "none"
    }

    let example27 = document.getElementsByClassName("prestigeunlockib");
    for (let i = 0; i < example27.length; i++) {
        example27[i].style.display = player.unlocks.prestige > 0 ? "inline-block" : "none"
    }

    let example28 = document.getElementsByClassName("research150");
    for (let i = 0; i < example28.length; i++) {
        example28[i].style.display = player.researches[150] > 0 ? "block" : "none"
    }

    let example29 = document.getElementsByClassName("cubeUpgrade10");
    for (let i = 0; i < example29.length; i++) {
        example29[i].style.display = player.cubeUpgrades[10] > 0 ? "block" : "none"
    }

    player.upgrades[89] === 1 ? //Automatic Transcension Upgrade
        document.getElementById("transcendautomation").style.display = "block" :
        document.getElementById("transcendautomation").style.display = "none";

    player.achievements[38] === 1 ? //Prestige Diamond Achievement 3
        document.getElementById("rune2area").style.display = "block" :
        document.getElementById("rune2area").style.display = "none";

    player.achievements[43] === 1 ? //Trasncend Mythos Achievement 1
        document.getElementById("prestigeautomation").style.display = "block" :
        document.getElementById("prestigeautomation").style.display = "none";

    player.achievements[44] === 1 ? //Transcend Mythos Achievement 2
        document.getElementById("rune3area").style.display = "block" :
        document.getElementById("rune3area").style.display = "none";

    player.achievements[102] === 1 ? //Cost+ Challenge Achievement 4
        document.getElementById("rune4area").style.display = "block" :
        document.getElementById("rune4area").style.display = "none";

    player.achievements[119] === 1 ? //Tax+ Challenge Achievement 7
        document.getElementById("talisman1area").style.display = "block" :
        document.getElementById("talisman1area").style.display = "none";

    player.achievements[126] === 1 ? //No MA Challenge Achievement 7
        document.getElementById("talisman2area").style.display = "block" :
        document.getElementById("talisman2area").style.display = "none";

    player.achievements[133] === 1 ? //Cost++ Challenge Achievement 7
        document.getElementById("talisman3area").style.display = "block" :
        document.getElementById("talisman3area").style.display = "none";

    player.achievements[134] === 1 ? //No Runes Challenge Achievement 1
        (document.getElementById("toggleRuneSubTab2").style.display = "block", document.getElementById("toggleRuneSubTab3").style.display = "block") :
        (document.getElementById("toggleRuneSubTab2").style.display = "none", document.getElementById("toggleRuneSubTab3").style.display = "none");

    player.achievements[140] === 1 ? //No Runes Challenge Achievement 7
        document.getElementById("talisman4area").style.display = "block" :
        document.getElementById("talisman4area").style.display = "none";

    player.achievements[147] === 1 ? //Sadistic Challenge Achievement 7
        document.getElementById("talisman5area").style.display = "block" :
        document.getElementById("talisman5area").style.display = "none";

    player.achievements[173] === 1 ? //Galactic Crumb Achievement 5
        document.getElementById("sacrificeAnts").style.display = "block" :
        document.getElementById("sacrificeAnts").style.display = "none";

    player.researches[39] > 0 ? //3x9 Research [Crystal Building Power]
        document.getElementById("reincarnationCrystalInfo").style.display = "block" :
        document.getElementById("reincarnationCrystalInfo").style.display = "none";

    player.researches[40] > 0 ? //3x10 Research [Mythos Shard Building Power]
        document.getElementById("reincarnationMythosInfo").style.display = "block" :
        document.getElementById("reincarnationMythosInfo").style.display = "none";

    player.researches[46] > 0 ? //5x6 Research [Auto R.]
        document.getElementById("reincarnateautomation").style.display = "block" :
        document.getElementById("reincarnateautomation").style.display = "none";

    player.researches[82] > 0 ? //2x17 Research [SI Rune Unlock]
        document.getElementById("rune5area").style.display = "block" :
        document.getElementById("rune5area").style.display = "none";

    player.researches[124] > 0 ? //5x24 Research [AutoSac]
        document.getElementById("toggleAutoSacrificeAnt").style.display = "block" :
        document.getElementById("toggleAutoSacrificeAnt").style.display = "none";

    player.antUpgrades[12] > 0 ? //Ant Talisman Unlock, Mortuus
        document.getElementById("talisman6area").style.display = "block" :
        document.getElementById("talisman6area").style.display = "none";

    player.shopUpgrades.offeringAutoLevel > 0 ? //Auto Offering Shop Purchase
        document.getElementById("toggleautosacrifice").style.display = "block" :
        document.getElementById("toggleautosacrifice").style.display = "none";

    player.shopUpgrades.obtainiumAutoLevel > 0 ? //Auto Research Shop Purchase
        document.getElementById("toggleautoresearch").style.display = "block" :
        document.getElementById("toggleautoresearch").style.display = "none";

    player.shopUpgrades.talismanBought ? //Plastic Talisman Shop Purchase
        document.getElementById("talisman7area").style.display = "block" :
        document.getElementById("talisman7area").style.display = "none";

    //I'll clean this up later. Note to 2019 Platonic: Fuck you
    let e = document.getElementsByClassName("auto");
    if (player.upgrades[81] === 1) {
        e[0].style.display = "block";
    }
    if (player.upgrades[82] === 1) {
        e[1].style.display = "block";
    }
    if (player.upgrades[83] === 1) {
        e[2].style.display = "block";
    }
    if (player.upgrades[84] === 1) {
        e[3].style.display = "block";
    }
    if (player.upgrades[85] === 1) {
        e[4].style.display = "block";
    }
    if (player.upgrades[86] === 1) {
        e[5].style.display = "block";
    }
    if (player.upgrades[87] === 1) {
        e[6].style.display = "block";
    }
    if (player.upgrades[88] === 1) {
        e[7].style.display = "block";
    }
    if (player.upgrades[91] === 1) {
        e[26].style.display = "block";
    }
    if (player.upgrades[92] === 1) {
        e[27].style.display = "block";
    }
    if (player.upgrades[99] === 1) {
        e[28].style.display = "block";
    }
    if (player.upgrades[90] === 1) {
        e[29].style.display = "block";
    }
    if (player.unlocks.prestige) {
        e[30].style.display = "block";
    }
    if (player.achievements[78] === 1) {
        e[8].style.display = "block";
    }
    if (player.achievements[85] === 1) {
        e[9].style.display = "block";
    }
    if (player.achievements[92] === 1) {
        e[10].style.display = "block";
    }
    if (player.achievements[99] === 1) {
        e[11].style.display = "block";
    }
    if (player.achievements[106] === 1) {
        e[12].style.display = "block";
    }
    if (player.achievements[43] === 1) {
        e[13].style.display = "block";
    }
    if (player.upgrades[94] === 1) {
        e[14].style.display = "block";
    }
    if (player.upgrades[95] === 1) {
        e[15].style.display = "block";
    }
    if (player.upgrades[96] === 1) {
        e[16].style.display = "block";
    }
    if (player.upgrades[97] === 1) {
        e[17].style.display = "block";
    }
    if (player.upgrades[98] === 1) {
        e[18].style.display = "block";
    }
    if (player.upgrades[89] === 1) {
        e[19].style.display = "block";
    }
    if (player.cubeUpgrades[7] === 1) {
        e[20].style.display = "block";
    }
    if (player.cubeUpgrades[7] === 1) {
        e[21].style.display = "block";
    }
    if (player.cubeUpgrades[7] === 1) {
        e[22].style.display = "block";
    }
    if (player.cubeUpgrades[7] === 1) {
        e[23].style.display = "block";
    }
    if (player.cubeUpgrades[7] === 1) {
        e[24].style.display = "block";
    }
    if (player.researches[46] === 1) {
        e[25].style.display = "block";
    }
    if (player.prestigeCount > 0.5 || player.reincarnationCount > 0.5) {
        e[31].style.display = "block";
    }
    if (player.transcendCount > 0.5 || player.reincarnationCount > 0.5) {
        e[32].style.display = "block";
    }
    if (player.reincarnationCount > 0.5) {
        e[33].style.display = "block";
    }
}

function hideStuff() {

    document.getElementById("buildings").style.display = "none"
    document.getElementById("buildingstab").style.backgroundColor = "#171717";
    document.getElementById("upgrades").style.display = "none"
    document.getElementById("upgradestab").style.backgroundColor = "#171717"
    document.getElementById("settings").style.display = "none"

    const settingsTab = document.getElementById("settingstab");
    if (settingsTab.getAttribute('full') === '0') {
        settingsTab.style.backgroundColor = "#171717"
        settingsTab.style.color = "white"
        settingsTab.style.border = '1px solid white';
    }

    document.getElementById("statistics").style.display = "none"
    document.getElementById("achievementstab").style.backgroundColor = "#171717"
    document.getElementById("achievementstab").style.color = "white"
    document.getElementById("runes").style.display = "none"
    document.getElementById("runestab").style.backgroundColor = "#171717"
    document.getElementById("challenges").style.display = "none"
    document.getElementById("challengetab").style.backgroundColor = "#171717"
    document.getElementById("research").style.display = "none"
    document.getElementById("researchtab").style.backgroundColor = "#171717"
    document.getElementById("shop").style.display = "none"
    document.getElementById("shoptab").style.backgroundColor = "purple"
    document.getElementById("ants").style.display = "none"
    document.getElementById("anttab").style.backgroundColor = "#171717"
    document.getElementById("cubetab").style.backgroundColor = "#171717"
    document.getElementById("traitstab").style.backgroundColor = "#171717"
    document.getElementById("cubes").style.display = "none"
    document.getElementById("traits").style.display = "none"


    document.getElementById("activaterune2").style.display = "none"
    document.getElementById("activaterune3").style.display = "none"
    document.getElementById("activaterune4").style.display = "none"

    if (currentTab === "buildings") {
        document.getElementById("buildingstab").style.backgroundColor = "orange";
        document.getElementById("buildings").style.display = "block"
        player.tabnumber = 1;
    }
    if (currentTab === "upgrades") {
        document.getElementById("upgrades").style.display = "block"
        document.getElementById("upgradestab").style.backgroundColor = "orange"
        document.getElementById("upgradedescription").textContent = "Hover over an upgrade to view details!"
        player.tabnumber = 2;
    }
    if (currentTab === "settings") {
        document.getElementById("settings").style.display = "block"
        if (settingsTab.getAttribute('full') === '0') {
            settingsTab.style.backgroundColor = "white"
            settingsTab.style.color = "black"
            settingsTab.style.border = '1px solid white';
        }
    }
    if (currentTab === "achievements") {
        document.getElementById("statistics").style.display = "block"
        document.getElementById("achievementstab").style.backgroundColor = "white"
        document.getElementById("achievementstab").style.color = "black"
        document.getElementById("achievementprogress").textContent = "Achievement Points: " + player.achievementPoints + "/" + totalachievementpoints + " [" + (100 * player.achievementPoints / totalachievementpoints).toPrecision(4) + "%]"
        player.tabnumber = 3;
    }
    if (currentTab === "runes") {
        document.getElementById("runes").style.display = "block"
        document.getElementById("runestab").style.backgroundColor = "blue"
        document.getElementById("runeshowlevelup").textContent = "Hey, hover over a rune icon to get details on what each one does and what benefits they're giving you!"
        document.getElementById("researchrunebonus").textContent = "Thanks to researches, your effective levels are increased by " + (100 * effectiveLevelMult - 100).toPrecision(4) + "%"
        displayRuneInformation(1, false)
        displayRuneInformation(2, false)
        displayRuneInformation(3, false)
        displayRuneInformation(4, false)
        displayRuneInformation(5, false)
        player.tabnumber = 4;
    }
    if (currentTab === "challenges") {
        document.getElementById("challenges").style.display = "block";
        document.getElementById("challengetab").style.backgroundColor = "purple";
        player.tabnumber = 5;
    }
    if (currentTab === "researches") {
        document.getElementById("research").style.display = "block";
        document.getElementById("researchtab").style.backgroundColor = "green";
        player.tabnumber = 6;
    }
    if (currentTab === "shop") {
        document.getElementById("shop").style.display = "block";
        document.getElementById("shoptab").style.backgroundColor = "limegreen";
    }
    if (currentTab === "ants") {
        document.getElementById("ants").style.display = "block";
        document.getElementById("anttab").style.backgroundColor = "brown";
        player.tabnumber = 7;
    }
    if (currentTab === "cubes") {
        document.getElementById("cubes").style.display = "block";
        document.getElementById("cubetab").style.backgroundColor = "white"
        player.tabnumber = 8;
    }
    if (currentTab === "traits") {
        document.getElementById("traits").style.display = "block";
        document.getElementById("traitstab").style.backgroundColor = "white";
        player.tabnumber = 9;
    }

    if (player.achievements[38] > 0.5) {
        document.getElementById("activaterune2").style.display = "block"
    }
    if (player.achievements[44] > 0.5) {
        document.getElementById("activaterune3").style.display = "block"
    }
    if (player.achievements[102] > 0.5) {
        document.getElementById("activaterune4").style.display = "block"
    }
}

function htmlInserts() {

    // ALWAYS Update these, for they are the most important resources
    document.getElementById("coinDisplay").textContent = format(player.coins)
    document.getElementById("offeringDisplay").textContent = format(player.runeshards)
    document.getElementById("diamondDisplay").textContent = format(player.prestigePoints)
    document.getElementById("mythosDisplay").textContent = format(player.transcendPoints)
    document.getElementById("mythosshardDisplay").textContent = format(player.transcendShards)
    document.getElementById("particlesDisplay").textContent = format(player.reincarnationPoints)
    document.getElementById("quarkDisplay").textContent = format(player.worlds)
    document.getElementById("obtainiumDisplay").textContent = format(player.researchPoints)

    //When you're in Building --> Coin, update these.
    if (currentTab === "buildings" && buildingSubTab === "coin") {
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
        document.getElementById("buildtext15").textContent = "Accelerator Boost: " + format(player.acceleratorBoostBought, 0, true) + " [+" + format(freeAcceleratorBoost, 0, true) + "]"
        document.getElementById("buildtext16").textContent = "Reset Diamonds and Prestige Upgrades, but add " + (tuSevenMulti * (1 + player.researches[16] / 50) * (1 + player.challengecompletions[2] / 100)).toPrecision(4) + "% Acceleration Power and 5 free Accelerators."
        document.getElementById("buyaccelerator").textContent = "Cost: " + format(player.acceleratorCost) + " coins."
        document.getElementById("buymultiplier").textContent = "Cost: " + format(player.multiplierCost) + " coins."
        document.getElementById("buyacceleratorboost").textContent = "Cost: " + format(player.acceleratorBoostCost) + " Diamonds."
    }

    if (currentTab === "buildings" && buildingSubTab === "diamond") {
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
            document.getElementById("autoprestige").textContent = "Prestige when the timer is at least " + (player.prestigeamount) + " seconds. [Toggle number above]. Current timer: " + format(player.prestigecounter, 1) + "s."
        }
    }

    if (currentTab === "buildings" && buildingSubTab === "mythos") {
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
            document.getElementById("autotranscend").textContent = "Transcend when the timer is at least " + (player.transcendamount) + " seconds. [Toggle number above]. Current timer: " + format(player.transcendcounter, 1) + "s."
        }
    }

    if (currentTab === "buildings" && buildingSubTab === "particle") {

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
        document.getElementById("reincarnationCrystalInfo").textContent = "Thanks to Research 3x9, you also multiply Crystal production by " + format(Decimal.pow(reincarnationMultiplier, 1 / 50), 3, false)
        document.getElementById("reincarnationMythosInfo").textContent = "Thanks to Research 3x10, you also multiply Mythos Shard production by " + format(Decimal.pow(reincarnationMultiplier, 1 / 250), 3, false)

        if (player.resettoggle3 === 1 || player.resettoggle3 === 0) {
            document.getElementById("autoreincarnate").textContent = "Reincarnate when your Particles can increase by a factor " + format(Decimal.pow(10, player.reincarnationamount)) + " [Toggle number above]. Current Multiplier: " + format(Decimal.pow(10, Decimal.log(reincarnationPointGain.add(1), 10) - Decimal.log(player.reincarnationPoints.add(1), 10), 2)) + "."
        }
        if (player.resettoggle3 === 2) {
            document.getElementById("autoreincarnate").textContent = "Reincarnate when the timer is at least " + (player.reincarnationamount) + " seconds. [Toggle number above]. Current timer: " + format(player.reincarnationcounter, 1) + "s."
        }
    }

    if (currentTab === "buildings" && buildingSubTab === "tesseract") {
        let names = [null, 'Dot', 'Vector', 'Three-Space', 'Bent Time', 'Hilbert Space']
        let perSecNames = [null, '+Constant/sec', 'Dot/sec', 'Vector/sec', 'Three-Space/sec', 'Bent Time/sec']
        for (let i = 1; i <= 5; i++) {
            document.getElementById("ascendText" + i).textContent = names[i] + ": " + format(player['ascendBuilding' + i]['owned'], 0, true) + " [+" + format(player['ascendBuilding' + i]['generated'], 2) + "]"
            document.getElementById("ascendText" + (5 + i)).textContent = perSecNames[i] + ": " + format((ascendBuildingProduction[ordinals[i - 1]]), 2)
            document.getElementById("buyTesseracts" + i).textContent = "Cost: " + format(player['ascendBuilding' + i]['cost'], 0) + " Tesseracts"
        }

        document.getElementById("tesseractInfo").textContent = "You have " + format(player.wowTesseracts) + " Wow! Tesseracts. Gain more by beating Challenge 10 on each Ascension."
        document.getElementById("ascendShardInfo").textContent = "You have a mathematical constant of " + format(player.ascendShards, 2) + ". Taxes are divided by " + format(Decimal.log(player.ascendShards.add(1), 10) + 1, 4, true) + "."
    }

    if (currentTab === "upgrades") {
    }

    if (currentTab === "settings") {
    }

    if (currentTab === "achievements") {
    }

    if (currentTab === "runes") {

        if (runescreen === "runes") { //Placeholder and place work similarly to buildings, except for the specific Talismans.
            let placeholder = ''
            let place = ''

            document.getElementById("runeshards").textContent = "You have " + format(player.runeshards, 0, true) + " Offerings."

            for (let i = 1; i <= 5; i++) { //First one updates level, second one updates TNL, third updates orange bonus levels
                placeholder = 'rune' + i + "Talisman"
                place = window[placeholder]

                document.getElementById('rune' + i + 'level').childNodes[0].textContent = "Level: " + format(player.runelevels[i - 1]) + "/" + format(calculateMaxRunes(i))
                document.getElementById('rune' + i + 'exp').textContent = "+1 in " + format(calculateRuneExpToLevel(i - 1) - player.runeexp[i - 1], 2) + " EXP"
                document.getElementById('bonusrune' + i).textContent = " [" + format(17 * player.constantUpgrades[7] + 3 * (player.antUpgrades[9] + bonusant9) + place) + "]"
            }

            document.getElementById("runedetails").textContent = "Gain " + format((1 + Math.min(player.highestchallengecompletions[1], 1) + 1 / 10 * player.highestchallengecompletions[1] + 0.6 * player.researches[22] + 0.3 * player.researches[23] + 3 / 25 * player.upgrades[66] + 2 * player.upgrades[61]) * calculateRecycleMultiplier(), 2, true) + "* EXP per offering sacrificed."
            document.getElementById("runerecycle").textContent = "You have " + (5 * player.achievements[80] + 5 * player.achievements[87] + 5 * player.achievements[94] + 5 * player.achievements[101] + 5 * player.achievements[108] + 5 * player.achievements[115] + 7.5 * player.achievements[122] + 7.5 * player.achievements[129] + 5 * player.upgrades[61] + Math.min(25, player.runelevels[3] / 40) + 0.5 * player.cubeUpgrades[2]) + "% chance of recycling your offerings. This multiplies EXP gain by " + format(calculateRecycleMultiplier(), 2, true) + "!"

        }

        if (runescreen === "talismans") {
            for (let i = 1; i <= 7; i++) {
                document.getElementById('talisman' + i + 'level').textContent = "Level " + player.talismanLevels[i] + "/" + (30 * player.talismanRarity[i] + 6 * player.challengecompletions[13] + Math.floor(player.researches[200] / 100))
            }
        }

        if (runescreen === "blessings") {
            let blessingMultiplierArray = [0, 12, 10, 6.66, 2, 1]
            let t = 0;
            for (let i = 1; i <= 5; i++) {
                document.getElementById('runeBlessingLevel' + i + 'Value').textContent = format(player.runeBlessingLevels[i], 0, true)
                document.getElementById('runeBlessingPower' + i + 'Value1').textContent = format(runeBlessings[i])
                document.getElementById('runeBlessingPurchaseAmount' + i).textContent = format(Math.max(1, calculateSummationLinear(player.runeBlessingLevels[i], 1e7, player.runeshards, player.runeBlessingBuyAmount)[0] - player.runeBlessingLevels[i]))
                document.getElementById('runeBlessingPurchaseCost' + i).textContent = format(Math.max(1e7 * (1 + player.runeBlessingLevels[i]), calculateSummationLinear(player.runeBlessingLevels[i], 1e7, player.runeshards, player.runeBlessingBuyAmount)[1]))
                if (i === 5) {
                    t = 1
                }
                document.getElementById('runeBlessingPower' + i + 'Value2').textContent = format(1 - t + blessingMultiplierArray[i] * effectiveRuneBlessingPower[i], 4, true)
            }
        }

        if (runescreen === "spirits") {
            let spiritMultiplierArray = [0, 1, 1, 20, 1, 20]
            let subtract = [0, 0, 0, 1, 0, 1]
            for (let i = 1; i <= 5; i++) {
                spiritMultiplierArray[i] *= (calculateCorruptionPoints() / 400)
                document.getElementById('runeSpiritLevel' + i + 'Value').textContent = format(player.runeSpiritLevels[i], 0, true)
                document.getElementById('runeSpiritPower' + i + 'Value1').textContent = format(runeSpirits[i])
                document.getElementById('runeSpiritPurchaseAmount' + i).textContent = format(Math.max(1, calculateSummationLinear(player.runeSpiritLevels[i], 1e20, player.runeshards, player.runeSpiritBuyAmount)[0] - player.runeSpiritLevels[i]))
                document.getElementById('runeSpiritPurchaseCost' + i).textContent = format(Math.max(1e20 * (1 + player.runeSpiritLevels[i]), calculateSummationLinear(player.runeSpiritLevels[i], 1e20, player.runeshards, player.runeSpiritBuyAmount)[1]))
                document.getElementById('runeSpiritPower' + i + 'Value2').textContent = format(1 - subtract[i] + spiritMultiplierArray[i] * effectiveRuneSpiritPower[i], 4, true)
            }
        }
    }

    if (currentTab === "challenges") {
        if (player.researches[150] > 0) {
            document.getElementById("autoIncrementerAmount").textContent = format(autoChallengeTimerIncrement, 2) + "s"
        }
    }

    if (currentTab === "researches") {
    }

    if (currentTab === "settings") {
        //I was unable to clean this up in a way that didn't somehow make it less clean, sorry.
        document.getElementById("temporarystats1").textContent = "Prestige count: " + format(player.prestigeCount)
        document.getElementById("temporarystats2").textContent = "Transcend count: " + format(player.transcendCount)
        document.getElementById("temporarystats3").textContent = "Reincarnation count: " + format(player.reincarnationCount)
        document.getElementById("temporarystats4").textContent = "Fastest Prestige: " + format(1000 * player.fastestprestige) + "ms"
        document.getElementById("temporarystats5").textContent = "Fastest Transcend: " + format(1000 * player.fastesttranscend) + "ms"
        document.getElementById("temporarystats6").textContent = "Fastest Reincarnation: " + format(1000 * player.fastestreincarnate) + "ms"
        document.getElementById("temporarystats7").textContent = "Most Offerings saved at once: " + format(player.maxofferings)
        document.getElementById("temporarystats8").textContent = "Most Obtainium saved at once: " + format(player.maxobtainium)
        document.getElementById("temporarystats9").textContent = "Best Obtainium/sec: " + format(player.maxobtainiumpersecond, 2, true)
        document.getElementById("temporarystats10").textContent = "Summative Rune Levels: " + format(runeSum)
        document.getElementById("temporarystats11").textContent = "Current Obtainium/sec " + format(player.obtainiumpersecond, 2, true)
    }

    if (currentTab === "shop") {
        document.getElementById("quarkamount").textContent = "You have " + format(player.worlds) + " Quarks!"
        document.getElementById("offeringpotionowned").textContent = "Own: " + format(player.shopUpgrades.offeringPotion)
        document.getElementById("obtainiumpotionowned").textContent = "Own: " + format(player.shopUpgrades.obtainiumPotion)
        document.getElementById("offeringtimerlevel").textContent = "Level: " + player.shopUpgrades.offeringTimerLevel + "/7"
        document.getElementById("obtainiumtimerlevel").textContent = "Level: " + player.shopUpgrades.obtainiumTimerLevel + "/7"
        document.getElementById("offeringautolevel").textContent = "Level: " + player.shopUpgrades.offeringAutoLevel + "/7"
        document.getElementById("obtainiumautolevel").textContent = "Level: " + player.shopUpgrades.obtainiumAutoLevel + "/7"
        document.getElementById("instantchallenge").textContent = "Not Bought"
        document.getElementById("antspeed").textContent = "Level: " + player.shopUpgrades.antSpeedLevel + "/3"
        document.getElementById("cashgrab").textContent = "Level: " + player.shopUpgrades.cashGrabLevel + "/7"
        document.getElementById("shoptalisman").textContent = "Not Bought"

        player.shopUpgrades.offeringTimerLevel === 7 ?
            document.getElementById("offeringtimerbutton").textContent = "Maxed!" :
            document.getElementById("offeringtimerbutton").textContent = "Upgrade for " + (shopBaseCosts.offerTimer + 25 * player.shopUpgrades.offeringTimerLevel) + " Quarks";

        player.shopUpgrades.offeringAutoLevel === 7 ?
            document.getElementById("offeringautobutton").textContent = "Maxed!" :
            document.getElementById("offeringautobutton").textContent = "Upgrade for " + (shopBaseCosts.offerAuto + 25 * player.shopUpgrades.offeringAutoLevel) + " Quarks"

        player.shopUpgrades.obtainiumTimerLevel === 7 ?
            document.getElementById("obtainiumtimerbutton").textContent = "Maxed!" :
            document.getElementById("obtainiumtimerbutton").textContent = "Upgrade for " + (shopBaseCosts.obtainiumTimer + 25 * player.shopUpgrades.obtainiumTimerLevel) + " Quarks"

        player.shopUpgrades.obtainiumAutoLevel === 7 ?
            document.getElementById("obtainiumautobutton").textContent = "Maxed!" :
            document.getElementById("obtainiumautobutton").textContent = "Upgrade for " + (shopBaseCosts.obtainiumAuto + 25 * player.shopUpgrades.obtainiumAutoLevel) + " Quarks";

        player.shopUpgrades.instantChallengeBought ?
            (document.getElementById("instantchallengebutton").textContent = "Bought!", document.getElementById("instantchallenge").textContent = "Bought!") :
            document.getElementById("instantchallengebutton").textContent = "Buy for " + (shopBaseCosts.instantChallenge) + " Quarks";

        player.shopUpgrades.antSpeedLevel === 3 ?
            document.getElementById("antspeedbutton").textContent = "Maxed!" :
            document.getElementById("antspeedbutton").textContent = "Upgrade for " + (shopBaseCosts.antSpeed + 200 * player.shopUpgrades.antSpeedLevel) + " Quarks";

        player.shopUpgrades.cashGrabLevel === 7 ?
            document.getElementById("cashgrabbutton").textContent = "Maxed!" :
            document.getElementById("cashgrabbutton").textContent = "Upgrade for " + (shopBaseCosts.cashGrab + 100 * player.shopUpgrades.cashGrabLevel) + " Quarks";

        player.shopUpgrades.talismanBought ?
            (document.getElementById("shoptalismanbutton").textContent = "Bought!", document.getElementById("shoptalisman").textContent = "Bought!") :
            document.getElementById("shoptalismanbutton").textContent = "Buy for 1500 Quarks";
    }

    if (currentTab === "ants") {
        document.getElementById("crumbcount").textContent = "You have " + format(player.antPoints, 2) + " Galactic Crumbs [" + format(antOneProduce, 2) + "/s], providing a " + format(Decimal.pow(Decimal.max(1, player.antPoints), 100000 + calculateSigmoidExponential(49900000, (player.antUpgrades[2] + bonusant2) / 5000 * 500 / 499))) + "x Coin Multiplier."
    }

    if (currentTab === "cubes") {
        document.getElementById("cubeAmount2").textContent = "You have " + format(player.wowCubes, 0, true) + " Wow! Cubes =)"
    }

    if (currentTab === "traits") {
        document.getElementById("autoAscendMetric").textContent = format(player.autoAscendThreshold, 0, true)
    }
}


function buttoncolorchange() {

    (player.toggles.fifteen && player.achievements[43] === 1) ?
        document.getElementById('prestigebtn').style.backgroundColor = "green" :
        document.getElementById('prestigebtn').style.backgroundColor = "#171717";

    (player.toggles.twentyone && player.upgrades[89] > 0.5 && (player.currentChallenge.transcension === 0)) ?
        document.getElementById('transcendbtn').style.backgroundColor = "green" :
        document.getElementById('transcendbtn').style.backgroundColor = "#171717";

    (player.toggles.twentyseven && player.researches[46] > 0.5 && (player.currentChallenge.transcension === 0 && player.currentChallenge.reincarnation === 0)) ?
        document.getElementById('reincarnatebtn').style.backgroundColor = "green" :
        document.getElementById('reincarnatebtn').style.backgroundColor = "#171717";

    (player.toggles.eight && player.upgrades[88] > 0.5) ?
        document.getElementById('acceleratorboostbtn').style.backgroundColor = "green" :
        document.getElementById('acceleratorboostbtn').style.backgroundColor = "#171717";

    (player.currentChallenge.transcension === 0) ?
        document.getElementById('challengebtn').style.backgroundColor = "#171717" :
        document.getElementById('challengebtn').style.backgroundColor = "purple";

    (player.currentChallenge.reincarnation === 0) ?
        document.getElementById('reincarnatechallengebtn').style.backgroundColor = "#171717" :
        document.getElementById('reincarnatechallengebtn').style.backgroundColor = "purple";

    (player.currentChallenge.ascension === 0) ?
        document.getElementById('ascendChallengeBtn').style.backgroundColor = "#171717" :
        document.getElementById('ascendChallengeBtn').style.backgroundColor = "purple";

    if (currentTab === "buildings" && buildingSubTab === "coin") {
        let a = document.getElementById("buycoin1");
        let b = document.getElementById("buycoin2");
        let c = document.getElementById("buycoin3");
        let d = document.getElementById("buycoin4");
        let e = document.getElementById("buycoin5");
        let f = document.getElementById("buyaccelerator");
        let g = document.getElementById("buymultiplier");
        let h = document.getElementById("buyacceleratorboost");
        ((!player.toggles.one || player.upgrades[81] === 0) && player.coins.greaterThanOrEqualTo(player.firstCostCoin)) ?
            a.style.backgroundColor = "#555555" :
            a.style.backgroundColor = "#171717";
        ((!player.toggles.two || player.upgrades[82] === 0) && player.coins.greaterThanOrEqualTo(player.secondCostCoin)) ?
            b.style.backgroundColor = "#555555" :
            b.style.backgroundColor = "#171717";
        ((!player.toggles.three || player.upgrades[83] === 0) && player.coins.greaterThanOrEqualTo(player.thirdCostCoin)) ?
            c.style.backgroundColor = "#555555" :
            c.style.backgroundColor = "#171717";
        ((!player.toggles.four || player.upgrades[84] === 0) && player.coins.greaterThanOrEqualTo(player.fourthCostCoin)) ?
            d.style.backgroundColor = "#555555" :
            d.style.backgroundColor = "#171717";
        ((!player.toggles.five || player.upgrades[85] === 0) && player.coins.greaterThanOrEqualTo(player.fifthCostCoin)) ?
            e.style.backgroundColor = "#555555" :
            e.style.backgroundColor = "#171717";
        ((!player.toggles.six || player.upgrades[86] === 0) && player.coins.greaterThanOrEqualTo(player.acceleratorCost)) ?
            f.style.backgroundColor = "#555555" :
            f.style.backgroundColor = "#171717";
        ((!player.toggles.seven || player.upgrades[87] === 0) && player.coins.greaterThanOrEqualTo(player.multiplierCost)) ?
            g.style.backgroundColor = "#555555" :
            g.style.backgroundColor = "#171717";
        ((!player.toggles.eight || player.upgrades[88] === 0) && player.prestigePoints.greaterThanOrEqualTo(player.acceleratorBoostCost)) ?
            h.style.backgroundColor = "#555555" :
            h.style.backgroundColor = "#171717";
    }

    if (currentTab === "buildings" && buildingSubTab === "diamond") {
        let a = document.getElementById("buydiamond1");
        let b = document.getElementById("buydiamond2");
        let c = document.getElementById("buydiamond3");
        let d = document.getElementById("buydiamond4");
        let e = document.getElementById("buydiamond5");
        let f = document.getElementById("buycrystalupgrade1");
        let g = document.getElementById("buycrystalupgrade2");
        let h = document.getElementById("buycrystalupgrade3");
        let i = document.getElementById("buycrystalupgrade4");
        let j = document.getElementById("buycrystalupgrade5");
        ((!player.toggles.ten || player.achievements[78] === 0) && player.prestigePoints.greaterThanOrEqualTo(player.firstCostDiamonds)) ? a.style.backgroundColor = "#555555" : a.style.backgroundColor = "#171717";
        ((!player.toggles.eleven || player.achievements[85] === 0) && player.prestigePoints.greaterThanOrEqualTo(player.secondCostDiamonds)) ? b.style.backgroundColor = "#555555" : b.style.backgroundColor = "#171717";
        ((!player.toggles.twelve || player.achievements[92] === 0) && player.prestigePoints.greaterThanOrEqualTo(player.thirdCostDiamonds)) ? c.style.backgroundColor = "#555555" : c.style.backgroundColor = "#171717";
        ((!player.toggles.thirteen || player.achievements[99] === 0) && player.prestigePoints.greaterThanOrEqualTo(player.fourthCostDiamonds)) ? d.style.backgroundColor = "#555555" : d.style.backgroundColor = "#171717";
        ((!player.toggles.fourteen || player.achievements[106] === 0) && player.prestigePoints.greaterThanOrEqualTo(player.fifthCostDiamonds)) ? e.style.backgroundColor = "#555555" : e.style.backgroundColor = "#171717";
        let k = 0;
        k += Math.floor(rune3level / 40 * (1 + player.researches[5] / 10) * (1 + player.researches[21] / 800) * (1 + player.researches[90] / 100)) * 100 / 100
        if (player.upgrades[73] === 1 && player.currentChallenge.reincarnation !== 0) {
            k += 10
        }
        ;
        (player.achievements[79] < 1 && player.prestigeShards.greaterThanOrEqualTo(Decimal.pow(10, (crystalUpgradesCost[0] + crystalUpgradeCostIncrement[0] * Math.floor(Math.pow(player.crystalUpgrades[0] + 0.5 - k, 2) / 2))))) ? f.style.backgroundColor = "purple" : f.style.backgroundColor = "#171717";
        (player.achievements[86] < 1 && player.prestigeShards.greaterThanOrEqualTo(Decimal.pow(10, (crystalUpgradesCost[1] + crystalUpgradeCostIncrement[1] * Math.floor(Math.pow(player.crystalUpgrades[1] + 0.5 - k, 2) / 2))))) ? g.style.backgroundColor = "purple" : g.style.backgroundColor = "#171717";
        (player.achievements[93] < 1 && player.prestigeShards.greaterThanOrEqualTo(Decimal.pow(10, (crystalUpgradesCost[2] + crystalUpgradeCostIncrement[2] * Math.floor(Math.pow(player.crystalUpgrades[2] + 0.5 - k, 2) / 2))))) ? h.style.backgroundColor = "purple" : h.style.backgroundColor = "#171717";
        (player.achievements[100] < 1 && player.prestigeShards.greaterThanOrEqualTo(Decimal.pow(10, (crystalUpgradesCost[3] + crystalUpgradeCostIncrement[3] * Math.floor(Math.pow(player.crystalUpgrades[3] + 0.5 - k, 2) / 2))))) ? i.style.backgroundColor = "purple" : i.style.backgroundColor = "#171717";
        (player.achievements[107] < 1 && player.prestigeShards.greaterThanOrEqualTo(Decimal.pow(10, (crystalUpgradesCost[4] + crystalUpgradeCostIncrement[4] * Math.floor(Math.pow(player.crystalUpgrades[4] + 0.5 - k, 2) / 2))))) ? j.style.backgroundColor = "purple" : j.style.backgroundColor = "#171717";
    }

    if (currentTab === "runes") {
        if (runescreen === "runes") {
            for (let i = 1; i <= 5; i++) {
                player.runeshards > 0.5 ? document.getElementById("activaterune" + i).style.backgroundColor = "purple" : document.getElementById("activaterune" + i).style.backgroundColor = "#171717";
            }
        }
        if (runescreen === "talismans") {
            let a = document.getElementById("buyShard");
            let b = document.getElementById("buyCommonFragment");
            let c = document.getElementById("buyUncommonFragment");
            let d = document.getElementById("buyRareFragment");
            let e = document.getElementById("buyEpicFragment");
            let f = document.getElementById("buyLegendaryFragment");
            let g = document.getElementById("buyMythicalFragment");
            (player.researchPoints > 1e6) ? a.style.backgroundColor = "purple" : a.style.backgroundColor = "#171717";
            (player.researchPoints > 3e6) ? b.style.backgroundColor = "purple" : b.style.backgroundColor = "#171717";
            (player.researchPoints > 1e7 && player.runeshards > 5) ? c.style.backgroundColor = "purple" : c.style.backgroundColor = "#171717";
            (player.researchPoints > 1e8 && player.runeshards > 40) ? d.style.backgroundColor = "purple" : d.style.backgroundColor = "#171717";
            (player.researchPoints > 1e9 && player.runeshards > 400) ? e.style.backgroundColor = "purple" : e.style.backgroundColor = "#171717";
            (player.researchPoints > 1e10 && player.runeshards > 2000) ? f.style.backgroundColor = "purple" : f.style.backgroundColor = "#171717";
            (player.researchPoints > 1e11 && player.runeshards > 10000) ? g.style.backgroundColor = "purple" : g.style.backgroundColor = "#171717";
        }
    }

    if (currentTab === "buildings" && buildingSubTab === "mythos") {
        let ordArray = [null, 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty']
        for (let i = 1; i <= 5; i++) {
            ((player.toggles[ordArray[i]] || player.upgrades[93 + i]) && player.transcendPoints.greaterThanOrEqualTo(player[ordinals[i - 1] + 'CostMythos'])) ? document.getElementById('buymythos' + i).style.backgroundColor = "#555555" : document.getElementById('buymythos' + i).style.backgroundColor = "#171717"
        }
    }

    if (currentTab === "buildings" && buildingSubTab === "particle") {
        for (let i = 1; i <= 5; i++) {
            (player.reincarnationPoints.greaterThanOrEqualTo(player[ordinals[i - 1] + 'CostParticles'])) ? document.getElementById("buyparticles" + i).style.backgroundColor = "#555555" : document.getElementById("buyparticles" + i).style.backgroundColor = "#171717";
        }
    }

    if (currentTab === "buildings" && buildingSubTab === "tesseract") {
        for (let i = 1; i <= 5; i++) {
            (player.wowTesseracts >= (player['ascendBuilding' + i]['cost'])) ?
                document.getElementById('buyTesseracts' + i).style.backgroundColor = "#555555" :
                document.getElementById('buyTesseracts' + i).style.backgroundColor = "#171717";
        }
        for (let i = 1; i <= 8; i++) {
            (player.ascendShards.greaterThanOrEqualTo(Decimal.pow(10, player.constantUpgrades[i]).times(constUpgradeCosts[i]))) ?
                document.getElementById('buyConstantUpgrade' + i).style.backgroundColor = "green" :
                document.getElementById('buyConstantUpgrade' + i).style.backgroundColor = "#171717";
        }
        for (let i = 9; i <= 10; i++) {
            (player.ascendShards.greaterThanOrEqualTo(Decimal.pow(10, player.constantUpgrades[i]).times(constUpgradeCosts[i])) || player.constantUpgrades[i] >= 1) ?
                document.getElementById('buyConstantUpgrade' + i).style.backgroundColor = "gold" :
                document.getElementById('buyConstantUpgrade' + i).style.backgroundColor = "#171717";
        }
    }

    if (currentTab === "ants") {
        (player.reincarnationPoints.greaterThanOrEqualTo(player.firstCostAnts)) ? document.getElementById("anttier1").style.backgroundColor = "white" : document.getElementById("anttier1").style.backgroundColor = "#171717";
        for (let i = 2; i <= 8; i++) {
            (player.antPoints.greaterThanOrEqualTo(player[ordinals[i - 1] + 'CostAnts'])) ? document.getElementById("anttier" + i).style.backgroundColor = "white" : document.getElementById("anttier" + i).style.backgroundColor = "#171717";
        }
        for (let i = 1; i <= 12; i++) {
            if (player.antPoints.greaterThanOrEqualTo(Decimal.pow(antUpgradeCostIncreases[i], player.antUpgrades[i] * extinctionMultiplier[player.usedCorruptions[10]]).times(antUpgradeBaseCost[i]))) {
                document.getElementById("antUpgrade" + i).style.backgroundColor = "silver"
            } else {
                document.getElementById("antUpgrade" + i).style.backgroundColor = "#171717";
            }
        }
    }
}

function updateChallengeDisplay() {
    //Sets background colors on load/challenge initiation
    let el = ""
    for (let k = 1; k <= 10; k++) {
        el = document.getElementById("challenge" + k)
        el.style.backgroundColor = "#171717"
        if (player.currentChallenge.transcension === k) {
            el.style.backgroundColor = "plum"
        }
        if (player.currentChallenge.reincarnation === k) {
            el.style.backgroundColor = "plum"
        }
    }
    for (let k = 11; k <= 15; k++) {
        el = document.getElementById("challenge" + k)
        el.style.backgroundColor = "#171717"
        if (player.currentChallenge.ascension === k) {
            el.style.backgroundColor = "plum"
        }
    }
    //Corrects HTML on retry challenges button
    if (player.retrychallenges) {
        document.getElementById("retryChallenge").textContent = "Retry Challenges: ON"
    } else {
        document.getElementById("retryChallenge").textContent = "Retry Challenges: OFF"
    }
}

function updateAchievementBG() {
    //When loading/importing, the game needs to correctly update achievement backgrounds.
    for (let i = 1; i <= 182; i++) { //Initiates by setting all to default
        document.getElementById("ach" + i).style.backgroundColor = "black"
    }
    let fixDisplay1 = document.getElementsByClassName('purpleach')
    let fixDisplay2 = document.getElementsByClassName('redach')
    for (let i = 0; i < fixDisplay1.length; i++) {
        fixDisplay1[i].style.backgroundColor = "purple" //Sets the appropriate achs to purple
    }
    for (let i = 0; i < fixDisplay2.length; i++) {
        fixDisplay2[i].style.backgroundColor = "maroon" //Sets the appropriate achs to maroon (red)
    }
    for (let i = 1; i < player.achievements.length; i++) {
        if (player.achievements[i] > 0.5 && player.achievements[i] !== undefined) {
            achievementaward(i, 0) //This sets all completed ach to green (0 in 2nd arg to prevent awarding quarks/pts again)
        }
    }
}

function CSSAscend() {
    for (let i = 1; i <= 5; i++) {
        let a = document.getElementById("ascendText" + i);
        let b = document.getElementById("ascendText" + (5 + i));
        let c = document.getElementById("tesseracts" + i)
        let d = document.getElementById("buyTesseracts" + i)

        a.style.top = (8 + 35 * i) + "px"
        b.style.top = (8 + 35 * i) + "px"
        c.style.top = (23 + 35 * i) + "px"
        d.style.top = (38 + 35 * i) + "px"

        a.style.left = "13%"
        b.style.left = "56.5%"
        c.style.left = "10%"

    }

    for (let i = 1; i <= 4; i++) {
        let a = document.getElementById("switchCubeSubTab" + i)
        a.style.top = (65 + 35 * i) + "px"
        a.style.left = "5%"
    }
}

function CSSRuneBlessings() {
    let a;
    let b;
    let c;
    let d;
    let e;
    let f;
    for (let i = 1; i <= 5; i++) {
        a = document.getElementById('runeBlessingIcon' + i);
        b = document.getElementById('runeSpiritIcon' + i);
        c = document.getElementById('runeBlessingLevel' + i);
        d = document.getElementById('runeSpiritLevel' + i);
        e = document.getElementById('runeBlessingPurchase' + i);
        f = document.getElementById('runeSpiritPurchase' + i);
        g = document.getElementById('runeBlessingPower' + i);
        h = document.getElementById('runeSpiritPower' + i);

        a.style.top = b.style.top = (20 + 75 * i) + "px"
        a.style.left = b.style.left = "10%"

        c.style.top = d.style.top = (23 + 75 * i) + "px"
        c.style.left = d.style.left = "15%"

        e.style.top = f.style.top = (36 + 75 * i) + "px"
        e.style.left = f.style.left = "32%"

        g.style.top = h.style.top = (23 + 75 * i) + "px"
        g.style.left = h.style.left = "59%"

    }
}