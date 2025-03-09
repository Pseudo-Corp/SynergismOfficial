declare const PROD: boolean | undefined

export const version = '3.2.1 March 9 2025: The Campaign Update, pt 1.2'

/**
 * If true, the version is marked as a testing version.
 */
export const testing = false
export const lastUpdated = new Date('##LAST_UPDATED##')

export const prod = typeof PROD === 'undefined' ? false : PROD
