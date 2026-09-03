import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import { ArrowRight, Building2, CircleAlert, HelpCircle, LogIn, MessageCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { MarketingShell } from '@/components/marketing/site-shell';
import { CtaBand, InfoPanel, LegalNotice, LinkButton, PageHero, Section, Statement } from '@/components/marketing/ui';
import { MiniContact } from '@/components/marketing/app-frames';

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Der richtige Weg für dein Anliegen: Hausanliegen starten, bestehenden Vorgang öffnen, Partnerfragen, Datenschutz.', 
  alternates: { canonical: canonical('/kontakt') },
};

const ROUTES = [
  { icon: MessageCircle, title: 'Neues Anliegen starten', text: 'Beschreibe kurz, was ansteht. Wir finden die passenden Partner vor Ort.', href: '/register?role=homeowner', label: 'Anliegen starten' },
  { icon: LogIn, title: 'Bestehender Vorgang', text: 'Ansprechpartner, Angebote, Termine und Dokumente im Hauskonto einsehen.', href: '/login', label: 'Zum Login' },
  { icon: HelpCircle, title: 'Fragen & Antworten', text: 'Kosten, Hausakte und Sicherheit detailliert im Hilfebereich nachlesen.', href: '/hilfe', label: 'Hilfe & FAQ öffnen' },
  { icon: Building2, title: 'Für Handwerksbetriebe', text: 'Informationen für Partnerbetriebe, Konditionen und Partner-Registrierung.', href: '/partner', label: 'Partnerbereich' },
] as const;

export default function Page() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Kontakt & Support"
        title="Sag uns, worum es geht. Wir leiten dich direkt an die richtige Stelle."
        text="Hausanliegen, laufende Reparaturen und Partneranfragen bleiben dort gebündelt, wo der Kontext liegt. Kein Anliegen verliert den Faden."
        aside={<MiniContact />}
      />

      <Section tone="surface" eyebrow="Wegweiser" title="Vier direkte Wege zu deinem Anliegen.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '20px', marginTop: '28px' }}>
          {ROUTES.map(({ icon: Icon, title, text, href, label }) => (
            <div key={title} style={{ padding: '24px', background: '#ffffff', borderRadius: '20px', border: '1px solid #e4e2dc', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#eef5f5', color: '#105258', display: 'grid', placeItems: 'center', marginBottom: '16px' }}>
                <Icon size={20} />
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#10222a', margin: '0 0 8px 0' }}>{title}</h3>
              <p style={{ fontSize: '14px', color: '#5f6e75', margin: '0 0 20px 0', lineHeight: 1.5, flex: 1 }}>{text}</p>
              <Link href={href} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 800, color: '#105258', textDecoration: 'none' }}>
                {label} <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </Section>

      <Statement kicker="Unser Grundsatz">Kein Anliegen verliert seinen Kontext. <mark>Kein Kontakt läuft ins Leere.</mark></Statement>

      <Section eyebrow="Datenschutz & Sicherheit" title="Offizieller Kontakt für rechtliche und vertrauliche Anliegen.">
        <InfoPanel label="Betreiberkontakt">
          <p>Für Datenschutzanfragen, rechtliche Mitteilungen oder Sicherheitsmeldungen stehen verifizierte Kanäle im Impressum und in der Datenschutzerklärung zur Verfügung. Plattformanfragen werden strukturiert über dein verifiziertes Nutzerkonto abgewickelt.</p>
        </InfoPanel>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '20px' }}>
          <LinkButton href="/datenschutz" secondary>Datenschutzerklärung</LinkButton>
          <LinkButton href="/sicherheit" secondary>Sicherheitsprinzipien</LinkButton>
          <LinkButton href="/impressum" secondary>Impressum</LinkButton>
        </div>
      </Section>

      <Section eyebrow="Notfall-Hinweis" title="Einfach Hausen ersetzt keinen behördlichen Notruf.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
          <div style={{ padding: '22px', borderRadius: '18px', border: '1px solid #fecaca', background: '#fff1f2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#991b1b', fontWeight: 800, fontSize: '15px', marginBottom: '8px' }}>
              <CircleAlert size={20} /> Akute Gefahr für Leib &amp; Leben
            </div>
            <p style={{ fontSize: '13px', color: '#7f1d1d', margin: 0, lineHeight: 1.5 }}>Bei Feuer, Gasgeruch, Einbruch oder akuter Einsturzgefahr wähle immer umgehend die 112 bzw. 110.</p>
          </div>
          <div style={{ padding: '22px', borderRadius: '18px', border: '1px solid #e4e2dc', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#105258', fontWeight: 800, fontSize: '15px', marginBottom: '8px' }}>
              <ShieldCheck size={20} /> Dringende Hausschäden
            </div>
            <p style={{ fontSize: '13px', color: '#5f6e75', margin: 0, lineHeight: 1.5 }}>Bei Rohrbruch oder Heizungsausfall im Winter steht dir in deinem Hauskonto der direkte Notfall-Modus zur Verfügung.</p>
          </div>
        </div>
      </Section>

      <CtaBand title="Brauchst du Hilfe bei deinem Eigenheim?" text="Kostenlos anmelden und direkt mit dem Hausmeister-Assistenten starten." />
    </MarketingShell>
  );
}
