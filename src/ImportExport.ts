import ClipboardJS from 'clipboard'
import i18next from 'i18next'
import localforage from 'localforage'
import LZString from 'lz-string'
import { achievementaward } from './Achievements'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { octeractGainPerSecond } from './Calculate'
import { testing, version } from './Config'
import { Synergism } from './Events'
import { addTimers } from './Helper'
import { quarkHandler } from './Quark'
import { shopData } from './Shop'
import { singularityData } from './singularity'
import { synergismStage } from './Statistics'
import { blankSave, format, player, reloadShit, saveCheck, saveSynergy } from './Synergism'
import { changeSubTab, changeTab, Tabs } from './Tabs'
import type { Player } from './types/Synergism'
import { Alert, Confirm, Prompt } from './UpdateHTML'
import { cleanString, getElementById, productContents, sumContents } from './Utility'
import { btoa } from './Utility'
import { Globals as G } from './Variables'

const format24 = new Intl.DateTimeFormat('EN-GB', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  hour12: false,
  minute: '2-digit',
  second: '2-digit'
})
const format12 = new Intl.DateTimeFormat('EN-GB', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  hour12: true,
  minute: '2-digit',
  second: '2-digit'
})

const hour = 3600000

const getRealTime = (type = 'default', use12 = false) => {
  const format = use12 ? format12 : format24
  const datePartsArr = format
    .formatToParts(new Date())
    .filter((x) => x.type !== 'literal')
    .map((p) => ({ [p.type]: p.value }))

  const dateParts = Object.assign({}, ...datePartsArr) as Record<
    string,
    string
  >

  const period = use12 ? ` ${dateParts.dayPeriod.toUpperCase()}` : ''
  const weekday = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
  switch (type) {
    case 'default':
      return `${dateParts.year}-${dateParts.month}-${dateParts.day} ${dateParts.hour}_${dateParts.minute}_${dateParts.second}${period}`
    case 'short':
      return `${dateParts.year}${dateParts.month}${dateParts.day}${dateParts.hour}${dateParts.minute}${dateParts.second}`
    case 'year':
      return `${dateParts.year}`
    case 'month':
      return `${dateParts.month}`
    case 'day':
      return `${dateParts.day}`
    case 'hour':
      return `${dateParts.hour}`
    case 'minute':
      return `${dateParts.minute}`
    case 'second':
      return `${dateParts.second}`
    case 'period':
      return `${dateParts.dayPeriod.toUpperCase()}`
    case 'weekday':
      return `${weekday[new Date().getUTCDay()]}`
    default:
      return type
  }
}

export const updateSaveString = (input: HTMLInputElement) => {
  const value = input.value.slice(0, 100)
  player.saveString = value === '' ? blankSave.saveString : cleanString(value)
  ;(DOMCacheGetOrSet('saveStringInput') as HTMLInputElement).value = player.saveString
}

export const getVer = () => /[\d?=.]+/.exec(version)?.[0] ?? version

export const saveFilename = () => {
  const s = player.saveString
  const t = s.replace(/\$(.*?)\$/g, (_, b) => {
    switch (b) {
      case 'VERSION':
        return `v${version}`
      case 'TIME':
        return getRealTime()
      case 'TIME12':
        return getRealTime(undefined, true)
      case 'SING':
        return `Singularity ${player.singularityCount}`
      case 'SINGS':
        return `${player.singularityCount}`
      case 'VER':
        return getVer()
      case 'TIMES':
        return getRealTime('short')
      case 'YEAR':
        return getRealTime('year')
      case 'Y':
        return getRealTime('year')
      case 'MONTH':
        return getRealTime('month')
      case 'M':
        return getRealTime('month')
      case 'DAY':
        return getRealTime('day')
      case 'D':
        return getRealTime('day')
      case 'HOUR':
        return getRealTime('hour')
      case 'H':
        return getRealTime('hour')
      case 'H12':
        return getRealTime('hour', true)
      case 'MINUTE':
        return getRealTime('minute')
      case 'MI':
        return getRealTime('minute')
      case 'SECOND':
        return getRealTime('second')
      case 'S':
        return getRealTime('second')
      case 'PERIOD':
        return getRealTime('period', true)
      case 'P':
        return getRealTime('period', true)
      case 'WEEKDAY':
        return getRealTime('weekday')
      case 'W':
        return getRealTime('weekday')
      case 'DATE':
        return `${Date.now()}`
      case 'DATES':
        return `${Math.floor(Date.now() / 1000)}`
      case 'QUARK':
        return `${Math.floor(Number(player.worlds))}`
      case 'QUARKS':
        return format(Number(player.worlds))
      case 'GQ':
        return `${Math.floor(player.goldenQuarks)}`
      case 'GQS':
        return format(player.goldenQuarks)
      case 'STAGE':
        return synergismStage(0)
      default:
        return `${b}`
    }
  })

  return cleanString(t)
}

