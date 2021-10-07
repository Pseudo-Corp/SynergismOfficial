import { revealStuff, hideStuff, updateChallengeDisplay, showCorruptionStatsLoadouts, changeTabColor } from './UpdateHTML';
import { player, interval, clearInt, format, resetCheck } from './Synergism';
import { Globals as G } from './Variables';
import Decimal from 'break_infinity.js';
import { visualUpdateCubes } from './UpdateVisuals';
import { calculateRuneLevels } from './Calculate';
import { reset, resetrepeat } from './Reset';
import { achievementaward } from './Achievements';
import { getChallengeConditions } from './Challenges';
import { loadStatisticsCubeMultipliers, loadStatisticsOfferingMultipliers, loadStatisticsAccelerator, loadStatisticsMultiplier, loadPowderMultiplier } from './Statistics';
import { corruptionDisplay, corruptionLoadoutTableUpdate } from './Corruptions';
import type { BuildingSubtab, Player } from './types/Synergism';
import { DOMCacheGetOrSet } from './Cache/DOM';

type TabValue = { tabName: keyof typeof tabNumberConst, unlocked: boolean };
type Tab = Record<number, TabValue>;
type SubTab = Record<number, { 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tabSwitcher?: (...args: any[]) => void, 
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
    "traits": 9,
    "singularity": 10
} as const;

