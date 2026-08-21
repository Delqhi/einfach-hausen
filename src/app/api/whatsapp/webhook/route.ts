import { NextRequest,NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { answerHausmeisterQuestion,createHausmeisterRequest,type HausmeisterIntent } from '@/lib/orchestrator';

function normalizePhone(v:string){return v.replace(/\D/g,'').replace(/^00/,'');}
function explicitIntent(text:string):HausmeisterIntent|null{
  const value=text.trim().toLowerCase();
  if(/^(ansprechpartner|kontakt|mensch|fachperson)$/.test(value))return 'contact';
  if(/^(auftrag|beauftragen|auftrag organisieren)$/.test(value))return 'service';
  if(/ansprechpartner|fach(?:mann|frau|person).*(?:sprech|kontakt)|jemanden.*sprech|nur.*(?:fragen|sprechen)/i.test(text))return 'contact';
  if(/beauftrag|erledigen lassen|machen lassen|auftrag.*organis|direkt.*buchen/i.test(text))return 'service';
  return null;
}
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
    const body=String(msg.text?.body||'').trim();
    try{
      const thread=db.prepare(`SELECT id FROM assistant_threads WHERE user_id=? AND channel='whatsapp' ORDER BY updated_at DESC LIMIT 1`).get(user.id) as {id:number}|undefined;
      const draft=thread?db.prepare('SELECT intent FROM assistant_drafts WHERE thread_id=?').get(thread.id) as {intent:HausmeisterIntent}|undefined:undefined;
      if(draft){
        const result=await createHausmeisterRequest(user.id,body,'whatsapp',null,draft.intent,true,thread?.id);
        await sendWhatsApp(msg.from,result.reply);
        continue;
      }

      const intent=explicitIntent(body);
      if(intent){
        const commandOnly=/^(ansprechpartner|kontakt|mensch|fachperson|auftrag|beauftragen|auftrag organisieren)$/i.test(body);
        let topic=body; let topicPhoto:string|null=null;
        if(commandOnly&&thread){
          const latest=db.prepare(`SELECT body,metadata_json FROM assistant_messages WHERE thread_id=? AND role='user' ORDER BY created_at DESC,id DESC LIMIT 1`).get(thread.id) as {body:string;metadata_json:string}|undefined;
          if(latest){topic=latest.body;try{const meta=JSON.parse(latest.metadata_json||'{}');if(typeof meta.photo==='string')topicPhoto=meta.photo;}catch{}}
        }
        const result=await createHausmeisterRequest(user.id,topic,'whatsapp',topicPhoto,intent,!commandOnly,thread?.id);
        await sendWhatsApp(msg.from,result.reply);
        continue;
      }

      const answer=await answerHausmeisterQuestion(user.id,body,'whatsapp');
      await sendWhatsApp(msg.from,`${answer.reply}\n\nWenn du einen passenden Menschen sprechen möchtest, antworte ANSPRECHPARTNER. Wenn ich einen echten Auftrag organisieren soll, antworte AUFTRAG.`);
    }catch{
      await sendWhatsApp(msg.from,'Ich konnte das gerade nicht vollständig verarbeiten. Öffne bitte die Einfach-Hausen-App; dein KI-Hausmeister und deine Hausakte bleiben dort verfügbar.');
    }
  }
  return NextResponse.json({received:true});
}
