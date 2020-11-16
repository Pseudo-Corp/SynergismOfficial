function toggleTabs(i) {
    currentTab = i;
    revealStuff();
    hideStuff();
    let subTabList = subTabsInMainTab(player.tabnumber).subTabList
    if (player.tabnumber !== -1) {
        for (let i = 0; i < subTabList.length; i++) {
            let button = document.getElementById(subTabList[i].buttonID)
            if (button && button.style.backgroundColor === "crimson") { // handles every tab except settings and corruptions
                player.subtabNumber = i
                break;
            }
            if (player.tabnumber === 9 && button.style.borderColor === "dodgerblue") { // handle corruption tab
                player.subtabNumber = i
                break;
            }
        }
    } else { // handle settings tab
        // The first getElementById makes sure that it still works if other tabs start using the subtabSwitcher class
        let btns = document.getElementById("settings").getElementsByClassName("subtabSwitcher")[0].children
        for (let i = 0; i < btns.length; i++) {
            if (btns[i].classList.contains("buttonActive")) {
                player.subtabNumber = i
                break;
            }
        }
    }
}

function toggleSettings(i) {
    i++
    if (player.toggles[i] === true) {
        player.toggles[i] = false
    } else {
        player.toggles[i] = true
    }
    toggleauto();
}

function toggleChallenges(i, auto) {
    auto = auto || false
    if (player.currentChallenge.transcension === 0 && (i <= 5)) {
        if(player.currentChallenge.ascension !== 15 || player.ascensionCounter >= 2){
            player.currentChallenge.transcension = i;
            reset(2, false, "enterChallenge");
            player.transcendCount -= 1;
        }
    }
    if ((player.currentChallenge.transcension === 0 && player.currentChallenge.reincarnation === 0) && (i >= 6 && i < 11)){
        if(player.currentChallenge.ascension !== 15 || player.ascensionCounter >= 2){
            player.currentChallenge.reincarnation = i;
            reset(3, false, "enterChallenge");
            player.reincarnationCount -= 1;
        }
    }
    if (player.challengecompletions[10] > 0) {
        if ((player.currentChallenge.transcension === 0 && player.currentChallenge.reincarnation === 0 && player.currentChallenge.ascension === 0) && (i >= 11)) {
            reset(4, false, "enterChallenge");
            player.currentChallenge.ascension = i;

            if (player.currentChallenge.ascension === 12) {
                player.antPoints = new Decimal("8")
            }
            if (player.currentChallenge.ascension === 15) {
                player.usedCorruptions[0] = 0;
                player.prototypeCorruptions[0] = 0;
                for (var i = 1; i <= 9; i++) {
                    player.usedCorruptions[i] = 11;
                }
            }
        }
    }
    updateChallengeDisplay();
    getChallengeConditions(i);

    if (!auto && player.autoChallengeRunning) {
        toggleAutoChallengeRun();
    }

    if (player.currentChallenge.transcension !== 0 && player.currentChallenge.reincarnation !== 0 && player.currentChallenge.ascension !== 0 && player.achievements[238] < 1) {
        achievementaward(238)
    }
}

function toggleBuyAmount(quantity, type) {
    player[type + 'buyamount'] = quantity
    let a = ""
    if (quantity === 1) {
        a = "one"
    }
    if (quantity === 10) {
        a = "ten"
    }
    if (quantity === 100) {
        a = "hundred"
    }
    if (quantity === 1000) {
        a = "thousand"
    }


    let c = type + a
    let d = ""
    d = d + c

    document.getElementById(d).style.backgroundColor = "Green";
    if (quantity !== 1) {
        a = "one"
        d = type + a
        document.getElementById(d).style.backgroundColor = "Black"
    }
    if (quantity !== 10) {
        a = "ten"
        d = type + a
        document.getElementById(d).style.backgroundColor = "Black"
    }
    if (quantity !== 100) {
        a = "hundred"
        d = type + a
        document.getElementById(d).style.backgroundColor = "Black"
    }
    if (quantity !== 1000) {
        a = "thousand"
        d = type + a
        document.getElementById(d).style.backgroundColor = "Black"
    }
}

