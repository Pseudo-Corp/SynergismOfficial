import { sacrificeAnts } from './Ants';
import { buyAccelerator, boostAccelerator, buyMultiplier } from './Buy';
import { player, resetCheck, synergismHotkeys } from './Synergism';
import { keyboardTabChange, toggleAutoChallengeRun, toggleCorruptionLevel, confirmReply, toggleAutoAscend, toggleAutoSacrifice } from './Toggles';
import { Alert, Prompt, Confirm } from './UpdateHTML';
import { Globals as G } from './Variables';
import { DOMCacheGetOrSet } from './Cache/DOM';
import { useConsumable } from  './Shop';
import { promocodes } from './ImportExport';

type Hotkey = [string,() => unknown, boolean, () => boolean, string]

// There is a hotkey for saving settings. Therefore, if defaultHotkeys are registered, the default key should not be changed.
export const defaultHotkeys = new Map<string, Hotkey>([
    ['A', ['Buy Accelerators', () => buyAccelerator(), false, () => true, 'Buy Accelerators.']],
    ['B', ['Boost Accelerator', () => boostAccelerator(), false, () => true, 'Buy Boost Accelerator.']],
    ['C', ['Auto Challenge', () => {
        toggleChallengeSweep()
    }, false, () => player.researches[150] === 1, 'Toggle Auto Challenge Sweep. When it comes to OFF, you will leave the T and R challenge.']],
    ['E', ['Exit T / R Challenge', () => {
        if (player.autoChallengeRunning) {
            toggleChallengeSweep()
        } else {
            exitTranscendAndPrestigeChallenge()
        }
    }, false, () => player.unlocks.transcend, 'Auto Challenge Sweep is off. When it comes to OFF, you will leave the T and R challenge.']],
    ['M', ['Multipliers', () => buyMultiplier(), false, () => true, 'Buy Multipliers.']],
    ['N', ['No (Cancel)', () => confirmReply(false), true, () => true, 'In the case of confirm, do Cancel. OK with alerts.']],
    ['P', ['Reset Prestige', () => resetCheck('prestige'), false, () => player.unlocks.prestige, 'Enter Reset Prestige.']],
    ['R', ['Reset Reincarnate', () => resetCheck('reincarnation'), false, () => player.unlocks.reincarnate, 'Enter Reset Reincarnate.']],
    ['S', ['Sacrifice Ants', () => sacrificeAnts(), false, () => player.researches[124] === 1, 'Execute Sacrifice Ants.']],
    ['T', ['Reset Transcend', () => resetCheck('transcension'), false, () => player.unlocks.transcend, 'Enter Reset Transcend.']],
    ['Y', ['Yes (OK)', () => confirmReply(true), true, () => true, 'Alerts and confirm are OK.']],
    ['ARROWLEFT', ['Back a tab', () => keyboardTabChange(-1), false, () => true, 'Back a tab.']],
    ['ARROWRIGHT', ['Next tab', () => keyboardTabChange(1), false, () => true, 'Next tab.']],
    ['ARROWUP', ['Back a subtab', () => keyboardTabChange(-1, false), false, () => true, 'Back a subtab.']],
    ['ARROWDOWN', ['Next subtab', () => keyboardTabChange(1, false), false, () => true, 'Next subtab.']],
    ['SHIFT+A', ['Reset Ascend', () => resetCheck('ascension'), false, () => player.achievements[183] === 1, 'Enter Reset Ascend.']],
    ['SHIFT+B', ['Auto Ascend', () => toggleAutoAscend(0), false, () => player.challengecompletions[11] > 0, 'Toggle Auto Ascend.']],
    ['SHIFT+C', ['Cleanse Corruptions', () => toggleCorruptionLevel(10, 999), false, () => player.challengecompletions[11] > 0, 'Cleanse Corruptions.']],
    ['SHIFT+D', ['Spec. Action Add x1', () => promocodes('add', 1), false, () => player.singularityCount > 0, 'Execute Special Action Add x1. It will not be executed if the Add is insufficient.']],
    ['SHIFT+E', ['Exit Asc. Challenge', () => resetCheck('ascensionChallenge'), false, () => player.achievements[183] === 1, 'Exit Ascension Challenge.']], // Its already checks if inside Asc. Challenge
    ['SHIFT+F', ['Open 10% All Cubes', () => allOpenCubes(10), false, () => player.singularityCount > 0, 'Open 10% for 3-6 Dimensional Cubes.']],
    ['SHIFT+G', ['Open 50% All Cubes', () => allOpenCubes(50), false, () => player.singularityCount > 0, 'Open 50% for 3-6 Dimensional Cubes.']],
    ['SHIFT+H', ['Open 100% All Cubes', () => allOpenCubes(100), false, () => player.singularityCount > 0, 'Open 100% for 3-6 Dimensional Cubes.']],
    ['SHIFT+R', ['Auto Runes', () => toggleAutoSacrifice(0), false, () => player.shopUpgrades.offeringAuto > 0, 'Toggle Auto Runes.']],
    ['SHIFT+O', ['Use Off. Potion', () => useConsumable('offeringPotion'), false, () => player.singularityCount > 0, 'Use the Offerings Potion. It will be ignored when the number is insufficient.']],
    ['SHIFT+P', ['Use Obt. Potion', () => useConsumable('obtainiumPotion'), false, () => player.singularityCount > 0, 'Use Obtainium Potion. It will be ignored when the number is insufficient.']],
    ['SHIFT+S', ['Reset Singularity', () => resetCheck('singularity'), false, () => player.singularityCount > 0, 'Enter Reset Singularity.']]
]);

