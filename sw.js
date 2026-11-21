const scope = new URL(self.registration.scope);
const cachePrefix = `subbuteo-match:${scope.pathname}:`;
const cacheName = `${cachePrefix}4`;
const entry = new URL('./', scope).href;
const audioAssets = new Set(['./audio/stadium-ambience.mp3', './audio/goal-roar.mp3'].map(path => new URL(path, scope).href));
const assets = new Set([
    ...['./tailwind.css', './manifest.webmanifest', './icon.svg', './icon-180.png', './icon-192.png', './icon-512.png'].map(path => new URL(path, scope).href),
    ...audioAssets
]);

self.addEventListener('install', event => {
    event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(
        [entry, ...assets].map(url => new Request(url, { cache: 'reload' }))
    )));
});

self.addEventListener('activate', event => {
    event.waitUntil(caches.keys().then(keys => Promise.all(keys
        .filter(key => key.startsWith(cachePrefix) && key !== cacheName)
        .map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

async function serveAudioRange(response, range) {
    const audio = await response.blob();
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (match && (match[1] || match[2])) {
        const start = match[1] ? Number(match[1]) : Math.max(0, audio.size - Number(match[2]));
        const end = match[1] && match[2] ? Math.min(Number(match[2]), audio.size - 1) : audio.size - 1;
        if (start <= end) {
            return new Response(audio.slice(start, end + 1, audio.type), {
                status: 206,
                headers: {
                    'Content-Type': audio.type,
                    'Content-Range': `bytes ${start}-${end}/${audio.size}`,
                    'Content-Length': end - start + 1,
                    'Accept-Ranges': 'bytes'
                }
            });
        }
    }
    return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${audio.size}` } });
}

self.addEventListener('fetch', event => {
    const request = event.request;
    if (request.method !== 'GET') return;
    const url = new URL(request.url);
    if (request.mode === 'navigate' && url.origin === scope.origin &&
        [scope.pathname, `${scope.pathname}index.html`].includes(url.pathname)) {
        event.respondWith((async () => {
            const cache = await caches.open(cacheName);
            let response;
            try {
                response = await fetch(request);
                if (response.ok) return response;
            } catch {}
            return await cache.match(entry) ?? response ?? Response.error();
        })());
    } else if (assets.has(url.href)) {
        event.respondWith(caches.open(cacheName).then(async cache => {
            const response = await cache.match(request);
            if (!response) return fetch(request);
            const range = request.headers.get('Range');
            return range && audioAssets.has(url.href) ? serveAudioRange(response, range) : response;
        }));
    }
});