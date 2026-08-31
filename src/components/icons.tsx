// ---------- Willkommen-Screen ----------
export const Chevron = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M9 6l6 6-6 6" stroke="#105258" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const LoginIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
    <path d="M13 4h5a1 1 0 011 1v14a1 1 0 01-1 1h-5" stroke="#105258" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M4 12h10M10 8l4 4-4 4" stroke="#105258" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const UserPlusIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
    <circle cx="10" cy="8" r="3.4" stroke="#105258" strokeWidth="1.4" />
    <path d="M4 20c0-3.3 2.7-6 6-6 1.2 0 2.4.4 3.3 1" stroke="#105258" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M17.5 13.5v6M14.5 16.5h6" stroke="#105258" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="16.8" cy="9.2" r="0.9" fill="#105258" />
  </svg>
);

export const ShieldIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
    <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z" stroke="#105258" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M9 12l2 2 4-4" stroke="#105258" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PinIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
    <path d="M12 21s-7-6.1-7-11a7 7 0 1114 0c0 4.9-7 11-7 11z" stroke="#105258" strokeWidth="1.3" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="2.6" stroke="#105258" strokeWidth="1.3" />
  </svg>
);

export const HeartIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
    <path d="M12 20s-8-4.8-8-10.2C4 6.5 6 5 8.3 5c1.6 0 3 .8 3.7 2 .7-1.2 2.1-2 3.7-2C18 5 20 6.5 20 9.8 20 15.2 12 20 12 20z" stroke="#105258" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
);

export const HeadsetIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
    <path d="M4 14v-2a8 8 0 0116 0v2" stroke="#105258" strokeWidth="1.5" strokeLinecap="round" />
    <rect x="2.5" y="13" width="4.5" height="7" rx="2.2" stroke="#105258" strokeWidth="1.5" />
    <rect x="17" y="13" width="4.5" height="7" rx="2.2" stroke="#105258" strokeWidth="1.5" />
    <path d="M19.5 20.5a4.5 4.5 0 01-4.5 3h-2" stroke="#105258" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// ---------- Rollen-Screen ----------
export const HomeSmallIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-5v-6h-4v6H5a1 1 0 01-1-1v-9z" stroke="#ffffff" strokeWidth="1.7" strokeLinejoin="round" />
  </svg>
);

export const ArrowRight = ({ color = "#1c2129" }: { color?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M4 12h15M13 6l6 6-6 6" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const DocIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
    <path d="M7 3h7l4 4v14H7V3z" stroke="#105258" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M14 3v4h4" stroke="#105258" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M10 4.5v-3h3.2" stroke="#105258" strokeWidth="1.3" strokeLinecap="round" />
    <rect x="9.5" y="9" width="5" height="6.5" rx="0.5" stroke="#105258" strokeWidth="1.2" />
    <path d="M9.5 11h5M9.5 13h5" stroke="#105258" strokeWidth="1" />
  </svg>
);

export const PersonSearchIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="8.5" r="3.2" stroke="#105258" strokeWidth="1.3" />
    <path d="M5 20c0-3 2.7-5.5 6-5.5 1 0 2 .2 2.8.6" stroke="#105258" strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="16" cy="16" r="3" stroke="#105258" strokeWidth="1.3" />
    <path d="M18.3 18.3l2.2 2.2" stroke="#105258" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export const ClipboardIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="4" width="14" height="17" rx="2" stroke="#105258" strokeWidth="1.3" />
    <rect x="9" y="2.5" width="6" height="3.5" rx="1" stroke="#105258" strokeWidth="1.3" fill="#f5f8f7" />
    <path d="M9 12l2 2 4-4" stroke="#105258" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ShieldCheckIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
    <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z" stroke="#105258" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M9 12l2 2 4-4" stroke="#105258" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const BriefcaseIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
    <rect x="3.5" y="7.5" width="17" height="12" rx="2.5" stroke="#105258" strokeWidth="1.4" />
    <path d="M9 7.5V6a2 2 0 012-2h2a2 2 0 012 2v1.5" stroke="#105258" strokeWidth="1.4" />
    <path d="M3.5 12.5h17" stroke="#105258" strokeWidth="1.4" />
    <rect x="10" y="11" width="4" height="3" rx="1" stroke="#105258" strokeWidth="1.4" fill="#f5f8f7" />
  </svg>
);

