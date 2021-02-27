import { player, format } from './Synergism';
import { Globals as G } from './Variables';
import { Confirm, revealStuff } from './UpdateHTML';
import { calculateTimeAcceleration } from './Calculate';
import { Player } from './types/Synergism';

/* === CHANGELOG, 1.21.2021 ===
1) Offering vals: (level)^2 / 200 ->  level/25
2) Obtainium vals: (level^2) / 100 -> level/25
3) Ant Speed: (1.5^level) -> (1.125^level)
4) Season Pass: (3 * level/100) -> (3 * level/200)
   Season Pass also now affects tesseracts.
*/
export interface IShopData {
    price: number
    priceIncrease: number
    maxLevel: number
    type: string
    refundable: boolean
    refundMinimumLevel: number
    description: string
}

const shopData: Record<keyof Player['shopUpgrades'], IShopData> = {
    offeringPotion: {
        price: 100,
        priceIncrease: 0,
        maxLevel: 999999,
        type: "consumable",
        refundable: false,
        refundMinimumLevel: 0,
        description: "Instantly gain 2 real life hours of Offerings, based on your all time best Offerings/sec and speed acceleration!",
    },
    obtainiumPotion: {
        price: 100,
        priceIncrease: 0,
        maxLevel: 999999,
        type: "consumable",
        refundable: false,
        refundMinimumLevel: 0,
        description: "Instantly gain 2 real life hours of Obtainium, based on your all time best Obtainium/sec and speed acceleration!",
    },
    offeringEX: {
        price: 150,
        priceIncrease: 10,
        maxLevel: 100,
        type: "upgrade",
        refundable: true,
        refundMinimumLevel: 0,
        description: "Gain +4% more offerings from all sources!",
    },
    offeringAuto: {
        price: 150,
        priceIncrease: 10,
        maxLevel: 100,
        type: "upgrade",
        refundable: true,
        refundMinimumLevel: 1,
        description: "Automatically pour Offerings into a rune. 1st level unlocks feature, and each level increases Offering gain by 2%. Every second, 2^(Level) levels worth of offerings are spent. [First Level Cannot be refunded!]",
    },
    obtainiumEX: {
        price: 150,
        priceIncrease: 10,
        maxLevel: 100,
        type: "upgrade",
        refundable: true,
        refundMinimumLevel: 0,
        description: "Gain +4% more obtainium from all sources!",
    },
    obtainiumAuto: {
        price: 150,
        priceIncrease: 10,
        maxLevel: 100,
        type: "upgrade",
        refundable: true,
        refundMinimumLevel: 1,
        description: "Automatically pour Obtainium into a research. 1st level unlocks feature, and each level increases Obtainium gain by 2%. Every reincarnation, dump all Obtainium into research until maxed. [First Level Cannot be Refunded!]",
    },
    instantChallenge: {
        price: 300,
        priceIncrease: 99999,
        maxLevel: 1,
        type: "upgrade",
        refundable: false,
        refundMinimumLevel: 0,
        description: "T and R challenges don't cause resets if retry is enabled and gain up to 10 completions per tick. Addtionally, instantly gain T challenge completions up to highest completed when exiting R challenges. [Cannot be Refunded!]"
    },
    antSpeed: {
        price: 200,
        priceIncrease: 25,
        maxLevel: 100,
        type: "upgrade",
        refundable: true,
        refundMinimumLevel: 0,
        description: "Each level gives a 1.125x speed multiplier to all Ant tiers' production! Short and simple."
    },
    cashGrab: {
        price: 100,
        priceIncrease: 40,
        maxLevel: 100,
        type: "upgrade",
        refundable: true,
        refundMinimumLevel: 0,
        description: "This is a cash grab but it gives a couple cool stats. +1% production per level to Offerings and Obtainium.",
    },
    shopTalisman: {
        price: 1500,
        priceIncrease: 99999,
        maxLevel: 1,
        type: "upgrade",
        refundable: false,
        refundMinimumLevel: 0,
        description: "Permanently unlock a Shop talisman! [Warning: you can't refund this and this is VERY expensive to level. Be sure you want to buy it!]",
    },
    seasonPass: {
        price: 500,
        priceIncrease: 75,
        maxLevel: 100,
        type: "upgrade",
        refundable: true,
        refundMinimumLevel: 0,
        description: "Wow! Cubes is giving you a deal: Buy this totally fair Season Pass and gain +1.5% cubes and tesseracts per level when you ascend!",
    },
    challengeExtension: {
        price: 500,
        priceIncrease: 250,
        maxLevel: 5,
        type: "upgrade",
        refundable: false,
        refundMinimumLevel: 0,
        description: "Using some amazing trick, you manage to increase your Reincarnation Challenge cap by 2 for each level! [Cannot be Refunded!]",
    },
    challengeTome: {
        price: 500,
        priceIncrease: 250,
        maxLevel: 15,
        type: "upgrade",
        refundable: false,
        refundMinimumLevel: 0,
        description: "The extended cut: This fifth forgotten tome gives you an additional 20 Million exponent reduction on the Challenge 10 requirement per level. [Cannot be Refunded!]",
    },
    cubeToQuark: {
        price: 2000,
        priceIncrease: 99999,
        maxLevel: 1,
        type: "upgrade",
        refundable: false,
        refundMinimumLevel: 0,
        description: "Instead of a daily cap of 25 Quarks by opening Wow! Cubes, how about 100? This adds 75 to the daily cap! [Cannot be Refunded!]"
    },
    tesseractToQuark: {
        price: 3500,
        priceIncrease: 99999,
        maxLevel: 1,
        type: "upgrade",
        refundable: false,
        refundMinimumLevel: 0,
        description: "Instead of a daily cap of 25 Quarks by opening Wow! Cubes, how about 100? This adds 75 to the daily cap! [Cannot be Refunded!]"
    },
    hypercubeToQuark: {
        price: 5000,
        priceIncrease: 99999,
        maxLevel: 1,
        type: "upgrade",
        refundable: false,
        refundMinimumLevel: 0,
        description: "Instead of a daily cap of 25 Quarks by opening Wow! Cubes, how about 100? This adds 75 to the daily cap! [Cannot be Refunded!]"
    },
}

