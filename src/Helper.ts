import { sacrificeAnts } from './Ants';
import { calculateAscensionAcceleration, calculateAutomaticObtainium, calculateMaxRunes, calculateObtainium, calculateTimeAcceleration, octeractGainPerSecond } from './Calculate'
import { quarkHandler } from './Quark';
import { redeemShards, unlockedRune, checkMaxRunes } from './Runes';
import { player } from './Synergism';
import { visualUpdateOcteracts, visualUpdateResearch } from './UpdateVisuals';
import { Globals as G } from './Variables';
import { buyAllBlessings } from './Buy';
import { buyAllTalismanResources } from './Talismans'
import { useConsumable, shopData} from './Shop';

type TimerInput = 'prestige' | 'transcension' | 'reincarnation' | 'ascension' |
                  'quarks' | 'goldenQuarks' | 'singularity' | 'octeracts' |
                  'autoPotion'

/**
 * addTimers will add (in milliseconds) time to the reset counters, and quark export timer
 * @param input
 * @param time
 */
export const addTimers = (input: TimerInput, time = 0) => {
    const timeMultiplier = (input === 'ascension' || input === 'quarks' || input === 'goldenQuarks' ||
                            input === 'singularity' || input === 'octeracts' || input === 'autoPotion') ? 1 : calculateTimeAcceleration();

    switch (input){
        case 'prestige': {
            player.prestigecounter += time * timeMultiplier;
            break;
        }
        case 'transcension': {
            player.transcendcounter += time * timeMultiplier;
            break;
        }
        case 'reincarnation': {
            player.reincarnationcounter += time * timeMultiplier;
            break;
        }
        case 'ascension': { //Anything in here is affected by add code
            player.ascensionCounter += time * timeMultiplier * calculateAscensionAcceleration();
            player.ascensionCounterReal += time * timeMultiplier;
            break;
        }
        case 'singularity': {
            player.ascensionCounterRealReal += time;
            player.singularityCounter += time * timeMultiplier;
            break;
        }
        case 'quarks': {
            // First get maximum Quark Clock (25h, up to +25 from Research 8x20)
            const maxQuarkTimer = quarkHandler().maxTime
            player.quarkstimer += time * timeMultiplier;
            // Checks if this new time is greater than maximum, in which it will default to that time.
            // Otherwise returns itself.
            player.quarkstimer = (player.quarkstimer > maxQuarkTimer) ? maxQuarkTimer : player.quarkstimer;
            break;
        }
        case 'goldenQuarks': {
            if (+player.singularityUpgrades.goldenQuarks3.getEffect().bonus === 0) {
                return
            } else {
                player.goldenQuarksTimer += time * timeMultiplier;
                player.goldenQuarksTimer = (player.goldenQuarksTimer > 3600 * 168) ? 3600 * 168 : player.goldenQuarksTimer;
            }
            break;
        }
        case 'octeracts': {
            if (!player.singularityUpgrades.octeractUnlock.getEffect().bonus) {
                return
            } else {
                player.octeractTimer += time * timeMultiplier
            }
            if (player.octeractTimer >= 1) {
                const amountOfGiveaways = player.octeractTimer - (player.octeractTimer % 1)
                player.octeractTimer %= 1

                const perSecond = octeractGainPerSecond()
                player.wowOcteracts += amountOfGiveaways * perSecond
                player.totalWowOcteracts += amountOfGiveaways * perSecond
                visualUpdateOcteracts()
            }
            break;
        }
        case 'autoPotion': {
            if (player.highestSingularityCount < 6) {
                return
            } else {
                player.autoPotionTimer += time * timeMultiplier
                const timerThreshold = 60 * Math.pow(1.03, -player.highestSingularityCount) / +player.octeractUpgrades.octeractAutoPotionSpeed.getEffect().bonus

                if (player.autoPotionTimer >= timerThreshold) {
                    const amountOfPotions = (player.autoPotionTimer - (player.autoPotionTimer % timerThreshold)) / timerThreshold
                    player.autoPotionTimer %= timerThreshold
                    if (player.toggles[42] === true) {
                        player.shopUpgrades.offeringPotion += amountOfPotions * +player.octeractUpgrades.octeractAutoPotionEfficiency.getEffect().bonus / 5
                        if (player.shopUpgrades.offeringPotion > shopData.offeringPotion.maxLevel) {
                            player.shopUpgrades.offeringPotion = shopData.offeringPotion.maxLevel
                        }
                        void useConsumable('offeringPotion', true, amountOfPotions)
                    }
                    if (player.toggles[43] === true) {
                        player.shopUpgrades.obtainiumPotion += amountOfPotions * +player.octeractUpgrades.octeractAutoPotionEfficiency.getEffect().bonus / 5
                        if (player.shopUpgrades.obtainiumPotion > shopData.obtainiumPotion.maxLevel) {
                            player.shopUpgrades.obtainiumPotion = shopData.obtainiumPotion.maxLevel
                        }
                        void useConsumable('obtainiumPotion', true, amountOfPotions)
                    }
                }
            }
            break;
        }
    }
}

