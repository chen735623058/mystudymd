# 自从ES6以来JS增加的新特性

## 目录
## ES2015 
- let 和 const 
- 箭头函数
- 类
- 默认参数
- 模板字符串
- 解构赋值
- 增强的对象字面量
- For of 循环
- Promises
- 模块
- String 新方法
- Object 新方法
- 展开运算符
- Set 
- Map
- Generators
## ES2016 
- Array.prototype.includes()
- 求幂运算符
## ES2017
- 字符串填充
- Object.values()
- Object.entries()
- Object.getOwnPropertyDescriptors()
- 尾逗号
- 共享内存 and 原子操作
## ES2018
- Rest/Spread Properties
- Asynchronous iteration
- Promise.prototype.finally()
- 正则表达式改进
## ESNext
- Array.protptype.{flat,flatMap}
- try/catch 可选的参数绑定
- Object.fromEntries()
- String.prototype.{trimStatrt,trimEnd}
- Symbol.protptype.description
- JSON  improvements
- Well-formed JSON.stringify()
- Function.prototype.toString()


## let 和 const
let 本质上是具有块级作用域的var。 他可以被当前作用域（函数以及块级作用域）以及其子集作用域访问到
const 变量一经初始化 他的值就永远不能改变 。 然而如果他是一个具有属性或者方法的对象，那么我们可以改变他的属性或者方法，本质上知识保证引用的地址不被变更。

## 箭头函数
```js
  const myFunction = function(){

  }

  const myFunction = () => {

  }
```
如果箭头函数中只包含一条语句，可以省略大括号
```js
  const myFunction = () => dosomeThing()
```
参数在括号中传递,如果只有一个参数也可以省略括号
```js
  const myFunction = (param1,param2) => doSomething(param1,param2)

  const myFunction = param = doSomething(param)
```
箭头函数支持隐藏返回
```js
  const myFunction = () => ({value:'test'})
  const myFunction = () => 'test'
```
箭头函数的This，继承自执行上下文，箭头函数本身不绑定this 英雌箭头函数不适合作为对象方法。 同时也不适合使用作为创建构造函数。所以如果不需要动态上下文时 请使用常规函数。
```js
const link = document.querySelector('#link')
link.addEventListener('click', () => {
  // this === window
})
const link = document.querySelector('#link')
link.addEventListener('click', function() {
  // this === link
})
```
## Classes 类
class 是在原型继承的基础上实现的语法糖
class 定义
```js
class Person{
    constructor(name){
        this.name = name
    }
    hello(){
        return 'Hello, I am '+ this.name + '.'
    }
}
```
初始化对象时调用constructor方法，并将参数传递给此方法。
```js
const flavio = new Person('flavio')
favio.hello()
```
Class继承: 一个子类可以 extend 另一个类，通过子类实例化出来的对象可以继承这两个类的所有方法。
如果子类中的方法与父类中的方法名重复，那么子类中的同名方法优先级更高
```js
class Programmer extends Person{
    hello(){
        return super.hello() + 'I am programmer'
    }
}
```
getters 和 setters 会在你去获取特定值 或者修改特定值的时候执行 get 或者 set 内的相关方法
```js
class Person {
    constructor(name){
        this._name = name
    }
    set name(value){
        this._name = value
    }
    get name(){
        return this._names
    }
}
```
默认参数
```js
 const colorize = ({color = 'red'}) => {

 }
```
## 模板字符串
使用反引号替换单引号或者双引号。功能如下
- 为定义多行字符串提提供了很好的语法。
- 他提供了一种在字符串中插入变量和表达式的简单方法
- 它允许您创建带有模板标签的DSL 

多行字符串 ： 需要特别注意的是 空格是有意义的 
```js
// 这两个是不一样的
const str = `First
second`

const str = `First
             second`
            
// 解决方法 ： 第一行置为空 然后调用trim方法
const str = `
First
Second
`.trim()
```

插值使用 $(...)语法
```js
const val = 'test'
const str = `something $(val)` 

// 可以加入任何东西，甚至表达式
const str = `something ${1 + 2 + 3}`
const str = `something ${foo() ? 'x' : 'y'}`
```

## 解构赋值

给定一个object 你可以抽取其中的一些值 并且赋值给命名的变量
```js
 const person = {
  firstName:'Tom',
  lastName:'Cruise',
  actor:true,
  age:54, //made up
}
const {firstName: name, age} = person
```
这个语法可以用在数组中
```js
const a = [1,2,3,4,5]
const [first, second] = a
const [first, second, , , fifth] = a

// fifth : 5

```
### 更强大的对象字面量
对象字面量简化了包含变量的语法
```js
 // 原来的写法
 const something = 'y'
 const x = {
    something: something
 }
 // 新的写法
  const x = {
    something
 }

 // 原型 
 const anObject = { y:'y', test:() => 'zoo' }
 const x = {
   __proto__: anObject,
   test() {
     return super.test() + 'x'
    }
 } 
 x.test() //zoox 
 // 动态属性
 const x = {
  ['a' + '_' + 'b']:'z'
 } 
 x.a_b //z
```

