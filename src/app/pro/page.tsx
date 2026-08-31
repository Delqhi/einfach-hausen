import Link from 'next/link';
import { ArrowRight, BadgeCheck, CalendarDays, ClipboardList, FileText, Flame, Leaf, MapPin, MessageSquare, Sprout, UserRound } from 'lucide-react';
import { AppShell } from '@/components/shell';
import { ProviderAccessBoundary, ProviderState } from '@/components/provider/workspace';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { dateLabel, euro } from '@/lib/format';
import { getProviderContext } from '@/lib/provider';

// T-0206 B2: provider home matches the Notion reference
// (Homesceen.dienstleister.png): greeting block with company + region +
// avatar, four icon stat cards, request cards with type badges/time/place/
// price chip, quote CTA, next appointments, Start tab set. All data comes
// from the same tables as before; only presentation changed.

const TYPE_BADGES = [
  { kind: 'emergency', label: 'Notfallservice', icon: Flame, className: 'pdx-badge emergency' },
  { kind: 'consultation', label: 'Beratung', icon: Leaf, className: 'pdx-badge consultation' },
  { kind: 'service', label: 'Auftrag', icon: Sprout, className: 'pdx-badge order' },
] as const;

function requestBadge(job: any) {
  const kind = job.request_kind === 'contact' ? 'consultation' : job.emergency_type ? 'emergency' : 'service';
  return TYPE_BADGES.find((entry) => entry.kind === kind) ?? TYPE_BADGES[2];
}

function timeAgo(iso: string | null | undefined) {
  if (!iso) return '';
  const minutes = Math.max(1, Math.round((Date.now() - new Date(iso + 'Z').getTime()) / 60000));
  if (minutes < 60) return `vor ${minutes} Min.`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `vor ${hours} Std.`;
  const days = Math.round(hours / 24);
  return `vor ${days} Tg.`;
}

function greeting(now = new Date()) {
  const hour = now.getHours();
  if (hour < 11) return 'Guten Morgen';
  if (hour < 18) return 'Guten Tag';
  return 'Guten Abend';
}

