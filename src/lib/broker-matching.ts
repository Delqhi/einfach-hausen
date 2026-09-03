import { db } from './db';
import { providerReceivesNewJobs } from './partner-config';

function tokens(value: string) {
  return (value || '')
    .split(/[;,\n]+/)
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

function inRange(value: number | null | undefined, min: number | null | undefined, max: number | null | undefined) {
  if (value == null) return true;
  if (min != null && value < min) return false;
  if (max != null && value > max) return false;
  return true;
}

function rangeScore(value: number | null | undefined, min: number | null | undefined, max: number | null | undefined) {
  if (value == null || (min == null && max == null)) return 5;
  return inRange(value, min, max) ? 10 : 0;
}

function regionMatches(property: any, profile: any) {
  const regions = tokens(profile.regions_text);
  if (!regions.length) return false;
  const postcode = String(property.postcode || '').trim().toLowerCase();
  const address = String(property.address || '').trim().toLowerCase();
  if (!postcode && !address) return false;
  return regions.some((region) => postcode.startsWith(region) || address.includes(region));
}

function propertyTypeMatches(property: any, profile: any) {
  const types = tokens(profile.property_types_text);
  if (!types.length) return true;
  const propertyType = String(property.property_type || '').trim().toLowerCase();
  if (!propertyType) return false;
  return types.some((type) => propertyType.includes(type) || type.includes(propertyType));
}

function propertyUseTypeMatches(property: any, profile: any) {
  const useType = String(property.use_type || 'residential');
  if (useType === 'commercial') return !!profile.commercial;
  if (useType === 'mixed') return !!profile.residential && !!profile.commercial;
  return !!profile.residential;
}

function estimatedValue(property: any) {
  return property.estimated_value_min != null && property.estimated_value_max != null
    ? Math.round((Number(property.estimated_value_min) + Number(property.estimated_value_max)) / 2)
    : null;
}

export function brokerProfileMatches(property: any, profile: any) {
  return regionMatches(property, profile)
    && propertyTypeMatches(property, profile)
    && propertyUseTypeMatches(property, profile)
    && inRange(estimatedValue(property), profile.min_price, profile.max_price)
    && inRange(property.living_area, profile.min_living_area, profile.max_living_area)
    && inRange(property.plot_area, profile.min_plot_area, profile.max_plot_area);
}

export function brokerMatchScore(property: any, profile: any) {
  if (!brokerProfileMatches(property, profile)) return 0;
  let score = 55;
  score += propertyTypeMatches(property, profile) ? 15 : 0;
  score += rangeScore(estimatedValue(property), profile.min_price, profile.max_price);
  score += rangeScore(property.living_area, profile.min_living_area, profile.max_living_area);
  score += rangeScore(property.plot_area, profile.min_plot_area, profile.max_plot_area);
  return Math.max(0, Math.min(100, Math.round(score)));
}

function brokerProfile(providerId: number) {
  return db.prepare(`SELECT bp.*,pp.business_name,pp.rating,pp.rating_count
    FROM broker_search_profiles bp
    JOIN provider_profiles pp ON pp.user_id=bp.provider_id
    JOIN provider_category_assignments ca ON ca.provider_id=bp.provider_id AND ca.category_slug='makler'
    JOIN provider_categories pc ON pc.slug=ca.category_slug AND pc.active=1
    WHERE bp.provider_id=? AND pp.verified=1`).get(providerId) as any | undefined;
}

export function isBrokerEligibleForProperty(providerId: number, property: any) {
  const profile = brokerProfile(providerId);
  return !!profile && providerReceivesNewJobs(providerId) && brokerProfileMatches(property, profile);
}

export function createBrokerMatches(saleLeadId: number) {
  const lead = db.prepare(`SELECT l.*,p.* FROM sale_leads l JOIN properties p ON p.id=l.property_id WHERE l.id=?`).get(saleLeadId) as any;
  if (!lead) return [];

  const candidates = db.prepare(`SELECT bp.*,pp.business_name,pp.rating,pp.rating_count
    FROM broker_search_profiles bp
    JOIN provider_profiles pp ON pp.user_id=bp.provider_id
    JOIN provider_category_assignments ca ON ca.provider_id=bp.provider_id AND ca.category_slug='makler'
    JOIN provider_categories pc ON pc.slug=ca.category_slug AND pc.active=1
    WHERE pp.verified=1`).all() as any[];

  const ranked = candidates
    .filter((broker) => providerReceivesNewJobs(broker.provider_id))
    .filter((broker) => brokerProfileMatches(lead, broker))
    .map((broker) => ({ ...broker, score: brokerMatchScore(lead, broker) }))
    .sort((a, b) => b.score - a.score || Number(b.rating || 0) - Number(a.rating || 0) || a.provider_id - b.provider_id)
    .slice(0, 12);

  const rankedIds = new Set(ranked.map((broker) => Number(broker.provider_id)));
  const existing = db.prepare(`SELECT id,provider_id,status FROM broker_lead_matches WHERE sale_lead_id=?`).all(saleLeadId) as Array<{ id: number; provider_id: number; status: string }>;
  const revokeSuggestion = db.prepare(`UPDATE broker_lead_matches SET status='revoked',updated_at=CURRENT_TIMESTAMP WHERE id=? AND status='suggested'`);
  for (const match of existing) {
    if (!rankedIds.has(match.provider_id) && match.status === 'suggested') revokeSuggestion.run(match.id);
  }

  const insert = db.prepare(`INSERT INTO broker_lead_matches(sale_lead_id,provider_id,match_score,status)
    VALUES(?,?,?,'suggested')
    ON CONFLICT(sale_lead_id,provider_id) DO UPDATE SET
      match_score=excluded.match_score,
      status=CASE WHEN broker_lead_matches.status='revoked' THEN 'suggested' ELSE broker_lead_matches.status END,
      updated_at=CURRENT_TIMESTAMP`);
  for (const broker of ranked) insert.run(saleLeadId, broker.provider_id, broker.score);

  if (ranked.length) {
    db.prepare(`UPDATE sale_leads SET status=CASE WHEN status='interested' THEN 'matched' ELSE status END,updated_at=CURRENT_TIMESTAMP WHERE id=?`).run(saleLeadId);
  } else {
    db.prepare(`UPDATE sale_leads SET status=CASE WHEN status='matched' THEN 'interested' ELSE status END,updated_at=CURRENT_TIMESTAMP WHERE id=?`).run(saleLeadId);
  }
  return ranked;
}