export const toggleTabs = (name: keyof typeof tabNumberConst) => {
    G['currentTab'] = name;
    player.tabnumber = tabNumberConst[name];

    revealStuff();
    hideStuff();
    
    const subTabList = subTabsInMainTab(player.tabnumber).subTabList
    if (player.tabnumber !== -1) {
        for (let i = 0; i < subTabList.length; i++) {
            const button = DOMCacheGetOrSet(subTabList[i].buttonID)
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
    if ((i <= 5)) {
        if(player.currentChallenge.ascension !== 15 || player.ascensionCounter >= 2){
            player.currentChallenge.transcension = i;
            reset("transcensionChallenge", false, "enterChallenge");
            player.transcendCount -= 1;
        }
        if (!player.currentChallenge.reincarnation && !document.querySelector('.resetbtn.hover')) {
            resetrepeat('transcensionChallenge');
        }
    }
    if ((i >= 6 && i < 11)){
        if(player.currentChallenge.ascension !== 15 || player.ascensionCounter >= 2){
            player.currentChallenge.reincarnation = i;
            reset("reincarnationChallenge", false, "enterChallenge");
            player.reincarnationCount -= 1;
        }
        if (!document.querySelector('.resetbtn.hover')) {
            resetrepeat('reincarnationChallenge');
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

    DOMCacheGetOrSet(`${type}${a}`).style.backgroundColor = "Green";
    if (quantity !== 1) {
        DOMCacheGetOrSet(`${type}one`).style.backgroundColor = ""
    }
    if (quantity !== 10) {
        DOMCacheGetOrSet(`${type}ten`).style.backgroundColor = ""
    }
    if (quantity !== 100) {
        DOMCacheGetOrSet(`${type}hundred`).style.backgroundColor = ""
    }
    if (quantity !== 1000) {
        DOMCacheGetOrSet(`${type}thousand`).style.backgroundColor = ""
    }
}

type upgradeAutos = "coin" | "prestige" | "transcend" | "generators" | "reincarnate"

/**
 * Updates Auto Upgrade Border Colors if applicable, or updates the status of an upgrade toggle as optional.
 * @param toggle Targets a specific upgrade toggle if provided
 */
export const toggleShops = (toggle?: upgradeAutos) => {
    // toggle provided: we do not want to update every button
    if (toggle) {
        player.shoptoggles[toggle] = !player.shoptoggles[toggle]
        DOMCacheGetOrSet(`${toggle}AutoUpgrade`).style.borderColor = player.shoptoggles[toggle] ? 'green' : 'red';
        DOMCacheGetOrSet(`${toggle}AutoUpgrade`).textContent = 'Auto: ' + (player.shoptoggles[toggle] ? 'ON': 'OFF');
    }
    else {
        const keys = Object.keys(player.shoptoggles) as (keyof Player['shoptoggles'])[]
        for (const key of keys) {
            const color = player.shoptoggles[key]? 'green': 'red'
            const auto = 'Auto: ' + (player.shoptoggles[key] ? 'ON' : 'OFF')
            DOMCacheGetOrSet(`${key}AutoUpgrade`).style.borderColor = color
            DOMCacheGetOrSet(`${key}AutoUpgrade`).textContent = auto
        }
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
                { subTabID: "hotkeys", unlocked: true }
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
                {subTabID: 6, unlocked: player.achievements[218] > 0, buttonID: "switchCubeSubTab6"},
                {subTabID: 7, unlocked: player.challenge15Exponent >= 1e15, buttonID: "switchCubeSubTab7"}]
        },
        9: {
            tabSwitcher: toggleCorruptionLoadoutsStats,
            subTabList: [
                {subTabID: true, unlocked: player.achievements[141] > 0, buttonID: "corrStatsBtn"},
                {subTabID: false, unlocked: player.achievements[141] > 0, buttonID: "corrLoadoutsBtn"}]
        },
        10: {
            subTabList: []}
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
            const btn = DOMCacheGetOrSet("settings").getElementsByClassName("subtabSwitcher")[0].children[subTab]
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
            DOMCacheGetOrSet("prestigeautotoggle").textContent = "Mode: TIME"
        } else {
            player.resettoggle1 = 1;
            DOMCacheGetOrSet("prestigeautotoggle").textContent = "Mode: AMOUNT"
        }
    } else if (i === 2) {
        if (player.resettoggle2 === 1 || player.resettoggle2 === 0) {
            player.resettoggle2 = 2;
            DOMCacheGetOrSet("transcendautotoggle").textContent = "Mode: TIME"
        } else {
            player.resettoggle2 = 1;
            DOMCacheGetOrSet("transcendautotoggle").textContent = "Mode: AMOUNT"
        }
    } else if (i === 3) {
        if (player.resettoggle3 === 1 || player.resettoggle3 === 0) {
            player.resettoggle3 = 2;
            DOMCacheGetOrSet("reincarnateautotoggle").textContent = "Mode: TIME"
        } else {
            player.resettoggle3 = 1;
            DOMCacheGetOrSet("reincarnateautotoggle").textContent = "Mode: AMOUNT"
        }
    } else if (i === 4) {
        // To be ascend toggle
    }
}

export const toggleautobuytesseract = () => {
    if (player.tesseractAutoBuyerToggle === 1 || player.tesseractAutoBuyerToggle === 0) {
        player.tesseractAutoBuyerToggle = 2;
        DOMCacheGetOrSet("tesseractautobuytoggle").textContent = "Auto Buy: OFF"
        DOMCacheGetOrSet("tesseractautobuytoggle").style.border = "2px solid red"
        
    } else {
        player.tesseractAutoBuyerToggle = 1;
        DOMCacheGetOrSet("tesseractautobuytoggle").textContent = "Auto Buy: ON"
        DOMCacheGetOrSet("tesseractautobuytoggle").style.border = "2px solid green"
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
        DOMCacheGetOrSet("toggleresearchbuy").textContent = "Upgrade: 1 Level"
    } else {
        G['maxbuyresearch'] = true;
        DOMCacheGetOrSet("toggleresearchbuy").textContent = "Upgrade: MAX [if possible]"
    }
}

export const toggleAutoResearch = () => {
    const el = DOMCacheGetOrSet("toggleautoresearch")
    if (player.autoResearchToggle) {
        player.autoResearchToggle = false;
        el.textContent = "Automatic: OFF";
        DOMCacheGetOrSet(`res${player.autoResearch || 1}`).classList.remove("researchRoomba");
        player.autoResearch = 0;
    } else {
        player.autoResearchToggle = true;
        el.textContent = "Automatic: ON"
    }

    if (player.autoResearchToggle && player.cubeUpgrades[9] === 1 && player.autoResearchMode === 'cheapest') {
        player.autoResearch = G['researchOrderByCost'][player.roombaResearchIndex]
    }

}

export const toggleAutoResearchMode = () => {
    const el = DOMCacheGetOrSet("toggleautoresearchmode")
    if (player.autoResearchMode === 'cheapest') {
        player.autoResearchMode = 'manual';
        el.textContent = "Automatic mode: Manual";
    } else {
        player.autoResearchMode = 'cheapest';
        el.textContent = "Automatic mode: Cheapest";
    }
    DOMCacheGetOrSet(`res${player.autoResearch || 1}`).classList.remove("researchRoomba");

    if (player.autoResearchToggle && player.cubeUpgrades[9] === 1 && player.autoResearchMode === 'cheapest') {
        player.autoResearch = G['researchOrderByCost'][player.roombaResearchIndex]
    }
}

export const toggleAutoSacrifice = (index: number) => {
    const el = DOMCacheGetOrSet("toggleautosacrifice")
    if (index === 0) {
        if (player.autoSacrificeToggle) {
            player.autoSacrificeToggle = false;
            el.textContent = "Auto Runes: OFF";
            DOMCacheGetOrSet("toggleautosacrifice").style.border = "2px solid red"
            player.autoSacrifice = 0;
        } else {
            player.autoSacrificeToggle = true;
            el.textContent = "Auto Runes: ON"
            DOMCacheGetOrSet("toggleautosacrifice").style.border = "2px solid green"
        }
    } else if (player.autoSacrificeToggle && player.shopUpgrades.offeringAuto > 0.5) {
        player.autoSacrifice = index;
    }
    for (let i = 1; i <= 5; i++) {
        DOMCacheGetOrSet("rune" + i).style.backgroundColor = player.autoSacrifice === i ? "orange" : "#171717";
    }
    calculateRuneLevels();
}

export const toggleBuildingScreen = (input: BuildingSubtab) => {
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
        DOMCacheGetOrSet(screen[key].screen).style.display = "none";
        DOMCacheGetOrSet(screen[key].button).style.backgroundColor = "";
    }
    DOMCacheGetOrSet(screen[G['buildingSubTab']].screen).style.display = "flex"
    DOMCacheGetOrSet(screen[G['buildingSubTab']].button).style.backgroundColor = "crimson"
    player.subtabNumber = screen[G['buildingSubTab']].subtabNumber
}

