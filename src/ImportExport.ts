import { player, saveSynergy, blankSave, clearInt, format, intervalHold, constantIntervals, createTimer, loadSynergy, isTesting } from './Synergism';
import { getElementById } from './Utility';
import LZString from 'lz-string';
import { achievementaward } from './Achievements';
import { Globals as G } from './Variables';
import { Player } from './types/Synergism';
import { Synergism } from './Events';
import { Alert, Prompt } from './UpdateHTML';

const format24 = new Intl.DateTimeFormat("EN-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    second: "2-digit"
})
const format12 = new Intl.DateTimeFormat("EN-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: true,
    minute: "2-digit",
    second: "2-digit"
})

const getRealTime = (use12 = false) => {
    const format = use12 ? format12 : format24;
    const dateParts = Object.assign({}, ...format
        .formatToParts(new Date())
        .filter((x) => x.type !== "literal")
        .map(p => ({ [p.type]: p.value }))
    );
        
    const period = use12 ? ` ${dateParts.dayPeriod.toUpperCase()}` : '';
    return `${dateParts.year}-${dateParts.month}-${dateParts.day} ${dateParts.hour}_${dateParts.minute}_${dateParts.second}${period}`;
}

export const updateSaveString = () => {
    player.saveString = getElementById<HTMLInputElement>("saveStringInput").value
}

const saveFilename = () => {
    const s = player.saveString
    const t = s.replace(/\$(.*?)\$/g, (_, b) => {
        switch (b) {
            case 'VERSION': return `v${player.version}`;
            case 'TIME': return getRealTime();
            case 'TIME12': return getRealTime(true);
        }
    });

    return t;
}

export const exportSynergism = async () => {
    player.offlinetick = Date.now();
    if (player.quarkstimer >= 3600) {
        player.worlds += (Math.floor(player.quarkstimer / 3600) * (1 + player.researches[99] + player.researches[100] + G['talisman7Quarks'] + player.researches[125] + player.researches[180] + player.researches[195]));
        player.quarkstimer = (player.quarkstimer % 3600)
    }
    // set attribute to 0, turn tab back to white
    document.getElementById('settingstab').setAttribute('full', '0');

    saveSynergy();

    const toClipboard = getElementById<HTMLInputElement>('saveType').checked;
    const save = localStorage.getItem('Synergysave2');
    if ('clipboard' in navigator && toClipboard) {
        await navigator.clipboard.writeText(save)
            .catch(e => console.error(e));
    } else if (toClipboard) {
        // Old browsers (legacy Edge, Safari 13.0)
        const textArea = document.createElement('textarea');
        textArea.value = save;
        textArea.setAttribute('style', 'top: 0; left: 0; position: fixed;');

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
        } catch (_) {
            console.error("Failed to copy savegame to clipboard.");
        }

        document.body.removeChild(textArea);
    } else {
        const a = document.createElement('a');
        a.setAttribute('href', 'data:text/plain;charset=utf-8,' + save);
        a.setAttribute('download', saveFilename());
        a.setAttribute('id', 'downloadSave');
        // "Starting in Firefox 75, the click() function works even when the element is not attached to a DOM tree."
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/click
        // so let's have it work on older versions of Firefox, doesn't change functionality.
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    document.getElementById("exportinfo").textContent = toClipboard
        ? 'Copied save to your clipboard!'
        : 'Savefile copied to file!';
}

export const resetGame = async () => {
    const a = window.crypto.getRandomValues(new Uint16Array(1))[0] % 16;
    const b = window.crypto.getRandomValues(new Uint16Array(1))[0] % 16;

    const result = await Prompt(`Answer the question to confirm you'd like to reset: what is ${a}+${b}? (Hint: ${a+b})`)
    if (+result !== a + b) {
        return Alert(`Answer was wrong, not resetting!`);
    }

    const hold = Object.assign({}, blankSave, {
        codes: Array.from(blankSave.codes)
    });

    importSynergism(btoa(JSON.stringify(hold)));
}

export const importSynergism = (input: string) => {
    const d = LZString.decompressFromBase64(input);
    const f: Player = d ? JSON.parse(d) : JSON.parse(atob(input));

    if (
        (f.exporttest === "YES!" || f.exporttest === true) ||
        (f.exporttest === false && isTesting) ||
        (f.exporttest === 'NO!' && isTesting)
    ) {
        // tested: this does loop over the items before clearing them (Firefox)
        intervalHold.forEach(v => clearInt(v));
        intervalHold.clear();
        localStorage.setItem('Synergysave2', btoa(JSON.stringify(f)));
        
        constantIntervals();
        createTimer();
        loadSynergy();
    } else {
        return Alert(`You are attempting to load a testing file in a non-testing version!`);
    }
}

