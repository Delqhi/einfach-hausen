import type {ComponentProps, FormEventHandler, ReactNode} from "react";
import {EHScope, EHContainer, EHSection, EHHeading, EHText, EHEyebrow, EHButton, EHStatus, EHActions, EHTextLink, EHDivider, type EHButtonProps} from "./primitives";
import {EHPanel, EHProse, EHTimeline, EHCallout, EHArticleHeader, EHArticleLayout, EHRelated, EHPageHero, EHSteps, EHFAQ, EHClosing} from "./blocks";
import {EHAppHeader, EHTabs, EHList, EHDocumentList, EHDataTable, EHEmptyState, EHErrorState, EHComposer, type EHDocument} from "./app";

type Status = ComponentProps<typeof EHStatus>["tone"];
type Action = {label: string; href: string};
type Fact = {label: string; value: string};
type ListItem = ComponentProps<typeof EHList>["items"][number];
type Timeline = ComponentProps<typeof EHTimeline>["items"];
type FAQ = ComponentProps<typeof EHFAQ>["items"];

/** Approved compositions only: no new stylesheet, palette, navigation or business API. */
export function EHJobDetailPage({title, reference, summary, status, facts, nextStep, history, documents, contacts}: {
  title: string; reference: string; summary: string;
  status: {label: string; tone: Status}; facts: Fact[];
  nextStep: {title: string; text: string; action?: Action};
  history: Timeline; documents: EHDocument[]; contacts: ListItem[];
}) {
  return <EHScope app>
    <EHSection compact>
      <EHAppHeader eyebrow={reference} title={title} text={summary} actions={<EHStatus tone={status.tone}>{status.label}</EHStatus>}/>
      <EHCallout title={nextStep.title}><EHText>{nextStep.text}</EHText>{nextStep.action && <EHButton href={nextStep.action.href} arrow>{nextStep.action.label}</EHButton>}</EHCallout>
    </EHSection>
    <EHSection compact tone="white">
      <EHTabs label="Auftragsdetails" tabs={[
        {id: "details", label: "Überblick", content: <EHList label="Auftragsdaten" items={facts.map(f => ({id:f.label, title:f.label, text:f.value}))}/>},
        {id: "history", label: "Verlauf", content: history.length ? <EHTimeline items={history}/> : <EHEmptyState title="Noch kein Verlauf" text="Bestätigte Änderungen erscheinen hier."/>},
        {id: "documents", label: "Unterlagen", content: <EHDocumentList documents={documents}/>},
        {id: "contacts", label: "Beteiligte", content: contacts.length ? <EHList label="Beteiligte" items={contacts}/> : <EHEmptyState title="Noch niemand zugeordnet" text="Zugeordnete Kontakte erscheinen hier."/>}
      ]}/>
    </EHSection>
  </EHScope>;
}

export function EHAppointmentsPage({title = "Deine Termine", period, groups, navigation, primaryAction}: {
  title?: string; period: string;
  groups: {id: string; dateLabel: string; appointments: {id: string; time: string; title: string; location: string; href: string; status?: {label:string; tone:Status}}[]}[];
  navigation: {previous?: Action; next?: Action; today?: Action};
  primaryAction?: Action;
}) {
  return <EHScope app><EHSection compact>
    <EHAppHeader eyebrow="Gut vorbereitet" title={title} text={period} actions={primaryAction && <EHButton href={primaryAction.href}>{primaryAction.label}</EHButton>}/>
    <nav aria-label="Zeitraum wählen"><EHActions>{[navigation.previous,navigation.today,navigation.next].filter((a): a is Action => Boolean(a)).map(a => <EHButton key={a.href+a.label} href={a.href} variant="secondary" size="small">{a.label}</EHButton>)}</EHActions></nav>
  </EHSection><EHSection compact tone="white">
    {groups.some(g=>g.appointments.length) ? groups.filter(g=>g.appointments.length).map(g=><EHPanel key={g.id} title={g.dateLabel}>
      <EHList label={"Termine am "+g.dateLabel} items={g.appointments.map(a=>({id:a.id,title:a.time+" · "+a.title,text:a.location,href:a.href,meta:a.status && <EHStatus tone={a.status.tone}>{a.status.label}</EHStatus>}))}/>
    </EHPanel>) : <EHEmptyState title="Für diesen Zeitraum ist nichts eingetragen." text="Bestätigte Termine erscheinen hier."/>}
  </EHSection></EHScope>;
}

