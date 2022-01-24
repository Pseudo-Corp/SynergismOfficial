import { toggleAscStatPerSecond, toggleTabs, toggleSubTab, toggleBuyAmount, toggleAutoTesseracts, toggleSettings, toggleautoreset, toggleautobuytesseract, toggleShops, toggleAutoSacrifice, toggleautoenhance, toggleautofortify, updateRuneBlessingBuyAmount, toggleChallenges, toggleAutoChallengesIgnore, toggleAutoChallengeRun, updateAutoChallenge, toggleResearchBuy, toggleAutoResearch, toggleAntMaxBuy, toggleAntAutoSacrifice, toggleMaxBuyCube, toggleCorruptionLevel, toggleAutoAscend, toggleShopConfirmation, toggleAutoResearchMode, toggleBuyMaxShop } from "./Toggles"
import { resetrepeat, updateAutoReset, updateTesseractAutoBuyAmount } from "./Reset"
import { player, resetCheck, saveSynergy } from "./Synergism"
import { boostAccelerator, buyAccelerator, buyMultiplier, buyProducer, buyCrystalUpgrades, buyParticleBuilding, buyTesseractBuilding, buyUpgrades, buyRuneBonusLevels } from "./Buy"
import { crystalupgradedescriptions, constantUpgradeDescriptions, buyConstantUpgrades, upgradedescriptions } from "./Upgrades"
import { buyAutobuyers } from "./Automation"
import { buyGenerator } from "./Generators"
import { achievementdescriptions, achievementpointvalues } from "./Achievements"
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
import { resetShopUpgrades, shopDescriptions, buyShopUpgrades, useConsumable, shopData, shopUpgradeTypes } from "./Shop"
import { Globals as G, Upgrade } from './Variables';
import { changeTabColor } from "./UpdateHTML"
import { hepteractDescriptions, hepteractToOverfluxOrbDescription, tradeHepteractToOverfluxOrb, overfluxPowderDescription, overfluxPowderWarp } from "./Hepteracts"
import { exitOffline, forcedDailyReset, timeWarp } from "./Calculate"
import type { OneToFive, Player } from "./types/Synergism"
import { displayStats } from "./Statistics"
import { testing } from './Config';
import { DOMCacheGetOrSet } from "./Cache/DOM"
import { toggleTheme } from "./Themes"
import { buyGoldenQuarks } from "./singularity"

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

/* eslint-disable @typescript-eslint/no-misused-promises */

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

        const consumables = DOMCacheGetOrSet('actualConsumables');
        consumables.appendChild(warp);
        consumables.appendChild(dayReset);
    }
// Offline Button
    DOMCacheGetOrSet('exitOffline').addEventListener('click', () => exitOffline());
// UPPER UI ELEMENTS
    //Prelude: Cube/Tesseract/Hypercube/Platonic display UIs (Onclicks)
    DOMCacheGetOrSet('ascCubeStats').addEventListener('click', () => toggleAscStatPerSecond(1))
    DOMCacheGetOrSet('ascTessStats').addEventListener('click', () => toggleAscStatPerSecond(2))
    DOMCacheGetOrSet('ascHyperStats').addEventListener('click', () => toggleAscStatPerSecond(3))
    DOMCacheGetOrSet('ascPlatonicStats').addEventListener('click', () => toggleAscStatPerSecond(4))
    DOMCacheGetOrSet('ascHepteractStats').addEventListener('click', () => toggleAscStatPerSecond(5))
//Part 1: Reset Tiers
//Onmouseover Events
    DOMCacheGetOrSet('prestigebtn').addEventListener('mouseover', () => resetrepeat("prestige"))
    DOMCacheGetOrSet('transcendbtn').addEventListener('mouseover', () => resetrepeat("transcension"))
    DOMCacheGetOrSet('reincarnatebtn').addEventListener('mouseover', () => resetrepeat("reincarnation"))
    DOMCacheGetOrSet('acceleratorboostbtn').addEventListener('mouseover', () => resetrepeat("acceleratorBoost"))
    DOMCacheGetOrSet('challengebtn').addEventListener('mouseover', () => resetrepeat("transcensionChallenge"))
    DOMCacheGetOrSet('reincarnatechallengebtn').addEventListener('mouseover', () => resetrepeat("reincarnationChallenge"))
    DOMCacheGetOrSet('ascendChallengeBtn').addEventListener('mouseover', () => resetrepeat("ascensionChallenge"))
    DOMCacheGetOrSet('ascendbtn').addEventListener('mouseover', () => resetrepeat("ascension"))
    DOMCacheGetOrSet('singularitybtn').addEventListener('mouseover', () => resetrepeat("singularity"))

    for (const resetButton of Array.from(document.querySelectorAll('.resetbtn'))) {
        resetButton.addEventListener('mouseover', () => {
            resetButton.classList.add('hover');
        });

        resetButton.addEventListener('mouseout', () => {
            resetButton.classList.remove('hover');

            if (player.currentChallenge.reincarnation) {
                resetrepeat('reincarnationChallenge');
            } else if (player.currentChallenge.transcension) {
                resetrepeat('transcensionChallenge');
            }
        });
    }

