import { db } from './db';

export type ProviderContext = {
  userId:number;
  providerId:number;
  isOwner:boolean;
  canManageJobs:boolean;
  jobTitle:string;
  active:boolean;
  businessName:string;
};

export function getProviderContext(userId:number):ProviderContext|null{
  const row=db.prepare(`SELECT m.user_id,m.provider_id,m.job_title,m.can_manage_jobs,m.active,p.business_name
    FROM provider_members m JOIN provider_profiles p ON p.user_id=m.provider_id
    WHERE m.user_id=? LIMIT 1`).get(userId) as any;
  if(row)return {userId,providerId:row.provider_id,isOwner:row.provider_id===userId,canManageJobs:!!row.can_manage_jobs,jobTitle:row.job_title||'',active:!!row.active,businessName:row.business_name};
  const own=db.prepare('SELECT business_name FROM provider_profiles WHERE user_id=?').get(userId) as {business_name:string}|undefined;
  if(!own)return null;
  db.prepare(`INSERT OR IGNORE INTO provider_members(provider_id,user_id,job_title,can_manage_jobs,active) VALUES(?,?,'Geschäftsführung',1,1)`).run(userId,userId);
  return {userId,providerId:userId,isOwner:true,canManageJobs:true,jobTitle:'Geschäftsführung',active:true,businessName:own.business_name};
}

export function getProviderMembers(providerId:number){
  return db.prepare(`SELECT m.*,u.email,u.first_name,u.last_name,u.phone
    FROM provider_members m JOIN users u ON u.id=m.user_id
    WHERE m.provider_id=? ORDER BY m.active DESC,m.can_manage_jobs DESC,m.id ASC`).all(providerId) as any[];
}

export function getProviderManagerIds(providerId:number){
  return (db.prepare('SELECT user_id FROM provider_members WHERE provider_id=? AND active=1 AND can_manage_jobs=1').all(providerId) as Array<{user_id:number}>).map(r=>r.user_id);
}

export function canAccessProviderJob(userId:number,jobId:number){
  const ctx=getProviderContext(userId); if(!ctx||!ctx.active)return null;
  if(ctx.canManageJobs){
    const row=db.prepare('SELECT 1 FROM job_dispatches WHERE job_id=? AND provider_id=?').get(jobId,ctx.providerId);
    if(row)return ctx;
  }
  const assignment=db.prepare('SELECT 1 FROM job_assignments WHERE job_id=? AND provider_id=? AND contact_user_id=?').get(jobId,ctx.providerId,userId);
  return assignment?ctx:null;
}

export function assignedContact(jobId:number){
  return db.prepare(`SELECT a.*,u.first_name,u.last_name,u.phone,u.email,m.job_title,p.business_name
    FROM job_assignments a JOIN users u ON u.id=a.contact_user_id
    JOIN provider_members m ON m.user_id=a.contact_user_id
    JOIN provider_profiles p ON p.user_id=a.provider_id
    WHERE a.job_id=?`).get(jobId) as any;
}
