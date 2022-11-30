import { player, saveSynergy, blankSave, reloadShit, format } from './Synergism';
import { octeractGainPerSecond } from './Calculate';
import { testing, version } from './Config';
import { cleanString, getElementById } from './Utility';
import LZString from 'lz-string';
import { achievementaward } from './Achievements';
import type { Player } from './types/Synergism';
import { Synergism } from './Events';
import { Alert, Confirm, Prompt } from './UpdateHTML';
import { quarkHandler } from './Quark';
import { shopData } from './Shop';
import { addTimers } from './Helper';
import { toggleSubTab, toggleTabs } from './Toggles';
import { btoa } from './Utility';
import { DOMCacheGetOrSet } from './Cache/DOM';
import localforage from 'localforage';
import { Globals as G } from './Variables';
import { singularityData } from './singularity';
import { getEvent } from './Event';
import { synergismStage } from './Statistics';
import ClipboardJS from 'clipboard';
import { octeractData } from './Octeracts';

const format24 = new Intl.DateTimeFormat('EN-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    second: '2-digit'
})
const format12 = new Intl.DateTimeFormat('EN-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hour12: true,
    minute: '2-digit',
    second: '2-digit'
})

const hour = 3600000;

const getRealTime = (type = 'default', use12 = false) => {
    const format = use12 ? format12 : format24;
    const datePartsArr = format
        .formatToParts(new Date())
        .filter((x) => x.type !== 'literal')
        .map(p => ({ [p.type]: p.value }));

    const dateParts = Object.assign({}, ...datePartsArr) as Record<string, string>;

    const period = use12 ? ` ${dateParts.dayPeriod.toUpperCase()}` : '';
    const weekday = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    switch (type) {
        case 'default': return `${dateParts.year}-${dateParts.month}-${dateParts.day} ${dateParts.hour}_${dateParts.minute}_${dateParts.second}${period}`;
        case 'short': return `${dateParts.year}${dateParts.month}${dateParts.day}${dateParts.hour}${dateParts.minute}${dateParts.second}`;
        case 'year': return `${dateParts.year}`;
        case 'month': return `${dateParts.month}`;
        case 'day': return `${dateParts.day}`;
        case 'hour': return `${dateParts.hour}`;
        case 'minute': return `${dateParts.minute}`;
        case 'second': return `${dateParts.second}`;
        case 'period': return `${dateParts.dayPeriod.toUpperCase()}`;
        case 'weekday': return `${weekday[new Date().getUTCDay()]}`;
        default: return type;
    }
}

export const updateSaveString = (input: HTMLInputElement) => {
    const value = input.value.slice(0, 100);
    player.saveString = value === '' ? blankSave.saveString : cleanString(value);
    (DOMCacheGetOrSet('saveStringInput') as HTMLInputElement).value = player.saveString;
}

export const getVer = () => /[\d?=.]+/.exec(version)?.[0] ?? version

export const saveFilename = () => {
    const s = player.saveString
    const t = s.replace(/\$(.*?)\$/g, (_, b) => {
        switch (b) {
            case 'VERSION': return `v${version}`;
            case 'TIME': return getRealTime();
            case 'TIME12': return getRealTime(undefined, true);
            case 'SING': return ('Singularity ' + player.singularityCount);
            case 'SINGS': return ('' + player.singularityCount);
            case 'VER': return getVer();
            case 'TIMES': return getRealTime('short');
            case 'YEAR': return getRealTime('year');
            case 'Y': return getRealTime('year');
            case 'MONTH': return getRealTime('month');
            case 'M': return getRealTime('month');
            case 'DAY': return getRealTime('day');
            case 'D': return getRealTime('day');
            case 'HOUR': return getRealTime('hour');
            case 'H': return getRealTime('hour');
            case 'H12': return getRealTime('hour', true);
            case 'MINUTE': return getRealTime('minute');
            case 'MI': return getRealTime('minute');
            case 'SECOND': return getRealTime('second');
            case 'S': return getRealTime('second');
            case 'PERIOD': return getRealTime('period', true);
            case 'P': return getRealTime('period', true);
            case 'WEEKDAY': return getRealTime('weekday');
            case 'W': return getRealTime('weekday');
            case 'DATE': return '' + Date.now();
            case 'DATES': return '' + Math.floor(Date.now() / 1000);
            case 'QUARK': return '' + Math.floor(Number(player.worlds));
            case 'QUARKS': return format(Number(player.worlds));
            case 'GQ': return '' + Math.floor(player.goldenQuarks);
            case 'GQS': return format(player.goldenQuarks);
            case 'STAGE': return synergismStage(0);
            default: return `${b}`;
        }
    });

    return cleanString(t)
}

