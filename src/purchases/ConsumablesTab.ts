import i18next from 'i18next'
import { DOMCacheGetOrSet } from '../Cache/DOM'
import { getOwnedLotus, getScheduledBells, getUsedLotus, isLotusInventoryLoaded, sendToWebsocket } from '../Login'
import { format } from '../Synergism'
import { Alert, Confirm } from '../UpdateHTML'
import { memoize } from '../Utility'
import { setLotusBalance, setLotusBalanceLoading } from './PseudoCoinBalances'
import { updatePseudoCoins } from './UpgradesSubtab'

interface ConsumableListItems {
  name: string
  description: string
  internalName: string
  length: string
  cost: number
}

type TimeSkipCategories = 'GLOBAL' | 'ASCENSION' | 'AMBROSIA'

const DAY_MS = 86_400_000
/** How far ahead the backend lets a bell be scheduled, in whole days. */
const SCHEDULE_HORIZON_DAYS = 30
/** A Sunday, used only to generate localized weekday abbreviations. */
const WEEKDAY_SAMPLE = new Date(2024, 0, 7)

const tab = document.querySelector<HTMLElement>('#pseudoCoins > #consumablesSection')!

let bellCost = 0
let bellDisplayName = ''
/** Local-midnight timestamp of the first day of the month the calendar is showing. */
let visibleMonth = 0
/** Local-midnight timestamp of the selected day, or 0 when nothing is selected. */
let selectedDay = 0
let scheduleReady = false

const fetchConsumables = memoize(async () => {
  const response = await fetch('https://synergism.cc/consumables/list')
  return await response.json() as ConsumableListItems[]
})

const initializeConsumablesTab = memoize(() => {
  fetchConsumables()
    .then((consumables) => {
      // Thank you Gemini for the number test
      // TODO: Erm...
      const durableConsume = consumables.filter((u) => u.internalName.includes('BELL'))
      const timeSkip = consumables.filter((u) => u.internalName.includes('TIMESKIP'))
      const lotus = consumables.filter((u) => u.internalName.includes('LOTUS'))

      // Update coin count just in case
      updatePseudoCoins()

      const grid = tab.querySelector('#consumablesGrid')!
      grid.innerHTML = `
      <div id="topRowConsumables">
        ${
        durableConsume.map((u) => `
          <div
            data-key="${u.internalName}"
            data-cost="${u.cost}"
            data-name="${u.name}"
            class="purchaseConsumableContainer"
          >
            <div class="iconAndNameContainer">
              <img src='Pictures/PseudoShop/${u.internalName}.png' alt='${u.name} Consumable' />
              <p class="gradientText bellGradient">${u.name}</p>
            </div>
            <p style="white-space: pre-line">${u.description.replace(/\\n/g, '\n')}</p>
            <div class="consumableButtonColumn">
              <button class="consumablePurchaseBtn"><p>ACTIVATE: </p><p>${u.cost} PseudoCoins</p></button>
              ${
        u.internalName === 'HAPPY_HOUR_BELL'
          ? `<button type="button" class="consumablePurchaseBtn" id="bellScheduleOpen">
                    <p>${i18next.t('pseudoCoins.bellSchedule.openBtn')}</p><p>${u.cost} PseudoCoins</p>
                  </button>`
          : ''
      }
            </div>
          </div>
        `).join('')
      }
        ${createLotusHTML(lotus)}
      </div>
      <div class="timeSkipSet">
        ${createTimeskipHTML(timeSkip, 'GLOBAL')}
        ${createTimeskipHTML(timeSkip, 'ASCENSION')}
        ${createTimeskipHTML(timeSkip, 'AMBROSIA')}
      </div>
      `

      tab.querySelectorAll('div[data-key] button:not(#bellScheduleOpen)').forEach((element) => {
        const container = element.closest('div[data-key]')!
        const key = container.getAttribute('data-key')!
        const cost = container.getAttribute('data-cost')!
        const name = container.getAttribute('data-name')!
        const isLotus = container.getAttribute('data-lotus') === 'true'
        // TODO (for a future time): Lotus has different verbage since we don't actually
        // "activate" them right away.
        if (!isLotus) {
          element.addEventListener('click', async () => {
            const alert = await Confirm(i18next.t('pseudoCoins.consumables.confirmActivation', {
              name,
              cost
            }))
            if (!alert) return Alert(i18next.t('pseudoCoins.consumables.cancelled'))
            else {
              sendToWebsocket(JSON.stringify({
                type: 'consume',
                consumable: key,
                version: '2'
              }))
            }
          })
        } else {
          element.addEventListener('click', async () => {
            const alert = await Confirm(i18next.t('pseudoCoins.lotus.buyConfirm', {
              name,
              cost
            }))
            if (!alert) return Alert(i18next.t('pseudoCoins.consumables.cancelled'))
            else {
              sendToWebsocket(JSON.stringify({
                type: 'consume',
                consumable: key,
                version: '2'
              }))
            }
          })
        }
      })

      updateLotusDisplay()

      DOMCacheGetOrSet('bellScheduleOpen').addEventListener('click', () => {
        openBellSchedule().catch(console.error)
      })
    })
})

