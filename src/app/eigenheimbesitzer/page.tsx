import type { Metadata } from 'next';
import Image from 'next/image';
import { Bell, FileText, Home, MessageCircle, UserRound, Wallet } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/site-shell';
import { AppFrame, HomeScreen, MiniContact, MiniHausakte, MiniReminder } from '@/components/marketing/app-frames';
import { Reveal } from '@/components/marketing/motion';
import { BulletList, CtaBand, Facts, FeatureGrid, InfoPanel, LinkButton, PageHero, Section, Split, Statement, TextLink, mkt as styles } from '@/components/marketing/ui';
import { FACTS } from '@/components/marketing/content';

export const metadata: Metadata = { title: 'Für Eigenheimbesitzer', description: 'Weniger im Kopf, mehr im Griff: ein Ort für Anliegen, Ansprechpartner, Erinnerungen und die Geschichte deines Hauses.' };

const MIRROR = [
  { tag: 'Sonntagabend', quote: 'Ich müsste mich mal um die Heizung kümmern. Nächste Woche. Bestimmt.' },
  { tag: 'Beim Verkauf', quote: 'Der Makler fragt nach Rechnungen und Garantien. Ich habe zwei von zwölf gefunden.' },
  { tag: 'Nach dem Umzug', quote: 'Welcher Betrieb hat damals das Dach gemacht? Keine Ahnung. Die Vorbesitzer auch nicht.' },
] as const;

