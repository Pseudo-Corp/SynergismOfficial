import i18next from 'i18next'
import { DOMCacheGetOrSet } from '../Cache/DOM'
import {
  buyTimeSkip,
  getOwnedBells,
  getOwnedLotus,
  getUsedLotus,
  isLotusInventoryLoaded,
  sendToWebsocket,
  setOwnedBells
} from '../Login'
import { format } from '../Synergism'
import { changeTab, Tabs } from '../Tabs'
import { Alert, Confirm } from '../UpdateHTML'
import { memoize } from '../Utility'
import { setLotusBalance, setLotusBalanceLoading } from './PseudoCoinBalances'
import { updatePseudoCoins } from './UpgradesSubtab'

interface ConsumableListItems {
  name: string
  html?: {
    description: string
    buyNote: string
  }
  internalName: string
  length: string
  cost: number
}

const timeSkipCategories = ['GLOBAL', 'ASCENSION', 'AMBROSIA'] as const

type TimeSkipCategories = typeof timeSkipCategories[number]

const tab = document.querySelector<HTMLElement>('#pseudoCoins > #consumablesSection')!

const initializeConsumablesTab = memoize(() => {
  fetch('https://synergism.cc/consumables/list')
    .then((r) => r.json())
    .then((consumables: ConsumableListItems[]) => {
      const durableConsume = consumables.filter((u) => u.internalName.includes('BELL'))
      const timeSkip = consumables.filter((u) => u.internalName.includes('TIMESKIP'))
      const lotus = consumables.filter((u) => u.internalName.includes('LOTUS'))

      updatePseudoCoins()

      const grid = DOMCacheGetOrSet('consumablesGrid')
      grid.innerHTML = `
        ${durableConsume.map(createBellHTML).join('')}
        ${createLotusHTML(lotus)}
        ${timeSkipCategories.map((category) => createTimeSkipHTML(timeSkip, category)).join('')}
        <p class="consumableFootnote">${i18next.t('pseudoCoins.timeSkips.warning')}</p>
      `

      grid.querySelectorAll<HTMLButtonElement>('.consumableBuyButton').forEach((button) => {
        const key = button.dataset.key!
        const { cost, name } = button.dataset
        const isLotus = key.includes('LOTUS')

        button.addEventListener('click', async () => {
          let confirmMessage = i18next.t(
            isLotus ? 'pseudoCoins.lotus.buyConfirm' : 'pseudoCoins.consumables.confirmActivation',
            { name, cost }
          )

          if (key === 'HAPPY_HOUR_BELL' && getOwnedBells() > 0) {
            confirmMessage = i18next.t('pseudoCoins.consumables.confirmFreeActivation', { name })
          }

          const confirmed = await Confirm(confirmMessage)

          if (!confirmed) return Alert(i18next.t('pseudoCoins.consumables.cancelled'))
          else if (key.includes('TIMESKIP')) {
            buyTimeSkip(key)
          } else {
            // The server's updated count can take a while to arrive, and a click before then would spend PseudoCoins.
            if (key === 'HAPPY_HOUR_BELL' && getOwnedBells() > 0) {
              setOwnedBells(getOwnedBells() - 1)
              updateBellButton()
            }

            sendToWebsocket(JSON.stringify({
              type: 'consume',
              consumable: key,
              version: '2'
            }))
          }
        })
      })

      DOMCacheGetOrSet('consumableUseTips').addEventListener('click', () => changeTab(Tabs.Event))

      updateLotusDisplay()
      updateBellButton()
    })
})

const createBuyButtonHTML = (item: ConsumableListItems, label: string) => `
  <button class="consumableBuyButton" data-key="${item.internalName}" data-cost="${item.cost}" data-name="${item.name}">
    <span>${label}</span>
    <span>${i18next.t('pseudoCoins.consumables.cost', { cost: format(item.cost, 0, true) })}</span>
  </button>
`

const createBellHTML = (bell: ConsumableListItems) => `
  <div class="consumableRow bellConsumable">
    <img class="consumableIcon" src="Pictures/PseudoShop/${bell.internalName}.png" alt="">
    <div class="consumableText">
      <p class="consumableName gradientText bellGradient">${bell.name}</p>
      <div class="consumableDescription">${bell.html?.description}</div>
    </div>
    <div class="consumableBuy">
      ${createBuyButtonHTML(bell, i18next.t('pseudoCoins.consumables.activate'))}
      <p class="consumableBuyNote">${bell.html?.buyNote}</p>
      <button id="consumableUseTips" class="consumableTipsButton">${
  i18next.t('pseudoCoins.consumables.applyTips')
}</button>
    </div>
  </div>
`

const createTimeSkipHTML = (timeSkips: ConsumableListItems[], category: TimeSkipCategories) => `
  <div class="consumableRow timeSkipConsumable">
    <img class="consumableIcon" src="Pictures/PseudoShop/${category}TimeSkip.png" alt="">
    <div class="consumableText">
      <p class="consumableName">${i18next.t(`pseudoCoins.timeSkips.${category}.title`)}</p>
      <p class="consumableDescription">${i18next.t(`pseudoCoins.timeSkips.${category}.description`)}</p>
    </div>
    <div class="consumableBuy">
      ${
  timeSkips
    .filter((u) => u.internalName.includes(category))
    .sort((a, b) => +a.length - +b.length)
    .map((u) =>
      createBuyButtonHTML(
        u,
        i18next.t('pseudoCoins.timeSkips.duration', { time: format(Math.floor(+u.length / 60), 0, true) })
      )
    )
    .join('')
}
    </div>
  </div>
`

const createLotusHTML = (lotusItems: ConsumableListItems[]) => `
  <div class="consumableRow lotusConsumable">
    <img class="consumableIcon" src="Pictures/PseudoShop/LOTUS.png" alt="">
    <div class="consumableText">
      <p class="consumableName gradientText lotusGradient">${i18next.t('pseudoCoins.lotus.nameSingular')}</p>
      <p class="lotusCounts">
        <span id="lotusOwned">${i18next.t('pseudoCoins.lotus.owned', { x: format(getOwnedLotus(), 0, true) })}</span>
        <span id="lotusUsed">${
  i18next.t('pseudoCoins.lotus.lifetimeUsed', { x: format(getUsedLotus(), 0, true) })
}</span>
      </p>
      <p class="consumableDescription">${i18next.t('pseudoCoins.lotus.intro')}</p>
    </div>
    <div class="consumableBuy">
      ${
  lotusItems
    .sort((a, b) => +a.length - +b.length)
    .map((u) => createBuyButtonHTML(u, i18next.t('pseudoCoins.lotus.amount', { amount: u.length })))
    .join('')
}
    </div>
  </div>
`

export const toggleConsumablesTab = () => {
  initializeConsumablesTab()

  tab.style.display = 'flex'
}

export const clearConsumablesTab = () => {
  tab.style.display = 'none'
}

export const updateBellButton = () => {
  const button = tab.querySelector<HTMLButtonElement>('.consumableBuyButton[data-key="HAPPY_HOUR_BELL"]')

  if (!button) return

  const [label, cost] = button.querySelectorAll('span')
  const ownedBells = getOwnedBells()

  if (ownedBells > 0) {
    label.textContent = i18next.t('pseudoCoins.consumables.activateFree')
    cost.innerHTML = i18next.t('pseudoCoins.consumables.freeBells', { x: format(ownedBells, 0, true) })
  } else {
    label.textContent = i18next.t('pseudoCoins.consumables.activate')
    cost.innerHTML = i18next.t('pseudoCoins.consumables.cost', { cost: format(Number(button.dataset.cost), 0, true) })
  }
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
