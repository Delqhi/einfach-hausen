import Link from 'next/link';
import { ArrowRight, ClipboardList, MessageCircle, UserRound } from 'lucide-react';
import { AppShell } from '@/components/shell';
import { ProviderAccessBoundary, ProviderPageIntro, ProviderSectionHeader, ProviderState } from '@/components/provider/workspace';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { euro, statusLabel } from '@/lib/format';
import { getProviderContext } from '@/lib/provider';

export default async function Orders() {
  const u = await requireUser('provider');
  const ctx = getProviderContext(u.id);
  if (!ctx) return null;

  const rows = ctx.canManageJobs
    ? db.prepare(`SELECT j.*,q.amount,q.status quote_status,a.contact_user_id,cu.first_name contact_first,cu.last_name contact_last
        FROM jobs j
        JOIN job_dispatches d ON d.job_id=j.id AND d.provider_id=?
        LEFT JOIN quotes q ON q.job_id=j.id AND q.provider_id=?
        LEFT JOIN job_assignments a ON a.job_id=j.id LEFT JOIN users cu ON cu.id=a.contact_user_id
        WHERE (j.request_kind='contact' AND d.status='accepted') OR q.id IS NOT NULL
        ORDER BY j.updated_at DESC`).all(ctx.providerId, ctx.providerId) as any[]
    : db.prepare(`SELECT j.*,q.amount,q.status quote_status,a.contact_user_id,cu.first_name contact_first,cu.last_name contact_last
        FROM job_assignments a JOIN jobs j ON j.id=a.job_id LEFT JOIN quotes q ON q.id=j.accepted_quote_id JOIN users cu ON cu.id=a.contact_user_id
        WHERE a.provider_id=? AND a.contact_user_id=? ORDER BY j.updated_at DESC`).all(ctx.providerId, u.id) as any[];

  return (
    <AppShell role="provider" active="/pro/orders" title="Aufträge" subtitle={ctx.canManageJobs ? 'Betrieb · Kontakte und laufende Arbeiten' : 'Deine zugewiesenen Themen'}>
      <ProviderPageIntro
        eyebrow="Arbeit"
        title="Aufträge & Kontakte"
        description={ctx.canManageJobs ? 'Vom gesendeten Angebot bis zur laufenden Arbeit: jeder Vorgang zeigt den aktuellen Stand und genau den nächsten sinnvollen Schritt.' : 'Du siehst ausschließlich Vorgänge, bei denen du als Ansprechpartner zugewiesen bist.'}
      />

      <ProviderAccessBoundary canManageJobs={ctx.canManageJobs} />

      <ProviderSectionHeader title="Arbeitsliste" description={`${rows.length} ${rows.length === 1 ? 'Vorgang' : 'Vorgänge'} im aktuellen Zugriff.`} />
      <div className="stack">
        {rows.map((row) => {
          const isContact = row.request_kind === 'contact';
          const nextAction = isContact
            ? 'Kundenkontakt öffnen'
            : row.status === 'accepted'
              ? 'Auftrag vorbereiten'
              : row.status === 'in_progress'
                ? 'Auftrag fortführen'
                : 'Vorgang öffnen';

          return (
            <Link href={`/pro/jobs/${row.id}`} className="pro-request simple" key={row.id}>
              {isContact ? <MessageCircle /> : <ClipboardList />}
              <div className="grow">
                <strong>{row.title.replace(/^Ansprechpartner:\s*/, '')}</strong>
                <div className="provider-row-meta">
                  <span>{isContact ? 'Persönlicher Ansprechpartner' : `Angebot ${statusLabel(row.quote_status)} · Auftrag ${statusLabel(row.status)}`}</span>
                  {row.contact_first && <span><UserRound /> {row.contact_first} {row.contact_last}</span>}
                </div>
                <span className="provider-next-action">{nextAction} <ArrowRight size={14} /></span>
              </div>
              <div className="provider-row-side">
                <span className={`status ${row.status}`}>{isContact ? 'Kontakt' : statusLabel(row.status)}</span>
                <strong>{isContact ? 'Ohne Preis' : euro(row.amount)}</strong>
              </div>
            </Link>
          );
        })}
        {rows.length === 0 && (
          <ProviderState
            icon={<ClipboardList size={21} />}
            title="Noch keine Aufträge oder Kontakte"
            description={ctx.canManageJobs ? 'Sobald ein Kontakt übernommen oder ein Angebot gesendet wurde, bleibt der Vorgang hier bis zum Abschluss nachvollziehbar.' : 'Sobald dir ein Vorgang zugewiesen wurde, erscheint er hier.'}
          />
        )}
      </div>
    </AppShell>
  );
}
