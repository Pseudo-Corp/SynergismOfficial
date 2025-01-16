import i18next from 'i18next'
import { z } from 'zod'
import { DOMCacheGetOrSet } from '../Cache/DOM'
import {
  displayPCoinEffect,
  type PseudoCoinUpgradeNames,
  showCostAndEffect,
  updatePCoinCache
} from '../PseudoCoinUpgrades'
import { Alert } from '../UpdateHTML'
import { memoize } from '../Utility'
import { upgradeResponse } from './CartTab'

interface Upgrades {
  upgradeId: number
  maxLevel: number
  name: string
  description: string
  internalName: PseudoCoinUpgradeNames
  level: number
  cost: number
}

interface PlayerUpgrades {
  level: number
  upgradeId: number
  internalName: PseudoCoinUpgradeNames
}

type UpgradesList = Omit<Upgrades, 'level' | 'cost'> & {
  level: number[]
  cost: number[]
  playerLevel: number
}

export interface UpgradesResponse {
  coins: number
  upgrades: Upgrades[]
  playerUpgrades: PlayerUpgrades[]
  tier: number
}

interface CoinsResponse {
  coins: number
}

const tab = document.querySelector<HTMLElement>('#pseudoCoins > #upgradesContainer')!
let activeUpgrade: UpgradesList | undefined

const buyUpgradeSchema = z.object({
  upgradeId: z.number(),
  level: z.number()
})

function setActiveUpgrade (upgrade: UpgradesList | undefined) {
  activeUpgrade = upgrade

  const name = i18next.t(`pseudoCoins.upgradeNames.${upgrade?.internalName}`)

  DOMCacheGetOrSet('pCoinUpgradeName').textContent = `${name ?? '???'}`
  DOMCacheGetOrSet('description').textContent = `${upgrade?.description ?? '???'}`
  DOMCacheGetOrSet('pCoinUpgradeIcon').setAttribute(
    'src',
    `Pictures/PseudoShop/${upgrade?.internalName ?? 'PseudoCoins'}.png`
  )

  const buy = DOMCacheGetOrSet('buy')
  const currEffect = DOMCacheGetOrSet('pCoinEffectCurr')
  const nextEffect = DOMCacheGetOrSet('pCoinEffectNext')

  currEffect.innerHTML = `${i18next.t('pseudoCoins.currEffect')} ${
    i18next.t(displayPCoinEffect(upgrade!.internalName, upgrade!.playerLevel))
  }`
  nextEffect.innerHTML = `${i18next.t('pseudoCoins.nextEffect')} ${
    i18next.t(displayPCoinEffect(upgrade!.internalName, upgrade!.playerLevel + 1))
  }`

  const costs = DOMCacheGetOrSet('pCoinScalingCosts')
  const effects = DOMCacheGetOrSet('pCoinScalingEffect')

  if (upgrade && upgrade.playerLevel === upgrade.maxLevel) {
    buy?.setAttribute('disabled', '')
    buy!.setAttribute('style', 'display: none')
    nextEffect.setAttribute('style', 'display: none')
  } else {
    buy?.removeAttribute('disabled')
    buy!.removeAttribute('style')
    nextEffect.removeAttribute('style')
    buy!.innerHTML = upgrade
      ? `${
        i18next.t('pseudoCoins.buyButton', { amount: Intl.NumberFormat().format(upgrade.cost[upgrade.playerLevel]) })
      }`
      : 'Cannot buy. Sorry!'
    const info = showCostAndEffect(upgrade!.internalName)
    costs.innerHTML = info.cost
    effects.innerHTML = info.effect
  }
}

