import type { Metadata } from 'next';
import { breadcrumbJsonLd, canonical } from '@/lib/seo';
import { BLOG_POSTS } from '@/lib/seo-cluster';
import { MarketingShell } from '@/components/marketing/site-shell';
import { CtaBand, LinkButton, PageHero, Section } from '@/components/marketing/ui';
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';

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
        text="Praxisnahe Orientierung für Eigentümer: Problem, Optionen, Kostenrahmen und klare Entscheidungswege ohne Fachchinesisch."
        actions={<><LinkButton href="/leistungen/heizung">Heizung im Überblick</LinkButton><LinkButton href="/lexikon" secondary>Zum Fachlexikon</LinkButton></>}
      />
      <Section tone="surface" eyebrow="Wissenssammlung" title="Aktuelle Ratgeber &amp; Leitfäden">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginTop: '28px' }}>
          {BLOG_POSTS.map((p) => (
            <article key={p.slug} style={{ display: 'flex', flexDirection: 'column', padding: '28px', background: '#ffffff', borderRadius: '22px', border: '1px solid #e4e2dc', boxShadow: '0 2px 8px rgba(16,34,42,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#105258', fontSize: '12px', fontWeight: 700, marginBottom: '14px' }}>
                <BookOpen size={16} /> Ratgeber-Artikel
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#10222a', margin: '0 0 10px 0', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
                {p.title}
              </h3>
              <p style={{ fontSize: '15px', color: '#5f6e75', lineHeight: 1.6, margin: '0 0 24px 0', flex: 1 }}>
                {p.description}
              </p>
              <Link href={`/blog/${p.slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 800, color: '#105258', textDecoration: 'none' }}>
                Leitfaden lesen <ArrowRight size={16} />
              </Link>
            </article>
          ))}
        </div>
      </Section>
      <CtaBand title="Dein Vorhaben ist konkreter als ein Ratgeber?" text="Beschreib dein Anliegen in eigenen Worten. Wir finden passende Meisterbetriebe und ermitteln den genauen Kostenrahmen." />
    </MarketingShell>
  );
}
