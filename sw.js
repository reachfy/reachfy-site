// يحفظ واجهة التطبيق ليفتح بسرعة وبدون إنترنت. البيانات الحية لا تُخزَّن هنا.
const CACHE = 'reachfy-v1';
const SHELL = ['/', '/icon-192.png', '/icon-512.png', '/manifest.webmanifest'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  // الشبكة أولاً (أحدث نسخة)، والنسخة المحفوظة عند انقطاع الإنترنت
  e.respondWith(fetch(e.request).then((r) => { if (r.ok && u.pathname === '/') caches.open(CACHE).then((c) => c.put('/', r.clone())); return r; }).catch(() => caches.match(e.request).then((m) => m || caches.match('/'))));
});
