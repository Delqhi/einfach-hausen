'use client';

import Link from 'next/link';
import { RotateCcw } from 'lucide-react';
import styles from '@/components/marketing/marketing.module.css';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className={styles.publicStatePage}>
      <div className={styles.publicStateCard} role="alert">
        <span className={styles.publicStateEyebrow}>Einfach Hausen</span>
        <h1>Das hat gerade nicht geklappt.</h1>
        <p>Deine Eingaben werden nicht automatisch als Auftrag übernommen. Versuch die Seite noch einmal oder geh zurück zur Startseite.</p>
        <div className={styles.publicStateActions}>
          <button type="button" onClick={reset}><RotateCcw size={16} /> Erneut versuchen</button>
          <Link href="/">Zur Startseite</Link>
        </div>
      </div>
    </main>
  );
}
