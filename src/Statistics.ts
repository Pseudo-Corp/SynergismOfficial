import { player, format } from './Synergism';
import { Globals as G } from './Variables';
import { calculateSigmoidExponential, calculateCubeMultiplier, calculateOfferings } from './Calculate';

export const loadStatisticsAccelerator = () => {
    document.getElementById("sA1").textContent = "+" + format(G['freeUpgradeAccelerator'], 0, false)
    document.getElementById("sA2").textContent = "+" + format(G['totalAcceleratorBoost'] * (4 + 2 * player.researches[18] + 2 * player.researches[19] + 3 * player.researches[20] + G['cubeBonusMultiplier'][1]), 0, false)
    document.getElementById("sA3").textContent = "+" + format(Math.floor(Math.pow(G['rune1level'] * G['effectiveLevelMult'] / 10, 1.1)), 0, true)
    document.getElementById("sA4").textContent = "x" + format(1 + G['rune1level'] * 1 / 200 * G['effectiveLevelMult'], 3, true)
    document.getElementById("sA5").textContent = "x" + format(Math.pow(1.01, player.upgrades[21] + player.upgrades[22] + player.upgrades[23] + player.upgrades[24] + player.upgrades[25]), 3, true)
    document.getElementById("sA6").textContent = "x" + format(Math.pow(1.01, player.achievements[60] + player.achievements[61] + player.achievements[62]), 3, true)
    document.getElementById("sA7").textContent = "x" + format(1 + 1 / 5 * player.researches[1], 3, true)
    document.getElementById("sA8").textContent = "x" + format(1 + 1 / 20 * player.researches[6] + 1 / 25 * player.researches[7] + 1 / 40 * player.researches[8] + 3 / 200 * player.researches[9] + 1 / 200 * player.researches[10], 3, true)
    document.getElementById("sA9").textContent = "x" + format(1 + 1 / 20 * player.researches[86], 3, true)
    document.getElementById("sA10").textContent = "x" + format(((player.currentChallenge.transcension !== 0 || player.currentChallenge.reincarnation !== 0) && player.upgrades[50] > 0.5 ? 1.25 : 1), 3, true)
    document.getElementById("sA11").textContent = "^" + format(Math.min(1, (1 + player.platonicUpgrades[6] / 30) * G['maladaptivePower'][player.usedCorruptions[2]] / (1 + Math.abs(player.usedCorruptions[1] - player.usedCorruptions[2]))), 3, true)
    document.getElementById("sA12").textContent = format(G['freeAccelerator'], 0, true)
}

export const loadStatisticsMultiplier = () => {
    document.getElementById("sM1").textContent = "+" + format(G['freeUpgradeMultiplier'], 0, true)
    document.getElementById("sM2").textContent = "+" + format(Math.floor(Math.floor(G['rune2level'] / 10 * G['effectiveLevelMult']) * Math.floor(10 + G['rune2level'] / 10 * G['effectiveLevelMult']) / 2) * 100 / 100, 0, true)
    document.getElementById("sM3").textContent = "x" + format(1 + G['rune2level'] / 200 * G['effectiveLevelMult'], 3, true)
    document.getElementById("sM4").textContent = "x" + format(Math.pow(1.01, player.upgrades[21] + player.upgrades[22] + player.upgrades[23] + player.upgrades[24] + player.upgrades[25]) * (1 + player.upgrades[34] * 3 / 100) * (1 + player.upgrades[34] * (2 / 103)), 3, true)
    document.getElementById("sM5").textContent = "x" + format(Math.pow(1.01, player.achievements[57] + player.achievements[58] + player.achievements[59]), 3, true)
    document.getElementById("sM6").textContent = "x" + format(1 + 1 / 5 * player.researches[2], 3, true)
    document.getElementById("sM7").textContent = "x" + format(1 + 1 / 20 * player.researches[11] + 1 / 25 * player.researches[12] + 1 / 40 * player.researches[13] + 3 / 200 * player.researches[14] + 1 / 200 * player.researches[15], 3, true)
    document.getElementById("sM8").textContent = "x" + format(1 + 1 / 20 * player.researches[87], 3, true)
    document.getElementById("sM9").textContent = "x" + format(calculateSigmoidExponential(40, (player.antUpgrades[5-1] + G['bonusant5']) / 1000 * 40 / 39),2,true)
    document.getElementById("sM10").textContent = "x" + format(G['cubeBonusMultiplier'][2], 3, true)
    document.getElementById("sM11").textContent = "x" + format(((player.currentChallenge.transcension !== 0 || player.currentChallenge.reincarnation !== 0) && player.upgrades[50] > 0.5 ? 1.25 : 1), 3, true)
    document.getElementById("sM12").textContent = "^" + format(Math.min(1, (1 + player.platonicUpgrades[6] / 30) * G['divisivenessPower'][player.usedCorruptions[1]] / (1 + Math.abs(player.usedCorruptions[1] - player.usedCorruptions[2]))), 3, true)
    document.getElementById("sM13").textContent = format(G['freeMultiplier'], 3, true)
}

