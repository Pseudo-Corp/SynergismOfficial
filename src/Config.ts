export const version = '4.2.7 August 12, 2026: "Add"itional QoL'

export const isSynergismCC = location.hostname === 'synergism.cc'

/**
 * If true, the version is marked as a testing version.
 */
export const testing = false
export const lastUpdated = new Date('##LAST_UPDATED##')

export const ticksPerSecond = PLATFORM === 'mobile' ? 40 : 200
