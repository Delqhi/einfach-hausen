import type { ReactNode } from "react";
import s from "./styles.module.css";

export type EHManagerAutomation = {
  slug: string;
  title: string;
  text: string;
  tier: "free" | "abo";
  on: boolean;
  disabled: boolean;
};

export function EHManagerHero({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <header className={s.managerHero}>
      <p className={s.managerEyebrow}>{eyebrow}</p>
      <h1>{title}</h1>
      <p>{text}</p>
    </header>
  );
}

export function EHManagerAttention({
  items,
  actionHref,
  actionLabel,
}: {
  items: string[];
  actionHref: string;
  actionLabel: string;
}) {
  if (items.length === 0) return null;
  return (
    <section className={s.managerAttention} aria-label="Braucht Aufmerksamkeit">
      <div>
        <strong>
          {items.length === 1 ? "1 Ding braucht" : `${items.length} Dinge brauchen`} heute deine Aufmerksamkeit
        </strong>
        <p>{items.join(" · ")}</p>
      </div>
      <a href={actionHref}>{actionLabel}</a>
    </section>
  );
}

export function EHManagerGrid({ children }: { children: ReactNode }) {
  return <div className={s.managerGrid}>{children}</div>;
}

export function EHManagerWide({ children }: { children: ReactNode }) {
  return <div className={s.managerWide}>{children}</div>;
}

export function EHManagerThreads({
  items,
}: {
  items: { id: string; title: string; meta: string; href: string }[];
}) {
  return (
    <section className={s.managerCard} aria-label="Letzte Gespräche">
      <h2>Letzte Gespräche</h2>
      <p>Weiterführen, wo du aufgehört hast.</p>
      {items.length === 0 ? (
        <p role="status">Noch keine Gespräche. Starte unten beim Hausmeister.</p>
      ) : (
        <div className={s.managerRows}>
          {items.map((item) => (
            <a key={item.id} href={item.href}>
              <span className={s.managerRowText}>
                <strong>{item.title}</strong>
                <small>{item.meta}</small>
              </span>
              <span aria-hidden="true">›</span>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

export function EHManagerTasks({
  items,
}: {
  items: { id: string; icon: ReactNode; title: string; meta: string; href: string }[];
}) {
  return (
    <section className={s.managerCard} aria-label="Anstehende Aufgaben">
      <h2>Anstehende Aufgaben</h2>
      <p>Ich erinnere dich rechtzeitig.</p>
      {items.length === 0 ? (
        <p role="status">Aktuell nichts fällig. Neue Aufgaben erscheinen hier automatisch.</p>
      ) : (
        <div className={s.managerRows}>
          {items.map((item) => (
            <a key={item.id} href={item.href}>
              <span className={s.managerRowIcon}>{item.icon}</span>
              <span className={s.managerRowText}>
                <strong>{item.title}</strong>
                <small>{item.meta}</small>
              </span>
              <span aria-hidden="true">›</span>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

export function EHManagerAutomations({
  items,
  action,
  saved,
}: {
  items: EHManagerAutomation[];
  action: (formData: FormData) => void;
  saved: boolean;
}) {
  return (
    <section className={s.managerCard} aria-label="Automatisierungen">
      <h2>Automatisierungen</h2>
      <p>Nur drei zum Start — jederzeit an- oder ausschaltbar.</p>
      {saved && (
        <p role="status" className={s.managerSaved}>
          Einstellungen gespeichert.
        </p>
      )}
      <form action={action}>
        <div className={s.managerRows}>
          {items.map((item) => (
            <label key={item.slug} aria-disabled={item.disabled}>
              <span className={s.managerRowText}>
                <strong>{item.title}</strong>
                <small>{item.text}</small>
              </span>
              <span className={item.tier === "free" ? s.managerBadgeFree : s.managerBadgeAbo}>
                {item.tier === "free" ? "Free" : "Abo"}
              </span>
              <input
                type="checkbox"
                name={`automation:${item.slug}`}
                defaultChecked={item.on}
                disabled={item.disabled}
                aria-label={`${item.title} ${item.on ? "ausschalten" : "einschalten"}`}
              />
            </label>
          ))}
        </div>
        <button type="submit" className={s.managerSave}>
          Einstellungen speichern
        </button>
      </form>
    </section>
  );
}
