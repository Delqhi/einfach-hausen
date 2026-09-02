import { redirect } from 'next/navigation';
import { ArrowRight, ChevronDown, CircleCheck, FileText, ShieldCheck, UserRound } from 'lucide-react';
import Image from 'next/image';
import { getCurrentUser } from '@/lib/auth';
import { MarketingShell } from '@/components/marketing/site-shell';
import { Section, Split, InfoPanel, BulletList, CtaBand, LinkButton, Statement } from '@/components/marketing/ui';
import { Reveal, Stagger, DrawPath, SplitLines } from '@/components/marketing/motion';
import { IntakeForm } from '@/components/home/intake-form';
import { HomeServicesGrid } from '@/components/marketing/home-services-grid';
import styles from '@/components/marketing/marketing.module.css';
import premium from '@/components/marketing/premium.module.css';

const story = [
  { img:'/images/premium/story-beschreiben.jpg', kicker:'1 · Beschreiben', title:'Sag einfach, was ansteht.', text:'Schreib, sprich oder zeig per Foto. Die fachliche Einordnung übernehmen wir – ohne dass du wissen musst, welches Gewerk zuständig ist.' },
  { img:'/images/premium/story-ansprechpartner.jpg', kicker:'2 · Der passende Mensch', title:'Ein konkreter Ansprechpartner.', text:'Geprüfte Vertragspartner aus deiner Region – kein anonymer Marktplatz. Du sprichst mit Menschen, bevor etwas beauftragt wird.' },
  { img:'/images/premium/hausakte.jpg', kicker:'3 · Erledigt & behalten', title:'Alles landet in deiner Hausakte.', text:'Rechnungen, Garantien, Wartungen und Kontakte bleiben dauerhaft geordnet – dein Haus vergisst nichts.' },
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
    {/* ============ HERO: one promise, intake primary, human visual anchor ============ */}
    <section className={premium.hero}>
      <div className={premium.heroGrid}>
        <div className={premium.heroPhoto}>
          <Image src="/images/premium/hero-homeowner.jpg" alt="Eigentümerin an der Tür ihres gepflegten Eigenheims" fill priority sizes="(max-width: 900px) 100vw, 520px" className={premium.heroPhotoImg} />
          <div className={premium.heroPhotoCard}>
            <FileText size={18} aria-hidden="true"/>
            <span><strong>Rechnung abgelegt</strong><small>Heizung · Hausakte</small></span>
          </div>
        </div>
        <Stagger className={premium.heroCopy} gap={0.1}>
          <SplitLines className={premium.heroH1}>Dein Zuhause. <span className={styles.heroAccent}>Organisiert.<DrawPath className={styles.heroUnderlineWrap}><svg viewBox="0 0 320 14" preserveAspectRatio="none" className={styles.heroUnderline} aria-hidden="true"><path d="M4 10 C 80 3, 240 3, 316 8" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/></svg></DrawPath></span></SplitLines>
          <p className={premium.heroLead}>Beschreibe, was ansteht – wir helfen beim Einordnen, bringen dich mit passenden <strong>geprüften Partnern</strong> zusammen und behalten alles in deiner <strong>digitalen Hausakte</strong>.</p>
          <div className={premium.intakeWrap}><IntakeForm /></div>
          <div className={premium.heroProof}>
            <span><CircleCheck size={15} aria-hidden="true"/> Geprüfte Vertragspartner</span>
            <span><UserRound size={15} aria-hidden="true"/> Persönlicher Ansprechpartner</span>
            <span><ShieldCheck size={15} aria-hidden="true"/> Kein Auftrag ohne deine Entscheidung</span>
          </div>
          <a href="/pilotphase" className={premium.pilotNote}>Pilotphase: die ersten 1.000 Haushalte sichern sich 15&nbsp;% Dauer-Vorteil <ArrowRight size={14} aria-hidden="true"/></a>
        </Stagger>
      </div>
    </section>

    {/* ============ HOMEOWNER SERVICE MOSAIC — editorial category discovery ============ */}
    <HomeServicesGrid />

    {/* ============ 3 STORY MOMENTS (spec §9.4) ============ */}
    <Section eyebrow="So funktioniert's" title="Drei Schritte. Null Bürokratie." text="Weniger suchen, weniger hinterherlaufen, mehr Überblick.">
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
      <a className={styles.textLink} href="/so-funktionierts">Den ganzen Ablauf ansehen <ArrowRight size={15} aria-hidden="true"/></a>
    </Section>

    {/* ============ HAUSAKTE VALUE (spec §9.5) ============ */}
    <Section eyebrow="Mein Haus" title="Die Hausakte wird mit jedem erledigten Thema wertvoller." tone="green">
      <Split>
        <InfoPanel label="Digitale Hausakte"><h3>Alles, was später wieder wichtig wird.</h3><BulletList items={['Arbeiten und Sanierungen dokumentieren','Rechnungen, Belege und Garantien wiederfinden','Technik und Anlagen am Haus erfassen','Persönliche Ansprechpartner nach Bereichen behalten','Hausbezogene Historie bei Eigentümerwechsel kontrolliert weitergeben']} /></InfoPanel>
        <div className={premium.akteVisual}>
          <Image src="/images/premium/hausakte.jpg" alt="Geordnete Hausdokumente und digitale Hausakte" fill sizes="460px"/>
          <div className={premium.akteChips} aria-hidden="true">
            <span>Heizung gewartet</span><span>Garantie vorhanden</span><span>Ansprechpartner bekannt</span>
          </div>
        </div>
      </Split>
    </Section>

    <Section eyebrow="Für Betriebe" title="Gute Kundenbeziehungen statt Lead-Handel." text="Partner erhalten passende Anfragen, arbeiten mit konkreten Ansprechpartnern und behalten 100 % ihres Auftragswertes. Einfach Hausen finanziert sich über planbare Partnertarife – nicht über Auftragsprovision." tone="dark">
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
