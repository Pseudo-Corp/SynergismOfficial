function buyGenerator(i, state) {
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
        player.reincarnatenocoinprestigetranscendorgeneratorupgrades = false;
    }
    revealStuff()
}