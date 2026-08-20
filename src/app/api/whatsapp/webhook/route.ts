import { NextRequest,NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createHausmeisterRequest } from '@/lib/orchestrator';

function normalizePhone(v:string){return v.replace(/\D/g,'').replace(/^00/,'');}
async function sendWhatsApp(to:string,body:string){
  const token=process.env.WHATSAPP_ACCESS_TOKEN; const phoneId=process.env.WHATSAPP_PHONE_NUMBER_ID; if(!token||!phoneId)return;
  const version=process.env.WHATSAPP_GRAPH_VERSION||'v23.0';
  await fetch(`https://graph.facebook.com/${version}/${phoneId}/messages`,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({messaging_product:'whatsapp',to,type:'text',text:{body:body.slice(0,4000)}})});
}

export async function GET(req:NextRequest){
  const mode=req.nextUrl.searchParams.get('hub.mode'); const token=req.nextUrl.searchParams.get('hub.verify_token'); const challenge=req.nextUrl.searchParams.get('hub.challenge');
  if(mode==='subscribe'&&token&&token===process.env.WHATSAPP_VERIFY_TOKEN)return new NextResponse(challenge||'',{status:200});
  return new NextResponse('Forbidden',{status:403});
}

export async function POST(req:NextRequest){
  const payload=await req.json().catch(()=>null) as any; const entries=payload?.entry||[];
  for(const entry of entries)for(const change of entry.changes||[])for(const msg of change.value?.messages||[]){
    if(msg.type!=='text'||!msg.from)continue;
    const phone=normalizePhone(msg.from); const users=db.prepare("SELECT id,role,phone FROM users WHERE phone IS NOT NULL AND phone!=''").all() as any[];
    const user=users.find(u=>{const p=normalizePhone(u.phone||'');return p===phone||p.endsWith(phone.slice(-10))||phone.endsWith(p.slice(-10));});
    if(!user){await sendWhatsApp(msg.from,'Diese Nummer ist noch keinem Einfach-Hausen-Konto zugeordnet. Hinterlege sie bitte einmal in deinem App-Profil.');continue;}
    if(user.role!=='homeowner'){await sendWhatsApp(msg.from,'Partneranfragen und Aufträge werden in der Einfach-Hausen-Partner-App bearbeitet.');continue;}
    try{const result=await createHausmeisterRequest(user.id,String(msg.text?.body||''),'whatsapp');await sendWhatsApp(msg.from,result.reply);}catch{await sendWhatsApp(msg.from,'Ich konnte die Anfrage gerade nicht vollständig verarbeiten. Öffne bitte die Einfach-Hausen-App; deine Hausakte bleibt dort verfügbar.');}
  }
  return NextResponse.json({received:true});
}
