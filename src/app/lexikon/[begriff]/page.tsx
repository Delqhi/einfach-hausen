import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { breadcrumbJsonLd, canonical, SITE_URL } from '@/lib/seo';
import { CLUSTER_DATE_MODIFIED, CLUSTER_DATE_PUBLISHED, LEXIKON_TERMS } from '@/lib/seo-cluster';
import { MarketingShell } from '@/components/marketing/site-shell';
import { BulletList, CtaBand, Faq, InfoPanel, LinkButton, PageHero, Section, Steps, TextLink } from '@/components/marketing/ui';

export function generateStaticParams() {
  return LEXIKON_TERMS.map((t) => ({ begriff: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ begriff: string }> }): Promise<Metadata> {
  const { begriff } = await params;
  const term = LEXIKON_TERMS.find((t) => t.slug === begriff);
  if (!term) return {};
  return {
    title: term.title,
    description: term.description,
    alternates: { canonical: canonical(`/lexikon/${term.slug}`) },
    openGraph: { type: 'article', title: term.title, description: term.description, url: `/lexikon/${term.slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ begriff: string }> }) {
  const { begriff } = await params;
  const term = LEXIKON_TERMS.find((t) => t.slug === begriff);
  if (!term) notFound();
  const url = canonical(`/lexikon/${term.slug}`);
  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: term.title,
    description: term.description,
    datePublished: CLUSTER_DATE_PUBLISHED,
    dateModified: CLUSTER_DATE_MODIFIED,
    inLanguage: 'de',
    author: { '@id': `${SITE_URL}/#organisation` },
    publisher: { '@id': `${SITE_URL}/#organisation` },
    mainEntityOfPage: url,
  };
  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: term.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  return (
    <MarketingShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Start', path: '/' }, { name: 'Lexikon', path: '/lexikon' }, { name: term.begriff, path: `/lexikon/${term.slug}` }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }} />
      <PageHero
        eyebrow="Lexikon"
        title={term.begriff}
        text={term.definition}
        actions={<><LinkButton href="/#anliegen">Anliegen starten</LinkButton><LinkButton href="/leistungen/heizung" secondary>Heizung als Leistung im Ueberblick</LinkButton></>}
      />
      <Section eyebrow="Kostenrahmen" title="Womit du rechnen solltest.">
        <BulletList items={term.kosten} />
        <InfoPanel label="Einordnung">Kostenrahmen sind Orientierung aus Anfrageverlaeufen, kein Angebot. Verbindlich ist der Rahmen des Partnerbetriebs, bevor du entscheidest.</InfoPanel>
      </Section>
      <Section tone="surface" eyebrow="Ablauf" title="In Schritten zum Ergebnis.">
        <Steps items={term.ablauf.map((s) => ({ title: s.title, text: s.text }))} />
      </Section>
      <Section tone="soft" eyebrow="Pruefpunkte" title="Woran du merkst, dass es dich betrifft.">
        <BulletList items={term.pruefpunkte} />
      </Section>
      <Section eyebrow="Haeufige Fragen" title={term.begriff + ' — Fragen und Antworten.'} center>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Faq items={term.faqs.map((f) => ({ q: f.q, a: f.a }))} />
        </div>
      </Section>
      <Section tone="surface" eyebrow="Weiterlesen" title="Passende Seiten im Cluster.">
        <ul>
          {term.related.map((r) => (
            <li key={r.href}><TextLink href={r.href}>{r.label}</TextLink></li>
          ))}
        </ul>
      </Section>
      <CtaBand title="Vom Begriff zu deinem Fall." text="Beschreib dein Anliegen in eigenen Worten. Du erhaeltst Partner, Kostenrahmen und einen festen Ansprechpartner." />
    </MarketingShell>
  );
}
