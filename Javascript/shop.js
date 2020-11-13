const offerconsumedesc = "Instantly gain 2 real life hours of Offerings, based on your all time best Offerings/sec and speed acceleration!"
const obtainiumconsumedesc = "Instantly gain 2 real life hours of Obtainium, based on your all time best Obtainium/sec and speed acceleration!"

const offertimerdesc = "Gain +(level)^2 /4% more offerings from all sources!"
const offerautodesc = "Automatically pour Offerings into a rune. 1st level unlocks feature, and each level increases Offering gain by 2%. Every second, 2^(Level) levels worth of offerings are spent. TO ACTIVATE: Click on the rune icon (PICTURE) and it will turn orange just for you!"
const obtainiumtimerdesc = "Gain +(level)^2 /2% more obtainium from all sources!"
const obtainiumautodesc = "Automatically pour Obtainium into a research. 1st level unlocks feature, and each level increases Obtainium gain by 2%. Every reincarnation, dump all Obtainium into research until maxed."
const instantchallengedesc = "T and R challenges don't cause resets if retry is enabled and gain up to 10 completions per tick. Addtionally, instantly gain T challenge completions up to highest completed when exiting R challenges."
const cashgrabdesc = "This is a cash grab but it gives a couple cool stats. +1% production per level to Offerings and Obtainium."
const antspeeddesc = "Each level gives a 1.5x speed multiplier to all Ant tiers' production! Short and simple."
const shoptalismandesc = "Permanently unlock a Shop talisman! [Warning: you can't refund this and this is VERY expensive to level. Be sure you want to buy it!]"
const challengeExtDesc = "Using some amazing trick, you manage to increase your Reincarnation Challenge cap by 2 for each level! [Cannot be Refunded!]"
const challenge10TomeDesc = "The extended cut: This fifth forgotten tome gives you an additional -20M exponent reduction on the Challenge 10 requirement per level."
const seasonPassDesc = "Wow! Cubes is giving you a deal: Buy this totally fair Season Pass and gain +3% cubes per level when you ascend!"
const cubeToQuarkDesc = "Instead of a daily cap of 25 Quarks by opening Wow! Cubes, how about 100 instead? This adds 75 to the daily cap! [Cannot be Refunded!]"
const tesseractToQuarkDesc = "Instead of a daily cap of 25 Quarks by opening Wow! Tesseracts, how about 100 instead? This adds 75 to the daily cap! [Cannot be Refunded!]"
const hypercubeToQuarkDesc = "Instead of a daily cap of 25 Quarks by opening Wow! Hypercubes, how about 100 instead? This adds 75 to the daily cap! [Cannot be Refunded!]"