type AutoToolInput = 'addObtainium' | 'addOfferings' | 'runeSacrifice' | 'antSacrifice';

/**
 * Assortment of tools which are used when actions are automated.
 * @param input
 * @param time
 */
export const automaticTools = (input: AutoToolInput, time: number) => {
    const timeMultiplier = (input === 'runeSacrifice' || input === 'addOfferings') ? 1 : calculateTimeAcceleration()

    switch (input){
        case 'addObtainium': {
            // If in challenge 14, abort and do not award obtainium
            if (player.currentChallenge.ascension === 14) {
                break;
            }
            //Update Obtainium Multipliers + Amount to gain
            calculateObtainium();
            const obtainiumGain = calculateAutomaticObtainium();
            //Add Obtainium
            player.researchPoints = Math.min(1e300, player.researchPoints + obtainiumGain * time * timeMultiplier);
            //Update visual displays if appropriate
            if (G['currentTab'] === 'researches') {
                visualUpdateResearch();
            }
            break;
        }
        case 'addOfferings':
            //This counter can be increased through challenge 3 reward
            //As well as cube upgrade 1x2 (2).
            G['autoOfferingCounter'] += time;
            //Any time this exceeds 1 it adds an offering
            player.runeshards = Math.min(1e300, player.runeshards + Math.floor(G['autoOfferingCounter']));
            G['autoOfferingCounter'] %= 1;
            break;
        case 'runeSacrifice':
            //Every real life second this will trigger
            player.sacrificeTimer += time;
            if (player.sacrificeTimer >= 1 && isFinite(player.runeshards) && player.runeshards > 0){
                // Automatic purchase of Blessings
                if (player.singularityCount >= 15) {
                    let ratio = 4;
                    if (player.toggles[36] === true) {
                        buyAllBlessings('Blessings', 100 / ratio, true);
                        ratio--;
                    }
                    if (player.toggles[37] === true) {
                        buyAllBlessings('Spirits', 100 / ratio, true);
                        ratio--;
                    }
                }
                if (player.autoBuyFragment && player.singularityCount >= 40 && player.cubeUpgrades[51] > 0) {
                    buyAllTalismanResources();
                }

                // If you bought cube upgrade 2x10 then it sacrifices to all runes equally
                if (player.cubeUpgrades[20] === 1){
                    const maxi = player.singularityCount >= 50 ? 7 : (player.singularityCount >= 30 ? 6 : 5);
                    const notMaxed = (maxi - checkMaxRunes(maxi));
                    if (notMaxed > 0){
                        const baseAmount = Math.floor(player.runeshards / notMaxed / 2);
                        for (let i = 0; i < maxi; i++) {
                            if (!(!unlockedRune(i + 1) || player.runelevels[i] >= calculateMaxRunes(i + 1))) {
                                redeemShards(i + 1, true, baseAmount);
                            }
                        }
                    }
                } else {
                    // If you did not buy cube upgrade 2x10 it sacrifices to selected rune.
                    const rune = player.autoSacrifice;
                    redeemShards(rune, true, 0);
                }
                //Modulo used in event of a large delta time (this could happen for a number of reasons)
                player.sacrificeTimer %= 1
            }
            break;
        case 'antSacrifice': {
            // Increments real and 'fake' timers. the Real timer is on real life seconds.
            player.antSacrificeTimer += time * timeMultiplier;
            player.antSacrificeTimerReal += time

            //Equal to real time iff "Real Time" option selected in ants tab.
            const antSacrificeTimer = (player.autoAntSacrificeMode === 2) ?
                player.antSacrificeTimerReal : player.antSacrificeTimer;

            if (antSacrificeTimer >= player.autoAntSacTimer && player.antSacrificeTimerReal > 0.1 && player.researches[124] === 1
                && player.autoAntSacrifice && player.antPoints.gte('1e40')) {
                void sacrificeAnts(true)
            }
            break;
        }
    }
}
