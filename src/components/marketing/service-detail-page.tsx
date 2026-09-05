import { breadcrumbJsonLd, canonical, SITE_URL } from '@/lib/seo';
import { MarketingShell } from './site-shell';
import type { ServiceCategory } from './service-catalog';
import { BulletList, CtaBand, Faq, InfoPanel, LinkButton, PageHero, Section, Steps, TextLink, mkt as styles } from './ui';

export function ServiceDetailPage({ service }: { service: ServiceCategory }) {
  const servicePath = `/leistungen/${service.slug}`;
  const serviceJsonLd = {
    '@context': 'https://schema.org', '@type': 'Service', name: service.title,
    serviceType: service.title, url: canonical(servicePath),
    provider: { '@type': 'HomeAndConstructionBusiness', '@id': `${SITE_URL}/leistungen#anbieter`, name: 'Einfach Hausen', url: canonical('/leistungen') },
    areaServed: 'Regionale Pilotgebiete in Deutschland — konkrete Verfügbarkeit hängt vom aktiven Partnernetz vor Ort ab',
  };
  return <MarketingShell>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Start', path: '/' }, { name: 'Leistungen', path: '/leistungen' }, { name: service.shortTitle, path: servicePath }])) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
    <PageHero eyebrow={`Leistungen · ${service.shortTitle}`} title={`${service.title}: einfach anfangen, ohne das Gewerk kennen zu müssen.`} text={`${service.description}. Beschreib, was du bemerkst oder vorhast. Wir helfen bei der Einordnung und zeigen den passenden nächsten Schritt — unverbindlich, bevor ein Auftrag entsteht.`} actions={<><LinkButton href="/#anliegen">Anliegen beschreiben</LinkButton><LinkButton href="/leistungen" secondary>Alle Leistungen</LinkButton></>} />
    <Section tone="surface" eyebrow="Typische Situationen" title="Damit kannst du zu uns kommen." text="Die Beispiele sind Orientierung. Wenn dein Fall anders klingt, beschreib ihn trotzdem in deinen Worten.">
      <div className={styles.cardGrid} data-cols="3">{service.situations.map((situation) => <article className={styles.card} key={situation}><h3>{situation}</h3><p>Wir klären, welche Informationen und welcher Fachbereich dafür sinnvoll sind.</p></article>)}</div>
    </Section>
    <Section eyebrow="So läuft es" title="Ein Eingang. Drei klare Schritte.">
      <Steps items={service.steps} />
    </Section>
    <Section tone="soft" eyebrow="Ehrlich eingeordnet" title="Was wir versprechen — und was nicht.">
      <InfoPanel label="Rahmen"><BulletList items={service.limits} /></InfoPanel>
    </Section>
    {service.related.length > 0 && <Section eyebrow="Vertiefen" title="Passende Ratgeber und Produktwege." tight>
      <ul>{service.related.map((item) => <li key={item.href}><TextLink href={item.href}>{item.label}</TextLink></li>)}</ul>
    </Section>}
    <Section eyebrow="Häufige Fragen" title={`Zu ${service.shortTitle}.`} center>
      <div className={styles.centerRow}><Faq items={service.faq} /></div>
    </Section>
    <CtaBand title={service.cta} text="Kostenlos und unverbindlich starten. Wir ordnen ein, du entscheidest über jeden nächsten Schritt." />
  </MarketingShell>;
}
