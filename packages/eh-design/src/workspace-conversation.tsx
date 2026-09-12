import type {ReactNode} from "react";
import s from "./styles.module.css";
export function EHInbox({contacts,children}:{contacts:ReactNode;children:ReactNode}) {return <div className={s.inbox}><aside className={s.inboxContacts} aria-label="Kontakte">{contacts}</aside><div className={s.inboxThread}>{children}</div></div>;}
export function EHContactGroup({title,contacts}:{title:string;contacts:readonly {id:string;href:string;name:string;detail:string;active:boolean;unread:number}[]}) {
 return <section className={s.contactGroup}><h2>{title}</h2>{contacts.map(contact=><a key={contact.id} href={contact.href} aria-current={contact.active?"page":undefined}><strong>{contact.name}</strong><span>{contact.detail}</span>{contact.unread>0&&<small>{contact.unread} ungelesen</small>}</a>)}</section>;
}
export function EHConversation({name,detail,phone,messages,composer,settings,role}:{name:string;detail:string;phone?:string;messages:readonly {id:string;mine:boolean;author:string;body:string}[];composer:ReactNode;settings?:ReactNode;role:"owner"|"provider"}) {
 return <section className={s.conversation} aria-label={"Gespräch mit "+name} data-message-thread={role}>
  <header><div><h2>{name}</h2><p>{detail}</p></div>{phone&&<a href={"tel:"+phone}>Anrufen ↗</a>}</header>
  {settings&&<div className={s.conversationSettings}>{settings}</div>}
  <ol aria-label="Nachrichtenverlauf" className={s.conversationMessages}>
    {messages.length===0&&<li className={s.conversationEmpty}>Hier beginnt euer Gespräch. Schreibe für Rückfragen oder Terminabsprachen.</li>}
    {messages.map(message=><li key={message.id} data-mine={message.mine}><span>{message.author}</span><p>{message.body}</p></li>)}
  </ol>
  <div className={s.conversationComposer}>{composer}</div>
 </section>;
}

export type EHContactDirectoryCategory = {
  id: string;
  title: string;
  count: number;
  hint: string;
  href: string;
  active: boolean;
  icon: ReactNode;
};
export function EHContactDirectory({
  totalHref,
  totalLabel,
  search,
  categories,
  finder,
  listTitle,
  listAllHref,
  list,
}: {
  totalHref: string;
  totalLabel: string;
  search: { action: string; name: string; defaultValue?: string; placeholder: string; extra?: { name: string; value: string } };
  categories: EHContactDirectoryCategory[];
  finder: { title: string; text: string; href: string; label: string };
  listTitle: string;
  listAllHref: string;
  list: ReactNode;
}) {
  return (
    <div className={s.contactDirectory}>
      <div className={s.contactDirectoryToolbar}>
        <form className={s.contactDirectorySearch} action={search.action} method="get" role="search">
          <label htmlFor="contact-directory-search">Ansprechpartner durchsuchen</label>
          <span aria-hidden="true">⌕</span>
          {search.extra && <input type="hidden" name={search.extra.name} value={search.extra.value} />}
          <input id="contact-directory-search" name={search.name} type="search" defaultValue={search.defaultValue} placeholder={search.placeholder} />
        </form>
        <a className={s.contactDirectoryTotal} href={totalHref}>{totalLabel}<span aria-hidden="true">›</span></a>
      </div>
      <div className={s.contactDirectoryGrid} role="list" aria-label="Bereiche">
        {categories.map((category) => (
          <a key={category.id} role="listitem" className={s.contactDirectoryCard} href={category.href} aria-current={category.active ? "true" : undefined}>
            <span className={s.contactDirectoryIcon}>{category.icon}</span>
            <span className={s.contactDirectoryCopy}>
              <strong>{category.title}</strong>
              <small>{category.count === 1 ? "1 Ansprechpartner" : `${category.count} Ansprechpartner`}</small>
              <span>{category.hint}</span>
            </span>
            <span className={s.contactDirectoryArrow} aria-hidden="true">›</span>
          </a>
        ))}
      </div>
      <a className={s.contactDirectoryFinder} href={finder.href}>
        <span className={s.contactDirectoryFinderIcon} aria-hidden="true">+</span>
        <span className={s.contactDirectoryCopy}>
          <strong>{finder.title}</strong>
          <span>{finder.text}</span>
        </span>
        <span className={s.contactDirectoryArrow} aria-hidden="true">›</span>
      </a>
      <div className={s.contactDirectoryListHead}>
        <h2>{listTitle}</h2>
        <a href={listAllHref}>Alle anzeigen<span aria-hidden="true"> ›</span></a>
      </div>
      <div className={s.contactDirectoryList}>{list}</div>
    </div>
  );
}
