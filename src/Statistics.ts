import { player, format } from './Synergism';
import { Globals as G } from './Variables';
import { calculateSigmoidExponential, calculateCubeMultiplier, calculateOfferings, calculateTesseractMultiplier, calculateHypercubeMultiplier, calculatePlatonicMultiplier, calculateHepteractMultiplier, calculateAllCubeMultiplier, calculateSigmoid, calculatePowderConversion } from './Calculate';
import { challenge15ScoreMultiplier } from './Challenges';
import type { GlobalVariables } from './types/Synergism';
import { DOMCacheGetOrSet } from './Cache/DOM';

const associated = new Map<string, string>([
    ['kMisc', 'miscStats'],
    ['kFreeAccel', 'acceleratorStats'],
    ['kFreeMult', 'multiplierStats'],
    ['kOfferingMult', 'offeringMultiplierStats'],
    ['kGlobalCubeMult', 'globalCubeMultiplierStats'],
    ['kCubeMult', 'cubeMultiplierStats'],
    ['kTessMult', 'tesseractMultiplierStats'],
    ['kHypercubeMult', 'hypercubeMultiplierStats'],
    ['kPlatMult', 'platonicMultiplierStats'],
    ['kHeptMult', 'hepteractMultiplierStats'],
    ['kOrbPowderMult', 'powderMultiplierStats']
]);

export const displayStats = (btn: HTMLElement) => {
    for (const e of Array.from(btn.parentElement.children) as HTMLElement[]) {
        if (e.id !== btn.id) {
            e.style.backgroundColor = '';
            DOMCacheGetOrSet(associated.get(e.id)).style.display = 'none';
        }
    }
    
    const statsEl = DOMCacheGetOrSet(associated.get(btn.id));
    statsEl.style.display = 'block';
    btn.style.backgroundColor = 'crimson';
}

export const loadStatisticsAccelerator = () => {
    DOMCacheGetOrSet("sA1").textContent = "+" + format(G['freeUpgradeAccelerator'], 0, false)
    DOMCacheGetOrSet("sA2").textContent = "+" + format(G['totalAcceleratorBoost'] * (4 + 2 * player.researches[18] + 2 * player.researches[19] + 3 * player.researches[20] + G['cubeBonusMultiplier'][1]), 0, false)
    DOMCacheGetOrSet("sA3").textContent = "+" + format(Math.floor(Math.pow(G['rune1level'] * G['effectiveLevelMult'] / 10, 1.1)), 0, true)
    DOMCacheGetOrSet("sA4").textContent = "x" + format(1 + G['rune1level'] * 1 / 200 * G['effectiveLevelMult'], 3, true)
    DOMCacheGetOrSet("sA5").textContent = "x" + format(Math.pow(1.01, player.upgrades[21] + player.upgrades[22] + player.upgrades[23] + player.upgrades[24] + player.upgrades[25]), 3, true)
    DOMCacheGetOrSet("sA6").textContent = "x" + format(Math.pow(1.01, player.achievements[60] + player.achievements[61] + player.achievements[62]), 3, true)
    DOMCacheGetOrSet("sA7").textContent = "x" + format(1 + 1 / 5 * player.researches[1], 3, true)
    DOMCacheGetOrSet("sA8").textContent = "x" + format(1 + 1 / 20 * player.researches[6] + 1 / 25 * player.researches[7] + 1 / 40 * player.researches[8] + 3 / 200 * player.researches[9] + 1 / 200 * player.researches[10], 3, true)
    DOMCacheGetOrSet("sA9").textContent = "x" + format(1 + 1 / 20 * player.researches[86], 3, true)
    DOMCacheGetOrSet("sA10").textContent = "x" + format(((player.currentChallenge.transcension !== 0 || player.currentChallenge.reincarnation !== 0) && player.upgrades[50] > 0.5 ? 1.25 : 1), 3, true)
    DOMCacheGetOrSet("sA11").textContent = "^" + format(Math.min(1, (1 + player.platonicUpgrades[6] / 30) * G['maladaptivePower'][player.usedCorruptions[2]] / (1 + Math.abs(player.usedCorruptions[1] - player.usedCorruptions[2]))), 3, true)
    DOMCacheGetOrSet("sA12").textContent = format(G['freeAccelerator'], 0, true)
}

