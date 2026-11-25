import {StrictMode, Suspense} from 'react';
import {createRoot,hydrateRoot} from 'react-dom/client';
import {prepareClientContent} from './lib/clientContent';
import {startDeferredAnalytics} from './lib/deferredAnalytics';
import {importWithRecovery} from './lib/importWithRecovery';
import {HydrationReady} from './HydrationReady';
import {waitForPageStyles} from './lib/pageStyles';
import './index.css';
import './theme.css';
import './components/home-hero-integration.css';

startDeferredAnalytics();
Promise.all([prepareClientContent(),waitForPageStyles()]).then(() => importWithRecovery(() => import('./App.tsx'))).then(async ({default:App,prepareInitialRender}) => {
  await Promise.all([prepareInitialRender(),window.__hopscupPrerenderReady]);
  const root=document.getElementById('root')!;
  const tree=<StrictMode><Suspense fallback={null}><App /></Suspense><HydrationReady /></StrictMode>;
  if(root.hasAttribute('data-prerendered')) hydrateRoot(root,tree);
  else createRoot(root).render(tree);
});
