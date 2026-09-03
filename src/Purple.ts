import i18next from 'i18next'
import { format, formatAsPercentIncrease, player } from './Synergism'
import { Alert } from './UpdateHTML'
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
    encabulatorSpeed: number
  }
  purpleHalfLife2: {
    encabulatorSpeed: number
  }
  purpleHalfLife3: {
    encabulatorSpeed: number
  }
  purpleHalfLife4: {
    encabulatorSpeed: number
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
    ambrosiaCapacity: number
    redCapacity: number
  }
  purpleCapacityExpander2: {
    ambrosiaCapacity: number
    redCapacity: number
  }
  purpleCapacityExpander3: {
    ambrosiaCapacity: number
    redCapacity: number
  }
  purpleCapacityExpander4: {
    ambrosiaCapacity: number
    redCapacity: number
  }
  obtainium: {
    obtainiumMultiplier: number
  }
  offerings: {
    offeringMultiplier: number
  }
  lifetimeHoneyQuarks: {
    quarkMultiplier: number
  }
  lifetimeHoneyGlobalSpeed: {
    globalSpeedMultiplier: number
  }
  lifetimeHoneyAscensionSpeed: {
    ascensionSpeedMultiplier: number
  }
  lifetimeHoneyAmbrosia: {
    ambrosiaGenerationSpeed: number
  }
  lifetimeHoneyRedAmbrosia: {
    redAmbrosiaGenerationSpeed: number
  }
  lifetimeHoneyAntELO: {
    additiveAntELOPercent: number
  }
  lifetimeHoneyRebornELOSpeed: {
    rebornELOSpeedMult: number
  }
  purpleQuarkGain: {
    quarksPerPurpleHoney: number
  }
}

export type PurpleReactorNames = keyof PurpleReactorUpgradeRewards

export type APRewards = {
  perLevelAP: number
  maxLevelAP: number
}

const encabulatorSpeedBonusPerLevel = 3 / 50

interface PurpleReactorUpgrade<T extends PurpleReactorNames, K extends keyof PurpleReactorUpgradeRewards[T]> {
  level: number
  maxLevel: number
  // In these formulas, costFormula is expected to be a cumulative function
  costFormula: (level: number) => number
  effects: (n: number, key: K) => PurpleReactorUpgradeRewards[T][K]
  notMaxedEffectsDescription: (n: number) => string
  maxedEffectsDescription: () => string
  apValue: APRewards
}

// Writing out 'level' as zero is repetitive...
type PurpleReactorUpgradeDefinition<
  T extends PurpleReactorNames,
  K extends keyof PurpleReactorUpgradeRewards[T]
> = Omit<PurpleReactorUpgrade<T, K>, 'level'>

type PurpleReactorUpgradeData = {
  [K in PurpleReactorNames]: PurpleReactorUpgradeDefinition<K, keyof PurpleReactorUpgradeRewards[K]>
}

