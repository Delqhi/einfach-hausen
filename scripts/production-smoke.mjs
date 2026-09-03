const base = (process.env.SMOKE_BASE_URL || 'https://einfachhausen.de').replace(/\/$/, '');
const routes = ['/', '/so-funktionierts', '/eigenheimbesitzer', '/leistungen', '/hausakte', '/partner', '/preise', '/hilfe', '/kontakt', '/sicherheit', '/impressum', '/datenschutz', '/agb', '/barrierefreiheit', '/login', '/register', '/api/live', '/api/health'];
let failed = 0;
for (const route of routes) {
  try {
    const response = await fetch(`${base}${route}`, { redirect: 'manual', signal: AbortSignal.timeout(15000) });
    const allowedRedirect = route === '/' && response.status >= 300 && response.status < 400;
    const ok = response.ok || allowedRedirect;
    if (!ok) { failed += 1; console.error(`FAIL ${route}: HTTP ${response.status}`); }
    else console.log(`PASS ${route}: HTTP ${response.status}`);
    if (route === '/api/health' && response.ok) {
      const body = await response.json();
      if (body.ok !== true || body.checks?.database !== 'ready') { failed += 1; console.error(`FAIL ${route}: unhealthy JSON`); }
      else console.log('PASS /api/health: database ready');
      const cache = response.headers.get('cache-control') || '';
      if (!/no-store/i.test(cache)) { failed += 1; console.error('FAIL /api/health: cache policy is not no-store'); }
    }
  } catch (error) {
    failed += 1;
    console.error(`FAIL ${route}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
if (failed) { console.error(`\n${failed} smoke checks failed`); process.exit(1); }
console.log(`\nProduction smoke passed: ${routes.length} routes at ${base}`);
