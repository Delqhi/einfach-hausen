import { privateMediaRule,savePrivateMediaBuffer,type IntakeMediaKind } from './intake-media';

export type WhatsAppMediaResult={path:string;kind:IntakeMediaKind;body:string};
type IncomingMedia={id?:unknown;mime_type?:unknown;caption?:unknown};
const allowedHosts=new Set(['graph.facebook.com','lookaside.fbsbx.com']);

export function whatsappMediaType(type:unknown):'image'|'audio'|null{return type==='image'||type==='audio'?type:null;}
export function whatsappMediaPlaceholder(kind:'image'|'audio',caption:unknown){
  const label=kind==='image'?'Foto':'Sprachnachricht'; const text=typeof caption==='string'?caption.trim().slice(0,1200):'';
  return text?`${label}: ${text}`:`${label} empfangen.`;
}

export async function downloadWhatsAppMedia(message:{type?:unknown;image?:IncomingMedia;audio?:IncomingMedia}):Promise<WhatsAppMediaResult|null>{
  const kind=whatsappMediaType(message.type); if(!kind)return null;
  const media=(kind==='image'?message.image:message.audio)||{}; const id=typeof media.id==='string'?media.id:'';
  const declared=typeof media.mime_type==='string'?media.mime_type:''; const rule=privateMediaRule(declared);
  if(!id||!rule||rule.kind!==kind)return null;
  const token=process.env.WHATSAPP_ACCESS_TOKEN; const version=process.env.WHATSAPP_GRAPH_VERSION||'v23.0'; if(!token)return null;
  const metadata=await fetch(`https://graph.facebook.com/${version}/${encodeURIComponent(id)}`,{headers:{Authorization:`Bearer ${token}`},signal:AbortSignal.timeout(8000)});
  if(!metadata.ok)return null;
  const url=String((await metadata.json() as {url?:unknown}).url||''); let parsed:URL; try{parsed=new URL(url);}catch{return null;}
  if(parsed.protocol!=='https:'||!allowedHosts.has(parsed.hostname))return null;
  const response=await fetch(parsed,{headers:{Authorization:`Bearer ${token}`},signal:AbortSignal.timeout(12000)}); if(!response.ok)return null;
  const contentType=response.headers.get('content-type')||declared; const downloadedRule=privateMediaRule(contentType);
  if(!downloadedRule||downloadedRule.kind!==kind)return null;
  const contentLength=Number(response.headers.get('content-length')||0); if(!Number.isFinite(contentLength)||contentLength>downloadedRule.max)return null;
  const bytes=new Uint8Array(await response.arrayBuffer()); if(!bytes.byteLength||bytes.byteLength>downloadedRule.max)return null;
  const path=await savePrivateMediaBuffer(bytes,contentType);
  return {path,kind,body:whatsappMediaPlaceholder(kind,media.caption)};
}