export const LockIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="5.5" y="10.5" width="13" height="9.5" rx="2.5" stroke="#1c2129" strokeWidth="1.4" />
    <path d="M8.5 10.5V8a3.5 3.5 0 017 0v2.5" stroke="#1c2129" strokeWidth="1.4" />
    <circle cx="12" cy="15" r="1.3" fill="#1c2129" />
    <path d="M12 16v1.5" stroke="#1c2129" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

// ---------- Formular-Icons (register-pro) ----------
export const StoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M4 9l1-4h14l1 4M4 9v11h16V9M4 9h16M9 20v-6h6v6" stroke="#8a9aa0" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);
export const PersonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="3.4" stroke="#8a9aa0" strokeWidth="1.5" />
    <path d="M5.5 20c.8-3.2 3.4-5 6.5-5s5.7 1.8 6.5 5" stroke="#8a9aa0" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
export const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" stroke="#8a9aa0" strokeWidth="1.5" />
    <path d="M4 7l8 6 8-6" stroke="#8a9aa0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const LockSmallIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="5.5" y="10.5" width="13" height="9.5" rx="2.5" stroke="#8a9aa0" strokeWidth="1.5" />
    <path d="M8.5 10.5V8a3.5 3.5 0 017 0v2.5" stroke="#8a9aa0" strokeWidth="1.5" />
  </svg>
);
export const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" stroke="#8a9aa0" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="2.8" stroke="#8a9aa0" strokeWidth="1.5" />
  </svg>
);
export const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" stroke="#8a9aa0" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="2.8" stroke="#8a9aa0" strokeWidth="1.5" />
    <path d="M4 20L20 4" stroke="#8a9aa0" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
export const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
  </svg>
);
export const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#000">
    <path d="M17.05 12.54c-.03-3 2.45-4.44 2.56-4.51-1.4-2.04-3.57-2.32-4.34-2.35-1.85-.19-3.6 1.09-4.54 1.09-.93 0-2.38-1.06-3.92-1.03-2.01.03-3.87 1.17-4.91 2.97-2.09 3.63-.53 9.01 1.5 11.96 1 1.45 2.19 3.07 3.75 3.01 1.51-.06 2.08-.97 3.9-.97s2.34.97 3.93.94c1.62-.03 2.65-1.47 3.64-2.93 1.14-1.67 1.61-3.29 1.64-3.37-.04-.02-3.15-1.21-3.21-4.81zM14.03 3.75c.83-1 1.38-2.4 1.23-3.79-1.19.05-2.63.79-3.48 1.79-.76.89-1.43 2.31-1.25 3.67 1.33.1 2.68-.67 3.5-1.67z" />
  </svg>
);
export const BuildingIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="3.5" width="14" height="17" rx="1.5" stroke="#105258" strokeWidth="1.5" />
    <path d="M9 7h2M13 7h2M9 10.5h2M13 10.5h2M9 14h2M13 14h2" stroke="#105258" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M10.5 20.5v-3.5h3v3.5" stroke="#105258" strokeWidth="1.5" />
  </svg>
);
export const ShieldSmallIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z" stroke="#105258" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M9 12l2 2 4-4" stroke="#105258" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const CalendarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="5.5" width="16" height="15" rx="2" stroke="#105258" strokeWidth="1.5" />
    <path d="M4 10h16M8 3.5v4M16 3.5v4" stroke="#105258" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
export const PhoneIcon = ({ width = 22, height = 22 }: { width?: number; height?: number } = {}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <path d="M6 3.5h3l1.5 4-2 1.5a12 12 0 006.5 6.5l1.5-2 4 1.5v3a2 2 0 01-2 2C10.5 20 4 13.5 4 5.5a2 2 0 012-2z" stroke="#105258" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);
export const GlobeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8.5" stroke="#105258" strokeWidth="1.5" />
    <path d="M3.5 12h17M12 3.5c2.5 2.3 3.8 5.2 3.8 8.5s-1.3 6.2-3.8 8.5c-2.5-2.3-3.8-5.2-3.8-8.5s1.3-6.2 3.8-8.5z" stroke="#105258" strokeWidth="1.5" />
  </svg>
);
export const PinSmallIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M12 21s-7-6.1-7-11a7 7 0 1114 0c0 4.9-7 11-7 11z" stroke="#105258" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="2.6" stroke="#105258" strokeWidth="1.5" />
  </svg>
);
export const GearIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" stroke="#105258" strokeWidth="1.5" />
    <path d="M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3M5.5 5.5l2.1 2.1M16.4 16.4l2.1 2.1M18.5 5.5l-2.1 2.1M7.6 16.4l-2.1 2.1" stroke="#105258" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
