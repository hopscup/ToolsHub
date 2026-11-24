export const CHUNK_RELOAD_KEY = 'hopscup-chunk-reload-attempted';

export function isChunkLoadError(error) {
  const message = String(error?.message || error || '');
  return /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Failed to load module script|Unable to preload CSS|Loading (?:CSS )?chunk [\w-]+ failed/i.test(message);
}

export function createChunkRecovery({storage,reload,showMessage}) {
  let handled = false;
  return error => {
    if (!isChunkLoadError(error)) return false;
    if (handled) return true;
    handled = true;
    try {
      if (!storage.getItem(CHUNK_RELOAD_KEY)) {
        storage.setItem(CHUNK_RELOAD_KEY, '1');
        reload();
        return true;
      }
    } catch {}
    showMessage();
    return true;
  };
}

export function installChunkRecovery(target) {
  const showMessage = () => {
    const show = () => {
      if (target.document.querySelector('[data-site-update]')) return;
      const layer = target.document.createElement('div');
      layer.dataset.siteUpdate = '';
      layer.className = 'site-update-layer';
      layer.setAttribute('role', 'alertdialog');
      layer.setAttribute('aria-modal', 'true');
      layer.setAttribute('aria-labelledby', 'site-update-title');
      const panel = target.document.createElement('div');
      panel.className = 'site-update-panel';
      const title = target.document.createElement('p');
      title.id = 'site-update-title';
      const english = /^\/en(?:\/|$)/.test(target.location.pathname);
      title.textContent = english ? 'The site was updated. Please refresh the page.' : 'Сайт обновился, обновите страницу';
      const button = target.document.createElement('button');
      button.type = 'button';
      button.textContent = english ? 'Refresh page' : 'Обновить страницу';
      button.addEventListener('click', () => target.location.reload());
      panel.append(title, button); layer.append(panel); target.document.body.append(layer); button.focus();
    };
    if (target.document.body) show();
    else target.document.addEventListener('DOMContentLoaded', show, {once:true});
  };
  let storage;
  try { storage = target.sessionStorage; } catch {}
  const recover = createChunkRecovery({storage,reload:()=>target.location.reload(),showMessage});
  target.__hopscupRecoverChunk = recover;
  target.addEventListener('vite:preloadError', event => recover(event.payload));
  target.addEventListener('unhandledrejection', event => {
    if (recover(event.reason)) event.preventDefault();
  });
  target.addEventListener('error', event => {
    const node = event.target;
    if (node?.tagName === 'SCRIPT' && /\/assets\/[^/]+\.js(?:$|\?)/.test(node.src || '')) {
      recover(new Error('Failed to load module script'));
    }
  }, true);
}
