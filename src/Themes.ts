import { DOMCacheGetOrSet } from './Cache/DOM';

export const toggleTheme = () => {
    const current = document.body.classList.contains('light')
        ? 'light'
        : 'dark'
    const current2 = document.body.classList.contains('dark')
        ? 'dark'
        : 'lightDark'

    const themeButton = DOMCacheGetOrSet('theme');

    if (current === 'dark') { //Switches to 'Lighter Dark Mode'
        document.body.classList.remove('dark');
        document.body.classList.add('lightDark');
        DOMCacheGetOrSet('singularitybtn').style.backgroundColor = '#171717';
        DOMCacheGetOrSet('rune6').style.backgroundColor = '#171717';
        DOMCacheGetOrSet('rune7').style.backgroundColor = '#171717';
        DOMCacheGetOrSet('importFileButton').style.backgroundColor = '#060606'
        DOMCacheGetOrSet('c15Rewards').style.backgroundColor = '#141319'
        DOMCacheGetOrSet('platonicUpgradeDescriptions').style.backgroundColor = '#141319'
        DOMCacheGetOrSet('platonicUpgradePics').style.backgroundColor = '#0c0c0f'
        DOMCacheGetOrSet('actualPotionShop').style.backgroundColor = '#141319'
        DOMCacheGetOrSet('actualShop').style.backgroundColor = '#0c0c0f'
        DOMCacheGetOrSet('corruptionStatsLoadouts').style.backgroundColor = '#141319'
        DOMCacheGetOrSet('heptGrid').style.backgroundColor = '#141319'
        DOMCacheGetOrSet('actualSingularityUpgradeContainer').style.backgroundColor = '#141319'
        //It will remove Orange BG for next 5 runes
        DOMCacheGetOrSet('rune1').style.backgroundColor = '#171717';
        DOMCacheGetOrSet('rune2').style.backgroundColor = '#171717';
        DOMCacheGetOrSet('rune3').style.backgroundColor = '#171717';
        DOMCacheGetOrSet('rune4').style.backgroundColor = '#171717';
        DOMCacheGetOrSet('rune5').style.backgroundColor = '#171717';

        themeButton.textContent = 'Lighter Dark Mode';
    }
    if (current2 === 'lightDark') { //Switches to 'Light Mode'
        document.body.classList.remove('lightDark');
        document.body.classList.add('light');
        DOMCacheGetOrSet('singularitybtn').style.backgroundColor = '#171717';
        DOMCacheGetOrSet('rune6').style.backgroundColor = '#171717';
        DOMCacheGetOrSet('rune7').style.backgroundColor = '#171717';
        DOMCacheGetOrSet('importFileButton').style.backgroundColor = '#060606'
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
        DOMCacheGetOrSet('rune1').style.backgroundColor = '#171717';
        DOMCacheGetOrSet('rune2').style.backgroundColor = '#171717';
        DOMCacheGetOrSet('rune3').style.backgroundColor = '#171717';
        DOMCacheGetOrSet('rune4').style.backgroundColor = '#171717';
        DOMCacheGetOrSet('rune5').style.backgroundColor = '#171717';

        themeButton.textContent = 'Light Mode';
    }
    if (current === 'light') { //Switches to 'Dark Mode', For now I added some new color changes,
        //If enough people will like can make them Permanent
        document.body.classList.remove('light');
        document.body.classList.add('dark');
        DOMCacheGetOrSet('importFileButton').style.backgroundColor = '#060606'
        DOMCacheGetOrSet('achievementcolorcode2').style.color = '#800080'
        DOMCacheGetOrSet('corruptionDescription').style.color = '#9400d3'
        DOMCacheGetOrSet('corruptionTesseractsValue').style.color = '#9400d3'
        DOMCacheGetOrSet('corruptionTotalScore').style.color = '#9932cc'
        DOMCacheGetOrSet('corruptionAntExponentValue').style.color = '#9932cc'
        DOMCacheGetOrSet('corruptionIntroduction').style.color = '#9932cc'
        DOMCacheGetOrSet('c15Rewards').style.backgroundColor = '#0c0c0f'
        DOMCacheGetOrSet('c15Rewards').style.borderColor = '#dda0dd'
        DOMCacheGetOrSet('platonicUpgradeDescriptions').style.backgroundColor = '#0c0c0f'
        DOMCacheGetOrSet('platonicUpgradeDescriptions').style.borderColor = '#dda0dd'
        DOMCacheGetOrSet('platonicUpgradePics').style.backgroundColor = '#0c0c0f'
        DOMCacheGetOrSet('platonicUpgradePics').style.borderColor = '#dda0dd'
        DOMCacheGetOrSet('actualPotionShop').style.backgroundColor = '#0c0c0f'
        DOMCacheGetOrSet('actualPotionShop').style.borderColor = '#ffff00'
        DOMCacheGetOrSet('actualShop').style.backgroundColor = '#0c0c0f'
        DOMCacheGetOrSet('actualShop').style.borderColor = '#dda0dd'
        DOMCacheGetOrSet('corruptionStatsLoadouts').style.backgroundColor = '#0c0c0f'
        DOMCacheGetOrSet('corruptionStatsLoadouts').style.borderColor = '#ffa500'
        DOMCacheGetOrSet('heptGrid').style.backgroundColor = '#060606'
        DOMCacheGetOrSet('heptGrid').style.borderColor = '#dda0dd'
        DOMCacheGetOrSet('actualSingularityUpgradeContainer').style.backgroundColor = '#0c0c0f'
        DOMCacheGetOrSet('actualSingularityUpgradeContainer').style.borderColor = '#dda0dd'

        themeButton.textContent = 'Dark Mode';
    }
}