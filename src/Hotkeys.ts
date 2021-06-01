import { sacrificeAnts } from './Ants';
import { buyAccelerator, boostAccelerator, buyMultiplier } from './Buy';
import { player, resetCheck } from './Synergism';
import { keyboardTabChange } from './Toggles';
import { Alert, Prompt } from './UpdateHTML';

const permArr = new Set<string[]>();
const usedChars = new Set<string>();

const combinations = (input: string[]) => {
    for (let i = 0; i < input.length; i++) {
        const char = input.splice(i, 1)[0];
        usedChars.add(char);
        if (input.length === 0) {
            permArr.add([...usedChars].slice());
        }

        combinations(input);
        input.splice(i, 0, char);
        usedChars.delete([...usedChars].pop());
    }

    return [...permArr];
}

const combineAndClear = (input: string[]) => {
    const permute = combinations(input);
    permArr.clear();
    usedChars.clear();
    return permute;
}

export const hotkeys = new Map<string, [string, () => unknown]>([
        ['A', ['Buy Accelerators', () => buyAccelerator()]],
        ['B', ['Boost Accelerator', () => boostAccelerator()]],
        ['E', ['Exit Challenge', () => {
            if (player.currentChallenge.reincarnation !== 0) {
                resetCheck('reincarnationchallenge', undefined, true)
            }
            if (player.currentChallenge.transcension !== 0) {
                resetCheck('challenge', undefined, true)
            }
        }]],
        ['M', ['Multipliers', () => buyMultiplier()]],
        ['P', ['Reset Prestige', () => resetCheck('prestige')]],
        ['R', ['Reset Reincarnate', () => resetCheck('reincarnate')]],
        ['S', ['Sacrifice Ants', () => sacrificeAnts()]],
        ['T', ['Reset Transcend', () => resetCheck('transcend')]],
        ['ARROWLEFT', ['Back a tab', () => keyboardTabChange(-1)]],
        ['ARROWRIGHT', ['Next tab', () => keyboardTabChange(1)]],
        ['ARROWUP', ['Back a subtab', () => keyboardTabChange(-1, false)]],
        ['ARROWDOWN', ['Next subtab', () => keyboardTabChange(1, false)]]
]);
const keysPressed = new Set<string>();

document.addEventListener('keydown', event => {
    if (document.activeElement?.localName === 'input') {
        // https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation
        // finally fixes the bug where hotkeys would be activated when typing in an input field
        event.stopPropagation();
        return;
    }

    keysPressed.add(event.key.toUpperCase());
    const all = [...keysPressed].join(',');
    
    if (hotkeys.has(all)) {
        const [, fn] = hotkeys.get(all);
        fn();
    }
});

document.addEventListener('keyup', event => keysPressed.delete(event.key.toUpperCase()));

const makeSlot = (key: string, descr: string) => {
    const div = document.createElement('div');
    div.classList.add('hotkeyItem');

    const span = document.createElement('span');
    span.id = 'actualHotkey';
    span.textContent = key;
    span.style.padding = '1px 15px';
    span.style.color = 'gold';
    span.style.cursor = 'pointer'
    span.addEventListener('click', async (e) => {
        const target = e.target as HTMLElement;
        // new value to set key as, unformatted
        const newKey = await Prompt(`
        Enter the new key (or keys) you want the hotkey to ${target.parentNode.querySelector('div').textContent} be.

        To enter multiple keys, separate them with a comma.
        `);

        if (typeof newKey !== 'string') return;
        // array of key(s) to set combinations as
        const keys = newKey.split(',').map(k => k.toUpperCase());
        // old hotkey
        const oldKey = target.textContent.toUpperCase();

        if (newKey.length === 0)
            return Alert(`You didn't enter anything, canceled!`);
        else if (keys.length < 1 || keys.length > 3) // 'A'.split(',') will still return a non-empty array
            return Alert(`No keys were provided, try separating them with a comma.`)

        if (hotkeys.has(oldKey)) {
            const old = hotkeys.get(oldKey)!;
            const permute = combineAndClear(keys);
            const oldPermute = combineAndClear(oldKey.split(','));

            for (const permutation of permute)
                hotkeys.set(permutation.join(','), old);
            for (const permutation of oldPermute)
                hotkeys.delete(permutation.join(','));

            target.textContent = newKey;
        } else {
            return Alert(`No hotkey is triggered by ${oldKey}!`);
        }
    });

    const desc = document.createElement('div');
    desc.textContent = descr;

    div.appendChild(span);
    div.appendChild(desc);

    return div;
}

(() => {
    const hotkey = document.querySelector('.hotkeys');
    
    for (const [key, [descr]] of [...hotkeys.entries()]) {
        const div = makeSlot(key, descr);

        hotkey.appendChild(div);
    }
})();