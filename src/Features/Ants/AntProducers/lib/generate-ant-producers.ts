import Decimal from 'break_infinity.js'
import { calculateActualAntSpeedMult } from '../../../../Calculate'
import { player } from '../../../../Synergism'
import { activateELO } from '../../AntSacrifice/Rewards/ELO/RebornELO/lib/create-reborn'
import { AntProducers, LAST_ANT_PRODUCER } from '../../structs/structs'
import { antProducerData } from '../data/data'
import { calculateBaseAntsToBeGenerated } from './calculate-production'

export const generateAntsAndCrumbs = (dt: number): void => {
  // TODO: Place somewhere in Ants.
  const antSpeedMult = calculateActualAntSpeedMult()

  for (let antType = LAST_ANT_PRODUCER; antType > AntProducers.Workers; antType--) {
    const baseGeneration = calculateBaseAntsToBeGenerated(antType, antSpeedMult)
    const producedAnt = antProducerData[antType].produces!
    player.ants.producers[producedAnt].generated = player.ants.producers[producedAnt].generated.add(
      baseGeneration
        .times(dt)
    )
  }

  // Separately handle Crumbs in the same way
  player.ants.crumbs = player.ants.crumbs.add(
    calculateBaseAntsToBeGenerated(AntProducers.Workers, antSpeedMult)
      .times(dt)
  )

  player.ants.highestCrumbsThisSacrifice = Decimal.max(player.ants.highestCrumbsThisSacrifice, player.ants.crumbs)
  player.ants.highestCrumbsEver = Decimal.max(player.ants.highestCrumbsEver, player.ants.crumbs)

  // Activate ELO if appropriate
  activateELO(dt)
}
