import { player, format, formatTimeShort, /*formatTimeShort*/ } from './Synergism';
import { Globals as G } from './Variables';
import Decimal from 'break_infinity.js';
import { CalcCorruptionStuff, calculateAscensionAcceleration, calculateTimeAcceleration} from './Calculate';
import { achievementaward, totalachievementpoints } from './Achievements';
import { displayRuneInformation } from './Runes';
import { visualUpdateBuildings, visualUpdateUpgrades, visualUpdateAchievements, visualUpdateRunes, visualUpdateChallenges, visualUpdateResearch, visualUpdateSettings, visualUpdateShop, visualUpdateAnts, visualUpdateCubes, visualUpdateCorruptions } from './UpdateVisuals';
import { getMaxChallenges } from './Challenges';
import { OneToFive, ZeroToFour, ZeroToSeven } from './types/Synergism';
import { DOMCacheGetOrSet } from './Cache/DOM';

export const revealStuff = () => {
    const example = document.getElementsByClassName("coinunlock1") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < example.length; i++) {
        example[i].style.display = player.unlocks.coinone ? 'block' : 'none';
    }

    const example2 = document.getElementsByClassName("coinunlock2") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < example2.length; i++) {
        example2[i].style.display = player.unlocks.cointwo ? 'block' : 'none';
    }

    const example3 = document.getElementsByClassName("coinunlock3") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < example3.length; i++) {
        example3[i].style.display = player.unlocks.cointhree ? 'block' : 'none';
    }

    const example4 = document.getElementsByClassName("coinunlock4") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < example4.length; i++) {
        example4[i].style.display = player.unlocks.coinfour ? 'block' : 'none';
    }

    const example5 = document.getElementsByClassName("prestigeunlock") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < example5.length; i++) {
        const parent = example5[i].parentElement;
        if (parent.classList.contains('offlineStats'))
            example5[i].style.display = player.unlocks.prestige ? 'flex' : 'none';
        else 
            example5[i].style.display = player.unlocks.prestige ? 'block' : 'none';
    }

    const example6 = document.getElementsByClassName("generationunlock") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < example6.length; i++) {
        example6[i].style.display = player.unlocks.generation ? 'block' : 'none';
    }

    const example7 = document.getElementsByClassName("transcendunlock") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < example7.length; i++) {
        const parent = example7[i].parentElement;
        if (parent.classList.contains('offlineStats'))
            example7[i].style.display = player.unlocks.transcend ? 'flex' : 'none';
        else 
            example7[i].style.display = player.unlocks.transcend ? 'block' : 'none';
    }

    const example8 = document.getElementsByClassName("reincarnationunlock") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < example8.length; i++) {
        const parent = example8[i].parentElement;
        if (parent.classList.contains('offlineStats'))
            example8[i].style.display = player.unlocks.reincarnate ? 'flex' : 'none';
        else 
            example8[i].style.display = player.unlocks.reincarnate ? 'block' : 'none';
    }

    const example9 = document.getElementsByClassName("auto") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < example9.length; i++) {
        example9[i].style.display = "none"
    }

    const example10 = document.getElementsByClassName("reinrow1") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < example10.length; i++) {
        player.researches[47] === 1 ? example10[i].style.display = "block" : example10[i].style.display = "none"
    }

    const example11 = document.getElementsByClassName("reinrow2") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < example11.length; i++) {
        player.researches[48] === 1 ? example11[i].style.display = "block" : example11[i].style.display = "none"
    }

    const example12 = document.getElementsByClassName("reinrow3") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < example12.length; i++) {
        player.researches[49] === 1 ? example12[i].style.display = "block" : example12[i].style.display = "none"
    }

    const example13 = document.getElementsByClassName("reinrow4") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < example13.length; i++) {
        player.researches[50] === 1 ? example13[i].style.display = "block" : example13[i].style.display = "none"
    }

    const example14 = document.getElementsByClassName("chal6") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < example14.length; i++) {
        player.achievements[113] === 1 ? example14[i].style.display = "block" : example14[i].style.display = "none"
    }

    const example15 = document.getElementsByClassName("chal7") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < example15.length; i++) {
        player.achievements[120] === 1 ? example15[i].style.display = "block" : example15[i].style.display = "none"
    }

    const example16 = document.getElementsByClassName("chal7x10") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < example16.length; i++) {
        player.achievements[124] === 1 ? example16[i].style.display = "block" : example16[i].style.display = "none"
    }

    const example17 = document.getElementsByClassName("chal8") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < example17.length; i++) {
        const parent = example17[i].parentElement;
        if (parent.classList.contains('offlineStats'))
            example17[i].style.display = player.achievements[127] === 1 ? 'flex' : 'none';
        else 
            example17[i].style.display = player.achievements[127] === 1 ? 'block' : 'none';
    }

    const example18 = document.getElementsByClassName("chal9") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < example18.length; i++) { 
        player.achievements[134] === 1 ? example18[i].style.display = "block" : example18[i].style.display = "none"
    }

    const example19 = document.getElementsByClassName("chal9x1") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < example19.length; i++) {
        player.highestchallengecompletions[9] > 0 ? example19[i].style.display = "block" : example19[i].style.display = "none"
    }

    const example20 = document.getElementsByClassName("chal10") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < example20.length; i++) {
        player.achievements[141] === 1 ? example20[i].style.display = "block" : example20[i].style.display = "none"
    }

    const example21 = document.getElementsByClassName("ascendunlock") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < example21.length; i++) {
        const parent = example21[i].parentElement;
        if (parent.classList.contains('offlineStats'))
            example21[i].style.display = player.ascensionCount > 0 ? 'flex' : 'none';
        else 
            example21[i].style.display = player.ascensionCount > 0 ? 'block' : 'none';
    }

    const example22 = document.getElementsByClassName("chal11") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < example22.length; i++) {
        player.challengecompletions[11] > 0 ? example22[i].style.display = "block" : example22[i].style.display = "none"
    }

    const example23 = document.getElementsByClassName("chal12") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < example23.length; i++) {
        player.challengecompletions[12] > 0 ? example23[i].style.display = "block" : example23[i].style.display = "none"
    }

    const example24 = document.getElementsByClassName("chal13") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < example24.length; i++) {
        player.challengecompletions[13] > 0 ? example24[i].style.display = "block" : example24[i].style.display = "none"
    }

    const example25 = document.getElementsByClassName("chal14") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < example25.length; i++) {
        player.challengecompletions[14] > 0 ? example25[i].style.display = "block" : example25[i].style.display = "none"
    }

    const example26 = document.getElementsByClassName("ascendunlockib") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < example26.length; i++) {
        example26[i].style.display = player.ascensionCount > 0 ? "inline-block" : "none"
    }

    const example27 = document.getElementsByClassName("prestigeunlockib") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < example27.length; i++) {
        example27[i].style.display = +player.unlocks.prestige > 0 ? "inline-block" : "none"
    }

    const example28 = document.getElementsByClassName("research150") as HTMLCollectionOf<HTMLElement>; 
    for (let i = 0; i < example28.length; i++) {
        example28[i].style.display = player.researches[150] > 0 ? "block" : "none"
    }

    const example29 = document.getElementsByClassName("cubeUpgrade10") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < example29.length; i++) {
        example29[i].style.display = player.cubeUpgrades[10] > 0 ? "flex" : "none"
    }

    const example30 = document.getElementsByClassName("cubeUpgrade19") as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < example30.length; i++) {
        example30[i].style.display = player.cubeUpgrades[19] > 0 ? "block" : "none"
    }

    const example31 = document.getElementsByClassName("sacrificeAnts") as HTMLCollectionOf<HTMLElement>;
    for (const ex of Array.from(example31)) { //Galactic Crumb Achievement 5
        ex.style.display = player.achievements[173] === 1 ? "block" : "none";
    }

    const example32 = document.getElementsByClassName("hepteracts") as HTMLCollectionOf<HTMLElement>;
    for (const ex of Array.from(example32)) { // Ability to use and gain hepteracts //
        ex.style.display = player.challenge15Exponent >= 1e15 ? "block" : "none";
    }

    const hepts = DOMCacheGetOrSet("corruptionHepteracts");
    hepts.style.display = (player.achievements[255] > 0) ? "block" : "none";

    if (player.upgrades[89] === 1) {
        DOMCacheGetOrSet('transcendautotoggle').style.display = 'block';
        DOMCacheGetOrSet('transcendamount').style.display = 'block';
        DOMCacheGetOrSet('autotranscend').style.display = 'block';
    } else {
        DOMCacheGetOrSet('transcendautotoggle').style.display = 'none';
        DOMCacheGetOrSet('transcendamount').style.display = 'none';
        DOMCacheGetOrSet('autotranscend').style.display = 'none';
    }

   player.achievements[38] === 1 ? //Prestige Diamond Achievement 3
        (DOMCacheGetOrSet("rune2area").style.display = "flex", DOMCacheGetOrSet("runeshowpower2").style.display = "flex") :
        (DOMCacheGetOrSet("rune2area").style.display = "none", DOMCacheGetOrSet("runeshowpower2").style.display = "none");

    if (player.achievements[43] === 1) { // Transcend Mythos Achievement 1
        DOMCacheGetOrSet('prestigeautotoggle').style.display = 'block';
        DOMCacheGetOrSet('prestigeamount').style.display = 'block';
        DOMCacheGetOrSet('autoprestige').style.display = 'block';
    } else {
        DOMCacheGetOrSet('prestigeautotoggle').style.display = 'none';
        DOMCacheGetOrSet('prestigeamount').style.display = 'none';
        DOMCacheGetOrSet('autoprestige').style.display = 'none';
    }

    player.achievements[44] === 1 ? //Transcend Mythos Achievement 2
    (DOMCacheGetOrSet("rune3area").style.display = "flex", DOMCacheGetOrSet("runeshowpower3").style.display = "flex") :
    (DOMCacheGetOrSet("rune3area").style.display = "none", DOMCacheGetOrSet("runeshowpower3").style.display = "none");

    player.achievements[102] === 1 ? //Cost+ Challenge Achievement 4
    (DOMCacheGetOrSet("rune4area").style.display = "flex", DOMCacheGetOrSet("runeshowpower4").style.display = "flex") :
    (DOMCacheGetOrSet("rune4area").style.display = "none", DOMCacheGetOrSet("runeshowpower4").style.display = "none");

    player.achievements[119] === 1 ? //Tax+ Challenge Achievement 7
        DOMCacheGetOrSet("talisman1area").style.display = "flex" :
        DOMCacheGetOrSet("talisman1area").style.display = "none";

    player.achievements[126] === 1 ? //No MA Challenge Achievement 7
        DOMCacheGetOrSet("talisman2area").style.display = "flex" :
        DOMCacheGetOrSet("talisman2area").style.display = "none";

    player.achievements[133] === 1 ? //Cost++ Challenge Achievement 7
        DOMCacheGetOrSet("talisman3area").style.display = "flex" :
        DOMCacheGetOrSet("talisman3area").style.display = "none";

    player.achievements[134] === 1 ? //No Runes Challenge Achievement 1
        (DOMCacheGetOrSet("toggleRuneSubTab2").style.display = "block", DOMCacheGetOrSet("toggleRuneSubTab3").style.display = "block") :
        (DOMCacheGetOrSet("toggleRuneSubTab2").style.display = "none", DOMCacheGetOrSet("toggleRuneSubTab3").style.display = "none");

    player.achievements[140] === 1 ? //No Runes Challenge Achievement 7
        DOMCacheGetOrSet("talisman4area").style.display = "flex" :
        DOMCacheGetOrSet("talisman4area").style.display = "none";

    player.achievements[147] === 1 ? //Sadistic Challenge Achievement 7
        DOMCacheGetOrSet("talisman5area").style.display = "flex" :
        DOMCacheGetOrSet("talisman5area").style.display = "none";

    player.achievements[173] === 1 ? //Galactic Crumb Achievement 5
        DOMCacheGetOrSet("sacrificeAnts").style.display = "block" :
        DOMCacheGetOrSet("sacrificeAnts").style.display = "none";

    player.researches[39] > 0 ? //3x9 Research [Crystal Building Power]
        DOMCacheGetOrSet("reincarnationCrystalInfo").style.display = "block" :
        DOMCacheGetOrSet("reincarnationCrystalInfo").style.display = "none";

    player.researches[40] > 0 ? //3x10 Research [Mythos Shard Building Power]
        DOMCacheGetOrSet("reincarnationMythosInfo").style.display = "block" :
        DOMCacheGetOrSet("reincarnationMythosInfo").style.display = "none";

    player.researches[46] > 0 ? //5x6 Research [Auto R.]
        DOMCacheGetOrSet("reincarnateautomation").style.display = "block" :
        DOMCacheGetOrSet("reincarnateautomation").style.display = "none";

    player.researches[82] > 0 ? //2x17 Research [SI Rune Unlock]
    (DOMCacheGetOrSet("rune5area").style.display = "flex", DOMCacheGetOrSet("runeshowpower5").style.display = "flex") :
    (DOMCacheGetOrSet("rune5area").style.display = "none", DOMCacheGetOrSet("runeshowpower5").style.display = "none");

    player.researches[124] > 0 ? //5x24 Research [AutoSac]
        (DOMCacheGetOrSet("antSacrificeButtons").style.display = "block", DOMCacheGetOrSet("autoAntSacrifice").style.display = "block") :
        (DOMCacheGetOrSet("antSacrificeButtons").style.display = "none", DOMCacheGetOrSet("autoAntSacrifice").style.display = "none");

    player.researches[130] > 0 ? //6x5 Research [Talisman Auto Fortify]
        DOMCacheGetOrSet("toggleautofortify").style.display = "block" :
        DOMCacheGetOrSet("toggleautofortify").style.display = "none";

    player.researches[135] > 0 ? //6x10 Research [Talisman Auto Sac]
        DOMCacheGetOrSet("toggleautoenhance").style.display = "block" :
        DOMCacheGetOrSet("toggleautoenhance").style.display = "none";

    for (let z = 1; z <= 5; z++) {
        (player.researches[190] > 0) ? //8x15 Research [Auto Tesseracts]
            DOMCacheGetOrSet("tesseractAutoToggle" + z).style.display = "block" :
            DOMCacheGetOrSet("tesseractAutoToggle" + z).style.display = "none";
    }
    player.researches[190] > 0 ? //8x15 Research [Auto Tesseracts]
        DOMCacheGetOrSet("tesseractautobuytoggle").style.display = "block" :
        DOMCacheGetOrSet("tesseractautobuytoggle").style.display = "none";
    player.researches[190] > 0 ? //8x15 Research [Auto Tesseracts]
        DOMCacheGetOrSet("tesseractAmount").style.display = "block" :
        DOMCacheGetOrSet("tesseractAmount").style.display = "none";
    player.researches[190] > 0 ? //8x15 Research [Auto Tesseracts]
        DOMCacheGetOrSet("autotessbuyeramount").style.display = "block" :
        DOMCacheGetOrSet("autotessbuyeramount").style.display = "none";
    (player.antUpgrades[12-1] > 0 || player.ascensionCount > 0) ? //Ant Talisman Unlock, Mortuus
        DOMCacheGetOrSet("talisman6area").style.display = "flex" :
        DOMCacheGetOrSet("talisman6area").style.display = "none";

    player.shopUpgrades.offeringAuto > 0 ? //Auto Offering Shop Purchase
        DOMCacheGetOrSet("toggleautosacrifice").style.display = "block" :
        DOMCacheGetOrSet("toggleautosacrifice").style.display = "none";

    player.shopUpgrades.obtainiumAuto > 0 ? //Auto Research Shop Purchase
        DOMCacheGetOrSet("toggleautoresearch").style.display = "block" :
        DOMCacheGetOrSet("toggleautoresearch").style.display = "none";

    DOMCacheGetOrSet("toggleautoresearchmode").style.display = player.shopUpgrades.obtainiumAuto > 0 && player.cubeUpgrades[9] > 0 //Auto Research Shop Purchase Mode
        ? 'block'
        : 'none';

    player.shopUpgrades.shopTalisman > 0 ? //Plastic Talisman Shop Purchase
        DOMCacheGetOrSet("talisman7area").style.display = "flex" :
        DOMCacheGetOrSet("talisman7area").style.display = "none";

    player.cubeUpgrades[8] > 0 ?
        DOMCacheGetOrSet('reincarnateAutoUpgrade').style.display = "block" :
        DOMCacheGetOrSet('reincarnateAutoUpgrade').style.display = "none";

    player.shopUpgrades.infiniteAscent ?
        (DOMCacheGetOrSet('rune6area').style.display = 'flex', DOMCacheGetOrSet('runeshowpower6').style.display = "flex") :
        (DOMCacheGetOrSet('rune6area').style.display = 'none', DOMCacheGetOrSet('runeshowpower6').style.display = "none");

    player.platonicUpgrades[20] > 0 ?
        (DOMCacheGetOrSet('rune7area').style.display = 'flex', DOMCacheGetOrSet('runeshowpower7').style.display = "flex") :
        (DOMCacheGetOrSet('rune7area').style.display = 'none', DOMCacheGetOrSet('runeshowpower7').style.display = "none") ;

    DOMCacheGetOrSet("ascensionStats").style.visibility = player.achievements[197] > 0 ? "visible" : "hidden";
    DOMCacheGetOrSet("ascHyperStats").style.display = player.challengecompletions[13] > 0 ? "" : "none";
    DOMCacheGetOrSet("ascPlatonicStats").style.display = player.challengecompletions[14] > 0 ? "" : "none";
    DOMCacheGetOrSet("ascHepteractStats").style.display = player.achievements[255] > 0 ? "" : "none";

    //I'll clean this up later. Note to 2019 Platonic: Fuck you
    // note to 2019 and 2020 Platonic, you're welcome
    // note to 2019 and 2020 and 2021 Platonic, please never base anything on the order of elements ever again

    // These are currently listed in the order they were in when this was converted to use element IDs instead of
    // the ordering of the HTML elements with the class "auto".
    const automationUnlocks: Record<string, boolean> = {
        "toggle1": player.upgrades[81] === 1, // Autobuyer - Coin Buildings - Tier 1 (Worker)
        "toggle2": player.upgrades[82] === 1, // Autobuyer - Coin Buildings - Tier 2 (Investments)
        "toggle3": player.upgrades[83] === 1, // Autobuyer - Coin Buildings - Tier 3 (Printers)
        "toggle4": player.upgrades[84] === 1, // Autobuyer - Coin Buildings - Tier 4 (Coin Mints)
        "toggle5": player.upgrades[85] === 1, // Autobuyer - Coin Buildings - Tier 5 (Alchemies)
        "toggle6": player.upgrades[86] === 1, // Autobuyer - Coin Buildings - Accelerator
        "toggle7": player.upgrades[87] === 1, // Autobuyer - Coin Buildings - Multiplier
        "toggle8": player.upgrades[88] === 1, // Autobuyer - Coin Buildings - Accelerator Boost
        "toggle10": player.achievements[78] === 1, // Autobuyer - Diamond Buildings - Tier 1 (Refineries)
        "toggle11": player.achievements[85] === 1, // Autobuyer - Diamond Buildings - Tier 2 (Coal Plants)
        "toggle12": player.achievements[92] === 1, // Autobuyer - Diamond Buildings - Tier 3 (Coal Rigs)
        "toggle13": player.achievements[99] === 1, // Autobuyer - Diamond Buildings - Tier 4 (Pickaxes)
        "toggle14": player.achievements[106] === 1, // Autobuyer - Diamond Buildings - Tier 5 (Pandora's Boxes)
        "toggle15": player.achievements[43] === 1, // Feature - Diamond Buildings - Auto Prestige
        "toggle16": player.upgrades[94] === 1, // Autobuyer - Mythos Buildings - Tier 1 (Augments)
        "toggle17": player.upgrades[95] === 1, // Autobuyer - Mythos Buildings - Tier 2 (Enchantments)
        "toggle18": player.upgrades[96] === 1, // Autobuyer - Mythos Buildings - Tier 3 (Wizards)
        "toggle19": player.upgrades[97] === 1, // Autobuyer - Mythos Buildings - Tier 4 (Oracles)
        "toggle20": player.upgrades[98] === 1, // Autobuyer - Mythos Buildings - Tier 5 (Grandmasters)
        "toggle21": player.upgrades[89] === 1, // Feature - Mythos Buildings - Auto Transcend
        "toggle22": player.cubeUpgrades[7] === 1, // Autobuyer - Particle Buildings - Tier 1 (Protons)
        "toggle23": player.cubeUpgrades[7] === 1, // Autobuyer - Particle Buildings - Tier 2 (Elements)
        "toggle24": player.cubeUpgrades[7] === 1, // Autobuyer - Particle Buildings - Tier 3 (Pulsars)
        "toggle25": player.cubeUpgrades[7] === 1, // Autobuyer - Particle Buildings - Tier 4 (Quasars)
        "toggle26": player.cubeUpgrades[7] === 1, // Autobuyer - Particle Buildings - Tier 5 (Galactic Nuclei)
        "toggle27": player.researches[46] === 1, // Feature - Particle Buildings - Auto Reincarnate
        "coinAutoUpgrade": player.upgrades[91] === 1, // Feature - Upgrades - Auto Buy Coin Upgrades
        "prestigeAutoUpgrade": player.upgrades[92] === 1, // Feature - Upgrades - Auto Buy Diamond Upgrades
        "transcendAutoUpgrade": player.upgrades[99] === 1, // Feature - Upgrades - Auto Buy Mythos Upgrades
        "generatorsAutoUpgrade": player.upgrades[90] === 1, // Feature - Upgrades - Auto Buy Generator Upgrades
        "toggle9": player.unlocks.prestige, // Feature - Upgrades - Hover to Buy
        "toggle28": player.prestigeCount > 0.5 || player.reincarnationCount > 0.5, // Settings - Confirmations - Prestige
        "toggle29": player.transcendCount > 0.5 || player.reincarnationCount > 0.5,  // Settings - Confirmations - Transcension
        "toggle30": player.reincarnationCount > 0.5, // Settings - Confirmations - Reincarnation
        "toggle31": player.ascensionCount > 0, // Settings - Confirmations - Ascension
        "toggle32": player.achievements[173] > 0, // Settings - Confirmations - Ant Sacrifice
    }

    Object.keys(automationUnlocks).forEach(key => {
        const el = DOMCacheGetOrSet(key);
        if (!el) {
            console.error(`Automation unlock failed to find element with ID '${key}'.`);
            return;
        }

        el.style.display = automationUnlocks[key] ? "block" : "none";
    });
}

