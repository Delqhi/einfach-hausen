import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, BadgeCheck, Bot, CalendarCheck2, Camera, Check, ChevronRight, Clock3, House, MessageSquare, Mic, ShieldCheck, Sparkles, Star, UserRound, Wrench } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { Logo } from '@/components/logo';

const steps=[
  ['1','Sagen','Beschreibe einfach, was gemacht werden soll. Text, Foto oder Sprache reichen.'],
  ['2','Vergleichen','Der KI-Hausmeister klärt Details und holt passende Angebote geprüfter Partner ein.'],
  ['3','Buchen','Du entscheidest. Danach bekommst du einen echten Ansprechpartner beim Betrieb.'],
  ['4','Erledigt','Auftrag, Dokumente, Bewertung und Ansprechpartner bleiben in deiner Hausakte.'],
] as const;

export default async function Landing(){
  const user=await getCurrentUser(); if(user)redirect(user.role==='provider'?'/pro':'/app');
  return <main className="marketing-v2">
    <header className="marketing-nav">
      <Link href="/" className="marketing-logo"><Logo/></Link>
      <nav><a href="#so-funktionierts">So funktioniert&apos;s</a><a href="#mein-haus">Mein Haus</a><a href="#partner">Für Partner</a></nav>
      <div className="marketing-nav-actions"><Link href="/login" className="nav-login">Einloggen</Link><Link href="/register?role=homeowner" className="btn primary">Kostenlos starten <ArrowRight size={16}/></Link></div>
    </header>

    <section className="hero-v2">
      <div className="hero-copy-v2">
        <div className="hero-kicker"><span><Sparkles size={14}/> Dein digitaler Hausmeister</span><span className="hero-trust"><ShieldCheck size={14}/> Geprüfte Partner</span></div>
        <h1>Ein Ansprechpartner.<br/><em>Für dein ganzes Haus.</em></h1>
        <p className="hero-lead">Du musst nicht wissen, welchen Handwerker du brauchst. Sag einfach, was an deinem Haus gemacht werden muss. Wir organisieren den Rest – und nach der Buchung hast du einen echten Menschen als Ansprechpartner.</p>
        <div className="hero-actions"><Link className="btn primary hero-primary" href="/register?role=homeowner">Hausmeister kostenlos testen <ArrowRight size={18}/></Link><a className="hero-secondary" href="#so-funktionierts">So funktioniert es <ChevronRight size={16}/></a></div>
        <div className="hero-proof"><span><Check/> Kostenlos starten</span><span><Check/> 0 € Vermittlungsgebühr</span><span><Check/> Regionale Vertragspartner</span></div>
      </div>

      <div className="hero-product">
        <div className="product-window">
          <div className="product-window-top"><div><span></span><span></span><span></span></div><small>Einfach Hausen</small><span className="window-online">● online</span></div>
          <div className="product-body">
            <div className="product-agent"><div className="agent-orb"><Bot size={24}/></div><div><small>DEIN KI-HAUSMEISTER</small><strong>Was braucht dein Haus?</strong></div></div>
            <div className="demo-message user-demo">Meine Hecke muss geschnitten werden. Dienstag ab 14 Uhr hätte ich Zeit.</div>
            <div className="demo-message ai-demo"><Sparkles size={15}/><div><strong>Alles klar.</strong><p>Wie lang ist die Hecke ungefähr? Eine grobe Angabe in Metern reicht.</p></div></div>
            <div className="demo-input"><span>Etwa 25 Meter</span><div><Camera size={17}/><Mic size={17}/><button><ArrowRight size={16}/></button></div></div>
            <div className="demo-result"><div className="demo-result-head"><div><small>PASSENDER AUFTRAG</small><strong>Heckenschnitt · ca. 25 m</strong></div><span>250–400 €</span></div><div className="demo-result-meta"><span><Clock3/> Dienstag ab 14 Uhr</span><span><BadgeCheck/> 3 Partner angefragt</span></div></div>
          </div>
        </div>
        <div className="floating-card floating-contact"><div className="contact-mini-avatar">TW</div><div><small>DEIN ANSPRECHPARTNER</small><strong>Thomas Weber</strong><span>Gartenbau Weber</span></div><MessageSquare size={18}/></div>
        <div className="floating-card floating-rating"><Star size={17}/><div><strong>4,9</strong><small>Partnerqualität</small></div></div>
      </div>
    </section>

    <section className="trust-band"><span>Einfach für Eigentümer</span><span>•</span><span>Persönlich nach der Buchung</span><span>•</span><span>Qualität vor Werbebudget</span><span>•</span><span>0 % Provision für Partner</span></section>

    <section className="marketing-section" id="so-funktionierts">
      <div className="section-heading"><span className="section-eyebrow">SO FUNKTIONIERT&apos;S</span><h2>Vom Problem zur Lösung.<br/>Ohne Handwerker-Suchmarathon.</h2><p>Kein Branchenverzeichnis, keine zehn Tabs, kein Telefonieren durch die halbe Stadt.</p></div>
      <div className="steps-grid">{steps.map(([n,t,d])=><article key={n}><span className="step-number">{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div>
    </section>

    <section className="marketing-section house-section" id="mein-haus">
      <div className="house-visual"><div className="house-panel"><div className="house-panel-head"><House/><div><small>MEIN HAUS</small><strong>Deine digitale Hausakte</strong></div></div><div className="house-metrics"><div><small>Nächste Wartung</small><strong>Heizung · 18. Sep.</strong></div><div><small>Letzter Auftrag</small><strong>Garten · erledigt</strong></div></div><div className="house-list"><span><Wrench/> Wärmepumpe <b>Wartung geplant</b></span><span><CalendarCheck2/> Dachrinne <b>Oktober</b></span><span><UserRound/> Garten <b>Thomas Weber</b></span></div></div></div>
      <div className="house-copy"><span className="section-eyebrow">MIT JEDEM AUFTRAG WERTVOLLER</span><h2>Dein Haus vergisst nichts mehr.</h2><p>Adresse, Anlagen, Wartungen, Rechnungen, Fotos, Termine und persönliche Ansprechpartner wachsen zu einer echten digitalen Hausakte zusammen.</p><ul><li><Check/> Wiederkehrende Wartungen automatisch im Blick</li><li><Check/> Bevorzugte Partner und Ansprechpartner dauerhaft gespeichert</li><li><Check/> Dokumente und Auftragshistorie an einem Ort</li></ul><Link href="/register?role=homeowner">Mein Haus anlegen <ArrowRight size={16}/></Link></div>
    </section>

    <section className="partner-section" id="partner">
      <div><span className="partner-kicker">FÜR REGIONALE FACHBETRIEBE</span><h2>Neue Aufträge.<br/>Keine komplizierte Software.</h2><p>Die Partner-App fühlt sich an wie WhatsApp plus Auftragsverwaltung. Ein Betrieb, beliebig viele Ansprechpartner und nur ein wichtiger Schalter: „Aufträge verwalten“.</p><div className="partner-points"><span><Check/> 0 % Provision pro Auftrag</span><span><Check/> Eigene Kundenbeziehung bleibt erhalten</span><span><Check/> In 5 Minuten verstanden</span></div><Link href="/register?role=provider" className="btn light">Vertragspartner werden <ArrowRight size={17}/></Link></div>
      <div className="partner-board"><div className="partner-board-head"><small>NEUE ANFRAGEN</small><span>3 neu</span></div><article><div className="job-icon">🌿</div><div><strong>Heckenschnitt</strong><small>München · Dienstag ab 14 Uhr</small></div><b>250–400 €</b></article><article><div className="job-icon">🔧</div><div><strong>Armatur tauschen</strong><small>München · flexibel</small></div><b>120–180 €</b></article><div className="partner-assign"><div><small>ZUGEWIESEN AN</small><strong>Thomas Weber · Techniker</strong></div><span>Aktiv</span></div></div>
    </section>

    <section className="final-cta"><Sparkles/><h2>Was braucht dein Haus?</h2><p>Ein Satz reicht, um zu starten.</p><Link href="/register?role=homeowner" className="btn primary">Kostenlos starten <ArrowRight size={18}/></Link></section>

    <footer className="marketing-footer"><Logo/><p>© 2026 Einfach Hausen · Dein digitaler Hausmeister</p><div><Link href="/login">Einloggen</Link><Link href="/register?role=provider">Partner werden</Link></div></footer>
  </main>;
}
