import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { I18nProvider } from '../shared/i18n/I18nProvider';
import type { Locale } from '../shared/i18n/context';

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false } },
  });
}

export function AppProviders({ children, locale }: { children: ReactNode; locale?: Locale }) {
  const [client] = useState(createQueryClient);
  return (
    <QueryClientProvider client={client}>
      <I18nProvider initialLocale={locale}>{children}</I18nProvider>
    </QueryClientProvider>
  );
}
