import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  CircleCheck,
  FileText,
  Home,
  LockKeyhole,
  MessageCircle,
  PhoneCall,
  ReceiptText,
  Search,
  ShieldCheck,
  UserRound,
  Wrench,
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { Logo } from '@/components/logo';

const steps = [
  ['01', 'Beschreiben', 'Sag in einem Satz, was los ist. Du musst weder Gewerk noch Fachbegriff kennen.'],
  ['02', 'Entscheiden', 'Nur Rat, einen passenden Menschen sprechen oder die Arbeit wirklich erledigen lassen.'],
  ['03', 'Erledigen', 'Einfach Hausen hält Ansprechpartner, Termin, Angebot, Rechnung und Hauswissen zusammen.'],
] as const;

const outcomes = [
  {
    icon: Search,
    title: 'Nicht erst zehn Firmen suchen',
    text: 'Du startest mit deinem Problem. Wir helfen dir beim richtigen nächsten Schritt und finden bei Bedarf passende regionale Betriebe.',
  },
  {
    icon: UserRound,
    title: 'Nicht jedes Mal bei null anfangen',
    text: 'Ein guter Ansprechpartner bleibt bei deinem Haus gespeichert. Beim nächsten Thema weißt du sofort, wen du ansprechen kannst.',
  },
  {
    icon: FileText,
    title: 'Nicht mehr alles zusammensuchen',
    text: 'Rechnungen, Termine, Wartungen, Fotos und frühere Arbeiten bleiben dauerhaft in deiner Hausakte.',
  },
] as const;

