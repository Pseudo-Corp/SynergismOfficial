import { player } from './Synergism';
import { Player } from './types/Synergism';
import { Globals as G } from './Variables';
import { openCube } from './Cubes';

export const openTesseract = (value: number, max = false) => {
    let toSpend = Math.min(player.wowTesseracts, value)
    if (max) {
        toSpend = player.wowTesseracts
    }

    player.wowTesseracts -= toSpend
    player.tesseractOpenedDaily += toSpend

    if (player.tesseractQuarkDaily < 25 + 75 * (player.shopUpgrades.tesseractToQuarkBought as number)) {
        while (
            player.tesseractOpenedDaily >= 10 * Math.pow(1 + player.tesseractQuarkDaily, 3) && 
            player.tesseractQuarkDaily < 25 + 75 * (player.shopUpgrades.tesseractToQuarkBought as number)
        ) {
            player.tesseractQuarkDaily += 1;
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

    //If you're opening more than 20 Tesseracts, it will consume all Tesseracts until remainder mod 20, giving expected values.
    for (const key in player.tesseractBlessings) {
        player.tesseractBlessings[key as keyof Player['tesseractBlessings']] += blessings[key as keyof typeof blessings].weight * toSpendDiv20;
    }
    //Then, the remaining tesseract will be opened, simulating the probability [RNG Element]
    for (let i = 0; i < toSpendModulo; i++) {
        let num = 100 * Math.random();
        for (const key in player.tesseractBlessings) {
            if (blessings[key as keyof typeof blessings].pdf(num))
                player.tesseractBlessings[key as keyof Player['tesseractBlessings']] += 1;
        }
    }
    calculateTesseractBlessings();
    let extraCubeBlessings = Math.floor(12 * toSpend * player.researches[153])
    player.wowCubes += extraCubeBlessings
    openCube(extraCubeBlessings, false)
}

export const calculateTesseractBlessings = () => {
    // The visual updates are handled in visualUpdateCubes()
    let tesseractArray = [null, player.tesseractBlessings.accelerator, player.tesseractBlessings.multiplier, player.tesseractBlessings.offering, player.tesseractBlessings.runeExp, player.tesseractBlessings.obtainium, player.tesseractBlessings.antSpeed, player.tesseractBlessings.antSacrifice, player.tesseractBlessings.antELO, player.tesseractBlessings.talismanBonus, player.tesseractBlessings.globalSpeed]

    for (let i = 1; i <= 10; i++) {
        let power = 1;
        let mult = 1;
        if (tesseractArray[i] >= 1000 && i !== 6) {
            power = G['giftDRPower'][i];
            mult *= Math.pow(1000, (1 - G['giftDRPower'][i]));
        }

        G['tesseractBonusMultiplier'][i] = 1 + mult * G['giftbase'][i] * Math.pow(tesseractArray[i], power) * G['hypercubeBonusMultiplier'][i];
    }
}