"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { HeroPanel } from "@/components/auth-v2/HeroPanel";
import { LoginForm, Role, AuthMode } from "@/components/auth-v2/LoginForm";
import { Logo } from "@/components/auth-v2/Logo";
import { LegalModal } from "@/components/auth-v2/LegalModal";
import { HelpCircle, Sparkles, Home, Wrench, Award, Users } from "lucide-react";

export function AuthShell({ initialAuthMode = "login", initialRole = "kunde" }: { initialAuthMode?: AuthMode; initialRole?: Role }) {
  const [mobileTab, setMobileTab] = useState<"login" | "vorteile">("login");
  const [role, setRole] = useState<Role>(initialRole);
  const [showHelpToast, setShowHelpToast] = useState(false);
  const [activeLegalModal, setActiveLegalModal] = useState<"agb" | "datenschutz" | "impressum" | "sicherheit" | "partnerkriterien" | null>(null);

  const handleRoleSelectFromHero = (newRole: Role) => {
    setRole(newRole);
    if (mobileTab === "vorteile") {
      setMobileTab("login");
    }
  };

  return (
    <div
      id="main-app-container"
      className="min-h-screen lg:h-dvh lg:max-h-dvh w-full flex flex-col bg-[var(--eh-bg,#faf8f4)] text-[var(--eh-text,#1c2129)] font-sans selection:bg-[var(--eh-green-100,#dcebec)] selection:text-[var(--eh-text,#1c2129)] lg:overflow-hidden"
    >
      <header
        id="top-brand-bar"
        className="h-14 px-4 sm:px-6 lg:px-8 bg-[var(--eh-bg,#faf8f4)] border-b border-[var(--eh-border,#e4e2dc)] flex items-center justify-between shrink-0 z-20"
      >
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link href="/" aria-label="Zur Startseite"><Logo variant="dark" size="sm" /></Link>
          <div className="hidden sm:flex items-center gap-2 border-l border-[var(--eh-border,#e4e2dc)] pl-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={role}
                initial={{ opacity: 0, y: -3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 3 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                <span className="hidden md:inline-flex text-xs sm:text-[13px] text-stone-600 font-medium">
                  {role === "kunde" ? "Dein Zuhause. Organisiert." : "Aufträge & Partnernetzwerk."}
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md border transition-colors ${
                    role === "kunde"
                      ? "bg-white text-[var(--eh-terra,#c8623a)] border-[var(--eh-border,#e4e2dc)]"
                      : "bg-[var(--eh-green-50,#edf5f5)] text-[var(--eh-text,#1c2129)] border-[var(--eh-green-100,#dcebec)]"
                  }`}
                >
                  {role === "kunde" ? "Eigentümer-Portal" : "Handwerker-Portal"}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="hidden lg:flex items-center p-0.5 bg-[var(--eh-surface-subtle,#f2f5f5)] rounded-xl border border-[var(--eh-border,#e4e2dc)] text-xs font-semibold">
          <button
            id="topbar-role-kunde"
            type="button"
            onClick={() => handleRoleSelectFromHero("kunde")}
            className={`relative px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              role === "kunde" ? "text-[var(--eh-text,#1c2129)] font-bold" : "text-stone-600 hover:text-[var(--eh-text,#1c2129)]"
            }`}
          >
            {role === "kunde" && (
              <motion.div
                layoutId="topbarActiveRole"
                className="absolute inset-0 bg-white rounded-lg shadow-2xs border border-[var(--eh-border,#e4e2dc)]"
                transition={{ type: "spring", stiffness: 480, damping: 36 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <Home className={`w-3.5 h-3.5 ${role === "kunde" ? "text-[var(--eh-terra,#c8623a)]" : "text-stone-400"}`} />
              <span>Eigentümer</span>
            </span>
          </button>
          <button
            id="topbar-role-handwerker"
            type="button"
            onClick={() => handleRoleSelectFromHero("handwerker")}
            className={`relative px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              role === "handwerker" ? "text-[var(--eh-text,#1c2129)] font-bold" : "text-stone-600 hover:text-[var(--eh-text,#1c2129)]"
            }`}
          >
            {role === "handwerker" && (
              <motion.div
                layoutId="topbarActiveRole"
                className="absolute inset-0 bg-white rounded-lg shadow-2xs border border-[var(--eh-border,#e4e2dc)]"
                transition={{ type: "spring", stiffness: 480, damping: 36 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <Wrench className={`w-3.5 h-3.5 ${role === "handwerker" ? "text-[var(--eh-text,#1c2129)]" : "text-stone-400"}`} />
              <span>Handwerksbetrieb</span>
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-[13px]">
          <AnimatePresence mode="wait">
            <motion.button
              key={role}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              type="button"
              onClick={() => setActiveLegalModal("partnerkriterien")}
              title={role === "kunde" ? "Qualitätsstandards einsehen" : "Aufnahmekriterien für Partnerbetriebe einsehen"}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer group ${
                role === "kunde"
                  ? "bg-[var(--eh-green-50,#edf5f5)] hover:bg-[var(--eh-green-100,#dcebec)] text-[var(--eh-green-700,#105258)] border-[var(--eh-green-100,#dcebec)]"
                  : "bg-[var(--eh-green-50,#edf5f5)] hover:bg-[var(--eh-green-100,#dcebec)] text-[var(--eh-text,#1c2129)] border-[var(--eh-green-100,#dcebec)]"
              }`}
            >
              {role === "kunde" ? (
                <>
                  <Users className="w-4 h-4 text-[var(--eh-green-700,#105258)] group-hover:scale-105 transition-transform" />
                  <span>Qualität im Netzwerk</span>
                </>
              ) : (
                <>
                  <Award className="w-4 h-4 text-[var(--eh-text,#1c2129)] group-hover:scale-105 transition-transform" />
                  <span>Region & Vertrauen</span>
                </>
              )}
            </motion.button>
          </AnimatePresence>

          <button
            id="btn-header-help"
            type="button"
            onClick={() => {
              setShowHelpToast(true);
              setTimeout(() => setShowHelpToast(false), 3500);
            }}
            className="px-3 py-1.5 text-stone-600 hover:text-[var(--eh-text,#1c2129)] hover:bg-stone-200/50 rounded-lg font-medium text-xs sm:text-[13px] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Hilfe</span>
          </button>

          <div className="lg:hidden flex items-center p-1 bg-[var(--eh-surface-subtle,#f2f5f5)] rounded-xl border border-[var(--eh-border,#e4e2dc)] shadow-inner">
            <button
              type="button"
              onClick={() => setMobileTab("login")}
              className={`relative px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mobileTab === "login" ? "text-[var(--eh-text,#1c2129)]" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {mobileTab === "login" && (
                <motion.div
                  layoutId="mobileTabPill"
                  className="absolute inset-0 bg-white rounded-lg shadow-sm border border-[var(--eh-border,#e4e2dc)]"
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <span>{initialAuthMode === "register" ? "Registrieren" : "Anmelden"}</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("vorteile")}
              className={`relative px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mobileTab === "vorteile" ? "text-[var(--eh-text,#1c2129)]" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {mobileTab === "vorteile" && (
                <motion.div
                  layoutId="mobileTabPill"
                  className="absolute inset-0 bg-white rounded-lg shadow-sm border border-[var(--eh-border,#e4e2dc)]"
                  transition={{ type: "spring", stiffness: 500, damping: 38 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <span>Vorteile</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--eh-terra,#c8623a)]" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {showHelpToast && (
        <div className="fixed top-16 right-4 z-50 p-3 bg-[var(--eh-text,#1c2129)] text-white text-xs rounded-xl shadow-xl border border-white/20 flex items-center gap-2 animate-in fade-in duration-150">
          <Sparkles className="w-4 h-4 text-[var(--eh-terra,#c8623a)] shrink-0" />
          <span>Hilfe & Antworten: <Link href="/hilfe" className="underline font-semibold">Zur Hilfe-Seite</Link></span>
        </div>
      )}

      <main className="flex-1 w-full overflow-y-auto flex flex-col justify-center">
        <div className="hidden lg:grid grid-cols-12 w-full max-w-7xl mx-auto px-6 lg:px-8 py-6 xl:py-8 gap-8 xl:gap-12 items-center my-auto">
          <section className="col-span-7 xl:col-span-7 flex flex-col justify-center py-1">
            <HeroPanel
              role={role}
              onSelectRole={handleRoleSelectFromHero}
              onOpenLegalModal={setActiveLegalModal}
            />
          </section>
          <section className="col-span-5 xl:col-span-5 flex flex-col justify-center items-center py-1">
            <LoginForm
              role={role}
              initialAuthMode={initialAuthMode}
              onRoleChange={setRole}
              onOpenLegalModal={setActiveLegalModal}
            />
          </section>
        </div>

        <div className="lg:hidden flex-1 overflow-y-auto px-3 py-3 sm:px-6 sm:py-6 flex flex-col items-center justify-start">
          <AnimatePresence mode="wait">
            <motion.div
              key={mobileTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="w-full max-w-md my-auto py-1"
            >
              {mobileTab === "login" ? (
                <LoginForm
                  role={role}
                  initialAuthMode={initialAuthMode}
                  onRoleChange={setRole}
                  onOpenLegalModal={setActiveLegalModal}
                />
              ) : (
                <HeroPanel
                  role={role}
                  onSelectRole={handleRoleSelectFromHero}
                  onOpenLegalModal={setActiveLegalModal}
                  onSwitchToLogin={() => setMobileTab("login")}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <LegalModal
        isOpen={activeLegalModal !== null}
        type={activeLegalModal}
        onClose={() => setActiveLegalModal(null)}
      />
    </div>
  );
}
