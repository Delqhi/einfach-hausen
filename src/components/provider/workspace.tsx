import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight, ShieldCheck, ShieldOff } from 'lucide-react';

export function ProviderPageIntro({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <header className="provider-page-intro">
      <div>
        {eyebrow && <span className="provider-eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action && (
        <Link className="provider-primary-action" href={action.href}>
          {action.label}
          <ArrowRight size={17} />
        </Link>
      )}
    </header>
  );
}

export function ProviderAccessBoundary({ canManageJobs }: { canManageJobs: boolean }) {
  return (
    <div
      className={`provider-access-boundary ${canManageJobs ? 'is-on' : 'is-off'}`}
      role="status"
      aria-label={`Aufträge verwalten ${canManageJobs ? 'AN' : 'AUS'}`}
    >
      <span className="provider-access-icon" aria-hidden="true">
        {canManageJobs ? <ShieldCheck size={18} /> : <ShieldOff size={18} />}
      </span>
      <div>
        <strong>Aufträge verwalten {canManageJobs ? 'AN' : 'AUS'}</strong>
        <p>
          {canManageJobs
            ? 'Du siehst betriebliche Anfragen, kannst Angebote abgeben und gebuchte Vorgänge zuweisen.'
            : 'Du siehst nur dir zugewiesene Aufträge und Kontakte und bearbeitest dort Ausführung, Kundenkontakt, Dokumente und Rechnungen.'}
        </p>
      </div>
    </div>
  );
}

export function ProviderNextStep({
  title = 'Nächster Schritt',
  description,
  children,
}: {
  title?: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className={`provider-next-step ${children ? '' : 'provider-next-step-single'}`} aria-label={title}>
      <div>
        <span>{title}</span>
        <strong>{description}</strong>
      </div>
      {children && <div className="provider-next-step-action">{children}</div>}
    </section>
  );
}

export function ProviderSectionHeader({
  title,
  description,
  href,
  actionLabel = 'Alle ansehen',
}: {
  title: string;
  description?: string;
  href?: string;
  actionLabel?: string;
}) {
  return (
    <div className="provider-section-head">
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {href && <Link href={href}>{actionLabel}</Link>}
    </div>
  );
}

export function ProviderState({
  icon,
  title,
  description,
  action,
  tone = 'neutral',
  compact = false,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: { href: string; label: string };
  tone?: 'neutral' | 'error' | 'unavailable' | 'success';
  compact?: boolean;
}) {
  const role = tone === 'error' ? 'alert' : tone === 'success' ? 'status' : undefined;
  return (
    <div className={`provider-state provider-state-${tone}${compact ? ' provider-state-compact' : ''}`} role={role}>
      <span className="provider-state-icon">{icon}</span>
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
        {action && (
          <Link href={action.href} className="provider-state-action">
            {action.label}
            <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </div>
  );
}

export function ProviderStatusLine({ children }: { children: ReactNode }) {
  return <div className="provider-status-line">{children}</div>;
}