export const hideStuff = () => {

    DOMCacheGetOrSet("buildings").style.display = "none"
    DOMCacheGetOrSet("buildingstab").style.backgroundColor = "";
    DOMCacheGetOrSet("upgrades").style.display = "none"
    DOMCacheGetOrSet("upgradestab").style.backgroundColor = ""
    DOMCacheGetOrSet("settings").style.display = "none"

    DOMCacheGetOrSet("statistics").style.display = "none"
    DOMCacheGetOrSet("achievementstab").style.backgroundColor = ""
    DOMCacheGetOrSet("achievementstab").style.color = "white"
    DOMCacheGetOrSet("runes").style.display = "none"
    DOMCacheGetOrSet("runestab").style.backgroundColor = ""
    DOMCacheGetOrSet("challenges").style.display = "none"
    DOMCacheGetOrSet("challengetab").style.backgroundColor = ""
    DOMCacheGetOrSet("research").style.display = "none"
    DOMCacheGetOrSet("researchtab").style.backgroundColor = ""
    DOMCacheGetOrSet("shop").style.display = "none"
    DOMCacheGetOrSet("shoptab").style.backgroundColor = ""
    DOMCacheGetOrSet("ants").style.display = "none"
    DOMCacheGetOrSet("anttab").style.backgroundColor = ""
    DOMCacheGetOrSet("cubetab").style.backgroundColor = ""
    DOMCacheGetOrSet("traitstab").style.backgroundColor = ""
    DOMCacheGetOrSet("cubes").style.display = "none"
    DOMCacheGetOrSet("traits").style.display = "none"
    
    const tab = DOMCacheGetOrSet('settingstab')!;
    tab.style.backgroundColor = '';
    tab.style.border = '1px solid white';

    if (G['currentTab'] === "buildings") {
        DOMCacheGetOrSet("buildingstab").style.backgroundColor = "orange";
        DOMCacheGetOrSet("buildings").style.display = "block"
    }
    if (G['currentTab'] === "upgrades") {
        DOMCacheGetOrSet("upgrades").style.display = "block"
        DOMCacheGetOrSet("upgradestab").style.backgroundColor = "orange"
        DOMCacheGetOrSet("upgradedescription").textContent = "Hover over an upgrade to view details!"
    }
    if (G['currentTab'] === "settings") {
        DOMCacheGetOrSet("settings").style.display = "block"
        const tab = DOMCacheGetOrSet('settingstab')!;
        tab.style.backgroundColor = 'orange';
        tab.style.border = '1px solid gold';
    }
    if (G['currentTab'] === "achievements") {
        DOMCacheGetOrSet("statistics").style.display = "block"
        DOMCacheGetOrSet("achievementstab").style.backgroundColor = "white"
        DOMCacheGetOrSet("achievementstab").style.color = "black"
        DOMCacheGetOrSet("achievementprogress").textContent = "Achievement Points: " + player.achievementPoints + "/" + totalachievementpoints + " [" + (100 * player.achievementPoints / totalachievementpoints).toPrecision(4) + "%]"
    }
    if (G['currentTab'] === "runes") {
        DOMCacheGetOrSet("runes").style.display = "block"
        DOMCacheGetOrSet("runestab").style.backgroundColor = "blue"
        DOMCacheGetOrSet("runeshowlevelup").textContent = "Hey, hover over a rune icon to get details on what each one does and what benefits they're giving you!"
        DOMCacheGetOrSet("researchrunebonus").textContent = "Thanks to researches, your effective levels are increased by " + (100 * G['effectiveLevelMult'] - 100).toPrecision(4) + "%"
        displayRuneInformation(1, false)
        displayRuneInformation(2, false)
        displayRuneInformation(3, false)
        displayRuneInformation(4, false)
        displayRuneInformation(5, false)
        displayRuneInformation(6, false)
        displayRuneInformation(7, false)
    }
    if (G['currentTab'] === "challenges") {
        DOMCacheGetOrSet("challenges").style.display = "block";
        DOMCacheGetOrSet("challengetab").style.backgroundColor = "purple";
    }
    if (G['currentTab'] === "researches") {
        DOMCacheGetOrSet("research").style.display = "block";
        DOMCacheGetOrSet("researchtab").style.backgroundColor = "green";
    }
    if (G['currentTab'] === "shop") {
        DOMCacheGetOrSet("shop").style.display = "block";
        DOMCacheGetOrSet("shoptab").style.backgroundColor = "limegreen";
    }
    if (G['currentTab'] === "ants") {
        DOMCacheGetOrSet("ants").style.display = "block";
        DOMCacheGetOrSet("anttab").style.backgroundColor = "brown";
    }
    if (G['currentTab'] === "cubes") {
        DOMCacheGetOrSet("cubes").style.display = "block";
        DOMCacheGetOrSet("cubetab").style.backgroundColor = "white"
    }
    if (G['currentTab'] === "traits") {
        DOMCacheGetOrSet("traits").style.display = "flex";
        DOMCacheGetOrSet("traitstab").style.backgroundColor = "white";
    }
}

