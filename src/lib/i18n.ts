// T-0113/T-0114 locale architecture: single typed contract with German as the
// default and deterministic fallback. Locale persistence uses a cookie set by
// explicit user choice. No business rules may branch on translated text — this
// module only resolves strings and locale-safe formatting.
// Coverage contract: every key in de MUST exist in en (enforced by scripts/i18n-regression.mjs).

export type Locale = 'de' | 'en';
const DEFAULT_LOCALE: Locale = 'de';
export const LOCALE_COOKIE = 'eh_locale';

const STRINGS = {
  de: {
    // marketing core
    'marketing.hero.title': 'Du hast ein Haus.',
    'marketing.hero.accent': 'Wir kümmern uns um den Rest.',
    'marketing.cta.start': 'Kostenlos starten',
    'marketing.nav.pricing': 'Preise',
    // auth core
    'auth.login.title': 'Willkommen zurück.',
    'auth.login.cta': 'Anmelden',
    'auth.login.email': 'E-Mail',
    'auth.login.password': 'Passwort',
    'auth.error.credentials': 'E-Mail oder Passwort falsch.',
    'auth.register.cta': 'Registrieren',
    // homeowner app core
    'app.home.title': 'Mein Zuhause',
    'app.jobs.title': 'Aufträge',
    'app.jobs.empty': 'Noch keine Aufträge.',
    'app.messages.title': 'Nachrichten',
    'app.documents.title': 'Dokumente',
    'app.settings.title': 'Einstellungen',
    'app.settings.export': 'Datenexport',
    'app.settings.delete': 'Konto löschen',
    'app.notifications.title': 'Benachrichtigungen',
    'app.reviews.report': 'Melden',
    'app.partners.title': 'Ansprechpartner',
    // partner app core
    'pro.dashboard.title': 'Arbeitsbereich',
    'pro.jobs.title': 'Aufträge',
    'pro.messages.title': 'Nachrichten',
    // validation errors
    'validation.required': 'Bitte ausfüllen.',
    'validation.email': 'Bitte gültige E-Mail-Adresse eingeben.',
    'validation.password': 'Passwort erfüllt die Anforderungen nicht.',
    // empty states
    'empty.generic': 'Noch nichts vorhanden.',
  },
  en: {
    'marketing.hero.title': 'You have a home.',
    'marketing.hero.accent': "We'll take care of the rest.",
    'marketing.cta.start': 'Start for free',
    'marketing.nav.pricing': 'Pricing',
    'auth.login.title': 'Welcome back.',
    'auth.login.cta': 'Sign in',
    'auth.login.email': 'Email',
    'auth.login.password': 'Password',
    'auth.error.credentials': 'Email or password incorrect.',
    'auth.register.cta': 'Sign up',
    'app.home.title': 'My home',
    'app.jobs.title': 'Jobs',
    'app.jobs.empty': 'No jobs yet.',
    'app.messages.title': 'Messages',
    'app.documents.title': 'Documents',
    'app.settings.title': 'Settings',
    'app.settings.export': 'Data export',
    'app.settings.delete': 'Delete account',
    'app.notifications.title': 'Notifications',
    'app.reviews.report': 'Report',
    'app.partners.title': 'Contacts',
    'pro.dashboard.title': 'Workspace',
    'pro.jobs.title': 'Jobs',
    'pro.messages.title': 'Messages',
    'validation.required': 'Please fill in.',
    'validation.email': 'Please enter a valid email address.',
    'validation.password': "Password doesn't meet the requirements.",
    'empty.generic': 'Nothing here yet.',
  },
} as const;

export type StringKey = keyof typeof STRINGS[typeof DEFAULT_LOCALE];

export function normalizeLocale(value: string | undefined | null): Locale {
  return value === 'en' ? 'en' : DEFAULT_LOCALE; // deterministic fallback: de
}

export function getLocaleFromCookieValue(value: string | undefined | null): Locale {
  return normalizeLocale(value);
}

// Locale-safe formatting (Intl-based, no hardcoded formats):
export function formatMoney(locale: Locale, cents: number): string {
  return new Intl.NumberFormat(locale === 'en' ? 'en-IE' : 'de-DE', { style: 'currency', currency: 'EUR' }).format(cents / 100);
}

export function formatDate(locale: Locale, iso: string): string {
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-IE' : 'de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(iso));
}

export function formatNumber(locale: Locale, value: number): string {
  return new Intl.NumberFormat(locale === 'en' ? 'en-IE' : 'de-DE').format(value);
}

export async function getLocale(): Promise<Locale> {
  try {
    const { cookies } = await import('next/headers');
    const jar = await cookies();
    return normalizeLocale(jar.get(LOCALE_COOKIE)?.value);
  } catch {
    return DEFAULT_LOCALE;
  }
}

export function t(locale: Locale, key: StringKey): string {
  return STRINGS[locale]?.[key] ?? STRINGS[DEFAULT_LOCALE][key];
}

export async function getT(): Promise<(key: StringKey) => string> {
  const locale = await getLocale();
  return (key: StringKey) => t(locale, key);
}

// Server-component convenience: resolve + format in one call.
export async function getTFormat(): Promise<{ t: (key: StringKey) => string; formatMoney: (cents: number) => string; formatDate: (iso: string) => string; formatNumber: (v: number) => string; locale: Locale }> {
  const locale = await getLocale();
  return {
    locale,
    t: (key: StringKey) => t(locale, key),
    formatMoney: (cents: number) => formatMoney(locale, cents),
    formatDate: (iso: string) => formatDate(locale, iso),
    formatNumber: (v: number) => formatNumber(locale, v),
  };
}
