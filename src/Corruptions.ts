import { player, format } from './Synergism';
import { Globals as G } from './Variables';
import { toggleCorruptionLevel } from './Toggles';
import { getElementById } from './Utility';
import { Alert, Prompt } from "./UpdateHTML";
import { DOMCacheGetOrSet } from './Cache/DOM';

//

export const maxCorruptionLevel = () => {
    let max = 0
    
    if (player.challengecompletions[11] > 0)
        max += 5
    if (player.challengecompletions[12] > 0)
        max += 2
    if (player.challengecompletions[13] > 0)
        max += 2
    if (player.challengecompletions[14] > 0)
        max += 2
    if (player.platonicUpgrades[5] > 0)
        max += 1
    if (player.platonicUpgrades[10] > 0)
        max += 1
    if (player.singularityUpgrades.corruptionFourteen.level > 0)
        max += 1
    
    return max
}

export const corruptionDisplay = (index: number) => {
    console.log(`corr: ${index}`)
    if (DOMCacheGetOrSet("corruptionDetails").style.visibility !== "visible") {
        DOMCacheGetOrSet("corruptionDetails").style.visibility = "visible"
    }
    if (DOMCacheGetOrSet("corruptionSelectedPic").style.visibility !== "visible") {
        DOMCacheGetOrSet("corruptionSelectedPic").style.visibility = "visible"
    }
    G['corruptionTrigger'] = index
    const currentExponent = ((index === 2) && player.usedCorruptions[index] >= 10) ? 1 + 0.04 * player.platonicUpgrades[17] + 2 * Math.min(1, player.platonicUpgrades[17]) : 1;
    const protoExponent = ((index === 2) && player.prototypeCorruptions[index] >= 10) ? 1 + 0.04 * player.platonicUpgrades[17] + 2 * Math.min(1, player.platonicUpgrades[17]) : 1;
    const [bonusLevel, bonusText] = (player.singularityUpgrades.corruptionFifteen.level > 0) ? [1, " [+1]"] : [0, ""];
    const corruptionTexts: Record<'name' | 'description' | 'current' | 'planned' | 'multiplier' | 'spiritContribution' | 'image', string>[] = [
        {
            name: "Corruption I: Viscosity",
            description: "You feel lethargic across the universe...",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[2]) + bonusText + ". Effect: Free Accel. and Multipliers Exponent ^" + format(G['maladaptivePower'][player.usedCorruptions[2]], 3),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[2]) + bonusText + ". Effect: Free Accelerator and Multipliers Exponent ^" + format(G['maladaptivePower'][player.prototypeCorruptions[2]], 3),
            multiplier: "Current Score Multiplier: " + format(Math.pow(G['corruptionPointMultipliers'][player.usedCorruptions[2] + bonusLevel], currentExponent), 1) + " / Next Ascension Score Multiplier: " + format(Math.pow(G['corruptionPointMultipliers'][player.prototypeCorruptions[2] + bonusLevel], protoExponent), 1),
            spiritContribution: "This Ascension gives Rune Spirit Effect +" + format(4 * Math.pow(player.usedCorruptions[2] + bonusLevel,2),1) + "% / Next Ascension Rune Spirit Effect +" + format(4 * Math.pow(player.prototypeCorruptions[2] + bonusLevel,2),1) + "%", 
            image: "Pictures/Maladaption Lvl 7.png"
        },
        {
            name: "Corruption II: Spacial Dilation",
            description: "Way to go, Albert.",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[3]) + bonusText + ". Effect: Time Speed is divided by " + format(1 / G['lazinessMultiplier'][player.usedCorruptions[3]], 5),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[3]) + bonusText + ". Effect: Time is divided by " + format(1 / G['lazinessMultiplier'][player.prototypeCorruptions[3]], 5),
            multiplier: "Current Score Multiplier: " + format(G['corruptionPointMultipliers'][player.usedCorruptions[3] + bonusLevel], 1) + " / Next Ascension Score Multiplier: " + format(G['corruptionPointMultipliers'][player.prototypeCorruptions[3] + bonusLevel], 1),
            spiritContribution: "This Ascension gives Rune Spirit Effect +" + format(4 * Math.pow(player.usedCorruptions[3] + bonusLevel,2),1) + "% / Next Ascension Rune Spirit Effect +" + format(4 * Math.pow(player.prototypeCorruptions[3] + bonusLevel,2),1) + "%", 
            image: "Pictures/Laziness Lvl 7.png"
        },
        {
            name: "Corruption III: Hyperchallenged",
            description: "What's in a challenge?",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[4]) + bonusText + ". Effect: Challenge Exponent Reqs.  x" + format(G['hyperchallengedMultiplier'][player.usedCorruptions[4]], 3),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[4]) + bonusText + ". Effect: Challenge Exponent Reqs.  x" + format(G['hyperchallengedMultiplier'][player.prototypeCorruptions[4]], 3),
            multiplier: "Current Score Multiplier: " + format(G['corruptionPointMultipliers'][player.usedCorruptions[4] + bonusLevel], 1) + " / Next Ascension Score Multiplier: " + format(G['corruptionPointMultipliers'][player.prototypeCorruptions[4] + bonusLevel], 1),
            spiritContribution: "This Ascension gives Rune Spirit Effect +" + format(4 * Math.pow(player.usedCorruptions[4] + bonusLevel,2),1) + "% / Next Ascension Rune Spirit Effect +" + format(4 * Math.pow(player.prototypeCorruptions[4] + bonusLevel,2),1) + "%", 
            image: "Pictures/Hyperchallenged Lvl 7.png"
        },
        {
            name: "Corruption IV: Scientific Illiteracy",
            description: "Maybe Albert wouldn't have theorized Dilation after all.",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[5]) + bonusText + ". Effect: Obtainium gain ^" + format(G['illiteracyPower'][player.usedCorruptions[5]], 3),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[5]) + bonusText + ". Effect: Obtainium gain ^" + format(G['illiteracyPower'][player.prototypeCorruptions[5]], 3),
            multiplier: "Current Score Multiplier: " + format(G['corruptionPointMultipliers'][player.usedCorruptions[5] + bonusLevel], 1) + " / Next Ascension Score Multiplier: " + format(G['corruptionPointMultipliers'][player.prototypeCorruptions[5] + bonusLevel], 1),
            spiritContribution: "This Ascension gives Rune Spirit Effect +" + format(4 * Math.pow(player.usedCorruptions[5] + bonusLevel,2),1) + "% / Next Ascension Rune Spirit Effect +" + format(4 * Math.pow(player.prototypeCorruptions[5] + bonusLevel,2),1) + "%", 
            image: "Pictures/Scientific Illiteracy Lvl 7.png"
        },
        {
            name: "Corruption V: Market Deflation",
            description: "Diamond Mine destroyed... no more monopolies!",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[6]) + bonusText + ". Effect: Diamond gain ^1/" + format(1 / G['deflationMultiplier'][player.usedCorruptions[6]], 2),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[6]) + bonusText + ". Effect: Diamond gain ^1/" + format(1 / G['deflationMultiplier'][player.prototypeCorruptions[6]], 2),
            multiplier: "Current Score Multiplier: " + format(G['corruptionPointMultipliers'][player.usedCorruptions[6] + bonusLevel], 1) + " / Next Ascension Score Multiplier: " + format(G['corruptionPointMultipliers'][player.prototypeCorruptions[6] + bonusLevel], 1),
            spiritContribution: "This Ascension gives Rune Spirit Effect +" + format(4 * Math.pow(player.usedCorruptions[6] + bonusLevel,2),1) + "% / Next Ascension Rune Spirit Effect +" + format(4 * Math.pow(player.prototypeCorruptions[6] + bonusLevel,2),1) + "%", 
            image: "Pictures/Deflation Lvl 7.png"
        },
        {
            name: "Corruption VI: Extinction",
            description: "It killed the dinosaurs too, ya dingus.",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[7]) + bonusText + ". Effect: Ant Production ^" + format(G['extinctionMultiplier'][player.usedCorruptions[7]], 3),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[7]) + bonusText + ". Effect: Ant Production ^" + format(G['extinctionMultiplier'][player.prototypeCorruptions[7]], 3),
            multiplier: "Current Score Multiplier: " + format(G['corruptionPointMultipliers'][player.usedCorruptions[7] + bonusLevel], 1) + " / Next Ascension Score Multiplier: " + format(G['corruptionPointMultipliers'][player.prototypeCorruptions[7] + bonusLevel], 1),
            spiritContribution: "This Ascension gives Rune Spirit Effect +" + format(4 * Math.pow(player.usedCorruptions[7] + bonusLevel,2),1) + "% / Next Ascension Rune Spirit Effect +" + format(4 * Math.pow(player.prototypeCorruptions[7] + bonusLevel,2),1) + "%", 
            image: "Pictures/Extinction Lvl 7.png"
        },
        {
            name: "Corruption VII: Drought",
            description: "More like California, am I right?",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[8]) + bonusText + ". Effect: Offering EXP divided by " + format(G['droughtMultiplier'][player.usedCorruptions[8]], 3),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[8]) + bonusText + ". Effect: Offering EXP divided by " + format(G['droughtMultiplier'][player.prototypeCorruptions[8]], 3),
            multiplier: "Current Score Multiplier: " + format(G['corruptionPointMultipliers'][player.usedCorruptions[8] + bonusLevel], 1) + " / Next Ascension Score Multiplier: " + format(G['corruptionPointMultipliers'][player.prototypeCorruptions[8] + bonusLevel], 1),
            spiritContribution: "This Ascension gives Rune Spirit Effect +" + format(4 * Math.pow(player.usedCorruptions[8] + bonusLevel,2),1) + "% / Next Ascension Rune Spirit Effect +" + format(4 * Math.pow(player.prototypeCorruptions[8] + bonusLevel,2),1) + "%", 
            image: "Pictures/Drought Lvl 7.png"
        },
        {
            name: "Corruption VIII: Financial Recession",
            description: "2008.exe has stopped working.",
            current: "On this Ascension, this corruption is level " + format(player.usedCorruptions[9]) + bonusText + ". Effect: Coin Gain ^" + format(G['financialcollapsePower'][player.usedCorruptions[9]], 3),
            planned: "On next Ascension, this corruption will be level " + format(player.prototypeCorruptions[9]) + bonusText + ". Effect: Coin Gain ^" + format(G['financialcollapsePower'][player.prototypeCorruptions[9]], 3),
            multiplier: "Current Score Multiplier: " + format(G['corruptionPointMultipliers'][player.usedCorruptions[9] + bonusLevel], 1) + " / Next Ascension Score Multiplier: " + format(G['corruptionPointMultipliers'][player.prototypeCorruptions[9] + bonusLevel], 1),
            spiritContribution: "This Ascension gives Rune Spirit Effect +" + format(4 * Math.pow(player.usedCorruptions[9] + bonusLevel,2),1) + "% / Next Ascension Rune Spirit Effect +" + format(4 * Math.pow(player.prototypeCorruptions[9] + bonusLevel,2),1) + "%", 
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
    const text = corruptionTexts[index-2];
    DOMCacheGetOrSet("corruptionName").textContent = text.name
    DOMCacheGetOrSet("corruptionDescription").textContent = text.description
    DOMCacheGetOrSet("corruptionLevelCurrent").textContent = text.current
    DOMCacheGetOrSet("corruptionLevelPlanned").textContent = text.planned
    DOMCacheGetOrSet("corruptionMultiplierContribution").textContent = text.multiplier
    DOMCacheGetOrSet("corruptionSpiritContribution").textContent = text.spiritContribution
    DOMCacheGetOrSet("corruptionSelectedPic").setAttribute("src", text.image)

    if (index < 10) {
        DOMCacheGetOrSet(`corrCurrent${index}`).textContent = format(player.usedCorruptions[index])
        DOMCacheGetOrSet(`corrNext${index}`).textContent = format(player.prototypeCorruptions[index])
    }
}

