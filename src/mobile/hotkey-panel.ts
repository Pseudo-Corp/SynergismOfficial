import { DOMCacheGetOrSet } from '../Cache/DOM'
import { storageGetItem, storageSetItem } from '../events/storage-events'

const panelCorners = ['bottom-right', 'bottom-left', 'top-left', 'top-right'] as const
const panelMoveKeys = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'])
const PANEL_CORNER_STORAGE_KEY = 'mobileHotkeyPanelCorner'
const DRAG_THRESHOLD = 8
const SWIPE_PROJECTION_MS = 180
const SWIPE_VELOCITY = 0.6
const PANEL_GAP = 12

type PanelCorner = typeof panelCorners[number]
type PanelState = 'closed' | 'open' | 'docked'

interface PanelDrag {
  pointerId: number
  handle: HTMLElement
  element: HTMLElement
  startX: number
  startY: number
  startLeft: number
  startTop: number
  lastX: number
  lastY: number
  lastTime: number
  velocityX: number
  velocityY: number
  left: number
  top: number
  moved: boolean
}

const positionElement = (element: HTMLElement, left: number, top: number) => {
  element.style.left = '0'
  element.style.top = '0'
  element.style.right = 'auto'
  element.style.bottom = 'auto'
  element.style.transform = `translate3d(${Math.round(left)}px, ${Math.round(top)}px, 0)`
}

