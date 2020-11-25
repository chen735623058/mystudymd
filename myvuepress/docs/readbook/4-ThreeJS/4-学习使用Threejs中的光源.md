# 4. 学习使用Threejs中的光源
> 如果看过Webgl 学习中，可以发现 本身webgl是没有光源的，是通过着色器计算每个像素的颜色来模拟光源，这无疑是很繁琐的，three提供了常用的几种光源，简化我们的开发。
## 一、学习要点
1. 在Three.js 中可用的光源
2. 特定光源使用的时机
3. 如何调整和配置光源的行为
4. 如何创建镜头光晕

## 二、Three.js中不同种类的光源

![微信图片_20190610094054.png](https://upload-images.jianshu.io/upload_images/10319049-b5e187f740139069.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 三、基础光源
1. THREE.AmbientLight
> 这种光源的目的是是弱化阴影或者给场景添加一些额外的颜色。
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
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xeeeeee,1.0));
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.shadowMapEnabled = true;

    var planGeometry = new  THREE.PlaneGeometry(60,20,1,1);
    var planMaterial = new THREE.MeshLambertMaterial({color:0xffffff});
    var plane = new THREE.Mesh(planGeometry,planMaterial);
    plane.receiveShadow = true;

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;
    scene.add(plane);

    var cubeGeometry = new THREE.BoxGeometry(4,4,4);
    var cubeMaterial = new THREE.MeshLambertMaterial({color:0xff0000});
    var cube = new THREE.Mesh(cubeGeometry,cubeMaterial);
    cube.castShadow = true;
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;
    scene.add(cube);
    var sphereGeomtry = new THREE.SphereGeometry(4,20,20);
    var sphereMaterial = new THREE.MeshLambertMaterial({color:0x7777ff});
    var sphere = new THREE.Mesh(sphereGeomtry,sphereMaterial);
    sphere.position.x = 20;
    sphere.position.y = 0;
    sphere.position.z = 2;
    sphere.castShadow = true;
    scene.add(sphere);
    camera.position.x = -25;
    camera.position.y = 30;
    camera.position.z = 25;
    camera.lookAt(new THREE.Vector3(10,0,0));

    var ambiColor = "#0c0c0c";
    var ambientLight = new THREE.AmbientLight(ambiColor);
    scene.add(ambientLight);

    var sportLight = new THREE.SpotLight(0xffffff);
    sportLight.position.set(-40,60,-10);
    sportLight.castShadow = true;
    scene.add(sportLight);

    document.getElementById('WebGL-output').appendChild(renderer.domElement);

    var step = 0;

    var controls = new function () {
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;
        this.ambientColor = ambiColor;
        this.disableSpotlight = false;
    };


    var gui = new dat.GUI();
    gui.addColor(controls,'ambientColor').onChange(function (e) {
        ambientLight.color = new THREE.Color(e);
    });
    gui.add(controls,'disableSpotlight').onChange(function (e) {
        sportLight.visible = !e;
    })

    render();

    function render() {
        stats.update();
        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;
        step += controls.bouncingSpeed;
        sphere.position.x = 20 + ( 10 * (Math.cos(step)));
        sphere.position.y = 2 + ( 10 * Math.abs(Math.sin(step)));
        requestAnimationFrame(render);
        renderer.render(scene,camera);
    }

}
```
> 知识点： THREE.Color 对象 可以使用 （“#ffffff”）和（0xffffff）的形式，也可以使用RGB颜色值（范围是0到1） 它的属性和方法如下表

![微信图片_20190611103541.png](https://upload-images.jianshu.io/upload_images/10319049-e31f9128ea46877f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![微信图片_20190611103601.png](https://upload-images.jianshu.io/upload_images/10319049-1af6f7afcc433f17.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![微信图片_20190611103619.png](https://upload-images.jianshu.io/upload_images/10319049-4c5d3b1073222b8b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

> 知识点： 光源的发射方式

![微信图片_20190611105638.png](https://upload-images.jianshu.io/upload_images/10319049-b3851b402cbde9ef.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


### 2. THREE.PointLight
> 点光源不产生阴影，点光源的属性如下：

![微信图片_20190611110522.png](https://upload-images.jianshu.io/upload_images/10319049-874eb993e19f6457.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

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
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xeeeeee,1.0));
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.shadowMapEnabled = true;

    var planGeometry = new  THREE.PlaneGeometry(60,20,20,20);
    var planMaterial = new THREE.MeshLambertMaterial({color:0xffffff});
    var plane = new THREE.Mesh(planGeometry,planMaterial);
    plane.receiveShadow = true;

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;
    scene.add(plane);

    var cubeGeometry = new THREE.BoxGeometry(4,4,4);
    var cubeMaterial = new THREE.MeshLambertMaterial({color:0xff0000});
    var cube = new THREE.Mesh(cubeGeometry,cubeMaterial);
    cube.castShadow = true;
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;
    scene.add(cube);
    var sphereGeomtry = new THREE.SphereGeometry(4,20,20);
    var sphereMaterial = new THREE.MeshLambertMaterial({color:0x7777ff});
    var sphere = new THREE.Mesh(sphereGeomtry,sphereMaterial);
    sphere.position.x = 20;
    sphere.position.y = 0;
    sphere.position.z = 2;
    sphere.castShadow = true;
    scene.add(sphere);
    camera.position.x = -25;
    camera.position.y = 30;
    camera.position.z = 25;
    camera.lookAt(new THREE.Vector3(10,0,0));

    var ambiColor = "#0c0c0c";
    var ambientLight = new THREE.AmbientLight(ambiColor);
    scene.add(ambientLight);

    var sportLight = new THREE.SpotLight(0xffffff);
    sportLight.position.set(-40,60,-10);
    sportLight.castShadow = true;
    scene.add(sportLight);

    // 点光源
    var pointColor = "#ccffcc";
    var pointLight = new THREE.PointLight(pointColor);
    pointLight.distance = 100;
    scene.add(pointLight);
    // 模拟一个发光顶的小球
    var sphereLight = new THREE.SphereGeometry(0.2);
    var sphereLightMaterial = new THREE.MeshBasicMaterial({color:0xac6c25});
    var sphereLightMesh = new THREE.Mesh(sphereLight,sphereLightMaterial);
    sphereLightMesh.castShadow = true;
    sphereLightMesh.position = new THREE.Vector3(3,0,3);
    scene.add(sphereLightMesh);
    document.getElementById('WebGL-output').appendChild(renderer.domElement);


    var step = 0;
    // 用户确定灯光动画的切换点
    var invert = 1;
    var phase = 0;

    var controls = new function () {
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;
        this.ambientColor = ambiColor;
        this.pointColor = pointColor;
        this.intensity = 1;
        this.distance = 100;
    };


    var gui = new dat.GUI();
    gui.addColor(controls,'ambientColor').onChange(function (e) {
        ambientLight.color = new THREE.Color(e);
    });
    gui.addColor(controls,'pointColor').onChange(function (e) {
        pointLight.color = new THREE.Color(e);
    });
    gui.add(controls, 'intensity', 0, 3).onChange(function (e) {
        pointLight.intensity = e;
    });

    gui.add(controls, 'distance', 0, 100).onChange(function (e) {
        pointLight.distance = e;
    });
    render();

    function render() {
        stats.update();
        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;
        step += controls.bouncingSpeed;
        sphere.position.x = 20 + ( 10 * (Math.cos(step)));
        sphere.position.y = 2 + ( 10 * Math.abs(Math.sin(step)));

        if(phase >2 * Math.PI){
            invert = invert * -1;
            phase -= 2 * Math.PI;
        }else {
            phase += controls.rotationSpeed;
        }
        sphereLightMesh.position.z = +(7 * (Math.sin(phase)));
        sphereLightMesh.position.x = +(14 * (Math.cos(phase)));
        sphereLightMesh.position.y = 5;
        if (invert < 0) {
            var pivot = 14;
            sphereLightMesh.position.x = (invert * (sphereLightMesh.position.x - pivot)) + pivot;
        }
        pointLight.position.copy(sphereLightMesh.position);
        requestAnimationFrame(render);
        renderer.render(scene,camera);
    }

}
```