export const corruptionStatsUpdate = () => {
    for (let i = 2; i <= 9; i++) {
        // https://discord.com/channels/677271830838640680/706329553639047241/841749032841379901
        const a = DOMCacheGetOrSet(`corrCurrent${i}`);
        const b = DOMCacheGetOrSet(`corrNext${i}`)
        a.textContent = format(player.usedCorruptions[i])
        b.textContent = format(player.prototypeCorruptions[i])
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
        span.id = `corrCurrent${i+2}`;
        span.textContent = `${player.usedCorruptions[i+2]}`;
        p.appendChild(span);

        text = document.createTextNode(" / Next: ");
        p.appendChild(text);

        span = document.createElement("span");
        span.id = `corrNext${i+2}`;
        span.textContent = `${player.prototypeCorruptions[i+2]}`;
        p.appendChild(span);
        row.appendChild(p);

        let btn;
        btn = document.createElement("button");
        btn.className = "corrBtn corruptionMax";
        btn.textContent = `+MAX`;
        btn.onclick = () => toggleCorruptionLevel(i + 2, 99);
        row.appendChild(btn);

        btn = document.createElement("button");
        btn.className = "corrBtn corruptionUp";
        btn.textContent = "+1";
        btn.onclick = () => toggleCorruptionLevel(i + 2, 1);
        row.appendChild(btn);

        btn = document.createElement("button");
        btn.className = "corrBtn corruptionDown";
        btn.textContent = "-1";
        btn.onclick = () => toggleCorruptionLevel(i + 2, -1);
        row.appendChild(btn);

        btn = document.createElement("button");
        btn.className = "corrBtn corruptionReset";
        btn.textContent = `-MAX`;
        btn.addEventListener('click', () => toggleCorruptionLevel(i + 2, -99));
        row.appendChild(btn);
        row.addEventListener('click', () => corruptionDisplay(i + 2));
    }
}