export const CheckCircleIcon = ({ color = "#105258" }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
    <path d="M8.5 12.5l2.3 2.3 4.7-5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14M5 12h14" stroke="#1c2129" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
export const ChevronDown = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M6 9l6 6 6-6" stroke="#1c2129" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const CatGartenIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M12 21V10M12 10c0-4 3-6.5 7-6.5 0 4-2.5 6.5-7 6.5zM12 14c0-3-2.3-5-5.5-5 0 3.2 2.2 5 5.5 5z" stroke="#105258" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
);
export const CatElektroIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M13 2.5L5 13.5h6l-1 8 8-11h-6l1-8z" stroke="#105258" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);
export const CatSanitaerIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M12 3.5s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z" stroke="#105258" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);
export const CatDachIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M3 14l9-8 9 8M6 14v5h12v-5" stroke="#105258" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
);
export const CatFensterIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="4" width="14" height="16" rx="1.5" stroke="#105258" strokeWidth="1.4" />
    <path d="M12 4v16M5 12h14" stroke="#105258" strokeWidth="1.4" />
  </svg>
);
export const CatReinigungIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M14 4l6 6-9 9H5v-6l9-9z" stroke="#105258" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M11.5 6.5l6 6" stroke="#105258" strokeWidth="1.4" />
  </svg>
);
export const CatInnenIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M4 20l4-4M8.5 15.5l7-9 3-2-1 3-9 7-1.5 1.5z" stroke="#105258" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M4 20h16" stroke="#105258" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
export const CatMalerIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="4" width="13" height="6" rx="1.5" stroke="#105258" strokeWidth="1.4" />
    <path d="M17 7h3v4h-9" stroke="#105258" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M11 11v3M9.5 14h3v6h-3v-6z" stroke="#105258" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);
export const CatPoolIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M3 15c1.5-1.2 3-1.2 4.5 0s3 1.2 4.5 0 3-1.2 4.5 0 3 1.2 4.5 0M3 19c1.5-1.2 3-1.2 4.5 0s3 1.2 4.5 0 3-1.2 4.5 0 3 1.2 4.5 0" stroke="#105258" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M8 12V6a2 2 0 114 0M14 12V6a2 2 0 114 0M8 9h6" stroke="#105258" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
export const CatMehrIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#105258">
    <circle cx="6" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="18" cy="12" r="1.6" />
  </svg>
);
export const SearchIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="6.5" stroke="#105258" strokeWidth="1.4" />
    <path d="M16 16l4.5 4.5" stroke="#105258" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
export const StarIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
    <path d="M12 3l2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 16.9 6.6 19.8l1.1-6.1L3.2 9.4l6.1-.8L12 3z" stroke="#105258" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);
export const CalendarBigIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" stroke="#105258" strokeWidth="1.4" />
    <path d="M3.5 10h17M8 2.8v4M16 2.8v4" stroke="#105258" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M7 13.5h4v4H7z" stroke="#105258" strokeWidth="1.4" />
  </svg>
);
export const ChatIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
    <path d="M4 6a2.5 2.5 0 012.5-2.5h11A2.5 2.5 0 0120 6v8a2.5 2.5 0 01-2.5 2.5H10L5.5 20v-3.5A2.5 2.5 0 014 14V6z" stroke="#105258" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M8.5 9h7M8.5 12h4.5" stroke="#105258" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
