import DoublyLinked from 'doublylinked'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { player } from './Synergism'
import {
  setActiveSettingScreen,
  toggleBuildingScreen,
  toggleCorruptionLoadoutsStats,
  toggleCubeSubTab,
  toggleRuneScreen,
  toggleSingularityScreen
} from './Toggles'
import { hideStuff, revealStuff } from './UpdateHTML'
import { assert, limitRange } from './Utility'
import { Globals as G } from './Variables'

export type TabNames =
  | 'settings'
  | 'shop'
  | 'buildings'
  | 'upgrades'
  | 'achievements'
  | 'runes'
  | 'challenge'
  | 'research'
  | 'ant'
  | 'cube'
  | 'traits'
  | 'singularity'
  | 'event'

/**
 * If step is provided, move the page back/forward {step} pages.
 * If page is provided, change the subtab to {page}
 */
type SubTabSwitchOptions = { step: number; page?: undefined } | { page: number; step?: undefined }

interface SubTab {
  tabSwitcher?: () => (id: string) => unknown
  subTabList: {
    subTabID: string
    unlocked: boolean
    buttonID?: string
  }[]
}

const subtabInfo: Record<TabNames, SubTab> = {
  settings: {
    tabSwitcher: () => setActiveSettingScreen,
    subTabList: [
      { subTabID: 'settingsubtab', unlocked: true },
      { subTabID: 'languagesubtab', unlocked: true },
      { subTabID: 'creditssubtab', unlocked: true },
      { subTabID: 'statisticsSubTab', unlocked: true },
      {
        subTabID: 'resetHistorySubTab',
        get unlocked () {
          return player.unlocks.prestige
        }
      },
      {
        subTabID: 'ascendHistorySubTab',
        get unlocked () {
          return player.ascensionCount > 0
        }
      },
      {
        subTabID: 'singularityHistorySubTab',
        get unlocked () {
          return player.highestSingularityCount > 0
        }
      },
      { subTabID: 'hotkeys', unlocked: true },
      { subTabID: 'accountSubTab', unlocked: true }
    ]
  },
  shop: { subTabList: [] },
  buildings: {
    tabSwitcher: () => toggleBuildingScreen,
    subTabList: [
      { subTabID: 'coin', unlocked: true, buttonID: 'switchToCoinBuilding' },
      {
        subTabID: 'diamond',
        get unlocked () {
          return player.unlocks.prestige
        },
        buttonID: 'switchToDiamondBuilding'
      },
      {
        subTabID: 'mythos',
        get unlocked () {
          return player.unlocks.transcend
        },
        buttonID: 'switchToMythosBuilding'
      },
      {
        subTabID: 'particle',
        get unlocked () {
          return player.unlocks.reincarnate
        },
        buttonID: 'switchToParticleBuilding'
      },
      {
        subTabID: 'tesseract',
        get unlocked () {
          return player.achievements[183] > 0
        },
        buttonID: 'switchToTesseractBuilding'
      }
    ]
  },
  upgrades: { subTabList: [] },
  achievements: { subTabList: [] },
  runes: {
    tabSwitcher: () => toggleRuneScreen,
    subTabList: [
      {
        subTabID: '1',
        get unlocked () {
          return player.unlocks.prestige
        },
        buttonID: 'toggleRuneSubTab1'
      },
      {
        subTabID: '2',
        get unlocked () {
          return player.achievements[134] > 0
        },
        buttonID: 'toggleRuneSubTab2'
      },
      {
        subTabID: '3',
        get unlocked () {
          return player.achievements[134] > 0
        },
        buttonID: 'toggleRuneSubTab3'
      },
      {
        subTabID: '4',
        get unlocked () {
          return player.achievements[204] > 0
        },
        buttonID: 'toggleRuneSubTab4'
      }
    ]
  },
  challenge: { subTabList: [] },
  research: { subTabList: [] },
  ant: { subTabList: [] },
  cube: {
    tabSwitcher: () => toggleCubeSubTab,
    subTabList: [
      {
        subTabID: '1',
        get unlocked () {
          return player.achievements[141] > 0
        },
        buttonID: 'switchCubeSubTab1'
      },
      {
        subTabID: '2',
        get unlocked () {
          return player.achievements[197] > 0
        },
        buttonID: 'switchCubeSubTab2'
      },
      {
        subTabID: '3',
        get unlocked () {
          return player.achievements[211] > 0
        },
        buttonID: 'switchCubeSubTab3'
      },
      {
        subTabID: '4',
        get unlocked () {
          return player.achievements[218] > 0
        },
        buttonID: 'switchCubeSubTab4'
      },
      {
        subTabID: '5',
        get unlocked () {
          return player.achievements[141] > 0
        },
        buttonID: 'switchCubeSubTab5'
      },
      {
        subTabID: '6',
        get unlocked () {
          return player.achievements[218] > 0
        },
        buttonID: 'switchCubeSubTab6'
      },
      {
        subTabID: '7',
        get unlocked () {
          return player.challenge15Exponent >= 1e15
        },
        buttonID: 'switchCubeSubTab7'
      }
    ]
  },
  traits: {
    tabSwitcher: () => toggleCorruptionLoadoutsStats,
    subTabList: [
      {
        subTabID: 'true',
        get unlocked () {
          return player.achievements[141] > 0
        },
        buttonID: 'corrStatsBtn'
      },
      {
        subTabID: 'false',
        get unlocked () {
          return player.achievements[141] > 0
        },
        buttonID: 'corrLoadoutsBtn'
      }
    ]
  },
  singularity: {
    tabSwitcher: () => toggleSingularityScreen,
    subTabList: [
      {
        subTabID: '1',
        get unlocked () {
          return player.highestSingularityCount > 0
        },
        buttonID: 'toggleSingularitySubTab1'
      },
      {
        subTabID: '2',
        get unlocked () {
          return player.highestSingularityCount > 0
        },
        buttonID: 'toggleSingularitySubTab2'
      },
      {
        subTabID: '3',
        get unlocked () {
          return Boolean(player.singularityUpgrades.octeractUnlock.getEffect().bonus)
        },
        buttonID: 'toggleSingularitySubTab3'
      },
      {
        subTabID: '4',
        get unlocked () {
          return player.highestSingularityCount >= 25
        },
        buttonID: 'toggleSingularitySubTab4'
      },
      {
        subTabID: '5',
        get unlocked () {
          return player.singularityChallenges.noSingularityUpgrades.completions >= 1
        },
        buttonID: 'toggleSingularitySubTab5'
      }
    ]
  },
  event: { subTabList: [] }
}

