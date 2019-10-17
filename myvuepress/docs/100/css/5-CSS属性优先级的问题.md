<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-22 10:39:49
 * @LastEditTime: 2019-08-22 10:43:35
 * @LastEditors: Please set LastEditors
 -->
# 已知如下代码，如何修改才能让图片宽度为 300px ？注意下面代码不可修改。

> <img src="1.jpg" style="width:480px!important;”>

这里面主要考察css属性优先级的问题。

1. 动画属性的优先级高于！important

```css
img {
      animation: test 0s forwards;
}
@keyframes test {
from {
width: 300px;
}
to {
width: 300px;
}
}
```

2.利用变形 
```css
    tansform: scale(0.625,0.625)
```

3.利用max-witdh属性
```css
    img {
        max-width: 300px
    }
```