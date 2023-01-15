import { format, player } from './Synergism';
import { Globals as G } from './Variables';
import { Alert, Notification, revealStuff } from './UpdateHTML';
import { Synergism } from './Events';
import { sumContents } from './Utility';
import Decimal from 'break_infinity.js';
import { CalcCorruptionStuff, calculateTimeAcceleration } from './Calculate';
import { DOMCacheGetOrSet } from './Cache/DOM';
import i18next from 'i18next';

export const achievementpointvalues = [0,
    1, 2, 4, 6, 8, 9, 10,
    1, 2, 4, 6, 8, 9, 10,
    1, 2, 4, 6, 8, 9, 10,
    1, 2, 4, 6, 8, 9, 10,
    1, 2, 4, 6, 8, 9, 10,
    1, 2, 4, 6, 8, 9, 10,
    1, 2, 4, 6, 8, 9, 10,
    1, 2, 4, 6, 8, 9, 10,
    2, 8, 10, 2, 8, 10, 10,
    2, 8, 10, 10, 10, 10, 10,
    2, 4, 6, 8, 10, 10, 10,
    1, 2, 4, 6, 8, 9, 10,
    1, 2, 4, 6, 8, 9, 10,
    1, 2, 4, 6, 8, 9, 10,
    1, 2, 4, 6, 8, 9, 10,
    1, 2, 4, 6, 8, 9, 10,
    1, 2, 4, 6, 8, 9, 10,
    1, 2, 4, 6, 8, 9, 10,
    1, 2, 4, 6, 8, 9, 10,
    1, 2, 4, 6, 8, 9, 10,
    1, 2, 4, 6, 8, 9, 10,
    1, 2, 4, 6, 8, 9, 10,
    1, 2, 4, 6, 8, 9, 10,
    1, 2, 4, 6, 8, 9, 10,
    10, 10, 10, 10, 10, 10, 10,
    10, 10, 10, 10, 10, 10, 10,
    20, 20, 20, 40, 60, 60, 100,
    20, 20, 40, 40, 60, 60, 100,
    20, 20, 40, 40, 60, 60, 100,
    20, 40, 40, 40, 60, 60, 100,
    40, 40, 40, 60, 60, 100, 100,
    40, 40, 60, 60, 100, 100, 100,
    20, 40, 40, 60, 60, 100, 100,
    40, 60, 100, 60, 100, 100, 40,
    40, 40, 40, 40, 40, 40, 40,
    40, 40, 40, 40, 100, 100, 0,
    50, 75, 75, 75, 100, 100, 150,
    50, 75, 75, 75, 100, 100, 150,
    50, 75, 75, 75, 100, 100, 150,
    10, 10, 20, 20, 30, 40, 50
];

export const totalachievementpoints = achievementpointvalues.reduce((a, b) => a + b, 0);

