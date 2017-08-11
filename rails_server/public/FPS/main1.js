const canvas = document.querySelector('#canvas')

const engine = new BABYLON.Engine(canvas, true);
engine.isPointerLock = true;
window.addEventListener('resize', () => engine.resize());
BABYLON.Tools.RegisterTopRootEvents([
    {
        name: "keydown",
        handler: onKeyDown
    }, {
        name: "keyup",
        handler: onKeyUp
    }, {
        name: "click",
        handler: pickCurrentTarget
    }
]);
const scene = createScene();
const camera = makeCamera()

function createScene() {
    const scene = new BABYLON.Scene(engine);

    const light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(0, 1, 0), scene);
    light0.diffuse = new BABYLON.Color3(1, 1, 1);
    const light1 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(2, -5, -2), scene);
    light1.intensity = 0.3;

    const ground = BABYLON.Mesh.CreateBox("ground", 1000, scene);
    ground.position = new BABYLON.Vector3(0, 0, 0);
    ground.scaling.y = 0.01;

    //Wall
    const backWall = BABYLON.Mesh.CreateBox("backWall", 10, scene, false, BABYLON.Mesh.FRONTSIDE);
    backWall.position.y = 10
    backWall.position.z = -500
    backWall.scaling.x = 100
    backWall.scaling.y = 3
    backWall.scaling.z = .1

    const frontWall = BABYLON.Mesh.CreateBox("frontWall", 10, scene, false, BABYLON.Mesh.FRONTSIDE);
    frontWall.position.y = 10
    frontWall.position.z = 500
    frontWall.scaling.x = 100
    frontWall.scaling.y = 3
    frontWall.scaling.z = .1

    const leftWall = BABYLON.Mesh.CreateBox("leftWall", 10, scene, false, BABYLON.Mesh.FRONTSIDE);
    leftWall.position.y = 10
    leftWall.position.x = -500
    leftWall.scaling.x = .1
    leftWall.scaling.y = 3
    leftWall.scaling.z = 100

    const rightWall = BABYLON.Mesh.CreateBox("rightWall", 10, scene, false, BABYLON.Mesh.FRONTSIDE);
    rightWall.position.y = 10
    rightWall.position.x = 500
    rightWall.scaling.x = .1
    rightWall.scaling.y = 3
    rightWall.scaling.z = 100

    //Cannon physics
    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0,
        restitution: 0
    }, scene);

    //babylon's physics collisions
    scene.enableGravity = new BABYLON.Vector3(0, -9.81, 0);
    scene.collisionsEnabled = true;

    ground.checkCollisions = true;

    backWall.checkCollisions = true;
    frontWall.checkCollisions = true;
    leftWall.checkCollisions = true;
    rightWall.checkCollisions = true;

    backWall.physicsImpostor = new BABYLON.PhysicsImpostor(backWall, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0,
        restitution: 0
    }, scene);
    frontWall.physicsImpostor = new BABYLON.PhysicsImpostor(frontWall, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0,
        restitution: 0
    }, scene);
    leftWall.physicsImpostor = new BABYLON.PhysicsImpostor(leftWall, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0,
        restitution: 0
    }, scene);
    rightWall.physicsImpostor = new BABYLON.PhysicsImpostor(rightWall, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0,
        restitution: 0
    }, scene);
    for (let i = 0; i < 400; i++) {
        makeBuilding(scene);
    }
    return scene;
}

function makeCamera() {
    const camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 3, -20), scene);
    //for map dev
    camera.position.y = 325
    camera.position.z = -350
    camera.setTarget(BABYLON.Vector3.Zero());

    camera.angularSensibility = 1500
    // camera.applyGravity = true;
    camera.ellipsoid = new BABYLON.Vector3(2, 2, 2);
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
    //you can jump through ceilings though. There's a method called .moveWithCollisions that's used to move the camera around
    //but I don't see where to integrate it here. Could do a check of "is there something within 20 units up, if so how much, only jump to that height"
    //but right now I need to keep moving.
    cam.animations = [];

    const a = new BABYLON.Animation("a", "position.y", 20, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    // Animation keys
    const keys = [];
    keys.push({frame: 0, value: cam.position.y});
    keys.push({
        frame: 10,
        value: cam.position.y + 23
    });
    keys.push({frame: 20, value: cam.position.y});
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
    if (event.keyCode === 32)
        jumpCamera(camera);
    if (event.keyCode === 57)
        endAnimation();
    }

function makeBuilding(scene) {
    //adapted from http://pixelcodr.com/tutos/plane/plane.html
    const randomX = Math.random() * -1000 + 500
    const randomZ = Math.random() * -1000 + 500
    const randomSize = Math.random() * 8 + 2

    const building = BABYLON.Mesh.CreateBox('building', randomSize, scene);

    building.scaling.x = Math.random() * 2 + .5
    building.scaling.y = Math.random() * 4 + 4
    building.scaling.z = Math.random() + 2

    building.position.x = randomX;
    building.position.z = randomZ;
    building.position.y = randomSize * (building.scaling.y / 2)

    building.checkCollisions = true
}

function pickCurrentTarget() {
    //this guy is my hero
    //http://www.html5gamedevs.com/topic/18591-interaction-with-meshes-while-the-pointer-is-locked/
    //http://www.babylonjs-playground.com/#1WIOXI
    if (camera.ammo > 0) {
        const ray = new BABYLON.Ray(camera.position, camera.getTarget().subtract(camera.position));
        const pickInfo = scene.pickWithRay(ray, function(mesh) {
            return mesh
        });
        camera.ammo -= 1;
        document.querySelector("#ammoLabel").innerHTML = "AMMO : " + camera.ammo;
        // Bullet creation from http://www.html5gamedevs.com/topic/10702-how-to-set-the-direction-for-bullets/
        //http://www.babylonjs-playground.com/#VWXHP#3
        const bullet = BABYLON.Mesh.CreateSphere('bullet', 3, 0.3, scene);
        const startPos = camera.position;

        bullet.position = new BABYLON.Vector3(startPos.x, startPos.y, startPos.z);
        bullet.material = new BABYLON.StandardMaterial('texture1', scene);
        bullet.material.diffuseColor = new BABYLON.Color3(0, 0, 0);

        const invView = new BABYLON.Matrix();
        camera.getViewMatrix().invertToRef(invView);
        const direction = BABYLON.Vector3.TransformNormal(new BABYLON.Vector3(0, 0, 1), invView);

        direction.normalize();

        scene.registerBeforeRender(function() {
            bullet.position.addInPlace(direction);
        });

        if (pickInfo.hit) {
            let x = camera.getTarget().subtract(camera.position).x * 1000000
            let y = camera.getTarget().subtract(camera.position).y * 1000000
            let z = camera.getTarget().subtract(camera.position).z * 1000000
            pickInfo.pickedMesh.applyImpulse(new BABYLON.Vector3(x, y, z), pickInfo.pickedMesh.getAbsolutePosition());
        }
    }
}

function makeEnemies(scene) {

}

engine.runRenderLoop(() => {
    scene.render();
});