import type { ReactNode } from 'react';
import { ProviderNetworkStatus } from '@/components/provider/network-status';
import styles from './provider-workspace.module.css';

export default function ProLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.providerScope}>
      <a className={styles.skipLink} href="#provider-content">
        Zum Inhalt springen
      </a>
      <ProviderNetworkStatus />
      <div id="provider-content" tabIndex={-1}>
        {children}
      </div>
    </div>
  );
}
