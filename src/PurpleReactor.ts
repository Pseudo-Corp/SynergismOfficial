export const purpleReactantConversion = {
  ambrosiaBarPoints: 1_000,
  redAmbrosiaBarPoints: 1,
  purpleBarPoints: 100
} as const

export const PURPLE_REACTOR_TICK_INTERVAL = 0.125

export const calculateRedAmbrosiaReactantCapacityFromAmbrosia = (
  ambrosiaBarPointCapacity: number
) => {
  return ambrosiaBarPointCapacity
    * purpleReactantConversion.redAmbrosiaBarPoints
    / purpleReactantConversion.ambrosiaBarPoints
}