function shopDescriptions(i) {
    let rofl = document.getElementById("quarkdescription");
    let lmao = document.getElementById("quarkcost");
    let lol = document.getElementById("quarkeffect");
    switch (i) {
        case 1:
            rofl.textContent = offerconsumedesc;
            lmao.textContent = "Cost: " + shopBaseCosts.offerPotion + " Quarks.";
            lol.textContent = "Gain " + format((7200 * player.offeringpersecond * calculateTimeAcceleration()), 0, true) + " Offerings."
            break;
        case 2:
            rofl.textContent = obtainiumconsumedesc;
            lmao.textContent = "Cost: " + shopBaseCosts.obtainiumPotion + " Quarks.";
            lol.textContent = "Gain " + format((7200 * player.maxobtainiumpersecond * calculateTimeAcceleration()), 0, true) + " Obtainium.";
            break;
        case 3:
            rofl.textContent = offertimerdesc;
            lmao.textContent = "Cost: " + (shopBaseCosts.offerTimer + 25 * player.shopUpgrades.offeringTimerLevel) + " Quarks."
            lol.textContent = "CURRENT Effect: Offering gain +" + format(1/4 * Math.pow(player.shopUpgrades.offeringTimerLevel,2),2,true) + "%!"
            break;
        case 4:
            rofl.textContent = offerautodesc;
            lmao.textContent = "Cost: " + (shopBaseCosts.offerAuto + 25 * player.shopUpgrades.offeringAutoLevel) + " Quarks."
            lol.textContent = "CURRENT Effect: Per 10 seconds, pour " + format(Math.pow(2, 1 + player.shopUpgrades.offeringAutoLevel)) + " Offerings. +" + format(2 * player.shopUpgrades.offeringAutoLevel, 2) + "% Offerings."
            break;
        case 5:
            rofl.textContent = obtainiumtimerdesc;
            lmao.textContent = "Cost: " + (shopBaseCosts.obtainiumTimer + 25 * player.shopUpgrades.obtainiumTimerLevel) + " Quarks."
            lol.textContent = "CURRENT Effect: Obtainium gain +" + format(1/2 * Math.pow(player.shopUpgrades.obtainiumTimerLevel,2),2,true) + "%!"
            break;
        case 6:
            rofl.textContent = obtainiumautodesc;
            lmao.textContent = "Cost: " + (shopBaseCosts.obtainiumAuto + 25 * player.shopUpgrades.obtainiumAutoLevel) + " Quarks."
            lol.textContent = "CURRENT Effect: Try to upgrade research each reincarnation, and gain +" + format(player.shopUpgrades.obtainiumAutoLevel * 2, 2) + "% more Obtainium."
            break;
        case 7:
            rofl.textContent = instantchallengedesc;
            lmao.textContent = "Cost: " + (shopBaseCosts.instantChallenge) + " Quarks."
            lol.textContent = "CURRENT Effect: Even in a premium shop it's kinda obvious, right?"
            break;
        case 8:
            rofl.textContent = cashgrabdesc;
            lmao.textContent = "Cost: " + (shopBaseCosts.cashGrab + 100 * player.shopUpgrades.cashGrabLevel) + " Quarks."
            lol.textContent = "CURRENT Effect: Obtainium and Offerings increased by " + format(player.shopUpgrades.cashGrabLevel, 2) + "%."
            break;
        case 9:
            rofl.textContent = antspeeddesc;
            lmao.textContent = "Cost: " + (shopBaseCosts.antSpeed + 80 * player.shopUpgrades.antSpeedLevel) + " Quarks."
            lol.textContent = "CURRENT Effect: All Ants' Speed x" + format(Math.pow(1.5, player.shopUpgrades.antSpeedLevel), 2)
            break;
        case 10:
            rofl.textContent = shoptalismandesc;
            lmao.textContent = "Cost: " + (1500) + " Quarks."
            lol.textContent = "CURRENT Effect: Even in a premium shop it's kinda obvious, right?"
            break;
        case 11:
            rofl.textContent = challengeExtDesc;
            lmao.textContent = "Cost: " + (shopBaseCosts.challengeExtension + 250 * player.shopUpgrades.challengeExtension) + " Quarks."
            lol.textContent = "CURRENT Effect: Reincarnation Challenges may be completed an additional " + format(2*player.shopUpgrades.challengeExtension) + " times."
            break;
        case 12:
            rofl.textContent = challenge10TomeDesc;
            lmao.textContent = "Cost: " + (shopBaseCosts.challenge10Upgrade + 250 * player.shopUpgrades.challenge10Tomes) + " Quarks."
            lol.textContent = "CURRENT Effect: Challenge 10 Exponent Requirement reduced by " + format(20*player.shopUpgrades.challenge10Tomes) + "M."
            break;
        case 13:
            rofl.textContent = seasonPassDesc;
            lmao.textContent = "Cost: " + (shopBaseCosts.seasonPass + 250 * player.shopUpgrades.seasonPassLevel) + " Quarks."
            lol.textContent = "CURRENT Effect: Ascensions give  +" + format(3*player.shopUpgrades.seasonPassLevel) + "% cubes."
            break;
        case 14:
            rofl.textContent = cubeToQuarkDesc;
            lmao.textContent = "Cost: " + (shopBaseCosts.cubeToQuark) + " Quarks."
            lol.textContent = "CURRENT Effect: Even in a premium shop it's kinda obvious, right?"
            break;
        case 15:
            rofl.textContent = tesseractToQuarkDesc;
            lmao.textContent = "Cost: " + (shopBaseCosts.tesseractToQuark) + " Quarks."
            lol.textContent = "CURRENT Effect: Even in a premium shop it's kinda obvious, right?"
            break;
        case 16:
            rofl.textContent = hypercubeToQuarkDesc;
            lmao.textContent = "Cost: " + (shopBaseCosts.hypercubeToQuark) + " Quarks."
            lol.textContent = "CURRENT Effect: Even in a premium shop it's kinda obvious, right?"
            break;
    }

}

