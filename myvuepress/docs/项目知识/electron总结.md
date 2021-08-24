# Electron总结
<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [Electron总结](#electron总结)
  - [一、Electron 介绍](#一-electron-介绍)
    - [1.1 Electron是什么？](#11-electron是什么)
    - [1.2 为什么用Electron?](#12-为什么用electron)
      - [1.2.1 为什么要做桌面应用，web网页不是也可以完成任务吗？](#121-为什么要做桌面应用web网页不是也可以完成任务吗)
      - [1.2.2 Electron的优点](#122-electron的优点)
      - [1.2.3 Electron适用领域](#123-electron适用领域)
      - [1.2.4 很多知名软件都是用的是Electron](#124-很多知名软件都是用的是electron)
      - [1.2.5 Electron的缺点](#125-electron的缺点)
      - [1.2.5 Electron 和 其他桌面开发框架的对比](#125-electron-和-其他桌面开发框架的对比)
  - [1.3 Electron架构原理浅析](#13-electron架构原理浅析)
    - [1.4 Electron开发与Web开发的不同](#14-electron开发与web开发的不同)
      - [1.4.1 主进程和渲染进程](#141-主进程和渲染进程)
      - [1.4.2 进程间通信](#142-进程间通信)
      - [1.4.3 原生能力](#143-原生能力)
      - [1.4.4 无跨域问题](#144-无跨域问题)
  - [二、Electron-vue介绍](#二-electron-vue介绍)
    - [2.1 什么是Electron-vue](#21-什么是electron-vue)
    - [2.2 为什么使用Electron-vue](#22-为什么使用electron-vue)
    - [2.3 项目结构](#23-项目结构)
  - [三、Electron-vue开发实践](#三-electron-vue开发实践)
    - [3.1 开发环境及项目初始化](#31-开发环境及项目初始化)
    - [3.2 Main进程的开发](#32-main进程的开发)
      - [3.2.1 app模块](#321-app模块)
      - [3.2.2  BrowserWindow模块](#322-browserwindow模块)
    - [3.3 Renderer进程开发](#33-renderer进程开发)
      - [3.3.1 请使用Hash模式](#331-请使用hash模式)
      - [3.3.2 drag&drop的避免](#332-dragdrop的避免)
      - [3.3.3 remote模块的使用](#333-remote模块的使用)
      - [3.3.4 main进程和renderer进程的通信](#334-main进程和renderer进程的通信)
    - [3.4 总结](#34-总结)
  - [四、踩坑之旅](#四-踩坑之旅)
    - [4.1 Electron开发的调试](#41-electron开发的调试)
      - [4.1.1 关于Renderer进程的调试](#411-关于renderer进程的调试)
      - [4.1.2 关于主进程的调试（重点）](#412-关于主进程的调试重点)
    - [4.2 支持JSX的编译，升级用到的库的版本](#42-支持jsx的编译升级用到的库的版本)
      - [4.2.1 支持JSX的编译](#421-支持jsx的编译)
      - [4.2.2 升级babel6到7](#422-升级babel6到7)
      - [4.2.3 升级electron](#423-升级electron)
    - [4.3 在线自动更新和热更新](#43-在线自动更新和热更新)
      - [4.3.1 官方社区解决方案 "electron-updater"](#431-官方社区解决方案-electron-updater)
      - [4.3.2 自定义解决方案一](#432-自定义解决方案一)
      - [4.3.3 自定义解决方案二](#433-自定义解决方案二)
      - [4.3.4 自动更新的方法对比和建议](#434-自动更新的方法对比和建议)

<!-- /code_chunk_output -->

## 一、Electron 介绍

### 1.1 Electron是什么？
Electron 是由 Github 开发的开源框架，它允许开发者使用 Web 技术构建跨平台桌面应用。
![avatar](https://imagehouse-1256089536.cos.ap-guangzhou.myqcloud.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20210323150230.png)

<b>图解： </b>
electron由Node.js+Chromium+Native APIs构成。你可以理解成，它是一个得到了Node.js和基于不同平台的Native APIs加强的Chromium浏览器，可以用来开发跨平台的桌面级应用。
它的开发主要涉及到两个进程的协作——Main（主）进程和Renderer（渲染）进程。简单的理解两个进程的作用：
1. Main进程主要通过Node.js、Chromium和Native APIs来实现一些系统以及底层的操作，比如创建系统级别的菜单，操作剪贴板，创建APP的窗口等。
2. Renderer进程主要通过Chromium来实现APP的图形界面——就是平时我们熟悉的前端开发的部分，不过得到了electron给予的加强，一些Node的模块（比如fs）和一些在Main进程里能用的东西（比如Clipboard）也能在Render进程里使用。
3. Main进程和Renderer进程通过ipcMain和ipcRenderer来进行通信。通过事件监听和事件派发来实现两个进程通信，从而实现Main或者Renderer进程里不能实现的某些功能。

### 1.2 为什么用Electron?

#### 1.2.1 为什么要做桌面应用，web网页不是也可以完成任务吗？

1. 他可以摆脱浏览器的沙盒机制，可以访问操作系统层面的东西。我们在网页上面只能借助于后台服务去干这种事，然后通过http告诉前端页面，如果要处理本地文件，还得将文件传到服务器上去，让服务器处理。
2. 更好的用户体验，不管我们是做成B/S的web还是做成客户端的形式，最终的目的其实是在实现功能需求的同时还是最求更好的用户体验，在用户体验上桌面应用无疑更上一层。就像你webApp和原生APP比较，原生无疑还是体验更好。
3. 离线可用。
4. 更快捷的用户入口。

#### 1.2.2 Electron的优点
1. 他让我摆脱了不同浏览器之间的差异和版本的限制，由于electron是基于Chromium的（Chromium是chrome的开发者版本），他完全遵循W3C的标准，对ES,CSS,BOM，DOM的最新规范都有很好的支持，所以我们在写代码的时候，什么ES6,7,8,DOM0,2,3都大胆的用起来。
2. 基于Node,生态成熟，有足够丰富的第三方包来支持我们的开发。没必要自己再绞尽脑汁的去想某个功能的实现，别人写的npm包早已帮我们实现，这就是”拿来主义”的好处。
3. 可以开发跨平台的桌面应用，就像weex宣传的那样“write once,run everyWhere”,只需要写一份代码，打包出来的应用可以在windows,linux，mac OS上面运行。当然这是最理想的情况，无论是RN，weex还是electron,要做到多端共用，还是需要在代码中做一定的适配的，大概有百分之八十是共用的吧，剩下的百分之二十还是需要兼容一下。
4. 开发图形界面前所未有的容易——比起C#\QT\MFC等传统图形界面开发技术，通过前端的图形化界面开发明显更加容易和方便。得益于Chromium，这种开发模式得以实现。
5. 成熟的社区、活跃的核心团队，大部分electron相关的问题你可以在社区、github issues、Stack Overflow里得到答案。开发的障碍进一步降低。
6. 前端工程师储备充足

#### 1.2.3 Electron适用领域

![avatar](https://imagehouse-1256089536.cos.ap-guangzhou.myqcloud.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20210323170945.png)

#### 1.2.4 很多知名软件都是用的是Electron
![avatar](https://imagehouse-1256089536.cos.ap-guangzhou.myqcloud.com/screenshot-20210323-171252.png)


#### 1.2.5 Electron的缺点
1. 应用体积过大。由于内部包装了Chromium和Node.js，使得打包体积（使用electron-builder）在mac上至少是45M+起步，在windows上稍微好一点，不过也要35M+起步。不过相比早期打包体积100M+起步来说，已经好了不少。不过解压后安装依然是100M+起步。
2. 受限于Node.js和Native APIs的一些支持度的问题，它依然有所局限。一些功能依然无法实现。比如无法获取在系统文件夹里选中的文件，而必须调用web的File或者node的fs接口才可以访问系统文件。
3. 应用性能依旧是个问题。所以做轻量级应用没问题，重量级应用尤其是CPU密集型应用的话很是问题。

#### 1.2.5 Electron 和 其他桌面开发框架的对比
![avatar](https://imagehouse-1256089536.cos.ap-guangzhou.myqcloud.com/screenshot-20210323-172920.png)

## 1.3 Electron架构原理浅析

<b>Chromiun架构</b>
![avatar](https://imagehouse-1256089536.cos.ap-guangzhou.myqcloud.com/screenshot-20210323-173424.png)

Chromium 是 Chrome 的开源版，也是一个浏览器。
- 主进程的 RenderProcessHost 和 渲染进程的 RenderProcess 专门处理 IPC 事件。
- 渲染进程的 RenderView： 我们的页面就是在这里基于 Webkit 排版展示出来的。
- ResourceDispatcher 处理资源请求，当页面需要请求资源时，通过 ResourceDispatcher，创建一个请求 ID 转发到 IPC，在 Browser 进程中处理然后返回。

<b>Electron 架构</b>
![avatar](https://imagehouse-1256089536.cos.ap-guangzhou.myqcloud.com/screenshot-20210323-173751.png)

- 在各个进程中暴露了 Native API (Main Native API、Renderer Native API)
- 引入 Node.js

> 不过要实现Electron要解决一个难题：如何将Node.js和Chromiums整合。Node.js 事件循环基于 libuv，但 Chromium 基于 message_pump。

解决思路有两种
- 将Chromium集成到Node.js中 ：用libuv实现message_pump
- 将Node.js 集成到Chromium中。
第一种是NW.js 就是这么做的。Electron 前期也是这样尝试的，结果发现在渲染进程里实现比较容易，但是在主进程里却很麻烦，因为各个系统的 GUI 实现都不同，Mac 是 NSRunLoop，Linux 是 glib，不仅工程量十分浩大，而且一些边界情况处理起来也十分棘手。
后来Electron选择了第二种 ，Electron 起了一个新的安全线程去轮询 backend_fd，当 Node.js 有一个新的事件后，通过 PostTask 转发到 Chromium 的事件循环中，这样就实现了 Electron 的事件融合。

### 1.4 Electron开发与Web开发的不同
#### 1.4.1 主进程和渲染进程
<b>主进程（Main进程）：</b>
- Electron 运行 package.json 的 main 脚本的进程被称为主进程
- 每个应用只有一个主进程
- 管理原生 GUI，典型的窗口（BrowserWindow、Tray、Dock、Menu）
- 创建渲染进程
- 控制应用生命周期（app）

<b>渲染进程（Randerer进程）：</b>

- 展示 Web 页面的进程称为渲染进程
- 通过 Node.js、Electron 提供的 API 可以跟系统底层打交道
- 一个 Electron 应用可以有多个渲染进程

他们的关系如下图所示：
![avatar](https://imagehouse-1256089536.cos.ap-guangzhou.myqcloud.com/20210324/screenshot-20210324-154005.png)

#### 1.4.2 进程间通信
- Electron进程间通讯的目的：通知事件， 数据传入 ，数据共享
- 通过IPC模块通信：主进程使用ipcMain，渲染进程使用ipcRenderer,它们都是EventEmitter对象
- 进程间通信方法：
    - 渲染进程 ===> 主进程
      1. Callback写法：
        - ipcRenderer.send 
        - ipcMain.on
      2. Promise写法(Electron 7.0 之后，处理请求 + 响应模式)
        - ipcRenderer.invoke
        - ipcMain.handle
    - 主进程 ===> 渲染进程
      - ipcRenderer.on
      - webContents.send
    - 渲染进程 ===> 渲染进程
      - 通知事件 ipcRenderer.sendTo (Electron 5之后)
      - web常规做法（数据共享）

#### 1.4.3 原生能力
- 使用 Electron API 创建原生 GUI
    - BrowserWindow
    - Tray
    - app
    - Menu
    - dialog
    - TouchBar
    - ....
- 使用 Electron API 获得底层能力
    - clipboard
    - screen
    - globalShortcut
    - desktopCapture
    - powerMonitor
    - shell
    - ...
- 使用 Node.js 获得底层能力：Electron同时在主进程和渲染进程中对 Node.js 暴露了所有的接口
）

    - fs 进行文件读写
    - crypto 进行加解密
    - 通过 npm 安装即可引入社区上所有的 Node.js 库
    - 操作本地数据库

- 使用 Node.js 调用原生模块
    - node-ffi（连接动态链接库）
    - node-addon-api（调用C++的功能）

- 调用OS能力
    - WinRT
    - Applescipt
    - Shell     

- Electron的能力
![avatar](https://imagehouse-1256089536.cos.ap-guangzhou.myqcloud.com/20210324/screenshot-20210324-161722.png)

#### 1.4.4 无跨域问题
- 使用Node.js 发送请求
- 使用Electron net 发送请求
![avatar](https://imagehouse-1256089536.cos.ap-guangzhou.myqcloud.com/20210324/screenshot-20210324-162106.png)


## 二、Electron-vue介绍
https://simulatedgreg.gitbooks.io/electron-vue/content/cn/
### 2.1 什么是Electron-vue
该项目的目的，是为了要避免使用 vue 手动建立起 electron 应用程序。electron-vue 充分利用 vue-cli 作为脚手架工具，加上拥有 vue-loader 的 webpack、electron-packager 或是 electron-builder，以及一些最常用的插件，如vue-router、vuex 等等。
![avatar](https://imagehouse-1256089536.cos.ap-guangzhou.myqcloud.com/screenshot-20210323-181059.png)

### 2.2 为什么使用Electron-vue
1. Electron的Renderer层可以看做是一个web网页，基本上可以完全使用web开发技术进行开发。目前比较热本的web开发前端框架，Vue无疑是首选。
2. 但是要将vue和electron很好的结合起来并不是特别容易的事情，需要很多环境的配置，并且有很多配置文件需要融合，electron帮助我们解决这一难题。
3. 使用Electron有哪些优点：
    - 只有一个package.json。而大部分其他的项目结构依然在使用两个package.json来应对main进程和renderer进程的依赖库。
    - 内建完整的vue全家桶，省去再次配置vue-router和vuex的一些初期操作。
    - 内建完整的webpack开发、生产等配置，开发环境舒适。
    - 内建完整的开发、构建等npm scripts，使用非常方便。
    - 内建完整的Travis-ci、Appveyor配置脚本，只需少数修改就能做到利用CI自动构建的应用发布。
    - 完善的文档，清晰的项目结构。
    - 使用 vue-cli 作为项目脚手架。
    - 能够生成用于浏览器的网页输出。

4. Electron-vue 缺点
    - 内置插件，Electron，bable等版本都比较低，需要升级。（后续会有专门的升级方法）
    - 因为框架为了保证功能的完整性可能会引进一些不必要代码和库，需要在使用过程中自行决定删减。

### 2.3 项目结构   
```
// electron-vue创建出来的默认目录
my-project
├─ .electron-vue //打包的一些配置文件，如需要添加一些webpack插件就在这里配置
│  └─ <build/development>.js files
├─ build   //打包出来的安装文件也在这个文件夹中
│  └─ icons/  //存放应用图标logo等，
├─ dist
│  ├─ electron/
│  └─ web/
├─ node_modules/
├─ src
│  ├─ main  //主进程代码开发目录
│  │  ├─ index.dev.js
│  │  └─ index.js
│  ├─ renderer   //渲染进程代码开发目录
│  │  ├─ components/
│  │  ├─ router/
│  │  ├─ store/
│  │  ├─ App.vue
│  │  └─ main.js
│  └─ index.ejs
├─ static/    //静态文件存放目录，不会被打包，可以使用固定目录读取内容
├─ test       //测试相关
│  ├─ e2e
│  │  ├─ specs/
│  │  ├─ index.js
│  │  └─ utils.js
│  ├─ unit
│  │  ├─ specs/
│  │  ├─ index.js
│  │  └─ karma.config.js
│  └─ .eslintrc
├─ .babelrc
├─ .eslintignore
├─ .eslintrc.js
├─ .gitignore
├─ package.json
└─ README.md
```

## 三、Electron-vue开发实践

### 3.1 开发环境及项目初始化
1. 安装Node, 如果已经有Node了需要验证版本。需要使用ode@^7 或更高版本。（将源切换到淘宝源）
2. npm install -g @vue/cli 全局安装vue-cli脚手架，并运行 vue --version 查看是否安装成功
3. 运行 vue init simulatedgreg/electron-vue <你的项目名称>

![avatar](https://imagehouse-1256089536.cos.ap-guangzhou.myqcloud.com/20210324/screenshot-20210324-170622.png)
此时有可能会报错：Failed to download repo simulatedgreg/electron-vue: Response code  Server Error。
这种情况有以下几种解决办法：
    - 再重新多试几次，会成功的
    - 设置国内镜像
    ```
    npm config set registry https://registry.npm.taobao.org/
    npm config set ELECTRON_MIRROR http://npm.taobao.org/mirrors/electron/
    ```
    - 将Electron-vue下载到本地进行项目常见
        1. 将Electron-vue项目下载下来,https://github.com/SimulatedGREG/electron-vue.git。
        2. 运行下面的命令 将之前的命令中的 simulatedgreg/electron-vue 替换成你磁盘上electron-vue项目的路径
    ```
    vue init E:\2021work\electron\electron-vue mydocstest
    ```    
4. 创建时注意打包工具选择electron-builder。后续会专门讲这个打包工具和其他的区别。 
5. 出现了  vue-cli · Generated "mydocstest". 不需要等待直接退出就可以了。现在项目已经创建完成
6. 进入项目目录，运行npm install 下载相关依赖包
7. npm run dev 启动项目
![avatar](https://imagehouse-1256089536.cos.ap-guangzhou.myqcloud.com/20210324/screenshot-20210324-172932.png)


### 3.2 Main进程的开发

Main进程一个显著的作用就是创建app的窗口。我们来看看这个是怎么实现的。
```js
import { app, BrowserWindow } from 'electron' // 从electron引入app和BrowserWindow

let mainWindow

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080` // 开发模式的话走webpack-dev-server的url
  : `file://${__dirname}/index.html`

function createWindow () { // 创建窗口
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  }) // 创建一个窗口

  mainWindow.loadURL(winURL) // 加载窗口的URL -> 来自renderer进程的页面

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow) // app准备好的时候创建窗口
```
暂且先不管渲染进程里的页面长什么样，在app准备好的时候打开一个窗口只需要调用一个创建BrowserWindow的方法即可。main进程里的开发有点当年写jQuery的样子，比较多的是事件驱动型的写法。

#### 3.2.1 app模块
首先需要注意的是app的模块。这个模块是electron应用的骨架。它掌管着整个应用的生命周期钩子，以及很多其他事件钩子。

<b>app的常用生命周期钩子如下：</b>
- will-finish-launching 在应用完成基本启动进程之后触发
- ready 当electron完成初始化后触发
- window-all-closed 所有窗口都关闭的时候触发，在windows和linux里，所有窗口都退出的时候通常是应用退出的时候
- before-quit 退出应用之前的时候触发
- will-quit 即将退出应用的时候触发
- quit 应用退出的时候触发

而我们通常会在ready的时候执行创建应用窗口、创建应用菜单、创建应用快捷键等初始化操作。而在will-quit或者quit的时候执行一些清空操作，比如解绑应用快捷键。

特别的，在非macOS的系统下，通常一个应用的所有窗口都退出的时候，也是这个应用退出之时。所以可以配合window-all-closed这个钩子来

<b>除了上面说的生命周期钩子之外，还有一些常用的事件钩子：</b>
- active（仅macOS）当应用处于激活状态时
- browser-window-created 当一个BrowserWindow被创建的时候
- browser-window-focus 当一个BrowserWindow处于激活状态的时候

这些钩子需要配合一些具体场景来做出具体的操作。比如当一个BrowserWindow处于激活状态的时候修改窗口的title值。

<b>当然，app这个模块除了上述的一些事件钩子之外，还有一些很常用的方法：</b>
- app.quit() 用于退出应用
- app.getPath(name) 用于获取一些系统目录，对于存放应用的配置文件等很有用
- app.focus() 用于激活应用，不同系统激活逻辑不一样


#### 3.2.2  BrowserWindow模块
BrowserWindow模块用于创建最常见的应用窗口。对于不同系统，创建的窗口的默认样式也不太一样。可二者在窗口顶部的操作区（最小化、最大化、关闭）和标题的位置以及菜单的位置还是有明显的不同的。它们跟系统原生的窗口是一致的。
<b>让我们来看看创建一个BrowserWindow的常用配置：</b>

```js
let window

function createWindow () {
  window = new BrowserWindow({
    height: 900, // 高
    width: 400, // 宽
    show: false, // 创建后是否显示
    frame: false, // 是否创建frameless窗口
    fullscreenable: false, // 是否允许全屏
    center: true, // 是否出现在屏幕居中的位置
    backgroundColor: '#fff' // 背景色，用于transparent和frameless窗口
    titleBarStyle: 'xxx' // 标题栏的样式，有hidden、hiddenInset、customButtonsOnHover等
    resizable: false, // 是否允许拉伸大小
    transparent: true, // 是否是透明窗口（仅macOS）
    vibrancy: 'ultra-dark', // 窗口模糊的样式（仅macOS）
    webPreferences: {
      backgroundThrottling: false // 当页面被置于非激活窗口的时候是否停止动画和计时器
    }
    // ... 以及其他可选配置
  })

  window.loadURL(url)

  window.on('closed', () => { window = null })
}
```

窗口的长宽自然不必说，需要指定。其中需要注意的几个比较重要的就是，frame这个选项，默认是true。如果选择了false则会创建一个frameless窗口，创建一个没有顶部工具栏、没有border的窗口。这个也是我们在windows系统下自定义顶部栏的基础。

<b>同app模块一样，BrowserWindow也有很多常用的事件钩子：</b>
- closed 当窗口被关闭的时候
- focus 当窗口被激活的时候
- show 当窗口展示的时候
- hide 当窗口被隐藏的时候
- maxmize 当窗口最大化时
- minimize 当窗口最小化时

当然也有很多实用的方法
- BrowserWindow.getFocusedWindow() [静态方法]获取激活的窗口
- win.close() [实例方法，下同]关闭窗口
- win.focus() 激活窗口
- win.show() 显示窗口
- win.hide() 隐藏窗口
- win.maximize() 最大化窗口
- win.minimize() 最小化窗口
- win.restore() 从最小化窗口恢复



### 3.3 Renderer进程开发

对于electron-vue而言，renderer进程其实大部分就是在写我们平时常写的前端页面罢了。不过相对于平时在浏览器里写的页面，在electron里写页面的时候你还能用到不少非浏览器端的模块，比如fs，比如electron通过remote模块暴露给renderer进程的模块。接下去我们来看看renderer进程有哪些需要注意的地方。

#### 3.3.1 请使用Hash模式

往常我们在写Vue的时候都比较喜欢开启路由的history模式，因为这样在浏览器的地址栏上看起来比较好看——没有hash的#号，就如同请求后端的url一般。然而需要注意的是，history模式需要后端服务器的支持。

可能很多朋友平时开发的时候没有感觉，那是因为vue-cli里在开发模式下启动的webpack-dev-server帮你实现了服务端的history-fallback的特性。所以在实际部署的时候，至少都需要在你的web服务器程序诸如nginx、apache等配置相关的规则，让前端路由返回给vue-router去处理。

而electron里也是如此。在开发模式下，由于使用的是webpack-dev-server开启的服务器，所以BrowserWindow加载的是来自于类似http://localhost:9080这样的地址的页面。而在生产模式下，却是使用的file://的协议，比如file://${__dirname}/index.html来指定窗口加载的页面。

因此，从上面的表述你也能明白了。假如我有一个子路由地址为child。如果不启用Hash模式，在开发模式下没啥问题，http://localhost:9080/child，但是在生产模式下，file://${__dirname}/index.html/child却是无法匹配的一条路径。因此在electron下，vue-router请不要使用history模式，而使用默认的hash模式。

那么上面的问题就迎刃而解，变为file://${__dirname}/index.html#child即可。

#### 3.3.2 drag&drop的避免

通常我们用Chrome的时候，有个特性是比如你往Chrome里拖入一个pdf，它就会自动用内置的pdf阅读器打开。你往Chrome里拖入一张图片，它就会打开这张图片。由于我们的electron应用的BrowserWindow其实内部也是一个浏览器，所以这样的特性依然存在。而这也是很多人没有注意的地方。也就是当你开发完一个electron应用之后，往里拖入一张图片，一个pdf等等，如果不是一个可拖拽区域（比如PicGo的上传区），那么它就不应该打开这张图、这个pdf，而是将其排除在外。

所以我们将在全局监听drag和drop事件，当用户拖入一个文件但是又不是拖入可拖拽区域的时候，应该将其屏蔽掉。因为所有的页面都应该要有这样的特性。可以通过写一个全局的监听事件，是否响应。

```js
export default {
  mounted () {
    this.disableDragEvent()
  },
  methods: {
    disableDragEvent () {
      window.addEventListener('dragenter', this.disableDrag, false)
      window.addEventListener('dragover', this.disableDrag)
      window.addEventListener('drop', this.disableDrag)
    },
    disableDrag (e) {
      const dropzone = document.getElementById('upload-area') // 这个是可拖拽的上传区
      if (dropzone === null || !dropzone.contains(e.target)) {
        e.preventDefault()
        e.dataTransfer.effectAllowed = 'none'
        e.dataTransfer.dropEffect = 'none'
      }
    }
  },
  beforeDestroy () {
    window.removeEventListener('dragenter', this.disableDrag, false)
    window.removeEventListener('dragover', this.disableDrag)
    window.removeEventListener('drop', this.disableDrag)
  }
}

```

#### 3.3.3 remote模块的使用

remote模块是electron为了让一些原本在Main进程里运行的模块也能在renderer进程里运行而创建的。以下说几个我们会用到的。在electron-vue里内置了vue-electron这个模块，可以在vue里很方便的使用诸如this.$electron.remote.xxx来使用remote的模块。

- <b>shell</b>

  shell模块的官方说明是：Manage files and URLs using their default applications.也就是使用文件或者URL的默认应用。通常我们可以用其让默认图片应用打开一张图片、让默认浏览器打开一个url。如果我们想在renderer进程里点击一个按钮然后在默认浏览器里打开一个url的话就可以这样：

- <b>shell</b>

  shell模块的官方说明是：Manage files and URLs using their default applications.也就是使用文件或者URL的默认应用。通常我们可以用其让默认图片应用打开一张图片、让默认浏览器打开一个url。如果我们想在renderer进程里点击一个按钮然后在默认浏览器里打开一个url的话就可以这样：

```js
  export default {
    methods: {
      openURL () {
        this.$electron.remote.shell.openExternal('https://github.com/Molunerfinn/PicGo')
      }
    }
  }
```
- <b>dialog</b>

  这个时候就可以通过dialog这个模块来实现了。逻辑跟上面一样也是点击一个按钮打开一个dialog：

```js
openDialog () {
  this.$electron.remote.dialog.showMessageBox({
    title: '我是一个弹出敞口',
    message: '我发送了一条消息',
    detail: `其他详细信息`
  })
}
```

- <b>Menu和BrowserWindow的应用</b>
  使用Menu可能很多人能够理解。但是为什么要使用BrowserWindow呢？因为需要定位你打开Menu的窗口。

```js
  buildMenu () {
    const template = [...]
    this.menu = Menu.buildFromTemplate(template)
  },
  openDialog () {
    this.menu.popup(remote.getCurrentWindow) // 获取当前打开Menu的窗口
  }
```  

#### 3.3.4 main进程和renderer进程的通信
在Vue里，如果是非父子组件通信，很常用的是通过Bus Event来实现的。而electron里的不同进程间的通信其实也很类似，是通过ipcMain和ipcRenderer来实现的。其中ipcMain是在main进程里使用的，而ipcRenderer是在renderer进程里使用的。

- <b>ipcMain和ipcRenderer</b>

```js
// In main process.
const {ipcMain} = require('electron')
ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg)  // prints "ping"
  event.sender.send('asynchronous-reply', 'pong')
})

ipcMain.on('synchronous-message', (event, arg) => {
  console.log(arg)  // prints "ping"
  event.returnValue = 'pong'
})
```

```js
// In renderer process (web page).
const {ipcRenderer} = require('electron')
console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

ipcRenderer.on('asynchronous-reply', (event, arg) => {
  console.log(arg) // prints "pong"
})
ipcRenderer.send('asynchronous-message', 'ping')
```

其中ipcMain只有监听来自ipcRenderer的某个事件后才能返回给ipcRenderer值。而ipcRenderer既可以收，也可以发。
那么问题就来了，如何让ipcMain主动发送消息呢？或者说让main进程主动发送消息给ipcRenderer。
首先要明确的是，ipcMain无法主动发消息给ipcRenderer。因为ipcMain只有.on()方法没有.send()的方法。所以只能用其他方法来实现。有办法么？有的，用webContents。

- <b>webContents</b>

webContents其实是BrowserWindow实例的一个属性。也就是如果我们需要在main进程里给某个窗口某个页面发送消息，则必须通过win.webContents.send()方法来发送。

```js
// In main process
let win = new BrowserWindow({...})
win.webContents.send('img-files', imgs)

```
```js
// In renderer process
ipcRenderer.on('img-files', (event, files) => {
  console.log(files)
})

```

### 3.4 总结
这个开发实践其实只是一个引子，可以帮大家建立起一个electron开发的整体思路框架，理解一些基本的知识概念，方便大家能快速的启动electron项目的开发，但是在实际开发肯定有更多的知识和更多的坑需要在实际的业务功能开发当中去踩平去研究，我后续也会以每一个问题专题的形式去一个一个更详细的讲解我在使用electron开发当中遇到的坑和解决的方法。


## 四、踩坑之旅

### 4.1 Electron开发的调试

#### 4.1.1 关于Renderer进程的调试
渲染层的调试其实和网页调试是一样的，不过是通过electron-vue弹出的调试窗口进行调试。在启动项目时会自动打开调试窗口，如果关闭了，可以通过 手动打开 View->Toogle Developer Tools的方式打开，也可以点击F12打开。
![avatar](https://imagehouse-1256089536.cos.ap-guangzhou.myqcloud.com/20210325/screenshot-20210325-152141.png)

#### 4.1.2 关于主进程的调试（重点）

在electron调试过程中，我们打开开发者工具没有办法调试到主进程的代码，只能调试渲染进程。搜了一下electron的官方文档，看完还是一脸懵逼。后来各种搜索，总算是找到了具体的方法。

1. 由于我们使用了Electron-vue框架，在运行 npm run dev启动时会按照调试模式启动。因为在dev-runner.js中已经加了相关参数，如果想在第一行停住代码，可以在下图位置进行修改。

```js
function startElectron () {
  var args = [
    '--inspect=5858', // 这个位置设置了官方网站说的调试参数的端口 --inspect-brk=[port] 就是在第一行停住
    path.join(__dirname, '../dist/electron/main.js')
  ]

  // detect yarn or npm and process commandline args accordingly
  if (process.env.npm_execpath.endsWith('yarn.js')) {
    args = args.concat(process.argv.slice(3))
  } else if (process.env.npm_execpath.endsWith('npm-cli.js')) {
    args = args.concat(process.argv.slice(2))
  }

  electronProcess = spawn(electron, args)
  
  electronProcess.stdout.on('data', data => {
    electronLog(data, 'blue')
  })
  electronProcess.stderr.on('data', data => {
    electronLog(data, 'red')
  })

  electronProcess.on('close', () => {
    if (!manualRestart) process.exit()
  })
}
```
当启动项目后看到如下图所示，说明可以通过Chrome端进行主进程调试了。
![avatar](https://imagehouse-1256089536.cos.ap-guangzhou.myqcloud.com/20210325/screenshot-20210325-153330.png)

2. 打开Chrome浏览器，在地址栏中输入chrome://inspect/#devices出现如下图所示页面。
![avatar](https://imagehouse-1256089536.cos.ap-guangzhou.myqcloud.com/20210325/2019121816495244.png)
点击 Open dedicated DevTools for Node, 在弹出的窗口处选择Connection。
![avatar](https://imagehouse-1256089536.cos.ap-guangzhou.myqcloud.com/20210325/screenshot-20210325-153829.png)
点击Add connection,添加5858端口

3. 切换会Sources页，使用ctrl + p 查找想要调试和增加断点的js文件，就可以进行相应的调试了。
![avatar](https://imagehouse-1256089536.cos.ap-guangzhou.myqcloud.com/20210325/screenshot-20210325-154151.png)



### 4.2 支持JSX的编译，升级用到的库的版本
> 这部分升级在官网和Electron网站上都是没有说明，是通过各种尝试和查找相关联内容得到的。

#### 4.2.1 支持JSX的编译
要想让electron-vue支持jsx的编译，因为在代码开发中很可能会用到jsx语法，直接在项目中使用会报错。经过思考其实这部分编译和主进程并没有直接关系，相当于在VUE项目中整合JSX，去查找相关内容找到了一个插件 @vue/babel-preset-jsx 。
主要用到了  @vue/babel-preset-jsx  https://github.com/vuejs/jsx#installation。
这个插件要求使用babel7才能顺利编译，但是框架创建出来的项目是基于babel6的，这个babel的升级后面会讲（这里先假设已经升级成功了。）
1. 运行下面明亮安装依赖包
```cmd
 npm install @vue/babel-preset-jsx @vue/babel-helper-vue-jsx-merge-props

// 有了这个插件才可以build通过，要不然虽然调试时通过但是build时是不通过的
 npm install --save-dev @babel/plugin-transform-react-jsx 
```
2. 修改.babel文件的配置

- 初始化后的.babel文件的配置。
```json
{
  "comments": false,
  "env": {
    "main": {
      "presets": [
        ["env", {
          "targets": { "node": 7 }
        }],
        "stage-0"
      ]
    },
    "renderer": {
      "presets": [
        ["env", {
          "modules": false
        }],
        "stage-0"
      ]
    },
    "web": {
      "presets": [
        ["env", {
          "modules": false
        }],
        "stage-0"
      ]
    }
  },
  "plugins": ["transform-runtime"]
}

```

- 修改后的文件配置

```json
{
  "comments": false,
  "env": {
    "main": {
      "presets": [
        ["@babel/env", {
          "targets": { "node": "current" }
        }],
        "@vue/babel-preset-jsx"
      ]
    },
    "renderer": {
      "presets": [
        ["@babel/env", {
          "modules": false
        }],
        "@vue/babel-preset-jsx"
      ]
    },
    "web": {
      "presets": [
        ["@babel/env", {
          "modules": false
        }]
      ]
    }
  },
  "plugins": ["@babel/plugin-transform-runtime","@babel/plugin-transform-react-jsx"]
}
```
下面就需要升级babel版本了。


#### 4.2.2 升级babel6到7
当前babel已经发布到了7.13.1，而electron-vue框架生成的项目使用的是babel6，这导致了很多babel的配置和插件无法使用。在开发vue时有时候会出现编译错误的问题。关于babel无论是官网还是electron-vue的网站都没有相关的说明，我也是查了很久才总结出了适合Electron-vue的升级babel的方法。

1. 将node_modules文件夹删除掉，防止babel6残留包产生影响

2. 运行babel官网推荐的升级命令，这个命令可以帮助我们更新package.json文件中的配置。并且下载所需要的依赖。
```
npx babel-upgrade --write 
```
这里我们会发现 package.json里面的 有些包不是最新的我们要改一下版本
- "@babel/core": "^7.0.0",  ===> "@babel/core": "^7.13.1",
- "@babel/plugin-transform-runtime": "^7.0.0",  ===>     "@babel/plugin-transform-runtime": "^7.13.10",

增加一个库 来支持 jsx 
- "@babel/plugin-syntax-jsx": "^7.12.13",

然后你会发现升级后 .babelrc文件里多了很多配置这些暂时用不到，所以可以删除掉，直接全部替换成下面的配置就可以了。
```json
{
  "comments": false,
  "env": {
    "main": {
      "presets": [
        ["@babel/env", {
          "targets": { "node": "current" }
        }],
        "@vue/babel-preset-jsx"
      ]
    },
    "renderer": {
      "presets": [
        ["@babel/env", {
          "modules": false
        }],
        "@vue/babel-preset-jsx"
      ]
    },
    "web": {
      "presets": [
        ["@babel/env", {
          "modules": false
        }]
      ]
    }
  },
  "plugins": ["@babel/plugin-transform-runtime","@babel/plugin-transform-react-jsx"]
}
```
然后运行 npm run dev 重启项目，又可以看到熟悉的界面了，升级成功。

#### 4.2.3 升级electron

升级electron-vue框架默认的 electron 版本只有 "2.0.4"。 现在electron已经发布到12.0.2这个版本了，里面的内容还是支持的功能都有很大的变化。所以升级electron版本也是必须要进行的工作。

1. 替换electron包的版本，然后重新npm install包
```json
//替换前
    "electron": "^2.0.4",
    "electron-builder": "^20.19.2",
    "electron-debug": "^1.5.0",
    "electron-devtools-installer": "^2.2.4",

//替换后
    "electron": "^12.0.1",
    "electron-builder": "^22.10.5",
    "electron-debug": "^3.2.0",
    "electron-devtools-installer": "^3.1.1",
```

2. 重启项目后，报如下错误
![avatar](https://imagehouse-1256089536.cos.ap-guangzhou.myqcloud.com/20210325/2020122311453462.png)
是因为新版本网页中默认没有集成node，在主进程中添加就好了，找到src文件夹下main文件夹下index.js文件，修改如下

```js
mainWindow = new BrowserWindow({
  height: 563,
  useContentSize: true,
  width: 1000,
  webPreferences: {
    nodeIntegration: true, //在网页中集成Node
    contextIsolation: false,
  }
})

```

3. 这时候又会报一个新的错误
![avatar](https://imagehouse-1256089536.cos.ap-guangzhou.myqcloud.com/20210325/screenshot-20210326-155017.png)
是因为electron10后remote模块默认是关闭的，在主进程中添加建议的配置如下

```js
mainWindow = new BrowserWindow({
  height: 563,
  useContentSize: true,
  width: 1000,
  webPreferences: {
    nodeIntegration: true, //在网页中集成Node
    contextIsolation: false,
    enableRemoteModule: true,
    nodeIntegrationInWorker: true,
    webSecurity: false
  }
})
```
这时候熟悉的界面又出现了，electron升级成功。不过在使用过程当中有一个很重要的变化，就是新的electron所有的回调都是通过Promise返回的，不是原来的callback函数形式，所以这块一定要注意。


### 4.3 在线自动更新和热更新 

electron社区有一个很好的提供更新支持的工具"electron-updater"。并且Electron也提供了相应的更新应用程序的方法。并且提供了部署更新服务器的建议。目前我还没有部署更新服务器，因为更新服务器本质的目的是为了实现更多更新版本的管理。后续会写更新服务相关的内容，目前只是将自己对于自动更新和热更新的一些原理的理解和实践写下来，方便大家参考。

#### 4.3.1 官方社区解决方案 "electron-updater" 
因为我们使用Electron-vue创建项目时选择了，electron-builder打包，所以这里的方案是和electron-builder结合使用的。（由于苹果更新需要签名，这里先以windows为例，后续会增加苹果更新的细节）

1. 首先要想能实现版本更新，必须为打包好的文件生成一个版本信息。需要在package.json文件中的'build'项内配置。
```json
    "publish": [

	      {
	
	        "provider": "generic", // 服务器提供商 也可以是GitHub等等
	
	        "url": "http://localhost:9020/electronupdate/" // 服务器地址
	
	      }

    ],
```
提供商的名字目前可以当做是默认的，Url地址我这里为了本地测试填写成我本机用nginx配置的一个静态文件服务地址，这个地址对应我本地的一个文件夹。E:\2021work\electron\electronupdate 。
当配置了这个选项后，运行打包命令后electron-builder会为我们生成一个latest.yml文件。

```yml
version: 0.0.2
files:
  - url: tcuielectron Setup 0.0.2.exe
    sha512: evydluyOwW4Y3XZ6z/jjGltnu8kcP4hL+wpzFOVXIlRdQXvJ04Pzpt7KiSjybO5/PLGnGCQYXj31YFS2VGADKA==
    size: 69752592
path: tcuielectron Setup 0.0.2.exe
sha512: evydluyOwW4Y3XZ6z/jjGltnu8kcP4hL+wpzFOVXIlRdQXvJ04Pzpt7KiSjybO5/PLGnGCQYXj31YFS2VGADKA==
releaseDate: '2021-03-22T09:37:16.879Z'

```
这个文件里面有一些项目的信息，主要是version这个编号。


 2. 在项目的Main进程中增加更新相关代码。electron-vue是自带了一段简单的自动更新代码，不过我这里为了演示更新的过程，所以增加了一些更新过程中的生命周期的检测，可以用来制作进度条等功能。

 ```js
 import { autoUpdater } from 'electron-updater'
 const feedUrl = 'http://localhost:9020/electronupdate/'; // 更新包位置
// 主进程监听渲染进程传来的信息
ipcMain.on('update', (e, arg) => {
  console.log("update");
  checkForUpdates();
});
let checkForUpdates = () => {
  // 配置安装包远端服务器
  autoUpdater.setFeedURL(feedUrl);
  // 下面是自动更新的整个生命周期所发生的事件
  autoUpdater.on('error', function(message) {
    sendUpdateMessage('error', message);
  });
  autoUpdater.on('checking-for-update', function(message) {
    sendUpdateMessage('checking-for-update', message);
  });
  autoUpdater.on('update-available', function(message) {
    sendUpdateMessage('update-available', message);
  });
  autoUpdater.on('update-not-available', function(message) {
    sendUpdateMessage('update-not-available', message);
  });

  // 更新下载进度事件
  autoUpdater.on('download-progress', function(progressObj) {
    sendUpdateMessage('downloadProgress', progressObj);
  });
  // 更新下载完成事件
  autoUpdater.on('update-downloaded', function(event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
    sendUpdateMessage('isUpdateNow');
    ipcMain.on('updateNow', (e, arg) => {
      autoUpdater.quitAndInstall();
    });
  });

  //执行自动更新检查
  autoUpdater.checkForUpdates();
};

// 主进程主动发送消息给渲染进程函数
function sendUpdateMessage(message, data) {
  console.log({ message, data });
  mainWindow.webContents.send('message', { message, data });
}

// electron-vue自带的更新功能
// autoUpdater.on('update-downloaded', () => {
//   autoUpdater.quitAndInstall()
// })
//
// app.on('ready', () => {
//   if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
// })


 ```

3. 在Vue渲染增增加相应的前端更新展示页面和控制按钮。
```js
<template>
    <div>
        <button @click="autoUpdate()">获取更新</button>
        <ol id="content">
            <li>生命周期过程展示</li>
        </ol>
    </div>
</template>
<script>
    import {ipcRenderer} from 'electron'
    export default {
        name: 'update-electron',
        mounted() {
            var _ol = document.getElementById("content");
            ipcRenderer.on('message',(event,{message,data}) => {
                let _li = document.createElement("li");
                _li.innerHTML = message + " <br>data:" + JSON.stringify(data) +"<hr>";
                _ol.appendChild(_li);
                if (message === 'isUpdateNow') {
                    if (confirm('是否现在更新？')) {
                        ipcRenderer.send('updateNow');
                    }
                }
            });
        },
        methods: {
            autoUpdate() {
                ipcRenderer.send('update');
            }
        }
    };
</script>
```

4. 运行 npm run build 进行应用打包，这里使用的是electron-builder打包，关于这个的配置后面会有一章单独讲解。现在先不做配置。
![avatar](https://imagehouse-1256089536.cos.ap-guangzhou.myqcloud.com/20200329/screenshot-20210329-172616.png)
打包好后使用这个exe文件进行安装，（因为没有进行打包配置所以这个安装没有安装向导）

5. 修改项目的部分代码，并修改package.json 里面的version 字段，如改成0.0.3，再打一个新包，打包后将如图的三个文件复制到之前搭建的静态文件服务器中，保证使用上面配置的URL'http://localhost:9020/electronupdate/ '可以访问到。

![avatar](https://imagehouse-1256089536.cos.ap-guangzhou.myqcloud.com/20200329/screenshot-20210329-173623.png)

6. 在已安装的项目上点击获取更新按钮，则进入更新流程。这种更新完成后会自动从新安装。并启动使更新生效
![avatar](https://imagehouse-1256089536.cos.ap-guangzhou.myqcloud.com/20200329/screenshot-20210329-173800.png)


#### 4.3.2 自定义解决方案一
因为上述的更新在mac系统中会要求签名才能启动更新，所以有些开发者并没有使用上述官方建议方案。而是自己写了一个解决方案。这种方案思路是：
1. 本地有一个数据库保存当前应用的版本信息
2. 在项目启动时到服务端拉取 latest.yml 文件，并获得里面的版本号，和本地存储的版本号对比
3. 如果发现有更新，调用shell脚本下载相应文件，并进行安装。

```js
import { dialog, shell } from 'electron'
import db from '../../datastore'
import axios from 'axios'
import pkg from '../../../package.json'
const version = pkg.version
const release = 'https://api.github.com/repos/aaa/aaa/releases/latest'
const downloadUrl = 'https://github.com/aaa/aaa/releases/latest'

const checkVersion = async () => {
  let showTip = db.read().get('picBed.showUpdateTip').value()
  if (showTip === undefined) {
    db.read().set('picBed.showUpdateTip', true).write()
    showTip = true
  }
  // 自动更新的弹窗如果用户没有设置不再提醒，就可以去查询是否需要更新
  if (showTip) {
    const res = await axios.get(release)
    if (res.status === 200) {
      const latest = res.data.name // 获取版本号
      const result = compareVersion2Update(version, latest) // 比对版本号，如果本地版本低于远端则更新
      if (result) {
        dialog.showMessageBox({
          type: 'info',
          title: '发现新版本',
          buttons: ['Yes', 'No'],
          message: '发现新版本，更新了很多功能，是否去下载最新的版本？',
          checkboxLabel: '以后不再提醒',
          checkboxChecked: false
        }, (res, checkboxChecked) => {
          if (res === 0) { // if selected yes
            shell.openExternal(downloadUrl)
          }
          db.read().set('picBed.showUpdateTip', !checkboxChecked).write()
        })
      }
    } else {
      return false
    }
  } else {
    return false
  }
}

// if true -> update else return false
const compareVersion2Update = (current, latest) => {
  const currentVersion = current.split('.').map(item => parseInt(item))
  const latestVersion = latest.split('.').map(item => parseInt(item))
  let flag = false

  for (let i = 0; i < 3; i++) {
    if (currentVersion[i] < latestVersion[i]) {
      flag = true
    }
  }

  return flag
}

export default checkVersion
```
#### 4.3.3 自定义解决方案二

上面的两种方案基本上都是全量更新方案，在重启时会需要用户重新安装。这种对于仅仅更新了少量js代码和页面展现的更新并不是很友好。所以有人提出了文件覆盖更新方式。

1. 用非asar模式打包应用（这样JS文件不会被打包）
2. 借助package.json标记版本和更新内容的，在文件中写出需要更新的内容列表
3. 对比本地版本和远程版本，如果发现有更新，则拉取相应JS内容，并打开本地对应的JS文件，使用fs库进行写入。
```js
var https = require('https');

var getHttpsData = function (filepath, success, error) {
  // 回调缺省时候的处理
  success = success || function () {};
  error = error || function () {};

  var url = 'https://raw.githubusercontent.com/username/project-name/master/' + filepath + '?r=' + Math.random();

  https.get(url, function (res) {
    var statusCode = res.statusCode;

    if (statusCode !== 200) {
        // 出错回调
        error();
        // 消耗响应数据以释放内存
        res.resume();
        return;
    }

    res.setEncoding('utf8');
    var rawData = '';
    res.on('data', function (chunk) {
      rawData += chunk;
    });

    // 请求结束
    res.on('end', function () {
      // 成功回调
      success(rawData);
    }).on('error', function (e) {
      // 出错回调
      error();
    });
  });
};
```

```js
getHttpsData('index.html', function (data) {
  // 写入文件
  fs.writeFileSync('index.html', data);
  // 然后下一个文件获取并写入...
});
```

#### 4.3.4 自动更新的方法对比和建议
![avatar](https://imagehouse-1256089536.cos.ap-guangzhou.myqcloud.com/20200329/screenshot-20210329-175736.png)

更新建议：
- Web 化 
  - 将渲染进程（业务）放置在远程 https
  - 优点：更新快、体验极好
  - 缺点：无法离线使用、主进程更新复杂、多版本兼容问题
  - 场景：重业务、壳子更新少
- 官方自动更新
  - 优点：接入简单，支持windows签名验证，支持进度条，集成容易
  - 缺点：更新体验需要优化，可能存在权限问题


