import { Suspense } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useI18n } from '../shared/i18n/useI18n';
import { Icon } from '../shared/ui/Icon';
import { useTheme } from '../shared/theme/useTheme';
import styles from './AppShell.module.css';

export function AppShell() {
  const { t, locale, setLocale } = useI18n();
  const { theme, toggle } = useTheme();

  return (
    <>
      <a className={styles.skip} href="#main">
        {t('nav.skip')}
      </a>
      <header className={styles.header} data-print="hide">
        <div className={`${styles.bar} container`}>
          <Link to="/" className={styles.wordmark} aria-label={t('nav.home')}>
            Verdict<span aria-hidden="true">.</span>
          </Link>
          <nav className={styles.nav} aria-label="Main">
            <NavLink to="/compare" className={styles.navLink}>
              {t('nav.compare')}
            </NavLink>
            <button
              type="button"
              className={styles.iconButton}
              onClick={() => setLocale(locale === 'en' ? 'es' : 'en')}
              aria-label={t('lang.switch')}
              lang={locale === 'en' ? 'es' : 'en'}
            >
              {t('lang.code')}
            </button>
            <button
              type="button"
              className={styles.iconButton}
              onClick={toggle}
              aria-label={t(theme === 'dark' ? 'theme.toLight' : 'theme.toDark')}
            >
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
            </button>
          </nav>
        </div>
      </header>
      <main id="main" className={styles.main} tabIndex={-1}>
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </main>
      <footer className={styles.footer}>
        <div className={`${styles.footerInner} container`}>
          <p>{t('home.footer')}</p>
          <p className="mono">© {new Date().getFullYear()} Daniel Escobar</p>
        </div>
      </footer>
    </>
  );
}
