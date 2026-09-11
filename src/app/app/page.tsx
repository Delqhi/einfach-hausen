import {
  CalendarDays,
  CheckCircle2,
  FileText,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';

import { HomeownerHausmeisterComposer } from '@/components/homeowner/homeowner-hausmeister-composer';
import {
  EHCallout,
  EHOwnerDashboardComposer,
  EHOwnerDashboardHeader,
  EHOwnerDashboardOverview,
  EHOwnerDashboardStatus,
  EHOwnerDashboardTopGrid,
  EHOwnerDashboardUtilityGrid,
  EHTextLink,
} from '@/design-system';
import { AppShell } from '@/components/shell';

import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { dateLabel } from '@/lib/format';
import { primaryProperty } from '@/lib/properties';

export default async function Dashboard() {
  const user = await requireUser('homeowner');

  const profile = db
    .prepare(
      'SELECT address,postcode,onboarding_step FROM homeowner_profiles WHERE user_id=?',
    )
    .get(user.id) as any;

  const onboardingPending =
    profile?.onboarding_step && profile.onboarding_step !== 'done';

  const property = primaryProperty(user.id);

  const houseAddress = property?.address || profile?.address || '';
  const housePostcode = property?.postcode || profile?.postcode || '';

  const houseContext = [houseAddress, housePostcode]
    .filter(Boolean)
    .join(', ');

  const nextAppointment = db
    .prepare(
      `SELECT
        a.*,
        j.title,
        p.business_name
      FROM appointments a
      JOIN jobs j ON j.id=a.job_id
      JOIN provider_profiles p ON p.user_id=a.provider_id
      WHERE a.homeowner_id=?
        AND a.status='confirmed'
        AND datetime(a.start_at) >= datetime('now')
      ORDER BY datetime(a.start_at) ASC
      LIMIT 1`,
    )
    .get(user.id) as any;

  const openDecision = db
    .prepare(
      `SELECT *
      FROM jobs
      WHERE homeowner_id=?
        AND status='quoted'
      ORDER BY updated_at DESC
      LIMIT 1`,
    )
    .get(user.id) as any;

  const openDecisionQuotes = openDecision
    ? (
        db
          .prepare(
            `SELECT COUNT(*) c
            FROM quotes
            WHERE job_id=?
              AND status='pending'`,
          )
          .get(openDecision.id) as { c: number }
      ).c
    : 0;

  const dueMaintenance = property
    ? (db
        .prepare(
          `SELECT *
          FROM maintenance_tasks
          WHERE property_id=?
            AND status='open'
          ORDER BY date(due_date) ASC
          LIMIT 1`,
        )
        .get(property.id) as any)
    : null;

  const decisionMeta = openDecision
    ? openDecisionQuotes > 0
      ? `${openDecisionQuotes} ${
          openDecisionQuotes === 1 ? 'Angebot' : 'Angebote'
        } zur Prüfung`
      : 'Aktuellen Stand prüfen'
    : 'Aktuell keine Entscheidung offen';

  const scheduleTitle = dueMaintenance
    ? dueMaintenance.title
    : nextAppointment
      ? nextAppointment.title
      : 'Keine Wartung fällig';

  const scheduleMeta = dueMaintenance
    ? dateLabel(dueMaintenance.due_date)
    : nextAppointment
      ? `${nextAppointment.business_name} · ${dateLabel(
          nextAppointment.start_at,
        )}`
      : 'Aktuell nichts fällig';

  const statusItems = [
    {
      id: 'decision',
      label: 'Offenes Angebot',
      title: openDecision?.title || 'Keine offene Entscheidung',
      meta: decisionMeta,
      href: openDecision ? `/app/jobs/${openDecision.id}` : '/app/jobs',
      icon: <FileText aria-hidden="true" />,
    },
    {
      id: 'maintenance',
      label: dueMaintenance ? 'Nächste Wartung' : 'Nächster Termin',
      title: scheduleTitle,
      meta: scheduleMeta,
      href: dueMaintenance
        ? '/app/year'
        : nextAppointment
          ? `/app/jobs/${nextAppointment.job_id}`
          : '/app/calendar',
      icon: <CalendarDays aria-hidden="true" />,
    },
    {
      id: 'general',
      label: 'Allgemeiner Status',
      title:
        openDecision || dueMaintenance
          ? 'Keine weiteren akuten Anliegen'
          : 'Keine akuten Anliegen',
      meta: 'Dein Zuhause bleibt übersichtlich organisiert.',
      href: '/app/home',
      icon: <CheckCircle2 aria-hidden="true" />,
    },
  ];

  const overviewItems = [
    ...(openDecision
      ? [
          {
            id: `overview-decision-${openDecision.id}`,
            label: 'Offenes Angebot',
            title: openDecision.title,
            meta:
              openDecisionQuotes > 0
                ? `${openDecisionQuotes} ${
                    openDecisionQuotes === 1 ? 'Angebot' : 'Angebote'
                  } prüfen`
                : 'Vorgang öffnen',
            href: `/app/jobs/${openDecision.id}`,
            icon: <FileText aria-hidden="true" />,
          },
        ]
      : []),
    ...(dueMaintenance
      ? [
          {
            id: `overview-maintenance-${dueMaintenance.id ?? 'next'}`,
            label: 'Fällige Wartung',
            title: dueMaintenance.title,
            meta: dateLabel(dueMaintenance.due_date),
            href: '/app/year',
            icon: <CalendarDays aria-hidden="true" />,
          },
        ]
      : nextAppointment
        ? [
            {
              id: `overview-appointment-${nextAppointment.job_id}`,
              label: 'Nächster Termin',
              title: nextAppointment.title,
              meta: dateLabel(nextAppointment.start_at),
              href: `/app/jobs/${nextAppointment.job_id}`,
              icon: <CalendarDays aria-hidden="true" />,
            },
          ]
        : []),
  ];

  return (
    <AppShell
      role="homeowner"
      active="/app"
      title="Mein Zuhause"
      subtitle="Dein persönlicher Hausmanager"
    >
      <>
        <EHOwnerDashboardHeader
          eyebrow="Übersicht"
          title={`Hallo ${user.first_name}.`}
          text={houseContext || 'Dein Zuhause im Überblick.'}
          imageSrc="/images/marketing/family-home.jpg"
          imageAlt="Ein Zuhause im Garten"
        />

        {onboardingPending && (
          <EHCallout title="Einrichtung unvollständig">
            <p>Du hast die Ersteinrichtung noch nicht abgeschlossen.</p>
            <EHTextLink href="/app/onboarding">
              Jetzt weiter einrichten
            </EHTextLink>
          </EHCallout>
        )}

        <EHOwnerDashboardTopGrid
          main={
            <EHOwnerDashboardStatus
              eyebrow="Aktuell wichtig"
              title="Hausstatus"
              text="Alles auf einen Blick – so steht es um dein Zuhause."
              items={statusItems}
              primaryAction={{
                href: openDecision
                  ? `/app/jobs/${openDecision.id}`
                  : '/app/jobs',
                label: openDecision ? 'Angebot prüfen' : 'Aufträge ansehen',
              }}
            />
          }
          aside={
            <EHOwnerDashboardOverview
              title="Dein nächster Überblick"
              items={overviewItems}
              emptyText="Aktuell gibt es hier nichts Dringendes."
              footerLink={{
                href: '/app/calendar',
                label: 'Alle Termine anzeigen',
              }}
            />
          }
        />

        <EHOwnerDashboardComposer
          title="Was steht bei deinem Haus an?"
          text="Beschreibe dein Anliegen. Wir helfen dir, den nächsten Schritt zu organisieren."
          composer={
            <HomeownerHausmeisterComposer starterHint="Was gibt es an deinem Haus zu tun?" />
          }
          examples={[
            {
              label: 'Heizung macht ungewöhnliche Geräusche',
              href: '/app/hausmeister',
            },
            {
              label: 'Wasserhahn tropft',
              href: '/app/hausmeister',
            },
            {
              label: 'Frage zu einer Rechnung',
              href: '/app/hausmeister',
            },
            {
              label: 'Termin für Wartung vereinbaren',
              href: '/app/hausmeister',
            },
          ]}
        />

        <EHOwnerDashboardUtilityGrid
          groups={[
            {
              title: 'Für dein Zuhause',
              items: [
                {
                  href: '/app/consultation',
                  title: 'Beratung',
                  text: 'Vorhaben besprechen und Möglichkeiten klären.',
                  icon: <MessageCircle aria-hidden="true" />,
                },
                {
                  href: '/app/emergency',
                  title: 'Notfall',
                  text: 'Hinweise und Unterstützung für dringende Anliegen.',
                  icon: <ShieldCheck aria-hidden="true" />,
                },
              ],
            },
            {
              title: 'Deine Hausakte',
              items: [
                {
                  href: '/app/documents',
                  title: 'Dokumente',
                  text: 'Pläne, Rechnungen und Nachweise wiederfinden.',
                  icon: <FileText aria-hidden="true" />,
                },
              ],
            },
            {
              title: 'Mein Jahr',
              items: [
                {
                  href: '/app/calendar',
                  title: 'Anstehende Termine',
                  text: 'Alle Wartungen und wichtigen Termine im Blick.',
                  icon: <CalendarDays aria-hidden="true" />,
                },
              ],
              footerLink: {
                href: '/app/calendar',
                label: 'Zum Kalender',
              },
            },
          ]}
        />
      </>
    </AppShell>
  );
}
