# Fucina.Ventures · sito

Sito di Fucina.Ventures in **React** (Vite), in tre lingue: italiano (`/`), inglese (`/en/`), spagnolo (`/es/`).
Ogni pagina viene generata come **HTML statico** già pronto (buono per Google), poi React la rende viva nel browser.
Il modulo «Entra in Fucina» è gestito da un piccolo **Cloudflare Worker**: controlla i dati, salva il PDF in privato e vi manda una email.

## Comandi

```
npm install        # una volta
npm run dev        # anteprima mentre si lavora (il modulo qui non spedisce)
npm run build      # crea il sito in dist/client (+ sitemap.xml)
npm run preview    # sito + modulo in locale, come sarà online
npm run deploy     # pubblica su Cloudflare (serve aver fatto "npx wrangler login")
```

## Dove sono le cose

| Cosa | File |
|---|---|
| Testi (tutti) | `src/i18n/it.js`, `en.js`, `es.js` |
| Sezioni della home | `src/components/Home.jsx` |
| Testata e piè di pagina | `src/components/Layout.jsx` |
| Disegni (logo, ruoli, buyer, modulo di esempio) | `src/components/Disegni.jsx` |
| Grafica | `src/styles.css` |
| Pagine e SEO (titoli, hreflang, dati per Google) | `src/routes.js`, `src/entry-server.jsx` |
| Modulo ed email | `worker/index.js`, `wrangler.toml` |
| Foto, favicon, robots, intestazioni di sicurezza | `public/` |

Per cambiare un testo basta modificare il file della lingua: la stessa chiave va cambiata in tutte e tre.

## Mettere online (Cloudflare, una volta sola)

1. **Dominio** su Cloudflare (es. `fucina.ventures`).
2. **Email Routing** (Dominio › Email › Email Routing): attivalo, crea `ciao@fucina.ventures` che inoltra alla vostra casella e **verifica** l'indirizzo di destinazione. Le email del modulo arrivano a `DESTINATARIO` in `wrangler.toml`.
3. **R2**: crea il bucket privato `fucina-proposte` (qui finiscono i PDF; si scaricano dal pannello R2).
4. **Workers & Pages › Create › Import a repository**: scegli `giovannipecora/fucina-ventures`.
   Build command: `npm run build` · Deploy command: `npx wrangler deploy`.
   Ogni push su `main` ripubblica il sito da solo.
5. **Dominio personalizzato**: nel Worker › Settings › Domains & Routes aggiungi `fucina.ventures` (e `www`).
6. **Statistiche del traffico**: Analytics & Logs › **Web Analytics** › aggiungi il sito e attiva l'inserimento automatico. Non usa cookie: non serve il banner.
7. **Google Search Console**: aggiungi la proprietà del dominio e invia `https://fucina.ventures/sitemap.xml`.

## Prima di pubblicare davvero

- [ ] Partita IVA vera al posto di `IT01234567890` (nei tre file delle lingue, `footer.company`).
- [ ] Riempire i punti tra parentesi quadre: soglia `[X]` di ARR, quota di equity, prezzo di uscita, costi dello spin-off, accordo di riservatezza.
- [ ] Informativa privacy: è una **bozza** (`privacyPage` nei file delle lingue), da far validare a un legale; mettere l'email per la privacy.
- [ ] Controllare `MITTENTE` e `DESTINATARIO` in `wrangler.toml`.
- [ ] (Consigliato) Cloudflare **Turnstile** sul modulo contro lo spam, se arrivano invii automatici.

## Privacy, in breve

- Font serviti dal sito stesso (nessuna chiamata a Google Fonts).
- Nessun cookie, nessun tracciamento: solo Cloudflare Web Analytics, senza dati personali.
- I PDF restano in un bucket privato; nell'email arriva solo il loro nome, non il file.
