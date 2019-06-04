# 2-使用Three.js创建你的第一个三维场景

## 一、学习要点
1. 使用Three.js所需要的工具
2. 创建第一个Three.js场景
3. 使用材质，光源，动画来完善第一个场景
4. 引入辅助库以统计和控制场景


## 二、准备工作
- 一个JS文本编辑器： 推荐 vscode 或者 webstorm
- threejs提供了一个在线编辑器  https://threejs.org/editor/
- chrome浏览器

## 三、创建第一个三维场景

我们第一个实例将会包含以下所列的对象：
![微信图片_20190604143914.png](https://upload-images.jianshu.io/upload_images/10319049-3245c384d292f453.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```js
function init() {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
    var renderer = new THREE.WebGLRenderer();
    // 将场景设置成白色，并设置场景的大小
    renderer.setClearColorHex(0xEEEEEE);
    renderer.setSize(window.innerWidth,window.innerHeight);
    // 添加轴和平面
    var axes = new THREE.AxisHelper(20);
    scene.add(axes);

    // 创建平面和材质
    var planeGemetry = new THREE.PlaneGeometry(60,20,1,1);
    var planeMaterial = new THREE.MeshBasicMaterial({color:0xcccccc});
    // 创建网格对象
    var plane = new THREE.Mesh(planeGemetry,planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;
    scene.add(plane);

    var cubeGeometry = new THREE.BoxGeometry(4,4,4);
    // wireframe 是设置是否显示线框
    var cubeMaterial = new THREE.MeshBasicMaterial({color:0xff0000,wireframe:true});
    var cube = new THREE.Mesh(cubeGeometry,cubeMaterial);
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;
    scene.add(cube);

    var sphereGeomtry = new THREE.SphereGeometry(4,20,20);
    var sphereMaterial = new THREE.MeshBasicMaterial({color:0x7777ff,wireframe:true});
    var sphere = new THREE.Mesh(sphereGeomtry,sphereMaterial);
    sphere.position.x = 20;
    sphere.position.y = 4;
    sphere.position.z = 2;
    scene.add(sphere);

    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    document.getElementById("WebGL-output").appendChild(renderer.domElement);
    renderer.render(scene,camera);
}
```
> 首先定义了场景（scene）、摄像机(camera)和渲染器(renderer)。
- 场景: 一个容器，用来保存跟踪所有要渲染的物体和使用光源
- 摄像机： 决定我们在场景中能看到什么
- 渲染对象：基于摄像机的角度计算场景对象在浏览器中会渲染成什么样子。

## 四、添加材质、光源和阴影效果
添加光源非常简单（比webgl简单一百倍），只要定义一个光源添加到场景中就可以了，但是要注意一些要点

- 不是所有材质都对光源有反应的，MeshBasicMaterial基本材质对光照无反应，MeshLambertMaterial 和 MeshPhongMaterial对光照有反应
- 创建阴影 需要打开渲染器的阴影支持，同时要设置阴影的投射者和接收者
- 要使用能产生阴影的光源

```js
function init() {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColorHex(0xEEEEEE);
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.shadowMapEnabled = true; // 让渲染器渲染阴影
    var axes = new THREE.AxisHelper(20);
    scene.add(axes);

    var planeGemetry = new THREE.PlaneGeometry(60,20,1,1);
    var planeMaterial = new THREE.MeshLambertMaterial({color:0xcccccc});
    var plane = new THREE.Mesh(planeGemetry,planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.receiveShadow =  true; // 设置接收阴影
    scene.add(plane);

    var cubeGeometry = new THREE.BoxGeometry(4,4,4);
    var cubeMaterial = new THREE.MeshLambertMaterial({color:0xff0000});
    var cube = new THREE.Mesh(cubeGeometry,cubeMaterial);
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;
    cube.castShadow = true; // 设置投射阴影
    scene.add(cube);

    var sphereGeomtry = new THREE.SphereGeometry(4,20,20);
    var sphereMaterial = new THREE.MeshLambertMaterial({color:0x7777ff});
    var sphere = new THREE.Mesh(sphereGeomtry,sphereMaterial);
    sphere.position.x = 20;
    sphere.position.y = 4;
    sphere.position.z = 2;
    sphere.castShadow = true;
    scene.add(sphere);

    //设置光源
    var spotLight = new THREE.SpotLight(0xffffff); 
    spotLight.position.set(-40,60,-10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    document.getElementById("WebGL-output").appendChild(renderer.domElement);
    renderer.render(scene,camera);
}
```

## 五、让场景动起来

> 让场景动起来和webgl的原理一致，只需要使用requestAnimationFrame对绘制函数重复调用即可，这里有几点要注意的事项 
- Stats是一个检验库用来检查动画运行时的帧数 需要在html中添加 并添加相应的div
- 说好的几点呢？其实真没有动起来很简单。

```js
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
var renderer = new THREE.WebGLRenderer();
var cube;
var sphere;
var globstats;
function init() {
    globstats = initStats();
    renderer.setClearColorHex(0xEEEEEE);
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.shadowMapEnabled = true;
    var axes = new THREE.AxisHelper(20);
    scene.add(axes);
    var planeGemetry = new THREE.PlaneGeometry(60,20,1,1);
    var planeMaterial = new THREE.MeshLambertMaterial({color:0xcccccc});
    var plane = new THREE.Mesh(planeGemetry,planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.receiveShadow =  true;
    scene.add(plane);
    var cubeGeometry = new THREE.BoxGeometry(4,4,4);
    var cubeMaterial = new THREE.MeshLambertMaterial({color:0xff0000});
    cube = new THREE.Mesh(cubeGeometry,cubeMaterial);
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;
    cube.castShadow = true;
    scene.add(cube);
    var sphereGeomtry = new THREE.SphereGeometry(4,20,20);
    var sphereMaterial = new THREE.MeshLambertMaterial({color:0x7777ff});
    sphere = new THREE.Mesh(sphereGeomtry,sphereMaterial);
    sphere.position.x = 20;
    sphere.position.y = 4;
    sphere.position.z = 2;
    sphere.castShadow = true;
    scene.add(sphere);
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40,60,-10);
    spotLight.castShadow = true;
    scene.add(spotLight);
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);
    document.getElementById("WebGL-output").appendChild(renderer.domElement);
    renderScene();

}

var step = 0;
function renderScene() {
    cube.rotation.x += 0.02;
    cube.rotation.y += 0.02;
    cube.rotation.z += 0.02;
    step += 0.04;
    sphere.position.x = 20+(10*(Math.cos(step)));
    sphere.position.y = 2+(10*Math.abs(Math.sin(step)));
    globstats.update();
    requestAnimationFrame(renderScene);
    renderer.render(scene,camera);
}

function initStats() {
    var stats = new Stats();
    // 这个参数为0  检测的是画面每秒传入帧数（fps） 如果是1 检测的是画面渲染时间
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.getElementById("Stats-output").appendChild(stats.domElement);
    return stats

}
```

## 六、使用dat.GUI简化实验流程
> 越复杂的场景如果每次都需要改代码调试 会很繁琐，如果有一个可视化界面允许我们运行时修改这些属性，那么就会简单很多。和统计对象一样 我们要在html中增加 dat.gui.js

```js
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
var renderer = new THREE.WebGLRenderer();
var cube;
var sphere;
var globstats;
function init() {
    globstats = initStats();
    initgui();
    renderer.setClearColorHex(0xEEEEEE);
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.shadowMapEnabled = true;
    var axes = new THREE.AxisHelper(20);
    scene.add(axes);

    var planeGemetry = new THREE.PlaneGeometry(60,20,1,1);
    var planeMaterial = new THREE.MeshLambertMaterial({color:0xcccccc});
    var plane = new THREE.Mesh(planeGemetry,planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;
    plane.receiveShadow =  true;
    scene.add(plane);

    var cubeGeometry = new THREE.BoxGeometry(4,4,4);
    var cubeMaterial = new THREE.MeshLambertMaterial({color:0xff0000});
    cube = new THREE.Mesh(cubeGeometry,cubeMaterial);
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;
    cube.castShadow = true;
    scene.add(cube);

    var sphereGeomtry = new THREE.SphereGeometry(4,20,20);
    var sphereMaterial = new THREE.MeshLambertMaterial({color:0x7777ff});
    sphere = new THREE.Mesh(sphereGeomtry,sphereMaterial);
    sphere.position.x = 20;
    sphere.position.y = 4;
    sphere.position.z = 2;
    sphere.castShadow = true;
    scene.add(sphere);

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40,60,-10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    document.getElementById("WebGL-output").appendChild(renderer.domElement);
    renderScene();

}

var step = 0;
function renderScene() {
    cube.rotation.x += controls.rotationSpeed;
    cube.rotation.y += controls.rotationSpeed;
    cube.rotation.z += controls.rotationSpeed;

    step += controls.bouncingSpeed;
    sphere.position.x = 20+(10*(Math.cos(step)));
    sphere.position.y = 2+(10*Math.abs(Math.sin(step)));
    globstats.update();
    requestAnimationFrame(renderScene);
    renderer.render(scene,camera);
}

// 初始化帧检测器
function initStats() {
    var stats = new Stats();
    // 这个参数为0  检测的是画面每秒传入帧数（fps） 如果是1 检测的是画面渲染时间
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.getElementById("Stats-output").appendChild(stats.domElement);
    return stats
}

// 控制器参数对象
var controls = new function () {
    this.rotationSpeed = 0.02;
    this.bouncingSpeed = 0.03;
}

// 初始化控制器
function initgui() {
    var gui = new dat.GUI();
    gui.add(controls,'rotationSpeed',0,0.5);
    gui.add(controls,'bouncingSpeed',0,0.5);

}
```

## 七、场景对浏览器的自适应
> 当浏览器大小改变时改变摄像机很容易实现自适应。通过监听 window的resize方法
```js

window.addEventListener('resize',onResize,false)
function onResize() {
    // 这个属性是表示屏幕的长宽比
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
}
```

## 八、总结 
本章我们学习了基本的three.js的用法，是不是比webgl简单很多，下一章我们会进一步扩展这个示例学习更多重要的场景构建模块