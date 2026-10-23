// Disegni del sito: logo, ruoli del team, buyer, modulo di esempio.
// Linee sottili grigie e un solo dettaglio nel colore principale (var(--accent)).

export function Logo({ size = 30, dark = false }) {
  const line = dark ? 'var(--bg)' : 'var(--ink)';
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" aria-hidden="true">
      <rect x="1" y="1" width="28" height="28" fill="none" stroke={line} strokeWidth="2" />
      <path d="M8 21 L15 9 L22 21 Z" fill={dark ? 'var(--bg)' : 'var(--accent)'} />
    </svg>
  );
}

const S = { fill: 'none', strokeWidth: 2 };

const ruoli = {
  fiscale: (
    <>
      <rect x="40" y="45" width="120" height="160" stroke="#3A3F47" />
      <path d="M58 75h84M58 95h84M58 115h56" stroke="#6B7178" />
      <path d="M66 185v-24M90 185v-36M114 185v-30" stroke="#9AA0A6" strokeWidth="12" />
      <path d="M138 185v-54" stroke="var(--accent)" strokeWidth="12" />
    </>
  ),
  legale: (
    <>
      <path d="M50 40h76l24 24v146H50z" stroke="#3A3F47" />
      <path d="M126 40v24h24" stroke="#3A3F47" />
      <path d="M68 85h64M68 105h64M68 125h40" stroke="#6B7178" />
      <circle cx="122" cy="172" r="20" stroke="var(--accent)" />
      <path d="M113 172l6 6 12-13" stroke="var(--accent)" />
      <path d="M68 172h28" stroke="#9AA0A6" />
    </>
  ),
  sviluppo: (
    <>
      <rect x="30" y="60" width="140" height="120" stroke="#3A3F47" />
      <path d="M30 80h140" stroke="#3A3F47" />
      <path d="M70 110l-18 18 18 18M130 110l18 18-18 18" stroke="#9AA0A6" strokeWidth="3" />
      <path d="M108 104l-16 48" stroke="#6B7178" strokeWidth="3" />
      <path d="M100 200h28" stroke="var(--accent)" strokeWidth="4" />
    </>
  ),
  sicurezza: (
    <>
      <path d="M100 40l60 22v50c0 46-28 78-60 92-32-14-60-46-60-92V62z" stroke="#3A3F47" />
      <path d="M100 62l38 14v34c0 30-17 52-38 62-21-10-38-32-38-62V76z" stroke="#6B7178" />
      <circle cx="100" cy="112" r="10" stroke="var(--accent)" strokeWidth="3" />
      <path d="M100 122v22" stroke="var(--accent)" strokeWidth="3" />
    </>
  ),
  sales: (
    <>
      <circle cx="100" cy="125" r="64" stroke="#3A3F47" />
      <circle cx="100" cy="125" r="42" stroke="#6B7178" />
      <circle cx="100" cy="125" r="18" stroke="#9AA0A6" />
      <circle cx="100" cy="125" r="6" fill="var(--accent)" stroke="none" />
      <path d="M168 57l-62 62M168 57h-18M168 57v18" stroke="var(--accent)" strokeWidth="3" />
    </>
  ),
  gtm: (
    <>
      <path d="M36 50h128l-48 62v50l-32 16v-66z" stroke="#3A3F47" />
      <circle cx="70" cy="36" r="4" fill="#6B7178" stroke="none" />
      <circle cx="100" cy="30" r="4" fill="#6B7178" stroke="none" />
      <circle cx="130" cy="36" r="4" fill="#6B7178" stroke="none" />
      <path d="M100 190v24M100 214l-10-10M100 214l10-10" stroke="#9AA0A6" strokeWidth="3" />
      <circle cx="100" cy="232" r="7" fill="var(--accent)" stroke="none" />
    </>
  ),
};

export function Ruolo({ nome }) {
  return (
    <svg viewBox="0 0 200 250" className="ruolo-svg" {...S} aria-hidden="true">
      {ruoli[nome]}
    </svg>
  );
}

export function Buyer({ label }) {
  const mono = { fontFamily: 'JetBrains Mono, monospace', fontSize: 13, stroke: 'none' };
  return (
    <svg viewBox="0 0 420 380" className="buyer-svg" {...S} role="img" aria-label={label}>
      <path d="M80 340H340" stroke="#3A3F47" />
      <circle cx="210" cy="178" r="42" stroke="#9AA0A6" />
      <path d="M134 340c0-62 36-92 76-92s76 30 76 92" stroke="#9AA0A6" />
      <path d="M150 112l34 36M270 112l-34 36M290 214l-36-10" stroke="#3A3F47" strokeDasharray="4 6" />
      {/* 01 · il problema */}
      <rect x="30" y="34" width="130" height="78" stroke="#3A3F47" />
      <path d="M52 84c10-22 22 18 34-6s20 16 30-4 14 12 22 0" stroke="#6B7178" />
      <text x="44" y="56" fill="#9AA0A6" style={mono}>01</text>
      {/* 02 · cerca una soluzione */}
      <rect x="260" y="34" width="130" height="78" stroke="#3A3F47" />
      <circle cx="318" cy="76" r="16" stroke="#9AA0A6" />
      <path d="M330 88l16 16" stroke="#9AA0A6" strokeWidth="3" />
      <text x="274" y="56" fill="#9AA0A6" style={mono}>02</text>
      {/* 03 · prova e paga online */}
      <rect x="290" y="170" width="124" height="96" stroke="var(--accent)" />
      <text x="302" y="190" fill="var(--accent)" style={mono}>03</text>
      <rect x="306" y="200" width="80" height="50" rx="6" stroke="#EEEAE2" />
      <path d="M306 212h80" stroke="#6B7178" strokeWidth="6" />
      <rect x="314" y="222" width="13" height="10" rx="2" stroke="#9AA0A6" />
      <path d="M314 241h10M330 241h10M346 241h10M362 241h10" stroke="#9AA0A6" />
      <circle cx="392" cy="250" r="12" fill="var(--accent)" stroke="none" />
      <path d="M386 250l4 4 8-9" stroke="#0B0D10" strokeWidth="2.5" />
    </svg>
  );
}

export function ModuloEsempio({ t }) {
  const righe = [
    ['Il/la sottoscritto/a', 'Maria Rossi', false],
    ['Codice fiscale', 'RSSMRA80A41H501X', true],
    ['Residente in', 'Via Esempio 12, Bologna', false],
  ];
  return (
    <div className="modulo" role="img" aria-label={t.formImg}>
      <div className="mono modulo-titolo">{t.formTitle}</div>
      <div className="modulo-linea" />
      {righe.map(([l, v, m]) => (
        <div key={l}>
          <div className="modulo-label">{l}</div>
          <div className={'modulo-campo' + (m ? ' mono' : '')}>{v}</div>
        </div>
      ))}
      <div className="modulo-label">Firma</div>
      <div className="modulo-firma" />
      <div className="mono modulo-fatto">✓ {t.formDone}</div>
    </div>
  );
}
