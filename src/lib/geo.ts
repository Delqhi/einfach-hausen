/**
 * Standort-Vorschlag fuer die Registrierung (PLZ vorausfuellen, kein Tracking).
 * Quellen: Cloudflare-Header (kostenlos, ohne Latenz) zuerst, ip-api.com als
 * Fallback (45 req/min free, 1.5s Timeout). Fail-soft: keine PLZ ist ok.
 * Die PLZ landet nur als vorausgefuelltes, aenderbares Formularfeld —
// gespeichert wird erst, was der Nutzer absendet.
 */
export type GeoSuggest = { postcode: string; city: string; country: string };

export async function geoSuggest(): Promise<GeoSuggest> {
  const empty: GeoSuggest = { postcode: '', city: '', country: '' };
  try {
    const { headers } = await import('next/headers');
    const h = await headers();
    const cfZip = (h.get('cf-postal-code') || '').trim();
    const cfCity = (h.get('cf-ipcity') || '').trim();
    const cfCountry = (h.get('cf-ipcountry') || '').trim();
    if (cfZip) return { postcode: cfZip, city: cfCity, country: cfCountry };
    const ip =
      (h.get('cf-connecting-ip') || '').split(',')[0].trim() ||
      (h.get('x-forwarded-for') || '').split(',')[0].trim();
    if (!ip || ip === '127.0.0.1' || ip === '::1') {
      return { postcode: '', city: cfCity, country: cfCountry };
    }
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 1500);
    try {
      const res = await fetch(`http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,zip,city,countryCode`, {
        signal: ctrl.signal,
      });
      const data = (await res.json()) as { status?: string; zip?: string; city?: string; countryCode?: string };
      if (data?.status === 'success') {
        return { postcode: data.zip || '', city: data.city || cfCity, country: data.countryCode || cfCountry };
      }
    } catch {
      // Fallback schlaegt fehl — kein Vorschlag, kein Fehler.
    } finally {
      clearTimeout(timer);
    }
    return { postcode: '', city: cfCity, country: cfCountry };
  } catch {
    return empty;
  }
}
