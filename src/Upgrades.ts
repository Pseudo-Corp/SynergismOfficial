import { player, format } from './Synergism';
import { Globals as G } from './Variables';
import Decimal from 'break_infinity.js';
import { calculateAnts, calculateCorruptionPoints, calculateRuneLevels } from './Calculate';
import { sumContents } from './Utility';
import { buyUpgrades } from './Buy';
import { buyGenerator } from './Generators';
import { buyAutobuyers } from './Automation';
import { revealStuff } from './UpdateHTML';
import { DOMCacheGetOrSet } from './Cache/DOM';

const upgdesc: Record<string, string> = {
    upgdesc1: "Increase production of Workers per producer bought.", //Coin Upgrades 1-20
    upgdesc2: "Increase production of Investments per producer bought.",
    upgdesc3: "Increase production of Printers per producer bought.",
    upgdesc4: "Increase production of Mints per producer bought.",
    upgdesc5: "Increase production of Alchemies per producer bought.",
    upgdesc6: "Increase all production based on producer bought.",
    upgdesc7: "Gain free multipliers based on your purchased Alchemies.",
    upgdesc8: "Gain 1 free Accelerator per 7 purchased Multipliers.",
    upgdesc9: "Gain 1 free Multiplier per 10 purchased Accelerators.",
    upgdesc10: "Improve Workers based on the first 750 purchased Investments.",
    upgdesc11: "Accelerators improve generation production by 2% each.",
    upgdesc12: "Each prestige multiplies production by 1.01, multiplicatively (Max: 1e4x).",
    upgdesc13: "Augments buff the production of Investments.",
    upgdesc14: "Free Accelerators buff generation of Printers.",
    upgdesc15: "Free Accelerators buff generation of Mints.",
    upgdesc16: "Acceleration Multiplier buffs Diamond gain.",
    upgdesc17: "Multiply Mint production by 1e+100.",
    upgdesc18: "Multiply Printer production based on Mythos Shards.",
    upgdesc19: "Multiply Investment production based on Mythos.",
    upgdesc20: "Coin upgrade 1 is raised to the eleventh power.",
    upgdesc21: "Gain 1 Multiplier and 5 Accelerators plus 1% more free Multipliers/Accelerators.", //Prestige Upgrades 21-40
    upgdesc22: "Gain 1 Multiplier and 4 Accelerators plus 1% more free Multipliers/Accelerators.",
    upgdesc23: "Gain 1 Multiplier and 3 Accelerators plus 1% more free Multipliers/Accelerators.",
    upgdesc24: "Gain 1 Multiplier and 2 Accelerators plus 1% more free Multipliers/Accelerators.",
    upgdesc25: "Gain 1 Multiplier and 1 Accelerators plus 1% more free Multipliers/Accelerators.",
    upgdesc26: "Gain a free Accelerator Boost.",
    upgdesc27: "Gain free Accelerators based on unspent Coins.",
    upgdesc28: "Gain a free Multiplier per 160 Coin producers bought.",
    upgdesc29: "Gain a free Accelerator per 80 Coin producers bought.",
    upgdesc30: "Gain free Multipliers based on unspent Coins.",
    upgdesc31: "Gain 1 free Accelerator Boost per 2,000 Coin producers bought.",
    upgdesc32: "Gain free Accelerators based on Unspent Diamonds.",
    upgdesc33: "Gain 1 free Multiplier for each Accelerator Boost owned.",
    upgdesc34: "Gain 3% more free Multipliers.",
    upgdesc35: "Gain 2% more free Multipliers.",
    upgdesc36: "Multiply crystal production by Diamonds, maximum 1e5000x.",
    upgdesc37: "Multiply mythos shard production by the squared logarithm of Diamonds.",
    upgdesc38: "Gain +15% more offerings thanks to generous Discord Server Boosters!",
    upgdesc39: "Gain +50% more Ant Speed thanks to generous Discord Server Boosters!",
    upgdesc40: "Gain +25% more Ant Sacrifice rewards thanks to generous Discord Server Boosters!",
    upgdesc41: "Multiply production based on unspent Mythos.",
    upgdesc42: "Multiply Mythos Shard production based on unspent Diamonds.",
    upgdesc43: "Multiply coin production by 1.01 per transcension (Max: 1e30x).",
    upgdesc44: "Multiply Mythos gain on Transcend by 1.01 per transcension (Max: 1e6x).",
    upgdesc45: "Gain free Accelerators based on Mythos Shards.",
    upgdesc46: "Accelerator Boosts are 5% stronger and do not reset prestige features.",
    upgdesc47: "Multiply Mythos Shard production based on your AP.",
    upgdesc48: "Multiply production based on owned Accelerators and Multipliers.",
    upgdesc49: "Gain free Multipliers based on unspent Mythos.",
    upgdesc50: "Gain +25% free Accelerators and Multipliers, but ONLY while doing challenges.",
    upgdesc51: "Increase production of all Mythos buildings based on owned Accelerator Boosts.",
    upgdesc52: "Mythos building exponent +0.025.",
    upgdesc53: "Augments produce more Shards based on Acceleration Multiplier.",
    upgdesc54: "Wizards produce more Enchantments based on Multiplier.",
    upgdesc55: "Grandmasters produce more Oracles based on Building power.",
    upgdesc56: "Worker production is multiplied by 1e+5000.",
    upgdesc57: "Investment production is multiplied by 1e+7500.",
    upgdesc58: "Printer production is multiplied by 1e+15000.",
    upgdesc59: "Coin Mint production is multiplied by 1e+25000.",
    upgdesc60: "Alchemies production is multiplied by 1e+35000.", //Reincarnation Upgrades 61-100
    upgdesc61: "Welcome to reincarnation! +5% Offering Recycle, +2 EXP/Offering!",
    upgdesc62: "Completing challenges, automatically or manually, increase offerings gained in Reincarnation. Bonus subject to time multiplier!",
    upgdesc63: "Crystal Production is multiplied based on Particles to the sixth power [Caps at 1e6000x].",
    upgdesc64: "Mythos Shard Production is multiplied by your Particles squared.",
    upgdesc65: "Multiply the gain of Particles from Reincarnation by 5x!",
    upgdesc66: "When you use an Offering, every unlocked rune will get 1 free experience.",
    upgdesc67: "Atom gain is increased by 3% per Particle producer purchased!",
    upgdesc68: "Gain a free multiplier for every 1e1000x increase in tax.",
    upgdesc69: "Gain more Obtainium based on your particle gain. [Works with automation at a reduced rate!]",
    upgdesc70: "Time seems to go +0.333*log10(MAX obtainium +1)% faster when you buy this.",
    upgdesc71: "Runes will gain (Rune Level/25) additional EXP per offering used.",
    upgdesc72: "Obtainium gain from Reincarnations is multiplied (1 + 2C) where C is #Reincarnation Challenges completed, up to 50x!",
    upgdesc73: "Gain +100% free accelerator boosts and +10 free Crystal Upgrade levels, but only in Reincarnation Challenges.",
    upgdesc74: "Obtainium gain is increased based on highest ever unspent offerings. [Max: 100,000 unspent]",
    upgdesc75: "Offering gain is increased based on highest ever unspent obtainium [Max: 30,000,000 obtainium]",
    upgdesc76: "Ant generation kinda slow? I agree! Make all ant tiers 5x faster!",
    upgdesc77: "This is Synergism, right? Let's make each purchased ant make all ants 0.4% faster.",
    upgdesc78: "Gain an ant speed multiplier equivalent to (1 + 0.005 * (log10(MAX offerings + 1))^2).",
    upgdesc79: "The Ant God will accept an arbitrary number of Particles in order to give you 10% more from sacrifices.",
    upgdesc80: "The Ant God will accept a larger arbitrary number of Particles to give you more ant ELO.",
    upgdesc81: "Automatically buy Workers if affordable.", //Automation Upgrades 81-100
    upgdesc82: "Automatically buy Investments if affordable.",
    upgdesc83: "Automatically buy Printers if affordable.",
    upgdesc84: "Automatically buy Coin Mints if affordable.",
    upgdesc85: "Automatically buy Alchemies if affordable.",
    upgdesc86: "Automatically buy Accelerators if affordable.",
    upgdesc87: "Automatically buy Multipliers if affordable.",
    upgdesc88: "Automatically buy Accelerator Boosts if affordable.",
    upgdesc89: "Unlock Automatic Transcensions.",
    upgdesc90: "Automatically buy from the Generator Shop.",
    upgdesc91: "Automatically buy Coin Upgrades.",
    upgdesc92: "Automatically buy Diamond Upgrades.",
    upgdesc93: "Generate 1% of Diamond Gain from prestiging per second.",
    upgdesc94: "Automatically buy Augments if affordable.",
    upgdesc95: "Automatically buy Enchantments if affordable.",
    upgdesc96: "Automatically buy Wizards if affordable.",
    upgdesc97: "Automatically buy Oracles if affordable.",
    upgdesc98: "Automatically buy Grandmasters if affordable.",
    upgdesc99: "Automatically buy Mythos Upgrades if affordable.",
    upgdesc100: "Generate 1% of Mythos Gain from transcending per second.",
    upgdesc101: "Alchemies will produce Coin Mints.", // Generator Upgrades 101-120
    upgdesc102: "Coin Mints will produce Printers.",
    upgdesc103: "Printers will produce Investments.",
    upgdesc104: "Investments will produce Workers.",
    upgdesc105: "Purchased Workers will produce Alchemies.",
    upgdesc106: "Refineries can produce Alchemies equal to Refineries owned raised to 0.10",
    upgdesc107: "Refinery -> Alchemy exponent increased from 0.10 to 0.25.",
    upgdesc108: "Refinery -> Alchemy exponent increased from 0.25 to 0.50",
    upgdesc109: "Refinery -> Alchemy exponent increased from 0.50 to 0.75",
    upgdesc110: "Refinery -> Alchemy exponent increased from 0.75 to 1",
    upgdesc111: "Augments can produce Pandora Boxes equal to Augments owned raised to 0.08",
    upgdesc112: "Augment -> Box exponent increased from 0.08 to 0.16",
    upgdesc113: "Augment -> Box exponent increased from 0.16 to 0.24",
    upgdesc114: "Augment -> Box exponent increased from 0.24 to 0.32",
    upgdesc115: "Augment -> Box exponent increased from 0.32 to 0.40",
    upgdesc116: "Protons can produce Grandmasters equal to Protons owned raised to 0.05",
    upgdesc117: "Protons -> Grandmaster exponent increased from 0.05 to 0.10",
    upgdesc118: "Protons -> Grandmaster exponent increased from 0.10 to 0.15",
    upgdesc119: "Protons -> Grandmaster exponent increased from 0.15 to 0.20",
    upgdesc120: "Protons -> Grandmaster exponent increased from 0.20 to 0.25",
    upgdesc121: "You probably autobought this. -50% taxes!",
    upgdesc122: "Increase Crystal Upgrade 3 cap from +12% to +100%!",
    upgdesc123: "Raise coin production to the power of 1.025. More EXPONENTS.",
    upgdesc124: "Gain +3% more effective ELO.",
    upgdesc125: "Constant Tax divisor is 0.333% stronger per challenge 10 completion. [Divisor^(1 + upgrade)]"
}