export const loadStatisticsCubeMultipliers = () => {
    const arr = calculateCubeMultiplier(false);
    const map: Record<number, { acc: number, desc: string }> = {
        1: {acc: 4, desc: "Ascension Timer Multiplier"},
        2: {acc: 2, desc: "Season pass:"},
        3: {acc: 4, desc: "Research 5x19:"},
        4: {acc: 4, desc: "Research 5x20:"},
        5: {acc: 2, desc: "Cube upgrade 1x1:"},
        6: {acc: 2, desc: "Cube upgrade 2x1:"},
        7: {acc: 2, desc: "Cube upgrade 3x1:"},
        8: {acc: 2, desc: "Cube upgrade 4x1:"},
        9: {acc: 2, desc: "Cube upgrade 5x1:"},
        10: {acc: 2, desc: "Research 6x12:"},
        11: {acc: 3, desc: "Research 7x2:"},
        12: {acc: 3, desc: "Research 7x17:"},
        13: {acc: 3, desc: "Research 8x7:"},
        14: {acc: 3, desc: "Research 8x22:"},
        15: {acc: 3, desc: "Ascension Count Achievement:"},
        16: {acc: 4, desc: "Bought Mortuus Est ants (R8x17):"},
        17: {acc: 4, desc: "Duplication Spirit Power:"},
        18: {acc: 5, desc: "Research 8x25:"},
        19: {acc: 4, desc: "Constant upgrade 10:"},
        20: {acc: 2, desc: "Cube upgrade 3x10:"},
        21: {acc: 2, desc: "Number Achievement 4 Bonus:"},
        22: {acc: 2, desc: "Number Achievement 6 Bonus:"},
        23: {acc: 2, desc: "Challenge 11 Ach:"},
        24: {acc: 4, desc: "ASCENDED Achievement:"},
        25: {acc: 2, desc: "Sun & Moon Achievements:"},
        26: {acc: 4, desc: "Cube Shards:"},
        27: {acc: 4, desc: "Challenge 15 Reward:"},
    }
    for (let i = 0; i < arr.length; i++) {
        const statCMi = document.getElementById(`statCM${i + 1}`);
        statCMi.childNodes[0].textContent = map[i + 1].desc;
        document.getElementById(`sCM${i + 1}`).textContent = `x${format(arr[i], map[i + 1].acc, true)}`;
    }
    // PLAT
    document.getElementById("sCMT").textContent = `x${format(calculateCubeMultiplier(), 3)}`;
}

