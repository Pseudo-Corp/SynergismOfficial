import { player } from './Synergism';
import { DOMCacheGetOrSet } from './Cache/DOM';

export const toggleTheme = (setting = true) => {
    const themeButton = DOMCacheGetOrSet('theme');
    const current = themeButton.textContent;

    if (current === 'Dark Mode') { //Switches to 'Darker Mode'
        DOMCacheGetOrSet('singularitybtn').style.backgroundColor = '#171717'; //One time, until auto will be added
        document.body.style.setProperty('--bg-color', '#0c0c0f');
        document.body.style.setProperty('--alert-color', '#040406');
        document.body.style.setProperty('--history-lines', '#1b1b22');
        document.body.style.setProperty('--box-color', '#060606');
        document.body.style.setProperty('--boxmain-bordercolor', '#d487d4');
        document.body.style.setProperty('--button-color', '#040406');
        document.body.style.setProperty('--hover-color', '#1b1b22');
        document.body.style.setProperty('--buttonbuy-color', '#040406');
        document.body.style.setProperty('--buildings-canbuy-color', '#414162');
        document.body.style.setProperty('--buildings-hover-color', '#4f4f76');
        document.body.style.setProperty('--blessings-canbuy-color', '#34344d');
        document.body.style.setProperty('--blessings-hover-color', '#48486c');
        document.body.style.setProperty('--tab-color', 'black');
        document.body.style.setProperty('--singtab-color', '#002');
        document.body.style.setProperty('--hoversing-color', '#00007d');
        DOMCacheGetOrSet('corruptionStatsLoadouts').style.backgroundColor = '#060606'
        DOMCacheGetOrSet('corruptionStatsLoadouts').style.borderColor = '#dd8f00'
        DOMCacheGetOrSet('actualPotionShop').style.backgroundColor = '#060606'
        DOMCacheGetOrSet('actualPotionShop').style.borderColor = '#dd0'
        DOMCacheGetOrSet('exportgame').style.backgroundColor = 'black' //Special cases
        DOMCacheGetOrSet('importFileButton').style.backgroundColor = 'black'

        themeButton.textContent = 'Darker Mode';
    }
    if (current === 'Darker Mode') { //Switches to 'Lighter Dark Mode'
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
        document.body.style.setProperty('--singtab-color', 'black');
        document.body.style.setProperty('--hoversing-color', '#005');
        DOMCacheGetOrSet('corruptionStatsLoadouts').style.backgroundColor = '#141319'
        DOMCacheGetOrSet('corruptionStatsLoadouts').style.borderColor = '#ffa500'
        DOMCacheGetOrSet('actualPotionShop').style.backgroundColor = '#141319'
        DOMCacheGetOrSet('actualPotionShop').style.borderColor = '#dd0'
        DOMCacheGetOrSet('exportgame').style.backgroundColor = '' //Remove inline CSS
        DOMCacheGetOrSet('importFileButton').style.backgroundColor = ''
        DOMCacheGetOrSet('actualShop').style.backgroundColor = '#0c0c0f' //Special cases
        DOMCacheGetOrSet('actualShop').style.borderColor = '#d487d4'
        DOMCacheGetOrSet('platonicUpgradePics').style.backgroundColor = '#0c0c0f'

        themeButton.textContent = 'Lighter Dark Mode';
    }
    if (current === 'Lighter Dark Mode') { //Switches to 'Light Mode' (Might be reworked soon)
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
        DOMCacheGetOrSet('actualShop').style.backgroundColor = '' //Remove inline CSS
        DOMCacheGetOrSet('actualShop').style.borderColor = ''
        DOMCacheGetOrSet('platonicUpgradePics').style.backgroundColor = ''

        DOMCacheGetOrSet('achievementcolorcode2').style.color = '#ff01f3' //To make easier to read text (Maybe clean up)
        DOMCacheGetOrSet('corruptionDescription').style.color = '#ff01f3'
        DOMCacheGetOrSet('corruptionTesseractsValue').style.color = '#ff01f3'
        DOMCacheGetOrSet('corruptionTotalScore').style.color = '#ad5ad7'
        DOMCacheGetOrSet('corruptionAntExponentValue').style.color = '#ad5ad7'
        DOMCacheGetOrSet('corruptionIntroduction').style.color = '#ad5ad7'
        DOMCacheGetOrSet('antwelcome').style.color = 'darkgrey'

        themeButton.textContent = 'Light Mode';
    }
    if (current === 'Light Mode') { //Switches to 'Dracula Mode'
        document.body.style.setProperty('--bg-color', '#131319');
        document.body.style.setProperty('--alert-color', '#2a1035');
        document.body.style.setProperty('--history-lines', '#012d1c');
        document.body.style.setProperty('--text-color', '#eb0000');
        document.body.style.setProperty('--button-color', '#2a1035');
        document.body.style.setProperty('--hover-color', '#000230');
        document.body.style.setProperty('--buttonbuy-color', '#005e00');
        document.body.style.setProperty('--buildings-canbuy-color', '#a00');
        document.body.style.setProperty('--buildings-hover-color', '#e00');
        document.body.style.setProperty('--blessings-canbuy-color', '#004d00');
        document.body.style.setProperty('--blessings-hover-color', '#800');
        document.body.style.setProperty('--tab-color', '#240d2d');
        document.body.style.setProperty('--singtab-color', '#000230');
        document.body.style.setProperty('--hoversing-color', '#000463');
        DOMCacheGetOrSet('c15Rewards').style.backgroundColor = '#2e001b' //Special cases
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
        DOMCacheGetOrSet('antwelcome').style.color = 'lightslategrey' //Until text properly reworked

        themeButton.textContent = 'Dracula Mode';
    }
    // If you want to add your own theme, then do it beetwin these 2 if's, like this: (Case sentitive)
    // if (current === 'Previos theme name') {
    //    Changes you want (document.body.style.setProperty or DOMCacheGetOrSet)
    //
    //    themeButton.textContent = 'Name of your theme';
    // }
    // Dont forget to change for next theme (current === 'Name of your theme')
    // Add document.body.style.setProperty for every change you want: (Colors that are part of "rainbow" are not affected)
    // '--bg-color' - for BG color; for more complex BG instead add new class in css and use document.body.classList.remove('bodycolor') .add('new class'), dont forget to revert for next theme
    // '--alert-color' - for notifications and alert BG; '--history-lines' for lines color in history tab
    // '--text-color' - main text color; more text colors might be added later
    // '--box-color' - inside color of boxes; '--boxmain-bordercolor' - for most borders; DOMCacheGetOrSet('ID') instead for Potion and Corruptions boxes
    // '--button-color' - Most of buttons colors, for hover color use '--hover-color'; dont change extra individual buttons as that might break hover color
    // '--tab-color' - doesnt include text, as well Shop and Singularity tab; '--singtab-color' - for Singularity tab and '--hoversing-color' for hover color; Shop tab currently cant be changed, but easy to add
    // '--buttonbuy-color' buying buldings buttons (When can't afford); '--buildings-canbuy-color' and '--blessings-canbuy-color' if you can afford; '--buildings-hover-color' and '--blessings-hover-color' if you can afford and hovering over it
    // If you change any individual ID's dont forget to remove inline CSS in next theme (Unless HTML gives color)
    if (current === 'Dracula Mode') { //Switches to 'Dark Mode' and returns all colors back to deffault
        document.body.style.setProperty('--bg-color', '#111');
        document.body.style.setProperty('--alert-color', '#141414');
        document.body.style.setProperty('--history-lines', '#262626');
        document.body.style.setProperty('--text-color', 'white');
        document.body.style.setProperty('--box-color', '#111');
        document.body.style.setProperty('--boxmain-bordercolor', 'plum');
        document.body.style.setProperty('--button-color', '#171717');
        document.body.style.setProperty('--hover-color', '#333');
        document.body.style.setProperty('--buttonbuy-color', '#171717');
        document.body.style.setProperty('--buildings-canbuy-color', '#555');
        document.body.style.setProperty('--buildings-hover-color', '#666');
        document.body.style.setProperty('--blessings-canbuy-color', '#222');
        document.body.style.setProperty('--blessings-hover-color', '#444');
        document.body.style.setProperty('--tab-color', '#171717');
        document.body.style.setProperty('--singtab-color', 'black');
        document.body.style.setProperty('--hoversing-color', '#252525');
        DOMCacheGetOrSet('actualPotionShop').style.backgroundColor = '' //Remove inline CSS
        DOMCacheGetOrSet('actualPotionShop').style.borderColor = ''
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

        DOMCacheGetOrSet('achievementcolorcode2').style.color = '' //Revert text, maybe clean up
        DOMCacheGetOrSet('corruptionDescription').style.color = ''
        DOMCacheGetOrSet('corruptionIntroduction').style.color = ''
        DOMCacheGetOrSet('corruptionTesseractsValue').style.color = 'darkviolet' //These ones use HTML as color
        DOMCacheGetOrSet('corruptionTotalScore').style.color = 'darkorchid'
        DOMCacheGetOrSet('corruptionAntExponentValue').style.color = 'darkorchid'
        DOMCacheGetOrSet('confirmationToggleTitle').style.color = 'pink'
        DOMCacheGetOrSet('specialActionsTitle').style.color = 'pink'
        DOMCacheGetOrSet('themesTitle').style.color = 'pink'

        themeButton.textContent = 'Dark Mode';
    }

    if (setting === true && themeButton.textContent !== null) {
        player.theme = themeButton.textContent;
    }
}

