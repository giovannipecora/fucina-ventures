// Grafico interattivo e illustrativo dei ricavi annui (ARR), dal giorno 1 a 2 anni.
// Tre zone: ① nessun rischio, ② investimento, ③ spin-off al traguardo.
// Il cursore muove il tempo; la velocità cambia quanto la curva resta piatta.
// Nessun numero reale: solo la forma del percorso.
import { useEffect, useRef, useState } from 'react';
import { X as soglia } from './Soglia.jsx';

const MESI = 24;
const COSTI = 0.15; // costi di base al giorno 1 (quota dell'asse)
const PENDENZA = 0.18; // i costi salgono un po', in modo lineare, con i clienti (aumento in 2 anni)
const TARGET = 0.82; // traguardo ARR
const PIATTEZZA = 4.4; // più alto = curva più piatta all'inizio
const VELOCITA = { lenta: 22, media: 16, veloce: 11 }; // mese dello spin-off

function modello(speed) {
  const mT = VELOCITA[speed];
  const k = PIATTEZZA / mT;
  const den = Math.exp(k * mT) - 1;
  const r = (m) => (TARGET * (Math.exp(k * m) - 1)) / den;
  const mOf = (v) => Math.log((v * den) / TARGET + 1) / k;
  const c = (m) => COSTI + (PENDENZA * m) / MESI;
  let a = 0, b = mT; // dove i ricavi superano i costi
  for (let i = 0; i < 40; i++) { const h = (a + b) / 2; if (r(h) < c(h)) a = h; else b = h; }
  return { mT, r, c, mC: b, mTop: Math.min(MESI, mOf(1)) };
}

