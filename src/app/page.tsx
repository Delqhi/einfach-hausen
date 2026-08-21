import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  CircleCheck,
  FileText,
  Home,
  MessageCircle,
  PhoneCall,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wrench,
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { Logo } from '@/components/logo';

const process = [
  ['01', 'Anliegen schildern', 'Beschreibe kurz, was am Haus ansteht. Du musst weder das Gewerk kennen noch vorher Firmen vergleichen.'],
  ['02', 'Passenden Weg wählen', 'Du entscheidest: eine Frage klären, einen persönlichen Ansprechpartner finden oder direkt einen Auftrag organisieren.'],
  ['03', 'Alles im Hauskonto behalten', 'Kontakte, Termine, Rechnungen, Fotos und Wartungen bleiben sauber bei deinem Haus dokumentiert.'],
] as const;

const serviceWays = [
  {
    icon: MessageCircle,
    title: 'Eine Frage klären',
    text: 'Wenn du erst verstehen willst, was sinnvoll ist und wie dringend dein Anliegen wirklich ist.',
    label: 'Orientierung bekommen',
  },
  {
    icon: UserRound,
    title: 'Ansprechpartner finden',
    text: 'Wenn du mit einem passenden Menschen aus deiner Region sprechen und das Thema persönlich klären möchtest.',
    label: 'Kontakt herstellen',
  },
  {
    icon: Wrench,
    title: 'Auftrag organisieren',
    text: 'Wenn die Arbeit erledigt werden soll – mit klarer Zuständigkeit, Termin, Unterlagen und Rechnung an einem Ort.',
    label: 'Auftrag starten',
  },
] as const;

