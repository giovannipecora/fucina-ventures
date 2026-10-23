import { findRoute } from './routes.js';
import { testi } from './i18n/index.js';
import { Header, Footer } from './components/Layout.jsx';
import Home from './components/Home.jsx';
import { Privacy, Semplice } from './components/Pagine.jsx';

export default function App({ path }) {
  const route = findRoute(path);
  const t = testi[route.lang];
  return (
    <>
      <Header t={t} route={route} />
      <main id="main">
        {route.page === 'home' && <Home t={t} />}
        {route.page === 'privacy' && <Privacy t={t} />}
        {route.page === 'thanks' && <Semplice t={t} k="thanks" />}
        {route.page === 'notFound' && <Semplice t={t} k="notFound" />}
      </main>
      <Footer t={t} />
    </>
  );
}
