import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { HomeownerNetworkStatus } from '@/components/homeowner/network-status';
import styles from './homeowner.module.css';

/** SEO P0: eingeloggter Owner-Bereich — nicht indexieren. */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function HomeownerLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.ownerScope}>
      <a className={styles.skipLink} href="#owner-main-content">Zum Inhalt springen</a>
      <HomeownerNetworkStatus />
      <div id="owner-main-content" className={styles.mainAnchor} tabIndex={-1}>{children}</div>
    </div>
  );
}
