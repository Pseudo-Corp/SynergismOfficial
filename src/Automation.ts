import { player } from './Synergism';
import { achievementaward } from './Achievements';
import Decimal from 'break_infinity.js';
import { upgradeupdate, clickUpgrades } from './Upgrades';
import { Globals as G } from './Variables';
import { revealStuff } from './UpdateHTML';

export const buyGenerator = (i: number, state: boolean) => {
    if (i === 101 && player.prestigePoints.gte(G['upgradeCosts'][i]) && player.unlocks.generation === false) {
        player.unlocks.generation = true
    }
    let type: 'coins' | 'prestigePoints' | 'transcendPoints' = 'transcendPoints'
    if (i <= 110 && i >= 106) {
        type = 'coins'
    } else if (i <= 115) {
        type = 'prestigePoints'
    }

    const cost = Decimal.pow(10, G['upgradeCosts'][i])
    const achievementCheck = Math.max(player.upgrades[101], player.upgrades[102], player.upgrades[103], player.upgrades[104], player.upgrades[105])

    if (player.upgrades[i] === 0 && player[type].gte(cost)) {

        if (achievementCheck === 0) {
            if ([102, 103, 104, 105].includes(i)) {
                achievementaward(i - 31);
            }
        }

        player[type] = player[type].sub(cost);
        player.upgrades[i] = 1;
        upgradeupdate(i, state)
        player.reincarnatenocoinprestigetranscendorgeneratorupgrades = false;
    }
}

export const buyAutobuyers = (i: number, state?: boolean) => {
    let type: 'prestigePoints' | 'transcendPoints' | 'reincarnationPoints' = 'reincarnationPoints';
    if (i <= 87) {
        type = 'prestigePoints'
    } else if (i <= 93) {
        type = 'transcendPoints'
    }

    const cost = Decimal.pow(10, G['upgradeCosts'][i]);
    if (player.upgrades[i] === 0 && player[type].gte(cost)) {
        player[type] = player[type].sub(cost);
        player.upgrades[i] = 1;
        upgradeupdate(i, state);
    }
}

export const autoUpgrades = () => {
    let stringUpgrades = '';
    if (player.ascensionCount === 0) {
        stringUpgrades = player.upgrades.toString();
    }

    const buyCheck = player.upgrades.findIndex(function(value, index) {
        return (index >= 1 && value === 0);
    });
    if (buyCheck === -1 || buyCheck >= G['upgradeCosts'].length) {
        return;
    }

    if (player.upgrades[90] > 0.5 && player.shoptoggles.generators === true) {
        for (let i = 101; i <= 120; i++) {
            if (player.upgrades[i] === 0) {
                clickUpgrades(i, true);
            }
        }
    }

    if (player.upgrades[91] > 0.5 && player.shoptoggles.coin === true) {
        for (let i = 1; i <= 20; i++) {
            if (player.upgrades[i] === 0) {
                clickUpgrades(i, true);
            }
        }
        if (player.cubeUpgrades[19] > 0) {
            for (let i = 121; i <= 125; i++) {
                if (player.upgrades[i] === 0) {
                    clickUpgrades(i, true);
                }
            }
        }
    }

    if (player.upgrades[92] > 0.5 && player.shoptoggles.prestige === true) {
        for (let i = 21; i <= 37; i++) {
            if (player.upgrades[i] === 0) {
                clickUpgrades(i, true);
            }
        }
        if (player.achievements[120] === 1) {
            for (let i = 38; i <= 40; i++) {
                if (player.upgrades[i] === 0) {
                    clickUpgrades(i, true);
                }
            }
        }
    }

    if (player.upgrades[99] > 0.5 && player.shoptoggles.transcend === true) {
        for (let i = 41; i <= 60; i++) {
            if (player.upgrades[i] === 0) {
                clickUpgrades(i, true);
            }
        }
    }

    if (player.cubeUpgrades[8] > 0 && player.shoptoggles.reincarnate === true) {
        for (let i = 61; i <= 80; i++) {
            if (player.upgrades[i] === 0) {
                clickUpgrades(i, true);
            }
        }
    }

    if (player.singularityCount >= 25 && player.shoptoggles.automations === true) {
        for (let i = 81; i <= 100; i++) {
            if (player.upgrades[i] === 0) {
                clickUpgrades(i, true);
            }
        }
    }

    if (player.ascensionCount === 0 && stringUpgrades !== player.upgrades.toString()) {
        revealStuff();
    }
}