function Svg({ W, H, pad, t, fs, id, speed, month }) {
  const { mT, r, c, mC, mTop } = modello(speed);
  const x0 = pad.l, x1 = W - pad.r, y0 = H - pad.b, y1 = pad.t;
  const X = (m) => x0 + (m / MESI) * (x1 - x0);
  const Y = (v) => y0 - Math.min(v, 1.02) * (y0 - y1);
  const upto = Math.min(month, mTop);
  const steps = (a, b, n = 60) => (b <= a ? [a] : Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n));
  const pts = (a, b) => steps(a, b).map((m) => `${X(m).toFixed(1)},${Y(r(m)).toFixed(1)}`);
  const curve = `M${pts(0, upto).join(' L')}`;
  const ghost = `M${pts(0, mTop).join(' L')}`;
  const dEnd = Math.min(upto, mC);
  const cpts = (a, b) => steps(a, b).map((m) => `${X(m).toFixed(1)},${Y(c(m)).toFixed(1)}`);
  const area = (a, b) => `M${pts(a, b).join(' L')} L${cpts(a, b).reverse().join(' L')} Z`;
  const deficit = dEnd > 0 ? area(0, dEnd) : '';
  const sEnd = Math.min(upto, mT);
  const surplus = sEnd > mC ? area(mC, sEnd) : '';
  const costLine = `M${cpts(0, MESI).join(' L')}`;
  const xc = X(mC), xt = X(mT), yc = Y(c(MESI)), yt = Y(TARGET);
  const cur = { x: X(upto), y: Y(r(upto)) };
  const reached = month >= mT;
  const zone = month < mC ? 0 : reached ? 2 : 1;
  const mark = (x, n, on) => (
    <g>
      <circle cx={x} cy={y1 - fs * 1.1} r={fs * 0.85} fill={on ? 'var(--accent)' : 'var(--bg-3)'} stroke={on ? 'var(--accent)' : 'var(--line-2)'} strokeWidth="1.5" />
      <text x={x} y={y1 - fs * 1.1} dy="0.35em" textAnchor="middle" fontSize={fs} fontWeight="800" fill={on ? 'var(--bg)' : 'var(--ink)'}>{n}</text>
    </g>
  );
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={'arr-svg arr-' + id} role="img" aria-label={t.aria}>
      <defs>
        <pattern id={`hatch-${id}`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="10" stroke="var(--line-2)" strokeWidth="3" />
        </pattern>
        <linearGradient id={`fade-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0.95" />
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      <rect x={x0} y={y1} width={xc - x0} height={y0 - y1} fill="var(--bg-2)" />
      <rect x={xt} y={y1} width={x1 - xt} height={y0 - y1} fill="rgba(242,105,42,0.06)" />

      {deficit && <path d={deficit} fill={`url(#hatch-${id})`} />}
      {surplus && <path d={surplus} fill={`url(#fade-${id})`} />}

      {[6, 12, 18].map((m) => (
        <line key={m} x1={X(m)} y1={y0} x2={X(m)} y2={y0 + 6} stroke="var(--line-2)" />
      ))}
      <line x1={x0} y1={y0} x2={x1} y2={y0} stroke="var(--line-2)" strokeWidth="1.5" />
      <line x1={x0} y1={y0} x2={x0} y2={y1} stroke="var(--line-2)" strokeWidth="1.5" />

      <path d={costLine} fill="none" stroke="var(--ink-2)" strokeWidth="1.5" strokeDasharray="6 6" />
      <text x={x1} y={id === 'tall' ? yc + fs * 1.5 : yc - fs * 0.9} textAnchor="end" fontSize={fs * 0.8} fontWeight="600" fill="var(--ink-2)">{id === 'tall' ? t.costs.split(' · ')[0] : t.costs}</text>
      <line x1={x0} y1={yt} x2={x1} y2={yt} stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="2 6" />
      <g transform={`translate(${x0 + 10} ${yt - fs * 1.45})`} aria-hidden="true">
        <rect x="0.75" y="0.75" width={fs - 1.5} height={fs - 1.5} fill="none" stroke="var(--ink)" strokeWidth="1.5" />
        <path d={`M${fs * 0.26} ${fs * 0.72} L${fs * 0.5} ${fs * 0.28} L${fs * 0.74} ${fs * 0.72} Z`} fill="var(--accent)" />
      </g>
      <text x={x0 + 10 + fs * 1.4} y={yt - fs * 0.6} fontSize={fs * 0.8} fontWeight="700" fill="var(--accent)">{t.target.replace(' [X]', '').replace('[X]', '')}</text>

      <line x1={xc} y1={y1} x2={xc} y2={y0} stroke="var(--line-2)" strokeDasharray="3 5" />
      <line x1={xt} y1={y1} x2={xt} y2={y0} stroke="var(--accent)" strokeOpacity="0.6" strokeDasharray="3 5" />

      <path d={ghost} fill="none" stroke="var(--line-2)" strokeWidth="2" strokeDasharray="2 6" />
      <path d={curve} fill="none" stroke="var(--ink)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

      {reached && <circle cx={xt} cy={yt} r={fs * 1.4} fill="var(--accent)" opacity="0.2" />}
      <circle cx={xt} cy={yt} r={fs * 0.5} fill={reached ? 'var(--accent)' : 'var(--bg)'} stroke="var(--accent)" strokeWidth="3" />
      <circle cx={cur.x} cy={cur.y} r={fs * 0.45} fill="var(--ink)" stroke="var(--bg)" strokeWidth="3" />

      {mark((x0 + xc) / 2, '1', zone === 0)}
      {mark((xc + xt) / 2, '2', zone === 1)}
      {mark(xt, '3', zone === 2)}

      {t.ticks.map((lab, i) => (
        <text key={lab} x={X((i * MESI) / (t.ticks.length - 1))} y={y0 + fs * 1.5} textAnchor={i === 0 ? 'start' : i === t.ticks.length - 1 ? 'end' : 'middle'} fontSize={fs * 0.75} fill="var(--ash)">{lab}</text>
      ))}
      <text transform={`translate(${x0 - fs * 0.9} ${y0}) rotate(-90)`} fontSize={fs * 0.75} fill="var(--ash)">{t.yAxis}</text>
    </svg>
  );
}

export default function GraficoArr({ t }) {
  const [month, setMonth] = useState(VELOCITA.media);
  const [speed, setSpeed] = useState('media');
  const [playing, setPlaying] = useState(false);
  const raf = useRef(0);
  const { mT, mC } = modello(speed);

  const zone = month < mC ? 0 : month < mT ? 1 : 2;
  const fmt = (s, n) => s.replace('{n}', String(n));

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const play = () => {
    cancelAnimationFrame(raf.current);
    const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setMonth(mT); return; }
    const start = performance.now();
    const dur = 5200;
    setPlaying(true);
    const step = (now) => {
      const p = Math.min(1, (now - start) / dur);
      setMonth(Math.round(p * mT * 10) / 10);
      if (p < 1) raf.current = requestAnimationFrame(step);
      else setPlaying(false);
    };
    raf.current = requestAnimationFrame(step);
  };

  const shownMonth = Math.round(month);
  return (
    <figure className="arr-figure">
      <div className="arr-controls">
        <div className="arr-speed" role="radiogroup" aria-label={t.speedLabel}>
          <span className="arr-ctl-label">{t.speedLabel}</span>
          {Object.keys(VELOCITA).map((s, i) => (
            <button key={s} type="button" role="radio" aria-checked={speed === s} className={'arr-chip' + (speed === s ? ' on' : '')} onClick={() => { cancelAnimationFrame(raf.current); setPlaying(false); setSpeed(s); setMonth(VELOCITA[s]); }}>
              {t.speeds[i]}
            </button>
          ))}
        </div>
        <button type="button" className="btn btn-ghost btn-small arr-play" onClick={play} disabled={playing}>
          <span className="tri" aria-hidden="true" />{t.play}
        </button>
      </div>

      <div className="arr-chart">
        <div className="arr-status" aria-live="polite">
          <span className="arr-month">{shownMonth === 0 ? t.ticks[0] : fmt(t.monthLabel, shownMonth)}</span>
          <span className={'arr-zone z' + (zone + 1)}><b>{zone + 1}</b>{t.zones[zone][0]}</span>
          <span className="arr-when">{fmt(t.spinoffAt, Math.round(mT))}</span>
        </div>
        <Svg W={1000} H={520} pad={{ l: 56, r: 24, t: 70, b: 52 }} t={t} fs={18} id="wide" speed={speed} month={month} />
        <Svg W={520} H={580} pad={{ l: 44, r: 16, t: 70, b: 50 }} t={t} fs={20} id="tall" speed={speed} month={month} />
        <label className="arr-time">
          <span className="arr-ctl-label">{t.timeLabel}</span>
          <input type="range" min="0" max={MESI} step="1" value={shownMonth} onChange={(e) => { cancelAnimationFrame(raf.current); setPlaying(false); setMonth(Math.min(Number(e.target.value), mT)); }} aria-valuetext={fmt(t.monthLabel, shownMonth)} />
        </label>
      </div>
      <figcaption className="arr-note">{t.note}</figcaption>
      <ol className="arr-zones">
        {t.zones.map(([z, txt], i) => (
          <li key={z} className={i === zone ? 'on' : undefined}>
            <span className="arr-n" aria-hidden="true">{i + 1}</span>
            <div><b>{z}</b><p>{soglia(txt)}</p></div>
          </li>
        ))}
      </ol>
    </figure>
  );
}
