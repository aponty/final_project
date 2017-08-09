let ground, buildings = []
const canvas = document.querySelector('#canvas')
const engine = new BABYLON.Engine(canvas, true);
window.addEventListener('resize', () => engine.resize());
BABYLON.Tools.RegisterTopRootEvents([
    {
        name: "keydown",
        handler: onKeyDown
    }, {
        name: "keyup",
        handler: onKeyUp
    }, {
        name: "ammoUpdated",
        handler: updateAmmoLabel
    }
]);
const scene = createScene();
const camera = makeCamera()


function createScene() {
    const scene = new BABYLON.Scene(engine);

    scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    scene.fogDensity = 0.01;

    const light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(0, 1, 0), scene);
    light0.diffuse = new BABYLON.Color3(1, 1, 1);
    const light1 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(2, -5, -2), scene);
    light1.intensity = 0.3;

    ground = BABYLON.Mesh.CreateBox("ground", 400, scene);
    ground.position = new BABYLON.Vector3(0, 0, 0);
    ground.scaling.y = 0.01;

    //Wall
    const backWall = BABYLON.Mesh.CreateBox("backWall", 20, scene, false, BABYLON.Mesh.FRONTSIDE);
    backWall.position.y = 10
    backWall.position.z = -200
    backWall.scaling.x = 20
    backWall.scaling.y = 3
    backWall.scaling.z = .1

    const frontWall = BABYLON.Mesh.CreateBox("frontWall", 20, scene, false, BABYLON.Mesh.FRONTSIDE);
    frontWall.position.y = 10
    frontWall.position.z = 200
    frontWall.scaling.x = 20
    frontWall.scaling.y = 3
    frontWall.scaling.z = .1

    const leftWall = BABYLON.Mesh.CreateBox("leftWall", 20, scene, false, BABYLON.Mesh.FRONTSIDE);
    leftWall.position.y = 10
    leftWall.position.x = -200
    leftWall.scaling.x = .1
    leftWall.scaling.y = 3
    leftWall.scaling.z = 20

    const rightWall = BABYLON.Mesh.CreateBox("rightWall", 20, scene, false, BABYLON.Mesh.FRONTSIDE);
    rightWall.position.y = 10
    rightWall.position.x = 200
    rightWall.position.z = -10
    rightWall.scaling.x = .1
    rightWall.scaling.y = 3
    rightWall.scaling.z = 19

    //Cannon physics
    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, scene);

    //babylon's physics collisions
    scene.enableGravity = new BABYLON.Vector3(0, -9.81, 0);
    scene.collisionsEnabled = true;

    ground.checkCollisions = true;
    backWall.checkCollisions = true;
    frontWall.checkCollisions = true;
    leftWall.checkCollisions = true;
    rightWall.checkCollisions = true;

    return scene;
}

function makeCamera() {
    const camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 2, -20), scene);
    //for map dev
    // camera.position.y = 325
    // camera.position.z = -350
    // camera.setTarget(BABYLON.Vector3.Zero());

    camera.applyGravity = true;
    camera.attachControl(canvas, true);
    camera.checkCollisions = true;
    camera._needMoveForGravity = true;
    camera.ammo = 30;
    return camera
}

function jumpCamera(cam) {
    //had lots of issues with this. Ended up using code from iiceman's example here-
    //thread: http://www.html5gamedevs.com/topic/12198-camera-jump/
    //code: http://www.babylonjs-playground.com/#XN87O%232
    cam.animations = [];

    const a = new BABYLON.Animation(
        "a",
        "position.y", 20,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    // Animation keys
    const keys = [];
    keys.push({ frame: 0, value: cam.position.y });
    keys.push({ frame: 10, value: cam.position.y + 19 });
    keys.push({ frame: 20, value: cam.position.y });
    a.setKeys(keys);

    const easingFunction = new BABYLON.CircleEase();
    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    a.setEasingFunction(easingFunction);
    cam.animations.push(a);
    scene.beginAnimation(cam, 0, 20, false);
}

function onKeyDown(event) {
    // if (event.keyCode === 32) camera.jump = true
}

function onKeyUp(event) {
    if (event.keyCode === 32) jumpCamera(camera)
    if (event.keyCode === 65) endAnimation();
}

function makeBuilding () {
    //adapted from http://pixelcodr.com/tutos/plane/plane.html
    const randomX = Math.random() * -400 + 200
    const randomZ = Math.random() * -400 + 200
    const randomSize = Math.random() * 8 + 2

    const building = BABYLON.Mesh.CreateBox('building', randomSize, scene);

    building.scaling.x = Math.random() * 2 + .5
    building.scaling.y = Math.random() * 4 + 4
    building.scaling.z = Math.random() + 2

    building.position.x = randomX;
    building.position.z = randomZ;
    building.position.y = randomSize * (building.scaling.y/2)

    building.checkCollisions = true
    buildings.push(building)
    building.physicsImpostor = new BABYLON.PhysicsImpostor(building, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 100000, restitution: 0 }, scene);

    building.actionManager = new BABYLON.ActionManager(scene);
    const condition = new BABYLON.ValueCondition(building.actionManager, camera, "ammo", 0, BABYLON.ValueCondition.IsGreater);

    const onpickAction = new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPickTrigger,
        function(evt) {
            if (evt.meshUnderPointer) {
                const meshClicked = evt.meshUnderPointer;
                console.log(camera.getTarget().subtract(camera.position))
                building.applyImpulse(new BABYLON.Vector3(0, 0, 2000000), building.getAbsolutePosition());
                // meshClicked.dispose();
                camera.ammo -= 1;
                sendEvent();
            }
        },
        condition);
    building.actionManager.registerAction(onpickAction);

}

function updateAmmoLabel() {
    document.querySelector("#ammoLabel").innerHTML = "AMMO : "+ camera.ammo;
};

function sendEvent() {
    const event = new Event('ammoUpdated');
    window.dispatchEvent(event);
}

for(let i = 0; i < 100; i++) {
    makeBuilding();
}

engine.runRenderLoop(() => {
    scene.render();
});

function endAnimation() {
    camera.applyGravity = false;
    camera.position.y = 325
    camera.position.z = -350
    camera.setTarget(BABYLON.Vector3.Zero());
    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, scene);
    buildings.forEach(building => {
        building.position.y = 0
        building.physicsImpostor = new BABYLON.PhysicsImpostor(building, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 100000, restitution: 0 }, scene)
    })
}