export const exportSynergism = async () => {
    player.offlinetick = Date.now();
    const quarkData = quarkHandler();

    let bonusGQMultiplier = 1
    bonusGQMultiplier *= 1 + player.worlds.BONUS / 100
    bonusGQMultiplier *= (player.highestSingularityCount >= 100 ? 1 + player.highestSingularityCount / 50 : 1)
    if (+player.singularityUpgrades.goldenQuarks3.getEffect().bonus > 0) {
        player.goldenQuarks += Math.floor(player.goldenQuarksTimer / (3600 / +player.singularityUpgrades.goldenQuarks3.getEffect().bonus)) * bonusGQMultiplier;
        player.goldenQuarksTimer = player.goldenQuarksTimer % (3600 / +player.singularityUpgrades.goldenQuarks3.getEffect().bonus)
    }
    if (quarkData.gain >= 1) {
        player.worlds.add(quarkData.gain);
        player.quarkstimer = (player.quarkstimer % (3600 / quarkData.perHour))
    }

    const saved = await saveSynergy();

    if (!saved) {
        return
    }

    const toClipboard = getElementById<HTMLInputElement>('saveType').checked;
    const save =
        await localforage.getItem<Blob>('Synergysave2') ??
        localStorage.getItem('Synergysave2');
    const saveString = typeof save === 'string' ? save : await save?.text();

    if (saveString === undefined) {
        return Alert('How?');
    }

    if (toClipboard) {
        try {
            // This can fail for two reasons:
            // - TypeError (browser doesn't support this feature)
            // - Failed to copy (browser limitation; Safari)
            await navigator.clipboard.writeText(saveString)
            DOMCacheGetOrSet('exportinfo').textContent = 'Copied save to clipboard!';
        } catch (err) {
            // So we fallback to the deprecated way of doing it,
            // which isn't limited by any browser.

            // Old/bad browsers (legacy Edge, Safari because of limitations)
            const textArea = document.createElement('textarea');

            textArea.setAttribute('style', 'top: 0; left: 0; position: fixed;');
            // For future Khafra: html5 attributes have no limit in length
            textArea.setAttribute('data-clipboard-text', saveString)

            document.body.appendChild(textArea);
            textArea.focus()
            textArea.select()

            const clipboard = new ClipboardJS(textArea)

            const cleanup = () => {
                clipboard.destroy()
                document.body.removeChild(textArea)
            }

            clipboard.on('success', () => {
                DOMCacheGetOrSet('exportinfo').textContent = 'Copied save to clipboard!'
                cleanup()
            })

            clipboard.on('error', () => {
                DOMCacheGetOrSet('exportinfo').textContent = 'Export failed!'
                void Alert('Unable to write the save to clipboard.').finally(cleanup)
            })
        }
    } else {
        const a = document.createElement('a');
        a.setAttribute('href', 'data:text/plain;charset=utf-8,' + saveString);
        a.setAttribute('download', saveFilename());
        a.setAttribute('id', 'downloadSave');
        // "Starting in Firefox 75, the click() function works even when the element is not attached to a DOM tree."
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/click
        // so let's have it work on older versions of Firefox, doesn't change functionality.
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        DOMCacheGetOrSet('exportinfo').textContent = 'Savefile copied to file!';
    }
    setTimeout(() => DOMCacheGetOrSet('exportinfo').textContent = '', 15_000);
}

export const reloadDeleteGame = async () => {
    await Alert('The next confirmation is to delete the save data\nIf you do not want to delete it, cancel it');
    await resetGame();
}

export const resetGame = async () => {
    const a = window.crypto.getRandomValues(new Uint16Array(1))[0] % 16;
    const b = window.crypto.getRandomValues(new Uint16Array(1))[0] % 16;

    const result = await Prompt(`Answer the question to confirm you'd like to reset: what is ${a}+${b}? (Hint: ${a+b})`)
    if (result === null || Number(result) !== a + b) {
        return Alert('Answer was wrong, not resetting!');
    }

    const hold = Object.assign({}, blankSave, {
        codes: Array.from(blankSave.codes)
    }) as Player;
    //Reset Displays
    toggleTabs('buildings');
    toggleSubTab(1, 0);
    toggleSubTab(4, 0); // Set 'runes' subtab back to 'runes' tab
    toggleSubTab(8, 0); // Set 'cube tribues' subtab back to 'cubes' tab
    toggleSubTab(9, 0); // set 'corruption main'
    toggleSubTab(10, 0); // set 'singularity main'
    toggleSubTab(-1, 0); // set 'statistics main'
    //Import Game
    await importSynergism(btoa(JSON.stringify(hold)), true);
}

