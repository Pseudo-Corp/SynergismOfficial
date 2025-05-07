import i18next from 'i18next'
import { sendToWebsocket } from '../Login'
import { format } from '../Synergism'
import { Alert, Confirm } from '../UpdateHTML'
import { memoize } from '../Utility'
import { updatePseudoCoins } from './UpgradesSubtab'

interface ConsumableListItems {
  name: string
  description: string
  internalName: string
  length: string
  cost: number
}

type TimeSkipCategories = 'GLOBAL' | 'ASCENSION' | 'AMBROSIA'

const tab = document.querySelector<HTMLElement>('#pseudoCoins > #consumablesSection')!

const initializeConsumablesTab = memoize(() => {
  fetch('https://synergism.cc/consumables/list')
    .then((r) => r.json())
    .then((consumables: ConsumableListItems[]) => {
      // Thank you Gemini for the number test
      const durableConsume = consumables.filter((u) => !u.internalName.includes('TIMESKIP'))
      const timeSkip = consumables.filter((u) => u.internalName.includes('TIMESKIP'))

      // Update coin count just in case
      updatePseudoCoins()
      const grid = tab!.querySelector('#consumablesGrid')!
      grid.innerHTML = `${
        durableConsume.map((u) => `
        <div
          data-key="${u.internalName}"
          data-cost="${u.cost}"
          class="purchaseConsumableContainer"
          style="margin: 40px;"
        >
          <img src='Pictures/PseudoShop/${u.internalName}.png' alt='${u.name} Consumable' />
          <p>${u.name}</p>
          <p style="white-space: pre-line">${u.description.replace(/\\n/g, '\n')}</p>
          <button class="consumablePurchaseBtn"><p>ACTIVATE: </p><p>${u.cost} PseudoCoins</p></button>
        </div>
      `).join('')
      }
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

export const createTimeskipHTML = (timeSkips: ConsumableListItems[], filter: TimeSkipCategories) => {
  // Safe because we check for if length is a numeric string earlier
  const relevantTimeSkips = timeSkips.filter((u) => u.internalName.includes(filter)).sort((a, b) =>
    +a.length - +b.length
  )
  return `
  <div class="timeSkipContainer purchaseConsumableContainer">
    <img src='Pictures/PseudoShop/${filter}TimeSkip.png' alt='${filter} TimeSkip Box' />
    <p>${i18next.t(`pseudoCoins.timeSkips.${filter}.title`)}</p>
    <p style="text-align: center; min-height: 55px">${i18next.t(`pseudoCoins.timeSkips.${filter}.description`)}</p>
    <p style="text-align: center">${i18next.t('pseudoCoins.timeSkips.warning')}</p>
    <div class="timeSkipOptions">
      ${
    relevantTimeSkips.map((u) => `
        <div data-key=${u.internalName} data-cost=${u.cost}>
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

export const toggleConsumablesTab = () => {
  initializeConsumablesTab()

  tab.style.display = 'flex'
}

export const clearConsumablesTab = () => {
  tab.style.display = 'none'
}