export const areward = (i: number): string => {
    // May 22, 2021: Allow achievement bonus values display directly in the description
    // Using areward as const object did not allow ${player object}

    //Effective score is 3rd index
    const corr = CalcCorruptionStuff();

    const descs: { [key: number]: string } = {
        3: 'Gain +.05% to Accelerator Power.',
        4: 'Start Transcensions/Challenges with Worker Autobuyer unlocked.',
        5: 'Gain +1 Accelerator per 500 Workers owned.',
        6: 'Gain +1 Multiplier per 1,000 Workers owned.',
        7: 'Gain +1 Accelerator Boost per 2,000 workers owned.',
        10: 'Gain +.10% to Accelerator Power.',
        11: 'Start Transcensions/Challenges with Investment Autobuyer unlocked.',
        12: 'Gain +1 Accelerator per 500 Investments owned.',
        13: 'Gain +1 Multiplier per 1,000 Investments owned.',
        14: 'Gain +1 Accelerator Boost per 2,000 Investments owned.',
        17: 'Gain +.15% to Accelerator Power.',
        18: 'Start Transcensions/Challenges with Printer Autobuyer unlocked.',
        19: 'Gain +1 Accelerator per 500 Printers owned.',
        20: 'Gain +1 Multiplier per 1,000 Printers owned.',
        21: 'Gain +1 Accelerator Boost per 2,000 Printers owned.',
        24: 'Gain +.20% to Accelerator Power.',
        25: 'Start Transcensions/Challenges with Coin Mint Autobuyer unlocked.',
        26: 'Gain +1 Accelerator per 500 Mints owned.',
        27: 'Gain +1 Multiplier per 1,000 Mints owned.',
        28: 'Gain +1 Accelerator Boost per 2,000 Mints owned.',
        31: 'Gain +.25% to Accelerator Power.',
        32: 'Start Transcensions/Challenges with Alchemy Autobuyer unlocked.',
        33: 'Gain 10% more Offerings from resets || +1 Accelerator per 500 Alchemies!',
        34: 'Gain 15% more Offerings from resets (stacks multiplicatively!) || +1 Multiplier per 1,000 Alchemies!',
        35: 'Gain 25% more Offerings from resets (stacks multiplicatively!) || +1 Accelerator Boost per 2,000 Alchemies!',
        36: 'Multiply Crystal Production by 2x.',
        37: 'Multiply Crystal Production by the common logarithm of owned Diamonds. Prestiges give more Offerings based on time spent (Up to +15 at 1800 seconds)',
        38: 'Unlock the Duplication rune!',
        43: 'Accelerator Boosts can be purchased from any screen. Unlock the Auto-Prestige feature.',
        44: 'Unlock the Prism Rune! Transcensions give more Offerings based on time spent (Up to +15 at 1800 seconds)',
        45: 'Reduce tax scaling by up to 5%, depending on the length of Prestige.',
        46: 'Reduce tax scaling by up to another 5%, depending on length of Prestige.',
        47: 'Reduce tax scaling by up to ANOTHER 10%, depending on length of Prestige!',
        50: 'Unlock new Atomic production and unlock 3 new incredibly difficult Challenges! Gain 2x particles on all future Reincarnations!',
        51: 'Manual Reincarnations give +4 Obtainium (unaffected by multipliers except time multiplier)!',
        52: 'Reincarnations give more Offerings based on time spent (Up to +25 at 1800 seconds)',
        53: 'Increase the amount of Obtainium gained through all features by 0.125% additive for each rune level.',
        57: 'Gain +1, +1% free Multipliers!',
        58: 'Gain +1, +1% more free Multipliers!',
        59: 'Gain +1, +1% more, MORE free Multipliers!',
        60: 'Gain +2, +1% free Accelerators!',
        61: 'Gain +2, +1% more free Accelerators!',
        62: 'Gain +2, +1% more, MORE free Accelerators!',
        71: '+1% Conversion Exponent on all generator upgrades!',
        72: '+1% Conversion Exponent on all generator upgrades!',
        73: '+1% Conversion Exponent on all generator upgrades!',
        74: '+1% Conversion Exponent on all generator upgrades!',
        75: '+1% Conversion Exponent on all generator upgrades!',
        76: '+1% Conversion Exponent on all generator upgrades!',
        77: '+1% Conversion Exponent on all generator upgrades! They\'re in overdrive now!',
        78: 'Start Transcensions/Challenges with 1 Refinery and automatically buy Refineries.',
        79: 'Automatically buy the first Crystal upgrade if you can afford it!',
        80: 'Start Transcensions/Challenges with Multiplier Autobuyer unlocked. +5% Offering recycle.',
        82: 'Delay tax growth by 4%.',
        84: '+1% Obtainium (stacks additively with other achievement rewards)',
        85: 'Start Transcensions/Challenges with 1 Coal Plant and automatically buy Coal Plants.',
        86: 'Automatically buy the second Crystal upgrade if you can afford it!',
        87: 'Start Transcensions/Challenges with Accelerator Autobuyer unlocked. +5% Offering recycle.',
        89: 'Delay tax growth by 4%.',
        91: '+3% Obtainium (stacks additively with other Achievement rewards)',
        92: 'Start Transcensions/Challenges with 1 Coal Rig and automatically buy Coal Rigs.',
        93: 'Automatically buy the third Crystal upgrade if you can afford it!',
        94: '+5% Offering recycle.',
        96: 'Delay tax growth by 4%.',
        98: '+5% Obtainium (stacks additively with other achievement rewards)',
        99: 'Start Transcensions/Challenges with 1 Diamond Pickaxe and automatically buy Diamond Pickaxes.',
        100: 'Automatically buy the fourth Crystal upgrade if you can afford it!',
        101: '+5% Offering recycle.',
        102: 'Unlock the Thrift rune!',
        103: 'Delay tax growth by 4%.',
        105: '+7% Obtainium (stacks additively with other achievement rewards)',
        106: 'Start Transcensions/Challenges with 1 Pandora\'s Box and automatically buy Pandora\'s Boxes.',
        107: 'Automatically buy the fifth Crystal upgrade if you can afford it!',
        108: '+5% Offering recycle.',
        110: 'Delay tax growth by 4%.',
        112: '+9% Obtainium (stacks additively with other achievement rewards)',
        115: '+5% Offering recycle.',
        117: 'Delay tax growth by 5.66%.',
        118: `Each Reincarnation Challenge completion delays tax growth by 0.75% per level, multiplicative. Effect: ${format(Math.pow(0.9925, player.challengecompletions[6] + player.challengecompletions[7] + player.challengecompletions[8] + player.challengecompletions[9] + player.challengecompletions[10]), 4)}x`,
        119: '+11% Obtainium. Unlock a nice trinket somewhere...',
        122: '+7.5% Offering recycle.',
        124: 'Delay tax growth by 5.66%. Unlock 5 new incredibly powerful researches!',
        126: '+13% Obtainium. You get an accessory to commemorate this moment!',
        127: 'Unlock 20 new incredibly expensive yet good researches. Unlock the [Anthill] feature!',
        128: 'Make researches go Cost-- with 1.5x Obtainium!',
        129: '+7.5% Offering recycle. Gain another 1.25x Obtainium multiplier!',
        131: 'Delay tax growth by 5.66%.',
        132: 'Permanently gain +25% more sacrifice reward!',
        133: '+15% Obtainium. Obtain the gift of Midas himself.',
        134: 'Unlock 10 newer incredibly expensive yet good researches. Unlock <<Talismans>> in the Runes Tab!',
        135: 'Talisman positive bonuses are now +0.02 stronger per level.',
        136: 'Talisman positive bonuses are now +0.02 even stronger per level.',
        137: 'Permanently gain +25% more sacrifice reward!',
        140: '+17% Obtainium. Lazy joke about not leaking talismans here [You get a new one]',
        141: 'Unlock a new reset tier!',
        147: '+19% Obtainium (Achievement total is up to 100%!). Gain the Polymath Talisman!',
        169: `ALL Ant speed multiplied by ${format(Decimal.log(player.antPoints.add(10), 10), 2)}`,
        171: '+16.666% ALL Ant speed!',
        172: 'Gain more Ants the longer your Reincarnation lasts (Max speed achieved in 2 hours)',
        173: 'Unlock Ant Sacrifice, allowing you to reset your Ants and Ant upgrades in exchange for amazing rewards! Automatically buy Worker Ants.',
        174: `Ant Multiplier from sacrifice is multiplied by another logarithm: x${format(0.4 * Decimal.log(player.antPoints.add(1), 10), 2)}`,
        176: 'Unlock Tier 2 Ant autobuy, and autobuy Inceptus and Fortunae Ants! Add +25 Base Ant ELO.',
        177: 'Unlock Tier 3 Ant autobuy, and autobuy Tributum Ants! Add +50 Base Ant ELO.',
        178: 'Unlock Tier 4 Ant autobuy, and autobuy Celeritas and Multa Ants! Add +75 Base Ant ELO.',
        179: 'Unlock Tier 5 Ant autobuy, and autobuy Sacrificium Ants! Add +100 Base Ant ELO.',
        180: 'Unlock Tier 6 Ant autobuy, and autobuy Hic and Experientia Ants! Add +1% Base Ant ELO.',
        181: 'Unlock Tier 7 Ant autobuy, and autobuy Praemoenio Ants! Add +2% Base Ant ELO.',
        182: 'Unlock Tier 8 Ant autobuy, and autobuy Scientia and Phylacterium Ants! Add +3% Base Ant ELO.',
        187: `Gain an Ascension Cubes multiplier based on your score: x${format(Math.max(1, Math.log10(corr[3]+1) - 7), 2)}. Also: Offerings +${format(Math.min(100, player.ascensionCount / 10000), 2)}% [Max: 100% at 1M Ascensions]`,
        188: `Gain +100 Ascension count for all Ascensions longer than 10 seconds. Also: Obtainium +${format(Math.min(100, player.ascensionCount / 50000), 2)}% [Max: 100% at 5M Ascensions]`,
        189: `Gain 20% of Excess time after 10 seconds each Ascension as a linear multiplier to Ascension count. Also: Cubes +${format(Math.min(200, player.ascensionCount / 2.5e6), 2)}% [Max: 200% at 500M Ascensions]`,
        193: `Gain ${format(Decimal.log(player.ascendShards.add(1), 10) / 4, 2)}% more Cubes on Ascension!`,
        195: `Gain ${format(Math.min(25000, Decimal.log(player.ascendShards.add(1), 10) / 4), 2)}% more Cubes and Tesseracts on Ascension! Multiplicative with the other Ach. bonus [MAX: 25,000% at e100,000 Const]`,
        196: `Gain ${format(Math.min(2000, Decimal.log(player.ascendShards.add(1), 10) / 50), 2)}% more Platonic Cubes on Ascension! [MAX: 2,000% at e100,000 Const]`,
        197: 'You will unlock a stat tracker for Ascensions.',
        198: 'Gain +4% Cubes on Ascension!',
        199: 'Gain +4% Cubes on Ascension!',
        200: 'Gain +4% Cubs on Ascension! Did I spell that wrong? You bet I did.',
        201: 'Gain +3% Cubes on Ascension!',
        202: `Gain 20% of Excess time after 10 seconds each Ascensions as a linear multiplier to Ascension count. Also: Tesseracts +${format(Math.min(200, player.ascensionCount / 5e6), 2)}% [Max: 200% at 1B Ascensions]`,
        204: 'You will gain 25% of Excess time after 10 seconds each Ascension as a linear multiplier to rewards.',
        205: 'Gain +4% Tesseracts on Ascension!',
        206: 'Gain +4% Tesseracts on Ascension!',
        207: 'Gain +4% Tesseracts on Ascension!',
        208: 'Gain +3% Tesseracts on Ascension!',
        209: 'Gain 20% of Excess time after 10 seconds each Ascensions as a linear multiplier to Ascension count.',
        211: 'You will gain 25% MORE Excess time (Total: 50%) after 10 seconds each Ascension as a linear multiplier to rewards.',
        212: 'Gain +4% Hypercubes on Ascension!',
        213: 'Gain +4% Hypercubes on Ascension!',
        214: 'Gain +4% Hypercubes on Ascension!',
        215: 'Gain +3% Hypercubes on Ascension!',
        216: `Gain 20% of Excess time after 10 seconds each Ascensions as a linear multiplier to Ascension count. Also: Hypercubes +${format(Math.min(200, player.ascensionCount / 1e7), 2)}% [Max: 200% at 2B Ascensions]`,
        218: 'You gain gain 50% MORE MORE excess time (Total: 100%) after 10 seconds each Ascension as a linear multiplier to rewards.',
        219: 'Gain +4% Platonic Cubes on Ascension!',
        220: 'Gain +4% Platonic Cubes on Ascension!',
        221: 'Gain +4% Platonic Cubes on Ascension!',
        222: 'Gain +3% Platonic Cubes on Ascension!',
        223: `Gain 20% of Excess time after 10 seconds each Ascensions as a linear multiplier to Ascension count. Also: Platonic Cubes +${format(Math.min(200, player.ascensionCount / 13370000), 2)}% [Max: 200% at 2.674B Ascensions]`,
        240: `Ascension Cube Gain Multipliers is VERY slightly affected by global speed multipliers: ${format(Math.min(1.5, 1 + Math.max(2, Math.log10(calculateTimeAcceleration().mult))/20), 2)}x (Min: 1.10x, Max: 1.50x)`,
        250: 'You gain a permanent +60% Obtainium and Offering bonus, with +6% all Cube types!',
        251: 'You gain a permanent +100% Obtainium and Offering bonus, with +10% all Cube types!',
        253: 'You will gain +10% Hypercubes! Why? I don\'t know.',
        254: `Cube Gain +${format(Math.min(15, Math.log10(corr[3]+1) * 0.6), 2, true)}% [Max: +15% at 1e25 Ascension Score]`,
        255: `Tesseract Gain +${format(Math.min(15, Math.log10(corr[3]+1) * 0.6), 2, true)}% [Max: +15% at 1e25 Ascension Score], and allow gain of Hepteracts.`,
        256: `Hypercube Gain +${format(Math.min(15, Math.log10(corr[3]+1) * 0.6), 2, true)}% [Max: +15% at 1e25 Ascension Score]. Also, Overflux Powder conversion rate is 5% better!`,
        257: `Platonic Gain +${format(Math.min(15, Math.log10(corr[3]+1) * 0.6), 2, true)}% [Max: +15% at 1e25 Ascension Score]. Also, Overflux Powder conversion rate is 5% better!`,
        258: `Hepteract Gain +${format(Math.min(15, Math.log10(corr[3]+1) * 0.6), 2, true)}% [Max: +15% at 1e25 Ascension Score]`,
        259: 'Corruption score is increased by 1% for every expansion of Abyss Hepteract!',
        260: 'You will gain 10% more Ascension count, forever!',
        261: 'You will gain 10% more Ascension count, forever!',
        262: `Ascensions are ${format(Math.min(10, Math.log10(player.ascensionCount+1)), 2)}% faster! Max: +10%`,
        263: `Ascensions are ${format(Math.min(10, Math.log10(player.ascensionCount+1)), 2)}% faster! Max: +10%`,
        264: `Hepteracts +${format(Math.min(40, player.ascensionCount / 2e11), 2)}% [Max: 40% at 8T Ascensions]!`,
        265: `Hepteracts +${format(Math.min(20, player.ascensionCount / 8e12), 2)}% [Max: 20% at 160T Ascensions]!`,
        266: `Quarks +${format(Math.min(10, player.ascensionCount / 1e14), 2)}% [Max: 10% at 1Qa Ascensions]!`,
        267: `Ascension Score is boosted by ${format(Math.min(100, Decimal.log(player.ascendShards.add(1), 10) / 1000), 2)}% [Max: 100% at 1e100,000 Const]`,
        270: `Hepteract Gain is boosted by ${format(Math.min(100, Decimal.log(player.ascendShards.add(1), 10) / 10000), 2)}% [Max: 100% at 1e1,000,000 const], Constant Upgrade 1 boosted to 1.06 (from 1.05), Constant Upgrade 2 boosted to 1.11 (from 1.10).`,
        271: `When you open a Platonic Cube, gain ${format(Math.max(0, Math.min(1, (Decimal.log(player.ascendShards.add(1), 10) - 1e5) / 9e5)), 2, true)} Hypercubes, rounded down [Max: 1 at 1e1,000,000 Const]`,
        274: 'Ant Speed is permanently multiplied by 4.44! Platonic Upgrades now BuyMax whenever affordable!',
        275: 'You immediately start Singularities with 1 Transcension and 1001 mythos!',
        276: 'You immediately start Singularities with 1 Reincarnation, and 10 particles!',
        277: 'You immediately start Singularities with 500 Obtainium!',
        278: 'Gain 5% more Quarks, permanently! Automation regarding Particle Buildings are immediately available.',
        279: 'You immediately start Singularities with a Challenge 7 completion and 1e100 particles. Talismans now buff all runes at all times!',
        280: 'You immediately start Singularities with 1 Challenge 8 completion and 1 tier 1 Ant.'
    }

    if (i in descs) {
        return descs[i]
    } else {
        return ''
    }
}