function toggleShops(i) {
    if (i === 1 && player.shoptoggles.coin === false) {
        player.shoptoggles.coin = true;
        document.getElementById("shoptogglecoin").textContent = "Auto: ON"
    } else if (i === 1 && player.shoptoggles.coin === true) {
        player.shoptoggles.coin = false;
        document.getElementById("shoptogglecoin").textContent = "Auto: OFF"
    }
    if (i === 2 && player.shoptoggles.prestige === false) {
        player.shoptoggles.prestige = true;
        document.getElementById("shoptoggleprestige").textContent = "Auto: ON"
    } else if (i === 2 && player.shoptoggles.prestige === true) {
        player.shoptoggles.prestige = false;
        document.getElementById("shoptoggleprestige").textContent = "Auto: OFF"
    }
    if (i === 3 && player.shoptoggles.transcend === false) {
        player.shoptoggles.transcend = true;
        document.getElementById("shoptoggletranscend").textContent = "Auto: ON"
    } else if (i === 3 && player.shoptoggles.transcend === true) {
        player.shoptoggles.transcend = false;
        document.getElementById("shoptoggletranscend").textContent = "Auto: OFF"
    }
    if (i === 4 && player.shoptoggles.generators === false) {
        player.shoptoggles.generators = true;
        document.getElementById("shoptogglegenerator").textContent = "Auto: ON"
    } else if (i === 4 && player.shoptoggles.generators === true) {
        player.shoptoggles.generators = false;
        document.getElementById("shoptogglegenerator").textContent = "Auto: OFF"
    }
    if (i === 5 && player.shoptoggles.reincarnate === false) {
        player.shoptoggles.reincarnate = true;
        document.getElementById("particleAutoUpgrade").textContent = "Auto: ON"
    } else if (i === 5 && player.shoptoggles.reincarnate === true) {
        player.shoptoggles.reincarnate = false;
        document.getElementById("particleAutoUpgrade").textContent = "Auto: OFF"
    }
}

function tabs(mainTab) {
    let tabs = {
        "-1": {tabName: "settings", unlocked: true},
        0: {tabName: "shop", unlocked: player.unlocks.reincarnate},
        1: {tabName: "buildings", unlocked: true},
        2: {tabName: "upgrades", unlocked: true},
        3: {tabName: "achievements", unlocked: player.unlocks.coinfour},
        4: {tabName: "runes", unlocked: player.unlocks.prestige},
        5: {tabName: "challenges", unlocked: player.unlocks.transcend},
        6: {tabName: "researches", unlocked: player.unlocks.reincarnate},
        7: {tabName: "ants", unlocked: player.achievements[127] > 0},
        8: {tabName: "cubes", unlocked: player.achievements[141] > 0},
        9: {tabName: "traits", unlocked: player.achievements[141] > 0}
    }
    if (mainTab === undefined)
        return tabs
    else
        return tabs[mainTab];
}

/**
 *
 * @param mainTab the index of the main tab
 * @returns Object()
 */