export const promocodes = async () => {
    const input = await Prompt('Got a code? Great! Enter it in (CaSe SeNsItIvE).');
    const el = document.getElementById("promocodeinfo");

    if (input === "synergism2020" && !player.codes.get(1)) {
        player.codes.set(1, true);
        player.runeshards += 25;
        player.worlds += 50;
        el.textContent = "Promo Code 'synergism2020' Applied! +25 Offerings, +50 Quarks"
    } else if (input === ":unsmith:" && player.achievements[243] < 1) {
        achievementaward(243);
        el.textContent = "It's Spaghetti Time! [Awarded an achievement!!!]";
    } else if (input === ":antismith:" && player.achievements[244] < 1) {
        achievementaward(244);
        el.textContent = "Hey, isn't this just a reference to Antimatter Dimensions? Shh. [Awarded an achievement!!!]";
    } else if(input === 'Khafra' && !player.codes.get(26)) {
        player.codes.set(26, true);
        const quarks = Math.floor(Math.random() * (400 - 100 + 1) + 100);
        player.worlds += quarks;
        el.textContent = 'Khafra has blessed you with ' + quarks + ' quarks!';
    } else if(input === 'november13' && !player.codes.get(27)) {
        player.codes.set(27, true);
        player.worlds += 300;
        el.textContent = 'Be careful, on friday the thirteenth! [+300 Quarks]';
    } else if(input === '2million' && !player.codes.get(28)) {
        player.codes.set(28, true);
        player.worlds += 700;
        el.textContent = 'Thank you for 2 million plays on kongregate!';
    } else if(input === 'version2.1.0' && !player.codes.get(29)) {
        player.codes.set(29, true);
        let quarkCounter = 250;
        if(player.challengecompletions[11] > 0 || player.highestchallengecompletions[11] >0){
            quarkCounter += 250;
        }
        if(player.challengecompletions[12] > 0 || player.highestchallengecompletions[12] >0){
            quarkCounter += 250;
        }
        if(player.challengecompletions[13] > 0 || player.highestchallengecompletions[13] >0){
            quarkCounter += 500;
        }
        if(player.challengecompletions[14] > 0 || player.highestchallengecompletions[14] >0){
            quarkCounter += 500;
        }
        if(player.challengecompletions[13] >= 18 || player.highestchallengecompletions[13] >= 18){
            quarkCounter += 750;
        }
        if(player.challengecompletions[13] >= 22 || player.highestchallengecompletions[13] >= 22){
            quarkCounter += 1;
        }
        player.worlds += quarkCounter
        el.textContent = 'Welcome to the Abyss! Based on your progress, you gained ' + format(quarkCounter) + " Quarks.";
    } else if(input === 'add') {
        if(player.rngCode >= (Date.now() - 3600000)) { // 1 hour
            el.textContent = `You already used this promocode in the last hour!`;
            return;
        }

        const amount = window.crypto.getRandomValues(new Uint16Array(1))[0] % 16; // [0, 15]
        const first = window.crypto.getRandomValues(new Uint8Array(1))[0];
        const second = window.crypto.getRandomValues(new Uint8Array(1))[0];
        const addPrompt = await Prompt(`What is ${first} + ${second}?`);

        if(first + second === +addPrompt) {
            player.worlds += amount;
            el.textContent = `You were awarded ${amount} quarks! Wait an hour to use this code again!`;
        } else {
            el.textContent = `You guessed ${addPrompt}, but the answer was ${first + second}. Try again in an hour!`;
        }
        player.rngCode = Date.now();
    } else if(input === 'holiday' && !player.codes.get(31)){
        player.codes.set(31, true);
        let quarkCounter = 2500
        if(player.platonicUpgrades[5] > 0){quarkCounter += 1}
        player.worlds += quarkCounter
        el.textContent = 'Happy holidays from Platonic, to you and yours! A gift of ' + format(quarkCounter) + " Quarks, just for you."
    }
    else {
        el.textContent = "Your code is either invalid or already used. Try again!"
    }

    saveSynergy(); // should fix refresh bug where you can continuously enter promocodes
    Synergism.emit('promocode', input);

    setTimeout(function () {
        el.textContent = ''
    }, 15000);
}