//Onclick Events (this is particularly bad)
    DOMCacheGetOrSet('prestigebtn').addEventListener('click', () => resetCheck('prestige'))
    DOMCacheGetOrSet('transcendbtn').addEventListener('click', () => resetCheck('transcension'))
    DOMCacheGetOrSet('reincarnatebtn').addEventListener('click', () => resetCheck('reincarnation'))
    DOMCacheGetOrSet('acceleratorboostbtn').addEventListener('click', () => boostAccelerator())
    DOMCacheGetOrSet('challengebtn').addEventListener('click', () => resetCheck('transcensionChallenge',undefined,true))
    DOMCacheGetOrSet('reincarnatechallengebtn').addEventListener('click', () => resetCheck('reincarnationChallenge',undefined,true))
    DOMCacheGetOrSet('ascendChallengeBtn').addEventListener('click', () => resetCheck('ascensionChallenge')) 
    DOMCacheGetOrSet('ascendbtn').addEventListener('click', () => resetCheck('ascension'))
    DOMCacheGetOrSet('singularitybtn').addEventListener('click', () => resetCheck('singularity'))
//Part 2: Tabs (sucks)
//Onmouseover Events
    DOMCacheGetOrSet('buildingstab').addEventListener('click', () => toggleTabs('buildings'))
    DOMCacheGetOrSet('upgradestab').addEventListener('click', () => toggleTabs('upgrades'))
    DOMCacheGetOrSet('settingstab').addEventListener('click', () => toggleTabs('settings'))
    DOMCacheGetOrSet('achievementstab').addEventListener('click', () => toggleTabs('achievements'))
    DOMCacheGetOrSet('runestab').addEventListener('click', () => toggleTabs('runes'))
    DOMCacheGetOrSet('challengetab').addEventListener('click', () => toggleTabs('challenges'))
    DOMCacheGetOrSet('researchtab').addEventListener('click', () => toggleTabs('researches'))
    DOMCacheGetOrSet('shoptab').addEventListener('click', () => toggleTabs('shop'))
    DOMCacheGetOrSet('anttab').addEventListener('click', () => toggleTabs('ants'))
    DOMCacheGetOrSet('cubetab').addEventListener('click', () => toggleTabs('cubes'))
    DOMCacheGetOrSet('traitstab').addEventListener('click', () => toggleTabs('traits'))
    DOMCacheGetOrSet('singularitytab').addEventListener('click', () => toggleTabs('singularity'))

// BUILDINGS TAB
//Part 1: Upper portion (Subtab toggle)
    const buildingTypes = ['Coin','Diamond','Mythos','Particle','Tesseract']
    for (let index = 0; index < buildingTypes.length; index++) {
        DOMCacheGetOrSet(`switchTo${buildingTypes[index]}Building`).addEventListener('click', () => toggleSubTab(1, index))
    
    }
//Part 2: Building Amount Toggles
    const buildingTypesAlternate = ['coin','crystal','mythos','particle','tesseract','offering'] as const;
    const buildingOrds = ['one','ten','hundred','thousand']
    const buildingOrdsToNum = [1, 10, 100, 1000] as const;
    for (let index = 0; index < buildingOrds.length; index++) {
        for (let index2 = 0; index2 < buildingTypesAlternate.length; index2++) {
            DOMCacheGetOrSet(buildingTypesAlternate[index2]+buildingOrds[index]).addEventListener('click', () => 
                toggleBuyAmount(
                    buildingOrdsToNum[index],
                    buildingTypesAlternate[index2]
                )
            );
        }
    }
//Part 3: Building Purchasers + Upgrades
    // Accelerator, Multiplier, Accelerator Boost
    DOMCacheGetOrSet('buyaccelerator').addEventListener('click', () => buyAccelerator())
    DOMCacheGetOrSet('buymultiplier').addEventListener('click', () => buyMultiplier())
    DOMCacheGetOrSet('buyacceleratorboost').addEventListener('click', () => boostAccelerator())

    // Coin, Diamond and Mythos Buildings
    const buildingTypesAlternate2 = ['coin', 'diamond', 'mythos']
    const buildingTypesAlternate3 = ['Coin', 'Diamonds', 'Mythos'] as const; //TODO: A cleaner way to implement this dumb shit
    for (let index = 0; index < 3; index++){
        for (let index2 = 1; index2 <= 5; index2++) {
            DOMCacheGetOrSet(`buy${buildingTypesAlternate2[index]}${index2}`).addEventListener('click', () => 
                buyProducer(ordinals[index2 as OneToFive], buildingTypesAlternate3[index], index === 0 ? index2 : index2 * (index2+1) / 2))
        }
    }

    // Crystal Upgrades (Mouseover and Onclick)
    for (let index = 1; index <= 5; index++) {
        
        DOMCacheGetOrSet(`buycrystalupgrade${index}`).addEventListener('mouseover', () => crystalupgradedescriptions(index))
        DOMCacheGetOrSet(`buycrystalupgrade${index}`).addEventListener('click', () => buyCrystalUpgrades(index))
        
    }
    
    // Particle Buildings
    for (let index = 0; index < 5; index++) {
        DOMCacheGetOrSet(`buyparticles${index+1}`).addEventListener('click', () => buyParticleBuilding(
            index+1 as OneToFive,
        ));
    }

    // Tesseract Buildings
    for (let index = 0; index < 5; index++) {
        DOMCacheGetOrSet(`buyTesseracts${index+1}`).addEventListener('click', () => buyTesseractBuilding(index+1 as OneToFive))
        DOMCacheGetOrSet(`tesseractAutoToggle${index+1}`).addEventListener('click', () => toggleAutoTesseracts(index+1))
        
    }

    // Constant Upgrades
    for (let index = 0; index < 10; index++) {
        
        DOMCacheGetOrSet(`buyConstantUpgrade${index+1}`).addEventListener('mouseover', () => constantUpgradeDescriptions(index+1))
        DOMCacheGetOrSet(`buyConstantUpgrade${index+1}`).addEventListener('click', () => buyConstantUpgrades(index+1))
        
    }

