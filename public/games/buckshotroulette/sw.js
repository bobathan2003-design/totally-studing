// Service Worker to redirect Buckshot Roulette asset requests to Render B2 proxy
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    const b2Files = [
        'index.pck',
        'index.js',
        'index.wasm',
        'index.worker.js',
        'index.audio.worklet.js',
        'index.icon.png',
        'index.apple-touch-icon.png',
        'buckshot.jpeg',
        'meta.json',
    ];

    const filename = url.pathname.split('/').pop();

    if (b2Files.includes(filename)) {
        event.respondWith(
            fetch('https://game-vault-pbhf.onrender.com/api/b2-proxy/buckshotroulette/' + filename, {
                mode: 'cors',
                credentials: 'omit'
            }).then(response => {
                const headers = new Headers(response.headers);
                headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
                headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
                return new Response(response.body, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: headers
                });
            })
        );
    } else {
        event.respondWith(fetch(event.request));
    }
});

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});
