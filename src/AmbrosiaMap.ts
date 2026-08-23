import i18next from 'i18next'
import { type AmbrosiaUpgradeNames, ambrosiaUpgrades } from './BlueberryUpgrades'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { type RedAmbrosiaNames, redAmbrosiaUpgrades } from './RedAmbrosiaUpgrades'

type AmbrosiaMapLayout = 'circuit' | 'panels' | 'metro' | 'radial' | 'tree'
type AmbrosiaMapEdgeKind = 'requirement' | 'support'

interface AmbrosiaMapEdge {
  sourceId: string
  targetId: string
  kind: AmbrosiaMapEdgeKind
}

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'
const AMBROSIA_MAP_LAYOUTS = new Set<AmbrosiaMapLayout>(['circuit', 'panels', 'metro', 'radial', 'tree'])
const AMBROSIA_MAP_NODE_SIZE = 46
const AMBROSIA_RADIAL_MINIMUM_RADIUS = 125
const AMBROSIA_RADIAL_MAXIMUM_RADIUS = 310
const AMBROSIA_RADIAL_PADDING = 12
const AMBROSIA_RADIAL_CONTROLS_GAP = 12

const redSupportTargets: Partial<Record<RedAmbrosiaNames, readonly string[]>> = {
  freeTutorialLevels: ['ambrosiaTutorial'],
  freeLevelsRow2: [
    'ambrosiaQuarks1',
    'ambrosiaCubes1',
    'ambrosiaLuck1',
    'ambrosiaBaseObtainium1',
    'ambrosiaBaseOffering1',
    'ambrosiaTalismanBonusRuneLevel',
    'ambrosiaFreeLuckUpgrades'
  ],
  freeLevelsRow3: [
    'ambrosiaCubeQuark1',
    'ambrosiaLuckQuark1',
    'ambrosiaQuarkCube1',
    'ambrosiaLuckCube1',
    'ambrosiaCubeLuck1',
    'ambrosiaQuarkLuck1'
  ],
  freeLevelsRow4: [
    'ambrosiaQuarks2',
    'ambrosiaCubes2',
    'ambrosiaLuck2',
    'ambrosiaBaseObtainium2',
    'ambrosiaBaseOffering2',
    'ambrosiaInfiniteShopUpgrades1',
    'ambrosiaRuneOOMBonus',
    'ambrosiaFreeRedLuckUpgrades'
  ],
  freeLevelsRow5: [
    'ambrosiaQuarks3',
    'ambrosiaCubes3',
    'ambrosiaLuck3',
    'ambrosiaLuck4',
    'ambrosiaInfiniteShopUpgrades2',
    'ambrosiaFreeQuarkUpgrades'
  ]
}

const redUpgradeElementId = (key: RedAmbrosiaNames) => {
  return `redAmbrosia${key.charAt(0).toUpperCase()}${key.slice(1)}`
}

const getMapLayout = (container: HTMLElement): AmbrosiaMapLayout => {
  const requestedLayout = container.dataset.ambrosiaLayout as AmbrosiaMapLayout | undefined
  return requestedLayout && AMBROSIA_MAP_LAYOUTS.has(requestedLayout) ? requestedLayout : 'circuit'
}

const getBlueFamily = (key: AmbrosiaUpgradeNames) => {
  if (/CubeQuark|LuckQuark|QuarkCube|LuckCube|CubeLuck|QuarkLuck/.test(key)) return 'hybrid'
  if (/^ambrosiaQuarks[123]$/.test(key)) return 'quark'
  if (/^ambrosiaCubes[123]$/.test(key)) return 'cube'
  if (/^ambrosiaLuck[1234]$/.test(key)) return 'luck'
  return 'utility'
}

const getRedFamily = (key: RedAmbrosiaNames) => {
  if (/^free|blueberr|regularLuck|Accelerator/.test(key)) return 'blueSupport'
  if (/conversion|redGeneration|redLuck/.test(key)) return 'redCore'
  return 'external'
}

