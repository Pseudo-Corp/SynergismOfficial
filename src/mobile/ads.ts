import { AdMob, AdmobConsentStatus, type RewardAdOptions, RewardAdPluginEvents } from '@capacitor-community/admob'
import i18next from 'i18next'
import { isAdEventEnabled, setNewAdExpiry } from '../Event'
import { Notification } from '../UpdateHTML'

let adMobInitialized = false
let adAttempt = 0
let adClickable = true

function unlockAd(): void {
  adClickable = true
  adAttempt = 0
}

export async function initAdMob (): Promise<void> {
  await AdMob.initialize()

  const [trackingInfo, consentInfo] = await Promise.all([
    AdMob.trackingAuthorizationStatus(),
    AdMob.requestConsentInfo()
  ])

  if (trackingInfo.status === 'notDetermined') {
    await AdMob.requestTrackingAuthorization()
  }

  if (
    consentInfo.isConsentFormAvailable
    && consentInfo.status === AdmobConsentStatus.REQUIRED
  ) {
    await AdMob.showConsentForm()
  }

  AdMob.addListener(RewardAdPluginEvents.Dismissed, unlockAd)

  AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
    const alreadyActive = isAdEventEnabled()
    setNewAdExpiry()
    if (alreadyActive) {
      void Notification(i18next.t('advertisements.repeatWatch'))
    } else {
      void Notification(i18next.t('advertisements.successfulWatch'))
    }
  })

  AdMob.addListener(RewardAdPluginEvents.FailedToLoad, () => {
    if (adAttempt === 2) {
      void Notification(i18next.t('advertisements.failedToLoadTwice'))
      unlockAd()
    } else {
      void Notification(i18next.t('advertisements.failedToLoad'))
    }
  })

  AdMob.addListener(RewardAdPluginEvents.FailedToShow, () => {
    if (adAttempt === 2) {
      void Notification(i18next.t('advertisements.failedToLoadTwice'))
      unlockAd()
    } else {
      void Notification(i18next.t('advertisements.failedToLoad'))
    }
  })
}

export async function ensureAdMobReady (): Promise<void> {
  void Notification(i18next.t('advertisements.loadingAd'))
  if (adMobInitialized) return
  await initAdMob()
  adMobInitialized = true
}

export async function rewardVideo (): Promise<void> {
  if (!adClickable) { return }
  adClickable = false
  try {
    await ensureAdMobReady()
  } catch (err) {
    unlockAd()
    void Notification(i18next.t('advertisements.initFailed'))
  }

  const options: RewardAdOptions = DEV || !PROD
    ? {
      adId: 'ca-app-pub-3940256099942544/5354046379',
      isTesting: true
    }
    : {
      adId: 'ca-app-pub-8767571504273469/2651441034'
    }

  /* eslint-disable no-await-in-loop */
  for (let attempt = 1; attempt <= 2; attempt++) {
    adAttempt++
    try {
      await AdMob.prepareRewardVideoAd(options)
      await AdMob.showRewardVideoAd()
      return
    } catch (err) {
      if (attempt === 1) {
        await new Promise((r) => setTimeout(r, 2000))
      } else {
        throw err
      }
    }
  }
  /* eslint-enable no-await-in-loop */
}
