const CACHE='einfach-hausen-shell-v2';
const ICONS=['/icons/icon-192.png','/icons/icon-512.png','/icons/icon-maskable-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ICONS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  const request=event.request; const url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin)return;
  if(url.pathname.startsWith('/icons/')){event.respondWith(caches.match(request).then(hit=>hit||fetch(request)));return;}
  if(request.mode==='navigate')event.respondWith(fetch(request).catch(()=>new Response(`<!doctype html><html lang="de"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#ffffff"><title>Einfach Hausen</title><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;margin:0;background:#fff;color:#111512;display:grid;min-height:100vh;place-items:center;padding:28px;box-sizing:border-box}.box{max-width:460px}h1{font-size:34px;letter-spacing:-.04em;margin:0 0 14px}p{line-height:1.6;color:#687069}button{border:0;border-radius:999px;padding:12px 18px;background:#111512;color:white;font-weight:650}</style><div class="box"><h1>Gerade keine Verbindung.</h1><p>Deine Daten werden nicht aus dem Browser-Cache ersetzt. Sobald du wieder online bist, kannst du direkt an derselben Stelle weitermachen.</p><button onclick="location.reload()">Erneut versuchen</button></div></html>`,{headers:{'Content-Type':'text/html; charset=utf-8'}})));
});
