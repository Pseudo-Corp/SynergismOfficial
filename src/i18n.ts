import i18next, { type Resource } from 'i18next'
import { prod } from './Config'
import { DOMCacheGetOrSet } from './Cache/DOM';

// For 'flag': https://emojipedia.org/emoji-flag-sequence/
// Searching "flag <country>" in their search bar will help verify the code.
const supported: {[langID: string]: {name: string, flag: string}} = {
    // Define language properties and mappings here.
    en: { name: 'English', flag: '🇺🇸'}, // Or '🇺🇸 / 🇬🇧', no name?
    zh: { name: 'Chinese', flag: '🇨🇳'}
};

export const init = async () => {
    const resources: Record<string, Resource> = {}

    for (const lang in supported) {
        const response = await fetch(`./translations/${lang}.json`)
        resources[lang] = {
            translation: await response.json() as Resource
        }
    }

    return i18next.init({
        fallbackLng: 'en',
        debug: !prod,
        resources
    }).then(() => buildLanguageTab());
}

function buildLanguageButton(langID: string, name: string, flag: string) {
    const mainButton = document.createElement('button');
    mainButton.id = `language_${langID}`;
    mainButton.className = 'language-select';
    mainButton.addEventListener('click', () => {
        void i18next.changeLanguage(langID);
    });

    const flagSpan = document.createElement('span');
    flagSpan.className = 'lang-flag';
    flagSpan.textContent = flag;
    mainButton.appendChild(flagSpan);

    const nameSpan = document.createElement('span');
    nameSpan.className = 'lang-name';
    nameSpan.textContent = name;
    mainButton.appendChild(nameSpan);

    return mainButton;
}

function buildLanguageTab() {
    const langSelector = DOMCacheGetOrSet('languageOptions');
    for (const langID in supported) {
        const langButton = buildLanguageButton(langID, supported[langID].name, supported[langID].flag);
        langSelector.appendChild(langButton);
    }
}
