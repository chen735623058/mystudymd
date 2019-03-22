# 绘制和变换三角形
## 一、学习要点
1. 三角形在三维图形学中的重要地位，以及WebGL如何绘制三角形。
2. 使用多个三角形绘制其他类型的基本图形。
3. 利用简单大方程对三角形进行基本变换。
4. 利用矩阵简化变换。

## 二、绘制多个点
> 绘制多个定点要用到顶点缓冲区对象。并且要显示的告诉要绘制多少个顶点。  gl.createBuffer()用来创建缓冲区对象。 这里有一个知识点： 类型化数组
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