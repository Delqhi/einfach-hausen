'use client';

import React, { useEffect, useRef } from "react";
import { X, ShieldCheck, FileCheck, Building } from "lucide-react";

interface LegalModalProps {
  isOpen: boolean;
  type: "agb" | "datenschutz" | "impressum" | "sicherheit" | "partnerkriterien" | null;
  onClose: () => void;
}

export function LegalModal({ isOpen, type, onClose }: LegalModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const modal = modalRef.current;
      if (!modal) return;
      const focusable = Array.from(
        modal.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      ).filter((element) => element.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen || !type) return null;

  return (
    <div
      id="legal-modal-backdrop"
      className="eh-auth-legal-backdrop fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="legal-modal-container"
        ref={modalRef}
        className="eh-auth-legal-modal relative bg-white border border-[var(--eh-border,#e4e2dc)] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="btn-close-legal-modal"
          ref={closeButtonRef}
          onClick={onClose}
          type="button"
          className="eh-auth-modal-close flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Schließen"
        >
          <X className="w-5 h-5" />
        </button>

        {type === "agb" && (
          <div className="eh-auth-modal-section text-stone-700">
            <div className="eh-auth-modal-heading flex items-center gap-2 text-[var(--eh-text,#1c2129)] font-bold text-base">
              <FileCheck className="w-5 h-5 text-[var(--eh-terra,#c8623a)]" />
              <span id="legal-modal-title">Allgemeine Geschäftsbedingungen (AGB)</span>
            </div>
            <p className="text-xs leading-relaxed text-stone-600">
              Willkommen bei einfachhausen. Durch die Nutzung unseres Portals stimmst du den nachfolgenden transparenten Regelungen zu:
            </p>
            <div className="eh-auth-modal-prose text-xs leading-relaxed text-stone-600">
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
          <div className="eh-auth-modal-section text-stone-700">
            <div className="eh-auth-modal-heading flex items-center gap-2 text-[var(--eh-text,#1c2129)] font-bold text-base">
              <ShieldCheck className="w-5 h-5 text-[var(--eh-text,#1c2129)]" />
              <span id="legal-modal-title">Datenschutzerklärung nach DSGVO</span>
            </div>
            <p className="text-xs leading-relaxed text-stone-600">
              Der Schutz deiner Daten und Hausdokumente hat oberste Priorität:
            </p>
            <div className="eh-auth-modal-prose text-xs leading-relaxed text-stone-600">
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
          <div className="eh-auth-modal-section text-stone-700">
            <div className="eh-auth-modal-heading flex items-center gap-2 text-[var(--eh-text,#1c2129)] font-bold text-base">
              <Building className="w-5 h-5 text-[var(--eh-text,#1c2129)]" />
              <span id="legal-modal-title">Impressum</span>
            </div>
            <div className="text-xs leading-relaxed text-stone-600 space-y-1.5">
              <p className="font-bold text-stone-800 text-sm">Einfach Hausen</p>
              <p>Inhaberin &amp; Geschäftsführerin: Gina Schulze</p>
              <p>Developer / technische Entwicklung: Jeremy Schulze</p>
              <p>Kontakt: info@einfachhausen.de</p>
              <p>Vollständige Anbieterkennzeichnung: einfachhausen.de/impressum</p>
            </div>
          </div>
        )}

        {type === "sicherheit" && (
          <div className="eh-auth-modal-section text-stone-700">
            <div className="eh-auth-modal-heading flex items-center gap-2 text-[var(--eh-text,#1c2129)] font-bold text-base">
              <ShieldCheck className="w-5 h-5 text-[var(--eh-text,#1c2129)]" />
              <span id="legal-modal-title">Unsere Sicherheits- und Datenprinzipien</span>
            </div>
            <div className="eh-auth-modal-stack text-xs leading-relaxed text-stone-600">
              <div className="eh-auth-modal-card bg-[var(--eh-surface-subtle,#f2f5f5)] border border-[var(--eh-border,#e4e2dc)]">
                <h4 className="font-bold text-[var(--eh-text,#1c2129)] text-[13px] mb-1">1. Kein Datenhandel & keine Lead-Börse</h4>
                <p>
                  Deine Anfrage landet nicht in einem automatisierten Bietverfahren für dutzende Firmen. Ein Vorgang wird genau einem qualifizierten Meisterbetrieb aus deiner Nachbarschaft zugeordnet.
                </p>
              </div>
              <div className="eh-auth-modal-card bg-[var(--eh-surface-subtle,#f2f5f5)] border border-[var(--eh-border,#e4e2dc)]">
                <h4 className="font-bold text-[var(--eh-text,#1c2129)] text-[13px] mb-1">2. Dokumentenhoheit in deiner Hausakte</h4>
                <p>
                  Sämtliche Rechnungen, Wartungsprotokolle, Garantieunterlagen und Abnahmen gehören uneingeschränkt dir. Du kannst deine Daten jederzeit mit einem Klick exportieren.
                </p>
              </div>
              <div className="eh-auth-modal-card bg-[var(--eh-surface-subtle,#f2f5f5)] border border-[var(--eh-border,#e4e2dc)]">
                <h4 className="font-bold text-[var(--eh-text,#1c2129)] text-[13px] mb-1">3. Volle Kostentransparenz vor Termin</h4>
                <p>
                  Kein Handwerker fängt ohne deine ausdrückliche Zustimmung an. Der Kostenrahmen steht vorab fest – böse Überraschungen auf der Rechnung sind ausgeschlossen.
                </p>
              </div>
            </div>
          </div>
        )}

        {type === "partnerkriterien" && (
          <div className="eh-auth-modal-section text-stone-700">
            <div className="eh-auth-modal-heading flex items-center gap-2 text-[var(--eh-text,#1c2129)] font-bold text-base">
              <FileCheck className="w-5 h-5 text-[var(--eh-terra,#c8623a)]" />
              <span id="legal-modal-title">Aufnahmekriterien für Partnerbetriebe</span>
            </div>
            <div className="eh-auth-modal-stack text-xs leading-relaxed text-stone-600">
              <div className="eh-auth-modal-card bg-[var(--eh-surface-subtle,#f2f5f5)] border border-[var(--eh-border,#e4e2dc)]">
                <h4 className="font-bold text-[var(--eh-text,#1c2129)] text-[13px] mb-1">Meisterbrief & Handwerkskammer</h4>
                <p>
                  Zulassung als eingetragener Handwerksbetrieb bei der regionalen Handwerkskammer und Meisterqualifikation in den geführten Gewerken.
                </p>
              </div>
              <div className="eh-auth-modal-card bg-[var(--eh-surface-subtle,#f2f5f5)] border border-[var(--eh-border,#e4e2dc)]">
                <h4 className="font-bold text-[var(--eh-text,#1c2129)] text-[13px] mb-1">Betriebshaftpflicht & Bonität</h4>
                <p>
                  Gültige Betriebshaftpflichtversicherung mit ausreichender Deckungssumme für Personen- und Sachschäden sowie einwandfreie Bonitätsprüfung.
                </p>
              </div>
              <div className="eh-auth-modal-card bg-[var(--eh-surface-subtle,#f2f5f5)] border border-[var(--eh-border,#e4e2dc)]">
                <h4 className="font-bold text-[var(--eh-text,#1c2129)] text-[13px] mb-1">0 % Provision auf deinen Lohn</h4>
                <p>
                  Wir verlangen keine Provision von deinem Umsatz. Du rechnest direkt zu deinen betriebsüblichen Meisterkonditionen mit dem Eigentümer ab.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="eh-auth-modal-footer flex justify-end">
          <button
            id="btn-confirm-legal-modal"
            type="button"
            onClick={onClose}
            className="eh-auth-modal-confirm bg-[var(--eh-text,#1c2129)] hover:bg-[var(--eh-green-900,#0a3539)] text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
}
