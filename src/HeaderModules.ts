import i18next from 'i18next'
import { getAchievementReward } from './Achievements'
import { DOMCacheGetOrSet } from './Cache/DOM'
import {
  HEADER_BUTTON_GROUP_CAPACITY,
  HEADER_GRID_COLUMNS,
  HEADER_STACK_CAPACITY,
  headerGridRegion,
  type HeaderModuleId,
  type HeaderModuleSize,
  headerModuleSizes,
  type HeaderRegionId,
  headerRegionIds,
  isHeaderButton
} from './HeaderLayoutDefaults'
import { allDurableConsumables, getLotusTimeExpiresAt, getOwnedBells, getOwnedLotus } from './Login'
import { runes } from './Runes'
import { blankSave, deepClone, format, player } from './Synergism'
import type { HeaderLayout } from './types/Synergism'
import { CloseModal, Confirm, createFitties, resetFitText } from './UpdateHTML'
import { isMobile, timeRemainingMinutes } from './Utility'
import { Globals as G } from './Variables'

const ascensionStatsUnlocked = () =>
  Boolean(getAchievementReward('statTracker')) || player.highestSingularityCount > 0
const singularityStatsUnlocked = () => player.highestSingularityCount > 0

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
  coinHeader: () => true,
  diamondHeader: () => player.unlocks.prestige,
  offeringHeader: () => player.unlocks.prestige,
  quarkHeader: () => player.unlocks.reincarnate,
  mythosHeader: () => player.unlocks.transcend,
  mythosShardHeader: () => player.unlocks.transcend,
  particlesHeader: () => player.unlocks.reincarnate,
  obtainiumHeader: () => player.unlocks.reincarnate,
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

const HEADER_EDIT_HOLD_MS = 650
const HEADER_HOLD_CANCEL_DISTANCE_PX = 8
const HEADER_STACK_ZONE_START = 0.25
const HEADER_STACK_ZONE_END = 0.75
const HEADER_DROP_BAR_PX = 4

interface HeaderDropTarget {
  region: HeaderRegionId | null
  index: number
  member: number | null
  join: boolean
  indicator: { left: number; top: number; width: number; height: number } | null
}

const trayDropTarget: HeaderDropTarget = { region: null, index: 0, member: null, join: false, indicator: null }

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
const gridArea = (index: number) => `${Math.floor(index / gridColumns()) + 1} / ${(index % gridColumns()) + 1}`

const firstEmptyCell = (slots: HeaderModuleId[][], from: number) => {
  const index = slots.findIndex((slot, cell) => cell >= from && slot.length === 0)
  return index === -1 ? Math.max(slots.length, from) : index
}

const sizeOf = (layout: HeaderLayout, id: HeaderModuleId) => layout.sizes[id] ?? 'M'

const updateEditToolbar = (layout: HeaderLayout) => {
  const selected = selectedModule

  for (const size of headerModuleSizes) {
    const button = DOMCacheGetOrSet(`headerSize${size}`) as HTMLButtonElement
    button.disabled = selected === null || (size === 'XS' && !isHeaderButton(selected))
    button.setAttribute('aria-pressed', `${selected !== null && sizeOf(layout, selected) === size}`)
  }

  ;(DOMCacheGetOrSet('headerHideModule') as HTMLButtonElement).disabled = selected === null
}

