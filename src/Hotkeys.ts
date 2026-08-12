import i18next from 'i18next'
import { boostAccelerator, buyBuilding } from './Buy'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { confirmAntSacrifice } from './Features/Ants/AntSacrifice/sacrifice'
import { promocodes } from './ImportExport'
import { runes } from './Runes'
import { useConsumablePrompt } from './Shop'
import { player, resetCheck, synergismHotkeys } from './Synergism'
import { getActiveSubTab, keyboardTabChange as kbTabChange, tabRow, Tabs } from './Tabs'
import { confirmReply, toggleAutoChallengeRun } from './Toggles'
import { Alert, Confirm, Prompt } from './UpdateHTML'
import { Globals as G } from './Variables'

interface Hotkey {
  name: string
  action: () => void
  allowDuringNotification?: boolean
  unlocked?: () => boolean
  hiddenOnMobile?: boolean
}

const defaultHotkeys = new Map<string, Hotkey>([
  ['A', { name: 'hotkeys.names.buyAccelerators', action: () => buyBuilding('accelerator') }],
  [
    'B',
    {
      name: 'hotkeys.names.boostAccelerator',
      action: () => boostAccelerator(),
      unlocked: () => player.unlocks.transcend
    }
  ],
  [
    'C',
    {
      name: 'hotkeys.names.autoChallenge',
      action: () => {
        toggleChallengeSweep()
      },
      unlocked: () => player.researches[150] > 0
    }
  ],
  [
    'E',
    {
      name: 'hotkeys.names.exitTRChallenge',
      action: () => {
        if (player.autoChallengeRunning) {
          toggleChallengeSweep()
        } else {
          exitTranscendAndPrestigeChallenge()
        }
      },
      unlocked: () =>
        player.autoChallengeRunning
        || player.currentChallenge.transcension !== 0
        || player.currentChallenge.reincarnation !== 0
    }
  ],
  ['M', { name: 'hotkeys.names.multipliers', action: () => buyBuilding('multiplier') }],
  [
    'N',
    {
      name: 'hotkeys.names.noCancel',
      action: () => confirmReply(false),
      allowDuringNotification: true,
      hiddenOnMobile: true
    }
  ],
  [
    'P',
    {
      name: 'hotkeys.names.resetPrestige',
      action: () => resetCheck('prestige'),
      unlocked: () => player.unlocks.coinfour
    }
  ],
  [
    'R',
    {
      name: 'hotkeys.names.resetReincarnate',
      action: () => resetCheck('reincarnation'),
      unlocked: () => player.unlocks.transcend
    }
  ],
  [
    'S',
    {
      name: 'hotkeys.names.sacrificeAnts',
      action: () => confirmAntSacrifice(),
      unlocked: () => player.unlocks.anthill
    }
  ],
  [
    'T',
    {
      name: 'hotkeys.names.resetTranscend',
      action: () => resetCheck('transcension'),
      unlocked: () => player.unlocks.prestige
    }
  ],
  [
    'Y',
    {
      name: 'hotkeys.names.yesOK',
      action: () => confirmReply(true),
      allowDuringNotification: true,
      hiddenOnMobile: true
    }
  ],
  ['ARROWLEFT', { name: 'hotkeys.names.backTab', action: () => kbTabChange(-1), hiddenOnMobile: true }],
  ['ARROWRIGHT', { name: 'hotkeys.names.nextTab', action: () => kbTabChange(1), hiddenOnMobile: true }],
  ['ARROWUP', { name: 'hotkeys.names.backSubtab', action: () => kbTabChange(-1, true), hiddenOnMobile: true }],
  ['ARROWDOWN', { name: 'hotkeys.names.nextSubtab', action: () => kbTabChange(1, true), hiddenOnMobile: true }],
  [
    'SHIFT+A',
    {
      name: 'hotkeys.names.resetAscend',
      action: () => resetCheck('ascension'),
      unlocked: () => player.unlocks.ascensions
    }
  ],
  [
    'SHIFT+C',
    {
      name: 'hotkeys.names.cleanseCorruptions',
      action: () => {
        player.corruptions.used.resetCorruptions()
        player.corruptions.next.resetCorruptions()
      },
      unlocked: () => player.challengecompletions[11] > 0
    }
  ],
  [
    'SHIFT+D',
    {
      name: 'hotkeys.names.specActionAdd1',
      action: () => promocodes('add', 1),
      unlocked: () => true
    }
  ],
  [
    'SHIFT+E',
    {
      name: 'hotkeys.names.exitAscChallenge',
      action: () => resetCheck('ascensionChallenge'), // Its already checks if inside Asc. Challenge
      unlocked: () => player.currentChallenge.ascension !== 0
    }
  ],
  [
    'SHIFT+O',
    {
      name: 'hotkeys.names.useOffPotion',
      action: () => useConsumablePrompt('offeringPotion'),
      unlocked: () => player.shopUpgrades.offeringPotion > 0
    }
  ],
  [
    'SHIFT+P',
    {
      name: 'hotkeys.names.useObtPotion',
      action: () => useConsumablePrompt('obtainiumPotion'),
      unlocked: () => player.shopUpgrades.obtainiumPotion > 0
    }
  ],
  [
    'SHIFT+S',
    {
      name: 'hotkeys.names.resetSingularity',
      action: () => resetCheck('singularity'),
      unlocked: () => runes.antiquities.level > 0 || player.highestSingularityCount > 0
    }
  ],
  ['CTRL+B', { name: 'hotkeys.names.unhideTabs', action: () => tabRow.reappend(), hiddenOnMobile: true }]
])

