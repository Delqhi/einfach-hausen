import Link from 'next/link';
import { ArrowLeft, CalendarClock, CheckCircle2, Database, Mail, MessageCircle, Phone, Search, ShieldCheck, UserRoundPlus, UsersRound, Globe2 } from 'lucide-react';
import { requireAdmin } from '@/lib/admin-auth';
import { CRM_LEAD_TYPES, CRM_PERMISSIONS, CRM_SOURCES, CRM_STATUSES, crmCategories, crmStats, listCrmLeads, syncCrmLifecycle } from '@/lib/crm';
import { addCrmLeadAction, syncBusinessResearchAction, updateCrmLeadAction } from './actions';

const labels: Record<string, string> = {
  collected: 'Gesammelt',
  contact_ready: 'Kontakt bereit',
  contacted: 'Kontaktiert',
  replied: 'Geantwortet',
  qualified: 'Qualifiziert',
  invited: 'Eingeladen',
  converted: 'Konvertiert',
  not_interested: 'Kein Interesse',
  invalid: 'Ungültig',
  do_not_contact: 'Nicht kontaktieren',
  unknown: 'Ungeklärt',
  allowed: 'Erlaubt',
  consented: 'Einwilligung',
  denied: 'Nicht erlaubt',
  provider: 'Handwerker / Partner',
  homeowner: 'Eigentümer',
  public_intent: 'Öffentliches Bedarfssignal',
  property: 'Objektchance',
  other: 'Sonstiger Lead',
  business_research: 'SIN Business Research',
  business_research_intent: 'Öffentliches Intent-Signal',
  business_research_property: 'Offene Gebäudedaten',
  website: 'Website',
  referral: 'Empfehlung',
  facebook_group: 'Facebook-Gruppe',
  forum: 'Forum',
  community: 'Community',
  campaign: 'Kampagne',
  manual: 'Manuell',
  existing_customer: 'Bestandskunde'
};

const compact = (n: number) => new Intl.NumberFormat('de-DE', { notation: n > 9999 ? 'compact' : 'standard', maximumFractionDigits: 1 }).format(n);