## For-of循环
之前的forEach()循环，虽然好用 但是和for循环一样，没法break。
for-of循环，就是在forEach的基础上加上了break的功能：
```js
//iterate over the value
for (const v of ['a', 'b', 'c']) {
  console.log(v);
}
//get the index as well, using `entries()`
for (const [i, v] of ['a', 'b', 'c'].entries()) {
  console.log(i) //index
  console.log(v) //value
}
```
留意一下const的使用。这个循环在每次迭代中都会创建一个新的作用域，所以我们可以使用const来代替let。
它跟for…in的区别在于：
- for…of遍历属性值
- for…in遍历属性名

## Promises
> promises的一般定义：他是一个代理，通过他可以最终得到一个值。作用是处理一步代码的一种方式 可以减少回调。
### promises的原理
一个promise被调用的时候，首先它是处于pending状态。在promise处理的过程中，调用的函数（caller）可以继续执行，直到promise给出反馈。此时，调用的函数等待的promise结果要么是resolved状态，要么是rejected状态。但是由于JavaScript是异步的，所以promise处理的过程中，函数会继续执行。
### promises的作用
除了你的代码和第三方库的代码之外，promise在用在现代的Web API中，比如：

- 电池API
- Fetch API
- Service Workers

在现代的JavaScript中，不使用promise是不太可能的，所以我们来深入研究下promise吧。
###  创建一个promise
Promise API暴露了一个Promise构造函数，可以通过new Promise()来初始化：
```js
let done = true;
const isTtDoneYet = new Promise((resolve,reject) => {
  if(done){
    resolve("success");
  }else{
    reject("error");
  }
})
```
### 使用一个promise
```js
const isItDoneYet = new Promise()
//...
const checkIfItsDone = () => {
  isItDoneYet
    .then(ok => {
      console.log(ok)
    })
    .catch(err => {
      console.error(err)
    })
}
```
运行checkIfItsDone()方法时，会执行isItDoneYet()这个promise，并且等待它resolve的时候使用then回调，如果有错误，就用catch回调来处理。
### 链式promise
一个promise可以返回另一个promise，从而创建promise链条（chain）。

一个很好的例子就是Fetch API，它是基于XMLHttpRequest API的一个上层API，我们可以用它来获取资源，并且在获取到资源的时候链式执行一系列promise。

Fetch API是一个基于promise的机制，调用fetch()相当于使用new Promise()来声明我们自己的promise。

链式promise的例子
```js
const status = response => {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  }
  return Promise.reject(new Error(response.statusText))
}
const json = response => response.json()
fetch('/todos.json')
  .then(status)
  .then(json)
  .then(data => {
    console.log('Request succeeded with JSON response', data)
  })
  .catch(error => {
    console.log('Request failed', error)
  })
```
在这个例子当中，我们调用fetch()，从根目录的todos.json文件中获取一系列的TODO项目，并且创建一个链式promise。

运行fetch()方法会返回一个response，它包含很多属性，我们从中引用如下属性：

status, 一个数值，表示HTTP状态码
statusText, 一个状态消息，当请求成功的时候返回OK
response还有一个json()方法，它返回一个promise，返回内容转换成JSON后的结果。

所以这些promise的调用过程就是：第一个promise执行一个我们定义的status()方法，检查response status，判断是否一个成功的响应(status在200和299之间)，如果不是成功的响应，就reject这个promise。

这个reject操作会导致整个链式promise跳过后面的所有promise直接到catch()语句，打印Request failed和错误消息。

如果这个promise成功了，它会调用我们定义的json()函数。因为前面的promise成功之后返回的response对象，我们可以拿到并作为第2个promise的参数传入。

在这个例子里面，我们返回了JSON序列化的数据，所以第3个promise直接接收这个JSON：

## 错误处理
在上一节的的例子里面，我们有一个catch接在链式promise后面。

当promise链中的任意一个出错或者reject的时候，就会直接跳到promise链后面最近的catch()语句。
```js
new Promise((resolve, reject) => {
  throw new Error('Error')
}).catch(err => {
  console.error(err)
})
// or
new Promise((resolve, reject) => {
  reject('Error')
}).catch(err => {
  console.error(err)
})
```
如果在catch()里面抛出一个错误，你可以在后面接上第二个catch()来处理这个错误，以此类推。
```js
new Promise((resolve, reject) => {
  throw new Error('Error')
})
  .catch(err => {
    throw new Error('Error')
  })
  .catch(err => {
    console.error(err)
  })
```

## 组织多个promise
> Promise.all() 如果你要同时完成不同的promise,可以用Promise.all()来声明一系列的promise，然后当它们全部resolve的时候再执行一些操作。

