export enum AutoSacrificeModes {
  InGameTime = 0,
  RealTime = 1,
  ImmortalELOGain = 2,
  MaxRebornELO = 3
}

export const NUM_SACRIFICE_MODES = Object.values(AutoSacrificeModes).filter((value) => typeof value === 'number').length
