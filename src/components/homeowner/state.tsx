import Link from 'next/link';
import type { ReactNode } from 'react';

type EmptyAction = {
  href: string;
  label: string;
};

export function HomeownerEmptyState({
  icon,
  title,
  description,
  action,
  compact = false,
  live = false,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: EmptyAction;
  compact?: boolean;
  live?: boolean;
}) {
  return (
    <div
      className={`empty owner-empty-state${compact ? ' compact' : ''}`}
      role={live ? 'status' : undefined}
      aria-live={live ? 'polite' : undefined}
      aria-atomic={live ? 'true' : undefined}
    >
      <span className="owner-empty-icon" aria-hidden="true">{icon}</span>
      <div className="owner-empty-copy">
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
      {action ? <Link className="owner-state-link" href={action.href}>{action.label}</Link> : null}
    </div>
  );
}

export function HomeownerNotice({
  children,
  id,
  kind = 'info',
}: {
  children: ReactNode;
  id?: string;
  kind?: 'error' | 'success' | 'integration' | 'info';
}) {
  const isError = kind === 'error';
  const alertClass = isError ? 'error' : kind === 'success' ? 'success' : '';

  return (
    <div
      id={id}
      className={`alert ${alertClass} owner-notice owner-notice-${kind}`.trim()}
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      {children}
    </div>
  );
}