const crystalupgdesc: Record<number, () => string> = {
    1: () => "Gain a 5% multiplicative boost to crystals per AP per level.",
    2: () => "Gain a boost to crystals based on held coins per level.",
    3: () => `Each purchased Crystal producer increases generation of Crystal producers by .1% per level. [MAX: ${format(100 * (0.12 + 0.88 * player.upgrades[122] + 0.001 * player.researches[129] * Math.log(player.commonFragments + 1) / Math.log(4)), 2, true)}%]`,
    4: () => `Improve the multiplier to coin production by .05 exponent per level. [MAX: +${format(10 + 0.05 * player.researches[129] * Math.log(player.commonFragments + 1) / Math.log(4) + 20 * calculateCorruptionPoints() / 400 * G['effectiveRuneSpiritPower'][3])}]`,
    5: () => `Every challenge completion increases crystal gain by 1% per level.`,
    6: () => "Coming SOON!",
    7: () => "Coming SOON!",
    8: () => "Coming SOON!"
}

const constantUpgDesc: Record<number, () => string> = {
    1: () => `Make all Tesseract buildings ${format(5 + player.achievements[270] + 0.1 * player.platonicUpgrades[18], 1, true)}% more productive per level.`,
    2: () => `Each Tesseract building bought increases the production of all of them by 0.1% per level [Max ${format(10 + player.achievements[270] + player.shopUpgrades.constantEX + 100 * (G['challenge15Rewards'].exponent - 1) + 0.3 * player.platonicUpgrades[18], 2, true)}%].`,
    3: () => "Increase offering gain +2% per level.",
    4: () => "Increase obtainium gain +4% per level.",
    5: () => "Multiply ant speed by (1 + log10(Constant + 1)/10)^level",
    6: () => "Add +2 free Ant Levels per level.",
    7: () => "Provides 7 free rune levels and increases the rune cap by 3 per level.",
    8: () => "Increase the rune EXP given by offerings by 10% per level [Additive]",
    9: () => "When bought, rune effectiveness is increased by Log4(Talisman Shards +1) %",
    10:() => "When bought, gain Log4(Constant + 1)% more Wow! Cubes and Tesseracts on ascension."
}