export const achievementAlerts = async (num: number) => {
    let text = ''
    switch (num){
        case 36:
            text = 'Congratulations on your first Prestige. The first of many. You obtain Offerings. You can use them in the new Runes tab! [Unlocked Runes, Achievements, Diamond Buildings and some Upgrades!]'
            break;
        case 38:
            text = 'Hmm, it seems you are getting richer, being able to get 1 Googol diamonds in a single Prestige. How about we give you another Rune? [Unlocked Duplication Rune in Runes tab!]'
            break;
        case 255:
            text = 'Wow! You gained 1e17 (100 Quadrillion) score in a single Ascension. For that, you can now generate Hepteracts if you get above 1.66e17 (166.6 Quadrillion) score in an Ascension. Good luck!'
    }

    if (text !== '' && player.highestSingularityCount === 0) {
        return Alert(text)
    }
}
//${format(Decimal.log(player.ascendShards.add(1), 10) / 1000, 2)} (log(constant)/1000)%!

// TODO: clean this up
export const resetachievementcheck = (i: number) => {
    if (i === 1) {
        if (player.prestigenoaccelerator === true) {
            achievementaward(60)
        }
        if (player.prestigenomultiplier === true) {
            achievementaward(57)
        }
        if (player.prestigenocoinupgrades === true) {
            achievementaward(64)
        }
        if (G['prestigePointGain'].gte(1)) {
            achievementaward(36)

        }
        if (G['prestigePointGain'].gte(1e6)) {
            achievementaward(37)

        }
        if (G['prestigePointGain'].gte(1e100)) {
            achievementaward(38)
        }
        if (G['prestigePointGain'].gte('1e1000')) {
            achievementaward(39)

        }
        if (G['prestigePointGain'].gte('1e10000')) {
            achievementaward(40)

        }
        if (G['prestigePointGain'].gte('1e77777')) {
            achievementaward(41)

        }
        if (G['prestigePointGain'].gte('1e250000')) {
            achievementaward(42)

        }
    }
    if (i === 2) {
        if (player.transcendnoaccelerator === true) {
            achievementaward(61)
        }
        if (player.transcendnomultiplier === true) {
            achievementaward(58)
        }
        if (player.transcendnocoinupgrades === true) {
            achievementaward(65)
        }
        if (player.transcendnocoinorprestigeupgrades === true) {
            achievementaward(66)
        }
        if (G['transcendPointGain'].gte(1)) {
            achievementaward(43)
        }
        if (G['transcendPointGain'].gte(1e6)) {
            achievementaward(44)
        }
        if (G['transcendPointGain'].gte(1e50)) {
            achievementaward(45)
        }
        if (G['transcendPointGain'].gte(1e308)) {
            achievementaward(46)
        }
        if (G['transcendPointGain'].gte('1e1500')) {
            achievementaward(47)
        }
        if (G['transcendPointGain'].gte('1e25000')) {
            achievementaward(48)
        }
        if (G['transcendPointGain'].gte('1e100000')) {
            achievementaward(49)
        }
    }
    if (i === 3) {
        if (player.reincarnatenoaccelerator === true) {
            achievementaward(62)
        }
        if (player.reincarnatenomultiplier === true) {
            achievementaward(59)
        }
        if (player.reincarnatenocoinupgrades === true) {
            achievementaward(67)
        }
        if (player.reincarnatenocoinorprestigeupgrades === true) {
            achievementaward(68)
        }
        if (player.reincarnatenocoinprestigeortranscendupgrades === true) {
            achievementaward(69)
        }
        if (player.reincarnatenocoinprestigetranscendorgeneratorupgrades === true) {
            achievementaward(70)
        }
        if (G['reincarnationPointGain'].gte(1)) {
            achievementaward(50)

        }
        if (G['reincarnationPointGain'].gte(1e5)) {
            achievementaward(51)

        }
        if (G['reincarnationPointGain'].gte(1e30)) {
            achievementaward(52)

        }
        if (G['reincarnationPointGain'].gte(1e200)) {
            achievementaward(53)

        }
        if (G['reincarnationPointGain'].gte('1e1500')) {
            achievementaward(54)

        }
        if (G['reincarnationPointGain'].gte('1e5000')) {
            achievementaward(55)

        }
        if (G['reincarnationPointGain'].gte('1e7777')) {
            achievementaward(56)

        }
    }
}

