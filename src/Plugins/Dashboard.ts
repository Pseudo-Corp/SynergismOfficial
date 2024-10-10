import i18next from 'i18next'
import { DOMCacheGetOrSet } from '../Cache/DOM'
import { CalcCorruptionStuff } from '../Calculate'
import { platUpgradeBaseCosts } from '../Platonic'
import { format, player } from '../Synergism'
import { Tabs } from '../Tabs'
import { toggleAntAutoSacrifice, toggleAutoChallengeRun, toggleAutoResearch, toggleAutoSacrifice } from '../Toggles'
import { visualUpdateCubes } from '../UpdateVisuals'
import { getElementById, stripIndents } from '../Utility'
import { Globals as G } from '../Variables'

/**
 * An adaptation of @see {https://github.com/blaze33/synergism.dashboard/} for the new plugin/Typescript system
 * introduced in version 2.5.0.
 * @license MIT Copyright (c) 2020 Maxime Rouyrre
 */

/**
 * Lulu's getCubeTime adapted for the dashboard script adapted for Typescript adapted for ... ?
 */

/**
 * TODO: Fix NaNs and Infinity
 * An infinite value can be passed into numberOfHours, but forcing it to be finite doesn't seem like
 * a valid solution.
 */
const SplitTime = (numberOfHours: number) => {
  const Days = Math.floor(numberOfHours / 24)
  const Remainder = numberOfHours % 24
  const Hours = Math.floor(Remainder)
  const Minutes = Math.floor(60 * (Remainder - Hours))

  return ({ Days, Hours, Minutes })
}

const getCubeTimes = (i = 5, levels = 1) => {
  const [, , , , , tess, hyper, plat] = CalcCorruptionStuff()

  const Upgrades = platUpgradeBaseCosts[i]
  const tessCost = Upgrades.tesseracts * levels
  const hyperCost = Upgrades.hypercubes * levels
  const platCost = Upgrades.platonics * levels
  const time = player.ascensionCounter / 3600
  const platRate = plat / time
  const hyperRate = hyper / time
  const tessRate = tess / time
  const platTimeNeeded = (platCost - Number(player.wowPlatonicCubes) - plat) / platRate
  const hyperTimeNeeded = (hyperCost - Number(player.wowHypercubes) - hyper) / hyperRate
  const tessTimeNeeded = (tessCost - Number(player.wowTesseracts) - tess) / tessRate
  const Plats = SplitTime(Math.max(0, platTimeNeeded))
  const Hypers = SplitTime(Math.max(0, hyperTimeNeeded))
  const Tess = SplitTime(Math.max(0, tessTimeNeeded))

  const totalTimeNeeded = Math.max(0, platTimeNeeded, hyperTimeNeeded, tessTimeNeeded)
  const minutesToAdd = totalTimeNeeded * 60
  const futureDate = new Date(Date.now() + minutesToAdd * 60000)

  return stripIndents`
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
    `
}

const GM_addStyle = (css: string) => {
  const style = document.createElement('style')
  style.id = 'syn_dashboard_plugin'
  style.appendChild(document.createTextNode(css))
  document.head.appendChild(style)
}

const statValues: ((el: HTMLElement) => void)[] = [
  (el) => el.textContent = format(player.ascendShards),
  (el) => el.textContent = DOMCacheGetOrSet('cubeBlessingTotalAmount').textContent,
  (el) => el.textContent = DOMCacheGetOrSet('tesseractBlessingTotalAmount').textContent,
  (el) => el.textContent = DOMCacheGetOrSet('hypercubeBlessingTotalAmount').textContent,
  (el) => el.textContent = DOMCacheGetOrSet('platonicBlessingTotalAmount').textContent,
  (el) => el.textContent = player.challengecompletions.slice(11, 15).join(' / '),
  (el) => el.textContent = format(player.challenge15Exponent, 0),
  (el) => el.textContent = player.runeBlessingLevels.slice(1, 6).map((x) => format(x)).join(' / '),
  (el) => el.textContent = player.runeSpiritLevels.slice(1, 6).map((x) => format(x)).join(' / '),
  (el) => el.textContent = player.usedCorruptions.slice(1, 10).join(' / '),
  (el) => el.textContent = player.challengecompletions.slice(1, 6).join(' / '),
  (el) => el.textContent = player.challengecompletions.slice(6, 11).join(' / '),
  (el) => el.textContent = player.runelevels.join(' / '),
  (el) => {
    const talismanColors = ['white', 'limegreen', 'lightblue', 'plum', 'orange', 'crimson']
    el.querySelectorAll('span').forEach((span, i) => {
      span.style.color = talismanColors[player.talismanRarity[i] - 1]
      span.textContent = `${player.talismanLevels[i]}`
    })
  },
  (el) => {
    const roomba = player.autoResearchToggle && player.autoResearchMode === 'cheapest'
    el.style.color = roomba ? 'green' : 'red'
    el.textContent = roomba ? i18next.t('general.on') : i18next.t('general.off')
  },
  (el) => {
    const autorune = player.autoSacrificeToggle
    el.style.color = autorune ? 'green' : 'red'
    el.textContent = autorune ? i18next.t('general.on') : i18next.t('general.off')
  },
  (el) => {
    const autoch = player.autoChallengeRunning
    el.style.color = autoch ? 'green' : 'red'
    el.textContent = autoch ? i18next.t('general.on') : i18next.t('general.off')
  },
  (el) => {
    const autosac = player.autoAntSacrifice
    const realtime = player.autoAntSacrificeMode === 2
    const seconds = player.autoAntSacTimer
    const text = el.firstChild as HTMLElement
    text.textContent = `(${seconds} ${realtime ? 'real' : 'igt'} seconds) `
    const button = el.lastElementChild as HTMLElement
    button.style.color = autosac ? 'green' : 'red'
    button.textContent = autosac ? i18next.t('general.on') : i18next.t('general.off')
  }
]

