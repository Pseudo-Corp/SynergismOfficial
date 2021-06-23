import { player, format } from './Synergism';
import { Globals as G } from './Variables';
import { toggleCorruptionLevel } from './Toggles';
import { getElementById } from './Utility';

export const corruptionDisplay = (index: number) => {
    if (document.getElementById("corruptionDetails").style.visibility !== "visible") {
        document.getElementById("corruptionDetails").style.visibility = "visible"
    }
    if (document.getElementById("corruptionSelectedPic").style.visibility !== "visible") {
        document.getElementById("corruptionSelectedPic").style.visibility = "visible"
    }
    G['corruptionTrigger'] = index
    const currentExponent = ((index === 1 || index === 2) && player.usedCorruptions[index] >= 10) ? 1 + 0.05 * player.platonicUpgrades[17] : 1;
    const protoExponent = ((index === 1 || index === 2) && player.prototypeCorruptions[index] >= 10) ? 1 + 0.05 * player.platonicUpgrades[17] : 1;
    const corruptionTexts: Record<'name' | 'description' | 'current' | 'planned' | 'multiplier' | 'spiritContribution' | 'image', string>[] = [
        {
            name: "Corruption I: Divisiveness",
            description: "Your multipliers get disintegrated! Is extra devious without also using Maladaption Corruption",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[1]) + ". Effect: Free Mult Exponent ^" + format(G['divisivenessPower'][player.usedCorruptions[1]], 3),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[1]) + ". Effect: Free Multiplier Exponent ^" + format(G['divisivenessPower'][player.prototypeCorruptions[1]], 3),
            multiplier: "Current Score Multiplier: " + format(Math.pow(G['corruptionPointMultipliers'][player.usedCorruptions[1]], currentExponent), 1) + " / Next Ascension Score Multiplier: " + format(Math.pow(G['corruptionPointMultipliers'][player.prototypeCorruptions[1]], protoExponent), 1),
            spiritContribution: "This Ascension gives Rune Spirit Effect +" + format(4 * Math.pow(player.usedCorruptions[1],2),1) + "% / Next Ascension Rune Spirit Effect +" + format(4 * Math.pow(player.prototypeCorruptions[1],2),1) + "%", 
            image: "Pictures/Divisiveness Level 7.png"
        },
        {
            name: "Corruption II: Maladaption",
            description: "Insert Cool Text Here. Is extra devious without also using Divisiveness Corruption. Yin/Yang!",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[2]) + ". Effect: Free Accel. Exponent ^" + format(G['maladaptivePower'][player.usedCorruptions[2]], 3),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[2]) + ". Effect: Free Accelerator Exponent ^" + format(G['maladaptivePower'][player.prototypeCorruptions[2]], 3),
            multiplier: "Current Score Multiplier: " + format(Math.pow(G['corruptionPointMultipliers'][player.usedCorruptions[2]], currentExponent), 1) + " / Next Ascension Score Multiplier: " + format(Math.pow(G['corruptionPointMultipliers'][player.prototypeCorruptions[2]], protoExponent), 1),
            spiritContribution: "This Ascension gives Rune Spirit Effect +" + format(4 * Math.pow(player.usedCorruptions[2],2),1) + "% / Next Ascension Rune Spirit Effect +" + format(4 * Math.pow(player.prototypeCorruptions[2],2),1) + "%", 
            image: "Pictures/Maladaption Lvl 7.png"
        },
        {
            name: "Corruption III: Spacial Dilation",
            description: "Way to go, Albert.",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[3]) + ". Effect: Time Speed is divided by " + format(1 / G['lazinessMultiplier'][player.usedCorruptions[3]], 5),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[3]) + ". Effect: Time is divided by " + format(1 / G['lazinessMultiplier'][player.prototypeCorruptions[3]], 5),
            multiplier: "Current Score Multiplier: " + format(G['corruptionPointMultipliers'][player.usedCorruptions[3]], 1) + " / Next Ascension Score Multiplier: " + format(G['corruptionPointMultipliers'][player.prototypeCorruptions[3]], 1),
            spiritContribution: "This Ascension gives Rune Spirit Effect +" + format(4 * Math.pow(player.usedCorruptions[3],2),1) + "% / Next Ascension Rune Spirit Effect +" + format(4 * Math.pow(player.prototypeCorruptions[3],2),1) + "%", 
            image: "Pictures/Laziness Lvl 7.png"
        },
        {
            name: "Corruption IV: Hyperchallenged",
            description: "What's in a challenge?",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[4]) + ". Effect: Challenge Exponent Reqs.  x" + format(G['hyperchallengedMultiplier'][player.usedCorruptions[4]], 3),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[4]) + ". Effect: Challenge Exponent Reqs.  x" + format(G['hyperchallengedMultiplier'][player.prototypeCorruptions[4]], 3),
            multiplier: "Current Score Multiplier: " + format(G['corruptionPointMultipliers'][player.usedCorruptions[4]], 1) + " / Next Ascension Score Multiplier: " + format(G['corruptionPointMultipliers'][player.prototypeCorruptions[4]], 1),
            spiritContribution: "This Ascension gives Rune Spirit Effect +" + format(4 * Math.pow(player.usedCorruptions[4],2),1) + "% / Next Ascension Rune Spirit Effect +" + format(4 * Math.pow(player.prototypeCorruptions[4],2),1) + "%", 
            image: "Pictures/Hyperchallenged Lvl 7.png"
        },
        {
            name: "Corruption V: Scientific Illiteracy",
            description: "Maybe Albert wouldn't have theorized Dilation after all.",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[5]) + ". Effect: Obtainium gain ^" + format(G['illiteracyPower'][player.usedCorruptions[5]], 3),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[5]) + ". Effect: Obtainium gain ^" + format(G['illiteracyPower'][player.prototypeCorruptions[5]], 3),
            multiplier: "Current Score Multiplier: " + format(G['corruptionPointMultipliers'][player.usedCorruptions[5]], 1) + " / Next Ascension Score Multiplier: " + format(G['corruptionPointMultipliers'][player.prototypeCorruptions[5]], 1),
            spiritContribution: "This Ascension gives Rune Spirit Effect +" + format(4 * Math.pow(player.usedCorruptions[5],2),1) + "% / Next Ascension Rune Spirit Effect +" + format(4 * Math.pow(player.prototypeCorruptions[5],2),1) + "%", 
            image: "Pictures/Scientific Illiteracy Lvl 7.png"
        },
        {
            name: "Corruption VI: Market Deflation",
            description: "Diamond Mine destroyed... no more monopolies!",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[6]) + ". Effect: Diamond gain ^1/" + format(1 / G['deflationMultiplier'][player.usedCorruptions[6]], 2),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[6]) + ". Effect: Diamond gain ^1/" + format(1 / G['deflationMultiplier'][player.prototypeCorruptions[6]], 2),
            multiplier: "Current Score Multiplier: " + format(G['corruptionPointMultipliers'][player.usedCorruptions[6]], 1) + " / Next Ascension Score Multiplier: " + format(G['corruptionPointMultipliers'][player.prototypeCorruptions[6]], 1),
            spiritContribution: "This Ascension gives Rune Spirit Effect +" + format(4 * Math.pow(player.usedCorruptions[6],2),1) + "% / Next Ascension Rune Spirit Effect +" + format(4 * Math.pow(player.prototypeCorruptions[6],2),1) + "%", 
            image: "Pictures/Deflation Lvl 7.png"
        },
        {
            name: "Corruption VII: Extinction",
            description: "It killed the dinosaurs too, ya dingus.",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[7]) + ". Effect: Ant Production ^" + format(G['extinctionMultiplier'][player.usedCorruptions[7]], 3),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[7]) + ". Effect: Ant Production ^" + format(G['extinctionMultiplier'][player.prototypeCorruptions[7]], 3),
            multiplier: "Current Score Multiplier: " + format(G['corruptionPointMultipliers'][player.usedCorruptions[7]], 1) + " / Next Ascension Score Multiplier: " + format(G['corruptionPointMultipliers'][player.prototypeCorruptions[7]], 1),
            spiritContribution: "This Ascension gives Rune Spirit Effect +" + format(4 * Math.pow(player.usedCorruptions[7],2),1) + "% / Next Ascension Rune Spirit Effect +" + format(4 * Math.pow(player.prototypeCorruptions[7],2),1) + "%", 
            image: "Pictures/Extinction Lvl 7.png"
        },
        {
            name: "Corruption VIII: Drought",
            description: "More like California, am I right?",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[8]) + ". Effect: Offering EXP divided by " + format(G['droughtMultiplier'][player.usedCorruptions[8]], 3),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[8]) + ". Effect: Offering EXP divided by " + format(G['droughtMultiplier'][player.prototypeCorruptions[8]], 3),
            multiplier: "Current Score Multiplier: " + format(G['corruptionPointMultipliers'][player.usedCorruptions[8]], 1) + " / Next Ascension Score Multiplier: " + format(G['corruptionPointMultipliers'][player.prototypeCorruptions[8]], 1),
            spiritContribution: "This Ascension gives Rune Spirit Effect +" + format(4 * Math.pow(player.usedCorruptions[8],2),1) + "% / Next Ascension Rune Spirit Effect +" + format(4 * Math.pow(player.prototypeCorruptions[8],2),1) + "%", 
            image: "Pictures/Drought Lvl 7.png"
        },
        {
            name: "Corruption IX: Financial Recession",
            description: "2008.exe has stopped working.",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[9]) + ". Effect: Coin Gain ^" + format(G['financialcollapsePower'][player.usedCorruptions[9]], 3),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[9]) + ". Effect: Coin Gain ^" + format(G['financialcollapsePower'][player.prototypeCorruptions[9]], 3),
            multiplier: "Current Score Multiplier: " + format(G['corruptionPointMultipliers'][player.usedCorruptions[9]], 1) + " / Next Ascension Score Multiplier: " + format(G['corruptionPointMultipliers'][player.prototypeCorruptions[9]], 1),
            spiritContribution: "This Ascension gives Rune Spirit Effect +" + format(4 * Math.pow(player.usedCorruptions[9],2),1) + "% / Next Ascension Rune Spirit Effect +" + format(4 * Math.pow(player.prototypeCorruptions[9],2),1) + "%", 
            image: "Pictures/Financial Collapse Lvl 7.png"
        },
        {
            name: "CLEANSE THE CORRUPTION",
            description: "Free this world of sin.",
            current: "Reset all Corruptions to level 0 for your current ascension. Does not reset your current ascension.",
            planned: "Push that big 'Reset Corruptions' button to confirm your decision.",
            multiplier: "Note: if you need to do this, you may have bitten off more than you can chew.",
            spiritContribution: "",
            image: "Pictures/ExitCorruption.png"
        }
    ];
    const text = corruptionTexts[index-1];
    document.getElementById("corruptionName").textContent = text.name
    document.getElementById("corruptionDescription").textContent = text.description
    document.getElementById("corruptionLevelCurrent").textContent = text.current
    document.getElementById("corruptionLevelPlanned").textContent = text.planned
    document.getElementById("corruptionMultiplierContribution").textContent = text.multiplier
    document.getElementById("corruptionSpiritContribution").textContent = text.spiritContribution
    document.getElementById("corruptionSelectedPic").setAttribute("src", text.image)

    if (index < 10) {
        document.getElementById(`corrCurrent${index}`).textContent = format(player.usedCorruptions[index])
        document.getElementById(`corrNext${index}`).textContent = format(player.prototypeCorruptions[index])
    }
}

