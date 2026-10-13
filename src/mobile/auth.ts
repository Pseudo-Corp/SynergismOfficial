import { Capacitor } from '@capacitor/core'
import { AppAttest } from '@capgo/capacitor-app-attest'
import i18next from 'i18next'
import type { ProofProvider } from '../account/proof'

const ATTEST_CHALLENGE_URL = 'https://synergism.cc/login-api/attest-challenge'

type CaptchaPlatform = 'apple' | 'google'
type AttestResult =
  | { platform: 'apple'; keyId: string; challenge: string; attestation: string }
  | { platform: 'google'; challenge: string; integrityToken: string }
  | { error: string }

async function attestDevice (platform: CaptchaPlatform): Promise<AttestResult> {
  try {
    const challengeURL = new URL(ATTEST_CHALLENGE_URL)
    challengeURL.searchParams.set('platform', platform)
    const res = await fetch(challengeURL.toString(), { method: 'POST', credentials: 'include' })
    if (!res.ok) {
      return { error: `Challenge request failed: ${res.status}` }
    }

    const { challenge } = await res.json() as { challenge: string }

    const { keyId } = await AppAttest.prepare()
    const { token } = await AppAttest.createAttestation({ keyId, challenge })

    return platform === 'google'
      ? { platform, challenge, integrityToken: token }
      : { platform, keyId, challenge, attestation: token }
  } catch (e) {
    console.error('[auth] Device attestation failed', e)
    return { error: `Device attestation threw: ${(e as Error).message}` }
  }
}

const captchaPlatform: CaptchaPlatform = Capacitor.getPlatform() === 'android' ? 'google' : 'apple'

export const mobileProof: ProofProvider = {
  platform: captchaPlatform,
  async get () {
    const attest = await attestDevice(captchaPlatform)

    if ('error' in attest) {
      console.error('[auth] attestation failed:', attest.error)
      throw new Error(`${i18next.t('mobile.auth.verificationFailed')}\n\n${attest.error}`)
    }

    if (attest.platform === 'google') {
      return { challenge: attest.challenge, integrityToken: attest.integrityToken }
    }

    return { challenge: attest.challenge, keyId: attest.keyId, attestation: attest.attestation }
  }
}