function subTabsInMainTab(mainTab) {
    /**
     * An array of sub-tab objects with the IDs for the sub-tabs and buttons, and unlock conditions
     * @type Object(
     *  subTabList: Array(Object(
     *      subTabID: string, ID of the subTab that will be passed as parameter to tabSwitcher
     *      buttonID: string, ID of the button element that is used to check which sub-tab is selected when changing main tabs
     *      unlocked: boolean)), unlock condition for the sub-tab
     *  tabSwitcher: function A function that handles changing the sub-tabs
     * )
     */
    let subTabs = {
        "-1": {
            tabSwitcher: setActiveSettingScreen,
            subTabList: [
                {subTabID: "settingsubtab", unlocked: true},
                {subTabID: "creditssubtab", unlocked: true},
                {subTabID: "statisticsSubTab", unlocked: true},
                {subTabID: "resetHistorySubTab", unlocked: player.unlocks.prestige},
                {subTabID: "ascendHistorySubTab", unlocked: player.ascensionCount > 0}]
        },
        0: {subTabList: []},
        1: {
            tabSwitcher: toggleBuildingScreen,
            subTabList: [
                {subTabID: "coin", unlocked: true, buttonID: "switchToCoinBuilding"},
                {subTabID: "diamond", unlocked: player.unlocks.prestige, buttonID: "switchToDiamondBuilding"},
                {subTabID: "mythos", unlocked: player.unlocks.transcend, buttonID: "switchToMythosBuilding"},
                {subTabID: "particle", unlocked: player.unlocks.reincarnate, buttonID: "switchToParticleBuilding"},
                {subTabID: "tesseract", unlocked: player.achievements[183] > 0, buttonID: "switchToTesseractBuilding"}]
        },
        2: {subTabList: []},
        3: {subTabList: []},
        4: {
            tabSwitcher: toggleRuneScreen,
            subTabList: [
                {subTabID: 1, unlocked: player.unlocks.prestige, buttonID: "toggleRuneSubTab1"},
                {subTabID: 2, unlocked: player.achievements[134] > 0, buttonID: "toggleRuneSubTab2"},
                {subTabID: 3, unlocked: player.achievements[134] > 0, buttonID: "toggleRuneSubTab3"},
                {subTabID: 4, unlocked: player.achievements[204] > 0, buttonID: "toggleRuneSubTab4"}]
        },
        5: {subTabList: []},
        6: {subTabList: []},
        7: {subTabList: []},
        8: {
            tabSwitcher: toggleCubeSubTab,
            subTabList: [
                {subTabID: 1, unlocked: player.achievements[141] > 0, buttonID: "switchCubeSubTab1"},
                {subTabID: 2, unlocked: player.achievements[197] > 0, buttonID: "switchCubeSubTab2"},
                {subTabID: 3, unlocked: player.achievements[211] > 0, buttonID: "switchCubeSubTab3"},
                {subTabID: 4, unlocked: player.achievements[218] > 0, buttonID: "switchCubeSubTab4"},
                {subTabID: 5, unlocked: player.achievements[141] > 0, buttonID: "switchCubeSubTab5"},
                {subTabID: 6, unlocked: player.achievements[218] > 0, buttonID: "switchCubeSubTab6"}]
        },
        9: {
            tabSwitcher: toggleCorruptionLoadoutsStats,
            subTabList: [
                {subTabID: true, unlocked: player.achievements[141] > 0, buttonID: "corrStatsBtn"},
                {subTabID: false, unlocked: player.achievements[141] > 0, buttonID: "corrLoadoutsBtn"}]
        },
    }
    return subTabs[mainTab];
}

function keyboardTabChange(dir = 1, main = true) {
    if (main) {
        player.tabnumber += dir
        let maxTab = Object.keys(tabs()).reduce((a, b) => Math.max(a, b))
        let minTab = Object.keys(tabs()).reduce((a, b) => Math.min(a, b))
        // The loop point is chosen to be before settings so that new tabs can just be added to the end of the list
        // without needing to mess with the settings and shop
        let handleLoopBack = () => {
            if (player.tabnumber === maxTab + 1) { // went over from the right
                player.tabnumber = minTab // loop back left
            }
            if (player.tabnumber === minTab - 1) { // and vice versa
                player.tabnumber = maxTab
            }
        }
        handleLoopBack()
        while (!tabs(player.tabnumber).unlocked) {
            player.tabnumber += dir
            handleLoopBack()
        }
        toggleTabs(tabs(player.tabnumber).tabName)
    } else {
        let subTabList = subTabsInMainTab(player.tabnumber).subTabList
        if (subTabList.length === 0)
            return
        player.subtabNumber += dir
        let handleLoopBack = () => {
            let numSubTabs = subTabList.length
            player.subtabNumber = (player.subtabNumber + numSubTabs) % numSubTabs
        }
        handleLoopBack()
        while (!subTabList[player.subtabNumber].unlocked) {
            player.subtabNumber += dir
            handleLoopBack()
        }
        toggleSubTab(player.tabnumber, player.subtabNumber)
    }
}

