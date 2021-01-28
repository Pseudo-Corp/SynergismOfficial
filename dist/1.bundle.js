(self["webpackChunksynergismofficial"] = self["webpackChunksynergismofficial"] || []).push([[1],{

/***/ 39:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "main": () => /* binding */ main
/* harmony export */ });
/* harmony import */ var _Calculate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9);
/* harmony import */ var _Platonic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(33);
/* harmony import */ var _Synergism__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(0);
/* harmony import */ var _Toggles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7);
/* harmony import */ var _UpdateVisuals__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(24);
/* harmony import */ var _Utility__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(4);
/* harmony import */ var _Variables__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(5);







const SplitTime = (numberOfHours) => {
    const Days = Math.floor(numberOfHours / 24);
    const Remainder = numberOfHours % 24;
    const Hours = Math.floor(Remainder);
    const Minutes = Math.floor(60 * (Remainder - Hours));
    return ({ Days, Hours, Minutes });
};
const getCubeTimes = (i = 5, levels = 1) => {
    const [, , , , , tess, hyper, plat] = (0,_Calculate__WEBPACK_IMPORTED_MODULE_0__.CalcCorruptionStuff)();
    const Upgrades = _Platonic__WEBPACK_IMPORTED_MODULE_1__.platUpgradeBaseCosts[i];
    const tessCost = Upgrades.tesseracts * levels;
    const hyperCost = Upgrades.hypercubes * levels;
    const platCost = Upgrades.platonics * levels;
    const time = _Synergism__WEBPACK_IMPORTED_MODULE_2__.player.ascensionCounter / 3600;
    const platRate = plat / time;
    const hyperRate = hyper / time;
    const tessRate = tess / time;
    const platTimeNeeded = (platCost - _Synergism__WEBPACK_IMPORTED_MODULE_2__.player.wowPlatonicCubes - plat) / platRate;
    const hyperTimeNeeded = (hyperCost - _Synergism__WEBPACK_IMPORTED_MODULE_2__.player.wowHypercubes - hyper) / hyperRate;
    const tessTimeNeeded = (tessCost - _Synergism__WEBPACK_IMPORTED_MODULE_2__.player.wowTesseracts - tess) / tessRate;
    const Plats = SplitTime(Math.max(0, platTimeNeeded));
    const Hypers = SplitTime(Math.max(0, hyperTimeNeeded));
    const Tess = SplitTime(Math.max(0, tessTimeNeeded));
    const totalTimeNeeded = Math.max(0, platTimeNeeded, hyperTimeNeeded, tessTimeNeeded);
    const minutesToAdd = totalTimeNeeded * 60;
    const futureDate = new Date(Date.now() + minutesToAdd * 60000);
    return _Utility__WEBPACK_IMPORTED_MODULE_5__.stripIndents `
        Time left until next ${levels} level(s) of platonic upgrade ${i} purchase:
        Plats: ${Plats.Days} Days, ${Plats.Hours} Hours, ${Plats.Minutes} Minutes
        Hypers: ${Hypers.Days} Days, ${Hypers.Hours} Hours, ${Hypers.Minutes} Minutes
        Tess: ${Tess.Days} Days, ${Tess.Hours} Hours, ${Tess.Minutes} Minutes

        At your current rate, you are expected to get this at:
        ${futureDate}

        Leftovers after ${(totalTimeNeeded / 24).toPrecision(4)} days:
        Platonics: ${(platRate * (totalTimeNeeded - platTimeNeeded)).toPrecision(4)}
        Hypers: ${(hyperRate * (totalTimeNeeded - hyperTimeNeeded)).toPrecision(4)}
        Tesseracts: ${(tessRate * (totalTimeNeeded - tessTimeNeeded)).toPrecision(4)}
    `;
};
const GM_addStyle = (css) => {
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
};
const statValues = {
    0: el => el.textContent = (0,_Synergism__WEBPACK_IMPORTED_MODULE_2__.format)(_Synergism__WEBPACK_IMPORTED_MODULE_2__.player.ascendShards),
    1: el => el.textContent = document.getElementById("cubeBlessingTotalAmount").textContent,
    2: el => el.textContent = document.getElementById("tesseractBlessingTotalAmount").textContent,
    3: el => el.textContent = document.getElementById("hypercubeBlessingTotalAmount").textContent,
    4: el => el.textContent = document.getElementById("platonicBlessingTotalAmount").textContent,
    5: el => el.textContent = _Synergism__WEBPACK_IMPORTED_MODULE_2__.player.challengecompletions.slice(11, 15).join(' / '),
    6: el => el.textContent = (0,_Synergism__WEBPACK_IMPORTED_MODULE_2__.format)(_Synergism__WEBPACK_IMPORTED_MODULE_2__.player.challenge15Exponent, 0),
    7: el => el.textContent = _Synergism__WEBPACK_IMPORTED_MODULE_2__.player.runeBlessingLevels.slice(1, 6).map(x => (0,_Synergism__WEBPACK_IMPORTED_MODULE_2__.format)(x)).join(' / '),
    8: el => el.textContent = _Synergism__WEBPACK_IMPORTED_MODULE_2__.player.runeSpiritLevels.slice(1, 6).map(x => (0,_Synergism__WEBPACK_IMPORTED_MODULE_2__.format)(x)).join(' / '),
    9: el => el.textContent = _Synergism__WEBPACK_IMPORTED_MODULE_2__.player.usedCorruptions.slice(1, 10).join(' / '),
    10: el => el.textContent = _Synergism__WEBPACK_IMPORTED_MODULE_2__.player.challengecompletions.slice(1, 6).join(' / '),
    11: el => el.textContent = _Synergism__WEBPACK_IMPORTED_MODULE_2__.player.challengecompletions.slice(6, 11).join(' / '),
    12: el => el.textContent = _Synergism__WEBPACK_IMPORTED_MODULE_2__.player.runelevels.join(' / '),
    13: el => {
        const talismanColors = ['white', 'limegreen', 'lightblue', 'plum', 'orange', 'crimson'];
        el.querySelectorAll('span').forEach((span, i) => {
            span.style.color = talismanColors[_Synergism__WEBPACK_IMPORTED_MODULE_2__.player.talismanRarity[i] - 1];
            span.textContent = _Synergism__WEBPACK_IMPORTED_MODULE_2__.player.talismanLevels[i] + '';
        });
    },
    14: el => {
        const roomba = _Synergism__WEBPACK_IMPORTED_MODULE_2__.player.autoResearchToggle;
        el.style.color = roomba ? 'green' : 'red';
        el.textContent = roomba ? 'ON' : 'OFF';
    },
    15: el => {
        const autorune = _Synergism__WEBPACK_IMPORTED_MODULE_2__.player.autoSacrificeToggle;
        el.style.color = autorune ? 'green' : 'red';
        el.textContent = autorune ? 'ON' : 'OFF';
    },
    16: el => {
        const autoch = _Synergism__WEBPACK_IMPORTED_MODULE_2__.player.autoChallengeRunning;
        el.style.color = autoch ? 'green' : 'red';
        el.textContent = autoch ? 'ON' : 'OFF';
    },
    17: el => {
        const autosac = _Synergism__WEBPACK_IMPORTED_MODULE_2__.player.autoAntSacrifice;
        const realtime = _Synergism__WEBPACK_IMPORTED_MODULE_2__.player.autoAntSacrificeMode === 2;
        const seconds = _Synergism__WEBPACK_IMPORTED_MODULE_2__.player.autoAntSacTimer;
        const text = el.firstChild;
        text.textContent = `(${seconds} ${realtime ? 'real' : 'igt'} seconds) `;
        const button = el.lastElementChild;
        button.style.color = autosac ? 'green' : 'red';
        button.textContent = autosac ? 'ON' : 'OFF';
    }
};
const css = `
    #dashboard {
        text-align: left;
    }
    .db-table {
        display: flex;
        flex-wrap: wrap;
        margin: 0;
        padding: 0.5em;
    }
    .db-table-cell {
        box-sizing: border-box;
        flex-grow: 1;
        width: 50%;
        padding: 0.8em 1.2em;
        overflow: hidden;
        list-style: none;
        border: none;
    }
    .db-stat-line {
        display: flex;
        justify-content: space-between;
    }
`;
const tab = document.createElement('div');
tab.id = 'dashboardSubTab';
tab.style.display = 'none';
tab.innerHTML = `
<div id="dashboard" class="db-table" style="background-color: #111;">
    <div class="db-table-cell" style="width: 35%;">
    <h3 style="color: plum">Overall progress stats</h3>
    <div class="db-stat-line" style="color: orange">Constant: <span class="dashboardstat"></span></div>
    <div class="db-stat-line" style="color: yellow">Cube tributes: <span class="dashboardstat"></span></div>
    <div class="db-stat-line" style="color: orchid">Tesseract gifts: <span class="dashboardstat"></span></div>
    <div class="db-stat-line" style="color: crimson">Hypercube benedictions: <span class="dashboardstat"></span></div>
    <div class="db-stat-line" style="color: lightgoldenrodyellow">Platonic Cubes opened: <span class="dashboardstat"></span></div>
    <div class="db-stat-line" style="color: #ffac75">C11-14 completions: <span class="dashboardstat"></span></div>
    <div class="db-stat-line" style="color: gold">C15 exponent: <span class="dashboardstat"></span></div>
    <div class="db-stat-line">Blessing levels: <span class="dashboardstat"></span></div>
    <div class="db-stat-line">Spirit levels: <span class="dashboardstat"></span></div>

    <h3 style="color: plum">Current run stats</h3>
    <div class="db-stat-line" style="color: white">Loadout: <span class="dashboardstat"></span></div>
    <div class="db-stat-line" style="color: plum">C1-5 completions: <span class="dashboardstat"></span></div>
    <div class="db-stat-line" style="color: limegreen">C6-10 completions: <span class="dashboardstat"></span></div>
    <div class="db-stat-line" style="color: cyan">Rune levels: <span class="dashboardstat"></span></div>
    <div class="db-stat-line">Talisman levels: <span class="dashboardstat">
        <span></span> / <span></span> / <span></span> / <span></span> / <span></span> / <span></span> / <span></span>
    </span></div>

    <h3 style="color: plum">Settings</h3>
    <div class="db-stat-line">Autoresearch: <button class="dashboardstat dashboardstatResearch"></button></div>
    <div class="db-stat-line">Autorunes: <button class="dashboardstat dashboardstatRunes"></button></div>
    <div class="db-stat-line">Autochallenge: <button class="dashboardstat dashboardstatChallenge"></button></div>
    <div class="db-stat-line">Ants Autosacrifice: <span class="dashboardstat"> <button class="dashboardstatSac"></button></span></div>
    </div>
    <div class="db-table-cell">
        <h3 style="color: plum">Time to plat upgrade</h3>
        Platonic upgrade: <input id="db-plat-number" type="number" min="1" max="15" step="1" value="5">
        Number of levels: <input id="db-plat-amount" type="number" min="1" max="100" step="1" value="1">
        <div><pre id="cubeTimes"></pre></div>
    </div>
</div>
`;
const settingsTab = document.getElementById('settings');
const button = document.createElement('button');
button.className = 'ascendunlockib';
button.style.border = '2px solid orange;';
button.style.float = 'right';
button.style.height = '30px';
button.style.width = '150px';
button.style.margin = '9px 0';
let dashboardLoopRefFast = null;
let dashboardLoopRefSlow = null;
let activeTab = null;
let open = false;
const renderDashboardSlow = () => {
    const upgrade = Number((0,_Utility__WEBPACK_IMPORTED_MODULE_5__.getElementById)('db-plat-number').value);
    const levels = Number((0,_Utility__WEBPACK_IMPORTED_MODULE_5__.getElementById)('db-plat-amount').value);
    tab.querySelector('#cubeTimes').textContent = getCubeTimes(upgrade, levels);
};
const renderDashboardFast = () => {
    if (_Variables__WEBPACK_IMPORTED_MODULE_6__.Globals.currentTab !== 'settings') {
        open = false;
        return exitDashboard();
    }
    tab.querySelectorAll('.dashboardstat').forEach((stat, i) => { var _a; return (_a = statValues[i]) === null || _a === void 0 ? void 0 : _a.call(statValues, stat); });
};
const openDashboard = () => {
    const n = _Synergism__WEBPACK_IMPORTED_MODULE_2__.player.subtabNumber;
    _Variables__WEBPACK_IMPORTED_MODULE_6__.Globals.currentTab = 'cubes';
    [0, 1, 2, 3].forEach(i => {
        _Synergism__WEBPACK_IMPORTED_MODULE_2__.player.subtabNumber = i;
        (0,_UpdateVisuals__WEBPACK_IMPORTED_MODULE_4__.visualUpdateCubes)();
    });
    _Variables__WEBPACK_IMPORTED_MODULE_6__.Globals.currentTab = 'settings';
    _Synergism__WEBPACK_IMPORTED_MODULE_2__.player.subtabNumber = n;
    renderDashboardFast();
    renderDashboardSlow();
    dashboardLoopRefFast = setInterval(renderDashboardFast, 100);
    dashboardLoopRefSlow = setInterval(renderDashboardSlow, 1000);
    activeTab = settingsTab.getElementsByClassName('subtabActive')[0];
    activeTab.style.display = 'none';
    tab.style.display = 'block';
    button.innerText = 'Exit Dashboard';
    button.style.marginLeft = '100%';
    const buttons = settingsTab.getElementsByClassName('subtabSwitcher')[0];
    buttons.style.display = 'none';
};
const exitDashboard = () => {
    clearInterval(dashboardLoopRefFast);
    clearInterval(dashboardLoopRefSlow);
    tab.style.display = 'none';
    activeTab.style.display = null;
    button.innerText = 'Dashboard';
    button.style.marginLeft = null;
    const buttons = settingsTab.getElementsByClassName('subtabSwitcher')[0];
    buttons.style.display = null;
};
const enable = () => {
    console.log('hello synergism, dashboard installed in the settings tab');
    GM_addStyle(css);
    tab.querySelector('.dashboardstatResearch').addEventListener('click', () => (0,_Toggles__WEBPACK_IMPORTED_MODULE_3__.toggleAutoResearch)());
    tab.querySelector('.dashboardstatRunes').addEventListener('click', () => (0,_Toggles__WEBPACK_IMPORTED_MODULE_3__.toggleAutoSacrifice)(0));
    tab.querySelector('.dashboardstatChallenge').addEventListener('click', () => (0,_Toggles__WEBPACK_IMPORTED_MODULE_3__.toggleAutoChallengeRun)());
    tab.querySelector('.dashboardstatSac').addEventListener('click', () => (0,_Toggles__WEBPACK_IMPORTED_MODULE_3__.toggleAntAutoSacrifice)(0));
    settingsTab.appendChild(tab);
    button.addEventListener('click', () => (open = !open) ? openDashboard() : exitDashboard());
    button.innerText = 'Dashboard';
    settingsTab.firstElementChild.insertAdjacentElement('beforebegin', button);
};
const main = () => {
    Object.defineProperty(window, 'dashboard', {
        value: enable
    });
};


/***/ })

}]);