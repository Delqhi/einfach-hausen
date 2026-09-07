import { BadgeCheck, ClipboardList, Flame, Leaf, MapPin, Sprout } from 'lucide-react';
import { EHPanel, EHList, EHButton } from '@/design-system';
import { AppShell } from '@/components/shell';
import { ProviderAccessBoundary, ProviderState } from '@/components/provider/workspace';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { dateLabel, euro } from '@/lib/format';
import { getProviderContext } from '@/lib/provider';

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

  const requests = db.prepare(`SELECT d.id dispatch_id,d.status dispatch_status,d.match_score,d.distance_km,d.sent_at,j.*,(SELECT amount FROM quotes q WHERE q.job_id=j.id AND q.provider_id=?) my_quote FROM job_dispatches d JOIN jobs j ON j.id=d.job_id WHERE d.provider_id=? AND d.status IN ('sent','viewed','quoted') AND j.status IN ('open','quoted') ORDER BY d.sent_at DESC LIMIT 30`).all(ctx.providerId, ctx.providerId) as any[];
  const companyOpen = ctx.canManageJobs
    ? (db.prepare(`SELECT COUNT(*) c FROM job_dispatches d JOIN jobs j ON j.id=d.job_id WHERE d.provider_id=? AND d.status='accepted' AND j.status!='completed'`).get(ctx.providerId) as any).c
    : 0;
  const messages = (db.prepare(`SELECT COUNT(*) c FROM messages WHERE recipient_id=? AND read_at IS NULL`).get(u.id) as any).c
    + (db.prepare(`SELECT COUNT(*) c FROM contact_messages WHERE provider_id=? AND sender_id!=? AND read_at IS NULL`).get(ctx.providerId, u.id) as any).c;
  const upcoming = db.prepare(`SELECT a.start_at,j.title,j.postcode,j.id FROM appointments a JOIN jobs j ON j.id=a.job_id WHERE a.contact_user_id=? AND a.status='confirmed' AND datetime(a.start_at)>=datetime('now','localtime') ORDER BY a.start_at ASC LIMIT 2`).all(u.id) as any[];
  const quoteCandidates = requests.filter((job) => !job.my_quote && job.request_kind !== 'contact').length;
  const newRequestsCount = requests.filter((job) => job.dispatch_status === 'sent').length;

  return (
    <AppShell role="provider" active="/pro" title="Arbeitsbereich" subtitle={`${ctx.businessName} · ${ctx.jobTitle || 'Ansprechpartner'}`}>
      <ProviderAccessBoundary canManageJobs={ctx.canManageJobs} />

      {/* Hero: Klare, professionelle Kopfzeile */}
      <section className="pdx-hero">
        <div className="pdx-hero-copy">
          <h1>{greeting()}, {u.first_name}!</h1>
          <p className="pdx-person">{u.first_name} {u.last_name} · <strong>{ctx.businessName}</strong></p>
          <p className="pdx-region"><MapPin size={14} /> Radius: {p?.radius_km || 25} km um {p?.postcode || 'deine Region'}</p>
        </div>
        <div className="pdx-avatar" aria-hidden="true">
          <span className="pdx-avatar-circle">{`${u.first_name?.[0] || ''}${u.last_name?.[0] || ''}`.toUpperCase()}</span>
          {p?.verified && <span className="pdx-avatar-dot" title="Geprüfter Meisterbetrieb" />}
        </div>
      </section>

      {/* Ruhige Arbeitsleiste statt überladener KPI-Raster */}
      <section className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--eh-border)] bg-[var(--eh-surface)] p-4 shadow-sm" aria-label="Statusübersicht">
        <div className="flex items-center gap-2 pr-4">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[var(--eh-green-600)] animate-pulse"></span>
          <span className="text-xs font-bold text-[var(--eh-text)]">System aktiv</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-[var(--eh-text-secondary)]">
          <span><strong className="font-bold text-[var(--eh-text)]">{newRequestsCount}</strong> neue Anfragen</span>
          <span><strong className="font-bold text-[var(--eh-text)]">{companyOpen}</strong> laufende Aufträge</span>
          <span><strong className="font-bold text-[var(--eh-text)]">{upcoming.length}</strong> anstehende Termine</span>
          {messages > 0 && <span className="font-bold text-[var(--eh-terra)]"><strong className="text-[var(--eh-terra)]">{messages}</strong> neue Nachrichten</span>}
        </div>
      </section>

      {/* Nächster Arbeitsschritt: Prominent hervorgehoben */}
      {ctx.canManageJobs && quoteCandidates > 0 && (
        <EHPanel title="Nächster Schritt: Angebot erstellen">
          <p>Bei {quoteCandidates} passenden Kundenanfragen liegen alle Informationen für einen Richtpreis vor.</p>
          <EHButton href={`/pro/jobs/${requests.find((job) => !job.my_quote && job.request_kind !== 'contact')?.id}`} arrow>Angebot öffnen</EHButton>
        </EHPanel>
      )}

      {/* Arbeitsliste: Klare Auftragszeilen */}
      <EHPanel title="Passende Kundenanfragen" footer={requests.length > 5 ? { href: '/pro/orders', text: `Alle ${requests.length} Anfragen einsehen` } : { href: '/pro/orders', text: 'Alle ansehen' }}>
        <EHList label="Passende Kundenanfragen" items={requests.slice(0, 5).map((job) => {
          const badge = requestBadge(job);
          const price = job.my_quote ? euro(job.my_quote) : job.budget_min && job.budget_max ? `ca. ${euro((job.budget_min + job.budget_max) / 2)}` : job.budget_max ? `ca. ${euro(job.budget_max)}` : null;
          return {
            id: String(job.dispatch_id),
            title: `${badge.label} · ${job.title.replace(/^Ansprechpartner:\s*/, '')}`,
            text: `${job.description.length > 95 ? `${job.description.slice(0, 95)}…` : job.description} — ${job.postcode || 'Region'}${job.distance_km ? ` · ${Math.round(job.distance_km)} km` : ''}${price ? ` · ${price}` : ''} · ${timeAgo(job.sent_at)}`,
            href: `/pro/jobs/${job.id}`,
          };
        })} />
        {requests.length === 0 && (
          <ProviderState
            icon={<ClipboardList size={21} />}
            title="Keine neuen Anfragen im Umkreis"
            description="Neue Anfragen erscheinen hier automatisch, sobald passende Vorhaben in deinem PLZ-Bereich freigegeben werden."
          />
        )}
      </EHPanel>

      <EHPanel title="Kommende Vor-Ort-Termine" footer={{ href: '/pro/calendar', text: 'Kalender' }}>
        <EHList label="Kommende Vor-Ort-Termine" items={upcoming.map((appointment) => {
          const start = new Date(appointment.start_at + 'Z');
          const sameDay = start.toDateString() === new Date().toDateString();
          return {
            id: `${appointment.id}-${appointment.start_at}`,
            title: appointment.title.replace(/^Ansprechpartner:\s*/, ''),
            text: `${sameDay ? 'Heute' : dateLabel(appointment.start_at.slice(0, 10))}, ${start.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr · ${appointment.postcode || 'Terminort'}`,
            href: `/pro/jobs/${appointment.id}`,
          };
        })} />
        {upcoming.length === 0 && <p>Keine anstehenden Termine.</p>}
      </EHPanel>
    </AppShell>
  );
}
