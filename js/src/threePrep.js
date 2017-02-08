var scene, camera, renderer, boxMesh, light1, planeMesh;
var stats;
var control;

window.onload = function()
{
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.set(15, 16, 13);
    camera.lookAt(scene.position);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x2d2d2d);
    document.body.appendChild(renderer.domElement);

    var boxGeometry = new THREE.BoxGeometry(10 * Math.random(), 10 * Math.random(), 10 * Math.random());
    var boxMaterial = new THREE.MeshNormalMaterial();
    //var boxMaterial = new THREE.MeshLambertMaterial({color: 0xfd59d7});
    boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    scene.add(boxMesh);
    boxMesh.position.y = 3;

    var planeGeometry = new THREE.PlaneGeometry(10, 10, 20, 20);
    var planeMaterial = new THREE.MeshBasicMaterial({wireframe: true});
    planeMesh = new THREE.Mesh( planeGeometry, planeMaterial );
    scene.add( planeMesh );
    planeMesh.rotation.x = -Math.PI/2;

    light1 = new THREE.PointLight(0xFFFF00);
    light1.position.set(10, 0, 25);
    scene.add(light1);

    render();

    stats = createStats();
    document.body.appendChild( stats.domElement );

    control = new function()
    {
        this.rotationSpeed = 0.005;
    };

    addControls(control);

    setupKeyControls();

    loadTexture();
};

setupKeyControls = function ()
{
    document.onkeydown = function(e)
    {
        switch (e.keyCode)
        {
            case 37:
                boxMesh.rotation.x += 0.1;
                break;
            case 38:
                boxMesh.rotation.z -= 0.1;
                break;
            case 39:
                boxMesh.rotation.x -= 0.1;
                break;
            case 40:
                boxMesh.rotation.z += 0.1;
                break;
        }
    };
};

addControls = function (controlObject)
{
    var gui = new dat.GUI();
    gui.add(controlObject, 'rotationSpeed', -0.1, 0.1);
};

createStats = function()
{
    var tempStats = new Stats();
    tempStats.setMode(0);

    tempStats.domElement.style.position = 'absolute';
    tempStats.domElement.style.left = '0';
    tempStats.domElement.style.top = '0';

    return tempStats;
};

render = function()
{
    /*
    if(control)
    {
        boxMesh.rotation.x += control.rotationSpeed;
        boxMesh.rotation.y += control.rotationSpeed;
    }
    */

    requestAnimationFrame(render);
    renderer.render(scene, camera);

    if(stats)
        stats.update();
};

onLoadCallback = function (loaded)
{
    if (loaded.length)
    {
        console.log("Loaded", loaded.length);
    }
    else
    {
        console.log("Loaded", loaded);
    }
};

onProgressCallback = function (progress) 
{
    console.log("Progress", progress);
};

onErrorCallback = function (error) 
{
    console.log("Error", error)
};

loadTexture = function ()
{
    var texture = THREE.TextureLoader("assets/ground.jpg", null, onLoadCallback, onErrorCallback);
    console.log("texture after loadTexture call", texture);
}
