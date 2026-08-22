'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { z } from 'zod';
import { requireAdmin } from '@/lib/admin-auth';
import { db } from '@/lib/db';
import { addCrmLead,CRM_LEAD_TYPES,CRM_PERMISSIONS,CRM_SOURCES,CRM_STATUSES,importBusinessResearchLeads,updateCrmLead } from '@/lib/crm';
import { checkRateLimit, consumeRateLimitAttempt, rateLimitBlockedEvent } from '@/lib/security/rate-limit';
import { logAdminAudit, logSecurityEvent } from '@/lib/security/audit';

const addSchema=z.object({
  leadType:z.enum(CRM_LEAD_TYPES),
  name:z.string().trim().min(2).max(200),
  companyName:z.string().trim().max(200).optional().default(''),
  category:z.string().trim().max(120).optional().default(''),
  locality:z.string().trim().max(120).optional().default(''),
  postcode:z.string().trim().max(16).optional().default(''),
  country:z.string().trim().max(2).optional().default('DE'),
  email:z.string().trim().max(250).optional().default(''),
  phone:z.string().trim().max(80).optional().default(''),
  website:z.string().trim().max(500).optional().default(''),
  profileUrl:z.string().trim().max(1000).optional().default(''),
  sourceType:z.enum(CRM_SOURCES),
  sourceDetail:z.string().trim().max(500).optional().default(''),
  permission:z.enum(CRM_PERMISSIONS).default('unknown'),
  notes:z.string().trim().max(3000).optional().default(''),
});

const updateSchema=z.object({
  status:z.enum(CRM_STATUSES),
  permission:z.enum(CRM_PERMISSIONS),
  channel:z.enum(['','email','phone','social','website','in_person','other']).default(''),
  notes:z.string().trim().max(3000).optional().default(''),
});

function value(fd:FormData,key:string){return String(fd.get(key)||'');}

async function adminIp():Promise<string>{
  try{
    const h=await headers();
    const forwarded=h.get('x-forwarded-for')?.split(',').map(s=>s.trim()).filter(Boolean);
    return (forwarded?.length?forwarded[forwarded.length-1]:h.get('x-real-ip')||'local').slice(0,200);
  }catch{ return 'local'; }
}

// admin_mutation is a volume limiter: the bucket is consumed on every mutation
// attempt, so check-only use can never pass unlimited traffic.
async function consumeAdminMutation(scope:string):Promise<void>{
  const ip=await adminIp();
  const bucket=`${scope}:${ip}`;
  const limit=checkRateLimit('admin_mutation',bucket);
  if(!limit.allowed){ rateLimitBlockedEvent('admin_mutation',bucket,limit.retryAfterSeconds); redirect('/admin/crm?error=rate-limited'); }
  const consumed=consumeRateLimitAttempt('admin_mutation',bucket);
  if(consumed.consumed&&consumed.blocked){ rateLimitBlockedEvent('admin_mutation',bucket,1800); redirect('/admin/crm?error=rate-limited'); }
}

export async function addCrmLeadAction(fd:FormData){
  await requireAdmin();
  await consumeAdminMutation('crm');
  const parsed=addSchema.safeParse({leadType:value(fd,'leadType'),name:value(fd,'name'),companyName:value(fd,'companyName'),category:value(fd,'category'),locality:value(fd,'locality'),postcode:value(fd,'postcode'),country:value(fd,'country'),email:value(fd,'email'),phone:value(fd,'phone'),website:value(fd,'website'),profileUrl:value(fd,'profileUrl'),sourceType:value(fd,'sourceType'),sourceDetail:value(fd,'sourceDetail'),permission:value(fd,'permission')||'unknown',notes:value(fd,'notes')});
  if(!parsed.success){ logSecurityEvent('security_validation_reject','crm_add',`fields=${parsed.error.issues.length}`); logAdminAudit('admin','crm_lead_add_invalid','lead:new'); redirect('/admin/crm?error=invalid-lead'); }
  // CRM mutation and its audit row commit atomically.
  db.transaction(()=>{ addCrmLead(parsed.data); logAdminAudit('admin','crm_lead_add','lead:new',`source=${parsed.data.sourceType}`); })();
  revalidatePath('/admin/crm');
  redirect('/admin/crm?created=1');
}

export async function updateCrmLeadAction(id:string,fd:FormData){
  await requireAdmin();
  if(!id||id.length>200)redirect('/admin/crm?error=invalid-id');
  await consumeAdminMutation('crm');
  const parsed=updateSchema.safeParse({status:value(fd,'status'),permission:value(fd,'permission'),channel:value(fd,'channel'),notes:value(fd,'notes')});
  if(!parsed.success){ logSecurityEvent('security_validation_reject','crm_update',`fields=${parsed.error.issues.length}`); logAdminAudit('admin','crm_lead_update_invalid',`lead:${id}`); redirect('/admin/crm?error=invalid-update'); }
  db.transaction(()=>{ updateCrmLead(id,parsed.data); logAdminAudit('admin','crm_lead_update',`lead:${id}`,`status=${parsed.data.status}`); })();
  revalidatePath('/admin/crm');
}

export async function syncBusinessResearchAction(){
  await requireAdmin();
  await consumeAdminMutation('crm-sync');
  const source=process.env.BUSINESS_RESEARCH_DB_PATH || `${process.env.HOME||''}/.local/share/sin-business-research/leads.sqlite3`;
  let result;
  try{ result=importBusinessResearchLeads(source); }catch{ redirect('/admin/crm?error=sync-failed'); }
  logAdminAudit('admin','crm_research_sync','crm',`inserted=${result.inserted};updated=${result.updated}`);
  revalidatePath('/admin/crm');
  redirect(`/admin/crm?sync=${result.inserted}&updated=${result.updated}`);
}