### 3. THREE.SpotLight
> 聚光灯光源，最常使用的光源之一。它的属性如下：

![微信图片_20190611151144.png](https://upload-images.jianshu.io/upload_images/10319049-4e3b7ab24d89a2ee.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![微信图片_20190611151205.png](https://upload-images.jianshu.io/upload_images/10319049-315c4dcb77d660df.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
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
    var stopMovingLight = false;
    var stats = initStats();
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xeeeeee,1.0));
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.shadowMapEnabled = true;
    // 设置生成更柔和的阴影
    renderer.shadowMapType = THREE.PCFSoftShadowMap;


    var planGeometry = new  THREE.PlaneGeometry(60,20,1,1);
    var planMaterial = new THREE.MeshLambertMaterial({color:0xffffff});
    var plane = new THREE.Mesh(planGeometry,planMaterial);
    plane.receiveShadow = true;

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;
    scene.add(plane);

    var cubeGeometry = new THREE.BoxGeometry(4,4,4);
    var cubeMaterial = new THREE.MeshLambertMaterial({color:0xff3333});
    var cube = new THREE.Mesh(cubeGeometry,cubeMaterial);
    cube.castShadow = true;
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;
    scene.add(cube);
    var sphereGeomtry = new THREE.SphereGeometry(4,20,20);
    var sphereMaterial = new THREE.MeshLambertMaterial({color:0x7777ff});
    var sphere = new THREE.Mesh(sphereGeomtry,sphereMaterial);
    sphere.position.x = 20;
    sphere.position.y = 0;
    sphere.position.z = 2;
    sphere.castShadow = true;
    scene.add(sphere);
    camera.position.x = -35;
    camera.position.y = 30;
    camera.position.z = 25;
    camera.lookAt(new THREE.Vector3(10,0,0));

    var ambiColor = "#1c1c1c";
    var ambientLight = new THREE.AmbientLight(ambiColor);
    scene.add(ambientLight);

    // 创建聚光灯
    var sportLight0 = new THREE.SpotLight(0xcccccc);
    sportLight0.position.set(-40,30,-10);
    sportLight0.lookAt(plane);
    scene.add(sportLight0);

    var target = new THREE.Object3D();
    target.position  = new THREE.Vector3(5,0,0);


    var spotColor = "#FFFFFF";
    var spotLight = new THREE.SpotLight(spotColor);
    spotLight.position.set(-40,60,-10);
    spotLight.castShadow = true;
    spotLight.shadowCameraNear = 2;
    spotLight.shadowCameraFar = 200;
    spotLight.shadowCameraFov = 30;
    spotLight.target = plane;
    spotLight.distance = 0;
    spotLight.angle = 0.4
    scene.add(spotLight);
    // 模拟一个发光顶的小球


    var sphereLight = new THREE.SphereGeometry(0.2);
    var sphereLightMaterial = new THREE.MeshBasicMaterial({color:0xac6c25});
    var sphereLightMesh = new THREE.Mesh(sphereLight,sphereLightMaterial);
    sphereLightMesh.castShadow = true;
    sphereLightMesh.position = new THREE.Vector3(3,20,3);
    scene.add(sphereLightMesh);
    document.getElementById('WebGL-output').appendChild(renderer.domElement);


    var step = 0;
    // 用户确定灯光动画的切换点
    var invert = 1;
    var phase = 0;

    var controls = new function () {
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;
        this.ambientColor = ambiColor;
        this.pointColor = spotColor;
        this.intensity = 1;
        this.distance = 100;
        this.exponent = 30;
        this.angle = 0.1;
        this.debug = false;
        this.castShadow = true;
        this.onlyShadow = false;
        this.target = "Plane";
        this.stopMovingLight = false;
    };


    var gui = new dat.GUI();
    gui.addColor(controls, 'ambientColor').onChange(function (e) {
        ambientLight.color = new THREE.Color(e);
    });

    gui.addColor(controls, 'pointColor').onChange(function (e) {
        spotLight.color = new THREE.Color(e);
    });

    gui.add(controls, 'angle', 0, Math.PI * 2).onChange(function (e) {
        spotLight.angle = e;
    });

    gui.add(controls, 'intensity', 0, 5).onChange(function (e) {
        spotLight.intensity = e;
    });

    gui.add(controls, 'distance', 0, 200).onChange(function (e) {
        spotLight.distance = e;
    });

    gui.add(controls, 'exponent', 0, 100).onChange(function (e) {
        spotLight.exponent = e;
    });

    gui.add(controls, 'debug').onChange(function (e) {
        spotLight.shadowCameraVisible = e;
    });

    gui.add(controls, 'castShadow').onChange(function (e) {
        spotLight.castShadow = e;
    });

    gui.add(controls, 'onlyShadow').onChange(function (e) {
        spotLight.onlyShadow = e;
    });
    gui.add(controls,'target',['Plane','Sphere','Cube']).onChange(function (e) {
        console.log(e);
        switch (e){
            case "Plane":
                spotLight.target = plane;
                break;
            case "Sphere":
                spotLight.target = sphere;
                break;
            case "Cube":
                spotLight.target = cube;
                break;
        }
    });
    gui.add(controls, 'stopMovingLight').onChange(function (e) {
        stopMovingLight = e;
    });
    render();

    function render() {
        stats.update();
        // rotate the cube around its axes
        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;

        // bounce the sphere up and down
        step += controls.bouncingSpeed;
        sphere.position.x = 20 + ( 10 * (Math.cos(step)));
        sphere.position.y = 2 + ( 10 * Math.abs(Math.sin(step)));
        if(!stopMovingLight){
            if(phase >2 * Math.PI){
                invert = invert * -1;
                phase -= 2 * Math.PI;
            }else {
                phase += controls.rotationSpeed;
            }
            sphereLightMesh.position.z = +(7 * (Math.sin(phase)));
            sphereLightMesh.position.x = +(14 * (Math.cos(phase)));
            sphereLightMesh.position.y = 5;
            if (invert < 0) {
                var pivot = 14;
                sphereLightMesh.position.x = (invert * (sphereLightMesh.position.x - pivot)) + pivot;
            }
            spotLight.position.copy(sphereLightMesh.position);
        }

        requestAnimationFrame(render);
        renderer.render(scene,camera);
    }

}
```
### 4. THREE.DirectionalLight 平行光
> 被平行光着着凉的整个区域的光强是一样的,平行光的区域是一个立方体。
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
    var stopMovingLight = false;
    var stats = initStats();
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xeeeeee,1.0));
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.shadowMapEnabled = true;
    // 设置生成更柔和的阴影
    renderer.shadowMapType = THREE.PCFSoftShadowMap;


    var planGeometry = new  THREE.PlaneGeometry(600,200,20,20);
    var planMaterial = new THREE.MeshLambertMaterial({color:0xffffff});
    var plane = new THREE.Mesh(planGeometry,planMaterial);
    plane.receiveShadow = true;

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = -5;
    plane.position.z = 0;
    scene.add(plane);

    var cubeGeometry = new THREE.BoxGeometry(4,4,4);
    var cubeMaterial = new THREE.MeshLambertMaterial({color:0xff3333});
    var cube = new THREE.Mesh(cubeGeometry,cubeMaterial);
    cube.castShadow = true;
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;
    scene.add(cube);
    var sphereGeomtry = new THREE.SphereGeometry(4,20,20);
    var sphereMaterial = new THREE.MeshLambertMaterial({color:0x7777ff});
    var sphere = new THREE.Mesh(sphereGeomtry,sphereMaterial);
    sphere.position.x = 20;
    sphere.position.y = 0;
    sphere.position.z = 2;
    sphere.castShadow = true;
    scene.add(sphere);
    camera.position.x = -350;
    camera.position.y = 300;
    camera.position.z = 250;
    camera.lookAt(new THREE.Vector3(10,0,0));

    var ambiColor = "#1c1c1c";
    var ambientLight = new THREE.AmbientLight(ambiColor);
    scene.add(ambientLight);


    var target = new THREE.Object3D();
    target.position  = new THREE.Vector3(5,0,0);


    var directionColor = "#FFFFFF";
    var directionalLight = new THREE.DirectionalLight(directionColor);
    directionalLight.position.set(-40,60,-10);
    directionalLight.castShadow = true;
    directionalLight.shadowCameraNear = 2;
    directionalLight.shadowCameraFar = 200;
    directionalLight.shadowCameraLeft = -50;
    directionalLight.shadowCameraRight = 50;
    directionalLight.shadowCameraTop = 50;
    directionalLight.shadowCameraBottom = -50;
    directionalLight.distance = 0; // 光源的方向
    directionalLight.intensity = 0.5; // 光源的强度
    directionalLight.shadowMapHeight = 1024;
    directionalLight.shadowMapWidth = 1024;
    scene.add(directionalLight);
    // 模拟一个发光顶的小球


    var sphereLight = new THREE.SphereGeometry(0.2);
    var sphereLightMaterial = new THREE.MeshBasicMaterial({color:0xac6c25});
    var sphereLightMesh = new THREE.Mesh(sphereLight,sphereLightMaterial);
    sphereLightMesh.castShadow = true;
    sphereLightMesh.position = new THREE.Vector3(3,20,3);
    scene.add(sphereLightMesh);
    document.getElementById('WebGL-output').appendChild(renderer.domElement);


    var step = 0;
    var controls = new function () {
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;
        this.ambientColor = ambiColor;
        this.directionColor = directionColor;
        this.intensity = 0.5;
        this.distance = 0;
        this.exponent = 30;
        this.angle = 0.1;
        this.debug = false;
        this.castShadow = true;
        this.onlyShadow = false;
        this.target = "Plane";
        this.stopMovingLight = false;
    };


    var gui = new dat.GUI();
    gui.addColor(controls, 'ambientColor').onChange(function (e) {
        ambientLight.color = new THREE.Color(e);
    });

    gui.addColor(controls, 'directionColor').onChange(function (e) {
        directionalLight.color = new THREE.Color(e);
    });

    gui.add(controls, 'intensity', 0, 5).onChange(function (e) {
        directionalLight.intensity = e;
    });

    gui.add(controls, 'distance', 0, 200).onChange(function (e) {
        directionalLight.distance = e;
    });


    gui.add(controls, 'debug').onChange(function (e) {
        directionalLight.shadowCameraVisible = e;
    });

    gui.add(controls, 'castShadow').onChange(function (e) {
        directionalLight.castShadow = e;
    });

    gui.add(controls, 'onlyShadow').onChange(function (e) {
        directionalLight.onlyShadow = e;
    });
    gui.add(controls,'target',['Plane','Sphere','Cube']).onChange(function (e) {
        console.log(e);
        switch (e){
            case "Plane":
                directionalLight.target = plane;
                break;
            case "Sphere":
                directionalLight.target = sphere;
                break;
            case "Cube":
                directionalLight.target = cube;
                break;
        }
    });
    gui.add(controls, 'stopMovingLight').onChange(function (e) {
        stopMovingLight = e;
    });
    render();

    function render() {
        stats.update();
        // rotate the cube around its axes
        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;

        // bounce the sphere up and down
        step += controls.bouncingSpeed;
        sphere.position.x = 20 + ( 10 * (Math.cos(step)));
        sphere.position.y = 2 + ( 10 * Math.abs(Math.sin(step)));
        if(!stopMovingLight){
            sphereLightMesh.position.z = -8;
            sphereLightMesh.position.y = +(27 * (Math.sin(step / 3)));
            sphereLightMesh.position.x = 10 + (26 * (Math.cos(step / 3)));
            directionalLight.position.copy(sphereLightMesh.position);
        }

        requestAnimationFrame(render);
        renderer.render(scene,camera);
    }

}
```

