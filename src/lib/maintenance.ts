import { db } from './db';

type MaintenanceRule={title:string;category:string;recurrenceMonths:number};
type EnsureTaskInput={homeownerId:number;propertyId:number;assetId?:number|null;title:string;category:string;dueDate:string;recurrenceMonths?:number|null};

const ASSET_RULES:Record<string,Omit<MaintenanceRule,'title'>&{title:string}>={
  heating:{title:'Heizung / Wärmepumpe prüfen lassen',category:'Heizung',recurrenceMonths:12},
  pv:{title:'PV-Anlage und Ertrag prüfen',category:'Energie',recurrenceMonths:24},
  storage:{title:'Batteriespeicher prüfen',category:'Energie',recurrenceMonths:24},
  wallbox:{title:'Wallbox und Elektroanschluss prüfen',category:'Elektro',recurrenceMonths:24},
  roof:{title:'Dach und Dachentwässerung prüfen',category:'Dach',recurrenceMonths:12},
  windows:{title:'Fenster und Türen prüfen',category:'Gebäude',recurrenceMonths:24},
  garden:{title:'Saisonale Gartenpflege planen',category:'Garten',recurrenceMonths:6},
  smarthome:{title:'Smart-Home- und Sicherheitscheck',category:'Smart Home',recurrenceMonths:12},
};

const DATE_ONLY=/^\d{4}-\d{2}-\d{2}$/;

function isoDate(value:Date){return value.toISOString().slice(0,10);}
function daysInUtcMonth(year:number,month:number){return new Date(Date.UTC(year,month+1,0,12)).getUTCDate();}

export function addMonthsIso(base:string|Date,months:number){
  const source=base instanceof Date?new Date(base):new Date(`${base}T12:00:00Z`);
  if(!Number.isFinite(source.getTime()))throw new Error('Invalid maintenance base date');
  if(!Number.isInteger(months))throw new Error('Invalid maintenance recurrence');
  const sourceYear=source.getUTCFullYear();
  const sourceMonth=source.getUTCMonth();
  const sourceDay=source.getUTCDate();
  const sourceIsMonthEnd=sourceDay===daysInUtcMonth(sourceYear,sourceMonth);
  const target=new Date(Date.UTC(sourceYear,sourceMonth+months,1,12));
  const targetLastDay=daysInUtcMonth(target.getUTCFullYear(),target.getUTCMonth());
  target.setUTCDate(sourceIsMonthEnd?targetLastDay:Math.min(sourceDay,targetLastDay));
  return isoDate(target);
}

export function maintenanceRuleForAsset(kind:string,name=''):MaintenanceRule|null{
  const rule=ASSET_RULES[kind];
  return rule?{...rule,title:rule.title||`${name} prüfen`}:null;
}

export function maintenanceRuleForCompletedWork(category:string,title:string):MaintenanceRule|null{
  const text=`${category} ${title}`.toLowerCase();
  if(/heizung|wärmepumpe|therme|kessel/.test(text))return {title:'Nächster Heizungs- / Wärmepumpencheck',category:'Heizung',recurrenceMonths:12};
  if(/photovoltaik|\bpv\b|solar|speicher|batterie/.test(text))return {title:'Nächster Energieanlagen-Check',category:'Energie',recurrenceMonths:24};
  if(/wallbox|elektro|sicherung|verteiler/.test(text))return {title:'Nächster Elektro-Check',category:'Elektro',recurrenceMonths:24};
  if(/dach|dachrinne|fassade/.test(text))return {title:'Nächster Dach- / Fassadencheck',category:'Dach',recurrenceMonths:12};
  if(/garten|hecke|rasen|baum/.test(text))return {title:'Nächste saisonale Gartenpflege',category:'Garten',recurrenceMonths:6};
  if(/fenster|tür|tor/.test(text))return {title:'Nächster Fenster- / Türencheck',category:'Gebäude',recurrenceMonths:24};
  if(/smart.?home|alarm|sicherheit/.test(text))return {title:'Nächster Smart-Home- / Sicherheitscheck',category:'Smart Home',recurrenceMonths:12};
  return null;
}

