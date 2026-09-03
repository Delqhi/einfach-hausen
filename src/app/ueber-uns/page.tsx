import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import { BrainCircuit, HeartHandshake, Home, MapPinned, UserRound, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { MarketingShell } from '@/components/marketing/site-shell';
import { HeroEditorialPhoto } from '@/components/marketing/hero-visuals';
import { CtaBand, LinkButton, PageHero, Section, Statement } from '@/components/marketing/ui';

export const metadata: Metadata = { 
  title: 'Über uns', 
  description: 'Mission und Arbeitsweise hinter Einfach Hausen: Eine ruhige Eingangstür für Eigentümer und Partner.', 
  alternates: { canonical: canonical('/ueber-uns') } 
};

export default function Page() {
  const principles = [
    { num: '01', title: 'Nutzen vor Technologie', text: 'Jede Funktion beginnt mit einem konkreten Nutzen für das Haus. KI ist ein leises Werkzeug im Hintergrund, kein lautes Werbeversprechen.' },
    { num: '02', title: 'Entscheidung bleibt beim Menschen', text: 'Einordnen, vorbereiten, prüfen: ja. Aber Beauftragung, Freigabe und Vereinbarungen sind immer bewusste Entscheidungen zwischen Eigentümer und Handwerker.' },
    { num: '03', title: 'Region vor Skalierung', text: 'Wir wachsen mit verifizierten Partnerbetrieben vor Ort. Verlässliche Handwerksqualität und kurze Wege schlagen anonyme Vermittlungsplattformen.' },
    { num: '04', title: 'Hauswissen bleibt erhalten', text: 'Die Immobilie ist der langlebige Datensatz. Technik, Wartungshistorie, Rechnungen und bewährte Kontakte gehören dauerhaft an einen Ort.' },
  ];

  return (
    <MarketingShell>
      <PageHero 
        eyebrow="Über uns" 
        title="Die ruhige Eingangstür für dein Eigenheim." 
        text="Nicht noch ein unübersichtliches Handwerkerverzeichnis, kein kompliziertes ERP: Eine verlässliche Anlaufstelle, die Anliegen versteht, lokale Meisterbetriebe verbindet und das Wissen deines Hauses bewahrt." 
        aside={<HeroEditorialPhoto src="/images/premium/hero-homeowner.jpg" label="Einfach Hausen" detail="Verlässliche Organisation im Hintergrund. Handwerkskunst vor Ort." />} 
        actions={<LinkButton href="/register?role=homeowner">Hauskonto anlegen</LinkButton>} 
      />

      {/* Reduziertes, typografisches Editorial-Manifest statt Standard-Kachelraster */}
      <Section eyebrow="Leitbild" title="Vier Grundsätze, an denen wir jede Zeile Code messen.">
        <div style={{ display: 'grid', gap: '32px', marginTop: '36px' }}>
          {principles.map(p => (
            <div key={p.num} style={{ display: 'grid', gridTemplateColumns: 'minmax(60px, 80px) minmax(0, 1fr)', gap: '24px', paddingBottom: '32px', borderBottom: '1px solid #e4e2dc' }}>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#105258', fontVariantNumeric: 'tabular-nums' }}>{p.num}</span>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#10222a', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>{p.title}</h3>
                <p style={{ fontSize: '15px', color: '#4b5b60', lineHeight: 1.6, margin: 0, maxWidth: '680px' }}>{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Statement kicker="Unser Versprechen" tone="green">Ein Ansprechpartner für alles rund ums Eigenheim.</Statement>

      <Section eyebrow="Transparenz" title="Echte Menschen, regionale Partner und 0 % Provision." text="Wir verdienen nicht an vermittelten Aufträgen, sondern an stabilen Service-Paketen für Haus und Betrieb.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '24px' }}>
          <div style={{ padding: '24px', background: '#ffffff', borderRadius: '20px', border: '1px solid #e4e2dc' }}>
            <HeartHandshake size={24} style={{ color: '#105258', marginBottom: '14px' }} />
            <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 6px 0' }}>Keine Lead-Auktionen</h4>
            <p style={{ fontSize: '14px', color: '#5f6e75', margin: 0, lineHeight: 1.5 }}>Partner kaufen keine Anfragen im Sekundentakt. Anfragen gehen gezielt an den passenden Betrieb in deiner Nachbarschaft.</p>
          </div>
          <div style={{ padding: '24px', background: '#ffffff', borderRadius: '20px', border: '1px solid #e4e2dc' }}>
            <BrainCircuit size={24} style={{ color: '#105258', marginBottom: '14px' }} />
            <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 6px 0' }}>Assistenz statt Show</h4>
            <p style={{ fontSize: '14px', color: '#5f6e75', margin: 0, lineHeight: 1.5 }}>Der Hausmeister-Copilot hilft bei der Problembeschreibung und Terminkoordination, nimmt dir aber niemals eigenmächtig das Ruder aus der Hand.</p>
          </div>
          <div style={{ padding: '24px', background: '#ffffff', borderRadius: '20px', border: '1px solid #e4e2dc' }}>
            <Home size={24} style={{ color: '#105258', marginBottom: '14px' }} />
            <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 6px 0' }}>Dauerhafter Werterhalt</h4>
            <p style={{ fontSize: '14px', color: '#5f6e75', margin: 0, lineHeight: 1.5 }}>Jede Rechnung, jede Wartung und jeder Kontakt fließt in die digitale Hausakte deines Eigenheims.</p>
          </div>
        </div>
      </Section>

      <CtaBand title="Lerne Einfach Hausen für dein Zuhause kennen." text="Erstelle in zwei Minuten dein kostenloses Hauskonto und behalte den Kopf frei." />
    </MarketingShell>
  );
}