const createTimeskipHTML = (timeSkips: ConsumableListItems[], filter: TimeSkipCategories) => {
  const relevantTimeSkips = timeSkips.filter((u) => u.internalName.includes(filter)).sort((a, b) =>
    +a.length - +b.length
  )
  return `
  <div class="timeSkipContainer purchaseConsumableContainer">
    <img src='Pictures/PseudoShop/${filter}TimeSkip.png' alt='${filter} TimeSkip Box' />
    <p>${i18next.t(`pseudoCoins.timeSkips.${filter}.title`)}</p>
    <p style="text-align: center; min-height: 60px">${i18next.t(`pseudoCoins.timeSkips.${filter}.description`)}</p>
    <p style="text-align: center">${i18next.t('pseudoCoins.timeSkips.warning')}</p>
    <div class="timeSkipOptions">
      ${
    relevantTimeSkips.map((u) => `
        <div data-key="${u.internalName}" data-cost="${u.cost}" data-name="${u.name}">
          <button class="consumablePurchaseBtn" style="width: 190px"> 
            <p style="text-align: center; width: 180px">${
      i18next.t('pseudoCoins.timeSkips.purchaseBtn', {
        time: format(Math.floor(+u.length / 60), 0, true),
        cost: format(u.cost, 0, true)
      })
    }</p>
          </button>
        </div>
      `).join('')
  }
    </div>
  </div>
  `
}

const startOfDay = (timestamp: number) => {
  const date = new Date(timestamp)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

const addMonths = (timestamp: number, months: number) => {
  const date = new Date(timestamp)
  return new Date(date.getFullYear(), date.getMonth() + months, 1).getTime()
}

const formatters = memoize(() => ({
  month: new Intl.DateTimeFormat(i18next.language, { month: 'long', year: 'numeric' }),
  weekday: new Intl.DateTimeFormat(i18next.language, { weekday: 'short' }),
  day: new Intl.DateTimeFormat(i18next.language, { weekday: 'long', month: 'long', day: 'numeric' }),
  time: new Intl.DateTimeFormat(i18next.language, { hour: 'numeric', minute: '2-digit' })
}))

const createBellScheduleHTML = () => `
<div id="bellScheduleOverlay" role="dialog" aria-modal="true" aria-labelledby="bellScheduleTitle">
  <div id="bellScheduleContainer">
    <button type="button" id="bellScheduleClose" aria-label="${
  i18next.t('pseudoCoins.bellSchedule.close')
}">&times;</button>
    <div class="iconAndNameContainer">
      <img src='Pictures/PseudoShop/HAPPY_HOUR_BELL.png' alt='${i18next.t('pseudoCoins.bellSchedule.title')}' />
      <p id="bellScheduleTitle" class="gradientText bellGradient">${i18next.t('pseudoCoins.bellSchedule.title')}</p>
    </div>
    <p id="bellScheduleIntro">${i18next.t('pseudoCoins.bellSchedule.intro', { days: SCHEDULE_HORIZON_DAYS })}</p>
    <div id="bellCalendar">
      <div id="bellCalendarNav">
        <button type="button" id="bellCalendarPrev" aria-label="${
  i18next.t('pseudoCoins.bellSchedule.previousMonth')
}">‹</button>
        <p id="bellCalendarMonth"></p>
        <button type="button" id="bellCalendarNext" aria-label="${
  i18next.t('pseudoCoins.bellSchedule.nextMonth')
}">›</button>
      </div>
      <div id="bellCalendarWeekdays"></div>
      <div id="bellCalendarGrid"></div>
    </div>
    <div id="bellScheduleDetails">
      <p id="bellScheduleDay"></p>
      <div id="bellScheduleList"></div>
      <div id="bellScheduleControls">
        <input type="time" id="bellScheduleTime" />
        <button type="button" class="consumablePurchaseBtn" id="bellScheduleBtn"></button>
      </div>
    </div>
  </div>
</div>
`

const renderCalendar = () => {
  const bells = getScheduledBells()
  const today = startOfDay(Date.now())
  const lastSchedulable = today + SCHEDULE_HORIZON_DAYS * DAY_MS

  // Number of bells falling on each local day, so a day cell can show its count.
  const bellsPerDay = new Map<number, number>()
  for (const bell of bells) {
    const day = startOfDay(bell.scheduledFor)
    bellsPerDay.set(day, (bellsPerDay.get(day) ?? 0) + 1)
  }

  DOMCacheGetOrSet('bellCalendarMonth').textContent = formatters().month.format(visibleMonth)

  const prev = DOMCacheGetOrSet('bellCalendarPrev') as HTMLButtonElement
  const next = DOMCacheGetOrSet('bellCalendarNext') as HTMLButtonElement
  prev.disabled = visibleMonth <= addMonths(today, 0)
  next.disabled = addMonths(visibleMonth, 1) > lastSchedulable

  const firstOfMonth = new Date(visibleMonth)
  // Back up to the Sunday on or before the 1st so the grid always starts on a full week.
  const gridStart = new Date(
    firstOfMonth.getFullYear(),
    firstOfMonth.getMonth(),
    1 - firstOfMonth.getDay()
  )

  DOMCacheGetOrSet('bellCalendarGrid').innerHTML = Array.from({ length: 42 }, (_, i) => {
    const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i)
    const day = date.getTime()
    const count = bellsPerDay.get(day) ?? 0
    const selectable = day >= today && day <= lastSchedulable

    const classes = ['bellCalendarDay']
    if (date.getMonth() !== firstOfMonth.getMonth()) classes.push('otherMonth')
    if (day === today) classes.push('today')
    if (day === selectedDay) classes.push('selected')
    if (count > 0) classes.push('hasBells')

    return `
      <button type="button" class="${classes.join(' ')}" data-day="${day}" ${selectable ? '' : 'disabled'}>
        <span class="bellCalendarDayNumber">${date.getDate()}</span>
        <span class="bellCalendarDayCount">${count > 0 ? `🔔${count}` : ''}</span>
      </button>
    `
  }).join('')
}