/**
 * Array of [index, bar to get achievement if greater than, achievement number]
 */
const challengeCompletionsBar: [number, number, number][] = [
    [1, 0.5, 78], [1, 2.5, 79], [1, 4.5, 80], [1, 9.5, 81], [1, 19.5, 82], [1, 49.5, 83], [1, 74.5, 84],
    [2, 0.5, 85], [2, 2.5, 86], [2, 4.5, 87], [2, 9.5, 88], [2, 19.5, 89], [2, 49.5, 90], [2, 74.5, 91],
    [3, 0.5, 92], [3, 2.5, 93], [3, 4.5, 94], [3, 9.5, 95], [3, 19.5, 96], [3, 49.5, 97], [3, 74.5, 98],
    [4, 0.5, 99], [4, 2.5, 100], [4, 4.5, 101], [4, 9.5, 102], [4, 19.5, 103], [4, 49.5, 104], [4, 74.5, 105],
    [5, 0.5, 106], [5, 2.5, 107], [5, 4.5, 108], [5, 9.5, 109], [5, 19.5, 110], [5, 49.5, 111], [5, 74.5, 112],
    [6, 0.5, 113], [6, 1.5, 114], [6, 2.5, 115], [6, 4.5, 116], [6, 9.5, 117], [6, 14.5, 118], [6, 24.5, 119],
    [7, 0.5, 120], [7, 1.5, 121], [7, 2.5, 122], [7, 4.5, 123], [7, 9.5, 124], [7, 14.5, 125], [7, 24.5, 126],
    [8, 0.5, 127], [8, 1.5, 128], [8, 2.5, 129], [8, 4.5, 130], [8, 9.5, 131], [8, 19.5, 132], [8, 24.5, 133],
    [9, 0.5, 134], [9, 1.5, 135], [9, 2.5, 136], [9, 4.5, 137], [9, 9.5, 138], [9, 19.5, 139], [9, 24.5, 140],
    [10, 0.5, 141], [10, 1.5, 142], [10, 2.5, 143], [10, 4.5, 144], [10, 9.5, 145], [10, 19.5, 146], [10, 24.5, 147],
    [15, 0.5, 252]
];

