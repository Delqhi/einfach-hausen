import { Cpu, DoorOpen, Hammer, HardHat, Home, Leaf, Lock, Sparkles, Wrench, Zap } from 'lucide-react';
import { EHContactDirectory, EHInbox, EHContactGroup, EHConversation, EHWorkflowForm, EHSubmitButton, EHFormFeedback, EHAppHeader, EHEmptyState, EHErrorState, EHCallout, EHButton, EHField, EHSelect, EHInput } from '@/design-system';
import { AppShell } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { updateContactCategoryAction } from '@/app/actions';
import { groupContactsByCategory, normalizeContactCategory, STANDARD_CONTACT_CATEGORIES } from '@/lib/contact-categories';
import { OwnerMessageComposer } from './thread-client';

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
  const rawQuery = typeof sp.q === 'string' ? sp.q : '';
  const query = rawQuery.trim().toLowerCase();
  const activeArea = typeof sp.bereich === 'string' ? sp.bereich : '';
  const directoryContacts = contacts.filter((contact: any) => {
    const area = normalizeContactCategory(contact.category || '');
    if (activeArea && area !== activeArea) return false;
    if (!query) return true;
    const haystack = `${contact.first_name || ''} ${contact.last_name || ''} ${contact.business_name || ''} ${contact.job_title || ''} ${contact.last_job_title || ''} ${area}`.toLowerCase();
    return haystack.includes(query);
  });
  const directoryGrouped = groupContactsByCategory(directoryContacts);
  const areaMeta: Record<string, { hint: string; icon: React.ReactNode }> = {
    'Haus & Allgemein': { hint: 'z. B. Hausmeister & allgemeine Fragen', icon: <Home aria-hidden="true" /> },
    'Garten & Außen': { hint: 'z. B. Rasen mähen oder Hecke schneiden', icon: <Leaf aria-hidden="true" /> },
    'Dach & Fassade': { hint: 'z. B. Dach undicht oder Fassade beschädigt', icon: <HardHat aria-hidden="true" /> },
    'Elektro': { hint: 'z. B. Stromausfall oder Steckdose defekt', icon: <Zap aria-hidden="true" /> },
    'Sanitär & Heizung': { hint: 'z. B. Wasserhahn undicht oder Heizung ohne Wärme', icon: <Wrench aria-hidden="true" /> },
    'Fenster & Türen': { hint: 'z. B. Fenster klemmt oder Tür schließt nicht', icon: <DoorOpen aria-hidden="true" /> },
    'Reinigung & Pflege': { hint: 'z. B. Fensterreinigung oder Grundreinigung', icon: <Sparkles aria-hidden="true" /> },
    'Technik & Energie': { hint: 'z. B. PV-Anlage oder Wallbox', icon: <Cpu aria-hidden="true" /> },
    'Sicherheit & Schloss': { hint: 'z. B. Schloss klemmt oder Einbruchschutz', icon: <Lock aria-hidden="true" /> },
    'Renovierung & Innenausbau': { hint: 'z. B. Möbelaufbau oder kleine Reparaturen', icon: <Hammer aria-hidden="true" /> },
  };
  const areaCounts = new Map<string, number>();
  for (const contact of contacts as any[]) {
    const area = normalizeContactCategory((contact as any).category || '');
    areaCounts.set(area, (areaCounts.get(area) || 0) + 1);
  }
  const directoryCategories = (Object.keys(areaMeta) as string[]).map((area) => ({
    id: area,
    title: area,
    count: areaCounts.get(area) || 0,
    hint: areaMeta[area].hint,
    href: activeArea === area ? '/app/messages' : `/app/messages?bereich=${encodeURIComponent(area)}`,
    active: activeArea === area,
    icon: areaMeta[area].icon,
  }));

  return <AppShell role="homeowner" active="/app/messages" title="Ansprechpartner" subtitle="Dein persönliches Netzwerk fürs Haus">
    <EHAppHeader eyebrow="Netzwerk" title="Meine Ansprechpartner" text="Nach Bereichen sortiert, damit du sofort weißt, wen du für Garten, Dach, Elektro oder andere Themen ansprechen kannst." />
    {contacts.length === 0 ? <EHEmptyState title="Noch keine Ansprechpartner" text="Wenn du zuerst nur mit einem passenden Menschen sprechen möchtest, startest du beim Hausmeister und wählst bewusst „Ansprechpartner finden“." action={<EHButton href="/app/hausmeister" arrow>Ansprechpartner finden</EHButton>} /> : <>
      <EHContactDirectory
        totalHref="/app/messages"
        totalLabel={`Alle Ansprechpartner · ${contacts.length} in deinem Netzwerk`}
        search={{ action: '/app/messages', name: 'q', defaultValue: rawQuery, placeholder: 'Suche nach Dienstleister oder Kategorie …' }}
        categories={directoryCategories}
        finder={{ title: 'Ansprechpartner finden', text: 'Noch kein passender Kontakt? Starte beim Hausmeister – wir vermitteln den passenden Betrieb.', href: '/app/hausmeister', label: 'Anliegen beschreiben' }}
        listTitle="Meine Ansprechpartner"
        listAllHref="/app/messages"
        list={<>{directoryGrouped.length === 0 ? <EHEmptyState title="Keine Treffer" text="Für diese Suche gibt es in deinen Ansprechpartnern keinen Treffer." /> : directoryGrouped.map(([category, rows]) => <EHContactGroup key={category} title={category} contacts={(rows as any[]).map((contact: any) => ({ id: String(contact.contact_user_id), href: `/app/messages?contact=${contact.contact_user_id}`, name: `${contact.first_name} ${contact.last_name}`, detail: `${contact.job_title || 'Ansprechpartner'} · ${contact.business_name}${contact.last_job_title ? ` · ${contact.last_job_title}` : ''}`, active: contact.contact_user_id === selectedId, unread: Number(contact.unread_count || 0) }))} />)}</>}
      />
      {hasRequestedContact && !selected && <EHErrorState text="Dieser Ansprechpartner ist nicht mehr verfügbar. Wähle einen Kontakt aus deiner Liste." />}
      <EHInbox contacts={grouped.map(([category,rows])=><EHContactGroup key={category} title={category} contacts={rows.map((contact:any)=>({id:String(contact.contact_user_id),href:`/app/messages?contact=${contact.contact_user_id}`,name:`${contact.first_name} ${contact.last_name}`,detail:`${contact.job_title||'Ansprechpartner'} · ${contact.business_name}${contact.last_job_title?` · ${contact.last_job_title}`:''}`,active:contact.contact_user_id===selectedId,unread:Number(contact.unread_count||0)}))}/>)}>
        {selected&&<EHConversation role="owner" name={`${selected.first_name} ${selected.last_name}`} detail={`${selected.job_title||'Ansprechpartner'} · ${selected.business_name} · ${selectedCategory}`} phone={selected.phone}
          messages={messages.map(message=>({id:`${message.source}-${message.id}`,mine:message.sender_id===u.id,author:`${message.sender_id===u.id?'Du':selected.first_name}${message.source==='job'&&message.context_title?` · Auftrag: ${message.context_title}`:''}`,body:message.body}))}
          composer={<OwnerMessageComposer contactUserId={selected.contact_user_id} peerName={selected.first_name} unreadCount={unreadCount}/>}
          settings={<>
            {sp.category==='saved'&&<EHFormFeedback kind="success">Bereich gespeichert.</EHFormFeedback>}
            <details><summary>Bereich ändern</summary><EHWorkflowForm action={updateContactCategoryAction.bind(null,selected.contact_user_id)}>
              <EHField id="contact-category" label="Standardbereich"><EHSelect id="contact-category" name="category" defaultValue={STANDARD_CONTACT_CATEGORIES.includes(selectedCategory as any)?selectedCategory:'Haus & Allgemein'}>{STANDARD_CONTACT_CATEGORIES.map(category=><option value={category} key={category}>{category}</option>)}</EHSelect></EHField>
              <EHField id="contact-custom" label="Eigener Bereich (optional)" hint="Ein eigener Bereich ersetzt den Standardbereich."><EHInput id="contact-custom" name="customCategory" aria-describedby="contact-custom-hint" maxLength={60} placeholder={STANDARD_CONTACT_CATEGORIES.includes(selectedCategory as any)?'z. B. Pool & Sauna':selectedCategory}/></EHField>
              <EHSubmitButton>Bereich speichern</EHSubmitButton>
            </EHWorkflowForm></details>
          </>}/>} 
      </EHInbox>
      {selected&&<EHCallout title="Bestehende Kundenbeziehung"><p>Dieser Kontakt bleibt Teil deiner Hausakte. Für direkte Folgearbeiten ist keine neue Partnervermittlung nötig.</p></EHCallout>}
    </>}
  </AppShell>;
}
