import i18next from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import {
  buyResearch,
  canBuyResearch,
  isResearchMaxed,
  isResearchUnlocked,
  researchData,
  researchDescriptions
} from './Research'
import { player } from './Synergism'

type ResearchViewStatus = 'locked' | 'maxed' | 'available' | 'inProgress' | 'unaffordable'

interface ResearchTreePosition {
  x: number
  y: number
}

interface ResearchTreeEdge {
  from: number
  to: number
}

interface ResearchTreeLayout {
  edges: ResearchTreeEdge[]
  positions: Record<number, ResearchTreePosition>
}

interface ResearchMapTransform {
  scale: number
  x: number
  y: number
}

interface PointerPosition {
  x: number
  y: number
}

interface ResearchMapViewportBounds extends PointerPosition {
  width: number
  height: number
}

interface ResearchMapAnimation {
  from: ResearchMapTransform
  startedAt: number
  to: ResearchMapTransform
}

type ResearchMapGesture = {
  kind: 'pan'
  pointer: PointerPosition
  transform: ResearchMapTransform
} | {
  kind: 'pinch'
  distance: number
  transform: ResearchMapTransform
  worldPoint: PointerPosition
}

const RESEARCH_COUNT = 200
const RESEARCHES_PER_TIER = 25
const RESEARCH_TIER_COLUMNS = 4
const RESEARCH_TIER_LEVEL_COUNTS = [1, 4, 7, 8, 4, 1] as const
const RESEARCH_NODE_SIZE = 72
const RESEARCH_TIER_WIDTH = 1000
const RESEARCH_TIER_HEIGHT = 1040
const RESEARCH_TIER_GAP_X = 180
const RESEARCH_TIER_GAP_Y = 260
const RESEARCH_MAP_PADDING = 180
const RESEARCH_NODE_VERTICAL_GAP = 110
const RESEARCH_MAP_MIN_SCALE = 0.05
const RESEARCH_MAP_MAX_SCALE = 2.5
const RESEARCH_MAP_DEFAULT_SCALE = 0.68
const RESEARCH_MAP_ANIMATION_DURATION = 260
const RESEARCH_VIEW_REFRESH_INTERVAL = 300
const RESEARCH_VIEW_INTERACTION_COOLDOWN = 150
const RESEARCH_CANVAS_PIXEL_RATIO = 1

const RESEARCH_MAP_WIDTH = RESEARCH_MAP_PADDING * 2
  + RESEARCH_TIER_COLUMNS * RESEARCH_TIER_WIDTH
  + (RESEARCH_TIER_COLUMNS - 1) * RESEARCH_TIER_GAP_X
const RESEARCH_MAP_HEIGHT = RESEARCH_MAP_PADDING * 2
  + 2 * RESEARCH_TIER_HEIGHT
  + RESEARCH_TIER_GAP_Y

const researchStatusKeys: Record<ResearchViewStatus, string> = {
  locked: 'researches.status.locked',
  maxed: 'researches.status.maxed',
  available: 'researches.status.available',
  inProgress: 'researches.status.inProgress',
  unaffordable: 'researches.status.unaffordable'
}

const researchMapStatusColors: Record<ResearchViewStatus, string> = {
  locked: '#3d4b49',
  maxed: '#54c66c',
  available: '#d5c342',
  inProgress: '#b456c8',
  unaffordable: '#477d75'
}

const researchButtons: Array<HTMLButtonElement | undefined> = []
const researchIcons: Array<HTMLImageElement | undefined> = []
const researchDirectoryRows: Array<HTMLButtonElement | undefined> = []
const researchDirectoryNames: Array<HTMLElement | undefined> = []
const researchDirectoryLevels: Array<HTMLElement | undefined> = []
const researchDirectoryStatuses: Array<HTMLElement | undefined> = []
const researchNames: string[] = []
const researchStatuses: Array<ResearchViewStatus | undefined> = []
const researchLevels: Array<number | undefined> = []
const activeMapPointers = new Map<number, PointerPosition>()

const mapTransform: ResearchMapTransform = {
  scale: RESEARCH_MAP_DEFAULT_SCALE,
  x: 0,
  y: 0
}

const mapViewportBounds: ResearchMapViewportBounds = {
  x: 0,
  y: 0,
  width: 0,
  height: 0
}

const renderedMapTransform: ResearchMapTransform = { ...mapTransform }

let selectedResearchIndex = 1
let researchViewInitialized = false
let researchMapInitialized = false
let researchMapGesture: ResearchMapGesture | null = null
let researchMapAnimation: ResearchMapAnimation | null = null
let researchMapRenderFrame: number | undefined
let researchTreeCanvas: HTMLCanvasElement
let researchTreeContext: CanvasRenderingContext2D
let researchPointerCandidate = 0
let researchPointerOrigin: PointerPosition | null = null
let researchPointerMoved = false
let hoveredResearchIndex = 0
let renderedMapZoomPercent = -1
let renderedAutoTargetIndex = 0
let lastResearchViewRefresh = 0
let lastResearchMapInteraction = 0

const clamp = (value: number, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, value))

const mapIndexBetweenLevels = (index: number, sourceCount: number, targetCount: number) => {
  if (sourceCount === 1 || targetCount === 1) {
    return 0
  }

  return Math.round(index * (targetCount - 1) / (sourceCount - 1))
}

