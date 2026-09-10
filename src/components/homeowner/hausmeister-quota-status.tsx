'use client';
import { useEffect, useState } from 'react';
import { EHText } from '@/design-system';

// CEO-Audit R6c: sichtbare 401/402/429-Hinweise auf /app/hausmeister.
// Fragt den ehrlichen Quota-Stand (/api/ki GET) ab und zeigt bei
// 401/402/429 explizite, ehrliche Texte. Kein Entwurf wird gelöscht;
// die Komponente liest nur und sendet nie.
export function HausmeisterQuotaStatus() {
  const [state, setState] = useState<{ kind: 'loading' | 'ok' | 'unauth' | 'limited' | 'error'; text: string }>({ kind: 'loading', text: 'KI-Status wird geladen …' });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/ki', { credentials: 'same-origin' });
        if (res.status === 401) {
          if (!cancelled) setState({ kind: 'unauth', text: 'Bitte melde dich an, um den Hausmeister zu nutzen (401).' });
          return;
        }
        if (res.status === 402) {
          if (!cancelled) setState({ kind: 'limited', text: 'KI-Kontingent aufgebraucht (402). Lege einen eigenen API-Key an oder warte auf den nächsten Monat. Dein Entwurf bleibt erhalten.' });
          return;
        }
        if (res.status === 429) {
          if (!cancelled) setState({ kind: 'limited', text: 'Zu viele Anfragen (429). Bitte warte kurz und versuche es erneut. Dein Entwurf bleibt erhalten.' });
          return;
        }
        if (!res.ok) {
          if (!cancelled) setState({ kind: 'error', text: 'KI-Status gerade nicht verfügbar. Dein Entwurf bleibt erhalten.' });
          return;
        }
        const q = await res.json().catch(() => null);
        if (!cancelled) {
          if (q && typeof q.freemiumRemaining === 'number') {
            setState({ kind: 'ok', text: `Live-Status: ${q.freemiumRemaining} von ${q.freemiumAllowed} frei · ${q.credits} Bonus-Aktionen.` });
          } else {
            setState({ kind: 'ok', text: 'Live-Status verfügbar.' });
          }
        }
      } catch {
        if (!cancelled) setState({ kind: 'error', text: 'KI-Status gerade nicht verfügbar. Dein Entwurf bleibt erhalten.' });
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div data-testid="hausmeister-live-status" role="status" aria-live="polite">
      <EHText>{state.text}</EHText>
    </div>
  );
}
