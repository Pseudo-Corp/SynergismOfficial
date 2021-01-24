import { player } from './Synergism';
import { Globals as G } from './Variables';
import { revealStuff } from './UpdateHTML';
import { Synergism } from './Events';
import { sumContents } from './Utility';

const achievementpointvalues = [0, 
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
    40, 40, 40, 40, 100, 100, 0
];

export const totalachievementpoints = achievementpointvalues.reduce((a, b) => a + b, 0);

const adesc = {
    adesc1: "A Loyal Employee: Hire your first worker.",
    adesc2: "Small Business: Hire 10 workers.",
    adesc3: "Now we're synergizing!: Hire 100 workers.",
    adesc4: "Gaining Redundancies: Hire 1,000 workers.",
    adesc5: "A cog in the machine: Hire 5,000 workers.",
    adesc6: "A nail in the machine: Hire 10,000 workers.",
    adesc7: "Are we even in the machine anymore?: Hire 20,000 workers.",
    adesc8: "STONKS!!!: Purchase 1 Investment.",
    adesc9: "Planning ahead: Purchase 10 Investments.",
    adesc10: "Inside Trading: Purchase 100 Investments.",
    adesc11: "Outside Trading?: Purchase 1,000 Investments.",
    adesc12: "Market Takeover: Purchase 5,000 Investments.",
    adesc13: "Trickle-Down Economics: Purchase 10,000 Investments.",
    adesc14: "Eliminated Regulation: Purchase 20,000 Investments.",
    adesc15: "Stationery!: Build 1 Printer.",
    adesc16: "Printing Press: Build 10 Printers.",
    adesc17: "It prints free money!: Build 100 Printers.",
    adesc18: "Solving Our Debts: Build 1,000 Printers.",
    adesc19: "Monopolizing the market: Build 5,000 Printers.",
    adesc20: "We're running out of Ink!: Build 10,000 Printers.",
    adesc21: "3D-printing the universe: Build 20,000 Printers.",
    adesc22: "A national treasure: Establish 1 Coin Mint.",
    adesc23: "Now with competition!: Establish 10 Coin Mints.",
    adesc24: "Counterfeiting with Style!: Establish 100 Coin Mints.",
    adesc25: "Why do we need all these?: Establish 1000 Coin Mints.",
    adesc26: "No really, why??: Establish 5,000 Coin Mints.",
    adesc27: "Is no one to stop us???: Establish 10,000 Coin Mints.",
    adesc28: "Oh well, time to mint: Establish 20,000 Coin Mints.",
    adesc29: "Newton's Apprentice: Create 1 Alchemy.",
    adesc30: "Lab Work: Create 10 Alchemies.",
    adesc31: "Satanic Becomings: Create 66 Alchemies.",
    adesc32: "Satan Incarnate: Create 666 Alchemies.",
    adesc33: "Is this more demonic?: Create 6,666 Alchemies.",
    adesc34: "Golden Paradise: Create 17,777 Alchemies.",
    adesc35: "Unlocking secrets to the world: Create 42,777 Alchemies.",
    adesc36: "Leveling up: Prestige for at least 1 Diamond.",
    adesc37: "High-Tiered: Prestige for at least 1e+6 Diamonds.",
    adesc38: "Highly Regarded: Prestige for at least 1e+100 Diamonds.",
    adesc39: "Prestigious: Prestige for at least 1e+1000 Diamonds.",
    adesc40: "Legendary: Prestige for at least 1e+10000 Diamonds.",
    adesc41: "Divine: Prestige for at least 1e+77777 Diamonds.",
    adesc42: "Perfectly Respected: Prestige for at least 1e+250000 Diamonds.",
    adesc43: "A Simple Detour: Transcend for at least 1 Mythos.",
    adesc44: "Tunnel Vision: Transcend for at least 1e+6 Mythos.",
    adesc45: "Risen from the Ashes: Transcend for at least 1e+50 Mythos.",
    adesc46: "Paradigm Shift: Transcend for at least 1e+308 Mythos.",
    adesc47: "Preparation: Transcend for at least 1e+2000 Mythos.",
    adesc48: "Revising the Plan: Transcend for at least 1e+25000 Mythos.",
    adesc49: "Leaving the Universe: Transcend for at least 1e+100000 Mythos.",
    adesc50: "Going Quantum: Reincarnate for at least 1 Particle.",
    adesc51: "Tunneling Vision: Reincarnate for at least 100,000 Particles.",
    adesc52: "Simulating the World: Reincarnate for at least 1e+30 Particles.",
    adesc53: "Multidimensional Creation: Reincarnate for at least 1e+200 Particles.",
    adesc54: "Lepton Dance: Reincarnate for at least 1e+1500 Particles.",
    adesc55: "Do we have enough yet?: Reincarnate for at least 1e+5000 Particles.",
    adesc56: "I Feel Luck in My Cells: Reincarnate for at least 1e+7777 Particles.",
    adesc57: "One Way Only: Prestige without buying multipliers.",
    adesc58: "Authentic Shifting: Transcend without having bought a multiplier.",
    adesc59: "The Singularity: Reincarnate without having bought a multiplier.",
    adesc60: "Gotta go SLOW!: Prestige without buying Accelerators or Accelerator Boosts.",
    adesc61: "I'm really going slow: Transcend without having bought Accelerators or Boosts.",
    adesc62: "Are we there yet?: Reincarnate without having bought Accelerators or Boosts.",
    adesc63: "A careful search for Diamonds: Get 1e120,000 Coins in [Reduced Diamonds] without buying Accelerators or Boosts.",
    adesc64: "Very Based: Prestige without purchasing Coin Upgrades.",
    adesc65: "Miser: Transcend without purchasing Coin Upgrades.",
    adesc66: "True Miser: Transcend without purchasing Coin or Diamond Upgrades.",
    adesc67: "Coinless Pursuit: Reincarnate without purchasing Coin Upgrades.",
    adesc68: "Diamonds don't matter to me!: Reincarnate without purchasing Coin or Diamond Upgrades.",
    adesc69: "Leave nothing behind: Reincarnate without purchasing Coin, Diamond or Mythos Upgrades.",
    adesc70: "Leave NOTHING behind.: Reincarnate without purchasing Coin, Diamond, Mythos, or Generator Upgrades.",
    adesc71: "Out of Order: Buy Generator Upgrade Row 1, #2 first in a transcension (IV -> III)",
    adesc72: "More Out of Order: Buy Generator Upgrade Row 1, #3 first in a transcension (III -> II)",
    adesc73: "Four's a Company: Buy Generator Upgrade Row 1, #4 first in a transcension (II -> I)",
    adesc74: "Five's a Croud: Buy Generator Upgrade Row 1, #5 first in a transcension (I -> V)",
    adesc75: "Vaseline without the Machine: Exit [No Multiplier] with at least 1e1000 coins and without any of the row 1 generator upgrades.",
    adesc76: "Rage against the Machine: Exit [No Accelerator] with at least 1e1000 coins and without any of the row 1 generator upgrades.",
    adesc77: "Amish Paradise: Exit [No Shards] with at least 1e99,999 coins and without any of the row 1 generator upgrades.",
    adesc78: "Single-Cell: Complete [No Multiplier] once.",
    adesc79: "Solidarity: Complete [No Multiplier] three times.",
    adesc80: "Duplication-Free!: Complete [No Multiplier] five times.",
    adesc81: "Multitasking Challenged: Complete [No Multiplier] ten times.",
    adesc82: "No Deaths: Complete [No Multiplier] twenty times.",
    adesc83: "Population One: Complete [No Multiplier] fifty times.",
    adesc84: "Insert Another Token: Complete [No Multiplier] seventy-five times.",
    adesc85: "Slow Start: Complete [No Accelerator] once",
    adesc86: "Respawn Rate -12%: Complete [No Accelerator] three times.",
    adesc87: "Putting the Breaks On: Complete [No Accelerator] five times.",
    adesc88: "Racing a Sloth...: Complete [No Accelerator] ten times.",
    adesc89: "... and Losing.: Complete [No Accelerator] twenty times.",
    adesc90: "Planck Distance Traveled: Complete [No Accelerator] fifty times.",
    adesc91: "Inverse-Ackermann Growth: Complete [No Accelerator] seventy-five times.",
    adesc92: "Intact: Complete [No Shards] once.",
    adesc93: "Augments are Stupid!: Complete [No Shards] three times.",
    adesc94: "Grandmasters are Brilliant!: Complete [No Shards] five times.",
    adesc95: "Gotta get those Grandmasters Stronger: Complete [No Shards] ten times.",
    adesc96: "Summoning Enhancements: Complete [No Shards] twenty times.",
    adesc97: "Magic 99/99: Complete [No Shards] fifty times.",
    adesc98: "Perfect Foresight: Complete [No Shards] seventy-five times.",
    adesc99: "Inflation: Complete [Cost+] once.",
    adesc100: "Hyperinflation: Complete [Cost+] three times.",
    adesc101: "Market Bubble: Complete [Cost+] five times.",
    adesc102: "Bull Market: Complete [Cost+] ten times.",
    adesc103: "Wealth Inequality: Complete [Cost+] twenty times.",
    adesc104: "Severe Overpay: Complete [Cost+] fifty times.",
    adesc105: "Societal Collapse: Complete [Cost+] seventy-five times.",
    adesc106: "Excavation: Complete [Reduced Diamonds] once.",
    adesc107: "Digging Deep: Complete [Reduced Diamonds] three times.",
    adesc108: "Frack As Needed: Complete [Reduced Diamonds] five times.",
    adesc109: "Unobtainium Pickaxe: Complete [Reduced Diamonds] ten times.",
    adesc110: "Fortune III: Complete [Reduced Diamonds] twenty times.",
    adesc111: "Every kiss...: Complete [Reduced Diamonds] fifty times.",
    adesc112: "...begins with K.: Complete [Reduced Diamonds] seventy-five times.",
    adesc113: "Tax evasion!: Complete {[Tax+]} once.",
    adesc114: "Keeping up with the Joneses: Complete {[Tax+]} twice.",
    adesc115: "Offshore deposits: Complete {[Tax+]} three times.",
    adesc116: "Bribing officials: Complete {[Tax+]} five times.",
    adesc117: "Becoming President: Complete {[Tax+]} ten times.",
    adesc118: "Charitable Donation: Complete {[Tax+]} fifteen times.",
    adesc119: "IRS Audit: Complete {[Tax+]} twenty-five times.",
    adesc120: "Is there anybody in there?: Complete {[No Accelerator/Multiplier]} once.",
    adesc121: "Human being: Complete {[No Accelerator/Multiplier]} twice.",
    adesc122: "Interdimensional: Complete {[No Accelerator/Multiplier]} three times.",
    adesc123: "A slow nickel: Complete {[No Accelerator/Multiplier]} five times.",
    adesc124: "Multipliers don't even work 0/5: Complete {[No Accelerator/Multiplier]} ten times.",
    adesc125: "Accelerators don't even work -5/5: Complete {[No Accelerator/Multiplier]} fifteen times.",
    adesc126: "ACCELERATOR BOOSTS DON'T EVEN WORK -100/5: Complete {[No Accelerator/Multiplier]} twenty-five times.",
    adesc127: "I hate this challenge: Complete Cost++ Once.",
    adesc128: "A costly mistake: Complete Cost++ Twice.",
    adesc129: "Impetus: Complete Cost++ Three Times.",
    adesc130: "Are you broke yet? Complete Cost++ Five Times.",
    adesc131: "The world of Finance: Complete Cost++ Ten Times.",
    adesc132: "Marginal Gains: Complete Cost++ Twenty Times.",
    adesc133: "I buy these: Complete Cost++ Twenty-Five Times.",
    adesc134: "Agnostic: Complete No Runes Once.",
    adesc135: "Ant-i Runes: Complete No Runes Twice.",
    adesc136: "Isn't it getting tiresome?: Complete No Runes Three Times.",
    adesc137: "Machine does not accept offerings: Complete No Runes Five Times.",
    adesc138: "Runes Suck 1/5: Complete No Runes Ten Times.",
    adesc139: "I didn't even notice Prism was gone: Complete No Runes Twenty Times.",
    adesc140: "Atheist: Complete No Runes Twenty-Five Times.",
    adesc141: "Sadism: Complete {[Sadistic I]} Once.",
    adesc142: "Masochism: Complete {[Sadistic I]} Twice.",
    adesc143: "Insanity: Complete {[Sadistic I]} Three Times.",
    adesc144: "How? Complete {[Sadistic I]} Five Times.",
    adesc145: "Why? Complete {[Sadistic I]} Ten Times.",
    adesc146: "Descend: Complete {[Sadistic I]} Twenty Times.",
    adesc147: "End of the Universe: Complete {[Sadistic I]} Twenty-Five Times.",
    adesc148: "Gas gas gas: Purchase 5 Accelerators.",
    adesc149: "0 to 25: Purchase 25 Accelerators.",
    adesc150: "0 to 100: Purchase 100 Accelerators",
    adesc151: "Highway to Hell: Purchase 666 Accelerators.",
    adesc152: "Perhaps you should brake: Purchase 2,000 Accelerators.",
    adesc153: "Exit the vehicle now!: Purchase 12,500 Accelerators.",
    adesc154: "Faster than light: Purchase 100,000 Accelerators.",
    adesc155: "I've been duped!: Purchase 2 Multipliers.",
    adesc156: "Funhouse Mirrors: Purchase 20 Multipliers.",
    adesc157: "Friend of binary: Purchase 100 Multipliers.",
    adesc158: "Feeling the cost growth yet?: Purchase 500 Multipliers.",
    adesc159: "Perhaps you'll feel the cost now: Purchase 2,000 Multipliers.",
    adesc160: "Exponential Synergy: Purchase 12,500 Multipliers.",
    adesc161: "Cloned: Purchase 100,000 Multipliers.",
    adesc162: "Jerk > 0: Purchase 2 Accelerator Boosts.",
    adesc163: "Can't the speedometer move any faster?: Purchase 10 Accelerator Boosts.",
    adesc164: "50 G rotations: Purchase 50 Accelerator Boosts.",
    adesc165: "Dematerialize: Purchase 200 Accelerator Boosts.",
    adesc166: "Breaking the laws of Physics: Purchase 1,000 Accelerator Boosts.",
    adesc167: "Decayed Realism: Purchase 5,000 Accelerator Boosts.",
    adesc168: "Kinda fast: Purchase 15,000 Accelerator Boosts.",
    adesc169: "The Galactic Feast: Obtain 3 Galactic Crumbs.",
    adesc170: "Only the finest: Obtain 100,000 Galactic Crumbs.",
    adesc171: "Six-Course Meal: Obtain 666,666,666 Galactic Crumbs.",
    adesc172: "Accumulation of Food: Obtain 1e20 Galactic Crumbs.",
    adesc173: "Cookie Clicking: Obtain 1e40 Galactic Crumbs.",
    adesc174: "Unlimited Bread Sticks!: Obtain 1e500 Galactic Crumbs.",
    adesc175: "Restaurant at the end of the Universe: Obtain 1e2500 Galactic Crumbs.",
    adesc176: "Ant-icipation!: Amass a 2x Ant Multiplier through sacrifice and own a Tier 2 ant.",
    adesc177: "Ant-ecedent: Amass a 6x Ant Multiplier through sacrifice and own a Tier 3 ant.",
    adesc178: "Ants are friends, not food!: Amass a 20x Ant Multiplier through sacrifice and own a Tier 4 Ant.",
    adesc179: "Ant Devil?: Amass a 100x Ant Multiplier through sacrifice and own a Tier 5 Ant.",
    adesc180: "The world's best chef: Amass a 500x Ant Multiplier through sacrifice and own a Tier 6 Ant.",
    adesc181: "6 Michelin Stars: Amass a 6,666x Ant Multiplier through sacrifice and own a Tier 7 Ant.",
    adesc182: "Keys to the Restaurant at the end of the Universe: Amass a 77,777x Ant Multiplier through sacrifice and own a Tier 8 Ant.",
    adesc183: "Up: Ascend Once.",
    adesc184: "Double-Up: Ascend Twice.",
    adesc185: "Give me Ten!: Ascend Ten Times.",
    adesc186: "Give me a Hundred: Ascend 100 Times.",
    adesc187: "Give me a Thousand: Ascend 1,000 Times.",
    adesc188: "Give me some arbitrary number I: Ascend 14,142 Times.",
    adesc189: "Give me some arbitrary number II: Ascend 141,421 Times.",
    adesc190: "Now that's what I call getting some Pi!: Attain a constant of 3.14.",
    adesc191: "One in a million: Attain a constant of 1,000,000 [1e6].",
    adesc192: "A number: Attain a constant of 4.32e10.",
    adesc193: "The coolest of numbers: Attain a constant of 6.9e21.",
    adesc194: "Planck^(-1): Attain a constant of 1.509e33.",
    adesc195: "Epsilon > a lot: Attain a constant of 1e66.",
    adesc196: "NUM_MAX: Attain a constant of 1.8e308.",
    adesc197: "Casualties: Clear 'Reduced Ants' challenge once.",
    adesc198: "Fatalities: Clear 'Reduced Ants' challenge twice.",
    adesc199: "Destruction: Clear 'Reduced Ants' challenge three times.",
    adesc200: "War, what is it good for?: Clear 'Reduced Ants' challenge five times.",
    adesc201: "Absolutely everything.: Clear 'Reduced Ants' challenge ten times.",
    adesc202: "Perfect Storm: Clear 'Reduced Ants' challenge twenty times.",
    adesc203: "Immaculate Storm: Clear 'Reduced Ants' challenge thirty times.",
    adesc204: "I didn't need those stupid reincarnations anyway!: Clear 'No Reincarnation' challenge once.",
    adesc205: "[x1,x2,0,x3]: Clear 'No Reincarnation' challenge twice.",
    adesc206: "Nonmetaphysical: Clear 'No Reincarnation' challenge three times.",
    adesc207: "Living alone: Clear 'No Reincarnation' challenge five times.",
    adesc208: "DM me on discord if you read these names: Clear 'No Reincarnation' challenge ten times.",
    adesc209: "Yeah: Clear 'No Reincarnation' challenge twenty times.",
    adesc210: "Science! Clear 'No Reincarnation' challenge thirty times.",
    adesc211: "The IRS strikes back: Clear 'Tax+++' challenge once.",
    adesc212: "Fiscal Policy: Clear 'Tax+++' challenge twice.",
    adesc213: "Economic Boom: Clear 'Tax+++' challenge three times.",
    adesc214: "Ant-onomics: Clear 'Tax+++' challenge five times.",
    adesc215: "'Wow Platonic Tax sucks 1/5': Clear 'Tax+++' challenge ten times.",
    adesc216: "Haha this is hard for some reason: Clear 'Tax+++' challenge twenty times.",
    adesc217: "Taxes are hard: Clear 'Tax+++' challenge thirty times.",
    adesc218: "Shiny Blue Rock: Clear 'No Research' once.",
    adesc219: "It's like Avatar: Clear 'No Research' twice.",
    adesc220: "It's like Unobtainium: Clear 'No Research' three times.",
    adesc221: "It's like a thing: Clear 'No Research' five times.",
    adesc222: "It's like: Clear 'No Research' ten times.",
    adesc223: "It's: Clear 'No Research' twenty times.",
    adesc224: "It: Clear 'No Research' thirty times.",
    adesc225: "Pretty Corrupt: Clear an Ascension with above 100,000 score.",
    adesc226: "Bought out: Clear an Ascension with above 1 million score.",
    adesc227: "Utterly Corrupt: Clear an Ascension with above 10 million score.",
    adesc228: "Antitrust: Clear an Ascension with above 100 million score.",
    adesc229: "Ant-i-trust: Clear an Ascension with above 1 billion score.",
    adesc230: "This is pretty unfair: Clear an Ascension with above 5 billion score.",
    adesc231: "Antichrist: Clear an Ascension with above 25 billion score.",
    adesc232: "Highly Blessed: Level your Speed Rune blessing to 100,000.",
    adesc233: "Divine Blessing: Level your Speed Rune blessing to 100,000,000.",
    adesc234: "Blessing III: Level your Speed Rune blessing to 100 billion.",
    adesc235: "Spirit I: Level your Speed Spirit to 1 Million.",
    adesc236: "Spirit II: Level your Speed Spirit to 1 Billion.",
    adesc237: "Spirit III: Level your Speed Spirit to 1 Trillion.",
    adesc238: "Three-folded: [Hint: you may want to look into the inception]",
    adesc239: "Seeing red: [Hint: you may need a lot of red items]",
    adesc240: "ASCENDED: [Hint: you may need a LOT of ascensions OR an particularly amazing ascension]",
    adesc241: "Aesop: [Hint: you gotta be pretty dang slow]",
    adesc242: "Aesop's Revenge: [Hint: you gotta be pretty dang fast]",
    adesc243: "Unsmith: [Hint: unsmith emoji :unsmith: can be a pretty good input]",
    adesc244: "Smith: [Hint: :antismith: looks promising as well]",
    adesc245: "BLESSED: [Hint: Your Speed Blessing best be unreasonably high!]",
    adesc246: "Why? [Hint: Sometimes even 1 in over a Trillion counts!]",
    adesc247: "Challenging! [Hint: Challenge 11 is calling your name, but with even less ants]",
    adesc248: "Seeing Red but not Blue: [Hint: Can you get red stuff without getting blue stuff?]",
    adesc249: "Overtaxed: [Hint: It might pay not to read!]",
    adesc250: "The Thousand Suns: [Hint: You need to fully research into becoming GOD]",
    adesc251: "The Thousand Moons: [Hint: You may need to cube yourself up]",
    adesc252: "Ultimate: Complete 'SADISTIC II' challenge."
}

