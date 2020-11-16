function corruptionDisplay(index) {
    if (document.getElementById("corruptionDetails").style.visibility !== "visible") {
        document.getElementById("corruptionDetails").style.visibility = "visible"
    }
    if (document.getElementById("corruptionSelectedPic").style.visibility !== "visible") {
        document.getElementById("corruptionSelectedPic").style.visibility = "visible"
    }
    corruptionTrigger = index
    let corruptionTexts = {
        1: {
            name: "Corruption I: Divisiveness",
            description: "Your multipliers get disintegrated! Is extra devious without also using Maladaption Corruption",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[1]) + ". Effect: Free Mult Exponent ^" + format(divisivenessPower[player.usedCorruptions[1]], 3),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[1]) + ". Effect: Free Multiplier Exponent ^" + format(divisivenessPower[player.prototypeCorruptions[1]], 3),
            multiplier: "Current Score Multiplier: " + format(corruptionPointMultipliers[player.usedCorruptions[1]], 1) + " / Next Ascension Score Multiplier: " + format(corruptionPointMultipliers[player.prototypeCorruptions[1]], 1),
            spiritContribution: "This Ascension gives Rune Spirit Effect +" + format(4 * Math.pow(player.usedCorruptions[1],2),1) + "% / Next Ascension Rune Spirit Effect +" + format(4 * Math.pow(player.prototypeCorruptions[1],2),1) + "%", 
            image: "Pictures/Divisiveness Level 7.png"
        },
        2: {
            name: "Corruption II: Maladaption",
            description: "Insert Cool Text Here. Is extra devious without also using Divisiveness Corruption. Yin/Yang!",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[2]) + ". Effect: Free Accel. Exponent ^" + format(maladaptivePower[player.usedCorruptions[2]], 3),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[2]) + ". Effect: Free Accelerator Exponent ^" + format(maladaptivePower[player.prototypeCorruptions[2]], 3),
            multiplier: "Current Score Multiplier: " + format(corruptionPointMultipliers[player.usedCorruptions[2]], 1) + " / Next Ascension Score Multiplier: " + format(corruptionPointMultipliers[player.prototypeCorruptions[2]], 1),
            spiritContribution: "This Ascension gives Rune Spirit Effect +" + format(4 * Math.pow(player.usedCorruptions[2],2),1) + "% / Next Ascension Rune Spirit Effect +" + format(4 * Math.pow(player.prototypeCorruptions[2],2),1) + "%", 
            image: "Pictures/Maladaption Lvl 7.png"
        },
        3: {
            name: "Corruption III: Spacial Dilation",
            description: "Way to go, Albert.",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[3]) + ". Effect: Time Speed is divided by " + format(1 / lazinessMultiplier[player.usedCorruptions[3]], 5),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[3]) + ". Effect: Time is divided by " + format(1 / lazinessMultiplier[player.prototypeCorruptions[3]], 5),
            multiplier: "Current Score Multiplier: " + format(corruptionPointMultipliers[player.usedCorruptions[3]], 1) + " / Next Ascension Score Multiplier: " + format(corruptionPointMultipliers[player.prototypeCorruptions[3]], 1),
            spiritContribution: "This Ascension gives Rune Spirit Effect +" + format(4 * Math.pow(player.usedCorruptions[3],2),1) + "% / Next Ascension Rune Spirit Effect +" + format(4 * Math.pow(player.prototypeCorruptions[3],2),1) + "%", 
            image: "Pictures/Laziness Lvl 7.png"
        },
        4: {
            name: "Corruption IV: Hyperchallenged",
            description: "What's in a challenge?",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[4]) + ". Effect: Challenge Exponent Reqs.  x" + format(hyperchallengedMultiplier[player.usedCorruptions[4]], 3),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[4]) + ". Effect: Challenge Exponent Reqs.  x" + format(hyperchallengedMultiplier[player.prototypeCorruptions[4]], 3),
            multiplier: "Current Score Multiplier: " + format(corruptionPointMultipliers[player.usedCorruptions[4]], 1) + " / Next Ascension Score Multiplier: " + format(corruptionPointMultipliers[player.prototypeCorruptions[4]], 1),
            spiritContribution: "This Ascension gives Rune Spirit Effect +" + format(4 * Math.pow(player.usedCorruptions[4],2),1) + "% / Next Ascension Rune Spirit Effect +" + format(4 * Math.pow(player.prototypeCorruptions[4],2),1) + "%", 
            image: "Pictures/Hyperchallenged Lvl 7.png"
        },
        5: {
            name: "Corruption V: Scientific Illiteracy",
            description: "Maybe Albert wouldn't have theorized Dilation after all.",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[5]) + ". Effect: Obtainium gain ^" + format(illiteracyPower[player.usedCorruptions[5]], 3),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[5]) + ". Effect: Obtainium gain ^" + format(illiteracyPower[player.prototypeCorruptions[5]], 3),
            multiplier: "Current Score Multiplier: " + format(corruptionPointMultipliers[player.usedCorruptions[5]], 1) + " / Next Ascension Score Multiplier: " + format(corruptionPointMultipliers[player.prototypeCorruptions[5]], 1),
            spiritContribution: "This Ascension gives Rune Spirit Effect +" + format(4 * Math.pow(player.usedCorruptions[5],2),1) + "% / Next Ascension Rune Spirit Effect +" + format(4 * Math.pow(player.prototypeCorruptions[5],2),1) + "%", 
            image: "Pictures/Scientific Illiteracy Lvl 7.png"
        },
        6: {
            name: "Corruption VI: Market Deflation",
            description: "Diamond Mine destroyed... no more monopolies!",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[6]) + ". Effect: Diamond gain ^" + format(deflationMultiplier[player.usedCorruptions[6]], 9),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[6]) + ". Effect: Diamond gain ^" + format(deflationMultiplier[player.prototypeCorruptions[6]], 9),
            multiplier: "Current Score Multiplier: " + format(corruptionPointMultipliers[player.usedCorruptions[6]], 1) + " / Next Ascension Score Multiplier: " + format(corruptionPointMultipliers[player.prototypeCorruptions[6]], 1),
            spiritContribution: "This Ascension gives Rune Spirit Effect +" + format(4 * Math.pow(player.usedCorruptions[6],2),1) + "% / Next Ascension Rune Spirit Effect +" + format(4 * Math.pow(player.prototypeCorruptions[6],2),1) + "%", 
            image: "Pictures/Deflation Lvl 7.png"
        },
        7: {
            name: "Corruption VII: Extinction",
            description: "It killed the dinosaurs too, ya dingus.",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[7]) + ". Effect: Ant Production ^" + format(extinctionMultiplier[player.usedCorruptions[7]], 3),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[7]) + ". Effect: Ant Production ^" + format(extinctionMultiplier[player.prototypeCorruptions[7]], 3),
            multiplier: "Current Score Multiplier: " + format(corruptionPointMultipliers[player.usedCorruptions[7]], 1) + " / Next Ascension Score Multiplier: " + format(corruptionPointMultipliers[player.prototypeCorruptions[7]], 1),
            spiritContribution: "This Ascension gives Rune Spirit Effect +" + format(4 * Math.pow(player.usedCorruptions[7],2),1) + "% / Next Ascension Rune Spirit Effect +" + format(4 * Math.pow(player.prototypeCorruptions[7],2),1) + "%", 
            image: "Pictures/Extinction Lvl 7.png"
        },
        8: {
            name: "Corruption VIII: Drought",
            description: "More like California, am I right?",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[8]) + ". Effect: Offering EXP divided by " + format(droughtMultiplier[player.usedCorruptions[8]], 3),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[8]) + ". Effect: Offering EXP divided by " + format(droughtMultiplier[player.prototypeCorruptions[8]], 3),
            multiplier: "Current Score Multiplier: " + format(corruptionPointMultipliers[player.usedCorruptions[8]], 1) + " / Next Ascension Score Multiplier: " + format(corruptionPointMultipliers[player.prototypeCorruptions[8]], 1),
            spiritContribution: "This Ascension gives Rune Spirit Effect +" + format(4 * Math.pow(player.usedCorruptions[8],2),1) + "% / Next Ascension Rune Spirit Effect +" + format(4 * Math.pow(player.prototypeCorruptions[8],2),1) + "%", 
            image: "Pictures/Drought Lvl 7.png"
        },
        9: {
            name: "Corruption IX: Financial Recession",
            description: "2008.exe has stopped working.",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[9]) + ". Effect: Coin Gain ^" + format(financialcollapsePower[player.usedCorruptions[9]], 3),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[9]) + ". Effect: Coin Gain ^" + format(financialcollapsePower[player.prototypeCorruptions[9]], 3),
            multiplier: "Current Score Multiplier: " + format(corruptionPointMultipliers[player.usedCorruptions[9]], 1) + " / Next Ascension Score Multiplier: " + format(corruptionPointMultipliers[player.prototypeCorruptions[9]], 1),
            spiritContribution: "This Ascension gives Rune Spirit Effect +" + format(4 * Math.pow(player.usedCorruptions[9],2),1) + "% / Next Ascension Rune Spirit Effect +" + format(4 * Math.pow(player.prototypeCorruptions[9],2),1) + "%", 
            image: "Pictures/Financial Collapse Lvl 7.png"
        },
        10: {
            name: "CLEANSE THE CORRUPTION",
            description: "Free this world of sin.",
            current: "Reset all Corruptions to level 0 for your current ascension. Does not reset your current ascension.",
            planned: "Push that big 'Reset Corruptions' button to confirm your decision.",
            multiplier: "Note: if you need to do this, you may have bitten off more than you can chew.",
            spiritContribution: "",
            image: "Pictures/ExitCorruption.png"
        }
    }
    document.getElementById("corruptionName").textContent = corruptionTexts[index].name
    document.getElementById("corruptionDescription").textContent = corruptionTexts[index].description
    document.getElementById("corruptionLevelCurrent").textContent = corruptionTexts[index].current
    document.getElementById("corruptionLevelPlanned").textContent = corruptionTexts[index].planned
    document.getElementById("corruptionMultiplierContribution").textContent = corruptionTexts[index].multiplier
    document.getElementById("corruptionSpiritContribution").textContent = corruptionTexts[index].spiritContribution
    document.getElementById("corruptionSelectedPic").setAttribute("src", corruptionTexts[index].image)

    if (index < 10) {
        document.getElementById(`corrCurrent${index}`).textContent = format(player.usedCorruptions[index])
        document.getElementById(`corrNext${index}`).textContent = format(player.prototypeCorruptions[index])
    }
}

