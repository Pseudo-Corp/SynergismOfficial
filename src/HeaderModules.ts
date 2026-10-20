import i18next from 'i18next'
import { achievementPoints, getAchievementReward } from './Achievements'
import {
  type AmbrosiaUpgradeNames,
  ambrosiaUpgradeNames,
  getUnlockedBlueberryLoadoutCount,
  lastBlueberryLoadout,
  loadBlueberryLoadout
} from './BlueberryUpgrades'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { calculateBlueberryInventory } from './Calculate'
import {
  corrIcons,
  corruptionLoadLoadout,
  corruptionLoadoutMatches,
  type Corruptions,
  getUnlockedCorruptionLoadoutCount,
  maxCorruptionLevel
} from './Corruptions'
import {
  freeButtonPosition,
  HEADER_BUTTON_GROUP_CAPACITY,
  HEADER_GRID_COLUMNS,
  HEADER_STACK_CAPACITY,
  type HeaderModuleId,
  type HeaderModuleSize,
  headerModuleSizes,
  type HeaderRegionId,
  headerRegionIds,
  isHeaderButton,
  isHeaderGridRegion,
  isHeaderLoadout,
  isHeaderProgress,
  type RainbowAmbrosiaModuleId,
  rainbowAmbrosiaModuleIds
} from './HeaderLayoutDefaults'
import {
  addCodeAvailableUses,
  addCodeMaxUses,
  addCodeTimeToNextUse,
  timeCodeAvailableUses,
  timeCodeRewardMultiplier,
  timeCodeTimeToNextUse
} from './ImportExport'
import { allDurableConsumables, getLotusTimeExpiresAt, getOwnedBells, getOwnedLotus } from './Login'
import { getGlobalBonus } from './Quark'
import { runes } from './Runes'
import { getGQUpgradeEffect } from './singularity'
import { blankSave, deepClone, format, player } from './Synergism'
import { IconSets } from './Themes'
import type { HeaderLayout } from './types/Synergism'
import { CloseModal, Confirm, createFitties, MEDIUM_MODAL_UPDATE_TICK, Modal, resetFitText } from './UpdateHTML'
import { formatS, isMobile, timeRemainingMinutes } from './Utility'
import { Globals as G } from './Variables'

const ascensionStatsUnlocked = () => Boolean(getAchievementReward('statTracker')) || player.highestSingularityCount > 0
const singularityStatsUnlocked = () => player.highestSingularityCount > 0
const ambrosiaUnlocked = () => player.singularityChallenges.noSingularityUpgrades.completions > 0

const headerModuleUnlocks: Record<HeaderModuleId, () => boolean> = {
  ascCubeStats: ascensionStatsUnlocked,
  ascTessStats: ascensionStatsUnlocked,
  ascHyperStats: () => ascensionStatsUnlocked() && player.challengecompletions[13] > 0,
  ascPlatonicStats: () => ascensionStatsUnlocked() && player.challengecompletions[14] > 0,
  ascHepteractStats: () => ascensionStatsUnlocked() && G.challenge15Rewards.hepteractsUnlocked.value >= 1,
  ascTimeTakenStats: ascensionStatsUnlocked,
  ascC10CompletionsStats: ascensionStatsUnlocked,
  ascTimeFactorStats: ascensionStatsUnlocked,
  ascAscensionTimeFactorStats: ascensionStatsUnlocked,
  ascSingularityCountStats: singularityStatsUnlocked,
  ascSingTimeTakenStats: singularityStatsUnlocked,
  ascSingChallengeTimeTakenStats: () => player.insideSingularityChallenge,
  happyHourBellHeader: () => true,
  lotusHeader: () => true,
  dailyCodeHeader: () => true,
  addCodeHeader: () => true,
  timeCodeHeader: () => true,
  corruptionLoadoutsHeader: () => player.challengecompletions[11] > 0,
  ambrosiaLoadoutsHeader: ambrosiaUnlocked,
  coinHeader: () => true,
  diamondHeader: () => player.unlocks.prestige,
  offeringHeader: () => player.unlocks.prestige,
  quarkHeader: () => player.unlocks.reincarnate,
  mythosHeader: () => player.unlocks.transcend,
  mythosShardHeader: () => player.unlocks.transcend,
  particlesHeader: () => player.unlocks.reincarnate,
  obtainiumHeader: () => player.unlocks.reincarnate,
  goldenQuarkHeader: () => player.highestSingularityCount > 0,
  octeractHeader: () => getGQUpgradeEffect('octeractUnlock', 'unlocked'),
  achievementPointsHeader: () => true,
  quarkBonusHeader: () => player.unlocks.reincarnate,
  ambrosiaHeader: ambrosiaUnlocked,
  redAmbrosiaHeader: () => player.singularityChallenges.noAmbrosiaUpgrades.completions > 0,
  purpleAmbrosiaHeader: () => player.singularityChallenges.taxmanLastStand.completions > 0,
  purpleHoneyHeader: () => player.singularityChallenges.taxmanLastStand.completions > 0,
  blueberryHeader: ambrosiaUnlocked,
  rainbowAmbrosiaHeader: ambrosiaUnlocked,
  prestigebtn: () => player.unlocks.coinfour,
  transcendbtn: () => player.unlocks.prestige,
  reincarnatebtn: () => player.unlocks.transcend,
  acceleratorboostbtn: () => player.unlocks.transcend,
  challengebtn: () => player.unlocks.transcend,
  reincarnatechallengebtn: () => player.unlocks.reincarnate,
  ascendChallengeBtn: () => player.ascensionCount > 0,
  ascendbtn: () => player.unlocks.ascensions,
  singularitybtn: () => runes.antiquities.level > 0 || player.highestSingularityCount > 0,
  transcensionChallengeProgress: () =>
    !isMobile && (player.unlocks.transcend || player.currentChallenge.transcension !== 0),
  reincarnationChallengeProgress: () =>
    !isMobile && (player.unlocks.reincarnate || player.currentChallenge.reincarnation !== 0),
  ascensionChallengeProgress: () => !isMobile && (player.ascensionCount > 0 || player.currentChallenge.ascension !== 0)
}

