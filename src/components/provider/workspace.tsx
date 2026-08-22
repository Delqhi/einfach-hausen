import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

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
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: { href: string; label: string };
  tone?: 'neutral' | 'error' | 'unavailable' | 'success';
}) {
  return (
    <div className={`provider-state provider-state-${tone}`} role={tone === 'error' ? 'alert' : undefined}>
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
