var stats;

var scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH,
    renderer, container;

var hemisphereLight, shadowLight;

var car, ground;

var trees = [];

var clouds = [];

var speed = 1;

var carLevel = 0;

var mousePos = {x:0, y:0};

var currentLane = 1;

var lanes = [-35, 0, 35];

var Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x59332e,
    pink:0xF5986E,
    brownDark:0x23190f,
    blue:0x68c3c0,
    ground:0x654321,
    green:0x96ceb4
};

var Ground = function()
{
    var groundGeom = new THREE.PlaneGeometry(1200, 1200, 1, 1);
    var groundMat = new THREE.MeshPhongMaterial({color:Colors.ground, shading:THREE.FlatShading});

    this.mesh = new THREE.Mesh(groundGeom, groundMat);
    this.mesh.name = 'ground';
    this.mesh.receiveShadow = true;
};

var Tree = function()
{
    this.mesh = new THREE.Object3D();
    this.mesh.name = "tree";

    var foliageGeom = new THREE.DodecahedronGeometry(20);
    var foliageMat = new THREE.MeshPhongMaterial({color:Colors.green, shading:THREE.FlatShading});
    var foliage = new THREE.Mesh(foliageGeom, foliageMat);
    this.mesh.add(foliage);
    foliage.position.y = 60;
    foliage.rotation.y = Math.random() * Math.PI;
    foliage.castShadow = true;

    var trunkGeom = new THREE.CylinderGeometry(Math.abs(Math.random() * 3) + 1, Math.abs(Math.random() * 5) + 3, 100);
    var trunkMat = new THREE.MeshPhongMaterial({color:Colors.brown, shading:THREE.FlatShading});
    var trunk = new THREE.Mesh(trunkGeom, trunkMat);
    this.mesh.add(trunk);
    trunk.castShadow = true;
};

