import type { ReactNode } from "react";
import s from "./styles.module.css";

/** Shared screen and print treatment for existing business documents. */
export function EHDocumentFrame({children}:{children:ReactNode}) {
  return <div className={s.documentFrame}>{children}</div>;
}
