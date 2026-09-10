"use client";

import { EHButton, EHDialog, EHText } from "@/design-system";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
}

export function ForgotPasswordModal({
  isOpen,
  onClose,
  defaultEmail = "",
}: ForgotPasswordModalProps) {
  return (
    <EHDialog
      open={isOpen}
      onClose={onClose}
      title="Passwort vergessen?"
      actions={
        <>
          <EHButton href="/kontakt" arrow>Kontakt öffnen</EHButton>
          <EHButton type="button" variant="secondary" onClick={onClose}>Schließen</EHButton>
        </>
      }
    >
      <EHText>
        {defaultEmail ? `Für ${defaultEmail}: ` : ""}
        Der automatische Reset ist noch nicht als produktiver Self-Service freigegeben. Über den Kontakt helfen wir dir beim sicheren Zurücksetzen des Zugangs.
      </EHText>
      <EHText size="meta">
        Für interne Demo-Prüfungen bleiben die vorhandenen Demo-Zugänge auf der Anmeldeseite verfügbar.
      </EHText>
    </EHDialog>
  );
}
