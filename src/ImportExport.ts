import { player, saveSynergy, blankSave, reloadShit, format } from './Synergism';
import { testing, version } from './Config';
import { getElementById } from './Utility';
import LZString from 'lz-string';
import { achievementaward } from './Achievements';
import { Player } from './types/Synergism';
import { Synergism } from './Events';
import { Alert, Confirm, Prompt } from './UpdateHTML';
import { quarkHandler } from './Quark';
import { shopData } from './Shop';
import { addTimers } from './Helper';
import { toggleSubTab, toggleTabs } from './Toggles';
import { Globals as G } from './Variables';
import { btoa } from './Utility';
import { DOMCacheGetOrSet } from './Cache/DOM';

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
    const datePartsArr = format
        .formatToParts(new Date())
        .filter((x) => x.type !== "literal")
        .map(p => ({ [p.type]: p.value }));

    const dateParts = Object.assign({}, ...datePartsArr) as Record<string, string>;
        
    const period = use12 ? ` ${dateParts.dayPeriod.toUpperCase()}` : '';
    return `${dateParts.year}-${dateParts.month}-${dateParts.day} ${dateParts.hour}_${dateParts.minute}_${dateParts.second}${period}`;
}

export const updateSaveString = (input: HTMLInputElement) => {
    const value = input.value.slice(0, 100);
    player.saveString = value;
}

const saveFilename = () => {
    const s = player.saveString
    const t = s.replace(/\$(.*?)\$/g, (_, b) => {
        switch (b) {
            case 'VERSION': return `v${version}`;
            case 'TIME': return getRealTime();
            case 'TIME12': return getRealTime(true);
        }
    });

    return t;
}

export const exportSynergism = async () => {
    player.offlinetick = Date.now();
    const quarkData = quarkHandler();
    if (quarkData.gain >= 1) {
        player.worlds.add(quarkData.gain);
        player.quarkstimer = (player.quarkstimer % (3600 / quarkData.perHour))
    }

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

    DOMCacheGetOrSet("exportinfo").textContent = toClipboard
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
    }) as Player;
    //Reset Displays
    toggleTabs("buildings");
    toggleSubTab(1, 0);
    //Import Game
    void importSynergism(btoa(JSON.stringify(hold)), true);
}

export const importSynergism = (input: string, reset = false) => {
    if (typeof input !== 'string') {
        return Alert('Invalid character, could not save! 😕');
    }

    const d = LZString.decompressFromBase64(input);
    const f = d ? JSON.parse(d) as Player : JSON.parse(atob(input)) as Player;

    if (
        (f.exporttest === "YES!" || f.exporttest === true) ||
        (f.exporttest === false && testing) ||
        (f.exporttest === 'NO!' && testing)
    ) {
        localStorage.setItem('Synergysave2', btoa(JSON.stringify(f)));
        localStorage.setItem('saveScumIsCheating', Date.now().toString());
        document.body.classList.add('loading');
        
        return reloadShit(reset);
    } else {
        return Alert(`You are attempting to load a testing file in a non-testing version!`);
    }
}