function toggleSubTab(mainTab = 1, subTab = 0) {
    if (tabs(mainTab).unlocked && subTabsInMainTab(mainTab).subTabList.length > 0) {
        if (mainTab === -1) {
            // The first getElementById makes sure that it still works if other tabs start using the subtabSwitcher class
            let btn = document.getElementById("settings").getElementsByClassName("subtabSwitcher")[0].children[subTab]
            if (subTabsInMainTab(mainTab).subTabList[subTab].unlocked)
                subTabsInMainTab(mainTab).tabSwitcher(subTabsInMainTab(mainTab).subTabList[subTab].subTabID, btn)
        } else {
            if (subTabsInMainTab(mainTab).subTabList[subTab].unlocked)
                subTabsInMainTab(mainTab).tabSwitcher(subTabsInMainTab(mainTab).subTabList[subTab].subTabID)
        }
    }
}

function toggleautoreset(i) {
    if (i === 1) {
        if (player.resettoggle1 === 1 || player.resettoggle1 === 0) {
            player.resettoggle1 = 2;
            document.getElementById("prestigeautotoggle").textContent = "Mode: TIME"
        } else {
            player.resettoggle1 = 1;
            document.getElementById("prestigeautotoggle").textContent = "Mode: AMOUNT"
        }
    } else if (i === 2) {
        if (player.resettoggle2 === 1 || player.resettoggle2 === 0) {
            player.resettoggle2 = 2;
            document.getElementById("transcendautotoggle").textContent = "Mode: TIME"
        } else {
            player.resettoggle2 = 1;
            document.getElementById("transcendautotoggle").textContent = "Mode: AMOUNT"
        }
    } else if (i === 3) {
        if (player.resettoggle3 === 1 || player.resettoggle3 === 0) {
            player.resettoggle3 = 2;
            document.getElementById("reincarnateautotoggle").textContent = "Mode: TIME"
        } else {
            player.resettoggle3 = 1;
            document.getElementById("reincarnateautotoggle").textContent = "Mode: AMOUNT"
        }
    } else if (i === 4) {
        // To be ascend toggle
    }
}

function toggleauto() {
    const autos = document.getElementsByClassName("auto");
    for (const auto of autos) {
        const format = auto.getAttribute("format") || 'Auto [$]';
        const toggleId = auto.getAttribute("toggleId");
        if (toggleId === undefined || toggleId === null) {
            continue;
        }

        const finishedString = format.replace('$', player.toggles[toggleId] ? "ON" : "OFF")
        auto.textContent = finishedString;
        auto.style.border = "2px solid " + (player.toggles[toggleId] ? "green" : "red");
    }
}

function toggleResearchBuy() {
    if (maxbuyresearch) {
        maxbuyresearch = false;
        document.getElementById("toggleresearchbuy").textContent = "Upgrade: 1 Level"
    } else {
        maxbuyresearch = true;
        document.getElementById("toggleresearchbuy").textContent = "Upgrade: MAX [if possible]"
    }
}

/*function toggleFocus(i) {
    if (i==1){document.getElementById("prestigeamount").focus();}
    if (i==2){document.getElementById("transcendamount").focus();}
    if (i==3){document.getElementById("reincarnationamount").focus();}
}*/

function toggleAutoResearch() {
    let el = document.getElementById("toggleautoresearch")
    if (player.autoResearchToggle) {
        player.autoResearchToggle = false;
        el.textContent = "Automatic: OFF";
        player.autoResearch = 0;
    } else {
        player.autoResearchToggle = true;
        el.textContent = "Automatic: ON"
    }


    if (!player.autoResearchToggle) {
        for (let i = 1; i <= maxRoombaResearchIndex(player); i++) {
            let l = document.getElementById("res" + i)
            if (player.researches[i] === 0) {
                l.style.backgroundColor = "black"
            }
            if (0 < player.researches[i] && player.researches[i] < researchMaxLevels[i]) {
                l.style.backgroundColor = "purple"
            }
            if (player.researches[i] === researchMaxLevels[i]) {
                l.style.backgroundColor = "green"
            }
        }
    }

    if (player.autoResearchToggle && player.cubeUpgrades[9] === 1) {
        player.autoResearch = researchOrderByCost[player.roombaResearchIndex]
        let doc = document.getElementById("res" + player.autoResearch)
        if (doc)
            doc.style.backgroundColor = "orange"
    }


}