export const corruptionLoadoutTableCreate = () => {
    const corrCount = 8
    const table = getElementById<HTMLTableElement>("corruptionLoadoutTable")

    for (let i = 0; i < Object.keys(player.corruptionLoadouts).length + 1; i++) {
        const row = table.insertRow()
        for (let j = 0; j <= corrCount; j++) {
            const cell = row.insertCell();
            cell.className = `test${j}`
            if (j === 0) {
                if (i === 0) cell.textContent = 'Next:'
                // Other loadout names are updated after player load in Synergism.ts > loadSynergy
            } else if (j <= corrCount) {
                // start two-indexed (WTF!)
                cell.textContent = ((i === 0) ? player.prototypeCorruptions[j+1] : player.corruptionLoadouts[i][j+1]).toString();
                cell.style.textAlign = "center"
            }
        }
        if (i === 0) {
            let cell = row.insertCell();
            //empty

            cell = row.insertCell();
            const btn = document.createElement("button");
            btn.className = "corrLoad"
            btn.textContent = "Zero"
            btn.onclick = () => corruptionLoadoutSaveLoad(false, i);
            cell.appendChild(btn);
            cell.title = "Reset corruptions to zero on your next ascension"
        }
        else {
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
}

export const corruptionLoadoutTableUpdate = (updateRow = 0) => {
    const row = getElementById<HTMLTableElement>("corruptionLoadoutTable").rows[updateRow + 1].cells;
    for (let i = 1; i < row.length; i++) {
        if (i > 8) break;
        row[i].textContent = ((updateRow === 0) ? player.prototypeCorruptions[i+1] : player.corruptionLoadouts[updateRow][i+1]).toString();
    }
}

const corruptionLoadoutSaveLoad = (save = true, loadout = 1) => {
    if (save) {
        player.corruptionLoadouts[loadout] = Array.from(player.prototypeCorruptions)
        corruptionLoadoutTableUpdate(loadout)
    } else {
        if (loadout === 0) {
            player.prototypeCorruptions = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
        else {
            player.prototypeCorruptions = Array.from(player.corruptionLoadouts[loadout])
        }
        corruptionLoadoutTableUpdate()
        corruptionStatsUpdate();
    }
}

async function corruptionLoadoutGetNewName(loadout = 0) {
    const maxChars = 9
    // eslint-disable-next-line
    const regex = /^[\x00-\xFF]*$/
    const renamePrompt = await Prompt(
        `What would you like to name Loadout ${loadout + 1}? ` +
        `Names cannot be longer than ${maxChars} characters. Nothing crazy!`
    );
   
    if (!renamePrompt) {
        return Alert('Okay, maybe next time.');
    }
    else if (renamePrompt.length > maxChars) {
        return Alert('The name you provided is too long! Try again.')
    }
    else if (!regex.test(renamePrompt)) {
        return Alert("The Loadout Renamer didn't like a character in your name! Try something else.")
    }
    else {
        player.corruptionLoadoutNames[loadout] = renamePrompt
        updateCorruptionLoadoutNames();
    }
}

export const updateCorruptionLoadoutNames = () => {
    const rows = getElementById<HTMLTableElement>("corruptionLoadoutTable").rows
    for (let i = 0; i < Object.keys(player.corruptionLoadouts).length; i++) {
        const cells = rows[i + 2].cells  //start changes on 2nd row
        if (cells[0].textContent!.length === 0) {  //first time setup

            cells[0].addEventListener('click', () => void corruptionLoadoutGetNewName(i)); //get name function handles -1 for array
            cells[0].classList.add('corrLoadoutName');
        }
        cells[0].textContent = `${player.corruptionLoadoutNames[i]}:`;
    }    
}

export const corruptionCleanseConfirm = () => {
    const corrupt = DOMCacheGetOrSet('corruptionCleanseConfirm');
    corrupt.style.visibility = 'visible';
    setTimeout(() => corrupt.style.visibility = 'hidden', 10000);
}

export const revealCorruptions = () => {
    const corruptions = document.getElementsByClassName("corruptionStatRow") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < corruptions.length; i ++) {
        corruptions[i].style.display = 'none'
    }

    const c11Unlocks = document.getElementsByClassName("chal11Corruption") as HTMLCollectionOf<HTMLElement>;
    const c12Unlocks = document.getElementsByClassName("chal12Corruption") as HTMLCollectionOf<HTMLElement>;
    const c13Unlocks = document.getElementsByClassName("chal13Corruption") as HTMLCollectionOf<HTMLElement>;
    const c14Unlocks = document.getElementsByClassName("chal14Corruption") as HTMLCollectionOf<HTMLElement>;

    if (player.challengecompletions[11] > 0) {
        for (let i = 0; i < c11Unlocks.length; i++) {
            c11Unlocks[i].style.display = 'flex'
        }
    }
    if (player.challengecompletions[12] > 0) {
        for (let i = 0; i < c12Unlocks.length; i++) {
            c12Unlocks[i].style.display = 'flex'
        }
    }
    if (player.challengecompletions[13] > 0) {
        for (let i = 0; i < c13Unlocks.length; i++) {
            c13Unlocks[i].style.display = 'flex'
        }
    }
    if (player.challengecompletions[14] > 0) {
        for (let i = 0; i < c14Unlocks.length; i++) {
            c14Unlocks[i].style.display = 'flex'
        }
    }
}