const tabsUnlockInfo: Record<TabNames, () => boolean> = {
  settings: () => true,
  shop: () => player.unlocks.reincarnate || player.highestSingularityCount > 0,
  buildings: () => true,
  upgrades: () => true,
  achievements: () => player.unlocks.coinfour,
  runes: () => player.unlocks.prestige,
  challenge: () => player.unlocks.transcend,
  research: () => player.unlocks.reincarnate,
  ant: () => player.achievements[127] > 0,
  cube: () => player.achievements[141] > 0,
  traits: () => player.challengecompletions[11] > 0,
  singularity: () => player.highestSingularityCount > 0,
  event: () => G.isEvent
} as const

class TabRow extends HTMLDivElement {
  #list = new DoublyLinked<$SubTab>()

  constructor () {
    super()

    this.id = 'tabrow'
    this.style.cssText = `
      text-align: center;
      width: 100%;
      list-style: none;
      margin: 0;
      margin-inline: unset;
      margin-block: unset;
      padding-inline: unset;
      display: flex;
      justify-content: center;
      gap: 0 5px;
    `

    document.getElementsByClassName('navbar').item(0)?.appendChild(this)
  }

  getSubs () {
    return this.#list.toArray()
  }

  appendButton (...elements: $SubTab[]) {
    for (const element of elements) {
      this.#list.insert(element)
      this.appendChild(element)
    }
  }
}

interface kSubTabOptionsBag {
  id: string
  class?: string
  i18n?: string
  borderColor?: string
}

class $SubTab extends HTMLButtonElement {
  #unlocked = () => true

  constructor (options: kSubTabOptionsBag) {
    super()

    this.id = options.id
    if (options.class) {
      this.classList.add(options.class)
    }
    if (options.i18n) {
      this.setAttribute('i18n', options.i18n)
    }
    if (options.borderColor) {
      this.style.borderColor = options.borderColor
    }
  }

  setUnlockedState (fn: () => boolean) {
    this.#unlocked = fn
    return this
  }

  isUnlocked () {
    return this.#unlocked()
  }
}

customElements.define('tab-row', TabRow, { extends: 'div' })
customElements.define('sub-tab', $SubTab, { extends: 'button' })

const tabRow = new TabRow()

tabRow.appendButton(
  new $SubTab({ id: 'buildingstab', i18n: 'tabs.main.buildings' }),
  new $SubTab({ id: 'upgradestab', i18n: 'tabs.main.upgrades' }),
  new $SubTab({ id: 'achievementstab', i18n: 'tabs.main.achievements', class: 'coinunlock4' })
    .setUnlockedState(() => player.unlocks.coinfour),
  new $SubTab({ class: 'prestigeunlock', id: 'runestab', i18n: 'tabs.main.runes' })
    .setUnlockedState(() => player.unlocks.prestige),
  new $SubTab({ class: 'transcendunlock', id: 'challengetab', i18n: 'tabs.main.challenges' })
    .setUnlockedState(() => player.unlocks.transcend),
  new $SubTab({ class: 'reincarnationunlock', id: 'researchtab', i18n: 'tabs.main.research' })
    .setUnlockedState(() => player.unlocks.reincarnate),
  new $SubTab({ class: 'chal8', id: 'anttab', i18n: 'tabs.main.antHill' })
    .setUnlockedState(() => player.achievements[127] > 0),
  new $SubTab({ class: 'chal10', id: 'cubetab', i18n: 'tabs.main.wowCubes' })
    .setUnlockedState(() => player.achievements[141] > 0),
  new $SubTab({ class: 'chal11', id: 'traitstab', i18n: 'tabs.main.corruption' })
    .setUnlockedState(() => player.challengecompletions[11] > 0),
  new $SubTab({ class: 'singularity', id: 'singularitytab', i18n: 'tabs.main.singularity' })
    .setUnlockedState(() => player.highestSingularityCount > 0),
  new $SubTab({ id: 'settingstab', i18n: 'tabs.main.settings' }),
  new $SubTab({ class: 'reincarnationunlock', id: 'shoptab', i18n: 'tabs.main.shop' })
    .setUnlockedState(() => player.unlocks.reincarnate || player.highestSingularityCount > 0),
  new $SubTab({ class: 'isEvent', id: 'eventtab', i18n: 'tabs.main.unsmith' }).setUnlockedState(() => G.isEvent)
)