const createResearchTreeLayout = (): ResearchTreeLayout => {
  const positions: Record<number, ResearchTreePosition> = {}
  const edgeKeys = new Set<string>()
  const edges: ResearchTreeEdge[] = []

  const addEdge = (from: number, to: number) => {
    const key = `${from}:${to}`
    if (!edgeKeys.has(key)) {
      edgeKeys.add(key)
      edges.push({ from, to })
    }
  }

  for (let tier = 0; tier < RESEARCH_COUNT / RESEARCHES_PER_TIER; tier++) {
    const mapRow = Math.floor(tier / RESEARCH_TIER_COLUMNS)
    const tierInRow = tier % RESEARCH_TIER_COLUMNS
    const travelsRight = mapRow % 2 === 0
    const mapColumn = travelsRight ? tierInRow : RESEARCH_TIER_COLUMNS - 1 - tierInRow
    const tierX = RESEARCH_MAP_PADDING + mapColumn * (RESEARCH_TIER_WIDTH + RESEARCH_TIER_GAP_X)
    const tierY = RESEARCH_MAP_PADDING + mapRow * (RESEARCH_TIER_HEIGHT + RESEARCH_TIER_GAP_Y)
    let researchIndex = tier * RESEARCHES_PER_TIER + 1
    let previousLevel: number[] = []

    for (let level = 0; level < RESEARCH_TIER_LEVEL_COUNTS.length; level++) {
      const count = RESEARCH_TIER_LEVEL_COUNTS[level]
      const levelProgress = level / (RESEARCH_TIER_LEVEL_COUNTS.length - 1)
      const localX = RESEARCH_NODE_SIZE + levelProgress * (RESEARCH_TIER_WIDTH - 2 * RESEARCH_NODE_SIZE)
      const x = tierX + (travelsRight ? localX : RESEARCH_TIER_WIDTH - localX)
      const currentLevel: number[] = []

      for (let branch = 0; branch < count; branch++) {
        const y = tierY + RESEARCH_TIER_HEIGHT / 2
          + (branch - (count - 1) / 2) * RESEARCH_NODE_VERTICAL_GAP
        const currentResearch = researchIndex++
        currentLevel.push(currentResearch)
        positions[currentResearch] = { x, y }
      }

      if (previousLevel.length > 0) {
        for (let branch = 0; branch < currentLevel.length; branch++) {
          const parentIndex = mapIndexBetweenLevels(branch, currentLevel.length, previousLevel.length)
          addEdge(previousLevel[parentIndex], currentLevel[branch])
        }

        for (let branch = 0; branch < previousLevel.length; branch++) {
          const childIndex = mapIndexBetweenLevels(branch, previousLevel.length, currentLevel.length)
          addEdge(previousLevel[branch], currentLevel[childIndex])
        }
      }

      previousLevel = currentLevel
    }
  }

  for (let tier = 0; tier < RESEARCH_COUNT / RESEARCHES_PER_TIER - 1; tier++) {
    addEdge((tier + 1) * RESEARCHES_PER_TIER, (tier + 1) * RESEARCHES_PER_TIER + 1)
  }

  return { edges, positions }
}

const researchTreeLayout = createResearchTreeLayout()

export const getResearchGridId = (index: number) => {
  const tier = Math.ceil(index / RESEARCHES_PER_TIER)
  const position = (index - 1) % RESEARCHES_PER_TIER + 1
  return `${tier}x${position}`
}

const getResearchName = (index: number) => {
  const translatedDescription = i18next.t(`researches.descriptions.${index}`)
    .replace(/^\[[^\]]+\]\s*/, '')
  const wrapper = document.createElement('div')
  wrapper.innerHTML = translatedDescription
  wrapper.querySelectorAll('br').forEach((lineBreak) => lineBreak.replaceWith(' '))
  return (wrapper.textContent ?? translatedDescription).replace(/\s+/g, ' ').trim()
}

const getResearchStatus = (index: number): ResearchViewStatus => {
  if (!isResearchUnlocked(index)) {
    return 'locked'
  }
  if (isResearchMaxed(index)) {
    return 'maxed'
  }
  if (canBuyResearch(index)) {
    return 'available'
  }
  return player.researches[index] > 0 ? 'inProgress' : 'unaffordable'
}

const initializeResearchTreeCanvas = () => {
  researchTreeCanvas = DOMCacheGetOrSet('researchTreeCanvas') as HTMLCanvasElement
  const context = researchTreeCanvas.getContext('2d', { alpha: true, desynchronized: true })
  if (context === null) {
    throw new TypeError('A canvas context could not be created for the research map.')
  }
  researchTreeContext = context
}

const createResearchMapNodes = () => {
  const mapCanvas = DOMCacheGetOrSet('researchMapCanvas')
  const sourceTable = mapCanvas.querySelector<HTMLTableElement>('#researchtable')
  if (sourceTable === null) {
    throw new TypeError('Research table was not found while building the research map.')
  }

  const sourceButtons = sourceTable.querySelectorAll<HTMLButtonElement>('button[id^="res"]')
  const nodeLayer = document.createElement('div')
  nodeLayer.id = 'researchtable'
  nodeLayer.className = 'researchTreeNodeSources'
  nodeLayer.hidden = true

  for (const button of sourceButtons) {
    const index = Number(button.id.slice(3))
    const image = button.querySelector<HTMLImageElement>('img')
    button.tabIndex = -1
    button.setAttribute('aria-hidden', 'true')
    if (image !== null) {
      image.loading = 'eager'
      image.decoding = 'async'
      image.addEventListener('load', requestResearchMapRender)
      researchIcons[index] = image
    }
    nodeLayer.appendChild(button)
    researchButtons[index] = button
  }

  sourceTable.replaceWith(nodeLayer)
}

