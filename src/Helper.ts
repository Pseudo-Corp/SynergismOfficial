import { sacrificeAnts } from "./Ants";
import { calculateAutomaticObtainium, calculateMaxRunes, calculateObtainium, calculateTimeAcceleration } from "./Calculate"
import { hepteractEffective } from "./Hepteracts";
import { quarkHandler } from "./Quark";
import { redeemShards } from "./Runes";
import { player } from "./Synergism";
import { visualUpdateResearch } from "./UpdateVisuals";
import { sumContents } from "./Utility";
import { Globals as G } from './Variables';

type TimerInput = 'prestige' | 'transcension' | 'reincarnation' | 'ascension' | 'quarks';

/**
 * addTimers will add (in milliseconds) time to the reset counters, and quark export timer
 * @param input 
 * @param time 
 */
export const addTimers = (input: TimerInput, time?: number) => {
    const timeMultiplier = (input === "ascension" || input === "quarks") ? 1 : calculateTimeAcceleration();

    switch(input){
        case "prestige": {
            player.prestigecounter += time * timeMultiplier;
            break;
        }
        case "transcension": {
            player.transcendcounter += time * timeMultiplier;
            break;
        }
        case "reincarnation": {
            player.reincarnationcounter += time * timeMultiplier;
            break;
        }
        case "ascension": {
            let multiplier = 1 + player.shopUpgrades.chronometer / 100
            multiplier *=  (1 + 0.6/1000 * hepteractEffective('chronos'))
            if (player.achievements[259] > 0)
                multiplier *= 1.25
            if (player.achievements[262] > 0)
                multiplier *= (1 + Math.min(0.10, 1/100 * Math.log10(player.ascensionCount + 1)))
            if (player.achievements[263] > 0)
                multiplier *= (1 + Math.min(0.10, 1/100 * Math.log10(player.ascensionCount + 1)))
            if (player.platonicUpgrades[15] > 0)
                multiplier *= (1 + 0.002 * sumContents(player.usedCorruptions))
            player.ascensionCounter += time * timeMultiplier * multiplier;
            break;
        }
        case "quarks": {
            // First get maximum Quark Clock (25h, up to +25 from Research 8x20)
            const maxQuarkTimer = quarkHandler().maxTime
            player.quarkstimer += time * timeMultiplier;
            // Checks if this new time is greater than maximum, in which it will default to that time.
            // Otherwise returns itself.
            player.quarkstimer = (player.quarkstimer > maxQuarkTimer) ? maxQuarkTimer : player.quarkstimer;
            break;
        }
    }
}

/**
 * checkMaxRunes returns how many unique runes are at the maximum level.
 * Does not take in params, returns a number equal to number of maxxed runes.
 */
export const checkMaxRunes = () => {
    let maxxed = 0;
    for (let i = 1; i <= 5; i++) {
        if (player.runelevels[i - 1] >= calculateMaxRunes(i))
            maxxed++;
    }
    return maxxed
}

type AutoToolInput = 'addObtainium' | 'addOfferings' | 'runeSacrifice' | 'antSacrifice';

/**
 * Assortment of tools which are used when actions are automated.
 * @param input 
 * @param time 
 */
export const automaticTools = (input: AutoToolInput, time: number) => {
    const timeMultiplier = (input === "runeSacrifice" || input === "addOfferings") ? 1 : calculateTimeAcceleration()

    switch(input){
        case "addObtainium": {
            //Update Obtainium Multipliers + Amount to gain
            calculateObtainium();
            const obtainiumGain = calculateAutomaticObtainium();
            //Add Obtainium
            player.researchPoints += obtainiumGain * time * timeMultiplier;
            //Update visual displays if appropriate
            if (G['currentTab'] === "researches") {
                visualUpdateResearch();
            }
            break;
        }
        case "addOfferings":
            //This counter can be increased through challenge 3 reward
            //As well as cube upgrade 1x2 (2).
            G['autoOfferingCounter'] += time;
            //Any time this exceeds 1 it adds an offering
            player.runeshards += Math.floor(G['autoOfferingCounter']);
            G['autoOfferingCounter'] %= 1;
            break;
        case "runeSacrifice":
            //Every real life second this will trigger
            player.sacrificeTimer += time;
            if (player.sacrificeTimer >= 1){
                // If you bought cube upgrade 2x10 then it sacrifices to all runes equally
                if(player.cubeUpgrades[20] === 1){
                    const notMaxed = (5 - checkMaxRunes());
                    if(notMaxed > 0){
                        const baseAmount = Math.floor(player.runeshards / notMaxed);
                        for (let i = 0; i < 5; i++) {
                            redeemShards(i+1, true, baseAmount);
                        }
                    }
                }
                // If you did not buy cube upgrade 2x10 it sacrifices to selected rune.
                else{
                    const rune = player.autoSacrifice;
                    redeemShards(rune, true, 0);
                }
                //Modulo used in event of a large delta time (this could happen for a number of reasons)
                player.sacrificeTimer %= 1
            }
            break;
        case "antSacrifice": {
            // Increments real and 'fake' timers. the Real timer is on real life seconds.
            player.antSacrificeTimer += time * timeMultiplier;
            player.antSacrificeTimerReal += time

            //Equal to real time iff "Real Time" option selected in ants tab.
            const antSacrificeTimer = (player.autoAntSacrificeMode === 2) ?
            player.antSacrificeTimerReal : player.antSacrificeTimer;

            if (antSacrificeTimer >= player.autoAntSacTimer && player.researches[124] === 1 
                && player.autoAntSacrifice && player.antPoints.gte("1e40")) {
                sacrificeAnts(true)
            }
            break;
        }
    }
}