const lockedName = 'LOCKED';

export let hotkeysEnabled = false;

export let enableHotkeyCount = 0;

export let hotkeys = new Map<string, Hotkey>(defaultHotkeys);

const allOpenCubes = (percent = 100): void => {
    if (player.ascensionCount > 0 && player.achievements[141] === 1) {
        player.wowCubes.open(Math.floor(Number(player.wowCubes) / 100 * percent), percent === 100);
        if (player.challengecompletions[11] > 0) {
            player.wowTesseracts.open(Math.floor(Number(player.wowTesseracts) / 100 * percent), percent === 100);
        }
        if (player.challengecompletions[13] > 0) {
            player.wowHypercubes.open(Math.floor(Number(player.wowHypercubes) / 100 * percent), percent === 100);
        }
        if (player.challengecompletions[14] > 0) {
            player.wowPlatonicCubes.open(Math.floor(Number(player.wowPlatonicCubes) / 100 * percent), percent === 100);
        }
    }
}

const toggleChallengeSweep = (): void => {
    if (player.researches[150] > 0) {
        toggleAutoChallengeRun()
        if (!player.autoChallengeRunning) {
            exitTranscendAndPrestigeChallenge()
        }
    }
}

const exitTranscendAndPrestigeChallenge = () => {
    if (player.currentChallenge.reincarnation !== 0) {
        void resetCheck('reincarnationChallenge', undefined, true)
    }
    if (player.currentChallenge.transcension !== 0) {
        void resetCheck('transcensionChallenge', undefined, true)
    }
}

export const eventHotkeys = (event: KeyboardEvent): void => {
    if (!hotkeysEnabled || player.toggles[39] === false) {
        // There was a race condition where a user could spam Shift + S + Enter to
        // Singularity which would cause a bug when rune 7 was bought. To prevent this,
        // the game disables hotkeys when on the offline progress screen, and re-
        // enables them when the user leaves.
        return;
    }

    if (document.activeElement?.localName === 'input') {
        // https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation
        // finally fixes the bug where hotkeys would be activated when typing in an input field
        return event.stopPropagation();
    }

    let keyPrefix = '';
    if (event.ctrlKey) {
        keyPrefix += 'CTRL+';
    }
    if (event.shiftKey) {
        keyPrefix += 'SHIFT+';
    }
    if (event.altKey) {
        keyPrefix += 'ALT+';
    }
    const key = keyPrefix + event.key.toUpperCase();
    const numkey = event.code.replace(/^(Digit|Numpad)/, '').toUpperCase();

    // Disable the TAB key as it may allow unexpected operations
    if (key === 'TAB') {
        event.preventDefault();
    }

    // Disable hotkeys if notifications are occurring
    if (key !== 'ENTER' && DOMCacheGetOrSet('transparentBG').style.display === 'block') {
        // If a set key prompt is open and text is not in focus, keypress sets the key to the prompt
        if (G['currentTab'] === 'settings' && player.subtabNumber === 6 &&
            DOMCacheGetOrSet('promptWrapper').style.display === 'block' && document.activeElement?.localName !== 'input') {
            const promptText = DOMCacheGetOrSet('prompt_text') as HTMLInputElement;
            promptText.value = key;
        }
        // Disable all keys except ENTER, Yes (OK) and No (Cancel)
        if ((hotkeys.has(key) && hotkeys.get(key)?.[2] !== true) || !isNaN(Number(numkey))) {
            return;
        }
    }

    let hotkeyName = '';
    if (hotkeys.has(key)) {
        const hotkey = hotkeys.get(key)!;
        if (hotkey[3]() === true) {
            hotkeyName = `[${hotkey[0]}]`;
            hotkey[1]();
        } else {
            hotkeyName = `[${lockedName}]`;
        }
        event.preventDefault();
    } else {
        synergismHotkeys(event, numkey);
    }

    if (G['currentTab'] === 'settings' && player.subtabNumber === 6) {
        DOMCacheGetOrSet('lastHotkey').textContent = key;
        DOMCacheGetOrSet('lastHotkeyName').textContent = hotkeyName;
    }
}

