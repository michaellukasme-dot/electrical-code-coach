/* service-worker.js — Electrical Code Coach · PWA SURFACE
   v2.0.10 deploy: cache bumped ecc-v2 -> ecc-v3 to push the AA-CALC-CORE v0.5 engine
   (Sader Table 250.66 GEC safety fix + Ampacity vendor) to installed apps + returning
   browsers (cache-first shell otherwise serves stale). Deploy as service-worker.js. */
const CACHE='ecc-v3';
const SHELL=['./','./index.html','./manifest.json','./apple-touch-icon.png',
  './icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{
    if(resp&&resp.ok){const copy=resp.clone();const u=e.request.url;
      if(u.startsWith(self.location.origin)||u.indexOf('fonts.g')>-1){caches.open(CACHE).then(c=>c.put(e.request,copy));}}
    return resp;
  }).catch(()=>caches.match('./index.html'))));
});
