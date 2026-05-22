interface P { size?: number; className?: string; style?: React.CSSProperties }

const S = ({ size = 22, children, filled, ...rest }: P & { children: React.ReactNode; filled?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke={filled ? 'none' : 'currentColor'}
    strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    {...rest}>{children}</svg>
);

export const IconHome = (p: P) => <S {...p}><path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1v-9.5z"/><polyline points="9 21 9 13 15 13 15 21"/></S>;
export const IconUndo = (p: P) => <S {...p}><polyline points="3 7 3 3 7 3"/><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6.3 2.6L3 14"/></S>;
export const IconRestart = (p: P) => <S {...p}><polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/></S>;
export const IconBack = (p: P) => <S {...p}><polyline points="15 18 9 12 15 6"/></S>;
export const IconPlay = (p: P) => <S filled {...p}><polygon points="5 3 19 12 5 21 5 3"/></S>;
export const IconHint = (p: P) => <S {...p}><path d="M12 2a7 7 0 00-4.9 11.93A3 3 0 009 16.9V18h6v-1.1a3 3 0 001.9-2.97A7 7 0 0012 2z"/><line x1="9" y1="21" x2="15" y2="21"/><line x1="10" y1="23" x2="14" y2="23"/></S>;
export const IconSettings = (p: P) => <S {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></S>;
export const IconStats = (p: P) => <S {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></S>;
export const IconCalendar = (p: P) => <S {...p}><rect x="3" y="4" width="18" height="18" rx="3"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="11" x2="21" y2="11"/><line x1="8" y1="15" x2="8.01" y2="15"/><line x1="12" y1="15" x2="12.01" y2="15"/></S>;
export const IconInfinity = (p: P) => <S {...p}><path d="M18 12a4 4 0 10-8 0 4 4 0 008 0zm0 0a4 4 0 100-8 4 4 0 000 8z"/></S>;
export const IconBook = (p: P) => <S {...p}><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></S>;
export const IconStar = (p: P) => <S filled {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></S>;
export const IconMenu = (p: P) => <S {...p}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></S>;
export const IconCheck = (p: P) => <S {...p}><polyline points="20 6 9 17 4 12"/></S>;
export const IconFlame = (p: P) => <S {...p}><path d="M12 2c0 0-6 5.686-6 10a6 6 0 0012 0c0-2.105-1.667-3.5-1.667-3.5C16 10.667 15 13 13 13c1-3-3-5-1-8z"/></S>;
