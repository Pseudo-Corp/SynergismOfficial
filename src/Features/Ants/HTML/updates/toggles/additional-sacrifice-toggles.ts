import { DOMCacheGetOrSet } from '../../../../../Cache/DOM'

export const updateAlwaysSacrificeMaxRebornELOToggle = (opt: boolean): void => {
  const toggle = DOMCacheGetOrSet('alwaysMaxRebornELOToggle') as HTMLInputElement
  toggle.checked = opt
}

export const updateOnlySacrificeMaxRebornELOToggle = (opt: boolean): void => {
  const toggle = DOMCacheGetOrSet('onlyMaxRebornELOToggle') as HTMLInputElement
  toggle.checked = opt
}
