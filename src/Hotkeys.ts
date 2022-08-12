import { sacrificeAnts } from './Ants';
import { buyAccelerator, boostAccelerator, buyMultiplier } from './Buy';
import { player, resetCheck, synergismHotkeys } from './Synergism';
import { keyboardTabChange, toggleAutoChallengeRun, toggleCorruptionLevel, confirmReply, toggleAutoAscend } from './Toggles';
import { Alert, Prompt, Confirm } from './UpdateHTML';
import { Globals as G } from './Variables';
import { DOMCacheGetOrSet } from './Cache/DOM';
import { useConsumable } from  './Shop';
import { promocodes } from './ImportExport';

// There is a hotkey for saving settings. Therefore, if defaultHotkeys are registered, the default key should not be changed.
export const defaultHotkeys = new Map<string, [string,() => unknown, boolean, string]>([
    ['A', ['Buy Accelerators', () => buyAccelerator(), false, 'Buy Accelerators.']],
    ['B', ['Boost Accelerator', () => boostAccelerator(), false, 'Buy Boost Accelerator.']],
    ['C', ['Auto Challenge', () => {
        toggleChallengeSweep()
    }, false, 'Toggle Auto Challenge Sweep. When it comes to OFF, you will leave the T and R challenge.']],
    ['E', ['Exit T / R Challenge', () => {
        if (player.autoChallengeRunning) {
            toggleChallengeSweep()
        } else {
            exitTranscendAndPrestigeChallenge()
        }
    }, false, 'Auto Challenge Sweep is off. When it comes to OFF, you will leave the T and R challenge.']],
    ['M', ['Multipliers', () => buyMultiplier(), false, 'Buy Multipliers.']],
    ['N', ['No (Cancel)', () => confirmReply(false), true, 'In the case of confirm, do Cancel. OK with alerts.']],
    ['P', ['Reset Prestige', () => resetCheck('prestige'), false, 'Enter Reset Prestige.']],
    ['R', ['Reset Reincarnate', () => resetCheck('reincarnation'), false, 'Enter Reset Reincarnate.']],
    ['S', ['Sacrifice Ants', () => sacrificeAnts(), false, 'Execute Sacrifice Ants.']],
    ['T', ['Reset Transcend', () => resetCheck('transcension'), false, 'Enter Reset Transcend.']],
    ['Y', ['Yes (OK)', () => confirmReply(true), true, 'Alerts and confirm are OK.']],
    ['ARROWLEFT', ['Back a tab', () => keyboardTabChange(-1), false, 'Back a tab.']],
    ['ARROWRIGHT', ['Next tab', () => keyboardTabChange(1), false, 'Next tab.']],
    ['ARROWUP', ['Back a subtab', () => keyboardTabChange(-1, false), false, 'Back a subtab.']],
    ['ARROWDOWN', ['Next subtab', () => keyboardTabChange(1, false), false, 'Next subtab.']],
    ['SHIFT+A', ['Reset Ascend', () => resetCheck('ascension'), false, 'Enter Reset Ascend.']],
    ['SHIFT+B', ['Auto Ascend', () => toggleAutoAscend(0), false, 'Toggle Auto Ascend.']],
    ['SHIFT+C', ['Cleanse Corruptions', () => toggleCorruptionLevel(10, 999), false, 'Cleanse Corruptions.']],
    ['SHIFT+D', ['Spec. Action Add x1', () => promocodes('add', 1), false, 'Execute Special Action Add x1. It will not be executed if the Add is insufficient.']],
    ['SHIFT+E', ['Exit Asc. Challenge', () => resetCheck('ascensionChallenge'), false, 'Exit Ascension Challenge.']], // Its already checks if inside Asc. Challenge
    ['SHIFT+F', ['All Open 10% Cubes', () => allOpenCubes(10), false, 'All Open 10% Cubes.']],
    ['SHIFT+G', ['All Open 50% Cubes', () => allOpenCubes(50), false, 'All Open 50% Cubes.']],
    ['SHIFT+H', ['All Open All Cubes', () => allOpenCubes(100), false, 'All Open All Cubes.']],
    ['SHIFT+O', ['Use Off. Potion', () => useConsumable('offeringPotion'), false, 'Use the Offerings Potion. It will be ignored when the number is insufficient.']],
    ['SHIFT+P', ['Use Obt. Potion', () => useConsumable('obtainiumPotion'), false, 'Use Obtainium Potion. It will be ignored when the number is insufficient.']],
    ['SHIFT+S', ['Reset Singularity', () => resetCheck('singularity'), false, 'Enter Reset Singularity.']]
]);

