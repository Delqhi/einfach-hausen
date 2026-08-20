import Link from 'next/link';
import { CalendarDays,CheckCircle2,FileText,House,Plus,SolarPanel,Wrench } from 'lucide-react';
import { AppShell,SectionTitle } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { addHouseAssetAction,completeMaintenanceTaskAction,saveHouseProfileAction } from '@/app/actions';
import { dateLabel } from '@/lib/format';

export default async function MyHome(){
  const u=await requireUser('homeowner'); const p=db.prepare('SELECT * FROM homeowner_profiles WHERE user_id=?').get(u.id) as any;
  const assets=db.prepare('SELECT * FROM house_assets WHERE homeowner_id=? ORDER BY created_at DESC').all(u.id) as any[];
  const tasks=db.prepare("SELECT * FROM maintenance_tasks WHERE homeowner_id=? AND status='open' ORDER BY due_date LIMIT 12").all(u.id) as any[];
  const appointments=db.prepare(`SELECT a.*,j.title,p.business_name FROM appointments a JOIN jobs j ON j.id=a.job_id JOIN provider_profiles p ON p.user_id=a.provider_id WHERE a.homeowner_id=? AND a.status='confirmed' ORDER BY a.start_at LIMIT 3`).all(u.id) as any[];
  const docs=db.prepare(`SELECT COUNT(*) c FROM documents d JOIN jobs j ON j.id=d.job_id WHERE j.homeowner_id=?`).get(u.id) as any;
  return <AppShell role="homeowner" active="/app/home">
    <div className="home-hero"><House/><div><h1>Meine Hausakte</h1><p>{p?.address||p?.postcode||'Hausprofil vervollständigen'} · {p?.house_type||'Eigenheim'}</p></div></div>
    <div className="home-stats"><Link href="/app/calendar"><CalendarDays/><b>{appointments.length}</b><span>Nächste Termine</span></Link><Link href="/app/documents"><FileText/><b>{docs.c}</b><span>Dokumente</span></Link><Link href="/app/plans"><Wrench/><b>{tasks.length}</b><span>Wartungspunkte</span></Link></div>

    <SectionTitle>Objektprofil</SectionTitle><form action={saveHouseProfileAction} className="house-profile-form"><label>Adresse<input name="address" defaultValue={p?.address||''} placeholder="Straße, Hausnummer, Ort"/></label><div className="two"><label>PLZ<input name="postcode" defaultValue={p?.postcode||''}/></label><label>Haustyp<select name="houseType" defaultValue={p?.house_type||''}><option value="">Bitte wählen</option><option value="Einfamilienhaus">Einfamilienhaus</option><option value="Doppelhaushälfte">Doppelhaushälfte</option><option value="Reihenhaus">Reihenhaus</option><option value="Mehrfamilienhaus">Mehrfamilienhaus</option><option value="Sonstiges">Sonstiges</option></select></label></div><div className="three"><label>Baujahr<input name="buildYear" type="number" defaultValue={p?.build_year||''}/></label><label>Wohnfläche m²<input name="livingArea" type="number" step="0.1" defaultValue={p?.living_area||''}/></label><label>Grundstück m²<input name="plotArea" type="number" step="0.1" defaultValue={p?.plot_area||''}/></label></div><button className="btn primary">Hausprofil speichern</button></form>

    <SectionTitle>Technik & Ausstattung</SectionTitle><div className="asset-grid">{assets.map(a=><article key={a.id}><SolarPanel/><div><strong>{a.name}</strong><small>{a.kind}{a.installed_year?` · ${a.installed_year}`:''}</small><p>{a.details}</p></div></article>)}{assets.length===0&&<div className="empty compact"><p>Füge Heizung, PV, Speicher, Wallbox, Dach, Garten oder Smart Home hinzu. Daraus baut dein Hausmeister automatisch den Wartungsplan.</p></div>}</div>
    <form action={addHouseAssetAction} className="asset-form"><select name="kind" required defaultValue=""><option value="" disabled>Technik / Bereich</option><option value="heating">Heizung / Wärmepumpe</option><option value="pv">PV-Anlage</option><option value="storage">Batteriespeicher</option><option value="wallbox">Wallbox</option><option value="roof">Dach / Dachrinne</option><option value="windows">Fenster / Türen</option><option value="garden">Garten</option><option value="smarthome">Smart Home / Sicherheit</option></select><input name="name" placeholder="Bezeichnung, z. B. Wärmepumpe" required/><input name="installedYear" type="number" placeholder="Baujahr"/><input name="details" placeholder="Modell / Hinweise"/><button className="btn ghost"><Plus size={16}/>Hinzufügen</button></form>

    <SectionTitle>Mein Jahresplan</SectionTitle><div className="stack">{tasks.map(t=><article className="maintenance-row" key={t.id}><div className="maintenance-date"><small>Fällig</small><b>{dateLabel(t.due_date)}</b></div><div className="grow"><strong>{t.title}</strong><small>{t.category} · {t.recurrence_months?`alle ${t.recurrence_months} Monate`:'einmalig'}</small></div><form action={completeMaintenanceTaskAction.bind(null,t.id)}><button className="icon-check" aria-label="Als erledigt markieren"><CheckCircle2/></button></form></article>)}{tasks.length===0&&<div className="empty compact"><p>Keine offenen Wartungspunkte. Füge oben Hausbereiche hinzu oder buche einen Jahres-Check.</p></div>}</div>

    <SectionTitle>Dokumentation</SectionTitle><Link href="/app/documents" className="documents-cta"><FileText/><div><strong>Rechnungen, Nachweise & Belege</strong><p>Alle Unterlagen aus deinen Aufträgen bleiben in der digitalen Hausakte.</p></div></Link>
  </AppShell>;
}
