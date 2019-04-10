# 绘制和变换三角形
## 一、学习要点
1. 三角形在三维图形学中的重要地位，以及WebGL如何绘制三角形。
2. 使用多个三角形绘制其他类型的基本图形。
3. 利用简单大方程对三角形进行基本变换。
4. 利用矩阵简化变换。

## 二、绘制多个点
> 绘制多个定点要用到顶点缓冲区对象。并且要显示的告诉要绘制多少个顶点。  gl.createBuffer()用来创建缓冲区对象。gl.deleteBuffer(buffer) 删除被gl创建出的缓冲区对象 这里有一个知识点： （类型化数组：自己查百度）
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
    //******* 设置顶点的位置********
    var n=initVertexBuffers(gl);
    if(n<0){
        console.log("error");
        return;
    }

    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS,0,n);
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        0.0,0.5,-0.5,-0.5,0.5,-0.5
    ]);
    var n =3 ; // 点的个数
    // 创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    if(! vertexBuffer){
        console.log("error");
        return -1;
    }
    // 将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
    var a_Position = gl.getAttribLocation(gl.program,'a_Position');
    // 将缓冲区对象分配给 a_Position变量
    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0);
    // 开启缓冲区 和变量的联系
    gl.enableVertexAttribArray(a_Position);
    return n;
}
```
> ### 缓冲区对象： 是WebGL系统中的一块存储区域，你可以在缓冲区对象汇总保存想要绘制的所有顶点数据，然后一次性的向顶点着色器中传入多个顶点的变量的数据。如下图：

![](https://upload-images.jianshu.io/upload_images/10319049-3dae4adc9bc6c281.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 三、绘制三角形
> 绘制三角形与绘制三个点的代码大体一样需要改动两个地方
```js
// 去了掉了gl_PointSize = 10.0 因为这个参数只有在绘制单点时才起作用
var VSHANER_SOURCE =
    `
     attribute vec4 a_Position;
     void main() {
        gl_Position = a_Position; //设置坐标
     }`;

// 将gl.POINTS 改成了 gl.TRINAGLES 这是关键 从缓冲区中的第一个顶点开始，使顶点着色器执行三次，用着三个点绘制一个三角形
 gl.drawArrays(gl.TRIANGLES,0,n);
```

> gl.drawArrays第一个参数的功能十分强大。通过制定不同的mode 我们有其中不同的方式来绘制图形。（v0 v1...   代表缓冲区中的点）
![微信图片_20190408142842.png](https://upload-images.jianshu.io/upload_images/10319049-25e5eaa57c778f4f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![微信图片_20190408142909.png](https://upload-images.jianshu.io/upload_images/10319049-8561171b1625077d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 四、绘制矩形
```js
    var vertices = new Float32Array([
       -0.5,0.5,-0.5,-0.5,0.5,0.5,0.5,-0.5
    ]);
    var n =4 ; // 点的个数
```
> 注意理解点的顺序！！！ 

## 五、移动 旋转 缩放 （仿射变换）

> 平移 ： 发生在顶点着色器上，逐顶点操作，将每个分量增加一个移动的常量。
```js
// 使用uniform 
var VSHANER_SOURCE =
    `
     attribute vec4 a_Position;
     uniform vec4 u_Translation;
     void main() {
        gl_Position = a_Position + u_Translation; //设置坐标
     }`;

// 绘制方法前加入对u_Translation的传值

    var Tx = 0.5 ,Ty = 0.5, Tz = 0.0;
    var u_Translation = gl.getUniformLocation(gl.program,'u_Translation');
    gl.uniform4f(u_Translation,Tx,Ty,Tz,0.0);

```

> 旋转：旋转本身比平移复杂一些，为了描述一个旋转需要指明
1. 旋转轴
2. 旋转方向
3. 旋转角度

```js
// 顶点着色器
var VSHANER_SOURCE =
    // x1 = xcosb -ysinb
    // y1 = xsinb + ycosb
    // z1 = z
    `
     attribute vec4 a_Position;
     uniform float u_CosB, u_SinB;
     void main() {
        gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB; //设置坐标
        gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB; //设置坐标
        gl_Position.z = a_Position.z; //设置坐标
        gl_Position.w = 1.0 ; //设置坐标
     }`;
// main 函数修改

// 旋转的角度
var ANGLE = 90.0;
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
    //******* 设置顶点的位置********
    var n=initVertexBuffers(gl);
    if(n<0){
        console.log("error");
        return;
    }
    var radian = Math.PI * ANGLE /180.0 ; //转为弧度制
    var cosB = Math.cos(radian);
    var sinB = Math.sin(radian);
    var u_CosB = gl.getUniformLocation(gl.program,'u_CosB');
    var u_SinB = gl.getUniformLocation(gl.program,'u_SinB');
    gl.uniform1f(u_CosB,cosB);
    gl.uniform1f(u_SinB,sinB);

    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,n);
}

```
> 使用变换矩阵： 
1. 旋转矩阵 
```js
// 顶点着色器
var VSHANER_SOURCE =
    `
     attribute vec4 a_Position;
     uniform mat4 u_xformMatrix; 
     void main() {
        gl_Position = u_xformMatrix * a_Position;
     }`;


// 旋转的角度
var ANGLE = 90.0;
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
    //******* 设置顶点的位置********
    var n=initVertexBuffers(gl);
    if(n<0){
        console.log("error");
        return;
    }
    var radian = Math.PI * ANGLE /180.0 ; //转为弧度制
    var cosB = Math.cos(radian);
    var sinB = Math.sin(radian);
    var xformMatrix = new Float32Array([
        cosB,sinB,0.0,0.0,
        -sinB,cosB,0.0,0.0,
        0.0,0.0,1.0,0.0,
        0.0,0.0,0.0,1.0
    ]);
    // 将旋转矩阵传入给顶点着色器
    var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
    gl.uniformMatrix4fv(u_xformMatrix,false,xformMatrix);

    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,n);
}
```

>  采用矩阵 平移 
```js
// 旋转的角度

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
    //******* 设置顶点的位置********
    var n=initVertexBuffers(gl);
    if(n<0){
        console.log("error");
        return;
    }
    var Tx = 0.5 ,Ty = 0.5, Tz = 0.0;
    var xformMatrix = new Float32Array([
        1.0,0.0,0.0,0.0,
        0.0,1.0,0.0,0.0,
       0.0,0.0,1.0,0.0,
       Tx,Ty,Tz,1.0
    ]);
    // 将旋转矩阵传入给顶点着色器
    var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
    gl.uniformMatrix4fv(u_xformMatrix,false,xformMatrix);

    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,n);
}
```

> 缩放矩阵
```js
    var sx = 1.0 , sy = 1.5 , sz = 1.0 ;
    var xformMatrix = new Float32Array([
        sx,0,0.0,0.0,
        0,sy,0.0,0.0,
        0.0,0.0,sz,0.0,
        0.0,0.0,0.0,1.0
    ]);
```

本章最重要的就是矩阵变换，一定要熟练掌握 。 下一章我们学习高级变换和动画基础