function buyShopUpgrades(i) {
    let p = true;
    if (shopConfirmation) {
        p = confirm("Are you sure of your purchase?")
    }
    if (p) {
        switch (i) {
            case 1:
                if (player.worlds >= shopBaseCosts.offerPotion) {
                    player.worlds -= 100;
                    player.shopUpgrades.offeringPotion += 1;
                }
                break;
            case 2:
                if (player.worlds >= shopBaseCosts.obtainiumPotion) {
                    player.worlds -= 100;
                    player.shopUpgrades.obtainiumPotion += 1;
                }
                break;
            case 3:
                if (player.worlds >= (shopBaseCosts.offerTimer + 25 * player.shopUpgrades.offeringTimerLevel) && player.shopUpgrades.offeringTimerLevel < 15) {
                    player.worlds -= (shopBaseCosts.offerTimer + 25 * player.shopUpgrades.offeringTimerLevel);
                    player.shopUpgrades.offeringTimerLevel += 1;
                }
                break;
            case 4:
                if (player.worlds >= (shopBaseCosts.offerAuto + 25 * player.shopUpgrades.offeringAutoLevel) && player.shopUpgrades.offeringAutoLevel < 15) {
                    player.worlds -= (shopBaseCosts.offerAuto + 25 * player.shopUpgrades.offeringAutoLevel);
                    player.shopUpgrades.offeringAutoLevel += 1;
                }
                break;
            case 5:
                if (player.worlds >= (shopBaseCosts.obtainiumTimer + 25 * player.shopUpgrades.obtainiumTimerLevel) && player.shopUpgrades.obtainiumTimerLevel < 15) {
                    player.worlds -= (shopBaseCosts.obtainiumTimer + 25 * player.shopUpgrades.obtainiumTimerLevel);
                    player.shopUpgrades.obtainiumTimerLevel += 1;
                }
                break;
            case 6:
                if (player.worlds >= (shopBaseCosts.obtainiumAuto + 25 * player.shopUpgrades.obtainiumAutoLevel) && player.shopUpgrades.obtainiumAutoLevel < 15) {
                    player.worlds -= (shopBaseCosts.obtainiumAuto + 25 * player.shopUpgrades.obtainiumAutoLevel);
                    player.shopUpgrades.obtainiumAutoLevel += 1;
                }
                break;

            case 7:
                if (player.worlds >= shopBaseCosts.instantChallenge && !player.shopUpgrades.instantChallengeBought) {
                    player.worlds -= 300;
                    player.shopUpgrades.instantChallengeBought = true;
                }
                break;
            case 8:
                if (player.worlds >= (shopBaseCosts.cashGrab + 100 * player.shopUpgrades.cashGrabLevel) && player.shopUpgrades.cashGrabLevel < 10) {
                    player.worlds -= (shopBaseCosts.cashGrab + 100 * player.shopUpgrades.cashGrabLevel);
                    player.shopUpgrades.cashGrabLevel += 1;
                }
                break;
            case 9:
                if (player.worlds >= (shopBaseCosts.antSpeed + 80 * player.shopUpgrades.antSpeedLevel) && player.shopUpgrades.antSpeedLevel < 10) {
                    player.worlds -= (shopBaseCosts.antSpeed + 80 * player.shopUpgrades.antSpeedLevel);
                    player.shopUpgrades.antSpeedLevel += 1;
                }
                break;
            case 10:
                if (player.worlds >= 1500 && !player.shopUpgrades.talismanBought) {
                    player.worlds -= 1500;
                    player.shopUpgrades.talismanBought = true;
                }
                break;
            case 11:
                if (player.worlds >= (shopBaseCosts.challengeExtension + 250 * player.shopUpgrades.challengeExtension) && player.shopUpgrades.challengeExtension < 5) {
                    player.worlds -= (shopBaseCosts.challengeExtension + 250 * player.shopUpgrades.challengeExtension);
                    player.shopUpgrades.challengeExtension += 1;
                }
                break;
            case 12:
                if (player.worlds >= (shopBaseCosts.challenge10Upgrade + 250 * player.shopUpgrades.challenge10Tomes) && player.shopUpgrades.challenge10Tomes < 15) {
                    player.worlds -= (shopBaseCosts.challenge10Upgrade + 250 * player.shopUpgrades.challenge10Tomes);
                    player.shopUpgrades.challenge10Tomes += 1;
                }
                break;
            case 13:
                if (player.worlds >= (shopBaseCosts.seasonPass + 250 * player.shopUpgrades.seasonPassLevel) && player.shopUpgrades.seasonPassLevel < 15) {
                    player.worlds -= (shopBaseCosts.seasonPass + 250 * player.shopUpgrades.seasonPassLevel);
                    player.shopUpgrades.seasonPassLevel += 1;
                }
                break;
            case 14:
                if (player.worlds >= (shopBaseCosts.cubeToQuark) && !player.shopUpgrades.cubeToQuarkBought) {
                    player.worlds -= (shopBaseCosts.cubeToQuark);
                    player.shopUpgrades.cubeToQuarkBought = true;
                }
                break;
            case 15:
                if (player.worlds >= (shopBaseCosts.tesseractToQuark) && !player.shopUpgrades.tesseractToQuarkBought) {
                    player.worlds -= (shopBaseCosts.tesseractToQuark);
                    player.shopUpgrades.tesseractToQuarkBought = true;
                }
                break;
            case 16:
                if (player.worlds >= (shopBaseCosts.hypercubeToQuark) && !player.shopUpgrades.hypercubeToQuarkBought) {
                    player.worlds -= (shopBaseCosts.hypercubeToQuark);
                    player.shopUpgrades.hypercubeToQuarkBought = true;
                }
                break;
        }
        revealStuff();
    }
}

