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

    //If you're opening more than 20 Hypercubes, it will consume all Hypercubes until remainder mod 20, giving expected values.
    player.hypercubeBlessings.accelerator += 4 * toSpendDiv20;
    player.hypercubeBlessings.multiplier += 4 * toSpendDiv20;
    player.hypercubeBlessings.offering += 2 * toSpendDiv20;
    player.hypercubeBlessings.runeExp += 2 * toSpendDiv20;
    player.hypercubeBlessings.obtainium += 2 * toSpendDiv20;
    player.hypercubeBlessings.antSpeed += 2 * toSpendDiv20;
    player.hypercubeBlessings.antSacrifice += toSpendDiv20;
    player.hypercubeBlessings.antELO += toSpendDiv20;
    player.hypercubeBlessings.talismanBonus += toSpendDiv20;
    player.hypercubeBlessings.globalSpeed += toSpendDiv20;
    //Then, the remaining hypercube will be opened, simulating the probability [RNG Element]
    for (var i = 1; i <= toSpendModulo; i++) {
        num = 100 * Math.random();
        if (num >= 95) {
            player.hypercubeBlessings.globalSpeed += 1
        } else if (num >= 90) {
            player.hypercubeBlessings.talismanBonus += 1
        } else if (num >= 85) {
            player.hypercubeBlessings.antELO += 1
        } else if (num >= 80) {
            player.hypercubeBlessings.antSacrifice += 1
        } else if (num >= 70) {
            player.hypercubeBlessings.antSpeed += 1
        } else if (num >= 60) {
            player.hypercubeBlessings.obtainium += 1
        } else if (num >= 50) {
            player.hypercubeBlessings.runeExp += 1
        } else if (num >= 40) {
            player.hypercubeBlessings.offering += 1
        } else if (num >= 20) {
            player.hypercubeBlessings.multiplier += 1
        } else {
            player.hypercubeBlessings.accelerator += 1
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
    for (var i = 1; i <= 10; i++) {
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