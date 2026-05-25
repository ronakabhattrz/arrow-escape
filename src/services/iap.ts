import { Purchases } from '@revenuecat/purchases-capacitor';

const REVENUECAT_IOS_KEY = 'app4f8593bb6d';

export const PRODUCT_IDS = {
  removeAds: 'arrow_escape_remove_ads',
  hints20: 'arrow_escape_hints_20',
};

const ENTITLEMENT_IDS = {
  removeAds: 'remove_ads',
};

let configured = false;

async function ensureConfigured(): Promise<boolean> {
  if (configured) return true;
  try {
    await Purchases.configure({ apiKey: REVENUECAT_IOS_KEY });
    configured = true;
    return true;
  } catch {
    return false;
  }
}

export async function initIAP(): Promise<void> {
  await ensureConfigured();
}

async function purchaseById(productId: string): Promise<boolean> {
  if (!await ensureConfigured()) return false;
  try {
    // Fetch the store product directly — no Offerings setup required
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (Purchases as any).getProducts({ productIdentifiers: [productId] });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const productsArr = result?.products ?? result;
    const product = Array.isArray(productsArr) ? productsArr[0] : null;
    if (!product) return false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (Purchases as any).purchaseStoreProduct({ product });
    return true;
  } catch {
    return false;
  }
}

export async function purchaseRemoveAds(): Promise<boolean> {
  return purchaseById(PRODUCT_IDS.removeAds);
}

export async function purchaseHints20(): Promise<boolean> {
  return purchaseById(PRODUCT_IDS.hints20);
}

export async function restorePurchases(): Promise<{ removeAds: boolean }> {
  try {
    if (!await ensureConfigured()) return { removeAds: false };
    const result = await Purchases.restorePurchases();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customerInfo = (result as any).customerInfo ?? result;
    const removeAds = !!customerInfo.entitlements?.active?.[ENTITLEMENT_IDS.removeAds];
    return { removeAds };
  } catch {
    return { removeAds: false };
  }
}
