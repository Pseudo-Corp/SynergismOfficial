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
        example29[i].style.display = player.cubeUpgrades[10] > 0 ? "flex" : "none"
    }

    let example30 = document.getElementsByClassName("cubeUpgrade19");
    for (let i = 0; i < example30.length; i++) {
        example30[i].style.display = player.cubeUpgrades[19] > 0 ? "block" : "none"
    }

    let example31 = document.getElementsByClassName("sacrificeAnts")
    for (let ex of example31) { //Galactic Crumb Achievement 5
        ex.style.display = player.achievements[173] === 1 ? "block" : "none";
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
        document.getElementById("antSacrificeButtons").style.display = "block" :
        document.getElementById("antSacrificeButtons").style.display = "none";

    for (let z = 1; z <= 5; z++) {
        (player.researches[190] > 0) ? //8x15 Research [Auto Tesseracts]
            document.getElementById("tesseractAutoToggle" + z).style.display = "block" :
            document.getElementById("tesseractAutoToggle" + z).style.display = "none";
    }
    (player.antUpgrades[12] > 0 || player.ascensionCount > 0) ? //Ant Talisman Unlock, Mortuus
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

    player.cubeUpgrades[8] > 0 ?
        document.getElementById('particleAutoUpgrade').style.display = "block" :
        document.getElementById('particleAutoUpgrade').style.display = "none";

    document.getElementById("ascensionStats").style.visibility = player.achievements[197] > 0 ? "visible" : "hidden";
    document.getElementById("ascHyperStats").style.display = player.challengecompletions[13] > 0 ? "" : "none";
    document.getElementById("ascPlatonicStats").style.display = player.challengecompletions[14] > 0 ? "" : "none";

    //I'll clean this up later. Note to 2019 Platonic: Fuck you
    // note to 2019 and 2020 Platonic, you're welcome
    let e = document.getElementsByClassName("auto");
    let automationUnlocks = {
        0: player.upgrades[81] === 1,
        1: player.upgrades[82] === 1,
        2: player.upgrades[83] === 1,
        3: player.upgrades[84] === 1,
        4: player.upgrades[85] === 1,
        5: player.upgrades[86] === 1,
        6: player.upgrades[87] === 1,
        7: player.upgrades[88] === 1,
        8: player.achievements[78] === 1,
        9: player.achievements[85] === 1,
        10: player.achievements[92] === 1,
        11: player.achievements[99] === 1,
        12: player.achievements[106] === 1,
        13: player.achievements[43] === 1,
        14: player.upgrades[94] === 1,
        15: player.upgrades[95] === 1,
        16: player.upgrades[96] === 1,
        17: player.upgrades[97] === 1,
        18: player.upgrades[98] === 1,
        19: player.upgrades[89] === 1,
        20: player.cubeUpgrades[7] === 1,
        21: player.cubeUpgrades[7] === 1,
        22: player.cubeUpgrades[7] === 1,
        23: player.cubeUpgrades[7] === 1,
        24: player.cubeUpgrades[7] === 1,
        25: player.researches[46] === 1,
        26: player.upgrades[91] === 1,
        27: player.upgrades[92] === 1,
        28: player.upgrades[99] === 1,
        29: player.upgrades[90] === 1,
        30: player.unlocks.prestige,
        31: player.prestigeCount > 0.5 || player.reincarnationCount > 0.5,
        32: player.transcendCount > 0.5 || player.reincarnationCount > 0.5,
        33: player.reincarnationCount > 0.5,
        34: player.ascensionCount > 0,
        35: player.achievements[173] > 0
    }
    for (let i = 0; i < e.length; i++) {
        if (automationUnlocks[i]) {
            e[i].style.display = "block";
        }
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
        player.tabnumber = -1
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
        player.tabnumber = 0;
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
        document.getElementById("traits").style.display = "flex";
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

    updateAscensionStats()

    if (currentTab === "buildings") {
        visualUpdateBuildings()
    }
    if (currentTab === "upgrades") {
        visualUpdateUpgrades()
    }
    if (currentTab === "achievements") {
        visualUpdateAchievements()
    }
    if (currentTab === "runes") {
        visualUpdateRunes()
    }
    if (currentTab === "challenges") {
        visualUpdateChallenges()
    }
    if (currentTab === "researches") {
        visualUpdateResearch()
    }
    if (currentTab === "settings") {
        visualUpdateSettings()
    }
    if (currentTab === "shop") {
        visualUpdateShop()
    }
    if (currentTab === "ants") {
        visualUpdateAnts()
    }
    if (currentTab === "cubes") {
        visualUpdateCubes()
    }
    if (currentTab === "traits") {
        visualUpdateCorruptions()
    }
}


function buttoncolorchange() {

    (player.toggles[15] && player.achievements[43] === 1) ?
        document.getElementById('prestigebtn').style.backgroundColor = "green" :
        document.getElementById('prestigebtn').style.backgroundColor = "#171717";

    (player.toggles[21] && player.upgrades[89] > 0.5 && (player.currentChallenge.transcension === 0)) ?
        document.getElementById('transcendbtn').style.backgroundColor = "green" :
        document.getElementById('transcendbtn').style.backgroundColor = "#171717";

    (player.toggles[27] && player.researches[46] > 0.5 && (player.currentChallenge.transcension === 0 && player.currentChallenge.reincarnation === 0)) ?
        document.getElementById('reincarnatebtn').style.backgroundColor = "green" :
        document.getElementById('reincarnatebtn').style.backgroundColor = "#171717";

    (player.toggles[8] && player.upgrades[88] > 0.5) ?
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
        ((!player.toggles[1] || player.upgrades[81] === 0) && player.coins.greaterThanOrEqualTo(player.firstCostCoin)) ?
            a.style.backgroundColor = "#555555" :
            a.style.backgroundColor = "#171717";
        ((!player.toggles[2] || player.upgrades[82] === 0) && player.coins.greaterThanOrEqualTo(player.secondCostCoin)) ?
            b.style.backgroundColor = "#555555" :
            b.style.backgroundColor = "#171717";
        ((!player.toggles[3] || player.upgrades[83] === 0) && player.coins.greaterThanOrEqualTo(player.thirdCostCoin)) ?
            c.style.backgroundColor = "#555555" :
            c.style.backgroundColor = "#171717";
        ((!player.toggles[4] || player.upgrades[84] === 0) && player.coins.greaterThanOrEqualTo(player.fourthCostCoin)) ?
            d.style.backgroundColor = "#555555" :
            d.style.backgroundColor = "#171717";
        ((!player.toggles[5] || player.upgrades[85] === 0) && player.coins.greaterThanOrEqualTo(player.fifthCostCoin)) ?
            e.style.backgroundColor = "#555555" :
            e.style.backgroundColor = "#171717";
        ((!player.toggles[6] || player.upgrades[86] === 0) && player.coins.greaterThanOrEqualTo(player.acceleratorCost)) ?
            f.style.backgroundColor = "#555555" :
            f.style.backgroundColor = "#171717";
        ((!player.toggles[7] || player.upgrades[87] === 0) && player.coins.greaterThanOrEqualTo(player.multiplierCost)) ?
            g.style.backgroundColor = "#555555" :
            g.style.backgroundColor = "#171717";
        ((!player.toggles[8] || player.upgrades[88] === 0) && player.prestigePoints.greaterThanOrEqualTo(player.acceleratorBoostCost)) ?
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
        ((!player.toggles[10] || player.achievements[78] === 0) && player.prestigePoints.greaterThanOrEqualTo(player.firstCostDiamonds)) ? a.style.backgroundColor = "#555555" : a.style.backgroundColor = "#171717";
        ((!player.toggles[11] || player.achievements[85] === 0) && player.prestigePoints.greaterThanOrEqualTo(player.secondCostDiamonds)) ? b.style.backgroundColor = "#555555" : b.style.backgroundColor = "#171717";
        ((!player.toggles[12] || player.achievements[92] === 0) && player.prestigePoints.greaterThanOrEqualTo(player.thirdCostDiamonds)) ? c.style.backgroundColor = "#555555" : c.style.backgroundColor = "#171717";
        ((!player.toggles[13] || player.achievements[99] === 0) && player.prestigePoints.greaterThanOrEqualTo(player.fourthCostDiamonds)) ? d.style.backgroundColor = "#555555" : d.style.backgroundColor = "#171717";
        ((!player.toggles[14] || player.achievements[106] === 0) && player.prestigePoints.greaterThanOrEqualTo(player.fifthCostDiamonds)) ? e.style.backgroundColor = "#555555" : e.style.backgroundColor = "#171717";
        let k = 0;
        k += Math.floor(rune3level / 16 * effectiveLevelMult) * 100 / 100
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
            let arr = [a, b, c, d, e, f, g];
            for (let i = 0; i < arr.length; i++) {
                arr[i].style.backgroundColor = (player.researchPoints > talismanResourceObtainiumCosts[i]
                    && player.runeshards > talismanResourceOfferingCosts[i]) ? "purple" : "#171717"
            }
        }
    }

    if (currentTab === "buildings" && buildingSubTab === "mythos") {
        for (let i = 1; i <= 5; i++) {
            ((!player.toggles[i + 15] || !player.upgrades[93 + i]) && player.transcendPoints.greaterThanOrEqualTo(player[ordinals[i - 1] + 'CostMythos'])) ? document.getElementById('buymythos' + i).style.backgroundColor = "#555555" : document.getElementById('buymythos' + i).style.backgroundColor = "#171717"
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
        let c = document.getElementById("tesseracts" + i);
        let d = document.getElementById("buyTesseracts" + i);
        let e = document.getElementById("tesseractAutoToggle" + i);

        a.style.top = (8 + 35 * i) + "px"
        b.style.top = (8 + 35 * i) + "px"
        c.style.top = (23 + 35 * i) + "px"
        d.style.top = (38 + 35 * i) + "px"
        e.style.top = (22 + 35 * i) + "px"

        a.style.left = "13%"
        b.style.left = "56.5%"
        c.style.left = "10%"

    }

    for (let i = 1; i <= 6; i++) {
        let a = document.getElementById("switchCubeSubTab" + i)
        a.style.top = (30 + 35 * i) + "px"
        a.style.left = "5%"
    }
}

