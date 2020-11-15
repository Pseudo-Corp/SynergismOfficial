function openHypercube(value, max) {
    max = max || false
    let num = 0;
    let toSpend = Math.min(player.wowHypercubes, value)
    if (max) {
        toSpend = player.wowHypercubes
    }

    player.wowHypercubes -= toSpend
    player.hypercubeOpenedDaily += toSpend

    if (player.hypercubeQuarkDaily < 25 + 75 * player.shopUpgrades.hypercubeToQuarkBought) {
        while (player.hypercubeOpenedDaily >= 5 * Math.pow(1 + player.hypercubeQuarkDaily, 2) && player.hypercubeQuarkDaily < 25 + 75 * player.shopUpgrades.hypercubeToQuarkBought) {
            player.hypercubeQuarkDaily += 1;
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

    //If you're opening more than 20 Hypercubes, it will consume all Hypercubes until remainder mod 20, giving expected values.
    for (let key of Object.keys(player.hypercubeBlessings)) {
        player.hypercubeBlessings[key] += blessings[key].weight * toSpendDiv20;
    }
    //Then, the remaining hypercube will be opened, simulating the probability [RNG Element]
    for (let i = 0; i < toSpendModulo; i++) {
        let num = 100 * Math.random();
        for (let key of Object.keys(player.hypercubeBlessings)) {
            if (blessings[key].pdf(num))
                player.hypercubeBlessings[key] += 1;
        }
    }
    calculateHypercubeBlessings();
    let extraTesseractBlessings = Math.floor(toSpend * 100 * player.researches[183])
    player.wowTesseracts += extraTesseractBlessings
    openTesseract(extraTesseractBlessings, false)
}

function calculateHypercubeBlessings() {
    // The visual updates are handled in visualUpdateCubes()
    let hypercubeArray = [null, player.hypercubeBlessings.accelerator, player.hypercubeBlessings.multiplier, player.hypercubeBlessings.offering, player.hypercubeBlessings.runeExp, player.hypercubeBlessings.obtainium, player.hypercubeBlessings.antSpeed, player.hypercubeBlessings.antSacrifice, player.hypercubeBlessings.antELO, player.hypercubeBlessings.talismanBonus, player.hypercubeBlessings.globalSpeed]

    for (let i = 1; i <= 10; i++) {
        let power = 1;
        let mult = 1;
        if (hypercubeArray[i] >= 1000) {
            power = benedictionDRPower[i];
            mult *= Math.pow(1000, (1 - benedictionDRPower[i]));
        }

        hypercubeBonusMultiplier[i] = 1 + mult * benedictionbase[i] * Math.pow(hypercubeArray[i], power) * platonicBonusMultiplier[4];
    }
}