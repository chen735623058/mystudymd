# webgl 入门
## 一、 canvas 理解与简单使用
WebGL在web浏览器上使用，需要用到canvas对象，这个对象是HTML5后新加入的对象。canvas画布可是实现前端的绘画能力。可以看网站  http://caimansys.com/painter/  。
我们还没有能力制作这么复杂的canvas工程，我们先从简单的开始，绘制一个简单的正方形。
```js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body onload="main()">
    <canvas id="example" width="400" height="400">
        您的浏览器不支持canvas
    </canvas>
</body>
<script>
    function main() {
        // 获取canvas元素
        var canvas = document.getElementById('example');
        if(!canvas){
            console.log('没有获取到');
            return
        }

        // 获取绘制二维图形的绘图上下文
        var ctx = canvas.getContext('2d');

        // 绘制蓝色矩形
        ctx.fillStyle = 'rgba(0,0,255,0.4)';
        ctx.fillRect(120,10,150,150);
    }
</script>
</html>
```
canvas 的坐标系下图所示

![图1.png](https://upload-images.jianshu.io/upload_images/10319049-b34608ca623860c1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 二、 最短的WebGL程序 清空绘图区

