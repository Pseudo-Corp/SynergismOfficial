import { player, saveSynergy, blankSave, isTesting } from './Synergism';
import { getElementById } from './Utility';
import LZString from 'lz-string';
import { achievementaward } from './Achievements';
import { Globals as G } from './Variables';
import { Player } from './types/Synergism';
import { Synergism } from './Events';
import { Alert, Confirm, Prompt } from './UpdateHTML';

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
        localStorage.setItem('Synergysave2', btoa(JSON.stringify(f)));
        
        window.dispatchEvent(new Event('load'));
    } else {
        return Alert(`You are attempting to load a testing file in a non-testing version!`);
    }
}

export const promocodes = async () => {
    const input = await Prompt('Got a code? Great! Enter it in (CaSe SeNsItIvE).');
    const el = document.getElementById("promocodeinfo");

    if (input === "synergism2021" && !player.codes.get(1)) {
        player.codes.set(1, true);
        player.runeshards += 25;
        player.worlds += 50;
        el.textContent = "Promo Code 'synergism2021' Applied! +25 Offerings, +50 Quarks"
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
    } else if(input === '2million' && !player.codes.get(28)) {
        player.codes.set(28, true);
        player.worlds += 700;
        el.textContent = 'Thank you for 2 million plays on kongregate!';
    } else if(input === 'v2.5.0' && !player.codes.get(32)) {
        player.codes.set(32, true);
        el.textContent = 'You are on v2.5.0! For playing, you get a reward of ... nothing?';
    } else if(input === 'add') {
        if(player.rngCode >= (Date.now() - 3600000)) { // 1 hour
            el.textContent = `You already used this promocode in the last hour!`;
            return;
        }

        const amount = window.crypto.getRandomValues(new Uint16Array(1))[0] % 16; // [0, 15]
        const [first, second] = window.crypto.getRandomValues(new Uint8Array(2));
        const addPrompt = await Prompt(`What is ${first} + ${second}?`);

        if(first + second === +addPrompt) {
            player.worlds += amount;
            el.textContent = `You were awarded ${amount} quarks! Wait an hour to use this code again!`;
        } else {
            el.textContent = `You guessed ${addPrompt}, but the answer was ${first + second}. Try again in an hour!`;
        }
        player.rngCode = Date.now();
    } else if (input === 'gamble') {
        if (typeof player.skillCode === 'number')
            if ((Date.now() - player.skillCode) / 1000 < 3600)
                return el.textContent = 'Wait a little bit. We\'ll get back to you when you\'re ready to lose again.';

        const confirmed = await Confirm(`Are you sure? The house always wins!`);
        if (!confirmed)
            return el.textContent = 'Scared? You should be!';

        const bet = Number(await Prompt('How many quarks are you putting up?'));
        if (Number.isNaN(bet) || bet <= 0)
            return el.textContent = 'Can\'t bet that!';

        if (player.worlds < bet)
            return el.textContent = 'Can\'t bet what you don\'t have.';

        const dice = window.crypto.getRandomValues(new Uint8Array(1))[0] % 6 + 1; // [1, 6]
        if (dice === 1 || dice === 6) {
            const won = bet * .25; // lmao
            player.worlds += won;

            player.skillCode = Date.now();
            return el.textContent = `You won. The Syncasino offers you a grand total of 25% of the pot! [+${won} quarks]`;
        }
        
        player.worlds -= bet;
        el.textContent = `Try again... you can do it! [-${bet} quarks]`;
    } else {
        el.textContent = "Your code is either invalid or already used. Try again!"
    }

    saveSynergy(); // should fix refresh bug where you can continuously enter promocodes
    Synergism.emit('promocode', input);

    setTimeout(function () {
        el.textContent = ''
    }, 15000);
}
