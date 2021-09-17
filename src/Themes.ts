import { DOMCacheGetOrSet } from './Cache/DOM';

export const toggleTheme = () => {
    const current = document.body.classList.contains('light')
        ? 'light'
        : 'dark';

    const themeButton = DOMCacheGetOrSet('theme');

    if (current === 'dark') {
        document.body.classList.remove('dark');
        document.body.classList.add('light');

        themeButton.textContent = 'Dark Mode';
    } else {
        document.body.classList.remove('light');
        document.body.classList.add('dark');

        themeButton.textContent = 'Light Mode';
    }
}