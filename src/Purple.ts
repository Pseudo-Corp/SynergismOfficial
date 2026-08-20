import i18next from 'i18next'
import { calculateRedAmbrosiaReactantCapacityFromAmbrosia } from './PurpleReactor'
import { format, formatAsPercentIncrease, player } from './Synergism'
import { Alert, Prompt } from './UpdateHTML'
import { visualUpdatePurple } from './UpdateVisuals'

type PurpleReactorUpgradeRewards = {
  tutorial: {
    ambrosiaGeneration: number
    redAmbrosiaGeneration: number
  }
  purpleEfficiency1: {
    purpleEfficiency: number
  }
  purpleEfficiency2: {
    purpleEfficiency: number
  }
  purpleEfficiency3: {
    purpleEfficiency: number
  }
  purpleEfficiency4: {
    purpleEfficiency: number
  }
  purpleHoneyLuck1: {
    purpleHoneyLuck: number
  }
  purpleHoneyLuck2: {
    purpleHoneyLuck: number
  }
  purpleHoneyLuck3: {
    purpleHoneyLuck: number
  }
  purpleHoneyLuck4: {
    purpleHoneyLuck: number
  }
  purpleHalfLife1: {
    halfLifeReduction: number
  }
  purpleHalfLife2: {
    halfLifeReduction: number
  }
  purpleHalfLife3: {
    halfLifeReduction: number
  }
  purpleHalfLife4: {
    halfLifeReduction: number
  }
  purpleHoneyRequirementReduction1: {
    purpleHoneyRequirementMult: number
  }
  purpleHoneyRequirementReduction2: {
    purpleHoneyRequirementMult: number
  }
  purpleHoneyRequirementReduction3: {
    purpleHoneyRequirementMult: number
  }
  purpleHoneyRequirementReduction4: {
    purpleHoneyRequirementMult: number
  }
  paperweight: {
    nothing: void
  }
  purpleCapacityExpander1: {
    purpleCapacity: number
  }
  purpleCapacityExpander2: {
    purpleCapacity: number
  }
  purpleCapacityExpander3: {
    purpleCapacity: number
  }
  purpleCapacityExpander4: {
    purpleCapacity: number
  }
  obtainium: {
    obtainiumMultiplier: number
  }
  offerings: {
    offeringMultiplier: number
  }
  highestHoneyQuarks: {
    unlocked: boolean
  }
  highestHoneyGlobalSpeed: {
    unlocked: boolean
  }
  highestHoneyAscensionSpeed: {
    unlocked: boolean
  }
  highestHoneyAmbrosia: {
    unlocked: boolean
  }
  highestHoneyRedAmbrosia: {
    unlocked: boolean
  }
  highestHoneyAntELO: {
    unlocked: boolean
  }
  highestHoneyRebornELOSpeed: {
    unlocked: boolean
  }
}

export type PurpleReactorNames = keyof PurpleReactorUpgradeRewards

export type APRewards = {
  perLevelAP: number
  maxLevelAP: number
}

interface PurpleReactorUpgrade<T extends PurpleReactorNames, K extends keyof PurpleReactorUpgradeRewards[T]> {
  level: number
  purpleInvested: number
  maxLevel: number
  // In these formulas, costFormula is expected to be a cumulative function
  costFormula: (level: number) => number
  effects: (n: number, key: K) => PurpleReactorUpgradeRewards[T][K]
  notMaxedEffectsDescription: (n: number) => string
  maxedEffectsDescription: () => string
  apValue: APRewards
}

// Writing out 'level' and 'purpleInvested' as all zeroes is repetitive...
type PurpleReactorUpgradeDefinition<
  T extends PurpleReactorNames,
  K extends keyof PurpleReactorUpgradeRewards[T]
> = Omit<PurpleReactorUpgrade<T, K>, 'level' | 'purpleInvested'>

type PurpleReactorUpgradeData = {
  [K in PurpleReactorNames]: PurpleReactorUpgradeDefinition<K, keyof PurpleReactorUpgradeRewards[K]>
}

type PurpleCapacityExpander = Extract<PurpleReactorNames, `purpleCapacityExpander${number}`>
type HighestHoneyUpgrade = Extract<PurpleReactorNames, `highestHoney${string}`>

const getHighestHoneyUpgradeNotMaxedEffectsDescription = (upgradeKey: HighestHoneyUpgrade): string => {
  return i18next.t(`purpleReactor.upgrades.${upgradeKey}.effectNotMaxed`)
}

const getHighestHoneyUpgradeMaxedEffectsDescription = (upgradeKey: HighestHoneyUpgrade): string => {
  return i18next.t(`purpleReactor.upgrades.${upgradeKey}.effectMaxed`)
}

const getPurpleCapacityExpanderNotMaxedEffectsDescription = (upgradeKey: PurpleCapacityExpander): string => {
  const effect = getPurpleReactorUpgradeEffects(upgradeKey, 'purpleCapacity')
  const newEffect = getPurpleReactorUpgradeNextLevelEffects(upgradeKey, 'purpleCapacity')

  return [
    i18next.t('purpleReactor.upgrades.purpleCapacityExpander1.effectNotMaxed', {
      oldValue: format(effect, 0, true),
      newValue: format(newEffect, 0, true)
    }),
    i18next.t('purpleReactor.upgrades.redCapacityExpander1.effectNotMaxed', {
      oldValue: format(calculateRedAmbrosiaReactantCapacityFromAmbrosia(effect), 2, true),
      newValue: format(calculateRedAmbrosiaReactantCapacityFromAmbrosia(newEffect), 2, true)
    })
  ].join('<br>')
}