const visualTab: Record<string, () => void> = {
    buildings: visualUpdateBuildings,
    upgrades: visualUpdateUpgrades,
    achievements: visualUpdateAchievements,
    runes: visualUpdateRunes,
    challenges: visualUpdateChallenges,
    research: visualUpdateResearch,
    settings: visualUpdateSettings,
    shop: visualUpdateShop,
    ants: visualUpdateAnts,
    cubes: visualUpdateCubes,
    traits: visualUpdateCorruptions
}

export const htmlInserts = () => {
    // ALWAYS Update these, for they are the most important resources
    DOMCacheGetOrSet('coinDisplay').textContent = format(player.coins)
    DOMCacheGetOrSet('offeringDisplay').textContent = format(player.runeshards)
    DOMCacheGetOrSet('diamondDisplay').textContent = format(player.prestigePoints)
    DOMCacheGetOrSet('mythosDisplay').textContent = format(player.transcendPoints)
    DOMCacheGetOrSet('mythosshardDisplay').textContent = format(player.transcendShards)
    DOMCacheGetOrSet('particlesDisplay').textContent = format(player.reincarnationPoints)
    DOMCacheGetOrSet('quarkDisplay').textContent = format(player.worlds)
    DOMCacheGetOrSet('obtainiumDisplay').textContent = format(player.researchPoints)

    updateAscensionStats()

    visualTab[G['currentTab']]?.();
}

