// RevenueCat IAP service wrapper
// TODO: Install @revenuecat/purchases-capacitor and add your API keys

// TODO: Replace with your RevenueCat API keys
// TODO: Replace with your RevenueCat API keys from https://app.revenuecat.com
const REVENUECAT_IOS_KEY = 'TODO_YOUR_REVENUECAT_IOS_KEY';
// TODO: const REVENUECAT_ANDROID_KEY = 'TODO_YOUR_REVENUECAT_ANDROID_KEY';

export const PRODUCT_IDS = {
  removeAds: 'arrow_escape_remove_ads',
  hints20: 'arrow_escape_hints_20',
};

let purchasesAvailable = false;

export async function initIAP(): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { Purchases } = await import(/* @vite-ignore */ '@revenuecat/purchases-capacitor' as any);
    const apiKey = REVENUECAT_IOS_KEY; // TODO: use Capacitor.getPlatform() to select android key
    await Purchases.configure({ apiKey });
    purchasesAvailable = true;
  } catch {
    // Web or RevenueCat not installed
  }
}

export async function purchaseRemoveAds(): Promise<boolean> {
  if (!purchasesAvailable) return false;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { Purchases } = await import(/* @vite-ignore */ '@revenuecat/purchases-capacitor' as any);
    const offerings = await Purchases.getOfferings();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pkg = offerings.current?.availablePackages.find((p: any) => p.product.identifier === PRODUCT_IDS.removeAds);
    if (!pkg) return false;
    await Purchases.purchasePackage({ aPackage: pkg });
    return true;
  } catch {
    return false;
  }
}

export async function purchaseHints20(): Promise<boolean> {
  if (!purchasesAvailable) return false;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { Purchases } = await import(/* @vite-ignore */ '@revenuecat/purchases-capacitor' as any);
    const offerings = await Purchases.getOfferings();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pkg = offerings.current?.availablePackages.find((p: any) => p.product.identifier === PRODUCT_IDS.hints20);
    if (!pkg) return false;
    await Purchases.purchasePackage({ aPackage: pkg });
    return true;
  } catch {
    return false;
  }
}

export async function restorePurchases(): Promise<{ removeAds: boolean }> {
  if (!purchasesAvailable) return { removeAds: false };
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { Purchases } = await import(/* @vite-ignore */ '@revenuecat/purchases-capacitor' as any);
    const info = await Purchases.restorePurchases();
    const removeAds = !!info.customerInfo.entitlements.active[PRODUCT_IDS.removeAds];
    return { removeAds };
  } catch {
    return { removeAds: false };
  }
}