const ambrosiaAmounts: Record<RainbowAmbrosiaModuleId, () => number> = {
  ambrosiaHeader: () => player.ambrosia,
  redAmbrosiaHeader: () => player.redAmbrosia,
  purpleAmbrosiaHeader: () => player.purpleAmbrosia,
  purpleHoneyHeader: () => player.purpleReactor.purpleHoney,
  blueberryHeader: () => calculateBlueberryInventory() - player.spentBlueberries
}

const HEADER_EDIT_HOLD_MS = 650
const HEADER_HOLD_CANCEL_DISTANCE_PX = 8
const HEADER_STACK_ZONE_START = 0.25
const HEADER_STACK_ZONE_END = 0.75
const HEADER_DROP_BAR_PX = 4

interface HeaderDropTarget {
  region: HeaderRegionId | null
  index: number
  position: number
  join: boolean
  indicator: { left: number; top: number; width: number; height: number } | null
}

interface HeaderButtonStack {
  index: number
  element: HTMLElement
  positions: number[]
}

const trayDropTarget: HeaderDropTarget = { region: null, index: 0, position: 0, join: false, indicator: null }

let editing = false
let holdTimer: number | undefined
let activePointerId: number | null = null
let pressedModule: HeaderModuleId | null = null
let draggedModule: HeaderModuleId | null = null
let dragMoved = false
let selectedModule: HeaderModuleId | null = null
let dropTarget: HeaderDropTarget | null = null
let pointerStartX = 0
let pointerStartY = 0

const layoutKey = () => isMobile ? 'mobile' : 'desktop'
const currentLayout = () => player.headerLayouts[layoutKey()]
const gridColumns = () => HEADER_GRID_COLUMNS[layoutKey()]
const buttonGroupCapacity = () => HEADER_BUTTON_GROUP_CAPACITY[layoutKey()]
const gridArea = (index: number) => `${Math.floor(index / gridColumns()) + 1} / ${(index % gridColumns()) + 1}`

const sizeOf = (layout: HeaderLayout, id: HeaderModuleId) => layout.sizes[id] ?? 'M'

const isWideSlot = (layout: HeaderLayout, slot: HeaderModuleId[] | undefined) =>
  slot?.length === 1 && !isHeaderButton(slot[0]) && sizeOf(layout, slot[0]) === 'L'
  && !layout.hidden.includes(slot[0])

const isCoveredCell = (layout: HeaderLayout, region: HeaderRegionId, cell: number) =>
  cell % gridColumns() !== 0 && isWideSlot(layout, layout.regions[region][cell - 1])

const firstEmptyCell = (layout: HeaderLayout, region: HeaderRegionId, from: number) => {
  const slots = layout.regions[region]
  let cell = from
  while ((slots[cell] ?? []).length > 0 || isCoveredCell(layout, region, cell)) {
    cell++
  }
  while (slots.length < cell) {
    slots.push([])
  }
  return cell
}

const settleWideSlots = (layout: HeaderLayout, region: HeaderRegionId) => {
  const columns = gridColumns()
  const slots = layout.regions[region]
  for (let index = 0; index < slots.length; index++) {
    if (!isWideSlot(layout, slots[index])) {
      continue
    }

    let start = index
    if (index % columns === columns - 1) {
      if (isCoveredCell(layout, region, index - 1)) {
        const wide = slots[index]
        slots[index] = []
        slots[firstEmptyCell(layout, region, index + 1)] = wide
        continue
      }
      start = index - 1
      ;[slots[start], slots[index]] = [slots[index], slots[start]]
    }

    const displaced = slots[start + 1] ?? []
    if (displaced.length > 0) {
      slots[start + 1] = []
      slots[firstEmptyCell(layout, region, start + 2)] = displaced
    }
  }
}

const updateEditToolbar = (layout: HeaderLayout) => {
  const selected = selectedModule

  for (const size of headerModuleSizes) {
    const button = DOMCacheGetOrSet(`headerSize${size}`) as HTMLButtonElement
    button.disabled = selected === null || (size === 'S' && isHeaderButton(selected))
    button.setAttribute('aria-pressed', `${selected !== null && sizeOf(layout, selected) === size}`)
  }

  ;(DOMCacheGetOrSet('headerHideModule') as HTMLButtonElement).disabled = selected === null
}

const centerButtonRuns = (stacks: HeaderButtonStack[]) => {
  const capacity = buttonGroupCapacity()
  let run: HeaderButtonStack[] = []
  for (const [i, stack] of stacks.entries()) {
    run.push(stack)
    const next = stacks[i + 1]
    if (next?.index === stack.index + 1 && next.index % gridColumns() !== 0) {
      continue
    }

    const occupied = run.flatMap(({ positions }, offset) => positions.map((position) => offset * capacity + position))
    if (occupied.length > 0) {
      const shift = (run.length * capacity - 1 - Math.max(...occupied) - Math.min(...occupied)) / 2
      for (const { element } of run) {
        element.style.translate = `${shift * 100 / capacity}%`
      }
    }
    run = []
  }
}

