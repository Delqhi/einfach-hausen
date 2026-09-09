import { CalendarDays } from 'lucide-react';
import { AppShell } from '@/components/shell';
import { ProviderAccessBoundary, ProviderPageIntro, ProviderState } from '@/components/provider/workspace';
import { EHWorkSection, EHScheduleList, EHStatus } from '@/design-system';
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
        description={ctx.canManageJobs ? 'Kundentermine des Betriebs mit ihrem aktuellen Status.' : 'Termine, bei denen du als Ansprechpartner hinterlegt bist.'}
      />
      <ProviderAccessBoundary canManageJobs={ctx.canManageJobs} />

      <EHWorkSection title={`Termine · ${rows.length} ${rows.length === 1 ? 'Termin' : 'Termine'}`}>
        <EHScheduleList label="Termine" items={rows.map((row) => ({
          id: String(row.id),
          title: row.title,
          dateLabel:dateLabel(row.start_at),
          day:new Intl.DateTimeFormat('de-DE',{day:'2-digit',timeZone:'Europe/Berlin'}).format(new Date(row.start_at)),
          month:new Intl.DateTimeFormat('de-DE',{month:'short',timeZone:'Europe/Berlin'}).format(new Date(row.start_at)),
          detail:`${row.first_name} ${row.last_name}${row.contact_first ? ` · Ansprechpartner: ${row.contact_first} ${row.contact_last}` : ''}`,
          href:`/pro/jobs/${row.job_id}`,
          status:statusLabel(row.status),
        }))} />
        {rows.length === 0 && (
          <ProviderState
            icon={<CalendarDays size={21} />}
            title="Noch keine Termine"
            description="Sobald ein bestätigter Kundentermin hinterlegt ist, erscheint er hier zusammen mit Auftrag und Ansprechpartner."
          />
        )}
      </EHWorkSection>
    </AppShell>
  );
}
