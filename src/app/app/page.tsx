import Link from 'next/link';
import { HomeownerHausmeisterComposer } from '@/components/homeowner/homeowner-hausmeister-composer';
import { AppShell } from '@/components/shell';
import { ArrowRightThin, BookThinIcon, CalendarCheckThinIcon, ChatRoundIcon, NotfallSirenIcon, PersonSmallIcon, RobotIcon } from '@/components/icons';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';

export default async function Dashboard() {
  const user = await requireUser('homeowner');
  const profile = db.prepare('SELECT address,postcode,onboarding_step FROM homeowner_profiles WHERE user_id=?').get(user.id) as any;
  const onboardingPending = profile?.onboarding_step && profile.onboarding_step !== 'done';
  const activeJobs = (db.prepare(`SELECT COUNT(*) c FROM jobs WHERE homeowner_id=? AND status NOT IN ('completed','cancelled')`).get(user.id) as {c:number}).c;
  const savedContacts = (db.prepare('SELECT COUNT(*) c FROM homeowner_contacts WHERE homeowner_id=?').get(user.id) as {c:number}).c;

  return (
    <AppShell role="homeowner" active="/app" title="Mein Zuhause" subtitle="Dein Haus-Copilot">
      <div className="own-dash ehn-dash">
        {onboardingPending && (
          <section className="owner-onboarding-banner ehn-onboard-banner" aria-label="Einrichtung unvollständig">
            <p>Du hast die Ersteinrichtung noch nicht abgeschlossen.</p>
            <a href="/app/onboarding">Jetzt weiter einrichten</a>
          </section>
        )}

        <section className="qa-row" aria-label="Schnellaktionen">
          <a className="qa-card" href="#dashboard-composer">
            <div className="qa-icon qa-dark"><ChatRoundIcon variant="dark" /></div>
            <strong>Auftrag</strong>
            <span>Handwerker beauftragen und Angebote erhalten.</span>
            <div className="qa-arrow"><ArrowRightThin /></div>
          </a>
          <Link className="qa-card" href="/app/consultation">
            <div className="qa-icon"><ChatRoundIcon variant="light" /></div>
            <strong>Beratung</strong>
            <span>Fachliche Hilfe und Empfehlungen.</span>
            <div className="qa-arrow"><ArrowRightThin /></div>
          </Link>
          <Link className="qa-card qa-alert" href="/app/emergency">
            <div className="qa-icon"><NotfallSirenIcon /></div>
            <strong>Notfall</strong>
            <span>Schnelle Hilfe in dringenden Fällen.</span>
            <div className="qa-arrow"><ArrowRightThin /></div>
          </Link>
        </section>

        <section className="ki-card" aria-labelledby="owner-copilot-title">
          <div className="ki-head">
            <div className="ki-robot"><RobotIcon /></div>
            <div className="ki-title-row">
              <h2 id="owner-copilot-title">Frag einfachhausen</h2>
              <span className="ki-badge">KI</span>
            </div>
            <Link className="ki-more" href="/app/hausmeister" aria-label="Hausmeister-Assistent öffnen"><ArrowRightThin /></Link>
          </div>
          <p className="ki-text">Schilder uns dein Problem. Wir bringen dich mit dem richtigen Ansprechpartner in Kontakt oder willst du direkt Angebote vergleichen?</p>
          <div id="dashboard-composer" className="ki-input-row ehn-composer">
            <HomeownerHausmeisterComposer starterHint="Was ist los bei dir?" />
          </div>
        </section>

        <h3 className="own-section-title">Mein Zuhause im Überblick</h3>
        <div className="overview-grid">
          <Link className="ov-card" href="/app/jobs">
            <div className="ov-icon"><CalendarCheckThinIcon /></div>
            <div className="ov-text"><strong>Aktuelle Aufträge</strong><span>{activeJobs} aktiv</span></div>
            <ArrowRightThin />
          </Link>
          <Link className="ov-card" href="/app/partners">
            <div className="ov-icon"><PersonSmallIcon /></div>
            <div className="ov-text"><strong>Ansprechpartner</strong><span>{savedContacts} gespeichert</span></div>
            <ArrowRightThin />
          </Link>
        </div>
        <Link className="ov-card ov-wide" href="/app/home/history">
          <div className="ov-icon ov-icon-lg"><BookThinIcon /></div>
          <div className="ov-text"><strong>Haus-Historie ansehen</strong><span>Alle Ereignisse, Maßnahmen und Dokumente rund um dein Zuhause.</span></div>
          <ArrowRightThin />
        </Link>

        <Link className="fab-plus" href="/app/hausmeister" aria-label="Neue Anfrage starten">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" /></svg>
        </Link>
        <div className="home-indicator" aria-hidden="true" />
      </div>
    </AppShell>
  );
}
