"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, CircleCheck } from "lucide-react";
import styles from "@/components/marketing/marketing.module.css";

const EXAMPLES = [
  "Meine Heizung macht ungewöhnliche Geräusche",
  "Dachrinne reinigen lassen",
  "Badezimmer renovieren",
  "Wallbox für das E-Auto einbauen",
  "Jährliche Gartenpflege organisieren",
] as const;

const SWAP_MS = 3200;
const FADE_MS = 380;

export function IntakeForm() {
  const [value, setValue] = useState("");
  const [exampleIndex, setExampleIndex] = useState(0);
  const [ghostVisible, setGhostVisible] = useState(true);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const showGhost = value.length === 0 && !(focused && ghostVisible === false);

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
        <div className={styles.intakeField}>
          <input
            id="request"
            name="request"
            ref={inputRef}
            minLength={4}
            maxLength={700}
            required
            autoComplete="off"
            aria-describedby="intake-examples"
            placeholder="Beschreibe einfach, was ansteht …"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <span
            className={styles.intakeGhost}
            aria-hidden="true"
            data-visible={value.length === 0 ? "true" : "false"}
            style={{ opacity: showGhost && ghostVisible ? 1 : 0, transitionDuration: `${FADE_MS}ms` }}
          >
            {EXAMPLES[exampleIndex]}
          </span>
        </div>
        <button type="submit">Anliegen starten <ArrowRight size={17} aria-hidden="true" /></button>
      </div>
      <div id="intake-examples" className={styles.chipRow} role="list" aria-label="Beispiel-Anliegen">
        {EXAMPLES.slice(0, 4).map((example) => (
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