//Part 4: Toggles
    // I'm just addressing all global toggles here
    for (let index = 0; index < 32; index++) {
        DOMCacheGetOrSet(`toggle${index+1}`).addEventListener('click', () => toggleSettings(index))   
    }
    // Toggles auto reset type (between TIME and AMOUNT)
    DOMCacheGetOrSet("prestigeautotoggle").addEventListener('click', () => toggleautoreset(1))
    DOMCacheGetOrSet("transcendautotoggle").addEventListener('click', () => toggleautoreset(2))
    DOMCacheGetOrSet("reincarnateautotoggle").addEventListener('click', () => toggleautoreset(3))
    DOMCacheGetOrSet("ascensionAutoToggle").addEventListener('click', () => toggleautoreset(4))
    // Toggles auto reset amount required to trigger
    DOMCacheGetOrSet("prestigeamount").addEventListener('blur', () => updateAutoReset(1))
    DOMCacheGetOrSet("transcendamount").addEventListener('blur', () => updateAutoReset(2))
    DOMCacheGetOrSet("reincarnationamount").addEventListener('blur', () => updateAutoReset(3))
    DOMCacheGetOrSet("ascensionAmount").addEventListener('blur', () => updateAutoReset(4))
    DOMCacheGetOrSet("autoAntSacrificeAmount").addEventListener('blur', () => updateAutoReset(5))
    // Tesseract-specific of the above. I don't know why I didn't standardize names here.
    DOMCacheGetOrSet("tesseractautobuytoggle").addEventListener('click', () => toggleautobuytesseract())
    DOMCacheGetOrSet("tesseractAmount").addEventListener('blur', () => updateTesseractAutoBuyAmount())

// UPGRADES TAB
// For all upgrades in the Upgrades Tab (125) count, we have the same mouseover event. So we'll work on those first.
    for (let index = 1; index <= 125; index++) {
        //Onmouseover events ()
        DOMCacheGetOrSet(`upg${index}`).addEventListener('mouseover', () => upgradedescriptions(index));
    }

// The first 80 upgrades (Coin-Particle upgrade) are annoying since there are four cases based on which resource is needed.
//Note: this part can almost certainly be improved, this was just the quickest implementation
    //End of shit portion (This is used in the following for loop though)
    for (let index = 1; index <= 20; index++) {
        //Onclick events (Regular upgrades 1-80)
        // Regular Upgrades 1-20
        DOMCacheGetOrSet(`upg${index}`).addEventListener('click', () => buyUpgrades(Upgrade.coin,index));
        // Regular Upgrades 21-40
        DOMCacheGetOrSet(`upg${20+index}`).addEventListener('click', () => buyUpgrades(Upgrade.prestige,index+20));
        // Regular Upgrades 41-60
        DOMCacheGetOrSet(`upg${40+index}`).addEventListener('click', () => buyUpgrades(Upgrade.transcend,index+40));
        // Regular Upgrades 61-80
        DOMCacheGetOrSet(`upg${60+index}`).addEventListener('click', () => buyUpgrades(Upgrade.reincarnation,index+60));
    }

// Autobuyer (20 count, ID 81-100) and Generator (20 count, ID 101-120) Upgrades have a unique onclick
    for (let index = 1; index <= 20; index++) {
        //Onclick events (Autobuyer upgrades)
        DOMCacheGetOrSet(`upg${index + 80}`).addEventListener('click', () => buyAutobuyers(index));    
    }
    for (let index = 1; index <= 20; index++) {
        //Onclick events (Generator Upgrades)
        DOMCacheGetOrSet(`upg${index + 100}`).addEventListener('click', () => buyGenerator(index));    
    }

// Upgrades 121-125 are upgrades similar to the first 80.
    for (let index = 1; index <= 5; index++) {
        //Onclick events (Upgrade 121-125)
        DOMCacheGetOrSet(`upg${index + 120}`).addEventListener('click', () => buyUpgrades(Upgrade.coin,index));    
    }

// Next part: Shop-specific toggles
    DOMCacheGetOrSet('coinAutoUpgrade').addEventListener('click', () => toggleShops('coin'))
    DOMCacheGetOrSet('prestigeAutoUpgrade').addEventListener('click', () => toggleShops('prestige'))
    DOMCacheGetOrSet('transcendAutoUpgrade').addEventListener('click', () => toggleShops('transcend'))
    DOMCacheGetOrSet('generatorsAutoUpgrade').addEventListener('click', () => toggleShops('generators'))
    DOMCacheGetOrSet('reincarnateAutoUpgrade').addEventListener('click', () => toggleShops('reincarnate'))