function corruptionStatsUpdate() {
    for (let i = 1; i <= 9; i++) {
        document.getElementById(`corrCurrent${i}`).textContent = format(player.usedCorruptions[i])
        document.getElementById(`corrNext${i}`).textContent = format(player.prototypeCorruptions[i])
    }
}

function corruptionButtonsAdd() {
    let rows = document.getElementsByClassName("corruptionStatRow");
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        let p = document.createElement("p");
        p.className = "corrDesc"
        let text = document.createTextNode("Current: ")
        p.appendChild(text)
        let span = document.createElement("span");
        span.id = `corrCurrent${i + 1}`;
        span.textContent = player.usedCorruptions[i + 1];
        p.appendChild(span);

        text = document.createTextNode(" / Next: ");
        p.appendChild(text);

        span = document.createElement("span");
        span.id = `corrNext${i + 1}`;
        span.textContent = player.prototypeCorruptions[i + 1];
        p.appendChild(span);
        row.appendChild(p);

        let btn;
        btn = document.createElement("button");
        btn.className = "corrBtn corruptionMax";
        btn.textContent = "+11";
        btn.onclick = () => toggleCorruptionLevel(i + 1, 11);
        row.appendChild(btn);

        btn = document.createElement("button");
        btn.className = "corrBtn corruptionUp";
        btn.textContent = "+1";
        btn.onclick = () => toggleCorruptionLevel(i + 1, 1);
        row.appendChild(btn);

        btn = document.createElement("button");
        btn.className = "corrBtn corruptionDown";
        btn.textContent = "-1";
        btn.onclick = () => toggleCorruptionLevel(i + 1, -1);
        row.appendChild(btn);

        btn = document.createElement("button");
        btn.className = "corrBtn corruptionReset";
        btn.textContent = "-11";
        btn.onclick = () => toggleCorruptionLevel(i + 1, -11);
        row.appendChild(btn);
        row.onclick = () => corruptionDisplay(i + 1)
    }
}

