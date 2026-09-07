import type { ReactNode } from "react";
import { EHSection, EHHeading, EHText, EHEyebrow, type EHTone } from "./primitives";
import { EHTimeline } from "./blocks";
import s from "./styles.module.css";

export function EHSectionHeading({eyebrow, title, text, center = false}: {
  eyebrow?: string; title?: ReactNode; text?: ReactNode; center?: boolean;
}) {
  return <header className={s.sectionHeading} data-center={center || undefined}>
    {eyebrow && <EHEyebrow>{eyebrow}</EHEyebrow>}
    {title && <EHHeading>{title}</EHHeading>}
    {text && <EHText size="lead">{text}</EHText>}
  </header>;
}

/** Marketing illustration, not an interactive app and never a live status. */
export function EHProductExcerpt({label, title, rows, note}: {
  label: string; title: string;
  rows: readonly {title: string; text: string}[]; note?: string;
}) {
  return <figure className={s.productExcerpt}>
    <figcaption className={s.excerptCaption}><span>Beispielansicht</span><span>{label}</span></figcaption>
    <div className={s.excerptBody}>
      <EHHeading as="h3" scale="item">{title}</EHHeading>
      <dl className={s.excerptRows}>{rows.map(row => <div key={row.title}>
        <dt>{row.title}</dt><dd>{row.text}</dd>
      </div>)}</dl>
      {note && <p className={s.excerptNote}>{note}</p>}
    </div>
  </figure>;
}

export function EHProcess({items}: {
  items: readonly {title: string; text?: ReactNode; media?: ReactNode}[];
}) {
  return <ol className={s.process}>{items.map((item, index) =>
    <li key={item.title} className={s.processStep}>
      <div className={s.processCopy}>
        <span className={s.stepNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        <EHHeading as="h3" scale="item">{item.title}</EHHeading>
        {item.text && <div className={s.text}>{item.text}</div>}
      </div>
      {item.media && <div className={s.processMedia}>{item.media}</div>}
    </li>
  )}</ol>;
}

export function EHProblemNotes({items}: {items: readonly {title: string; text: string}[]}) {
  return <ul className={s.problemNotes}>{items.map((item, index) => <li key={item.title}>
    <EHEyebrow number={String(index + 1).padStart(2, "0")}>Aus dem Hausalltag</EHEyebrow>
    <EHHeading as="h3" scale="item">{item.title}</EHHeading>
    <EHText>{item.text}</EHText>
  </li>)}</ul>;
}

/** Owns the section heading. Do not wrap in another titled section. */
export function EHCaseStudy({eyebrow, title, text, items, media}: {
  eyebrow: string; title: string; text: string;
  items: {when: string; title: string; text?: ReactNode}[]; media: ReactNode;
}) {
  return <EHSection><EHSectionHeading {...{eyebrow, title, text}}/>
    <div className={s.caseStudy}><EHTimeline items={items}/><div className={s.caseMedia}>{media}</div></div>
  </EHSection>;
}

export function EHBenefitStories({items}: {
  items: readonly {title: string; text: string; media: ReactNode; action?: ReactNode}[];
}) {
  return <div className={s.benefitStories}>{items.map((item, index) => <article className={s.benefitStory} key={item.title} data-reverse={index % 2 === 1 || undefined}>
    <div className={s.benefitStoryCopy}>
      <EHEyebrow number={String(index + 1).padStart(2, "0")}>Dein Haus. Mit Überblick.</EHEyebrow>
      <EHHeading as="h3">{item.title}</EHHeading><EHText>{item.text}</EHText>{item.action}
    </div><div className={s.benefitStoryMedia}>{item.media}</div>
  </article>)}</div>;
}

export function EHEditorialStatement({eyebrow, children, tone = "sand"}: {
  eyebrow: string; children: ReactNode; tone?: EHTone;
}) {
  return <EHSection tone={tone}><div className={s.editorialStatement}>
    <EHEyebrow>{eyebrow}</EHEyebrow><EHHeading>{children}</EHHeading>
  </div></EHSection>;
}
