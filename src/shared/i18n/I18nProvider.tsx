import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { readStorage, writeStorage } from '../lib/storage';
import { en, es, type Messages } from './messages';

import { I18nContext, type I18nValue, type Locale } from './context';

const CATALOGS: Record<Locale, Messages> = { en, es };
const KEY = 'verdict:locale';

function detectLocale(): Locale {
  const stored = readStorage<Locale | null>(KEY, null);
  if (stored === 'en' || stored === 'es') return stored;
  return navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en';
}

export function I18nProvider({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(() => initialLocale ?? detectLocale());

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    writeStorage(KEY, next);
  }, []);

  const value = useMemo<I18nValue>(() => {
    const catalog = CATALOGS[locale];
    const dateFormat = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' });
    return {
      locale,
      setLocale,
      t: (key, vars) =>
        vars
          ? catalog[key].replace(/\{(\w+)\}/g, (match, name: string) =>
              name in vars ? String(vars[name]) : match,
            )
          : catalog[key],
      formatDate: (iso) => dateFormat.format(new Date(iso)),
    };
  }, [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
