import { AppShell } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { EHAppHeader, EHPanel } from '@/design-system';

export default async function HilfePage() {
  await requireUser('homeowner');

  return (
    <AppShell role="homeowner" active="/app/more" title="Hilfe" subtitle="Dein Haus. Einfach geregelt.">
      <EHAppHeader
        eyebrow="Hilfe"
        title="Dein Haus. Einfach geregelt."
        text="Hier findest du eine kurze Anleitung zu allen Bereichen deiner App. Alles in einfachem Deutsch erklärt – tippe auf einen Link, um direkt zum Bereich zu springen."
      />

      <EHPanel
        title="Mein Haus (Hausakte)"
        footer={{ href: '/app/home', text: 'Zu Mein Haus' }}
      >
        <p>Hier liegt alles zu deinem Zuhause an einem Ort: Adresse, Ausstattung und wichtige Daten.</p>
        <p>Unter Historie siehst du, was bisher gemacht wurde. Im Hauspass stehen die wichtigsten Kennwerte deines Hauses.</p>
      </EHPanel>

      <EHPanel
        title="Aufträge"
        footer={{ href: '/app/jobs', text: 'Zu den Aufträgen' }}
      >
        <p>Du brauchst einen Handwerker? Lege einen Auftrag an und beschreibe kurz, was zu tun ist.</p>
        <p>Du siehst jederzeit, wie es weitergeht – von der Anfrage bis zur Fertigstellung. Wenn alles erledigt ist, schließt du den Auftrag ab.</p>
      </EHPanel>

      <EHPanel
        title="Termine & Kalender"
        footer={{ href: '/app/calendar', text: 'Zum Kalender' }}
      >
        <p>Im Kalender stehen alle deine Termine: Besuche von Partnern, Wartungen und Erinnerungen.</p>
        <p>Du verpasst nichts, weil alles übersichtlich an einem Ort gesammelt ist.</p>
      </EHPanel>

      <EHPanel
        title="Dokumente & Rechnungen"
        footer={{ href: '/app/documents', text: 'Zu den Dokumenten' }}
      >
        <p>Hier sammelst du Rechnungen, Nachweise und Belege – zum Beispiel für Handwerkerleistungen oder die Steuer.</p>
        <p>Lade ein Foto oder eine Datei hoch, damit du alles griffbereit hast, wenn du es brauchst.</p>
      </EHPanel>

      <EHPanel
        title="Hausmeisterservice"
        footer={{ href: '/app/hausmeister', text: 'Zum Hausmeisterservice' }}
      >
        <p>Kleine Aufgaben rund ums Haus? Stelle hier deine Anfrage an den Hausmeisterservice.</p>
        <p>Du klärst deine Frage und organisierst den nächsten Schritt – ohne lange Telefonate.</p>
      </EHPanel>

      <EHPanel
        title="Nachrichten"
        footer={{ href: '/app/messages', text: 'Zu den Nachrichten' }}
      >
        <p>Hier schreibst du mit Partnern und dem Einfach-Hausen-Team.</p>
        <p>Alle Absprachen zu deinen Aufträgen bleiben nachvollziehbar an einem Ort.</p>
      </EHPanel>

      <EHPanel
        title="Partner"
        footer={{ href: '/app/partners', text: 'Zu den Partnern' }}
      >
        <p>Hier findest du geprüfte Partner aus deiner Region.</p>
        <p>Du siehst, wer für welche Aufgabe zuständig ist, und kannst direkt Kontakt aufnehmen.</p>
      </EHPanel>

      <EHPanel
        title="Notfall"
        footer={{ href: '/app/emergency', text: 'Zum Notfallbereich' }}
      >
        <p>Wenn es eilig ist – zum Beispiel ein Rohrbruch oder ein Stromausfall – hilft dir dieser Bereich weiter.</p>
        <p>Du findest dort die wichtigsten Schritte und Kontakte, damit schnell jemand helfen kann.</p>
      </EHPanel>

      <EHPanel
        title="Mitgliedschaft & Pakete"
        footer={{ href: '/app/plans', text: 'Zu Mitgliedschaft & Pakete' }}
      >
        <p>Hier siehst du deine Mitgliedschaft: Free, Plus, Premium oder ein Jahrespaket.</p>
        <p>Du erfährst, welche Leistungen enthalten sind, und kannst dein Paket wechseln oder verlängern.</p>
      </EHPanel>

      <EHPanel
        title="Profil & Einstellungen"
        footer={{ href: '/app/profile', text: 'Zum Profil' }}
      >
        <p>In deinem Profil stehen deine persönlichen Daten und Kontaktwege, zum Beispiel WhatsApp.</p>
        <p>In den Einstellungen passt du an, wie die App dich benachrichtigt und was sie über dich wissen soll.</p>
      </EHPanel>
    </AppShell>
  );
}
