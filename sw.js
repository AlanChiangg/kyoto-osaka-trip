/* 離線快取：頁面先試網路（3 秒內沒回應就用快取），圖示等靜態檔直接用快取。
   官方地鐵圖不放進 repo，而是由使用者的手機從官方網站下載後存在自己的快取裡。
   改了 index.html 要把 VERSION 加 1，手機才會換新。 */
const VERSION = 'keihan-v6';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];
const EXTERNAL = ['https://subway.osakametro.co.jp/img/osakametro_rosenzu_20250404.gif'];

function cacheExternal(c) {
  return Promise.all(EXTERNAL.map(u => fetch(u, { mode: 'no-cors' }).then(r => c.put(u, r)).catch(() => {})));
}

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION)
      .then(c => c.addAll(ASSETS).then(() => cacheExternal(c)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function timeout(ms) { return new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)); }

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  if (EXTERNAL.includes(req.url)) {
    e.respondWith(
      caches.match(req.url).then(hit => hit || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(req.url, copy));
        return res;
      }))
    );
    return;
  }

  if (new URL(req.url).origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    e.respondWith(
      Promise.race([fetch(req), timeout(3000)])
        .then(res => {
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
});