export default function Page() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Für Eigenheimbesitzer"
        title="Dein Haus hat viele Themen. Du brauchst trotzdem nur eine Eingangstür."
        text="Ein Haus zu besitzen heißt, ständig Dinge im Kopf zu haben: Wartungen, Betriebe, Termine, Rechnungen. Einfach Hausen nimmt dir diese Last ab und bewahrt das Wissen, das sonst verloren geht."
        actions={<><LinkButton href="/#anliegen">Anliegen starten</LinkButton><LinkButton href="/register?role=homeowner" secondary>Hauskonto kostenlos anlegen</LinkButton></>}
        aside={<AppFrame label="Startbildschirm der App mit fälligen Aufgaben, laufendem Auftrag und Hausakte"><HomeScreen /></AppFrame>}
      />

      <Section eyebrow="Kennst du das?" title="Nicht die Reparatur ist das Problem. Das Drumherum ist es." text="Die meisten Dinge am Haus sind lösbar. Anstrengend ist, dass alles an dir hängt: erinnern, suchen, anrufen, dranbleiben, aufheben.">
        <div className={styles.cardGrid} data-cols="3">
          {MIRROR.map((m, i) => (
            <Reveal key={m.tag} delay={i * 0.07} className={styles.mirrorCard}>
              <span className={styles.mirrorTag}>{m.tag}</span>
              <p className={styles.mirrorQuote}>{m.quote}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Statement kicker="Der Kern">Dein Haus bekommt ein Gedächtnis. <mark>Du behältst die Kontrolle.</mark></Statement>

      <Section tone="surface" eyebrow="Was sich ändert" title="Vier Dinge, die du nicht mehr selbst machen musst.">
        <div className={styles.benefitList}>
          <Reveal className={styles.benefit}>
            <div className={styles.benefitCopy}><h3>Wissen, wen man anruft</h3><p>Du musst weder Gewerk noch Fachbegriff kennen. Beschreib, was du siehst. Wir ordnen ein und finden den passenden geprüften Betrieb aus deiner Region.</p><TextLink href="/so-funktionierts">So läuft ein Vorgang ab</TextLink></div>
            <div className={styles.benefitVisual}><MiniContact /></div>
          </Reveal>
          <Reveal className={styles.benefit} data-flip="true">
            <div className={styles.benefitCopy}><h3>Rechtzeitig dran denken</h3><p>Heizungswartung, Dachrinnen, Rauchmelder, Garantiefristen. Wir erinnern dich, bevor es teuer wird, und du kannst mit einem Tipp organisieren lassen.</p></div>
            <div className={styles.benefitVisual}><MiniReminder /></div>
          </Reveal>
          <Reveal className={styles.benefit}>
            <div className={styles.benefitCopy}><h3>Nichts mehr suchen</h3><p>Rechnungen, Garantien, Protokolle, Fotos: alles liegt am richtigen Vorgang und am richtigen Bauteil. Nach einem Auftrag automatisch, ohne dass du abheftest.</p><TextLink href="/hausakte">Zur digitalen Hausakte</TextLink></div>
            <div className={styles.benefitVisual}><MiniHausakte /></div>
          </Reveal>
        </div>
      </Section>

      <Section tone="soft" eyebrow="Ein Thema, drei Entscheidungen" title="Erst verstehen. Dann bewusst entscheiden." text="Einfach Hausen macht aus einer Frage nicht sofort einen Auftrag.">
        <Split>
          <InfoPanel label="Wenn du nur Rat brauchst">
            <h3 style={{ fontSize: 22, color: 'var(--eh-teal-900)' }}>Frage klären oder Ansprechpartner finden.</h3>
            <p>Du bekommst eine fachliche Einordnung und kannst auf Wunsch einen passenden Menschen sprechen. Ein Auftrag entsteht dadurch nicht.</p>
            <BulletList items={['Kein Auftrag durch eine normale Frage', 'Persönlicher Kontakt auch ohne Buchung', 'Beauftragen bleibt eine eigene Entscheidung']} />
          </InfoPanel>
          <InfoPanel label="Wenn etwas erledigt werden soll">
            <h3 style={{ fontSize: 22, color: 'var(--eh-teal-900)' }}>Organisiert statt selbst koordiniert.</h3>
            <p>Wir vervollständigen die Auftragsdaten, suchen passende Partner und führen Kostenrahmen, Termin und Dokumente an einem Ort zusammen.</p>
            <BulletList items={['Passende Partner statt offene Firmenliste', 'Kostenrahmen vor dem Termin', 'Konkreter Ansprechpartner beim Betrieb']} />
          </InfoPanel>
        </Split>
      </Section>

      <Section eyebrow="Langfristig" title="Ein Haus ist die größte Investition deines Lebens. Behandle es so." text="Wer die Geschichte seines Hauses kennt, entscheidet besser, spart bei Wartung und Verkauf und übergibt irgendwann sauber.">
        <div className={styles.split} style={{ alignItems: 'center' }}>
          <FeatureGrid cols={2} items={[
            { icon: <Home size={20} />, title: 'Technik & Ausstattung', text: 'Heizung, PV, Wallbox, Dach, Fenster: strukturiert am Haus geführt, mit Garantien und Ansprechpartnern.' },
            { icon: <FileText size={20} />, title: 'Arbeiten & Wartung', text: 'Erledigte Arbeiten, Kosten, Hinweise und zukünftige Aufgaben in einer Historie.' },
            { icon: <UserRound size={20} />, title: 'Beziehungen', text: 'Bewährte Betriebe und konkrete Menschen bleiben Teil deines Hauswissens.' },
            { icon: <Wallet size={20} />, title: 'Wert beim Verkauf', text: 'Eine lückenlose Hausakte ist beim Verkauf ein Argument, das Käufer und Makler verstehen.' },
          ]} />
          <Reveal delay={0.1} className={styles.photo} style={{ aspectRatio: '4 / 3' }}>
            <Image src="/images/marketing/family-home.jpg" alt="Familie entspannt auf der Terrasse ihres Hauses" width={1024} height={1024} sizes="(min-width: 900px) 540px, 100vw" />
          </Reveal>
        </div>
      </Section>

      <Section tone="soft" eyebrow="Klare Regeln" title="Was du von uns erwarten kannst." tight>
        <Facts items={FACTS} />
      </Section>

      <CtaBand title="Dein Hauskonto startet bei 0 €." text="Beschreibe dein erstes Anliegen oder leg einfach los und bau die Hausakte auf. Beides ist kostenlos." />
    </MarketingShell>
  );
}
