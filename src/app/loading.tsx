import { PublicState, stateStyles as styles } from '@/components/marketing/public-state';

export default function Loading() {
  return (
    <PublicState busy title="Seite wird geladen" text="Wir bereiten die Inhalte gerade für dich vor.">
      <div className={styles.stateSkeleton} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </PublicState>
  );
}
