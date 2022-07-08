
importScripts(
    "https://cdn.jsdelivr.net/npm/workbox-cdn/workbox/workbox-sw.js"
);
if (workbox) {
    console.log('workbox加载成功');
} else {
    console.log('workbox加载失败');
}

// Note: Ignore the error that Glitch raises about workbox being undefined.
workbox.setConfig({
    debug: true,
  });
  
  // To avoid async issues, we load core before we call it in the callback
  workbox.loadModule('workbox-core');
//设置缓存cachestorage的名称
workbox.core.setCacheNameDetails({
    prefix:'yqtj',
    suffix:'v1'
});

workbox.skipWaiting();
workbox.clientsClaim();
workbox.routing.registerRoute(
    new RegExp('/'),
    workbox.strategies.staleWhileRevalidate({
        //cache名称
        cacheName: 'html',
        plugins: [
            new workbox.expiration.Plugin({
                //cache最大数量
                maxEntries: 30
            })
        ]
    })
);
workbox.routing.registerRoute(
    new RegExp('/static/.+'),
    workbox.strategies.cacheFirst({
        cacheName: 'static',
        plugins: [
            //如果要拿到域外的资源，必须配置
            //因为跨域使用fetch配置了
            //mode: 'no-cors',所以status返回值为0，故而需要兼容
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
            }),
            new workbox.expiration.Plugin({
                maxEntries: 40,
                //缓存的时间
                maxAgeSeconds: 12 * 60 * 60
            })
        ]
    })
);