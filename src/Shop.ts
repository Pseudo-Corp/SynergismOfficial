import { player, format } from './Synergism';
import { Globals as G } from './Variables';
import { revealStuff } from './UpdateHTML';
import { calculateTimeAcceleration } from './Calculate';

/* === CHANGELOG, 1.21.2021 ===
1) Offering vals: (level)^2 / 200 ->  level/25
2) Obtainium vals: (level^2) / 100 -> level/25
3) Ant Speed: (1.5^level) -> (1.125^level)
4) Season Pass: (3 * level/100) -> (3 * level/200)
   Season Pass also now affects tesseracts.
*/
const offerconsumedesc = "Instantly gain 2 real life hours of Offerings, based on your all time best Offerings/sec and speed acceleration!"
const obtainiumconsumedesc = "Instantly gain 2 real life hours of Obtainium, based on your all time best Obtainium/sec and speed acceleration!"

const offertimerdesc = "Gain +4% more offerings from all sources!"
const offerautodesc = "Automatically pour Offerings into a rune. 1st level unlocks feature, and each level increases Offering gain by 2%. Every second, 2^(Level) levels worth of offerings are spent. [First Level Cannot be refunded!]"
const obtainiumtimerdesc = "Gain +4% more obtainium from all sources!"
const obtainiumautodesc = "Automatically pour Obtainium into a research. 1st level unlocks feature, and each level increases Obtainium gain by 2%. Every reincarnation, dump all Obtainium into research until maxed. [First Level Cannot be Refunded!]"
const instantchallengedesc = "T and R challenges don't cause resets if retry is enabled and gain up to 10 completions per tick. Addtionally, instantly gain T challenge completions up to highest completed when exiting R challenges. [Cannot be Refunded!]"
const cashgrabdesc = "This is a cash grab but it gives a couple cool stats. +1% production per level to Offerings and Obtainium."
const antspeeddesc = "Each level gives a 1.125x speed multiplier to all Ant tiers' production! Short and simple."
const shoptalismandesc = "Permanently unlock a Shop talisman! [Warning: you can't refund this and this is VERY expensive to level. Be sure you want to buy it!]"
const challengeExtDesc = "Using some amazing trick, you manage to increase your Reincarnation Challenge cap by 2 for each level! [Cannot be Refunded!]"
const challenge10TomeDesc = "The extended cut: This fifth forgotten tome gives you an additional 20 Million exponent reduction on the Challenge 10 requirement per level."
const seasonPassDesc = "Wow! Cubes is giving you a deal: Buy this totally fair Season Pass and gain +1.5% cubes and tesseracts per level when you ascend!"
const cubeToQuarkDesc = "Instead of a daily cap of 25 Quarks by opening Wow! Cubes, how about 100? This adds 75 to the daily cap! [Cannot be Refunded!]"
const tesseractToQuarkDesc = "Instead of a daily cap of 25 Quarks by opening Wow! Tesseracts, how about 100? This adds 75 to the daily cap! [Cannot be Refunded!]"
const hypercubeToQuarkDesc = "Instead of a daily cap of 25 Quarks by opening Wow! Hypercubes, how about 100? This adds 75 to the daily cap! [Cannot be Refunded!]"

//Names of shop upgrades || Top row indicates potions, and all other upgrades are labeled in order.
//If you are adding more upgrades please make sure the order of labelled upgrades is correct!
type ShopUpgradeNames = 'offeringPotion' | 'obtainiumPotion' |
                        'offeringEX' | 'offeringAuto' | 'obtainiumEX' | 'obtainiumAuto' | 'instantChallenge' |
                        'antSpeed' | 'cashGrab' | 'shopTalisman' | 'seasonPass' | 'challengeExtension' |
                        'challengeTome' | 'cubeToQuark' | 'tesseractToQuark' | 'hypercubeToQuark'

