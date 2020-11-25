# PWA初始 

## 一、对PWA的一些自己的理解
>PWA全称Progressive Web App，即渐进式WEB应用。一种可以提供类似于原生应用程序(native app)体验的网络应用程序(web app)。PWA 可以用来做很多事。其中最重要的是，在离线(offline)时应用程序能够继续运行功能。这是通过使用名为 Service Workers 的网络技术来实现的。

1. 首先 PWA 仍然是一个网页。他不是一向新的框架或者新的技术，他是一系列Web技术的集合
2. PWA 使用到的主要技术有哪些呢？ 他们是做什么的？

    使用到的技术 | 作用 | 
    ---|---|
    Web App Manifest | 在主屏添加app图标 定义手机标题栏和隐藏导航栏
    Service Worker | 用来实现离线
    Cache API 缓存技术| 用来实现离线应用
    Push Notification| 消息推送
## 二、使用Manifest在主屏添加app图标
1. chrome浏览器拥有将网页添加到手机主屏的功能。当点击这个选项后，会在主屏上增加一个网页的快捷方式。如下图

![图1.png](https://upload-images.jianshu.io/upload_images/10319049-457a52612f71ff07.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

2. 如果想让这个快捷方式更像原生应用，需要解决几个问题(这些问题manifest可以帮你解决)。
> 2.1 要有自己的应用图标。</br>
  2.2 打开时显示一个开屏图（不要有白屏）。</br>
  2.3 不要出现地址栏
3. 添加manifest的步骤。
> 3.1 新建一个web项目文件夹，新增配置一个manifest.json的文件，参数说明。
[Web App Manifest（MDN）](https://developer.mozilla.org/zh-CN/docs/Web/Manifest)
```json
    {
    "name":"一个PWA示例",
    "short_name":"PWA示例", // 应用显示在主屏的名字
    "start_url":"/index.html",
    "display":"standalone", // 设置启动样式，让你的网络应用隐藏浏览器的URL地址栏
    "background_color":"#fff",
    "theme_color":"#3eaf7c",
    "icons":[
        {
        "src":"/icon.png",
        "sizes":"120x120",
        "types":"image/png"
        }
    ]
    }
```
> 3.2 然后在新建index页面，在页面中新增一条link。就OK拉 。去看看现在在主屏创建的效果。
```html
<link rel="manifest" href="/manifest.json">
```
效果如下图 

![图2.png](https://upload-images.jianshu.io/upload_images/10319049-e8fca87ee5e140cb.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 三、Service Worker增加离线的能力
### 什么是Service Worker？[解释在这里](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API)
说一说我自己的理解，Service Worker我认为就好像一个运行在你本机中的软件，这个软件起到一个代理的作用，可以截获页面到服务器的请求（缓存离线），并可以接受服务器的消息（推送订阅），他的表现形式是运行一个js文件。特殊的点是：
1. 它的下载是通过首次访问有Service Worker支持的网站时下载的。每24小时充实下载一次，当然也可能更频繁。在首次下载后 页面会直接安装它。安装完以后它会被激活。
2. 它是在浏览器主进程之外单独跑的一个后台进程，这个进程跑的方法是在我们自己写的Service Worker中定义。
3. 即使你离开了浏览器，这个Service Worker 也不会消失 仍然会在应用背后运行。

> 他的生命周期为
<br>install -> installed -> actvating -> Active -> Activated -> Redundant
进入 Redundat状态的条件是：
- 安装(install)失败
- 激活(activating)失败
- 新版本的 Service Worker 替换了它并成为激活状态
<br> （另外注意的是 Service Worker只能运行在https的域名下 或则是 localhost的本机调试中。我们可以用gitbutpage来做，很方便 后面会有演示）
![图3.png](https://upload-images.jianshu.io/upload_images/10319049-e89db8379f182652.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 使用Service Worker实现离线
（代码都放到了gitpage上了。[地址点击这里](https://github.com/chen735623058/testPWA)）。
<br>实现代码说明：
1. 在html页面中注册Service Worker。注册前别忘了检验一下浏览器是否支持。注册后你的页面就拥有了Service Worker能力了 只不过现在它还啥都没做。
```html
<script>
    // 检测浏览器是否支持SW
	if(navigator.serviceWorker != null){
        // 其中sxf_sw.js就是我们实现Service worker方法的js文件
		navigator.serviceWorker.register('sxf_sw.js').then(function (registortion){
			console.log('支持sw', registortion.scope);
		}).catch(function (whut) {
			console.log('service worker has registered failure!');
		})
	}
</script>
```
2. 编写sxf_sw.js，文件 让他拥有相应的能力。
```js
    //cachestorage名称，可以加上版本号予以区分
    const OFFLINE_CACHE_PREFIX = 'sxf_offline_page_';
    const CACHE_VERSION = 'v1.0';
    const OFFLINE_CACHE_NAME = OFFLINE_CACHE_PREFIX + CACHE_VERSION;

    //Service Worker安装事件，其中可以预缓存资源
    this.addEventListener('install', function(event) {
        console.log('install');
        //需要缓存的页面资源这里缓存了三个资源。在安装过程中最好不要缓存太多，可能导致安装失败
        var urlsToPrefetch = [
            'index.html',
            'main.css',
            'icon.png'
        ];

        event.waitUntil(
            caches.open(OFFLINE_CACHE_NAME).then(function(cache) {
                return cache.addAll(urlsToPrefetch);
            })
        );
    });

    //Service Worker激活事件
    this.addEventListener('activate', function(event) {
        //在激活事件中清除非当前版本的缓存避免用户存储空间急剧膨胀
        event.waitUntil(caches.keys().then(function(cacheNames) {
            return Promise.all(cacheNames.map(function(cacheName) {
                if (cacheName !== OFFLINE_CACHE_NAME) {
                    if(cacheName.indexOf(OFFLINE_CACHE_PREFIX) != -1) {
                        return caches.delete(cacheName);
                    }
                }
            }));
        }));
    });


    //Service Worker 请求拦截事件
    this.addEventListener('fetch', function(event)  {
        event.respondWith(
            caches.open(OFFLINE_CACHE_NAME).then(function(cache) {
                return cache.match(event.request.url);
            }).then(function(response){
                //response为空表明未匹配成功，交由fetch方法去网络拉取
                if(response) {
                    return response;
                }
                return fetch(event.request);
            })
        );
    });
```
3. 当功能写完以后如何测试我们的功能是否成功呢？这里使用gitpage
- 先注册一个git的仓库。将代码上传到这个仓库里面。然后点击Settings选项卡。配置gitpage页面如下图
![图4](https://upload-images.jianshu.io/upload_images/10319049-4730c2c3900b66de.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- 进入Settings 标签后将，找到下面的Github Pages中的source选项。选择master branch。如下图
![图5.png](https://upload-images.jianshu.io/upload_images/10319049-2712564f7b0de0ff.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
点击确定后就可以在上面看到你的GitHubPages地址了。然后拷贝这个地址。在后面加上index.html。
进入页面。可以看到Hello PWA。然后点击F12进入开发者控制台。选择Application选项。并选择左侧的Service Workers可以看到如下图。
![图6.png](https://upload-images.jianshu.io/upload_images/10319049-5bf8e06cfbcd85ae.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

4. 更新缓存时 只需要修改CACHE_VERSION 这个变量就可以了。

### 使用Service Worker实现推送订阅功能 
（这一部分有个讲的非常好的blog我也是受益匪浅 [地址点击这里](https://github.com/alienzhou/learning-pwa/tree/push)）
下面桌一些自己的理解：
(1) 推送订阅的实现原理并非是我们原来的长连接 或者WebsocketD的形式。它使用了一种叫Web Push的技术。在web push中有三方。
- 浏览器：也就是我们的客户端
- Push Service: 这个由浏览器厂商提供，Chrome 和 firefox都有自己的。
- 后端服务：我们自己的服务。下图是引用 协议草案的流程图
 ```
    +-------+           +--------------+       +-------------+
    |  UA   |           | Push Service |       | Application |
    +-------+           +--------------+       |   Server    |
        |                      |               +-------------+
        |      Subscribe       |                      |
        |--------------------->|                      |
        |       Monitor        |                      |
        |<====================>|                      |
        |                      |                      |
        |          Distribute Push Resource           |
        |-------------------------------------------->|
        |                      |                      |
        :                      :                      :
        |                      |     Push Message     |
        |    Push Message      |<---------------------|
        |<---------------------|                      |
        |                      |                      |
```

步骤说明：
  1. 现在浏览器端订阅消息服务。（这个订阅是和PUSH Service 订阅）。订阅成功后会得到一个PushSubscription 对象。
  2. 将这个对象的信息发送给我们的后端服务。
  3. 我们后端服务通过使用 web-push 这个组件的方法可以将消息推送给Push Service。 推送是需要用到 PushSubscription 对象中的endpoint
  4. Push Service 根据传递过来的endpoint 找到对应的浏览器，将消息推送给浏览器上的Service Worker 。
  5. 浏览器的 Service Worker 通过监听 push方法可以将数据得到并进行处理。

  在数据的传输过程中需要用到一对公钥私钥进行签名加密，以保证浏览器接收到的信息是自己服务器发送出来的。

(2) 一个没有后台服务的简单实现前端订阅的代码和测试方法。

首先改造我们上面的 index.html 页面的 js 方法如下代码
```js
	// 检测浏览器是否支持SW
        /**
         * base64的相关操作，具体可以参考
         * https://github.com/web-push-libs/web-push#using-vapid-key-for-applicationserverkey
         */
        window.urlBase64ToUint8Array = function (base64String) {
            const padding = '='.repeat((4 - base64String.length % 4) % 4);
            const base64 = (base64String + padding)
                .replace(/\-/g, '+')
                .replace(/_/g, '/');

            const rawData = window.atob(base64);
            const outputArray = new Uint8Array(rawData.length);

            for (let i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i);
            }
            return outputArray;
        }

		// if(navigator.serviceWorker != null){
		// 	navigator.serviceWorker.register('sxf_sw.js').then(function (registortion) {
		// 		console.log('支持sw', registortion.scope);
		// 	}).catch(function (whut) {
		// 		console.log('service worker has registered failure!');
		// 	})
		// }

        function registerServiceWorker(file) {
            return navigator.serviceWorker.register(file);
        }

        function subscribeUserToPush(registration, publicKey) {
            var subscribeOptions = {
                userVisibleOnly: true,
                applicationServerKey: window.urlBase64ToUint8Array(publicKey)
            };
            return registration.pushManager.subscribe(subscribeOptions).then(function (pushSubscription) {
                console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
                return pushSubscription;
            });
        }

        if ('serviceWorker' in navigator && 'PushManager' in window) {
            var publicKey = 'BOEQSjdhorIf8M0XFNlwohK3sTzO9iJwvbYU-fuXRF0tvRpPPMGO6d_gJC_pUQwBT7wD8rKutpNTFHOHN3VqJ0A';
            // 注册service worker
            registerServiceWorker('sxf_sw.js').then(function (registration) {
                console.log('Service Worker 注册成功');
                // 开启该客户端的消息推送订阅功能
                return subscribeUserToPush(registration, publicKey);
            }).then(function (subscription) {
                var body = {subscription: subscription};
                // 为了方便之后的推送，为每个客户端简单生成一个标识
                body.uniqueid = new Date().getTime();
                console.log('uniqueid', body.uniqueid);
                // 将生成的客户端订阅信息存储在自己的服务器上
                return sendSubscriptionToServer(JSON.stringify(body));
            }).then(function (res) {
                console.log(res);
            }).catch(function (err) {
                console.log(err);
            });
        }


        function sendSubscriptionToServer (endpointobj) {
            console.log("存储成功"+endpointobj.toString())
        }
```

然后在 sxf_sw.js 中增加方法
```js
// 监听推送的消息
self.addEventListener('push', function (e) {
    var data = e.data;
    if (e.data) {
        data = data.json();
        console.log('push的数据为：', data);
        self.registration.showNotification(data.text);
    }
    else {
        console.log('push没有任何数据');
    }
});
```

测试时 打开页面，浏览器会询问是否允许通知，点击允许。然后和测试一样进入下图画面
![图7.png](https://upload-images.jianshu.io/upload_images/10319049-7af4498adffe76da.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

此上就是对PWA的浅薄学习，如果有说的不对的 请大家指出