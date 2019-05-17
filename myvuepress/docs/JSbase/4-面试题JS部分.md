# JS部分面试题
## 事件委托的解释
>事件委托是将事件监听器添加到父元素，而不是每个子元素单独设置事件监听器。当触发子元素时，事件会冒泡到父元素，监听器就会触发。这种技术的好处是：

内存占用减少，因为只需要一个父元素的事件处理程序，而不必为每个后代都添加事件处理程序。
无需从已删除的元素中解绑处理程序，也无需将处理程序绑定到新元素上。

## 对 AMD 和 CommonJS 的了解。
>它们都是实现模块体系的方式，直到 ES2015 出现之前，JavaScript 一直没有模块体系。CommonJS 是同步的，而 AMD（Asynchronous Module Definition）从全称中可以明显看出是异步的。CommonJS 的设计是为服务器端开发考虑的，而 AMD 支持异步加载模块，更适合浏览器。

>我发现 AMD 的语法非常冗长，CommonJS 更接近其他语言 import 声明语句的用法习惯。大多数情况下，我认为 AMD 没有使用的必要，因为如果把所有 JavaScript 都捆绑进一个文件中，将无法得到异步加载的好处。此外，CommonJS 语法上更接近 Node 编写模块的风格，在前后端都使用 JavaScript 开发之间进行切换时，语境的切换开销较小。

## 请解释下面代码为什么不能用作 IIFE：function foo(){ }();，需要作出哪些修改才能使其成为 IIFE？
>IIFE（Immediately Invoked Function Expressions）代表立即执行函数。 JavaScript 解析器将 function foo(){ }();解析成function foo(){ }和();。其中，前者是函数声明；后者（一对括号）是试图调用一个函数，却没有指定名称，因此它会抛出Uncaught SyntaxError: Unexpected token )的错误。
```js 
 (function foo(){

 })()
```

## null、undefined和未声明变量之间有什么区别
> 1. 当一个变量已经声明，但没有赋值时，该变量的值是undefined
> 2. ull只能被显式赋值给变量。它表示空值，与被显式赋值 undefined 的意义不同
> 3. 未声明变量是在声明之前就进行赋值的变量，他作为windos对象的一个属性存在

## 请说明.forEach循环和.map()循环的主要区别，它们分别在什么情况下使用？

forEach

- 遍历数组中的元素。
- 为每个元素执行回调。
- 无返回值。
```js
const a = [1, 2, 3];
const doubled = a.forEach((num, index) => {
  // 执行与 num、index 相关的代码
});

// doubled = undefined
```
map

- 遍历数组中的元素
- 通过对每个元素调用函数，将每个元素“映射（map）”到一个新元素，从而创建一个新数组。
```js
const a = [1, 2, 3];
const doubled = a.map(num => {
  return num * 2;
});

// doubled = [2, 4, 6]
```
>.forEach和.map()的主要区别在于.map()返回一个新的数组。如果你想得到一个结果，但不想改变原始数组，用.map()。如果你只需要在数组上做迭代修改，用forEach。

## 匿名函数的典型应用场景是什么？
>1. IIFE中
>2. 一次使用的函数
>3. 函数式编程

## 宿主对象（host objects）和原生对象（native objects）的区别是什么？
> 原生对象是由 ECMAScript 规范定义的 JavaScript 内置对象，比如String、Math、RegExp、Object、Function等等。
宿主对象是由运行时环境（浏览器或 Node）提供，比如window、XMLHTTPRequest等等。

## 请说明 JSONP 的工作原理，它为什么不是真正的 Ajax
>JSONP（带填充的 JSON）是一种通常用于绕过 Web 浏览器中的跨域限制的方法，因为 Ajax 不允许跨域请求。 现在更多的是用CORS (跨域资源共享)
都能解决 Ajax直接请求普通文件存在跨域无权限访问的问题

1. JSONP只能实现GET请求，而CORS支持所有类型的HTTP请求
2. 使用CORS，开发者可以使用普通的XMLHttpRequest发起请求和获得数据，比起JSONP有更好的错误处理
3. JSONP主要被老的浏览器支持，它们往往不支持CORS，而绝大多数现代浏览器都已经支持了CORS
### CORS 实现思路
CORS背后的基本思想是使用自定义的HTTP头部允许浏览器和服务器相互了解对方，从而决定请求或响应成功与否

## 你使用过 JavaScript 模板吗？用过什么相关的库？
使用过。VUE、AngularJS 和 JSX。我不喜欢 AngularJS 中的模板，因为它在指令中大量使用了字符串，并且书写错误会被忽略。JSX 是我的新宠，因为它更接近 JavaScript，几乎没有什么学习成本。现在，可以使用 ES2015 模板字符串快速创建模板，而不需依赖第三方代码。

## 你对 Promises 及其 polyfill 的掌握程度如何？
> 掌握它的工作原理。Promise是一个可能在未来某个时间产生结果的对象：操作成功的结果或失败的原因（例如发生网络错误）。 Promise可能处于以下三种状态之一：fulfilled、rejected 或 pending。 用户可以对Promise添加回调函数来处理操作成功的结果或失败的原因。

>一些常见的 polyfill 是$.deferred、Q 和 Bluebird，但不是所有的 polyfill 都符合规范。ES2015 支持 Promises，现在通常不需要使用 polyfills。

## Promise代替回调函数有什么优缺点？
>1. 避免可读性极差的回调地狱。
>2. 使用.then()编写的顺序异步代码，既简单又易读。
>3. 使用Promise.all()编写并行异步代码变得很容易。

>1. 轻微地增加了代码的复杂度（这点存在争议）。
>2. 在不支持 ES2015 的旧版浏览器中，需要引入 polyfill 才能使用。