export default async function Landing() {
  const user = await getCurrentUser();
  if (user) redirect(user.role === 'provider' ? '/pro' : '/app');

  return (
    <main className="marketing-v3 customer-first conversion-site">
      <header className="marketing-v3-header conversion-header">
        <Link href="/" aria-label="Einfach Hausen Startseite"><Logo /></Link>
        <nav aria-label="Hauptnavigation">
          <a href="#so-funktionierts">So funktioniert&apos;s</a>
          <a href="#warum">Warum Einfach Hausen</a>
          <a href="#hausakte">Mein Haus</a>
          <a href="#partner">Für Betriebe</a>
        </nav>
        <div className="marketing-v3-actions">
          <Link className="marketing-v3-login" href="/login">Einloggen</Link>
          <Link className="btn primary conversion-header-cta" href="/register?role=homeowner">Kostenlos starten</Link>
        </div>
      </header>

      <section className="conversion-hero">
        <div className="conversion-hero-copy">
          <span className="conversion-kicker"><Home size={14}/> Für Menschen mit einem Zuhause</span>
          <h1>Wenn am Haus etwas ist, <span>weißt du sofort, wo du anfängst.</span></h1>
          <p>Eine Frage, ein Defekt oder eine anstehende Arbeit: Beschreib kurz, was los ist. Einfach Hausen hilft dir beim Einordnen, verbindet dich auf Wunsch mit dem richtigen Menschen und organisiert den Auftrag, wenn du ihn wirklich vergeben möchtest.</p>

          <form className="public-intake" action="/register" method="get">
            <input type="hidden" name="role" value="homeowner"/>
            <label htmlFor="public-request">Was steht bei dir an?</label>
            <div className="public-intake-row">
              <input id="public-request" name="request" minLength={4} maxLength={700} required placeholder="z. B. Die Heizung macht Geräusche …"/>
              <button type="submit">Kostenlos weiter <ArrowRight size={17}/></button>
            </div>
            <div className="public-intake-meta">
              <span><CircleCheck/> Hauskonto kostenlos</span>
              <span><CircleCheck/> unverbindlich</span>
              <span><CircleCheck/> noch kein Auftrag</span>
            </div>
          </form>

          <div className="example-prompts" aria-label="Beispiele">
            <span>Zum Beispiel:</span>
            <a href="/register?role=homeowner&request=Meine%20Heizung%20macht%20seit%20gestern%20ungew%C3%B6hnliche%20Ger%C3%A4usche.">Heizung macht Geräusche</a>
            <a href="/register?role=homeowner&request=Meine%20Hecke%20muss%20geschnitten%20werden.">Hecke schneiden</a>
            <a href="/register?role=homeowner&request=Ich%20habe%20einen%20feuchten%20Fleck%20an%20der%20Kellerwand.">Feuchte Kellerwand</a>
          </div>
        </div>

        <div className="conversion-hero-product" aria-label="So hilft Einfach Hausen">
          <div className="product-window-head">
            <div className="product-home-mark"><Home size={18}/></div>
            <div><small>Einfach Hausen</small><strong>Was brauchst du gerade?</strong></div>
            <span>bereit</span>
          </div>
          <div className="product-question">„Meine Heizung macht seit gestern komische Geräusche. Muss da jemand kommen?“</div>
          <div className="product-response">
            <p>Wir helfen dir zuerst beim Einordnen. Danach entscheidest du selbst, wie es weitergeht.</p>
            <div className="product-choice"><MessageCircle/><span><strong>Frage klären</strong><small>Erst verstehen, was sinnvoll ist</small></span><ChevronRight/></div>
            <div className="product-choice"><UserRound/><span><strong>Ansprechpartner finden</strong><small>Mit einem passenden Menschen sprechen</small></span><ChevronRight/></div>
            <div className="product-choice featured"><Wrench/><span><strong>Auftrag organisieren</strong><small>Angebote, Termin und Ausführung</small></span><ChevronRight/></div>
          </div>
          <div className="product-assurance"><LockKeyhole size={14}/> Du entscheidest. Nichts wird automatisch beauftragt.</div>
        </div>
      </section>

      <section className="credibility-strip" aria-label="Vertrauen">
        <div><BadgeCheck/><span><strong>Geprüfte Vertragspartner</strong><small>Keine offene Firmenliste</small></span></div>
        <div><ShieldCheck/><span><strong>Matching nach Eignung</strong><small>Kein Partner kauft sich nach oben</small></span></div>
        <div><UserRound/><span><strong>Konkreter Ansprechpartner</strong><small>Persönlich statt anonym</small></span></div>
        <div><Home/><span><strong>Hausakte inklusive</strong><small>Wissen bleibt bei deinem Haus</small></span></div>
      </section>

      <section className="conversion-section why-section" id="warum">
        <div className="conversion-section-head">
          <span>Der eigentliche Vorteil</span>
          <h2>Ein Haus macht genug Arbeit. Die Organisation muss es nicht.</h2>
          <p>Einfach Hausen ersetzt nicht den guten Handwerker. Es ersetzt das Suchen, Hinterhertelefonieren und jedes Mal wieder von vorne anfangen.</p>
        </div>
        <div className="outcome-grid">
          {outcomes.map(({icon:Icon,title,text})=><article key={title}><Icon/><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="conversion-process-wrap" id="so-funktionierts">
        <div className="conversion-section conversion-process">
          <div className="conversion-section-head compact">
            <span>So funktioniert&apos;s</span>
            <h2>Ein Anliegen. Drei klare Schritte.</h2>
          </div>
          <div className="conversion-step-list">
            {steps.map(([number,title,text])=><article key={number}><b>{number}</b><div><h3>{title}</h3><p>{text}</p></div></article>)}
          </div>
          <div className="conversion-paths">
            <div><MessageCircle/><strong>Nur eine Frage?</strong><span>Du kannst erst Rat holen, ohne einen Auftrag auszulösen.</span></div>
            <div><UserRound/><strong>Lieber persönlich?</strong><span>Wir verbinden dich mit einem passenden Ansprechpartner.</span></div>
            <div><Wrench/><strong>Soll es erledigt werden?</strong><span>Dann werden passende Partner, Angebote und Termine organisiert.</span></div>
          </div>
        </div>
      </section>

      <section className="conversion-section house-story" id="hausakte">
        <div className="house-story-copy">
          <span>Dein Haus vergisst nichts</span>
          <h2>Aus jedem erledigten Thema wird wertvolles Hauswissen.</h2>
          <p>Einfach Hausen ist nicht nur für den nächsten Auftrag da. Die Hausakte wächst mit: Arbeiten, Rechnungen, Garantien, Ansprechpartner, Technik und Wartungen bleiben an derselben Immobilie gespeichert.</p>
          <ul>
            <li><Check/> Frühere Arbeiten und Sanierungen dokumentieren</li>
            <li><Check/> Rechnungen und Garantien wiederfinden</li>
            <li><Check/> Ansprechpartner nach Bereichen behalten</li>
            <li><Check/> Hausakte bei Eigentümerwechsel übergeben</li>
          </ul>
          <Link className="text-link strong-link" href="/register?role=homeowner">Hauskonto kostenlos anlegen <ArrowRight size={15}/></Link>
        </div>
        <div className="house-story-card">
          <div className="house-story-title"><div><small>MEIN HAUS</small><strong>Hauptstraße 24</strong></div><span><CircleCheck/> aktuell</span></div>
          <div className="house-story-timeline">
            <div><span>2026</span><i/><div><strong>Heckenschnitt</strong><small>Thomas Weber · Rechnung abgelegt</small></div></div>
            <div><span>2025</span><i/><div><strong>Dachsanierung</strong><small>Garantie bis Juni 2030</small></div></div>
            <div><span>2024</span><i/><div><strong>Wärmepumpe</strong><small>Nächste Wartung im September</small></div></div>
          </div>
          <div className="house-story-footer"><ReceiptText/><span><strong>Alles an einem Ort</strong><small>Rechnungen · Termine · Kontakte · Historie</small></span></div>
        </div>
      </section>

      <section className="trust-section">
        <div className="conversion-section trust-inner">
          <div className="conversion-section-head compact light-head">
            <span>Vertrauen ist wichtiger als Reichweite</span>
            <h2>Du sollst nicht irgendeinen Betrieb bekommen.</h2>
            <p>Partner werden geprüft und vertraglich gebunden. Beim Matching zählen Eignung, Region, Qualität, Verfügbarkeit und bestehende Beziehungen – nicht der gebuchte Partner-Tarif.</p>
          </div>
          <div className="trust-check-grid">
            <div><ShieldCheck/><span><strong>Unternehmen geprüft</strong><small>Gewerbe, Vertrag und Qualitätsstatus</small></span></div>
            <div><BadgeCheck/><span><strong>Qualifikation berücksichtigt</strong><small>Passend zur benötigten Leistung</small></span></div>
            <div><PhoneCall/><span><strong>Ein Mensch bleibt erreichbar</strong><small>Konkreter Ansprechpartner beim Betrieb</small></span></div>
            <div><LockKeyhole/><span><strong>Hausdaten bleiben kontrolliert</strong><small>Freigaben nur bewusst und zweckgebunden</small></span></div>
          </div>
        </div>
      </section>

      <section className="conversion-section free-section">
        <div>
          <span>Ohne Hürde ausprobieren</span>
          <h2>Das Hauskonto kostet 0 €.</h2>
          <p>Du kannst Anliegen klären, Ansprechpartner speichern, Aufträge organisieren und deine Hausakte aufbauen. Plus- und Premium-Funktionen sind später optional.</p>
        </div>
        <Link className="btn primary big-cta" href="/register?role=homeowner">Kostenlos starten <ArrowRight size={17}/></Link>
      </section>

      <section className="partner-v3-wrap conversion-partner" id="partner">
        <div className="partner-v3">
          <div>
            <span className="editorial-eyebrow">Für regionale Betriebe</span>
            <h2>Passende Anfragen. Persönlicher Kundenkontakt. 0 % Provision.</h2>
            <p>Ein einfacher Arbeitsbereich für Anfragen, Team, Termine, Rechnungen und bestehende Kundenbeziehungen. Kein schweres ERP und keine Gebühr pro Auftrag.</p>
            <Link className="btn light" href="/register?role=provider">Als Partnerbetrieb starten <ArrowRight size={16}/></Link>
          </div>
          <div className="partner-facts">
            <div className="partner-fact"><strong>Provision pro Auftrag</strong><span>0 %</span></div>
            <div className="partner-fact"><strong>Start-Tarif</strong><span>29 €/Monat</span></div>
            <div className="partner-fact"><strong>Testphase</strong><span>2 Monate kostenlos</span></div>
            <div className="partner-fact"><strong>Team</strong><span>Ein Konto, mehrere Kontakte</span></div>
          </div>
        </div>
      </section>

      <section className="final-v3 conversion-final">
        <div><span>Beim nächsten Problem nicht wieder suchen.</span><h2>Beschreib einfach, was bei deinem Haus ansteht.</h2><p>Kostenlos, unverbindlich und ohne automatische Beauftragung.</p></div>
        <Link className="btn primary big-cta" href="/register?role=homeowner">Anliegen starten <ArrowRight size={17}/></Link>
      </section>

      <footer className="marketing-v3-footer conversion-footer">
        <Logo />
        <p>© 2026 Einfach Hausen</p>
        <nav><Link href="/login">Einloggen</Link><Link href="/register?role=provider">Partner werden</Link></nav>
      </footer>
    </main>
  );
}