export const initializeMobileHotkeyPanel = (renderActions: () => void) => {
  const launcher = DOMCacheGetOrSet('mobileHotkeysOpen')
  const overlay = DOMCacheGetOrSet('mobileHotkeysOverlay')
  const card = DOMCacheGetOrSet('mobileHotkeysCard')
  const moveButton = DOMCacheGetOrSet('mobileHotkeysMove')
  const closeButton = DOMCacheGetOrSet('mobileHotkeysClose')
  const dockButton = DOMCacheGetOrSet('mobileHotkeysDock')
  const restoreButton = DOMCacheGetOrSet('mobileHotkeysRestore')
  const savedCorner = storageGetItem(PANEL_CORNER_STORAGE_KEY)
  let corner: PanelCorner = panelCorners.find((value) => value === savedCorner) ?? 'bottom-right'
  let state: PanelState = 'closed'
  let drag: PanelDrag | null = null
  let suppressClick = false

  const getBounds = () => {
    const viewport = window.visualViewport
    const viewportLeft = viewport?.offsetLeft ?? 0
    const viewportTop = viewport?.offsetTop ?? 0
    const width = viewport?.width ?? window.innerWidth
    const height = viewport?.height ?? window.innerHeight
    const style = getComputedStyle(overlay)
    const left = viewportLeft + Number.parseFloat(style.paddingLeft)
    const top = viewportTop + Number.parseFloat(style.paddingTop)
    const right = viewportLeft + width - Number.parseFloat(style.paddingRight)
    const bottom = viewportTop + height - Number.parseFloat(style.paddingBottom)

    overlay.style.setProperty('--mobile-hotkeys-available-width', `${Math.max(0, right - left)}px`)
    overlay.style.setProperty('--mobile-hotkeys-available-height', `${Math.max(0, bottom - top)}px`)
    return { left, top, right, bottom, viewportLeft, viewportRight: viewportLeft + width }
  }

  const layout = () => {
    if (drag !== null) return

    const bounds = getBounds()
    const onLeft = corner.endsWith('left')
    const onTop = corner.startsWith('top')
    const positionInCorner = (element: HTMLElement) => {
      positionElement(
        element,
        onLeft ? bounds.left : Math.max(bounds.left, bounds.right - element.offsetWidth),
        onTop ? bounds.top : Math.max(bounds.top, bounds.bottom - element.offsetHeight)
      )
    }

    overlay.dataset.side = onLeft ? 'left' : 'right'
    if (state === 'closed') {
      positionInCorner(launcher)
    } else if (state === 'open') {
      positionInCorner(card)
    } else {
      positionElement(
        card,
        onLeft ? bounds.viewportLeft - card.offsetWidth - PANEL_GAP : bounds.viewportRight + PANEL_GAP,
        onTop ? bounds.top : Math.max(bounds.top, bounds.bottom - card.offsetHeight)
      )
      positionElement(
        restoreButton,
        onLeft ? bounds.left - PANEL_GAP : bounds.right + PANEL_GAP - restoreButton.offsetWidth,
        onTop ? bounds.top : Math.max(bounds.top, bounds.bottom - restoreButton.offsetHeight)
      )
      restoreButton.textContent = onLeft ? '›' : '‹'
    }
  }

  const saveCorner = () => storageSetItem(PANEL_CORNER_STORAGE_KEY, corner)

  const setState = (nextState: PanelState, focus = true) => {
    const previousState = state
    state = nextState
    overlay.dataset.state = state
    launcher.hidden = state !== 'closed'
    launcher.setAttribute('aria-expanded', `${state !== 'closed'}`)
    card.inert = state !== 'open'
    if (state === 'open' && previousState !== 'open') renderActions()

    // Reveal the launcher or edge handle at its corner, without animating from an old viewport position.
    const revealedControl = state === 'closed' ? launcher : state === 'docked' ? restoreButton : null
    revealedControl?.classList.add('mobileHotkeysDragging')
    layout()
    if (revealedControl !== null) {
      revealedControl.getBoundingClientRect()
      revealedControl.classList.remove('mobileHotkeysDragging')
    }

    if (focus || card.contains(document.activeElement)) {
      const target = state === 'closed' ? launcher : state === 'docked' ? restoreButton : moveButton
      target.focus({ preventScroll: true })
    }
    card.setAttribute('aria-hidden', `${state !== 'open'}`)
    overlay.setAttribute('aria-hidden', `${state === 'closed'}`)
  }

  const cancelDrag = () => {
    const current = drag
    drag = null
    if (current !== null) {
      suppressClick ||= current.moved
      current.element.classList.remove('mobileHotkeysDragging')
      if (current.handle.hasPointerCapture(current.pointerId)) {
        current.handle.releasePointerCapture(current.pointerId)
      }
    }
    layout()
  }

  const startDrag = (event: PointerEvent, handle: HTMLElement) => {
    if (!event.isPrimary || event.button !== 0 || drag !== null) return

    suppressClick = false
    const element = state === 'closed' ? launcher : state === 'docked' ? restoreButton : card
    const rect = element.getBoundingClientRect()
    drag = {
      pointerId: event.pointerId,
      handle,
      element,
      startX: event.clientX,
      startY: event.clientY,
      startLeft: rect.left,
      startTop: rect.top,
      lastX: event.clientX,
      lastY: event.clientY,
      lastTime: event.timeStamp,
      velocityX: 0,
      velocityY: 0,
      left: rect.left,
      top: rect.top,
      moved: false
    }
    element.classList.add('mobileHotkeysDragging')
    positionElement(element, rect.left, rect.top)
    handle.focus({ preventScroll: true })
    handle.setPointerCapture(event.pointerId)
    event.preventDefault()
  }

  const moveDrag = (event: PointerEvent) => {
    if (drag === null || event.pointerId !== drag.pointerId) return

    const dx = event.clientX - drag.startX
    const dy = event.clientY - drag.startY
    drag.moved ||= Math.hypot(dx, dy) >= DRAG_THRESHOLD
    if (!drag.moved) return

    const elapsed = event.timeStamp - drag.lastTime
    if (elapsed > 0) {
      drag.velocityX = (event.clientX - drag.lastX) / elapsed
      drag.velocityY = (event.clientY - drag.lastY) / elapsed
    }
    drag.lastX = event.clientX
    drag.lastY = event.clientY
    drag.lastTime = event.timeStamp
    const bounds = getBounds()
    // Keep the gesture's full movement for docking and corner selection, but keep its control on screen.
    drag.left = drag.startLeft + dx
    drag.top = drag.startTop + dy
    positionElement(
      drag.element,
      Math.max(bounds.left, Math.min(bounds.right - drag.element.offsetWidth, drag.left)),
      Math.max(bounds.top, Math.min(bounds.bottom - drag.element.offsetHeight, drag.top))
    )
    event.preventDefault()
  }

  const finishDrag = (event: PointerEvent) => {
    if (drag === null || event.pointerId !== drag.pointerId) return
    const current = drag
    if (event.type !== 'pointerup' || !current.moved) {
      suppressClick = current.moved
      cancelDrag()
      return
    }

    const bounds = getBounds()
    const width = current.element.offsetWidth
    const height = current.element.offsetHeight
    const recent = event.timeStamp - current.lastTime < 100
    const vx = recent ? current.velocityX : 0
    const vy = recent ? current.velocityY : 0
    const dx = event.clientX - current.startX
    const dy = event.clientY - current.startY
    const wasOnLeft = corner.endsWith('left')
    const horizontalSwipe = Math.abs(dx) > 24 && Math.abs(vx) > SWIPE_VELOCITY && Math.abs(vx) > Math.abs(vy) * 1.25
    const beyondLeft = current.left < bounds.left - Math.min(60, width / 4)
    const beyondRight = current.left + width > bounds.right + Math.min(60, width / 4)
    const outwardSwipe = horizontalSwipe && (wasOnLeft ? vx < 0 : vx > 0)
    const movingOutward = (wasOnLeft ? dx < -DRAG_THRESHOLD : dx > DRAG_THRESHOLD) && Math.abs(dx) > Math.abs(dy)
    const onLeft = current.left + width / 2 + vx * SWIPE_PROJECTION_MS < (bounds.left + bounds.right) / 2
    const onTop = current.top + height / 2 + vy * SWIPE_PROJECTION_MS < (bounds.top + bounds.bottom) / 2
    let nextState = state
    let nextLeft = onLeft

    if (state === 'docked') {
      const inward = wasOnLeft ? dx : -dx
      if (inward > 24 && inward > Math.abs(dy) / 2) {
        nextState = 'open'
      } else {
        nextLeft = wasOnLeft
      }
    } else if (movingOutward && (beyondLeft || beyondRight || outwardSwipe)) {
      nextState = 'docked'
      nextLeft = beyondLeft || (!beyondRight && wasOnLeft)
    }

    corner = `${onTop ? 'top' : 'bottom'}-${nextLeft ? 'left' : 'right'}`
    suppressClick = true
    cancelDrag()
    saveCorner()
    setState(nextState, false)
  }

  for (const handle of [launcher, moveButton, restoreButton]) {
    handle.addEventListener('pointerdown', (event) => startDrag(event, handle))
    handle.addEventListener('lostpointercapture', finishDrag)
    handle.addEventListener('click', (event) => {
      if (suppressClick && event.detail !== 0) {
        suppressClick = false
        event.preventDefault()
        event.stopImmediatePropagation()
      }
    }, true)
    handle.addEventListener('keydown', (event) => {
      if (!panelMoveKeys.has(event.key)) return
      event.preventDefault()
      event.stopPropagation()
      const horizontal = event.key === 'ArrowLeft'
        ? 'left'
        : event.key === 'ArrowRight'
        ? 'right'
        : corner.split('-')[1]
      const vertical = event.key === 'ArrowUp' ? 'top' : event.key === 'ArrowDown' ? 'bottom' : corner.split('-')[0]
      corner = panelCorners.find((value) => value === `${vertical}-${horizontal}`)!
      saveCorner()
      layout()
    })
  }

  launcher.addEventListener('click', () => setState('open'))
  restoreButton.addEventListener('click', () => setState('open'))
  moveButton.addEventListener('click', () => {
    corner = panelCorners[(panelCorners.indexOf(corner) + 1) % panelCorners.length]
    saveCorner()
    layout()
  })
  closeButton.addEventListener('click', () => setState('closed'))
  dockButton.addEventListener('click', () => setState('docked'))
  overlay.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      cancelDrag()
      setState('closed')
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.stopPropagation()
    }
  })

  window.addEventListener('pointermove', moveDrag)
  window.addEventListener('pointerup', finishDrag)
  window.addEventListener('pointercancel', finishDrag)
  window.addEventListener('blur', cancelDrag)
  window.addEventListener('resize', cancelDrag)
  window.visualViewport?.addEventListener('resize', cancelDrag)
  window.visualViewport?.addEventListener('scroll', layout)
  const observer = new ResizeObserver(layout)
  observer.observe(card)
  setState('closed', false)
}
