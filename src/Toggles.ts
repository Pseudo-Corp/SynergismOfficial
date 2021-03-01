import { revealStuff, hideStuff, updateChallengeDisplay, showCorruptionStatsLoadouts, changeTabColor } from './UpdateHTML';
import { player, interval, clearInt, format, resetCheck } from './Synergism';
import { Globals as G } from './Variables';
import Decimal from 'break_infinity.js';
import { visualUpdateCubes } from './UpdateVisuals';
import { calculateRuneLevels } from './Calculate';
import { reset } from './Reset';
import { achievementaward } from './Achievements';
import { getChallengeConditions } from './Challenges';
import { loadStatisticsCubeMultipliers, loadStatisticsOfferingMultipliers, loadStatisticsAccelerator, loadStatisticsMultiplier } from './Statistics';
import { corruptionDisplay, corruptionLoadoutTableUpdate } from './Corruptions';

type TabValue = { tabName: keyof typeof tabNumberConst, unlocked: boolean };
type Tab = Record<number, TabValue>;
type SubTab = Record<number, { 
    tabSwitcher?: Function, 
    subTabList: { 
        subTabID: string | number | boolean, 
        unlocked: boolean,
        buttonID?: string
    }[] 
}>

const tabNumberConst = {
    "settings": -1,
    "shop": 0,
    "buildings": 1,
    "upgrades": 2,
    "achievements": 3,
    "runes": 4,
    "challenges": 5,
    "researches": 6,
    "ants": 7,
    "cubes": 8,
    "traits": 9
} as const;

