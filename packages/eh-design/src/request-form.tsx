"use client";
import {useId, useRef, useState} from "react";
import {EHButton} from "./primitives";
import {EHInput} from "./app";
import s from "./styles.module.css";

/** Real GET form. The consumer owns route, field names and hidden values. */
export function EHRequestForm({id, action, name, label, submitLabel, hidden, examples, compact = false}: {
  id?: string; action: string; name: string; label: string; submitLabel: string;
  hidden: Readonly<Record<string,string>>; examples: readonly string[]; compact?: boolean;
}) {
  const uid=useId();
  const inputId="eh-request-"+uid;
  const ref=useRef<HTMLFormElement>(null);
  const [value,setValue]=useState("");
  function focusInput() {
    ref.current?.querySelector<HTMLInputElement>("input:not([type=hidden])")?.focus();
  }
  return <form id={id} ref={ref} action={action} method="get" className={s.requestForm}
    onSubmit={event=>{if(value.trim().length<4){event.preventDefault();focusInput();}}}>
    {Object.entries(hidden).map(([key,val])=><input key={key} type="hidden" name={key} value={val}/>)}
    <label htmlFor={inputId}>{label}</label>
    <div className={s.requestRow}>
      <EHInput id={inputId} name={name} value={value} onChange={event=>setValue(event.target.value)}
        minLength={4} maxLength={700} required autoComplete="off" placeholder="Zum Beispiel: Die Dachrinne läuft über."/>
      <EHButton type="submit" arrow>{submitLabel}</EHButton>
    </div>
    {!compact && <div className={s.requestExamples} aria-label="Beispiel-Anliegen">
      {examples.map(example=><button type="button" key={example} onClick={()=>{setValue(example);focusInput();}}>{example}</button>)}
    </div>}
  </form>;
}
