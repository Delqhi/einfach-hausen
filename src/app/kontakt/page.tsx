import type { Metadata } from 'next';
import { HelpCircle, LogIn, MessageCircle } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/site-shell';
import { FeatureGrid, LegalNotice, LinkButton, PageHero, Section } from '@/components/marketing/ui';
import styles from '@/components/marketing/marketing.module.css';

export const metadata: Metadata = { title: 'Kontakt', description: 'Kontakt- und Support-Einstieg für Einfach Hausen.' };
export default function Page(){return <MarketingShell>
  <PageHero eyebrow="Kontakt" title="Der richtige Weg hängt davon ab, worum es geht." text="Für konkrete Hausanliegen ist der Hausmeisterservice der schnellste Einstieg. Allgemeine Hilfe und bestehende Konten haben eigene Wege." />
  <Section eyebrow="Kontaktwege" title="Start dort, wo dein Kontext schon vorhanden ist.">
    <FeatureGrid items={[{icon:<MessageCircle size={20}/>,title:'Neues Hausanliegen',text:'Kostenloses Hauskonto anlegen und das Problem direkt beschreiben.'},{icon:<LogIn size={20}/>,title:'Bestehendes Konto',text:'Einloggen und den vorhandenen Vorgang, Auftrag oder Ansprechpartner nutzen.'},{icon:<HelpCircle size={20}/>,title:'Allgemeine Fragen',text:'Die Hilfe erklärt Ablauf, Preise, Hausakte und Partnernetzwerk.'}]}/>
    <div className={styles.heroActions}><LinkButton href="/register?role=homeowner">Anliegen starten</LinkButton><LinkButton href="/login" secondary>Einloggen</LinkButton><LinkButton href="/hilfe" secondary>Hilfe öffnen</LinkButton></div>
  </Section>
  <Section eyebrow="Öffentliche Kontaktdaten" title="Keine erfundenen Angaben." tone="soft" text="Eine geschäftliche Kontaktadresse darf erst veröffentlicht werden, wenn sie als offizielle Anbieterangabe verifiziert ist.">
    <LegalNotice title="Launch-Blocker: verifizierte Kontaktdaten fehlen"><p>Im Repository sind derzeit keine verifizierte öffentliche E-Mail-Adresse, Telefonnummer oder ladungsfähige Geschäftsanschrift für Einfach Hausen dokumentiert. Diese Angaben müssen vor öffentlicher Veröffentlichung dieser Kontaktseite ergänzt werden.</p></LegalNotice>
  </Section>
</MarketingShell>}
