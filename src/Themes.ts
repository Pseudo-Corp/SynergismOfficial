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
        DOMCacheGetOrSet('importFileButton').style.backgroundColor = '#0f0f0f'
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
        DOMCacheGetOrSet('importFileButton').style.backgroundColor = '#000000'
        DOMCacheGetOrSet('achievementcolorcode2').style.color = '#ff01f3'
        DOMCacheGetOrSet('rune1').style.backgroundColor = '#171717';
        DOMCacheGetOrSet('rune2').style.backgroundColor = '#171717';
        DOMCacheGetOrSet('rune3').style.backgroundColor = '#171717';
        DOMCacheGetOrSet('rune4').style.backgroundColor = '#171717';
        DOMCacheGetOrSet('rune5').style.backgroundColor = '#171717';

        themeButton.textContent = 'Light Mode';
    }
    if (current === 'light') { //Switches to 'Dark Mode'
        document.body.classList.remove('light');
        document.body.classList.add('dark');
        DOMCacheGetOrSet('importFileButton').style.backgroundColor = '#171717'
        DOMCacheGetOrSet('achievementcolorcode2').style.color = '#800080'

        themeButton.textContent = 'Dark Mode';
    }
}