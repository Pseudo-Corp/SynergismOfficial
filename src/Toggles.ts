import i18next from 'i18next'
import { achievementaward } from './Achievements'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { calculateRuneLevels } from './Calculate'
import { getChallengeConditions } from './Challenges'
import { corruptionDisplay, corruptionLoadoutTableUpdate, maxCorruptionLevel } from './Corruptions'
import { autoResearchEnabled } from './Research'
import { reset, resetrepeat } from './Reset'
import { format, player, resetCheck } from './Synergism'
import { subTabsInMainTab, Tabs } from './Tabs'
import type { BuildingSubtab, Player } from './types/Synergism'
import { Alert, Prompt, showCorruptionStatsLoadouts, updateChallengeDisplay } from './UpdateHTML'
import { visualUpdateAmbrosia, visualUpdateCubes, visualUpdateOcteracts } from './UpdateVisuals'
import { Globals as G } from './Variables'

export const toggleSettings = (toggle: HTMLElement) => {
  const toggleId = toggle.getAttribute('toggleId') ?? 1
  if (player.toggles[+toggleId]) {
    player.toggles[+toggleId] = false
  } else {
    player.toggles[+toggleId] = true
  }
  const format = toggle.getAttribute('format')

  if (format === '$' || format === '[$]') {
    const text = player.toggles[+toggleId] ? i18next.t('general.on') : i18next.t('general.off')
    toggle.textContent = format === '[$]' ? `[${text}]` : text
  } else if (format === 'Auto Catalyze: $') {
    const text = player.toggles[+toggleId] ? i18next.t('shop.autoCatalyzeOn') : i18next.t('shop.autoCatalyzeOff')
    toggle.textContent = text
  } else if (format === 'Hover-to-Buy [$]') {
    const text = player.toggles[+toggleId]
      ? i18next.t('researches.hoverToBuyOn')
      : i18next.t('researches.hoverToBuyOff')
    toggle.textContent = text
  } else if (format === 'Auto: $') {
    const text = player.toggles[+toggleId] ? i18next.t('general.autoOnColon') : i18next.t('general.autoOffColon')
    toggle.textContent = text
  } else if (format) {
    const finishedString = format.replace('$', player.toggles[+toggleId] ? 'ON' : 'OFF')
    toggle.textContent = finishedString
  } else {
    toggle.textContent = player.toggles[+toggleId]
      ? i18next.t('general.autoOnBracket')
      : i18next.t('general.autoOffBracket')
  }

  toggle.style.border = `2px solid ${player.toggles[+toggleId] ? 'green' : 'red'}`
}

export const toggleChallenges = (i: number, auto = false) => {
  if ((i <= 5)) {
    if (player.currentChallenge.ascension !== 15 || player.ascensionCounter >= 2) {
      player.currentChallenge.transcension = i
      reset('transcensionChallenge', false, 'enterChallenge')
      player.transcendCount -= 1
    }
    if (!player.currentChallenge.reincarnation && !document.querySelector('.resetbtn.hover')) {
      resetrepeat('transcensionChallenge')
    }
  }
  if ((i >= 6 && i < 11)) {
    if (player.currentChallenge.ascension !== 15 || player.ascensionCounter >= 2) {
      player.currentChallenge.reincarnation = i
      reset('reincarnationChallenge', false, 'enterChallenge')
      player.reincarnationCount -= 1
    }
    if (!document.querySelector('.resetbtn.hover')) {
      resetrepeat('reincarnationChallenge')
    }
  }
  if (
    i >= 11
    && ((!auto && !player.toggles[31]) || player.challengecompletions[10] > 0
      || (player.currentChallenge.transcension === 0 && player.currentChallenge.reincarnation === 0
        && player.currentChallenge.ascension === 0))
  ) {
    if (player.currentChallenge.ascension === 15) {
      void resetCheck('ascensionChallenge', false, true)
    }
    player.currentChallenge.ascension = i
    reset('ascensionChallenge', false, 'enterChallenge')
  }
  updateChallengeDisplay()
  getChallengeConditions(i)

  if (i <= 10 && !auto && player.autoChallengeRunning) {
    toggleAutoChallengeRun()
  }

  if (
    player.currentChallenge.transcension !== 0 && player.currentChallenge.reincarnation !== 0
    && player.currentChallenge.ascension !== 0 && player.achievements[238] < 1
  ) {
    achievementaward(238)
  }
}

type ToggleBuy = 'coin' | 'crystal' | 'mythos' | 'particle' | 'offering' | 'tesseract'

