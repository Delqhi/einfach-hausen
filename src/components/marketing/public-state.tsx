import type { ReactNode } from 'react';
import { Home } from 'lucide-react';
import './tokens.css';
import styles from './mkt.module.css';

/**
 * Minimal full-page state screen for the root `loading.tsx` / `error.tsx`
 * boundaries. Uses the public `.mkt` tokens so the state matches the website
 * even before a page shell exists. Has no client dependency itself.
 */
export function PublicState({ title, text, children, role, busy, icon }: {
  title: string;
  text: string;
  children?: ReactNode;
  role?: 'alert' | 'status';
  busy?: boolean;
  icon?: ReactNode;
}) {
  return (
    <main className={`mkt ${styles.statePage}`} aria-busy={busy || undefined} aria-live={busy ? 'polite' : undefined}>
      <div className={styles.stateCard} role={role}>
        <span className={styles.stateMark} aria-hidden="true">{icon ?? <Home size={22} />}</span>
        <span className={styles.eyebrow}>Einfach Hausen</span>
        <h1>{title}</h1>
        <p>{text}</p>
        {children}
      </div>
    </main>
  );
}

export { styles as stateStyles };
