# 5.使用Three.js的材质
## 一、学习要点
1. 我们将了解THree中的所有材质
[![VRNQJ0.md.png](https://s2.ax1x.com/2019/06/12/VRNQJ0.md.png)](https://imgchr.com/i/VRNQJ0)
2. THREE.RawShaderMaterial是一种特殊的材质，只能和THREE.BufferedGeometry一起使用。此集合体式用来优化静态集合体的一种特殊形式。

## 二、理解材质的共有属性
- 基础属性：这些属性是最常用的。通过这些属性可以控制物体的不透明度，是否可见以及如何被引用
- 融合属性：每个物体都有一些列的融合属性。这些属性决定了物体如何与背景融合。
- 高级属性： 一些高级属性可以控制底层 WebGL 上下文对象渲染物体的方式。

### 1. 基础属性
[![VRBJOK.png](https://s2.ax1x.com/2019/06/12/VRBJOK.png)](https://imgchr.com/i/VRBJOK)
[![VRBVyV.png](https://s2.ax1x.com/2019/06/12/VRBVyV.png)](https://imgchr.com/i/VRBVyV)

### 2. 融合属性
> 融合决定了我们渲染的颜色如何与他们后面的颜色交互。

[![VRDAtH.png](https://s2.ax1x.com/2019/06/12/VRDAtH.png)](https://imgchr.com/i/VRDAtH)

### 3. 高级属性（和webGL的配置项有关）
[![VRDJ9s.png](https://s2.ax1x.com/2019/06/12/VRDJ9s.png)](https://imgchr.com/i/VRDJ9s)

## 三、从简单的网格材质开始
>  本节将介绍 MeshBasicMaterial 、MeshDepthMaterial 、MeshNormalMaterial和 MeshFaceMaterial。材质的参数传入可以通过 1.在构造函数中通过参数对象的方式传入。2.可以创建一个实例，并分别设置属性。

### 1. THREE.MeshBasicMaterial
> 一直简单的材质，不考虑场景中的光照影响。使用这种材质的网格会被渲染成简单的平面多边形。

[![VRrFK0.md.png](https://s2.ax1x.com/2019/06/12/VRrFK0.md.png)](https://imgchr.com/i/VRrFK0)

```js

```