const createResearchDirectory = () => {
  const list = DOMCacheGetOrSet('researchDirectoryList')
  const fragment = document.createDocumentFragment()

  for (let index = 1; index <= RESEARCH_COUNT; index++) {
    const row = document.createElement('button')
    const icon = researchIcons[index]?.cloneNode(false) as
      | HTMLImageElement
      | undefined
    const id = document.createElement('span')
    const nameColumn = document.createElement('span')
    const name = document.createElement('span')
    const level = document.createElement('span')
    const status = document.createElement('span')
    const statusDot = document.createElement('span')

    if (icon === undefined) {
      throw new TypeError(`Research ${index} icon was not found while building the research directory.`)
    }

    row.type = 'button'
    row.className = 'researchDirectoryRow'
    row.dataset.research = `${index}`
    row.setAttribute('aria-selected', 'false')
    row.addEventListener('click', () => selectResearch(index, true))

    icon.className = 'researchDirectoryIcon'
    icon.alt = ''
    icon.loading = 'lazy'
    id.className = 'researchDirectoryId'
    id.textContent = getResearchGridId(index)
    nameColumn.className = 'researchDirectoryNameColumn'
    name.className = 'researchDirectoryName'
    level.className = 'researchDirectoryLevel'
    status.className = 'researchStatus'
    statusDot.className = 'researchStatusDot'
    statusDot.setAttribute('aria-hidden', 'true')

    nameColumn.append(name, level)
    status.append(statusDot)
    row.append(icon, id, nameColumn, status)
    fragment.appendChild(row)

    researchDirectoryRows[index] = row
    researchDirectoryNames[index] = name
    researchDirectoryLevels[index] = level
    researchDirectoryStatuses[index] = status
  }

  list.appendChild(fragment)
}

const renderResearchNames = () => {
  for (let index = 1; index <= RESEARCH_COUNT; index++) {
    const name = getResearchName(index)
    researchNames[index] = name
    const nameElement = researchDirectoryNames[index]
    const row = researchDirectoryRows[index]

    if (nameElement !== undefined) {
      nameElement.textContent = name
      nameElement.title = name
    }
    if (row !== undefined) {
      row.title = name
    }
  }

  renderSelectedResearch()
}

const renderSelectedResearch = () => {
  if (!researchViewInitialized) {
    return
  }

  const id = getResearchGridId(selectedResearchIndex)
  const sourceIcon = researchIcons[selectedResearchIndex]
  const selectedIcon = DOMCacheGetOrSet('researchSelectedIcon') as HTMLImageElement

  DOMCacheGetOrSet('researchSelectedId').textContent = i18next.t('researches.researchId', { id })
  DOMCacheGetOrSet('researchSelectedName').textContent = researchNames[selectedResearchIndex] ?? ''
  if (sourceIcon != null) {
    selectedIcon.src = sourceIcon.src
  }
}

const updateResearchMapViewportBounds = () => {
  const viewport = DOMCacheGetOrSet('researchMapViewport')
  const bounds = viewport.getBoundingClientRect()
  mapViewportBounds.x = bounds.left
  mapViewportBounds.y = bounds.top
  mapViewportBounds.width = bounds.width
  mapViewportBounds.height = bounds.height
}

const resizeResearchTreeCanvas = () => {
  const width = Math.max(1, Math.round(mapViewportBounds.width * RESEARCH_CANVAS_PIXEL_RATIO))
  const height = Math.max(1, Math.round(mapViewportBounds.height * RESEARCH_CANVAS_PIXEL_RATIO))
  if (researchTreeCanvas.width !== width || researchTreeCanvas.height !== height) {
    researchTreeCanvas.width = width
    researchTreeCanvas.height = height
  }
}

const markResearchMapInteraction = () => {
  lastResearchMapInteraction = performance.now()
  DOMCacheGetOrSet('researchMapViewport').classList.add('researchMapInteracting')
}

const areMaxedResearchesHidden = () => DOMCacheGetOrSet('researchWorkspace').classList.contains('hideMaxedResearches')

const constrainResearchMap = () => {
  const { width, height } = mapViewportBounds
  if (width === 0 || height === 0) {
    return
  }

  const scaledWidth = RESEARCH_MAP_WIDTH * mapTransform.scale
  const scaledHeight = RESEARCH_MAP_HEIGHT * mapTransform.scale
  const horizontalMargin = Math.min(220, width * 0.35)
  const verticalMargin = Math.min(220, height * 0.35)

  if (scaledWidth <= width) {
    mapTransform.x = (width - scaledWidth) / 2
  } else {
    mapTransform.x = clamp(
      mapTransform.x,
      width - scaledWidth - horizontalMargin,
      horizontalMargin
    )
  }

  if (scaledHeight <= height) {
    mapTransform.y = (height - scaledHeight) / 2
  } else {
    mapTransform.y = clamp(
      mapTransform.y,
      height - scaledHeight - verticalMargin,
      verticalMargin
    )
  }
}

const drawRoundedRectangle = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  const cornerRadius = Math.min(radius, width / 2, height / 2)
  context.beginPath()
  context.moveTo(x + cornerRadius, y)
  context.lineTo(x + width - cornerRadius, y)
  context.quadraticCurveTo(x + width, y, x + width, y + cornerRadius)
  context.lineTo(x + width, y + height - cornerRadius)
  context.quadraticCurveTo(x + width, y + height, x + width - cornerRadius, y + height)
  context.lineTo(x + cornerRadius, y + height)
  context.quadraticCurveTo(x, y + height, x, y + height - cornerRadius)
  context.lineTo(x, y + cornerRadius)
  context.quadraticCurveTo(x, y, x + cornerRadius, y)
  context.closePath()
}

