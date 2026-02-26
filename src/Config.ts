declare const PROD: boolean | undefined
declare const DEV: boolean | undefined
declare const PLATFORM: 'steam' | undefined

export const version = '4.1.4 February 26, 2025: Steam!!!'

/**
 * If true, the version is marked as a testing version.
 */
export const testing = false
export const lastUpdated = new Date('##LAST_UPDATED##')

export const prod = typeof PROD === 'undefined' ? false : PROD
export const dev = typeof DEV === 'undefined' ? false : DEV

export const platform = typeof PLATFORM === 'undefined' ? 'browser' : PLATFORM