export let hotkeysEnabled = false;

export let hotkeys = new Map<string, [string,() => unknown, boolean, string]>(defaultHotkeys);

const allOpenCubes = (percent = 100): void => {
    if (player.ascensionCount > 0) {
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
            DOMCacheGetOrSet('prompt_text').value = key;
        }
        // Disable all keys except ENTER, Yes (OK) and No (Cancel)
        if ((hotkeys.has(key) && hotkeys.get(key)![2] !== true) || !isNaN(numkey)) {
            return;
        }
    }

    let hotkeyName = '';
    if (hotkeys.has(key)) {
        hotkeyName = `[${hotkeys.get(key)![0]}]`;
        hotkeys.get(key)![1]();
        event.preventDefault();
    } else {
        synergismHotkeys(event, numkey);
    }

    if (G['currentTab'] === 'settings' && player.subtabNumber === 6) {
        DOMCacheGetOrSet('lastHotkey').textContent = key;
        DOMCacheGetOrSet('lastHotkeyName').textContent = hotkeyName;
    }
}

const makeSlot = (key: string, descr: string) => {
    const div = document.createElement('div');
    div.classList.add('hotkeyItem');

    div.addEventListener('mouseover', async (): void => {
        DOMCacheGetOrSet('hotkeyDescription').textContent = hotkeys.get(key)?.[3] ?? '';
    });

    const span = document.createElement('span');
    span.textContent = key;

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    span.addEventListener('click', async (e) => {
        const target = e.target as HTMLElement;
        const oldKey = target.textContent!.toUpperCase();
        const name =
            hotkeys.get(oldKey)?.[0] ??
            target.nextSibling?.textContent;

        // new value to set key as, unformatted
        const newKey = await Prompt(`
        Enter the new key you want to activate ${name} with.

        MDN has a list of values for "special keys" if you would like to use one:
        https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values

        You can also prefix your hotkey with [Ctrl,Shift,Alt]+<key>
        `);

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

            enableHotkeys();
        } else {
            return void Alert(`No hotkey is triggered by ${oldKey}!`);
        }
    });

    const p = document.createElement('p');
    p.textContent = descr;

    p.addEventListener('click', async (): void => {
        DOMCacheGetOrSet('hotkeyDescription').textContent = hotkeys.get(key)?.[3] ?? '';
        hotkeys.get(key)![1]();
    });

    div.appendChild(span);
    div.appendChild(p);

    return div;
}

export const disableHotkeys = () => hotkeysEnabled = false;

export const enableHotkeys = () => {
    changeHotkeys();

    const hotkey = document.querySelector('.hotkeys')!;

    for (const child of Array.from(hotkey.children)) {
        hotkey.removeChild(child);
    }

    for (const [key, [descr]] of [...hotkeys.entries()]) {
        const div = makeSlot(key, descr);

        hotkey.appendChild(div);
    }

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

    const confirmed = await Confirm(`Are you sure you want to default all the changed hotkeys?\nBelow is a history of hotkeys you have changed\n\n${settext}`);
    if (confirmed) {
        hotkeys = new Map(defaultHotkeys);
        player.hotkeys = {};
        enableHotkeys();
    }
}
