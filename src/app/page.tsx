import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, BadgeCheck, ChevronRight, CircleCheck, FileText, Hammer, HeartHandshake, Home, Landmark, Leaf, LockKeyhole, MessageCircle, Paintbrush, Plug, ReceiptText, Search, ShieldCheck, Sparkles, ThermometerSun, Trees, UserRound, Wrench } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { MarketingShell } from '@/components/marketing/site-shell';
import { BulletList, CtaBand, Eyebrow, InfoPanel, Section, Split } from '@/components/marketing/ui';
import styles from '@/components/marketing/marketing.module.css';

const services = [
  { icon:<Wrench size={21}/>, title:'Reparatur & Montage', text:'Kleine und größere Arbeiten am Haus' },
  { icon:<Plug size={21}/>, title:'Elektro & Energie', text:'Elektro, Wallbox, PV und Smart Home' },
  { icon:<ThermometerSun size={21}/>, title:'Heizung & Sanitär', text:'Wärme, Wasser, Klima und Wartung' },
  { icon:<Landmark size={21}/>, title:'Dach & Gebäudehülle', text:'Dach, Fenster, Türen und Fassade' },
  { icon:<Paintbrush size={21}/>, title:'Ausbau & Renovierung', text:'Maler, Boden, Schreiner und Sanierung' },
  { icon:<Trees size={21}/>, title:'Garten & Außenbereich', text:'Pflege, Baumarbeiten und Pflaster' },
  { icon:<Leaf size={21}/>, title:'Pflege & Reinigung', text:'Reinigung, Dachrinne und Winterdienst' },
  { icon:<Hammer size={21}/>, title:'Weitere Hausdienste', text:'Umzug, Entrümpelung und Spezialfälle' },
] as const;

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) redirect(user.role === 'provider' ? '/pro' : '/app');

  return <MarketingShell>
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <Eyebrow><Home size={15}/> Eine Anlaufstelle für dein Eigenheim</Eyebrow>
          <h1>Ein Ansprechpartner für <span>alles rund ums Eigenheim.</span></h1>
          <p className={styles.heroLead}>Du beschreibst, was ansteht. Einfach Hausen hilft beim Einordnen, verbindet dich auf Wunsch mit einem passenden Menschen und organisiert den Auftrag, wenn du ihn wirklich vergeben möchtest.</p>
          <form className={styles.intake} action="/register" method="get">
            <input type="hidden" name="role" value="homeowner" />
            <label htmlFor="request">Was steht bei deinem Haus an?</label>
            <div className={styles.intakeRow}>
              <input id="request" name="request" minLength={4} maxLength={700} required placeholder="z. B. Meine Heizung macht ungewöhnliche Geräusche …" />
              <button type="submit">Anliegen starten <ArrowRight size={17}/></button>
            </div>
            <div className={styles.intakeMeta}>
              <span><CircleCheck size={14}/> Hauskonto kostenlos</span>
              <span><CircleCheck size={14}/> unverbindlich starten</span>
              <span><CircleCheck size={14}/> kein Auftrag ohne Entscheidung</span>
            </div>
          </form>
          <div className={styles.heroLinks}><span>Mehr erfahren:</span><Link href="/so-funktionierts">So funktioniert&apos;s</Link><Link href="/leistungen">Leistungen ansehen</Link><Link href="/preise">Preise</Link></div>
        </div>
        <div className={styles.productPreview} aria-label="Produktvorschau Hausmeisterservice">
          <div className={styles.previewHead}><div className={styles.previewMark}><Home size={19}/></div><div><small>Hausmeisterservice</small><strong>Was brauchst du gerade?</strong></div><span className={styles.livePill}>bereit</span></div>
          <div className={styles.previewBody}>
            <div className={styles.userBubble}>Meine Heizung macht seit gestern komische Geräusche. Muss da jemand kommen?</div>
            <div className={styles.assistantBox}><p>Wir helfen dir zuerst beim Einordnen. Danach entscheidest du, wie es weitergeht.</p>
              <div className={styles.choice}><span className={styles.choiceIcon}><MessageCircle size={17}/></span><span><strong>Frage klären</strong><small>Erst verstehen, was sinnvoll ist</small></span><ChevronRight size={16}/></div>
              <div className={styles.choice}><span className={styles.choiceIcon}><UserRound size={17}/></span><span><strong>Ansprechpartner finden</strong><small>Mit einem passenden Menschen sprechen</small></span><ChevronRight size={16}/></div>
              <div className={`${styles.choice} ${styles.choiceFeatured}`}><span className={styles.choiceIcon}><Wrench size={17}/></span><span><strong>Auftrag organisieren</strong><small>Angebote, Termin und Ausführung</small></span><ChevronRight size={16}/></div>
            </div>
          </div>
          <div className={styles.previewFoot}><LockKeyhole size={14}/> Du entscheidest. Nichts wird automatisch beauftragt.</div>
        </div>
      </div>
    </section>

    <div className={styles.trustBar}><div className={styles.trustBarInner}>
      <div className={styles.trustItem}><BadgeCheck size={20}/><div><strong>Geprüfte Vertragspartner</strong><small>Kein offener Lead-Marktplatz</small></div></div>
      <div className={styles.trustItem}><ShieldCheck size={20}/><div><strong>Matching nach Eignung</strong><small>Tarife kaufen keine bessere Platzierung</small></div></div>
      <div className={styles.trustItem}><UserRound size={20}/><div><strong>Konkrete Ansprechpartner</strong><small>Menschen und Beziehungen bleiben sichtbar</small></div></div>
      <div className={styles.trustItem}><FileText size={20}/><div><strong>Digitale Hausakte</strong><small>Hauswissen bleibt langfristig geordnet</small></div></div>
    </div></div>

    <Section eyebrow="Leistungen" title="Vom kleinen Defekt bis zur langfristigen Hauspflege." text="Du musst nicht zuerst wissen, welches Gewerk zuständig ist. Starte mit deinem Anliegen – die fachliche Einordnung kommt danach." tone="soft">
      <div className={styles.serviceGrid}>{services.map((item)=><Link className={styles.serviceItem} href="/leistungen" key={item.title}><span>{item.icon}</span><div><strong>{item.title}</strong><span>{item.text}</span></div></Link>)}</div>
      <Link className={styles.textLink} href="/leistungen">Alle Leistungsbereiche ansehen <ArrowRight size={15}/></Link>
    </Section>

    <Section eyebrow="Für Eigenheimbesitzer" title="Weniger suchen. Weniger hinterherlaufen. Mehr Überblick." text="Einfach Hausen bündelt die Organisation, ohne dir die Entscheidung abzunehmen.">
      <div className={styles.processList}>
        {[['01','Beschreiben','Schreib, sprich oder zeig per Foto, was ansteht.'],['02','Einordnen','Das Anliegen wird verständlich strukturiert und der nächste sinnvolle Schritt vorbereitet.'],['03','Entscheiden','Du wählst bewusst: Frage klären, Ansprechpartner finden oder Auftrag organisieren.'],['04','Behalten','Kontakte, Dokumente, Termine und erledigte Arbeiten landen in deiner Hausakte.']].map(([n,t,x])=><article className={styles.processStep} key={n}><b>{n}</b><h3>{t}</h3><p>{x}</p></article>)}
      </div>
      <Link className={styles.textLink} href="/so-funktionierts">Den ganzen Ablauf ansehen <ArrowRight size={15}/></Link>
    </Section>

    <Section eyebrow="Mein Haus" title="Die Hausakte wird mit jedem erledigten Thema wertvoller." text="Nicht nur der nächste Auftrag zählt. Technik, Historie, Dokumente, Wartungen und Ansprechpartner wachsen zu einem dauerhaften Gedächtnis deiner Immobilie." tone="green">
      <Split>
        <InfoPanel label="Digitale Hausakte"><h3>Alles, was später wieder wichtig wird.</h3><BulletList items={['Arbeiten und Sanierungen dokumentieren','Rechnungen, Belege und Garantien wiederfinden','Technik und Anlagen am Haus erfassen','Persönliche Ansprechpartner nach Bereichen behalten','Hausbezogene Historie bei Eigentümerwechsel kontrolliert weitergeben']} /><Link className={styles.textLink} href="/hausakte">Hausakte kennenlernen <ArrowRight size={15}/></Link></InfoPanel>
        <div className={styles.previewCard}><div className={styles.previewCardHead}><strong>Mein Haus · Beispielansicht</strong><span>geordnet</span></div><div className={styles.timeline}>
          <div className={styles.timelineRow}><time>2026</time><span className={styles.timelineDot}/><div className={styles.timelineContent}><strong>Gartenpflege</strong><small>Ansprechpartner und Rechnung abgelegt</small></div></div>
          <div className={styles.timelineRow}><time>2025</time><span className={styles.timelineDot}/><div className={styles.timelineContent}><strong>Dacharbeiten</strong><small>Dokumentation und Garantiehinweis gespeichert</small></div></div>
          <div className={styles.timelineRow}><time>2024</time><span className={styles.timelineDot}/><div className={styles.timelineContent}><strong>Heizung</strong><small>Anlage erfasst · Wartung planbar</small></div></div>
        </div></div>
      </Split>
    </Section>

    <Section eyebrow="Für Betriebe" title="Gute Kundenbeziehungen statt Lead-Handel." text="Partner erhalten passende Anfragen, arbeiten mit konkreten Ansprechpartnern und behalten 100 % ihres Auftragswertes. Einfach Hausen finanziert sich über planbare Partnertarife – nicht über Auftragsprovision." tone="dark">
      <div className={styles.featureGrid}>
        <article className={styles.feature}><div className={styles.featureIcon}><HeartHandshake size={20}/></div><h3>0 % Auftragsprovision</h3><p>Keine Gebühr pro ausgeführtem Auftrag. Der Partner bleibt Rechnungssteller seiner Leistung.</p></article>
        <article className={styles.feature}><div className={styles.featureIcon}><Search size={20}/></div><h3>Qualität vor Tarif</h3><p>Bezahlte Tarife kaufen keine bessere Position im Matching. Eignung und Qualität bleiben entscheidend.</p></article>
        <article className={styles.feature}><div className={styles.featureIcon}><Sparkles size={20}/></div><h3>Einfacher Arbeitsbereich</h3><p>Anfragen, Team, Termine, Dokumente und Rechnungen – ohne unnötige ERP-Komplexität.</p></article>
      </div>
      <div className={styles.heroActions}><Link className={styles.primaryButton} href="/partner">Partner-Modell ansehen <ArrowRight size={16}/></Link><Link className={styles.secondaryButton} href="/preise">Partnerpreise</Link></div>
    </Section>

    <Section eyebrow="Preise" title="Kostenlos anfangen. Mehr Service nur, wenn du ihn brauchst." text="Das Kunden-Hauskonto startet bei 0 €. Für Partner gibt es ein kostenloses Modell und planbare Monatstarife." tone="soft">
      <Split><InfoPanel label="Eigenheimbesitzer"><h3>FREE · 0 € / Monat</h3><p>Hausmeisterservice, Aufträge, Angebotsvergleich, Vermittlung und digitale Hausakte bilden den kostenlosen Einstieg.</p><Link className={styles.textLink} href="/preise">Kundentarife vergleichen <ArrowRight size={15}/></Link></InfoPanel><InfoPanel label="Partner"><h3>0 % Provision pro Auftrag</h3><p>FREE startet bei 0 €. Bezahlte Partner-Tarife beginnen laut Produktmodell bei 29 € / Monat.</p><Link className={styles.textLink} href="/preise">Partnertarife vergleichen <ArrowRight size={15}/></Link></InfoPanel></Split>
    </Section>

    <Section eyebrow="Hilfe & Sicherheit" title="Ein vollständiges Produkt braucht klare Antworten – auch außerhalb eines Auftrags." text="Hilfe, Kontaktwege, Sicherheitsprinzipien und rechtliche Informationen sind Teil der Plattformstruktur.">
      <div className={styles.featureGrid}>
        <article className={styles.feature}><div className={styles.featureIcon}><MessageCircle size={20}/></div><h3>Hilfe & FAQ</h3><p>Antworten zum Ablauf, zu Ansprechpartnern, Aufträgen, Hausakte und Partnern.</p><Link className={styles.textLink} href="/hilfe">Zur Hilfe <ArrowRight size={14}/></Link></article>
        <article className={styles.feature}><div className={styles.featureIcon}><ShieldCheck size={20}/></div><h3>Sicherheitsprinzipien</h3><p>Bewusste Freigaben, kontrollierter Zugriff und keine automatische Beauftragung.</p><Link className={styles.textLink} href="/sicherheit">Mehr zur Sicherheit <ArrowRight size={14}/></Link></article>
        <article className={styles.feature}><div className={styles.featureIcon}><ReceiptText size={20}/></div><h3>Transparente Modelle</h3><p>Kunden- und Partnerpreise werden getrennt und nachvollziehbar dargestellt.</p><Link className={styles.textLink} href="/preise">Preise ansehen <ArrowRight size={14}/></Link></article>
      </div>
    </Section>

    <CtaBand title="Beim nächsten Thema nicht wieder von vorne anfangen." text="Lege dein Hauskonto kostenlos an und beschreibe einfach, was bei deinem Eigenheim ansteht." />
  </MarketingShell>;
}
