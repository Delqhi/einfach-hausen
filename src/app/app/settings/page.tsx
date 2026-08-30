import Link from 'next/link';
import { Bell, BellOff, ChevronLeft, RefreshCw, ShieldCheck } from 'lucide-react';
import { AppShell } from '@/components/shell';
import { InstallAppCard } from '@/components/install-app-card';
import { requireUser } from '@/lib/auth';
import { PwaSettingsStatus } from './pwa-settings-status';
import { AccountActions } from './account-actions';
import styles from './settings.module.css';

export default async function AppSettingsPage() {
  await requireUser('homeowner');

  return (
    <AppShell role="homeowner" active="/app/profile" title="App-Einstellungen" subtitle="Installation, Offline-Modus und Benachrichtigungen">
      <div className={styles.header}>
        <Link className={styles.backLink} href="/app/profile"><ChevronLeft aria-hidden="true" />Profil</Link>
        <div>
          <h1 className="page-title">App-Einstellungen</h1>
          <p className="page-subtitle">Hier siehst du, was dein Browser wirklich unterstützt und welche Funktionen noch nicht aktiv sind.</p>
        </div>
      </div>

      <section className={styles.section} aria-labelledby="installation-heading">
        <div className={styles.sectionHeading}>
          <RefreshCw aria-hidden="true" />
          <div><h2 id="installation-heading">Installation & Offline</h2><p>Die App speichert keine privaten Seiten als Offline-Kopie.</p></div>
        </div>
        <InstallAppCard />
        <PwaSettingsStatus />
      </section>

      <section className={styles.section} aria-labelledby="notifications-heading">
        <div className={styles.sectionHeading}>
          <Bell aria-hidden="true" />
          <div><h2 id="notifications-heading">Benachrichtigungen</h2><p>In-App-Updates sind aktiv; Browser-Push ist noch nicht freigeschaltet.</p></div>
        </div>

        <Link className={styles.notificationLink} href="/notifications">
          <span><strong>In-App-Benachrichtigungen öffnen</strong><small>Auftragsstatus, Nachrichten und wichtige Plattform-Updates.</small></span>
          <span aria-hidden="true">→</span>
        </Link>

        <div className={styles.disabledSetting} role="group" aria-labelledby="push-setting-title" aria-describedby="push-setting-help">
          <BellOff aria-hidden="true" />
          <span>
            <strong id="push-setting-title">Browser-Push</strong>
            <small id="push-setting-help">Noch nicht verfügbar. Wir fragen deshalb keine Benachrichtigungsberechtigung an und zeigen keinen wirkungslosen Einschalter.</small>
          </span>
          <input type="checkbox" disabled aria-label="Browser-Push noch nicht verfügbar" />
        </div>

        <div className={styles.disabledSetting} role="group" aria-labelledby="checklist-setting-title" aria-describedby="checklist-setting-help">
          <ShieldCheck aria-hidden="true" />
          <span>
            <strong id="checklist-setting-title">Checklisten-Erinnerungen per Push</strong>
            <small id="checklist-setting-help">Noch nicht verfügbar. Erinnerungen erscheinen erst als Push-Option, wenn eine echte Zustellung eingerichtet ist.</small>
          </span>
          <input type="checkbox" disabled aria-label="Checklisten-Erinnerungen per Push noch nicht verfügbar" />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="account-heading">
        <div className={styles.sectionHeading}>
          <ShieldCheck aria-hidden="true" />
          <div><h2 id="account-heading">Konto & Daten</h2><p>Datenexport und Konto-Löschung nach DSGVO.</p></div>
        </div>
        <AccountActions />
      </section>
    </AppShell>
  );
}
