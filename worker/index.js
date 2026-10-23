// Fucina.Ventures · Cloudflare Worker
// Serve il sito statico (dist/client) e riceve il modulo «Entra in Fucina» su POST /api/proposta.
// Per ogni proposta: controlla i dati, salva il PDF (privato) su R2 e manda una email al team.

import { EmailMessage } from 'cloudflare:email';

const MAX_PDF = 5 * 1024 * 1024; // 5 MB
const LIMITI = { nome: 120, email: 200, problema: 4000, ruolo: 2000 };
const GRAZIE = { it: '/grazie/', en: '/en/thanks/', es: '/es/gracias/' };
const ERRORE = {
  it: ['Non siamo riusciti a ricevere la proposta', 'Controlla i campi obbligatori e che il PDF sia sotto i 5 MB, poi riprova.', 'Torna al modulo', '/#proponi'],
  en: ['We could not receive your pitch', 'Check the required fields and that the PDF is under 5 MB, then try again.', 'Back to the form', '/en/#proponi'],
  es: ['No hemos podido recibir tu propuesta', 'Revisa los campos obligatorios y que el PDF pese menos de 5 MB, y vuelve a intentarlo.', 'Volver al formulario', '/es/#proponi'],
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/proposta') {
      if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
      return proposta(request, env, url);
    }
    return env.ASSETS.fetch(request);
  },
};

async function proposta(request, env, url) {
  // Solo dal nostro sito
  const origin = request.headers.get('Origin');
  if (origin && origin !== url.origin) return errore('it', 403);

  const len = Number(request.headers.get('Content-Length') || 0);
  if (len > MAX_PDF + 64 * 1024) return errore('it', 413);

  let form;
  try {
    form = await request.formData();
  } catch {
    return errore('it', 400);
  }

  const lang = ['it', 'en', 'es'].includes(form.get('lang')) ? form.get('lang') : 'it';

  // Trappola per i robot: un umano non vede né riempie questo campo
  if (String(form.get('sito_web') || '').trim() !== '') return Response.redirect(new URL(GRAZIE[lang], url), 303);

  const campo = (k) => String(form.get(k) || '').trim();
  const dati = { nome: campo('nome'), email: campo('email'), problema: campo('problema'), ruolo: campo('ruolo') };

  if (!dati.nome || !dati.email || !dati.problema) return errore(lang, 400);
  if (form.get('consenso') !== 'si') return errore(lang, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(dati.email)) return errore(lang, 400);
  for (const [k, max] of Object.entries(LIMITI)) if (dati[k].length > max) return errore(lang, 400);

  // PDF facoltativo: solo PDF veri, al massimo 5 MB, salvati in privato
  let pdfKey = '';
  const pdf = form.get('pdf');
  if (pdf && typeof pdf === 'object' && pdf.size > 0) {
    if (pdf.size > MAX_PDF) return errore(lang, 413);
    const bytes = new Uint8Array(await pdf.arrayBuffer());
    const firma = new TextDecoder().decode(bytes.slice(0, 5));
    if (firma !== '%PDF-') return errore(lang, 415);
    if (!env.PROPOSTE) return errore(lang, 503);
    const giorno = new Date().toISOString().slice(0, 10);
    pdfKey = `proposte/${giorno}/${crypto.randomUUID()}.pdf`;
    await env.PROPOSTE.put(pdfKey, bytes, { httpMetadata: { contentType: 'application/pdf' } });
  }

  try {
    await inviaEmail(env, dati, lang, pdfKey);
  } catch (e) {
    console.log('invio email non riuscito', e && e.message);
    return errore(lang, 502);
  }

  return Response.redirect(new URL(GRAZIE[lang], url), 303);
}

async function inviaEmail(env, d, lang, pdfKey) {
  if (!env.EMAIL || !env.MITTENTE || !env.DESTINATARIO) throw new Error('email non configurata');
  const testo = [
    `Nuova proposta dal sito (${lang.toUpperCase()})`,
    '',
    `Nome: ${d.nome}`,
    `Email: ${d.email}`,
    '',
    'Il problema e la soluzione:',
    d.problema,
    '',
    'Ruolo ed esperienza:',
    d.ruolo || '(non indicato)',
    '',
    pdfKey ? `PDF salvato su R2 (bucket privato): ${pdfKey}` : 'Nessun PDF allegato.',
  ].join('\n');

  const b64 = (s) => btoa(String.fromCharCode(...new TextEncoder().encode(s)));
  const corpo = b64(testo).replace(/.{1,76}/g, '$&\r\n');
  const oggetto = `Nuova proposta: ${d.nome}`.replace(/[\r\n]/g, ' ').slice(0, 150);
  const dominio = env.MITTENTE.split('@')[1];
  const raw = [
    `From: Fucina.Ventures <${env.MITTENTE}>`,
    `To: <${env.DESTINATARIO}>`,
    `Reply-To: <${d.email.replace(/[\r\n<>]/g, '')}>`,
    `Subject: =?UTF-8?B?${b64(oggetto)}?=`,
    `Message-ID: <${crypto.randomUUID()}@${dominio}>`,
    `Date: ${new Date().toUTCString()}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    corpo,
  ].join('\r\n');

  await env.EMAIL.send(new EmailMessage(env.MITTENTE, env.DESTINATARIO, raw));
}

function errore(lang, status) {
  const [titolo, testo, link, href] = ERRORE[lang] || ERRORE.it;
  const html = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${titolo}</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#141210;color:#f1ece4;font-family:system-ui,sans-serif;padding:24px}main{max-width:560px}h1{font-size:32px;line-height:1.1;margin:0 0 12px}p{color:#d3ccc2;line-height:1.6}a{display:inline-block;margin-top:20px;padding:14px 22px;background:#f2692a;color:#141210;font-weight:700;text-decoration:none}</style></head>
<body><main><h1>${titolo}</h1><p>${testo}</p><a href="${href}">${link}</a></main></body></html>`;
  return new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}
