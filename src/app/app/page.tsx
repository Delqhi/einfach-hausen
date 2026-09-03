import Link from 'next/link';
import { HomeownerHausmeisterComposer } from '@/components/homeowner/homeowner-hausmeister-composer';
import { AppShell } from '@/components/shell';
import { ArrowRightThin, BookThinIcon, CalendarCheckThinIcon, ChatRoundIcon, NotfallSirenIcon, PersonSmallIcon, RobotIcon } from '@/components/icons';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { dateLabel } from '@/lib/format';
import { primaryProperty } from '@/lib/properties';

export default async function Dashboard() {
  const user = await requireUser('homeowner');
  const profile = db.prepare('SELECT address,postcode,onboarding_step FROM homeowner_profiles WHERE user_id=?').get(user.id) as any;
  const onboardingPending = profile?.onboarding_step && profile.onboarding_step !== 'done';
  const property = primaryProperty(user.id);
  const houseAddress = property?.address || profile?.address || '';
  const housePostcode = property?.postcode || profile?.postcode || '';
  const houseContext = [houseAddress, housePostcode].filter(Boolean).join(', ');

  const nextAppointment = db.prepare(
    `SELECT a.*,j.title,p.business_name FROM appointments a JOIN jobs j ON j.id=a.job_id JOIN provider_profiles p ON p.user_id=a.provider_id WHERE a.homeowner_id=? AND a.status='confirmed' AND datetime(a.start_at) >= datetime('now') ORDER BY datetime(a.start_at) ASC LIMIT 1`
  ).get(user.id) as any;

  const openDecision = db.prepare(
    `SELECT * FROM jobs WHERE homeowner_id=? AND status='quoted' ORDER BY updated_at DESC LIMIT 1`
  ).get(user.id) as any;
  const openDecisionQuotes = openDecision
    ? (db.prepare(`SELECT COUNT(*) c FROM quotes WHERE job_id=? AND status='pending'`).get(openDecision.id) as {c:number}).c
    : 0;

  const dueMaintenance = property
    ? db.prepare(`SELECT * FROM maintenance_tasks WHERE property_id=? AND status='open' ORDER BY date(due_date) ASC LIMIT 1`).get(property.id) as any
    : null;

  const nextSteps = [
    nextAppointment ? 'appointment' : null,
    openDecision ? 'decision' : null,
    dueMaintenance ? 'maintenance' : null,
  ].filter(Boolean) as string[];

  return (
    <AppShell role="homeowner" active="/app" title="Mein Zuhause" subtitle="Dein Haus-Copilot">
      <div className="own-dash ehn-dash">
        <h1 className="owner-visually-hidden">Mein Zuhause</h1>
        <section className="owner-dashboard-intro" aria-label="Begrüßung">
          <h1>Hallo {user.first_name}.</h1>
          <p>{houseContext ? `${houseContext}` : 'Dein Zuhause im Überblick.'}</p>
        </section>
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

        <h3 className="own-section-title">Als Nächstes</h3>
        {nextSteps.length === 0 ? (
          <div className="empty compact" role="status">
            <p>Gerade steht nichts an. Beschreib oben dein Anliegen oder plane eine Wartung über <Link href="/app/year">Mein Jahr</Link>.</p>
          </div>
        ) : (
          <>
            {(nextAppointment || openDecision) && (
            <div className="overview-grid">
              {nextAppointment && (
                <Link className="ov-card" href={`/app/jobs/${nextAppointment.job_id}`}>
                  <div className="ov-icon"><CalendarCheckThinIcon /></div>
                  <div className="ov-text"><strong>Nächster Termin</strong><span>{nextAppointment.title} · {nextAppointment.business_name} · {dateLabel(nextAppointment.start_at)}</span></div>
                  <ArrowRightThin />
                </Link>
              )}
              {openDecision && (
                <Link className="ov-card" href={`/app/jobs/${openDecision.id}`}>
                  <div className="ov-icon"><PersonSmallIcon /></div>
                  <div className="ov-text"><strong>Offene Entscheidung</strong><span>{openDecision.title}{openDecisionQuotes > 0 ? ` · ${openDecisionQuotes} ${openDecisionQuotes === 1 ? 'Angebot' : 'Angebote'} prüfen` : ''}</span></div>
                  <ArrowRightThin />
                </Link>
              )}
            </div>
            )}
            {dueMaintenance && (
              <Link className="ov-card ov-wide" href="/app/year">
                <div className="ov-icon ov-icon-lg"><BookThinIcon /></div>
                <div className="ov-text"><strong>Fällige Wartung</strong><span>{dueMaintenance.title} · {dateLabel(dueMaintenance.due_date)}</span></div>
                <ArrowRightThin />
              </Link>
            )}
          </>
        )}

        <Link className="fab-plus" href="/app/hausmeister" aria-label="Neue Anfrage starten">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" /></svg>
        </Link>
        <div className="home-indicator" aria-hidden="true" />
      </div>
    </AppShell>
  );
}