export const renderHeaderLayout = () => {
  const layout = currentLayout()
  const trayModules: HTMLElement[] = []
  let refit = false

  for (const region of headerRegionIds) {
    const slotElements: HTMLElement[] = []
    const isGrid = region === headerGridRegion
    let lastCell = -1

    layout.regions[region].forEach((slot, index) => {
      const shown: HTMLElement[] = []
      for (const id of slot) {
        const element = DOMCacheGetOrSet(id)
        const size = sizeOf(layout, id)
        if (element.dataset.size !== size && element.classList.contains('fitText')) {
          resetFitText(element)
          refit = true
        }
        element.dataset.size = size
        element.classList.toggle('headerModuleSelected', id === selectedModule)
        element.style.gridArea = ''
        delete element.dataset.headerSlot

        if (layout.hidden.includes(id)) {
          trayModules.push(element)
        } else {
          shown.push(element)
        }
      }

      if (shown.length === 0) {
        return
      }

      let slotElement = shown[0]
      if (shown.length > 1) {
        slotElement = document.createElement('div')
        slotElement.className = 'headerStack'
        slotElement.classList.toggle('headerStackRow', slot.every((id) => sizeOf(layout, id) === 'XS'))
        slotElement.replaceChildren(...shown)
      }
      slotElement.dataset.headerSlot = `${index}`
      if (isGrid) {
        slotElement.style.gridArea = gridArea(index)
        lastCell = index
      }
      slotElements.push(slotElement)
    })

    const regionElement = DOMCacheGetOrSet(region)
    if (!isGrid) {
      regionElement.replaceChildren(...slotElements)
      continue
    }

    const cells: HTMLElement[] = []
    if (editing) {
      const cellCount = (Math.floor(lastCell / gridColumns()) + 2) * gridColumns()
      for (let index = 0; index < cellCount; index++) {
        const cell = document.createElement('div')
        cell.className = 'headerCell'
        cell.dataset.headerCell = `${index}`
        cell.style.gridArea = gridArea(index)
        cells.push(cell)
      }
    }
    regionElement.style.setProperty('--header-grid-columns', `${gridColumns()}`)
    regionElement.replaceChildren(...cells, ...slotElements)
  }

  DOMCacheGetOrSet('headerTray').replaceChildren(DOMCacheGetOrSet('headerTrayLabel'), ...trayModules)
  updateEditToolbar(layout)

  if (refit) {
    createFitties()
  }
}

