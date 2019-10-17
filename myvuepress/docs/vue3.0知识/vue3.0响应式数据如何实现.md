<!--
 * @Description: In User Settings Edit
 * @Author: sunxiaofan
 * @Date: 2019-10-16 09:52:48
 * @LastEditTime: 2019-10-16 10:02:16
 * @LastEditors: Please set LastEditors
 -->
# Vue3.0响应式数据如何实现

## 理解proxy
- 什么是proxy：可以通过Proxy为一个对象添加一个拦截函数，对这个对象的操作会调用拦截函数中的方法。

```js
const target = {}
```