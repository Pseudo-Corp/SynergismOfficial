import { invoke } from '@tauri-apps/api/core'
import { fetch as tauriFetch } from '@tauri-apps/plugin-http'
import { memoize } from '../Utility'

let steamAvailable = false
let triedInitSteam = false

/**
 * Initialize the Steam API.
 */
const initializeSteam = memoize(async () => {
  try {
    steamAvailable = await invoke<boolean>('steam_init')
  } catch (e) {
    console.error('Steam init error', e)
    steamAvailable = false
  } finally {
    triedInitSteam = true
  }
})

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
 * Registers a new Synergism account for Steam users
 */
export async function register () {
  const sessionTicket = await invoke<string>('steam_get_auth_ticket')

  const response = await tauriFetch('https://synergism.cc/login/using/steam', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({ sessionTicket })
  })

  if (!response.ok) {
    throw new TypeError(`Failed to login, received ${response.status}`)
  }
}

/**
 * Validates the user against Steam's API
 */
export async function login () {
  if (!triedInitSteam) await initializeSteam()
  if (!steamAvailable) return

  return await tauriFetch('https://synergism.cc/api/v1/users/me', {
    headers: {
      Origin: 'https://synergism.cc'
    }
  })
}

export async function logout () {
  await tauriFetch('https://synergism.cc/api/v1/users/logout')
}

// @ts-ignore TODO: remove this
globalThis.invoke = invoke
