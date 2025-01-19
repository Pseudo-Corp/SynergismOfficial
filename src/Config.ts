declare const PROD: boolean | undefined

export const version = '3.1.1 January 15, 2025 pt 1.4: The Bakery Update'

/**
 * PSEUDO DO NOT CHANGE THIS LINE
 * PSEUDO DO NOT CHANGE THIS LINE
 * PSEUDO DO NOT CHANGE THIS LINE
 * PSEUDO DO NOT CHANGE THIS LINE
 * PSEUDO DO NOT CHANGE THIS LINE
 * PSEUDO DO NOT CHANGE THIS LINE
 */
export const testing: boolean = false
export const lastUpdated = new Date('##LAST_UPDATED##')
/**
 * CHANGE THIS ONE INSTEAD
 */
export const prod = typeof PROD === 'undefined' ? false : PROD