function toggleAutoSacrifice(index) {
    let el = document.getElementById("toggleautosacrifice")
    if (index === 0) {
        if (player.autoSacrificeToggle) {
            player.autoSacrificeToggle = false;
            el.textContent = "Automatic: OFF";
            player.autoSacrifice = 0;
        } else {
            player.autoSacrificeToggle = true;
            el.textContent = "Automatic: ON"
        }
    } else if (player.autoSacrificeToggle && player.shopUpgrades.offeringAutoLevel > 0.5) {
        player.autoSacrifice = index;
    }
    for (let i = 1; i <= 5; i++) {
        document.getElementById("rune" + i).style.backgroundColor = player.autoSacrifice === i ? "orange" : "#171717";
    }
    calculateRuneLevels();
}

function toggleBuildingScreen(input) {
    buildingSubTab = input
    let screen = {
        "coin": {
            screen: "coinBuildings",
            button: "switchToCoinBuilding",
            subtabNumber: 0
        },
        "diamond": {
            screen: "prestige",
            button: "switchToDiamondBuilding",
            subtabNumber: 1
        },
        "mythos": {
            screen: "transcension",
            button: "switchToMythosBuilding",
            subtabNumber: 2
        },
        "particle": {
            screen: "reincarnation",
            button: "switchToParticleBuilding",
            subtabNumber: 3
        },
        "tesseract": {
            screen: "ascension",
            button: "switchToTesseractBuilding",
            subtabNumber: 4
        }
    }
    for (let key of Object.keys(screen)) {
        document.getElementById(screen[key].screen).style.display = "none";
        document.getElementById(screen[key].button).style.backgroundColor = "#171717";
    }
    document.getElementById(screen[buildingSubTab].screen).style.display = "block"
    document.getElementById(screen[buildingSubTab].button).style.backgroundColor = "crimson"
    player.subtabNumber = screen[buildingSubTab].subtabNumber
}

function toggleRuneScreen(index) {
    switch (index) {
        case 1:
            runescreen = "runes";
            break;
        case 2:
            runescreen = "talismans";
            break;
        case 3:
            runescreen = "blessings";
            break;
        case 4:
            runescreen = "spirits";
            break;
    }
    for (let i = 1; i <= 4; i++) {
        let a = document.getElementById("toggleRuneSubTab" + i);
        let b = document.getElementById("runeContainer" + i);
        if (i === index) {
            a.style.border = "2px solid gold"
            a.style.backgroundColor = "crimson"
            b.style.display = "block";
        } else {
            a.style.border = "2px solid silver"
            a.style.backgroundColor = "#171717"
            b.style.display = "none";
        }
    }
    player.subtabNumber = index - 1
}

function setActiveSettingScreen(subtab, clickedButton) {
    let subtabEl = document.getElementById(subtab);
    if (subtabEl.classList.contains("subtabActive")) {
        return;
    }

    let switcherEl = clickedButton.parentNode;
    switcherEl.querySelectorAll(".buttonActive").forEach(b => b.classList.remove("buttonActive"));
    clickedButton.classList.add("buttonActive");

    subtabEl.parentNode.querySelectorAll(".subtabActive").forEach(subtab => subtab.classList.remove("subtabActive"));
    subtabEl.classList.add("subtabActive");

    if (subtab === "statisticsSubTab") {
        let id = interval(refreshStats, 1000)

        function refreshStats() {
            if (currentTab !== "settings") {
                clearInt(id);
            }
            loadStatisticsAccelerator();
            loadStatisticsMultiplier();
            loadStatisticsOfferingMultipliers();
            loadStatisticsCubeMultipliers();
            if (!subtabEl.classList.contains("subtabActive"))
                clearInt(id);
        }

        refreshStats();
    }
}

function toggleShopConfirmation() {
    let el = document.getElementById("toggleConfirmShop")
    if (shopConfirmation) {
        shopConfirmation = false;
        el.textContent = "Shop Confirmations: OFF"
    } else {
        shopConfirmation = true;
        el.textContent = "Shop Confirmations: ON"
    }
}