var Car = function()
{
    this.mesh = new THREE.Object3D();
    this.mesh.name = "car";

    var bodyMat = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
    var bodyGeom = new THREE.BoxGeometry(50, 30, 80, 1, 1, 1);
    var body = new THREE.Mesh(bodyGeom, bodyMat);
    body.castShadow = true;
    body.receiveShadow = true;
    this.mesh.add(body);

    //Protector
    var wheelProtectGeom = new THREE.BoxGeometry(8, 12, 25, 1, 1, 1);
    var wheelProtectMat = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
    var wheelProtect = new THREE.Mesh(wheelProtectGeom, wheelProtectMat);
    wheelProtect.receiveShadow = true;
    wheelProtectGeom.vertices[1].z += 5;
    wheelProtectGeom.vertices[4].z += 5;
    wheelProtectGeom.vertices[5].z -= 5;
    wheelProtectGeom.vertices[0].z -= 5;

    var wheelProtectFL = wheelProtect.clone();
    wheelProtectFL.position.set(25, -12, 20);
    this.mesh.add(wheelProtectFL);

    var wheelProtectFR = wheelProtect.clone();
    wheelProtectFR.position.set(-25, -12, 20);
    this.mesh.add(wheelProtectFR);

    var wheelProtectBL = wheelProtect.clone();
    wheelProtectBL.position.set(25, -12, -20);
    this.mesh.add(wheelProtectBL);

    var wheelProtectBR = wheelProtect.clone();
    wheelProtectBR.position.set(-25, -12, -20);
    this.mesh.add(wheelProtectBR);

    //Tires!!!!
    var wheelTireGeom = new THREE.CylinderGeometry(10, 10, 4);
    var wheelTireMat = new THREE.MeshPhongMaterial({color:Colors.brownDark, shading:THREE.FlatShading});
    var wheelTire = new THREE.Mesh(wheelTireGeom, wheelTireMat);
    wheelTire.castShadow = true;

    var wheelTireFL = wheelTire.clone();
    wheelTireFL.position.set(25, -18, 20);
    wheelTireFL.rotation.z = Math.PI/2;
    this.mesh.add(wheelTireFL);

    var wheelTireFR = wheelTire.clone();
    wheelTireFR.position.set(-25, -18, 20);
    wheelTireFR.rotation.z = Math.PI/2;
    this.mesh.add(wheelTireFR);

    var wheelTireBL = wheelTire.clone();
    wheelTireBL.position.set(25, -18, -20);
    wheelTireBL.rotation.z = Math.PI/2;
    this.mesh.add(wheelTireBL);

    var wheelTireBR = wheelTire.clone();
    wheelTireBR.position.set(-25, -18, -20);
    wheelTireBR.rotation.z = Math.PI/2;
    this.mesh.add(wheelTireBR);

    //Windshield
    var geomWindshield = new THREE.BoxGeometry(3, 20, 45, 1, 1, 1);
    var matWindshield = new THREE.MeshPhongMaterial({color:Colors.white, transparent:true, opacity:.3, shading:THREE.FlatShading});
    var windshield = new THREE.Mesh(geomWindshield, matWindshield);
    windshield.position.set(0, 20, 30);
    windshield.rotation.y = Math.PI/2;
    windshield.castShadow = true;
    windshield.receiveShadow = true;
    this.mesh.add(windshield);

    //Bumper
    var bumperGeom = new THREE.BoxGeometry(55, 6, 6);
    var bumperMat = new THREE.MeshPhongMaterial({color:Colors.white, shading:THREE.FlatShading});
    var bumper = new THREE.Mesh(bumperGeom, bumperMat);
    bumper.receiveShadow = true;

    var frontBumper = bumper.clone();
    frontBumper.position.set(0, -14, 40);
    this.mesh.add(frontBumper);

    var backBumper = bumper.clone();
    backBumper.position.set(0, -14, -40);
    this.mesh.add(backBumper);

    //Number Plate
    var numberPlateGeom = new THREE.BoxGeometry(12, 10, 2);
    var numberPlateMat = new THREE.MeshPhongMaterial({color:Colors.white, shading:THREE.FlatShading});
    var numberPlate = new THREE.Mesh(numberPlateGeom, numberPlateMat);
    numberPlate.receiveShadow = true;
    this.mesh.add(numberPlate);
    numberPlate.position.set(0, -5, -40);

    //lights
    var lightsGeom = new THREE.BoxGeometry(6, 8, 2);
    var lightsMat = new THREE.MeshPhongMaterial({color:Colors.pink, shading:THREE.FlatShading});
    var lights = new THREE.Mesh(lightsGeom, lightsMat);
    lights.receiveShadow = true;

    var backLightsL = lights.clone();
    this.mesh.add(backLightsL);
    backLightsL.position.set(-20, 10, -40);

    var backLightsR = lights.clone();
    this.mesh.add(backLightsR);
    backLightsR.position.set(20, 10, -40);

    var frontLightsL = lights.clone();
    this.mesh.add(frontLightsL);
    frontLightsL.position.set(-20, 10, 40);

    var frontLightsR = lights.clone();
    this.mesh.add(frontLightsR);
    frontLightsR.position.set(20, 10, 40);

    //engine vent
    var engineVentGeom = new THREE.BoxGeometry(40, 2, 1);
    var engineVentMat = new THREE.MeshPhongMaterial({color:Colors.white, shading:THREE.FlatShading});
    var engineVent = new THREE.Mesh(engineVentGeom, engineVentMat);

    var engineVentT = engineVent.clone();
    this.mesh.add(engineVentT);
    engineVentT.position.set(0, 0, 40);

    var engineVentM = engineVent.clone();
    this.mesh.add(engineVentM);
    engineVentM.position.set(0, -3, 40);

    var engineVentB = engineVent.clone();
    this.mesh.add(engineVentB);
    engineVentB.position.set(0, -6, 40);

    this.pilot = new Pilot();
    this.pilot.mesh.position.set(-10, 27, 10);
    this.pilot.mesh.rotation.y = -Math.PI / 2;
    this.mesh.add(this.pilot.mesh);
};

