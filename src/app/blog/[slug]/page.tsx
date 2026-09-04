import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { breadcrumbJsonLd, canonical, SITE_URL } from '@/lib/seo';
import { BLOG_POSTS, CLUSTER_DATE_MODIFIED, CLUSTER_DATE_PUBLISHED } from '@/lib/seo-cluster';
import { MarketingShell } from '@/components/marketing/site-shell';
import { BulletList, CtaBand, Faq, InfoPanel, LinkButton, PageHero, Section, Steps, TextLink, mkt as styles } from '@/components/marketing/ui';

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: canonical(`/blog/${post.slug}`) },
    openGraph: { type: 'article', title: post.title, description: post.description, url: `/blog/${post.slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();
  const url = canonical(`/blog/${post.slug}`);
  const blogPosting = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: CLUSTER_DATE_PUBLISHED,
    dateModified: CLUSTER_DATE_MODIFIED,
    inLanguage: 'de',
    author: { '@id': `${SITE_URL}/#organisation` },
    publisher: { '@id': `${SITE_URL}/#organisation` },
    mainEntityOfPage: url,
  };
  return (
    <MarketingShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Start', path: '/' }, { name: 'Ratgeber', path: '/blog' }, { name: post.title, path: `/blog/${post.slug}` }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPosting) }} />
      <PageHero
        eyebrow="Ratgeber"
        title={post.title}
        text={post.description}
        actions={<><LinkButton href="/#anliegen">Anliegen starten</LinkButton><LinkButton href="/leistungen/heizung" secondary>Heizung als Leistung im Überblick</LinkButton></>}
      />
      <Section eyebrow="Problem" title="Worum es geht.">
        {post.problem.map((t) => (<p key={t.slice(0, 24)}>{t}</p>))}
      </Section>
      <Section tone="surface" eyebrow="Optionen" title="Drei Wege, ehrlich sortiert.">
        <Steps items={post.optionen.map((o) => ({ title: o.title, text: o.text }))} />
      </Section>
      <Section eyebrow="Kostenrahmen" title="Womit du rechnen solltest.">
        <BulletList items={post.kosten} />
        <InfoPanel label="Einordnung">Kostenrahmen sind Orientierung aus Anfrageverläufen, kein Angebot. Verbindlich ist der Rahmen des Partnerbetriebs, bevor du entscheidest.</InfoPanel>
      </Section>
      <Section tone="soft" eyebrow="Prüfpunkte" title="Aus unserer Einordnung: das hilft sofort.">
        <BulletList items={post.prüfpunkte} />
      </Section>
      <Section eyebrow="Entscheidung" title="Der nächste sinnvolle Schritt.">
        <BulletList items={post.entscheidung} />
      </Section>
      <Section eyebrow="Häufige Fragen" title="Zum Artikel." center>
        <div className={styles.centerRow}>
          <Faq items={post.faqs.map((f) => ({ q: f.q, a: f.a }))} />
        </div>
      </Section>
      <Section tone="surface" eyebrow="Weiterlesen" title="Passende Seiten im Cluster.">
        <ul>
          {post.related.map((r) => (
            <li key={r.href}><TextLink href={r.href}>{r.label}</TextLink></li>
          ))}
        </ul>
      </Section>
      <CtaBand title="Beschreib deinen Fall in eigenen Worten." text="Du erhältst Partner, Kostenrahmen und einen festen Ansprechpartner. Erst dann entscheidest du." />
    </MarketingShell>
  );
}
