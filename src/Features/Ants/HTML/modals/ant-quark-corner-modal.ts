import i18next from 'i18next'
import { calculateQuarkMultiplier } from '../../../../Calculate'
import { format, player } from '../../../../Synergism'
import { calculateLeaderboardValue } from '../../AntSacrifice/Rewards/ELO/RebornELO/QuarkCorner/lib/calculate-leaderboard'
import { quarksFromELOMult } from '../../AntSacrifice/Rewards/ELO/RebornELO/QuarkCorner/lib/calculate-quarks'
import {
  calculateRebornELOThresholds,
  calculateToNextELOThreshold,
  quarkMultiplierPerThreshold,
  thresholdTranches
} from '../../AntSacrifice/Rewards/ELO/RebornELO/Stages/lib/threshold'
import { currentLeaderboardMode } from '../updates/leaderboard'

export const antCornerStageHTML = () => {
  const leaderboard = currentLeaderboardMode === 'daily'
    ? player.ants.highestRebornELODaily
    : player.ants.highestRebornELOEver

  const leaderboardELO = calculateLeaderboardValue(leaderboard)
  let leaderboardStages = calculateRebornELOThresholds(leaderboardELO)
  const eloToNextStage = calculateToNextELOThreshold(leaderboardELO, leaderboardStages)

  const introText = currentLeaderboardMode === 'daily'
    ? i18next.t('ants.leaderboard.stageModal.introDaily', { x: format(leaderboardStages, 0, true) })
    : i18next.t('ants.leaderboard.stageModal.introAllTime', { x: format(leaderboardStages, 0, true) })

  const introHTML = `<span style="font-weight: bold; font-size: 1.2em;">${introText}</span>`
  let tranchHTML = ''
  for (const tranch of thresholdTranches) {
    const stagesInThisTranche = Math.min(tranch.stages, leaderboardStages)
    const ELOUsed = stagesInThisTranche * tranch.perStage
    tranchHTML += `${
      i18next.t('ants.leaderboard.stageModal.stageLine', {
        x: format(stagesInThisTranche, 0, true),
        y: format(ELOUsed, 0, true),
        z: format(tranch.perStage, 0, true)
      })
    }<br>`
    leaderboardStages -= stagesInThisTranche
    if (leaderboardStages <= 0) {
      break
    }
  }
  const closingHTML = i18next.t('ants.leaderboard.stageModal.toNextStage', { x: format(eloToNextStage, 0, true) })
  const disclaimerHTML = `<span style="font-size: 0.8em; color: gray;">${
    i18next.t('ants.leaderboard.stageModal.disclaimer')
  }</span>`
  return `${introHTML}<br><br>${tranchHTML}<br>${closingHTML}<br>${disclaimerHTML}`
}

/**
 * "Daily" Leaderboard Quark Text Modal... NOT ALL-TIME.
 */
export const antCornerDailyQuarkHTML = () => {
  const quarksGained = player.ants.quarksGainedFromAnts
  const introHTML = `<span style="font-weight: bold; font-size: 1.2em;">${
    i18next.t('ants.leaderboard.dailyQuarkModal.intro', {
      x: format(quarksGained, 0, false)
    })
  }</span>`

  const leaderboard = player.ants.highestRebornELODaily
  const leaderboardELO = calculateLeaderboardValue(leaderboard)
  let leaderboardStages = calculateRebornELOThresholds(leaderboardELO)
  const stageQuarkMult = Math.pow(quarkMultiplierPerThreshold, leaderboardStages)

  let tranchHTML = ''
  for (const tranch of thresholdTranches) {
    const stagesInThisTranche = Math.min(tranch.stages, leaderboardStages)
    const quarksGainedInThisTranche = stagesInThisTranche * tranch.quarkPerStage
    tranchHTML += `${
      i18next.t('ants.leaderboard.dailyQuarkModal.quarkLine', {
        x: format(stagesInThisTranche, 0, true),
        y: format(quarksGainedInThisTranche, 0, false),
        z: format(tranch.quarkPerStage, 0, false)
      })
    }<br>`
    leaderboardStages -= stagesInThisTranche
    if (leaderboardStages <= 0) {
      break
    }
  }

  const bonusHTML = i18next.t('ants.leaderboard.dailyQuarkModal.bonusMult', {
    x: format(stageQuarkMult, 3, true)
  })
  const lifetimeMultHTML = i18next.t('ants.leaderboard.dailyQuarkModal.allTimeMult', {
    x: format(quarksFromELOMult(), 3, true)
  })

  const globalQuarkMultHTML = i18next.t('ants.leaderboard.dailyQuarkModal.globalQuarkMult', {
    x: format(calculateQuarkMultiplier(), 3, false)
  })

  return `${introHTML}<br><br>${tranchHTML}<br>${bonusHTML}<br>${lifetimeMultHTML}<br>${globalQuarkMultHTML}`
}

export const antCornerAllTimeQuarkHTML = () => {
  const lifetimeTotalELOValue = calculateLeaderboardValue(player.ants.highestRebornELOEver)
  const lifetimeStages = calculateRebornELOThresholds(lifetimeTotalELOValue)
  const quarkMult = quarksFromELOMult()
  const introHTML = `<span style="font-weight: bold; font-size: 1.2em;">${
    i18next.t('ants.leaderboard.allTimeQuarkModal.intro', {
      x: format(quarkMult, 3, true)
    })
  }</span>`

  const formulaHTML = i18next.t('ants.leaderboard.allTimeQuarkModal.formula')
  const specificMult = i18next.t('ants.leaderboard.allTimeQuarkModal.specificMult', {
    x: format(lifetimeStages, 0, true),
    y: format(lifetimeStages / 100, 2, true),
    z: format(quarkMult, 3, true)
  })

  return `${introHTML}<br><br>${formulaHTML}<br>${specificMult}`
}

export const antCornerQuarkHTML = () => {
  if (currentLeaderboardMode === 'daily') {
    return antCornerDailyQuarkHTML()
  } else {
    return antCornerAllTimeQuarkHTML()
  }
}
