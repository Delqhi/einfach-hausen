import { Building2, LockKeyhole, MapPin, UserRound } from 'lucide-react';
import { AppShell } from '@/components/shell';
import { ProviderPageIntro, ProviderSectionHeader, ProviderState } from '@/components/provider/workspace';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { getProviderContext } from '@/lib/provider';
import { providerHasCategory } from '@/lib/provider-categories';
import { euro } from '@/lib/format';
import { updateBrokerLeadStatusAction } from '@/app/actions';

export default async function ProLeads() {
  const user = await requireUser('provider');
  const ctx = getProviderContext(user.id);
  if (!ctx) return null;
  const broker = providerHasCategory(ctx.providerId, 'makler');

  if (!broker) {
    return (
      <AppShell role="provider" active="/pro" title="Immobilien-Leads" subtitle="Nur für passende Anbieter">
        <ProviderPageIntro eyebrow="Immobilien" title="Freigegebene Kontakte" description="Immobilienkontakte werden nur angezeigt, wenn die passende Tätigkeit aktiv ist und der Eigentümer ausdrücklich freigegeben hat." />
        <ProviderState
          icon={<Building2 size={21} />}
          title="Keine Makler-Kategorie aktiv"
          description="Wenn dein Unternehmen auch Immobilienvermittlung anbietet, kannst du die Tätigkeit im Partnerprofil ergänzen. Es bleibt dasselbe Konto."
          action={{ href: '/pro/profile', label: 'Partnerprofil öffnen' }}
        />
      </AppShell>
    );
  }

  const matches = db.prepare(`SELECT m.*,l.status lead_status,l.property_id,pr.address,pr.postcode,pr.property_type,pr.living_area,pr.plot_area,pr.estimated_value_min,pr.estimated_value_max,u.first_name,u.last_name,u.email,u.phone,s.permissions_json FROM broker_lead_matches m JOIN sale_leads l ON l.id=m.sale_lead_id JOIN properties pr ON pr.id=l.property_id JOIN users u ON u.id=l.homeowner_id JOIN property_shares s ON s.property_id=l.property_id AND s.provider_id=m.provider_id AND s.purpose='sale' AND s.status='active' WHERE m.provider_id=? ORDER BY m.updated_at DESC`).all(ctx.providerId) as any[];

  return (
    <AppShell role="provider" active="/pro/leads" title="Immobilien-Leads" subtitle="Nur ausdrücklich freigegebene Kontakte">
      <ProviderPageIntro
        eyebrow="Immobilien"
        title="Freigegebene Kontakte"
        description="Hier erscheint nur, was ein Eigentümer für diesen Verkaufszweck ausdrücklich freigegeben hat."
      />
      <div className="privacy-banner pro-privacy">
        <LockKeyhole />
        <div><strong>Nur freigegebene Daten</strong><p>Private Dokumente und vollständige Hausakten bleiben gesperrt. Die Freigabe ist zweckgebunden.</p></div>
      </div>

      <ProviderSectionHeader title="Anfragen" description={`${matches.length} ${matches.length === 1 ? 'freigegebener Kontakt' : 'freigegebene Kontakte'}`} />
      <div className="broker-leads">
        {matches.map((match: any) => (
          <article key={match.id}>
            <div className="broker-lead-head">
              <span className="broker-score"><b>{Math.round(match.match_score)}%</b><small>Passung</small></span>
              <div className="grow">
                <strong>{match.property_type || 'Immobilie'} in {match.postcode}</strong>
                <p><MapPin /> {match.address || match.postcode}</p>
              </div>
              <span className={`status ${match.status}`}>{match.status}</span>
            </div>
            <div className="broker-lead-grid">
              <div><small>Eigentümer</small><strong>{match.first_name} {match.last_name}</strong><span>{match.email}</span>{match.phone && <span>{match.phone}</span>}</div>
              <div><small>Objekt</small><strong>{match.living_area ? `${match.living_area} m² Wohnfläche` : 'Fläche offen'}</strong><span>{match.plot_area ? `${match.plot_area} m² Grundstück` : ''}</span></div>
              <div><small>Wert</small><strong>{match.estimated_value_min != null && match.estimated_value_max != null ? `${euro(match.estimated_value_min)} – ${euro(match.estimated_value_max)}` : 'Noch nicht bewertet'}</strong></div>
            </div>
            <form action={updateBrokerLeadStatusAction.bind(null, match.id)} className="broker-lead-status">
              <label>Nächster Schritt
                <select name="status" defaultValue={match.status === 'contact_released' ? 'interested' : match.status}>
                  <option value="interested">Interesse bestätigt</option>
                  <option value="inspection">Besichtigung</option>
                  <option value="mandate">Auftrag erhalten</option>
                  <option value="sold">Verkauft</option>
                  <option value="rejected">Nicht passend</option>
                </select>
              </label>
              <button className="btn light">Status speichern</button>
            </form>
          </article>
        ))}
        {matches.length === 0 && (
          <ProviderState
            icon={<UserRound size={21} />}
            title="Noch keine freigegebenen Immobilienanfragen"
            description="Passende Eigentümer sehen dein Unternehmen zunächst als Vorschlag. Erst nach deren ausdrücklicher Freigabe erscheint der Kontakt hier."
          />
        )}
      </div>
    </AppShell>
  );
}
