import type { ReactNode } from 'react';
import s from './styles.module.css';
export function EHPropertyOverview({ title, subtitle, facts, action }: {
 title: string; subtitle?: string; facts: readonly { label: string; value: string }[]; action?: ReactNode;
}) {
 return <section className={s.propertyOverview} aria-label="Hausübersicht">
  <header><div><span>HAUSAKTE</span><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{action}</header>
  <dl>{facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
 </section>;
}
export function EHDetailDisclosure({ id, title, description, children }: {
 id: string; title: string; description?: string; children: ReactNode;
}) {
 return <details id={id} className={s.detailDisclosure}>
  <summary><span><strong>{title}</strong>{description && <span>{description}</span>}</span><span aria-hidden="true">+</span></summary>
  <div>{children}</div>
 </details>;
}
export function EHProductIntroduction({ eyebrow, title, text, actions }: {
 eyebrow: string; title: string; text: string; actions: ReactNode;
}) {
 return <header className={s.productIntroduction}>
  <div><p>{eyebrow}</p><h1>{title}</h1></div>
  <div><p>{text}</p><div>{actions}</div></div>
 </header>;
}

export function EHProductScreenshot({ src, alt, caption }: { src: string; alt: string; caption: ReactNode }) {
 return <figure className={s.productScreenshot}><img src={src} alt={alt} width={1200} height={860} loading="eager" /><figcaption>{caption}</figcaption></figure>;
}
