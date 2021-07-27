import { player, format, formatTimeShort, /*formatTimeShort*/ } from './Synergism';
import { Globals as G } from './Variables';
import Decimal from 'break_infinity.js';
import { CalcCorruptionStuff, calculateAscensionAcceleration, calculateTimeAcceleration} from './Calculate';
import { achievementaward, totalachievementpoints } from './Achievements';
import { displayRuneInformation } from './Runes';
import { visualUpdateBuildings, visualUpdateUpgrades, visualUpdateAchievements, visualUpdateRunes, visualUpdateChallenges, visualUpdateResearch, visualUpdateSettings, visualUpdateShop, visualUpdateAnts, visualUpdateCubes, visualUpdateCorruptions } from './UpdateVisuals';
import { getMaxChallenges } from './Challenges';
import { OneToFive, ZeroToFour, ZeroToSeven } from './types/Synergism';

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

    const hepts = document.getElementById("corruptionHepteracts");
    hepts.style.display = (player.achievements[255] > 0) ? "block" : "none";

    if (player.upgrades[89] === 1) {
        document.getElementById('transcendautotoggle').style.display = 'block';
        document.getElementById('transcendamount').style.display = 'block';
        document.getElementById('autotranscend').style.display = 'block';
    } else {
        document.getElementById('transcendautotoggle').style.display = 'none';
        document.getElementById('transcendamount').style.display = 'none';
        document.getElementById('autotranscend').style.display = 'none';
    }

   player.achievements[38] === 1 ? //Prestige Diamond Achievement 3
        (document.getElementById("rune2area").style.display = "flex", document.getElementById("runeshowpower2").style.display = "flex") :
        (document.getElementById("rune2area").style.display = "none", document.getElementById("runeshowpower2").style.display = "none");

    if (player.achievements[43] === 1) { // Transcend Mythos Achievement 1
        document.getElementById('prestigeautotoggle').style.display = 'block';
        document.getElementById('prestigeamount').style.display = 'block';
        document.getElementById('autoprestige').style.display = 'block';
    } else {
        document.getElementById('prestigeautotoggle').style.display = 'none';
        document.getElementById('prestigeamount').style.display = 'none';
        document.getElementById('autoprestige').style.display = 'none';
    }

    player.achievements[44] === 1 ? //Transcend Mythos Achievement 2
    (document.getElementById("rune3area").style.display = "flex", document.getElementById("runeshowpower3").style.display = "flex") :
    (document.getElementById("rune3area").style.display = "none", document.getElementById("runeshowpower3").style.display = "none");

    player.achievements[102] === 1 ? //Cost+ Challenge Achievement 4
    (document.getElementById("rune4area").style.display = "flex", document.getElementById("runeshowpower4").style.display = "flex") :
    (document.getElementById("rune4area").style.display = "none", document.getElementById("runeshowpower4").style.display = "none");

    player.achievements[119] === 1 ? //Tax+ Challenge Achievement 7
        document.getElementById("talisman1area").style.display = "flex" :
        document.getElementById("talisman1area").style.display = "none";

    player.achievements[126] === 1 ? //No MA Challenge Achievement 7
        document.getElementById("talisman2area").style.display = "flex" :
        document.getElementById("talisman2area").style.display = "none";

    player.achievements[133] === 1 ? //Cost++ Challenge Achievement 7
        document.getElementById("talisman3area").style.display = "flex" :
        document.getElementById("talisman3area").style.display = "none";

    player.achievements[134] === 1 ? //No Runes Challenge Achievement 1
        (document.getElementById("toggleRuneSubTab2").style.display = "block", document.getElementById("toggleRuneSubTab3").style.display = "block") :
        (document.getElementById("toggleRuneSubTab2").style.display = "none", document.getElementById("toggleRuneSubTab3").style.display = "none");

    player.achievements[140] === 1 ? //No Runes Challenge Achievement 7
        document.getElementById("talisman4area").style.display = "flex" :
        document.getElementById("talisman4area").style.display = "none";

    player.achievements[147] === 1 ? //Sadistic Challenge Achievement 7
        document.getElementById("talisman5area").style.display = "flex" :
        document.getElementById("talisman5area").style.display = "none";

    player.achievements[173] === 1 ? //Galactic Crumb Achievement 5
        document.getElementById("sacrificeAnts").style.display = "block" :
        document.getElementById("sacrificeAnts").style.display = "none";

    player.researches[39] > 0 ? //3x9 Research [Crystal Building Power]
        document.getElementById("reincarnationCrystalInfo").style.display = "block" :
        document.getElementById("reincarnationCrystalInfo").style.display = "none";

    player.researches[40] > 0 ? //3x10 Research [Mythos Shard Building Power]
        document.getElementById("reincarnationMythosInfo").style.display = "block" :
        document.getElementById("reincarnationMythosInfo").style.display = "none";

    player.researches[46] > 0 ? //5x6 Research [Auto R.]
        document.getElementById("reincarnateautomation").style.display = "block" :
        document.getElementById("reincarnateautomation").style.display = "none";

    player.researches[82] > 0 ? //2x17 Research [SI Rune Unlock]
    (document.getElementById("rune5area").style.display = "flex", document.getElementById("runeshowpower5").style.display = "flex") :
    (document.getElementById("rune5area").style.display = "none", document.getElementById("runeshowpower5").style.display = "none");

    player.researches[124] > 0 ? //5x24 Research [AutoSac]
        (document.getElementById("antSacrificeButtons").style.display = "block", document.getElementById("autoAntSacrifice").style.display = "block") :
        (document.getElementById("antSacrificeButtons").style.display = "none", document.getElementById("autoAntSacrifice").style.display = "none");

    player.researches[130] > 0 ? //6x5 Research [Talisman Auto Fortify]
        document.getElementById("toggleautofortify").style.display = "block" :
        document.getElementById("toggleautofortify").style.display = "none";

    player.researches[135] > 0 ? //6x10 Research [Talisman Auto Sac]
        document.getElementById("toggleautoenhance").style.display = "block" :
        document.getElementById("toggleautoenhance").style.display = "none";

    for (let z = 1; z <= 5; z++) {
        (player.researches[190] > 0) ? //8x15 Research [Auto Tesseracts]
            document.getElementById("tesseractAutoToggle" + z).style.display = "block" :
            document.getElementById("tesseractAutoToggle" + z).style.display = "none";
    }
    player.researches[190] > 0 ? //8x15 Research [Auto Tesseracts]
        document.getElementById("tesseractautobuytoggle").style.display = "block" :
        document.getElementById("tesseractautobuytoggle").style.display = "none";
    player.researches[190] > 0 ? //8x15 Research [Auto Tesseracts]
        document.getElementById("tesseractAmount").style.display = "block" :
        document.getElementById("tesseractAmount").style.display = "none";
    player.researches[190] > 0 ? //8x15 Research [Auto Tesseracts]
        document.getElementById("autotessbuyeramount").style.display = "block" :
        document.getElementById("autotessbuyeramount").style.display = "none";
    (player.antUpgrades[12-1] > 0 || player.ascensionCount > 0) ? //Ant Talisman Unlock, Mortuus
        document.getElementById("talisman6area").style.display = "flex" :
        document.getElementById("talisman6area").style.display = "none";

    player.shopUpgrades.offeringAuto > 0 ? //Auto Offering Shop Purchase
        document.getElementById("toggleautosacrifice").style.display = "block" :
        document.getElementById("toggleautosacrifice").style.display = "none";

    player.shopUpgrades.obtainiumAuto > 0 ? //Auto Research Shop Purchase
        document.getElementById("toggleautoresearch").style.display = "block" :
        document.getElementById("toggleautoresearch").style.display = "none";

    document.getElementById("toggleautoresearchmode").style.display = player.shopUpgrades.obtainiumAuto > 0 && player.cubeUpgrades[9] > 0 //Auto Research Shop Purchase Mode
        ? 'block'
        : 'none';

    player.shopUpgrades.shopTalisman > 0 ? //Plastic Talisman Shop Purchase
        document.getElementById("talisman7area").style.display = "flex" :
        document.getElementById("talisman7area").style.display = "none";

    player.cubeUpgrades[8] > 0 ?
        document.getElementById('reincarnateAutoUpgrade').style.display = "block" :
        document.getElementById('reincarnateAutoUpgrade').style.display = "none";

    player.shopUpgrades.infiniteAscent ?
        (document.getElementById('rune6area').style.display = 'flex', document.getElementById('runeshowpower6').style.display = "flex") :
        (document.getElementById('rune6area').style.display = 'none', document.getElementById('runeshowpower6').style.display = "none");

    player.platonicUpgrades[20] > 0 ?
        (document.getElementById('rune7area').style.display = 'flex', document.getElementById('runeshowpower7').style.display = "flex") :
        (document.getElementById('rune7area').style.display = 'none', document.getElementById('runeshowpower7').style.display = "none") ;

    document.getElementById("ascensionStats").style.visibility = player.achievements[197] > 0 ? "visible" : "hidden";
    document.getElementById("ascHyperStats").style.display = player.challengecompletions[13] > 0 ? "" : "none";
    document.getElementById("ascPlatonicStats").style.display = player.challengecompletions[14] > 0 ? "" : "none";
    document.getElementById("ascHepteractStats").style.display = player.achievements[255] > 0 ? "" : "none";

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
        const el = document.getElementById(key);
        if (!el) {
            console.error(`Automation unlock failed to find element with ID '${key}'.`);
            return;
        }

        el.style.display = automationUnlocks[key] ? "block" : "none";
    });
}

