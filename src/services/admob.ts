import {
  AdMob,
  BannerAdOptions,
  BannerAdSize,
  BannerAdPosition,
  InterstitialAdPluginEvents,
  AdMobRewardItem,
  RewardAdPluginEvents,
} from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

const ADS_ENABLED = true;

const AD_UNITS = {
  ios: {
    banner:       'ca-app-pub-5467558631588617/4903763925',
    interstitial: 'ca-app-pub-5467558631588617/5589782335',
    rewarded:     'ca-app-pub-5467558631588617/1973970955',
  },
  android: {
    banner:       'ca-app-pub-5467558631588617/5825814962',
    interstitial: 'ca-app-pub-5467558631588617/7667482466',
    rewarded:     'ca-app-pub-5467558631588617/2519097569',
  },
} as const;

function getAdUnit(type: keyof typeof AD_UNITS.ios): string {
  const platform = Capacitor.getPlatform();
  if (platform === 'android') return AD_UNITS.android[type];
  return AD_UNITS.ios[type];
}

export async function initAdMob(): Promise<void> {
  if (!ADS_ENABLED) return;
  try {
    await AdMob.initialize();
    if (Capacitor.getPlatform() === 'ios') {
      await AdMob.requestTrackingAuthorization();
    }
  } catch {
    // Web — AdMob not available
  }
}

export async function showBanner(): Promise<void> {
  if (!ADS_ENABLED) return;
  try {
    const options: BannerAdOptions = {
      adId: getAdUnit('banner'),
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: false,
    };
    await AdMob.showBanner(options);
  } catch {
    // Web or ad not ready
  }
}

export async function hideBanner(): Promise<void> {
  if (!ADS_ENABLED) return;
  try {
    await AdMob.hideBanner();
  } catch {
    // ignore
  }
}

export async function showInterstitial(): Promise<void> {
  if (!ADS_ENABLED) return;
  try {
    await AdMob.prepareInterstitial({ adId: getAdUnit('interstitial'), isTesting: false });
    await new Promise<void>((resolve) => {
      AdMob.addListener(InterstitialAdPluginEvents.Loaded, async () => {
        await AdMob.showInterstitial();
        resolve();
      });
    });
  } catch {
    // Ad not ready or web
  }
}

export async function showRewarded(): Promise<boolean> {
  if (!ADS_ENABLED) return false;
  return new Promise(async (resolve) => {
    try {
      let rewarded = false;
      await AdMob.prepareRewardVideoAd({ adId: getAdUnit('rewarded'), isTesting: false });
      AdMob.addListener(RewardAdPluginEvents.Rewarded, (_reward: AdMobRewardItem) => {
        rewarded = true;
      });
      AdMob.addListener(RewardAdPluginEvents.Dismissed, () => resolve(rewarded));
      await AdMob.showRewardVideoAd();
    } catch {
      resolve(false);
    }
  });
}
