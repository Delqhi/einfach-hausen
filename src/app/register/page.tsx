import type { Metadata } from 'next';
import Link from 'next/link';
import { RegisterFunnel } from '@/components/register-funnel';
import { registerAction } from '@/app/actions';
import { db } from '@/lib/db';
import { geoSuggest } from '@/lib/geo';
import authStyles from '@/components/marketing/auth.module.css';

/** SEO P0: Registrierungs-Flow — nicht indexieren. */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function Register({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const provider = sp.role === 'provider';
  const initialRequest = !provider ? String(sp.request || '').trim().slice(0, 700) : '';
  const categories = provider ? db.prepare(`SELECT slug,title,description FROM provider_categories WHERE active=1 ORDER BY CASE slug WHEN 'handwerk' THEN 1 WHEN 'dienstleistung' THEN 2 WHEN 'makler' THEN 3 WHEN 'gutachter' THEN 4 ELSE 9 END,title`).all() as any[] : [];
  const services = provider ? db.prepare(`SELECT slug,title,category FROM service_catalog WHERE active=1 ORDER BY category,title`).all() as any[] : [];
  const geo = await geoSuggest();
  return (
    <main className={authStyles.authShell}>
      <div className={authStyles.authMain} style={{ maxWidth: 640, margin: '0 auto', padding: '40px 20px 64px' }}>
        <div className={authStyles.authCard}>
          <div className={authStyles.authIntro}>
            <span className={authStyles.authEyebrow}>{provider ? 'Für Betriebe' : 'Kostenlos starten'}</span>
            <h1>{provider ? 'Als Anbieter starten.' : 'Dein Zuhause. Alles geregelt.'}</h1>
            <p>Los geht&apos;s – in wenigen Schritten.</p>
          </div>
          <RegisterFunnel
            action={registerAction}
            role={provider ? 'provider' : 'homeowner'}
            categories={categories}
            services={services}
            initialRequest={initialRequest}
            error={sp.error}
            suggestedPostcode={geo.postcode}
            suggestedCity={geo.city}
          />
          <p className={authStyles.authSwitch}>Schon ein Konto? <Link href="/login">Anmelden</Link></p>
          <p className={authStyles.authLegal}>Mit der Anmeldung akzeptierst du unsere <Link href="/agb">AGB</Link> und <Link href="/datenschutz">Datenschutzerklärung</Link>.</p>
        </div>
      </div>
    </main>
  );
}
