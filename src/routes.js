// Tutte le pagine del sito. Il prerender crea un file HTML per ognuna.
export const SITE = 'https://fucina.ventures';

// Finché i testi non sono definitivi il sito non si fa indicizzare da Google.
// Al lancio: metti true, e in public/robots.txt e public/_headers togli il blocco.
export const INDICIZZABILE = false;

export const routes = [
  { path: '/', lang: 'it', page: 'home', alt: 'home' },
  { path: '/en/', lang: 'en', page: 'home', alt: 'home' },
  { path: '/es/', lang: 'es', page: 'home', alt: 'home' },
  { path: '/privacy/', lang: 'it', page: 'privacy', alt: 'privacy' },
  { path: '/en/privacy/', lang: 'en', page: 'privacy', alt: 'privacy' },
  { path: '/es/privacidad/', lang: 'es', page: 'privacy', alt: 'privacy' },
  { path: '/grazie/', lang: 'it', page: 'thanks', alt: 'thanks', noindex: true },
  { path: '/en/thanks/', lang: 'en', page: 'thanks', alt: 'thanks', noindex: true },
  { path: '/es/gracias/', lang: 'es', page: 'thanks', alt: 'thanks', noindex: true },
  { path: '/404', file: '404.html', lang: 'it', page: 'notFound', alt: 'notFound', noindex: true },
];

export const homeOf = { it: '/', en: '/en/', es: '/es/' };
export const privacyOf = { it: '/privacy/', en: '/en/privacy/', es: '/es/privacidad/' };
export const thanksOf = { it: '/grazie/', en: '/en/thanks/', es: '/es/gracias/' };

export function findRoute(pathname) {
  let p = pathname || '/';
  if (!p.endsWith('/') && !p.endsWith('.html') && p !== '/404') p += '/';
  return routes.find((r) => r.path === p) || routes.find((r) => r.page === 'notFound');
}

export function alternates(route) {
  return routes.filter((r) => r.alt === route.alt && !r.file);
}
