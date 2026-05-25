import { Purchases } from '@revenuecat/purchases-capacitor';

const REVENUECAT_IOS_KEY = 'app4f8593bb6d';

export const PRODUCT_IDS = {
  removeAds: 'arrow_escape_remove_ads',
  hints20: 'arrow_escape_hints_20',
};

const ENTITLEMENT_IDS = {
  removeAds: 'remove_ads',
};

let purchasesAvailable = false;

export async function initIAP(): Promise<void> {
  try {
    await Purchases.configure({ apiKey: REVENUECAT_IOS_KEY });
    purchasesAvailable = true;
  } catch {
    // Web — native bridge not available
  }
}

export async function purchaseRemoveAds(): Promise<boolean> {
  if (!purchasesAvailable) return false;
  try {
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
    const info = await Purchases.restorePurchases();
    const removeAds = !!info.customerInfo.entitlements.active[ENTITLEMENT_IDS.removeAds];
    return { removeAds };
  } catch {
    return { removeAds: false };
  }
}
