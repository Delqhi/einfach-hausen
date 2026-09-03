import styles from '@/components/marketing/marketing.module.css';

export default function Loading() {
  return (
    <main className={styles.publicStatePage} aria-busy="true" aria-live="polite">
      <div className={styles.publicStateCard}>
        <div className={styles.publicStateMark} aria-hidden="true" />
        <span className={styles.publicStateEyebrow}>Einfach Hausen</span>
        <h1>Seite wird geladen</h1>
        <p>Wir bereiten die Inhalte gerade für dich vor.</p>
        <div className={styles.publicStateSkeleton} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </main>
  );
}
