<!--
 * @Author: your name
 * @Date: 2019-11-04 19:20:50
 * @LastEditTime: 2019-11-05 20:26:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \myvuepress\docs\私人资源站搭建\1-vuessr学习.md
 -->
# vue ssr服务端渲染学习

## 为什么使用
1. 更好的SEO
2. 更快的内容到达时间

## 需要权衡的地方
1. 一些外部扩展库可能需要特殊处理
2. 构建和部署可能需要更多的要求
3. 更多的服务端负载

## 编写通用代码

### 1. 服务器上的数据响应

在服务端默认是禁用相应式数据的

### 2. 组件声明周期钩子函数
由于没有动态更新，所有的声明周期钩子函数中只有 beforeCreate和created会在（SSR中被调用）。
由于只有这两个生命周期钩子，所以产生全局副作用的代码 如setInterval 就不要在这两个函数中创建了。

### 3. 访问特定平台
不能使用 docoment或者window这类进浏览器全局可用的变量，对于仅浏览器可用的API通常方式是在纯客户端的生命周期钩子啊函数中惰性（lazuly access）访问他们

### 4. 自定义指令
大多数自定义指令直接操作DOM 因此在SSR中会报错。
-  推荐抽象为组件
-  如果你有一个自定义指令，但是不是很容易替换为组件，则可以在创建服务器 renderer 时，使用 directives 选项所提供"服务器端版本(server-side version)"。


## 源码结构

### 1. 避免状态单例

### 2. 介绍构建步骤
对于客户端应用程序和服务端应用程序都需要使用webpack进行打包。