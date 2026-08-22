import fs from 'node:fs';
import path from 'node:path';
import { NextRequest,NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(_req:NextRequest,{params}:{params:Promise<{id:string}>}){const user=await getCurrentUser();if(!user||user.role!=='homeowner')return new NextResponse('Unauthorized',{status:401});const {id}=await params;const d=db.prepare(`SELECT d.*,h.property_id FROM house_history_documents d JOIN house_history_entries h ON h.id=d.entry_id JOIN property_ownerships o ON o.property_id=h.property_id AND o.homeowner_id=? AND o.active=1 WHERE d.id=?`).get(user.id,Number(id)) as any;if(!d)return new NextResponse('Not found',{status:404});const file=path.join(process.cwd(),'data','private',d.path);if(!fs.existsSync(file))return new NextResponse('Not found',{status:404});const body=fs.readFileSync(file);const ext=path.extname(file).toLowerCase();const type=ext==='.pdf'?'application/pdf':ext==='.png'?'image/png':ext==='.webp'?'image/webp':'image/jpeg';return new NextResponse(body,{headers:{'Content-Type':type,'Content-Disposition':`inline; filename="${encodeURIComponent(d.title)}"`,'Cache-Control':'private, no-store'}})}
