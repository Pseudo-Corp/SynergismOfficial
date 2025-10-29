import { DOMCacheGetOrSet } from '../../../../../Cache/DOM'
import { autoSacrificeData } from '../../../Automation/sacrifice'
import type { AutoSacrificeModes } from '../../../toggles/structs/sacrifice'

export const autoAntSacrificeModeNameHTML = (mode: AutoSacrificeModes): void => {
  const el = DOMCacheGetOrSet('autoSacrificeAntMode')
  el.textContent = autoSacrificeData[mode].modeName()
}

export const autoAntSacrificeModeDescHTML = (mode: AutoSacrificeModes): void => {
  const el = DOMCacheGetOrSet('autoAntSacrifice')
  el.textContent = autoSacrificeData[mode].infoText()
}
