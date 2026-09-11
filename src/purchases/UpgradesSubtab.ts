import i18next from 'i18next'
import { z } from 'zod'
import { DOMCacheGetOrSet } from '../Cache/DOM'
import { type PseudoCoinUpgradeNames, updatePCoinCache } from '../PseudoCoinUpgrades'
import { Alert } from '../UpdateHTML'
import { memoize } from '../Utility'
import { upgradeResponse } from './CartTab'
import { setPseudoCoinBalance, setPseudoCoinBalanceLoading } from './PseudoCoinBalances'

interface Upgrades {
  upgradeId: number
  maxLevel: number
  name: string
  description: string
  language: Record<string, { cost: string; effect: string; levelEffects: string[] }>
  icon: string
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
  upgrades: Upgrades[]
  playerUpgrades: PlayerUpgrades[]
}

interface CoinsResponse {
  coins: number
}

const tab = document.querySelector<HTMLElement>('#pseudoCoins > #upgradesContainer')!
let activeUpgrade: UpgradesList | undefined
let pseudoCoinBalanceRequest = 0

const backendTextOptions = {
  keySeparator: false,
  nsSeparator: false
} as const

const buyUpgradeSchema = z.object({
  upgradeId: z.number(),
  level: z.number()
})

function setActiveUpgrade (upgrade: UpgradesList) {
  activeUpgrade = upgrade
  const language = upgrade.language[i18next.language] ?? upgrade.language.en

  DOMCacheGetOrSet('pCoinUpgradeName').textContent = upgrade.name
  DOMCacheGetOrSet('description').textContent = upgrade.description
  DOMCacheGetOrSet('pCoinUpgradeIcon').setAttribute('src', upgrade.icon)
  DOMCacheGetOrSet('pCoinUpgradeIcon').setAttribute('alt', upgrade.name)

  const levelCostMap: { [level: number]: number } = {}
  upgrade.level.forEach((level, index) => {
    levelCostMap[level] = upgrade.cost[index]
  })

  const buy = DOMCacheGetOrSet('buy')
  const currEffect = DOMCacheGetOrSet('pCoinEffectCurr')
  const nextEffect = DOMCacheGetOrSet('pCoinEffectNext')

  currEffect.innerHTML = `${i18next.t('pseudoCoins.currEffect')} ${
    i18next.t(language.levelEffects[upgrade.playerLevel], backendTextOptions)
  }`

  const costs = DOMCacheGetOrSet('pCoinScalingCosts')
  const effects = DOMCacheGetOrSet('pCoinScalingEffect')

  if (upgrade.playerLevel === upgrade.maxLevel) {
    buy.setAttribute('disabled', '')
    buy.setAttribute('style', 'display: none')
    nextEffect.setAttribute('style', 'display: none')
    nextEffect.textContent = ''
  } else {
    buy.removeAttribute('disabled')
    buy.removeAttribute('style')
    nextEffect.removeAttribute('style')
    nextEffect.innerHTML = `${i18next.t('pseudoCoins.nextEffect')} ${
      i18next.t(language.levelEffects[upgrade.playerLevel + 1], backendTextOptions)
    }`
    buy.innerHTML = i18next.t('pseudoCoins.buyButton', {
      amount: Intl.NumberFormat().format(levelCostMap[upgrade.playerLevel + 1])
    })
  }

  costs.textContent = language.cost
  effects.textContent = language.effect
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

    await updatePseudoCoins()

    updatePCoinCache(upgrade.internalName, parsed.data.level)
  } else {
    Alert(
      'The purchase succeeded, but the upgrade display could not be updated. It will be synchronized automatically.'
    )
  }
}

const initializeUpgradeSubtab = memoize(() => {
  updatePseudoCoins()
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

  DOMCacheGetOrSet('upgradeGrid').replaceChildren(...[...grouped.values()].map((upgrade) => {
    const element = document.createElement('div')
    element.dataset.id = String(upgrade.upgradeId)
    element.dataset.key = upgrade.name

    const icon = document.createElement('img')
    icon.src = upgrade.icon
    icon.alt = upgrade.name

    const level = document.createElement('p')
    level.id = 'a'
    level.textContent = `${upgrade.playerLevel}/${upgrade.maxLevel}`

    const maxed = document.createElement('p')
    maxed.id = 'b'
    maxed.textContent = upgrade.playerLevel === upgrade.maxLevel ? '✔️' : ''

    element.append(icon, level, maxed)
    return element
  }))

  const upgradesInGrid = tab.querySelectorAll<HTMLElement>('#upgradeGrid > div[data-id]')
  upgradesInGrid.forEach((element) => {
    element.addEventListener('click', (e) => {
      const upgradeId = Number((e.target as HTMLElement).closest('div')?.getAttribute('data-id'))

      if (Number.isNaN(upgradeId) || !Number.isSafeInteger(upgradeId)) {
        Alert('Stop touching the fucking html! We do server-side validations!')
        return
      }

      const upgrade = [...grouped.values()].find((u) => u.upgradeId === upgradeId)
      if (upgrade) {
        setActiveUpgrade(upgrade)
      }

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

export const updatePseudoCoins = async () => {
  const request = ++pseudoCoinBalanceRequest
  setPseudoCoinBalanceLoading()

  const response = await fetch('https://synergism.cc/stripe/coins')
  const coins = await response.json() as CoinsResponse

  if (request === pseudoCoinBalanceRequest) {
    setPseudoCoinBalance(coins.coins)
  }

  return coins.coins
}
