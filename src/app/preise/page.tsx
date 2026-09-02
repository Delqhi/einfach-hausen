import type { Metadata } from 'next';
import { MarketingShell } from '@/components/marketing/site-shell';
import { HeroEditorialPhoto } from '@/components/marketing/hero-visuals';
import { CtaBand, LinkButton, PageHero, Section, Statement } from '@/components/marketing/ui';

import { PriceToggle } from './price-toggle';
import styles from '@/components/marketing/marketing.module.css';

export const metadata: Metadata = { title: 'Preise', description: 'Kunden- und Partnerpreise von Einfach Hausen transparent im Überblick.' };
const customer=[
 {name:'FREE',price:'0 €',text:'Der Einstieg für Anliegen, Aufträge und Hauswissen.',items:['Hausmeisterservice','Aufträge und Angebotsvergleich','Vermittlung','Digitale Hausakte']},
 {name:'PLUS',price:'19,90 €',text:'Mehr Automatisierung für laufende Hauspflege.',items:['Automatische Wartungsplanung','Hausjahresplan und Erinnerungen','Dokumentenverwaltung','Erweiterte Hausakte','Prioritätsservice']},
 {name:'PREMIUM',price:'39,90 €',text:'Mehr persönliche Betreuung und Organisation.',items:['Persönliche Betreuung','Höchste Servicepriorität','Jährlicher Hauscheck','Automatische Wartungsorganisation','Erweiterter Premium-Service']},
] as const;
const partner=[
 {name:'FREE',price:'0 €',text:'Kostenloser Einstieg mit begrenzter Anzahl neuer Anfragen.'},
 {name:'START',price:'29 €',text:'Planbarer Monatstarif für aktive Partner.'},
 {name:'PRO',price:'79 €',text:'Erweiterter Monatstarif für aktive Partner.'},
 {name:'PREMIUM',price:'199 €',text:'Höchster definierter Partner-Monatstarif.'},
] as const;
export default function Page(){return <MarketingShell>
  <PageHero eyebrow="Preise" title="Transparent für Eigentümer und Betriebe." text="Kunden starten kostenlos. Partner arbeiten ohne Auftragsprovision. Bezahlte Funktionen und Tarife sind klar getrennt." aside={<HeroEditorialPhoto src="/images/premium/hausakte.jpg" label="FREE bleibt 0 €" detail="Bezahlte Services sind eine bewusste Zusatzentscheidung." />} actions={<><LinkButton href="/register?role=homeowner">Kostenlos starten</LinkButton><LinkButton href="/register?role=provider" secondary>Als Partner starten</LinkButton></>} />
  <Statement kicker="Unser Preisprinzip" tone="soft">Keine versteckten Kosten. Keine Provision auf dein Handwerk.</Statement>
  <Section eyebrow="Tarife" title="Wähle deine Sichtweise: Eigentümer oder Betrieb." text="Alle Beträge pro Monat. Kein Auftrag entsteht automatisch, und Tarife kaufen keine bessere Matching-Position.">
    <PriceToggle customer={customer} partner={partner} />
    <p className={styles.note}>Ein Haus-Anliegen wird nicht automatisch zum Auftrag. Beratung, Ansprechpartner und organisierte Beauftragung bleiben getrennte Entscheidungen.</p>
    <p className={styles.note}>Pilotphase: Die ersten 1.000 Haushalte erhalten 15% Dauer-Vorteil auf Pakete und Mitgliedschaften — wird im Konto automatisch angewendet. <a className="text-link" href="/pilotphase">Details</a></p>
  </Section>
  <CtaBand title="Kostenlos starten und später entscheiden." text="Das FREE-Hauskonto kostet 0 € pro Monat. Zusätzlicher Service ist optional." />
</MarketingShell>}
