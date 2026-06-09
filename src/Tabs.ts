import i18next from 'i18next'
import { awardUngroupedAchievement } from './Achievements'
import { DOMCacheGetOrSet, DOMCacheHas } from './Cache/DOM'
import { storageGetItem, storageSetItem } from './events/storage-events'
import { hasUnreadMessages } from './Messages'
import { initializeCart } from './purchases/CartTab'
import { getGQUpgradeEffect } from './singularity'
import { player } from './Synergism'
import {
  setActiveSettingScreen,
  toggleAchievementScreen,
  toggleAntsSubtab,
  toggleBuildingScreen,
  toggleChallengesScreen,
  toggleCorruptionLoadoutsStats,
  toggleCubeSubTab,
  toggleRuneScreen,
  toggleSingularityScreen
} from './Toggles'
import { changeTabColor, CloseModal, hideStuff, revealStuff } from './UpdateHTML'
import { assert, isMobile, limitRange, memoize } from './Utility'
import { Globals as G } from './Variables'

export enum Tabs {
  Buildings = 0,
  Upgrades = 1,
  Achievements = 2,
  Runes = 3,
  Challenges = 4,
  Research = 5,
  AntHill = 6,
  WowCubes = 7,
  Campaign = 8,
  Corruption = 9,
  Singularity = 10,
  Settings = 11,
  Shop = 12,
  Event = 13,
  Purchase = 14
}

/**
 * If step is provided, move the page back/forward {step} pages.
 * If page is provided, change the subtab to {page}
 */
type SubTabSwitchOptions = { step: number; page?: undefined } | { page: number; step?: undefined }

interface SubTab {
  tabSwitcher?: () => (id: string) => unknown
  subtabIndex: number
  subTabList: {
    subTabID: string
    unlocked: () => boolean
    buttonID: string
  }[]
}

const scrollMainToTop = () => {
  document.querySelector<HTMLElement>('main')?.scrollTo({ top: 0, left: 0 })
}

