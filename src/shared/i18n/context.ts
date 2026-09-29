import { createContext } from 'react';
import type { MessageKey } from './messages';

export type Locale = 'en' | 'es';

export interface I18nValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey, vars?: Record<string, string | number>) => string;
  formatDate: (iso: string) => string;
}

export const I18nContext = createContext<I18nValue | null>(null);
