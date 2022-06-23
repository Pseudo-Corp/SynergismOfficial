import { sacrificeAnts } from './Ants';
import { buyAccelerator, boostAccelerator, buyMultiplier } from './Buy';
import { player, resetCheck } from './Synergism';
import { keyboardTabChange, toggleAutoChallengeRun, toggleCorruptionLevel } from './Toggles';
import { Alert, Prompt } from './UpdateHTML';

export const hotkeys = new Map<string, [string,() => unknown]>([
    ['A', ['Buy Accelerators', () => buyAccelerator()]],
    ['B', ['Boost Accelerator', () => boostAccelerator()]],
    ['C', ['Auto Challenge', () => {
        toggleChallengeSweep()
    }]],
    ['E', ['Exit T / R Challenge', () => {
        if (player.autoChallengeRunning) {
            toggleChallengeSweep()
        } else {
            exitTranscendAndPrestigeChallenge()
        }
    }]],
    ['M', ['Multipliers', () => buyMultiplier()]],
    ['P', ['Reset Prestige', () => resetCheck('prestige')]],
    ['R', ['Reset Reincarnate', () => resetCheck('reincarnation')]],
    ['S', ['Sacrifice Ants', () => sacrificeAnts()]],
    ['T', ['Reset Transcend', () => resetCheck('transcension')]],
    ['ARROWLEFT', ['Back a tab', () => keyboardTabChange(-1)]],
    ['ARROWRIGHT', ['Next tab', () => keyboardTabChange(1)]],
    ['ARROWUP', ['Back a subtab', () => keyboardTabChange(-1, false)]],
    ['ARROWDOWN', ['Next subtab', () => keyboardTabChange(1, false)]],
    ['SHIFT+A', ['Reset Ascend', () => resetCheck('ascension')]],
    ['SHIFT+E', ['Exit Asc. Challenge', () => resetCheck('ascensionChallenge')]], // Its already checks if inside Asc. Challenge
    ['SHIFT+C', ['Cleanse Corruptions', () => toggleCorruptionLevel(10, 999)]],
    ['SHIFT+S', ['Reset Singularity', () => resetCheck('singularity')]]
]);

function toggleChallengeSweep(): void {
    if (player.researches[150] > 0) {
        toggleAutoChallengeRun()
        if (!player.autoChallengeRunning) {
            exitTranscendAndPrestigeChallenge()
        }
    }
}

function exitTranscendAndPrestigeChallenge() {
    if (player.currentChallenge.reincarnation !== 0) {
        void resetCheck('reincarnationChallenge', undefined, true)
    }
    if (player.currentChallenge.transcension !== 0) {
        void resetCheck('transcensionChallenge', undefined, true)
    }
}

document.addEventListener('keydown', event => {
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

    if (hotkeys.has(key)) {
        hotkeys.get(key)![1]();
    }
});

const makeSlot = (key: string, descr: string) => {
    const div = document.createElement('div');
    div.classList.add('hotkeyItem');

    const span = document.createElement('span');
    span.id = 'actualHotkey';
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

        if (hotkeys.has(toSet)) {
            return void Alert('That key is already binded to an action, use another key instead!');
        } else if (hotkeys.has(oldKey)) {
            const old = hotkeys.get(oldKey)!;

            hotkeys.set(toSet, old);
            hotkeys.delete(oldKey);

            target.textContent = toSet;
        } else {
            return void Alert(`No hotkey is triggered by ${oldKey}!`);
        }
    });

    const p = document.createElement('p');
    p.id = 'hotKeyDesc';
    p.textContent = descr;

    div.appendChild(span);
    div.appendChild(p);

    return div;
}

export const startHotkeys = () => {
    const hotkey = document.querySelector('.hotkeys')!;

    for (const child of Array.from(hotkey.children)) {
        hotkey.removeChild(child);
    }

    for (const [key, [descr]] of [...hotkeys.entries()]) {
        const div = makeSlot(key, descr);

        hotkey.appendChild(div);
    }
}
