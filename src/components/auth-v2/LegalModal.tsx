'use client';

import { EHButton, EHDialog, EHDivider, EHHeading, EHText, EHTextLink } from "@/design-system";

type LegalType = "agb" | "datenschutz" | "impressum" | "sicherheit" | "partnerkriterien";

interface LegalModalProps {
  isOpen: boolean;
  type: LegalType | null;
  onClose: () => void;
}

type ModalCopy = {
  title: string;
  intro: string;
  sections: Array<{ title: string; text: string }>;
  href?: string;
  hrefLabel?: string;
};

const copy: Record<LegalType, ModalCopy> = {
  agb: {
    title: "Allgemeine Geschäftsbedingungen",
    intro: "Die verbindlichen Bedingungen gehören in die vollständige rechtliche Fassung. Hier zeigen wir nur die wichtigsten Produktprinzipien für den Zugang.",
    sections: [
      { title: "Hauskonto", text: "Der digitale Zugang organisiert Hausinformationen, Anliegen und bestätigte Vorgänge." },
      { title: "Deine Entscheidung", text: "Eine Anfrage allein ist noch keine Beauftragung. Verbindliche Schritte brauchen die vorgesehene Freigabe." },
    ],
  },
  datenschutz: {
    title: "Datenschutz",
    intro: "Dein Konto enthält persönliche und hausbezogene Informationen. Maßgeblich ist die vollständige Datenschutzerklärung.",
    sections: [
      { title: "Zweckgebundene Verarbeitung", text: "Daten werden für die bereitgestellten Produktfunktionen und die von dir ausgelösten Vorgänge verwendet." },
      { title: "Deine Rechte", text: "Informationen zu Auskunft, Export, Berichtigung und Löschung stehen in der vollständigen Datenschutzerklärung." },
    ],
    href: "/datenschutz",
    hrefLabel: "Datenschutzerklärung öffnen",
  },
  impressum: {
    title: "Impressum",
    intro: "Die öffentliche Anbieterkennzeichnung bleibt die verbindliche Quelle für Unternehmensangaben.",
    sections: [
      { title: "Verantwortung", text: "Gina Schulze ist Inhaberin und Geschäftsführerin von Einfach Hausen." },
      { title: "Technische Entwicklung", text: "Jeremy Schulze ist Developer / technische Entwicklung und nicht Inhaber oder Geschäftsführer." },
    ],
    href: "/impressum",
    hrefLabel: "Vollständiges Impressum öffnen",
  },
  sicherheit: {
    title: "Sicherheit & Datenprinzipien",
    intro: "Der Zugang folgt denselben klaren Regeln wie die übrige Plattform: nachvollziehbare Zustände, explizite Freigaben und serverseitige Autorisierung.",
    sections: [
      { title: "Geschützte Bereiche", text: "Owner- und Partnerbereiche prüfen Berechtigungen serverseitig; UI-Zustand allein erteilt keinen Zugriff." },
      { title: "Keine stillen Aufträge", text: "Ein fachlicher Vorgang wird nicht allein durch das Öffnen oder Ausfüllen einer Oberfläche verbindlich beauftragt." },
    ],
  },
  partnerkriterien: {
    title: "Aufnahmekriterien für Partnerbetriebe",
    intro: "Partnerzugang und tatsächliche Freigabe als Betrieb sind getrennte Schritte. Die Registrierung allein bestätigt noch keine Partnerschaft.",
    sections: [
      { title: "Betriebsprüfung", text: "Betriebsdaten, fachliche Einordnung und die vorgesehenen Nachweise werden im Partnerprozess geprüft." },
      { title: "Klare Rollen", text: "Erst ein bestätigter Partnerstatus schaltet die dafür vorgesehenen produktiven Möglichkeiten frei." },
      { title: "Keine Lead-Börse", text: "Die Zusammenarbeit ist auf nachvollziehbare regionale Vorgänge und direkte Zuständigkeit ausgelegt." },
    ],
  },
};

export function LegalModal({ isOpen, type, onClose }: LegalModalProps) {
  const content = type ? copy[type] : null;
  return (
    <EHDialog open={isOpen && Boolean(content)} onClose={onClose} title={content?.title ?? "Rechtliche Hinweise"} actions={
      <EHButton type="button" variant="secondary" onClick={onClose}>Schließen</EHButton>
    }>
      {content && <>
        <EHText>{content.intro}</EHText>
        <EHDivider />
        {content.sections.map((section) => (
          <section key={section.title}>
            <EHHeading as="h3" scale="item">{section.title}</EHHeading>
            <EHText>{section.text}</EHText>
          </section>
        ))}
        {content.href && content.hrefLabel && (
          <EHTextLink href={content.href}>{content.hrefLabel}</EHTextLink>
        )}
      </>}
    </EHDialog>
  );
}