export const exportData = async (text: string, fileName: string) => {
  const toClipboard = getElementById<HTMLInputElement>('saveType').checked
  if (toClipboard) {
    try {
      // This can fail for two reasons:
      // - TypeError (browser doesn't support this feature)
      // - Failed to copy (browser limitation; Safari)
      await navigator.clipboard.writeText(text)
      DOMCacheGetOrSet('exportinfo').textContent = i18next.t(
        'importexport.copiedSave'
      )
    } catch (err) {
      // So we fallback to the deprecated way of doing it,
      // which isn't limited by any browser.

      // Old/bad browsers (legacy Edge, Safari because of limitations)
      const textArea = document.createElement('textarea')

      textArea.setAttribute('style', 'top: 0; left: 0; position: fixed;')
      // For future Khafra: html5 attributes have no limit in length
      textArea.setAttribute('data-clipboard-text', text)

      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      const clipboard = new ClipboardJS(textArea)

      const cleanup = () => {
        clipboard.destroy()
        document.body.removeChild(textArea)
      }

      clipboard.on('success', () => {
        DOMCacheGetOrSet('exportinfo').textContent = i18next.t(
          'importexport.copiedSave'
        )
        cleanup()
      })

      clipboard.on('error', () => {
        DOMCacheGetOrSet('exportinfo').textContent = i18next.t(
          'importexport.exportFailed'
        )
        void Alert(i18next.t('importexport.unableCopySave')).finally(cleanup)
      })
    }
  } else {
    const a = document.createElement('a')
    a.setAttribute('href', `data:text/plain;charset=utf-8,${text}`)
    a.setAttribute('download', fileName)
    a.setAttribute('id', 'downloadSave')
    // "Starting in Firefox 75, the click() function works even when the element is not attached to a DOM tree."
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/click
    // so let's have it work on older versions of Firefox, doesn't change functionality.
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    DOMCacheGetOrSet('exportinfo').textContent = i18next.t(
      'importexport.copiedFile'
    )
  }
  setTimeout(() => (DOMCacheGetOrSet('exportinfo').textContent = ''), 15_000)
}

export const exportSynergism = async (
  shouldSetLastSaveSoWeStopFuckingBotheringPeople = true
) => {
  player.offlinetick = Date.now()

  if (shouldSetLastSaveSoWeStopFuckingBotheringPeople) {
    player.lastExportedSave = Date.now()

    const quarkData = quarkHandler()

    let bonusGQMultiplier = 1
    bonusGQMultiplier *= 1 + player.worlds.BONUS / 100
    bonusGQMultiplier *= player.highestSingularityCount >= 100
      ? 1 + player.highestSingularityCount / 50
      : 1
    if (+player.singularityUpgrades.goldenQuarks3.getEffect().bonus > 0) {
      player.goldenQuarks += Math.floor(
        player.goldenQuarksTimer
          / (3600 / +player.singularityUpgrades.goldenQuarks3.getEffect().bonus)
      ) * bonusGQMultiplier
      player.goldenQuarksTimer = player.goldenQuarksTimer
        % (3600 / +player.singularityUpgrades.goldenQuarks3.getEffect().bonus)
    }
    if (quarkData.gain >= 1) {
      player.worlds.add(quarkData.gain)
      player.quarkstimer = player.quarkstimer % (3600 / quarkData.perHour)
    }
  }

  const saved = await saveSynergy()

  if (!saved) {
    return
  }

  const save = (await localforage.getItem<Blob>('Synergysave2'))
    ?? localStorage.getItem('Synergysave2')
  const saveString = typeof save === 'string' ? save : await save?.text()

  if (saveString === undefined) {
    return Alert('How?')
  }

  await exportData(saveString, saveFilename())
  setTimeout(() => (DOMCacheGetOrSet('exportinfo').textContent = ''), 15_000)
}

export const reloadDeleteGame = async () => {
  await Alert(i18next.t('importexport.reloadDeletePrompt'))
  await resetGame()
}

export const resetGame = async () => {
  const a = window.crypto.getRandomValues(new Uint16Array(1))[0] % 16
  const b = window.crypto.getRandomValues(new Uint16Array(1))[0] % 16

  const result = await Prompt(
    i18next.t('importexport.resetPrompt', { a, b, sum: a + b })
  )
  if (result === null || Number(result) !== a + b) {
    return Alert(i18next.t('importexport.wrongAnswer'))
  }

  const hold = Object.assign({}, blankSave, {
    codes: Array.from(blankSave.codes)
  }) as Player
  // Reset Displays
  changeTab(Tabs.Buildings)
  changeSubTab(Tabs.Buildings, { page: 0 })
  changeSubTab(Tabs.Runes, { page: 0 }) // Set 'runes' subtab back to 'runes' tab
  changeSubTab(Tabs.WowCubes, { page: 0 }) // Set 'cube tribues' subtab back to 'cubes' tab
  changeSubTab(Tabs.Corruption, { page: 0 }) // set 'corruption main'
  changeSubTab(Tabs.Singularity, { page: 0 }) // set 'singularity main'
  changeSubTab(Tabs.Settings, { page: 0 }) // set 'statistics main'
  // Import Game
  await importSynergism(btoa(JSON.stringify(hold)), true)
}

export const importData = async (
  e: Event,
  importFunc: (save: string | null) => Promise<void> | Promise<undefined>
) => {
  const element = e.target as HTMLInputElement
  const file = element.files![0]
  let save = ''
  // https://developer.mozilla.org/en-US/docs/Web/API/Blob/text
  // not available in (bad) browsers like Safari 11
  if (typeof Blob.prototype.text === 'function') {
    save = await file.text()
  } else {
    const reader = new FileReader()
    reader.readAsText(file)
    const text = await new Promise<string>((res) => {
      reader.addEventListener('load', () => res(reader.result!.toString()))
    })

    save = text
  }

  element.value = ''
  handleLastModified(file.lastModified)

  return importFunc(save)
}

