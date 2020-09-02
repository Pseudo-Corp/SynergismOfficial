const offerconsumedesc = "Instantly gain 2 hours of Offerings, based on your all time best Offerings/sec!"
const obtainiumconsumedesc = "Instantly gain 2 hours of Obtainium, based on your all time best Obtainium/sec!"

const offertimerdesc = "Each level increases the timer capacity for Offerings by 120 seconds per level!"
const offerautodesc = "Automatically pour Offerings into a rune. 1st level unlocks feature, and each level increases Offering gain by 2%. Every second, 50 * 2^(Level) offerings are spent. TO ACTIVATE: Click on the rune icon (PICTURE) and it will turn orange just for you!"
const obtainiumtimerdesc = "Each level increases the timer capacity for Obtainium by 120 seconds per level! WARNING: You need a certain 1e22 Particle Upgrade for this to be useful!"
const obtainiumautodesc = "Automatically pour Obtainium into a research. 1st level unlocks feature, and each level increases Obtainium gain by 2%. Every reincarnation, dump all Obtainium into research until maxed."
const instantchallengedesc = "Instead of needing enough coins to get autocompletions, and waiting to complete, you instantly completions up until highest ever completed! Does not work in R. Challenges."
const cashgrabdesc = "This is a cash grab but it gives a couple cool stats. +1% production per level to everything, including Offerings and Obtainium."
const antspeeddesc = "Each level gives a 1.5x speed multiplier to all Ant tiers' production! Short and simple."
const shoptalismandesc = "Permanently unlock a Shop talisman! [Warning: you can't refund this and this is VERY expensive to level. Be sure you want to buy it!]"

