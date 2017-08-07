const canvas = document.querySelector('#canvas')
const engine = new BABYLON.Engine(canvas, true);

const createScene = () => {

    var scene = new BABYLON.Scene(engine);
    //Set gravity for the scene (G force like, on Y-axis)
    scene.gravity = new BABYLON.Vector3(0, -0.9, 0);
    // Enable Collisions
    scene.collisionsEnabled = true;

    // Lights
    var light0 = new BABYLON.DirectionalLight("Omni", new BABYLON.Vector3(-2, -5, 2), scene);
    // var light1 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(2, -5, -2), scene);


    var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, -8, -10), scene);
    camera.attachControl(canvas, true);
    //Then apply collisions and gravity to the active camera
    camera.checkCollisions = true;
    camera.applyGravity = true;

    //Ground
    var ground = BABYLON.Mesh.CreatePlane("ground", 120, scene);
    //  ground.material = new BABYLON.StandardMaterial("groundMat", scene);
    //  ground.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
    //  ground.material.backFaceCulling = false;
    ground.position = new BABYLON.Vector3(5, -10, -15);
    ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);

    //Simple crate
    var box = BABYLON.Mesh.CreateBox("crate", 2, scene);
    box.position = new BABYLON.Vector3(5, -9, -10);

    var box2 = BABYLON.Mesh.CreateBox("crate", 2, scene);
    box2.position = new BABYLON.Vector3(4, -10, -10);

    var box3 = BABYLON.Mesh.CreateBox("crate", 2, scene);
    box3.position = new BABYLON.Vector3(4, -11, -10);

    // Impact impostor
    var impact = BABYLON.Mesh.CreatePlane("impact", 1, scene);
    impact.material = new BABYLON.StandardMaterial("impactMat", scene);
    impact.material.diffuseTexture = new BABYLON.Texture("textures/impact.png", scene);
    // impact.material.diffuseTexture.hasAlpha = true;
    impact.position = new BABYLON.Vector3(0, 0, -0.1);

    //Wall
    var wall = BABYLON.Mesh.CreatePlane("wall", 20.0, scene);
    // wall.material = new BABYLON.StandardMaterial("wallMat", scene);
    // wall.material.emissiveColor = new BABYLON.Color3(0.5, 1, 0.5);

    //When pointer down event is raised
    scene.onPointerDown = function(evt, pickResult) {
        // if the click hits the ground object, we change the impact position
        if (pickResult.hit) {
            impact.position.x = pickResult.pickedPoint.x;
            impact.position.y = pickResult.pickedPoint.y;
        }
    };

    //Set the ellipsoid around the camera (e.g. your player's size)
    camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);

    //finally, say which mesh will be collisionable
    ground.checkCollisions = true;
    box.checkCollisions = true;

    return scene;
}

const scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
});


window.addEventListener('resize', () => engine.resize());
