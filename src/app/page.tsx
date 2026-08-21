import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, BadgeCheck, CalendarDays, Camera, Check, ChevronRight, House, MessageSquare, Mic, Send, ShieldCheck, UserRound, Wrench } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { Logo } from '@/components/logo';

const process=[
  ['01','Sagen','Beschreibe in deinen Worten, was an deinem Haus gemacht werden soll. Ein Satz reicht; Foto oder Sprache sind optional.'],
  ['02','Organisieren','Der digitale Hausmeister klärt nur fehlende Details und sucht passende, geprüfte regionale Vertragspartner.'],
  ['03','Entscheiden','Du bekommst eine klare Empfehlung und kannst Preis, Termin und Qualität vergleichen. Du entscheidest.'],
  ['04','Persönlich bleiben','Nach der Buchung übernimmt ein konkreter Mensch beim Partnerbetrieb. Er bleibt als Ansprechpartner in deiner Hausakte gespeichert.'],
] as const;

export default async function Landing(){
  const user=await getCurrentUser(); if(user)redirect(user.role==='provider'?'/pro':'/app');
  return <main className="marketing-v3">
    <header className="marketing-v3-header">
      <Link href="/"><Logo/></Link>
      <nav><a href="#prinzip">So funktioniert&apos;s</a><a href="#hausakte">Mein Haus</a><a href="#partner">Für Partner</a></nav>
      <div className="marketing-v3-actions"><Link className="marketing-v3-login" href="/login">Einloggen</Link><Link className="btn primary" href="/register?role=homeowner">Kostenlos starten</Link></div>
    </header>

    <section className="hero-v3">
      <div className="hero-v3-copy">
        <div className="hero-v3-kicker">Einfach Hausen · Dein digitaler Hausmeister</div>
        <h1>Du sagst, was dein Haus braucht. Wir kümmern uns um den Rest.</h1>
        <p className="hero-v3-lead">Kein Branchenverzeichnis. Kein Handwerker-Suchmarathon. Eine einfache Oberfläche, ein geprüftes Partnernetzwerk und nach der Buchung ein echter persönlicher Ansprechpartner.</p>
        <div className="hero-v3-actions"><Link className="btn primary" href="/register?role=homeowner">Hausmeister starten <ArrowRight size={17}/></Link><a className="text-link" href="#prinzip">So funktioniert es <ChevronRight size={15}/></a></div>
      </div>

      <div className="prompt-stage" aria-label="Beispiel für den digitalen Hausmeister">
        <div className="prompt-card">
          <div className="prompt-label">Was braucht dein Haus?</div>
          <div className="prompt-row"><div className="prompt-copy">Meine Hecke muss geschnitten werden. Dienstag ab 14 Uhr hätte ich Zeit.</div><div className="prompt-tools"><span className="prompt-tool"><Camera size={17}/></span><span className="prompt-tool"><Mic size={17}/></span><span className="prompt-send"><Send size={16}/></span></div></div>
          <div className="prompt-answer"><span className="prompt-ai"><House size={16}/></span><div><strong>Alles klar. Wie lang ist die Hecke ungefähr?</strong><p>Eine grobe Angabe in Metern reicht. Danach kann ich passende Partner und einen realistischen Preisrahmen bestimmen.</p><div className="prompt-meta"><span><BadgeCheck size={14}/> geprüfte Partner</span><span><CalendarDays size={14}/> Terminwunsch berücksichtigt</span><span><ShieldCheck size={14}/> Qualität vor Werbebudget</span></div></div></div>
        </div>
      </div>
    </section>

    <div className="statement-strip"><div className="statement-strip-inner"><span><strong>Free</strong> ab 0 €</span><span><strong>Partner</strong> 0 % Provision</span><span><strong>Regional</strong> geprüft & vertraglich gebunden</span><span><strong>Persönlich</strong> echter Ansprechpartner nach Buchung</span></div></div>

    <section className="editorial-section" id="prinzip">
      <span className="editorial-eyebrow">Das Prinzip</span><h2>So wenig Software wie möglich. So viel Hilfe wie nötig.</h2><p className="editorial-intro">Einfach Hausen übernimmt die komplizierte Organisation im Hintergrund. Für dich bleibt ein klarer Ablauf.</p>
      <div className="process-list">{process.map(([i,t,d])=><article className="process-row" key={i}><span className="process-index">{i}</span><h3>{t}</h3><p>{d}</p></article>)}</div>
    </section>

    <section className="editorial-section house-v3" id="hausakte">
      <div className="house-v3-copy"><span className="editorial-eyebrow">Mein Haus</span><h2>Eine Hausakte, die mit jedem Auftrag wertvoller wird.</h2><p className="editorial-intro">Anlagen, Wartungen, Rechnungen, Fotos, Termine und Ansprechpartner bleiben dort, wo sie hingehören: bei deinem Haus.</p><Link className="text-link" href="/register?role=homeowner">Hausprofil kostenlos anlegen <ArrowRight size={15}/></Link></div>
      <div className="house-record">
        <div className="record-row"><Wrench size={18}/><div><strong>Wärmepumpe</strong><small>Letzte Wartung · 18.09.2025</small></div><span className="record-status">Wartung geplant</span></div>
        <div className="record-row"><CalendarDays size={18}/><div><strong>Dachrinne</strong><small>Letzte Reinigung · Oktober 2025</small></div><span>Oktober 2026</span></div>
        <div className="record-row"><UserRound size={18}/><div><strong>Garten</strong><small>Bevorzugter Ansprechpartner</small></div><span>Thomas Weber</span></div>
        <div className="record-row"><MessageSquare size={18}/><div><strong>Heckenschnitt</strong><small>Letzter Auftrag · Gartenbau Weber</small></div><span>Erledigt</span></div>
        <div className="record-row"><Check size={18}/><div><strong>Dokumente</strong><small>Rechnungen, Leistungsnachweise, Fotos</small></div><span>12 Dateien</span></div>
      </div>
    </section>

    <section className="partner-v3-wrap" id="partner"><div className="partner-v3">
      <div><span className="editorial-eyebrow">Für Partnerbetriebe</span><h2>Aufträge rein. Ansprechpartner zuweisen. Erledigen.</h2><p>Keine komplizierte Handwerker-ERP. Ein Firmenkonto, beliebig viele Ansprechpartner und genau ein wichtiger Schalter: „Aufträge verwalten“.</p><Link className="btn light" href="/register?role=provider">Vertragspartner werden <ArrowRight size={16}/></Link></div>
      <div className="partner-facts"><div className="partner-fact"><strong>Provision pro Auftrag</strong><span>0 %</span></div><div className="partner-fact"><strong>Start-Tarif</strong><span>29 €/Monat</span></div><div className="partner-fact"><strong>Testphase</strong><span>2 Monate kostenlos</span></div><div className="partner-fact"><strong>Matching</strong><span>Qualität vor Tarif</span></div></div>
    </div></section>

    <section className="final-v3"><h2>Ein Ansprechpartner für alles rund ums Eigenheim.</h2><Link className="btn primary" href="/register?role=homeowner">Kostenlos starten <ArrowRight size={17}/></Link></section>
    <footer className="marketing-v3-footer"><Logo/><p>© 2026 Einfach Hausen</p><nav><Link href="/login">Einloggen</Link><Link href="/register?role=provider">Partner werden</Link></nav></footer>
  </main>;
}