export const toggleBuyAmount = (quantity: 1 | 10 | 100 | 1000 | 10000 | 100000, type: ToggleBuy) => {
  player[`${type}buyamount` as const] = quantity
  const a = ['one', 'ten', 'hundred', 'thousand', '10k', '100k'][quantity.toString().length - 1]

  DOMCacheGetOrSet(`${type}${a}`).style.backgroundColor = 'Green'
  if (quantity !== 1) {
    DOMCacheGetOrSet(`${type}one`).style.backgroundColor = ''
  }
  if (quantity !== 10) {
    DOMCacheGetOrSet(`${type}ten`).style.backgroundColor = ''
  }
  if (quantity !== 100) {
    DOMCacheGetOrSet(`${type}hundred`).style.backgroundColor = ''
  }
  if (quantity !== 1000) {
    DOMCacheGetOrSet(`${type}thousand`).style.backgroundColor = ''
  }
  if (quantity !== 10000) {
    DOMCacheGetOrSet(`${type}10k`).style.backgroundColor = ''
  }
  if (quantity !== 100000) {
    DOMCacheGetOrSet(`${type}100k`).style.backgroundColor = ''
  }
}

type upgradeAutos = 'coin' | 'prestige' | 'transcend' | 'generators' | 'reincarnate'

/**
 * Updates Auto Upgrade Border Colors if applicable, or updates the status of an upgrade toggle as optional.
 * @param toggle Targets a specific upgrade toggle if provided
 */
export const toggleShops = (toggle?: upgradeAutos) => {
  // toggle provided: we do not want to update every button
  if (toggle) {
    player.shoptoggles[toggle] = !player.shoptoggles[toggle]
    DOMCacheGetOrSet(`${toggle}AutoUpgrade`).style.borderColor = player.shoptoggles[toggle] ? 'green' : 'red'

    if (player.shoptoggles[toggle]) {
      DOMCacheGetOrSet(`${toggle}AutoUpgrade`).textContent = i18next.t('general.autoOnColon')
    } else {
      DOMCacheGetOrSet(`${toggle}AutoUpgrade`).textContent = i18next.t('general.autoOffColon')
    }
  } else {
    const keys = Object.keys(player.shoptoggles) as (keyof Player['shoptoggles'])[]
    for (const key of keys) {
      const color = player.shoptoggles[key] ? 'green' : 'red'

      if (player.shoptoggles[key]) {
        DOMCacheGetOrSet(`${key}AutoUpgrade`).textContent = i18next.t('general.autoOnColon')
      } else {
        DOMCacheGetOrSet(`${key}AutoUpgrade`).textContent = i18next.t('general.autoOffColon')
      }

      DOMCacheGetOrSet(`${key}AutoUpgrade`).style.borderColor = color
    }
  }
}

export const toggleautoreset = (i: number) => {
  if (i === 1) {
    if (player.resettoggle1 === 1 || player.resettoggle1 === 0) {
      player.resettoggle1 = 2
      DOMCacheGetOrSet('prestigeautotoggle').textContent = i18next.t('toggles.modeTime')
    } else {
      player.resettoggle1 = 1
      DOMCacheGetOrSet('prestigeautotoggle').textContent = i18next.t('toggles.modeAmount')
    }
  } else if (i === 2) {
    if (player.resettoggle2 === 1 || player.resettoggle2 === 0) {
      player.resettoggle2 = 2
      DOMCacheGetOrSet('transcendautotoggle').textContent = i18next.t('toggles.modeTime')
    } else {
      player.resettoggle2 = 1
      DOMCacheGetOrSet('transcendautotoggle').textContent = i18next.t('toggles.modeAmount')
    }
  } else if (i === 3) {
    if (player.resettoggle3 === 1 || player.resettoggle3 === 0) {
      player.resettoggle3 = 2
      DOMCacheGetOrSet('reincarnateautotoggle').textContent = i18next.t('toggles.modeTime')
    } else {
      player.resettoggle3 = 1
      DOMCacheGetOrSet('reincarnateautotoggle').textContent = i18next.t('toggles.modeAmount')
    }
  } else if (i === 4) {
    if (player.resettoggle4 === 1 || player.resettoggle4 === 0) {
      player.resettoggle4 = 2
      DOMCacheGetOrSet('tesseractautobuymode').textContent = i18next.t('toggles.modePercentage')
    } else {
      player.resettoggle4 = 1
      DOMCacheGetOrSet('tesseractautobuymode').textContent = i18next.t('toggles.modeAmount')
    }
  }
}

export const toggleautobuytesseract = () => {
  if (player.tesseractAutoBuyerToggle === 1 || player.tesseractAutoBuyerToggle === 0) {
    player.tesseractAutoBuyerToggle = 2
    DOMCacheGetOrSet('tesseractautobuytoggle').textContent = i18next.t('runes.talismans.autoBuyOff')
    DOMCacheGetOrSet('tesseractautobuytoggle').style.border = '2px solid red'
  } else {
    player.tesseractAutoBuyerToggle = 1
    DOMCacheGetOrSet('tesseractautobuytoggle').textContent = i18next.t('runes.talismans.autoBuyOn')
    DOMCacheGetOrSet('tesseractautobuytoggle').style.border = '2px solid green'
  }
}

