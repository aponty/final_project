/**
Built with some adaptations (I don't like prototypical inheritance)
following a tutorial at http://pixelcodr.com/tutos/plane/plane.html

Tutorial creator is Julian Chenard, part of Babylon's dev team;
all things considered, his work taught me how to use this library
*/
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

    const hLight = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 0.5, 0), scene);
    hLight.intensity = 0.6;

    const dirLight = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(0, -0.5, 0.5), scene);
    dirLight.position = new BABYLON.Vector3(0.1, 100, -100);
    dirLight.intensity = 0.4;
    dirLight.diffuse = BABYLON.Color3.FromInts(204, 196, 255);

    ground = BABYLON.Mesh.CreateGround('ground', 800, 2000, 2, scene);

    return scene
}

function makeShip(size, scene) {
    const ship = new BABYLON.Mesh.CreateBox('ship', 1, scene);
    ship.killed = false;
    ship.ammo = 30;

    ship.position.x = 0;
    ship.position.z = 0;
    ship.position.y = size / 2;

    ship.speed = 5;
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
    }, {
        name: "ammoUpdated",
        handler: updateAmmoLabel
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

    //if ammo > 1
    const condition = new BABYLON.ValueCondition(building.actionManager, ship, "ammo", 0, BABYLON.ValueCondition.IsGreater);

    const onpickAction = new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPickTrigger,
        function(evt) {
            if (evt.meshUnderPointer) {
                const meshClicked = evt.meshUnderPointer;
                meshClicked.dispose();
                ship.ammo -= 1;
                sendEvent();
            }
        },
        condition);

    building.actionManager.registerAction(onpickAction);
}

function updateAmmoLabel() {
    document.querySelector("#ammoLabel").innerHTML = "AMMO : "+ship.ammo;
};

function sendEvent() {
    const event = new Event('ammoUpdated');
    window.dispatchEvent(event);
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
