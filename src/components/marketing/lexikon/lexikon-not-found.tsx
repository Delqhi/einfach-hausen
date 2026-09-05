import Link from 'next/link';
import { LEXIKON_EINTRAEGE } from '@/lib/lexikon';
import { MarketingShell } from '@/components/marketing/site-shell';
import { LinkButton, Section } from '@/components/marketing/ui';
import { Stagger } from '@/components/marketing/motion';
import { EntryGrid } from '@/components/marketing/lexikon/lexikon-sections';
import styles from '@/components/marketing/lexikon/lexikon.module.css';

export function LexikonNotFound() {
  const vorschlaege = [...LEXIKON_EINTRAEGE]
    .sort((a, b) => b.stufen.dringlichkeit - a.stufen.dringlichkeit)
    .slice(0, 3);

  return (
    <MarketingShell>
      <Stagger className={styles.notFound} gap={0.08}>
        <span className={styles.code}>404 · Lexikon</span>
        <h1>Diesen Begriff führen wir (noch) nicht.</h1>
        <p>Vielleicht ein Tippfehler in der Adresse — oder ein Thema, das wir noch aufnehmen sollten. Du musst den Fachbegriff aber nicht kennen, um Hilfe zu bekommen.</p>
        <div className={styles.dHeroActions}>
          <LinkButton href="/lexikon">Lexikon durchsuchen</LinkButton>
          <LinkButton href="/#anliegen" secondary>Anliegen in eigenen Worten beschreiben</LinkButton>
        </div>
      </Stagger>
      <Section tone="surface" eyebrow="Häufig relevant" title="Begriffe, die Eigentümer selten aufschieben sollten." tight>
        <EntryGrid entries={vorschlaege} />
        <div style={{ marginTop: 28 }}><Link href="/lexikon" style={{ fontWeight: 700, color: 'var(--eh-teal-700)' }}>Alle Begriffe ansehen →</Link></div>
      </Section>
    </MarketingShell>
  );
}
