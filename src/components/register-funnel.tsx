"use client";

import { useRef, useState } from "react";
import { PwField } from "@/components/pw-field";
import styles from "@/components/marketing/register-funnel.module.css";

export type FunnelCategory = { slug: string; title: string; description: string };
export type FunnelService = { slug: string; title: string; category: string };

type Props = {
  action: (fd: FormData) => void | Promise<void>;
  role: "homeowner" | "provider";
  categories: FunnelCategory[];
  services: FunnelService[];
  initialRequest: string;
  error?: string;
  suggestedPostcode: string;
  suggestedCity: string;
};

const OWNER_STEPS = ["Konto", "Zuhause", "Fertig"];
const PRO_STEPS = ["Konto", "Betrieb", "Details"];

export function RegisterFunnel({ action, role, categories, services, initialRequest, error, suggestedPostcode, suggestedCity }: Props) {
  const provider = role === "provider";
  const steps = provider ? PRO_STEPS : OWNER_STEPS;
  const [step, setStep] = useState(0);
  const [postcode, setPostcode] = useState(suggestedPostcode);
  const last = step === steps.length - 1;
  const paneRef = useRef<HTMLDivElement>(null);

  // Alle Schritte bleiben gemountet (Werte bleiben erhalten); nur der aktive
  // ist sichtbar. Weiter prüft nur die sichtbare Pane (native Validierung).
  function next() {
    const pane = paneRef.current;
    if (pane) {
      const invalid = Array.from(pane.querySelectorAll("input")).find(
        (el) => el instanceof HTMLInputElement && !el.checkValidity(),
      );
      if (invalid && invalid instanceof HTMLInputElement) {
        invalid.reportValidity();
        invalid.focus();
        return;
      }
    }
    setStep(step + 1);
  }

  return (
    <div className={styles.funnel}>
      <ol className={styles.steps} aria-label="Fortschritt">
        {steps.map((label, i) => (
          <li key={label} data-active={i === step} data-done={i < step} aria-current={i === step ? "step" : undefined}>
            <i aria-hidden="true" />{i + 1}. {label}
          </li>
        ))}
      </ol>
      {error && <div className={styles.error} role="alert">{error}</div>}
      <form action={action}>
        <input type="hidden" name="role" value={role} />
        {initialRequest && !provider && (
          <>
            <div className={styles.summary} style={{ marginTop: 14 }}>
              <dl>
                <dt>Dein Anliegen</dt>
                <dd>{initialRequest}</dd>
              </dl>
              <span className={styles.hint}>Nach der Anmeldung machen wir genau hier weiter.</span>
            </div>
            <input type="hidden" name="initialRequest" value={initialRequest} />
          </>
        )}

        {/* Schritt 1 */}
          <div className={styles.pane} ref={step === 0 ? paneRef : undefined} hidden={step !== 0}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <label className={styles.field}>Vorname
                <input name="firstName" required placeholder="Vorname" autoComplete="given-name" />
              </label>
              <label className={styles.field}>Nachname
                <input name="lastName" required placeholder="Nachname" autoComplete="family-name" />
              </label>
            </div>
            <label className={styles.field}>E-Mail
              <input name="email" type="email" required placeholder="du@example.de" autoComplete="email" />
            </label>
            <label className={styles.field}>Telefon
              <input name="phone" type="tel" placeholder="Telefonnummer (optional)" autoComplete="tel" />
            </label>
            <PwField name="password" placeholder="Passwort erstellen" hint="Mindestens 8 Zeichen" />
          </div>

        {/* Schritt 2 (owner) */}
          <div className={styles.pane} ref={step === 1 ? paneRef : undefined} hidden={step !== 1 || provider}>
            {suggestedPostcode && (
              <p className={styles.geoNote}>PLZ {suggestedPostcode}{suggestedCity ? ` (${suggestedCity})` : ""} erkannt — stimmt das? Einfach anpassen, falls nicht.</p>
            )}
            <label className={styles.field}>PLZ
              <input name="postcode" inputMode="numeric" required placeholder="PLZ" autoComplete="postal-code" value={postcode} onChange={(e) => setPostcode(e.target.value)} />
            </label>
            <label className={styles.field}>Adresse <span className={styles.hint}>(optional)</span>
              <input name="address" placeholder="Straße und Hausnummer" autoComplete="street-address" />
            </label>
          </div>

        {/* Schritt 2 (provider) */}
          <div className={styles.pane} ref={step === 1 ? paneRef : undefined} hidden={step !== 1 || !provider}>
            <label className={styles.field}>Firmenname
              <input name="businessName" required placeholder="Firmenname" autoComplete="organization" />
            </label>
            <label className={styles.field}>Leistungen / Gewerke
              <input name="trades" required placeholder="z. B. Sanitär, Heizung, Garten" />
            </label>
            {suggestedPostcode && (
              <p className={styles.geoNote}>PLZ {suggestedPostcode}{suggestedCity ? ` (${suggestedCity})` : ""} erkannt — stimmt das? Einfach anpassen, falls nicht.</p>
            )}
            <label className={styles.field}>PLZ Einsatzgebiet
              <input name="postcode" inputMode="numeric" required placeholder="PLZ" value={postcode} onChange={(e) => setPostcode(e.target.value)} />
            </label>
            <input type="hidden" name="radius" value="25" />
          </div>

        {/* Schritt 3 (owner) */}
          <div className={styles.pane} hidden={step !== 2 || provider}>
            <div className={styles.summary}>
              <dl>
                <dt>Fast geschafft</dt>
                <dd>Ein Konto, ein Zuhause, ein Ansprechpartner. Kostenlos, unverbindlich, keine Kündigungsfrist.</dd>
              </dl>
            </div>
          </div>

        {/* Schritt 3 (provider) */}
          <div className={styles.pane} hidden={step !== 2 || !provider}>
            <p className={styles.hint}>Optional — alles lässt sich später im Profil ergänzen.</p>
            <div className={styles.checks} aria-label="Tätigkeiten">
              {categories.map((c) => (
                <label key={c.slug}><input type="checkbox" name="providerCategory" value={c.slug} defaultChecked={c.slug === "handwerk"} />{c.title} — {c.description}</label>
              ))}
            </div>
            <div className={styles.checks} aria-label="Anfragearten">
              <label><input type="checkbox" name="acceptsConsultation" defaultChecked /> Beratung / Fachfragen</label>
              <label><input type="checkbox" name="acceptsShortNotice" defaultChecked /> Kurzfristige Aufträge</label>
              <label><input type="checkbox" name="acceptsEmergencies" /> Notfallanfragen</label>
            </div>
            {services.length > 0 && (
              <details>
                <summary className={styles.hint}>Konkrete Leistungen auswählen ({services.length})</summary>
                <div className={styles.checks} style={{ marginTop: 8 }}>
                  {services.slice(0, 24).map((s) => (
                    <label key={s.slug}><input type="checkbox" name="serviceSlug" value={s.slug} />{s.title}</label>
                  ))}
                </div>
              </details>
            )}
            <input type="hidden" name="emergencyMode" value="local" />
            <input type="hidden" name="emergencyStart" value="18:00" />
            <input type="hidden" name="emergencyEnd" value="22:00" />
            <input type="hidden" name="emergencyMarkup" value="0" />
          </div>

        <div className={styles.nav}>
          {step > 0 && <button type="button" className={styles.ghost} onClick={() => setStep(step - 1)}>Zurück</button>}
          {!last && <button type="button" className={styles.primary} onClick={next}>Weiter</button>}
          {last && <button type="submit" className={styles.primary}>Konto erstellen</button>}
        </div>
      </form>
    </div>
  );
}