const getPurpleCapacityExpanderMaxedEffectsDescription = (upgradeKey: PurpleCapacityExpander): string => {
  const effect = getPurpleReactorUpgradeEffects(upgradeKey, 'purpleCapacity')

  return [
    i18next.t('purpleReactor.upgrades.purpleCapacityExpander1.effectMaxed', {
      maxValue: format(effect, 0, true)
    }),
    i18next.t('purpleReactor.upgrades.redCapacityExpander1.effectMaxed', {
      maxValue: format(calculateRedAmbrosiaReactantCapacityFromAmbrosia(effect), 2, true)
    })
  ].join('<br>')
}

export const purpleReactorUpgradeData: PurpleReactorUpgradeData = {
  tutorial: {
    maxLevel: 20,
    costFormula: (level: number) => level,
    effects: (n) => {
      return 1 + 0.01 * n // Same for ambrosia and red ambrosia generation
    },
    notMaxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('tutorial', 'ambrosiaGeneration')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects('tutorial', 'ambrosiaGeneration')
      return i18next.t('purpleReactor.upgrades.tutorial.effectNotMaxed', {
        oldPercent: formatAsPercentIncrease(effect, 0),
        newPercent: formatAsPercentIncrease(newEffect, 0)
      })
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('tutorial', 'ambrosiaGeneration')
      return i18next.t('purpleReactor.upgrades.tutorial.effectMaxed', {
        maxPercent: formatAsPercentIncrease(effect, 0)
      })
    },
    apValue: {
      perLevelAP: 1,
      maxLevelAP: 0
    }
  },
  purpleEfficiency1: {
    maxLevel: 20,
    costFormula: (level: number) => 5 * level,
    effects: (n) => {
      return 0.01 * n
    },
    notMaxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleEfficiency1', 'purpleEfficiency')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects('purpleEfficiency1', 'purpleEfficiency')
      return i18next.t('purpleReactor.upgrades.purpleEfficiency1.effectNotMaxed', {
        oldPercent: format(effect, 2),
        newPercent: format(newEffect, 2)
      })
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleEfficiency1', 'purpleEfficiency')
      return i18next.t('purpleReactor.upgrades.purpleEfficiency1.effectMaxed', {
        maxPercent: format(effect, 2)
      })
    },
    apValue: {
      perLevelAP: 0.5,
      maxLevelAP: 5
    }
  },
  purpleEfficiency2: {
    maxLevel: 20,
    costFormula: (level: number) => 500 * level,
    effects: (n) => {
      return 0.01 * n
    },
    notMaxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleEfficiency2', 'purpleEfficiency')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects('purpleEfficiency2', 'purpleEfficiency')
      return i18next.t('purpleReactor.upgrades.purpleEfficiency1.effectNotMaxed', {
        oldPercent: format(effect, 2),
        newPercent: format(newEffect, 2)
      })
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleEfficiency2', 'purpleEfficiency')
      return i18next.t('purpleReactor.upgrades.purpleEfficiency1.effectMaxed', {
        maxPercent: format(effect, 2)
      })
    },
    apValue: {
      perLevelAP: 0.5,
      maxLevelAP: 10
    }
  },
  purpleEfficiency3: {
    maxLevel: 30,
    costFormula: (level: number) => 50_000 * level,
    effects: (n) => {
      return 0.01 * n
    },
    notMaxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleEfficiency3', 'purpleEfficiency')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects('purpleEfficiency3', 'purpleEfficiency')
      return i18next.t('purpleReactor.upgrades.purpleEfficiency1.effectNotMaxed', {
        oldPercent: format(effect, 2),
        newPercent: format(newEffect, 2)
      })
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleEfficiency3', 'purpleEfficiency')
      return i18next.t('purpleReactor.upgrades.purpleEfficiency1.effectMaxed', {
        maxPercent: format(effect, 2)
      })
    },
    apValue: {
      perLevelAP: 0.5,
      maxLevelAP: 10
    }
  },
  purpleEfficiency4: {
    maxLevel: 30,
    costFormula: (level: number) => 5_000_000 * level,
    effects: (n) => {
      return 0.01 * n
    },
    notMaxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleEfficiency4', 'purpleEfficiency')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects('purpleEfficiency4', 'purpleEfficiency')
      return i18next.t('purpleReactor.upgrades.purpleEfficiency1.effectNotMaxed', {
        oldPercent: format(effect, 2),
        newPercent: format(newEffect, 2)
      })
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleEfficiency4', 'purpleEfficiency')
      return i18next.t('purpleReactor.upgrades.purpleEfficiency1.effectMaxed', {
        maxPercent: format(effect, 2)
      })
    },
    apValue: {
      perLevelAP: 0.5,
      maxLevelAP: 15
    }
  },
  purpleHoneyLuck1: {
    maxLevel: 10,
    costFormula: (level: number) => 7 * level,
    effects: (n) => {
      return n
    },
    notMaxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHoneyLuck1', 'purpleHoneyLuck')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects('purpleHoneyLuck1', 'purpleHoneyLuck')
      return i18next.t('purpleReactor.upgrades.purpleHoneyLuck1.effectNotMaxed', {
        oldValue: format(effect, 0),
        newValue: format(newEffect, 0)
      })
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHoneyLuck1', 'purpleHoneyLuck')
      return i18next.t('purpleReactor.upgrades.purpleHoneyLuck1.effectMaxed', {
        maxValue: format(effect, 0)
      })
    },
    apValue: {
      perLevelAP: 1,
      maxLevelAP: 5
    }
  },
  purpleHoneyLuck2: {
    maxLevel: 15,
    costFormula: (level: number) => 777 * level,
    effects: (n) => {
      return n
    },
    notMaxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHoneyLuck2', 'purpleHoneyLuck')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects('purpleHoneyLuck2', 'purpleHoneyLuck')
      return i18next.t('purpleReactor.upgrades.purpleHoneyLuck1.effectNotMaxed', {
        oldValue: format(effect, 0),
        newValue: format(newEffect, 0)
      })
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHoneyLuck2', 'purpleHoneyLuck')
      return i18next.t('purpleReactor.upgrades.purpleHoneyLuck1.effectMaxed', {
        maxValue: format(effect, 0)
      })
    },
    apValue: {
      perLevelAP: 1,
      maxLevelAP: 5
    }
  },
  purpleHoneyLuck3: {
    maxLevel: 20,
    costFormula: (level: number) => 77_777 * level,
    effects: (n) => {
      return n
    },
    notMaxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHoneyLuck3', 'purpleHoneyLuck')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects('purpleHoneyLuck3', 'purpleHoneyLuck')
      return i18next.t('purpleReactor.upgrades.purpleHoneyLuck1.effectNotMaxed', {
        oldValue: format(effect, 0),
        newValue: format(newEffect, 0)
      })
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHoneyLuck3', 'purpleHoneyLuck')
      return i18next.t('purpleReactor.upgrades.purpleHoneyLuck1.effectMaxed', {
        maxValue: format(effect, 0)
      })
    },
    apValue: {
      perLevelAP: 1,
      maxLevelAP: 5
    }
  },
  purpleHoneyLuck4: {
    maxLevel: 25,
    costFormula: (level: number) => 7_777_777 * level,
    effects: (n) => {
      return n
    },
    notMaxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHoneyLuck4', 'purpleHoneyLuck')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects('purpleHoneyLuck4', 'purpleHoneyLuck')
      return i18next.t('purpleReactor.upgrades.purpleHoneyLuck1.effectNotMaxed', {
        oldValue: format(effect, 0),
        newValue: format(newEffect, 0)
      })
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHoneyLuck4', 'purpleHoneyLuck')
      return i18next.t('purpleReactor.upgrades.purpleHoneyLuck1.effectMaxed', {
        maxValue: format(effect, 0)
      })
    },
    apValue: {
      perLevelAP: 1,
      maxLevelAP: 5
    }
  },
  purpleHalfLife1: {
    maxLevel: 50,
    costFormula: (level: number) => 12 * level,
    effects: (n) => {
      return -36 * n
    },
    notMaxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHalfLife1', 'halfLifeReduction')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects('purpleHalfLife1', 'halfLifeReduction')
      return i18next.t('purpleReactor.upgrades.purpleHalfLife1.effectNotMaxed', {
        oldValue: format(effect, 0),
        newValue: format(newEffect, 0)
      })
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHalfLife1', 'halfLifeReduction')
      return i18next.t('purpleReactor.upgrades.purpleHalfLife1.effectMaxed', {
        maxValue: format(effect, 0)
      })
    },
    apValue: {
      perLevelAP: 0.2,
      maxLevelAP: 10
    }
  },
  purpleHalfLife2: {
    maxLevel: 50,
    costFormula: (level: number) => 1_200 * level,
    effects: (n) => {
      return -36 * n
    },
    notMaxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHalfLife2', 'halfLifeReduction')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects('purpleHalfLife2', 'halfLifeReduction')
      return i18next.t('purpleReactor.upgrades.purpleHalfLife1.effectNotMaxed', {
        oldValue: format(effect, 0),
        newValue: format(newEffect, 0)
      })
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHalfLife2', 'halfLifeReduction')
      return i18next.t('purpleReactor.upgrades.purpleHalfLife1.effectMaxed', {
        maxValue: format(effect, 0)
      })
    },
    apValue: {
      perLevelAP: 0.3,
      maxLevelAP: 10
    }
  },
  purpleHalfLife3: {
    maxLevel: 50,
    costFormula: (level: number) => 120_000 * level,
    effects: (n) => {
      return -36 * n
    },
    notMaxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHalfLife3', 'halfLifeReduction')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects('purpleHalfLife3', 'halfLifeReduction')
      return i18next.t('purpleReactor.upgrades.purpleHalfLife1.effectNotMaxed', {
        oldValue: format(effect, 0),
        newValue: format(newEffect, 0)
      })
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHalfLife3', 'halfLifeReduction')
      return i18next.t('purpleReactor.upgrades.purpleHalfLife1.effectMaxed', {
        maxValue: format(effect, 0)
      })
    },
    apValue: {
      perLevelAP: 0.4,
      maxLevelAP: 10
    }
  },
  purpleHalfLife4: {
    maxLevel: 50,
    costFormula: (level: number) => 12_000_000 * level,
    effects: (n) => {
      return -36 * n
    },
    notMaxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHalfLife4', 'halfLifeReduction')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects('purpleHalfLife4', 'halfLifeReduction')
      return i18next.t('purpleReactor.upgrades.purpleHalfLife1.effectNotMaxed', {
        oldValue: format(effect, 0),
        newValue: format(newEffect, 0)
      })
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHalfLife4', 'halfLifeReduction')
      return i18next.t('purpleReactor.upgrades.purpleHalfLife1.effectMaxed', {
        maxValue: format(effect, 0)
      })
    },
    apValue: {
      perLevelAP: 0.5,
      maxLevelAP: 10
    }
  },
  paperweight: {
    maxLevel: 100,
    costFormula: (level: number) => Math.pow(level, 3),
    effects: () => {
      return
    },
    notMaxedEffectsDescription: () => {
      return i18next.t('purpleReactor.upgrades.paperweight.effectNotMaxed')
    },
    maxedEffectsDescription: () => {
      return i18next.t('purpleReactor.upgrades.paperweight.effectMaxed')
    },
    apValue: {
      perLevelAP: 0.3,
      maxLevelAP: 20
    }
  },
  purpleCapacityExpander1: {
    maxLevel: 10_000,
    costFormula: (level: number) => Math.ceil(Math.pow(level, 1.1)),
    effects: (n) => {
      return 50_000 * n
    },
    notMaxedEffectsDescription: () => {
      return getPurpleCapacityExpanderNotMaxedEffectsDescription('purpleCapacityExpander1')
    },
    maxedEffectsDescription: () => {
      return getPurpleCapacityExpanderMaxedEffectsDescription('purpleCapacityExpander1')
    },
    apValue: {
      perLevelAP: 0,
      maxLevelAP: 30
    }
  },
  purpleCapacityExpander2: {
    maxLevel: 10_000,
    costFormula: (level: number) => 10 * Math.ceil(Math.pow(level, 1.2)),
    effects: (n) => {
      return 50_000 * n
    },
    notMaxedEffectsDescription: () => {
      return getPurpleCapacityExpanderNotMaxedEffectsDescription('purpleCapacityExpander2')
    },
    maxedEffectsDescription: () => {
      return getPurpleCapacityExpanderMaxedEffectsDescription('purpleCapacityExpander2')
    },
    apValue: {
      perLevelAP: 0,
      maxLevelAP: 40
    }
  },
  purpleCapacityExpander3: {
    maxLevel: 10_000,
    costFormula: (level: number) => 100 * Math.ceil(Math.pow(level, 1.25)),
    effects: (n) => {
      return 50_000 * n
    },
    notMaxedEffectsDescription: () => {
      return getPurpleCapacityExpanderNotMaxedEffectsDescription('purpleCapacityExpander3')
    },
    maxedEffectsDescription: () => {
      return getPurpleCapacityExpanderMaxedEffectsDescription('purpleCapacityExpander3')
    },
    apValue: {
      perLevelAP: 0,
      maxLevelAP: 50
    }
  },
  purpleCapacityExpander4: {
    maxLevel: 10_000,
    costFormula: (level: number) => 1000 * Math.ceil(Math.pow(level, 1.3)),
    effects: (n) => {
      return 50_000 * n
    },
    notMaxedEffectsDescription: () => {
      return getPurpleCapacityExpanderNotMaxedEffectsDescription('purpleCapacityExpander4')
    },
    maxedEffectsDescription: () => {
      return getPurpleCapacityExpanderMaxedEffectsDescription('purpleCapacityExpander4')
    },
    apValue: {
      perLevelAP: 0,
      maxLevelAP: 60
    }
  },
  purpleHoneyRequirementReduction1: {
    maxLevel: 50,
    costFormula: (level: number) => 20 * level,
    effects: (n) => {
      return 0.004 * n
    },
    notMaxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHoneyRequirementReduction1', 'purpleHoneyRequirementMult')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects(
        'purpleHoneyRequirementReduction1',
        'purpleHoneyRequirementMult'
      )
      return i18next.t('purpleReactor.upgrades.purpleHoneyRequirementReduction1.effectNotMaxed', {
        oldPercent: formatAsPercentIncrease(1 - effect, 1),
        newPercent: formatAsPercentIncrease(1 - newEffect, 1)
      })
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHoneyRequirementReduction1', 'purpleHoneyRequirementMult')
      return i18next.t('purpleReactor.upgrades.purpleHoneyRequirementReduction1.effectMaxed', {
        maxPercent: formatAsPercentIncrease(1 - effect, 0)
      })
    },
    apValue: {
      perLevelAP: 0.3,
      maxLevelAP: 5
    }
  },
  purpleHoneyRequirementReduction2: {
    maxLevel: 50,
    costFormula: (level: number) => 2_000 * level,
    effects: (n) => {
      return 0.004 * n
    },
    notMaxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHoneyRequirementReduction2', 'purpleHoneyRequirementMult')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects(
        'purpleHoneyRequirementReduction2',
        'purpleHoneyRequirementMult'
      )
      return i18next.t('purpleReactor.upgrades.purpleHoneyRequirementReduction1.effectNotMaxed', {
        oldPercent: formatAsPercentIncrease(1 - effect, 1),
        newPercent: formatAsPercentIncrease(1 - newEffect, 1)
      })
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHoneyRequirementReduction2', 'purpleHoneyRequirementMult')
      return i18next.t('purpleReactor.upgrades.purpleHoneyRequirementReduction1.effectMaxed', {
        maxPercent: formatAsPercentIncrease(1 - effect, 0)
      })
    },
    apValue: {
      perLevelAP: 0.4,
      maxLevelAP: 5
    }
  },
  purpleHoneyRequirementReduction3: {
    maxLevel: 50,
    costFormula: (level: number) => 200_000 * level,
    effects: (n) => {
      return 0.004 * n
    },
    notMaxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHoneyRequirementReduction3', 'purpleHoneyRequirementMult')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects(
        'purpleHoneyRequirementReduction3',
        'purpleHoneyRequirementMult'
      )
      return i18next.t('purpleReactor.upgrades.purpleHoneyRequirementReduction1.effectNotMaxed', {
        oldPercent: formatAsPercentIncrease(1 - effect, 1),
        newPercent: formatAsPercentIncrease(1 - newEffect, 1)
      })
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHoneyRequirementReduction3', 'purpleHoneyRequirementMult')
      return i18next.t('purpleReactor.upgrades.purpleHoneyRequirementReduction1.effectMaxed', {
        maxPercent: formatAsPercentIncrease(1 - effect, 0)
      })
    },
    apValue: {
      perLevelAP: 0.5,
      maxLevelAP: 5
    }
  },
  purpleHoneyRequirementReduction4: {
    maxLevel: 50,
    costFormula: (level: number) => 20_000_000 * level,
    effects: (n) => {
      return 0.004 * n
    },
    notMaxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHoneyRequirementReduction4', 'purpleHoneyRequirementMult')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects(
        'purpleHoneyRequirementReduction4',
        'purpleHoneyRequirementMult'
      )
      return i18next.t('purpleReactor.upgrades.purpleHoneyRequirementReduction1.effectNotMaxed', {
        oldPercent: formatAsPercentIncrease(1 - effect, 1),
        newPercent: formatAsPercentIncrease(1 - newEffect, 1)
      })
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHoneyRequirementReduction4', 'purpleHoneyRequirementMult')
      return i18next.t('purpleReactor.upgrades.purpleHoneyRequirementReduction1.effectMaxed', {
        maxPercent: formatAsPercentIncrease(1 - effect, 0)
      })
    },
    apValue: {
      perLevelAP: 0.6,
      maxLevelAP: 5
    }
  },
  obtainium: {
    maxLevel: 100_000_000,
    costFormula: (level: number) => Math.floor(Math.pow(level, 1.2)),
    effects: (n) => {
      return 1 + Math.pow(Math.log(1 + n / 100), 1.25)
    },
    notMaxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('obtainium', 'obtainiumMultiplier')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects('obtainium', 'obtainiumMultiplier')
      return i18next.t('purpleReactor.upgrades.obtainium.effectNotMaxed', {
        oldPercent: formatAsPercentIncrease(effect, 2),
        newPercent: formatAsPercentIncrease(newEffect, 2)
      })
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('obtainium', 'obtainiumMultiplier')
      return i18next.t('purpleReactor.upgrades.obtainium.effectMaxed', {
        maxPercent: formatAsPercentIncrease(effect, 2)
      })
    },
    apValue: {
      perLevelAP: 0,
      maxLevelAP: 40
    }
  },
  offerings: {
    maxLevel: 100_000_000,
    costFormula: (level: number) => Math.floor(Math.pow(level, 1.2)),
    effects: (n) => {
      return 1 + Math.pow(Math.log(1 + n / 100), 1.25)
    },
    notMaxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('offerings', 'offeringMultiplier')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects('offerings', 'offeringMultiplier')
      return i18next.t('purpleReactor.upgrades.offerings.effectNotMaxed', {
        oldPercent: formatAsPercentIncrease(effect, 2),
        newPercent: formatAsPercentIncrease(newEffect, 2)
      })
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('offerings', 'offeringMultiplier')
      return i18next.t('purpleReactor.upgrades.offerings.effectMaxed', {
        maxPercent: formatAsPercentIncrease(effect, 2)
      })
    },
    apValue: {
      perLevelAP: 0,
      maxLevelAP: 40
    }
  },
  highestHoneyQuarks: {
    maxLevel: 1,
    costFormula: (level: number) => level,
    effects: (n) => n > 0,
    notMaxedEffectsDescription: () => getHighestHoneyUpgradeNotMaxedEffectsDescription('highestHoneyQuarks'),
    maxedEffectsDescription: () => getHighestHoneyUpgradeMaxedEffectsDescription('highestHoneyQuarks'),
    apValue: {
      perLevelAP: 0,
      maxLevelAP: 0
    }
  },
  highestHoneyGlobalSpeed: {
    maxLevel: 1,
    costFormula: (level: number) => level,
    effects: (n) => n > 0,
    notMaxedEffectsDescription: () => getHighestHoneyUpgradeNotMaxedEffectsDescription('highestHoneyGlobalSpeed'),
    maxedEffectsDescription: () => getHighestHoneyUpgradeMaxedEffectsDescription('highestHoneyGlobalSpeed'),
    apValue: {
      perLevelAP: 0,
      maxLevelAP: 0
    }
  },
  highestHoneyAscensionSpeed: {
    maxLevel: 1,
    costFormula: (level: number) => level,
    effects: (n) => n > 0,
    notMaxedEffectsDescription: () => getHighestHoneyUpgradeNotMaxedEffectsDescription('highestHoneyAscensionSpeed'),
    maxedEffectsDescription: () => getHighestHoneyUpgradeMaxedEffectsDescription('highestHoneyAscensionSpeed'),
    apValue: {
      perLevelAP: 0,
      maxLevelAP: 0
    }
  },
  highestHoneyAmbrosia: {
    maxLevel: 1,
    costFormula: (level: number) => 5 * 10**3 * level,
    effects: (n) => n > 0,
    notMaxedEffectsDescription: () => getHighestHoneyUpgradeNotMaxedEffectsDescription('highestHoneyAmbrosia'),
    maxedEffectsDescription: () => getHighestHoneyUpgradeMaxedEffectsDescription('highestHoneyAmbrosia'),
    apValue: {
      perLevelAP: 0,
      maxLevelAP: 0
    }
  },
  highestHoneyRedAmbrosia: {
    maxLevel: 1,
    costFormula: (level: number) => 10**4 * level,
    effects: (n) => n > 0,
    notMaxedEffectsDescription: () => getHighestHoneyUpgradeNotMaxedEffectsDescription('highestHoneyRedAmbrosia'),
    maxedEffectsDescription: () => getHighestHoneyUpgradeMaxedEffectsDescription('highestHoneyRedAmbrosia'),
    apValue: {
      perLevelAP: 0,
      maxLevelAP: 0
    }
  },
  highestHoneyAntELO: {
    maxLevel: 1,
    costFormula: (level: number) => level,
    effects: (n) => n > 0,
    notMaxedEffectsDescription: () => getHighestHoneyUpgradeNotMaxedEffectsDescription('highestHoneyAntELO'),
    maxedEffectsDescription: () => getHighestHoneyUpgradeMaxedEffectsDescription('highestHoneyAntELO'),
    apValue: {
      perLevelAP: 0,
      maxLevelAP: 0
    }
  },
  highestHoneyRebornELOSpeed: {
    maxLevel: 1,
    costFormula: (level: number) => level,
    effects: (n) => n > 0,
    notMaxedEffectsDescription: () => getHighestHoneyUpgradeNotMaxedEffectsDescription('highestHoneyRebornELOSpeed'),
    maxedEffectsDescription: () => getHighestHoneyUpgradeMaxedEffectsDescription('highestHoneyRebornELOSpeed'),
    apValue: {
      perLevelAP: 0,
      maxLevelAP: 0
    }
  }
}