export const corruptionStatsUpdate = () => {
    for (let i = 1; i <= 9; i++) {
        // https://discord.com/channels/677271830838640680/706329553639047241/841749032841379901
        const a = document.getElementById(`corrCurrent${i}`);
        const b = document.getElementById(`corrNext${i}`)
        if (a) a.textContent = format(player.usedCorruptions[i])
        else console.log(`Send to Platonic: corrCurrent${i} is null`);
        if (b) b.textContent = format(player.prototypeCorruptions[i])
        else console.log(`Send to Platonic: corrNext${i} is null`);
    }
}

export const corruptionButtonsAdd = () => {
    const rows = document.getElementsByClassName("corruptionStatRow");
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const p = document.createElement("p");
        p.className = "corrDesc"
        let text = document.createTextNode("Current: ")
        p.appendChild(text)
        let span = document.createElement("span");
        span.id = `corrCurrent${i + 1}`;
        span.textContent = player.usedCorruptions[i + 1] + '';
        p.appendChild(span);

        text = document.createTextNode(" / Next: ");
        p.appendChild(text);

        span = document.createElement("span");
        span.id = `corrNext${i + 1}`;
        span.textContent = player.prototypeCorruptions[i + 1] + '';
        p.appendChild(span);
        row.appendChild(p);

        let btn;
        btn = document.createElement("button");
        btn.className = "corrBtn corruptionMax";
        btn.textContent = "+13";
        btn.onclick = () => toggleCorruptionLevel(i + 1, 13);
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
        btn.textContent = "-13";
        btn.addEventListener('click', () => toggleCorruptionLevel(i + 1, -13));
        row.appendChild(btn);
        row.addEventListener('click', () => corruptionDisplay(i + 1));
    }
}

