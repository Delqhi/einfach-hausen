import fs from 'node:fs/promises';
import path from 'node:path';
import { NextRequest,NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin-auth';
import { db } from '@/lib/db';
import { resolvePrivatePath } from '@/lib/security/private-files';

export async function GET(_req:NextRequest,{params}:{params:Promise<{id:string,kind:string}>}){
  const [user,admin]=await Promise.all([getCurrentUser(),isAdmin()]); if(!user&&!admin)return new NextResponse('Unauthorized',{status:401});
  const {id,kind}=await params; if(!['before','after'].includes(kind))return new NextResponse('Not found',{status:404});
  const column=kind==='before'?'before_photo':'after_photo';
  const entry=db.prepare(`SELECT h.id,h.homeowner_id,h.property_id,h.${column} file_path FROM house_history_entries h WHERE h.id=?`).get(Number(id)) as {homeowner_id:number;property_id:number;file_path:string|null}|undefined;
  if(!entry?.file_path)return new NextResponse('Not found',{status:404});
  const owns=Boolean(user?.role==='homeowner'&&user.id===entry.homeowner_id&&db.prepare(`SELECT 1 FROM property_ownerships WHERE property_id=? AND homeowner_id=? AND active=1`).get(entry.property_id,user.id));
  if(!admin&&!owns)return new NextResponse('Forbidden',{status:403});
  const file=resolvePrivatePath(entry.file_path); if(!file)return new NextResponse('Invalid path',{status:400});
  try{const body=await fs.readFile(file); const ext=path.extname(file).toLowerCase(); const type=ext==='.png'?'image/png':ext==='.webp'?'image/webp':ext==='.gif'?'image/gif':'image/jpeg';return new NextResponse(body,{headers:{'Content-Type':type,'Cache-Control':'private, no-store'}});}catch{return new NextResponse('Not found',{status:404});}
}