const upgradetexts = [
    () => "Worker Production x" + format((G['totalCoinOwned'] + 1) * Math.min(1e30, Math.pow(1.008, G['totalCoinOwned'])), 2),
    () => "Investment Production x" + format((G['totalCoinOwned'] + 1) * Math.min(1e30, Math.pow(1.008, G['totalCoinOwned'])), 2),
    () => "Printer Production x" + format((G['totalCoinOwned'] + 1) * Math.min(1e30, Math.pow(1.008, G['totalCoinOwned'])), 2),
    () => "Mint Production x" + format((G['totalCoinOwned'] + 1) * Math.min(1e30, Math.pow(1.008, G['totalCoinOwned'])), 2),
    () => "Alchemy Production x" + format((G['totalCoinOwned'] + 1) * Math.min(1e30, Math.pow(1.008, G['totalCoinOwned'])), 2),
    () => "All Coin production x" + format((G['totalCoinOwned'] + 1) * Math.min(1e30, Math.pow(1.008, G['totalCoinOwned'])), 2),
    () => "Gain " + Math.min(4, 1 + Math.floor(Decimal.log(player.fifthOwnedCoin + 1, 10))) + " free multipliers from bought Alchemies.",
    () => "+" + Math.floor(player.multiplierBought / 7) + " free Accelerators.",
    () => "+" + Math.floor(player.acceleratorBought / 10) + " free Multipliers.",
    () => "Worker Production x" + format(Decimal.pow(2, Math.min(50, player.secondOwnedCoin / 15)), 2),
    () => "Generator efficiency x" + format(Decimal.pow(1.02, G['freeAccelerator']), 2),
    () => "All Coin production x" + format(Decimal.min(1e4, Decimal.pow(1.01, player.prestigeCount)), 2),
    () => "Investment Production x" + format(Decimal.min(1e50, Decimal.pow(player.firstGeneratedMythos.add(player.firstOwnedMythos).add(1), 4 / 3).times(1e10)), 2),
    () => "Printer Generation x" + format(Decimal.pow(1.15, G['freeAccelerator']), 2),
    () => "Mint Generation x" + format(Decimal.pow(1.15, G['freeAccelerator']), 2),
    () => "Gain " + format(Decimal.pow(G['acceleratorEffect'], 1 / 3), 2) + "x more Diamonds on prestige",
    () => "Mint Production x1e100 (Duh)",
    () => "Printer Production x" + format(Decimal.min(1e125, player.transcendShards.add(1))),
    () => "Investment Production x" + format(Decimal.min(1e200, player.transcendPoints.times(1e30).add(1))),
    () => "All coin production is further multiplied by " + format(Decimal.pow((G['totalCoinOwned'] + 1) * Math.min(1e30, Math.pow(1.008, G['totalCoinOwned'])), 10), 2) + " [Stacks with upgrade 1]!",
    () => "+" + format(Math.floor((1 + (1 / 101 * G['freeMultiplier'])))) + " Multipliers, +" + format(Math.floor((5 + (1 / 101 * G['freeAccelerator'])))) + " Accelerators.",
    () => "+" + format(Math.floor((1 + (1 / 101 * G['freeMultiplier'])))) + " Multipliers, +" + format(Math.floor((4 + (1 / 101 * G['freeAccelerator'])))) + " Accelerators.",
    () => "+" + format(Math.floor((1 + (1 / 101 * G['freeMultiplier'])))) + " Multipliers, +" + format(Math.floor((3 + (1 / 101 * G['freeAccelerator'])))) + " Accelerators.",
    () => "+" + format(Math.floor((1 + (1 / 101 * G['freeMultiplier'])))) + " Multipliers, +" + format(Math.floor((2 + (1 / 101 * G['freeAccelerator'])))) + " Accelerators.",
    () => "+" + format(Math.floor((1 + (1 / 101 * G['freeMultiplier'])))) + " Multipliers, +" + format(Math.floor((1 + (1 / 101 * G['freeAccelerator'])))) + " Accelerators.",
    () => "+1 Accelerator Boost.",
    () => "+" + format(Math.min(250, Math.floor(Decimal.log(player.coins.add(1), 1e3))) + Math.max(0, Math.min(1750, Math.floor(Decimal.log(player.coins.add(1), 1e15)) - 50))) + " Accelerators.",
    () => "+" + format(Math.min(1000, Math.floor((player.firstOwnedCoin + player.secondOwnedCoin + player.thirdOwnedCoin + player.fourthOwnedCoin + player.fifthOwnedCoin) / 160))) + " Multipliers.",
    () => "+" + format(Math.floor(Math.min(2000, (player.firstOwnedCoin + player.secondOwnedCoin + player.thirdOwnedCoin + player.fourthOwnedCoin + player.fifthOwnedCoin) / 80))) + " Accelerators.",
    () => "+" + format(Math.min(75, Math.floor(Decimal.log(player.coins.add(1), 1e10))) + Math.min(925, Math.floor(Decimal.log(player.coins.add(1), 1e30)))) + " Multipliers.",
    () => "+" + format(Math.floor(G['totalCoinOwned'] / 2000)) + " Accelerator Boosts",
    () => "+" + format(Math.min(500, Math.floor(Decimal.log(player.prestigePoints.add(1), 1e25)))) + " Accelerators",
    () => "+" + format(G['totalAcceleratorBoost']) + " Multipliers",
    () => "+" + format(Math.floor(3 / 103 * G['freeMultiplier'])) + " Multipliers",
    () => "+" + format(Math.floor(2 / 102 * G['freeMultiplier'])) + " Multipliers",
    () => "All Crystal producers x" + format(Decimal.min("1e5000", Decimal.pow(player.prestigePoints, 1 / 500)), 2),
    () => "All Mythos producers production x" + format(Decimal.pow(Decimal.log(player.prestigePoints.add(10), 10), 2), 2),
    () => "Thank you for getting the server above 30 boosts!",
    () => "Thank you for getting the server above 30 boosts!",
    () => "Thank you for getting the server above 30 boosts!",
    () => "Welcome to Transcension! Coin production is multiplied by " + format(Decimal.min(1e30, Decimal.pow(player.transcendPoints.add(1), 1 / 2))) + ".",
    () => "All mythos shard producers are going into overdrive: x" + format(Decimal.min(1e50, Decimal.pow(player.prestigePoints.add(1), 1 / 50).dividedBy(2.5).add(1)), 2) + " the production!",
    () => "Multiply all coin production by " + format(Decimal.min(1e30, Decimal.pow(1.01, player.transcendCount)), 2) + "!",
    () => "Multiply Mythos gained in Transcension by " + format(Decimal.min(1e6, Decimal.pow(1.01, player.transcendCount)), 2) + "!",
    () => "+" + format(Math.min(2500, Math.floor(Decimal.log(player.transcendShards.add(1), 10)))) + " Accelerators!",
    () => "It's kinda self-evident, ain't it?",
    () => "Mythos-tier producers production x" + format(Math.pow(1.05, player.achievementPoints) * (player.achievementPoints + 1), 2),
    () => "Multiply coin production by a factor of " + format(Math.pow((G['totalMultiplier'] * G['totalAccelerator'] / 1000 + 1), 8)) + "!",
    () => "+" + format(Math.min(50, Math.floor(Decimal.log(player.transcendPoints.add(1), 1e10)))) + " Multipliers through magic!",
    () => "It's quite obvious what the benefit is, but you must be in a challenge for it to be in use!",
    () => "Mythos-tier producers production x" + format(Math.pow(G['totalAcceleratorBoost'], 2), 2) + "!",
    () => "Mythos-tier producers production x" + format(Decimal.pow(G['globalMythosMultiplier'], 0.025), 2) + "! It's like inception, or something.",
    () => "Augments will produce " + format(Decimal.min("1e1250", Decimal.pow(G['acceleratorEffect'], 1 / 125)), 2) + "x as many Mythos Shards.",
    () => "Wizards will produce " + format(Decimal.min("1e2000", Decimal.pow(G['multiplierEffect'], 1 / 180)), 2) + "x as many Enchantments; what productive spirits!",
    () => "Grandmasters will produce " + format((Decimal.pow("1e1000", Math.min(1000, G['buildingPower'] - 1))), 2) + "x as many Oracles!",
    () => "It's quite obvious, ain't it?",
    () => "Look above!",
    () => "Look above!",
    () => "Look above!",
    () => "Look above!",
    () => "+5% Offering Recycle/+2EXP per Offerings. Duh!",
    () => "Base offering amount for Reincarnations +" + Math.floor(1 / 5 * (sumContents(player.challengecompletions))) + ". Challenge yourself!",
    () => "All crystal production x" + format(Decimal.min("1e6000", Decimal.pow(player.reincarnationPoints.add(1), 6))),
    () => "All mythos shard production x" + format(Decimal.pow(player.reincarnationPoints.add(1), 2)),
    () => "5x Particle gain from Reincarnations. Duh!",
    () => "It's quite clear in the description!",
    () => "The first particle-tier producer is " + format(Decimal.pow(1.03, player.firstOwnedParticles + player.secondOwnedParticles + player.thirdOwnedParticles + player.fourthOwnedParticles + player.fifthOwnedParticles), 2) + "x as productive.",
    () => "Your compliance with tax laws provides you with " + format(Math.min(2500, Math.floor(1 / 1000 * Decimal.log(G['taxdivisor'], 10)))) + " free Multipliers, for some reason.",
    () => {
        const a = Decimal.pow(Decimal.log(G['reincarnationPointGain'].add(10), 10), 0.5);
        const b = Decimal.pow(Decimal.log(G['reincarnationPointGain'].add(10), 10), 0.5);
        return "Cosmic Magnetics will allow you to gain " + 
            format(Math.min(10, new Decimal(a).toNumber()), 2) + 
            "x as much Obtainium reincarnating, x" + 
            format(Math.min(3, new Decimal(b).toNumber()), 2) + 
            " automation gain.";
    },
    () => "Contracted time makes your game timers run " + format(1/3 * Math.log(player.maxobtainium + 1)/Math.log(10),2,true) + "% more quickly.",
    () => "Writing's on the wall. Look above!",
    () => "Obtainium multiplier: x" + Math.min(50, (1 + 2 * player.challengecompletions[6] + 2 * player.challengecompletions[7] + 2 * player.challengecompletions[8] + 2 * player.challengecompletions[9] + 2 * player.challengecompletions[10])),
    () => "Same as Transcend upgrade 10, except you MUST be in a Reincarnation challenge in particular.",
    () => "Obtainium multiplier: x" + format((1 + 4 * Math.min(1, Math.pow(player.maxofferings / 100000, 0.5))), 2),
    () => "Offering Multiplier: x" + format((1 + 2 * Math.min(1, Math.pow(player.maxobtainium / 30000000, 0.5))), 2),
    () => "Epic 5x Ants!",
    () => "Ant Speed Multiplier: x" + format((Decimal.pow(1.004 + 4 / 100000 * player.researches[96], player.firstOwnedAnts + player.secondOwnedAnts + player.thirdOwnedAnts + player.fourthOwnedAnts + player.fifthOwnedAnts + player.sixthOwnedAnts + player.seventhOwnedAnts + player.eighthOwnedAnts)), 3),
    () => "Ant Speed Multiplier: x" + format(1 + 0.005 * Math.pow(Math.log(player.maxofferings + 1)/Math.log(10),2),2,true),
    () => "You will gain +10% rewards =)",
    () => "Ant Elo +75 if this upgrade is purchased.",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "All you need to know is right above this message!",
    () => "-50% Taxes duh!",
    () => "+88% cap to Crystal Upgrade 3, duh!",
    () => "Coin Production ^1.025, duh!",
    () => "+3% Effective Ant ELO, duh!",
    () => "+" + format(0.333 * player.challengecompletions[10], 0) + "% Constant Divisor power."
]

