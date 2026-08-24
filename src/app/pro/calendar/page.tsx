import Link from 'next/link';
import { ArrowRight, CalendarDays, UserRound } from 'lucide-react';
import { AppShell } from '@/components/shell';
import { ProviderAccessBoundary, ProviderPageIntro, ProviderSectionHeader, ProviderState } from '@/components/provider/workspace';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { dateLabel, statusLabel } from '@/lib/format';
import { getProviderContext } from '@/lib/provider';

export default async function ProCalendar() {
  const u = await requireUser('provider');
  const ctx = getProviderContext(u.id);
  if (!ctx) return null;

  const rows = ctx.canManageJobs
    ? db.prepare(`SELECT a.*,j.title,x.first_name,x.last_name,cu.first_name contact_first,cu.last_name contact_last FROM appointments a JOIN jobs j ON j.id=a.job_id JOIN users x ON x.id=a.homeowner_id LEFT JOIN users cu ON cu.id=a.contact_user_id WHERE a.provider_id=? ORDER BY a.start_at`).all(ctx.providerId) as any[]
    : db.prepare(`SELECT a.*,j.title,x.first_name,x.last_name,cu.first_name contact_first,cu.last_name contact_last FROM appointments a JOIN jobs j ON j.id=a.job_id JOIN users x ON x.id=a.homeowner_id LEFT JOIN users cu ON cu.id=a.contact_user_id WHERE a.provider_id=? AND a.contact_user_id=? ORDER BY a.start_at`).all(ctx.providerId, u.id) as any[];

  return (
    <AppShell role="provider" active="/pro/calendar" title="Termine" subtitle={ctx.canManageJobs ? 'Betriebstermine' : 'Deine Termine'}>
      <ProviderPageIntro
        eyebrow="Planung"
        title="Termine"
        description={ctx.canManageJobs ? 'Bestätigte Kundentermine des Betriebs in einer ruhigen Arbeitsliste.' : 'Nur bestätigte Termine, bei denen du als Ansprechpartner hinterlegt bist.'}
      />
      <ProviderAccessBoundary canManageJobs={ctx.canManageJobs} />

      <ProviderSectionHeader title="Bevorstehend" description={`${rows.length} ${rows.length === 1 ? 'Termin' : 'Termine'}`} />
      <div className="stack">
        {rows.map((row) => (
          <Link href={`/pro/jobs/${row.job_id}`} className="appointment pro-appointment" key={row.id}>
            <CalendarDays />
            <div className="grow">
              <strong>{row.title}</strong>
              <p>{row.first_name} {row.last_name}{ctx.canManageJobs && row.contact_first ? ` · ${row.contact_first} ${row.contact_last}` : ''}</p>
              <div className="provider-row-meta">
                <span><CalendarDays /> {dateLabel(row.start_at)}</span>
                {row.contact_first && <span><UserRound /> {row.contact_first} {row.contact_last}</span>}
              </div>
              <span className="provider-next-action">Auftrag öffnen <ArrowRight size={14} /></span>
            </div>
            <span className={`status ${row.status}`}>{statusLabel(row.status)}</span>
          </Link>
        ))}
        {rows.length === 0 && (
          <ProviderState
            icon={<CalendarDays size={21} />}
            title="Noch keine Termine"
            description="Sobald ein bestätigter Kundentermin hinterlegt ist, erscheint er hier zusammen mit Auftrag und Ansprechpartner."
          />
        )}
      </div>
    </AppShell>
  );
}