const challengeCompletionsNotAuto: Record<number, [string, number]> = {
    1: ['1e1000', 75],
    2: ['1e1000', 76],
    3: ['1e99999', 77],
    5: ['1e120000', 63]
}

export const challengeachievementcheck = (i: number, auto?: boolean) => {
    const generatorcheck = sumContents(player.upgrades.slice(101, 106));

    for (const [, bar, ach] of challengeCompletionsBar.filter(([o]) => o === i)) {
        if (player.challengecompletions[i] > bar && player.achievements[ach] < 1) {
            achievementaward(ach);
        }
    }

    // Challenges 1, 2, 3 check for not buying generators and getting X coins
    // Challenge 5 check for not buying Acc/Acc Boosts and getting 1.00e120,000 coins
    if ([1, 2, 3, 5].includes(i) && !auto) {
        const [gte, ach] = challengeCompletionsNotAuto[i];
        if (i === 5) {
            if (player.coinsThisTranscension.gte(gte) && player.acceleratorBought === 0 && player.acceleratorBoostBought === 0) {
                achievementaward(ach)
            }
        } else if (player.coinsThisTranscension.gte(gte) && generatorcheck === 0) {
            achievementaward(ach);
        }
    }

    if (i >= 11 && i <= 14) {
        const challengeArray = [0, 1, 2, 3, 5, 10, 20, 30]
        for (let j = 1; j <= 7; j++) {
            if (player.challengecompletions[i] >= challengeArray[j] && player.achievements[119 + 7 * i + j] < 1) {
                achievementaward(119 + 7 * i + j)
            }
        }
    }

    if (player.challengecompletions[10] >= 50 && i === 11 && player.usedCorruptions[7] >= 5 && player.achievements[247] < 1) {
        achievementaward(247)
    }
}

