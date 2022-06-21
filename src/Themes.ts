import { DOMCacheGetOrSet } from './Cache/DOM';

export const toggleTheme = () => {
    const current = document.body.classList.contains('light')
        ? 'light'
        : 'dark';

    const themeButton = DOMCacheGetOrSet('theme');

    if (current === 'dark') {
        document.body.classList.remove('dark');
        document.body.classList.add('light');
        DOMCacheGetOrSet('singularitybtn').style.backgroundColor = '#171717';
        DOMCacheGetOrSet('rune6').style.backgroundColor = '#171717';
        DOMCacheGetOrSet('rune7').style.backgroundColor = '#171717';
        DOMCacheGetOrSet('mini10').style.backgroundColor = '#171717';
        //It will remove Orange BG for next 5 runes
        DOMCacheGetOrSet('rune1').style.backgroundColor = '#171717';
        DOMCacheGetOrSet('rune2').style.backgroundColor = '#171717';
        DOMCacheGetOrSet('rune3').style.backgroundColor = '#171717';
        DOMCacheGetOrSet('rune4').style.backgroundColor = '#171717';
        DOMCacheGetOrSet('rune5').style.backgroundColor = '#171717';

        themeButton.textContent = 'Dark Mode';
    } else {
        document.body.classList.remove('light');
        document.body.classList.add('dark');

        themeButton.textContent = 'Light Mode';
    }
}