export const toggleRuneScreen = (index: number) => {
    const screens = ['runes', 'talismans', 'blessings', 'spirits'];
    G['runescreen'] = screens[index - 1];

    for (let i = 1; i <= 4; i++) {
        const a = DOMCacheGetOrSet("toggleRuneSubTab" + i);
        const b = DOMCacheGetOrSet("runeContainer" + i);
        if (i === index) {
            a.style.border = "2px solid gold"
            a.style.backgroundColor = "crimson"
            b.style.display = "flex";
        } else {
            a.style.border = "2px solid silver"
            a.style.backgroundColor = ""
            b.style.display = "none";
        }
    }
    player.subtabNumber = index - 1
}

export const toggleautofortify = () => {
    const el = DOMCacheGetOrSet("toggleautofortify");
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
    const el = DOMCacheGetOrSet("toggleautoenhance");
    if (player.autoEnhanceToggle === false && player.researches[135] == 1) {
        el.textContent = "Auto Enhance: ON"
        el.style.border = "2px solid green"        
    } else {
        el.textContent = "Auto Enhance: OFF"
        el.style.border = "2px solid red"
    }

    player.autoEnhanceToggle = !player.autoEnhanceToggle;
}

interface ChadContributor {
    login: string
    id: number
    node_id: string
    avatar_url: string
    gravatar_id: string
    url: string
    html_url: string
    followers_url: string
    following_url: string
    gists_url: string
    starred_url: string
    subscriptions_url: string
    organizations_url: string
    repos_url: string
    events_url: string
    received_events_url: string
    type: string
    site_admin: boolean
    contributions: number
}

