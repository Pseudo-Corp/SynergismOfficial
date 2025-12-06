declare const PROD: boolean | undefined
declare const DEV: boolean | undefined

export const version = '4.1.0 December 6, 2025: The Ants Update ALPHA vFINAL'

/**
 * If true, the version is marked as a testing version.
 */
export const testing = true
export const lastUpdated = new Date('##LAST_UPDATED##')

export const prod = typeof PROD === 'undefined' ? false : PROD
export const dev = typeof DEV === 'undefined' ? false : DEV