export const toggleauto = () => {
  const toggles = Array.from<HTMLElement>(document.querySelectorAll('.auto[toggleid]'))
  for (const toggle of toggles) {
    const format = toggle.getAttribute('format')
    const toggleId = toggle.getAttribute('toggleId') ?? 1

    if (format === '$') {
      const text = player.toggles[+toggleId] ? i18next.t('general.on') : i18next.t('general.off')
      toggle.textContent = text
    } else if (format === 'Auto Catalyze: $') {
      const text = player.toggles[+toggleId] ? i18next.t('shop.autoCatalyzeOn') : i18next.t('shop.autoCatalyzeOff')
      toggle.textContent = text
    } else if (format === 'Hover-to-Buy [$]') {
      const text = player.toggles[+toggleId]
        ? i18next.t('researches.hoverToBuyOn')
        : i18next.t('researches.hoverToBuyOff')
      toggle.textContent = text
    } else if (format === 'Auto: $') {
      const text = player.toggles[+toggleId] ? i18next.t('general.autoOnColon') : i18next.t('general.autoOffColon')
      toggle.textContent = text
    } else if (format) {
      const finishedString = format.replace('$', player.toggles[+toggleId] ? 'ON' : 'OFF')
      toggle.textContent = finishedString
    } else {
      toggle.textContent = player.toggles[+toggleId]
        ? i18next.t('general.autoOnBracket')
        : i18next.t('general.autoOffBracket')
    }

    toggle.style.border = `2px solid ${player.toggles[+toggleId] ? 'green' : 'red'}`
  }

  const tesseractAutos = Array.from<HTMLElement>(document.querySelectorAll('*[id^="tesseractAutoToggle"]'))

  for (let j = 0; j < tesseractAutos.length; j++) {
    const auto = tesseractAutos[j]

    if (player.autoTesseracts[j + 1]) {
      auto.textContent = i18next.t('general.autoOnBracket')
      auto.style.border = '2px solid green'
    } else {
      auto.textContent = i18next.t('general.autoOffBracket')
      auto.style.border = '2px solid red'
    }
  }
}

export const toggleResearchBuy = () => {
  if (player.researchBuyMaxToggle) {
    player.researchBuyMaxToggle = false
    DOMCacheGetOrSet('toggleresearchbuy').textContent = i18next.t('researches.upgradeOne')
  } else {
    player.researchBuyMaxToggle = true
    DOMCacheGetOrSet('toggleresearchbuy').textContent = i18next.t('researches.upgradeMax')
  }
}

export const toggleAutoResearch = () => {
  const el = DOMCacheGetOrSet('toggleautoresearch')
  if (player.autoResearchToggle || player.shopUpgrades.obtainiumAuto < 1) {
    player.autoResearchToggle = false
    el.textContent = i18next.t('researches.automaticOff')
    DOMCacheGetOrSet(`res${player.autoResearch || 1}`).classList.remove('researchRoomba')
    player.autoResearch = 0
  } else {
    player.autoResearchToggle = true
    el.textContent = i18next.t('researches.automaticOn')
  }

  if (player.autoResearchToggle && autoResearchEnabled() && player.autoResearchMode === 'cheapest') {
    player.autoResearch = G.researchOrderByCost[player.roombaResearchIndex]
  }
}

export const toggleAutoResearchMode = () => {
  const el = DOMCacheGetOrSet('toggleautoresearchmode')
  if (player.autoResearchMode === 'cheapest' || !autoResearchEnabled()) {
    player.autoResearchMode = 'manual'
    el.textContent = i18next.t('researches.autoModeManual')
  } else {
    player.autoResearchMode = 'cheapest'
    el.textContent = i18next.t('researches.autoModeCheapest')
  }
  DOMCacheGetOrSet(`res${player.autoResearch || 1}`).classList.remove('researchRoomba')

  if (player.autoResearchToggle && autoResearchEnabled() && player.autoResearchMode === 'cheapest') {
    player.autoResearch = G.researchOrderByCost[player.roombaResearchIndex]
  }
}

export const toggleAutoSacrifice = (index: number) => {
  const el = DOMCacheGetOrSet('toggleautosacrifice')
  if (index === 0) {
    if (player.autoSacrificeToggle) {
      player.autoSacrificeToggle = false
      el.textContent = i18next.t('runes.blessings.autoRuneOff')
      el.style.border = '2px solid red'
      player.autoSacrifice = 0
    } else {
      player.autoSacrificeToggle = true
      player.saveOfferingToggle = false
      el.textContent = i18next.t('runes.blessings.autoRuneOn')
      el.style.border = '2px solid green'
      DOMCacheGetOrSet('saveOffToggle').textContent = i18next.t('toggles.saveOfferingsOff')
      DOMCacheGetOrSet('saveOffToggle').style.color = 'white'
    }
  } else if (player.autoSacrificeToggle && player.shopUpgrades.offeringAuto > 0.5) {
    if (player.autoSacrifice === index) {
      player.autoSacrifice = 0
    } else {
      player.autoSacrifice = index
    }
  }
  for (let i = 1; i <= 5; i++) {
    DOMCacheGetOrSet(`rune${i}`).style.backgroundColor = player.autoSacrifice === i ? 'orange' : ''
  }
  calculateRuneLevels()
}

