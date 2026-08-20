import fs from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { db } from '@/lib/db';
function mime(file:string){const e=path.extname(file).toLowerCase();return e==='.pdf'?'application/pdf':e==='.png'?'image/png':e==='.webp'?'image/webp':e==='.gif'?'image/gif':'image/jpeg';}
export async function GET(_req:Request,{params}:{params:Promise<{id:string}>}){if(!(await isAdmin()))return new NextResponse('Unauthorized',{status:401});const {id}=await params;const v=db.prepare('SELECT document_path FROM verification_requests WHERE id=?').get(Number(id)) as {document_path:string}|undefined;if(!v)return new NextResponse('Not found',{status:404});const root=path.resolve(process.cwd(),'data','private');const file=path.resolve(root,v.document_path);if(!file.startsWith(root+path.sep))return new NextResponse('Invalid path',{status:400});try{const body=await fs.readFile(file);return new NextResponse(body,{headers:{'content-type':mime(file),'content-disposition':`inline; filename="partner-check-${id}${path.extname(file)}"`,'cache-control':'private, no-store'}});}catch{return new NextResponse('Not found',{status:404});}}
