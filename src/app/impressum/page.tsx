import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import { MarketingShell } from '@/components/marketing/site-shell';
import { PageHero, Section, LinkButton, mkt as styles } from '@/components/marketing/ui';

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

      <Section eyebrow="Anbieter" title="Verantwortliche Anbieterin der Plattform.">
        <div className={styles.stackLg}>
          <article className={styles.card}>
            <h3 className={styles.cardTitle}>Einfach Hausen</h3>
            <p className={styles.cardText}>
              <strong>Inhaberin &amp; Geschäftsführerin:</strong> Gina Schulze<br />
              <strong>Developer / technische Entwicklung:</strong> Jeremy Schulze<br />
              <strong>Kontakt:</strong> info@einfachhausen.de<br />
              <strong>Plattform:</strong> Vermittlungs- und Organisationsportal für Eigenheimbesitzer &amp; regionale Handwerksbetriebe.
            </p>
          </article>

          <article className={styles.card}>
            <h3 className={styles.cardTitle}>Haftung für Inhalte und Links</h3>
            <p className={styles.cardText}>
              Als Diensteanbieter sind wir gemäß den allgemeinen Gesetzen für eigene Inhalte auf diesen Seiten verantwortlich. Für externe Links zu Webseiten Dritter übernehmen wir keine Gewähr, da auf deren Inhalte kein Einfluss besteht. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
          </article>

          <article className={styles.card}>
            <h3 className={styles.cardTitle}>Urheberrecht</h3>
            <p className={styles.cardText}>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </article>
        </div>
      </Section>

      <Section tone="soft" eyebrow="Rechtliche Navigation" title="Weitere Angaben">
        <div className={styles.linkRow}>
          <LinkButton href="/datenschutz">Datenschutzerklärung</LinkButton>
          <LinkButton href="/agb" secondary>AGB</LinkButton>
          <LinkButton href="/kontakt" secondary>Kontakt &amp; Support</LinkButton>
        </div>
      </Section>
    </MarketingShell>
  );
}