export const buttoncolorchange = () => {
    (player.toggles[15] && player.achievements[43] === 1) ?
        DOMCacheGetOrSet('prestigebtn').style.backgroundColor = "green" :
        DOMCacheGetOrSet('prestigebtn').style.backgroundColor = "#171717";

    (player.toggles[21] && player.upgrades[89] > 0.5 && (player.currentChallenge.transcension === 0)) ?
        DOMCacheGetOrSet('transcendbtn').style.backgroundColor = "green" :
        DOMCacheGetOrSet('transcendbtn').style.backgroundColor = "#171717";

    (player.toggles[27] && player.researches[46] > 0.5 && (player.currentChallenge.transcension === 0 && player.currentChallenge.reincarnation === 0)) ?
        DOMCacheGetOrSet('reincarnatebtn').style.backgroundColor = "green" :
        DOMCacheGetOrSet('reincarnatebtn').style.backgroundColor = "#171717";

    (player.toggles[8] && player.upgrades[88] > 0.5) ?
        DOMCacheGetOrSet('acceleratorboostbtn').style.backgroundColor = "green" :
        DOMCacheGetOrSet('acceleratorboostbtn').style.backgroundColor = "#171717";

    (player.currentChallenge.transcension === 0) ?
        DOMCacheGetOrSet('challengebtn').style.backgroundColor = "#171717" :
        DOMCacheGetOrSet('challengebtn').style.backgroundColor = "purple";

    (player.currentChallenge.reincarnation === 0) ?
        DOMCacheGetOrSet('reincarnatechallengebtn').style.backgroundColor = "#171717" :
        DOMCacheGetOrSet('reincarnatechallengebtn').style.backgroundColor = "purple";

    (player.currentChallenge.ascension === 0) ?
        DOMCacheGetOrSet('ascendChallengeBtn').style.backgroundColor = "#171717" :
        DOMCacheGetOrSet('ascendChallengeBtn').style.backgroundColor = "purple";

    if (G['currentTab'] === "buildings" && G['buildingSubTab'] === "coin") {
        const a = DOMCacheGetOrSet("buycoin1");
        const b = DOMCacheGetOrSet("buycoin2");
        const c = DOMCacheGetOrSet("buycoin3");
        const d = DOMCacheGetOrSet("buycoin4");
        const e = DOMCacheGetOrSet("buycoin5");
        const f = DOMCacheGetOrSet("buyaccelerator");
        const g = DOMCacheGetOrSet("buymultiplier");
        const h = DOMCacheGetOrSet("buyacceleratorboost");
        ((!player.toggles[1] || player.upgrades[81] === 0) && player.coins.gte(player.firstCostCoin))
            ? a.classList.add("buildingPurchaseBtnAvailable")
            : a.classList.remove("buildingPurchaseBtnAvailable");
        ((!player.toggles[2] || player.upgrades[82] === 0) && player.coins.gte(player.secondCostCoin))
            ? b.classList.add("buildingPurchaseBtnAvailable")
            : b.classList.remove("buildingPurchaseBtnAvailable");
        ((!player.toggles[3] || player.upgrades[83] === 0) && player.coins.gte(player.thirdCostCoin))
            ? c.classList.add("buildingPurchaseBtnAvailable")
            : c.classList.remove("buildingPurchaseBtnAvailable");
        ((!player.toggles[4] || player.upgrades[84] === 0) && player.coins.gte(player.fourthCostCoin))
            ? d.classList.add("buildingPurchaseBtnAvailable")
            : d.classList.remove("buildingPurchaseBtnAvailable");
        ((!player.toggles[5] || player.upgrades[85] === 0) && player.coins.gte(player.fifthCostCoin))
            ? e.classList.add("buildingPurchaseBtnAvailable")
            : e.classList.remove("buildingPurchaseBtnAvailable");
        ((!player.toggles[6] || player.upgrades[86] === 0) && player.coins.gte(player.acceleratorCost))
            ? f.classList.add("buildingPurchaseBtnAvailable")
            : f.classList.remove("buildingPurchaseBtnAvailable");
        ((!player.toggles[7] || player.upgrades[87] === 0) && player.coins.gte(player.multiplierCost))
            ? g.classList.add("buildingPurchaseBtnAvailable")
            : g.classList.remove("buildingPurchaseBtnAvailable");
        ((!player.toggles[8] || player.upgrades[88] === 0) && player.prestigePoints.gte(player.acceleratorBoostCost))
            ? h.classList.add("buildingPurchaseBtnAvailable")
            : h.classList.remove("buildingPurchaseBtnAvailable");
    }

    if (G['currentTab'] === "buildings" && G['buildingSubTab'] === "diamond") {
        const a = DOMCacheGetOrSet("buydiamond1");
        const b = DOMCacheGetOrSet("buydiamond2");
        const c = DOMCacheGetOrSet("buydiamond3");
        const d = DOMCacheGetOrSet("buydiamond4");
        const e = DOMCacheGetOrSet("buydiamond5");
        const f = DOMCacheGetOrSet("buycrystalupgrade1");
        const g = DOMCacheGetOrSet("buycrystalupgrade2");
        const h = DOMCacheGetOrSet("buycrystalupgrade3");
        const i = DOMCacheGetOrSet("buycrystalupgrade4");
        const j = DOMCacheGetOrSet("buycrystalupgrade5");
        ((!player.toggles[10] || player.achievements[78] === 0) && player.prestigePoints.gte(player.firstCostDiamonds))
            ? a.classList.add("buildingPurchaseBtnAvailable")
            : a.classList.remove("buildingPurchaseBtnAvailable");
        ((!player.toggles[11] || player.achievements[85] === 0) && player.prestigePoints.gte(player.secondCostDiamonds))
            ? b.classList.add("buildingPurchaseBtnAvailable")
            : b.classList.remove("buildingPurchaseBtnAvailable");
        ((!player.toggles[12] || player.achievements[92] === 0) && player.prestigePoints.gte(player.thirdCostDiamonds))
            ? c.classList.add("buildingPurchaseBtnAvailable")
            : c.classList.remove("buildingPurchaseBtnAvailable");
        ((!player.toggles[13] || player.achievements[99] === 0) && player.prestigePoints.gte(player.fourthCostDiamonds))
            ? d.classList.add("buildingPurchaseBtnAvailable")
            : d.classList.remove("buildingPurchaseBtnAvailable");
        ((!player.toggles[14] || player.achievements[106] === 0) && player.prestigePoints.gte(player.fifthCostDiamonds))
            ? e.classList.add("buildingPurchaseBtnAvailable")
            : e.classList.remove("buildingPurchaseBtnAvailable");
        let k = 0;
        k += Math.floor(G['rune3level'] / 16 * G['effectiveLevelMult']) * 100 / 100
        if (player.upgrades[73] === 1 && player.currentChallenge.reincarnation !== 0) {
            k += 10
        }
        
        (player.achievements[79] < 1 && player.prestigeShards.gte(Decimal.pow(10, (G['crystalUpgradesCost'][0] + G['crystalUpgradeCostIncrement'][0] * Math.floor(Math.pow(player.crystalUpgrades[0] + 0.5 - k, 2) / 2))))) ? f.style.backgroundColor = "purple" : f.style.backgroundColor = "#171717";
        (player.achievements[86] < 1 && player.prestigeShards.gte(Decimal.pow(10, (G['crystalUpgradesCost'][1] + G['crystalUpgradeCostIncrement'][1] * Math.floor(Math.pow(player.crystalUpgrades[1] + 0.5 - k, 2) / 2))))) ? g.style.backgroundColor = "purple" : g.style.backgroundColor = "#171717";
        (player.achievements[93] < 1 && player.prestigeShards.gte(Decimal.pow(10, (G['crystalUpgradesCost'][2] + G['crystalUpgradeCostIncrement'][2] * Math.floor(Math.pow(player.crystalUpgrades[2] + 0.5 - k, 2) / 2))))) ? h.style.backgroundColor = "purple" : h.style.backgroundColor = "#171717";
        (player.achievements[100] < 1 && player.prestigeShards.gte(Decimal.pow(10, (G['crystalUpgradesCost'][3] + G['crystalUpgradeCostIncrement'][3] * Math.floor(Math.pow(player.crystalUpgrades[3] + 0.5 - k, 2) / 2))))) ? i.style.backgroundColor = "purple" : i.style.backgroundColor = "#171717";
        (player.achievements[107] < 1 && player.prestigeShards.gte(Decimal.pow(10, (G['crystalUpgradesCost'][4] + G['crystalUpgradeCostIncrement'][4] * Math.floor(Math.pow(player.crystalUpgrades[4] + 0.5 - k, 2) / 2))))) ? j.style.backgroundColor = "purple" : j.style.backgroundColor = "#171717";
    }

    if (G['currentTab'] === "runes") {
        if (G['runescreen'] === "runes") {
            for (let i = 1; i <= 7; i++) {
                player.runeshards > 0.5
                    ? DOMCacheGetOrSet(`activaterune${i}`).classList.add("runeButtonAvailable")
                    : DOMCacheGetOrSet(`activaterune${i}`).classList.remove("runeButtonAvailable")
            }
        }
        if (G['runescreen'] === "talismans") {
            const a = DOMCacheGetOrSet("buyTalismanItem1");
            const b = DOMCacheGetOrSet("buyTalismanItem2");
            const c = DOMCacheGetOrSet("buyTalismanItem3");
            const d = DOMCacheGetOrSet("buyTalismanItem4");
            const e = DOMCacheGetOrSet("buyTalismanItem5");
            const f = DOMCacheGetOrSet("buyTalismanItem6");
            const g = DOMCacheGetOrSet("buyTalismanItem7");
            const arr = [a, b, c, d, e, f, g];
            for (let i = 0; i < arr.length; i++) {
                (player.researchPoints > G['talismanResourceObtainiumCosts'][i] && player.runeshards > G['talismanResourceOfferingCosts'][i])
                    ? arr[i].classList.add("talisminBtnAvailable")
                    : arr[i].classList.remove("talisminBtnAvailable")
            }
        }
    }

    if (G['currentTab'] === "buildings" && G['buildingSubTab'] === "mythos") {
        for (let i = 1; i <= 5; i++) {
            const toggle = player.toggles[i + 15];
            const mythos = player[`${G['ordinals'][i - 1 as ZeroToFour]}CostMythos` as const];
            (!toggle || !player.upgrades[93 + i]) && player.transcendPoints.gte(mythos) 
                ? DOMCacheGetOrSet(`buymythos${i}`).classList.add("buildingPurchaseBtnAvailable")
                : DOMCacheGetOrSet(`buymythos${i}`).classList.remove("buildingPurchaseBtnAvailable");
        }
    }

    if (G['currentTab'] === "buildings" && G['buildingSubTab'] === "particle") {
        for (let i = 1; i <= 5; i++) {
            const costParticles = player[`${G['ordinals'][i - 1 as ZeroToFour]}CostParticles` as const];
            player.reincarnationPoints.gte(costParticles) 
                ? DOMCacheGetOrSet(`buyparticles${i}`).classList.add("buildingPurchaseBtnAvailable")
                : DOMCacheGetOrSet(`buyparticles${i}`).classList.remove("buildingPurchaseBtnAvailable");
        }
    }

    if (G['currentTab'] === "buildings" && G['buildingSubTab'] === "tesseract") {
        for (let i = 1; i <= 5; i++) {
            const ascendBuilding = player[`ascendBuilding${i as OneToFive}` as const]['cost'];
            Number(player.wowTesseracts) >= ascendBuilding
                ? DOMCacheGetOrSet(`buyTesseracts${i}`).classList.add("buildingPurchaseBtnAvailable")
                : DOMCacheGetOrSet(`buyTesseracts${i}`).classList.remove("buildingPurchaseBtnAvailable");
        }
        for (let i = 1; i <= 8; i++) {
            (player.ascendShards.gte(Decimal.pow(10, player.constantUpgrades[i]).times(G['constUpgradeCosts'][i])))
                ? DOMCacheGetOrSet(`buyConstantUpgrade${i}`).classList.add("constUpgradeAvailable")
                : DOMCacheGetOrSet(`buyConstantUpgrade${i}`).classList.remove("constUpgradeAvailable")
        }
        for (let i = 9; i <= 10; i++) {
            if (player.constantUpgrades[i] >= 1) {
                DOMCacheGetOrSet(`buyConstantUpgrade${i}`).classList.add("constUpgradeSingle")
                DOMCacheGetOrSet(`buyConstantUpgrade${i}`).classList.remove("constUpgradeSingleAvailable")
            } else if (player.ascendShards.gte(Decimal.pow(10, player.constantUpgrades[i]).times(G['constUpgradeCosts'][i]))) {
                DOMCacheGetOrSet(`buyConstantUpgrade${i}`).classList.add("constUpgradeSingleAvailable")
            } else {
                DOMCacheGetOrSet(`buyConstantUpgrade${i}`).classList.remove("constUpgradeSingleAvailable")
                DOMCacheGetOrSet(`buyConstantUpgrade${i}`).classList.remove("constUpgradeSingle")
            }
        }
    }

    if (G['currentTab'] === "ants") {
        (player.reincarnationPoints.gte(player.firstCostAnts)) ? DOMCacheGetOrSet(`anttier1`).classList.add("antTierBtnAvailable") : DOMCacheGetOrSet(`anttier1`).classList.remove("antTierBtnAvailable");
        for (let i = 2; i <= 8; i++) {
            const costAnts = player[`${G['ordinals'][(i - 1) as ZeroToSeven]}CostAnts` as const];
            player.antPoints.gte(costAnts)
                ? DOMCacheGetOrSet(`anttier${i}`).classList.add("antTierBtnAvailable")
                : DOMCacheGetOrSet(`anttier${i}`).classList.remove("antTierBtnAvailable")
        }
        for (let i = 1; i <= 12; i++) {
            player.antPoints.gte(Decimal.pow(G['antUpgradeCostIncreases'][i-1], player.antUpgrades[i-1] * G['extinctionMultiplier'][player.usedCorruptions[10]]).times(G['antUpgradeBaseCost'][i-1]))
                ? DOMCacheGetOrSet(`antUpgrade${i}`).classList.add("antUpgradeBtnAvailable")
                : DOMCacheGetOrSet(`antUpgrade${i}`).classList.remove("antUpgradeBtnAvailable")
        }
    }
}