export const importSynergism = async (input: string | null, reset = false) => {
    if (typeof input !== 'string') {
        return Alert('Invalid character, could not save! 😕');
    }

    const d = LZString.decompressFromBase64(input);
    const f = d ? JSON.parse(d) as Player : JSON.parse(atob(input)) as Player;

    if (
        (f.exporttest === 'YES!' || f.exporttest === true) ||
        (f.exporttest === false && testing) ||
        (f.exporttest === 'NO!' && testing)
    ) {
        const saveString = btoa(JSON.stringify(f));

        if (saveString === null) {
            return Alert('Unable to import this file!');
        }

        const item = new Blob([saveString], { type: 'text/plain' });
        await localforage.setItem<Blob>('Synergysave2', item);

        localStorage.setItem('saveScumIsCheating', Date.now().toString());

        return reloadShit(reset);
    } else {
        return Alert('You are attempting to load a testing file in a non-testing version!');
    }
}

export const promocodesInfo = async (input: string) => {
    const textElement = DOMCacheGetOrSet('promocodeinfo');
    let textMessage = `'${input}': `;
    let availableUses = 0;
    switch (input) {
        case 'daily':
            textMessage += (player.dailyCodeUsed ? '0 uses' : '1 use') + ' left. Next: end of the day.';
            break;
        case 'add':
            availableUses = addCodeAvailableUses();
            textMessage += availableUses + ' use' + (availableUses !== 1 ? 's' : '') + ' left.';
            if (availableUses === 0) {
                textMessage += ' Next: in ' + format(addCodeTimeToNextUse(), 0) + ' seconds.';
            }
            break;
        case 'time':
            availableUses = timeCodeAvailableUses();
            textMessage += availableUses + ' use' + (availableUses !== 1 ? 's' : '') + ' left.';
            if (availableUses === 0) {
                textMessage += ' Next: in ' + format(timeCodeTimeToNextUse(), 0) + ' seconds.';
            } else {
                textMessage += ' Multiplier: ' + format(timeCodeRewardMultiplier(), 2, true) + 'x';
            }
            break;
        default:
            textMessage = '';
    }

    textElement.textContent = textMessage;
}

export const promocodesPrompt = async () => {
    const input = await Prompt('Got a code? Great! Enter it in (CaSe SeNsItIvE). \n [Note to viewer: this is for events and certain always-active codes. \n May I suggest you type in "synergism2021" or "Khafra" perchance?]');
    void promocodes(input);
}

