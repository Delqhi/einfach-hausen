"use client";

import { useState } from "react";
import { LockTinyIcon, EyeIcon, EyeOffIcon } from "@/components/icons";

// Visual-only password reveal for the Notion-converged registration form.
// The input keeps the exact name/requirements of the server-action form.
export function PwField({ name, placeholder, hint }: { name: string; placeholder: string; hint?: string }) {
  const [show, setShow] = useState(false);
  return (
    <label className="pill-field ehn-field">
      <span className="sr-only-label">Passwort</span>
      <LockTinyIcon />
      <input name={name} type={show ? "text" : "password"} minLength={8} required autoComplete="new-password" placeholder={placeholder} />
      {hint ? <small className="ehn-field-hint">{hint}</small> : null}
      <button type="button" className="eye-btn" onClick={() => setShow((v) => !v)} aria-label={show ? "Passwort verbergen" : "Passwort anzeigen"}>
        {show ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </label>
  );
}