export const upgradeeffects = (i: number) => {
    DOMCacheGetOrSet("upgradeeffect").textContent = "Effect: " + upgradetexts[i - 1]();
}

export const upgradedescriptions = (i: number) => {
    const y = upgdesc[`upgdesc${i}`];
    const z = player.upgrades[i] > 0.5 ? ' BOUGHT!' : '';

    const el = DOMCacheGetOrSet("upgradedescription");
    el.textContent = y + z;
    el.style.color = player.upgrades[i] > 0.5 ? 'gold' : 'white';

    if (player.toggles[9] === true) {
        let type = ''
        if (i <= 20 && i >= 1) {
            type = 'coin'
        }
        if (i <= 40 && i >= 21) {
            type = 'prestige'
        }
        if (i <= 60 && i >= 41) {
            type = 'transcend'
        }
        if (i <= 80 && i >= 61) {
            type = 'reincarnation'
        }
        if (i <= 87 && i >= 81) {
            type = 'prestige'
        }
        if (i <= 93 && i >= 88) {
            type = 'transcend'
        }
        if (i <= 100 && i >= 94) {
            type = 'reincarnation'
        }
        if (type !== '' && i <= 80 && i >= 1) {
            buyUpgrades(type as Parameters<typeof buyUpgrades>[0], i)
        }
        if (type !== '' && i <= 100 && i >= 81) {
            buyAutobuyers(i - 80);
        }
        if (i <= 120 && i >= 101) {
            buyGenerator(i - 100);
        }
    }

    let currency = ''
    let color = ''
    if ((i <= 20 && i >= 1) || (i <= 110 && i >= 106) || (i <= 125 && i >= 121)) {
        currency = "Coins";
        color = "yellow"
    }
    if ((i <= 40 && i >= 21) || (i <= 105 && i >= 101) || (i <= 115 && i >= 111) || (i <= 87 && i >= 81)) {
        currency = "Diamonds";
        color = "cyan"
    }
    if ((i <= 60 && i >= 41) || (i <= 120 && i >= 116) || (i <= 93 && i >= 88)) {
        currency = "Mythos";
        color = "plum"
    }
    if ((i <= 80 && i >= 61) || (i <= 100 && i >= 94)) {
        currency = "Particles";
        color = "limegreen"
    }

    DOMCacheGetOrSet("upgradecost").textContent = "Cost: " + format(Decimal.pow(10, G['upgradeCosts'][i])) + " " + currency
    DOMCacheGetOrSet("upgradecost").style.color = color
    upgradeeffects(i)
}

