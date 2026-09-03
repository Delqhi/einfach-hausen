"use client";

import { useState } from "react";
import styles from "@/components/marketing/mkt.module.css";
import { BulletList, LinkButton } from "@/components/marketing/ui";

type Plan = { name: string; price: string; text: string; items?: readonly string[]; tag?: string };

export function PriceToggle({ customer, partner }: {
  customer: ReadonlyArray<Plan & { items: readonly string[] }>;
  partner: ReadonlyArray<Plan>;
}) {
  const [view, setView] = useState<"owner" | "partner">("owner");

  return (
    <div>
      <div className={styles.toggleRow}>
        <div className={styles.toggle} role="tablist" aria-label="Zielgruppe wählen">
          <button type="button" role="tab" aria-selected={view === "owner"} className={view === "owner" ? styles.toggleActive : ""} onClick={() => setView("owner")}>Für Eigentümer</button>
          <button type="button" role="tab" aria-selected={view === "partner"} className={view === "partner" ? styles.toggleActive : ""} onClick={() => setView("partner")}>Für Betriebe</button>
        </div>
      </div>

      {view === "owner" ? (
        <div className={styles.priceGrid}>
          {customer.map((plan, index) => (
            <article className={index === 0 ? styles.planHero : styles.plan} key={plan.name}>
              <div className={styles.planHead}>
                {plan.tag && <span className={styles.planTag}>{plan.tag}</span>}
                <span className={styles.planName}>{plan.name}</span>
                <div className={styles.planPrice}>{plan.price}<small>/ Monat</small></div>
                <p>{plan.text}</p>
              </div>
              <BulletList items={plan.items} />
              <LinkButton href="/register?role=homeowner" variant={index === 0 ? "onDark" : "ghost"}>
                {index === 0 ? "Kostenlos starten" : `Mit FREE starten, später ${plan.name}`}
              </LinkButton>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.priceGrid} data-cols="4">
          {partner.map((plan, index) => (
            <article className={index === 2 ? styles.planHero : styles.plan} key={plan.name}>
              <div className={styles.planHead}>
                <span className={styles.planName}>{plan.name}</span>
                <div className={styles.planPrice}>{plan.price}<small>/ Monat</small></div>
                <p>{plan.text}</p>
              </div>
              <BulletList items={index === 0
                ? ["Begrenzte Anzahl neuer Anfragen", "0 % Auftragsprovision"]
                : ["2 Monate kostenlose Testphase", "0 % Auftragsprovision", "Tarif kauft keine bessere Matching-Position"]} />
              <LinkButton href="/register?role=provider" variant={index === 2 ? "onDark" : "ghost"}>Partner starten</LinkButton>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