export default async function Landing() {
  const user = await getCurrentUser();
  if (user) redirect(user.role === 'provider' ? '/pro' : '/app');

  return (
    <main className="marketing-v3 customer-first premium-marketing">
      <header className="marketing-v3-header premium-header">
        <Link href="/" aria-label="Einfach Hausen Startseite"><Logo /></Link>
        <nav aria-label="Hauptnavigation">
          <a href="#so-funktionierts">So funktioniert&apos;s</a>
          <a href="#hausakte">Mein Haus</a>
          <a href="#partner">Für Betriebe</a>
        </nav>
        <div className="marketing-v3-actions">
          <Link className="marketing-v3-login" href="/login">Einloggen</Link>
          <Link className="btn primary" href="/register?role=homeowner">Kostenlos starten</Link>
        </div>
      </header>

      <section className="hero-v3 customer-hero premium-hero">
        <div className="hero-v3-copy">
          <div className="hero-badge"><Home size={14} /> Für Eigentümer &amp; Hausbesitzer</div>
          <h1>Alles rund ums Haus. <span>Einfach an einer Stelle.</span></h1>
          <p className="hero-v3-lead">
            Eine Frage, ein Defekt oder eine anstehende Wartung: Du startest immer bei Einfach Hausen.
            Wir helfen dir beim Einordnen, finden den passenden Menschen und organisieren auf Wunsch den Auftrag.
          </p>
          <div className="hero-v3-actions">
            <Link className="btn primary premium-primary" href="/register?role=homeowner">
              Anliegen kostenlos starten <ArrowRight size={17} />
            </Link>
            <a className="secondary-cta" href="#so-funktionierts">So funktioniert&apos;s <ChevronRight size={15} /></a>
          </div>
          <div className="hero-trust" aria-label="Vorteile">
            <span><CircleCheck size={15} /> Kostenloses Hauskonto</span>
            <span><CircleCheck size={15} /> Regionale Partner</span>
            <span><CircleCheck size={15} /> Persönlicher Ansprechpartner</span>
          </div>
        </div>

        <div className="service-demo" aria-label="Beispielablauf in Einfach Hausen">
          <div className="service-demo-top">
            <div className="demo-house-icon"><Home size={19} /></div>
            <div>
              <small>Mein Haus</small>
              <strong>Reihenhaus · Berlin</strong>
            </div>
            <span className="demo-status">Aktiv</span>
          </div>
          <div className="demo-question">
            <small>Neues Anliegen</small>
            <p>„Seit gestern ist ein feuchter Fleck an der Kellerwand. Was soll ich tun?“</p>
          </div>
          <div className="demo-route">
            <div className="demo-route-item active"><span><ShieldCheck size={17} /></span><div><b>Einordnen</b><small>Dringlichkeit und nächster sinnvoller Schritt</small></div></div>
            <div className="demo-route-line" />
            <div className="demo-route-item"><span><UserRound size={17} /></span><div><b>Ansprechpartner</b><small>Passender regionaler Kontakt</small></div></div>
            <div className="demo-route-line" />
            <div className="demo-route-item"><span><Wrench size={17} /></span><div><b>Auftrag</b><small>Nur wenn du ihn wirklich beauftragen möchtest</small></div></div>
          </div>
          <div className="demo-note"><Sparkles size={14} /> Du entscheidest bei jedem Schritt selbst.</div>
        </div>
      </section>

      <section className="service-ways-wrap" id="so-funktionierts">
        <div className="service-ways">
          <div className="section-heading-row">
            <div>
              <span className="editorial-eyebrow">Genau so viel Hilfe, wie du brauchst</span>
              <h2>Was möchtest du gerade erledigen?</h2>
            </div>
            <p>Kein kompliziertes Portal. Kein Rätselraten über das richtige Gewerk. Wähle einfach dein Ziel.</p>
          </div>
          <div className="service-way-grid">
            {serviceWays.map(({ icon: Icon, title, text, label }) => (
              <article className="service-way-card" key={title}>
                <div className="service-way-icon"><Icon size={20} /></div>
                <h3>{title}</h3>
                <p>{text}</p>
                <Link href="/register?role=homeowner">{label} <ArrowRight size={14} /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section process-section">
        <span className="editorial-eyebrow">Einfach von Anfang bis Ende</span>
        <h2>Du musst nicht wissen, wen du brauchst.</h2>
        <p className="editorial-intro">Einfach Hausen reduziert die Suche auf wenige klare Schritte und hält alle wichtigen Informationen zusammen.</p>
        <div className="process-list">
          {process.map(([i, t, d]) => (
            <article className="process-row" key={i}>
              <span className="process-index">{i}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="editorial-section house-v3 premium-house" id="hausakte">
        <div className="house-v3-copy">
          <span className="editorial-eyebrow">Dein digitales Haus</span>
          <h2>Alles Wichtige bleibt bei deinem Haus.</h2>
          <p className="editorial-intro">Termine, Rechnungen, Kontakte, Anlagen und bisherige Arbeiten landen nicht mehr verstreut in E-Mails, Ordnern und Notizen.</p>
          <div className="house-benefits">
            <span><Check size={15} /> Ansprechpartner wiederfinden</span>
            <span><Check size={15} /> Wartungen im Blick behalten</span>
            <span><Check size={15} /> Rechnungen und Nachweise sammeln</span>
          </div>
          <Link className="text-link" href="/register?role=homeowner">Hausprofil kostenlos anlegen <ArrowRight size={15} /></Link>
        </div>
        <div className="house-record premium-record">
          <div className="record-title"><div><small>MEIN HAUS</small><strong>Hauptstraße 24</strong></div><span>Alles aktuell</span></div>
          <div className="record-row"><UserRound size={18} /><div><strong>Garten</strong><small>Dein Ansprechpartner</small></div><span className="record-status">Thomas Weber</span></div>
          <div className="record-row"><CalendarDays size={18} /><div><strong>Wärmepumpe</strong><small>Nächste Wartung</small></div><span>18.09.2026</span></div>
          <div className="record-row"><Wrench size={18} /><div><strong>Dachrinne</strong><small>Letzte Reinigung · Oktober 2025</small></div><span>Oktober 2026</span></div>
          <div className="record-row"><FileText size={18} /><div><strong>Dokumente</strong><small>Rechnungen, Nachweise und Fotos</small></div><span>12 Dateien</span></div>
        </div>
      </section>

      <section className="customer-outcome premium-outcome">
        <div>
          <span className="editorial-eyebrow">Weniger Organisationsaufwand</span>
          <h2>Eine verlässliche Stelle für dein Zuhause.</h2>
        </div>
        <div className="outcome-list">
          <p><strong><Search size={16} /> Weniger suchen</strong><span>Du startest mit deinem Anliegen, statt Firmenlisten und Gewerke zu durchsuchen.</span></p>
          <p><strong><PhoneCall size={16} /> Persönlich bleiben</strong><span>Wenn du einen Menschen brauchst, bekommst du einen konkreten Ansprechpartner statt anonymer Vermittlung.</span></p>
          <p><strong><FileText size={16} /> Nichts verlieren</strong><span>Alles Wichtige bleibt beim Haus und kann beim nächsten Anliegen wieder genutzt werden.</span></p>
        </div>
      </section>

      <section className="partner-v3-wrap" id="partner">
        <div className="partner-v3">
          <div>
            <span className="editorial-eyebrow">Für regionale Betriebe</span>
            <h2>Passende Aufträge. Weniger Verwaltung.</h2>
            <p>Ein einfacher Arbeitsbereich für Anfragen, Ansprechpartner, Termine und Rechnungen. Kein schweres Handwerker-ERP und keine Provision pro Auftrag.</p>
            <Link className="btn light" href="/register?role=provider">Als Partnerbetrieb starten <ArrowRight size={16} /></Link>
          </div>
          <div className="partner-facts">
            <div className="partner-fact"><strong>Provision pro Auftrag</strong><span>0 %</span></div>
            <div className="partner-fact"><strong>Start-Tarif</strong><span>29 €/Monat</span></div>
            <div className="partner-fact"><strong>Testphase</strong><span>2 Monate kostenlos</span></div>
            <div className="partner-fact"><strong>Prinzip</strong><span>Einfach statt ERP</span></div>
          </div>
        </div>
      </section>

      <section className="final-v3 premium-final">
        <div><span className="editorial-eyebrow">Dein Haus. Einfach organisiert.</span><h2>Beim nächsten Problem weißt du sofort, wo du anfängst.</h2></div>
        <Link className="btn primary premium-primary" href="/register?role=homeowner">Kostenlos starten <ArrowRight size={17} /></Link>
      </section>

      <footer className="marketing-v3-footer">
        <Logo />
        <p>© 2026 Einfach Hausen</p>
        <nav><Link href="/login">Einloggen</Link><Link href="/register?role=provider">Partner werden</Link></nav>
      </footer>
    </main>
  );
}
