import { hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

const path = window.location.pathname.endsWith('/404.html') ? '/404' : window.location.pathname;
hydrateRoot(document.getElementById('root'), <App path={path} />);