export function EHMessageThreadPage({title, context, back, messages, reply, readOnlyReason}: {
  title: string; context: string; back: Action;
  messages: {id: string; author: string; sentAt: string; body: string; delivery?: {label: string; tone: Status}}[];
  reply?: ComponentProps<typeof EHComposer>; readOnlyReason?: string;
}) {
  return <EHScope app><EHSection compact>
    <EHTextLink href={back.href}>{back.label}</EHTextLink>
    <EHAppHeader eyebrow="Im Gespräch" title={title} text={context}/>
    <div role="log" aria-label="Nachrichtenverlauf" aria-live="polite" aria-relevant="additions">
      {messages.length ? messages.map(m=><EHPanel key={m.id} label={m.sentAt} title={m.author}>
        {m.body.split(/\r?\n/).map((line,i)=>line ? <EHText key={i}>{line}</EHText> : null)}
        {m.delivery && <EHStatus tone={m.delivery.tone}>{m.delivery.label}</EHStatus>}
      </EHPanel>) : <EHEmptyState title="Hier beginnt euer Gespräch." text="Nachrichten zu diesem Vorgang bleiben hier nachvollziehbar."/>}
    </div>
  </EHSection><EHSection compact tone="white">
    {reply && !readOnlyReason ? <EHComposer {...reply} label="Deine Nachricht" hint="Die Nachricht gehört zu diesem Gespräch." submitLabel="Nachricht senden"/> :
      <EHCallout title="Dieses Gespräch ist schreibgeschützt"><EHText>{readOnlyReason ?? "Du hast aktuell keine Berechtigung, hier zu schreiben."}</EHText></EHCallout>}
  </EHSection></EHScope>;
}

export function EHBillingPage({title = "Rechnungen & Belege", text, rows, note, action}: {
  title?: string; text: string; note: string; action?: Action;
  rows: {id:string; number:string; party:string; date:string; amount:string; status:{label:string;tone:Status}; document?:Action}[];
}) {
  return <EHScope app><EHSection compact>
    <EHAppHeader eyebrow="Nachvollziehbar abgelegt" title={title} text={text} actions={action && <EHButton href={action.href}>{action.label}</EHButton>}/>
    <EHCallout title="Zur Einordnung"><EHText>{note}</EHText></EHCallout>
  </EHSection><EHSection compact tone="white">
    <EHDataTable caption="Rechnungen und Belege" columns={[
      {key:"number",label:"Beleg"},{key:"party",label:"Beteiligte"},{key:"date",label:"Datum"},
      {key:"amount",label:"Betrag",numeric:true},{key:"status",label:"Status"},{key:"document",label:"Dokument"}
    ]} rows={rows.map(r=>({id:r.id,cells:{
      number:r.number,party:r.party,date:r.date,amount:r.amount,
      status:<EHStatus tone={r.status.tone}>{r.status.label}</EHStatus>,
      document:r.document ? <EHTextLink href={r.document.href}>{r.document.label}</EHTextLink> : "Noch kein Dokument"
    }}))}/>
  </EHSection></EHScope>;
}

