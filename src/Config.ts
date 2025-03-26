declare const PROD: boolean | undefined

export const version = '3.2.2 March 26 2025: The Statistics Update: Pre-Alpha 4:51pm EST'

/**
 * If true, the version is marked as a testing version.
 */
export const testing = false
export const lastUpdated = new Date('##LAST_UPDATED##')

export const prod = typeof PROD === 'undefined' ? false : PROD
