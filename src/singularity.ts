import { DOMCacheGetOrSet } from "./Cache/DOM"
import { format, player } from "./Synergism"
import { toOrdinal } from "./Utility"

/**
 * 
 * Updates all statistics related to Singularities in the Singularity Tab.
 * 
 */
export const updateSingularityStats = ():void => {
    DOMCacheGetOrSet('singularityCount').textContent = toOrdinal(player.singularityCount)
    DOMCacheGetOrSet('goldenQuarks').textContent = format(player.goldenQuarks, 0, true)
    DOMCacheGetOrSet('singularitySpeedDivisor').textContent = format(player.singularityCount + 1, 2, true)
    DOMCacheGetOrSet('singularityCubeDivisor').textContent = format(1 + 1/16 * Math.pow(player.singularityCount, 2), 2, true)
    DOMCacheGetOrSet('singularityResearchMultiplier').textContent = format(player.singularityCount + 1, 2, true)
    DOMCacheGetOrSet('singularityCubeUpgradeMultiplier').textContent = format(player.singularityCount + 1, 2, true)
}

