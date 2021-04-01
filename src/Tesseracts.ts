import { player } from './Synergism';
import { Player } from './types/Synergism';
import { Globals as G } from './Variables';
import { openCube } from './Cubes';
import { Alert, Prompt } from './UpdateHTML';

/**
 * Opens a custom number of Tesseracts!!!!!
 */
export const openCustomTesseract = async () => {
    const amount = await Prompt(`How many Tesseracts would you like to open? You have ${player.wowTesseracts.toLocaleString()}!`);
    if (amount === null)
        return Alert('OK. No Tesseracts opened.');
    const tess = Number(amount);

    if (Number.isNaN(tess) || !Number.isFinite(tess)) // nan + Infinity checks
        return Alert('Value must be a finite number!');
    else if (player.wowTesseracts < tess) // not enough tessy to open
        return Alert('You don\'t have enough Tesseract to open!');
    else if (tess <= 0) // 0 or less tessy to open
        return Alert('You can\'t open a negative number of tesseracts.');

    return openTesseract(tess, tess === player.wowTesseracts);
}

export const openTesseract = (value: number, max = false) => {
    let toSpend = Math.min(player.wowTesseracts, value)
    if (max) {
        toSpend = player.wowTesseracts
    }

    player.wowTesseracts -= toSpend
    player.tesseractOpenedDaily += toSpend

    if (player.tesseractQuarkDaily < 25 + 75 * player.shopUpgrades.tesseractToQuark) {
        while (
            player.tesseractOpenedDaily >= 10 * Math.pow(1 + player.tesseractQuarkDaily, 3) && 
            player.tesseractQuarkDaily < 25 + 75 * player.shopUpgrades.tesseractToQuark
        ) {
            player.tesseractQuarkDaily += 1;
            player.worlds.add(1);
        }
    }
    const toSpendModulo = toSpend % 20
    const toSpendDiv20 = Math.floor(toSpend / 20)
    const blessings = {
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
        const num = 100 * Math.random();
        for (const key in player.tesseractBlessings) {
            if (blessings[key as keyof typeof blessings].pdf(num))
                player.tesseractBlessings[key as keyof Player['tesseractBlessings']] += 1;
        }
    }
    calculateTesseractBlessings();
    const extraCubeBlessings = Math.floor(12 * toSpend * player.researches[153])
    player.wowCubes += extraCubeBlessings
    openCube(extraCubeBlessings, false)
}

export const calculateTesseractBlessings = () => {
    // The visual updates are handled in visualUpdateCubes()
    const tesseractArray = [player.tesseractBlessings.accelerator, player.tesseractBlessings.multiplier, player.tesseractBlessings.offering, player.tesseractBlessings.runeExp, player.tesseractBlessings.obtainium, player.tesseractBlessings.antSpeed, player.tesseractBlessings.antSacrifice, player.tesseractBlessings.antELO, player.tesseractBlessings.talismanBonus, player.tesseractBlessings.globalSpeed]

    for (let i = 0; i < 10; i++) {
        let power = 1;
        let mult = 1;
        if (tesseractArray[i] >= 1000 && i !== 5) {
            power = G['giftDRPower'][i];
            mult *= Math.pow(1000, (1 - G['giftDRPower'][i]));
        }

        G['tesseractBonusMultiplier'][i+1] = 1 + mult * G['giftbase'][i] * Math.pow(tesseractArray[i], power) * G['hypercubeBonusMultiplier'][i+1];
    }
}