function shopDescriptions(i) {
    let rofl = document.getElementById("quarkdescription");
    let lmao = document.getElementById("quarkcost");
    let lol = document.getElementById("quarkeffect");
    switch (i) {
        case 1:
            rofl.textContent = offerconsumedesc;
            lmao.textContent = "Cost: " + shopBaseCosts.offerPotion + " Quarks.";
            lol.textContent = "Gain " + format((7200 * player.offeringpersecond), 0, true) + " Offerings."
            break;
        case 2:
            rofl.textContent = obtainiumconsumedesc;
            lmao.textContent = "Cost: " + shopBaseCosts.obtainiumPotion + " Quarks.";
            lol.textContent = "Gain " + format((7200 * player.maxobtainiumpersecond), 0, true) + " Obtainium.";
            break;
        case 3:
            rofl.textContent = offertimerdesc;
            lmao.textContent = "Cost: " + (shopBaseCosts.offerTimer + 25 * player.shopUpgrades.offeringTimerLevel) + " Quarks."
            lol.textContent = "CURRENT Effect: Offering Timer +" + format(120 * player.shopUpgrades.offeringTimerLevel) + " Seconds."
            break;
        case 4:
            rofl.textContent = offerautodesc;
            lmao.textContent = "Cost: " + (shopBaseCosts.offerAuto + 25 * player.shopUpgrades.offeringAutoLevel) + " Quarks."
            lol.textContent = "CURRENT Effect: Per 10 seconds, pour " + format(Math.pow(2, 1 + player.shopUpgrades.offeringAutoLevel)) + " Offerings. +" + format(2 * player.shopUpgrades.offeringAutoLevel, 2) + "% Offerings."
            break;
        case 5:
            rofl.textContent = obtainiumtimerdesc;
            lmao.textContent = "Cost: " + (shopBaseCosts.obtainiumTimer + 25 * player.shopUpgrades.obtainiumTimerLevel) + " Quarks."
            lol.textContent = "CURRENT Effect: Obtainium Timer +" + format(120 * player.shopUpgrades.obtainiumTimerLevel) + " Seconds."
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
            lol.textContent = "CURRENT Effect: All resources EXCEPT QUARKS increased by " + format(player.shopUpgrades.cashGrabLevel, 2) + "%."
            break;
        case 9:
            rofl.textContent = antspeeddesc;
            lmao.textContent = "Cost: " + (shopBaseCosts.antSpeed + 200 * player.shopUpgrades.antSpeedLevel) + " Quarks."
            lol.textContent = "CURRENT Effect: All Ants' Speed x" + format(Math.pow(1.5, player.shopUpgrades.antSpeedLevel), 2)
            break;
        case 10:
            rofl.textContent = shoptalismandesc;
            lmao.textContent = "Cost: " + (1500) + " Quarks."
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
                    player.worlds -= 35;
                    player.shopUpgrades.offeringPotion += 1;
                }
                break;
            case 2:
                if (player.worlds >= shopBaseCosts.obtainiumPotion) {
                    player.worlds -= 35;
                    player.shopUpgrades.obtainiumPotion += 1;
                }
                break;
            case 3:
                if (player.worlds >= (shopBaseCosts.offerTimer + 25 * player.shopUpgrades.offeringTimerLevel) && player.shopUpgrades.offeringTimerLevel < 7) {
                    player.worlds -= (shopBaseCosts.offerTimer + 25 * player.shopUpgrades.offeringTimerLevel);
                    player.shopUpgrades.offeringTimerLevel += 1;
                }
                break;
            case 4:
                if (player.worlds >= (shopBaseCosts.offerAuto + 25 * player.shopUpgrades.offeringAutoLevel) && player.shopUpgrades.offeringAutoLevel < 7) {
                    player.worlds -= (shopBaseCosts.offerAuto + 25 * player.shopUpgrades.offeringAutoLevel);
                    player.shopUpgrades.offeringAutoLevel += 1;
                }
                break;
            case 5:
                if (player.worlds >= (shopBaseCosts.obtainiumTimer + 25 * player.shopUpgrades.obtainiumTimerLevel) && player.shopUpgrades.obtainiumTimerLevel < 7) {
                    player.worlds -= (shopBaseCosts.obtainiumTimer + 25 * player.shopUpgrades.obtainiumTimerLevel);
                    player.shopUpgrades.obtainiumTimerLevel += 1;
                }
                break;
            case 6:
                if (player.worlds >= (shopBaseCosts.obtainiumAuto + 25 * player.shopUpgrades.obtainiumAutoLevel) && player.shopUpgrades.obtainiumAutoLevel < 7) {
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
                if (player.worlds >= (shopBaseCosts.cashGrab + 100 * player.shopUpgrades.cashGrabLevel) && player.shopUpgrades.cashGrabLevel < 7) {
                    player.worlds -= (shopBaseCosts.cashGrab + 100 * player.shopUpgrades.cashGrabLevel);
                    player.shopUpgrades.cashGrabLevel += 1;
                }
                break;
            case 9:
                if (player.worlds >= (shopBaseCosts.antSpeed + 200 * player.shopUpgrades.antSpeedLevel) && player.shopUpgrades.antSpeedLevel < 3) {
                    player.worlds -= (shopBaseCosts.antSpeed + 200 * player.shopUpgrades.antSpeedLevel);
                    player.shopUpgrades.antSpeedLevel += 1;
                }
                break;
            case 10:
                if (player.worlds >= 1500 && !player.shopUpgrades.talismanBought) {
                    player.worlds -= 1500;
                    player.shopUpgrades.talismanBought = true;
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
                    player.runeshards += Math.floor(7200 * player.offeringpersecond);
                }
                break;
            case 2:
                if (player.shopUpgrades.obtainiumPotion > 0.5) {
                    player.shopUpgrades.obtainiumPotion -= 1;
                    player.researchPoints += Math.floor(7200 * player.maxobtainiumpersecond);
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
        for (let i = 0; i < 10; i++) {
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
                player.worlds += (200 + 200 * i)
            }
            if (player.shopUpgrades.cashGrabLevel > 0) {
                player.shopUpgrades.cashGrabLevel -= 1;
                player.worlds += (100 + 100 * i)
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