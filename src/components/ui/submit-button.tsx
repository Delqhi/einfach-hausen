'use client';

import { useFormStatus } from 'react-dom';
import type { ReactNode } from 'react';

// T-0155 shared submit control: one double-submit + pending-feedback contract
// for server-action forms. While the action is in flight the control is
// disabled and announces the pending state; offline pages keep their own
// guards (network status components) layered on top.
export function SubmitButton({
  children,
  pendingLabel = 'Wird gesendet…',
  className,
  disabled = false,
  title,
}: {
  children: ReactNode;
  pendingLabel?: string;
  className?: string;
  disabled?: boolean;
  title?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={className}
      title={title}
      disabled={disabled || pending}
      aria-busy={pending}
    >
      {pending ? (
        <>
          <span className="submit-spinner" aria-hidden="true" />
          <span>{pendingLabel}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