const makeSlot = (key: string, descr: Hotkey) => {
    const div = document.createElement('div');
    div.classList.add('hotkeyItem');

    const unlock = descr[3]();

    div.addEventListener('mouseover', () => {
        DOMCacheGetOrSet('hotkeyDescription').textContent = unlock ? descr[4] : 'Your current progress is locked.';
    });

    const span = document.createElement('span');
    span.textContent = key;

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    span.addEventListener('click', async (e) => {
        const target = e.target as HTMLElement;
        const oldKey = key;
        const name = unlock ? descr[0] : lockedName;

        // new value to set key as, unformatted
        const newKey = await Prompt(`Enter the new key you want to activate ${name} with.

        MDN has a list of values for "special keys" if you would like to use one:
        https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values

        You can also prefix your hotkey with [Ctrl,Shift,Alt]+<key>`);

        if (typeof newKey !== 'string') {
            return;
        }

        const toSet = newKey.toUpperCase();

        if (newKey.length === 0) {
            return void Alert('You didn\'t enter anything, canceled!');
        }

        if (!isNaN(Number(newKey))) {
            return void Alert('Number keys are currently unavailable!');
        }

        if (toSet === 'ESCAPE' || toSet === 'ENTER') {
            return void Alert(`${toSet} key is not allowed!`);
        }

        if (hotkeys.has(toSet) || oldKey === toSet) {
            return void Alert('That key is already binded to an action, use another key instead!');
        } else if (hotkeys.has(oldKey)) {
            const old = hotkeys.get(oldKey)!;

            hotkeys.set(toSet, old);
            hotkeys.delete(oldKey);

            const keys = Object.keys(player.hotkeys);
            player.hotkeys[keys.length] = [oldKey, toSet];

            target.textContent = toSet;

            void enableHotkeys();
        } else {
            return void Alert(`No hotkey is triggered by ${oldKey}!`);
        }
    });

    const p = document.createElement('p');

    if (unlock) {
        p.textContent = descr[0];
        p.style.color = 'white';
        p.classList.add('hotkeyPurchased');
    } else {
        p.textContent = lockedName;
        p.style.color = 'gray';
    }

    p.addEventListener('click', () => {
        if (descr[3]() === true) {
            descr[1]();
        }
    });

    div.appendChild(span);
    div.appendChild(p);

    return div;
}

export const disableHotkeys = () => hotkeysEnabled = false;

export const checkHotkeys = () => {
    let count = 0;
    for (const [key, descr] of [...hotkeys.entries()]) {
        if (key && descr[3]() === true) {
            count++;
        }
    }
    if (enableHotkeyCount !== count) {
        enableHotkeys();
        enableHotkeyCount = count;
    }
}

export const enableHotkeys = () => {
    changeHotkeys();

    const hotkey = document.querySelector('.hotkeys')!;

    for (const child of Array.from(hotkey.children)) {
        hotkey.removeChild(child);
    }

    let count = 0;
    for (const [key, descr] of [...hotkeys.entries()]) {
        const div = makeSlot(key, descr);
        hotkey.appendChild(div);
        if (descr[3]() === true) {
            count++;
        }
    }
    enableHotkeyCount = count;

    hotkeysEnabled = true;
}

export const changeHotkeys = () => {
    hotkeys = new Map(defaultHotkeys);

    for (const key in player.hotkeys) {
        const oldKey = player.hotkeys[key][0];
        const toSet = player.hotkeys[key][1];
        if (hotkeys.has(oldKey)) {
            const old = hotkeys.get(oldKey)!;
            hotkeys.set(toSet, old);
            hotkeys.delete(oldKey);
        } else {
            delete player.hotkeys[key];
        }
    }
}

export const resetHotkeys = async () => {
    enableHotkeys();

    const keys = Object.keys(player.hotkeys);
    if (keys.length === 0) {
        return await Alert('You haven\'t changed the hotkey');
    }

    let settext = '';
    const hotkey = new Map(defaultHotkeys);
    for (const key in player.hotkeys) {
        const oldKey = player.hotkeys[key][0];
        const toSet = player.hotkeys[key][1];
        if (hotkey.has(oldKey)) {
            const old = hotkey.get(oldKey)!;
            settext += `\t${oldKey}[${old[0]}] to ${toSet}, `;
            hotkey.set(toSet, old);
            hotkey.delete(oldKey);
        }
    }

    const confirmed = await Confirm(`Are you sure you want to default all the ${keys.length} changed hotkeys?\nBelow is a history of hotkeys you have changed\n\n${settext}`);
    if (confirmed) {
        hotkeys = new Map(defaultHotkeys);
        player.hotkeys = {};
        enableHotkeys();
    }
}
