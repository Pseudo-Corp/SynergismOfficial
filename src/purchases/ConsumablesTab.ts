import i18next from 'i18next'
import { sendToWebsocket } from '../Login'
import { Alert, Confirm } from '../UpdateHTML'
import { memoize } from '../Utility'
import { format } from '../Synergism'

interface ConsumableListItems {
  name: string
  description: string
  internalName: string
  length: string | number
  cost: number
}

interface DurableConsumableItems {
  name: string
  description: string
  internalName: string
  length: string
  cost: number
}

interface TimeSkipConsumableItems {
  name: string
  description: string
  internalName: string
  length: number
  cost: number
}

type TimeSkipCategories = 'GLOBAL' | 'ASCENSION' | 'AMBROSIA'

const tab = document.querySelector<HTMLElement>('#pseudoCoins > #consumablesGrid')!

const initializeConsumablesTab = memoize(() => {
  fetch('https://synergism.cc/consumables/list')
    .then((r) => r.json())
    .then((consumables: ConsumableListItems[]) => {
      const durableConsume = consumables.filter((u) => typeof u.length === 'string') as DurableConsumableItems[]
      const timeSkip = consumables.filter((u) => typeof u.length === 'number') as TimeSkipConsumableItems[]
      tab.innerHTML = `${durableConsume.map((u) => `
        <div
          data-key="${u.internalName}"
          data-cost="${u.cost}"
          class="purchaseConsumableContainer"
          style="margin: 40px;"
        >
          <img src='Pictures/PseudoShop/${u.internalName}.png' alt='${u.name} Consumable' />
          <p>${u.name}</p>
          <p style="white-space: pre-line">${u.description}</p>
          <button class="consumablePurchaseBtn"><p>ACTIVATE: </p><p>${u.cost} PseudoCoins</p></button>
        </div>
      `).join('')}
      <div class="timeSkipSet">
        ${createTimeskipHTML(timeSkip, 'GLOBAL')}
        ${createTimeskipHTML(timeSkip, 'ASCENSION')}
        ${createTimeskipHTML(timeSkip, 'AMBROSIA')}
      </div>
      `
      tab.querySelectorAll('div > button').forEach((element) => {
        const key = element.parentElement!.getAttribute('data-key')!
        const cost = element.parentElement!.getAttribute('data-cost')!
        element.addEventListener('click', async () => {
          const alert = await Confirm(`Please confirm you would like to activate a ${key} for ${cost} PseudoCoins`)
          if (!alert) return Alert('Purchase cancelled')
          else {
            sendToWebsocket(JSON.stringify({
              type: 'consume',
              consumable: key
            }))
          }
        })
      })
    })
})

export const createTimeskipHTML = (timeSkips: TimeSkipConsumableItems[], filter: TimeSkipCategories) => {
  const relevantTimeSkips = timeSkips.filter((u) => u.internalName.includes(filter)).sort((a, b) => a.length - b.length)
  return `
  <div class="timeSkipContainer purchaseConsumableContainer">
    <img src='Pictures/PseudoShop/${filter}TimeSkip.png' alt='${filter} TimeSkip Box' />
    <p>${i18next.t(`pseudoCoins.timeSkips.${filter}.title`)}</p>
    <p style="text-align: center; min-height: 55px">${i18next.t(`pseudoCoins.timeSkips.${filter}.description`)}</p>
    <p style="text-align: center">${i18next.t("pseudoCoins.timeSkips.warning")}</p>
    <div class="timeSkipOptions">
      ${relevantTimeSkips.map((u) => `
        <div data-key=${u.internalName} data-cost=${u.cost}>
          <button class="consumablePurchaseBtn" style="width: 190px"> 
            <p style="text-align: center; width: 180px">${i18next.t("pseudoCoins.timeSkips.purchaseBtn", {
            time: format(Math.floor(u.length / 60), 0, true),
            cost: format(u.cost, 0, true)
            })}</p>
          </button>
        </div>
      `).join('')}
    </div>
  </div>
  `
}

export const toggleConsumablesTab = () => {
  initializeConsumablesTab()

  tab.style.display = 'flex'
}

export const clearConsumablesTab = () => {
  tab.style.display = 'none'
}
