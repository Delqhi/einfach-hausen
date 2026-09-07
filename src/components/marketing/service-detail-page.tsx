import { breadcrumbJsonLd, canonical, SITE_URL } from '@/lib/seo';
import { MarketingShell } from './site-shell';
import type { ServiceCategory } from './service-catalog';
import { EHScope, EHSection, EHPageHero, EHSplitStory, EHFeatureRows, EHSteps, EHCallout, EHFAQ, EHRelated, EHClosing, EHEyebrow, EHButton, EHText } from '@/design-system';

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
    <EHScope>
      <EHPageHero eyebrow={`Leistungen · ${service.shortTitle}`} title={`${service.title}: einfach anfangen, ohne das Gewerk kennen zu müssen.`} text={`${service.description}. Beschreib, was du bemerkst oder vorhast. Wir helfen bei der Einordnung und zeigen den passenden nächsten Schritt — unverbindlich, bevor ein Auftrag entsteht.`} actions={<><EHButton href="/#anliegen" arrow>Anliegen beschreiben</EHButton><EHButton href="/leistungen" variant="secondary">Alle Leistungen</EHButton></>} />
      <EHSection compact>
        <EHSplitStory eyebrow="Typische Situationen" title="Damit kannst du zu uns kommen." text="Die Beispiele sind Orientierung. Wenn dein Fall anders klingt, beschreib ihn trotzdem in deinen Worten." media={<EHFeatureRows items={service.situations.map((situation) => ({ title: situation, text: 'Wir klären, welche Informationen und welcher Fachbereich dafür sinnvoll sind.' }))} />} />
      </EHSection>
      <EHSection compact>
        <EHEyebrow>So läuft es</EHEyebrow>
        <EHSteps items={service.steps.map((s) => ({ title: s.title, text: s.text }))} />
      </EHSection>
      <EHSection compact>
        <EHCallout title="Ehrlich eingeordnet: Was wir versprechen — und was nicht.">
          <ul>{service.limits.map((limit) => <li key={limit}><EHText>{limit}</EHText></li>)}</ul>
        </EHCallout>
      </EHSection>
      {service.related.length > 0 && <EHSection compact><EHRelated items={service.related.map((item) => ({ title: item.label, href: item.href }))} /></EHSection>}
      <EHSection compact>
        <EHEyebrow>Häufige Fragen</EHEyebrow>
        <EHFAQ items={service.faq.map((f) => ({ q: f.q, a: f.a }))} />
      </EHSection>
      <EHClosing title={service.cta} text="Kostenlos und unverbindlich starten. Wir ordnen ein, du entscheidest über jeden nächsten Schritt." href="/register?role=homeowner" label="Hauskonto kostenlos anlegen" secondary={<EHButton href="/#anliegen" variant="secondary">Anliegen starten</EHButton>} />
    </EHScope>
  </MarketingShell>;
}
