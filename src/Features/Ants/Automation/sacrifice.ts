import type Decimal from 'break_infinity.js'
import i18next from 'i18next'
import { format, player } from '../../../Synergism'
import { hasEnoughCrumbsForSacrifice, sacrificeOffCooldown } from '../AntSacrifice/constants'
import { antSacrificeRewards } from '../AntSacrifice/Rewards/calculate-rewards'
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
  return hasEnoughCrumbsForSacrifice(crumbs) && autoSacrificeData[sacMode].sacrificeCheck()
    && player.ants.toggles.autoSacrificeEnabled
    && sacrificeOffCooldown(time)
}