## 四、特殊光源

### 1. THREE.HemisphereLight 半球光光源
> 使用这个光源可以创建出更加贴近自然的户外光照效果。在户外并不是所有的光照都来自于上方，很多来自于散射和地面以及其他物体反射。

[![Vg2eVf.png](https://s2.ax1x.com/2019/06/11/Vg2eVf.png)](https://imgchr.com/i/Vg2eVf)

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
    var stopMovingLight = false;
    var stats = initStats();
    var scene = new THREE.Scene();
    // 增加场景雾化
    scene.fog = new THREE.Fog(0xaaaaaa,0.010,200);

    var camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xeeeeee,1.0));
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.shadowMapEnabled = true;

    var textureGrass = THREE.ImageUtils.loadTexture("assets/textures/ground/grasslight-big.jpg")
    textureGrass.wrapS = THREE.RepeatWrapping;
    textureGrass.wrapT = THREE.RepeatWrapping;
    textureGrass.repeat.set(4,4);

    var planGeometry = new  THREE.PlaneGeometry(1000,200,20,20);
    var planMaterial = new THREE.MeshLambertMaterial({map:textureGrass});
    var plane = new THREE.Mesh(planGeometry,planMaterial);
    plane.receiveShadow = true;

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;
    scene.add(plane);

    var cubeGeometry = new THREE.BoxGeometry(4,4,4);
    var cubeMaterial = new THREE.MeshLambertMaterial({color:0xff3333});
    var cube = new THREE.Mesh(cubeGeometry,cubeMaterial);
    cube.castShadow = true;
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;
    scene.add(cube);
    var sphereGeomtry = new THREE.SphereGeometry(4,25,25);
    var sphereMaterial = new THREE.MeshLambertMaterial({color:0x7777ff});
    var sphere = new THREE.Mesh(sphereGeomtry,sphereMaterial);
    sphere.position.x = 10;
    sphere.position.y = 5;
    sphere.position.z = 10;
    sphere.castShadow = true;
    scene.add(sphere);
    camera.position.x = -20;
    camera.position.y = 15;
    camera.position.z = 45;
    camera.lookAt(new THREE.Vector3(10,0,0));


    var spotLight0 = new THREE.SpotLight(0xcccccc);
    spotLight0.position.set(-40,60,-10);
    spotLight0.lookAt(plane);
    scene.add(spotLight0);


    var target = new THREE.Object3D();
    target.position  = new THREE.Vector3(5,0,0);


    // 半球光源
    var hemiLight = new THREE.HemisphereLight(0x0000ff,0x00ff00,0.6);
    hemiLight.position.set(0,500,0);
    scene.add(hemiLight);


    var pointColor = "#ffffff";
    var dirLight = new THREE.DirectionalLight(pointColor);
    dirLight.position.set(30, 10, -50);
    dirLight.castShadow = true;
    dirLight.target = plane;
    dirLight.shadowCameraNear = 0.1;
    dirLight.shadowCameraFar = 200;
    dirLight.shadowCameraLeft = -50;
    dirLight.shadowCameraRight = 50;
    dirLight.shadowCameraTop = 50;
    dirLight.shadowCameraBottom = -50;
    dirLight.shadowMapWidth = 2048;
    dirLight.shadowMapHeight = 2048;

    scene.add(dirLight);
    document.getElementById('WebGL-output').appendChild(renderer.domElement);


    var step = 0;
    var controls = new function () {
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;
        this.hemisphere = true;
        this.color = 0x00ff00;
        this.skyColor = 0x0000ff;
        this.intensity = 0.6;
    };


    var gui = new dat.GUI();

    gui.add(controls, 'hemisphere').onChange(function (e) {

        if (!e) {
            hemiLight.intensity = 0;
        } else {
            hemiLight.intensity = controls.intensity;
        }
    });
    gui.addColor(controls, 'color').onChange(function (e) {
        hemiLight.groundColor = new THREE.Color(e);
    });
    gui.addColor(controls, 'skyColor').onChange(function (e) {
        hemiLight.color = new THREE.Color(e);
    });
    gui.add(controls, 'intensity', 0, 5).onChange(function (e) {
        hemiLight.intensity = e;
    });
    render();

    function render() {
        stats.update();
        // rotate the cube around its axes
        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;

        // bounce the sphere up and down
        step += controls.bouncingSpeed;
        sphere.position.x = 20 + ( 10 * (Math.cos(step)));
        sphere.position.y = 2 + ( 10 * Math.abs(Math.sin(step)));

        requestAnimationFrame(render);
        renderer.render(scene,camera);
    }

}
```
> 可以将代码中的聚光灯 和 平行光注释掉看看效果

### 2. THREE.AreaLight

> 可以定义一个长方形的发光区域，这个并不是标准的Threejs 库，而是在它的扩展库中，如果用AreaLight这种复杂的光源，就不能使用WebGLRenderer了，因为他的性能不够好，需要使用WebGLDeferredRenderer对象。要使用这个对象需要加入以下几个库。

[![VgILBd.png](https://s2.ax1x.com/2019/06/11/VgILBd.png)](https://imgchr.com/i/VgILBd)

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
    var renderer = new THREE.WebGLDeferredRenderer({
        width:window.innerWidth,
        height:window.innerHeight,
        scale:1,
        antialias:true,
        tonemapping:THREE.FilmicOperator,
        brightness:2.5
    })



    var planGeometry = new  THREE.PlaneGeometry(70,70,1,1);
    var planMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, specular: 0xffffff, shininess: 200});
    var plane = new THREE.Mesh(planGeometry,planMaterial);

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    scene.add(plane);

    camera.position.x = 20;
    camera.position.y = 30;
    camera.position.z = 21;
    camera.lookAt(new THREE.Vector3(0,0,-30));

    document.getElementById('WebGL-output').appendChild(renderer.domElement);

    var spotLight0 = new THREE.SpotLight(0xcccccc);
    spotLight0.position.set(-40, 60, -10);
    spotLight0.intensity = 0.1;
    spotLight0.lookAt(plane);
    scene.add(spotLight0);
    var areaLight1 = new THREE.AreaLight(0xff0000, 3);
    areaLight1.position.set(-10, 10, -35);
    areaLight1.rotation.set(-Math.PI / 2, 0, 0);
    areaLight1.width = 4;
    areaLight1.height = 9.9;
    scene.add(areaLight1);

    var areaLight2 = new THREE.AreaLight(0x00ff00, 3);
    areaLight2.position.set(0, 10, -35);
    areaLight2.rotation.set(-Math.PI / 2, 0, 0);
    areaLight2.width = 4;
    areaLight2.height = 9.9;
    scene.add(areaLight2);

    var areaLight3 = new THREE.AreaLight(0x0000ff, 3);
    areaLight3.position.set(10, 10, -35);
    areaLight3.rotation.set(-Math.PI / 2, 0, 0);
    areaLight3.width = 4;
    areaLight3.height = 9.9;
    scene.add(areaLight3);


    var planeGeometry1 = new THREE.BoxGeometry(4, 10, 0);
    var planeGeometry1Mat = new THREE.MeshBasicMaterial({color: 0xff0000});
    var plane1 = new THREE.Mesh(planeGeometry1, planeGeometry1Mat);
    plane1.position.copy(areaLight1.position);
    scene.add(plane1);


    var planeGeometry2 = new THREE.BoxGeometry(4, 10, 0);
    var planeGeometry2Mat = new THREE.MeshBasicMaterial({color: 0x00ff00});
    var plane2 = new THREE.Mesh(planeGeometry2, planeGeometry2Mat);

    plane2.position.copy(areaLight2.position);
    scene.add(plane2);

    var planeGeometry3 = new THREE.BoxGeometry(4, 10, 0);
    var planeGeometry3Mat = new THREE.MeshBasicMaterial({color: 0x0000ff});
    var plane3 = new THREE.Mesh(planeGeometry3, planeGeometry3Mat);

    plane3.position.copy(areaLight3.position);
    scene.add(plane3);

    var controls = new function () {
        this.rotationSpeed = 0.02;
        this.color1 = 0xff0000;
        this.intensity1 = 2;
        this.color2 = 0x00ff00;
        this.intensity2 = 2;
        this.color3 = 0x0000ff;
        this.intensity3 = 2;
    };


    var gui = new dat.GUI();
    gui.addColor(controls, 'color1').onChange(function (e) {
        areaLight1.color = new THREE.Color(e);
        planeGeometry1Mat.color = new THREE.Color(e);
        scene.remove(plane1);
        plane1 = new THREE.Mesh(planeGeometry1, planeGeometry1Mat);
        plane1.position.copy(areaLight1.position);
        scene.add(plane1);

    });
    gui.add(controls, 'intensity1', 0, 5).onChange(function (e) {
        areaLight1.intensity = e;
    });
    gui.addColor(controls, 'color2').onChange(function (e) {
        areaLight2.color = new THREE.Color(e);
        planeGeometry2Mat.color = new THREE.Color(e);
        scene.remove(plane2);
        plane2 = new THREE.Mesh(planeGeometry2, planeGeometry2Mat);
        plane2.position.copy(areaLight2.position);
        scene.add(plane2);
    });
    gui.add(controls, 'intensity2', 0, 5).onChange(function (e) {
        areaLight2.intensity = e;
    });
    gui.addColor(controls, 'color3').onChange(function (e) {
        areaLight3.color = new THREE.Color(e);
        planeGeometry3Mat.color = new THREE.Color(e);
        scene.remove(plane3);
        plane3 = new THREE.Mesh(planeGeometry1, planeGeometry3Mat);
        plane3.position.copy(areaLight3.position);
        scene.add(plane3);
    });
    gui.add(controls, 'intensity3', 0, 5).onChange(function (e) {
        areaLight3.intensity = e;
    });
    render();

    function render() {
        stats.update();
        // rotate the cube around its axes
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

}
```
### 3. 镜头光晕
> 当你直接朝着太阳或明亮的光源拍照时会出现镜头光晕效果，在三维世界中可以让场景看起来更真实。可以通过THREE.LensFlare对象来创建镜头光晕。