export const purpleReactorUpgradeData: PurpleReactorUpgradeData = {
  tutorial: {
    maxLevel: 20,
    costFormula: (level: number) => level * (level + 1) / 2,
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
    costFormula: (level: number) => 3 * level,
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
    costFormula: (level: number) => 60 * level,
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
    costFormula: (level: number) => 1_200 * level,
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
    costFormula: (level: number) => 24_000 * level,
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
    costFormula: (level: number) => 140 * level,
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
    costFormula: (level: number) => 2_800 * level,
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
    costFormula: (level: number) => 56_000 * level,
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
      return encabulatorSpeedBonusPerLevel * n
    },
    notMaxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHalfLife1', 'encabulatorSpeed')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects('purpleHalfLife1', 'encabulatorSpeed')
      return i18next.t('purpleReactor.upgrades.purpleHalfLife1.effectNotMaxed', {
        oldValue: format(effect, 2),
        newValue: format(newEffect, 2)
      })
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHalfLife1', 'encabulatorSpeed')
      return i18next.t('purpleReactor.upgrades.purpleHalfLife1.effectMaxed', {
        maxValue: format(effect, 2)
      })
    },
    apValue: {
      perLevelAP: 0.2,
      maxLevelAP: 10
    }
  },
  purpleHalfLife2: {
    maxLevel: 50,
    costFormula: (level: number) => 240 * level,
    effects: (n) => {
      return encabulatorSpeedBonusPerLevel * n
    },
    notMaxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHalfLife2', 'encabulatorSpeed')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects('purpleHalfLife2', 'encabulatorSpeed')
      return i18next.t('purpleReactor.upgrades.purpleHalfLife1.effectNotMaxed', {
        oldValue: format(effect, 2),
        newValue: format(newEffect, 2)
      })
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHalfLife2', 'encabulatorSpeed')
      return i18next.t('purpleReactor.upgrades.purpleHalfLife1.effectMaxed', {
        maxValue: format(effect, 2)
      })
    },
    apValue: {
      perLevelAP: 0.3,
      maxLevelAP: 10
    }
  },
  purpleHalfLife3: {
    maxLevel: 50,
    costFormula: (level: number) => 4_800 * level,
    effects: (n) => {
      return encabulatorSpeedBonusPerLevel * n
    },
    notMaxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHalfLife3', 'encabulatorSpeed')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects('purpleHalfLife3', 'encabulatorSpeed')
      return i18next.t('purpleReactor.upgrades.purpleHalfLife1.effectNotMaxed', {
        oldValue: format(effect, 2),
        newValue: format(newEffect, 2)
      })
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHalfLife3', 'encabulatorSpeed')
      return i18next.t('purpleReactor.upgrades.purpleHalfLife1.effectMaxed', {
        maxValue: format(effect, 2)
      })
    },
    apValue: {
      perLevelAP: 0.4,
      maxLevelAP: 10
    }
  },
  purpleHalfLife4: {
    maxLevel: 50,
    costFormula: (level: number) => 96_000 * level,
    effects: (n) => {
      return encabulatorSpeedBonusPerLevel * n
    },
    notMaxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHalfLife4', 'encabulatorSpeed')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects('purpleHalfLife4', 'encabulatorSpeed')
      return i18next.t('purpleReactor.upgrades.purpleHalfLife1.effectNotMaxed', {
        oldValue: format(effect, 2),
        newValue: format(newEffect, 2)
      })
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHalfLife4', 'encabulatorSpeed')
      return i18next.t('purpleReactor.upgrades.purpleHalfLife1.effectMaxed', {
        maxValue: format(effect, 2)
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
    costFormula: (level: number) => Math.pow(level, 1.1),
    effects: (n, key) => {
      if (key === 'ambrosiaCapacity') {
        return 125_000 * n
      }
      return 125 * n // redCapacity
    },
    notMaxedEffectsDescription: () => {
      const oldAmbrosiaCap = getPurpleReactorUpgradeEffects('purpleCapacityExpander1', 'ambrosiaCapacity')
      const newAmbrosiaCap = getPurpleReactorUpgradeNextLevelEffects('purpleCapacityExpander1', 'ambrosiaCapacity')
      const ambrosiaText = i18next.t('purpleReactor.upgrades.purpleCapacityExpander1.effectNotMaxedAmbrosia', {
        oldValue: format(oldAmbrosiaCap, 0),
        newValue: format(newAmbrosiaCap, 0)
      })

      const oldRedCap = getPurpleReactorUpgradeEffects('purpleCapacityExpander1', 'redCapacity')
      const newRedCap = getPurpleReactorUpgradeNextLevelEffects('purpleCapacityExpander1', 'redCapacity')
      const redText = i18next.t('purpleReactor.upgrades.purpleCapacityExpander1.effectNotMaxedRed', {
        oldValue: format(oldRedCap, 0),
        newValue: format(newRedCap, 0)
      })

      return `${ambrosiaText}<br>${redText}`
    },
    maxedEffectsDescription: () => {
      const ambrosiaCap = getPurpleReactorUpgradeEffects('purpleCapacityExpander1', 'ambrosiaCapacity')
      const ambrosiaText = i18next.t('purpleReactor.upgrades.purpleCapacityExpander1.effectMaxedAmbrosia', {
        maxValue: format(ambrosiaCap, 0)
      })

      const redCap = getPurpleReactorUpgradeEffects('purpleCapacityExpander1', 'redCapacity')
      const redText = i18next.t('purpleReactor.upgrades.purpleCapacityExpander1.effectMaxedRed', {
        maxValue: format(redCap, 0)
      })

      return `${ambrosiaText}<br>${redText}`
    },
    apValue: {
      perLevelAP: 0,
      maxLevelAP: 30
    }
  },
  purpleCapacityExpander2: {
    maxLevel: 10_000,
    costFormula: (level: number) => 10 * Math.pow(level, 1.2),
    effects: (n, key) => {
      if (key === 'ambrosiaCapacity') {
        return 150_000 * n
      }
      return 150 * n // redCapacity
    },
    notMaxedEffectsDescription: () => {
      const oldAmbrosiaCap = getPurpleReactorUpgradeEffects('purpleCapacityExpander2', 'ambrosiaCapacity')
      const newAmbrosiaCap = getPurpleReactorUpgradeNextLevelEffects('purpleCapacityExpander2', 'ambrosiaCapacity')
      const ambrosiaText = i18next.t('purpleReactor.upgrades.purpleCapacityExpander1.effectNotMaxedAmbrosia', {
        oldValue: format(oldAmbrosiaCap, 0),
        newValue: format(newAmbrosiaCap, 0)
      })

      const oldRedCap = getPurpleReactorUpgradeEffects('purpleCapacityExpander2', 'redCapacity')
      const newRedCap = getPurpleReactorUpgradeNextLevelEffects('purpleCapacityExpander2', 'redCapacity')
      const redText = i18next.t('purpleReactor.upgrades.purpleCapacityExpander1.effectNotMaxedRed', {
        oldValue: format(oldRedCap, 0),
        newValue: format(newRedCap, 0)
      })

      return `${ambrosiaText}<br>${redText}`
    },
    maxedEffectsDescription: () => {
      const ambrosiaCap = getPurpleReactorUpgradeEffects('purpleCapacityExpander2', 'ambrosiaCapacity')
      const ambrosiaText = i18next.t('purpleReactor.upgrades.purpleCapacityExpander1.effectMaxedAmbrosia', {
        maxValue: format(ambrosiaCap, 0)
      })

      const redCap = getPurpleReactorUpgradeEffects('purpleCapacityExpander2', 'redCapacity')
      const redText = i18next.t('purpleReactor.upgrades.purpleCapacityExpander1.effectMaxedRed', {
        maxValue: format(redCap, 0)
      })

      return `${ambrosiaText}<br>${redText}`
    },
    apValue: {
      perLevelAP: 0,
      maxLevelAP: 40
    }
  },
  purpleCapacityExpander3: {
    maxLevel: 10_000,
    costFormula: (level: number) => 100 * Math.pow(level, 1.25),
    effects: (n, key) => {
      if (key === 'ambrosiaCapacity') {
        return 150_000 * n
      }
      return 150 * n // redCapacity
    },
    notMaxedEffectsDescription: () => {
      const oldAmbrosiaCap = getPurpleReactorUpgradeEffects('purpleCapacityExpander3', 'ambrosiaCapacity')
      const newAmbrosiaCap = getPurpleReactorUpgradeNextLevelEffects('purpleCapacityExpander3', 'ambrosiaCapacity')
      const ambrosiaText = i18next.t('purpleReactor.upgrades.purpleCapacityExpander1.effectNotMaxedAmbrosia', {
        oldValue: format(oldAmbrosiaCap, 0),
        newValue: format(newAmbrosiaCap, 0)
      })

      const oldRedCap = getPurpleReactorUpgradeEffects('purpleCapacityExpander3', 'redCapacity')
      const newRedCap = getPurpleReactorUpgradeNextLevelEffects('purpleCapacityExpander3', 'redCapacity')
      const redText = i18next.t('purpleReactor.upgrades.purpleCapacityExpander1.effectNotMaxedRed', {
        oldValue: format(oldRedCap, 0),
        newValue: format(newRedCap, 0)
      })

      return `${ambrosiaText}<br>${redText}`
    },
    maxedEffectsDescription: () => {
      const ambrosiaCap = getPurpleReactorUpgradeEffects('purpleCapacityExpander3', 'ambrosiaCapacity')
      const ambrosiaText = i18next.t('purpleReactor.upgrades.purpleCapacityExpander1.effectMaxedAmbrosia', {
        maxValue: format(ambrosiaCap, 0)
      })

      const redCap = getPurpleReactorUpgradeEffects('purpleCapacityExpander3', 'redCapacity')
      const redText = i18next.t('purpleReactor.upgrades.purpleCapacityExpander1.effectMaxedRed', {
        maxValue: format(redCap, 0)
      })

      return `${ambrosiaText}<br>${redText}`
    },
    apValue: {
      perLevelAP: 0,
      maxLevelAP: 50
    }
  },
  purpleCapacityExpander4: {
    maxLevel: 10_000,
    costFormula: (level: number) => 1000 * Math.pow(level, 1.3),
    effects: (n, key) => {
      if (key === 'ambrosiaCapacity') {
        return 175_000 * n
      }
      return 175 * n // redCapacity
    },
    notMaxedEffectsDescription: () => {
      const oldAmbrosiaCap = getPurpleReactorUpgradeEffects('purpleCapacityExpander4', 'ambrosiaCapacity')
      const newAmbrosiaCap = getPurpleReactorUpgradeNextLevelEffects('purpleCapacityExpander4', 'ambrosiaCapacity')
      const ambrosiaText = i18next.t('purpleReactor.upgrades.purpleCapacityExpander1.effectNotMaxedAmbrosia', {
        oldValue: format(oldAmbrosiaCap, 0),
        newValue: format(newAmbrosiaCap, 0)
      })

      const oldRedCap = getPurpleReactorUpgradeEffects('purpleCapacityExpander4', 'redCapacity')
      const newRedCap = getPurpleReactorUpgradeNextLevelEffects('purpleCapacityExpander4', 'redCapacity')
      const redText = i18next.t('purpleReactor.upgrades.purpleCapacityExpander1.effectNotMaxedRed', {
        oldValue: format(oldRedCap, 0),
        newValue: format(newRedCap, 0)
      })

      return `${ambrosiaText}<br>${redText}`
    },
    maxedEffectsDescription: () => {
      const ambrosiaCap = getPurpleReactorUpgradeEffects('purpleCapacityExpander4', 'ambrosiaCapacity')
      const ambrosiaText = i18next.t('purpleReactor.upgrades.purpleCapacityExpander1.effectMaxedAmbrosia', {
        maxValue: format(ambrosiaCap, 0)
      })

      const redCap = getPurpleReactorUpgradeEffects('purpleCapacityExpander4', 'redCapacity')
      const redText = i18next.t('purpleReactor.upgrades.purpleCapacityExpander1.effectMaxedRed', {
        maxValue: format(redCap, 0)
      })

      return `${ambrosiaText}<br>${redText}`
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
      return 1 - 0.006 * n
    },
    notMaxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHoneyRequirementReduction1', 'purpleHoneyRequirementMult')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects(
        'purpleHoneyRequirementReduction1',
        'purpleHoneyRequirementMult'
      )
      return i18next.t('purpleReactor.upgrades.purpleHoneyRequirementReduction1.effectNotMaxed', {
        oldPercent: formatAsPercentIncrease(effect, 1),
        newPercent: formatAsPercentIncrease(newEffect, 1)
      })
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHoneyRequirementReduction1', 'purpleHoneyRequirementMult')
      return i18next.t('purpleReactor.upgrades.purpleHoneyRequirementReduction1.effectMaxed', {
        maxPercent: formatAsPercentIncrease(effect, 0)
      })
    },
    apValue: {
      perLevelAP: 0.3,
      maxLevelAP: 5
    }
  },
  purpleHoneyRequirementReduction2: {
    maxLevel: 50,
    costFormula: (level: number) => 400 * level,
    effects: (n) => {
      return 1 - 0.006 * n
    },
    notMaxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHoneyRequirementReduction2', 'purpleHoneyRequirementMult')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects(
        'purpleHoneyRequirementReduction2',
        'purpleHoneyRequirementMult'
      )
      return i18next.t('purpleReactor.upgrades.purpleHoneyRequirementReduction1.effectNotMaxed', {
        oldPercent: formatAsPercentIncrease(effect, 1),
        newPercent: formatAsPercentIncrease(newEffect, 1)
      })
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHoneyRequirementReduction2', 'purpleHoneyRequirementMult')
      return i18next.t('purpleReactor.upgrades.purpleHoneyRequirementReduction1.effectMaxed', {
        maxPercent: formatAsPercentIncrease(effect, 0)
      })
    },
    apValue: {
      perLevelAP: 0.4,
      maxLevelAP: 5
    }
  },
  purpleHoneyRequirementReduction3: {
    maxLevel: 50,
    costFormula: (level: number) => 8_000 * level,
    effects: (n) => {
      return 1 - 0.006 * n
    },
    notMaxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHoneyRequirementReduction3', 'purpleHoneyRequirementMult')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects(
        'purpleHoneyRequirementReduction3',
        'purpleHoneyRequirementMult'
      )
      return i18next.t('purpleReactor.upgrades.purpleHoneyRequirementReduction1.effectNotMaxed', {
        oldPercent: formatAsPercentIncrease(effect, 1),
        newPercent: formatAsPercentIncrease(newEffect, 1)
      })
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHoneyRequirementReduction3', 'purpleHoneyRequirementMult')
      return i18next.t('purpleReactor.upgrades.purpleHoneyRequirementReduction1.effectMaxed', {
        maxPercent: formatAsPercentIncrease(effect, 0)
      })
    },
    apValue: {
      perLevelAP: 0.5,
      maxLevelAP: 5
    }
  },
  purpleHoneyRequirementReduction4: {
    maxLevel: 50,
    costFormula: (level: number) => 160_000 * level,
    effects: (n) => {
      return 1 - 0.006 * n
    },
    notMaxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHoneyRequirementReduction4', 'purpleHoneyRequirementMult')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects(
        'purpleHoneyRequirementReduction4',
        'purpleHoneyRequirementMult'
      )
      return i18next.t('purpleReactor.upgrades.purpleHoneyRequirementReduction1.effectNotMaxed', {
        oldPercent: formatAsPercentIncrease(effect, 1),
        newPercent: formatAsPercentIncrease(newEffect, 1)
      })
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleHoneyRequirementReduction4', 'purpleHoneyRequirementMult')
      return i18next.t('purpleReactor.upgrades.purpleHoneyRequirementReduction1.effectMaxed', {
        maxPercent: formatAsPercentIncrease(effect, 0)
      })
    },
    apValue: {
      perLevelAP: 0.6,
      maxLevelAP: 5
    }
  },
  obtainium: {
    maxLevel: 100_000,
    costFormula: (level: number) => 10 * Math.pow(level, 1.2),
    effects: (n) => {
      return 1 + Math.log(1 + n / 100) * Math.pow(1.002, Math.floor(n / 100))
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
    maxLevel: 100_000,
    costFormula: (level: number) => 10 * Math.pow(level, 1.2),
    effects: (n) => {
      return 1 + Math.log(1 + n / 100) * Math.pow(1.002, Math.floor(n / 100))
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
  lifetimeHoneyQuarks: {
    maxLevel: 10,
    costFormula: (level: number) => 500 * level,
    effects: (n) => {
      return 1 + +(n > 0) * (0.10 + 0.005 * n) * Math.log(1 + player.purpleReactor.lifetimePurpleHoney / 100)
    },
    notMaxedEffectsDescription: () => {
      const oldEffect = getPurpleReactorUpgradeEffects('lifetimeHoneyQuarks', 'quarkMultiplier')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects('lifetimeHoneyQuarks', 'quarkMultiplier')

      const effectText = i18next.t('purpleReactor.upgrades.lifetimeHoneyQuarks.effectNotMaxed', {
        oldPercent: formatAsPercentIncrease(oldEffect, 2),
        newPercent: formatAsPercentIncrease(newEffect, 2)
      })

      const lv = purpleReactorUpgrades.lifetimeHoneyQuarks.level
      const oldValue = +(lv > 0) * (0.10 + 0.005 * lv)
      const formulaText = i18next.t('purpleReactor.lifetimeHoneyFormulaNotMaxed', {
        oldValue: format(oldValue, 3),
        newValue: format(0.10 + 0.005 * (lv + 1), 3)
      })

      return `${effectText}<br><span style="color: orchid">${formulaText}</span>`
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('lifetimeHoneyQuarks', 'quarkMultiplier')
      const effectText = i18next.t('purpleReactor.upgrades.lifetimeHoneyQuarks.effectMaxed', {
        maxPercent: formatAsPercentIncrease(effect, 2)
      })
      const formulaText = i18next.t('purpleReactor.lifetimeHoneyFormulaMaxed', {
        maxValue: format(0.15, 2)
      })

      return `${effectText}<br><span style="color: orchid">${formulaText}</span>`
    },
    apValue: {
      perLevelAP: 1,
      maxLevelAP: 5
    }
  },
  lifetimeHoneyGlobalSpeed: {
    maxLevel: 10,
    costFormula: (level: number) => 2_000 * level,
    effects: (n) => {
      return 1 + +(n > 0) * (0.1 + 0.01 * n) * Math.log(1 + player.purpleReactor.lifetimePurpleHoney / 100)
    },
    notMaxedEffectsDescription: () => {
      const oldEffect = getPurpleReactorUpgradeEffects('lifetimeHoneyGlobalSpeed', 'globalSpeedMultiplier')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects('lifetimeHoneyGlobalSpeed', 'globalSpeedMultiplier')

      const effectText = i18next.t('purpleReactor.upgrades.lifetimeHoneyGlobalSpeed.effectNotMaxed', {
        oldPercent: formatAsPercentIncrease(oldEffect, 2),
        newPercent: formatAsPercentIncrease(newEffect, 2)
      })

      const lv = purpleReactorUpgrades.lifetimeHoneyGlobalSpeed.level
      const oldValue = +(lv > 0) * (0.1 + 0.01 * lv)
      const formulaText = i18next.t('purpleReactor.lifetimeHoneyFormulaNotMaxed', {
        oldValue: format(oldValue, 2),
        newValue: format(0.1 + 0.01 * (lv + 1), 2)
      })

      return `${effectText}<br><span style="color: orchid">${formulaText}</span>`
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('lifetimeHoneyGlobalSpeed', 'globalSpeedMultiplier')
      const effectText = i18next.t('purpleReactor.upgrades.lifetimeHoneyGlobalSpeed.effectMaxed', {
        maxPercent: formatAsPercentIncrease(effect, 2)
      })
      const formulaText = i18next.t('purpleReactor.lifetimeHoneyFormulaMaxed', {
        maxValue: format(0.25, 2)
      })

      return `${effectText}<br><span style="color: orchid">${formulaText}</span>`
    },
    apValue: {
      perLevelAP: 1,
      maxLevelAP: 0
    }
  },
  lifetimeHoneyAscensionSpeed: {
    maxLevel: 10,
    costFormula: (level: number) => 2_000 * level,
    effects: (n) => {
      return 1 + +(n > 0) * (0.08 + 0.008 * n) * Math.log(1 + player.purpleReactor.lifetimePurpleHoney / 100)
    },
    notMaxedEffectsDescription: () => {
      const oldEffect = getPurpleReactorUpgradeEffects('lifetimeHoneyAscensionSpeed', 'ascensionSpeedMultiplier')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects(
        'lifetimeHoneyAscensionSpeed',
        'ascensionSpeedMultiplier'
      )

      const effectText = i18next.t('purpleReactor.upgrades.lifetimeHoneyAscensionSpeed.effectNotMaxed', {
        oldPercent: formatAsPercentIncrease(oldEffect, 2),
        newPercent: formatAsPercentIncrease(newEffect, 2)
      })

      const lv = purpleReactorUpgrades.lifetimeHoneyAscensionSpeed.level
      const oldValue = +(lv > 0) * (0.08 + 0.008 * lv)
      const formulaText = i18next.t('purpleReactor.lifetimeHoneyFormulaNotMaxed', {
        oldValue: format(oldValue, 3),
        newValue: format(0.08 + 0.008 * (lv + 1), 3)
      })

      return `${effectText}<br><span style="color: orchid">${formulaText}</span>`
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('lifetimeHoneyAscensionSpeed', 'ascensionSpeedMultiplier')
      const effectText = i18next.t('purpleReactor.upgrades.lifetimeHoneyAscensionSpeed.effectMaxed', {
        maxPercent: formatAsPercentIncrease(effect, 2)
      })
      const formulaText = i18next.t('purpleReactor.lifetimeHoneyFormulaMaxed', {
        maxValue: format(0.16, 2)
      })

      return `${effectText}<br><span style="color: orchid">${formulaText}</span>`
    },
    apValue: {
      perLevelAP: 1,
      maxLevelAP: 0
    }
  },
  lifetimeHoneyAmbrosia: {
    maxLevel: 10,
    costFormula: (level: number) => 10_000 * level,
    effects: (n) => {
      return 1 + +(n > 0) * (0.02 + 0.002 * n) * Math.log(1 + player.purpleReactor.lifetimePurpleHoney / 100)
    },
    notMaxedEffectsDescription: () => {
      const oldEffect = getPurpleReactorUpgradeEffects('lifetimeHoneyAmbrosia', 'ambrosiaGenerationSpeed')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects('lifetimeHoneyAmbrosia', 'ambrosiaGenerationSpeed')

      const effectText = i18next.t('purpleReactor.upgrades.lifetimeHoneyAmbrosia.effectNotMaxed', {
        oldPercent: formatAsPercentIncrease(oldEffect, 2),
        newPercent: formatAsPercentIncrease(newEffect, 2)
      })

      const lv = purpleReactorUpgrades.lifetimeHoneyAmbrosia.level
      const oldValue = +(lv > 0) * (0.02 + 0.002 * lv)
      const formulaText = i18next.t('purpleReactor.lifetimeHoneyFormulaNotMaxed', {
        oldValue: format(oldValue, 3),
        newValue: format(0.02 + 0.002 * (lv + 1), 3)
      })

      return `${effectText}<br><span style="color: orchid">${formulaText}</span>`
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('lifetimeHoneyAmbrosia', 'ambrosiaGenerationSpeed')
      const effectText = i18next.t('purpleReactor.upgrades.lifetimeHoneyAmbrosia.effectMaxed', {
        maxPercent: formatAsPercentIncrease(effect, 2)
      })
      const formulaText = i18next.t('purpleReactor.lifetimeHoneyFormulaMaxed', {
        maxValue: format(0.04, 2)
      })

      return `${effectText}<br><span style="color: orchid">${formulaText}</span>`
    },
    apValue: {
      perLevelAP: 1,
      maxLevelAP: 5
    }
  },
  lifetimeHoneyRedAmbrosia: {
    maxLevel: 15,
    costFormula: (level: number) => 10_000 * level,
    effects: (n) => {
      return 1 + +(n > 0) * (0.02 + 0.002 * n) * Math.log(1 + player.purpleReactor.lifetimePurpleHoney / 100)
    },
    notMaxedEffectsDescription: () => {
      const oldEffect = getPurpleReactorUpgradeEffects('lifetimeHoneyRedAmbrosia', 'redAmbrosiaGenerationSpeed')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects(
        'lifetimeHoneyRedAmbrosia',
        'redAmbrosiaGenerationSpeed'
      )

      const effectText = i18next.t('purpleReactor.upgrades.lifetimeHoneyRedAmbrosia.effectNotMaxed', {
        oldPercent: formatAsPercentIncrease(oldEffect, 2),
        newPercent: formatAsPercentIncrease(newEffect, 2)
      })

      const lv = purpleReactorUpgrades.lifetimeHoneyRedAmbrosia.level
      const oldValue = +(lv > 0) * (0.02 + 0.002 * lv)
      const formulaText = i18next.t('purpleReactor.lifetimeHoneyFormulaNotMaxed', {
        oldValue: format(oldValue, 3),
        newValue: format(0.02 + 0.002 * (lv + 1), 3)
      })

      return `${effectText}<br><span style="color: orchid">${formulaText}</span>`
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('lifetimeHoneyRedAmbrosia', 'redAmbrosiaGenerationSpeed')
      const effectText = i18next.t('purpleReactor.upgrades.lifetimeHoneyRedAmbrosia.effectMaxed', {
        maxPercent: formatAsPercentIncrease(effect, 2)
      })
      const formulaText = i18next.t('purpleReactor.lifetimeHoneyFormulaMaxed', {
        maxValue: format(0.05, 2)
      })

      return `${effectText}<br><span style="color: orchid">${formulaText}</span>`
    },
    apValue: {
      perLevelAP: 1,
      maxLevelAP: 0
    }
  },
  lifetimeHoneyAntELO: {
    maxLevel: 50,
    costFormula: (level: number) => 15_000 * level,
    effects: (n) => {
      return (0.0001 + 0.00001 * n) * +(n > 0) * Math.log(1 + player.purpleReactor.lifetimePurpleHoney)
    },
    notMaxedEffectsDescription: () => {
      const oldEffect = getPurpleReactorUpgradeEffects('lifetimeHoneyAntELO', 'additiveAntELOPercent')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects('lifetimeHoneyAntELO', 'additiveAntELOPercent')

      const effectText = i18next.t('purpleReactor.upgrades.lifetimeHoneyAntELO.effectNotMaxed', {
        oldPercent: formatAsPercentIncrease(1 + oldEffect, 2),
        newPercent: formatAsPercentIncrease(1 + newEffect, 2)
      })

      const lv = purpleReactorUpgrades.lifetimeHoneyAntELO.level
      const oldPercent = 1 + 0.0001 * +(lv > 0) + 0.00001 * lv
      const formulaText = i18next.t('purpleReactor.lifetimeHoneyELOFormulaNotMaxed', {
        oldPercent: formatAsPercentIncrease(oldPercent, 3),
        newPercent: formatAsPercentIncrease(1.0001 + 0.00001 * (purpleReactorUpgrades.lifetimeHoneyAntELO.level + 1), 3)
      })

      return `${effectText}<br><span style="color: orchid">${formulaText}</span>`
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('lifetimeHoneyAntELO', 'additiveAntELOPercent')
      const effectText = i18next.t('purpleReactor.upgrades.lifetimeHoneyAntELO.effectMaxed', {
        maxPercent: formatAsPercentIncrease(1 + effect, 2)
      })
      const formulaText = i18next.t('purpleReactor.lifetimeHoneyELOFormulaMaxed', {
        maxPercent: formatAsPercentIncrease(1.0006, 2)
      })

      return `${effectText}<br><span style="color: orchid">${formulaText}</span>`
    },
    apValue: {
      perLevelAP: 1,
      maxLevelAP: 5
    }
  },
  lifetimeHoneyRebornELOSpeed: {
    maxLevel: 50,
    costFormula: (level: number) => 15_000 * level,
    effects: (n) => {
      return 1 + +(n / 100) * (0.04 + 0.004 * n) * Math.log(1 + player.purpleReactor.lifetimePurpleHoney / 100)
    },
    notMaxedEffectsDescription: () => {
      const oldEffect = getPurpleReactorUpgradeEffects('lifetimeHoneyRebornELOSpeed', 'rebornELOSpeedMult')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects('lifetimeHoneyRebornELOSpeed', 'rebornELOSpeedMult')

      const effectText = i18next.t('purpleReactor.upgrades.lifetimeHoneyRebornELOSpeed.effectNotMaxed', {
        oldPercent: formatAsPercentIncrease(oldEffect, 2),
        newPercent: formatAsPercentIncrease(newEffect, 2)
      })

      const lv = purpleReactorUpgrades.lifetimeHoneyRebornELOSpeed.level
      const oldValue = +(lv > 0) * (0.04 + 0.004 * lv)
      const formulaText = i18next.t('purpleReactor.lifetimeHoneyFormulaNotMaxed', {
        oldValue: format(oldValue, 3),
        newValue: format(0.04 + 0.004 * (lv + 1), 3, true)
      })

      return `${effectText}<br><span style="color: orchid">${formulaText}</span>`
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('lifetimeHoneyRebornELOSpeed', 'rebornELOSpeedMult')
      const effectText = i18next.t('purpleReactor.upgrades.lifetimeHoneyRebornELOSpeed.effectMaxed', {
        maxPercent: formatAsPercentIncrease(effect, 2)
      })
      const formulaText = i18next.t('purpleReactor.lifetimeHoneyFormulaMaxed', {
        maxValue: format(0.24, 2)
      })

      return `${effectText}<br><span style="color: orchid">${formulaText}</span>`
    },
    apValue: {
      perLevelAP: 1,
      maxLevelAP: 0
    }
  },
  purpleQuarkGain: {
    maxLevel: 5,
    costFormula: (level: number) => 2_000 * (Math.pow(4, level) - 1) / 3,
    effects: (n) => {
      return n / 5
    },
    notMaxedEffectsDescription: () => {
      const oldEffect = getPurpleReactorUpgradeEffects('purpleQuarkGain', 'quarksPerPurpleHoney')
      const newEffect = getPurpleReactorUpgradeNextLevelEffects('purpleQuarkGain', 'quarksPerPurpleHoney')

      const disclaimer = i18next.t('purpleReactor.upgrades.purpleQuarkGain.disclaimer')
      const effectText = i18next.t('purpleReactor.upgrades.purpleQuarkGain.effectNotMaxed', {
        oldValue: format(oldEffect, 1),
        newValue: format(newEffect, 1)
      })
      return `${effectText}<br>${disclaimer}`
    },
    maxedEffectsDescription: () => {
      const effect = getPurpleReactorUpgradeEffects('purpleQuarkGain', 'quarksPerPurpleHoney')

      const disclaimer = i18next.t('purpleReactor.upgrades.purpleQuarkGain.disclaimer')
      const effectText = i18next.t('purpleReactor.upgrades.purpleQuarkGain.effectMaxed', {
        maxValue: format(effect, 1)
      })
      return `${effectText}<br>${disclaimer}`
    },
    apValue: {
      perLevelAP: 2,
      maxLevelAP: 10
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
          level: 0
        }
      ]
    })
  ) as PurpleReactorUpgrades
}