export const shopDescriptions = (input: ShopUpgradeNames) => {
    const rofl = document.getElementById("quarkdescription");
    const lmao = document.getElementById("quarkcost");
    const lol = document.getElementById("quarkeffect");

    switch (input) {
        case "offeringPotion":
            rofl.textContent = offerconsumedesc;
            lmao.textContent = "Cost: " + G['shopBaseCosts'].offerPotion + " Quarks.";
            lol.textContent = "Gain " + format((7200 * player.offeringpersecond * calculateTimeAcceleration()), 0, true) + " Offerings."
            break;
        case "obtainiumPotion":
            rofl.textContent = obtainiumconsumedesc;
            lmao.textContent = "Cost: " + G['shopBaseCosts'].obtainiumPotion + " Quarks.";
            lol.textContent = "Gain " + format((7200 * player.maxobtainiumpersecond * calculateTimeAcceleration()), 0, true) + " Obtainium.";
            break;
        case "offeringEX":
            rofl.textContent = offertimerdesc;
            lmao.textContent = "Cost: " + (G['shopBaseCosts'].offerTimer + 10 * player.shopUpgrades.offeringTimerLevel) + " Quarks."
            lol.textContent = "CURRENT Effect: You will gain " + format(4 * player.shopUpgrades.offeringTimerLevel,2,true) + "% more Offerings!"
            break;
        case "offeringAuto":
            rofl.textContent = offerautodesc;
            lmao.textContent = "Cost: " + (G['shopBaseCosts'].offerAuto + 10 * player.shopUpgrades.offeringAutoLevel) + " Quarks."
            lol.textContent = "CURRENT Effect: Per 10 seconds, pour " + format(Math.pow(2, 1 + player.shopUpgrades.offeringAutoLevel)) + " Offerings. +" + format(2 * player.shopUpgrades.offeringAutoLevel, 2) + "% Offerings."
            break;
        case "obtainiumEX":
            rofl.textContent = obtainiumtimerdesc;
            lmao.textContent = "Cost: " + (G['shopBaseCosts'].obtainiumTimer + 10 * player.shopUpgrades.obtainiumTimerLevel) + " Quarks."
            lol.textContent = "CURRENT Effect: You will gain " + format(4 * player.shopUpgrades.obtainiumTimerLevel,2,true) + "% more Obtainium!"
            break;
        case "obtainiumAuto":
            rofl.textContent = obtainiumautodesc;
            lmao.textContent = "Cost: " + (G['shopBaseCosts'].obtainiumAuto + 10 * player.shopUpgrades.obtainiumAutoLevel) + " Quarks."
            lol.textContent = "CURRENT Effect: Try to upgrade research each reincarnation, and gain " + format(player.shopUpgrades.obtainiumAutoLevel * 2, 2) + "% more Obtainium."
            break;
        case "instantChallenge":
            rofl.textContent = instantchallengedesc;
            lmao.textContent = "Cost: " + (G['shopBaseCosts'].instantChallenge) + " Quarks."
            lol.textContent = "CURRENT Effect: Even in a premium shop it's kinda obvious, right?"
            break;
        case "antSpeed":
            rofl.textContent = antspeeddesc;
            lmao.textContent = "Cost: " + (G['shopBaseCosts'].antSpeed + 25 * player.shopUpgrades.antSpeedLevel) + " Quarks."
            lol.textContent = "CURRENT Effect: All Ants' Speed x" + format(Math.pow(1.125, player.shopUpgrades.antSpeedLevel), 2)
            break;
        case "cashGrab":
            rofl.textContent = cashgrabdesc;
            lmao.textContent = "Cost: " + (G['shopBaseCosts'].cashGrab + 40 * player.shopUpgrades.cashGrabLevel) + " Quarks."
            lol.textContent = "CURRENT Effect: You will gain " + format(player.shopUpgrades.cashGrabLevel, 2) + "% more Obtainium and Offerings!"
            break;
        case "shopTalisman":
            rofl.textContent = shoptalismandesc;
            lmao.textContent = "Cost: " + (1500) + " Quarks."
            lol.textContent = "CURRENT Effect: Even in a premium shop it's kinda obvious, right?"
            break;
        case "seasonPass":
            rofl.textContent = seasonPassDesc;
            lmao.textContent = "Cost: " + (G['shopBaseCosts'].seasonPass + 75 * player.shopUpgrades.seasonPassLevel) + " Quarks."
            lol.textContent = "CURRENT Effect: Ascensions give " + format(3 / 2 * player.shopUpgrades.seasonPassLevel) + "% more Wow! Cubes and Tesseracts."
            break;
        case "challengeExtension":
            rofl.textContent = challengeExtDesc;
            lmao.textContent = "Cost: " + (G['shopBaseCosts'].challengeExtension + 250 * player.shopUpgrades.challengeExtension) + " Quarks."
            lol.textContent = "CURRENT Effect: Reincarnation Challenges may be completed an additional " + format(2*player.shopUpgrades.challengeExtension) + " times."
            break;
        case "challengeTome":
            rofl.textContent = challenge10TomeDesc;
            lmao.textContent = "Cost: " + (G['shopBaseCosts'].challenge10Upgrade + 250 * player.shopUpgrades.challenge10Tomes) + " Quarks."
            lol.textContent = "CURRENT Effect: Challenge 10 Exponent Requirement reduced by " + format(20*player.shopUpgrades.challenge10Tomes) + " Million."
            break;
        case "cubeToQuark":
            rofl.textContent = cubeToQuarkDesc;
            lmao.textContent = "Cost: " + (G['shopBaseCosts'].cubeToQuark) + " Quarks."
            lol.textContent = "CURRENT Effect: Even in a premium shop it's kinda obvious, right?"
            break;
        case "tesseractToQuark":
            rofl.textContent = tesseractToQuarkDesc;
            lmao.textContent = "Cost: " + (G['shopBaseCosts'].tesseractToQuark) + " Quarks."
            lol.textContent = "CURRENT Effect: Even in a premium shop it's kinda obvious, right?"
            break;
        case "hypercubeToQuark":
            rofl.textContent = hypercubeToQuarkDesc;
            lmao.textContent = "Cost: " + (G['shopBaseCosts'].hypercubeToQuark) + " Quarks."
            lol.textContent = "CURRENT Effect: Even in a premium shop it's kinda obvious, right?"
            break;
    }

}

