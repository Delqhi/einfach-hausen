'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireAdmin } from '@/lib/admin-auth';
import { addCrmLead,CRM_LEAD_TYPES,CRM_PERMISSIONS,CRM_SOURCES,CRM_STATUSES,importBusinessResearchLeads,updateCrmLead } from '@/lib/crm';

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

export async function addCrmLeadAction(fd:FormData){
  await requireAdmin();
  const parsed=addSchema.safeParse({leadType:value(fd,'leadType'),name:value(fd,'name'),companyName:value(fd,'companyName'),category:value(fd,'category'),locality:value(fd,'locality'),postcode:value(fd,'postcode'),country:value(fd,'country'),email:value(fd,'email'),phone:value(fd,'phone'),website:value(fd,'website'),profileUrl:value(fd,'profileUrl'),sourceType:value(fd,'sourceType'),sourceDetail:value(fd,'sourceDetail'),permission:value(fd,'permission')||'unknown',notes:value(fd,'notes')});
  if(!parsed.success)redirect('/admin/crm?error=invalid-lead');
  addCrmLead(parsed.data);
  revalidatePath('/admin/crm');
  redirect('/admin/crm?created=1');
}

export async function updateCrmLeadAction(id:string,fd:FormData){
  await requireAdmin();
  if(!id||id.length>200)redirect('/admin/crm?error=invalid-id');
  const parsed=updateSchema.safeParse({status:value(fd,'status'),permission:value(fd,'permission'),channel:value(fd,'channel'),notes:value(fd,'notes')});
  if(!parsed.success)redirect('/admin/crm?error=invalid-update');
  updateCrmLead(id,parsed.data);
  revalidatePath('/admin/crm');
}

export async function syncBusinessResearchAction(){
  await requireAdmin();
  const source=process.env.BUSINESS_RESEARCH_DB_PATH || `${process.env.HOME||''}/.local/share/sin-business-research/leads.sqlite3`;
  let result;
  try{ result=importBusinessResearchLeads(source); }catch{ redirect('/admin/crm?error=sync-failed'); }
  revalidatePath('/admin/crm');
  redirect(`/admin/crm?sync=${result.inserted}&updated=${result.updated}`);
}
