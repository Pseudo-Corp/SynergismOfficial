function loadStatisticsAccelerator() {
    document.getElementById("sA1").textContent = "+" + format(freeUpgradeAccelerator, 0, false)
    document.getElementById("sA2").textContent = "+" + format(totalAcceleratorBoost * (4 + 2 * player.researches[18] + 2 * player.researches[19] + 3 * player.researches[20] + cubeBonusMultiplier[1]), 0, false)
    document.getElementById("sA3").textContent = "+" + format(Math.floor(Math.pow(rune1level * effectiveLevelMult / 10, 1.1)), 0, true)
    document.getElementById("sA4").textContent = "x" + format(1 + rune1level * 1 / 200 * effectiveLevelMult, 3, true)
    document.getElementById("sA5").textContent = "x" + format(Math.pow(1.01, player.upgrades[21] + player.upgrades[22] + player.upgrades[23] + player.upgrades[24] + player.upgrades[25]), 3, true)
    document.getElementById("sA6").textContent = "x" + format(Math.pow(1.01, player.achievements[60] + player.achievements[61] + player.achievements[62]), 3, true)
    document.getElementById("sA7").textContent = "x" + format(1 + 1 / 5 * player.researches[1], 3, true)
    document.getElementById("sA8").textContent = "x" + format(1 + 1 / 20 * player.researches[6] + 1 / 25 * player.researches[7] + 1 / 40 * player.researches[8] + 3 / 200 * player.researches[9] + 1 / 200 * player.researches[10], 3, true)
    document.getElementById("sA9").textContent = "x" + format(1 + 1 / 20 * player.researches[86], 3, true)
    document.getElementById("sA10").textContent = "x" + format(1.25, 3, true)
    document.getElementById("sA11").textContent = "^" + format(maladaptivePower[player.usedCorruptions[2]], 3, true)
    document.getElementById("sA12").textContent = format(freeAccelerator, 0, true)
}

function loadStatisticsMultiplier() {
    document.getElementById("sM1").textContent = "+" + format(freeUpgradeMultiplier, 0, true)
    document.getElementById("sM2").textContent = "+" + format(Math.floor(Math.floor(rune2level / 10 * effectiveLevelMult) * Math.floor(10 + rune2level / 10 * effectiveLevelMult) / 2) * 100 / 100, 0, true)
    document.getElementById("sM3").textContent = "x" + format(1 + rune2level / 200 * effectiveLevelMult, 3, true)
    document.getElementById("sM4").textContent = "x" + format(Math.pow(1.01, player.upgrades[21] + player.upgrades[22] + player.upgrades[23] + player.upgrades[24] + player.upgrades[25]) * (1 + player.upgrades[34] * 3 / 100) * (1 + player.upgrades[34] * (2 / 103)), 3, true)
    document.getElementById("sM5").textContent = "x" + format(Math.pow(1.01, player.achievements[57] + player.achievements[58] + player.achievements[59]), 3, true)
    document.getElementById("sM6").textContent = "x" + format(1 + 1 / 5 * player.researches[2], 3, true)
    document.getElementById("sM7").textContent = "x" + format(1 + 1 / 20 * player.researches[11] + 1 / 25 * player.researches[12] + 1 / 40 * player.researches[13] + 3 / 200 * player.researches[14] + 1 / 200 * player.researches[15], 3, true)
    document.getElementById("sM8").textContent = "x" + format(1 + 1 / 20 * player.researches[87], 3, true)
    document.getElementById("sM9").textContent = "x" + format(calculateSigmoidExponential(40, (player.antUpgrades[5] + bonusant5) / 1000 * 40 / 39),2,true)
    document.getElementById("sM10").textContent = "x" + format(cubeBonusMultiplier[2], 3, true)
    document.getElementById("sM11").textContent = "x" + format(1.25, 3, true)
    document.getElementById("sM12").textContent = "^" + format(divisivenessPower[player.usedCorruptions[1]], 3, true)
    document.getElementById("sM13").textContent = format(freeMultiplier, 3, true)
}

function loadStatisticsCubeMultipliers() {
    const arr = calculateCubeMultiplier(false)
    const map = {
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
        let statCMi = document.getElementById(`statCM${i + 1}`);
        statCMi.childNodes[0].textContent = map[i + 1].desc;
        document.getElementById(`sCM${i + 1}`).textContent = `x${format(arr[i], map[i + 1].acc, true)}`;
    }
    document.getElementById("sCMT").textContent = `x${format(calculateCubeMultiplier(true), 3)}`;
}

function loadStatisticsOfferingMultipliers() {
    const arr = calculateOfferings(1, false)
    const map = {
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
        let statOffi = document.getElementById(`statOff${i + 1}`);
        statOffi.childNodes[0].textContent = map[i + 1].desc;
        document.getElementById(`sOff${i + 1}`).textContent = `x${format(arr[i], map[i + 1].acc, true)}`;
    }
    document.getElementById("sOffT").textContent = `x${format(calculateOfferings(1, true, true), 3)}`;
}

