'use client';

import Link from 'next/link';
import { CircleAlert, RotateCcw } from 'lucide-react';
import { PublicState, stateStyles as styles } from '@/components/marketing/public-state';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <PublicState
      role="alert"
      icon={<CircleAlert size={22} />}
      title="Das hat gerade nicht geklappt."
      text="Deine Eingaben werden nicht automatisch als Auftrag übernommen. Versuch die Seite noch einmal oder geh zurück zur Startseite."
    >
      <div className={styles.stateActions}>
        <button type="button" className={styles.btnPrimary} onClick={reset}><RotateCcw size={16} aria-hidden="true" /> Erneut versuchen</button>
        <Link className={styles.btnGhost} href="/">Zur Startseite</Link>
      </div>
    </PublicState>
  );
}
