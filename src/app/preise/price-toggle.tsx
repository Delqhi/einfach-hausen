"use client";

import { useState } from "react";
import styles from "@/components/marketing/marketing.module.css";
import { BulletList, LinkButton } from "@/components/marketing/ui";

type Plan = { name: string; price: string; text: string; items?: readonly string[] };

export function PriceToggle({ customer, partner }: {
  customer: ReadonlyArray<Plan & { items: readonly string[] }>;
  partner: ReadonlyArray<Plan>;
}) {
  const [view, setView] = useState<"owner" | "partner">("owner");

  return (
    <div>
      <div className={styles.priceToggleRow}>
        <div className={styles.priceToggle} role="tablist" aria-label="Zielgruppe wählen">
          <button type="button" role="tab" aria-selected={view === "owner"}
            className={view === "owner" ? styles.priceToggleActive : ""}
            onClick={() => setView("owner")}>Für Eigentümer</button>
          <button type="button" role="tab" aria-selected={view === "partner"}
            className={view === "partner" ? styles.priceToggleActive : ""}
            onClick={() => setView("partner")}>Für Betriebe</button>
        </div>
      </div>

      {view === "owner" ? (
        <div className={styles.priceGrid}>
          {customer.map((plan, index) => (
            <article className={`${styles.priceCard} ${index === 1 ? styles.priceCardFeatured : ""}`} key={plan.name}>
              <h3>{plan.name}</h3>
              <div className={styles.price}>{plan.price}<small>/ Monat</small></div>
              <p>{plan.text}</p>
              <BulletList items={plan.items} />
              <LinkButton href="/register?role=homeowner" secondary={index !== 0}>
                {index === 0 ? "Kostenlos starten" : `${plan.name} ansehen`}
              </LinkButton>
            </article>
          ))}
        </div>
      ) : (
        <div className={`${styles.priceGrid} ${styles.priceGridFour}`}>
          {partner.map((plan, index) => (
            <article className={`${styles.priceCard} ${index === 2 ? styles.priceCardFeatured : ""}`} key={plan.name}>
              <h3>{plan.name}</h3>
              <div className={styles.price}>{plan.price}<small>/ Monat</small></div>
              <p>{plan.text}</p>
              <BulletList items={index === 0
                ? ["Begrenzte Anzahl neuer Anfragen", "0 % Auftragsprovision"]
                : ["2 Monate kostenlose Testphase", "0 % Auftragsprovision", "Tarif kauft keine bessere Matching-Position"]} />
              <LinkButton href="/register?role=provider" secondary={index !== 1}>Partner starten</LinkButton>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
