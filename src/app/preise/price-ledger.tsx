"use client";

import { useState } from 'react';
import { LedgerTable, arch as styles } from '@/components/marketing/archetypes';
import type { LedgerPlan, LedgerRow } from '@/components/marketing/archetypes';

// Archetyp B – Ledger. Ersetzt die drei bzw. vier schwebenden Preiskarten
// durch eine echte Tabelle: dieselben Daten, aber vergleichbar statt
// nebeneinandergestellt. Die Leitspalte wird über eine getönte Fläche
// hervorgehoben, nicht über eine größere Karte.

export type LedgerView = {
  caption: string;
  plans: ReadonlyArray<LedgerPlan>;
  rows: ReadonlyArray<LedgerRow>;
};

export function PriceLedger({ owner, partner }: { owner: LedgerView; partner: LedgerView }) {
  const [view, setView] = useState<'owner' | 'partner'>('owner');
  const active = view === 'owner' ? owner : partner;

  return (
    <div>
      <div className={styles.tabs} role="tablist" aria-label="Zielgruppe wählen">
        <button
          type="button"
          role="tab"
          aria-selected={view === 'owner'}
          className={view === 'owner' ? styles.tabActive : styles.tab}
          onClick={() => setView('owner')}
        >
          Für Eigentümer
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === 'partner'}
          className={view === 'partner' ? styles.tabActive : styles.tab}
          onClick={() => setView('partner')}
        >
          Für Betriebe
        </button>
      </div>

      <LedgerTable caption={active.caption} plans={active.plans} rows={active.rows} />
    </div>
  );
}
