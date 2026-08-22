import Link from 'next/link';
import { MessageSquare, Phone, UserRound } from 'lucide-react';
import { AppShell } from '@/components/shell';
import { ProviderPageIntro, ProviderSectionHeader, ProviderState } from '@/components/provider/workspace';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { sendSavedContactMessageAction } from '@/app/actions';
import { getProviderContext } from '@/lib/provider';

export default async function Messages({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const u = await requireUser('provider');
  const ctx = getProviderContext(u.id);
  if (!ctx) return null;
  const sp = await searchParams;

  const customers = db.prepare(`SELECT hc.*,hu.first_name,hu.last_name,hu.phone,hu.email,h.address,h.postcode,j.title last_job_title
    FROM homeowner_contacts hc JOIN users hu ON hu.id=hc.homeowner_id JOIN homeowner_profiles h ON h.user_id=hc.homeowner_id LEFT JOIN jobs j ON j.id=hc.last_job_id
    WHERE hc.provider_id=? AND hc.contact_user_id=? ORDER BY hc.updated_at DESC`).all(ctx.providerId, u.id) as any[];
  const selectedId = Number(sp.homeowner) || customers[0]?.homeowner_id;
  const selected = customers.find((customer) => customer.homeowner_id === selectedId);
  const messages = selected
    ? db.prepare('SELECT * FROM contact_messages WHERE homeowner_id=? AND contact_user_id=? ORDER BY created_at').all(selected.homeowner_id, u.id) as any[]
    : [];

  return (
    <AppShell role="provider" active="/pro/messages" title="Nachrichten" subtitle="Direkter Kundenkontakt">
      <ProviderPageIntro
        eyebrow="Kunden"
        title="Nachrichten"
        description="Direkte Gespräche mit Kunden, für die du als Ansprechpartner hinterlegt bist. Keine allgemeinen Leads, keine anonyme Inbox."
      />

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
                >
                  <div className="contact-avatar">{customer.first_name?.[0]}{customer.last_name?.[0]}</div>
                  <div className="grow">
                    <strong>{customer.first_name} {customer.last_name}</strong>
                    <small>{customer.address || customer.postcode}</small>
                    <p>{customer.last_job_title || customer.category || 'Hausservice'}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {selected && (
            <section className="provider-message-thread" aria-label={`Nachrichten mit ${selected.first_name} ${selected.last_name}`}>
              <ProviderSectionHeader title={`${selected.first_name} ${selected.last_name}`} description={selected.address || selected.postcode} />
              <div className="contact-card pro-contact-card">
                <UserRound />
                <div className="grow">
                  <strong>{selected.first_name} {selected.last_name}</strong>
                  <p>{selected.last_job_title ? `Letzter Auftrag: ${selected.last_job_title}` : 'Bestehender Kunde'}</p>
                  <small>Du bist als direkter Ansprechpartner hinterlegt.</small>
                </div>
                {selected.phone && <a className="icon-contact" href={`tel:${selected.phone}`} aria-label={`${selected.first_name} anrufen`}><Phone /></a>}
              </div>

              <div className="chat pro-chat">
                {messages.length === 0 && (
                  <div className="contact-chat-intro">
                    <MessageSquare />
                    <p>Schreibe eine erste Nachricht, wenn du Termin, Rückfrage oder nächste Arbeit abstimmen möchtest.</p>
                  </div>
                )}
                {messages.map((message: any) => (
                  <div className={message.sender_id === u.id ? 'msg mine' : 'msg'} key={message.id}>
                    <small>{message.sender_id === u.id ? 'Du' : selected.first_name}</small>
                    <p>{message.body}</p>
                  </div>
                ))}
                <form action={sendSavedContactMessageAction.bind(null, u.id, selected.homeowner_id)} className="chat-form">
                  <label className="sr-only" htmlFor="provider-message-body">Nachricht</label>
                  <input id="provider-message-body" name="body" placeholder={`Nachricht an ${selected.first_name} …`} required />
                  <button aria-label="Nachricht senden">↗</button>
                </form>
              </div>
            </section>
          )}
        </div>
      )}
    </AppShell>
  );
}
