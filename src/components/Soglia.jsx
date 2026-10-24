// Al posto di «[X]» (la soglia di ARR ancora da decidere) mostra il logo: cerchio con il tondo.
export function X(testo) {
  if (typeof testo !== 'string' || !testo.includes('[X]')) return testo;
  const parti = testo.split('[X]');
  return parti.flatMap((p, i) => (i === 0 ? [p] : [<span key={i} className="soglia" role="img" aria-label="X" title="Soglia da definire" />, p]));
}
