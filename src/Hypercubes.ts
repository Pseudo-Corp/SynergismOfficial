import { player } from './Synergism';
import { openTesseract } from './Tesseracts';
import { Globals as G } from './Variables';

type Bless = keyof typeof player['hypercubeBlessings'];

export const openHypercube = (value: number, max = false) => {
    const toSpend = max ? player.wowHypercubes : Math.min(player.wowHypercubes, value);

    player.wowHypercubes -= toSpend
    player.hypercubeOpenedDaily += toSpend

    if (player.hypercubeQuarkDaily < 25 + 75 * (player.shopUpgrades.hypercubeToQuarkBought as number)) {
        while (player.hypercubeOpenedDaily >= 5 * Math.pow(1 + player.hypercubeQuarkDaily, 2) && player.hypercubeQuarkDaily < 25 + 75 * (player.shopUpgrades.hypercubeToQuarkBought as number)) {
            player.hypercubeQuarkDaily += 1;
            player.worlds += 1;
        }
    }
    let toSpendModulo = toSpend % 20
    let toSpendDiv20 = Math.floor(toSpend / 20)
    let blessings = {
        accelerator:   {weight: 4, pdf: (x: number) => 0 <= x && x <= 20},
        multiplier:    {weight: 4, pdf: (x: number) => 20 < x && x <= 40},
        offering:      {weight: 2, pdf: (x: number) => 40 < x && x <= 50},
        runeExp:       {weight: 2, pdf: (x: number) => 50 < x && x <= 60},
        obtainium:     {weight: 2, pdf: (x: number) => 60 < x && x <= 70},
        antSpeed:      {weight: 2, pdf: (x: number) => 70 < x && x <= 80},
        antSacrifice:  {weight: 1, pdf: (x: number) => 80 < x && x <= 85},
        antELO:        {weight: 1, pdf: (x: number) => 85 < x && x <= 90},
        talismanBonus: {weight: 1, pdf: (x: number) => 90 < x && x <= 95},
        globalSpeed:   {weight: 1, pdf: (x: number) => 95 < x && x <= 100}
    }

    //If you're opening more than 20 Hypercubes, it will consume all Hypercubes until remainder mod 20, giving expected values.
    for (const key in player.hypercubeBlessings) {
        player.hypercubeBlessings[key as Bless] += blessings[key as Bless].weight * toSpendDiv20;
    }
    //Then, the remaining hypercube will be opened, simulating the probability [RNG Element]
    for (let i = 0; i < toSpendModulo; i++) {
        let num = 100 * Math.random();
        for (const key in player.hypercubeBlessings) {
            if (blessings[key as Bless].pdf(num))
                player.hypercubeBlessings[key as Bless] += 1;
        }
    }
    calculateHypercubeBlessings();
    let extraTesseractBlessings = Math.floor(toSpend * 100 * player.researches[183])
    player.wowTesseracts += extraTesseractBlessings
    openTesseract(extraTesseractBlessings, false)
}

export const calculateHypercubeBlessings = () => {
    // The visual updates are handled in visualUpdateCubes()

    // we use Object.keys here instead of a for-in loop because we need the index of the key.
    const keys = Object.keys(player.hypercubeBlessings);

    for (const key of keys) {
        const obj = player.hypercubeBlessings[key as Bless];
        const idx = keys.indexOf(key) + 1;

        let power = 1;
        let mult = 1;
        if (obj >= 1000) {
            power = G['benedictionDRPower'][idx];
            mult *= Math.pow(1000, (1 - G['benedictionDRPower'][idx]));
        }

        G['hypercubeBonusMultiplier'][idx] = 1 + mult * G['benedictionbase'][idx] * Math.pow(obj, power) * G['platonicBonusMultiplier'][4];
    }
}