export const corruptionLoadoutTableCreate = () => {
    const corrCount = 9
    const table = getElementById<HTMLTableElement>("corruptionLoadoutTable")
    for (let i = 0; i < Object.keys(player.corruptionLoadouts).length + 1; i++) {
        const row = table.insertRow()
        for (let j = 0; j <= corrCount; j++) {
            const cell = row.insertCell();
            if (j === 0) {
                cell.textContent = (i === 0) ? "Next:" : `Loadout ${i}:`;
            } else if (j <= corrCount) {
                cell.textContent = ((i === 0) ? player.prototypeCorruptions[j] : player.corruptionLoadouts[i][j]).toString();
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

export const corruptionLoadoutTableUpdate = (updateRow = 0) => {
    const row = getElementById<HTMLTableElement>("corruptionLoadoutTable").rows[updateRow + 1].cells;
    for (let i = 1; i < row.length; i++) {
        if (i > 9) break;
        row[i].textContent = ((updateRow === 0) ? player.prototypeCorruptions[i] : player.corruptionLoadouts[updateRow][i]).toString();
    }
}

const corruptionLoadoutSaveLoad = (save = true, loadout = 1) => {
    if (save) {
        player.corruptionLoadouts[loadout] = Array.from(player.prototypeCorruptions)
        corruptionLoadoutTableUpdate(loadout)
    } else {
        player.prototypeCorruptions = Array.from(player.corruptionLoadouts[loadout])
        corruptionLoadoutTableUpdate()
        corruptionStatsUpdate();
    }
}

export const corruptionCleanseConfirm = () => {
    const corrupt = document.getElementById('corruptionCleanseConfirm');
    corrupt.style.visibility = 'visible';
    setTimeout(() => corrupt.style.visibility = 'hidden', 10000);
}