export const hideStuff = () => {

    document.getElementById("buildings").style.display = "none"
    document.getElementById("buildingstab").style.backgroundColor = "";
    document.getElementById("upgrades").style.display = "none"
    document.getElementById("upgradestab").style.backgroundColor = ""
    document.getElementById("settings").style.display = "none"

    document.getElementById("statistics").style.display = "none"
    document.getElementById("achievementstab").style.backgroundColor = ""
    document.getElementById("achievementstab").style.color = "white"
    document.getElementById("runes").style.display = "none"
    document.getElementById("runestab").style.backgroundColor = ""
    document.getElementById("challenges").style.display = "none"
    document.getElementById("challengetab").style.backgroundColor = ""
    document.getElementById("research").style.display = "none"
    document.getElementById("researchtab").style.backgroundColor = ""
    document.getElementById("shop").style.display = "none"
    document.getElementById("shoptab").style.backgroundColor = ""
    document.getElementById("ants").style.display = "none"
    document.getElementById("anttab").style.backgroundColor = ""
    document.getElementById("cubetab").style.backgroundColor = ""
    document.getElementById("traitstab").style.backgroundColor = ""
    document.getElementById("cubes").style.display = "none"
    document.getElementById("traits").style.display = "none"
    
    const tab = document.getElementById('settingstab')!;
    tab.style.backgroundColor = '';
    tab.style.border = '1px solid white';

    if (G['currentTab'] === "buildings") {
        document.getElementById("buildingstab").style.backgroundColor = "orange";
        document.getElementById("buildings").style.display = "block"
    }
    if (G['currentTab'] === "upgrades") {
        document.getElementById("upgrades").style.display = "block"
        document.getElementById("upgradestab").style.backgroundColor = "orange"
        document.getElementById("upgradedescription").textContent = "Hover over an upgrade to view details!"
    }
    if (G['currentTab'] === "settings") {
        document.getElementById("settings").style.display = "block"
        const tab = document.getElementById('settingstab')!;
        tab.style.backgroundColor = 'orange';
        tab.style.border = '1px solid gold';
    }
    if (G['currentTab'] === "achievements") {
        document.getElementById("statistics").style.display = "block"
        document.getElementById("achievementstab").style.backgroundColor = "white"
        document.getElementById("achievementstab").style.color = "black"
        document.getElementById("achievementprogress").textContent = "Achievement Points: " + player.achievementPoints + "/" + totalachievementpoints + " [" + (100 * player.achievementPoints / totalachievementpoints).toPrecision(4) + "%]"
    }
    if (G['currentTab'] === "runes") {
        document.getElementById("runes").style.display = "block"
        document.getElementById("runestab").style.backgroundColor = "blue"
        document.getElementById("runeshowlevelup").textContent = "Hey, hover over a rune icon to get details on what each one does and what benefits they're giving you!"
        document.getElementById("researchrunebonus").textContent = "Thanks to researches, your effective levels are increased by " + (100 * G['effectiveLevelMult'] - 100).toPrecision(4) + "%"
        displayRuneInformation(1, false)
        displayRuneInformation(2, false)
        displayRuneInformation(3, false)
        displayRuneInformation(4, false)
        displayRuneInformation(5, false)
        displayRuneInformation(6, false)
        displayRuneInformation(7, false)
    }
    if (G['currentTab'] === "challenges") {
        document.getElementById("challenges").style.display = "block";
        document.getElementById("challengetab").style.backgroundColor = "purple";
    }
    if (G['currentTab'] === "researches") {
        document.getElementById("research").style.display = "block";
        document.getElementById("researchtab").style.backgroundColor = "green";
    }
    if (G['currentTab'] === "shop") {
        document.getElementById("shop").style.display = "block";
        document.getElementById("shoptab").style.backgroundColor = "limegreen";
    }
    if (G['currentTab'] === "ants") {
        document.getElementById("ants").style.display = "block";
        document.getElementById("anttab").style.backgroundColor = "brown";
    }
    if (G['currentTab'] === "cubes") {
        document.getElementById("cubes").style.display = "block";
        document.getElementById("cubetab").style.backgroundColor = "white"
    }
    if (G['currentTab'] === "traits") {
        document.getElementById("traits").style.display = "flex";
        document.getElementById("traitstab").style.backgroundColor = "white";
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
    document.getElementById("coinDisplay").textContent = format(player.coins)
    document.getElementById("offeringDisplay").textContent = format(player.runeshards)
    document.getElementById("diamondDisplay").textContent = format(player.prestigePoints)
    document.getElementById("mythosDisplay").textContent = format(player.transcendPoints)
    document.getElementById("mythosshardDisplay").textContent = format(player.transcendShards)
    document.getElementById("particlesDisplay").textContent = format(player.reincarnationPoints)
    document.getElementById("quarkDisplay").textContent = format(player.worlds)
    document.getElementById("obtainiumDisplay").textContent = format(player.researchPoints)

    updateAscensionStats()

    visualTab[G['currentTab']]?.();
}

export const buttoncolorchange = () => {
    (player.toggles[15] && player.achievements[43] === 1) ?
        document.getElementById('prestigebtn').style.backgroundColor = "green" :
        document.getElementById('prestigebtn').style.backgroundColor = "#171717";

    (player.toggles[21] && player.upgrades[89] > 0.5 && (player.currentChallenge.transcension === 0)) ?
        document.getElementById('transcendbtn').style.backgroundColor = "green" :
        document.getElementById('transcendbtn').style.backgroundColor = "#171717";

    (player.toggles[27] && player.researches[46] > 0.5 && (player.currentChallenge.transcension === 0 && player.currentChallenge.reincarnation === 0)) ?
        document.getElementById('reincarnatebtn').style.backgroundColor = "green" :
        document.getElementById('reincarnatebtn').style.backgroundColor = "#171717";

    (player.toggles[8] && player.upgrades[88] > 0.5) ?
        document.getElementById('acceleratorboostbtn').style.backgroundColor = "green" :
        document.getElementById('acceleratorboostbtn').style.backgroundColor = "#171717";

    (player.currentChallenge.transcension === 0) ?
        document.getElementById('challengebtn').style.backgroundColor = "#171717" :
        document.getElementById('challengebtn').style.backgroundColor = "purple";

    (player.currentChallenge.reincarnation === 0) ?
        document.getElementById('reincarnatechallengebtn').style.backgroundColor = "#171717" :
        document.getElementById('reincarnatechallengebtn').style.backgroundColor = "purple";

    (player.currentChallenge.ascension === 0) ?
        document.getElementById('ascendChallengeBtn').style.backgroundColor = "#171717" :
        document.getElementById('ascendChallengeBtn').style.backgroundColor = "purple";

    if (G['currentTab'] === "buildings" && G['buildingSubTab'] === "coin") {
        const a = document.getElementById("buycoin1");
        const b = document.getElementById("buycoin2");
        const c = document.getElementById("buycoin3");
        const d = document.getElementById("buycoin4");
        const e = document.getElementById("buycoin5");
        const f = document.getElementById("buyaccelerator");
        const g = document.getElementById("buymultiplier");
        const h = document.getElementById("buyacceleratorboost");
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
        const a = document.getElementById("buydiamond1");
        const b = document.getElementById("buydiamond2");
        const c = document.getElementById("buydiamond3");
        const d = document.getElementById("buydiamond4");
        const e = document.getElementById("buydiamond5");
        const f = document.getElementById("buycrystalupgrade1");
        const g = document.getElementById("buycrystalupgrade2");
        const h = document.getElementById("buycrystalupgrade3");
        const i = document.getElementById("buycrystalupgrade4");
        const j = document.getElementById("buycrystalupgrade5");
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
                    ? document.getElementById(`activaterune${i}`).classList.add("runeButtonAvailable")
                    : document.getElementById(`activaterune${i}`).classList.remove("runeButtonAvailable")
            }
        }
        if (G['runescreen'] === "talismans") {
            const a = document.getElementById("buyTalismanItem1");
            const b = document.getElementById("buyTalismanItem2");
            const c = document.getElementById("buyTalismanItem3");
            const d = document.getElementById("buyTalismanItem4");
            const e = document.getElementById("buyTalismanItem5");
            const f = document.getElementById("buyTalismanItem6");
            const g = document.getElementById("buyTalismanItem7");
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
                ? document.getElementById(`buymythos${i}`).classList.add("buildingPurchaseBtnAvailable")
                : document.getElementById(`buymythos${i}`).classList.remove("buildingPurchaseBtnAvailable");
        }
    }

    if (G['currentTab'] === "buildings" && G['buildingSubTab'] === "particle") {
        for (let i = 1; i <= 5; i++) {
            const costParticles = player[`${G['ordinals'][i - 1 as ZeroToFour]}CostParticles` as const];
            player.reincarnationPoints.gte(costParticles) 
                ? document.getElementById(`buyparticles${i}`).classList.add("buildingPurchaseBtnAvailable")
                : document.getElementById(`buyparticles${i}`).classList.remove("buildingPurchaseBtnAvailable");
        }
    }

    if (G['currentTab'] === "buildings" && G['buildingSubTab'] === "tesseract") {
        for (let i = 1; i <= 5; i++) {
            const ascendBuilding = player[`ascendBuilding${i as OneToFive}` as const]['cost'];
            Number(player.wowTesseracts) >= ascendBuilding
                ? document.getElementById(`buyTesseracts${i}`).classList.add("buildingPurchaseBtnAvailable")
                : document.getElementById(`buyTesseracts${i}`).classList.remove("buildingPurchaseBtnAvailable");
        }
        for (let i = 1; i <= 8; i++) {
            (player.ascendShards.gte(Decimal.pow(10, player.constantUpgrades[i]).times(G['constUpgradeCosts'][i])))
                ? document.getElementById(`buyConstantUpgrade${i}`).classList.add("constUpgradeAvailable")
                : document.getElementById(`buyConstantUpgrade${i}`).classList.remove("constUpgradeAvailable")
        }
        for (let i = 9; i <= 10; i++) {
            if (player.constantUpgrades[i] >= 1) {
                document.getElementById(`buyConstantUpgrade${i}`).classList.add("constUpgradeSingle")
                document.getElementById(`buyConstantUpgrade${i}`).classList.remove("constUpgradeSingleAvailable")
            } else if (player.ascendShards.gte(Decimal.pow(10, player.constantUpgrades[i]).times(G['constUpgradeCosts'][i]))) {
                document.getElementById(`buyConstantUpgrade${i}`).classList.add("constUpgradeSingleAvailable")
            } else {
                document.getElementById(`buyConstantUpgrade${i}`).classList.remove("constUpgradeSingleAvailable")
                document.getElementById(`buyConstantUpgrade${i}`).classList.remove("constUpgradeSingle")
            }
        }
    }

    if (G['currentTab'] === "ants") {
        (player.reincarnationPoints.gte(player.firstCostAnts)) ? document.getElementById(`anttier1`).classList.add("antTierBtnAvailable") : document.getElementById(`anttier1`).classList.remove("antTierBtnAvailable");
        for (let i = 2; i <= 8; i++) {
            const costAnts = player[`${G['ordinals'][(i - 1) as ZeroToSeven]}CostAnts` as const];
            player.antPoints.gte(costAnts)
                ? document.getElementById(`anttier${i}`).classList.add("antTierBtnAvailable")
                : document.getElementById(`anttier${i}`).classList.remove("antTierBtnAvailable")
        }
        for (let i = 1; i <= 12; i++) {
            player.antPoints.gte(Decimal.pow(G['antUpgradeCostIncreases'][i-1], player.antUpgrades[i-1] * G['extinctionMultiplier'][player.usedCorruptions[10]]).times(G['antUpgradeBaseCost'][i-1]))
                ? document.getElementById(`antUpgrade${i}`).classList.add("antUpgradeBtnAvailable")
                : document.getElementById(`antUpgrade${i}`).classList.remove("antUpgradeBtnAvailable")
        }
    }
}

