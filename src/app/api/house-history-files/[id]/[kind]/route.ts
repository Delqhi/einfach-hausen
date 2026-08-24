import fs from 'node:fs/promises';
import path from 'node:path';
import { NextRequest,NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin-auth';
import { db } from '@/lib/db';
import { getProviderContext } from '@/lib/provider';
import { canProviderReadSharedPropertyArtifact } from '@/lib/share-links';
import { parseArtifactId,resolvePrivateFile } from '@/lib/security/private-files';

function notFound(){return new NextResponse('Not found',{status:404});}

function mime(file:string){
  const ext=path.extname(file).toLowerCase();
  return ext==='.png'?'image/png':ext==='.webp'?'image/webp':ext==='.gif'?'image/gif':ext==='.jpg'||ext==='.jpeg'?'image/jpeg':'application/octet-stream';
}

export async function GET(_req:NextRequest,{params}:{params:Promise<{id:string,kind:string}>}){
  const [user,admin]=await Promise.all([getCurrentUser(),isAdmin()]);
  if(!user&&!admin)return new NextResponse('Unauthorized',{status:401});

  const {id,kind}=await params;
  if(kind!=='before'&&kind!=='after')return notFound();
  const entryId=parseArtifactId(id);
  if(!entryId)return notFound();
  const column=kind==='before'?'before_photo':'after_photo';
  const entry=db.prepare(`SELECT h.property_id,h.${column} file_path FROM house_history_entries h WHERE h.id=?`).get(entryId) as {property_id:number|null;file_path:string|null}|undefined;
  if(!entry?.file_path)return notFound();

  let allowed=admin;
  if(!allowed&&entry.property_id&&user?.role==='homeowner'){
    allowed=Boolean(db.prepare(`SELECT 1 FROM property_ownerships WHERE property_id=? AND homeowner_id=? AND active=1`).get(entry.property_id,user.id));
  }
  if(!allowed&&entry.property_id&&user?.role==='provider'){
    const context=getProviderContext(user.id);
    allowed=Boolean(context?.active&&context.canManageJobs&&canProviderReadSharedPropertyArtifact(context.providerId,entry.property_id,'house_history_media'));
  }
  if(!allowed)return notFound();

  const file=await resolvePrivateFile(entry.file_path);
  if(!file)return notFound();

  try{
    const body=await fs.readFile(file);
    return new NextResponse(body,{headers:{
      'Content-Type':mime(file),
      'Cache-Control':'private, no-store',
      'X-Content-Type-Options':'nosniff',
    }});
  }catch{
    return notFound();
  }
}