export const renderHeaderLayout = () => {
  const layout = currentLayout()
  const trayModules: HTMLElement[] = []

  DOMCacheGetOrSet('mainHeader').style.setProperty('--header-button-slots', `${buttonGroupCapacity()}`)

  for (const region of headerRegionIds) {
    const slotElements: HTMLElement[] = []
    const buttonStacks: HeaderButtonStack[] = []
    const isGrid = isHeaderGridRegion(region)
    let lastCell = -1

    if (isGrid) {
      settleWideSlots(layout, region)
    }

    layout.regions[region].forEach((slot, index) => {
      const shown: HTMLElement[] = []
      let unlocked = false
      const wide = isGrid && isWideSlot(layout, slot)
      for (const id of slot) {
        const element = DOMCacheGetOrSet(id)
        const size = isGrid && !isHeaderButton(id) && sizeOf(layout, id) === 'L' ? 'M' : sizeOf(layout, id)
        const fitText = element.querySelector<HTMLElement>('.fitText')
        if (element.dataset.size !== size && fitText !== null) {
          resetFitText(fitText)
        }
        element.dataset.size = size
        element.classList.toggle('headerModuleWide', wide)
        element.classList.toggle('headerModuleSelected', id === selectedModule)
        element.style.gridArea = ''
        if (isHeaderButton(id)) {
          element.style.gridColumn = `${(layout.positions[id] ?? 0) + 1}`
        }
        delete element.dataset.headerSlot

        if (layout.hidden.includes(id)) {
          trayModules.push(element)
        } else {
          shown.push(element)
          unlocked ||= headerModuleUnlocks[id]()
        }
      }

      if (shown.length === 0) {
        return
      }

      let slotElement = shown[0]
      if (slot.some(isHeaderButton)) {
        const buttonSlots: HTMLElement[] = []
        if (editing) {
          for (let position = 0; position < buttonGroupCapacity(); position++) {
            const buttonSlot = document.createElement('div')
            buttonSlot.className = 'headerButtonSlot'
            buttonSlot.style.gridColumn = `${position + 1}`
            buttonSlots.push(buttonSlot)
          }
        }
        slotElement = document.createElement('div')
        slotElement.className = 'headerStack headerStackRow'
        slotElement.replaceChildren(...buttonSlots, ...shown)
        buttonStacks.push({
          index,
          element: slotElement,
          positions: slot.filter((id) => !layout.hidden.includes(id) && headerModuleUnlocks[id]())
            .map((id) => layout.positions[id] ?? 0)
        })
      } else if (shown.length > 1) {
        slotElement = document.createElement('div')
        slotElement.className = 'headerStack'
        slotElement.replaceChildren(...shown)
      }
      slotElement.dataset.headerSlot = `${index}`
      if (isGrid) {
        slotElement.style.gridArea = wide ? `${gridArea(index)} / span 1 / span 2` : gridArea(index)
        if (unlocked) {
          lastCell = wide ? index + 1 : index
        }
      }
      slotElements.push(slotElement)
    })

    const regionElement = DOMCacheGetOrSet(region)
    if (!isGrid) {
      regionElement.replaceChildren(...slotElements)
      continue
    }

    if (isMobile && !editing) {
      centerButtonRuns(buttonStacks)
    }

    const cells: HTMLElement[] = []
    const cellCount = (Math.floor(lastCell / gridColumns()) + (editing ? 2 : 1)) * gridColumns()
    for (let index = 0; index < cellCount; index++) {
      const cell = document.createElement('div')
      cell.className = 'headerCell'
      cell.dataset.headerCell = `${index}`
      cell.style.gridArea = gridArea(index)
      cells.push(cell)
    }
    regionElement.style.setProperty('--header-grid-columns', `${gridColumns()}`)
    regionElement.replaceChildren(...cells, ...slotElements)
  }

  DOMCacheGetOrSet('headerTray').replaceChildren(DOMCacheGetOrSet('headerTrayLabel'), ...trayModules)
  updateEditToolbar(layout)
  createFitties(DOMCacheGetOrSet('mainHeader'))
}

export const updateHeaderModuleVisibility = () => {
  let changed = false
  for (const id of Object.keys(headerModuleUnlocks) as HeaderModuleId[]) {
    const element = DOMCacheGetOrSet(id)
    const locked = !headerModuleUnlocks[id]()
    if (element.classList.contains('headerModuleLocked') !== locked) {
      element.classList.toggle('headerModuleLocked', locked)
      changed = true
    }
  }

  if (changed) {
    renderHeaderLayout()
  }
}

const setHeaderText = (elementId: string, text: string) => {
  const element = DOMCacheGetOrSet(elementId)
  if (element.textContent !== text) {
    element.textContent = text
  }
}