function useConsumable(i) {
    let p = true
    if (shopConfirmation) {
        p = confirm("Would you like to use this potion?")
    }
    if (p) {
        switch (i) {
            case 1:
                if (player.shopUpgrades.offeringPotion > 0.5) {
                    player.shopUpgrades.offeringPotion -= 1;
                    player.runeshards += Math.floor(7200 * player.offeringpersecond * calculateTimeAcceleration());
                }
                break;
            case 2:
                if (player.shopUpgrades.obtainiumPotion > 0.5) {
                    player.shopUpgrades.obtainiumPotion -= 1;
                    player.researchPoints += Math.floor(7200 * player.maxobtainiumpersecond * calculateTimeAcceleration());
                }
                break;
        }
    }
}

function resetShopUpgrades() {
    let p = true
    if (shopConfirmation) {
        p = confirm("This will refund 100% of your permanent upgrades for an upfront cost of 15 Quarks. Would you like to do this?")
    }

    if (p && player.worlds >= 15) {
        player.worlds -= 15;
        for (let i = 0; i < 20; i++) {
            if (player.shopUpgrades.offeringTimerLevel > 0) {
                player.shopUpgrades.offeringTimerLevel -= 1;
                player.worlds += (150 + 25 * i)
            }
            if (player.shopUpgrades.offeringAutoLevel > 0) {
                player.shopUpgrades.offeringAutoLevel -= 1;
                player.worlds += (150 + 25 * i)
            }
            if (player.shopUpgrades.obtainiumTimerLevel > 0) {
                player.shopUpgrades.obtainiumTimerLevel -= 1;
                player.worlds += (150 + 25 * i)
            }
            if (player.shopUpgrades.obtainiumAutoLevel > 0) {
                player.shopUpgrades.obtainiumAutoLevel -= 1;
                player.worlds += (150 + 25 * i)
            }
            if (player.shopUpgrades.instantChallengeBought) {
                player.shopUpgrades.instantChallengeBought = false;
                player.worlds += (300)
            }
            if (player.shopUpgrades.antSpeedLevel > 0) {
                player.shopUpgrades.antSpeedLevel -= 1;
                player.worlds += (200 + 80 * i)
            }
            if (player.shopUpgrades.cashGrabLevel > 0) {
                player.shopUpgrades.cashGrabLevel -= 1;
                player.worlds += (100 + 100 * i)
            }
            if (player.shopUpgrades.challenge10Tomes > 0){
                player.shopUpgrades.challenge10Tomes -= 1;
                player.worlds += (500 + 250 * i)
            }
            if (player.shopUpgrades.seasonPassLevel > 0){
                player.shopUpgrades.seasonPassLevel -= 1;
                player.worlds += (500 + 250 * i)
            }
        }

        if (player.autoResearch > 0.5) {
            document.getElementById("res" + player.autoResearch).style.backgroundColor = "black"
        }
        if (player.autoSacrifice > 0.5) {
            document.getElementById("rune" + player.autoSacrifice).style.backgroundColor = "black"
        }
        player.autoSacrificeToggle = false;
        player.autoResearchToggle = false;
        player.autoResearch = 0;
        player.autoSacrifice = 0;
        player.sacrificeTimer = 0;
        revealStuff();
    }
}