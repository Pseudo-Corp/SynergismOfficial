import {
  AdMob,
  AdmobConsentStatus,
  RewardAdOptions,
  RewardAdPluginEvents
} from '@capacitor-community/admob'
import { Notification } from '../UpdateHTML'
import { isAdEventEnabled, setNewAdExpiry } from '../Event'
import i18next from 'i18next'

let adMobInitialized = false

export async function initAdMob (): Promise<void> {
  const consentInfo = await AdMob.requestConsentInfo()
  const trackingInfo = await AdMob.trackingAuthorizationStatus()
  if (trackingInfo.status === 'notDetermined') {
    await AdMob.requestTrackingAuthorization()
  }

  if (
    consentInfo.isConsentFormAvailable
    && consentInfo.status === AdmobConsentStatus.REQUIRED
  ) {
    await AdMob.showConsentForm()
  }

  await AdMob.initialize()

  AdMob.addListener(RewardAdPluginEvents.Loaded, () => {
    // TODO: Figure out if this is even needed for ios? I know AdLoadInfo seems to be inconsistent between the two
    // Also, if it is needed, what needs to be done here?
  })

  AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
    const alreadyActive = isAdEventEnabled()
    setNewAdExpiry()
    if (alreadyActive) {
      void Notification(i18next.t('advertisements.repeatWatch'))
    }
    else {
      void Notification(i18next.t('advertisements.successfulWatch'))
    }
  })

  AdMob.addListener(RewardAdPluginEvents.FailedToLoad, () => {
    void Notification(i18next.t('advertisements.failedToLoad'))
  })
}

export async function ensureAdMobReady (): Promise<void> {
  void Notification(i18next.t('advertisements.loadingAd'))
  if (adMobInitialized) return
  await initAdMob()
  adMobInitialized = true
}

export async function rewardVideo (): Promise<void> {
  await ensureAdMobReady()
  const options: RewardAdOptions = {
    // This is google's testing adId. You should see 'Test Mode' as a banner while the ad plays. Otherwise
    // you might violate the invalid traffic policy https://support.google.com/admob/answer/3342054?sjid=16946736118430249953-NA
    adId: 'ca-app-pub-3940256099942544/1712485313',
    isTesting: true
  }

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      await AdMob.prepareRewardVideoAd(options)
      await AdMob.showRewardVideoAd()
      return
    } catch (err: any) {
      console.error(`Reward ad attempt ${attempt} failed:`, err)
      if (attempt === 1) {
        await new Promise((r) => setTimeout(r, 2000))
      } else {
        throw err
      }
    }
  }
}
