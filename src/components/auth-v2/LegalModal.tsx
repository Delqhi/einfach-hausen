'use client';

import React from "react";
import { X, ShieldCheck, FileCheck, Building } from "lucide-react";

interface LegalModalProps {
  isOpen: boolean;
  type: "agb" | "datenschutz" | "impressum" | "sicherheit" | "partnerkriterien" | null;
  onClose: () => void;
}

export function LegalModal({ isOpen, type, onClose }: LegalModalProps) {
  if (!isOpen || !type) return null;

  return (
    <div
      id="legal-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="legal-modal-container"
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-[var(--eh-border,#e4e2dc)] p-5 sm:p-7 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="btn-close-legal-modal"
          onClick={onClose}
          type="button"
          className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
          aria-label="Schließen"
        >
          <X className="w-5 h-5" />
        </button>

        {type === "agb" && (
          <div className="space-y-3.5 text-stone-700">
            <div className="flex items-center gap-2 text-[var(--eh-text,#1c2129)] font-bold text-base border-b border-stone-100 pb-2.5">
              <FileCheck className="w-5 h-5 text-[var(--eh-terra,#c8623a)]" />
              <span>Allgemeine Geschäftsbedingungen (AGB)</span>
            </div>
            <p className="text-xs leading-relaxed text-stone-600">
              Willkommen bei einfachhausen. Durch die Nutzung unseres Portals stimmst du den nachfolgenden transparenten Regelungen zu:
            </p>
            <div className="space-y-2.5 text-xs leading-relaxed text-stone-600">
              <h4 className="font-bold text-[var(--eh-text,#1c2129)]">§ 1 Plattform & Hausakte</h4>
              <p>
                einfachhausen stellt eine digitale Infrastruktur zur Organisation von Hausanliegen bereit. Das Hauskonto bleibt für Eigentümer dauerhaft kostenlos.
              </p>
              <h4 className="font-bold text-[var(--eh-text,#1c2129)]">§ 2 Keine Vermittlungsprovision & Festpreise</h4>
              <p>
                Wir erheben keine Provision von Partnerbetrieben. Handwerkerarbeiten werden stets vorab mit verlässlichem Kostenrahmen kalkuliert und erst nach deiner Freigabe beauftragt.
              </p>
              <h4 className="font-bold text-[var(--eh-text,#1c2129)]">§ 3 Meisterbetriebe mit Gesicht</h4>
              <p>
                Alle vermittelten Betriebe werden sorgfältig geprüft und verfügen über gültige Meisterbriefe, Gewerbeanmeldungen und Betriebshaftpflichtversicherungen.
              </p>
            </div>
          </div>
        )}

        {type === "datenschutz" && (
          <div className="space-y-3.5 text-stone-700">
            <div className="flex items-center gap-2 text-[var(--eh-text,#1c2129)] font-bold text-base border-b border-stone-100 pb-2.5">
              <ShieldCheck className="w-5 h-5 text-[var(--eh-text,#1c2129)]" />
              <span>Datenschutzerklärung nach DSGVO</span>
            </div>
            <p className="text-xs leading-relaxed text-stone-600">
              Der Schutz deiner Daten und Hausdokumente hat oberste Priorität:
            </p>
            <div className="space-y-2.5 text-xs leading-relaxed text-stone-600">
              <h4 className="font-bold text-[var(--eh-text,#1c2129)]">1. Server in Deutschland</h4>
              <p>
                Sämtliche Daten werden ausschließlich in nach ISO 27001 zertifizierten Rechenzentren in Frankfurt am Main verarbeitet.
              </p>
              <h4 className="font-bold text-[var(--eh-text,#1c2129)]">2. Kein Verkauf von Kontaktdaten</h4>
              <p>
                Deine Kontaktdaten und Schadensbeschreibungen werden niemals als Leads verkauft oder an Dritte weitergegeben, außer zur Durchführung des von dir freigegebenen Auftrags.
              </p>
              <h4 className="font-bold text-[var(--eh-text,#1c2129)]">3. Jederzeitiges Löschrecht</h4>
              <p>
                Du hast jederzeit das Recht auf vollständigen Datenexport sowie Löschung deines Kontos (Art. 17 DSGVO).
              </p>
            </div>
          </div>
        )}

        {type === "impressum" && (
          <div className="space-y-3.5 text-stone-700">
            <div className="flex items-center gap-2 text-[var(--eh-text,#1c2129)] font-bold text-base border-b border-stone-100 pb-2.5">
              <Building className="w-5 h-5 text-[var(--eh-text,#1c2129)]" />
              <span>Impressum</span>
            </div>
            <div className="text-xs leading-relaxed text-stone-600 space-y-1.5">
              <p className="font-bold text-stone-800 text-sm">einfachhausen GmbH</p>
              <p>Musterring 12 · 20095 Hamburg · Deutschland</p>
              <p>Handelsregister: Amtsgericht Hamburg, HRB 189234</p>
              <p>Geschäftsführung: M. Schmidt, T. Weber</p>
              <p>USt-IdNr.: DE 349 812 765</p>
              <p>Kontakt: kontakt@einfachhausen.de · Tel: 040 / 822 19 000</p>
            </div>
          </div>
        )}

        {type === "sicherheit" && (
          <div className="space-y-3.5 text-stone-700">
            <div className="flex items-center gap-2 text-[var(--eh-text,#1c2129)] font-bold text-base border-b border-stone-100 pb-2.5">
              <ShieldCheck className="w-5 h-5 text-[var(--eh-text,#1c2129)]" />
              <span>Unsere Sicherheits- und Datenprinzipien</span>
            </div>
            <div className="space-y-3 text-xs leading-relaxed text-stone-600">
              <div className="p-3 bg-[var(--eh-surface-subtle,#f2f5f5)] rounded-xl border border-[var(--eh-border,#e4e2dc)]">
                <h4 className="font-bold text-[var(--eh-text,#1c2129)] text-[13px] mb-1">1. Kein Datenhandel & keine Lead-Börse</h4>
                <p>
                  Deine Anfrage landet nicht in einem automatisierten Bietverfahren für dutzende Firmen. Ein Vorgang wird genau einem qualifizierten Meisterbetrieb aus deiner Nachbarschaft zugeordnet.
                </p>
              </div>
              <div className="p-3 bg-[var(--eh-surface-subtle,#f2f5f5)] rounded-xl border border-[var(--eh-border,#e4e2dc)]">
                <h4 className="font-bold text-[var(--eh-text,#1c2129)] text-[13px] mb-1">2. Dokumentenhoheit in deiner Hausakte</h4>
                <p>
                  Sämtliche Rechnungen, Wartungsprotokolle, Garantieunterlagen und Abnahmen gehören uneingeschränkt dir. Du kannst deine Daten jederzeit mit einem Klick exportieren.
                </p>
              </div>
              <div className="p-3 bg-[var(--eh-surface-subtle,#f2f5f5)] rounded-xl border border-[var(--eh-border,#e4e2dc)]">
                <h4 className="font-bold text-[var(--eh-text,#1c2129)] text-[13px] mb-1">3. Volle Kostentransparenz vor Termin</h4>
                <p>
                  Kein Handwerker fängt ohne deine ausdrückliche Zustimmung an. Der Kostenrahmen steht vorab fest – böse Überraschungen auf der Rechnung sind ausgeschlossen.
                </p>
              </div>
            </div>
          </div>
        )}

        {type === "partnerkriterien" && (
          <div className="space-y-3.5 text-stone-700">
            <div className="flex items-center gap-2 text-[var(--eh-text,#1c2129)] font-bold text-base border-b border-stone-100 pb-2.5">
              <FileCheck className="w-5 h-5 text-[var(--eh-terra,#c8623a)]" />
              <span>Aufnahmekriterien für Partnerbetriebe</span>
            </div>
            <div className="space-y-3 text-xs leading-relaxed text-stone-600">
              <div className="p-3 bg-[var(--eh-surface-subtle,#f2f5f5)] rounded-xl border border-[var(--eh-border,#e4e2dc)]">
                <h4 className="font-bold text-[var(--eh-text,#1c2129)] text-[13px] mb-1">Meisterbrief & Handwerkskammer</h4>
                <p>
                  Zulassung als eingetragener Handwerksbetrieb bei der regionalen Handwerkskammer und Meisterqualifikation in den geführten Gewerken.
                </p>
              </div>
              <div className="p-3 bg-[var(--eh-surface-subtle,#f2f5f5)] rounded-xl border border-[var(--eh-border,#e4e2dc)]">
                <h4 className="font-bold text-[var(--eh-text,#1c2129)] text-[13px] mb-1">Betriebshaftpflicht & Bonität</h4>
                <p>
                  Gültige Betriebshaftpflichtversicherung mit ausreichender Deckungssumme für Personen- und Sachschäden sowie einwandfreie Bonitätsprüfung.
                </p>
              </div>
              <div className="p-3 bg-[var(--eh-surface-subtle,#f2f5f5)] rounded-xl border border-[var(--eh-border,#e4e2dc)]">
                <h4 className="font-bold text-[var(--eh-text,#1c2129)] text-[13px] mb-1">0 % Provision auf deinen Lohn</h4>
                <p>
                  Wir verlangen keine Provision von deinem Umsatz. Du rechnest direkt zu deinen betriebsüblichen Meisterkonditionen mit dem Eigentümer ab.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 pt-3 border-t border-stone-100 flex justify-end">
          <button
            id="btn-confirm-legal-modal"
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[var(--eh-text,#1c2129)] hover:bg-[var(--eh-green-900,#0a3539)] text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
}
