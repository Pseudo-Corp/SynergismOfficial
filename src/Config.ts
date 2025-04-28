declare const PROD: boolean | undefined
declare const DEV: boolean | undefined

export const version = '3.2.2 April 28, 2025: The Statistics Update: Release Candidate 10'

/**
 * If true, the version is marked as a testing version.
 */
export const testing = true
export const lastUpdated = new Date('##LAST_UPDATED##')

export const prod = typeof PROD === 'undefined' ? false : PROD
export const dev = typeof DEV === 'undefined' ? false : DEV