export const promocodes = async (input: string | null, amount?: number) => {
    const el = DOMCacheGetOrSet('promocodeinfo');

    if (input === null) {
        return Alert('Alright, come back soon!')
    }
    if (input === 'thanksderpsmith' && !player.codes.get(44) && G['isEvent'] && getEvent().name === 'Giving Thanks to Derpsmith') {
        player.codes.set(44, true);
        player.quarkstimer = quarkHandler().maxTime;
        player.goldenQuarksTimer = 3600 * 24;
        addTimers('ascension', 4 * 3600);

        if (player.challenge15Exponent >= 1e15 || player.highestSingularityCount > 0) {
            player.hepteractCrafts.quark.CAP *= 2;
            player.hepteractCrafts.quark.BAL += Math.min(1e13, player.hepteractCrafts.quark.CAP/2)
        }
        if (player.highestSingularityCount > 0) {
            player.singularityUpgrades.goldenQuarks1.freeLevels += 1;
            player.singularityUpgrades.goldenQuarks2.freeLevels += 1;
            player.singularityUpgrades.goldenQuarks3.freeLevels += 1;
            if (player.singularityUpgrades.octeractUnlock.getEffect().bonus) {
                player.octeractUpgrades.octeractGain.freeLevels += 5;
                player.octeractUpgrades.octeractGain2.freeLevels += 3;
                player.octeractUpgrades.octeractQuarkGain.freeLevels += 5;
                player.octeractUpgrades.octeractAscensionsOcteractGain.freeLevels += 0.1
            }
        }

        return Alert(`Happy update!!!! Your Quark timer(s) have been replenished and you have been given 4 real life hours of Ascension progress! 
                      ${(player.challenge15Exponent >= 1e15 || player.highestSingularityCount > 0)? 'Derpsmith also hacked your save to expand Quark Hepteract for free, and (to a limit) automatically filled the extra amount! What a generous, handsome fella.' : ''}
                      ${(player.highestSingularityCount > 0) ? 'You were also given free levels of GQ1-3!' : ''} 
                      ${(player.singularityUpgrades.octeractUnlock.getEffect().bonus) ? 'Finally, you were given free levels of Octeract Geneses, Accumulator and Quark Gain!': ''}`)
    }
    if (input === 'synergism2021' && !player.codes.get(1)) {
        player.codes.set(1, true);
        player.runeshards += 25;
        player.worlds.add(50);
        el.textContent = 'Promo Code \'synergism2021\' Applied! +25 Offerings, +50 Quarks'
    } else if (input === ':unsmith:' && player.achievements[243] < 1) {
        achievementaward(243);
        el.textContent = 'It\'s Spaghetti Time! [Awarded an achievement!!!]';
    } else if (input === ':antismith:' && player.achievements[244] < 1) {
        achievementaward(244);
        el.textContent = 'Hey, isn\'t this just a reference to Antimatter Dimensions? Shh. [Awarded an achievement!!!]';
    } else if (input === 'Khafra' && !player.codes.get(26)) {
        player.codes.set(26, true);
        const quarks = Math.floor(Math.random() * (400 - 100 + 1) + 100);
        player.worlds.add(quarks);
        el.textContent = 'Khafra has blessed you with ' + player.worlds.applyBonus(quarks) + ' Quarks!';
    } else if (input.toLowerCase() === 'daily' && !player.dailyCodeUsed) {
        player.dailyCodeUsed = true;
        let rewardMessage = 'Thank you for playing today!\nThe Ant God rewards you with this gift:';

        const rewards = dailyCodeReward();
        const quarkMultiplier = 1 + Math.min(49, player.highestSingularityCount)

        let actualQuarkAward = player.worlds.applyBonus(rewards.quarks * quarkMultiplier);
        if (actualQuarkAward > 1e5) {
            actualQuarkAward = Math.pow(1e5, 0.75) * Math.pow(actualQuarkAward, 0.25)
        }
        player.worlds.add(actualQuarkAward, false)
        player.goldenQuarks += rewards.goldenQuarks

        rewardMessage += `\n${format(actualQuarkAward, 0, true)} Quarks`
        if (rewards.goldenQuarks > 0) {
            rewardMessage += `\n${format(rewards.goldenQuarks, 0, true)} Golden Quarks`
        }
        await Alert(rewardMessage);

        if (player.highestSingularityCount > 0) {
            const upgradeDistribution: Record<
            'goldenQuarks1' | 'goldenQuarks2' | 'goldenQuarks3' | 'singCubes1' | 'singCubes2' | 'singCubes3' |
            'singOfferings1' | 'singOfferings2' | 'singOfferings3' |
            'singObtainium1' | 'singObtainium2' | 'singObtainium3' | 'ascensions',
            {value: number, pdf: (x: number) => boolean}> = {
                goldenQuarks3: {value: 0.2, pdf: (x: number) => 0 <= x && x <= 1},
                goldenQuarks2: {value: 0.2, pdf: (x: number) => 1 <= x && x <= 3},
                goldenQuarks1: {value: 0.2, pdf: (x: number) => 3 <= x && x <= 10},
                singCubes3: {value: 0.25, pdf: (x: number) => 10 < x && x <= 15},
                singObtainium3: {value: 0.25, pdf: (x: number) => 15 < x && x <= 20},
                singOfferings3: {value: 0.25, pdf: (x: number) => 20 < x && x <= 25},
                singCubes2: {value: 0.5, pdf: (x: number) => 25 < x && x <= 80},
                singObtainium2: {value: 0.5, pdf: (x: number) => 80 < x && x <= 140},
                singOfferings2: {value: 0.5, pdf: (x: number) => 140 < x && x <= 200},
                singCubes1: {value: 1, pdf: (x: number) => 200 < x && x <= 400},
                singObtainium1: {value: 1, pdf: (x: number) => 400 < x && x <= 600},
                singOfferings1: {value: 1, pdf: (x: number) => 600 < x && x <= 800},
                ascensions: {value: 1, pdf: (x: number) => 800 < x && x <= 1000}
            }
            let rolls = 3 * Math.sqrt(player.highestSingularityCount)
            rolls += +player.octeractUpgrades.octeractImprovedDaily.getEffect().bonus
            rolls += player.shopUpgrades.shopImprovedDaily2
            rolls += player.shopUpgrades.shopImprovedDaily3
            rolls += player.shopUpgrades.shopImprovedDaily4
            rolls += (+player.singularityUpgrades.platonicPhi.getEffect().bonus *
                        Math.min(50, 5 * player.singularityCounter / (3600 * 24)))
            rolls += +player.octeractUpgrades.octeractImprovedDaily3.getEffect().bonus
            rolls *= +player.octeractUpgrades.octeractImprovedDaily2.getEffect().bonus
            rolls *= 1 + +player.octeractUpgrades.octeractImprovedDaily3.getEffect().bonus / 200

            if (player.highestSingularityCount >= 200) {
                rolls *= 2
            }

            rolls = Math.floor(rolls)

            const keys = Object
                .keys(player.singularityUpgrades)
                .filter(key => key in upgradeDistribution) as (keyof typeof upgradeDistribution)[];

            rewardMessage = 'Feeling especially generous, the Ant God has also given you free levels of the following Singularity upgrades:'
            // The same upgrade can be drawn several times, so we save the sum of the levels gained, to display them only once at the end
            const freeLevels: Record<string, number> = {}
            for (let i = 0; i < rolls; i++) {
                const num = 1000 * Math.random();
                for (const key of keys) {
                    if (upgradeDistribution[key].pdf(num)) {
                        player.singularityUpgrades[key].freeLevels += upgradeDistribution[key].value
                        freeLevels[key] ? freeLevels[key] += upgradeDistribution[key].value : freeLevels[key] = upgradeDistribution[key].value
                    }
                }
            }

            if (player.highestSingularityCount >= 20) {
                player.singularityUpgrades.goldenQuarks1.freeLevels += 0.2
                freeLevels['goldenQuarks1'] ? freeLevels['goldenQuarks1'] += 0.2 : freeLevels['goldenQuarks1'] = 0.2
                player.singularityUpgrades.goldenQuarks2.freeLevels += 0.2
                freeLevels['goldenQuarks2'] ? freeLevels['goldenQuarks2'] += 0.2 : freeLevels['goldenQuarks2'] = 0.2
                player.singularityUpgrades.goldenQuarks3.freeLevels += 1
                freeLevels['goldenQuarks3'] ? freeLevels['goldenQuarks3'] += 1 : freeLevels['goldenQuarks3'] = 1

            }

            if (player.highestSingularityCount >= 200) {
                player.octeractUpgrades.octeractGain.freeLevels += (player.octeractUpgrades.octeractGain.level / 100)
                freeLevels['octeractGain'] = player.octeractUpgrades.octeractGain.level / 100
            }

            if (player.highestSingularityCount >= 205) {
                player.octeractUpgrades.octeractGain2.freeLevels += (player.octeractUpgrades.octeractGain2.level / 100)
                freeLevels['octeractGain2'] = player.octeractUpgrades.octeractGain2.level / 100
            }

            for (const key of Object.keys(freeLevels)) {
                rewardMessage += dailyCodeFormatFreeLevelMessage(key, freeLevels[key])
            }
            await Alert(rewardMessage);
        }
        return;
    } else if (input.toLowerCase() === 'add') {
        const availableUses = addCodeAvailableUses();
        const maxUses = addCodeMaxUses();
        const timeToNextUse = format(addCodeTimeToNextUse(), 0);
        const timeInterval = addCodeInterval();

        if (availableUses < 1) {
            el.textContent = `You do not have an 'Add' code attempt! You will gain 1 in ${timeToNextUse} seconds.`;
            return;
        }

        let attemptsUsed: string | null = null;
        if (amount) {
            attemptsUsed = amount.toString();
        } else {
            attemptsUsed = await Prompt(`You can use up to ${availableUses} attempts at once. How many would you like to use?`);
        }

        if (attemptsUsed === null) {
            return Alert('No worries, you didn\'t lose any of your uses! Come back later!');
        }
        const toUse = Number(attemptsUsed);
        if (
            Number.isNaN(toUse) ||
            !Number.isInteger(toUse) ||
            toUse <= 0
        ) {
            return Alert('Hey! That\'s not a valid number!');
        }

        const realAttemptsUsed = Math.min(availableUses, toUse);
        let mult = Math.max(0.4 + 0.02 * player.shopUpgrades.calculator3, 2/5 + (window.crypto.getRandomValues(new Uint16Array(2))[0] % 128) / 640); // [0.4, 0.6], slightly biased in favor of 0.4. =)
        mult *= 1 + 0.14 * player.shopUpgrades.calculator // Calculator Shop Upgrade (+14% / level)
        mult *= (player.shopUpgrades.calculator2 === shopData['calculator2'].maxLevel)? 1.25: 1; // Calculator 2 Max Level (+25%)
        const quarkBase = quarkHandler().perHour
        const actualQuarks = Math.floor(quarkBase * mult * realAttemptsUsed)
        const [first, second] = window.crypto.getRandomValues(new Uint8Array(2));

        //Allows storage of up to (24 + 2 * calc2 levels) Add Codes, lol!
        const v = Math.max(Date.now() - (maxUses - realAttemptsUsed) * timeInterval, player.rngCode + timeInterval * realAttemptsUsed)
        const remaining = Math.floor((Date.now() - v) / timeInterval)
        const timeToNext = Math.floor((timeInterval - (Date.now() - v - timeInterval * remaining)) / 1000)

        // Calculator 3: Adds ascension timer.
        const ascMult = (player.singularityUpgrades.expertPack.level > 0) ? 1.2 : 1;
        const ascensionTimer = 60 * player.shopUpgrades.calculator3 * realAttemptsUsed * ascMult;
        const ascensionTimerText = (player.shopUpgrades.calculator3 > 0)
            ? `Thanks to PL-AT Ω you have also gained ${format(ascensionTimer)} real-life seconds to your Ascension Timer!`
            : '';

        // Calculator 5: Adds GQ export timer.
        const gqTimer = 6 * player.shopUpgrades.calculator5 * realAttemptsUsed;
        const gqTimerText = (player.shopUpgrades.calculator5 > 0)
            ? `Thanks to PL-AT Γ you have additionally gained ${format(gqTimer)} real-life seconds to your GQ Export Timer!`
            : '';

        // Calculator 6: Octeract Generation
        const octeractTime = player.shopUpgrades.calculator6 * realAttemptsUsed;
        const octeractTimeText = (player.shopUpgrades.calculator6 > 0)
            ? `Finally, thanks to PL-AT _ you have gained ${format(octeractTime)} seconds of Octeract generation!`
            : '';

        // Midas' Millenium-Aged Gold perk
        const freeLevelsText = (player.highestSingularityCount >= 150)
            ? `Moreover, gain ${format(0.01 * realAttemptsUsed, 2)} free levels of GQ1 and ${format(0.05 * realAttemptsUsed, 2)} free levels of GQ3!!!`
            : '';

        // Calculator Maxed: you don't need to insert anything!
        if (player.shopUpgrades.calculator === shopData['calculator'].maxLevel) {
            player.worlds.add(actualQuarks);
            addTimers('ascension', ascensionTimer)
            player.goldenQuarksTimer += gqTimer
            addTimers('octeracts', octeractTime)

            if (player.highestSingularityCount >= 150) {
                player.singularityUpgrades.goldenQuarks1.freeLevels += 0.01 * realAttemptsUsed
                player.singularityUpgrades.goldenQuarks3.freeLevels += 0.05 * realAttemptsUsed
            }

            player.rngCode = v;
            if (amount) {
                // No message when using Add x1 Special action, we refresh the info message
                void promocodesInfo('add')
                return
            } else {
                return Alert(`Your calculator figured out that ${first} + ${second} = ${first + second} on its own, so you were awarded ${player.worlds.toString(actualQuarks)} Quarks! ` +
                    `${ ascensionTimerText } ${ gqTimerText } ${ octeractTimeText } ${ freeLevelsText } You have ${ remaining } uses of Add. You will gain 1 in ${ timeToNext.toLocaleString(navigator.language) } seconds.`);
            }
        }

        // If your calculator isn't maxed but has levels, it will provide the solution.
        const solution = (player.shopUpgrades.calculator > 0)
            ? 'The answer is ' + (first + second) + ' according to your calculator.'
            : '';

        const addPrompt = await Prompt(`For ${player.worlds.toString(actualQuarks)} Quarks or nothing: What is ${first} + ${second}? ${solution}`);

        if (addPrompt === null) {
            return Alert('No worries, you didn\'t lose any of your uses! Come back later!');
        }

        player.rngCode = v;

        if (first + second === +addPrompt) {
            player.worlds.add(actualQuarks);
            addTimers('ascension', ascensionTimer)
            player.goldenQuarksTimer += gqTimer
            addTimers('octeracts', octeractTime)

            await Alert(`You were awarded ${player.worlds.toString(actualQuarks)} Quarks! ${ascensionTimerText} ${ gqTimerText } ${ octeractTimeText } You have ${remaining} uses of Add. ` +
                `You will gain 1 in ${ timeToNext.toLocaleString(navigator.language) } seconds.`);
        } else {
            await Alert(`You guessed ${addPrompt}, but the answer was ${first + second}. You have ${remaining} uses of Add. You will gain 1 in ${timeToNext.toLocaleString(navigator.language)} seconds.`);
        }

    } else if (input === 'sub') {
        const amount = 1 + window.crypto.getRandomValues(new Uint16Array(1))[0] % 16; // [1, 16]
        const quarks = Number(player.worlds);
        await Alert(`Thanks for using the "sub" code! I've taken away ${amount} Quarks! :)`);

        if (quarks < amount) {
            await Alert(`I gave you ${amount - quarks} Quarks so I could take ${amount} away.`);
        }

        player.worlds.sub(quarks < amount ? amount - quarks : amount);
    } else if (input === 'gamble') {
        if (
            typeof player.skillCode === 'number' ||
            typeof localStorage.getItem('saveScumIsCheating') === 'string'
        ) {
            if (
                (Date.now() - player.skillCode!) / 1000 < 3600 ||
                (Date.now() - Number(localStorage.getItem('saveScumIsCheating'))) / 1000 < 3600
            ) {
                return el.textContent = 'Wait a little bit. We\'ll get back to you when you\'re ready to lose again.';
            }
        }

        const confirmed = await Confirm('Are you sure? The house always wins!');
        if (!confirmed) {
            return el.textContent = 'Scared? You should be!';
        }

        const bet = Number(await Prompt('How many Quarks are you putting up?'));
        if (Number.isNaN(bet) || bet <= 0) {
            return el.textContent = 'Can\'t bet that!';
        } else if (bet > 1e4) {
            return el.textContent = 'Due to cheaters, you can only bet 10k max.';
        } else if (Number(player.worlds) < bet) {
            return el.textContent = 'Can\'t bet what you don\'t have.';
        }

        localStorage.setItem('saveScumIsCheating', Date.now().toString());
        const dice = window.crypto.getRandomValues(new Uint8Array(1))[0] % 6 + 1; // [1, 6]

        if (dice === 1) {
            const won = bet * .25; // lmao
            player.worlds.add(won, false);

            player.skillCode = Date.now();
            return el.textContent = `You won. The Syncasino offers you a grand total of 25% of the pot! [+${won} Quarks]`;
        }

        player.worlds.sub(bet);
        el.textContent = `Try again... you can do it! [-${bet} quarks]`;
    } else if (input === 'time') {
        const availableUses = timeCodeAvailableUses();
        if (availableUses === 0) {
            return Alert(`
            If you imported a save, you cannot use this code for 15 minutes to prevent cheaters.

            Regardless, you must wait at least 15 minutes between each use.
            `);
        }

        const rewardMult = timeCodeRewardMultiplier();

        const random = Math.random() * 15000; // random time within 15 seconds
        const start = Date.now();
        const playerConfirmed = await Confirm(
            'Click the button within the next 15 seconds to test your luck!' +
            ` If you click within ${format(2500 + 125 * player.cubeUpgrades[61], 0, true)} ms of a randomly generated time, you will win a prize!` +
            ` This particular instance has a ${format(rewardMult, 2, true)}x multiplier due to elapsed time between uses.`
        );

        if (playerConfirmed) {
            const diff = Math.abs(Date.now() - (start + random));
            player.promoCodeTiming.time = Date.now();

            if (diff <= (2500 + 125 * player.cubeUpgrades[61])) {
                const reward = Math.floor(Math.min(1000, (125 + 25 * player.highestSingularityCount)) * (1 + player.cubeUpgrades[61] / 50));
                let actualQuarkAward = player.worlds.applyBonus(reward)

                if (actualQuarkAward > 66666) {
                    actualQuarkAward = Math.pow(actualQuarkAward, 0.35) * Math.pow(66666, 0.65)
                }

                player.worlds.add(actualQuarkAward * rewardMult, false);
                return Alert(`You clicked at the right time! [+${format(actualQuarkAward * rewardMult, 0, true)} Quarkies]`);
            } else {
                return Alert('You didn\'t guess the right time, try again soon!');
            }
        }
    } else if (input === 'spoiler') {
        const perSecond = octeractGainPerSecond()
        if (perSecond > 1) {
            return Alert(`You will gain ${format(perSecond, 2, true)} Octeracts (when they come out) every second, assuming you have them unlocked!`)
        } else {
            return Alert(`You will gain an Octeract (when they come out) every ${format(1 / perSecond, 2, true)} seconds, assuming you have them unlocked!`)
        }

    } else {
        el.textContent = 'Your code is either invalid or already used. Try again!'
    }

    const saved = await saveSynergy(); // should fix refresh bug where you can continuously enter promocodes

    if (!saved) {
        return
    }

    Synergism.emit('promocode', input);

    setTimeout(() => el.textContent = '', 15000);
}

