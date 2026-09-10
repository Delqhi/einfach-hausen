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
        <p>Bei Lebensgefahr, Brand oder Gasgeruch rufe zuerst die 112 an. Wir suchen nach verfügbaren Helfern in deiner Nähe, versprechen aber keine Betreuung rund um die Uhr.</p>
      </EHPanel>

      <EHPanel
        title="Beratung"
        footer={{ href: '/app/consultation', text: 'Zur Beratung' }}
      >
        <p>Du hast eine Frage rund ums Haus und willst erst einen Fachmann fragen? Schidere dein Problem und finde einen passenden Ansprechpartner.</p>
        <p>Daraus entsteht noch kein Auftrag und kein Preis. Erst wenn du willst, wird daraus eine Anfrage.</p>
      </EHPanel>

      <EHPanel
        title="Versicherung"
        footer={{ href: '/app/insurance', text: 'Zur Versicherung' }}
      >
        <p>Bei einem Schadenfall bereitest du hier alles sauber vor: Fotos, Belege und den Ablauf zum bereits beauftragten Vorgang.</p>
        <p>Wichtig: Wir kontaktieren deine Versicherung nicht automatisch. Du entscheidest, was du weitergibst.</p>
      </EHPanel>

      <EHPanel
        title="Hausverkauf"
        footer={{ href: '/app/home/sale', text: 'Zum Hausverkauf' }}
      >
        <p>Du denkst ans Verkaufen? Hier siehst du die Schritte: Verkaufsinteresse, passende Makler, Besichtigung und Abschluss.</p>
        <p>Deine Kontaktdaten gibst du nur frei, wenn du es ausdrücklich erlaubst.</p>
      </EHPanel>

      <EHPanel
        title="Mein Jahr"
        footer={{ href: '/app/year', text: 'Zu Mein Jahr' }}
      >
        <p>Hier siehst du das ganze Jahr im Überblick: anstehende Wartungen, Termine und erledigte Arbeiten.</p>
        <p>Überfällige Aufgaben stehen oben, damit du nichts vergisst.</p>
      </EHPanel>

      <EHPanel
        title="KI-Assistent"
        footer={{ href: '/app/hausmeister', text: 'Zum KI-Assistenten' }}
      >
        <p>Der Assistent hilft dir beim Organisieren: Fragen klären, Aufgaben planen und den nächsten Schritt vorschlagen.</p>
        <p>Er gibt keine Garantien. Das kostenlose Kontingent ist begrenzt – wer mehr braucht, kann einen eigenen API-Schlüssel hinterlegen oder per Werbeanzeige weitere Aktionen freischalten.</p>
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