export const importSynergism = async (input: string | null, reset = false) => {
  if (typeof input !== 'string') {
    return Alert(i18next.t('importexport.unableImport'))
  }

  const d = LZString.decompressFromBase64(input)
  const f = d ? (JSON.parse(d) as Player) : (JSON.parse(atob(input)) as Player)

  if (
    f.exporttest === 'YES!'
    || f.exporttest === true
    || (f.exporttest === false && testing)
    || (f.exporttest === 'NO!' && testing)
  ) {
    const saveString = btoa(JSON.stringify(f))

    if (saveString === null) {
      return Alert(i18next.t('importexport.unableImport'))
    }

    saveCheck.canSave = false
    const item = new Blob([saveString], { type: 'text/plain' })
    localStorage.setItem('Synergysave2', saveString)
    await localforage.setItem<Blob>('Synergysave2', item)

    localStorage.setItem('saveScumIsCheating', Date.now().toString())

    await reloadShit(reset)
    saveCheck.canSave = true
    return
  } else {
    return Alert(i18next.t('importexport.loadTestInLive'))
  }
}

export const promocodesInfo = (input: string) => {
  const textElement = DOMCacheGetOrSet('promocodeinfo')
  let textMessage = `'${input}': `
  let availableUses = 0
  switch (input) {
    case 'daily':
      if (player.dailyCodeUsed) {
        textMessage += i18next.t('importexport.daily0Uses')
      } else {
        textMessage += i18next.t('importexport.daily1Uses')
      }
      break
    case 'add':
      availableUses = addCodeAvailableUses()
      if (availableUses === 0) {
        textMessage += i18next.t('importexport.add0Uses', {
          x: 0,
          y: format(addCodeTimeToNextUse(), 0)
        })
      } else if (availableUses !== 1) {
        textMessage += i18next.t('importexport.addUses', { x: availableUses })
      } else {
        textMessage += i18next.t('importexport.add1Uses', { x: availableUses })
      }

      break
    case 'time':
      availableUses = timeCodeAvailableUses()

      if (availableUses === 0) {
        textMessage += i18next.t('importexport.add0Uses', {
          x: 0,
          y: format(timeCodeTimeToNextUse(), 0)
        })
      } else {
        textMessage += i18next.t('importexport.timeMultiplier', {
          x: availableUses,
          y: format(timeCodeRewardMultiplier(), 2, true)
        })
      }

      break
    default:
      textMessage = ''
  }

  textElement.textContent = textMessage
}

export const promocodesPrompt = async () => {
  const input = await Prompt(i18next.t('importexport.promocodePrompt'))
  void promocodes(input)
}

