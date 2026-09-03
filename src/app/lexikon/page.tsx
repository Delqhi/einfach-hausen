import type { Metadata } from 'next';
import { breadcrumbJsonLd, canonical } from '@/lib/seo';
import { LEXIKON_TERMS } from '@/lib/seo-cluster';
import { MarketingShell } from '@/components/marketing/site-shell';
import { CtaBand, LinkButton, PageHero, Section } from '@/components/marketing/ui';
import Link from 'next/link';
import { ArrowRight, Bookmark } from 'lucide-react';

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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '28px' }}>
          {LEXIKON_TERMS.map((t) => (
            <article key={t.slug} style={{ display: 'flex', flexDirection: 'column', padding: '26px', background: '#ffffff', borderRadius: '20px', border: '1px solid #e4e2dc', boxShadow: '0 2px 8px rgba(16,34,42,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#105258', fontSize: '12px', fontWeight: 700, marginBottom: '12px' }}>
                <Bookmark size={16} /> Definition &amp; Praxis
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#10222a', margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>
                {t.begriff}
              </h3>
              <p style={{ fontSize: '14.5px', color: '#5f6e75', lineHeight: 1.6, margin: '0 0 20px 0', flex: 1 }}>
                {t.definition}
              </p>
              <Link href={`/lexikon/${t.slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 800, color: '#105258', textDecoration: 'none' }}>
                Eintrag aufschlagen <ArrowRight size={15} />
              </Link>
            </article>
          ))}
        </div>
      </Section>
      <CtaBand title="Begriff verstanden — und jetzt dein Fall." text="Beschreib dein Anliegen in eigenen Worten. Einordnung, Partner und Kostenrahmen kommen von uns." />
    </MarketingShell>
  );
}
