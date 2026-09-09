"use client";
import { EHButton } from "@/design-system";

/** Browser-owned print/PDF flow; never creates or sends a document. */
export function PrintButton() {
  return <EHButton variant="secondary" onClick={() => window.print()}>Drucken / PDF speichern</EHButton>;
}
