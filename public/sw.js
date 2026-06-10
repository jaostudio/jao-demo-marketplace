const CACHE = 'likha-v3'

const STATIC_ASSETS = [
  '/',
  '/favicon.svg',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
]

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(STATIC_ASSETS)),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      ),
    ]),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip Next.js internal paths — let the browser handle them normally
  if (url.pathname.startsWith('/_next/')) return

  // Skip non-GET requests (Server Actions, form submissions — Cache API only supports GET)
  if (request.method !== 'GET') return

  // API calls — network first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request))
    return
  }

  // Static assets (images, fonts) — cache first
  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    url.pathname.match(/\.(svg|png|jpg|jpeg|webp|woff2?)$/)
  ) {
    event.respondWith(cacheFirst(request))
    return
  }

  // Pages — network first with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request))
    return
  }

  // Everything else — network first
  event.respondWith(networkFirst(request))
})

async function cacheFirst(request) {
  try {
    const cached = await caches.match(request)
    if (cached) return cached
    const response = await fetch(request)
    if (response?.status === 200) {
      const cache = await caches.open(CACHE)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    return new Response('', { status: 408 })
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request)
    if (request.method === 'GET' && response?.status === 200) {
      const cache = await caches.open(CACHE)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    const cached = await caches.match(request)
    if (cached) return cached
    if (request.mode === 'navigate') {
      return caches.match('/')
    }
    return new Response('Offline', { status: 503 })
  }
}
