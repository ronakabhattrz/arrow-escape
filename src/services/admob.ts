// TODO: AdMob integration — add Ad Unit IDs and uncomment when ready
//
// iOS Ad Unit IDs (from https://admob.google.com):
//   Banner:        ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
//   Interstitial:  ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
//   Rewarded:      ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
//
// Also update Info.plist GADApplicationIdentifier with your real App ID.

const ADS_ENABLED = true; // flip to true when Ad Unit IDs are ready

export async function initAdMob(): Promise<void> {
  if (!ADS_ENABLED) return;
}

export async function showBanner(): Promise<void> {
  if (!ADS_ENABLED) return;
}

export async function hideBanner(): Promise<void> {
  if (!ADS_ENABLED) return;
}

export async function showInterstitial(): Promise<void> {
  if (!ADS_ENABLED) return;
}

export async function showRewarded(): Promise<boolean> {
  if (!ADS_ENABLED) return false;
  return false;
}
