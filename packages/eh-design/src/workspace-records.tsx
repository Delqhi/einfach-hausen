import type {ReactNode} from "react";
import {EHStatus} from "./primitives";
import s from "./styles.module.css";

export function EHRouteTabs({label,items}:{label:string;items:readonly {href:string;label:string;active:boolean}[]}) {
 return <nav aria-label={label} className={s.routeTabs}>{items.map(item=><a key={item.href} href={item.href} aria-current={item.active?"page":undefined}>{item.label}</a>)}</nav>;
}
export type EHScheduleRecord = {id:string;day:string;month:string;dateLabel:string;title:string;detail:string;status?:string;href?:string;tone?:"info"|"success"|"warning"|"error"};
export function EHScheduleList({label,items}:{label:string;items:readonly EHScheduleRecord[]}) {
 return <ol className={s.scheduleList} aria-label={label}>{items.map(item=><li key={item.id}>
  <div className={s.scheduleDate} aria-label={item.dateLabel}><strong aria-hidden="true">{item.day}</strong><span aria-hidden="true">{item.month}</span></div>
  <div className={s.scheduleInfo}><p>{item.dateLabel}</p><h3>{item.href?<a href={item.href}>{item.title}</a>:item.title}</h3><p>{item.detail}</p></div>
  {item.status&&<EHStatus tone={item.tone??"info"}>{item.status}</EHStatus>}
 </li>)}</ol>;
}
export type EHDossierRecord={id:string;title:string;kind:string;detail:string;href:string;amount?:string;status?:ReactNode};
export function EHDossierList({label,items}:{label:string;items:readonly EHDossierRecord[]}) {
 return <ul className={s.dossierList} aria-label={label}>{items.map(item=><li key={item.id}>
  <span className={s.documentMark} aria-hidden="true"><svg viewBox="0 0 24 28" fill="none"><path d="M4 1h10l6 6v20H4zM14 1v7h6M8 14h8M8 19h6" stroke="currentColor" strokeWidth="1.5"/></svg></span>
  <div className={s.dossierInfo}><span>{item.kind}</span><h3><a href={item.href}>{item.title}</a></h3><p>{item.detail}</p></div>
  <div className={s.dossierMeta}>{item.amount&&<strong>{item.amount}</strong>}{item.status}<a href={item.href} aria-label={item.title+" öffnen"}>Öffnen ↗</a></div>
 </li>)}</ul>;
}
export type EHOrderRecord={id:string;title:string;href:string;kind:string;status:string;contact:string;amount:string;action:string;detail?:string};
export function EHOrderList({items}:{items:readonly EHOrderRecord[]}) {
 return <ul className={s.orderList}>{items.map(item=><li key={item.id}>
  <div className={s.orderTop}><span>{item.kind}</span><EHStatus>{item.status}</EHStatus></div>
  <h2><a href={item.href}>{item.title}</a></h2>
  {item.detail&&<p>{item.detail}</p>}
  <dl><div><dt>Ansprechpartner</dt><dd>{item.contact}</dd></div><div><dt>{item.kind==="Kontakt"?"Preis":"Angebot"}</dt><dd>{item.amount}</dd></div></dl>
  <a className={s.orderNext} href={item.href}>{item.action}<span aria-hidden="true">↗</span></a>
 </li>)}</ul>;
}
export function EHIdentitySummary({initials,name,email,children}:{initials:string;name:string;email:string;children?:ReactNode}) {
 return <section className={s.identitySummary}><span className={s.identityAvatar} aria-hidden="true">{initials}</span><div><h2>{name}</h2><p>{email}</p></div>{children}</section>;
}