type PurpleReactorUpgrades = {
  [K in PurpleReactorNames]: PurpleReactorUpgrade<K, keyof PurpleReactorUpgradeRewards[K]>
}

function createPurpleReactorUpgrades (
  definitions: PurpleReactorUpgradeData
): PurpleReactorUpgrades {
  return Object.fromEntries(
    Object.entries(definitions).map(([key, definition]) => {
      const name = key as PurpleReactorNames
      return [
        name,
        {
          ...definition,
          level: 0,
          purpleInvested: 0
        }
      ]
    })
  ) as PurpleReactorUpgrades
}

export const purpleReactorUpgrades = createPurpleReactorUpgrades(purpleReactorUpgradeData)
export const purpleReactorUpgradeNames = Object.keys(purpleReactorUpgrades) as PurpleReactorNames[]

export const blankPurpleReactorUpgradeObject: Record<PurpleReactorNames, number> = Object.fromEntries(
  Object.keys(purpleReactorUpgrades).map((key) => [
    key as PurpleReactorNames,
    0
  ])
) as Record<PurpleReactorNames, number>

export const setPurpleReactorUpgradeLevels = (): void => {
  for (const upgradeKey of purpleReactorUpgradeNames) {
    const upgrade = purpleReactorUpgrades[upgradeKey]

    const oldInvested = player.purpleReactorUpgrades[upgradeKey] || 0
    const maxAffordableLevel = maximumAffordableLevel(upgradeKey, oldInvested)
    const totalCost = upgrade.costFormula(maxAffordableLevel)

    upgrade.level = maxAffordableLevel
    upgrade.purpleInvested = totalCost

    player.purpleReactorUpgrades[upgradeKey] = totalCost

    const toRefund = oldInvested - totalCost
    if (toRefund > 0) {
      player.purpleReactor.purpleHoney += toRefund
      player.purpleReactor.highestPurpleHoney = Math.max(
        player.purpleReactor.highestPurpleHoney,
        player.purpleReactor.purpleHoney
      )
    }
  }
}

