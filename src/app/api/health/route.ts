import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export function GET(){
  try{
    const row=db.prepare('SELECT 1 ok').get() as {ok:number};
    return NextResponse.json({ok:row.ok===1,service:'einfach-hausen',time:new Date().toISOString()},{headers:{'cache-control':'no-store'}});
  }catch{
    return NextResponse.json({ok:false,service:'einfach-hausen'},{status:503,headers:{'cache-control':'no-store'}});
  }
}
