import { toggleAscStatPerSecond, toggleTabs, toggleSubTab, toggleBuyAmount, toggleAutoTesseracts, toggleSettings, toggleautoreset, toggleautobuytesseract, toggleShops, toggleAutoSacrifice, toggleautoenhance, toggleautofortify, updateRuneBlessingBuyAmount, toggleChallenges, toggleAutoChallengesIgnore, toggleAutoChallengeRun, updateAutoChallenge, toggleResearchBuy, toggleAutoResearch, toggleAntMaxBuy, toggleAntAutoSacrifice, toggleMaxBuyCube, toggleCorruptionLevel, toggleAutoAscend, toggleShopConfirmation } from "./Toggles"
import { resetrepeat, updateAutoReset, updateTesseractAutoBuyAmount } from "./Reset"
import { player, resetCheck, saveSynergy } from "./Synergism"
import { boostAccelerator, buyAccelerator, buyMultiplier, buyProducer, buyCrystalUpgrades, buyParticleBuilding, buyTesseractBuilding, buyUpgrades, buyRuneBonusLevels } from "./Buy"
import { crystalupgradedescriptions, constantUpgradeDescriptions, buyConstantUpgrades, upgradedescriptions } from "./Upgrades"
import { buyAutobuyers } from "./Automation"
import { buyGenerator } from "./Generators"
import { achievementdescriptions } from "./Achievements"
import { displayRuneInformation, redeemShards } from "./Runes"
import { toggleTalismanBuy, buyTalismanResources, showTalismanPrices, buyTalismanLevels, buyTalismanEnhance, showRespecInformation, respecTalismanConfirm, respecTalismanCancel, changeTalismanModifier, updateTalismanCostDisplay, showTalismanEffect, showEnhanceTalismanPrices } from "./Talismans"
import { challengeDisplay, toggleRetryChallenges } from "./Challenges"
import { buyResearch, researchDescriptions } from "./Research"
import { antRepeat, sacrificeAnts, buyAntProducers, updateAntDescription, antUpgradeDescription, buyAntUpgrade } from "./Ants"
import { buyCubeUpgrades, cubeUpgradeDesc } from "./Cubes"
import { buyPlatonicUpgrades, createPlatonicDescription } from "./Platonic"
import { corruptionCleanseConfirm, corruptionDisplay } from "./Corruptions"
import { exportSynergism, updateSaveString, promocodes, importSynergism, resetGame } from "./ImportExport"
import { resetHistoryTogglePerSecond } from "./History"
import { resetShopUpgrades, shopDescriptions, buyShopUpgrades, useConsumable, shopData } from "./Shop"
import { Globals as G } from './Variables';
import { changeTabColor } from "./UpdateHTML"
import { hepteractDescriptions, hepteractToOverfluxOrbDescription, tradeHepteractToOverfluxOrb, overfluxPowderDescription, overfluxPowderWarp } from "./Hepteracts"
import { exitOffline, forcedDailyReset, timeWarp } from "./Calculate"
import type { OneToFive, Player } from "./types/Synergism"
import { displayStats } from "./Statistics"
import { testing } from './Config';

/* STYLE GUIDE */
/* 
    1) When adding event handlers please put it in respective tabs, in the correct subcategory. 
    Generally it would be preferred to put it in the lowest spot.
    2) Please put any Mouseover events before Click events, if two event handlers are needed for an element.
    3) Do *NOT* add event handlers to index.html. You may only add them in js/ts files!
    4) Using for loops: be careful about passing arguments. If necessary, please use a currying function (See: Line 80-90)
    5) If you are documenting a new tab or subtab, please comment out the order in which you add event handlers.
    6) It is strongly recommended you only add event handlers in the generateEventHandlers() function, but if you are
    creating new elements through js/ts you may do so outside of this file (E.g. corruptions)

    Platonic and/or Khafra have the right to close PRs that do not conform to this style guide

    If you are editing this script, please update the below time:
    Last Edited: June 10, 2021 3:04 AM UTC-8 
*/

