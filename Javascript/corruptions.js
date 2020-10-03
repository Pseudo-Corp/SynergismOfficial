function corruptionDisplay(index){
    if(document.getElementById("corruptionDetails").style.display !== "block"){document.getElementById("corruptionDetails").style.display = "block"}
    corruptionTrigger = index
    let corruptionTexts = {
        1: {
            name: "Corruption I: Divisiveness",
            description: "The Ant God's found out how to ruin your duplicator!",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[1]) + ". Effect: Free Mult Exponent ^" + format(divisivenessPower[player.usedCorruptions[1]], 3),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[1]) + ". Effect: Free Multiplier Exponent ^" + format(divisivenessPower[player.prototypeCorruptions[1]], 3),
            multiplier: "Current Score Multiplier: " + format(corruptionPointMultipliers[player.usedCorruptions[1]], 1) + " / Next Ascension Score Multiplier: " + format(corruptionPointMultipliers[player.prototypeCorruptions[1]], 1),
        },
        2: {
            name: "Corruption II: Maladaption",
            description: "Insert Cool Text Here.",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[2]) + ". Effect: Free Accel. Exponent ^" + format(maladaptivePower[player.usedCorruptions[2]], 3),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[2]) + ". Effect: Free Accelerator Exponent ^" + format(maladaptivePower[player.prototypeCorruptions[2]], 3),
            multiplier: "Current Score Multiplier: " + format(corruptionPointMultipliers[player.usedCorruptions[2]], 1) + " / Next Ascension Score Multiplier: " + format(corruptionPointMultipliers[player.prototypeCorruptions[2]], 1),
        },
        3: {
            name: "Corruption III: Spacial Dilation",
            description: "Way to go, Albert.",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[3]) + ". Effect: Time Speed is divided by " + format(1 / lazinessMultiplier[player.usedCorruptions[3]], 5),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[3]) + ". Effect: Time is divided by " + format(1 / lazinessMultiplier[player.prototypeCorruptions[3]], 5),
            multiplier: "Current Score Multiplier: " + format(corruptionPointMultipliers[player.usedCorruptions[3]], 1) + " / Next Ascension Score Multiplier: " + format(corruptionPointMultipliers[player.prototypeCorruptions[3]], 1),
        },
        4: {
            name: "Corruption IV: Hyperchallenged",
            description: "What's in a challenge?",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[4]) + ". Effect: Challenge Exponent Reqs.  x" + format(hyperchallengedMultiplier[player.usedCorruptions[4]], 3),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[4]) + ". Effect: Challenge Exponent Reqs.  x" + format(hyperchallengedMultiplier[player.prototypeCorruptions[4]], 3),
            multiplier: "Current Score Multiplier: " + format(corruptionPointMultipliers[player.usedCorruptions[4]], 1) + " / Next Ascension Score Multiplier: " + format(corruptionPointMultipliers[player.prototypeCorruptions[4]], 1),
        },
        5: {
            name: "Corruption V: Scientific Illiteracy",
            description: "Maybe Albert wouldn't have theorized Dilation after all.",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[5]) + ". Effect: Obtainium gain ^" + format(illiteracyPower[player.usedCorruptions[5]], 3),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[5]) + ". Effect: Obtainium gain ^" + format(illiteracyPower[player.prototypeCorruptions[5]], 3),
            multiplier: "Current Score Multiplier: " + format(corruptionPointMultipliers[player.usedCorruptions[5]], 1) + " / Next Ascension Score Multiplier: " + format(corruptionPointMultipliers[player.prototypeCorruptions[5]], 1),
        },
        6: {
            name: "Corruption VI: Market Deflation",
            description: "Diamond Mine destroyed... no more monopolies!",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[6]) + ". Effect: Diamond gain ^" + format(deflationMultiplier[player.usedCorruptions[6]], 9),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[6]) + ". Effect: Diamond gain ^" + format(deflationMultiplier[player.prototypeCorruptions[6]], 9),
            multiplier: "Current Score Multiplier: " + format(corruptionPointMultipliers[player.usedCorruptions[6]], 1) + " / Next Ascension Score Multiplier: " + format(corruptionPointMultipliers[player.prototypeCorruptions[6]], 1),
        },
        7: {
            name: "Corruption VII: Extinction",
            description: "It killed the dinosaurs too, ya dingus.",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[7]) + ". Effect: Ant Production ^" + format(extinctionMultiplier[player.usedCorruptions[7]], 3),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[7]) + ". Effect: Ant Production ^" + format(extinctionMultiplier[player.prototypeCorruptions[7]], 3),
            multiplier: "Current Score Multiplier: " + format(corruptionPointMultipliers[player.usedCorruptions[7]], 1) + " / Next Ascension Score Multiplier: " + format(corruptionPointMultipliers[player.prototypeCorruptions[7]], 1),
        },
        8: {
            name: "Corruption VIII: Drought",
            description: "More like California, am I right?",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[8]) + ". Effect: Offering EXP divided by " + format(droughtMultiplier[player.usedCorruptions[8]], 3),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[8]) + ". Effect: Offering EXP divided by " + format(droughtMultiplier[player.prototypeCorruptions[8]], 3),
            multiplier: "Current Score Multiplier: " + format(corruptionPointMultipliers[player.usedCorruptions[8]], 1) + " / Next Ascension Score Multiplier: " + format(corruptionPointMultipliers[player.prototypeCorruptions[8]], 1),
        },
        9: {
            name: "Corruption IX: Financial Recession",
            description: "2008.exe has stopped working.",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[9]) + ". Effect: Coin Gain ^" + format(financialcollapsePower[player.usedCorruptions[9]], 3),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[9]) + ". Effect: Coin Gain ^" + format(financialcollapsePower[player.prototypeCorruptions[9]], 3),
            multiplier: "Current Score Multiplier: " + format(corruptionPointMultipliers[player.usedCorruptions[9]], 1) + " / Next Ascension Score Multiplier: " + format(corruptionPointMultipliers[player.prototypeCorruptions[9]], 1),
        },
        10: {
            name: "CLEANSE THE CORRUPTION",
            description: "Free this world of sin.",
            current: "Reset all Corruptions to level 0 for your current ascension. Does not reset your current ascension.",
            planned: "Push that big 'Reset Corruptions' button to confirm your decision.",
            multiplier: "Note: if you need to do this, you may have bitten off more than you can chew."
        }
    }
    document.getElementById("corruptionName").textContent = corruptionTexts[index].name
    document.getElementById("corruptionDescription").textContent = corruptionTexts[index].description
    document.getElementById("corruptionLevelCurrent").textContent = corruptionTexts[index].current
    document.getElementById("corruptionLevelPlanned").textContent = corruptionTexts[index].planned
    document.getElementById("corruptionMultiplierContribution").textContent = corruptionTexts[index].multiplier

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