export const promocodes = async (input: string | null, amount?: number) => {
  const el = DOMCacheGetOrSet('promocodeinfo')

  if (input === null) {
    return Alert(i18next.t('importexport.comeBackSoon'))
  }
  if (
    input === '23andme'
    && !player.codes.get(48)
    && G.isEvent
  ) {
    if (!player.dailyCodeUsed) {
      return Alert(
        'This event code gives you another usage of code \'daily\'. Please use that code and try this event code again.'
      )
    }

    player.codes.set(48, true)
    player.quarkstimer = quarkHandler().maxTime
    player.goldenQuarksTimer = 3600 * 24
    addTimers('ascension', 8 * 3600)
    player.dailyCodeUsed = false

    if (
      player.challenge15Exponent >= 1e15
      || player.highestSingularityCount > 0
    ) {
      player.hepteractCrafts.quark.CAP *= 2
      player.hepteractCrafts.quark.BAL += Math.min(
        1e13,
        player.hepteractCrafts.quark.CAP / 2
      )
    }
    if (player.highestSingularityCount > 0) {
      player.singularityUpgrades.goldenQuarks1.freeLevels += 1 + Math.floor(player.highestSingularityCount / 10)
      player.singularityUpgrades.goldenQuarks2.freeLevels += 1 + Math.floor(player.highestSingularityCount / 10)
      player.singularityUpgrades.goldenQuarks3.freeLevels += 1 + Math.floor(player.highestSingularityCount / 10)
      if (player.singularityUpgrades.octeractUnlock.getEffect().bonus) {
        player.octeractUpgrades.octeractImprovedQuarkHept.freeLevels += 0.05
      }
    }

    return Alert(
      `Not sponsored by the company! Your Quark timer(s) have been replenished and you have been given 8 real life hours of Ascension progress! Your daily code has also been reset for you.
                      ${
        player.challenge15Exponent >= 1e15
          || player.highestSingularityCount > 0
          ? 'Derpsmith also hacked your save to expand Quark Hepteract for free, and (to a limit) automatically filled the extra amount! What a generous, handsome gigachad.'
          : ''
      }
                      ${
        player.highestSingularityCount > 0
          ? 'You were also given free levels of GQ1-3!'
          : ''
      } 
                      ${
        player.singularityUpgrades.octeractUnlock.getEffect()
            .bonus
          ? 'Finally, you were given a tiny amount of free Octeract Quark Hepteract Improver upgrade!'
          : ''
      }`
    )
  }
  if (input === 'synergism2021' && !player.codes.get(1)) {
    player.codes.set(1, true)
    player.runeshards += 25
    player.worlds.add(50)
    el.textContent = i18next.t('importexport.promocodes.synergism2021')
  } else if (input === ':unsmith:' && player.achievements[243] < 1) {
    achievementaward(243)
    el.textContent = i18next.t('importexport.promocodes.unsmith')
  } else if (input === ':antismith:' && player.achievements[244] < 1) {
    achievementaward(244)
    el.textContent = i18next.t('importexport.promocodes.antismith')
  } else if (input === 'Khafra' && !player.codes.get(26)) {
    player.codes.set(26, true)
    const quarks = Math.floor(Math.random() * (400 - 100 + 1) + 100)
    player.worlds.add(quarks)
    el.textContent = i18next.t('importexport.promocodes.khafra', {
      x: player.worlds.applyBonus(quarks)
    })
  } else if (input === 'alonso bribe' && !player.codes.get(47)) {
    const craft = player.hepteractCrafts.quark

    if (!craft.UNLOCKED) {
      return Alert(i18next.t('importexport.promocodes.bribe.notUnlocked'))
    }

    const cap = craft.computeActualCap()

    if (cap >= 1e300) {
      return Alert(i18next.t('importexport.promocodes.bribe.overCapacity'))
    }

    player.codes.set(47, true)
    craft.CAP = Math.min(1e300, craft.CAP * 2)

    return Alert(i18next.t('importexport.promocodes.bribe.thanks'))
  } else if (input.toLowerCase() === 'daily' && !player.dailyCodeUsed) {
    player.dailyCodeUsed = true
    let rewardMessage = i18next.t('importexport.promocodes.daily.message')

    const rewards = dailyCodeReward()
    const quarkMultiplier = 1 + Math.min(49, player.highestSingularityCount)

    let actualQuarkAward = player.worlds.applyBonus(
      rewards.quarks * quarkMultiplier
    )
    if (actualQuarkAward > 1e5) {
      actualQuarkAward = Math.pow(1e5, 0.75) * Math.pow(actualQuarkAward, 0.25)
    }
    player.worlds.add(actualQuarkAward, false)
    player.goldenQuarks += rewards.goldenQuarks

    rewardMessage += `\n${format(actualQuarkAward, 0, true)} Quarks`
    if (rewards.goldenQuarks > 0) {
      rewardMessage += `\n${
        format(
          rewards.goldenQuarks,
          0,
          true
        )
      } Golden Quarks`
    }
    await Alert(rewardMessage)

    if (player.highestSingularityCount > 0) {
      const upgradeDistribution = {
        goldenQuarks3: { value: 0.2, pdf: (x: number) => 0 <= x && x <= 1 },
        goldenQuarks2: { value: 0.2, pdf: (x: number) => 1 <= x && x <= 3 },
        goldenQuarks1: { value: 0.2, pdf: (x: number) => 3 <= x && x <= 10 },
        singCubes3: { value: 0.25, pdf: (x: number) => 10 < x && x <= 15 },
        singObtainium3: { value: 0.25, pdf: (x: number) => 15 < x && x <= 20 },
        singOfferings3: { value: 0.25, pdf: (x: number) => 20 < x && x <= 25 },
        singCubes2: { value: 0.5, pdf: (x: number) => 25 < x && x <= 80 },
        singObtainium2: { value: 0.5, pdf: (x: number) => 80 < x && x <= 140 },
        singOfferings2: { value: 0.5, pdf: (x: number) => 140 < x && x <= 200 },
        singCubes1: { value: 1, pdf: (x: number) => 200 < x && x <= 400 },
        singObtainium1: { value: 1, pdf: (x: number) => 400 < x && x <= 600 },
        singOfferings1: { value: 1, pdf: (x: number) => 600 < x && x <= 800 },
        ascensions: { value: 1, pdf: (x: number) => 800 < x && x <= 1000 }
      }
      let rolls = 3 * Math.sqrt(player.highestSingularityCount)
      rolls += +player.octeractUpgrades.octeractImprovedDaily.getEffect().bonus
      rolls += player.shopUpgrades.shopImprovedDaily2
      rolls += player.shopUpgrades.shopImprovedDaily3
      rolls += player.shopUpgrades.shopImprovedDaily4
      rolls += +player.singularityUpgrades.platonicPhi.getEffect().bonus
        * Math.min(50, (5 * player.singularityCounter) / (3600 * 24))
      rolls += +player.octeractUpgrades.octeractImprovedDaily3.getEffect().bonus
      rolls *= +player.octeractUpgrades.octeractImprovedDaily2.getEffect().bonus
      rolls *= 1
        + +player.octeractUpgrades.octeractImprovedDaily3.getEffect().bonus / 200

      if (player.highestSingularityCount >= 200) {
        rolls *= 2
      }

      rolls = Math.floor(rolls)

      const keys = Object.keys(player.singularityUpgrades).filter(
        (key) => key in upgradeDistribution
      ) as (keyof typeof upgradeDistribution)[]

      rewardMessage = i18next.t('importexport.promocodes.daily.message2')
      // The same upgrade can be drawn several times, so we save the sum of the levels gained, to display them only once at the end
      const freeLevels: Record<string, number> = {}
      for (let i = 0; i < rolls; i++) {
        const num = 1000 * Math.random()
        for (const key of keys) {
          if (upgradeDistribution[key].pdf(num)) {
            player.singularityUpgrades[key].freeLevels += upgradeDistribution[key].value
            freeLevels[key]
              ? (freeLevels[key] += upgradeDistribution[key].value)
              : (freeLevels[key] = upgradeDistribution[key].value)
          }
        }
      }

      if (player.highestSingularityCount >= 20) {
        player.singularityUpgrades.goldenQuarks1.freeLevels += 0.2
        freeLevels.goldenQuarks1
          ? (freeLevels.goldenQuarks1 += 0.2)
          : (freeLevels.goldenQuarks1 = 0.2)
        player.singularityUpgrades.goldenQuarks2.freeLevels += 0.2
        freeLevels.goldenQuarks2
          ? (freeLevels.goldenQuarks2 += 0.2)
          : (freeLevels.goldenQuarks2 = 0.2)
        player.singularityUpgrades.goldenQuarks3.freeLevels += 1
        freeLevels.goldenQuarks3
          ? (freeLevels.goldenQuarks3 += 1)
          : (freeLevels.goldenQuarks3 = 1)
      }

      if (player.highestSingularityCount >= 200) {
        player.octeractUpgrades.octeractGain.freeLevels += player.octeractUpgrades.octeractGain.level / 100
        freeLevels.octeractGain = player.octeractUpgrades.octeractGain.level / 100
      }

      if (player.highestSingularityCount >= 205) {
        player.octeractUpgrades.octeractGain2.freeLevels += player.octeractUpgrades.octeractGain2.level / 100
        freeLevels.octeractGain2 = player.octeractUpgrades.octeractGain2.level / 100
      }

      for (const key of Object.keys(freeLevels)) {
        rewardMessage += dailyCodeFormatFreeLevelMessage(key, freeLevels[key])
      }
      await Alert(rewardMessage)
    }
    return
  } else if (input.toLowerCase() === 'add') {
    const availableUses = addCodeAvailableUses()
    const maxUses = addCodeMaxUses().total
    const timeToNextUse = format(addCodeTimeToNextUse(), 0)
    const timeInterval = addCodeInterval().time

    if (availableUses < 1) {
      el.textContent = i18next.t('importexport.noAddCodes', {
        x: timeToNextUse
      })
      return
    }

    let attemptsUsed: string | null = null
    if (amount) {
      attemptsUsed = amount.toString()
    } else {
      attemptsUsed = await Prompt(
        i18next.t('importexport.useXAdds', { x: availableUses }),
        availableUses.toString()
      )
    }

    if (attemptsUsed === null) {
      return Alert(i18next.t('importexport.cancelAdd'))
    }
    const toUse = Number(attemptsUsed)
    if (
      Number.isNaN(toUse)
      || !Number.isInteger(toUse)
      || toUse === 0
      || (toUse < 0 && -toUse >= availableUses)
    ) {
      return Alert(i18next.t('general.validation.invalidNumber'))
    }

    const addEffects = addCodeBonuses()

    const realAttemptsUsed = toUse > 0 ? Math.min(availableUses, toUse) : availableUses + toUse
    const actualQuarks = Math.floor(addEffects.quarks * realAttemptsUsed)
    const [first, second] = window.crypto.getRandomValues(new Uint8Array(2))

    // Allows storage of up to (24 + 2 * calc2 levels) Add Codes, lol!
    const v = Math.max(
      Date.now() - (maxUses - realAttemptsUsed) * timeInterval,
      player.rngCode + timeInterval * realAttemptsUsed
    )
    const remaining = Math.floor((Date.now() - v) / timeInterval)
    const timeToNext = Math.floor(
      (timeInterval - (Date.now() - v - timeInterval * remaining)) / 1000
    )

    // Calculator 3: Adds ascension timer.
    const ascensionTimer = realAttemptsUsed * addEffects.ascensionTimer
    const ascensionTimerText = player.shopUpgrades.calculator3 > 0
      ? i18next.t('importexport.promocodes.add.calculator3', {
        x: format(ascensionTimer)
      })
      : ''

    // Calculator 5: Adds GQ export timer.
    const gqTimer = realAttemptsUsed * addEffects.gqTimer
    const gqTimerText = player.shopUpgrades.calculator5 > 0
      ? i18next.t('importexport.promocodes.add.calculator5', {
        x: format(gqTimer)
      })
      : ''

    // Calculator 6: Octeract Generation
    const octeractTime = realAttemptsUsed * addEffects.octeractTime
    const octeractTimeText = player.shopUpgrades.calculator6 > 0
      ? i18next.t('importexport.promocodes.add.calculator6', {
        x: format(octeractTime)
      })
      : ''

    // Calculator 7: Blueberry Generation Time
    const blueberryTime = realAttemptsUsed * addEffects.blueberryTime
    const blueberryTimeText = player.shopUpgrades.calculator7 > 0
      ? i18next.t('importexport.promocodes.add.calculator7', {
        x: format(blueberryTime, 2, true)
      })
      : ''

    // Midas' Millenium-Aged Gold perk
    const freeLevelsText = player.highestSingularityCount >= 150
      ? i18next.t('importexport.promocodes.add.freeLevel', {
        x: format(0.01 * realAttemptsUsed, 2),
        y: format(0.05 * realAttemptsUsed, 2)
      })
      : ''

    // Calculator Maxed: you don't need to insert anything!
    if (player.shopUpgrades.calculator === shopData.calculator.maxLevel) {
      player.worlds.add(actualQuarks)
      addTimers('ascension', ascensionTimer)
      player.goldenQuarksTimer += gqTimer
      addTimers('octeracts', octeractTime)
      addTimers('ambrosia', blueberryTime)

      if (player.highestSingularityCount >= 150) {
        player.singularityUpgrades.goldenQuarks1.freeLevels += 0.01 * realAttemptsUsed
        player.singularityUpgrades.goldenQuarks3.freeLevels += 0.05 * realAttemptsUsed
      }

      player.rngCode = v
      if (amount) {
        // No message when using Add x1 Special action, we refresh the info message
        promocodesInfo('add')
        return
      } else {
        return Alert(
          i18next.t('importexport.promocodes.add.calculatorMaxed', {
            a: first,
            b: second,
            c: first + second,
            d: player.worlds.toString(actualQuarks),
            e: ascensionTimerText,
            f: gqTimerText,
            g: octeractTimeText,
            h: freeLevelsText,
            i: blueberryTimeText,
            j: remaining,
            k: timeToNext.toLocaleString()
          })
        )
      }
    }

    // If your calculator isn't maxed but has levels, it will provide the solution.
    const options = {
      w: player.worlds.toString(actualQuarks),
      x: first,
      y: second,
      z: first + second
    }

    const promptText = player.shopUpgrades.calculator > 0
      ? i18next.t('importexport.promocodes.add.calculatorSolution', options)
      : i18next.t('importexport.promocodes.add.calculatorPrompt', options)

    const addPrompt = await Prompt(promptText)

    if (addPrompt === null) {
      return Alert(i18next.t('importexport.promocodes.add.cancelled'))
    }

    player.rngCode = v

    if (first + second === +addPrompt) {
      player.worlds.add(actualQuarks)
      addTimers('ascension', ascensionTimer)
      player.goldenQuarksTimer += gqTimer
      addTimers('octeracts', octeractTime)
      addTimers('ambrosia', blueberryTime)

      await Alert(
        i18next.t('importexport.promocodes.add.reward', {
          a: player.worlds.toString(actualQuarks),
          b: ascensionTimerText,
          c: gqTimerText,
          d: octeractTimeText,
          e: remaining,
          f: timeToNext.toLocaleString(navigator.language)
        })
      )
    } else {
      await Alert(
        i18next.t('importexport.promocodes.add.wrong', {
          w: addPrompt,
          x: first + second,
          y: remaining,
          z: timeToNext.toLocaleString(navigator.language)
        })
      )
    }
  } else if (input === 'sub') {
    const amount = 1 + (window.crypto.getRandomValues(new Uint16Array(1))[0] % 16) // [1, 16]
    const quarks = Number(player.worlds)
    await Alert(i18next.t('importexport.promocodes.sub.subbed', { x: amount }))

    if (quarks < amount) {
      await Alert(
        i18next.t('importexport.promocodes.sub.gave', {
          x: amount - quarks,
          y: amount
        })
      )
    }

    player.worlds.sub(quarks < amount ? amount - quarks : amount)
  } else if (input === 'gamble') {
    if (
      typeof player.skillCode === 'number'
      || typeof localStorage.getItem('saveScumIsCheating') === 'string'
    ) {
      if (
        (Date.now() - player.skillCode!) / 1000 < 3600
        || (Date.now() - Number(localStorage.getItem('saveScumIsCheating')))
              / 1000
          < 3600
      ) {
        return (el.textContent = i18next.t(
          'importexport.promocodes.gamble.wait'
        ))
      }
    }

    const confirmed = await Confirm(
      i18next.t('importexport.promocodes.gamble.confirm')
    )
    if (!confirmed) {
      return (el.textContent = i18next.t(
        'importexport.promocodes.gamble.cancelled'
      ))
    }

    const bet = Number(
      await Prompt(i18next.t('importexport.promocodes.gamble.betPrompt'))
    )
    if (Number.isNaN(bet) || bet <= 0) {
      return (el.textContent = i18next.t('general.validation.zeroOrLess'))
    } else if (bet > 1e4) {
      return (el.textContent = i18next.t(
        'importexport.promocodes.gamble.cheaters'
      ))
    } else if (Number(player.worlds) < bet) {
      return (el.textContent = i18next.t(
        'general.validation.moreThanPlayerHas'
      ))
    }

    localStorage.setItem('saveScumIsCheating', Date.now().toString())
    const dice = (window.crypto.getRandomValues(new Uint8Array(1))[0] % 6) + 1 // [1, 6]

    if (dice === 1) {
      const won = bet * 0.25 // lmao
      player.worlds.add(won, false)

      player.skillCode = Date.now()
      return (el.textContent = i18next.t('importexport.promocodes.gamble.won', {
        x: won
      }))
    }

    player.worlds.sub(bet)
    el.textContent = i18next.t('importexport.promocodes.gamble.lost', {
      x: bet
    })
  } else if (input === 'time') {
    const availableUses = timeCodeAvailableUses()
    if (availableUses === 0) {
      return Alert(i18next.t('importexport.promocodes.time.wait'))
    }

    const rewardMult = timeCodeRewardMultiplier()

    const random = Math.random() * 15000 // random time within 15 seconds
    const start = Date.now()
    const playerConfirmed = await Confirm(
      i18next.t('importexport.promocodes.time.confirm', {
        x: format(2500 + 125 * player.cubeUpgrades[61], 0, true),
        y: format(rewardMult, 2, true)
      })
    )

    if (playerConfirmed) {
      const diff = Math.abs(Date.now() - (start + random))
      player.promoCodeTiming.time = Date.now()

      if (diff <= 2500 + 125 * player.cubeUpgrades[61]) {
        const reward = Math.floor(
          Math.min(1000, 125 + 25 * player.highestSingularityCount)
            * (1 + player.cubeUpgrades[61] / 50)
        )
        let actualQuarkAward = player.worlds.applyBonus(reward)
        let blueberryTime = 0
        if (actualQuarkAward > 66666) {
          actualQuarkAward = Math.pow(actualQuarkAward, 0.35) * Math.pow(66666, 0.65)
        }

        if (player.visitedAmbrosiaSubtab) {
          blueberryTime = 1800 * rewardMult
        }

        player.worlds.add(actualQuarkAward * rewardMult, false)
        G.ambrosiaTimer += blueberryTime
        const winText = i18next.t('importexport.promocodes.time.won', {
          x: format(actualQuarkAward * rewardMult, 0, true)
        })
        const ambrosiaText = blueberryTime > 0
          ? i18next.t('importexport.promocodes.time.ambrosia', {
            blueberryTime
          })
          : ''
        return Alert(winText + ambrosiaText)
      } else {
        return Alert(i18next.t('importexport.promocodes.time.lost'))
      }
    }
  } else if (input === 'spoiler') {
    const perSecond = octeractGainPerSecond()
    if (perSecond > 1) {
      return Alert(
        i18next.t('importexport.promocodes.spoiler.moreThan1', {
          x: format(perSecond, 2, true)
        })
      )
    } else {
      return Alert(
        i18next.t('importexport.promocodes.spoiler.one', {
          x: format(1 / perSecond, 2, true)
        })
      )
    }
  } else {
    el.textContent = i18next.t('importexport.promocodes.invalid')
  }

  const saved = await saveSynergy() // should fix refresh bug where you can continuously enter promocodes

  if (!saved) {
    return
  }

  Synergism.emit('promocode', input)

  setTimeout(() => (el.textContent = ''), 15000)
}