const isResearchMapAreaVisible = (left: number, top: number, right: number, bottom: number) => {
  const { scale, x, y } = renderedMapTransform
  const padding = RESEARCH_NODE_SIZE
  const visibleLeft = -x / scale - padding
  const visibleTop = -y / scale - padding
  const visibleRight = (mapViewportBounds.width - x) / scale + padding
  const visibleBottom = (mapViewportBounds.height - y) / scale + padding
  return right >= visibleLeft && left <= visibleRight && bottom >= visibleTop && top <= visibleBottom
}

const drawResearchConnections = (context: CanvasRenderingContext2D, hideMaxed: boolean) => {
  const scale = renderedMapTransform.scale
  context.lineCap = 'round'
  context.lineWidth = 2 / scale

  for (const edge of researchTreeLayout.edges) {
    const from = researchTreeLayout.positions[edge.from]
    const to = researchTreeLayout.positions[edge.to]
    if (
      !isResearchMapAreaVisible(
        Math.min(from.x, to.x),
        Math.min(from.y, to.y),
        Math.max(from.x, to.x),
        Math.max(from.y, to.y)
      )
    ) {
      continue
    }

    const targetStatus = researchStatuses[edge.to]
    if (targetStatus === 'locked') {
      context.strokeStyle = '#3d4b49'
      context.globalAlpha = 0.35
    } else if (player.researches[edge.to] > 0) {
      context.strokeStyle = '#4fbe68'
      context.globalAlpha = hideMaxed ? 0.12 : 0.8
    } else if (targetStatus === 'available') {
      context.strokeStyle = '#e0c84b'
      context.globalAlpha = 0.85
    } else {
      context.strokeStyle = '#477d75'
      context.globalAlpha = 0.62
    }

    const deltaX = to.x - from.x
    const deltaY = to.y - from.y
    context.beginPath()
    context.moveTo(from.x, from.y)
    if (Math.abs(deltaX) >= Math.abs(deltaY)) {
      context.bezierCurveTo(
        from.x + deltaX * 0.45,
        from.y,
        to.x - deltaX * 0.45,
        to.y,
        to.x,
        to.y
      )
    } else {
      context.bezierCurveTo(
        from.x,
        from.y + deltaY * 0.45,
        to.x,
        to.y - deltaY * 0.45,
        to.x,
        to.y
      )
    }
    context.stroke()
  }
}

const drawResearchNode = (context: CanvasRenderingContext2D, index: number, hideMaxed: boolean) => {
  const position = researchTreeLayout.positions[index]
  const status = researchStatuses[index] ?? 'unaffordable'
  if (hideMaxed && status === 'maxed') {
    return
  }

  const halfSize = RESEARCH_NODE_SIZE / 2
  if (
    !isResearchMapAreaVisible(
      position.x - halfSize,
      position.y - halfSize,
      position.x + halfSize,
      position.y + halfSize + 24
    )
  ) {
    return
  }

  const isSelected = index === selectedResearchIndex
  const isAutoTarget = player.autoResearchToggle && player.autoResearch === index
  const isHovered = index === hoveredResearchIndex
  const scale = renderedMapTransform.scale
  const x = position.x - halfSize
  const y = position.y - halfSize
  const borderWidth = 2 / scale

  context.globalAlpha = status === 'locked' ? 0.38 : status === 'unaffordable' ? 0.72 : 1
  drawRoundedRectangle(context, x, y, RESEARCH_NODE_SIZE, RESEARCH_NODE_SIZE, 7)
  context.fillStyle = '#082421'
  context.fill()
  context.lineWidth = borderWidth
  context.strokeStyle = researchMapStatusColors[status]
  context.stroke()

  let iconBackground = '#000'
  if (status === 'maxed') {
    iconBackground = 'green'
  } else if (player.researches[index] > 0) {
    iconBackground = 'purple'
  }
  if (isAutoTarget) {
    iconBackground = 'orange'
  }
  context.fillStyle = iconBackground
  context.fillRect(position.x - 31, position.y - 31, 62, 62)

  const image = researchIcons[index]
  if (image?.complete && image.naturalWidth > 0) {
    context.imageSmoothingEnabled = false
    context.drawImage(image, position.x - 31, position.y - 31, 62, 62)
  }

  context.globalAlpha = 1
  if (isSelected || isAutoTarget || isHovered) {
    const outlineOffset = 4 / scale
    drawRoundedRectangle(
      context,
      x - outlineOffset,
      y - outlineOffset,
      RESEARCH_NODE_SIZE + 2 * outlineOffset,
      RESEARCH_NODE_SIZE + 2 * outlineOffset,
      9
    )
    context.lineWidth = 3 / scale
    context.strokeStyle = isSelected ? '#d8e65c' : isAutoTarget ? 'orange' : '#79cbbd'
    context.stroke()
  }

  if (scale >= 0.28) {
    const label = getResearchGridId(index)
    context.font = '700 13px system-ui, sans-serif'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    const labelWidth = Math.max(42, context.measureText(label).width + 12)
    const labelX = position.x - labelWidth / 2
    const labelY = position.y + halfSize + 5
    drawRoundedRectangle(context, labelX, labelY, labelWidth, 20, 10)
    context.fillStyle = '#061c1ae6'
    context.fill()
    context.lineWidth = 1 / scale
    context.strokeStyle = '#477d75'
    context.stroke()
    context.fillStyle = '#c7e4df'
    context.fillText(label, position.x, labelY + 10)
  }
}