export const CheckIcon = ({ color = "#fff", size = 16 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 12.5l4.5 4.5L19 7.5" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const BellIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M6 9a6 6 0 0112 0c0 5 2 6.5 2 6.5H4S6 14 6 9z" stroke="#1c2129" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M10 18.5a2 2 0 004 0" stroke="#1c2129" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
export const MenuIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <path d="M4 7h16M4 12h16M4 17h16" stroke="#1c2129" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
export const LeafIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M12 21V9M12 9C12 5 15 3 19 3c0 4-2.5 6-7 6zM12 14c0-3-2.3-5-5.5-5 0 3.2 2.2 5 5.5 5z" stroke="#105258" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
);
export const ClipboardSmallIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="4" width="14" height="17" rx="2" stroke="#105258" strokeWidth="1.5" />
    <rect x="9" y="2.5" width="6" height="3.5" rx="1" stroke="#105258" strokeWidth="1.5" fill="#fff" />
    <path d="M9 12l2 2 4-4" stroke="#105258" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const CalendarCheckIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="5" width="16" height="15.5" rx="2" stroke="#105258" strokeWidth="1.5" />
    <path d="M4 10h16M8 3v4M16 3v4" stroke="#105258" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9 15l2 2 4-4" stroke="#105258" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const ChatBubbleIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M4 6a2.5 2.5 0 012.5-2.5h11A2.5 2.5 0 0120 6v8a2.5 2.5 0 01-2.5 2.5H10L5.5 20v-3.5A2.5 2.5 0 014 14V6z" stroke="#105258" strokeWidth="1.5" strokeLinejoin="round" fill={filled ? "#105258" : "none"} />
  </svg>
);
export const TreeIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
    <path d="M12 3l4.5 6h-2.5l3.5 5H6.5L10 9H7.5L12 3zM12 14v7" stroke="#105258" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
);
export const LeafSmallIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
    <path d="M6 18C6 10 11 5 19 5c0 8-5 13-13 13zM6 18c2-4 5-7 9-9" stroke="#105258" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const FireIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="#e2543e">
    <path d="M12 2s1 3.5-2 6.5c-2.4 2.4-4 4.5-2.5 8A6.5 6.5 0 0012 22a6.5 6.5 0 006.5-6.5c0-2.5-1.5-4.5-2.5-5.5 0 1.5-1 2.5-2 4.5 0-3-1-5-2-6.5z" />
  </svg>
);
export const SirenIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
    <path d="M7 17v-4a5 5 0 0110 0v4" stroke="#e2543e" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M4 19h16" stroke="#e2543e" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M12 3v2M4.5 6l1.4 1.4M19.5 6l-1.4 1.4" stroke="#e2543e" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);
export const RobotIcon = () => (
  <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="10" r="4" fill="#1c2129" />
    <path d="M32 14v6" stroke="#1c2129" strokeWidth="3" strokeLinecap="round" />
    <rect x="14" y="20" width="36" height="28" rx="10" fill="#fff" stroke="#1c2129" strokeWidth="3" />
    <circle cx="25" cy="33" r="3.2" fill="#1c2129" />
    <circle cx="39" cy="33" r="3.2" fill="#1c2129" />
    <path d="M26 40c2 2.5 10 2.5 12 0" stroke="#1c2129" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);
export const CameraIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M4 8h3l1.5-2h7L17 8h3a1.5 1.5 0 011.5 1.5v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5a1 1 0 011-1z" stroke="#1c2129" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="12" cy="13.5" r="3.2" stroke="#1c2129" strokeWidth="1.5" />
  </svg>
);
export const MicIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="9.5" y="3.5" width="5" height="10" rx="2.5" stroke="#1c2129" strokeWidth="1.5" />
    <path d="M6 11.5a6 6 0 0012 0M12 17.5v3" stroke="#1c2129" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
export const ArrowRightWhite = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M4 12h15M13 6l6 6-6 6" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const EuroDocIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
    <path d="M7 3h7l4 4v14H7V3z" stroke="#105258" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M14 3v4h4" stroke="#105258" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M14.5 9.5a4 4 0 100 5M8.5 10.5h4M8.5 13h4" stroke="#105258" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
export const BookIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
    <path d="M12 6c-2-1.5-5-2-8-2v14c3 0 6 .5 8 2 2-1.5 5-2 8-2V4c-3 0-6 .5-8 2z" stroke="#105258" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M12 6v14" stroke="#105258" strokeWidth="1.5" />
  </svg>
);
export const PersonSmallIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8.5" r="3.4" stroke="#105258" strokeWidth="1.5" />
    <path d="M5.5 20c.8-3.3 3.4-5.2 6.5-5.2s5.7 2 6.5 5.2" stroke="#105258" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
export const SearchSmallIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="6.5" stroke="#6b7d82" strokeWidth="1.6" />
    <path d="M16 16l4.5 4.5" stroke="#6b7d82" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
