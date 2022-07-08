importScripts('https://g.alicdn.com/kg/workbox/3.3.0/workbox-sw.js');
workbox.setConfig({
  debug: true,
  modulePathPrefix: 'https://g.alicdn.com/kg/workbox/3.3.0/'
});

// To avoid async issues, we load core before we call it in the callback
workbox.loadModule('workbox-core');
//设置缓存cachestorage的名称
workbox.core.setCacheNameDetails({
    prefix: 'yqtj',
    suffix: 'v1'
});

workbox.routing.registerRoute(
    new RegExp('/'),
    workbox.strategies.staleWhileRevalidate({
        //cache名称
        cacheName: 'html',
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
            })
        ]
    })
);
workbox.skipWaiting();
workbox.clientsClaim();