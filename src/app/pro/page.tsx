import Link from 'next/link';
import { ArrowRight, Building2, CalendarDays, ClipboardList, MapPin, MessageSquare, ShieldAlert, ShieldCheck, UserRound, Users } from 'lucide-react';
import { AppShell } from '@/components/shell';
import { ProviderPageIntro, ProviderSectionHeader, ProviderState, ProviderStatusLine } from '@/components/provider/workspace';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { dateLabel, euro, statusLabel } from '@/lib/format';
import { getProviderContext } from '@/lib/provider';
import { providerHasCategory } from '@/lib/provider-categories';

export default async function Pro() {
  const u = await requireUser('provider');
  const ctx = getProviderContext(u.id);

  if (!ctx) {
    return (
      <AppShell role="provider" active="/pro" title="Partnerbereich" subtitle="Zugang prüfen">
        <ProviderState
          icon={<ShieldAlert size={21} />}
          title="Keinem Unternehmen zugeordnet"
          description="Dein App-Zugang ist aktuell keinem aktiven Partnerunternehmen zugeordnet. Bitte lass die Unternehmenszuordnung prüfen."
          tone="unavailable"
        />
      </AppShell>
    );
  }

  const p = db.prepare(`SELECT p.*,c.status contract_status,c.customer_discount_bps,c.insurance_verified,c.qualification_verified,c.contract_verified,c.quality_standard_verified,c.response_target_minutes FROM provider_profiles p LEFT JOIN partner_contracts c ON c.provider_id=p.user_id WHERE p.user_id=?`).get(ctx.providerId) as any;

  if (!p?.verified || p.contract_status !== 'active') {
    return (
      <AppShell role="provider" active="/pro" title="Partnerbereich" subtitle={ctx.businessName}>
        <ProviderPageIntro
          eyebrow="Partnerzugang"
          title={`Guten Tag, ${u.first_name}.`}
          description="Bevor neue Anfragen sichtbar werden, muss der Unternehmens- und Vertragsstatus vollständig aktiv sein."
        />
        <ProviderState
          icon={<ShieldAlert size={21} />}
          title={!p?.verified ? 'Unternehmensprüfung ausstehend' : 'Partnervertrag noch nicht aktiv'}
          description="Einfach Hausen arbeitet nur mit geprüften, vertraglich gebundenen regionalen Unternehmen. Der Firmeninhaber sieht den aktuellen Prüf- und Vertragsstatus im Profil."
          action={{ href: '/pro/profile', label: 'Partnerstatus ansehen' }}
          tone="unavailable"
        />
      </AppShell>
    );
  }

  const requests = ctx.canManageJobs
    ? db.prepare(`SELECT d.id dispatch_id,d.status dispatch_status,d.match_score,d.distance_km,d.sent_at,j.*,(SELECT path FROM job_photos x WHERE x.job_id=j.id LIMIT 1) photo,(SELECT amount FROM quotes q WHERE q.job_id=j.id AND q.provider_id=?) my_quote FROM job_dispatches d JOIN jobs j ON j.id=d.job_id WHERE d.provider_id=? AND d.status IN ('sent','viewed','quoted') AND j.status IN ('open','quoted') ORDER BY d.sent_at DESC LIMIT 30`).all(ctx.providerId, ctx.providerId) as any[]
    : [];
  const assigned = db.prepare(`SELECT j.*,q.amount,u.first_name homeowner_first,u.last_name homeowner_last FROM job_assignments a JOIN jobs j ON j.id=a.job_id LEFT JOIN quotes q ON q.id=j.accepted_quote_id JOIN users u ON u.id=j.homeowner_id WHERE a.provider_id=? AND a.contact_user_id=? AND j.status IN ('accepted','in_progress') ORDER BY j.updated_at DESC LIMIT 30`).all(ctx.providerId, u.id) as any[];
  const companyOpen = (db.prepare(`SELECT COUNT(*) c FROM job_dispatches d JOIN jobs j ON j.id=d.job_id WHERE d.provider_id=? AND d.status='accepted' AND j.status!='completed'`).get(ctx.providerId) as any).c;
  const today = (db.prepare(`SELECT COUNT(*) c FROM appointments WHERE contact_user_id=? AND date(start_at)=date('now','localtime') AND status='confirmed'`).get(u.id) as any).c;
  const sub = db.prepare(`SELECT s.status,p.title FROM partner_subscriptions s JOIN partner_plans p ON p.slug=s.plan_slug WHERE s.provider_id=?`).get(ctx.providerId) as any;
  const broker = providerHasCategory(ctx.providerId, 'makler');
  const releasedLeads = broker
    ? (db.prepare(`SELECT COUNT(*) c FROM broker_lead_matches m JOIN sale_leads l ON l.id=m.sale_lead_id JOIN property_shares s ON s.property_id=l.property_id AND s.provider_id=m.provider_id AND s.purpose='sale' AND s.status='active' WHERE m.provider_id=?`).get(ctx.providerId) as { c: number }).c
    : 0;
  const newRequestCount = requests.filter((job) => job.dispatch_status === 'sent').length;

  return (
    <AppShell role="provider" active="/pro" title="Arbeitsbereich" subtitle={`${ctx.businessName} · ${ctx.jobTitle || 'Ansprechpartner'}`}>
      <ProviderPageIntro
        eyebrow="Heute"
        title={`Guten Tag, ${u.first_name}.`}
        description={ctx.canManageJobs ? 'Neue Anfragen prüfen, laufende Arbeit organisieren und Kunden zuverlässig betreuen.' : 'Hier siehst du nur die Aufträge und Kunden, die dir konkret zugewiesen wurden.'}
        action={ctx.canManageJobs && newRequestCount > 0 ? { href: `/pro/jobs/${requests.find((job) => job.dispatch_status === 'sent')?.id}`, label: 'Nächste Anfrage prüfen' } : assigned[0] ? { href: `/pro/jobs/${assigned[0].id}`, label: 'Nächsten Auftrag öffnen' } : undefined}
      />

      <div className="partner-standard-banner">
        <ShieldCheck size={19} />
        <div>
          <strong>Aktiver Vertragspartner · 0 % Provision</strong>
          <small>{sub?.status === 'active' || sub?.status === 'trialing' ? `${sub.title} · ` : 'Free · '}keine Gebühr pro Auftrag · Reaktionsziel {p.response_target_minutes} Min.</small>
        </div>
      </div>

      <div className="provider-summary" aria-label="Arbeitsüberblick">
        <div><small>{ctx.canManageJobs ? 'Neue Anfragen' : 'Meine Aufträge'}</small><strong>{ctx.canManageJobs ? newRequestCount : assigned.length}</strong></div>
        <div><small>Offen im Betrieb</small><strong>{companyOpen}</strong></div>
        <div><small>Meine Termine heute</small><strong>{today}</strong></div>
      </div>

      <ProviderStatusLine>
        <Link href="/pro/calendar"><CalendarDays size={16} /> Termine</Link>
        <Link href="/pro/messages"><MessageSquare size={16} /> Kundenkontakt</Link>
        <Link href="/pro/profile"><UserRound size={16} /> Profil & Vertrauen</Link>
      </ProviderStatusLine>

      {broker && (
        <Link href="/pro/leads" className="provider-leads-card pro-request simple">
          <Building2 />
          <div className="grow">
            <strong>Immobilien-Leads</strong>
            <small>{releasedLeads ? `${releasedLeads} ausdrücklich freigegebene Kontakte warten.` : 'Kontaktdaten werden erst nach ausdrücklicher Freigabe des Eigentümers sichtbar.'}</small>
            <span className="provider-next-action">Freigegebene Kontakte öffnen <ArrowRight size={14} /></span>
          </div>
        </Link>
      )}

      {ctx.canManageJobs && (
        <>
          <ProviderSectionHeader title="Neue Anfragen" description="Passende Arbeit, die jetzt eine Entscheidung braucht." />
          <div className="stack">
            {requests.map((job) => {
              const nextAction = job.my_quote ? 'Angebot ansehen' : job.request_kind === 'contact' ? 'Kontaktanfrage prüfen' : 'Anfrage prüfen';
              return (
                <Link href={`/pro/jobs/${job.id}`} className="pro-request" key={job.dispatch_id}>
                  <div className="request-main">
                    {job.dispatch_status === 'sent' && !job.my_quote && <span className="new">Neu</span>}
                    <strong>{job.title.replace(/^Ansprechpartner:\s*/, '')}</strong>
                    <div className="provider-row-meta">
                      <span><MapPin /> {job.postcode || 'Region'}</span>
                      <span><CalendarDays /> {job.request_kind === 'contact' ? 'Kontakt gewünscht' : dateLabel(job.preferred_date)}</span>
                    </div>
                    <small><ClipboardList /> {job.description.length > 96 ? `${job.description.slice(0, 96)}…` : job.description}</small>
                    <span className="provider-next-action">{nextAction} <ArrowRight size={14} /></span>
                  </div>
                  {job.photo && <img src={job.photo} alt="" />}
                  <div className="provider-row-side">
                    <span className={`status ${job.dispatch_status}`}>{job.my_quote ? 'Angebot gesendet' : 'Offen'}</span>
                    <strong>{job.request_kind === 'contact' ? 'Kein Preis nötig' : job.my_quote ? euro(job.my_quote) : job.budget_min && job.budget_max ? `${euro(job.budget_min)} – ${euro(job.budget_max)}` : euro(job.budget_max)}</strong>
                  </div>
                </Link>
              );
            })}
            {requests.length === 0 && (
              <ProviderState
                icon={<ClipboardList size={21} />}
                title="Keine neue passende Anfrage"
                description="Neue Anfragen erscheinen hier nur, wenn Gewerk, Region, Kapazität und Qualitätsstandard passen. Bezahlte Tarife kaufen keine bessere Ranking-Position."
              />
            )}
          </div>
        </>
      )}

      <ProviderSectionHeader
        title={ctx.canManageJobs ? 'Meine zugewiesenen Aufträge' : 'Meine Aufträge'}
        description="Nur Themen, bei denen du der konkrete Ansprechpartner bist."
        href="/pro/orders"
        actionLabel="Alle Aufträge"
      />
      <div className="stack">
        {assigned.map((job) => (
          <Link href={`/pro/jobs/${job.id}`} className="pro-request simple" key={job.id}>
            <ClipboardList />
            <div className="grow">
              <strong>{job.title.replace(/^Ansprechpartner:\s*/, '')}</strong>
              <div className="provider-row-meta">
                <span><UserRound /> {job.homeowner_first} {job.homeowner_last}</span>
                <span>{statusLabel(job.status)}</span>
              </div>
              <span className="provider-next-action">{job.request_kind === 'contact' ? 'Kundenkontakt öffnen' : job.status === 'accepted' ? 'Termin & Start planen' : 'Auftrag fortführen'} <ArrowRight size={14} /></span>
            </div>
            <div className="provider-row-side">
              <span className={`status ${job.status}`}>{statusLabel(job.status)}</span>
              <strong>{job.request_kind === 'contact' ? 'Kontakt' : euro(job.amount)}</strong>
            </div>
          </Link>
        ))}
        {assigned.length === 0 && (
          <ProviderState
            icon={<Users size={21} />}
            title="Noch kein Auftrag zugewiesen"
            description={ctx.canManageJobs ? 'Nach einer Kundenbuchung kannst du den Auftrag dir selbst oder einem Ansprechpartner zuweisen.' : 'Sobald dir ein Auftrag zugewiesen wurde, erscheint er hier mit Kunde, Status und nächstem Schritt.'}
          />
        )}
      </div>
    </AppShell>
  );
}
