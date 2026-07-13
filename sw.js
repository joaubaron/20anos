// Service Worker 
// Toda vez que trocar fotos/áudios, a versão será atualizada automaticamente pelo deploy.yml
const CACHE_VERSION = '13.07.2026-1118';
const CACHE_NAME = `20anos-${CACHE_VERSION}`;

const ASSETS = [
'./20anos.html',
'./manifest.json',
'./fotos/fotobg.webp',
'./fotos/carta.png',
'./lavitaadesso.mp3',
'./viversemar.mp3',
'./fotos/foto1.webp',
'./fotos/foto2.webp',
'./fotos/foto3.webp',
'./fotos/foto4.webp',
'./fotos/foto5.webp',
'./fotos/foto6.webp',
'./fotos/foto7.webp',
'./fotos/foto8.webp',
'./fotos/foto9.webp',
'./fotos/foto10.webp',
'./fotos/foto11.webp',
'./fotos/foto12.webp',
'./fotos/foto13.webp',
'./fotos/foto14.webp',
'./fotos/foto15.webp',
'./fotos/foto16.webp',
'./fotos/foto17.webp',
'./fotos/foto18.webp',
'./fotos/foto19.webp',
'./fotos/foto20.webp'
];

// Instala e guarda cada arquivo individualmente.
// Se algum não existir, só aquele falha - não trava o cache dos outros.
self.addEventListener('install', (event) => {
self.skipWaiting();
event.waitUntil(
caches.open(CACHE_NAME).then((cache) => {
return Promise.all(
ASSETS.map((url) => {
const opts = url.includes('20anos.html') ? { cache: 'no-store' } : {};
return fetch(url, opts)
.then((res) => res.ok && cache.put(url, res))
.catch(() => {});
})
);
})
);
});

// Remove caches de versões antigas quando uma nova é ativada.
self.addEventListener('activate', (event) => {
event.waitUntil(
caches.keys().then((keys) =>
Promise.all(
keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
)
).then(() => self.clients.claim())
);
});

// Estratégia: responde rápido com o cache, e atualiza o cache em segundo plano
// (assim funciona offline, mas ainda pega atualizações quando há internet).
self.addEventListener('fetch', (event) => {
if (event.request.method !== 'GET') return;

event.respondWith(
caches.match(event.request).then((cached) => {
const networkFetch = fetch(event.request)
.then((response) => {
if (response && response.status === 200) {
const copy = response.clone();
caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
}
return response;
})
.catch(() => cached);

return cached || networkFetch;
})
);
});