// \) \{\n\s+achievementaward\(\d+\)\n\s+\}

/**
 * Requirements for each building achievement
 * @type {(() => boolean)[]}
 */
const buildAchievementReq: (() => boolean)[] = [
    () => (player.firstOwnedCoin >= 1 && player.achievements[1] < 0.5),
    () => (player.firstOwnedCoin >= 10 && player.achievements[2] < 0.5),
    () => (player.firstOwnedCoin >= 100 && player.achievements[3] < 0.5),
    () => (player.firstOwnedCoin >= 1000 && player.achievements[4] < 0.5),
    () => (player.firstOwnedCoin >= 5000 && player.achievements[5] < 0.5),
    () => (player.firstOwnedCoin >= 10000 && player.achievements[6] < 0.5),
    () => (player.firstOwnedCoin >= 20000 && player.achievements[7] < 0.5),
    () => (player.secondOwnedCoin >= 1 && player.achievements[8] < 0.5),
    () => (player.secondOwnedCoin >= 10 && player.achievements[9] < 0.5),
    () => (player.secondOwnedCoin >= 100 && player.achievements[10] < 0.5),
    () => (player.secondOwnedCoin >= 1000 && player.achievements[11] < 0.5),
    () => (player.secondOwnedCoin >= 5000 && player.achievements[12] < 0.5),
    () => (player.secondOwnedCoin >= 10000 && player.achievements[13] < 0.5),
    () => (player.secondOwnedCoin >= 20000 && player.achievements[14] < 0.5),
    () => (player.thirdOwnedCoin >= 1 && player.achievements[15] < 0.5),
    () => (player.thirdOwnedCoin >= 10 && player.achievements[16] < 0.5),
    () => (player.thirdOwnedCoin >= 100 && player.achievements[17] < 0.5),
    () => (player.thirdOwnedCoin >= 1000 && player.achievements[18] < 0.5),
    () => (player.thirdOwnedCoin >= 5000 && player.achievements[19] < 0.5),
    () => (player.thirdOwnedCoin >= 10000 && player.achievements[20] < 0.5),
    () => (player.thirdOwnedCoin >= 20000 && player.achievements[21] < 0.5),
    () => (player.fourthOwnedCoin >= 1 && player.achievements[22] < 0.5),
    () => (player.fourthOwnedCoin >= 10 && player.achievements[23] < 0.5),
    () => (player.fourthOwnedCoin >= 100 && player.achievements[24] < 0.5),
    () => (player.fourthOwnedCoin >= 1000 && player.achievements[25] < 0.5),
    () => (player.fourthOwnedCoin >= 5000 && player.achievements[26] < 0.5),
    () => (player.fourthOwnedCoin >= 10000 && player.achievements[27] < 0.5),
    () => (player.fourthOwnedCoin >= 20000 && player.achievements[28] < 0.5),
    () => (player.fifthOwnedCoin >= 1 && player.achievements[29] < 0.5),
    () => (player.fifthOwnedCoin >= 10 && player.achievements[30] < 0.5),
    () => (player.fifthOwnedCoin >= 66 && player.achievements[31] < 0.5),
    () => (player.fifthOwnedCoin >= 666 && player.achievements[32] < 0.5),
    () => (player.fifthOwnedCoin >= 6666 && player.achievements[33] < 0.5),
    () => (player.fifthOwnedCoin >= 17777 && player.achievements[34] < 0.5),
    () => (player.fifthOwnedCoin >= 42777 && player.achievements[35] < 0.5)
];

