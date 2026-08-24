import { notFound } from 'next/navigation';
import {
  CalendarDays,
  FileText,
  MapPin,
  MessageCircle,
  MessageSquare,
  Phone,
  ReceiptText,
  ShieldCheck,
  UserRound,
  XCircle,
} from 'lucide-react';
import { AppShell } from '@/components/shell';
import {
  ProviderAccessBoundary,
  ProviderNextStep,
  ProviderSectionHeader,
  ProviderState,
} from '@/components/provider/workspace';
import { JobMedia } from '@/components/job-media';
import { mediaKindFromPath } from '@/lib/intake-media';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import {
  acceptContactRequestAction,
  assignJobContactAction,
  declineDispatchAction,
  markCompleteAction,
  markInProgressAction,
  sendMessageAction,
  sendSavedContactMessageAction,
  submitQuoteAction,
} from '@/app/actions';
import { dateLabel, euro, statusLabel } from '@/lib/format';
import { canAccessProviderJob, getProviderMembers } from '@/lib/provider';
import { DocumentForm } from './document-form';
import { InvoiceForm } from './invoice-form';
import { invoiceStatusLabel } from '@/lib/invoices';

export default async function ProJob({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const u = await requireUser('provider');
  const { id } = await params;
  const sp = await searchParams;
  const jobId = Number(id);
  const ctx = canAccessProviderJob(u.id, jobId);
  if (!ctx) notFound();

  const access = db.prepare(`SELECT d.status dispatch_status,d.distance_km,d.match_score,j.*,h.address,h.postcode homeowner_postcode,hu.first_name homeowner_first,hu.last_name homeowner_last,hu.phone homeowner_phone,(SELECT id FROM job_photos x WHERE x.job_id=j.id LIMIT 1) photo_id,(SELECT path FROM job_photos x WHERE x.job_id=j.id LIMIT 1) photo_path
    FROM job_dispatches d JOIN jobs j ON j.id=d.job_id JOIN homeowner_profiles h ON h.user_id=j.homeowner_id JOIN users hu ON hu.id=j.homeowner_id
    WHERE d.job_id=? AND d.provider_id=?`).get(jobId, ctx.providerId) as any;
  if (!access) notFound();

  const isContact = access.request_kind === 'contact';
  const quote = isContact
    ? null
    : db.prepare('SELECT * FROM quotes WHERE job_id=? AND provider_id=?').get(access.id, ctx.providerId) as any;
  const isAccepted = isContact
    ? access.dispatch_status === 'accepted'
    : quote?.status === 'accepted' || access.dispatch_status === 'accepted';

  if (!ctx.canManageJobs && !isAccepted) notFound();

  const assignment = isAccepted
    ? db.prepare(`SELECT a.*,u.first_name,u.last_name,u.phone,u.email,m.job_title FROM job_assignments a JOIN users u ON u.id=a.contact_user_id JOIN provider_members m ON m.user_id=a.contact_user_id WHERE a.job_id=?`).get(access.id) as any
    : null;

  if (!ctx.canManageJobs && assignment?.contact_user_id !== u.id) notFound();

  const members = ctx.canManageJobs ? getProviderMembers(ctx.providerId) : [];
  const prefs = db.prepare('SELECT * FROM provider_preferences WHERE provider_id=?').get(ctx.providerId) as any;
  const docs = !isContact && isAccepted
    ? db.prepare('SELECT * FROM documents WHERE job_id=? AND provider_id=? ORDER BY created_at DESC').all(access.id, ctx.providerId) as any[]
    : [];
  const invoices = !isContact && isAccepted
    ? db.prepare('SELECT * FROM invoices WHERE job_id=? AND provider_id=? ORDER BY created_at DESC').all(access.id, ctx.providerId) as any[]
    : [];
  const claim = !isContact && isAccepted
    ? db.prepare('SELECT * FROM claims WHERE job_id=?').get(access.id) as any
    : null;
  const messages = assignment?.contact_user_id === u.id
    ? (isContact
        ? db.prepare('SELECT * FROM contact_messages WHERE homeowner_id=? AND contact_user_id=? ORDER BY created_at').all(access.homeowner_id, u.id)
        : db.prepare('SELECT * FROM messages WHERE job_id=? ORDER BY created_at').all(access.id)) as any[]
    : [];
  const mine = assignment?.contact_user_id === u.id;

  return (
    <AppShell
      role="provider"
      active={isAccepted ? '/pro/orders' : '/pro'}
      title={isContact ? 'Kontaktanfrage' : isAccepted ? 'Auftrag' : 'Anfrage'}
      subtitle={access.category}
    >
      {sp.error && <div className="alert error" role="alert">{sp.error}</div>}

      <div className="detail-head pro-detail">
        <span className={`status ${access.status}`}>
          {isContact ? (isAccepted ? 'Verbunden' : 'Kontakt gesucht') : statusLabel(access.status)}
        </span>
        <h1>{access.title.replace(/^Ansprechpartner:\s*/, '')}</h1>
        <p>{access.description}</p>
        <div className="meta-line">
          <span><MapPin />{isAccepted && access.address ? access.address : access.postcode}</span>
          {!isContact && <span><CalendarDays />{dateLabel(access.preferred_date)}</span>}
        </div>
        {access.photo_id && (
          <JobMedia
            src={`/api/job-media/${access.photo_id}`}
            alt="Foto, Video oder Sprachnachricht zum Thema"
            kind={mediaKindFromPath(access.photo_path)}
          />
        )}
        {!isContact && (
          <div className="budget-line">
            <small>Richtpreis</small>
            <strong>
              {access.budget_min && access.budget_max
                ? `${euro(access.budget_min)} – ${euro(access.budget_max)}`
                : euro(access.budget_max)}
            </strong>
          </div>
        )}
      </div>

      <ProviderAccessBoundary canManageJobs={ctx.canManageJobs} />

      {!isAccepted && ctx.canManageJobs && access.status !== 'completed' && isContact && (
        <>
          <div className="contact-request-note">
            <MessageCircle />
            <div>
              <strong>Nur persönlicher Ansprechpartner gesucht</strong>
              <p>Der Eigentümer möchte zunächst einen fachlichen Menschen sprechen. Es wird noch kein Auftrag und kein Preis vereinbart.</p>
            </div>
          </div>
          <ProviderNextStep description="Konkreten Ansprechpartner auswählen und den Kontakt übernehmen.">
            <form action={acceptContactRequestAction.bind(null, access.id)} className="assign-form provider-primary-form">
              <label>
                Ansprechpartner
                <select name="contactUserId" defaultValue={u.id}>
                  {members.map((member) => (
                    <option key={member.user_id} value={member.user_id}>
                      {member.first_name} {member.last_name}{member.user_id === u.id ? ' · Ich' : ''} · {member.job_title || 'Ansprechpartner'}
                    </option>
                  ))}
                </select>
              </label>
              <button className="btn light">Kontakt übernehmen</button>
            </form>
          </ProviderNextStep>
          <form action={declineDispatchAction.bind(null, access.id)} className="decline-form">
            <button className="btn ghost pro-ghost wide"><XCircle size={16} />Kontaktanfrage ablehnen</button>
          </form>
        </>
      )}

      {!isAccepted && ctx.canManageJobs && access.status !== 'completed' && !isContact && (
        <>
          {access.urgency === 'emergency' && (
            <div className="pro-emergency-note" role="status">
              <strong>🚨 Notfallanfrage</strong>
              <p>
                {Number.isFinite(access.distance_km) ? `${access.distance_km.toFixed(1)} km entfernt · ` : ''}
                {prefs?.emergency_mode === '24_7' ? '24/7-Bereitschaft aktiv' : `deine Bereitschaft ${prefs?.emergency_start || '–'}–${prefs?.emergency_end || '–'} Uhr`}
                {prefs?.emergency_markup_bps ? ` · maximal ${(prefs.emergency_markup_bps / 100).toFixed(0)} % Notfallzuschlag` : ' · kein hinterlegter Notfallzuschlag'}.
                Gib im Angebot den tatsächlichen Gesamtpreis und den frühesten realistischen Termin an.
              </p>
            </div>
          )}
          <ProviderNextStep
            title={access.urgency === 'emergency' ? 'Notfall beantworten' : 'Nächster Schritt'}
            description="Preis, frühesten realistischen Termin und Leistungsumfang als Angebot senden."
          >
            <form action={submitQuoteAction.bind(null, access.id)} className="quote-form provider-primary-form">
              <label>Gesamtpreis (€)<input name="amount" type="number" min="1" required defaultValue={quote ? quote.amount / 100 : ''} /></label>
              <label>Verfügbar ab<input name="availableAt" type="datetime-local" defaultValue={quote?.available_at?.slice(0, 16) || ''} /></label>
              <label>Leistungsumfang<textarea name="message" rows={4} defaultValue={quote?.message || ''} placeholder="Leistung, Material, Entsorgung, Gewährleistung/Ausschlüsse …" required /></label>
              <button className="btn light wide">{quote ? 'Angebot aktualisieren' : 'Angebot senden'}</button>
            </form>
          </ProviderNextStep>
          {!quote && (
            <form action={declineDispatchAction.bind(null, access.id)} className="decline-form">
              <button className="btn ghost pro-ghost wide"><XCircle size={16} />Anfrage ablehnen</button>
            </form>
          )}
        </>
      )}

      {isAccepted && (
        <>
          <div className="alert success" role="status">
            <ShieldCheck /> {isContact ? 'Du bist mit dem Eigentümer verbunden. Noch kein Auftrag.' : `Kunde hat den Auftrag bei ${ctx.businessName} gebucht.`}
          </div>

          <ProviderSectionHeader
            title="Ansprechpartner"
            description="Diese Person ist für den Eigentümer sichtbar und betreut den Vorgang direkt."
          />
          <div className="contact-card pro-contact-card">
            <UserRound />
            <div className="grow">
              <strong>{assignment ? `${assignment.first_name} ${assignment.last_name}` : 'Noch nicht zugewiesen'}</strong>
              <p>{assignment?.job_title || 'Bitte Ansprechpartner auswählen'}</p>
              {assignment && (
                <small>
                  {isContact
                    ? 'Dieser Kontakt steht dem Eigentümer jetzt direkt für Fragen zur Verfügung.'
                    : 'Dieser Kontakt ist für den Kunden sichtbar und bleibt nach Abschluss gespeichert.'}
                </small>
              )}
            </div>
            {mine && <span className="status active">Du</span>}
          </div>

          {ctx.canManageJobs && !assignment && (
            <ProviderNextStep description="Einen konkreten Ansprechpartner festlegen, damit die weitere Bearbeitung eindeutig ist.">
              <form action={assignJobContactAction.bind(null, access.id)} className="assign-form provider-primary-form">
                <label>
                  {isContact ? 'Kontakt zuweisen' : 'Auftrag zuweisen'}
                  <select name="contactUserId" defaultValue={u.id}>
                    {members.map((member) => (
                      <option key={member.user_id} value={member.user_id}>
                        {member.first_name} {member.last_name}{member.user_id === u.id ? ' · Ich' : ''} · {member.job_title || 'Ansprechpartner'}
                      </option>
                    ))}
                  </select>
                </label>
                <button className="btn light">Ansprechpartner festlegen</button>
              </form>
            </ProviderNextStep>
          )}

          {ctx.canManageJobs && assignment && (
            <details className="provider-disclosure">
              <summary>Ansprechpartner ändern</summary>
              <form action={assignJobContactAction.bind(null, access.id)} className="assign-form">
                <label>
                  {isContact ? 'Kontakt zuweisen' : 'Auftrag zuweisen'}
                  <select name="contactUserId" defaultValue={assignment.contact_user_id}>
                    {members.map((member) => (
                      <option key={member.user_id} value={member.user_id}>
                        {member.first_name} {member.last_name}{member.user_id === u.id ? ' · Ich' : ''} · {member.job_title || 'Ansprechpartner'}
                      </option>
                    ))}
                  </select>
                </label>
                <button className="btn ghost pro-ghost">Zuweisung speichern</button>
              </form>
            </details>
          )}

          {mine && isContact && (
            <ProviderNextStep description="Eigentümer direkt anschreiben und die fachliche Frage klären.">
              <a className="provider-primary-action" href={`/pro/messages?homeowner=${access.homeowner_id}`}>
                Nachricht öffnen <MessageSquare size={16} />
              </a>
            </ProviderNextStep>
          )}

          {mine && !isContact && access.status === 'accepted' && (
            <ProviderNextStep description="Arbeit starten, sobald Termin und Ausführung mit dem Kunden abgestimmt sind.">
              <form action={markInProgressAction.bind(null, access.id)}>
                <button className="btn light">Arbeit starten</button>
              </form>
            </ProviderNextStep>
          )}

          {mine && !isContact && access.status === 'in_progress' && (
            <ProviderNextStep description="Auftrag abschließen, wenn die vereinbarte Leistung vollständig erledigt ist.">
              <form action={markCompleteAction.bind(null, access.id)}>
                <button className="btn light">Als erledigt markieren</button>
              </form>
            </ProviderNextStep>
          )}

          {mine && !isContact && access.status === 'completed' && (
            <ProviderNextStep description="Rechnung prüfen, erstellen und dem Eigentümer senden.">
              <InvoiceForm
                jobId={access.id}
                defaultAmount={quote?.amount || access.budget_max || 0}
                primary
                open
              />
            </ProviderNextStep>
          )}

          {mine && (
            <>
              <ProviderSectionHeader
                title="Kundenkontakt"
                description="Fragen und Terminabstimmung direkt mit dem Eigentümer klären."
              />
              <div className="direct-contact-actions">
                {!isContact && (
                  <a className="btn ghost pro-ghost" href={`/pro/messages?homeowner=${access.homeowner_id}`}>
                    <MessageSquare size={16} />Direkt schreiben
                  </a>
                )}
                {access.homeowner_phone && (
                  <a className="btn ghost pro-ghost" href={`tel:${access.homeowner_phone}`}>
                    <Phone size={16} />Anrufen
                  </a>
                )}
              </div>
              <div className="partner-job-note">
                <strong>{access.homeowner_first} {access.homeowner_last}</strong>
                <p>
                  {isContact
                    ? 'Du bist der persönliche Ansprechpartner für dieses Thema. Beantworte Fragen direkt. Falls daraus Arbeit entsteht, entscheidet der Kunde separat, ob ein Auftrag organisiert werden soll.'
                    : 'Du bist der persönliche Ansprechpartner. Stimme Termin und Rückfragen direkt mit dem Kunden ab. Einfach Hausen bleibt für Vermittlung, Hausakte und Servicefälle im Hintergrund verfügbar.'}
                </p>
              </div>

              <div className="chat pro-chat">
                {messages.length === 0 && (
                  <div className="contact-chat-intro">
                    <MessageSquare />
                    <p>Noch keine Nachricht in diesem Vorgang. Nutze den Kundenkontakt nur für konkrete Rückfragen oder Absprachen.</p>
                  </div>
                )}
                {messages.map((message: any) => (
                  <div className={message.sender_id === u.id ? 'msg mine' : 'msg'} key={message.id}>
                    <small>{message.sender_id === u.id ? 'Du' : access.homeowner_first}</small>
                    <p>{message.body}</p>
                  </div>
                ))}
                <form
                  action={isContact
                    ? sendSavedContactMessageAction.bind(null, u.id, access.homeowner_id)
                    : sendMessageAction.bind(null, access.id, access.homeowner_id)}
                  className="chat-form"
                >
                  <label className="sr-only" htmlFor="provider-job-message">Nachricht</label>
                  <input id="provider-job-message" name="body" placeholder="Nachricht an Kunden …" required />
                  <button aria-label="Nachricht senden">↗</button>
                </form>
              </div>
            </>
          )}

          {claim && (
            <div className="claim-notice pro-claim" role="status">
              <div>
                <strong>Servicefall · {statusLabel(claim.status)}</strong>
                <p>{claim.description}</p>
                {claim.admin_note && <small>Plattform-Rückmeldung: {claim.admin_note}</small>}
              </div>
            </div>
          )}

          {mine && !isContact && (
            <>
              <ProviderSectionHeader
                title="Rechnungen"
                description="Rechnungen bleiben am Auftrag und in der Hausakte nachvollziehbar."
              />
              {invoices.length > 0 ? (
                <div className="stack pro-doc-list">
                  {invoices.map((invoice) => (
                    <a key={invoice.id} href={`/pro/invoices/${invoice.id}`}>
                      <strong>{invoice.invoice_number} · {euro(invoice.total_gross)}</strong>
                      <small>{invoiceStatusLabel(invoice.status)} · fällig {dateLabel(invoice.due_date)}</small>
                    </a>
                  ))}
                </div>
              ) : (
                <ProviderState
                  compact
                  icon={<ReceiptText size={20} />}
                  title="Noch keine Rechnung"
                  description="Erstelle die Rechnung, sobald die Leistung und der abzurechnende Umfang feststehen."
                />
              )}
              {access.status !== 'completed' && (
                <InvoiceForm
                  jobId={access.id}
                  defaultAmount={quote?.amount || access.budget_max || 0}
                />
              )}

              <ProviderSectionHeader
                title="Weitere Dokumente"
                description="Leistungsnachweise, Garantien und weitere Unterlagen zum Auftrag."
              />
              {docs.length > 0 ? (
                <div className="stack pro-doc-list">
                  {docs.map((document) => (
                    <a key={document.id} href={`/api/documents/${document.id}`} target="_blank" rel="noreferrer">
                      <strong>{document.title}</strong>
                      <small>{document.kind}</small>
                    </a>
                  ))}
                </div>
              ) : (
                <ProviderState
                  compact
                  icon={<FileText size={20} />}
                  title="Noch keine weiteren Dokumente"
                  description="Leistungsnachweise oder Garantien kannst du bei Bedarf direkt am Auftrag ergänzen."
                />
              )}
              <DocumentForm jobId={access.id} />
            </>
          )}
        </>
      )}
    </AppShell>
  );
}