// ACHIEVEMENTS TAB
    // TODO: Remove 1 indexing
    for (let index = 1; index <= achievementpointvalues.length - 1 ; index++) {
    
        //Onmouseover events (Achievement descriptions)
        DOMCacheGetOrSet(`ach${index}`).addEventListener('mouseover', () => achievementdescriptions(index));
    
    }

// RUNES TAB [And all corresponding subtabs]
// Part 0: Upper UI portion
    //Auto sacrifice toggle button
    DOMCacheGetOrSet('toggleautosacrifice').addEventListener('click', () => toggleAutoSacrifice(0))
    //Toggle subtabs of Runes tab
    for (let index = 0; index < 4; index++) {
        
        DOMCacheGetOrSet(`toggleRuneSubTab${index+1}`).addEventListener('click', () => toggleSubTab(4, index))
    
    }

// Part 1: Runes Subtab
    for (let index = 0; index < 7; index++) {
        
        DOMCacheGetOrSet(`rune${index+1}`).addEventListener('mouseover', () => displayRuneInformation(index+1))
        DOMCacheGetOrSet(`rune${index+1}`).addEventListener('click', () => toggleAutoSacrifice(index+1))

        DOMCacheGetOrSet(`activaterune${index+1}`).addEventListener('mouseover', () => displayRuneInformation(index+1))
        DOMCacheGetOrSet(`activaterune${index+1}`).addEventListener('click', () => redeemShards(index+1))
        
    }

// Part 2: Talismans Subtab
    const talismanBuyPercents = [10, 25, 50, 100]
    const talismanBuyPercentsOrd = ['Ten', 'TwentyFive', 'Fifty', 'Hundred']

    for (let index = 0; index < talismanBuyPercents.length; index++) {
    
        DOMCacheGetOrSet(`talisman${talismanBuyPercentsOrd[index]}`).addEventListener('click', () => toggleTalismanBuy(talismanBuyPercents[index]))
    
    }

    DOMCacheGetOrSet('toggleautoenhance').addEventListener('click', () => toggleautoenhance())
    DOMCacheGetOrSet('toggleautofortify').addEventListener('click', () => toggleautofortify())

    //Talisman Fragments/Shards
    const talismanItemNames = ['shard','commonFragment','uncommonFragment','rareFragment','epicFragment','legendaryFragment','mythicalFragment'] as const;
    for (let index = 0; index < talismanItemNames.length; index++) {
        
        DOMCacheGetOrSet(`buyTalismanItem${index+1}`).addEventListener('mouseover', () => updateTalismanCostDisplay(talismanItemNames[index]))
        DOMCacheGetOrSet(`buyTalismanItem${index+1}`).addEventListener('click', () => buyTalismanResources(talismanItemNames[index]))

    }

    for (let index = 0; index < 7; index++) {
        
        DOMCacheGetOrSet(`talisman${index+1}`).addEventListener('click', () => showTalismanEffect(index))
        DOMCacheGetOrSet(`leveluptalisman${index+1}`).addEventListener('mouseover', () => showTalismanPrices(index))
        DOMCacheGetOrSet(`leveluptalisman${index+1}`).addEventListener('click', () => buyTalismanLevels(index))
        DOMCacheGetOrSet(`enhancetalisman${index+1}`).addEventListener('mouseover', () => showEnhanceTalismanPrices(index))
        DOMCacheGetOrSet(`enhancetalisman${index+1}`).addEventListener('click', () => buyTalismanEnhance(index))
        DOMCacheGetOrSet(`respectalisman${index+1}`).addEventListener('click', () => showRespecInformation(index))

    }

    DOMCacheGetOrSet('respecAllTalismans').addEventListener('click', () => showRespecInformation(7))
    DOMCacheGetOrSet('confirmTalismanRespec').addEventListener('click', () => respecTalismanConfirm(G['talismanRespec']))
    DOMCacheGetOrSet('cancelTalismanRespec').addEventListener('click', () => respecTalismanCancel(G['talismanRespec']))

    for (let index = 0; index < 5; index++) {
        
        DOMCacheGetOrSet(`talismanRespecButton${index+1}`).addEventListener('click', () => changeTalismanModifier(index+1))
        
    }
    
//Part 3: Blessings and Spirits
    for (let index = 0; index < 5; index++) {

        DOMCacheGetOrSet(`runeBlessingPurchase${index+1}`).addEventListener('click', () => buyRuneBonusLevels('Blessings', index+1))
        DOMCacheGetOrSet(`runeSpiritPurchase${index+1}`).addEventListener('click', () => buyRuneBonusLevels('Spirits', index+1))

    }
    DOMCacheGetOrSet('buyRuneBlessingInput').addEventListener('blur', () => updateRuneBlessingBuyAmount(1))
    DOMCacheGetOrSet('buyRuneSpiritInput').addEventListener('blur', () => updateRuneBlessingBuyAmount(2))