export const updateChallengeDisplay = () => {
    //Sets background colors on load/challenge initiation
    for (let k = 1; k <= 15; k++) {
        const el = document.getElementById(`challenge${k}`)
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
        document.getElementById("retryChallenge").textContent = "Retry Challenges: ON"
    } else {
        document.getElementById("retryChallenge").textContent = "Retry Challenges: OFF"
    }
    for (let k = 1; k <= 15; k++) {
        updateChallengeLevel(k);
    }
}

export const updateChallengeLevel = (k: number) => {
    const el = document.getElementById("challenge" + k + "level");
    const maxChallenges = getMaxChallenges(k);

    el.textContent = `${player.challengecompletions[k]} / ${maxChallenges}`;
}

export const updateAchievementBG = () => {
    //When loading/importing, the game needs to correctly update achievement backgrounds.
    for (let i = 1; i <= 182; i++) { //Initiates by setting all to default
        document.getElementById("ach" + i).style.backgroundColor = "black"
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
        const a = document.getElementById("ascendText" + i);
        const b = document.getElementById("ascendText" + (5 + i));
        const c = document.getElementById("tesseracts" + i);
        const d = document.getElementById("buyTesseracts" + i);
        const e = document.getElementById("tesseractAutoToggle" + i);

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
        const a = document.getElementById("switchCubeSubTab" + i)
        a.style.top = (30 + 35 * i) + "px"
        a.style.left = "5%"
    }
}

