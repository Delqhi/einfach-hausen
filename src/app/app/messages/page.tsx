import { ChevronDown, Layers3, MessageSquare, Phone, UserRound } from 'lucide-react';
import { EHAppHeader, EHPanel, EHList, EHEmptyState, EHErrorState, EHCallout, EHButton, EHField, EHSelect, EHInput, EHStatus } from '@/design-system';
import { AppShell, SectionTitle } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { updateContactCategoryAction } from '@/app/actions';
import { groupContactsByCategory, normalizeContactCategory, STANDARD_CONTACT_CATEGORIES } from '@/lib/contact-categories';
import { OwnerMessageComposer } from './thread-client';
import styles from './messages.module.css';

type ThreadMessage = {
  source: 'direct' | 'job';
  id: number;
  sender_id: number;
  body: string;
  read_at: string | null;
  created_at: string;
  context_title: string | null;
  job_id: number | null;
};

export default async function Messages({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const u = await requireUser('homeowner');
  const sp = await searchParams;
  const contacts = db.prepare(`SELECT hc.*,u.first_name,u.last_name,u.phone,u.email,m.job_title,p.business_name,j.title last_job_title,
      ((SELECT COUNT(*) FROM contact_messages cm
        WHERE cm.homeowner_id=hc.homeowner_id AND cm.provider_id=hc.provider_id AND cm.contact_user_id=hc.contact_user_id
          AND cm.sender_id<>hc.homeowner_id AND cm.read_at IS NULL)
       + (SELECT COUNT(*) FROM messages jm
          JOIN jobs jj ON jj.id=jm.job_id AND jj.homeowner_id=hc.homeowner_id
          JOIN job_assignments ja ON ja.job_id=jm.job_id AND ja.provider_id=hc.provider_id AND ja.contact_user_id=hc.contact_user_id
          WHERE jm.recipient_id=hc.homeowner_id AND jm.sender_id=hc.contact_user_id AND jm.read_at IS NULL)) unread_count
    FROM homeowner_contacts hc
    JOIN users u ON u.id=hc.contact_user_id AND u.role='provider'
    JOIN provider_members m ON m.user_id=hc.contact_user_id AND m.provider_id=hc.provider_id AND m.active=1
    JOIN provider_profiles p ON p.user_id=hc.provider_id
    LEFT JOIN jobs j ON j.id=hc.last_job_id
    WHERE hc.homeowner_id=? ORDER BY hc.updated_at DESC`).all(u.id) as any[];
  const grouped = groupContactsByCategory(contacts);
  const requestedId = Number(sp.contact);
  const hasRequestedContact = Boolean(sp.contact);
  const selected = hasRequestedContact
    ? contacts.find((contact) => Number.isSafeInteger(requestedId) && contact.contact_user_id === requestedId)
    : contacts[0];
  const selectedId = selected?.contact_user_id;
  const selectedCategory = selected ? normalizeContactCategory(selected.category || '') : '';
  const messages = selected
    ? db.prepare(`SELECT 'direct' source,cm.id,cm.sender_id,cm.body,cm.read_at,cm.created_at,NULL context_title,NULL job_id
        FROM contact_messages cm
        WHERE cm.homeowner_id=? AND cm.provider_id=? AND cm.contact_user_id=?
        UNION ALL
        SELECT 'job' source,jm.id,jm.sender_id,jm.body,jm.read_at,jm.created_at,j.title context_title,jm.job_id
        FROM messages jm
        JOIN jobs j ON j.id=jm.job_id AND j.homeowner_id=?
        JOIN job_assignments ja ON ja.job_id=jm.job_id AND ja.provider_id=? AND ja.contact_user_id=?
        WHERE (jm.sender_id=? AND jm.recipient_id=?) OR (jm.sender_id=? AND jm.recipient_id=?)
        ORDER BY created_at,id`).all(
          u.id,
          selected.provider_id,
          selected.contact_user_id,
          u.id,
          selected.provider_id,
          selected.contact_user_id,
          u.id,
          selected.contact_user_id,
          selected.contact_user_id,
          u.id,
        ) as ThreadMessage[]
    : [];
  const unreadCount = selected ? Number(selected.unread_count || 0) : 0;

  return <AppShell role="homeowner" active="/app/messages" title="Ansprechpartner" subtitle="Dein persönliches Netzwerk fürs Haus">
    <EHAppHeader eyebrow="Netzwerk" title="Meine Ansprechpartner" text="Nach Bereichen sortiert, damit du sofort weißt, wen du für Garten, Dach, Elektro oder andere Themen ansprechen kannst." />
    {contacts.length === 0 ? <EHEmptyState title="Noch keine Ansprechpartner" text="Wenn du zuerst nur mit einem passenden Menschen sprechen möchtest, startest du beim Hausmeister und wählst bewusst „Ansprechpartner finden“." action={<EHButton href="/app/hausmeister" arrow>Ansprechpartner finden</EHButton>} /> : <>
      {hasRequestedContact && !selected && <EHErrorState text="Dieser Ansprechpartner ist nicht mehr verfügbar. Wähle einen Kontakt aus deiner Liste." />}
      <div>{grouped.map(([category, rows]) => <EHPanel key={category} title={category}><EHList label={category} items={rows.map((contact: any) => ({ id: String(contact.contact_user_id), title: `${contact.first_name} ${contact.last_name}`, text: `${contact.job_title || 'Ansprechpartner'} · ${contact.business_name} — ${contact.last_job_title ? `Kennt dein Haus aus: ${contact.last_job_title}` : 'Mit deinem Haus verknüpft'}`, href: `/app/messages?contact=${contact.contact_user_id}`, meta: Number(contact.unread_count) > 0 ? <EHStatus>{`${contact.unread_count} ungelesen`}</EHStatus> : null }))} /></EHPanel>)}</div>
      {selected && <div className={styles.threadShell} data-message-thread="owner"><SectionTitle>Direkter Kontakt</SectionTitle>{sp.category === 'saved' && <div className="alert success" role="status" aria-live="polite">Bereich gespeichert.</div>}<EHPanel title="Ansprechpartner"><UserRound aria-hidden="true"/><div><strong>{selected.first_name} {selected.last_name}</strong><p>{selected.job_title || 'Ansprechpartner'} · {selected.business_name}</p><small>Bereich: {selectedCategory}</small></div>{selected.phone && <a href={`tel:${selected.phone}`} aria-label={`${selected.first_name} anrufen`}><Phone aria-hidden="true"/></a>}</EHPanel>
        <details><summary><span>Bereich ändern</span><ChevronDown size={15}/></summary><form action={updateContactCategoryAction.bind(null, selected.contact_user_id)}><EHField id="contact-category" label="Standardbereich"><EHSelect id="contact-category" name="category" defaultValue={STANDARD_CONTACT_CATEGORIES.includes(selectedCategory as any) ? selectedCategory : 'Haus & Allgemein'}>{STANDARD_CONTACT_CATEGORIES.map(category => <option value={category} key={category}>{category}</option>)}</EHSelect></EHField><EHField id="contact-custom" label="Eigener Bereich (optional)" hint="Wenn du hier etwas einträgst, wird dieser eigene Bereich verwendet."><EHInput id="contact-custom" name="customCategory" maxLength={60} placeholder={STANDARD_CONTACT_CATEGORIES.includes(selectedCategory as any) ? 'z. B. Pool & Sauna' : selectedCategory}/></EHField><button>Bereich speichern</button></form></details>
        <div className="chat contact-chat">{messages.length === 0 && <div className="contact-chat-intro"><MessageSquare aria-hidden="true"/><p>Schreib direkt, z. B. „Kannst du dieses Jahr wieder die Hecke schneiden?“</p></div>}{messages.map((message) => <div className={message.sender_id === u.id ? 'msg mine' : 'msg'} key={`${message.source}-${message.id}`}><small>{message.sender_id === u.id ? 'Du' : selected.first_name}{message.source === 'job' && message.context_title ? ` · Auftrag: ${message.context_title}` : ''}</small><p className={styles.messageBody}>{message.body}</p></div>)}<OwnerMessageComposer contactUserId={selected.contact_user_id} peerName={selected.first_name} unreadCount={unreadCount}/></div>
        <EHCallout title="Bestehende Kundenbeziehung"><p>Dieser Kontakt bleibt Teil deiner Hausakte. Wenn du ihn direkt für eine Folgearbeit ansprichst, ist keine neue Partnervermittlung nötig.</p></EHCallout></div>}
    </>}
  </AppShell>;
}