export const updateChallengeDisplay = () => {
    //Sets background colors on load/challenge initiation
    for (let k = 1; k <= 15; k++) {
        const el = DOMCacheGetOrSet(`challenge${k}`)
        el.classList.remove("challengeActive")
        if (player.currentChallenge.transcension === k) {
            el.classList.add("challengeActive")
        }
        if (player.currentChallenge.reincarnation === k) {
            el.classList.add("challengeActive")
        }
        if (player.currentChallenge.ascension === k) {
            el.classList.add("challengeActive")
        }
    }
    //Corrects HTML on retry challenges button
    if (player.retrychallenges) {
        DOMCacheGetOrSet("retryChallenge").textContent = "Retry Challenges: ON"
    } else {
        DOMCacheGetOrSet("retryChallenge").textContent = "Retry Challenges: OFF"
    }
    for (let k = 1; k <= 15; k++) {
        updateChallengeLevel(k);
    }
}

export const updateChallengeLevel = (k: number) => {
    const el = DOMCacheGetOrSet("challenge" + k + "level");
    const maxChallenges = getMaxChallenges(k);

    el.textContent = `${player.challengecompletions[k]} / ${maxChallenges}`;
}

export const updateAchievementBG = () => {
    //When loading/importing, the game needs to correctly update achievement backgrounds.
    for (let i = 1; i <= 182; i++) { //Initiates by setting all to default
        DOMCacheGetOrSet("ach" + i).style.backgroundColor = "black"
    }
    const fixDisplay1 = document.getElementsByClassName('purpleach') as HTMLCollectionOf<HTMLElement>;
    const fixDisplay2 = document.getElementsByClassName('redach') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < fixDisplay1.length; i++) {
        fixDisplay1[i].style.backgroundColor = "purple" //Sets the appropriate achs to purple
    }
    for (let i = 0; i < fixDisplay2.length; i++) {
        fixDisplay2[i].style.backgroundColor = "maroon" //Sets the appropriate achs to maroon (red)
    }
    for (let i = 1; i < player.achievements.length; i++) {
        if (player.achievements[i] > 0.5 && player.achievements[i] !== undefined) {
            achievementaward(i) //This sets all completed ach to green
        }
    }
}

