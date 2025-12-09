import i18next from 'i18next'
import { DOMCacheGetOrSet } from '../Cache/DOM'
import { getOwnedLotus, getUsedLotus, sendToWebsocket } from '../Login'
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
      // TODO: Erm...
      const durableConsume = consumables.filter((u) => u.internalName.includes('BELL'))
      const timeSkip = consumables.filter((u) => u.internalName.includes('TIMESKIP'))
      const lotus = consumables.filter((u) => u.internalName.includes('LOTUS'))

      // Update coin count just in case
      updatePseudoCoins()

      const grid = tab!.querySelector('#consumablesGrid')!
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
            <button class="consumablePurchaseBtn"><p>ACTIVATE: </p><p>${u.cost} PseudoCoins</p></button>
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
      tab.querySelectorAll('div > button').forEach((element) => {
        const key = element.parentElement!.getAttribute('data-key')!
        const cost = element.parentElement!.getAttribute('data-cost')!
        const name = element.parentElement!.getAttribute('data-name')!
        const lotus = element.parentElement?.getAttribute('data-lotus') === 'true'
        // TODO (for a future time): Lotus has different verbage since we don't actually
        // "activate" them right away. Also, Platonic needs to i18n this like yesterday
        if (!lotus) {
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

export const createLotusHTML = (lotusItems: ConsumableListItems[]) => {
  const orderedLotus = lotusItems.sort((a, b) => +a.length - +b.length)
  const html = `
    <div class="lotusContainer purchaseConsumableContainer" style="">
      <div class="iconAndNameContainer">
        <img src='Pictures/PseudoShop/LOTUS.png' alt='Lotus Box' />
        <p class="gradientText lotusGradient">${i18next.t('pseudoCoins.lotus.nameSingular')}</p>
      </div>
      <div class="lotusHeaderText">
        <p id="lotusOwned">${i18next.t('pseudoCoins.lotus.owned', { x: format(getOwnedLotus(), 0, true) })}</p>
        <p id="lotusUsed">${i18next.t('pseudoCoins.lotus.lifetimeUsed', { x: format(getUsedLotus(), 0, true) })}</p>
      </div>
      <p style="text-align: center; min-height: 55px">${i18next.t('pseudoCoins.lotus.intro')}</p>
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
  DOMCacheGetOrSet('lotusOwned').textContent = i18next.t('pseudoCoins.lotus.owned', {
    x: format(getOwnedLotus(), 0, true)
  })
  DOMCacheGetOrSet('lotusUsed').textContent = i18next.t('pseudoCoins.lotus.lifetimeUsed', {
    x: format(getUsedLotus(), 0, true)
  })
}
