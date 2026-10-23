import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import { findRoute, routes, alternates, SITE } from './routes.js';
import { testi } from './i18n/index.js';

export { routes, SITE };

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

export function render(path) {
  const route = findRoute(path);
  const t = testi[route.lang];
  const meta = t.meta[route.page];
  const url = SITE + (route.file ? '/' : route.path);
  const head = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    route.noindex ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${url}" />`,
    ...(route.noindex ? [] : alternates(route).map((a) => `<link rel="alternate" hreflang="${a.lang}" href="${SITE}${a.path}" />`)),
    ...(route.noindex ? [] : [`<link rel="alternate" hreflang="x-default" href="${SITE}${alternates(route).find((a) => a.lang === 'it').path}" />`]),
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Fucina.Ventures" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SITE}/assets/og.jpg" />`,
    `<meta property="og:locale" content="${t.locale}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    route.page === 'home' ? '<link rel="preload" as="image" href="/assets/forgia.webp" type="image/webp" />' : '',
    route.page === 'home'
      ? `<script type="application/ld+json">${JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Fucina.Ventures',
          legalName: 'Fucina.Ventures S.r.l.s.',
          url: SITE,
          logo: `${SITE}/favicon.svg`,
          description: meta.description,
          address: { '@type': 'PostalAddress', addressLocality: 'Bologna', addressCountry: 'IT' },
        })}</script>`
      : '',
  ].filter(Boolean).join('\n');
  const html = renderToString(<App path={route.file ? '/404' : route.path} />);
  return { html, head, lang: route.lang };
}
