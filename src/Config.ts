export const version = '4.3.0 August 31, 2026: The Purple'

export const isSynergismCC = location.hostname === 'synergism.cc'

/**
 * If true, the version is marked as a testing version.
 */
export const testing = true
export const lastUpdated = new Date('##LAST_UPDATED##')

export const ticksPerSecond = PLATFORM === 'mobile' ? 40 : 200