const renderScheduleDetails = () => {
  const dayLabel = DOMCacheGetOrSet('bellScheduleDay')
  const list = DOMCacheGetOrSet('bellScheduleList')
  const controls = DOMCacheGetOrSet('bellScheduleControls')

  if (selectedDay === 0) {
    dayLabel.textContent = i18next.t('pseudoCoins.bellSchedule.noDaySelected')
    list.innerHTML = ''
    controls.style.display = 'none'
    return
  }

  controls.style.display = ''
  dayLabel.textContent = formatters().day.format(selectedDay)

  const bellsToday = getScheduledBells().filter((bell) => startOfDay(bell.scheduledFor) === selectedDay)

  list.innerHTML = bellsToday.length === 0
    ? `<p class="bellScheduleEmpty">${i18next.t('pseudoCoins.bellSchedule.noBellsThisDay')}</p>`
    : bellsToday.map((bell) =>
      `<p class="bellScheduleEntry">${
        i18next.t('pseudoCoins.bellSchedule.bellAt', { time: formatters().time.format(bell.scheduledFor) })
      }</p>`
    ).join('')
}

export const updateBellScheduleDisplay = () => {
  if (!scheduleReady) return

  // A day that has slipped into the past can no longer be scheduled for.
  if (selectedDay !== 0 && selectedDay < startOfDay(Date.now())) {
    selectedDay = 0
  }

  renderCalendar()
  renderScheduleDetails()
}

const scheduleBell = async () => {
  const input = DOMCacheGetOrSet('bellScheduleTime') as HTMLInputElement

  if (selectedDay === 0 || !input.value) {
    return Alert(i18next.t('pseudoCoins.bellSchedule.pickDayAndTime'))
  }

  const [hours, minutes] = input.value.split(':').map(Number)
  const selected = new Date(selectedDay)
  const scheduledFor = new Date(
    selected.getFullYear(),
    selected.getMonth(),
    selected.getDate(),
    hours,
    minutes
  ).getTime()

  if (scheduledFor <= Date.now()) {
    return Alert(i18next.t('pseudoCoins.bellSchedule.mustBeFuture'))
  }

  if (scheduledFor > Date.now() + SCHEDULE_HORIZON_DAYS * DAY_MS) {
    return Alert(i18next.t('pseudoCoins.bellSchedule.tooFarAhead', { days: SCHEDULE_HORIZON_DAYS }))
  }

  const confirmed = await Confirm(i18next.t('pseudoCoins.bellSchedule.confirm', {
    name: bellDisplayName,
    cost: bellCost,
    date: formatters().day.format(scheduledFor),
    time: formatters().time.format(scheduledFor)
  }))

  if (!confirmed) {
    return Alert(i18next.t('pseudoCoins.consumables.cancelled'))
  }

  sendToWebsocket(JSON.stringify({ type: 'schedule-bell', scheduledFor }))
}

const closeBellSchedule = () => {
  DOMCacheGetOrSet('bellScheduleOverlay').style.display = 'none'
  document.removeEventListener('keydown', onBellScheduleKeydown)
}

const onBellScheduleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') closeBellSchedule()
}