export const loadStatisticsMultiplier = () => {
    DOMCacheGetOrSet("sM1").textContent = "+" + format(G['freeUpgradeMultiplier'], 0, true)
    DOMCacheGetOrSet("sM2").textContent = "+" + format(Math.floor(Math.floor(G['rune2level'] / 10 * G['effectiveLevelMult']) * Math.floor(10 + G['rune2level'] / 10 * G['effectiveLevelMult']) / 2) * 100 / 100, 0, true)
    DOMCacheGetOrSet("sM3").textContent = "x" + format(1 + G['rune2level'] / 200 * G['effectiveLevelMult'], 3, true)
    DOMCacheGetOrSet("sM4").textContent = "x" + format(Math.pow(1.01, player.upgrades[21] + player.upgrades[22] + player.upgrades[23] + player.upgrades[24] + player.upgrades[25]) * (1 + player.upgrades[34] * 3 / 100) * (1 + player.upgrades[34] * (2 / 103)), 3, true)
    DOMCacheGetOrSet("sM5").textContent = "x" + format(Math.pow(1.01, player.achievements[57] + player.achievements[58] + player.achievements[59]), 3, true)
    DOMCacheGetOrSet("sM6").textContent = "x" + format(1 + 1 / 5 * player.researches[2], 3, true)
    DOMCacheGetOrSet("sM7").textContent = "x" + format(1 + 1 / 20 * player.researches[11] + 1 / 25 * player.researches[12] + 1 / 40 * player.researches[13] + 3 / 200 * player.researches[14] + 1 / 200 * player.researches[15], 3, true)
    DOMCacheGetOrSet("sM8").textContent = "x" + format(1 + 1 / 20 * player.researches[87], 3, true)
    DOMCacheGetOrSet("sM9").textContent = "x" + format(calculateSigmoidExponential(40, (player.antUpgrades[5-1] + G['bonusant5']) / 1000 * 40 / 39),2,true)
    DOMCacheGetOrSet("sM10").textContent = "x" + format(G['cubeBonusMultiplier'][2], 3, true)
    DOMCacheGetOrSet("sM11").textContent = "x" + format(((player.currentChallenge.transcension !== 0 || player.currentChallenge.reincarnation !== 0) && player.upgrades[50] > 0.5 ? 1.25 : 1), 3, true)
    DOMCacheGetOrSet("sM12").textContent = "^" + format(Math.min(1, (1 + player.platonicUpgrades[6] / 30) * G['divisivenessPower'][player.usedCorruptions[1]] / (1 + Math.abs(player.usedCorruptions[1] - player.usedCorruptions[2]))), 3, true)
    DOMCacheGetOrSet("sM13").textContent = format(G['freeMultiplier'], 3, true)
}