var Pilot = function()
{
    this.mesh = new THREE.Object3D();
    this.mesh.name = "pilot";
    this.angleHairs = 0;

    var bodyGeom = new THREE.BoxGeometry(15,15,15);
    var bodyMat = new THREE.MeshPhongMaterial({color:Colors.brown, shading:THREE.FlatShading});
    var body = new THREE.Mesh(bodyGeom, bodyMat);
    body.position.set(2,-12,0);

    this.mesh.add(body);

    var faceGeom = new THREE.BoxGeometry(10,10,10);
    var faceMat = new THREE.MeshLambertMaterial({color:Colors.pink});
    var face = new THREE.Mesh(faceGeom, faceMat);
    this.mesh.add(face);

    var hairGeom = new THREE.BoxGeometry(4,4,4);
    var hairMat = new THREE.MeshLambertMaterial({color:Colors.brown});
    var hair = new THREE.Mesh(hairGeom, hairMat);
    hair.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,2,0));
    var hairs = new THREE.Object3D();

    this.hairsTop = new THREE.Object3D();

    for (var i=0; i < 12; i++)
    {
        var h = hair.clone();
        var col = i % 3;
        var row = Math.floor(i/3);
        var startPosZ = -4;
        var startPosX = -4;
        h.position.set(startPosX + row * 4, 0, startPosZ + col * 4);
        h.geometry.applyMatrix(new THREE.Matrix4().makeScale(1, 1, 1));
        this.hairsTop.add(h);
    }
    hairs.add(this.hairsTop);

    var hairSideGeom = new THREE.BoxGeometry(12,4,2);
    hairSideGeom.applyMatrix(new THREE.Matrix4().makeTranslation(-6,0,0));
    var hairSideR = new THREE.Mesh(hairSideGeom, hairMat);
    var hairSideL = hairSideR.clone();
    hairSideR.position.set(8,-2,6);
    hairSideL.position.set(8,-2,-6);
    hairs.add(hairSideR);
    hairs.add(hairSideL);

    var hairBackGeom = new THREE.BoxGeometry(2,8,10);
    var hairBack = new THREE.Mesh(hairBackGeom, hairMat);
    hairBack.position.set(-1,-4,0);
    hairs.add(hairBack);
    hairs.position.set(-5,5,0);

    this.mesh.add(hairs);

    var glassGeom = new THREE.BoxGeometry(5,5,5);
    var glassMat = new THREE.MeshLambertMaterial({color:Colors.brown});
    var glassR = new THREE.Mesh(glassGeom,glassMat);
    glassR.position.set(6,0,3);
    var glassL = glassR.clone();
    glassL.position.z = -glassR.position.z;

    var glassAGeom = new THREE.BoxGeometry(11,1,11);
    var glassA = new THREE.Mesh(glassAGeom, glassMat);
    this.mesh.add(glassR);
    this.mesh.add(glassL);
    this.mesh.add(glassA);

    var earGeom = new THREE.BoxGeometry(2,3,2);
    var earL = new THREE.Mesh(earGeom,faceMat);
    earL.position.set(0,0,-6);
    var earR = earL.clone();
    earR.position.set(0,0,6);
    this.mesh.add(earL);
    this.mesh.add(earR);
};

Pilot.prototype.updateHairs = function()
{
    var hairs = this.hairsTop.children;

    for (var i=0; i < hairs.length; i++)
    {
        var h = hairs[i];
        h.scale.y = .75 + Math.cos(this.angleHairs + i/3) * 0.25;
    }

    this.angleHairs += 0.16;
};

var Cloud = function()
{
    this.mesh = new THREE.Object3D();
    this.mesh.name = "cloud";

    var geom = new THREE.DodecahedronGeometry(20);
    var mat = new THREE.MeshPhongMaterial({color:Colors.white});

    var nBlocs = 3 + Math.floor(Math.random() * 3);
    for (var i = 0; i < nBlocs; i++)
    {
        var m = new THREE.Mesh(geom.clone(), mat);
        m.position.x = i * 15;
        m.position.y = Math.random() * 10;
        m.position.z = Math.random() * 10;
        m.rotation.z = Math.random() * Math.PI * 2;
        m.rotation.y = Math.random() * Math.PI * 2;
        var s = 0.1 + Math.random() * 0.9;
        m.scale.set(s, s, s);
        this.mesh.add(m);
        m.castShadow = true;
    }
}

Cloud.prototype.rotate = function()
{
    var l = this.mesh.children.length;
    for(var i = 0; i < l; i++)
    {
        var m = this.mesh.children[i];
        m.rotation.z += Math.random() * 0.005 * (i + 1);
        m.rotation.y += Math.random() * 0.002 * (i + 1);
    }
}

window.addEventListener('load', init, false);