function CSSRuneBlessings() {
    for (let i = 1; i <= 5; i++) {
        let a = document.getElementById('runeBlessingIcon' + i);
        let b = document.getElementById('runeSpiritIcon' + i);
        let c = document.getElementById('runeBlessingLevel' + i);
        let d = document.getElementById('runeSpiritLevel' + i);
        let e = document.getElementById('runeBlessingPurchase' + i);
        let f = document.getElementById('runeSpiritPurchase' + i);
        let g = document.getElementById('runeBlessingPower' + i);
        let h = document.getElementById('runeSpiritPower' + i);

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

function showCorruptionStatsLoadouts() {
    if (player.corruptionShowStats) {
        document.getElementById("corruptionStats").style.display = "block"
        document.getElementById("corruptionLoadouts").style.display = "none"
        document.getElementById("corrStatsBtn").style.borderColor = "dodgerblue"
        document.getElementById("corrLoadoutsBtn").style.borderColor = "white"
    } else {
        document.getElementById("corruptionStats").style.display = "none"
        document.getElementById("corruptionLoadouts").style.display = "block"
        document.getElementById("corrStatsBtn").style.borderColor = "white"
        document.getElementById("corrLoadoutsBtn").style.borderColor = "dodgerblue"
    }
}

function updateAscensionStats() {
    let t = player.ascensionCounter;
    let [cubes, tess, hyper, platonic] = CalcCorruptionStuff().splice(4);
    let fillers = {
        "ascLen": formatTimeShort(player.ascensionCounter),
        "ascCubes": format(cubes * (player.ascStatToggles[1] ? 1 : 1 / t), 2, true),
        "ascTess": format(tess * (player.ascStatToggles[2] ? 1 : 1 / t), 3, true),
        "ascHyper": format(hyper * (player.ascStatToggles[3] ? 1 : 1 / t), 4, true),
        "ascPlatonic": format(platonic * (player.ascStatToggles[4] ? 1 : 1 / t), 5, true),
        "ascC10": player.challengecompletions[10],
        "ascTimeAccel": `${format(calculateTimeAcceleration(), 3, true)}x`
    }
    for (const key of Object.keys(fillers)) {
        document.getElementById(key).textContent = fillers[key];
    }
}
