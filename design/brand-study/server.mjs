import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const directory = path.dirname(fileURLToPath(import.meta.url));
const repository = path.resolve(directory, '../..');
const routes = new Map([
  ['/', ['design/brand-study/index.html', 'text/html; charset=utf-8']],
  ['/study.css', ['design/brand-study/study.css', 'text/css; charset=utf-8']],
  ['/study.js', ['design/brand-study/study.js', 'text/javascript; charset=utf-8']],
  ['/brand/logo.png', ['public/brand/logo-full.png', 'image/png']],
  ['/fonts/inter.woff2', ['src/fonts/InterVariable.woff2', 'font/woff2']],
  ['/images/home.jpg', ['public/images/marketing/family-home.jpg', 'image/jpeg']],
  ['/images/partner.jpg', ['public/images/marketing/partner-doorstep.jpg', 'image/jpeg']]
]);

export async function startServer(port = 0) {
  const server = http.createServer(async (request, response) => {
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('X-Robots-Tag', 'noindex, nofollow');
    response.setHeader('Content-Security-Policy', "default-src 'none'; img-src 'self'; font-src 'self'; script-src 'self'; style-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'");
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405); response.end('Method not allowed'); return;
    }
    const url = new URL(request.url, 'http://127.0.0.1');
    const route = routes.get(url.pathname);
    if (!route) { response.writeHead(404); response.end('Not found'); return; }
    try {
      const bytes = await readFile(path.join(repository, route[0]));
      response.writeHead(200, { 'Content-Type': route[1], 'Content-Length': bytes.length });
      response.end(request.method === 'HEAD' ? undefined : bytes);
    } catch {
      response.writeHead(500); response.end('Required study asset unavailable');
    }
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', resolve);
  });
  return server;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const requested = process.env.EH_BRAND_PORT === undefined ? 4179 : Number(process.env.EH_BRAND_PORT);
  if (!Number.isInteger(requested) || requested < 0 || requested > 65535) throw new Error('Invalid EH_BRAND_PORT');
  const server = await startServer(requested);
  process.stdout.write(JSON.stringify({ url: 'http://127.0.0.1:' + server.address().port }) + '\n');
}