const setActiveSettingScreen = async (subtab: string, clickedButton: HTMLButtonElement) => {
    const subtabEl = DOMCacheGetOrSet(subtab);
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
            loadPowderMultiplier();
            if (!subtabEl.classList.contains("subtabActive"))
                clearInt(id);
        }

        const id = interval(refreshStats, 1000)
        refreshStats();
    } else if (subtab === 'creditssubtab') {
        const credits = DOMCacheGetOrSet('creditList');
        const artists = DOMCacheGetOrSet('artistList');

        if (credits.childElementCount > 0 || artists.childElementCount > 0) {
            return;
        } else if (!navigator.onLine || document.hidden) {
            return;
        }

        try {
            const r = await fetch('https://api.github.com/repos/pseudo-corp/SynergismOfficial/contributors', {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            const j = await r.json() as ChadContributor[];

            for (const contributor of j) { 
                const div = document.createElement('div');
                div.classList.add('credit');

                const img = new Image(32, 32);
                img.src = contributor.avatar_url;
                img.alt = contributor.login;

                const a = document.createElement('a');
                a.href = `https://github.com/Pseudo-Corp/SynergismOfficial/commits?author=${contributor.login}`;
                a.textContent = contributor.login;
                a.target = '_blank';
                a.rel = 'noopener noreferrer nofollow';
                
                div.appendChild(img);
                div.appendChild(a);

                credits.appendChild(div);
            }
        } catch (e) {
            const err = e as Error;
            credits.appendChild(document.createTextNode(err.toString()));
        }

        try {
            const r = await fetch('https://api.github.com/gists/01917ff476d25a141c5bad38340cd756', {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            const j = await r.json() as { files: Record<string, { content: string }> };
            const f = JSON.parse(j.files['synergism_artists.json'].content) as string[];

            for (const user of f) {
                const p = document.createElement('p');
                p.textContent = user;

                artists.appendChild(p);
            }
        } catch (e) {
            const err = e as Error;
            credits.appendChild(document.createTextNode(err.toString()));
        }
    }
}

export const toggleShopConfirmation = () => {
    const el = DOMCacheGetOrSet("toggleConfirmShop")
    el.textContent = G['shopConfirmation']
        ? "Shop Confirmations: OFF"
        : "Shop Confirmations: ON";

    G['shopConfirmation'] = !G['shopConfirmation'];
}

export const toggleBuyMaxShop = () => {
    const el = DOMCacheGetOrSet("toggleBuyMaxShop")
    el.textContent = G['shopBuyMax']
        ? "Buy Max: OFF"
        : "Buy Max: ON";

    G['shopBuyMax'] = !G['shopBuyMax'];
}

export const toggleAntMaxBuy = () => {
    const el = DOMCacheGetOrSet("toggleAntMax");
    el.textContent = player.antMax 
        ? "Buy Max: OFF"
        : "Buy Max: ON";

    player.antMax = !player.antMax;
}

export const toggleAntAutoSacrifice = (mode = 0) => {
    if (mode === 0) {
        const el = DOMCacheGetOrSet("toggleAutoSacrificeAnt");
        if (player.autoAntSacrifice) {
            player.autoAntSacrifice = false;
            el.textContent = "Auto Sacrifice: OFF"
        } else {
            player.autoAntSacrifice = true;
            el.textContent = "Auto Sacrifice: ON"
        }
    } else if (mode === 1) {
        const el = DOMCacheGetOrSet("autoSacrificeAntMode");
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
    const el = DOMCacheGetOrSet("toggleCubeBuy")
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
        const cubeTab = DOMCacheGetOrSet(`cubeTab${j}`);
        if (cubeTab.style.display === "flex" && j !== i) {
            cubeTab.style.display = "none"
        }
        if (cubeTab.style.display === "none" && j === i) {
            cubeTab.style.display = "flex"
            player.subtabNumber = j - 1
        }
        DOMCacheGetOrSet("switchCubeSubTab" + j).style.backgroundColor = i === j ? "crimson" : ""
    }

    visualUpdateCubes();
}

export const updateAutoChallenge = (i: number) => {
    switch (i) {
        case 1: {
            const t = parseFloat((DOMCacheGetOrSet('startAutoChallengeTimerInput') as HTMLInputElement).value) || 0;
            player.autoChallengeTimer.start = Math.max(t, 0);
            DOMCacheGetOrSet("startTimerValue").textContent = format(player.autoChallengeTimer.start, 2, true) + "s";
            return;
        }
        case 2: {
            const u = parseFloat((DOMCacheGetOrSet('exitAutoChallengeTimerInput') as HTMLInputElement).value) || 0;
            player.autoChallengeTimer.exit = Math.max(u, 0);
            DOMCacheGetOrSet("exitTimerValue").textContent = format(player.autoChallengeTimer.exit, 2, true) + "s";
            return;
        }
        case 3: {
            const v = parseFloat((DOMCacheGetOrSet('enterAutoChallengeTimerInput') as HTMLInputElement).value) || 0;
            player.autoChallengeTimer.enter = Math.max(v, 0);
            DOMCacheGetOrSet("enterTimerValue").textContent = format(player.autoChallengeTimer.enter, 2, true) + "s";
            return;
        }
    }
}

export const toggleAutoChallengesIgnore = (i: number) => {
    const el = DOMCacheGetOrSet("toggleAutoChallengeIgnore");
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
    const el = DOMCacheGetOrSet('toggleAutoChallengeStart');
    if (player.autoChallengeRunning) {
        el.style.border = "2px solid red"
        el.textContent = "Auto Challenge Sweep [OFF]"
        player.autoChallengeIndex = 1;
        G['autoChallengeTimerIncrement'] = 0;
        toggleAutoChallengeModeText("OFF")
    } else {
        el.style.border = "2px solid gold"
        el.textContent = "Auto Challenge Sweep [ON]"
        toggleAutoChallengeModeText("START")
    }

    player.autoChallengeRunning = !player.autoChallengeRunning;
}

export const toggleAutoChallengeModeText = (i: string) => {
    const a = DOMCacheGetOrSet("autoChallengeType");
    a.textContent = "MODE: " + i
}

export const toggleAutoAscend = () => {
    const a = DOMCacheGetOrSet("ascensionAutoEnable");
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
            const t = Math.floor(parseFloat((DOMCacheGetOrSet('buyRuneBlessingInput') as HTMLInputElement).value)) || 1;
            player.runeBlessingBuyAmount = Math.max(t, 1);
            DOMCacheGetOrSet('buyRuneBlessingToggleValue').textContent = format(player.runeBlessingBuyAmount, 0, true);
            return;
        }
        case 2: {
            const u = Math.floor(parseFloat((DOMCacheGetOrSet('buyRuneSpiritInput') as HTMLInputElement).value)) || 1;
            player.runeSpiritBuyAmount = Math.max(u, 1);
            DOMCacheGetOrSet('buyRuneSpiritToggleValue').textContent = format(player.runeSpiritBuyAmount, 0, true);
            return;
        }
    }
}

export const toggleAutoTesseracts = (i: number) => {
    const el = DOMCacheGetOrSet('tesseractAutoToggle' + i);
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
    const maxCorruption = 13
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
        DOMCacheGetOrSet("corruptionCleanseConfirm").style.visibility = "hidden";

        if (player.currentChallenge.ascension === 15) {
            void resetCheck('ascensionChallenge', false, true)
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
    const el = DOMCacheGetOrSet(`unit${id}`);
    if (!el) {
        console.log(id, 'platonic needs to fix');
        return;
    }

    el.textContent = player.ascStatToggles[id] ? '/s' : '';
    player.ascStatToggles[id] = !player.ascStatToggles[id];
}