const addCodeSingularityPerkBonus = (): number => {
  const levels = [
    10,
    16,
    25,
    36,
    49,
    64,
    81,
    100,
    121,
    144,
    169,
    196,
    225,
    235,
    240
  ]
  let count = 0
  for (let i = 0; i < levels.length; i++) {
    if (player.highestSingularityCount >= levels[i]) {
      count += 1
    } else {
      break
    }
  }
  return 1 + count / 5
}

export const addCodeMaxUses = () => {
  let calc5uses = Math.floor(player.shopUpgrades.calculator5 / 10)
  if (player.shopUpgrades.calculator5 === shopData.calculator5.maxLevel) {
    calc5uses += 6
  }

  const arr = [
    24, // base
    2 * player.shopUpgrades.calculator2, // PL-AT X
    player.shopUpgrades.calculator4 === shopData.calculator4.maxLevel ? 32 : 0, // PL-AT δ
    calc5uses, // PL-AT Γ
    player.shopUpgrades.calculator6 === shopData.calculator6.maxLevel ? 24 : 0, // PL_AT _
    player.shopUpgrades.calculator7 === shopData.calculator7.maxLevel ? 48 : 0 // Plat ΩΩ
  ]

  let maxUses = sumContents(arr)

  arr.push(addCodeSingularityPerkBonus())
  maxUses *= addCodeSingularityPerkBonus()

  return {
    list: arr,
    total: Math.ceil(maxUses)
  }
}

