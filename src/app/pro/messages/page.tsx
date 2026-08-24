import Link from 'next/link';
import { MessageSquare, Phone, UserRound } from 'lucide-react';
import { AppShell } from '@/components/shell';
import { ProviderAccessBoundary, ProviderPageIntro, ProviderSectionHeader, ProviderState } from '@/components/provider/workspace';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { getProviderContext } from '@/lib/provider';
import { ProviderMessageComposer } from './thread-client';
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
  const u = await requireUser('provider');
  const ctx = getProviderContext(u.id);
  if (!ctx) return null;
  const sp = await searchParams;

  const customers = db.prepare(`SELECT hc.*,hu.first_name,hu.last_name,hu.phone,hu.email,h.address,h.postcode,j.title last_job_title,
      ((SELECT COUNT(*) FROM contact_messages cm
        WHERE cm.homeowner_id=hc.homeowner_id AND cm.provider_id=hc.provider_id AND cm.contact_user_id=hc.contact_user_id
          AND cm.sender_id<>hc.contact_user_id AND cm.read_at IS NULL)
       + (SELECT COUNT(*) FROM messages jm
          JOIN jobs jj ON jj.id=jm.job_id AND jj.homeowner_id=hc.homeowner_id
          JOIN job_assignments ja ON ja.job_id=jm.job_id AND ja.provider_id=hc.provider_id AND ja.contact_user_id=hc.contact_user_id
          WHERE jm.recipient_id=hc.contact_user_id AND jm.sender_id=hc.homeowner_id AND jm.read_at IS NULL)) unread_count
    FROM homeowner_contacts hc
    JOIN users hu ON hu.id=hc.homeowner_id AND hu.role='homeowner'
    JOIN homeowner_profiles h ON h.user_id=hc.homeowner_id
    LEFT JOIN jobs j ON j.id=hc.last_job_id
    WHERE hc.provider_id=? AND hc.contact_user_id=? ORDER BY hc.updated_at DESC`).all(ctx.providerId, u.id) as any[];
  const requestedId = Number(sp.homeowner);
  const hasRequestedHomeowner = Boolean(sp.homeowner);
  const selected = hasRequestedHomeowner
    ? customers.find((customer) => Number.isSafeInteger(requestedId) && customer.homeowner_id === requestedId)
    : customers[0];
  const selectedId = selected?.homeowner_id;
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
          selected.homeowner_id,
          ctx.providerId,
          u.id,
          selected.homeowner_id,
          ctx.providerId,
          u.id,
          selected.homeowner_id,
          u.id,
          u.id,
          selected.homeowner_id,
        ) as ThreadMessage[]
    : [];
  const unreadCount = selected ? Number(selected.unread_count || 0) : 0;

  return (
    <AppShell role="provider" active="/pro/messages" title="Nachrichten" subtitle="Direkter Kundenkontakt">
      <ProviderPageIntro
        eyebrow="Kunden"
        title="Nachrichten"
        description="Direkte Gespräche mit Kunden, für die du als Ansprechpartner hinterlegt bist. Keine allgemeinen Leads, keine anonyme Inbox."
      />

      <ProviderAccessBoundary canManageJobs={ctx.canManageJobs} />

      {customers.length === 0 ? (
        <ProviderState
          icon={<MessageSquare size={21} />}
          title="Noch keine direkten Kontakte"
          description="Sobald dir eine Kontaktanfrage oder ein Auftrag zugewiesen wurde, kann daraus ein direkter Kundenkontakt entstehen."
        />
      ) : (
        <div className="provider-messages-layout">
          <section className="provider-message-list-pane" aria-label="Kundenkontakte">
            <ProviderSectionHeader title="Kunden" description={`${customers.length} ${customers.length === 1 ? 'Kontakt' : 'Kontakte'}`} />
            <div className="contact-list pro-contact-list">
              {customers.map((customer) => (
                <Link
                  key={customer.homeowner_id}
                  href={`/pro/messages?homeowner=${customer.homeowner_id}`}
                  className={selectedId === customer.homeowner_id ? 'contact-row selected' : 'contact-row'}
                  aria-current={selectedId === customer.homeowner_id ? 'page' : undefined}
                >
                  <div className="contact-avatar">{customer.first_name?.[0]}{customer.last_name?.[0]}</div>
                  <div className="grow">
                    <strong>{customer.first_name} {customer.last_name}</strong>
                    <small>{customer.address || customer.postcode}</small>
                    <p>{customer.last_job_title || customer.category || 'Hausservice'}</p>
                  </div>
                  {Number(customer.unread_count) > 0 && <span className={styles.unreadBadge} aria-label={`${customer.unread_count} ungelesene Nachrichten`}>{customer.unread_count > 99 ? '99+' : customer.unread_count}</span>}
                </Link>
              ))}
            </div>
          </section>

          <section className={`provider-message-thread ${styles.threadShell}`} aria-label={selected ? `Nachrichten mit ${selected.first_name} ${selected.last_name}` : 'Nachrichten'} data-message-thread="provider">
            {hasRequestedHomeowner && !selected ? (
              <div className="alert error" role="alert">Dieser Kundenkontakt ist nicht mehr verfügbar. Wähle einen Kontakt aus deiner Liste.</div>
            ) : selected ? <>
              <ProviderSectionHeader title={`${selected.first_name} ${selected.last_name}`} description={selected.address || selected.postcode} />
              <div className="contact-card pro-contact-card">
                <UserRound aria-hidden="true" />
                <div className="grow">
                  <strong>{selected.first_name} {selected.last_name}</strong>
                  <p>{selected.last_job_title ? `Letzter Auftrag: ${selected.last_job_title}` : 'Bestehender Kunde'}</p>
                  <small>Du bist als direkter Ansprechpartner hinterlegt.</small>
                </div>
                {selected.phone && <a className="icon-contact" href={`tel:${selected.phone}`} aria-label={`${selected.first_name} anrufen`}><Phone aria-hidden="true" /></a>}
              </div>

              <div className="chat pro-chat">
                {messages.length === 0 && (
                  <div className="contact-chat-intro">
                    <MessageSquare aria-hidden="true" />
                    <p>Schreibe eine erste Nachricht, wenn du Termin, Rückfrage oder nächste Arbeit abstimmen möchtest.</p>
                  </div>
                )}
                {messages.map((message) => (
                  <div className={message.sender_id === u.id ? 'msg mine' : 'msg'} key={`${message.source}-${message.id}`}>
                    <small>{message.sender_id === u.id ? 'Du' : selected.first_name}{message.source === 'job' && message.context_title ? ` · Auftrag: ${message.context_title}` : ''}</small>
                    <p className={styles.messageBody}>{message.body}</p>
                  </div>
                ))}
                <ProviderMessageComposer homeownerId={selected.homeowner_id} peerName={selected.first_name} unreadCount={unreadCount} />
              </div>
            </> : null}
          </section>
        </div>
      )}
    </AppShell>
  );
}
