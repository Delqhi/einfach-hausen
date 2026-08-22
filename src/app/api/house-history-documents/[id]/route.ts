import fs from 'node:fs/promises';
import path from 'node:path';
import { NextRequest,NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin-auth';
import { db } from '@/lib/db';
import { resolvePrivatePath } from '@/lib/security/private-files';

export async function GET(_req:NextRequest,{params}:{params:Promise<{id:string}>}){
  const [user,admin]=await Promise.all([getCurrentUser(),isAdmin()]); if(!user&&!admin)return new NextResponse('Unauthorized',{status:401});
  const {id}=await params;
  const d=db.prepare(`SELECT d.*,h.homeowner_id,h.property_id FROM house_history_documents d JOIN house_history_entries h ON h.id=d.entry_id WHERE d.id=?`).get(Number(id)) as any;
  if(!d)return new NextResponse('Not found',{status:404});
  const owns=Boolean(user?.role==='homeowner'&&user.id===d.homeowner_id&&db.prepare(`SELECT 1 FROM property_ownerships WHERE property_id=? AND homeowner_id=? AND active=1`).get(d.property_id,user.id));
  if(!admin&&!owns)return new NextResponse('Forbidden',{status:403});
  const file=resolvePrivatePath(d.path); if(!file)return new NextResponse('Invalid path',{status:400});
  try{const body=await fs.readFile(file);const ext=path.extname(file).toLowerCase();const type=ext==='.pdf'?'application/pdf':ext==='.png'?'image/png':ext==='.webp'?'image/webp':'image/jpeg';return new NextResponse(body,{headers:{'Content-Type':type,'Content-Disposition':`inline; filename="${encodeURIComponent(d.title)}"`,'Cache-Control':'private, no-store'}});}catch{return new NextResponse('Not found',{status:404});}
}