const drawResearchMap = () => {
  if (mapViewportBounds.width === 0 || mapViewportBounds.height === 0) {
    return
  }

  const context = researchTreeContext
  context.setTransform(1, 0, 0, 1, 0, 0)
  context.clearRect(0, 0, researchTreeCanvas.width, researchTreeCanvas.height)
  context.setTransform(
    RESEARCH_CANVAS_PIXEL_RATIO * renderedMapTransform.scale,
    0,
    0,
    RESEARCH_CANVAS_PIXEL_RATIO * renderedMapTransform.scale,
    RESEARCH_CANVAS_PIXEL_RATIO * renderedMapTransform.x,
    RESEARCH_CANVAS_PIXEL_RATIO * renderedMapTransform.y
  )
  const hideMaxed = areMaxedResearchesHidden()
  drawResearchConnections(context, hideMaxed)
  for (let index = 1; index <= RESEARCH_COUNT; index++) {
    drawResearchNode(context, index, hideMaxed)
  }
  context.globalAlpha = 1
}

const updateRenderedResearchMapTransform = (timestamp: number) => {
  if (researchMapAnimation === null) {
    return false
  }

  const progress = clamp(
    (timestamp - researchMapAnimation.startedAt) / RESEARCH_MAP_ANIMATION_DURATION,
    0,
    1
  )
  const easedProgress = 1 - Math.pow(1 - progress, 3)
  renderedMapTransform.scale = researchMapAnimation.from.scale
    + (researchMapAnimation.to.scale - researchMapAnimation.from.scale) * easedProgress
  renderedMapTransform.x = researchMapAnimation.from.x
    + (researchMapAnimation.to.x - researchMapAnimation.from.x) * easedProgress
  renderedMapTransform.y = researchMapAnimation.from.y
    + (researchMapAnimation.to.y - researchMapAnimation.from.y) * easedProgress

  if (progress === 1) {
    researchMapAnimation = null
  }
  return progress < 1
}

const renderResearchMapFrame = (timestamp: number) => {
  researchMapRenderFrame = undefined
  const animationContinues = updateRenderedResearchMapTransform(timestamp)
  drawResearchMap()
  const zoomPercent = Math.round(renderedMapTransform.scale * 100)
  if (renderedMapZoomPercent !== zoomPercent) {
    renderedMapZoomPercent = zoomPercent
    DOMCacheGetOrSet('researchZoomLevel').textContent = `${zoomPercent}%`
  }
  if (animationContinues) {
    requestResearchMapRender()
  }
}

function requestResearchMapRender () {
  if (researchMapRenderFrame === undefined) {
    researchMapRenderFrame = requestAnimationFrame(renderResearchMapFrame)
  }
}

const cancelResearchMapAnimation = () => {
  if (researchMapAnimation === null) {
    return
  }
  researchMapAnimation = null
  Object.assign(mapTransform, renderedMapTransform)
}

const applyResearchMapTransform = (animate = false) => {
  constrainResearchMap()
  if (animate) {
    researchMapAnimation = {
      from: { ...renderedMapTransform },
      startedAt: performance.now(),
      to: { ...mapTransform }
    }
  } else {
    researchMapAnimation = null
    Object.assign(renderedMapTransform, mapTransform)
  }
  requestResearchMapRender()
}

const zoomResearchMapAt = (scale: number, viewportX: number, viewportY: number, animate = false) => {
  cancelResearchMapAnimation()
  const nextScale = clamp(scale, RESEARCH_MAP_MIN_SCALE, RESEARCH_MAP_MAX_SCALE)
  const worldX = (viewportX - mapTransform.x) / mapTransform.scale
  const worldY = (viewportY - mapTransform.y) / mapTransform.scale

  mapTransform.scale = nextScale
  mapTransform.x = viewportX - worldX * nextScale
  mapTransform.y = viewportY - worldY * nextScale
  applyResearchMapTransform(animate)
}

const zoomResearchMapFromCenter = (scale: number) => {
  updateResearchMapViewportBounds()
  zoomResearchMapAt(scale, mapViewportBounds.width / 2, mapViewportBounds.height / 2, true)
}

export const fitResearchMap = () => {
  updateResearchMapViewportBounds()
  const { width, height } = mapViewportBounds
  if (width === 0 || height === 0) {
    return
  }

  cancelResearchMapAnimation()
  mapTransform.scale = clamp(
    Math.min((width - 24) / RESEARCH_MAP_WIDTH, (height - 24) / RESEARCH_MAP_HEIGHT),
    RESEARCH_MAP_MIN_SCALE,
    RESEARCH_MAP_MAX_SCALE
  )
  mapTransform.x = (width - RESEARCH_MAP_WIDTH * mapTransform.scale) / 2
  mapTransform.y = (height - RESEARCH_MAP_HEIGHT * mapTransform.scale) / 2
  applyResearchMapTransform(true)
}

export const centerResearchOnMap = (index: number) => {
  updateResearchMapViewportBounds()
  const { width, height } = mapViewportBounds
  const position = researchTreeLayout.positions[index]
  if (width === 0 || height === 0 || position === undefined) {
    return
  }

  cancelResearchMapAnimation()
  mapTransform.scale = Math.max(mapTransform.scale, RESEARCH_MAP_DEFAULT_SCALE)
  mapTransform.x = width / 2 - position.x * mapTransform.scale
  mapTransform.y = height / 2 - position.y * mapTransform.scale
  applyResearchMapTransform(true)
}

