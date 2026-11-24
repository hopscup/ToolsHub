import {StrictMode, Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import {Analytics} from '@vercel/analytics/react';
import {prepareClientContent} from './lib/clientContent';
import './index.css';
import './theme.css';
import './components/home-hero-integration.css';

prepareClientContent().then(() => import('./App.tsx')).then(({default: App}) => createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}><App /></Suspense>
    <Analytics />
  </StrictMode>,
));
