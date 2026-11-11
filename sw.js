/*
 * Service worker do ResearchHub Coleta.
 *
 * Guarda o app inteiro no aparelho para funcionar sem internet — wi-fi de
 * hospital não entra na conta. Não guarda, não envia e não toca em nenhum
 * dado coletado: os casos ficam no localStorage, fora do alcance daqui.
 *
 * Estratégia: rede primeiro (para pegar versão nova quando houver sinal),
 * caindo para o cache quando não houver.
 */
const CACHE = 'rhcoleta-v1';
const ARQUIVOS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ARQUIVOS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;

  e.respondWith(
    fetch(req)
      .then(res => {
        if (res && res.ok) {
          const copia = res.clone();
          caches.open(CACHE).then(c => c.put(req, copia)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
  );
});