export const buildingAchievementCheck = () => {
    for (const req of buildAchievementReq) {
        if (req()) {
            const idx = buildAchievementReq.indexOf(req) + 1;
            achievementaward(idx);
        }
    }
}

export const ascensionAchievementCheck = (i: number, score = 0) => {
    if (i === 1) {
        const ascendCountArray = [0, 1, 2, 10, 100, 1000, 14142, 141421, 1414213, //Column 1
            1e7, 1e8, 2e9, 4e10, 8e11, 1.6e13, 1e14] //Column 2
        for (let j = 1; j <= 7; j++) {
            if (player.ascensionCount >= ascendCountArray[j] && player.achievements[182 + j] < 1) {
                achievementaward(182 + j)
            }
            if (player.ascensionCount >= ascendCountArray[j + 8] && player.achievements[259 + j] < 1) {
                achievementaward(259 + j)
            }
        }
        if (player.ascensionCount >= ascendCountArray[8] && player.achievements[240] < 1) {
            achievementaward(240)
        }
    }
    if (i === 2) {
        const constantArray = [0, 3.14, 1e6, 4.32e10, 6.9e21, 1.509e33, 1e66, '1.8e308', //Column 1
            '1e1000', '1e5000', '1e15000', '1e50000', '1e100000', '1e300000', '1e1000000'] //Column 2
        for (let j = 1; j <= 7; j++) {
            if (player.ascendShards.gte(constantArray[j]) && player.achievements[189 + j] < 1) {
                achievementaward(189 + j)
            }
            if (player.ascendShards.gte(constantArray[j + 7]) && player.achievements[266 + j] < 1) {
                achievementaward(266 + j)
            }
        }
    }
    if (i === 3) {
        const scoreArray = [0, 1e5, 1e6, 1e7, 1e8, 1e9, 5e9, 2.5e10, //Column 1
            1e12, 1e14, 1e17, 2e18, 4e19, 1e21, 1e23] //Column 2
        for (let j = 1; j <= 7; j++) {
            if (score >= scoreArray[j] && player.achievements[224 + j] < 1) {
                achievementaward(224 + j)
            }

            if (score >= scoreArray[7 + j] && player.achievements[252 + j] < 1) {
                achievementaward(252 + j)
            }
        }
    }
}

