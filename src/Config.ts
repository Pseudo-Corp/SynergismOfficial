declare const PROD: boolean | undefined
declare const DEV: boolean | undefined

export const version = '4.0.4 October 21, 2025: The Greater Reimagining'

/**
 * If true, the version is marked as a testing version.
 */
export const testing = false
export const lastUpdated = new Date('##LAST_UPDATED##')

export const prod = typeof PROD === 'undefined' ? false : PROD
export const dev = typeof DEV === 'undefined' ? false : DEV
