declare const PROD: boolean | undefined

export const version = '3.2.0 March 1 2025: The Campaign Update!'

/**
 * If true, the version is marked as a testing version.
 */
export const testing = true
export const lastUpdated = new Date('##LAST_UPDATED##')

export const prod = typeof PROD === 'undefined' ? false : PROD
