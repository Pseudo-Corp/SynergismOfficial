import i18next from 'i18next'
import { DOMCacheGetOrSet } from '../Cache/DOM'
import { player } from '../Synergism'
import { isMobile } from '../Utility'

interface Building {
  imgId: string
  imgAlt: string
  imgSrc: string
  descId: string
  buyId: string
  toggleId: string
  statsId: string
  containerClass?: string
  imgExtraClass?: string
  noImageClass?: boolean
  descExtraClass?: string
  descStyle?: string
  buyExtraClass?: string
  toggleIdAttr?: string
  statsExtraClass?: string
  statsStyle?: string
  fitStats?: boolean
}

type Entry = Building | { spacer: true }

const costIdOf = (buyId: string) => `cost${buyId.slice('buy'.length)}`
const joinClasses = (...classes: Array<string | undefined>) => classes.filter(Boolean).join(' ')

export const getBuildingCostElement = (buyId: string): HTMLElement =>
  DOMCacheGetOrSet(isMobile ? costIdOf(buyId) : buyId)

const renderBuildingDesktop = (b: Building): string => {
  const wrapper = b.containerClass ? ` class="${b.containerClass}"` : ''
  const imgClasses: string[] = []
  if (b.imgExtraClass) imgClasses.push(b.imgExtraClass)
  if (!b.noImageClass) imgClasses.push('image')
  const imgClass = imgClasses.length ? ` class="${imgClasses.join(' ')}"` : ''
  const descClass = joinClasses(b.descExtraClass, 'desc', 'fitText')
  const descStyle = b.descStyle ? ` style="${b.descStyle}"` : ''
  const buyClass = joinClasses(b.buyExtraClass, 'buildingPurchaseBtn', 'fitText')
  const toggleIdAttr = b.toggleIdAttr !== undefined ? ` toggleid="${b.toggleIdAttr}"` : ''
  const statsClass = joinClasses(b.statsExtraClass, 'stats', b.fitStats === false ? undefined : 'fitText')
  const statsStyle = b.statsStyle ? ` style="${b.statsStyle}"` : ''

  return `<div${wrapper}>`
    + `<img${imgClass} id="${b.imgId}" alt="${b.imgAlt}" src="${b.imgSrc}" loading="lazy">`
    + `<span class="${descClass}" id="${b.descId}"${descStyle}></span>`
    + `<button class="${buyClass}" id="${b.buyId}"></button>`
    + `<button class="auto autobuyerToggleButton" id="${b.toggleId}"${toggleIdAttr}></button>`
    + `<span class="${statsClass}" id="${b.statsId}"${statsStyle}></span>`
    + '</div>'
}

const renderBuildingMobile = (b: Building): string => {
  const wrapper = b.containerClass ? ` class="${b.containerClass}"` : ''
  const imgClasses: string[] = []
  if (b.imgExtraClass) imgClasses.push(b.imgExtraClass)
  if (!b.noImageClass) imgClasses.push('image')
  const imgClass = imgClasses.length ? ` class="${imgClasses.join(' ')}"` : ''
  const descClass = joinClasses(b.descExtraClass, 'desc', 'fitText')
  const descStyle = b.descStyle ? ` style="${b.descStyle}"` : ''
  const buyClass = joinClasses(b.buyExtraClass, 'buildingPurchaseBtn', 'fitText')
  const toggleIdAttr = b.toggleIdAttr !== undefined ? ` toggleid="${b.toggleIdAttr}"` : ''
  const statsClass = joinClasses(b.statsExtraClass, 'stats', b.fitStats === false ? undefined : 'fitText')
  const statsStyle = b.statsStyle ? ` style="${b.statsStyle}"` : ''
  const costClass = joinClasses(b.buyExtraClass, 'cost', 'fitText')
  const buyLabel = i18next.t('buildings.buy')

  return `<div${wrapper}>`
    + `<img${imgClass} id="${b.imgId}" alt="${b.imgAlt}" src="${b.imgSrc}" loading="lazy">`
    + '<div class="textStack">'
    + `<span class="${descClass}" id="${b.descId}"${descStyle}></span>`
    + `<span class="${costClass}" id="${costIdOf(b.buyId)}"></span>`
    + `<span class="${statsClass}" id="${b.statsId}"${statsStyle}></span>`
    + '</div>'
    + `<button class="${buyClass}" id="${b.buyId}">${buyLabel}</button>`
    + `<button class="auto autobuyerToggleButton" id="${b.toggleId}"${toggleIdAttr}></button>`
    + '</div>'
}

const renderBuilding = isMobile ? renderBuildingMobile : renderBuildingDesktop

const renderAutomationControl = (): string =>
  '<div class="buildingAutomationControls">'
  + '<button class="buildingAutomationToggle" type="button" style="display: none"></button>'
  + '<button class="automatedBuildingVisibilityToggle" type="button" style="display: none" aria-pressed="false"></button>'
  + '</div>'

const renderRow = (entries: Entry[]): string =>
  renderAutomationControl()
  + entries.map((e) => 'spacer' in e ? '<div class="buildingSpacer"></div>' : renderBuilding(e)).join('')

