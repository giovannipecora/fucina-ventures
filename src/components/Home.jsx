import { useEffect, useRef } from 'react';
import { Buyer, ModuloEsempio, Ruolo } from './Disegni.jsx';
import { privacyOf } from '../routes.js';
import GraficoArr from './Grafico.jsx';
import { X } from './Soglia.jsx';

const SPARKS = [
  [74, 0, -40], [78, 0.8, -18], [82, 1.6, -62], [76, 2.3, 12], [80, 3.1, -30],
  [86, 3.8, -8], [72, 1.1, -52], [88, 2.7, -24], [79, 4.3, 16], [84, 0.4, -36],
];

// Scintille del colpo: partono dal punto in cui il martello tocca l'incudine
const BURST = [
  [-150, -120], [-110, -170], [-60, -200], [-20, -150], [30, -210], [80, -170], [130, -130], [170, -80],
  [-190, -60], [200, -30], [-90, -90], [110, -220], [-140, -200], [60, -110], [-30, -240], [150, -190],
];

// Punto di contatto martello-incudine nella foto (1000 × 667 px)
const FOTO = { w: 1000, h: 667, x: 500, y: 383, posX: 0.72, posY: 0.5 };

function Hero({ t }) {
  const h = t.hero;
  const ref = useRef(null);

  // Posiziona il colpo sul punto giusto della foto, qualunque sia la misura dello schermo
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const place = () => {
      const { width: w, height: hh } = el.getBoundingClientRect();
      const s = Math.max(w / FOTO.w, hh / FOTO.h);
      const x = (w - FOTO.w * s) * FOTO.posX + FOTO.x * s;
      const y = (hh - FOTO.h * s) * FOTO.posY + FOTO.y * s;
      el.style.setProperty('--ix', `${x}px`);
      el.style.setProperty('--iy', `${y}px`);
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, []);

  return (
    <section className="hero" aria-labelledby="hero-title" ref={ref}>
      <picture className="hero-photo">
        <source srcSet="/assets/forgia.webp" type="image/webp" />
        <img src="/assets/forgia.jpg" alt="" width="2000" height="1334" fetchPriority="high" />
      </picture>
      <div className="sparks" aria-hidden="true">
        {SPARKS.map(([l, d, dx], i) => (
          <i key={i} style={{ left: `${l}%`, animationDelay: `${d}s`, '--dx': `${dx}px` }} />
        ))}
      </div>
      <div className="impact" aria-hidden="true">
        <span className="flash" />
        <span className="hot" />
        {BURST.map(([bx, by], i) => (
          <i key={i} style={{ '--bx': `${bx}px`, '--by': `${by}px`, animationDelay: `${0.55 + (i % 4) * 0.02}s` }} />
        ))}
      </div>
      <div className="wrap hero-in">
        <p className="hero-eyebrow strike">{h.eyebrow}</p>
        <h1 id="hero-title" className="strike strike-2">{h.h1a}</h1>
        <p className="hero-sub strike strike-3">{h.h1b}</p>
        <p className="lead">{h.sub}</p>
        <div className="hero-ctas">
          <a className="btn btn-primary" href="#proponi">{h.cta1}<span className="tri" aria-hidden="true" /></a>
          <a className="btn btn-ghost" href="#portfolio">{h.cta2}</a>
        </div>
        <dl className="facts">
          {t.strip.map(([n, l]) => (
            <div className="fact" key={l}>
              <dt className="sr-only">{l}</dt>
              <dd style={{ margin: 0 }}><b className="num">{n}</b><span>{l}</span></dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Perche({ t }) {
  const p = t.perche;
  return (
    <section id="perche" className="sec sec-alt perche" aria-labelledby="perche-title">
      <div className="wrap split">
        <div>
          <p className="kicker">{p.eyebrow.replace(/^\d+ · /, '')}</p>
          <h2 id="perche-title" className="h2">{p.h2a}<span className="soft">{p.h2b}</span></h2>
          <p className="lead">{p.p}</p>
          <p className="quote">{p.quoteA} <em>{p.quoteB}</em></p>
        </div>
        <div>
          <p className="pillars-intro">{p.intro}</p>
          <dl className="pillars">
            {p.items.map(([n, d]) => (
              <div className="pillar" key={n}><dt>{n}</dt><dd>{d}</dd></div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function BuyerSec({ t }) {
  const b = t.buyer;
  return (
    <section id="buyer" className="sec" aria-labelledby="buyer-title">
      <div className="wrap split buyer">
        <div className="blueprint"><Buyer label={b.img} /></div>
        <div>
          <p className="kicker">{b.eyebrow}</p>
          <h2 id="buyer-title" className="h2">{b.h2}</h2>
          <p className="lead" style={{ marginTop: 20 }}>{b.sub}</p>
          <ol className="criteria">
            {b.items.map((it, i) => (
              <li key={it} className={i === 2 ? 'key' : undefined}>{it}</li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <div className="path-arrow" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12h15M13 6l6 6-6 6" /></svg>
    </div>
  );
}

function Modello({ t }) {
  const m = t.modello;
  return (
    <section id="modello" className="sec" aria-labelledby="modello-title">
      <div className="wrap">
        <p className="kicker">{m.eyebrow.replace(/^\d+ · /, '')}</p>
        <h2 id="modello-title" className="h2" style={{ maxWidth: '20ch' }}>{m.h2}</h2>

        <div className="path" role="list" aria-label={m.pathLabel}>
          {m.path.map((s, i) => (
            <FragmentStep key={s.title} s={s} last={i === m.path.length - 1} />
          ))}
        </div>

        <ol className="steps">
          {m.steps.map(([b, s]) => (
            <li key={b}><b>{b}</b><span>{X(s)}</span></li>
          ))}
        </ol>

        <div className="growth">
          <p className="kicker">{m.growth.eyebrow}</p>
          <h3 className="h3" style={{ maxWidth: '22ch' }}>{m.growth.h3}</h3>
          <p className="lead">{m.growth.sub}</p>
          <ol className="stages" style={{ listStyle: 'none', padding: 0 }}>
            {m.growth.stages.filter((s) => !s.later).map((s) => (
              <li key={s.name} className={'stage' + (s.accent ? ' on' : '') + (s.promise ? ' promise' : '') + (s.later ? ' later' : '')}>
                {s.promise && <div className="promise-badge">{s.promise}</div>}
                <div className="stage-n">{s.n}</div>
                <h4>{s.name}</h4>
                <div className="stage-tag">{X(s.tag)}</div>
                <p>{X(s.text)}</p>
                {s.steps && (
                  <ol className="promise-steps">
                    {s.steps.map((x) => <li key={x}>{x}</li>)}
                  </ol>
                )}
                {s.after && <p className="promise-after">{s.after}</p>}
              </li>
            ))}
            <li className="fork">
              <div className="fork-label"><span className="fork-split" aria-hidden="true" />{m.growth.fork.label}</div>
              <div className="fork-paths">
                {m.growth.fork.paths.map((p) => (
                  <div key={p.k} className={'fork-col k' + p.k}>
                    <section className="fork-path">
                      <span className="fork-k" aria-hidden="true">{p.k}</span>
                      <div>
                        <h4>{p.name}</h4>
                        <div className="stage-tag">{p.tag}</div>
                        <p>{p.text}</p>
                      </div>
                    </section>
                    <div className="fork-arrow" aria-hidden="true" />
                    {p.k === 'A' ? (
                      <ol className="fork-next">
                        {m.growth.stages.filter((s) => s.later).map((s) => (
                          <li key={s.name}><span className="stage-n">{s.n}</span><b>{s.name}</b><span className="fork-next-t">{s.text}</span></li>
                        ))}
                      </ol>
                    ) : (
                      <div className="fork-goal">
                        <span className="fork-goal-badge">{m.growth.fork.goal}</span>
                        <b>{m.growth.fork.only}</b>
                        <p>{m.growth.fork.onlyText}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </li>
          </ol>
        </div>

        <div className="arr">
          <p className="kicker">{t.arr.eyebrow}</p>
          <h3 className="h3" style={{ maxWidth: '22ch' }}>{t.arr.h3}</h3>
          <p className="lead">{t.arr.sub}</p>
          <GraficoArr t={t.arr} />
        </div>

        <div className="compare">
          <h3 className="h3">{m.table.caption}</h3>
          <div className="compare-cols">
            {m.table.cols.map((c, ci) => (
              <section key={c} className={'col' + (ci === 2 ? ' us' : '')} aria-label={c}>
                <h4 className="col-name">
                  {ci === 2 && <span className="col-mark" aria-hidden="true" />}
                  {c}
                </h4>
                <dl>
                  {m.table.rows.map((r) => (
                    <div key={r[0]} className="col-row">
                      <dt>{r[0]}</dt>
                      <dd>
                        <span className={'col-ico ' + (ci === 2 ? 'yes' : 'no')} aria-hidden="true" />
                        {r[ci + 1]}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </div>
        <p className="pacts"><strong>{m.pacts[0]}</strong> {X(m.pacts[1])}</p>
      </div>
    </section>
  );
}

function FragmentStep({ s, last }) {
  return (
    <>
      <div role="listitem" className={'path-step' + (last ? ' final' : '')}>
        {last ? (
          <svg width="44" height="44" viewBox="0 0 30 30" aria-hidden="true">
            <path d="M15 2.2 L28 26.5 L2 26.5 Z" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="15" cy="18.6" r="4.6" fill="currentColor" />
          </svg>
        ) : (
          <div className="path-n num">{s.n}</div>
        )}
        <h3>{s.title}</h3>
        <div className="path-tag">{X(s.tag)}</div>
        <p>{X(s.text)}</p>
      </div>
      {!last && <Arrow />}
    </>
  );
}

function Portfolio({ t }) {
  const p = t.portfolio;
  return (
    <section id="portfolio" className="sec light" aria-labelledby="portfolio-title">
      <div className="wrap">
        <p className="kicker">{p.eyebrow.replace(/^\d+ · /, '')}</p>
        <h2 id="portfolio-title" className="h2">{p.h2}</h2>
        <article className="case">
          <div className="case-body">
            <div className="tags">
              <span className="tag status">{p.status}</span>
              {p.tags.map((x) => <span className="tag" key={x}>{x}</span>)}
            </div>
            <div className="case-n">N°001</div>
            <h3>Pratico</h3>
            <p className="case-desc">{p.desc}</p>
          </div>
          <div className="case-visual"><ModuloEsempio t={p} /></div>
        </article>
        <div className="slots">
          {['002', '003', '004'].map((n) => (
            <a className="slot" href="#proponi" key={n}>
              <small>N°{n}</small>
              <span><b>{p.open}</b><span>{p.yourIdea}</span></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Team({ t }) {
  const m = t.team;
  return (
    <section id="team" className="sec" aria-labelledby="team-title">
      <div className="wrap">
        <div className="team-head">
          <div>
            <p className="kicker">{m.eyebrow.replace(/^\d+ · /, '')}</p>
            <h2 id="team-title" className="h2">{m.h2}</h2>
          </div>
          <p className="lead">{m.p}</p>
        </div>
        <div className="roles">
          {m.roles.map(([n, d, icon]) => (
            <article className="role" key={n}>
              <div className="role-art"><Ruolo nome={icon} /></div>
              <h3>{n.replace(/-/g, '‑')}</h3>
              <p>{d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq({ t }) {
  const f = t.faq;
  return (
    <section id="faq" className="sec sec-alt" aria-labelledby="faq-title">
      <div className="wrap split">
        <div>
          <p className="kicker">{f.eyebrow.replace(/^\d+ · /, '')}</p>
          <h2 id="faq-title" className="h2">{f.h2}</h2>
        </div>
        <div className="faq-list">
          {f.items.map(([q, a]) => (
            <details className="faq-item" key={q}>
              <summary>{q}</summary>
              <p>{X(a)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Proponi({ t }) {
  const p = t.proponi;
  const f = p.form;
  return (
    <section id="proponi" className="sec cta" aria-labelledby="proponi-title">
      <picture className="cta-photo" aria-hidden="true">
        <source srcSet="/assets/metallo-fondo.webp" type="image/webp" />
        <img src="/assets/metallo-fondo.jpg" alt="" width="2400" height="1400" loading="lazy" />
      </picture>
      <div className="wrap split">
        <div>
          <p className="kicker">{p.eyebrow}</p>
          <h2 id="proponi-title">{p.h2a}<span>{p.h2b}</span></h2>
          <p className="lead">{p.p}</p>
          <p className="look-title">{p.lookTitle}</p>
          <ul className="look" style={{ marginTop: 12 }}>
            {p.look.map(([s, d]) => (
              <li key={s}><strong>{s}</strong> — {d}</li>
            ))}
          </ul>
        </div>
        <form className="form" method="post" action="/api/proposta" encType="multipart/form-data" aria-label={f.label}>
          <input type="hidden" name="lang" value={t.lang} />
          <div className="hp" aria-hidden="true">
            <label htmlFor="sito_web">{f.honeypot}</label>
            <input id="sito_web" name="sito_web" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <div className="form-row">
            <div className="field">
              <label htmlFor="nome">{f.name}</label>
              <input id="nome" name="nome" type="text" autoComplete="name" required maxLength={120} />
            </div>
            <div className="field">
              <label htmlFor="email">{f.email}</label>
              <input id="email" name="email" type="email" autoComplete="off" required maxLength={200} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="problema">{f.problem}</label>
            <textarea id="problema" name="problema" rows={4} required maxLength={4000} />
          </div>
          <div className="field">
            <label htmlFor="ruolo">{f.role}</label>
            <textarea id="ruolo" name="ruolo" rows={2} maxLength={2000} />
          </div>
          <div className="field">
            <label htmlFor="pdf">{f.pdf}</label>
            <input id="pdf" name="pdf" type="file" accept="application/pdf" />
          </div>
          <label className="consent">
            <input type="checkbox" name="consenso" value="si" required />
            <span>{f.consentA}<a href={privacyOf[t.lang]}>{f.consentLink}</a>{f.consentB}</span>
          </label>
          <button className="btn btn-primary" type="submit">{f.submit}<span className="tri" aria-hidden="true" /></button>
          <p className="form-note">{f.note}</p>
        </form>
      </div>
    </section>
  );
}

function Fascia({ t }) {
  const b = t.band;
  return (
    <section className="band" aria-labelledby="band-title">
      <picture className="band-photo" aria-hidden="true">
        <source srcSet="/assets/metallo-fascia.webp" type="image/webp" />
        <img src="/assets/metallo-fascia.jpg" alt="" width="2400" height="900" loading="lazy" />
      </picture>
      <div className="wrap band-in">
        <h2 id="band-title">{b.line}</h2>
        <p className="lead">{b.sub}</p>
        <a className="btn btn-primary" href="#proponi">{b.cta}<span className="tri" aria-hidden="true" /></a>
      </div>
    </section>
  );
}

export default function Home({ t }) {
  return (
    <>
      <Hero t={t} />
      <Perche t={t} />
      <BuyerSec t={t} />
      <Fascia t={t} />
      <Modello t={t} />
      <Portfolio t={t} />
      <Team t={t} />
      <Faq t={t} />
      <Proponi t={t} />
    </>
  );
}
