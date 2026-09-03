"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import styles from "@/components/marketing/mkt.module.css";

type Entry = { q: string; a: string; cat: string };

export function FaqExplorer({ entries }: { entries: ReadonlyArray<Entry> }) {
  const [cat, setCat] = useState<string>("Alle");
  const categories = useMemo(() => ["Alle", ...Array.from(new Set(entries.map((e) => e.cat)))], [entries]);
  const filtered = useMemo(() => entries.filter((e) => cat === "Alle" || e.cat === cat), [entries, cat]);

  return (
    <div className={styles.stack}>
      <div className={styles.chipRow} role="tablist" aria-label="Themen">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={cat === c}
            className={styles.chip}
            style={cat === c ? { background: "var(--eh-teal-700)", color: "var(--eh-on-dark)", borderColor: "var(--eh-teal-700)" } : undefined}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className={styles.faq} style={{ maxWidth: "none" }}>
        {filtered.map((entry) => (
          <details className={styles.faqItem} key={entry.q}>
            <summary>{entry.q}<Plus size={20} aria-hidden="true" /></summary>
            <div><p>{entry.a}</p></div>
          </details>
        ))}
      </div>
    </div>
  );
}