export const getPurpleReactorUpgradeEffects = <
  T extends PurpleReactorNames,
  K extends keyof PurpleReactorUpgradeRewards[T]
>(
  upgradeKey: T,
  key: K,
  nextLevel = false
): PurpleReactorUpgradeRewards[T][K] => {
  const level = purpleReactorUpgrades[upgradeKey].level + +nextLevel
  return purpleReactorUpgrades[upgradeKey].effects(level, key) as PurpleReactorUpgradeRewards[T][K]
}

export const getPurpleReactorUpgradeNextLevelEffects = <
  T extends PurpleReactorNames,
  K extends keyof PurpleReactorUpgradeRewards[T]
>(
  upgradeKey: T,
  key: K
): PurpleReactorUpgradeRewards[T][K] => {
  return getPurpleReactorUpgradeEffects(upgradeKey, key, true)
}

const getPurpleReactorUpgradeNotMaxedDescription = (upgradeKey: PurpleReactorNames): string => {
  const currentLevel = purpleReactorUpgrades[upgradeKey].level
  return purpleReactorUpgradeData[upgradeKey].notMaxedEffectsDescription(currentLevel)
}

const getPurpleReactorUpgradeMaxedDescription = (upgradeKey: PurpleReactorNames): string => {
  return purpleReactorUpgradeData[upgradeKey].maxedEffectsDescription()
}

