"use client";
import {EHRequestForm} from "@/design-system";
const EXAMPLES = ["Dachrinne reinigen lassen", "Badezimmer renovieren", "Wallbox für das E-Auto einbauen"] as const;
/** Existing GET funnel and public props preserved; canonical readable controls. */
export function IntakeForm({variant="hero",id}: {variant?: "hero"|"band"|"compact";id?:string}) {
  return <EHRequestForm id={id} action="/register" name="request" hidden={{role:"homeowner"}}
    label="Dein Anliegen in deinen Worten" submitLabel="Anliegen starten" examples={EXAMPLES} compact={variant==="compact"}/>;
}
