import type { Metadata } from 'next';
import { breadcrumbJsonLd, canonical } from '@/lib/seo';
import { BLOG_POSTS } from '@/lib/seo-cluster';
import { MarketingShell } from '@/components/marketing/site-shell';
import { CtaBand, LinkButton, PageHero, Section, TextLink, mkt as styles } from '@/components/marketing/ui';
import { BookOpen } from 'lucide-react';

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
        <div className={styles.cardGrid} data-cols="3">
          {BLOG_POSTS.map((p) => (
            <article key={p.slug} className={styles.card}>
              <span className={styles.cardKicker}><BookOpen size={16} /> Ratgeber-Artikel</span>
              <h3 className={styles.cardTitle}>{p.title}</h3>
              <p className={styles.cardText}>{p.description}</p>
              <span className={styles.cardFoot}><TextLink href={`/blog/${p.slug}`}>Leitfaden lesen</TextLink></span>
            </article>
          ))}
        </div>
      </Section>
      <CtaBand title="Dein Vorhaben ist konkreter als ein Ratgeber?" text="Beschreib dein Anliegen in eigenen Worten. Wir finden passende Meisterbetriebe und ermitteln den genauen Kostenrahmen." />
    </MarketingShell>
  );
}
