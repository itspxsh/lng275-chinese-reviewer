const CACHE='lng275-review-v6';
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 const home=await fetch('/',{cache:'no-store'});
 const html=await home.clone().text();
 await cache.put('/',home);
 const assets=[...html.matchAll(/(?:src|href)="(\/_next\/static\/[^"?]+(?:\?[^" ]+)?)"/g)].map(match=>match[1]);
 const response=await fetch('/hanzi-data/_manifest.json',{cache:'no-store'});
 const files=await response.json();
 await cache.addAll(['/hanzi-data/_manifest.json',...new Set(assets),...files.map(file=>`/hanzi-data/${file}`)]);
 await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const keys=await caches.keys();
 await Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)));
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 const request=event.request;
 const url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==location.origin)return;
 const fresh=request.mode==='navigate'||url.pathname.startsWith('/_next/');
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  if(!fresh){const hit=await cache.match(request);if(hit)return hit}
  try{
   const response=await fetch(request,{cache:fresh?'no-store':'default'});
   if(response.ok)event.waitUntil(cache.put(request,response.clone()));
   return response;
  }catch{
   return await cache.match(request)??(request.mode==='navigate'?await cache.match('/'):undefined)??Response.error();
  }
 })());
});