let hotkeysEnabled = false

let hotkeys = new Map<string, Hotkey>(defaultHotkeys)

const toggleChallengeSweep = (): void => {
  if (player.researches[150] > 0) {
    toggleAutoChallengeRun()
    if (!player.autoChallengeRunning) {
      exitTranscendAndPrestigeChallenge()
    }
  }
}

const exitTranscendAndPrestigeChallenge = () => {
  if (player.currentChallenge.reincarnation !== 0) {
    void resetCheck('reincarnationChallenge', undefined, true)
  }
  if (player.currentChallenge.transcension !== 0) {
    void resetCheck('transcensionChallenge', undefined, true)
  }
}

const isHotkeyBlockedByOverlay = (key: string, hotkey: Hotkey) =>
  key !== 'ENTER' && DOMCacheGetOrSet('transparentBG').style.display === 'block' && !hotkey.allowDuringNotification

const updateLastHotkeyDisplay = (key: string, hotkeyName: string) => {
  if (G.currentTab !== Tabs.Settings || getActiveSubTab() !== 7) {
    return
  }

  DOMCacheGetOrSet('lastHotkey').textContent = key
  DOMCacheGetOrSet('lastHotkeyName').textContent = hotkeyName
}

const activateHotkey = (key: string) => {
  if (!hotkeysEnabled || !player.toggles[39]) {
    return ''
  }

  const hotkey = hotkeys.get(key)
  if (!hotkey || isHotkeyBlockedByOverlay(key, hotkey)) {
    return ''
  }

  const hotkeyName = i18next.t(hotkey.name)
  hotkey.action()
  updateLastHotkeyDisplay(key, hotkeyName)

  return hotkeyName
}

const eventHotkeys = (event: KeyboardEvent): void => {
  if (!hotkeysEnabled || !player.toggles[39]) {
    // There was a race condition where a user could spam Shift + S + Enter to
    // Singularity which would cause a bug when rune 7 was bought. To prevent this,
    // the game disables hotkeys when on the offline progress screen, and re-
    // enables them when the user leaves.
    return
  }

  if (document.activeElement?.localName === 'input') {
    // https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation
    // finally fixes the bug where hotkeys would be activated when typing in an input field
    event.stopPropagation()
    return
  }

  synergismHotkeys(event, event.code.replace(/^(Digit|Numpad)/, '').toUpperCase())

  let keyPrefix = ''
  if (event.ctrlKey) {
    keyPrefix += 'CTRL+'
  }
  if (event.shiftKey) {
    keyPrefix += 'SHIFT+'
  }
  if (event.altKey) {
    keyPrefix += 'ALT+'
  }

  const key = keyPrefix + event.key.toUpperCase()
  const hotkeyName = activateHotkey(key)
  if (hotkeyName !== '') {
    event.preventDefault()
  }

  if (G.currentTab === Tabs.Settings && getActiveSubTab() === 7) {
    updateLastHotkeyDisplay(key, hotkeyName)

    if (DOMCacheGetOrSet('promptWrapper').style.display === 'block') {
      ;(DOMCacheGetOrSet('prompt_text') as HTMLInputElement).value = key
      event.preventDefault()
    }
  }
}

