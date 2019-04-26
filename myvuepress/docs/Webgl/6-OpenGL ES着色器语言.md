# OpenGL ES着色器语言
## 一、学习要点
> 本章稍作休息，暂时不实验WebGL示例程序，我们熟悉一下 OpenGL ES着色器语言，及其关键特性。
1. 数据、变量和变量类型。
2. 矢量、矩阵、结构体、数组、采样器（纹理）。
3. 运算、程序流、函数
4. attribute、uniform 和 varying 变量
5. 精度限定词
6. 预处理和质量。
## 二、你好 着色器 （hello word）
简单的着色器
```js
// 顶点着色器
attribute vec4 a_Position;
attribute vec4 a_Color;
uniform mat4 u_MvpMatrix;
varying vect v_Color;
void main(){
    gl_Position = u_MvpMatrix * a_Position ;
    v_Color = a_Color;
}

// 片元着色器
precision mediump float;
varying vec4 v_Color;
void main() {
    gl_FragColor = v_Color;
}
```

## 三、基础知识
- 程序是大小写敏感的（marina 和 Marina不同）。
- 每一个语句都应该以英文分号结束。
- 执行次序： 从main() 函数开始执行。main()函数不能有任何返回值，也不接收任何参数。
- 注释格式和JS相同。

## 四、 数据值类型（数值和 布尔值）
GLSL只支持两种数据值类型。不支持字符串
## 五、 变量
- 可以使用任何变量名，不能以保留字 和gl_ webgl_ _webgl_ 开头就行。
## 六、 GLSL ES 是强类型语言
使用var 关键字来声明所有变量。必须具体指明变量类型。 声明方式是 <类型> <变量名> 如 vec4 a_Position
## 七、基本类型
float 单精度浮点数类型
int 整数
bool 布尔值
>  变量赋值的时候一定要注意等号两边的类型要相同，如果不相同就会报错。类型转换方式 float() 将整数转换成浮点数。
```js
 int i=8;
 float f1 = float(i);
```
> 支持的转换函数有
- int(): 将浮点数小数部删去，true转换为1 false 转换成0  
- float() ： 整数转换成浮点数 true转换成1.0 false 转换成 0.0
- bool()： 0 转换成 false  非0转成 true
## 八、 矢量和矩阵
- 矢量类型： vec2 vec3 vec4  ivec2 ivec3 ivec4 bvec2 bvec3 bvec4 
- 矩阵 mat2 mat3 mat4
构造函数赋值  如 vec4 position = vec4(1.0,2.0,3.0,4.0)；
多个矢量合并成一个矢量 vec4 v4b = vec4(v2,v4) 规则是先把第一个参数的所有元素填进去 如果未填满，就继续使用第二额参数v4中的元素填充
- 矩阵构造函数
  向矩阵构造函数中传入矩阵的每个元素的数值来构造矩阵，注意传入值的顺序必须是列主序。
  ```js
  mat4 m4 = mat4(
      1.0,2.0,3.0,4.0,
      5.0,6.0,7.0,8.0,
      9.0,10.0,11.0,12.0,
      13.0,14.0,15.0,16.0 ); 

      // 最后的矩阵结构是   1.0,5.0,9.0,13.0,
      //                   2.0,6.0,10.0,14.0,
      //                   3.0,7.0,11.0,15.0,
      //                   4.0,8.0,12.0,16.0
  ```
  向矩阵中传入单个数值，会形成对小贤上元素都是该值 其他元素为0;
## 九、访问元素
- 在矢量变量名后接点运算符（.）然后接上分两名，就可以访问矢量元素了。如下
1. x,y,z,w 用来获取顶点坐标分量
2. r,g,b,a 用来获取颜色分量
3. s,t,p,q 用来获取纹理坐标分量
- 多个分量命共同置于运算符后 就可以从矢量中同时抽取多个分量。叫做（混合 swizzling）
- [] 需要注意的是不不能使用未经const修饰的变量作为索引值 除非他是循环索引

## 十、结构体
> 使用关键字 struct 将已存在的类型聚合到一起，就可以定义为结构体，比如
```js
    struct light{
        vec4 color;
        vec3 position;
    }
    light l1ml2
```
## 十一、 数组
> 与JavaScript不同 GLSL ES只支持一维数组。也不支持pop() 和 push() 等操作， 创建数组时也不需要使用new 运算符。声明时不需要new 运算符。例如

float floatArray[4];
vec4 vec4Array[2];

> 数组只支持[] 运算符 但数组的元素能够参与其自身类型支持的任意运算。比如 float f = floatArray[1] * 3.14;

> 数组下标不能是变量 只能是常量 或者 uniform变量
## 十二、取样器（纹理）
>  取样器（sampler）我们必须通过该类型变量访问纹理。有两种基本的取样器类型： sampler2D 和 samplerCube。取样器变量只能是uniform变量，或者需要访问纹理的函数，如texture2D() 函数。 如 uniform sampler2D u_Sampler;
- 取样器的复制必须要使用gl.uniformli()来进行赋值。

## 十三、程序流程控制 分支与循环。
- 分支使用 if else 控制 没有switch语句
- for 循环  和JS一样
- continue break 和 discard语句
discard只能在片元着色器中使用，表示放弃当前片元直接处理下一个片元 后续会具体讲到。
## 十四、函数
格式如下
```c
    返回类型 函数名 （type0 arg0, type1 arg1 ...）{
        函数计算
        return 返回值
    }

    // 例如下代码 将RGBA颜色全置换为亮度值
    float luma(vec4 color){
        float r = color.r;
        float g = color.g;
        float b = color.b;
        return 0.2126 * r + 0.7162 *g + 0.0772 *b    
    }

    // 调用方法
    attribute vec4 a_Color;
    void main(){
        float brightness = luma(a_Color);
    }
```
- 规范声明： 如果函数定义在调用之后 一定要在调用前使用规范声明  如 float luma(vec4);

- 参数限定字： 
1. in 想函数中传入值，可以修改，但不会影响函数外面的变量
2. 向函数中传入值，但是这个值不能修改
3. out 在函数中被赋值，并被传出
4. inout 传入函数，同时在函数中被赋值，并被传出。
5. 没有限定 和in 一样

## 十五、 内置函数
![微信图片_20190426110745.png](https://upload-images.jianshu.io/upload_images/10319049-00d187b229a77e37.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 十六、 全局变量和局部变量
> 和 js相同
## 十七、 存储限定字
> attribute、varying 、 uniform 、const
### Attribute变量
- 只能出现在顶点着色器中。
- 只能被声明为全局变量。
- 变量类型只能是 float vec2 vec3 vec4 mat2 mat3 mat5
- attribute的最大数目  gl_MaxVertexAttribs 最小值为 8
### uniform变量
- 可以在顶点着色器和片元着色器中。
- uniform变量是只读的。
- 顶点着色器中最小个数 为 128  片元着色器中最小个数为 16
### varying变量
- 必须是全局变量，从顶点着色器向片元着色器传输数据。
## 十八、 精度限定字
> 目的是提高运行效率，削减内存开支。
- precision mediump float(中等精度)
- precision highp float(高精度)
- precision lowp float(低精度)
- 每种类型都有默认精度，除了片元着色器中的float类型
![微信图片_20190426113034.png](https://upload-images.jianshu.io/upload_images/10319049-4c289d236ae371e5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
## 十九、 指令预处理
```js
#ifdef GL_ES
  precision mediump float;
#endif
```

总结 本章主要是GLSL ES语言的核心特性，后续如果有疑问可以作为工具查询。 下一章正式进入三维的世界。