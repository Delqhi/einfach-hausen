import type { ReactNode } from 'react';
import { HomeownerNetworkStatus } from '@/components/homeowner/network-status';
import styles from './homeowner.module.css';

export default function HomeownerLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.ownerScope}>
      <a className={styles.skipLink} href="#owner-main-content">Zum Inhalt springen</a>
      <HomeownerNetworkStatus />
      <div id="owner-main-content" className={styles.mainAnchor} tabIndex={-1}>{children}</div>
    </div>
  );
}