export const MoreIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="#6b7d82">
    <circle cx="5" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="19" cy="12" r="1.8" />
  </svg>
);
export const HomeOutlineIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
    <path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-5v-6h-4v6H5a1 1 0 01-1-1v-9z" stroke="#105258" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);
export const SearchThinIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="6.5" stroke="#105258" strokeWidth="1.4" />
    <path d="M16 16l4.5 4.5" stroke="#105258" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
export const ChatFaceIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8.5" stroke="#105258" strokeWidth="1.4" />
    <circle cx="9" cy="10.5" r="1" fill="#105258" />
    <circle cx="15" cy="10.5" r="1" fill="#105258" />
    <path d="M9 14c1.8 1.5 4.2 1.5 6 0" stroke="#105258" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
export const LockTinyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="5.5" y="10.5" width="13" height="9.5" rx="2.5" stroke="#8a9aa0" strokeWidth="1.5" />
    <path d="M8.5 10.5V8a3.5 3.5 0 017 0v2.5" stroke="#8a9aa0" strokeWidth="1.5" />
  </svg>
);
export const FlagDeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24">
    <rect width="24" height="8" fill="#262626" />
    <rect y="8" width="24" height="8" fill="#d02f2f" />
    <rect y="16" width="24" height="8" fill="#f5c542" />
  </svg>
);
export const HomeTabIcon = ({ active = false }: { active?: boolean }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill={active ? "#105258" : "none"}>
    <path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-5v-6h-4v6H5a1 1 0 01-1-1v-9z" stroke="#105258" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

// ---------- Eigentümer Dashboard + SideMenu ----------
export const NotfallSirenIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <path d="M7 17v-4a5 5 0 0110 0v4" stroke="#e0311e" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M4.5 19.5h15" stroke="#e0311e" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M12 3v2M5 5.5l1.4 1.4M19 5.5l-1.4 1.4" stroke="#e0311e" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
export const HamburgerIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
    <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17" stroke="#1c2129" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
export const BellRoundedIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M6.5 9.5a5.5 5.5 0 0111 0c0 4.5 1.8 5.8 1.8 5.8H4.7s1.8-1.3 1.8-5.8z" stroke="#1c2129" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M10.3 18.5a1.8 1.8 0 003.4 0" stroke="#1c2129" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
export const ChatRoundIcon = ({ variant = "dark" }: { variant?: "dark" | "light" }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <path d="M4.5 6.5A2.5 2.5 0 017 4h10a2.5 2.5 0 012.5 2.5v7A2.5 2.5 0 0117 16h-6.5L6 19.5V16h-.5A2.5 2.5 0 014.5 13.5v-7z" stroke={variant === "dark" ? "#fff" : "#105258"} strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);
export const CalendarCheckThinIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="5" width="16" height="15.5" rx="2" stroke="#105258" strokeWidth="1.4" />
    <path d="M4 10h16M8 3v4M16 3v4" stroke="#105258" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M9 15l2 2 4-4" stroke="#105258" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const BookThinIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
    <path d="M12 6c-2-1.5-5-2-8-2v14c3 0 6 .5 8 2 2-1.5 5-2 8-2V4c-3 0-6 .5-8 2z" stroke="#105258" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M12 6v14" stroke="#105258" strokeWidth="1.4" />
  </svg>
);
export const HomeMenuIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <path d="M4.5 10.5L12 4l7.5 6.5V19a1 1 0 01-1 1h-4.5v-5h-4v5H5.5a1 1 0 01-1-1v-8.5z" stroke="#105258" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);
export const GearMenuIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" stroke="#105258" strokeWidth="1.6" />
    <path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4L18 18M18 6l-1.6 1.6M7.6 16.4L6 18" stroke="#105258" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
export const LogoutIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M14 4H6a1.5 1.5 0 00-1.5 1.5v13A1.5 1.5 0 006 20h8" stroke="#105258" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M11 12h9M17 8.5L20.5 12 17 15.5" stroke="#105258" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const CrownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#f0c25a"><path d="M4 8l4 3 4-6 4 6 4-3-1.5 10h-13L4 8z" /></svg>
);
export const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#1c2129" strokeWidth="1.3" strokeLinecap="round" /></svg>
);
export const ArrowRightThin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 5.5l6.5 6.5L9 18.5" stroke="#1c2129" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
export const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#1c2129" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
export const PlusIcon2 = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" /></svg>
);
