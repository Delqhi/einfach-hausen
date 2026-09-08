import type {ReactNode} from "react";
import s from "./styles.module.css";
export function EHInbox({contacts,children}:{contacts:ReactNode;children:ReactNode}) {return <div className={s.inbox}><aside className={s.inboxContacts} aria-label="Kontakte">{contacts}</aside><div className={s.inboxThread}>{children}</div></div>;}
export function EHContactGroup({title,contacts}:{title:string;contacts:readonly {id:string;href:string;name:string;detail:string;active:boolean;unread:number}[]}) {
 return <section className={s.contactGroup}><h2>{title}</h2>{contacts.map(contact=><a key={contact.id} href={contact.href} aria-current={contact.active?"page":undefined}><strong>{contact.name}</strong><span>{contact.detail}</span>{contact.unread>0&&<small>{contact.unread>99?'99+':contact.unread} ungelesen</small>}</a>)}</section>;
}
export function EHConversation({name,detail,phone,messages,composer,settings,role}:{name:string;detail:string;phone?:string;messages:readonly {id:string;mine:boolean;author:string;body:string}[];composer:ReactNode;settings?:ReactNode;role:"owner"|"provider"}) {
 return <section className={s.conversation} aria-label={"Gespräch mit "+name} data-message-thread={role}>
  <header><div><h2>{name}</h2><p>{detail}</p></div>{phone&&<a href={"tel:"+phone} aria-label={`${name} anrufen`}>Anrufen ↗</a>}</header>
  {settings&&<div className={s.conversationSettings}>{settings}</div>}
  <ol aria-label="Nachrichtenverlauf" className={s.conversationMessages}>
    {messages.length===0&&<li className={s.conversationEmpty}>Hier beginnt euer Gespräch. Schreibe für Rückfragen oder Terminabsprachen.</li>}
    {messages.map(message=><li key={message.id} data-mine={message.mine}><span>{message.author}</span><p>{message.body}</p></li>)}
  </ol>
  <div className={s.conversationComposer}>{composer}</div>
 </section>;
}
