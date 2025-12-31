import { invoke } from '@tauri-apps/api/core'

let steamAvailable = false

/**
 * Initialize the Steam API. Call this once at app startup.
 * Returns true if Steam is available, false otherwise.
 */
export async function initSteam () {
  try {
    steamAvailable = await invoke<boolean>('steam_init')
  } catch (e) {
    console.error('Steam init error', e)
    steamAvailable = false
  }
}

export async function runCallbacks (): Promise<void> {
  if (!steamAvailable) return
  try {
    await invoke('steam_run_callbacks')
  } catch (e) {
    // Silently ignore callback errors
  } finally {
    queueMicrotask(() => runCallbacks())
  }
}

export const isSteamAvailable = () => steamAvailable

/**
 * Unlock a Steam achievement
 */
export async function unlockAchievement (name: string) {
  if (!steamAvailable) return
  try {
    await invoke('steam_unlock_achievement', { name })
  } catch (e) {
    console.error(`Failed to unlock achievement ${name}:`, e)
  }
}

/**
 * Clear a Steam achievement (for testing)
 */
export async function clearAchievement (name: string): Promise<void> {
  if (!steamAvailable) return
  try {
    await invoke('steam_clear_achievement', { name })
  } catch (e) {
    console.error(`Failed to clear achievement ${name}:`, e)
  }
}

/**
 * Check if an achievement is unlocked
 */
export async function isAchievementUnlocked (name: string): Promise<boolean> {
  if (!steamAvailable) return false
  try {
    return await invoke<boolean>('steam_is_achievement_unlocked', { name })
  } catch (e) {
    console.error(`Failed to check achievement ${name}:`, e)
    return false
  }
}

/**
 * Save data to Steam Cloud
 */
export async function cloudSave (filename: string, data: string): Promise<void> {
  if (!steamAvailable) return

  await invoke('steam_cloud_save', { filename, data })
}

/**
 * Load data from Steam Cloud
 * Returns null if file doesn't exist
 */
export async function cloudLoad (filename: string): Promise<string | null> {
  if (!steamAvailable) return null

  return await invoke<string | null>('steam_cloud_load', { filename })
}

/**
 * Delete a file from Steam Cloud
 */
export async function cloudDelete (filename: string): Promise<void> {
  if (!steamAvailable) return
  try {
    await invoke('steam_cloud_delete', { filename })
  } catch (e) {
    console.error(`Failed to delete from Steam Cloud (${filename}):`, e)
  }
}

/**
 * Check if a file exists in Steam Cloud
 */
export async function cloudExists (filename: string): Promise<boolean> {
  if (!steamAvailable) return false
  try {
    return await invoke<boolean>('steam_cloud_exists', { filename })
  } catch (e) {
    console.error(`Failed to check Steam Cloud file (${filename}):`, e)
    return false
  }
}

/**
 * Get the current Steam user's display name
 */
export async function getUsername (): Promise<string | null> {
  if (!steamAvailable) return null
  try {
    return await invoke<string>('steam_get_username')
  } catch (e) {
    console.error('Failed to get Steam username:', e)
    return null
  }
}