const getPointerMidpoint = (pointers: PointerPosition[]) => ({
  x: (pointers[0].x + pointers[1].x) / 2,
  y: (pointers[0].y + pointers[1].y) / 2
})

const getPointerDistance = (pointers: PointerPosition[]) =>
  Math.hypot(
    pointers[1].x - pointers[0].x,
    pointers[1].y - pointers[0].y
  )

const getViewportPointerPosition = (event: PointerEvent) => ({
  x: event.clientX - mapViewportBounds.x,
  y: event.clientY - mapViewportBounds.y
})

const getResearchAtViewportPosition = (position: PointerPosition) => {
  const worldX = (position.x - renderedMapTransform.x) / renderedMapTransform.scale
  const worldY = (position.y - renderedMapTransform.y) / renderedMapTransform.scale
  const hitRadius = Math.max(RESEARCH_NODE_SIZE / 2, 16 / renderedMapTransform.scale)
  const hideMaxed = areMaxedResearchesHidden()

  for (let index = 1; index <= RESEARCH_COUNT; index++) {
    if (hideMaxed && researchStatuses[index] === 'maxed') {
      continue
    }
    const nodePosition = researchTreeLayout.positions[index]
    if (Math.abs(worldX - nodePosition.x) <= hitRadius && Math.abs(worldY - nodePosition.y) <= hitRadius) {
      return index
    }
  }
  return 0
}

const updateHoveredResearch = (position: PointerPosition | null) => {
  const nextResearch = position === null ? 0 : getResearchAtViewportPosition(position)
  if (nextResearch === hoveredResearchIndex) {
    return
  }

  hoveredResearchIndex = nextResearch
  DOMCacheGetOrSet('researchMapViewport').classList.toggle('researchMapNodeHovered', nextResearch > 0)
  requestResearchMapRender()
  if (nextResearch > 0 && player.toggles[38] && player.highestSingularityCount > 0) {
    buyResearch(nextResearch, false, true)
    refreshResearchView(true)
  }
}

const beginResearchMapGesture = () => {
  const pointers = [...activeMapPointers.values()]
  if (pointers.length === 1) {
    researchMapGesture = {
      kind: 'pan',
      pointer: { ...pointers[0] },
      transform: { ...mapTransform }
    }
  } else if (pointers.length >= 2) {
    const pair = pointers.slice(0, 2)
    const midpoint = getPointerMidpoint(pair)
    researchMapGesture = {
      kind: 'pinch',
      distance: getPointerDistance(pair),
      transform: { ...mapTransform },
      worldPoint: {
        x: (midpoint.x - mapTransform.x) / mapTransform.scale,
        y: (midpoint.y - mapTransform.y) / mapTransform.scale
      }
    }
  }
}