![V251je.png](https://s2.ax1x.com/2019/06/12/V251je.png)
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
     scene.fog = new THREE.Fog(0xaaaaaa,0.010,200);

    var camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,1000);
    var randerer = new THREE.WebGLRenderer({antialias:true,alpha:true});
    randerer.setClearColor(new THREE.Color(0xaaaaff,1.0));
    randerer.setSize(window.innerWidth,window.innerHeight);
    randerer.shadowMapEnabled = true;
    // 加载纹理
    var textureGrass = THREE.ImageUtils.loadTexture("assets/textures/ground/grasslight-big.jpg");
    textureGrass.wrapS = THREE.RepeatWrapping;
    textureGrass.wrapT = THREE.RepeatWrapping;
    textureGrass.repeat.set(4, 4);

    var planGeometry = new  THREE.PlaneGeometry(1000,200,20,20);
    var planMaterial = new THREE.MeshLambertMaterial({map:textureGrass});
    var plane = new THREE.Mesh(planGeometry,planMaterial);
    plane.receiveShadow = true;

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;
    scene.add(plane);

    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff3333});
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;
    scene.add(cube);

    var sphereGeometry = new THREE.SphereGeometry(4, 25, 25);
    var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.x = 10;
    sphere.position.y = 5;
    sphere.position.z = 10;
    sphere.castShadow = true;
    scene.add(sphere);


    camera.position.x = -20;
    camera.position.y = 15;
    camera.position.z = 45;
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    var ambiColor = "#1c1c1c";
    var ambientLight = new THREE.AmbientLight(ambiColor);
    scene.add(ambientLight);

    var spotLight0 = new THREE.SpotLight(0xcccccc);
    spotLight0.position.set(-40, 60, -10);
    spotLight0.lookAt(plane);
    scene.add(spotLight0);


    var target = new THREE.Object3D();
    target.position = new THREE.Vector3(5, 0, 0);

    var directionalLightColor = "#ffffff";
