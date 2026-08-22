import type { Metadata } from 'next';
import { MessageCircle, ShieldCheck, UserRound, Wrench } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/site-shell';
import { CtaBand, FeatureGrid, PageHero, Section } from '@/components/marketing/ui';
import styles from '@/components/marketing/marketing.module.css';

export const metadata: Metadata = { title: "So funktioniert's", description: 'So wird aus einem Anliegen ein klarer nächster Schritt – ohne automatische Beauftragung.' };

export default function Page(){return <MarketingShell>
  <PageHero eyebrow="So funktioniert's" title="Du beschreibst das Problem. Du entscheidest den nächsten Schritt." text="Einfach Hausen beginnt nicht mit einer Kategorienwand. Du sagst in normalen Worten, was an deinem Haus los ist – und entscheidest erst nach der Einordnung, was daraus werden soll." />
  <Section eyebrow="Der Ablauf" title="Vier Schritte, die sich wie einer anfühlen." text="Die Organisation im Hintergrund darf komplex sein. Für dich bleibt der Weg klar.">
    <div className={styles.processList}>{[
      ['01','Anliegen beschreiben','Text, Foto oder Sprache: Du startest so, wie du das Problem selbst erklären würdest.'],
      ['02','Sinnvoll einordnen','Relevante Hausdaten können helfen. Fehlt etwas Wichtiges, folgt eine gezielte Rückfrage statt eines langen Formulars.'],
      ['03','Bewusst entscheiden','Nur Rat, einen passenden Menschen sprechen oder einen echten Auftrag organisieren lassen.'],
      ['04','Alles zusammenhalten','Bei einem Auftrag werden passende Partner, Angebote, Termine, Dokumente und der konkrete Ansprechpartner gebündelt.'],
    ].map(([n,t,x])=><article className={styles.processStep} key={n}><b>{n}</b><h3>{t}</h3><p>{x}</p></article>)}</div>
  </Section>
  <Section eyebrow="Drei Wege" title="Eine Frage ist noch kein Auftrag." text="Das Produkt trennt Beratung, persönlichen Kontakt und Beauftragung bewusst voneinander." tone="soft">
    <FeatureGrid items={[
      {icon:<MessageCircle size={20}/>,title:'Frage klären',text:'Zuerst verstehen, was wahrscheinlich sinnvoll ist. Dabei entsteht noch kein Auftrag.'},
      {icon:<UserRound size={20}/>,title:'Ansprechpartner finden',text:'Ein passender geprüfter Partner kann als konkreter Mensch für Fragen verbunden werden – auch ohne Buchungszwang.'},
      {icon:<Wrench size={20}/>,title:'Auftrag organisieren',text:'Wenn du die Arbeit wirklich erledigen lassen willst, werden Auftragsdaten vervollständigt und passende Partner angefragt.'},
    ]}/>
  </Section>
  <Section eyebrow="Matching" title="Passend soll wichtiger sein als laut." text="Im Qualitätsmodell zählen fachliche Eignung, Region, Verfügbarkeit, Kapazität, Kundenzufriedenheit und bestehende Beziehungen. Ein Partner-Tarif darf die fachliche Reihenfolge nicht kaufen." tone="green">
    <FeatureGrid items={[{icon:<ShieldCheck size={20}/>,title:'Geprüfte Vertragspartner',text:'Das Netzwerk ist kein offenes Firmenverzeichnis. Partner werden vor aktiver Vermittlung geprüft und vertraglich gebunden.'},{icon:<UserRound size={20}/>,title:'Konkrete Menschen',text:'Nach einer Verbindung oder Buchung bleibt der Ansprechpartner in der Hausakte sichtbar und kann für spätere Themen wieder genutzt werden.'},{icon:<Wrench size={20}/>,title:'Auftrag bleibt transparent',text:'Angebote, Termin, Dokumente, Rechnung und Status gehören zum selben Vorgang statt in getrennte Chats und E-Mails.'}]}/>
  </Section>
  <CtaBand title="Starte mit dem Problem, nicht mit dem Gewerk." text="Das Hauskonto ist im FREE-Modell kostenlos und ein Anliegen löst nicht automatisch einen Auftrag aus." />
</MarketingShell>}
