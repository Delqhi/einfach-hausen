import fs from 'node:fs';
import path from 'node:path';
import { NextRequest,NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(_req:NextRequest,{params}:{params:Promise<{id:string,kind:string}>}){
  const user=await getCurrentUser(); if(!user||user.role!=='homeowner')return new NextResponse('Unauthorized',{status:401});
  const {id,kind}=await params; if(!['before','after'].includes(kind))return new NextResponse('Not found',{status:404});
  const column=kind==='before'?'before_photo':'after_photo';
  const entry=db.prepare(`SELECT h.id,h.property_id,h.${column} file_path FROM house_history_entries h JOIN property_ownerships o ON o.property_id=h.property_id AND o.homeowner_id=? AND o.active=1 WHERE h.id=?`).get(user.id,Number(id)) as {file_path:string|null}|undefined;
  if(!entry?.file_path)return new NextResponse('Not found',{status:404});
  const file=path.join(process.cwd(),'data','private',entry.file_path); if(!fs.existsSync(file))return new NextResponse('Not found',{status:404});
  const body=fs.readFileSync(file); const ext=path.extname(file).toLowerCase(); const type=ext==='.png'?'image/png':ext==='.webp'?'image/webp':ext==='.gif'?'image/gif':'image/jpeg';
  return new NextResponse(body,{headers:{'Content-Type':type,'Cache-Control':'private, no-store'}});
}