export const loadStatisticsCubeMultipliers = () => {

    const arr0 = calculateAllCubeMultiplier().list;
    const map0: Record<number, { acc: number, desc: string }> = {
        1: {acc: 2, desc: "Ascension Time Multiplier:"},
        2: {acc: 2, desc: "Sun and Moon Achievements:"},
        3: {acc: 2, desc: "Speed Achievement:"},
        4: {acc: 2, desc: "Challenge 15 All Cube Bonus:"},
        5: {acc: 2, desc: "Rune 6 - Infinite Ascent:"},
        6: {acc: 2, desc: "Platonic Beta:"},
        7: {acc: 2, desc: "Platonic Omega:"},
        8: {acc: 2, desc: "Overflux Powder:"},
        9: {acc: 2, desc: "Event [Most Recent: June 28 - July 01]"},
        10: {acc: 2, desc: "Singularity Factor:"},
        11: {acc: 2, desc: "Wow Pass Y"},
        12: {acc: 2, desc: "Wow Pass Z"},
    }
    for (let i = 0; i < arr0.length; i++) {
        const statGCMi = DOMCacheGetOrSet(`statGCM${i + 1}`);
        statGCMi.childNodes[0].textContent = map0[i + 1].desc;
        DOMCacheGetOrSet(`sGCM${i + 1}`).textContent = `x${format(arr0[i], map0[i + 1].acc, true)}`;
    }

    DOMCacheGetOrSet("sGCMT").textContent = `x${format(calculateAllCubeMultiplier().mult, 3)}`;

    const arr = calculateCubeMultiplier().list;
    const map: Record<number, { acc: number, desc: string }> = {
        1: {acc: 2, desc: "Ascension Score Multiplier:"},
        2: {acc: 2, desc: "Global Cube Multiplier:"},
        3: {acc: 2, desc: "Season Pass 1:"},
        4: {acc: 2, desc: "Researches (Except 8x25):"},
        5: {acc: 2, desc: "Research 8x25:"},
        6: {acc: 2, desc: "Cube Upgrades:"},
        7: {acc: 2, desc: "Constant Upgrade 10:"},
        8: {acc: 2, desc: "Achievement 189 Bonus:"},
        9: {acc: 2, desc: "Achievement 193 Bonus:"},
        10: {acc: 2, desc: "Achievement 195 Bonus:"},
        11: {acc: 2, desc: "Achievement 198-201 Bonus:"},
        12: {acc: 2, desc: "Achievement 254 Bonus:"},
        13: {acc: 2, desc: "Spirit Power:"},
        14: {acc: 2, desc: "Platonic Cubes:"},
        15: {acc: 2, desc: "Platonic 1x1:"},
    }
    for (let i = 0; i < arr.length; i++) {
        const statCMi = DOMCacheGetOrSet(`statCM${i + 1}`);
        statCMi.childNodes[0].textContent = map[i + 1].desc;
        DOMCacheGetOrSet(`sCM${i + 1}`).textContent = `x${format(arr[i], map[i + 1].acc, true)}`;
    }
    // PLAT
    DOMCacheGetOrSet("sCMT").textContent = `x${format(calculateCubeMultiplier().mult, 3)}`;

    const arr2 = calculateTesseractMultiplier().list;
    const map2: Record<number, { acc: number, desc: string }> = {
        1: {acc: 2, desc: "Ascension Score Multiplier:"},
        2: {acc: 2, desc: "Global Cube Multiplier:"},
        3: {acc: 2, desc: "Season Pass 1:"},
        4: {acc: 2, desc: "Constant Upgrade 10:"},
        5: {acc: 2, desc: "Cube Upgrade 3x10:"},
        6: {acc: 2, desc: "Cube Upgrade 4x8:"},
        7: {acc: 2, desc: "Achievement 195 Bonus:"},
        8: {acc: 2, desc: "Achievement 202 Bonus:"},
        9: {acc: 2, desc: "Achievement 205-208 Bonus:"},
        10: {acc: 2, desc: "Achievement 255 Bonus:"},
        11: {acc: 2, desc: "Platonic Cubes:"},
        12: {acc: 2, desc: "Platonic 1x2:"},
    }
    for (let i = 0; i < arr2.length; i++) {
        const statTeMi = DOMCacheGetOrSet(`statTeM${i + 1}`);
        statTeMi.childNodes[0].textContent = map2[i + 1].desc;
        DOMCacheGetOrSet(`sTeM${i + 1}`).textContent = `x${format(arr2[i], map2[i + 1].acc, true)}`;
    }

    DOMCacheGetOrSet("sTeMT").textContent = `x${format(calculateTesseractMultiplier().mult, 3)}`;

    const arr3 = calculateHypercubeMultiplier().list;
    const map3: Record<number, { acc: number, desc: string }> = {
        1: {acc: 2, desc: "Ascension Score Multiplier:"},
        2: {acc: 2, desc: "Global Cube Multiplier:"},
        3: {acc: 2, desc: "Season Pass 2:"},
        4: {acc: 2, desc: "Achievement 212-215 Bonus:"},
        5: {acc: 2, desc: "Achievement 216 Bonus:"},
        6: {acc: 2, desc: "Achievement 253 Bonus:"},
        7: {acc: 2, desc: "Achievement 256 Bonus:"},
        8: {acc: 2, desc: "Achievement 265 Bonus:"},
        9: {acc: 2, desc: "Platonic Cubes:"},
        10: {acc: 2, desc: "Platonic 1x3:"},
        11: {acc: 2, desc: "Hyperreal Hepteract Bonus:"},
    }
    for (let i = 0; i < arr3.length; i++) {
        const statHyMi = DOMCacheGetOrSet(`statHyM${i + 1}`);
        statHyMi.childNodes[0].textContent = map3[i + 1].desc;
        DOMCacheGetOrSet(`sHyM${i + 1}`).textContent = `x${format(arr3[i], map3[i + 1].acc, true)}`;
    }

    DOMCacheGetOrSet("sHyMT").textContent = `x${format(calculateHypercubeMultiplier().mult, 3)}`;

    const arr4 = calculatePlatonicMultiplier().list;
    const map4: Record<number, { acc: number, desc: string }> = {
        1: {acc: 2, desc: "Ascension Score Multiplier:"},
        2: {acc: 2, desc: "Global Cube Multiplier:"},
        3: {acc: 2, desc: "Season Pass 2:"},
        4: {acc: 2, desc: "Achievement 196 Bonus:"},
        5: {acc: 2, desc: "Achievement 219-222 Bonus:"},
        6: {acc: 2, desc: "Achievement 223 Bonus:"},
        7: {acc: 2, desc: "Achievement 257 Bonus:"},
        8: {acc: 2, desc: "Platonic Cubes:"},
        9: {acc: 2, desc: "Platonic 1x4:"},
    }
    for (let i = 0; i < arr4.length; i++) {
        const statPlMi = DOMCacheGetOrSet(`statPlM${i + 1}`);
        statPlMi.childNodes[0].textContent = map4[i + 1].desc;
        DOMCacheGetOrSet(`sPlM${i + 1}`).textContent = `x${format(arr4[i], map4[i + 1].acc, true)}`;
    }

    DOMCacheGetOrSet("sPlMT").textContent = `x${format(calculatePlatonicMultiplier().mult, 3)}`;

    const arr5 = calculateHepteractMultiplier().list;
    const map5: Record<number, { acc: number, desc: string }> = {
        1: {acc: 2, desc: "Ascension Score Multiplier:"},
        2: {acc: 2, desc: "Global Cube Multiplier:"},
        3: {acc: 2, desc: "Season Pass 3:"},
        4: {acc: 2, desc: "Achievement 258 Bonus:"},
        5: {acc: 2, desc: "Achievement 264 Bonus:"},
        6: {acc: 2, desc: "Achievement 265 Bonus:"},
        7: {acc: 2, desc: "Achievement 270 Bonus:"},
    }
    for (let i = 0; i < arr5.length; i++) {
        const statHeMi = DOMCacheGetOrSet(`statHeM${i + 1}`);
        statHeMi.childNodes[0].textContent = map5[i + 1].desc;
        DOMCacheGetOrSet(`sHeM${i + 1}`).textContent = `x${format(arr5[i], map5[i + 1].acc, true)}`;
    }

    DOMCacheGetOrSet("sHeMT").textContent = `x${format(calculateHepteractMultiplier().mult, 3)}`;
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
        const statOffi = DOMCacheGetOrSet(`statOff${i + 1}`);
        statOffi.childNodes[0].textContent = map[i + 1].desc;
        DOMCacheGetOrSet(`sOff${i + 1}`).textContent = `x${format(arr[i], map[i + 1].acc, true)}`;
    }
    DOMCacheGetOrSet("sOffT").textContent = `x${format(calculateOfferings("prestige", true, true), 3)}`;
}

