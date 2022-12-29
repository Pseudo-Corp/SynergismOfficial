import { player } from './Synergism';
import { DOMCacheGetOrSet } from './Cache/DOM';

export const toggleTheme = (initial = false, themeNumber = 1, change = false) => {
    const themeButton = DOMCacheGetOrSet('theme');
    const body = document.body;

    if (change) {
        localStorage.setItem('theme', `${themeNumber}`);
        body.style.setProperty('--transition', '750ms');
        body.style.setProperty('--transition-extra', '600ms');
    } else {
        themeNumber = Number(localStorage.getItem('theme') ?? 1);
    }

    /* Full reset for easy out of order change */
    if (!initial) { //For quicker first load
        body.style.removeProperty('--header-color');
        body.style.removeProperty('--bg-color');
        body.style.removeProperty('--alert-color');
        body.style.removeProperty('--history-lines');
        body.style.removeProperty('--text-color');
        body.style.removeProperty('--green-text-color');
        body.style.removeProperty('--lightseagreen-text-color');
        body.style.removeProperty('--crimson-text-color');
        body.style.removeProperty('--red-text-color');
        body.style.removeProperty('--maroon-text-color');
        body.style.removeProperty('--orchid-text-color');
        body.style.removeProperty('--darkorchid-text-color');
        body.style.removeProperty('--darkcyan-text-color');
        body.style.removeProperty('--gray-text-color');
        body.style.removeProperty('--orangered-text-color');
        body.style.removeProperty('--box-color');
        body.style.removeProperty('--boxmain-bordercolor');
        body.style.removeProperty('--button-color');
        body.style.removeProperty('--hover-color');
        body.style.removeProperty('--blackbtn-color');
        body.style.removeProperty('--purplebtn-color');
        body.style.removeProperty('--purplehover-color');
        body.style.removeProperty('--buttonbuy-color');
        body.style.removeProperty('--buildings-canbuy-color');
        body.style.removeProperty('--buildings-hover-color');
        body.style.removeProperty('--blessings-canbuy-color');
        body.style.removeProperty('--blessings-hover-color');
        body.style.removeProperty('--tab-color');
        body.style.removeProperty('--singtab-color');
        body.style.removeProperty('--hoversing-color');
        body.style.removeProperty('--shoptab-color');
        body.style.removeProperty('--hovershop-color');
        body.style.removeProperty('--hepteract-bar-empty');
        body.style.removeProperty('--hepteract-bar-red');
        body.style.removeProperty('--hepteract-bar-yellow');
        body.style.removeProperty('--hepteract-bar-green');
        body.classList.remove('textOutline');
        //body.classList.add('bodycolor');
        DOMCacheGetOrSet('actualPotionShop').style.backgroundColor = '';
        DOMCacheGetOrSet('actualPotionShop').style.borderColor = '';
        DOMCacheGetOrSet('themeBox').style.backgroundColor = '';
        DOMCacheGetOrSet('themeBox').style.borderColor = '';
        DOMCacheGetOrSet('c15Rewards').style.backgroundColor = '';
        DOMCacheGetOrSet('c15Rewards').style.borderColor = '';
        DOMCacheGetOrSet('platonicUpgradeDescriptions').style.backgroundColor = '';
        DOMCacheGetOrSet('platonicUpgradeDescriptions').style.borderColor = '';
        DOMCacheGetOrSet('platonicUpgradePics').style.backgroundColor = '';
        DOMCacheGetOrSet('platonicUpgradePics').style.borderColor = '';
        DOMCacheGetOrSet('actualShop').style.backgroundColor = '';
        DOMCacheGetOrSet('actualShop').style.borderColor = '';
        DOMCacheGetOrSet('corruptionStatsLoadouts').style.backgroundColor = '';
        DOMCacheGetOrSet('corruptionStatsLoadouts').style.borderColor = '';
        DOMCacheGetOrSet('heptGrid').style.backgroundColor = '';
        DOMCacheGetOrSet('heptGrid').style.borderColor = '';
        DOMCacheGetOrSet('exportgame').style.backgroundColor = '';
        DOMCacheGetOrSet('importFileButton').style.backgroundColor = '';
        DOMCacheGetOrSet('switchTheme2').style.borderColor = 'darkslategray';

        DOMCacheGetOrSet('bonussummation').style.color = 'orangered'; //CSS colors, instead of having '', will write out full color, in case someone will move CSS color into HTML
        DOMCacheGetOrSet('corruptionDescription').style.color = 'darkviolet';
        DOMCacheGetOrSet('versionnumber').style.color = 'fuchsia';
        DOMCacheGetOrSet('singularitytab').style.color = 'red';
        DOMCacheGetOrSet('traitstab').style.color = 'red';
        DOMCacheGetOrSet('cubetab').style.color = 'red';
        DOMCacheGetOrSet('ascTimeAccel').style.color = 'royalblue';
        DOMCacheGetOrSet('buildinghotkeys').style.color = 'lightgray';
        DOMCacheGetOrSet('antspecies').style.color = 'royalblue'; //HTML colors
        DOMCacheGetOrSet('achievementcolorcode2').style.color = 'purple';
        DOMCacheGetOrSet('corruptionTesseractsValue').style.color = 'darkviolet';
        DOMCacheGetOrSet('antwelcome').style.color = 'lightslategrey';
        DOMCacheGetOrSet('confirmationToggleTitle').style.color = 'pink';
        DOMCacheGetOrSet('specialActionsTitle').style.color = 'pink';
        DOMCacheGetOrSet('themesTitle').style.color = 'pink';
        DOMCacheGetOrSet('notationTitle').style.color = 'pink';
        DOMCacheGetOrSet('hepteractWelcome').style.color = 'pink';
        DOMCacheGetOrSet('confirmationdisclaimer').style.color = 'plum';
        DOMCacheGetOrSet('cube6Bonus').style.color = 'brown';
        DOMCacheGetOrSet('tesseract6Bonus').style.color = 'brown';
        DOMCacheGetOrSet('hypercube6Bonus').style.color = 'brown';
        DOMCacheGetOrSet('runeshowpower5').style.color = 'tomato';
        DOMCacheGetOrSet('hypercubeWelcome').style.color = '#ff004c'; //Hypercube colors
        DOMCacheGetOrSet('hypercubeInventory').style.color = '#ff004c';
        DOMCacheGetOrSet('hypercubeBlessingsTotal').style.color = '#ff004c';
    } else {
        if (themeNumber === 4) {
            DOMCacheGetOrSet('logo').setAttribute('src', 'Pictures/logoLight.png');
        }
    }

    if (themeNumber === 1) {
        localStorage.removeItem('theme');
        themeButton.textContent = 'Dark Mode';
    } else if (themeNumber === 2) { //'Darker Mode'
        body.style.setProperty('--header-color', 'black');
        body.style.setProperty('--bg-color', '#0c0c0f');
        body.style.setProperty('--alert-color', '#040406');
        body.style.setProperty('--history-lines', '#1b1b22');
        body.style.setProperty('--box-color', '#060606');
        body.style.setProperty('--boxmain-bordercolor', '#d487d4');
        body.style.setProperty('--button-color', '#040406');
        body.style.setProperty('--hover-color', '#1b1b22');
        body.style.setProperty('--purplebtn-color', '#6f006f');
        body.style.setProperty('--buttonbuy-color', '#040406');
        body.style.setProperty('--buildings-canbuy-color', '#2c2c44');
        body.style.setProperty('--buildings-hover-color', '#3a3a58');
        body.style.setProperty('--blessings-canbuy-color', '#262639');
        body.style.setProperty('--blessings-hover-color', '#33334e');
        body.style.setProperty('--tab-color', 'black');
        body.style.setProperty('--singtab-color', '#002');
        body.style.setProperty('--hoversing-color', '#00007d');
        body.style.setProperty('--shoptab-color', '#6f006f');
        body.style.setProperty('--hepteract-bar-empty', '#3a3a58');
        body.style.setProperty('--hepteract-bar-red', 'darkred');
        body.style.setProperty('--hepteract-bar-yellow', '#997a00');
        body.style.setProperty('--hepteract-bar-green', 'darkgreen');
        DOMCacheGetOrSet('corruptionStatsLoadouts').style.borderColor = '#dd8f00';
        DOMCacheGetOrSet('actualPotionShop').style.borderColor = '#dd0';
        DOMCacheGetOrSet('exportgame').style.backgroundColor = 'black'; //Special cases
        DOMCacheGetOrSet('importFileButton').style.backgroundColor = 'black';

        themeButton.textContent = 'Darker Mode';
    } else if (themeNumber === 3) { //'Lighter Dark Mode'
        body.style.setProperty('--header-color', '#18171c');
        body.style.setProperty('--bg-color', '#1c1b22');
        body.style.setProperty('--alert-color', '#141319');
        body.style.setProperty('--history-lines', '#083a3a');
        body.style.setProperty('--box-color', '#141319');
        body.style.setProperty('--boxmain-bordercolor', '#dda0dd');
        body.style.setProperty('--button-color', '#101828');
        body.style.setProperty('--hover-color', '#006');
        body.style.setProperty('--blackbtn-color', '#101828');
        body.style.setProperty('--buttonbuy-color', '#0b111c');
        body.style.setProperty('--buildings-canbuy-color', '#2d4471');
        body.style.setProperty('--buildings-hover-color', '#3c5a95');
        body.style.setProperty('--blessings-canbuy-color', '#1e2e4d');
        body.style.setProperty('--blessings-hover-color', '#2d4471');
        body.style.setProperty('--tab-color', '#101828');
        body.style.setProperty('--hoversing-color', '#005');
        body.style.setProperty('--hepteract-bar-empty', '#535064');
        DOMCacheGetOrSet('corruptionStatsLoadouts').style.borderColor = '#ffa500';
        DOMCacheGetOrSet('actualPotionShop').style.borderColor = '#dd0';
        DOMCacheGetOrSet('actualShop').style.backgroundColor = '#0c0c0f'; //Special cases
        DOMCacheGetOrSet('actualShop').style.borderColor = '#d487d4';
        DOMCacheGetOrSet('platonicUpgradePics').style.backgroundColor = '#0c0c0f';
        body.style.setProperty('--maroon-text-color', '#a90000');

        themeButton.textContent = 'Lighter Dark Mode';
    } else if (themeNumber === 4) { //'Light Mode'
        body.classList.add('textOutline');
        body.style.setProperty('--header-color', '#736e8d');
        body.style.setProperty('--bg-color', '#7c7891');
        body.style.setProperty('--alert-color', '#646175');
        body.style.setProperty('--history-lines', '#156e71');
        body.style.setProperty('--box-color', '#646175');
        body.style.setProperty('--boxmain-bordercolor', '#d894d8');
        body.style.setProperty('--button-color', '#136062');
        body.style.setProperty('--hover-color', '#187c7f');
        body.style.setProperty('--blackbtn-color', '#105254');
        body.style.setProperty('--buttonbuy-color', '#4c495a');
        body.style.setProperty('--buildings-canbuy-color', '#9794a8');
        body.style.setProperty('--buildings-hover-color', '#b2b0bf');
        body.style.setProperty('--blessings-canbuy-color', '#6c687f');
        body.style.setProperty('--blessings-hover-color', '#7c7990');
        body.style.setProperty('--tab-color', '#105254');
        body.style.setProperty('--singtab-color', '#00d');
        body.style.setProperty('--hoversing-color', '#1052B6');
        body.style.setProperty('--hepteract-bar-empty', '#858199');
        body.style.setProperty('--hepteract-bar-red', '#ea1741');
        body.style.setProperty('--hepteract-bar-yellow', '#cc0');
        body.style.setProperty('--hepteract-bar-green', 'limegreen');
        DOMCacheGetOrSet('corruptionStatsLoadouts').style.borderColor = '#dd8f00';
        DOMCacheGetOrSet('actualPotionShop').style.borderColor = '#dd0';
        DOMCacheGetOrSet('switchTheme2').style.borderColor = '#284242'; //Special Cases
        body.style.setProperty('--green-text-color', 'limegreen');
        body.style.setProperty('--red-text-color', '#f55');
        body.style.setProperty('--maroon-text-color', '#ff5656');
        body.style.setProperty('--crimson-text-color', '#f7617d');
        body.style.setProperty('--orchid-text-color', '#dd7dda');
        body.style.setProperty('--darkorchid-text-color', '#cf9ee8');
        body.style.setProperty('--darkcyan-text-color', 'turquoise');
        body.style.setProperty('--lightseagreen-text-color', 'limegreen');
        body.style.setProperty('--orangered-text-color', '#f74');
        body.style.setProperty('--gray-text-color', '#a5a5a5');
        DOMCacheGetOrSet('achievementcolorcode2').style.color = '#dc7dff';
        DOMCacheGetOrSet('corruptionDescription').style.color = '#d272ff';
        DOMCacheGetOrSet('corruptionTesseractsValue').style.color = '#d272ff';
        DOMCacheGetOrSet('antwelcome').style.color = '#b1b1b1';
        DOMCacheGetOrSet('versionnumber').style.color = '#ff5aff';
        DOMCacheGetOrSet('singularitytab').style.color = '#ff5252';
        DOMCacheGetOrSet('traitstab').style.color = '#ff5252';
        DOMCacheGetOrSet('cubetab').style.color = '#ff5252';
        DOMCacheGetOrSet('antspecies').style.color = '#8da9ff';
        DOMCacheGetOrSet('ascTimeAccel').style.color = '#97b0ff';
        DOMCacheGetOrSet('cube6Bonus').style.color = '#a5a5a5';
        DOMCacheGetOrSet('tesseract6Bonus').style.color = '#a5a5a5';
        DOMCacheGetOrSet('hypercube6Bonus').style.color = '#a5a5a5';
        DOMCacheGetOrSet('hypercubeWelcome').style.color = '#f58';
        DOMCacheGetOrSet('hypercubeInventory').style.color = '#f58';
        DOMCacheGetOrSet('hypercubeBlessingsTotal').style.color = '#f58';
        DOMCacheGetOrSet('runeshowpower5').style.color = '#ff7158';

        themeButton.textContent = 'Light Mode';
    } else if (themeNumber === 5) { //'Dracula Mode'
        body.style.setProperty('--header-color', '#0a0a11');
        body.style.setProperty('--bg-color', '#131319');
        body.style.setProperty('--alert-color', '#2a1035');
        body.style.setProperty('--history-lines', '#012d1c');
        body.style.setProperty('--text-color', '#ac47ff');
        body.style.setProperty('--maroon-text-color', '#c30000');
        body.style.setProperty('--crimson-text-color', '#eb0000');
        body.style.setProperty('--orchid-text-color', '#fd59f7');
        body.style.setProperty('--darkorchid-text-color', '#c205ff');
        body.style.setProperty('--gray-text-color', '#8f8f8f');
        body.style.setProperty('--box-color', '#000000');
        body.style.setProperty('--boxmain-bordercolor', '#b341e0');
        body.style.setProperty('--button-color', '#21003f');
        body.style.setProperty('--hover-color', '#00056a');
        body.style.setProperty('--blackbtn-color', '#28002a');
        body.style.setProperty('--purplebtn-color', '#5800a0');
        body.style.setProperty('--purplehover-color', '#680927');
        body.style.setProperty('--buttonbuy-color', '#005e00');
        body.style.setProperty('--buildings-canbuy-color', '#a00');
        body.style.setProperty('--buildings-hover-color', '#e00');
        body.style.setProperty('--blessings-canbuy-color', '#004d00');
        body.style.setProperty('--blessings-hover-color', '#800');
        body.style.setProperty('--tab-color', '#1a0030');
        body.style.setProperty('--singtab-color', '#000230');
        body.style.setProperty('--hoversing-color', '#000463');
        body.style.setProperty('--shoptab-color', '#5800a0');
        body.style.setProperty('--hovershop-color', '#7400d3');
        body.style.setProperty('--hepteract-bar-empty', '#4a4a60');
        body.style.setProperty('--hepteract-bar-red', '#c90000');
        body.style.setProperty('--hepteract-bar-yellow', '#919100');
        body.style.setProperty('--hepteract-bar-green', '#007f3b');
        DOMCacheGetOrSet('themeBox').style.backgroundColor = '#0a0a11'; //Special cases
        DOMCacheGetOrSet('themeBox').style.borderColor = '#3c006d';
        DOMCacheGetOrSet('c15Rewards').style.backgroundColor = '#2e001b';
        DOMCacheGetOrSet('c15Rewards').style.borderColor = '#186e83';
        DOMCacheGetOrSet('platonicUpgradeDescriptions').style.backgroundColor = '#2e001b';
        DOMCacheGetOrSet('platonicUpgradeDescriptions').style.borderColor = '#186e83';
        DOMCacheGetOrSet('platonicUpgradePics').style.backgroundColor = '#720505';
        DOMCacheGetOrSet('platonicUpgradePics').style.borderColor = '#410303';
        DOMCacheGetOrSet('actualPotionShop').style.backgroundColor = '#01192c';
        DOMCacheGetOrSet('actualPotionShop').style.borderColor = '#04d481';
        DOMCacheGetOrSet('actualShop').style.backgroundColor = '#11111b';
        DOMCacheGetOrSet('actualShop').style.borderColor = '#038ba8';
        DOMCacheGetOrSet('corruptionStatsLoadouts').style.backgroundColor = '#0a0a11';
        DOMCacheGetOrSet('corruptionStatsLoadouts').style.borderColor = '#04d481';
        DOMCacheGetOrSet('heptGrid').style.backgroundColor = '#11111b';
        DOMCacheGetOrSet('heptGrid').style.borderColor = '#9b7306';
        DOMCacheGetOrSet('achievementcolorcode2').style.color = '#ef00e4'; //Text colors
        DOMCacheGetOrSet('corruptionDescription').style.color = '#c205ff';
        DOMCacheGetOrSet('corruptionTesseractsValue').style.color = '#c205ff';
        DOMCacheGetOrSet('antwelcome').style.color = 'darkgrey';
        DOMCacheGetOrSet('confirmationToggleTitle').style.color = '#eb0000';
        DOMCacheGetOrSet('specialActionsTitle').style.color = '#eb0000';
        DOMCacheGetOrSet('themesTitle').style.color = '#eb0000';
        DOMCacheGetOrSet('notationTitle').style.color = '#eb0000';
        DOMCacheGetOrSet('hepteractWelcome').style.color = '#ac47ff';
        DOMCacheGetOrSet('confirmationdisclaimer').style.color = '#bb68ff';
        DOMCacheGetOrSet('antspecies').style.color = '#184ff3';
        DOMCacheGetOrSet('bonussummation').style.color = '#eb0000';
        DOMCacheGetOrSet('buildinghotkeys').style.color = '#838383';

        themeButton.textContent = 'Dracula Mode';
    }
    if (change) {
        setTimeout(() => {
            body.style.removeProperty('--transition');
            body.style.removeProperty('--transition-extra');
        }, 750);
    }
};

export const toggleAnnotation = (setting = true) => {
    const notationButton = DOMCacheGetOrSet('notation');
    const current = notationButton.textContent;

    switch (current) {
        case 'Pure Scientific':
            notationButton.textContent = 'Pure Engineering';
            break;
        case 'Pure Engineering':
            notationButton.textContent = 'Default';
            break;
        default:
            notationButton.textContent = 'Pure Scientific';
    }
    if (setting === true) {
        player.notation = notationButton.textContent;
    }
}

export const settingAnnotation = () => {
    let userAnnotation = player.notation;
    const maxAnnotations = 10;
    const notationButton = DOMCacheGetOrSet('notation');
    for (let i = 0; i < maxAnnotations; i++) {
        const current = notationButton.textContent;
        if (current !== null && userAnnotation.toUpperCase() !== current.toUpperCase()) {
            toggleAnnotation(false);
        } else {
            return;
        }
    }
    userAnnotation = 'DEFAULT';
    for (let i = 0; i < maxAnnotations; i++) {
        const current = notationButton.textContent;
        if (current !== null && userAnnotation !== current.toUpperCase()) {
            toggleAnnotation(false);
        } else {
            return;
        }
    }
}