export const toggleAutoBuyFragment = () => {
  const el = DOMCacheGetOrSet('toggleautoBuyFragments')
  if (player.autoBuyFragment) {
    el.textContent = i18next.t('runes.talismans.autoBuyOff')
    el.style.border = '2px solid orange'
    el.style.color = 'white'
  } else {
    el.textContent = i18next.t('runes.talismans.autoBuyOn')
    el.style.border = '2px solid white'
    el.style.color = 'orange'
  }

  player.autoBuyFragment = !player.autoBuyFragment
}

export const toggleBuildingScreen = (input: string) => {
  G.buildingSubTab = input as BuildingSubtab
  const screen: Record<string, { screen: string; button: string; subtabNumber: number }> = {
    coin: {
      screen: 'coinBuildings',
      button: 'switchToCoinBuilding',
      subtabNumber: 0
    },
    diamond: {
      screen: 'prestige',
      button: 'switchToDiamondBuilding',
      subtabNumber: 1
    },
    mythos: {
      screen: 'transcension',
      button: 'switchToMythosBuilding',
      subtabNumber: 2
    },
    particle: {
      screen: 'reincarnation',
      button: 'switchToParticleBuilding',
      subtabNumber: 3
    },
    tesseract: {
      screen: 'ascension',
      button: 'switchToTesseractBuilding',
      subtabNumber: 4
    }
  }

  for (const key in screen) {
    DOMCacheGetOrSet(screen[key].screen).style.display = 'none'
    DOMCacheGetOrSet(screen[key].button).style.backgroundColor = ''
  }
  DOMCacheGetOrSet(screen[G.buildingSubTab].screen).style.display = 'flex'
  DOMCacheGetOrSet(screen[G.buildingSubTab].button).style.backgroundColor = 'crimson'
  player.subtabNumber = screen[G.buildingSubTab].subtabNumber
}

export const toggleRuneScreen = (indexStr: string) => {
  const index = Number(indexStr)
  const screens = ['runes', 'talismans', 'blessings', 'spirits']
  G.runescreen = screens[index - 1]

  for (let i = 1; i <= 4; i++) {
    const a = DOMCacheGetOrSet(`toggleRuneSubTab${i}`)
    const b = DOMCacheGetOrSet(`runeContainer${i}`)
    if (i === index) {
      a.style.border = '2px solid gold'
      a.style.backgroundColor = 'crimson'
      b.style.display = 'flex'
    } else {
      a.style.border = '2px solid silver'
      a.style.backgroundColor = ''
      b.style.display = 'none'
    }
  }
  player.subtabNumber = index - 1
}

export const toggleautofortify = () => {
  const el = DOMCacheGetOrSet('toggleautofortify')
  if (player.autoFortifyToggle) {
    el.textContent = i18next.t('runes.autoFortifyOff')
    el.style.border = '2px solid red'
  } else {
    el.textContent = i18next.t('runes.autoFortifyOn')
    el.style.border = '2px solid green'
  }

  player.autoFortifyToggle = !player.autoFortifyToggle
}

export const toggleautoenhance = () => {
  const el = DOMCacheGetOrSet('toggleautoenhance')
  if (player.autoEnhanceToggle) {
    el.textContent = i18next.t('runes.autoEnhanceOff')
    el.style.border = '2px solid red'
  } else {
    el.textContent = i18next.t('runes.autoEnhanceOn')
    el.style.border = '2px solid green'
  }

  player.autoEnhanceToggle = !player.autoEnhanceToggle
}

export const toggleSaveOff = () => {
  const el = DOMCacheGetOrSet('saveOffToggle')
  const et = DOMCacheGetOrSet('toggleautosacrifice')
  if (player.saveOfferingToggle) {
    player.autoSacrificeToggle = true
    el.textContent = i18next.t('toggles.saveOfferingsOff')
    el.style.color = 'white'
    et.textContent = 'Auto Runes: ON'
    et.style.border = '2px solid green'
  } else {
    player.autoSacrificeToggle = false
    el.textContent = i18next.t('toggles.saveOfferingsOn')
    el.style.color = 'yellow'
    et.textContent = 'Auto Runes: OFF'
    et.style.border = '2px solid red'
  }

  player.saveOfferingToggle = !player.saveOfferingToggle
}

