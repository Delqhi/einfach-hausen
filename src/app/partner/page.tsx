import type { Metadata } from 'next';
import { BadgeCheck, BriefcaseBusiness, Building2, Handshake, ReceiptText, UsersRound } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/site-shell';
import { Statement } from '@/components/marketing/ui';
import { BulletList, CtaBand, FeatureGrid, InfoPanel, LinkButton, PageHero, Section, Split } from '@/components/marketing/ui';
import { HeroEditorialPhoto } from '@/components/marketing/hero-visuals';
import styles from '@/components/marketing/marketing.module.css';

export const metadata: Metadata = { title: 'Für Betriebe', description: 'Partnernetzwerk für regionale Betriebe: passende Anfragen, direkter Kundenkontakt und 0 % Auftragsprovision.' };
export default function Page(){return <MarketingShell>
  <PageHero eyebrow="Für Betriebe" title="Passende Anfragen. Persönlicher Kundenkontakt. 0 % Provision." text="Einfach Hausen ist kein offener Lead-Marktplatz. Geprüfte und vertraglich gebundene Unternehmen arbeiten in einem regionalen Qualitätsnetzwerk mit planbaren Monatstarifen." aside={<HeroEditorialPhoto src="/images/premium/story-ansprechpartner.jpg" label="0 % Auftragsprovision" detail="Der ausführende Betrieb bleibt Rechnungssteller." />} actions={<><LinkButton href="/register?role=provider">Als Partner starten</LinkButton><LinkButton href="/preise" secondary>Partnerpreise</LinkButton></>} />
  <Statement kicker="Das Modell" tone="soft">Du bleibst Rechnungssteller. Wir sind deine Organisations-Ebene.</Statement>
  <Section eyebrow="Das Modell" title="Auftragswert bleibt beim Betrieb." text="Einfach Hausen monetarisiert Partner über Monatsabos, nicht über eine Gebühr pro Auftrag.">
    <FeatureGrid items={[{icon:<ReceiptText size={20}/>,title:'0 % Auftragsprovision',text:'Der ausführende Betrieb bleibt Rechnungssteller und behält 100 % des Auftragswertes.'},{icon:<Handshake size={20}/>,title:'Kundenbeziehung statt Lead-Verkauf',text:'Nach einer Verbindung kann ein konkreter Ansprechpartner dauerhaft beim Haus des Kunden gespeichert bleiben.'},{icon:<BriefcaseBusiness size={20}/>,title:'Einfacher Arbeitsbereich',text:'Anfragen, Termine, Team, Dokumentation und Rechnung – mit möglichst wenig Verwaltungsballast.'}]}/>
  </Section>
  <Section id="qualitaet" eyebrow="Qualitätsnetzwerk" title="Nicht jeder Eintrag wird automatisch Partner." text="Vor aktiver Vermittlung sieht das Produktmodell eine Mindestprüfung und einen aktiven Partnervertrag vor." tone="soft">
    <Split><InfoPanel label="Mindestprüfung"><h3>Qualifikation und Betrieb müssen zum Einsatz passen.</h3><BulletList items={['Gewerbe / Unternehmen','Erforderliche Qualifikationen und Zulassungen','Betriebshaftpflicht','Referenzen bzw. vorhandene Bewertungen','Einsatzregion und Kapazität','Kommunikations- und Qualitätsstandard','Aktiver Partnervertrag']} /></InfoPanel><InfoPanel label="Matching"><h3>Tarife kaufen keine bessere fachliche Position.</h3><p>Beim Matching sollen unter anderem Entfernung, Fachgebiet, Qualifikation, Verfügbarkeit, Kapazität, Kundenzufriedenheit und bestehende Kundenbeziehungen berücksichtigt werden.</p><BulletList items={['Qualität vor Monetarisierung','Regionale Eignung statt Massenverteilung','Bestehende Kundenbeziehungen können berücksichtigt werden']} /></InfoPanel></Split>
  </Section>
  <Section id="partner-app" eyebrow="Team" title="Ein Firmenkonto. Mehrere Menschen. Eine zentrale Berechtigung." text="Das Partnerprodukt soll in wenigen Minuten verständlich sein und bewusst keine komplexe Rollenmatrix aufbauen." tone="green">
    <FeatureGrid items={[{icon:<Building2 size={20}/>,title:'Ein professionelles Konto',text:'Ein Anbieter kann mehrere Tätigkeiten und konkrete Leistungen im selben Firmenkonto führen.'},{icon:<UsersRound size={20}/>,title:'Mehrere Ansprechpartner',text:'Mitarbeitende erhalten eigenen App-Zugang und können ihren zugewiesenen Kundenkontakt pflegen.'},{icon:<BadgeCheck size={20}/>,title:'Aufträge verwalten AN / AUS',text:'Die zentrale Berechtigung steuert, ob jemand neue Anfragen und Zuweisungen verwalten darf oder nur eigene Aufträge sieht.'}]}/>
  </Section>
  <Section eyebrow="Tarife" title="FREE bis PREMIUM – ohne Einfluss auf die Matching-Qualität." text="FREE startet bei 0 €. START, PRO und PREMIUM sind laut Produktmodell monatlich planbar und beginnen mit einer zweimonatigen kostenlosen Testphase.">
    <div className={styles.heroActions}><LinkButton href="/preise">Tarife vergleichen</LinkButton></div>
  </Section>
  <CtaBand title="Partner werden, ohne pro Auftrag abzugeben." text="Starte die Registrierung für deinen Betrieb. Die aktive Vermittlung setzt Prüfung und Partnerstatus voraus." href="/register?role=provider" label="Partnerkonto starten" />
</MarketingShell>}
