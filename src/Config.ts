declare const PROD: boolean | undefined
declare const DEV: boolean | undefined

export const version = '4.0.0 August 6, 2025 v2: The Greater Reimagining Alpha'

/**
 * If true, the version is marked as a testing version.
 */
export const testing = true
export const lastUpdated = new Date('##LAST_UPDATED##')

export const prod = typeof PROD === 'undefined' ? false : PROD
export const dev = typeof DEV === 'undefined' ? false : DEV