export class Tab {
  name: TabNames

  constructor (element: HTMLElement) {
    this.name = element.id.split('tab')[0] as TabNames

    assert(element.id.endsWith('tab'))
    assert(this.name in tabsUnlockInfo && this.name in subtabInfo)
  }

  get subtabs () {
    return subtabInfo[this.name]
  }

  get unlocked () {
    return tabsUnlockInfo[this.name]()
  }
}

/**
 * Map each tab by its "index" (place in the nav row)
 */
export const tabs = new Map(
  Array.from(document.querySelectorAll<HTMLElement>('#tabrow > button')).map((tab, index) => {
    return [index + 1, new Tab(tab)]
  })
)

/**
 * @param step 1 to go forward; -1 to go back
 * @param changeSubtab true to change the subtab, false to change the main tabs
 */
export const keyboardTabChange = (step: 1 | -1 = 1, changeSubtab = false) => {
  if (!changeSubtab) {
    player.tabnumber = limitRange(player.tabnumber + step, 1, tabs.size)
  }

  let tab = tabs.get(player.tabnumber)

  while (!tab?.unlocked) {
    player.tabnumber = limitRange(player.tabnumber + step, 1, tabs.size)
    tab = tabs.get(player.tabnumber)!
  }

  if (changeSubtab) {
    changeSubTab(tab, { step })
  }

  changeTab(tab)
}

export const changeTab = (tabOrName: Tab | TabNames) => {
  const [index, tab] = [...tabs.entries()]
    .find(([, tab]) => tab.name === tabOrName || tab === tabOrName)!

  G.currentTab = tab.name
  player.tabnumber = index

  revealStuff()
  hideStuff()
  ;(document.activeElement as HTMLElement | null)?.blur()

  const subTabList = subtabInfo[G.currentTab].subTabList
  if (tab.name !== 'settings') {
    for (let i = 0; i < subTabList.length; i++) {
      const id = subTabList[i].buttonID
      if (id) {
        const button = DOMCacheGetOrSet(id)

        if (button.style.backgroundColor === 'crimson') { // handles every tab except settings and corruptions
          player.subtabNumber = i
          break
        }
        // what in the shit is this?!
        if (player.tabnumber === 9 && button.style.borderColor === 'dodgerblue') { // handle corruption tab
          player.subtabNumber = i
          break
        }
      }
    }
  } else { // handle settings tab
    // The first getElementById makes sure that it still works if other tabs start using the subtabSwitcher class
    const btns = document.querySelectorAll('[id^="switchSettingSubTab"]')
    for (let i = 0; i < btns.length; i++) {
      if (btns[i].classList.contains('buttonActive')) {
        player.subtabNumber = i
        break
      }
    }
  }
}

export const changeSubTab = (tabOrName: Tab | TabNames, { page, step }: SubTabSwitchOptions) => {
  const tab = typeof tabOrName === 'string'
    ? [...tabs.values()].find((tab) => tab.name === tabOrName)
    : tabOrName

  assert(tab)
  const subTabs = tab.subtabs

  if (!tab.unlocked || subTabs.subTabList.length === 0) {
    return
  }

  if (page !== undefined) {
    player.subtabNumber = limitRange(page, 0, subTabs.subTabList.length - 1)
  } else {
    player.subtabNumber = limitRange(player.subtabNumber + step, 0, subTabs.subTabList.length - 1)
  }
  const subTabList = subTabs.subTabList[player.subtabNumber]

  if (subTabList.unlocked) {
    subTabs.tabSwitcher?.()(subTabList.subTabID)
    if (tabOrName === 'singularity' && page === 4) {
      player.visitedAmbrosiaSubtab = true
      player.caches.ambrosiaGeneration.updateVal('DefaultVal')
    }
  }
}

export function subTabsInMainTab (name: TabNames) {
  const tab = [...tabs.values()].find((tab) => tab.name === name)
  assert(tab)

  return tab.subtabs.subTabList.length
}
