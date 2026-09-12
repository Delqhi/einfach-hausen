import { Bell, CalendarDays, FileText } from 'lucide-react';
import { AppShell } from '@/components/shell';
import {
  EHFormFeedback,
  EHManagerAttention,
  EHManagerAutomations,
  EHManagerHero,
  EHManagerTasks,
  EHManagerThreads,
} from '@/design-system';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { dateLabel } from '@/lib/format';
import { AUTOMATION_STARTERS, getAutomationPrefs } from '@/lib/hausmanager';
import { updateAutomationPrefsAction } from '@/app/actions';
import { primaryProperty } from '@/lib/properties';

export default async function Hausmanager({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const user = await requireUser('homeowner');
  const sp = await searchParams;
  const property = primaryProperty(user.id);
  const houseLabel = property?.address || '';

  const threads = db
    .prepare(
      `SELECT t.id, t.updated_at,
        (SELECT COUNT(*) FROM assistant_messages m WHERE m.thread_id = t.id) message_count
      FROM assistant_threads t
      WHERE t.user_id = ? AND t.channel = 'app'
      ORDER BY t.updated_at DESC LIMIT 3`,
    )
    .all(user.id) as { id: number; updated_at: string; message_count: number }[];

  const quotedJobs = db
    .prepare(
      `SELECT j.id, j.title,
        (SELECT COUNT(*) FROM quotes q WHERE q.job_id = j.id AND q.status = 'pending') quote_count
      FROM jobs j
      WHERE j.homeowner_id = ? AND j.status = 'quoted'
      ORDER BY j.updated_at DESC LIMIT 3`,
    )
    .all(user.id) as { id: number; title: string; quote_count: number }[];

  const dueMaintenance = (property
    ? db
        .prepare(
          `SELECT id, title, due_date FROM maintenance_tasks
          WHERE property_id = ? AND status = 'open'
          ORDER BY date(due_date) ASC LIMIT 3`,
        )
        .all(property.id)
    : []) as { id: number; title: string; due_date: string }[];

  const prefs = getAutomationPrefs(user.id);
  const attention = [
    ...dueMaintenance.map((task) => `${task.title} (${dateLabel(task.due_date)})`),
    ...quotedJobs.map((job) => `${job.title}: ${job.quote_count} ${job.quote_count === 1 ? 'Angebot' : 'Angebote'} prüfen`),
  ];

  return (
    <AppShell
      role="homeowner"
      active="/app/hausmanager"
      title="Hausmanager"
      subtitle="Dein Zuhause im Blick"
    >
      <EHManagerHero
        eyebrow="KI-Hausmanager"
        title={`Guten Tag, ${user.first_name}.`}
        text={houseLabel ? `${houseLabel} im Blick — ich kümmere mich um den Rest.` : 'Dein Zuhause im Blick — ich kümmere mich um den Rest.'}
      />

      <EHManagerAttention items={attention} actionHref="/app/hausmeister" actionLabel="Ansehen" />

      {sp.prefs === 'saved' && (
        <EHFormFeedback kind="success">Automatisierungen gespeichert.</EHFormFeedback>
      )}

      <div className="managerGrid">
        <EHManagerThreads
          items={threads.map((thread) => ({
            id: String(thread.id),
            title: `Gespräch vom ${dateLabel(thread.updated_at)}`,
            meta: `${thread.message_count} ${thread.message_count === 1 ? 'Nachricht' : 'Nachrichten'}`,
            href: '/app/hausmeister',
          }))}
        />

        <EHManagerTasks
          items={[
            ...dueMaintenance.map((task) => ({
              id: `maintenance-${task.id}`,
              icon: <CalendarDays aria-hidden="true" />,
              title: task.title,
              meta: `Fällig ${dateLabel(task.due_date)}`,
              href: '/app/year',
            })),
            ...quotedJobs.map((job) => ({
              id: `quote-${job.id}`,
              icon: <FileText aria-hidden="true" />,
              title: job.title,
              meta: `${job.quote_count} ${job.quote_count === 1 ? 'Angebot' : 'Angebote'} prüfen`,
              href: `/app/jobs/${job.id}`,
            })),
          ]}
        />

        <div className="managerWide">
          <EHManagerAutomations
            items={AUTOMATION_STARTERS.map((starter) => ({
              slug: starter.slug,
              title: starter.title,
              text: starter.text,
              tier: starter.tier,
              on: prefs[starter.slug] ?? starter.defaultOn,
              disabled: starter.tier !== 'free',
            }))}
            action={updateAutomationPrefsAction}
            saved={false}
          />
        </div>
      </div>

      <p>
        <Bell aria-hidden="true" /> Neue Gespräche starten jederzeit beim{' '}
        <a href="/app/hausmeister">Hausmeister</a>.
      </p>
    </AppShell>
  );
}