export const loadPowderMultiplier = () => {
    const arr0 = calculatePowderConversion().list;
    const map0: Record<number, { acc: number, desc: string }> = {
        1: {acc: 2, desc: "Base:"},
        2: {acc: 2, desc: "Challenge 15 Bonus:"},
        3: {acc: 2, desc: "Powder EX:"},
        4: {acc: 2, desc: "Achievement 256:"},
        5: {acc: 2, desc: "Achievement 257:"},
        6: {acc: 2, desc: "Platonic Upgrade 16 [4x1]"},
        7: {acc: 2, desc: "Event [Most Recent: June 20 - June 27]:"},
    }
    for (let i = 0; i < arr0.length; i++) {
        const statGCMi = DOMCacheGetOrSet(`statPoM${i + 1}`);
        statGCMi.childNodes[0].textContent = map0[i + 1].desc;
        DOMCacheGetOrSet(`sPoM${i + 1}`).textContent = `x${format(arr0[i], map0[i + 1].acc, true)}`;
    }

    DOMCacheGetOrSet("sPoMT").textContent = `x${format(calculatePowderConversion().mult, 3)}`;
}

export const c15RewardUpdate = () => {
    const exponentRequirements = [750, 1.5e3, 3e3, 5e3, 7.5e3, 7.5e3, 1e4, 1e4, 2e4, 4e4, 6e4, 1e5, 1e5, 2e5, 5e5, 1e6, 3e6, 1e7, 3e7, 1e8, 5e8, 2e9, 1e10, 1e11, 1e15, 2e15, 4e15, 7e15, 1e16, 2e16, 3.33e16, 3.33e16, 3.33e16, 2e17, 1.5e18]
    type Key = keyof GlobalVariables['challenge15Rewards'];
    const keys = Object.keys(G['challenge15Rewards']) as Key[];
    const e = player.challenge15Exponent

    for(const obj in G['challenge15Rewards']){
        G['challenge15Rewards'][obj as Key] = 1;
    }
    G['challenge15Rewards'].freeOrbs = 0;

    if(e >= exponentRequirements[0]){
        //All Cube Types 1 [750]
        G['challenge15Rewards'][keys[0]] = 1 + 1 / 50 * Math.log(e / 175) / Math.log(2)
    }
    if(e >= exponentRequirements[1]){
        //Ascension Count [1500]
        G['challenge15Rewards'][keys[1]] = 1 + 1 / 20 * Math.log(e / 375) / Math.log(2)
    }
    if(e >= exponentRequirements[2]){
        //Coin Exponent [3000]
        G['challenge15Rewards'][keys[2]] = 1 + 1 / 150 * Math.log(e / 750) / Math.log(2)
    }
    if(e >= exponentRequirements[3]){
        //Taxes [5000]
        G['challenge15Rewards'][keys[3]] = Math.pow(0.98, Math.log(e / 1.25e3) / Math.log(2))
    }
    if(e >= exponentRequirements[4]){
        //Obtainium [7500]
        G['challenge15Rewards'][keys[4]] = 1 + 1 / 5 * Math.pow(e / 7.5e3, 0.75)
    }
    if(e >= exponentRequirements[5]){
        //Offerings [7500]
        G['challenge15Rewards'][keys[5]] = 1 + 1 / 5 * Math.pow(e / 7.5e3, 0.75)
    }
    if(e >= exponentRequirements[6]){
        //Accelerator Boost (Uncorruptable) [10000]
        G['challenge15Rewards'][keys[6]] = 1 + 1 / 20 * Math.log(e / 2.5e3) / Math.log(2)
    }
    if(e >= exponentRequirements[7]){
        //Multiplier Boost (Uncorruptable) [10000]
        G['challenge15Rewards'][keys[7]] = 1 + 1 / 20 * Math.log(e / 2.5e3) / Math.log(2)
    }
    if(e >= exponentRequirements[8]){
        //Rune EXP [20000]
        G['challenge15Rewards'][keys[8]] = 1 + Math.pow(e / 2e4, 1.5)
    }
    if(e >= exponentRequirements[9]){
        //Rune Effectiveness [40000]
        G['challenge15Rewards'][keys[9]] = 1 + 1 / 33 * Math.log(e / 1e4) / Math.log(2)
    }
    if(e >= exponentRequirements[10]){
        //All Cube Types II [60000]
        G['challenge15Rewards'][keys[10]] = 1 + 1 / 100 * Math.log(e / 1.5e4) / Math.log(2)
    }
    if(e >= exponentRequirements[11]){
        //Chal 1-5 Scaling [100000]
        G['challenge15Rewards'][keys[11]] = Math.pow(0.98, Math.log(e / 2.5e4) / Math.log(2))
    }
    if(e >= exponentRequirements[12]){
        //Chal 6-10 Scaling [100000]
        G['challenge15Rewards'][keys[12]] = Math.pow(0.98, Math.log(e / 2.5e4) / Math.log(2))
    }
    if(e >= exponentRequirements[13]){
        //Ant Speed [200k]
        G['challenge15Rewards'][keys[13]] = Math.pow(1 + Math.log(e / 2e5) / Math.log(2), 4)
    }
    if(e >= exponentRequirements[14]){
        //Ant Bonus Levels [500k]
        G['challenge15Rewards'][keys[14]] = 1 + 1 / 20 * Math.log(e / 1.5e5) /Math.log(2)
    }
    if(e >= exponentRequirements[15]){
        //All Cube Types III [1m]
        G['challenge15Rewards'][keys[15]] = 1 + 1 / 150 * Math.log(e / 2.5e5) / Math.log(2)
    }
    if(e >= exponentRequirements[16]){
        //Talisman Effectiveness [3m]
        G['challenge15Rewards'][keys[16]] = 1 + 1 / 20 * Math.log(e / 7.5e5) / Math.log(2)
    }
    if(e >= exponentRequirements[17]){
        //Global Speed [10m]
        G['challenge15Rewards'][keys[17]] = 1 + 1 / 20 * Math.log(e / 2.5e6) / Math.log(2)
    }
    if(e >= exponentRequirements[18]){
        //Blessing Effectiveness [30m]
        G['challenge15Rewards'][keys[18]] = 1 + 1 / 5 * Math.pow(e / 3e7, 1 / 4)
    }
    if(e >= exponentRequirements[19]){
        //Tesseract Building Speed [100m]
        G['challenge15Rewards'][keys[19]] = 1 + 1 / 5 * Math.pow(e / 1e8, 2 / 3)
    }
    if(e >= exponentRequirements[20]){
        //All Cube Types IV [500m]
        G['challenge15Rewards'][keys[20]] = 1 + 1 / 200 * Math.log(e / 1.25e8) / Math.log(2)
    }
    if(e >= exponentRequirements[21]){
        //Spirit Effectiveness [2b]
        G['challenge15Rewards'][keys[21]] = 1 + 1 / 5 * Math.pow(e / 2e9, 1 / 4)
    }
    if(e >= exponentRequirements[22]){
        //Ascension Score [10b]
        G['challenge15Rewards'][keys[22]] = 1 + 1 / 4 * Math.pow(e / 1e10 , 1 / 4)
        if (e >= 1e20)
            G['challenge15Rewards'][keys[22]] = 1 + 1 / 4 * Math.pow(e / 1e10, 1 / 8) * Math.pow(1e10, 1 / 8)
    }
    if(e >= exponentRequirements[23]){
        //Quark Gain [100b]
        G['challenge15Rewards'][keys[23]] = 1 + 1 / 100 * Math.log(e * 32 / 1e11) / Math.log(2)
    }
    if(e >= exponentRequirements[24]){
        //Unlock Hepteract gain [1Qa]
        G['challenge15Rewards'][keys[24]] = 2
    }
    if (e >= exponentRequirements[25]) {
        //Unlock Challenge hepteract [2Qa]
        void player.hepteractCrafts.challenge.unlock('the Hepteract of Challenge')
    }
    if (e >= exponentRequirements[26]) {
        //All Cube Types V [4Qa]
        G['challenge15Rewards'][keys[25]] = 1 + 1 / 300 * Math.log2(e / (4e15 / 1024))
    }
    if (e >= exponentRequirements[27]) {
        //Powder Gain [7Qa]
        G['challenge15Rewards'][keys[26]] = 1 + 1 / 50 * Math.log2(e / (7e15 / 32))
    }
    if (e >= exponentRequirements[28]) {
        //Unlock Abyss Hepteract [10Qa]
        void player.hepteractCrafts.abyss.unlock('the Hepteract of the Abyss')
    }
    if (e >= exponentRequirements[29]) {
        //Constant Upgrade 2 [20Qa]
        G['challenge15Rewards'][keys[27]] = calculateSigmoid(1.05, e, 1e18);
    }
    if (e >= exponentRequirements[30]) {
        //Unlock ACCELERATOR HEPT [33.33Qa]
        void player.hepteractCrafts.accelerator.unlock('the Hepteract of Way Too Many Accelerators')
    }
    if (e >= exponentRequirements[31]) {
        //Unlock ACCELERATOR BOOST HEPT [33.33Qa]
        void player.hepteractCrafts.acceleratorBoost.unlock('the Hepteract of Way Too Many Accelerator Boosts')
    }
    if (e >= exponentRequirements[32]) {
        //Unlock MULTIPLIER Hept [33.33Qa]
        void player.hepteractCrafts.multiplier.unlock('the Hepteract of Way Too Many Multipliers')
    }
    if (e >= exponentRequirements[33]) {
        // FREE Daily Orbs
        G['challenge15Rewards'].freeOrbs = Math.floor(200 * Math.pow(e / 2e17, 0.5))
    }
    if (e >= exponentRequirements[34]) {
        // Ascension Speed
        G['challenge15Rewards'].ascensionSpeed = 1 + 5/100 + 2 * Math.log2(e / 1.5e18) / 100
    }


    updateDisplayC15Rewards();
}