const returnCrystalUpgDesc = (i: number) => crystalupgdesc[i]?.()

export const crystalupgradedescriptions = (i: number) => {
    const p = player.crystalUpgrades[i - 1];
    const c = 
        (player.upgrades[73] > 0.5 && player.currentChallenge.reincarnation !== 0 ? 10 : 0) +
        (Math.floor(G['rune3level'] * G['effectiveLevelMult'] /16) * 100 / 100);
    
    const q = Decimal.pow(10, (G['crystalUpgradesCost'][i - 1] + G['crystalUpgradeCostIncrement'][i - 1] * Math.floor(Math.pow(player.crystalUpgrades[i - 1] + 0.5 - c, 2) / 2)))
    DOMCacheGetOrSet("crystalupgradedescription").textContent = returnCrystalUpgDesc(i)
    DOMCacheGetOrSet("crystalupgradeslevel").textContent = "Level: " + p;
    DOMCacheGetOrSet("crystalupgradescost").textContent = "Cost: " + format(q) + " crystals"
}


export const upgradeupdate = (num: number, fast?: boolean) => {
    const el = DOMCacheGetOrSet(`upg${num}`);
    if (player.upgrades[num] > 0.5 && ((num <= 60 || num > 80) && (num <= 93 || num > 100))) {
        el.style.backgroundColor = "green"
    } else if (player.upgrades[num] > 0.5 && ((num > 60 && num <= 80) || (num > 93 && num <= 100) || (num > 120))) {
        el.style.backgroundColor = "white"
    }

    const b = upgdesc[`upgdesc${num}`];
    const c = player.upgrades[num] > 0.5 ? ' BOUGHT!' : '';
    if (player.upgrades[num] > 0.5) {
        if (!fast) {
            DOMCacheGetOrSet("upgradedescription").textContent = b + c
            DOMCacheGetOrSet("upgradedescription").style.color = "gold"
        }
    } else {
        el.style.backgroundColor = "Black"
    }

    if (!fast) revealStuff()
}