export const updateHeaderConsumables = () => {
  const layout = currentLayout()

  if (editing || !layout.hidden.includes('happyHourBellHeader')) {
    const now = Date.now()
    const activeBells = allDurableConsumables.HAPPY_HOUR_BELL.ends.filter((end) => end > now)
    setHeaderText(
      'happyHourBellHeaderTimer',
      activeBells.length > 0
        ? i18next.t('headerLayout.bellActive', {
          amount: activeBells.length,
          time: timeRemainingMinutes(Math.min(...activeBells))
        })
        : '--:--'
    )
    setHeaderText('happyHourBellHeaderOwned', i18next.t('headerLayout.owned', { x: format(getOwnedBells(), 0, true) }))
  }

  if (editing || !layout.hidden.includes('lotusHeader')) {
    setHeaderText('lotusHeaderTimer', timeRemainingMinutes(getLotusTimeExpiresAt()))
    setHeaderText('lotusHeaderOwned', i18next.t('headerLayout.owned', { x: format(getOwnedLotus(), 0, true) }))
  }
}

const codeTime = (layout: HeaderLayout, id: HeaderModuleId, seconds: number) =>
  sizeOf(layout, id) === 'S' ? `${format(Math.floor(seconds), 0, true)}s` : formatS(seconds)

export const updateHeaderInfo = () => {
  const layout = currentLayout()

  if (editing || !layout.hidden.includes('dailyCodeHeader')) {
    const midnight = new Date()
    midnight.setHours(24, 0, 0, 0)
    setHeaderText('dailyCodeHeaderUses', `${player.dailyCodeUsed ? 0 : 1}/1`)
    setHeaderText(
      'dailyCodeHeaderNext',
      player.dailyCodeUsed
        ? i18next.t('headerLayout.codeNext', {
          time: codeTime(layout, 'dailyCodeHeader', (midnight.getTime() - Date.now()) / 1000)
        })
        : ''
    )
  }

  if (editing || !layout.hidden.includes('addCodeHeader')) {
    const uses = addCodeAvailableUses()
    const maxUses = addCodeMaxUses()
    setHeaderText('addCodeHeaderUses', `${format(uses, 0, true)}/${format(maxUses, 0, true)}`)
    setHeaderText(
      'addCodeHeaderNext',
      uses < maxUses
        ? i18next.t('headerLayout.codeNext', { time: codeTime(layout, 'addCodeHeader', addCodeTimeToNextUse()) })
        : ''
    )
  }

  if (editing || !layout.hidden.includes('timeCodeHeader')) {
    const uses = timeCodeAvailableUses()
    setHeaderText('timeCodeHeaderUses', `${uses}/1`)
    setHeaderText(
      'timeCodeHeaderNext',
      uses === 0
        ? i18next.t('headerLayout.codeNext', { time: codeTime(layout, 'timeCodeHeader', timeCodeTimeToNextUse()) })
        : i18next.t('headerLayout.timeCodeMultiplier', { x: format(timeCodeRewardMultiplier(), 2, true) })
    )
  }

  if (editing || !layout.hidden.includes('achievementPointsHeader')) {
    setHeaderText('achievementPointsHeaderDisplay', format(achievementPoints, 0, true))
  }

  if (editing || !layout.hidden.includes('quarkBonusHeader')) {
    setHeaderText('quarkBonusHeaderDisplay', i18next.t('headerLayout.quarkBonus', { x: getGlobalBonus() }))
  }
}

export const updateHeaderAmbrosia = () => {
  const layout = currentLayout()

  for (const id of rainbowAmbrosiaModuleIds) {
    if (editing || !layout.hidden.includes(id)) {
      setHeaderText(`${id}Display`, format(ambrosiaAmounts[id](), 0, true))
    }
  }

  if (editing || !layout.hidden.includes('rainbowAmbrosiaHeader')) {
    const rainbow = DOMCacheGetOrSet('rainbowAmbrosiaHeader')
    if (rainbow.dataset.ambrosia !== layout.rainbowAmbrosia) {
      rainbow.dataset.ambrosia = layout.rainbowAmbrosia
      for (const icon of rainbow.querySelectorAll('img')) {
        icon.hidden = icon.dataset.ambrosia !== layout.rainbowAmbrosia
      }
    }
    setHeaderText('rainbowAmbrosiaHeaderDisplay', format(ambrosiaAmounts[layout.rainbowAmbrosia](), 0, true))
  }
}

const loadoutSlots = (elementId: string, count: number, load: (slot: number) => void) => {
  const container = DOMCacheGetOrSet(elementId)
  if (container.children.length !== count) {
    const slots: HTMLButtonElement[] = []
    for (let slot = 1; slot <= count; slot++) {
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'headerLoadoutSlot'
      button.textContent = `${slot}`
      button.dataset.slot = `${slot}`
      button.addEventListener('click', () => load(slot))
      slots.push(button)
    }
    container.replaceChildren(...slots)
  }
  return container.children as HTMLCollectionOf<HTMLButtonElement>
}

const corruptionIconSrc = (icon: keyof Corruptions) => `Pictures/${IconSets[player.iconSet][0]}${corrIcons[icon]}`

const blueberryIconSrc = (icon: AmbrosiaUpgradeNames) =>
  (DOMCacheGetOrSet(icon).querySelector('img') as HTMLImageElement).src

const setLoadoutSlotIcon = <T extends string>(
  button: HTMLElement,
  slot: number,
  icon: T | undefined,
  src: (icon: T) => string
) => {
  if (button.dataset.icon === icon) {
    return
  }

  if (icon === undefined) {
    delete button.dataset.icon
    button.textContent = `${slot}`
    return
  }

  const image = document.createElement('img')
  image.src = src(icon)
  image.alt = ''
  const number = document.createElement('span')
  number.textContent = `${slot}`
  button.dataset.icon = icon
  button.replaceChildren(image, number)
}

