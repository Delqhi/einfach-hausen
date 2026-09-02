import type { Metadata } from 'next';
import Image from 'next/image';
import { MessageCircle, ShieldCheck, UserRound, Wrench } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/site-shell';
import { CtaBand, FeatureGrid, LinkButton, PageHero, Section, Statement } from '@/components/marketing/ui';
import { Reveal } from '@/components/marketing/motion';
import { HeroChoices } from '@/components/marketing/hero-visuals';
import styles from '@/components/marketing/marketing.module.css';
import premium from '@/components/marketing/premium.module.css';

export const metadata: Metadata = { title: "So funktioniert's", description: 'So wird aus einem Anliegen ein klarer nächster Schritt – ohne automatische Beauftragung.' };

const story = [
  { img:'/images/premium/story-beschreiben.jpg', kicker:'Schritt 1 · Beschreiben', title:'Sag einfach, was ansteht.', text:'Schreib, sprich oder zeig per Foto, was an deinem Haus los ist. Die fachliche Einordnung übernehmen wir – ohne Kategorienwand und ohne Fachchinesisch.' },
  { img:'/images/premium/story-ansprechpartner.jpg', kicker:'Schritt 2 · Der passende Mensch', title:'Ein konkreter Ansprechpartner.', text:'Geprüfte Vertragspartner aus deiner Region statt anonymer Marktplatz-Anfragen. Du entscheidest, ob du erst sprichst oder direkt beauftragst.' },
];


export default function Page(){return <MarketingShell>
  <PageHero eyebrow="So funktioniert's" title="Du beschreibst das Problem. Du entscheidest den nächsten Schritt." text="Einfach Hausen beginnt nicht mit einer Kategorienwand. Du sagst in normalen Worten, was an deinem Haus los ist – und entscheidest erst nach der Einordnung, was daraus werden soll." aside={<HeroChoices />} actions={<><LinkButton href="/register?role=homeowner">Anliegen starten</LinkButton><LinkButton href="/leistungen" secondary>Leistungen ansehen</LinkButton></>} />
  <Section eyebrow="Der Ablauf" title="Vier Schritte, die sich wie einer anfühlen." text="Die Organisation im Hintergrund darf komplex sein. Für dich bleibt der Weg klar.">
    <div className={styles.stepCards}>{[
      ['1','Beschreiben','Text, Foto oder Sprache: Du startest so, wie du das Problem selbst erklären würdest.','Hausanliegen'],
      ['2','Einordnen','Relevante Hausdaten können helfen. Fehlt etwas Wichtiges, folgt eine gezielte Rückfrage statt eines langen Formulars.','Was wichtig ist'],
      ['3','Entscheiden','Nur Rat, ein passender Mensch zum Sprechen oder ein echter Auftrag - du wählst.','Bewusst wählen'],
      ['4','Behalten','Bei einem Auftrag werden passende Partner, Angebote, Termine, Dokumente und der konkrete Ansprechpartner gebündelt.','Alles in der Akte'],
    ].map(([n,t,x,sub])=>
      <article className={styles.stepCard} key={n}>
        <span className={styles.stepCardNum}>{n}</span>
        <h3>{t}</h3>
        <p>{x}</p>
        <span className={styles.stepCardVisual}><span className={styles.stepCardChip}>{sub}</span></span>
      </article>
    )}</div>
  </Section>
  <Statement kicker="Das Prinzip" tone="soft">Eine Frage ist noch kein Auftrag.</Statement>
  <Section eyebrow="In echt" title="So sieht das im Alltag aus." text="Keine Formularstrecke, keine Warteschleife. Zwei Momente, wie sie auf deinem Handy aussehen.">
    <div className={premium.storyCol}>
      {story.map((s,i)=>(
        <Reveal key={s.kicker}>
          <article className={`${premium.storyRow} ${i%2 ? premium.storyFlip : ''}`}>
            <span className={premium.storyImg}><Image src={s.img} alt="" fill sizes="460px"/></span>
            <span className={premium.storyBody}>
              <span className={premium.storyKicker}>{s.kicker}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </span>
          </article>
        </Reveal>
      ))}
    </div>
  </Section>
  <Section eyebrow="Drei Wege" title="Drei bewusste Wege statt einer Formularstrecke." text="Beratung, persönlicher Kontakt und Beauftragung sind getrennte Entscheidungen – du gehst jeden Weg nur, wenn du es willst." tone="soft">
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