const css = `
    #dashboard { text-align: left; }
    .db-table {
        display: grid;
        grid-template-columns: 10% [a] 40% [b] 40% 10%;
        padding: 0.5em;
    }
    .db-table-cell:nth-child(odd) { grid-area: a; }
    .db-table-cell:nth-child(even) { grid-area: b; }
    .db-table-cell { padding: 0.8em 1.2em; }
    .db-stat-line {
        display: flex;
        justify-content: space-between;
    }
`

const tab = document.createElement('div')
tab.id = 'dashboardSubTab'
tab.style.display = 'none'
tab.innerHTML = `
<div id="dashboard" class="db-table" style="background-color: #111;">
    <div class="db-table-cell">
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
`

const settingsTab = DOMCacheGetOrSet('settings')
const button = document.createElement('button')
button.className = 'ascendunlockib'

let dashboardLoopRefFast: ReturnType<typeof setTimeout> | null = null
let dashboardLoopRefSlow: ReturnType<typeof setTimeout> | null = null
let activeTab: HTMLElement | null = null
let open = false

const renderDashboardSlow = () => {
  const upgrade = Number(getElementById<HTMLInputElement>('db-plat-number').value)
  const levels = Number(getElementById<HTMLInputElement>('db-plat-amount').value)
  tab.querySelector('#cubeTimes')!.textContent = getCubeTimes(upgrade, levels)
}

const renderDashboardFast = () => {
  if (G.currentTab !== Tabs.Settings) {
    open = false
    return exitDashboard()
  }

  Array.from(tab.getElementsByClassName('dashboardstat')).forEach((stat, i) => statValues[i]?.(stat as HTMLElement))
}

const openDashboard = () => {
  // compute blessings total amounts
  const n = player.subtabNumber
  G.currentTab = Tabs.WowCubes
  ;[0, 1, 2, 3].forEach((i) => {
    player.subtabNumber = i
    visualUpdateCubes()
  })
  G.currentTab = Tabs.Settings
  player.subtabNumber = n
  // render and display dashboard
  renderDashboardFast()
  renderDashboardSlow()
  dashboardLoopRefFast = setInterval(renderDashboardFast, 100)
  dashboardLoopRefSlow = setInterval(renderDashboardSlow, 1000)
  activeTab = settingsTab.getElementsByClassName('subtabActive')[0] as HTMLElement
  activeTab.style.display = 'none'
  tab.style.display = 'block'
  button.innerText = 'Exit Dashboard'
}

const exitDashboard = () => {
  clearInterval(dashboardLoopRefFast!)
  clearInterval(dashboardLoopRefSlow!)
  tab.style.display = 'none'
  activeTab!.style.display = ''
  button.textContent = 'Dashboard'
  const buttons = settingsTab.getElementsByClassName('subtabSwitcher')[0] as HTMLElement
  buttons.style.display = ''
}

const btnListener = () => {
  open = !open
  open ? openDashboard() : exitDashboard()
}

const subButtons = () => {
  if (open) {
    open = !open
    exitDashboard()
  }
}

/**
 * Add the elements to the DOM so they are usable.
 */
const enable = () => {
  const style = document.head.querySelector('#syn_dashboard_plugin')
  if (style !== null) { // plugin is already enabled
    document.head.removeChild(style)
    document.querySelector('#settings > .subtabSwitcher')!.removeChild(button)
    button.removeEventListener('click', btnListener)
    document.querySelectorAll<HTMLElement>('[id^="switchSettingSubTab"]').forEach((v) =>
      v.removeEventListener('click', subButtons)
    )
    settingsTab.removeChild(tab)
    return
  }

  GM_addStyle(css)
  document.querySelector('#settings > .subtabSwitcher')!.appendChild(button)

  tab.querySelector('.dashboardstatResearch')!.addEventListener('click', () => toggleAutoResearch())
  tab.querySelector('.dashboardstatRunes')!.addEventListener('click', () => toggleAutoSacrifice(0))
  tab.querySelector('.dashboardstatChallenge')!.addEventListener('click', () => toggleAutoChallengeRun())
  tab.querySelector('.dashboardstatSac')!.addEventListener('click', () => toggleAntAutoSacrifice(0))

  document.querySelectorAll<HTMLElement>('[id^="switchSettingSubTab"]').forEach((v) =>
    v.addEventListener('click', subButtons)
  )

  settingsTab.appendChild(tab)
  button.addEventListener('click', btnListener)
  button.textContent = 'Dashboard'
}

export const main = () => enable()