const openLoadoutIconPicker = <T extends string>(
  event: PointerEvent,
  button: HTMLElement,
  icons: Partial<Record<number, T>>,
  choices: readonly T[],
  src: (icon: T) => string
) => {
  const slot = Number(button.dataset.slot)
  const option = (icon: T | undefined, content: string) =>
    `<button type="button" data-modal-action="${icon ?? ''}" aria-pressed="${icons[slot] === icon}">${content}</button>`
  const html = `<p class="headerLoadoutIconTitle">${i18next.t('headerLayout.loadoutIcon', { x: slot })}</p>`
    + `<div class="headerLoadoutIcons">${option(undefined, `${slot}`)}${
      choices.map((icon) => option(icon, `<img src="${src(icon)}" alt="">`)).join('')
    }</div>`

  Modal(() => html, event.clientX, event.clientY, { borderColor: 'gold' }, MEDIUM_MODAL_UPDATE_TICK, {
    targetElement: button,
    buttonClick: (choice) => {
      const icon = choices.find((candidate) => candidate === choice.dataset.modalAction)
      if (icon === undefined) {
        delete icons[slot]
      } else {
        icons[slot] = icon
      }
      CloseModal()
      updateHeaderLoadouts()
    }
  })
}

export const updateHeaderLoadouts = () => {
  const layout = currentLayout()

  if (editing || !layout.hidden.includes('corruptionLoadoutsHeader')) {
    const saves = player.corruptions.saves.saves
    const slots = loadoutSlots(
      'corruptionLoadoutsHeaderSlots',
      Math.min(saves.length, getUnlockedCorruptionLoadoutCount()),
      (slot) => corruptionLoadLoadout(slot - 1)
    )
    const maxLevel = maxCorruptionLevel()
    for (let index = 0; index < slots.length; index++) {
      const slot = slots[index]
      const { name, loadout } = saves[index]
      if (slot.getAttribute('title') !== name) {
        slot.setAttribute('title', name)
      }
      slot.classList.toggle(
        'headerLoadoutActive',
        corruptionLoadoutMatches(loadout.loadout, player.corruptions.used.loadout, maxLevel)
      )
      slot.classList.toggle(
        'headerLoadoutNext',
        corruptionLoadoutMatches(loadout.loadout, player.corruptions.next.loadout, maxLevel)
      )
      setLoadoutSlotIcon(slot, index + 1, layout.loadoutIcons.corruptionLoadoutsHeader[index + 1], corruptionIconSrc)
    }
  }

  if (editing || !layout.hidden.includes('ambrosiaLoadoutsHeader')) {
    const slots = loadoutSlots(
      'ambrosiaLoadoutsHeaderSlots',
      getUnlockedBlueberryLoadoutCount(),
      loadBlueberryLoadout
    )
    for (let index = 0; index < slots.length; index++) {
      slots[index].classList.toggle('headerLoadoutActive', index + 1 === lastBlueberryLoadout)
      setLoadoutSlotIcon(
        slots[index],
        index + 1,
        layout.loadoutIcons.ambrosiaLoadoutsHeader[index + 1],
        blueberryIconSrc
      )
    }
  }
}

const findSlot = (layout: HeaderLayout, id: HeaderModuleId) => {
  for (const region of headerRegionIds) {
    const index = layout.regions[region].findIndex((slot) => slot.includes(id))
    if (index !== -1) {
      return { region, index, member: layout.regions[region][index].indexOf(id) }
    }
  }

  return null
}

const canJoinSlot = (slot: HeaderModuleId[], id: HeaderModuleId) => {
  if (isHeaderProgress(id) || slot.some(isHeaderProgress) || isHeaderLoadout(id) || slot.some(isHeaderLoadout)) {
    return false
  }
  if (!isHeaderButton(id)) {
    return !slot.includes(id) && !slot.some(isHeaderButton) && slot.length < HEADER_STACK_CAPACITY
  }
  if (!slot.every(isHeaderButton)) {
    return false
  }
  return slot.includes(id) || slot.length < buttonGroupCapacity()
}

const detachModule = (layout: HeaderLayout, id: HeaderModuleId) => {
  const location = findSlot(layout, id)
  if (location === null) {
    return null
  }

  const slots = layout.regions[location.region]
  const slot = slots[location.index]
  if (slot.length === 1 && isHeaderGridRegion(location.region)) {
    slots[location.index] = []
    return { ...location, removedSlot: false }
  }
  if (slot.length === 1) {
    slots.splice(location.index, 1)
    return { ...location, removedSlot: true }
  }

  slot.splice(location.member, 1)
  for (const member of [...slot, id]) {
    if (sizeOf(layout, member) === 'S') {
      delete layout.sizes[member]
    }
  }
  return { ...location, removedSlot: false }
}

const splitOutModule = (layout: HeaderLayout, id: HeaderModuleId) => {
  const location = findSlot(layout, id)
  if (location === null || layout.regions[location.region][location.index].length === 1) {
    return
  }

  detachModule(layout, id)
  const slots = layout.regions[location.region]
  if (isHeaderGridRegion(location.region)) {
    slots[firstEmptyCell(layout, location.region, location.index + 1)] = [id]
  } else {
    slots.splice(location.index + 1, 0, [id])
  }
}

const hideModule = (layout: HeaderLayout, id: HeaderModuleId) => {
  splitOutModule(layout, id)
  if (!layout.hidden.includes(id)) {
    layout.hidden.push(id)
  }
}

