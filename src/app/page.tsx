import { redirect } from 'next/navigation';
import { ArrowRight, BadgeCheck, CalendarCheck2, ChevronDown, CircleCheck, FileText, Hammer, HeartHandshake, Home, Landmark, Leaf, MessageCircle, Paintbrush, Plug, Search, ShieldCheck, Sparkles, ThermometerSun, Trees, UserRound, Wrench } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { MarketingShell } from '@/components/marketing/site-shell';
import { Section, Split, InfoPanel, BulletList, CtaBand, LinkButton, Statement } from '@/components/marketing/ui';
import Link from 'next/link';
import { GatewaySection } from '@/components/marketing/gateway-section';
import { Reveal, Stagger, ScrubLine, Activate, DrawPath, SplitLines } from '@/components/marketing/motion';
import { IntakeForm } from '@/components/home/intake-form';
import styles from '@/components/marketing/marketing.module.css';

const services = [
  { icon:<Wrench size={20}/>, title:'Reparatur & Montage', text:'Kleine und größere Arbeiten am Haus' },
  { icon:<Plug size={20}/>, title:'Elektro & Energie', text:'Elektro, Wallbox, PV und Smart Home' },
  { icon:<ThermometerSun size={20}/>, title:'Heizung & Sanitär', text:'Wärme, Wasser, Klima und Wartung' },
  { icon:<Landmark size={20}/>, title:'Dach & Gebäudehülle', text:'Dach, Fenster, Türen und Fassade' },
  { icon:<Paintbrush size={20}/>, title:'Ausbau & Renovierung', text:'Maler, Boden, Schreiner und Sanierung' },
  { icon:<Trees size={20}/>, title:'Garten & Außenbereich', text:'Pflege, Baumarbeiten und Pflaster' },
  { icon:<Leaf size={20}/>, title:'Pflege & Reinigung', text:'Reinigung, Dachrinne und Winterdienst' },
  { icon:<Hammer size={20}/>, title:'Weitere Hausdienste', text:'Umzug, Entrümpelung und Spezialfälle' },
] as const;

const steps = [
  ['01','Beschreiben','Schreib, sprich oder zeig per Foto, was ansteht.'],
  ['02','Einordnen','Das Anliegen wird verständlich strukturiert und der nächste sinnvolle Schritt vorbereitet.'],
  ['03','Entscheiden','Du wählst bewusst: Frage klären, Ansprechpartner finden oder Auftrag organisieren.'],
  ['04','Behalten','Kontakte, Dokumente, Termine und erledigte Arbeiten landen in deiner Hausakte.'],
] as const;