const addCodeMaxUses = () : number => {
    let maxUses = 24
    maxUses += 2 * player.shopUpgrades.calculator2
    if (player.shopUpgrades.calculator4 === shopData.calculator4.maxLevel) {
        maxUses += 8
    }
    maxUses += Math.floor(player.shopUpgrades.calculator5 / 10)
    if (player.shopUpgrades.calculator5 === shopData.calculator5.maxLevel) {
        maxUses += 6
    }
    if (player.shopUpgrades.calculator6 === shopData.calculator6.maxLevel) {
        maxUses += 24
    }

    return maxUses
}

const addCodeInterval = () : number => {
    let time = hour
    time *= (1 - 0.02 * player.shopUpgrades.calculator4)
    time *= (1 - Math.min(.5, (player.highestSingularityCount >= 125 ? player.highestSingularityCount / 1000 : 0)
                            + (player.highestSingularityCount >= 200 ? player.highestSingularityCount / 1000 : 0)))
    return time
}

const addCodeAvailableUses = (): number => {
    const maxUses = addCodeMaxUses()
    const timeInterval = addCodeInterval()

    return Math.floor(Math.min(maxUses, (Date.now() - player.rngCode) / timeInterval));
}

const addCodeTimeToNextUse = (): number => {
    return Math.floor(addCodeInterval() + player.rngCode - Date.now())/1000;
}

