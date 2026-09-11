import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Plus,
} from 'lucide-react';
import Link from 'next/link';

import { AppShell } from '@/components/shell';
import {
  EHEmptyState,
  EHOwnerOrdersHero,
  EHOwnerOrdersList,
  EHOwnerOrdersStats,
  EHOwnerOrdersSupport,
} from '@/design-system';

import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { dateLabel, statusLabel } from '@/lib/format';
import { primaryProperty } from '@/lib/properties';
import { mediaKindFromPath } from '@/lib/intake-media';

type SearchParams = Record<string, string | string[] | undefined>;

type JobRow = {
  id: number;
  title: string;
  description: string;
  category: string;
  postcode: string;
  preferred_date: string | null;
  preferred_time: string | null;
  status: string;
  request_kind: string;
  accepted_quote_id: number | null;
  created_at: string;
  updated_at: string;
  quotes: number;
  accepted_business: string | null;
  appointment_start: string | null;
  appointment_status: string | null;
  photo_id: number | null;
  photo_path: string | null;
};

function firstParam(
  value: string | string[] | undefined,
): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

function jobStatusTone(
  status: string,
): 'neutral' | 'info' | 'success' | 'warning' {
  if (status === 'completed') return 'success';
  if (status === 'in_progress') return 'info';
  if (status === 'quoted') return 'warning';
  return 'neutral';
}

function jobStatusCopy(
  job: JobRow,
): string {
  if (job.status === 'quoted') {
    return job.quotes > 0
      ? job.quotes === 1
        ? 'Angebot liegt vor'
        : `${job.quotes} Angebote liegen vor`
      : 'Angebot liegt vor';
  }

  return statusLabel(job.status);
}

function jobScheduleCopy(
  job: JobRow,
): string {
  if (job.appointment_start) {
    return `Termin: ${dateLabel(job.appointment_start)}`;
  }

  if (job.preferred_date) {
    return `Wunschtermin: ${dateLabel(job.preferred_date)}`;
  }

  if (job.status === 'completed') {
    return 'Abgeschlossen';
  }

  return 'Termin noch offen';
}