export const addCodeInterval = () => {
  const arr = [
    hour, // base value
    1 - 0.04 * player.shopUpgrades.calculator4,
    1
    - Math.min(
      0.6,
      (player.highestSingularityCount >= 125
        ? player.highestSingularityCount / 800
        : 0)
        + (player.highestSingularityCount >= 200
          ? player.highestSingularityCount / 800
          : 0)
    ),
    player.runelevels[6] > 0 ? 0.8 : 1,
    1 / addCodeSingularityPerkBonus()
  ]

  return {
    list: arr,
    time: productContents(arr)
  }
}

export const addCodeAvailableUses = (): number => {
  const maxUses = addCodeMaxUses().total
  const timeInterval = addCodeInterval().time

  return Math.floor(
    Math.min(maxUses, (Date.now() - player.rngCode) / timeInterval)
  )
}

export const addCodeTimeToNextUse = (): number => {
  const timeToFirst = Math.floor(addCodeInterval().time + player.rngCode - Date.now()) / 1000

  if (timeToFirst > 0) {
    return timeToFirst
  } else if (addCodeAvailableUses() === addCodeMaxUses().total) {
    return 0
  } else {
    const addTimerElapsedTime = Date.now() - player.rngCode
    const remainder = addTimerElapsedTime - addCodeInterval().time * addCodeAvailableUses()

    return Math.floor(addCodeInterval().time - remainder) / 1000
  }
}

