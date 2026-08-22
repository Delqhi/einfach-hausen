import fs from 'node:fs/promises';
import path from 'node:path';
import { NextRequest,NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin-auth';
import { db } from '@/lib/db';
import { getProviderContext } from '@/lib/provider';
import { resolvePrivatePath } from '@/lib/security/private-files';

function mime(file:string){const e=path.extname(file).toLowerCase();return e==='.pdf'?'application/pdf':e==='.png'?'image/png':e==='.webp'?'image/webp':e==='.gif'?'image/gif':'image/jpeg';}

export async function GET(_req:NextRequest,{params}:{params:Promise<{id:string}>}){
  const [u,admin]=await Promise.all([getCurrentUser(),isAdmin()]); if(!u&&!admin)return new NextResponse('Unauthorized',{status:401}); const {id}=await params;
  const d=db.prepare(`SELECT d.*,j.homeowner_id,q.provider_id accepted_provider,a.contact_user_id FROM documents d JOIN jobs j ON j.id=d.job_id LEFT JOIN quotes q ON q.id=j.accepted_quote_id LEFT JOIN job_assignments a ON a.job_id=j.id WHERE d.id=?`).get(Number(id)) as any;
  if(!d)return new NextResponse('Not found',{status:404});
  let allowed=admin||Boolean(u&&u.id===d.homeowner_id);
  if(!allowed&&u?.role==='provider'){
    const ctx=getProviderContext(u.id); allowed=Boolean(ctx&&ctx.providerId===d.accepted_provider&&(ctx.canManageJobs||d.contact_user_id===u.id));
  }
  if(!allowed)return new NextResponse('Forbidden',{status:403});
  const file=resolvePrivatePath(d.path); if(!file)return new NextResponse('Invalid path',{status:400});
  try{const body=await fs.readFile(file);return new NextResponse(body,{headers:{'content-type':mime(file),'content-disposition':`inline; filename="document-${d.id}${path.extname(file)}"`,'cache-control':'private, no-store'}});}catch{return new NextResponse('Not found',{status:404});}
}
