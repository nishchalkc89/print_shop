const CACHE = "printcloud-v1";

const APP_SHELL = [
  "/",
  "/flow/upload",
  "/flow/configure",
  "/flow/summary",
  "/flow/printing",
  "/flow/completed",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(APP_SHELL)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  // Only handle GET requests for same origin
  if (request.method !== "GET" || !request.url.startsWith(self.location.origin)) return;

  // Network-first for navigation (HTML), cache-first for assets
  const isNavigation = request.mode === "navigate";

  if (isNavigation) {
    e.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(request, clone));
          return res;
        })
        .catch(() => caches.match(request).then((cached) => cached ?? caches.match("/"))),
    );
  } else {
    e.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ??
          fetch(request).then((res) => {
            if (res.ok) {
              const clone = res.clone();
              caches.open(CACHE).then((c) => c.put(request, clone));
            }
            return res;
          }),
      ),
    );
  }
});