const resizeModule = (layout: HeaderLayout, id: HeaderModuleId, size: HeaderModuleSize) => {
  if (!isHeaderButton(id)) {
    splitOutModule(layout, id)
  }
  layout.sizes[id] = size
}

const moveModule = (layout: HeaderLayout, id: HeaderModuleId, region: HeaderRegionId, target: HeaderDropTarget) => {
  const location = findSlot(layout, id)
  if (target.join && location !== null && location.region === region && location.index === target.index) {
    const occupant = layout.regions[region][target.index].find((member) => layout.positions[member] === target.position)
    if (occupant !== undefined) {
      layout.positions[occupant] = layout.positions[id]
    }
    layout.positions[id] = target.position
    return
  }

  const removed = detachModule(layout, id)
  layout.hidden = layout.hidden.filter((hiddenId) => hiddenId !== id)
  if (isHeaderButton(id)) {
    layout.positions[id] = target.position
  }

  let index = target.index
  if (removed !== null && removed.region === region && removed.removedSlot && removed.index < index) {
    index -= 1
  }

  const slots = layout.regions[region]
  if (!target.join && isHeaderGridRegion(region)) {
    while (slots.length < index) {
      slots.push([])
    }
    const occupants = slots[index] ?? []
    slots[index] = [id]
    if (occupants.length > 0) {
      const swap = removed !== null && removed.region === region && removed.index !== index
        && slots[removed.index].length === 0
      slots[swap ? removed.index : firstEmptyCell(layout, region, index + 1)] = occupants
    }
    return
  }
  if (!target.join) {
    slots.splice(index, 0, [id])
    return
  }

  const slot = slots[index]
  if (isHeaderButton(id)) {
    const occupant = slot.find((member) => layout.positions[member] === target.position)
    if (occupant !== undefined) {
      layout.positions[occupant] = freeButtonPosition(layout.positions, slot)
    }
    slot.push(id)
    return
  }

  slot.push(id)
  for (const grouped of slot) {
    layout.sizes[grouped] = 'S'
  }
}

const enterEditMode = () => {
  if (editing) {
    return
  }

  editing = true
  CloseModal()

  for (const element of document.querySelectorAll<HTMLElement>('.headerProgress')) {
    DOMCacheGetOrSet(`${element.id}Text`).dataset.placeholder = i18next.t(`headerLayout.modules.${element.id}`)
  }

  DOMCacheGetOrSet('mainHeader').classList.add('headerEditMode')
  renderHeaderLayout()
}

const exitEditMode = () => {
  if (!editing) {
    return
  }

  editing = false
  selectedModule = null
  endDrag()
  CloseModal()
  DOMCacheGetOrSet('mainHeader').classList.remove('headerEditMode')
  renderHeaderLayout()
}

const clearHoldTimer = () => {
  if (holdTimer === undefined) {
    return
  }

  window.clearTimeout(holdTimer)
  holdTimer = undefined
}

const moduleFromEventTarget = (target: EventTarget | null) => {
  if (!(target instanceof Element)) {
    return null
  }

  const element = target.closest<HTMLElement>('.headerModule')
  return element === null ? null : element.id as HeaderModuleId
}

const beginDrag = (id: HeaderModuleId, pointerId: number) => {
  draggedModule = id
  dragMoved = false
  DOMCacheGetOrSet(id).classList.add('headerModuleDragging')
  DOMCacheGetOrSet('mainHeader').setPointerCapture(pointerId)
}

const endDrag = () => {
  if (draggedModule === null) {
    return
  }

  const element = DOMCacheGetOrSet(draggedModule)
  element.classList.remove('headerModuleDragging')
  element.style.translate = ''
  draggedModule = null
  dropTarget = null
  DOMCacheGetOrSet('headerDropIndicator').hidden = true
  DOMCacheGetOrSet('headerTray').classList.remove('headerTrayDropTarget')
}

const releasePointer = (pointerId: number) => {
  const header = DOMCacheGetOrSet('mainHeader')
  if (header.hasPointerCapture(pointerId)) {
    header.releasePointerCapture(pointerId)
  }

  activePointerId = null
  pressedModule = null
}

const dropBar = (rect: DOMRect, after: boolean) => ({
  left: (after ? rect.right : rect.left) - HEADER_DROP_BAR_PX / 2,
  top: rect.top,
  width: HEADER_DROP_BAR_PX,
  height: rect.height
})

const buttonPositionAt = (rect: DOMRect, x: number) =>
  Math.min(
    Math.max(Math.floor((x - rect.left) / rect.width * buttonGroupCapacity()), 0),
    buttonGroupCapacity() - 1
  )

const buttonSlotRect = (rect: DOMRect, position: number) => ({
  left: rect.left + rect.width * position / buttonGroupCapacity(),
  top: rect.top,
  width: rect.width / buttonGroupCapacity(),
  height: rect.height
})

const wideCellRect = (index: number, rect: DOMRect) => ({
  left: index % gridColumns() === gridColumns() - 1 ? rect.left - rect.width : rect.left,
  top: rect.top,
  width: rect.width * 2,
  height: rect.height
})