const faqs = [
  ['Was kostet Einfach Hausen?','Das Hauskonto für Eigentümer startet kostenlos (FREE). Du bezahlst keine Provision auf Aufträge. Planbare Zusatzleistungen und Partnertarife findest du unter Preise.'],
  ['Wird automatisch ein Auftrag beauftragt?','Nein. Du wählst bewusst: erst die Frage klären, einen passenden Menschen sprechen oder einen Auftrag organisieren lassen. Ohne deine Entscheidung passiert nichts.'],
  ['Wer arbeitet an meinem Haus?','Geprüfte Vertragspartner aus deiner Region. Du bekommst konkrete Ansprechpartner statt anonymer Firmen. Das Matching folgt fachlicher Eignung und Qualität – nicht dem höchsten Tarif.'],
  ['Was ist die digitale Hausakte?','Das dauerhafte Gedächtnis deines Hauses: Technik, Dokumente, Garantien, Wartungen, Kontakte und Historie – geordnet an einem Ort und bei einem Eigentümerwechsel kontrolliert übertragbar.'],
  ['Was passiert mit meinen Daten?','Private App-Inhalte werden nicht als Offline-Kopie gespeichert und Zugriffe bleiben kontrolliert. Die Sicherheitsprinzipien erklären das in verständlicher Sprache.'],
  ['Ich bin Handwerks- oder Dienstleistungsbetrieb. Kann ich mitmachen?','Ja. Partner erhalten passende Anfragen, behalten 100 % ihres Auftragswertes und zahlen keine Auftragsprovision. Alles zum Partnernetzwerk findest du unter Für Betriebe.'],
] as const;

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) redirect(user.role === 'provider' ? '/pro' : '/app');

  return <MarketingShell>
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <Stagger className={styles.heroCopy} gap={0.12}>
          <a href="/pilotphase" className={styles.pilotBanner}>
            <span className={styles.pilotBannerTag}>Pilotphase startet</span>
            <span className={styles.pilotBannerText}>Die ersten 1.000 Haushalte sichern sich 15% Dauer-Vorteil auf alle Pakete</span>
            <ArrowRight size={15} aria-hidden="true" />
          </a>
          <span className={styles.heroBadgeRow}>
            <span className={styles.heroBadge}><CircleCheck size={15} aria-hidden="true"/> Geprüfte Partner</span>
            <span className={styles.heroBadge}><Home size={15} aria-hidden="true"/> Digitale Hausakte</span>
            <span className={styles.heroBadge}><UserRound size={15} aria-hidden="true"/> Persönlicher Ansprechpartner</span>
          </span>
          <SplitLines className={styles.heroH1}>Du hast ein Haus. <span className={styles.heroAccent}>Wir kümmern uns&nbsp;<span className={styles.underlineSlot}>um den Rest.<DrawPath className={styles.heroUnderlineWrap}><svg viewBox="0 0 320 14" preserveAspectRatio="none" className={styles.heroUnderline} aria-hidden="true"><path d="M4 10 C 80 3, 240 3, 316 8" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/></svg></DrawPath></span></span></SplitLines>
          <p className={styles.heroLead}>Weniger kümmern, mehr zuhause sein: <strong>Einfach Hausen bündelt alles rund ums Eigenheim.</strong> Beschreibe, was ansteht – wir helfen beim Einordnen, verbinden dich mit passenden Menschen und organisieren Aufträge, wenn du sie wirklich vergibst.</p>
          <IntakeForm />
          <Link href="/hausakte" className={styles.heroAkteStrip} aria-label="So sieht deine digitale Hausakte aus – zur Hausakte-Seite">
            <span className={styles.heroAkteIcon}><Home size={19} aria-hidden="true"/></span>
            <span className={styles.heroAkteCopy}><strong>So sieht deine Hausakte aus.</strong><small>Technik, Dokumente und Ansprechpartner – geordnet an einem Ort.</small></span>
            <ArrowRight size={17} className={styles.heroAkteArrow} aria-hidden="true"/>
          </Link>
          <div className={styles.heroLinks}><span>Mehr erfahren:</span><a href="/so-funktionierts">So funktioniert&apos;s</a><a href="/leistungen">Leistungen ansehen</a><a href="/preise">Preise</a></div>
        </Stagger>
        <Reveal delay={0.25} y={34} className={styles.productPreviewWrap}>
          <Link href="/register?role=homeowner" className={styles.heroMockLink} aria-label="Produktvorschau: kostenloses Hauskonto erstellen">
            <span className={styles.heroMockStage}>
            <div className={styles.productPreview} aria-label="Produktvorschau Hausmeisterservice">
            <div className={styles.previewHead}><div className={styles.previewMark}><Home size={19} aria-hidden="true"/></div><div><small>Hausmeisterservice</small><strong>Was brauchst du gerade?</strong></div><span className={styles.livePill}>bereit</span></div>
            <div className={styles.previewBody}>
              <div className={styles.userBubble}>Meine Heizung macht seit gestern komische Geräusche. Muss da jemand kommen?</div>
              <div className={styles.assistantBox}><p>Wir helfen dir zuerst beim Einordnen. Danach entscheidest du, wie es weitergeht.</p>
                <div className={styles.choice}><span className={styles.choiceIcon}><MessageCircle size={17} aria-hidden="true"/></span><span><strong>Frage klären</strong><small>Erst verstehen, was sinnvoll ist</small></span></div>
                <div className={styles.choice}><span className={styles.choiceIcon}><UserRound size={17} aria-hidden="true"/></span><span><strong>Ansprechpartner finden</strong><small>Mit einem passenden Menschen sprechen</small></span></div>
                <div className={`${styles.choice} ${styles.choiceFeatured}`}><span className={styles.choiceIcon}><Wrench size={17} aria-hidden="true"/></span><span><strong>Auftrag organisieren</strong><small>Angebote, Termin und Ausführung</small></span></div>
              </div>
            </div>
            <div className={styles.previewFoot}>Du entscheidest. Nichts wird automatisch beauftragt.</div>
            <div className={`${styles.floatCard} ${styles.floatCardA}`}><CalendarCheck2 size={19} aria-hidden="true"/><span><strong>Termin bestätigt</strong><small>Dachrinne reinigen · Di 9:00</small></span></div>
            <div className={`${styles.floatCard} ${styles.floatCardB}`}><FileText size={19} aria-hidden="true"/><span><strong>Rechnung abgelegt</strong><small>Hausakte · Energie</small></span></div>
            </div>
            <span className={styles.heroMockHint}>App öffnen <ArrowRight size={14} aria-hidden="true"/></span>
            </span>
          </Link>
        </Reveal>
      </div>
    </section>

    <div className={styles.trustBar}><div className={styles.trustBarInner}>
      <div className={styles.trustItem}><BadgeCheck size={20} aria-hidden="true"/><div><strong>Geprüfte Vertragspartner</strong><small>Kein offener Lead-Marktplatz</small></div></div>
      <div className={styles.trustItem}><ShieldCheck size={20} aria-hidden="true"/><div><strong>Matching nach Eignung</strong><small>Tarife kaufen keine bessere Platzierung</small></div></div>
      <div className={styles.trustItem}><UserRound size={20} aria-hidden="true"/><div><strong>Konkrete Ansprechpartner</strong><small>Menschen und Beziehungen bleiben sichtbar</small></div></div>
      <div className={styles.trustItem}><FileText size={20} aria-hidden="true"/><div><strong>Digitale Hausakte</strong><small>Hauswissen bleibt langfristig geordnet</small></div></div>
    </div></div>

    <Section eyebrow="Leistungen" title="Vom kleinen Defekt bis zur langfristigen Hauspflege." text="Du musst nicht zuerst wissen, welches Gewerk zuständig ist. Starte mit deinem Anliegen – die fachliche Einordnung kommt danach." tone="soft">
      <div className={styles.serviceGrid}>{services.map((item)=><a className={styles.serviceItem} href="/leistungen" key={item.title}><span className={styles.serviceIcon}>{item.icon}</span><span className={styles.serviceText}><strong>{item.title}</strong><span>{item.text}</span></span><span className={styles.serviceArrow}><ArrowRight size={16} aria-hidden="true"/></span></a>)}</div>
      <a className={styles.textLink} href="/leistungen">Alle Leistungsbereiche im Detail <ArrowRight size={15} aria-hidden="true"/></a>
    </Section>

    <Section eyebrow="So funktioniert's" title="Weniger suchen. Weniger hinterherlaufen. Mehr Überblick." text="Einfach Hausen bündelt die Organisation, ohne dir die Entscheidung abzunehmen.">
      <div className={styles.processWrap}>
        <ScrubLine axis="x" className={styles.processLine} />
        <div className={styles.processList}>
          {steps.map(([n,t,x])=>(
            <Activate className={styles.processStep} key={n}>
              <b>{n}</b>
              <h3>{t}</h3>
              <p>{x}</p>
            </Activate>
          ))}
        </div>
      </div>
      <a className={styles.textLink} href="/so-funktionierts">Den ganzen Ablauf ansehen <ArrowRight size={15} aria-hidden="true"/></a>
    </Section>

    <Section eyebrow="Mein Haus" title="Die Hausakte wird mit jedem erledigten Thema wertvoller." text="Nicht nur der nächste Auftrag zählt. Technik, Historie, Dokumente, Wartungen und Ansprechpartner wachsen zu einem dauerhaften Gedächtnis deiner Immobilie." tone="green">
      <Split>
        <InfoPanel label="Digitale Hausakte"><h3>Alles, was später wieder wichtig wird.</h3><BulletList items={['Arbeiten und Sanierungen dokumentieren','Rechnungen, Belege und Garantien wiederfinden','Technik und Anlagen am Haus erfassen','Persönliche Ansprechpartner nach Bereichen behalten','Hausbezogene Historie bei Eigentümerwechsel kontrolliert weitergeben']} /></InfoPanel>
        <div className={styles.previewCard}><div className={styles.previewCardHead}><strong>Mein Haus · Beispielansicht</strong><span>geordnet</span></div><div className={styles.timeline}>
          <ScrubLine axis="y" className={styles.timelineScrub} />
          <div className={styles.timelineRow}><time>2026</time><span className={styles.timelineDot}/><div className={styles.timelineContent}><strong>Gartenpflege</strong><small>Ansprechpartner und Rechnung abgelegt</small></div></div>
          <div className={styles.timelineRow}><time>2025</time><span className={styles.timelineDot}/><div className={styles.timelineContent}><strong>Dacharbeiten</strong><small>Dokumentation und Garantiehinweis gespeichert</small></div></div>
          <div className={styles.timelineRow}><time>2024</time><span className={styles.timelineDot}/><div className={styles.timelineContent}><strong>Heizung</strong><small>Anlage erfasst · Wartung planbar</small></div></div>
        </div></div>
      </Split>
    </Section>

    <GatewaySection />

    <Section eyebrow="Für Betriebe" title="Gute Kundenbeziehungen statt Lead-Handel." text="Partner erhalten passende Anfragen, arbeiten mit konkreten Ansprechpartnern und behalten 100 % ihres Auftragswertes. Einfach Hausen finanziert sich über planbare Partnertarife – nicht über Auftragsprovision." tone="dark">
      <div className={styles.featureGrid}>
        <article className={styles.feature}><div className={styles.featureIcon}><HeartHandshake size={20} aria-hidden="true"/></div><h3>0 % Auftragsprovision</h3><p>Keine Gebühr pro ausgeführtem Auftrag. Der Partner bleibt Rechnungssteller seiner Leistung.</p></article>
        <article className={styles.feature}><div className={styles.featureIcon}><Search size={20} aria-hidden="true"/></div><h3>Qualität vor Tarif</h3><p>Bezahlte Tarife kaufen keine bessere Position im Matching. Eignung und Qualität bleiben entscheidend.</p></article>
        <article className={styles.feature}><div className={styles.featureIcon}><Sparkles size={20} aria-hidden="true"/></div><h3>Einfacher Arbeitsbereich</h3><p>Anfragen, Team, Termine, Dokumente und Rechnungen – ohne unnötige ERP-Komplexität.</p></article>
      </div>
      <div className={styles.heroActions}><a className={styles.primaryButton} href="/partner">Partner-Modell ansehen</a><a className={styles.secondaryButton} href="/preise">Partnerpreise</a></div>
    </Section>

    <Section eyebrow="Preise" title="Kostenlos anfangen. Mehr Service nur, wenn du ihn brauchst." text="Das Kunden-Hauskonto startet bei 0 €. Für Partner gibt es ein kostenloses Modell und planbare Monatstarife." tone="soft">
      <Split>
        <InfoPanel label="Eigenheimbesitzer"><div className={styles.priceFigure}><strong>0 €</strong><small>/ Monat</small></div><h3>FREE</h3><p>Hausmeisterservice, Aufträge, Angebotsvergleich, Vermittlung und digitale Hausakte bilden den kostenlosen Einstieg.</p><div className={styles.heroActions}><LinkButton href="/register?role=homeowner">Kostenlos starten</LinkButton><LinkButton href="/preise" secondary>Tarife vergleichen</LinkButton></div></InfoPanel>
        <InfoPanel label="Partner"><div className={styles.priceFigure}><strong>0 %</strong><small>Provision</small></div><h3>Planbare Tarife</h3><p>FREE startet bei 0 €. Bezahlte Partner-Tarife beginnen laut Produktmodell bei 29 € / Monat.</p><div className={styles.heroActions}><LinkButton href="/register?role=provider">Als Partner starten</LinkButton><LinkButton href="/preise" secondary>Partnertarife</LinkButton></div></InfoPanel>
      </Split>
    </Section>

    <Section eyebrow="Häufige Fragen" title="Klare Antworten, bevor du startest." text="Die wichtigsten Fragen zum Ablauf, zu Kosten, Partnern und Daten – ohne Kleingedrucktes." tone="plain">
      <div className={styles.faqList}>
        {faqs.map(([question, answer]) => (
          <details className={styles.faq} key={question}>
            <summary className={styles.faqSummary}><span>{question}</span><ChevronDown size={18} aria-hidden="true"/></summary>
            <div className={styles.faqBody}><p>{answer}</p></div>
          </details>
        ))}
      </div>
      <a className={styles.textLink} href="/hilfe">Alle Fragen und Hilfe ansehen</a>
    </Section>

    <Statement kicker="Einfach Hausen" tone="green">Dein Haus <mark>vergisst nichts.</mark> Wir auch nicht.</Statement>
    <CtaBand title="Beim nächsten Thema nicht wieder von vorne anfangen." text="Lege dein Hauskonto kostenlos an und beschreibe einfach, was bei deinem Eigenheim ansteht." />
  </MarketingShell>;
}
