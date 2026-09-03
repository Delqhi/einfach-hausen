/**
 * Einfach Hausen — CRM Client Bridge
 * 
 * Synchronisiert Leads, Reparaturanfragen und Handwerker-Profile
 * bidirektional mit dem zentralen CRM (crm.einfachhausen.de).
 */

export interface SyncPayload<T = unknown> {
  type: 'leads' | 'requests' | 'partners';
  records: T[];
}

export interface SyncResult {
  success: boolean;
  type: string;
  synced: number;
  timestamp: string;
  error?: string;
}

export async function syncToCrm(payload: SyncPayload): Promise<SyncResult> {
  const crmUrl = process.env.CRM_BASE_URL || 'https://crm.einfachhausen.de';
  const crmToken = process.env.CRM_SYNC_TOKEN || process.env.ADMIN_SECRET;

  if (!crmToken) {
    console.warn('[CRM Sync] Kein CRM_SYNC_TOKEN konfiguriert; Sync wird übersprungen.');
    return {
      success: false,
      type: payload.type,
      synced: 0,
      timestamp: new Date().toISOString(),
      error: 'missing_token',
    };
  }

  try {
    const res = await fetch(`${crmUrl}/api/v1/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${crmToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`CRM API antwortete mit Status ${res.status}: ${errText}`);
    }

    return (await res.json()) as SyncResult;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[CRM Sync Error]', message);
    return {
      success: false,
      type: payload.type,
      synced: 0,
      timestamp: new Date().toISOString(),
      error: message,
    };
  }
}