const registerResearchMapInteractions = () => {
  const viewport = DOMCacheGetOrSet('researchMapViewport')

  viewport.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) {
      return
    }

    cancelResearchMapAnimation()
    updateResearchMapViewportBounds()
    markResearchMapInteraction()
    const pointerPosition = getViewportPointerPosition(event)
    if (activeMapPointers.size === 0) {
      researchPointerCandidate = getResearchAtViewportPosition(pointerPosition)
      researchPointerOrigin = pointerPosition
      researchPointerMoved = false
    } else {
      researchPointerCandidate = 0
      researchPointerMoved = true
    }
    updateHoveredResearch(null)
    viewport.setPointerCapture(event.pointerId)
    activeMapPointers.set(event.pointerId, pointerPosition)
    beginResearchMapGesture()
    viewport.classList.add('researchMapPanning')
  }, { passive: true })

  viewport.addEventListener('pointermove', (event) => {
    if (!activeMapPointers.has(event.pointerId) || researchMapGesture === null) {
      if (event.pointerType === 'mouse') {
        updateHoveredResearch(getViewportPointerPosition(event))
      }
      return
    }

    lastResearchMapInteraction = performance.now()
    const pointerPosition = getViewportPointerPosition(event)
    activeMapPointers.set(event.pointerId, pointerPosition)
    const pointers = [...activeMapPointers.values()]
    if (
      pointers.length > 1
      || (researchPointerOrigin !== null
        && Math.hypot(
            pointerPosition.x - researchPointerOrigin.x,
            pointerPosition.y - researchPointerOrigin.y
          ) > 5)
    ) {
      researchPointerMoved = true
    }

    if (researchMapGesture.kind === 'pan' && pointers.length === 1) {
      mapTransform.x = researchMapGesture.transform.x + pointers[0].x - researchMapGesture.pointer.x
      mapTransform.y = researchMapGesture.transform.y + pointers[0].y - researchMapGesture.pointer.y
    } else if (researchMapGesture.kind === 'pinch' && pointers.length >= 2) {
      const pair = pointers.slice(0, 2)
      const midpoint = getPointerMidpoint(pair)
      const nextScale = clamp(
        researchMapGesture.transform.scale * getPointerDistance(pair) / researchMapGesture.distance,
        RESEARCH_MAP_MIN_SCALE,
        RESEARCH_MAP_MAX_SCALE
      )
      mapTransform.scale = nextScale
      mapTransform.x = midpoint.x - researchMapGesture.worldPoint.x * nextScale
      mapTransform.y = midpoint.y - researchMapGesture.worldPoint.y * nextScale
    }

    applyResearchMapTransform()
  }, { passive: true })

  const endPointer = (event: PointerEvent, cancelled = false) => {
    if (!activeMapPointers.has(event.pointerId)) {
      return
    }

    const pointerPosition = getViewportPointerPosition(event)
    if (
      researchPointerOrigin !== null
      && Math.hypot(
          pointerPosition.x - researchPointerOrigin.x,
          pointerPosition.y - researchPointerOrigin.y
        ) > 5
    ) {
      researchPointerMoved = true
    }
    const shouldSelect = !cancelled
      && activeMapPointers.size === 1
      && researchPointerCandidate > 0
      && !researchPointerMoved

    activeMapPointers.delete(event.pointerId)
    lastResearchMapInteraction = performance.now()
    if (viewport.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId)
    }
    if (activeMapPointers.size === 0) {
      researchMapGesture = null
      viewport.classList.remove('researchMapPanning')
      const selectedIndex = researchPointerCandidate
      researchPointerCandidate = 0
      researchPointerOrigin = null
      researchPointerMoved = false
      if (shouldSelect) {
        selectResearch(selectedIndex)
      }
      updateHoveredResearch(!cancelled && event.pointerType === 'mouse' ? pointerPosition : null)
    } else {
      beginResearchMapGesture()
    }
  }

  viewport.addEventListener('pointerup', endPointer)
  viewport.addEventListener('pointercancel', (event) => endPointer(event, true))
  viewport.addEventListener('pointerleave', () => {
    if (activeMapPointers.size === 0) {
      updateHoveredResearch(null)
    }
  })
  viewport.addEventListener('wheel', (event) => {
    const now = performance.now()
    if (now - lastResearchMapInteraction > 250) {
      updateResearchMapViewportBounds()
    }
    markResearchMapInteraction()
    const wheelDelta = event.deltaMode === WheelEvent.DOM_DELTA_LINE
      ? event.deltaY * 16
      : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
      ? event.deltaY * mapViewportBounds.height
      : event.deltaY
    const zoomFactor = Math.exp(-wheelDelta * 0.0015)
    zoomResearchMapAt(
      mapTransform.scale * zoomFactor,
      event.clientX - mapViewportBounds.x,
      event.clientY - mapViewportBounds.y
    )
    event.preventDefault()
  }, { passive: false })
  viewport.addEventListener('dblclick', (event) => {
    updateResearchMapViewportBounds()
    const pointerPosition = {
      x: event.clientX - mapViewportBounds.x,
      y: event.clientY - mapViewportBounds.y
    }
    if (getResearchAtViewportPosition(pointerPosition) > 0) {
      return
    }
    markResearchMapInteraction()
    zoomResearchMapAt(
      mapTransform.scale * 1.35,
      pointerPosition.x,
      pointerPosition.y,
      true
    )
  })
  viewport.addEventListener('keydown', (event) => {
    const keyboardPanDistance = 80
    switch (event.key) {
      case 'ArrowLeft':
        cancelResearchMapAnimation()
        mapTransform.x += keyboardPanDistance
        break
      case 'ArrowRight':
        cancelResearchMapAnimation()
        mapTransform.x -= keyboardPanDistance
        break
      case 'ArrowUp':
        cancelResearchMapAnimation()
        mapTransform.y += keyboardPanDistance
        break
      case 'ArrowDown':
        cancelResearchMapAnimation()
        mapTransform.y -= keyboardPanDistance
        break
      case '+':
      case '=':
        zoomResearchMapFromCenter(mapTransform.scale * 1.25)
        event.preventDefault()
        return
      case '-':
      case '_':
        zoomResearchMapFromCenter(mapTransform.scale / 1.25)
        event.preventDefault()
        return
      case '0':
        fitResearchMap()
        event.preventDefault()
        return
      case 'Home':
        centerResearchOnMap(selectedResearchIndex)
        event.preventDefault()
        return
      default:
        return
    }

    markResearchMapInteraction()
    applyResearchMapTransform()
    event.preventDefault()
  })

  DOMCacheGetOrSet('researchZoomIn').addEventListener(
    'click',
    () => zoomResearchMapFromCenter(mapTransform.scale * 1.25)
  )
  DOMCacheGetOrSet('researchZoomOut').addEventListener(
    'click',
    () => zoomResearchMapFromCenter(mapTransform.scale / 1.25)
  )
  DOMCacheGetOrSet('researchFitMap').addEventListener('click', fitResearchMap)

  const resizeObserver = new ResizeObserver(() => {
    updateResearchMapViewportBounds()
    resizeResearchTreeCanvas()
    if (mapViewportBounds.width === 0 || mapViewportBounds.height === 0) {
      return
    }
    if (!researchMapInitialized) {
      researchMapInitialized = true
      centerResearchOnMap(selectedResearchIndex)
    } else {
      cancelResearchMapAnimation()
      applyResearchMapTransform()
    }
  })
  resizeObserver.observe(viewport)

  const workspaceObserver = new MutationObserver(requestResearchMapRender)
  workspaceObserver.observe(DOMCacheGetOrSet('researchWorkspace'), {
    attributeFilter: ['class'],
    attributes: true
  })
}

const updateResearchAutoTarget = () => {
  const nextAutoTarget = player.autoResearchToggle ? player.autoResearch : 0
  if (nextAutoTarget === renderedAutoTargetIndex) {
    return false
  }

  researchDirectoryRows[renderedAutoTargetIndex]?.classList.remove('researchAutoTarget')
  researchDirectoryRows[nextAutoTarget]?.classList.add('researchAutoTarget')
  renderedAutoTargetIndex = nextAutoTarget
  return true
}

