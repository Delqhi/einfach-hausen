import type { Metadata } from 'next';
import { breadcrumbJsonLd, canonical } from '@/lib/seo';
import { BLOG_POSTS } from '@/lib/seo-cluster';
import { MarketingShell } from '@/components/marketing/site-shell';
import { Card, CardGrid, CtaBand, LinkButton, PageHero, Section, TextLink } from '@/components/marketing/ui';

export const metadata: Metadata = {
  title: 'Ratgeber rund ums Eigenheim',
  description: 'Praxisnahe Ratgeber: Heizungswartung, Bad-Sanierung, Schimmel. Problem, Optionen, Kostenrahmen, Entscheidung.',
  alternates: { canonical: canonical('/blog') },
};

export default function Page() {
  return (
    <MarketingShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Start', path: '/' }, { name: 'Ratgeber', path: '/blog' }])) }} />
      <PageHero
        eyebrow="Ratgeber"
        title="Verstehen, einordnen, dann entscheiden."
        text="Drei Pilot-Ratgeber zu Heizung, Bad und Schimmel. Jeder folgt demselben Aufbau: Problem, Optionen, Kostenrahmen, Entscheidung. Mit Pruefpunkten aus unserer Einordnung."
        actions={<><LinkButton href="/leistungen/heizung">Pillar: Heizung im Ueberblick</LinkButton><LinkButton href="/lexikon" secondary>Zum Lexikon</LinkButton></>}
      />
      <Section tone="surface" eyebrow="Alle Artikel" title="Drei zum Start. Jeder mit klarem naechsten Schritt.">
        <CardGrid>
          {BLOG_POSTS.map((p) => (
            <Card key={p.slug} title={p.title} text={p.description}>
              <TextLink href={`/blog/${p.slug}`}>Artikel lesen: {p.title}</TextLink>
            </Card>
          ))}
        </CardGrid>
      </Section>
      <CtaBand title="Dein Fall ist konkreter als jeder Artikel." text="Beschreib dein Anliegen in eigenen Worten. Du erhaeltst Partner, Kostenrahmen und Ansprechpartner — und entscheidest dann." />
    </MarketingShell>
  );
}
