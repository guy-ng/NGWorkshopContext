export type Locale = 'he' | 'en';

export const localeMeta = {
  he: { dir: 'rtl' as const, label: 'עברית', short: 'HE' },
  en: { dir: 'ltr' as const, label: 'English', short: 'EN' },
};

export const ui = {
  he: {
    home: 'בית', about: 'אודות', services: 'שירותים', blog: 'בלוג', contact: 'צור קשר',
    nav: 'ניווט', tagline: 'AI שעובד בתוך התהליך, לא במקומו.',
    privacy: 'מדיניות פרטיות', accessibility: 'הצהרת נגישות',
  },
  en: {
    home: 'Home', about: 'About', services: 'Services', blog: 'Blog', contact: 'Contact',
    nav: 'Navigation', tagline: 'AI that works within the process, not instead of it.',
    privacy: 'Privacy Policy', accessibility: 'Accessibility Statement',
  },
} satisfies Record<Locale, Record<string, string>>;

export function localizedPath(locale: Locale, path = '') {
  return `/${locale}${path ? `/${path.replace(/^\//, '')}` : ''}`;
}

export function counterpartPath(pathname: string, locale: Locale) {
  const target = locale === 'he' ? 'en' : 'he';
  return pathname.replace(/^\/(he|en)(?=\/|$)/, `/${target}`);
}