const subtabInfo: Record<Tabs, SubTab> = {
  [Tabs.Settings]: {
    tabSwitcher: () => setActiveSettingScreen,
    subtabIndex: 0,
    subTabList: [
      { subTabID: 'settingsubtab', unlocked: () => true, buttonID: 'switchSettingSubTab1' },
      { subTabID: 'languagesubtab', unlocked: () => true, buttonID: 'switchSettingSubTab2' },
      { subTabID: 'creditssubtab', unlocked: () => true, buttonID: 'switchSettingSubTab3' },
      { subTabID: 'statisticsSubTab', unlocked: () => true, buttonID: 'switchSettingSubTab4' },
      {
        subTabID: 'resetHistorySubTab',
        unlocked: () => player.unlocks.prestige,
        buttonID: 'switchSettingSubTab5'
      },
      {
        subTabID: 'ascendHistorySubTab',
        unlocked: () => player.ascensionCount > 0,
        buttonID: 'switchSettingSubTab6'
      },
      {
        subTabID: 'singularityHistorySubTab',
        unlocked: () => player.highestSingularityCount > 0,
        buttonID: 'switchSettingSubTab7'
      },
      { subTabID: 'hotkeys', unlocked: () => true, buttonID: 'switchSettingSubTab8' },
      { subTabID: 'accountSubTab', unlocked: () => true, buttonID: 'switchSettingSubTab9' },
      {
        subTabID: 'messagesSubTab',
        unlocked: hasUnreadMessages,
        buttonID: 'switchSettingSubTab10'
      }
    ]
  },
  [Tabs.Shop]: {
    subTabList: [],
    subtabIndex: 0
  },
  [Tabs.Buildings]: {
    tabSwitcher: () => toggleBuildingScreen,
    subtabIndex: 0,
    subTabList: [
      { subTabID: 'coin', unlocked: () => true, buttonID: 'switchToCoinBuilding' },
      {
        subTabID: 'diamond',
        unlocked: () => player.unlocks.prestige,
        buttonID: 'switchToDiamondBuilding'
      },
      {
        subTabID: 'mythos',
        unlocked: () => player.unlocks.transcend,
        buttonID: 'switchToMythosBuilding'
      },
      {
        subTabID: 'particle',
        unlocked: () => player.unlocks.reincarnate,
        buttonID: 'switchToParticleBuilding'
      },
      {
        subTabID: 'tesseract',
        unlocked: () => player.ascensionCount > 0,
        buttonID: 'switchToTesseractBuilding'
      }
    ]
  },
  [Tabs.Upgrades]: {
    subTabList: [],
    subtabIndex: 0
  },
  [Tabs.Achievements]: {
    tabSwitcher: () => toggleAchievementScreen,
    subtabIndex: 0,
    subTabList: [
      {
        subTabID: '1',
        unlocked: () => true,
        buttonID: 'toggleAchievementSubTab1'
      },
      {
        subTabID: '2',
        unlocked: () => true,
        buttonID: 'toggleAchievementSubTab2'
      }
    ]
  },
  [Tabs.Runes]: {
    tabSwitcher: () => toggleRuneScreen,
    subtabIndex: 0,
    subTabList: [
      {
        subTabID: '1',
        unlocked: () => player.unlocks.prestige,
        buttonID: 'toggleRuneSubTab1'
      },
      {
        subTabID: '2',
        unlocked: () => player.unlocks.talismans,
        buttonID: 'toggleRuneSubTab2'
      },
      {
        subTabID: '3',
        unlocked: () => player.unlocks.blessings,
        buttonID: 'toggleRuneSubTab3'
      },
      {
        subTabID: '4',
        unlocked: () => player.unlocks.spirits,
        buttonID: 'toggleRuneSubTab4'
      }
    ]
  },
  [Tabs.Challenges]: {
    tabSwitcher: () => toggleChallengesScreen,
    subtabIndex: 0,
    subTabList: [
      { subTabID: '1', unlocked: () => true, buttonID: 'toggleChallengesSubTab1' },
      {
        subTabID: '2',
        unlocked: () => player.highestSingularityCount >= 25,
        buttonID: 'toggleChallengesSubTab2'
      }
    ]
  },
  [Tabs.Research]: {
    subTabList: [],
    subtabIndex: 0
  },
  [Tabs.AntHill]: {
    tabSwitcher: () => toggleAntsSubtab,
    subtabIndex: 0,
    subTabList: [
      {
        subTabID: '1',
        unlocked: () => true,
        buttonID: 'toggleAntSubtab1'
      },
      {
        subTabID: '2',
        unlocked: () => true,
        buttonID: 'toggleAntSubtab2'
      },
      {
        subTabID: '3',
        unlocked: () => player.ants.antSacrificeCount > 0,
        buttonID: 'toggleAntSubtab3'
      }
    ]
  },
  [Tabs.WowCubes]: {
    tabSwitcher: () => toggleCubeSubTab,
    subtabIndex: 0,
    subTabList: [
      {
        subTabID: '1',
        unlocked: () => player.unlocks.ascensions,
        buttonID: 'switchCubeSubTab1'
      },
      {
        subTabID: '2',
        unlocked: () => player.unlocks.tesseracts,
        buttonID: 'switchCubeSubTab2'
      },
      {
        subTabID: '3',
        unlocked: () => player.unlocks.hypercubes,
        buttonID: 'switchCubeSubTab3'
      },
      {
        subTabID: '4',
        unlocked: () => player.unlocks.platonics,
        buttonID: 'switchCubeSubTab4'
      },
      {
        subTabID: '5',
        unlocked: () => player.unlocks.ascensions,
        buttonID: 'switchCubeSubTab5'
      },
      {
        subTabID: '6',
        unlocked: () => player.unlocks.platonics,
        buttonID: 'switchCubeSubTab6'
      },
      {
        subTabID: '7',
        unlocked: () => player.unlocks.hepteracts,
        buttonID: 'switchCubeSubTab7'
      }
    ]
  },
  [Tabs.Campaign]: {
    subTabList: [],
    subtabIndex: 0
  },
  [Tabs.Corruption]: {
    tabSwitcher: () => toggleCorruptionLoadoutsStats,
    subtabIndex: 0,
    subTabList: [
      {
        subTabID: 'true',
        unlocked: () => true,
        buttonID: 'corrStatsBtn'
      },
      {
        subTabID: 'false',
        unlocked: () => true,
        buttonID: 'corrLoadoutsBtn'
      }
    ]
  },
  [Tabs.Singularity]: {
    tabSwitcher: () => toggleSingularityScreen,
    subtabIndex: 0,
    subTabList: [
      {
        subTabID: '1',
        unlocked: () => player.highestSingularityCount > 0,
        buttonID: 'toggleSingularitySubTab1'
      },
      {
        subTabID: '2',
        unlocked: () => player.highestSingularityCount > 0,
        buttonID: 'toggleSingularitySubTab2'
      },
      {
        subTabID: '3',
        unlocked: () => player.highestSingularityCount > 0,
        buttonID: 'toggleSingularitySubTab3'
      },
      {
        subTabID: '4',
        unlocked: () => getGQUpgradeEffect('octeractUnlock', 'unlocked'),
        buttonID: 'toggleSingularitySubTab4'
      },
      {
        subTabID: '5',
        unlocked: () => player.highestSingularityCount >= 25,
        buttonID: 'toggleSingularitySubTab5'
      }
    ]
  },
  [Tabs.Event]: {
    subTabList: [],
    subtabIndex: 0
  },
  [Tabs.Purchase]: {
    tabSwitcher: () => initializeCart,
    subtabIndex: 0,
    subTabList: [
      {
        subTabID: 'productContainer',
        unlocked: () => true,
        buttonID: 'cartSubTab1'
      },
      {
        subTabID: 'subscriptionContainer',
        unlocked: () => true,
        buttonID: 'cartSubTab2'
      },
      {
        subTabID: 'upgradesContainer',
        unlocked: () => true,
        buttonID: 'cartSubTab3'
      },
      {
        subTabID: 'consumablesSection',
        unlocked: () => PLATFORM !== 'mobile',
        buttonID: 'cartSubTab4'
      },
      {
        subTabID: 'cartContainer',
        unlocked: () => PLATFORM !== 'mobile',
        buttonID: 'cartSubTab5'
      },
      {
        subTabID: 'merchContainer',
        unlocked: () => PLATFORM === 'browser', // Steam disallows purchases outside of the Steam ecosystem
        buttonID: 'cartSubTab6'
      }
    ]
  }
}