function c15RewardUpdate(){
    let exponentRequirements = [1e3, 2e3, 3e3, 5e3, 7.5e3, 1e4, 2e4, 3e4, 5e4, 7.5e4, 1e5, 2e5, 3e5, 4e5, 5e5, 7.5e5, 1e6, 2e6, 3e6, 5e6, 7.5e6, 1e7]
    let keys = Object.keys(challenge15Rewards)
    let e = player.challenge15Exponent

    for(let obj in challenge15Rewards){
        challenge15Rewards[obj] = 1;
    }

    if(e >= exponentRequirements[0]){
        challenge15Rewards[keys[0]] = 1 + 1/100 * Math.log(e) / Math.log(10)
    }
    if(e >= exponentRequirements[1]){
        challenge15Rewards[keys[1]] = Math.pow(0.99, Math.log(e)/Math.log(2))
    }
    if(e >= exponentRequirements[2]){
        challenge15Rewards[keys[2]] = 1 + 1/50 * Math.pow(e/1500, 1/2)
    }
    if(e >= exponentRequirements[3]){
        challenge15Rewards[keys[3]] = 1 + 1/50 * Math.pow(e/1500,1/2)
    }
    if(e >= exponentRequirements[4]){
        challenge15Rewards[keys[4]] = 1 + 1/50 * Math.pow(e/4e3,2)
    }
    if(e >= exponentRequirements[5]){
        challenge15Rewards[keys[5]] = 1 + 1/50 * Math.pow(e/7.5e3,1/4)
    }
    if(e >= exponentRequirements[6]){
        challenge15Rewards[keys[6]] = Math.pow(1.0075, -Math.log(e)/Math.log(2))
    }
    if(e >= exponentRequirements[7]){
        challenge15Rewards[keys[7]] = Math.pow(1.006, -Math.log(e)/Math.log(2))
    }
    if(e >= exponentRequirements[8]){
        challenge15Rewards[keys[8]] = 1 + 1/5 * e/3e4
    }
    if(e >= exponentRequirements[9]){
        challenge15Rewards[keys[9]] = 1 + 1/5 * e/5e4
    }
    if(e >= exponentRequirements[10]){
        challenge15Rewards[keys[10]] = 1 + 1 * Math.pow(e/7.5e4,1.5)
    }
    if(e >= exponentRequirements[11]){
        challenge15Rewards[keys[11]] = 1 + 1/10 * Math.pow(e/1e5,1/3)
    }
    if(e >= exponentRequirements[12]){
        challenge15Rewards[keys[12]] = 1 + 1/10 * Math.pow(e/2e5,1/3)
    }
    if(e >= exponentRequirements[13]){
        challenge15Rewards[keys[13]] = 1 + 1/10 * Math.pow(e/3e5,1/2)
    }
    if(e >= exponentRequirements[14]){
        challenge15Rewards[keys[14]] = 1 + 1/20 * Math.pow(e/4e5,1/3)
    }
    if(e >= exponentRequirements[15]){
        challenge15Rewards[keys[15]] = 1 + 1/2 * Math.pow(e/5e5, 0.75)
    }
    if(e >= exponentRequirements[16]){
        challenge15Rewards[keys[16]] = 1 + 1/5 * Math.pow(e/7.5e5, 1/2)
    }
    if(e >= exponentRequirements[17]){
        challenge15Rewards[keys[17]] = 1 + 1/5 * Math.pow(e/1e6,1/2)
    }
    if(e >= exponentRequirements[18]){
        challenge15Rewards[keys[18]] = 1 + 1/5 * Math.pow(e/2e6,1/2)
    }
    if(e >= exponentRequirements[19]){
        challenge15Rewards[keys[19]] = 1 + 1/5 * Math.pow(e/3e6,1/2)
    }
    if(e >= exponentRequirements[20]){
        challenge15Rewards[keys[20]] = 1 + 1/20 * Math.pow(e/4e6,1/3)
    }
    if(e >= exponentRequirements[21]){
        challenge15Rewards[keys[21]] = 1 + 1/10 * Math.pow(e/5e6,1/4)
    }


    updateDisplayC15Rewards();
}

function updateDisplayC15Rewards(){
    document.getElementById('c15Reward0Num').textContent = format(player.challenge15Exponent,0,true)
    let exponentRequirements = [1e3, 2e3, 3e3, 5e3, 7.5e3, 1e4, 2e4, 3e4, 5e4, 7.5e4, 1e5, 2e5, 3e5, 4e5, 5e5, 7.5e5, 1e6, 2e6, 3e6, 5e6, 7.5e6, 1e7]
    let values = Object.values(challenge15Rewards)
    let keepExponent = 'None'
    for(var i = 0; i < exponentRequirements.length; i++){
        if(keepExponent === 'None' && player.challenge15Exponent < exponentRequirements[i]){
            keepExponent = exponentRequirements[i]
        }
        if(player.challenge15Exponent >= exponentRequirements[i]){
            document.getElementById('c15Reward'+(i+1)+'Num').textContent = format(100 * values[i] - 100,2,true)
        }
        document.getElementById('c15Reward'+(i+1)).style.display = (player.challenge15Exponent >= exponentRequirements[i])? 'block': 'none';
        document.getElementById('c15RewardList').textContent = (typeof keepExponent  === 'string')?
            'You have unlocked all reward types from Challenge 15!':
            'Next reward type requires ' + format(keepExponent,0,true) + ' exponent.' 
    }
}