const getPurpleReactorUpgradeCostTNL = (upgradeKey: PurpleReactorNames): number => {
  const upgrade = purpleReactorUpgrades[upgradeKey]
  if (upgrade.level === upgrade.maxLevel) {
    return 0
  }
  // since costFormula is a cumulative function, level 1 = cost of level 1
  if (upgrade.level === 0) {
    return upgrade.costFormula(1)
  }
  // cost(n) = cumulative(n) - cumulative(n-1)
  return upgrade.costFormula(upgrade.level + 1) - upgrade.costFormula(upgrade.level)
}

export const maximumAffordableLevel = (upgradeKey: PurpleReactorNames, purpleAmount: number): number => {
  const upgrade = purpleReactorUpgrades[upgradeKey]

  if (upgrade.level === upgrade.maxLevel) {
    return upgrade.level // no need to check maxed upgrades for affordability
  }

  const availablePurple = purpleAmount + upgrade.purpleInvested

  let low = upgrade.level
  let high = upgrade.maxLevel

  while (low < high) {
    const middle = low + Math.ceil((high - low) / 2)

    if (upgrade.costFormula(middle) <= availablePurple) {
      low = middle
    } else {
      high = middle - 1
    }
  }

  return low
}

export const purpleReactorUpgradeToString = (upgradeKey: PurpleReactorNames): string => {
  const upgrade = purpleReactorUpgrades[upgradeKey]
  const costNextLevel = getPurpleReactorUpgradeCostTNL(upgradeKey)
  const maxLevel = upgrade.maxLevel === -1 ? '' : `/${format(upgrade.maxLevel, 0, true)}`
  const isMaxLevel = upgrade.maxLevel === upgrade.level
  const color = isMaxLevel ? 'plum' : 'white'

  const name = i18next.t(`purpleReactor.upgrades.${upgradeKey}.name`)
  const nameSpan = `<span style="color: gold">${name}</span>`
  const levelSpan = `<span style="color: ${color}"> ${i18next.t('general.level')} ${
    format(upgrade.level, 0, true)
  }${maxLevel}</span>`

  const flavor = i18next.t(`purpleReactor.upgrades.${upgradeKey}.flavor`)
  const flavorSpan = `<span style="color: lightgray">${flavor}</span>`

  let effectSpan = ''
  if (upgrade.level === upgrade.maxLevel) {
    const effect = getPurpleReactorUpgradeMaxedDescription(upgradeKey)
    effectSpan = `<span style="color: white">${effect}</span>`
  } else {
    const effect = getPurpleReactorUpgradeNotMaxedDescription(upgradeKey)
    effectSpan = `<span style="color: white">${effect}</span>`
  }

  const costNextLevelSpan = i18next.t('purpleReactor.purpleHoneyCost', {
    amount: format(costNextLevel, 0, true)
  })

  const spentSpan = i18next.t('purpleReactor.purpleHoneySpent', {
    amount: format(upgrade.purpleInvested, 0, true)
  })

  let baseString = `${nameSpan} <br> ${flavorSpan} <br> ${levelSpan} <br><br> ${effectSpan} <br> ${
    (!isMaxLevel) ? `${costNextLevelSpan} <br>` : ''
  } ${spentSpan} <br>`

  if (upgrade.apValue.perLevelAP > 0) {
    const apPerLevelSpan = i18next.t('purpleReactor.upgradeAPPerLevel', {
      amount: format(upgrade.apValue.perLevelAP, 1),
      total: format(upgrade.level * upgrade.apValue.perLevelAP, 1)
    })
    baseString += `<br> ${apPerLevelSpan}`
  }

  if (upgrade.apValue.maxLevelAP > 0) {
    const apMaxLevelSpan = i18next.t('purpleReactor.upgradeAPMax', {
      amount: format(upgrade.apValue.maxLevelAP, 1),
      check: (upgrade.level === upgrade.maxLevel) ? '✔' : '✖'
    })
    baseString += `<br> ${apMaxLevelSpan}`
  }

  return baseString
}

