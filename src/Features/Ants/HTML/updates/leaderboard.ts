import i18next from 'i18next'
import { DOMCacheGetOrSet } from '../../../../Cache/DOM'
import { format, formatAsPercentIncrease, player } from '../../../../Synergism'
import { calculateLeaderboardValue } from '../../AntSacrifice/Rewards/ELO/RebornELO/QuarkCorner/lib/calculate-leaderboard'
import { quarksFromELOMult } from '../../AntSacrifice/Rewards/ELO/RebornELO/QuarkCorner/lib/calculate-quarks'
import { LEADERBOARD_WEIGHTS } from '../../AntSacrifice/Rewards/ELO/RebornELO/QuarkCorner/lib/leaderboard-update'
import { calculateRebornELOThresholds } from '../../AntSacrifice/Rewards/ELO/RebornELO/Stages/lib/threshold'

export let currentLeaderboardMode: 'daily' | 'allTime' = 'daily'

export const toggleLeaderboardMode = () => {
  currentLeaderboardMode = currentLeaderboardMode === 'daily' ? 'allTime' : 'daily'
  updateLeaderboardUI()
}

export const updateLeaderboardUI = () => {
  const leaderboard = currentLeaderboardMode === 'daily'
    ? player.ants.highestRebornELODaily
    : player.ants.highestRebornELOEver

  // Update toggle button text
  const toggleButton = DOMCacheGetOrSet('antLeaderboardToggle')
  const modeKey = currentLeaderboardMode === 'daily' ? 'toggleDaily' : 'toggleAllTime'
  toggleButton.querySelector('span')!.setAttribute('i18n', `ants.leaderboard.${modeKey}`)
  toggleButton.querySelector('span')!.textContent = i18next.t(`ants.leaderboard.${modeKey}`)
  toggleButton.setAttribute('data-mode', currentLeaderboardMode)

  // Update leaderboard value
  const leaderboardValue = calculateLeaderboardValue(leaderboard)
  DOMCacheGetOrSet('antLeaderboardValueAmount').innerHTML = i18next.t('ants.leaderboard.value', {
    x: format(leaderboardValue, 0, true),
    y: format(calculateRebornELOThresholds(leaderboardValue), 0, true)
  })

  if (currentLeaderboardMode === 'daily') {
    DOMCacheGetOrSet('antLeaderboardQuarkValueAmount').innerHTML = i18next.t('ants.leaderboard.quarksGained', {
      x: format(player.ants.quarksGainedFromAnts, 0, false)
    })
  } else {
    DOMCacheGetOrSet('antLeaderboardQuarkValueAmount').innerHTML = i18next.t('ants.leaderboard.quarkMult', {
      x: formatAsPercentIncrease(quarksFromELOMult(), 2)
    })
  }

  // Update table rows
  const tbody = DOMCacheGetOrSet('antLeaderboardTableBody')
  tbody.innerHTML = ''

  const currentSacrificeId = player.ants.currentSacrificeId

  for (let i = 0; i < leaderboard.length; i++) {
    const entry = leaderboard[i]
    const row = document.createElement('tr')

    // Highlight current ongoing sacrifice
    if (entry.sacrificeId === currentSacrificeId) {
      row.classList.add('antLeaderboardCurrentSacrifice')
    }

    // Rank column
    const rankCell = document.createElement('td')
    rankCell.textContent = `#${i + 1}`
    row.appendChild(rankCell)

    // ELO column
    const eloCell = document.createElement('td')
    eloCell.textContent = format(entry.elo, 0, true)
    row.appendChild(eloCell)

    const stageCell = document.createElement('td')
    stageCell.textContent = format(calculateRebornELOThresholds(entry.elo), 0, true)
    row.appendChild(stageCell)

    const weightCell = document.createElement('td')
    weightCell.textContent = `${LEADERBOARD_WEIGHTS[i]}`
    row.appendChild(weightCell)

    tbody.appendChild(row)
  }
}