const goldStyle = 'color: gold'

const coinNames = ['Worker', 'Investment', 'Printer', 'Coin Mint', 'Alchemy']
const diamondNames = ['Refinery', 'Coal Plant', 'Coal Rig', 'Pickaxe', 'Pandora\'s Box']
const mythosNames = ['Augment', 'Enchantment', 'Wizard', 'Oracle', 'Grandmaster']
const particleNames = ['Proton', 'Element', 'Pulsar', 'Quasar', 'Galactic Nucleus']
const tesseractNames = ['Dot', 'Vector', 'Three-Space', 'Bent Time', 'Hilbert Space']

const coinRow: Entry[] = [
  ...[0, 1, 2, 3, 4].map((i): Building => ({
    imgId: `coin${i + 1}`,
    imgAlt: coinNames[i],
    imgSrc: `Pictures/Default/Tier${i + 1}.png`,
    descId: `buildtext${2 * i + 1}`,
    buyId: `buycoin${i + 1}`,
    toggleId: `toggle${i + 1}`,
    toggleIdAttr: `${i + 1}`,
    statsId: `buildtext${2 * i + 2}`,
    containerClass: i === 0 ? undefined : `coinunlock${i}`,
    descStyle: goldStyle,
    statsStyle: goldStyle
  })),
  { spacer: true },
  {
    imgId: 'accelerator',
    imgAlt: 'Accelerator',
    imgSrc: 'Pictures/Default/Accelerator.png',
    descId: 'buildtext11',
    buyId: 'buyaccelerator',
    toggleId: 'toggle6',
    toggleIdAttr: '6',
    statsId: 'buildtext12',
    containerClass: 'coinunlock1',
    descStyle: 'color: yellow',
    statsStyle: 'color: cyan'
  },
  {
    imgId: 'multiplier',
    imgAlt: 'Multiplier',
    imgSrc: 'Pictures/Default/Multiplier.png',
    descId: 'buildtext13',
    buyId: 'buymultiplier',
    toggleId: 'toggle7',
    toggleIdAttr: '7',
    statsId: 'buildtext14',
    containerClass: 'coinunlock2',
    descStyle: 'color: yellow',
    statsStyle: 'color: pink'
  },
  {
    imgId: 'acceleratorboost',
    imgAlt: 'Accelerator Boost',
    imgSrc: 'Pictures/Default/AcceleratorBoost.png',
    descId: 'buildtext15',
    buyId: 'buyacceleratorboost',
    toggleId: 'toggle8',
    toggleIdAttr: '8',
    statsId: 'buildtext16',
    containerClass: 'prestigeunlock',
    imgExtraClass: 'prestigeunlock',
    descExtraClass: 'prestigeunlock',
    descStyle: 'color: cyan',
    buyExtraClass: 'prestigeunlock',
    statsExtraClass: 'prestigeunlock crimsonText',
    fitStats: false
  }
]

const diamondRow: Entry[] = [0, 1, 2, 3, 4].map((i): Building => ({
  imgId: `diamond${i + 1}`,
  imgAlt: diamondNames[i],
  imgSrc: `Pictures/Default/DiamondTier${i + 1}.png`,
  descId: `prestigetext${2 * i + 1}`,
  buyId: `buydiamond${i + 1}`,
  toggleId: `toggle${10 + i}`,
  toggleIdAttr: `${10 + i}`,
  statsId: `prestigetext${2 * i + 2}`
}))

const mythosRow: Entry[] = [0, 1, 2, 3, 4].map((i): Building => ({
  imgId: `mythos${i + 1}`,
  imgAlt: mythosNames[i],
  imgSrc: `Pictures/Default/MythosTier${i + 1}.png`,
  descId: `transcendtext${2 * i + 1}`,
  buyId: `buymythos${i + 1}`,
  toggleId: `toggle${16 + i}`,
  toggleIdAttr: `${16 + i}`,
  statsId: `transcendtext${2 * i + 2}`
}))

const particleRow: Entry[] = [0, 1, 2, 3, 4].map((i): Building => ({
  imgId: `particles${i + 1}`,
  imgAlt: particleNames[i],
  imgSrc: `Pictures/Default/ParticlesTier${i + 1}.png`,
  descId: `reincarnationtext${i + 1}`,
  buyId: `buyparticles${i + 1}`,
  toggleId: `toggle${22 + i}`,
  toggleIdAttr: `${22 + i}`,
  statsId: `reincarnationtext${i + 6}`,
  noImageClass: i === 0
}))

const tesseractRow: Entry[] = [0, 1, 2, 3, 4].map((i): Building => ({
  imgId: `tesseracts${i + 1}`,
  imgAlt: tesseractNames[i],
  imgSrc: `Pictures/Default/TesseractTier${i + 1}.png`,
  descId: `ascendText${i + 1}`,
  buyId: `buyTesseracts${i + 1}`,
  toggleId: `tesseractAutoToggle${i + 1}`,
  statsId: `ascendText${i + 6}`
}))