function corruptionLoadoutTableCreate() {
    let corrCount = 9
    let table = document.getElementById("corruptionLoadoutTable")
    for (let i = 0; i < Object.keys(player.corruptionLoadouts).length + 1; i++) {
        let row = table.insertRow()
        for (let j = 0; j <= corrCount; j++) {
            let cell = row.insertCell();
            if (j === 0) {
                cell.textContent = (i === 0) ? "Next:" : `Loadout ${i}:`;
            } else if (j <= corrCount) {
                cell.textContent = (i === 0) ? player.prototypeCorruptions[j] : player.corruptionLoadouts[i][j];
                cell.style.textAlign = "center"
            }
        }
        if (i === 0) continue;
        let cell = row.insertCell();
        let btn = document.createElement("button");
        btn.className = "corrSave"
        btn.textContent = "Save"
        btn.onclick = () => corruptionLoadoutSaveLoad(true, i);
        cell.appendChild(btn);

        cell = row.insertCell();
        btn = document.createElement("button");
        btn.className = "corrLoad"
        btn.textContent = "Load"
        btn.onclick = () => corruptionLoadoutSaveLoad(false, i);
        cell.appendChild(btn);
    }
}

function corruptionLoadoutTableUpdate(updateRow = 0) {
    let row = document.getElementById("corruptionLoadoutTable").rows[updateRow + 1].cells;
    for (let i = 0; i < row.length; i++) {
        if (i === 0 || i > 9) continue;
        row[i].textContent = (updateRow === 0) ? player.prototypeCorruptions[i] : player.corruptionLoadouts[updateRow][i];
    }
}

function corruptionLoadoutSaveLoad(save = true, loadout = 1) {
    if (save) {
        player.corruptionLoadouts[loadout] = Array.from(player.prototypeCorruptions)
        corruptionLoadoutTableUpdate(loadout)
    } else {
        player.prototypeCorruptions = Array.from(player.corruptionLoadouts[loadout])
        corruptionLoadoutTableUpdate(0)
        corruptionStatsUpdate()
    }
}

function corruptionCleanseConfirm() {
    document.getElementById("corruptionCleanseConfirm").style.visibility = "visible";
    let hide = () => document.getElementById("corruptionCleanseConfirm").style.visibility = "hidden";
    setTimeout(hide, 10000)
}