export const ascendBuildingDR = () => {
    const sum = player.ascendBuilding1.owned + player.ascendBuilding2.owned + player.ascendBuilding3.owned + player.ascendBuilding4.owned + player.ascendBuilding5.owned

    if (sum > 100000)
        return Math.pow(100000, 0.5) * Math.pow(sum, 0.5)
    else
        return sum
}

const constUpgEffect: Record<number, () => string> = {
    1: () => `Tesseract building production x${format(Decimal.pow(1.05 + 0.01 * player.achievements[270] + 0.001 * player.platonicUpgrades[18], player.constantUpgrades[1]), 2, true)}`,
    2: () => `Tesseract building production x${format(Decimal.pow(1 + 0.001 * Math.min(100 + 10 * player.achievements[270] + 10 * player.shopUpgrades.constantEX + 3 * player.platonicUpgrades[18] + 1000 * (G['challenge15Rewards'].exponent - 1), player.constantUpgrades[2]), ascendBuildingDR()), 2, true)}`,
    3: () => `Offering gain x${format(1 + 0.02 * player.constantUpgrades[3], 2, true)}`,
    4: () => `Obtainium gain x${format(1 + 0.04 * player.constantUpgrades[4], 2, true)}`,        
    5: () => `Ant Speed x${format(Decimal.pow(1 + 0.1 * Decimal.log(player.ascendShards.add(1), 10), player.constantUpgrades[5]), 2, true)}`,
    6: () => `+ ${format(2 * player.constantUpgrades[6])} free Ant Levels`,
    7: () => `+${format(7 * player.constantUpgrades[7])} free Rune Levels, +${format(3 * player.constantUpgrades[7])} to Rune Cap`,
    8: () => `Rune EXP x${format(1 + 1 / 10 * player.constantUpgrades[8], 2, true)}`,
    9: () => `Runes effectiveness x${format(1 + 0.01 * Math.log(player.talismanShards + 1) / Math.log(4) * Math.min(1, player.constantUpgrades[9]), 4, true)}`,
    10: () => `Cubes/Tesseracts on Ascension x${format(1 + 0.01 * Decimal.log(player.ascendShards.add(1), 4) * Math.min(1, player.constantUpgrades[10]), 4, true)}` 
}

