// Crea un file HTML statico per ogni pagina (buono per Google) e la sitemap.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const client = path.join(root, 'dist/client');
const template = fs.readFileSync(path.join(client, 'index.html'), 'utf8');
const { render, routes, SITE } = await import(pathToFileURL(path.join(root, 'dist/server/entry-server.js')).href);

for (const r of routes) {
  const { html, head, lang } = render(r.path);
  const out = template.replace('<!--lang-->', lang).replace('<!--head-->', head).replace('<!--app-->', html);
  const file = r.file ? path.join(client, r.file) : path.join(client, r.path, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, out);
  console.log('  ✓', r.file || r.path);
}

const today = new Date().toISOString().slice(0, 10);
const indexable = routes.filter((r) => !r.noindex && !r.file);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${indexable.map((r) => `  <url>
    <loc>${SITE}${r.path}</loc>
    <lastmod>${today}</lastmod>
${indexable.filter((a) => a.alt === r.alt).map((a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${SITE}${a.path}"/>`).join('\n')}
  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(client, 'sitemap.xml'), sitemap);
console.log('  ✓ sitemap.xml');