export const addCodeBonuses = () => {
  const perkRewardDivisor = addCodeSingularityPerkBonus()

  let commonQuarkMult = 1 + 0.14 * player.shopUpgrades.calculator // Calculator Shop Upgrade (+14% / level)
  commonQuarkMult *= player.shopUpgrades.calculator2 === shopData.calculator2.maxLevel
    ? 1.25
    : 1 // Calculator 2 Max Level (+25%)
  commonQuarkMult /= perkRewardDivisor

  const sampledMult = Math.max(
    0.4 + 0.02 * player.shopUpgrades.calculator3,
    2 / 5 + (window.crypto.getRandomValues(new Uint16Array(2))[0] % 128) / 640
  ) // [0.4, 0.6], slightly biased in favor of 0.4. =)
  const minMult = 0.4 + 0.02 * player.shopUpgrades.calculator3
  const maxMult = 0.6

  const quarkBase = commonQuarkMult * quarkHandler().perHour

  // Calculator 3: Adds ascension timer.  Also includes Expert Pack multiplier.
  const ascMult = player.singularityUpgrades.expertPack.level > 0 ? 1.2 : 1
  const ascensionTimer = (60 * player.shopUpgrades.calculator3 * ascMult) / perkRewardDivisor

  // Calculator 5: Adds GQ export timer.
  const gqTimer = (6 * player.shopUpgrades.calculator5) / perkRewardDivisor

  // Calculator 6: Octeract Generation
  const octeractTime = player.shopUpgrades.calculator6 / perkRewardDivisor

  // Calculator 7: Blueberry Timer Generation
  const blueberryTime = player.shopUpgrades.calculator7 / perkRewardDivisor

  return {
    quarks: sampledMult * quarkBase, // The quarks to actually reward (if not for stats)
    minQuarks: minMult * quarkBase,
    maxQuarks: maxMult * quarkBase,
    ascensionTimer,
    gqTimer,
    octeractTime,
    blueberryTime
  }
}

