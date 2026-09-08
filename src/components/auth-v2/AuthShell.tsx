"use client";

import { useState } from "react";
import {
  EHActions,
  EHDivider,
  EHLogo,
  EHPageHero,
  EHPanel,
  EHPromiseRow,
  EHScope,
  EHSection,
  EHTextLink,
} from "@/design-system";
import { LoginForm, type AuthMode, type Role } from "./LoginForm";

const copy = {
  kunde: {
    eyebrow: "Eigentümer-Zugang",
    title: "Dein Zuhause. Alles an seinem Platz.",
    text: "Hausakte, Anliegen, Termine und verlässliche Fachbetriebe bleiben in einem ruhigen, nachvollziehbaren Arbeitsbereich zusammen.",
    promises: [
      { title: "Hauswissen bleibt erhalten", text: "Dokumente, Arbeiten und Entscheidungen bleiben deinem Zuhause zugeordnet." },
      { title: "Du entscheidest", text: "Keine Beauftragung ohne deine ausdrückliche Freigabe." },
      { title: "Persönlich weiter", text: "Nach der digitalen Vorbereitung übernimmt bei Bedarf ein konkreter Ansprechpartner." },
    ],
  },
  handwerker: {
    eyebrow: "Partner-Zugang",
    title: "Aufträge klar vorbereitet. Arbeit sauber organisiert.",
    text: "Anfragen, Hausinformationen, Termine und Kommunikation kommen strukturiert zusammen — ohne Lead-Börse und ohne unnötige Portal-Komplexität.",
    promises: [
      { title: "Regionale Anfragen", text: "Arbeite mit nachvollziehbaren Vorgängen aus deinem tatsächlichen Einsatzgebiet." },
      { title: "Kontext vor dem Termin", text: "Fotos, Hausdaten und Verlauf helfen dir, vorbereitet in den Auftrag zu gehen." },
      { title: "Direkte Zusammenarbeit", text: "Klare Zuständigkeiten statt anonymer Biet- und Lead-Mechanik." },
    ],
  },
} as const;

export function AuthShell({
  initialAuthMode = "login",
  initialRole = "kunde",
  nextPath,
}: {
  initialAuthMode?: AuthMode;
  initialRole?: Role;
  nextPath?: string;
}) {
  const [role, setRole] = useState<Role>(initialRole);
  const current = copy[role];

  return (
    <EHScope app>
      <EHSection compact><EHLogo /></EHSection>
      <EHPageHero
        eyebrow={current.eyebrow}
        number="01"
        title={current.title}
        text={current.text}
        media={
          <EHPanel label={initialAuthMode === "login" ? "Sicher anmelden" : "Konto anlegen"}>
            <LoginForm
              role={role}
              initialAuthMode={initialAuthMode}
              nextPath={nextPath}
              onRoleChange={setRole}
            />
          </EHPanel>
        }
      />
      <EHSection compact tone="white">
        <EHPromiseRow items={current.promises.map((item) => ({ ...item }))} />
        <EHDivider />
        <nav aria-label="Hilfe und Rechtliches">
          <EHActions>
            <EHTextLink href="/hilfe">Hilfe</EHTextLink>
            <EHTextLink href="/datenschutz">Datenschutz</EHTextLink>
            <EHTextLink href="/impressum">Impressum</EHTextLink>
          </EHActions>
        </nav>
      </EHSection>
    </EHScope>
  );
}