async function purchaseUpgrade (upgrades: Map<number, UpgradesList>) {
  if (!activeUpgrade) {
    Alert('Click on an upgrade to buy it.')
    return
  }

  const response = await fetch(`https://synergism.cc/stripe/buy-upgrade/${activeUpgrade.upgradeId}`, {
    method: 'PUT'
  })
  const json = await response.json()
  const parsed = buyUpgradeSchema.safeParse(json)

  if (!parsed.success) {
    Alert(`Didn't buy the upgrade... try again? ${JSON.stringify(json)}`)
    return
  }

  const upgrade = upgrades?.get(parsed.data.upgradeId)

  if (upgrade) {
    upgrade.playerLevel = parsed.data.level
    Alert(`Upgraded ${upgrade.name} (${upgrade.description}) to ${parsed.data.level}!`)

    tab.querySelector('#upgradeGrid > .active > p#a')!.textContent = `${upgrade.playerLevel}/${upgrade.maxLevel}`
    tab.querySelector('#upgradeGrid > .active > p#b')!.textContent = upgrade.playerLevel === upgrade.maxLevel ? '✔️' : ''

    setActiveUpgrade(upgrade)

    const response = await fetch('https://synergism.cc/stripe/coins')
    const coins = await response.json() as CoinsResponse

    tab!.querySelector('#pseudoCoinAmounts > #currentCoinBalance')!.innerHTML = `${
      i18next.t('pseudoCoins.coinCount', { amount: Intl.NumberFormat().format(coins.coins) })
    }`

    updatePCoinCache(upgrade.internalName, parsed.data.level)
  } else {
    Alert('Upgrades did not load. Please refresh the page.')
  }
}

const initializeUpgradeSubtab = memoize(() => {
  DOMCacheGetOrSet('currentCoinBalance').innerHTML = `${
    i18next.t('pseudoCoins.coinCount', { amount: Intl.NumberFormat().format(upgradeResponse.coins) })
  }`
  const grouped = upgradeResponse.upgrades.reduce((map, upgrade) => {
    const current = map.get(upgrade.upgradeId)
    const playerUpgrade = upgradeResponse.playerUpgrades.find((v) => v.upgradeId === upgrade.upgradeId)

    if (!current) {
      map.set(upgrade.upgradeId, {
        ...upgrade,
        cost: [upgrade.cost],
        level: [upgrade.level],
        playerLevel: playerUpgrade?.level ?? 0
      })
    } else {
      current.maxLevel = Math.max(current.maxLevel, upgrade.maxLevel)
      current.cost.push(upgrade.cost)
      current.level.push(upgrade.level)
    }

    return map
  }, new Map<number, UpgradesList>())

  tab.querySelector('#upgradeGrid')!.innerHTML = [...grouped.values()].map((u) => `
    <div
      data-id="${u.upgradeId}"
      data-key="${u.name}"
      style="margin: 40px;"
    >
      <img src='Pictures/PseudoShop/${u.internalName}.png' alt='${u.internalName}' />
      <p id="a">${u.playerLevel}/${u.maxLevel}</p>
      ${u.playerLevel === u.maxLevel ? '<p id="b">✔️</p>' : '<p id="b"></p>'}
    </div>
  `).join('')

  const upgradesInGrid = tab.querySelectorAll<HTMLElement>('#upgradeGrid > div[data-id]')
  upgradesInGrid.forEach((element) => {
    element.addEventListener('click', (e) => {
      const upgradeId = Number((e.target as HTMLElement).closest('div')?.getAttribute('data-id'))

      if (Number.isNaN(upgradeId) || !Number.isSafeInteger(upgradeId)) {
        Alert('Stop touching the fucking html! We do server-side validations!')
        return
      }

      setActiveUpgrade([...grouped.values()].find((u) => u.upgradeId === upgradeId))

      // Setting an active class here turns the border white due to a CSS rule
      upgradesInGrid.forEach((u) => u.classList.remove('active'))
      element.classList.add('active')
    })
  })

  DOMCacheGetOrSet('buy').addEventListener('click', () => {
    purchaseUpgrade(grouped)
  })
})

export const toggleUpgradeSubtab = () => {
  initializeUpgradeSubtab()

  tab.style.display = 'flex'
}

export const clearUpgradeSubtab = () => {
  tab.style.display = 'none'
}
