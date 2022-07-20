import { DOMCacheGetOrSet } from './Cache/DOM';

export const toggleTheme = (theme: number) => {
    const themeButton = DOMCacheGetOrSet('theme');

    if (theme === 1) { //Switches to 'Dark Mode'
        resetThemeColors();

        themeButton.textContent = 'Dark Mode';
        localStorage.removeItem('theme') //No need to save it
    } else if (theme === 2) { //Switches to 'Darker Mode'
        resetThemeColors();
        document.body.style.setProperty('--bg-color', '#0c0c0f');
        document.body.style.setProperty('--alert-color', '#040406');
        document.body.style.setProperty('--history-lines', '#1b1b22');
        document.body.style.setProperty('--box-color', '#060606');
        document.body.style.setProperty('--boxmain-bordercolor', '#d487d4');
        document.body.style.setProperty('--button-color', '#040406');
        document.body.style.setProperty('--hover-color', '#1b1b22');
        document.body.style.setProperty('--purplebtn-color', '#6f006f');
        document.body.style.setProperty('--buttonbuy-color', '#040406');
        document.body.style.setProperty('--buildings-canbuy-color', '#414162');
        document.body.style.setProperty('--buildings-hover-color', '#4f4f76');
        document.body.style.setProperty('--blessings-canbuy-color', '#34344d');
        document.body.style.setProperty('--blessings-hover-color', '#48486c');
        document.body.style.setProperty('--tab-color', 'black');
        document.body.style.setProperty('--singtab-color', '#002');
        document.body.style.setProperty('--hoversing-color', '#00007d');
        document.body.style.setProperty('--shoptab-color', '#6f006f');
        DOMCacheGetOrSet('corruptionStatsLoadouts').style.backgroundColor = '#060606'
        DOMCacheGetOrSet('corruptionStatsLoadouts').style.borderColor = '#dd8f00'
        DOMCacheGetOrSet('actualPotionShop').style.backgroundColor = '#060606'
        DOMCacheGetOrSet('actualPotionShop').style.borderColor = '#dd0'
        DOMCacheGetOrSet('exportgame').style.backgroundColor = 'black' //Special cases
        DOMCacheGetOrSet('importFileButton').style.backgroundColor = 'black'

        themeButton.textContent = 'Darker Mode';
        localStorage.setItem('theme', '2');
    } else if (theme === 3) { //Switches to 'Lighter Dark Mode'
        resetThemeColors();
        document.body.style.setProperty('--bg-color', '#1c1b22');
        document.body.style.setProperty('--alert-color', '#141319');
        document.body.style.setProperty('--history-lines', '#083a3a');
        document.body.style.setProperty('--box-color', '#141319');
        document.body.style.setProperty('--boxmain-bordercolor', '#dda0dd');
        document.body.style.setProperty('--button-color', '#101828');
        document.body.style.setProperty('--hover-color', '#006');
        document.body.style.setProperty('--buttonbuy-color', '#0b111c');
        document.body.style.setProperty('--buildings-canbuy-color', '#324b7d');
        document.body.style.setProperty('--buildings-hover-color', '#4161a1');
        document.body.style.setProperty('--blessings-canbuy-color', '#233559');
        document.body.style.setProperty('--blessings-hover-color', '#324b7d');
        document.body.style.setProperty('--tab-color', '#101828');
        document.body.style.setProperty('--hoversing-color', '#005');
        DOMCacheGetOrSet('corruptionStatsLoadouts').style.backgroundColor = '#141319'
        DOMCacheGetOrSet('corruptionStatsLoadouts').style.borderColor = '#ffa500'
        DOMCacheGetOrSet('actualPotionShop').style.backgroundColor = '#141319'
        DOMCacheGetOrSet('actualPotionShop').style.borderColor = '#dd0'
        DOMCacheGetOrSet('actualShop').style.backgroundColor = '#0c0c0f' //Special cases
        DOMCacheGetOrSet('actualShop').style.borderColor = '#d487d4'
        DOMCacheGetOrSet('platonicUpgradePics').style.backgroundColor = '#0c0c0f'

        themeButton.textContent = 'Lighter Dark Mode';
        localStorage.setItem('theme', '3');
    } else if (theme === 4) { //Switches to 'Light Mode' (Might be reworked soon)
        resetThemeColors();
        document.body.style.setProperty('--bg-color', '#7c7891');
        document.body.style.setProperty('--alert-color', '#444250');
        document.body.style.setProperty('--history-lines', '#156e71');
        document.body.style.setProperty('--box-color', '#444151');
        document.body.style.setProperty('--boxmain-bordercolor', '#d894d8');
        document.body.style.setProperty('--button-color', '#136062');
        document.body.style.setProperty('--hover-color', '#187c7f');
        document.body.style.setProperty('--buttonbuy-color', '#4c495a');
        document.body.style.setProperty('--buildings-canbuy-color', '#7c7891');
        document.body.style.setProperty('--buildings-hover-color', '#9794a8');
        document.body.style.setProperty('--blessings-canbuy-color', '#747088');
        document.body.style.setProperty('--blessings-hover-color', '#858298');
        document.body.style.setProperty('--tab-color', '#105254');
        document.body.style.setProperty('--singtab-color', '#00d');
        document.body.style.setProperty('--hoversing-color', '#1052B6');
        DOMCacheGetOrSet('corruptionStatsLoadouts').style.backgroundColor = '#444151'
        DOMCacheGetOrSet('corruptionStatsLoadouts').style.borderColor = '#dd8f00'
        DOMCacheGetOrSet('actualPotionShop').style.backgroundColor = '#444250'
        DOMCacheGetOrSet('actualPotionShop').style.borderColor = '#dd0'

        DOMCacheGetOrSet('achievementcolorcode2').style.color = '#ff01f3' //To make easier to read text (Maybe clean up)
        DOMCacheGetOrSet('corruptionDescription').style.color = '#ff01f3'
        DOMCacheGetOrSet('corruptionTesseractsValue').style.color = '#ff01f3'
        DOMCacheGetOrSet('corruptionTotalScore').style.color = '#ad5ad7'
        DOMCacheGetOrSet('corruptionAntExponentValue').style.color = '#ad5ad7'
        DOMCacheGetOrSet('corruptionIntroduction').style.color = '#ad5ad7'
        DOMCacheGetOrSet('antwelcome').style.color = 'darkgrey'
        DOMCacheGetOrSet('switchTheme2').style.borderColor = '#284242'

        themeButton.textContent = 'Light Mode';
        localStorage.setItem('theme', '4');
    } else if (theme === 5) { //Switches to 'Dracula Mode'
        resetThemeColors();
        document.body.style.setProperty('--bg-color', '#131319');
        document.body.style.setProperty('--alert-color', '#2a1035');
        document.body.style.setProperty('--history-lines', '#012d1c');
        document.body.style.setProperty('--text-color', '#aC47ff');
        document.body.style.setProperty('--button-color', '#21003f');
        document.body.style.setProperty('--hover-color', '#00056a');
        document.body.style.setProperty('--purplebtn-color', '#5800a0');
        document.body.style.setProperty('--purplehover-color', '#680927');
        document.body.style.setProperty('--buttonbuy-color', '#005e00');
        document.body.style.setProperty('--buildings-canbuy-color', '#a00');
        document.body.style.setProperty('--buildings-hover-color', '#e00');
        document.body.style.setProperty('--blessings-canbuy-color', '#004d00');
        document.body.style.setProperty('--blessings-hover-color', '#800');
        document.body.style.setProperty('--tab-color', '#1a0030');
        document.body.style.setProperty('--singtab-color', '#000230');
        document.body.style.setProperty('--hoversing-color', '#000463');
        document.body.style.setProperty('--shoptab-color', '#5800a0');
        document.body.style.setProperty('--hovershop-color', '#7400d3');
        DOMCacheGetOrSet('themeBox').style.backgroundColor = '#0a0a11' //Special cases
        DOMCacheGetOrSet('themeBox').style.borderColor = '#3c006d'
        DOMCacheGetOrSet('c15Rewards').style.backgroundColor = '#2e001b'
        DOMCacheGetOrSet('c15Rewards').style.borderColor = '#186e83'
        DOMCacheGetOrSet('platonicUpgradeDescriptions').style.backgroundColor = '#2e001b'
        DOMCacheGetOrSet('platonicUpgradeDescriptions').style.borderColor = '#186e83'
        DOMCacheGetOrSet('platonicUpgradePics').style.backgroundColor = '#720505'
        DOMCacheGetOrSet('platonicUpgradePics').style.borderColor = '#410303'
        DOMCacheGetOrSet('actualPotionShop').style.backgroundColor = '#01192c'
        DOMCacheGetOrSet('actualPotionShop').style.borderColor = '#04d481'
        DOMCacheGetOrSet('actualShop').style.backgroundColor = '#11111b'
        DOMCacheGetOrSet('actualShop').style.borderColor = '#038ba8'
        DOMCacheGetOrSet('corruptionStatsLoadouts').style.backgroundColor = '#0a0a11'
        DOMCacheGetOrSet('corruptionStatsLoadouts').style.borderColor = '#04d481'
        DOMCacheGetOrSet('heptGrid').style.backgroundColor = '#11111b'
        DOMCacheGetOrSet('heptGrid').style.borderColor = '#9B7306'
        DOMCacheGetOrSet('actualSingularityUpgradeContainer').style.backgroundColor = '#000000'
        DOMCacheGetOrSet('actualSingularityUpgradeContainer').style.borderColor = '#b341e0'

        DOMCacheGetOrSet('confirmationToggleTitle').style.color = '#eb0000' //Maybe clean up (Pink text)
        DOMCacheGetOrSet('specialActionsTitle').style.color = '#eb0000'
        DOMCacheGetOrSet('themesTitle').style.color = '#eb0000'
        DOMCacheGetOrSet('achievementcolorcode2').style.color = '#ff01f3' //Extra
        DOMCacheGetOrSet('corruptionDescription').style.color = '#ff01f3'
        DOMCacheGetOrSet('corruptionTesseractsValue').style.color = '#ff01f3'
        DOMCacheGetOrSet('corruptionTotalScore').style.color = '#ad5ad7'
        DOMCacheGetOrSet('corruptionAntExponentValue').style.color = '#ad5ad7'
        DOMCacheGetOrSet('corruptionIntroduction').style.color = '#ad5ad7'
        DOMCacheGetOrSet('antwelcome').style.color = 'darkgrey'

        themeButton.textContent = 'Dracula Mode';
        localStorage.setItem('theme', '5');
    }
    // If you want to add your own theme, then here is short turorial: (Case sentitive)
    // } else if (theme === 'number 1 higher than previos theme') {
    //    resetThemeColors();
    //    Changes you want (document.body.style.setProperty or DOMCacheGetOrSet)
    //
    //    themeButton.textContent = 'Name of your theme';
    //    localStorage.setItem('theme', '1 higher');
    // }
    // You will need to do in other files:
    // in EventListeners.ts change (theme <= number) into 1 higher number (Should be on bottom)
    // in index.html - <button id="switchTheme 1 higher" alt="same as ID" label="same as ID" class="themeButton" style="border: 2px solid color you want">Name of Mode</button> (Where other buttons are)
    //
    // Will need to Add document.body.style.setProperty for every change of colors you want:
    // '--bg-color' - for BG color; for more complex BG instead add new class in css and use document.body.classList.remove('bodycolor') .add('new class'), will need to revert it inside resetThemeColors
    // '--alert-color' - for notifications and alert BG; '--history-lines' for lines color in history tab
    // '--text-color' - main text color (white text that is not part of "Rainbow"); more text colors might be added later
    // '--box-color' - inside color of boxes; '--boxmain-bordercolor' - for most borders; DOMCacheGetOrSet('ID') instead for Potion and Corruptions boxes
    // '--button-color' - Most of buttons colors, for hover color use '--hover-color'; for purple buttons use '--purplebtn-color' and '--purplehover-color'; dont change extra individual buttons (Can change border colors, if not a toggle) as that might break hover color
    // '--tab-color' - doesnt include text, as well Shop and Singularity tab; '--singtab-color' - for Singularity tab and '--hoversing-color' for hover color; for shop tab use these '--shoptab-color' and '--hovershop-color'
    // '--buttonbuy-color' buying buldings buttons (When can't afford); '--buildings-canbuy-color' and '--blessings-canbuy-color' if you can afford; '--buildings-hover-color' and '--blessings-hover-color' if you can afford and hovering over it
    // If you change any individual ID's dont forget to remove inline CSS in resetThemeColors (Unless HTML gives color, then DOMCacheGetOrSet original color)
}

