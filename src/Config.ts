declare const PROD: boolean | undefined

export const version = '3.1.2 February 1 2025: The Events Update'

/**
 * If true, the version is marked as a testing version.
 */
export const testing = true
export const lastUpdated = new Date('##LAST_UPDATED##')

export const prod = typeof PROD === 'undefined' ? false : PROD
