import { DOMCacheGetOrSet } from './Cache/DOM';

export const toggleTheme = () => {
    const themeButton = DOMCacheGetOrSet('theme');
    const current = themeButton.textContent;
    if (current === 'Dark Mode') { //Switches to 'Darker Mode'
        //As of now it removes from runes Orange BG
        //To change BG color add new class in Synergism.css (Line 30+); .remove old class and .add your new class
        //If you are changing color of any button, then add !important in .hover for that button
        document.body.classList.remove('dark');
        document.body.classList.add('darker');
        DOMCacheGetOrSet('singularitybtn').style.backgroundColor = '#171717';
        DOMCacheGetOrSet('rune6').style.backgroundColor = '#171717';
        DOMCacheGetOrSet('rune7').style.backgroundColor = '#171717';
        DOMCacheGetOrSet('rune1').style.backgroundColor = '#171717';
        DOMCacheGetOrSet('rune2').style.backgroundColor = '#171717';
        DOMCacheGetOrSet('rune3').style.backgroundColor = '#171717';
        DOMCacheGetOrSet('rune4').style.backgroundColor = '#171717';
        DOMCacheGetOrSet('rune5').style.backgroundColor = '#171717';
        DOMCacheGetOrSet('exportgame').style.backgroundColor = '#060606'
        DOMCacheGetOrSet('importFileButton').style.backgroundColor = '#060606'
        DOMCacheGetOrSet('savegame').style.backgroundColor = '#0c0c0f'
        DOMCacheGetOrSet('deleteGame').style.backgroundColor = '#0c0c0f'
        DOMCacheGetOrSet('c15Rewards').style.backgroundColor = '#060606'
        DOMCacheGetOrSet('c15Rewards').style.borderColor = '#d487d4'
        DOMCacheGetOrSet('platonicUpgradeDescriptions').style.backgroundColor = '#060606'
        DOMCacheGetOrSet('platonicUpgradeDescriptions').style.borderColor = '#d487d4'
        DOMCacheGetOrSet('platonicUpgradePics').style.backgroundColor = '#060606'
        DOMCacheGetOrSet('platonicUpgradePics').style.borderColor = '#d487d4'
        DOMCacheGetOrSet('actualPotionShop').style.backgroundColor = '#060606'
        DOMCacheGetOrSet('actualPotionShop').style.borderColor = '#dd0'
        DOMCacheGetOrSet('actualShop').style.backgroundColor = '#060606'
        DOMCacheGetOrSet('actualShop').style.borderColor = '#d487d4'
        DOMCacheGetOrSet('corruptionStatsLoadouts').style.backgroundColor = '#060606'
        DOMCacheGetOrSet('corruptionStatsLoadouts').style.borderColor = '#dd8f00'
        DOMCacheGetOrSet('heptGrid').style.backgroundColor = '#060606'
        DOMCacheGetOrSet('heptGrid').style.borderColor = '#d487d4'
        DOMCacheGetOrSet('actualSingularityUpgradeContainer').style.backgroundColor = '#060606'
        DOMCacheGetOrSet('actualSingularityUpgradeContainer').style.borderColor = '#d487d4'

        themeButton.textContent = 'Darker Mode';
    }
    if (current === 'Darker Mode') { //Switches to 'Lighter Dark Mode'
        document.body.classList.remove('darker');
        document.body.classList.add('lightDark');
        DOMCacheGetOrSet('c15Rewards').style.backgroundColor = '#141319'
        DOMCacheGetOrSet('c15Rewards').style.borderColor = '#dda0dd'
        DOMCacheGetOrSet('platonicUpgradeDescriptions').style.backgroundColor = '#141319'
        DOMCacheGetOrSet('platonicUpgradeDescriptions').style.borderColor = '#dda0dd'
        DOMCacheGetOrSet('platonicUpgradePics').style.backgroundColor = '#0c0c0f'
        DOMCacheGetOrSet('platonicUpgradePics').style.borderColor = '#dda0dd'
        DOMCacheGetOrSet('actualPotionShop').style.backgroundColor = '#141319'
        DOMCacheGetOrSet('actualPotionShop').style.borderColor = '#dd0'
        DOMCacheGetOrSet('actualShop').style.backgroundColor = '#0c0c0f'
        DOMCacheGetOrSet('actualShop').style.borderColor = '#ffff00'
        DOMCacheGetOrSet('corruptionStatsLoadouts').style.backgroundColor = '#141319'
        DOMCacheGetOrSet('corruptionStatsLoadouts').style.borderColor = '#ffa500'
        DOMCacheGetOrSet('heptGrid').style.backgroundColor = '#141319'
        DOMCacheGetOrSet('heptGrid').style.borderColor = '#dda0dd'
        DOMCacheGetOrSet('actualSingularityUpgradeContainer').style.backgroundColor = '#141319'
        DOMCacheGetOrSet('actualSingularityUpgradeContainer').style.borderColor = '#dda0dd'


        themeButton.textContent = 'Lighter Dark Mode';
    }
    if (current === 'Lighter Dark Mode') { //Switches to 'Light Mode'
        document.body.classList.remove('lightDark');
        document.body.classList.add('light');
        DOMCacheGetOrSet('achievementcolorcode2').style.color = '#ff01f3'
        DOMCacheGetOrSet('corruptionDescription').style.color = '#ff01f3'
        DOMCacheGetOrSet('corruptionTesseractsValue').style.color = '#ff01f3'
        DOMCacheGetOrSet('corruptionTotalScore').style.color = '#ad5ad7'
        DOMCacheGetOrSet('corruptionAntExponentValue').style.color = '#ad5ad7'
        DOMCacheGetOrSet('corruptionIntroduction').style.color = '#ad5ad7'
        DOMCacheGetOrSet('c15Rewards').style.backgroundColor = '#34323e'
        DOMCacheGetOrSet('c15Rewards').style.borderColor = '#d487d4'
        DOMCacheGetOrSet('platonicUpgradeDescriptions').style.backgroundColor = '#34323e'
        DOMCacheGetOrSet('platonicUpgradeDescriptions').style.borderColor = '#d487d4'
        DOMCacheGetOrSet('platonicUpgradePics').style.backgroundColor = '#34323e'
        DOMCacheGetOrSet('platonicUpgradePics').style.borderColor = '#d487d4'
        DOMCacheGetOrSet('actualPotionShop').style.backgroundColor = '#3c3a47'
        DOMCacheGetOrSet('actualPotionShop').style.borderColor = '#dd0'
        DOMCacheGetOrSet('actualShop').style.backgroundColor = '#34323e'
        DOMCacheGetOrSet('actualShop').style.borderColor = '#d487d4'
        DOMCacheGetOrSet('corruptionStatsLoadouts').style.backgroundColor = '#3c3a47'
        DOMCacheGetOrSet('corruptionStatsLoadouts').style.borderColor = '#dd8f00'
        DOMCacheGetOrSet('heptGrid').style.backgroundColor = '#34323e'
        DOMCacheGetOrSet('heptGrid').style.borderColor = '#d487d4'
        DOMCacheGetOrSet('actualSingularityUpgradeContainer').style.backgroundColor = '#34323e'
        DOMCacheGetOrSet('actualSingularityUpgradeContainer').style.borderColor = '#d487d4'

        themeButton.textContent = 'Light Mode';
    }
    // You can add new Theme here, right before 'Dark Mode'; Dont forget to change 'current' and .remove if using new class
    if (current === 'Light Mode') { //Switches to 'Dark Mode'
        document.body.classList.remove('light');
        document.body.classList.add('dark');
        DOMCacheGetOrSet('exportgame').style.backgroundColor = '#171717'
        DOMCacheGetOrSet('importFileButton').style.backgroundColor = '#00000000'
        DOMCacheGetOrSet('savegame').style.backgroundColor = '#171717'
        DOMCacheGetOrSet('deleteGame').style.backgroundColor = '#171717'
        DOMCacheGetOrSet('achievementcolorcode2').style.color = '#800080'
        DOMCacheGetOrSet('corruptionDescription').style.color = '#9400d3'
        DOMCacheGetOrSet('corruptionTesseractsValue').style.color = '#9400d3'
        DOMCacheGetOrSet('corruptionTotalScore').style.color = '#9932cc'
        DOMCacheGetOrSet('corruptionAntExponentValue').style.color = '#9932cc'
        DOMCacheGetOrSet('corruptionIntroduction').style.color = '#9932cc'
        DOMCacheGetOrSet('c15Rewards').style.backgroundColor = '#00000000'
        DOMCacheGetOrSet('c15Rewards').style.borderColor = '#dda0dd'
        DOMCacheGetOrSet('platonicUpgradeDescriptions').style.backgroundColor = '#00000000'
        DOMCacheGetOrSet('platonicUpgradeDescriptions').style.borderColor = '#dda0dd'
        DOMCacheGetOrSet('platonicUpgradePics').style.backgroundColor = '#00000000'
        DOMCacheGetOrSet('platonicUpgradePics').style.borderColor = '#dda0dd'
        DOMCacheGetOrSet('actualPotionShop').style.backgroundColor = '#00000000'
        DOMCacheGetOrSet('actualPotionShop').style.borderColor = '#ffff00'
        DOMCacheGetOrSet('actualShop').style.backgroundColor = '#00000000'
        DOMCacheGetOrSet('actualShop').style.borderColor = '#dda0dd'
        DOMCacheGetOrSet('corruptionStatsLoadouts').style.backgroundColor = '#00000000'
        DOMCacheGetOrSet('corruptionStatsLoadouts').style.borderColor = '#ffa500'
        DOMCacheGetOrSet('heptGrid').style.backgroundColor = '#00000000'
        DOMCacheGetOrSet('heptGrid').style.borderColor = '#dda0dd'
        DOMCacheGetOrSet('actualSingularityUpgradeContainer').style.backgroundColor = '#00000000'
        DOMCacheGetOrSet('actualSingularityUpgradeContainer').style.borderColor = '#dda0dd'

        themeButton.textContent = 'Dark Mode';
    }
}