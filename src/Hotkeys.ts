import { sacrificeAnts } from './Ants';
import { buyAccelerator, boostAccelerator, buyMultiplier } from './Buy';
import { player, resetCheck } from './Synergism';
import { keyboardTabChange } from './Toggles';
import { Alert, Prompt } from './UpdateHTML';

export const hotkeys = new Map<string, [string, () => unknown]>([
        ['A', ['Buy Accelerators', () => buyAccelerator()]],
        ['B', ['Boost Accelerator', () => boostAccelerator()]],
        ['E', ['idfk', () => {
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
    keysPressed.add(event.key.toUpperCase());
    
    if (hotkeys.has(event.key.toUpperCase())) {
        const [, fn] = hotkeys.get(event.key.toUpperCase());
        fn();
    }
    
    // if (keysPressed.has('Control') && event.key === 'a') {}
});

document.addEventListener('keyup', event => {
    keysPressed.delete(event.key.toUpperCase());
});

const makeSlot = (key: string, descr: string) => {
    const div = document.createElement('div');
    div.classList.add('hotkeyItem');

    const span = document.createElement('span');
    span.id = 'actualHotkey';
    span.textContent = key;
    span.style.padding = '1px 15px';
    span.style.color = 'gold';
    span.addEventListener('click', async (e) => {
        const target = e.target as HTMLElement;
        const newKey = await Prompt(`
        Enter the new key (or keys) you want the hotkey to ${target.parentNode.querySelector('div').textContent} be.

        To enter multiple keys, separate them with a comma [not yet supported]. Values to enter can be found here: http://javascriptkeycode.com/
        `);

        if (newKey.length === 0)
            return Alert(`You didn't enter anything, canceled!`);

        const oldKey = target.textContent.toUpperCase();

        if (hotkeys.has(oldKey)) {
            const old = hotkeys.get(oldKey)!;
            hotkeys.set(newKey, old);

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