export const buyShopUpgrades = (input: ShopUpgradeNames) => {
    let p = true;
    if (G['shopConfirmation']) {
        p = confirm("Are you sure of your purchase?")
    }

    if (p) {
        switch (input) {
            case "offeringPotion":
                if (player.worlds >= G['shopBaseCosts'].offerPotion) {
                    player.worlds -= 100;
                    player.shopUpgrades.offeringPotion += 1;
                }
                break;
            case "obtainiumPotion":
                if (player.worlds >= G['shopBaseCosts'].obtainiumPotion) {
                    player.worlds -= 100;
                    player.shopUpgrades.obtainiumPotion += 1;
                }
                break;
            case "offeringEX":
                if (player.worlds >= (G['shopBaseCosts'].offerTimer + 10 * player.shopUpgrades.offeringTimerLevel) && player.shopUpgrades.offeringTimerLevel < 100) {
                    player.worlds -= (G['shopBaseCosts'].offerTimer + 10 * player.shopUpgrades.offeringTimerLevel);
                    player.shopUpgrades.offeringTimerLevel += 1;
                }
                break;
            case "offeringAuto":
                if (player.worlds >= (G['shopBaseCosts'].offerAuto + 10 * player.shopUpgrades.offeringAutoLevel) && player.shopUpgrades.offeringAutoLevel < 100) {
                    player.worlds -= (G['shopBaseCosts'].offerAuto + 10 * player.shopUpgrades.offeringAutoLevel);
                    player.shopUpgrades.offeringAutoLevel += 1;
                }
                break;
            case "obtainiumEX":
                if (player.worlds >= (G['shopBaseCosts'].obtainiumTimer + 10 * player.shopUpgrades.obtainiumTimerLevel) && player.shopUpgrades.obtainiumTimerLevel < 100) {
                    player.worlds -= (G['shopBaseCosts'].obtainiumTimer + 10 * player.shopUpgrades.obtainiumTimerLevel);
                    player.shopUpgrades.obtainiumTimerLevel += 1;
                }
                break;
            case "obtainiumAuto":
                if (player.worlds >= (G['shopBaseCosts'].obtainiumAuto + 10 * player.shopUpgrades.obtainiumAutoLevel) && player.shopUpgrades.obtainiumAutoLevel < 100) {
                    player.worlds -= (G['shopBaseCosts'].obtainiumAuto + 10 * player.shopUpgrades.obtainiumAutoLevel);
                    player.shopUpgrades.obtainiumAutoLevel += 1;
                }
                break;

            case "instantChallenge":
                if (player.worlds >= G['shopBaseCosts'].instantChallenge && !player.shopUpgrades.instantChallengeBought) {
                    player.worlds -= 300;
                    player.shopUpgrades.instantChallengeBought = true;
                }
                break;
            case "antSpeed":
                if (player.worlds >= (G['shopBaseCosts'].antSpeed + 25 * player.shopUpgrades.antSpeedLevel) && player.shopUpgrades.antSpeedLevel < 100) {
                    player.worlds -= (G['shopBaseCosts'].antSpeed + 25 * player.shopUpgrades.antSpeedLevel);
                    player.shopUpgrades.antSpeedLevel += 1;
                }
                break;
            case "cashGrab":
                if (player.worlds >= (G['shopBaseCosts'].cashGrab + 40 * player.shopUpgrades.cashGrabLevel) && player.shopUpgrades.cashGrabLevel < 100) {
                    player.worlds -= (G['shopBaseCosts'].cashGrab + 40 * player.shopUpgrades.cashGrabLevel);
                    player.shopUpgrades.cashGrabLevel += 1;
                }
                break;
            case "shopTalisman":
                if (player.worlds >= 1500 && !player.shopUpgrades.talismanBought) {
                    player.worlds -= 1500;
                    player.shopUpgrades.talismanBought = true;
                }
                break;
            case "seasonPass":
                if (player.worlds >= (G['shopBaseCosts'].seasonPass + 75 * player.shopUpgrades.seasonPassLevel) && player.shopUpgrades.seasonPassLevel < 100) {
                    player.worlds -= (G['shopBaseCosts'].seasonPass + 75 * player.shopUpgrades.seasonPassLevel);
                    player.shopUpgrades.seasonPassLevel += 1;
                }
                break;
            case "challengeExtension":
                if (player.worlds >= (G['shopBaseCosts'].challengeExtension + 250 * player.shopUpgrades.challengeExtension) && player.shopUpgrades.challengeExtension < 5) {
                    player.worlds -= (G['shopBaseCosts'].challengeExtension + 250 * player.shopUpgrades.challengeExtension);
                    player.shopUpgrades.challengeExtension += 1;
                }
                break;
            case "challengeTome":
                if (player.worlds >= (G['shopBaseCosts'].challenge10Upgrade + 250 * player.shopUpgrades.challenge10Tomes) && player.shopUpgrades.challenge10Tomes < 15) {
                    player.worlds -= (G['shopBaseCosts'].challenge10Upgrade + 250 * player.shopUpgrades.challenge10Tomes);
                    player.shopUpgrades.challenge10Tomes += 1;
                }
                break;
            case "cubeToQuark":
                if (player.worlds >= (G['shopBaseCosts'].cubeToQuark) && !player.shopUpgrades.cubeToQuarkBought) {
                    player.worlds -= (G['shopBaseCosts'].cubeToQuark);
                    player.shopUpgrades.cubeToQuarkBought = true;
                }
                break;
            case "tesseractToQuark":
                if (player.worlds >= (G['shopBaseCosts'].tesseractToQuark) && !player.shopUpgrades.tesseractToQuarkBought) {
                    player.worlds -= (G['shopBaseCosts'].tesseractToQuark);
                    player.shopUpgrades.tesseractToQuarkBought = true;
                }
                break;
            case "hypercubeToQuark":
                if (player.worlds >= (G['shopBaseCosts'].hypercubeToQuark) && !player.shopUpgrades.hypercubeToQuarkBought) {
                    player.worlds -= (G['shopBaseCosts'].hypercubeToQuark);
                    player.shopUpgrades.hypercubeToQuarkBought = true;
                }
                break;
        }
        revealStuff();
    }
}