export function EHSettingsPage({title = "Deine Einstellungen", text, groups, onSubmit, pending, error, success, saveLabel = "Änderungen speichern", securityAction}: {
  title?:string; text:string;
  groups:{id:string;title:string;description:string;fields:ReactNode}[];
  onSubmit:FormEventHandler<HTMLFormElement>; pending:boolean; error?:string; success?:string; saveLabel?:string;
  securityAction?:{title:string;text:string;button:EHButtonProps};
}) {
  return <EHScope app><EHSection compact><EHAppHeader eyebrow="So passt es für dich" title={title} text={text}/></EHSection>
    <EHSection compact tone="white"><form onSubmit={onSubmit} aria-busy={pending}>
      {groups.map(g=><EHPanel key={g.id} title={g.title}><EHText muted>{g.description}</EHText>{g.fields}</EHPanel>)}
      {error && <EHErrorState text={error}/>}
      {success && <p role="status"><EHStatus tone="success">{success}</EHStatus></p>}
      <EHActions><EHButton type="submit" disabled={pending}>{pending ? "Wird gespeichert …" : saveLabel}</EHButton></EHActions>
    </form></EHSection>
    {securityAction && <EHSection compact><EHCallout title={securityAction.title}><EHText>{securityAction.text}</EHText><EHButton {...securityAction.button} variant="danger"/></EHCallout></EHSection>}
  </EHScope>;
}

export function EHAccessPage({title, text, eyebrow, form, help, legal}: {
  title:string; text:string; eyebrow:string; form:ReactNode; help:Action[]; legal:ReactNode;
}) {
  return <EHScope><EHSection compact><EHContainer narrow><EHEyebrow>{eyebrow}</EHEyebrow>
    <EHHeading as="h1" scale="page">{title}</EHHeading><EHText size="lead">{text}</EHText></EHContainer>
  </EHSection><EHSection compact tone="white"><EHContainer narrow>
    <EHPanel>{form}</EHPanel>
    <nav aria-label="Weitere Möglichkeiten"><EHActions>{help.map(a=><EHTextLink key={a.href} href={a.href}>{a.label}</EHTextLink>)}</EHActions></nav>
    <EHDivider/><EHProse>{legal}</EHProse></EHContainer>
  </EHSection></EHScope>;
}

export function EHGlossaryEntryPage({term, category, definition, sections, related, date}: {
  term:string; category:string; definition:string; date?:string;
  sections:{id:string;title:string;paragraphs:string[]}[];
  related:ComponentProps<typeof EHRelated>["items"];
}) {
  return <EHScope><EHSection>
    <EHArticleHeader category={category} title={term} description={definition} date={date}/>
    <EHArticleLayout contents={sections.map(s=>({id:s.id,title:s.title}))}>
      {sections.map(s=><section key={s.id} id={s.id}><EHHeading>{s.title}</EHHeading>{s.paragraphs.map((text,i)=><EHText key={i}>{text}</EHText>)}</section>)}
    </EHArticleLayout>
  </EHSection><EHSection tone="white"><EHRelated title="Verwandte Begriffe und passende Ratgeber" items={related}/></EHSection></EHScope>;
}

export function EHSensitiveServicePage({kind, title, text, scopeNotice, nextStep, steps, faq, more}: {
  kind:"notfall"|"versicherung"|"immobilienverkauf";
  title:string;text:string;scopeNotice:{title:string;text:string};
  nextStep:Action; steps:ComponentProps<typeof EHSteps>["items"]; faq:FAQ;
  more:ComponentProps<typeof EHRelated>["items"];
}) {
  const labels={notfall:"Dringendes Anliegen",versicherung:"Versicherung & Unterlagen",immobilienverkauf:"Immobilie & nächste Schritte"};
  return <EHScope><EHPageHero eyebrow={labels[kind]} title={title} text={text}/>
    <EHSection compact><EHCallout title={scopeNotice.title}><EHText>{scopeNotice.text}</EHText></EHCallout></EHSection>
    <EHSection tone="white"><EHHeading>So gehst du weiter vor.</EHHeading><EHSteps items={steps}/></EHSection>
    <EHSection><EHFAQ items={faq}/><EHRelated title="Weiterführende Informationen" items={more}/></EHSection>
    <EHClosing title={nextStep.label} text={scopeNotice.text} href={nextStep.href} label={nextStep.label}/>
  </EHScope>;
}
