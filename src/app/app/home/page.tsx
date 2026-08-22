import Link from 'next/link';
import { Building2,CalendarDays,CheckCircle2,ChevronRight,FileText,History,House,NotebookPen,Plus,Settings2,SolarPanel,TrendingUp } from 'lucide-react';
import { AppShell,SectionTitle } from '@/components/shell';
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
    <div className="house-screen-head"><div><h1>Mein Haus</h1><p>Alles Wichtige zu deinem Zuhause an einem Ort.</p></div><Link href="#technik" className="round-add" aria-label="Technik hinzufügen"><Plus/></Link></div>

    <section className="house-cover-card"><div className="house-cover-art"><House/><span className="house-roof-line"/></div><div className="house-cover-copy"><small>Zuhause</small><strong>{p?.address||'Adresse ergänzen'}</strong><span>{p?.postcode||'Hausprofil vervollständigen'}{p?.house_type?` · ${p.house_type}`:''}</span></div></section>

    <div className="house-menu">
      <details><summary><span className="house-menu-icon"><Building2/></span><span className="grow"><strong>Gebäude & Räume</strong><small>{p?.build_year?`Baujahr ${p.build_year}`:'Hausdaten hinterlegen'}{p?.living_area?` · ${p.living_area} m²`:''}</small></span><ChevronRight/></summary><form action={saveHouseProfileAction} className="house-profile-form house-inline-form"><label>Adresse<input name="address" defaultValue={p?.address||''} placeholder="Straße, Hausnummer, Ort"/></label><div className="two"><label>PLZ<input name="postcode" defaultValue={p?.postcode||''}/></label><label>Haustyp<select name="houseType" defaultValue={p?.house_type||''}><option value="">Bitte wählen</option><option value="Einfamilienhaus">Einfamilienhaus</option><option value="Doppelhaushälfte">Doppelhaushälfte</option><option value="Reihenhaus">Reihenhaus</option><option value="Mehrfamilienhaus">Mehrfamilienhaus</option><option value="Sonstiges">Sonstiges</option></select></label></div><div className="three"><label>Baujahr<input name="buildYear" type="number" defaultValue={p?.build_year||''}/></label><label>Wohnfläche m²<input name="livingArea" type="number" step="0.1" defaultValue={p?.living_area||''}/></label><label>Grundstück m²<input name="plotArea" type="number" step="0.1" defaultValue={p?.plot_area||''}/></label></div><button className="btn primary">Hausprofil speichern</button></form></details>
      <a href="#technik"><span className="house-menu-icon"><Settings2/></span><span className="grow"><strong>Technik & Geräte</strong><small>{assets.length} {assets.length===1?'Eintrag':'Einträge'} hinterlegt</small></span><ChevronRight/></a>
      <Link href="/app/home/history"><span className="house-menu-icon"><History/></span><span className="grow"><strong>Historie</strong><small>{historyCount} frühere Arbeiten dokumentiert</small></span><ChevronRight/></Link><Link href="/app/documents"><span className="house-menu-icon"><FileText/></span><span className="grow"><strong>Dokumente & Rechnungen</strong><small>{docs.c+invoiceCount} Unterlagen in deiner Hausakte</small></span><ChevronRight/></Link>
      <Link href="/app/year"><span className="house-menu-icon"><CalendarDays/></span><span className="grow"><strong>Mein Jahr</strong><small>{tasks.length} offene Wartungspunkte</small></span><ChevronRight/></Link>
      <Link href="/app/home/sale"><span className="house-menu-icon"><TrendingUp/></span><span className="grow"><strong>Verkauf & Bewertung</strong><small>Wert speichern, Verkauf vorbereiten, passende Makler finden</small></span><ChevronRight/></Link>
      <div className="house-menu-disabled"><span className="house-menu-icon"><NotebookPen/></span><span className="grow"><strong>Notizen</strong><small>Hauswissen und Hinweise zentral sammeln</small></span><span className="soon-pill">bald</span></div>
    </div>

    <Link href="/app/year" className="year-preview-card"><div><small>Mein Jahr</small><strong>{tasks.length?`${tasks.length} Dinge stehen an`:'Alles im Plan'}</strong><p>{tasks[0]?`${tasks[0].title} · ${dateLabel(tasks[0].due_date)}`:'Neue Aufgaben und Wartungen kannst du jederzeit planen.'}</p></div><ChevronRight/></Link>

    <section id="technik"><SectionTitle>Technik & Ausstattung</SectionTitle><div className="asset-grid mobile-assets">{assets.map(a=><article key={a.id}><SolarPanel/><div><strong>{a.name}</strong><small>{a.kind}{a.installed_year?` · ${a.installed_year}`:''}</small><p>{a.details}</p></div></article>)}{assets.length===0&&<div className="empty compact"><p>Füge Heizung, PV, Speicher, Wallbox, Dach, Garten oder Smart Home hinzu.</p></div>}</div>
    <form action={addHouseAssetAction} className="asset-form"><select name="kind" required defaultValue=""><option value="" disabled>Technik / Bereich</option><option value="heating">Heizung / Wärmepumpe</option><option value="pv">PV-Anlage</option><option value="storage">Batteriespeicher</option><option value="wallbox">Wallbox</option><option value="roof">Dach / Dachrinne</option><option value="windows">Fenster / Türen</option><option value="garden">Garten</option><option value="smarthome">Smart Home / Sicherheit</option></select><input name="name" placeholder="Bezeichnung" required/><input name="installedYear" type="number" placeholder="Baujahr"/><input name="details" placeholder="Modell / Hinweise"/><button className="btn ghost"><Plus size={16}/>Hinzufügen</button></form></section>

    {tasks.length>0&&<><SectionTitle>Demnächst</SectionTitle><div className="stack">{tasks.slice(0,4).map(t=><article className="maintenance-row" key={t.id}><div className="maintenance-date"><small>Fällig</small><b>{dateLabel(t.due_date)}</b></div><div className="grow"><strong>{t.title}</strong><small>{t.category}</small></div><form action={completeMaintenanceTaskAction.bind(null,t.id)}><button className="icon-check" aria-label="Als erledigt markieren"><CheckCircle2/></button></form></article>)}</div></>}

    {appointments.length>0&&<><SectionTitle>Nächste Termine</SectionTitle><div className="stack">{appointments.map(a=><Link href={`/app/jobs/${a.job_id}`} className="appointment" key={a.id}><CalendarDays/><div className="grow"><strong>{a.title}</strong><p>{a.business_name}</p><small>{dateLabel(a.start_at)}</small></div><ChevronRight/></Link>)}</div></>}
  </AppShell>;
}