export default async function Pro() {
  const u = await requireUser('provider');
  const ctx = getProviderContext(u.id);

  if (!ctx) {
    return (
      <AppShell role="provider" active="/pro" title="Partnerbereich" subtitle="Zugang prüfen">
        <ProviderState
          icon={<BadgeCheck size={21} />}
          title="Keinem Unternehmen zugeordnet"
          description="Dein App-Zugang ist aktuell keinem aktiven Partnerunternehmen zugeordnet. Bitte lass die Unternehmenszuordnung prüfen."
          tone="unavailable"
        />
      </AppShell>
    );
  }

  const p = db.prepare(`SELECT p.*,c.status contract_status,c.insurance_verified,c.qualification_verified,c.contract_verified,c.quality_standard_verified,c.response_target_minutes FROM provider_profiles p LEFT JOIN partner_contracts c ON c.provider_id=p.user_id WHERE p.user_id=?`).get(ctx.providerId) as any;

  if (!p?.verified || p.contract_status !== 'active') {
    return (
      <AppShell role="provider" active="/pro" title="Partnerbereich" subtitle={ctx.businessName}>
        <ProviderState
          icon={<BadgeCheck size={21} />}
          title={!p?.verified ? 'Unternehmensprüfung ausstehend' : 'Partnervertrag noch nicht aktiv'}
          description="Einfach Hausen arbeitet nur mit geprüften, vertraglich gebundenen regionalen Unternehmen. Der Firmeninhaber sieht den aktuellen Prüf- und Vertragsstatus im Profil."
          action={{ href: '/pro/profile', label: 'Partnerstatus ansehen' }}
          tone="unavailable"
        />
      </AppShell>
    );
  }

  // Dispatches belong to the company (provider_id = owner user id): every
  // member sees the shared request pool; /pro/jobs enforces per-person rights.
  const requests = db.prepare(`SELECT d.id dispatch_id,d.status dispatch_status,d.match_score,d.distance_km,d.sent_at,j.*,(SELECT amount FROM quotes q WHERE q.job_id=j.id AND q.provider_id=?) my_quote FROM job_dispatches d JOIN jobs j ON j.id=d.job_id WHERE d.provider_id=? AND d.status IN ('sent','viewed','quoted') AND j.status IN ('open','quoted') ORDER BY d.sent_at DESC LIMIT 30`).all(ctx.providerId, ctx.providerId) as any[];
  const companyOpen = ctx.canManageJobs
    ? (db.prepare(`SELECT COUNT(*) c FROM job_dispatches d JOIN jobs j ON j.id=d.job_id WHERE d.provider_id=? AND d.status='accepted' AND j.status!='completed'`).get(ctx.providerId) as any).c
    : 0;
  const messages = (db.prepare(`SELECT COUNT(*) c FROM messages WHERE recipient_id=? AND read_at IS NULL`).get(u.id) as any).c
    + (db.prepare(`SELECT COUNT(*) c FROM contact_messages WHERE provider_id=? AND sender_id!=? AND read_at IS NULL`).get(ctx.providerId, u.id) as any).c;
  const upcoming = db.prepare(`SELECT a.start_at,j.title,j.postcode,j.id FROM appointments a JOIN jobs j ON j.id=a.job_id WHERE a.contact_user_id=? AND a.status='confirmed' AND datetime(a.start_at)>=datetime('now','localtime') ORDER BY a.start_at ASC LIMIT 2`).all(u.id) as any[];
  const quoteCandidates = requests.filter((job) => !job.my_quote && job.request_kind !== 'contact').length;

  const stats = [
    { icon: Sprout, value: requests.filter((job) => job.dispatch_status === 'sent').length, label: 'Neue Anfragen' },
    { icon: ClipboardList, value: companyOpen, label: 'Aktive Aufträge' },
    { icon: CalendarDays, value: upcoming.length, label: 'Nächste Termine' },
    { icon: MessageSquare, value: messages, label: 'Offene Nachrichten' },
  ];

  return (
    <AppShell role="provider" active="/pro" title="Arbeitsbereich" subtitle={`${ctx.businessName} · ${ctx.jobTitle || 'Ansprechpartner'}`}>
      <ProviderAccessBoundary canManageJobs={ctx.canManageJobs} />

      {/* Greeting block: name, company, region + avatar with trust ring */}
      <section className="pdx-hero">
        <div className="pdx-hero-copy">
          <h1>{greeting()}, {u.first_name}!</h1>
          <p className="pdx-person">{u.first_name} {u.last_name}<br /><strong>{ctx.businessName}</strong></p>
          <p className="pdx-region"><MapPin size={14} /> Einsatzgebiet: {p?.radius_km || 25} km um {p?.postcode || 'deine Region'}</p>
        </div>
        <div className="pdx-avatar" aria-hidden="true">
          <span className="pdx-avatar-circle">{`${u.first_name?.[0] || ''}${u.last_name?.[0] || ''}`.toUpperCase()}</span>
          {p?.verified && <span className="pdx-avatar-dot" title="Geprüfter Betrieb" />}
        </div>
      </section>

      {/* Four icon stat cards (Notion row) */}
      <section className="pdx-stats" aria-label="Arbeitsüberblick">
        {stats.map(({ icon: Icon, value, label }) => (
          <div className="pdx-stat" key={label}>
            <span className="pdx-stat-icon"><Icon size={19} /></span>
            <strong>{value}</strong>
            <small>{label}</small>
          </div>
        ))}
      </section>

      <>
          <div className="pdx-section-head">
            <h2>Anfragen in deiner Nähe</h2>
            <Link href="/pro/orders">Alle anzeigen <ArrowRight size={13} /></Link>
          </div>

          <div className="pdx-requests">
            {requests.slice(0, 4).map((job) => {
              const badge = requestBadge(job);
              const BadgeIcon = badge.icon;
              const price = job.my_quote ? euro(job.my_quote) : job.budget_min && job.budget_max ? `ca. ${euro((job.budget_min + job.budget_max) / 2)}` : job.budget_max ? `ca. ${euro(job.budget_max)}` : null;
              return (
                <Link href={`/pro/jobs/${job.id}`} className="pdx-request pro-request" key={job.dispatch_id}>
                  <span className={`pdx-request-icon ${badge.kind}`}><BadgeIcon size={18} /></span>
                  <div className="pdx-request-main">
                    <div className="pdx-request-title">
                      <span className={badge.className}>{badge.label}</span>
                      <strong>{job.title.replace(/^Ansprechpartner:\s*/, '')}</strong>
                      <small>{timeAgo(job.sent_at)}</small>
                    </div>
                    <p>{job.description.length > 88 ? `${job.description.slice(0, 88)}…` : job.description}</p>
                    <div className="pdx-request-meta">
                      <span><MapPin size={12} /> {job.postcode || 'Region'}{job.distance_km ? ` · ${Math.round(job.distance_km)} km` : ''}</span>
                      {price && <span className="pdx-price-chip">{price}</span>}
                    </div>
                  </div>
                  <ArrowRight size={16} className="pdx-chevron" />
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
          {requests.length > 4 && <Link className="pdx-show-all" href="/pro/orders">Alle Anfragen anzeigen <ArrowRight size={14} /></Link>}

          {ctx.canManageJobs && quoteCandidates > 0 && (
            <Link href={`/pro/jobs/${requests.find((job) => !job.my_quote && job.request_kind !== 'contact')?.id}`} className="pdx-quote-cta">
              <span className="pdx-quote-icon"><FileText size={20} /></span>
              <div className="grow">
                <strong>Kostenvoranschlag senden</strong>
                <small>Bei {quoteCandidates} Anfragen sind bereits genug Angaben vorhanden.</small>
              </div>
              <span className="pdx-quote-button">Jetzt erstellen</span>
            </Link>
          )}
        </>

      {/* Next appointments (Notion: date tile + time) */}
      <div className="pdx-section-head pdx-section-head-tight">
        <h2>Nächste Termine</h2>
        <Link href="/pro/calendar">Alle anzeigen <ArrowRight size={13} /></Link>
      </div>
      <div className="pdx-appointments">
        {upcoming.map((appointment) => {
          const start = new Date(appointment.start_at + 'Z');
          const sameDay = start.toDateString() === new Date().toDateString();
          return (
            <Link href={`/pro/jobs/${appointment.id}`} className="pdx-appointment" key={`${appointment.id}-${appointment.start_at}`}>
              <span className="pdx-date-tile">
                <strong>{start.getDate()}</strong>
                <small>{start.toLocaleDateString('de-DE', { month: 'short' }).replace('.', '')}</small>
              </span>
              <div className="grow">
                <strong>{appointment.title.replace(/^Ansprechpartner:\s*/, '')}</strong>
                <small>{appointment.postcode || 'Termin'}</small>
              </div>
              <span className="pdx-appointment-time">
                {sameDay ? <b>Heute</b> : dateLabel(appointment.start_at.slice(0, 10))}
                <small>{start.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr</small>
              </span>
            </Link>
          );
        })}
        {upcoming.length === 0 && <p className="pdx-empty-line">Keine anstehenden Termine — neue Buchungen erscheinen hier automatisch.</p>}
      </div>
    </AppShell>
  );
}