export const showCorruptionStatsLoadouts = () => {
    if (player.corruptionShowStats) {
        document.getElementById("corruptionStats").style.display = "block"
        document.getElementById("corruptionLoadouts").style.display = "none"
        document.getElementById("corrStatsBtn").style.borderColor = "dodgerblue"
        document.getElementById("corrLoadoutsBtn").style.borderColor = "white"
    } else {
        document.getElementById("corruptionStats").style.display = "none"
        document.getElementById("corruptionLoadouts").style.display = "block"
        document.getElementById("corrStatsBtn").style.borderColor = "white"
        document.getElementById("corrLoadoutsBtn").style.borderColor = "dodgerblue"
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
        document.getElementById(key).textContent = fillers[key];
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
    const tab = document.getElementById('tabBorder');
    const color = tabColors[G['currentTab']] ?? 'yellow';

    tab.style.backgroundColor = color;
}

const ConfirmCB = (text: string, cb: (value: boolean) => void) => {
    const conf = document.getElementById('confirmationBox');
    const confWrap = document.getElementById('confirmWrapper');
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
    const conf = document.getElementById('confirmationBox');
    const alertWrap = document.getElementById('alertWrapper');
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
    const conf = document.getElementById('confirmationBox');
    const confWrap = document.getElementById('promptWrapper');
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
    const notification = document.getElementById('notification');
    const textNode = document.querySelector<HTMLElement>('#notification > p');
    const x = document.getElementById('notifx');

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
        const isOnPage = document.getElementById(id);
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
        const isOnPage = document.getElementById(id);
        if (isOnPage !== null)
            document.body.removeChild(isOnPage);
    });
}

Object.defineProperty(window, 'popunder', { value: popunder });*/