export const loadStatisticsOfferingMultipliers = () => {
    const arr = calculateOfferings("prestige", false); 
    const map: Record<number, { acc: number, desc: string }> = {
        1: {acc: 3, desc: "Alchemy Achievement 5:"},
        2: {acc: 3, desc: "Alchemy Achievement 6:"},
        3: {acc: 3, desc: "Alchemy Achievement 7:"},
        4: {acc: 3, desc: "Diamond Upgrade 4x3:"},
        5: {acc: 3, desc: "Particle Upgrade 3x5:"},
        6: {acc: 3, desc: "Auto Offering Shop Upgrade:"},
        7: {acc: 3, desc: "Offering EX Shop Upgrade:"},
        8: {acc: 3, desc: "Cash Grab Shop Upgrade:"},
        9: {acc: 3, desc: "Research 4x10:"},
        10: {acc: 3, desc: "Sacrificium Formicidae:"},
        11: {acc: 3, desc: "Plutus Cube Tribute:"},
        12: {acc: 3, desc: "Constant Upgrade 3:"},
        13: {acc: 3, desc: "Research 6x24,8x4:"},
        14: {acc: 3, desc: "Challenge 12:"},
        15: {acc: 3, desc: "Research 8x25:"},
        16: {acc: 3, desc: "Ascension Count Achievement:"},
        17: {acc: 3, desc: "Sun and Moon Achievements:"},
        18: {acc: 3, desc: "Cube Upgrade 5x6:"},
        19: {acc: 3, desc: "Cube Upgrade 5x10:"},
        20: {acc: 3, desc: "Platonic ALPHA:"},
        21: {acc: 3, desc: "Platonic BETA:"},
        22: {acc: 3, desc: "Platonic OMEGA:"},
        23: {acc: 3, desc: "Challenge 15:"},
    }
    for (let i = 0; i < arr.length; i++) {
        const statOffi = document.getElementById(`statOff${i + 1}`);
        statOffi.childNodes[0].textContent = map[i + 1].desc;
        document.getElementById(`sOff${i + 1}`).textContent = `x${format(arr[i], map[i + 1].acc, true)}`;
    }
    document.getElementById("sOffT").textContent = `x${format(calculateOfferings("prestige", true, true), 3)}`;
}