export const updateHeaderModuleVisibility = () => {
  for (const id of Object.keys(headerModuleUnlocks) as HeaderModuleId[]) {
    DOMCacheGetOrSet(id).classList.toggle('headerModuleLocked', !headerModuleUnlocks[id]())
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

const findSlot = (layout: HeaderLayout, id: HeaderModuleId) => {
  for (const region of headerRegionIds) {
    const index = layout.regions[region].findIndex((slot) => slot.includes(id))
    if (index !== -1) {
      return { region, index, member: layout.regions[region][index].indexOf(id) }
    }
  }

  return null
}

const groupSizeFor = (layout: HeaderLayout, slot: HeaderModuleId[], id: HeaderModuleId) => {
  const buttonGroup = isHeaderButton(id)
    && slot.every((member) => isHeaderButton(member) && (slot.length === 1 || sizeOf(layout, member) === 'XS'))

  if (slot.includes(id)) {
    return buttonGroup && slot.length > 1 ? 'XS' : null
  }
  if (buttonGroup && slot.length < HEADER_BUTTON_GROUP_CAPACITY) {
    return 'XS'
  }
  if (slot.length < HEADER_STACK_CAPACITY) {
    return 'S'
  }
  return null
}

const detachModule = (layout: HeaderLayout, id: HeaderModuleId) => {
  const location = findSlot(layout, id)
  if (location === null) {
    return null
  }

  const slots = layout.regions[location.region]
  const slot = slots[location.index]
  if (slot.length === 1 && location.region === headerGridRegion) {
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
  if (location.region === headerGridRegion) {
    slots[firstEmptyCell(slots, location.index + 1)] = [id]
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
  splitOutModule(layout, id)
  layout.sizes[id] = size
}

const moveModule = (layout: HeaderLayout, id: HeaderModuleId, region: HeaderRegionId, target: HeaderDropTarget) => {
  const size = target.join ? groupSizeFor(layout, layout.regions[region][target.index], id) : null
  const removed = detachModule(layout, id)
  layout.hidden = layout.hidden.filter((hiddenId) => hiddenId !== id)

  let index = target.index
  let member = target.member
  if (removed !== null && removed.region === region) {
    if (removed.removedSlot && removed.index < index) {
      index -= 1
    }
    if (!removed.removedSlot && removed.index === index && member !== null && removed.member < member) {
      member -= 1
    }
  }

  const slots = layout.regions[region]
  if (size === null && region === headerGridRegion) {
    while (slots.length < index) {
      slots.push([])
    }
    const occupants = slots[index] ?? []
    slots[index] = [id]
    if (occupants.length > 0) {
      const swap = removed !== null && removed.region === region && removed.index !== index
        && slots[removed.index].length === 0
      slots[swap ? removed.index : firstEmptyCell(slots, index + 1)] = occupants
    }
    return
  }
  if (size === null) {
    slots.splice(index, 0, [id])
    return
  }

  const slot = slots[index]
  slot.splice(member ?? slot.length, 0, id)
  for (const grouped of slot) {
    layout.sizes[grouped] = size
  }
}

const enterEditMode = () => {
  if (editing) {
    return
  }

  editing = true
  CloseModal()

  for (const element of document.querySelectorAll<HTMLElement>('.headerProgress')) {
    element.dataset.placeholder = i18next.t(`headerLayout.modules.${element.id}`)
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

const dropBar = (rect: DOMRect, after: boolean, vertical: boolean) =>
  vertical
    ? {
      left: rect.left,
      top: (after ? rect.bottom : rect.top) - HEADER_DROP_BAR_PX / 2,
      width: rect.width,
      height: HEADER_DROP_BAR_PX
    }
    : {
      left: (after ? rect.right : rect.left) - HEADER_DROP_BAR_PX / 2,
      top: rect.top,
      width: HEADER_DROP_BAR_PX,
      height: rect.height
    }

const findDropTarget = (id: HeaderModuleId, x: number, y: number) => {
  const layout = currentLayout()

  for (const element of document.elementsFromPoint(x, y)) {
    if (element.closest('#headerTray') !== null) {
      return trayDropTarget
    }

    const regionElement = element.closest<HTMLElement>('.headerRegion')
    if (regionElement === null) {
      continue
    }

    const region = regionElement.id as HeaderRegionId
    const isGrid = region === headerGridRegion
    const vertical = region === 'challengeProgress'
    const slotElement = element.closest<HTMLElement>('[data-header-slot]')
    const cellElement = element.closest<HTMLElement>('.headerCell')

    if (isGrid && (slotElement === null || !regionElement.contains(slotElement))) {
      if (cellElement === null) {
        continue
      }
      return {
        region,
        index: Number(cellElement.dataset.headerCell),
        member: null,
        join: false,
        indicator: cellElement.getBoundingClientRect()
      }
    }

    if (slotElement === null || !regionElement.contains(slotElement)) {
      const last = regionElement.lastElementChild
      return {
        region,
        index: layout.regions[region].length,
        member: null,
        join: false,
        indicator: last === null
          ? regionElement.getBoundingClientRect()
          : dropBar(last.getBoundingClientRect(), true, vertical)
      }
    }

    const index = Number(slotElement.dataset.headerSlot)
    const slot = layout.regions[region][index]
    const memberElement = element.closest<HTMLElement>('.headerModule')

    if (
      slotElement.classList.contains('headerStackRow') && memberElement !== null
      && slotElement.contains(memberElement) && groupSizeFor(layout, slot, id) === 'XS'
    ) {
      const memberRect = memberElement.getBoundingClientRect()
      const after = x >= memberRect.left + memberRect.width / 2
      return {
        region,
        index,
        member: slot.indexOf(memberElement.id as HeaderModuleId) + (after ? 1 : 0),
        join: true,
        indicator: dropBar(memberRect, after, false)
      }
    }

    const rect = slotElement.getBoundingClientRect()
    const ratio = vertical ? (y - rect.top) / rect.height : (x - rect.left) / rect.width

    if (ratio > HEADER_STACK_ZONE_START && ratio < HEADER_STACK_ZONE_END && groupSizeFor(layout, slot, id) !== null) {
      return { region, index, member: null, join: true, indicator: rect }
    }

    if (isGrid) {
      return { region, index, member: null, join: false, indicator: rect }
    }

    const after = ratio >= 0.5
    return {
      region,
      index: after ? index + 1 : index,
      member: null,
      join: false,
      indicator: dropBar(rect, after, vertical)
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
    if (layout.hidden.includes(pressedModule)) {
      layout.hidden = layout.hidden.filter((hiddenId) => hiddenId !== pressedModule)
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
}