const updateDisplayC15Rewards = () => {
    DOMCacheGetOrSet('c15Reward0Num').textContent = format(player.challenge15Exponent,0,true)
    DOMCacheGetOrSet('c15RequiredExponentNum').textContent = format(player.challenge15Exponent / challenge15ScoreMultiplier(),0,true)
    const exponentRequirements = [750, 1.5e3, 3e3, 5e3, 7.5e3, 7.5e3, 1e4, 1e4, 2e4, 4e4, 6e4, 1e5, 1e5, 2e5, 5e5, 1e6, 3e6, 1e7, 3e7, 1e8, 5e8, 2e9, 1e10, 1e11, 1e15, 2e15, 4e15, 7e15, 1e16, 2e16, 3.33e16, 3.33e16, 3.33e16, 2e17, 1.5e18]
    const isNum: Record<number, boolean> = { // Shit solution to a shit problem -Platonic
        0: true,
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true,
        7: true,
        8: true,
        9: true,
        10: true,
        11: true,
        12: true,
        13: true,
        14: true,
        15: true,
        16: true,
        17: true,
        18: true,
        19: true,
        20: true,
        21: true,
        22: true,
        23: true,
        24: false,
        25: false,
        26: true,
        27: true,
        28: false,
        29: true,
        30: false,
        31: false,
        32: false,
        33: true,
        34: true
    }
    const values = Object.values(G['challenge15Rewards'])
    let keepExponent: string | number = 'None'
    let skip = 0
    for(let i = 0; i < exponentRequirements.length; i++){
        if(keepExponent === 'None' && player.challenge15Exponent < exponentRequirements[i]){
            keepExponent = exponentRequirements[i]
        }
        if (player.challenge15Exponent >= exponentRequirements[i]) {
            DOMCacheGetOrSet('c15Reward'+(i+1)+'Num').textContent = (isNum[i]) ?
            format(100 * values[i - skip] - 100,2,true):
            'Unlocked!';

            if (!isNum[i] && i !== 24) { // TODO: This sucks -Platonic
                skip += 1;
            }

            if (i === 33) {
                DOMCacheGetOrSet('c15Reward34Num').textContent = format(values[i - skip], 0, true)
            }
        }

        DOMCacheGetOrSet('c15Reward'+(i+1)).style.display = (player.challenge15Exponent >= exponentRequirements[i])? 'block': 'none';
        DOMCacheGetOrSet('c15RewardList').textContent = typeof keepExponent  === 'string'
            ? 'You have unlocked all reward types from Challenge 15!'
            : 'Next reward type requires ' + format(keepExponent,0,true) + ' exponent.' 
    }
}
