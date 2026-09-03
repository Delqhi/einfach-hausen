import type { Metadata } from 'next';
import { breadcrumbJsonLd, canonical } from '@/lib/seo';
import { LEXIKON_TERMS } from '@/lib/seo-cluster';
import { MarketingShell } from '@/components/marketing/site-shell';
import { Card, CardGrid, CtaBand, LinkButton, PageHero, Section, TextLink } from '@/components/marketing/ui';

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
        eyebrow="Lexikon"
        title="Fachbegriffe, kurz und belastbar erklärt."
        text="Vier Begriffe zum Start. Jeder Eintrag: Definition, Kostenrahmen, Ablauf in Schritten, Prüfpunkte und Antworten auf häufige Fragen."
        actions={<><LinkButton href="/leistungen/heizung">Pillar: Heizung im Überblick</LinkButton><LinkButton href="/blog" secondary>Zum Ratgeber</LinkButton></>}
      />
      <Section tone="surface" eyebrow="Alle Begriffe" title="Vier zum Start.">
        <CardGrid>
          {LEXIKON_TERMS.map((t) => (
            <Card key={t.slug} title={t.begriff} text={t.definition}>
              <TextLink href={`/lexikon/${t.slug}`}>Eintrag lesen: {t.begriff}</TextLink>
            </Card>
          ))}
        </CardGrid>
      </Section>
      <CtaBand title="Begriff verstanden — und jetzt dein Fall." text="Beschreib dein Anliegen in eigenen Worten. Einordnung, Partner und Kostenrahmen kommen von uns." />
    </MarketingShell>
  );
}
