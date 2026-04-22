import i18next, { type Resource } from 'i18next'
import { DOMCacheGetOrSet } from './Cache/DOM'
import { prod } from './Config'
import { storageGetItem, storageSetItem } from './events/storage-events'
import ColorTextPlugin from './Plugins/ColorText'
import StatSymbolsPlugin from './Plugins/StatSymbols'
import { Confirm } from './UpdateHTML'

// For 'flag': https://emojipedia.org/emoji-flag-sequence/
// Searching "flag <country>" in their search bar will help verify the code.
const supported: Record<string, { name: string; flag: string }> = {
  // Define language properties and mappings here.
  en: { name: 'English', flag: '🇺🇸' }, // Or '🇺🇸 / 🇬🇧', no name?
  zh: { name: 'Chinese', flag: '🇨🇳' },
  fr: { name: 'French', flag: '🏳️' },
  de: { name: 'German', flag: '🇩🇪' },
  pl: { name: 'Polish', flag: '🇵🇱' },
  es: { name: 'Spanish', flag: '🇪🇸' },
  ru: { name: 'Russian', flag: '🇷🇺' }
}

const languageCache = new Map<string, { translation: Resource }>()

export const init = async (): Promise<void> => {
  const resources: Record<string, Resource> = {}
  const language = storageGetItem('language') ?? 'en'

  const response = await fetch(`./translations/${language}.json`)
    .catch(() => fetch(`https://synergism.cc/translations/${language}.json`))
  const file = await response.json() as Resource

  languageCache.set(language, { translation: file })
  resources[language] = { translation: file }

  if (language !== 'en') {
    // We always need to load English, to use as a fallback
    const englishResponse = await fetch('./translations/en.json')
      .catch(() => fetch('https://synergism.cc/translations/en.json'))
    const englishTranslations = await englishResponse.json() as Resource

    languageCache.set('en', { translation: englishTranslations })
    resources.en = { translation: englishTranslations }
  }

  await i18next.use(StatSymbolsPlugin).use(ColorTextPlugin).init({
    lng: language,
    fallbackLng: 'en',
    debug: !prod,
    resources,
    postProcess: ['StatSymbols', 'ColorText'],
    // crowdin returns an empty string when a translation for
    // a language isn't present
    returnEmptyString: false,
    interpolation: {
      escapeValue: false
    }
  })

  buildLanguageTab()
  translateHTML()
}

function buildLanguageButton (langID: string, name: string, flag: string) {
  const mainButton = document.createElement('button')
  mainButton.id = `language_${langID}`
  mainButton.className = 'language-select'
  mainButton.addEventListener('click', async () => {
    if (!languageCache.has(langID)) {
      const response = await fetch(`./translations/${langID}.json`)
      const file = await response.json() as Resource

      languageCache.set(langID, { translation: file })
      i18next.addResourceBundle(langID, 'translation', file)
    }

    // i18next.addResourceBundle
    await i18next.changeLanguage(langID)
    storageSetItem('language', langID)

    const shouldReload = await Confirm(i18next.t('general.languageChange'))

    if (shouldReload) {
      location.reload()
    }
  })

  const flagSpan = document.createElement('span')
  flagSpan.className = 'lang-flag'
  flagSpan.textContent = flag
  mainButton.appendChild(flagSpan)

  const nameSpan = document.createElement('span')
  nameSpan.className = 'lang-name'
  nameSpan.textContent = name
  mainButton.appendChild(nameSpan)

  return mainButton
}

function buildLanguageTab () {
  const langSelector = DOMCacheGetOrSet('languageOptions')
  for (const langID in supported) {
    const langButton = buildLanguageButton(langID, supported[langID].name, supported[langID].flag)
    langSelector.appendChild(langButton)
  }
}

function translateHTML () {
  document.querySelectorAll('[i18n]').forEach((element) => {
    const key = element.getAttribute('i18n')!
    const value = i18next.t(key)

    if (element instanceof HTMLImageElement) {
      element.setAttribute('alt', value)
    } else if (value.includes('<span')) {
      element.innerHTML = value
    } else {
      element.textContent = value
    }
  })

  document.querySelectorAll('[i18n-aria-label]').forEach((element) => {
    const key = element.getAttribute('i18n-aria-label')!
    element.setAttribute('aria-label', i18next.t(key))
  })
}
