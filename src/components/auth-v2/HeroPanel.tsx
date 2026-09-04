'use client';

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Check, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

interface HeroPanelProps {
  role: "kunde" | "handwerker";
  onSelectRole: (role: "kunde" | "handwerker") => void;
  onOpenLegalModal?: (type: "agb" | "datenschutz" | "impressum" | "sicherheit" | "partnerkriterien") => void;
  onSwitchToLogin?: () => void;
}

export function HeroPanel({ role, onSelectRole, onOpenLegalModal, onSwitchToLogin }: HeroPanelProps) {
  const isKunde = role === "kunde";

  // Data strictly aligned with the website screenshot and handwerker perspective
  const content = {
    eyebrow: isKunde ? "— WARUM DU UNS VERTRAUEN KANNST" : "— FÜR MEISTERBETRIEBE & HANDWERK",
    title: isKunde ? "Keine Marktplatz-Logik. Klare Regeln." : "Kein Lead-Kauf. Kein Preiskampf. Echte Aufträge.",
    subtitle: isKunde
      ? "Wir verdienen nicht daran, deine Anfrage möglichst oft zu verkaufen. Wir verdienen daran, dass dein Haus gut läuft."
      : "Wir verkaufen keine Adressen an fünf Betriebe. Du erhältst vorqualifizierte Anfragen aus deiner Nachbarschaft mit vollständiger Hausakte.",
    stats: isKunde
      ? [
          { value: "0 €", label: "Das Hauskonto bleibt kostenlos" },
          { value: "0 %", label: "Provision für Partnerbetriebe" },
          { value: "1", label: "Fester Ansprechpartner pro Vorgang" },
          { value: "100 %", label: "Deine Entscheidung vor jedem Auftrag" },
        ]
      : [
          { value: "0 €", label: "Keine monatliche Grundgebühr" },
          { value: "0 %", label: "Provision auf deinen Meisterlohn" },
          { value: "1", label: "Fester Auftrag direkt bei dir" },
          { value: "100 %", label: "Vorqualifiziert mit Fotos & Maßen" },
        ],
    image: isKunde ? "/images/auth/craftsman_homeowner_door_1788495031583.jpg" : "/images/auth/craftsman_workshop_team_1788495051609.jpg",
    imageBadge: isKunde
      ? "Persönlich geprüfte Meisterbetriebe"
      : "Geprüftes Meister-Netzwerk",
    points: isKunde
      ? [
          {
            title: "Geprüfte Meisterbetriebe",
            desc: "Ausschließlich qualifizierte Fachbetriebe aus deiner Region mit echten Referenzen.",
          },
          {
            title: "Kein Lead-Handel",
            desc: "Deine Anfrage wird nicht versteigert – ein verlässlicher Partner pro Vorgang.",
          },
          {
            title: "Verbindliche Angebote",
            desc: "Faire Konditionen und transparente Meisterpreise ohne versteckte Aufschläge.",
          },
          {
            title: "Digitale Hausakte",
            desc: "Wartungen, Rechnungen und Garantiebelege zentral und dauerhaft gesichert.",
          },
        ]
      : [
          {
            title: "Kein Lead-Handel & kein Bieten",
            desc: "Echte Direktaufträge statt kostspieliger Adressbörsen und Preiskämpfe.",
          },
          {
            title: "Vollständige Hausakte digital vorab",
            desc: "Schadensbilder, Gerätedaten und Maße liegen vor, bevor du zum Kunden fährst.",
          },
          {
            title: "Direkte Abrechnung nach deinen Sätzen",
            desc: "Volle Kontrolle über deine Meister-Stundensätze ohne Drosselung.",
          },
          {
            title: "Verlässliche Wartungskunden",
            desc: "Planbare Jahresauslastung durch wiederkehrende Prüf- und Wartungstermine.",
          },
        ],
    link1: {
      text: isKunde ? "Für Betriebe: Partner werden" : "Für Eigentümer: Zu Hausakte & Services",
      targetRole: isKunde ? ("handwerker" as const) : ("kunde" as const),
    },
    link2: {
      text: isKunde ? "Sicherheits- und Datenprinzipien" : "Aufnahmekriterien für Meisterbetriebe",
      modalType: isKunde ? ("sicherheit" as const) : ("partnerkriterien" as const),
    },
  };

  return (
    <div
      id="website-hero-panel"
      className="relative w-full my-auto flex flex-col p-4 sm:p-7 lg:p-8 xl:p-9 rounded-2xl bg-white border border-[var(--eh-border,#e4e2dc)] shadow-[0_8px_30px_-6px_rgba(17,58,60,0.07)] sm:shadow-xs overflow-hidden select-none"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={role}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="flex flex-col gap-5 xl:gap-6"
        >
          {/* Header Section strictly in the website design style */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wide text-[var(--eh-text,#1c2129)] uppercase">
                {content.eyebrow}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-stone-600 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#E69E66]" />
                <span>Deutschland</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl xl:text-[32px] font-extrabold tracking-tight text-[var(--eh-text,#1c2129)] leading-[1.18]">
              {content.title}
            </h1>

            <p className="text-sm sm:text-[15px] text-stone-600 leading-relaxed max-w-2xl">
              {content.subtitle}
            </p>
          </div>

          {/* 4 Stat Boxes with refined typography and micro-interactions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
            {content.stats.map((stat, idx) => (
              <div
                key={idx}
                className="group relative bg-[var(--eh-surface-subtle,#f2f5f5)] rounded-xl p-3 sm:p-4 border border-[var(--eh-border,#e4e2dc)] flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:border-[#DCD5C9] hover:shadow-[0_6px_20px_-4px_rgba(17,58,60,0.08)]"
              >
                <div className="flex items-start justify-between gap-1">
                  <div className="text-xl sm:text-2xl lg:text-[28px] font-bold text-[var(--eh-text,#1c2129)] tracking-tight leading-none group-hover:text-[var(--eh-green-900,#0a3539)] transition-colors">
                    {stat.value}
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--eh-terra,#c8623a)]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0 mt-1" />
                </div>
                <div className="text-[11.5px] sm:text-xs sm:text-[12.5px] text-stone-600 font-medium leading-tight mt-1 sm:mt-1.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Lower 2-column layout: Photo on Left, Guarantees & Links on Right */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 xl:gap-6 items-stretch pt-1">
            {/* Left: Authentic photo card with ambient shadow & glassmorphism badge */}
            <div className="md:col-span-5 relative min-h-[190px] sm:min-h-[240px] rounded-xl overflow-hidden border border-[var(--eh-border,#e4e2dc)] shadow-[0_12px_32px_-8px_rgba(17,58,60,0.12)] group flex flex-col justify-end">
              <Image
                src={content.image}
                alt={content.imageBadge}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-103"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/65 via-stone-900/10 to-transparent pointer-events-none" />

              {/* Overlaid glassmorphism pill at the bottom of the photo */}
              <div className="relative z-10 m-2.5 sm:m-3 bg-white rounded-lg py-1.5 px-3 flex items-center gap-2 border border-stone-100 shadow-[0_4px_16px_rgba(17,58,60,0.08)]">
                <ShieldCheck className="w-4 h-4 text-[var(--eh-text,#1c2129)] shrink-0" />
                <span className="text-xs sm:text-[12.5px] font-semibold text-[var(--eh-text,#1c2129)] leading-snug">
                  {content.imageBadge}
                </span>
                <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500 shrink-0 shadow-xs" title="Verifiziert" />
              </div>
            </div>

            {/* Right: The 4 Guarantees with clean petrol checkmarks & links directly attached */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-3">
              <div className="space-y-2.5 xl:space-y-3">
                {content.points.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[var(--eh-text,#1c2129)] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[var(--eh-text,#1c2129)] leading-tight">
                        {point.title}
                      </h4>
                      <p className="text-xs sm:text-[12.5px] text-stone-600 leading-snug mt-0.5">
                        {point.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile CTA: Switch directly to login tab */}
              {onSwitchToLogin && (
                <div className="lg:hidden pt-2">
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[var(--eh-terra,#c8623a)] hover:bg-[var(--eh-terra-deep,#a84d29)] active:scale-[0.99] text-white font-bold text-sm shadow-[0_2px_8px_rgba(200,98,58,0.20)] hover:shadow-[0_4px_16px_rgba(200,98,58,0.28)] flex items-center justify-center gap-2 cursor-pointer transition-all duration-150"
                  >
                    <span>{isKunde ? "Zum Eigentümer-Login" : "Zum Handwerker-Login"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Links below matching the exact link style from the screenshot */}
              <div className="pt-3 border-t border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-[13px]">
                <button
                  type="button"
                  onClick={() => onSelectRole(content.link1.targetRole)}
                  className="inline-flex items-center gap-1.5 text-[var(--eh-text,#1c2129)] font-bold hover:text-[var(--eh-terra,#c8623a)] transition-colors cursor-pointer text-left group"
                >
                  <span>{content.link1.text}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => onOpenLegalModal?.(content.link2.modalType)}
                  className="inline-flex items-center gap-1.5 text-stone-600 hover:text-[var(--eh-text,#1c2129)] transition-colors cursor-pointer text-left text-xs sm:text-[12.5px] group"
                >
                  <span>{content.link2.text}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