export const settingTheme = () => {
    let userTheme = player.theme;
    const maxThemes = 10;
    const themeButton = DOMCacheGetOrSet('theme');
    for (let i = 0; i < maxThemes; i++) {
        const current = themeButton.textContent;
        if (current !== null && userTheme.toUpperCase() !== current.toUpperCase()) {
            toggleTheme(false);
        } else {
            return;
        }
    }
    userTheme = 'Dark Mode'.toUpperCase();
    for (let i = 0; i < maxThemes; i++) {
        const current = themeButton.textContent;
        if (current !== null && userTheme.toUpperCase() !== current.toUpperCase()) {
            toggleTheme(false);
        } else {
            return;
        }
    }
}

// To add an icon set, create a new folder that includes a copy of ALL image files (either new or copied from another set),
// and then edit the switch statement to include your new icon set folder.
// !!Make sure the folder name is NOT a string that is included in any image files or the text replacement will start messing things up!!
export const toggleIconSet = () => {
    const iconSetButton = DOMCacheGetOrSet('iconSet');
    const current = iconSetButton.textContent;

    let changeTo = 'Default';
    switch (current) {
        case 'Default':
            changeTo = 'Simplified';
            break;
        case 'Simplified' :
            changeTo = 'Monotonous';
            break;
        case 'Monotonous' :
            changeTo = 'Legacy';
            break;
        default:
            changeTo = 'Default';
            break;
    }

    const reg = new RegExp('' + current);
    Array.from(document.getElementsByTagName('img')).forEach(
        function(img) {
            img.src = img.src.replace(reg, changeTo);
        }
    );

    player.iconSet = changeTo;
    iconSetButton.textContent = changeTo;
}

export const initializeIcons = () => {
    const iconSetButton = DOMCacheGetOrSet('iconSet');
    const reg = new RegExp('Default');
    Array.from(document.getElementsByTagName('img')).forEach(
        function(img) {
            img.src = img.src.replace(reg, player.iconSet);
        }
    );
    iconSetButton.textContent = player.iconSet;
}

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
