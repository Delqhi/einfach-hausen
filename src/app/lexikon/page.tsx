import type { Metadata } from 'next';
import { breadcrumbJsonLd, canonical } from '@/lib/seo';
import { LEXIKON_TERMS } from '@/lib/seo-cluster';
import { MarketingShell } from '@/components/marketing/site-shell';
import { CtaBand, LinkButton, PageHero, Section, TextLink, mkt as styles } from '@/components/marketing/ui';
import { Bookmark } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Lexikon: Begriffe rund ums Haus',
  description: 'Kurze Definitionen mit Kostenrahmen, Ablauf und FAQ: hydraulischer Abgleich, Heizungsgesetz, Lüftung, Schimmelklassen.',
  alternates: { canonical: canonical('/lexikon') },
};

export default function Page() {
  return (
    <MarketingShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Start', path: '/' }, { name: 'Lexikon', path: '/lexikon' }])) }} />
      <PageHero
        eyebrow="Lexikon &amp; Fachbegriffe"
        title="Fachbegriffe, kurz und belastbar erklärt."
        text="Kein Fachchinesisch, sondern klare Orientierung: Definition, Orientierungspreise, Schritte und Prüfpunkte für Eigentümer."
        actions={<><LinkButton href="/leistungen/heizung">Heizung im Überblick</LinkButton><LinkButton href="/blog" secondary>Zu den Ratgebern</LinkButton></>}
      />
      <Section tone="surface" eyebrow="Glossar" title="Wichtige Begriffe auf einen Blick">
        <div className={styles.cardGrid} data-cols="3">
          {LEXIKON_TERMS.map((t) => (
            <article key={t.slug} className={styles.card}>
              <span className={styles.cardKicker}><Bookmark size={16} /> Definition &amp; Praxis</span>
              <h3 className={styles.cardTitle}>{t.begriff}</h3>
              <p className={styles.cardText}>{t.definition}</p>
              <span className={styles.cardFoot}><TextLink href={`/lexikon/${t.slug}`}>Eintrag aufschlagen</TextLink></span>
            </article>
          ))}
        </div>
      </Section>
      <CtaBand title="Begriff verstanden — und jetzt dein Fall." text="Beschreib dein Anliegen in eigenen Worten. Einordnung, Partner und Kostenrahmen kommen von uns." />
    </MarketingShell>
  );
}
