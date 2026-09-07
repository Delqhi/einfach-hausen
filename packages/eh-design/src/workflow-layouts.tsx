import type {ComponentProps, ReactNode} from "react";
import {EHHeading, EHText} from "./primitives";
import s from "./styles.module.css";

export function EHWorkflowStack({children}: {children: ReactNode}) {
  return <div className={s.workflowStack}>{children}</div>;
}

export function EHFormSection({title, description, children}: {
  title: string; description?: string; children: ReactNode;
}) {
  return <fieldset className={s.formSection}><legend>{title}</legend>
    {description && <EHText>{description}</EHText>}
    <div className={s.workflowStack}>{children}</div>
  </fieldset>;
}

export function EHFieldGrid({children}: {children: ReactNode}) {
  return <div className={s.fieldGrid}>{children}</div>;
}

export function EHWorkflowForm({children, action}: {
  children: ReactNode; action: ComponentProps<"form">["action"];
}) {
  return <form action={action} className={s.workflowForm}>{children}</form>;
}

export function EHFormFeedback({kind, children}: {
  kind: "error" | "success" | "info"; children: ReactNode;
}) {
  return <div className={s.formFeedback} data-kind={kind}
    role={kind === "error" ? "alert" : kind === "success" ? "status" : undefined}>{children}</div>;
}

export function EHStepProgress({steps, current}: {
  steps: readonly {id: string; label: string}[]; current: string;
}) {
  const index=steps.findIndex(step=>step.id===current);
  return <nav aria-label="Einrichtungsschritte"><ol className={s.stepProgress}>
    {steps.map((step,i)=><li key={step.id} aria-current={step.id===current ? "step" : undefined}>
      <span aria-hidden="true">{String(i+1).padStart(2,"0")}</span>
      <div>{step.label}<small>{i===index ? "Aktueller Schritt" : i<index ? "Vorheriger Schritt" : "Folgender Schritt"}</small></div>
    </li>)}
  </ol></nav>;
}

export function EHWorkflowHeading({title, description}: {title: string; description?: string}) {
  return <div className={s.workflowStack}><EHHeading as="h2" scale="section">{title}</EHHeading>
    {description && <EHText>{description}</EHText>}
  </div>;
}
