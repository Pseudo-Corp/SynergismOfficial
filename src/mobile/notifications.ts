import { Capacitor } from '@capacitor/core'
import { PushNotifications, type Token } from '@capacitor/push-notifications'
import { memoize } from '../Utility'

const REGISTER_ENDPOINT = 'https://synergism.cc/notifications/mobile/register'

// The APNs environment is decided by the native build's push entitlement:
// debug/development builds talk to the sandbox, release builds to production.
// We mirror that with the esbuild PROD/DEV defines used elsewhere for mobile.
const apnsEnvironment = DEV || !PROD ? 'sandbox' : 'production'

type DeviceRegistration =
  | { token: string; platform: 'ios'; apnsEnvironment: 'production' | 'sandbox' }
  | { token: string; platform: 'android' }

async function sendToken (value: string): Promise<void> {
  const registration: DeviceRegistration = Capacitor.getPlatform() === 'ios'
    ? { token: value, platform: 'ios', apnsEnvironment }
    : { token: value, platform: 'android' }

  const response = await fetch(REGISTER_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registration)
  })

  if (!response.ok) {
    throw new Error(`Device registration failed: ${response.status}`)
  }
}

export const initPushNotifications = memoize(async (): Promise<void> => {
  if (PLATFORM !== 'mobile') return

  await PushNotifications.addListener('registration', (token: Token) => {
    sendToken(token.value).catch((e) => console.error('[notifications] Failed to register device', e))
  })

  await PushNotifications.addListener('registrationError', (error) => {
    console.error('[notifications] Registration error', error)
  })

  let permission = await PushNotifications.checkPermissions()

  if (permission.receive === 'prompt' || permission.receive === 'prompt-with-rationale') {
    permission = await PushNotifications.requestPermissions()
  }

  if (permission.receive !== 'granted') {
    return
  }

  // Triggers the 'registration' listener above once the device token is issued.
  await PushNotifications.register()
})
