#!/usr/bin/env node
/**
 * Demo-User in Supabase anlegen/bestaetigen (Demo-Phase, befristet).
 *   kunde@demo.einfachhausen.de / admin  (Kunden-App)
 *   handwerker@demo.einfachhausen.de / admin  (Handwerker-App)
 * Env: SUPABASE_URL (+ Default https://supabase.delqhi.com),
 *      SUPABASE_SERVICE_KEY (oder SUPABASE_SERVICE_ROLE_KEY).
 * Nach der Demo-Phase: User im Supabase-Dashboard deaktivieren + dieses
 * Script + src/lib/demo-accounts.ts + Login-Box entfernen.
 */
const url = process.env.SUPABASE_URL || 'https://supabase.delqhi.com';
const service = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
if (!service) throw new Error('SUPABASE_SERVICE_KEY missing');
const headers = { apikey: service, Authorization: `Bearer ${service}`, 'Content-Type': 'application/json', 'User-Agent': 'eh-seed/1.0' };

const DEMOS = [
  { email: 'kunde@demo.einfachhausen.de' },
  { email: 'handwerker@demo.einfachhausen.de' },
];

async function findUser(email) {
  const res = await fetch(`${url}/auth/v1/admin/users`, { headers });
  if (!res.ok) throw new Error(`list users failed: ${res.status}`);
  const data = await res.json();
  return (data.users || []).find((u) => (u.email || '').toLowerCase() === email);
}

for (const demo of DEMOS) {
  const existing = await findUser(demo.email);
  if (existing) {
    const res = await fetch(`${url}/auth/v1/admin/users/${existing.id}`, {
      method: 'PUT', headers,
      body: JSON.stringify({ password: 'admin', email_confirm: true }),
    });
    console.log(demo.email, existing ? `password reset+confirmed (${res.status})` : '');
  } else {
    const res = await fetch(`${url}/auth/v1/admin/users`, {
      method: 'POST', headers,
      body: JSON.stringify({ email: demo.email, password: 'admin', email_confirm: true }),
    });
    console.log(demo.email, `created (${res.status})`);
  }
}