function toggleAntMaxBuy() {
    let el = document.getElementById("toggleAntMax");
    if (player.antMax) {
        player.antMax = false;
        el.textContent = "Buy Max: OFF";
    } else {
        player.antMax = true;
        el.textContent = "Buy Max: ON";
    }
}

function toggleAntAutoSacrifice(mode = 0) {
    if (mode === 0) {
        let el = document.getElementById("toggleAutoSacrificeAnt");
        if (player.autoAntSacrifice) {
            player.autoAntSacrifice = false;
            el.textContent = "Auto Sacrifice: OFF"
        } else {
            player.autoAntSacrifice = true;
            el.textContent = "Auto Sacrifice: ON"
        }
    } else if (mode === 1) {
        let el = document.getElementById("autoSacrificeAntMode");
        if (player.autoAntSacrificeMode === 1 || player.autoAntSacrificeMode === 0) {
            player.autoAntSacrificeMode = 2;
            el.textContent = "Mode: Real time";
        } else {
            player.autoAntSacrificeMode = 1;
            el.textContent = "Mode: In-game time";
        }
    }
}

function toggleMaxBuyCube() {
    let el = document.getElementById("toggleCubeBuy")
    if (buyMaxCubeUpgrades) {
        buyMaxCubeUpgrades = false;
        el.textContent = "Upgrade: 1 Level wow"
    } else {
        buyMaxCubeUpgrades = true;
        el.textContent = "Upgrade: MAX [if possible wow]"
    }
}

function toggleCubeSubTab(i) {
    let numSubTabs = subTabsInMainTab(8).subTabList.length
    for (let j = 1; j <= numSubTabs; j++) {
        let cubeTab = document.getElementById(`cubeTab${j}`);
        if (cubeTab.style.display === "block" && j !== i) {
            cubeTab.style.display = "none"
        }
        if (cubeTab.style.display === "none" && j === i) {
            cubeTab.style.display = "block"
            player.subtabNumber = j - 1
        }
        document.getElementById("switchCubeSubTab" + j).style.backgroundColor = i === j ? "crimson" : "#171717"
    }

    visualUpdateCubes()
}

function updateAutoChallenge(i) {
    let t
    switch (i) {
        case 1:
            t = parseFloat(document.getElementById('startAutoChallengeTimerInput').value)
            t = t || 0;
            player.autoChallengeTimer.start = Math.max(t, 0);
            document.getElementById("startTimerValue").textContent = format(player.autoChallengeTimer.start, 2, true) + "s";
            break;
        case 2:
            t = parseFloat(document.getElementById('exitAutoChallengeTimerInput').value)
            t = t || 0;
            player.autoChallengeTimer.exit = Math.max(t, 0);
            document.getElementById("exitTimerValue").textContent = format(player.autoChallengeTimer.exit, 2, true) + "s";
            break;
        case 3:
            t = parseFloat(document.getElementById('enterAutoChallengeTimerInput').value)
            t = t || 0;
            player.autoChallengeTimer.enter = Math.max(t, 0);
            document.getElementById("enterTimerValue").textContent = format(player.autoChallengeTimer.enter, 2, true) + "s";
            break;
    }
}

function toggleAutoChallengesIgnore(i) {
    let el = document.getElementById("toggleAutoChallengeIgnore");
    if (player.autoChallengeToggles[i]) {
        player.autoChallengeToggles[i] = false;
        el.style.border = "2px solid red";
        el.textContent = "Automatically Run Chal." + i + " [OFF]"
    } else {
        player.autoChallengeToggles[i] = true;
        el.style.border = "2px solid green";
        el.textContent = "Automatically Run Chal." + i + " [ON]"
    }
}

function toggleAutoChallengeRun() {
    let el = document.getElementById('toggleAutoChallengeStart');
    if (player.autoChallengeRunning) {
        player.autoChallengeRunning = false;
        el.style.border = "2px solid red"
        el.textContent = "Auto Challenge Sweep [OFF]"
        player.autoChallengeIndex = 1;
        autoChallengeTimerIncrement = 0;
    } else {
        player.autoChallengeRunning = true;
        el.style.border = "2px solid gold"
        el.textContent = "Auto Challenge Sweep [ON]"
    }
}