export const purpleReactorUpgrades = createPurpleReactorUpgrades(purpleReactorUpgradeData)
export const purpleReactorUpgradeNames = Object.keys(purpleReactorUpgrades) as PurpleReactorNames[]

type PurpleReactorAPContribution = {
  id: string
  calculateAP: () => number
  maximumAP: number
}

const purpleReactorAPContributions: PurpleReactorAPContribution[] = []

export const registerPurpleReactorAPContribution = (contribution: PurpleReactorAPContribution) => {
  if (purpleReactorAPContributions.some(({ id }) => id === contribution.id)) {
    return
  }

  purpleReactorAPContributions.push(contribution)
  maxPurpleReactorAP += contribution.maximumAP
}

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

    upgrade.level = 0

    const maxAffordableLevel = maximumAffordableLevel(upgradeKey, 0)
    const totalCost = upgrade.costFormula(maxAffordableLevel)

    upgrade.level = maxAffordableLevel

    player.purpleReactorUpgrades[upgradeKey] = totalCost

    const toRefund = oldInvested - totalCost
    if (toRefund > 0) {
      player.purpleReactor.purpleHoney += toRefund
      player.stats.highestPurpleHoney = Math.max(
        player.stats.highestPurpleHoney,
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

export const maximumAffordableLevel = (upgradeKey: PurpleReactorNames, unspentPurple: number): number => {
  const upgrade = purpleReactorUpgrades[upgradeKey]

  if (upgrade.level === upgrade.maxLevel) {
    return upgrade.level // no need to check maxed upgrades for affordability
  }

  const availablePurple = unspentPurple + player.purpleReactorUpgrades[upgradeKey]

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
  const maxLevel = `/${format(upgrade.maxLevel, 0, true)}`
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

  const spentSpan = i18next.t('purpleReactor.purpleHoneySpent', {
    current: format(player.purpleReactorUpgrades[upgradeKey], 2, true),
    max: format(upgrade.costFormula(upgrade.maxLevel), 2, true)
  })

  let baseString = `${nameSpan} <br> ${flavorSpan} <br> ${levelSpan} <br><br> ${effectSpan} <br> ${spentSpan} <br>`

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

export type PurpleReactorPurchaseAmount = 1 | 10 | 100 | 1000 | 'max'

export const getPurpleReactorUpgradePurchase = (
  upgradeKey: PurpleReactorNames,
  purchaseAmount: PurpleReactorPurchaseAmount
) => {
  const upgrade = purpleReactorUpgrades[upgradeKey]
  const targetLevel = purchaseAmount === 'max'
    ? maximumAffordableLevel(upgradeKey, player.purpleReactor.purpleHoney)
    : Math.min(upgrade.level + purchaseAmount, upgrade.maxLevel)

  return {
    amount: targetLevel - upgrade.level,
    cost: upgrade.costFormula(targetLevel) - upgrade.costFormula(upgrade.level)
  }
}

export const buyPurpleReactorUpgradeLevel = async (
  upgradeKey: PurpleReactorNames,
  purchaseAmount: PurpleReactorPurchaseAmount = 1
): Promise<void> => {
  const upgrade = purpleReactorUpgrades[upgradeKey]

  if (upgrade.level === upgrade.maxLevel) {
    return Alert(i18next.t('octeract.buyLevel.alreadyMax'))
  }

  const purchase = getPurpleReactorUpgradePurchase(upgradeKey, purchaseAmount)

  if (purchase.amount <= 0 || player.purpleReactor.purpleHoney < purchase.cost) {
    return Alert(i18next.t('octeract.buyLevel.cannotAfford'))
  }

  player.purpleReactor.purpleHoney -= purchase.cost
  player.spentPurpleHoney.upgrades += purchase.cost
  upgrade.level += purchase.amount
  player.purpleReactorUpgrades[upgradeKey] += purchase.cost
  visualUpdatePurple()
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
  for (const contribution of purpleReactorAPContributions) {
    totalAP += contribution.calculateAP()
  }
  return Math.floor(totalAP)
}

export let maxPurpleReactorAP = Math.floor(
  purpleReactorUpgradeNames.reduce((totalAP, upgradeKey) => {
    const upgrade = purpleReactorUpgrades[upgradeKey]
    return totalAP + upgrade.maxLevel * upgrade.apValue.perLevelAP + upgrade.apValue.maxLevelAP
  }, 0)
)
