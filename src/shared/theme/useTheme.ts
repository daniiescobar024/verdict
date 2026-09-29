import { useCallback, useEffect, useState } from 'react';
import { readStorage, writeStorage } from '../lib/storage';

export type Theme = 'dark' | 'light';
const KEY = 'verdict:theme';

function initialTheme(): Theme {
  const stored = readStorage<Theme | null>(KEY, null);
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#0d0c0a' : '#f5f1e8');
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      writeStorage(KEY, next);
      return next;
    });
  }, []);

  return { theme, toggle };
}
