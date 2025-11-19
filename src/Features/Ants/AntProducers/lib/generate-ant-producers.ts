import Decimal from 'break_infinity.js'
import { calculateActualAntSpeedMult } from '../../../../Calculate'
import { player } from '../../../../Synergism'
import { activateELO } from '../../AntSacrifice/Rewards/ELO/RebornELO/lib/create-reborn'
import { AntProducers, LAST_ANT_PRODUCER } from '../../structs/structs'
import { antProducerData } from '../data/data'
import { calculateBaseAntsToBeGenerated } from './calculate-production'

export const canGenerateAntCrumbs = (): boolean => {
  // Cube 5x8 is "Wow! I want to ALWAYS generate Galactic Crumbs."
  return player.challengecompletions[8] > 0 || player.cubeUpgrades[48] > 0
}

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

  const crumbsToGenerate = calculateBaseAntsToBeGenerated(AntProducers.Workers, antSpeedMult).times(dt)
  // Separately handle Crumbs in the same way
  player.ants.crumbs = Decimal.add(player.ants.crumbs, crumbsToGenerate)
  player.ants.crumbsThisSacrifice = Decimal.add(player.ants.crumbsThisSacrifice, crumbsToGenerate)
  player.ants.crumbsEverMade = Decimal.add(player.ants.crumbsEverMade, crumbsToGenerate)

  // Activate ELO if appropriate
  activateELO(dt)
}