// CHALLENGES TAB
//Part 1: Challenges
    // Challenge 1-15 buttons
    for (let index = 0; index < 15; index++) {
    
        DOMCacheGetOrSet(`challenge${index+1}`).addEventListener('click', () => challengeDisplay(index+1))
        DOMCacheGetOrSet(`challenge${index+1}`).addEventListener('dblclick', () => {
            challengeDisplay(index+1);
            toggleChallenges(G['triggerChallenge'], false)
        });
    
    }
//Part 2: QoL Buttons
    // Individual buttons (Start, Retry)
    DOMCacheGetOrSet('startChallenge').addEventListener('click', () => toggleChallenges(G['triggerChallenge'], false))
    DOMCacheGetOrSet('retryChallenge').addEventListener('click', () => toggleRetryChallenges())
    // Autochallenge buttons
    DOMCacheGetOrSet('toggleAutoChallengeIgnore').addEventListener('click', () => toggleAutoChallengesIgnore(G['triggerChallenge']))
    DOMCacheGetOrSet('toggleAutoChallengeStart').addEventListener('click', () => toggleAutoChallengeRun())
    DOMCacheGetOrSet('startAutoChallengeTimerInput').addEventListener('input', () => updateAutoChallenge(1))
    DOMCacheGetOrSet('exitAutoChallengeTimerInput').addEventListener('input', () => updateAutoChallenge(2))
    DOMCacheGetOrSet('enterAutoChallengeTimerInput').addEventListener('input', () => updateAutoChallenge(3))

// RESEARCH TAB
//Part 1: Researches
// There are 200 researches, ideally in rewrite 200 would instead be length of research list/array
    for (let index = 1; index < 200; index++) {

        //Eliminates listeners on index.html 1404-1617
        DOMCacheGetOrSet(`res${index}`).addEventListener('click', () => buyResearch(index));
        DOMCacheGetOrSet(`res${index}`).addEventListener('mouseover', () => researchDescriptions(index));    
    }
    //Research 200 is special, uses more params
    DOMCacheGetOrSet(`res200`).addEventListener('click', () => buyResearch(200, false, 0.01));
    DOMCacheGetOrSet(`res200`).addEventListener('mouseover', () => researchDescriptions(200, false, 0.01));

//Part 2: QoL buttons
    DOMCacheGetOrSet('toggleresearchbuy').addEventListener('click', () => toggleResearchBuy())
    DOMCacheGetOrSet('toggleautoresearch').addEventListener('click', () => toggleAutoResearch())
    DOMCacheGetOrSet('toggleautoresearchmode').addEventListener('click', () => toggleAutoResearchMode())

// ANTHILL TAB
//Part 1: Ant Producers (Tiers 1-8)
const antProducerCostVals = ['null','1e700','3','100','10000','1e12','1e36','1e100','1e300']
for (let index = 1; index <= 8 ; index++) {

    //Onmouse Events
    DOMCacheGetOrSet(`anttier${index}`).addEventListener('mouseover', () => updateAntDescription(index))
    DOMCacheGetOrSet(`anttier${index}`).addEventListener('mouseover', () => antRepeat(index))
    //Onclick Events
    DOMCacheGetOrSet(`anttier${index}`).addEventListener('click', () => buyAntProducers(
        ordinals[index] as Parameters<typeof buyAntProducers>[0],
        antProducerCostVals[index],index)
    );
}
//Part 2: Ant Upgrades (1-12)
const antUpgradeCostVals = ['null', '100', '100', '1000', '1000', '1e5', '1e6', '1e8', '1e11', '1e15', '1e20', '1e40', '1e100']
for (let index = 1; index <= 12; index++) {

    //Onmouse Event
    DOMCacheGetOrSet(`antUpgrade${index}`).addEventListener('mouseover', () => antUpgradeDescription(index))
    //Onclick Event
    DOMCacheGetOrSet(`antUpgrade${index}`).addEventListener('click', () => buyAntUpgrade(antUpgradeCostVals[index], false, index))
    
}
//Part 3: Sacrifice
    DOMCacheGetOrSet('antSacrifice').addEventListener('click', () => sacrificeAnts())

//Part 4: QoL Buttons
    DOMCacheGetOrSet('toggleAntMax').addEventListener('click', () => toggleAntMaxBuy())
    DOMCacheGetOrSet('toggleAutoSacrificeAnt').addEventListener('click', () => toggleAntAutoSacrifice(0))
    DOMCacheGetOrSet('autoSacrificeAntMode').addEventListener('click', () => toggleAntAutoSacrifice(1))

// WOW! Cubes Tab
//Part 0: Subtab UI
    for (let index = 0; index < 7; index++) {
    
        DOMCacheGetOrSet(`switchCubeSubTab${index+1}`).addEventListener('click', () => toggleSubTab(8, index))
        
    }