export const useConsumable = (input: ShopUpgradeNames) => {    
    const p = G['shopConfirmation']
        ? confirm('Would you like to use this potion?')
        : true;

    if (p) {
        switch (input) {
            case "offeringPotion":
                if (player.shopUpgrades.offeringPotion > 0.5) {
                    player.shopUpgrades.offeringPotion -= 1;
                    player.runeshards += Math.floor(7200 * player.offeringpersecond * calculateTimeAcceleration());
                }
                break;
            case "obtainiumPotion":
                if (player.shopUpgrades.obtainiumPotion > 0.5) {
                    player.shopUpgrades.obtainiumPotion -= 1;
                    player.researchPoints += Math.floor(7200 * player.maxobtainiumpersecond * calculateTimeAcceleration());
                }
                break;
        }
    }
}

export const resetShopUpgrades = () => {
    const p = G['shopConfirmation']
        ? confirm("This will refund 100% of your permanent upgrades for an upfront cost of 15 Quarks. Would you like to do this?")
        : true;

    if (p && player.worlds >= 15) {
        player.worlds -= 15;
        for (let i = 0; i < 100; i++) {
            if (player.shopUpgrades.offeringTimerLevel > 0) {
                player.shopUpgrades.offeringTimerLevel -= 1;
                player.worlds += (150 + 10 * i)
            }
            if (player.shopUpgrades.offeringAutoLevel > 1) {
                player.shopUpgrades.offeringAutoLevel -= 1;
                player.worlds += (175 + 10 * i)
            }
            if (player.shopUpgrades.obtainiumTimerLevel > 0) {
                player.shopUpgrades.obtainiumTimerLevel -= 1;
                player.worlds += (150 + 10 * i)
            }
            if (player.shopUpgrades.obtainiumAutoLevel > 1) {
                player.shopUpgrades.obtainiumAutoLevel -= 1;
                player.worlds += (175 + 10 * i)
            }
            if (player.shopUpgrades.antSpeedLevel > 0) {
                player.shopUpgrades.antSpeedLevel -= 1;
                player.worlds += (200 + 25 * i)
            }
            if (player.shopUpgrades.cashGrabLevel > 0) {
                player.shopUpgrades.cashGrabLevel -= 1;
                player.worlds += (100 + 40 * i)
            }
            if (player.shopUpgrades.challenge10Tomes > 0){
                player.shopUpgrades.challenge10Tomes -= 1;
                player.worlds += (500 + 250 * i)
            }
            if (player.shopUpgrades.seasonPassLevel > 0){
                player.shopUpgrades.seasonPassLevel -= 1;
                player.worlds += (500 + 75 * i)
            }
        }
        revealStuff();
    }
}