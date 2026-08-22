import type { Metadata } from 'next';
import { MarketingShell } from '@/components/marketing/site-shell';
import { BulletList, CtaBand, LinkButton, PageHero, Section } from '@/components/marketing/ui';
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
  <PageHero eyebrow="Preise" title="Transparent für Eigentümer und Betriebe." text="Kunden starten kostenlos. Partner arbeiten ohne Auftragsprovision. Bezahlte Funktionen und Tarife sind klar getrennt." />
  <Section eyebrow="Eigenheimbesitzer" title="Vom kostenlosen Hauskonto bis zur persönlichen Betreuung." text="Alle Beträge pro Monat. Optionale Jahrespakete können zusätzlich angeboten werden, sind hier aber nicht bepreist, solange kein verifizierter Preis vorliegt.">
    <div className={styles.priceGrid}>{customer.map((p,i)=><article className={`${styles.priceCard} ${i===1?styles.priceCardFeatured:''}`} key={p.name}><h3>{p.name}</h3><div className={styles.price}>{p.price}<small>/ Monat</small></div><p>{p.text}</p><BulletList items={p.items}/><LinkButton href="/register?role=homeowner" secondary={i!==0}>{i===0?'Kostenlos starten':`${p.name} ansehen`}</LinkButton></article>)}</div>
    <p className={styles.note}>Ein Haus-Anliegen wird nicht automatisch zum Auftrag. Beratung, Ansprechpartner und organisierte Beauftragung bleiben getrennte Entscheidungen.</p>
  </Section>
  <Section eyebrow="Partner" title="0 % Provision. Planbare Monatstarife." text="Partner-Tarife beeinflussen nicht die fachliche Reihenfolge im Matching. START, PRO und PREMIUM beginnen laut Produktmodell mit einer zweimonatigen kostenlosen Testphase." tone="soft">
    <div className={`${styles.priceGrid} ${styles.priceGridFour}`}>{partner.map((p,i)=><article className={`${styles.priceCard} ${i===2?styles.priceCardFeatured:''}`} key={p.name}><h3>{p.name}</h3><div className={styles.price}>{p.price}<small>/ Monat</small></div><p>{p.text}</p><BulletList items={i===0?['Begrenzte Anzahl neuer Anfragen','0 % Auftragsprovision']:['2 Monate kostenlose Testphase','0 % Auftragsprovision','Tarif kauft keine bessere Matching-Position']}/><LinkButton href="/register?role=provider" secondary={i!==1}>Partner starten</LinkButton></article>)}</div>
  </Section>
  <CtaBand title="Kostenlos starten und später entscheiden." text="Das FREE-Hauskonto kostet 0 € pro Monat. Zusätzlicher Service ist optional." />
</MarketingShell>}
