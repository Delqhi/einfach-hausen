import Link from 'next/link';
import { HomeownerHausmeisterComposer } from '@/components/homeowner/homeowner-hausmeister-composer';
import { AppShell } from '@/components/shell';
import { ArrowRightThin, BookThinIcon, CalendarCheckThinIcon, ChatRoundIcon, NotfallSirenIcon, PersonSmallIcon, RobotIcon } from '@/components/icons';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { dateLabel } from '@/lib/format';
import { primaryProperty } from '@/lib/properties';
import focus from './homeowner-focus.module.css';

// UI-Convergence Welle 1: Neue Priorisierung der Eigentümer-Startseite.
// Vorher standen drei gleich laute Schnellaktionen (Auftrag, Beratung,
// Notfall) vor dem Hausmeister-Composer und konkurrierten mit der
// Hauptaktion, dazu ein FAB der denselben Weg noch einmal anbot.
// Jetzt: Composer zuerst, "Als Nächstes" danach, alles Weitere in einer
// ruhigen "Mehr"-Liste. Datenzugriffe sind unverändert.

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
          <p>{houseContext || 'Dein Zuhause im Überblick.'}</p>
        </section>
        {onboardingPending && (
          <section className="owner-onboarding-banner ehn-onboard-banner" aria-label="Einrichtung unvollständig">
            <p>Du hast die Ersteinrichtung noch nicht abgeschlossen.</p>
            <a href="/app/onboarding">Jetzt weiter einrichten</a>
          </section>
        )}

        {/* 1. Hauptaktion. Der Composer steht zuerst, nichts konkurriert davor. */}
        <section className={`ki-card ${focus.composer}`} aria-labelledby="owner-copilot-title">
          <div className="ki-head">
            <div className="ki-robot"><RobotIcon /></div>
            <div className="ki-title-row">
              <h2 id="owner-copilot-title">Frag einfachhausen</h2>
              <span className="ki-badge">KI</span>
            </div>
            <Link className="ki-more" href="/app/hausmeister" aria-label="Hausmeister-Assistent öffnen"><ArrowRightThin /></Link>
          </div>
          <p className="ki-text">Schilder uns dein Problem. Wir bringen dich mit dem richtigen Ansprechpartner in Kontakt oder du vergleichst direkt Angebote.</p>
          <div id="dashboard-composer" className="ki-input-row ehn-composer">
            <HomeownerHausmeisterComposer starterHint="Was ist los bei dir?" />
          </div>
        </section>

        {/* 2. Was jetzt ansteht. */}
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

        {/* 3. Alles Weitere. Leise Liste statt konkurrierender Kacheln. */}
        <section className={focus.more} aria-labelledby="owner-more-title">
          <div className={focus.moreHead}>
            <h3 id="owner-more-title">Mehr</h3>
            <Link href="/app/more">Alles anzeigen <ArrowRightThin /></Link>
          </div>
          <ul className={focus.moreList}>
            <li>
              <Link className={focus.moreRow} href="/app/consultation">
                <span className={focus.moreIcon}><ChatRoundIcon variant="light" /></span>
                <span className={focus.moreText}>
                  <strong>Beratung</strong>
                  <span>Fachliche Einschätzung, ohne gleich einen Auftrag zu starten.</span>
                </span>
                <span className={focus.moreChevron} aria-hidden="true"><ArrowRightThin /></span>
              </Link>
            </li>
            <li>
              <Link className={focus.moreRow} href="/app/year">
                <span className={focus.moreIcon}><BookThinIcon /></span>
                <span className={focus.moreText}>
                  <strong>Mein Jahr</strong>
                  <span>Wartungen planen und fällige Arbeiten im Blick behalten.</span>
                </span>
                <span className={focus.moreChevron} aria-hidden="true"><ArrowRightThin /></span>
              </Link>
            </li>
            <li>
              <Link className={`${focus.moreRow} ${focus.alert}`} href="/app/emergency">
                <span className={focus.moreIcon}><NotfallSirenIcon /></span>
                <span className={focus.moreText}>
                  <strong>Notfall</strong>
                  <span>Wasser, Heizung, Strom: schnelle Hilfe in dringenden Fällen.</span>
                </span>
                <span className={focus.moreChevron} aria-hidden="true"><ArrowRightThin /></span>
              </Link>
            </li>
          </ul>
        </section>

        <div className="home-indicator" aria-hidden="true" />
      </div>
    </AppShell>
  );
}
