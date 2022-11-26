var mtlLoader;
var mtlLoader2;
var OriginMaterial;

// Vars for modelwier
var RootDiv, model, loader, clickedpart;
var autorotateTimeout = 1500;
var raycaster = new THREE.Raycaster(), INTERSECTED;
var mouse = new THREE.Vector2();
var camera, controls, scene, renderer;
var lighting, ambient, keyLight, fillLight, backLight;
var clicktimer, webadress;

function setLight(lighting)
{
    if (lighting) {

    ambient.intensity = 0.25;
    scene.add(keyLight);
    scene.add(fillLight);
    scene.add(backLight);

    } else {

    ambient.intensity = 1.0;
    scene.remove(keyLight);
    scene.remove(fillLight);
    scene.remove(backLight);

    }
}
function initModel() 
{
    
    $("#RootDiv").text('Peka på modellen, var du har haft mest problem under din sjukdomsperiod.');
 
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    /* Camera */

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 25;
    camera.position.y = 5;
    camera.position.x = 0;

    /* Scene */

    scene = new THREE.Scene();
    lighting = true;


    ambient = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambient);

    keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
    keyLight.position.set(-100, 0, 100);

    fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
    fillLight.position.set(100, 0, 100);

    backLight = new THREE.DirectionalLight(0xffffff, 1.0);
    backLight.position.set(100, 0, -100).normalize();

    
    

    /* Model */

    mtlLoader = new THREE.MTLLoader();
    mtlLoader.setBaseUrl('assets/');
    mtlLoader.setPath('assets/');
    mtlLoader.load('Skin.mtl', function (materials) 
    {

        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        
        objLoader.setPath('assets/');
        objLoader.load('Male.obj', function (object) 
        {
            object.castShadow = true;
            object.receiveShadow = false;
            model = object;
            scene.add(object);
            setLight(lighting);

        });

    });

   

    /* Renderer */

    renderer = new THREE.WebGLRenderer(
        { 
            alpha: true
        }
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color( 0xf2f2f2 ),0.9);
    RootDiv = document.getElementById('ModelDiv');
    RootDiv.appendChild(renderer.domElement);

    /* Controls */

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.autoRotate = true;

    // stop autorotate after the first interaction
    controls.addEventListener('start', function(){
    clearTimeout(autorotateTimeout);
    controls.autoRotate = false;
    });

    // restart autorotate after the last interaction & an idle time has passed
    this.controls.addEventListener('end', function(){
    autorotateTimeout = setTimeout(function(){
        controls.autoRotate = true;
    }, 3000);
    });

    /* Events */

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('keydown', onKeyboardEvent, false);

}
function onDocumentMouseDown(event) 
{
    clicktimer = new Date().getTime();
};
function onDocumentMouseUp(event) 
{
    var now = new Date().getTime();
    if(now-clicktimer < 300)
    {
        event.preventDefault();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(model.children);
        if (intersects.length > 0) 
        {
            var mat = new THREE.MeshPhongMaterial();
        
            mat.transparent = false;
            mat.side = THREE.DoubleSide;
            mat.depthWrite = true;
            mat.color = new THREE.Color(0xff0000);
            mat.name = "highligt";
            
            // var oldMaterial
            OriginMaterial = intersects[0].object.material.clone();
            Answers.lokalisering = BodyMap({id:intersects[0].object.name.split('.')[1]}).get()[0].bodypart;
           
            console.log('Du uppger att du har mest problem ' +BodyMap({id:intersects[0].object.name.split('.')[1]}).get()[0].anatomi);
            if(intersects[0].object.material.name != "highligt")
            {
                intersects[0].object.material = mat;
            }
            else
            {
                intersects[0].object.material = OriginMaterial;
            }

           
            
            CurrentState.Substate = States.Assesment;
     
            // var interval_1 = setInterval(function(){
            //     camera.position.z = camera.position.z + 1;
            //     camera.position.x = camera.position.x +1;   
            //     if(camera.position.z > 60)
            //     {
            //         clearInterval(interval_1);
            //     }
            // },20);
            // document.getElementById('ModelDiv1').style.left ="5px";

            // document.getElementById('ModelDiv1').style.top ="5px";
            // document.getElementById('ModelDiv1').innerText = 'Du uppger att du har mest problem ' + selectedBodyPart.anatomi;
            //console.log(intersects[0].object.name);
        }

  

    }
};
function onWindowResize() 
{

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}
function onKeyboardEvent(e) 
{

    if (e.code === 'KeyL') {

        lighting = !lighting;
        setLight(lighting);

    }

}
function animate() 
{

    requestAnimationFrame(animate);
    controls.update();
    render();

}
function render() 
{
    renderer.render(scene, camera);
}