//    var spotLight = new THREE.SpotLight( pointColor);
    var directionalLight = new THREE.DirectionalLight(directionalLightColor);
    directionalLight.position.set(30, 10, -50);
    directionalLight.castShadow = true;
    directionalLight.shadowCameraNear = 0.1;
    directionalLight.shadowCameraFar = 100;
    directionalLight.shadowCameraFov = 50;
    directionalLight.target = plane;
    directionalLight.distance = 0;
    directionalLight.shadowCameraNear = 2;
    directionalLight.shadowCameraFar = 200;
    directionalLight.shadowCameraLeft = -100;
    directionalLight.shadowCameraRight = 100;
    directionalLight.shadowCameraTop = 100;
    directionalLight.shadowCameraBottom = -100;
    directionalLight.shadowMapWidth = 2048;
    directionalLight.shadowMapHeight = 2048;


     scene.add(directionalLight);



    document.getElementById('WebGL-output').appendChild(randerer.domElement);

    var step = 0;
    var controls = new function () {
        this.rotationSpeed = 0.03;
        this.bouncingSpeed = 0.03;
        this.ambientColor = ambiColor;
        this.directionalLightColor = directionalLightColor;
        this.intensity = 0.1;
        this.distance = 0;
        this.exponent = 30;
        this.angle = 0.1;
        this.debug = false;
        this.castShadow = true;
        this.onlyShadow = false;
        this.target = "Plane";
    };

    var gui = new dat.GUI();
    gui.addColor(controls, 'ambientColor').onChange(function (e) {
        ambientLight.color = new THREE.Color(e);
    });

    gui.addColor(controls, 'directionalLightColor').onChange(function (e) {
        directionalLight.color = new THREE.Color(e);
    });

    gui.add(controls, 'intensity', 0, 5).onChange(function (e) {
        directionalLight.intensity = e;
    });
    // 增加镜头光晕
    var textureFlare0 = THREE.ImageUtils.loadTexture("assets/textures/lensflare/lensflare0.png");
    var textureFlare3 = THREE.ImageUtils.loadTexture("assets/textures/lensflare/lensflare3.png");

    var flareColor = new THREE.Color(0xffaacc);
    var lensFlare = new THREE.LensFlare(textureFlare0, 350, 0.0, THREE.AdditiveBlending, flareColor);

    lensFlare.add(textureFlare3, 60, 0.6, THREE.AdditiveBlending);
    lensFlare.add(textureFlare3, 70, 0.7, THREE.AdditiveBlending);
    lensFlare.add(textureFlare3, 120, 0.9, THREE.AdditiveBlending);
    lensFlare.add(textureFlare3, 70, 1.0, THREE.AdditiveBlending);

    lensFlare.position.copy(directionalLight.position);
    scene.add(lensFlare);

    render();

    function render() {
        stats.update();
        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;
        step += controls.bouncingSpeed;
        sphere.position.x = 20 + ( 10 * (Math.cos(step)));
        sphere.position.y = 2 + ( 10 * Math.abs(Math.sin(step)));
        requestAnimationFrame(render);
        randerer.render(scene, camera);
    }

}
```

## 五、总结
本章学习了很多关于光源的知识，内容很多，不过实现起来都比较简单，下一章学习材质的相关知识