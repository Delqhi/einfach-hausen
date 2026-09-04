"use client";

import React from "react";
import Link from "next/link";
import { X, KeyRound, ArrowRight } from "lucide-react";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
  onPasswordResetSuccess?: (email: string, newPassword?: string) => void;
}

// Ehrlich statt simuliert: Es gibt (noch) keinen automatischen Reset-Flow,
// daher fuehrt das Modal zum Support — kein toter "Link gesendet"-Fake.
export function ForgotPasswordModal({ isOpen, onClose, defaultEmail = "" }: ForgotPasswordModalProps) {
  if (!isOpen) return null;
  return (
    <div
      id="forgot-password-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="forgot-password-modal"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-[var(--eh-border,#e4e2dc)] p-5 sm:p-6 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="btn-close-forgot-password"
          onClick={onClose}
          type="button"
          className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
          aria-label="Schließen"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="space-y-3.5">
          <div className="w-10 h-10 rounded-xl bg-[var(--eh-green-50,#edf5f5)] text-[var(--eh-text,#1c2129)] flex items-center justify-center border border-[var(--eh-green-100,#dcebec)]">
            <KeyRound className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[var(--eh-text,#1c2129)] tracking-tight">Passwort vergessen?</h3>
            <p className="text-stone-600 text-xs leading-relaxed">
              {defaultEmail ? `Für ${defaultEmail}: ` : ""}Schreib uns kurz — wir setzen dein Passwort gemeinsam zurück. In der Demo-Phase geht es auch ohne Wartezeit: melde dich einfach mit <strong>kunde / admin</strong> oder <strong>handwerker / admin</strong> an.
            </p>
          </div>
          <Link
            href="/kontakt"
            className="w-full py-3 px-4 rounded-xl bg-[var(--eh-green-700,#105258)] text-white font-bold text-sm flex items-center justify-center gap-2"
          >
            <span>Zum Kontakt</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
