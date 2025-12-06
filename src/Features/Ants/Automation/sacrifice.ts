import type Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { format, player } from '../../../Synergism'
import { hasEnoughCrumbsForSacrifice, sacrificeOffCooldown } from '../AntSacrifice/constants'
import { antSacrificeRewards } from '../AntSacrifice/Rewards/calculate-rewards'
import { calculateAvailableRebornELO } from '../AntSacrifice/Rewards/ELO/RebornELO/lib/calculate'
import { AutoSacrificeModes } from '../toggles/structs/sacrifice'
import type { AutoSacrificeModeData } from './structs/structs'

export const autoSacrificeData: Record<AutoSacrificeModes, AutoSacrificeModeData> = {
  [AutoSacrificeModes.InGameTime]: {
    sacrificeCheck: () => {
      return player.antSacrificeTimer >= player.ants.toggles.autoSacrificeThreshold
    },
    modeName: () => i18next.t('ants.autoSacrifice.inGameTimer.name'),
    infoText: () =>
      i18next.t('ants.autoSacrifice.inGameTimer.info', {
        curr: format(player.antSacrificeTimer, 2, true),
        req: format(player.ants.toggles.autoSacrificeThreshold, 0, true)
      }),
    modeHTMLcolor: 'var(--lightseagreen-text-color)'
  },
  [AutoSacrificeModes.RealTime]: {
    sacrificeCheck: () => {
      return player.antSacrificeTimerReal >= player.ants.toggles.autoSacrificeThreshold
    },
    modeName: () => i18next.t('ants.autoSacrifice.realLifeTimer.name'),
    infoText: () =>
      i18next.t('ants.autoSacrifice.realLifeTimer.info', {
        curr: format(player.antSacrificeTimerReal, 2, true),
        req: format(player.ants.toggles.autoSacrificeThreshold, 0, true)
      }),
    modeHTMLcolor: 'lightgray'
  },
  [AutoSacrificeModes.ImmortalELOGain]: {
    sacrificeCheck: () => {
      const immortalELOToGain = antSacrificeRewards().immortalELO
      return immortalELOToGain >= player.ants.toggles.autoSacrificeThreshold // Todo: Replace with an actual criterion in Ants
    },
    modeName: () => i18next.t('ants.autoSacrifice.immortalELOGain.name'),
    infoText: () =>
      i18next.t('ants.autoSacrifice.immortalELOGain.info', {
        curr: format(antSacrificeRewards().immortalELO, 0, true),
        req: format(player.ants.toggles.autoSacrificeThreshold, 0, true)
      }),
    modeHTMLcolor: 'crimson'
  },
  [AutoSacrificeModes.MaxRebornELO]: {
    sacrificeCheck: () => {
      const rebornELOToGain = player.ants.immortalELO - player.ants.rebornELO
      return rebornELOToGain <= 0.001 // Effectively maxed out
    },
    modeName: () => i18next.t('ants.autoSacrifice.maxRebornELO.name'),
    infoText: () => {
      const rebornELOToGain = player.ants.immortalELO - player.ants.rebornELO
      return i18next.t('ants.autoSacrifice.maxRebornELO.info', {
        curr: format(rebornELOToGain, 0, true)
      })
    },
    modeHTMLcolor: '#00DDFF'
  }
}

export const canAutoSacrifice = (crumbs: Decimal, sacMode: AutoSacrificeModes, time: number): boolean => {
  const availableRebornELO = calculateAvailableRebornELO()
  const maxRebornELO = availableRebornELO < 0.001 // Could probably be 0, this is effectively fine

  // Check first if we should only sacrifice at max reborn ELO
  const onlySacrificeMaxReborn = player.ants.toggles.onlySacrificeMaxRebornELO
  if (onlySacrificeMaxReborn && !maxRebornELO) {
    return false
  }

  const universalChecks = hasEnoughCrumbsForSacrifice(crumbs)
    && sacrificeOffCooldown(time)
    && player.ants.toggles.autoSacrificeEnabled
  const specificCheck = autoSacrificeData[sacMode].sacrificeCheck()
  const alwaysSacrificeMaxReborn = player.ants.toggles.alwaysSacrificeMaxRebornELO
  if (alwaysSacrificeMaxReborn) {
    return universalChecks && (maxRebornELO || specificCheck)
  } else {
    return universalChecks && specificCheck
  }
}