const decorateUpgradeTiers = (container: HTMLElement) => {
  const tierElements = Array.from(container.children).filter((element): element is HTMLElement => {
    return element instanceof HTMLElement && element.classList.contains('blueberryUpgradeTier')
  })

  let stage = 0
  for (const tier of tierElements) {
    if (tier.querySelector('#refundBlueberries')) {
      tier.classList.add('ambrosiaMapControlsTier')
      continue
    }

    stage += 1
    tier.dataset.ambrosiaStage = String(stage)

    const stageLabel = document.createElement('div')
    stageLabel.classList.add('ambrosiaMapStageLabel')

    const stageName = document.createElement('span')
    stageName.classList.add('ambrosiaMapStageName')
    stageName.textContent = i18next.t('ambrosia.map.stage', { stage })

    const blueLabel = document.createElement('span')
    blueLabel.classList.add('ambrosiaMapBlueLabel')
    blueLabel.textContent = i18next.t('ambrosia.map.blueBuild')

    const redLabel = document.createElement('span')
    redLabel.classList.add('ambrosiaMapRedLabel')
    redLabel.textContent = i18next.t('ambrosia.map.redSupport')

    stageLabel.append(stageName, blueLabel, redLabel)
    tier.prepend(stageLabel)

    for (const key of Object.keys(ambrosiaUpgrades) as AmbrosiaUpgradeNames[]) {
      const node = tier.querySelector<HTMLElement>(`#${key}`)
      if (!node) continue

      node.dataset.ambrosiaMapNode = ''
      node.dataset.ambrosiaMapSide = 'blue'
      node.dataset.ambrosiaMapFamily = getBlueFamily(key)
      node.dataset.ambrosiaMapStage = String(stage)
      node.setAttribute('aria-label', ambrosiaUpgrades[key].name())
    }

    for (const key of Object.keys(redAmbrosiaUpgrades) as RedAmbrosiaNames[]) {
      const node = tier.querySelector<HTMLElement>(`#${redUpgradeElementId(key)}`)
      if (!node) continue

      node.dataset.ambrosiaMapNode = ''
      node.dataset.ambrosiaMapSide = 'red'
      node.dataset.ambrosiaMapFamily = getRedFamily(key)
      node.dataset.ambrosiaMapStage = String(stage)
      node.setAttribute('aria-label', redAmbrosiaUpgrades[key].name())
    }
  }
}

const createMapEdges = (): AmbrosiaMapEdge[] => {
  const edges: AmbrosiaMapEdge[] = []

  for (
    const [targetKey, upgrade] of Object.entries(ambrosiaUpgrades) as [
      AmbrosiaUpgradeNames,
      (typeof ambrosiaUpgrades)[AmbrosiaUpgradeNames]
    ][]
  ) {
    for (const sourceKey of Object.keys(upgrade.prerequisites) as AmbrosiaUpgradeNames[]) {
      edges.push({ sourceId: sourceKey, targetId: targetKey, kind: 'requirement' })
    }
  }

  for (const [sourceKey, targets] of Object.entries(redSupportTargets) as [RedAmbrosiaNames, readonly string[]][]) {
    for (const targetId of targets) {
      edges.push({ sourceId: redUpgradeElementId(sourceKey), targetId, kind: 'support' })
    }
  }

  return edges
}

const createConnectionsSvg = (container: HTMLElement) => {
  const svg = document.createElementNS(SVG_NAMESPACE, 'svg')
  svg.classList.add('ambrosiaMapConnections')
  svg.setAttribute('aria-hidden', 'true')

  const defs = document.createElementNS(SVG_NAMESPACE, 'defs')
  for (const kind of ['requirement', 'support'] as AmbrosiaMapEdgeKind[]) {
    const marker = document.createElementNS(SVG_NAMESPACE, 'marker')
    marker.id = `ambrosiaMapArrow-${kind}`
    marker.setAttribute('markerWidth', '7')
    marker.setAttribute('markerHeight', '7')
    marker.setAttribute('refX', '6')
    marker.setAttribute('refY', '3.5')
    marker.setAttribute('orient', 'auto')
    marker.setAttribute('markerUnits', 'strokeWidth')

    const arrow = document.createElementNS(SVG_NAMESPACE, 'path')
    arrow.setAttribute('d', 'M 0 0 L 7 3.5 L 0 7 z')
    arrow.classList.add(`ambrosiaMapArrow-${kind}`)
    marker.append(arrow)
    defs.append(marker)
  }

  svg.append(defs)
  container.prepend(svg)
  return svg
}

