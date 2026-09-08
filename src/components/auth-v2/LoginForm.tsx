'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  EHActions,
  EHButton,
  EHCheckbox,
  EHDivider,
  EHErrorState,
  EHField,
  EHFieldGrid,
  EHFormSection,
  EHInput,
  EHText,
  EHTextLink,
  EHWorkflowHeading,
} from "@/design-system";
import { getSupabase } from "@/lib/supabase";
import { DEMO_PASSWORD, DEMO_USERS, demoEmailFor } from "@/lib/demo-accounts";
import { registerAction } from "@/app/actions";
import { safeNextPath } from "@/lib/safe-redirect";
import { ForgotPasswordModal } from "./ForgotPasswordModal";
import { LegalModal } from "./LegalModal";

export type Role = "kunde" | "handwerker";
export type AuthMode = "login" | "register";
interface LoginFormProps {
  role?: Role;
  initialRole?: Role;
  initialAuthMode?: AuthMode;
  nextPath?: string;
  onRoleChange?: (role: Role) => void;
  onOpenLegalModal?: (type: LegalType) => void;
}

type LegalType = "agb" | "datenschutz" | "impressum" | "sicherheit" | "partnerkriterien";

export function LoginForm({
  role: propRole,
  initialRole = "kunde",
  initialAuthMode = "login",
  nextPath,
  onRoleChange,
  onOpenLegalModal,
}: LoginFormProps = {}) {
  const router = useRouter();
  const [internalRole, setInternalRole] = useState<Role>(initialRole);
  const role = propRole ?? internalRole;
  const setRole = (value: Role) => onRoleChange ? onRoleChange(value) : setInternalRole(value);
  const [authMode, setAuthMode] = useState<AuthMode>(initialAuthMode);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [trades, setTrades] = useState("");
  const [postcode, setPostcode] = useState("");
  const [address, setAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<LegalType | null>(null);

  const openLegal = (type: LegalType) => {
    if (onOpenLegalModal) onOpenLegalModal(type);
    else setLegalModalType(type);
  };

  async function doLogin(email: string, pw: string) {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const supabase = await getSupabase();
      const { error } = await supabase.auth.signInWithPassword({ email: demoEmailFor(email), password: pw });
      if (error) {
        setErrorMessage(error.message === "Invalid login credentials" ? "E-Mail oder Passwort falsch." : error.message);
        setIsLoading(false);
        return;
      }
      router.replace(safeNextPath(nextPath));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Anmeldung fehlgeschlagen.");
      setIsLoading(false);
    }
  }

  const handleQuickFill = (targetRole: Role) => {
    const demo = targetRole === "kunde" ? DEMO_USERS.kunde : DEMO_USERS.handwerker;
    setRole(targetRole);
    setAuthMode("login");
    setErrorMessage(null);
    setIdentifier(demo.username);
    setPassword(DEMO_PASSWORD);
    void doLogin(demo.email, DEMO_PASSWORD);
  };

  const handleLoginSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isLoading) return;
    if (!identifier.trim()) {
      setErrorMessage("Bitte gib deine E-Mail-Adresse oder deinen Benutzernamen ein.");
      return;
    }
    if (!password) {
      setErrorMessage("Bitte gib dein Passwort ein.");
      return;
    }
    void doLogin(identifier, password);
  };
  const handleRegisterSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isLoading) return;
    setErrorMessage(null);
    if (!firstName.trim() || !lastName.trim() || !identifier.trim() || !password) {
      setErrorMessage("Bitte fülle alle erforderlichen Pflichtfelder aus.");
      return;
    }
    if (password.length < 8) {
      setErrorMessage("Das Passwort braucht mindestens 8 Zeichen.");
      return;
    }
    if (role === "handwerker" && !businessName.trim()) {
      setErrorMessage("Bitte gib den Namen deines Betriebs an.");
      return;
    }
    setIsLoading(true);
    try {
      const data = new FormData();
      data.set("role", role === "handwerker" ? "provider" : "homeowner");
      data.set("email", identifier.trim());
      data.set("password", password);
      data.set("firstName", firstName.trim());
      data.set("lastName", lastName.trim());
      data.set("postcode", postcode.trim());
      if (role === "handwerker") {
        data.set("businessName", businessName.trim());
        data.set("trades", trades.trim());
        data.set("streetAddress", address.trim());
      } else {
        data.set("address", address.trim());
      }
      await registerAction(data);
      setIsLoading(false);
    } catch (error) {
      if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) return;
      setErrorMessage(error instanceof Error ? error.message : "Registrierung fehlgeschlagen.");
      setIsLoading(false);
    }
  };

  const formTitle = authMode === "login"
    ? "Willkommen zurück."
    : role === "kunde"
      ? "Kostenloses Hauskonto anlegen"
      : "Als Handwerksbetrieb registrieren";
  const formText = authMode === "login"
    ? role === "kunde"
      ? "Melde dich an, um Hausakte, Anliegen und Termine zu öffnen."
      : "Melde dich an, um Anfragen, Aufträge und Termine zu bearbeiten."
    : role === "kunde"
      ? "Dein Zugang zur Hausakte und zu allen nächsten Schritten rund um dein Zuhause."
      : "Lege den Zugang für deinen Betrieb an. Die fachliche Prüfung folgt getrennt im Partnerprozess.";

  return (
    <div id="login-card-container">
      <EHWorkflowHeading title={formTitle} description={formText} />
      <EHActions>
        <EHButton
          id="role-tab-kunde"
          type="button"
          size="small"
          variant={role === "kunde" ? "primary" : "secondary"}
          aria-pressed={role === "kunde"}
          onClick={() => setRole("kunde")}
        >Eigentümer</EHButton>
        <EHButton
          id="role-tab-handwerker"
          type="button"
          size="small"
          variant={role === "handwerker" ? "primary" : "secondary"}
          aria-pressed={role === "handwerker"}
          onClick={() => setRole("handwerker")}
        >Handwerksbetrieb</EHButton>
      </EHActions>

      {errorMessage && <EHErrorState text={errorMessage} />}

      {authMode === "login" ? (
        <form onSubmit={handleLoginSubmit} aria-busy={isLoading}>
          <EHFormSection title="Zugangsdaten" description="Nutze deine hinterlegte E-Mail-Adresse oder deinen Demo-Benutzernamen.">
            <EHField id="login-identifier" label="E-Mail oder Benutzername" required>
              <EHInput
                id="login-identifier"
                name="email"
                type="text"
                inputMode="email"
                autoComplete="username"
                placeholder="du@example.de"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                required
              />
            </EHField>
            <EHField id="login-password" label="Passwort" required>
              <EHInput
                id="login-password"
                name="loginPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </EHField>
            <EHCheckbox
              id="checkbox-show-password"
              checked={showPassword}
              onChange={(event) => setShowPassword(event.target.checked)}
              label="Passwort anzeigen"
            />
            <EHActions>
              <EHButton id="btn-submit-login" type="submit" disabled={isLoading} arrow>
                {isLoading ? "Wird angemeldet …" : "Anmelden"}
              </EHButton>
              <EHButton id="btn-forgot-password" type="button" variant="quiet" onClick={() => setIsForgotModalOpen(true)}>
                Passwort vergessen?
              </EHButton>
            </EHActions>
          </EHFormSection>
        </form>
      ) : (
        <form onSubmit={handleRegisterSubmit} aria-busy={isLoading}>
          <EHFormSection
            title={role === "kunde" ? "Dein Hauskonto" : "Dein Betrieb"}
            description={role === "kunde" ? "Persönliche Angaben für deinen sicheren Zugang." : "Stammdaten für deinen Partnerzugang."}
          >
            {role === "handwerker" && (
              <EHField id="reg-business" label="Unternehmensname" required>
                <EHInput id="reg-business" name="businessName" value={businessName} onChange={(event) => setBusinessName(event.target.value)} required />
              </EHField>
            )}
            <EHFieldGrid>
              <EHField id="reg-first-name" label="Vorname" required>
                <EHInput id="reg-first-name" name="firstName" autoComplete="given-name" value={firstName} onChange={(event) => setFirstName(event.target.value)} required />
              </EHField>
              <EHField id="reg-last-name" label="Nachname" required>
                <EHInput id="reg-last-name" name="lastName" autoComplete="family-name" value={lastName} onChange={(event) => setLastName(event.target.value)} required />
              </EHField>
            </EHFieldGrid>
            {role === "handwerker" && (
              <EHField id="reg-trades" label="Gewerke / Leistungen" required>
                <EHInput id="reg-trades" name="trades" placeholder="z. B. Elektro, SHK, Garten" value={trades} onChange={(event) => setTrades(event.target.value)} required />
              </EHField>
            )}
            <EHField id="reg-email" label="E-Mail-Adresse" required>
              <EHInput
                id="reg-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="du@example.de"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                required
              />
            </EHField>
            <EHFieldGrid>
              <EHField id="reg-postcode" label="Postleitzahl">
                <EHInput id="reg-postcode" name="postcode" inputMode="numeric" autoComplete="postal-code" value={postcode} onChange={(event) => setPostcode(event.target.value)} />
              </EHField>
              <EHField id="reg-password" label="Passwort" hint="Mindestens 8 Zeichen." required>
                <EHInput
                  id="reg-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  minLength={8}
                  aria-describedby="reg-password-hint"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </EHField>
            </EHFieldGrid>
            <EHField
              id="reg-address"
              label={role === "kunde" ? "Adresse des Hauses" : "Betriebsadresse"}
              hint={role === "kunde" ? "Kann später ergänzt oder geändert werden." : "Die Adresse wird für dein Einsatzgebiet verwendet."}
            >
              <EHInput
                id="reg-address"
                name={role === "kunde" ? "address" : "streetAddress"}
                autoComplete="street-address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
              />
            </EHField>
            <EHCheckbox
              id="checkbox-show-register-password"
              checked={showPassword}
              onChange={(event) => setShowPassword(event.target.checked)}
              label="Passwort anzeigen"
            />
            <EHActions>
              <EHButton id="btn-submit-register" type="submit" disabled={isLoading} arrow>
                {isLoading ? "Konto wird erstellt …" : "Kostenlos registrieren"}
              </EHButton>
            </EHActions>
          </EHFormSection>
        </form>
      )}

      <EHDivider />
      <EHText size="meta">
        {authMode === "login" ? "Noch kein Konto?" : "Bereits registriert?"}
      </EHText>
      <EHActions>
        <EHButton
          id={authMode === "login" ? "btn-switch-to-register" : "btn-switch-to-login"}
          type="button"
          variant="secondary"
          onClick={() => {
            setAuthMode(authMode === "login" ? "register" : "login");
            setErrorMessage(null);
          }}
        >
          {authMode === "login" ? "Konto anlegen" : "Zur Anmeldung"}
        </EHButton>
      </EHActions>

      <EHDivider />
      <EHText size="meta">Demo-Zugang für die produktinterne Prüfung</EHText>
      <EHActions>
        <EHButton id="btn-demo-kunde" type="button" size="small" variant="secondary" disabled={isLoading} onClick={() => handleQuickFill("kunde")}>
          Eigentümer-Demo
        </EHButton>
        <EHButton id="btn-demo-handwerker" type="button" size="small" variant="secondary" disabled={isLoading} onClick={() => handleQuickFill("handwerker")}>
          Handwerker-Demo
        </EHButton>
      </EHActions>

      <div id="auth-assurance-footer">
        <EHText size="meta">SSL-geschützt · DSGVO-orientiert · Serverbetrieb in Deutschland</EHText>
        <EHActions>
          <EHButton id="link-agb" type="button" size="small" variant="quiet" onClick={() => openLegal("agb")}>AGB</EHButton>
          <EHButton id="link-datenschutz" type="button" size="small" variant="quiet" onClick={() => openLegal("datenschutz")}>Datenschutz</EHButton>
          <EHButton type="button" size="small" variant="quiet" onClick={() => openLegal("impressum")}>Impressum</EHButton>
          <EHTextLink href="/hilfe">Hilfe</EHTextLink>
        </EHActions>
      </div>

      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        defaultEmail={identifier.includes("@") ? identifier : ""}
      />
      <LegalModal
        isOpen={legalModalType !== null}
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
}
