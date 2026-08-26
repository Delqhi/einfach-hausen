import Link from 'next/link';
import { AlertTriangle, ArrowRight, CalendarDays, CheckCircle2, House, MessageCircle, ShieldCheck, Wrench } from 'lucide-react';
import { AppShell } from '@/components/shell';
import { HomeownerHausmeisterComposer } from '@/components/homeowner/homeowner-hausmeister-composer';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { dateLabel } from '@/lib/format';

export default async function Dashboard() {
  const user = await requireUser('homeowner');
  const profile = db.prepare('SELECT address,postcode,onboarding_step FROM homeowner_profiles WHERE user_id=?').get(user.id) as any;
  const onboardingPending = profile?.onboarding_step && profile.onboarding_step !== 'done';
  const nextAppointment = db.prepare(`SELECT a.*,j.title,p.business_name FROM appointments a JOIN jobs j ON j.id=a.job_id JOIN provider_profiles p ON p.user_id=a.provider_id WHERE a.homeowner_id=? AND a.status='confirmed' AND datetime(a.start_at)>=datetime('now') ORDER BY a.start_at LIMIT 1`).get(user.id) as any;
  const openOffer = db.prepare(`SELECT id,title FROM jobs WHERE homeowner_id=? AND request_kind='service' AND status='quoted' ORDER BY updated_at DESC LIMIT 1`).get(user.id) as any;
  const activeJob = db.prepare(`SELECT id,title,status FROM jobs WHERE homeowner_id=? AND request_kind='service' AND status IN ('accepted','in_progress') ORDER BY updated_at DESC LIMIT 1`).get(user.id) as any;
  const dueTask = db.prepare(`SELECT id,title,due_date FROM maintenance_tasks WHERE homeowner_id=? AND status='open' AND due_date<=date('now','+45 day') ORDER BY due_date LIMIT 1`).get(user.id) as any;
  const hasNextThings = Boolean(openOffer || nextAppointment || dueTask || activeJob);

  return (
    <AppShell role="homeowner" active="/app" title="Mein Zuhause" subtitle="Dein Haus-Copilot">
      <div className="owner-dashboard">
        <header className="owner-dashboard-intro">
          <span className="soft-kicker">Mein Zuhause</span>
          <h1>Hallo, {user.first_name}.</h1>
          <p><House aria-hidden="true" /> {profile?.address || profile?.postcode || 'Hausprofil noch nicht vollständig'}</p>
        </header>

        {onboardingPending && (
          <section className="owner-onboarding-banner" aria-label="Einrichtung unvollständig">
            <p>Du hast die Ersteinrichtung noch nicht abgeschlossen.</p>
            <a href="/app/onboarding">Jetzt weiter einrichten</a>
          </section>
        )}

        <section className="owner-copilot" aria-labelledby="owner-copilot-title">
          <div className="owner-copilot-copy">
            <span>Hausmeister</span>
            <h2 id="owner-copilot-title">Was ist bei deinem Haus gerade wichtig?</h2>
            <p>Schreib, sprich oder zeig per Foto, was los ist. Wir klären zuerst dein Anliegen. Einen Ansprechpartner oder Auftrag startest du nur, wenn du das ausdrücklich auswählst.</p>
          </div>
          <div id="dashboard-composer" className="owner-dashboard-composer">
            <HomeownerHausmeisterComposer />
          </div>
          <div className="owner-copilot-meta">
            <span><ShieldCheck aria-hidden="true" /> Kein Auftrag ohne deine Freigabe</span>
            <div>
              <Link href="/app/consultation"><MessageCircle aria-hidden="true" /> Direkt einen Menschen fragen</Link>
              <Link href="/app/emergency"><AlertTriangle aria-hidden="true" /> Dringender Notfall</Link>
            </div>
          </div>
        </section>

        <section className="owner-next-section" aria-labelledby="owner-next-title">
          <div className="owner-section-heading">
            <div>
              <span>Als Nächstes</span>
              <h2 id="owner-next-title">Nur das, was jetzt zählt.</h2>
            </div>
            <Link href="/app/jobs">Alle Vorgänge</Link>
          </div>

          {hasNextThings ? (
            <div className="owner-next-list">
              {openOffer && (
                <Link href={`/app/jobs/${openOffer.id}`} className="owner-next-row">
                  <span className="owner-next-icon"><ShieldCheck aria-hidden="true" /></span>
                  <span className="owner-next-copy"><small>Entscheidung offen</small><strong>{openOffer.title}</strong><span>Angebote vergleichen und bewusst auswählen.</span></span>
                  <ArrowRight aria-hidden="true" />
                </Link>
              )}
              {nextAppointment && (
                <Link href={`/app/jobs/${nextAppointment.job_id}`} className="owner-next-row">
                  <span className="owner-next-icon"><CalendarDays aria-hidden="true" /></span>
                  <span className="owner-next-copy"><small>Nächster Termin · {dateLabel(nextAppointment.start_at)}</small><strong>{nextAppointment.title}</strong><span>{nextAppointment.business_name}</span></span>
                  <ArrowRight aria-hidden="true" />
                </Link>
              )}
              {dueTask && (
                <Link href="/app/year" className="owner-next-row">
                  <span className="owner-next-icon"><Wrench aria-hidden="true" /></span>
                  <span className="owner-next-copy"><small>Wartung · {dateLabel(dueTask.due_date)}</small><strong>{dueTask.title}</strong><span>In deinem Hausjahresplan prüfen.</span></span>
                  <ArrowRight aria-hidden="true" />
                </Link>
              )}
              {activeJob && (
                <Link href={`/app/jobs/${activeJob.id}`} className="owner-next-row">
                  <span className="owner-next-icon"><Wrench aria-hidden="true" /></span>
                  <span className="owner-next-copy"><small>{activeJob.status === 'in_progress' ? 'In Arbeit' : 'Gebucht'}</small><strong>{activeJob.title}</strong><span>Status, Termin und Ansprechpartner ansehen.</span></span>
                  <ArrowRight aria-hidden="true" />
                </Link>
              )}
            </div>
          ) : (
            <div className="owner-calm-state" role="status">
              <CheckCircle2 aria-hidden="true" />
              <div><strong>Gerade ist nichts dringend.</strong><p>Wenn etwas auftaucht, beschreib es oben einfach in deinen eigenen Worten.</p></div>
            </div>
          )}
        </section>

        <div className="owner-house-link">
          <House aria-hidden="true" />
          <div><strong>Deine Hausakte</strong><p>Technik, Wartungen, Dokumente, Historie und Ansprechpartner bleiben dauerhaft beim Haus.</p></div>
          <Link href="/app/home">Mein Haus öffnen <ArrowRight aria-hidden="true" /></Link>
        </div>
      </div>
    </AppShell>
  );
}
