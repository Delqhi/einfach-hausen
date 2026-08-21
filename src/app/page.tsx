import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight,CalendarDays,Check,ChevronRight,FileText,ShieldCheck,UserRound,Wrench } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { Logo } from '@/components/logo';

const process=[
  ['01','Problem beschreiben','Du sagst in deinen Worten, was los ist. Keine Kategorie wählen, keine zehn Firmen durchsuchen.'],
  ['02','Den richtigen Weg bekommen','Für eine Frage verbinden wir dich mit einem passenden Ansprechpartner. Wenn Arbeit nötig ist, kann daraus bewusst ein Auftrag werden.'],
  ['03','Ein Mensch kümmert sich','Du weißt, wer zuständig ist, kannst direkt schreiben oder anrufen und musst dein Anliegen nicht immer wieder neu erklären.'],
  ['04','Beim nächsten Mal ist alles da','Kontakte, Termine, Rechnungen, Fotos und Wartungen bleiben bei deinem Haus gespeichert.'],
] as const;

export default async function Landing(){
  const user=await getCurrentUser(); if(user)redirect(user.role==='provider'?'/pro':'/app');
  return <main className="marketing-v3 customer-first">
    <header className="marketing-v3-header">
      <Link href="/"><Logo/></Link>
      <nav><a href="#vorteile">Vorteile</a><a href="#hausakte">Mein Haus</a><a href="#partner">Für Partner</a></nav>
      <div className="marketing-v3-actions"><Link className="marketing-v3-login" href="/login">Einloggen</Link><Link className="btn primary" href="/register?role=homeowner">Kostenlos starten</Link></div>
    </header>

    <section className="hero-v3 customer-hero">
      <div className="hero-v3-copy">
        <div className="hero-v3-kicker">Einfach Hausen</div>
        <h1>Ein Ansprechpartner für alles rund ums Eigenheim.</h1>
        <p className="hero-v3-lead">Du beschreibst, was los ist. Wir bringen dich zum richtigen Menschen oder organisieren den Auftrag. Kontakte, Termine, Unterlagen und Hauswissen bleiben an einem Ort.</p>
        <div className="hero-v3-actions"><Link className="btn primary" href="/register?role=homeowner">Kostenlos starten <ArrowRight size={17}/></Link><a className="text-link" href="#vorteile">So hilft es dir <ChevronRight size={15}/></a></div>
      </div>

      <div className="benefit-preview" aria-label="Beispiel für Einfach Hausen">
        <div className="benefit-preview-head"><small>Dein Anliegen</small><strong>Feuchter Fleck an der Kellerwand</strong></div>
        <div className="benefit-preview-path"><span><ShieldCheck/><div><b>Einordnen</b><small>Was ist sinnvoll und wie dringend ist es?</small></div></span><span><UserRound/><div><b>Ansprechpartner</b><small>Mit einem passenden regionalen Menschen sprechen</small></div></span><span><Wrench/><div><b>Auftrag</b><small>Nur wenn du möchtest: Termin und Angebote organisieren</small></div></span></div>
        <div className="benefit-preview-foot">Du entscheidest, wie weit wir gehen.</div>
      </div>
    </section>

    <div className="statement-strip"><div className="statement-strip-inner"><span><strong>Kein Suchmarathon</strong> ein Anliegen reicht</span><span><strong>Regional</strong> geprüfte Partner</span><span><strong>Persönlich</strong> echter Ansprechpartner</span><span><strong>Übersichtlich</strong> alles bei deinem Haus</span></div></div>

    <section className="editorial-section" id="vorteile">
      <span className="editorial-eyebrow">Weniger Aufwand</span><h2>Du musst nicht wissen, wen du brauchst.</h2><p className="editorial-intro">Einfach Hausen nimmt dir die Suche und die Wiederholung ab. Du behältst trotzdem die Entscheidung.</p>
      <div className="process-list">{process.map(([i,t,d])=><article className="process-row" key={i}><span className="process-index">{i}</span><h3>{t}</h3><p>{d}</p></article>)}</div>
    </section>

    <section className="editorial-section house-v3" id="hausakte">
      <div className="house-v3-copy"><span className="editorial-eyebrow">Mein Haus</span><h2>Alles Wichtige zu deinem Haus an einem Ort.</h2><p className="editorial-intro">Keine Rechnungssuche, keine unbekannten Telefonnummern und kein Rätselraten über die letzte Wartung. Dein Haus wird mit jedem Vorgang besser dokumentiert.</p><Link className="text-link" href="/register?role=homeowner">Hausprofil kostenlos anlegen <ArrowRight size={15}/></Link></div>
      <div className="house-record">
        <div className="record-row"><UserRound size={18}/><div><strong>Garten</strong><small>Dein Ansprechpartner</small></div><span className="record-status">Thomas Weber</span></div>
        <div className="record-row"><CalendarDays size={18}/><div><strong>Wärmepumpe</strong><small>Nächste Wartung</small></div><span>18.09.2026</span></div>
        <div className="record-row"><Wrench size={18}/><div><strong>Dachrinne</strong><small>Letzte Reinigung · Oktober 2025</small></div><span>Oktober 2026</span></div>
        <div className="record-row"><FileText size={18}/><div><strong>Dokumente</strong><small>Rechnungen, Nachweise und Fotos</small></div><span>12 Dateien</span></div>
        <div className="record-row"><Check size={18}/><div><strong>Heckenschnitt</strong><small>Gartenbau Weber</small></div><span>Erledigt</span></div>
      </div>
    </section>

    <section className="customer-outcome">
      <div><span className="editorial-eyebrow">Im Alltag</span><h2>Wenn etwas am Haus ist, weißt du, was als Nächstes passiert.</h2></div>
      <div className="outcome-list"><p><strong>Eine Stelle statt vieler Nummern.</strong><span>Du startest immer bei Einfach Hausen und musst nicht erst das richtige Gewerk erraten.</span></p><p><strong>Ein Mensch statt anonymer Vermittlung.</strong><span>Wenn du persönliche Hilfe brauchst, bekommst du einen konkreten Ansprechpartner.</span></p><p><strong>Dein Wissen bleibt bei dir.</strong><span>Hausdaten und bisherige Kontakte werden beim nächsten Anliegen wieder genutzt.</span></p></div>
    </section>

    <section className="partner-v3-wrap" id="partner"><div className="partner-v3">
      <div><span className="editorial-eyebrow">Für Partnerbetriebe</span><h2>Passende Anfragen. Klare Zuständigkeit. Weniger Verwaltung.</h2><p>Ein Firmenkonto, beliebig viele Ansprechpartner und genau ein wichtiger Schalter: „Aufträge verwalten“. Keine komplizierte Handwerker-ERP.</p><Link className="btn light" href="/register?role=provider">Vertragspartner werden <ArrowRight size={16}/></Link></div>
      <div className="partner-facts"><div className="partner-fact"><strong>Provision pro Auftrag</strong><span>0 %</span></div><div className="partner-fact"><strong>Start-Tarif</strong><span>29 €/Monat</span></div><div className="partner-fact"><strong>Testphase</strong><span>2 Monate kostenlos</span></div><div className="partner-fact"><strong>Matching</strong><span>Qualität vor Tarif</span></div></div>
    </div></section>

    <section className="final-v3"><h2>Weniger suchen. Mehr erledigt bekommen.</h2><Link className="btn primary" href="/register?role=homeowner">Kostenlos starten <ArrowRight size={17}/></Link></section>
    <footer className="marketing-v3-footer"><Logo/><p>© 2026 Einfach Hausen</p><nav><Link href="/login">Einloggen</Link><Link href="/register?role=provider">Partner werden</Link></nav></footer>
  </main>;
}
