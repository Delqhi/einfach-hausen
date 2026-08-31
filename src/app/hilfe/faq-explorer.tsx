"use client";

import { useMemo, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import styles from "@/components/marketing/marketing.module.css";

type Entry = { q: string; a: string; cat: string };

export function FaqExplorer({ entries }: { entries: ReadonlyArray<Entry> }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("Alle");

  const categories = useMemo(
    () => ["Alle", ...Array.from(new Set(entries.map((e) => e.cat)))],
    [entries],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((e) => {
      const matchesCat = cat === "Alle" || e.cat === cat;
      const matchesQuery = !q || e.q.toLowerCase().includes(q) || e.a.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [entries, query, cat]);

  return (
    <div>
      <div className={styles.faqSearchWrap}>
        <div className={styles.faqSearch}>
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Frage oder Stichwort suchen …"
            aria-label="Häufige Fragen durchsuchen"
          />
        </div>
        <div className={styles.faqCatRow} role="tablist" aria-label="Kategorien">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={cat === c}
              className={`${styles.faqCat} ${cat === c ? styles.faqCatActive : ""}`}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className={styles.faqEmpty}>
          Keine Treffer für „{query}“. <a href="/kontakt">Stell deine Frage direkt über den Kontakt.</a>
        </p>
      ) : (
        <div className={`${styles.faqList} ${styles.faqTwoCol}`}>
          {filtered.map((entry) => (
            <details className={styles.faq} key={entry.q}>
              <summary className={styles.faqSummary}>
                <span>{entry.q}</span>
                <ChevronDown size={18} aria-hidden="true" />
              </summary>
              <div className={styles.faqBody}><p>{entry.a}</p></div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
