import { calculateTimeAcceleration } from "./Calculate"
import player from "./Synergism";

/** getMaxQuarkTime returns the maximum counter for player.quarkstimer (in seconds)
 *  Does not take parameters, returns a number. Function is used in addTimers()
 */
export const getMaxQuarkTime = () => {

    // The base time is 25 hours
    let time = 90000;

    // Research 8x20, and adds +12.5 hours per level, with a cap of +25 hours at level 2.
    time += 45000 * player.researches[195];

    // Returns number.
    return time

}

/** addTimers adds (in milliseconds) time to in-game timers for reset tiers prestige, transcension, reincarnation
 *  ascension and quarks. Ascension and Quarks ignore global time multipliers.
 *  Takes in a string and a number and outputs null
*/
export const addTimers = (input: string, time: number) => {

    let timeMultiplier = (input == "ascension" || input == "quarks")? 1: calculateTimeAcceleration();
    switch(input){
        case "prestige":
            player.prestigecounter += time * timeMultiplier;
            break;
        case "transcension":
            player.transcendcounter += time * timeMultiplier;
            break;
        case "reincarnation":
            player.reincarnationcounter += time * timeMultiplier;
            break;
        case "ascension":
            player.ascensionCounter += time * timeMultiplier;
            break;
        case "quarks":
            // First get maximum Quark Clock (25h, up to +25 from Research 8x20)
            let maxQuarkTimer = getMaxQuarkTime()
            player.quarkstimer += time * timeMultiplier;
            // Checks if this new time is greater than maximum, in which it will default to that time.
            // Otherwise returns itself.
            player.quarkstimer = (player.quarkstimer > maxQuarkTimer)? maxQuarkTimer: player.quarkstimer;
            break;
    }


}