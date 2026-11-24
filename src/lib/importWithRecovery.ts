import {isChunkLoadError} from './chunkRecoveryPolicy.js';

declare global {
  interface Window { __hopscupRecoverChunk?: (error:unknown)=>boolean; }
}

export async function importWithRecovery<T>(load:()=>Promise<T>):Promise<T> {
  try { return await load(); }
  catch (error) {
    if (typeof window !== 'undefined' && isChunkLoadError(error) && window.__hopscupRecoverChunk?.(error)) {
      // Preserve the prerender or the modal skeleton while the recovery UI takes over.
      return new Promise<T>(() => {});
    }
    throw error;
  }
}
