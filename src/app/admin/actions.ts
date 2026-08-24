'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin-auth';
import { db } from '@/lib/db';
import { createNotification } from '@/lib/notifications';
import { redispatchOpenJobs } from '@/lib/orchestrator';
import { closePendingProviderDispatches,getPartnerActivationCheck } from '@/lib/partner-config';
import { logAdminAudit } from '@/lib/security/audit';
import { partnerContractSchema, verificationDecisionSchema } from '@/lib/security/schemas';

function text(fd: FormData, key: string) {
  return String(fd.get(key) ?? '').trim();
}

function int(fd: FormData, key: string) {
  const value = Number(fd.get(key));
  return Number.isFinite(value) ? value : null;
}

export async function adminReviewVerificationLifecycleAction(requestId: number, fd: FormData) {
  await requireAdmin();
  const parsed = verificationDecisionSchema.safeParse({
    decision: text(fd, 'decision'),
    adminNote: text(fd, 'adminNote'),
  });
  if (!parsed.success) {
    logAdminAudit('admin', 'verification_review_invalid', `request:${requestId}`);
    return;
  }

  const request = db.prepare(`SELECT provider_id,status FROM verification_requests WHERE id=?`).get(requestId) as
    | { provider_id: number; status: string }
    | undefined;
  if (!request) return;

  const { decision, adminNote } = parsed.data;
  let closedDispatches = 0;
  let contractSuspended = false;
  db.transaction(() => {
    db.prepare(`UPDATE verification_requests
      SET status=?,admin_note=?,reviewed_at=CURRENT_TIMESTAMP
      WHERE id=?`).run(decision, adminNote, requestId);
    db.prepare('UPDATE provider_profiles SET verified=? WHERE user_id=?')
      .run(decision === 'approved' ? 1 : 0, request.provider_id);

    const activation = getPartnerActivationCheck(request.provider_id);
    if (decision !== 'approved' || (activation.contractStatus === 'active' && !activation.eligibleForActivation)) {
      const changed = db.prepare(`UPDATE partner_contracts
        SET status='suspended',updated_at=CURRENT_TIMESTAMP
        WHERE provider_id=? AND status='active'`).run(request.provider_id).changes;
      contractSuspended = changed > 0;
      closedDispatches = closePendingProviderDispatches(request.provider_id);
    }

    logAdminAudit(
      'admin',
      'verification_review',
      `provider:${request.provider_id}`,
      `request=${requestId};from=${request.status};decision=${decision};contract_suspended=${contractSuspended ? 1 : 0};dispatches_closed=${closedDispatches}`,
    );
  })();

  createNotification(
    request.provider_id,
    decision === 'approved' ? 'Unternehmensprüfung bestanden' : 'Unternehmensprüfung abgelehnt',
    decision === 'approved'
      ? 'Deine Unternehmensnachweise sind geprüft. Aktiv wirst du erst, wenn zusätzlich alle Vertrags- und Qualitätsprüfungen bestätigt sind.'
      : (adminNote || 'Bitte prüfe deine Nachweise und reiche sie erneut ein. Neue Anfragen bleiben bis zur erneuten Freigabe gesperrt.'),
    '/pro/profile',
    'verification',
  );
  revalidatePath('/admin');
  revalidatePath('/pro');
  revalidatePath('/pro/profile');
  revalidatePath('/notifications');
}