//Names of shop upgrades || Top row indicates potions, and all other upgrades are labeled in order.
//If you are adding more upgrades please make sure the order of labelled upgrades is correct!
type ShopUpgradeNames = 'offeringPotion' | 'obtainiumPotion' |
                        'offeringEX' | 'offeringAuto' | 'obtainiumEX' | 'obtainiumAuto' | 'instantChallenge' |
                        'antSpeed' | 'cashGrab' | 'shopTalisman' | 'seasonPass' | 'challengeExtension' |
                        'challengeTome' | 'cubeToQuark' | 'tesseractToQuark' | 'hypercubeToQuark'

export const getShopCosts = (input: ShopUpgradeNames) => {
    if (shopData[input].type === "consumable" || shopData[input].maxLevel === 1){
        return shopData[input].price
    }
    else {
        const priceIncreaseMult = player.shopUpgrades[input]
        return shopData[input].price + shopData[input].priceIncrease * priceIncreaseMult
    }
}

export const shopDescriptions = (input: ShopUpgradeNames) => {
    const rofl = document.getElementById("quarkdescription");
    const lmao = document.getElementById("quarkcost");
    const lol = document.getElementById("quarkeffect");

    rofl.textContent = shopData[input].description;
    lmao.textContent = "Cost: " + format(getShopCosts(input)) + " Quarks";
    switch (input) {
        case "offeringPotion":
            lol.textContent = "Gain " + format((7200 * player.offeringpersecond * calculateTimeAcceleration()), 0, true) + " Offerings."
            break;
        case "obtainiumPotion":
            lol.textContent = "Gain " + format((7200 * player.maxobtainiumpersecond * calculateTimeAcceleration()), 0, true) + " Obtainium.";
            break;
        case "offeringEX":
            lol.textContent = "CURRENT Effect: You will gain " + format(4 * player.shopUpgrades.offeringEX,2,true) + "% more Offerings!"
            break;
        case "offeringAuto":
            lol.textContent = "CURRENT Effect: Per 10 seconds, pour " + format(Math.pow(2, 1 + player.shopUpgrades.offeringAuto)) + " Offerings. +" + format(2 * player.shopUpgrades.offeringAuto, 2) + "% Offerings."
            break;
        case "obtainiumEX":
            lol.textContent = "CURRENT Effect: You will gain " + format(4 * player.shopUpgrades.obtainiumEX,2,true) + "% more Obtainium!"
            break;
        case "obtainiumAuto":
            lol.textContent = "CURRENT Effect: Try to upgrade research each reincarnation, and gain " + format(player.shopUpgrades.obtainiumAuto * 2, 2) + "% more Obtainium."
            break;
        case "instantChallenge":
            lol.textContent = "CURRENT Effect: Even in a premium shop it's kinda obvious, right?"
            break;
        case "antSpeed":
            lol.textContent = "CURRENT Effect: All Ants' Speed x" + format(Math.pow(1.125, player.shopUpgrades.antSpeed), 2)
            break;
        case "cashGrab":
            lol.textContent = "CURRENT Effect: You will gain " + format(player.shopUpgrades.cashGrab, 2) + "% more Obtainium and Offerings!"
            break;
        case "shopTalisman":
            lol.textContent = "CURRENT Effect: Even in a premium shop it's kinda obvious, right?"
            break;
        case "seasonPass":
            lol.textContent = "CURRENT Effect: Ascensions give " + format(3 / 2 * player.shopUpgrades.seasonPass) + "% more Wow! Cubes and Tesseracts."
            break;
        case "challengeExtension":
            lol.textContent = "CURRENT Effect: Reincarnation Challenges may be completed an additional " + format(2*player.shopUpgrades.challengeExtension) + " times."
            break;
        case "challengeTome":
            lol.textContent = "CURRENT Effect: Challenge 10 Exponent Requirement reduced by " + format(20*player.shopUpgrades.challengeTome) + " Million."
            break;
        case "cubeToQuark":
            lol.textContent = "CURRENT Effect: Even in a premium shop it's kinda obvious, right?"
            break;
        case "tesseractToQuark":
            lol.textContent = "CURRENT Effect: Even in a premium shop it's kinda obvious, right?"
            break;
        case "hypercubeToQuark":
            lol.textContent = "CURRENT Effect: Even in a premium shop it's kinda obvious, right?"
            break;
    }

}