export const openBellSchedule = async () => {
  await initializeBellSchedule()

  selectedDay = 0
  visibleMonth = addMonths(Date.now(), 0)

  updateBellScheduleDisplay()

  DOMCacheGetOrSet('bellScheduleOverlay').style.display = 'flex'
  document.addEventListener('keydown', onBellScheduleKeydown)
}

const initializeBellSchedule = memoize(async () => {
  const happyHourBell = (await fetchConsumables()).find((u) => u.internalName === 'HAPPY_HOUR_BELL')

  bellCost = happyHourBell?.cost ?? 0
  bellDisplayName = happyHourBell?.name ?? ''

  document.body.insertAdjacentHTML('beforeend', createBellScheduleHTML())

  visibleMonth = addMonths(Date.now(), 0)
  scheduleReady = true

  DOMCacheGetOrSet('bellCalendarWeekdays').innerHTML = Array.from({ length: 7 }, (_, i) => {
    const weekday = new Date(WEEKDAY_SAMPLE.getFullYear(), WEEKDAY_SAMPLE.getMonth(), WEEKDAY_SAMPLE.getDate() + i)
    return `<span>${formatters().weekday.format(weekday)}</span>`
  }).join('')

  DOMCacheGetOrSet('bellCalendarPrev').addEventListener('click', () => {
    visibleMonth = addMonths(visibleMonth, -1)
    updateBellScheduleDisplay()
  })

  DOMCacheGetOrSet('bellCalendarNext').addEventListener('click', () => {
    visibleMonth = addMonths(visibleMonth, 1)
    updateBellScheduleDisplay()
  })

  DOMCacheGetOrSet('bellCalendarGrid').addEventListener('click', (event) => {
    const day = (event.target as HTMLElement).closest<HTMLElement>('.bellCalendarDay')?.dataset.day
    if (!day) return

    selectedDay = Number(day)
    updateBellScheduleDisplay()
  })

  const scheduleButton = DOMCacheGetOrSet('bellScheduleBtn')
  scheduleButton.innerHTML = i18next.t('pseudoCoins.bellSchedule.scheduleBtn', { cost: bellCost })
  scheduleButton.addEventListener('click', () => {
    scheduleBell().catch(console.error)
  })

  DOMCacheGetOrSet('bellScheduleClose').addEventListener('click', closeBellSchedule)

  const overlay = DOMCacheGetOrSet('bellScheduleOverlay')
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeBellSchedule()
  })

  updateBellScheduleDisplay()
})

const createLotusHTML = (lotusItems: ConsumableListItems[]) => {
  const orderedLotus = lotusItems.sort((a, b) => +a.length - +b.length)
  const html = `
    <div class="lotusContainer purchaseConsumableContainer" style="">
      <div class="iconAndNameContainer">
        <img src='Pictures/PseudoShop/LOTUS.png' alt='Lotus Box' />
        <p class="gradientText lotusGradient">${i18next.t('pseudoCoins.lotus.nameSingular')}</p>
      </div>
      <div style="padding:5px;">
        <div class="lotusHeaderText">
          <p id="lotusOwned">${i18next.t('pseudoCoins.lotus.owned', { x: format(getOwnedLotus(), 0, true) })}</p>
          <p id="lotusUsed">${i18next.t('pseudoCoins.lotus.lifetimeUsed', { x: format(getUsedLotus(), 0, true) })}</p>
        </div>
        <p style="text-align: center; min-height: 55px">${i18next.t('pseudoCoins.lotus.intro')}</p>
      </div>
      <div class="lotusOptions">
        ${
    orderedLotus.map((u) => `
          <div data-key="${u.internalName}" data-cost="${u.cost}" data-name="${u.name}" data-lotus="true">
            <button class="consumablePurchaseBtn" style="width: 190px"> 
              <p style="text-align: center; width: 180px">${
      i18next.t('pseudoCoins.lotus.purchaseBtn', {
        amount: u.length,
        cost: u.cost
      })
    }</p>
            </button>
          </div>
        `).join('')
  }
      </div>
    </div>
  `

  return html
}

export const toggleConsumablesTab = () => {
  initializeConsumablesTab()

  tab.style.display = 'flex'
}

export const clearConsumablesTab = () => {
  tab.style.display = 'none'
}

export const updateLotusDisplay = () => {
  if (isLotusInventoryLoaded()) {
    setLotusBalance(getOwnedLotus())
  } else {
    setLotusBalanceLoading()
  }

  DOMCacheGetOrSet('lotusOwned').textContent = i18next.t('pseudoCoins.lotus.owned', {
    x: format(getOwnedLotus(), 0, true)
  })
  DOMCacheGetOrSet('lotusUsed').textContent = i18next.t('pseudoCoins.lotus.lifetimeUsed', {
    x: format(getUsedLotus(), 0, true)
  })
}