const updateResearchElementState = (index: number, status: ResearchViewStatus) => {
  const button = researchButtons[index]
  const row = researchDirectoryRows[index]
  const statusElement = researchDirectoryStatuses[index]
  const levelElement = researchDirectoryLevels[index]
  const level = player.researches[index]
  const purchased = level > 0
  const progress = status === 'maxed' ? 'maxed' : purchased ? 'upgrading' : 'untouched'
  const statusChanged = researchStatuses[index] !== status
  const levelChanged = researchLevels[index] !== level

  if ((statusChanged || levelChanged) && button !== undefined) {
    button.classList.toggle('researchUnlocked', status !== 'locked')
    button.classList.toggle('researchLocked', status === 'locked')
    button.classList.toggle('researchAvailable', status === 'available' && !purchased)
    button.classList.toggle('researchPurchased', purchased && status !== 'maxed')
    button.classList.toggle('researchPurchasedAvailable', status === 'available' && purchased)
    button.classList.toggle('researchMaxed', status === 'maxed')
    button.classList.toggle('researchUnavailable', status === 'unaffordable')
  }
  if (statusChanged && row !== undefined) {
    row.dataset.status = status
  }

  if ((statusChanged || levelChanged) && statusElement !== undefined) {
    statusElement.dataset.progress = progress
  }
  if (levelChanged && levelElement !== undefined) {
    levelElement.textContent = i18next.t('researches.directoryLevel', {
      current: level,
      max: researchData[index].maxLevel
    })
  }
  if ((statusChanged || levelChanged) && row !== undefined) {
    row.setAttribute(
      'aria-label',
      i18next.t('researches.directoryEntry', {
        id: getResearchGridId(index),
        name: researchNames[index],
        status: i18next.t(researchStatusKeys[status])
      })
    )
  }

  researchStatuses[index] = status
  researchLevels[index] = level
  return statusChanged || levelChanged
}

const updateResearchSelection = (previousIndex: number, nextIndex: number) => {
  researchDirectoryRows[previousIndex]?.classList.remove('researchSelected')
  researchDirectoryRows[previousIndex]?.setAttribute('aria-selected', 'false')
  researchDirectoryRows[nextIndex]?.classList.add('researchSelected')
  researchDirectoryRows[nextIndex]?.setAttribute('aria-selected', 'true')
  requestResearchMapRender()
}

export const refreshResearchView = (force = false) => {
  if (!researchViewInitialized) {
    return
  }

  const now = performance.now()
  const mapIsInteracting = activeMapPointers.size > 0
    || now - lastResearchMapInteraction < RESEARCH_VIEW_INTERACTION_COOLDOWN
  if (!force && (mapIsInteracting || now - lastResearchViewRefresh < RESEARCH_VIEW_REFRESH_INTERVAL)) {
    return
  }
  lastResearchViewRefresh = now

  let mapNeedsRender = false
  for (let index = 1; index <= RESEARCH_COUNT; index++) {
    mapNeedsRender = updateResearchElementState(index, getResearchStatus(index)) || mapNeedsRender
  }
  mapNeedsRender = updateResearchAutoTarget() || mapNeedsRender
  if (mapNeedsRender) {
    requestResearchMapRender()
  }

  const selectedStatus = researchStatuses[selectedResearchIndex]!
  const selectedStatusElement = DOMCacheGetOrSet('researchSelectedStatus')
  const buyButton = DOMCacheGetOrSet('buySelectedResearch') as HTMLButtonElement
  selectedStatusElement.dataset.status = selectedStatus
  selectedStatusElement.textContent = i18next.t(researchStatusKeys[selectedStatus])
  buyButton.textContent = i18next.t(
    player.researchBuyMaxToggle ? 'researches.buySelectedMax' : 'researches.buySelectedOne'
  )
  buyButton.disabled = selectedStatus !== 'available'
  buyButton.dataset.status = selectedStatus
  researchDescriptions(selectedResearchIndex)
}

export const getSelectedResearchIndex = () => selectedResearchIndex

export const selectResearch = (index: number, centerOnMap = false) => {
  if (index < 1 || index > RESEARCH_COUNT) {
    return
  }

  const previousIndex = selectedResearchIndex
  selectedResearchIndex = index
  updateResearchSelection(previousIndex, index)
  renderSelectedResearch()
  refreshResearchView(true)
  if (centerOnMap) {
    centerResearchOnMap(index)
  }
}

const updateResearchViewLoop = (timestamp: number) => {
  const mapIsInteracting = activeMapPointers.size > 0
    || timestamp - lastResearchMapInteraction < RESEARCH_VIEW_INTERACTION_COOLDOWN
  if (!mapIsInteracting) {
    DOMCacheGetOrSet('researchMapViewport').classList.remove('researchMapInteracting')
  }
  if (
    DOMCacheGetOrSet('research').style.display !== 'none'
    && timestamp - lastResearchViewRefresh >= RESEARCH_VIEW_REFRESH_INTERVAL
  ) {
    refreshResearchView()
  }
  requestAnimationFrame(updateResearchViewLoop)
}

export const initializeResearchView = () => {
  if (researchViewInitialized) {
    return
  }

  initializeResearchTreeCanvas()
  createResearchMapNodes()
  createResearchDirectory()
  researchViewInitialized = true
  renderResearchNames()
  registerResearchMapInteractions()
  selectResearch(selectedResearchIndex)

  i18next.on('languageChanged', () => {
    researchStatuses.fill(undefined)
    researchLevels.fill(undefined)
    renderResearchNames()
    refreshResearchView(true)
  })
  requestAnimationFrame(updateResearchViewLoop)
}