const timeCodeAvailableUses = (): number => {
  return (Date.now() - player.promoCodeTiming.time) / 1000 < 900 ? 0 : 1
}

const timeCodeTimeToNextUse = (): number => {
  return 900 - (Date.now() - player.promoCodeTiming.time) / 1000
}

const timeCodeRewardMultiplier = (): number => {
  return Math.min(
    24,
    (Date.now() - player.promoCodeTiming.time) / (1000 * 3600)
  )
}

const dailyCodeFormatFreeLevelMessage = (
  upgradeKey: string,
  freeLevelAmount: number
): string => {
  const upgradeNiceName = upgradeKey in singularityData
    ? i18next.t(`singularity.data.${upgradeKey}.name`)
    : i18next.t(`octeract.data.${upgradeKey}.name`)
  return `\n+${freeLevelAmount} extra levels of '${upgradeNiceName}'`
}

const dailyCodeReward = () => {
  let quarks = 0
  let goldenQuarks = 0

  const ascended = player.ascensionCount > 0
  const singularity = player.highestSingularityCount > 0
  if (player.reincarnationCount > 0 || ascended || singularity) {
    quarks += 20
  }
  if (player.challengecompletions[6] > 0 || ascended || singularity) {
    quarks += 20
  } // 40
  if (player.challengecompletions[7] > 0 || ascended || singularity) {
    quarks += 30
  } // 70
  if (player.challengecompletions[8] > 0 || ascended || singularity) {
    quarks += 30
  } // 100
  if (player.challengecompletions[9] > 0 || ascended || singularity) {
    quarks += 40
  } // 140
  if (player.challengecompletions[10] > 0 || ascended || singularity) {
    quarks += 60
  } // 200
  if (ascended || singularity) {
    quarks += 50
  } // 250
  if (player.challengecompletions[11] > 0 || singularity) {
    quarks += 50
  } // 300
  if (player.challengecompletions[12] > 0 || singularity) {
    quarks += 50
  } // 350
  if (player.challengecompletions[13] > 0 || singularity) {
    quarks += 50
  } // 400
  if (player.challengecompletions[14] > 0 || singularity) {
    quarks += 100
  } // 500
  if (player.researches[200] === G.researchMaxLevels[200]) {
    quarks += 250
  } // 750
  if (player.cubeUpgrades[50] === 100000) {
    quarks += 250
  } // 1000
  if (player.platonicUpgrades[5] > 0) {
    quarks += 250
  } // 1250
  if (player.platonicUpgrades[10] > 0) {
    quarks += 500
  } // 1750
  if (player.platonicUpgrades[15] > 0) {
    quarks += 750
  } // 2500
  if (player.challenge15Exponent > 1e18) {
    quarks += Math.floor(1000 * (Math.log10(player.challenge15Exponent) - 18))
  } // at least 2500
  if (player.platonicUpgrades[20] > 0) {
    quarks += 2500
  } // at least 5k

  quarks *= 1 + 0.05 * player.shopUpgrades.shopImprovedDaily
  quarks = Math.floor(quarks)

  if (singularity) {
    goldenQuarks += 2 + 3 * player.highestSingularityCount
    goldenQuarks *= 1 + 0.2 * player.shopUpgrades.shopImprovedDaily2
    goldenQuarks *= 1 + 0.15 * player.shopUpgrades.shopImprovedDaily3
    goldenQuarks *= 1 + player.shopUpgrades.shopImprovedDaily4
  }

  return {
    quarks,
    goldenQuarks
  }
}

export const handleLastModified = (lastModified: number) => {
  const localStorageFirstPlayed = localStorage.getItem('firstPlayed')
  const lastModifiedDate = new Date(lastModified)

  if (localStorageFirstPlayed === null) {
    localStorage.setItem('firstPlayed', lastModifiedDate.toISOString())
    return
  }

  const localFirstPlayedDate = new Date(localStorageFirstPlayed)

  // The larger the ms value, the newer the file.
  // So if the current oldest date is newer than the last modified date
  // for the new file, set the oldest date to the last modified.
  if (localFirstPlayedDate.getTime() > lastModifiedDate.getTime()) {
    player.firstPlayed = lastModifiedDate.toISOString()
    localStorage.setItem('firstPlayed', player.firstPlayed)
  }
}
