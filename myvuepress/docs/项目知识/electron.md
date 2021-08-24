# electron研究学习

<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [electron研究学习](#electron研究学习)
  - [一、环境的搭建安装](#一-环境的搭建安装)
  - [二、功能开发](#二-功能开发)
  - [三、主进程调试](#三-主进程调试)
  - [四、升级bable到7](#四-升级bable到7)
  - [五、支持jsx](#五-支持jsx)
  - [六、技术点研究](#六-技术点研究)
  - [七、升级electron](#七-升级electron)
  - [八、electron-build](#八-electron-build)
  - [九、右键菜单](#九-右键菜单)

<!-- /code_chunk_output -->

## 一、环境的搭建安装
## 二、功能开发
## 三、主进程调试
https://blog.csdn.net/qq_34334390/article/details/103600711
## 四、升级bable到7
npx babel-upgrade --write 
修改.babelrc文件
## 五、支持jsx
修改babel配置

npm install @vue/babel-preset-jsx @vue/babel-helper-vue-jsx-merge-props

","@babel/plugin-transform-react-jsx" // 解决build支持jxs

## 六、技术点研究
- 热更新
- 证书签名
- win打包
- mac打包
- shell命令
- main模块化
- electron + koa
- 原生GUI的研究（工具栏，菜单栏，消息通知）

## 七、升级electron
https://blog.csdn.net/Haveyounow/article/details/111583566

解决报错使用 
```
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
```

dialog.showOpenDialog 方法变了，其他的方法也从原来的回调函数变成了Promise
```js
  // 新的
  dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  }).then(result => {
    console.log(result.canceled)
    console.log(result.filePaths)
      if (result.filePaths.length > 0){
        // 发送选择的对象给子进程
        event.sender.send('selectedItem', result.filePaths[0])
      }
  }).catch(err => {
    console.log(err)
  })

  // 旧的
  // dialog.showOpenDialog({
  //   properties: [p]
  // },function (files) {
  //   debugger
  //   if (files){
  //     // 发送选择的对象给子进程
  //     event.sender.send('selectedItem', files[0])
  //   }
  // })
```
## 八、electron-build

https://blog.csdn.net/weixin_34162695/article/details/91461372

## 九、右键菜单