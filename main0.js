const canvas = document.querySelector('#canvas')
const engine = new BABYLON.Engine(canvas, true);
window.addEventListener('resize', () => engine.resize());
const scene = createScene();
const ship = makeShip(2, scene)

var camera,
    ground;

function createScene() {
    const scene = new BABYLON.Scene(engine);

    camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 5, -30), scene);
    camera.setTarget(new BABYLON.Vector3(0, 0, 20));
    camera.maxZ = 1000;
    camera.speed = 4
    // camera.attachControl(canvas, true);

    const hLight = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 0.5, 0), scene);
    hLight.intensity = 0.6;

    var dirLight = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(0, -0.5, 0.5), scene);
    dirLight.position = new BABYLON.Vector3(0.1, 100, -100);
    dirLight.intensity = 0.4;
    dirLight.diffuse = BABYLON.Color3.FromInts(204, 196, 255);

    ground = BABYLON.Mesh.CreateGround('ground', 800, 2000, 2, scene);


    return scene
}

function makeShip(size, scene) {
    const ship = new BABYLON.Mesh.CreateBox('ship', 1, scene);
    ship.killed = false;
    ship.ammo = 3;

    ship.position.x = 0;
    ship.position.z = 0;
    ship.position.y = size / 2;

    ship.speed = 3;
    ship.moveLeft = false;
    ship.moveRight = false;

    ship.move = () => {
        if (ship.moveRight) {
            ship.position.x += .5;
            camera.position.x += .5;
        }
        if (ship.moveLeft) {
            ship.position.x -= .5;
            camera.position.x -= .5;
        }
    }
    return ship;
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

function onKeyDown(e) {
    if (e.keyCode === 65) {
        ship.moveLeft = true;
        ship.moveRight = false;
    }
    if (e.keyCode === 68) {
        ship.moveRight = true;
        ship.moveLeft = false;
    }
}

function onKeyUp(e) {
    ship.moveLeft = false;
    ship.moveRight = false;
}

function randomNumber (min, max) {
    if (min === max) {
        return min;
    }
    let random = Math.random();
    return ((random * (max - min)) + min );
}

function makeBuilding () {
    const minZ = camera.position.z + 500;
    const maxZ = camera.position.z + 1500;
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
    building.position.y = building.scaling.y/2 ;
    building.position.z = randomZ;

    building.actionManager = new BABYLON.ActionManager(scene);
    const trigger = { trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: ship };
    const killShip = new BABYLON.SwitchBooleanAction(trigger, ship, 'killed');
    building.actionManager.registerAction(killShip);
}


setInterval(makeBuilding, 100);

















engine.runRenderLoop(() => {
    if (!ship.killed) {
        ship.move();

        camera.position.z += ship.speed;
        ship.position.z += ship.speed;
        ground.position.z += ship.speed;
    }

    scene.render();
})