export const toggleSingularityScreen = (indexStr: string) => {
  const index = Number(indexStr)

  for (let i = 1; i <= 5; i++) {
    const a = DOMCacheGetOrSet(`toggleSingularitySubTab${i}`)
    const b = DOMCacheGetOrSet(`singularityContainer${i}`)
    if (i === index) {
      a.style.backgroundColor = 'crimson'
      b.style.display = 'block'
    } else {
      a.style.backgroundColor = ''
      b.style.display = 'none'
    }
  }

  player.subtabNumber = index - 1

  if (player.subtabNumber === 2) {
    visualUpdateOcteracts()
  }

  if (player.subtabNumber === 4) {
    visualUpdateAmbrosia()
  }
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

export const setActiveSettingScreen = async (subtab: string) => {
  const clickedButton =
    DOMCacheGetOrSet('settings').getElementsByClassName('subtabSwitcher')[0].children[player.subtabNumber]
  const subtabEl = DOMCacheGetOrSet(subtab)
  if (subtabEl.classList.contains('subtabActive')) {
    return
  }

  const switcherEl = clickedButton.parentNode!
  switcherEl.querySelectorAll('.buttonActive').forEach((b) => b.classList.remove('buttonActive'))
  clickedButton.classList.add('buttonActive')

  subtabEl.parentNode!.querySelectorAll('.subtabActive').forEach((subtab) => subtab.classList.remove('subtabActive'))
  subtabEl.classList.add('subtabActive')

  if (subtab === 'creditssubtab') {
    const credits = DOMCacheGetOrSet('creditList')
    const artists = DOMCacheGetOrSet('artistList')

    if (credits.childElementCount > 0 || artists.childElementCount > 0) {
      return
    } else if (!navigator.onLine || document.hidden) {
      return
    }

    try {
      const r = await fetch('https://api.github.com/repos/pseudo-corp/SynergismOfficial/contributors', {
        headers: {
          Accept: 'application/vnd.github.v3+json'
        }
      })
      const j = await r.json() as ChadContributor[]

      for (const contributor of j) {
        const div = document.createElement('div')
        div.classList.add('credit')

        const img = new Image(32, 32)
        img.src = contributor.avatar_url
        img.alt = contributor.login

        const a = document.createElement('a')
        a.href = `https://github.com/Pseudo-Corp/SynergismOfficial/commits?author=${contributor.login}`
        a.textContent = contributor.login
        a.target = '_blank'
        a.rel = 'noopener noreferrer nofollow'

        div.appendChild(img)
        div.appendChild(a)

        credits.appendChild(div)
      }
    } catch (e) {
      const err = e as Error
      credits.appendChild(document.createTextNode(err.toString()))
    }

    try {
      const r = await fetch('https://api.github.com/gists/01917ff476d25a141c5bad38340cd756', {
        headers: {
          Accept: 'application/vnd.github.v3+json'
        }
      })

      const j = await r.json() as { files: Record<string, { content: string }> }
      const f = JSON.parse(j.files['synergism_artists.json'].content) as string[]

      for (const user of f) {
        const p = document.createElement('p')
        p.textContent = user

        artists.appendChild(p)
      }
    } catch (e) {
      const err = e as Error
      credits.appendChild(document.createTextNode(err.toString()))
    }
  }
}

export const toggleShopConfirmation = () => {
  const el = DOMCacheGetOrSet('toggleConfirmShop')
  el.textContent = player.shopConfirmationToggle
    ? i18next.t('shop.shopConfirmationOff')
    : i18next.t('shop.shopConfirmationOn')

  player.shopConfirmationToggle = !player.shopConfirmationToggle
}

export const toggleBuyMaxShop = (event: MouseEvent) => {
  const el = DOMCacheGetOrSet('toggleBuyMaxShopText')
  if (event.shiftKey) {
    el.textContent = i18next.t('shop.buyAny')
    player.shopBuyMaxToggle = 'ANY'
    return
  }

  switch (player.shopBuyMaxToggle) {
    case false:
      el.innerHTML = i18next.t('shop.buy10')
      player.shopBuyMaxToggle = 'TEN'
      break
    case 'TEN':
      el.innerHTML = i18next.t('shop.buyMax')
      player.shopBuyMaxToggle = true
      break
    default:
      el.innerHTML = i18next.t('shop.buy1')
      player.shopBuyMaxToggle = false
  }
}

export const toggleHideShop = () => {
  const el = DOMCacheGetOrSet('toggleHideShop')
  el.textContent = player.shopHideToggle
    ? i18next.t('shop.hideMaxedOff')
    : i18next.t('shop.hideMaxedOn')

  player.shopHideToggle = !player.shopHideToggle
}

export const toggleAntMaxBuy = () => {
  const el = DOMCacheGetOrSet('toggleAntMax')
  el.textContent = player.antMax
    ? i18next.t('general.buyMaxOff')
    : i18next.t('general.buyMaxOn')

  player.antMax = !player.antMax
}

export const toggleAntAutoSacrifice = (mode = 0) => {
  if (mode === 0) {
    const el = DOMCacheGetOrSet('toggleAutoSacrificeAnt')
    if (player.autoAntSacrifice) {
      player.autoAntSacrifice = false
      el.textContent = i18next.t('ants.autoSacrificeOff')
    } else {
      player.autoAntSacrifice = true
      el.textContent = i18next.t('ants.autoSacrificeOn')
    }
  } else if (mode === 1) {
    const el = DOMCacheGetOrSet('autoSacrificeAntMode')
    if (player.autoAntSacrificeMode === 1 || player.autoAntSacrificeMode === 0) {
      player.autoAntSacrificeMode = 2
      el.textContent = i18next.t('ants.modeRealTime')
    } else {
      player.autoAntSacrificeMode = 1
      el.textContent = i18next.t('ants.modeInGameTime')
    }
  }
}

export const toggleMaxBuyCube = () => {
  const el = DOMCacheGetOrSet('toggleCubeBuy')
  if (player.cubeUpgradesBuyMaxToggle) {
    player.cubeUpgradesBuyMaxToggle = false
    el.textContent = i18next.t('toggles.upgradeOneLevelWow')
  } else {
    player.cubeUpgradesBuyMaxToggle = true
    el.textContent = i18next.t('toggles.upgradeMaxIfPossible')
  }
}

export const autoCubeUpgradesToggle = (toggle = true) => {
  if (toggle) {
    player.autoCubeUpgradesToggle = !player.autoCubeUpgradesToggle
  }
  const el = DOMCacheGetOrSet('toggleAutoCubeUpgrades')
  if (player.autoCubeUpgradesToggle) {
    el.textContent = i18next.t('toggles.autoUpgradeOn')
    el.style.border = '2px solid green'
  } else {
    el.textContent = i18next.t('toggles.autoUpgradeOff')
    el.style.border = '2px solid red'
  }
}

export const autoPlatonicUpgradesToggle = (toggle = true) => {
  if (toggle) {
    player.autoPlatonicUpgradesToggle = !player.autoPlatonicUpgradesToggle
  }
  const el = DOMCacheGetOrSet('toggleAutoPlatonicUpgrades')
  if (player.autoPlatonicUpgradesToggle) {
    el.textContent = i18next.t('toggles.autoUpgradeOn')
    el.style.border = '2px solid green'
  } else {
    el.textContent = i18next.t('toggles.autoUpgradeOff')
    el.style.border = '2px solid red'
  }
}

export const toggleCubeSubTab = (indexStr: string) => {
  const i = Number(indexStr)
  const numSubTabs = subTabsInMainTab(Tabs.WowCubes)

  for (let j = 1; j <= numSubTabs; j++) {
    const cubeTab = DOMCacheGetOrSet(`cubeTab${j}`)
    if (cubeTab.style.display === 'flex' && j !== i) {
      cubeTab.style.display = 'none'
    }
    if (cubeTab.style.display === 'none' && j === i) {
      cubeTab.style.display = 'flex'
      player.subtabNumber = j - 1
    }
    DOMCacheGetOrSet(`switchCubeSubTab${j}`).style.backgroundColor = i === j ? 'crimson' : ''
  }

  visualUpdateCubes()
}

export const updateAutoChallenge = (i: number) => {
  switch (i) {
    case 1: {
      const t = Number.parseFloat((DOMCacheGetOrSet('startAutoChallengeTimerInput') as HTMLInputElement).value) || 0
      player.autoChallengeTimer.start = Math.max(t, 0)
      DOMCacheGetOrSet('startTimerValue').innerHTML = i18next.t('challenges.timeStartSweep', {
        time: format(player.autoChallengeTimer.start, 2, true)
      })
      return
    }
    case 2: {
      const u = Number.parseFloat((DOMCacheGetOrSet('exitAutoChallengeTimerInput') as HTMLInputElement).value) || 0
      player.autoChallengeTimer.exit = Math.max(u, 0)

      DOMCacheGetOrSet('exitTimerValue').innerHTML = i18next.t('challenges.timeExitChallenge', {
        time: format(player.autoChallengeTimer.exit, 2, true)
      })

      return
    }
    case 3: {
      const v = Number.parseFloat((DOMCacheGetOrSet('enterAutoChallengeTimerInput') as HTMLInputElement).value) || 0
      player.autoChallengeTimer.enter = Math.max(v, 0)

      DOMCacheGetOrSet('enterTimerValue').innerHTML = i18next.t('challenges.timeEnterChallenge', {
        time: format(player.autoChallengeTimer.enter, 2, true)
      })

      return
    }
  }
}

export const toggleAutoChallengesIgnore = (i: number) => {
  if (i <= 15) {
    player.autoChallengeToggles[i] = !player.autoChallengeToggles[i]

    const el = DOMCacheGetOrSet('toggleAutoChallengeIgnore')
    el.style.border = player.autoChallengeToggles[i] ? '2px solid green' : '2px solid red'

    if (i >= 11 && i <= 15) {
      if (player.autoChallengeToggles[i]) {
        el.textContent = i18next.t('challenges.autoAscRunChalOn', { x: i })
      } else {
        el.textContent = i18next.t('challenges.autoAscRunChalOff', { x: i })
      }
    } else {
      if (player.autoChallengeToggles[i]) {
        el.textContent = i18next.t('challenges.autoRunChalOn', { x: i })
      } else {
        el.textContent = i18next.t('challenges.autoRunChalOff', { x: i })
      }
    }
  }
}

export const toggleAutoChallengeRun = () => {
  const el = DOMCacheGetOrSet('toggleAutoChallengeStart')
  if (player.autoChallengeRunning) {
    el.style.border = '2px solid red'
    el.textContent = i18next.t('challenges.autoChallengeSweepOff')
    G.autoChallengeTimerIncrement = 0
    toggleAutoChallengeModeText('OFF')
  } else {
    el.style.border = '2px solid gold'
    el.textContent = i18next.t('challenges.autoChallengeSweepOn')
    toggleAutoChallengeModeText('START')
    G.autoChallengeTimerIncrement = 0
  }

  player.autoChallengeRunning = !player.autoChallengeRunning
}

export const toggleAutoChallengeModeText = (i: string) => {
  const a = DOMCacheGetOrSet('autoChallengeType')

  a.textContent = i18next.t(`challenges.mode${i[0] + i.slice(1).toLowerCase()}`)
}

export const toggleAutoAscend = (mode = 0) => {
  if (mode === 0) {
    const a = DOMCacheGetOrSet('ascensionAutoEnable')
    if (player.autoAscend) {
      a.style.border = '2px solid red'
      a.textContent = i18next.t('corruptions.autoAscend.off')
    } else {
      a.style.border = '2px solid green'
      a.textContent = i18next.t('corruptions.autoAscend.on')
    }

    player.autoAscend = !player.autoAscend
  } else if (mode === 1 && player.highestSingularityCount >= 25) {
    const a = DOMCacheGetOrSet('ascensionAutoToggle')
    if (player.autoAscendMode === 'c10Completions') {
      player.autoAscendMode = 'realAscensionTime'
      a.textContent = i18next.t('corruptions.autoAscend.modeRealTime')
    } else {
      player.autoAscendMode = 'c10Completions'
      a.textContent = i18next.t('corruptions.autoAscend.modeCompletions')
    }
  }
}

export const toggleautoopensCubes = (i: number) => {
  if (player.highestSingularityCount >= 35) {
    if (i === 1) {
      const oc = DOMCacheGetOrSet('openCubes')
      const oci = DOMCacheGetOrSet('cubeOpensInput')
      if (player.autoOpenCubes) {
        oc.textContent = i18next.t('wowCubes.autoOff')
        oc.style.border = '1px solid red'
        oci.style.border = '1px solid red'
      } else {
        oc.textContent = i18next.t('wowCubes.autoOn', { percent: format(player.openCubes, 0) })
        oc.style.border = '1px solid green'
        oci.style.border = '1px solid green'
      }

      player.autoOpenCubes = !player.autoOpenCubes
    } else if (i === 2) {
      const oc = DOMCacheGetOrSet('openTesseracts')
      const oci = DOMCacheGetOrSet('tesseractsOpensInput')
      if (player.autoOpenTesseracts) {
        oc.textContent = i18next.t('wowCubes.autoOff')
        oc.style.border = '1px solid red'
        oci.style.border = '1px solid red'
      } else {
        oc.textContent = i18next.t('wowCubes.autoOn', { percent: format(player.openTesseracts, 0) })
        oc.style.border = '1px solid green'
        oci.style.border = '1px solid green'
      }

      player.autoOpenTesseracts = !player.autoOpenTesseracts
    } else if (i === 3) {
      const oc = DOMCacheGetOrSet('openHypercubes')
      const oci = DOMCacheGetOrSet('hypercubesOpensInput')
      if (player.autoOpenHypercubes) {
        oc.textContent = i18next.t('wowCubes.autoOff')
        oc.style.border = '1px solid red'
        oci.style.border = '1px solid red'
      } else {
        oc.textContent = i18next.t('wowCubes.autoOn', { percent: format(player.openHypercubes, 0) })
        oc.style.border = '1px solid green'
        oci.style.border = '1px solid green'
      }

      player.autoOpenHypercubes = !player.autoOpenHypercubes
    } else if (i === 4) {
      const oc = DOMCacheGetOrSet('openPlatonicCube')
      const oci = DOMCacheGetOrSet('platonicCubeOpensInput')
      if (player.autoOpenPlatonicsCubes) {
        oc.textContent = i18next.t('wowCubes.autoOff')
        oc.style.border = '1px solid red'
        oci.style.border = '1px solid red'
      } else {
        oc.textContent = i18next.t('wowCubes.autoOn', { percent: format(player.openPlatonicsCubes, 0) })
        oc.style.border = '1px solid green'
        oci.style.border = '1px solid green'
      }

      player.autoOpenPlatonicsCubes = !player.autoOpenPlatonicsCubes
    }
  }
}

export const updateRuneBlessingBuyAmount = (i: number) => {
  switch (i) {
    case 1: {
      const t = Math.floor(Number.parseFloat((DOMCacheGetOrSet('buyRuneBlessingInput') as HTMLInputElement).value)) || 1
      player.runeBlessingBuyAmount = Math.max(t, 1)
      DOMCacheGetOrSet('buyRuneBlessingToggle').innerHTML = i18next.t('runes.blessings.buyUpTo', {
        amount: format(player.runeBlessingBuyAmount)
      })
      return
    }
    case 2: {
      const u = Math.floor(Number.parseFloat((DOMCacheGetOrSet('buyRuneSpiritInput') as HTMLInputElement).value)) || 1
      player.runeSpiritBuyAmount = Math.max(u, 1)
      DOMCacheGetOrSet('buyRuneSpiritToggleValue').innerHTML = i18next.t('runes.spirits.buyUpTo', {
        amount: format(player.runeSpiritBuyAmount)
      })
      return
    }
  }
}

export const toggleAutoTesseracts = (i: number) => {
  const el = DOMCacheGetOrSet(`tesseractAutoToggle${i}`)
  if (player.autoTesseracts[i]) {
    el.textContent = i18next.t('general.autoOffBracket')
    el.style.border = '2px solid red'
  } else {
    el.textContent = i18next.t('general.autoOnBracket')
    el.style.border = '2px solid green'
  }

  player.autoTesseracts[i] = !player.autoTesseracts[i]
}

export const toggleCorruptionLevel = (index: number, value: number) => {
  const current = player.prototypeCorruptions[index]
  const maxCorruption = maxCorruptionLevel()
  if (value > 0 && current < maxCorruption && 0 < index && index <= 9) {
    player.prototypeCorruptions[index] += Math.min(maxCorruption - current, value)
  }
  if (value < 0 && current > 0 && 0 < index && index <= 9) {
    player.prototypeCorruptions[index] -= Math.min(current, -value)
  }
  player.prototypeCorruptions[index] = Math.min(maxCorruption, Math.max(0, player.prototypeCorruptions[index]))
  if (value === 999 && player.currentChallenge.ascension !== 15) {
    for (let i = 0; i <= 9; i++) {
      player.usedCorruptions[i] = 0
      player.prototypeCorruptions[i] = 0
      if (i > 1) {
        corruptionDisplay(i)
      }
    }

    corruptionDisplay(G.corruptionTrigger)
    DOMCacheGetOrSet('corruptionCleanseConfirm').style.visibility = 'hidden'

    if (player.currentChallenge.ascension === 15) {
      void resetCheck('ascensionChallenge', false, true)
    }
  }
  corruptionDisplay(index)
  corruptionLoadoutTableUpdate()
}

export const toggleCorruptionLoadoutsStats = (statsStr: string) => {
  const stats = statsStr === 'true'
  player.corruptionShowStats = stats
  showCorruptionStatsLoadouts()
}

export const toggleAscStatPerSecond = (id: number) => {
  const el = DOMCacheGetOrSet(`unit${id}`) as HTMLElement | null
  if (el === null) {
    console.log(id, 'platonic needs to fix')
    return
  }

  el.textContent = player.ascStatToggles[id] ? '/s' : ''
  if (id === 6) {
    el.textContent = ''
  }
  player.ascStatToggles[id] = !player.ascStatToggles[id]
}

export const toggleHepteractAutoPercentage = async (): Promise<void> => {
  const amount = await Prompt(i18next.t('wowCubes.hepteractForge.autoCraftPercentagePrompt'))

  if (amount === null) {
    if (player.toggles[35]) {
      return Alert(i18next.t('toggles.percentKeptAt', { x: player.hepteractAutoCraftPercentage }))
    } else {
      return
    }
  }

  const isPercentage = amount.endsWith('%')
  const rawPercentage = isPercentage ? Number(amount.slice(0, -1)) : Number(amount)

  if (Number.isNaN(rawPercentage) || !Number.isFinite(rawPercentage) || !Number.isInteger(rawPercentage)) {
    return Alert(i18next.t('general.validation.finiteInt'))
  } else if (rawPercentage < 0 || rawPercentage > 100) {
    return Alert(i18next.t('toggles.percentBetweenInclusive', { x: 0, y: 100 }))
  } else if (rawPercentage === player.hepteractAutoCraftPercentage && player.toggles[35]) {
    return Alert(i18next.t('toggles.percentKeptAt', { x: player.hepteractAutoCraftPercentage }))
  }

  player.hepteractAutoCraftPercentage = rawPercentage
  DOMCacheGetOrSet('autoHepteractPercentage').textContent = i18next.t('wowCubes.hepteractForge.autoSetting', {
    x: `${player.hepteractAutoCraftPercentage}`
  })
  if (player.toggles[35]) {
    return Alert(i18next.t('toggles.onAscensionHepteractsCraft', {
      x: player.hepteractAutoCraftPercentage
    }))
  }
}

export const toggleBlueberryLoadoutmode = () => {
  if (player.blueberryLoadoutMode === 'saveTree') {
    player.blueberryLoadoutMode = 'loadTree'
    DOMCacheGetOrSet('blueberryToggleMode').innerHTML = i18next.t('ambrosia.loadouts.load')
  } else {
    player.blueberryLoadoutMode = 'saveTree'
    DOMCacheGetOrSet('blueberryToggleMode').innerHTML = i18next.t('ambrosia.loadouts.save')
  }
}

export const confirmReply = (confirm = true) => {
  if (DOMCacheGetOrSet('alertWrapper').style.display === 'block') {
    ;(DOMCacheGetOrSet('ok_alert') as HTMLButtonElement).click()
  }
  if (
    DOMCacheGetOrSet('confirmWrapper').style.display === 'block'
    || DOMCacheGetOrSet('promptWrapper').style.display === 'block'
  ) {
    if (confirm) {
      ;(DOMCacheGetOrSet('ok_confirm') as HTMLButtonElement).click()
    } else {
      ;(DOMCacheGetOrSet('cancel_confirm') as HTMLButtonElement).click()
    }
  }
}
