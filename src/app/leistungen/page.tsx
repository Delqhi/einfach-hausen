import type { Metadata } from 'next';
import Link from 'next/link';
import { Bug, Droplets, Hammer, Home, Leaf, Paintbrush, Plug, Shield, Snowflake, Sparkles, ThermometerSun, Trees } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/site-shell';
import { CtaBand, LinkButton, PageHero, Section, Statement } from '@/components/marketing/ui';
import { HeroCategoryGallery } from '@/components/marketing/hero-visuals';
import styles from '@/components/marketing/marketing.module.css';

export const metadata: Metadata = { title: 'Leistungen', description: 'Leistungsbereiche rund ums Eigenheim – von Reparatur und Garten bis Energie, Wartung und Sanierung.' };
const groups=[
  {icon:<Home size={22}/>,title:'Haus & Technik',text:'Kleinere Reparaturen, Montage und technische Anliegen'},
  {icon:<Plug size={22}/>,title:'Elektro & Smart Home',text:'Elektroarbeiten, Wallbox, Sicherheit und Gebäudeautomation'},
  {icon:<ThermometerSun size={22}/>,title:'Heizung, Klima & Energie',text:'Heizung, Wärmepumpe, Klima, Energieberatung und Wartung'},
  {icon:<Droplets size={22}/>,title:'Sanitär & Wasser',text:'Sanitärarbeiten, Leitungen, Armaturen und wasserbezogene Probleme'},
  {icon:<Hammer size={22}/>,title:'Dach, Fenster & Türen',text:'Dach, Dachrinne, Fenster, Türen, Schlosser und Gebäudehülle'},
  {icon:<Paintbrush size={22}/>,title:'Innenausbau & Sanierung',text:'Maler, Schreiner, Boden, Renovierung und Sanierungsarbeiten'},
  {icon:<Trees size={22}/>,title:'Garten & Außenbereich',text:'Gartenpflege, Heckenschnitt, Baumarbeiten und Pflasterarbeiten'},
  {icon:<Leaf size={22}/>,title:'Reinigung & Pflege',text:'Hausreinigung, PV-Reinigung, Dachrinne und laufende Pflege'},
  {icon:<Snowflake size={22}/>,title:'Saisonale Dienste',text:'Winterdienst und wiederkehrende Aufgaben rund ums Grundstück'},
  {icon:<Bug size={22}/>,title:'Spezialfälle',text:'Schädlingsbekämpfung und weitere qualifikationsabhängige Dienste'},
  {icon:<Sparkles size={22}/>,title:'Umzug & Entrümpelung',text:'Unterstützung beim Räumen, Umzug und objektbezogenen Dienstleistungen'},
  {icon:<Shield size={22}/>,title:'Beratung & dringende Fälle',text:'Passende Ansprechpartner für fachliche Fragen oder dringenden Unterstützungsbedarf'},
] as const;
export default function Page(){return <MarketingShell>
  <PageHero eyebrow="Leistungen" title="Du musst das Gewerk nicht kennen. Das Problem reicht." text="Die Kategorien helfen bei der Orientierung – dein Einstieg bleibt trotzdem das konkrete Anliegen. Umfang und Verfügbarkeit hängen vom regional aktiven Partnernetzwerk ab." aside={<HeroCategoryGallery />} actions={<LinkButton href="/register?role=homeowner">Anliegen starten</LinkButton>} />
  <Section eyebrow="Leistungsbereiche" title="Breit genug für den Alltag eines Eigenheims." text="Die Plattform ist auf unterschiedliche Haus- und Grundstücksthemen ausgelegt. Nicht jede Leistung ist in jeder Region jederzeit verfügbar.">
    <div className={styles.catCardGrid}>{groups.map(x=>
      <Link className={styles.catCard} href="/register?role=homeowner" key={x.title} aria-label={`${x.title}: Anliegen starten`}>
        <span className={styles.catCardIcon}>{x.icon}</span>
        <span className={styles.catCardBody}><strong>{x.title}</strong><span className={styles.catCardText}>{x.text}</span></span>
        <span className={styles.catCardArrow} aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></span>
      </Link>
    )}</div>
  </Section>
  <Statement kicker="So startest du" tone="green">Erst das Anliegen. Dann die Lösung.</Statement>
  <Section eyebrow="So startest du" title="Nicht durchklicken. Beschreiben." text="Einfach Hausen soll zuerst verstehen, was tatsächlich ansteht, und erst danach die passenden nächsten Schritte zeigen." tone="soft">
    <div className={styles.processList}>{[['01','Anliegen schildern','Ein Satz genügt zum Start. Fotos oder weitere Angaben kommen nur hinzu, wenn sie helfen.'],['02','Details klären','Nötige Informationen werden schrittweise ergänzt statt in einem langen Formular abgefragt.'],['03','Weg wählen','Beratung, persönlicher Ansprechpartner oder organisierter Auftrag bleiben getrennte Entscheidungen.'],['04','Regional vermitteln','Bei einem Auftrag werden passende aktive Vertragspartner aus dem verfügbaren Netzwerk berücksichtigt.']].map(([n,t,x])=><article className={styles.processStep} key={n}><b>{n}</b><h3>{t}</h3><p>{x}</p></article>)}</div>
  </Section>
  <CtaBand title="Sag einfach, was an deinem Haus ansteht." text="Du musst vor dem Start nicht wissen, welche Kategorie oder welcher Betrieb zuständig ist." />
</MarketingShell>}
