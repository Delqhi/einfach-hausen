'use server';

import { revalidatePath } from 'next/cache';
import { grantBrokerContactAction, revokeBrokerContactAction } from '@/app/actions';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { isBrokerEligibleForProperty } from '@/lib/broker-matching';
import { primaryProperty, propertyOwnedBy } from '@/lib/properties';

const valuationTypes = new Set(['orientation', 'expert', 'market']);

function valuationType(formData: FormData) {
  const value = String(formData.get('valuationType') || 'orientation');
  return valuationTypes.has(value) ? value : 'orientation';
}

function valuationNote(formData: FormData) {
  return String(formData.get('notes') || '').trim().slice(0, 2000);
}

function euroToCents(formData: FormData, field: string) {
  const raw = String(formData.get(field) || '').trim().replace(',', '.');
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? Math.round(value * 100) : null;
}

export async function requestPropertyValuationAction(formData: FormData) {
  const user = await requireUser('homeowner');
  const property = primaryProperty(user.id);
  if (!property) return;

  db.prepare(`INSERT INTO property_valuations(
      property_id,homeowner_id,status,valuation_type,estimated_min,estimated_max,notes,completed_at
    ) VALUES(?,?,'requested',?,NULL,NULL,?,NULL)`)
    .run(property.id, user.id, valuationType(formData), valuationNote(formData));

  revalidatePath('/app/home/sale');
  revalidatePath('/app/home');
}

export async function storeExistingValuationAction(formData: FormData) {
  const user = await requireUser('homeowner');
  const property = primaryProperty(user.id);
  if (!property) return;

  const estimatedMin = euroToCents(formData, 'estimatedMin');
  const estimatedMax = euroToCents(formData, 'estimatedMax');
  if (estimatedMin == null || estimatedMax == null || estimatedMax < estimatedMin) return;

  const type = valuationType(formData);
  const notes = valuationNote(formData);
  const completedAt = new Date().toISOString();
  db.transaction(() => {
    db.prepare(`INSERT INTO property_valuations(
        property_id,homeowner_id,status,valuation_type,estimated_min,estimated_max,notes,completed_at
      ) VALUES(?,?,'completed',?,?,?,?,?)`)
      .run(property.id, user.id, type, estimatedMin, estimatedMax, notes, completedAt);
    db.prepare(`UPDATE properties
      SET estimated_value_min=?,estimated_value_max=?,updated_at=CURRENT_TIMESTAMP
      WHERE id=?`).run(estimatedMin, estimatedMax, property.id);
  })();

  revalidatePath('/app/home/sale');
  revalidatePath('/app/home');
}

export async function approveBrokerShareAction(matchId: number, formData: FormData) {
  if (formData.get('confirmShare') !== 'yes') return;

  const user = await requireUser('homeowner');
  const match = db.prepare(`SELECT m.provider_id,l.property_id,l.homeowner_id,p.*
    FROM broker_lead_matches m
    JOIN sale_leads l ON l.id=m.sale_lead_id
    JOIN properties p ON p.id=l.property_id
    WHERE m.id=?`).get(matchId) as any | undefined;

  if (!match || match.homeowner_id !== user.id || !propertyOwnedBy(user.id, match.property_id)) return;
  if (!isBrokerEligibleForProperty(match.provider_id, match)) return;

  await grantBrokerContactAction(matchId);
}

export async function revokeBrokerShareAction(matchId: number) {
  const user = await requireUser('homeowner');
  const match = db.prepare(`SELECT l.property_id,l.homeowner_id
    FROM broker_lead_matches m
    JOIN sale_leads l ON l.id=m.sale_lead_id
    WHERE m.id=?`).get(matchId) as { property_id: number; homeowner_id: number } | undefined;

  if (!match || match.homeowner_id !== user.id || !propertyOwnedBy(user.id, match.property_id)) return;
  await revokeBrokerContactAction(matchId);
}
