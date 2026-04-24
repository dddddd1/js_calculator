var CACHE_NAME = 'calculator-v1.0.0';
var urlsToCache = [
    './',
    './index.html',
    './css/cal.css',
    './js/cal.js',
    './images/1_x.png',
    './images/10_x.png',
    './images/x_2.png',
    './images/x_y.png',
    './images/x_y_sqrt.png'
];

self.addEventListener('install', function(event) {
    // 执行安装步骤
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // 如果缓存中有匹配的请求，直接返回缓存的响应
                if (response) {
                    return response;
                }
                
                // 否则，发起网络请求，并将响应缓存起来
                return fetch(event.request).then(
                    function(response) {
                        // 检查响应是否有效
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // 克隆响应，因为响应是流，只能使用一次
                        // 我们需要一份用于缓存，一份用于返回给浏览器
                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});

self.addEventListener('activate', function(event) {
    // 清理旧的缓存
    var cacheWhitelist = [CACHE_NAME];
    
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
