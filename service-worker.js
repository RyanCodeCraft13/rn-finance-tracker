self.addEventListener("install", e=>{
  console.log("RN Finance Tracker Service Worker Installed");
});

self.addEventListener("fetch", e=>{
  e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
});
