import { DOMCacheGetOrSet } from './Cache/DOM';

export const toggleTheme = (theme: number, resetColors: boolean) => {
    const themeButton = DOMCacheGetOrSet('theme');

    if (theme === 1) { //Switches to 'Dark Mode'
        resetThemeColors(false);

        themeButton.textContent = 'Dark Mode';
        localStorage.removeItem('theme') //No need to save it
    } else if (theme === 2) { //Switches to 'Darker Mode'
        resetThemeColors(resetColors);
        document.body.style.setProperty('--bg-color', '#0c0c0f');
        document.body.style.setProperty('--alert-color', '#040406');
        document.body.style.setProperty('--history-lines', '#1b1b22');
        document.body.style.setProperty('--box-color', '#060606');
        document.body.style.setProperty('--boxmain-bordercolor', '#d487d4');
        document.body.style.setProperty('--button-color', '#040406');
        document.body.style.setProperty('--hover-color', '#1b1b22');
        document.body.style.setProperty('--purplebtn-color', '#6f006f');
        document.body.style.setProperty('--buttonbuy-color', '#040406');
        document.body.style.setProperty('--buildings-canbuy-color', '#2c2c44');
        document.body.style.setProperty('--buildings-hover-color', '#3a3a58');
        document.body.style.setProperty('--blessings-canbuy-color', '#262639');
        document.body.style.setProperty('--blessings-hover-color', '#33334e');
        document.body.style.setProperty('--tab-color', 'black');
        document.body.style.setProperty('--singtab-color', '#002');
        document.body.style.setProperty('--hoversing-color', '#00007d');
        document.body.style.setProperty('--shoptab-color', '#6f006f');
        document.body.style.setProperty('--hepteract-bar-empty', '#3a3a58');
        document.body.style.setProperty('--hepteract-bar-red', 'darkred');
        document.body.style.setProperty('--hepteract-bar-yellow', '#997a00');
        document.body.style.setProperty('--hepteract-bar-green', 'darkgreen');
        DOMCacheGetOrSet('corruptionStatsLoadouts').style.borderColor = '#dd8f00'
        DOMCacheGetOrSet('actualPotionShop').style.borderColor = '#dd0'
        DOMCacheGetOrSet('exportgame').style.backgroundColor = 'black' //Special cases
        DOMCacheGetOrSet('importFileButton').style.backgroundColor = 'black'

        themeButton.textContent = 'Darker Mode';
        localStorage.setItem('theme', '2');
    } else if (theme === 3) { //Switches to 'Lighter Dark Mode'
        resetThemeColors(resetColors);
        document.body.style.setProperty('--bg-color', '#1c1b22');
        document.body.style.setProperty('--alert-color', '#141319');
        document.body.style.setProperty('--history-lines', '#083a3a');
        document.body.style.setProperty('--box-color', '#141319');
        document.body.style.setProperty('--boxmain-bordercolor', '#dda0dd');
        document.body.style.setProperty('--button-color', '#101828');
        document.body.style.setProperty('--hover-color', '#006');
        document.body.style.setProperty('--buttonbuy-color', '#0b111c');
        document.body.style.setProperty('--buildings-canbuy-color', '#2d4471');
        document.body.style.setProperty('--buildings-hover-color', '#3c5a95');
        document.body.style.setProperty('--blessings-canbuy-color', '#1e2e4d');
        document.body.style.setProperty('--blessings-hover-color', '#2d4471');
        document.body.style.setProperty('--tab-color', '#101828');
        document.body.style.setProperty('--hoversing-color', '#005');
        document.body.style.setProperty('--hepteract-bar-empty', '#535064');
        DOMCacheGetOrSet('corruptionStatsLoadouts').style.borderColor = '#ffa500'
        DOMCacheGetOrSet('actualPotionShop').style.borderColor = '#dd0'
        DOMCacheGetOrSet('actualShop').style.backgroundColor = '#0c0c0f' //Special cases
        DOMCacheGetOrSet('actualShop').style.borderColor = '#d487d4'
        DOMCacheGetOrSet('platonicUpgradePics').style.backgroundColor = '#0c0c0f'
        DOMCacheGetOrSet('startChallenge').style.backgroundColor = '#101828'

        themeButton.textContent = 'Lighter Dark Mode';
        localStorage.setItem('theme', '3');
    } else if (theme === 4) { //Switches to 'Light Mode'
        resetThemeColors(resetColors);
        document.body.classList.add('textOutline')
        document.body.style.setProperty('--bg-color', '#7c7891');
        document.body.style.setProperty('--alert-color', '#646175');
        document.body.style.setProperty('--history-lines', '#156e71');
        document.body.style.setProperty('--box-color', '#646175');
        document.body.style.setProperty('--boxmain-bordercolor', '#d894d8');
        document.body.style.setProperty('--button-color', '#136062');
        document.body.style.setProperty('--hover-color', '#187c7f');
        document.body.style.setProperty('--buttonbuy-color', '#4c495a');
        document.body.style.setProperty('--buildings-canbuy-color', '#9794a8');
        document.body.style.setProperty('--buildings-hover-color', '#b2b0bf');
        document.body.style.setProperty('--blessings-canbuy-color', '#6c687f');
        document.body.style.setProperty('--blessings-hover-color', '#7c7990');
        document.body.style.setProperty('--tab-color', '#105254');
        document.body.style.setProperty('--singtab-color', '#00d');
        document.body.style.setProperty('--hoversing-color', '#1052B6');
        document.body.style.setProperty('--hepteract-bar-empty', '#858199');
        document.body.style.setProperty('--hepteract-bar-red', '#ea1741');
        document.body.style.setProperty('--hepteract-bar-yellow', '#cc0');
        document.body.style.setProperty('--hepteract-bar-green', 'limegreen');
        DOMCacheGetOrSet('corruptionStatsLoadouts').style.borderColor = '#dd8f00'
        DOMCacheGetOrSet('actualPotionShop').style.borderColor = '#dd0'
        DOMCacheGetOrSet('switchTheme2').style.borderColor = '#284242' //Special Cases
        DOMCacheGetOrSet('startChallenge').style.backgroundColor = '#105254'
        document.body.style.setProperty('--darkorchid-text-color', '#cf9ee8'); //to make easier to read text
        document.body.style.setProperty('--orchid-text-color', '#dd7dda');
        document.body.style.setProperty('--darkcyan-text-color', 'turquoise');
        document.body.style.setProperty('--crimson-text-color', '#f7617d');
        document.body.style.setProperty('--red-text-color', '#f55');
        document.body.style.setProperty('--orangered-text-color', '#f74');
        document.body.style.setProperty('--gray-text-color', '#a5a5a5');
        document.body.style.setProperty('--green-text-color', 'limegreen');
        DOMCacheGetOrSet('achievementcolorcode2').style.color = '#dc7dff'
        DOMCacheGetOrSet('corruptionDescription').style.color = '#d272ff'
        DOMCacheGetOrSet('corruptionTesseractsValue').style.color = '#d272ff'
        DOMCacheGetOrSet('antwelcome').style.color = '#b1b1b1'
        DOMCacheGetOrSet('versionnumber').style.color = '#ff5aff'
        DOMCacheGetOrSet('SacrificeTimeMultiplier').style.color = 'limegreen'
        DOMCacheGetOrSet('singularitytab').style.color = '#ff5252'
        DOMCacheGetOrSet('traitstab').style.color = '#ff5252'
        DOMCacheGetOrSet('cubetab').style.color = '#ff5252'
        DOMCacheGetOrSet('antspecies').style.color = '#8da9ff'
        DOMCacheGetOrSet('ascTimeAccel').style.color = '#97b0ff'
        DOMCacheGetOrSet('cube6Bonus').style.color = '#a5a5a5'
        DOMCacheGetOrSet('tesseract6Bonus').style.color = '#a5a5a5'
        DOMCacheGetOrSet('hypercube6Bonus').style.color = '#a5a5a5'
        DOMCacheGetOrSet('c15Reward29').style.color = '#a5a5a5'
        DOMCacheGetOrSet('c15Reward29Num').style.color = '#a5a5a5'
        DOMCacheGetOrSet('hypercubeWelcome').style.color = '#f58'
        DOMCacheGetOrSet('hypercubeInventory').style.color = '#f58'
        DOMCacheGetOrSet('hypercubeBlessingsTotal').style.color = '#f58'
        DOMCacheGetOrSet('runeshowpower5').style.color = '#ff7158'

        themeButton.textContent = 'Light Mode'; //No idea if to make Lightest mode or not, if to do BG color could be #aba8c8
        localStorage.setItem('theme', '4');
    } else if (theme === 5) { //Switches to 'Dracula Mode'
        resetThemeColors(resetColors);
        document.body.style.setProperty('--bg-color', '#131319');
        document.body.style.setProperty('--alert-color', '#2a1035');
        document.body.style.setProperty('--history-lines', '#012d1c');
        document.body.style.setProperty('--text-color', '#ac47ff');
        document.body.style.setProperty('--darkorchid-text-color', '#c205ff');
        document.body.style.setProperty('--orchid-text-color', '#fd59f7');
        document.body.style.setProperty('--crimson-text-color', '#eb0000');
        document.body.style.setProperty('--gray-text-color', '#ff00c8');
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
        document.body.style.setProperty('--hepteract-bar-empty', '#4a4a60');
        document.body.style.setProperty('--hepteract-bar-red', '#c90000');
        document.body.style.setProperty('--hepteract-bar-yellow', '#919100');
        document.body.style.setProperty('--hepteract-bar-green', '#007f3b');
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
        DOMCacheGetOrSet('heptGrid').style.borderColor = '#9b7306'
        DOMCacheGetOrSet('actualSingularityUpgradeContainer').style.backgroundColor = '#000000'
        DOMCacheGetOrSet('actualSingularityUpgradeContainer').style.borderColor = '#b341e0'
        DOMCacheGetOrSet('startChallenge').style.backgroundColor = '#320032'
        DOMCacheGetOrSet('achievementcolorcode2').style.color = '#ef00e4' //Text colors
        DOMCacheGetOrSet('corruptionDescription').style.color = '#c205ff'
        DOMCacheGetOrSet('corruptionTesseractsValue').style.color = '#c205ff'
        DOMCacheGetOrSet('antwelcome').style.color = 'darkgrey'
        DOMCacheGetOrSet('confirmationToggleTitle').style.color = '#eb0000'
        DOMCacheGetOrSet('specialActionsTitle').style.color = '#eb0000'
        DOMCacheGetOrSet('themesTitle').style.color = '#eb0000'
        DOMCacheGetOrSet('autoHepteractPercentage').style.color = '#ff0000'
        DOMCacheGetOrSet('hepteractWelcome').style.color = '#ac47ff'
        DOMCacheGetOrSet('confirmationdisclaimer').style.color = '#bb68ff'
        DOMCacheGetOrSet('antspecies').style.color = '#184ff3'
        DOMCacheGetOrSet('c15Reward29').style.color = '#8f8f8f'
        DOMCacheGetOrSet('c15Reward29Num').style.color = '#8f8f8f'
        DOMCacheGetOrSet('bonussummation').style.color = '#eb0000'

        themeButton.textContent = 'Dracula Mode';
        localStorage.setItem('theme', '5');
    }
    // If you want to add your own theme, then here is short turorial: (Case sentitive)
    // } else if (theme === 'number 1 higher than previos theme') {
    //    resetThemeColors(resetColors);
    //    Changes you want (document.body.style.setProperty or DOMCacheGetOrSet)
    //
    //    themeButton.textContent = 'Name of your theme';
    //    localStorage.setItem('theme', '1 higher');
    // }
    // You will need to do in other files:
    // in EventListeners.ts change (theme <= number) into 1 higher number (Should be on bottom);
    // in index.html - <button id="switchTheme 1 higher" alt="same as ID" label="same as ID" class="themeButton" style="border: 2px solid color you want">Name of Mode</button> (Where other buttons are)
    //
    // Will need to Add document.body.style.setProperty for every change of colors you want:
    // '--bg-color' - for BG color; for more complex BG instead add new class in css and use document.body.classList.remove('bodycolor') .add('new class'), will need to revert it inside resetThemeColors;
    // '--alert-color' - for notifications and alert BG; '--history-lines' for lines color in history tab;
    // '--text-color' - main text color (white text that is not part of "Rainbow"); Other colors:
    // '--darkorchid-text-color'; '--orchid-text-color'; '--darkcyan-text-color'; '--crimson-text-color'; '--red-text-color'; '--orangered-text-color'; '--gray-text-color'; '--green-text-color'; (Colors that are less than 4 ID's arent in here, but some can be found in resetThemeColors)
    // '--box-color' - inside color of boxes; '--boxmain-bordercolor' - for most borders; DOMCacheGetOrSet('ID') instead for Potion and Corruptions box borders;
    // '--button-color' - Most of buttons colors, for hover color use '--hover-color'; for purple buttons use '--purplebtn-color' and '--purplehover-color'; dont change extra individual buttons (Can change border colors, if not a toggle) as that might break hover color;
    // '--tab-color' - doesnt include text, as well Shop and Singularity tab; '--singtab-color' - for Singularity tab and '--hoversing-color' for hover color; for shop tab use these '--shoptab-color' and '--hovershop-color';
    // '--buttonbuy-color' buying buldings buttons (When can't afford); '--buildings-canbuy-color' and '--blessings-canbuy-color' if you can afford; '--buildings-hover-color' and '--blessings-hover-color' if you can afford and hovering over it;
    // '--hepteract-bar-empty' for main bar color (inside Hepteract area); for fill colors - '--hepteract-bar-red'; '--hepteract-bar-yellow'; '--hepteract-bar-green'
    // If you change any individual ID's dont forget to remove inline CSS in resetThemeColors (Unless HTML gives color, then DOMCacheGetOrSet original color)
}

