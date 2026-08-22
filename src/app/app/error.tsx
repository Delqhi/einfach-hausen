'use client';

import { AlertCircle, RotateCcw } from 'lucide-react';

export default function HomeownerError({ reset }: { reset: () => void }) {
  return (
    <main className="owner-route-state" role="alert">
      <div className="owner-state-icon"><AlertCircle aria-hidden="true" /></div>
      <span className="owner-state-kicker">Das hat nicht geklappt</span>
      <h1>Diese Ansicht konnte nicht geladen werden.</h1>
      <p>Deine Daten wurden dadurch nicht verändert. Versuch die Ansicht noch einmal zu laden.</p>
      <button className="owner-state-action" type="button" onClick={reset}>
        <RotateCcw aria-hidden="true" /> Erneut versuchen
      </button>
    </main>
  );
}