const returnConstUpgDesc = (i: number) => constantUpgDesc[i]?.();
const returnConstUpgEffect = (i: number) => constUpgEffect[i]?.();

export const getConstUpgradeMetadata = (i: number): [number, Decimal] => {
    const toBuy = Math.max(0, Math.floor(1 + Decimal.log(Decimal.max(0.01, player.ascendShards), 10) - Math.log(G['constUpgradeCosts'][i]) / Math.log(10)));
    let cost = new Decimal("1");
    if (toBuy > player.constantUpgrades[i]) {
        cost = Decimal.pow(10, toBuy - 1).times(G['constUpgradeCosts'][i])
    } else {
        cost = Decimal.pow(10, player.constantUpgrades[i]).times(G['constUpgradeCosts'][i])
    }

    return [Math.max(1, toBuy - player.constantUpgrades[i]), cost]
}

export const constantUpgradeDescriptions = (i: number) => {
    const [level, cost] = getConstUpgradeMetadata(i)
    DOMCacheGetOrSet("constUpgradeDescription").textContent = returnConstUpgDesc(i)
    DOMCacheGetOrSet("constUpgradeLevel2").textContent = format(player.constantUpgrades[i])
    DOMCacheGetOrSet("constUpgradeCost2").textContent = format(cost) + " [+" + format(level) + " LVL]"
    DOMCacheGetOrSet("constUpgradeEffect2").textContent = returnConstUpgEffect(i)
}

export const buyConstantUpgrades = (i: number, fast = false) => {
    const [level, cost] = getConstUpgradeMetadata(i)
    if (player.ascendShards.gte(cost)) {
        player.constantUpgrades[i] += level;
        if (player.researches[175] === 0) {
            player.ascendShards = player.ascendShards.sub(cost);
        }
        if (!fast) {
            constantUpgradeDescriptions(i);
        }
    }
    calculateAnts();
    calculateRuneLevels();
}