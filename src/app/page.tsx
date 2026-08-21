import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, CalendarDays, Camera, Check, ChevronRight, ClipboardCheck, House, MessageCircle, MessageSquare, Mic, Send, UserRound, Wrench } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { Logo } from '@/components/logo';

const process=[
  ['01','KI fragen','Dein KI-Hausmeister ist immer da. Beschreibe ein Problem, stell eine Frage oder zeig ein Foto.'],
  ['02','Selbst entscheiden','Du wählst danach: nur einen passenden menschlichen Ansprechpartner sprechen oder einen echten Auftrag organisieren lassen.'],
  ['03','Persönlich bleiben','Wenn du einen Menschen möchtest, bekommst du einen konkreten Ansprechpartner beim geprüften Partnerbetrieb – direkt per Nachricht oder Telefon.'],
  ['04','Hauswissen behalten','Kontakte, Aufträge, Dokumente und Wartungen bleiben in deiner digitalen Hausakte und werden beim nächsten Mal wieder genutzt.'],
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
        <p className="hero-v3-lead">Dein KI-Hausmeister ist immer da. Und wenn du mehr brauchst, entscheidest du selbst: nur mit einem passenden Menschen sprechen oder einen Auftrag vollständig organisieren lassen.</p>
        <div className="hero-v3-actions"><Link className="btn primary" href="/register?role=homeowner">Hausmeister starten <ArrowRight size={17}/></Link><a className="text-link" href="#prinzip">So funktioniert es <ChevronRight size={15}/></a></div>
      </div>

      <div className="prompt-stage" aria-label="Beispiel für den digitalen Hausmeister">
        <div className="prompt-card">
          <div className="prompt-label">Frag deinen KI-Hausmeister</div>
          <div className="prompt-row"><div className="prompt-copy">An der Kellerwand ist ein feuchter Fleck. Wen brauche ich dafür?</div><div className="prompt-tools"><span className="prompt-tool"><Camera size={17}/></span><span className="prompt-tool"><Mic size={17}/></span><span className="prompt-send"><Send size={16}/></span></div></div>
          <div className="prompt-answer"><span className="prompt-ai"><House size={16}/></span><div><strong>Das kann mehrere Ursachen haben.</strong><p>Ich würde zuerst eingrenzen, ob Feuchtigkeit von außen, einer Leitung oder Kondensation kommt. Wenn du möchtest, kann ich dir einen passenden Menschen zum Besprechen suchen oder direkt einen Vor-Ort-Auftrag organisieren.</p><div className="prompt-options"><span><MessageCircle size={15}/><b>Ansprechpartner finden</b><small>Noch kein Auftrag</small></span><span><ClipboardCheck size={15}/><b>Auftrag organisieren</b><small>Termin & Angebote</small></span></div></div></div>
        </div>
      </div>
    </section>

    <div className="statement-strip"><div className="statement-strip-inner"><span><strong>Free</strong> ab 0 €</span><span><strong>Partner</strong> 0 % Provision</span><span><strong>Regional</strong> geprüft & vertraglich gebunden</span><span><strong>Du entscheidest</strong> Ansprechpartner oder Auftrag</span></div></div>

    <section className="editorial-section" id="prinzip">
      <span className="editorial-eyebrow">Das Prinzip</span><h2>So wenig Software wie möglich. So viel Hilfe wie nötig.</h2><p className="editorial-intro">Die KI bleibt dein Hausmeister. Ein echter Mensch oder ein Auftrag kommt erst dazu, wenn du das ausdrücklich möchtest.</p>
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
      <div><span className="editorial-eyebrow">Für Partnerbetriebe</span><h2>Anfragen rein. Ansprechpartner zuweisen. Aufträge erledigen.</h2><p>Keine komplizierte Handwerker-ERP. Ein Firmenkonto, beliebig viele Ansprechpartner und genau ein wichtiger Schalter: „Aufträge verwalten“.</p><Link className="btn light" href="/register?role=provider">Vertragspartner werden <ArrowRight size={16}/></Link></div>
      <div className="partner-facts"><div className="partner-fact"><strong>Provision pro Auftrag</strong><span>0 %</span></div><div className="partner-fact"><strong>Start-Tarif</strong><span>29 €/Monat</span></div><div className="partner-fact"><strong>Testphase</strong><span>2 Monate kostenlos</span></div><div className="partner-fact"><strong>Matching</strong><span>Qualität vor Tarif</span></div></div>
    </div></section>

    <section className="final-v3"><h2>KI-Hausmeister. Persönlicher Ansprechpartner. Auftrag, wenn du ihn willst.</h2><Link className="btn primary" href="/register?role=homeowner">Kostenlos starten <ArrowRight size={17}/></Link></section>
    <footer className="marketing-v3-footer"><Logo/><p>© 2026 Einfach Hausen</p><nav><Link href="/login">Einloggen</Link><Link href="/register?role=provider">Partner werden</Link></nav></footer>
  </main>;
}
