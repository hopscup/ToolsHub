import {useEffect} from 'react';
export function HydrationReady() {
  useEffect(() => {document.documentElement.dataset.hydrated='true';}, []);
  return null;
}