```js
const f1 = fetch('/something.json')
const f2 = fetch('/something2.json')
Promise.all([f1, f2])
  .then(res => {
    console.log('Array of results', res)
  })
  .catch(err => {
    console.error(err)
  })

  // 解构赋值的写法
Promise.all([f1, f2]).then(([res1, res2]) => {
  console.log('Results', res1, res2)
})
```
> Promise.race() : Promise.race()运行所有传递进去的promise，但是只要有其中一个resolve了，就会运行回调函数，并且只执行一次回调，回调的参数就是第一个resolve的promise返回的结果。
```js
const promiseOne = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, 'one')
})
const promiseTwo = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'two')
})
Promise.race([promiseOne, promiseTwo]).then(result => {
  console.log(result) // 'two'
})
```

## 模块
ES Module是用于处理模块的ECMAScript标准。

虽然 Node.js 多年来一直使用 CommonJS标准，但浏览器却从未有过模块系统，因为模块系统的决策首先需要 ECMAScript 标准化后才由浏览器厂商去实施实现。

这个标准化已经完成在 ES2015中，浏览器也开始实施实现这个标准，大家试图保持一致，以相同的方式工作。现在 ES Module 可以在 Chrome Safari Edge 和 Firefox（从60版本开始） 中使用。

模块非常酷，他们可以让你封装各种各样的功能，同时将这些功能作为库暴露给其它 JavaScript 文件使用。

ES模块语法
```js
 // 引入模块的语法
 import package from 'module-name'
 // CommonJS则是这样使用的
 const package = require('module-name')
```
一个模块是一个 JavaScript 文件，这个文件使用 export 关键字 导出 一个或多个值（对象、函数或者变量）。例如，下面这个模块提供了一个将字符串变成大写形式的函数：

```js
// uppercase.js
export default str => str.toUpperCase()
```
一个 HTML 页面可以通过使用了特殊的 type=module 属性的 script 标签添加一个模块。

```html
<script type="module" src="index.js"></script>
```
> 注意: 这个模块导入的行为就像 defer 脚本加载一样。具体可以看 efficiently load JavaScript with defer and async

需要特别注意的是，任何通过 type=”module” 载入的脚本会使用 严格模式 加载。

在这个例子中，uppercase.js 模块定义了一个 default export，因此当我们在导入它的时候，我们可以给他起一个任何我们喜欢的名字：
```js
import toUpperCase from './uppercase.js'
// 使用它
toUpperCase('test') //'TEST'
// 通过绝对路径导入
import toUpperCase from 'https://flavio-es-modules-example.glitch.me/uppercase.js'  

```
这里生成了一个 default export。然而，你可以通过下面的语法在一个文件里面 导出 多个功能：
```js
const a = 1
const b = 2
const c = 3
export { a, b, c }
// 另一个模块可以这样导入
import * from 'module'
import { a } from 'module'
import { a, b } from 'module'
import { a, b as two } from 'module'
```

## CORS(跨域资源共享)
进行远程获取模块的时候是遵循 CORS 机制的。这意味着当你引用远程模块的时候，必须使用合法的 CORS 请求头来允许跨域访问（例如：Access-Control-Allow-Origin: *）。

## 新的字符串方法
- repeat() 根据指定的次数重复字符串 
- codePointAt()  这个方法能用在处理那些需要 2 个 UTF-16 单元表示的字符上。

使用 charCodeAt 的话，你需要先分别得到两个 UTF-16 的编码然后结合它们。但是使用 codePointAt() 你可以直接得到整个字符。

```js
"𠮷".charCodeAt(0).toString(16) //d842
"𠮷".charCodeAt(1).toString(16) //dfb7

"𠮷".codePointAt(0) //20bb7
```

##  新的对象方法
- Object.is() 确定两个值是不是同一个
- Object.assign() 用来浅拷贝一个对象
- Object.setPrototypeOf 设置一个对象的原型

Object.is()

返回值在下列情况之外一直是 false：

a 和 b 是同一个对象
a 和 b 是相等的字符串(用同样的字符组合在一起的字符串是相等的)
a 和 b 是相等的数字
a 和 b 都是 undefined, null, NaN, true 或者都是 false
0 和 -0 在 JavaScript 里面是不同的值, 所以对这种情况要多加小心（例如在比较之前，使用 + 一元操作符将所有值转换成 +0）。

Object.setPrototypeOf
```js
const animal = {
  isAnimal:true
}
const mammal = {
  isMammal:true
}
mammal.__proto__ = animal
mammal.isAnimal //true
const dog = Object.create(animal)
dog.isAnimal  //true
console.log(dog.isMammal)  //undefined
Object.setPrototypeOf(dog, mammal)
dog.isAnimal //true
dog.isMammal //true
```

## 展开操作符 ...

