"use client";
import {useFormStatus} from "react-dom";
import {EHButton} from "./primitives";
export function EHSubmitButton({children, pendingLabel="Wird gespeichert …", disabled=false}: {
  children: React.ReactNode; pendingLabel?: string; disabled?: boolean;
}) {
  const {pending}=useFormStatus();
  return <EHButton type="submit" disabled={disabled || pending} aria-busy={pending} arrow>
    {pending ? pendingLabel : children}
  </EHButton>;
}