const positionRadialNodes = (container: HTMLElement) => {
  if (getMapLayout(container) !== 'radial') return

  const desktopLayout = window.matchMedia('(min-width: 701px)').matches
  const nodes = container.querySelectorAll<HTMLElement>('.blueberryUpgrade, .redAmbrosiaUpgrade')

  if (!desktopLayout) {
    for (const node of nodes) {
      node.style.removeProperty('left')
      node.style.removeProperty('top')
    }
    container.style.removeProperty('--ambrosia-radial-center-y')
    container.style.removeProperty('--ambrosia-radial-height')
    return
  }

  const centerX = container.clientWidth / 2
  const availableRadius = (container.clientWidth - 2 * AMBROSIA_RADIAL_PADDING - AMBROSIA_MAP_NODE_SIZE) / 2
  const maximumRadius = Math.max(
    AMBROSIA_RADIAL_MINIMUM_RADIUS,
    Math.min(AMBROSIA_RADIAL_MAXIMUM_RADIUS, availableRadius)
  )
  const centerY = AMBROSIA_RADIAL_PADDING + AMBROSIA_MAP_NODE_SIZE / 2 + maximumRadius
  const controlsHeight = container.querySelector<HTMLElement>('.ambrosiaMapControlsTier')?.offsetHeight ?? 0
  const radialHeight = centerY
    + maximumRadius
    + AMBROSIA_MAP_NODE_SIZE / 2
    + controlsHeight
    + AMBROSIA_RADIAL_CONTROLS_GAP
    + AMBROSIA_RADIAL_PADDING

  container.style.setProperty('--ambrosia-radial-center-y', `${centerY}px`)
  container.style.setProperty('--ambrosia-radial-height', `${radialHeight}px`)

  for (let stage = 1; stage <= 5; stage++) {
    const radius = AMBROSIA_RADIAL_MINIMUM_RADIUS
      + (maximumRadius - AMBROSIA_RADIAL_MINIMUM_RADIUS) * (stage - 1) / 4
    const tier = container.querySelector<HTMLElement>(`.blueberryUpgradeTier[data-ambrosia-stage="${stage}"]`)
    if (!tier) continue

    const placeArc = (side: 'blue' | 'red', startDegrees: number, endDegrees: number) => {
      const stageNodes = Array.from(
        tier.querySelectorAll<HTMLElement>(`[data-ambrosia-map-side="${side}"]`)
      )

      for (const [index, node] of stageNodes.entries()) {
        const progress = stageNodes.length === 1 ? 0.5 : index / (stageNodes.length - 1)
        const degrees = startDegrees + (endDegrees - startDegrees) * progress
        const radians = degrees * Math.PI / 180
        node.style.left = `${centerX + Math.cos(radians) * radius - AMBROSIA_MAP_NODE_SIZE / 2}px`
        node.style.top = `${centerY + Math.sin(radians) * radius - AMBROSIA_MAP_NODE_SIZE / 2}px`
      }
    }

    placeArc('blue', 105, 255)
    placeArc('red', -75, 75)
  }
}

const getElementCenter = (element: HTMLElement, containerRect: DOMRect, container: HTMLElement) => {
  const rect = element.getBoundingClientRect()
  return {
    x: rect.left - containerRect.left + container.scrollLeft + rect.width / 2,
    y: rect.top - containerRect.top + container.scrollTop + rect.height / 2
  }
}

const createPathData = (
  source: { x: number; y: number },
  target: { x: number; y: number },
  layout: AmbrosiaMapLayout
) => {
  if (layout === 'circuit' || layout === 'panels' || layout === 'metro') {
    const midpointX = (source.x + target.x) / 2
    return `M ${source.x} ${source.y} C ${midpointX} ${source.y}, ${midpointX} ${target.y}, ${target.x} ${target.y}`
  }

  const midpointY = (source.y + target.y) / 2
  return `M ${source.x} ${source.y} C ${source.x} ${midpointY}, ${target.x} ${midpointY}, ${target.x} ${target.y}`
}

