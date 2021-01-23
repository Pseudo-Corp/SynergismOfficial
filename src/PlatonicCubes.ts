import { player } from './Synergism';
import { Globals as G } from './Variables';
import { Synergism } from './Events';

type Bless = keyof typeof player['platonicBlessings'];

export const openPlatonic = (value: number, max = false) => {
    const toSpend = max 
        ? player.wowPlatonicCubes
        : Math.min(player.wowPlatonicCubes, value)

    player.wowPlatonicCubes -= toSpend

    let toSpendModulo = toSpend % 40000
    let toSpendDiv40000 = Math.floor(toSpend / 40000)
    let blessings = {
        cubes:          {weight: 13200, pdf: (x: number) => 0 <= x && x <= 33.000},
        tesseracts:     {weight: 13200, pdf: (x: number) => 33.000 < x && x <= 66.000},
        hypercubes:     {weight: 13200, pdf: (x: number) => 66.000 < x && x <= 99.000},
        platonics:      {weight: 396, pdf: (x: number) => 99.000 < x && x <= 99.990},
        hypercubeBonus: {weight: 1, pdf: (x: number) => 99.990 < x && x <= 99.9925},
        taxes:          {weight: 1, pdf: (x: number) => 99.9925 < x && x <= 99.995},
        scoreBonus:     {weight: 1, pdf: (x: number) => 99.995 < x && x <= 99.9975},
        globalSpeed:    {weight: 1, pdf: (x: number) => 99.9975 < x && x <= 100},
    }

    //If you're opening more than 40,000 Platonics, it will consume all Platonics until remainder mod 40,000, giving expected values.
    for (const key in player.platonicBlessings) {
        player.platonicBlessings[key as Bless] += blessings[key as Bless].weight * toSpendDiv40000;
    }
    //Then, the remaining hypercube will be opened, simulating the probability [RNG Element]
    let RNGesus = ['hypercubeBonus', 'taxes', 'scoreBonus', 'globalSpeed']
    for (let i = 0; i < RNGesus.length; i++) {
        let num = Math.random();
        if (toSpendModulo / 40000 >= num && toSpendModulo !== 0) {
            player.platonicBlessings[RNGesus[i] as Bless] += 1;
            toSpendModulo -= 1
        }
    }
    let gainValues = [Math.floor(33 * toSpendModulo / 100), Math.floor(33 * toSpendModulo / 100), Math.floor(33 * toSpendModulo / 100), Math.floor(396 * toSpendModulo / 40000)]
    let commonDrops = ['cubes', 'tesseracts', 'hypercubes', 'platonics'] as const;
    for (let i = 0; i < commonDrops.length; i++) {
        player.platonicBlessings[commonDrops[i]] += gainValues[i]
        toSpendModulo -= gainValues[i]
    }

    for (let i = 0; i < toSpendModulo; i++) {
        let num = 100 * Math.random();
        for (const key in player.platonicBlessings) {
            if (blessings[key as Bless].pdf(num))
                player.platonicBlessings[key as Bless] += 1;
        }
    }
    calculatePlatonicBlessings();
    Synergism.emit('openPlatonic', toSpend);
}

export const calculatePlatonicBlessings = () => {
    // The visual updates are handled in visualUpdateCubes()
    let platonicArray = [player.platonicBlessings.cubes, player.platonicBlessings.tesseracts, player.platonicBlessings.hypercubes, player.platonicBlessings.platonics, player.platonicBlessings.hypercubeBonus, player.platonicBlessings.taxes, player.platonicBlessings.scoreBonus, player.platonicBlessings.globalSpeed]
    let DRThreshold = [4e6, 4e6, 4e6, 8e4, 1e4, 1e4, 1e4, 1e4]
    for (let i = 0; i < platonicArray.length; i++) {
        let power = 1;
        let mult = 1;
        if (platonicArray[i] >= DRThreshold[i]) {
            power = G['platonicDRPower'][i];
            mult *= Math.pow(DRThreshold[i], (1 - G['platonicDRPower'][i]));
        }

        G['platonicBonusMultiplier'][i] = 1 + mult * G['platonicCubeBase'][i] * Math.pow(platonicArray[i], power);
    }
}