export const buyShopUpgrades = async (input: ShopUpgradeNames) => {
    let p = true;
    if (G['shopConfirmation']) {
        p = await Confirm("Are you sure you'd like to purchase " + input + " for " + format(getShopCosts(input)) + " Quarks? Press 'OK' to finalize purchase.");
    }

    if (p) {
        if (player.worlds >= getShopCosts(input) && player.shopUpgrades[input] < shopData[input].maxLevel) {
            player.worlds -= getShopCosts(input)
            player.shopUpgrades[input] += 1
            console.log("purchase successful for 1 level of '" + input + "'!")
        }
        else{
            console.log("purchase attempted for 1 level of '" + input + "' but failed!")    
        }
    }
    revealStuff();
}

export const useConsumable = async (input: ShopUpgradeNames) => {    
    const p = G['shopConfirmation']
        ? await Confirm('Would you like to use this potion?')
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
export const resetShopUpgrades = async () => {
    const p = G['shopConfirmation']
        ? await Confirm("This will fully refund most of your permanent upgrades for an upfront cost of 15 Quarks. Would you like to do this?")
        : true;

    if (p) {
        player.worlds -= 15;
        let initialQuarks = player.worlds;
        for(const shopItem in shopData){
            const key = shopItem as keyof typeof shopData;
            if(shopData[key].refundable && player.shopUpgrades[key] > shopData[key].refundMinimumLevel){

                // Determines how many quarks one would not be refunded, based on minimum refund level
                const doNotRefund = shopData[key].price * shopData[key].refundMinimumLevel +
                                shopData[key].priceIncrease * (shopData[key].refundMinimumLevel) * (shopData[key].refundMinimumLevel - 1) / 2;
                
                //Refunds Quarks based on the shop level and price vals
                player.worlds += shopData[key].price * player.shopUpgrades[key] +
                                 shopData[key].priceIncrease * (player.shopUpgrades[key]) * (player.shopUpgrades[key] - 1) / 2
                                 - doNotRefund;
                console.log("Successfully refunded " + format(player.worlds - initialQuarks) + " Quarks from '" + shopItem + "'. You now have " + format(player.worlds) + " Quarks.");
                player.shopUpgrades[key] = shopData[key].refundMinimumLevel;
                initialQuarks = player.worlds;
            }
        }
    }
    /*if (p && player.worlds >= 15) {
        player.worlds -= 15;
        Object.keys(shopData).forEach(function)
        revealStuff();
    }*/
}