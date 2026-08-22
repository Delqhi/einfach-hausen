import fs from 'node:fs/promises';
import path from 'node:path';
import { NextRequest,NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/admin-auth';
import { db } from '@/lib/db';
import { canAccessProviderJob } from '@/lib/provider';
import { canReadJobMedia,resolvePrivatePath } from '@/lib/security/private-files';

function mime(file:string){const e=path.extname(file).toLowerCase();return e==='.png'?'image/png':e==='.webp'?'image/webp':e==='.gif'?'image/gif':e==='.mp4'?'video/mp4':e==='.webm'?'video/webm':e==='.mov'?'video/quicktime':e==='.m4v'?'video/x-m4v':'image/jpeg';}

export async function GET(_req:NextRequest,{params}:{params:Promise<{id:string}>}){
  const [user,admin]=await Promise.all([getCurrentUser(),isAdmin()]); if(!user&&!admin)return new NextResponse('Unauthorized',{status:401});
  const {id}=await params;
  const media=db.prepare(`SELECT p.path,p.job_id,j.homeowner_id FROM job_photos p JOIN jobs j ON j.id=p.job_id WHERE p.id=?`).get(Number(id)) as {path:string;job_id:number;homeowner_id:number}|undefined;
  if(!media)return new NextResponse('Not found',{status:404});
  const providerAuthorized=Boolean(user?.role==='provider'&&canAccessProviderJob(user.id,media.job_id));
  const allowed=canReadJobMedia(user,media.homeowner_id,providerAuthorized,admin);
  if(!allowed)return new NextResponse('Forbidden',{status:403});
  const file=resolvePrivatePath(media.path); if(!file)return new NextResponse('Invalid path',{status:400});
  try{const body=await fs.readFile(file);return new NextResponse(body,{headers:{'Content-Type':mime(file),'Cache-Control':'private, no-store'}});}catch{return new NextResponse('Not found',{status:404});}
}
