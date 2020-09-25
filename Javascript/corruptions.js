function corruptionDisplay(index){
    let a = document.getElementById("corruptionName")
    let b = document.getElementById("corruptionDescription")
    let c = document.getElementById("corruptionLevelCurrent")
    let d = document.getElementById("corruptionLevelPlanned")
    let e = document.getElementById("corruptionMultiplierContribution")

    if(document.getElementById("corruptionDetails").style.display !== "block"){document.getElementById("corruptionDetails").style.display = "block"}
    corruptionTrigger = index
    switch(index){
        case 1:
            a.textContent = "Corruption I: Divisiveness"
            b.textContent = "The Ant God's found out how to ruin your duplicator!"
            c.textContent = "On this Ascension, this corruption is level " + format(player.usedCorruptions[1]) + ". Effect: Free Mult Exponent ^" + format(divisivenessPower[player.usedCorruptions[1]],3)
            d.textContent = "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[1]) + ". Effect: Free Multiplier Exponent ^" + format(divisivenessPower[player.prototypeCorruptions[1]],3)
            e.textContent = "Current Score Multiplier: " + format(corruptionPointMultipliers[player.usedCorruptions[1]],1) + " / Next Ascension Score Multiplier: " + format(corruptionPointMultipliers[player.prototypeCorruptions[1]],1)
            break;
        case 2:
            a.textContent = "Corruption II: Maladaption"
            b.textContent = "Insert Cool Text Here."
            c.textContent = "On this Ascension, this corruption is level " + format(player.usedCorruptions[2]) + ". Effect: Free Accel. Exponent ^" + format(maladaptivePower[player.usedCorruptions[2]],3)
            d.textContent = "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[2]) + ". Effect: Free Accelerator Exponent ^" + format(maladaptivePower[player.prototypeCorruptions[2]],3)
            e.textContent = "Current Score Multiplier: " + format(corruptionPointMultipliers[player.usedCorruptions[2]],1) + " / Next Ascension Score Multiplier: " + format(corruptionPointMultipliers[player.prototypeCorruptions[2]],1)
            break;
        case 3:
            a.textContent = "Corruption III: Spacial Dilation"
            b.textContent = "Way to go, Albert."
            c.textContent = "On this Ascension, this corruption is level " + format(player.usedCorruptions[3]) + ". Effect: Time Speed is divided by " + format(1 / lazinessMultiplier[player.usedCorruptions[3]],5)
            d.textContent = "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[3]) + ". Effect: Time is divided by " + format(1 / lazinessMultiplier[player.prototypeCorruptions[3]],5)
            e.textContent = "Current Score Multiplier: " + format(corruptionPointMultipliers[player.usedCorruptions[3]],1) + " / Next Ascension Score Multiplier: " + format(corruptionPointMultipliers[player.prototypeCorruptions[3]],1)
            break;
        case 4:
            a.textContent = "Corruption IV: Hyperchallenged"
            b.textContent = "What's in a challenge?"
            c.textContent = "On this Ascension, this corruption is level " + format(player.usedCorruptions[4]) + ". Effect: Challenge Exponent Reqs.  x" + format(hyperchallengedMultiplier[player.usedCorruptions[4]],3)
            d.textContent = "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[4]) + ". Effect: Challenge Exponent Reqs.  x" + format(hyperchallengedMultiplier[player.prototypeCorruptions[4]],3)
            e.textContent = "Current Score Multiplier: " + format(corruptionPointMultipliers[player.usedCorruptions[4]],1) + " / Next Ascension Score Multiplier: " + format(corruptionPointMultipliers[player.prototypeCorruptions[4]],1)
            break;
        case 5:
            a.textContent = "Corruption V: Scientific Illiteracy"
            b.textContent = "Maybe Albert wouldn't have theorized Dilation after all."
            c.textContent = "On this Ascension, this corruption is level " + format(player.usedCorruptions[5]) + ". Effect: Obtainium gain ^" + format(illiteracyPower[player.usedCorruptions[5]],3)
            d.textContent = "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[5]) + ". Effect: Obtainium gain ^" + format(illiteracyPower[player.prototypeCorruptions[5]],3)
            e.textContent = "Current Score Multiplier: " + format(corruptionPointMultipliers[player.usedCorruptions[5]],1) + " / Next Ascension Score Multiplier: " + format(corruptionPointMultipliers[player.prototypeCorruptions[5]],1)
            break;
        case 6:
            a.textContent = "Corruption VI: Market Deflation"
            b.textContent = "Diamond Mine destroyed... no more monopolies!"
            c.textContent = "On this Ascension, this corruption is level " + format(player.usedCorruptions[6]) + ". Effect: Diamond gain ^" + format(deflationMultiplier[player.usedCorruptions[6]],9)
            d.textContent = "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[6]) + ". Effect: Diamond gain ^" + format(deflationMultiplier[player.prototypeCorruptions[6]],9)
            e.textContent = "Current Score Multiplier: " + format(corruptionPointMultipliers[player.usedCorruptions[6]],1) + " / Next Ascension Score Multiplier: " + format(corruptionPointMultipliers[player.prototypeCorruptions[6]],1)
            break;
        case 7:
            a.textContent = "Corruption VII: Extinction"
            b.textContent = "It killed the dinosaurs too, ya dingus."
            c.textContent = "On this Ascension, this corruption is level " + format(player.usedCorruptions[7]) + ". Effect: Ant Production ^" + format(extinctionMultiplier[player.usedCorruptions[7]],3)
            d.textContent = "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[7]) + ". Effect: Ant Production ^" + format(extinctionMultiplier[player.prototypeCorruptions[7]],3)
            e.textContent = "Current Score Multiplier: " + format(corruptionPointMultipliers[player.usedCorruptions[7]],1) + " / Next Ascension Score Multiplier: " + format(corruptionPointMultipliers[player.prototypeCorruptions[7]],1)
            break;
        case 8:
            a.textContent = "Corruption VIII: Drought"
            b.textContent = "More like California, am I right?"
            c.textContent = "On this Ascension, this corruption is level " + format(player.usedCorruptions[8]) + ". Effect: Offering EXP divided by " + format(droughtMultiplier[player.usedCorruptions[8]],3)
            d.textContent = "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[8]) + ". Effect: Offering EXP divided by " + format(droughtMultiplier[player.prototypeCorruptions[8]],3)
            e.textContent = "Current Score Multiplier: " + format(corruptionPointMultipliers[player.usedCorruptions[8]],1) + " / Next Ascension Score Multiplier: " + format(corruptionPointMultipliers[player.prototypeCorruptions[8]],1)
            break;
        case 9:
            a.textContent = "Corruption IX: Financial Recession"
            b.textContent = "2008.exe has stopped working."
            c.textContent = "On this Ascension, this corruption is level " + format(player.usedCorruptions[9]) + ". Effect: Coin Gain ^" + format(financialcollapsePower[player.usedCorruptions[9]],3)
            d.textContent = "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[9]) + ". Effect: Coin Gain ^" + format(financialcollapsePower[player.prototypeCorruptions[9]],3)
            e.textContent = "Current Score Multiplier: " + format(corruptionPointMultipliers[player.usedCorruptions[9]],1) + " / Next Ascension Score Multiplier: " + format(corruptionPointMultipliers[player.prototypeCorruptions[9]],1)
            break;
        case 10:
            a.textContent = "CLEANSE THE CORRUPTION"
            b.textContent = "Free this world of sin."
            c.textContent = "Reset all Corruptions to level 0 for your current ascension. Does not reset your current ascension."
            d.textContent = "Push that big 'Reset Corruptions' button to confirm your decision." 
            e.textContent = "Note: if you need to do this, you may have bitten off more than you can chew."
            break;
    }

    if(index < 10){
        document.getElementById("corruptLevelUp").style.display = "block";
        document.getElementById("corruptLevelDown").style.display = "block";
        document.getElementById("corruptionCleanse").style.display = "none";
    }
    if(index === 10){
        document.getElementById("corruptLevelUp").style.display = "none";
        document.getElementById("corruptLevelDown").style.display = "none";
        document.getElementById("corruptionCleanse").style.display = "block";
    }
}
