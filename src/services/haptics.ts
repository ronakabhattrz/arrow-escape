import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

export const HapticsService = {
  async lightTap(): Promise<void> {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch { /* web fallback */ }
  },
  async errorPattern(): Promise<void> {
    try {
      await Haptics.notification({ type: NotificationType.Error });
    } catch { /* web fallback */ }
  },
  async success(): Promise<void> {
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch { /* web fallback */ }
  },
};
