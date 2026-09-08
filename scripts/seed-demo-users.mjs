#!/usr/bin/env node
/**
 * Creates/repairs and then verifies both public demo identities.
 *   kunde@demo.einfachhausen.de / admin
 *   handwerker@demo.einfachhausen.de / admin
 *
 * Requires SUPABASE_SERVICE_KEY or SUPABASE_SERVICE_ROLE_KEY.
 */
const url = process.env.SUPABASE_URL || 'https://supabase.delqhi.com';
const service = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const anon = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || service;
if (!service) throw new Error('SUPABASE_SERVICE_KEY missing');

const adminHeaders = {
  apikey: service,
  Authorization: `Bearer ${service}`,
  'Content-Type': 'application/json',
  'User-Agent': 'eh-seed/2.0',
};
const DEMOS = [
  { email: 'kunde@demo.einfachhausen.de', password: 'admin' },
  { email: 'handwerker@demo.einfachhausen.de', password: 'admin' },
];

async function findUser(email) {
  for (let page = 1; page <= 100; page += 1) {
    const res = await fetch(`${url}/auth/v1/admin/users?page=${page}&per_page=1000`, { headers: adminHeaders });
    if (!res.ok) throw new Error(`list users failed: HTTP ${res.status}`);
    const data = await res.json();
    const users = data.users || [];
    const hit = users.find((user) => (user.email || '').toLowerCase() === email.toLowerCase());
    if (hit) return hit;
    if (users.length < 1000) return null;
  }
  throw new Error(`demo user lookup exceeded pagination budget for ${email}`);
}

async function verifyCredentials(email, password) {
  const res = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      apikey: anon,
      Authorization: `Bearer ${anon}`,
      'Content-Type': 'application/json',
      'User-Agent': 'eh-demo-verify/2.0',
    },
    body: JSON.stringify({ email, password }),
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`demo login failed for ${email}: HTTP ${res.status} ${body.slice(0, 240)}`);
  const parsed = JSON.parse(body);
  if (!parsed.access_token || !parsed.user?.id) throw new Error(`demo login returned no authenticated session for ${email}`);
  return parsed.user.id;
}

for (const demo of DEMOS) {
  const existing = await findUser(demo.email);
  if (existing) {
    const res = await fetch(`${url}/auth/v1/admin/users/${existing.id}`, {
      method: 'PUT',
      headers: adminHeaders,
      body: JSON.stringify({ password: demo.password, email_confirm: true }),
    });
    if (!res.ok) throw new Error(`demo user repair failed for ${demo.email}: HTTP ${res.status}`);
    console.log(`${demo.email} repaired`);
  } else {
    const res = await fetch(`${url}/auth/v1/admin/users`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({ email: demo.email, password: demo.password, email_confirm: true }),
    });
    if (!res.ok) throw new Error(`demo user creation failed for ${demo.email}: HTTP ${res.status} ${(await res.text()).slice(0, 240)}`);
    console.log(`${demo.email} created`);
  }

  const subject = await verifyCredentials(demo.email, demo.password);
  console.log(`${demo.email} login verified (${subject})`);
}

console.log(`Demo accounts verified: ${DEMOS.length}/${DEMOS.length}`);