const areward = {
    areward3: "Gain +.05% to Accelerator Power.",
    areward4: "Start transcensions/challenges with Worker Autobuyer unlocked.",
    areward5: "Gain +1 Accelerator per 500 Workers owned.",
    areward6: "Gain +1 Multiplier per 1,000 Workers owned.",
    areward7: "Gain +1 Accelerator Boost per 2,000 workers owned.",
    areward10: "Gain +.10% to Accelerator Power.",
    areward11: "Start transcensions/challenges with Investment Autobuyer unlocked.",
    areward12: "Gain +1 Accelerator per 500 Investments owned.",
    areward13: "Gain +1 Multiplier per 1,000 Investments owned.",
    areward14: "Gain +1 Accelerator Boost per 2,000 Investments owned.",
    areward17: "Gain +.15% to Accelerator Power.",
    areward18: "Start transcensions/challenges with Printer Autobuyer unlocked.",
    areward19: "Gain +1 Accelerator per 500 Printers owned.",
    areward20: "Gain +1 Multiplier per 1,000 Printers owned.",
    areward21: "Gain +1 Accelerator Boost per 2,000 Printers owned.",
    areward24: "Gain +.20% to Accelerator Power.",
    areward25: "Start transcensions/challenges with Coin Mint Autobuyer unlocked.",
    areward26: "Gain +1 Accelerator per 500 Mints owned.",
    areward27: "Gain +1 Multiplier per 1,000 Mints owned.",
    areward28: "Gain +1 Accelerator Boost per 2,000 Mints owned.",
    areward31: "Gain +.25% to Accelerator Power.",
    areward32: "Start transcensions/challenges with Alchemy Autobuyer unlocked.",
    areward33: "Gain 10% more offerings from resets || +1 Accelerator per 500 Alchemies!",
    areward34: "Gain 15% more offerings from resets (stacks multiplicatively!) || +1 Multiplier per 1,000 Alchemies!",
    areward35: "Gain 25% more offerings from resets (stacks multiplicatively!) || +1 Accelerator Boost per 2,000 Alchemies!",
    areward36: "Multiply Crystal Production by 2x.",
    areward37: "Multiply Crystal Production by the common logarithm of owned Diamonds. Prestiges give more offerings based on time spent (Up to +15 at 1800 seconds)",
    areward38: "Unlock the Duplication rune!",
    areward43: "Accelerator Boosts can be purchased from any screen. Unlock the Auto-Prestige feature.",
    areward44: "Unlock the Prism Rune! Transcensions give more offerings based on time spent (Up to +15 at 1800 seconds)",
    areward45: "Reduce tax scaling by up to 5%, depending on the length of prestige.",
    areward46: "Reduce tax scaling by up to another 5%, depending on length of prestige.",
    areward47: "Reduce tax scaling by up to ANOTHER 10%, depending on length of prestige!",
    areward50: "Unlock new Atomic production and unlock 3 new incredibly difficult challenges! Gain 2x particles on all future Reincarnations!",
    areward51: "Manual Reincarnations give +4 Obtainium (unaffected by multipliers except time multiplier)!",
    areward52: "Reincarnations give more offerings based on time spent (Up to +25 at 1800 seconds)",
    areward53: "Increase the amount of obtainium gained through all features by 0.125% additive for each rune level.",
    areward57: "Gain +1, +1% free Multipliers!",
    areward58: "Gain +1, +1% more free Multipliers!",
    areward59: "Gain +1, +1% more, MORE free Multipliers!",
    areward60: "Gain +2, +1% free Accelerators!",
    areward61: "Gain +2, +1% more free Accelerators!",
    areward62: "Gain +2, +1% more, MORE free Accelerators!",
    areward71: "+1% Conversion Exponent on all generator upgrades!",
    areward72: "+1% Conversion Exponent on all generator upgrades!",
    areward73: "+1% Conversion Exponent on all generator upgrades!",
    areward74: "+1% Conversion Exponent on all generator upgrades!",
    areward75: "+1% Conversion Exponent on all generator upgrades!",
    areward76: "+1% Conversion Exponent on all generator upgrades!",
    areward77: "+1% Conversion Exponent on all generator upgrades! They're in overdrive now!",
    areward78: "Start transcensions/challenges with 1 Refinery and automatically buy Refineries.",
    areward79: "Automatically buy the first crystal upgrade if you can afford it!",
    areward80: "Start transcensions/challenges with Multiplier Autobuyer unlocked. +5% offering recycle.",
    areward82: "Delay tax growth by 4%.",
    areward84: "+1% obtainium (stacks additively with other achievement rewards)",
    areward85: "Start transcensions/challenges with 1 Coal Plant and automatically buy Coal Plants.",
    areward86: "Automatically buy the second crystal upgrade if you can afford it!",
    areward87: "Start transcensions/challenges with Accelerator Autobuyer unlocked. +5% offering recycle.",
    areward89: "Delay tax growth by 4%.",
    areward91: "+3% obtainium (stacks additively with other achievement rewards)",
    areward92: "Start transcensions/challenges with 1 Coal Rig and automatically buy Coal Rigs.",
    areward93: "Automatically buy the third crystal upgrade if you can afford it!",
    areward94: "+5% offering recycle.",
    areward96: "Delay tax growth by 4%.",
    areward98: "+5% obtainium (stacks additively with other achievement rewards)",
    areward99: "Start transcensions/challenges with 1 Diamond Pickaxe and automatically buy Diamond Pickaxes.",
    areward100: "Automatically buy the fourth crystal upgrade if you can afford it!",
    areward101: "+5% offering recycle.",
    areward102: "Unlock the Thrift rune!",
    areward103: "Delay tax growth by 4%.",
    areward105: "+7% obtainium (stacks additively with other achievement rewards)",
    areward106: "Start transcensions/challenges with 1 Pandora's Box and automatically buy Pandora's Boxes.",
    areward107: "Automatically buy the fifth crystal upgrade if you can afford it!",
    areward108: "+5% offering recycle.",
    areward110: "Delay tax growth by 4%.",
    areward112: "+9% obtainium (stacks additively with other achievement rewards)",
    areward115: "+5% offering recycle.",
    areward117: "Delay tax growth by 5.66%.",
    areward118: "Each Reincarnation challenge completion delays tax growth by 0.75% per level, multiplicative",
    areward119: "+11% obtainium. Unlock a nice trinket somewhere...",
    areward122: "+7.5% offering recycle.",
    areward124: "Delay tax growth by 5.66%. Unlock 5 new incredibly powerful researches!",
    areward126: "+13% obtainium. You get an accessory to commemorate this moment!",
    areward127: "Unlock 20 new incredibly expensive yet good researches. Unlock the [Anthill] feature!",
    areward128: "Make researches go Cost-- with 1.5x Obtainium!",
    areward129: "+7.5% offering recycle. Gain another 1.25x Obtainium multiplier!",
    areward131: "Delay tax growth by 5.66%.",
    areward132: "Permanently gain +25% more sacrifice reward!",
    areward133: "+15% obtainium. Obtain the gift of Midas himself.",
    areward134: "Unlock 10 newer incredibly expensive yet good researches. Unlock <<Talismans>> in the Runes Tab!",
    areward135: "Talisman positive bonuses are now +0.05 stronger per level.",
    areward136: "Talisman positive bonuses are now +0.05 even stronger per level.",
    areward137: "Permanently gain +25% more sacrifice reward!",
    areward140: "+17% obtainium. Lazy joke about not leaking talismans here [You get a new one]",
    areward141: "Unlock a new reset tier!",
    areward147: "+19% obtainium (Achievement total is up to 100%!). Gain the Polymath Talisman!",
    areward169: "ALL Ant speed multiplied by log10(crumbs + 10)",
    areward171: "+16.666% ALL Ant speed!",
    areward172: "Gain more ants the longer your reincarnation lasts (max speed achieved in 2 hours)",
    areward173: "Unlock Ant Sacrifice, allowing you to reset your ants and ant upgrades in exchange for amazing rewards! Automatically buy Worker Ants.",
    areward174: "Ant Multiplier from sacrifice is multiplied by another logarithm (Multiply by 0.4 * log10(points + 1))",
    areward176: "Unlock Tier 2 Ant autobuy, and autobuy Inceptus and Fortunae ants! Add +25 Base Ant ELO.",
    areward177: "Unlock Tier 3 Ant autobuy, and autobuy Tributum ants! Add +50 Base Ant ELO.",
    areward178: "Unlock Tier 4 Ant autobuy, and autobuy Celeritas and Multa ants! Add +75 Base Ant ELO.",
    areward179: "Unlock Tier 5 Ant autobuy, and autobuy Sacrificium ants! Add +100 Base Ant ELO.",
    areward180: "Unlock Tier 6 Ant autobuy, and autobuy Hic and Experientia ants! Add +1% Base Ant ELO.",
    areward181: "Unlock Tier 7 Ant autobuy, and autobuy Praemoenio ants! Add +2% Base Ant ELO.",
    areward182: "Unlock Tier 8 Ant autobuy, and autobuy Scientia and Phylacterium ants! Add +3% Base Ant ELO.",
    areward187: "Gain an ascension gain multiplier based on your score (log10(score) - 7)x for Corruption Score > 100 Million. Gain +1% Offerings per 10,000 ascensions, up to +100%!",
    areward188: "Gain +100 ascension count for all ascensions longer than 10 seconds. Gain +1% Obtainium per 50,000 ascensions, up to +100%!",
    areward189: "Gain 20% of excess time after 10 seconds each Ascension as a linear multiplier to ascensions (max 24 hours). Gain +0.1% Cubes per 250,000 ascensions, up to +200%!",
    areward193: "Gain (log10(Constant+1)/4)% more Cubes on ascension!",
    areward195: "Gain (log10(Constant+1)/4)% more Cubes and Tesseracts on ascension! Multiplicative with the other Ach. bonus.",
    areward196: "Gain (log10(Constant+1)/50)% more Platonic Cubes on ascension!",
    areward197: "You will unlock a stat tracker for ascensions.",
    areward198: "Gain +4% Cubes on ascension!",
    areward199: "Gain +4% Cubes on ascension!",
    areward200: "Gain +4% Cubs on ascension! Did I spell that wrong? You bet I did.",
    areward201: "Gain +3% Cubes on ascension!",
    areward202: "Gain 20% of excess time after 10 seconds each Ascensions as a linear multiplier to ascensions (max 24 hours). Gain +0.1% Tesseracts per 500,000 ascensions, up to +200%!",
    areward204: "You will gain 25% of excess time after 10 seconds each Ascension as a linear multiplier to rewards.",
    areward205: "Gain +4% Tesseracts on ascension!",
    areward206: "Gain +4% Tesseracts on ascension!",
    areward207: "Gain +4% Tesseracts on ascension!",
    areward208: "Gain +3% Tesseracts on ascension!",
    areward209: "Gain 20% of excess time after 10 seconds each Ascensions as a linear multiplier to ascensions (max 24 hours).",
    areward211: "You will gain 25% MORE excess time (Total: 50%) after 10 seconds each Ascension as a linear multiplier to rewards.",
    areward212: "Gain +4% Hypercubes on ascension!",
    areward213: "Gain +4% Hypercubes on ascension!",
    areward214: "Gain +4% Hypercubes on ascension!",
    areward215: "Gain +3% Hypercubes on ascension!",
    areward216: "Gain 20% of excess time after 10 seconds each Ascensions as a linear multiplier to ascensions (max 24 hours). Gain +0.1% Hypercubes per 1,000,000 ascensions, up to +200%!",
    areward218: "You gain gain 50% MORE MORE excess time (Total: 100%) after 10 seconds each Ascension as a linear multiplier to rewards.",
    areward219: "Gain +4% Platonic Cubes on ascension!",
    areward220: "Gain +4% Platonic Cubes on ascension!",
    areward221: "Gain +4% Platonic Cubes on ascension!",
    areward222: "Gain +3% Platonic Cubes on ascension!",
    areward223: "Gain 20% of excess time after 10 seconds each Ascensions as a linear multiplier to ascensions (max 24 hours). Gain +0.1% Platonic Cubes per 1,337,000 ascensions, up to +200%!",
    areward240: "Ascension Cube Gain Multipliers is VERY slightly affected by global speed multipliers: 1 + log10(Speed)/20 (Min: 1.10x, Max: 1.50x)", 
    areward250: "You gain a permanent +60% Obtainium and Offering bonus, with +6% all cube types!",
    areward251: "You gain a permanent +100% Obtainium and Offering bonus, with +10% all cube types!"
}

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
        if (G['prestigePointGain'].gte("1e1000")) {
            achievementaward(39)

        }
        if (G['prestigePointGain'].gte("1e10000")) {
            achievementaward(40)

        }
        if (G['prestigePointGain'].gte("1e77777")) {
            achievementaward(41)

        }
        if (G['prestigePointGain'].gte("1e250000")) {
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
        if (G['transcendPointGain'].gte("1e1500")) {
            achievementaward(47)
        }
        if (G['transcendPointGain'].gte("1e25000")) {
            achievementaward(48)
        }
        if (G['transcendPointGain'].gte("1e100000")) {
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
        if (G['reincarnationPointGain'].gte("1e1500")) {
            achievementaward(54)

        }
        if (G['reincarnationPointGain'].gte("1e5000")) {
            achievementaward(55)

        }
        if (G['reincarnationPointGain'].gte("1e7777")) {
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
    [10, 0.5, 141], [10, 1.5, 142], [10, 2.5, 143], [10, 4.5, 144], [10, 9.5, 145], [10, 19.5, 146], [10, 24.5, 147]
];

const challengeCompletionsNotAuto: [number, string, number][] = [
    [1, '1e1000', 75],
    [2, '1e1000', 76],
    [3, '1e99999', 77],
    [5, '1e120000', 63]
]

export const challengeachievementcheck = (i: number, auto?: boolean) => {
    const generatorcheck = sumContents(player.upgrades.slice(100, 105));
    
    for (const [, bar, ach] of challengeCompletionsBar.filter(([o]) => o === i)) {
        if (player.challengecompletions[i] > bar) {
            achievementaward(ach);
        }
    }

    if ([1, 2, 3, 5].includes(i)) {
        const [, gte, ach] = challengeCompletionsNotAuto[i];
        if (!auto) {
            if (player.coinsThisTranscension.gte(gte) && generatorcheck === 0) {
                achievementaward(ach);
            }
        }
    }

    if (i >= 11 && i <= 14) {
        let challengeArray = [0, 1, 2, 3, 5, 10, 20, 30]
        for (let j = 1; j <= 7; j++) {
            if (player.challengecompletions[i] >= challengeArray[j] && player.achievements[119 + 7 * i + j] < 1) {
                achievementaward(119 + 7 * i + j)
            }
        }
    }
}

// \) \{\n\s+achievementaward\(\d+\)\n\s+\}

/**
 * Requirements for each building achievement
 * @type {(() => boolean)[]}
 */
const buildAchievementReq: (() => boolean)[] = [
    () => player.firstOwnedCoin >= 1 && player.achievements[1] < 0.5,
    () => player.firstOwnedCoin >= 10 && player.achievements[2] < 0.5,
    () => player.firstOwnedCoin >= 100 && player.achievements[3] < 0.5,
    () => player.firstOwnedCoin >= 1000 && player.achievements[4] < 0.5,
    () => player.firstOwnedCoin >= 5000 && player.achievements[5] < 0.5,
    () => player.firstOwnedCoin >= 10000 && player.achievements[6] < 0.5,
    () => player.firstOwnedCoin >= 20000 && player.achievements[7] < 0.5,
    () => player.secondOwnedCoin >= 1 && player.achievements[8] < 0.5,
    () => player.secondOwnedCoin >= 10 && player.achievements[9] < 0.5,
    () => player.secondOwnedCoin >= 100 && player.achievements[10] < 0.5,
    () => player.secondOwnedCoin >= 1000 && player.achievements[11] < 0.5,
    () => player.secondOwnedCoin >= 5000 && player.achievements[12] < 0.5,
    () => player.secondOwnedCoin >= 10000 && player.achievements[13] < 0.5,
    () => player.secondOwnedCoin >= 20000 && player.achievements[14] < 0.5,
    () => player.thirdOwnedCoin >= 1 && player.achievements[15] < 0.5,
    () => player.thirdOwnedCoin >= 10 && player.achievements[16] < 0.5,
    () => player.thirdOwnedCoin >= 100 && player.achievements[17] < 0.5,
    () => player.thirdOwnedCoin >= 1000 && player.achievements[18] < 0.5,
    () => player.thirdOwnedCoin >= 5000 && player.achievements[19] < 0.5,
    () => player.thirdOwnedCoin >= 10000 && player.achievements[20] < 0.5,
    () => player.thirdOwnedCoin >= 20000 && player.achievements[21] < 0.5,
    () => player.fourthOwnedCoin >= 1 && player.achievements[22] < 0.5,
    () => player.fourthOwnedCoin >= 10 && player.achievements[23] < 0.5,
    () => player.fourthOwnedCoin >= 100 && player.achievements[24] < 0.5,
    () => player.fourthOwnedCoin >= 1000 && player.achievements[25] < 0.5,
    () => player.fourthOwnedCoin >= 5000 && player.achievements[26] < 0.5,
    () => player.fourthOwnedCoin >= 10000 && player.achievements[27] < 0.5,
    () => player.fourthOwnedCoin >= 20000 && player.achievements[28] < 0.5,
    () => player.fifthOwnedCoin >= 1 && player.achievements[29] < 0.5,
    () => player.fifthOwnedCoin >= 10 && player.achievements[30] < 0.5,
    () => player.fifthOwnedCoin >= 66 && player.achievements[31] < 0.5,
    () => player.fifthOwnedCoin >= 666 && player.achievements[32] < 0.5,
    () => player.fifthOwnedCoin >= 6666 && player.achievements[33] < 0.5,
    () => player.fifthOwnedCoin >= 17777 && player.achievements[34] < 0.5,
    () => player.fifthOwnedCoin >= 42777 && player.achievements[35] < 0.5,
];

export const buildingAchievementCheck = () => {
    for (const req of buildAchievementReq) {
        if(req()) {
            const idx = buildAchievementReq.indexOf(req) + 1;
            achievementaward(idx);
        }
    }
}

export const ascensionAchievementCheck = (i: number, score = 0) => {
    if (i === 1) {
        let ascendCountArray = [0, 1, 2, 10, 100, 1000, 14142, 141421, 1414213]
        for (let j = 1; j <= 7; j++) {
            if (player.ascensionCount >= ascendCountArray[j] && player.achievements[182 + j] < 1) {
                achievementaward(182 + j)
            }
        }
        if (player.ascensionCount >= ascendCountArray[8] && player.achievements[240] < 1) {
            achievementaward(240)
        }
    }
    if (i === 2) {
        let constantArray = [0, 3.14, 1e6, 4.32e10, 6.9e21, 1.509e33, 1e66, "1.8e308"]
        for (let j = 1; j <= 7; j++) {
            if (player.ascendShards.gte(constantArray[j]) && player.achievements[189 + j] < 1) {
                achievementaward(189 + j)
            }
        }
    }
    if (i === 3) {
        let scoreArray = [0, 1e5, 1e6, 1e7, 1e8, 1e9, 5e9, 2.5e10]
        for (let j = 1; j <= 7; j++) {
            if (score >= scoreArray[j] && player.achievements[224 + j] < 1) {
                achievementaward(224 + j)
            }
        }
    }
}

export const achievementdescriptions = (i: number) => {
    const y = adesc[`adesc${i}` as keyof typeof adesc];
    const z = player.achievements[i] > 0.5 ? ' COMPLETED!' : '';
    const k = areward[`areward${i}` as keyof typeof areward] || '';

    document.getElementById("achievementdescription").textContent = y + z
    document.getElementById("achievementreward").textContent = "Reward: " + achievementpointvalues[i] + " AP. " + achievementpointvalues[i] + " Quarks! " + k
    if (player.achievements[i] > 0.5) {
        document.getElementById("achievementdescription").style.color = "gold"
    } else {
        document.getElementById("achievementdescription").style.color = "white"
    }
}

export const achievementaward = (num: number) => {
    if (player.achievements[num] < 0.5) {
        player.achievementPoints += achievementpointvalues[num]
        player.worlds += achievementpointvalues[num]
        document.getElementById("achievementprogress").textContent = "Achievement Points: " + player.achievementPoints + "/" + totalachievementpoints + " [" + (100 * player.achievementPoints / totalachievementpoints).toPrecision(4) + "%]"
        player.achievements[num] = 1;
        revealStuff()
    }
    document.getElementById(`ach${num}`).style.backgroundColor = "Green";
    Synergism.emit('achievement', num);
}