const nearestSlotElement = (regionElement: HTMLElement, x: number, y: number) => {
  let nearest: HTMLElement | null = null
  let nearestDistanceX = Infinity
  let nearestDistanceY = Infinity

  for (const slotElement of regionElement.querySelectorAll<HTMLElement>(':scope > [data-header-slot]')) {
    const rect = slotElement.getBoundingClientRect()
    if (rect.width === 0 || slotElement.classList.contains('headerModuleDragging')) {
      continue
    }

    const distanceX = Math.max(rect.left - x, 0, x - rect.right)
    const distanceY = Math.max(rect.top - y, 0, y - rect.bottom)
    if (distanceY < nearestDistanceY || (distanceY === nearestDistanceY && distanceX < nearestDistanceX)) {
      nearest = slotElement
      nearestDistanceX = distanceX
      nearestDistanceY = distanceY
    }
  }

  return nearest
}

const findDropTarget = (id: HeaderModuleId, x: number, y: number) => {
  const layout = currentLayout()
  const wide = !isHeaderButton(id) && sizeOf(layout, id) === 'L'

  for (const element of document.elementsFromPoint(x, y)) {
    if (element.closest('#headerTray') !== null) {
      return trayDropTarget
    }

    const regionElement = element.closest<HTMLElement>('.headerRegion')
    if (regionElement === null) {
      continue
    }

    const region = regionElement.id as HeaderRegionId
    const isGrid = isHeaderGridRegion(region)
    const hoveredSlot = element.closest<HTMLElement>('[data-header-slot]')
    const hovered = hoveredSlot !== null && regionElement.contains(hoveredSlot)
    const cellElement = element.closest<HTMLElement>('.headerCell')

    if (isGrid && !hovered) {
      if (cellElement === null) {
        continue
      }
      const index = Number(cellElement.dataset.headerCell)
      const slot = layout.regions[region][index] ?? []
      const rect = cellElement.getBoundingClientRect()
      const position = buttonPositionAt(rect, x)
      return {
        region,
        index,
        position,
        join: isHeaderButton(id) && slot.some((member) => !layout.hidden.includes(member)) && canJoinSlot(slot, id),
        indicator: isHeaderButton(id) ? buttonSlotRect(rect, position) : wide ? wideCellRect(index, rect) : rect
      }
    }

    const slotElement = hovered ? hoveredSlot : nearestSlotElement(regionElement, x, y)
    if (slotElement === null) {
      return {
        region,
        index: layout.regions[region].length,
        position: 0,
        join: false,
        indicator: regionElement.getBoundingClientRect()
      }
    }

    const index = Number(slotElement.dataset.headerSlot)
    const rect = slotElement.getBoundingClientRect()
    const ratio = (x - rect.left) / rect.width
    const position = buttonPositionAt(rect, x)
    const indicator = isHeaderButton(id) ? buttonSlotRect(rect, position) : rect

    const inStackZone = ratio > HEADER_STACK_ZONE_START && ratio < HEADER_STACK_ZONE_END
    if (hovered && (isHeaderButton(id) || inStackZone) && canJoinSlot(layout.regions[region][index], id)) {
      return { region, index, position, join: true, indicator }
    }

    if (isGrid) {
      const cell = regionElement.querySelector(`:scope > [data-header-cell="${index}"]`)
      return {
        region,
        index,
        position,
        join: false,
        indicator: wide && cell !== null ? wideCellRect(index, cell.getBoundingClientRect()) : indicator
      }
    }

    const after = ratio >= 0.5
    return {
      region,
      index: after ? index + 1 : index,
      position: 0,
      join: false,
      indicator: dropBar(rect, after)
    }
  }

  return null
}

const showDropTarget = () => {
  const indicator = DOMCacheGetOrSet('headerDropIndicator')
  DOMCacheGetOrSet('headerTray').classList.toggle('headerTrayDropTarget', dropTarget?.region === null)

  if (dropTarget === null || dropTarget.indicator === null) {
    indicator.hidden = true
    return
  }

  indicator.style.left = `${dropTarget.indicator.left}px`
  indicator.style.top = `${dropTarget.indicator.top}px`
  indicator.style.width = `${dropTarget.indicator.width}px`
  indicator.style.height = `${dropTarget.indicator.height}px`
  indicator.hidden = false
}

const handlePointerDown = (event: PointerEvent) => {
  if (event.button !== 0) {
    return
  }

  const id = moduleFromEventTarget(event.target)
  if (id === null) {
    if (editing && event.target instanceof Element && event.target.closest('.headerRegion') !== null) {
      selectedModule = null
      renderHeaderLayout()
    }
    return
  }

  clearHoldTimer()
  activePointerId = event.pointerId
  pressedModule = id
  pointerStartX = event.clientX
  pointerStartY = event.clientY

  if (editing) {
    event.preventDefault()
    return
  }

  holdTimer = window.setTimeout(() => {
    holdTimer = undefined
    const before = DOMCacheGetOrSet(id).getBoundingClientRect()
    enterEditMode()
    const after = DOMCacheGetOrSet(id).getBoundingClientRect()
    pointerStartX += after.left - before.left
    pointerStartY += after.top - before.top

    if (activePointerId !== null) {
      beginDrag(id, activePointerId)
    }
  }, HEADER_EDIT_HOLD_MS)
}