const TAB_ORDER_KEY = 'synergism-tab-order'
const TAB_EDIT_HOLD_MS = 650
const TAB_HOLD_CANCEL_DISTANCE_PX = 8

class TabRow extends HTMLDivElement {
  #list: $Tab[] = []
  #currentTab!: $Tab
  #isEditing = false
  #holdTimer: number | undefined
  #activePointerId: number | null = null
  #pointerDownTab: $Tab | null = null
  #draggedTab: $Tab | null = null
  #pointerStartX = 0
  #pointerStartY = 0
  #dragCreated = false

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
      flex-wrap: wrap;
      justify-content: center;
      gap: 0 5px;
    `
  }

  getSubs () {
    return this.#list
  }

  appendButton (...elements: $Tab[]) {
    for (const element of elements) {
      this.#list.push(element)
      this.appendChild(element)
    }

    this.#restoreOrder()
    this.#currentTab = this.#list[0]
    this.#createDrag()
  }

  getCurrentTab (): $Tab {
    return this.#currentTab
  }

  setNextTab () {
    const index = this.#list.indexOf(this.#currentTab)

    this.#currentTab = this.#list[index + 1] ?? this.#list[0]
    changeSubTab(this.#currentTab.getType(), { page: subtabInfo[this.#currentTab.getType()].subtabIndex })
    return this.#currentTab
  }

  setPreviousTab () {
    const index = this.#list.indexOf(this.#currentTab)

    this.#currentTab = this.#list[index - 1] ?? this.#list[this.#list.length - 1]
    changeSubTab(this.#currentTab.getType(), { page: subtabInfo[this.#currentTab.getType()].subtabIndex })
    return this.#currentTab
  }

  getNextTab (tab = this.#currentTab) {
    const index = this.#list.indexOf(tab)

    return this.#list[index + 1] ?? this.#list[0]
  }

  getPreviousTab (tab = this.#currentTab) {
    const index = this.#list.indexOf(tab)

    return this.#list[index - 1] ?? this.#list[this.#list.length - 1]
  }

  reappend () {
    this.replaceChildren()

    for (const item of this.#list) {
      this.appendChild(item)
    }

    this.#list.forEach((el) => el.resetHidden())
  }

  isEditing () {
    return this.#isEditing
  }

  hideTab (tab: $Tab) {
    if (!tab.canBeRemoved()) {
      return
    }

    const wasCurrentTab = tab === this.#currentTab

    tab.hide()
    tab.classList.remove('tab-being-dragged')

    if (tab.parentElement === this) {
      this.removeChild(tab)
    }

    if (wasCurrentTab) {
      const nextTab = this.#getNextUnlockedTab(tab)
      if (nextTab !== null) {
        changeTab(nextTab.getType())
        changeTabColor()
      }
    }
  }

  #saveOrder () {
    storageSetItem(TAB_ORDER_KEY, JSON.stringify(this.#list.map((tab) => tab.id)))
  }

  #restoreOrder () {
    const saved = storageGetItem(TAB_ORDER_KEY)
    if (!saved) return

    try {
      const order: string[] = JSON.parse(saved)
      const tabMap = new Map(this.#list.map((tab) => [tab.id, tab]))

      const sorted: $Tab[] = []
      for (const id of order) {
        const tab = tabMap.get(id)
        if (tab) {
          sorted.push(tab)
          tabMap.delete(id)
        }
      }

      // Append any new tabs not in saved order
      for (const tab of tabMap.values()) {
        sorted.push(tab)
      }

      this.#list = sorted
      this.replaceChildren(...this.#list)
    } catch {
      // Corrupted data — ignore
    }
  }

  #createDrag () {
    if (this.#dragCreated) {
      return
    }

    this.#dragCreated = true
    this.addEventListener('pointerdown', (event) => this.#handlePointerDown(event))
    window.addEventListener('pointermove', (event) => this.#handlePointerMove(event))
    window.addEventListener('pointerup', (event) => this.#handlePointerUp(event))
    window.addEventListener('pointercancel', (event) => this.#handlePointerUp(event))
    document.addEventListener('click', (event) => this.#handleDocumentClick(event), true)
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.#exitEditMode()
      }
    })
  }

  #handlePointerDown (event: PointerEvent) {
    if (event.button !== 0) {
      return
    }

    const tab = this.#getTabFromEventTarget(event.target)
    if (tab === null || !tab.canMove() || !tab.isUnlocked()) {
      return
    }

    if (this.#isEditing) {
      event.preventDefault()

      if (!tab.isCloseButtonHit(event)) {
        this.#beginDrag(tab, event.pointerId)
      }

      return
    }

    this.#clearHoldTimer()
    this.#activePointerId = event.pointerId
    this.#pointerDownTab = tab
    this.#pointerStartX = event.clientX
    this.#pointerStartY = event.clientY
    this.#holdTimer = window.setTimeout(() => {
      this.#holdTimer = undefined
      this.#enterEditMode()

      if (this.#pointerDownTab !== null && this.#activePointerId !== null) {
        this.#beginDrag(this.#pointerDownTab, this.#activePointerId)
      }
    }, TAB_EDIT_HOLD_MS)
  }

  #handlePointerMove (event: PointerEvent) {
    if (this.#activePointerId !== event.pointerId) {
      return
    }

    const distanceX = event.clientX - this.#pointerStartX
    const distanceY = event.clientY - this.#pointerStartY
    const movedBeyondHoldDistance = Math.hypot(distanceX, distanceY) > TAB_HOLD_CANCEL_DISTANCE_PX

    if (!this.#isEditing) {
      if (movedBeyondHoldDistance) {
        this.#clearHoldTimer()
      }

      return
    }

    if (this.#draggedTab === null) {
      return
    }

    event.preventDefault()
    this.#moveDraggedTabToPointer(event.clientX, event.clientY)
  }

  #handlePointerUp (event: PointerEvent) {
    if (this.#activePointerId !== event.pointerId) {
      return
    }

    this.#clearHoldTimer()

    if (this.#draggedTab !== null) {
      this.#draggedTab.classList.remove('tab-being-dragged')
      this.#draggedTab = null
    }

    this.#activePointerId = null
    this.#pointerDownTab = null
  }

  #handleDocumentClick (event: MouseEvent) {
    if (!this.#isEditing || !(event.target instanceof Node) || this.contains(event.target)) {
      return
    }

    this.#exitEditMode()
    event.preventDefault()
    event.stopPropagation()
  }

  #enterEditMode () {
    if (this.#isEditing) {
      return
    }

    this.#isEditing = true
    this.classList.add('tab-edit-mode')
    this.#list.forEach((tab) => {
      tab.setAttribute('aria-grabbed', 'false')
      tab.showCloseButton()
    })
  }

  #exitEditMode () {
    if (!this.#isEditing) {
      return
    }

    this.#isEditing = false
    this.classList.remove('tab-edit-mode')
    this.#clearHoldTimer()

    if (this.#draggedTab !== null) {
      this.#draggedTab.classList.remove('tab-being-dragged')
      this.#draggedTab = null
    }

    this.#list.forEach((tab) => {
      tab.removeAttribute('aria-grabbed')
      tab.hideCloseButton()
    })
    this.#activePointerId = null
    this.#pointerDownTab = null
  }

  #beginDrag (tab: $Tab, pointerId: number) {
    this.#draggedTab = tab
    this.#activePointerId = pointerId
    tab.classList.add('tab-being-dragged')
    tab.setAttribute('aria-grabbed', 'true')
  }

  #moveDraggedTabToPointer (x: number, y: number) {
    assert(this.#draggedTab !== null)

    const target = this.#getTabFromPoint(x, y)
    if (target === null || target === this.#draggedTab) {
      return
    }

    const targetRect = target.getBoundingClientRect()
    const isColumn = getComputedStyle(this).flexDirection === 'column'
    const insertBeforeTarget = isColumn
      ? y < targetRect.top + targetRect.height / 2
      : x < targetRect.left + targetRect.width / 2
    const referenceTab = insertBeforeTarget ? target : this.#getNextVisibleTab(target)

    this.#moveTabBefore(this.#draggedTab, referenceTab)
  }

  #moveTabBefore (tab: $Tab, referenceTab: $Tab | null) {
    if (tab === referenceTab) {
      return
    }

    this.insertBefore(tab, referenceTab)

    const tabs = this.#list.filter((item) => item !== tab)
    const referenceIndex = referenceTab === null ? tabs.length : tabs.indexOf(referenceTab)
    tabs.splice(referenceIndex === -1 ? tabs.length : referenceIndex, 0, tab)
    this.#list = tabs
    this.#saveOrder()
  }

  #clearHoldTimer () {
    if (this.#holdTimer === undefined) {
      return
    }

    window.clearTimeout(this.#holdTimer)
    this.#holdTimer = undefined
  }

  #getTabFromEventTarget (target: EventTarget | null) {
    if (!(target instanceof Element)) {
      return null
    }

    const tab = target.closest('#tabrow > button')
    return tab instanceof $Tab ? tab : null
  }

  #getTabFromPoint (x: number, y: number) {
    return this.#getTabFromEventTarget(document.elementFromPoint(x, y))
  }

  #getNextVisibleTab (tab: $Tab) {
    const nextSibling = tab.nextElementSibling
    return nextSibling instanceof $Tab ? nextSibling : null
  }

  #getNextUnlockedTab (tab: $Tab) {
    let nextTab = this.getNextTab(tab)

    for (let searched = 0; searched < this.#list.length; searched++) {
      if (nextTab.isUnlocked()) {
        return nextTab
      }

      nextTab = this.getNextTab(nextTab)
    }

    return null
  }
}

interface kSubTabOptionsBag {
  id: string
  class?: string
  i18n: string
  mobileIcon: string
  borderColor?: string
}

class $Tab extends HTMLButtonElement {
  #unlocked = () => true
  #type!: Tabs
  #removeable = false
  #moveable = false
  #hidden = false

  constructor (options: kSubTabOptionsBag) {
    super()

    this.id = options.id
    this.setAttribute('i18n', options.i18n)
    if (options.class) {
      this.classList.add(options.class)
    }

    if (isMobile) {
      this.classList.add('mobileTabIconButton')
      this.dataset.i18n = options.i18n
      this.setAttribute('i18n-aria-label', options.i18n)
      const icon = document.createElement('img')
      icon.classList.add('mobileTabIcon')
      icon.src = `Pictures/Tab Icons/Tabs/${options.mobileIcon}`
      icon.loading = 'lazy'
      icon.width = 32
      icon.height = 32
      icon.draggable = false
      this.appendChild(icon)
    }

    if (options.borderColor) {
      this.style.borderColor = options.borderColor
    }

    this.addEventListener('click', (event) => {
      if (tabRow.isEditing()) {
        event.preventDefault()
        event.stopPropagation()

        if (this.#removeable && this.isCloseButtonHit(event)) {
          tabRow.hideTab(this)
        }

        return
      }

      changeTab(this.#type)
      changeTabColor()
    })
  }

  setUnlockedState (fn: () => boolean) {
    this.#unlocked = fn
    return this
  }

  isUnlocked () {
    return this.#unlocked() && !this.#hidden
  }

  setType (type: Tabs) {
    this.#type = type
    return this
  }

  getType () {
    return this.#type
  }

  getI18nKey () {
    return this.getAttribute('i18n')
  }

  getSubTabs () {
    return subtabInfo[this.#type]
  }

  makeDraggable () {
    this.#moveable = true
    this.classList.add('tabDraggable')
    return this
  }

  makeRemoveable () {
    this.#removeable = true
    this.classList.add('tabRemoveable')
    return this
  }

  canMove () {
    return this.#moveable
  }

  canBeRemoved () {
    return this.#removeable
  }

  hide () {
    this.#hidden = true
  }

  showCloseButton () {
    if (!this.#removeable || this.getElementsByClassName('tabCloseButton').length > 0) {
      return
    }

    const closeButton = document.createElement('span')
    closeButton.classList.add('tabCloseButton')
    closeButton.textContent = '×'
    closeButton.setAttribute('role', 'button')
    closeButton.setAttribute('aria-label', i18next.t('tabs.hideTab'))
    closeButton.setAttribute('i18n-aria-label', 'tabs.hideTab')
    this.appendChild(closeButton)
  }

  hideCloseButton () {
    this.getElementsByClassName('tabCloseButton').item(0)?.remove()
  }

  isCloseButtonHit (event: MouseEvent | PointerEvent) {
    if (!this.#removeable) {
      return false
    }

    if (event.target instanceof Element && event.target.closest('.tabCloseButton') !== null) {
      return true
    }

    const rect = this.getBoundingClientRect()
    const hitboxSize = 24

    return event.clientX >= rect.right - hitboxSize && event.clientY <= rect.top + hitboxSize
  }

  resetHidden () {
    this.#hidden = false
  }
}

customElements.define('tab-row', TabRow, { extends: 'div' })
customElements.define('sub-tab', $Tab, { extends: 'button' })

export const tabRow = new TabRow()
document.getElementsByClassName('navbar').item(0)?.appendChild(tabRow)

tabRow.appendButton(
  new $Tab({ id: 'buildingstab', i18n: 'tabs.main.buildings', mobileIcon: 'Buildings.png' })
    .setType(Tabs.Buildings)
    .makeDraggable()
    .makeRemoveable(),
  new $Tab({ id: 'upgradestab', i18n: 'tabs.main.upgrades', mobileIcon: 'Upgrades.png' })
    .setType(Tabs.Upgrades)
    .makeDraggable()
    .makeRemoveable(),
  new $Tab({
    /* class: 'prestigeunlock', */
    id: 'achievementstab',
    i18n: 'tabs.main.achievements',
    mobileIcon: 'Achievements.png'
  })
    // .setUnlockedState(() => player.unlocks.prestige)
    .setType(Tabs.Achievements)
    .makeDraggable()
    .makeRemoveable(),
  new $Tab({ class: 'prestigeunlock', id: 'runestab', i18n: 'tabs.main.runes', mobileIcon: 'Runes.png' })
    .setUnlockedState(() => player.unlocks.prestige)
    .setType(Tabs.Runes)
    .makeDraggable()
    .makeRemoveable(),
  new $Tab({
    class: 'transcendunlock',
    id: 'challengetab',
    i18n: 'tabs.main.challenges',
    mobileIcon: 'Challenges.png'
  })
    .setUnlockedState(() => player.unlocks.transcend)
    .setType(Tabs.Challenges)
    .makeDraggable()
    .makeRemoveable(),
  new $Tab({
    class: 'reincarnationunlock',
    id: 'researchtab',
    i18n: 'tabs.main.research',
    mobileIcon: 'Research.png'
  })
    .setUnlockedState(() => player.unlocks.reincarnate)
    .setType(Tabs.Research)
    .makeDraggable()
    .makeRemoveable(),
  new $Tab({ class: 'chal8', id: 'anttab', i18n: 'tabs.main.antHill', mobileIcon: 'Anthill.png' })
    .setUnlockedState(() => player.unlocks.anthill)
    .setType(Tabs.AntHill)
    .makeDraggable()
    .makeRemoveable(),
  new $Tab({ class: 'chal10', id: 'cubetab', i18n: 'tabs.main.wowCubes', mobileIcon: 'WowCubes.png' })
    .setUnlockedState(() => player.unlocks.ascensions)
    .setType(Tabs.WowCubes)
    .makeDraggable()
    .makeRemoveable(),
  new $Tab({ class: 'chal11', id: 'campaigntab', i18n: 'tabs.main.campaign', mobileIcon: 'Campaigns.png' })
    .setUnlockedState(() => player.challengecompletions[11] > 0)
    .setType(Tabs.Campaign)
    .makeDraggable()
    .makeRemoveable(),
  new $Tab({ class: 'chal11', id: 'traitstab', i18n: 'tabs.main.corruption', mobileIcon: 'Corruption.png' })
    .setUnlockedState(() => (player.challengecompletions[11] > 0))
    .setType(Tabs.Corruption)
    .makeDraggable()
    .makeRemoveable(),
  new $Tab({
    class: 'singularity',
    id: 'singularitytab',
    i18n: 'tabs.main.singularity',
    mobileIcon: 'Singularity.png'
  })
    .setUnlockedState(() => player.highestSingularityCount > 0)
    .setType(Tabs.Singularity)
    .makeDraggable()
    .makeRemoveable(),
  new $Tab({ id: 'settingstab', i18n: 'tabs.main.settings', mobileIcon: 'Settings.png' })
    .setType(Tabs.Settings)
    .makeDraggable(),
  new $Tab({ class: 'reincarnationunlock', id: 'shoptab', i18n: 'tabs.main.shop', mobileIcon: 'Shop.png' })
    .setUnlockedState(() => player.unlocks.reincarnate || player.highestSingularityCount > 0)
    .setType(Tabs.Shop)
    .makeDraggable()
    .makeRemoveable(),
  new $Tab({ class: 'isEvent', id: 'eventtab', i18n: 'tabs.main.unsmith', mobileIcon: 'Events.png' })
    .setType(Tabs.Event)
    .makeDraggable()
    .makeRemoveable(),
  new $Tab({ id: 'pseudoCoinstab', i18n: 'tabs.main.purchase', mobileIcon: 'PseudoCoins.png' })
    .setType(Tabs.Purchase)
    .makeDraggable()
)

// Mobile menu toggle functionality
const mobileMenuToggle = DOMCacheGetOrSet('mobileMenuToggle')
const navbar = document.querySelector('.navbar')

const toggleMobileMenu = () => {
  const isOpen = navbar?.classList.toggle('menu-open')
  mobileMenuToggle.classList.toggle('menu-open', isOpen)
  mobileMenuToggle.setAttribute('aria-expanded', String(isOpen))
}

mobileMenuToggle.addEventListener('click', toggleMobileMenu)

// Close mobile menu when a tab is clicked
tabRow.addEventListener('click', (e) => {
  const target = e.target instanceof Element ? e.target.closest('#tabrow > button') : null
  if (!isMobile && !tabRow.isEditing() && target !== null && navbar?.classList.contains('menu-open')) {
    toggleMobileMenu()
  }
})

/**
 * @param step 1 to go forward; -1 to go back
 * @param changeSubtab true to change the subtab, false to change the main tabs
 */
export const keyboardTabChange = (step: 1 | -1 = 1, changeSubtab = false) => {
  if (changeSubtab) {
    // When changing subtabs, use the current tab instead of calculating next/previous
    changeSubTab(tabRow.getCurrentTab().getType(), { step })
  } else {
    let tab = step === 1 ? tabRow.getNextTab() : tabRow.getPreviousTab()

    while (!tab?.isUnlocked()) {
      tab = step === 1 ? tabRow.getNextTab(tab) : tabRow.getPreviousTab(tab)
    }

    changeTab(tab.getType(), step)
    changeTabColor()
  }
}

export const changeTab = (tabs: Tabs, step?: number) => {
  if (step === 1) {
    tabRow.setNextTab()
  } else if (step === -1) {
    tabRow.setPreviousTab()
  } else {
    while (tabRow.getCurrentTab().getType() !== tabs) {
      tabRow.setNextTab()
    }
  }

  while (!tabRow.getCurrentTab().isUnlocked()) {
    if (step === 1 || step === undefined) {
      tabRow.setNextTab()
    } else {
      tabRow.setPreviousTab()
    }
  }

  G.currentTab = tabRow.getCurrentTab().getType()
  for (const tab of tabRow.getSubs()) {
    const isActive = tab === tabRow.getCurrentTab()
    tab.classList.toggle('active-tab', isActive)

    if (isActive) {
      tab.setAttribute('aria-current', 'page')
    } else {
      tab.removeAttribute('aria-current')
    }
  }

  if (G.currentTab === Tabs.Achievements) {
    awardUngroupedAchievement('participationTrophy')
  }

  revealStuff()
  hideStuff()
  CloseModal()
  ;(document.activeElement as HTMLElement | null)?.blur()

  const subTabList = subtabInfo[G.currentTab].subTabList
  for (let i = 0; i < subTabList.length; i++) {
    const id = subTabList[i].buttonID
    if (DOMCacheHas(id)) {
      const button = DOMCacheGetOrSet(id)

      if (!subTabList[i].unlocked()) {
        button.classList.add('none')
      } else {
        button.classList.remove('none')
      }

      if (button.classList.contains('active-subtab')) {
        subtabInfo[tabRow.getCurrentTab().getType()].subtabIndex = i
      }
    }
  }

  if (PLATFORM === 'steam') {
    import('./steam/discord').then(({ setRichPresenceDiscord }) => {
      const i18n = tabRow.getCurrentTab().getI18nKey()
      setRichPresenceDiscord({
        details: 'Playing Synergism',
        state: `Looking at ${i18next.t(i18n!)}...`,
        startTimestamp: new Date()
      })
    })
  }
}

/**
 * Resets tab state with no side-effects
 */
export const resetAllSubTabs = (page = 0) => {
  for (const tab of Object.values(Tabs)) {
    if (typeof tab === 'number') {
      const subTabs = subtabInfo[tab]

      if (subTabs.subTabList.length === 0) {
        subTabs.subtabIndex = 0
        return
      }

      subTabs.subtabIndex = limitRange(page, 0, subTabs.subTabList.length - 1)
    }
  }
}

export const changeSubTab = (tabs: Tabs, { page, step }: SubTabSwitchOptions) => {
  let tab = tabRow.getCurrentTab()

  if (tab.getType() !== tabs) {
    changeTab(tabs)
    tab = tabRow.getCurrentTab()
  }

  const subTabs = tab.getSubTabs()

  if (!tab.isUnlocked() || subTabs.subTabList.length === 0) {
    return
  }

  if (page !== undefined) {
    subtabInfo[tab.getType()].subtabIndex = limitRange(page, 0, subTabs.subTabList.length - 1)
  } else {
    subtabInfo[tab.getType()].subtabIndex = limitRange(
      subtabInfo[tab.getType()].subtabIndex + step,
      0,
      subTabs.subTabList.length - 1
    )
  }

  let subTabList = subTabs.subTabList[subtabInfo[tab.getType()].subtabIndex]

  while (!subTabList.unlocked()) {
    subtabInfo[tab.getType()].subtabIndex = limitRange(
      subtabInfo[tab.getType()].subtabIndex + (step ?? 1),
      0,
      subTabs.subTabList.length - 1
    )
    subTabList = subTabs.subTabList[subtabInfo[tab.getType()].subtabIndex]
  }

  if (subTabList.unlocked()) {
    for (const subtab of subTabs.subTabList) {
      const element = DOMCacheGetOrSet(subtab.buttonID)

      if (subtab === subTabList) {
        element.classList.add('active-subtab')
      } else {
        element.classList.remove('active-subtab')
      }
    }

    subTabs.tabSwitcher?.()(subTabList.subTabID)
    scrollMainToTop()
  }

  CloseModal()
}

export const registerSubTabSwitches = memoize(() => {
  for (const tab of Object.values(Tabs)) {
    if (typeof tab !== 'number') {
      continue
    }

    for (const [page, subtab] of subtabInfo[tab].subTabList.entries()) {
      DOMCacheGetOrSet(subtab.buttonID).addEventListener('click', () => changeSubTab(tab, { page }))
    }
  }
})

export function subTabsInMainTab (name: Tabs) {
  let tab = tabRow.getCurrentTab()

  while (tab.getType() !== name) {
    tab = tabRow.setNextTab()
  }

  return tab.getSubTabs().subTabList.length
}

export function getActiveSubTab () {
  return subtabInfo[tabRow.getCurrentTab().getType()].subtabIndex
}