export const CSSAscend = () => {
    for (let i = 1; i <= 5; i++) {
        const a = DOMCacheGetOrSet("ascendText" + i);
        const b = DOMCacheGetOrSet("ascendText" + (5 + i));
        const c = DOMCacheGetOrSet("tesseracts" + i);
        const d = DOMCacheGetOrSet("buyTesseracts" + i);
        const e = DOMCacheGetOrSet("tesseractAutoToggle" + i);

        a.style.top = (8 + 35 * i) + "px"
        b.style.top = (8 + 35 * i) + "px"
        c.style.top = (23 + 35 * i) + "px"
        d.style.top = (38 + 35 * i) + "px"
        e.style.top = (22 + 35 * i) + "px"

        a.style.left = "13%"
        b.style.left = "56.5%"
        c.style.left = "10%"
    }

    for (let i = 1; i <= 6; i++) {
        const a = DOMCacheGetOrSet("switchCubeSubTab" + i)
        a.style.top = (30 + 35 * i) + "px"
        a.style.left = "5%"
    }
}

export const showCorruptionStatsLoadouts = () => {
    if (player.corruptionShowStats) {
        DOMCacheGetOrSet("corruptionStats").style.display = "block"
        DOMCacheGetOrSet("corruptionLoadouts").style.display = "none"
        DOMCacheGetOrSet("corrStatsBtn").style.borderColor = "dodgerblue"
        DOMCacheGetOrSet("corrLoadoutsBtn").style.borderColor = "white"
    } else {
        DOMCacheGetOrSet("corruptionStats").style.display = "none"
        DOMCacheGetOrSet("corruptionLoadouts").style.display = "block"
        DOMCacheGetOrSet("corrStatsBtn").style.borderColor = "white"
        DOMCacheGetOrSet("corrLoadoutsBtn").style.borderColor = "dodgerblue"
    }
}

