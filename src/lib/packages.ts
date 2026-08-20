import { db } from './db';

function dateAfter(months:number,days=0){const d=new Date();d.setMonth(d.getMonth()+months);d.setDate(d.getDate()+days);return d.toISOString().slice(0,10);}

export function activatePackageOrder(orderId:number,userId:number){
  const order=db.prepare(`SELECT o.id,o.status,o.package_slug,p.title FROM package_orders o JOIN service_packages p ON p.slug=o.package_slug WHERE o.id=? AND o.homeowner_id=?`).get(orderId,userId) as any;
  if(!order)return null;
  const wasPaid=order.status==='paid'||order.status==='scheduled'||order.status==='completed';
  if(!wasPaid)db.prepare("UPDATE package_orders SET status='paid',updated_at=CURRENT_TIMESTAMP WHERE id=?").run(orderId);
  const exists=(title:string)=>db.prepare("SELECT 1 FROM maintenance_tasks WHERE homeowner_id=? AND title=? AND status='open'").get(userId,title);
  const add=(title:string,category:string,due:string,recurrence:number|null=null)=>{if(!exists(title))db.prepare('INSERT INTO maintenance_tasks(homeowner_id,title,category,due_date,recurrence_months) VALUES(?,?,?,?,?)').run(userId,title,category,due,recurrence);};
  if(order.package_slug==='haus-jahrespflege'){
    add('Jährlichen Haus-Check organisieren','Haus Jahrespflege',dateAfter(0,14),12);
    add('Dach und Dachrinne prüfen','Haus Jahrespflege',dateAfter(2),12);
    add('Fenster und Türen prüfen','Haus Jahrespflege',dateAfter(5),12);
    add('Haustechnik und Wartungsbedarf prüfen','Haus Jahrespflege',dateAfter(8),12);
  } else if(order.package_slug==='garten-premium'){
    add('Garten-Saisoncheck und Pflegeplan','Garten Premium',dateAfter(0,10),12);
    add('Rasen- und Beetpflege abstimmen','Garten Premium',dateAfter(2),12);
    add('Hecken- und Gehölzpflege planen','Garten Premium',dateAfter(5),12);
    add('Herbst- und Wintervorbereitung Garten','Garten Premium',dateAfter(8),12);
  } else if(order.package_slug==='energie-technik'){
    add('Energie- & Technik-Check organisieren','Energie & Technik',dateAfter(0,14),12);
    add('PV / Speicher / Wallbox Daten prüfen','Energie & Technik',dateAfter(1),12);
    add('Heizung / Wärmepumpe Wartungsbedarf prüfen','Energie & Technik',dateAfter(3),12);
  }
  return order;
}
