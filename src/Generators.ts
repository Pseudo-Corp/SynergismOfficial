import { upgradeupdate } from './Upgrades'
import { player } from './Synergism'
import Decimal from 'break_infinity.js'
import { achievementaward } from './Achievements'
import { revealStuff } from './UpdateHTML'
import { Globals as G } from './Variables';

export const buyGenerator = (i: number, state?: boolean) => {
    if (i === 1 && player.prestigePoints.gte(1e12) && player.unlocks.generation === false) {
        player.unlocks.generation = true
    }
    const q = 100 + i
    let type: 'coins' | 'prestigePoints' | 'transcendPoints' = 'transcendPoints'
    if (q <= 110 && q >= 106) {
        type = 'coins'
    } else if (q <= 115) {
        type = 'prestigePoints'
    }

    const cost = Decimal.pow(10, G['upgradeCosts'][q])
    const achievementCheck = Math.max(player.upgrades[101], player.upgrades[102], player.upgrades[103], player.upgrades[104], player.upgrades[105])

    if (player.upgrades[q] === 0 && player[type].gte(cost)) {

        if (achievementCheck === 0) {
            if ([102, 103, 104, 105].includes(q)) {
                achievementaward(q - 31);
            }
        }

        player[type] = player[type].sub(cost);
        player.upgrades[q] = 1;
        upgradeupdate(q, state)
        player.reincarnatenocoinprestigetranscendorgeneratorupgrades = false;
    }
    revealStuff()
}
