import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import { MarketingShell } from '@/components/marketing/site-shell';
import { PageHero, Section, LegalNotice, LinkButton } from '@/components/marketing/ui';

export const metadata: Metadata = { 
  title: 'Impressum', 
  description: 'Anbieterkennzeichnung von Einfach Hausen nach § 5 DDG.', 
  alternates: { canonical: canonical('/impressum') } 
};

export default function Page() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Rechtliches"
        title="Impressum &amp; Anbieterkennzeichnung"
        text="Angaben gemäß § 5 des Digitale-Dienste-Gesetzes (DDG)."
      />

      <Section eyebrow="Anbieter" title="Verantwortlicher Betreiber der Plattform.">
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'grid', gap: '24px' }}>
          <div style={{ padding: '28px', background: '#ffffff', borderRadius: '20px', border: '1px solid #e4e2dc' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#10222a', margin: '0 0 12px 0' }}>Einfach Hausen</h3>
            <p style={{ fontSize: '15px', color: '#4b5b60', lineHeight: 1.7, margin: 0 }}>
              <strong>Betreiber:</strong> Jeremy Schulze / Einfach Hausen<br />
              <strong>Kontakt:</strong> info@einfachhausen.de<br />
              <strong>Plattform:</strong> Vermittlungs- und Organisationsportal für Eigenheimbesitzer &amp; regionale Handwerksbetriebe.
            </p>
          </div>

          <div style={{ padding: '28px', background: '#ffffff', borderRadius: '20px', border: '1px solid #e4e2dc' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#10222a', margin: '0 0 12px 0' }}>Haftung für Inhalte und Links</h3>
            <p style={{ fontSize: '15px', color: '#4b5b60', lineHeight: 1.7, margin: 0 }}>
              Als Diensteanbieter sind wir gemäß den allgemeinen Gesetzen für eigene Inhalte auf diesen Seiten verantwortlich. Für externe Links zu Webseiten Dritter übernehmen wir keine Gewähr, da auf deren Inhalte kein Einfluss besteht. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
          </div>

          <div style={{ padding: '28px', background: '#ffffff', borderRadius: '20px', border: '1px solid #e4e2dc' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#10222a', margin: '0 0 12px 0' }}>Urheberrecht</h3>
            <p style={{ fontSize: '15px', color: '#4b5b60', lineHeight: 1.7, margin: 0 }}>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="soft" eyebrow="Rechtliche Navigation" title="Weitere Angaben">
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <LinkButton href="/datenschutz">Datenschutzerklärung</LinkButton>
          <LinkButton href="/agb" secondary>AGB</LinkButton>
          <LinkButton href="/kontakt" secondary>Kontakt &amp; Support</LinkButton>
        </div>
      </Section>
    </MarketingShell>
  );
}
