"use client";

import { useState } from "react";
import { Check, Minus } from "lucide-react";
import styles from "./price-ledger.module.css";

export type LedgerPlan = {
  name: string;
  price: string;
  unit?: string;
  note?: string;
  lead?: boolean;
};

export type LedgerRow = {
  label: string;
  values: ReadonlyArray<boolean | string>;
};

export type LedgerView = {
  caption: string;
  plans: ReadonlyArray<LedgerPlan>;
  rows: ReadonlyArray<LedgerRow>;
};

const PANEL_ID = "preise-ledger-panel";

/**
 * Vergleichstabelle für die Tarife. Ersetzt das frühere Kartenraster
 * (`PriceToggle`): gleiche Daten, aber Zeile für Zeile vergleichbar statt
 * nebeneinandergestellt. Reine Tabelle, damit Screenreader und Auge
 * dieselbe Struktur sehen.
 */
export function PriceLedger({ owner, partner }: { owner: LedgerView; partner: LedgerView }) {
  const [view, setView] = useState<"owner" | "partner">("owner");
  const active = view === "owner" ? owner : partner;

  function onTabListKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    setView((current) => (current === "owner" ? "partner" : "owner"));
  }

  return (
    <div>
      <div className={styles.tabs} role="tablist" aria-label="Zielgruppe wählen" onKeyDown={onTabListKeyDown}>
        <button
          type="button"
          role="tab"
          id="preise-tab-owner"
          aria-selected={view === "owner"}
          aria-controls={PANEL_ID}
          className={view === "owner" ? styles.tabActive : styles.tab}
          onClick={() => setView("owner")}
        >
          Für Eigentümer
        </button>
        <button
          type="button"
          role="tab"
          id="preise-tab-partner"
          aria-selected={view === "partner"}
          aria-controls={PANEL_ID}
          className={view === "partner" ? styles.tabActive : styles.tab}
          onClick={() => setView("partner")}
        >
          Für Betriebe
        </button>
      </div>

      <div className={styles.tableScroll} id={PANEL_ID} role="tabpanel" tabIndex={0} aria-labelledby={`preise-tab-${view}`}>
        <table className={styles.ledgerTable}>
          <caption className={styles.srOnly}>{active.caption}</caption>
          <thead>
            <tr>
              <td />
              {active.plans.map((plan) => (
                <th scope="col" className={plan.lead ? styles.colLead : undefined} key={plan.name}>
                  <span className={styles.planName}>{plan.name}</span>
                  <span className={styles.planPrice}>
                    {plan.price}
                    <span className={styles.planUnit}>{plan.unit ?? "/ Monat"}</span>
                  </span>
                  {plan.note && <span className={styles.planNote}>{plan.note}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {active.rows.map((row) => (
              <tr key={row.label}>
                <th scope="row" className={styles.rowLabel}>
                  {row.label}
                </th>
                {row.values.map((value, i) => (
                  <td
                    className={active.plans[i]?.lead ? styles.colLead : undefined}
                    key={`${row.label}-${active.plans[i]?.name ?? i}`}
                  >
                    {value === true && (
                      <span className={styles.cellYes}>
                        <Check size={17} strokeWidth={2.4} aria-label="enthalten" />
                      </span>
                    )}
                    {value === false && (
                      <span className={styles.cellNo}>
                        <Minus size={16} aria-label="nicht enthalten" />
                      </span>
                    )}
                    {typeof value === "string" && <span className={styles.cellText}>{value}</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
