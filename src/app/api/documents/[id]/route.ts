import fs from 'node:fs/promises';
import path from 'node:path';
import { NextRequest,NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
function mime(file:string){const e=path.extname(file).toLowerCase();return e==='.pdf'?'application/pdf':e==='.png'?'image/png':e==='.webp'?'image/webp':e==='.gif'?'image/gif':'image/jpeg';}
export async function GET(req:NextRequest,{params}:{params:Promise<{id:string}>}){const u=await getCurrentUser();if(!u)return new NextResponse('Unauthorized',{status:401});const {id}=await params;const d=db.prepare(`SELECT d.*,j.homeowner_id,q.provider_id accepted_provider FROM documents d JOIN jobs j ON j.id=d.job_id LEFT JOIN quotes q ON q.id=j.accepted_quote_id WHERE d.id=?`).get(Number(id)) as any;if(!d||(u.id!==d.homeowner_id&&u.id!==d.accepted_provider))return new NextResponse('Forbidden',{status:403});const root=path.resolve(process.cwd(),'data','private');const file=path.resolve(root,d.path);if(!file.startsWith(root+path.sep))return new NextResponse('Invalid path',{status:400});try{const body=await fs.readFile(file);return new NextResponse(body,{headers:{'content-type':mime(file),'content-disposition':`inline; filename="document-${d.id}${path.extname(file)}"`,'cache-control':'private, no-store'}});}catch{return new NextResponse('Not found',{status:404});}}
