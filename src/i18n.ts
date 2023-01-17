import i18next, { type Resource } from 'i18next'
import { prod } from './Config'

const supported = ['en']

export const init = async () => {
    const resources: Record<string, Resource> = {}

    for (const lang of supported) {
        const response = await fetch(`./translations/${lang}.json`)
        resources[lang] = {
            translation: await response.json() as Resource
        }
    }

    return i18next.init({
        fallbackLng: 'en',
        postProcess: true,
        debug: !prod,
        resources
    })
}