//Part 1: Cube Upgrades
    // #1-70, skip 50
    for (let index = 0; index < 70; index++) {
    
        if (index < 49) {
            DOMCacheGetOrSet(`cubeUpg${index+1}`).addEventListener('mouseover', () => cubeUpgradeDesc(index+1))
            DOMCacheGetOrSet(`cubeUpg${index+1}`).addEventListener('click', () => buyCubeUpgrades(index+1))
        }

        if (index == 49) {
            DOMCacheGetOrSet('cubeUpg50').addEventListener('mouseover', () => cubeUpgradeDesc(50,0.01))
            DOMCacheGetOrSet('cubeUpg50').addEventListener('click', () => buyCubeUpgrades(50,0.01))
        }

        if (index > 49) {
            DOMCacheGetOrSet(`cubeUpg${index+1}`).addEventListener('mouseover', () => cubeUpgradeDesc(index+1, 0, true))
            DOMCacheGetOrSet(`cubeUpg${index+1}`).addEventListener('click', () => buyCubeUpgrades(index+1, 0, true))
        }
    }

    // Toggle
    DOMCacheGetOrSet('toggleCubeBuy').addEventListener('click', () => toggleMaxBuyCube())

//Part 2: Cube Opening Buttons
    //Wow Cubes
    DOMCacheGetOrSet('open1Cube').addEventListener('click', () => player.wowCubes.open(1, false))
    DOMCacheGetOrSet('open20Cube').addEventListener('click', () => player.wowCubes.open(20, false))
    DOMCacheGetOrSet('open1000Cube').addEventListener('click', () => player.wowCubes.open(1000, false))
    DOMCacheGetOrSet('openCustomCube').addEventListener('click', () => player.wowCubes.openCustom());
    DOMCacheGetOrSet('openMostCube').addEventListener('click', () => player.wowCubes.open(1, true))
    //Wow Tesseracts
    DOMCacheGetOrSet('open1Tesseract').addEventListener('click', () => player.wowTesseracts.open(1, false))
    DOMCacheGetOrSet('open20Tesseract').addEventListener('click', () => player.wowTesseracts.open(20, false))
    DOMCacheGetOrSet('open1000Tesseract').addEventListener('click', () => player.wowTesseracts.open(1000, false))
    DOMCacheGetOrSet('openCustomTesseract').addEventListener('click', () => player.wowTesseracts.openCustom());
    DOMCacheGetOrSet('openMostTesseract').addEventListener('click', () => player.wowTesseracts.open(1, true))
    //Wow Hypercubes
    DOMCacheGetOrSet('open1Hypercube').addEventListener('click', () => player.wowHypercubes.open(1, false))
    DOMCacheGetOrSet('open20Hypercube').addEventListener('click', () => player.wowHypercubes.open(20, false))
    DOMCacheGetOrSet('open1000Hypercube').addEventListener('click', () => player.wowHypercubes.open(1000, false))
    DOMCacheGetOrSet('openCustomHypercube').addEventListener('click', () => player.wowHypercubes.openCustom());
    DOMCacheGetOrSet('openMostHypercube').addEventListener('click', () => player.wowHypercubes.open(1, true))
    //Wow Platonic Cubes
    DOMCacheGetOrSet('open1PlatonicCube').addEventListener('click', () => player.wowPlatonicCubes.open(1, false))
    DOMCacheGetOrSet('open40kPlatonicCube').addEventListener('click', () => player.wowPlatonicCubes.open(4e4, false))
    DOMCacheGetOrSet('open1mPlatonicCube').addEventListener('click', () => player.wowPlatonicCubes.open(1e6, false))
    DOMCacheGetOrSet('openCustomPlatonicCube').addEventListener('click', () => player.wowPlatonicCubes.openCustom());
    DOMCacheGetOrSet('openMostPlatonicCube').addEventListener('click', () => player.wowPlatonicCubes.open(1, true))

//Part 3: Platonic Upgrade Section
const platonicUpgrades = document.getElementsByClassName('platonicUpgradeImage')
for (let index = 0; index < platonicUpgrades.length; index++) {

    platonicUpgrades[index].addEventListener('mouseover', () => createPlatonicDescription(index+1))
    platonicUpgrades[index].addEventListener('click', () => buyPlatonicUpgrades(index+1))

}

//Part 4: Hepteract Subtab
DOMCacheGetOrSet('chronosHepteract').addEventListener('mouseover', () => hepteractDescriptions('chronos'))
DOMCacheGetOrSet('hyperrealismHepteract').addEventListener('mouseover', () => hepteractDescriptions('hyperrealism'))
DOMCacheGetOrSet('quarkHepteract').addEventListener('mouseover', () => hepteractDescriptions('quark'))
DOMCacheGetOrSet('challengeHepteract').addEventListener('mouseover', () => hepteractDescriptions('challenge'))
DOMCacheGetOrSet('abyssHepteract').addEventListener('mouseover', () => hepteractDescriptions('abyss'))
DOMCacheGetOrSet('acceleratorHepteract').addEventListener('mouseover', () => hepteractDescriptions('accelerator'))
DOMCacheGetOrSet('acceleratorBoostHepteract').addEventListener('mouseover', () => hepteractDescriptions('acceleratorBoost'))
DOMCacheGetOrSet('multiplierHepteract').addEventListener('mouseover', () => hepteractDescriptions('multiplier'))


