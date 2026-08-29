"use client";

import { useRef, useState } from "react";
import { ArrowRight, CircleCheck } from "lucide-react";
import styles from "@/components/marketing/marketing.module.css";

const EXAMPLES = [
  "Heizung macht ungewöhnliche Geräusche",
  "Dachrinne reinigen lassen",
  "Badezimmer renovieren",
  "Wallbox für das E-Auto einbauen",
] as const;

export function IntakeForm() {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      action="/register"
      method="get"
      className={styles.intake}
      onSubmit={(event) => {
        if (!value.trim()) {
          event.preventDefault();
          inputRef.current?.focus();
        }
      }}
    >
      <input type="hidden" name="role" value="homeowner" />
      <label htmlFor="request">Was steht bei deinem Haus an?</label>
      <div className={styles.intakeRow}>
        <input
          id="request"
          name="request"
          ref={inputRef}
          minLength={4}
          maxLength={700}
          required
          autoComplete="off"
          placeholder="z. B. Meine Heizung macht ungewöhnliche Geräusche …"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <button type="submit">Anliegen starten <ArrowRight size={17} aria-hidden="true" /></button>
      </div>
      <div className={styles.chipRow} role="list" aria-label="Beispiel-Anliegen">
        {EXAMPLES.map((example) => (
          <button
            type="button"
            role="listitem"
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
        <span><CircleCheck size={14} aria-hidden="true" /> Hauskonto kostenlos</span>
        <span><CircleCheck size={14} aria-hidden="true" /> unverbindlich starten</span>
        <span><CircleCheck size={14} aria-hidden="true" /> kein Auftrag ohne deine Entscheidung</span>
      </div>
    </form>
  );
}