export async function adminUpdatePartnerContractLifecycleAction(providerId: number, fd: FormData) {
  await requireAdmin();
  const parsed = partnerContractSchema.safeParse({
    status: text(fd, 'status'),
    discountBps: int(fd, 'discountBps') ?? 0,
    responseTarget: int(fd, 'responseTarget') ?? 30,
    contractNotes: text(fd, 'contractNotes'),
  });
  if (!parsed.success) {
    logAdminAudit('admin', 'contract_update_invalid', `provider:${providerId}`);
    return;
  }

  const provider = db.prepare(`SELECT p.verified,v.status verification_status
    FROM provider_profiles p
    LEFT JOIN verification_requests v ON v.provider_id=p.user_id
    WHERE p.user_id=?`).get(providerId) as { verified: number; verification_status: string | null } | undefined;
  if (!provider) return;

  const insuranceVerified = fd.get('insurance') ? 1 : 0;
  const qualificationVerified = fd.get('qualification') ? 1 : 0;
  const contractVerified = fd.get('contract') ? 1 : 0;
  const qualityStandardVerified = fd.get('quality') ? 1 : 0;
  const { status, discountBps, responseTarget, contractNotes } = parsed.data;
  const explicitChecksComplete = Boolean(
    provider.verified
      && provider.verification_status === 'approved'
      && insuranceVerified
      && qualificationVerified
      && contractVerified
      && qualityStandardVerified,
  );

  if (status === 'active' && !explicitChecksComplete) {
    logAdminAudit(
      'admin',
      'partner_activation_blocked',
      `provider:${providerId}`,
      `verification=${provider.verification_status || 'missing'};profile_verified=${provider.verified ? 1 : 0};insurance=${insuranceVerified};qualification=${qualificationVerified};contract=${contractVerified};quality=${qualityStandardVerified}`,
    );
    redirect(`/admin?partner=${providerId}&error=${encodeURIComponent('Aktivierung blockiert: Unternehmensprüfung und alle vier Vertrags-/Qualitätschecks müssen bestätigt sein.')}`);
  }

  let closedDispatches = 0;
  db.transaction(() => {
    db.prepare(`INSERT INTO partner_contracts(
        provider_id,status,commission_bps,customer_discount_bps,insurance_verified,
        qualification_verified,contract_verified,quality_standard_verified,response_target_minutes,
        starts_at,ends_at,notes,updated_at
      ) VALUES(
        ?,?,0,?,?,?,?,?,?,
        CASE WHEN ?='active' THEN CURRENT_TIMESTAMP ELSE NULL END,
        CASE WHEN ?='ended' THEN CURRENT_TIMESTAMP ELSE NULL END,
        ?,CURRENT_TIMESTAMP
      )
      ON CONFLICT(provider_id) DO UPDATE SET
        status=excluded.status,
        commission_bps=0,
        customer_discount_bps=excluded.customer_discount_bps,
        insurance_verified=excluded.insurance_verified,
        qualification_verified=excluded.qualification_verified,
        contract_verified=excluded.contract_verified,
        quality_standard_verified=excluded.quality_standard_verified,
        response_target_minutes=excluded.response_target_minutes,
        starts_at=CASE WHEN excluded.status='active' THEN COALESCE(partner_contracts.starts_at,CURRENT_TIMESTAMP) ELSE partner_contracts.starts_at END,
        ends_at=CASE WHEN excluded.status='ended' THEN CURRENT_TIMESTAMP ELSE NULL END,
        notes=excluded.notes,
        updated_at=CURRENT_TIMESTAMP`).run(
          providerId,
          status,
          discountBps,
          insuranceVerified,
          qualificationVerified,
          contractVerified,
          qualityStandardVerified,
          responseTarget,
          status,
          status,
          contractNotes,
        );

    if (status !== 'active') closedDispatches = closePendingProviderDispatches(providerId);
    logAdminAudit(
      'admin',
      'partner_contract_update',
      `provider:${providerId}`,
      `status=${status};insurance=${insuranceVerified};qualification=${qualificationVerified};contract=${contractVerified};quality=${qualityStandardVerified};dispatches_closed=${closedDispatches}`,
    );
  })();

  createNotification(
    providerId,
    status === 'active' ? 'Partnerfreigabe aktiv' : 'Partnerstatus aktualisiert',
    status === 'active'
      ? 'Unternehmensprüfung, Vertrag und Qualitätschecks sind vollständig. Passende regionale Anfragen können jetzt disponiert werden.'
      : `Dein Partnerstatus wurde auf ${status} gesetzt. Neue Anfragen werden nur an vollständig geprüfte aktive Partner verteilt.`,
    '/pro/profile',
    'contract',
  );
  if (status === 'active') await redispatchOpenJobs();
  revalidatePath('/admin');
  revalidatePath('/pro');
  revalidatePath('/pro/profile');
  revalidatePath('/notifications');
}