const handlePointerMove = (event: PointerEvent) => {
  if (event.pointerId !== activePointerId) {
    return
  }

  const distanceX = event.clientX - pointerStartX
  const distanceY = event.clientY - pointerStartY
  const movedBeyondHoldDistance = Math.hypot(distanceX, distanceY) > HEADER_HOLD_CANCEL_DISTANCE_PX

  if (!editing) {
    if (movedBeyondHoldDistance) {
      clearHoldTimer()
      activePointerId = null
      pressedModule = null
    }
    return
  }

  const id = draggedModule ?? pressedModule
  if (id === null) {
    return
  }

  if (draggedModule === null) {
    if (!movedBeyondHoldDistance) {
      return
    }
    beginDrag(id, event.pointerId)
  }

  event.preventDefault()
  dragMoved ||= movedBeyondHoldDistance
  DOMCacheGetOrSet(id).style.translate = `${distanceX}px ${distanceY}px`
  dropTarget = findDropTarget(id, event.clientX, event.clientY)
  showDropTarget()
}

const handlePointerUp = (event: PointerEvent) => {
  if (event.pointerId !== activePointerId) {
    return
  }

  clearHoldTimer()
  const layout = currentLayout()

  if (draggedModule !== null) {
    const id = draggedModule
    const target = dropTarget
    const moved = dragMoved
    endDrag()

    if (!moved) {
      selectedModule = id
    } else if (target !== null && target.region === null) {
      hideModule(layout, id)
      if (selectedModule === id) {
        selectedModule = null
      }
    } else if (target !== null && target.region !== null) {
      moveModule(layout, id, target.region, target)
    }

    renderHeaderLayout()
  } else if (editing && pressedModule !== null) {
    const loadoutSlot = event.target instanceof Element
      ? event.target.closest<HTMLElement>('.headerLoadoutSlot')
      : null
    if (layout.hidden.includes(pressedModule)) {
      layout.hidden = layout.hidden.filter((hiddenId) => hiddenId !== pressedModule)
    } else if (loadoutSlot !== null && pressedModule === 'corruptionLoadoutsHeader') {
      openLoadoutIconPicker(
        event,
        loadoutSlot,
        layout.loadoutIcons.corruptionLoadoutsHeader,
        Object.keys(corrIcons) as Array<keyof Corruptions>,
        corruptionIconSrc
      )
    } else if (loadoutSlot !== null && pressedModule === 'ambrosiaLoadoutsHeader') {
      openLoadoutIconPicker(
        event,
        loadoutSlot,
        layout.loadoutIcons.ambrosiaLoadoutsHeader,
        ambrosiaUpgradeNames,
        blueberryIconSrc
      )
    } else {
      selectedModule = selectedModule === pressedModule ? null : pressedModule
    }

    renderHeaderLayout()
  }

  releasePointer(event.pointerId)
}

const handlePointerCancel = (event: PointerEvent) => {
  if (event.pointerId !== activePointerId) {
    return
  }

  clearHoldTimer()
  endDrag()
  releasePointer(event.pointerId)
}

const handlePointerLeave = (event: PointerEvent) => {
  if (editing || event.pointerId !== activePointerId) {
    return
  }

  clearHoldTimer()
  activePointerId = null
  pressedModule = null
}

const suppressModuleEvent = (event: Event) => {
  if (editing && event.target instanceof Element && event.target.closest('.headerModule') !== null) {
    event.stopPropagation()
    event.preventDefault()
  }
}

export const registerHeaderLayoutEditing = () => {
  const header = DOMCacheGetOrSet('mainHeader')
  header.addEventListener('pointerdown', handlePointerDown)
  header.addEventListener('pointermove', handlePointerMove)
  header.addEventListener('pointerup', handlePointerUp)
  header.addEventListener('pointercancel', handlePointerCancel)
  header.addEventListener('pointerleave', handlePointerLeave)
  header.addEventListener('click', suppressModuleEvent, true)
  header.addEventListener('mousemove', suppressModuleEvent, true)
  header.addEventListener('touchend', suppressModuleEvent)
  header.addEventListener('touchmove', (event) => {
    if (draggedModule !== null) {
      event.preventDefault()
    }
  }, { passive: false })
  header.addEventListener('dragstart', (event) => {
    if (moduleFromEventTarget(event.target) !== null) {
      event.preventDefault()
    }
  })
  header.addEventListener('contextmenu', (event) => {
    if (editing || holdTimer !== undefined) {
      event.preventDefault()
    }
  })

  for (const size of headerModuleSizes) {
    DOMCacheGetOrSet(`headerSize${size}`).addEventListener('click', () => {
      if (selectedModule !== null) {
        resizeModule(currentLayout(), selectedModule, size)
        renderHeaderLayout()
      }
    })
  }

  DOMCacheGetOrSet('headerHideModule').addEventListener('click', () => {
    if (selectedModule !== null) {
      hideModule(currentLayout(), selectedModule)
      selectedModule = null
      renderHeaderLayout()
    }
  })

  DOMCacheGetOrSet('headerLayoutReset').addEventListener('click', async () => {
    if (await Confirm(i18next.t('headerLayout.resetConfirm'))) {
      const key = isMobile ? 'mobile' : 'desktop'
      player.headerLayouts[key] = deepClone()(blankSave.headerLayouts[key])
      selectedModule = null
      renderHeaderLayout()
    }
  })

  DOMCacheGetOrSet('headerEditDone').addEventListener('click', exitEditMode)

  DOMCacheGetOrSet('rainbowAmbrosiaHeader').addEventListener('click', () => {
    const layout = currentLayout()
    const unlocked = rainbowAmbrosiaModuleIds.filter((id) => headerModuleUnlocks[id]())
    layout.rainbowAmbrosia = unlocked[(unlocked.indexOf(layout.rainbowAmbrosia) + 1) % unlocked.length]
    updateHeaderAmbrosia()
  })
}