DOMCacheGetOrSet('chronosHepteractCraft').addEventListener('click', () => player.hepteractCrafts.chronos.craft())
DOMCacheGetOrSet('hyperrealismHepteractCraft').addEventListener('click', () => player.hepteractCrafts.hyperrealism.craft())
DOMCacheGetOrSet('quarkHepteractCraft').addEventListener('click', () => player.hepteractCrafts.quark.craft())
DOMCacheGetOrSet('challengeHepteractCraft').addEventListener('click', () => player.hepteractCrafts.challenge.craft())
DOMCacheGetOrSet('abyssHepteractCraft').addEventListener('click', () => player.hepteractCrafts.abyss.craft())
DOMCacheGetOrSet('acceleratorHepteractCraft').addEventListener('click', () => player.hepteractCrafts.accelerator.craft())
DOMCacheGetOrSet('acceleratorBoostHepteractCraft').addEventListener('click', () => player.hepteractCrafts.acceleratorBoost.craft())
DOMCacheGetOrSet('multiplierHepteractCraft').addEventListener('click', () => player.hepteractCrafts.multiplier.craft())

DOMCacheGetOrSet('chronosHepteractCraftMax').addEventListener('click', () => player.hepteractCrafts.chronos.craft(true))
DOMCacheGetOrSet('hyperrealismHepteractCraftMax').addEventListener('click', () => player.hepteractCrafts.hyperrealism.craft(true))
DOMCacheGetOrSet('quarkHepteractCraftMax').addEventListener('click', () => player.hepteractCrafts.quark.craft(true))
DOMCacheGetOrSet('challengeHepteractCraftMax').addEventListener('click', () => player.hepteractCrafts.challenge.craft(true))
DOMCacheGetOrSet('abyssHepteractCraftMax').addEventListener('click', () => player.hepteractCrafts.abyss.craft(true))
DOMCacheGetOrSet('acceleratorHepteractCraftMax').addEventListener('click', () => player.hepteractCrafts.accelerator.craft(true))
DOMCacheGetOrSet('acceleratorBoostHepteractCraftMax').addEventListener('click', () => player.hepteractCrafts.acceleratorBoost.craft(true))
DOMCacheGetOrSet('multiplierHepteractCraftMax').addEventListener('click', () => player.hepteractCrafts.multiplier.craft(true))

DOMCacheGetOrSet('chronosHepteractCap').addEventListener('click', () => player.hepteractCrafts.chronos.expand())
DOMCacheGetOrSet('hyperrealismHepteractCap').addEventListener('click', () => player.hepteractCrafts.hyperrealism.expand())
DOMCacheGetOrSet('quarkHepteractCap').addEventListener('click', () => player.hepteractCrafts.quark.expand())
DOMCacheGetOrSet('challengeHepteractCap').addEventListener('click', () => player.hepteractCrafts.challenge.expand())
DOMCacheGetOrSet('abyssHepteractCap').addEventListener('click', () => player.hepteractCrafts.abyss.expand())
DOMCacheGetOrSet('acceleratorHepteractCap').addEventListener('click', () => player.hepteractCrafts.accelerator.expand())
DOMCacheGetOrSet('acceleratorBoostHepteractCap').addEventListener('click', () => player.hepteractCrafts.acceleratorBoost.expand())
DOMCacheGetOrSet('multiplierHepteractCap').addEventListener('click', () => player.hepteractCrafts.multiplier.expand())

DOMCacheGetOrSet('hepteractToQuark').addEventListener('mouseover', () => hepteractToOverfluxOrbDescription())
DOMCacheGetOrSet('hepteractToQuarkTrade').addEventListener('click', () => tradeHepteractToOverfluxOrb())
DOMCacheGetOrSet('overfluxPowder').addEventListener('mouseover', () => overfluxPowderDescription())
DOMCacheGetOrSet('powderDayWarp').addEventListener('click', () => overfluxPowderWarp())

// CORRUPTION TAB
//Part 0: Subtabs
DOMCacheGetOrSet('corrStatsBtn').addEventListener('click', () => toggleSubTab(9, 0))
DOMCacheGetOrSet('corrLoadoutsBtn').addEventListener('click', () => toggleSubTab(9, 1))

//Part 1: Displays
DOMCacheGetOrSet('corruptionDisplays').addEventListener('click', () => corruptionDisplay(10))
DOMCacheGetOrSet('corruptionCleanse').addEventListener('click', () => corruptionCleanseConfirm())
DOMCacheGetOrSet('corruptionCleanseConfirm').addEventListener('click', () => toggleCorruptionLevel(10, 999))

//Extra toggle
DOMCacheGetOrSet('ascensionAutoEnable').addEventListener('click', () => toggleAutoAscend())

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
/*Export Files*/ DOMCacheGetOrSet('exportgame').addEventListener('click', () => exportSynergism())
/*Update name of File*/ 
DOMCacheGetOrSet('saveStringInput').addEventListener('blur', e => updateSaveString(<HTMLInputElement>e.target));
/*Save Game Button*/ DOMCacheGetOrSet('savegame').addEventListener('click', () => saveSynergy(true))
/*Delete Save Button*/ DOMCacheGetOrSet('deleteGame').addEventListener('click', () => resetGame())
/*Submit Stats [Note: will eventually become obsolete if kong closes]*/ // DOMCacheGetOrSet('submitstats').addEventListener('click', () => submitStats()) 
/*Promotion Codes*/ DOMCacheGetOrSet('promocodes').addEventListener('click', () => promocodes())
/*Toggle Ascension Per-Second Setting*/ DOMCacheGetOrSet('historyTogglePerSecondButton').addEventListener('click', () => resetHistoryTogglePerSecond())

