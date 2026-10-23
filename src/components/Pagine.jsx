import { homeOf } from '../routes.js';

export function Privacy({ t }) {
  const p = t.privacyPage;
  return (
    <section className="page">
      <div className="wrap">
        <h1>{p.title}</h1>
        <p className="draft">{p.draft}</p>
        <div className="legal">
          {p.sections.map(([h, txt]) => (
            <div key={h}>
              <h2>{h}</h2>
              <p>{txt}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Semplice({ t, k }) {
  const p = t[k];
  return (
    <section className="page">
      <div className="wrap">
        <h1>{p.title}</h1>
        <p className="lead">{p.text}</p>
        <a className="btn btn-primary" href={homeOf[t.lang]}>{p.back}</a>
      </div>
    </section>
  );
}
