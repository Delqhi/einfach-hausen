import { db } from "./db";

/**
 * KI-Hausmanager Automations-Präferenzen (nur Ablage, keine Enforcement).
 *
 * Drei Starter-Automationen (vgl. Design-Mock ki-page-mock):
 * - wartungserinnerung (free, default an): erinnert vor Fälligkeit offener Wartungen.
 * - heiz-check-herbst (free, default an): saisonaler Heizungs-Check.
 * - angebotsvergleich (abo, default aus, UI-seitig deaktiviert dargestellt):
 *   wird HIER bewusst nicht durchgesetzt — kein Abo-Check, keine Sperre.
 *   setAutomationPrefs() ignoriert Writes auf abo-Slugs (kein Fake-Enforcement).
 *
 * Speicherung: user_settings.automation_prefs als JSON {slug: boolean}.
 * Thread-/Task-Ansichten nutzen bestehende Tabellen (keine neuen):
 * - letzte Gespräche: assistant_threads + assistant_messages (user_id, channel app)
 * - anstehende Aufgaben: jobs (quoted/open), maintenance_tasks (open, due_date),
 *   quotes (pending) — siehe Aufträge-Seite/Seed-Muster.
 */

export type AutomationTier = "free" | "abo";

export const AUTOMATION_STARTERS: ReadonlyArray<{
  slug: string;
  tier: AutomationTier;
  defaultOn: boolean;
  title: string;
  text: string;
}> = [
  { slug: "wartungserinnerung", tier: "free", defaultOn: true, title: "Wartungserinnerung", text: "Erinnert automatisch vor jeder Fälligkeit" },
  { slug: "angebotsvergleich", tier: "abo", defaultOn: false, title: "Angebotsvergleich", text: "Fasst neue Angebote automatisch zusammen" },
  { slug: "heiz-check-herbst", tier: "free", defaultOn: true, title: "Heiz-Check im Herbst", text: "Prüft jährlich deine Heizungseinstellungen" },
];

const FREE_SLUGS = new Set(AUTOMATION_STARTERS.filter((a) => a.tier === "free").map((a) => a.slug));

export function getAutomationPrefs(userId: number): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  for (const a of AUTOMATION_STARTERS) out[a.slug] = a.defaultOn;
  try {
    const row = db.prepare("SELECT automation_prefs FROM user_settings WHERE user_id=?").get(userId) as { automation_prefs?: string } | undefined;
    if (!row?.automation_prefs) return out;
    const stored = JSON.parse(row.automation_prefs) as Record<string, unknown>;
    for (const a of AUTOMATION_STARTERS) {
      const v: unknown = stored[a.slug];
      if (typeof v === "boolean") out[a.slug] = v;
    }
  } catch {
    // korruptes JSON -> Defaults (fail-closed Anzeige, kein Throw im UI-Pfad)
  }
  return out;
}

/** Nur free-Slugs schreibbar; abo-Slugs werden ignoriert (ehrlich deaktiviert, kein Enforcement erfunden). */
export function setAutomationPrefs(userId: number, patch: Record<string, boolean>): Record<string, boolean> {
  const current = getAutomationPrefs(userId);
  for (const [slug, value] of Object.entries(patch)) {
    if (FREE_SLUGS.has(slug) && typeof value === "boolean") current[slug] = value;
  }
  db.prepare(
    `INSERT INTO user_settings(user_id, automation_prefs, updated_at) VALUES(?,?,CURRENT_TIMESTAMP)
     ON CONFLICT(user_id) DO UPDATE SET automation_prefs=excluded.automation_prefs, updated_at=CURRENT_TIMESTAMP`,
  ).run(userId, JSON.stringify(current));
  return current;
}
