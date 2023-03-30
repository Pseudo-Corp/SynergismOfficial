import i18next, { type Resource } from 'i18next'
import { prod } from './Config'
import { DOMCacheGetOrSet } from './Cache/DOM'
import ColorTextPlugin from './Plugins/ColorText'
import { Confirm } from './UpdateHTML'

// For 'flag': https://emojipedia.org/emoji-flag-sequence/
// Searching "flag <country>" in their search bar will help verify the code.
const supported: Record<string, { name: string, flag: string }> = {
    // Define language properties and mappings here.
    en: { name: 'English', flag: '🇺🇸'}, // Or '🇺🇸 / 🇬🇧', no name?
    zh: { name: 'Chinese', flag: '🇨🇳'},
    fr: { name: 'French', flag: '🏳️' },
    de: { name: 'German', flag: '🇩🇪' },
    pl: { name: 'Polish', flag: '🇵🇱' },
    es: { name: 'Spanish', flag: '🇪🇸' },
    ru: { name: 'Russian', flag: '🇷🇺' }
};

const languageCache = new Map<string, { translation: Resource }>()

export const init = async (): Promise<void> => {
    const resources: Record<string, Resource> = {}
    const language = localStorage.getItem('language') ?? 'en'

    const response = await fetch(`./translations/${language}.json`)
    const file = await response.json() as Resource

    languageCache.set(language, { translation: file })
    resources[language] = { translation: file }

    if (language !== 'en') {
        // We always need to load English, to use as a fallback
        const response = await fetch('./translations/en.json')
        const file = await response.json() as Resource

        languageCache.set('en', { translation: file })
        resources.en = { translation: file }
    }

    await i18next.use(ColorTextPlugin).init({
        lng: language,
        fallbackLng: 'en',
        debug: !prod,
        resources,
        postProcess: ['ColorText'],
        // poeditor returns an empty string when a translation for
        // a language isn't present
        returnEmptyString: false,
        interpolation: {
            escapeValue: false
        }
    })

    buildLanguageTab()
    translateHTML()
}

function buildLanguageButton(langID: string, name: string, flag: string) {
    const mainButton = document.createElement('button');
    mainButton.id = `language_${langID}`;
    mainButton.className = 'language-select';
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    mainButton.addEventListener('click', async () => {
        if (!languageCache.has(langID)) {
            const response = await fetch(`./translations/${langID}.json`)
            const file = await response.json() as Resource

            languageCache.set(langID, { translation: file })
            i18next.addResourceBundle(langID, 'translation', file)
        }

        // i18next.addResourceBundle
        await i18next.changeLanguage(langID)
        localStorage.setItem('language', langID)

        const shouldReload = await Confirm(i18next.t('general.languageChange'))

        if (shouldReload) {
            location.reload()
        }
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
        const value = i18next.t(key)

        if (value.includes('<span')) {
            element.innerHTML = value
        } else {
            element.textContent = value
        }
    }
}

