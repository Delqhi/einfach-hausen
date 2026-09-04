import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import { BrainCircuit, HeartHandshake, Home } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/site-shell';
import { HeroEditorialPhoto } from '@/components/marketing/hero-visuals';
import { CtaBand, LinkButton, PageHero, Section, Statement, mkt as styles } from '@/components/marketing/ui';

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
        <div className={styles.principleList}>
          {principles.map(p => (
            <div key={p.num} className={styles.principleRow}>
              <span className={styles.principleNum}>{p.num}</span>
              <div className={styles.principleBody}><h3>{p.title}</h3><p>{p.text}</p></div>
            </div>
          ))}
        </div>
      </Section>

      <Statement kicker="Unser Versprechen" tone="green">Ein Ansprechpartner für alles rund ums Eigenheim.</Statement>

      <Section eyebrow="Transparenz" title="Echte Menschen, regionale Partner und 0 % Provision." text="Wir verdienen nicht an vermittelten Aufträgen, sondern an stabilen Service-Paketen für Haus und Betrieb.">
        <div className={styles.cardGrid} data-cols="3">
          <article className={styles.card}>
            <span className={styles.cardKicker}><HeartHandshake size={20} /></span>
            <h3 className={styles.cardTitle}>Keine Lead-Auktionen</h3>
            <p className={styles.cardText}>Partner kaufen keine Anfragen im Sekundentakt. Anfragen gehen gezielt an den passenden Betrieb in deiner Nachbarschaft.</p>
          </article>
          <article className={styles.card}>
            <span className={styles.cardKicker}><BrainCircuit size={20} /></span>
            <h3 className={styles.cardTitle}>Assistenz statt Show</h3>
            <p className={styles.cardText}>Der Hausmeister-Copilot hilft bei der Problembeschreibung und Terminkoordination, nimmt dir aber niemals eigenmächtig das Ruder aus der Hand.</p>
          </article>
          <article className={styles.card}>
            <span className={styles.cardKicker}><Home size={20} /></span>
            <h3 className={styles.cardTitle}>Dauerhafter Werterhalt</h3>
            <p className={styles.cardText}>Jede Rechnung, jede Wartung und jeder Kontakt fließt in die digitale Hausakte deines Eigenheims.</p>
          </article>
        </div>
      </Section>

      <CtaBand title="Lerne Einfach Hausen für dein Zuhause kennen." text="Erstelle in zwei Minuten dein kostenloses Hauskonto und behalte den Kopf frei." />
    </MarketingShell>
  );
}