const updateAscensionStats = () => {
    const t = player.ascensionCounter;
    const [cubes, tess, hyper, platonic, hepteract] = CalcCorruptionStuff().splice(4);
    const fillers: Record<string, string> = {
        "ascLen": formatTimeShort(player.ascensionCounter),
        "ascCubes": format(cubes * (player.ascStatToggles[1] ? 1 : 1 / t), 2),
        "ascTess": format(tess * (player.ascStatToggles[2] ? 1 : 1 / t), 3),
        "ascHyper": format(hyper * (player.ascStatToggles[3] ? 1 : 1 / t), 4),
        "ascPlatonic": format(platonic * (player.ascStatToggles[4] ? 1 : 1 / t), 5),
        "ascHepteract": format(hepteract * (player.ascStatToggles[5] ? 1 : 1 / t), 3),
        "ascC10": player.challengecompletions[10] + '',
        "ascTimeAccel": `${format(calculateTimeAcceleration(), 3)}x`,
        "ascAscensionTimeAccel": `${format(calculateAscensionAcceleration(), 3)}x`
    }
    for (const key in fillers) {
        DOMCacheGetOrSet(key).textContent = fillers[key];
    }
}

const tabColors: { [key: string]: string } = {
    buildings: 'yellow',
    upgrades: 'yellow',
    achievements: 'white',
    runes: 'cyan',
    challenges: 'plum',
    researches: 'green',
    ants: 'brown',
    cubes: 'purple',
    traits: 'orange',
    settings: 'white',
    shop: 'limegreen'
}

