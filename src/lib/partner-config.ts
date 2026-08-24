import { db } from './db';

export type PartnerContractStatus = 'pending' | 'active' | 'suspended' | 'ended';

export type PartnerActivationCheck = {
  providerId: number;
  providerVerified: boolean;
  verificationApproved: boolean;
  insuranceVerified: boolean;
  qualificationVerified: boolean;
  contractVerified: boolean;
  qualityStandardVerified: boolean;
  contractStatus: PartnerContractStatus;
  eligibleForActivation: boolean;
  receivesNewJobs: boolean;
  missing: string[];
};

const CHECK_LABELS = {
  providerVerified: 'Unternehmen freigegeben',
  verificationApproved: 'Nachweise freigegeben',
  insuranceVerified: 'Betriebshaftpflicht geprüft',
  qualificationVerified: 'Qualifikation/Zulassung geprüft',
  contractVerified: 'Partnervertrag unterschrieben',
  qualityStandardVerified: 'Qualitätsstandard akzeptiert',
} as const;

export function getPartnerActivationCheck(providerId: number): PartnerActivationCheck {
  const row = db.prepare(`SELECT
      p.verified provider_verified,
      v.status verification_status,
      COALESCE(c.status, 'pending') contract_status,
      COALESCE(c.insurance_verified, 0) insurance_verified,
      COALESCE(c.qualification_verified, 0) qualification_verified,
      COALESCE(c.contract_verified, 0) contract_verified,
      COALESCE(c.quality_standard_verified, 0) quality_standard_verified
    FROM provider_profiles p
    LEFT JOIN verification_requests v ON v.provider_id=p.user_id
    LEFT JOIN partner_contracts c ON c.provider_id=p.user_id
    WHERE p.user_id=?`).get(providerId) as {
      provider_verified: number;
      verification_status: string | null;
      contract_status: PartnerContractStatus;
      insurance_verified: number;
      qualification_verified: number;
      contract_verified: number;
      quality_standard_verified: number;
    } | undefined;

  const state = {
    providerVerified: !!row?.provider_verified,
    verificationApproved: row?.verification_status === 'approved',
    insuranceVerified: !!row?.insurance_verified,
    qualificationVerified: !!row?.qualification_verified,
    contractVerified: !!row?.contract_verified,
    qualityStandardVerified: !!row?.quality_standard_verified,
  };
  const missing = (Object.keys(CHECK_LABELS) as Array<keyof typeof CHECK_LABELS>)
    .filter((key) => !state[key])
    .map((key) => CHECK_LABELS[key]);
  const contractStatus = row?.contract_status || 'pending';
  const eligibleForActivation = !!row && missing.length === 0;

  return {
    providerId,
    ...state,
    contractStatus,
    eligibleForActivation,
    receivesNewJobs: eligibleForActivation && contractStatus === 'active',
    missing,
  };
}

export function providerReceivesNewJobs(providerId: number) {
  return getPartnerActivationCheck(providerId).receivesNewJobs;
}

export function closePendingProviderDispatches(providerId: number) {
  return db.prepare(`UPDATE job_dispatches
    SET status='declined', responded_at=CURRENT_TIMESTAMP
    WHERE provider_id=? AND status IN ('sent','viewed')`).run(providerId).changes;
}