export const getAchievementQuarks = (i: number) => {
    let multiplier = 1
    if (i >= 183) {
        multiplier = 5
    }
    if (i >= 253) {
        multiplier = 40
    }

    const globalQuarkMultiplier = player.worlds.applyBonus(1)
    let actualMultiplier = multiplier * globalQuarkMultiplier;
    if (actualMultiplier > 100) {
        actualMultiplier = Math.pow(100, 0.6) * Math.pow(actualMultiplier, 0.4)
    }

    return Math.floor(achievementpointvalues[i] * actualMultiplier)
}

export const achievementdescriptions = (i: number) => {
    const y = i18next.t(`achievements.descriptions.${i}`, { number: `${i}` })
    const z = player.achievements[i] > 0.5 ? ' COMPLETED!' : '';
    const k = areward(i)

    DOMCacheGetOrSet('achievementdescription').textContent = y + z
    DOMCacheGetOrSet('achievementreward').textContent = 'Reward: ' + achievementpointvalues[i] + ' AP. ' + format(getAchievementQuarks(i), 0, true) + ' Quarks! ' + k
    if (player.achievements[i] > 0.5) {
        DOMCacheGetOrSet('achievementdescription').style.color = 'gold'
    } else {
        DOMCacheGetOrSet('achievementdescription').style.color = 'white'
    }
}

export const achievementaward = (num: number) => {
    if (player.achievements[num] < 1) {
        if (player.toggles[34]) {
            const description = i18next.t(`achievements.descriptions.${num}`, { number: `${num}` })
            void Notification(`You unlocked an achievement: ${description}`);
        }

        void achievementAlerts(num)
        player.achievementPoints += achievementpointvalues[num]
        player.worlds.add(getAchievementQuarks(num), false)
        achievementPoints();
        player.achievements[num] = 1;
        revealStuff()

        DOMCacheGetOrSet(`ach${num}`).style.backgroundColor = 'green';
        Synergism.emit('achievement', num);
    }
}

export const achievementPoints = () => {
    const minPoints = `${format(player.achievementPoints, 0, true)}`;
    const maxPoints = `${format(totalachievementpoints, 0, true)}`;
    const percent = `${format(100 * player.achievementPoints / totalachievementpoints, 2)}`;
    DOMCacheGetOrSet('achievementprogress').textContent = i18next.t('achievements.achievementPoints', { min: `${minPoints}`, max: `${maxPoints}`, percent: `${percent}` });
}