export const changeTabColor = () => {
    const tab = DOMCacheGetOrSet('tabBorder');
    const color = tabColors[G['currentTab']] ?? 'yellow';

    tab.style.backgroundColor = color;
}

const ConfirmCB = (text: string, cb: (value: boolean) => void) => {
    const conf = DOMCacheGetOrSet('confirmationBox');
    const confWrap = DOMCacheGetOrSet('confirmWrapper');
    const popup = document.querySelector<HTMLElement>('#confirm');
    const overlay = document.querySelector<HTMLElement>('#transparentBG');
    const ok = popup.querySelector<HTMLElement>('#ok_confirm');
    const cancel = popup.querySelector<HTMLElement>('#cancel_confirm');
    
    conf.style.display = 'block';
    confWrap.style.display = 'block';
    overlay.style.display = 'block';
    popup.querySelector('p').textContent = text;
    popup.focus();

    // IF you clean up the typing here also clean up PromptCB
    const listener = ({ target }: MouseEvent | { target: HTMLElement }) => {
        const targetEl = target as HTMLButtonElement;
        ok.removeEventListener('click', listener);
        cancel.removeEventListener('click', listener);
        popup.removeEventListener('keyup', kbListener);

        conf.style.display = 'none';
        confWrap.style.display = 'none';
        overlay.style.display = 'none';

        if (targetEl === ok) cb(true);
        else cb(false);
    }

    const kbListener = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            return listener({ target: ok })
        } else if (e.key === 'Escape') {
            return listener({ target: cancel })
        }

        return e.preventDefault();
    }

    ok.addEventListener('click', listener);
    cancel.addEventListener('click', listener);
    popup.addEventListener('keyup', kbListener);
}

const AlertCB = (text: string, cb: (value: undefined) => void) => {
    const conf = DOMCacheGetOrSet('confirmationBox');
    const alertWrap = DOMCacheGetOrSet('alertWrapper');
    const overlay = document.querySelector<HTMLElement>('#transparentBG');
    const popup = document.querySelector<HTMLElement>('#alert');
    const ok = popup.querySelector<HTMLElement>('#ok_alert');
    
    conf.style.display = 'block';
    alertWrap.style.display = 'block';
    overlay.style.display = 'block';
    popup.querySelector('p').textContent = text;
    popup.focus();

    const listener = () => {
        ok.removeEventListener('click', listener);
        popup.removeEventListener('keyup', kbListener);
        
        conf.style.display = 'none';
        alertWrap.style.display = 'none';
        overlay.style.display = 'none';
        cb(undefined);
    }

    const kbListener = (e: KeyboardEvent) => (e.key === 'Enter' || e.key === ' ') && listener();

    ok.addEventListener('click', listener);
    popup.addEventListener('keyup', kbListener);
} 

export const PromptCB = (text: string, cb: (value: string | null) => void) => {
    const conf = DOMCacheGetOrSet('confirmationBox');
    const confWrap = DOMCacheGetOrSet('promptWrapper');
    const overlay = document.querySelector<HTMLElement>('#transparentBG');
    const popup = document.querySelector<HTMLElement>('#prompt');
    const ok = popup.querySelector<HTMLElement>('#ok_prompt');
    const cancel = popup.querySelector<HTMLElement>('#cancel_prompt');
    
    conf.style.display = 'block';
    confWrap.style.display = 'block';
    overlay.style.display = 'block';
    popup.querySelector('label').textContent = text;
    popup.querySelector('input').focus();

    // kinda disgusting types but whatever
    const listener = ({ target }: MouseEvent | { target: HTMLElement }) => {
        const targetEl = target as HTMLButtonElement;
        const el = targetEl.parentNode.querySelector('input');

        ok.removeEventListener('click', listener);
        cancel.removeEventListener('click', listener);
        popup.querySelector('input').removeEventListener('keyup', kbListener);

        conf.style.display = 'none';
        confWrap.style.display = 'none';
        overlay.style.display = 'none';
        
        if (targetEl.id === ok.id) cb(el.value);
        else cb(null); // canceled 

        el.value = el.textContent = '';
    }

    const kbListener = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            return listener({ target: ok })
        } else if (e.key === 'Escape') {
            return listener({ target: cancel })
        }

        return e.preventDefault();
    }

    ok.addEventListener('click', listener);
    cancel.addEventListener('click', listener);
    popup.querySelector('input').addEventListener('keyup', kbListener);
}

const NotificationCB = (text: string, time = 30000, cb: () => void) => {
    const notification = DOMCacheGetOrSet('notification');
    const textNode = document.querySelector<HTMLElement>('#notification > p');
    const x = DOMCacheGetOrSet('notifx');

    textNode.textContent = text;
    notification.style.display = 'block';

    const close = () => {
        textNode.textContent = '';
        notification.style.display = 'none';

        x.removeEventListener('click', close);
        cb();
    }

    x.addEventListener('click', close);
    // automatically close out after <time> ms
    setTimeout(close, time);
}

/*** Promisified version of the AlertCB function. */
export const Alert = (text: string): Promise<undefined> => new Promise(res => AlertCB(text, res));
/*** Promisified version of the PromptCB function. */
export const Prompt = (text: string): Promise<string | null> => new Promise(res => PromptCB(text, res));
/*** Promisified version of the ConfirmCB function */
export const Confirm = (text: string): Promise<boolean> => new Promise(res => ConfirmCB(text, res));
/*** Promisified version of the NotificationCB function */
export const Notification = (text: string, time?: number): Promise<void> => new Promise(res => NotificationCB(text, time, res));

/**
 * Create a popunder under an element.
 * @example
 * popunder(document.querySelector('.currencyContainer'), () => player.coins);
 * @param el Element to create the popunder under
 * @param v function that returns the value to format
 */
/*const popunder = (
    el: HTMLElement, 
    v: () => Parameters<typeof format>[0]
) => {
    const id: 'khafraIsAwesome' = 'khafraIsAwesome' as const; // DO NOT CHANGE!
    el.addEventListener('mouseenter', (ev) => {
        const isOnPage = DOMCacheGetOrSet(id);
        if (isOnPage !== null)
            document.body.removeChild(isOnPage);

        const hover = ev.target as HTMLElement;
        const popunder = document.createElement('div');
        popunder.setAttribute('id', id);
        popunder.textContent =  format(v(), undefined, undefined, false);

        popunder.style.setProperty('position', 'absolute');
        popunder.style.setProperty('text-align', 'center');
        popunder.style.setProperty('height', `${hover.offsetHeight}px`);
        popunder.style.setProperty('width', `${hover.offsetWidth}px`);
        popunder.style.setProperty('top', `${hover.offsetTop + hover.offsetHeight}px`);
        popunder.style.setProperty('left', `${hover.offsetLeft}px`);
        popunder.style.setProperty('background-color', 'red');

        document.body.appendChild(popunder);
    });

    el.addEventListener('mouseleave', () => {
        const isOnPage = DOMCacheGetOrSet(id);
        if (isOnPage !== null)
            document.body.removeChild(isOnPage);
    });
}

Object.defineProperty(window, 'popunder', { value: popunder });*/