export const buyPurpleReactorUpgradeLevel = async (
  upgradeKey: PurpleReactorNames,
  event: MouseEvent,
  buyMax = false
): Promise<void> => {
  const upgrade = purpleReactorUpgrades[upgradeKey]

  if (upgrade.level === upgrade.maxLevel) {
    return Alert(i18next.t('octeract.buyLevel.alreadyMax'))
  }

  const highestBuyableLevel = maximumAffordableLevel(upgradeKey, player.purpleReactor.purpleHoney)
  const maxPurchasable = highestBuyableLevel - upgrade.level
  let toPurchase = 1

  if (maxPurchasable <= 0) {
    return Alert(i18next.t('octeract.buyLevel.cannotAfford'))
  }

  if (event.shiftKey || buyMax) {
    const buy = Number(
      await Prompt(
        i18next.t('purpleReactor.purpleHoneyBuyPrompt', {
          max: format(maxPurchasable, 0, true)
        })
      )
    )
    if (buy === -1) {
      toPurchase = maxPurchasable
    } else if (isNaN(buy) || !isFinite(buy) || !Number.isInteger(buy) || buy <= 0) {
      // nan + Infinity checks
      return Alert(i18next.t('purpleReactor.notPositive'))
    } else {
      toPurchase = Math.min(buy, maxPurchasable)
    }
  }

  const cost = upgrade.costFormula(upgrade.level + toPurchase) - upgrade.costFormula(upgrade.level)
  player.purpleReactor.purpleHoney -= cost
  player.spentPurpleHoney.upgrades += cost
  upgrade.purpleInvested += cost
  upgrade.level += toPurchase
  player.purpleReactorUpgrades[upgradeKey] += cost
  visualUpdatePurple()
  if (toPurchase > 1) {
    return Alert(i18next.t('octeract.buyLevel.multiBuy', { n: format(toPurchase) }))
  }
}