export const toggleTabs = (name: keyof typeof tabNumberConst) => {
    G['currentTab'] = name;
    player.tabnumber = tabNumberConst[name];

    revealStuff();
    hideStuff();
    
    const subTabList = subTabsInMainTab(player.tabnumber).subTabList
    if (player.tabnumber !== -1) {
        for (let i = 0; i < subTabList.length; i++) {
            const button = document.getElementById(subTabList[i].buttonID)
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
        const btns = document.querySelectorAll('#settings .subtabSwitcher > button');
        for (let i = 0; i < btns.length; i++) {
            if (btns[i].classList.contains("buttonActive")) {
                player.subtabNumber = i
                break;
            }
        }
    }
}

export const toggleSettings = (i: number) => {
    i++
    if (player.toggles[i] === true) {
        player.toggles[i] = false
    } else {
        player.toggles[i] = true
    }
    toggleauto();
}

export const toggleChallenges = (i: number, auto = false) => {
    if (player.currentChallenge.transcension === 0 && (i <= 5)) {
        if(player.currentChallenge.ascension !== 15 || player.ascensionCounter >= 2){
            player.currentChallenge.transcension = i;
            reset("transcensionChallenge", false, "enterChallenge");
            player.transcendCount -= 1;
        }
    }
    if ((player.currentChallenge.transcension === 0 && player.currentChallenge.reincarnation === 0) && (i >= 6 && i < 11)){
        if(player.currentChallenge.ascension !== 15 || player.ascensionCounter >= 2){
            player.currentChallenge.reincarnation = i;
            reset("reincarnationChallenge", false, "enterChallenge");
            player.reincarnationCount -= 1;
        }
    }
    if (player.challengecompletions[10] > 0) {
        if ((player.currentChallenge.transcension === 0 && player.currentChallenge.reincarnation === 0 && player.currentChallenge.ascension === 0) && (i >= 11)) {
            reset("ascensionChallenge", false, "enterChallenge");
            player.currentChallenge.ascension = i;

            if (player.currentChallenge.ascension === 12) {
                player.antPoints = new Decimal("8")
            }
            if (player.currentChallenge.ascension === 15) {
                player.usedCorruptions[0] = 0;
                player.prototypeCorruptions[0] = 0;
                for (let i = 1; i <= 9; i++) {
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

type ToggleBuy = 'coin' | 'crystal' | 'mythos' | 'particle' | 'offering' | 'tesseract';

export const toggleBuyAmount = (quantity: 1 | 10 | 100 | 1000, type: ToggleBuy) => {
    player[`${type}buyamount` as const] = quantity;
    const a = ['one', 'ten', 'hundred', 'thousand'][quantity.toString().length - 1];

    document.getElementById(`${type}${a}`).style.backgroundColor = "Green";
    if (quantity !== 1) {
        document.getElementById(`${type}one`).style.backgroundColor = "Black"
    }
    if (quantity !== 10) {
        document.getElementById(`${type}ten`).style.backgroundColor = "Black"
    }
    if (quantity !== 100) {
        document.getElementById(`${type}hundred`).style.backgroundColor = "Black"
    }
    if (quantity !== 1000) {
        document.getElementById(`${type}thousand`).style.backgroundColor = "Black"
    }
}

export const toggleShops = (i: number) => {
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

export function tabs(): Tab;
export function tabs(mainTab: number): TabValue;
export function tabs(mainTab?: number) {
    const tabs: Tab = {
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

    if (typeof mainTab === 'undefined') {
        return tabs
    }
    
    return tabs[mainTab];
}

/**
 *
 * @param mainTab the index of the main tab
 * @returns Object()
 */
export const subTabsInMainTab = (mainTab: number) => {
    /**
     * An array of sub-tab objects with the IDs for the sub-tabs and buttons, and unlock conditions
     * @type {SubTab}
     */
    const subTabs: SubTab = {
        "-1": {
            tabSwitcher: setActiveSettingScreen,
            subTabList: [
                {subTabID: "settingsubtab", unlocked: true},
                {subTabID: "creditssubtab", unlocked: true},
                {subTabID: "statisticsSubTab", unlocked: true},
                {subTabID: "resetHistorySubTab", unlocked: player.unlocks.prestige},
                {subTabID: "ascendHistorySubTab", unlocked: player.ascensionCount > 0},
                { subTabID: "testingLogger", unlocked: true }
            ]
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

export const keyboardTabChange = (dir = 1, main = true) => {
    if (main) {
        player.tabnumber += dir
        const maxTab = Object.keys(tabs()).reduce((a, b) => Math.max(a, +b), -Infinity);
        const minTab = Object.keys(tabs()).reduce((a, b) => Math.min(a, +b), Infinity);
        // The loop point is chosen to be before settings so that new tabs can just be added to the end of the list
        // without needing to mess with the settings and shop
        const handleLoopBack = () => {
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
        const subTabList = subTabsInMainTab(player.tabnumber).subTabList
        if (subTabList.length === 0)
            return
        player.subtabNumber += dir
        const handleLoopBack = () => {
            const numSubTabs = subTabList.length
            player.subtabNumber = (player.subtabNumber + numSubTabs) % numSubTabs
        }
        handleLoopBack()
        while (!subTabList[player.subtabNumber].unlocked) {
            player.subtabNumber += dir
            handleLoopBack()
        }
        toggleSubTab(player.tabnumber, player.subtabNumber)
    }

    changeTabColor();
}

export const toggleSubTab = (mainTab = 1, subTab = 0) => {
    if (tabs(mainTab).unlocked && subTabsInMainTab(mainTab).subTabList.length > 0) {
        if (mainTab === -1) {
            // The first getElementById makes sure that it still works if other tabs start using the subtabSwitcher class
            const btn = document.getElementById("settings").getElementsByClassName("subtabSwitcher")[0].children[subTab]
            if (subTabsInMainTab(mainTab).subTabList[subTab].unlocked)
                subTabsInMainTab(mainTab).tabSwitcher(subTabsInMainTab(mainTab).subTabList[subTab].subTabID, btn)
        } else {
            if (subTabsInMainTab(mainTab).subTabList[subTab].unlocked)
                subTabsInMainTab(mainTab).tabSwitcher(subTabsInMainTab(mainTab).subTabList[subTab].subTabID)
        }
    }
}

export const toggleautoreset = (i: number) => {
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

export const toggleautobuytesseract = () => {
    if (player.tesseractAutoBuyerToggle === 1 || player.tesseractAutoBuyerToggle === 0) {
        player.tesseractAutoBuyerToggle = 2;
        document.getElementById("tesseractautobuytoggle").textContent = "Auto Buy: OFF"
        document.getElementById("tesseractautobuytoggle").style.border = "2px solid red"
        
    } else {
        player.tesseractAutoBuyerToggle = 1;
        document.getElementById("tesseractautobuytoggle").textContent = "Auto Buy: ON"
        document.getElementById("tesseractautobuytoggle").style.border = "2px solid green"
    }
}

export const toggleauto = () => {
    const autos = document.getElementsByClassName("auto") as HTMLCollectionOf<HTMLElement>;
    for (const auto of Array.from(autos)) {
        const format = auto.getAttribute("format") || 'Auto [$]';
        const toggleId = auto.getAttribute("toggleId");
        if (toggleId === undefined || toggleId === null) {
            continue;
        }

        const finishedString = format.replace('$', player.toggles[+toggleId] ? "ON" : "OFF")
        auto.textContent = finishedString;
        auto.style.border = "2px solid " + (player.toggles[+toggleId] ? "green" : "red");
    }
}

export const toggleResearchBuy = () => {
    if (G['maxbuyresearch']) {
        G['maxbuyresearch'] = false;
        document.getElementById("toggleresearchbuy").textContent = "Upgrade: 1 Level"
    } else {
        G['maxbuyresearch'] = true;
        document.getElementById("toggleresearchbuy").textContent = "Upgrade: MAX [if possible]"
    }
}

/*function toggleFocus(i) {
    if (i==1){document.getElementById("prestigeamount").focus();}
    if (i==2){document.getElementById("transcendamount").focus();}
    if (i==3){document.getElementById("reincarnationamount").focus();}
}*/

export const toggleAutoResearch = () => {
    const el = document.getElementById("toggleautoresearch")
    if (player.autoResearchToggle) {
        player.autoResearchToggle = false;
        el.textContent = "Automatic: OFF";
        document.getElementById(`res${player.autoResearch || 1}`).classList.remove("researchRoomba");
        player.autoResearch = 0;
    } else {
        player.autoResearchToggle = true;
        el.textContent = "Automatic: ON"
    }

    if (player.autoResearchToggle && player.cubeUpgrades[9] === 1) {
        player.autoResearch = G['researchOrderByCost'][player.roombaResearchIndex]
    }

}

export const toggleAutoSacrifice = (index: number) => {
    const el = document.getElementById("toggleautosacrifice")
    if (index === 0) {
        if (player.autoSacrificeToggle) {
            player.autoSacrificeToggle = false;
            el.textContent = "Auto Runes: OFF";
            document.getElementById("toggleautosacrifice").style.border = "2px solid red"
            player.autoSacrifice = 0;
        } else {
            player.autoSacrificeToggle = true;
            el.textContent = "Auto Runes: ON"
            document.getElementById("toggleautosacrifice").style.border = "2px solid green"
        }
    } else if (player.autoSacrificeToggle && player.shopUpgrades.offeringAuto > 0.5) {
        player.autoSacrifice = index;
    }
    for (let i = 1; i <= 5; i++) {
        document.getElementById("rune" + i).style.backgroundColor = player.autoSacrifice === i ? "orange" : "#171717";
    }
    calculateRuneLevels();
}

export const toggleBuildingScreen = (input: string) => {
    G['buildingSubTab'] = input
    const screen: Record<string, { screen: string, button: string, subtabNumber: number }> = {
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
    for (const key in screen) {
        document.getElementById(screen[key].screen).style.display = "none";
        document.getElementById(screen[key].button).style.backgroundColor = "";
    }
    document.getElementById(screen[G['buildingSubTab']].screen).style.display = "flex"
    document.getElementById(screen[G['buildingSubTab']].button).style.backgroundColor = "crimson"
    player.subtabNumber = screen[G['buildingSubTab']].subtabNumber
}

export const toggleRuneScreen = (index: number) => {
    const screens = ['runes', 'talismans', 'blessings', 'spirits'];
    G['runescreen'] = screens[index - 1];

    for (let i = 1; i <= 4; i++) {
        const a = document.getElementById("toggleRuneSubTab" + i);
        const b = document.getElementById("runeContainer" + i);
        if (i === index) {
            a.style.border = "2px solid gold"
            a.style.backgroundColor = "crimson"
            b.style.display = "block";
        } else {
            a.style.border = "2px solid silver"
            a.style.backgroundColor = ""
            b.style.display = "none";
        }
    }
    player.subtabNumber = index - 1
}

export const toggleautofortify = () => {
    const el = document.getElementById("toggleautofortify");
    if (player.autoFortifyToggle === false && player.researches[130] == 1) {
        el.textContent = "Auto Fortify: ON"
        el.style.border = "2px solid green"        
    } else {
        el.textContent = "Auto Fortify: OFF"
        el.style.border = "2px solid red"
    }
    
    player.autoFortifyToggle = !player.autoFortifyToggle;
}

export const toggleautoenhance = () => {
    const el = document.getElementById("toggleautoenhance");
    if (player.autoEnhanceToggle === false && player.researches[135] == 1) {
        el.textContent = "Auto Enhance: ON"
        el.style.border = "2px solid green"        
    } else {
        el.textContent = "Auto Enhance: OFF"
        el.style.border = "2px solid red"
    }

    player.autoEnhanceToggle = !player.autoEnhanceToggle;
}

const setActiveSettingScreen = async (subtab: string, clickedButton: HTMLButtonElement) => {
    const subtabEl = document.getElementById(subtab);
    if (subtabEl.classList.contains("subtabActive")) {
        return;
    }

    const switcherEl = clickedButton.parentNode;
    switcherEl.querySelectorAll(".buttonActive").forEach(b => b.classList.remove("buttonActive"));
    clickedButton.classList.add("buttonActive");

    subtabEl.parentNode.querySelectorAll(".subtabActive").forEach(subtab => subtab.classList.remove("subtabActive"));
    subtabEl.classList.add("subtabActive");

    if (subtab === "statisticsSubTab") {
        const refreshStats = function() {
            if (G['currentTab'] !== "settings") {
                clearInt(id);
            }
            loadStatisticsAccelerator();
            loadStatisticsMultiplier();
            loadStatisticsOfferingMultipliers();
            loadStatisticsCubeMultipliers();
            if (!subtabEl.classList.contains("subtabActive"))
                clearInt(id);
        }

        const id = interval(refreshStats, 1000)
        refreshStats();
    } else if (subtab === 'creditssubtab') {
        const credits = document.getElementById('creditList');
        const artists = document.getElementById('artistList');

        if (credits.childElementCount > 0 || artists.childElementCount > 0)
            return;

        try {
            const r = await fetch('https://api.github.com/repos/pseudo-corp/SynergismOfficial/contributors', {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            const j = await r.json();

            for (const contributor of j) { 
                const div = document.createElement('div');
                div.classList.add('credit');

                const img = new Image(32, 32);
                img.src = contributor.avatar_url;
                img.alt = contributor.login;

                const a = document.createElement('a');
                a.href = `https://github.com/Pseudo-Corp/SynergismOfficial/commits/ts?author=${contributor.login}`;
                a.textContent = contributor.login;
                
                div.appendChild(img);
                div.appendChild(a);

                credits.appendChild(div);
            }
        } catch (e) {
            credits.appendChild(document.createTextNode(e.toString()));
        }

        try {
            const r = await fetch('https://api.github.com/gists/01917ff476d25a141c5bad38340cd756', {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            const j = await r.json();
            const f = JSON.parse(j.files['synergism_artists.json'].content);

            for (const user of f) {
                const p = document.createElement('p');
                p.textContent = user;

                artists.appendChild(p);
            }
        } catch (e) {
            credits.appendChild(document.createTextNode(e.toString()));
        }
    }
}

export const toggleShopConfirmation = () => {
    const el = document.getElementById("toggleConfirmShop")
    el.textContent = G['shopConfirmation']
        ? "Shop Confirmations: OFF"
        : "Shop Confirmations: ON";

    G['shopConfirmation'] = !G['shopConfirmation'];
}

export const toggleAntMaxBuy = () => {
    const el = document.getElementById("toggleAntMax");
    el.textContent = player.antMax 
        ? "Buy Max: OFF"
        : "Buy Max: ON";

    player.antMax = !player.antMax;
}

export const toggleAntAutoSacrifice = (mode = 0) => {
    if (mode === 0) {
        const el = document.getElementById("toggleAutoSacrificeAnt");
        if (player.autoAntSacrifice) {
            player.autoAntSacrifice = false;
            el.textContent = "Auto Sacrifice: OFF"
        } else {
            player.autoAntSacrifice = true;
            el.textContent = "Auto Sacrifice: ON"
        }
    } else if (mode === 1) {
        const el = document.getElementById("autoSacrificeAntMode");
        if (player.autoAntSacrificeMode === 1 || player.autoAntSacrificeMode === 0) {
            player.autoAntSacrificeMode = 2;
            el.textContent = "Mode: Real time";
        } else {
            player.autoAntSacrificeMode = 1;
            el.textContent = "Mode: In-game time";
        }
    }
}

export const toggleMaxBuyCube = () => {
    const el = document.getElementById("toggleCubeBuy")
    if (G['buyMaxCubeUpgrades']) {
        G['buyMaxCubeUpgrades'] = false;
        el.textContent = "Upgrade: 1 Level wow"
    } else {
        G['buyMaxCubeUpgrades'] = true;
        el.textContent = "Upgrade: MAX [if possible wow]"
    }
}

export const toggleCubeSubTab = (i: number) => {
    const numSubTabs = subTabsInMainTab(8).subTabList.length
    for (let j = 1; j <= numSubTabs; j++) {
        const cubeTab = document.getElementById(`cubeTab${j}`);
        if (cubeTab.style.display === "block" && j !== i) {
            cubeTab.style.display = "none"
        }
        if (cubeTab.style.display === "none" && j === i) {
            cubeTab.style.display = "block"
            player.subtabNumber = j - 1
        }
        document.getElementById("switchCubeSubTab" + j).style.backgroundColor = i === j ? "crimson" : "#171717"
    }

    visualUpdateCubes();
}

export const updateAutoChallenge = (i: number) => {
    switch (i) {
        case 1: {
            const t = parseFloat((document.getElementById('startAutoChallengeTimerInput') as HTMLInputElement).value) || 0;
            player.autoChallengeTimer.start = Math.max(t, 0);
            document.getElementById("startTimerValue").textContent = format(player.autoChallengeTimer.start, 2, true) + "s";
            return;
        }
        case 2: {
            const u = parseFloat((document.getElementById('exitAutoChallengeTimerInput') as HTMLInputElement).value) || 0;
            player.autoChallengeTimer.exit = Math.max(u, 0);
            document.getElementById("exitTimerValue").textContent = format(player.autoChallengeTimer.exit, 2, true) + "s";
            return;
        }
        case 3: {
            const v = parseFloat((document.getElementById('enterAutoChallengeTimerInput') as HTMLInputElement).value) || 0;
            player.autoChallengeTimer.enter = Math.max(v, 0);
            document.getElementById("enterTimerValue").textContent = format(player.autoChallengeTimer.enter, 2, true) + "s";
            return;
        }
    }
}

export const toggleAutoChallengesIgnore = (i: number) => {
    const el = document.getElementById("toggleAutoChallengeIgnore");
    if (player.autoChallengeToggles[i]) {
        el.style.border = "2px solid red";
        el.textContent = "Automatically Run Chal." + i + " [OFF]"
    } else {
        el.style.border = "2px solid green";
        el.textContent = "Automatically Run Chal." + i + " [ON]"
    }

    player.autoChallengeToggles[i] = !player.autoChallengeToggles[i];
}

export const toggleAutoChallengeRun = () => {
    const el = document.getElementById('toggleAutoChallengeStart');
    if (player.autoChallengeRunning) {
        el.style.border = "2px solid red"
        el.textContent = "Auto Challenge Sweep [OFF]"
        player.autoChallengeIndex = 1;
        G['autoChallengeTimerIncrement'] = 0;
    } else {
        el.style.border = "2px solid gold"
        el.textContent = "Auto Challenge Sweep [ON]"
    }

    player.autoChallengeRunning = !player.autoChallengeRunning;
}

export const toggleAutoChallengeTextColors = (i: number) => {
    const a = document.getElementById("startAutoChallengeTimer");
    const b = document.getElementById("exitAutoChallengeTimer");
    const c = document.getElementById("enterAutoChallengeTimer");

    a.style.color = i === 1 ? 'gold' : 'white';
    b.style.color = i === 2 ? 'gold' : 'white';
    c.style.color = i === 3 ? 'gold' : 'white';
}

export const toggleAutoAscend = () => {
    const a = document.getElementById("ascensionAutoEnable");
    if (player.autoAscend) {
        a.style.border = "2px solid red"
        a.textContent = "Auto Ascend [OFF]";
    } else {
        a.style.border = "2px solid green"
        a.textContent = "Auto Ascend [ON]";
    }

    player.autoAscend = !player.autoAscend;
}

export const updateRuneBlessingBuyAmount = (i: number) => {
    switch (i) {
        case 1: {
            const t = Math.floor(parseFloat((document.getElementById('buyRuneBlessingInput') as HTMLInputElement).value)) || 1;
            player.runeBlessingBuyAmount = Math.max(t, 1);
            document.getElementById('buyRuneBlessingToggleValue').textContent = format(player.runeBlessingBuyAmount, 0, true);
            return;
        }
        case 2: {
            const u = Math.floor(parseFloat((document.getElementById('buyRuneSpiritInput') as HTMLInputElement).value)) || 1;
            player.runeSpiritBuyAmount = Math.max(u, 1);
            document.getElementById('buyRuneSpiritToggleValue').textContent = format(player.runeSpiritBuyAmount, 0, true);
            return;
        }
    }
}

export const toggleAutoTesseracts = (i: number) => {
    const el = document.getElementById('tesseractAutoToggle' + i);
    if (player.autoTesseracts[i]) {
        el.textContent = "Auto [OFF]"
        el.style.border = "2px solid red";
    } else {
        el.textContent = "Auto [ON]"
        el.style.border = "2px solid green";
    }

    player.autoTesseracts[i] = !player.autoTesseracts[i];
}

export const toggleCorruptionLevel = (index: number, value: number) => {
    const current = player.prototypeCorruptions[index]
    const maxCorruption = 12
    if (value > 0 && current < maxCorruption && 0 < index && index <= 9) {
        player.prototypeCorruptions[index] += Math.min(maxCorruption - current, value)
    }
    if (value < 0 && current > 0 && 0 < index && index <= 9) {
        player.prototypeCorruptions[index] -= Math.min(current, -value)
    }
    player.prototypeCorruptions[index] = Math.min(maxCorruption, Math.max(0, player.prototypeCorruptions[index]))
    if (value === 999 && player.currentChallenge.ascension !== 15) {
        for (let i = 0; i <= 9; i++) {
            player.usedCorruptions[i] = 0;
            player.prototypeCorruptions[i] = 0;
            if (i > 0)
                corruptionDisplay(i)
        }
        
        corruptionDisplay(G['corruptionTrigger'])
        document.getElementById("corruptionCleanseConfirm").style.visibility = "hidden";

        if (player.currentChallenge.ascension === 15) {
            resetCheck('ascensionChallenge', false, true)
        }
    }
    corruptionDisplay(index)
    corruptionLoadoutTableUpdate();
}

export const toggleCorruptionLoadoutsStats = (stats: boolean) => {
    player.corruptionShowStats = stats;
    showCorruptionStatsLoadouts();
}

export const toggleAscStatPerSecond = (id: number) => {
    const el = document.getElementById(`unit${id}`);
    if (!el) {
        console.log(id, 'platonic needs to fix');
        return;
    }

    el.textContent = player.ascStatToggles[id] ? '/s' : '';
    player.ascStatToggles[id] = !player.ascStatToggles[id];
}
