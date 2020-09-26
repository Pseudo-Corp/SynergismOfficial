function buyGenerator(i, state, auto) {
    if (i === 1 && player.prestigePoints.greaterThanOrEqualTo(1e12) && player.unlocks.generation === false) {
        player.unlocks.generation = true
    }
    let q = 100 + i
    let type = "transcendPoints"
    if (q <= 110 && q >= 106) {
        type = "coins"
    } else if (q <= 115) {
        type = "prestigePoints"
    }

    let cost = Decimal.pow(10, upgradeCosts[q])
    let achievementCheck = Math.max(player.upgrades[101], player.upgrades[102], player.upgrades[103], player.upgrades[104], player.upgrades[105])

    if (player.upgrades[q] === 0 && player[type].greaterThanOrEqualTo(cost)) {
        if (achievementCheck === 0) {
            if (q === 102) {
                achievementaward(71)
            }
            if (q === 103) {
                achievementaward(72)
            }
            if (q === 104) {
                achievementaward(73)
            }
            if (q === 105) {
                achievementaward(74)
            }
        }
        player[type] = player[type].sub(cost);
        player.upgrades[q] = 1;
        upgradeupdate(q, state)
    }

    if (!auto) {
        revealStuff()
    }
}

function buyAutobuyers(i, state) {
    let q = i + 80
    let type = "";
    if (q <= 87) {
        type = "prestigePoints"
    } else if (q <= 93) {
        type = "transcendPoints"
    } else {
        type = "reincarnationPoints"
    }

    const cost = Decimal.pow(10, upgradeCosts[q]);
    if (player[type].greaterThanOrEqualTo(cost) && player.upgrades[q] === 0) {
        player[type] = player[type].sub(cost);
        player.upgrades[q] = 1;
        upgradeupdate(q, state);
    }
}

function autoUpgrades() {
    if (player.upgrades[90] > 0.5 && player.shoptoggles.generators === true) {

        for (let i = 1; i < 6; i++) {
            if (player.prestigePoints.greaterThanOrEqualTo(Decimal.pow(10, upgradeCosts[(100 + i)])) && player.shoptoggles.generators === true) {
                buyGenerator(i, true, true)
            }
        }
        for (let j = 6; j < 11; j++) {
            if (player.coins.greaterThanOrEqualTo(Decimal.pow(10, upgradeCosts[(100 + j)])) && player.shoptoggles.generators === true) {
                buyGenerator(j, true, true)
            }
        }
        for (let k = 11; k < 16; k++) {
            if (player.prestigePoints.greaterThanOrEqualTo(Decimal.pow(10, upgradeCosts[(100 + k)])) && player.shoptoggles.generators === true) {
                buyGenerator(k, true, true)
            }
        }
        for (let l = 16; l < 21; l++) {
            if (player.transcendPoints.greaterThanOrEqualTo(Decimal.pow(10, upgradeCosts[(100 + l)])) && player.shoptoggles.generators === true) {
                buyGenerator(l, true, true)
            }
        }
    }
    if (player.upgrades[91] > 0.5) {
        for (let i = 1; i < 21; i++) {
            if (player.coins.greaterThanOrEqualTo(Decimal.pow(10, upgradeCosts[i])) && player.shoptoggles.coin === true) {
                buyUpgrades('coin', i, true)
            }
        }
        for (let i = 121; i <= 125; i++){
            if (player.coins.greaterThanOrEqualTo(Decimal.pow(10, upgradeCosts[i])) && player.shoptoggles.coin === true && player.cubeUpgrades[19] > 0) {
                buyUpgrades('coin',i,true)
            }
        }
    }
    if (player.upgrades[92] > 0.5) {
        for (let i = 21; i < 38; i++) {
            if (player.prestigePoints.greaterThanOrEqualTo(Decimal.pow(10, upgradeCosts[i])) && player.shoptoggles.prestige === true) {
                buyUpgrades('prestige', i, true)
            }
        }
        if (player.prestigePoints.greaterThanOrEqualTo(Decimal.pow(10, 50000)) && player.shoptoggles.prestige === true && player.achievements[120] === 1) {
            buyUpgrades('prestige', 38, true)
        }
        if (player.prestigePoints.greaterThanOrEqualTo(Decimal.pow(10, 100000)) && player.shoptoggles.prestige === true && player.achievements[127] === 1) {
            buyUpgrades('prestige', 39, true)
        }
        if (player.prestigePoints.greaterThanOrEqualTo(Decimal.pow(10, 200000)) && player.shoptoggles.prestige === true && player.achievements[134] === 1) {
            buyUpgrades('prestige', 40, true)
        }

    }
    if (player.upgrades[99] > 0.5) {
        for (let i = 41; i < 61; i++) {
            if (player.transcendPoints.greaterThanOrEqualTo(Decimal.pow(10, upgradeCosts[i])) && player.shoptoggles.transcend === true) {
                buyUpgrades('transcend', i, true)
            }
        }
    }

    if (player.cubeUpgrades[8] > 0) {
        for (let i = 61; i <= 80; i++) {
            if (player.reincarnationPoints.greaterThanOrEqualTo(Decimal.pow(10, upgradeCosts[i])) && player.shoptoggles.reincarnate) {
                buyUpgrades('reincarnation', i, true)
            }
        }
    }
}