export function ensureMaintenanceTask(input:EnsureTaskInput){
  if(!Number.isInteger(input.homeownerId)||input.homeownerId<=0||!Number.isInteger(input.propertyId)||input.propertyId<=0)throw new Error('Invalid maintenance ownership');
  if(!DATE_ONLY.test(input.dueDate))throw new Error('Invalid maintenance due date');
  const assetId=input.assetId??null;
  if(assetId!=null){
    const asset=db.prepare(`SELECT property_id FROM house_assets WHERE id=?`).get(assetId) as {property_id:number|null}|undefined;
    if(!asset||Number(asset.property_id)!==input.propertyId)throw new Error('Maintenance asset does not belong to property');
  }
  const existing=assetId!=null
    ? db.prepare(`SELECT id FROM maintenance_tasks WHERE property_id=? AND asset_id=? AND title=? AND status='open' ORDER BY id LIMIT 1`).get(input.propertyId,assetId,input.title) as {id:number}|undefined
    : db.prepare(`SELECT id FROM maintenance_tasks WHERE property_id=? AND asset_id IS NULL AND title=? AND due_date=? AND status='open' ORDER BY id LIMIT 1`).get(input.propertyId,input.title,input.dueDate) as {id:number}|undefined;
  if(existing)return {id:existing.id,created:false};
  const r=db.prepare(`INSERT INTO maintenance_tasks(homeowner_id,asset_id,title,category,due_date,recurrence_months,status,property_id) VALUES(?,?,?,?,?,?, 'open',?)`).run(input.homeownerId,assetId,input.title,input.category,input.dueDate,input.recurrenceMonths??null,input.propertyId);
  return {id:Number(r.lastInsertRowid),created:true};
}

export function ensureAssetMaintenance(homeownerId:number,propertyId:number,assetId:number,kind:string,name:string,base=new Date()){
  const rule=maintenanceRuleForAsset(kind,name);if(!rule)return null;
  return ensureMaintenanceTask({homeownerId,propertyId,assetId,title:rule.title,category:rule.category,dueDate:addMonthsIso(base,rule.recurrenceMonths),recurrenceMonths:rule.recurrenceMonths});
}

export function ensureCompletedWorkMaintenance(homeownerId:number,propertyId:number,category:string,title:string,completedAt:string|Date=new Date(),firstDueDate?:string|null){
  const rule=maintenanceRuleForCompletedWork(category,title);if(!rule)return null;
  const dueDate=firstDueDate&&DATE_ONLY.test(firstDueDate)?firstDueDate:addMonthsIso(completedAt,rule.recurrenceMonths);
  return ensureMaintenanceTask({homeownerId,propertyId,title:rule.title,category:rule.category,dueDate,recurrenceMonths:rule.recurrenceMonths});
}

export function completeMaintenanceAndScheduleNext(homeownerId:number,propertyId:number,taskId:number){
  const tx=db.transaction(()=>{
    const task=db.prepare(`SELECT * FROM maintenance_tasks WHERE id=? AND homeowner_id=? AND property_id=?`).get(taskId,homeownerId,propertyId) as any;
    if(!task||task.status!=='open')return {completed:false,nextCreated:false};
    const updated=db.prepare(`UPDATE maintenance_tasks SET status='completed' WHERE id=? AND homeowner_id=? AND property_id=? AND status='open'`).run(taskId,homeownerId,propertyId);
    if(updated.changes!==1)return {completed:false,nextCreated:false};
    if(!task.recurrence_months)return {completed:true,nextCreated:false};
    const next=ensureMaintenanceTask({homeownerId,propertyId,assetId:task.asset_id,title:task.title,category:task.category,dueDate:addMonthsIso(task.due_date,task.recurrence_months),recurrenceMonths:task.recurrence_months});
    return {completed:true,nextCreated:next.created};
  });
  return tx();
}
