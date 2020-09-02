function openHypercube(value, max) {
    max = max || false
    let num = 0;
    let toSpend = Math.min(player.wowHypercubes, value)
    if (max) {
        toSpend = player.wowHypercubes
    }

    player.wowHypercubes -= toSpend

    let toSpendModulo = toSpend % 20
    let toSpendDiv20 = Math.floor(toSpend / 20)
    let blessings = {
        accelerator:    {weight:4, pdf:(x) => {return 0 <= x && x <= 20}},
        multiplier:     {weight:4, pdf:(x) => {return 20 < x && x <= 40}},
        offering:       {weight:2, pdf:(x) => {return 40 < x && x <= 50}},
        runeExp:        {weight:2, pdf:(x) => {return 50 < x && x <= 60}},
        obtainium:      {weight:2, pdf:(x) => {return 60 < x && x <= 70}},
        antSpeed:       {weight:2, pdf:(x) => {return 70 < x && x <= 80}},
        antSacrifice:   {weight:1, pdf:(x) => {return 80 < x && x <= 85}},
        antELO:         {weight:1, pdf:(x) => {return 85 < x && x <= 90}},
        talismanBonus:  {weight:1, pdf:(x) => {return 90 < x && x <= 95}},
        globalSpeed:    {weight:1, pdf:(x) => {return 95 < x && x <= 100}}
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
    let extraTesseractBlessings = 0
    player.wowTesseracts += extraTesseractBlessings
    openTesseract(extraTesseractBlessings, false)
}

function calculateHypercubeBlessings() {

    document.getElementById("hypercubeQuantity").textContent = format(player.wowHypercubes, 0, true)

    let hypercubeArray = [null, player.hypercubeBlessings.accelerator, player.hypercubeBlessings.multiplier, player.hypercubeBlessings.offering, player.hypercubeBlessings.runeExp, player.hypercubeBlessings.obtainium, player.hypercubeBlessings.antSpeed, player.hypercubeBlessings.antSacrifice, player.hypercubeBlessings.antELO, player.hypercubeBlessings.talismanBonus, player.hypercubeBlessings.globalSpeed]

    let accuracy = [null, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
    for (let i = 1; i <= 10; i++) {
        let power = 1;
        let mult = 1;
        let augmentAccuracy = 0;
        if (hypercubeArray[i] >= 10) {
            power = benedictionDRPower[i];
            mult *= Math.pow(10, (1 - benedictionDRPower[i]));
            augmentAccuracy += 2;
        }

        hypercubeBonusMultiplier[i] = 1 + mult * benedictionbase[i] * Math.pow(hypercubeArray[i], power);

        document.getElementById("hypercubeBlessing" + i + "Amount").textContent = "x" + format(hypercubeArray[i], 0, true)
        document.getElementById("hypercubeBlessing" + i + "Effect").textContent = "+" + format(100 * (hypercubeBonusMultiplier[i] - 1), accuracy[i] + augmentAccuracy, true) + "%"
    }
}