function init()
{
    createScene();

    createLights();

    createCar();

    createGround();

    createTrees();

    createSky();

    loop();

    stats = createStats();
    document.body.appendChild( stats.domElement );

    document.addEventListener('mousemove', handleMouseMove, false);
    //document.addEventListener('keyup', handleKeyUp, false);
}

function createStats()
{
    var tempStats = new Stats();
    tempStats.setMode(0);

    tempStats.domElement.style.position = 'absolute';
    tempStats.domElement.style.left = '0';
    tempStats.domElement.style.top = '0';

    return tempStats;
};

function handleKeyUp( event )
{
	switch ( event.keyCode )
    {
		case 39:
			if(currentLane != lanes.length - 1)
            {
                currentLane++;
			}
            break;
		case 37:
            if(currentLane != 0)
            {
                currentLane--;
			}
            break;
	}
}

function handleMouseMove(event)
{
    var tx = -1 + (event.clientX / WIDTH) * 2;
    var ty = 1 - (event.clientY / HEIGHT) * 2;
    mousePos = {x:tx, y:ty};
}

function createScene()
{
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    scene = new THREE.Scene();

    scene.fog = new THREE.Fog(0xf7d9aa, 10, 950);

    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearPlane = 1;
    farPlane = 1000;
    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );

    camera.position.x = 0;
    camera.position.z = 200;
    camera.position.y = 100;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;

    container = document.getElementById('world');
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', handleWindowResize, false);
}

function handleWindowResize()
{
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize( WIDTH, HEIGHT );
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

function createLights()
{
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);

    shadowLight = new THREE.DirectionalLight(0xffffff, .9);
    shadowLight.position.set(150, 350, 350);
    shadowLight.castShadow = true;

    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;

    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;

    scene.add(hemisphereLight);
    scene.add(shadowLight);
}

function createCar()
{
    car = new Car();
    car.mesh.scale.set(0.5, 0.5, 0.5);
    car.mesh.position.y = 50;
    car.mesh.rotation.y = Math.PI;

    scene.add(car.mesh);
}

function createGround()
{
    ground = new Ground();
    scene.add(ground.mesh);
    ground.mesh.position.y = 38;
    ground.mesh.rotation.x = -Math.PI/2;
}

function createTrees()
{
    for(var i = 0; i < 20; i++)
    {
        var max = 250;
        var min = -250;

        var tree = new Tree();
        scene.add(tree.mesh);
        tree.mesh.position.x = Math.floor(Math.random() * (max - min + 1)) + min;
        tree.mesh.position.y = 35;
        tree.mesh.position.z = Math.floor(Math.random() * -700);

        if(tree.mesh.position.x > 0)
        {
            tree.mesh.position.x += 100;
        }
        else
        {
            tree.mesh.position.x -= 100;
        }

        trees.push(tree);
    }
}

function createSky()
{
    for(var i = 0; i < 10; i++)
    {
        var max = 400;
        var min = -400;

        var cloud = new Cloud();
        scene.add(cloud.mesh);
        cloud.mesh.position.x = Math.floor(Math.random() * (max - min + 1)) + min;
        cloud.mesh.position.y = 250;
        cloud.mesh.position.z = Math.floor(Math.random() * -700);

        clouds.push(cloud);
    }
}

function loop()
{
    trees.forEach(function (tree) {
        tree.mesh.position.z += speed;

        if(tree.mesh.position.z > 200)
            tree.mesh.position.z = -700;
    });

    clouds.forEach(function (cloud) {
        cloud.mesh.position.z += speed/2;

        if(cloud.mesh.position.z > 400)
            cloud.mesh.position.z = -700;
    });

    carLevel += 0.16;

    car.mesh.position.y = 51.75 + Math.cos(carLevel) * 0.25;
    car.mesh.position.x = normalize(mousePos.x, -1, 1, -75, 75);
    //car.mesh.position.x = lanes[currentLane];

    car.pilot.updateHairs();

    if(stats)
        stats.update();

    renderer.render(scene, camera);

    requestAnimationFrame(loop);
}

function normalize(v, vmin, vmax, tmin, tmax)
{
    var nv = Math.max(Math.min(v, vmax), vmin);
    var dv = vmax - vmin;
    var pc = (nv - vmin)/dv;
    var dt = tmax - tmin;
    var tv = tmin + (pc * dt);
    return tv;
}
