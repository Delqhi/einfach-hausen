import { cookies } from 'next/headers';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { redirect } from 'next/navigation';
import { db } from './db';

const COOKIE = 'mh_admin_session';

function secureEqual(a:string,b:string){
  const aa=Buffer.from(a); const bb=Buffer.from(b);
  if(aa.length!==bb.length) return false;
  return timingSafeEqual(aa,bb);
}

export function adminPasswordMatches(input:string){
  const expected=process.env.ADMIN_PASSWORD || '';
  return expected.length>=12 && secureEqual(input,expected);
}

export async function createAdminSession(){
  const token=randomBytes(32).toString('hex');
  const expires=new Date(Date.now()+1000*60*60*12);
  db.prepare('INSERT INTO admin_sessions(token,expires_at) VALUES(?,?)').run(token,expires.toISOString());
  const jar=await cookies();
  jar.set(COOKIE,token,{httpOnly:true,sameSite:'strict',secure:process.env.NODE_ENV==='production',path:'/',expires});
}

export async function destroyAdminSession(){
  const jar=await cookies(); const token=jar.get(COOKIE)?.value;
  if(token) db.prepare('DELETE FROM admin_sessions WHERE token=?').run(token);
  jar.delete(COOKIE);
}

export async function isAdmin(){
  const jar=await cookies(); const token=jar.get(COOKIE)?.value; if(!token) return false;
  const row=db.prepare('SELECT token FROM admin_sessions WHERE token=? AND expires_at>?').get(token,new Date().toISOString());
  if(!row){jar.delete(COOKIE);return false;} return true;
}

export async function requireAdmin(){if(!(await isAdmin())) redirect('/admin/login');}
