/* ═══════════════════════════════════════════════════════════════════════
   وجبتنا — Service Worker
   • القشرة الثابتة (HTML/CSS/الخطوط/الأيقونات) كتتخزن باش الموقع يتفتح فوراً
   • صفحات/سكربتات: الشبكة أولاً (باش التحديثات تبان مباشرة) مع fallback للكاش
   • صور/خطوط/أيقونات: الكاش أولاً (ما كتتبدلش)
   • Firebase (Firestore/Auth) ما كيتخزنش هنا — عندو التزامن والقاعدة المحلية ديالو
   ═══════════════════════════════════════════════════════════════════════ */

const VERSION = "wajbatna-v1";
const SHELL_CACHE = `${VERSION}-shell`;
const RUNTIME_CACHE = `${VERSION}-runtime`;

const SHELL = [
  "./",
  "./index.html",
  "./404.html",
  "./css/main.css",
  "./js/app.js",
  "./js/firebase.js",
  "./js/i18n.js",
  "./manifest.webmanifest",
  "./fonts/tajawal-400.woff2",
  "./fonts/tajawal-700.woff2",
  "./fonts/tajawal-800.woff2",
  "./img/logo.png",
  "./img/icons/icon-192.png",
  "./img/icons/icon-512.png",
  "./img/icons/favicon-32.png",
  "./img/icons/panier.webp",
  "./img/icons/dejeuner.webp",
  "./img/icons/diner.webp",
  "./img/icons/petit-dej.webp",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL))
      .catch(() => {}) // إلا طاحت وحدة، ما نخسروش التثبيت كامل
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isFirebase(url) {
  return /(firebaseio|googleapis\.com\/identitytoolkit|securetoken|firebaseinstallations|firebase\.com|gstatic\.com\/firebasejs)/.test(url);
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // Firebase والطلبات الخارجية (الخرائط...) ما نتدخلوش فيها
  if (!sameOrigin || isFirebase(req.url)) return;

  // تنقل بين الصفحات: الشبكة أولاً، وإلا الكاش، وإلا صفحة 404
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(async () => (await caches.match(req)) || (await caches.match("./index.html")) || (await caches.match("./404.html")))
    );
    return;
  }

  // سكربتات/أنماط/manifest: الشبكة أولاً مع كاش احتياطي
  if (/\.(?:js|css|webmanifest)$/.test(url.pathname)) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(async () => (await caches.match(req)) || Response.error())
    );
    return;
  }

  // صور/خطوط/أيقونات: الكاش أولاً
  if (/\.(?:png|jpe?g|webp|avif|svg|ico|woff2?)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            const copy = res.clone();
            caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy)).catch(() => {});
            return res;
          })
      )
    );
  }
});

// رسالة من الصفحة باش نمسحو الكاش القديم بعد تحديث مهم
self.addEventListener("message", (event) => {
  if (event.data === "skip-waiting") self.skipWaiting();
});