export const calculatePurpleReactorAP = (): number => {
  let totalAP = 0
  for (const upgradeKey of purpleReactorUpgradeNames) {
    const upgrade = purpleReactorUpgrades[upgradeKey]
    totalAP += upgrade.level * upgrade.apValue.perLevelAP
    if (upgrade.level === upgrade.maxLevel) {
      totalAP += upgrade.apValue.maxLevelAP
    }
  }
  return Math.floor(totalAP)
}

export const maxPurpleReactorAP = Math.floor(
  purpleReactorUpgradeNames.reduce((totalAP, upgradeKey) => {
    const upgrade = purpleReactorUpgrades[upgradeKey]
    return totalAP + upgrade.maxLevel * upgrade.apValue.perLevelAP + upgrade.apValue.maxLevelAP
  }, 0)
)

type HighestPurpleHoneyPower =
  | 'quarkMultiplier'
  | 'globalSpeedMultiplier'
  | 'ascensionSpeedMultiplier'
  | 'ambrosiaGenerationMultiplier'
  | 'redAmbrosiaGenerationMultiplier'
  | 'additiveAntELOMultiplier'
  | 'rebornELOCreationSpeedMultiplier'

export const calculateHighestPurpleHoneyPower = (key: HighestPurpleHoneyPower) => {
  const highestPurpleHoney = Math.max(0, player.purpleReactor.highestPurpleHoney)
  const scaledLogarithm = Math.log1p(highestPurpleHoney / 100)

  if (key === 'quarkMultiplier') {
    return getPurpleReactorUpgradeEffects('highestHoneyQuarks', 'unlocked')
      ? 1 + 0.05 * Math.pow(scaledLogarithm, 1.1)
      : 1
  }

  if (key === 'globalSpeedMultiplier') {
    return getPurpleReactorUpgradeEffects('highestHoneyGlobalSpeed', 'unlocked')
      ? 1 + 0.1 * Math.pow(scaledLogarithm, 1.15)
      : 1
  }

  if (key === 'ascensionSpeedMultiplier') {
    return getPurpleReactorUpgradeEffects('highestHoneyAscensionSpeed', 'unlocked')
      ? 1 + 0.1 * Math.pow(scaledLogarithm, 1.15)
      : 1
  }

  if (key === 'ambrosiaGenerationMultiplier') {
    return getPurpleReactorUpgradeEffects('highestHoneyAmbrosia', 'unlocked')
      ? 1 + 0.02 * Math.pow(scaledLogarithm, 1.075)
      : 1
  }

  if (key === 'redAmbrosiaGenerationMultiplier') {
    return getPurpleReactorUpgradeEffects('highestHoneyRedAmbrosia', 'unlocked')
      ? 1 + 0.02 * Math.pow(scaledLogarithm, 1.075)
      : 1
  }

  if (key === 'additiveAntELOMultiplier') {
    return getPurpleReactorUpgradeEffects('highestHoneyAntELO', 'unlocked')
      ? 0.0001 * Math.log1p(highestPurpleHoney)
      : 0
  }

  return getPurpleReactorUpgradeEffects('highestHoneyRebornELOSpeed', 'unlocked')
    ? 1 + 0.04 * Math.pow(scaledLogarithm, 1.1)
    : 1
}
