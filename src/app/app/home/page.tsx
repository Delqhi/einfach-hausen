import Link from 'next/link';
import { House } from 'lucide-react';
import { AppShell } from '@/components/shell';
import { EHAppHeader, EHPanel, EHList, EHEmptyState, EHField, EHInput, EHSelect } from '@/design-system';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { addHouseAssetAction,completeMaintenanceTaskAction,saveHouseProfileAction } from '@/app/actions';
import { dateLabel } from '@/lib/format';
import { primaryProperty } from '@/lib/properties';

export default async function MyHome(){
  const u=await requireUser('homeowner'); const p=db.prepare('SELECT * FROM homeowner_profiles WHERE user_id=?').get(u.id) as any; const property=primaryProperty(u.id);
  const assets=property?db.prepare('SELECT * FROM house_assets WHERE property_id=? ORDER BY created_at DESC').all(property.id) as any[]:[];
  const tasks=property?db.prepare("SELECT * FROM maintenance_tasks WHERE property_id=? AND status='open' ORDER BY due_date LIMIT 8").all(property.id) as any[]:[];
  const appointments=db.prepare(`SELECT a.*,j.title,p.business_name FROM appointments a JOIN jobs j ON j.id=a.job_id JOIN provider_profiles p ON p.user_id=a.provider_id WHERE a.homeowner_id=? AND a.status='confirmed' ORDER BY a.start_at LIMIT 3`).all(u.id) as any[];
  const docs=db.prepare(`SELECT COUNT(*) c FROM documents d JOIN jobs j ON j.id=d.job_id WHERE j.homeowner_id=?`).get(u.id) as any;
  const invoiceCount=(db.prepare(`SELECT COUNT(*) c FROM invoices WHERE homeowner_id=?`).get(u.id) as {c:number}).c;
  const historyCount=property?(db.prepare(`SELECT COUNT(*) c FROM house_history_entries WHERE property_id=?`).get(property.id) as {c:number}).c:0;
  return <AppShell role="homeowner" active="/app/home" title="Mein Haus" subtitle="Deine digitale Hausakte">
    <EHAppHeader eyebrow="Digitale Hausakte" title="Mein Haus" text="Alles Wichtige zu deinem Zuhause an einem Ort." actions={<Link href="#technik" aria-label="Technik hinzufügen">Technik hinzufügen</Link>} />

    <section className="house-cover-card"><div className="house-cover-art"><House/><span className="house-roof-line"/></div><div className="house-cover-copy"><small>Zuhause</small><strong>{p?.address||'Adresse ergänzen'}</strong><span>{p?.postcode||'Hausprofil vervollständigen'}{p?.house_type?` · ${p.house_type}`:''}</span></div></section>

    <div className="house-menu">
      <EHPanel title="Gebäude & Räume">
        <p>{p?.build_year?`Baujahr ${p.build_year}`:'Hausdaten hinterlegen'}{p?.living_area?` · ${p.living_area} m²`:''}</p>
        <details><summary>Gebäude & Räume bearbeiten</summary><form action={saveHouseProfileAction}><EHField id="home-address" label="Adresse"><EHInput id="home-address" name="address" defaultValue={p?.address||''} placeholder="Straße, Hausnummer, Ort"/></EHField><EHField id="home-postcode" label="PLZ"><EHInput id="home-postcode" name="postcode" defaultValue={p?.postcode||''}/></EHField><EHField id="home-type" label="Haustyp"><EHSelect id="home-type" name="houseType" defaultValue={p?.house_type||''}><option value="">Bitte wählen</option><option value="Einfamilienhaus">Einfamilienhaus</option><option value="Doppelhaushälfte">Doppelhaushälfte</option><option value="Reihenhaus">Reihenhaus</option><option value="Mehrfamilienhaus">Mehrfamilienhaus</option><option value="Sonstiges">Sonstiges</option></EHSelect></EHField><EHField id="home-buildyear" label="Baujahr"><EHInput id="home-buildyear" name="buildYear" type="number" defaultValue={p?.build_year||''}/></EHField><EHField id="home-living" label="Wohnfläche m²"><EHInput id="home-living" name="livingArea" type="number" step="0.1" defaultValue={p?.living_area||''}/></EHField><EHField id="home-plot" label="Grundstück m²"><EHInput id="home-plot" name="plotArea" type="number" step="0.1" defaultValue={p?.plot_area||''}/></EHField><button>Hausprofil speichern</button></form></details>
      </EHPanel>
      <EHList label="Hausbereiche" items={[
        { id: 'technik', title: 'Technik & Geräte', text: `${assets.length} ${assets.length===1?'Eintrag':'Einträge'} hinterlegt`, href: '#technik' },
        { id: 'historie', title: 'Historie', text: `${historyCount} frühere Arbeiten dokumentiert`, href: '/app/home/history' },
        { id: 'dokumente', title: 'Dokumente & Rechnungen', text: `${docs.c+invoiceCount} Unterlagen in deiner Hausakte`, href: '/app/documents' },
        { id: 'jahr', title: 'Mein Jahr', text: `${tasks.length} offene Wartungspunkte`, href: '/app/year' },
        { id: 'verkauf', title: 'Verkauf & Bewertung', text: 'Wert speichern, Verkauf vorbereiten, passende Makler finden', href: '/app/home/sale' },
        { id: 'notizen', title: 'Notizen (bald)', text: 'Hauswissen und Hinweise zentral sammeln' },
      ]} />
    </div>

    <EHPanel title="Mein Jahr">
      <EHList label="Mein Jahr" items={[{ id: 'jahr-vorschau', title: tasks.length?`${tasks.length} Dinge stehen an`:'Alles im Plan', text: tasks[0]?`${tasks[0].title} · ${dateLabel(tasks[0].due_date)}`:'Neue Aufgaben und Wartungen kannst du jederzeit planen.', href: '/app/year' }]} />
    </EHPanel>

    <section id="technik"><EHPanel title="Technik & Ausstattung"><EHList label="Technik und Ausstattung" items={assets.map(a=>({ id: String(a.id), title: a.name, text: `${a.kind}${a.installed_year?` · ${a.installed_year}`:''} — ${a.details}` }))} />
    {assets.length===0&&<EHEmptyState title="Noch keine Technik hinterlegt" text="Mit einem ersten Eintrag kann dein Hausmeister Wartungen und Hauswissen besser einordnen." />}
    <form action={addHouseAssetAction} aria-label="Technik zur Hausakte hinzufügen"><EHField id="asset-kind" label="Bereich"><EHSelect id="asset-kind" name="kind" required defaultValue=""><option value="" disabled>Technik / Bereich</option><option value="heating">Heizung / Wärmepumpe</option><option value="pv">PV-Anlage</option><option value="storage">Batteriespeicher</option><option value="wallbox">Wallbox</option><option value="roof">Dach / Dachrinne</option><option value="windows">Fenster / Türen</option><option value="garden">Garten</option><option value="smarthome">Smart Home / Sicherheit</option></EHSelect></EHField><EHField id="asset-name" label="Bezeichnung"><EHInput id="asset-name" name="name" placeholder="z. B. Wärmepumpe Keller" required/></EHField><EHField id="asset-year" label="Installationsjahr (optional)"><EHInput id="asset-year" name="installedYear" type="number" placeholder="z. B. 2024"/></EHField><EHField id="asset-details" label="Modell / Hinweise (optional)"><EHInput id="asset-details" name="details" placeholder="z. B. Hersteller und Modell"/></EHField><button>Hinzufügen</button></form></EHPanel></section>

    {tasks.length>0&&<EHPanel title="Demnächst"><EHList label="Anstehende Wartungen" items={tasks.slice(0,4).map(t=>({ id: String(t.id), title: `${t.title} — fällig ${dateLabel(t.due_date)}`, text: t.category, action: <form action={completeMaintenanceTaskAction.bind(null,t.id)}><button aria-label="Als erledigt markieren">Erledigt</button></form> }))} /></EHPanel>}

    {appointments.length>0&&<EHPanel title="Nächste Termine"><EHList label="Nächste Termine" items={appointments.map(a=>({ id: String(a.id), title: a.title, text: `${a.business_name} · ${dateLabel(a.start_at)}`, href: `/app/jobs/${a.job_id}` }))} /></EHPanel>}
  </AppShell>;
}