export default async function Jobs({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const user = await requireUser('homeowner');
  const params = await searchParams;

  const query = firstParam(params.q).trim().toLocaleLowerCase('de-DE');
  const view = firstParam(params.view);

  const property = primaryProperty(user.id);

  const profile = db
    .prepare(
      `SELECT address, postcode
       FROM homeowner_profiles
       WHERE user_id=?`,
    )
    .get(user.id) as
    | {
        address: string;
        postcode: string;
      }
    | undefined;

  const address =
    property?.address ||
    profile?.address ||
    'Dein Zuhause';

  const postcode =
    property?.postcode ||
    profile?.postcode ||
    '';

  const jobs = db
    .prepare(
      `SELECT
        j.*,
        COUNT(DISTINCT q.id) AS quotes,
        ap.business_name AS accepted_business,
        (
          SELECT a.start_at
          FROM appointments a
          WHERE a.job_id=j.id
            AND a.homeowner_id=j.homeowner_id
            AND a.status='confirmed'
          ORDER BY datetime(a.start_at) ASC
          LIMIT 1
        ) AS appointment_start,
        (
          SELECT a.status
          FROM appointments a
          WHERE a.job_id=j.id
            AND a.homeowner_id=j.homeowner_id
          ORDER BY datetime(a.start_at) DESC
          LIMIT 1
        ) AS appointment_status,
        (
          SELECT p.id
          FROM job_photos p
          WHERE p.job_id=j.id
          ORDER BY p.id ASC
          LIMIT 1
        ) AS photo_id,
        (
          SELECT p.path
          FROM job_photos p
          WHERE p.job_id=j.id
          ORDER BY p.id ASC
          LIMIT 1
        ) AS photo_path
      FROM jobs j
      LEFT JOIN quotes q
        ON q.job_id=j.id
      LEFT JOIN quotes aq
        ON aq.id=j.accepted_quote_id
      LEFT JOIN provider_profiles ap
        ON ap.user_id=aq.provider_id
      WHERE j.homeowner_id=?
        AND j.request_kind='service'
      GROUP BY j.id
      ORDER BY
        CASE j.status
          WHEN 'quoted' THEN 0
          WHEN 'in_progress' THEN 1
          WHEN 'accepted' THEN 2
          WHEN 'open' THEN 3
          WHEN 'completed' THEN 4
          ELSE 5
        END,
        datetime(j.updated_at) DESC`,
    )
    .all(user.id) as JobRow[];

  const openJobs = jobs.filter((job) =>
    ['open', 'quoted', 'accepted'].includes(job.status),
  );

  const inProgressJobs = jobs.filter(
    (job) => job.status === 'in_progress',
  );

  const completedJobs = jobs.filter(
    (job) => job.status === 'completed',
  );

  const currentJobs =
    view === 'completed'
      ? jobs.filter((job) => job.status === 'completed')
      : jobs.filter(
          (job) =>
            !['completed', 'cancelled'].includes(job.status),
        );

  const filteredJobs = query
    ? currentJobs.filter((job) =>
        [
          job.title,
          job.category,
          job.description,
          job.accepted_business ?? '',
          statusLabel(job.status),
        ]
          .join(' ')
          .toLocaleLowerCase('de-DE')
          .includes(query),
      )
    : currentJobs;

  return (
    <AppShell
      role="homeowner"
      active="/app/jobs"
      title="Aufträge"
      subtitle="Alles rund um dein Zuhause"
    >
      <>
        <EHOwnerOrdersHero
          eyebrow="Aufträge"
          title={
            <>
              Alles rund um dein Zuhause.
              <br />
              Einfach im Blick.
            </>
          }
          text="Beauftragen, verfolgen, erledigt. Wir kümmern uns um den Rest."
          imageSrc="/images/premium/hero-homeowner.jpg"
          imageAlt="Wohnhaus als ruhige Bildwelt für den Auftragsbereich"
          address={address}
          postcode={postcode}
          search={{
            action: '/app/jobs',
            name: 'q',
            defaultValue: firstParam(params.q),
            placeholder: 'Wonach suchst du?',
          }}
        />

        <EHOwnerOrdersStats
          items={[
            {
              href: '/app/jobs',
              value: openJobs.length,
              label:
                openJobs.length === 1
                  ? 'Offener Auftrag'
                  : 'Offene Aufträge',
              icon: <ClipboardList aria-hidden="true" />,
              tone: 'petrol',
            },
            {
              href: '/app/jobs',
              value: inProgressJobs.length,
              label: 'In Bearbeitung',
              icon: <Clock3 aria-hidden="true" />,
              tone: 'sand',
            },
            {
              href: '/app/jobs?view=completed',
              value: completedJobs.length,
              label: 'Abgeschlossen',
              icon: <CheckCircle2 aria-hidden="true" />,
              tone: 'paper',
            },
            {
              href: '/app/hausmeister',
              title: 'Neuen Auftrag erstellen',
              text: 'In wenigen Schritten',
              icon: <Plus aria-hidden="true" />,
              tone: 'warm',
            },
          ]}
        />

        <section aria-labelledby="owner-orders-current-heading">
          <header className="owner-orders-section-heading">
            <h2 id="owner-orders-current-heading">
              Deine aktuellen Aufträge
            </h2>

            <Link href="/app/jobs">
              Alle Aufträge ansehen
              <ArrowRight aria-hidden="true" />
            </Link>
          </header>

          {filteredJobs.length > 0 ? (
            <EHOwnerOrdersList
              items={filteredJobs.map((job) => ({
                id: String(job.id),
                href: `/app/jobs/${job.id}`,
                title: job.title.replace(
                  /^Ansprechpartner:\s*/,
                  '',
                ),
                category: job.category,
                provider: job.accepted_business,
                status: jobStatusCopy(job),
                statusTone: jobStatusTone(job.status),
                schedule: jobScheduleCopy(job),
                media:
                  job.photo_id &&
                  mediaKindFromPath(job.photo_path) === 'image'
                    ? {
                        src: `/api/job-media/${job.photo_id}`,
                        alt: `Foto zum Auftrag ${job.title}`,
                      }
                    : undefined,
              }))}
            />
          ) : query ? (
            <EHEmptyState
              title="Keine passenden Aufträge gefunden"
              text={`Für „${firstParam(params.q)}“ gibt es in deinen aktuellen Aufträgen keinen Treffer.`}
            />
          ) : (
            <EHEmptyState
              title={
                view === 'completed'
                  ? 'Noch keine abgeschlossenen Aufträge'
                  : 'Noch keine aktuellen Aufträge'
              }
              text={
                view === 'completed'
                  ? 'Abgeschlossene Aufträge erscheinen hier, sobald ein Auftrag erledigt wurde.'
                  : 'Beschreibe dein Anliegen. Wir helfen dir, daraus den passenden nächsten Schritt zu machen.'
              }
            />
          )}
        </section>

        <EHOwnerOrdersSupport
          title="Du weißt nicht, wo du anfangen sollst?"
          text="Beschreibe dein Anliegen – wir helfen dir, den passenden Handwerker zu finden."
          href="/app/hausmeister"
          label="Anliegen beschreiben"
        />
      </>
    </AppShell>
  );
}
