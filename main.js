const canvas = document.querySelector('#canvas')
const engine = new BABYLON.Engine(canvas, true);
window.addEventListener('resize', () => engine.resize());
const scene = createSceneLightGravity();

const camera = makeCamera()

function createSceneLightGravity() {
    const scene = new BABYLON.Scene(engine);

    const light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(0, 1, 0), scene);
    light0.diffuse = new BABYLON.Color3(1, 1, 1);
    const light1 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(2, -5, -2), scene);
    light1.intensity = 0.3;

    const ground = BABYLON.Mesh.CreateBox("ground", 200, scene);
    ground.position = new BABYLON.Vector3(0, 0, 0);
    ground.scaling.y = 0.01;

    //boxes. This should be a function.
    const box = BABYLON.Mesh.CreateBox("box", 1, scene);
    box.position = new BABYLON.Vector3(5, 1, -10);
    box.actionManager = new BABYLON.ActionManager(scene);
    const action = new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickTrigger, box, "visibility", 0.2, 1000);
    box.actionManager.registerAction(action)

    //Wall
    const wall = BABYLON.Mesh.CreateBox("wall", 20, scene, false, BABYLON.Mesh.FRONTSIDE);
    wall.position.y = 10
    wall.position.z = 100
    wall.scaling.x = 10
    wall.scaling.y = 3
    wall.scaling.z = .1

    //Cannon physics
    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, scene);
    wall.physicsImpostor = new BABYLON.PhysicsImpostor(wall, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, scene);
    box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, scene);

    //babylon's physics collisions
    scene.enableGravity = new BABYLON.Vector3(0, -9.81, 0);
    scene.collisionsEnabled = true;

    ground.checkCollisions = true;
    box.checkCollisions = true;
    wall.checkCollisions = true;

    return scene;
}

function makeCamera() {
    const camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 2, -20), scene);
    camera.attachControl(canvas, true);
    camera.applyGravity = true;
    camera.checkCollisions = true;
    camera._needMoveForGravity = true;
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
    keys.push({ frame: 10, value: cam.position.y + 20 });
    keys.push({ frame: 20, value: cam.position.y });
    a.setKeys(keys);

    const easingFunction = new BABYLON.CircleEase();
    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    a.setEasingFunction(easingFunction);

    cam.animations.push(a);

    scene.beginAnimation(cam, 0, 20, false);
}

BABYLON.Tools.RegisterTopRootEvents([
    {
        name: "keydown",
        handler: onKeyDown
    }, {
        name: "keyup",
        handler: onKeyUp
    }
]);

function onKeyDown(event) {
    // if (event.keyCode === 32) camera.jump = true
}

function onKeyUp(event) {
    if (event.keyCode === 32) jumpCamera(camera)
}

function randomNumber (min, max) {
    if (min === max) {
        return min;
    }
    let random = Math.random();
    return ((random * (max - min)) + min );
}

function makeBuilding () {
    //adapted from http://pixelcodr.com/tutos/plane/plane.html
    const minZ = camera.position.z + 100;
    const maxZ = camera.position.z + 100
    const minX = camera.position.x - 100;
    const maxX = camera.position.x + 100;
    const minSize = 2;
    const maxSize = 10;

    const randomX = randomNumber(minX, maxX);
    const randomZ = randomNumber(minZ, maxZ);
    const randomSize = randomNumber(minSize, maxSize);

    const building = BABYLON.Mesh.CreateBox('building', randomSize, scene);

    building.scaling.x = randomNumber(0.5, 1.5);
    building.scaling.y = randomNumber(4, 8);
    building.scaling.z = randomNumber(2, 3);

    building.position.x = randomX;
    building.position.y = 0 ;
    building.position.z = randomZ;

    building.checkCollisions = true
}
for(let i = 0; i < 100; i++) {
    makeBuilding();
}

engine.runRenderLoop(() => {
    scene.render();
});
