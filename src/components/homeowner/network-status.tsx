'use client';

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export function HomeownerNetworkStatus() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener('online', sync);
    window.addEventListener('offline', sync);
    return () => {
      window.removeEventListener('online', sync);
      window.removeEventListener('offline', sync);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="owner-offline-banner" role="status" aria-live="polite">
      <WifiOff aria-hidden="true" />
      <span><strong>Du bist offline.</strong> Bereits geladene Inhalte bleiben sichtbar. Senden und Buchen klappt wieder mit Verbindung.</span>
    </div>
  );
}
