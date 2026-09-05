'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { DEMO_PASSWORD, DEMO_USERS, demoEmailFor } from "@/lib/demo-accounts";
import { registerAction } from "@/app/actions";
import { motion } from "motion/react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Home,
  Wrench,
  Sparkles,
  AlertCircle,
  Check,
  Loader2,
  Server,
} from "lucide-react";
import { ForgotPasswordModal } from "./ForgotPasswordModal";
import { LegalModal } from "./LegalModal";
import { Logo } from "./Logo";

export type Role = "kunde" | "handwerker";
export type AuthMode = "login" | "register";

interface LoginFormProps {
  role?: Role;
  initialRole?: Role;
  initialAuthMode?: AuthMode;
  onRoleChange?: (role: Role) => void;
  onOpenLegalModal?: (type: "agb" | "datenschutz" | "impressum" | "sicherheit" | "partnerkriterien") => void;
}

export function LoginForm({ role: propRole, initialRole = "kunde", initialAuthMode = "login", onRoleChange, onOpenLegalModal }: LoginFormProps = {}) {
  const [internalRole, setInternalRole] = useState<Role>(initialRole);
  const role = propRole !== undefined ? propRole : internalRole;

  const setRole = (newRole: Role) => {
    if (onRoleChange) {
      onRoleChange(newRole);
    } else {
      setInternalRole(newRole);
    }
  };

  const [authMode, setAuthMode] = useState<AuthMode>(initialAuthMode);

  // Form states
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [contactName, setContactName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [trades, setTrades] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // UI interaction states
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<"agb" | "datenschutz" | "impressum" | "sicherheit" | "partnerkriterien" | null>(null);

  const openLegal = (type: "agb" | "datenschutz" | "impressum" | "sicherheit" | "partnerkriterien") => {
    if (onOpenLegalModal) {
      onOpenLegalModal(type);
    } else {
      setLegalModalType(type);
    }
  };

  // Success simulation state
  const router = useRouter();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Echter Login gegen Supabase (demoEmailFor mappt kunde/handwerker).
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
      // Server-Identitaet aufloesen; /app leitet Provider nach /pro weiter.
      router.replace("/app");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Anmeldung fehlgeschlagen.");
      setIsLoading(false);
    }
  }

  // Demo auto-fill handlers (echt: fuellen + sofort anmelden)
  const handleQuickFill = (targetRole: Role) => {
    setRole(targetRole);
    setAuthMode("login");
    setErrorMessage(null);
    const demo = targetRole === "kunde" ? DEMO_USERS.kunde : DEMO_USERS.handwerker;
    setIdentifier(demo.username);
    setPassword(DEMO_PASSWORD);
    void doLogin(demo.email, DEMO_PASSWORD);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

  // Echte Registrierung ueber die Server-Action (Feld-Mapping, keine Mocks).
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setErrorMessage(null);
    if (!identifier.trim() || !password) {
      setErrorMessage("Bitte fülle alle erforderlichen Pflichtfelder aus.");
      return;
    }
    if (password.length < 8) {
      setErrorMessage("Das Passwort braucht mindestens 8 Zeichen.");
      return;
    }
    setIsLoading(true);
    try {
      const fd = new FormData();
      const isPro = role === "handwerker";
      fd.set("role", isPro ? "provider" : "homeowner");
      fd.set("email", identifier.trim());
      fd.set("password", password);
      if (isPro) {
        fd.set("firstName", contactName.trim().split(/\s+/)[0] || companyName.trim() || "Inhaber");
        fd.set("lastName", contactName.trim().split(/\s+/).slice(1).join(" ") || "Betrieb");
        fd.set("businessName", companyName.trim());
        fd.set("trades", trades.trim());
        fd.set("postcode", postalCode.trim());
      } else {
        const parts = fullName.trim().split(/\s+/);
        fd.set("firstName", parts[0] || "");
        fd.set("lastName", parts.slice(1).join(" ") || "–");
        fd.set("postcode", postalCode.trim());
      }
      await registerAction(fd);
      // Bei Erfolg navigiert die Action selbst (redirect); nur Fehler landen hier.
      setIsLoading(false);
    } catch (err) {
      // NEXT_REDIRECT ist Erfolg (Navigation laeuft) — kein Fehler zeigen.
      if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) return;
      setErrorMessage(err instanceof Error ? err.message : "Registrierung fehlgeschlagen.");
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      id="login-card-container"
      initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
      className="w-full max-w-md mx-auto space-y-3"
    >
      {/* Quick Toast Banner */}
      {toastMessage && (
        <div className="p-2.5 bg-[var(--eh-text,#1c2129)] text-white text-xs rounded-xl shadow-md flex items-center gap-2 border border-white/10 animate-in fade-in slide-in-from-top-1 duration-150">
          <Sparkles className="w-3.5 h-3.5 text-[#E69E66] shrink-0" />
          <span className="flex-1 font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main White Card matching website aesthetics with soft ambient depth */}
      <div className="eh-auth-card bg-white rounded-2xl shadow-[0_8px_30px_-6px_rgba(17,58,60,0.07)] sm:shadow-[0_12px_36px_-10px_rgba(17,58,60,0.08)] border border-[var(--eh-border,#e4e2dc)] p-4 sm:p-8 space-y-4 sm:space-y-6">
        {/* Top Header: Security Badge & Role Subtitle */}
        <div className="eh-auth-card-meta flex items-center justify-between pb-2 border-b border-stone-100 text-xs sm:text-[13px]">
          <div className="flex items-center gap-1.5 text-stone-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--eh-text,#1c2129)] shrink-0" />
            <span className="text-[11.5px] sm:text-[13px]">Offizielles Meisterportal</span>
          </div>
          <span className="text-[10.5px] sm:text-xs text-stone-600 font-medium">
            {role === "kunde" ? "Kostenlos für Eigentümer" : "0 % Vermittlungsprovision"}
          </span>
        </div>

        {/* Role Toggle Selector with smooth sliding pill */}
        <div className="space-y-1">
          <div className="eh-auth-role-toggle relative grid grid-cols-2 p-1 bg-[var(--eh-surface-subtle,#f2f5f5)] rounded-xl border border-[var(--eh-border,#e4e2dc)] text-xs sm:text-sm font-semibold shadow-2xs">
            <button
              id="role-tab-kunde"
              type="button"
              onClick={() => setRole("kunde")}
              className={`relative z-10 flex items-center justify-center gap-1.5 sm:gap-2 min-h-[44px] py-2 px-2 sm:px-3 rounded-lg transition-colors cursor-pointer ${
                role === "kunde"
                  ? "text-[var(--eh-text,#1c2129)] font-bold"
                  : "text-stone-600 hover:text-[var(--eh-text,#1c2129)] font-medium"
              }`}
            >
              {role === "kunde" && (
                <motion.div
                  layoutId="activeRolePill"
                  className="absolute inset-0 bg-white rounded-lg shadow-sm border border-[var(--eh-border,#e4e2dc)]"
                  transition={{ type: "spring", stiffness: 480, damping: 36 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                <Home className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-colors ${role === "kunde" ? "text-[var(--eh-terra,#c8623a)]" : "text-stone-400"}`} />
                <span className="truncate text-xs sm:text-sm">Eigentümer</span>
              </span>
            </button>
            <button
              id="role-tab-handwerker"
              type="button"
              onClick={() => setRole("handwerker")}
              className={`relative z-10 flex items-center justify-center gap-1.5 sm:gap-2 min-h-[44px] py-2 px-2 sm:px-3 rounded-lg transition-colors cursor-pointer ${
                role === "handwerker"
                  ? "text-[var(--eh-text,#1c2129)] font-bold"
                  : "text-stone-600 hover:text-[var(--eh-text,#1c2129)] font-medium"
              }`}
            >
              {role === "handwerker" && (
                <motion.div
                  layoutId="activeRolePill"
                  className="absolute inset-0 bg-white rounded-lg shadow-sm border border-[var(--eh-border,#e4e2dc)]"
                  transition={{ type: "spring", stiffness: 480, damping: 36 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                <Wrench className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-colors ${role === "handwerker" ? "text-[var(--eh-text,#1c2129)]" : "text-stone-400"}`} />
                <span className="truncate text-xs sm:text-sm">Handwerksbetrieb</span>
              </span>
            </button>
          </div>
        </div>

        {/* Title and Subtitle */}
        <div className="eh-auth-form-heading space-y-1">
          <h2 className="text-xl sm:text-[26px] font-extrabold tracking-tight text-[var(--eh-text,#1c2129)] leading-tight">
            {authMode === "login"
              ? "Willkommen zurück."
              : role === "kunde"
              ? "Kostenloses Hauskonto anlegen"
              : "Als Meisterbetrieb registrieren"}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-normal">
            {authMode === "login"
              ? role === "kunde"
                ? "Melde dich an, um Hausakte und Handwerker einzusehen."
                : "Melde dich an, um regionale Aufträge zu verwalten."
              : "Keine versteckten Gebühren. 100 % sicher."}
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        {authMode === "login" ? (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div className="space-y-1.5">
              <label htmlFor="login-identifier" className="block text-xs sm:text-sm font-semibold text-stone-700">
                E-Mail oder Benutzername
              </label>
              <div className="relative group">
                <Mail className="w-4 h-4 text-stone-400 group-focus-within:text-[var(--eh-text,#1c2129)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-150" />
                <input
                  id="login-identifier"
                  type="text"
                  inputMode="email"
                  required
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    role === "kunde"
                      ? "kunde oder deine@email.de"
                      : "handwerker oder meister@betrieb.de"
                  }
                  className="w-full pl-10 pr-3.5 py-2.5 min-h-[44px] bg-stone-50/70 border border-[var(--eh-border,#e4e2dc)] rounded-xl text-base sm:text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:outline-none focus:border-[var(--eh-terra,#c8623a)] focus:ring-2 focus:ring-[var(--eh-terra,#c8623a)]/20 focus:shadow-[0_0_0_3px_rgba(200,98,58,0.12)] focus:bg-white focus-visible:outline-none focus-visible:border-[var(--eh-terra,#c8623a)] focus-visible:ring-2 focus-visible:ring-[var(--eh-terra,#c8623a)]/20 focus-visible:shadow-[0_0_0_3px_rgba(200,98,58,0.12)] focus-visible:bg-white transition-all duration-150"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="login-password" className="block text-xs sm:text-sm font-semibold text-stone-700">
                Passwort
              </label>
              <div className="relative group">
                <Lock className="w-4 h-4 text-stone-400 group-focus-within:text-[var(--eh-text,#1c2129)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-150" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="loginPassword"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 min-h-[44px] bg-stone-50/70 border border-[var(--eh-border,#e4e2dc)] rounded-xl text-base sm:text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:outline-none focus:border-[var(--eh-terra,#c8623a)] focus:ring-2 focus:ring-[var(--eh-terra,#c8623a)]/20 focus:shadow-[0_0_0_3px_rgba(200,98,58,0.12)] focus:bg-white focus-visible:outline-none focus-visible:border-[var(--eh-terra,#c8623a)] focus-visible:ring-2 focus-visible:ring-[var(--eh-terra,#c8623a)]/20 focus-visible:shadow-[0_0_0_3px_rgba(200,98,58,0.12)] focus-visible:bg-white transition-all duration-150 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                  aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Below password input: Remember me & Passwort vergessen */}
            <div className="flex items-center justify-between text-xs sm:text-sm pt-0.5">
              <label className="flex items-center gap-2 text-stone-600 cursor-pointer select-none">
                <input
                  id="checkbox-remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-stone-300 text-[var(--eh-terra,#c8623a)] focus:ring-2 focus:ring-[var(--eh-terra,#c8623a)]/40 focus:ring-offset-1 focus-visible:ring-2 focus-visible:ring-[var(--eh-terra,#c8623a)] focus-visible:ring-offset-1 accent-[var(--eh-terra,#c8623a)] cursor-pointer transition-all"
                />
                <span>Angemeldet bleiben</span>
              </label>

              <button
                id="btn-forgot-password"
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-xs sm:text-sm text-[var(--eh-green-700,#105258)] hover:text-[var(--eh-green-900,#0a3539)] font-semibold hover:underline focus:outline-none cursor-pointer transition-colors"
              >
                Passwort vergessen?
              </button>
            </div>

            {/* Authentic Terracotta Primary Action Button with Depth & Hover Lift */}
            <button
              id="btn-submit-login"
              type="submit"
              disabled={isLoading}
              className="group relative w-full min-h-[44px] py-3 px-4 rounded-xl bg-[var(--eh-terra-deep,#a84d29)] hover:bg-[#8a3f22] active:scale-[0.99] disabled:bg-[var(--eh-terra,#c8623a)]/80 disabled:cursor-not-allowed disabled:transform-none text-white font-bold text-sm sm:text-base shadow-[0_2px_8px_rgba(200,98,58,0.20)] hover:shadow-[0_6px_20px_rgba(200,98,58,0.28)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer select-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin shrink-0 text-white" />
                  <span>Wird angemeldet...</span>
                </div>
              ) : (
                <>
                  <span>Anmelden</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <label htmlFor="reg-name" className="block text-xs sm:text-sm font-semibold text-stone-700">
                {role === "kunde" ? "Vollständiger Name" : "Name des Meisterbetriebs"}
              </label>
              <input
                id="reg-name"
                type="text"
                name="fullName"
                required
                value={role === "kunde" ? fullName : companyName}
                onChange={(e) =>
                  role === "kunde" ? setFullName(e.target.value) : setCompanyName(e.target.value)
                }
                placeholder={role === "kunde" ? "Familie Bauer" : "Kessler Dach & Fassade GmbH"}
                className="w-full px-3.5 py-2.5 min-h-[44px] bg-stone-50/70 border border-[var(--eh-border,#e4e2dc)] rounded-xl text-base sm:text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:outline-none focus:border-[var(--eh-terra,#c8623a)] focus:ring-2 focus:ring-[var(--eh-terra,#c8623a)]/20 focus:shadow-[0_0_0_3px_rgba(200,98,58,0.12)] focus:bg-white focus-visible:outline-none focus-visible:border-[var(--eh-terra,#c8623a)] focus-visible:ring-2 focus-visible:ring-[var(--eh-terra,#c8623a)]/20 focus-visible:shadow-[0_0_0_3px_rgba(200,98,58,0.12)] focus-visible:bg-white transition-all duration-150"
              />
            </div>
            {role === "handwerker" && (
              <div className="space-y-1.5">
                <label htmlFor="reg-trades" className="block text-xs sm:text-sm font-semibold text-stone-700">
                  Gewerke / Leistungen
                </label>
                <input
                  id="reg-trades"
                  type="text"
                  name="trades"
                  required
                  value={trades}
                  onChange={(e) => setTrades(e.target.value)}
                  placeholder="z. B. Garten, Elektro, SHK"
                  className="w-full px-3.5 py-2.5 min-h-[44px] bg-stone-50/70 border border-[var(--eh-border,#e4e2dc)] rounded-xl text-base sm:text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:outline-none focus:border-[var(--eh-terra,#c8623a)] focus:ring-2 focus:ring-[var(--eh-terra,#c8623a)]/20"
                />
              </div>
            )}
            {role === "handwerker" && (
              <div className="space-y-1.5">
                <label htmlFor="reg-contact" className="block text-xs sm:text-sm font-semibold text-stone-700">
                  Ansprechpartner (Vor- und Nachname)
                </label>
                <input
                  id="reg-contact"
                  type="text"
                  name="contactName"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Max Kessler"
                  className="w-full px-3.5 py-2.5 min-h-[44px] bg-stone-50/70 border border-[var(--eh-border,#e4e2dc)] rounded-xl text-base sm:text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:outline-none focus:border-[var(--eh-terra,#c8623a)] focus:ring-2 focus:ring-[var(--eh-terra,#c8623a)]/20 focus:shadow-[0_0_0_3px_rgba(200,98,58,0.12)] focus:bg-white focus-visible:outline-none focus-visible:border-[var(--eh-terra,#c8623a)] focus-visible:ring-2 focus-visible:ring-[var(--eh-terra,#c8623a)]/20 focus-visible:shadow-[0_0_0_3px_rgba(200,98,58,0.12)] focus-visible:bg-white transition-all duration-150"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="reg-email" className="block text-xs sm:text-sm font-semibold text-stone-700">
                E-Mail-Adresse
              </label>
              <input
                id="reg-email"
                type="email"
                name="email"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="deine@adresse.de"
                className="w-full px-3.5 py-2.5 min-h-[44px] bg-stone-50/70 border border-[var(--eh-border,#e4e2dc)] rounded-xl text-base sm:text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:outline-none focus:border-[var(--eh-terra,#c8623a)] focus:ring-2 focus:ring-[var(--eh-terra,#c8623a)]/20 focus:shadow-[0_0_0_3px_rgba(200,98,58,0.12)] focus:bg-white focus-visible:outline-none focus-visible:border-[var(--eh-terra,#c8623a)] focus-visible:ring-2 focus-visible:ring-[var(--eh-terra,#c8623a)]/20 focus-visible:shadow-[0_0_0_3px_rgba(200,98,58,0.12)] focus-visible:bg-white transition-all duration-150"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label htmlFor="reg-plz" className="block text-xs sm:text-sm font-semibold text-stone-700">
                  Postleitzahl
                </label>
                <input
                  id="reg-plz"
                  type="text"
                  name="postcode"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="20095"
                  className="w-full px-3.5 py-2.5 min-h-[44px] bg-stone-50/70 border border-[var(--eh-border,#e4e2dc)] rounded-xl text-base sm:text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:outline-none focus:border-[var(--eh-terra,#c8623a)] focus:ring-2 focus:ring-[var(--eh-terra,#c8623a)]/20 focus:shadow-[0_0_0_3px_rgba(200,98,58,0.12)] focus:bg-white focus-visible:outline-none focus-visible:border-[var(--eh-terra,#c8623a)] focus-visible:ring-2 focus-visible:ring-[var(--eh-terra,#c8623a)]/20 focus-visible:shadow-[0_0_0_3px_rgba(200,98,58,0.12)] focus-visible:bg-white transition-all duration-150 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="reg-pass" className="block text-xs sm:text-sm font-semibold text-stone-700">
                  Passwort
                </label>
                <input
                  id="reg-pass"
                  type="password"
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 Zeichen"
                  className="w-full px-3.5 py-2.5 min-h-[44px] bg-stone-50/70 border border-[var(--eh-border,#e4e2dc)] rounded-xl text-base sm:text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:outline-none focus:border-[var(--eh-terra,#c8623a)] focus:ring-2 focus:ring-[var(--eh-terra,#c8623a)]/20 focus:shadow-[0_0_0_3px_rgba(200,98,58,0.12)] focus:bg-white focus-visible:outline-none focus-visible:border-[var(--eh-terra,#c8623a)] focus-visible:ring-2 focus-visible:ring-[var(--eh-terra,#c8623a)]/20 focus-visible:shadow-[0_0_0_3px_rgba(200,98,58,0.12)] focus-visible:bg-white transition-all duration-150 font-mono"
                />
              </div>
            </div>

            <button
              id="btn-submit-register"
              type="submit"
              disabled={isLoading}
              className="group relative w-full py-3.5 px-4 rounded-xl bg-[var(--eh-terra-deep,#a84d29)] hover:bg-[#8a3f22] active:scale-[0.99] disabled:bg-[var(--eh-terra,#c8623a)]/80 disabled:cursor-not-allowed disabled:transform-none text-white font-bold text-sm sm:text-base shadow-[0_2px_8px_rgba(200,98,58,0.20)] hover:shadow-[0_6px_20px_rgba(200,98,58,0.28)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-1 select-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin shrink-0 text-white" />
                  <span>Konto wird erstellt...</span>
                </div>
              ) : (
                <>
                  <span>Kostenlos registrieren</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Clean Mode Switcher link below the CTA button */}
        <div className="pt-2 text-center border-t border-stone-100">
          {authMode === "login" ? (
            <p className="text-xs sm:text-sm text-stone-600">
              Noch kein Konto?{" "}
              <button
                id="btn-switch-to-register"
                type="button"
                onClick={() => {
                  setAuthMode("register");
                  setErrorMessage(null);
                }}
                className="font-bold text-[var(--eh-green-700,#105258)] hover:text-[var(--eh-green-900,#0a3539)] hover:underline cursor-pointer transition-colors"
              >
                Kostenlos registrieren
              </button>
            </p>
          ) : (
            <p className="text-xs sm:text-sm text-stone-600">
              Bereits registriert?{" "}
              <button
                id="btn-switch-to-login"
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setErrorMessage(null);
                }}
                className="font-bold text-[var(--eh-text,#1c2129)] hover:underline cursor-pointer transition-colors"
              >
                Hier anmelden
              </button>
            </p>
          )}
        </div>

        {/* Discreet Demo Quick-Fill */}
        <div
          id="demo-testzugang-bar"
          className="pt-1 flex items-center justify-center gap-1.5 sm:gap-2 text-xs text-stone-600 select-none flex-wrap"
        >
          <span className="inline-flex items-center gap-1 text-stone-600 text-[11px] sm:text-xs" aria-hidden="true">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#E69E66]" /> Demo-Login:
          </span>
          <div className="inline-flex items-center gap-1.5">
            <button
              id="btn-demo-kunde"
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickFill("kunde")}
              className="min-h-[36px] px-3 py-1 rounded-lg bg-[var(--eh-surface-subtle,#f2f5f5)] hover:bg-[var(--eh-text,#1c2129)] hover:text-white text-stone-700 font-semibold border border-[var(--eh-border,#e4e2dc)] transition-all duration-150 cursor-pointer text-[11px] sm:text-[11.5px] shadow-2xs hover:shadow-xs active:scale-[0.98]"
              title="Klick: Demo Eigentümer ausfüllen"
            >
              Eigentümer
            </button>
            <button
              id="btn-demo-handwerker"
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickFill("handwerker")}
              className="min-h-[36px] px-3 py-1 rounded-lg bg-[var(--eh-surface-subtle,#f2f5f5)] hover:bg-[var(--eh-text,#1c2129)] hover:text-white text-stone-700 font-semibold border border-[var(--eh-border,#e4e2dc)] transition-all duration-150 cursor-pointer text-[11px] sm:text-[11.5px] shadow-2xs hover:shadow-xs active:scale-[0.98]"
              title="Klick: Demo Handwerker ausfüllen"
            >
              Handwerker
            </button>
          </div>
        </div>
      </div>

      {/* Subtle Footer: Trust Badges & Legal links */}
      <div className="space-y-2 text-center px-1 select-none pt-2 sm:pt-3">
        {/* Trust Icons: SSL, DSGVO, Server - crisp and readable on mobile */}
        <div
          id="trust-badges-bar"
          className="flex items-center justify-center flex-wrap gap-x-2.5 sm:gap-x-3.5 gap-y-1 text-stone-600 text-[11px] sm:text-xs"
        >
          <div className="flex items-center gap-1 whitespace-nowrap" title="256-Bit SSL-Verschlüsselung">
            <Lock className="w-3 h-3 text-stone-400 shrink-0" />
            <span>SSL gesichert</span>
          </div>
          <span className="text-stone-300">•</span>
          <div className="flex items-center gap-1 whitespace-nowrap" title="Streng nach europäischer DSGVO">
            <ShieldCheck className="w-3 h-3 text-stone-400 shrink-0" />
            <span>DSGVO konform</span>
          </div>
          <span className="text-stone-300">•</span>
          <div className="flex items-center gap-1 whitespace-nowrap" title="Server in deutschen Rechenzentren">
            <Server className="w-3 h-3 text-stone-400 shrink-0" />
            <span>Server in DE</span>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <p className="text-xs text-stone-600">
          Mit der Anmeldung akzeptierst du unsere{" "}
          <button
            id="link-agb"
            type="button"
            onClick={() => openLegal("agb")}
            className="text-stone-600 hover:text-[var(--eh-text,#1c2129)] font-semibold underline underline-offset-2 cursor-pointer"
          >
            AGB
          </button>{" "}
          und{" "}
          <button
            id="link-datenschutz"
            type="button"
            onClick={() => openLegal("datenschutz")}
            className="text-stone-600 hover:text-[var(--eh-text,#1c2129)] font-semibold underline underline-offset-2 cursor-pointer"
          >
            Datenschutz
          </button>
          .
        </p>

        {/* Footer Navigation */}
        <div className="flex items-center justify-center gap-3 text-xs text-stone-600">
          <button
            type="button"
            onClick={() => openLegal("impressum")}
            className="hover:text-stone-700 transition-colors cursor-pointer"
          >
            Impressum
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => openLegal("datenschutz")}
            className="hover:text-stone-700 transition-colors cursor-pointer"
          >
            DSGVO
          </button>
          <span>•</span>
          <Link
            href="/hilfe"
            className="hover:text-stone-700 transition-colors cursor-pointer"
          >
            Hilfe
          </Link>
        </div>
      </div>

      {/* Modals */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        defaultEmail={identifier.includes("@") ? identifier : ""}
        onPasswordResetSuccess={(resetEmail, newPw) => {
          if (resetEmail) setIdentifier(resetEmail);
          if (newPw) setPassword(newPw);
          showToast("Passwort erfolgreich zurückgesetzt! Du kannst dich jetzt anmelden.");
        }}
      />

      <LegalModal
        isOpen={legalModalType !== null}
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </motion.div>
  );
}
