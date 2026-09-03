"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, CircleCheck } from "lucide-react";
import styles from "@/components/marketing/mkt.module.css";

const EXAMPLES = [
  "Meine Heizung macht ungewöhnliche Geräusche",
  "Dachrinne reinigen lassen",
  "Badezimmer renovieren",
  "Wallbox für das E-Auto einbauen",
  "Jährliche Gartenpflege organisieren",
] as const;

const SWAP_MS = 3200;
const FADE_MS = 380;

type Variant = "hero" | "band" | "compact";

/**
 * The single lead-capture control of the public website.
 * Submits as GET to /register (role=homeowner, request=…) so the funnel keeps
 * the homeowner's own words. E2E anchors: label "Was steht bei deinem Haus an?",
 * button "Anliegen starten", meta "Hauskonto kostenlos" / "kein Auftrag ohne deine Entscheidung".
 */
export function IntakeForm({ variant = "hero", id }: { variant?: Variant; id?: string }) {
  const [value, setValue] = useState("");
  const [exampleIndex, setExampleIndex] = useState(0);
  const [ghostVisible, setGhostVisible] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const uid = useId();
  const inputId = variant === "hero" ? "request" : `request-${uid}`;
  const examplesId = `intake-examples-${uid}`;
  const compact = variant === "compact";

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setGhostVisible(false);
      window.setTimeout(() => {
        setExampleIndex((index) => (index + 1) % EXAMPLES.length);
        setGhostVisible(true);
      }, FADE_MS);
    }, SWAP_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <form
      id={id}
      action="/register"
      method="get"
      className={`${styles.intake} ${compact ? styles.intakeCompact : ""}`}
      onSubmit={(event) => {
        if (!value.trim()) {
          event.preventDefault();
          inputRef.current?.focus();
        }
      }}
    >
      <input type="hidden" name="role" value="homeowner" />
      <label htmlFor={inputId}>Was steht bei deinem Haus an?</label>
      <div className={styles.intakeHead}>
        <span className={styles.intakeLabel}>Was steht bei deinem Haus an?</span>
        <span className={styles.intakeBadge}>kostenlos &amp; unverbindlich</span>
      </div>
      <div className={styles.intakeRow}>
        <div className={styles.intakeField}>
          <input
            id={inputId}
            name="request"
            ref={inputRef}
            minLength={4}
            maxLength={700}
            required
            autoComplete="off"
            aria-describedby={compact ? undefined : examplesId}
            placeholder="Beschreibe einfach, was ansteht …"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
          <span
            className={styles.intakeGhost}
            aria-hidden="true"
            data-visible={value.length === 0 ? "true" : "false"}
            style={{ opacity: value.length === 0 && ghostVisible ? 1 : 0, transitionDuration: `${FADE_MS}ms` }}
          >
            {EXAMPLES[exampleIndex]}
          </span>
        </div>
        <button type="submit">Anliegen starten <ArrowRight size={17} aria-hidden="true" /></button>
      </div>
      <div id={examplesId} className={styles.chipRow} aria-label="Beispiel-Anliegen">
        {EXAMPLES.slice(0, 4).map((example) => (
          <button
            type="button"
            key={example}
            className={styles.chip}
            onClick={() => {
              setValue(example);
              inputRef.current?.focus();
            }}
          >
            {example}
          </button>
        ))}
      </div>
      <div className={styles.intakeMeta}>
        <span><CircleCheck size={15} aria-hidden="true" /> Hauskonto kostenlos</span>
        <span><CircleCheck size={15} aria-hidden="true" /> unverbindlich starten</span>
        <span><CircleCheck size={15} aria-hidden="true" /> kein Auftrag ohne deine Entscheidung</span>
      </div>
    </form>
  );
}
