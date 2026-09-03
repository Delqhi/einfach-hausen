'use client';

import { useEffect, useRef, useState } from 'react';
import { WifiOff } from 'lucide-react';

export function HomeownerNetworkStatus() {
  const [offline, setOffline] = useState(false);
  const [restored, setRestored] = useState(false);
  const [blockedAction, setBlockedAction] = useState(false);
  const wasOffline = useRef(false);

  useEffect(() => {
    let restoreTimer: ReturnType<typeof setTimeout> | undefined;
    const sync = () => {
      const nextOffline = !navigator.onLine;
      setOffline(nextOffline);

      if (nextOffline) {
        wasOffline.current = true;
        setRestored(false);
        if (restoreTimer) clearTimeout(restoreTimer);
        return;
      }

      setBlockedAction(false);
      if (wasOffline.current) {
        wasOffline.current = false;
        setRestored(true);
        restoreTimer = setTimeout(() => setRestored(false), 4000);
      }
    };

    const blockOfflineMutation = (event: SubmitEvent) => {
      if (navigator.onLine || !(event.target instanceof HTMLFormElement)) return;
      if (!event.target.closest('#owner-main-content')) return;
      event.preventDefault();
      event.stopPropagation();
      setBlockedAction(true);
    };

    sync();
    window.addEventListener('online', sync);
    window.addEventListener('offline', sync);
    document.addEventListener('submit', blockOfflineMutation, true);
    return () => {
      if (restoreTimer) clearTimeout(restoreTimer);
      window.removeEventListener('online', sync);
      window.removeEventListener('offline', sync);
      document.removeEventListener('submit', blockOfflineMutation, true);
    };
  }, []);

  return (
    <>
      {offline ? (
        <div className="owner-offline-banner" role="status" aria-live="polite" aria-atomic="true">
          <WifiOff aria-hidden="true" />
          <span>
            <strong>Du bist offline.</strong> Bereits geladene Inhalte bleiben sichtbar. Senden, Buchen und Speichern klappt wieder mit Verbindung.
            {blockedAction ? ' Die letzte Aktion wurde nicht gesendet.' : ''}
          </span>
        </div>
      ) : null}
      {restored ? <span className="owner-visually-hidden" role="status" aria-live="polite">Verbindung wiederhergestellt. Du kannst wieder senden, buchen und speichern.</span> : null}
    </>
  );
}