export default async function CrmPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await requireAdmin();
  const sp = await searchParams;
  const page = Number(sp.page || 1) || 1;
  syncCrmLifecycle();
  const stats = crmStats();
  const result = listCrmLeads({ q: sp.q, status: sp.status, type: sp.type, category: sp.category, followup: sp.followup, page, limit: 60 });
  const categories = crmCategories();

  return (
    <main className="min-h-screen bg-[#faf8f4] px-4 py-8 text-[#10222a] md:px-8">
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-[#e4e2dc] pb-6">
          <div>
            <Link href="/admin" className="mb-2.5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#105258] hover:text-[#0b3a3f]">
              <ArrowLeft size={14} /> Zurück zur Betriebsverwaltung
            </Link>
            <h1 className="text-3xl font-black tracking-[-0.03em] text-[#10222a]">Leads &amp; Outreach CRM</h1>
            <p className="mt-1 text-sm text-[#4b5b60]">Pipeline für Handwerkspartner, Eigentümer-Anfragen und Marktpotenziale.</p>
          </div>
          <form action={syncBusinessResearchAction}>
            <button className="inline-flex items-center gap-2 rounded-xl bg-[#105258] px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#0d474d] transition-colors">
              <Database size={16} /> Research-Daten synchronisieren
            </button>
          </form>
        </header>

        {(sp.sync || sp.created || sp.updated || sp.error) && (
          <div className={`mb-6 rounded-xl border px-5 py-3.5 text-sm ${sp.error ? 'border-red-200 bg-red-50 text-red-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>
            {sp.error ? (sp.error === 'contact-permission' ? 'Kontaktaktionen erfordern ausdrückliche Freigabe. „Nicht kontaktieren“ darf keinen Folgetermin haben.' : 'Aktion fehlgeschlagen. Bitte Eingaben prüfen.') : sp.sync ? `${sp.sync} neue Datensätze importiert, ${sp.updated || 0} aktualisiert.` : sp.updated ? 'Lead aktualisiert.' : 'Lead erfolgreich angelegt.'}
          </div>
        )}

        <section className="mb-6 grid grid-cols-2 gap-3.5 md:grid-cols-3 xl:grid-cols-6">
          {[
            ['Gesamt', stats.total, UsersRound],
            ['E-Mail', stats.email, Mail],
            ['Telefon', stats.phone, Phone],
            ['Fällig', stats.dueFollowUps, CalendarClock],
            ['Social', stats.social, MessageCircle],
            ['Antworten', (stats.byStatus.find(x => x.status === 'replied')?.count || 0), CheckCircle2]
          ].map(([label, value, Icon]: any) => (
            <article key={label} className="rounded-2xl border border-[#e4e2dc] bg-white p-4.5 shadow-[0_1px_3px_rgba(16,34,42,0.04)]">
              <Icon size={17} className="mb-4 text-[#105258]" />
              <div className="text-2xl font-black text-[#10222a] tracking-tight">{compact(value)}</div>
              <div className="mt-1 text-[11px] font-bold uppercase tracking-wider text-[#5f6e75]">{label}</div>
            </article>
          ))}
        </section>

        <section className="mb-6 rounded-2xl border border-[#e4e2dc] bg-white p-4 shadow-sm">
          <form method="get" className="grid gap-3 md:grid-cols-[minmax(240px,1fr)_170px_170px_200px_170px_auto]">
            <label className="relative">
              <Search size={16} className="absolute left-3.5 top-3.5 text-[#5f6e75]" />
              <input name="q" defaultValue={sp.q || ''} placeholder="Firma, Ort, PLZ, E-Mail …" className="w-full rounded-xl border border-[#e4e2dc] bg-[#faf8f4] py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#105258]" />
            </label>
            <select name="type" defaultValue={sp.type || ''} className="rounded-xl border border-[#e4e2dc] bg-white px-3 py-2 text-sm text-[#10222a]">
              <option value="">Alle Leadtypen</option>
              {CRM_LEAD_TYPES.map(x => <option key={x} value={x}>{labels[x] || x}</option>)}
            </select>
            <select name="status" defaultValue={sp.status || ''} className="rounded-xl border border-[#e4e2dc] bg-white px-3 py-2 text-sm text-[#10222a]">
              <option value="">Alle Status</option>
              {CRM_STATUSES.map(x => <option key={x} value={x}>{labels[x] || x}</option>)}
            </select>
            <select name="category" defaultValue={sp.category || ''} className="rounded-xl border border-[#e4e2dc] bg-white px-3 py-2 text-sm text-[#10222a]">
              <option value="">Alle Gewerke</option>
              {categories.map(x => <option key={x.category} value={x.category}>{x.category} · {compact(x.count)}</option>)}
            </select>
            <select name="followup" defaultValue={sp.followup || ''} className="rounded-xl border border-[#e4e2dc] bg-white px-3 py-2 text-sm text-[#10222a]">
              <option value="">Alle Folgetermine</option>
              <option value="due">Heute / überfällig</option>
              <option value="scheduled">Geplant</option>
              <option value="none">Ohne Folgetermin</option>
            </select>
            <button className="rounded-xl bg-[#eef5f5] px-5 py-2.5 text-sm font-extrabold text-[#105258] hover:bg-[#dcebec] transition-colors">
              Filtern
            </button>
          </form>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <section className="overflow-hidden rounded-2xl border border-[#e4e2dc] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[#e4e2dc] px-6 py-4 bg-[#faf8f4]">
              <div>
                <strong className="text-sm font-black text-[#10222a]">{result.total.toLocaleString('de-DE')} Leads</strong>
                <p className="text-xs text-[#5f6e75]">Seite {result.page} von {result.pages}</p>
              </div>
              <div className="flex gap-2">
                {result.page > 1 && (
                  <Link className="rounded-lg border border-[#e4e2dc] bg-white px-3 py-1.5 text-xs font-bold text-[#10222a] hover:bg-[#f3f6f5]" href={{ pathname: '/admin/crm', query: { ...sp, page: String(result.page - 1) } }}>
                    Zurück
                  </Link>
                )}
                {result.page < result.pages && (
                  <Link className="rounded-lg border border-[#e4e2dc] bg-white px-3 py-1.5 text-xs font-bold text-[#10222a] hover:bg-[#f3f6f5]" href={{ pathname: '/admin/crm', query: { ...sp, page: String(result.page + 1) } }}>
                    Weiter
                  </Link>
                )}
              </div>
            </div>
            <div className="divide-y divide-[#edf0ed]">
              {result.rows.map(lead => {
                const canContact = ['allowed', 'consented'].includes(lead.contact_permission) && lead.status !== 'do_not_contact';
                return (
                  <article key={lead.id} className="grid gap-4 p-5 lg:grid-cols-[minmax(260px,1fr)_minmax(280px,1fr)]">
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${lead.lead_type === 'provider' ? 'bg-[#eef5f5] text-[#105258]' : 'bg-[#eef1ff] text-[#45569d]'}`}>
                          {labels[lead.lead_type] || lead.lead_type}
                        </span>
                        <span className="rounded-full bg-[#f4ebdd] px-2.5 py-0.5 text-[10px] font-bold text-[#10222a]">
                          {labels[lead.status] || lead.status}
                        </span>
                      </div>
                      <h2 className="truncate text-base font-black text-[#10222a]">{lead.company_name || lead.name}</h2>
                      {lead.category && <p className="mt-1 text-xs font-semibold text-[#4b5b60]">{lead.category}</p>}
                      <p className="mt-1 text-xs text-[#5f6e75]">{[lead.address, lead.postcode, lead.locality].filter(Boolean).join(' · ') || 'Ort nicht hinterlegt'}</p>
                      
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs">
                        {lead.email && (canContact ? (
                          <a className="inline-flex items-center gap-1.5 font-semibold text-[#105258] hover:underline" href={`mailto:${lead.email}`}><Mail size={13} />{lead.email}</a>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[#5f6e75]"><Mail size={13} />{lead.email}</span>
                        ))}
                        {lead.phone && (canContact ? (
                          <a className="inline-flex items-center gap-1.5 font-semibold text-[#105258] hover:underline" href={`tel:${lead.phone}`}><Phone size={13} />{lead.phone}</a>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[#5f6e75]"><Phone size={13} />{lead.phone}</span>
                        ))}
                        {lead.website && (
                          <a className="inline-flex items-center gap-1.5 font-semibold text-[#105258] hover:underline" href={lead.website} target="_blank" rel="noreferrer"><Globe2 size={13} />Webseite</a>
                        )}
                        {lead.profile_url && (
                          <a className="inline-flex items-center gap-1.5 font-semibold text-[#105258] hover:underline" href={lead.profile_url} target="_blank" rel="noreferrer"><MessageCircle size={13} />Profil</a>
                        )}
                      </div>
                      <p className="mt-3 text-[11px] text-[#5f6e75]">Quelle: {labels[lead.source_type] || lead.source_type}{lead.source_detail ? ` · ${lead.source_detail}` : ''}</p>
                      {lead.next_follow_up_at && (
                        <p className="mt-1 text-[11px] font-bold text-[#a84d29]">Folgekontakt: {new Date(`${lead.next_follow_up_at}T12:00:00`).toLocaleDateString('de-DE')}</p>
                      )}
                      {lead.converted_user_id && (
                        <p className="mt-1 text-[11px] font-bold text-[#105258]">✓ Plattformkonto aktiv</p>
                      )}
                    </div>
                    
                    <form action={updateCrmLeadAction.bind(null, lead.id)} className="grid gap-2 rounded-xl bg-[#faf8f4] p-3.5 border border-[#e4e2dc] md:grid-cols-2">
                      <label className="text-[11px] font-bold text-[#4b5b60]">Status
                        <select name="status" defaultValue={lead.status} className="mt-1 w-full rounded-lg border border-[#e4e2dc] bg-white p-2 text-xs">
                          {CRM_STATUSES.map(x => <option key={x} value={x}>{labels[x] || x}</option>)}
                        </select>
                      </label>
                      <label className="text-[11px] font-bold text-[#4b5b60]">Kontaktfreigabe
                        <select name="permission" defaultValue={lead.contact_permission} className="mt-1 w-full rounded-lg border border-[#e4e2dc] bg-white p-2 text-xs">
                          {CRM_PERMISSIONS.map(x => <option key={x} value={x}>{labels[x] || x}</option>)}
                        </select>
                      </label>
                      <label className="text-[11px] font-bold text-[#4b5b60]">Quelle
                        <select name="sourceType" defaultValue={lead.source_type} className="mt-1 w-full rounded-lg border border-[#e4e2dc] bg-white p-2 text-xs">
                          {CRM_SOURCES.map(x => <option key={x} value={x}>{labels[x] || x}</option>)}
                        </select>
                      </label>
                      <label className="text-[11px] font-bold text-[#4b5b60]">Quellendetail
                        <input name="sourceDetail" defaultValue={lead.source_detail || ''} className="mt-1 w-full rounded-lg border border-[#e4e2dc] bg-white p-2 text-xs" />
                      </label>
                      <label className="text-[11px] font-bold text-[#4b5b60]">Folgekontakt
                        <input name="nextFollowUpAt" type="date" defaultValue={lead.next_follow_up_at || ''} disabled={lead.status === 'do_not_contact' || lead.contact_permission === 'do_not_contact'} className="mt-1 w-full rounded-lg border border-[#e4e2dc] bg-white p-2 text-xs disabled:opacity-50" />
                      </label>
                      <label className="text-[11px] font-bold text-[#4b5b60]">Kanal
                        <select name="channel" defaultValue="" className="mt-1 w-full rounded-lg border border-[#e4e2dc] bg-white p-2 text-xs">
                          <option value="">Keiner</option>
                          <option value="email">E-Mail</option>
                          <option value="phone">Telefon</option>
                          <option value="social">Social</option>
                          <option value="website">Website</option>
                          <option value="other">Sonstiges</option>
                        </select>
                      </label>
                      <label className="text-[11px] font-bold text-[#4b5b60] col-span-full">Notiz
                        <input name="notes" defaultValue={lead.notes || ''} className="mt-1 w-full rounded-lg border border-[#e4e2dc] bg-white p-2 text-xs" placeholder="z. B. Rückruf vereinbart" />
                      </label>
                      <button className="col-span-full mt-1 rounded-lg bg-[#105258] px-3 py-2 text-xs font-bold text-white hover:bg-[#0d474d] transition-colors">
                        Änderungen speichern
                      </button>
                    </form>
                  </article>
                );
              })}
              {result.rows.length === 0 && (
                <div className="p-12 text-center text-sm text-[#5f6e75]">Keine Leads für die gewählten Filter vorhanden.</div>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-[#e4e2dc] bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-start gap-3">
                <div className="rounded-xl bg-[#eef5f5] p-2 text-[#105258]">
                  <UserRoundPlus size={18} />
                </div>
                <div>
                  <h2 className="font-black text-[#10222a]">Lead erfassen</h2>
                  <p className="text-xs leading-relaxed text-[#5f6e75]">Eigentümer-Anfrage, Partnerkontakt oder Empfehlung anlegen.</p>
                </div>
              </div>
              <form action={addCrmLeadAction} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <select name="leadType" defaultValue="provider" className="rounded-lg border border-[#e4e2dc] p-2 text-xs">
                    {CRM_LEAD_TYPES.map(x => <option key={x} value={x}>{labels[x]}</option>)}
                  </select>
                  <select name="sourceType" defaultValue="manual" className="rounded-lg border border-[#e4e2dc] p-2 text-xs">
                    {CRM_SOURCES.map(x => <option key={x} value={x}>{labels[x] || x}</option>)}
                  </select>
                </div>
                <input name="name" required minLength={2} className="w-full rounded-lg border border-[#e4e2dc] p-2.5 text-xs" placeholder="Name / Ansprechpartner" />
                <input name="companyName" className="w-full rounded-lg border border-[#e4e2dc] p-2.5 text-xs" placeholder="Firma (optional)" />
                <input name="category" className="w-full rounded-lg border border-[#e4e2dc] p-2.5 text-xs" placeholder="Gewerk / Kernkompetenz" />
                <div className="grid grid-cols-2 gap-2">
                  <input name="postcode" className="rounded-lg border border-[#e4e2dc] p-2.5 text-xs" placeholder="PLZ" />
                  <input name="locality" className="rounded-lg border border-[#e4e2dc] p-2.5 text-xs" placeholder="Ort" />
                </div>
                <input type="hidden" name="country" value="DE" />
                <input name="email" type="email" className="w-full rounded-lg border border-[#e4e2dc] p-2.5 text-xs" placeholder="E-Mail" />
                <input name="phone" className="w-full rounded-lg border border-[#e4e2dc] p-2.5 text-xs" placeholder="Telefon" />
                <input name="website" className="w-full rounded-lg border border-[#e4e2dc] p-2.5 text-xs" placeholder="Website" />
                <input name="profileUrl" className="w-full rounded-lg border border-[#e4e2dc] p-2.5 text-xs" placeholder="Profil URL" />
                <input name="sourceDetail" className="w-full rounded-lg border border-[#e4e2dc] p-2.5 text-xs" placeholder="Quelle / Kampagne" />
                <label className="block text-[11px] font-bold text-[#4b5b60]">Folgekontakt
                  <input name="nextFollowUpAt" type="date" className="mt-1 w-full rounded-lg border border-[#e4e2dc] p-2 text-xs" />
                </label>
                <select name="permission" defaultValue="unknown" className="w-full rounded-lg border border-[#e4e2dc] p-2 text-xs">
                  {CRM_PERMISSIONS.map(x => <option key={x} value={x}>{labels[x] || x}</option>)}
                </select>
                <textarea name="notes" rows={3} className="w-full rounded-lg border border-[#e4e2dc] p-2.5 text-xs" placeholder="Interesse, Status, nächste Vereinbarung …" />
                <button className="w-full rounded-xl bg-[#105258] px-4 py-3 text-xs font-black text-white hover:bg-[#0d474d] transition-colors">
                  Lead speichern
                </button>
              </form>
            </section>

            <section className="rounded-2xl border border-[#e4e2dc] bg-[#eef5f5] p-5">
              <div className="flex gap-3">
                <ShieldCheck size={20} className="shrink-0 text-[#105258]" />
                <div>
                  <strong className="text-sm font-bold text-[#10222a]">Datenschutz &amp; Kontaktfreigabe</strong>
                  <p className="mt-1 text-xs leading-relaxed text-[#4b5b60]">
                    Jeder Datensatz trennt Recherche von Outreach. Direktkontakte sind nur bei expliziter Erlaubnis zulässig.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#e4e2dc] bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-black text-[#10222a]">Pipeline-Verteilung</h3>
              <div className="space-y-2">
                {stats.byStatus.map(x => (
                  <div key={x.status} className="flex items-center justify-between text-xs py-1 border-b border-[#edf0ed] last:border-0">
                    <span className="text-[#4b5b60]">{labels[x.status] || x.status}</span>
                    <strong className="text-[#10222a] font-bold">{x.count.toLocaleString('de-DE')}</strong>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