const resetThemeColors = () => { //Reverts all colors back to default (allows to switch themes in any order)
    //document.body.classList.remove('new class') //For every new class that was added, will need to remove them in here
    //document.body.classList.add('bodycolor')
    document.body.style.setProperty('--bg-color', '#111'); //In case new theme doesnt use some
    document.body.style.setProperty('--alert-color', '#141414');
    document.body.style.setProperty('--history-lines', '#262626');
    document.body.style.setProperty('--text-color', 'white');
    document.body.style.setProperty('--box-color', '#111');
    document.body.style.setProperty('--boxmain-bordercolor', 'plum');
    document.body.style.setProperty('--button-color', '#171717');
    document.body.style.setProperty('--hover-color', '#333');
    document.body.style.setProperty('--purplebtn-color', 'purple');
    document.body.style.setProperty('--purplehover-color', '#b300b2');
    document.body.style.setProperty('--buttonbuy-color', '#171717');
    document.body.style.setProperty('--buildings-canbuy-color', '#555');
    document.body.style.setProperty('--buildings-hover-color', '#666');
    document.body.style.setProperty('--blessings-canbuy-color', '#222');
    document.body.style.setProperty('--blessings-hover-color', '#444');
    document.body.style.setProperty('--tab-color', '#171717');
    document.body.style.setProperty('--singtab-color', 'black');
    document.body.style.setProperty('--hoversing-color', '#252525');
    document.body.style.setProperty('--shoptab-color', 'purple');
    document.body.style.setProperty('--hovershop-color', '#b300b2');
    DOMCacheGetOrSet('singularitybtn').style.backgroundColor = '#171717'; //Fake BG

    DOMCacheGetOrSet('actualPotionShop').style.backgroundColor = '' //Remove inline CSS
    DOMCacheGetOrSet('actualPotionShop').style.borderColor = ''
    DOMCacheGetOrSet('themeBox').style.backgroundColor = ''
    DOMCacheGetOrSet('themeBox').style.borderColor = ''
    DOMCacheGetOrSet('corruptionStatsLoadouts').style.backgroundColor = ''
    DOMCacheGetOrSet('corruptionStatsLoadouts').style.borderColor = ''
    DOMCacheGetOrSet('c15Rewards').style.backgroundColor = ''
    DOMCacheGetOrSet('c15Rewards').style.borderColor = ''
    DOMCacheGetOrSet('platonicUpgradeDescriptions').style.backgroundColor = ''
    DOMCacheGetOrSet('platonicUpgradeDescriptions').style.borderColor = ''
    DOMCacheGetOrSet('platonicUpgradePics').style.backgroundColor = ''
    DOMCacheGetOrSet('platonicUpgradePics').style.borderColor = ''
    DOMCacheGetOrSet('actualShop').style.backgroundColor = ''
    DOMCacheGetOrSet('actualShop').style.borderColor = ''
    DOMCacheGetOrSet('corruptionStatsLoadouts').style.backgroundColor = ''
    DOMCacheGetOrSet('corruptionStatsLoadouts').style.borderColor = ''
    DOMCacheGetOrSet('heptGrid').style.backgroundColor = ''
    DOMCacheGetOrSet('heptGrid').style.borderColor = ''
    DOMCacheGetOrSet('actualSingularityUpgradeContainer').style.backgroundColor = ''
    DOMCacheGetOrSet('actualSingularityUpgradeContainer').style.borderColor = ''

    DOMCacheGetOrSet('exportgame').style.backgroundColor = '' //From darker mode
    DOMCacheGetOrSet('importFileButton').style.backgroundColor = ''

    DOMCacheGetOrSet('achievementcolorcode2').style.color = '' //From Dracula and Light mode
    DOMCacheGetOrSet('corruptionDescription').style.color = ''
    DOMCacheGetOrSet('corruptionIntroduction').style.color = ''
    DOMCacheGetOrSet('corruptionTesseractsValue').style.color = 'darkviolet' //These ones use HTML as color
    DOMCacheGetOrSet('corruptionTotalScore').style.color = 'darkorchid'
    DOMCacheGetOrSet('corruptionAntExponentValue').style.color = 'darkorchid'
    DOMCacheGetOrSet('confirmationToggleTitle').style.color = 'pink'
    DOMCacheGetOrSet('specialActionsTitle').style.color = 'pink'
    DOMCacheGetOrSet('themesTitle').style.color = 'pink'
    DOMCacheGetOrSet('antwelcome').style.color = 'lightslategrey'
    DOMCacheGetOrSet('switchTheme2').style.borderColor = 'darkslategray'
}