export const resetThemeColors = (firstLoad: boolean) => {
    document.body.style.setProperty('--crimson-text-color', 'crimson'); //They requirements a value, if theme is deffault on refresh
    document.body.style.setProperty('--red-text-color', 'red');
    document.body.style.setProperty('--green-text-color', 'green');
    document.body.style.setProperty('--orchid-text-color', 'orchid');
    document.body.style.setProperty('--hepteract-bar-red', 'red');
    document.body.style.setProperty('--hepteract-bar-yellow', '#cca300');
    document.body.style.setProperty('--hepteract-bar-green', 'green');
    if (!firstLoad) { //Reverts all colors back to default (allows to switch themes in any order)
        document.body.style.setProperty('--bg-color', '#111'); //In case new theme doesnt use some
        document.body.style.setProperty('--alert-color', '#141414');
        document.body.style.setProperty('--history-lines', '#262626');
        document.body.style.setProperty('--text-color', 'white');
        document.body.style.setProperty('--darkorchid-text-color', 'darkorchid');
        document.body.style.setProperty('--darkcyan-text-color', 'darkcyan');
        document.body.style.setProperty('--gray-text-color', 'gray');
        document.body.style.setProperty('--orangered-text-color', 'orangered');
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
        document.body.style.setProperty('--hepteract-bar-empty', '#555');
        document.body.classList.remove('textOutline') //Remove all new classes here
        //document.body.classList.add('bodycolor')
        DOMCacheGetOrSet('actualPotionShop').style.backgroundColor = '' //Remove inline CSS
        DOMCacheGetOrSet('actualPotionShop').style.borderColor = ''
        DOMCacheGetOrSet('themeBox').style.backgroundColor = ''
        DOMCacheGetOrSet('themeBox').style.borderColor = ''
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
        DOMCacheGetOrSet('startChallenge').style.backgroundColor = ''
        DOMCacheGetOrSet('exportgame').style.backgroundColor = ''
        DOMCacheGetOrSet('importFileButton').style.backgroundColor = ''
        DOMCacheGetOrSet('bonussummation').style.color = '' //From Dracula mode (part of orangered class)
        DOMCacheGetOrSet('achievementcolorcode2').style.color = '' //purple text
        DOMCacheGetOrSet('corruptionDescription').style.color = '' //darkviolet
        DOMCacheGetOrSet('corruptionTesseractsValue').style.color = ''
        DOMCacheGetOrSet('antwelcome').style.color = '' //lightslategrey
        DOMCacheGetOrSet('versionnumber').style.color = '' //fuchsia
        DOMCacheGetOrSet('singularitytab').style.color = '' //red text inside tabs
        DOMCacheGetOrSet('traitstab').style.color = ''
        DOMCacheGetOrSet('cubetab').style.color = ''
        DOMCacheGetOrSet('ascTimeAccel').style.color = '' //royalblue
        DOMCacheGetOrSet('antspecies').style.color = 'royalblue' //HTML colors
        DOMCacheGetOrSet('switchTheme2').style.borderColor = 'darkslategray'
        DOMCacheGetOrSet('SacrificeTimeMultiplier').style.color = 'lightseagreen'
        DOMCacheGetOrSet('confirmationToggleTitle').style.color = 'pink'
        DOMCacheGetOrSet('specialActionsTitle').style.color = 'pink'
        DOMCacheGetOrSet('themesTitle').style.color = 'pink'
        DOMCacheGetOrSet('hepteractWelcome').style.color = 'pink'
        DOMCacheGetOrSet('confirmationdisclaimer').style.color = 'plum'
        DOMCacheGetOrSet('cube6Bonus').style.color = 'brown'
        DOMCacheGetOrSet('tesseract6Bonus').style.color = 'brown'
        DOMCacheGetOrSet('hypercube6Bonus').style.color = 'brown'
        DOMCacheGetOrSet('c15Reward29').style.color = 'grey'
        DOMCacheGetOrSet('c15Reward29Num').style.color = 'grey'
        DOMCacheGetOrSet('runeshowpower5').style.color = 'tomato'
        DOMCacheGetOrSet('autoHepteractPercentage').style.color = 'gold'
        DOMCacheGetOrSet('hypercubeWelcome').style.color = '#ff004c' //Hypercube colors
        DOMCacheGetOrSet('hypercubeInventory').style.color = '#ff004c'
        DOMCacheGetOrSet('hypercubeBlessingsTotal').style.color = '#ff004c'
    }
}