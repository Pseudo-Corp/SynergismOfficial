import i18next from 'i18next'
import { boostAccelerator, buyAccelerator, buyMultiplier } from './Buy'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { confirmAntSacrifice } from './Features/Ants/AntSacrifice/sacrifice'
import { promocodes } from './ImportExport'
import { useConsumablePrompt } from './Shop'
import { player, resetCheck, synergismHotkeys } from './Synergism'
import { getActiveSubTab, keyboardTabChange as kbTabChange, tabRow, Tabs } from './Tabs'
import { confirmReply, toggleAutoChallengeRun } from './Toggles'
import { Alert, Confirm, Prompt } from './UpdateHTML'
import { Globals as G } from './Variables'

export const defaultHotkeys = new Map<string, [string, () => unknown, /* hide during notification */ boolean]>([
  ['A', ['hotkeys.names.buyAccelerators', () => buyAccelerator(), false]],
  ['B', ['hotkeys.names.boostAccelerator', () => boostAccelerator(), false]],
  ['C', ['autoChallenge', () => {
    toggleChallengeSweep()
  }, false]],
  ['E', ['hotkeys.names.exitTRChallenge', () => {
    if (player.autoChallengeRunning) {
      toggleChallengeSweep()
    } else {
      exitTranscendAndPrestigeChallenge()
    }
  }, false]],
  ['M', ['hotkeys.names.multipliers', () => buyMultiplier(), false]],
  ['N', ['hotkeys.names.noCancel', () => confirmReply(false), true]],
  ['P', ['hotkeys.names.resetPrestige', () => resetCheck('prestige'), false]],
  ['R', ['hotkeys.names.resetReincarnate', () => resetCheck('reincarnation'), false]],
  ['S', ['hotkeys.names.sacrificeAnts', () => confirmAntSacrifice(), false]],
  ['T', ['hotkeys.names.resetTranscend', () => resetCheck('transcension'), false]],
  ['Y', ['hotkeys.names.yesOK', () => confirmReply(true), true]],
  ['ARROWLEFT', ['hotkeys.names.backTab', () => kbTabChange(-1), false]],
  ['ARROWRIGHT', ['hotkeys.names.nextTab', () => kbTabChange(1), false]],
  ['ARROWUP', ['hotkeys.names.backSubtab', () => kbTabChange(-1, true), false]],
  ['ARROWDOWN', ['hotkeys.names.nextSubtab', () => kbTabChange(1, true), false]],
  ['SHIFT+A', ['hotkeys.names.resetAscend', () => resetCheck('ascension'), false]],
  ['SHIFT+C', ['hotkeys.names.cleanseCorruptions', () => {
    player.corruptions.used.resetCorruptions()
    player.corruptions.next.resetCorruptions()
  }, false]],
  ['SHIFT+D', ['hotkeys.names.specActionAdd1', () => promocodes('add', 1), false]],
  ['SHIFT+E', ['hotkeys.names.exitAscChallenge', () => resetCheck('ascensionChallenge'), false]], // Its already checks if inside Asc. Challenge
  ['SHIFT+O', ['hotkeys.names.useOffPotion', () => useConsumablePrompt('offeringPotion'), false]],
  ['SHIFT+P', ['hotkeys.names.useObtPotion', () => useConsumablePrompt('obtainiumPotion'), false]],
  ['SHIFT+S', ['hotkeys.names.resetSingularity', () => resetCheck('singularity'), false]],
  ['CTRL+B', ['hotkeys.names.unhideTabs', () => tabRow.reappend(), false]]
])

export let hotkeysEnabled = false

export let hotkeys = new Map<string, [string, () => unknown, boolean]>(defaultHotkeys)

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
  const hotkey = hotkeys.get(key)

  // Disable hotkeys if notifications are occurring
  if (key !== 'ENTER' && DOMCacheGetOrSet('transparentBG').style.display === 'block') {
    if (hotkey && !hotkey[2]) {
      return
    }
  }

  let hotkeyName = ''
  if (hotkey) {
    hotkeyName = i18next.t(hotkey[0])
    hotkey[1]()
    event.preventDefault()
  }

  if (G.currentTab === Tabs.Settings && getActiveSubTab() === 7) {
    DOMCacheGetOrSet('lastHotkey').textContent = key
    DOMCacheGetOrSet('lastHotkeyName').textContent = hotkeyName

    if (DOMCacheGetOrSet('promptWrapper').style.display === 'block') {
      ;(DOMCacheGetOrSet('prompt_text') as HTMLInputElement).value = key
      event.preventDefault()
    }
  }
}

const makeSlot = (key: string, descr: string) => {
  const div = document.createElement('div')
  div.classList.add('hotkeyItem')

  const button = document.createElement('button')
  button.classList.add('actualHotkey')
  button.textContent = key
  button.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement
    const oldKey = target.textContent!.toUpperCase()
    const name = hotkeys.get(oldKey)?.[0]
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

export const disableHotkeys = () => hotkeysEnabled = false

export const enableHotkeys = () => {
  changeHotkeys()

  const hotkey = document.querySelector('.hotkeys')!

  for (const child of Array.from(hotkey.children)) {
    hotkey.removeChild(child)
  }

  for (const [key, [descr]] of [...hotkeys.entries()]) {
    const div = makeSlot(key, i18next.t(descr))

    hotkey.appendChild(div)
  }

  hotkeysEnabled = true
}

export const changeHotkeys = () => {
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
      settext += `\t${oldKey}[${old[0]}] to ${toSet}, `
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
