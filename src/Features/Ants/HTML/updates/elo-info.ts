import i18next from 'i18next'
import { DOMCacheGetOrSet } from '../../../../Cache/DOM'

let ELOInformation: 'overview' | 'info' = 'overview'

export const toggleRebornELOInfo = () => {
  ELOInformation = ELOInformation === 'overview' ? 'info' : 'overview'
  const info = DOMCacheGetOrSet('immortalELOInfo')
  const overview = DOMCacheGetOrSet('immortalELOOverview')
  const toggleButton = DOMCacheGetOrSet('immortalELOInfoToggleButton')

  if (ELOInformation === 'overview') {
    info.style.display = 'none'
    overview.style.display = 'flex'
  } else {
    info.style.display = 'flex'
    overview.style.display = 'none'
  }

  const mode = ELOInformation === 'overview' ? 'toggleOverview' : 'toggleInfo'
  toggleButton.setAttribute('data-mode', ELOInformation)
  toggleButton.querySelector('span')!.textContent = i18next.t(`ants.compendium.${mode}`)
  toggleButton.querySelector('span')!.setAttribute('i18n', `ants.compendium.${mode}`)
}
