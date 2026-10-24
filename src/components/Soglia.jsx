// Al posto di «[X]» (la soglia di ARR ancora da decidere) mostra il logo: il tondo dentro il triangolo.
export function X(testo) {
  if (typeof testo !== 'string' || !testo.includes('[X]')) return testo;
  const parti = testo.split('[X]');
  const segno = (k) => (
    <svg key={k} className="soglia" viewBox="0 0 30 30" role="img" aria-label="X">
      <title>Soglia da definire</title>
      <path d="M15 2.2 L28 26.5 L2 26.5 Z" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="15" cy="18.6" r="4.6" />
    </svg>
  );
  return parti.flatMap((p, i) => (i === 0 ? [p] : [segno(i), p]));
}