export const promocodes = async () => {
    const input = await Prompt('Got a code? Great! Enter it in (CaSe SeNsItIvE). \n [Note to viewer: this is for events and certain always-active codes. \n May I suggest you type in "synergism2021" or "add" perchance?]');
    const el = DOMCacheGetOrSet("promocodeinfo");

    if (input === null) {
        return Alert('Alright, come back soon!')
    }
    if (input === "synergism2021" && !player.codes.get(1)) {
        player.codes.set(1, true);
        player.runeshards += 25;
        player.worlds.add(50);
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
        player.worlds.add(quarks);
        el.textContent = 'Khafra has blessed you with ' + quarks + ' quarks!';
    }  else if(input.toLowerCase() === 'add') {
        const hour = 3600000
        const timeToNextHour = Math.floor(hour + player.rngCode - Date.now())/1000
        
        if(player.rngCode >= (Date.now() - hour)) { // 1 hour
            el.textContent = `You do not have an 'Add' code attempt! You will gain 1 in ${timeToNextHour} seconds.`;
            return;
        }

        const possibleAmount = Math.floor(Math.min(24 + 2 * player.shopUpgrades.calculator2, (Date.now() - player.rngCode) / hour))
        const attemptsUsed = await Prompt(`You can use up to ${possibleAmount} attempts at once. How many would you like to use?`);
        if (attemptsUsed === null) {
             return Alert(`No worries, you didn't lose any of your uses! Come back later!`);
        }
        const toUse = Number(attemptsUsed);
        if (
            Number.isNaN(toUse) ||
            !Number.isInteger(toUse) ||
            toUse <= 0
        )
            return Alert(`Hey! That's not a valid number!`);

        const realAttemptsUsed = Math.min(possibleAmount, toUse);
        let mult = Math.max(0.4 + 0.02 * player.shopUpgrades.calculator3, 2/5 + (window.crypto.getRandomValues(new Uint16Array(2))[0] % 128) / 640); // [0.4, 0.6], slightly biased in favor of 0.4. =)
        mult *= 1 + 0.14 * player.shopUpgrades.calculator // Calculator Shop Upgrade (+14% / level)
        mult *= (player.shopUpgrades.calculator2 === shopData['calculator2'].maxLevel)? 1.25: 1; // Calculator 2 Max Level (+25%)
        mult *= (1 + +G['isEvent']) // is event? then 2x! [June 28, July 1]
        const quarkBase = quarkHandler().perHour
        const actualQuarks = Math.floor(quarkBase * mult * realAttemptsUsed)
        const patreonBonus = Math.floor(actualQuarks * (player.worlds.BONUS / 100));
        const [first, second] = window.crypto.getRandomValues(new Uint8Array(2));

        //Allows storage of up to (24 + 2 * calc2 levels) Add Codes, lol!
        const v = Math.max(Date.now() - (24 + 2 * player.shopUpgrades.calculator2 - realAttemptsUsed) * hour, player.rngCode + hour * realAttemptsUsed);
        const remaining = Math.floor((Date.now() - v) / hour)
        const timeToNext = Math.floor((hour - (Date.now() - v - hour * remaining)) / 1000)

        // Calculator 3: Adds ascension timer.
        const ascensionTimer = (player.shopUpgrades.calculator3 > 0)
            ? 'Thanks to PL-AT Ω you have also gained ' + format(60 * player.shopUpgrades.calculator3 * realAttemptsUsed) + ' real-life seconds to your Ascension Timer!'
            : '';

        // Calculator Maxed: you don't need to insert anything!
        if (player.shopUpgrades.calculator === shopData['calculator'].maxLevel) {
            player.worlds.add(actualQuarks);
            addTimers('ascension', 60 * player.shopUpgrades.calculator3 * realAttemptsUsed)
            player.rngCode = v;
            return Alert(`Your calculator figured out that ${first} + ${second} = ${first + second} on its own, so you were awarded ${actualQuarks + patreonBonus} quarks ` +
                `[${ patreonBonus } from Patreon Boost]! ${ ascensionTimer } You have ${ remaining } uses of Add.You will gain 1 in ${ timeToNext.toLocaleString(navigator.language) } seconds.`);
        }

        // If your calculator isn't maxed but has levels, it will provide the solution.
        const solution = (player.shopUpgrades.calculator > 0) 
            ? 'The answer is ' + (first + second) + ' according to your calculator.'
            : '';

        const addPrompt = await Prompt(`For ${actualQuarks + patreonBonus} quarks or nothing: What is ${first} + ${second}? ${solution}`);

        if (addPrompt === null) {
            return Alert(`No worries, you didn't lose any of your uses! Come back later!`);
        } 

        player.rngCode = v;

        if(first + second === +addPrompt) {
            player.worlds.add(actualQuarks);
            addTimers('ascension', 60 * player.shopUpgrades.calculator3)
            await Alert(`You were awarded ${actualQuarks + patreonBonus} quarks [${patreonBonus} from Patreon Boost]! ${ascensionTimer} You have ${remaining} uses of Add. ` +
                `You will gain 1 in ${ timeToNext.toLocaleString(navigator.language) } seconds.`);
        } else {
            await Alert(`You guessed ${addPrompt}, but the answer was ${first + second}. You have ${remaining} uses of Add. You will gain 1 in ${timeToNext.toLocaleString(navigator.language)} seconds.`);
        }

    } else if (input === 'sub') { 
        const amount = 1 + window.crypto.getRandomValues(new Uint16Array(1))[0] % 16; // [1, 16]
        const quarks = Number(player.worlds);
        await Alert(`Thanks for using the "sub" code! I've taken away ${amount} quarks! :)`);        

        if (quarks < amount) 
            await Alert(`I gave you ${amount - quarks} quarks so I could take ${amount} away.`);

        player.worlds.sub(quarks < amount ? amount - quarks : amount);
    } else if (input === 'gamble') {
        if (
            typeof player.skillCode === 'number' ||
            typeof localStorage.getItem('saveScumIsCheating') === 'string'
        ) {
            if (
                (Date.now() - player.skillCode) / 1000 < 3600 ||
                (Date.now() - Number(localStorage.getItem('saveScumIsCheating'))) / 1000 < 3600
            ) {
                return el.textContent = 'Wait a little bit. We\'ll get back to you when you\'re ready to lose again.';
            }
        }

        const confirmed = await Confirm(`Are you sure? The house always wins!`);
        if (!confirmed)
            return el.textContent = 'Scared? You should be!';

        const bet = Number(await Prompt('How many quarks are you putting up?'));
        if (Number.isNaN(bet) || bet <= 0)
            return el.textContent = 'Can\'t bet that!';
        else if (bet > 1e4)
            return el.textContent = `Due to cheaters, you can only bet 10k max.`;
        else if (Number(player.worlds) < bet)
            return el.textContent = 'Can\'t bet what you don\'t have.';

        localStorage.setItem('saveScumIsCheating', Date.now().toString());
        const dice = window.crypto.getRandomValues(new Uint8Array(1))[0] % 6 + 1; // [1, 6]
        
        if (dice === 1) {
            const won = bet * .25; // lmao
            player.worlds.add(won);

            player.skillCode = Date.now();
            return el.textContent = `You won. The Syncasino offers you a grand total of 25% of the pot! [+${won} quarks]`;
        }
        
        player.worlds.sub(bet);
        el.textContent = `Try again... you can do it! [-${bet} quarks]`;
    } else if (input === 'time') {
        if ((Date.now() - player.promoCodeTiming.time) / 1000 < 3600) {
            return Confirm(`
            If you imported a save, you cannot use this code for 15 minutes to prevent cheaters.
            
            Otherwise, you must wait an hour between each use.
            `);
        }

        const random = Math.random() * 15000; // random time within 15 seconds
        const start = Date.now();
        await Confirm(
            `Click the button within the next 15 seconds to test your luck!` + 
            ` If you click within 500 ms of a randomly generated time, you will win a prize!`
        );
        
        const diff = Math.abs(Date.now() - (start + random));
        player.promoCodeTiming.time = Date.now();

        if (diff <= 500) {
            player.worlds.add(500);
            return Confirm(`You clicked at the right time! [+500 Quarkies]`);
        } else {
            return Confirm(`You didn't guess within the correct times, try again soon!`);
        }
    } else {
        el.textContent = "Your code is either invalid or already used. Try again!"
    }

    saveSynergy(); // should fix refresh bug where you can continuously enter promocodes
    Synergism.emit('promocode', input);

    setTimeout(function () {
        el.textContent = ''
    }, 15000);
}
