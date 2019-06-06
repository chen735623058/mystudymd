# 3.构建Three.js场景的基本组件
## 一、学习要点
1. 在Three.js 场景中使用的组件
2. THREE.Scene对象的作用
3. 几何图形和网格是如何关联 
4. 正交投影摄像机和透视投影摄像机的区别

## 二、创建场景

一个场景里面想要显示任何东西，都需要有三种类型的组件
![微信图片_20190605141718.png](https://upload-images.jianshu.io/upload_images/10319049-28e67c8df9d1563d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 1. 场景的基本功能
通过下列代码可以了解场景的各种方法和选项。
```js
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

function init() {
    var stats = initStats();
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
    scene.add(camera);

    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xeeeeee,1.0));
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.shadowMapEnabled = true;

    var planGeometry = new  THREE.PlaneGeometry(60,40,1,1);
    var planMaterial = new THREE.MeshLambertMaterial({color:0xffffff});
    var plane = new THREE.Mesh(planGeometry,planMaterial);
    plane.receiveShadow = true;

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    scene.add(plane);

    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    // 环境光
    var ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    // 聚光灯
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40,60,-10);
    spotLight.castShadow = true;
    scene.add(spotLight);


    document.getElementById('WebGL-output').appendChild(renderer.domElement);
    var step = 0;
    var controls = new  function () {
        this.rotationSpeed = 0.02;
        this.numberofObjects = scene.children.length;
        this.removeCube = function () {
            var allChildren = scene.children;
            var lastObject = allChildren[allChildren.length-1];
            if(lastObject instanceof THREE.Mesh){
                scene.remove(lastObject);
                this.numberofObjects = scene.children.length;
            }
        };
        this.addCube = function () {
            var cubeSize = Math.ceil(Math.random()*3);
            var cubeGeometry = new THREE.BoxGeometry(cubeSize,cubeSize,cubeSize);
            var cubeMaterial = new THREE.MeshLambertMaterial({color:Math.random()*0xffffff});
            var cube = new THREE.Mesh(cubeGeometry,cubeMaterial);
            cube.castShadow = true;
            cube.name = "cube-"+scene.children.length;
            cube.position.x = -30 + Math.round((Math.random() * planGeometry.parameters.width));
            cube.position.y = Math.round((Math.random() * 5));
            cube.position.z = -20 + Math.round((Math.random() * planGeometry.parameters.height));
            scene.add(cube);
            this.numberofObjects = scene.children.length;
        };
        this.outputObjects = function () {
            console.log(scene.children);
        }
    };

    var gui = new dat.GUI();
    gui.add(controls,'rotationSpeed',0,0.5);
    gui.add(controls,'addCube');
    gui.add(controls,'removeCube');
    gui.add(controls,'outputObjects');
    gui.add(controls,'numberofObjects').listen();

    render();

    function render() {
        stats.update();
        scene.traverse(function (e) {
            if(e instanceof  THREE.Mesh && e != plane){
                e.rotation.x += controls.rotationSpeed;
                e.rotation.y += controls.rotationSpeed;
                e.rotation.z += controls.rotationSpeed;
            }
        });
        requestAnimationFrame(render);
        renderer.render(scene,camera);
    }
    
}
```
- THREE.Scene.Add 向场景中添加对象
- THREE.Scene.Remove 场景中删除对象
- THREE.Scene.children 场景中对象列表
- THREE.Scene.getObjectByName 利用name属性获取场景中特定的对象
- THREE.Scene.traverse 接收一个方法，这个方法会在每个场景中的对象和子对象上执行

### 2. 给场景添加无话效果
```js
    scene.fog = new THREE.Fog(0XFFFFFF,0.015,100); // 线性增加雾化效果
    scene.fog = new THREE.FogExp2(0XFFFFFF,0.01);  // 指数增加雾化效果
```

### 3. 使用overrideMaterial 属性 实现材质覆盖
设置了材质覆盖，场景中的物体都变成了这种材质。
```js
  scene.overrideMaterial = new THREE.MeshLambertMaterial({color:0xffffff});
```

## 三、几何体和网格

### 1. 几何体的属性和方法
> 几何体其实就是三维空间中的点集（也称作顶点）和将这些点连接起来的面。这其实是Three帮我们简化了顶点编辑的功能，在webgl的学习中很大的代码编写是在编辑几何体的顶点。当然除了使用Three.js提供的的几何体外也可以通过定义顶点和面来自定义创建几何体。

- 创建顶点使用 THREE.Vector3
- 创建面使用 THREE.Face3
顶点的顺序决定了面是面向摄像机还是背向摄像机。顶点顺时针是表面摄像机，顶点逆时针是背向摄像机。

下面来看看在Webgl中最繁琐的编辑顶点在Three中会不会简单一点。
```js
/**
 * create by sxf on 2019/6/5.
 * 功能:
 */

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

function init() {
    var stats = initStats();
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
    scene.add(camera);

    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xeeeeee,1.0));
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.shadowMapEnabled = true;

    var planGeometry = new  THREE.PlaneGeometry(60,40,1,1);
    var planMaterial = new THREE.MeshLambertMaterial({color:0xffffff});
    var plane = new THREE.Mesh(planGeometry,planMaterial);
    plane.receiveShadow = true;

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    scene.add(plane);

    camera.position.x = -20;
    camera.position.y = 25;
    camera.position.z = 20;
    camera.lookAt(new THREE.Vector3(5,0,0));

    // 聚光灯
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40,60,10);
    spotLight.castShadow = true;
    scene.add(spotLight);


    document.getElementById('WebGL-output').appendChild(renderer.domElement);
    var step = 0;
    // 定义顶点
    var vertices = [
        new THREE.Vector3(1, 3, 1),
        new THREE.Vector3(1, 3, -1),
        new THREE.Vector3(1, -1, 1),
        new THREE.Vector3(1, -1, -1),
        new THREE.Vector3(-1, 3, -1),
        new THREE.Vector3(-1, 3, 1),
        new THREE.Vector3(-1, -1, -1),
        new THREE.Vector3(-1, -1, 1)
    ];
    // 定义面 面中参数是顶点的序号
    var faces = [
        new THREE.Face3(0, 2, 1),
        new THREE.Face3(2, 3, 1),
        new THREE.Face3(4, 6, 5),
        new THREE.Face3(6, 7, 5),
        new THREE.Face3(4, 5, 1),
        new THREE.Face3(5, 0, 1),
        new THREE.Face3(7, 6, 2),
        new THREE.Face3(6, 3, 2),
        new THREE.Face3(5, 7, 0),
        new THREE.Face3(7, 2, 0),
        new THREE.Face3(1, 3, 4),
        new THREE.Face3(3, 6, 4),
    ];

    var geom = new THREE.Geometry();
    geom.vertices= vertices;
    geom.faces = faces;
    // 计算法向量（使得相应光照和阴影）
    geom.computeFaceNormals();
    var materials = [
        new THREE.MeshLambertMaterial({opacity:0.6,color:0x44ff44,transparent:true}),
        new THREE.MeshBasicMaterial({color:0x000000,wireframe:true})
    ]
    var mesh = THREE.SceneUtils.createMultiMaterialObject(geom,materials);
    mesh.children.forEach(
        function (e) {
            e.castShadow = true;
        }
    );
    scene.add(mesh);

    function addControl(x,y,z) {
        var controls = new function () {
            this.x = x;
            this.y = y;
            this.z = z;
        };
        return controls;
    }

    var controlPoints = [];
    controlPoints.push(addControl(3,5,3));
    controlPoints.push(addControl(3,5,0));
    controlPoints.push(addControl(3,0,3));
    controlPoints.push(addControl(3,0,0));
    controlPoints.push(addControl(0,5,0));
    controlPoints.push(addControl(0,5,3));
    controlPoints.push(addControl(0,0,0));
    controlPoints.push(addControl(0,0,3));

    
    var gui = new dat.GUI();
    gui.add(new function () { // 通过colne可以创建更多的不同样子的几何体
        this.clone = function () {
            var clonedGeometry = mesh.children[0].geometry.clone();
            var materials = [
                new THREE.MeshLambertMaterial({opacity:0.6,color:0x44ff44,transparent:true}),
                new THREE.MeshBasicMaterial({color:0x000000,wireframe:true})
            ];
            var mesh2 = THREE.SceneUtils.createMultiMaterialObject(clonedGeometry,materials);
            mesh2.children.forEach(function (e) {
                e.castShadow = true
            });

            mesh2.translateX(5);
            mesh2.translateZ(5);
            mesh2.name = "clone";
            scene.remove(scene.getChildByName("clone"));
            scene.add(mesh2);
        }
    },'clone');
    for(var i=0;i<8;i++){
        f1 = gui.addFolder('Vertices ' + (i + 1));
        f1.add(controlPoints[i], 'x', -10, 10);
        f1.add(controlPoints[i], 'y', -10, 10);
        f1.add(controlPoints[i], 'z', -10, 10);
    }

    render();

    function render() {
        stats.update();
        var vertices = [];
        for(var i=0;i<8;i++){
            vertices.push(new THREE.Vector3(controlPoints[i].x,controlPoints[i].y,controlPoints[i].z))
        }
        mesh.children.forEach(
            function (e) {
                e.geometry.vertices = vertices; //将组成网格的几何体的vertices属性指向一个更新后的顶点数组。
                e.geometry.verticesNeedUpdate = true; // 判断顶点是否更新了，如果更新了就要告诉geometry对象需要更新
                e.geometry.computeFaceNormals();
            }
        )
        requestAnimationFrame(render);
        renderer.render(scene,camera);
    }
    
}
```

需要注意的知识点：
- computeFaceNormals方法是用来决定mien的法向量的，法向量在webgl课程中讲过，是用来确定光照颜色的
- createMultiMaterialObject 支持使用多材质 这个方法并不是创建一个网格对象，而是为每个材质创建一个实例
- 添加线框除了使用材质外 还可以使用 THREE.WireframeHelper(mesh,color) 方法

### 2. 网格对象的属性和方法

> 创建网格需要一个几何体以及一个或者多个材质。当网格创建好只有我们就可以将他添加到场景中，并进行渲染。网格对象提供了改变它在场景中位置和显示效果的几个属性
![微信图片_20190606114049.png](https://upload-images.jianshu.io/upload_images/10319049-ae30f1009eac6407.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
通过下面的示例可以体验这些属性。
```js
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

function init() {
    var stats = initStats();
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
    scene.add(camera);
    var axes = new THREE.AxisHelper(20);
    scene.add(axes);
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xeeeeee,1.0));
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.shadowMapEnabled = true;

    var planGeometry = new  THREE.PlaneGeometry(60,40,1,1);
    var planMaterial = new THREE.MeshLambertMaterial({color:0xffffff});
    var plane = new THREE.Mesh(planGeometry,planMaterial);
    plane.receiveShadow = true;

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    scene.add(plane);

    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    var ambientLight = new THREE.AmbientLight(0X0C0C0C);
    scene.add(ambientLight);

    // 聚光灯
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40,60,10);
    spotLight.castShadow = true;
    scene.add(spotLight);


    document.getElementById('WebGL-output').appendChild(renderer.domElement);
    var controls = new function () {
        this.scaleX = 1;
        this.scaleY = 1;
        this.scaleZ = 1;

        this.positionX = 0;
        this.positionY = 4;
        this.positionZ = 0;

        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
        this.scale = 1;

        this.translateX = 0;
        this.translateY = 0;
        this.translateZ = 0;

        this.visible = true;

        this.translate = function () {

            cube.translateX(controls.translateX);
            cube.translateY(controls.translateY);
            cube.translateZ(controls.translateZ);

            controls.positionX = cube.position.x;
            controls.positionY = cube.position.y;
            controls.positionZ = cube.position.z;
        }
    };
    var material = new THREE.MeshLambertMaterial({color:0x44ff44});
    var geom = new THREE.BoxGeometry(5,8,3);
    var cube = new THREE.Mesh(geom,material);
    cube.position.y = 4;
    cube.castShadow = true;
    scene.add(cube);

    var gui = new dat.GUI();
    guiScale = gui.addFolder('SCALE');
    guiScale.add(controls,'scaleX',0,5);
    guiScale.add(controls,'scaleY',0,5);
    guiScale.add(controls,'scaleZ',0,5);
    guiPosition = gui.addFolder('position');
    var contX = guiPosition.add(controls, 'positionX', -10, 10);
    var contY = guiPosition.add(controls, 'positionY', -4, 20);
    var contZ = guiPosition.add(controls, 'positionZ', -10, 10);
    contX.listen();
    contX.onChange(function (value) {
        cube.position.x = controls.positionX;
    });

    contY.listen();
    contY.onChange(function (value) {
        cube.position.y = controls.positionY;
    });

    contZ.listen();
    contZ.onChange(function (value) {
        cube.position.z = controls.positionZ;
    });
    guiRotation = gui.addFolder('rotation');
    guiRotation.add(controls, 'rotationX', -4, 4);
    guiRotation.add(controls, 'rotationY', -4, 4);
    guiRotation.add(controls, 'rotationZ', -4, 4);

    guiTranslate = gui.addFolder('translate');

    guiTranslate.add(controls, 'translateX', -10, 10);
    guiTranslate.add(controls, 'translateY', -10, 10);
    guiTranslate.add(controls, 'translateZ', -10, 10);
    guiTranslate.add(controls, 'translate');

    gui.add(controls, 'visible');

    render();

    function render() {
        stats.update();
        cube.visible = controls.visible;
        cube.rotation.x = controls.rotationX;
        cube.rotation.y = controls.rotationY;
        cube.rotation.z = controls.rotationZ;
        cube.scale.set(controls.scaleX,controls.scaleY,controls.scaleZ);
        requestAnimationFrame(render);
        renderer.render(scene,camera);
    }
    
}
```
知识要点：
- 可以分别设置 x y z也可以一次性的设置 scale.set(controls.scaleX,controls.scaleY,controls.scaleZ)
- 还可以使用Vector3设置  cube.postion = new THREE.Vector3(10,3,1)
- rotation属性控制旋转， 如果想使用度数来设置则要对度数做一些变换 degree * (Math.PI/180)
- translate是相对于当前位置的平移距离

## 四、 旋转合适的摄像机

### 1. 正交投影摄像机和透视投影摄像机

> 这两个摄像机的区别在于透视投影遵循了自然规律的近大远小规则，而正交投影不遵循。置于他们的原理可以在webgl系列里面有介绍。
下面的代码可以体验一下。
```js
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

function init() {
    var stats = initStats();
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
    camera.position.x = 120;
    camera.position.y = 60;
    camera.position.z = 180;


    scene.add(camera);
    var axes = new THREE.AxisHelper(20);
    scene.add(axes);
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xeeeeee,1.0));
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.shadowMapEnabled = true;

    var planGeometry = new  THREE.PlaneGeometry(180,180);
    var planMaterial = new THREE.MeshLambertMaterial({color:0xffffff});
    var plane = new THREE.Mesh(planGeometry,planMaterial);
    plane.receiveShadow = true;

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    scene.add(plane);

    var cubeGeometry = new THREE.BoxGeometry(4,4,4);
    for (var j = 0; j <(planGeometry.parameters.height/5); j++) {
        for (var i = 0; i < (planGeometry.parameters.width/5); i++) {
            var rnd = Math.random() * 0.75 + 0.25;
            var cubeMaterial = new THREE.MeshLambertMaterial();
            cubeMaterial.color = new THREE.Color(rnd,0,0);
            var cube = new THREE.Mesh(cubeGeometry,cubeMaterial);
            cube.position.z = -((planGeometry.parameters.height)/2) + 2 +(j*5);
            cube.position.x = -((planGeometry.parameters.width)/2) + 2 +(i*5);
            cube.position.y = 2;
            scene.add(cube);
        }
    }
    var directionalLight = new THREE.DirectionalLight(0xffffff,0.7);
    directionalLight.position.set(-20,40,60);
    scene.add(directionalLight);
    var ambientLight = new THREE.AmbientLight(0x292929);
    scene.add(ambientLight);
    document.getElementById('WebGL-output').appendChild(renderer.domElement);
    var controls = new function () {
        this.perspective = "Perspective";
        this.switchCamera = function () {
            if(camera instanceof THREE.PerspectiveCamera){
                camera = new THREE.OrthographicCamera(window.innerWidth/-16,window.innerWidth/16,window.innerHeight/16,window.innerHeight/-16,-200,500);
                camera.position.x = 120;
                camera.position.y = 60;
                camera.position.z = 180;
                camera.lookAt(scene.position);
                this.perspective = "Orthographic";
            }else{
                camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
                camera.position.x = 120;
                camera.position.y = 60;
                camera.position.z = 180;
                camera.lookAt(scene.position);
                this.perspective = "Perspective";
            }
        }
    };


    var gui = new dat.GUI();
    gui.add(controls, 'switchCamera');
    gui.add(controls, 'perspective').listen();


    camera.lookAt(scene.position);

    render();

    function render() {
        stats.update();
        cube.visible = controls.visible;
        cube.rotation.x = controls.rotationX;
        cube.rotation.y = controls.rotationY;
        cube.rotation.z = controls.rotationZ;
        cube.scale.set(controls.scaleX,controls.scaleY,controls.scaleZ);
        requestAnimationFrame(render);
        renderer.render(scene,camera);
    }
    
}
```

知识要点 
- 对于PerspectiveCamera摄像机的参数
![微信图片_20190606151527.png](https://upload-images.jianshu.io/upload_images/10319049-2027e6f40f6e0c3c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

如下图：
![微信图片_20190606151620.png](https://upload-images.jianshu.io/upload_images/10319049-f345ff4525c64b52.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- 对于正交投影摄像机的参数
![微信图片_20190606151841.png](https://upload-images.jianshu.io/upload_images/10319049-4d4bc8d8a506518b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![微信图片_20190606151855.png](https://upload-images.jianshu.io/upload_images/10319049-90411fb3137fe5f5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


### 2. 将摄像机聚焦到指定点上

> 摄像机定位的点 也就是我们在webgl里面所说的视点。下面的例子可以体验一下视点的移动会使得场景的绘制带来什么样的变化。
```js
/**
 * create by sxf on 2019/6/5.
 * 功能:
 */

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

function init() {
    var stats = initStats();
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
    camera.position.x = 120;
    camera.position.y = 60;
    camera.position.z = 180;


    scene.add(camera);
    var axes = new THREE.AxisHelper(20);
    scene.add(axes);
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xeeeeee,1.0));
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.shadowMapEnabled = true;

    var planGeometry = new  THREE.PlaneGeometry(180,180);
    var planMaterial = new THREE.MeshLambertMaterial({color:0xffffff});
    var plane = new THREE.Mesh(planGeometry,planMaterial);
    plane.receiveShadow = true;

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    scene.add(plane);

    var cubeGeometry = new THREE.BoxGeometry(4,4,4);
    for (var j = 0; j <(planGeometry.parameters.height/5); j++) {
        for (var i = 0; i < planGeometry.parameters.width/5; i++) {
            var rnd = Math.random() * 0.75 + 0.25;
            var cubeMaterial = new THREE.MeshLambertMaterial();
            cubeMaterial.color = new THREE.Color(rnd,0,0);
            var cube = new THREE.Mesh(cubeGeometry,cubeMaterial);
            cube.position.z = -((planGeometry.parameters.height)/2) + 2 +(j*5);
            cube.position.x = -((planGeometry.parameters.width)/2) + 2 +(i*5);
            cube.position.y = 2;
            scene.add(cube);
        }
    }

    var lookAtGeom = new THREE.SphereGeometry(2);
    var lookAtMesh = new THREE.Mesh(lookAtGeom, new THREE.MeshLambertMaterial({color: 0xff0000}));
    scene.add(lookAtMesh);
    var directionalLight = new THREE.DirectionalLight(0xffffff,0.7);
    directionalLight.position.set(-20,40,60);
    scene.add(directionalLight);
    var ambientLight = new THREE.AmbientLight(0x292929);
    scene.add(ambientLight);
    document.getElementById('WebGL-output').appendChild(renderer.domElement);
    var controls = new function () {
        this.perspective = "Perspective";
        this.switchCamera = function () {
            if(camera instanceof THREE.PerspectiveCamera){
                camera = new THREE.OrthographicCamera(window.innerWidth/-16,window.innerWidth/16,window.innerHeight/16,window.innerHeight/-16,-200,500);
                camera.position.x = 120;
                camera.position.y = 60;
                camera.position.z = 180;
                camera.lookAt(scene.position);
                this.perspective = "Orthographic";
            }else{
                camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
                camera.position.x = 120;
                camera.position.y = 60;
                camera.position.z = 180;
                camera.lookAt(scene.position);
                this.perspective = "Perspective";
            }
        }
    };


    var gui = new dat.GUI();
    gui.add(controls, 'switchCamera');
    gui.add(controls, 'perspective').listen();


    camera.lookAt(scene.position);

    render();
    var step = 0;
    function render() {
        stats.update();
        step += 0.001;
        if (camera instanceof THREE.Camera) {
            var x = 10 + ( 100 * (Math.sin(step)));
            camera.lookAt(new THREE.Vector3(x, 10, 0));
            lookAtMesh.position.copy(new THREE.Vector3(x, 10, 0));
        }
        requestAnimationFrame(render);
        renderer.render(scene,camera);
    }
    
}
```

## 五、总结
 本章学习了
 1. scene 场景
 2. 内置几何体
 3. 摄像机
 
 的相关知识。下一章我们会介绍不同的光源。