// SHOP TAB

/*

TODO: Fix this entire tab it's utter shit

*/

// Part 1: The Settings
/*Respec The Upgrades*/ DOMCacheGetOrSet('resetShopUpgrades').addEventListener('click', () => resetShopUpgrades())
/*Toggle Shop Confirmations*/ DOMCacheGetOrSet('toggleConfirmShop').addEventListener('click', () => toggleShopConfirmation())
/*Toggle Shop Buy Max*/ DOMCacheGetOrSet('toggleBuyMaxShop').addEventListener('click', () => toggleBuyMaxShop())

// Part 2: Potions
/*Offering Potion*/
    DOMCacheGetOrSet('offeringPotions').addEventListener('mouseover', () => shopDescriptions("offeringPotion"))
    DOMCacheGetOrSet('offeringpotionowned').addEventListener('mouseover', () => shopDescriptions("offeringPotion"))
    DOMCacheGetOrSet('buyofferingpotion').addEventListener('mouseover', () => shopDescriptions("offeringPotion"))
    DOMCacheGetOrSet('useofferingpotion').addEventListener('mouseover', () => shopDescriptions("offeringPotion"))
    DOMCacheGetOrSet('buyofferingpotion').addEventListener('click', () => buyShopUpgrades("offeringPotion"))
    //DOMCacheGetOrSet('offeringPotions').addEventListener('click', () => buyShopUpgrades("offeringPotion"))  //Allow clicking of image to buy also
    DOMCacheGetOrSet('useofferingpotion').addEventListener('click', () => useConsumable("offeringPotion"))
/*Obtainium Potion*/
    DOMCacheGetOrSet('obtainiumPotions').addEventListener('mouseover', () => shopDescriptions("obtainiumPotion"))
    DOMCacheGetOrSet('obtainiumpotionowned').addEventListener('mouseover', () => shopDescriptions("obtainiumPotion"))
    DOMCacheGetOrSet('buyobtainiumpotion').addEventListener('mouseover', () => shopDescriptions("obtainiumPotion"))
    DOMCacheGetOrSet('useobtainiumpotion').addEventListener('mouseover', () => shopDescriptions("obtainiumPotion"))
    DOMCacheGetOrSet('buyobtainiumpotion').addEventListener('click', () => buyShopUpgrades("obtainiumPotion"))
    //DOMCacheGetOrSet('obtainiumPotions').addEventListener('click', () => buyShopUpgrades("obtainiumPotion"))  //Allow clicking of image to buy also
    DOMCacheGetOrSet('useobtainiumpotion').addEventListener('click', () => useConsumable("obtainiumPotion"))
/* Permanent Upgrade Images */
    const shopKeys = Object.keys(player.shopUpgrades) as (keyof Player['shopUpgrades'])[]
    for (const key of shopKeys) {
        const shopItem = shopData[key]
        if (shopItem.type === shopUpgradeTypes.UPGRADE) {
            DOMCacheGetOrSet(`${key}`).addEventListener('mouseover', () => shopDescriptions(key))
            DOMCacheGetOrSet(`${key}Level`).addEventListener('mouseover', () => shopDescriptions(key))
            DOMCacheGetOrSet(`${key}Button`).addEventListener('mouseover', () => shopDescriptions(key))
            //DOMCacheGetOrSet(`${key}`).addEventListener('click', () => buyShopUpgrades(key))  //Allow clicking of image to buy also
            DOMCacheGetOrSet(`${key}Button`).addEventListener('click', () => buyShopUpgrades(key))
        }
    }
    DOMCacheGetOrSet('buySingularityQuarksButton').addEventListener('click', () => buyGoldenQuarks());
// SINGULARITY TAB
    const singularityUpgrades = Object.keys(player.singularityUpgrades) as (keyof Player['singularityUpgrades'])[];
    for (const key of singularityUpgrades) {
        DOMCacheGetOrSet(`${key}`).addEventListener('mouseover', () => player.singularityUpgrades[`${key}`].updateUpgradeHTML())
        DOMCacheGetOrSet(`${key}`).addEventListener('click', () => player.singularityUpgrades[`${key}`].buyLevel())
    }


    const tabs = document.querySelectorAll<HTMLElement>('#tabrow > li');
    tabs.forEach(b => b.addEventListener('click', () => changeTabColor()));

    // Import button
    DOMCacheGetOrSet('importfile').addEventListener('change', async e => {
        const element = e.target as HTMLInputElement;
        const file = element.files![0];
        let save = '';
        // https://developer.mozilla.org/en-US/docs/Web/API/Blob/text
        // not available in (bad) browsers like Safari 11
        if (typeof Blob.prototype.text === 'function') {
            save = await file.text();
        } else {
            const reader = new FileReader();
            reader.readAsText(file);
            const text = await new Promise<string>(res => {
                reader.addEventListener('load', () => res(reader.result!.toString()));
            });
            
            save = text;
        }

        element.value = '';

        return importSynergism(save);
    });

    DOMCacheGetOrSet('theme').addEventListener('click', toggleTheme);
}
