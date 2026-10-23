import { Logo } from './Disegni.jsx';
import { alternates, homeOf, privacyOf } from '../routes.js';

export function Wordmark() {
  return (
    <span className="wordmark">
      FUCINA<span className="dot" aria-hidden="true" /><span className="sr-only">.</span><span className="v">VENTURES</span>
    </span>
  );
}

export function Header({ t, route }) {
  const home = homeOf[t.lang];
  const onHome = route.page === 'home';
  const href = (hash) => (onHome ? hash : home + hash);
  const langs = alternates(route);
  return (
    <header className="head">
      <a className="skip" href="#main">{t.skip}</a>
      <div className="wrap head-in">
        <a className="brand" href={home} aria-label="Fucina.Ventures">
          <Logo />
          <span className="brand-text">
            <Wordmark />
            <span className="brand-tag">Venture builder AI-native</span>
          </span>
        </a>
        <nav className="nav" aria-label={t.nav.label}>
          {t.nav.links.map(([h, l]) => (
            <a key={h} href={href(h)}>{l}</a>
          ))}
        </nav>
        <div className="head-right">
          <div className="langs" role="group" aria-label={t.nav.langLabel}>
            {langs.map((a) =>
              a.lang === t.lang ? (
                <span key={a.lang} aria-current="page">{a.lang.toUpperCase()}</span>
              ) : (
                <a key={a.lang} href={a.path} lang={a.lang} hrefLang={a.lang}>{a.lang.toUpperCase()}</a>
              ),
            )}
          </div>
          <a className="btn btn-primary btn-small" href={href('#proponi')}>{t.nav.cta}</a>
        </div>
      </div>
    </header>
  );
}

export function Footer({ t }) {
  const home = homeOf[t.lang];
  return (
    <footer className="foot">
      <div className="wrap foot-sign" aria-hidden="true">
        <span>FUCINA</span><span className="dot" /><span className="v">VENTURES</span>
      </div>
      <div className="wrap foot-in">
        <div className="foot-col">
          <span style={{ color: 'var(--ink)' }}>Venture builder AI-native</span>
          <span>{t.footer.tagline}</span>
        </div>
        <div className="foot-col">
          <span>{t.footer.company}</span>
          <span>{t.footer.city}</span>
          <span>© {new Date().getFullYear()} Fucina.Ventures</span>
        </div>
        <div className="foot-col">
          <a href={home + '#proponi'}>{t.footer.pitch}</a>
          <a href={home + '#portfolio'}>{t.footer.portfolio}</a>
          <a href={privacyOf[t.lang]}>{t.footer.privacy}</a>
        </div>
      </div>
    </footer>
  );
}
