function openTesseract(value, max) {
    max = max || false
    let num = 0;
    let toSpend = Math.min(player.wowTesseracts, value)
    if (max) {
        toSpend = player.wowTesseracts
    }

    player.wowTesseracts -= toSpend
    player.tesseractOpenedDaily += toSpend

    if (player.tesseractQuarkDaily < 25 + 75 * player.shopUpgrades.tesseractToQuarkBought) {
        while (player.tesseractOpenedDaily >= 10 * Math.pow(1 + player.tesseractQuarkDaily, 3) && player.tesseractQuarkDaily < 25 + 75 * player.shopUpgrades.tesseractToQuarkBought) {
            player.tesseractQuarkDaily += 1;
            player.worlds += 1;
        }
    }
    let toSpendModulo = toSpend % 20
    let toSpendDiv20 = Math.floor(toSpend / 20)
    let blessings = {
        accelerator:   {weight: 4, pdf: (x) => 0 <= x && x <= 20},
        multiplier:    {weight: 4, pdf: (x) => 20 < x && x <= 40},
        offering:      {weight: 2, pdf: (x) => 40 < x && x <= 50},
        runeExp:       {weight: 2, pdf: (x) => 50 < x && x <= 60},
        obtainium:     {weight: 2, pdf: (x) => 60 < x && x <= 70},
        antSpeed:      {weight: 2, pdf: (x) => 70 < x && x <= 80},
        antSacrifice:  {weight: 1, pdf: (x) => 80 < x && x <= 85},
        antELO:        {weight: 1, pdf: (x) => 85 < x && x <= 90},
        talismanBonus: {weight: 1, pdf: (x) => 90 < x && x <= 95},
        globalSpeed:   {weight: 1, pdf: (x) => 95 < x && x <= 100}
    }

    //If you're opening more than 20 Tesseracts, it will consume all Tesseracts until remainder mod 20, giving expected values.
    for (let key of Object.keys(player.tesseractBlessings)) {
        player.tesseractBlessings[key] += blessings[key].weight * toSpendDiv20;
    }
    //Then, the remaining tesseract will be opened, simulating the probability [RNG Element]
    for (let i = 0; i < toSpendModulo; i++) {
        let num = 100 * Math.random();
        for (let key of Object.keys(player.tesseractBlessings)) {
            if (blessings[key].pdf(num))
                player.tesseractBlessings[key] += 1;
        }
    }
    calculateTesseractBlessings();
    let extraCubeBlessings = Math.floor(12 * toSpend * player.researches[153])
    player.wowCubes += extraCubeBlessings
    openCube(extraCubeBlessings, false)
}

function calculateTesseractBlessings() {
    // The visual updates are handled in visualUpdateCubes()
    let tesseractArray = [null, player.tesseractBlessings.accelerator, player.tesseractBlessings.multiplier, player.tesseractBlessings.offering, player.tesseractBlessings.runeExp, player.tesseractBlessings.obtainium, player.tesseractBlessings.antSpeed, player.tesseractBlessings.antSacrifice, player.tesseractBlessings.antELO, player.tesseractBlessings.talismanBonus, player.tesseractBlessings.globalSpeed]

    for (let i = 1; i <= 10; i++) {
        let power = 1;
        let mult = 1;
        if (tesseractArray[i] >= 1000 && i !== 6) {
            power = giftDRPower[i];
            mult *= Math.pow(1000, (1 - giftDRPower[i]));
        }

        tesseractBonusMultiplier[i] = 1 + mult * giftbase[i] * Math.pow(tesseractArray[i], power) * hypercubeBonusMultiplier[i];
    }
}