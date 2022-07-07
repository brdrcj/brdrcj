const SW_VERSION = '9';

self.addEventListener('install', function(event) {
    event.waitUntil(self.skipWaiting());
});

// 监听 service workers 更新时间
self.addEventListener('activate', function(event) {
    // console.log('sw.js 更新');
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            // 清理旧版本
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        // console.log(cacheName, SW_VERSION);
                        if (cacheName !== SW_VERSION) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        ])
    );
});

// 缓存请求
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(res => {
            if (res&&res.status == 200&&res.type=='basic') {
                    console.log("已缓存", res.url);
                return res;
            }
            // 请求是一个流，只能使用一次，为了再次使用这里需要克隆
            const requestToCache = event.request.clone();
            // 针对缓存中没有存在资源这里重新请求一下
            return fetch(requestToCache).then(res => {
                const responseToCache = res.clone();
                caches
                    .open(SW_VERSION)
                    .then(cache => cache.put(requestToCache, responseToCache));
                return res;
            });
        })
    );
});