# Memoization相关的知识
## 什么是Memoization 
>简单来说，memoization 是一种优化技术，其实就是一种缓存机制。主要用于通过存储昂贵的函数调用的结果来加速计算机程序，并在再次发生相同的输入时返回缓存的结果。<br>

>原理就是把函数的每次执行结果存放到一个散列表中，在接下来的执行中，在散列表中查找是否已经有相关执行过得值，如果有，直接返回该值，如果没有菜真正执行函数体的求职部分。很明显，找值，尤其是在散列中找值，比执行函数快多了。

### [例子1](https://github.com/chen735623058/Front-end-development-study) 
Fibonacci数列的优化
```js
    //原始的fibonacc数列方法
    function fibonacci(n) {
        if (n === 0 || n === 1) {
            return n;
        }
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
    console.time("fibonacci方法耗时");
    fibonacci(20);
    console.timeEnd("fibonacci方法耗时");

```

```js
   // 使用了Memoization的fibonacci
    var fibonacci_memoization = (function () {
        var cache = [];
        return function (n) {
            if(n === 0 || n === 1){
                return n;
            }else{
                cache[n-1] = cache[n-1] || fibonacci_memoization(n-1);
                cache[n-2] = cache[n-2] || fibonacci_memoization(n-2);
                return cache[n-1]+cache[n-2];
            }
        }
    })()

    console.time("fibonacci_memoization方法耗时");
    fibonacci_memoization(20);
    console.timeEnd("fibonacci_memoization方法耗时");

```



### [例子2](https://github.com/chen735623058/Front-end-development-study) 
```js
// 普通阶乘函数
const  factorial = n => {
    if(n === 1){
        return 1
    } else{
        return factorial(n-1) * n;
    }
}
console.time("factorial方法耗时");
console.log(factorial(10));
console.timeEnd("factorial方法耗时");

// 使用了memoization
const cache = []
const factorial_memoization = n => {
    if(n===1){
        return 1;
    } else if (cache[n-1]){
        return cache[n-1];
    } else {
        let reault = factorial_memoization(n-1) * n
        cache[n-1] = reault;
        return reault;
    }
}
console.time("factorial_memoization方法耗时");
console.log(factorial_memoization(10));;
console.timeEnd("factorial_memoization方法耗时");


// 常见的闭包形式
const factorialMemo = () => {
    const cache = []
    const factorial = n => {
        if (n === 1) {
            return 1
        } else if (cache[n - 1]) {
            console.log(`get factorial(${n}) from cache...`)
            return cache[n - 1]
        } else {
            let result = factorial(n - 1) * n
            cache[n - 1] = result
            return result
        }
    }
    return factorial
};
const factorialMemofun = factorialMemo();
console.time("factorialMemofun方法耗时");
console.log(factorialMemofun(10));;
console.timeEnd("factorialMemofun方法耗时");
```