export const generateEventHandlers = () => {
    const ordinals = ['null','first','second','third','fourth','fifth','sixth','seventh','eighth'] as const

    if (testing) {
        const warp = document.createElement('button');
        const dayReset = document.createElement('button');
        warp.textContent = 'Click here to warp time! [TESTING ONLY]';
        warp.setAttribute('style',`width: auto; height: 30px; border: 6px solid gold;`);
        warp.addEventListener('click', () => timeWarp());
        dayReset.textContent = 'Click to force a new day! [TESTING ONLY]';
        dayReset.setAttribute('style',`width: auto; height: 30px; border: 6px solid orange;`);
        dayReset.addEventListener('click', () => forcedDailyReset());

        const consumables = document.getElementById('actualConsumables');
        consumables.appendChild(warp);
        consumables.appendChild(dayReset);
    }
// Offline Button
    document.getElementById('exitOffline').addEventListener('click', () => exitOffline());
// UPPER UI ELEMENTS
    //Prelude: Cube/Tesseract/Hypercube/Platonic display UIs (Onclicks)
    document.getElementById('ascCubeStats').addEventListener('click', () => toggleAscStatPerSecond(1))
    document.getElementById('ascTessStats').addEventListener('click', () => toggleAscStatPerSecond(2))
    document.getElementById('ascHyperStats').addEventListener('click', () => toggleAscStatPerSecond(3))
    document.getElementById('ascPlatonicStats').addEventListener('click', () => toggleAscStatPerSecond(4))
    document.getElementById('ascHepteractStats').addEventListener('click', () => toggleAscStatPerSecond(5))
//Part 1: Reset Tiers
//Onmouseover Events
    document.getElementById('prestigebtn').addEventListener('mouseover', () => resetrepeat("prestige"))
    document.getElementById('transcendbtn').addEventListener('mouseover', () => resetrepeat("transcension"))
    document.getElementById('reincarnatebtn').addEventListener('mouseover', () => resetrepeat("reincarnation"))
    document.getElementById('acceleratorboostbtn').addEventListener('mouseover', () => resetrepeat("acceleratorBoost"))
    document.getElementById('challengebtn').addEventListener('mouseover', () => resetrepeat("transcensionChallenge"))
    document.getElementById('reincarnatechallengebtn').addEventListener('mouseover', () => resetrepeat("reincarnationChallenge"))
    document.getElementById('ascendChallengeBtn').addEventListener('mouseover', () => resetrepeat("ascensionChallenge"))
    document.getElementById('ascendbtn').addEventListener('mouseover', () => resetrepeat("ascension"))
//Onclick Events (this is particularly bad)
    document.getElementById('prestigebtn').addEventListener('click', () => resetCheck('prestige'))
    document.getElementById('transcendbtn').addEventListener('click', () => resetCheck('transcend'))
    document.getElementById('reincarnatebtn').addEventListener('click', () => resetCheck('reincarnate'))
    document.getElementById('acceleratorboostbtn').addEventListener('click', () => boostAccelerator())
    document.getElementById('challengebtn').addEventListener('click', () => resetCheck('challenge',undefined,true))
    document.getElementById('reincarnatechallengebtn').addEventListener('click', () => resetCheck('reincarnationchallenge',undefined,true))
    document.getElementById('ascendChallengeBtn').addEventListener('click', () => resetCheck('ascensionChallenge')) 
    document.getElementById('ascendbtn').addEventListener('click', () => resetCheck('ascend'))
//Part 2: Tabs (sucks)
//Onmouseover Events
    document.getElementById('buildingstab').addEventListener('click', () => toggleTabs('buildings'))
    document.getElementById('upgradestab').addEventListener('click', () => toggleTabs('upgrades'))
    document.getElementById('settingstab').addEventListener('click', () => toggleTabs('settings'))
    document.getElementById('achievementstab').addEventListener('click', () => toggleTabs('achievements'))
    document.getElementById('runestab').addEventListener('click', () => toggleTabs('runes'))
    document.getElementById('challengetab').addEventListener('click', () => toggleTabs('challenges'))
    document.getElementById('researchtab').addEventListener('click', () => toggleTabs('researches'))
    document.getElementById('shoptab').addEventListener('click', () => toggleTabs('shop'))
    document.getElementById('anttab').addEventListener('click', () => toggleTabs('ants'))
    document.getElementById('cubetab').addEventListener('click', () => toggleTabs('cubes'))
    document.getElementById('traitstab').addEventListener('click', () => toggleTabs('traits'))

// BUILDINGS TAB
//Part 1: Upper portion (Subtab toggle)
    const buildingTypes = ['Coin','Diamond','Mythos','Particle','Tesseract']
    for (let index = 0; index < buildingTypes.length; index++) {
        document.getElementById(`switchTo${buildingTypes[index]}Building`).addEventListener('click', () => toggleSubTab(1, index))
    
    }
//Part 2: Building Amount Toggles
    const buildingTypesAlternate = ['coin','crystal','mythos','particle','tesseract','offering'] as const;
    const buildingOrds = ['one','ten','hundred','thousand']
    const buildingOrdsToNum = [1, 10, 100, 1000] as const;
    for (let index = 0; index < buildingOrds.length; index++) {
        for (let index2 = 0; index2 < buildingTypesAlternate.length; index2++) {
            document.getElementById(buildingTypesAlternate[index2]+buildingOrds[index]).addEventListener('click', () => 
                toggleBuyAmount(
                    buildingOrdsToNum[index],
                    buildingTypesAlternate[index2]
                )
            );
        }
    }
//Part 3: Building Purchasers + Upgrades
    // Accelerator, Multiplier, Accelerator Boost
    document.getElementById('buyaccelerator').addEventListener('click', () => buyAccelerator())
    document.getElementById('buymultiplier').addEventListener('click', () => buyMultiplier())
    document.getElementById('buyacceleratorboost').addEventListener('click', () => boostAccelerator())

    // Coin, Diamond and Mythos Buildings
    const buildingTypesAlternate2 = ['coin', 'diamond', 'mythos']
    const buildingTypesAlternate3 = ['Coin', 'Diamonds', 'Mythos'] as const; //TODO: A cleaner way to implement this dumb shit
    for (let index = 0; index < 3; index++){
        for (let index2 = 1; index2 <= 5; index2++) {
            document.getElementById(`buy${buildingTypesAlternate2[index]}${index2}`).addEventListener('click', () => 
                buyProducer(ordinals[index2 as OneToFive], buildingTypesAlternate3[index], index === 0 ? index2 : index2 * (index2+1) / 2))
        }
    }

    // Crystal Upgrades (Mouseover and Onclick)
    for (let index = 1; index <= 5; index++) {
        
        document.getElementById(`buycrystalupgrade${index}`).addEventListener('mouseover', () => crystalupgradedescriptions(index))
        document.getElementById(`buycrystalupgrade${index}`).addEventListener('click', () => buyCrystalUpgrades(index))
        
    }
    
    // Particle Buildings
    for (let index = 0; index < 5; index++) {
        document.getElementById(`buyparticles${index+1}`).addEventListener('click', () => buyParticleBuilding(
            index+1 as OneToFive,
        ));
    }

    // Tesseract Buildings
    for (let index = 0; index < 5; index++) {
        document.getElementById(`buyTesseracts${index+1}`).addEventListener('click', () => buyTesseractBuilding(index+1 as OneToFive))
        document.getElementById(`tesseractAutoToggle${index+1}`).addEventListener('click', () => toggleAutoTesseracts(index+1))
        
    }

    // Constant Upgrades
    for (let index = 0; index < 10; index++) {
        
        document.getElementById(`buyConstantUpgrade${index+1}`).addEventListener('mouseover', () => constantUpgradeDescriptions(index+1))
        document.getElementById(`buyConstantUpgrade${index+1}`).addEventListener('click', () => buyConstantUpgrades(index+1))
        
    }

//Part 4: Toggles
    // I'm just addressing all global toggles here
    for (let index = 0; index < 32; index++) {
        document.getElementById(`toggle${index+1}`).addEventListener('click', () => toggleSettings(index))   
    }
    // Toggles auto reset type (between TIME and AMOUNT)
    document.getElementById("prestigeautotoggle").addEventListener('click', () => toggleautoreset(1))
    document.getElementById("transcendautotoggle").addEventListener('click', () => toggleautoreset(2))
    document.getElementById("reincarnateautotoggle").addEventListener('click', () => toggleautoreset(3))
    document.getElementById("ascensionAutoToggle").addEventListener('click', () => toggleautoreset(4))
    // Toggles auto reset amount required to trigger
    document.getElementById("prestigeamount").addEventListener('blur', () => updateAutoReset(1))
    document.getElementById("transcendamount").addEventListener('blur', () => updateAutoReset(2))
    document.getElementById("reincarnationamount").addEventListener('blur', () => updateAutoReset(3))
    document.getElementById("ascensionAmount").addEventListener('blur', () => updateAutoReset(4))
    document.getElementById("autoAntSacrificeAmount").addEventListener('blur', () => updateAutoReset(5))
    // Tesseract-specific of the above. I don't know why I didn't standardize names here.
    document.getElementById("tesseractautobuytoggle").addEventListener('click', () => toggleautobuytesseract())
    document.getElementById("tesseractAmount").addEventListener('blur', () => updateTesseractAutoBuyAmount())

// UPGRADES TAB
// For all upgrades in the Upgrades Tab (125) count, we have the same mouseover event. So we'll work on those first.
    for (let index = 1; index <= 125; index++) {

        //Onmouseover events ()
        document.getElementById(`upg${index}`).addEventListener('mouseover', () => upgradedescriptions(index));

        console.log('Successfully added "Onmouseover" event to upgrades 1-120!')
    }

// The first 80 upgrades (Coin-Particle upgrade) are annoying since there are four cases based on which resource is needed.
//Note: this part can almost certainly be improved, this was just the quickest implementation
    const resourceTypes = ['coin', 'prestige', 'transcend', 'reincarnation'] as const; //Upgrades 1-20 are coin, 21-40 prestige, 41-60 transcend, 61-80 reincarnation
    //End of shit portion (This is used in the following for loop though)
    for (let index = 1; index <= 80; index++) {
        const resourceType = resourceTypes[Math.floor((index - 1)/20)];

        //Onclick events (Regular upgrades 1-80)
        document.getElementById(`upg${index}`).addEventListener('click', () => buyUpgrades(resourceType,index));

        console.log('Successfully added "Onmouseover" event to upgrades 1-120!')
    }

// Autobuyer (20 count, ID 81-100) and Generator (20 count, ID 101-120) Upgrades have a unique onclick
    for (let index = 1; index <= 20; index++) {

        //Onclick events (Autobuyer upgrades)
        document.getElementById(`upg${index + 80}`).addEventListener('click', () => buyAutobuyers(index));
        console.log('Successfully added "Onclick" event to Autobuyer upgrade!')
    
    }
    for (let index = 1; index <= 20; index++) {

        //Onclick events (Generator Upgrades)
        document.getElementById(`upg${index + 100}`).addEventListener('click', () => buyGenerator(index));
        console.log('Successfully added "Onclick" event to Generator upgrade!')
    
    }

// Upgrades 121-125 are upgrades similar to the first 80.
    for (let index = 1; index <= 5; index++) {

        //Onclick events (Upgrade 121-125)
        document.getElementById(`upg${index + 120}`).addEventListener('click', () => buyUpgrades('coin',index));
        console.log('Successfully added "Onclick" event to Generator upgrade!')
    
    }

// Next part: Shop-specific toggles
    document.getElementById('coinAutoUpgrade').addEventListener('click', () => toggleShops('coin'))
    document.getElementById('prestigeAutoUpgrade').addEventListener('click', () => toggleShops('prestige'))
    document.getElementById('transcendAutoUpgrade').addEventListener('click', () => toggleShops('transcend'))
    document.getElementById('generatorsAutoUpgrade').addEventListener('click', () => toggleShops('generators'))
    document.getElementById('reincarnateAutoUpgrade').addEventListener('click', () => toggleShops('reincarnate'))

// ACHIEVEMENTS TAB
// Easy. There are 280 achievements, 280 mouseovers.
    for (let index = 1; index <= 280; index++) {
    
        //Onmouseover events (Achievement descriptions)
        document.getElementById(`ach${index}`).addEventListener('mouseover', () => achievementdescriptions(index));
    
    }

// RUNES TAB [And all corresponding subtabs]
// Part 0: Upper UI portion
    //Auto sacrifice toggle button
    document.getElementById('toggleautosacrifice').addEventListener('click', () => toggleAutoSacrifice(0))
    //Toggle subtabs of Runes tab
    for (let index = 0; index < 4; index++) {
        
        document.getElementById(`toggleRuneSubTab${index+1}`).addEventListener('click', () => toggleSubTab(4, index))
    
    }

// Part 1: Runes Subtab
    for (let index = 0; index < 7; index++) {
        
        document.getElementById(`rune${index+1}`).addEventListener('mouseover', () => displayRuneInformation(index+1))
        document.getElementById(`rune${index+1}`).addEventListener('click', () => toggleAutoSacrifice(index+1))

        document.getElementById(`activaterune${index+1}`).addEventListener('mouseover', () => displayRuneInformation(index+1))
        document.getElementById(`activaterune${index+1}`).addEventListener('click', () => redeemShards(index+1))
        
    }

// Part 2: Talismans Subtab
    const talismanBuyPercents = [10, 25, 50, 100]
    const talismanBuyPercentsOrd = ['Ten', 'TwentyFive', 'Fifty', 'Hundred']

    for (let index = 0; index < talismanBuyPercents.length; index++) {
    
        document.getElementById(`talisman${talismanBuyPercentsOrd[index]}`).addEventListener('click', () => toggleTalismanBuy(talismanBuyPercents[index]))
    
    }

    document.getElementById('toggleautoenhance').addEventListener('click', () => toggleautoenhance())
    document.getElementById('toggleautofortify').addEventListener('click', () => toggleautofortify())

    //Talisman Fragments/Shards
    const talismanItemNames = ['shard','commonFragment','uncommonFragment','rareFragment','epicFragment','legendaryFragment','mythicalFragment'] as const;
    for (let index = 0; index < talismanItemNames.length; index++) {
        
        document.getElementById(`buyTalismanItem${index+1}`).addEventListener('mouseover', () => updateTalismanCostDisplay(talismanItemNames[index]))
        document.getElementById(`buyTalismanItem${index+1}`).addEventListener('click', () => buyTalismanResources(talismanItemNames[index]))

    }

    for (let index = 0; index < 7; index++) {
        
        document.getElementById(`talisman${index+1}`).addEventListener('click', () => showTalismanEffect(index+1))
        document.getElementById(`leveluptalisman${index+1}`).addEventListener('mouseover', () => showTalismanPrices(index+1))
        document.getElementById(`leveluptalisman${index+1}`).addEventListener('click', () => buyTalismanLevels(index+1))
        document.getElementById(`enhancetalisman${index+1}`).addEventListener('mouseover', () => showEnhanceTalismanPrices(index+1))
        document.getElementById(`enhancetalisman${index+1}`).addEventListener('click', () => buyTalismanEnhance(index+1))
        document.getElementById(`respectalisman${index+1}`).addEventListener('click', () => showRespecInformation(index+1))

    }

    document.getElementById('respecAllTalismans').addEventListener('click', () => showRespecInformation(8))
    document.getElementById('confirmTalismanRespec').addEventListener('click', () => respecTalismanConfirm(G['talismanRespec']))
    document.getElementById('cancelTalismanRespec').addEventListener('click', () => respecTalismanCancel(G['talismanRespec']))

    for (let index = 0; index < 5; index++) {
        
        document.getElementById(`talismanRespecButton${index+1}`).addEventListener('click', () => changeTalismanModifier(index+1))
        
    }
    
//Part 3: Blessings and Spirits
    for (let index = 0; index < 5; index++) {

        document.getElementById(`runeBlessingPurchase${index+1}`).addEventListener('click', () => buyRuneBonusLevels('Blessings', index+1))
        document.getElementById(`runeSpiritPurchase${index+1}`).addEventListener('click', () => buyRuneBonusLevels('Spirits', index+1))

    }
    document.getElementById('buyRuneBlessingInput').addEventListener('blur', () => updateRuneBlessingBuyAmount(1))
    document.getElementById('buyRuneSpiritInput').addEventListener('blur', () => updateRuneBlessingBuyAmount(2))

// CHALLENGES TAB
//Part 1: Challenges
    // Challenge 1-15 buttons
    for (let index = 0; index < 15; index++) {
    
        document.getElementById(`challenge${index+1}`).addEventListener('click', () => challengeDisplay(index+1))
    
    }
//Part 2: QoL Buttons
    // Individual buttons (Start, Retry)
    document.getElementById('startChallenge').addEventListener('click', () => toggleChallenges(G['triggerChallenge'], false))
    document.getElementById('retryChallenge').addEventListener('click', () => toggleRetryChallenges())
    // Autochallenge buttons
    document.getElementById('toggleAutoChallengeIgnore').addEventListener('click', () => toggleAutoChallengesIgnore(G['triggerChallenge']))
    document.getElementById('toggleAutoChallengeStart').addEventListener('click', () => toggleAutoChallengeRun())
    document.getElementById('startAutoChallengeTimerInput').addEventListener('input', () => updateAutoChallenge(1))
    document.getElementById('exitAutoChallengeTimerInput').addEventListener('input', () => updateAutoChallenge(2))
    document.getElementById('enterAutoChallengeTimerInput').addEventListener('input', () => updateAutoChallenge(3))

// RESEARCH TAB
//Part 1: Researches
// There are 200 researches, ideally in rewrite 200 would instead be length of research list/array
    for (let index = 1; index < 200; index++) {

        //Eliminates listeners on index.html 1404-1617
        document.getElementById(`res${index}`).addEventListener('click', () => buyResearch(index));
        document.getElementById(`res${index}`).addEventListener('mouseover', () => researchDescriptions(index));    

        console.log('Successfully added "Onmouseover" and "Onclick" events to researches 1-199!')
    }
    //Research 200 is special, uses more params
    document.getElementById(`res200`).addEventListener('click', () => buyResearch(200, false, 0.01));
    document.getElementById(`res200`).addEventListener('mouseover', () => researchDescriptions(200, false, 0.01));
    console.log('Successfully added "Onmouseover" and "Onclick" events to research 200!')

//Part 2: QoL buttons
    document.getElementById('toggleresearchbuy').addEventListener('click', () => toggleResearchBuy())
    document.getElementById('toggleautoresearch').addEventListener('click', () => toggleAutoResearch())

// ANTHILL TAB
//Part 1: Ant Producers (Tiers 1-8)
const antProducerCostVals = ['null','1e700','3','100','10000','1e12','1e36','1e100','1e300']
for (let index = 1; index <= 8 ; index++) {

    //Onmouse Events
    document.getElementById(`anttier${index}`).addEventListener('mouseover', () => updateAntDescription(index))
    document.getElementById(`anttier${index}`).addEventListener('mouseover', () => antRepeat(index))
    //Onclick Events
    document.getElementById(`anttier${index}`).addEventListener('click', () => buyAntProducers(
        ordinals[index] as Parameters<typeof buyAntProducers>[0],
        antProducerCostVals[index],index)
    );
}
//Part 2: Ant Upgrades (1-12)
const antUpgradeCostVals = ['null', '100', '100', '1000', '1000', '1e5', '1e6', '1e8', '1e11', '1e15', '1e20', '1e40', '1e100']
for (let index = 1; index <= 12; index++) {

    //Onmouse Event
    document.getElementById(`antUpgrade${index}`).addEventListener('mouseover', () => antUpgradeDescription(index))
    //Onclick Event
    document.getElementById(`antUpgrade${index}`).addEventListener('click', () => buyAntUpgrade(antUpgradeCostVals[index], false, index))
    
}
//Part 3: Sacrifice
    document.getElementById('antSacrifice').addEventListener('click', () => sacrificeAnts())

//Part 4: QoL Buttons
    document.getElementById('toggleAntMax').addEventListener('click', () => toggleAntMaxBuy())
    document.getElementById('toggleAutoSacrificeAnt').addEventListener('click', () => toggleAntAutoSacrifice(0))
    document.getElementById('autoSacrificeAntMode').addEventListener('click', () => toggleAntAutoSacrifice(1))

// WOW! Cubes Tab
//Part 0: Subtab UI
    for (let index = 0; index < 7; index++) {
    
        document.getElementById(`switchCubeSubTab${index+1}`).addEventListener('click', () => toggleSubTab(8, index))
        
    }

//Part 1: Cube Upgrades
    // #1-49
    for (let index = 0; index < 49; index++) {
    
        document.getElementById(`cubeUpg${index+1}`).addEventListener('mouseover', () => cubeUpgradeDesc(index+1))
        document.getElementById(`cubeUpg${index+1}`).addEventListener('click', () => buyCubeUpgrades(index+1))
    
    }
    // Cube Upgrade #50
    document.getElementById('cubeUpg50').addEventListener('mouseover', () => cubeUpgradeDesc(50,0.01))
    document.getElementById('cubeUpg50').addEventListener('click', () => buyCubeUpgrades(50,0.01))

    // Toggle
    document.getElementById('toggleCubeBuy').addEventListener('click', () => toggleMaxBuyCube())

//Part 2: Cube Opening Buttons
    //Wow Cubes
    document.getElementById('open1Cube').addEventListener('click', () => player.wowCubes.open(1, false))
    document.getElementById('open20Cube').addEventListener('click', () => player.wowCubes.open(20, false))
    document.getElementById('open1000Cube').addEventListener('click', () => player.wowCubes.open(1000, false))
    document.getElementById('openCustomCube').addEventListener('click', () => player.wowCubes.openCustom());
    document.getElementById('openMostCube').addEventListener('click', () => player.wowCubes.open(1, true))
    //Wow Tesseracts
    document.getElementById('open1Tesseract').addEventListener('click', () => player.wowTesseracts.open(1, false))
    document.getElementById('open20Tesseract').addEventListener('click', () => player.wowTesseracts.open(20, false))
    document.getElementById('open1000Tesseract').addEventListener('click', () => player.wowTesseracts.open(1000, false))
    document.getElementById('openCustomTesseract').addEventListener('click', () => player.wowTesseracts.openCustom());
    document.getElementById('openMostTesseract').addEventListener('click', () => player.wowTesseracts.open(1, true))
    //Wow Hypercubes
    document.getElementById('open1Hypercube').addEventListener('click', () => player.wowHypercubes.open(1, false))
    document.getElementById('open20Hypercube').addEventListener('click', () => player.wowHypercubes.open(20, false))
    document.getElementById('open1000Hypercube').addEventListener('click', () => player.wowHypercubes.open(1000, false))
    document.getElementById('openCustomHypercube').addEventListener('click', () => player.wowHypercubes.openCustom());
    document.getElementById('openMostHypercube').addEventListener('click', () => player.wowHypercubes.open(1, true))
    //Wow Platonic Cubes
    document.getElementById('open1PlatonicCube').addEventListener('click', () => player.wowPlatonicCubes.open(1, false))
    document.getElementById('open40kPlatonicCube').addEventListener('click', () => player.wowPlatonicCubes.open(4e4, false))
    document.getElementById('open1mPlatonicCube').addEventListener('click', () => player.wowPlatonicCubes.open(1e6, false))
    document.getElementById('openCustomPlatonicCube').addEventListener('click', () => player.wowPlatonicCubes.openCustom());
    document.getElementById('openMostPlatonicCube').addEventListener('click', () => player.wowPlatonicCubes.open(1, true))

//Part 3: Platonic Upgrade Section
const platonicUpgrades = document.getElementsByClassName('platonicUpgradeImage')
for (let index = 0; index < platonicUpgrades.length; index++) {

    platonicUpgrades[index].addEventListener('mouseover', () => createPlatonicDescription(index+1))
    platonicUpgrades[index].addEventListener('click', () => buyPlatonicUpgrades(index+1))

}

//Part 4: Hepteract Subtab
document.getElementById('chronosHepteract').addEventListener('mouseover', () => hepteractDescriptions('chronos'))
document.getElementById('hyperrealismHepteract').addEventListener('mouseover', () => hepteractDescriptions('hyperrealism'))
document.getElementById('quarkHepteract').addEventListener('mouseover', () => hepteractDescriptions('quark'))
document.getElementById('challengeHepteract').addEventListener('mouseover', () => hepteractDescriptions('challenge'))
document.getElementById('abyssHepteract').addEventListener('mouseover', () => hepteractDescriptions('abyss'))
document.getElementById('acceleratorHepteract').addEventListener('mouseover', () => hepteractDescriptions('accelerator'))
document.getElementById('acceleratorBoostHepteract').addEventListener('mouseover', () => hepteractDescriptions('acceleratorBoost'))
document.getElementById('multiplierHepteract').addEventListener('mouseover', () => hepteractDescriptions('multiplier'))


document.getElementById('chronosHepteractCraft').addEventListener('click', () => player.hepteractCrafts.chronos.craft())
document.getElementById('hyperrealismHepteractCraft').addEventListener('click', () => player.hepteractCrafts.hyperrealism.craft())
document.getElementById('quarkHepteractCraft').addEventListener('click', () => player.hepteractCrafts.quark.craft())
document.getElementById('challengeHepteractCraft').addEventListener('click', () => player.hepteractCrafts.challenge.craft())
document.getElementById('abyssHepteractCraft').addEventListener('click', () => player.hepteractCrafts.abyss.craft())
document.getElementById('acceleratorHepteractCraft').addEventListener('click', () => player.hepteractCrafts.accelerator.craft())
document.getElementById('acceleratorBoostHepteractCraft').addEventListener('click', () => player.hepteractCrafts.acceleratorBoost.craft())
document.getElementById('multiplierHepteractCraft').addEventListener('click', () => player.hepteractCrafts.multiplier.craft())

document.getElementById('chronosHepteractCap').addEventListener('click', () => player.hepteractCrafts.chronos.expand())
document.getElementById('hyperrealismHepteractCap').addEventListener('click', () => player.hepteractCrafts.hyperrealism.expand())
document.getElementById('quarkHepteractCap').addEventListener('click', () => player.hepteractCrafts.quark.expand())
document.getElementById('challengeHepteractCap').addEventListener('click', () => player.hepteractCrafts.challenge.expand())
document.getElementById('abyssHepteractCap').addEventListener('click', () => player.hepteractCrafts.abyss.expand())
document.getElementById('acceleratorHepteractCap').addEventListener('click', () => player.hepteractCrafts.accelerator.expand())
document.getElementById('acceleratorBoostHepteractCap').addEventListener('click', () => player.hepteractCrafts.acceleratorBoost.expand())
document.getElementById('multiplierHepteractCap').addEventListener('click', () => player.hepteractCrafts.multiplier.expand())

document.getElementById('hepteractToQuark').addEventListener('mouseover', () => hepteractToOverfluxOrbDescription())
document.getElementById('hepteractToQuarkTrade').addEventListener('click', () => tradeHepteractToOverfluxOrb())
document.getElementById('overfluxPowder').addEventListener('mouseover', () => overfluxPowderDescription())
document.getElementById('powderDayWarp').addEventListener('click', () => overfluxPowderWarp())
// CORRUPTION TAB
//Part 0: Subtabs
document.getElementById('corrStatsBtn').addEventListener('click', () => toggleSubTab(9, 0))
document.getElementById('corrLoadoutsBtn').addEventListener('click', () => toggleSubTab(9, 1))

//Part 1: Displays
document.getElementById('corruptionDisplays').addEventListener('click', () => corruptionDisplay(10))
document.getElementById('corruptionCleanse').addEventListener('click', () => corruptionCleanseConfirm())
document.getElementById('corruptionCleanseConfirm').addEventListener('click', () => toggleCorruptionLevel(10, 999))

//Extra toggle
document.getElementById('ascensionAutoEnable').addEventListener('click', () => toggleAutoAscend())

// SETTNGS TAB
// Part 0: Subtabs
const settingSubTabs = Array.from<HTMLElement>(document.querySelectorAll('button[id^="switchSettingSubTab"]'));
for (const subtab of settingSubTabs) {
    subtab.addEventListener('click', () => toggleSubTab(-1, settingSubTabs.indexOf(subtab)));
}

const t = Array.from(document.querySelectorAll<HTMLElement>('#statsForNerds > button'));
for (const s of t) {
    s.addEventListener('click', (e) => displayStats(e.target as HTMLElement));
}

// Various functions
/*Export Files*/ document.getElementById('exportgame').addEventListener('click', () => exportSynergism())
/*Update name of File*/ 
document.getElementById('saveStringInput').addEventListener('blur', e => updateSaveString(<HTMLInputElement>e.target));
/*Save Game Button*/ document.getElementById('savegame').addEventListener('click', () => saveSynergy(true))
/*Delete Save Button*/ document.getElementById('deleteGame').addEventListener('click', () => resetGame())
/*Submit Stats [Note: will eventually become obsolete if kong closes]*/ // document.getElementById('submitstats').addEventListener('click', () => submitStats()) 
/*Promotion Codes*/ document.getElementById('promocodes').addEventListener('click', () => promocodes())
/*Toggle Ascension Per-Second Setting*/ document.getElementById('historyTogglePerSecondButton').addEventListener('click', () => resetHistoryTogglePerSecond())

// SHOP TAB

/*

TODO: Fix this entire tab it's utter shit

*/

// Part 1: The Settings
/*Respec The Upgrades*/ document.getElementById('resetShopUpgrades').addEventListener('click', () => resetShopUpgrades())
/*Toggle Shop Confirmations*/ document.getElementById('toggleConfirmShop').addEventListener('click', () => toggleShopConfirmation())

// Part 2: Potions
/*Offering Potion*/
    document.getElementById('offeringPotions').addEventListener('mouseover', () => shopDescriptions("offeringPotion"))
    document.getElementById('offeringpotionowned').addEventListener('mouseover', () => shopDescriptions("offeringPotion"))
    document.getElementById('buyofferingpotion').addEventListener('mouseover', () => shopDescriptions("offeringPotion"))
    document.getElementById('useofferingpotion').addEventListener('mouseover', () => shopDescriptions("offeringPotion"))
    document.getElementById('buyofferingpotion').addEventListener('click', () => buyShopUpgrades("offeringPotion"))
    document.getElementById('useofferingpotion').addEventListener('click', () => useConsumable("offeringPotion"))
/*Obtainium Potion*/
    document.getElementById('obtainiumPotions').addEventListener('mouseover', () => shopDescriptions("obtainiumPotion"))
    document.getElementById('obtainiumpotionowned').addEventListener('mouseover', () => shopDescriptions("obtainiumPotion"))
    document.getElementById('buyobtainiumpotion').addEventListener('mouseover', () => shopDescriptions("obtainiumPotion"))
    document.getElementById('useobtainiumpotion').addEventListener('mouseover', () => shopDescriptions("obtainiumPotion"))
    document.getElementById('buyobtainiumpotion').addEventListener('click', () => buyShopUpgrades("obtainiumPotion"))
    document.getElementById('useobtainiumpotion').addEventListener('click', () => useConsumable("obtainiumPotion"))
/* Permanent Upgrade Images */
    const shopKeys = Object.keys(player.shopUpgrades) as (keyof Player['shopUpgrades'])[]
    for (const key of shopKeys) {
        const shopItem = shopData[key]
        if (shopItem.type === 'upgrade') {
            console.log(shopItem.description)
            document.getElementById(`${key}`).addEventListener('mouseover', () => shopDescriptions(key))
            document.getElementById(`${key}Level`).addEventListener('mouseover', () => shopDescriptions(key))
            document.getElementById(`${key}Button`).addEventListener('mouseover', () => shopDescriptions(key))
            document.getElementById(`${key}Button`).addEventListener('click', () => buyShopUpgrades(key))
        }
    }

    const tabs = document.querySelectorAll<HTMLElement>('#tabrow > li');
    tabs.forEach(b => b.addEventListener('click', () => changeTabColor()));

    // Import button
    document.getElementById('importfile').addEventListener('change', async e => {
        const element = e.target as HTMLInputElement;
        const file = element.files[0];
        let save = '';
        // https://developer.mozilla.org/en-US/docs/Web/API/Blob/text
        // not available in (bad) browsers like Safari 11
        if (typeof Blob.prototype.text === 'function') {
            save = await file.text();
        } else {
            const reader = new FileReader();
            reader.readAsText(file);
            const text = await new Promise<string>(res => {
                reader.addEventListener('load', () => res(reader.result.toString()));
            });
            
            save = text;
        }

        element.value = null;

        return importSynergism(save);
    });
}