// eslint-disable-next-line no-control-regex
const latin1Regex = /^[\x00-\xFF]*$/

const makeSlot = (key: string, descr: string) => {
  const div = document.createElement('div')
  div.classList.add('hotkeyItem')

  const button = document.createElement('button')
  button.classList.add('actualHotkey')
  button.textContent = key
  button.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement
    const oldKey = target.textContent.toUpperCase()
    const name = hotkeys.get(oldKey)?.name
      ?? target.nextSibling?.textContent

    // new value to set key as, unformatted
    const newKey = await Prompt(`
        Enter the new key you want to activate ${name} with.

        MDN has a list of values for "special keys" if you would like to use one:
        https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values

        You can also prefix your hotkey with [Ctrl,Shift,Alt]+<key>
        `)

    if (typeof newKey !== 'string') {
      return
    }

    const toSet = newKey.toUpperCase()

    if (newKey.length === 0) {
      return void Alert('You didn\'t enter anything, canceled!')
    }

    if (!isNaN(Number(newKey))) {
      return void Alert('Number keys are currently unavailable!')
    }

    if (!latin1Regex.test(toSet)) {
      return void Alert(i18next.t('hotkeys.invalidKey'))
    }

    if (hotkeys.has(toSet) || oldKey === toSet) {
      return void Alert('That key is already binded to an action, use another key instead!')
    } else if (hotkeys.has(oldKey)) {
      const old = hotkeys.get(oldKey)!

      hotkeys.set(toSet, old)
      hotkeys.delete(oldKey)

      const keys = Object.keys(player.hotkeys)
      player.hotkeys[keys.length] = [oldKey, toSet]

      target.textContent = toSet

      enableHotkeys()
    } else {
      return void Alert(`No hotkey is triggered by ${oldKey}!`)
    }
  })

  const p = document.createElement('p')
  p.id = 'hotKeyDesc'
  p.textContent = descr

  div.appendChild(button)
  div.appendChild(p)

  return div
}

const mobileHotkeyKeyLabels: Record<string, string> = {
  CTRL: 'Ctrl',
  SHIFT: 'Shift',
  ALT: 'Alt',
  ARROWLEFT: 'Left',
  ARROWRIGHT: 'Right',
  ARROWUP: 'Up',
  ARROWDOWN: 'Down'
}

const formatMobileHotkeyKey = (key: string) =>
  key.split('+').map((part) => mobileHotkeyKeyLabels[part] ?? part).join(' + ')

const makeMobileHotkeyButton = (key: string, descr: string) => {
  const button = document.createElement('button')
  button.type = 'button'
  button.classList.add('mobileHotkeyAction')
  button.dataset.mobileHotkey = key
  button.disabled = !hotkeysEnabled || !player.toggles[39]

  const keyText = document.createElement('span')
  keyText.classList.add('mobileHotkeyKey')
  keyText.textContent = formatMobileHotkeyKey(key)

  const label = document.createElement('span')
  label.classList.add('mobileHotkeyLabel')
  label.textContent = descr

  button.append(keyText, label)

  return button
}

let mobileHotkeyPanelRegistered = false

const isVisibleOnMobile = (hotkey: Hotkey) => !hotkey.hiddenOnMobile && (hotkey.unlocked?.() ?? true)

const renderMobileHotkeyButtons = () => {
  if (!mobileHotkeyPanelRegistered) {
    return
  }

  const actions = DOMCacheGetOrSet('mobileHotkeysActions')
  const fragment = document.createDocumentFragment()

  for (const [key, hotkey] of hotkeys.entries()) {
    if (isVisibleOnMobile(hotkey)) {
      fragment.append(makeMobileHotkeyButton(key, i18next.t(hotkey.name)))
    }
  }

  actions.replaceChildren(fragment)
}