const timeCodeAvailableUses = (): number => {
    return ((Date.now() - player.promoCodeTiming.time) / 1000 < 900) ? 0 : 1;
}

const timeCodeTimeToNextUse = (): number => {
    return 900 - ((Date.now() - player.promoCodeTiming.time) / 1000);
}

const timeCodeRewardMultiplier = (): number => {
    return Math.min(24, (Date.now() - player.promoCodeTiming.time) / (1000 * 3600));
}

const dailyCodeFormatFreeLevelMessage = (upgradeKey: string, freeLevelAmount: number): string => {
    const upgradeNiceName = (upgradeKey in singularityData) ? singularityData[upgradeKey].name : octeractData[upgradeKey].name;
    return `\n+${freeLevelAmount} extra levels of '${upgradeNiceName}'`;
}

const dailyCodeReward = () => {
    let quarks = 0
    let goldenQuarks = 0

    const ascended = player.ascensionCount > 0;
    const singularity = player.highestSingularityCount > 0;
    if (player.reincarnationCount > 0 || ascended || singularity) {
        quarks += 20
    }
    if (player.challengecompletions[6] > 0 || ascended || singularity) {
        quarks += 20
    }  // 40
    if (player.challengecompletions[7] > 0 || ascended || singularity) {
        quarks += 30
    } // 70
    if (player.challengecompletions[8] > 0 || ascended || singularity) {
        quarks += 30
    } // 100
    if (player.challengecompletions[9] > 0 || ascended || singularity) {
        quarks += 40
    } // 140
    if (player.challengecompletions[10] > 0 || ascended || singularity) {
        quarks += 60
    } // 200
    if (ascended || singularity) {
        quarks += 50
    } // 250
    if (player.challengecompletions[11] > 0 || singularity) {
        quarks += 50
    } // 300
    if (player.challengecompletions[12] > 0 || singularity) {
        quarks += 50
    } // 350
    if (player.challengecompletions[13] > 0 || singularity) {
        quarks += 50
    } // 400
    if (player.challengecompletions[14] > 0 || singularity) {
        quarks += 100
    } // 500
    if (player.researches[200] === G['researchMaxLevels'][200]) {
        quarks += 250
    } // 750
    if (player.cubeUpgrades[50] === 100000) {
        quarks += 250
    } // 1000
    if (player.platonicUpgrades[5] > 0) {
        quarks += 250
    } // 1250
    if (player.platonicUpgrades[10] > 0) {
        quarks += 500
    } // 1750
    if (player.platonicUpgrades[15] > 0) {
        quarks += 750
    } // 2500
    if (player.challenge15Exponent > 1e18) {
        quarks += Math.floor(1000 * (Math.log10(player.challenge15Exponent) - 18))
    } // at least 2500
    if (player.platonicUpgrades[20] > 0) {
        quarks += 2500
    } // at least 5k

    quarks *= 1 + 0.05 * player.shopUpgrades.shopImprovedDaily
    quarks = Math.floor(quarks)

    if (singularity) {
        goldenQuarks += 2 + 3 * player.highestSingularityCount
        goldenQuarks *= 1 + 0.2 * player.shopUpgrades.shopImprovedDaily2
        goldenQuarks *= 1 + 0.15 * player.shopUpgrades.shopImprovedDaily3
        goldenQuarks *= 1 + player.shopUpgrades.shopImprovedDaily4
    }

    return {
        quarks: quarks,
        goldenQuarks: goldenQuarks
    }
}

export const handleLastModified = (lastModified: number) => {
    const localStorageFirstPlayed = localStorage.getItem('firstPlayed')
    const lastModifiedDate = new Date(lastModified)

    if (localStorageFirstPlayed === null) {
        localStorage.setItem('firstPlayed', lastModifiedDate.toISOString())
        return
    }

    const localFirstPlayedDate = new Date(localStorageFirstPlayed)

    // The larger the ms value, the newer the file.
    // So if the current oldest date is newer than the last modified date
    // for the new file, set the oldest date to the last modified.
    if (localFirstPlayedDate.getTime() > lastModifiedDate.getTime()) {
        player.firstPlayed = lastModifiedDate.toISOString()
        localStorage.setItem('firstPlayed', player.firstPlayed)
    }
}