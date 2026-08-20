import { db } from './db';
export function createNotification(userId:number,title:string,body:string,href:string,kind='info'){
  db.prepare('INSERT INTO notifications(user_id,kind,title,body,href) VALUES(?,?,?,?,?)').run(userId,kind,title,body.slice(0,800),href);
}