export const c15RewardUpdate = () => {
    const exponentRequirements = [750, 1.5e3, 3e3, 5e3, 7.5e3, 7.5e3, 1e4, 1e4, 2e4, 4e4, 6e4, 1e5, 1e5, 2e5, 5e5, 1e6, 3e6, 1e7, 3e7, 1e8, 5e8, 2e9, 1e10]
    const keys = Object.keys(G['challenge15Rewards'])
    const e = player.challenge15Exponent

    for(const obj in G['challenge15Rewards']){
        G['challenge15Rewards'][obj] = 1;
    }

    if(e >= exponentRequirements[0]){
        //All Cube Types 1 [750]
        G['challenge15Rewards'][keys[0]] = 1 + 1/50 * Math.log(e/175) / Math.log(2)
    }
    if(e >= exponentRequirements[1]){
        //Ascension Count [1500]
        G['challenge15Rewards'][keys[1]] = 1 + 1/20 * Math.log(e/375) / Math.log(2)
    }
    if(e >= exponentRequirements[2]){
        //Coin Exponent [3000]
        G['challenge15Rewards'][keys[2]] = 1 + 1/150 * Math.log(e/750)/Math.log(2)
    }
    if(e >= exponentRequirements[3]){
        //Taxes [5000]
        G['challenge15Rewards'][keys[3]] = Math.pow(0.98, Math.log(e/1.25e3)/Math.log(2))
    }
    if(e >= exponentRequirements[4]){
        //Obtainium [7500]
        G['challenge15Rewards'][keys[4]] = 1 + 1/5 * Math.pow(e/7.5e3, 0.75)
    }
    if(e >= exponentRequirements[5]){
        //Offerings [7500]
        G['challenge15Rewards'][keys[5]] = 1 + 1/5 * Math.pow(e/7.5e3, 0.75)
    }
    if(e >= exponentRequirements[6]){
        //Accelerator Boost (Uncorruptable) [10000]
        G['challenge15Rewards'][keys[6]] = 1 + 1/20 * Math.log(e/2.5e3) / Math.log(2)
    }
    if(e >= exponentRequirements[7]){
        //Multiplier Boost (Uncorruptable) [10000]
        G['challenge15Rewards'][keys[7]] = 1 + 1/20 * Math.log(e/2.5e3)/Math.log(2)
    }
    if(e >= exponentRequirements[8]){
        //Rune EXP [20000]
        G['challenge15Rewards'][keys[8]] = 1 + Math.pow(e/2e4, 1.5)
    }
    if(e >= exponentRequirements[9]){
        //Rune Effectiveness [40000]
        G['challenge15Rewards'][keys[9]] = 1 + 1/33 * Math.log(e/1e4)/Math.log(2)
    }
    if(e >= exponentRequirements[10]){
        //All Cube Types II [60000]
        G['challenge15Rewards'][keys[10]] = 1 + 1/100 * Math.log(e/1.5e4)/Math.log(2)
    }
    if(e >= exponentRequirements[11]){
        //Chal 1-5 Scaling [100000]
        G['challenge15Rewards'][keys[11]] = Math.pow(0.98, Math.log(e/2.5e4)/Math.log(2))
    }
    if(e >= exponentRequirements[12]){
        //Chal 6-10 Scaling [100000]
        G['challenge15Rewards'][keys[12]] = Math.pow(0.98, Math.log(e/2.5e4)/Math.log(2))
    }
    if(e >= exponentRequirements[13]){
        //Ant Speed [200k]
        G['challenge15Rewards'][keys[13]] = Math.pow(1 + Math.log(e/2e5)/Math.log(2), 4)
    }
    if(e >= exponentRequirements[14]){
        //Ant Bonus Levels [500k]
        G['challenge15Rewards'][keys[14]] = 1 + 1/20 * Math.log(e/1.5e5)/Math.log(2)
    }
    if(e >= exponentRequirements[15]){
        //All Cube Types III [1m]
        G['challenge15Rewards'][keys[15]] = 1 + 1/150 * Math.log(e/2.5e5) / Math.log(2)
    }
    if(e >= exponentRequirements[16]){
        //Talisman Effectiveness [3m]
        G['challenge15Rewards'][keys[16]] = 1 + 1/20 * Math.log(e/7.5e5) / Math.log(2)
    }
    if(e >= exponentRequirements[17]){
        //Global Speed [10m]
        G['challenge15Rewards'][keys[17]] = 1 + 1/20 * Math.log(e/2.5e6) / Math.log(2)
    }
    if(e >= exponentRequirements[18]){
        //Blessing Effectiveness [30m]
        G['challenge15Rewards'][keys[18]] = 1 + 1/5 * Math.pow(e/3e7,1/4)
    }
    if(e >= exponentRequirements[19]){
        //Tesseract Building Speed [100m]
        G['challenge15Rewards'][keys[19]] = 1 + 1/5 * Math.pow(e/1e8,2/3)
    }
    if(e >= exponentRequirements[20]){
        //All Cube Types IV [500m]
        G['challenge15Rewards'][keys[20]] = 1 + 1/200 * Math.log(e/1.25e8) / Math.log(2)
    }
    if(e >= exponentRequirements[21]){
        //Spirit Effectiveness [2b]
        G['challenge15Rewards'][keys[21]] = 1 + 1/5 * Math.pow(e/2e9,1/4)
    }
    if(e >= exponentRequirements[22]){
        //Ascension Score [10b]
        G['challenge15Rewards'][keys[22]] = 1 + 1/4 * Math.pow(e/1e10,1/4)
    }


    updateDisplayC15Rewards();
}

const updateDisplayC15Rewards = () => {
    document.getElementById('c15Reward0Num').textContent = format(player.challenge15Exponent,0,true)
    const exponentRequirements = [750, 1.5e3, 3e3, 5e3, 7.5e3, 7.5e3, 1e4, 1e4, 2e4, 4e4, 6e4, 1e5, 1e5, 2e5, 5e5, 1e6, 3e6, 1e7, 3e7, 1e8, 5e8, 2e9, 1e10]
    const values = Object.values(G['challenge15Rewards'])
    let keepExponent: string | number = 'None'
    for(let i = 0; i < exponentRequirements.length; i++){
        if(keepExponent === 'None' && player.challenge15Exponent < exponentRequirements[i]){
            keepExponent = exponentRequirements[i]
        }
        if(player.challenge15Exponent >= exponentRequirements[i]){
            document.getElementById('c15Reward'+(i+1)+'Num').textContent = format(100 * values[i] - 100,2,true)
        }
        document.getElementById('c15Reward'+(i+1)).style.display = (player.challenge15Exponent >= exponentRequirements[i])? 'block': 'none';
        document.getElementById('c15RewardList').textContent = typeof keepExponent  === 'string'
            ? 'You have unlocked all reward types from Challenge 15!'
            : 'Next reward type requires ' + format(keepExponent,0,true) + ' exponent.' 
    }
}