function toggleAutoChallengeTextColors(i) {
    let a = document.getElementById("startAutoChallengeTimer");
    let b = document.getElementById("exitAutoChallengeTimer");
    let c = document.getElementById("enterAutoChallengeTimer");

    (i === 1) ?
        a.style.color = 'gold' :
        a.style.color = 'white';
    (i === 2) ?
        b.style.color = 'gold' :
        b.style.color = 'white';
    (i === 3) ?
        c.style.color = 'gold' :
        c.style.color = 'white';
}

function toggleAutoAscend() {
    let a = document.getElementById("ascensionAutoEnable");
    if (player.autoAscend) {
        player.autoAscend = false
        a.style.border = "2px solid red"
        a.textContent = "Auto Ascend [OFF]";
    } else {
        player.autoAscend = true
        a.style.border = "2px solid green"
        a.textContent = "Auto Ascend [ON]";
    }
}

function updateRuneBlessingBuyAmount(i) {
    let t;
    switch (i) {
        case 1:
            t = Math.floor(parseFloat(document.getElementById('buyRuneBlessingInput').value));
            t = t || 1;
            player.runeBlessingBuyAmount = Math.max(t, 1);
            document.getElementById('buyRuneBlessingToggleValue').textContent = format(player.runeBlessingBuyAmount, 0, true);
            break;
        case 2:
            t = Math.floor(parseFloat(document.getElementById('buyRuneSpiritInput').value));
            t = t || 1;
            player.runeSpiritBuyAmount = Math.max(t, 1);
            document.getElementById('buyRuneSpiritToggleValue').textContent = format(player.runeSpiritBuyAmount, 0, true);
            break;
    }
}

function toggleAutoTesseracts(i) {
    if (player.autoTesseracts[i]) {
        player.autoTesseracts[i] = false
        document.getElementById('tesseractAutoToggle' + i).textContent = "Auto [OFF]"
        document.getElementById('tesseractAutoToggle' + i).style.border = "2px solid red";
    } else {
        player.autoTesseracts[i] = true
        document.getElementById('tesseractAutoToggle' + i).textContent = "Auto [ON]"
        document.getElementById('tesseractAutoToggle' + i).style.border = "2px solid green";
    }
}

function toggleCorruptionLevel(index, value) {
    let current = player.prototypeCorruptions[index]
    let maxCorruption = 11
    if (value > 0 && current < maxCorruption && 0 < index && index <= 9) {
        player.prototypeCorruptions[index] += Math.min(maxCorruption - current, value)
    }
    if (value < 0 && current > 0 && 0 < index && index <= 9) {
        player.prototypeCorruptions[index] -= Math.min(current, -value)
    }
    player.prototypeCorruptions[index] = Math.min(maxCorruption, Math.max(0, player.prototypeCorruptions[index]))
    if (value === 999 && player.currentChallenge.ascension !== 15) {
        let trig = corruptionTrigger
        for (let i = 0; i <= 9; i++) {
            player.usedCorruptions[i] = 0;
            player.prototypeCorruptions[i] = 0;
            if (i > 0)
                corruptionDisplay(i)
        }
        corruptionDisplay(trig)
        document.getElementById("corruptionCleanseConfirm").style.visibility = "hidden";

        if (player.currentChallenge.ascension === 15) {
            resetCheck('ascensionChallenge', false, true)
        }
    }
    corruptionDisplay(index)
    corruptionLoadoutTableUpdate(0);
}

function toggleCorruptionLoadoutsStats(stats) {
    player.corruptionShowStats = stats
    showCorruptionStatsLoadouts()
}

function toggleAscStatPerSecond(id) {
    const el = document.getElementById(`unit${id}`);
    if (!el) {
        console.log(id, 'platonic needs to fix');
        return;
    }

    if (player.ascStatToggles[id]) {
        player.ascStatToggles[id] = false;
        el.textContent = "/s";
    } else {
        player.ascStatToggles[id] = true;
        el.textContent = '';
    }
}
