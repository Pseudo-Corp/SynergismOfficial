import { DOMCacheGetOrSet } from './Cache/DOM';
const coinText = `
Welcome to Synergism! Here is where you start of course. The start is very simple, use coins to buy buildings and 
upgrades that produce even more coins! Keep doing it until you can do the next feature, you will know when you can see it. :)`
const diamondText = `
Congrats! You have prestiged! Prestiging for the first time unlocks the Diamond layer, which consists of Diamond buildings, 
Diamond upgrades, automation upgrades (for your QoL needs), generator upgrades (powerful), and last but not least RUNES!
Runes will be talked about in a different section.
The diamond upgrades themselves are pretty decent, but a good amount of boost comes from the Diamond buildings! Once bought,
the first tier will make crystals which will boost coin production and every tier after will produce the tier before.
The final item unlocked is a new "prestige" layer, accelerator boosts! They will reset diamond upgrades and your diamonds (NOT
GENERATOR UPGRADES, AUTOMATION, or DIAMOND BUILDINGS) in exchange for a boost to your accelerators. This can be useful at times but
generally resetting more than 3-4 times is not necessary.
`
const associated = new Map<string, string>([
    ['helpCoin', coinText],
    ['helpDiamond', diamondText]
]);
export const displayHelp = (btn: HTMLElement) => {
    for (const e of Array.from(btn.parentElement!.children) as HTMLElement[]) {
            e.style.backgroundColor = (e.id !== btn.id ? '' : 'crimson');
    }
    DOMCacheGetOrSet('helpText').textContent = String(associated.get(btn.id))
}