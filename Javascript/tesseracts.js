function openTesseract(value,max){
    max = max || false
    let num = 0;
    let toSpend = Math.min(player.wowTesseracts, value)
    if(max){toSpend = player.wowTesseracts}
    
    player.wowTesseracts -= toSpend
    
    let toSpendModulo = toSpend % 20
    let toSpendDiv20 = Math.floor(toSpend / 20)    
    
    //If you're opening more than 20 Tesseracts, it will consume all Tesseracts until remainder mod 20, giving expected values.
        player.tesseractBlessings.accelerator += 4 * toSpendDiv20;
        player.tesseractBlessings.multiplier += 4 * toSpendDiv20;
        player.tesseractBlessings.offering += 2 * toSpendDiv20;
        player.tesseractBlessings.runeExp += 2 * toSpendDiv20;
        player.tesseractBlessings.obtainium += 2 * toSpendDiv20;
        player.tesseractBlessings.antSpeed += 2 * toSpendDiv20;
        player.tesseractBlessings.antSacrifice += toSpendDiv20;
        player.tesseractBlessings.antELO += toSpendDiv20;
        player.tesseractBlessings.talismanBonus += toSpendDiv20;
        player.tesseractBlessings.globalSpeed += toSpendDiv20;
    //Then, the remaining tesseract will be opened, simulating the probability [RNG Element]
        for (var i = 1; i <= toSpendModulo; i++){
            num = 100 * Math.random();
            if(num >= 95){player.tesseractBlessings.globalSpeed += 1}
            else if(num >= 90){player.tesseractBlessings.talismanBonus += 1}
            else if(num >= 85){player.tesseractBlessings.antELO += 1}
            else if(num >= 80){player.tesseractBlessings.antSacrifice += 1}
            else if(num >= 70){player.tesseractBlessings.antSpeed += 1}
            else if(num >= 60){player.tesseractBlessings.obtainium += 1}
            else if(num >= 50){player.tesseractBlessings.runeExp += 1}
            else if(num >= 40){player.tesseractBlessings.offering += 1}
            else if(num >= 20){player.tesseractBlessings.multiplier += 1}
            else{player.tesseractBlessings.accelerator += 1}
        }
        calculateTesseractBlessings();
        let extraCubeBlessings = Math.floor(12 * toSpend * player.researches[153])
        player.wowCubes += extraCubeBlessings
        openCube(extraCubeBlessings, false)
    }

function calculateTesseractBlessings(){

    document.getElementById("tesseractQuantity").textContent = format(player.wowTesseracts,0,true)
    
        let tesseractArray = [null, player.tesseractBlessings.accelerator, player.tesseractBlessings.multiplier, player.tesseractBlessings.offering, player.tesseractBlessings.runeExp, player.tesseractBlessings.obtainium, player.tesseractBlessings.antSpeed, player.tesseractBlessings.antSacrifice, player.tesseractBlessings.antELO, player.tesseractBlessings.talismanBonus, player.tesseractBlessings.globalSpeed]
    
        let accuracy = [null,2,2,2,2,2,2,2,2,2,2]
        for(var i = 1; i <= 10; i++){
        let power = 1;
        let mult = 1;
        let augmentAccuracy = 0;
        if(tesseractArray[i] >= 100){power = giftDRPower[i]; mult *= Math.pow(100, (1 - giftDRPower[i])); augmentAccuracy += 2;}
        if(i === 6){power = 1; mult = 1; augmentAccuracy = 0;}
    
        tesseractBonusMultiplier[i] = 1 + mult * giftbase[i] * Math.pow(tesseractArray[i], power) * hypercubeBonusMultiplier[i];
    
        document.getElementById("tesseractBlessing"+i+"Amount").textContent = "x"+format(tesseractArray[i],0,true)
        document.getElementById("tesseractBlessing"+i+"Effect").textContent = "+"+format(100*(tesseractBonusMultiplier[i] - 1),accuracy[i] + augmentAccuracy,true) + "%"
        }
}
    