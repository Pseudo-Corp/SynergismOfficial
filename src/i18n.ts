import i18next, { type Resource } from 'i18next'
import { prod } from './Config'
import { DOMCacheGetOrSet } from './Cache/DOM'
import ColorTextPlugin from './Plugins/ColorText'
import { toggleauto } from './Toggles'

// For 'flag': https://emojipedia.org/emoji-flag-sequence/
// Searching "flag <country>" in their search bar will help verify the code.
const supported: Record<string, { name: string, flag: string }> = {
    // Define language properties and mappings here.
    en: { name: 'English', flag: '🇺🇸'}, // Or '🇺🇸 / 🇬🇧', no name?
    zh: { name: 'Chinese', flag: '🇨🇳'}
};

export const init = async (): Promise<void> => {
    const resources: Record<string, Resource> = {}

    for (const lang in supported) {
        const response = await fetch(`./translations/${lang}.json`)
        resources[lang] = {
            translation: await response.json() as Resource
        }
    }

    await i18next.use(ColorTextPlugin).init({
        fallbackLng: 'en',
        debug: !prod,
        resources,
        postProcess: ['ColorText']
    })

    buildLanguageTab()
    translateHTML()
}

function buildLanguageButton(langID: string, name: string, flag: string) {
    const mainButton = document.createElement('button');
    mainButton.id = `language_${langID}`;
    mainButton.className = 'language-select';
    mainButton.addEventListener('click', () => {
        void i18next.changeLanguage(langID).then(
            () => afterLanguageChange()
        );
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

function translateHTML () {
    const i18n = document.querySelectorAll('*[i18n]')

    for (const element of Array.from(i18n)) {
        const key = element.getAttribute('i18n')!

        element.textContent = i18next.t(key)
    }
}

function afterLanguageChange () {
    translateHTML()
    toggleauto()
}
