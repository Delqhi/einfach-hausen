"use client";
import {useState, type ReactNode, type FormEvent} from "react";
import {useFormStatus} from "react-dom";
import {EHButton, EHStatus} from "./primitives";
import {EHField, EHInput, EHTextarea, EHSelect} from "./app";
import {EHWorkspaceGrid, EHWorkSection} from "./workspace";
import s from "./styles.module.css";

export function EHJobDetail({title,reference,status,description,location,contact,appointment,events,actions,attachments}:{title:string;reference:string;status:string;description:string;location:string;contact:{name:string;company:string;phone?:string};appointment:string;events:readonly {title:string;detail:string}[];actions:ReactNode;attachments:ReactNode}) {
 return <><header className={s.detailHeading}><div><p>{reference}</p><h1>{title}</h1><p>{location}</p></div><EHStatus>{status}</EHStatus></header>
 <EHWorkspaceGrid main={<><section className={s.detailBrief}><span>DER AUFTRAG</span><h2>Das ist zu tun.</h2><p>{description}</p></section><EHWorkSection title="Verlauf"><ol className={s.detailTimeline}>{events.map((event,i)=><li key={i}><span aria-hidden="true">{String(i+1).padStart(2,"0")}</span><div><h3>{event.title}</h3><p>{event.detail}</p></div></li>)}</ol></EHWorkSection>{attachments}</>} aside={<><section className={s.detailNext}><span>ALS NÄCHSTES</span><h2>{appointment}</h2>{actions}</section><section className={s.detailContact}><p>Dein Ansprechpartner</p><strong>{contact.name}</strong><span>{contact.company}</span>{contact.phone&&<a href={"tel:"+contact.phone}>Anrufen ↗</a>}</section></>}/></>;
}
export type EHAttachment = {id:string;name:string;kind:string;detail:string;href?:string};
export function EHAttachmentPanel({files,preview=false,onFilesSelected,upload}:{files:readonly EHAttachment[];preview?:boolean;onFilesSelected?:(files:File[])=>void;upload?:ReactNode}) {
 const [selected,setSelected]=useState<string[]>([]);
 return <section className={s.attachmentPanel}><header><div><h2>Fotos & Unterlagen</h2><p>Alles zum Vorgang bleibt zusammen.</p></div><span>{files.length} Dateien</span></header>
 {upload ?? ((preview || onFilesSelected) && <label className={s.attachmentDrop}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 16V3m-5 5 5-5 5 5M4 16v5h16v-5" stroke="currentColor" strokeWidth="1.7"/></svg><strong>Dateien auswählen</strong><span>{preview?"Vorschau: Auswahl lokal, kein Upload.":"Fotos und Unterlagen hinzufügen."}</span><input aria-label="Fotos und Unterlagen auswählen" type="file" multiple onChange={event=>{const list=Array.from(event.target.files??[]);setSelected(list.map(file=>file.name));onFilesSelected?.(list);}}/></label>)}
 {selected.length>0&&<p role="status">{selected.join(", ")} — ausgewählt{preview?", nicht hochgeladen":""}.</p>}
 <ul className={s.attachmentList}>{files.map(file=><li key={file.id}><span className={s.attachmentKind}>{file.kind}</span><div><strong>{file.name}</strong><small>{file.detail}</small></div>{file.href?<a href={file.href} aria-label={file.name+" öffnen"}>Öffnen ↗</a>:<span>Beispieldatei</span>}</li>)}</ul></section>;
}
export type EHInvoiceLine = {id:string;description:string;quantity:string;unit:string;price:string;tax:string};
const money=(value:number)=>new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR"}).format(value/100);
export function EHInvoiceEditor({buyer,job,initialLines,preview=false,onSubmit,action,embedded=false}:{buyer:string;job:string;initialLines:EHInvoiceLine[];preview?:boolean;onSubmit?:(data:FormData)=>void|Promise<void>;action?:(data:FormData)=>void|Promise<void>;embedded?:boolean}) {
 const Heading = embedded ? "h2" : "h1";
 const [lines,setLines]=useState(initialLines);const [busy,setBusy]=useState(false);const [error,setError]=useState("");
 const update=(id:string,key:keyof EHInvoiceLine,value:string)=>setLines(lines.map(line=>line.id===id?{...line,[key]:value}:line));
 const net=lines.reduce((sum,line)=>sum+Math.round((Number(line.quantity)||0)*Math.round((Number(line.price)||0)*100)),0);
 const tax=lines.reduce((sum,line)=>sum+Math.round(Math.round((Number(line.quantity)||0)*Math.round((Number(line.price)||0)*100))*(Number(line.tax)||0)/100),0);
 async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();if(preview||!onSubmit||busy)return;setBusy(true);setError("");try{await onSubmit(new FormData(event.currentTarget));}catch{setError("Die Rechnung konnte nicht übergeben werden. Bitte erneut versuchen.");}finally{setBusy(false);}}
 return <div className={s.invoiceEditor} data-embedded={embedded||undefined}><header className={s.detailHeading}><div><p>ABRECHNUNG · ENTWURF</p><Heading>Deine Arbeit. Klar abgerechnet.</Heading><p>{job}</p></div><EHStatus>Entwurf</EHStatus></header>
 <form action={preview?undefined:action} onSubmit={action&&!preview?undefined:submit}><EHWorkspaceGrid main={<><section className={s.invoiceRecipient}><span>RECHNUNG AN</span><h2>{buyer}</h2><p>Empfängerdaten aus dem Auftrag · {preview?"Beispieldaten":"vor Versand prüfen"}</p></section>
 <p>Ohne Datumsangabe gelten heute als Rechnungs- und Leistungsdatum und 14 Tage als Zahlungsziel.</p><div className={s.invoiceDates}>{[["issueDate","Rechnungsdatum"],["serviceDate","Leistungsdatum"],["dueDate","Zahlbar bis"]].map(([name,label])=><EHField key={name} id={"invoice-"+name} label={label}><EHInput id={"invoice-"+name} name={name} type="date"/></EHField>)}</div>
 <EHWorkSection title="Leistungen & Material"><div className={s.invoiceLines}>{lines.map((line,i)=><fieldset key={line.id}><legend>Position {i+1}</legend><EHField id={line.id+"-description"} label="Leistung"><EHInput id={line.id+"-description"} name="itemDescription" required value={line.description} onChange={event=>update(line.id,"description",event.target.value)}/></EHField>
 <div className={s.invoiceNumbers}>{[["quantity","Menge"],["unit","Einheit"],["price","Netto €"]].map(([key,label])=><EHField key={key} id={line.id+"-"+key} label={label}><EHInput id={line.id+"-"+key} name={{quantity:"itemQuantity",unit:"itemUnit",price:"itemPrice"}[key]} type={key==="unit"?"text":"number"} min={key==="quantity"?"0.01":"0"} step="0.01" required value={line[key as keyof EHInvoiceLine]} onChange={event=>update(line.id,key as keyof EHInvoiceLine,event.target.value)}/></EHField>)}<EHField id={line.id+"-tax"} label="MwSt."><EHSelect id={line.id+"-tax"} name="itemTax" value={line.tax} onChange={event=>update(line.id,"tax",event.target.value)}>{["19","7","0"].map(rate=><option key={rate} value={rate}>{rate} %</option>)}</EHSelect></EHField></div>
 <footer><span>Netto {money(Math.round((Number(line.quantity)||0)*Math.round((Number(line.price)||0)*100)))}</span><EHButton type="button" variant="quiet" disabled={lines.length===1} onClick={()=>setLines(lines.filter(item=>item.id!==line.id))}>Entfernen</EHButton></footer></fieldset>)}</div>
 <EHButton type="button" variant="secondary" onClick={()=>setLines([...lines,{id:crypto.randomUUID(),description:"",quantity:"1",unit:"Stk.",price:"0",tax:"19"}])}>+ Position hinzufügen</EHButton></EHWorkSection>
 <EHField id="invoice-notes" label="Hinweis (optional)"><EHTextarea id="invoice-notes" name="notes" placeholder="Weitere Angaben zu deiner Leistung …"/></EHField></>} aside={<section className={s.invoiceSummary}><span>DEINE RECHNUNG</span><h2>Zusammenfassung</h2><dl><div><dt>Netto</dt><dd>{money(net)}</dd></div><div><dt>Umsatzsteuer</dt><dd>{money(tax)}</dd></div><div><dt>Gesamtbetrag</dt><dd>{money(net+tax)}</dd></div></dl><p>{preview?"Gestaltungsvorschau. Es wird keine Rechnung erstellt oder versendet.":"Beträge sind eine Vorschau; die verbindliche Berechnung erfolgt beim Erstellen."}</p>{error&&<p role="alert">{error}</p>}<EHInvoiceSubmit disabled={preview||(!onSubmit&&!action)||busy} /></section>}/></form></div>;
}

function EHInvoiceSubmit({disabled}:{disabled:boolean}) { const {pending}=useFormStatus(); return <EHButton type="submit" disabled={disabled||pending} arrow>{pending?"Wird gesendet …":"Rechnung erstellen & senden"}</EHButton>; }