export const initializeAmbrosiaMap = () => {
  const container = DOMCacheGetOrSet('blueberryUpgradeContainer')
  if (container.dataset.ambrosiaMapInitialized === 'true') return

  container.dataset.ambrosiaMapInitialized = 'true'
  container.dataset.ambrosiaEdgeMode = 'requirements'
  const layout = getMapLayout(container)
  decorateUpgradeTiers(container)

  const svg = createConnectionsSvg(container)
  const edges = createMapEdges()
  let animationFrame = 0

  const drawEdges = () => {
    animationFrame = 0
    positionRadialNodes(container)

    const oldPaths = svg.querySelectorAll('.ambrosiaMapEdge')
    for (const path of oldPaths) path.remove()

    const width = Math.max(container.clientWidth, container.scrollWidth)
    const height = Math.max(container.clientHeight, container.scrollHeight)
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    svg.setAttribute('width', String(width))
    svg.setAttribute('height', String(height))

    const containerRect = container.getBoundingClientRect()
    for (const edge of edges) {
      const sourceElement = document.getElementById(edge.sourceId)
      const targetElement = document.getElementById(edge.targetId)
      if (!(sourceElement instanceof HTMLElement) || !(targetElement instanceof HTMLElement)) continue
      if (
        getComputedStyle(sourceElement).visibility === 'hidden'
        || getComputedStyle(targetElement).visibility === 'hidden'
      ) {
        continue
      }

      const source = getElementCenter(sourceElement, containerRect, container)
      const target = getElementCenter(targetElement, containerRect, container)
      const path = document.createElementNS(SVG_NAMESPACE, 'path')
      path.setAttribute('d', createPathData(source, target, layout))
      path.setAttribute('marker-end', `url(#ambrosiaMapArrow-${edge.kind})`)
      path.classList.add('ambrosiaMapEdge', `ambrosiaMapEdge-${edge.kind}`)
      path.dataset.sourceId = edge.sourceId
      path.dataset.targetId = edge.targetId
      svg.append(path)
    }
  }

  const scheduleDraw = () => {
    if (animationFrame !== 0) cancelAnimationFrame(animationFrame)
    animationFrame = requestAnimationFrame(drawEdges)
  }

  const clearFocus = () => {
    for (const element of container.querySelectorAll('.ambrosiaMapNodeSelected, .ambrosiaMapNodeRelated')) {
      element.classList.remove('ambrosiaMapNodeSelected', 'ambrosiaMapNodeRelated')
    }
    for (const path of svg.querySelectorAll('.ambrosiaMapEdgeFocused')) {
      path.classList.remove('ambrosiaMapEdgeFocused')
    }
  }

  const focusNode = (node: HTMLElement) => {
    clearFocus()
    node.classList.add('ambrosiaMapNodeSelected')

    for (const path of svg.querySelectorAll<SVGPathElement>('.ambrosiaMapEdge')) {
      if (path.dataset.sourceId !== node.id && path.dataset.targetId !== node.id) continue

      path.classList.add('ambrosiaMapEdgeFocused')
      const relatedId = path.dataset.sourceId === node.id ? path.dataset.targetId : path.dataset.sourceId
      if (relatedId) document.getElementById(relatedId)?.classList.add('ambrosiaMapNodeRelated')
    }
  }

  container.addEventListener('pointerover', (event) => {
    const target = event.target
    if (!(target instanceof Element)) return
    const node = target.closest<HTMLElement>('[data-ambrosia-map-node]')
    if (node && container.contains(node)) focusNode(node)
  })

  container.addEventListener('pointerout', (event) => {
    const target = event.target
    if (!(target instanceof Element)) return
    const node = target.closest<HTMLElement>('[data-ambrosia-map-node]')
    if (!node) return
    if (event.relatedTarget instanceof Node && node.contains(event.relatedTarget)) return
    clearFocus()
  })

  container.addEventListener('focusin', (event) => {
    const target = event.target
    if (!(target instanceof Element)) return
    const node = target.closest<HTMLElement>('[data-ambrosia-map-node]')
    if (node) focusNode(node)
  })

  container.addEventListener('focusout', (event) => {
    if (event.relatedTarget instanceof Node && container.contains(event.relatedTarget)) return
    clearFocus()
  })

  const resizeObserver = new ResizeObserver(scheduleDraw)
  resizeObserver.observe(container)
  window.addEventListener('resize', scheduleDraw)
  container.addEventListener('pointerenter', scheduleDraw)
  requestAnimationFrame(() => requestAnimationFrame(scheduleDraw))
}
