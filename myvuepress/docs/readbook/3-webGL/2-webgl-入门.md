# 2-webgl 入门
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

![VgG7V0.png](https://s2.ax1x.com/2019/06/11/VgG7V0.png)

## 二、 最短的WebGL程序 清空绘图区
```js
    function main() {
        // 获取<canvas> 元素
        var canvas = document.getElementById('webgl');
        var gl = getWebGLContext(canvas);
        if(!gl){
            console.log('创建失败');
            return;
        }
        // 指定清空区颜色
        gl.clearColor(0.0,0.0,0.0,1.0);
        // 清空 canvas // 指定颜色缓冲区
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
```
> 这里有个要注意的就是 WebGL中的颜色 不是0--255 而是 0.0--1.0

## 三、绘制一个点1.0
> 绘制一个点不像二维绘制矩形那么简单，需要用到<b>着色器</b>，着色器以字符串的形式嵌入在JS文件中。

> 着色器包括两种：
> 1. 顶点着色器（Vertex shader）顶点着色器是用来描述顶点特性（如位置，颜色等）的程序。顶点 是指二维或者三维空间中的一个点，比如二维或者三维图形的端点或者交点。
> 2. 片元着色器（Fragment shader）进行逐片元处理过程，如光照的程序。片元 可以理解为像素。
```JS
// 顶点着色器
var VSHANER_SOURCE =
    `void main() {
     gl_Position = vec4(0.0,0.0,0.0,1.0); //设置坐标  这种叫做齐次坐标
     gl_PointSize = 10.0; // 设置尺寸
     }`;
// 片元着色器程序
var FSHADER_SOURCE =
    `void main() {
        gl_FragColor = vec4(1.0,0.0,0.0,1.0); // 设置颜色
    }`;

function main() {
    let canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    if(!gl){
        console.log('error');
        return;
    }
    // 初始化着色器
    if(!initShaders(gl,VSHANER_SOURCE,FSHADER_SOURCE)){
        console.log('error');
        return;
    }
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS,0,1);
}
```
 > 齐次坐标 （x,y,z,w） 等价于 三维坐标 （x/w,y/w,z/w）
 
 > drawArrays 是一个强大的函数（可以绘制很多种图形） 

## 四、WebGL坐标系
> WebGL使用的是三维坐标系（笛卡尔坐标系），具有 X,Y,Z三个轴。可是先理解为右手坐标系，映射凹cancas绘图区的坐标系的关系如下图
1. canvas 的中心点：（0.0,0.0,0.0）
2. canvas 的左右边缘：（-1.0,0.0,0.0）和 （1.0,0.0,0.0）
3. canvas 的上下边缘：（0.0,-1.0,0.0）和 （0.0,1.0,0.0）
[![VgJad0.png](https://s2.ax1x.com/2019/06/11/VgJad0.png)](https://imgchr.com/i/VgJad0)


## 五、绘制一个点2 实现JS 和 着色器之间的数据传输
> 传输使用 attribute 变量 和 uniform变量。attribute变量传入与顶点相关的数据，uniform 传入对于所有顶点都相同或者与定点无关的数据。
```js
// 顶点着色器
var VSHANER_SOURCE =
    `
     attribute vec4 a_Position;
     void main() {
        gl_Position = a_Position; //设置坐标
        gl_PointSize = 10.0; // 设置尺寸
     }`;
// 片元着色器程序
var FSHADER_SOURCE =
    `void main() {
        gl_FragColor = vec4(1.0,0.0,0.0,1.0); // 设置颜色
    }`;

function main() {
    let canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    if(!gl){
        console.log('error');
        return;
    }
    // 初始化着色器
    if(!initShaders(gl,VSHANER_SOURCE,FSHADER_SOURCE)){
        console.log('error');
        return;
    }
    // 获取attribute变量的存储位置
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0){
        console.log('error');
        return;
    }
    // 将顶点位置传输给attribute变量
    gl.vertexAttrib3f(a_Position,0.2,0.0,0.0);
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS,0,1);
}
```
> gl.vertexAttrib3f的同族函数可以去看一下  有 1f 2f 3f 4f 命名规范为 基础函数名+ 参数个数 + 参数类型

## 六、通过鼠标点击绘制  注册响应事件
```js
// 顶点着色器
var VSHANER_SOURCE =
    `
     attribute vec4 a_Position;
     void main() {
        gl_Position = a_Position; //设置坐标
        gl_PointSize = 10.0; // 设置尺寸
     }`;
// 片元着色器程序
var FSHADER_SOURCE =
    `void main() {
        gl_FragColor = vec4(1.0,0.0,0.0,1.0); // 设置颜色
    }`;

function main() {
    let canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    if(!gl){
        console.log('error');
        return;
    }
    // 初始化着色器
    if(!initShaders(gl,VSHANER_SOURCE,FSHADER_SOURCE)){
        console.log('error');
        return;
    }
    // 获取attribute变量的存储位置
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0){
        console.log('error');
        return;
    }
    canvas.onmousedown = function (ev) {
        click(ev,gl,canvas,a_Position);
    }

    // // 将顶点位置传输给attribute变量
     gl.clearColor(0.0,0.0,0.0,1.0);
     gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = []; // 鼠标点击位置的数组
function click(ev,gl,canvas,a_Position) {
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();
    // 之所以加入计算是因为鼠标点击的坐标是浏览器客户端的坐标 而不是canvas的
    x = ((x - rect.left) - canvas.height/2)/(canvas.height/2);
    y = (canvas.width/2 - (y - rect.top))/(canvas.width/2);
    g_points.push(x);
    g_points.push(y);
    gl.clear(gl.COLOR_BUFFER_BIT);
    var len = g_points.length;
    for(var i=0;i<len;i+=2){
        gl.vertexAttrib3f(a_Position,g_points[i],g_points[i+1],0.0);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}
```

## 改变点的颜色 uniform 变量的运用

```js
// 顶点着色器
var VSHANER_SOURCE =
    `
     attribute vec4 a_Position;
     void main() {
        gl_Position = a_Position; //设置坐标
        gl_PointSize = 10.0; // 设置尺寸
     }`;
// 片元着色器程序
var FSHADER_SOURCE =
    `
    // 这句话是精度限定词  后面会有说明
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor; // 设置颜色
    }`;

function main() {
    let canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    if(!gl){
        console.log('error');
        return;
    }
    // 初始化着色器
    if(!initShaders(gl,VSHANER_SOURCE,FSHADER_SOURCE)){
        console.log('error');
        return;
    }
    // 获取attribute变量的存储位置
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0){
        console.log('error');
        return;
    }
    // 获取u_FragColor变量的存储位置
    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if(a_Position < 0){
        console.log('error');
        return;
    }

    canvas.onmousedown = function (ev) {
        click(ev,gl,canvas,a_Position,u_FragColor);
    }

    // // 将顶点位置传输给attribute变量
     gl.clearColor(0.0,0.0,0.0,1.0);
     gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = []; // 鼠标点击位置的数组
var g_colors = []; // 鼠标点击颜色的数组
function click(ev,gl,canvas,a_Position,u_FragColor) {
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();
    x = ((x - rect.left) - canvas.height/2)/(canvas.height/2);
    y = (canvas.width/2 - (y - rect.top))/(canvas.width/2);
    g_points.push([x,y]);

    if(x >=0.0 && y>=0.0){
        g_colors.push([1.0,0.0,0.0,1.0]);
    }else if(x <0.0 && y<0.0){
        g_colors.push([1.0,1.0,0.0,1.0]);
    }else{
        g_colors.push([1.0,1.0,1.0,1.0]);
    }

    gl.clear(gl.COLOR_BUFFER_BIT);
    var len = g_points.length;
    for(var i=0;i<len;i++){
        var xy = g_points[i];
        var rgba = g_colors[i];
        gl.vertexAttrib3f(a_Position,xy[0],xy[1],0.0);
        // 将点的颜色传输到 u_FragColor 变量中
        gl.uniform4f(u_FragColor,rgba[0],rgba[1],rgba[2],rgba[3])
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}
```
## webgl入门就到这里了， 后面会讲绘制和变换三角形