export const populateBuildingButtonRows = () => {
  const rows: [string, Entry[]][] = [
    ['coinBuildings', coinRow],
    ['prestige', diamondRow],
    ['transcension', mythosRow],
    ['reincarnation', particleRow],
    ['ascension', tesseractRow]
  ]

  for (const [tabId, entries] of rows) {
    const row = DOMCacheGetOrSet(tabId).querySelector<HTMLDivElement>('.buttonRow')
    if (row) {
      if (isMobile) {
        row.classList.add('mobile')
      }
      row.innerHTML = renderRow(entries)
    }
  }
}

const getAutobuyers = (control: HTMLButtonElement): HTMLElement[] => {
  const row = control.closest('.buttonRow')
  if (!row) {
    return []
  }

  return Array.from(row.querySelectorAll<HTMLElement>('.autobuyerToggleButton'))
    .filter((toggle) => toggle.style.display !== 'none')
}

const getVisibilityControl = (row: HTMLElement): HTMLButtonElement | null =>
  row.querySelector<HTMLButtonElement>('.automatedBuildingVisibilityToggle')

const hasVisibleBuildings = (elements: Element[]) =>
  elements.some((element) => !element.classList.contains('buildingHiddenByAutomation'))

const getTesseractIndex = (toggle: HTMLElement): number => Number(toggle.id.slice('tesseractAutoToggle'.length))

const autobuyerIsEnabled = (toggle: HTMLElement): boolean => {
  const toggleId = toggle.getAttribute('toggleid')
  return toggleId === null
    ? player.autoTesseracts[getTesseractIndex(toggle)]
    : player.toggles[Number(toggleId)]
}

const setAutobuyer = (toggle: HTMLElement, enabled: boolean) => {
  const toggleId = toggle.getAttribute('toggleid')
  if (toggleId === null) {
    player.autoTesseracts[getTesseractIndex(toggle)] = enabled
  } else {
    player.toggles[Number(toggleId)] = enabled
  }
}

const updateBuildingVisibility = (row: HTMLElement, autobuyers: HTMLElement[]) => {
  const visibilityControl = getVisibilityControl(row)
  if (!visibilityControl) {
    return
  }

  const hideAutomated = visibilityControl.getAttribute('aria-pressed') === 'true'

  for (const toggle of row.querySelectorAll<HTMLElement>('.autobuyerToggleButton')) {
    toggle.parentElement?.classList.remove('buildingHiddenByAutomation')
  }

  if (hideAutomated) {
    for (const toggle of autobuyers.filter(autobuyerIsEnabled)) {
      toggle.parentElement?.classList.add('buildingHiddenByAutomation')
    }
  }

  const rowChildren = Array.from(row.children)

  for (const [index, child] of rowChildren.entries()) {
    if (!child.classList.contains('buildingSpacer')) {
      continue
    }

    const buildingsBefore = rowChildren.slice(0, index)
      .filter((element) =>
        !element.classList.contains('buildingAutomationControls')
        && !element.classList.contains('buildingSpacer')
      )
    const buildingsAfter = rowChildren.slice(index + 1)
      .filter((element) =>
        !element.classList.contains('buildingAutomationControls')
        && !element.classList.contains('buildingSpacer')
      )
    child.classList.toggle(
      'buildingHiddenByAutomation',
      hideAutomated && (!hasVisibleBuildings(buildingsBefore) || !hasVisibleBuildings(buildingsAfter))
    )
  }

  visibilityControl.style.display = autobuyers.length > 0 ? '' : 'none'
  visibilityControl.textContent = i18next.t(
    hideAutomated ? 'buildings.showAutomated' : 'buildings.hideAutomated'
  )
  visibilityControl.style.border = `2px solid ${hideAutomated ? 'green' : 'red'}`
}

export const updateBuildingAutomationButtons = () => {
  const controls = document.querySelectorAll<HTMLButtonElement>('.buildingAutomationToggle')

  for (const control of controls) {
    const autobuyers = getAutobuyers(control)
    const allEnabled = autobuyers.length > 0 && autobuyers.every(autobuyerIsEnabled)
    const row = control.closest<HTMLElement>('.buttonRow')

    control.style.display = autobuyers.length > 0 ? '' : 'none'
    control.textContent = i18next.t(
      allEnabled ? 'buildings.disableAllAutomation' : 'buildings.enableAllAutomation'
    )
    control.style.border = `2px solid ${allEnabled ? 'green' : 'red'}`
    control.setAttribute('aria-pressed', `${allEnabled}`)

    if (row) {
      updateBuildingVisibility(row, autobuyers)
    }
  }
}

export const toggleAllBuildingAutomation = (control: HTMLButtonElement) => {
  const autobuyers = getAutobuyers(control)
  const enable = !autobuyers.every(autobuyerIsEnabled)

  for (const autobuyer of autobuyers) {
    setAutobuyer(autobuyer, enable)
  }
}

export const toggleAutomatedBuildingVisibility = (control: HTMLButtonElement) => {
  const hideAutomated = control.getAttribute('aria-pressed') !== 'true'
  control.setAttribute('aria-pressed', `${hideAutomated}`)
  updateBuildingAutomationButtons()
}