const setMobileHotkeyPanelOpen = (open: boolean) => {
  const openButton = DOMCacheGetOrSet('mobileHotkeysOpen')
  const overlay = DOMCacheGetOrSet('mobileHotkeysOverlay')

  overlay.classList.toggle('mobileHotkeysOverlayOpen', open)
  overlay.setAttribute('aria-hidden', `${!open}`)
  openButton.setAttribute('aria-expanded', `${open}`)

  if (open) {
    DOMCacheGetOrSet('mobileHotkeysClose').focus()
  } else {
    openButton.focus()
  }
}

const openMobileHotkeyPanel = () => {
  renderMobileHotkeyButtons()
  setMobileHotkeyPanelOpen(true)
}

export const registerMobileHotkeyPanel = () => {
  if (mobileHotkeyPanelRegistered) {
    return
  }

  mobileHotkeyPanelRegistered = true

  const openButton = DOMCacheGetOrSet('mobileHotkeysOpen')
  const closeButton = DOMCacheGetOrSet('mobileHotkeysClose')
  const overlay = DOMCacheGetOrSet('mobileHotkeysOverlay')
  const actions = DOMCacheGetOrSet('mobileHotkeysActions')

  openButton.addEventListener('click', openMobileHotkeyPanel)
  closeButton.addEventListener('click', () => setMobileHotkeyPanelOpen(false))
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      setMobileHotkeyPanelOpen(false)
    }
  })
  overlay.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setMobileHotkeyPanelOpen(false)
    }
  })
  actions.addEventListener('click', (event) => {
    const button = event.target instanceof Element
      ? event.target.closest<HTMLButtonElement>('button[data-mobile-hotkey]')
      : null

    if (button === null || !actions.contains(button)) {
      return
    }

    const key = button.dataset.mobileHotkey
    if (key === undefined || activateHotkey(key) === '') {
      return
    }

    event.preventDefault()
    renderMobileHotkeyButtons()
  })

  renderMobileHotkeyButtons()
}

export const disableHotkeys = () => hotkeysEnabled = false

export const enableHotkeys = () => {
  changeHotkeys()

  const hotkey = document.querySelector('.hotkeys')!

  while (hotkey.firstChild) {
    hotkey.removeChild(hotkey.firstChild)
  }

  for (const [key, { name }] of hotkeys.entries()) {
    const div = makeSlot(key, i18next.t(name))

    hotkey.appendChild(div)
  }

  hotkeysEnabled = true
  renderMobileHotkeyButtons()
}

const changeHotkeys = () => {
  hotkeys = new Map(defaultHotkeys)

  for (const key in player.hotkeys) {
    const oldKey = player.hotkeys[key][0]
    const toSet = player.hotkeys[key][1]
    if (hotkeys.has(oldKey)) {
      const old = hotkeys.get(oldKey)!
      hotkeys.set(toSet, old)
      hotkeys.delete(oldKey)
    } else {
      Reflect.deleteProperty(player.hotkeys, key)
    }
  }
}

export const resetHotkeys = async () => {
  enableHotkeys()

  const keys = Object.keys(player.hotkeys)
  if (keys.length === 0) {
    return await Alert('You haven\'t changed the hotkey')
  }

  let settext = ''
  const hotkey = new Map(defaultHotkeys)
  for (const key in player.hotkeys) {
    const oldKey = player.hotkeys[key][0]
    const toSet = player.hotkeys[key][1]
    if (hotkey.has(oldKey)) {
      const old = hotkey.get(oldKey)!
      settext += `\t${oldKey}[${old.name}] to ${toSet}, `
      hotkey.set(toSet, old)
      hotkey.delete(oldKey)
    }
  }

  const confirmed = await Confirm(
    `Are you sure you want to default all the changed hotkeys?\nBelow is a history of hotkeys you have changed\n\n${settext}`
  )
  if (confirmed) {
    hotkeys = new Map(defaultHotkeys)
    player.hotkeys = {}
    enableHotkeys()
  }
}

export const pressedKeys = new Set<string>()

document.addEventListener('keydown', (event) => {
  eventHotkeys(event)

  pressedKeys.add(event.code)
})

document.addEventListener('keyup', (event) => pressedKeys.delete(event.code))
